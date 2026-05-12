/**
 * Florida Waters Vol 5 — Florida Keys + Bay.
 *
 * The Keys = flats-fishing mecca for permit, bonefish, tarpon. The
 * "World Series" of saltwater fly fishing happens here.
 */
const fs = require('node:fs');
const path = require('node:path');
const FILE = path.join(__dirname, '..', 'data', 'waterbodies.json');

const NEW_ENTRIES = [
  {
    id: 'fl-biscayne-bay',
    name: 'Biscayne Bay',
    state: 'FL',
    region: 'FL Keys + Bay',
    type: 'great-lake',
    county: 'Miami-Dade',
    acres: 270000,
    maxDepthFt: 12,
    lat: 25.55,
    lng: -80.20,
    signatureSpecies: 'Bonefish, permit, tarpon, snook, redfish',
    species: [
      { name: 'Bonefish', importance: 'signature', size: '4-12 lb', notes: 'Biscayne Bay bonefishing is the urban-flats classic — sight-fishing skinny water in view of downtown Miami.' },
      { name: 'Permit', importance: 'signature', size: '15-30 lb' },
      { name: 'Tarpon', importance: 'signature', size: '60-150 lb' },
      { name: 'Snook', importance: 'strong' },
      { name: 'Redfish', importance: 'strong' },
      { name: 'Spotted sea trout', importance: 'good' },
      { name: 'Spanish + king mackerel', importance: 'good' },
      { name: 'Sailfish', importance: 'good', notes: 'Offshore.' },
    ],
    patterns: [
      {
        title: 'Biscayne Bay bonefish flats',
        target: 'Bonefish',
        when: 'Year-round, peak fall + winter',
        technique: 'Crazy Charlie, Gotcha, Kwan, Bonefish Bitters; small spin-cast jigs',
        where: 'Bay flats from Stiltsville to the Keys + Card Sound + Ragged Keys',
        details: 'Biscayne Bay bones are a sight-fishery — wading + poling from skiffs. Permits, tarpon, snook share the same water.',
      },
      {
        title: 'Stiltsville permit',
        target: 'Permit',
        when: 'April-October',
        technique: 'Merkin Crab, EP Crab, small soft-plastic shrimp',
        where: 'Stiltsville flats + Biscayne National Park flats',
      },
    ],
    access: ['Crandon Marina', 'Black Point Marina', 'Card Sound Bridge'],
    notes: 'Half urban (downtown Miami shoreline), half Biscayne National Park. The Kwan fly was developed here.',
  },
  {
    id: 'fl-florida-bay',
    name: 'Florida Bay (Flamingo + south Everglades)',
    state: 'FL',
    region: 'FL Keys + Bay',
    type: 'great-lake',
    county: 'Monroe',
    acres: 800000,
    maxDepthFt: 9,
    lat: 25.10,
    lng: -80.80,
    signatureSpecies: 'Tarpon, redfish, snook, bonefish, sea trout',
    species: [
      { name: 'Tarpon', importance: 'signature', size: '40-150 lb' },
      { name: 'Snook', importance: 'signature' },
      { name: 'Redfish', importance: 'signature' },
      { name: 'Bonefish', importance: 'strong', notes: 'Smaller pop than the Keys proper.' },
      { name: 'Spotted sea trout', importance: 'strong' },
      { name: 'Mangrove snapper', importance: 'strong' },
    ],
    patterns: [
      {
        title: 'Flamingo backcountry tarpon + snook',
        target: 'Tarpon + snook',
        when: 'April-July',
        technique: 'Tarpon flies + small streamers + soft-plastic; live mullet',
        where: 'Whitewater Bay + Cape Sable + the back-bay creek mouths',
      },
    ],
    access: ['Flamingo (Everglades NP)', 'Florida City'],
    notes: 'Massive shallow flat-bottomed bay between the Keys + the Everglades. The "backcountry" — opposite of Atlantic-side glamour.',
  },
  {
    id: 'fl-islamorada-flats',
    name: 'Islamorada Flats (Upper Keys)',
    state: 'FL',
    region: 'FL Keys + Bay',
    type: 'great-lake',
    county: 'Monroe',
    lat: 24.92,
    lng: -80.62,
    signatureSpecies: 'Bonefish, permit, tarpon, redfish',
    species: [
      { name: 'Bonefish', importance: 'signature', size: '4-12 lb, 14+ lb possible', notes: 'Islamorada = "sportfishing capital of the world" — the famous Florida Keys flats epicenter.' },
      { name: 'Permit', importance: 'signature', size: '15-30 lb' },
      { name: 'Tarpon', importance: 'signature', size: '60-180 lb' },
      { name: 'Redfish', importance: 'strong', notes: 'Backcountry side toward Florida Bay.' },
      { name: 'Snook', importance: 'strong' },
      { name: 'Sailfish + mahi', importance: 'good', notes: 'Offshore.' },
    ],
    patterns: [
      {
        title: 'Bonefish flats (the Keys classic)',
        target: 'Bonefish',
        when: 'October-May, peak November-April',
        technique: 'Crazy Charlie, Gotcha, Kwan, Bonefish Bitters on 8 wt',
        where: 'Ocean-side + bay-side flats throughout the Upper Keys',
        details: 'The Keys bonefish are notoriously spooky + selective. Long leaders, light tippet, perfect presentations.',
      },
      {
        title: 'Permit on the flats',
        target: 'Permit',
        when: 'May-October',
        technique: 'Merkin Crab, EP Crab, Avalon Permit Fly',
        where: 'Bay-side flats + tarpon highway near-shore',
      },
      {
        title: 'Backcountry tarpon (Florida Bay side)',
        target: 'Tarpon',
        when: 'April-July',
        technique: 'Toad, Cockroach, Apte II',
        where: 'Florida Bay backcountry to the north of Islamorada',
      },
    ],
    access: ['Robbie\'s Marina', 'World Wide Sportsman', 'Bud N\' Mary\'s'],
    notes: 'Islamorada — the most-fished flats town in the world. Permit + bonefish + tarpon flats program built around hundreds of guides.',
  },
  {
    id: 'fl-marathon-flats',
    name: 'Marathon Flats (Middle Keys)',
    state: 'FL',
    region: 'FL Keys + Bay',
    type: 'great-lake',
    county: 'Monroe',
    lat: 24.71,
    lng: -81.09,
    signatureSpecies: 'Bonefish, permit, tarpon',
    species: [
      { name: 'Bonefish', importance: 'signature' },
      { name: 'Permit', importance: 'signature' },
      { name: 'Tarpon', importance: 'signature' },
      { name: 'Redfish', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Middle Keys flats',
        target: 'Bonefish + permit + tarpon',
        when: 'Year-round',
        technique: 'Same Keys playbook — bonefish flies + permit crabs + tarpon flies',
        where: 'Bay-side + ocean-side flats',
      },
    ],
    access: ['Marathon Public Ramp', 'Burdines Marina'],
    notes: 'Quieter alternative to Islamorada. Same flats fishery character.',
  },
  {
    id: 'fl-lower-keys-big-pine',
    name: 'Lower Keys (Big Pine / No Name Key)',
    state: 'FL',
    region: 'FL Keys + Bay',
    type: 'great-lake',
    county: 'Monroe',
    signatureSpecies: 'Bonefish, permit, tarpon',
    species: [
      { name: 'Bonefish', importance: 'signature' },
      { name: 'Permit', importance: 'signature' },
      { name: 'Tarpon', importance: 'signature' },
      { name: 'Mangrove snapper', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Big Pine Key flats',
        target: 'Permit + bonefish',
        when: 'Year-round',
        technique: 'Permit crabs + bonefish flies',
        where: 'Niles Channel + Big Pine flats',
      },
    ],
    access: ['Big Pine Key', 'No Name Key'],
    notes: 'The quietest of the Keys flats systems. Local guides specialize here.',
  },
  {
    id: 'fl-key-west-backcountry',
    name: 'Key West Backcountry + Marquesas',
    state: 'FL',
    region: 'FL Keys + Bay',
    type: 'great-lake',
    county: 'Monroe',
    lat: 24.55,
    lng: -82.10,
    signatureSpecies: 'Permit, tarpon, bonefish, sharks',
    species: [
      { name: 'Permit', importance: 'signature', size: '20-30 lb, 35+ lb possible' },
      { name: 'Tarpon', importance: 'signature' },
      { name: 'Bonefish', importance: 'signature' },
      { name: 'Lemon shark', importance: 'good', size: '50-150 lb', notes: 'Sight-fishing on the flats — a fly-rod adventure target.' },
      { name: 'Cobia', importance: 'good' },
      { name: 'Mahi (offshore)', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Marquesas permit',
        target: 'Permit',
        when: 'April-October',
        technique: 'Merkin Crab, EP Crab, Avalon Permit Fly on 10 wt',
        where: 'Marquesas Atoll flats (30 mi west of Key West)',
        details: 'Marquesas is the legendary permit destination. Boat run from Key West + flats wading on uninhabited islands.',
      },
      {
        title: 'Lemon shark sight-fishing',
        target: 'Lemon shark',
        when: 'Year-round',
        technique: 'Big Red Shark Fly + chum',
        where: 'Backcountry flats around Boca Grande Key + Marquesas',
      },
    ],
    access: ['Key West (Stock Island, Geiger Key, Garrison Bight)', 'Marquesas (boat-in only)'],
    notes: 'Key West = end of the road but middle of the action. Marquesas = the legendary permit + tarpon destination. Dry Tortugas farther west still.',
  },
  {
    id: 'fl-dry-tortugas',
    name: 'Dry Tortugas',
    state: 'FL',
    region: 'FL Keys + Bay',
    type: 'great-lake',
    county: 'Monroe',
    lat: 24.63,
    lng: -82.87,
    signatureSpecies: 'Permit, mutton snapper, goliath grouper, kingfish',
    species: [
      { name: 'Permit', importance: 'signature' },
      { name: 'Mutton snapper', importance: 'signature', size: '5-15 lb', notes: 'Famous Dry Tortugas mutton snapper fishery.' },
      { name: 'Goliath grouper', importance: 'good' },
      { name: 'King mackerel', importance: 'strong' },
      { name: 'Cobia', importance: 'good' },
      { name: 'Mahi', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Mutton snapper bottom-fishing',
        target: 'Mutton snapper',
        when: 'Year-round, peak summer',
        technique: 'Live pinfish + ballyhoo on circle hooks; jig in 80-200 ft',
        where: 'Dry Tortugas reefs + wrecks',
      },
    ],
    access: ['Boat-in only from Key West (~70 mi west)'],
    notes: '70 miles west of Key West. Multi-day boat trips. Mutton snapper + permit + grouper destination. Fort Jefferson is the historic landmark.',
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
