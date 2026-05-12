// Final gap-fill — fly patterns for under-100 states.
// WI/MN/IA/MO (Driftless + Midwest), TX (bass/redfish/striper), MA/NH/VT/ME/CT/RI
// (New England trout + striper + bluefish), LA (saltwater), KS/NE/SD/ND (plains
// fisheries), AK (salmon central).

const fs = require('node:fs');
const path = require('node:path');

const FILE = path.join(__dirname, '..', 'data', 'hatches.json');

const ENTRIES = [
  // ============== DRIFTLESS AREA + MIDWEST TROUT ==============
  {
    id: 'driftless-spring-creek',
    name: 'Driftless Spring Creek Trout (WI/MN/IA)',
    scientific: 'Wild brown + brook trout fishery',
    regions: ['Driftless Area', 'Midwest'],
    states: ['WI', 'MN', 'IA', 'IL'],
    rivers: ['Kickapoo', 'West Fork Kickapoo', 'Coon Creek', 'Trout Run Creek', 'Whitewater'],
    startMonth: 3, endMonth: 11,
    waterTempMinF: 48, waterTempMaxF: 65,
    timeOfDay: 'morning',
    stages: ['nymph', 'dun'],
    flies: [
      'Size 18 Olive Sparkle Dun',
      'Size 18 BWO Parachute',
      'Size 16 PMD Comparadun',
      'Size 16 Light Cahill Parachute',
      'Size 14 Stimulator (yellow/orange)',
      'Size 16 Adams Parachute',
      'Size 18 Pheasant Tail Nymph',
      'Size 16 Hare\'s Ear Nymph',
      'Size 18 Zebra Midge (black/red)',
      'Size 14 Bead-Head Prince',
      'Size 12 Wooly Bugger (olive, black) — small streams',
      'Size 14 Foam Hopper',
      'Size 16 Mike\'s Beetle',
      'Size 14 Parachute Ant',
    ],
    notes: 'The Driftless Area — limestone spring creeks of WI/MN/IA/IL. Wild brown trout (and brookies in headwaters). Year-round opportunity; technical small-stream fishing.',
    searchTerm: 'Driftless spring creek trout',
    wikipediaSlug: 'Driftless_Area',
  },
  {
    id: 'midwest-warmwater-smallmouth',
    name: 'Midwest River Smallmouth + Trout',
    scientific: 'Smallmouth + brown trout (Midwest rivers)',
    regions: ['Midwest'],
    states: ['WI', 'MN', 'IA', 'MO', 'IN', 'IL', 'MI', 'OH'],
    rivers: ['Wisconsin', 'St. Croix', 'Eleven Point', 'Current', 'Meramec', 'Ozark rivers'],
    startMonth: 4, endMonth: 11,
    waterTempMinF: 55, waterTempMaxF: 78,
    timeOfDay: 'all day',
    stages: ['streamer', 'topwater', 'nymph'],
    flies: [
      'Size 4 Sneaky Pete Popper',
      'Size 4 Murdich Minnow',
      'Size 4 Clouser Minnow (chartreuse/white, gray/white)',
      'Size 4 Lefty\'s Deceiver',
      'Size 6 Wooly Bugger (olive, black, white)',
      'Size 4 Stealth Bomber',
      'Size 6 Mini Loop Sculpin',
      'Size 4 Whitlock\'s Near-Nuff Crayfish',
      'Size 6 Bunny Leech (olive, brown)',
      'Size 8 Hi-Vis Hopper',
      'Size 6 Game Changer (small) — smelt/shad',
    ],
    notes: 'Midwest river smallmouth — Wisconsin, St. Croix, Ozark rivers. Wisconsin + Driftless brown trout in cooler reaches.',
    searchTerm: 'Midwest river smallmouth fly fishing',
  },

  // ============== NEW ENGLAND TROUT + STRIPER + SALTWATER ==============
  {
    id: 'new-england-trout',
    name: 'New England Stream Trout',
    scientific: 'Wild brook + brown + rainbow trout',
    regions: ['New England'],
    states: ['ME', 'NH', 'VT', 'MA', 'CT', 'RI', 'NY'],
    rivers: ['Battenkill', 'Deerfield', 'Farmington', 'Westfield', 'Swift', 'Rapid', 'Magalloway', 'Kennebec', 'Penobscot'],
    startMonth: 4, endMonth: 10,
    waterTempMinF: 48, waterTempMaxF: 64,
    timeOfDay: 'afternoon',
    stages: ['dun', 'emerger', 'nymph'],
    flies: [
      'Size 14 Adams Parachute',
      'Size 14 Royal Wulff',
      'Size 14 Light Cahill',
      'Size 14 Hendrickson Dun',
      'Size 14 Comparadun (mahogany, sulfur)',
      'Size 14 Quill Gordon Dun',
      'Size 16 BWO Parachute',
      'Size 14 Elk Hair Caddis (tan)',
      'Size 14 Pheasant Tail Nymph',
      'Size 14 Hare\'s Ear Nymph',
      'Size 14 Prince Nymph',
      'Size 14 Zug Bug',
      'Size 6 Mickey Finn',
      'Size 6 Black Ghost',
      'Size 4 Wooly Bugger',
      'Size 4 Muddler Minnow',
    ],
    notes: 'New England trout — Catskills hatch sequence (Hendrickson, Cahill, Quill Gordon, March Brown). Wild brook trout in ME/NH/VT headwaters; stocked rainbows and browns in tailwaters.',
    searchTerm: 'New England wild trout',
  },
  {
    id: 'striper-fly-coastal-northeast',
    name: 'Northeast Coast Striper + Bluefish',
    scientific: 'Morone saxatilis + Pomatomus saltatrix',
    regions: ['Northeast Coast'],
    states: ['ME', 'NH', 'MA', 'RI', 'CT', 'NY', 'NJ', 'MD', 'DE', 'VA'],
    rivers: [],
    startMonth: 4, endMonth: 11,
    waterTempMinF: 50, waterTempMaxF: 72,
    timeOfDay: 'evening',
    stages: ['streamer', 'topwater'],
    flies: [
      'Size 2/0 Beast Fleye (Popovics)',
      'Size 2/0 Hollow Fleye',
      'Size 1/0 Lefty\'s Deceiver (chartreuse/white, blue/white, black)',
      'Size 1/0 Half & Half',
      'Size 1/0 Clouser Minnow (chartreuse/white)',
      'Size 1/0 Bunker Fly',
      'Size 1/0 Surf Candy (Popovics)',
      'Size 2 Crease Fly',
      'Size 2/0 Schminnow',
      'Size 1/0 Snake Fly',
      'Size 1/0 Tabory\'s Slab Side',
      'Size 2 Sand Eel pattern',
      'Size 1/0 Eelie (long shank, slim)',
    ],
    notes: 'Northeast striper + bluefish — surf, jetty, boat. Match the bait: sand eels, peanut bunker, silversides, herring, mullet (fall run). Striper migration NJ to Maine April-November.',
    searchTerm: 'striped bass Northeast fly fishing',
  },

  // ============== TEXAS BASS + REDFISH + COASTAL ==============
  {
    id: 'texas-bass-fly-bank',
    name: 'Texas Largemouth + Smallmouth Bass Flies',
    scientific: 'Micropterus (Texas bass fishery)',
    regions: ['Texas', 'South'],
    states: ['TX', 'OK', 'AR', 'LA', 'NM'],
    rivers: ['Lake Fork', 'Falcon Lake', 'Sam Rayburn', 'Toledo Bend', 'Devils River'],
    startMonth: 1, endMonth: 12,
    waterTempMinF: 55, waterTempMaxF: 85,
    timeOfDay: 'all day',
    stages: ['streamer', 'topwater'],
    flies: [
      'Size 2/0 Game Changer (Chocklett) — bluegill, shad',
      'Size 2/0 Pencil Popper (yellow, chartreuse)',
      'Size 1/0 Frog Diver (yellow/black)',
      'Size 1/0 Bass Bug (foam)',
      'Size 1/0 Lefty\'s Deceiver (chartreuse/yellow)',
      'Size 1/0 Murdich Minnow',
      'Size 1/0 Clouser Minnow',
      'Size 2 Whitlock\'s Crayfish',
      'Size 2 Wooly Bugger XXL (rubber-legged)',
      'Size 4 Texas Hopper (foam)',
    ],
    notes: 'Texas bass — Lake Fork, Falcon, Sam Rayburn, Toledo Bend. Big fly bass fly fishing on Florida-strain trophy lakes. Pre-spawn February (south TX) to April (north).',
    searchTerm: 'Texas largemouth fly fishing',
  },
  {
    id: 'texas-redfish-fly',
    name: 'Texas Coastal Redfish + Trout',
    scientific: 'Redfish + speckled trout (TX coast)',
    regions: ['Texas Coast'],
    states: ['TX', 'LA'],
    rivers: [],
    startMonth: 1, endMonth: 12,
    waterTempMinF: 55, waterTempMaxF: 88,
    timeOfDay: 'all day',
    stages: ['streamer'],
    flies: [
      'Size 4 Gold Spoonfly (weedless)',
      'Size 4 EP Crab',
      'Size 4 Merkin Crab',
      'Size 4 Redfish Toad',
      'Size 4 Borski Slider',
      'Size 4 Clouser Minnow (chartreuse/white, brown/orange)',
      'Size 4 Seaducer (white, chartreuse)',
      'Size 4 Tarpon Toad (small) — shark sight-cast',
      'Size 4 Mantis Shrimp',
      'Size 4 Hi-Vis Crab',
    ],
    notes: 'Texas coast redfish fly fishing — Laguna Madre, Aransas Pass, Galveston Bay flats. Same playbook as GA/Carolina Golden Isles.',
    searchTerm: 'Texas redfish fly fishing',
  },
  {
    id: 'la-marsh-redfish',
    name: 'Louisiana Marsh Redfish',
    scientific: 'Sciaenops ocellatus (Louisiana strain — bull reds)',
    regions: ['Gulf Coast', 'Louisiana Marsh'],
    states: ['LA', 'TX', 'MS', 'AL'],
    rivers: [],
    startMonth: 1, endMonth: 12,
    waterTempMinF: 50, waterTempMaxF: 88,
    timeOfDay: 'all day',
    stages: ['streamer'],
    flies: [
      'Size 2 Bull Redfish Toad (big purple/black)',
      'Size 2 EP Mullet',
      'Size 2 EP Crab',
      'Size 2/0 Bunker Fly',
      'Size 2 Clouser Minnow XL',
      'Size 2 Tarpon Toad',
      'Size 2 Whitlock Crab',
      'Size 4 Gold Spoonfly',
      'Size 2 Hollow Fleye (Popovics)',
    ],
    notes: 'Louisiana marsh redfish — pre-spawn fall bull reds 25–40+ lb. Larger flies than typical redfish work. World-class sight-fishing.',
    searchTerm: 'Louisiana marsh redfish fly fishing',
  },

  // ============== PLAINS STATES (KS/NE/SD/ND) ==============
  {
    id: 'plains-walleye-bass',
    name: 'Plains States Walleye + Bass + Pike',
    scientific: 'Walleye + smallmouth + northern pike',
    regions: ['Great Plains'],
    states: ['KS', 'NE', 'SD', 'ND', 'MN', 'IA'],
    rivers: ['Missouri River', 'James River', 'Big Sioux'],
    startMonth: 4, endMonth: 11,
    waterTempMinF: 50, waterTempMaxF: 76,
    timeOfDay: 'morning',
    stages: ['lure'],
    flies: [
      'Bottom-bouncer + crawler harness',
      '1/4-oz Jig + Minnow (chartreuse, perch)',
      'Slip-bobber + leech',
      'Husky Jerk Suspending Jerkbait',
      'Smithwick Rogue',
      'Reef Runner Ripshad',
      'Mepps Aglia #3-4',
      'Bobby Garland Crappie Shooter (panfish bycatch)',
      '1/2-oz Marabou Jig (pike + bass)',
      'Spinnerbait (1/2-oz)',
      'Topwater Plug (Spook)',
      'Pike Fly — Size 4/0 Bull Dawg',
    ],
    notes: 'Plains states — Missouri River walleye + Devils Lake ND multi-species + Glendo Reservoir + Lake McConaughy. Plus river pike + smallmouth + bass + catfish.',
    searchTerm: 'Plains states walleye pike',
  },

  // ============== ALASKA ==============
  {
    id: 'alaska-salmon-fly-bank',
    name: 'Alaska Salmon + Trout Fly Bank',
    scientific: 'All five Pacific salmon + native rainbow + Dolly Varden + grayling',
    regions: ['Alaska'],
    states: ['AK'],
    rivers: ['Kenai', 'Kasilof', 'Naknek', 'Nushagak', 'Anchor', 'Russian'],
    startMonth: 5, endMonth: 10,
    waterTempMinF: 38, waterTempMaxF: 60,
    timeOfDay: 'all day',
    stages: ['streamer', 'egg'],
    flies: [
      'Size 4 Coho Killer (pink, chartreuse, glow)',
      'Size 4 Egg-Sucking Leech (purple/black, pink)',
      'Size 6 Glo Bug egg (chartreuse, pink, peach)',
      'Size 6 Polish Pierogi (egg-cluster)',
      'Size 4 Bunny Leech (pink, purple, black)',
      'Size 2/0 Pink Pollywog (waker)',
      'Size 4 Sockeye Lite',
      'Size 4 Comet (orange, pink)',
      'Size 6 Flesh Fly (dead-salmon flesh imitation)',
      'Size 8 Bead Pegged Egg',
      'Size 8 Beadhead Egg-Sucking Leech',
      'Size 14 Mouse Pattern (for rainbows on Kenai)',
      'Size 14 Articulated Sculpin (Galloup) — rainbow trophy',
    ],
    notes: 'Alaska — all five Pacific salmon + native rainbow + Dolly Varden + grayling. Beads pegged above the hook for trout-eating-salmon-eggs is the trophy bow technique.',
    searchTerm: 'Alaska salmon fly fishing',
  },

  // ============== MASSACHUSETTS / RI SALTWATER ==============
  {
    id: 'cape-cod-bonito-tuna',
    name: 'Cape Cod Albies + Bonito + Bluefish',
    scientific: 'False albacore + bonito + bluefish (Cape Cod fall run)',
    regions: ['Northeast Coast'],
    states: ['MA', 'RI', 'NY', 'CT'],
    rivers: [],
    startMonth: 8, endMonth: 11,
    waterTempMinF: 60, waterTempMaxF: 72,
    timeOfDay: 'morning',
    stages: ['streamer'],
    flies: [
      'Size 2 EP Surf Candy',
      'Size 2 Albie Whore (small epoxy fly)',
      'Size 2 Bonito Bunny',
      'Size 2 Crystal Sand Eel',
      'Size 2 Glass Minnow',
      'Size 4 Gartside Glimmer Minnow',
      'Size 2/0 Bluefish-proof wire trace fly',
    ],
    notes: 'Cape Cod fall run — albies + bonito + bluefish blitzing peanut bunker schools. Fast strip retrieve on 8-9 wt rod. October peak.',
    searchTerm: 'false albacore bonito Cape Cod',
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
  console.log('\nFinal per-state fly counts:');
  let above = 0, below = 0;
  for (const [s, c] of sorted) {
    const flag = c >= 100 ? '✓' : '✗';
    if (c >= 100) above++; else below++;
    console.log(`  ${flag} ${s}: ${c}`);
  }
  console.log(`\nStates at 100+: ${above}, under 100: ${below}`);
}

main();
