/**
 * Florida Waters Vol 4 — Gulf coast Tampa Bay through 10,000 Islands
 * and the Everglades backcountry.
 */
const fs = require('node:fs');
const path = require('node:path');
const FILE = path.join(__dirname, '..', 'data', 'waterbodies.json');

const NEW_ENTRIES = [
  {
    id: 'fl-tampa-bay',
    name: 'Tampa Bay',
    state: 'FL',
    region: 'FL Gulf Coast inshore',
    type: 'great-lake',
    county: 'Hillsborough / Pinellas / Manatee',
    acres: 400000,
    maxDepthFt: 50,
    lat: 27.78,
    lng: -82.50,
    signatureSpecies: 'Spotted sea trout, redfish, snook, tarpon, mackerel',
    species: [
      { name: 'Spotted sea trout', importance: 'signature', size: '15-25 in, gators 28+', notes: 'Tampa Bay trout population is exceptional — the bay\'s grass flats are productive year-round.' },
      { name: 'Redfish', importance: 'signature', size: '20-30 in slot, 30+ bull reds' },
      { name: 'Snook', importance: 'signature', size: '24-38 in', notes: 'Year-round resident + spawn-season at the passes.' },
      { name: 'Tarpon', importance: 'signature', size: '60-180 lb', notes: 'May-July migration through Tampa Bay; pre-Boca-Grande staging.' },
      { name: 'Spanish mackerel', importance: 'strong' },
      { name: 'Cobia', importance: 'strong' },
      { name: 'Sheepshead', importance: 'strong' },
      { name: 'Mangrove snapper', importance: 'good' },
      { name: 'Permit', importance: 'good', size: 'Smaller juveniles on flats; offshore wrecks for bigger fish' },
      { name: 'Black drum', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Spring + summer tarpon at the passes',
        target: 'Tarpon',
        when: 'May-July',
        technique: 'Live crab on circle hook; live pinfish; fly: Toad, Cockroach, Apte II',
        where: 'Egmont Channel + the passes (Egmont Key area, Skyway shipping channel) + bay flats',
        details: 'Tampa Bay tarpon stage in deeper bay channels + the passes before pushing to Boca Grande. Pre-spawn fish are aggressive.',
      },
      {
        title: 'Snook spawn at the passes',
        target: 'Snook',
        when: 'May-September (spawn)',
        technique: 'Live pinfish + sardine; pearl/chartreuse soft-plastic; fly: Schminnow, Bend-Back',
        where: 'Pass-a-Grille, Egmont Channel, Bunces Pass',
      },
      {
        title: 'Mid-bay grass flats trout',
        target: 'Spotted sea trout',
        when: 'Year-round',
        technique: 'Popping cork + soft-plastic; gold spoon; fly: Clouser, Gurgler',
        where: 'Old Tampa Bay, Lower Tampa Bay, Cockroach Bay grass flats',
      },
    ],
    access: ['St. Pete Pier', 'Skyway Pier', 'Picnic Island', 'Apollo Beach', 'Cockroach Bay'],
    managementProgram: ['FWC inshore management', 'Tampa Bay Estuary Program restoration'],
    notes: 'Florida\'s largest open-water estuary. 400,000 acres of grass flats + passes + mangrove. Year-round multi-species + tarpon highlight reel.',
  },
  {
    id: 'fl-boca-grande-pass',
    name: 'Boca Grande Pass + Charlotte Harbor',
    state: 'FL',
    region: 'FL Gulf Coast inshore',
    type: 'great-lake',
    county: 'Lee / Charlotte',
    acres: 270000,
    maxDepthFt: 80,
    lat: 26.72,
    lng: -82.26,
    signatureSpecies: 'Tarpon, snook, redfish, spotted sea trout',
    species: [
      { name: 'Tarpon', importance: 'signature', size: '100-200 lb', notes: 'BOCA GRANDE = the tarpon capital of the world by sheer numbers. Mid-May through July, thousands of fish stack in Boca Grande Pass.' },
      { name: 'Snook', importance: 'signature' },
      { name: 'Redfish', importance: 'signature' },
      { name: 'Spotted sea trout', importance: 'strong' },
      { name: 'Cobia', importance: 'strong' },
      { name: 'Permit', importance: 'good' },
      { name: 'King mackerel', importance: 'good' },
      { name: 'Goliath grouper', importance: 'good', notes: 'C+R only — protected.' },
    ],
    patterns: [
      {
        title: 'Boca Grande Pass tarpon — the iconic event',
        target: 'Tarpon',
        when: 'Mid-May through July',
        technique: 'Live crab on circle hook; live pass crab; pinfish; fly fishing in the back-bay edges (the pass itself is too deep for fly comfortably)',
        where: 'Boca Grande Pass (mouth) and the channels into Charlotte Harbor',
        details: 'The most-fished tarpon event in the world. Crowds of 100+ boats some days. Local etiquette + tournament rules apply. Hire a guide.',
      },
      {
        title: 'Charlotte Harbor inshore mixed-bag',
        target: 'Redfish + snook + trout',
        when: 'Year-round',
        technique: 'Soft-plastic jerkbait, gold spoon, live shrimp, fly with Clouser + Gurgler',
        where: 'Mangrove shoreline + oyster bars + grass flats throughout the harbor',
      },
    ],
    access: ['Boca Grande', 'Punta Gorda', 'Placida', 'Cape Coral'],
    notes: 'Charlotte Harbor is Florida\'s second-largest open-water estuary. Boca Grande Pass is the famous mouth. Mid-summer tarpon migration is the world\'s most-fished tarpon event.',
  },
  {
    id: 'fl-pine-island-sound',
    name: 'Pine Island Sound + Sanibel / Captiva',
    state: 'FL',
    region: 'FL Gulf Coast inshore',
    type: 'great-lake',
    county: 'Lee',
    acres: 110000,
    maxDepthFt: 12,
    lat: 26.58,
    lng: -82.10,
    signatureSpecies: 'Redfish, spotted sea trout, snook, tarpon',
    species: [
      { name: 'Redfish', importance: 'signature' },
      { name: 'Spotted sea trout', importance: 'signature' },
      { name: 'Snook', importance: 'signature' },
      { name: 'Tarpon', importance: 'signature', notes: 'Boca Grande Pass nearby.' },
      { name: 'Sheepshead', importance: 'strong' },
      { name: 'Permit', importance: 'good', notes: 'Beach permit cruising — sight-fishery.' },
    ],
    patterns: [
      {
        title: 'Sanibel beach snook (Schminnow water)',
        target: 'Snook',
        when: 'May-October',
        technique: 'Schminnow, Crystal Schminnow, Floating Minnow; small white DOA shrimp',
        where: 'Sanibel + Captiva beach shoreline',
        details: 'Norm Zeigler\'s Schminnow was invented here — Sanibel beach snook eat it without question. Wade or kayak the surf.',
      },
      {
        title: 'Mangrove-shoreline redfish',
        target: 'Redfish',
        when: 'Year-round',
        technique: 'Gold spoon, weedless jerkbait',
        where: 'Mangrove shoreline + oyster bars in Pine Island Sound',
      },
    ],
    access: ['Punta Rassa', 'Pine Island', 'Captiva', 'Sanibel'],
    notes: 'Sanibel + Captiva are the famous islands; Pine Island Sound separates them from the mainland. Premier multi-species flats.',
  },
  {
    id: 'fl-naples-estero-bay',
    name: 'Naples / Estero Bay',
    state: 'FL',
    region: 'FL Gulf Coast inshore',
    type: 'great-lake',
    county: 'Collier / Lee',
    signatureSpecies: 'Snook, redfish, tarpon',
    species: [
      { name: 'Snook', importance: 'signature', size: '24-40 in', notes: 'Naples is one of the best year-round snook fisheries in FL.' },
      { name: 'Redfish', importance: 'signature' },
      { name: 'Tarpon', importance: 'strong', size: '50-150 lb' },
      { name: 'Spotted sea trout', importance: 'strong' },
      { name: 'Sheepshead', importance: 'good' },
      { name: 'Mangrove snapper', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Mangrove tunnel snook',
        target: 'Snook',
        when: 'Year-round',
        technique: 'Weedless jerkbait + Bend-Back fly into mangrove tunnels',
        where: 'Estero Bay mangroves + Naples back-bay residential canals',
      },
    ],
    access: ['Naples', 'Bonita Beach', 'Estero Bay'],
    notes: 'SW FL\'s premier snook + redfish flats. Quieter than the Keys or Tampa Bay.',
  },
  {
    id: 'fl-10000-islands',
    name: '10,000 Islands + Everglades National Park backcountry',
    state: 'FL',
    region: 'FL Gulf Coast inshore',
    type: 'great-lake',
    county: 'Collier / Monroe',
    acres: 1500000,
    maxDepthFt: 10,
    lat: 25.80,
    lng: -81.40,
    signatureSpecies: 'Snook, redfish, tarpon, snapper, juvenile tarpon',
    species: [
      { name: 'Snook', importance: 'signature', size: '24-40 in, 36+ inch fish common' },
      { name: 'Redfish', importance: 'signature' },
      { name: 'Tarpon', importance: 'signature', size: '30-180 lb', notes: 'Everglades = the iconic tarpon backcountry. Big migrations + juvenile fish year-round.' },
      { name: 'Mangrove snapper', importance: 'strong' },
      { name: 'Spotted sea trout', importance: 'strong' },
      { name: 'Goliath grouper', importance: 'good', notes: 'C+R protected.' },
      { name: 'Permit', importance: 'good' },
      { name: 'Spanish mackerel', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Mangrove-tunnel snook',
        target: 'Snook',
        when: 'October-May',
        technique: 'Bend-Back, Schminnow, weedless plastic; live pinfish',
        where: 'Mangrove root systems + creek mouths',
        details: 'The Everglades backcountry is a maze of mangrove islands + creeks. Local knowledge or a guide is mandatory — GPS waypoints rule.',
      },
      {
        title: 'Backcountry tarpon',
        target: 'Tarpon',
        when: 'March-July',
        technique: 'Toad, Cockroach, Tarpon Bunny on 11 wt; live mullet',
        where: 'Backcountry channels + bays leading from Florida Bay to the Gulf',
      },
    ],
    access: ['Everglades City', 'Chokoloskee', 'Flamingo (south entrance)'],
    regulations: 'Everglades National Park rules + permits in park-managed water.',
    notes: '1.5 million acres of mangrove maze. The iconic Florida tarpon backcountry — Hemingway, Zane Grey, every generation of saltwater fly anglers. Guided trip strongly recommended for first-timers.',
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
