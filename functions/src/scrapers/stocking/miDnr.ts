import * as cheerio from 'cheerio';
import { logger } from 'firebase-functions';
import { fetchHtml } from './fetch';
import type { StockingScrapeRecord } from './types';

/**
 * Michigan DNR stocking scraper.
 *
 * Source: https://www2.dnr.state.mi.us/fishstock/
 *
 * The MI portal lets you query stocking records by year. The simplest
 * route is the year-summary report — POST-equivalent URL parameters
 * that produce an HTML table of every stocking event for a given year
 * (or year + species). We pull the current year unfiltered, parse the
 * resulting table, and convert.
 *
 * Columns observed: Date stocked | Species | Strain | County | Site
 * (waterbody) | Number | Avg length (in) | Stocking method.
 *
 * Tolerance: the page layout has changed over the years; we identify
 * the data table by a header row containing "Date" + "Species" in
 * adjacent cells, then map subsequent rows by column index.
 *
 * Locations: MI doesn't publish lat/lng with stocking data. We rely on
 * the location/state filter in the client banner ("within 25 mi of
 * this spot") — when lat/lng is missing the banner falls back to
 * locationName match against the spot. The friendly site name is
 * still useful in the briefing context even without coordinates.
 */

const YEAR = new Date().getFullYear();
const URL = `https://www2.dnr.state.mi.us/fishstock/Default.aspx?yr=${YEAR}`;

export async function scrape(): Promise<StockingScrapeRecord[]> {
  let html: string;
  try {
    html = await fetchHtml(URL, { timeoutMs: 30_000 });
  } catch (e) {
    logger.error('miDnr.fetch.failed', { error: String(e), url: URL });
    return [];
  }
  const $ = cheerio.load(html);

  const records: StockingScrapeRecord[] = [];

  // Find the table with headers that look like a stocking-records table.
  let columnMap: Record<string, number> | null = null;

  $('table').each((_, tbl) => {
    const headerCells = $(tbl)
      .find('tr')
      .first()
      .find('th, td')
      .map((_i, c) => $(c).text().trim().toLowerCase())
      .get();
    if (headerCells.length < 3) return;
    // We need at minimum: date, species, site. Be flexible about names.
    const candidateMap: Record<string, number> = {};
    headerCells.forEach((cell, idx) => {
      if (/date/.test(cell) && candidateMap.date == null) candidateMap.date = idx;
      if (/species/.test(cell) && candidateMap.species == null) candidateMap.species = idx;
      if (/^site$|water|location/.test(cell) && candidateMap.site == null)
        candidateMap.site = idx;
      if (/county/.test(cell) && candidateMap.county == null) candidateMap.county = idx;
      if (/(number|count|fish)/.test(cell) && candidateMap.count == null)
        candidateMap.count = idx;
      if (/(length|size|avg)/.test(cell) && candidateMap.size == null)
        candidateMap.size = idx;
    });
    if (
      candidateMap.date != null &&
      candidateMap.species != null &&
      candidateMap.site != null
    ) {
      columnMap = candidateMap;
      // Parse all rows of this table.
      $(tbl)
        .find('tr')
        .each((i, tr) => {
          if (i === 0) return;          // header
          const cells = $(tr)
            .find('td')
            .map((_j, td) => $(td).text().trim())
            .get();
          if (cells.length < 3) return;
          const dateRaw = cells[candidateMap.date];
          const isoDate = parseDate(dateRaw);
          if (!isoDate) return;
          const speciesRaw = cells[candidateMap.species] ?? '';
          const site = cells[candidateMap.site] ?? '';
          const county =
            candidateMap.county != null ? cells[candidateMap.county] : '';
          const countRaw =
            candidateMap.count != null ? cells[candidateMap.count] : '';
          const sizeRaw =
            candidateMap.size != null ? cells[candidateMap.size] : '';

          if (!site) return;

          records.push({
            date: isoDate,
            locationName: county ? `${site} (${county} Co.)` : site,
            state: 'MI',
            species: normalizeSpecies(speciesRaw),
            count: parseCount(countRaw),
            size: parseSize(sizeRaw),
            notes: 'MI DNR stocking database',
          });
        });
    }
  });

  logger.info('miDnr.scrape', {
    count: records.length,
    matchedColumns: columnMap ?? 'none',
  });
  return records;
}

function parseDate(raw: string): string | null {
  // MI publishes as M/D/YYYY or YYYY-MM-DD. Handle both.
  const a = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (a) {
    const [, y, m, d] = a;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  const b = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (b) {
    const [, mo, d, yRaw] = b;
    const y = yRaw.length === 2 ? `20${yRaw}` : yRaw;
    return `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  return null;
}

function parseCount(raw: string): number | undefined {
  const cleaned = raw.replace(/[,\s]/g, '');
  if (!cleaned) return undefined;
  const n = Number(cleaned);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function parseSize(raw: string): string | undefined {
  const t = raw.trim();
  if (!t || t === '-' || /^n\/?a$/i.test(t)) return undefined;
  // Convert "5.4" → "5.4 in" if it's just a number.
  if (/^\d+(\.\d+)?$/.test(t)) return `${t} in`;
  return t;
}

function normalizeSpecies(raw: string): string {
  const t = raw.trim().toLowerCase();
  if (!t) return 'Unknown';
  if (t.includes('rainbow')) return 'Rainbow trout';
  if (t.includes('brown')) return 'Brown trout';
  if (t.includes('brook')) return 'Brook trout';
  if (t.includes('lake trout')) return 'Lake trout';
  if (t.includes('splake')) return 'Splake';
  if (t.includes('steelhead')) return 'Steelhead';
  if (t.includes('chinook') || t.includes('king salmon')) return 'King salmon';
  if (t.includes('coho')) return 'Coho salmon';
  if (t.includes('atlantic salmon')) return 'Atlantic salmon';
  if (t.includes('walleye')) return 'Walleye';
  if (t.includes('muskellunge') || t.includes('muskie')) return 'Muskellunge';
  if (t.includes('northern pike')) return 'Northern pike';
  if (t.includes('lake sturgeon')) return 'Lake sturgeon';
  // Title-case fallback for anything not in the lookup table.
  return raw
    .trim()
    .split(/\s+/)
    .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}
