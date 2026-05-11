/**
 * One-shot expansion of data/hatches.json:
 *
 *   1. Pad the `flies` arrays on existing hatch entries with more
 *      variants (emerger, cripple, wet, nymph, parachute) so the
 *      angler sees the full toolkit instead of just 1-2 dry flies.
 *   2. Add ~17 new hatch / always-on food-form entries, focused on
 *      MI, TN, GA, NC and the Western states (MT/ID/UT/CO).
 *
 * Idempotent — re-running merges new flies without duplicating, and
 * skips entries whose `id` is already present.
 *
 * Run: node scripts/expand-hatches-flies.cjs
 */

const fs = require('node:fs');
const path = require('node:path');

const FILE = path.join(__dirname, '..', 'data', 'hatches.json');

// ----- pad existing entries' fly arrays --------------------------------------

const FLY_ADDITIONS = {
  // Sulfur — South Holston is famous for picky risers; cripples + emergers
  // do the heavy lifting on slick water.
  sulfur: [
    'Size 16 Quigley cripple (sulfur)',
    'Size 16 CDC sulfur emerger',
    'Size 14 sulfur soft-hackle (wet)',
    'Size 14 pheasant-tail nymph',
  ],
  'bwo-spring': [
    'Size 18-20 sparkle dun BWO',
    'Size 20 RS2 (sub-surface emerger)',
    'Size 22 olive Mole fly',
    'Size 18 BWO soft-hackle (wet)',
    'Size 18 Frenchie nymph (olive)',
  ],
  'bwo-fall': [
    'Size 20-22 BWO emerger',
    'Size 22 olive RS2',
    'Size 20 CDC BWO',
    'Size 22 Sparkle Dun (greys)',
  ],
  hendrickson: [
    'Size 12-14 Hendrickson emerger',
    'Size 14 Quigley cripple (hendrickson)',
    'Size 12 Hendrickson soft-hackle',
    'Size 12 dark Hare\'s ear nymph',
  ],
  'march-brown': [
    'Size 12 March Brown spinner',
    'Size 12 March Brown emerger',
    'Size 12 March Brown wet fly (classic)',
    'Size 10-12 hare\'s-ear nymph',
  ],
  'caddis-grannom': [
    'Size 14-16 Elk-hair caddis (olive)',
    'Size 14 LaFontaine sparkle pupa',
    'Size 14 X-caddis',
    'Size 14 soft-hackle (partridge / olive)',
    'Size 12-14 caddis larva (olive)',
  ],
  'caddis-cinnamon': [
    'Size 14-16 Elk-hair caddis (tan)',
    'Size 16 X-caddis (tan)',
    'Size 14 LaFontaine emergent sparkle pupa (tan)',
    'Size 16 soft-hackle (hare\'s ear)',
  ],
  'stonefly-yellow-sally': [
    'Size 14 Stimulator (yellow)',
    'Size 14 yellow Sally chubby',
    'Size 16 yellow stone nymph',
    'Size 14 yellow soft-hackle',
  ],
  isonychia: [
    'Size 10-12 Slate Drake parachute',
    'Size 12 Iso wet fly (Leadwing Coachman)',
    'Size 10 Iso nymph (slender, ribbed)',
    'Size 12 Iso emerger (Quigley cripple)',
  ],
  trico: [
    'Size 22 Trico CDC emerger',
    'Size 24 spent-wing spinner',
    'Size 22 Griffith\'s gnat (cluster)',
  ],
  hex: [
    'Size 6 Hex dun (deer-hair body)',
    'Size 6 Hex spinner (rust)',
    'Size 8 Hex emerger (foam wing)',
    'Size 6-8 Hex wiggle nymph',
  ],
  'white-mayfly': [
    'Size 12 white parachute',
    'Size 14 White Wulff',
    'Size 14 white spinner',
  ],
  midges: [
    'Size 22-24 disco midge',
    'Size 22 midge larva (red, olive, black)',
    'Size 22 RS2 midge emerger',
    'Size 24 mating-cluster Griffith\'s',
    'Size 22 Top Secret midge',
  ],
  'terrestrials-summer': [
    'Size 16 cinnamon flying ant',
    'Size 8-10 Chubby Chernobyl',
    'Size 10 Dave\'s Hopper',
    'Size 14 foam beetle (peacock)',
    'Size 12-14 cricket',
    'Size 16 black ant (parachute)',
  ],
  salmonfly: [
    'Size 4-6 Salmonfly nymph (Pat\'s Stone, Kaufmann\'s)',
    'Size 6 Rogue stone (foam body)',
    'Size 6 sofa-pillow variant',
    'Size 8 Norm Wood\'s Salmonfly (CDC wing)',
  ],
  pmd: [
    'Size 16 PMD CDC emerger',
    'Size 18 PMD Quigley cripple',
    'Size 16 PMD soft-hackle (wet)',
    'Size 16 pheasant-tail nymph',
    'Size 18 PMD rusty spinner',
  ],
  'golden-stone': [
    'Size 8-10 golden stone nymph (Pat\'s rubber-legs)',
    'Size 8 Yellow Stimulator',
    'Size 8 Mercer\'s Golden stone',
  ],
  callibaetis: [
    'Size 16 Callibaetis cripple',
    'Size 16 Callibaetis soft-hackle (wet)',
    'Size 14-16 Callibaetis nymph (PT-style)',
  ],
  'skwala-stonefly': [
    'Size 8-10 Olive Stimulator',
    'Size 8 Skwala chubby',
    'Size 10-12 Pat\'s rubber-legs (olive)',
    'Size 12 dark stone nymph',
  ],
  'mahogany-dun': [
    'Size 16 Mahogany Quigley cripple',
    'Size 16 Mahogany emerger',
    'Size 18 mahogany rusty spinner',
  ],
  'green-drake-western': [
    'Size 10 Drake nymph (large PT)',
    'Size 12 Green Drake emerger',
    'Size 10 Green Drake spinner',
    'Size 12 olive soft-hackle (wet)',
  ],
  'october-caddis': [
    'Size 8 October caddis pupa (orange)',
    'Size 8 sparkle pupa (LaFontaine, October orange)',
    'Size 8 orange soft-hackle',
  ],
  'trico-western': [
    'Size 22 CDC Trico emerger',
    'Size 24 Trico female (greys)',
    'Size 22 Griffith\'s cluster',
  ],
};

// ----- new entries -----------------------------------------------------------

const NEW_ENTRIES = [
  // ===== Eastern / Southern Appalachian additions =============================
  {
    id: 'quill-gordon',
    name: 'Quill Gordon',
    scientific: 'Epeorus pleuralis',
    regions: ['Southern Appalachia', 'Mid-Atlantic', 'Northeast'],
    states: ['TN', 'NC', 'GA', 'KY', 'PA'],
    rivers: ['Little River', 'Tellico River', 'Davidson River', 'Hiwassee River', 'Penn\'s Creek'],
    startMonth: 3,
    endMonth: 4,
    waterTempMinF: 50,
    waterTempMaxF: 56,
    timeOfDay: 'afternoon',
    stages: ['dun', 'emerger', 'nymph'],
    flies: [
      'Size 12-14 Quill Gordon parachute',
      'Size 14 Quill Gordon dun (traditional)',
      'Size 12 Quill Gordon wet fly',
      'Size 14 Quill Gordon emerger (Lawson cripple)',
      'Size 12 Quill Gordon nymph (PT variant)',
    ],
    searchTerm: 'quill gordon Epeorus pleuralis mayfly',
    wikipediaSlug: 'Epeorus',
    notes: 'The first mayfly hatch of the year in the Smokies. Cold, often drizzly early-spring afternoons. Trout aren\'t selective yet — close-enough patterns work.',
  },
  {
    id: 'light-cahill',
    name: 'Light Cahill',
    scientific: 'Stenacron interpunctatum / Stenonema modestum',
    regions: ['Southern Appalachia', 'Mid-Atlantic', 'Northeast', 'Upper Midwest'],
    states: ['TN', 'NC', 'GA', 'KY', 'PA', 'MI', 'IN', 'AR'],
    rivers: ['South Holston', 'Watauga', 'Nantahala River', 'Davidson River', 'Au Sable'],
    startMonth: 6,
    endMonth: 8,
    waterTempMinF: 58,
    waterTempMaxF: 68,
    timeOfDay: 'evening',
    stages: ['dun', 'spinner', 'emerger'],
    flies: [
      'Size 14 Light Cahill parachute (cream body)',
      'Size 14 Cahill spinner (yellow body)',
      'Size 14 Cahill emerger',
      'Size 14 Cahill soft-hackle (yellow)',
      'Size 14 Light Cahill wet fly',
      'Size 14 cream PT nymph',
    ],
    searchTerm: 'light cahill Stenacron Stenonema mayfly',
    wikipediaSlug: 'Stenonema',
    notes: 'Late-evening hatch through warm summer months. Pale cream body + light wings — easy to spot in low light. Spinner falls right at dark.',
  },
  {
    id: 'slate-drake',
    name: 'Slate Drake',
    scientific: 'Isonychia bicolor',
    regions: ['Southern Appalachia', 'Mid-Atlantic', 'Northeast'],
    states: ['TN', 'NC', 'GA', 'PA', 'KY'],
    rivers: ['South Holston', 'Watauga', 'Penn\'s Creek', 'Nantahala River'],
    startMonth: 8,
    endMonth: 10,
    waterTempMinF: 54,
    waterTempMaxF: 68,
    timeOfDay: 'evening',
    stages: ['dun', 'spinner'],
    flies: [
      'Size 10-12 Slate Drake parachute',
      'Size 12 Isonychia spinner (rust body)',
      'Size 10 Leadwing Coachman (wet)',
      'Size 10-12 Iso swimmer nymph',
      'Size 12 Quigley cripple (mahogany)',
    ],
    searchTerm: 'slate drake Isonychia bicolor mayfly',
    wikipediaSlug: 'Isonychia',
    notes: 'Late-summer / fall counterpart to Isonychia bicolor. Crawls out on rocks to emerge — fish wets and emergers near banks at dusk.',
  },
  {
    id: 'sulfur-mi',
    name: 'Sulfur (MI rivers)',
    scientific: 'Ephemerella invaria / dorothea',
    regions: ['Upper Midwest'],
    states: ['MI', 'IN'],
    rivers: ['Au Sable', 'Upper Manistee', 'Pere Marquette'],
    startMonth: 5,
    endMonth: 7,
    waterTempMinF: 54,
    waterTempMaxF: 64,
    timeOfDay: 'evening',
    stages: ['dun', 'spinner', 'emerger'],
    flies: [
      'Size 16 Sulfur Compara-dun',
      'Size 16 Quigley cripple',
      'Size 14-16 Sulfur soft-hackle',
      'Size 18 spinner (rusty)',
      'Size 14 pheasant-tail nymph',
    ],
    searchTerm: 'sulfur mayfly Ephemerella Michigan',
    wikipediaSlug: 'Ephemerellidae',
    notes: 'Mid-May through June on the Au Sable + Manistee. Smaller than the South Holston version. Evening rises through twilight.',
  },
  {
    id: 'brown-drake',
    name: 'Brown Drake',
    scientific: 'Ephemera simulans',
    regions: ['Upper Midwest', 'Rockies', 'Pacific NW'],
    states: ['MI', 'IN', 'ID', 'MT', 'PA'],
    rivers: ['Au Sable', 'Upper Manistee', 'Henrys Fork', 'Silver Creek', 'South Fork Snake'],
    startMonth: 6,
    endMonth: 6,
    waterTempMinF: 58,
    waterTempMaxF: 68,
    timeOfDay: 'evening',
    stages: ['dun', 'spinner', 'emerger'],
    flies: [
      'Size 10 Brown Drake parachute',
      'Size 10 Brown Drake spinner (rust)',
      'Size 10-12 Brown Drake emerger',
      'Size 10 Brown Drake wiggle nymph',
    ],
    searchTerm: 'brown drake Ephemera simulans mayfly',
    wikipediaSlug: 'Ephemera_simulans',
    notes: 'Late-June dusk hatch — Hex precursor on MI rivers; Henrys Fork bucket-list event. Spinner fall at last light is THE event. Window is narrow (~10 days).',
  },

  // ===== Western mayflies / caddis / stoneflies =================================
  {
    id: 'mothers-day-caddis',
    name: 'Mother\'s Day Caddis',
    scientific: 'Brachycentrus occidentalis',
    regions: ['Rockies', 'Pacific NW'],
    states: ['MT', 'ID', 'UT', 'CO', 'WY'],
    rivers: ['Madison River', 'Yellowstone River', 'Big Hole River', 'Beaverhead River'],
    startMonth: 4,
    endMonth: 5,
    waterTempMinF: 48,
    waterTempMaxF: 58,
    timeOfDay: 'afternoon',
    stages: ['adult', 'pupa', 'larva'],
    flies: [
      'Size 14-16 Elk-hair caddis (olive)',
      'Size 14 LaFontaine emergent sparkle pupa',
      'Size 14 X-caddis (olive)',
      'Size 14 caddis larva (green rock-worm)',
      'Size 14 soft-hackle (partridge / olive)',
    ],
    searchTerm: 'mother\'s day caddis Brachycentrus occidentalis',
    wikipediaSlug: 'Brachycentrus',
    notes: 'Yellowstone + Madison legend — dense swarms in late April / early May right before runoff. Fish lose their minds. Often coincides with the holiday weekend.',
  },
  {
    id: 'spruce-moth',
    name: 'Spruce Moth',
    scientific: 'Choristoneura occidentalis',
    regions: ['Rockies', 'Pacific NW'],
    states: ['MT', 'ID'],
    rivers: ['Madison River', 'Yellowstone River', 'Big Hole River', 'Bitterroot', 'Rock Creek'],
    startMonth: 7,
    endMonth: 9,
    waterTempMinF: 55,
    waterTempMaxF: 70,
    timeOfDay: 'morning',
    stages: ['adult'],
    flies: [
      'Size 10-12 elk-hair spruce moth (tan)',
      'Size 12 CDC spruce moth',
      'Size 10 stimulator (tan)',
    ],
    searchTerm: 'spruce moth Choristoneura occidentalis',
    wikipediaSlug: 'Choristoneura_occidentalis',
    notes: 'Late summer terrestrial — adults blown into the water from spruce/fir stands. Fish key on them HARD on the Madison + upper Yellowstone. Morning is best; calm water.',
  },
  {
    id: 'pale-evening-dun',
    name: 'Pale Evening Dun (PED)',
    scientific: 'Ephemerella inermis',
    regions: ['Rockies', 'Pacific NW'],
    states: ['MT', 'ID', 'UT', 'CO'],
    rivers: ['Henrys Fork', 'Bighorn River', 'Madison River', 'Green River'],
    startMonth: 6,
    endMonth: 8,
    waterTempMinF: 56,
    waterTempMaxF: 66,
    timeOfDay: 'evening',
    stages: ['dun', 'spinner', 'emerger'],
    flies: [
      'Size 16-18 PED parachute (pale yellow)',
      'Size 18 PED CDC emerger',
      'Size 18 PED rusty spinner',
      'Size 16 PED cripple',
      'Size 16 pheasant-tail nymph',
    ],
    searchTerm: 'pale evening dun Ephemerella inermis PED',
    wikipediaSlug: 'Ephemerellidae',
    notes: 'Evening cousin of the PMD — pale yellow body, smaller. Henrys Fork + Bighorn evening fishing through summer. Trout get picky as light fades — go small.',
  },
  {
    id: 'flav',
    name: 'Flav (Small Western Green Drake)',
    scientific: 'Drunella flavilinea',
    regions: ['Rockies', 'Pacific NW'],
    states: ['MT', 'ID', 'UT', 'CO'],
    rivers: ['Madison River', 'Henrys Fork', 'Yellowstone River', 'Frying Pan River'],
    startMonth: 7,
    endMonth: 8,
    waterTempMinF: 56,
    waterTempMaxF: 65,
    timeOfDay: 'afternoon',
    stages: ['dun', 'spinner', 'emerger'],
    flies: [
      'Size 14 Flav parachute (olive)',
      'Size 14 Flav cripple',
      'Size 14 olive Compara-dun',
      'Size 14 PT nymph (dark olive)',
    ],
    searchTerm: 'flav Drunella flavilinea mayfly',
    wikipediaSlug: 'Drunella',
    notes: 'Smaller follow-up to the Western Green Drake. July-August afternoons. Olive body, mottled wings — important on the Madison + Henrys Fork.',
  },
  {
    id: 'pink-albert',
    name: 'Pink Albert',
    scientific: 'Epeorus albertae',
    regions: ['Rockies', 'Pacific NW'],
    states: ['ID', 'MT'],
    rivers: ['Henrys Fork', 'South Fork Snake', 'Silver Creek'],
    startMonth: 7,
    endMonth: 8,
    waterTempMinF: 56,
    waterTempMaxF: 66,
    timeOfDay: 'evening',
    stages: ['dun', 'spinner'],
    flies: [
      'Size 16 Pink Albert parachute',
      'Size 16 Pink Albert cripple',
      'Size 16 pink rusty spinner',
    ],
    searchTerm: 'pink albert Epeorus albertae mayfly',
    wikipediaSlug: 'Epeorus',
    notes: 'Henrys Fork specialty — pinkish body, evening rise on flat water. The picky-fish hatch. 7X tippet, drag-free or nothing.',
  },
  {
    id: 'hydropsyche-caddis',
    name: 'Hydropsyche / Spotted Sedge',
    scientific: 'Hydropsyche spp.',
    regions: ['everywhere'],
    states: ['MT', 'ID', 'UT', 'CO', 'MI', 'TN', 'NC', 'GA', 'PA', 'KY', 'AR'],
    rivers: [],
    startMonth: 6,
    endMonth: 9,
    waterTempMinF: 55,
    waterTempMaxF: 68,
    timeOfDay: 'evening',
    stages: ['adult', 'pupa', 'larva'],
    flies: [
      'Size 14-16 Elk-hair caddis (tan / cinnamon)',
      'Size 14 LaFontaine emergent sparkle pupa',
      'Size 14 X-caddis (tan)',
      'Size 14 caddis larva (green or olive)',
      'Size 14 Czech-style caddis nymph',
      'Size 14 soft-hackle (hare\'s ear)',
    ],
    searchTerm: 'hydropsyche spotted sedge caddis',
    wikipediaSlug: 'Hydropsyche',
    notes: 'Most-common summer caddis across both Western + Eastern tailwaters. Larva (green rock-worm) is a year-round nymph go-to. Adults fall hard in evening.',
  },
  {
    id: 'little-yellow-stone',
    name: 'Little Yellow Stone (Western)',
    scientific: 'Isoperla / Suwallia spp.',
    regions: ['Rockies', 'Pacific NW'],
    states: ['MT', 'ID', 'UT', 'CO'],
    rivers: ['Madison River', 'Yellowstone River', 'Henrys Fork', 'Big Hole River'],
    startMonth: 6,
    endMonth: 8,
    waterTempMinF: 56,
    waterTempMaxF: 70,
    timeOfDay: 'afternoon',
    stages: ['adult', 'nymph'],
    flies: [
      'Size 14-16 Yellow Stimulator',
      'Size 14 Little yellow chubby',
      'Size 16 yellow Sally',
      'Size 16 yellow stone nymph',
    ],
    searchTerm: 'little yellow stone Isoperla stonefly',
    wikipediaSlug: 'Isoperla',
    notes: 'Western counterpart to Yellow Sally. Summer afternoon hatch — fish all day on most Western freestone. Often blanket-hatch on the Madison.',
  },

  // ===== Tailwater / always-on food forms =====================================
  {
    id: 'mysis-shrimp',
    name: 'Mysis Shrimp (tailwater staple)',
    scientific: 'Mysis diluviana',
    regions: ['Rockies'],
    states: ['CO', 'UT', 'MT', 'WY'],
    rivers: ['Frying Pan River', 'Bighorn River', 'Green River', 'Blue River (CO)'],
    startMonth: 1,
    endMonth: 12,
    waterTempMinF: 35,
    waterTempMaxF: 65,
    timeOfDay: 'all day',
    stages: ['always-on'],
    flies: [
      'Size 16-20 Mysis shrimp (clear/white)',
      'Size 18 Mysis (epoxy back)',
      'Size 16 white scud (Mysis impression)',
    ],
    searchTerm: 'mysis shrimp fly pattern tailwater',
    wikipediaSlug: 'Mysis',
    notes: 'Trophy-fish food on the Frying Pan (Toilet Bowl), Bighorn, and Green. Drift through the dam outflow — that\'s where the protein is. Mysis are 0.5-1 in long, translucent white.',
  },
  {
    id: 'scud',
    name: 'Scud (tailwater staple)',
    scientific: 'Amphipoda (Gammarus / Hyalella)',
    regions: ['everywhere'],
    states: ['CO', 'UT', 'MT', 'TN', 'AR', 'GA', 'NC', 'KY', 'PA'],
    rivers: ['Bighorn River', 'Green River', 'White River', 'South Holston', 'Caney Fork', 'Norfork Tailwater'],
    startMonth: 1,
    endMonth: 12,
    waterTempMinF: 35,
    waterTempMaxF: 70,
    timeOfDay: 'all day',
    stages: ['always-on'],
    flies: [
      'Size 14-18 grey scud',
      'Size 14-16 orange scud (post-mortem color)',
      'Size 16 olive scud',
      'Size 14 pink scud (UV variant)',
      'Size 16 sowbug (cress bug)',
    ],
    searchTerm: 'scud fly pattern Gammarus tailwater',
    wikipediaSlug: 'Amphipoda',
    notes: 'Year-round protein staple on tailwaters. Dead-drift on the bottom — split-shot, indicator. Pink scuds work where rainbows have seen everything.',
  },
  {
    id: 'sowbug',
    name: 'Sowbug / Cress Bug',
    scientific: 'Isopoda (Asellus / Lirceus)',
    regions: ['everywhere'],
    states: ['AR', 'TN', 'KY', 'PA', 'NC', 'GA', 'CO', 'UT', 'MT'],
    rivers: ['White River', 'Norfork Tailwater', 'Caney Fork', 'South Holston', 'Yellow Breeches'],
    startMonth: 1,
    endMonth: 12,
    waterTempMinF: 35,
    waterTempMaxF: 70,
    timeOfDay: 'all day',
    stages: ['always-on'],
    flies: [
      'Size 14-16 grey sowbug (flat back)',
      'Size 16 cress bug (olive-grey)',
      'Size 14 ribbed sowbug (UV)',
    ],
    searchTerm: 'sowbug cress bug fly pattern tailwater',
    wikipediaSlug: 'Asellidae',
    notes: 'Year-round tailwater protein, especially Arkansas + Pennsylvania limestone. Sister-fly to scud but flatter, drabber. Bounce them along bottom seams.',
  },
  {
    id: 'san-juan-worm',
    name: 'San Juan Worm (universal nymph)',
    scientific: 'Lumbricidae (aquatic worms)',
    regions: ['everywhere'],
    states: ['TN', 'MI', 'NC', 'GA', 'AL', 'KY', 'PA', 'AR', 'MT', 'ID', 'CO', 'UT', 'IN', 'IL'],
    rivers: [],
    startMonth: 1,
    endMonth: 12,
    waterTempMinF: 35,
    waterTempMaxF: 75,
    timeOfDay: 'all day',
    stages: ['always-on'],
    flies: [
      'Size 12-14 red San Juan worm (chenille)',
      'Size 12 pink squirmy worm',
      'Size 12 wine / brown SJW',
      'Size 12 tan squirmy (subtle)',
    ],
    searchTerm: 'san juan worm squirmy worm fly pattern',
    wikipediaSlug: null,
    notes: 'Cheating? Maybe. Catches fish? Always. Fish it on a tight-line under an indicator anywhere worms wash in — spring runoff, post-rain, tailwaters.',
  },

  // ===== Run-specific Great Lakes patterns ====================================
  {
    id: 'mi-king-salmon-eggs',
    name: 'King Salmon Eggs (MI fall run)',
    scientific: 'Egg / spawn pattern',
    regions: ['Upper Midwest', 'Great Lakes'],
    states: ['MI'],
    rivers: ['Big Manistee', 'Pere Marquette', 'Muskegon', 'Betsie River', 'Boardman River', 'St. Joseph River'],
    startMonth: 9,
    endMonth: 10,
    waterTempMinF: 45,
    waterTempMaxF: 60,
    timeOfDay: 'all day',
    stages: ['run-pattern'],
    flies: [
      'Size 8-10 chartreuse Estaz egg (king)',
      'Size 8 orange / pink egg cluster (skein imitation)',
      'Size 10 single egg (peach, oregon-cheese)',
      'Size 6-8 articulated streamer (white / chartreuse)',
      'Size 6 sucker spawn',
    ],
    searchTerm: 'king salmon eggs spawn fly Michigan',
    wikipediaSlug: null,
    notes: 'September-October kings stack below dams (Tippy, Berrien Springs). Dead-drift egg patterns + flesh flies behind the redds. Steelhead + browns follow the eggs.',
  },
  {
    id: 'mi-steelhead-eggs',
    name: 'Steelhead Eggs + Beads (MI winter / spring run)',
    scientific: 'Egg / bead pattern',
    regions: ['Upper Midwest', 'Great Lakes'],
    states: ['MI', 'IN'],
    rivers: ['Big Manistee', 'Pere Marquette', 'Muskegon', 'Betsie River', 'Boardman River', 'Trail Creek', 'St. Joseph River'],
    startMonth: 10,
    endMonth: 5,
    waterTempMinF: 35,
    waterTempMaxF: 50,
    timeOfDay: 'all day',
    stages: ['run-pattern'],
    flies: [
      'Size 8-10 single egg (oregon cheese, salmon roe, peach)',
      '6-8mm beads (peach, oregon-cheese, mottled chartreuse)',
      'Size 6 sucker spawn (white / cream)',
      'Size 8 nuke egg (Estaz, multi-color)',
      'Size 8 stonefly nymph (black or brown)',
      'Size 6-8 articulated swung pattern',
    ],
    searchTerm: 'steelhead eggs beads fly Great Lakes',
    wikipediaSlug: null,
    notes: 'Fall steelhead chase king eggs Oct-Nov; winter holdovers continue through April. Beads on bead-pegs above a bare hook is the modern center-pin / fly-rod standard.',
  },
  {
    id: 'mi-articulated-streamers',
    name: 'Articulated Streamers (MI trophy browns)',
    scientific: 'Streamer / baitfish imitation',
    regions: ['Upper Midwest'],
    states: ['MI', 'PA'],
    rivers: ['Big Manistee', 'Upper Manistee', 'Au Sable', 'Pere Marquette', 'Muskegon'],
    startMonth: 9,
    endMonth: 12,
    waterTempMinF: 38,
    waterTempMaxF: 58,
    timeOfDay: 'all day',
    stages: ['streamer'],
    flies: [
      'Size 2-4 Sex Dungeon (olive / black / yellow)',
      'Size 2 Dirty Hippie (white / chartreuse)',
      'Size 4 Galloup\'s Boogeyman',
      'Size 4 Drunk & Disorderly',
      'Size 2-4 mini-Drunk (smaller fall pattern)',
      'Size 4 Circus Peanut',
    ],
    searchTerm: 'articulated streamer fly brown trout Michigan',
    wikipediaSlug: null,
    notes: 'Fall pre-spawn brown-trout play. Heavy sink-tip, swing through holes. Lower light + falling temps + recent rain = streamer prime time. Strip-pause-strip.',
  },
];

// ----- runner ----------------------------------------------------------------

const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const byId = new Map(data.map((h) => [h.id, h]));

// 1. Pad existing entries' fly arrays.
let padded = 0;
for (const [id, extras] of Object.entries(FLY_ADDITIONS)) {
  const entry = byId.get(id);
  if (!entry) continue;
  const existing = new Set(entry.flies.map((f) => f.toLowerCase()));
  let added = 0;
  for (const f of extras) {
    if (!existing.has(f.toLowerCase())) {
      entry.flies.push(f);
      added++;
    }
  }
  if (added > 0) {
    console.log(`  padded ${id}: +${added} flies (now ${entry.flies.length})`);
    padded++;
  }
}

// 2. Append new entries.
let appended = 0;
for (const e of NEW_ENTRIES) {
  if (byId.has(e.id)) {
    console.log(`  skip ${e.id} (already present)`);
    continue;
  }
  data.push(e);
  byId.set(e.id, e);
  appended++;
  console.log(`  + ${e.id} (${e.states.join(', ')})`);
}

console.log(`\nPadded ${padded} existing entries, appended ${appended} new entries.`);
console.log(`Total hatches: ${data.length}`);

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log(`Wrote ${FILE}`);
