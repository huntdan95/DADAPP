/**
 * User-supplied Michigan non-hatch fly bank.
 *
 * Two things happen here:
 *   1. Existing MI entries get their `flies` arrays padded with the
 *      specific guide-tied patterns the user listed (Zoo Cougar, Joe's
 *      Hopper, Lynch's White-Bellied Mouse, etc.).
 *   2. Four NEW entries cover categories the database didn't have:
 *      - mi-mouse-patterns        (MI's night game — trophy-brown mousing)
 *      - eastern-attractor-dries  (Patriot, Purple Haze, Wulff, Hippie Stomper)
 *      - mi-sculpin-crayfish-lamprey (subsurface protein, articulated stuff)
 *      - mi-night-frog            (Amphibious Assault et al)
 *
 * Run: node scripts/add-mi-non-hatch-flies.cjs
 * Idempotent — only appends flies and entries that aren't already present.
 */

const fs = require('node:fs');
const path = require('node:path');

const FILE = path.join(__dirname, '..', 'data', 'hatches.json');

// ---- Per-entry fly additions (padding existing entries) -------------------

const FLY_ADDITIONS = {
  'mi-articulated-streamers': [
    // Kelly Galloup canon — born at The Troutsman in Traverse City
    "Zoo Cougar (Galloup) — white",
    "Zoo Cougar (Galloup) — yellow",
    "Zoo Cougar (Galloup) — olive",
    "Zoo Cougar (Galloup) — black",
    'Mini Dungeon (Galloup)',
    'Butt Monkey (Galloup) — dark colors at night',
    'Boogie Man (Galloup)',
    // Other MI-tied modern articulated streamers
    "Circus Peanut (Russ Madden)",
    "Drunk & Disorderly (Tommy Lynch) — burnt orange",
    "Schmidt's Rattlesnake (Ray Schmidt) — Manistee classic",
    'Nutcracker',
    'Flash Monkey',
    "Red Rocket (Mike Schmidt)",
    "Grumpy Muppet (Mike Schmidt)",
    "Meal Ticket (Mike Schmidt)",
    "Strolis's Ice Pick",
    'Headbanger Sculpin',
    'Hog Snare (Strolis)',
    "Chuck Hawkins's Parr None — early-spring salmon-parr imitation",
    // Classics still in service
    'Size 4-8 olive / black / white Wooly Bugger',
    'Size 4 Muddler Minnow',
    'Size 6 Mickey Finn',
    'Size 4 Black Ghost',
    'Size 4 weighted Wet Skunk — work tight to wood',
  ],

  'mi-king-salmon-eggs': [
    'Glo Bug — multiple colors',
    'Estaz Egg — chartreuse / orange',
    'Clown Egg — multi-color',
    'Otter Egg',
    'Crystal Meth',
    'Steelhead Hammer',
    'Nuke Egg',
    'Size 8 sucker spawn (cream / pink)',
  ],

  'mi-steelhead-eggs': [
    'Glo Bug',
    'Estaz Egg (peach / chartreuse / oregon-cheese)',
    'Clown Egg — Michigan favorite',
    'Otter Egg',
    'Crystal Meth',
    'Steelhead Hammer',
    'Nuke Egg',
    'Sucker Spawn (cream)',
    'Sexy Hex Nymph — searching nymph between drifts',
    'Spey pattern (purple / blue / black) — swung',
    'Intruder pattern — swung',
  ],

  'mi-grasshoppers': [
    "Joe's Hopper aka Michigan Hopper (Art Winnie original, Traverse City — genuine MI classic, 1900s)",
    "Madsen's Skunk — MI classic; fish wet or dry",
  ],

  'mi-beetles': [
    'Hippie Stomper — doubles as attractor',
  ],
};

// ---- New entries -----------------------------------------------------------

const NEW_ENTRIES = [
  {
    id: 'mi-mouse-patterns',
    name: 'Mouse Patterns (MI night game)',
    scientific: 'Mouse / vole imitation',
    regions: ['Upper Midwest'],
    states: ['MI'],
    rivers: ['Au Sable', 'Pere Marquette', 'Big Manistee', 'Upper Manistee', 'Boardman'],
    startMonth: 6,
    endMonth: 9,
    waterTempMinF: 60,
    waterTempMaxF: 72,
    timeOfDay: 'night',
    stages: ['streamer', 'mouse'],
    flies: [
      "Lynch's White-Bellied Mouse (Tommy Lynch) — trophy-brown specialist",
      "McCoy's Mouse (Ed McCoy) — wiggle tail + foam head, deer-mouse profile",
      'Morrish Mouse',
      'Master Splinter (articulated)',
      'Mr. Hanky (articulated)',
      'Standard deer-hair mouse',
      'Mouse Rat — old reliable',
    ],
    searchTerm: "mouse pattern fly fishing Michigan trophy brown trout night",
    wikipediaSlug: null,
    notes:
      "MI's other claim to fame after Hex. Big browns hunt mice along undercut banks + log jams after dark. Tommy Lynch's White-Bellied Mouse and Ed McCoy's Mouse are MI-origin classics. Fish heavy tippet (1X-2X) — strikes are aggressive.",
  },
  {
    id: 'eastern-attractor-dries',
    name: 'Attractor Dries (searching patterns)',
    scientific: 'Generic attractor — not species-matching',
    regions: ['Upper Midwest', 'Southern Appalachia', 'Mid-Atlantic', 'Northeast'],
    states: ['MI', 'TN', 'GA', 'NC', 'KY', 'PA', 'AR', 'IN', 'OK'],
    rivers: [
      'Au Sable', 'Big Manistee', 'Upper Manistee', 'Pere Marquette',
      'Caney Fork', 'South Holston', 'Watauga', 'Hiwassee River',
      'Toccoa River', 'Soque River', 'Davidson River',
    ],
    startMonth: 5,
    endMonth: 10,
    waterTempMinF: 50,
    waterTempMaxF: 72,
    timeOfDay: 'afternoon',
    stages: ['always-on', 'attractor'],
    flies: [
      "Patriot Fly (red/white/blue) — Josh Greenberg's go-to at Gates Au Sable Lodge",
      'Purple Patriot — May version of the Patriot',
      'Purple Haze — Western pattern that fishes hard in MI too',
      'Royal Wulff — works almost anywhere',
      'Royal Coachman',
      'Hippie Stomper — doubles as terrestrial attractor',
      'Stimulator (yellow / orange) — broad attractor',
      'Size 14-16 Adams parachute',
      "Madsen's Skunk — MI classic, fish wet or dry",
    ],
    searchTerm: 'attractor dry fly Patriot Purple Haze Royal Wulff',
    wikipediaSlug: null,
    notes:
      "Not matching anything specific — searching patterns that prospect when nothing's coming off. Bright + visible, easy to track in riffles. Lead with these on unfamiliar water or slow afternoons.",
  },
  {
    id: 'mi-sculpin-crayfish-lamprey',
    name: 'Sculpins, Crayfish & Lamprey (MI subsurface protein)',
    scientific: 'Cottidae / Crayfish / Petromyzontidae',
    regions: ['Upper Midwest'],
    states: ['MI'],
    rivers: ['Big Manistee', 'Au Sable', 'Pere Marquette', 'Muskegon', 'Boardman'],
    startMonth: 4,
    endMonth: 11,
    waterTempMinF: 38,
    waterTempMaxF: 70,
    timeOfDay: 'all day',
    stages: ['always-on'],
    flies: [
      "Sculpzilla — articulated sculpin staple",
      "Galloup's Articulated Sculpin",
      "Goldie (Galloup) — golden sculpin variant",
      'Headbanger Sculpin',
      "Strolis's Hog Snare",
      'Near-Nuff Crayfish',
      'Whitlock\'s Near Nuff Crayfish',
      'Clouser Crayfish',
      'Articulated crayfish (orange / olive — fall spawning colors)',
      'Chestnut Lamprey pattern — early-spring Manistee specialty',
      "Articulated lamprey ('crawl out of mud' presentation)",
    ],
    searchTerm: 'sculpin pattern crayfish fly lamprey Michigan trout',
    wikipediaSlug: 'Cottus_bairdii',
    notes:
      "Subsurface protein anchors a MI brown's diet. Sculpins along the bottom, crayfish in slow water + the fall pre-spawn, chestnut lamprey 'crawl out of the mud' on the Manistee in early spring — trout key on them so hard some MI guides treat lamprey as a streamer match-the-hatch.",
  },
  {
    id: 'mi-night-frog',
    name: 'Night Frog Patterns (MI trophy browns + smallmouth)',
    scientific: 'Anura imitation',
    regions: ['Upper Midwest'],
    states: ['MI'],
    rivers: ['Big Manistee', 'Au Sable', 'Pere Marquette', 'Grand Traverse Bay tribs'],
    startMonth: 6,
    endMonth: 9,
    waterTempMinF: 62,
    waterTempMaxF: 75,
    timeOfDay: 'night',
    stages: ['streamer', 'frog'],
    flies: [
      "McCoy's Amphibious Assault (Ed McCoy) — MI guide go-to",
      'Whitlock Hair Frog',
      'Foam-bodied night frog',
      'Standard deer-hair frog',
      'Articulated frog (chartreuse / leopard)',
      'Polar Changer — also smallmouth on lower Manistee',
      'Diver pattern — Grand Traverse Bay smallmouth tribs',
    ],
    searchTerm: 'frog pattern fly night fishing brown trout Michigan',
    wikipediaSlug: null,
    notes:
      'Night fishing for trophy browns; also smallmouth on the lower Manistee and Grand Traverse Bay tribs. McCoy\'s Amphibious Assault is the MI guide go-to. Strip with hard pauses; strikes are explosive.',
  },
];

// ---- Runner ----------------------------------------------------------------

const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const byId = new Map(data.map((h) => [h.id, h]));

let padded = 0;
let totalAdded = 0;
for (const [id, extras] of Object.entries(FLY_ADDITIONS)) {
  const entry = byId.get(id);
  if (!entry) {
    console.warn(`  MISSING target: ${id}`);
    continue;
  }
  const existing = new Set(entry.flies.map((f) => f.toLowerCase().trim()));
  let added = 0;
  for (const f of extras) {
    if (!existing.has(f.toLowerCase().trim())) {
      entry.flies.push(f);
      added++;
      totalAdded++;
    }
  }
  if (added > 0) {
    console.log(`  ${id}: +${added} (now ${entry.flies.length})`);
    padded++;
  }
}

let appended = 0;
for (const e of NEW_ENTRIES) {
  if (byId.has(e.id)) {
    console.log(`  exists ${e.id} (no overwrite)`);
    continue;
  }
  data.push(e);
  byId.set(e.id, e);
  console.log(`  + ${e.id} (${e.states.join(',')} · ${e.flies.length} flies)`);
  appended++;
}

console.log(`\nPadded ${padded} entries (+${totalAdded} flies); added ${appended} new entries.`);
console.log(`Total hatches: ${data.length}`);

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log(`Wrote ${FILE}`);
