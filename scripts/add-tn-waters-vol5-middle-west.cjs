// TN Vol 5 — Middle TN + Cumberland Plateau + West TN named waters.

const fs = require('fs');
const path = require('path');
const { buildTN } = require('./_tn-water-template.cjs');

const DATA_PATH = path.join(__dirname, '..', 'data', 'waterbodies.json');

const RAW = [
  // ============== MIDDLE TN — Smallmouth Rivers ==============
  { id: 'tn-river-duck-upper', name: 'Duck River — Upper (Manchester)', county: 'Coffee', lat: 35.485, lng: -86.080, cat: 'middle-tn-river', region: 'Middle TN' },
  { id: 'tn-river-duck-shelbyville', name: 'Duck River — Shelbyville', county: 'Bedford', lat: 35.485, lng: -86.460, cat: 'middle-tn-river', region: 'Middle TN' },
  { id: 'tn-river-duck-columbia', name: 'Duck River — Columbia', county: 'Maury', lat: 35.615, lng: -87.035, cat: 'middle-tn-river', region: 'Middle TN', notes: 'Duck River — Columbia area. Middle TN smallmouth + spotted bass. Float trip country.' },
  { id: 'tn-river-duck-centerville', name: 'Duck River — Centerville', county: 'Hickman', lat: 35.785, lng: -87.465, cat: 'middle-tn-river', region: 'Middle TN' },
  { id: 'tn-river-duck-hurricane-mills', name: 'Duck River — Hurricane Mills', county: 'Humphreys', lat: 35.985, lng: -87.825, cat: 'middle-tn-river', region: 'Middle TN' },
  { id: 'tn-river-piney', name: 'Piney River', county: 'Hickman', lat: 35.835, lng: -87.580, cat: 'middle-tn-river', region: 'Middle TN' },
  { id: 'tn-river-buffalo-upper', name: 'Buffalo River — Upper', county: 'Lawrence', lat: 35.215, lng: -87.385, cat: 'middle-tn-river', region: 'Middle TN', notes: 'Upper Buffalo — float-friendly middle TN smallmouth. Many access points.' },
  { id: 'tn-river-buffalo-middle', name: 'Buffalo River — Middle (Linden)', county: 'Perry', lat: 35.625, lng: -87.830, cat: 'middle-tn-river', region: 'Middle TN' },
  { id: 'tn-river-buffalo-lower', name: 'Buffalo River — Lower (Lobelville)', county: 'Perry / Wayne', lat: 35.755, lng: -87.795, cat: 'middle-tn-river', region: 'Middle TN' },
  { id: 'tn-river-harpeth-upper', name: 'Harpeth River — Upper (Franklin)', county: 'Williamson', lat: 35.910, lng: -86.910, cat: 'middle-tn-river', region: 'Middle TN' },
  { id: 'tn-river-harpeth-mid', name: 'Harpeth River — Middle (Bellevue)', county: 'Davidson / Cheatham', lat: 36.030, lng: -87.000, cat: 'middle-tn-river', region: 'Middle TN' },
  { id: 'tn-river-harpeth-lower', name: 'Harpeth River — Lower (Ashland City)', county: 'Cheatham', lat: 36.275, lng: -87.060, cat: 'middle-tn-river', region: 'Middle TN' },
  { id: 'tn-river-harpeth-narrows', name: 'Harpeth Narrows (Pinkerton Park)', county: 'Williamson', lat: 35.910, lng: -86.870, cat: 'middle-tn-river', region: 'Middle TN' },
  { id: 'tn-river-stones-east-fork', name: 'East Fork Stones River', county: 'Rutherford', lat: 35.870, lng: -86.330, cat: 'middle-tn-river', region: 'Middle TN' },
  { id: 'tn-river-stones-west-fork', name: 'West Fork Stones River', county: 'Rutherford', lat: 35.870, lng: -86.430, cat: 'middle-tn-river', region: 'Middle TN' },
  { id: 'tn-river-stones-percy-supp', name: 'Stones River (Percy Priest)', county: 'Davidson / Wilson', lat: 36.130, lng: -86.625, cat: 'middle-tn-river', region: 'Middle TN' },
  { id: 'tn-river-caney-upper', name: 'Caney Fork — Upper (Above Center Hill)', county: 'White / DeKalb', lat: 35.985, lng: -85.510, cat: 'cumberland-plateau-stream', region: 'Middle TN' },
  { id: 'tn-river-rocky-river-warren', name: 'Rocky River (Warren)', county: 'Warren', lat: 35.685, lng: -85.770, cat: 'cumberland-plateau-stream', region: 'Middle TN' },
  { id: 'tn-river-cumberland-plateau-pine-creek', name: 'Pine Creek (Cumberland Plateau)', county: 'Putnam', lat: 36.030, lng: -85.215, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },
  { id: 'tn-river-flat-creek-warren', name: 'Flat Creek (Warren)', county: 'Warren', lat: 35.720, lng: -85.860, cat: 'middle-tn-river', region: 'Middle TN' },
  { id: 'tn-river-collins-warren', name: 'Collins River — Lower', county: 'Warren', lat: 35.685, lng: -85.770, cat: 'middle-tn-river', region: 'Middle TN' },
  { id: 'tn-river-mulberry-creek', name: 'Mulberry Creek', county: 'Lincoln', lat: 35.220, lng: -86.595, cat: 'middle-tn-river', region: 'Middle TN' },
  { id: 'tn-river-richland-creek-giles', name: 'Richland Creek (Giles)', county: 'Giles', lat: 35.220, lng: -87.020, cat: 'middle-tn-river', region: 'Middle TN' },
  { id: 'tn-river-shoal-creek-lawrence', name: 'Shoal Creek (Lawrence)', county: 'Lawrence', lat: 35.230, lng: -87.350, cat: 'middle-tn-river', region: 'Middle TN' },
  { id: 'tn-river-big-bigby-creek', name: 'Big Bigby Creek', county: 'Maury', lat: 35.555, lng: -87.250, cat: 'middle-tn-river', region: 'Middle TN' },
  { id: 'tn-river-bigby-creek', name: 'Bigby Creek', county: 'Maury', lat: 35.700, lng: -87.045, cat: 'middle-tn-river', region: 'Middle TN' },
  { id: 'tn-river-fountain-creek', name: 'Fountain Creek', county: 'Maury', lat: 35.610, lng: -86.870, cat: 'middle-tn-river', region: 'Middle TN' },
  { id: 'tn-river-bushy-creek', name: 'Bushy Creek', county: 'Lewis / Hickman', lat: 35.640, lng: -87.475, cat: 'middle-tn-river', region: 'Middle TN' },
  { id: 'tn-river-tumbling-creek-perry', name: 'Tumbling Creek (Perry)', county: 'Perry', lat: 35.700, lng: -87.870, cat: 'middle-tn-river', region: 'Middle TN' },
  { id: 'tn-river-blue-creek', name: 'Blue Creek', county: 'Lewis', lat: 35.500, lng: -87.595, cat: 'middle-tn-river', region: 'Middle TN' },
  { id: 'tn-river-spring-creek-mid', name: 'Spring Creek (Middle TN)', county: 'Putnam', lat: 36.165, lng: -85.510, cat: 'middle-tn-river', region: 'Middle TN' },
  { id: 'tn-river-flynns-creek', name: 'Flynns Creek (Sumner)', county: 'Sumner', lat: 36.420, lng: -86.580, cat: 'middle-tn-river', region: 'Middle TN' },
  { id: 'tn-river-station-camp-creek', name: 'Station Camp Creek', county: 'Sumner', lat: 36.385, lng: -86.560, cat: 'middle-tn-river', region: 'Middle TN' },
  { id: 'tn-river-bledsoe-creek', name: 'Bledsoe Creek', county: 'Sumner', lat: 36.420, lng: -86.450, cat: 'middle-tn-river', region: 'Middle TN' },
  { id: 'tn-river-drakes-creek-sumner', name: 'Drakes Creek (Sumner)', county: 'Sumner', lat: 36.420, lng: -86.520, cat: 'middle-tn-river', region: 'Middle TN' },
  { id: 'tn-river-mansker-creek', name: 'Mansker Creek', county: 'Sumner / Davidson', lat: 36.330, lng: -86.700, cat: 'middle-tn-river', region: 'Middle TN' },
  { id: 'tn-river-richland-creek-davidson', name: 'Richland Creek (Davidson)', county: 'Davidson', lat: 36.130, lng: -86.880, cat: 'middle-tn-river', region: 'Middle TN' },
  { id: 'tn-river-mill-creek-davidson', name: 'Mill Creek (Davidson)', county: 'Davidson', lat: 36.080, lng: -86.700, cat: 'middle-tn-river', region: 'Middle TN' },
  { id: 'tn-river-falling-water-river-davidson', name: 'Falling Water Creek', county: 'Davidson', lat: 36.155, lng: -86.720, cat: 'middle-tn-river', region: 'Middle TN' },
  { id: 'tn-river-yellow-creek-dickson', name: 'Yellow Creek (Dickson)', county: 'Dickson', lat: 36.155, lng: -87.400, cat: 'middle-tn-river', region: 'Middle TN' },
  { id: 'tn-river-jones-creek', name: 'Jones Creek (Dickson)', county: 'Dickson', lat: 36.050, lng: -87.420, cat: 'middle-tn-river', region: 'Middle TN' },
  { id: 'tn-river-piney-creek-hickman', name: 'Piney Creek (Hickman)', county: 'Hickman', lat: 35.830, lng: -87.620, cat: 'middle-tn-river', region: 'Middle TN' },

  // ============== CUMBERLAND PLATEAU streams ==============
  { id: 'tn-plateau-clear-creek', name: 'Clear Creek (Cumberland Plateau)', county: 'Morgan / Cumberland', lat: 36.070, lng: -84.860, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },
  { id: 'tn-plateau-emory-tribs', name: 'Emory River — Upper', county: 'Morgan', lat: 36.100, lng: -84.620, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },
  { id: 'tn-plateau-daddys-creek', name: 'Daddys Creek', county: 'Cumberland', lat: 36.020, lng: -84.880, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },
  { id: 'tn-plateau-obed-tribs-2', name: 'White Creek', county: 'Cumberland', lat: 36.155, lng: -84.755, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },
  { id: 'tn-plateau-flat-fork-creek', name: 'Flat Fork Creek', county: 'Morgan', lat: 36.075, lng: -84.490, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },
  { id: 'tn-plateau-island-creek', name: 'Island Creek', county: 'Morgan', lat: 36.115, lng: -84.540, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },
  { id: 'tn-plateau-shaeves-creek', name: 'Shaeves Creek', county: 'Cumberland', lat: 36.005, lng: -84.795, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },
  { id: 'tn-plateau-bone-camp-creek', name: 'Bone Camp Creek', county: 'Fentress', lat: 36.380, lng: -84.870, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },
  { id: 'tn-plateau-clear-fork-bsf', name: 'Clear Fork (Big South Fork)', county: 'Scott / Fentress', lat: 36.470, lng: -84.685, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },
  { id: 'tn-plateau-bsf-north-white-oak', name: 'North White Oak Creek', county: 'Fentress', lat: 36.330, lng: -84.800, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },
  { id: 'tn-plateau-bsf-no-business-creek', name: 'No Business Creek', county: 'Scott', lat: 36.450, lng: -84.715, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },
  { id: 'tn-plateau-bsf-bandy-creek', name: 'Bandy Creek', county: 'Scott', lat: 36.495, lng: -84.690, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },
  { id: 'tn-plateau-bsf-pine-creek', name: 'Pine Creek (Big South Fork)', county: 'Scott', lat: 36.510, lng: -84.700, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },
  { id: 'tn-plateau-bsf-station-creek', name: 'Station Camp Creek (BSF)', county: 'Scott', lat: 36.555, lng: -84.690, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },
  { id: 'tn-plateau-bsf-rock-creek', name: 'Rock Creek (BSF)', county: 'Scott', lat: 36.530, lng: -84.620, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },
  { id: 'tn-plateau-bsf-troublesome-creek', name: 'Troublesome Creek', county: 'Scott', lat: 36.510, lng: -84.605, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },
  { id: 'tn-plateau-bsf-charit-creek', name: 'Charit Creek', county: 'Fentress / Scott', lat: 36.400, lng: -84.720, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },
  { id: 'tn-plateau-bsf-laurel-fork', name: 'Laurel Fork (BSF)', county: 'Scott', lat: 36.510, lng: -84.640, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },
  { id: 'tn-plateau-wolf-river-fentress', name: 'Wolf River (Fentress)', county: 'Fentress', lat: 36.485, lng: -85.110, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },
  { id: 'tn-plateau-east-fork-obey', name: 'East Fork Obey River', county: 'Fentress', lat: 36.470, lng: -85.020, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },
  { id: 'tn-plateau-west-fork-obey', name: 'West Fork Obey River', county: 'Fentress', lat: 36.470, lng: -85.130, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },
  { id: 'tn-plateau-east-fork-clear-creek', name: 'East Fork Clear Creek', county: 'Morgan', lat: 36.060, lng: -84.760, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },
  { id: 'tn-plateau-west-fork-clear-creek', name: 'West Fork Clear Creek', county: 'Cumberland', lat: 36.040, lng: -84.875, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },
  { id: 'tn-plateau-bend-creek', name: 'Bend Creek (Cumberland)', county: 'Cumberland', lat: 35.940, lng: -84.985, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },
  { id: 'tn-plateau-cane-creek-marion', name: 'Cane Creek (Marion)', county: 'Marion', lat: 35.250, lng: -85.700, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },
  { id: 'tn-plateau-fiery-gizzard-creek', name: 'Fiery Gizzard Creek', county: 'Grundy', lat: 35.205, lng: -85.682, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },
  { id: 'tn-plateau-collins-river-upper', name: 'Collins River — Upper (Plateau)', county: 'Grundy / Warren', lat: 35.485, lng: -85.770, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },
  { id: 'tn-plateau-rocky-river-upper', name: 'Rocky River — Upper (Plateau)', county: 'Van Buren', lat: 35.720, lng: -85.535, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },
  { id: 'tn-plateau-cane-creek-vb', name: 'Cane Creek (Van Buren — Fall Creek Falls)', county: 'Van Buren', lat: 35.668, lng: -85.355, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },
  { id: 'tn-plateau-piney-creek-overton', name: 'Piney Creek (Overton)', county: 'Overton', lat: 36.420, lng: -85.275, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },
  { id: 'tn-plateau-spring-creek-overton', name: 'Spring Creek (Overton)', county: 'Overton', lat: 36.350, lng: -85.345, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },
  { id: 'tn-plateau-blackburn-fork', name: 'Blackburn Fork', county: 'Jackson', lat: 36.345, lng: -85.665, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },
  { id: 'tn-plateau-roaring-river', name: 'Roaring River', county: 'Jackson', lat: 36.345, lng: -85.520, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },
  { id: 'tn-plateau-east-fork-roaring-river', name: 'East Fork Roaring River', county: 'Jackson', lat: 36.330, lng: -85.475, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },
  { id: 'tn-plateau-falling-water-river', name: 'Falling Water River', county: 'Putnam', lat: 36.030, lng: -85.450, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },
  { id: 'tn-plateau-cumberland-river-upper-fentress', name: 'Cumberland River — TN Headwaters', county: 'Fentress', lat: 36.560, lng: -84.760, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },
  { id: 'tn-plateau-laurel-creek-cumberland', name: 'Laurel Creek (Cumberland Plateau)', county: 'Cumberland', lat: 35.910, lng: -84.985, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },
  { id: 'tn-plateau-byrd-creek-cumberland', name: 'Byrd Creek (Cumberland Plateau)', county: 'Cumberland', lat: 35.940, lng: -85.020, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },
  { id: 'tn-plateau-bee-creek', name: 'Bee Creek (Plateau)', county: 'Cumberland', lat: 35.920, lng: -84.945, cat: 'cumberland-plateau-stream', region: 'Cumberland Plateau' },

  // ============== WEST TN LAKES ==============
  { id: 'tn-west-lake-graham', name: 'Lake Graham', county: 'Madison', acres: 555, maxDepthFt: 25, lat: 35.610, lng: -88.770, cat: 'west-tn-lake', region: 'West TN' },
  { id: 'tn-west-lake-pin-oak', name: 'Pin Oak Lake (Natchez Trace SP)', county: 'Henderson / Carroll', acres: 690, maxDepthFt: 35, lat: 35.815, lng: -88.265, cat: 'west-tn-lake', region: 'West TN', notes: 'Pin Oak Lake — Natchez Trace SP. Largemouth + crappie + cats; quality state-park fishery.' },
  { id: 'tn-west-lake-cub', name: 'Cub Lake (Natchez Trace SP)', county: 'Carroll', acres: 58, maxDepthFt: 22, lat: 35.820, lng: -88.260, cat: 'state-park-lake', region: 'West TN' },
  { id: 'tn-west-lake-maple-pond', name: 'Maple Creek Lake', county: 'Carroll', acres: 90, maxDepthFt: 18, lat: 36.005, lng: -88.405, cat: 'west-tn-lake', region: 'West TN' },
  { id: 'tn-west-lake-fayette-pit', name: 'Fayette Pit Lake', county: 'Fayette', acres: 100, maxDepthFt: 30, lat: 35.140, lng: -89.555, cat: 'west-tn-lake', region: 'West TN' },
  { id: 'tn-west-lake-beech', name: 'Beech Lake', county: 'Henderson', acres: 220, maxDepthFt: 22, lat: 35.640, lng: -88.380, cat: 'west-tn-lake', region: 'West TN' },
  { id: 'tn-west-lake-redbud', name: 'Redbud Lake', county: 'Fayette', acres: 65, maxDepthFt: 22, lat: 35.090, lng: -89.385, cat: 'west-tn-lake', region: 'West TN' },
  { id: 'tn-west-lake-truitt', name: 'Truitt Lake', county: 'Fayette', acres: 30, maxDepthFt: 18, lat: 35.105, lng: -89.420, cat: 'west-tn-lake', region: 'West TN' },
  { id: 'tn-west-lake-poplar-tree', name: 'Poplar Tree Lake (Meeman-Shelby SF)', county: 'Shelby', acres: 50, maxDepthFt: 18, lat: 35.330, lng: -90.050, cat: 'state-park-lake', region: 'West TN' },
  { id: 'tn-west-lake-piersol-pond', name: 'Piersol Pond', county: 'Shelby', acres: 18, maxDepthFt: 12, lat: 35.330, lng: -90.040, cat: 'state-park-lake', region: 'West TN' },
  { id: 'tn-west-lake-herb-parsons', name: 'Herb Parsons Lake', county: 'Fayette', acres: 175, maxDepthFt: 22, lat: 35.205, lng: -89.555, cat: 'west-tn-lake', region: 'West TN', notes: 'Herb Parsons — TWRA managed lake, popular Memphis-area destination. Florida-strain bass + crappie + cats.' },
  { id: 'tn-west-lake-glenn-spring', name: 'Glenn Springs Lake', county: 'Tipton', acres: 200, maxDepthFt: 18, lat: 35.450, lng: -89.760, cat: 'west-tn-lake', region: 'West TN' },
  { id: 'tn-west-lake-laxton', name: 'Laxton Lake', county: 'Hardeman', acres: 22, maxDepthFt: 12, lat: 35.255, lng: -88.985, cat: 'west-tn-lake', region: 'West TN' },
  { id: 'tn-west-lake-mclemoresville', name: 'McLemoresville Lake', county: 'Carroll', acres: 30, maxDepthFt: 14, lat: 35.985, lng: -88.585, cat: 'west-tn-lake', region: 'West TN' },
  { id: 'tn-west-lake-trenton', name: 'Trenton City Lake', county: 'Gibson', acres: 35, maxDepthFt: 14, lat: 35.985, lng: -88.940, cat: 'west-tn-lake', region: 'West TN' },
  { id: 'tn-west-lake-milan', name: 'Milan City Lake', county: 'Gibson', acres: 25, maxDepthFt: 14, lat: 35.920, lng: -88.760, cat: 'west-tn-lake', region: 'West TN' },
  { id: 'tn-west-lake-ridgely', name: 'Ridgely City Lake', county: 'Lake', acres: 22, maxDepthFt: 12, lat: 36.260, lng: -89.485, cat: 'west-tn-lake', region: 'West TN' },

  // ============== MS RIVER OXBOWS / RESERVOIRS ==============
  { id: 'tn-msr-oxbow-tigrett', name: 'Tigrett Lake (Mississippi Oxbow)', county: 'Dyer', acres: 600, maxDepthFt: 14, lat: 35.985, lng: -89.355, cat: 'mississippi-oxbow', region: 'West TN', notes: 'Tigrett — Mississippi River oxbow with classic cypress/lily-pad backwater bass + crappie fishery.' },
  { id: 'tn-msr-oxbow-mooseheart', name: 'Mooseheart Lake', county: 'Lauderdale', acres: 200, maxDepthFt: 12, lat: 35.730, lng: -89.870, cat: 'mississippi-oxbow', region: 'West TN' },
  { id: 'tn-msr-oxbow-old-mississippi', name: 'Old Mississippi (Memphis area oxbow)', county: 'Shelby', acres: null, maxDepthFt: null, lat: 35.170, lng: -90.150, cat: 'mississippi-oxbow', region: 'West TN' },
  { id: 'tn-msr-oxbow-mud-island-lake', name: 'Mud Island Lake (Memphis)', county: 'Shelby', acres: 100, maxDepthFt: 18, lat: 35.155, lng: -90.075, cat: 'mississippi-oxbow', region: 'West TN' },
  { id: 'tn-msr-oxbow-mclemoresville', name: 'Open Lake (Lauderdale County)', county: 'Lauderdale', acres: 550, maxDepthFt: 18, lat: 35.620, lng: -89.870, cat: 'mississippi-oxbow', region: 'West TN' },
  { id: 'tn-msr-oxbow-eagle-lake-shelby', name: 'Eagle Lake (Shelby)', county: 'Shelby', acres: 280, maxDepthFt: 12, lat: 35.355, lng: -90.045, cat: 'mississippi-oxbow', region: 'West TN' },
  { id: 'tn-msr-oxbow-island-37-area', name: 'Island 37 Lakes', county: 'Tipton', acres: null, maxDepthFt: null, lat: 35.520, lng: -89.985, cat: 'mississippi-oxbow', region: 'West TN' },
  { id: 'tn-msr-oxbow-fort-pillow-lakes', name: 'Fort Pillow Lake', county: 'Lauderdale', acres: 25, maxDepthFt: 14, lat: 35.640, lng: -89.835, cat: 'mississippi-oxbow', region: 'West TN' },
  { id: 'tn-msr-oxbow-key-corner', name: 'Key Corner Oxbow', county: 'Lauderdale', acres: 130, maxDepthFt: 14, lat: 35.720, lng: -89.920, cat: 'mississippi-oxbow', region: 'West TN' },
  { id: 'tn-msr-oxbow-randolph-bluffs', name: 'Randolph Bluffs Oxbow', county: 'Tipton', acres: 65, maxDepthFt: 12, lat: 35.575, lng: -89.940, cat: 'mississippi-oxbow', region: 'West TN' },

  // ============== Holston / Nolichucky / French Broad Tribs (East TN) ==============
  { id: 'tn-east-river-nolichucky', name: 'Nolichucky River', county: 'Greene / Cocke', lat: 35.985, lng: -82.830, cat: 'middle-tn-river', region: 'East TN', notes: 'Nolichucky — wild smallmouth + walleye + occasional muskie. East TN floating river.' },
  { id: 'tn-east-river-pigeon-lower', name: 'Pigeon River — Lower (Newport)', county: 'Cocke', lat: 35.965, lng: -83.190, cat: 'middle-tn-river', region: 'East TN' },
  { id: 'tn-east-river-french-broad-upper', name: 'French Broad — Upper TN (Newport)', county: 'Cocke', lat: 35.965, lng: -83.190, cat: 'middle-tn-river', region: 'East TN' },
  { id: 'tn-east-river-french-broad-douglas', name: 'French Broad — Above Douglas Lake', county: 'Sevier', lat: 36.030, lng: -83.485, cat: 'middle-tn-river', region: 'East TN' },
  { id: 'tn-east-river-holston-mid', name: 'Holston River — Mid (Mascot)', county: 'Knox', lat: 36.062, lng: -83.770, cat: 'middle-tn-river', region: 'East TN' },
  { id: 'tn-east-river-holston-lower', name: 'Holston River — Lower (Above Fort Loudoun)', county: 'Knox', lat: 35.945, lng: -83.900, cat: 'middle-tn-river', region: 'East TN' },
  { id: 'tn-east-river-clinch-mid', name: 'Clinch River — Above Norris', county: 'Hawkins / Hancock', lat: 36.430, lng: -83.220, cat: 'middle-tn-river', region: 'East TN' },
  { id: 'tn-east-river-clinch-lower', name: 'Clinch River — Below Melton Hill', county: 'Anderson / Loudon', lat: 35.860, lng: -84.255, cat: 'middle-tn-river', region: 'East TN' },
  { id: 'tn-east-river-powell-river', name: 'Powell River', county: 'Hancock / Claiborne', lat: 36.530, lng: -83.470, cat: 'middle-tn-river', region: 'East TN' },
  { id: 'tn-east-river-emory-river-segments', name: 'Emory River — Lower (Above Watts Bar)', county: 'Roane', lat: 35.875, lng: -84.555, cat: 'middle-tn-river', region: 'East TN' },
  { id: 'tn-east-river-piney-roane', name: 'Piney River (Roane)', county: 'Roane', lat: 35.795, lng: -84.755, cat: 'middle-tn-river', region: 'East TN' },
  { id: 'tn-east-river-tennessee-loudon', name: 'Tennessee River — Loudon Area', county: 'Loudon', lat: 35.730, lng: -84.330, cat: 'middle-tn-river', region: 'East TN' },
  { id: 'tn-east-river-little-emory', name: 'Little Emory River', county: 'Roane', lat: 35.910, lng: -84.495, cat: 'middle-tn-river', region: 'East TN' },
  { id: 'tn-east-river-poplar-creek', name: 'Poplar Creek (Oak Ridge)', county: 'Anderson', lat: 35.975, lng: -84.310, cat: 'middle-tn-river', region: 'East TN' },
  { id: 'tn-east-river-bull-run-creek', name: 'Bull Run Creek', county: 'Knox', lat: 36.090, lng: -83.985, cat: 'middle-tn-river', region: 'East TN' },
  { id: 'tn-east-river-beaver-creek-knox', name: 'Beaver Creek (Knox)', county: 'Knox', lat: 36.045, lng: -84.135, cat: 'middle-tn-river', region: 'East TN' },
  { id: 'tn-east-river-flat-creek-knox', name: 'Flat Creek (Knox)', county: 'Knox', lat: 36.040, lng: -84.045, cat: 'middle-tn-river', region: 'East TN' },
  { id: 'tn-east-river-bays-mountain-creek', name: 'Bays Mountain Creek', county: 'Sullivan', acres: null, maxDepthFt: null, lat: 36.490, lng: -82.700, cat: 'middle-tn-river', region: 'East TN' },
];

function main() {
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  const existing = JSON.parse(raw);
  const byId = new Map(existing.map((e) => [e.id, e]));

  let appended = 0, skipped = 0;
  for (const item of RAW) {
    if (byId.has(item.id)) { skipped++; continue; }
    const entry = buildTN({
      id: item.id, name: item.name, region: item.region,
      county: item.county, acres: item.acres, maxDepthFt: item.maxDepthFt,
      lat: item.lat, lng: item.lng, cat: item.cat, notes: item.notes,
    });
    existing.push(entry);
    byId.set(item.id, entry);
    appended++;
  }

  fs.writeFileSync(DATA_PATH, JSON.stringify(existing, null, 2) + '\n', 'utf8');
  const tnTotal = existing.filter((e) => e.state === 'TN').length;
  console.log(`Appended ${appended}, skipped ${skipped}. TN total: ${tnTotal}, Grand total: ${existing.length}`);
}

main();
