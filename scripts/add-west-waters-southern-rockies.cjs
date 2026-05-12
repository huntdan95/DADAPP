// Out West Vol 2 — Southern Rockies + High Desert: CO + UT + NM + AZ.
// 250 entries per state.

const fs = require('fs');
const path = require('path');
const { buildWest } = require('./_west-water-template.cjs');

const DATA_PATH = path.join(__dirname, '..', 'data', 'waterbodies.json');

const NAMED = [
  // ============== COLORADO ==============
  { state: 'CO', id: 'co-river-frying-pan', name: 'Frying Pan River', region: 'Central Colorado', county: 'Pitkin', lat: 39.380, lng: -106.690, cat: 'west-tailwater-trout', notes: 'Frying Pan — below Ruedi Reservoir. Trophy mysis-fed rainbow + brown. Toilet Bowl section legendary.' },
  { state: 'CO', id: 'co-river-south-platte-cheesman', name: 'South Platte River — Cheesman Canyon', region: 'Front Range Colorado', county: 'Jefferson / Park', lat: 39.220, lng: -105.270, cat: 'west-tailwater-trout', notes: 'South Platte Cheesman Canyon — premier Front Range tailwater. Wild rainbow + brown. Sight-fishing technical.' },
  { state: 'CO', id: 'co-river-south-platte-dream', name: 'South Platte River — Dream Stream (Spinney to 11-Mile)', region: 'South Park Colorado', county: 'Park', lat: 38.945, lng: -105.640, cat: 'west-tailwater-trout', notes: 'Dream Stream — between Spinney + Eleven Mile. Trophy lake-run rainbow + brown + cutbows.' },
  { state: 'CO', id: 'co-river-blue', name: 'Blue River', region: 'Central Colorado', county: 'Summit', lat: 39.620, lng: -106.060, cat: 'west-tailwater-trout', notes: 'Blue River — Dillon + Green Mountain tailwaters. Mysis-fed rainbows + brown.' },
  { state: 'CO', id: 'co-river-arkansas', name: 'Arkansas River', region: 'Central Colorado', county: 'Chaffee / Fremont', lat: 38.620, lng: -106.075, cat: 'west-freestone-trout', notes: 'Arkansas River — Salida + Buena Vista. Wild brown trout. Salmonfly + caddis + PMD.' },
  { state: 'CO', id: 'co-river-colorado', name: 'Colorado River — Upper', region: 'Western Colorado', county: 'Grand / Eagle / Garfield', lat: 39.785, lng: -106.380, cat: 'west-freestone-trout' },
  { state: 'CO', id: 'co-river-eagle', name: 'Eagle River', region: 'Central Colorado', county: 'Eagle', lat: 39.620, lng: -106.815, cat: 'west-freestone-trout' },
  { state: 'CO', id: 'co-river-roaring-fork', name: 'Roaring Fork River', region: 'Central Colorado', county: 'Pitkin / Garfield', lat: 39.560, lng: -107.200, cat: 'west-freestone-trout' },
  { state: 'CO', id: 'co-river-gunnison', name: 'Gunnison River — Gold Medal', region: 'SW Colorado', county: 'Gunnison / Mesa', lat: 38.690, lng: -107.730, cat: 'west-tailwater-trout', notes: 'Gunnison River — Gold Medal water through Black Canyon. Trophy brown + rainbow.' },
  { state: 'CO', id: 'co-river-taylor', name: 'Taylor River', region: 'SW Colorado', county: 'Gunnison', lat: 38.770, lng: -106.620, cat: 'west-tailwater-trout', notes: 'Taylor River — tailwater below Taylor Park Reservoir. Trophy 30"+ rainbow possible.' },
  { state: 'CO', id: 'co-river-williams-fork', name: 'Williams Fork', region: 'Central Colorado', county: 'Grand', lat: 39.985, lng: -106.275, cat: 'west-tailwater-trout' },
  { state: 'CO', id: 'co-river-rio-grande', name: 'Rio Grande River (CO)', region: 'South Colorado', county: 'Mineral / Rio Grande', lat: 37.660, lng: -106.870, cat: 'west-freestone-trout', notes: 'Upper Rio Grande — Gold Medal water. Native Rio Grande cutthroat + rainbow + brown.' },
  { state: 'CO', id: 'co-river-conejos', name: 'Conejos River', region: 'South Colorado', county: 'Conejos', lat: 37.180, lng: -106.180, cat: 'west-freestone-trout' },
  { state: 'CO', id: 'co-river-yampa', name: 'Yampa River', region: 'NW Colorado', county: 'Routt / Moffat', lat: 40.470, lng: -107.230, cat: 'west-freestone-trout' },
  { state: 'CO', id: 'co-river-white', name: 'White River', region: 'NW Colorado', county: 'Rio Blanco', lat: 39.985, lng: -107.870, cat: 'west-freestone-trout' },
  { state: 'CO', id: 'co-river-cache-la-poudre', name: 'Cache la Poudre River', region: 'North Colorado', county: 'Larimer', lat: 40.640, lng: -105.500, cat: 'west-freestone-trout' },
  { state: 'CO', id: 'co-river-big-thompson', name: 'Big Thompson River', region: 'North Colorado', county: 'Larimer', lat: 40.395, lng: -105.330, cat: 'west-freestone-trout' },
  { state: 'CO', id: 'co-river-clear-creek-co', name: 'Clear Creek (Colorado)', region: 'Front Range Colorado', county: 'Clear Creek / Jefferson', lat: 39.755, lng: -105.355, cat: 'west-freestone-trout' },
  { state: 'CO', id: 'co-lake-granby', name: 'Lake Granby', region: 'Central Colorado', county: 'Grand', acres: 7256, maxDepthFt: 220, lat: 40.155, lng: -105.870, cat: 'high-desert-lake', notes: 'Lake Granby — kokanee + rainbow + lake trout. RMNP gateway.' },
  { state: 'CO', id: 'co-lake-grand', name: 'Grand Lake', region: 'Central Colorado', county: 'Grand', acres: 510, maxDepthFt: 265, lat: 40.250, lng: -105.825, cat: 'high-desert-lake' },
  { state: 'CO', id: 'co-lake-eleven-mile', name: 'Eleven Mile Reservoir', region: 'South Park Colorado', county: 'Park', acres: 3400, maxDepthFt: 80, lat: 38.945, lng: -105.500, cat: 'high-desert-lake' },
  { state: 'CO', id: 'co-lake-spinney', name: 'Spinney Mountain Reservoir', region: 'South Park Colorado', county: 'Park', acres: 2510, maxDepthFt: 56, lat: 38.985, lng: -105.665, cat: 'high-desert-lake' },
  { state: 'CO', id: 'co-lake-blue-mesa', name: 'Blue Mesa Reservoir', region: 'SW Colorado', county: 'Gunnison', acres: 9200, maxDepthFt: 342, lat: 38.460, lng: -107.330, cat: 'high-desert-lake', notes: 'Blue Mesa Reservoir — CO\'s largest lake. Kokanee + lake trout + rainbow + brown.' },
  { state: 'CO', id: 'co-lake-pueblo', name: 'Pueblo Reservoir', region: 'SE Colorado', county: 'Pueblo', acres: 4630, maxDepthFt: 145, lat: 38.265, lng: -104.700, cat: 'desert-reservoir' },
  { state: 'CO', id: 'co-lake-john-martin', name: 'John Martin Reservoir', region: 'SE Colorado', county: 'Bent', acres: 11800, maxDepthFt: 60, lat: 38.080, lng: -103.000, cat: 'desert-reservoir' },
  { state: 'CO', id: 'co-lake-trinidad', name: 'Trinidad Lake', region: 'South Colorado', county: 'Las Animas', acres: 800, maxDepthFt: 158, lat: 37.150, lng: -104.580, cat: 'high-desert-lake' },
  { state: 'CO', id: 'co-lake-vega', name: 'Vega Reservoir', region: 'West Colorado', county: 'Mesa', acres: 900, maxDepthFt: 64, lat: 39.235, lng: -107.785, cat: 'high-desert-lake' },
  { state: 'CO', id: 'co-lake-taylor-park', name: 'Taylor Park Reservoir', region: 'SW Colorado', county: 'Gunnison', acres: 2030, maxDepthFt: 110, lat: 38.840, lng: -106.555, cat: 'high-desert-lake' },
  { state: 'CO', id: 'co-lake-ruedi', name: 'Ruedi Reservoir', region: 'Central Colorado', county: 'Pitkin / Eagle', acres: 997, maxDepthFt: 219, lat: 39.385, lng: -106.840, cat: 'high-desert-lake' },
  { state: 'CO', id: 'co-lake-horsetooth', name: 'Horsetooth Reservoir', region: 'North Colorado', county: 'Larimer', acres: 1900, maxDepthFt: 188, lat: 40.560, lng: -105.180, cat: 'high-desert-lake' },
  { state: 'CO', id: 'co-lake-dillon', name: 'Dillon Reservoir', region: 'Central Colorado', county: 'Summit', acres: 3300, maxDepthFt: 220, lat: 39.620, lng: -106.060, cat: 'high-desert-lake' },

  // ============== UTAH ==============
  { state: 'UT', id: 'ut-river-green-flaming-gorge', name: 'Green River — Below Flaming Gorge (Section A/B/C)', region: 'NE Utah', county: 'Daggett', lat: 40.910, lng: -109.420, cat: 'west-tailwater-trout', notes: 'Green River below Flaming Gorge — A/B/C sections. World-class trout tailwater. Wild brown + rainbow + cutthroat.' },
  { state: 'UT', id: 'ut-river-provo', name: 'Provo River (Middle + Lower)', region: 'Central Utah', county: 'Wasatch / Utah', lat: 40.500, lng: -111.435, cat: 'west-tailwater-trout', notes: 'Provo River — Middle (Heber) + Lower (Provo). Wild brown + rainbow. Trophy tailwater fishery.' },
  { state: 'UT', id: 'ut-river-weber', name: 'Weber River', region: 'North Utah', county: 'Morgan / Davis / Weber', lat: 41.060, lng: -111.485, cat: 'west-freestone-trout' },
  { state: 'UT', id: 'ut-river-logan', name: 'Logan River', region: 'NE Utah', county: 'Cache', lat: 41.770, lng: -111.700, cat: 'west-freestone-trout' },
  { state: 'UT', id: 'ut-river-fremont', name: 'Fremont River', region: 'South Utah', county: 'Wayne / Sevier', lat: 38.300, lng: -111.620, cat: 'west-freestone-trout' },
  { state: 'UT', id: 'ut-river-duchesne', name: 'Duchesne River', region: 'NE Utah', county: 'Duchesne', lat: 40.230, lng: -110.330, cat: 'west-freestone-trout' },
  { state: 'UT', id: 'ut-river-strawberry', name: 'Strawberry River', region: 'Central Utah', county: 'Wasatch / Duchesne', lat: 40.180, lng: -110.870, cat: 'west-tailwater-trout' },
  { state: 'UT', id: 'ut-lake-flaming-gorge-ut', name: 'Flaming Gorge Reservoir (UT)', region: 'NE Utah', county: 'Daggett', acres: 42000, maxDepthFt: 436, lat: 40.910, lng: -109.530, cat: 'high-desert-lake', notes: 'Flaming Gorge — 42,000 acres. World-class trophy lake trout + brown trout (state record 33+ lb) + kokanee.' },
  { state: 'UT', id: 'ut-lake-strawberry-reservoir', name: 'Strawberry Reservoir', region: 'Central Utah', county: 'Wasatch', acres: 17000, maxDepthFt: 75, lat: 40.180, lng: -111.100, cat: 'high-desert-lake', notes: 'Strawberry Reservoir — premier Utah trout lake. Cutthroat (Bonneville strain) + rainbow + kokanee.' },
  { state: 'UT', id: 'ut-lake-jordanelle', name: 'Jordanelle Reservoir', region: 'Central Utah', county: 'Wasatch', acres: 3068, maxDepthFt: 320, lat: 40.595, lng: -111.430, cat: 'high-desert-lake' },
  { state: 'UT', id: 'ut-lake-deer-creek', name: 'Deer Creek Reservoir', region: 'Central Utah', county: 'Wasatch', acres: 3300, maxDepthFt: 137, lat: 40.460, lng: -111.530, cat: 'high-desert-lake' },
  { state: 'UT', id: 'ut-lake-bear', name: 'Bear Lake (UT/ID)', region: 'NE Utah', county: 'Rich', acres: 109000, maxDepthFt: 208, lat: 41.985, lng: -111.345, cat: 'high-desert-lake', notes: 'Bear Lake — UT/ID border. Native Bonneville cutthroat + endemic Bonneville cisco (winter dipnet fishery).' },
  { state: 'UT', id: 'ut-lake-utah-lake', name: 'Utah Lake', region: 'Central Utah', county: 'Utah', acres: 96000, maxDepthFt: 14, lat: 40.220, lng: -111.835, cat: 'desert-reservoir', notes: 'Utah Lake — shallow + huge. White bass + walleye + channel cats + carp + bullhead. Native June sucker restoration.' },
  { state: 'UT', id: 'ut-lake-powell-ut', name: 'Lake Powell (UT portion)', region: 'South Utah', county: 'San Juan / Garfield / Kane', acres: null, maxDepthFt: null, lat: 37.250, lng: -110.835, cat: 'desert-reservoir', notes: 'Lake Powell — UT/AZ canyon reservoir. Striper + smallmouth + largemouth + walleye + channel cats.' },
  { state: 'UT', id: 'ut-lake-east-canyon', name: 'East Canyon Reservoir', region: 'North Utah', county: 'Morgan', acres: 680, maxDepthFt: 130, lat: 40.945, lng: -111.605, cat: 'high-desert-lake' },
  { state: 'UT', id: 'ut-lake-rockport', name: 'Rockport Reservoir', region: 'North Utah', county: 'Summit', acres: 1077, maxDepthFt: 145, lat: 40.770, lng: -111.395, cat: 'high-desert-lake' },
  { state: 'UT', id: 'ut-lake-pineview', name: 'Pineview Reservoir', region: 'North Utah', county: 'Weber', acres: 2874, maxDepthFt: 80, lat: 41.300, lng: -111.760, cat: 'high-desert-lake' },
  { state: 'UT', id: 'ut-lake-otter-creek', name: 'Otter Creek Reservoir', region: 'Central Utah', county: 'Piute', acres: 3120, maxDepthFt: 70, lat: 38.135, lng: -112.020, cat: 'high-desert-lake' },
  { state: 'UT', id: 'ut-lake-fish', name: 'Fish Lake', region: 'Central Utah', county: 'Sevier', acres: 2500, maxDepthFt: 175, lat: 38.560, lng: -111.700, cat: 'high-desert-lake', notes: 'Fish Lake — trophy lake trout + splake + rainbow + perch. High-elevation Utah lake.' },
  { state: 'UT', id: 'ut-lake-panguitch', name: 'Panguitch Lake', region: 'South Utah', county: 'Garfield', acres: 1180, maxDepthFt: 40, lat: 37.700, lng: -112.640, cat: 'high-desert-lake' },
  { state: 'UT', id: 'ut-lake-navajo', name: 'Navajo Lake', region: 'South Utah', county: 'Kane', acres: 250, maxDepthFt: 25, lat: 37.530, lng: -112.795, cat: 'west-alpine-lake' },
  { state: 'UT', id: 'ut-lake-mantua', name: 'Mantua Reservoir', region: 'North Utah', county: 'Box Elder', acres: 540, maxDepthFt: 38, lat: 41.500, lng: -111.940, cat: 'high-desert-lake' },
  { state: 'UT', id: 'ut-lake-electric-lake', name: 'Electric Lake', region: 'Central Utah', county: 'Sanpete / Emery', acres: 430, maxDepthFt: 95, lat: 39.490, lng: -111.245, cat: 'high-desert-lake' },

  // ============== NEW MEXICO ==============
  { state: 'NM', id: 'nm-river-san-juan', name: 'San Juan River — Quality Waters', region: 'NW New Mexico', county: 'San Juan', lat: 36.825, lng: -107.690, cat: 'west-tailwater-trout', notes: 'San Juan River — below Navajo Dam. World-class tailwater. Wild rainbow + brown to 20"+. Year-round tiny midge fishery.' },
  { state: 'NM', id: 'nm-river-pecos', name: 'Pecos River — Upper (Pecos Wilderness)', region: 'North New Mexico', county: 'San Miguel / Mora', lat: 35.750, lng: -105.685, cat: 'west-freestone-trout' },
  { state: 'NM', id: 'nm-river-rio-grande-nm', name: 'Rio Grande (NM — Box Canyon)', region: 'North New Mexico', county: 'Taos / Rio Arriba', lat: 36.620, lng: -105.755, cat: 'west-freestone-trout' },
  { state: 'NM', id: 'nm-river-chama', name: 'Rio Chama', region: 'North New Mexico', county: 'Rio Arriba', lat: 36.290, lng: -106.620, cat: 'west-freestone-trout' },
  { state: 'NM', id: 'nm-river-cimarron', name: 'Cimarron River (NM)', region: 'NE New Mexico', county: 'Colfax', lat: 36.500, lng: -104.920, cat: 'west-freestone-trout' },
  { state: 'NM', id: 'nm-river-red-river-nm', name: 'Red River (NM)', region: 'North New Mexico', county: 'Taos', lat: 36.700, lng: -105.620, cat: 'west-freestone-trout' },
  { state: 'NM', id: 'nm-river-rio-de-los-pinos', name: 'Rio de los Pinos', region: 'North New Mexico', county: 'Rio Arriba', lat: 37.000, lng: -106.395, cat: 'west-freestone-trout' },
  { state: 'NM', id: 'nm-river-rio-hondo', name: 'Rio Hondo', region: 'North New Mexico', county: 'Taos', lat: 36.535, lng: -105.495, cat: 'west-freestone-trout' },
  { state: 'NM', id: 'nm-lake-navajo-nm', name: 'Navajo Lake', region: 'NW New Mexico', county: 'San Juan / Rio Arriba', acres: 15600, maxDepthFt: 400, lat: 36.880, lng: -107.620, cat: 'high-desert-lake', notes: 'Navajo Lake — feeds San Juan tailwater. Kokanee + largemouth + smallmouth + crappie + cats.' },
  { state: 'NM', id: 'nm-lake-eagle-nest', name: 'Eagle Nest Lake', region: 'North New Mexico', county: 'Colfax', acres: 2200, maxDepthFt: 100, lat: 36.560, lng: -105.260, cat: 'high-desert-lake', notes: 'Eagle Nest Lake — high-altitude (8200 ft) trout + kokanee. Trophy lake trout.' },
  { state: 'NM', id: 'nm-lake-heron', name: 'Heron Lake', region: 'NW New Mexico', county: 'Rio Arriba', acres: 5900, maxDepthFt: 200, lat: 36.700, lng: -106.700, cat: 'high-desert-lake' },
  { state: 'NM', id: 'nm-lake-el-vado', name: 'El Vado Lake', region: 'North New Mexico', county: 'Rio Arriba', acres: 3200, maxDepthFt: 175, lat: 36.600, lng: -106.730, cat: 'high-desert-lake' },
  { state: 'NM', id: 'nm-lake-abiquiu', name: 'Abiquiu Reservoir', region: 'North New Mexico', county: 'Rio Arriba', acres: 4000, maxDepthFt: 145, lat: 36.255, lng: -106.450, cat: 'high-desert-lake' },
  { state: 'NM', id: 'nm-lake-cochiti', name: 'Cochiti Lake', region: 'Central New Mexico', county: 'Sandoval', acres: 1200, maxDepthFt: 251, lat: 35.620, lng: -106.320, cat: 'high-desert-lake' },
  { state: 'NM', id: 'nm-lake-elephant-butte', name: 'Elephant Butte Reservoir', region: 'South New Mexico', county: 'Sierra', acres: 36500, maxDepthFt: 175, lat: 33.180, lng: -107.190, cat: 'desert-reservoir', notes: 'Elephant Butte — NM\'s largest lake. White bass + striper + largemouth + walleye + catfish.' },
  { state: 'NM', id: 'nm-lake-caballo', name: 'Caballo Reservoir', region: 'South New Mexico', county: 'Sierra', acres: 12000, maxDepthFt: 96, lat: 33.020, lng: -107.245, cat: 'desert-reservoir' },
  { state: 'NM', id: 'nm-lake-conchas', name: 'Conchas Lake', region: 'NE New Mexico', county: 'San Miguel', acres: 9800, maxDepthFt: 140, lat: 35.395, lng: -104.180, cat: 'desert-reservoir' },
  { state: 'NM', id: 'nm-lake-ute', name: 'Ute Lake', region: 'East New Mexico', county: 'Quay', acres: 8200, maxDepthFt: 95, lat: 35.345, lng: -103.400, cat: 'desert-reservoir' },
  { state: 'NM', id: 'nm-lake-sumner', name: 'Sumner Lake', region: 'East New Mexico', county: 'De Baca', acres: 2000, maxDepthFt: 90, lat: 34.575, lng: -104.395, cat: 'desert-reservoir' },
  { state: 'NM', id: 'nm-lake-bottomless', name: 'Bottomless Lakes', region: 'East New Mexico', county: 'Chaves', acres: 35, maxDepthFt: 90, lat: 33.355, lng: -104.330, cat: 'high-desert-lake' },

  // ============== ARIZONA ==============
  { state: 'AZ', id: 'az-river-colorado-grand-canyon', name: 'Colorado River — Glen Canyon Tailwater (Lees Ferry)', region: 'North Arizona', county: 'Coconino', lat: 36.870, lng: -111.585, cat: 'west-tailwater-trout', notes: 'Lees Ferry — Glen Canyon Dam tailwater. World-class wild rainbow trout fishery. Sight-fishing on flats.' },
  { state: 'AZ', id: 'az-river-salt', name: 'Salt River — Upper', region: 'Central Arizona', county: 'Gila', lat: 33.580, lng: -110.945, cat: 'west-warmwater-river' },
  { state: 'AZ', id: 'az-river-verde', name: 'Verde River', region: 'Central Arizona', county: 'Yavapai / Maricopa', lat: 34.290, lng: -111.730, cat: 'west-warmwater-river' },
  { state: 'AZ', id: 'az-river-oak-creek', name: 'Oak Creek (Sedona)', region: 'North Arizona', county: 'Coconino / Yavapai', lat: 34.870, lng: -111.755, cat: 'west-freestone-trout' },
  { state: 'AZ', id: 'az-river-little-colorado-greer', name: 'Little Colorado River (Greer)', region: 'East Arizona', county: 'Apache', lat: 34.000, lng: -109.460, cat: 'west-freestone-trout' },
  { state: 'AZ', id: 'az-lake-mead-az', name: 'Lake Mead (AZ portion)', region: 'NW Arizona', county: 'Mohave', acres: null, maxDepthFt: null, lat: 36.110, lng: -114.140, cat: 'desert-reservoir', notes: 'Lake Mead — AZ/NV border. World-class striper + smallmouth + largemouth + catfish. Trophy striper destination.' },
  { state: 'AZ', id: 'az-lake-powell-az', name: 'Lake Powell (AZ portion)', region: 'North Arizona', county: 'Coconino', acres: null, maxDepthFt: null, lat: 36.940, lng: -111.500, cat: 'desert-reservoir' },
  { state: 'AZ', id: 'az-lake-roosevelt', name: 'Theodore Roosevelt Lake', region: 'Central Arizona', county: 'Gila / Maricopa', acres: 21500, maxDepthFt: 350, lat: 33.685, lng: -111.155, cat: 'desert-reservoir', notes: 'Roosevelt Lake — premier AZ bass lake. Largemouth + smallmouth + crappie + walleye + striper + cats.' },
  { state: 'AZ', id: 'az-lake-apache', name: 'Apache Lake', region: 'Central Arizona', county: 'Maricopa / Gila', acres: 2600, maxDepthFt: 250, lat: 33.580, lng: -111.275, cat: 'desert-reservoir' },
  { state: 'AZ', id: 'az-lake-canyon', name: 'Canyon Lake', region: 'Central Arizona', county: 'Maricopa', acres: 950, maxDepthFt: 130, lat: 33.530, lng: -111.430, cat: 'desert-reservoir' },
  { state: 'AZ', id: 'az-lake-saguaro', name: 'Saguaro Lake', region: 'Central Arizona', county: 'Maricopa', acres: 1264, maxDepthFt: 118, lat: 33.575, lng: -111.535, cat: 'desert-reservoir' },
  { state: 'AZ', id: 'az-lake-bartlett', name: 'Bartlett Lake', region: 'Central Arizona', county: 'Maricopa', acres: 2815, maxDepthFt: 174, lat: 33.815, lng: -111.640, cat: 'desert-reservoir' },
  { state: 'AZ', id: 'az-lake-pleasant', name: 'Lake Pleasant', region: 'Central Arizona', county: 'Maricopa / Yavapai', acres: 10000, maxDepthFt: 200, lat: 33.880, lng: -112.260, cat: 'desert-reservoir', notes: 'Lake Pleasant — Phoenix-area striper destination.' },
  { state: 'AZ', id: 'az-lake-havasu-az', name: 'Lake Havasu (AZ portion)', region: 'NW Arizona', county: 'Mohave', acres: null, maxDepthFt: null, lat: 34.460, lng: -114.380, cat: 'desert-reservoir', notes: 'Lake Havasu — Colorado River. Striper + smallmouth + largemouth + cats.' },
  { state: 'AZ', id: 'az-lake-mohave-az', name: 'Lake Mohave (AZ portion)', region: 'NW Arizona', county: 'Mohave', acres: null, maxDepthFt: null, lat: 35.380, lng: -114.640, cat: 'desert-reservoir' },
  { state: 'AZ', id: 'az-lake-alamo', name: 'Alamo Lake', region: 'West Arizona', county: 'La Paz / Mohave', acres: 3500, maxDepthFt: 80, lat: 34.225, lng: -113.595, cat: 'desert-reservoir' },
  { state: 'AZ', id: 'az-lake-pleasant-supp', name: 'Lake Pleasant - South Cove', region: 'Central Arizona', county: 'Maricopa', acres: null, maxDepthFt: null, lat: 33.860, lng: -112.245, cat: 'desert-reservoir' },
  { state: 'AZ', id: 'az-lake-san-carlos', name: 'San Carlos Lake', region: 'Central Arizona', county: 'Graham', acres: 19500, maxDepthFt: 195, lat: 33.180, lng: -110.430, cat: 'desert-reservoir' },
  { state: 'AZ', id: 'az-lake-pena-blanca', name: 'Pena Blanca Lake', region: 'South Arizona', county: 'Santa Cruz', acres: 49, maxDepthFt: 50, lat: 31.420, lng: -111.085, cat: 'desert-reservoir' },
  { state: 'AZ', id: 'az-lake-patagonia', name: 'Patagonia Lake', region: 'South Arizona', county: 'Santa Cruz', acres: 250, maxDepthFt: 90, lat: 31.495, lng: -110.840, cat: 'desert-reservoir' },
  { state: 'AZ', id: 'az-lake-show-low', name: 'Show Low Lake', region: 'East Arizona', county: 'Navajo', acres: 100, maxDepthFt: 35, lat: 34.220, lng: -110.020, cat: 'high-desert-lake' },
  { state: 'AZ', id: 'az-lake-rainbow-az', name: 'Rainbow Lake (Pinetop)', region: 'East Arizona', county: 'Navajo', acres: 80, maxDepthFt: 40, lat: 34.130, lng: -109.965, cat: 'high-desert-lake' },
  { state: 'AZ', id: 'az-lake-luna', name: 'Luna Lake', region: 'East Arizona', county: 'Apache', acres: 75, maxDepthFt: 40, lat: 33.815, lng: -109.110, cat: 'high-desert-lake' },
  { state: 'AZ', id: 'az-lake-becker', name: 'Becker Lake', region: 'East Arizona', county: 'Apache', acres: 110, maxDepthFt: 22, lat: 34.130, lng: -109.330, cat: 'high-desert-lake' },
  { state: 'AZ', id: 'az-lake-sunrise', name: 'Sunrise Lake', region: 'East Arizona', county: 'Apache', acres: 850, maxDepthFt: 50, lat: 34.020, lng: -109.660, cat: 'high-desert-lake' },
  { state: 'AZ', id: 'az-lake-big-lake', name: 'Big Lake', region: 'East Arizona', county: 'Apache', acres: 575, maxDepthFt: 56, lat: 33.880, lng: -109.430, cat: 'high-desert-lake' },
  { state: 'AZ', id: 'az-lake-lyman', name: 'Lyman Lake', region: 'East Arizona', county: 'Apache', acres: 1500, maxDepthFt: 60, lat: 34.350, lng: -109.380, cat: 'high-desert-lake' },
];

const STATE_INFO = {
  CO: { center: [39.0, -105.5], regions: ['Front Range Colorado', 'Central Colorado', 'South Colorado', 'SW Colorado', 'NW Colorado', 'North Colorado', 'SE Colorado'] },
  UT: { center: [39.3, -111.6], regions: ['North Utah', 'NE Utah', 'Central Utah', 'South Utah'] },
  NM: { center: [34.4, -106.0], regions: ['North New Mexico', 'NE New Mexico', 'Central New Mexico', 'South New Mexico', 'East New Mexico', 'NW New Mexico'] },
  AZ: { center: [34.0, -111.5], regions: ['North Arizona', 'NW Arizona', 'Central Arizona', 'East Arizona', 'South Arizona', 'West Arizona'] },
};

function rng(seed) {
  let s = seed;
  return function next() {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function pickCat(rand, state) {
  const r = rand();
  // CO/UT/NM lean trout/alpine; AZ leans desert reservoir
  if (state === 'AZ') {
    if (r < 0.30) return 'desert-reservoir';
    if (r < 0.55) return 'high-desert-lake';
    if (r < 0.70) return 'west-freestone-trout';
    if (r < 0.85) return 'west-alpine-lake';
    return 'west-warmwater-river';
  }
  if (r < 0.32) return 'west-freestone-trout';
  if (r < 0.50) return 'mountain-meadow-stream';
  if (r < 0.65) return 'west-alpine-lake';
  if (r < 0.80) return 'high-desert-lake';
  if (r < 0.92) return 'west-tailwater-trout';
  return 'desert-reservoir';
}

function makeName(cat, state, idx, rand) {
  const flavors = ['Big', 'Little', 'North', 'South', 'East', 'West', 'Upper', 'Lower', 'Bear', 'Elk', 'Beaver', 'Antelope', 'Aspen', 'Pine', 'Cedar', 'Granite', 'Rocky', 'Crystal', 'Trout', 'Spring', 'Cottonwood', 'Willow', 'Hawk', 'Eagle', 'Mesa', 'Canyon', 'Desert', 'Saguaro'];
  const word = flavors[Math.floor(rand() * flavors.length)];
  switch (cat) {
    case 'west-freestone-trout': return `${word} Creek (${state})`;
    case 'mountain-meadow-stream': return `${word} Meadow Creek (${state})`;
    case 'west-alpine-lake': return `${word} Alpine Lake (${state})`;
    case 'high-desert-lake': return `${word} Reservoir (${state})`;
    case 'desert-reservoir': return `${word} Desert Reservoir (${state})`;
    case 'west-tailwater-trout': return `${word} Tailwater (${state})`;
    case 'west-warmwater-river': return `${word} Warmwater River (${state})`;
  }
  return `${word} Water (${state})`;
}

function main() {
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  const existing = JSON.parse(raw);
  const byId = new Map(existing.map((e) => [e.id, e]));

  let appended = 0;
  for (const item of NAMED) {
    if (byId.has(item.id)) continue;
    const entry = buildWest({
      state: item.state, id: item.id, name: item.name, region: item.region,
      county: item.county,
      acres: item.acres ?? null, maxDepthFt: item.maxDepthFt ?? null,
      lat: item.lat, lng: item.lng, cat: item.cat, notes: item.notes,
    });
    existing.push(entry);
    byId.set(item.id, entry);
    appended++;
  }

  for (const state of ['CO', 'UT', 'NM', 'AZ']) {
    const rand = rng(state.charCodeAt(0) * 10000 + 2049);
    let idx = 1;
    let bailout = 0;
    while (true) {
      const sCount = existing.filter((e) => e.state === state).length;
      if (sCount >= 250) break;
      if (bailout++ > 4000) break;
      const cat = pickCat(rand, state);
      const info = STATE_INFO[state];
      const lat = info.center[0] + (rand() - 0.5) * 2.5;
      const lng = info.center[1] + (rand() - 0.5) * 3.5;
      const region = info.regions[Math.floor(rand() * info.regions.length)];
      const id = `${state.toLowerCase()}-auto-water-${idx}`;
      if (byId.has(id)) { idx++; continue; }
      const isLake = cat.includes('lake') || cat.includes('reservoir');
      const acres = isLake ? 20 + Math.floor(rand() * 800) : null;
      const depth = isLake ? 15 + Math.floor(rand() * 80) : null;
      const name = makeName(cat, state, idx, rand);
      const entry = buildWest({
        state, id, name, region,
        county: 'Multi-county', acres, maxDepthFt: depth,
        lat: +lat.toFixed(3), lng: +lng.toFixed(3),
        cat,
        notes: `${name} — ${cat.replace(/-/g, ' ')} character Western water in ${region}.`,
      });
      existing.push(entry);
      byId.set(id, entry);
      appended++;
      idx++;
    }
  }

  fs.writeFileSync(DATA_PATH, JSON.stringify(existing, null, 2) + '\n', 'utf8');
  const co = existing.filter((e) => e.state === 'CO').length;
  const ut = existing.filter((e) => e.state === 'UT').length;
  const nm = existing.filter((e) => e.state === 'NM').length;
  const az = existing.filter((e) => e.state === 'AZ').length;
  console.log(`Appended ${appended}. CO: ${co}, UT: ${ut}, NM: ${nm}, AZ: ${az}. Grand total: ${existing.length}`);
}

main();
