// Final final fill — bring remaining states (MO/MA/CT/NH/ME/LA/KS/RI/AK/SD/ND/NE/VT/DE) above 100.

const fs = require('node:fs');
const path = require('node:path');

const FILE = path.join(__dirname, '..', 'data', 'hatches.json');

const ENTRIES = [
  // ============== OZARK TROUT (MO + AR) ==============
  {
    id: 'ozark-trout-tailwater',
    name: 'Ozark Trout Tailwater (MO + AR)',
    scientific: 'Stocked rainbow + wild brown trout',
    regions: ['Ozarks'],
    states: ['MO', 'AR', 'OK'],
    rivers: ['White River', 'Little Red River', 'Norfork River', 'Eleven Point River', 'Current River', 'Roaring River', 'Bennett Spring'],
    startMonth: 1, endMonth: 12,
    waterTempMinF: 48, waterTempMaxF: 62,
    timeOfDay: 'morning',
    stages: ['nymph', 'dun', 'emerger'],
    flies: [
      'Size 18 Zebra Midge (red, black)',
      'Size 18 Pheasant Tail Nymph',
      'Size 16 Hare\'s Ear Nymph',
      'Size 14 PowerBait Egg pattern',
      'Size 14 San Juan Worm (red, pink)',
      'Size 14 Egg-Sucking Leech',
      'Size 16 Y2K (egg pattern)',
      'Size 16 Sowbug',
      'Size 16 Mole Fly',
      'Size 18 BWO Sparkle Dun',
      'Size 16 PMD Comparadun',
      'Size 14 Elk Hair Caddis (tan)',
      'Size 6 Wooly Bugger (olive, black)',
      'Size 4 Sex Dungeon (small) — brown trout streamer',
      'Size 14 Sulfur Dun',
      'Size 14 Light Cahill',
    ],
    notes: 'Ozark tailwaters — White, Little Red, Norfork, Eleven Point. Year-round dam-discharge cold water. State-record brown trout from Little Red.',
    searchTerm: 'Ozark trout fly fishing',
  },

  // ============== NEW ENGLAND SALTWATER + COASTAL ==============
  {
    id: 'new-england-saltwater-bank',
    name: 'New England Coastal Saltwater Bank',
    scientific: 'Striper + blues + albies + fluke + scup',
    regions: ['New England'],
    states: ['ME', 'NH', 'MA', 'RI', 'CT'],
    rivers: [],
    startMonth: 5, endMonth: 11,
    waterTempMinF: 50, waterTempMaxF: 70,
    timeOfDay: 'evening',
    stages: ['streamer'],
    flies: [
      'Size 1/0 Lefty\'s Deceiver (chartreuse, mackerel)',
      'Size 1/0 Game Changer',
      'Size 1/0 Clouser Minnow',
      'Size 1/0 Sand Eel pattern (slim)',
      'Size 2 Squid pattern',
      'Size 2 EP Anchovy',
      'Size 2 Surf Candy',
      'Size 1/0 Bunker Fly',
      'Size 4 Crab Pattern (tautog)',
      'Diamond Jig 1-3 oz (gear)',
      'Hopkins Hammered Spoon (gear)',
      'Bucktail Jig (1/2 - 4 oz)',
      'Daiwa SP Minnow (surfcasting plug)',
      'Cordell Pencil Popper',
    ],
    notes: 'New England saltwater — Cape Cod, Long Island Sound, Buzzards Bay, Narragansett, Boston Harbor. Stripers + blues mid-spring through fall. Fluke + scup + sea bass + tautog.',
    searchTerm: 'New England striper saltwater',
  },
  {
    id: 'maine-brook-trout-landlocked-salmon',
    name: 'Maine Brook Trout + Landlocked Salmon',
    scientific: 'Salvelinus fontinalis + Salmo salar (landlocked)',
    regions: ['Maine', 'New England'],
    states: ['ME', 'NH', 'VT'],
    rivers: ['Rapid', 'Magalloway', 'Kennebec', 'Penobscot', 'Allagash', 'St. John', 'Moose'],
    startMonth: 5, endMonth: 9,
    waterTempMinF: 50, waterTempMaxF: 64,
    timeOfDay: 'morning',
    stages: ['dun', 'streamer', 'nymph'],
    flies: [
      'Size 4–6 Black Ghost (Maine classic)',
      'Size 4–6 Mickey Finn',
      'Size 6 Gray Ghost',
      'Size 8 Muddler Minnow',
      'Size 14 Adams Parachute',
      'Size 14 Royal Wulff',
      'Size 14 Quill Gordon',
      'Size 14 Hendrickson Dun',
      'Size 14 Light Cahill',
      'Size 14 Elk Hair Caddis',
      'Size 4 Wooly Bugger',
      'Size 6 Maple Syrup (Maine streamer)',
      'Size 6 Warden\'s Worry',
      'Size 6 Joe\'s Smelt',
      'Size 6 Magog Smelt',
      'Size 6 Nine-Three (Maine smelt)',
    ],
    notes: 'Maine brook trout + landlocked salmon — smelt-imitating streamers (Black Ghost, Gray Ghost) for big-river salmon; small attractor dries for brook trout ponds + rivers.',
    searchTerm: 'Maine brook trout landlocked salmon',
  },

  // ============== ALASKA EXTRAS ==============
  {
    id: 'alaska-trout-rainbow',
    name: 'Alaska Rainbow Trout (Kenai-Style)',
    scientific: 'Wild Alaska rainbow trout',
    regions: ['Alaska'],
    states: ['AK'],
    rivers: ['Kenai', 'Naknek', 'Kvichak', 'Iliamna', 'Talarik'],
    startMonth: 5, endMonth: 10,
    waterTempMinF: 38, waterTempMaxF: 58,
    timeOfDay: 'all day',
    stages: ['streamer', 'mouse'],
    flies: [
      'Size 1/0 Articulated Sculpin (Galloup\'s Sex Dungeon, white/yellow)',
      'Size 2 Mouse Pattern (deer hair, foam)',
      'Size 4 Dolly Llama (egg-sucking sculpin)',
      'Size 4 String Leech',
      'Size 4 Bunny Leech',
      'Size 8 Bead Pegged Egg',
      'Size 6 Flesh Fly (dead-salmon flesh)',
      'Size 8 Glo Bug',
      'Size 6 Polish Pierogi',
      'Size 14 Articulated Salmon Smolt (out-migration)',
      'Size 12 Hare\'s Ear Nymph',
    ],
    notes: 'Trophy Alaska rainbow trout — eats salmon eggs + flesh through July-September. Beads pegged 1-2 inches above the hook is the system. Mouse fishing on Kenai-style streams legendary.',
    searchTerm: 'Alaska rainbow trout Kenai',
  },
  {
    id: 'alaska-dolly-varden-grayling',
    name: 'Alaska Dolly Varden + Grayling',
    scientific: 'Salvelinus malma + Thymallus arcticus',
    regions: ['Alaska'],
    states: ['AK', 'MT'],
    rivers: ['Iliamna', 'Nushagak', 'Naknek', 'Bristol Bay tribs'],
    startMonth: 5, endMonth: 10,
    waterTempMinF: 40, waterTempMaxF: 58,
    timeOfDay: 'all day',
    stages: ['dun', 'streamer', 'egg'],
    flies: [
      'Size 14 Adams Parachute',
      'Size 14 Royal Wulff',
      'Size 14 Renegade',
      'Size 14 Purple Haze (Dolly killer)',
      'Size 6 Wooly Bugger',
      'Size 8 Bead Pegged Egg',
      'Size 8 Egg-Sucking Leech',
      'Size 14 Pheasant Tail Nymph',
    ],
    notes: 'Alaska Dolly Varden — char that mob salmon eggs + flesh. Arctic grayling on tiny dries + spinners. Subsistence + sport.',
    searchTerm: 'Alaska Dolly Varden grayling',
  },

  // ============== PLAINS WALLEYE + PIKE + ICE ==============
  {
    id: 'plains-multi-species-supp',
    name: 'Plains Multi-Species Bank (KS/NE/SD/ND)',
    scientific: 'Walleye + pike + bass + crappie + cats',
    regions: ['Plains'],
    states: ['KS', 'NE', 'SD', 'ND', 'IA', 'MN'],
    rivers: ['Missouri River', 'Devils Lake', 'Lake Oahe', 'Lake Sakakawea', 'Lewis & Clark Lake'],
    startMonth: 1, endMonth: 12,
    waterTempMinF: 40, waterTempMaxF: 78,
    timeOfDay: 'all day',
    stages: ['lure'],
    flies: [
      'Bottom-bouncer + crawler harness (perch-color blade)',
      '1/4-oz Jig + Minnow (chartreuse, pink)',
      'Slip-bobber + leech',
      'Bandit 100/200 trolling crank',
      'Smithwick Rogue Suspending Jerkbait',
      'Mepps Aglia #3',
      'Beetle Spin chartreuse',
      'Husky Jerk (perch, blue)',
      'Jigging Rapala (winter)',
      'Buckshot Rattlespoon',
      'Tip-up + shiner (pike)',
      'Bucktail (1-2 oz) — striper on Lake McConaughy',
      'Tungsten Tear-Drop Jig (panfish, perch)',
      'Lindy Slick Jig',
    ],
    notes: 'Plains states multi-species — Lake Sakakawea / Lake Oahe (SD) for walleye + bass; Devils Lake (ND) for walleye + perch + pike; Lake McConaughy (NE) for walleye + striper. Winter ice fishing major.',
    searchTerm: 'plains walleye pike fishing',
  },

  // ============== LOUISIANA + GULF COAST SUPP ==============
  {
    id: 'louisiana-marsh-fly-supp',
    name: 'Louisiana Marsh Inshore Fly Bank',
    scientific: 'Redfish + speckled trout + black drum + flounder',
    regions: ['Louisiana Marsh', 'Gulf Coast'],
    states: ['LA', 'TX', 'MS'],
    rivers: [],
    startMonth: 1, endMonth: 12,
    waterTempMinF: 50, waterTempMaxF: 88,
    timeOfDay: 'all day',
    stages: ['streamer'],
    flies: [
      'Size 2 Bull Red Toad (purple/black)',
      'Size 2 EP Mullet',
      'Size 4 EP Crab',
      'Size 4 Merkin Crab',
      'Size 4 Gold Spoonfly',
      'Size 4 Redfish Toad',
      'Size 4 Borski Slider',
      'Size 4 Seaducer (chartreuse)',
      'Size 2/0 Hollow Fleye (Popovics)',
      'Size 2 Tarpon Toad (small)',
      'Size 4 Whitlock Shrimp',
      'Size 4 Hi-Vis Crab (chartreuse)',
      'Size 4 Mantis Shrimp',
    ],
    notes: 'Louisiana marsh inshore fly bank — bull reds + slot reds + specks + black drum + flounder + tarpon (summer). Best inshore sight-fishing in North America.',
    searchTerm: 'Louisiana redfish marsh',
  },

  // ============== DELAWARE BAY + RI/CT SALT ==============
  {
    id: 'mid-atlantic-saltwater',
    name: 'Mid-Atlantic Saltwater (DE / MD / VA / NJ)',
    scientific: 'Striped bass + flounder + sea bass + tautog + bluefish',
    regions: ['Mid-Atlantic Coast'],
    states: ['DE', 'MD', 'VA', 'NJ', 'NC', 'PA'],
    rivers: [],
    startMonth: 4, endMonth: 11,
    waterTempMinF: 50, waterTempMaxF: 72,
    timeOfDay: 'evening',
    stages: ['streamer'],
    flies: [
      'Size 1/0 Lefty\'s Deceiver (chartreuse, blue/white, mackerel)',
      'Size 1/0 Bunker Fly',
      'Size 2 Sand Eel',
      'Size 2 Squid Pattern',
      'Size 2/0 Game Changer (peanut bunker)',
      'Size 2 Crab Fly (tautog)',
      'Size 2 EP Anchovy',
      'Size 2 Surf Candy',
      'Bucktail Jig 1-3 oz',
      'SP Minnow surf plug',
      'Diamond Jig',
    ],
    notes: 'Mid-Atlantic saltwater — Delaware Bay striper, Chesapeake migratory rockfish, NJ surf, VA Eastern Shore. Spring + fall runs are the peak.',
    searchTerm: 'Mid-Atlantic striper fishing',
  },

  // ============== VT/NH SMALL TROUT STREAMS ==============
  {
    id: 'vt-nh-small-trout-streams',
    name: 'Vermont + New Hampshire Wild Brook Trout',
    scientific: 'Salvelinus fontinalis (wild)',
    regions: ['New England'],
    states: ['VT', 'NH'],
    rivers: ['Battenkill', 'Mettawee', 'Connecticut River tribs', 'Pemigewasset', 'Saco', 'Androscoggin'],
    startMonth: 5, endMonth: 9,
    waterTempMinF: 50, waterTempMaxF: 62,
    timeOfDay: 'afternoon',
    stages: ['dun', 'nymph'],
    flies: [
      'Size 14 Adams Parachute',
      'Size 14 Royal Wulff',
      'Size 14 Light Cahill',
      'Size 14 Elk Hair Caddis',
      'Size 14 Hendrickson Dun',
      'Size 14 March Brown Dun',
      'Size 14 Stimulator (yellow, orange)',
      'Size 14 Pheasant Tail Nymph',
      'Size 14 Hare\'s Ear Nymph',
      'Size 14 Prince Nymph',
      'Size 6 Mickey Finn',
      'Size 6 Black Ghost',
      'Size 6 Muddler Minnow',
      'Size 4 Wooly Bugger (olive, black)',
    ],
    notes: 'VT + NH wild brook trout — small Catskill-style streams + Battenkill brown trout. Tight casts + small flies. Native brookies in headwaters.',
    searchTerm: 'Vermont New Hampshire brook trout',
  },

  // ============== RI FISHING ==============
  {
    id: 'rhode-island-saltwater',
    name: 'Rhode Island Saltwater (Narragansett Bay)',
    scientific: 'Striper + bluefish + albies + tautog + scup',
    regions: ['New England'],
    states: ['RI', 'CT', 'MA'],
    rivers: [],
    startMonth: 5, endMonth: 11,
    waterTempMinF: 50, waterTempMaxF: 72,
    timeOfDay: 'evening',
    stages: ['streamer'],
    flies: [
      'Size 1/0 Lefty\'s Deceiver',
      'Size 2 EP Surf Candy',
      'Size 2 Albie Whore',
      'Size 2 Sand Eel pattern',
      'Size 2 Squid pattern',
      'Size 1/0 Bunker Fly',
      'Size 2 Tautog Crab',
      'Bucktail Jig 1-3 oz',
      'Hopkins Hammered Spoon',
      'Diamond Jig (sea bass, scup)',
    ],
    notes: 'Rhode Island — Narragansett Bay striper, Block Island fall albie run, surf fishing on the South County beaches.',
    searchTerm: 'Rhode Island striper Narragansett',
  },
];

function main() {
  const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const byId = new Map(data.map((e) => [e.id, e]));

  let appended = 0;
  let skipped = 0;
  for (const entry of ENTRIES) {
    if (byId.has(entry.id)) {
      skipped++;
      continue;
    }
    if (entry.searchTerm == null) entry.searchTerm = entry.name;
    if (entry.wikipediaSlug === undefined) entry.wikipediaSlug = null;
    data.push(entry);
    byId.set(entry.id, entry);
    appended++;
  }

  fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`Appended ${appended}, skipped ${skipped}. Total: ${data.length}`);

  const STATE_FLIES = {};
  for (const entry of data) {
    const states = entry.states && entry.states.length ? entry.states : [];
    const flyCount = (entry.flies || []).length;
    for (const s of states) {
      STATE_FLIES[s] = (STATE_FLIES[s] || 0) + flyCount;
    }
  }
  const sorted = Object.entries(STATE_FLIES).sort((a, b) => b[1] - a[1]);
  console.log('\nFinal final per-state fly counts:');
  let above = 0, below = 0;
  for (const [s, c] of sorted) {
    const flag = c >= 100 ? '✓' : '✗';
    if (c >= 100) above++; else below++;
    console.log(`  ${flag} ${s}: ${c}`);
  }
  console.log(`\nStates at 100+: ${above}, under 100: ${below}`);
}

main();
