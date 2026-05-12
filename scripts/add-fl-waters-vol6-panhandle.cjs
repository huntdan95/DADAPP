/**
 * Florida Waters Vol 6 — Panhandle + Springs + Rivers.
 *
 * North FL + Panhandle has a different fishery character than the
 * peninsula: Apalachicola oysters, St. Joe Bay sea grass, Destin
 * offshore, Wakulla springs, Suwannee River bass.
 */
const fs = require('node:fs');
const path = require('node:path');
const FILE = path.join(__dirname, '..', 'data', 'waterbodies.json');

const NEW_ENTRIES = [
  {
    id: 'fl-apalachicola-bay',
    name: 'Apalachicola Bay',
    state: 'FL',
    region: 'FL Panhandle',
    type: 'great-lake',
    county: 'Franklin',
    acres: 210000,
    maxDepthFt: 12,
    lat: 29.70,
    lng: -84.97,
    signatureSpecies: 'Spotted sea trout, redfish, flounder, oysters (commercial)',
    species: [
      { name: 'Spotted sea trout', importance: 'signature', size: '15-25 in, gators possible' },
      { name: 'Redfish', importance: 'signature' },
      { name: 'Flounder', importance: 'strong' },
      { name: 'Sheepshead', importance: 'strong' },
      { name: 'Black drum', importance: 'good' },
      { name: 'Tripletail', importance: 'good', notes: 'Sight-fishery — Apalachicola is famous for tripletail under crab pots + buoys.' },
      { name: 'Tarpon', importance: 'good', notes: 'Summer migration.' },
    ],
    patterns: [
      {
        title: 'Tripletail sight-fishing under buoys',
        target: 'Tripletail',
        when: 'May-October',
        technique: 'Live shrimp, soft-plastic jig, fly: Schminnow + small Clouser',
        where: 'Crab-pot buoys + floating debris in the bay + nearshore',
        details: 'Tripletail hold under structure on the surface. Cruise crab-pot lines + bait the fish with shrimp. A genuinely unique FL sight-fishery.',
      },
      {
        title: 'Grass-flat trout',
        target: 'Spotted sea trout',
        when: 'Year-round',
        technique: 'Soft-plastic + popping cork; gold spoon',
        where: 'East Bay + West Bay grass flats',
      },
    ],
    access: ['Apalachicola', 'East Point', 'Carrabelle'],
    notes: 'Famous oyster bay (recovering). Inshore + nearshore Panhandle classic.',
  },
  {
    id: 'fl-st-joseph-bay',
    name: 'St. Joseph Bay (Port St. Joe)',
    state: 'FL',
    region: 'FL Panhandle',
    type: 'great-lake',
    county: 'Gulf',
    acres: 65000,
    maxDepthFt: 32,
    lat: 29.82,
    lng: -85.42,
    signatureSpecies: 'Spotted sea trout, redfish, scallops (commercial)',
    species: [
      { name: 'Spotted sea trout', importance: 'signature', size: '15-25 in, gators 28+', notes: 'St. Joe Bay is the trophy-trout flats of the Panhandle.' },
      { name: 'Redfish', importance: 'signature' },
      { name: 'Flounder', importance: 'strong' },
      { name: 'Pompano', importance: 'strong', notes: 'Surf + sand flats.' },
      { name: 'Sheepshead', importance: 'strong' },
      { name: 'Tarpon', importance: 'good', notes: 'Summer migration.' },
    ],
    patterns: [
      {
        title: 'Gator trout on grass flats',
        target: 'Spotted sea trout',
        when: 'Year-round, peak fall + winter',
        technique: 'Soft-plastic + popping cork; topwater walking bait at dawn; fly: Clouser + Gurgler',
        where: 'St. Joe Bay grass flats + sand-hole transitions',
      },
    ],
    access: ['Port St. Joe', 'Cape San Blas'],
    notes: 'Pristine Panhandle bay. Famous scallop fishery + trophy trout flats.',
  },
  {
    id: 'fl-choctawhatchee-destin',
    name: 'Choctawhatchee Bay (Destin)',
    state: 'FL',
    region: 'FL Panhandle',
    type: 'great-lake',
    county: 'Okaloosa / Walton',
    acres: 110000,
    maxDepthFt: 40,
    lat: 30.40,
    lng: -86.31,
    signatureSpecies: 'Spotted sea trout, redfish, king mackerel, snapper',
    species: [
      { name: 'Spotted sea trout', importance: 'signature' },
      { name: 'Redfish', importance: 'signature' },
      { name: 'King mackerel', importance: 'signature', size: '15-30 lb', notes: 'Destin = king mackerel capital.' },
      { name: 'Vermilion + red snapper', importance: 'strong', notes: 'Offshore reefs + wrecks.' },
      { name: 'Sheepshead', importance: 'strong' },
      { name: 'Flounder', importance: 'strong' },
      { name: 'Cobia', importance: 'strong', notes: 'Spring migration through the Panhandle.' },
      { name: 'Spanish mackerel', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Destin offshore king mackerel',
        target: 'King mackerel',
        when: 'April-October',
        technique: 'Slow-troll live cigar minnow + ribbon-fish on wire stinger rigs',
        where: 'Offshore reefs + wrecks 5-30 mi off Destin',
      },
      {
        title: 'Cobia migration sight-fishing',
        target: 'Cobia',
        when: 'March-April',
        technique: 'Big bucktail jig 3-4 oz chartreuse; live pinfish',
        where: 'Inside the 4-7 ft sand shoreline; tower-boats run the beach scanning',
      },
    ],
    access: ['Destin Harbor', 'East Pass'],
    notes: 'Destin = the working-class offshore charter port. King + snapper + cobia destination.',
  },
  {
    id: 'fl-pensacola-bay',
    name: 'Pensacola Bay',
    state: 'FL',
    region: 'FL Panhandle',
    type: 'great-lake',
    county: 'Escambia / Santa Rosa',
    acres: 140000,
    maxDepthFt: 35,
    signatureSpecies: 'Spotted sea trout, redfish, sheepshead, flounder',
    species: [
      { name: 'Spotted sea trout', importance: 'signature' },
      { name: 'Redfish', importance: 'signature' },
      { name: 'Sheepshead', importance: 'strong' },
      { name: 'Flounder', importance: 'strong' },
      { name: 'Spanish mackerel', importance: 'good' },
      { name: 'King mackerel', importance: 'good' },
      { name: 'Tripletail', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Pensacola Bay grass-flat trout',
        target: 'Spotted sea trout',
        when: 'Year-round',
        technique: 'Popping cork + soft-plastic; fly: Clouser',
        where: 'Bay-side grass flats + sand-hole transitions',
      },
    ],
    access: ['Pensacola Beach', 'Pensacola Naval Air Station', 'Gulf Breeze'],
    notes: 'Westernmost FL Panhandle bay. Inshore multi-species fishery. Connected to Perdido Bay (AL line).',
  },
  {
    id: 'fl-cedar-key',
    name: 'Cedar Key',
    state: 'FL',
    region: 'Citrus County / Nature Coast',
    type: 'great-lake',
    county: 'Levy',
    lat: 29.13,
    lng: -83.04,
    signatureSpecies: 'Spotted sea trout, redfish, sheepshead, mangrove snapper',
    species: [
      { name: 'Spotted sea trout', importance: 'signature' },
      { name: 'Redfish', importance: 'signature' },
      { name: 'Mangrove snapper', importance: 'strong' },
      { name: 'Sheepshead', importance: 'strong' },
      { name: 'Tarpon', importance: 'good', notes: 'Summer migration along Nature Coast.' },
      { name: 'Cobia', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Oyster-bar redfish + trout',
        target: 'Redfish + trout',
        when: 'Year-round',
        technique: 'Gold spoon + soft-plastic + Spoon Fly',
        where: 'Oyster bars + creek mouths around the Cedar Keys',
      },
    ],
    access: ['Cedar Key public ramp', 'Suwannee Sound'],
    notes: 'Quaint old Florida fishing village. North Nature Coast inshore.',
  },
  {
    id: 'fl-suwannee-river',
    name: 'Suwannee River',
    state: 'FL',
    region: 'FL Rivers + Springs',
    type: 'river',
    county: 'Multiple — north FL',
    river: 'Suwannee River',
    signatureSpecies: 'Largemouth bass, Suwannee bass, redfish (lower), striped bass',
    species: [
      { name: 'Largemouth bass', importance: 'signature', size: '2-5 lb' },
      { name: 'Suwannee bass', importance: 'signature', size: '1-3 lb', notes: 'Endemic to the Suwannee + Ochlockonee systems. Compact black bass with red eye + dark spotted markings.' },
      { name: 'Redfish', importance: 'strong', size: 'Lower river / Suwannee Sound' },
      { name: 'Striped bass', importance: 'strong', size: 'Atlantic-strain, run from Gulf' },
      { name: 'Channel catfish', importance: 'strong' },
      { name: 'Bluegill + redear sunfish', importance: 'strong' },
    ],
    patterns: [
      {
        title: 'Suwannee bass sight-fishing in clear water',
        target: 'Suwannee bass',
        when: 'April-October',
        technique: 'Small soft-plastic jerkbait, in-line spinner, fly: small streamers + poppers',
        where: 'Rocky river runs + spring-fed clear-water sections',
        details: 'The Suwannee bass is a genuinely unique FL species — limestone-river specialist. Sight-fish in clear water.',
      },
    ],
    access: ['Branford', 'Mayo', 'Suwannee Park', 'Manatee Springs State Park'],
    notes: 'Famous south-flowing FL river through limestone karst. Multiple state parks. Suwannee bass = endemic FL species.',
  },
  {
    id: 'fl-wakulla-river',
    name: 'Wakulla River + St. Marks (springs)',
    state: 'FL',
    region: 'FL Rivers + Springs',
    type: 'river',
    county: 'Wakulla',
    river: 'Wakulla River',
    signatureSpecies: 'Largemouth bass, bluegill, redear sunfish, redfish (lower)',
    species: [
      { name: 'Largemouth bass', importance: 'strong' },
      { name: 'Bluegill', importance: 'strong' },
      { name: 'Redear sunfish (shellcracker)', importance: 'strong' },
      { name: 'Redfish', importance: 'good', notes: 'Lower river + St. Marks NWR area.' },
      { name: 'Spotted sea trout', importance: 'good', notes: 'St. Marks NWR.' },
      { name: 'Striped bass', importance: 'good', notes: 'St. Marks River run.' },
    ],
    patterns: [
      {
        title: 'Spring-river bass + bream',
        target: 'Largemouth + panfish',
        when: 'Year-round',
        technique: 'Senko, popping bug, cricket',
        where: 'Spring run + downstream cypress',
      },
    ],
    access: ['Wakulla Springs State Park', 'St. Marks NWR'],
    notes: 'Wakulla Springs is one of the largest + deepest freshwater springs in the world. River flows into St. Marks + the Gulf. Manatees + alligators present.',
  },
  {
    id: 'fl-silver-river',
    name: 'Silver River + Silver Springs',
    state: 'FL',
    region: 'FL Rivers + Springs',
    type: 'river',
    county: 'Marion',
    river: 'Silver River',
    signatureSpecies: 'Largemouth bass, bluegill, redear sunfish, spotted sunfish',
    species: [
      { name: 'Largemouth bass', importance: 'strong' },
      { name: 'Bluegill', importance: 'strong' },
      { name: 'Redear sunfish', importance: 'strong' },
      { name: 'Spotted sunfish', importance: 'strong' },
      { name: 'Channel catfish', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Clear-water sight bass',
        target: 'Largemouth bass',
        when: 'Year-round',
        technique: 'Light-weighted plastics, in-line spinner, popper',
        where: 'Spring boil + downstream',
      },
    ],
    access: ['Silver Springs State Park'],
    notes: 'Silver Springs = historic glass-bottom boat destination. Clear spring run for 5.5 mi to Ocklawaha River. Sight-fishing bass + bream paradise.',
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
