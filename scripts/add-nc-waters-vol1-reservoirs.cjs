// NC Vol 1 — Catawba chain + Yadkin chain + Piedmont + Sandhills reservoirs.

const fs = require('fs');
const path = require('path');
const { buildNC } = require('./_nc-water-template.cjs');

const DATA_PATH = path.join(__dirname, '..', 'data', 'waterbodies.json');

const RAW = [
  // ============== CATAWBA CHAIN ==============
  { id: 'nc-lake-norman', name: 'Lake Norman', region: 'Piedmont NC', county: 'Iredell / Mecklenburg / Lincoln / Catawba', acres: 32475, maxDepthFt: 130, lat: 35.555, lng: -80.940, cat: 'nc-catawba-reservoir', notes: 'Lake Norman — NC\'s largest manmade lake (32,475 acres). Trophy striper destination, spotted bass tournament water, largemouth + crappie + catfish. Charlotte area\'s home lake. Marshall Steam Plant hot discharge concentrates winter fish.' },
  { id: 'nc-lake-wylie', name: 'Lake Wylie', region: 'Piedmont NC/SC border', county: 'Gaston / Mecklenburg', acres: 13400, maxDepthFt: 105, lat: 35.165, lng: -81.060, cat: 'nc-catawba-reservoir', notes: 'Lake Wylie — Catawba chain. Striper + spotted bass + largemouth + crappie. Allen Steam Station discharge zone.' },
  { id: 'nc-lake-mountain-island', name: 'Mountain Island Lake', region: 'Piedmont NC', county: 'Mecklenburg / Gaston / Lincoln', acres: 3235, maxDepthFt: 75, lat: 35.330, lng: -80.985, cat: 'nc-catawba-reservoir', notes: 'Mountain Island Lake — between Norman and Wylie on the Catawba. Charlotte\'s drinking water source — limited motor use in some areas. Quality bass + crappie.' },
  { id: 'nc-lake-james', name: 'Lake James', region: 'NC Foothills', county: 'Burke / McDowell', acres: 6510, maxDepthFt: 165, lat: 35.755, lng: -81.910, cat: 'nc-catawba-reservoir', notes: 'Lake James — uppermost Catawba reservoir. Clear deep mountain-foothills lake. Trophy walleye + smallmouth + striper + spotted bass + largemouth. Less-pressured than Norman.' },
  { id: 'nc-lake-hickory', name: 'Lake Hickory', region: 'Piedmont NC', county: 'Catawba / Alexander / Burke / Caldwell', acres: 4220, maxDepthFt: 80, lat: 35.760, lng: -81.345, cat: 'nc-catawba-reservoir' },
  { id: 'nc-lake-rhodhiss', name: 'Lake Rhodhiss', region: 'Piedmont NC', county: 'Caldwell / Burke', acres: 3060, maxDepthFt: 60, lat: 35.770, lng: -81.535, cat: 'nc-catawba-reservoir' },
  { id: 'nc-lake-lookout-shoals', name: 'Lookout Shoals Lake', region: 'Piedmont NC', county: 'Catawba / Alexander / Iredell', acres: 1305, maxDepthFt: 40, lat: 35.770, lng: -81.080, cat: 'nc-catawba-reservoir' },

  // ============== YADKIN CHAIN ==============
  { id: 'nc-lake-high-rock', name: 'High Rock Lake', region: 'Piedmont NC', county: 'Davidson / Rowan', acres: 15180, maxDepthFt: 60, lat: 35.595, lng: -80.260, cat: 'nc-yadkin-reservoir', notes: 'High Rock Lake — second-largest NC lake. Trophy largemouth + striper + crappie + cats. Bassmaster tournament water — produced 8+ lb tournament limits.' },
  { id: 'nc-lake-tuckertown', name: 'Tuckertown Lake', region: 'Piedmont NC', county: 'Davidson / Stanly / Montgomery', acres: 2560, maxDepthFt: 50, lat: 35.530, lng: -80.155, cat: 'nc-yadkin-reservoir' },
  { id: 'nc-lake-badin', name: 'Badin Lake', region: 'Piedmont NC', county: 'Stanly / Montgomery', acres: 5350, maxDepthFt: 190, lat: 35.420, lng: -80.110, cat: 'nc-yadkin-reservoir', notes: 'Badin Lake — clear deep Yadkin chain reservoir. Smallmouth + spotted bass + walleye + striper.' },
  { id: 'nc-lake-tillery', name: 'Lake Tillery', region: 'Piedmont NC', county: 'Montgomery / Stanly / Anson', acres: 5260, maxDepthFt: 80, lat: 35.225, lng: -80.075, cat: 'nc-yadkin-reservoir', notes: 'Lake Tillery — 26-mile-long Yadkin chain reservoir. Trophy striped bass + largemouth + crappie + catfish.' },
  { id: 'nc-lake-blewett-falls', name: 'Blewett Falls Lake', region: 'Piedmont NC', county: 'Anson / Richmond', acres: 2560, maxDepthFt: 35, lat: 34.985, lng: -79.870, cat: 'nc-yadkin-reservoir', notes: 'Blewett Falls — lowermost Yadkin chain lake. Catfish + crappie + bass.' },
  { id: 'nc-lake-w-kerr-scott', name: 'W. Kerr Scott Reservoir', region: 'NC Foothills', county: 'Wilkes', acres: 1475, maxDepthFt: 100, lat: 36.135, lng: -81.235, cat: 'nc-yadkin-reservoir', notes: 'W. Kerr Scott — upper Yadkin tributary reservoir. Walleye, white bass, largemouth + crappie + catfish.' },

  // ============== PIEDMONT RESERVOIRS ==============
  { id: 'nc-lake-jordan', name: 'Jordan Lake (B. Everett Jordan)', region: 'Piedmont NC', county: 'Chatham', acres: 13900, maxDepthFt: 70, lat: 35.715, lng: -79.030, cat: 'nc-piedmont-reservoir', notes: 'Jordan Lake — 13,900-acre Triangle-area reservoir. Largemouth + crappie + striper + cats. Heavy fishing pressure, productive.' },
  { id: 'nc-lake-falls', name: 'Falls Lake', region: 'Piedmont NC', county: 'Wake / Durham / Granville', acres: 12410, maxDepthFt: 50, lat: 36.025, lng: -78.690, cat: 'nc-piedmont-reservoir', notes: 'Falls Lake — Raleigh-Durham metro reservoir. Crappie + largemouth + cats + sand bass + hybrid striper.' },
  { id: 'nc-lake-kerr', name: 'John H. Kerr Reservoir (Buggs Island)', region: 'NC/VA border', county: 'Vance / Warren / Granville', acres: 50000, maxDepthFt: 100, lat: 36.580, lng: -78.300, cat: 'nc-yadkin-reservoir', notes: 'Buggs Island / Kerr Reservoir — 50,000 acres on NC/VA border. Trophy striper + crappie + largemouth + cats. Largest reservoir on the Atlantic Coast.' },
  { id: 'nc-lake-gaston', name: 'Lake Gaston', region: 'NC/VA border', county: 'Warren / Halifax / Northampton', acres: 20000, maxDepthFt: 120, lat: 36.555, lng: -77.870, cat: 'nc-yadkin-reservoir', notes: 'Lake Gaston — 20,000 acres NC/VA border. Trophy striper + largemouth + spotted bass + crappie + cats.' },
  { id: 'nc-lake-hyco', name: 'Hyco Lake', region: 'Piedmont NC', county: 'Person / Caswell', acres: 3750, maxDepthFt: 70, lat: 36.490, lng: -79.060, cat: 'nc-piedmont-reservoir', notes: 'Hyco Lake — power-plant cooling lake. Trophy largemouth (Florida-strain), hybrid striper, crappie. Hot-water discharge concentrates winter fish.' },
  { id: 'nc-lake-mayo', name: 'Mayo Lake', region: 'Piedmont NC', county: 'Person', acres: 2800, maxDepthFt: 60, lat: 36.520, lng: -78.880, cat: 'nc-piedmont-reservoir', notes: 'Mayo Lake — Duke Energy cooling lake. Hybrid striper + Florida-strain bass + crappie + cats.' },
  { id: 'nc-lake-belews', name: 'Belews Lake', region: 'Piedmont NC', county: 'Stokes / Rockingham / Forsyth', acres: 3850, maxDepthFt: 90, lat: 36.290, lng: -80.080, cat: 'nc-piedmont-reservoir', notes: 'Belews Lake — Duke Energy cooling lake. Spotted bass + hybrid striper + walleye + crappie. Clear deep water.' },
  { id: 'nc-lake-sutton', name: 'Sutton Lake', region: 'Coastal Plain NC', county: 'New Hanover', acres: 1100, maxDepthFt: 35, lat: 34.290, lng: -77.985, cat: 'nc-piedmont-reservoir', notes: 'Sutton Lake — Wilmington area cooling lake. Trophy Florida-strain bass.' },
  { id: 'nc-lake-cane-creek', name: 'Cane Creek Reservoir', region: 'Piedmont NC', county: 'Orange', acres: 500, maxDepthFt: 40, lat: 35.985, lng: -79.220, cat: 'nc-piedmont-reservoir' },
  { id: 'nc-lake-lake-michie', name: 'Lake Michie', region: 'Piedmont NC', county: 'Durham', acres: 480, maxDepthFt: 60, lat: 36.155, lng: -78.890, cat: 'nc-piedmont-reservoir' },
  { id: 'nc-lake-rhodes-pond', name: 'Rhodes Pond', region: 'Coastal Plain NC', county: 'Cumberland', acres: 215, maxDepthFt: 18, lat: 35.115, lng: -78.585, cat: 'nc-piedmont-reservoir' },
  { id: 'nc-lake-jordan-supp-haw-river', name: 'Jordan Lake — Haw River Arm', region: 'Piedmont NC', county: 'Chatham', acres: null, maxDepthFt: null, lat: 35.745, lng: -79.110, cat: 'nc-piedmont-reservoir' },
  { id: 'nc-lake-falls-supp-rolesville', name: 'Falls Lake — Rolesville Arm', region: 'Piedmont NC', county: 'Wake', acres: null, maxDepthFt: null, lat: 35.910, lng: -78.555, cat: 'nc-piedmont-reservoir' },
  { id: 'nc-lake-randleman-reservoir', name: 'Randleman Reservoir', region: 'Piedmont NC', county: 'Randolph / Guilford', acres: 3007, maxDepthFt: 70, lat: 35.870, lng: -79.870, cat: 'nc-piedmont-reservoir', notes: 'Randleman Reservoir — Triad area; Florida-strain largemouth + crappie + hybrid striper.' },
  { id: 'nc-lake-cammack', name: 'Lake Cammack', region: 'Piedmont NC', county: 'Alamance', acres: 425, maxDepthFt: 35, lat: 36.130, lng: -79.510, cat: 'nc-piedmont-reservoir' },
  { id: 'nc-lake-mackintosh', name: 'Lake Mackintosh', region: 'Piedmont NC', county: 'Alamance', acres: 1100, maxDepthFt: 40, lat: 36.070, lng: -79.495, cat: 'nc-piedmont-reservoir' },
  { id: 'nc-lake-rotary', name: 'Lake Rotary', region: 'Piedmont NC', county: 'Forsyth', acres: 75, maxDepthFt: 25, lat: 36.105, lng: -80.380, cat: 'nc-piedmont-reservoir' },
  { id: 'nc-lake-salem', name: 'Salem Lake', region: 'Piedmont NC', county: 'Forsyth', acres: 365, maxDepthFt: 50, lat: 36.080, lng: -80.180, cat: 'nc-piedmont-reservoir' },
  { id: 'nc-lake-thom-a-lex', name: 'Lake Thom-A-Lex', region: 'Piedmont NC', county: 'Davidson', acres: 600, maxDepthFt: 50, lat: 35.870, lng: -80.300, cat: 'nc-piedmont-reservoir' },
  { id: 'nc-lake-higgins', name: 'Lake Higgins', region: 'Piedmont NC', county: 'Guilford', acres: 230, maxDepthFt: 25, lat: 36.165, lng: -79.890, cat: 'nc-piedmont-reservoir' },
  { id: 'nc-lake-brandt', name: 'Lake Brandt', region: 'Piedmont NC', county: 'Guilford', acres: 815, maxDepthFt: 40, lat: 36.155, lng: -79.840, cat: 'nc-piedmont-reservoir' },
  { id: 'nc-lake-townsend', name: 'Lake Townsend', region: 'Piedmont NC', county: 'Guilford', acres: 1542, maxDepthFt: 55, lat: 36.165, lng: -79.785, cat: 'nc-piedmont-reservoir' },
  { id: 'nc-lake-jeanette', name: 'Lake Jeanette', region: 'Piedmont NC', county: 'Guilford', acres: 90, maxDepthFt: 30, lat: 36.155, lng: -79.760, cat: 'nc-piedmont-reservoir' },
  { id: 'nc-lake-oak-hollow', name: 'Oak Hollow Lake', region: 'Piedmont NC', county: 'Guilford', acres: 800, maxDepthFt: 50, lat: 36.020, lng: -80.025, cat: 'nc-piedmont-reservoir' },
  { id: 'nc-lake-city-lake-high-point', name: 'City Lake (High Point)', region: 'Piedmont NC', county: 'Guilford / Davidson', acres: 350, maxDepthFt: 30, lat: 35.985, lng: -80.025, cat: 'nc-piedmont-reservoir' },
  { id: 'nc-lake-lake-junaluska', name: 'Lake Junaluska', region: 'NC Mountains', county: 'Haywood', acres: 200, maxDepthFt: 40, lat: 35.530, lng: -82.985, cat: 'nc-piedmont-reservoir' },
  { id: 'nc-lake-lake-julian', name: 'Lake Julian', region: 'NC Mountains', county: 'Buncombe', acres: 300, maxDepthFt: 35, lat: 35.480, lng: -82.530, cat: 'nc-piedmont-reservoir', notes: 'Lake Julian — Asheville-area Duke Energy cooling lake. Stocked tilapia + bass + bream + cats.' },
  { id: 'nc-lake-lake-anne', name: 'Lake Anne', region: 'Piedmont NC', county: 'Vance', acres: 320, maxDepthFt: 40, lat: 36.330, lng: -78.420, cat: 'nc-piedmont-reservoir' },
  { id: 'nc-lake-lake-tabor', name: 'Lake Tabor', region: 'Coastal Plain NC', county: 'Columbus', acres: 220, maxDepthFt: 25, lat: 34.155, lng: -78.880, cat: 'nc-pocosin-lake' },
  { id: 'nc-lake-bay-tree', name: 'Bay Tree Lake (Bay Tree Lake SP)', region: 'Coastal Plain NC', county: 'Bladen', acres: 1500, maxDepthFt: 16, lat: 34.640, lng: -78.560, cat: 'nc-pocosin-lake', notes: 'Bay Tree Lake — Bladen County natural lake. Pocosin / Carolina bay character — tannic, cypress-lined.' },
  { id: 'nc-lake-singletary', name: 'Singletary Lake', region: 'Coastal Plain NC', county: 'Bladen', acres: 572, maxDepthFt: 12, lat: 34.585, lng: -78.450, cat: 'nc-pocosin-lake' },
  { id: 'nc-lake-jones', name: 'Jones Lake (Jones Lake SP)', region: 'Coastal Plain NC', county: 'Bladen', acres: 224, maxDepthFt: 8, lat: 34.690, lng: -78.610, cat: 'nc-pocosin-lake' },
  { id: 'nc-lake-salters-lake', name: 'Salters Lake', region: 'Coastal Plain NC', county: 'Bladen', acres: 315, maxDepthFt: 12, lat: 34.680, lng: -78.560, cat: 'nc-pocosin-lake' },
  { id: 'nc-lake-white-lake-bladen', name: 'White Lake', region: 'Coastal Plain NC', county: 'Bladen', acres: 1068, maxDepthFt: 20, lat: 34.640, lng: -78.490, cat: 'nc-pocosin-lake', notes: 'White Lake — famous clear-water Carolina bay (one of few clear-water bays). Quality bream + bass.' },

  // ============== TVA NC RESERVOIRS ==============
  { id: 'nc-lake-fontana-nc', name: 'Fontana Lake', region: 'NC Mountains', county: 'Graham / Swain', acres: 10230, maxDepthFt: 440, lat: 35.435, lng: -83.770, cat: 'nc-tva-reservoir-nc', notes: 'Fontana Lake — TVA reservoir in deep Smokies mountains. Trophy walleye + smallmouth + spotted bass + stocked striper + lake trout. The deepest reservoir in the Southeast.' },
  { id: 'nc-lake-hiwassee-nc', name: 'Hiwassee Lake', region: 'NC Mountains', county: 'Cherokee', acres: 6090, maxDepthFt: 270, lat: 35.115, lng: -84.110, cat: 'nc-tva-reservoir-nc', notes: 'Hiwassee Lake — far-west NC TVA reservoir. Smallmouth + walleye + spotted bass + striper.' },
  { id: 'nc-lake-nantahala', name: 'Nantahala Lake', region: 'NC Mountains', county: 'Macon', acres: 1605, maxDepthFt: 250, lat: 35.155, lng: -83.600, cat: 'nc-tva-reservoir-nc', notes: 'Nantahala Lake — high-elevation NC reservoir. Walleye + smallmouth + spotted bass.' },
  { id: 'nc-lake-cheoah-nc', name: 'Cheoah Lake (NC portion)', region: 'NC Mountains', county: 'Graham', acres: 595, maxDepthFt: 220, lat: 35.443, lng: -83.940, cat: 'nc-tva-reservoir-nc' },
  { id: 'nc-lake-calderwood-nc', name: 'Calderwood Lake (NC portion)', region: 'NC Mountains', county: 'Graham', acres: 540, maxDepthFt: 130, lat: 35.475, lng: -83.945, cat: 'nc-tva-reservoir-nc' },
  { id: 'nc-lake-santeetlah', name: 'Santeetlah Lake', region: 'NC Mountains', county: 'Graham', acres: 2864, maxDepthFt: 200, lat: 35.385, lng: -83.880, cat: 'nc-tva-reservoir-nc', notes: 'Santeetlah Lake — Graham County mountain reservoir. Smallmouth + spotted bass + walleye.' },
  { id: 'nc-lake-apalachia-nc', name: 'Apalachia Lake (NC portion)', region: 'NC Mountains', county: 'Cherokee', acres: 1100, maxDepthFt: 100, lat: 35.155, lng: -84.130, cat: 'nc-tva-reservoir-nc' },
  { id: 'nc-lake-mission', name: 'Mission Reservoir', region: 'NC Mountains', county: 'Cherokee', acres: 60, maxDepthFt: 35, lat: 35.105, lng: -84.000, cat: 'nc-tva-reservoir-nc' },
  { id: 'nc-lake-glenville', name: 'Lake Glenville (Thorpe)', region: 'NC Mountains', county: 'Jackson', acres: 1462, maxDepthFt: 110, lat: 35.180, lng: -83.150, cat: 'nc-tva-reservoir-nc' },
  { id: 'nc-lake-bear', name: 'Bear Lake', region: 'NC Mountains', county: 'Jackson', acres: 460, maxDepthFt: 130, lat: 35.150, lng: -83.085, cat: 'nc-tva-reservoir-nc' },
  { id: 'nc-lake-tanasee', name: 'Tanasee Creek Reservoir', region: 'NC Mountains', county: 'Jackson', acres: 39, maxDepthFt: 35, lat: 35.190, lng: -83.025, cat: 'nc-tva-reservoir-nc' },
  { id: 'nc-lake-toxaway', name: 'Lake Toxaway', region: 'NC Mountains', county: 'Transylvania', acres: 640, maxDepthFt: 60, lat: 35.130, lng: -82.945, cat: 'nc-tva-reservoir-nc' },
  { id: 'nc-lake-jocassee-nc', name: 'Lake Jocassee (NC portion)', region: 'NC Mountains', county: 'Transylvania', acres: null, maxDepthFt: null, lat: 35.050, lng: -82.940, cat: 'nc-tva-reservoir-nc' },
];

function main() {
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  const existing = JSON.parse(raw);
  const byId = new Map(existing.map((e) => [e.id, e]));

  let appended = 0, skipped = 0;
  for (const item of RAW) {
    if (byId.has(item.id)) { skipped++; continue; }
    const entry = buildNC({
      id: item.id, name: item.name, region: item.region,
      county: item.county, acres: item.acres, maxDepthFt: item.maxDepthFt,
      lat: item.lat, lng: item.lng, cat: item.cat, notes: item.notes,
    });
    existing.push(entry);
    byId.set(item.id, entry);
    appended++;
  }

  fs.writeFileSync(DATA_PATH, JSON.stringify(existing, null, 2) + '\n', 'utf8');
  const ncTotal = existing.filter((e) => e.state === 'NC').length;
  console.log(`Appended ${appended}, skipped ${skipped}. NC total: ${ncTotal}, Grand total: ${existing.length}`);
}

main();
