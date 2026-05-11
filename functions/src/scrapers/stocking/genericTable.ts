import * as cheerio from 'cheerio';
import { logger } from 'firebase-functions';
import { fetchHtml } from './fetch';
import type { StockingScrapeRecord } from './types';

/**
 * Generic state-DNR stocking-table parser. State DNRs share a common
 * pattern: an HTML page with one or more <table>s where each row
 * starts with a date and continues with [water, county?, species,
 * count?]. The specific column order varies, so this helper detects
 * by header text + falls through to positional fallbacks.
 *
 * Used by the lighter state-specific modules — each calls
 * `scrapeTablePage(url, state, sourceLabel)` and the result feeds the
 * orchestrator alongside the dedicated TWRA / MI DNR / KDFWR parsers.
 *
 * Tolerance is the design goal — pages get redesigned, columns get
 * shuffled, and we don't want to ship a fresh PR for every layout
 * change. Where ambiguity exists we err toward a populated record
 * with reasonable defaults.
 */

const DATE_RE_SLASH = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/;
const DATE_RE_DASH = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;

interface ParseColumnMap {
  date?: number;
  water?: number;
  county?: number;
  species?: number;
  count?: number;
  size?: number;
}

export async function scrapeTablePage(args: {
  url: string;
  state: string;
  scraperLabel: string;
  notes: string;
}): Promise<StockingScrapeRecord[]> {
  const { url, state, scraperLabel, notes } = args;
  let html: string;
  try {
    html = await fetchHtml(url, { timeoutMs: 25_000 });
  } catch (e) {
    logger.warn(`${scraperLabel}.fetch.failed`, { url, error: String(e) });
    return [];
  }
  const $ = cheerio.load(html);

  const records: StockingScrapeRecord[] = [];

  // Walk every table on the page; for each, try to detect column
  // positions from the header row, then parse rows whose first cell
  // is a date.
  $('table').each((_, tbl) => {
    const headerCells = $(tbl)
      .find('tr')
      .first()
      .find('th, td')
      .map((_i, c) => $(c).text().trim().toLowerCase())
      .get();
    const map: ParseColumnMap = {};
    headerCells.forEach((cell, idx) => {
      if (/date|stocked|week/.test(cell) && map.date == null) map.date = idx;
      else if (/water|stream|river|lake|site|location/.test(cell) && map.water == null)
        map.water = idx;
      else if (/county/.test(cell) && map.county == null) map.county = idx;
      else if (/species|fish/.test(cell) && map.species == null) map.species = idx;
      else if (/(number|count|qty|fish.*stocked|stocked)/.test(cell) && map.count == null)
        map.count = idx;
      else if (/(size|length|inches|avg)/.test(cell) && map.size == null)
        map.size = idx;
    });

    // If we couldn't find a date column from the header, fall back to
    // positional defaults (Date 0, Water 1, County 2, Species 3, Count
    // 4) — most state DNR tables follow that order.
    if (map.date == null) map.date = 0;
    if (map.water == null) map.water = 1;

    $(tbl)
      .find('tr')
      .each((i, tr) => {
        if (i === 0) return;        // header row
        const cells = $(tr)
          .find('td')
          .map((_j, td) => $(td).text().trim())
          .get();
        if (cells.length < 2) return;

        const dateRaw = cells[map.date!] ?? '';
        const isoDate = parseDate(dateRaw);
        if (!isoDate) return;

        const water = cells[map.water!] ?? '';
        if (!water) return;
        const county = map.county != null ? cells[map.county] ?? '' : '';
        const speciesRaw =
          (map.species != null ? cells[map.species] : '') || 'Rainbow trout';
        const countRaw = map.count != null ? cells[map.count] ?? '' : '';
        const sizeRaw = map.size != null ? cells[map.size] ?? '' : '';

        records.push({
          date: isoDate,
          locationName: county ? `${water} (${county} Co.)` : water,
          state,
          species: normalizeSpecies(speciesRaw),
          count: parseCount(countRaw),
          size: parseSize(sizeRaw),
          notes,
        });
      });
  });

  if (records.length === 0) {
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 240);
    logger.warn(`${scraperLabel}.parse.empty`, { url, bodySnippet: bodyText });
  } else {
    logger.info(`${scraperLabel}.parse.ok`, {
      url,
      count: records.length,
      sample: records[0],
    });
  }

  return records;
}

function parseDate(raw: string): string | null {
  const trimmed = raw.trim();
  const a = trimmed.match(DATE_RE_DASH);
  if (a) {
    const [, y, m, d] = a;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  const b = trimmed.match(DATE_RE_SLASH);
  if (b) {
    const [, mo, d, yRaw] = b;
    const y = yRaw.length === 2 ? `20${yRaw}` : yRaw;
    return `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  // "Week of M/D/YYYY" — extract via DATE_RE_SLASH applied to the substring
  const weekMatch = trimmed.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
  if (weekMatch) {
    const [, mo, d, yRaw] = weekMatch;
    const y = yRaw.length === 2 ? `20${yRaw}` : yRaw;
    return `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  return null;
}

function parseCount(raw: string): number | undefined {
  const cleaned = raw.replace(/[,\s]/g, '');
  if (!cleaned || /tbd|n\/a/i.test(cleaned)) return undefined;
  const n = Number(cleaned);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function parseSize(raw: string): string | undefined {
  const t = raw.trim();
  if (!t || t === '-' || /^n\/?a$/i.test(t)) return undefined;
  if (/^\d+(\.\d+)?$/.test(t)) return `${t} in`;
  return t;
}

function normalizeSpecies(raw: string): string {
  const t = raw.trim().toLowerCase();
  if (!t) return 'Rainbow trout';
  if (t.includes('rainbow')) return 'Rainbow trout';
  if (t.includes('brown')) return 'Brown trout';
  if (t.includes('brook')) return 'Brook trout';
  if (t.includes('cutthroat')) return 'Cutthroat trout';
  if (t.includes('lake trout')) return 'Lake trout';
  if (t.includes('splake')) return 'Splake';
  if (t.includes('tiger')) return 'Tiger trout';
  if (t.includes('walleye')) return 'Walleye';
  if (t.includes('sauger')) return 'Sauger';
  if (t.includes('musky') || t.includes('muskellunge')) return 'Muskellunge';
  if (t.includes('northern pike')) return 'Northern pike';
  if (t.includes('hybrid')) return 'Hybrid striped bass';
  if (t.includes('striped bass') || /striper/.test(t)) return 'Striped bass';
  if (t.includes('largemouth')) return 'Largemouth bass';
  if (t.includes('smallmouth')) return 'Smallmouth bass';
  if (t.includes('kokanee')) return 'Kokanee salmon';
  if (t.includes('chinook') || t.includes('king salmon')) return 'King salmon';
  if (t.includes('coho')) return 'Coho salmon';
  if (t.includes('crappie')) return 'Crappie';
  if (t.includes('bluegill')) return 'Bluegill';
  if (t.includes('channel') && t.includes('cat')) return 'Channel catfish';
  return raw
    .trim()
    .split(/\s+/)
    .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}
