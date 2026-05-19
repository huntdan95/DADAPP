// Quick inspect of recent stocking events.

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

function locateAdc() {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) return process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const appdata = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
  const dir = path.join(appdata, 'firebase');
  try {
    const f = fs.readdirSync(dir).find((x) => x.endsWith('application_default_credentials.json'));
    if (f) return path.join(dir, f);
  } catch (_) {}
  return null;
}
const adc = locateAdc();
if (adc) process.env.GOOGLE_APPLICATION_CREDENTIALS = adc;

const adminApp = require(path.join(__dirname, '..', 'functions', 'node_modules', 'firebase-admin', 'lib', 'app'));
adminApp.initializeApp({ projectId: 'dadapp-2cef8' });
const fs2 = require(path.join(__dirname, '..', 'functions', 'node_modules', 'firebase-admin', 'lib', 'firestore'));
const db = fs2.getFirestore();

(async () => {
  // 14-day-recent events by state
  const cutoff = new Date(Date.now() - 14 * 86400000).toISOString().slice(0, 10);
  const states = ['TN', 'MI', 'OR', 'CA', 'NV', 'AZ', 'GA', 'NC', 'KY'];
  for (const s of states) {
    const snap = await db
      .collection('stockingEvents')
      .where('state', '==', s)
      .where('date', '>=', cutoff)
      .orderBy('date', 'desc')
      .limit(20)
      .get();
    console.log(`\n=== ${s} (last 14 days: ${snap.size} events) ===`);
    snap.docs.slice(0, 5).forEach((d) => {
      const e = d.data();
      console.log(`  ${e.date}  ${e.species || '?'}  @  ${e.locationName || '?'}  ${e.lat ? '[GPS]' : '[no GPS]'}  source=${e.source}`);
    });
  }
  process.exit(0);
})();
