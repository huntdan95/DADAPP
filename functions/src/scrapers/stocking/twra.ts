import * as cheerio from 'cheerio';
import { logger } from 'firebase-functions';
import { fetchHtml } from './fetch';
import type { StockingScrapeRecord } from './types';

/**
 * TWRA — Tennessee Wildlife Resources Agency trout stocking.
 *
 * TWRA publishes the trout-stocking schedule + history on this landing
 * page:
 *   https://www.tn.gov/twra/fishing/trout-information-stockings.html
 *
 * The page links to a downloadable CSV (and sometimes an .xlsx). We
 * fetch the landing page, discover the CSV link, then parse the CSV
 * directly — far more reliable than scraping the rendered HTML table.
 *
 * If the CSV link can't be found or the fetch fails, the orchestrator
 * falls through to the AI-extract path (Claude w/ web_search).
 */

const LANDING_URL =
  'https://www.tn.gov/twra/fishing/trout-information-stockings.html';

/** Drop CSV rows whose stocking date is older than this many days. */
const INGEST_LOOKBACK_DAYS = 180;

export async function scrape(): Promise<StockingScrapeRecord[]> {
  // Step 1: find the CSV link on the landing page.
  let html: string;
  try {
    html = await fetchHtml(LANDING_URL, { timeoutMs: 30_000 });
  } catch (e) {
    logger.error('twra.landing.failed', { error: String(e) });
    return [];
  }
  const csvUrl = findCsvLink(html, LANDING_URL);
  if (!csvUrl) {
    logger.warn('twra.csv_link_not_found', {
      hint: 'Landing page did not expose a downloadable .csv — falling back to AI extract.',
    });
    return [];
  }

  // Step 2: download + parse the CSV.
  let csvText: string;
  try {
    csvText = await fetchHtml(csvUrl, { timeoutMs: 60_000 });
  } catch (e) {
    logger.error('twra.csv.fetch.failed', { csvUrl, error: String(e) });
    return [];
  }

  const records = parseCsv(csvText);
  logger.info('twra.csv.parsed', {
    csvUrl,
    totalRecords: records.length,
  });
  return records;
}

/**
 * Scans the landing-page HTML for an anchor whose href ends in `.csv`
 * AND whose text/href suggests stocking data. Returns an absolute
 * URL or null. Multiple candidates → prefer 'stocking' / 'trout' in
 * the URL.
 */
function findCsvLink(html: string, base: string): string | null {
  const $ = cheerio.load(html);
  const candidates: Array<{ href: string; score: number }> = [];
  $('a[href]').each((_, a) => {
    const href = $(a).attr('href') ?? '';
    if (!/\.csv(\?|$)/i.test(href)) return;
    const absolute = toAbsolute(href, base);
    const txt = ($(a).text() || '').toLowerCase();
    let score = 1;
    if (/stock/i.test(absolute) || /stock/i.test(txt)) score += 2;
    if (/trout/i.test(absolute) || /trout/i.test(txt)) score += 1;
    if (/schedule/i.test(absolute) || /schedule/i.test(txt)) score += 1;
    candidates.push({ href: absolute, score });
  });
  if (candidates.length === 0) return null;
  candidates.sort((a, b) => b.score - a.score);
  return candidates[0].href;
}

function toAbsolute(href: string, base: string): string {
  try {
    return new URL(href, base).toString();
  } catch {
    return href;
  }
}

/**
 * Parses the TWRA stocking CSV. Format isn't pinned to a fixed
 * column order — we detect by header name. Tolerates the common
 * variations:
 *   - "Date Stocked" / "Stocking Date" / "Date"
 *   - "Water" / "Water Body" / "Stream"
 *   - "County"
 *   - "Species"
 *   - "Number" / "Count" / "Fish Stocked"
 *   - "Size" / "Length" / "Avg Length"
 */
export function parseCsv(text: string): StockingScrapeRecord[] {
  const lines = text.split(/\r?\n/);
  if (lines.length < 2) return [];

  const headerCells = splitCsvLine(lines[0]).map((c) =>
    c.trim().toLowerCase()
  );

  const idx = {
    date: pickColumn(headerCells, ['date stocked', 'stocking date', 'date']),
    water: pickColumn(headerCells, [
      'water body',
      'water_body',
      'water',
      'stream',
      'location',
    ]),
    county: pickColumn(headerCells, ['county']),
    species: pickColumn(headerCells, ['species', 'fish']),
    count: pickColumn(headerCells, [
      'number fish stocked',
      'number',
      'count',
      'quantity',
      'fish stocked',
      'qty',
    ]),
    size: pickColumn(headerCells, [
      'average length',
      'avg length',
      'avg_length',
      'size',
      'length',
    ]),
  };

  if (idx.date < 0 || idx.water < 0 || idx.species < 0) {
    logger.warn('twra.csv.unexpected_header', {
      header: lines[0].slice(0, 240),
    });
    return [];
  }

  const cutoffMs = Date.now() - INGEST_LOOKBACK_DAYS * 24 * 60 * 60 * 1000;
  const out: StockingScrapeRecord[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const cells = splitCsvLine(line);
    const dateRaw = (cells[idx.date] ?? '').trim();
    const water = (cells[idx.water] ?? '').trim();
    const speciesRaw = (cells[idx.species] ?? '').trim();
    if (!dateRaw || !water || !speciesRaw) continue;

    const date = parseDate(dateRaw);
    if (!date) continue;
    const ts = new Date(date + 'T12:00:00Z').getTime();
    if (Number.isFinite(ts) && ts < cutoffMs) continue;

    const county = idx.county >= 0 ? (cells[idx.county] ?? '').trim() : '';
    const countRaw = idx.count >= 0 ? (cells[idx.count] ?? '').trim() : '';
    const sizeRaw = idx.size >= 0 ? (cells[idx.size] ?? '').trim() : '';

    const count = parseCount(countRaw);
    const size = parseSize(sizeRaw);
    const species = normalizeSpecies(speciesRaw);
    const locationName = buildLocationName(water, county);

    out.push({
      date,
      locationName,
      state: 'TN',
      species,
      count,
      size,
      notes: 'TWRA trout stocking CSV',
    });
  }
  return out;
}

function pickColumn(headerCells: string[], candidates: string[]): number {
  for (const cand of candidates) {
    const idx = headerCells.findIndex((c) => c === cand || c.includes(cand));
    if (idx >= 0) return idx;
  }
  return -1;
}

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
        continue;
      }
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === ',' && !inQuotes) {
      out.push(current);
      current = '';
      continue;
    }
    current += ch;
  }
  out.push(current);
  return out;
}

function parseDate(raw: string): string | null {
  // MM/DD/YYYY or MM/DD/YY
  const a = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/);
  if (a) {
    const [, mo, d, yRaw] = a;
    const y = yRaw.length === 2 ? `20${yRaw}` : yRaw;
    return `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  // Month name format (e.g., "Apr 15, 2026")
  const b = raw.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})$/);
  if (b) {
    const [, monStr, d, y] = b;
    const months: Record<string, string> = {
      jan: '01', feb: '02', mar: '03', apr: '04',
      may: '05', jun: '06', jul: '07', aug: '08',
      sep: '09', oct: '10', nov: '11', dec: '12',
    };
    const mo = months[monStr.slice(0, 3).toLowerCase()];
    if (mo) return `${y}-${mo}-${d.padStart(2, '0')}`;
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
  if (/^\d+(\.\d+)?$/.test(t)) return `${t} in`;
  return t;
}

function buildLocationName(water: string, county: string): string {
  if (county) return `${water} (${county} Co.)`;
  return water;
}

function normalizeSpecies(raw: string): string {
  const t = raw.trim().toLowerCase();
  if (!t) return 'Rainbow trout';
  if (t.includes('rainbow')) return 'Rainbow trout';
  if (t.includes('brown')) return 'Brown trout';
  if (t.includes('brook')) return 'Brook trout';
  if (t.includes('lake trout')) return 'Lake trout';
  if (t.includes('walleye')) return 'Walleye';
  return raw
    .trim()
    .split(/\s+/)
    .map((w) => (w[0] ? w[0].toUpperCase() + w.slice(1).toLowerCase() : ''))
    .join(' ');
}
