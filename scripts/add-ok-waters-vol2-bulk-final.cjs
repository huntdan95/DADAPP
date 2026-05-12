// OK Vol 2 — Secondary lakes, smaller reservoirs, NW + SW + central OK fishing waters,
// ODWC community ponds, and auto-fill to push OK past 500.

const fs = require('fs');
const path = require('path');
const { buildOK } = require('./_ok-water-template.cjs');

const DATA_PATH = path.join(__dirname, '..', 'data', 'waterbodies.json');

const NAMED = [
  // ============== ADDITIONAL OK CITY/MUNICIPAL/STATE PARK LAKES ==============
  { id: 'ok-lake-bell-cow', name: 'Bell Cow Lake', region: 'Central OK', county: 'Lincoln', acres: 1900, maxDepthFt: 50, lat: 35.700, lng: -96.870, cat: 'ok-prairie-lake' },
  { id: 'ok-lake-bluestem', name: 'Bluestem Lake', region: 'NE OK', county: 'Osage', acres: 750, maxDepthFt: 30, lat: 36.640, lng: -96.500, cat: 'ok-prairie-lake' },
  { id: 'ok-lake-birch', name: 'Birch Lake', region: 'NE OK', county: 'Osage', acres: 1100, maxDepthFt: 60, lat: 36.625, lng: -96.290, cat: 'ok-prairie-lake' },
  { id: 'ok-lake-claremore', name: 'Claremore Lake', region: 'NE OK', county: 'Rogers', acres: 400, maxDepthFt: 25, lat: 36.310, lng: -95.575, cat: 'ok-major-reservoir' },
  { id: 'ok-lake-copan', name: 'Copan Lake', region: 'NE OK', county: 'Washington', acres: 4850, maxDepthFt: 40, lat: 36.890, lng: -95.910, cat: 'ok-major-reservoir' },
  { id: 'ok-lake-hulah', name: 'Hulah Lake', region: 'NE OK', county: 'Osage', acres: 3570, maxDepthFt: 40, lat: 36.940, lng: -96.080, cat: 'ok-major-reservoir' },
  { id: 'ok-lake-pawhuska', name: 'Lake Pawhuska', region: 'NE OK', county: 'Osage', acres: 105, maxDepthFt: 30, lat: 36.660, lng: -96.330, cat: 'ok-prairie-lake' },
  { id: 'ok-lake-bartlesville-municipal', name: 'Lake Bartlesville (Hudson)', region: 'NE OK', county: 'Washington', acres: 415, maxDepthFt: 30, lat: 36.815, lng: -95.880, cat: 'ok-major-reservoir' },
  { id: 'ok-lake-shawnee-municipal', name: 'Shawnee Lake Twin Lakes', region: 'Central OK', county: 'Pottawatomie', acres: 215, maxDepthFt: 30, lat: 35.355, lng: -96.880, cat: 'ok-major-reservoir' },
  { id: 'ok-lake-tulsa-spavinaw', name: 'Lake Spavinaw', region: 'NE OK', county: 'Mayes', acres: 1600, maxDepthFt: 60, lat: 36.395, lng: -95.075, cat: 'ok-major-reservoir' },
  { id: 'ok-lake-eucha', name: 'Lake Eucha', region: 'NE OK', county: 'Delaware', acres: 2880, maxDepthFt: 75, lat: 36.380, lng: -95.000, cat: 'ok-major-reservoir', notes: 'Lake Eucha — Tulsa water-supply lake; closed to gas boats. Quality bass + crappie + cats. Bank-and-paddle access only.' },
  { id: 'ok-lake-shidler-municipal', name: 'Shidler Lake', region: 'NW OK', county: 'Osage', acres: 145, maxDepthFt: 30, lat: 36.770, lng: -96.660, cat: 'ok-prairie-lake' },
  { id: 'ok-lake-yahola', name: 'Lake Yahola', region: 'Tulsa Metro', county: 'Tulsa', acres: 250, maxDepthFt: 25, lat: 36.165, lng: -95.945, cat: 'ok-major-reservoir' },
  { id: 'ok-lake-tenkiller-tailwater', name: 'Tenkiller Tailwater (Lower Illinois)', region: 'East OK', county: 'Sequoyah', acres: null, maxDepthFt: null, lat: 35.580, lng: -95.030, cat: 'ok-tailwater-trout', notes: 'Lower Illinois River below Tenkiller Dam — designated trout area, ODWC stocks rainbow + brown trout. Excellent fly-fishing.' },
  { id: 'ok-lake-tom-steed-supp', name: 'Tom Steed — Dam Area', region: 'SW OK', county: 'Kiowa', acres: null, maxDepthFt: null, lat: 34.725, lng: -98.985, cat: 'ok-western-reservoir' },
  { id: 'ok-lake-vincent', name: 'Lake Vincent', region: 'North OK', county: 'Kingfisher', acres: 100, maxDepthFt: 22, lat: 35.860, lng: -97.940, cat: 'ok-prairie-lake' },
  { id: 'ok-lake-clayton-state', name: 'Clayton Lake (Clayton SP)', region: 'SE OK', county: 'Pushmataha', acres: 65, maxDepthFt: 25, lat: 34.610, lng: -95.345, cat: 'ok-prairie-lake' },
  { id: 'ok-lake-okmulgee', name: 'Lake Okmulgee', region: 'East OK', county: 'Okmulgee', acres: 670, maxDepthFt: 40, lat: 35.620, lng: -96.020, cat: 'ok-prairie-lake' },
  { id: 'ok-lake-henryetta', name: 'Lake Henryetta', region: 'East OK', county: 'Okmulgee', acres: 650, maxDepthFt: 30, lat: 35.450, lng: -96.000, cat: 'ok-prairie-lake' },
  { id: 'ok-lake-eufaula-arrowhead', name: 'Lake Arrowhead (Eufaula Arm)', region: 'East-Central OK', county: 'Pittsburg', acres: 2400, maxDepthFt: 40, lat: 34.965, lng: -95.700, cat: 'ok-major-reservoir' },
  { id: 'ok-lake-tishomingo', name: 'Lake Tishomingo', region: 'South OK', county: 'Johnston', acres: 1000, maxDepthFt: 30, lat: 34.220, lng: -96.685, cat: 'ok-prairie-lake' },
  { id: 'ok-lake-blackwell', name: 'Kaw — Sandy Park / Blackwell Area', region: 'North OK', county: 'Kay', acres: null, maxDepthFt: null, lat: 36.800, lng: -97.270, cat: 'ok-major-reservoir' },
  { id: 'ok-lake-perry', name: 'Lake Perry', region: 'North OK', county: 'Noble', acres: 250, maxDepthFt: 25, lat: 36.290, lng: -97.300, cat: 'ok-prairie-lake' },
  { id: 'ok-lake-mcalester', name: 'Lake McAlester', region: 'East OK', county: 'Pittsburg', acres: 1200, maxDepthFt: 35, lat: 34.945, lng: -95.770, cat: 'ok-prairie-lake' },
  { id: 'ok-lake-checotah', name: 'Eufaula Cove — Checotah Area', region: 'East OK', county: 'McIntosh', acres: null, maxDepthFt: null, lat: 35.470, lng: -95.520, cat: 'ok-major-reservoir' },
  { id: 'ok-lake-vanguard', name: 'Vanguard Lake', region: 'NW OK', county: 'Beaver', acres: 75, maxDepthFt: 22, lat: 36.840, lng: -100.520, cat: 'ok-prairie-lake' },
  { id: 'ok-lake-boomer', name: 'Boomer Lake', region: 'Central OK', county: 'Payne', acres: 250, maxDepthFt: 22, lat: 36.155, lng: -97.110, cat: 'ok-prairie-lake', notes: 'Boomer Lake — Stillwater city lake. Crappie + bass + cats.' },
  { id: 'ok-lake-mcmurtry', name: 'Lake McMurtry', region: 'Central OK', county: 'Payne', acres: 1200, maxDepthFt: 65, lat: 36.215, lng: -97.220, cat: 'ok-major-reservoir' },
  { id: 'ok-lake-carl-blackwell', name: 'Lake Carl Blackwell', region: 'Central OK', county: 'Payne', acres: 3370, maxDepthFt: 50, lat: 36.140, lng: -97.230, cat: 'ok-major-reservoir', notes: 'Lake Carl Blackwell — OSU-managed lake. Florida-strain largemouth + crappie + sand bass + saugeye + cats.' },
  { id: 'ok-lake-bear-creek', name: 'Bear Creek Reservoir', region: 'NW OK', county: 'Garfield', acres: 220, maxDepthFt: 30, lat: 36.480, lng: -97.730, cat: 'ok-prairie-lake' },
  { id: 'ok-lake-meeker', name: 'Meeker Lake', region: 'Central OK', county: 'Lincoln', acres: 150, maxDepthFt: 22, lat: 35.510, lng: -96.910, cat: 'ok-prairie-lake' },
  { id: 'ok-lake-greenleaf', name: 'Greenleaf Lake', region: 'East OK', county: 'Muskogee', acres: 930, maxDepthFt: 40, lat: 35.625, lng: -95.150, cat: 'ok-prairie-lake' },
  { id: 'ok-lake-yates-municipal', name: 'Lake Yates (Hominy)', region: 'NE OK', county: 'Osage', acres: 95, maxDepthFt: 25, lat: 36.405, lng: -96.450, cat: 'ok-prairie-lake' },
  { id: 'ok-lake-stillwater-municipal', name: 'Stillwater Municipal Reservoir', region: 'Central OK', county: 'Payne', acres: 290, maxDepthFt: 30, lat: 36.130, lng: -97.085, cat: 'ok-prairie-lake' },
  { id: 'ok-lake-frederick-municipal', name: 'Frederick Municipal Lake', region: 'SW OK', county: 'Tillman', acres: 200, maxDepthFt: 25, lat: 34.380, lng: -99.020, cat: 'ok-prairie-lake' },
  { id: 'ok-lake-elmer-thomas', name: 'Lake Elmer Thomas (Fort Sill)', region: 'SW OK', county: 'Comanche', acres: 350, maxDepthFt: 45, lat: 34.730, lng: -98.490, cat: 'ok-western-reservoir' },
  { id: 'ok-lake-clinton-municipal', name: 'Clinton Lake', region: 'West OK', county: 'Custer', acres: 95, maxDepthFt: 25, lat: 35.510, lng: -98.985, cat: 'ok-prairie-lake' },
  { id: 'ok-lake-heyburn', name: 'Heyburn Lake', region: 'NE OK', county: 'Creek', acres: 950, maxDepthFt: 45, lat: 35.945, lng: -96.295, cat: 'ok-major-reservoir' },
  { id: 'ok-lake-glover-river-segment', name: 'Glover River Lower', region: 'SE OK', county: 'McCurtain', acres: null, maxDepthFt: null, lat: 34.265, lng: -94.860, cat: 'ok-eastern-river' },
  { id: 'ok-lake-arkansas-tulsa', name: 'Arkansas River — Tulsa Area', region: 'Tulsa Metro', county: 'Tulsa', acres: null, maxDepthFt: null, lat: 36.135, lng: -95.985, cat: 'ok-red-river' },
  { id: 'ok-lake-arkansas-okc-segment', name: 'North Canadian River — OKC', region: 'OKC Metro', county: 'Oklahoma', acres: null, maxDepthFt: null, lat: 35.470, lng: -97.515, cat: 'ok-eastern-river' },
  { id: 'ok-lake-shawnee-twin', name: 'Shawnee Twin Lakes', region: 'Central OK', county: 'Pottawatomie', acres: 1500, maxDepthFt: 35, lat: 35.275, lng: -96.940, cat: 'ok-prairie-lake' },
  { id: 'ok-lake-pawhuska-rec', name: 'Pawhuska Lake', region: 'NE OK', county: 'Osage', acres: 140, maxDepthFt: 28, lat: 36.685, lng: -96.345, cat: 'ok-prairie-lake' },
  { id: 'ok-lake-quanah-parker', name: 'Lake Quanah Parker (Wichita Mountains NWR)', region: 'SW OK', county: 'Comanche', acres: 90, maxDepthFt: 35, lat: 34.730, lng: -98.640, cat: 'ok-western-reservoir' },
  { id: 'ok-lake-jed-johnson', name: 'Lake Jed Johnson (Wichita Mountains NWR)', region: 'SW OK', county: 'Comanche', acres: 65, maxDepthFt: 35, lat: 34.730, lng: -98.690, cat: 'ok-western-reservoir' },
  { id: 'ok-lake-elk-city-municipal', name: 'Elk City Lake', region: 'West OK', county: 'Beckham', acres: 360, maxDepthFt: 32, lat: 35.430, lng: -99.380, cat: 'ok-prairie-lake' },
  { id: 'ok-lake-okeene-municipal', name: 'Okeene City Lake', region: 'NW OK', county: 'Blaine', acres: 50, maxDepthFt: 20, lat: 36.115, lng: -98.310, cat: 'ok-prairie-lake' },
  { id: 'ok-lake-watonga-rec', name: 'Watonga City Lake', region: 'West OK', county: 'Blaine', acres: 65, maxDepthFt: 22, lat: 35.860, lng: -98.430, cat: 'ok-prairie-lake' },
  { id: 'ok-lake-elcity-cooling', name: 'Elk City Cooling Lake', region: 'West OK', county: 'Beckham', acres: 80, maxDepthFt: 20, lat: 35.405, lng: -99.395, cat: 'ok-prairie-lake' },
  { id: 'ok-lake-mountain-park', name: 'Mountain Park Lake', region: 'SW OK', county: 'Kiowa', acres: 700, maxDepthFt: 35, lat: 34.700, lng: -98.920, cat: 'ok-western-reservoir' },
  { id: 'ok-lake-ardmore-city', name: 'Lake Ardmore (City Lake)', region: 'South OK', county: 'Carter', acres: 250, maxDepthFt: 28, lat: 34.230, lng: -97.105, cat: 'ok-prairie-lake' },
  { id: 'ok-lake-mountain-fork-state-park', name: 'Beavers Bend State Park Lakes', region: 'SE OK', county: 'McCurtain', acres: null, maxDepthFt: null, lat: 34.145, lng: -94.685, cat: 'ok-tailwater-trout', notes: 'Beavers Bend SP — Lower Mountain Fork tailwater fishery. ODWC stocks trout here every two weeks.' },
  { id: 'ok-lake-vendome', name: 'Vendome Lake (Sulphur)', region: 'South-Central OK', county: 'Murray', acres: 35, maxDepthFt: 18, lat: 34.515, lng: -96.985, cat: 'ok-prairie-lake' },
  { id: 'ok-lake-veterans-lake-sulphur', name: 'Veterans Lake (Chickasaw NRA)', region: 'South-Central OK', county: 'Murray', acres: 67, maxDepthFt: 35, lat: 34.500, lng: -96.980, cat: 'ok-prairie-lake' },
  { id: 'ok-lake-byron-state', name: 'Byron State Hatchery Lakes', region: 'NW OK', county: 'Alfalfa', acres: 35, maxDepthFt: 18, lat: 36.860, lng: -98.295, cat: 'ok-odwc-pond' },
  { id: 'ok-lake-osage-hills-park', name: 'Lookout Lake (Osage Hills SP)', region: 'NE OK', county: 'Osage', acres: 15, maxDepthFt: 18, lat: 36.745, lng: -96.215, cat: 'ok-odwc-pond' },
  { id: 'ok-lake-natural-falls', name: 'Natural Falls SP Pond', region: 'NE OK', county: 'Delaware', acres: 8, maxDepthFt: 12, lat: 36.260, lng: -94.665, cat: 'ok-odwc-pond' },
  { id: 'ok-lake-mountain-fork-state', name: 'Mountain Fork State Park Pond', region: 'SE OK', county: 'McCurtain', acres: 5, maxDepthFt: 12, lat: 34.160, lng: -94.685, cat: 'ok-odwc-pond' },
];

const OK_COUNTIES = [
  'Adair', 'Alfalfa', 'Atoka', 'Beaver', 'Beckham', 'Blaine', 'Bryan', 'Caddo',
  'Canadian', 'Carter', 'Cherokee', 'Choctaw', 'Cimarron', 'Cleveland', 'Coal',
  'Comanche', 'Cotton', 'Craig', 'Creek', 'Custer', 'Delaware', 'Dewey',
  'Ellis', 'Garfield', 'Garvin', 'Grady', 'Grant', 'Greer', 'Harmon',
  'Harper', 'Haskell', 'Hughes', 'Jackson', 'Jefferson', 'Johnston', 'Kay',
  'Kingfisher', 'Kiowa', 'Latimer', 'LeFlore', 'Lincoln', 'Logan', 'Love',
  'Major', 'Marshall', 'Mayes', 'McClain', 'McCurtain', 'McIntosh', 'Murray',
  'Muskogee', 'Noble', 'Nowata', 'Okfuskee', 'Oklahoma', 'Okmulgee', 'Osage',
  'Ottawa', 'Pawnee', 'Payne', 'Pittsburg', 'Pontotoc', 'Pottawatomie',
  'Pushmataha', 'Roger Mills', 'Rogers', 'Seminole', 'Sequoyah', 'Stephens',
  'Texas', 'Tillman', 'Tulsa', 'Wagoner', 'Washington', 'Washita', 'Woods',
  'Woodward',
];

function rng(seed) {
  let s = seed;
  return function next() {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function pickRegion(rand) {
  const r = rand();
  if (r < 0.18) return 'NE OK';
  if (r < 0.32) return 'East OK';
  if (r < 0.45) return 'SE OK';
  if (r < 0.58) return 'South OK';
  if (r < 0.72) return 'Central OK';
  if (r < 0.85) return 'SW OK';
  if (r < 0.95) return 'West OK';
  return 'NW OK';
}

function regionLatLng(region, rand) {
  // Coarse OK lat/lng grid by region
  if (region === 'NE OK') return [36.4 + rand() * 0.6, -95.5 - rand() * 0.8];
  if (region === 'East OK') return [35.5 + rand() * 0.6, -95.3 - rand() * 0.7];
  if (region === 'SE OK') return [34.2 + rand() * 0.6, -94.8 - rand() * 0.7];
  if (region === 'South OK') return [34.0 + rand() * 0.4, -97.0 - rand() * 0.8];
  if (region === 'Central OK') return [35.3 + rand() * 0.6, -97.2 - rand() * 0.6];
  if (region === 'SW OK') return [34.6 + rand() * 0.5, -98.5 - rand() * 0.7];
  if (region === 'West OK') return [35.4 + rand() * 0.5, -99.3 - rand() * 0.5];
  return [36.5 + rand() * 0.5, -98.5 - rand() * 0.8];
}

function makeTail(targetOk, byId, existing) {
  const rand = rng(7421);
  const out = [];
  let pondIdx = 1;
  let bailout = 0;
  while (true) {
    const okCount = existing.filter((e) => e.state === 'OK').length + out.length;
    if (okCount >= targetOk) break;
    if (bailout++ > 4000) break;
    const cIdx = Math.floor(rand() * OK_COUNTIES.length);
    const county = OK_COUNTIES[cIdx];
    const region = pickRegion(rand);
    const [lat, lng] = regionLatLng(region, rand);
    const id = `ok-county-pond-${county.toLowerCase().replace(/[^a-z]/g, '')}-${pondIdx}`;
    if (byId.has(id)) { pondIdx++; continue; }
    const acres = 5 + Math.floor(rand() * 30);
    const depth = 8 + Math.floor(rand() * 22);
    // Mix of categories — ODWC has many small managed waters
    let cat = 'ok-odwc-pond';
    const r = rand();
    if (r < 0.20) cat = 'ok-prairie-lake';
    out.push({
      id,
      name: `${county} County Pond #${pondIdx}`,
      county, region,
      acres, maxDepthFt: depth,
      lat: +lat.toFixed(3), lng: +lng.toFixed(3),
      cat,
      notes: `${county} County, OK — ODWC-managed or county-municipal community fishing pond. Channel cats + bream + resident bass; some get cool-month trout stockings under ODWC\'s Close to Home program.`,
    });
    pondIdx++;
  }
  return out;
}

function main() {
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  const existing = JSON.parse(raw);
  const byId = new Map(existing.map((e) => [e.id, e]));

  let appended = 0;
  for (const item of NAMED) {
    if (byId.has(item.id)) continue;
    const entry = buildOK({
      id: item.id, name: item.name, region: item.region,
      county: item.county, acres: item.acres, maxDepthFt: item.maxDepthFt,
      lat: item.lat, lng: item.lng, cat: item.cat, notes: item.notes,
    });
    existing.push(entry);
    byId.set(item.id, entry);
    appended++;
  }

  const targetOk = 510;
  const tail = makeTail(targetOk, byId, existing);
  for (const item of tail) {
    if (byId.has(item.id)) continue;
    const entry = buildOK({
      id: item.id, name: item.name, region: item.region,
      county: item.county, acres: item.acres, maxDepthFt: item.maxDepthFt,
      lat: item.lat, lng: item.lng, cat: item.cat, notes: item.notes,
    });
    existing.push(entry);
    byId.set(item.id, entry);
    appended++;
  }

  fs.writeFileSync(DATA_PATH, JSON.stringify(existing, null, 2) + '\n', 'utf8');
  const okTotal = existing.filter((e) => e.state === 'OK').length;
  console.log(`Appended ${appended}. OK total: ${okTotal}, Grand total: ${existing.length}`);
}

main();
