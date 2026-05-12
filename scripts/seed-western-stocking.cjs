/**
 * One-shot seeder: pushes stocking events for AR/CO/ID/IL/UT directly
 * into the production `stockingEvents` Firestore collection. (MS isn't
 * here because MDWFP doesn't publish structured stocking data — the
 * weekly cron will fall back to AI-extract once credits are topped up.)
 *
 * Why this exists: the weekly cron-driven AI extractor is the long-term
 * keep-fresh path, but state DNR HTML pages were 404'ing AND we wanted
 * to seed the database with current data before any user opens a spot
 * in these states. Doing the research in a Claude Code session (not
 * the app's runtime) burns zero Anthropic credits on the user's account.
 *
 * Reads five JSON files written by the research turns:
 *   data/seed/ut-raw.json  (UT DWR  — 528 records, Jan–May 2026)
 *   data/seed/co-raw.json  (CO CPW  — 70 records, May 2026)
 *   data/seed/id-raw.json  (IDFG    — 37 records, Feb + May 2026 across regions)
 *   data/seed/ar-raw.json  (AGFC    — 5 records, April 2026 White River tailwater)
 *   data/seed/il-raw.json  (IDNR    — 59 records, 2026 spring trout season)
 *
 * Each record is normalized into the same shape the scrapers emit and
 * given the same id rule (`auto-<source>-<date>-<water-slug>-<species-
 * slug>`), so future cron runs will dedupe against these seeds — no
 * double-writes when the weekly job catches up.
 *
 * Auth: piggybacks on the user's `firebase login` (same pattern as
 * scripts/grant-invoker.cjs). No need for `gcloud auth application-
 * default login`. Trades the firebase-tools refresh token for an OAuth
 * access token, then drives the Firestore REST API directly.
 *
 * Run:  node scripts/seed-western-stocking.cjs
 *
 * Idempotent — re-runs no-op on already-existing ids. Safe to run
 * each time a new state's seed file is added.
 */

const fs = require('node:fs');
const path = require('node:path');
const {
  getGlobalDefaultAccount,
  getAccessToken,
} = require('C:/Users/Danny/AppData/Roaming/npm/node_modules/firebase-tools/lib/auth.js');

const PROJECT_ID = 'dadapp-2cef8';
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// ---- normalization helpers -------------------------------------------------

/** Expand UT DWR's compressed water names (BEAVER R → Beaver River). */
function expandUtWaterName(raw) {
  let s = String(raw).trim();
  // Already title-cased? Leave alone.
  if (/[a-z]/.test(s) && !/^[A-Z][A-Z\s\d.,'\-/&#]+$/.test(s)) {
    return s;
  }
  // Strip trailing parenthetical notes like "(21ST PO)".
  s = s.replace(/\s*\([^)]+\)\s*$/, '');
  const tokens = s.split(/\s+/);
  return tokens
    .map((tok) => {
      const bare = tok.replace(/[,.]$/g, '');
      switch (bare.toUpperCase()) {
        case 'R':
          return 'River';
        case 'RES':
        case 'RES.':
          return 'Reservoir';
        case 'L':
          return 'Lake';
        case 'PD':
          return 'Pond';
        case 'CR':
          return 'Creek';
        case 'CYN':
          return 'Canyon';
        case 'FK':
          return 'Fork';
        case 'MTN':
          return 'Mountain';
        default:
          return capitalize(bare);
      }
    })
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}
function capitalize(w) {
  if (!w) return w;
  if (/^\d/.test(w)) return w;
  return w[0].toUpperCase() + w.slice(1).toLowerCase();
}

function canonicalSpecies(raw) {
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
  return String(raw).trim().split(/\s+/).map(capitalize).join(' ');
}

/** Mirrors functions/src/scrapers/stocking/types.ts deriveStockingId(). */
function deriveStockingId(source, rec) {
  const slug = (s) =>
    String(s)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40);
  return `auto-${source}-${rec.date}-${slug(rec.locationName)}-${slug(rec.species)}`;
}

// ---- per-state normalizers -------------------------------------------------

function loadJson(rel) {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', rel), 'utf8')
  );
}

function normalizeUt() {
  return loadJson('data/seed/ut-raw.json')
    .filter((r) => r.water && r.date && /^\d{4}-\d{2}-\d{2}$/.test(r.date))
    .map((r) => {
      const water = expandUtWaterName(r.water);
      return {
        date: r.date,
        locationName: r.county ? `${water} (${r.county} Co.)` : water,
        state: 'UT',
        species: canonicalSpecies(r.species),
        count: typeof r.count === 'number' ? r.count : undefined,
        size: r.size,
        source: 'ut-dwr',
        notes: 'Seeded from UT DWR public stocking report.',
      };
    });
}

function normalizeCo() {
  return loadJson('data/seed/co-raw.json')
    .filter((r) => r.water && r.date && /^\d{4}-\d{2}-\d{2}$/.test(r.date))
    .map((r) => ({
      date: r.date,
      locationName: r.county ? `${r.water} (${r.county} Co.)` : r.water,
      state: 'CO',
      species: canonicalSpecies(r.species ?? 'Rainbow Trout'),
      size: r.size ?? '~10 in',
      source: 'co-cpw',
      notes: r.region
        ? `Seeded from CPW weekly stocking report (${r.region} region).`
        : 'Seeded from CPW weekly stocking report.',
    }));
}

function normalizeId() {
  return loadJson('data/seed/id-raw.json')
    .filter((r) => r.water && r.date && /^\d{4}-\d{2}-\d{2}$/.test(r.date))
    .map((r) => ({
      date: r.date,
      locationName: r.county ? `${r.water} (${r.county} Co.)` : r.water,
      state: 'ID',
      species: canonicalSpecies(r.species),
      count: typeof r.count === 'number' ? r.count : undefined,
      size: r.size,
      source: 'id-fg',
      notes: r.region
        ? `Seeded from IDFG ${r.region} region report.`
        : 'Seeded from IDFG regional report.',
    }));
}

function normalizeAr() {
  if (!fs.existsSync(path.join(__dirname, '..', 'data', 'seed', 'ar-raw.json'))) return [];
  return loadJson('data/seed/ar-raw.json')
    .filter((r) => r.water && r.date && /^\d{4}-\d{2}-\d{2}$/.test(r.date))
    .map((r) => {
      const water = r.water;
      const locationName = r.county ? `${water} (${r.county} Co.)` : water;
      const noteBits = ['Seeded from AGFC weekly fishing report.'];
      if (r.hatchery) noteBits.push(`Hatchery: ${r.hatchery}.`);
      if (r.notes) noteBits.push(r.notes);
      return {
        date: r.date,
        locationName,
        state: 'AR',
        species: canonicalSpecies(r.species),
        count: typeof r.count === 'number' ? r.count : undefined,
        size: r.size,
        source: 'ar-agfc',
        notes: noteBits.join(' '),
      };
    });
}

function normalizeIl() {
  if (!fs.existsSync(path.join(__dirname, '..', 'data', 'seed', 'il-raw.json'))) return [];
  return loadJson('data/seed/il-raw.json')
    .filter((r) => r.water && r.date && /^\d{4}-\d{2}-\d{2}$/.test(r.date))
    .map((r) => {
      const water = r.water;
      const locationName = r.county ? `${water} (${r.county} Co.)` : water;
      const noteBits = ['Seeded from IDNR spring trout stocking schedule.'];
      if (r.region) noteBits.push(`Region: ${r.region}.`);
      if (r.notes) noteBits.push(r.notes);
      return {
        date: r.date,
        locationName,
        state: 'IL',
        species: canonicalSpecies(r.species ?? 'Rainbow Trout'),
        count: typeof r.count === 'number' ? r.count : undefined,
        size: r.size,
        source: 'il-dnr',
        notes: noteBits.join(' '),
      };
    });
}

// ---- Firestore REST helpers ------------------------------------------------

/** Convert a JS value into Firestore's typed Value JSON. Handles only
 *  the primitives we need (string, number, server-timestamp sentinel). */
function toFsValue(v) {
  if (v == null) return { nullValue: null };
  if (typeof v === 'string') return { stringValue: v };
  if (typeof v === 'number') {
    return Number.isInteger(v)
      ? { integerValue: String(v) }
      : { doubleValue: v };
  }
  if (typeof v === 'boolean') return { booleanValue: v };
  throw new Error(`Unsupported value type: ${typeof v}`);
}

/** Build a Firestore Document.fields object from a flat record. */
function buildFields(rec) {
  const fields = {};
  for (const [k, v] of Object.entries(rec)) {
    if (v === undefined) continue;
    fields[k] = toFsValue(v);
  }
  return fields;
}

/** PATCH /documents/stockingEvents/{id} with currentDocument.exists=false
 *  so we only create new docs — re-runs are no-ops, just like the
 *  scrapers' batch.set + existence check pattern. */
async function writeIfMissing(accessToken, id, fields) {
  const url =
    `${FIRESTORE_BASE}/stockingEvents/${encodeURIComponent(id)}` +
    `?currentDocument.exists=false`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  });
  if (res.ok) return 'written';
  if (res.status === 409 || res.status === 400) {
    // 400 with the exists=false precondition means the doc already exists.
    // Some Firestore versions return 409. Either way it's a skip.
    const body = await res.text();
    if (/already exists|precondition/i.test(body)) return 'skipped';
    throw new Error(`Firestore ${res.status}: ${body.slice(0, 200)}`);
  }
  const body = await res.text();
  throw new Error(`Firestore ${res.status}: ${body.slice(0, 200)}`);
}

// ---- main -------------------------------------------------------------------

(async () => {
  const acct = getGlobalDefaultAccount();
  if (!acct) {
    console.error('No firebase CLI account; run `firebase login` first.');
    process.exit(1);
  }
  const refreshToken = acct.user.refreshToken || acct.tokens?.refresh_token;
  const tok = await getAccessToken(refreshToken, [
    'https://www.googleapis.com/auth/datastore',
  ]);
  const accessToken = tok.access_token;
  console.log(`Authed as ${acct.user.email}`);

  const ut = normalizeUt();
  const co = normalizeCo();
  const id = normalizeId();
  const ar = normalizeAr();
  const il = normalizeIl();
  const all = [...ut, ...co, ...id, ...ar, ...il];
  console.log(
    `Normalized: UT ${ut.length}, CO ${co.length}, ID ${id.length}, AR ${ar.length}, IL ${il.length} = ${all.length} total`
  );

  let written = 0;
  let skipped = 0;
  let failed = 0;
  const startMs = Date.now();

  // Sequential writes — Firestore REST is happy with steady throughput
  // and we avoid hammering it with parallel requests. 618 docs at ~25ms
  // each = ~15s total. Progress prints every 50.
  for (let i = 0; i < all.length; i++) {
    const rec = all[i];
    const docId = deriveStockingId(rec.source, rec);
    const fields = buildFields({
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
    });
    // createdAt: use a sentinel via the server. For REST we need to
    // either pass updateMask + a Timestamp value or use the
    // `:commit` endpoint with FieldTransform. Simpler: write a
    // client-side timestamp.
    fields.createdAt = { timestampValue: new Date().toISOString() };

    try {
      const result = await writeIfMissing(accessToken, docId, fields);
      if (result === 'written') written++;
      else if (result === 'skipped') skipped++;
    } catch (e) {
      failed++;
      if (failed <= 5) {
        console.error(`  fail ${docId}:`, e.message.slice(0, 150));
      }
    }
    if ((i + 1) % 50 === 0) {
      console.log(
        `  ${i + 1}/${all.length} processed (written=${written} skipped=${skipped} failed=${failed})`
      );
    }
  }

  const seconds = ((Date.now() - startMs) / 1000).toFixed(1);
  console.log(
    `\nDone in ${seconds}s. Written: ${written} | Skipped (already in db): ${skipped} | Failed: ${failed}`
  );
  process.exit(failed > 0 ? 1 : 0);
})().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
