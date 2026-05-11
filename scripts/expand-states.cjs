/**
 * Bulk-adds the 9 new states to applicable existing species in
 * data/species.json. Mapping is conservative — only adds a state if
 * the species is genuinely present and targetable in that state's
 * waters. Idempotent.
 *
 * Run: node scripts/expand-states.cjs
 */

const fs = require('node:fs');
const path = require('node:path');

const FILE = path.join(__dirname, '..', 'data', 'species.json');

// For each NEW state, list the species IDs that apply there. Pulled
// from regional angling references — focused on commonly-targeted
// sport / panfish / catfish species. Conservative on edge cases
// (e.g. tarpon in MS is real but rare; we include because Gulf coast).

// Western: only freshwater coldwater + select reservoir species. No
// saltwater, no Great-Lakes-only fish.
const WESTERN = new Set([
  'rainbow-trout', 'brown-trout', 'brook-trout',
  'lake-trout',                 // Tahoe, Flaming Gorge, Yellowstone Lake
  'tiger-trout',                // some Western stocking
  'splake',                     // some Western stocking
  'largemouth-bass', 'smallmouth-bass', 'spotted-bass',
  'walleye', 'sauger', 'saugeye',
  'yellow-perch',
  'crappie',
  'bluegill-panfish', 'green-sunfish', 'pumpkinseed',
  'northern-pike',
  'tiger-muskie',
  'channel-catfish',
  'brown-bullhead', 'black-bullhead', 'yellow-bullhead',
  'carp',
  'striped-bass',               // Powell, Mead, Pueblo
  'hybrid-striped-bass',
  'white-bass',
  'mottled-sculpin',
  'longnose-sucker', 'white-sucker', 'shorthead-redhorse',
  'mountain-whitefish',         // new entry
  'kokanee-salmon',             // new entry
  'cutthroat-trout',            // new entry
  'goldfish',
]);

// Eastern / Mid-South additions: full freshwater roster like KY.
// Coastal MS gets a few Gulf saltwater species. PA gets Lake Erie
// salmonid trib species.

const MIDWEST = new Set([
  // Bass complex
  'smallmouth-bass', 'largemouth-bass', 'spotted-bass',
  'alabama-bass', 'white-bass', 'yellow-bass',
  'hybrid-striped-bass', 'striped-bass',
  'rock-bass',
  // Walleye
  'walleye', 'sauger', 'saugeye',
  // Esox
  'muskellunge', 'tiger-muskie', 'northern-pike',
  'chain-pickerel', 'grass-pickerel', 'redfin-pickerel',
  // Trout (where stocked)
  'rainbow-trout', 'brown-trout', 'brook-trout',
  // Catfish
  'channel-catfish', 'blue-catfish', 'flathead-catfish',
  'brown-bullhead', 'black-bullhead', 'yellow-bullhead',
  'white-catfish',
  // Panfish
  'bluegill-panfish', 'redear-sunfish', 'pumpkinseed', 'longear-sunfish',
  'green-sunfish', 'warmouth', 'spotted-sunfish', 'flier',
  'redbreast-sunfish',
  'crappie',
  'yellow-perch',
  // Suckers / buffalo / primitive
  'smallmouth-buffalo', 'bigmouth-buffalo', 'black-buffalo',
  'northern-hog-sucker', 'shorthead-redhorse', 'golden-redhorse', 'black-redhorse',
  'white-sucker', 'quillback',
  'paddlefish', 'shovelnose-sturgeon', 'lake-sturgeon',
  'longnose-gar', 'shortnose-gar', 'spotted-gar', 'alligator-gar',
  'bowfin',
  // Shad / herring / eel
  'skipjack-herring', 'gizzard-shad', 'threadfin-shad',
  'american-shad', 'hickory-shad', 'blueback-herring',
  'american-eel',
  // Invasive / forage
  'grass-carp', 'silver-carp', 'bighead-carp', 'carp', 'goldfish',
  'freshwater-drum',
  'mottled-sculpin',
]);

// State-specific overrides — adds to the base set or removes.

const PA_EXTRAS = new Set([
  // Lake Erie tributaries
  'steelhead', 'coho-salmon', 'king-salmon', 'lake-whitefish',
  'burbot',                      // Lake Erie
  'tiger-trout',
  // PA Atlantic-coast streams have shad runs
  'atlantic-salmon',             // limited; restored populations
]);

// MS / AL Gulf-coast saltwater
const GULF_COAST = new Set([
  'redfish', 'sea-trout', 'flounder', 'sheepshead-salt', 'black-drum',
  'tripletail', 'pompano', 'spanish-mackerel', 'king-mackerel', 'cobia',
  'jack-crevalle', 'ladyfish', 'bluefish', 'whiting-kingfish',
  'spot', 'atlantic-croaker', 'mangrove-snapper',
  'tarpon', 'sand-seatrout', 'gulf-flounder',
  'striped-mullet', 'pinfish',
  'blacktip-shark', 'bull-shark', 'bonnethead-shark', 'spinner-shark',
  'sandbar-shark', 'blacknose-shark',
  'red-snapper', 'gag-grouper', 'red-grouper',
  'amberjack', 'triggerfish',
  'mahi-mahi', 'wahoo', 'blackfin-tuna', 'sailfish',
  'atlantic-bonito',
]);

const STATE_SPECIES = {
  MS: new Set([...MIDWEST, ...GULF_COAST]),
  AR: MIDWEST,
  OK: MIDWEST,
  IL: MIDWEST,
  PA: new Set([...MIDWEST, ...PA_EXTRAS]),
  MT: WESTERN,
  ID: WESTERN,
  UT: WESTERN,
  CO: WESTERN,
};

const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));

const totals = {};
for (const state of Object.keys(STATE_SPECIES)) totals[state] = 0;

for (const s of data) {
  if (!Array.isArray(s.states)) continue;
  for (const [state, allowed] of Object.entries(STATE_SPECIES)) {
    if (!allowed.has(s.id)) continue;
    if (s.states.includes(state)) continue;
    s.states.push(state);
    totals[state]++;
  }
}

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n');
console.log('Species added per state:');
for (const [state, n] of Object.entries(totals)) {
  console.log(`  ${state}: +${n}`);
}
