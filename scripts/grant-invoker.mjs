/**
 * One-shot script: grants `allUsers` the `roles/run.invoker` role on
 * each callable Cloud Run service backing our Firebase Functions.
 *
 * Why: `invoker: 'public'` on v2 `onCall` should do this on deploy, but
 * we saw repeated 401s after multiple deploys — firebase-tools wasn't
 * propagating the IAM binding for this project. This script reaches the
 * Cloud Run REST API directly with the same OAuth token the firebase
 * CLI uses.
 *
 * Run: `node scripts/grant-invoker.mjs`
 */

import authPkg from 'C:/Users/Danny/AppData/Roaming/npm/node_modules/firebase-tools/lib/auth.js';

const { getGlobalDefaultAccount, getAccessToken } = authPkg;

const PROJECT = 'dadapp-2cef8';
const REGION = 'us-central1';
const SERVICES = [
  'briefing',
  'parseJournal',
  'patterns',
  'identifySpecies',
  'analyzePhoto',
  'seedBoatLaunchesCallable',
];

const acct = getGlobalDefaultAccount();
if (!acct) {
  console.error('No firebase CLI account; run `firebase login`.');
  process.exit(1);
}
const refreshToken = acct.user.refreshToken || acct.tokens?.refresh_token;
const tok = await getAccessToken(refreshToken, []);
const token = tok.access_token;
console.log(`Authed as ${acct.user.email}`);

for (const svc of SERVICES) {
  const url = `https://run.googleapis.com/v2/projects/${PROJECT}/locations/${REGION}/services/${svc}:setIamPolicy`;
  const policy = {
    policy: {
      bindings: [
        { role: 'roles/run.invoker', members: ['allUsers'] },
      ],
    },
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(policy),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`${svc}: HTTP ${res.status}\n${body}`);
    continue;
  }
  console.log(`${svc}: granted allUsers run.invoker`);
}
