/**
 * Pad the 18 hatch entries that ended up with fewer than 4 fly
 * patterns. Per-entry additions are hand-picked so the resulting
 * toolkit covers different presentations (surface / emerger /
 * subsurface / streamer-style where applicable), not duplicate
 * variations of the same fly.
 *
 * Run: node scripts/pad-thin-fly-arrays.cjs
 * Idempotent — only appends flies that aren't already present.
 */

const fs = require('node:fs');
const path = require('node:path');

const FILE = path.join(__dirname, '..', 'data', 'hatches.json');

// Per-entry list of flies to ADD (will be skipped if already present).
const ADDITIONS = {
  // ---- Western tailwater / Western patterns -------------------------------
  'spruce-moth': [
    'Size 10 Madame X (tan)',
    "Size 12 Goddard caddis (tan, riding low)",
    'Size 12 spruce moth pupa (subsurface)',
  ],
  'pink-albert': [
    'Size 16 Pink Albert female (yellow body)',
    'Size 16 Pink Albert CDC dun',
    'Size 14 pheasant-tail nymph (rusty)',
  ],
  'mysis-shrimp': [
    "Size 16 Mercer's Mysis",
    'Size 18 UV Mysis (epoxy back)',
    'Size 16 olive scud (alt color)',
    'Size 18 disco midge (white) — bottom-drift cousin',
  ],
  'sowbug': [
    'Size 14-16 olive sowbug (Czech-style)',
    'Size 16 ribbed cress bug (UV pearl)',
    'Size 14 pink Mop fly (sowbug attractor)',
  ],

  // ---- MI stoneflies ------------------------------------------------------
  'mi-tiny-black-stonefly': [
    "Size 16-18 Pat's rubber-legs (black)",
    'Size 18 winter black stone nymph',
    "Size 18 small black Stimulator",
  ],
  'mi-early-black-stonefly': [
    "Size 12-14 Pat's rubber-legs (black)",
    'Size 14 black foam stone (low rider)',
    'Size 12 Bullethead Black Stone (early spring)',
  ],
  'mi-early-brown-stonefly': [
    "Size 12-14 Pat's rubber-legs (brown)",
    'Size 14 brown Stimulator',
    'Size 14 Bullethead Brown Stone',
  ],
  'mi-medium-brown-stonefly': [
    "Size 8-12 Pat's rubber-legs (brown)",
    'Size 10 brown Bullethead Stone',
    'Size 10 brown Madame X',
  ],
  'mi-giant-stonefly': [
    'Size 4-6 Sofa Pillow (orange / brown)',
    "Size 6 Rogue stone",
    'Size 6 Norm Wood\'s salmonfly (Eastern)',
  ],
  'mi-big-golden-stonefly': [
    'Size 6-8 Golden Stone Madame X',
    'Size 8 Yellow Stimulator',
    'Size 6 Pat\'s rubber-legs (golden)',
  ],

  // ---- MI terrestrials ---------------------------------------------------
  'mi-green-oak-worm': [
    'Size 10-12 green inchworm (chenille)',
    'Size 10 foam green caterpillar',
    "Size 12 deer-hair caterpillar (chartreuse)",
    'Size 12 green Mop fly',
  ],
  'mi-beetles': [
    'Size 12 Japanese beetle (iridescent foam)',
    "Size 14 Dave's beetle (peacock)",
    'Size 14 deer-hair beetle (low-riding)',
  ],
  'mi-crickets': [
    'Size 10 Dave\'s cricket',
    "Size 10 foam cricket (black)",
    'Size 10 deer-hair cricket',
    'Size 10 Letort cricket',
  ],
  'mi-grasshoppers': [
    'Size 8 Project Hopper',
    "Size 10 Chubby Chernobyl (tan)",
    'Size 10 Morrish Hopper',
    'Size 8 Whit\'s Hopper',
  ],

  // ---- Eastern shared ----------------------------------------------------
  'eastern-early-black-stonefly': [
    "Size 16-18 Pat's rubber-legs (black)",
    'Size 18 black foam stone',
    'Size 18 black soft-hackle (wet)',
  ],
  'eastern-giant-black-stonefly': [
    'Size 4-6 Sofa Pillow (black/orange)',
    "Size 6 black Stimulator",
    'Size 6 Eastern Salmonfly (Pteronarcys dorsata adult)',
  ],
  'tn-cicadas-periodic': [
    'Size 6 Chubby Chernobyl (cicada colors: black body, orange post)',
    "Size 4 Project Cicada (foam)",
    'Size 8 deer-hair cicada',
    'Size 6 BIG black ant (cicada substitute)',
  ],
  'eastern-inchworms': [
    "Size 12 deer-hair inchworm",
    'Size 14 green Mop fly',
    'Size 12 foam green worm',
  ],
};

// ---- Runner -------------------------------------------------------------

const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const byId = new Map(data.map((h) => [h.id, h]));

let padded = 0;
let totalAdded = 0;
let missing = 0;

for (const [id, extras] of Object.entries(ADDITIONS)) {
  const entry = byId.get(id);
  if (!entry) {
    console.warn(`  MISSING: ${id}`);
    missing++;
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
  } else {
    console.log(`  ${id}: noop (all extras already present)`);
  }
}

console.log(`\nPadded ${padded} entries; +${totalAdded} new fly references.`);
if (missing > 0) console.warn(`Missing target ids: ${missing}`);

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log(`Wrote ${FILE}`);
