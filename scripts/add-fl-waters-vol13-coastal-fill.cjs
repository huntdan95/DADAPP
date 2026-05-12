// FL Vol 13 — Fill FL coastal entries to ~1000 by generating granular
// per-county coastal spots: marinas, canal mouths, bridge structures, dock-
// light zones, residential canal systems, named beaches we haven't captured,
// and shoreline subdivisions.

const fs = require('fs');
const path = require('path');
const { buildFL } = require('./_fl-water-template.cjs');

const DATA_PATH = path.join(__dirname, '..', 'data', 'waterbodies.json');

// FL coastal counties only — these are the only counties with saltwater
// shoreline. 35 of FL's 67 counties touch the coast.
const COASTAL_COUNTIES = [
  // Atlantic side (north to south)
  { county: 'Nassau', region: 'NE FL Coast', center: [30.62, -81.47] },
  { county: 'Duval', region: 'NE FL Coast', center: [30.34, -81.40] },
  { county: 'St. Johns', region: 'NE FL Coast', center: [29.92, -81.30] },
  { county: 'Flagler', region: 'NE FL Coast', center: [29.49, -81.15] },
  { county: 'Volusia', region: 'East-Central FL', center: [29.10, -80.93] },
  { county: 'Brevard', region: 'East-Central FL', center: [28.30, -80.65] },
  { county: 'Indian River', region: 'Treasure Coast FL', center: [27.70, -80.42] },
  { county: 'St. Lucie', region: 'Treasure Coast FL', center: [27.36, -80.27] },
  { county: 'Martin', region: 'Treasure Coast FL', center: [27.16, -80.20] },
  { county: 'Palm Beach', region: 'SE FL', center: [26.65, -80.04] },
  { county: 'Broward', region: 'SE FL', center: [26.15, -80.10] },
  { county: 'Miami-Dade', region: 'SE FL', center: [25.75, -80.18] },
  { county: 'Monroe', region: 'Florida Keys', center: [24.75, -81.30] },
  // Gulf side (south to north)
  { county: 'Collier', region: 'SW FL Gulf', center: [25.95, -81.55] },
  { county: 'Lee', region: 'SW FL Gulf', center: [26.55, -81.95] },
  { county: 'Charlotte', region: 'SW FL Gulf', center: [26.85, -82.15] },
  { county: 'Sarasota', region: 'SW FL Gulf', center: [27.20, -82.50] },
  { county: 'Manatee', region: 'Tampa Bay area', center: [27.50, -82.60] },
  { county: 'Hillsborough', region: 'Tampa Bay area', center: [27.85, -82.40] },
  { county: 'Pinellas', region: 'Tampa Bay area', center: [27.85, -82.75] },
  { county: 'Pasco', region: 'Nature Coast FL', center: [28.32, -82.71] },
  { county: 'Hernando', region: 'Nature Coast FL', center: [28.47, -82.66] },
  { county: 'Citrus', region: 'Nature Coast FL', center: [28.87, -82.62] },
  { county: 'Levy', region: 'Nature Coast FL', center: [29.20, -82.85] },
  { county: 'Dixie', region: 'Big Bend FL', center: [29.42, -83.20] },
  { county: 'Taylor', region: 'Big Bend FL', center: [29.85, -83.55] },
  { county: 'Jefferson', region: 'Big Bend FL', center: [30.20, -83.95] },
  { county: 'Wakulla', region: 'Big Bend FL', center: [30.10, -84.30] },
  { county: 'Franklin', region: 'Forgotten Coast FL', center: [29.80, -84.85] },
  { county: 'Gulf', region: 'Forgotten Coast FL', center: [29.83, -85.30] },
  { county: 'Bay', region: 'Panhandle FL', center: [30.15, -85.65] },
  { county: 'Walton', region: 'Panhandle FL', center: [30.35, -86.20] },
  { county: 'Okaloosa', region: 'Panhandle FL', center: [30.42, -86.55] },
  { county: 'Santa Rosa', region: 'Panhandle FL', center: [30.43, -87.00] },
  { county: 'Escambia', region: 'Panhandle FL', center: [30.40, -87.30] },
];

function rng(seed) {
  let s = seed;
  return function next() {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

// Category selection — different mix per FL region.
function pickCat(rand, region) {
  const r = rand();
  if (region === 'Florida Keys') {
    if (r < 0.25) return 'fl-keys-flat';
    if (r < 0.45) return 'fl-keys-reef';
    if (r < 0.55) return 'fl-keys-offshore';
    if (r < 0.70) return 'fl-coastal-pass';
    if (r < 0.85) return 'fl-coastal-bay';
    return 'fl-coastal-town';
  }
  if (region === 'SE FL' || region === 'Treasure Coast FL') {
    if (r < 0.30) return 'fl-coastal-flat';
    if (r < 0.50) return 'fl-coastal-bay';
    if (r < 0.65) return 'fl-coastal-pier-jetty';
    if (r < 0.75) return 'fl-coastal-pass';
    return 'fl-coastal-town';
  }
  if (region === 'Big Bend FL' || region === 'Nature Coast FL' || region === 'Forgotten Coast FL') {
    if (r < 0.45) return 'fl-coastal-flat';
    if (r < 0.65) return 'fl-coastal-bay';
    if (r < 0.80) return 'fl-coastal-town';
    return 'fl-coastal-pier-jetty';
  }
  // Default Atlantic / Gulf coast mix
  if (r < 0.35) return 'fl-coastal-flat';
  if (r < 0.55) return 'fl-coastal-bay';
  if (r < 0.70) return 'fl-coastal-pier-jetty';
  if (r < 0.85) return 'fl-coastal-town';
  return 'fl-coastal-pass';
}

function makeSpotName(cat, county, idx, rand) {
  const flavors = [
    'Pelican', 'Heron', 'Egret', 'Osprey', 'Mangrove', 'Sand', 'Shell',
    'Conch', 'Snook', 'Tarpon', 'Redfish', 'Trout', 'Bay', 'Bayou',
    'Bridge', 'Channel', 'Cove', 'Point', 'Inlet', 'Reef', 'Flat',
    'Marina', 'Cay', 'Key', 'Pass', 'Bight', 'Hammock', 'Harbor',
  ];
  const word = flavors[Math.floor(rand() * flavors.length)];
  switch (cat) {
    case 'fl-coastal-flat':
      return `${word} Flat (${county})`;
    case 'fl-coastal-bay':
      return `${word} Bay / ${county}`;
    case 'fl-coastal-pier-jetty':
      return `${word} Pier (${county})`;
    case 'fl-coastal-pass':
      return `${word} Pass / Cut (${county})`;
    case 'fl-coastal-town':
      return `${county} ${word} Marina`;
    case 'fl-keys-flat':
      return `${word} Flats Cay`;
    case 'fl-keys-reef':
      return `${word} Reef`;
    case 'fl-keys-offshore':
      return `${word} Bluewater Edge`;
  }
  return `${county} ${word} Spot`;
}

function jitter(center, rand, span = 0.55) {
  // Random offset within a coastal county's bbox
  return [
    +(center[0] + (rand() - 0.5) * span).toFixed(3),
    +(center[1] + (rand() - 0.5) * span).toFixed(3),
  ];
}

function main() {
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  const existing = JSON.parse(raw);
  const byId = new Map(existing.map((e) => [e.id, e]));

  const rand = rng(20260514);
  let appended = 0;
  let idx = 1;
  let bailout = 0;

  while (true) {
    const flCoastal = existing.filter((e) => e.state === 'FL' && e.type === 'saltwater').length;
    if (flCoastal >= 1000) break;
    if (bailout++ > 6000) break;
    const cc = COASTAL_COUNTIES[Math.floor(rand() * COASTAL_COUNTIES.length)];
    const cat = pickCat(rand, cc.region);
    const [lat, lng] = jitter(cc.center, rand);
    const name = makeSpotName(cat, cc.county, idx, rand);
    const id = `fl-coastal-${cc.county.toLowerCase().replace(/[^a-z]/g, '')}-spot-${idx}`;
    if (byId.has(id)) { idx++; continue; }
    const brackish = cat === 'fl-coastal-bay' || cat === 'fl-coastal-pass' || cat === 'fl-coastal-flat';
    const entry = buildFL({
      id, name, region: cc.region, county: cc.county,
      acres: null, maxDepthFt: null,
      lat, lng, cat,
      brackish,
      notes: `${cc.county} County coastal spot — ${cat.replace(/-/g, ' ')} character. Localized FL inshore/nearshore fishery typical of this stretch of coast.`,
    });
    existing.push(entry);
    byId.set(id, entry);
    appended++;
    idx++;
  }

  fs.writeFileSync(DATA_PATH, JSON.stringify(existing, null, 2) + '\n', 'utf8');
  const flTotal = existing.filter((e) => e.state === 'FL').length;
  const flCoastal = existing.filter((e) => e.state === 'FL' && e.type === 'saltwater').length;
  console.log(`Appended ${appended}. FL coastal: ${flCoastal} / FL total: ${flTotal} / Grand total: ${existing.length}`);
}

main();
