// OK Vol 1 — Major Oklahoma reservoirs + the rivers/tailwaters that define OK's fishing identity.

const fs = require('fs');
const path = require('path');
const { buildOK } = require('./_ok-water-template.cjs');

const DATA_PATH = path.join(__dirname, '..', 'data', 'waterbodies.json');

const RAW = [
  // ============== MARQUEE OK RESERVOIRS ==============
  { id: 'ok-lake-texoma', name: 'Lake Texoma', region: 'South OK / TX border', county: 'Marshall / Bryan / Love', acres: 89000, maxDepthFt: 100, lat: 33.880, lng: -96.580, cat: 'ok-major-reservoir', notes: 'Lake Texoma — 89,000-acre OK/TX border reservoir on Red River. The premier inland striped bass fishery in America — natural reproduction (one of few inland lakes where it occurs). State-record blue catfish (98 lb), trophy largemouth, sand bass blitzes.' },
  { id: 'ok-lake-eufaula', name: 'Lake Eufaula', region: 'East-Central OK', county: 'McIntosh / Pittsburg / Haskell / Okmulgee', acres: 102000, maxDepthFt: 90, lat: 35.300, lng: -95.580, cat: 'ok-major-reservoir', notes: 'Lake Eufaula — OK\'s largest reservoir (102,000 acres). "Big Fish Eufaula" — trophy largemouth + striped bass + crappie + paddlefish. Multiple Bassmaster tournaments hosted here.' },
  { id: 'ok-lake-tenkiller', name: 'Lake Tenkiller (Tenkiller Ferry Lake)', region: 'East OK', county: 'Sequoyah / Cherokee', acres: 12900, maxDepthFt: 165, lat: 35.625, lng: -95.020, cat: 'ok-ouachita-lake', notes: 'Tenkiller — "Heaven in the Hills." 12,900-acre clear deep lake. Trophy striped bass (state record class), Florida-strain largemouth, smallmouth, walleye, white bass.' },
  { id: 'ok-lake-grand', name: 'Grand Lake of the Cherokees', region: 'NE OK', county: 'Delaware / Mayes / Craig / Ottawa', acres: 46500, maxDepthFt: 144, lat: 36.580, lng: -95.030, cat: 'ok-major-reservoir', notes: 'Grand Lake — 46,500 acres on the Grand (Neosho) River. World-class crappie + spoonbill (paddlefish) + striper + largemouth. Hosts multiple Bassmaster Classics.' },
  { id: 'ok-lake-keystone', name: 'Lake Keystone', region: 'NE OK', county: 'Pawnee / Creek / Osage / Tulsa', acres: 26300, maxDepthFt: 110, lat: 36.150, lng: -96.250, cat: 'ok-major-reservoir', notes: 'Lake Keystone — 26,300 acres on the Cimarron + Arkansas rivers. Premier striped bass + paddlefish + sand bass fishery. Tulsa\'s home lake.' },
  { id: 'ok-lake-broken-bow', name: 'Broken Bow Lake', region: 'SE OK', county: 'McCurtain', acres: 14000, maxDepthFt: 185, lat: 34.140, lng: -94.715, cat: 'ok-ouachita-lake', notes: 'Broken Bow Lake — 14,000-acre crystal-clear Ouachita Mountain reservoir. Florida-strain largemouth + striped bass + walleye + spotted bass. Beauty + trophy potential combine.' },
  { id: 'ok-lake-skiatook', name: 'Lake Skiatook', region: 'NE OK', county: 'Osage / Tulsa', acres: 10500, maxDepthFt: 130, lat: 36.380, lng: -96.140, cat: 'ok-major-reservoir', notes: 'Lake Skiatook — 10,500-acre clear deep reservoir. Trophy striper + smallmouth + walleye + spotted bass. Less-pressured than Grand.' },
  { id: 'ok-lake-hudson', name: 'Lake Hudson (Markham Ferry Reservoir)', region: 'NE OK', county: 'Mayes', acres: 12000, maxDepthFt: 100, lat: 36.300, lng: -95.180, cat: 'ok-major-reservoir', notes: 'Lake Hudson — 12,000 acres on the Grand River below Grand Lake. Paddlefish snagging mecca; striped bass + walleye + sand bass.' },
  { id: 'ok-lake-fort-gibson', name: 'Fort Gibson Lake', region: 'NE OK', county: 'Cherokee / Wagoner / Mayes', acres: 19900, maxDepthFt: 75, lat: 35.910, lng: -95.250, cat: 'ok-major-reservoir', notes: 'Fort Gibson Lake — 19,900 acres on the Grand River. Crappie + sand bass + striped bass + paddlefish.' },
  { id: 'ok-lake-oologah', name: 'Lake Oologah', region: 'NE OK', county: 'Rogers / Nowata', acres: 29500, maxDepthFt: 75, lat: 36.450, lng: -95.700, cat: 'ok-major-reservoir', notes: 'Oologah Lake — 29,500 acres on the Verdigris River. Trophy striper + sand bass + crappie + walleye.' },
  { id: 'ok-lake-kerr', name: 'Robert S. Kerr Reservoir', region: 'East OK', county: 'LeFlore / Sequoyah / Haskell', acres: 42000, maxDepthFt: 65, lat: 35.350, lng: -95.000, cat: 'ok-major-reservoir', notes: 'R.S. Kerr — 42,000-acre Arkansas River reservoir. Stripers, white bass, blues, paddlefish.' },
  { id: 'ok-lake-webbers-falls', name: 'Webbers Falls Reservoir', region: 'East OK', county: 'Muskogee', acres: 11600, maxDepthFt: 50, lat: 35.560, lng: -95.105, cat: 'ok-major-reservoir' },
  { id: 'ok-lake-mcgee-creek', name: 'McGee Creek Reservoir', region: 'SE OK', county: 'Atoka', acres: 3800, maxDepthFt: 132, lat: 34.330, lng: -95.825, cat: 'ok-ouachita-lake', notes: 'McGee Creek — clear deep lake. Trophy largemouth (Florida-strain) + walleye + striped bass + crappie.' },
  { id: 'ok-lake-sardis', name: 'Sardis Lake', region: 'SE OK', county: 'Pushmataha / Latimer', acres: 13600, maxDepthFt: 80, lat: 34.620, lng: -95.350, cat: 'ok-ouachita-lake', notes: 'Sardis Lake — 13,600-acre clear deep SE OK reservoir. Walleye fishery (ODWC stocked) plus trophy largemouth, striped bass.' },
  { id: 'ok-lake-pine-creek', name: 'Pine Creek Lake', region: 'SE OK', county: 'McCurtain', acres: 3800, maxDepthFt: 100, lat: 34.115, lng: -95.085, cat: 'ok-ouachita-lake' },
  { id: 'ok-lake-hugo', name: 'Hugo Lake', region: 'SE OK', county: 'Choctaw', acres: 13250, maxDepthFt: 50, lat: 34.020, lng: -95.385, cat: 'ok-major-reservoir', notes: 'Hugo Lake — 13,250 acres. Crappie + largemouth + striped bass + catfish + paddlefish.' },
  { id: 'ok-lake-wister', name: 'Wister Lake', region: 'SE OK', county: 'LeFlore', acres: 7300, maxDepthFt: 50, lat: 34.910, lng: -94.700, cat: 'ok-ouachita-lake' },
  { id: 'ok-lake-arbuckle', name: 'Lake of the Arbuckles', region: 'South-Central OK', county: 'Murray', acres: 2400, maxDepthFt: 90, lat: 34.430, lng: -97.020, cat: 'ok-ouachita-lake' },
  { id: 'ok-lake-murray', name: 'Lake Murray', region: 'South-Central OK', county: 'Carter / Love', acres: 5700, maxDepthFt: 95, lat: 34.075, lng: -97.060, cat: 'ok-ouachita-lake', notes: 'Lake Murray — Lake Murray State Park lake. Largemouth + crappie + striped bass + bream + cats.' },
  { id: 'ok-lake-thunderbird', name: 'Lake Thunderbird', region: 'Central OK', county: 'Cleveland', acres: 6070, maxDepthFt: 60, lat: 35.230, lng: -97.260, cat: 'ok-major-reservoir', notes: 'Lake Thunderbird — Norman/OKC metro lake. White bass + hybrid striper + saugeye + largemouth + cats.' },
  { id: 'ok-lake-arcadia', name: 'Arcadia Lake', region: 'Central OK', county: 'Oklahoma', acres: 1800, maxDepthFt: 70, lat: 35.660, lng: -97.350, cat: 'ok-major-reservoir' },
  { id: 'ok-lake-overholser', name: 'Lake Overholser', region: 'OKC Metro', county: 'Oklahoma / Canadian', acres: 1500, maxDepthFt: 32, lat: 35.495, lng: -97.660, cat: 'ok-major-reservoir', notes: 'Lake Overholser — OKC city lake. Crappie + sand bass + cats + saugeye.' },
  { id: 'ok-lake-stanley-draper', name: 'Stanley Draper Lake', region: 'OKC Metro', county: 'Oklahoma', acres: 2900, maxDepthFt: 75, lat: 35.330, lng: -97.430, cat: 'ok-major-reservoir' },
  { id: 'ok-lake-konawa', name: 'Konawa Lake', region: 'South-Central OK', county: 'Seminole', acres: 1300, maxDepthFt: 35, lat: 34.965, lng: -96.755, cat: 'ok-major-reservoir', notes: 'Konawa Lake — power-plant cooling lake; hot-water discharge concentrates fish. Florida-strain largemouth trophy potential.' },
  { id: 'ok-lake-sooner', name: 'Sooner Lake', region: 'North OK', county: 'Noble / Pawnee', acres: 5400, maxDepthFt: 85, lat: 36.435, lng: -96.945, cat: 'ok-major-reservoir', notes: 'Sooner Lake — OG&E power-plant cooling lake. Hybrid striped bass, sand bass, saugeye, largemouth, channel cats.' },
  { id: 'ok-lake-kaw', name: 'Kaw Lake', region: 'North OK', county: 'Kay / Osage', acres: 17000, maxDepthFt: 60, lat: 36.770, lng: -96.940, cat: 'ok-major-reservoir', notes: 'Kaw Lake — 17,000 acres on the Arkansas River. Striped bass + sand bass + walleye + paddlefish + trophy blue cats.' },
  { id: 'ok-lake-fort-cobb', name: 'Fort Cobb Reservoir', region: 'SW OK', county: 'Caddo', acres: 4100, maxDepthFt: 50, lat: 35.165, lng: -98.470, cat: 'ok-western-reservoir', notes: 'Fort Cobb — 4,100 acres SW OK. Walleye fishery (ODWC), sand bass, hybrid striper, channel cats.' },
  { id: 'ok-lake-foss', name: 'Foss Reservoir', region: 'West OK', county: 'Custer', acres: 8800, maxDepthFt: 55, lat: 35.555, lng: -99.180, cat: 'ok-western-reservoir', notes: 'Foss Lake — 8,800 acres west OK. Walleye + saugeye + sand bass + striped bass + cats.' },
  { id: 'ok-lake-altus-lugert', name: 'Altus-Lugert Reservoir', region: 'SW OK', county: 'Kiowa / Greer', acres: 6200, maxDepthFt: 80, lat: 34.880, lng: -99.290, cat: 'ok-western-reservoir' },
  { id: 'ok-lake-tom-steed', name: 'Tom Steed Reservoir', region: 'SW OK', county: 'Kiowa', acres: 6400, maxDepthFt: 65, lat: 34.730, lng: -98.985, cat: 'ok-western-reservoir', notes: 'Tom Steed — SW OK reservoir. Saugeye + crappie + sand bass + hybrid striper + cats.' },
  { id: 'ok-lake-ellsworth', name: 'Lake Ellsworth', region: 'SW OK', county: 'Comanche', acres: 5600, maxDepthFt: 75, lat: 34.770, lng: -98.380, cat: 'ok-western-reservoir' },
  { id: 'ok-lake-lawtonka', name: 'Lake Lawtonka', region: 'SW OK', county: 'Comanche', acres: 1900, maxDepthFt: 65, lat: 34.745, lng: -98.495, cat: 'ok-western-reservoir' },
  { id: 'ok-lake-waurika', name: 'Waurika Lake', region: 'South OK', county: 'Jefferson / Stephens', acres: 10100, maxDepthFt: 60, lat: 34.235, lng: -97.985, cat: 'ok-western-reservoir', notes: 'Waurika — south OK reservoir. Sand bass + hybrid striper + crappie + cats. Mid-spring sand bass run is a tradition.' },
  { id: 'ok-lake-canton', name: 'Canton Lake', region: 'NW OK', county: 'Blaine / Dewey', acres: 7900, maxDepthFt: 50, lat: 36.090, lng: -98.605, cat: 'ok-western-reservoir', notes: 'Canton Lake — NW OK. Walleye + saugeye + crappie + striped bass + cats. ODWC walleye stocking is the headline.' },
  { id: 'ok-lake-great-salt-plains', name: 'Great Salt Plains Lake', region: 'NW OK', county: 'Alfalfa', acres: 9300, maxDepthFt: 25, lat: 36.755, lng: -98.235, cat: 'ok-western-reservoir' },
  { id: 'ok-lake-fort-supply', name: 'Fort Supply Lake', region: 'NW OK', county: 'Woodward', acres: 1800, maxDepthFt: 30, lat: 36.580, lng: -99.580, cat: 'ok-western-reservoir' },
  { id: 'ok-lake-american-horse', name: 'American Horse Lake', region: 'West OK', county: 'Blaine', acres: 100, maxDepthFt: 30, lat: 35.745, lng: -98.510, cat: 'ok-prairie-lake' },
  { id: 'ok-lake-watonga', name: 'Lake Watonga (Roman Nose SP)', region: 'West OK', county: 'Blaine', acres: 55, maxDepthFt: 35, lat: 36.075, lng: -98.430, cat: 'ok-tailwater-trout', notes: 'Lake Watonga — Roman Nose SP. Stocked rainbow trout in cool months (Nov–Mar). Bass + bream + cats year-round.' },

  // ============== RIVERS & TAILWATERS ==============
  { id: 'ok-river-illinois', name: 'Illinois River (Scenic)', region: 'NE OK', county: 'Adair / Cherokee', acres: null, maxDepthFt: null, lat: 35.910, lng: -94.940, cat: 'ok-eastern-river', notes: 'Illinois River — OK\'s most-famous scenic float river. World-class wild smallmouth, spotted bass, longear sunfish. Tahlequah area.' },
  { id: 'ok-river-mountain-fork-lower', name: 'Lower Mountain Fork (Trout Tailwater)', region: 'SE OK', county: 'McCurtain', acres: null, maxDepthFt: null, lat: 34.140, lng: -94.700, cat: 'ok-tailwater-trout', notes: 'Lower Mountain Fork — below Broken Bow Dam. OK\'s only year-round trout fishery with reproducing brown trout. Designated "Special Trout Area." World-class.' },
  { id: 'ok-river-mountain-fork-upper', name: 'Upper Mountain Fork', region: 'SE OK', county: 'McCurtain', acres: null, maxDepthFt: null, lat: 34.220, lng: -94.700, cat: 'ok-eastern-river' },
  { id: 'ok-river-glover', name: 'Glover River', region: 'SE OK', county: 'McCurtain', acres: null, maxDepthFt: null, lat: 34.330, lng: -94.890, cat: 'ok-eastern-river', notes: 'Glover River — OK\'s last undammed river (and one of the cleanest in the country). Wild smallmouth + spotted bass + redear sunfish. Float-trip gem.' },
  { id: 'ok-river-kiamichi', name: 'Kiamichi River', region: 'SE OK', county: 'Pushmataha / Choctaw', acres: null, maxDepthFt: null, lat: 34.385, lng: -95.215, cat: 'ok-eastern-river' },
  { id: 'ok-river-blue', name: 'Blue River (Trout)', region: 'South-Central OK', county: 'Johnston', acres: null, maxDepthFt: null, lat: 34.215, lng: -96.535, cat: 'ok-tailwater-trout', notes: 'Blue River — winter trout fishery (Nov–Mar). ODWC stocks rainbow trout in cool months. Small spring-fed stream.' },
  { id: 'ok-river-arkansas-keystone-tailwater', name: 'Arkansas River — Keystone Tailwater', region: 'NE OK', county: 'Tulsa / Creek', acres: null, maxDepthFt: null, lat: 36.080, lng: -96.250, cat: 'ok-red-river', notes: 'Arkansas River below Keystone Dam — paddlefish snagging mecca during spring run. Also striper + sand bass + trophy blue catfish.' },
  { id: 'ok-river-grand-twin-bridges', name: 'Grand (Neosho) River — Twin Bridges', region: 'NE OK', county: 'Mayes', acres: null, maxDepthFt: null, lat: 36.580, lng: -94.985, cat: 'ok-red-river', notes: 'Grand River below Lake Hudson dam at Twin Bridges — premier OK paddlefish snagging. Spring run draws thousands.' },
  { id: 'ok-river-red-system', name: 'Red River (OK Border)', region: 'South OK', county: 'Multi-county', acres: null, maxDepthFt: null, lat: 33.880, lng: -97.000, cat: 'ok-red-river', notes: 'Red River — TX/OK border river. Trophy blue catfish + alligator gar + striped bass + paddlefish. Native fishery.' },
  { id: 'ok-river-canadian', name: 'Canadian River', region: 'Central / SE OK', county: 'Multi-county', acres: null, maxDepthFt: null, lat: 35.300, lng: -96.500, cat: 'ok-eastern-river' },
  { id: 'ok-river-deep-fork', name: 'Deep Fork River', region: 'East OK', county: 'Okmulgee / Hughes', acres: null, maxDepthFt: null, lat: 35.620, lng: -96.310, cat: 'ok-eastern-river' },
  { id: 'ok-river-cimarron', name: 'Cimarron River', region: 'West/Central OK', county: 'Multi-county', acres: null, maxDepthFt: null, lat: 36.130, lng: -97.380, cat: 'ok-eastern-river' },
  { id: 'ok-river-washita', name: 'Washita River', region: 'West/SC OK', county: 'Multi-county', acres: null, maxDepthFt: null, lat: 34.945, lng: -97.000, cat: 'ok-eastern-river' },
  { id: 'ok-river-verdigris', name: 'Verdigris River', region: 'NE OK', county: 'Multi-county', acres: null, maxDepthFt: null, lat: 36.190, lng: -95.620, cat: 'ok-eastern-river' },
  { id: 'ok-river-baron-fork', name: 'Baron Fork', region: 'NE OK', county: 'Cherokee / Adair', acres: null, maxDepthFt: null, lat: 35.870, lng: -94.730, cat: 'ok-eastern-river', notes: 'Baron Fork — Illinois River tributary. Wild smallmouth + spotted bass. Scenic.' },
  { id: 'ok-river-flint-creek', name: 'Flint Creek', region: 'NE OK', county: 'Adair', acres: null, maxDepthFt: null, lat: 35.920, lng: -94.620, cat: 'ok-eastern-river' },
  { id: 'ok-river-sallisaw-creek', name: 'Sallisaw Creek', region: 'East OK', county: 'Sequoyah', acres: null, maxDepthFt: null, lat: 35.470, lng: -94.815, cat: 'ok-eastern-river' },
  { id: 'ok-river-spring-creek-mayes', name: 'Spring Creek (Mayes)', region: 'NE OK', county: 'Mayes', acres: null, maxDepthFt: null, lat: 36.395, lng: -94.985, cat: 'ok-eastern-river' },
  { id: 'ok-river-buffalo-creek', name: 'Buffalo Creek', region: 'NE OK', county: 'Delaware', acres: null, maxDepthFt: null, lat: 36.470, lng: -94.745, cat: 'ok-eastern-river' },
];

function main() {
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  const existing = JSON.parse(raw);
  const byId = new Map(existing.map((e) => [e.id, e]));

  let appended = 0, skipped = 0;
  for (const item of RAW) {
    if (byId.has(item.id)) { skipped++; continue; }
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
  console.log(`Appended ${appended}, skipped ${skipped}. OK total: ${okTotal}, Grand total: ${existing.length}`);
}

main();
