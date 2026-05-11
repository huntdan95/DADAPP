/**
 * Round-2 state additions — Pacific salmonid runs that I missed in
 * the initial Western pass. ID's Snake / Salmon River drainages get
 * legit ocean-run steelhead, chinook (king), and coho. Also a few
 * other tweaks: lake-trout to UT/CO (Flaming Gorge, Granby); striped
 * bass to OK (Texoma) etc.
 */

const fs = require('node:fs');
const path = require('node:path');

const FILE = path.join(__dirname, '..', 'data', 'species.json');

const ADDITIONS = {
  // ID gets Snake River salmonids
  ID: ['steelhead', 'king-salmon', 'coho-salmon', 'lake-whitefish'],
  // UT — Flaming Gorge, Strawberry, Bear Lake
  UT: ['lake-trout', 'lake-whitefish'],
  // CO — Granby, Blue Mesa, Eleven Mile
  CO: ['lake-trout'],
  // MT — broader trout coverage
  MT: ['lake-trout', 'splake'],
  // PA — Lake Erie salmonid run is real
  // (already added in v1 PA_EXTRAS; just confirm)
  // OK — Texoma stripers, blue cats in Red River
  OK: ['atlantic-striper'],
  // MS — alligator-gar trophy in the river
  // (already covered via Gulf-coast set, but ensure)
  // AR — White River tailwater rainbows
  // (already covered)
  // IL — pike, muskie (Fox Chain, etc.)
  // (already covered)
};

const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
let added = 0;
for (const s of data) {
  if (!Array.isArray(s.states)) continue;
  for (const [state, ids] of Object.entries(ADDITIONS)) {
    if (!ids.includes(s.id)) continue;
    if (s.states.includes(state)) continue;
    s.states.push(state);
    added++;
  }
}

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n');
console.log(`v2 additions: ${added} state-species links`);
