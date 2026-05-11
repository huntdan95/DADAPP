import * as cheerio from 'cheerio';
import { logger } from 'firebase-functions';
import { fetchHtml } from './fetch';
import type { StockingScrapeRecord } from './types';

/**
 * TWRA — Tennessee Wildlife Resources Agency trout stocking.
 *
 * Source: https://www.tn.gov/twra/fishing/trout-stocking.html
 *
 * TWRA publishes a weekly stocking schedule (Mar–Aug primary season)
 * as a paginated table. Each row has: date, water, county, species
 * (always rainbow trout in practice), and count.
 *
 * Known fragility: TWRA periodically restructures their page. The
 * selector logic below targets `<table>` rows with date-shaped first
 * cells, which has been the stable invariant across at least three
 * page redesigns. When/if it breaks, log a sample line and adjust.
 */

// Primary published URL. TWRA also publishes the schedule as a PDF
// some weeks — we fall through to a second URL below if the HTML page
// has no parseable rows.
const URL = 'https://www.tn.gov/twra/fishing/trout-stocking.html';
const FALLBACK_URLS = [
  'https://www.tn.gov/twra/fishing/trout-fishing.html',
];

const DATE_RE = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/;

export async function scrape(): Promise<StockingScrapeRecord[]> {
  const records = await tryScrape(URL);
  if (records.length > 0) return records;

  // Empty parse: try fallback URLs in case TWRA moved the schedule.
  for (const fallbackUrl of FALLBACK_URLS) {
    const more = await tryScrape(fallbackUrl).catch(() => []);
    if (more.length > 0) {
      logger.info('twra.scrape.fallback-hit', { url: fallbackUrl });
      return more;
    }
  }
  return records;
}

async function tryScrape(url: string): Promise<StockingScrapeRecord[]> {
  let html: string;
  try {
    html = await fetchHtml(url);
  } catch (e) {
    logger.warn('twra.fetch.failed', { url, error: String(e) });
    return [];
  }
  const $ = cheerio.load(html);

  const records = parseRows($);

  // Diagnostic: if we got zero rows, log a short snippet of the page so
  // we can tell whether the page loaded (just structured differently)
  // or returned a redirect / error page entirely.
  if (records.length === 0) {
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 240);
    logger.warn('twra.parse.empty', { url, bodySnippet: bodyText });
  }

  return records;
}

function parseRows($: cheerio.CheerioAPI): StockingScrapeRecord[] {
  const records: StockingScrapeRecord[] = [];

  $('table').each((_, tbl) => {
    $(tbl)
      .find('tr')
      .each((_i, tr) => {
        const cells = $(tr)
          .find('td')
          .map((_j, td) => $(td).text().trim())
          .get();
        if (cells.length < 3) return;
        const dateRaw = cells[0];
        const m = dateRaw.match(DATE_RE);
        if (!m) return;

        const [, mo, d, yRaw] = m;
        const year = yRaw.length === 2 ? `20${yRaw}` : yRaw;
        const isoDate = `${year}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;

        const water = cells[1] ?? '';
        const county = cells[2] ?? '';
        const speciesRaw = cells[3] ?? 'Rainbow trout';
        const countRaw = cells[4] ?? '';

        const count = parseCount(countRaw);
        const species = normalizeSpecies(speciesRaw);

        if (!water) return;

        records.push({
          date: isoDate,
          locationName: `${water}${county ? ` (${county} Co.)` : ''}`,
          state: 'TN',
          species,
          count,
          notes: 'TWRA weekly schedule',
        });
      });
  });

  return records;
}

function parseCount(raw: string): number | undefined {
  const cleaned = raw.replace(/[,\s]/g, '');
  if (!cleaned) return undefined;
  const n = Number(cleaned);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function normalizeSpecies(raw: string): string {
  const t = raw.trim().toLowerCase();
  if (t.includes('rainbow')) return 'Rainbow trout';
  if (t.includes('brown')) return 'Brown trout';
  if (t.includes('brook')) return 'Brook trout';
  if (t.includes('walleye')) return 'Walleye';
  if (!t) return 'Rainbow trout';        // TWRA trout-stocking default
  // Title-case the raw string.
  return raw
    .trim()
    .split(/\s+/)
    .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}
