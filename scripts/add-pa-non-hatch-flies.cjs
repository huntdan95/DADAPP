/**
 * User-supplied Pennsylvania non-hatch fly bank — terrestrials,
 * streamers, attractors, junk nymphs, Erie steelhead, lanternflies.
 *
 *   1. Pad existing entries (eastern-attractor-dries, san-juan-worm,
 *      eastern-inchworms) with PA-specific named patterns.
 *   2. Add 5 new entries:
 *      - pa-letort-terrestrials   (Marinaro/Shenk Letort tradition)
 *      - pa-cicada-lanternfly     (PA-specific invasives)
 *      - eastern-streamers        (Wooly Bugger + Clouser PA-origin)
 *      - pa-erie-steelhead-alley  (Walnut/Elk Creek season)
 *      - eastern-junk-nymphs      (Green Weenie + Mop + worms)
 *
 * Run: node scripts/add-pa-non-hatch-flies.cjs
 * Idempotent — only adds flies/entries that aren't already present.
 */

const fs = require('node:fs');
const path = require('node:path');

const FILE = path.join(__dirname, '..', 'data', 'hatches.json');

// ---- Per-entry fly additions ---------------------------------------------

const FLY_ADDITIONS = {
  'eastern-attractor-dries': [
    'Mr. Rapidan (Harry Murray) — small-stream brookie gold; dry-dropper rig staple',
    'Neversink Caddis — small-stream high-floater for brookie pocket water',
    'Parachute Adams — buggy enough to suggest a hatch; mostly searched',
    'Size 14-16 Stimulator (orange / royal variants)',
  ],
  'san-juan-worm': [
    'Bead-Head Green Weenie — PA-born inchworm/caterpillar suggestion; deadly on the Little Juniata',
    'Mop Fly — much-debated, undeniably effective',
    'Squirmy Wormy (chartreuse / pink / wine)',
  ],
  'eastern-inchworms': [
    'Bead-Head Green Weenie — PA-born inchworm classic',
  ],
};

// ---- New entries ----------------------------------------------------------

const NEW_ENTRIES = [
  {
    id: 'pa-letort-terrestrials',
    name: 'Letort Terrestrials (PA-invented genre)',
    scientific: 'Hymenoptera / Coleoptera / Orthoptera (foam imitation)',
    regions: ['Mid-Atlantic', 'Southern Appalachia'],
    states: ['PA', 'NY', 'MD', 'VA', 'WV', 'TN', 'NC', 'GA', 'KY'],
    rivers: [
      "Penn's Creek",
      'Spring Creek',
      'Letort Spring Run',
      'Yellow Breeches Creek',
      'Falling Spring Branch',
      'Little Juniata',
      'Fishing Creek',
      'Tulpehocken Creek',
    ],
    startMonth: 6,
    endMonth: 10,
    waterTempMinF: 55,
    waterTempMaxF: 75,
    timeOfDay: 'afternoon',
    stages: ['adult'],
    flies: [
      'Letort Hopper (Ed Shenk + Vince Marinaro) — the original American hopper, still effective',
      'Letort Cricket (Ed Shenk) — August limestoner go-to',
      'Jassid (Marinaro) — leafhopper imitation, small attractor classic',
      'Crowe Beetle — deer-hair beetle, deadly on Spring Creek + Yellow Breeches',
      'Japanese Beetle pattern (iridescent foam) — peak July; invasive established Eastern US',
      'Chernobyl Ant — foam attractor that fish read as generic terrestrial',
      'Foam Ant (winged) — late-summer hot-weather hatch substitute',
      'Foam Ant (standard) — black + cinnamon',
      'Flying Ant pattern — late-summer flights; few flies match its productivity Aug-Sept',
      'Charlie Boy Hopper — modern foam workhorse',
      'Morrish Hopper — modern foam hopper',
      'Chubby Chernobyl — modern foam, doubles as stonefly indicator',
      'Stimulator — PA attractor, doubles as hopper / stonefly',
    ],
    searchTerm: 'Letort terrestrial Marinaro Shenk Pennsylvania limestone',
    wikipediaSlug: null,
    notes:
      "Vince Marinaro invented the terrestrial genre on the Letort Spring Run with his 1950 book 'A Modern Dry Fly Code.' Ed Shenk's Letort Hopper + Letort Cricket are the originals — still effective. The Letort tradition is the wellspring of American terrestrial fishing.",
  },
  {
    id: 'pa-cicada-lanternfly',
    name: 'Cicadas & Spotted Lanternfly (PA-specific invasives)',
    scientific: 'Magicicada spp. / Lycorma delicatula',
    regions: ['Mid-Atlantic'],
    states: ['PA', 'NY', 'NJ', 'MD', 'VA', 'WV'],
    rivers: ["Penn's Creek", 'Susquehanna River', 'Delaware River', 'Allegheny River', 'Yellow Breeches Creek'],
    startMonth: 7,
    endMonth: 9,
    waterTempMinF: 60,
    waterTempMaxF: 78,
    timeOfDay: 'afternoon',
    stages: ['adult'],
    flies: [
      'Spotted Lanternfly pattern — foam body, white-banded wing; fish eat them like cicadas (invasive since 2014)',
      'Cicada / lanternfly hybrid pattern — modern foam terrestrial',
      'Foam Cicada (Brood-X colors: black body, orange wing post)',
      "Size 4-6 Chubby Chernobyl (cicada colors)",
      'Size 4 Project Cicada (foam)',
      'Size 6 deer-hair cicada',
    ],
    searchTerm: 'spotted lanternfly cicada pattern fly fishing Pennsylvania',
    wikipediaSlug: 'Lycorma_delicatula',
    notes:
      "Spotted Lanternfly (since 2014) is a genuinely new PA terrestrial — they're a nuisance bug but trout eat them like cicadas. Periodic cicada broods every 13-17 years (Brood X et al) become the most important 'non-hatch' of the decade when they happen.",
  },
  {
    id: 'eastern-streamers',
    name: 'Eastern Streamers (Wooly Bugger + Clouser were PA-born)',
    scientific: 'Baitfish / sculpin imitation',
    regions: ['Mid-Atlantic', 'Upper Midwest', 'Southern Appalachia', 'Northeast'],
    states: ['PA', 'NY', 'NJ', 'MD', 'VA', 'WV', 'TN', 'NC', 'GA', 'KY', 'AR', 'MI'],
    rivers: [
      'Susquehanna River',
      'Allegheny River',
      'Delaware River',
      'Lehigh River',
      'Youghiogheny',
      'Spring Creek',
      'Yellow Breeches Creek',
      "Penn's Creek",
      'Little Juniata',
    ],
    startMonth: 1,
    endMonth: 12,
    waterTempMinF: 38,
    waterTempMaxF: 72,
    timeOfDay: 'all day',
    stages: ['streamer'],
    flies: [
      'Wooly Bugger (Russell Blessing, PA 1960s — PA-BORN, now global) — olive / black / white / brown',
      'Clouser Deep Minnow (Bob Clouser, Susquehanna PA — PA-BORN) — chartreuse-white standard',
      "Shenk's White Streamer (Ed Shenk, Letort) — limestone-creek killer",
      "Shenk's Sculpin (Ed Shenk, Letort)",
      'Black Nose Dace (Art Flick) — bucktail, matches dace in cold mountain streams',
      'Leadeye Minnow — Spring Creek favorite, dace-style tied',
      'Muddler Minnow — universal sculpin',
      'Mickey Finn — old-school attractor',
      "Galloup's Sex Dungeon — MI-born but heavily fished on PA Lehigh / Yough / Allegheny",
      "Galloup's Drunk & Disorderly",
      'Sculpzilla — articulated sculpin workhorse',
      'Zonker (gold / olive) — subsurface meat',
      'Conehead Bugger — weighted for deeper presentations',
      'Egg-Sucking Leech — Erie + steelhead crossover',
    ],
    searchTerm: 'wooly bugger clouser minnow streamer Pennsylvania trout',
    wikipediaSlug: 'Woolly_Bugger',
    notes:
      "Two of the most-fished streamers on earth are PA-born: the Wooly Bugger (Russell Blessing, 1960s) and the Clouser Deep Minnow (Bob Clouser on the Susquehanna). Both take everything from small mountain brookies to tarpon. Ed Shenk's Letort patterns are the PA limestone-stream gold standard.",
  },
  {
    id: 'pa-erie-steelhead-alley',
    name: 'Erie Steelhead Alley (PA tribs)',
    scientific: 'Egg + baitfish + nymph imitation',
    regions: ['Great Lakes'],
    states: ['PA'],
    rivers: ['Walnut Creek', 'Elk Creek', 'Lake Erie tributaries'],
    startMonth: 10,
    endMonth: 4,
    waterTempMinF: 34,
    waterTempMaxF: 50,
    timeOfDay: 'all day',
    stages: ['run-pattern'],
    flies: [
      // Eggs — most-effective for Erie steelhead
      'Sucker Spawn — classic PA-Erie egg cluster',
      'Glo Bug',
      "Blood Dot Egg (Jeff Blood, PA-LEGEND) — Erie Alley original",
      'Eggstasy Egg — modern, durable, deadly',
      'Estaz Egg (peach / chartreuse / oregon-cheese)',
      'Crystal Meth Egg',
      'Nuke Egg',
      '6-10mm beads (peach / chartreuse / mottled)',
      // Streamers + swung flies
      "White Death (Jeff Blood, PA) — emerald shiner imitation; staple for Erie brown trout + steelhead",
      'Egg-Sucking Leech (black / purple)',
      'Size 2-6 Wooly Bugger (beefy — black, olive, white)',
      "Kurt's Creek Minnow — emerald shiner imitation",
      'Intruder pattern — swung',
      'Small Spey fly — swung',
      // Dead-drift nymphs
      'Size 8-12 Pheasant Tail nymph (steelhead size)',
      'Size 8-12 Prince Nymph',
      'Size 8-12 Copper John',
      'Size 8-12 Hare\'s Ear nymph',
      'Size 16-20 Zebra Midge — low/clear winter water',
      'Size 6-10 Stonefly nymph (black or brown)',
    ],
    searchTerm: 'erie steelhead alley fly Pennsylvania Walnut Elk Creek',
    wikipediaSlug: null,
    notes:
      "Steelhead Alley = almost entirely non-hatch fishing. Dead-drift eggs/nymphs under an indicator in low-clear winter water. Swing streamers in fall + spring runs. Jeff Blood's Blood Dot Egg + White Death are PA legends. Brown trout + steelhead key on emerald shiner and gizzard shad in the lake itself — White Death imitates that baitfish.",
  },
  {
    id: 'eastern-junk-nymphs',
    name: 'Junk Nymphs (Green Weenie + Mop + worms)',
    scientific: 'Generic prey suggestion — not species-matching',
    regions: ['Mid-Atlantic', 'Upper Midwest', 'Southern Appalachia'],
    states: ['PA', 'NY', 'MD', 'VA', 'WV', 'TN', 'NC', 'GA', 'KY', 'AR', 'MI', 'IN', 'IL', 'OK'],
    rivers: ['Little Juniata', 'Spring Creek', 'Yellow Breeches Creek', 'South Holston', 'Caney Fork'],
    startMonth: 1,
    endMonth: 12,
    waterTempMinF: 38,
    waterTempMaxF: 72,
    timeOfDay: 'all day',
    stages: ['always-on'],
    flies: [
      'Bead-Head Green Weenie (PA-BORN) — caterpillar/inchworm suggestion; deadly on the Little Juniata',
      'Mop Fly (chartreuse / cream / olive) — much-debated, undeniably effective',
      'Squirmy Wormy (pink / chartreuse / wine)',
      'San Juan Worm (red chenille — original)',
      'Pink Worm — high-water cleanup',
      'Egg pattern (Glo Bug / Estaz) — fished even outside spawn on stocked water',
      'Soft-hackle wet (partridge + olive / hare\'s ear) — searching pattern when nothing is up',
    ],
    searchTerm: 'green weenie mop fly junk nymph fly fishing',
    wikipediaSlug: null,
    notes:
      "Junk patterns that don't match anything specific but consistently catch fish. The Green Weenie is genuinely PA-born — for whatever reason, a Bead Head Green Weenie takes fish reliably on the Little Juniata and across PA stocked + limestone water. Mop fly + worms cover high-water + dirty-water situations.",
  },
];

// ---- Runner ---------------------------------------------------------------

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
