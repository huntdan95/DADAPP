/**
 * One-shot helper: add 'KY' to the `states` array for every species
 * that's plausibly caught in Kentucky. KY is a major Mississippi/Ohio
 * drainage state with the full suite of freshwater sportfish — see
 * the list below for what applies.
 *
 * Run: node scripts/add-ky-to-species.cjs
 * Output: rewrites data/species.json in place.
 *
 * Idempotent — re-running is a no-op once each entry has KY.
 */

const fs = require('node:fs');
const path = require('node:path');

const FILE = path.join(__dirname, '..', 'data', 'species.json');

// IDs that should include 'KY'. Skipped: anything strictly coastal
// (saltwater + tide species), Great-Lakes-only salmonids, and species
// limited to other states' specific drainages (Suwannee bass, peacock
// bass, snakehead, etc.).
const KY_SPECIES = new Set([
  'smallmouth-bass',
  'largemouth-bass',
  'spotted-bass',
  'alabama-bass',
  'walleye',
  'sauger',
  'saugeye',
  'hybrid-striped-bass',
  'white-bass',
  'yellow-bass',
  'rock-bass',
  'yellow-perch',
  'muskellunge',
  'tiger-muskie',
  'brook-trout',
  'brown-trout',
  'rainbow-trout',
  'lake-sturgeon',
  'carp',
  'channel-catfish',
  'blue-catfish',
  'flathead-catfish',
  'brown-bullhead',
  'black-bullhead',
  'yellow-bullhead',
  'white-catfish',
  'freshwater-drum',
  'bluegill-panfish',
  'redear-sunfish',
  'longear-sunfish',
  'green-sunfish',
  'warmouth',
  'pumpkinseed',
  'crappie',
  'striped-bass',
  'longnose-gar',
  'shortnose-gar',
  'spotted-gar',
  'alligator-gar',
  'bowfin',
  'chain-pickerel',
  'grass-pickerel',
  'smallmouth-buffalo',
  'bigmouth-buffalo',
  'black-buffalo',
  'paddlefish',
  'white-perch',
  'skipjack-herring',
  'gizzard-shad',
  'threadfin-shad',
  'shorthead-redhorse',
  'northern-hog-sucker',
  'quillback',
  'golden-redhorse',
  'black-redhorse',
  'white-sucker',
  'mottled-sculpin',
  'grass-carp',
  'silver-carp',
  'bighead-carp',
  'american-eel',
  'goldfish',
]);

const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));

let added = 0;
let already = 0;
for (const s of data) {
  if (!KY_SPECIES.has(s.id)) continue;
  if (!Array.isArray(s.states)) continue;
  if (s.states.includes('KY')) {
    already++;
    continue;
  }
  s.states.push('KY');
  added++;
}

// Pretty-print with 2-space indent to match the existing file.
fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n');

console.log(`Added KY to ${added} species (already present on ${already}).`);
