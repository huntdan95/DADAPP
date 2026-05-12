// KY Vol 1 — Marquee Kentucky reservoirs + the world-class Cumberland tailwater
// + all KY trout tailwaters + major rivers.

const fs = require('fs');
const path = require('path');
const { buildKY } = require('./_ky-water-template.cjs');

const DATA_PATH = path.join(__dirname, '..', 'data', 'waterbodies.json');

const RAW = [
  // ============== MARQUEE KY RESERVOIRS ==============
  { id: 'ky-lake-kentucky', name: 'Kentucky Lake', region: 'West KY', county: 'Marshall / Lyon / Calloway / Trigg', acres: 160300, maxDepthFt: 75, lat: 36.700, lng: -88.090, cat: 'ky-major-reservoir', notes: 'Kentucky Lake — 160,300-acre TVA reservoir on the Tennessee River (shared with TN). KY\'s largest lake. World-class crappie, ledge bass fishing (Bassmaster Classic 2017), trophy blue catfish (60+ lb), sand bass spring run, striper, sauger. Land Between the Lakes National Recreation Area on the east shore.' },
  { id: 'ky-lake-barkley', name: 'Lake Barkley', region: 'West KY', county: 'Lyon / Trigg / Livingston', acres: 57920, maxDepthFt: 75, lat: 36.870, lng: -87.910, cat: 'ky-major-reservoir', notes: 'Lake Barkley — 57,920-acre USACE Cumberland River reservoir. Twin to Kentucky Lake; connected via Barkley Canal. World-class crappie + trophy blue cats (state record came from here). LBL east shore.' },
  { id: 'ky-lake-cumberland', name: 'Lake Cumberland', region: 'South-Central KY', county: 'Russell / Wayne / Pulaski / Clinton / Laurel / McCreary', acres: 65530, maxDepthFt: 280, lat: 36.880, lng: -85.140, cat: 'ky-major-reservoir', notes: 'Lake Cumberland — 65,530-acre deep clear USACE reservoir. "Striper Capital of the South" — trophy striper destination (40+ lb realistic). Also trophy walleye, smallmouth, largemouth, crappie, trout below the dam. 1255 miles of shoreline.' },
  { id: 'ky-lake-cave-run', name: 'Cave Run Lake', region: 'East-Central KY', county: 'Bath / Menifee / Morgan / Rowan', acres: 8270, maxDepthFt: 130, lat: 38.080, lng: -83.530, cat: 'ky-major-reservoir', notes: 'Cave Run Lake — 8,270-acre USACE reservoir. "Muskie Fishing Capital of the South" — KDFWR muskie stocking has built an incredible trophy muskie fishery. Also striper, largemouth, smallmouth, crappie, walleye.' },
  { id: 'ky-lake-laurel-river', name: 'Laurel River Lake', region: 'SE KY', county: 'Laurel / Whitley', acres: 5600, maxDepthFt: 250, lat: 36.945, lng: -84.245, cat: 'ky-major-reservoir', notes: 'Laurel River Lake — 5,600-acre clear deep USACE reservoir in Daniel Boone NF. Trophy walleye (KDFWR stocked), striper, smallmouth, largemouth, crappie. Crystal-clear water.' },
  { id: 'ky-lake-green-river', name: 'Green River Lake', region: 'South-Central KY', county: 'Taylor / Adair / Casey', acres: 8210, maxDepthFt: 132, lat: 37.250, lng: -85.300, cat: 'ky-major-reservoir', notes: 'Green River Lake — 8,210-acre USACE reservoir. Trophy muskie + walleye + striper + largemouth + smallmouth + crappie. KDFWR muskie + walleye stocking programs.' },
  { id: 'ky-lake-nolin', name: 'Nolin River Lake', region: 'West-Central KY', county: 'Edmonson / Grayson / Hart', acres: 5795, maxDepthFt: 130, lat: 37.330, lng: -86.230, cat: 'ky-major-reservoir', notes: 'Nolin River Lake — 5,795-acre USACE reservoir. Largemouth + smallmouth + crappie + cats + white bass. Mammoth Cave NP nearby.' },
  { id: 'ky-lake-rough-river', name: 'Rough River Lake', region: 'West-Central KY', county: 'Breckinridge / Grayson / Hardin', acres: 5100, maxDepthFt: 65, lat: 37.625, lng: -86.500, cat: 'ky-major-reservoir', notes: 'Rough River Lake — 5,100-acre USACE reservoir. Crappie + largemouth + cats + walleye.' },
  { id: 'ky-lake-barren-river', name: 'Barren River Lake', region: 'South-Central KY', county: 'Allen / Barren / Monroe', acres: 10000, maxDepthFt: 130, lat: 36.875, lng: -86.130, cat: 'ky-major-reservoir', notes: 'Barren River Lake — 10,000-acre USACE reservoir. Walleye fishery (KDFWR stocked), bass, crappie, cats. State park lake.' },
  { id: 'ky-lake-taylorsville', name: 'Taylorsville Lake', region: 'Central KY', county: 'Anderson / Nelson / Spencer', acres: 3050, maxDepthFt: 90, lat: 38.050, lng: -85.290, cat: 'ky-major-reservoir', notes: 'Taylorsville Lake — 3,050-acre Salt River reservoir near Louisville. Trophy largemouth + crappie + striped bass + saugeye + hybrid stripers + cats.' },
  { id: 'ky-lake-herrington', name: 'Herrington Lake', region: 'Central KY', county: 'Boyle / Garrard / Mercer', acres: 2335, maxDepthFt: 250, lat: 37.745, lng: -84.770, cat: 'ky-major-reservoir', notes: 'Herrington Lake — oldest manmade lake in KY (1925). 2,335 acres, 250 ft deep. Hybrid striped bass + largemouth + smallmouth + walleye + crappie + cats. Limestone bluffs.' },
  { id: 'ky-lake-dewey', name: 'Dewey Lake', region: 'East KY', county: 'Floyd', acres: 1100, maxDepthFt: 86, lat: 37.730, lng: -82.760, cat: 'ky-state-park-lake', notes: 'Dewey Lake — Jenny Wiley State Park. 1,100 acres. Largemouth, bluegill, crappie, channel cats, walleye.' },
  { id: 'ky-lake-buckhorn', name: 'Buckhorn Lake', region: 'East KY', county: 'Perry / Leslie', acres: 1230, maxDepthFt: 110, lat: 37.295, lng: -83.470, cat: 'ky-state-park-lake', notes: 'Buckhorn Lake — Buckhorn SP. Trophy muskie (KDFWR stocked), walleye, largemouth, crappie, cats. Cumberland Plateau setting.' },
  { id: 'ky-lake-carr-creek', name: 'Carr Creek Lake', region: 'East KY', county: 'Knott', acres: 750, maxDepthFt: 110, lat: 37.220, lng: -83.030, cat: 'ky-state-park-lake', notes: 'Carr Creek Lake — Carr Creek SP. Walleye + crappie + bass + cats. Steep mountain reservoir.' },
  { id: 'ky-lake-fishtrap', name: 'Fishtrap Lake', region: 'East KY', county: 'Pike', acres: 1130, maxDepthFt: 195, lat: 37.450, lng: -82.420, cat: 'ky-state-park-lake', notes: 'Fishtrap Lake — Levisa Fork reservoir. Smallmouth + largemouth + walleye + crappie + cats. Mountain-clear water.' },
  { id: 'ky-lake-yatesville', name: 'Yatesville Lake', region: 'East KY', county: 'Lawrence', acres: 2300, maxDepthFt: 60, lat: 38.150, lng: -82.620, cat: 'ky-state-park-lake', notes: 'Yatesville Lake — Yatesville SP. Largemouth + crappie + cats + walleye.' },
  { id: 'ky-lake-grayson', name: 'Grayson Lake', region: 'East KY', county: 'Carter / Elliott', acres: 1500, maxDepthFt: 110, lat: 38.220, lng: -83.000, cat: 'ky-state-park-lake', notes: 'Grayson Lake — Grayson Lake SP. Largemouth + crappie + muskie + walleye + cats.' },
  { id: 'ky-lake-greenbo', name: 'Greenbo Lake', region: 'East KY', county: 'Greenup', acres: 225, maxDepthFt: 35, lat: 38.495, lng: -82.880, cat: 'ky-state-park-lake', notes: 'Greenbo Lake — Greenbo Lake SP. Trophy largemouth (Florida-strain), bream, channel cats.' },
  { id: 'ky-lake-paintsville', name: 'Paintsville Lake', region: 'East KY', county: 'Johnson / Morgan', acres: 1140, maxDepthFt: 80, lat: 37.860, lng: -82.870, cat: 'ky-state-park-lake', notes: 'Paintsville Lake — Paintsville Lake SP. Trout-stocked tailwater + lake bass + crappie + cats.' },
  { id: 'ky-lake-martins-fork', name: 'Martins Fork Lake', region: 'SE KY', county: 'Harlan', acres: 340, maxDepthFt: 80, lat: 36.815, lng: -83.080, cat: 'ky-state-park-lake' },
  { id: 'ky-lake-cranks-creek', name: 'Cranks Creek Lake', region: 'SE KY', county: 'Harlan', acres: 200, maxDepthFt: 60, lat: 36.760, lng: -82.940, cat: 'ky-state-park-lake' },
  { id: 'ky-lake-wood-creek', name: 'Wood Creek Lake', region: 'SE KY', county: 'Laurel', acres: 670, maxDepthFt: 35, lat: 37.060, lng: -84.140, cat: 'ky-state-park-lake' },
  { id: 'ky-lake-beaver', name: 'Beaver Lake', region: 'East KY', county: 'Anderson', acres: 158, maxDepthFt: 35, lat: 38.060, lng: -84.860, cat: 'ky-state-park-lake' },
  { id: 'ky-lake-guist-creek', name: 'Guist Creek Lake', region: 'Central KY', county: 'Shelby', acres: 317, maxDepthFt: 35, lat: 38.150, lng: -85.140, cat: 'ky-state-park-lake', notes: 'Guist Creek Lake — Shelby County. Trophy largemouth + crappie + bream + cats.' },
  { id: 'ky-lake-cedar-creek-lincoln', name: 'Cedar Creek Lake (Lincoln)', region: 'Central KY', county: 'Lincoln', acres: 784, maxDepthFt: 56, lat: 37.580, lng: -84.585, cat: 'ky-state-park-lake', notes: 'Cedar Creek Lake — KDFWR trophy bass lake (15–20" slot limit on largemouth). One of KY\'s best trophy largemouth fisheries.' },
  { id: 'ky-lake-pewee', name: 'Lake Pewee', region: 'West KY', county: 'Hopkins', acres: 280, maxDepthFt: 35, lat: 37.295, lng: -87.460, cat: 'ky-state-park-lake', notes: 'Lake Pewee — Pennyrile area. Largemouth, bream, crappie, cats.' },
  { id: 'ky-lake-pennyrile', name: 'Pennyrile Forest Lake', region: 'West KY', county: 'Christian', acres: 56, maxDepthFt: 35, lat: 36.945, lng: -87.660, cat: 'ky-state-park-lake' },
  { id: 'ky-lake-beshear', name: 'Lake Beshear', region: 'West KY', county: 'Caldwell / Christian', acres: 760, maxDepthFt: 50, lat: 37.105, lng: -87.730, cat: 'ky-state-park-lake' },
  { id: 'ky-lake-malone', name: 'Lake Malone', region: 'West KY', county: 'Logan / Muhlenberg / Todd', acres: 788, maxDepthFt: 60, lat: 36.870, lng: -86.965, cat: 'ky-state-park-lake', notes: 'Lake Malone — Lake Malone SP. Largemouth + crappie + bream + cats. Sandstone cliffs.' },
  { id: 'ky-lake-mcneely', name: 'McNeely Lake', region: 'Louisville Metro', county: 'Jefferson', acres: 46, maxDepthFt: 25, lat: 38.140, lng: -85.640, cat: 'ky-fins-pond' },
  { id: 'ky-lake-reba', name: 'Lake Reba', region: 'Central KY', county: 'Madison', acres: 90, maxDepthFt: 25, lat: 37.760, lng: -84.260, cat: 'ky-state-park-lake' },
  { id: 'ky-lake-wilgreen', name: 'Wilgreen Lake', region: 'Central KY', county: 'Madison', acres: 169, maxDepthFt: 40, lat: 37.690, lng: -84.330, cat: 'ky-state-park-lake' },
  { id: 'ky-lake-linville', name: 'Lake Linville', region: 'Central KY', county: 'Rockcastle', acres: 250, maxDepthFt: 40, lat: 37.345, lng: -84.290, cat: 'ky-state-park-lake' },
  { id: 'ky-lake-camargo', name: 'Lake Camargo', region: 'Central KY', county: 'Montgomery', acres: 73, maxDepthFt: 25, lat: 38.060, lng: -83.860, cat: 'ky-state-park-lake' },
  { id: 'ky-lake-jolly', name: 'A.J. Jolly Lake', region: 'Northern KY', county: 'Campbell', acres: 175, maxDepthFt: 40, lat: 38.875, lng: -84.380, cat: 'ky-state-park-lake' },
  { id: 'ky-lake-williamstown', name: 'Williamstown Lake', region: 'Northern KY', county: 'Grant', acres: 330, maxDepthFt: 40, lat: 38.640, lng: -84.560, cat: 'ky-state-park-lake' },
  { id: 'ky-lake-boltz', name: 'Boltz Lake', region: 'Northern KY', county: 'Grant', acres: 92, maxDepthFt: 28, lat: 38.685, lng: -84.535, cat: 'ky-state-park-lake' },
  { id: 'ky-lake-bullock-pen', name: 'Bullock Pen Lake', region: 'Northern KY', county: 'Grant / Boone', acres: 134, maxDepthFt: 30, lat: 38.840, lng: -84.620, cat: 'ky-state-park-lake' },
  { id: 'ky-lake-corinth', name: 'Lake Corinth', region: 'Northern KY', county: 'Grant', acres: 96, maxDepthFt: 28, lat: 38.555, lng: -84.515, cat: 'ky-state-park-lake' },
  { id: 'ky-lake-mauzy', name: 'Mauzy Lake', region: 'West KY', county: 'Hopkins', acres: 73, maxDepthFt: 30, lat: 37.235, lng: -87.490, cat: 'ky-state-park-lake' },
  { id: 'ky-lake-mill-creek', name: 'Mill Creek Lake (Jackson)', region: 'East KY', county: 'Jackson', acres: 60, maxDepthFt: 32, lat: 37.385, lng: -83.945, cat: 'ky-state-park-lake' },
  { id: 'ky-lake-mill-creek-jeff', name: 'Mill Creek Lake (Jefferson Memorial Forest)', region: 'Louisville Metro', county: 'Jefferson', acres: 30, maxDepthFt: 20, lat: 38.090, lng: -85.700, cat: 'ky-fins-pond' },
  { id: 'ky-lake-bert-combs', name: 'Bert Combs Lake', region: 'East KY', county: 'Clay', acres: 50, maxDepthFt: 25, lat: 37.155, lng: -83.815, cat: 'ky-state-park-lake' },
  { id: 'ky-lake-sportsmens', name: 'Sportsmen\'s Lake', region: 'Central KY', county: 'Scott', acres: 50, maxDepthFt: 22, lat: 38.230, lng: -84.560, cat: 'ky-state-park-lake' },
  { id: 'ky-lake-reformatory', name: 'Reformatory Lake (Pewee Valley)', region: 'Louisville Metro', county: 'Oldham', acres: 70, maxDepthFt: 25, lat: 38.310, lng: -85.480, cat: 'ky-fins-pond' },
  { id: 'ky-lake-elmer-davis', name: 'Elmer Davis Lake', region: 'Central KY', county: 'Owen', acres: 144, maxDepthFt: 35, lat: 38.500, lng: -84.860, cat: 'ky-state-park-lake' },
  { id: 'ky-lake-marion-county', name: 'Marion County Sportsmens\' Lake', region: 'Central KY', county: 'Marion', acres: 75, maxDepthFt: 28, lat: 37.560, lng: -85.260, cat: 'ky-state-park-lake' },
  { id: 'ky-lake-spurlington', name: 'Spurlington Lake', region: 'Central KY', county: 'Taylor', acres: 50, maxDepthFt: 30, lat: 37.330, lng: -85.330, cat: 'ky-state-park-lake' },
  { id: 'ky-lake-shelby-villa', name: 'Shelby Villa Park Lake', region: 'Louisville Metro', county: 'Shelby', acres: 15, maxDepthFt: 15, lat: 38.215, lng: -85.230, cat: 'ky-fins-pond' },
  { id: 'ky-lake-sloughs-wma', name: 'Sloughs WMA Lakes', region: 'West KY', county: 'Henderson / Union', acres: null, maxDepthFt: 15, lat: 37.730, lng: -87.700, cat: 'ky-major-reservoir', notes: 'Sloughs WMA — Ohio River oxbow + slough complex. Bass + crappie + cats + bream. Backwater fishing.' },
  { id: 'ky-lake-clay-wma', name: 'Clay WMA Lakes', region: 'West KY', county: 'Webster', acres: null, maxDepthFt: 15, lat: 37.470, lng: -87.770, cat: 'ky-major-reservoir' },
  { id: 'ky-lake-higginson-henry', name: 'Higginson-Henry WMA Lakes', region: 'West KY', county: 'Union', acres: null, maxDepthFt: 12, lat: 37.620, lng: -87.870, cat: 'ky-major-reservoir' },
  { id: 'ky-lake-kingdom-come', name: 'Kingdom Come SP Lake', region: 'SE KY', county: 'Harlan', acres: 5, maxDepthFt: 18, lat: 37.005, lng: -82.965, cat: 'ky-state-park-lake' },
  { id: 'ky-lake-natural-bridge', name: 'Natural Bridge SP Pond', region: 'East KY', county: 'Powell / Wolfe', acres: 6, maxDepthFt: 18, lat: 37.770, lng: -83.685, cat: 'ky-state-park-lake' },
  { id: 'ky-lake-pine-mountain', name: 'Pine Mountain SP Lake', region: 'SE KY', county: 'Bell', acres: 5, maxDepthFt: 18, lat: 36.755, lng: -83.745, cat: 'ky-state-park-lake' },
  { id: 'ky-lake-cumberland-falls', name: 'Cumberland Falls SP Stream', region: 'SE KY', county: 'McCreary / Whitley', acres: null, maxDepthFt: null, lat: 36.840, lng: -84.345, cat: 'ky-eastern-river', notes: 'Cumberland Falls SP — wild smallmouth + muskie. Stream above falls.' },
  { id: 'ky-lake-jenny-wiley', name: 'Jenny Wiley SP Lake (Dewey supp)', region: 'East KY', county: 'Floyd', acres: null, maxDepthFt: null, lat: 37.735, lng: -82.765, cat: 'ky-state-park-lake' },
  { id: 'ky-lake-rough-river-supp', name: 'Rough River — Beaver Dam Cove', region: 'West-Central KY', county: 'Grayson', acres: null, maxDepthFt: null, lat: 37.575, lng: -86.520, cat: 'ky-major-reservoir' },
  { id: 'ky-lake-meldahl-pool-supp', name: 'Meldahl Pool (Ohio River)', region: 'Northern KY', county: 'Bracken / Pendleton / Campbell', acres: null, maxDepthFt: null, lat: 38.785, lng: -84.140, cat: 'ky-ohio-river' },

  // ============== TROUT TAILWATERS ==============
  { id: 'ky-tailwater-cumberland', name: 'Cumberland River Tailwater (Below Wolf Creek Dam)', region: 'South-Central KY', county: 'Russell / Cumberland / Clinton / Wayne', acres: null, maxDepthFt: null, lat: 36.875, lng: -85.150, cat: 'ky-cumberland-tailwater', notes: 'Cumberland Tailwater — 75 miles of trout water below Wolf Creek Dam. One of America\'s premier trophy brown trout fisheries — wild reproducing browns to 30+ inches. Full hatch calendar (Sulphur, BWO, white fly, trico, caddis, midges, cicada in brood years). World-class.' },
  { id: 'ky-tailwater-hatchery-creek', name: 'Hatchery Creek', region: 'South-Central KY', county: 'Russell', acres: null, maxDepthFt: null, lat: 36.870, lng: -85.150, cat: 'ky-tailwater-trout', notes: 'Hatchery Creek — manmade trout stream connecting Wolf Creek National Fish Hatchery to the Cumberland tailwater. C&R only, fly-fishing only — incredible trout density. Walk-in access.' },
  { id: 'ky-tailwater-cave-run', name: 'Cave Run Tailwater (Licking River Below Dam)', region: 'East-Central KY', county: 'Bath / Rowan', acres: null, maxDepthFt: null, lat: 38.080, lng: -83.530, cat: 'ky-tailwater-trout', notes: 'Cave Run tailwater — Licking River below Cave Run Dam. Trout stocked + holdover; smallmouth + muskie below cold zones.' },
  { id: 'ky-tailwater-laurel-river', name: 'Laurel River Tailwater (Below Laurel Dam)', region: 'SE KY', county: 'Laurel', acres: null, maxDepthFt: null, lat: 36.945, lng: -84.250, cat: 'ky-tailwater-trout', notes: 'Laurel River tailwater — quality trout fishery in Daniel Boone NF. Stocked + holdovers.' },
  { id: 'ky-tailwater-paintsville', name: 'Paintsville Lake Tailwater', region: 'East KY', county: 'Johnson', acres: null, maxDepthFt: null, lat: 37.860, lng: -82.870, cat: 'ky-tailwater-trout' },
  { id: 'ky-tailwater-buckhorn', name: 'Buckhorn Lake Tailwater', region: 'East KY', county: 'Perry', acres: null, maxDepthFt: null, lat: 37.295, lng: -83.475, cat: 'ky-tailwater-trout' },
  { id: 'ky-tailwater-carr-creek', name: 'Carr Creek Tailwater', region: 'East KY', county: 'Knott', acres: null, maxDepthFt: null, lat: 37.220, lng: -83.030, cat: 'ky-tailwater-trout' },
  { id: 'ky-tailwater-barren-river', name: 'Barren River Tailwater', region: 'South-Central KY', county: 'Allen', acres: null, maxDepthFt: null, lat: 36.875, lng: -86.135, cat: 'ky-tailwater-trout' },
  { id: 'ky-tailwater-green-river', name: 'Green River Tailwater', region: 'South-Central KY', county: 'Taylor', acres: null, maxDepthFt: null, lat: 37.250, lng: -85.305, cat: 'ky-tailwater-trout' },
  { id: 'ky-tailwater-nolin-river', name: 'Nolin River Tailwater', region: 'West-Central KY', county: 'Edmonson', acres: null, maxDepthFt: null, lat: 37.330, lng: -86.235, cat: 'ky-tailwater-trout' },
  { id: 'ky-tailwater-grayson-tailwater', name: 'Grayson Lake Tailwater (Little Sandy)', region: 'East KY', county: 'Carter', acres: null, maxDepthFt: null, lat: 38.220, lng: -83.000, cat: 'ky-tailwater-trout' },
  { id: 'ky-tailwater-dix-river', name: 'Dix River Tailwater (Below Herrington Dam)', region: 'Central KY', county: 'Boyle / Garrard / Mercer', acres: null, maxDepthFt: null, lat: 37.760, lng: -84.760, cat: 'ky-tailwater-trout', notes: 'Dix River tailwater — below Herrington Dam. Quality cold-water section, stocked trout + holdovers + smallmouth below cold zones.' },
  { id: 'ky-tailwater-floyds-fork', name: 'Floyds Fork (Stocked Trout Section)', region: 'Louisville Metro', county: 'Jefferson / Bullitt', acres: null, maxDepthFt: null, lat: 38.180, lng: -85.530, cat: 'ky-tailwater-trout' },
  { id: 'ky-tailwater-mill-creek', name: 'Mill Creek (Mason Co Trout)', region: 'Northern KY', county: 'Mason', acres: null, maxDepthFt: null, lat: 38.555, lng: -83.870, cat: 'ky-tailwater-trout' },
  { id: 'ky-tailwater-trammel-fork', name: 'Trammel Fork (Trout)', region: 'South-Central KY', county: 'Warren / Allen', acres: null, maxDepthFt: null, lat: 36.785, lng: -86.250, cat: 'ky-tailwater-trout' },
  { id: 'ky-tailwater-otter-creek-trout', name: 'Otter Creek (Trout)', region: 'West-Central KY', county: 'Meade', acres: null, maxDepthFt: null, lat: 37.945, lng: -86.060, cat: 'ky-tailwater-trout' },
  { id: 'ky-tailwater-beaver-creek-trout', name: 'Beaver Creek (Trout) ', region: 'West-Central KY', county: 'Hardin', acres: null, maxDepthFt: null, lat: 37.755, lng: -85.840, cat: 'ky-tailwater-trout' },
  { id: 'ky-tailwater-cumberland-bark-camp', name: 'Bark Camp Creek (Trout Stream)', region: 'SE KY', county: 'Whitley', acres: null, maxDepthFt: null, lat: 36.835, lng: -84.205, cat: 'ky-tailwater-trout', notes: 'Bark Camp Creek — Daniel Boone NF stocked trout stream. Wild reproduction in upper reaches.' },
  { id: 'ky-tailwater-cumberland-rockcastle-trout', name: 'Rockcastle River (Trout Section)', region: 'SE KY', county: 'Rockcastle / Pulaski', acres: null, maxDepthFt: null, lat: 37.080, lng: -84.260, cat: 'ky-tailwater-trout', notes: 'Rockcastle River — KDFWR stocks trout in upper sections; wild smallmouth + spotted bass below. Daniel Boone NF.' },
  { id: 'ky-tailwater-cumberland-big-south-fork', name: 'Big South Fork (KY Side)', region: 'SE KY', county: 'McCreary', acres: null, maxDepthFt: null, lat: 36.665, lng: -84.500, cat: 'ky-tailwater-trout', notes: 'Big South Fork (KY) — wild + stocked trout in upper sections; smallmouth + walleye in lower river. Wild & Scenic.' },
  { id: 'ky-tailwater-cumberland-cane-creek', name: 'Cane Creek (Stocked Trout)', region: 'SE KY', county: 'Laurel', acres: null, maxDepthFt: null, lat: 36.965, lng: -84.115, cat: 'ky-tailwater-trout' },
  { id: 'ky-tailwater-cumberland-war-fork', name: 'War Fork Creek (Stocked Trout)', region: 'East KY', county: 'Jackson', acres: null, maxDepthFt: null, lat: 37.400, lng: -83.870, cat: 'ky-tailwater-trout' },
  { id: 'ky-tailwater-cumberland-elkhorn-creek-trout', name: 'Elkhorn Creek (Stocked Trout Section)', region: 'Central KY', county: 'Franklin / Scott', acres: null, maxDepthFt: null, lat: 38.260, lng: -84.880, cat: 'ky-tailwater-trout' },

  // ============== KY RIVERS — main systems ==============
  { id: 'ky-river-kentucky', name: 'Kentucky River', region: 'Central KY', county: 'Multi-county', acres: null, maxDepthFt: null, lat: 38.250, lng: -84.880, cat: 'ky-bluegrass-smallmouth-river', notes: 'Kentucky River — 14 navigation pools running through the heart of the Bluegrass. Smallmouth + spotted bass + largemouth + cats + muskie + sauger. Float-trip culture from Frankfort south.' },
  { id: 'ky-river-kentucky-north-fork', name: 'Kentucky River — North Fork', region: 'East KY', county: 'Perry / Letcher / Knott', acres: null, maxDepthFt: null, lat: 37.300, lng: -83.000, cat: 'ky-bluegrass-smallmouth-river' },
  { id: 'ky-river-kentucky-middle-fork', name: 'Kentucky River — Middle Fork', region: 'East KY', county: 'Leslie / Clay', acres: null, maxDepthFt: null, lat: 37.310, lng: -83.380, cat: 'ky-bluegrass-smallmouth-river' },
  { id: 'ky-river-kentucky-south-fork', name: 'Kentucky River — South Fork', region: 'East KY', county: 'Clay / Owsley', acres: null, maxDepthFt: null, lat: 37.350, lng: -83.660, cat: 'ky-bluegrass-smallmouth-river' },
  { id: 'ky-river-cumberland-upper', name: 'Cumberland River — Upper (Above Lake)', region: 'SE KY', county: 'Whitley / Knox / Bell / Harlan', acres: null, maxDepthFt: null, lat: 36.840, lng: -83.985, cat: 'ky-eastern-river', notes: 'Upper Cumberland — wild smallmouth + spotted bass + muskie. Above Cumberland Falls is C&R for muskie. Float trip from Pineville to Cumberland Falls.' },
  { id: 'ky-river-licking', name: 'Licking River', region: 'Central / NE KY', county: 'Multi-county', acres: null, maxDepthFt: null, lat: 38.640, lng: -83.880, cat: 'ky-bluegrass-smallmouth-river', notes: 'Licking River — premier KY smallmouth river. Float-fishing from Cave Run tailwater to the Ohio at Cincinnati. Trophy muskie (KDFWR stocked) in upper sections.' },
  { id: 'ky-river-salt', name: 'Salt River', region: 'Central KY', county: 'Multi-county', acres: null, maxDepthFt: null, lat: 38.000, lng: -85.500, cat: 'ky-bluegrass-smallmouth-river' },
  { id: 'ky-river-red', name: 'Red River (Daniel Boone NF)', region: 'East KY', county: 'Powell / Wolfe / Menifee', acres: null, maxDepthFt: null, lat: 37.770, lng: -83.665, cat: 'ky-bluegrass-smallmouth-river', notes: 'Red River — Wild & Scenic in upper reaches. Wild smallmouth + spotted bass. Red River Gorge scenic float.' },
  { id: 'ky-river-rockcastle', name: 'Rockcastle River', region: 'SE KY', county: 'Rockcastle / Laurel / Pulaski', acres: null, maxDepthFt: null, lat: 37.080, lng: -84.260, cat: 'ky-bluegrass-smallmouth-river', notes: 'Rockcastle River — wild + stocked trout in upper section; smallmouth + spotted bass + muskie below. Daniel Boone NF.' },
  { id: 'ky-river-green', name: 'Green River', region: 'Central KY', county: 'Multi-county', acres: null, maxDepthFt: null, lat: 37.250, lng: -86.155, cat: 'ky-green-river', notes: 'Green River — KY\'s premier smallmouth river. Mammoth Cave NP through the Green River canyon. Wild muskie, smallmouth, rockbass, longear, walleye, cats. Float culture.' },
  { id: 'ky-river-barren', name: 'Barren River', region: 'South-Central KY', county: 'Multi-county', acres: null, maxDepthFt: null, lat: 36.870, lng: -86.130, cat: 'ky-green-river', notes: 'Barren River — Green River tributary. Wild smallmouth + walleye (KDFWR stocked) + crappie.' },
  { id: 'ky-river-nolin', name: 'Nolin River', region: 'West-Central KY', county: 'Multi-county', acres: null, maxDepthFt: null, lat: 37.330, lng: -86.230, cat: 'ky-green-river' },
  { id: 'ky-river-rough', name: 'Rough River', region: 'West-Central KY', county: 'Multi-county', acres: null, maxDepthFt: null, lat: 37.625, lng: -86.500, cat: 'ky-green-river' },
  { id: 'ky-river-big-sandy', name: 'Big Sandy River', region: 'East KY / WV border', county: 'Lawrence / Boyd / Greenup', acres: null, maxDepthFt: null, lat: 38.420, lng: -82.580, cat: 'ky-eastern-river', notes: 'Big Sandy River — KY/WV border. Smallmouth + spotted bass + crappie + cats + sauger.' },
  { id: 'ky-river-levisa-fork', name: 'Levisa Fork', region: 'East KY', county: 'Pike / Floyd / Johnson / Lawrence', acres: null, maxDepthFt: null, lat: 37.730, lng: -82.770, cat: 'ky-eastern-river' },
  { id: 'ky-river-tug-fork', name: 'Tug Fork', region: 'East KY / WV border', county: 'Pike / Martin', acres: null, maxDepthFt: null, lat: 37.625, lng: -82.270, cat: 'ky-eastern-river' },
  { id: 'ky-river-pond', name: 'Pond River', region: 'West KY', county: 'Hopkins / Muhlenberg / McLean', acres: null, maxDepthFt: null, lat: 37.430, lng: -87.355, cat: 'ky-green-river' },
  { id: 'ky-river-tradewater', name: 'Tradewater River', region: 'West KY', county: 'Multi-county', acres: null, maxDepthFt: null, lat: 37.430, lng: -87.770, cat: 'ky-green-river' },
  { id: 'ky-river-elkhorn-creek', name: 'Elkhorn Creek', region: 'Central KY', county: 'Franklin / Scott / Fayette', acres: null, maxDepthFt: null, lat: 38.260, lng: -84.880, cat: 'ky-bluegrass-smallmouth-river', notes: 'Elkhorn Creek — premier Bluegrass smallmouth tributary. Float from Georgetown to Frankfort. Stocked trout sections seasonal.' },
  { id: 'ky-river-floyds-fork', name: 'Floyds Fork', region: 'Louisville Metro', county: 'Jefferson / Bullitt', acres: null, maxDepthFt: null, lat: 38.180, lng: -85.530, cat: 'ky-bluegrass-smallmouth-river', notes: 'Floyds Fork — Louisville-area smallmouth river. Parklands of Floyds Fork system. Stocked trout sections.' },
  { id: 'ky-river-beech-fork', name: 'Beech Fork', region: 'Central KY', county: 'Nelson / Washington', acres: null, maxDepthFt: null, lat: 37.860, lng: -85.330, cat: 'ky-bluegrass-smallmouth-river' },
  { id: 'ky-river-rolling-fork', name: 'Rolling Fork', region: 'Central KY', county: 'Marion / Larue / Nelson', acres: null, maxDepthFt: null, lat: 37.560, lng: -85.385, cat: 'ky-bluegrass-smallmouth-river' },
  { id: 'ky-river-eagle-creek', name: 'Eagle Creek', region: 'Northern KY', county: 'Grant / Owen', acres: null, maxDepthFt: null, lat: 38.640, lng: -84.770, cat: 'ky-bluegrass-smallmouth-river' },
  { id: 'ky-river-russell-creek', name: 'Russell Creek', region: 'South-Central KY', county: 'Adair', acres: null, maxDepthFt: null, lat: 37.080, lng: -85.360, cat: 'ky-bluegrass-smallmouth-river' },
  { id: 'ky-river-drakes-creek', name: 'Drakes Creek', region: 'South-Central KY', county: 'Warren / Allen', acres: null, maxDepthFt: null, lat: 36.870, lng: -86.330, cat: 'ky-green-river' },
  { id: 'ky-river-mud-river', name: 'Mud River', region: 'West-Central KY', county: 'Logan / Butler / Muhlenberg', acres: null, maxDepthFt: null, lat: 37.150, lng: -86.880, cat: 'ky-green-river' },
  { id: 'ky-river-little-river', name: 'Little River', region: 'West KY', county: 'Trigg / Christian / Caldwell', acres: null, maxDepthFt: null, lat: 36.890, lng: -87.730, cat: 'ky-green-river' },
  { id: 'ky-river-tennessee-ky', name: 'Tennessee River (KY portion)', region: 'West KY', county: 'McCracken / Marshall', acres: null, maxDepthFt: null, lat: 37.020, lng: -88.310, cat: 'ky-ohio-river', notes: 'Tennessee River — KY portion below Kentucky Dam. Trophy blue cats + sauger + striped bass + paddlefish + hybrid stripers.' },
  { id: 'ky-river-cumberland-mouth', name: 'Cumberland River — Mouth (Below Barkley)', region: 'West KY', county: 'Livingston', acres: null, maxDepthFt: null, lat: 37.155, lng: -88.430, cat: 'ky-ohio-river', notes: 'Lower Cumberland — below Barkley Dam. Trophy blue cats + sauger + striped bass + paddlefish.' },

  // ============== OHIO RIVER POOLS ==============
  { id: 'ky-ohio-mcalpine-pool', name: 'Ohio River — McAlpine Pool (Louisville)', region: 'Louisville Metro', county: 'Jefferson', acres: null, maxDepthFt: null, lat: 38.270, lng: -85.755, cat: 'ky-ohio-river', notes: 'McAlpine Pool — Falls of the Ohio area. Trophy sauger run + blue cats + paddlefish + hybrid stripers. Major spring fishing destination.' },
  { id: 'ky-ohio-markland-pool', name: 'Ohio River — Markland Pool', region: 'Northern KY', county: 'Boone / Carroll / Gallatin', acres: null, maxDepthFt: null, lat: 38.760, lng: -84.960, cat: 'ky-ohio-river', notes: 'Markland Pool — trophy sauger destination. Also blues, flatheads, paddlefish, hybrid stripers.' },
  { id: 'ky-ohio-meldahl-pool', name: 'Ohio River — Meldahl Pool', region: 'Northern KY', county: 'Bracken / Mason', acres: null, maxDepthFt: null, lat: 38.785, lng: -84.140, cat: 'ky-ohio-river' },
  { id: 'ky-ohio-greenup-pool', name: 'Ohio River — Greenup Pool', region: 'NE KY', county: 'Lewis / Greenup', acres: null, maxDepthFt: null, lat: 38.620, lng: -82.880, cat: 'ky-ohio-river' },
  { id: 'ky-ohio-cannelton-pool', name: 'Ohio River — Cannelton Pool', region: 'West KY', county: 'Hancock / Daviess / Henderson', acres: null, maxDepthFt: null, lat: 37.910, lng: -87.085, cat: 'ky-ohio-river' },
  { id: 'ky-ohio-newburgh-pool', name: 'Ohio River — Newburgh Pool (Owensboro)', region: 'West KY', county: 'Daviess / Henderson', acres: null, maxDepthFt: null, lat: 37.770, lng: -87.110, cat: 'ky-ohio-river' },
  { id: 'ky-ohio-jt-myers-pool', name: 'Ohio River — J.T. Myers Pool (Henderson)', region: 'West KY', county: 'Henderson / Union', acres: null, maxDepthFt: null, lat: 37.840, lng: -87.580, cat: 'ky-ohio-river' },
  { id: 'ky-ohio-smithland-pool', name: 'Ohio River — Smithland Pool', region: 'West KY', county: 'Union / Livingston / Crittenden', acres: null, maxDepthFt: null, lat: 37.140, lng: -88.405, cat: 'ky-ohio-river' },
  { id: 'ky-ohio-olmsted-pool', name: 'Ohio River — Olmsted Pool', region: 'West KY', county: 'McCracken / Ballard', acres: null, maxDepthFt: null, lat: 37.180, lng: -89.060, cat: 'ky-ohio-river' },
  { id: 'ky-river-mississippi-ky', name: 'Mississippi River (KY portion)', region: 'West KY', county: 'Ballard / Carlisle / Hickman / Fulton', acres: null, maxDepthFt: null, lat: 36.870, lng: -89.180, cat: 'ky-ohio-river', notes: 'Mississippi River — KY\'s western edge. Trophy blue cats + flatheads + paddlefish + sauger. Ohio confluence at Cairo.' },
];

function main() {
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  const existing = JSON.parse(raw);
  const byId = new Map(existing.map((e) => [e.id, e]));

  let appended = 0, skipped = 0;
  for (const item of RAW) {
    if (byId.has(item.id)) { skipped++; continue; }
    const entry = buildKY({
      id: item.id, name: item.name, region: item.region,
      county: item.county, acres: item.acres, maxDepthFt: item.maxDepthFt,
      lat: item.lat, lng: item.lng, cat: item.cat, notes: item.notes,
    });
    existing.push(entry);
    byId.set(item.id, entry);
    appended++;
  }

  fs.writeFileSync(DATA_PATH, JSON.stringify(existing, null, 2) + '\n', 'utf8');
  const kyTotal = existing.filter((e) => e.state === 'KY').length;
  console.log(`Appended ${appended}, skipped ${skipped}. KY total: ${kyTotal}, Grand total: ${existing.length}`);
}

main();
