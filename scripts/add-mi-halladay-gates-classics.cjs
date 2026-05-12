/**
 * Michigan Classics Vol. 2 — the foundational tier names the prior
 * MI passes underweighted:
 *
 *   - Leonard Halladay (Mayfield, Boardman River 1922) gave us the
 *     ADAMS — the most famous dry fly in the world is a MI fly.
 *   - Clarence Roberts of Onaway (1957-1959) — Roberts Yellow Drake
 *     and the parachute-post lineage built for one-eyed George
 *     Griffith (TU co-founder).
 *   - Rusty Gates and the Au Sable lodge school — Rusty's Spinner,
 *     White Knot, and the Gates Au Sable Lodge pattern canon.
 *   - The "scientific" school: Swisher + Richards (Selective Trout,
 *     1971), Schwiebert, Linsenman — born in Michigan.
 *   - The full Galloup / Lynch / Schmidt catalogs beyond what we
 *     already had.
 *   - Schultz Outfitters SE-MI warmwater additions.
 *   - Hartwick / Pick 'Em Up / Senyo Great Lakes steelhead patterns.
 *   - Pat Cohen carp patterns.
 *
 *   PAD existing entries:
 *     mi-articulated-streamers      (+full Galloup catalog: Triple
 *                                    Dungeon, Articulated Banger,
 *                                    Madonna, Bunny Wabbit, Punk Rock
 *                                    Dungeon, T&A Bunker, Mongoose,
 *                                    Cone Head Bunny, Big Joe Stage,
 *                                    The Cunning Linguist, Articulated
 *                                    Trout Slider (Cheech) + Lynch
 *                                    Mongrel Meat / Money Bunny /
 *                                    Money Maker / Articulated Crow
 *                                    + Schmidt Peanut Envy / Double
 *                                    Deceiver + Walker's Wiggler +
 *                                    Ted Kraimer Brook Trout streamer)
 *     mi-pike-musky                 (+Schultzy's Walking Stick,
 *                                    +Ad Swier Double Bunny variants,
 *                                    +Wiggle Minnow,
 *                                    +Ray Schmidt's pike patterns,
 *                                    +Articulated Rabbit Strip Diver
 *                                     (Larry Dahlberg))
 *     mi-carp-flats                 (+Cohen's Carp Bitters, Carp Dub,
 *                                    +Foam Hopper/Cicada surface carp,
 *                                    +Wooly Worm olive)
 *     mi-river-smallmouth           (+Schultzy's Walking Stick,
 *                                    +Schultzy's Cray, +Mini Fleein
 *                                    Cray, +Crease Fly + Gurgler +
 *                                    Popper for Beaver Island flats)
 *     mi-steelhead-salmon-pile      (+Pick 'Em Up, +Hartwick Hex,
 *                                    +Hartwick Special, +Mike's
 *                                    Memorial, +Polar Shrimp, +Egg-
 *                                    Sucking Bunny Leech, +Senyo's
 *                                    Artificial Intelligence)
 *     eastern-attractor-dries       (+Roberts Drake variants,
 *                                    +Au Sable Parachute Hex)
 *     mi-borchers-drake             (note Ernie Borchers creator;
 *                                    +Borchers Special, +Borchers
 *                                    Parachute variants)
 *     mi-mahogany-dun-isonychia     (+Ed McCoy Iso/Cherry Bomb Spinner)
 *     hex                           (+Jerry Regan's Hairy Drake,
 *                                    +Au Sable Parachute Hex)
 *
 *   NEW entries:
 *     mi-halladay-classics          (Adams + Hair Stone + Michigamme +
 *                                    Female Adams + Whinnie Fore & Aft
 *                                    + Strawman + Skip Nymph + Smock)
 *     mi-rusty-gates-au-sable       (Rusty's Spinner + White Knot +
 *                                    Gates Au Sable Lodge canon)
 *     mi-scientific-school          (Swisher & Richards No-Hackle,
 *                                    Comparadun, Stillborn, Hairwing;
 *                                    Schwiebert; Linsenman streamer
 *                                    legacy)
 *
 * Run: node scripts/add-mi-halladay-gates-classics.cjs
 * Idempotent — re-runnable.
 */

const fs = require('node:fs');
const path = require('node:path');

const FILE = path.join(__dirname, '..', 'data', 'hatches.json');

const FLY_ADDITIONS = {
  'mi-articulated-streamers': [
    "Galloup's Triple Dungeon — biggest of the Dungeon family",
    "Galloup's Articulated Banger — articulated meat with marabou",
    "Galloup's The Banger — single-hook precursor variant",
    "Galloup's Madonna — articulated with marabou",
    "Galloup's Bunny Wabbit — smaller streamer in the catalog",
    "Galloup's Punk Rock Dungeon — articulated variant",
    "Galloup's T&A Bunker — for smallmouth + big trout",
    "Galloup's Mongoose — Sex Dungeon variant",
    "Galloup's Cone Head Bunny — small weighted streamer",
    "Galloup's Big Joe Stage — articulated meat",
    "Galloup's The Cunning Linguist — carp + smallmouth crossover",
    "Articulated Trout Slider (Cheech, Fly Fish Food) — Galloup-inspired articulated",
    "Lynch's Mongrel Meat — articulated baitfish",
    "Lynch's Money Bunny — articulated marabou+rabbit",
    "Lynch's Money Maker — articulated meat workhorse",
    "Lynch's Articulated Crow — articulated dark streamer",
    "Schmidt's Peanut Envy (Anglers Choice) — nationally known articulated",
    "Schmidt's Double Deceiver — articulated baitfish",
    "Walker's Wiggler (Mike Schultz) — craft-fur baitfish for SE MI",
    "Ted Kraimer's Brook Trout Streamer — brook-trout profile for cannibal browns",
  ],
  'mi-pike-musky': [
    "Schultzy's Walking Stick (Mike Schultz) — pike/musky topwater slider",
    'Double Bunny (Ad Swier color variants) — pike crack from the Scandinavian school',
    'Wiggle Minnow — surface action on weed lines',
    "Ray Schmidt's pike patterns — local Manistee-area Streamer master",
    'Articulated Rabbit Strip Diver (Larry Dahlberg) — diving big-water profile',
  ],
  'mi-carp-flats': [
    "Cohen's Carp Bitters (Pat Cohen) — modern foam-and-rubber-legs carp fly",
    "Cohen's Carp Dub (Pat Cohen) — dubbed-body sight-fishing carp pattern",
    'Foam Hopper — surface-feeding carp on summer flats',
    'Foam Cicada — surface-feeding carp during emergences + on weed lines',
    "Wooly Worm (olive) — old reliable for carp + smallmouth",
  ],
  'mi-river-smallmouth': [
    "Schultzy's Walking Stick (Mike Schultz) — topwater pike/musky slider that smallmouth eat",
    "Schultzy's Cray (Mike Schultz) — bigger crayfish profile",
    'James Hughes Mini Fleein Cray — modern crayfish carried at Schultz Outfitters',
    'Crease Fly — surface attractor, Beaver Island flats + Lake Michigan',
    'Gurgler — surface attractor for smallmouth + carp + bass',
    'Popper (medium / large) — Beaver Island smallmouth on Lake Michigan flats',
    'Surf Candy (Bob Popovics) — emerald-shiner-dominated flats',
  ],
  'mi-steelhead-salmon-pile': [
    "Pick 'Em Up — classic Michigan steelhead pattern",
    'Hartwick Hex — Michigan steelhead Hex nymph variant',
    'Hartwick Special — local Hartwick Pines / Au Sable region steelhead pattern',
    "Mike's Memorial — older Great Lakes steelhead fly",
    'Polar Shrimp — Pacific NW import that works on Michigan steelhead',
    'Egg-Sucking Bunny Leech — pink + black bunny strip + egg head',
    "Senyo's Artificial Intelligence (Greg Senyo) — modern intruder-style swing pattern",
    "Senyo's Shaggy — schlappen-bodied steelhead/salmon fly",
    "Senyo's Predator Scandi — Senyo's Great Lakes steelhead favorite",
  ],
  'eastern-attractor-dries': [
    "Roberts Drake (Clarence Roberts, Onaway MI 1957-59) — deer-hair parachute mayfly; created the parachute-post lineage",
    "Roberts Golden Drake — Roberts's Golden Drake variant",
    "Au Sable Parachute Hex (Roberts-style) — MI parachute Hex variant",
  ],
  'mi-borchers-drake': [
    "Borchers Special (Ernie Borchers) — the original; imitates Hendricksons / Iso spinners / Mahoganies",
    "Borchers Drake (parachute version) — Ernie Borchers's Michigan classic",
    "Borchers Parachute — high-floating variant with white post",
    "Carry Borchers in sizes 10-16 to match the full range of mayfly hatches it covers",
  ],
  'mi-mahogany-dun-isonychia': [
    "Ed McCoy's Iso Spinner — Northern MI tier Iso variant",
    "Ed McCoy's Cherry Bomb Spinner — bright Iso spinner variant",
    "Ed McCoy's Iso Dun (grey) — Iso dun pattern",
  ],
  hex: [
    "Jerry Regan's Hairy Drake — MI Hex variant; high-floating attractor for the Hex window",
    "Au Sable Parachute Hex (Roberts-style) — MI parachute post variant for the Hex window",
  ],
};

const NEW_ENTRIES = [
  {
    id: 'mi-halladay-classics',
    name: 'Leonard Halladay & the Boardman River Classics',
    scientific: 'Generalist dry-fly attractors — MI origin',
    regions: ['Upper Midwest', 'Great Lakes'],
    states: ['MI'],
    rivers: [
      'Boardman River',
      'Mayfield Pond',
      'Au Sable',
      'Manistee',
      'Pere Marquette',
    ],
    startMonth: 4,
    endMonth: 10,
    waterTempMinF: 50,
    waterTempMaxF: 70,
    timeOfDay: 'all day',
    stages: ['attractor'],
    flies: [
      'Adams (Leonard Halladay, Mayfield MI, 1922) — the most famous dry fly in the world; tied near Mayfield Pond on the Boardman River at the request of Charles Adams. Gray body, grizzly+brown hackle, mallard wings, grizzly+brown hackle-fiber tails',
      'Adams (parachute) — modern high-visibility variant',
      'Female Adams (Halladay) — yellow egg sack version of the original',
      'Hair Stone (Halladay) — same color scheme as the Adams (gray body, brown+grizzly hackle) — Halladay\'s own variant',
      'Michigamme (Halladay) — another Halladay pattern in the Adams color family',
      "Joe's Hopper / Michigan Hopper (Art Winnie, Traverse City ~1900s) — the parent of all foam hoppers",
      "Whinnie Fore & Aft (Art Winnie) — double-hackled dry; another Winnie classic",
      'Strawman Nymph (Russ Madden / old Midwest) — caddis-larva-style straw-bodied nymph',
      'Skip Nymph (Skip Morris) — Midwest tier pattern, mayfly nymph profile',
      "Smock's Hex (Bob Smock Sr.) — northern MI Hex pattern from a major old-school tier",
      "Bob Smock Sr. classic dries — northern MI tier canon",
    ],
    searchTerm: 'Adams fly Halladay Mayfield Boardman Michigan dry fly origin',
    wikipediaSlug: 'Adams_(fly)',
    notes:
      'The Adams was designed by Leonard Halladay of Mayfield, Michigan in 1922 at the request of his friend Charles Adams — tied near Mayfield Pond on the Boardman River. As Ed Van Put put it: "The Adams doesn\'t look exactly like anything but it looks enough like a lot of things that it just catches fish." The most famous dry fly in the world is a Michigan fly. Halladay also tied the Hair Stone and Michigamme in the same color scheme, plus the Female Adams with a yellow egg sack. Art Winnie of Traverse City gave us Joe\'s Hopper and the Whinnie Fore & Aft. Bob Smock Sr. is part of the same old-school northern MI tradition.',
  },
  {
    id: 'mi-rusty-gates-au-sable',
    name: 'Rusty Gates & the Au Sable Lodge School',
    scientific: 'Generalist dries + spinners — Au Sable canon',
    regions: ['Upper Midwest', 'Great Lakes'],
    states: ['MI'],
    rivers: [
      'Au Sable (Holy Water)',
      'Au Sable (North Branch)',
      'Au Sable (South Branch)',
      'Manistee (Upper)',
    ],
    startMonth: 4,
    endMonth: 10,
    waterTempMinF: 50,
    waterTempMaxF: 70,
    timeOfDay: 'evening',
    stages: ['attractor'],
    flies: [
      "Rusty's Spinner (Rusty Gates) — resembles Roberts Drake body but darker + not tied as parachute; moose mane tail, dark reddish-brown deer hair body flared at the bend, thread rib, hen grizzly tip wings 3/4 spent, brown+grizzly hackle. Sizes 10-12. Still tied at Gates Lodge by Josh Greenberg",
      "Rusty's White Knot (Rusty Gates) — Iso imitation; tied for the South Branch",
      'Gates Lodge Au Sable spinners (multiple) — the river-system canon for the Au Sable wild trout',
      "Roberts Yellow Drake (Clarence Roberts, Onaway MI 1957-59) — game warden in Grayling; pioneered deer-hair parallel-to-hook for buoyancy; large white parachute post added for one-eyed George Griffith (TU co-founder). Fished as a searcher year-round",
      'Roberts Drake (parent variant) — same deer-hair-parallel construction',
      'Roberts Golden Drake — Roberts variant for the Golden Drake hatch',
      'Au Sable Parachute Hex — Roberts-style parachute Hex variant',
      "Griffith's Gnat (George Griffith, TU co-founder) — peacock herl + grizzly hackle midge cluster; universal",
      "Madsen's Skunk (Earl Madsen) — multi-purpose; fish wet or dry, also functions as terrestrial",
      "Borchers Special (Ernie Borchers) — covers Hendricksons / Iso spinners / Mahoganies — carry 10-16",
      "Borchers Parachute — high-vis variant",
    ],
    searchTerm: 'Rusty Gates Au Sable Lodge Roberts Yellow Drake Griffiths Gnat',
    wikipediaSlug: null,
    notes:
      'Rusty Gates was central to the Au Sable\'s modern identity, alongside Ernie Schwiebert, Bob Linsenman, Carl Richards, and Doug Swisher. Gates developed a number of patterns that became standard Au Sable flies; Josh Greenberg still ties them at Gates Au Sable Lodge today. The Au Sable canon also includes Clarence Roberts of Onaway (Roberts Yellow Drake, late 1950s, with the parachute post built for one-eyed George Griffith — TU co-founder) and George Griffith himself (Griffith\'s Gnat). The vast majority of patterns tied at the Lodge are MI-specific, designed for this river system and its wild trout.',
  },
  {
    id: 'mi-scientific-school',
    name: 'MI Scientific School (Swisher/Richards · Schwiebert · Linsenman)',
    scientific: 'Modern dry-fly + emerger + streamer school',
    regions: ['Upper Midwest', 'Great Lakes'],
    states: ['MI'],
    rivers: [
      'Au Sable (Holy Water)',
      'Manistee',
      'Pere Marquette',
      'Boardman',
    ],
    startMonth: 4,
    endMonth: 10,
    waterTempMinF: 50,
    waterTempMaxF: 70,
    timeOfDay: 'all day',
    stages: ['attractor'],
    flies: [
      'No-Hackle Dun (Swisher & Richards, Selective Trout 1971) — split-wing dun with no body hackle; the technical-water mayfly imitation that changed dry-fly fishing',
      'No-Hackle BWO — sizes 16-20 for the major BWO hatches',
      'No-Hackle Sulfur — pale-yellow body, light-dun wing',
      'No-Hackle Trico — micro version for the August spinnerfall',
      'Comparadun (Caucci/Nastasi precursor — Swisher/Richards school) — deer-hair fan-wing dun',
      'Comparadun PMD — the modern bones of the No-Hackle lineage',
      'Stillborn Pattern (Swisher & Richards) — emerger-stage cripple imitation',
      'Hairwing Dun (Swisher & Richards) — deer-hair upright wing variant',
      'Schwiebert mayfly imitations (Ernie Schwiebert, Matching the Hatch) — foundational mayfly canon',
      'Linsenman streamers — Bob Linsenman co-authored Modern Streamers for Trophy Trout with Kelly Galloup, central to the MI streamer revolution',
    ],
    searchTerm: 'No-Hackle Dun Swisher Richards Selective Trout Comparadun Stillborn Schwiebert Linsenman Michigan',
    wikipediaSlug: null,
    notes:
      "Selective Trout (Doug Swisher and Carl Richards, 1971) is one of the most influential fly-fishing books ever written — born out of Michigan trout fishing. The No-Hackle Dun, Stillborn, and Hairwing Dun designs all came from this MI-rooted 'scientific' school. Ernie Schwiebert (Matching the Hatch) and Bob Linsenman (Modern Streamers for Trophy Trout, with Galloup) are part of the same lineage. The Michigan school of dry-fly design changed how the world fishes mayfly hatches.",
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
