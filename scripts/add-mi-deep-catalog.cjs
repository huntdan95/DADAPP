/**
 * Deep Michigan catalog merge — user-supplied extension covering
 * the named-tier patterns, the steelhead/salmon meta beyond eggs,
 * Bear Andrews's signature flies, and the warmwater fisheries
 * (carp, pike/musky, smallmouth) that Michigan is genuinely
 * world-class for and that the prior MI pass underweighted.
 *
 *   PAD existing entries:
 *     mi-articulated-streamers      (+Lynch Mini D&D + Triple D,
 *                                    +Galloup Barely Legal / Bottoms Up /
 *                                     Heifer Groomer / Stacked Blonde /
 *                                     Tin Cup Lou / Stripped Leech,
 *                                    +Schmidt Junk Yard Dog / Howitzer,
 *                                    +Sparkle Minnow, +Lil Kim,
 *                                    +Double Gonga, +Great Lakes Deceiver)
 *     mi-giant-stonefly             (+Burkus Bearback Rider, +Twenty Incher)
 *     mi-steelhead-eggs             (+Rag Eggs, +Crystal Eggs,
 *                                    +Stu's Ostrich Mini-Intruder,
 *                                    +Disco Caddis,
 *                                    +Sand Sculpin / Sucker Minnow)
 *     hex                           (+Bear's Hex Nymph, +Hex Spinner,
 *                                    +Schultzy's Rabbit Hexum,
 *                                    +Ted's Edible Hex,
 *                                    +Fox's Shuck Hex Nymph)
 *     eastern-attractor-dries       (+Robert's Yellow Drake,
 *                                    +Ed McCoy's Boondoggle Spinner,
 *                                    +Ted Kraimer's A Fly deer-fly,
 *                                    +Bear's Mine Sweeper)
 *     trico                         (+Bear's Trico Spinner)
 *
 *   NEW entries:
 *     mi-bear-andrews-catalog       (Jeff "Bear" Andrews signature flies)
 *     mi-steelhead-salmon-pile      (Twenty Pounder + non-egg patterns)
 *     mi-carp-flats                 (Grand Traverse Bay golden bones,
 *                                    Beaver Island, Lake St. Clair flats)
 *     mi-pike-musky                 (Lake St. Clair musky + UP pike)
 *     mi-river-smallmouth           (Huron / Flint / Shiawassee /
 *                                    Kalamazoo / Grand / lower Manistee)
 *
 * Run: node scripts/add-mi-deep-catalog.cjs
 * Idempotent — re-runnable; only adds flies/entries not already present.
 */

const fs = require('node:fs');
const path = require('node:path');

const FILE = path.join(__dirname, '..', 'data', 'hatches.json');

const FLY_ADDITIONS = {
  'mi-articulated-streamers': [
    "Lynch's Mini D&D — winter steelhead workhorse; smaller-profile Drunk & Disorderly",
    "Lynch's Triple D (triple-articulated) — the trophy-brown weapon",
    "Galloup's Barely Legal — articulated marabou+flash, classic olive/white with black conehead",
    "Galloup's Bottoms Up — articulated meat pattern",
    "Galloup's Heifer Groomer — articulated streamer",
    "Galloup's Stacked Blonde — articulated marabou stack",
    "Galloup's Tin Cup Lou — articulated streamer",
    "Galloup's Stripped Leech — the pre-D&D leech swim pattern",
    "Mike Schmidt's Junk Yard Dog — articulated trout meat",
    "Mike Schmidt's Howitzer — articulated streamer",
    "Russ Madden's Articulated Circus Peanut — designed for Traverse City waters; Galloup calls it one of the most successful articulated patterns ever",
    "Coffey's Sparkle Minnow — sculpin-profile flashabou, easy to fish",
    "Lil Kim — single-hook copper-cone streamer; MI tailwater staple",
    "Double Gonga (Charlie Craven) — heavily fished MI even though not MI-born",
    'Great Lakes Deceiver — swim fly built for the migratory game',
    "Buford (Tommy Lynch) — also crosses to pike work",
  ],
  'mi-giant-stonefly': [
    'Burkus Bearback Rider — MI-used stonefly nymph',
    'Twenty Incher — the original; basis for the Twenty Pounder variant',
    'Twenty Pounder Stonefly Nymph (Ted Kraimer, MI) — MI-built variant scaled up for steelhead/salmon, borrows from Prince + Half-back',
    "Pat's Rubber Legs (black / brown / coffee-black) — universal big-stone substitute",
  ],
  'mi-steelhead-eggs': [
    'Rag Egg (clown / apricot / salmon-egg colors) — MI-distinct soft egg cluster',
    'Crystal Egg (peach / chartreuse)',
    "Stu's Ostrich Mini-Intruder — modern compact swing fly for Great Lakes steelhead",
    'Disco Caddis (green / chartreuse) — MI steelhead caddis pupa',
    'Sand Sculpin pattern — overlooked Great Lakes baitfish profile',
    'Sucker Minnow pattern — pre-spawn baitfish imitation',
    'Small Black Stonefly — early-spring steelhead',
    'Steelie Bugger — heavy buggers in black, olive, white',
  ],
  hex: [
    "Bear's Hex Nymph (Jeff 'Bear' Andrews) — MI steelhead-box staple; silt-burrowing Hex imitation",
    "Bear's Hex Spinner (Jeff 'Bear' Andrews) — surface-clear-wing imago",
    "Schultzy's Rabbit Hexum (Mike Schultz) — MI Hex nymph",
    "Ted's Edible Hex (Ted Kraimer) — MI guide pattern",
    "Fox's Shuck Hex Nymph — emerger-style Hex nymph",
  ],
  'eastern-attractor-dries': [
    "Robert's Yellow Drake (Doug Roberts) — fished as a searching dry as often as a hatch match in MI",
    "Ed McCoy's Boondoggle Spinner — McCoy is a Northern MI tier; classic late-evening spinnerfall pattern",
    "Ted Kraimer's A Fly — deer-fly pattern; brook + brown trout magnet in July/August",
    "Bear's Mine Sweeper (Jeff 'Bear' Andrews) — AuSable region searching dry",
  ],
  trico: [
    "Bear's Trico Spinner (Jeff 'Bear' Andrews) — MI tier signature",
  ],
};

const NEW_ENTRIES = [
  {
    id: 'mi-bear-andrews-catalog',
    name: "Jeff 'Bear' Andrews — Michigan Signature Tier",
    scientific: 'Tier-signature patterns — Umpqua Signature Tyer since 2000',
    regions: ['Upper Midwest', 'Great Lakes'],
    states: ['MI'],
    rivers: [
      'Au Sable (North Branch)',
      'Au Sable (Holy Water)',
      'Au Sable (South Branch)',
      'Manistee',
      'Pere Marquette',
      'Fuller\'s North Branch (Lovells)',
    ],
    startMonth: 1,
    endMonth: 12,
    waterTempMinF: 40,
    waterTempMaxF: 72,
    timeOfDay: 'all day',
    stages: ['attractor'],
    flies: [
      "Mattress Thrasher — the dry-fly stonefly attractor",
      "Bear's Hex Nymph — Michigan steelhead-box staple alongside Schultzy's Rabbit Hexum",
      "Bear's Hex Spinner — surface clear-wing imago for the night game",
      "Bear's Trico Spinner — for the August Trico fall",
      "Bear's Mine Sweeper — AuSable region searching dry",
      "Bear's carp pattern (multiple variants) — among the best carp flies ever tied per Umpqua",
    ],
    searchTerm: "Jeff Bear Andrews Michigan fly tier Grand Ledge Umpqua signature",
    wikipediaSlug: null,
    notes:
      "Jeff 'Bear' Andrews of Grand Ledge, MI: 1998 Buz Buszek Memorial Fly Tying Award winner (highest honor from the Federation of Fly Fishers), Umpqua Signature Tyer since 2000, ran Bear's Fly Shop in Grand Ledge 1977-1984, has tied commercially producing as many as 24,000 flies a year, and guides at Fuller's North Branch Outing Club in Lovells. His carp patterns are widely regarded as among the world's best.",
  },
  {
    id: 'mi-steelhead-salmon-pile',
    name: 'MI Steelhead & Salmon — Non-Egg Patterns',
    scientific: 'Oncorhynchus mykiss / O. tshawytscha / O. kisutch',
    regions: ['Upper Midwest', 'Great Lakes'],
    states: ['MI'],
    rivers: [
      'Big Manistee',
      'Pere Marquette',
      'Muskegon',
      'Betsie',
      'Platte',
      'Boardman',
      'Au Sable (lower)',
      'St. Joseph',
      'Grand River',
      'Pentwater',
    ],
    startMonth: 9,
    endMonth: 5,
    waterTempMinF: 34,
    waterTempMaxF: 52,
    timeOfDay: 'all day',
    stages: ['streamer'],
    flies: [
      // Stonefly nymphs — MI-signature
      'Twenty Pounder Stonefly Nymph (Ted Kraimer) — MI-built variant of Twenty Incher; borrows from Prince + Half-back, scaled to handle big MI steelhead/salmon',
      'Twenty Incher — the original; basis for Ted Kraimer\'s variant',
      "Pat's Rubber Legs (black / brown / coffee-black)",
      'Small Black Stonefly — early-spring steelhead',
      'Burkus Bearback Rider — MI stonefly nymph',
      // Hex nymphs — MI distinctive
      "Bear's Hex Nymph (Jeff 'Bear' Andrews) — silt-burrowing Hex imitation; MI rivers have Hex mayfly populations that steelhead key on",
      "Schultzy's Rabbit Hexum (Mike Schultz)",
      "Ted's Edible Hex (Ted Kraimer)",
      "Fox's Shuck Hex Nymph",
      // Caddis pupa
      'Disco Caddis (green / chartreuse) — MI steelhead caddis pupa',
      // Swung / Intruder-style
      "Stu's Ostrich Mini-Intruder — modern compact swing fly",
      'Intruder pattern — full-size, swung',
      'Spey pattern (purple / blue / black) — swung',
      'Steelie Bugger (heavy, black / olive / white)',
      // Baitfish profiles MI-specific
      'Sand Sculpin pattern — overlooked Great Lakes baitfish profile',
      'Sucker Minnow pattern — pre-spawn baitfish imitation',
      'Great Lakes Deceiver — swim fly built for the migratory game',
      'Chestnut Lamprey pattern — early-spring Manistee specialty',
    ],
    searchTerm: 'MI steelhead salmon fly twenty pounder Kraimer Bear Andrews Hex nymph',
    wikipediaSlug: null,
    notes:
      "Beyond the egg pile — these are the MI-distinctive steelhead/salmon patterns. Ted Kraimer's Twenty Pounder Stonefly is a MI original (Current Works Guide Service, Traverse City), and the Hex-nymph family (Bear's / Schultzy's / Ted's / Fox's) reflects that many MI steelhead rivers have silt-bottom Hex populations the fish key on year-round. Disco Caddis is the MI-specific caddis pupa worth carrying.",
  },
  {
    id: 'mi-carp-flats',
    name: 'Michigan Carp — Great Lakes Flats Fishery',
    scientific: 'Cyprinus carpio',
    regions: ['Upper Midwest', 'Great Lakes'],
    states: ['MI'],
    rivers: [
      'Grand Traverse Bay (Lake Michigan flats)',
      'Beaver Island',
      'Lake St. Clair flats',
      'Huron River',
      'Flint River',
      'Shiawassee River',
      'Kalamazoo River',
    ],
    startMonth: 5,
    endMonth: 9,
    waterTempMinF: 60,
    waterTempMaxF: 78,
    timeOfDay: 'all day',
    stages: ['streamer'],
    flies: [
      "Schultzy's Single Fly Cray (Mike Schultz, MI) — developed 2012 for the Huron River Watershed Council fundraiser and won; rabbit-bodied crayfish that crosses to smallmouth, trout, pike",
      "McLovin (Schultz Outfitters) — MI carp staple",
      'McLovin variants (rust / olive / tan) — Schultz Outfitters tied variants',
      "Egan's Headstand (Lance Egan) — sight-fishing tailing-fish carp fly",
      "Backstabber (Jay Zimmerman) — universal carp fly",
      'Trouser Worm — generic worm imitation, deadly for carp',
      'Mulberry pattern (purple) — for mulberry-fall carp',
      'Carp Carrot — orange worm-style carp fly',
      'Tan San Juan Worm — earthworm imitation',
      'Hybrid Carp Fly — Headstand-family variant',
      'Hare Tron Carp — soft natural-fiber crayfish',
      "Bear Andrews's carp patterns — multiple MI custom carp flies, Umpqua-distributed",
      'Foam beetle (terrestrial drop) — Grand Traverse Bay flats during summer',
      "Berry's Carp Cookie — bite-size attractor fly",
    ],
    searchTerm: 'Michigan carp fly Grand Traverse Bay Beaver Island St Clair Schultz cray',
    wikipediaSlug: 'Common_carp',
    notes:
      'Michigan is one of the world\'s premier fly-rod carp destinations. The Grand Traverse Bay "golden bones" of Lake Michigan get sight-fished on shallow flats; Beaver Island is a legendary destination; Lake St. Clair has another massive flats fishery; and warmwater rivers like the Huron, Flint, Shiawassee, and Kalamazoo all hold them. The season for carp on the flats of Grand Traverse Bay and Lake Michigan ranges from mid-May through mid-July. Crayfish and nymph patterns are the preferred patterns — these same flies are also preferred by the smallmouth bass.',
  },
  {
    id: 'mi-pike-musky',
    name: 'Michigan Pike & Musky',
    scientific: 'Esox lucius / E. masquinongy',
    regions: ['Upper Midwest', 'Great Lakes'],
    states: ['MI'],
    rivers: [
      'Lake St. Clair (musky)',
      'Detroit River',
      'St. Marys River',
      'Indian River',
      'Munuscong Bay',
      'UP lakes (pike)',
      'Northern Lower Peninsula lakes',
      'Saginaw Bay',
    ],
    startMonth: 5,
    endMonth: 11,
    waterTempMinF: 55,
    waterTempMaxF: 78,
    timeOfDay: 'all day',
    stages: ['streamer'],
    flies: [
      'Buford (Tommy Lynch) — bulky pushed-water pike fly; used by Lynch and many others',
      'T-Bone (Blane Chocklett) — musky workhorse',
      'Game Changer (Blane Chocklett) — pike/musky sizes (8-12 inches)',
      'Polar Changer — flashy white Game Changer variant in musky sizes',
      'Andreas Andersson\'s DeliveryMan Articulated — big musky/pike fly',
      'Boombah — classic articulated pike fly',
      'Bulkhead Deceiver — Bob Popovics, in big musky sizes',
      'Double Bunny (Scott Sanchez) — pike candy',
      'Double Bunny variants (red & white, fire-tiger, perch) — Lake St. Clair musky',
      'Bauer Pike Flash patterns — flashabou-bodied pike streamers',
      'Red & White (the classic Daredevle profile) — old reliable for pike',
      'Lefty\'s Deceiver in pike sizes (6-10 inches)',
      'Andino Deceiver — variant tied for musky',
      'Sex Dungeon (Galloup) in pike sizes — articulated meat',
      'Big Boy (Eli Berant) — articulated musky pattern',
      'Half and Half (Clouser+Deceiver) in big sizes — pike + Great Lakes musky',
    ],
    searchTerm: 'Michigan pike musky fly Lake St Clair Buford T-Bone Game Changer',
    wikipediaSlug: 'Muskellunge',
    notes:
      'Lake St. Clair is arguably the best musky water in North America — the average fish runs 36-44 inches with regular 50+ shots. Pike are everywhere in the U.P. and the northern lower. 9-10 weight rods, wire bite tippet, big articulated flies (8-12 inches), and you strip strikes. Spring (post-ice through pre-spawn) and fall (water cools, fish gorge) are peak; summer can be tough with weeds + warm water.',
  },
  {
    id: 'mi-river-smallmouth',
    name: 'Michigan River Smallmouth',
    scientific: 'Micropterus dolomieu',
    regions: ['Upper Midwest', 'Great Lakes'],
    states: ['MI'],
    rivers: [
      'Huron River',
      'Flint River',
      'Shiawassee River',
      'Kalamazoo River',
      'Grand River',
      'Big Manistee (lower)',
      'St. Joseph River',
      'Au Sable (below Mio)',
      'Boardman (lower)',
      'Muskegon (lower)',
    ],
    startMonth: 5,
    endMonth: 10,
    waterTempMinF: 60,
    waterTempMaxF: 82,
    timeOfDay: 'all day',
    stages: ['streamer'],
    flies: [
      "Schultzy's Single Fly Cray (Mike Schultz) — the universal MI river bass crayfish; rabbit body, hook-up Clouser-style",
      "Clouser Deep Minnow (chartreuse/white, olive/white) — universal warmwater",
      "Clouser's Crayfish — smallmouth meat-and-potatoes",
      'Near-Nuff Crayfish (Whitlock)',
      "Whitlock's Near Nuff Crayfish",
      'Boogle Bug popper — surface gold in summer on the Huron / Flint',
      'Sneaky Pete popper — quieter slider for spooky fish',
      'Murdich Minnow — bait-profile streamer',
      'Game Changer (Blane Chocklett) — articulated baitfish',
      'Polar Changer — flashy white variant',
      'Wooly Bugger (olive / black / brown — beefy sizes)',
      'Topwater frog / diver pattern — slow pools, pad-edge',
      'Dahlberg Diver — current pockets and back eddies',
      'Gurgler — surface attractor',
      'Half and Half (Clouser + Deceiver) — bigger profile for trophy smallmouth',
      'Sex Dungeon (Galloup) in smaller sizes — bass also eat articulated meat',
    ],
    searchTerm: 'Michigan smallmouth fly Huron Flint Shiawassee Kalamazoo Schultz cray',
    wikipediaSlug: 'Smallmouth_bass',
    notes:
      "Michigan river smallmouth is criminally underrated. Schultz Outfitters fishes the Huron (home water), Flint, Shiawassee, and Kalamazoo — all produce exceptional smallmouth bass, pike, and carp. The lower Manistee, lower Au Sable, St. Joseph, and Grand all hold strong populations too. Crayfish patterns dominate; topwater poppers in summer. Many of these same flies cross to carp on the same waters.",
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
