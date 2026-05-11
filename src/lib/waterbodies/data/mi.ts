import type { Waterbody } from '../registry';

/**
 * Michigan waters. The 5 Great Lakes + Lake St. Clair (cross-state)
 * live in `greatLakes.ts`. THIS file covers:
 *   - Great Lakes BAYS / sub-areas around MI (East/West Grand
 *     Traverse, Little Traverse, Sturgeon, Saginaw, Whitefish,
 *     Keweenaw, Anchor, Munising, Marquette, Big Bay, Beaver
 *     Island archipelago).
 *   - Drowned-river-mouth lakes that connect to Lake Michigan
 *     (Muskegon Lake, White Lake, Lake Macatawa, Betsie / Pere
 *     Marquette / Manistee / Portage lakes).
 *   - Inland lakes.
 *   - Impoundments on the salmon/steelhead rivers (Hardy / Tippy /
 *     Hodenpyl / Mio / Foote ponds).
 *   - Trout / salmon / steelhead rivers — with run-barrier knowledge
 *     baked in via `runLimits`.
 *
 * Species lists are intentionally tight to each water. Run barriers
 * matter — the Big Manistee below Tippy holds salmon; above it the
 * stretch is inland-wild-trout only.
 */
export const MI_WATERBODIES: Waterbody[] = [
  // =====================================================================
  //   GREAT LAKES BAYS / SUB-AREAS (MI shoreline)
  // =====================================================================
  {
    id: 'mi-grand-traverse-bay-east',
    name: 'East Grand Traverse Bay',
    aliases: ['East Bay', 'East Arm Grand Traverse'],
    states: ['MI'],
    type: 'great_lakes',
    bbox: [44.78, -85.62, 45.20, -85.40],
    centroid: { lat: 45.00, lng: -85.52 },
    surfaceAreaAcres: 38_000,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'noaa-buoy', stationId: '45002' },
    },
    species: [
      'Lake Trout',
      'Chinook Salmon',
      'Coho Salmon',
      'Atlantic Salmon',
      'Brown Trout',
      'Steelhead',
      'Smallmouth Bass',
      'Lake Whitefish',
      'Yellow Perch',
      'Cisco',
    ],
    accessNotes:
      'Cold deep open water of Lake Michigan. Salmon trolling May-Oct. Lake trout fishery year-round (ice fishing on the bays\' east shore Feb). Trophy smallmouth in 12-30 ft on rocky points in June.',
  },
  {
    id: 'mi-grand-traverse-bay-west',
    name: 'West Grand Traverse Bay',
    aliases: ['West Bay', 'West Arm Grand Traverse'],
    states: ['MI'],
    type: 'great_lakes',
    bbox: [44.75, -85.85, 45.20, -85.62],
    centroid: { lat: 44.96, lng: -85.72 },
    surfaceAreaAcres: 41_000,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'noaa-buoy', stationId: '45002' },
    },
    species: [
      'Lake Trout',
      'Chinook Salmon',
      'Coho Salmon',
      'Brown Trout',
      'Steelhead',
      'Smallmouth Bass',
      'Lake Whitefish',
      'Yellow Perch',
      'Cisco',
    ],
    accessNotes:
      'Deeper than East Bay (~600 ft max). Charter fleet runs from Elmwood + Suttons Bay. Smallmouth fishery world-class along Old Mission Peninsula.',
  },
  {
    id: 'mi-little-traverse-bay',
    name: 'Little Traverse Bay',
    states: ['MI'],
    type: 'great_lakes',
    bbox: [45.32, -85.10, 45.45, -84.85],
    centroid: { lat: 45.38, lng: -84.97 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'noaa-buoy', stationId: '45002' },
    },
    species: [
      'Lake Trout',
      'Chinook Salmon',
      'Coho Salmon',
      'Steelhead',
      'Brown Trout',
      'Smallmouth Bass',
      'Yellow Perch',
    ],
    accessNotes:
      'Petoskey / Harbor Springs. Late-summer kings stage off Bay Harbor before the Bear River run. Bay views from the bluff.',
  },
  {
    id: 'mi-sturgeon-bay',
    name: 'Sturgeon Bay (Lake Michigan)',
    aliases: ['Sturgeon Bay MI'],
    states: ['MI'],
    type: 'great_lakes',
    bbox: [45.55, -85.10, 45.70, -84.85],
    centroid: { lat: 45.63, lng: -84.97 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'noaa-buoy', stationId: '45002' },
    },
    species: [
      'Smallmouth Bass',
      'Lake Trout',
      'Chinook Salmon',
      'Steelhead',
      'Lake Whitefish',
      'Yellow Perch',
    ],
    accessNotes:
      'North of Wilderness State Park. Smallmouth on the sandbars + rockpiles in June. Lake trout deep year-round.',
  },
  {
    id: 'mi-platte-bay',
    name: 'Platte Bay',
    states: ['MI'],
    type: 'great_lakes',
    bbox: [44.70, -86.18, 44.83, -85.92],
    centroid: { lat: 44.77, lng: -86.05 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'noaa-buoy', stationId: '45002' },
    },
    species: [
      'Coho Salmon',
      'Chinook Salmon',
      'Steelhead',
      'Brown Trout',
      'Smallmouth Bass',
      'Lake Whitefish',
    ],
    accessNotes:
      "Mouth of the Platte River — historically THE coho fishery that started Lake Michigan's salmon program (1966 stocking). Coho stage off the river mouth Aug-Sept.",
  },
  {
    id: 'mi-betsie-bay',
    name: 'Betsie Bay',
    aliases: ['Frankfort Harbor'],
    states: ['MI'],
    type: 'great_lakes',
    bbox: [44.62, -86.27, 44.66, -86.20],
    centroid: { lat: 44.64, lng: -86.23 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'noaa-buoy', stationId: '45002' },
    },
    species: [
      'Chinook Salmon',
      'Coho Salmon',
      'Steelhead',
      'Brown Trout',
      'Lake Trout',
      'Smallmouth Bass',
    ],
    accessNotes:
      'Frankfort harbor — kings stage here before running the Betsie River. Pier fishing for salmon late Aug. Charter fleet trolls offshore.',
  },
  {
    id: 'mi-saginaw-bay',
    name: 'Saginaw Bay',
    states: ['MI'],
    type: 'great_lakes',
    bbox: [43.55, -84.10, 44.10, -83.20],
    centroid: { lat: 43.85, lng: -83.65 },
    surfaceAreaAcres: 700_000,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'noaa-buoy', stationId: '45008' },
    },
    species: [
      'Walleye',
      'Yellow Perch',
      'Smallmouth Bass',
      'Largemouth Bass',
      'Northern Pike',
      'Channel Catfish',
      'White Bass',
    ],
    accessNotes:
      'Premier walleye fishery in MI — May-June "walleye chop" in 8-14 ft. Pinconning, Linwood, Caseville ports. Watch the sudden west winds on this shallow bay.',
  },
  {
    id: 'mi-thunder-bay',
    name: 'Thunder Bay (Lake Huron)',
    states: ['MI'],
    type: 'great_lakes',
    bbox: [45.00, -83.50, 45.18, -83.20],
    centroid: { lat: 45.06, lng: -83.34 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'noaa-coops', stationId: '9075014' },
    },
    species: [
      'Chinook Salmon',
      'Lake Trout',
      'Steelhead',
      'Brown Trout',
      'Smallmouth Bass',
      'Yellow Perch',
      'Walleye',
    ],
    accessNotes:
      'Alpena. Mid-summer king fishery + spring lake trout. Thunder Bay National Marine Sanctuary protects shipwrecks below.',
  },
  {
    id: 'mi-tawas-bay',
    name: 'Tawas Bay (Lake Huron)',
    states: ['MI'],
    type: 'great_lakes',
    bbox: [44.20, -83.55, 44.35, -83.30],
    centroid: { lat: 44.27, lng: -83.43 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'noaa-coops', stationId: '9075014' },
    },
    species: [
      'Walleye',
      'Yellow Perch',
      'Smallmouth Bass',
      'Chinook Salmon',
      'Lake Trout',
      'Brown Trout',
    ],
    accessNotes:
      'Tawas City + East Tawas. Shallow shelf produces walleye + perch ice fishery (Jan-Feb). Spring brown trout fishery on the pier.',
  },
  {
    id: 'mi-whitefish-bay',
    name: 'Whitefish Bay',
    aliases: ['Whitefish Bay Lake Superior'],
    states: ['MI'],
    type: 'great_lakes',
    bbox: [46.35, -85.20, 46.78, -84.50],
    centroid: { lat: 46.55, lng: -84.85 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'noaa-buoy', stationId: '45004' },
    },
    species: [
      'Lake Trout',
      'Lake Whitefish',
      'Chinook Salmon',
      'Coho Salmon',
      'Pink Salmon',
      'Steelhead',
      'Atlantic Salmon',
    ],
    accessNotes:
      'East end of Lake Superior, before the St. Marys River. Cold-water salmon and trout fishery. Limited shore access; charter or boat required.',
  },
  {
    id: 'mi-munising-bay',
    name: 'Munising Bay',
    states: ['MI'],
    type: 'great_lakes',
    bbox: [46.40, -86.75, 46.55, -86.55],
    centroid: { lat: 46.47, lng: -86.65 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'noaa-buoy', stationId: '45001' },
    },
    species: [
      'Lake Trout',
      'Lake Whitefish',
      'Coho Salmon',
      'Chinook Salmon',
      'Yellow Perch',
      'Splake',
    ],
    accessNotes:
      'Pictured Rocks. Lake trout fishery on the reefs offshore. Pink salmon on the Anna River + AuTrain. Whitefish jigging in 60-100 ft.',
  },
  {
    id: 'mi-marquette-bay',
    name: 'Marquette Bay',
    states: ['MI'],
    type: 'great_lakes',
    bbox: [46.50, -87.55, 46.65, -87.30],
    centroid: { lat: 46.55, lng: -87.40 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'noaa-buoy', stationId: '45001' },
    },
    species: [
      'Lake Trout',
      'Coho Salmon',
      'Chinook Salmon',
      'Brown Trout',
      'Steelhead',
      'Lake Whitefish',
      'Coaster Brook Trout',
    ],
    accessNotes:
      'Lower harbor + upper harbor. Lake trout fishery on the gravel humps. Coho stage off the Carp River in fall. Coaster brook trout in the tributaries.',
  },
  {
    id: 'mi-big-bay',
    name: 'Big Bay (Lake Superior)',
    states: ['MI'],
    type: 'great_lakes',
    bbox: [46.78, -87.78, 46.95, -87.55],
    centroid: { lat: 46.85, lng: -87.65 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'noaa-buoy', stationId: '45001' },
    },
    species: [
      'Lake Trout',
      'Coaster Brook Trout',
      'Coho Salmon',
      'Chinook Salmon',
      'Lake Whitefish',
    ],
    accessNotes:
      'North of Marquette. Coaster brook trout fishery in the Yellow Dog + Salmon Trout River mouths — rare for Lake Superior, strictly C&R.',
  },
  {
    id: 'mi-keweenaw-bay',
    name: 'Keweenaw Bay',
    states: ['MI'],
    type: 'great_lakes',
    bbox: [46.65, -88.65, 47.20, -88.10],
    centroid: { lat: 46.92, lng: -88.40 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'noaa-buoy', stationId: '45006' },
    },
    species: [
      'Lake Trout',
      'Lake Whitefish',
      'Coho Salmon',
      'Chinook Salmon',
      'Brook Trout (coaster)',
      'Walleye',
      'Smallmouth Bass',
    ],
    accessNotes:
      "L'Anse + Baraga. Coaster brook trout in tributary streams. Lake trout fishery + winter herring run.",
  },
  {
    id: 'mi-anchor-bay',
    name: 'Anchor Bay',
    aliases: ['Anchor Bay St Clair'],
    states: ['MI'],
    type: 'lake',
    bbox: [42.62, -82.85, 42.78, -82.65],
    centroid: { lat: 42.71, lng: -82.75 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'noaa-coops', stationId: '9034052' },
    },
    species: [
      'Largemouth Bass',
      'Smallmouth Bass',
      'Muskellunge',
      'Northern Pike',
      'Walleye',
      'Yellow Perch',
      'Bluegill',
      'Crappie',
    ],
    accessNotes:
      'Shallow north end of Lake St. Clair. Best muskie water in the system in June + September. Heavy weed beds — punch jigs through pad lines for pike.',
  },

  // =====================================================================
  //   DROWNED-RIVER-MOUTH LAKES (connect to Lake Michigan)
  // =====================================================================
  {
    id: 'mi-muskegon-lake',
    name: 'Muskegon Lake',
    states: ['MI'],
    type: 'lake',
    bbox: [43.21, -86.40, 43.27, -86.20],
    centroid: { lat: 43.24, lng: -86.30 },
    surfaceAreaAcres: 4_150,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: [
      'Chinook Salmon',
      'Steelhead',
      'Brown Trout',
      'Smallmouth Bass',
      'Largemouth Bass',
      'Walleye',
      'Yellow Perch',
      'Northern Pike',
      'Channel Catfish',
    ],
    accessNotes:
      "Drowned river mouth of the Muskegon. Salmon stage here in late summer before running upstream. Inland fishery (bass, walleye, pike) productive year-round. Heimforth Park ramp.",
  },
  {
    id: 'mi-white-lake',
    name: 'White Lake (Whitehall)',
    aliases: ['White Lake MI'],
    states: ['MI'],
    type: 'lake',
    bbox: [43.36, -86.41, 43.42, -86.32],
    centroid: { lat: 43.39, lng: -86.36 },
    surfaceAreaAcres: 2_550,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: [
      'Smallmouth Bass',
      'Largemouth Bass',
      'Walleye',
      'Northern Pike',
      'Yellow Perch',
      'Steelhead',
      'Chinook Salmon',
    ],
    accessNotes:
      'Mouth of the White River. Channel through the dunes to Lake Michigan. Salmon stage here for the fall run.',
  },
  {
    id: 'mi-lake-macatawa',
    name: 'Lake Macatawa',
    aliases: ['Macatawa', 'Holland Harbor'],
    states: ['MI'],
    type: 'lake',
    bbox: [42.77, -86.20, 42.81, -86.06],
    centroid: { lat: 42.79, lng: -86.13 },
    surfaceAreaAcres: 1_780,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: [
      'Smallmouth Bass',
      'Largemouth Bass',
      'Walleye',
      'Northern Pike',
      'Yellow Perch',
      'Chinook Salmon',
      'Steelhead',
    ],
    accessNotes:
      'Connects Holland to Lake Michigan via channel. Salmon stage here in fall before running the Macatawa River. Heavily developed shoreline.',
  },
  {
    id: 'mi-pere-marquette-lake',
    name: 'Pere Marquette Lake',
    aliases: ['Ludington Harbor'],
    states: ['MI'],
    type: 'lake',
    bbox: [43.94, -86.46, 43.98, -86.38],
    centroid: { lat: 43.96, lng: -86.42 },
    surfaceAreaAcres: 1_175,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'noaa-coops', stationId: '9087023' },
    },
    species: [
      'Chinook Salmon',
      'Coho Salmon',
      'Steelhead',
      'Brown Trout',
      'Lake Trout',
      'Smallmouth Bass',
    ],
    accessNotes:
      'Ludington harbor. Salmon stage here mid-Aug-Sept before running the Pere Marquette + Sable rivers. Pier fishing for kings + the SS Badger ferry.',
  },
  {
    id: 'mi-manistee-lake',
    name: 'Manistee Lake',
    states: ['MI'],
    type: 'lake',
    bbox: [44.22, -86.36, 44.28, -86.31],
    centroid: { lat: 44.25, lng: -86.33 },
    surfaceAreaAcres: 870,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'noaa-coops', stationId: '9087023' },
    },
    species: [
      'Chinook Salmon',
      'Steelhead',
      'Brown Trout',
      'Walleye',
      'Smallmouth Bass',
      'Northern Pike',
    ],
    accessNotes:
      'Mouth of the Big Manistee. Salmon staging area + harbor for boats running to the river. Heavily channelized.',
  },
  {
    id: 'mi-portage-lake-onekama',
    name: 'Portage Lake (Onekama)',
    aliases: ['Portage Lake MI'],
    states: ['MI'],
    type: 'lake',
    bbox: [44.35, -86.22, 44.40, -86.12],
    centroid: { lat: 44.37, lng: -86.18 },
    surfaceAreaAcres: 2_110,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: [
      'Smallmouth Bass',
      'Largemouth Bass',
      'Walleye',
      'Northern Pike',
      'Yellow Perch',
      'Steelhead',
      'Chinook Salmon',
    ],
    accessNotes:
      'Connected to Lake Michigan via Portage Channel. Salmon in fall, walleye + pike year-round.',
  },

  // =====================================================================
  //   INLAND LAKES (selected — popular fishing destinations)
  // =====================================================================
  {
    id: 'mi-higgins-lake',
    name: 'Higgins Lake',
    states: ['MI'],
    type: 'lake',
    bbox: [44.41, -84.78, 44.52, -84.65],
    centroid: { lat: 44.46, lng: -84.72 },
    surfaceAreaAcres: 9_600,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: [
      'Lake Trout',
      'Smallmouth Bass',
      'Lake Whitefish',
      'Yellow Perch',
      'Cisco',
      'Walleye',
      'Rock Bass',
    ],
    accessNotes:
      "One of the deepest + clearest lakes in MI (max ~135 ft). Stocked lake trout fishery — downriggers in 60-100 ft. Whitefish through the ice in winter.",
  },
  {
    id: 'mi-houghton-lake',
    name: 'Houghton Lake',
    states: ['MI'],
    type: 'lake',
    bbox: [44.27, -84.85, 44.42, -84.65],
    centroid: { lat: 44.35, lng: -84.75 },
    surfaceAreaAcres: 20_044,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: [
      'Walleye',
      'Yellow Perch',
      'Northern Pike',
      'Bluegill',
      'Largemouth Bass',
      'Crappie',
    ],
    accessNotes:
      'Largest inland lake in MI. Tip-up walleye fishery in winter. Drop-shot perch deeper in summer. Big pike off weedlines.',
  },
  {
    id: 'mi-torch-lake',
    name: 'Torch Lake',
    states: ['MI'],
    type: 'lake',
    bbox: [44.92, -85.35, 45.10, -85.22],
    centroid: { lat: 45.02, lng: -85.30 },
    surfaceAreaAcres: 18_770,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: [
      'Smallmouth Bass',
      'Lake Trout',
      'Lake Whitefish',
      'Yellow Perch',
      'Cisco',
      'Rock Bass',
    ],
    accessNotes:
      "Second-deepest inland lake in MI (~285 ft) and longest. Caribbean-blue water. Smallmouth fishery on north + south rocky shoals. Lake trout deep year-round.",
  },
  {
    id: 'mi-elk-lake',
    name: 'Elk Lake',
    states: ['MI'],
    type: 'lake',
    bbox: [44.85, -85.43, 44.96, -85.32],
    centroid: { lat: 44.90, lng: -85.38 },
    surfaceAreaAcres: 7_730,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: [
      'Smallmouth Bass',
      'Lake Trout',
      'Yellow Perch',
      'Cisco',
      'Walleye',
      'Northern Pike',
    ],
    accessNotes:
      'Chain-of-Lakes (connects to Torch). Deep clear lake. Lake trout stocked. Smallmouth on rocky humps.',
  },
  {
    id: 'mi-lake-bellaire',
    name: 'Lake Bellaire',
    states: ['MI'],
    type: 'lake',
    bbox: [44.95, -85.30, 45.00, -85.18],
    centroid: { lat: 44.98, lng: -85.25 },
    surfaceAreaAcres: 1_780,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: [
      'Smallmouth Bass',
      'Largemouth Bass',
      'Walleye',
      'Northern Pike',
      'Yellow Perch',
      'Rock Bass',
    ],
    accessNotes:
      'Chain-of-Lakes — upstream of Torch + Elk via Intermediate. Stained water; bass + pike fishery.',
  },
  {
    id: 'mi-skegemog-lake',
    name: 'Skegemog Lake',
    states: ['MI'],
    type: 'lake',
    bbox: [44.78, -85.30, 44.83, -85.20],
    centroid: { lat: 44.80, lng: -85.25 },
    surfaceAreaAcres: 2_700,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: [
      'Smallmouth Bass',
      'Largemouth Bass',
      'Northern Pike',
      'Walleye',
      'Yellow Perch',
      'Bluegill',
    ],
    accessNotes:
      'Connected to Elk Lake. Wildlife sanctuary; trolling motor only. Big pike fishery in the bays.',
  },
  {
    id: 'mi-long-lake-traverse',
    name: 'Long Lake (Traverse City)',
    aliases: ['Long Lake Grand Traverse'],
    states: ['MI'],
    type: 'lake',
    bbox: [44.73, -85.78, 44.80, -85.68],
    centroid: { lat: 44.77, lng: -85.73 },
    surfaceAreaAcres: 2_860,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: [
      'Smallmouth Bass',
      'Largemouth Bass',
      'Walleye',
      'Northern Pike',
      'Yellow Perch',
      'Rock Bass',
    ],
    accessNotes:
      'West of Traverse City. Multi-bay lake with islands. Smallmouth fishery on the rocky points + drop-offs.',
  },
  {
    id: 'mi-round-lake-charlevoix',
    name: 'Round Lake (Charlevoix)',
    states: ['MI'],
    type: 'lake',
    bbox: [45.31, -85.27, 45.33, -85.24],
    centroid: { lat: 45.32, lng: -85.25 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: [
      'Lake Trout',
      'Brown Trout',
      'Steelhead',
      'Smallmouth Bass',
      'Chinook Salmon',
    ],
    accessNotes:
      'Charlevoix harbor — connects Lake Michigan to Lake Charlevoix. Salmon stage + lake trout in the channel.',
  },
  {
    id: 'mi-crystal-lake',
    name: 'Crystal Lake (Benzie)',
    aliases: ['Crystal Lake Frankfort'],
    states: ['MI'],
    type: 'lake',
    bbox: [44.62, -86.20, 44.70, -86.05],
    centroid: { lat: 44.66, lng: -86.12 },
    surfaceAreaAcres: 9_711,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: [
      'Lake Trout',
      'Smallmouth Bass',
      'Brown Trout',
      'Yellow Perch',
      'Lake Whitefish',
      'Rock Bass',
    ],
    accessNotes:
      'Glacial lake near Frankfort. Stocked lake trout + brown trout. Smallmouth on the gravel + rock points. Clear water; light line + finesse.',
  },
  {
    id: 'mi-glen-lake',
    name: 'Glen Lake',
    aliases: ['Big Glen Lake', 'Little Glen Lake'],
    states: ['MI'],
    type: 'lake',
    bbox: [44.85, -86.05, 44.92, -85.92],
    centroid: { lat: 44.88, lng: -85.98 },
    surfaceAreaAcres: 4_871,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: [
      'Smallmouth Bass',
      'Lake Trout',
      'Yellow Perch',
      'Walleye',
      'Rock Bass',
      'Northern Pike',
    ],
    accessNotes:
      'In Sleeping Bear Dunes National Lakeshore. Two-basin lake; deep clear water. Smallmouth + lake trout fishery.',
  },
  {
    id: 'mi-lake-charlevoix',
    name: 'Lake Charlevoix',
    states: ['MI'],
    type: 'lake',
    bbox: [45.18, -85.40, 45.32, -84.95],
    centroid: { lat: 45.25, lng: -85.20 },
    surfaceAreaAcres: 17_260,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: [
      'Smallmouth Bass',
      'Lake Trout',
      'Chinook Salmon',
      'Coho Salmon',
      'Brown Trout',
      'Steelhead',
      'Walleye',
      'Yellow Perch',
      'Northern Pike',
    ],
    accessNotes:
      'Connects to Lake Michigan via Pine River channel — salmon + steelhead run through. Premier smallmouth fishery in 10-25 ft on the rocks.',
  },
  {
    id: 'mi-walloon-lake',
    name: 'Walloon Lake',
    states: ['MI'],
    type: 'lake',
    bbox: [45.25, -84.95, 45.32, -84.80],
    centroid: { lat: 45.28, lng: -84.87 },
    surfaceAreaAcres: 4_343,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: [
      'Smallmouth Bass',
      'Largemouth Bass',
      'Yellow Perch',
      'Rock Bass',
      'Northern Pike',
      'Bluegill',
    ],
    accessNotes:
      'Three-armed lake. Hemingway summered here. Smallmouth + perch fishery. Less developed than Charlevoix.',
  },
  {
    id: 'mi-lake-leelanau',
    name: 'Lake Leelanau',
    states: ['MI'],
    type: 'lake',
    bbox: [44.92, -85.78, 45.20, -85.68],
    centroid: { lat: 45.05, lng: -85.73 },
    surfaceAreaAcres: 8_320,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: [
      'Smallmouth Bass',
      'Largemouth Bass',
      'Northern Pike',
      'Yellow Perch',
      'Walleye',
      'Bluegill',
      'Rock Bass',
    ],
    accessNotes:
      'Long narrow two-basin lake. Connected to Lake Michigan via short river. Largemouth in weedy north basin; smallmouth deeper south.',
  },
  {
    id: 'mi-cadillac-mitchell',
    name: 'Lake Cadillac + Lake Mitchell',
    aliases: ['Lake Cadillac', 'Lake Mitchell'],
    states: ['MI'],
    type: 'lake',
    bbox: [44.23, -85.50, 44.30, -85.40],
    centroid: { lat: 44.26, lng: -85.45 },
    surfaceAreaAcres: 4_350,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: [
      'Largemouth Bass',
      'Smallmouth Bass',
      'Walleye',
      'Northern Pike',
      'Yellow Perch',
      'Bluegill',
      'Crappie',
    ],
    accessNotes:
      'Connected via canal. Walleye + bass mixed-bag. Heavy ice-fishing pressure in winter.',
  },
  {
    id: 'mi-hamlin-lake',
    name: 'Hamlin Lake',
    states: ['MI'],
    type: 'lake',
    bbox: [44.00, -86.42, 44.13, -86.30],
    centroid: { lat: 44.06, lng: -86.36 },
    surfaceAreaAcres: 4_990,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: [
      'Largemouth Bass',
      'Smallmouth Bass',
      'Northern Pike',
      'Walleye',
      'Yellow Perch',
      'Bluegill',
      'Crappie',
    ],
    accessNotes:
      'Just north of Ludington. Hardwood Lake (upper) shallow; Big Hamlin (lower) deeper. Pike + bass in pads, perch in the channels.',
  },
  {
    id: 'mi-hubbard-lake',
    name: 'Hubbard Lake',
    states: ['MI'],
    type: 'lake',
    bbox: [44.78, -83.62, 44.92, -83.50],
    centroid: { lat: 44.85, lng: -83.56 },
    surfaceAreaAcres: 8_850,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: [
      'Smallmouth Bass',
      'Largemouth Bass',
      'Walleye',
      'Northern Pike',
      'Yellow Perch',
      'Cisco',
    ],
    accessNotes:
      'Alpena County. Walleye stocked annually. Smallmouth on the rocky humps. Cisco in deep water year-round.',
  },
  {
    id: 'mi-black-lake-cheboygan',
    name: 'Black Lake (Cheboygan)',
    states: ['MI'],
    type: 'lake',
    bbox: [45.42, -84.30, 45.52, -84.12],
    centroid: { lat: 45.47, lng: -84.20 },
    surfaceAreaAcres: 10_130,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: [
      'Lake Sturgeon',
      'Walleye',
      'Smallmouth Bass',
      'Northern Pike',
      'Yellow Perch',
      'Bluegill',
    ],
    accessNotes:
      'MI lake sturgeon spear-fishing here — a few-days season every winter, the rarest of MI fisheries. Walleye + smallmouth the rest of the year.',
  },
  {
    id: 'mi-burt-lake',
    name: 'Burt Lake',
    states: ['MI'],
    type: 'lake',
    bbox: [45.40, -84.78, 45.52, -84.62],
    centroid: { lat: 45.46, lng: -84.70 },
    surfaceAreaAcres: 17_120,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Walleye', 'Smallmouth Bass', 'Northern Pike', 'Yellow Perch', 'Cisco'],
    accessNotes:
      'Part of the Inland Waterway. Connected to Mullett via Indian River. Stained water, weed beds along the shoreline.',
  },
  {
    id: 'mi-mullett-lake',
    name: 'Mullett Lake',
    states: ['MI'],
    type: 'lake',
    bbox: [45.45, -84.65, 45.62, -84.48],
    centroid: { lat: 45.53, lng: -84.55 },
    surfaceAreaAcres: 17_360,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Walleye', 'Smallmouth Bass', 'Lake Sturgeon', 'Yellow Perch', 'Northern Pike'],
    accessNotes:
      'Deep clear lake — over 140 ft in spots. Lake sturgeon season is a Michigan rarity. Smallmouth fishery in 8-20 ft on rocky humps.',
  },
  {
    id: 'mi-lake-margrethe',
    name: 'Lake Margrethe',
    states: ['MI'],
    type: 'lake',
    bbox: [44.62, -84.83, 44.68, -84.75],
    centroid: { lat: 44.65, lng: -84.78 },
    surfaceAreaAcres: 1_920,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: [
      'Largemouth Bass',
      'Smallmouth Bass',
      'Northern Pike',
      'Walleye',
      'Yellow Perch',
      'Bluegill',
      'Rock Bass',
    ],
    accessNotes:
      'Grayling area. Camp Grayling boundary; some shoreline restricted. Bass + perch fishery; good ice fishing.',
  },
  {
    id: 'mi-lake-gogebic',
    name: 'Lake Gogebic',
    states: ['MI'],
    type: 'lake',
    bbox: [46.40, -89.62, 46.62, -89.45],
    centroid: { lat: 46.50, lng: -89.55 },
    surfaceAreaAcres: 12_960,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: [
      'Walleye',
      'Smallmouth Bass',
      'Northern Pike',
      'Yellow Perch',
      'Whitefish',
    ],
    accessNotes:
      'Largest inland lake in the UP. Premier walleye + smallmouth water. Stained water with structure-rich bottom.',
  },
  {
    id: 'mi-manistique-lake',
    name: 'Big Manistique Lake',
    aliases: ['Manistique Lake'],
    states: ['MI'],
    type: 'lake',
    bbox: [46.18, -85.85, 46.30, -85.65],
    centroid: { lat: 46.24, lng: -85.75 },
    surfaceAreaAcres: 10_130,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: [
      'Walleye',
      'Northern Pike',
      'Smallmouth Bass',
      'Yellow Perch',
      'Muskellunge',
    ],
    accessNotes:
      'UP. Walleye + pike. Muskie in adjacent Big + Little Manistique chain.',
  },
  {
    id: 'mi-indian-lake-up',
    name: 'Indian Lake (UP)',
    states: ['MI'],
    type: 'lake',
    bbox: [45.96, -86.30, 46.05, -86.20],
    centroid: { lat: 46.00, lng: -86.25 },
    surfaceAreaAcres: 8_400,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: [
      'Walleye',
      'Northern Pike',
      'Smallmouth Bass',
      'Yellow Perch',
      'Bluegill',
    ],
    accessNotes:
      'Manistique. Stained shallow lake. Walleye + pike fishery; good ice-fishing destination.',
  },
  {
    id: 'mi-brevoort-lake',
    name: 'Brevoort Lake',
    states: ['MI'],
    type: 'lake',
    bbox: [46.00, -85.05, 46.06, -84.95],
    centroid: { lat: 46.03, lng: -85.00 },
    surfaceAreaAcres: 4_233,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Walleye', 'Northern Pike', 'Smallmouth Bass', 'Yellow Perch'],
    accessNotes:
      'UP near Mackinac Bridge. Walleye + pike fishery. Hiawatha National Forest.',
  },
  {
    id: 'mi-lake-michigamme',
    name: 'Lake Michigamme',
    states: ['MI'],
    type: 'lake',
    bbox: [46.50, -88.20, 46.58, -88.05],
    centroid: { lat: 46.54, lng: -88.12 },
    surfaceAreaAcres: 4_300,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: [
      'Walleye',
      'Smallmouth Bass',
      'Northern Pike',
      'Yellow Perch',
      'Lake Whitefish',
    ],
    accessNotes:
      'UP. Walleye + smallmouth fishery. Lake whitefish run in fall.',
  },

  // =====================================================================
  //   IMPOUNDMENTS / DAM PONDS (on salmon/steelhead rivers)
  // =====================================================================
  {
    id: 'mi-hardy-dam-pond',
    name: 'Hardy Dam Pond',
    aliases: ['Hardy Pond', 'Hardy Reservoir'],
    states: ['MI'],
    type: 'reservoir',
    bbox: [43.40, -85.78, 43.52, -85.60],
    centroid: { lat: 43.46, lng: -85.69 },
    surfaceAreaAcres: 4_000,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: [
      'Walleye',
      'Largemouth Bass',
      'Smallmouth Bass',
      'Northern Pike',
      'Channel Catfish',
      'Crappie',
      'Yellow Perch',
    ],
    accessNotes:
      'Muskegon River impoundment. Walleye fishery in fall + winter. Tailwater below produces steelhead in spring. Consumers Energy generates here.',
  },
  {
    id: 'mi-croton-pond',
    name: 'Croton Pond',
    states: ['MI'],
    type: 'reservoir',
    bbox: [43.41, -85.70, 43.45, -85.66],
    centroid: { lat: 43.43, lng: -85.68 },
    surfaceAreaAcres: 1_240,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: [
      'Walleye',
      'Smallmouth Bass',
      'Largemouth Bass',
      'Northern Pike',
      'Crappie',
      'Yellow Perch',
    ],
    accessNotes:
      'Croton Dam — top barrier on Muskegon River. Below the dam is the salmon/steelhead water. Pond above is warm-water fishery.',
  },
  {
    id: 'mi-tippy-dam-pond',
    name: 'Tippy Dam Pond',
    aliases: ['Tippy Pond'],
    states: ['MI'],
    type: 'reservoir',
    bbox: [44.23, -85.85, 44.30, -85.72],
    centroid: { lat: 44.26, lng: -85.78 },
    surfaceAreaAcres: 1_300,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: [
      'Walleye',
      'Largemouth Bass',
      'Smallmouth Bass',
      'Northern Pike',
      'Crappie',
      'Yellow Perch',
    ],
    accessNotes:
      'Big Manistee impoundment. Below is THE salmon water; above is warm-water inland fishery. Consumers Energy.',
  },
  {
    id: 'mi-hodenpyl-dam-pond',
    name: 'Hodenpyl Dam Pond',
    aliases: ['Hodenpyl Pond'],
    states: ['MI'],
    type: 'reservoir',
    bbox: [44.35, -85.78, 44.42, -85.65],
    centroid: { lat: 44.38, lng: -85.72 },
    surfaceAreaAcres: 1_460,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: [
      'Walleye',
      'Smallmouth Bass',
      'Largemouth Bass',
      'Northern Pike',
      'Crappie',
      'Yellow Perch',
    ],
    accessNotes:
      'Big Manistee impoundment upstream of Tippy. Less pressure than Tippy Pond.',
  },
  {
    id: 'mi-mio-pond',
    name: 'Mio Pond',
    states: ['MI'],
    type: 'reservoir',
    bbox: [44.65, -84.15, 44.70, -84.05],
    centroid: { lat: 44.67, lng: -84.10 },
    surfaceAreaAcres: 1_000,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: [
      'Smallmouth Bass',
      'Largemouth Bass',
      'Northern Pike',
      'Walleye',
      'Yellow Perch',
    ],
    accessNotes:
      'Au Sable River impoundment at Mio. Tailwater below is famous trophy brown trout water (Mio → McKinley Bridge).',
  },
  {
    id: 'mi-foote-dam-pond',
    name: 'Foote Dam Pond',
    aliases: ['Foote Pond'],
    states: ['MI'],
    type: 'reservoir',
    bbox: [44.40, -83.55, 44.45, -83.45],
    centroid: { lat: 44.42, lng: -83.50 },
    surfaceAreaAcres: 1_900,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: [
      'Walleye',
      'Largemouth Bass',
      'Smallmouth Bass',
      'Northern Pike',
      'Crappie',
      'Yellow Perch',
    ],
    accessNotes:
      'Au Sable River impoundment — top barrier for salmon/steelhead runs from Lake Huron. Below = run water; above = warm-water inland fishery.',
  },

  // =====================================================================
  //   RIVERS — salmon/steelhead + trout
  // =====================================================================
  {
    id: 'mi-manistee-river-lower',
    name: 'Big Manistee River (Lower)',
    aliases: ['Manistee River', 'Lower Manistee', 'Big Manistee'],
    states: ['MI'],
    type: 'tailwater',
    // Tippy Dam → Lake Michigan. Long thin bbox follows river.
    bbox: [44.10, -86.40, 44.30, -85.65],
    centroid: { lat: 44.24, lng: -85.99 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '04125550' },
      // Tippy is Consumers Energy — no public schedule API. We
      // infer from the USGS gauge below the dam (rising water =
      // generation on). More reliable than the stubbed CE scraper.
      damSchedule: { kind: 'auto', flowSiteId: '04125550' },
    },
    species: [
      'Chinook Salmon',
      'Coho Salmon',
      'Steelhead',
      'Brown Trout',
      'Lake Trout',
      'Smallmouth Bass',
      'Walleye',
    ],
    hatchTags: ['hex', 'caddis', 'isonychia', 'march-brown'],
    runLimits: [
      {
        species: 'Chinook Salmon',
        limit: 'Tippy Dam (impassable)',
        note: 'Peak run: late Aug → early Oct.',
      },
      {
        species: 'Steelhead',
        limit: 'Tippy Dam (impassable)',
        note: 'Fall + spring runs; fresh chrome at Tippy Oct-April.',
      },
      {
        species: 'Coho Salmon',
        limit: 'Tippy Dam (impassable)',
        note: 'Less abundant than kings; Sept-Oct.',
      },
    ],
    popularLures: [
      'Skein bags for steelhead',
      'Spawn bags drifted under floats',
      'Hex dries on July evenings',
    ],
    regulationsUrl: 'https://www.michigan.gov/dnr/managing-resources/fisheries',
    accessNotes:
      "Tippy Dam → High Bridge → Bear Creek → Lake Michigan. Salmon Sept-Oct, steelhead Oct-April, lake-run brown trout year-round. Hex hatch night-fishing late June-early July.",
  },
  {
    id: 'mi-manistee-river-upper',
    name: 'Upper Manistee River',
    aliases: ['Upper Manistee'],
    states: ['MI'],
    type: 'freestone',
    bbox: [44.40, -85.50, 44.90, -84.80],
    centroid: { lat: 44.62, lng: -85.20 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '04124500' },
    },
    species: ['Brown Trout', 'Brook Trout', 'Rainbow Trout', 'Smallmouth Bass'],
    hatchTags: ['hex', 'sulfur', 'caddis', 'bwo', 'march-brown', 'isonychia'],
    accessNotes:
      'Designated Blue Ribbon trout water above CCC Bridge. Year-round flies-only between M-72 and CCC Bridge. Hex hatch the highlight. Hodenpyl + Tippy dams isolate this stretch from salmon-run waters below.',
  },
  {
    id: 'mi-au-sable-upper',
    name: 'Upper Au Sable (Holy Water)',
    aliases: ['AuSable Holy Water', 'Au Sable Holy Water', 'Holy Water'],
    states: ['MI'],
    type: 'freestone',
    bbox: [44.55, -84.70, 44.78, -84.40],
    centroid: { lat: 44.66, lng: -84.55 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '04136000' },
    },
    species: ['Brown Trout', 'Brook Trout', 'Rainbow Trout'],
    hatchTags: ['hex', 'sulfur', 'bwo', 'isonychia', 'march-brown', 'caddis'],
    accessNotes:
      "Burton's Landing → Wakeley Bridge = flies-only catch-and-release Holy Water. South Branch the most famous Hex hatch in MI. Trico mornings in August. Isolated from salmon-run waters by the Mio + Alcona + Loud + Five Channels + Cooke + Foote dam chain.",
  },
  {
    id: 'mi-au-sable-middle-chain',
    name: 'Au Sable Middle Chain (Alcona → Cooke)',
    aliases: ['Au Sable Middle', 'AuSable Alcona', 'AuSable Loud', 'AuSable Cooke'],
    states: ['MI'],
    type: 'tailwater',
    // Alcona Dam (~44.66, -83.93) → Loud Dam → Five Channels Dam →
    // Cooke Dam (~44.42, -83.62). Series of small impoundments +
    // tailwater stretches. Each pool fishes for warm-water bass +
    // panfish; the short tailwater stretches between dams hold
    // brown + rainbow trout when generation is on.
    bbox: [44.40, -83.92, 44.55, -83.55],
    centroid: { lat: 44.48, lng: -83.75 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '04137005' },
      // Consumers Energy operates Alcona / Loud / Five Channels /
      // Cooke. No scheduled feed available; auto-infer from gauge.
      damSchedule: { kind: 'auto', flowSiteId: '04137005' },
    },
    species: [
      'Smallmouth Bass',
      'Largemouth Bass',
      'Walleye',
      'Northern Pike',
      'Yellow Perch',
      'Brown Trout',
      'Rainbow Trout',
    ],
    accessNotes:
      'Series of small Consumers Energy impoundments. Bass + pike in the pools; short cold-water trout stretches in the tailwaters between dams (most productive right after generation stops).',
  },
  {
    id: 'mi-manistee-hodenpyl-tailwater',
    name: 'Manistee River below Hodenpyl Dam',
    aliases: ['Manistee Hodenpyl', 'Manistee between dams'],
    states: ['MI'],
    type: 'tailwater',
    // Between Hodenpyl Dam (~44.39, -85.71) and Tippy Pond
    // (~44.30, -85.85). Short 6-mi stretch of trout water before
    // the river fills Tippy Pond.
    bbox: [44.28, -85.85, 44.40, -85.65],
    centroid: { lat: 44.34, lng: -85.75 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '04124500' },
      // Hodenpyl Dam (Consumers Energy) — auto-infer from the upper
      // Manistee gauge (which captures the dam outflow before it
      // enters Tippy Pond).
      damSchedule: { kind: 'auto', flowSiteId: '04124500' },
    },
    species: ['Brown Trout', 'Rainbow Trout', 'Brook Trout', 'Smallmouth Bass'],
    hatchTags: ['hex', 'sulfur', 'caddis', 'bwo', 'isonychia'],
    accessNotes:
      'Trout-only stretch between Hodenpyl and Tippy. Less pressure than the upper / lower sections. Float Hodenpyl Powerhouse → Red Bridge.',
  },
  {
    id: 'mi-muskegon-hardy-tailwater',
    name: 'Muskegon River below Hardy Dam',
    aliases: ['Muskegon between dams', 'Hardy-to-Croton'],
    states: ['MI'],
    type: 'tailwater',
    // Hardy Dam (~43.46, -85.69) → Croton Pond (~43.43, -85.68).
    // Very short connecting stretch — Croton Pond starts just
    // downstream of Hardy. Most users fishing 'below Hardy' are
    // actually on Croton Pond itself, but the river-only section
    // between the dams is its own thing.
    bbox: [43.43, -85.78, 43.48, -85.65],
    centroid: { lat: 43.45, lng: -85.71 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '04121970' },
      // Hardy Dam (Consumers Energy). The Croton gauge downstream
      // captures both Hardy + Croton outflows — use it for the
      // generation inference.
      damSchedule: { kind: 'auto', flowSiteId: '04121970' },
    },
    species: ['Smallmouth Bass', 'Walleye', 'Northern Pike', 'Brown Trout'],
    accessNotes:
      'Short tailwater stretch above Croton Pond. Most fishing happens in Croton Pond itself; the river segment holds smallmouth + occasional brown trout.',
  },
  {
    id: 'mi-au-sable-mio-tailwater',
    name: 'Au Sable below Mio Dam (Trophy Water)',
    aliases: ['Au Sable Trophy Water', 'AuSable Trophy', 'Mio Tailwater'],
    states: ['MI'],
    type: 'tailwater',
    // Mio Dam → McKinley Bridge → Alcona Pond.
    // Famous trophy-brown stretch managed under special regs.
    bbox: [44.55, -84.15, 44.70, -83.90],
    centroid: { lat: 44.63, lng: -84.05 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '04136500' },
      // Mio Dam (Consumers Energy) — auto-infer from gauge.
      damSchedule: { kind: 'auto', flowSiteId: '04136500' },
    },
    species: ['Brown Trout', 'Rainbow Trout', 'Brook Trout', 'Smallmouth Bass'],
    hatchTags: ['hex', 'isonychia', 'caddis', 'sulfur', 'bwo'],
    accessNotes:
      'Special-regs trophy brown stretch — Mio Dam to McKinley Bridge runs ~12 mi of artificial-only, slot-limit water. Drift the slot pools; streamers at low light. Big browns 24"+ are caught here every season.',
  },
  {
    id: 'mi-au-sable-lower',
    name: 'Lower Au Sable (below Foote Dam)',
    aliases: ['Lower AuSable', 'Au Sable Foote'],
    states: ['MI'],
    type: 'tailwater',
    bbox: [44.36, -83.55, 44.45, -83.30],
    centroid: { lat: 44.40, lng: -83.42 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '04137500' },
      // Foote Dam is Consumers Energy. They don't publish a schedule
      // feed we can scrape, so we infer generation status from the
      // downstream USGS gauge flow pattern (rising = generation,
      // steady = closed). The same gauge powers `flow` above.
      damSchedule: { kind: 'auto', flowSiteId: '04137500' },
    },
    species: [
      'Chinook Salmon',
      'Steelhead',
      'Brown Trout',
      'Walleye',
      'Smallmouth Bass',
      'Lake Trout',
    ],
    runLimits: [
      {
        species: 'Chinook Salmon',
        limit: 'Foote Dam (impassable)',
        note: 'Peak Sept-Oct. Foote is the upper barrier — kings stack below.',
      },
      {
        species: 'Steelhead',
        limit: 'Foote Dam (impassable)',
        note: 'Fall + spring fishery on bobbers + spawn.',
      },
    ],
    accessNotes:
      'Foote Dam → Lake Huron at Oscoda. Salmon + steelhead water — popular pier + boat fishery. Whirlpool below the dam holds stacked kings in the run.',
  },
  {
    id: 'mi-au-sable-south-branch',
    name: 'South Branch Au Sable',
    aliases: ['South Branch'],
    states: ['MI'],
    type: 'freestone',
    bbox: [44.55, -84.45, 44.75, -84.15],
    centroid: { lat: 44.65, lng: -84.32 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '04135700' },
    },
    species: ['Brown Trout', 'Brook Trout', 'Rainbow Trout'],
    hatchTags: ['hex', 'sulfur', 'bwo', 'caddis', 'isonychia'],
    accessNotes:
      'Mason Tract is the marquee stretch. Hex hatch the highlight; bring big stimulators. Wild trout, no salmon (above the impoundment chain).',
  },
  {
    id: 'mi-muskegon-river',
    name: 'Muskegon River (below Croton)',
    aliases: ['Muskegon River', 'Muskegon'],
    states: ['MI'],
    type: 'tailwater',
    bbox: [43.20, -86.30, 43.50, -85.55],
    centroid: { lat: 43.32, lng: -85.92 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '04121970' },
      // Croton Dam (Consumers Energy) — auto-infer from gauge.
      damSchedule: { kind: 'auto', flowSiteId: '04121970' },
    },
    species: [
      'Chinook Salmon',
      'Coho Salmon',
      'Steelhead',
      'Brown Trout',
      'Smallmouth Bass',
      'Walleye',
    ],
    runLimits: [
      {
        species: 'Chinook Salmon',
        limit: 'Croton Dam (impassable)',
        note: 'Peak Sept-Oct. Newaygo + Croton boat ramps are the action.',
      },
      {
        species: 'Steelhead',
        limit: 'Croton Dam (impassable)',
        note: 'Fall + spring. Best Sept-November + March-May.',
      },
      {
        species: 'Coho Salmon',
        limit: 'Croton Dam (impassable)',
      },
    ],
    accessNotes:
      'Below Croton Dam. Premier salmon + steelhead river. Newaygo + Croton + Hardy Pond stretches. Salmon mid-Sept through mid-Oct.',
  },
  {
    id: 'mi-pere-marquette',
    name: 'Pere Marquette River',
    aliases: ['PM', 'PM River', 'Pere Marquette'],
    states: ['MI'],
    type: 'freestone',
    bbox: [43.85, -86.40, 44.10, -85.50],
    centroid: { lat: 43.98, lng: -85.95 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '04122500' },
    },
    species: ['Chinook Salmon', 'Steelhead', 'Brown Trout', 'Rainbow Trout'],
    hatchTags: ['hex', 'sulfur', 'caddis', 'isonychia'],
    runLimits: [
      {
        species: 'Chinook Salmon',
        limit: 'No dam — runs the entire 64 miles to headwaters',
        note: 'Peak Sept-Oct. Highest density M-37 → Gleason\'s Landing.',
      },
      {
        species: 'Steelhead',
        limit: 'No dam — entire river',
        note: 'Fall + spring runs reach the headwaters in March.',
      },
    ],
    accessNotes:
      "Designated Wild + Scenic. NO mainstem dam — salmon + steelhead run the entire river. Flies-only stretch from M-37 → Gleason's Landing.",
  },
  {
    id: 'mi-pere-marquette-headwaters',
    name: 'Pere Marquette Headwaters',
    aliases: ['Upper Pere Marquette', 'PM Headwaters'],
    states: ['MI'],
    type: 'freestone',
    bbox: [43.90, -85.85, 44.05, -85.50],
    centroid: { lat: 43.97, lng: -85.65 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '04122500' },
    },
    species: ['Brown Trout', 'Brook Trout', 'Rainbow Trout'],
    hatchTags: ['hex', 'sulfur', 'caddis'],
    accessNotes:
      'Above the flies-only section. Brown trout + brook trout. Hex hatch on the headwater stretches. Salmon + steelhead reach here in fall + spring.',
  },
  {
    id: 'mi-white-river',
    name: 'White River (MI)',
    aliases: ['White River Hesperia'],
    states: ['MI'],
    type: 'tailwater',
    bbox: [43.50, -86.50, 43.65, -86.05],
    centroid: { lat: 43.58, lng: -86.27 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '04122200' },
      // Hesperia Dam — auto-infer from downstream gauge.
      damSchedule: { kind: 'auto', flowSiteId: '04122200' },
    },
    species: [
      'Chinook Salmon',
      'Steelhead',
      'Brown Trout',
      'Smallmouth Bass',
    ],
    runLimits: [
      {
        species: 'Chinook Salmon',
        limit: 'Hesperia Dam',
        note: 'Hesperia is the upper barrier — salmon stack below the dam Sept-Oct.',
      },
      {
        species: 'Steelhead',
        limit: 'Hesperia Dam',
        note: 'Fall + spring runs. Skein + spawn productive.',
      },
    ],
    accessNotes:
      'Flows from inland MI through White Lake → Lake Michigan at Whitehall. Hesperia Dam is the upper barrier. Strong salmon + steelhead fishery.',
  },
  {
    id: 'mi-boardman-river',
    name: 'Boardman River',
    aliases: ['Boardman'],
    states: ['MI'],
    type: 'freestone',
    bbox: [44.65, -85.65, 44.78, -85.35],
    centroid: { lat: 44.72, lng: -85.50 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '04126970' },
    },
    species: ['Brown Trout', 'Brook Trout', 'Steelhead', 'Chinook Salmon'],
    hatchTags: ['sulfur', 'hex', 'caddis', 'bwo'],
    runLimits: [
      {
        species: 'Chinook Salmon',
        limit: 'Sabin Dam (removed 2018) → still impeded by Boardman Pond Dam',
        note: 'Recent dam removals have opened additional stream miles to salmon.',
      },
      {
        species: 'Steelhead',
        limit: 'Boardman Pond Dam',
      },
    ],
    accessNotes:
      'Designated trout stream above Brown Bridge Dam removal. Lower river runs salmon + steelhead from West Bay. Wading + light gear.',
  },
  {
    id: 'mi-bear-river',
    name: 'Bear River (MI)',
    aliases: ['Bear River Petoskey'],
    states: ['MI'],
    type: 'freestone',
    bbox: [45.30, -84.98, 45.40, -84.93],
    centroid: { lat: 45.35, lng: -84.95 },
    species: ['Chinook Salmon', 'Steelhead', 'Brown Trout'],
    runLimits: [
      {
        species: 'Chinook Salmon',
        limit: 'Bear River Dam (downtown Petoskey)',
        note: 'Salmon stage at the dam in Sept-Oct.',
      },
      {
        species: 'Steelhead',
        limit: 'Bear River Dam',
      },
    ],
    accessNotes:
      'Drops through downtown Petoskey to Little Traverse Bay. Short, urban, productive in the salmon run.',
  },
  {
    id: 'mi-jordan-river',
    name: 'Jordan River',
    states: ['MI'],
    type: 'freestone',
    bbox: [45.05, -85.10, 45.25, -84.90],
    centroid: { lat: 45.15, lng: -85.00 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '04127800' },
    },
    species: ['Brook Trout', 'Brown Trout', 'Rainbow Trout'],
    hatchTags: ['sulfur', 'bwo', 'caddis', 'isonychia'],
    accessNotes:
      "MI's first designated Wild + Scenic river. Catch-and-release flies-only sections. Brookies + browns in cold spring-fed water. Mouths into Lake Charlevoix; minor steelhead runs reach here.",
  },
  {
    id: 'mi-big-two-hearted',
    name: 'Two Hearted River',
    aliases: ['Big Two Hearted', 'Two Hearted'],
    states: ['MI'],
    type: 'freestone',
    bbox: [46.55, -85.50, 46.85, -85.05],
    centroid: { lat: 46.70, lng: -85.28 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '04036000' },
    },
    species: ['Brook Trout', 'Coaster Brook Trout', 'Steelhead'],
    accessNotes:
      "Hemingway's river. Remote UP brook trout water. Lower river runs steelhead from Lake Superior — no dam barriers.",
  },
  {
    id: 'mi-fox-river',
    name: 'Fox River',
    states: ['MI'],
    type: 'freestone',
    bbox: [46.20, -86.10, 46.55, -85.85],
    centroid: { lat: 46.38, lng: -85.97 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '04055500' },
    },
    species: ['Brook Trout'],
    accessNotes:
      "Hemingway's actual Big Two Hearted (literary). Pristine brook trout water in Seney refuge.",
  },
  {
    id: 'mi-sturgeon-river-up',
    name: 'Sturgeon River (UP)',
    states: ['MI'],
    type: 'freestone',
    bbox: [46.45, -88.85, 46.95, -88.40],
    centroid: { lat: 46.70, lng: -88.62 },
    species: ['Brook Trout', 'Brown Trout', 'Steelhead'],
    accessNotes:
      'Houghton County. Deep canyon section + tributaries. Big browns possible.',
  },
  {
    id: 'mi-tahquamenon-river',
    name: 'Tahquamenon River',
    states: ['MI'],
    type: 'freestone',
    bbox: [46.55, -85.40, 46.78, -85.10],
    centroid: { lat: 46.62, lng: -85.25 },
    species: [
      'Northern Pike',
      'Smallmouth Bass',
      'Walleye',
      'Yellow Perch',
      'Muskellunge',
    ],
    accessNotes:
      'UP. Tannin-stained river with the famous Tahquamenon Falls (Upper + Lower). Pike + muskie in the lower river toward Lake Superior.',
  },
  {
    id: 'mi-thunder-bay-river',
    name: 'Thunder Bay River',
    aliases: ['Thunder Bay River Alpena'],
    states: ['MI'],
    type: 'tailwater',
    bbox: [45.00, -83.60, 45.10, -83.30],
    centroid: { lat: 45.05, lng: -83.42 },
    species: [
      'Chinook Salmon',
      'Steelhead',
      'Brown Trout',
      'Walleye',
      'Smallmouth Bass',
      'Northern Pike',
    ],
    runLimits: [
      {
        species: 'Chinook Salmon',
        limit: '9th Avenue Dam (Alpena)',
        note: 'Urban fishery, productive in fall.',
      },
      {
        species: 'Steelhead',
        limit: '9th Avenue Dam (Alpena)',
      },
    ],
    accessNotes:
      'Flows through Alpena into Thunder Bay. Salmon + steelhead urban fishery.',
  },
  {
    id: 'mi-rifle-river',
    name: 'Rifle River',
    states: ['MI'],
    type: 'freestone',
    bbox: [44.05, -83.95, 44.50, -83.85],
    centroid: { lat: 44.30, lng: -83.90 },
    species: [
      'Chinook Salmon',
      'Steelhead',
      'Brown Trout',
      'Smallmouth Bass',
      'Yellow Perch',
    ],
    runLimits: [
      {
        species: 'Chinook Salmon',
        limit: 'No mainstem dam barrier — runs whole river',
        note: 'Modest runs vs the west-side rivers.',
      },
      {
        species: 'Steelhead',
        limit: 'No mainstem dam barrier',
      },
    ],
    accessNotes:
      'Drops from inland MI through Omer to Saginaw Bay. Multi-species fishery; salmon runs smaller than Lake Michigan streams.',
  },
  {
    id: 'mi-kalamazoo-river',
    name: 'Kalamazoo River',
    states: ['MI'],
    type: 'tailwater',
    bbox: [42.40, -86.30, 42.70, -85.55],
    centroid: { lat: 42.58, lng: -85.95 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '04108660' },
      // Allegan Dam — auto-infer from downstream gauge.
      damSchedule: { kind: 'auto', flowSiteId: '04108660' },
    },
    species: [
      'Chinook Salmon',
      'Steelhead',
      'Brown Trout',
      'Smallmouth Bass',
      'Walleye',
      'Channel Catfish',
    ],
    runLimits: [
      {
        species: 'Chinook Salmon',
        limit: 'Allegan Dam',
        note: 'Allegan is the upper barrier — kings stack below Sept-Oct.',
      },
      {
        species: 'Steelhead',
        limit: 'Allegan Dam',
        note: 'Fall + spring runs.',
      },
    ],
    accessNotes:
      'Flows through Kalamazoo + Allegan to Lake Michigan at Saugatuck. Allegan Dam is the upper salmon barrier. Smallmouth + walleye above the dam.',
  },
  {
    id: 'mi-st-joseph-river',
    name: 'St. Joseph River',
    aliases: ['St Joe', 'Saint Joseph River'],
    states: ['MI', 'IN'],
    type: 'tailwater',
    bbox: [41.45, -86.50, 42.10, -85.10],
    centroid: { lat: 41.75, lng: -85.80 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '04101500' },
      // Berrien Springs Dam (Indiana Michigan Power) — auto-infer.
      damSchedule: { kind: 'auto', flowSiteId: '04101500' },
    },
    species: [
      'Steelhead',
      'Chinook Salmon',
      'Brown Trout',
      'Smallmouth Bass',
      'Walleye',
      'Channel Catfish',
    ],
    runLimits: [
      {
        species: 'Chinook Salmon',
        limit: 'Berrien Springs Dam',
        note: 'Berrien Springs ladder lets some fish upstream; primary harvest is below.',
      },
      {
        species: 'Steelhead',
        limit: 'Berrien Springs Dam → fish ladder allows upstream movement',
        note: 'Steelhead pass through to upstream stocking points.',
      },
    ],
    accessNotes:
      'Steelhead river — fall + spring runs from Lake Michigan to Berrien Springs. Berrien Springs ladder passes some steelhead upstream. Smallmouth above the dams.',
  },
  {
    id: 'mi-grand-river',
    name: 'Grand River',
    states: ['MI'],
    type: 'tailwater',
    bbox: [42.85, -85.80, 43.05, -84.60],
    centroid: { lat: 42.95, lng: -85.20 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '04119000' },
      // Sixth Street Dam (downtown Grand Rapids) — auto-infer.
      damSchedule: { kind: 'auto', flowSiteId: '04119000' },
    },
    species: [
      'Steelhead',
      'Chinook Salmon',
      'Walleye',
      'Smallmouth Bass',
      'Channel Catfish',
      'White Bass',
    ],
    runLimits: [
      {
        species: 'Chinook Salmon',
        limit: 'Sixth Street Dam (Grand Rapids)',
        note: 'Salmon stack at the dam in late summer — urban fishery.',
      },
      {
        species: 'Steelhead',
        limit: 'Sixth Street Dam',
        note: 'Fall + spring runs to downtown GR.',
      },
    ],
    accessNotes:
      "Longest river in MI. Sixth Street Dam (Grand Rapids) is the highest barrier — steelhead + salmon stage there. Sturgeon population recovering.",
  },
  {
    id: 'mi-pigeon-river',
    name: 'Pigeon River',
    states: ['MI'],
    type: 'freestone',
    bbox: [44.95, -84.55, 45.30, -84.30],
    centroid: { lat: 45.12, lng: -84.42 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '04127918' },
    },
    species: ['Brook Trout', 'Brown Trout', 'Rainbow Trout'],
    hatchTags: ['sulfur', 'caddis', 'bwo'],
    accessNotes:
      'Pigeon River Country State Forest. Brook trout headwaters; bigger browns lower river.',
  },
  {
    id: 'mi-cheboygan-river',
    name: 'Cheboygan River',
    states: ['MI'],
    type: 'tailwater',
    bbox: [45.55, -84.50, 45.65, -84.45],
    centroid: { lat: 45.60, lng: -84.48 },
    species: [
      'Walleye',
      'Northern Pike',
      'Smallmouth Bass',
      'Yellow Perch',
      'Channel Catfish',
    ],
    accessNotes:
      'Connects Mullett Lake to Lake Huron via Cheboygan Dam + lock. Walleye fishery in the lower river.',
  },
  {
    id: 'mi-detroit-river',
    name: 'Detroit River',
    states: ['MI'],
    type: 'tailwater',
    bbox: [42.05, -83.20, 42.50, -82.85],
    centroid: { lat: 42.30, lng: -83.05 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'noaa-coops', stationId: '9034052' },
    },
    species: [
      'Walleye',
      'Smallmouth Bass',
      'Yellow Perch',
      'Muskellunge',
      'Channel Catfish',
      'White Bass',
    ],
    accessNotes:
      'Connects Lake St. Clair to Lake Erie. Spring walleye run is world-class — jigging hair jigs in heavy current March-May. Trolling for trophy muskie in fall.',
  },
  {
    id: 'mi-st-clair-river',
    name: 'St. Clair River',
    states: ['MI'],
    type: 'tailwater',
    bbox: [42.55, -82.55, 43.00, -82.40],
    centroid: { lat: 42.78, lng: -82.48 },
    species: [
      'Walleye',
      'Smallmouth Bass',
      'Yellow Perch',
      'Northern Pike',
      'Channel Catfish',
    ],
    accessNotes:
      'Connects Lake Huron (Port Huron) to Lake St. Clair. Strong walleye + smallmouth fishery in the heavy current. Marysville + St. Clair are the public access points.',
  },
  {
    id: 'mi-saginaw-river',
    name: 'Saginaw River',
    states: ['MI'],
    type: 'freestone',
    bbox: [43.40, -84.05, 43.75, -83.85],
    centroid: { lat: 43.55, lng: -83.95 },
    species: [
      'Walleye',
      'Channel Catfish',
      'Smallmouth Bass',
      'Largemouth Bass',
      'Yellow Perch',
      'White Bass',
    ],
    accessNotes:
      'Flows from confluence of Tittabawassee + Shiawassee + Cass + Flint into Saginaw Bay. Spring walleye run from the bay. Heavily urbanized.',
  },
];
