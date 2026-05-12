// GA Vol 4 — Additional Georgia reservoirs.
// Builds on the existing GA marquee entries (Lanier, Allatoona, West Point,
// Jackson, Sinclair, Oconee, Acworth, Hartwell, Russell, Thurmond, Carters,
// Eufaula, Seminole) by adding NE GA mountain lakes, lower Hooch chain,
// SW GA lakes, central GA lakes.

const fs = require('fs');
const path = require('path');
const { buildGA } = require('./_ga-water-template.cjs');

const DATA_PATH = path.join(__dirname, '..', 'data', 'waterbodies.json');

const RAW = [
  // ============== NE GA MOUNTAIN LAKES (Burton, Rabun, etc.) ==============
  { id: 'ga-lake-burton', name: 'Lake Burton', region: 'NE GA Mountains', county: 'Rabun', acres: 2775, maxDepthFt: 100, lat: 34.785, lng: -83.530, cat: 'ga-mountain-reservoir', notes: 'Lake Burton — 2,775 acres, deep clear NE GA mountain reservoir. Walleye + smallmouth + spotted bass + striped bass. Lake Burton trophy walleye program.' },
  { id: 'ga-lake-rabun', name: 'Lake Rabun', region: 'NE GA Mountains', county: 'Rabun', acres: 835, maxDepthFt: 110, lat: 34.760, lng: -83.485, cat: 'ga-mountain-reservoir', notes: 'Lake Rabun — 835 acres. Deep clear Tallulah River chain. Smallmouth + walleye + spotted bass.' },
  { id: 'ga-lake-seed', name: 'Lake Seed', region: 'NE GA Mountains', county: 'Rabun', acres: 240, maxDepthFt: 75, lat: 34.735, lng: -83.430, cat: 'ga-mountain-reservoir' },
  { id: 'ga-lake-tugalo', name: 'Lake Tugalo', region: 'NE GA Mountains', county: 'Rabun / Habersham', acres: 597, maxDepthFt: 250, lat: 34.715, lng: -83.380, cat: 'ga-mountain-reservoir', notes: 'Lake Tugalo — 597 acres, 250 ft deep. Tallulah River chain. Smallmouth + walleye + striped bass.' },
  { id: 'ga-lake-yonah', name: 'Lake Yonah', region: 'NE GA Mountains', county: 'Habersham / Stephens', acres: 325, maxDepthFt: 120, lat: 34.575, lng: -83.420, cat: 'ga-mountain-reservoir' },
  { id: 'ga-lake-tallulah-falls', name: 'Tallulah Falls Lake', region: 'NE GA Mountains', county: 'Rabun / Habersham', acres: 63, maxDepthFt: 70, lat: 34.745, lng: -83.395, cat: 'ga-mountain-reservoir' },
  { id: 'ga-lake-nottely', name: 'Lake Nottely', region: 'NE GA Mountains', county: 'Union', acres: 4180, maxDepthFt: 130, lat: 34.890, lng: -84.020, cat: 'ga-mountain-reservoir', notes: 'Lake Nottely — 4,180 acres. NE GA TVA reservoir. Smallmouth + spotted bass + walleye + striped bass.' },
  { id: 'ga-lake-chatuge-ga', name: 'Lake Chatuge (GA portion)', region: 'NE GA Mountains', county: 'Towns', acres: 7050, maxDepthFt: 144, lat: 34.985, lng: -83.785, cat: 'ga-mountain-reservoir', notes: 'Lake Chatuge — TVA lake spanning GA/NC. 7,050 acres. Spotted bass + smallmouth + walleye + crappie.' },
  { id: 'ga-lake-blue-ridge-ga', name: 'Lake Blue Ridge (Toccoa Lake)', region: 'NE GA Mountains', county: 'Fannin', acres: 3290, maxDepthFt: 145, lat: 34.870, lng: -84.270, cat: 'ga-mountain-reservoir', notes: 'Lake Blue Ridge — Toccoa River impoundment. Smallmouth + walleye + spotted bass + striped bass.' },

  // ============== LOWER HOOCH CHAIN ==============
  { id: 'ga-lake-harding', name: 'Lake Harding (Bartletts Ferry)', region: 'Lower Hooch', county: 'Harris / Troup', acres: 5850, maxDepthFt: 90, lat: 32.665, lng: -85.085, cat: 'ga-chattahoochee-chain', notes: 'Lake Harding (Bartletts Ferry) — 5,850 acres on Chattahoochee. Striper + spotted bass + crappie + cats.' },
  { id: 'ga-lake-goat-rock', name: 'Goat Rock Lake', region: 'Lower Hooch', county: 'Harris / Russell (AL)', acres: 940, maxDepthFt: 65, lat: 32.595, lng: -85.040, cat: 'ga-chattahoochee-chain' },
  { id: 'ga-lake-oliver', name: 'Lake Oliver', region: 'Lower Hooch', county: 'Muscogee / Russell (AL)', acres: 2150, maxDepthFt: 75, lat: 32.555, lng: -85.025, cat: 'ga-chattahoochee-chain' },
  { id: 'ga-lake-north-highlands', name: 'North Highlands Lake', region: 'Lower Hooch', county: 'Muscogee / Russell (AL)', acres: 745, maxDepthFt: 65, lat: 32.515, lng: -85.005, cat: 'ga-chattahoochee-chain' },
  { id: 'ga-lake-walter-george-supp', name: 'Walter F. George Lake (Eufaula) - GA side', region: 'SW GA', county: 'Clay / Quitman / Randolph / Stewart', acres: null, maxDepthFt: null, lat: 31.795, lng: -85.135, cat: 'ga-southwest-reservoir' },
  { id: 'ga-lake-andrews', name: 'Lake George W. Andrews', region: 'SW GA', county: 'Early', acres: 1540, maxDepthFt: 30, lat: 31.300, lng: -85.090, cat: 'ga-southwest-reservoir' },

  // ============== SW GA LAKES (Flint + Hooch SW basins) ==============
  { id: 'ga-lake-worth', name: 'Lake Worth (Albany)', region: 'SW GA', county: 'Dougherty / Lee', acres: 1500, maxDepthFt: 30, lat: 31.625, lng: -84.165, cat: 'ga-southwest-reservoir' },
  { id: 'ga-lake-chehaw', name: 'Lake Chehaw', region: 'SW GA', county: 'Dougherty', acres: 1430, maxDepthFt: 30, lat: 31.580, lng: -84.170, cat: 'ga-southwest-reservoir' },
  { id: 'ga-lake-blackshear', name: 'Lake Blackshear', region: 'SW GA', county: 'Crisp / Sumter / Worth / Lee', acres: 8515, maxDepthFt: 45, lat: 31.890, lng: -83.945, cat: 'ga-southwest-reservoir', notes: 'Lake Blackshear — 8,515 acres on Flint River. Bass + crappie + bream + cats + striper.' },

  // ============== CENTRAL GA RESERVOIRS ==============
  { id: 'ga-lake-juliette', name: 'Lake Juliette', region: 'Central GA', county: 'Jones / Monroe', acres: 3600, maxDepthFt: 96, lat: 33.040, lng: -83.825, cat: 'ga-piedmont-reservoir', notes: 'Lake Juliette — power-plant cooling lake. Trophy Florida-strain bass + crappie + cats + hybrid stripers.' },
  { id: 'ga-lake-high-falls', name: 'High Falls Lake', region: 'Central GA', county: 'Monroe', acres: 650, maxDepthFt: 30, lat: 33.180, lng: -84.020, cat: 'ga-state-park-lake' },
  { id: 'ga-lake-lloyd-shoals', name: 'Lloyd Shoals (Jackson Lake source)', region: 'Central GA', county: 'Jasper / Butts', acres: null, maxDepthFt: null, lat: 33.310, lng: -83.825, cat: 'ga-piedmont-reservoir' },
  { id: 'ga-lake-stone-mountain', name: 'Stone Mountain Lake', region: 'Atlanta Metro', county: 'DeKalb', acres: 363, maxDepthFt: 60, lat: 33.810, lng: -84.150, cat: 'ga-piedmont-reservoir' },
  { id: 'ga-lake-varner', name: 'Lake Varner', region: 'Atlanta Metro', county: 'Newton', acres: 855, maxDepthFt: 40, lat: 33.610, lng: -83.755, cat: 'ga-piedmont-reservoir' },
  { id: 'ga-lake-bear-creek', name: 'Bear Creek Reservoir (Jefferson)', region: 'NE GA Piedmont', county: 'Jackson', acres: 505, maxDepthFt: 45, lat: 34.100, lng: -83.700, cat: 'ga-piedmont-reservoir' },
  { id: 'ga-lake-lanier-supp-additional', name: 'Lake Lanier - Buford Forebay', region: 'Atlanta Metro', county: 'Forsyth / Hall', acres: null, maxDepthFt: null, lat: 34.155, lng: -83.985, cat: 'ga-piedmont-reservoir' },
  { id: 'ga-lake-lanier-supp-balus', name: 'Lake Lanier - Balus Creek', region: 'Atlanta Metro', county: 'Hall', acres: null, maxDepthFt: null, lat: 34.330, lng: -83.835, cat: 'ga-piedmont-reservoir' },
  { id: 'ga-lake-russell-r-l', name: 'R.L. Russell Lake (Hartwell trib)', region: 'NE GA Piedmont', county: 'Madison / Hart', acres: null, maxDepthFt: null, lat: 34.345, lng: -82.880, cat: 'ga-savannah-chain' },
  { id: 'ga-lake-yonah-supp', name: 'Lake Yonah - North Cove', region: 'NE GA Mountains', county: 'Habersham', acres: null, maxDepthFt: null, lat: 34.580, lng: -83.420, cat: 'ga-mountain-reservoir' },
  { id: 'ga-lake-marshall-forks', name: 'Marshall Forks Lake', region: 'Central GA', county: 'Putnam', acres: 35, maxDepthFt: 25, lat: 33.350, lng: -83.385, cat: 'ga-pfa-lake' },
  { id: 'ga-lake-watson-mill', name: 'Watson Mill Bridge Mill Pond', region: 'NE GA Piedmont', county: 'Madison / Oglethorpe', acres: 25, maxDepthFt: 18, lat: 34.030, lng: -83.080, cat: 'ga-state-park-lake' },
  { id: 'ga-lake-shorter', name: 'Lake Shorter', region: 'West GA', county: 'Floyd', acres: 30, maxDepthFt: 22, lat: 34.305, lng: -85.180, cat: 'ga-county-pond' },

  // ============== GA PFA LAKES ==============
  { id: 'ga-pfa-arrowhead', name: 'Arrowhead PFA', region: 'NW GA', county: 'Floyd', acres: 20, maxDepthFt: 18, lat: 34.270, lng: -85.220, cat: 'ga-pfa-lake' },
  { id: 'ga-pfa-big-lazer', name: 'Big Lazer Creek PFA', region: 'West GA', county: 'Talbot', acres: 195, maxDepthFt: 28, lat: 32.745, lng: -84.555, cat: 'ga-pfa-lake', notes: 'Big Lazer Creek PFA — 195 acres. Florida-strain bass trophy lake. Bream + crappie + cats.' },
  { id: 'ga-pfa-dodge-county', name: 'Dodge County PFA', region: 'Central GA', county: 'Dodge', acres: 110, maxDepthFt: 25, lat: 32.250, lng: -83.270, cat: 'ga-pfa-lake' },
  { id: 'ga-pfa-evans-county', name: 'Evans County PFA', region: 'Coastal GA', county: 'Evans', acres: 84, maxDepthFt: 24, lat: 32.135, lng: -81.880, cat: 'ga-pfa-lake' },
  { id: 'ga-pfa-flat-creek', name: 'Flat Creek PFA', region: 'Atlanta Metro', county: 'Henry', acres: 105, maxDepthFt: 30, lat: 33.475, lng: -84.170, cat: 'ga-pfa-lake' },
  { id: 'ga-pfa-hugh-gillis', name: 'Hugh M. Gillis PFA', region: 'Central GA', county: 'Laurens', acres: 110, maxDepthFt: 28, lat: 32.430, lng: -82.880, cat: 'ga-pfa-lake' },
  { id: 'ga-pfa-marben', name: 'Marben PFA', region: 'Central GA', county: 'Newton / Jasper', acres: 380, maxDepthFt: 30, lat: 33.510, lng: -83.840, cat: 'ga-pfa-lake', notes: 'Marben PFA — 23 small lakes managed for fishing. Bass + bream + crappie + cats + trout (stocked cool months).' },
  { id: 'ga-pfa-mcduffie', name: 'McDuffie PFA', region: 'East GA', county: 'McDuffie', acres: 200, maxDepthFt: 25, lat: 33.520, lng: -82.460, cat: 'ga-pfa-lake' },
  { id: 'ga-pfa-paradise', name: 'Paradise PFA', region: 'SE GA', county: 'Tift / Berrien', acres: 525, maxDepthFt: 28, lat: 31.435, lng: -83.430, cat: 'ga-pfa-lake' },
  { id: 'ga-pfa-rocky-mountain', name: 'Rocky Mountain PFA', region: 'NW GA', county: 'Floyd', acres: 290, maxDepthFt: 100, lat: 34.205, lng: -85.305, cat: 'ga-pfa-lake', notes: 'Rocky Mountain PFA — pumped-storage reservoir converted to PFA. Deep clear water; bass + crappie + walleye.' },
  { id: 'ga-pfa-treutlen-county', name: 'Treutlen County PFA', region: 'Central GA', county: 'Treutlen', acres: 45, maxDepthFt: 22, lat: 32.385, lng: -82.580, cat: 'ga-pfa-lake' },
  { id: 'ga-pfa-walton-county', name: 'Walton PFA', region: 'Atlanta Metro', county: 'Walton', acres: 80, maxDepthFt: 25, lat: 33.860, lng: -83.700, cat: 'ga-pfa-lake' },
  { id: 'ga-pfa-bobby-brown', name: 'Bobby Brown SP Lake (Thurmond access)', region: 'East GA', county: 'Elbert', acres: null, maxDepthFt: null, lat: 33.870, lng: -82.575, cat: 'ga-state-park-lake' },

  // ============== GA STATE PARK LAKES ==============
  { id: 'ga-sp-amicalola-falls', name: 'Amicalola Falls SP Pond', region: 'NE GA Mountains', county: 'Dawson', acres: 4, maxDepthFt: 12, lat: 34.555, lng: -84.245, cat: 'ga-state-park-lake' },
  { id: 'ga-sp-black-rock-mountain', name: 'Black Rock Mountain SP Lake', region: 'NE GA Mountains', county: 'Rabun', acres: 17, maxDepthFt: 18, lat: 34.910, lng: -83.410, cat: 'ga-state-park-lake' },
  { id: 'ga-sp-cloudland-canyon', name: 'Cloudland Canyon SP Pond', region: 'NW GA', county: 'Dade', acres: 5, maxDepthFt: 12, lat: 34.840, lng: -85.495, cat: 'ga-state-park-lake' },
  { id: 'ga-sp-fort-mountain', name: 'Fort Mountain SP Lake', region: 'NW GA', county: 'Murray', acres: 17, maxDepthFt: 22, lat: 34.770, lng: -84.700, cat: 'ga-state-park-lake' },
  { id: 'ga-sp-fort-yargo', name: 'Fort Yargo SP Lake', region: 'NE GA Piedmont', county: 'Barrow', acres: 260, maxDepthFt: 28, lat: 34.000, lng: -83.730, cat: 'ga-state-park-lake' },
  { id: 'ga-sp-george-l-smith', name: 'George L. Smith SP Lake (Watson Mill Pond)', region: 'SE GA', county: 'Emanuel', acres: 412, maxDepthFt: 22, lat: 32.530, lng: -82.130, cat: 'ga-state-park-lake' },
  { id: 'ga-sp-hard-labor-creek', name: 'Hard Labor Creek SP Lake', region: 'Central GA', county: 'Morgan', acres: 275, maxDepthFt: 25, lat: 33.660, lng: -83.620, cat: 'ga-state-park-lake' },
  { id: 'ga-sp-laura-walker', name: 'Laura S. Walker SP Lake', region: 'SE GA', county: 'Ware', acres: 120, maxDepthFt: 18, lat: 31.140, lng: -82.225, cat: 'ga-state-park-lake' },
  { id: 'ga-sp-magnolia-springs', name: 'Magnolia Springs SP Lake', region: 'East GA', county: 'Jenkins', acres: 28, maxDepthFt: 14, lat: 32.875, lng: -81.960, cat: 'ga-state-park-lake' },
  { id: 'ga-sp-providence-canyon', name: 'Providence Canyon SP Pond', region: 'SW GA', county: 'Stewart', acres: 6, maxDepthFt: 14, lat: 32.075, lng: -84.910, cat: 'ga-state-park-lake' },
  { id: 'ga-sp-red-top-mountain', name: 'Red Top Mountain SP (Allatoona Access)', region: 'NW GA', county: 'Bartow', acres: null, maxDepthFt: null, lat: 34.150, lng: -84.700, cat: 'ga-piedmont-reservoir' },
  { id: 'ga-sp-richard-russell', name: 'Richard B. Russell SP Lake (Russell access)', region: 'NE GA', county: 'Elbert', acres: null, maxDepthFt: null, lat: 34.025, lng: -82.720, cat: 'ga-savannah-chain' },
  { id: 'ga-sp-seminole-state', name: 'Seminole State Park Lake', region: 'SW GA', county: 'Seminole', acres: null, maxDepthFt: null, lat: 30.795, lng: -84.875, cat: 'ga-southwest-reservoir' },
  { id: 'ga-sp-skidaway-island', name: 'Skidaway Island SP Pond', region: 'Coastal GA', county: 'Chatham', acres: 25, maxDepthFt: 14, lat: 31.940, lng: -81.060, cat: 'ga-state-park-lake' },
  { id: 'ga-sp-tallulah-gorge', name: 'Tallulah Gorge SP Lake', region: 'NE GA Mountains', county: 'Rabun / Habersham', acres: null, maxDepthFt: null, lat: 34.745, lng: -83.395, cat: 'ga-state-park-lake' },
  { id: 'ga-sp-tugaloo-state', name: 'Tugaloo SP (Hartwell Access)', region: 'NE GA', county: 'Franklin / Hart', acres: null, maxDepthFt: null, lat: 34.520, lng: -83.075, cat: 'ga-savannah-chain' },
  { id: 'ga-sp-unicoi', name: 'Unicoi SP Lake', region: 'NE GA Mountains', county: 'White', acres: 53, maxDepthFt: 22, lat: 34.730, lng: -83.760, cat: 'ga-state-park-lake' },
  { id: 'ga-sp-victoria-bryant', name: 'Victoria Bryant SP Pond', region: 'NE GA Piedmont', county: 'Franklin', acres: 8, maxDepthFt: 14, lat: 34.295, lng: -83.155, cat: 'ga-state-park-lake' },
  { id: 'ga-sp-vogel', name: 'Vogel SP Lake (Trahlyta Lake)', region: 'NE GA Mountains', county: 'Union', acres: 22, maxDepthFt: 22, lat: 34.770, lng: -83.925, cat: 'ga-state-park-lake', notes: 'Vogel State Park Lake (Trahlyta) — NE GA mountain lake. Stocked trout cool months.' },
  { id: 'ga-sp-watson-mill-bridge', name: 'Watson Mill Bridge SP', region: 'NE GA Piedmont', county: 'Madison / Oglethorpe', acres: null, maxDepthFt: null, lat: 34.030, lng: -83.080, cat: 'ga-state-park-lake' },
  { id: 'ga-sp-elijah-clark', name: 'Elijah Clark SP (Thurmond Access)', region: 'East GA', county: 'Lincoln', acres: null, maxDepthFt: null, lat: 33.840, lng: -82.430, cat: 'ga-savannah-chain' },
  { id: 'ga-sp-mistletoe', name: 'Mistletoe SP (Thurmond Access)', region: 'East GA', county: 'Columbia / McDuffie', acres: null, maxDepthFt: null, lat: 33.620, lng: -82.380, cat: 'ga-savannah-chain' },
  { id: 'ga-sp-richmond-hill', name: 'Richmond Hill State Park', region: 'Coastal GA', county: 'Bryan', acres: null, maxDepthFt: null, lat: 31.940, lng: -81.310, cat: 'ga-coastal-town' },
];

function main() {
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  const existing = JSON.parse(raw);
  const byId = new Map(existing.map((e) => [e.id, e]));

  let appended = 0, skipped = 0;
  for (const item of RAW) {
    if (byId.has(item.id)) { skipped++; continue; }
    const entry = buildGA({
      id: item.id, name: item.name, region: item.region,
      county: item.county, acres: item.acres, maxDepthFt: item.maxDepthFt,
      lat: item.lat, lng: item.lng, cat: item.cat, notes: item.notes,
    });
    existing.push(entry);
    byId.set(item.id, entry);
    appended++;
  }

  fs.writeFileSync(DATA_PATH, JSON.stringify(existing, null, 2) + '\n', 'utf8');
  const gaTotal = existing.filter((e) => e.state === 'GA').length;
  console.log(`Appended ${appended}, skipped ${skipped}. GA total: ${gaTotal}, Grand total: ${existing.length}`);
}

main();
