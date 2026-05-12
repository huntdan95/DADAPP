// IN Vol 3 — South IN reservoirs/strip pits + Wabash/White/Ohio river segments + Lake Mi tribs.

const fs = require('fs');
const path = require('path');
const { buildIN } = require('./_in-water-template.cjs');

const DATA_PATH = path.join(__dirname, '..', 'data', 'waterbodies.json');

const RAW = [
  // ============== SOUTH IN RESERVOIRS ==============
  { id: 'in-hardy-lake', name: 'Hardy Lake', county: 'Scott', acres: 741, maxDepthFt: 36, lat: 38.770, lng: -85.700, cat: 'southern-reservoir', notes: 'Hardy Lake — south IN, primarily known for largemouth, crappie, channel cats, and stocked hybrid stripers.' },
  { id: 'in-lake-monroe-secondary', name: 'Monroe Reservoir Lower Pool', county: 'Lawrence', acres: null, maxDepthFt: null, lat: 38.945, lng: -86.440, cat: 'southern-reservoir' },
  { id: 'in-prides-creek-reservoir', name: 'Prides Creek Lake', county: 'Pike', acres: 100, maxDepthFt: 22, lat: 38.473, lng: -87.215, cat: 'southern-reservoir' },
  { id: 'in-lake-greenwood', name: 'Greenwood Lake', county: 'Lawrence', acres: 50, maxDepthFt: 25, lat: 38.870, lng: -86.470, cat: 'southern-reservoir' },
  { id: 'in-lake-of-the-woods-south', name: 'Lake of the Woods (Hoosier NF)', county: 'Orange', acres: 30, maxDepthFt: 22, lat: 38.610, lng: -86.380, cat: 'southern-reservoir' },
  { id: 'in-saddle-lake', name: 'Saddle Lake', county: 'Perry', acres: 18, maxDepthFt: 22, lat: 38.020, lng: -86.700, cat: 'southern-reservoir' },
  { id: 'in-tipsaw-lake', name: 'Tipsaw Lake', county: 'Perry', acres: 130, maxDepthFt: 25, lat: 38.078, lng: -86.692, cat: 'southern-reservoir', notes: 'Tipsaw Lake — Hoosier National Forest reservoir. Good largemouth + crappie + bream.' },
  { id: 'in-celina-lake', name: 'Celina Lake', county: 'Perry', acres: 165, maxDepthFt: 30, lat: 38.072, lng: -86.665, cat: 'southern-reservoir', notes: 'Celina Lake — Hoosier NF reservoir. Quality bass and panfish.' },
  { id: 'in-indian-lake-perry', name: 'Indian Lake (Perry)', county: 'Perry', acres: 195, maxDepthFt: 30, lat: 38.105, lng: -86.530, cat: 'southern-reservoir' },
  { id: 'in-lake-sundance', name: 'Lake Sundance', county: 'Sullivan', acres: 35, maxDepthFt: 22, lat: 39.040, lng: -87.430, cat: 'strip-pit' },
  { id: 'in-dogwood-lake', name: 'Dogwood Lake', county: 'Daviess', acres: 1400, maxDepthFt: 30, lat: 38.715, lng: -87.300, cat: 'southern-reservoir', notes: 'Glendale FWA lake; bass + bream + crappie + channel cats.' },
  { id: 'in-lake-glendale', name: 'Glendale FWA Lakes', county: 'Daviess', acres: null, maxDepthFt: null, lat: 38.715, lng: -87.305, cat: 'southern-reservoir' },
  { id: 'in-lake-wonderland', name: 'Wonderland Lake', county: 'Vermillion', acres: 90, maxDepthFt: 22, lat: 39.875, lng: -87.460, cat: 'central-reservoir' },
  { id: 'in-pine-lake-warren', name: 'Pine Lake (Warren)', county: 'Warren', acres: 50, maxDepthFt: 22, lat: 40.310, lng: -87.205, cat: 'central-reservoir' },
  { id: 'in-fisher-lake', name: 'Fisher Lake', county: 'Jackson', acres: 18, maxDepthFt: 18, lat: 39.005, lng: -85.985, cat: 'central-reservoir' },
  { id: 'in-clear-creek-lake', name: 'Clear Creek Lake', county: 'Vigo', acres: 25, maxDepthFt: 18, lat: 39.530, lng: -87.435, cat: 'central-reservoir' },
  { id: 'in-lake-vermilion', name: 'Lake Vermilion', county: 'Vermillion', acres: 250, maxDepthFt: 30, lat: 39.865, lng: -87.470, cat: 'central-reservoir' },
  { id: 'in-summit-lake', name: 'Summit Lake', county: 'Henry', acres: 800, maxDepthFt: 60, lat: 40.020, lng: -85.265, cat: 'central-reservoir', notes: 'Summit Lake — Henry County, central IN. Walleye + largemouth + crappie. State park lake.' },
  { id: 'in-mounds-lake', name: 'Mounds Lake (proposed/Anderson)', county: 'Madison', acres: null, maxDepthFt: null, lat: 40.150, lng: -85.685, cat: 'central-reservoir' },
  { id: 'in-pleasant-run-lake', name: 'Pleasant Run Lake (Indianapolis)', county: 'Marion', acres: 25, maxDepthFt: 12, lat: 39.755, lng: -86.110, cat: 'central-reservoir' },
  { id: 'in-foster-park-lake', name: 'Foster Park Lake (Fort Wayne)', county: 'Allen', acres: 8, maxDepthFt: 12, lat: 41.040, lng: -85.150, cat: 'state-park-lake-in' },
  { id: 'in-shoaff-lake', name: 'Shoaff Park Lake (Fort Wayne)', county: 'Allen', acres: 15, maxDepthFt: 15, lat: 41.150, lng: -85.130, cat: 'state-park-lake-in' },
  { id: 'in-headwaters-park-pond', name: 'Headwaters Park Pond (Fort Wayne)', county: 'Allen', acres: 5, maxDepthFt: 10, lat: 41.082, lng: -85.140, cat: 'state-park-lake-in' },

  // ============== STRIP-PIT COUNTRY (Greene-Sullivan State Forest + Pike County) ==============
  { id: 'in-greene-sullivan-pits', name: 'Greene-Sullivan SF Strip Pits (complex)', county: 'Greene / Sullivan', acres: null, maxDepthFt: null, lat: 39.130, lng: -87.235, cat: 'strip-pit', notes: 'Greene-Sullivan State Forest — 50+ strip-pit lakes. Old coal mine pits flooded into clear deep water. Premier south-IN bass fishery for those who learn the back roads.' },
  { id: 'in-lake-greenwood-strip', name: 'Lake Greenwood Strip Pit', county: 'Pike', acres: 30, maxDepthFt: 30, lat: 38.405, lng: -87.280, cat: 'strip-pit' },
  { id: 'in-blue-grass-pit', name: 'Blue Grass FWA Strip Pits', county: 'Warrick', acres: null, maxDepthFt: null, lat: 38.105, lng: -87.260, cat: 'strip-pit', notes: 'Blue Grass FWA — strip-pit complex managed for fishing. Multiple pits.' },
  { id: 'in-pike-state-forest-pits', name: 'Pike State Forest Strip Pits', county: 'Pike', acres: null, maxDepthFt: null, lat: 38.430, lng: -87.180, cat: 'strip-pit' },
  { id: 'in-minnehaha-fwa', name: 'Minnehaha FWA Strip Pits', county: 'Sullivan', acres: null, maxDepthFt: null, lat: 39.030, lng: -87.385, cat: 'strip-pit', notes: 'Minnehaha FWA — strip-pit complex with 35+ lakes. South IN bass + bluegill water.' },
  { id: 'in-shawmut-strip-pits', name: 'Shawmut Strip Pits', county: 'Knox', acres: null, maxDepthFt: null, lat: 38.730, lng: -87.430, cat: 'strip-pit' },
  { id: 'in-friendship-strip-pit', name: 'Friendship Strip Pit', county: 'Sullivan', acres: 65, maxDepthFt: 35, lat: 39.115, lng: -87.355, cat: 'strip-pit' },
  { id: 'in-hannah-strip-pit', name: 'Hannah Pit', county: 'Sullivan', acres: 40, maxDepthFt: 28, lat: 39.090, lng: -87.395, cat: 'strip-pit' },
  { id: 'in-tippit-strip-pit', name: 'Tippit Pit', county: 'Sullivan', acres: 30, maxDepthFt: 25, lat: 39.075, lng: -87.380, cat: 'strip-pit' },
  { id: 'in-airline-pit', name: 'Airline Strip Pit', county: 'Sullivan', acres: 35, maxDepthFt: 30, lat: 39.020, lng: -87.320, cat: 'strip-pit' },
  { id: 'in-baldridge-pit', name: 'Baldridge Strip Pit', county: 'Sullivan', acres: 25, maxDepthFt: 25, lat: 39.100, lng: -87.340, cat: 'strip-pit' },
  { id: 'in-corning-pit', name: 'Corning Strip Pit', county: 'Sullivan', acres: 20, maxDepthFt: 22, lat: 39.045, lng: -87.355, cat: 'strip-pit' },
  { id: 'in-deer-creek-pit', name: 'Deer Creek Pit', county: 'Sullivan', acres: 22, maxDepthFt: 28, lat: 39.080, lng: -87.310, cat: 'strip-pit' },
  { id: 'in-gibson-strip-pits', name: 'Gibson County Strip Pits', county: 'Gibson', acres: null, maxDepthFt: null, lat: 38.350, lng: -87.580, cat: 'strip-pit' },
  { id: 'in-warrick-pit-cluster', name: 'Warrick County Strip Pits', county: 'Warrick', acres: null, maxDepthFt: null, lat: 38.090, lng: -87.200, cat: 'strip-pit' },
  { id: 'in-clay-strip-pits', name: 'Clay County Strip Pits', county: 'Clay', acres: null, maxDepthFt: null, lat: 39.385, lng: -87.150, cat: 'strip-pit' },
  { id: 'in-fowler-pit', name: 'Fowler Strip Pit', county: 'Sullivan', acres: 18, maxDepthFt: 20, lat: 39.085, lng: -87.340, cat: 'strip-pit' },
  { id: 'in-iron-strip-pit', name: 'Iron Strip Pit', county: 'Sullivan', acres: 30, maxDepthFt: 32, lat: 39.110, lng: -87.300, cat: 'strip-pit' },
  { id: 'in-lake-fyffe', name: 'Lake Fyffe (former pit)', county: 'Sullivan', acres: 25, maxDepthFt: 25, lat: 39.140, lng: -87.395, cat: 'strip-pit' },

  // ============== WABASH RIVER SEGMENTS ==============
  { id: 'in-wabash-river-mid', name: 'Wabash River — Middle (Lafayette area)', county: 'Tippecanoe / Carroll', acres: null, maxDepthFt: null, lat: 40.420, lng: -86.890, cat: 'wabash-pool', notes: 'Middle Wabash — wild river smallmouth + catfish. Floating from Delphi to Lafayette is a classic IN trip.' },
  { id: 'in-wabash-river-lower', name: 'Wabash River — Lower (Vincennes area)', county: 'Knox', acres: null, maxDepthFt: null, lat: 38.680, lng: -87.530, cat: 'wabash-pool', notes: 'Lower Wabash — trophy catfish (blue, flathead), spring sauger run, smallmouth on rock-and-current habitat.' },
  { id: 'in-wabash-river-terre-haute', name: 'Wabash River — Terre Haute', county: 'Vigo', acres: null, maxDepthFt: null, lat: 39.470, lng: -87.420, cat: 'wabash-pool' },
  { id: 'in-wabash-river-vincennes-confluence', name: 'Wabash–Ohio Confluence', county: 'Posey', acres: null, maxDepthFt: null, lat: 37.920, lng: -88.020, cat: 'wabash-pool', notes: 'Wabash mouth where it meets the Ohio River — major sauger + catfish water.' },
  { id: 'in-wabash-river-huntington', name: 'Wabash River — Huntington (above reservoir)', county: 'Huntington', acres: null, maxDepthFt: null, lat: 40.880, lng: -85.500, cat: 'wabash-pool' },
  { id: 'in-wabash-river-bluffton', name: 'Wabash River — Bluffton', county: 'Wells', acres: null, maxDepthFt: null, lat: 40.750, lng: -85.170, cat: 'wabash-pool' },
  { id: 'in-wabash-river-attica', name: 'Wabash River — Attica', county: 'Fountain', acres: null, maxDepthFt: null, lat: 40.290, lng: -87.250, cat: 'wabash-pool' },
  { id: 'in-wabash-river-clinton-cayuga', name: 'Wabash River — Clinton/Cayuga', county: 'Vermillion', acres: null, maxDepthFt: null, lat: 39.665, lng: -87.395, cat: 'wabash-pool' },
  { id: 'in-wabash-river-mount-carmel', name: 'Wabash River — Mt. Carmel pool', county: 'Posey', acres: null, maxDepthFt: null, lat: 38.405, lng: -87.745, cat: 'wabash-pool' },

  // ============== OHIO RIVER SEGMENTS ==============
  { id: 'in-ohio-river-louisville', name: 'Ohio River — Louisville pool (IN side)', county: 'Clark / Floyd', acres: null, maxDepthFt: null, lat: 38.265, lng: -85.745, cat: 'wabash-pool', notes: 'Ohio River below McAlpine Dam — major trophy catfish + sauger + striper fishery. IN side at Falls of the Ohio.' },
  { id: 'in-ohio-river-evansville', name: 'Ohio River — Evansville', county: 'Vanderburgh', acres: null, maxDepthFt: null, lat: 37.965, lng: -87.560, cat: 'wabash-pool' },
  { id: 'in-ohio-river-newburgh', name: 'Ohio River — Newburgh pool', county: 'Warrick', acres: null, maxDepthFt: null, lat: 37.940, lng: -87.405, cat: 'wabash-pool' },
  { id: 'in-ohio-river-tell-city', name: 'Ohio River — Tell City', county: 'Perry', acres: null, maxDepthFt: null, lat: 37.945, lng: -86.755, cat: 'wabash-pool' },
  { id: 'in-ohio-river-cannelton', name: 'Ohio River — Cannelton pool', county: 'Perry', acres: null, maxDepthFt: null, lat: 37.910, lng: -86.737, cat: 'wabash-pool', notes: 'Cannelton tailwater below dam — sauger + striper + trophy catfish.' },
  { id: 'in-ohio-river-madison', name: 'Ohio River — Madison', county: 'Jefferson', acres: null, maxDepthFt: null, lat: 38.735, lng: -85.380, cat: 'wabash-pool' },
  { id: 'in-ohio-river-lawrenceburg', name: 'Ohio River — Lawrenceburg', county: 'Dearborn', acres: null, maxDepthFt: null, lat: 39.092, lng: -84.852, cat: 'wabash-pool' },
  { id: 'in-ohio-river-jeffersonville', name: 'Ohio River — Jeffersonville', county: 'Clark', acres: null, maxDepthFt: null, lat: 38.275, lng: -85.738, cat: 'wabash-pool' },
  { id: 'in-ohio-river-rockport', name: 'Ohio River — Rockport', county: 'Spencer', acres: null, maxDepthFt: null, lat: 37.880, lng: -87.050, cat: 'wabash-pool' },
  { id: 'in-ohio-river-mt-vernon', name: 'Ohio River — Mt. Vernon', county: 'Posey', acres: null, maxDepthFt: null, lat: 37.935, lng: -87.900, cat: 'wabash-pool' },

  // ============== WHITE RIVER SEGMENTS ==============
  { id: 'in-white-river-east-fork-upper', name: 'East Fork White River — Upper (Columbus area)', county: 'Bartholomew', acres: null, maxDepthFt: null, lat: 39.205, lng: -85.910, cat: 'white-river-segment', notes: 'East Fork upper — smallmouth + rock bass + the rare flathead.' },
  { id: 'in-white-river-east-fork-mid', name: 'East Fork White River — Bedford/Mitchell', county: 'Lawrence', acres: null, maxDepthFt: null, lat: 38.870, lng: -86.475, cat: 'white-river-segment' },
  { id: 'in-white-river-east-fork-lower', name: 'East Fork White River — Shoals', county: 'Martin', acres: null, maxDepthFt: null, lat: 38.665, lng: -86.795, cat: 'white-river-segment' },
  { id: 'in-white-river-west-anderson', name: 'White River — West Fork (Anderson)', county: 'Madison', acres: null, maxDepthFt: null, lat: 40.105, lng: -85.680, cat: 'white-river-segment' },
  { id: 'in-white-river-west-noblesville', name: 'White River — West Fork (Noblesville)', county: 'Hamilton', acres: null, maxDepthFt: null, lat: 40.045, lng: -86.005, cat: 'white-river-segment', notes: 'White River near Noblesville — central IN smallmouth + rockbass float water.' },
  { id: 'in-white-river-west-indy-downtown', name: 'White River — Downtown Indianapolis', county: 'Marion', acres: null, maxDepthFt: null, lat: 39.770, lng: -86.165, cat: 'white-river-segment' },
  { id: 'in-white-river-west-martinsville', name: 'White River — Martinsville', county: 'Morgan', acres: null, maxDepthFt: null, lat: 39.430, lng: -86.430, cat: 'white-river-segment' },
  { id: 'in-white-river-west-spencer', name: 'White River — Spencer', county: 'Owen', acres: null, maxDepthFt: null, lat: 39.290, lng: -86.770, cat: 'white-river-segment' },
  { id: 'in-white-river-confluence', name: 'White River Confluence (E + W Forks)', county: 'Pike', acres: null, maxDepthFt: null, lat: 38.555, lng: -87.345, cat: 'white-river-segment', notes: 'East + West forks of White meet near Petersburg — solid catfishing + bass.' },

  // ============== LAKE MI TRIBS (more) ==============
  { id: 'in-east-branch-little-calumet', name: 'East Branch Little Calumet', county: 'Porter', acres: null, maxDepthFt: null, lat: 41.628, lng: -87.020, cat: 'lake-mi-trib' },
  { id: 'in-deep-river', name: 'Deep River', county: 'Lake', acres: null, maxDepthFt: null, lat: 41.500, lng: -87.270, cat: 'lake-mi-trib', notes: 'Deep River — Lake County, IN. Steelhead and salmon stocking + run.' },
  { id: 'in-galena-river', name: 'Galena River', county: 'LaPorte', acres: null, maxDepthFt: null, lat: 41.760, lng: -86.870, cat: 'lake-mi-trib' },
  { id: 'in-trail-creek-east-arm', name: 'Trail Creek East Arm', county: 'LaPorte', acres: null, maxDepthFt: null, lat: 41.720, lng: -86.870, cat: 'lake-mi-trib' },
  { id: 'in-coffee-creek', name: 'Coffee Creek', county: 'Porter', acres: null, maxDepthFt: null, lat: 41.630, lng: -87.080, cat: 'lake-mi-trib' },
  { id: 'in-mc-cool-creek', name: 'McCool Creek', county: 'Lake', acres: null, maxDepthFt: null, lat: 41.495, lng: -87.310, cat: 'lake-mi-trib' },

  // ============== MORE CENTRAL/SOUTH IN LAKES + Wabash tribs ==============
  { id: 'in-eel-river-south', name: 'Eel River — South Fork (Bowling Green)', county: 'Owen', acres: null, maxDepthFt: null, lat: 39.300, lng: -86.890, cat: 'white-river-segment' },
  { id: 'in-blue-river-south', name: 'Blue River (South IN)', county: 'Crawford / Harrison', acres: null, maxDepthFt: null, lat: 38.350, lng: -86.255, cat: 'prairie-stream', notes: 'Blue River — south IN smallmouth river. Wild trout in Harrison-Crawford State Forest section.' },
  { id: 'in-anderson-river', name: 'Anderson River', county: 'Perry / Spencer', acres: null, maxDepthFt: null, lat: 38.020, lng: -86.770, cat: 'prairie-stream' },
  { id: 'in-tippecanoe-river-upper', name: 'Tippecanoe River — Upper', county: 'Kosciusko / Marshall', acres: null, maxDepthFt: null, lat: 41.310, lng: -86.080, cat: 'wabash-pool' },
  { id: 'in-tippecanoe-river-lower', name: 'Tippecanoe River — Lower (Pulaski)', county: 'Pulaski / White', acres: null, maxDepthFt: null, lat: 41.025, lng: -86.700, cat: 'wabash-pool' },
  { id: 'in-mississinewa-river-upper', name: 'Mississinewa River — Upper', county: 'Randolph / Delaware', acres: null, maxDepthFt: null, lat: 40.300, lng: -85.270, cat: 'white-river-segment' },
  { id: 'in-salamonie-river-segments', name: 'Salamonie River — Above Reservoir', county: 'Wabash', acres: null, maxDepthFt: null, lat: 40.770, lng: -85.700, cat: 'white-river-segment' },
  { id: 'in-eel-river-north', name: 'Eel River North — Logansport area', county: 'Cass / Wabash', acres: null, maxDepthFt: null, lat: 40.760, lng: -86.300, cat: 'wabash-pool' },
  { id: 'in-cedar-creek', name: 'Cedar Creek', county: 'DeKalb / Allen', acres: null, maxDepthFt: null, lat: 41.190, lng: -85.165, cat: 'prairie-stream' },
  { id: 'in-st-mary-river', name: 'St. Marys River', county: 'Allen / Adams', acres: null, maxDepthFt: null, lat: 40.965, lng: -84.962, cat: 'prairie-stream' },
  { id: 'in-st-joseph-river-north', name: 'St. Joseph River — Above Fort Wayne', county: 'DeKalb / Allen', acres: null, maxDepthFt: null, lat: 41.150, lng: -85.040, cat: 'prairie-stream' },
  { id: 'in-elkhart-river', name: 'Elkhart River', county: 'Elkhart', acres: null, maxDepthFt: null, lat: 41.640, lng: -85.965, cat: 'prairie-stream' },
  { id: 'in-pigeon-river-segments', name: 'Pigeon River (Pigeon River FWA)', county: 'LaGrange / Steuben', acres: null, maxDepthFt: null, lat: 41.700, lng: -85.342, cat: 'prairie-stream', notes: 'Pigeon River FWA — wild brook trout in headwaters, smallmouth and northern pike in lower river. NE IN gem.' },
  { id: 'in-sugar-creek-shades', name: 'Sugar Creek — Shades / Turkey Run', county: 'Parke / Montgomery', acres: null, maxDepthFt: null, lat: 39.880, lng: -87.105, cat: 'prairie-stream', notes: 'Sugar Creek — Shades State Park / Turkey Run area, smallmouth + rock bass + scenic float.' },
  { id: 'in-clifty-creek', name: 'Clifty Creek (Clifty Falls SP)', county: 'Jefferson', acres: null, maxDepthFt: null, lat: 38.770, lng: -85.420, cat: 'prairie-stream' },
  { id: 'in-big-pine-creek', name: 'Big Pine Creek', county: 'Warren', acres: null, maxDepthFt: null, lat: 40.330, lng: -87.380, cat: 'prairie-stream' },
  { id: 'in-flatrock-river', name: 'Flatrock River', county: 'Bartholomew', acres: null, maxDepthFt: null, lat: 39.305, lng: -85.870, cat: 'white-river-segment' },
  { id: 'in-driftwood-river', name: 'Driftwood River', county: 'Bartholomew', acres: null, maxDepthFt: null, lat: 39.260, lng: -85.945, cat: 'white-river-segment' },
  { id: 'in-blue-river-east-fork', name: 'Blue River — East Fork', county: 'Crawford', acres: null, maxDepthFt: null, lat: 38.330, lng: -86.175, cat: 'prairie-stream' },
  { id: 'in-patoka-river', name: 'Patoka River (below reservoir)', county: 'Pike / Gibson', acres: null, maxDepthFt: null, lat: 38.398, lng: -87.225, cat: 'white-river-segment', notes: 'Patoka River below the reservoir — channel cats + flatheads + spring sauger.' },
  { id: 'in-laughery-creek', name: 'Laughery Creek', county: 'Ohio / Dearborn', acres: null, maxDepthFt: null, lat: 39.020, lng: -84.998, cat: 'prairie-stream' },
  { id: 'in-east-fork-whitewater', name: 'East Fork Whitewater River', county: 'Wayne / Union', acres: null, maxDepthFt: null, lat: 39.660, lng: -84.970, cat: 'prairie-stream' },
  { id: 'in-west-fork-whitewater', name: 'West Fork Whitewater River', county: 'Wayne', acres: null, maxDepthFt: null, lat: 39.770, lng: -85.030, cat: 'prairie-stream' },
  { id: 'in-whitewater-river', name: 'Whitewater River — Brookville Tailwater', county: 'Franklin', acres: null, maxDepthFt: null, lat: 39.460, lng: -84.970, cat: 'wabash-pool', notes: 'Whitewater below Brookville Dam — coldwater tailrace, stocked rainbow + brown trout. IN\'s only major coldwater tailwater.' },
  { id: 'in-iroquois-river-segments', name: 'Iroquois River Segments', county: 'Newton / Jasper', acres: null, maxDepthFt: null, lat: 40.745, lng: -87.380, cat: 'wabash-pool' },

  // ============== ADDITIONAL CENTRAL/SOUTH WARMWATER LAKES ==============
  { id: 'in-griffy-lake', name: 'Griffy Lake', county: 'Monroe', acres: 109, maxDepthFt: 30, lat: 39.225, lng: -86.515, cat: 'central-reservoir', notes: 'Griffy Lake — Bloomington area; bass + crappie + bream + tiger muskie (stocked).' },
  { id: 'in-strahl-lake', name: 'Strahl Lake (Brown Co SP)', county: 'Brown', acres: 7, maxDepthFt: 15, lat: 39.180, lng: -86.225, cat: 'state-park-lake-in' },
  { id: 'in-ogle-lake', name: 'Ogle Lake (Brown Co SP)', county: 'Brown', acres: 17, maxDepthFt: 20, lat: 39.190, lng: -86.220, cat: 'state-park-lake-in' },
  { id: 'in-spring-mill-lake', name: 'Spring Mill Lake (Spring Mill SP)', county: 'Lawrence', acres: 30, maxDepthFt: 18, lat: 38.745, lng: -86.420, cat: 'state-park-lake-in' },
  { id: 'in-versailles-lake', name: 'Versailles Lake (Versailles SP)', county: 'Ripley', acres: 230, maxDepthFt: 22, lat: 39.075, lng: -85.270, cat: 'state-park-lake-in' },
  { id: 'in-mccormick-lake-mccormicks-creek-sp', name: 'McCormick\'s Creek Lake', county: 'Owen', acres: 5, maxDepthFt: 12, lat: 39.290, lng: -86.720, cat: 'state-park-lake-in' },
  { id: 'in-whitewater-lake', name: 'Whitewater Lake (Whitewater SP)', county: 'Union', acres: 200, maxDepthFt: 20, lat: 39.640, lng: -85.020, cat: 'state-park-lake-in' },
  { id: 'in-pokagon-lake-james-supp', name: 'Pokagon State Park Beach Cove', county: 'Steuben', acres: null, maxDepthFt: null, lat: 41.702, lng: -85.027, cat: 'state-park-lake-in' },
  { id: 'in-clifty-lake', name: 'Clifty Lake', county: 'Bartholomew', acres: 195, maxDepthFt: 30, lat: 39.305, lng: -85.920, cat: 'central-reservoir' },
  { id: 'in-deam-lake', name: 'Deam Lake', county: 'Clark', acres: 195, maxDepthFt: 40, lat: 38.510, lng: -85.880, cat: 'state-park-lake-in', notes: 'Deam Lake — Clark State Forest. Quality largemouth + crappie + bream + stocked rainbow (cool season).' },
  { id: 'in-starve-hollow-lake', name: 'Starve Hollow Lake', county: 'Jackson', acres: 150, maxDepthFt: 25, lat: 38.835, lng: -86.082, cat: 'state-park-lake-in' },
  { id: 'in-jackson-washington-lake', name: 'Jackson-Washington SF Lakes', county: 'Jackson / Washington', acres: null, maxDepthFt: null, lat: 38.715, lng: -86.020, cat: 'state-park-lake-in' },
  { id: 'in-westwood-lake', name: 'Westwood Lake', county: 'Henry', acres: 30, maxDepthFt: 20, lat: 39.910, lng: -85.265, cat: 'state-park-lake-in' },
  { id: 'in-prairie-creek-reservoir', name: 'Prairie Creek Reservoir', county: 'Delaware', acres: 1252, maxDepthFt: 60, lat: 40.165, lng: -85.260, cat: 'central-reservoir', notes: 'Prairie Creek Reservoir — Muncie water supply; tournament-class largemouth + crappie + walleye.' },
  { id: 'in-shafer-lake-supp', name: 'Lake Shafer South Basin', county: 'White', acres: null, maxDepthFt: null, lat: 40.708, lng: -86.770, cat: 'central-reservoir' },
  { id: 'in-freeman-lake-supp', name: 'Lake Freeman South Basin', county: 'White', acres: null, maxDepthFt: null, lat: 40.700, lng: -86.760, cat: 'central-reservoir' },
  { id: 'in-fairfax-lake', name: 'Fairfax SRA (Monroe)', county: 'Monroe', acres: null, maxDepthFt: null, lat: 39.030, lng: -86.515, cat: 'southern-reservoir' },
  { id: 'in-paynetown-sra', name: 'Paynetown SRA (Monroe)', county: 'Monroe', acres: null, maxDepthFt: null, lat: 39.075, lng: -86.450, cat: 'southern-reservoir' },
];

function main() {
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  const existing = JSON.parse(raw);
  const byId = new Map(existing.map((e) => [e.id, e]));

  let appended = 0, skipped = 0;
  for (const item of RAW) {
    if (byId.has(item.id)) { skipped++; continue; }
    const entry = buildIN({
      id: item.id, name: item.name, region: 'Indiana',
      county: item.county, acres: item.acres, maxDepthFt: item.maxDepthFt,
      lat: item.lat, lng: item.lng, cat: item.cat, notes: item.notes,
    });
    existing.push(entry);
    byId.set(item.id, entry);
    appended++;
  }

  fs.writeFileSync(DATA_PATH, JSON.stringify(existing, null, 2) + '\n', 'utf8');
  const inTotal = existing.filter((e) => e.state === 'IN').length;
  console.log(`Appended ${appended}, skipped ${skipped}. IN total: ${inTotal}, Grand total: ${existing.length}`);
}

main();
