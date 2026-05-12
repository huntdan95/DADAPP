// FL Vol 8 — All Florida rivers + brackish spring rivers.
// Brackish spring rivers (Crystal/Homosassa/Chassahowitzka/Weeki/etc.) are
// flagged with the fl-river-tidal-spring category which surfaces the
// fresh/brackish split + species-by-zone breakdown.

const fs = require('fs');
const path = require('path');
const { buildFL } = require('./_fl-water-template.cjs');

const DATA_PATH = path.join(__dirname, '..', 'data', 'waterbodies.json');

const RAW = [
  // ============== BRACKISH SPRING RIVERS (Nature Coast) ==============
  { id: 'fl-river-weeki-wachee', name: 'Weeki Wachee River', region: 'Nature Coast FL', county: 'Hernando', lat: 28.515, lng: -82.575, cat: 'fl-river-tidal-spring', brackish: true, notes: 'Weeki Wachee River — 72°F spring source. UPPER: gin-clear freshwater with manatees + bass + bream. LOWER (last 2 miles): brackish — snook + redfish + sheepshead.' },
  { id: 'fl-river-pithlachascotee', name: 'Pithlachascotee River (Cotee)', region: 'Nature Coast FL', county: 'Pasco', lat: 28.265, lng: -82.715, cat: 'fl-river-tidal-spring', brackish: true, notes: 'Cotee River — New Port Richey. Brackish lower river — snook + redfish + trout.' },
  { id: 'fl-river-anclote', name: 'Anclote River', region: 'Nature Coast FL', county: 'Pasco', lat: 28.180, lng: -82.770, cat: 'fl-river-tidal-spring', brackish: true, notes: 'Anclote River — Tarpon Springs area. Brackish lower river; snook + redfish + tarpon.' },
  { id: 'fl-river-aripeka', name: 'Aripeka River + Hammock Creek', region: 'Nature Coast FL', county: 'Pasco / Hernando', lat: 28.430, lng: -82.660, cat: 'fl-river-tidal-spring', brackish: true },
  { id: 'fl-river-mud-bay', name: 'Mud River (Hudson)', region: 'Nature Coast FL', county: 'Pasco', lat: 28.355, lng: -82.700, cat: 'fl-river-tidal-spring', brackish: true },
  { id: 'fl-river-hernando-beach', name: 'Hernando Beach Bayou System', region: 'Nature Coast FL', county: 'Hernando', lat: 28.470, lng: -82.660, cat: 'fl-river-tidal-spring', brackish: true },
  { id: 'fl-river-salt-river-hernando', name: 'Salt River (Hernando — Bayport)', region: 'Nature Coast FL', county: 'Hernando', lat: 28.535, lng: -82.660, cat: 'fl-river-tidal-spring', brackish: true },
  { id: 'fl-river-mason-creek', name: 'Mason Creek (Homosassa)', region: 'Nature Coast FL', county: 'Citrus', lat: 28.770, lng: -82.605, cat: 'fl-river-tidal-spring', brackish: true },
  { id: 'fl-river-st-martins', name: 'St. Martins River', region: 'Nature Coast FL', county: 'Citrus', lat: 28.870, lng: -82.640, cat: 'fl-river-tidal-spring', brackish: true },
  { id: 'fl-river-cross-creek', name: 'Cross Creek (Homosassa)', region: 'Nature Coast FL', county: 'Citrus', lat: 28.785, lng: -82.605, cat: 'fl-river-tidal-spring', brackish: true },
  { id: 'fl-river-withlacoochee-mouth', name: 'Withlacoochee Mouth (Yankeetown)', region: 'Nature Coast FL', county: 'Levy', lat: 29.020, lng: -82.770, cat: 'fl-river-tidal-spring', brackish: true, notes: 'Withlacoochee mouth at Yankeetown — brackish + estuary. Snook + redfish + trout + tarpon.' },
  { id: 'fl-river-suwannee-mouth', name: 'Suwannee River Mouth (Suwannee, FL)', region: 'Nature Coast FL', county: 'Dixie / Levy', lat: 29.270, lng: -83.155, cat: 'fl-river-tidal-spring', brackish: true, notes: 'Suwannee River mouth — brackish + estuary. Snook + redfish + trout + occasional Gulf sturgeon (DO NOT TARGET).' },

  // ============== NORTH FL BRACKISH RIVERS ==============
  { id: 'fl-river-st-marks', name: 'St. Marks River', region: 'Big Bend FL', county: 'Wakulla', lat: 30.155, lng: -84.205, cat: 'fl-river-tidal-spring', brackish: true, notes: 'St. Marks River — 72°F spring source. Brackish lower at St. Marks. Snook (rare here), redfish, trout, sheepshead. UPPER: bream + bass.' },
  { id: 'fl-river-wacissa', name: 'Wacissa River', region: 'Big Bend FL', county: 'Jefferson', lat: 30.330, lng: -83.985, cat: 'fl-spring-headwater', notes: 'Wacissa — pure freshwater spring. Bass + bream + stumpknockers.' },
  { id: 'fl-river-aucilla', name: 'Aucilla River', region: 'Big Bend FL', county: 'Jefferson / Taylor', lat: 30.130, lng: -83.965, cat: 'fl-river-blackwater', notes: 'Aucilla River — blackwater + spring-fed. Bass + bream + cats.' },
  { id: 'fl-river-econfina-bigbend', name: 'Econfina River (Big Bend)', region: 'Big Bend FL', county: 'Taylor', lat: 30.040, lng: -83.875, cat: 'fl-river-blackwater', brackish: true, notes: 'Econfina River — blackwater with brackish lower. Multi-zone fishery.' },
  { id: 'fl-river-steinhatchee', name: 'Steinhatchee River', region: 'Big Bend FL', county: 'Taylor / Dixie', lat: 29.670, lng: -83.385, cat: 'fl-river-tidal-spring', brackish: true, notes: 'Steinhatchee River — brackish + spring-fed. Famous scallop season + snook + redfish + trout.' },
  { id: 'fl-river-st-marys', name: 'St. Marys River', region: 'NE FL / GA border', county: 'Nassau', lat: 30.700, lng: -81.640, cat: 'fl-river-blackwater', notes: 'St. Marys River — FL/GA border blackwater. Bass + bream + redbreast + cats.' },
  { id: 'fl-river-nassau', name: 'Nassau River', region: 'NE FL', county: 'Nassau', lat: 30.555, lng: -81.490, cat: 'fl-river-blackwater', brackish: true, notes: 'Nassau River — blackwater with brackish lower. Crab Creek/Crawford Creek tributaries.' },
  { id: 'fl-river-tolomato', name: 'Tolomato River', region: 'NE FL', county: 'St. Johns', lat: 30.000, lng: -81.330, cat: 'fl-river-tidal-spring', brackish: true, notes: 'Tolomato River — part of NE FL ICW. Brackish — snook (rare here), redfish, trout, flounder.' },
  { id: 'fl-river-matanzas', name: 'Matanzas River', region: 'NE FL', county: 'St. Johns', lat: 29.715, lng: -81.260, cat: 'fl-river-tidal-spring', brackish: true, notes: 'Matanzas River — south of St. Augustine. Brackish; redfish + trout + flounder + sheepshead.' },
  { id: 'fl-river-halifax', name: 'Halifax River', region: 'East-Central FL', county: 'Volusia', lat: 29.230, lng: -81.020, cat: 'fl-river-tidal-spring', brackish: true, notes: 'Halifax River — Daytona ICW. Brackish; redfish + trout + flounder + tarpon.' },
  { id: 'fl-river-tomoka', name: 'Tomoka River', region: 'East-Central FL', county: 'Volusia', lat: 29.305, lng: -81.115, cat: 'fl-river-tidal-spring', brackish: true, notes: 'Tomoka River — Ormond Beach. Brackish + freshwater split; snook, redfish, trout, bass (upper).' },

  // ============== BLACKWATER RIVERS (Panhandle + North FL) ==============
  { id: 'fl-river-escambia', name: 'Escambia River', region: 'Panhandle FL', county: 'Escambia / Santa Rosa', lat: 30.620, lng: -87.230, cat: 'fl-river-panhandle', notes: 'Escambia River — main panhandle bass + bream + cat river.' },
  { id: 'fl-river-yellow', name: 'Yellow River', region: 'Panhandle FL', county: 'Santa Rosa / Okaloosa', lat: 30.620, lng: -86.560, cat: 'fl-river-panhandle', notes: 'Yellow River — blackwater panhandle. Bass + bream + trophy flathead.' },
  { id: 'fl-river-blackwater', name: 'Blackwater River', region: 'Panhandle FL', county: 'Santa Rosa', lat: 30.755, lng: -87.040, cat: 'fl-river-panhandle' },
  { id: 'fl-river-shoal', name: 'Shoal River', region: 'Panhandle FL', county: 'Okaloosa / Walton', lat: 30.760, lng: -86.515, cat: 'fl-river-panhandle' },
  { id: 'fl-river-choctawhatchee', name: 'Choctawhatchee River', region: 'Panhandle FL', county: 'Holmes / Washington / Walton / Bay', lat: 30.500, lng: -85.945, cat: 'fl-river-panhandle', notes: 'Choctawhatchee River — major panhandle blackwater. Bass + bream + cats + Gulf sturgeon (protected).' },
  { id: 'fl-river-apalachicola', name: 'Apalachicola River', region: 'Panhandle FL', county: 'Gadsden / Liberty / Calhoun / Gulf / Franklin', lat: 30.085, lng: -85.020, cat: 'fl-river-panhandle', notes: 'Apalachicola River — major Panhandle river. FL\'s only striped bass run. Trophy flathead cats + bream + bass.' },
  { id: 'fl-river-chipola', name: 'Chipola River', region: 'Panhandle FL', county: 'Jackson / Calhoun', lat: 30.640, lng: -85.220, cat: 'fl-river-blackwater', notes: 'Chipola River — spring-fed blackwater. Spotted bass (unique panhandle), bass + bream + cats.' },
  { id: 'fl-river-econfina-panhandle', name: 'Econfina Creek (Panhandle)', region: 'Panhandle FL', county: 'Bay / Washington', lat: 30.480, lng: -85.560, cat: 'fl-river-blackwater', notes: 'Econfina Creek — spring-fed blackwater. Bass + bream.' },
  { id: 'fl-river-ochlockonee', name: 'Ochlockonee River', region: 'Big Bend FL', county: 'Wakulla / Liberty / Franklin', lat: 30.220, lng: -84.485, cat: 'fl-river-blackwater', notes: 'Ochlockonee River — blackwater. Bass + bream + trophy bluegill + striped bass (some).' },
  { id: 'fl-river-sopchoppy', name: 'Sopchoppy River', region: 'Big Bend FL', county: 'Wakulla', lat: 30.060, lng: -84.490, cat: 'fl-river-blackwater' },
  { id: 'fl-river-fenholloway', name: 'Fenholloway River', region: 'Big Bend FL', county: 'Taylor', lat: 30.040, lng: -83.685, cat: 'fl-river-blackwater', brackish: true },
  { id: 'fl-river-spring-warrior', name: 'Spring Warrior Creek', region: 'Big Bend FL', county: 'Taylor', lat: 30.000, lng: -83.685, cat: 'fl-river-blackwater', brackish: true },

  // ============== CENTRAL FL BASS RIVERS ==============
  { id: 'fl-river-ocklawaha', name: 'Ocklawaha River', region: 'Central FL', county: 'Marion / Putnam', lat: 29.430, lng: -81.665, cat: 'fl-river-bass', notes: 'Ocklawaha River — premier central FL bass river. Trophy largemouth + bream + crappie. Rodman Reservoir on the river.' },
  { id: 'fl-river-st-johns-headwaters', name: 'St. Johns River — Headwaters', region: 'East-Central FL', county: 'Indian River / Brevard', lat: 27.870, lng: -80.835, cat: 'fl-river-bass', notes: 'St. Johns headwaters — Headwaters Lake area. Bass + crappie.' },
  { id: 'fl-river-st-johns-mid', name: 'St. Johns River — Mid (DeLand/Astor)', region: 'Central FL', county: 'Volusia / Lake', lat: 29.030, lng: -81.500, cat: 'fl-river-bass', notes: 'Mid St. Johns — DeLand to Astor. Bass + bream + crappie + American shad (winter run).' },
  { id: 'fl-river-st-johns-palatka', name: 'St. Johns River — Palatka', region: 'NE FL', county: 'Putnam', lat: 29.650, lng: -81.640, cat: 'fl-river-bass', brackish: true, notes: 'St. Johns at Palatka — tidal but freshwater. Bass + crappie + shad + striped bass + cats.' },
  { id: 'fl-river-st-johns-jacksonville-supp', name: 'St. Johns River — Jacksonville (Brackish)', region: 'NE FL', county: 'Duval', lat: 30.330, lng: -81.660, cat: 'fl-river-tidal-spring', brackish: true, notes: 'St. Johns at Jacksonville — fully brackish/tidal. Snook (rare), redfish, trout, flounder, sheepshead, sharks.' },
  { id: 'fl-river-hillsborough', name: 'Hillsborough River', region: 'Tampa Bay area', county: 'Hillsborough', lat: 28.030, lng: -82.260, cat: 'fl-river-bass', brackish: true, notes: 'Hillsborough River — Tampa. Bass + bream upper; lower at Tampa Bay is brackish — snook + redfish + tarpon.' },
  { id: 'fl-river-alafia', name: 'Alafia River', region: 'Tampa Bay area', county: 'Hillsborough', lat: 27.870, lng: -82.350, cat: 'fl-river-bass', brackish: true, notes: 'Alafia River — bass upper, brackish lower at Tampa Bay.' },
  { id: 'fl-river-little-manatee', name: 'Little Manatee River', region: 'Tampa Bay area', county: 'Hillsborough / Manatee', lat: 27.700, lng: -82.460, cat: 'fl-river-bass', brackish: true },
  { id: 'fl-river-manatee', name: 'Manatee River', region: 'SW FL', county: 'Manatee', lat: 27.490, lng: -82.450, cat: 'fl-river-bass', brackish: true, notes: 'Manatee River — Lake Manatee impoundment + tidal mouth. Bass upper, snook + redfish + trout lower.' },
  { id: 'fl-river-myakka', name: 'Myakka River', region: 'SW FL', county: 'Manatee / Sarasota / Charlotte', lat: 27.250, lng: -82.250, cat: 'fl-river-bass', brackish: true, notes: 'Myakka River — Wild & Scenic. Bass + bream + alligators upper, brackish lower (snook + redfish + tarpon).' },
  { id: 'fl-river-peace', name: 'Peace River', region: 'SW FL', county: 'Polk / Hardee / DeSoto / Charlotte', lat: 27.420, lng: -81.880, cat: 'fl-river-bass', brackish: true, notes: 'Peace River — 105 miles. Bass + bream upper, brackish lower at Charlotte Harbor (snook + redfish + tarpon).' },
  { id: 'fl-river-caloosahatchee', name: 'Caloosahatchee River', region: 'SW FL', county: 'Hendry / Lee', lat: 26.700, lng: -81.870, cat: 'fl-river-bass', brackish: true, notes: 'Caloosahatchee River — flows from Lake Okeechobee to Gulf. Multi-zone — freshwater bass upper, brackish/snook lower. Lock-and-dam system.' },
  { id: 'fl-river-orange-creek', name: 'Orange Creek', region: 'North-Central FL', county: 'Alachua / Putnam', lat: 29.480, lng: -82.155, cat: 'fl-river-bass' },
  { id: 'fl-river-withlacoochee-south', name: 'Withlacoochee River (South)', region: 'Nature Coast FL', county: 'Citrus / Marion / Sumter / Levy / Hernando', lat: 28.795, lng: -82.300, cat: 'fl-river-bass', notes: 'Withlacoochee River (South) — different from Withlacoochee North. Bass + bream + cats. Rodman/Lake Rousseau impoundment.' },
  { id: 'fl-river-withlacoochee-north', name: 'Withlacoochee River (North)', region: 'North FL', county: 'Madison / Hamilton / Suwannee', lat: 30.420, lng: -83.180, cat: 'fl-river-blackwater', notes: 'Withlacoochee River (North) — different from Withlacoochee South. GA-FL border blackwater. Bass + bream.' },
  { id: 'fl-river-loxahatchee-headwaters', name: 'Loxahatchee River — Headwaters', region: 'SE FL', county: 'Palm Beach / Martin', lat: 26.890, lng: -80.270, cat: 'fl-river-blackwater', notes: 'Loxahatchee River — Wild & Scenic. Bass + bream + occasional snook (lower).' },
  { id: 'fl-river-fisheating-creek', name: 'Fisheating Creek', region: 'South-Central FL', county: 'Glades', lat: 27.080, lng: -81.130, cat: 'fl-river-blackwater', notes: 'Fisheating Creek — Wild & Scenic. Bass + bream + alligators. Lake Okeechobee trib.' },
  { id: 'fl-river-econlockhatchee', name: 'Econlockhatchee River', region: 'Central FL', county: 'Orange / Seminole', lat: 28.575, lng: -81.140, cat: 'fl-river-blackwater' },
  { id: 'fl-river-wekiva', name: 'Wekiva River', region: 'Central FL', county: 'Orange / Lake / Seminole', lat: 28.785, lng: -81.420, cat: 'fl-spring-headwater', notes: 'Wekiva River — spring-fed Wild & Scenic. Bass + bream + stumpknockers. Crystal water.' },
  { id: 'fl-river-rock-springs-run', name: 'Rock Springs Run', region: 'Central FL', county: 'Orange / Lake', lat: 28.750, lng: -81.510, cat: 'fl-spring-headwater' },
  { id: 'fl-river-juniper-run', name: 'Juniper Run (Ocala NF)', region: 'North-Central FL', county: 'Marion', lat: 29.180, lng: -81.715, cat: 'fl-spring-headwater' },
  { id: 'fl-river-alexander-springs-creek', name: 'Alexander Springs Creek', region: 'Central FL', county: 'Lake', lat: 29.080, lng: -81.575, cat: 'fl-spring-headwater' },

  // ============== SPRING HEADWATERS (pure freshwater spring sources) ==============
  { id: 'fl-spring-ichetucknee', name: 'Ichetucknee River', region: 'North FL', county: 'Columbia / Suwannee', lat: 29.985, lng: -82.760, cat: 'fl-spring-headwater', notes: 'Ichetucknee River — pure spring water. Bass + bream + stumpknockers + mullet.' },
  { id: 'fl-spring-wakulla', name: 'Wakulla Springs (Headwater)', region: 'Big Bend FL', county: 'Wakulla', lat: 30.235, lng: -84.310, cat: 'fl-spring-headwater', notes: 'Wakulla Springs — pure freshwater spring. Wildlife reserve; limited fishing. Manatees winter.' },
  { id: 'fl-spring-silver-run', name: 'Silver River (Headwater)', region: 'North-Central FL', county: 'Marion', lat: 29.215, lng: -82.045, cat: 'fl-spring-headwater', notes: 'Silver River — pure spring (Silver Springs). Bass + bream + sunshine bass + manatees.' },
  { id: 'fl-spring-rainbow-river-headwater', name: 'Rainbow River (Headwater)', region: 'Nature Coast FL', county: 'Marion', lat: 29.108, lng: -82.430, cat: 'fl-spring-headwater', notes: 'Rainbow River — pure spring (already partly captured). Bass + bream + sunshine bass + mullet.' },
  { id: 'fl-spring-blue-spring-volusia', name: 'Blue Spring (Volusia)', region: 'Central FL', county: 'Volusia', lat: 28.945, lng: -81.340, cat: 'fl-spring-headwater', notes: 'Blue Spring — Volusia County state park. Manatee winter refuge. Bass + bream.' },
  { id: 'fl-spring-de-leon-springs', name: 'De Leon Springs', region: 'Central FL', county: 'Volusia', lat: 29.130, lng: -81.355, cat: 'fl-spring-headwater' },
  { id: 'fl-spring-fanning', name: 'Fanning Springs', region: 'Nature Coast FL', county: 'Levy / Gilchrist', lat: 29.585, lng: -82.935, cat: 'fl-spring-headwater' },
  { id: 'fl-spring-manatee-springs', name: 'Manatee Springs', region: 'Nature Coast FL', county: 'Levy', lat: 29.500, lng: -82.975, cat: 'fl-spring-headwater' },
  { id: 'fl-spring-ginnie-springs', name: 'Ginnie Springs (Santa Fe trib)', region: 'North-Central FL', county: 'Gilchrist', lat: 29.835, lng: -82.700, cat: 'fl-spring-headwater' },
  { id: 'fl-spring-poe-springs', name: 'Poe Springs (Santa Fe trib)', region: 'North-Central FL', county: 'Alachua', lat: 29.830, lng: -82.650, cat: 'fl-spring-headwater' },
  { id: 'fl-spring-rum-island', name: 'Rum Island Springs', region: 'North-Central FL', county: 'Columbia', lat: 29.840, lng: -82.730, cat: 'fl-spring-headwater' },
  { id: 'fl-spring-troy-springs', name: 'Troy Springs (Suwannee trib)', region: 'North FL', county: 'Lafayette', lat: 29.800, lng: -82.995, cat: 'fl-spring-headwater' },
  { id: 'fl-spring-lafayette-blue', name: 'Lafayette Blue Springs', region: 'North FL', county: 'Lafayette', lat: 30.130, lng: -83.230, cat: 'fl-spring-headwater' },
  { id: 'fl-spring-wakulla-trib-st-marks-springs', name: 'St. Marks Springs', region: 'Big Bend FL', county: 'Leon', lat: 30.330, lng: -84.205, cat: 'fl-spring-headwater' },

  // ============== SUWANNEE TRIBS ==============
  { id: 'fl-river-santa-fe', name: 'Santa Fe River', region: 'North-Central FL', county: 'Alachua / Columbia / Gilchrist / Suwannee', lat: 29.840, lng: -82.620, cat: 'fl-river-blackwater', notes: 'Santa Fe River — Suwannee tributary. Blackwater + multiple spring inputs. Bass + bream + redbreast.' },
  { id: 'fl-river-suwannee-mid', name: 'Suwannee River — Middle (Mayo/Branford)', region: 'North FL', county: 'Lafayette / Suwannee', lat: 30.080, lng: -83.085, cat: 'fl-river-blackwater', notes: 'Middle Suwannee — Mayo area. Bass + bream + trophy flatheads + sturgeon (protected).' },
  { id: 'fl-river-suwannee-upper', name: 'Suwannee River — Upper (Live Oak/Branford)', region: 'North FL', county: 'Suwannee / Hamilton', lat: 30.290, lng: -82.985, cat: 'fl-river-blackwater' },
  { id: 'fl-river-alapaha', name: 'Alapaha River', region: 'North FL', county: 'Hamilton', lat: 30.560, lng: -83.155, cat: 'fl-river-blackwater' },
  { id: 'fl-river-suwannee-mouth-supp', name: 'Suwannee — Lower (Suwannee Sound)', region: 'Nature Coast FL', county: 'Dixie / Levy', lat: 29.290, lng: -83.155, cat: 'fl-river-tidal-spring', brackish: true },
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
      county: item.county, acres: null, maxDepthFt: null,
      lat: item.lat, lng: item.lng, cat: item.cat, notes: item.notes,
      brackish: item.brackish,
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
