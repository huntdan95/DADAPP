/**
 * Michigan Waters Guide — Volume 1: UP rivers + Lake Superior +
 * UP inland lakes.
 *
 * Follows the same Waterbody schema as `data/waterbodies.json`.
 * Idempotent merge — only adds entries whose `id` isn't already
 * present.
 *
 * Run: node scripts/add-mi-waters-vol1.cjs
 */

const fs = require('node:fs');
const path = require('node:path');

const FILE = path.join(__dirname, '..', 'data', 'waterbodies.json');

const NEW_ENTRIES = [
  // ============================================================
  // LAKE SUPERIOR — Michigan waters
  // ============================================================
  {
    id: 'mi-lake-superior-marquette',
    name: 'Lake Superior (Marquette / Munising)',
    state: 'MI',
    region: 'Lake Superior + UP coast',
    type: 'great-lake',
    county: 'Marquette / Alger',
    acres: 20300000,
    maxDepthFt: 1333,
    lat: 46.55,
    lng: -87.4,
    signatureSpecies: 'Lake trout, coho salmon, splake, coaster brook trout',
    species: [
      { name: 'Lake trout', importance: 'signature', size: '8-25 lb avg, 30+ lb possible', notes: 'Lake Superior is the lake-trout capital of the Great Lakes. Healthy, self-sustaining populations.' },
      { name: 'Coho salmon', importance: 'strong', size: '4-8 lb', notes: 'Stocked + naturalized. Spring near-shore, summer offshore.' },
      { name: 'Chinook salmon', importance: 'good', size: '8-20 lb', notes: 'Less abundant than Lake Michigan; fall staging at trib mouths.' },
      { name: 'Splake (lake×brook hybrid)', importance: 'strong', size: '3-8 lb', notes: 'Stocked specifically for shore + harbor anglers — Superior is the splake capital.' },
      { name: 'Coaster brook trout', importance: 'good', size: '2-5 lb, occasional 6+', notes: 'A genuinely unique Lake Superior strain — large brookies that use the lake. Conservation regs.' },
      { name: 'Steelhead', importance: 'good', size: '5-12 lb', notes: 'Trib runs spring + fall.' },
      { name: 'Lake whitefish', importance: 'good', size: '2-4 lb', notes: 'Commercially-important, anglers ice-fish for them.' },
      { name: 'Smallmouth bass', importance: 'good', size: '2-4 lb', notes: 'Rocky shoreline summer.' },
    ],
    patterns: [
      {
        title: 'Lake trout summer trolling',
        target: 'Lake trout',
        when: 'June-September',
        technique: 'Downrigger or wire-line trolling with spoons (Sutton 44, NK28) + dodger-and-flies; jigging tubes + Swedish Pimples over reefs',
        where: '60-180 ft of water; structure-oriented reefs like Stannard Rock, Granite Island, Big Reef',
        details: 'Most-targeted Superior fish. Stannard Rock (south of Keweenaw) is a destination reef — anglers boat from Marquette + Big Bay. Trolling speed 1.8-2.4 mph. Match the local smelt and cisco forage.',
      },
      {
        title: 'Spring shoreline coho + splake',
        target: 'Coho salmon, splake',
        when: 'April-June',
        technique: 'Casting Little Cleos + Krocodile spoons (1/2-3/4 oz) + Husky Jerks from shore; trolling within 1/4 mi of shore for splake',
        where: 'Harbor breakwaters (Marquette, Munising, Big Bay), pier mouths, river-mouth current seams',
        details: 'Stained run-off concentrates fish along the south shore. Splake key off harbor structure — Munising Bay + Marquette\'s lower harbor are reliable.',
      },
      {
        title: 'Fall salmon at trib mouths',
        target: 'Chinook + coho salmon',
        when: 'September-October',
        technique: 'Casting spoons + spinners + Cleos from piers; bobbers with skein at river mouths',
        where: 'Carp River (Marquette), Anna River (Munising), Two Hearted, Big Garlic mouths',
        details: 'Less concentrated than Lake Michigan tribs but quality. Skamania-strain steelhead also begin staging.',
      },
      {
        title: 'Coaster brook trout shoreline',
        target: 'Coaster brook trout',
        when: 'May-October',
        technique: 'Small streamers swung from shore; light-tackle spinners (size 1-2 Mepps); fly: black-nose dace, sculpins',
        where: 'Rocky points off the Keweenaw + Pictured Rocks shoreline; near-shore boulder fields',
        details: 'Coasters are a once-in-a-decade fish for most anglers. Keep them wet — these are the genuine native Lake Superior strain. Salazar Strict regs apply.',
      },
      {
        title: 'Whitefish ice-fishing',
        target: 'Lake whitefish',
        when: 'January-March',
        technique: 'Small jigging spoons + waxworms or mousie grubs; tip-downs with single egg',
        where: 'Big Bay de Noc + offshore over reefs in 40-80 ft',
        details: 'Whitefish are wary and finicky — small jigs in chartreuse + green. Big Bay (north end of Bay de Noc) is the heart of the UP whitefish fishery.',
      },
    ],
    access: ['Marquette Lower Harbor', 'Marquette Upper Harbor', 'Big Bay Harbor', 'Munising Bay launch', 'Pictured Rocks shoreline', 'Whitefish Point'],
    managementProgram: ['MI DNR lake-trout management', 'Splake stocking program (USFWS + MDNR)', 'Coaster brook trout conservation regs'],
    notes: 'The world\'s largest freshwater lake by surface area sits on Michigan\'s northern coast. Stannard Rock, Granite Island, and Big Reef are pilgrimage-class lake-trout destinations. Cold + clear + deep — fishery feels like saltwater.',
  },
  {
    id: 'mi-lake-superior-keweenaw',
    name: 'Lake Superior (Keweenaw Bay + Bays)',
    state: 'MI',
    region: 'Lake Superior + UP coast',
    type: 'great-lake',
    county: 'Baraga / Houghton',
    lat: 47.0,
    lng: -88.45,
    signatureSpecies: 'Lake trout, smelt, splake',
    species: [
      { name: 'Lake trout', importance: 'signature', size: '5-20 lb' },
      { name: 'Splake', importance: 'strong', size: '3-8 lb' },
      { name: 'Coho salmon', importance: 'good', size: '4-8 lb' },
      { name: 'Steelhead', importance: 'good', size: '6-10 lb' },
      { name: 'Smelt', importance: 'good', notes: 'Spring dipping run April-May in tribs.' },
      { name: 'Lake whitefish', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Keweenaw Bay laker trolling',
        target: 'Lake trout',
        when: 'June-October',
        technique: 'Wire-line + downriggers; spoons + cowbell-and-fly rigs',
        where: 'Off Houghton + L\'Anse; 80-200 ft over structure',
        details: 'Keweenaw Bay is one of the most reliable laker boxes in the Great Lakes. Charter scene is robust.',
      },
      {
        title: 'Spring smelt dipping',
        target: 'Smelt',
        when: 'April-May, night',
        technique: 'Long-handled smelt nets in tributary streams during the spawn run',
        where: 'Sturgeon River, Otter River, Silver River, smaller Keweenaw tribs',
        details: 'A UP cultural tradition. Run lasts ~2 weeks; fish move at night.',
      },
    ],
    access: ['Houghton', 'L\'Anse', 'Baraga', 'Eagle Harbor', 'Copper Harbor'],
    notes: 'The Keweenaw Peninsula extends 70 mi into Superior. Eagle Harbor + Copper Harbor are the iconic far-north access points.',
  },

  // ============================================================
  // UP RIVERS — Lake Superior + Michigan tribs
  // ============================================================
  {
    id: 'mi-river-two-hearted',
    name: 'Big Two Hearted River',
    state: 'MI',
    region: 'UP rivers — Lake Superior tribs',
    type: 'great-lake-trib',
    county: 'Luce',
    river: 'Big Two Hearted River',
    lat: 46.71,
    lng: -85.66,
    signatureSpecies: 'Brook trout, steelhead, coho salmon',
    species: [
      { name: 'Brook trout', importance: 'signature', size: '7-12 in, occasional 16+', notes: 'The Hemingway river. Wild brookies up the whole system.' },
      { name: 'Steelhead', importance: 'strong', size: '6-10 lb', notes: 'Spring + fall runs from Lake Superior.' },
      { name: 'Coho salmon', importance: 'good', size: '4-8 lb', notes: 'Fall run.' },
      { name: 'Northern pike', importance: 'good', size: '5-12 lb', notes: 'Lower river sloughs.' },
    ],
    patterns: [
      {
        title: 'Wild brookie wading',
        target: 'Brook trout',
        when: 'May-September',
        technique: 'Small dries (Adams, Royal Wulff, Madsen\'s Skunk #14-16); small streamers (Mickey Finn, Wooly Bugger size 8-10)',
        where: 'Below shaded pools, log jams, undercut banks — wade or canoe',
        details: 'The Two Hearted is the quintessential UP brookie river. Hemingway wrote "Big Two-Hearted River" about a sister stream (actually the Fox), but the name made this one famous. Pristine, lightly pressured outside July.',
      },
      {
        title: 'Spring + fall steelhead',
        target: 'Steelhead',
        when: 'April-May + October-November',
        technique: 'Egg patterns, yarn flies, small streamers under indicators; spawn sacs',
        where: 'Deep pools below riffles; the lower river to the mouth',
        details: 'Less crowded than Lake Michigan tribs. Skamania-strain + winter strain.',
      },
    ],
    access: ['Reed and Green Bridge', 'High Bridge', 'Mouth (Lake Superior)', 'Two Hearted River campground'],
    regulations: 'Designated Blue Ribbon trout stream. Bait restrictions in upper stretches.',
    notes: 'Lightly pressured. Wilderness character — most access requires gravel-road driving. Wade-and-camp culture.',
  },
  {
    id: 'mi-river-fox',
    name: 'Fox River (UP)',
    state: 'MI',
    region: 'UP rivers — Lake Superior tribs',
    type: 'river',
    county: 'Schoolcraft',
    river: 'Fox River',
    signatureSpecies: 'Brook trout',
    species: [
      { name: 'Brook trout', importance: 'signature', size: '7-12 in', notes: 'Hemingway\'s actual "Big Two-Hearted River" — he changed the name in the story.' },
      { name: 'Brown trout', importance: 'good', size: '10-16 in' },
      { name: 'Northern pike', importance: 'good', size: 'Lower river' },
    ],
    patterns: [
      {
        title: 'Hemingway-style brookie wading',
        target: 'Brook trout',
        when: 'May-September',
        technique: 'Small dries (#14-18 Adams, Royal Wulff); brookie streamers',
        where: 'Below the Seney Wildlife Refuge boundary; pocket water + small pools',
        details: 'Quiet wading classic. Seney WR controls headwaters access.',
      },
    ],
    access: ['Seney area county-road bridges', 'Fox River pathway'],
    notes: 'The actual river behind Hemingway\'s "Big Two-Hearted River." Pristine UP brookie water.',
  },
  {
    id: 'mi-river-tahquamenon',
    name: 'Tahquamenon River',
    state: 'MI',
    region: 'UP rivers — Lake Superior tribs',
    type: 'river',
    county: 'Luce / Chippewa',
    river: 'Tahquamenon River',
    lat: 46.58,
    lng: -85.25,
    signatureSpecies: 'Muskellunge, walleye, northern pike, smallmouth bass',
    species: [
      { name: 'Muskellunge', importance: 'signature', size: '36-50 in', notes: 'Genuine UP musky river — tannin-dark water + slow current.' },
      { name: 'Northern pike', importance: 'strong', size: '5-15 lb' },
      { name: 'Walleye', importance: 'strong', size: '14-22 in' },
      { name: 'Smallmouth bass', importance: 'strong', size: '1-3 lb' },
      { name: 'Brook trout', importance: 'good', size: 'Upper river above the falls' },
    ],
    patterns: [
      {
        title: 'Tannin-water musky',
        target: 'Muskellunge',
        when: 'May-November',
        technique: 'Big bucktails, gliders, large rubber (Bull Dawg); slow retrieves in dark water',
        where: 'Lower river below the Upper + Lower Falls; deep pools + downed timber',
        details: 'Tea-stained tannin water from the cedar swamp headwaters. Visibility is short — fish key on vibration. Black + chartreuse colors dominate.',
      },
      {
        title: 'Lower-river walleye + pike',
        target: 'Walleye + northern pike',
        when: 'April-November',
        technique: 'Jig + minnow at 1/8-1/4 oz; large in-line spinners',
        where: 'Below Lower Falls to mouth at Whitefish Bay; deep tannin pools',
      },
    ],
    access: ['Tahquamenon Falls State Park', 'Lower Tahquamenon River boat launch', 'Mouth at Whitefish Bay'],
    notes: 'Famous for the falls but also genuinely good musky water. The tannin-stained water from cedar headwaters is a Hoosier rarity — fish hold differently in dark water.',
  },
  {
    id: 'mi-river-sturgeon-up',
    name: 'Sturgeon River (UP)',
    state: 'MI',
    region: 'UP rivers — Lake Superior tribs',
    type: 'great-lake-trib',
    county: 'Baraga / Houghton',
    river: 'Sturgeon River',
    signatureSpecies: 'Brook trout, steelhead, smelt',
    species: [
      { name: 'Brook trout', importance: 'signature', size: '7-14 in' },
      { name: 'Brown trout', importance: 'strong', size: '10-18 in' },
      { name: 'Steelhead', importance: 'strong', size: '6-10 lb', notes: 'Spring + fall runs.' },
      { name: 'Smelt', importance: 'good', notes: 'Spring spawn run from Keweenaw Bay.' },
    ],
    patterns: [
      {
        title: 'Brookie + brown summer pocket water',
        target: 'Brook + brown trout',
        when: 'May-September',
        technique: 'Small dries + hopper-dropper; small streamers (Wooly Bugger, sculpin patterns)',
        where: 'Pocket water above the lower river; rocky riffles',
      },
      {
        title: 'Spring smelt-dipping run',
        target: 'Smelt',
        when: 'April-May, night',
        technique: 'Long-handled smelt nets',
        where: 'Lower river up from the mouth',
        details: 'UP cultural tradition. Smelt run dense — fill 5-gallon buckets.',
      },
    ],
    access: ['Sturgeon River Gorge Wilderness', 'Lower river ramp', 'Multiple FS road accesses'],
    notes: 'Sturgeon Gorge wilderness in the upper river is a dramatic high-walled canyon. Confusingly named — there are multiple "Sturgeon Rivers" in MI.',
  },
  {
    id: 'mi-river-manistique',
    name: 'Manistique River',
    state: 'MI',
    region: 'UP rivers — Lake Michigan tribs',
    type: 'great-lake-trib',
    county: 'Schoolcraft',
    river: 'Manistique River',
    lat: 45.96,
    lng: -86.25,
    signatureSpecies: 'Muskellunge, walleye, smallmouth bass, brown trout',
    species: [
      { name: 'Muskellunge', importance: 'signature', size: '36-50 in', notes: 'Naturalized population — one of the best wild musky rivers in MI.' },
      { name: 'Walleye', importance: 'strong', size: '14-22 in' },
      { name: 'Northern pike', importance: 'strong', size: '5-15 lb' },
      { name: 'Smallmouth bass', importance: 'strong', size: '1-3 lb' },
      { name: 'Brown trout', importance: 'good', size: '12-18 in', notes: 'Upper river + tributaries.' },
      { name: 'Coho salmon', importance: 'good', size: '4-8 lb', notes: 'Fall run up from Lake Michigan.' },
    ],
    patterns: [
      {
        title: 'Wild-musky river fishing',
        target: 'Muskellunge',
        when: 'May-November',
        technique: 'Bucktails + glides; large rubber over downed timber',
        where: 'Below Manistique Falls; deep slow stretches with timber',
        details: 'The Manistique gives up legitimate trophy musky to the patient angler. Less pressured than the LP musky scene.',
      },
      {
        title: 'Float-trip smallmouth',
        target: 'Smallmouth bass',
        when: 'May-October',
        technique: 'Tubes, Ned rigs, in-line spinners',
        where: 'Below Indian Lake; gravel + rock structure',
      },
    ],
    access: ['Manistique Lake outlet', 'Highway 94 bridges', 'Mouth at Lake Michigan (Manistique)'],
    notes: 'Drains the largest watershed in the UP. Holds wild musky + walleye + bass — the rare "everything" river.',
  },

  // ============================================================
  // UP INLAND LAKES
  // ============================================================
  {
    id: 'mi-lake-gogebic',
    name: 'Lake Gogebic',
    state: 'MI',
    region: 'UP inland lakes',
    type: 'natural-lake',
    county: 'Gogebic / Ontonagon',
    acres: 13380,
    maxDepthFt: 35,
    lat: 46.50,
    lng: -89.55,
    signatureSpecies: 'Walleye, smallmouth bass, perch, northern pike',
    species: [
      { name: 'Walleye', importance: 'signature', size: '14-22 in, 8+ lb possible', notes: 'Largest natural lake in the UP. Strong wild walleye fishery.' },
      { name: 'Northern pike', importance: 'strong', size: '5-20 lb', notes: 'Trophy class in cabbage flats.' },
      { name: 'Smallmouth bass', importance: 'strong', size: '2-4 lb' },
      { name: 'Yellow perch', importance: 'strong', size: '8-12 in, jumbo possible' },
      { name: 'Largemouth bass', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Summer walleye on cabbage edges',
        target: 'Walleye',
        when: 'May-October',
        technique: 'Crawler harnesses + bottom bouncers; jig + leech 1/8 oz; trolling Reef Runners at dusk',
        where: 'Cabbage edges 12-18 ft; classic UP weedline pattern',
        details: 'Gogebic walleye orient to cabbage all summer. Evening + night dominate. Heavy lake — eats lures.',
      },
      {
        title: 'Big-pike weedline',
        target: 'Northern pike',
        when: 'May-November',
        technique: 'Large in-line spinners; jerkbaits; suckers for trophy class',
        where: 'Outside cabbage edges; transitions to deeper water',
      },
      {
        title: 'Winter perch + walleye',
        target: 'Yellow perch + walleye',
        when: 'January-March',
        technique: 'Jigging spoons + waxworms; tip-downs with minnows',
        where: 'Mid-lake basin; main-lake humps',
        details: 'UP ice culture is real — Gogebic gets dotted with shanties.',
      },
    ],
    access: ['Bergland Public Access', 'Marenisco', 'Lake Gogebic State Park'],
    notes: 'The UP\'s largest natural lake — 14 miles long. Stretches across the IronwoodMichigan and Wisconsin border (actually entirely in MI but very close to WI).',
  },
  {
    id: 'mi-indian-lake',
    name: 'Indian Lake (Schoolcraft)',
    state: 'MI',
    region: 'UP inland lakes',
    type: 'natural-lake',
    county: 'Schoolcraft',
    acres: 8400,
    maxDepthFt: 25,
    lat: 45.97,
    lng: -86.32,
    signatureSpecies: 'Walleye, perch, smallmouth bass, muskie',
    species: [
      { name: 'Walleye', importance: 'signature', size: '14-22 in' },
      { name: 'Muskellunge', importance: 'strong', size: '36-44 in', notes: 'Connected to Manistique River musky system.' },
      { name: 'Yellow perch', importance: 'strong', size: '8-12 in' },
      { name: 'Northern pike', importance: 'strong' },
      { name: 'Smallmouth bass', importance: 'strong' },
      { name: 'Largemouth bass', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Crawler harness walleye',
        target: 'Walleye',
        when: 'May-October',
        technique: 'Bottom bouncers + crawler harnesses',
        where: 'Mid-lake flats 8-14 ft',
      },
    ],
    access: ['Indian Lake State Park', 'Multiple public ramps'],
    notes: 'Fourth-largest inland lake in MI (and largest in the UP after Gogebic). Feeds the Manistique River — fish move between systems.',
  },
  {
    id: 'mi-big-bay-de-noc',
    name: 'Big Bay de Noc (Lake Michigan)',
    state: 'MI',
    region: 'Lake Superior + UP coast',
    type: 'great-lake',
    county: 'Delta',
    lat: 45.83,
    lng: -86.83,
    signatureSpecies: 'Walleye, perch, smallmouth bass, whitefish',
    species: [
      { name: 'Walleye', importance: 'signature', size: '14-22 in', notes: 'Big Bay de Noc is the most reliable walleye box on northern Lake Michigan.' },
      { name: 'Smallmouth bass', importance: 'signature', size: '2-5 lb', notes: 'Trophy-class smallmouth — Big Bay was a longstanding bass-tournament destination.' },
      { name: 'Yellow perch', importance: 'strong', size: '8-12 in' },
      { name: 'Lake whitefish', importance: 'strong', notes: 'Ice fishery north end.' },
      { name: 'Northern pike', importance: 'strong' },
    ],
    patterns: [
      {
        title: 'Smallmouth on rocky points + reefs',
        target: 'Smallmouth bass',
        when: 'June-October',
        technique: 'Drop-shot 4-in finesse worm; Ned rigs; tubes; jerkbaits',
        where: 'Rocky reefs + points + drop-offs 12-25 ft',
        details: 'Big Bay\'s clear water + abundant reefs = trophy smallmouth habitat. Fish often suspend over deeper structure feeding on alewives.',
      },
      {
        title: 'Walleye trolling main-lake structure',
        target: 'Walleye',
        when: 'May-October',
        technique: 'Crawler harnesses on lead-core; Reef Runners + Husky Jerks',
        where: 'Main-bay flats 15-25 ft',
      },
      {
        title: 'Whitefish ice fishing',
        target: 'Lake whitefish',
        when: 'January-March',
        technique: 'Small jigging spoons + waxworms or mousie grubs',
        where: 'North end (Garden Peninsula side) in 40-80 ft',
      },
    ],
    access: ['Garden', 'Fairport', 'Escanaba', 'Gladstone'],
    notes: 'Half of the famed Bays de Noc system. Connected to Little Bay de Noc to the south. Walleye + smallmouth power-water.',
  },
  {
    id: 'mi-little-bay-de-noc',
    name: 'Little Bay de Noc (Lake Michigan)',
    state: 'MI',
    region: 'Lake Superior + UP coast',
    type: 'great-lake',
    county: 'Delta',
    lat: 45.75,
    lng: -87.07,
    signatureSpecies: 'Walleye, smallmouth bass, perch',
    species: [
      { name: 'Walleye', importance: 'signature', size: '14-25 in, 10+ lb possible', notes: 'World-class walleye — Little Bay de Noc gives up double-digit fish every year.' },
      { name: 'Smallmouth bass', importance: 'signature', size: '2-5 lb' },
      { name: 'Yellow perch', importance: 'strong', size: '8-12 in' },
      { name: 'Northern pike', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Trophy walleye trolling',
        target: 'Walleye',
        when: 'April-October',
        technique: 'Crawler harnesses on bottom bouncers; trolling Reef Runners + Husky Jerks; jig + minnow on shallow flats spring/fall',
        where: 'Channel edges; the Ford River mouth; main basin 12-30 ft',
        details: 'Spring walleye stage in the Ford River mouth area. Summer fish suspend on the main basin. Big fish (8-12 lb) are caught here regularly.',
      },
      {
        title: 'Smallmouth on river-mouth structure',
        target: 'Smallmouth bass',
        when: 'June-September',
        technique: 'Tubes, drop-shot, Ned',
        where: 'Rocky points off Escanaba + Gladstone',
      },
    ],
    access: ['Escanaba Marina', 'Gladstone Marina', 'Ford River mouth'],
    notes: 'Smaller, more enclosed than Big Bay. Considered one of the best Lake Michigan walleye fisheries in the entire Great Lakes basin.',
  },
];

// ---- Runner ---------------------------------------------------------------

const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const byId = new Map(data.map((w) => [w.id, w]));

let appended = 0;
for (const e of NEW_ENTRIES) {
  if (byId.has(e.id)) {
    console.log(`  exists ${e.id} (no overwrite)`);
    continue;
  }
  data.push(e);
  byId.set(e.id, e);
  console.log(`  + ${e.id} (${e.state} · ${e.species.length} species · ${e.patterns.length} patterns)`);
  appended++;
}

console.log(`\nAppended ${appended} new entries.`);
console.log(`Total waterbodies: ${data.length}`);

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n', 'utf8');
