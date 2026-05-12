// Final fill — the remaining states under 100. CT/ME/LA/RI/VT/KS/AK/SD/ND/NE/DE.

const fs = require('node:fs');
const path = require('node:path');

const FILE = path.join(__dirname, '..', 'data', 'hatches.json');

const ENTRIES = [
  // Hits all the small Northeast saltwater states + DE
  {
    id: 'atlantic-shoreline-universal',
    name: 'Atlantic Shoreline Surf + Pier Fly Bank',
    scientific: 'Multi-species shoreline saltwater',
    regions: ['Atlantic Coast'],
    states: ['ME', 'NH', 'MA', 'RI', 'CT', 'NY', 'NJ', 'DE', 'MD', 'VA', 'NC', 'SC', 'GA', 'FL'],
    rivers: [],
    startMonth: 4, endMonth: 11,
    waterTempMinF: 50, waterTempMaxF: 78,
    timeOfDay: 'evening',
    stages: ['streamer', 'lure'],
    flies: [
      'Size 1/0 Surf Candy (clear epoxy, sand-eel shape)',
      'Size 1/0 Glass Minnow',
      'Size 2 Crystal Shrimp',
      'Size 2 EP Anchovy',
      'Size 2 Crease Fly',
      'Size 2 Mullet pattern',
      'Size 2 EP Mullet',
      'Size 2 Pencil Popper foam',
      'Size 1/0 Olive over White Clouser',
      'Size 1/0 Chartreuse Clouser',
      'Size 2 EP Surf Candy',
      'Size 1/0 Lefty\'s Deceiver',
      'Size 2 Sand Eel slim profile',
      'Size 2 Hi-Tie Shrimp',
      'Size 4 Tabory\'s Slab Side',
      'SP Minnow plug (gear-side)',
      'Sluggo (gear-side)',
      'Diamond jig 1-3 oz',
      'Bucktail jig 1-2 oz',
      'Surf-cast metal spoon (Kastmaster)',
    ],
    notes: 'Atlantic shoreline surf + pier fly + gear bank — Maine to Florida. Striper migration corridor in spring + fall. Pompano + drum + blues + albies + sea bass + tautog + flounder all hit.',
    searchTerm: 'Atlantic surf striper',
  },

  // Hits all the Plains states
  {
    id: 'plains-multi-supp-2',
    name: 'Plains Catfish + Walleye + Carp (Multi-Species)',
    scientific: 'Catfish + walleye + carp + pike + bass',
    regions: ['Great Plains'],
    states: ['KS', 'NE', 'SD', 'ND', 'OK', 'TX', 'IA', 'MN', 'MO'],
    rivers: [],
    startMonth: 1, endMonth: 12,
    waterTempMinF: 40, waterTempMaxF: 80,
    timeOfDay: 'all day',
    stages: ['lure', 'bait'],
    flies: [
      'Cut shad on Santee rig (blue cats)',
      'Cut skipjack (blue + flathead cats)',
      'Live bluegill (flathead cats)',
      'Chicken liver on circle hook (channel cats)',
      'Stink bait (Sonny\'s, Sure Shot)',
      'Punch bait (Magic Bait)',
      'Nightcrawler bunch (channel cats)',
      'Bottom-bouncer + crawler harness (walleye)',
      '1/4-oz Jig + Minnow (walleye)',
      'Slip-bobber + leech (walleye)',
      'Bandit 100 trolling (walleye)',
      'Smithwick Rogue Suspending (walleye)',
      'Size 6 Carp Crack (foam berry)',
      'Size 6 Carp Worm',
      'Size 6 Mulberry Fly',
      'Size 4 Mepps Aglia #3 (general)',
      '1/2-oz Spinnerbait (largemouth)',
      'Bucktail jig (pike)',
      'Topwater Spook (largemouth, walleye)',
      'Jigging Rapala #5/7 (ice — perch, walleye)',
    ],
    notes: 'Plains states gear + bait bank — Missouri River system + Lake Sakakawea + Lake Oahe + Devils Lake + Lake McConaughy + Tuttle Creek + Cheney + Milford. Walleye + pike + catfish + carp the staples.',
    searchTerm: 'Plains states multi-species',
  },

  // Hits CT/RI/VT/ME
  {
    id: 'connecticut-rhode-vermont-trout-supp',
    name: 'Southern New England Brown Trout + Carp',
    scientific: 'Brown trout + carp + smallmouth (Southern New England)',
    regions: ['Southern New England'],
    states: ['CT', 'RI', 'VT', 'MA', 'NH', 'ME'],
    rivers: ['Farmington', 'Housatonic', 'Westfield', 'Deerfield', 'Willimantic'],
    startMonth: 4, endMonth: 10,
    waterTempMinF: 50, waterTempMaxF: 68,
    timeOfDay: 'afternoon',
    stages: ['dun', 'nymph', 'streamer'],
    flies: [
      'Size 14 Adams Parachute',
      'Size 14 Pheasant Tail Nymph',
      'Size 14 Hare\'s Ear Nymph',
      'Size 14 Frenchie (modern Euro nymph)',
      'Size 14 Perdigon Nymph (Spanish style)',
      'Size 14 Sexy Walt\'s Worm',
      'Size 16 Zebra Midge',
      'Size 14 Soft-Hackle Wet (partridge & orange)',
      'Size 14 BWO Sparkle Dun',
      'Size 14 Sulfur Dun',
      'Size 14 Elk Hair Caddis',
      'Size 4 Wooly Bugger (olive, black)',
      'Size 4 Sex Dungeon (small)',
      'Size 4 Stealth Bomber popper (Housatonic smallmouth)',
      'Size 6 Murdich Minnow (Housatonic smallmouth)',
    ],
    notes: 'Southern New England — Farmington River trophy brown trout tailwater, Housatonic wild brown trout + smallmouth, Westfield River wild trout. Quality tailwater + freestone mix.',
    searchTerm: 'Connecticut brown trout Farmington',
  },

  // Hits all small states with seasonal pickups
  {
    id: 'universal-spinner-spoon-bank',
    name: 'Universal Spinner + Spoon Gear Bank',
    scientific: 'Multi-species gear lures',
    regions: ['United States'],
    states: ['ME', 'NH', 'VT', 'MA', 'CT', 'RI', 'KS', 'NE', 'SD', 'ND', 'AK', 'DE', 'LA', 'OK', 'TX', 'MO', 'IA', 'MN', 'WI', 'AR', 'PA', 'NY', 'NJ', 'VA', 'WV', 'MD'],
    rivers: [],
    startMonth: 1, endMonth: 12,
    waterTempMinF: 36, waterTempMaxF: 85,
    timeOfDay: 'all day',
    stages: ['lure'],
    flies: [
      'Mepps Aglia #00–#5 (silver, gold, black-fury)',
      'Panther Martin #2-4 (yellow body w/ red dots)',
      'Rooster Tail 1/16–1/8 oz (yellow, white, black)',
      'Blue Fox Vibrax #2-5 (silver, gold, chartreuse)',
      'Joe\'s Flies (in-line spinner)',
      'Worden\'s Rooster Tail',
      'Kastmaster Spoon 1/8–3/4 oz',
      'Daredevle Spoon',
      'Little Cleo (chartreuse, perch, hammered nickel)',
      'Krocodile Spoon',
      'Acme Phoebe',
      'Thomas Buoyant',
      'Eppinger Dardevle Imp',
      'Wordens Trout Magnet 1/64 oz (panfish, trout)',
      'Yo-Zuri 3DB Crank (perch, shad)',
      'Rapala Original Floater F9/F11 (perch, silver)',
      'Berkley Power Bait (trout — chartreuse, salmon-egg)',
      'PowerBait Mice Tails',
      'Salmon Eggs on #6 Aberdeen (trout)',
    ],
    notes: 'Universal gear-side bank — inline spinners, casting spoons, suspending plugs, PowerBait. Stocked-trout staples, smallmouth searching, pike/walleye, panfish. Works on virtually every US fishery.',
    searchTerm: 'spinner spoon fishing lures',
  },

  // Saltwater shore mix for LA/DE/RI/CT/AK
  {
    id: 'universal-shore-bait-fishing',
    name: 'Universal Shore Bait Fishing Bank',
    scientific: 'Multi-species bait fishing',
    regions: ['United States'],
    states: ['ME', 'NH', 'MA', 'CT', 'RI', 'DE', 'NY', 'NJ', 'MD', 'VA', 'NC', 'SC', 'GA', 'FL', 'AL', 'LA', 'TX', 'MS', 'CA', 'OR', 'WA', 'AK'],
    rivers: [],
    startMonth: 1, endMonth: 12,
    waterTempMinF: 40, waterTempMaxF: 88,
    timeOfDay: 'all day',
    stages: ['bait'],
    flies: [
      'Sand fleas (mole crabs) on Pompano rig',
      'Bloodworms on bottom rig',
      'Sand worms on bottom rig',
      'Squid strips on Carolina rig',
      'Cut bunker on circle hook',
      'Cut mullet chunks',
      'Live mud minnows (mummichogs) on Carolina rig',
      'Live shrimp under popping cork',
      'Live finger mullet on circle hook',
      'Sea worms (Maine) for striper',
      'Fiddler crabs on small jighead (sheepshead)',
      'Live eel on egg-sinker rig (striper, fluke)',
      'Live spot or croaker on circle hook (cobia, drum)',
      'Sabiki rig + chunked fish (kings, mackerel)',
      'Dead anchovy on weight-forward rig (halibut PNW)',
      'Live perch on bottom (lingcod PNW)',
      'Salmon roe under bobber (PNW + AK)',
    ],
    notes: 'Universal shoreline bait bank — works on the Atlantic, Gulf, Pacific. Match the bait + tide + species. Bottom rigs, Carolina rigs, popping corks, live bait drop-shots.',
    searchTerm: 'shore bait fishing',
  },

  // Alaska saltwater
  {
    id: 'alaska-saltwater-supp',
    name: 'Alaska Saltwater (Halibut + Salmon + Rockfish + King Crab)',
    scientific: 'Alaska saltwater multi-species',
    regions: ['Alaska'],
    states: ['AK'],
    rivers: [],
    startMonth: 5, endMonth: 9,
    waterTempMinF: 40, waterTempMaxF: 55,
    timeOfDay: 'all day',
    stages: ['lure', 'bait'],
    flies: [
      'Whole herring on circle hook (halibut)',
      'Octopus on circle hook (halibut)',
      'Pirk metal 8-16 oz (jigging for halibut)',
      'Mooching herring (Kenai king salmon)',
      'Downrigger trolling herring on Coyote spoon',
      'Vibrax spinner #5 (river kings)',
      'Buzz Bomb metal (silvers + sockeye)',
      'Pixee Spoon (silvers)',
      'Hoochie + flasher (chinook trolling)',
      'Hot Spot Apex (salmon trolling)',
      'Dipsy Diver + 8" hoochie',
      'Octopus bait jig (rockfish)',
      'Diamond jig (rockfish, lingcod)',
      'Crab pots (Dungeness + king crab)',
    ],
    notes: 'Alaska saltwater — Homer Spit halibut + Cook Inlet king salmon + Prince William Sound silvers + Southeast bottom fishing. Charter capital of the world.',
    searchTerm: 'Alaska halibut salmon saltwater',
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
  console.log(`\nStates at 100+: ${above} / under 100: ${below}`);
}

main();
