/**
 * Michigan Waters Vol 7 — additional UP rivers + lakes.
 * Western UP (Porkies, Ontonagon, Brule), additional Lake Superior
 * tribs, central UP lakes (Michigamme, Manistique chain, Bond Falls).
 */
const fs = require('node:fs');
const path = require('node:path');
const FILE = path.join(__dirname, '..', 'data', 'waterbodies.json');

const NEW_ENTRIES = [
  {
    id: 'mi-river-ontonagon',
    name: 'Ontonagon River',
    state: 'MI',
    region: 'UP rivers — Lake Superior tribs',
    type: 'great-lake-trib',
    county: 'Ontonagon',
    river: 'Ontonagon River',
    signatureSpecies: 'Brook trout, brown trout, walleye',
    species: [
      { name: 'Brook trout', importance: 'signature', size: '7-12 in' },
      { name: 'Brown trout', importance: 'strong' },
      { name: 'Walleye', importance: 'good', size: 'Lower river.' },
      { name: 'Smallmouth bass', importance: 'good' },
      { name: 'Northern pike', importance: 'good' },
    ],
    patterns: [
      {
        title: 'East Branch + Middle Branch wild brookies',
        target: 'Brook trout',
        when: 'May-September',
        technique: 'Small dries + small streamers',
        where: 'East + Middle + South Branch above the main river',
      },
    ],
    access: ['Porcupine Mountains', 'Bergland', 'Rockland'],
    notes: 'Four branches drain the western UP. Wilderness river through the Porkies. Drains to Lake Superior at Ontonagon.',
  },
  {
    id: 'mi-river-presque-isle',
    name: 'Presque Isle River',
    state: 'MI',
    region: 'UP rivers — Lake Superior tribs',
    type: 'great-lake-trib',
    county: 'Gogebic / Ontonagon',
    river: 'Presque Isle River',
    signatureSpecies: 'Brook trout, steelhead',
    species: [
      { name: 'Brook trout', importance: 'signature', size: '7-11 in' },
      { name: 'Steelhead', importance: 'strong', size: '6-10 lb' },
      { name: 'Brown trout', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Wilderness brookie wading',
        target: 'Brook trout',
        when: 'May-September',
        technique: 'Small dries',
        where: 'Through Porcupine Mountains Wilderness',
      },
    ],
    access: ['Porcupine Mountains Wilderness State Park'],
    notes: 'Flows through Porkies Wilderness — Manabezho Falls + Manido Falls. Pristine character.',
  },
  {
    id: 'mi-river-yellow-dog',
    name: 'Yellow Dog River',
    state: 'MI',
    region: 'UP rivers — Lake Superior tribs',
    type: 'river',
    county: 'Marquette',
    river: 'Yellow Dog River',
    signatureSpecies: 'Brook trout',
    species: [
      { name: 'Brook trout', importance: 'signature', size: '7-11 in, occasional 14+', notes: 'Iconic UP brookie water.' },
      { name: 'Brown trout', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Headwater brookie sight-fishing',
        target: 'Brook trout',
        when: 'May-September',
        technique: 'Adams (#14-16), Royal Wulff, small streamers',
        where: 'Upper river above the falls',
      },
    ],
    access: ['Big Pup Falls trailhead', 'McCormick Wilderness'],
    notes: 'Drains the McCormick Wilderness. Wild + pristine. McCormick is the closest thing to a designated wilderness in the LP and UP — no motorized vehicles.',
  },
  {
    id: 'mi-river-salmon-trout',
    name: 'Salmon Trout River',
    state: 'MI',
    region: 'UP rivers — Lake Superior tribs',
    type: 'great-lake-trib',
    county: 'Marquette',
    river: 'Salmon Trout River',
    signatureSpecies: 'Coaster brook trout, brown trout, steelhead',
    species: [
      { name: 'Coaster brook trout', importance: 'signature', size: '2-5 lb', notes: 'The Salmon Trout is the LAST native coaster brook trout river in the lower 48. Critical conservation status.' },
      { name: 'Brown trout', importance: 'strong' },
      { name: 'Steelhead', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Coaster brook trout — conservation status',
        target: 'Coaster brook trout',
        when: 'September-October (run from Lake Superior)',
        technique: 'Small streamers (black-nose dace, sculpins); small spinners',
        where: 'Lower river up from Lake Superior',
        details: 'Coaster brook trout have nearly disappeared from Lake Superior. The Salmon Trout River + a few Canadian tribs are the last self-sustaining populations. CATCH + RELEASE. Use barbless. Keep them wet.',
      },
    ],
    access: ['Limited public access; Huron Mountain Club controls much shoreline'],
    regulations: 'Strict catch-and-release for coaster brook trout. Designated wild-trout stream.',
    managementProgram: ['MI DNR coaster brook trout conservation', 'Huron Mountain Club private stewardship'],
    notes: 'Coaster brook trout last stand. Access is heavily restricted because much of the watershed is private (Huron Mountain Club). One of the most important conservation fisheries in the Great Lakes basin.',
  },
  {
    id: 'mi-river-big-garlic',
    name: 'Big Garlic River',
    state: 'MI',
    region: 'UP rivers — Lake Superior tribs',
    type: 'great-lake-trib',
    county: 'Marquette',
    river: 'Big Garlic River',
    signatureSpecies: 'Brook trout, steelhead',
    species: [
      { name: 'Brook trout', importance: 'signature', size: '7-11 in' },
      { name: 'Steelhead', importance: 'strong', size: '6-10 lb' },
      { name: 'Brown trout', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Spring steelhead',
        target: 'Steelhead',
        when: 'April-May',
        technique: 'Float-rig + small streamers',
        where: 'Lower river',
      },
    ],
    access: ['Lake Superior mouth area'],
    notes: 'Lake Superior trib north of Marquette. Smaller + intimate steelhead trib.',
  },
  {
    id: 'mi-lake-michigamme',
    name: 'Lake Michigamme',
    state: 'MI',
    region: 'UP inland lakes',
    type: 'natural-lake',
    county: 'Marquette / Baraga',
    acres: 4360,
    maxDepthFt: 70,
    signatureSpecies: 'Walleye, smallmouth bass, muskie, pike',
    species: [
      { name: 'Walleye', importance: 'signature', size: '14-22 in' },
      { name: 'Smallmouth bass', importance: 'strong', size: '2-4 lb' },
      { name: 'Muskellunge', importance: 'strong', size: '36-44 in', notes: 'IDNR-stocked.' },
      { name: 'Northern pike', importance: 'strong' },
      { name: 'Largemouth bass', importance: 'good' },
      { name: 'Yellow perch', importance: 'strong' },
    ],
    patterns: [
      {
        title: 'Multi-species cabbage edges',
        target: 'Walleye + pike + musky',
        when: 'May-October',
        technique: 'Crawler harnesses for walleye; bucktails for musky; in-line spinners for pike',
        where: 'Cabbage edges throughout',
      },
    ],
    access: ['Van Riper State Park', 'Michigamme'],
    notes: 'Western UP\'s premier multi-species lake. Van Riper State Park access. Drains via the Michigamme River.',
  },
  {
    id: 'mi-manistique-lakes',
    name: 'Manistique Lake System (Big + South + Round)',
    state: 'MI',
    region: 'UP inland lakes',
    type: 'natural-lake',
    county: 'Luce / Mackinac',
    acres: 16850,
    maxDepthFt: 25,
    lat: 46.32,
    lng: -85.85,
    signatureSpecies: 'Walleye, smallmouth bass, muskie, perch',
    species: [
      { name: 'Walleye', importance: 'signature', size: '14-22 in' },
      { name: 'Muskellunge', importance: 'strong', size: '36-46 in' },
      { name: 'Smallmouth bass', importance: 'strong' },
      { name: 'Northern pike', importance: 'strong' },
      { name: 'Yellow perch', importance: 'strong' },
      { name: 'Largemouth bass', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Shallow weed-flat walleye',
        target: 'Walleye',
        when: 'May-October',
        technique: 'Crawler harnesses; jig + minnow at dusk',
        where: 'Weed edges throughout the chain',
      },
    ],
    access: ['Curtis', 'Big Manistique Lake Public Access'],
    notes: 'Three connected UP lakes (Big Manistique + South + Round). Big Manistique is the largest UP inland lake at 10,000+ acres.',
  },
  {
    id: 'mi-bond-falls-flowage',
    name: 'Bond Falls Flowage',
    state: 'MI',
    region: 'UP inland lakes',
    type: 'reservoir',
    county: 'Ontonagon',
    acres: 2120,
    maxDepthFt: 30,
    signatureSpecies: 'Walleye, muskie, pike',
    species: [
      { name: 'Walleye', importance: 'signature', size: '14-20 in' },
      { name: 'Muskellunge', importance: 'strong', size: '36-44 in', notes: 'IDNR-stocked.' },
      { name: 'Northern pike', importance: 'strong' },
      { name: 'Smallmouth bass', importance: 'good' },
      { name: 'Largemouth bass', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Musky over flooded timber',
        target: 'Muskellunge',
        when: 'May-November',
        technique: 'Bucktails, gliders, large rubber',
        where: 'Flooded timber + the main channel',
      },
    ],
    access: ['Bond Falls Recreation Area'],
    notes: 'Middle Branch Ontonagon River impoundment. Tannin-stained water + UP wilderness character.',
  },
  {
    id: 'mi-lake-gogebic-already',
    name: 'Lake of the Clouds (Porcupine Mountains)',
    state: 'MI',
    region: 'UP inland lakes',
    type: 'natural-lake',
    county: 'Ontonagon',
    acres: 133,
    maxDepthFt: 25,
    signatureSpecies: 'Brook trout',
    species: [
      { name: 'Brook trout', importance: 'signature', size: '8-12 in' },
      { name: 'Northern pike', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Hike-in brookies',
        target: 'Brook trout',
        when: 'June-September',
        technique: 'Small streamers + dries',
        where: 'Hike-in only — Porcupine Mountains Wilderness',
      },
    ],
    access: ['Hike-in via Porcupine Mountains Wilderness'],
    notes: 'Iconic Porcupine Mountains lake — the scenic overlook is one of the most-photographed in MI. Hike-in fishery.',
  },
  {
    id: 'mi-brevoort-lake',
    name: 'Brevoort Lake',
    state: 'MI',
    region: 'UP inland lakes',
    type: 'natural-lake',
    county: 'Mackinac',
    acres: 4230,
    maxDepthFt: 30,
    signatureSpecies: 'Walleye, smallmouth bass, perch',
    species: [
      { name: 'Walleye', importance: 'signature', size: '14-22 in' },
      { name: 'Smallmouth bass', importance: 'strong' },
      { name: 'Yellow perch', importance: 'strong' },
      { name: 'Northern pike', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Walleye on weed flats',
        target: 'Walleye',
        when: 'May-October',
        technique: 'Crawler harnesses',
        where: 'Weed flats',
      },
    ],
    access: ['Brevoort Lake Campground (USFS)', 'Public Access'],
    notes: 'East-central UP lake near St. Ignace. Hiawatha National Forest access.',
  },
  {
    id: 'mi-river-anna',
    name: 'Anna River',
    state: 'MI',
    region: 'UP rivers — Lake Superior tribs',
    type: 'great-lake-trib',
    county: 'Alger',
    river: 'Anna River',
    signatureSpecies: 'Steelhead, coho salmon, brook trout',
    species: [
      { name: 'Steelhead', importance: 'signature', size: '6-10 lb' },
      { name: 'Coho salmon', importance: 'strong', size: '4-8 lb', notes: 'Fall run.' },
      { name: 'Brook trout', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Fall coho run at Munising mouth',
        target: 'Coho salmon',
        when: 'September-October',
        technique: 'Spawn sacs + spinners',
        where: 'Mouth at Munising Bay',
      },
    ],
    access: ['Munising', 'Mouth at Lake Superior'],
    notes: 'Small UP Lake Superior trib at Munising. Pictured Rocks area.',
  },
  {
    id: 'mi-river-carp-up',
    name: 'Carp River (UP, Marquette)',
    state: 'MI',
    region: 'UP rivers — Lake Superior tribs',
    type: 'great-lake-trib',
    county: 'Marquette',
    river: 'Carp River',
    signatureSpecies: 'Steelhead, brook trout',
    species: [
      { name: 'Steelhead', importance: 'signature', size: '6-10 lb' },
      { name: 'Brook trout', importance: 'strong' },
      { name: 'Coho salmon', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Steelhead near Marquette',
        target: 'Steelhead',
        when: 'October-April',
        technique: 'Float-rig + small streamers',
        where: 'Lower river up from Lake Superior',
      },
    ],
    access: ['Marquette', 'Carp River mouth'],
    notes: 'Marquette\'s home Lake Superior trib. Confusingly-named — there are multiple Carp Rivers in MI.',
  },
];

const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const byId = new Map(data.map((w) => [w.id, w]));
let appended = 0;
for (const e of NEW_ENTRIES) {
  if (byId.has(e.id)) { console.log(`  exists ${e.id}`); continue; }
  data.push(e); byId.set(e.id, e);
  console.log(`  + ${e.id} (${e.species.length} species · ${e.patterns.length} patterns)`);
  appended++;
}
console.log(`\nAppended ${appended} entries. Total: ${data.length}`);
fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n', 'utf8');
