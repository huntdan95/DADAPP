/**
 * Retry-only script for the 7 states that hit 529 Overloaded in the
 * previous run: ID, CO, UT, AR, OK, MS, IL.
 *
 * Same auth/init scaffolding as run-stocking-scrapers-local.cjs but
 * calls only those 7 states and has built-in retry.
 */
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

function locateAdcFile() {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) return process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const appdata = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
  const dir = path.join(appdata, 'firebase');
  try {
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('application_default_credentials.json'));
    if (files.length > 0) return path.join(dir, files[0]);
  } catch (_) {}
  const gcp = path.join(os.homedir(), '.config', 'gcloud', 'application_default_credentials.json');
  if (fs.existsSync(gcp)) return gcp;
  return null;
}
const adcPath = locateAdcFile();
if (adcPath) process.env.GOOGLE_APPLICATION_CREDENTIALS = adcPath;

const adminAppMod = require(path.join(__dirname, '..', 'functions', 'node_modules', 'firebase-admin', 'lib', 'app'));
adminAppMod.initializeApp({ projectId: 'dadapp-2cef8' });
const firestoreMod = require(path.join(__dirname, '..', 'functions', 'node_modules', 'firebase-admin', 'lib', 'firestore'));
const db = firestoreMod.getFirestore();

const LIB = path.join(__dirname, '..', 'functions', 'lib', 'scrapers', 'stocking');
const { aiExtractStocking } = require(path.join(LIB, 'aiExtract.js'));
const { FOCUS_WATERS } = require(path.join(LIB, 'focusWaters.js'));

const RETRY_STATES = ['ID', 'CO', 'UT', 'AR', 'OK', 'MS', 'IL'];

async function writeRecords(source, records) {
  let added = 0, skipped = 0;
  for (const r of records) {
    try {
      const idRaw = [source, r.state, (r.locationName || '').toLowerCase(), r.date, (r.species || '').toLowerCase()].join('|');
      const idHash = require('crypto').createHash('sha1').update(idRaw).digest('hex').slice(0, 24);
      const docRef = db.collection('stockingEvents').doc(`${source}-${idHash}`);
      const snap = await docRef.get();
      if (snap.exists) { skipped++; continue; }
      const cleaned = {};
      for (const [k, v] of Object.entries(r)) if (v !== undefined) cleaned[k] = v;
      await docRef.set({ ...cleaned, source, createdAt: firestoreMod.Timestamp.now() });
      added++;
    } catch (e) {
      console.error(`  [write-error ${source}/${r.locationName}] ${e.message || e}`);
    }
  }
  return { added, skipped };
}

async function extractWithRetry(state) {
  for (let attempt = 1; attempt <= 5; attempt++) {
    const r = await aiExtractStocking({
      state,
      focusWaters: FOCUS_WATERS[state] || [],
      lookbackDays: 60,
    });
    const err = r?.apiErrorMessage || '';
    if (!err.includes('overloaded_error') && !err.includes('529')) return r;
    const wait = attempt * 15000; // 15s, 30s, 45s, 60s, 75s
    console.log(`  [retry ${state} attempt ${attempt}/5 after overload, waiting ${wait/1000}s]`);
    await new Promise((res) => setTimeout(res, wait));
  }
  return { events: [], rawText: '', apiErrorMessage: 'exhausted retries' };
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Missing ANTHROPIC_API_KEY');
    process.exit(1);
  }
  console.log('=== Retry overloaded states ===');
  let totalAdded = 0;
  for (const state of RETRY_STATES) {
    const source = `${state.toLowerCase()}-ai`;
    process.stdout.write(`[${source.padEnd(8)}] ${state}: AI extracting...`);
    try {
      const result = await extractWithRetry(state);
      const events = Array.isArray(result?.events) ? result.events : [];
      const enriched = events.map((e) => ({ ...e, state: e.state || state }));
      const { added, skipped } = await writeRecords(source, enriched);
      console.log(` parsed=${enriched.length} new=${added} dup=${skipped} ${result.apiErrorMessage ? '(err: ' + result.apiErrorMessage.slice(0, 50) + ')' : ''}`);
      totalAdded += added;
    } catch (e) {
      console.log(` ERROR: ${e.message}`);
    }
  }

  // Re-inventory
  const snap = await db.collection('stockingEvents').get();
  const byState = {};
  snap.forEach((d) => {
    const s = d.data().state;
    byState[s] = (byState[s] || 0) + 1;
  });
  console.log(`\nTotal stockingEvents: ${snap.size}`);
  console.log(`Per state: ${JSON.stringify(byState)}`);
  console.log(`\nNew events added this run: ${totalAdded}`);

  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
