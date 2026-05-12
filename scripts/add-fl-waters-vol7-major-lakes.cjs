// FL Vol 7 — Major Florida lakes. Builds on the existing 50 FL entries
// by adding the Kissimmee chain, Harris chain, Lake Wales chain, Stick
// Marsh complex, panhandle lakes, central FL lakes.

const fs = require('fs');
const path = require('path');
const { buildFL } = require('./_fl-water-template.cjs');

const DATA_PATH = path.join(__dirname, '..', 'data', 'waterbodies.json');

const RAW = [
  // ============== KISSIMMEE CHAIN (in addition to existing Toho + Cypress/Hatchineha + Kissimmee) ==============
  { id: 'fl-lake-tohopekaliga-south', name: 'Lake Tohopekaliga (Toho) - South Cove', region: 'Central FL', county: 'Osceola', acres: null, maxDepthFt: null, lat: 28.205, lng: -81.420, cat: 'fl-bass-lake', notes: 'Toho south basin — Goblet Bay area. Trophy bass + trophy crappie.' },
  { id: 'fl-lake-cypress', name: 'Lake Cypress', region: 'Central FL', county: 'Osceola', acres: 4070, maxDepthFt: 18, lat: 27.985, lng: -81.135, cat: 'fl-bass-lake', notes: 'Lake Cypress — Kissimmee Chain. 4,070 acres. Bass + crappie.' },
  { id: 'fl-lake-hatchineha-supp', name: 'Lake Hatchineha', region: 'Central FL', county: 'Polk / Osceola', acres: 6665, maxDepthFt: 17, lat: 27.940, lng: -81.380, cat: 'fl-bass-lake', notes: 'Lake Hatchineha — Kissimmee Chain. 6,665 acres.' },
  { id: 'fl-lake-tiger', name: 'Lake Tiger', region: 'Central FL', county: 'Osceola', acres: 2200, maxDepthFt: 15, lat: 27.985, lng: -81.305, cat: 'fl-bass-lake' },
  { id: 'fl-lake-jackson-osceola', name: 'Lake Jackson (Osceola)', region: 'Central FL', county: 'Osceola', acres: 1020, maxDepthFt: 12, lat: 27.940, lng: -81.260, cat: 'fl-bass-lake' },
  { id: 'fl-lake-russell', name: 'Lake Russell', region: 'Central FL', county: 'Osceola', acres: 1100, maxDepthFt: 12, lat: 28.090, lng: -81.520, cat: 'fl-bass-lake' },
  { id: 'fl-lake-marian', name: 'Lake Marian', region: 'Central FL', county: 'Osceola', acres: 5800, maxDepthFt: 12, lat: 27.890, lng: -81.155, cat: 'fl-bass-lake', notes: 'Lake Marian — 5,800 acres. Crappie + bass + bream. Less pressure than Toho.' },
  { id: 'fl-lake-kissimmee-north', name: 'Lake Kissimmee - North Cove', region: 'Central FL', county: 'Osceola / Polk', acres: null, maxDepthFt: null, lat: 28.030, lng: -81.305, cat: 'fl-bass-lake' },
  { id: 'fl-lake-kissimmee-south', name: 'Lake Kissimmee - South Cove (Tiger Lake area)', region: 'Central FL', county: 'Polk', acres: null, maxDepthFt: null, lat: 27.920, lng: -81.260, cat: 'fl-bass-lake' },

  // ============== HARRIS CHAIN (build out from existing fl-harris-chain) ==============
  { id: 'fl-lake-harris', name: 'Lake Harris', region: 'Central FL', county: 'Lake', acres: 13788, maxDepthFt: 30, lat: 28.770, lng: -81.815, cat: 'fl-harris-chain-lake', notes: 'Lake Harris — 13,788 acres. Largest Harris Chain lake. Bass + crappie + bream.' },
  { id: 'fl-lake-little-harris', name: 'Little Lake Harris', region: 'Central FL', county: 'Lake', acres: 2740, maxDepthFt: 25, lat: 28.760, lng: -81.770, cat: 'fl-harris-chain-lake' },
  { id: 'fl-lake-eustis', name: 'Lake Eustis', region: 'Central FL', county: 'Lake', acres: 7806, maxDepthFt: 25, lat: 28.870, lng: -81.690, cat: 'fl-harris-chain-lake', notes: 'Lake Eustis — 7,806 acres. Bass + crappie + bream chain destination.' },
  { id: 'fl-lake-dora', name: 'Lake Dora', region: 'Central FL', county: 'Lake', acres: 4475, maxDepthFt: 25, lat: 28.795, lng: -81.665, cat: 'fl-harris-chain-lake', notes: 'Lake Dora — Mount Dora area. Bass + crappie.' },
  { id: 'fl-lake-griffin', name: 'Lake Griffin', region: 'Central FL', county: 'Lake', acres: 9555, maxDepthFt: 20, lat: 28.890, lng: -81.870, cat: 'fl-harris-chain-lake', notes: 'Lake Griffin — 9,555 acres. Recovered fishery; bass + crappie + bream.' },
  { id: 'fl-lake-yale', name: 'Lake Yale', region: 'Central FL', county: 'Lake', acres: 4042, maxDepthFt: 30, lat: 28.840, lng: -81.770, cat: 'fl-harris-chain-lake', notes: 'Lake Yale — 4,042 acres. Excellent crappie + bass.' },
  { id: 'fl-lake-beauclair', name: 'Lake Beauclair', region: 'Central FL', county: 'Lake', acres: 1100, maxDepthFt: 12, lat: 28.825, lng: -81.690, cat: 'fl-harris-chain-lake' },
  { id: 'fl-lake-carlton', name: 'Lake Carlton', region: 'Central FL', county: 'Lake', acres: 350, maxDepthFt: 14, lat: 28.795, lng: -81.700, cat: 'fl-harris-chain-lake' },
  { id: 'fl-lake-burrell', name: 'Lake Burrell', region: 'Central FL', county: 'Lake', acres: 1500, maxDepthFt: 25, lat: 28.840, lng: -81.685, cat: 'fl-harris-chain-lake' },

  // ============== LAKE WALES CHAIN ==============
  { id: 'fl-lake-wales', name: 'Lake Wales', region: 'Central FL', county: 'Polk', acres: 1300, maxDepthFt: 18, lat: 27.910, lng: -81.580, cat: 'fl-bass-lake', notes: 'Lake Wales — 1,300 acres in the heart of the Wales chain. Bass + crappie + bream.' },
  { id: 'fl-lake-pierce', name: 'Lake Pierce', region: 'Central FL', county: 'Polk', acres: 3700, maxDepthFt: 18, lat: 27.920, lng: -81.550, cat: 'fl-bass-lake', notes: 'Lake Pierce — 3,700 acres Wales chain. Trophy bass potential.' },
  { id: 'fl-lake-walk-in-water', name: 'Lake Walk-in-Water (Weohyakapka)', region: 'Central FL', county: 'Polk', acres: 7528, maxDepthFt: 15, lat: 27.835, lng: -81.355, cat: 'fl-bass-lake', notes: 'Lake Walk-in-Water — 7,528 acres. Premier Polk County bass lake.' },
  { id: 'fl-lake-tiger-polk', name: 'Lake Tiger (Polk)', region: 'Central FL', county: 'Polk', acres: 670, maxDepthFt: 14, lat: 27.880, lng: -81.560, cat: 'fl-bass-lake' },
  { id: 'fl-lake-reedy', name: 'Lake Reedy', region: 'Central FL', county: 'Polk', acres: 3500, maxDepthFt: 15, lat: 27.825, lng: -81.470, cat: 'fl-bass-lake', notes: 'Lake Reedy — 3,500 acres. Frostproof area; trophy bass.' },
  { id: 'fl-lake-arbuckle', name: 'Lake Arbuckle', region: 'Central FL', county: 'Polk', acres: 3805, maxDepthFt: 15, lat: 27.760, lng: -81.420, cat: 'fl-bass-lake', notes: 'Lake Arbuckle — 3,805 acres. C&R-friendly trophy bass lake.' },
  { id: 'fl-lake-livingston', name: 'Lake Livingston (Polk)', region: 'Central FL', county: 'Polk', acres: 305, maxDepthFt: 14, lat: 27.940, lng: -81.620, cat: 'fl-bass-lake' },
  { id: 'fl-lake-easy-polk', name: 'Lake Easy', region: 'Central FL', county: 'Polk', acres: 850, maxDepthFt: 12, lat: 27.880, lng: -81.450, cat: 'fl-bass-lake' },
  { id: 'fl-lake-clinch', name: 'Lake Clinch', region: 'Central FL', county: 'Polk', acres: 1190, maxDepthFt: 24, lat: 27.770, lng: -81.535, cat: 'fl-bass-lake' },
  { id: 'fl-lake-mary-jane', name: 'Lake Mary Jane', region: 'Central FL', county: 'Orange', acres: 1170, maxDepthFt: 12, lat: 28.390, lng: -81.140, cat: 'fl-bass-lake' },
  { id: 'fl-lake-hart', name: 'Lake Hart', region: 'Central FL', county: 'Orange', acres: 1850, maxDepthFt: 12, lat: 28.395, lng: -81.180, cat: 'fl-bass-lake' },

  // ============== STICK MARSH / TROPHY C&R LAKES ==============
  { id: 'fl-stick-marsh-supp', name: 'Stick Marsh (Headwaters Lake)', region: 'East-Central FL', county: 'Indian River / Brevard', acres: 6500, maxDepthFt: 15, lat: 27.860, lng: -80.815, cat: 'fl-stick-marsh-lake', notes: 'Stick Marsh / Farm 13 — trophy bass C&R water. Florida-strain stocking + flooded timber. 10+ lb fish realistic.' },
  { id: 'fl-farm-13', name: 'Farm 13 (Stick Marsh North)', region: 'East-Central FL', county: 'Indian River', acres: null, maxDepthFt: null, lat: 27.870, lng: -80.810, cat: 'fl-stick-marsh-lake' },
  { id: 'fl-headwaters-lake-main', name: 'Headwaters Lake (T.M. Goodwin)', region: 'East-Central FL', county: 'Brevard / Indian River', acres: 10000, maxDepthFt: 12, lat: 27.900, lng: -80.830, cat: 'fl-stick-marsh-lake', notes: 'Headwaters Lake (T.M. Goodwin WMA) — 10,000-acre trophy bass impoundment. C&R only. Florida-strain.' },
  { id: 'fl-lake-garcia', name: 'Lake Garcia', region: 'East-Central FL', county: 'Indian River', acres: 1200, maxDepthFt: 12, lat: 27.815, lng: -80.795, cat: 'fl-stick-marsh-lake' },
  { id: 'fl-lake-fellsmere', name: 'Fellsmere Reservoir', region: 'East-Central FL', county: 'Indian River', acres: null, maxDepthFt: null, lat: 27.760, lng: -80.580, cat: 'fl-stick-marsh-lake' },

  // ============== ORLANDO METRO LAKES ==============
  { id: 'fl-lake-apopka', name: 'Lake Apopka', region: 'Central FL', county: 'Orange / Lake', acres: 30562, maxDepthFt: 31, lat: 28.620, lng: -81.620, cat: 'fl-bass-lake', notes: 'Lake Apopka — 30,562 acres. Recovering from decades of agricultural pollution; bass fishery rebounding strongly. 4th largest FL lake.' },
  { id: 'fl-lake-tarpon', name: 'Lake Tarpon', region: 'Tampa Bay area', county: 'Pinellas', acres: 2534, maxDepthFt: 9, lat: 28.115, lng: -82.730, cat: 'fl-bass-lake', notes: 'Lake Tarpon — 2,534 acres. Top Florida bass lake. Bream + crappie too.' },
  { id: 'fl-lake-conway-chain', name: 'Conway Chain', region: 'Orlando Metro', county: 'Orange', acres: 1800, maxDepthFt: 40, lat: 28.470, lng: -81.345, cat: 'fl-bass-lake', notes: 'Conway Chain — Orlando residential lake chain. Deep clear water; bass + crappie + bream.' },
  { id: 'fl-lake-butler-orange', name: 'Lake Butler', region: 'Orlando Metro', county: 'Orange', acres: 1660, maxDepthFt: 35, lat: 28.490, lng: -81.530, cat: 'fl-bass-lake', notes: 'Lake Butler — Windermere chain. Trophy largemouth.' },
  { id: 'fl-windermere-chain', name: 'Windermere Chain of Lakes', region: 'Orlando Metro', county: 'Orange', acres: null, maxDepthFt: null, lat: 28.500, lng: -81.530, cat: 'fl-bass-lake', notes: 'Windermere Chain — interconnected Orlando-area lakes. Bass + crappie + bream.' },
  { id: 'fl-lake-mary', name: 'Lake Mary', region: 'Orlando Metro', county: 'Seminole', acres: 575, maxDepthFt: 22, lat: 28.760, lng: -81.320, cat: 'fl-bass-lake' },
  { id: 'fl-lake-monroe', name: 'Lake Monroe', region: 'Central FL', county: 'Volusia / Seminole', acres: 9410, maxDepthFt: 8, lat: 28.815, lng: -81.290, cat: 'fl-bass-lake', notes: 'Lake Monroe — 9,410 acres on the St. Johns River. Bass + crappie + cats.' },
  { id: 'fl-lake-jesup', name: 'Lake Jesup', region: 'Central FL', county: 'Seminole', acres: 16000, maxDepthFt: 9, lat: 28.720, lng: -81.250, cat: 'fl-bass-lake', notes: 'Lake Jesup — 16,000 acres. Massive Seminole County lake; bass + crappie + alligators.' },
  { id: 'fl-lake-poinsett', name: 'Lake Poinsett', region: 'East-Central FL', county: 'Brevard', acres: 4334, maxDepthFt: 6, lat: 28.300, lng: -80.890, cat: 'fl-bass-lake', notes: 'Lake Poinsett — St. Johns headwaters; bass + crappie.' },
  { id: 'fl-lake-washington', name: 'Lake Washington', region: 'East-Central FL', county: 'Brevard', acres: 4366, maxDepthFt: 8, lat: 28.135, lng: -80.795, cat: 'fl-bass-lake' },
  { id: 'fl-lake-winder', name: 'Lake Winder', region: 'East-Central FL', county: 'Brevard', acres: 1500, maxDepthFt: 6, lat: 28.180, lng: -80.840, cat: 'fl-bass-lake' },

  // ============== NORTH FL / GAINESVILLE AREA LAKES ==============
  { id: 'fl-lake-newnans', name: 'Newnans Lake', region: 'North-Central FL', county: 'Alachua', acres: 6800, maxDepthFt: 6, lat: 29.640, lng: -82.245, cat: 'fl-natural-warm-lake', notes: 'Newnans Lake — Gainesville. Bass + crappie + bream.' },
  { id: 'fl-lake-orange-alachua', name: 'Orange Lake', region: 'North-Central FL', county: 'Alachua / Marion', acres: 12705, maxDepthFt: 11, lat: 29.450, lng: -82.190, cat: 'fl-natural-warm-lake', notes: 'Orange Lake — 12,705-acre prairie lake. Recovering bass fishery; legendary historic.' },
  { id: 'fl-lake-lochloosa', name: 'Lochloosa Lake', region: 'North-Central FL', county: 'Alachua', acres: 5700, maxDepthFt: 9, lat: 29.510, lng: -82.155, cat: 'fl-natural-warm-lake' },
  { id: 'fl-lake-sampson', name: 'Sampson Lake', region: 'North FL', county: 'Bradford', acres: 2068, maxDepthFt: 16, lat: 29.940, lng: -82.230, cat: 'fl-natural-warm-lake' },
  { id: 'fl-lake-rowell', name: 'Rowell Lake', region: 'North FL', county: 'Bradford', acres: 480, maxDepthFt: 16, lat: 29.985, lng: -82.180, cat: 'fl-natural-warm-lake' },
  { id: 'fl-lake-santa-fe', name: 'Santa Fe Lake', region: 'North-Central FL', county: 'Alachua / Bradford', acres: 5850, maxDepthFt: 26, lat: 29.755, lng: -82.080, cat: 'fl-natural-warm-lake' },
  { id: 'fl-lake-little-santa-fe', name: 'Little Santa Fe Lake', region: 'North-Central FL', county: 'Alachua', acres: 1635, maxDepthFt: 22, lat: 29.770, lng: -82.115, cat: 'fl-natural-warm-lake' },
  { id: 'fl-lake-hampton', name: 'Hampton Lake', region: 'North FL', county: 'Bradford', acres: 880, maxDepthFt: 14, lat: 29.870, lng: -82.150, cat: 'fl-natural-warm-lake' },
  { id: 'fl-lake-altho', name: 'Altho Lake', region: 'North-Central FL', county: 'Bradford', acres: 240, maxDepthFt: 14, lat: 29.815, lng: -82.135, cat: 'fl-natural-warm-lake' },

  // ============== TALLAHASSEE / NORTH FL LAKES ==============
  { id: 'fl-lake-jackson-leon', name: 'Lake Jackson (Leon)', region: 'North FL', county: 'Leon', acres: 4004, maxDepthFt: 12, lat: 30.560, lng: -84.310, cat: 'fl-natural-warm-lake', notes: 'Lake Jackson — Tallahassee area. Periodically drains (sinkhole drain); when full, premier bass + crappie lake.' },
  { id: 'fl-lake-iamonia', name: 'Lake Iamonia', region: 'North FL', county: 'Leon', acres: 5757, maxDepthFt: 14, lat: 30.650, lng: -84.260, cat: 'fl-natural-warm-lake', notes: 'Lake Iamonia — 5,757 acres. Bass + crappie + bream.' },
  { id: 'fl-lake-miccosukee', name: 'Lake Miccosukee', region: 'North FL', county: 'Jefferson / Leon', acres: 6226, maxDepthFt: 10, lat: 30.620, lng: -84.025, cat: 'fl-natural-warm-lake', notes: 'Lake Miccosukee — 6,226 acres. Bass + crappie. Periodically drains.' },
  { id: 'fl-lake-lafayette', name: 'Lake Lafayette', region: 'North FL', county: 'Leon', acres: 1095, maxDepthFt: 12, lat: 30.430, lng: -84.215, cat: 'fl-natural-warm-lake' },

  // ============== CENTRAL/SOUTH FL ADDITIONAL LAKES ==============
  { id: 'fl-lake-istokpoga', name: 'Lake Istokpoga', region: 'South-Central FL', county: 'Highlands', acres: 27692, maxDepthFt: 10, lat: 27.380, lng: -81.290, cat: 'fl-bass-lake', notes: 'Lake Istokpoga — 27,692 acres. Top-5 FL bass lake; trophy Florida-strain + huge crappie.' },
  { id: 'fl-lake-jackson-highlands', name: 'Lake Jackson (Highlands)', region: 'South-Central FL', county: 'Highlands', acres: 3212, maxDepthFt: 25, lat: 27.475, lng: -81.500, cat: 'fl-bass-lake' },
  { id: 'fl-lake-clay-highlands', name: 'Lake Clay', region: 'South-Central FL', county: 'Highlands', acres: 700, maxDepthFt: 25, lat: 27.420, lng: -81.515, cat: 'fl-bass-lake' },
  { id: 'fl-lake-glenada', name: 'Lake Glenada', region: 'South-Central FL', county: 'Highlands', acres: 360, maxDepthFt: 14, lat: 27.475, lng: -81.500, cat: 'fl-bass-lake' },
  { id: 'fl-lake-josephine', name: 'Lake Josephine', region: 'South-Central FL', county: 'Highlands', acres: 1300, maxDepthFt: 30, lat: 27.475, lng: -81.470, cat: 'fl-bass-lake' },
  { id: 'fl-lake-blue-okeechobee', name: 'Lake Blue (Polk)', region: 'South-Central FL', county: 'Polk', acres: 720, maxDepthFt: 15, lat: 27.945, lng: -81.450, cat: 'fl-bass-lake' },
  { id: 'fl-lake-hancock', name: 'Lake Hancock', region: 'Central FL', county: 'Polk', acres: 4543, maxDepthFt: 10, lat: 27.965, lng: -81.825, cat: 'fl-bass-lake', notes: 'Lake Hancock — 4,543 acres. Heart of Peace River headwaters; bass + crappie.' },
  { id: 'fl-lake-parker', name: 'Lake Parker', region: 'Central FL', county: 'Polk', acres: 2272, maxDepthFt: 22, lat: 28.085, lng: -81.940, cat: 'fl-bass-lake' },
  { id: 'fl-lake-banana', name: 'Banana Lake', region: 'Central FL', county: 'Polk', acres: 600, maxDepthFt: 12, lat: 28.040, lng: -81.945, cat: 'fl-natural-warm-lake' },

  // ============== PANHANDLE LAKES ==============
  { id: 'fl-lake-deer-point', name: 'Deer Point Lake', region: 'Panhandle FL', county: 'Bay', acres: 4878, maxDepthFt: 18, lat: 30.270, lng: -85.620, cat: 'fl-natural-warm-lake', notes: 'Deer Point Lake — Panama City freshwater reservoir. Bass + bream + crappie + chain pickerel.' },
  { id: 'fl-lake-merritts-mill-pond', name: 'Merritts Mill Pond', region: 'Panhandle FL', county: 'Jackson', acres: 270, maxDepthFt: 35, lat: 30.795, lng: -85.155, cat: 'fl-natural-warm-lake', notes: 'Merritts Mill Pond — Jackson Co. Bass + bream + spotted bass (unique north FL).' },
  { id: 'fl-lake-victor', name: 'Lake Victor', region: 'Panhandle FL', county: 'Holmes', acres: 360, maxDepthFt: 16, lat: 30.880, lng: -85.870, cat: 'fl-natural-warm-lake' },
  { id: 'fl-lake-stone', name: 'Lake Stone', region: 'Panhandle FL', county: 'Escambia', acres: 130, maxDepthFt: 25, lat: 30.870, lng: -87.195, cat: 'fl-natural-warm-lake' },
  { id: 'fl-lake-juniper-bay', name: 'Juniper Lake', region: 'Panhandle FL', county: 'Bay', acres: 700, maxDepthFt: 24, lat: 30.290, lng: -85.860, cat: 'fl-natural-warm-lake' },
  { id: 'fl-lake-hunter', name: 'Lake Hunter', region: 'Panhandle FL', county: 'Polk', acres: 90, maxDepthFt: 15, lat: 28.040, lng: -81.965, cat: 'fl-natural-warm-lake' },

  // ============== CRYSTAL RIVER / NATURE COAST LAKES ==============
  { id: 'fl-lake-panasoffkee', name: 'Lake Panasoffkee', region: 'Nature Coast FL', county: 'Sumter', acres: 4460, maxDepthFt: 8, lat: 28.795, lng: -82.115, cat: 'fl-bass-lake', notes: 'Lake Panasoffkee — 4,460 acres. Bass + crappie + bream + sunshine bass.' },
  { id: 'fl-lake-deaton', name: 'Lake Deaton', region: 'Central FL', county: 'Sumter', acres: 100, maxDepthFt: 10, lat: 28.870, lng: -81.940, cat: 'fl-natural-warm-lake' },
  { id: 'fl-lake-okahumpka', name: 'Lake Okahumpka', region: 'Central FL', county: 'Sumter', acres: 1530, maxDepthFt: 12, lat: 28.730, lng: -81.965, cat: 'fl-natural-warm-lake' },

  // ============== OCALA AREA ==============
  { id: 'fl-lake-weir', name: 'Lake Weir', region: 'North-Central FL', county: 'Marion', acres: 5685, maxDepthFt: 28, lat: 29.020, lng: -81.945, cat: 'fl-bass-lake', notes: 'Lake Weir — 5,685 acres. Bass + crappie + bream.' },
  { id: 'fl-lake-bryant', name: 'Lake Bryant', region: 'North-Central FL', county: 'Marion', acres: 540, maxDepthFt: 22, lat: 29.085, lng: -81.840, cat: 'fl-natural-warm-lake' },
  { id: 'fl-lake-kerr', name: 'Lake Kerr', region: 'North-Central FL', county: 'Marion', acres: 2830, maxDepthFt: 24, lat: 29.380, lng: -81.755, cat: 'fl-natural-warm-lake', notes: 'Lake Kerr — Ocala National Forest. Bass + bream.' },
  { id: 'fl-lake-fore', name: 'Lake Fore Lake (Ocala NF)', region: 'North-Central FL', county: 'Marion', acres: 65, maxDepthFt: 12, lat: 29.255, lng: -81.685, cat: 'fl-natural-warm-lake' },
  { id: 'fl-lake-eaton', name: 'Lake Eaton (Ocala NF)', region: 'North-Central FL', county: 'Marion', acres: 290, maxDepthFt: 25, lat: 29.260, lng: -81.785, cat: 'fl-natural-warm-lake' },

  // ============== ST. JOHNS RIVER LAKES ==============
  { id: 'fl-lake-george-supp-extra', name: 'Lake George - East Shore Cove', region: 'St. Johns / Lake Region', county: 'Putnam / Volusia', acres: null, maxDepthFt: null, lat: 29.290, lng: -81.620, cat: 'fl-natural-warm-lake' },
  { id: 'fl-lake-disston', name: 'Lake Disston', region: 'Central FL', county: 'Flagler', acres: 1660, maxDepthFt: 15, lat: 29.470, lng: -81.430, cat: 'fl-natural-warm-lake' },
  { id: 'fl-lake-crescent', name: 'Crescent Lake (FL)', region: 'North-Central FL', county: 'Putnam / Flagler', acres: 15960, maxDepthFt: 14, lat: 29.480, lng: -81.520, cat: 'fl-natural-warm-lake', notes: 'Crescent Lake — 15,960 acres. Tannic St. Johns trib lake; bass + crappie + bream.' },
  { id: 'fl-lake-dexter', name: 'Lake Dexter', region: 'Central FL', county: 'Lake / Volusia', acres: 2050, maxDepthFt: 20, lat: 29.150, lng: -81.640, cat: 'fl-natural-warm-lake' },
  { id: 'fl-lake-norris', name: 'Lake Norris', region: 'Central FL', county: 'Lake', acres: 880, maxDepthFt: 14, lat: 28.760, lng: -81.620, cat: 'fl-natural-warm-lake' },
];

function main() {
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  const existing = JSON.parse(raw);
  const byId = new Map(existing.map((e) => [e.id, e]));

  let appended = 0, skipped = 0;
  for (const item of RAW) {
    if (byId.has(item.id)) { skipped++; continue; }
    const entry = buildFL({
      id: item.id, name: item.name, region: item.region,
      county: item.county, acres: item.acres, maxDepthFt: item.maxDepthFt,
      lat: item.lat, lng: item.lng, cat: item.cat, notes: item.notes,
    });
    existing.push(entry);
    byId.set(item.id, entry);
    appended++;
  }

  fs.writeFileSync(DATA_PATH, JSON.stringify(existing, null, 2) + '\n', 'utf8');
  const flTotal = existing.filter((e) => e.state === 'FL').length;
  console.log(`Appended ${appended}, skipped ${skipped}. FL total: ${flTotal}, Grand total: ${existing.length}`);
}

main();
