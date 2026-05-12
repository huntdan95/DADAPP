// IN Vol 2 — NE Indiana glacial lake country (Steuben, LaGrange, Noble, Kosciusko, Whitley).
// Bulk template-driven entries.

const fs = require('fs');
const path = require('path');
const { buildIN } = require('./_in-water-template.cjs');

const DATA_PATH = path.join(__dirname, '..', 'data', 'waterbodies.json');

const RAW = [
  // ============== STEUBEN COUNTY ==============
  // (NE corner of Indiana — Pokagon SP, Lake James already added, dozens more)
  { id: 'in-clear-lake', name: 'Clear Lake', county: 'Steuben', acres: 800, maxDepthFt: 110, lat: 41.745, lng: -84.870, cat: 'glacial-lake-ne', notes: 'Clear Lake — 800-acre, very deep clear glacial lake on the OH state line. Largemouth, smallmouth, walleye, bluegill, perch.' },
  { id: 'in-jimmerson-lake', name: 'Jimmerson Lake', county: 'Steuben', acres: 297, maxDepthFt: 47, lat: 41.683, lng: -85.020, cat: 'glacial-lake-ne', notes: 'Part of the Lake James / Jimmerson / Snow chain — Pokagon area.' },
  { id: 'in-lake-charles', name: 'Lake Charles', county: 'Steuben', acres: 230, maxDepthFt: 65, lat: 41.708, lng: -84.953, cat: 'glacial-lake-ne' },
  { id: 'in-lake-george-steuben', name: 'Lake George (Steuben)', county: 'Steuben', acres: 510, maxDepthFt: 75, lat: 41.762, lng: -84.870, cat: 'glacial-lake-ne', notes: 'Border lake with Michigan — 510 acres.' },
  { id: 'in-fox-lake', name: 'Fox Lake', county: 'Steuben', acres: 195, maxDepthFt: 70, lat: 41.638, lng: -85.073, cat: 'glacial-lake-ne' },
  { id: 'in-otter-lake', name: 'Otter Lake', county: 'Steuben', acres: 60, maxDepthFt: 40, lat: 41.582, lng: -85.083, cat: 'glacial-lake-ne' },
  { id: 'in-cedar-lake-steuben', name: 'Cedar Lake (Steuben)', county: 'Steuben', acres: 130, maxDepthFt: 30, lat: 41.635, lng: -84.985, cat: 'glacial-lake-ne' },
  { id: 'in-big-otter-lake', name: 'Big Otter Lake', county: 'Steuben', acres: 100, maxDepthFt: 50, lat: 41.625, lng: -85.165, cat: 'glacial-lake-ne' },
  { id: 'in-loon-lake-steuben', name: 'Loon Lake (Steuben)', county: 'Steuben', acres: 220, maxDepthFt: 53, lat: 41.575, lng: -85.140, cat: 'glacial-lake-ne' },
  { id: 'in-marsh-lake', name: 'Marsh Lake', county: 'Steuben', acres: 90, maxDepthFt: 20, lat: 41.610, lng: -85.123, cat: 'glacial-lake-ne' },
  { id: 'in-crooked-lake-noble', name: 'Crooked Lake (Noble)', county: 'Noble', acres: 207, maxDepthFt: 110, lat: 41.330, lng: -85.290, cat: 'glacial-lake-ne', notes: 'Different from Steuben Crooked Lake — Noble County deep clear lake.' },
  { id: 'in-fish-lake-steuben', name: 'Fish Lake (Steuben)', county: 'Steuben', acres: 65, maxDepthFt: 35, lat: 41.660, lng: -85.130, cat: 'glacial-lake-ne' },
  { id: 'in-lake-pleasant', name: 'Lake Pleasant', county: 'Steuben', acres: 165, maxDepthFt: 90, lat: 41.633, lng: -85.020, cat: 'glacial-lake-walleye', notes: 'Lake Pleasant (Steuben) — walleye and perch fishery.' },
  { id: 'in-round-lake-steuben', name: 'Round Lake (Steuben)', county: 'Steuben', acres: 50, maxDepthFt: 35, lat: 41.610, lng: -85.040, cat: 'glacial-lake-ne' },
  { id: 'in-silver-lake-steuben', name: 'Silver Lake (Steuben)', county: 'Steuben', acres: 110, maxDepthFt: 35, lat: 41.560, lng: -85.025, cat: 'glacial-lake-ne' },
  { id: 'in-lake-gage-steuben', name: 'Lake Gage', county: 'Steuben', acres: 320, maxDepthFt: 60, lat: 41.685, lng: -85.110, cat: 'glacial-lake-ne', notes: 'Lake Gage — 320-acre lake; bream + bass + walleye.' },
  { id: 'in-lake-lonidaw', name: 'Lake Lonidaw (Pokagon SP)', county: 'Steuben', acres: 12, maxDepthFt: 25, lat: 41.700, lng: -85.022, cat: 'glacial-lake-ne', notes: 'Small bog-edge lake within Pokagon State Park.' },
  { id: 'in-snow-lake-supplement', name: 'Snow Lake South Basin', county: 'Steuben', acres: 130, maxDepthFt: 65, lat: 41.665, lng: -85.040, cat: 'glacial-lake-ne' },
  { id: 'in-lake-cedar-steuben-2', name: 'Cedar Lake South (Steuben)', county: 'Steuben', acres: 90, maxDepthFt: 28, lat: 41.595, lng: -84.972, cat: 'glacial-lake-ne' },
  { id: 'in-golden-lake', name: 'Golden Lake', county: 'Steuben', acres: 90, maxDepthFt: 60, lat: 41.625, lng: -85.040, cat: 'glacial-lake-ne' },
  { id: 'in-east-otter-lake', name: 'East Otter Lake', county: 'Steuben', acres: 35, maxDepthFt: 35, lat: 41.605, lng: -85.075, cat: 'glacial-lake-ne' },
  { id: 'in-west-otter-lake', name: 'West Otter Lake', county: 'Steuben', acres: 40, maxDepthFt: 35, lat: 41.612, lng: -85.095, cat: 'glacial-lake-ne' },
  { id: 'in-shipshewana-lake', name: 'Shipshewana Lake', county: 'LaGrange', acres: 199, maxDepthFt: 40, lat: 41.682, lng: -85.580, cat: 'glacial-lake-ne', notes: 'LaGrange County — Amish country lake. Quiet, productive bass and panfish.' },
  { id: 'in-pretty-lake-lagrange', name: 'Pretty Lake (LaGrange)', county: 'LaGrange', acres: 50, maxDepthFt: 35, lat: 41.595, lng: -85.430, cat: 'glacial-lake-ne' },
  { id: 'in-stone-lake-lagrange', name: 'Stone Lake (LaGrange)', county: 'LaGrange', acres: 105, maxDepthFt: 45, lat: 41.685, lng: -85.422, cat: 'glacial-lake-ne' },
  { id: 'in-westler-lake', name: 'Westler Lake', county: 'LaGrange', acres: 65, maxDepthFt: 25, lat: 41.620, lng: -85.495, cat: 'glacial-lake-ne' },
  { id: 'in-cree-lake-noble', name: 'Cree Lake', county: 'Noble', acres: 195, maxDepthFt: 90, lat: 41.395, lng: -85.350, cat: 'glacial-lake-ne', notes: 'Cree Lake — Noble County deep clear lake; quality bass and panfish.' },
  { id: 'in-tamarack-lake-noble', name: 'Tamarack Lake (Noble)', county: 'Noble', acres: 35, maxDepthFt: 18, lat: 41.382, lng: -85.490, cat: 'glacial-lake-ne' },
  { id: 'in-knapp-lake-noble', name: 'Knapp Lake', county: 'Noble', acres: 85, maxDepthFt: 35, lat: 41.305, lng: -85.452, cat: 'glacial-lake-ne' },
  { id: 'in-port-mitchell-lake', name: 'Port Mitchell Lake', county: 'Noble', acres: 38, maxDepthFt: 35, lat: 41.475, lng: -85.382, cat: 'glacial-lake-ne' },
  { id: 'in-skinner-lake-noble', name: 'Skinner Lake (Noble)', county: 'Noble', acres: 125, maxDepthFt: 22, lat: 41.290, lng: -85.310, cat: 'glacial-lake-ne' },
  { id: 'in-tippy-lake', name: 'Tippy Lake', county: 'Kosciusko', acres: 175, maxDepthFt: 60, lat: 41.385, lng: -85.700, cat: 'glacial-lake-ne' },
  { id: 'in-lake-tippecanoe-north', name: 'North Webster Tippecanoe Chain', county: 'Kosciusko', acres: null, maxDepthFt: null, lat: 41.345, lng: -85.700, cat: 'glacial-lake-ne', notes: 'Tippecanoe Lake / James Lake / Oswego Lake chain near North Webster — connected basins, deep clear water, quality fishery.' },
  { id: 'in-james-lake-kosciusko', name: 'James Lake (Kosciusko)', county: 'Kosciusko', acres: 285, maxDepthFt: 64, lat: 41.382, lng: -85.690, cat: 'glacial-lake-ne', notes: 'James Lake — part of the Tippecanoe chain. Quality smallmouth + walleye in deep clear water.' },
  { id: 'in-yellow-creek-lake', name: 'Yellow Creek Lake', county: 'Kosciusko', acres: 130, maxDepthFt: 39, lat: 41.105, lng: -85.793, cat: 'glacial-lake-ne' },
  { id: 'in-palestine-lake', name: 'Palestine Lake', county: 'Kosciusko', acres: 257, maxDepthFt: 23, lat: 41.085, lng: -85.882, cat: 'glacial-lake-ne' },
  { id: 'in-papakeechie-lake', name: 'Papakeechie Lake', county: 'Kosciusko', acres: 320, maxDepthFt: 40, lat: 41.353, lng: -85.700, cat: 'glacial-lake-ne', notes: 'Papakeechie — private lake but accessible via guides; quality bass fishery.' },
  { id: 'in-center-lake-kosciusko', name: 'Center Lake (Warsaw)', county: 'Kosciusko', acres: 121, maxDepthFt: 42, lat: 41.235, lng: -85.853, cat: 'glacial-lake-ne', notes: 'Warsaw city lake — Center Lake.' },
  { id: 'in-eagle-lake-kosciusko', name: 'Eagle Lake (Kosciusko)', county: 'Kosciusko', acres: 200, maxDepthFt: 40, lat: 41.380, lng: -85.870, cat: 'glacial-lake-ne', notes: 'Different from Eagle Creek Reservoir in Indianapolis — natural lake.' },
  { id: 'in-shockner-lake', name: 'Shock Lake', county: 'Kosciusko', acres: 50, maxDepthFt: 38, lat: 41.230, lng: -85.785, cat: 'glacial-lake-ne' },
  { id: 'in-ridinger-lake', name: 'Ridinger Lake', county: 'Kosciusko', acres: 130, maxDepthFt: 38, lat: 41.205, lng: -85.745, cat: 'glacial-lake-ne' },
  { id: 'in-rachel-lake', name: 'Rachel Lake', county: 'Kosciusko', acres: 95, maxDepthFt: 40, lat: 41.235, lng: -85.660, cat: 'glacial-lake-ne' },
  { id: 'in-big-chapman', name: 'Big Chapman Lake', county: 'Kosciusko', acres: 540, maxDepthFt: 70, lat: 41.255, lng: -85.778, cat: 'glacial-lake-walleye', notes: 'Big Chapman — quality walleye + perch + bass.' },
  { id: 'in-little-chapman', name: 'Little Chapman Lake', county: 'Kosciusko', acres: 90, maxDepthFt: 25, lat: 41.265, lng: -85.793, cat: 'glacial-lake-ne' },
  { id: 'in-little-barbee-lake', name: 'Little Barbee Lake', county: 'Kosciusko', acres: 55, maxDepthFt: 22, lat: 41.205, lng: -85.755, cat: 'glacial-lake-ne' },
  { id: 'in-irish-lake-kosciusko', name: 'Irish Lake', county: 'Kosciusko', acres: 40, maxDepthFt: 28, lat: 41.185, lng: -85.745, cat: 'glacial-lake-ne' },
  { id: 'in-banning-lake', name: 'Banning Lake', county: 'Kosciusko', acres: 55, maxDepthFt: 21, lat: 41.222, lng: -85.690, cat: 'glacial-lake-ne' },
  { id: 'in-sechrist-lake', name: 'Sechrist Lake', county: 'Kosciusko', acres: 35, maxDepthFt: 28, lat: 41.165, lng: -85.720, cat: 'glacial-lake-ne' },
  { id: 'in-kuhn-lake', name: 'Kuhn Lake', county: 'Kosciusko', acres: 40, maxDepthFt: 35, lat: 41.205, lng: -85.730, cat: 'glacial-lake-ne' },
  { id: 'in-cook-lake-kosciusko', name: 'Cook Lake', county: 'Kosciusko', acres: 90, maxDepthFt: 18, lat: 41.155, lng: -85.880, cat: 'glacial-lake-ne' },
  { id: 'in-flat-lake', name: 'Flat Lake', county: 'Kosciusko', acres: 35, maxDepthFt: 25, lat: 41.310, lng: -85.692, cat: 'glacial-lake-ne' },
  { id: 'in-grassy-lake', name: 'Grassy Lake', county: 'Kosciusko', acres: 45, maxDepthFt: 18, lat: 41.290, lng: -85.815, cat: 'glacial-lake-ne' },
  { id: 'in-rock-lake-kosciusko', name: 'Rock Lake', county: 'Kosciusko', acres: 50, maxDepthFt: 30, lat: 41.245, lng: -85.810, cat: 'glacial-lake-ne' },
  { id: 'in-koher-lake', name: 'Koher Lake', county: 'Kosciusko', acres: 25, maxDepthFt: 30, lat: 41.275, lng: -85.755, cat: 'glacial-lake-ne' },
  { id: 'in-shoe-lake', name: 'Shoe Lake', county: 'Kosciusko', acres: 22, maxDepthFt: 20, lat: 41.180, lng: -85.760, cat: 'glacial-lake-ne' },
  { id: 'in-armstrong-lake', name: 'Armstrong Lake', county: 'Kosciusko', acres: 18, maxDepthFt: 15, lat: 41.218, lng: -85.755, cat: 'glacial-lake-ne' },
  { id: 'in-lake-tippecanoe-extra', name: 'Lake Tippecanoe (Big Tippy)', county: 'Kosciusko', acres: 760, maxDepthFt: 124, lat: 41.392, lng: -85.717, cat: 'glacial-lake-walleye', notes: 'Big Tippy — 124 ft deepest natural lake in Indiana. Walleye, smallmouth bass, lake trout (historically), big lake character.' },
  { id: 'in-pine-lake-laporte', name: 'Pine Lake (LaPorte)', county: 'LaPorte', acres: 595, maxDepthFt: 80, lat: 41.625, lng: -86.730, cat: 'glacial-lake-walleye', notes: 'Pine Lake — LaPorte County, walleye + bass + panfish.' },
  { id: 'in-stone-lake-laporte', name: 'Stone Lake (LaPorte)', county: 'LaPorte', acres: 100, maxDepthFt: 50, lat: 41.620, lng: -86.745, cat: 'glacial-lake-ne' },
  { id: 'in-clear-lake-laporte', name: 'Clear Lake (LaPorte)', county: 'LaPorte', acres: 105, maxDepthFt: 90, lat: 41.580, lng: -86.715, cat: 'glacial-lake-walleye' },
  { id: 'in-lily-lake-laporte', name: 'Lily Lake (LaPorte)', county: 'LaPorte', acres: 105, maxDepthFt: 28, lat: 41.633, lng: -86.747, cat: 'glacial-lake-ne' },
  { id: 'in-fish-trap-lake', name: 'Fish Trap Lake', county: 'LaPorte', acres: 195, maxDepthFt: 45, lat: 41.582, lng: -86.642, cat: 'glacial-lake-ne' },
  { id: 'in-hudson-lake', name: 'Hudson Lake', county: 'LaPorte', acres: 410, maxDepthFt: 55, lat: 41.728, lng: -86.523, cat: 'glacial-lake-ne' },
  { id: 'in-pawpaw-lake', name: 'Paw Paw Lake', county: 'LaPorte', acres: 130, maxDepthFt: 45, lat: 41.665, lng: -86.580, cat: 'glacial-lake-ne' },
  { id: 'in-saugany-lake', name: 'Saugany Lake', county: 'LaPorte', acres: 80, maxDepthFt: 40, lat: 41.760, lng: -86.567, cat: 'glacial-lake-ne' },
  { id: 'in-mill-pond-lake-laporte', name: 'Mill Pond Lake', county: 'LaPorte', acres: 45, maxDepthFt: 18, lat: 41.620, lng: -86.703, cat: 'glacial-lake-ne' },
  { id: 'in-koontz-lake', name: 'Koontz Lake', county: 'Starke', acres: 348, maxDepthFt: 18, lat: 41.443, lng: -86.490, cat: 'glacial-lake-ne', notes: 'Koontz Lake — shallow, weedy, classic largemouth + panfish lake.' },
  { id: 'in-bruce-lake', name: 'Bruce Lake', county: 'Fulton', acres: 245, maxDepthFt: 28, lat: 41.067, lng: -86.330, cat: 'glacial-lake-ne' },
  { id: 'in-cain-lake', name: 'Cain Lake', county: 'Marshall', acres: 50, maxDepthFt: 35, lat: 41.300, lng: -86.225, cat: 'glacial-lake-ne' },
  { id: 'in-cedar-lake-marshall', name: 'Cedar Lake (Marshall)', county: 'Marshall', acres: 90, maxDepthFt: 18, lat: 41.270, lng: -86.262, cat: 'glacial-lake-ne' },
  { id: 'in-myers-lake-marshall', name: 'Myers Lake', county: 'Marshall', acres: 110, maxDepthFt: 35, lat: 41.275, lng: -86.225, cat: 'glacial-lake-ne' },
  { id: 'in-twin-lakes-marshall', name: 'Twin Lakes (Marshall)', county: 'Marshall', acres: 615, maxDepthFt: 38, lat: 41.262, lng: -86.422, cat: 'glacial-lake-ne', notes: 'Twin Lakes — large basin, popular destination near Plymouth.' },
  { id: 'in-lake-of-the-woods-marshall', name: 'Lake of the Woods (Marshall)', county: 'Marshall', acres: 415, maxDepthFt: 50, lat: 41.420, lng: -86.205, cat: 'glacial-lake-ne', notes: 'Lake of the Woods (Bremen area).' },
  { id: 'in-lake-latonka', name: 'Lake Latonka', county: 'Marshall', acres: 90, maxDepthFt: 32, lat: 41.290, lng: -86.355, cat: 'glacial-lake-ne' },
  { id: 'in-pretty-lake-marshall', name: 'Pretty Lake (Marshall)', county: 'Marshall', acres: 95, maxDepthFt: 30, lat: 41.355, lng: -86.225, cat: 'glacial-lake-ne' },
  { id: 'in-bass-lake-marshall', name: 'Bass Lake (Marshall)', county: 'Marshall', acres: 50, maxDepthFt: 22, lat: 41.295, lng: -86.270, cat: 'glacial-lake-ne' },
  { id: 'in-dewart-lake', name: 'Dewart Lake', county: 'Kosciusko', acres: 555, maxDepthFt: 35, lat: 41.395, lng: -85.793, cat: 'glacial-lake-ne', notes: 'Dewart Lake — 555 acres, popular destination near Syracuse.' },
  { id: 'in-mud-lake-noble', name: 'Mud Lake (Noble)', county: 'Noble', acres: 55, maxDepthFt: 20, lat: 41.310, lng: -85.500, cat: 'glacial-lake-ne' },
  { id: 'in-engle-lake', name: 'Engle Lake', county: 'Whitley', acres: 75, maxDepthFt: 22, lat: 41.205, lng: -85.560, cat: 'glacial-lake-ne' },
  { id: 'in-shriner-lake', name: 'Shriner Lake', county: 'Whitley', acres: 110, maxDepthFt: 35, lat: 41.130, lng: -85.520, cat: 'glacial-lake-ne' },
  { id: 'in-troy-cedar-lake', name: 'Troy Cedar Lake', county: 'Whitley', acres: 35, maxDepthFt: 30, lat: 41.140, lng: -85.610, cat: 'glacial-lake-ne' },
  { id: 'in-mudge-lake', name: 'Mudge Lake', county: 'Steuben', acres: 35, maxDepthFt: 20, lat: 41.585, lng: -85.115, cat: 'glacial-lake-ne' },
  { id: 'in-jimmies-lake', name: 'Jimmies Lake', county: 'Noble', acres: 25, maxDepthFt: 18, lat: 41.345, lng: -85.392, cat: 'glacial-lake-ne' },
  { id: 'in-old-folks-lake', name: 'Old Folks Lake', county: 'Noble', acres: 18, maxDepthFt: 15, lat: 41.310, lng: -85.385, cat: 'glacial-lake-ne' },
  { id: 'in-shock-lake-noble', name: 'Shock Lake (Noble)', county: 'Noble', acres: 25, maxDepthFt: 22, lat: 41.330, lng: -85.430, cat: 'glacial-lake-ne' },
  { id: 'in-rider-lake', name: 'Rider Lake', county: 'Noble', acres: 28, maxDepthFt: 18, lat: 41.430, lng: -85.430, cat: 'glacial-lake-ne' },
  { id: 'in-round-lake-lagrange', name: 'Round Lake (LaGrange)', county: 'LaGrange', acres: 32, maxDepthFt: 20, lat: 41.622, lng: -85.430, cat: 'glacial-lake-ne' },
  { id: 'in-fish-lake-lagrange', name: 'Fish Lake (LaGrange)', county: 'LaGrange', acres: 75, maxDepthFt: 22, lat: 41.572, lng: -85.405, cat: 'glacial-lake-ne' },
  { id: 'in-atwood-lake-lagrange', name: 'Atwood Lake', county: 'LaGrange', acres: 40, maxDepthFt: 25, lat: 41.620, lng: -85.395, cat: 'glacial-lake-ne' },
  { id: 'in-blackman-lake', name: 'Blackman Lake', county: 'LaGrange', acres: 80, maxDepthFt: 18, lat: 41.610, lng: -85.475, cat: 'glacial-lake-ne' },
  { id: 'in-dallas-lake', name: 'Dallas Lake', county: 'LaGrange', acres: 295, maxDepthFt: 60, lat: 41.560, lng: -85.413, cat: 'glacial-lake-walleye', notes: 'Dallas Lake — quality walleye + bluegill.' },
  { id: 'in-witmer-lake-supplement', name: 'Big Lake (Whitley)', county: 'Whitley', acres: 245, maxDepthFt: 45, lat: 41.155, lng: -85.470, cat: 'glacial-lake-ne' },
  { id: 'in-cedar-lake-lake-co', name: 'Cedar Lake (Lake County)', county: 'Lake', acres: 781, maxDepthFt: 25, lat: 41.353, lng: -87.443, cat: 'glacial-lake-ne', notes: 'Largest NW IN natural lake — Cedar Lake near Crown Point.' },
  { id: 'in-lake-station-lake', name: 'Lake of the Four Seasons', county: 'Lake', acres: 175, maxDepthFt: 25, lat: 41.345, lng: -87.225, cat: 'glacial-lake-ne' },
  { id: 'in-flint-lake', name: 'Flint Lake', county: 'Porter', acres: 105, maxDepthFt: 35, lat: 41.485, lng: -87.105, cat: 'glacial-lake-ne' },
  { id: 'in-loomis-lake', name: 'Loomis Lake', county: 'Porter', acres: 75, maxDepthFt: 18, lat: 41.495, lng: -87.080, cat: 'glacial-lake-ne' },
  { id: 'in-long-lake-porter', name: 'Long Lake (Porter)', county: 'Porter', acres: 65, maxDepthFt: 18, lat: 41.560, lng: -87.130, cat: 'glacial-lake-ne' },
  { id: 'in-lake-eliza', name: 'Lake Eliza', county: 'Porter', acres: 75, maxDepthFt: 22, lat: 41.430, lng: -87.155, cat: 'glacial-lake-ne' },
  { id: 'in-shakamak-lake', name: 'Lake Shakamak', county: 'Sullivan', acres: 124, maxDepthFt: 35, lat: 39.190, lng: -87.230, cat: 'state-park-lake-in', notes: 'Shakamak State Park — three lakes (Shakamak, Lenape, Kickapoo) — Indiana state park fishery.' },
  { id: 'in-lake-lenape-shakamak', name: 'Lake Lenape (Shakamak SP)', county: 'Sullivan', acres: 60, maxDepthFt: 25, lat: 39.195, lng: -87.225, cat: 'state-park-lake-in' },
  { id: 'in-lake-kickapoo', name: 'Lake Kickapoo (Shakamak SP)', county: 'Sullivan', acres: 80, maxDepthFt: 25, lat: 39.180, lng: -87.232, cat: 'state-park-lake-in' },
  { id: 'in-lake-monroe-supplement', name: 'Lake Monroe', county: 'Monroe / Brown', acres: 10750, maxDepthFt: 53, lat: 39.030, lng: -86.530, cat: 'southern-reservoir', notes: 'Lake Monroe — Indiana\'s largest inland lake at 10,750 acres. Bloomington area; tournament-class largemouth + crappie + hybrid striper + walleye + saugeye. Major fishery.' },
  { id: 'in-lake-patoka', name: 'Patoka Lake', county: 'Crawford / Orange / Dubois', acres: 8800, maxDepthFt: 90, lat: 38.420, lng: -86.640, cat: 'southern-reservoir', notes: 'Patoka Lake — 8,800 acres of standing timber, second-largest IN reservoir. World-class crappie, big largemouth, walleye, hybrid stripers. Top-tier IN fishery.' },
  { id: 'in-brookville-lake', name: 'Brookville Lake', county: 'Franklin / Union', acres: 5260, maxDepthFt: 130, lat: 39.470, lng: -84.985, cat: 'southern-reservoir', notes: 'Brookville Lake — deep east-IN reservoir. Smallmouth bass + walleye + striper + largemouth. Bordering Ohio.' },
  { id: 'in-cecil-harden-lake', name: 'Cecil M. Harden Lake', county: 'Parke', acres: 2060, maxDepthFt: 82, lat: 39.842, lng: -87.130, cat: 'southern-reservoir', notes: 'Cecil M. Harden Lake (Raccoon Lake) — west-central IN reservoir.' },
  { id: 'in-lake-monroe-tax', name: 'Lake Lemon', county: 'Monroe', acres: 1650, maxDepthFt: 35, lat: 39.230, lng: -86.380, cat: 'central-reservoir' },
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
