import * as cheerio from 'cheerio';
import { logger } from 'firebase-functions';
import { fetchHtml } from './fetch';
import type { StockingScrapeRecord } from './types';

/**
 * Kentucky Department of Fish & Wildlife Resources — trout + general
 * stocking schedules.
 *
 * Primary source: https://fw.ky.gov/Fish/Pages/Trout-Stocking-Schedule.aspx
 *
 * KDFWR publishes trout stocking as an HTML table grouped by week.
 * Columns observed: Date | Water | County | Species | Number.
 *
 * The page is rendered by SharePoint; structure can shift slightly
 * between rebuilds. Same defensive parsing pattern as the other
 * states — find any table with date-shaped first cells.
 */

const URLS = [
  'https://fw.ky.gov/Fish/Pages/Trout-Stocking-Schedule.aspx',
  // Fallback: KY also publishes a general (warm-water) stocking page.
  // We hit both URLs and merge — duplicates are deduped by the
  // orchestrator's stable id.
  'https://fw.ky.gov/Fish/Pages/Fish-Stocking-Reports.aspx',
];

const DATE_RE = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/;

export async function scrape(): Promise<StockingScrapeRecord[]> {
  const all: StockingScrapeRecord[] = [];

  for (const url of URLS) {
    try {
      const html = await fetchHtml(url, { timeoutMs: 25_000 });
      const records = parseTable(html);
      logger.info('kyDfwr.scrape.page', { url, count: records.length });
      all.push(...records);
    } catch (e) {
      logger.warn('kyDfwr.fetch.failed', { url, error: String(e) });
    }
  }

  logger.info('kyDfwr.scrape', { count: all.length });
  return all;
}

function parseTable(html: string): StockingScrapeRecord[] {
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
        if (cells.length < 3) return;
        const dateRaw = cells[0];
        const m = dateRaw.match(DATE_RE);
        if (!m) return;

        const [, mo, d, yRaw] = m;
        const year = yRaw.length === 2 ? `20${yRaw}` : yRaw;
        const isoDate = `${year}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;

        // Column order observed: date | water | county | species | count.
        // Fall back gracefully if a column is missing.
        const water = cells[1] ?? '';
        const county = cells[2] ?? '';
        const speciesRaw = cells[3] ?? 'Rainbow trout';
        const countRaw = cells[4] ?? '';

        if (!water) return;

        records.push({
          date: isoDate,
          locationName: `${water}${county ? ` (${county} Co.)` : ''}`,
          state: 'KY',
          species: normalizeSpecies(speciesRaw),
          count: parseCount(countRaw),
          notes: 'KDFWR stocking schedule',
        });
      });
  });

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
  if (!t) return 'Rainbow trout';
  if (t.includes('rainbow')) return 'Rainbow trout';
  if (t.includes('brown')) return 'Brown trout';
  if (t.includes('brook')) return 'Brook trout';
  if (t.includes('walleye')) return 'Walleye';
  if (t.includes('sauger')) return 'Sauger';
  if (t.includes('saugeye')) return 'Saugeye';
  if (t.includes('musky') || t.includes('muskellunge')) return 'Muskellunge';
  if (t.includes('striped bass') || /striper/.test(t)) return 'Striped bass';
  if (t.includes('hybrid')) return 'Hybrid striped bass';
  if (t.includes('crappie')) return 'Crappie';
  if (t.includes('bluegill')) return 'Bluegill';
  if (t.includes('channel') && t.includes('cat')) return 'Channel catfish';
  if (t.includes('largemouth')) return 'Largemouth bass';
  if (t.includes('smallmouth')) return 'Smallmouth bass';
  return raw
    .trim()
    .split(/\s+/)
    .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}
