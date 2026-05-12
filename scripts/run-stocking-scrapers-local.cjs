/**
 * Local runner for the stocking scrapers.
 *
 * Loads the compiled scrapers from functions/lib/, initializes firebase-admin
 * with Application Default Credentials from the Firebase CLI's stored token,
 * and runs each scraper sequentially against PRODUCTION Firestore.
 *
 * Goals:
 *   - Hit every state's free HTML/CSV scraper to populate fresh data
 *   - Invoke aiExtractStocking() directly for the 7 new Western states
 *     (WY/NM/AZ/NV/CA/OR/WA) which aren't in the SCRAPERS list yet
 *   - Bypass the 7-day cache check by passing skipRecentCheck=true equivalent
 *     (calling aiExtract directly rather than going through index.runAll)
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-ant-... \
 *   GOOGLE_APPLICATION_CREDENTIALS=path/to/adc.json \
 *   node scripts/run-stocking-scrapers-local.cjs
 *
 * The script auto-discovers Firebase CLI's stored ADC if env var unset.
 */

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

// ---- Auto-locate Firebase CLI Application Default Credentials --------------
function locateAdcFile() {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return process.env.GOOGLE_APPLICATION_CREDENTIALS;
  }
  const appdata = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
  const dir = path.join(appdata, 'firebase');
  try {
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('application_default_credentials.json'));
    if (files.length > 0) {
      return path.join(dir, files[0]);
    }
  } catch (_) {}
  // Fallback: ~/.config/gcloud
  const gcp = path.join(os.homedir(), '.config', 'gcloud', 'application_default_credentials.json');
  if (fs.existsSync(gcp)) return gcp;
  return null;
}

const adcPath = locateAdcFile();
if (adcPath) {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = adcPath;
  console.log('[auth] using ADC from', adcPath);
} else {
  console.warn('[auth] no ADC found — initializeApp() will likely fail');
}

// ---- Initialize firebase-admin ---------------------------------------------
const adminAppMod = require(path.join(
  __dirname, '..', 'functions', 'node_modules', 'firebase-admin', 'lib', 'app'
));
adminAppMod.initializeApp({ projectId: 'dadapp-2cef8' });

const firestoreMod = require(path.join(
  __dirname, '..', 'functions', 'node_modules', 'firebase-admin', 'lib', 'firestore'
));
const db = firestoreMod.getFirestore();

// ---- Re-implement scraper orchestration with direct DB writes --------------
// The compiled functions/lib code expects to run inside Cloud Functions
// (relies on initializeApp() at module-load time + getFirestore() inside
// each scraper). We've initialized admin already, so the scrapers' internal
// getFirestore() calls will return our app's Firestore instance.

const LIB = path.join(__dirname, '..', 'functions', 'lib', 'scrapers', 'stocking');

// Load each state scraper
const SCRAPERS = [
  { source: 'twra',     state: 'TN', scrape: require(path.join(LIB, 'twra.js')).scrape },
  { source: 'ga-dnr',   state: 'GA', scrape: require(path.join(LIB, 'gaDnr.js')).scrape },
  { source: 'nc-wrc',   state: 'NC', scrape: require(path.join(LIB, 'ncWrc.js')).scrape },
  { source: 'mi-dnr',   state: 'MI', scrape: require(path.join(LIB, 'miDnr.js')).scrape },
  { source: 'in-dnr',   state: 'IN', scrape: require(path.join(LIB, 'inDnr.js')).scrape },
  { source: 'fwc',      state: 'FL', scrape: require(path.join(LIB, 'fwc.js')).scrape },
  { source: 'al-dcnr',  state: 'AL', scrape: require(path.join(LIB, 'alDcnr.js')).scrape },
  { source: 'ky-dfwr',  state: 'KY', scrape: require(path.join(LIB, 'kyDfwr.js')).scrape },
  { source: 'pa-fbc',   state: 'PA', scrape: require(path.join(LIB, 'paFbc.js')).scrape },
  { source: 'mt-fwp',   state: 'MT', scrape: require(path.join(LIB, 'mtFwp.js')).scrape },
  { source: 'id-fg',    state: 'ID', scrape: require(path.join(LIB, 'idFg.js')).scrape },
  { source: 'co-cpw',   state: 'CO', scrape: require(path.join(LIB, 'coCpw.js')).scrape },
  { source: 'ut-dwr',   state: 'UT', scrape: require(path.join(LIB, 'utDwr.js')).scrape },
  { source: 'ar-agfc',  state: 'AR', scrape: require(path.join(LIB, 'arAgfc.js')).scrape },
  { source: 'ok-odwc',  state: 'OK', scrape: require(path.join(LIB, 'okOdwc.js')).scrape },
  { source: 'ms-mdwfp', state: 'MS', scrape: require(path.join(LIB, 'msMdwfp.js')).scrape },
  { source: 'il-dnr',   state: 'IL', scrape: require(path.join(LIB, 'ilDnr.js')).scrape },
];

// AI-only states (no HTML scraper exists for these)
const AI_ONLY_STATES = ['WY', 'NM', 'AZ', 'NV', 'CA', 'OR', 'WA'];

// When AI_REFRESH_ALL=1, also re-run AI extraction for ALL 17 HTML-scraper
// states, bypassing the 7-day cache. Useful for a one-shot full refresh.
const AI_REFRESH_ALL_STATES = [
  'TN', 'GA', 'NC', 'MI', 'IN', 'FL', 'AL', 'KY', 'PA', 'MT',
  'ID', 'CO', 'UT', 'AR', 'OK', 'MS', 'IL',
];

async function writeRecordsToFirestore(source, records) {
  if (records.length === 0) return { added: 0, skipped: 0 };
  let added = 0, skipped = 0;

  for (const r of records) {
    try {
      // Deterministic ID: source + state + locationName + date + species
      const idRaw = [
        source,
        r.state,
        (r.locationName || '').toLowerCase(),
        r.date,
        (r.species || '').toLowerCase(),
      ].join('|');
      const idHash = require('crypto').createHash('sha1').update(idRaw).digest('hex').slice(0, 24);
      const docId = `${source}-${idHash}`;
      const docRef = db.collection('stockingEvents').doc(docId);

      const snap = await docRef.get();
      if (snap.exists) {
        skipped++;
        continue;
      }

      // Strip undefined fields — Firestore rejects undefined values.
      const cleaned = {};
      for (const [k, v] of Object.entries(r)) {
        if (v !== undefined) cleaned[k] = v;
      }
      await docRef.set({
        ...cleaned,
        source,
        createdAt: firestoreMod.Timestamp.now(),
      });
      added++;
    } catch (e) {
      console.error(`  [write-error ${source}/${r.state}/${r.locationName}] ${e.message || e}`);
    }
  }
  return { added, skipped };
}

async function runHtmlScrapers() {
  console.log('\n=== Running 17 HTML/CSV scrapers ===');
  const results = [];
  for (const { source, state, scrape } of SCRAPERS) {
    process.stdout.write(`[${source.padEnd(10)}] ${state}: scraping...`);
    try {
      const records = await scrape();
      // Tag the state if scrape doesn't already
      const enriched = records.map((r) => ({ ...r, state: r.state || state }));
      const { added, skipped } = await writeRecordsToFirestore(source, enriched);
      console.log(` parsed=${records.length} new=${added} dup=${skipped}`);
      results.push({ source, state, parsed: records.length, added, skipped, error: null });
    } catch (e) {
      console.log(` ERROR: ${e.message}`);
      results.push({ source, state, parsed: 0, added: 0, skipped: 0, error: e.message });
    }
  }
  return results;
}

async function runAiForState(source, state, focusWaters) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return { added: 0, skipped: 0, parsed: 0, error: 'no ANTHROPIC_API_KEY in env' };
  }
  const { aiExtractStocking } = require(path.join(LIB, 'aiExtract.js'));
  // Retry-with-backoff for 529 Overloaded
  let result = null;
  for (let attempt = 1; attempt <= 4; attempt++) {
    result = await aiExtractStocking({
      state,
      focusWaters: focusWaters || [],
      lookbackDays: 60,
    });
    const errStr = result?.apiErrorMessage || '';
    if (!errStr.includes('overloaded_error') && !errStr.includes('529')) break;
    const wait = attempt * 12000; // 12s, 24s, 36s, 48s
    process.stdout.write(`\n  [retry ${state} attempt ${attempt}/4 after overload — waiting ${wait/1000}s]`);
    await new Promise((r) => setTimeout(r, wait));
  }
  // aiExtractStocking returns { events, rawText, ... }
  const events = Array.isArray(result?.events) ? result.events : [];
  if (process.env.STOCK_DEBUG) {
    console.log(`\n  [debug ${state}] result keys: ${Object.keys(result || {}).join(',')}, events.length: ${events.length}`);
    if (events[0]) console.log(`  [debug ${state}] sample event: ${JSON.stringify(events[0])}`);
  }
  // Ensure state is populated
  const enriched = events.map((e) => ({ ...e, state: e.state || state }));
  const { added, skipped } = await writeRecordsToFirestore(source, enriched);
  return { parsed: enriched.length, added, skipped, error: null };
}

async function runAiForStates(stateList, label) {
  console.log(`\n=== AI extraction for ${stateList.length} states (${label}) ===`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('[ai] ANTHROPIC_API_KEY not set — skipping');
    return [];
  }
  const { FOCUS_WATERS } = require(path.join(LIB, 'focusWaters.js'));
  const results = [];
  for (const state of stateList) {
    const source = `${state.toLowerCase()}-ai`;
    process.stdout.write(`[${source.padEnd(10)}] ${state}: AI extracting...`);
    try {
      const r = await runAiForState(source, state, FOCUS_WATERS[state] || []);
      console.log(` parsed=${r.parsed} new=${r.added} dup=${r.skipped}`);
      results.push({ source, state, ...r });
    } catch (e) {
      console.log(` ERROR: ${e.message}`);
      results.push({ source, state, parsed: 0, added: 0, skipped: 0, error: e.message });
    }
  }
  return results;
}

async function runAiForNewWesternStates() {
  return runAiForStates(AI_ONLY_STATES, 'new Western states');
}
async function runAiForAllScraperStates() {
  return runAiForStates(AI_REFRESH_ALL_STATES, 'full-refresh existing states');
}

async function inventoryFirestore() {
  const snap = await db.collection('stockingEvents').get();
  const byState = {};
  const bySource = {};
  let oldest = null, newest = null;
  snap.forEach((d) => {
    const data = d.data();
    byState[data.state] = (byState[data.state] || 0) + 1;
    bySource[data.source] = (bySource[data.source] || 0) + 1;
    if (data.date) {
      if (!oldest || data.date < oldest) oldest = data.date;
      if (!newest || data.date > newest) newest = data.date;
    }
  });
  return { total: snap.size, byState, bySource, oldest, newest };
}

async function main() {
  console.log('\n=== BEFORE ===');
  const before = await inventoryFirestore();
  console.log(`stockingEvents total: ${before.total}`);
  console.log(`by state: ${JSON.stringify(before.byState)}`);
  console.log(`by source: ${JSON.stringify(before.bySource)}`);
  console.log(`date range: ${before.oldest} -> ${before.newest}`);

  const htmlResults = await runHtmlScrapers();
  const aiResults = await runAiForNewWesternStates();
  const aiRefreshResults = process.env.AI_REFRESH_ALL
    ? await runAiForAllScraperStates()
    : [];

  console.log('\n=== AFTER ===');
  const after = await inventoryFirestore();
  console.log(`stockingEvents total: ${after.total} (was ${before.total}, +${after.total - before.total})`);
  console.log(`by state: ${JSON.stringify(after.byState)}`);
  console.log(`by source: ${JSON.stringify(after.bySource)}`);
  console.log(`date range: ${after.oldest} -> ${after.newest}`);

  console.log('\n=== SUMMARY ===');
  const sum = (rows, key) => rows.reduce((s, r) => s + r[key], 0);
  console.log(`HTML scrapers (17): parsed=${sum(htmlResults, 'parsed')}, added=${sum(htmlResults, 'added')}`);
  console.log(`AI Western (7):     parsed=${sum(aiResults, 'parsed')}, added=${sum(aiResults, 'added')}`);
  if (aiRefreshResults.length) {
    console.log(`AI full-refresh (17): parsed=${sum(aiRefreshResults, 'parsed')}, added=${sum(aiRefreshResults, 'added')}`);
  }
  const totalAdded = sum(htmlResults, 'added') + sum(aiResults, 'added') + sum(aiRefreshResults, 'added');
  const totalParsed = sum(htmlResults, 'parsed') + sum(aiResults, 'parsed') + sum(aiRefreshResults, 'parsed');
  console.log(`Total parsed=${totalParsed}, added=${totalAdded}`);

  process.exit(0);
}

main().catch((e) => {
  console.error('FATAL', e);
  process.exit(1);
});
