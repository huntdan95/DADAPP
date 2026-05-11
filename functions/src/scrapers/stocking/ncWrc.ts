import * as cheerio from 'cheerio';
import { logger } from 'firebase-functions';
import { fetchHtml } from './fetch';
import type { StockingScrapeRecord } from './types';

/**
 * NC Wildlife Resources Commission — mountain trout stocking.
 *
 * Source: https://www.ncwildlife.gov/Fishing/Trout-Fishing/Trout-Stocking-Schedule
 *
 * NC publishes the upcoming weeks as an HTML table. Columns observed:
 * Date | Water | County | Species | Number Stocked. Sometimes "TBD"
 * appears in the count column — we drop the count when non-numeric.
 */

const URL =
  'https://www.ncwildlife.gov/Fishing/Trout-Fishing/Trout-Stocking-Schedule';

// "Week of MM/DD/YYYY" or just "MM/DD/YYYY" — handle both.
const DATE_RE = /(\d{1,2})\/(\d{1,2})\/(\d{2,4})/;

export async function scrape(): Promise<StockingScrapeRecord[]> {
  let html: string;
  try {
    html = await fetchHtml(URL);
  } catch (e) {
    logger.warn('ncWrc.fetch.failed', { url: URL, error: String(e) });
    return [];
  }
  const $ = cheerio.load(html);

  const records: StockingScrapeRecord[] = [];

  $('table').each((_, tbl) => {
    $(tbl)
      .find('tr')
      .each((_i, tr) => {
        const cells = $(tr)
          .find('td')
          .map((_j, td) => $(td).text().trim())
          .get();
        if (cells.length < 2) return;
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

        if (!water) return;

        records.push({
          date: isoDate,
          locationName: `${water}${county ? ` (${county} Co.)` : ''}`,
          state: 'NC',
          species: normalizeSpecies(speciesRaw),
          count: parseCount(countRaw),
          notes: 'NC WRC stocking schedule',
        });
      });
  });

  if (records.length === 0) {
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 240);
    logger.warn('ncWrc.parse.empty', { url: URL, bodySnippet: bodyText });
  }
  logger.info('ncWrc.scrape', { count: records.length });
  return records;
}

function parseCount(raw: string): number | undefined {
  const cleaned = raw.replace(/[,\s]/g, '');
  if (!cleaned || cleaned.toLowerCase() === 'tbd') return undefined;
  const n = Number(cleaned);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function normalizeSpecies(raw: string): string {
  const t = raw.trim().toLowerCase();
  if (t.includes('rainbow')) return 'Rainbow trout';
  if (t.includes('brown')) return 'Brown trout';
  if (t.includes('brook')) return 'Brook trout';
  if (!t) return 'Rainbow trout';
  return raw
    .trim()
    .split(/\s+/)
    .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}
