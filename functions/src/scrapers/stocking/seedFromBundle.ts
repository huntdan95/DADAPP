/**
 * One-click bundled-seed uploader.
 *
 * Reads the 11 state JSON files bundled in `functions/seed-data/` and
 * writes them to the production `stockingEvents` collection via the
 * admin SDK — no client-side auth gymnastics required. Same id-
 * derivation rule as the live scrapers (`auto-<source>-<date>-<water-
 * slug>-<species-slug>`) so subsequent cron runs dedupe naturally.
 *
 * Designed to be triggered from the System Health "Upload seed data"
 * button. Idempotent: re-runs only write net-new ids; everything
 * already in Firestore is skipped silently.
 *
 * Total payload: ~8,142 records across UT/CO/ID/AR/IL/MT/NC/PA/OK/GA/MS.
 */

import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { deriveStockingId, type StockingSource } from './types';

// ----- raw-record normalizers (mirror scripts/seed-western-stocking.cjs) ----
//
// Each raw JSON file uses a slightly different shape (UT has compressed
// water names, MT has hatchery + strain metadata, PA has section codes,
// etc.). These per-state normalizers turn each row into the canonical
// StockingScrapeRecord shape the orchestrator + Firestore index expect.

interface RawAr { date: string; water: string; county?: string; species: string; count?: number; size?: string; hatchery?: string; notes?: string; }
interface RawCo { date: string; water: string; county?: string; region?: string; species?: string; size?: string; }
interface RawId { date: string; water: string; county?: string; region?: string; species: string; count?: number; size?: string; }
interface RawIl { date: string; water: string; county?: string; region?: string; species?: string; count?: number; size?: string; notes?: string; }
interface RawGa { date: string; water: string; county?: string; species?: string; size?: string; notes?: string; }
interface RawMs { date: string; water: string; county?: string; species?: string; count?: number; size?: string; notes?: string; }
interface RawMt {
  date: string; water: string; species: string; count?: number; size?: string;
  hatchery?: string; strain?: string; region?: string; streamOrLake?: string;
}
interface RawNc { date: string; water: string; county: string; species: string; count?: number; notes?: string; }
interface RawOk { date: string; water: string; county?: string; species: string; size?: string; notes?: string; }
interface RawPa { date: string; water: string; county?: string; sec?: string; species: string; size?: string; notes?: string; }
interface RawUt { date: string; water: string; county?: string; species: string; count?: number; size?: string; }

interface NormalizedRecord {
  date: string;
  locationName: string;
  state: string;
  species: string;
  count?: number;
  size?: string;
  lat?: number;
  lng?: number;
  notes?: string;
  source: StockingSource;
}

function canonicalSpecies(raw: string): string {
  const t = String(raw || '').trim().toLowerCase();
  if (!t) return 'Unknown';
  if (t.includes('rainbow')) return 'Rainbow Trout';
  if (t.includes('brown')) return 'Brown Trout';
  if (t.includes('brook')) return 'Brook Trout';
  if (t.includes('lake trout') || /\blaker\b/.test(t)) return 'Lake Trout';
  if (t.includes('tiger')) return 'Tiger Trout';
  if (t.includes('cutbow')) return 'Cutbow';
  if (t.includes('cutthroat')) return 'Cutthroat Trout';
  if (t.includes('splake')) return 'Splake';
  if (t.includes('steelhead')) return 'Steelhead';
  if (t.includes('kokanee')) return 'Kokanee Salmon';
  if (t.includes('walleye')) return 'Walleye';
  if (t.includes('northern pike')) return 'Northern Pike';
  if (t.includes('muskie') || t.includes('muskellunge')) return 'Muskellunge';
  if (t.includes('grayling')) return 'Arctic Grayling';
  if (t.includes('whitefish')) return 'Whitefish';
  if (t.includes('bluegill')) return 'Bluegill';
  if (t.includes('largemouth')) return 'Largemouth Bass';
  if (t.includes('smallmouth')) return 'Smallmouth Bass';
  if (t.includes('chinook') || /\bking\b/.test(t)) return 'King Salmon';
  if (t.includes('coho')) return 'Coho Salmon';
  if (t.includes('golden')) return 'Golden Trout';
  return raw
    .trim()
    .split(/\s+/)
    .map((w) => (w[0] ? w[0].toUpperCase() + w.slice(1).toLowerCase() : ''))
    .join(' ');
}

function expandUtWaterName(raw: string): string {
  let s = String(raw).trim();
  if (/[a-z]/.test(s) && !/^[A-Z][A-Z\s\d.,'\-/&#]+$/.test(s)) return s;
  s = s.replace(/\s*\([^)]+\)\s*$/, '');
  const cap = (w: string): string => {
    if (!w) return w;
    if (/^\d/.test(w)) return w;
    return w[0].toUpperCase() + w.slice(1).toLowerCase();
  };
  return s
    .split(/\s+/)
    .map((tok) => {
      const bare = tok.replace(/[,.]$/g, '');
      switch (bare.toUpperCase()) {
        case 'R': return 'River';
        case 'RES': case 'RES.': return 'Reservoir';
        case 'L': return 'Lake';
        case 'PD': return 'Pond';
        case 'CR': return 'Creek';
        case 'CYN': return 'Canyon';
        case 'FK': return 'Fork';
        case 'MTN': return 'Mountain';
        default: return cap(bare);
      }
    })
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const SEED_DIR = path.join(__dirname, '..', '..', '..', 'seed-data');

function readSeed<T>(filename: string): T[] {
  const fp = path.join(SEED_DIR, filename);
  if (!fs.existsSync(fp)) return [];
  return JSON.parse(fs.readFileSync(fp, 'utf8'));
}

function normalizeAr(rows: RawAr[]): NormalizedRecord[] {
  return rows.map((r) => ({
    date: r.date,
    locationName: r.county ? `${r.water} (${r.county} Co.)` : r.water,
    state: 'AR',
    species: canonicalSpecies(r.species),
    count: r.count,
    size: r.size,
    source: 'ar-agfc' as StockingSource,
    notes: [r.notes, r.hatchery ? `Hatchery: ${r.hatchery}.` : null]
      .filter(Boolean).join(' ') || 'Seeded from AGFC weekly fishing report.',
  }));
}
function normalizeCo(rows: RawCo[]): NormalizedRecord[] {
  return rows.map((r) => ({
    date: r.date,
    locationName: r.county ? `${r.water} (${r.county} Co.)` : r.water,
    state: 'CO',
    species: canonicalSpecies(r.species ?? 'Rainbow Trout'),
    size: r.size ?? '~10 in',
    source: 'co-cpw' as StockingSource,
    notes: r.region
      ? `Seeded from CPW weekly stocking report (${r.region} region).`
      : 'Seeded from CPW weekly stocking report.',
  }));
}
function normalizeId(rows: RawId[]): NormalizedRecord[] {
  return rows.map((r) => ({
    date: r.date,
    locationName: r.county ? `${r.water} (${r.county} Co.)` : r.water,
    state: 'ID',
    species: canonicalSpecies(r.species),
    count: r.count,
    size: r.size,
    source: 'id-fg' as StockingSource,
    notes: r.region
      ? `Seeded from IDFG ${r.region} region report.`
      : 'Seeded from IDFG regional report.',
  }));
}
function normalizeIl(rows: RawIl[]): NormalizedRecord[] {
  return rows.map((r) => ({
    date: r.date,
    locationName: r.county ? `${r.water} (${r.county} Co.)` : r.water,
    state: 'IL',
    species: canonicalSpecies(r.species ?? 'Rainbow Trout'),
    count: r.count,
    size: r.size,
    source: 'il-dnr' as StockingSource,
    notes: [
      'Seeded from IDNR spring trout stocking schedule.',
      r.region ? `Region: ${r.region}.` : null,
      r.notes,
    ].filter(Boolean).join(' '),
  }));
}
function normalizeGa(rows: RawGa[]): NormalizedRecord[] {
  return rows.map((r) => ({
    date: r.date,
    locationName: r.county ? `${r.water} (${r.county} Co.)` : r.water,
    state: 'GA',
    species: canonicalSpecies(r.species ?? 'Rainbow Trout'),
    size: r.size,
    source: 'ga-dnr' as StockingSource,
    notes: r.notes ?? 'Seeded from GA WRD Weekly Trout Stocking Report.',
  }));
}
function normalizeMs(rows: RawMs[]): NormalizedRecord[] {
  return rows.map((r) => ({
    date: r.date,
    locationName: r.county ? `${r.water} (${r.county} Co.)` : r.water,
    state: 'MS',
    species: canonicalSpecies(r.species ?? 'Rainbow Trout'),
    count: r.count,
    size: r.size,
    source: 'ms-mdwfp' as StockingSource,
    notes: r.notes ?? 'Seeded from MDWFP Lake Lamar Bruce winter trout program.',
  }));
}
function normalizeMt(rows: RawMt[]): NormalizedRecord[] {
  return rows.map((r) => ({
    date: r.date,
    locationName: r.water,
    state: 'MT',
    species: canonicalSpecies(r.species),
    count: r.count,
    size: r.size,
    source: 'mt-fwp' as StockingSource,
    notes: [
      'Seeded from MT FWP FishMT plantsearchgrid endpoint.',
      r.hatchery ? `Hatchery: ${r.hatchery}.` : null,
      r.strain ? `Strain: ${r.strain}.` : null,
      r.region ? `${r.region}.` : null,
    ].filter(Boolean).join(' '),
  }));
}
function normalizeNc(rows: RawNc[]): NormalizedRecord[] {
  return rows.map((r) => ({
    date: r.date,
    locationName: r.county ? `${r.water} (${r.county} Co.)` : r.water,
    state: 'NC',
    species: canonicalSpecies(r.species),
    count: r.count,
    source: 'nc-wrc' as StockingSource,
    notes: r.notes ?? 'Seeded from NCWRC 2026 Master Trout Stocking schedule.',
  }));
}
function normalizeOk(rows: RawOk[]): NormalizedRecord[] {
  return rows.map((r) => ({
    date: r.date,
    locationName: r.county ? `${r.water} (${r.county} Co.)` : r.water,
    state: 'OK',
    species: canonicalSpecies(r.species),
    size: r.size,
    source: 'ok-odwc' as StockingSource,
    notes: r.notes ?? 'Seeded from ODWC trout-area published cadence.',
  }));
}
function normalizePa(rows: RawPa[]): NormalizedRecord[] {
  return rows.map((r) => ({
    date: r.date,
    locationName: r.county
      ? `${r.water} (${r.county} Co., Sec ${r.sec ?? '?'})`
      : r.water,
    state: 'PA',
    species: canonicalSpecies(r.species),
    size: r.size,
    source: 'pa-fbc' as StockingSource,
    notes: r.notes ?? 'Seeded from PA PFBC 2026 Adult Trout Stocking Schedule.',
  }));
}
function normalizeUt(rows: RawUt[]): NormalizedRecord[] {
  return rows.map((r) => {
    const water = expandUtWaterName(r.water);
    return {
      date: r.date,
      locationName: r.county ? `${water} (${r.county} Co.)` : water,
      state: 'UT',
      species: canonicalSpecies(r.species),
      count: r.count,
      size: r.size,
      source: 'ut-dwr' as StockingSource,
      notes: 'Seeded from UT DWR public stocking report.',
    };
  });
}

function stripUndefined<T extends Record<string, unknown>>(value: T): T {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value)) {
    if (v !== undefined) out[k] = v;
  }
  return out as T;
}

export const seedStockingFromBundle = onCall(
  {
    region: 'us-central1',
    memory: '1GiB',                       // 8K-row batch writes
    timeoutSeconds: 540,
    invoker: 'public',
    // No anthropic key — pure data load, no Claude calls.
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Must be signed in');
    }

    const ar = normalizeAr(readSeed<RawAr>('ar-raw.json'));
    const co = normalizeCo(readSeed<RawCo>('co-raw.json'));
    const id = normalizeId(readSeed<RawId>('id-raw.json'));
    const il = normalizeIl(readSeed<RawIl>('il-raw.json'));
    const ga = normalizeGa(readSeed<RawGa>('ga-raw.json'));
    const ms = normalizeMs(readSeed<RawMs>('ms-raw.json'));
    const mt = normalizeMt(readSeed<RawMt>('mt-raw.json'));
    const nc = normalizeNc(readSeed<RawNc>('nc-raw.json'));
    const ok = normalizeOk(readSeed<RawOk>('ok-raw.json'));
    const pa = normalizePa(readSeed<RawPa>('pa-raw.json'));
    const ut = normalizeUt(readSeed<RawUt>('ut-raw.json'));

    const perState: Record<string, number> = {
      AR: ar.length, CO: co.length, GA: ga.length, ID: id.length,
      IL: il.length, MS: ms.length, MT: mt.length, NC: nc.length,
      OK: ok.length, PA: pa.length, UT: ut.length,
    };

    const all = [...ar, ...co, ...ga, ...id, ...il, ...ms, ...mt, ...nc, ...ok, ...pa, ...ut];
    logger.info('seedStockingFromBundle.start', { total: all.length, perState });

    const db = getFirestore();
    let written = 0;
    let skipped = 0;
    let failed = 0;

    // Process in chunks of 400 (under Firestore's 500-op batch limit).
    for (let i = 0; i < all.length; i += 400) {
      const chunk = all.slice(i, i + 400);
      const batch = db.batch();
      let pendingWrites = 0;
      for (const rec of chunk) {
        const docId = deriveStockingId(rec.source, {
          date: rec.date,
          locationName: rec.locationName,
          state: rec.state,
          species: rec.species,
        });
        try {
          const ref = db.collection('stockingEvents').doc(docId);
          const existing = await ref.get();
          if (existing.exists) {
            skipped++;
            continue;
          }
          batch.set(
            ref,
            stripUndefined({
              id: docId,
              date: rec.date,
              locationName: rec.locationName,
              state: rec.state,
              species: rec.species,
              count: rec.count,
              size: rec.size,
              lat: rec.lat,
              lng: rec.lng,
              notes: rec.notes,
              source: rec.source,
              createdAt: FieldValue.serverTimestamp(),
            })
          );
          pendingWrites++;
        } catch (e) {
          failed++;
          if (failed <= 5) {
            logger.warn('seedStockingFromBundle.write_failed', {
              docId,
              error: String(e),
            });
          }
        }
      }
      if (pendingWrites > 0) {
        await batch.commit();
        written += pendingWrites;
      }
    }

    logger.info('seedStockingFromBundle.complete', {
      total: all.length,
      written,
      skipped,
      failed,
      perState,
    });

    return {
      total: all.length,
      written,
      skipped,
      failed,
      perState,
    };
  }
);
