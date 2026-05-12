// TN Vol 3 — TWRA family fishing lakes + Tennessee state park lakes.

const fs = require('fs');
const path = require('path');
const { buildTN } = require('./_tn-water-template.cjs');

const DATA_PATH = path.join(__dirname, '..', 'data', 'waterbodies.json');

const RAW = [
  // ============== TWRA FAMILY FISHING LAKES ==============
  // (Small TWRA-managed lakes for bream + cats + bass. Stocked regularly.)
  { id: 'tn-twra-bedford-lake', name: 'Bedford Lake', county: 'Bedford', acres: 47, maxDepthFt: 18, lat: 35.500, lng: -86.380, cat: 'twra-family-lake', region: 'Middle TN' },
  { id: 'tn-twra-brown-lake', name: 'Brown Lake', county: 'Weakley', acres: 39, maxDepthFt: 15, lat: 36.290, lng: -88.580, cat: 'twra-family-lake', region: 'West TN' },
  { id: 'tn-twra-burgess-falls', name: 'Burgess Falls Lake', county: 'Putnam', acres: 80, maxDepthFt: 22, lat: 36.020, lng: -85.620, cat: 'twra-family-lake', region: 'Middle TN' },
  { id: 'tn-twra-carroll-lake', name: 'Carroll County Lake', county: 'Carroll', acres: 100, maxDepthFt: 20, lat: 36.000, lng: -88.430, cat: 'twra-family-lake', region: 'West TN' },
  { id: 'tn-twra-dotsonville', name: 'Dotsonville (Cheatham FWA Pond)', county: 'Cheatham', acres: 15, maxDepthFt: 12, lat: 36.300, lng: -87.150, cat: 'twra-family-lake', region: 'Middle TN' },
  { id: 'tn-twra-garrett-lake', name: 'Garrett Lake', county: 'Weakley', acres: 88, maxDepthFt: 22, lat: 36.250, lng: -88.515, cat: 'twra-family-lake', region: 'West TN' },
  { id: 'tn-twra-gibson-lake', name: 'Gibson County Lake', county: 'Gibson', acres: 70, maxDepthFt: 18, lat: 35.940, lng: -88.985, cat: 'twra-family-lake', region: 'West TN' },
  { id: 'tn-twra-glendale-lake', name: 'Glendale Lake', county: 'Wilson', acres: 16, maxDepthFt: 14, lat: 36.230, lng: -86.480, cat: 'twra-family-lake', region: 'Middle TN' },
  { id: 'tn-twra-humboldt-lake', name: 'Humboldt Lake', county: 'Gibson', acres: 35, maxDepthFt: 14, lat: 35.825, lng: -88.910, cat: 'twra-family-lake', region: 'West TN' },
  { id: 'tn-twra-lone-hickory', name: 'Lone Hickory Lake', county: 'Henry', acres: 18, maxDepthFt: 12, lat: 36.310, lng: -88.300, cat: 'twra-family-lake', region: 'West TN' },
  { id: 'tn-twra-maples-branch', name: 'Maples Branch Lake', county: 'Sevier', acres: 30, maxDepthFt: 18, lat: 35.870, lng: -83.580, cat: 'twra-family-lake', region: 'East TN' },
  { id: 'tn-twra-marrowbone', name: 'Marrowbone Lake', county: 'Davidson', acres: 60, maxDepthFt: 18, lat: 36.230, lng: -86.900, cat: 'twra-family-lake', region: 'Middle TN' },
  { id: 'tn-twra-marvin-hartman', name: 'Marvin Hartman Lake', county: 'Maury', acres: 16, maxDepthFt: 12, lat: 35.610, lng: -87.030, cat: 'twra-family-lake', region: 'Middle TN' },
  { id: 'tn-twra-norris-creek', name: 'Norris Creek Lake', county: 'Sumner', acres: 24, maxDepthFt: 14, lat: 36.510, lng: -86.475, cat: 'twra-family-lake', region: 'Middle TN' },
  { id: 'tn-twra-ross-creek', name: 'Ross Creek Lake', county: 'Wayne', acres: 18, maxDepthFt: 12, lat: 35.230, lng: -87.840, cat: 'twra-family-lake', region: 'Middle TN' },
  { id: 'tn-twra-springfield-greenway', name: 'Springfield Greenway Lake', county: 'Robertson', acres: 12, maxDepthFt: 12, lat: 36.508, lng: -86.880, cat: 'twra-family-lake', region: 'Middle TN' },
  { id: 'tn-twra-vfw-lake', name: 'VFW Lake', county: 'Hamilton', acres: 22, maxDepthFt: 15, lat: 35.085, lng: -85.290, cat: 'twra-family-lake', region: 'Southeast TN' },
  { id: 'tn-twra-whippoorwill-lake', name: 'Whippoorwill Lake', county: 'Williamson', acres: 14, maxDepthFt: 12, lat: 35.870, lng: -86.945, cat: 'twra-family-lake', region: 'Middle TN' },
  { id: 'tn-twra-williamsport-lake', name: 'Williamsport Lake', county: 'Maury', acres: 26, maxDepthFt: 14, lat: 35.700, lng: -87.220, cat: 'twra-family-lake', region: 'Middle TN' },
  { id: 'tn-twra-laguardo-lake', name: 'Laguardo Lake', county: 'Wilson', acres: 30, maxDepthFt: 18, lat: 36.225, lng: -86.385, cat: 'twra-family-lake', region: 'Middle TN' },
  { id: 'tn-twra-shelby-park-lake', name: 'Shelby Park Lake', county: 'Davidson', acres: 27, maxDepthFt: 15, lat: 36.165, lng: -86.737, cat: 'twra-family-lake', region: 'Middle TN' },
  { id: 'tn-twra-thompson-lake', name: 'Thompson Lake', county: 'Hardeman', acres: 12, maxDepthFt: 12, lat: 35.220, lng: -89.105, cat: 'twra-family-lake', region: 'West TN' },
  { id: 'tn-twra-pickwick-state-park-pond', name: 'Pickwick Landing SP Pond', county: 'Hardin', acres: 6, maxDepthFt: 10, lat: 35.067, lng: -88.250, cat: 'state-park-lake', region: 'West TN' },
  { id: 'tn-twra-paris-landing-pond', name: 'Paris Landing SP Pond', county: 'Henry', acres: 5, maxDepthFt: 10, lat: 36.430, lng: -88.078, cat: 'state-park-lake', region: 'West TN' },
  { id: 'tn-twra-meeman-shelby-pond', name: 'Meeman-Shelby Forest SP Pond', county: 'Shelby', acres: 12, maxDepthFt: 12, lat: 35.330, lng: -90.045, cat: 'state-park-lake', region: 'West TN' },
  { id: 'tn-twra-natchez-trace-pond', name: 'Natchez Trace SP Pond', county: 'Carroll', acres: 15, maxDepthFt: 18, lat: 35.825, lng: -88.255, cat: 'state-park-lake', region: 'West TN' },
  { id: 'tn-twra-cedar-of-lebanon-pond', name: 'Cedars of Lebanon SP Pond', county: 'Wilson', acres: 8, maxDepthFt: 12, lat: 36.083, lng: -86.320, cat: 'state-park-lake', region: 'Middle TN' },
  { id: 'tn-twra-edgar-evins-pond', name: 'Edgar Evins SP Pond', county: 'DeKalb', acres: 6, maxDepthFt: 12, lat: 36.082, lng: -85.820, cat: 'state-park-lake', region: 'Middle TN' },
  { id: 'tn-twra-frozen-head-pond', name: 'Frozen Head SP Pond', county: 'Morgan', acres: 4, maxDepthFt: 10, lat: 36.130, lng: -84.475, cat: 'state-park-lake', region: 'East TN' },
  { id: 'tn-twra-rock-island-pond', name: 'Rock Island SP Pond', county: 'Warren', acres: 8, maxDepthFt: 14, lat: 35.808, lng: -85.640, cat: 'state-park-lake', region: 'Middle TN' },
  { id: 'tn-twra-burgess-falls-pond', name: 'Burgess Falls SP Pond', county: 'Putnam', acres: 7, maxDepthFt: 12, lat: 36.025, lng: -85.620, cat: 'state-park-lake', region: 'Middle TN' },
  { id: 'tn-twra-fall-creek-falls-lake', name: 'Fall Creek Falls Lake', county: 'Van Buren / Bledsoe', acres: 345, maxDepthFt: 28, lat: 35.665, lng: -85.350, cat: 'state-park-lake', region: 'Cumberland Plateau', notes: 'Fall Creek Falls SP — large state park lake with bass + bream + crappie. Cumberland Plateau setting.' },
  { id: 'tn-twra-pickett-sp-pond', name: 'Pickett SP Pond', county: 'Pickett', acres: 12, maxDepthFt: 18, lat: 36.555, lng: -84.795, cat: 'state-park-lake', region: 'Cumberland Plateau' },
  { id: 'tn-twra-standing-stone-pond', name: 'Standing Stone SP Pond', county: 'Overton', acres: 70, maxDepthFt: 25, lat: 36.470, lng: -85.420, cat: 'state-park-lake', region: 'Cumberland Plateau' },
  { id: 'tn-twra-cumberland-mountain-pond', name: 'Cumberland Mountain SP Lake', county: 'Cumberland', acres: 50, maxDepthFt: 25, lat: 35.905, lng: -84.985, cat: 'state-park-lake', region: 'Cumberland Plateau', notes: 'Cumberland Mountain SP — CCC-built lake with bass, bream, channel cats, and stocked winter trout.' },
  { id: 'tn-twra-cove-lake-sp', name: 'Cove Lake (Cove Lake SP)', county: 'Campbell', acres: 210, maxDepthFt: 30, lat: 36.355, lng: -84.205, cat: 'state-park-lake', region: 'East TN' },
  { id: 'tn-twra-norris-dam-sp-pond', name: 'Norris Dam SP Pond', county: 'Anderson', acres: 5, maxDepthFt: 10, lat: 36.225, lng: -84.078, cat: 'state-park-lake', region: 'East TN' },
  { id: 'tn-twra-big-ridge-sp-lake', name: 'Big Ridge Lake (Big Ridge SP)', county: 'Union', acres: 49, maxDepthFt: 20, lat: 36.245, lng: -83.928, cat: 'state-park-lake', region: 'East TN' },
  { id: 'tn-twra-panther-creek-pond', name: 'Panther Creek SP Pond', county: 'Hamblen', acres: 5, maxDepthFt: 10, lat: 36.205, lng: -83.420, cat: 'state-park-lake', region: 'East TN' },
  { id: 'tn-twra-warriors-path-pond', name: 'Warriors\' Path SP Pond', county: 'Sullivan', acres: 8, maxDepthFt: 12, lat: 36.490, lng: -82.510, cat: 'state-park-lake', region: 'East TN' },
  { id: 'tn-twra-roan-mountain-pond', name: 'Roan Mountain SP Pond', county: 'Carter', acres: 5, maxDepthFt: 10, lat: 36.165, lng: -82.082, cat: 'state-park-lake', region: 'East TN' },
  { id: 'tn-twra-sycamore-shoals-pond', name: 'Sycamore Shoals SP Pond', county: 'Carter', acres: 4, maxDepthFt: 10, lat: 36.330, lng: -82.245, cat: 'state-park-lake', region: 'East TN' },
  { id: 'tn-twra-bays-mountain-pond', name: 'Bays Mountain Park Pond', county: 'Sullivan', acres: 44, maxDepthFt: 20, lat: 36.510, lng: -82.595, cat: 'state-park-lake', region: 'East TN' },
  { id: 'tn-twra-laurel-fork-pond', name: 'Laurel-Snow SNA Pond', county: 'Rhea', acres: 12, maxDepthFt: 15, lat: 35.580, lng: -84.985, cat: 'state-park-lake', region: 'Cumberland Plateau' },
  { id: 'tn-twra-foster-falls-pond', name: 'Foster Falls SP Pond', county: 'Marion', acres: 8, maxDepthFt: 12, lat: 35.180, lng: -85.685, cat: 'state-park-lake', region: 'Cumberland Plateau' },
  { id: 'tn-twra-savage-gulf-pond', name: 'Savage Gulf SNA Pond', county: 'Grundy', acres: 6, maxDepthFt: 10, lat: 35.430, lng: -85.530, cat: 'state-park-lake', region: 'Cumberland Plateau' },
  { id: 'tn-twra-south-cumberland-pond', name: 'South Cumberland SP Pond', county: 'Grundy', acres: 7, maxDepthFt: 10, lat: 35.410, lng: -85.700, cat: 'state-park-lake', region: 'Cumberland Plateau' },
  { id: 'tn-twra-old-stone-fort-pond', name: 'Old Stone Fort SP Pond', county: 'Coffee', acres: 8, maxDepthFt: 12, lat: 35.485, lng: -86.105, cat: 'state-park-lake', region: 'Middle TN' },
  { id: 'tn-twra-david-crockett-sp', name: 'David Crockett SP Pond', county: 'Lawrence', acres: 25, maxDepthFt: 18, lat: 35.245, lng: -87.350, cat: 'state-park-lake', region: 'Middle TN' },
  { id: 'tn-twra-bicentennial-mall-pond', name: 'Bicentennial Mall Pond (Nashville)', county: 'Davidson', acres: 3, maxDepthFt: 8, lat: 36.170, lng: -86.785, cat: 'state-park-lake', region: 'Middle TN' },

  // ============== ADDITIONAL TWRA / FWA WATERS ==============
  { id: 'tn-twra-haywood-lake', name: 'Haywood Lake', county: 'Haywood', acres: 20, maxDepthFt: 14, lat: 35.595, lng: -89.265, cat: 'twra-family-lake', region: 'West TN' },
  { id: 'tn-twra-tigrett-fwa', name: 'Tigrett FWA Lakes', county: 'Dyer', acres: null, maxDepthFt: null, lat: 35.985, lng: -89.355, cat: 'mississippi-oxbow', region: 'West TN' },
  { id: 'tn-twra-chickasaw-fwa', name: 'Chickasaw FWA Lakes', county: 'Lauderdale', acres: null, maxDepthFt: null, lat: 35.748, lng: -89.770, cat: 'mississippi-oxbow', region: 'West TN' },
  { id: 'tn-twra-ft-pillow-pond', name: 'Fort Pillow SP Pond', county: 'Lauderdale', acres: 18, maxDepthFt: 12, lat: 35.625, lng: -89.825, cat: 'state-park-lake', region: 'West TN' },
  { id: 'tn-twra-anderson-tully', name: 'Anderson-Tully WMA Lakes', county: 'Lauderdale', acres: null, maxDepthFt: null, lat: 35.715, lng: -89.890, cat: 'mississippi-oxbow', region: 'West TN' },
  { id: 'tn-twra-bogota-fwa', name: 'Bogota FWA Pond', county: 'Dyer', acres: 35, maxDepthFt: 14, lat: 36.205, lng: -89.430, cat: 'twra-family-lake', region: 'West TN' },
  { id: 'tn-twra-fort-loudoun-twra', name: 'Lenoir City TWRA Pond', county: 'Loudon', acres: 10, maxDepthFt: 10, lat: 35.805, lng: -84.265, cat: 'twra-family-lake', region: 'East TN' },
  { id: 'tn-twra-clinton-twra', name: 'Clinton TWRA Pond', county: 'Anderson', acres: 8, maxDepthFt: 10, lat: 36.105, lng: -84.130, cat: 'twra-family-lake', region: 'East TN' },
  { id: 'tn-twra-jefferson-cty-twra', name: 'Jefferson City TWRA Pond', county: 'Jefferson', acres: 10, maxDepthFt: 12, lat: 36.123, lng: -83.495, cat: 'twra-family-lake', region: 'East TN' },
  { id: 'tn-twra-greeneville-twra', name: 'Greeneville TWRA Pond', county: 'Greene', acres: 12, maxDepthFt: 12, lat: 36.165, lng: -82.830, cat: 'twra-family-lake', region: 'East TN' },
  { id: 'tn-twra-johnson-cty-twra', name: 'Johnson City TWRA Pond', county: 'Washington', acres: 14, maxDepthFt: 14, lat: 36.330, lng: -82.380, cat: 'twra-family-lake', region: 'East TN' },
  { id: 'tn-twra-elizabethton-twra', name: 'Elizabethton TWRA Pond', county: 'Carter', acres: 8, maxDepthFt: 10, lat: 36.345, lng: -82.220, cat: 'twra-family-lake', region: 'East TN' },
  { id: 'tn-twra-cleveland-twra', name: 'Cleveland TWRA Pond', county: 'Bradley', acres: 12, maxDepthFt: 12, lat: 35.155, lng: -84.880, cat: 'twra-family-lake', region: 'Southeast TN' },
  { id: 'tn-twra-chattanooga-twra', name: 'Chattanooga TWRA Pond', county: 'Hamilton', acres: 15, maxDepthFt: 14, lat: 35.045, lng: -85.310, cat: 'twra-family-lake', region: 'Southeast TN' },
  { id: 'tn-twra-east-ridge-pond', name: 'East Ridge City Pond', county: 'Hamilton', acres: 5, maxDepthFt: 10, lat: 35.000, lng: -85.235, cat: 'twra-family-lake', region: 'Southeast TN' },
  { id: 'tn-twra-knoxville-twra', name: 'Knoxville TWRA Pond', county: 'Knox', acres: 18, maxDepthFt: 12, lat: 35.945, lng: -83.945, cat: 'twra-family-lake', region: 'East TN' },
  { id: 'tn-twra-victor-ashe', name: 'Victor Ashe Park Pond', county: 'Knox', acres: 8, maxDepthFt: 10, lat: 35.985, lng: -84.020, cat: 'twra-family-lake', region: 'East TN' },
  { id: 'tn-twra-oak-ridge-twra', name: 'Oak Ridge TWRA Pond', county: 'Anderson', acres: 15, maxDepthFt: 14, lat: 36.020, lng: -84.255, cat: 'twra-family-lake', region: 'East TN' },
  { id: 'tn-twra-cookeville-twra', name: 'Cookeville TWRA Pond', county: 'Putnam', acres: 12, maxDepthFt: 12, lat: 36.165, lng: -85.520, cat: 'twra-family-lake', region: 'Middle TN' },
  { id: 'tn-twra-mcminnville-twra', name: 'McMinnville TWRA Pond', county: 'Warren', acres: 14, maxDepthFt: 14, lat: 35.685, lng: -85.770, cat: 'twra-family-lake', region: 'Middle TN' },
  { id: 'tn-twra-tullahoma-twra', name: 'Tullahoma TWRA Pond', county: 'Coffee', acres: 12, maxDepthFt: 12, lat: 35.365, lng: -86.205, cat: 'twra-family-lake', region: 'Middle TN' },
  { id: 'tn-twra-shelbyville-twra', name: 'Shelbyville TWRA Pond', county: 'Bedford', acres: 14, maxDepthFt: 14, lat: 35.485, lng: -86.460, cat: 'twra-family-lake', region: 'Middle TN' },
  { id: 'tn-twra-lewisburg-twra', name: 'Lewisburg TWRA Pond', county: 'Marshall', acres: 10, maxDepthFt: 12, lat: 35.450, lng: -86.785, cat: 'twra-family-lake', region: 'Middle TN' },
  { id: 'tn-twra-columbia-twra', name: 'Columbia TWRA Pond', county: 'Maury', acres: 15, maxDepthFt: 14, lat: 35.615, lng: -87.035, cat: 'twra-family-lake', region: 'Middle TN' },
  { id: 'tn-twra-franklin-twra', name: 'Franklin TWRA Pond', county: 'Williamson', acres: 14, maxDepthFt: 14, lat: 35.925, lng: -86.870, cat: 'twra-family-lake', region: 'Middle TN' },
  { id: 'tn-twra-dickson-twra', name: 'Dickson TWRA Pond', county: 'Dickson', acres: 12, maxDepthFt: 12, lat: 36.075, lng: -87.385, cat: 'twra-family-lake', region: 'Middle TN' },
  { id: 'tn-twra-clarksville-twra', name: 'Clarksville TWRA Pond', county: 'Montgomery', acres: 18, maxDepthFt: 14, lat: 36.530, lng: -87.355, cat: 'twra-family-lake', region: 'Middle TN' },
  { id: 'tn-twra-cumberland-furnace', name: 'Cumberland Furnace TWRA Pond', county: 'Dickson', acres: 8, maxDepthFt: 12, lat: 36.235, lng: -87.295, cat: 'twra-family-lake', region: 'Middle TN' },
  { id: 'tn-twra-hohenwald-twra', name: 'Hohenwald TWRA Pond', county: 'Lewis', acres: 10, maxDepthFt: 12, lat: 35.545, lng: -87.555, cat: 'twra-family-lake', region: 'Middle TN' },
  { id: 'tn-twra-pulaski-twra', name: 'Pulaski TWRA Pond', county: 'Giles', acres: 12, maxDepthFt: 12, lat: 35.198, lng: -87.030, cat: 'twra-family-lake', region: 'Middle TN' },
  { id: 'tn-twra-fayetteville-twra', name: 'Fayetteville TWRA Pond', county: 'Lincoln', acres: 14, maxDepthFt: 14, lat: 35.155, lng: -86.570, cat: 'twra-family-lake', region: 'Middle TN' },
  { id: 'tn-twra-winchester-twra', name: 'Winchester TWRA Pond', county: 'Franklin', acres: 12, maxDepthFt: 14, lat: 35.180, lng: -86.110, cat: 'twra-family-lake', region: 'Middle TN' },
  { id: 'tn-twra-jackson-twra', name: 'Jackson TWRA Pond', county: 'Madison', acres: 18, maxDepthFt: 14, lat: 35.612, lng: -88.815, cat: 'twra-family-lake', region: 'West TN' },
  { id: 'tn-twra-union-cty-twra', name: 'Union City TWRA Pond', county: 'Obion', acres: 12, maxDepthFt: 12, lat: 36.425, lng: -89.055, cat: 'twra-family-lake', region: 'West TN' },
  { id: 'tn-twra-dyersburg-twra', name: 'Dyersburg TWRA Pond', county: 'Dyer', acres: 15, maxDepthFt: 14, lat: 36.035, lng: -89.385, cat: 'twra-family-lake', region: 'West TN' },
  { id: 'tn-twra-paris-twra', name: 'Paris TWRA Pond', county: 'Henry', acres: 18, maxDepthFt: 14, lat: 36.300, lng: -88.310, cat: 'twra-family-lake', region: 'West TN' },
  { id: 'tn-twra-bolivar-twra', name: 'Bolivar TWRA Pond', county: 'Hardeman', acres: 14, maxDepthFt: 14, lat: 35.255, lng: -88.985, cat: 'twra-family-lake', region: 'West TN' },
  { id: 'tn-twra-millington-pond', name: 'Millington Town Pond', county: 'Shelby', acres: 14, maxDepthFt: 14, lat: 35.340, lng: -89.895, cat: 'twra-family-lake', region: 'West TN' },
  { id: 'tn-twra-bartlett-pond', name: 'Bartlett City Pond', county: 'Shelby', acres: 9, maxDepthFt: 12, lat: 35.215, lng: -89.875, cat: 'twra-family-lake', region: 'West TN' },
  { id: 'tn-twra-collierville-pond', name: 'Collierville Pond', county: 'Shelby', acres: 12, maxDepthFt: 14, lat: 35.040, lng: -89.665, cat: 'twra-family-lake', region: 'West TN' },
  { id: 'tn-twra-germantown-pond', name: 'Germantown Pond', county: 'Shelby', acres: 8, maxDepthFt: 10, lat: 35.085, lng: -89.810, cat: 'twra-family-lake', region: 'West TN' },
  { id: 'tn-twra-shelby-farms-pond', name: 'Shelby Farms Hyde Lake (Memphis)', county: 'Shelby', acres: 80, maxDepthFt: 18, lat: 35.143, lng: -89.853, cat: 'twra-family-lake', region: 'West TN', notes: 'Shelby Farms Hyde Lake — major Memphis urban park lake. Bass + bream + channel cats. Heavy public use, productive.' },
  { id: 'tn-twra-radnor-lake', name: 'Radnor Lake (Nashville)', county: 'Davidson', acres: 85, maxDepthFt: 30, lat: 36.060, lng: -86.810, cat: 'state-park-lake', region: 'Middle TN', notes: 'Radnor Lake — Nashville State Natural Area. Catch-and-release only; wildlife sanctuary character.' },
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
