import { logger } from 'firebase-functions';
import { fetchHtml } from './fetch';
import type { StockingScrapeRecord } from './types';

/**
 * Michigan DNR stocking scraper — CSV mode.
 *
 * Source: https://michigandnr.com/publications/PDFS/Fishing/FishStocking/FishStockingData.csv
 *
 * MI DNR publishes the full historical + recent stocking database as
 * a single CSV file. Way more reliable than scraping the ASP.NET-
 * gated portal at https://www2.dnr.state.mi.us/fishstock/, which
 * requires POST + ViewState to return results.
 *
 * CSV columns (header row):
 *   County_Name, Water_Body_Name, sitename, Town, Range, Section,
 *   Species, Marking_Group, Stocking_Date, Number_Fish_Stocked,
 *   Average_Length_Inches, Operation
 *
 * Sample row (Tippy Dam Manistee River, the user's reference):
 *   Manistee,Manistee River,TIPPY DAM,22N,13W,31,Brown trout         ,none,03/26/2026,23200,7.03,State Plant
 *
 * Records older than the lookback window are dropped so we don't
 * stuff the Firestore collection with years of irrelevant history.
 * The orchestrator's 400-day prune handles anything that slips
 * through.
 */

const CSV_URL =
  'https://michigandnr.com/publications/PDFS/Fishing/FishStocking/FishStockingData.csv';

/** Drop CSV rows whose stocking date is older than this many days. */
const INGEST_LOOKBACK_DAYS = 180;

export async function scrape(): Promise<StockingScrapeRecord[]> {
  let text: string;
  try {
    text = await fetchHtml(CSV_URL, { timeoutMs: 60_000 });
  } catch (e) {
    logger.error('miDnr.csv.fetch.failed', { url: CSV_URL, error: String(e) });
    return [];
  }

  const records = parseCsv(text);
  logger.info('miDnr.csv.parsed', {
    totalRecords: records.length,
  });
  return records;
}

/**
 * Parses the MI DNR CSV. Handles:
 *   - Trailing spaces on species names (CSV exports them padded)
 *   - Mixed 2-digit / 4-digit year formats in the date column
 *   - Empty sitename / township columns
 *   - Records older than INGEST_LOOKBACK_DAYS (dropped)
 */
export function parseCsv(text: string): StockingScrapeRecord[] {
  const lines = text.split(/\r?\n/);
  if (lines.length < 2) return [];
  // Validate header — fail fast if the format changes.
  const header = lines[0].toLowerCase();
  if (
    !header.includes('county') ||
    !header.includes('water') ||
    !header.includes('species') ||
    !header.includes('date')
  ) {
    logger.warn('miDnr.csv.unexpected_header', {
      header: lines[0].slice(0, 240),
    });
    return [];
  }

  const cutoffMs =
    Date.now() - INGEST_LOOKBACK_DAYS * 24 * 60 * 60 * 1000;

  const out: StockingScrapeRecord[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const cells = splitCsvLine(line);
    // Need at least the 9 named-by-header columns we care about.
    if (cells.length < 12) continue;

    const county = cells[0].trim();
    const water = cells[1].trim();
    const siteName = cells[2].trim();
    // cells[3..5] = Town / Range / Section (geographic legal-survey
    // descriptors — useful context, not for matching).
    const speciesRaw = cells[6].trim();
    const dateRaw = cells[8].trim();
    const countRaw = cells[9].trim();
    const lengthRaw = cells[10].trim();

    if (!water || !speciesRaw || !dateRaw) continue;

    const date = parseDate(dateRaw);
    if (!date) continue;

    const ts = new Date(date + 'T12:00:00Z').getTime();
    if (Number.isFinite(ts) && ts < cutoffMs) continue;

    const count = parseCount(countRaw);
    const size = parseSize(lengthRaw);
    const species = normalizeSpecies(speciesRaw);

    // Build locationName so the spot-match filter has multiple
    // hooks to land on. Format: "Manistee River · TIPPY DAM (Manistee Co.)"
    const locationName = buildLocationName(water, siteName, county);

    out.push({
      date,
      locationName,
      state: 'MI',
      species,
      count,
      size,
      notes: 'MI DNR FishStockingData CSV',
    });
  }
  return out;
}

/**
 * Splits a CSV line, respecting double-quoted fields that contain
 * commas. The MI DNR CSV almost never quotes (no commas in the data),
 * but this handles future format changes defensively.
 */
function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      // Handle "" inside a quoted field (escaped quote).
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
  const m = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/);
  if (m) {
    const [, mo, d, yRaw] = m;
    const y = yRaw.length === 2 ? `20${yRaw}` : yRaw;
    return `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  // YYYY-MM-DD (just in case)
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
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

function buildLocationName(
  water: string,
  siteName: string,
  county: string
): string {
  const parts: string[] = [water];
  if (siteName) parts.push(siteName);
  if (county) parts.push(`(${county} Co.)`);
  return parts.join(' · ');
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
  if (t.includes('smallmouth')) return 'Smallmouth bass';
  if (t.includes('largemouth')) return 'Largemouth bass';
  return raw
    .trim()
    .split(/\s+/)
    .map((w) => (w[0] ? w[0].toUpperCase() + w.slice(1).toLowerCase() : ''))
    .join(' ');
}
