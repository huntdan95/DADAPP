import type { Waterbody } from '../registry';

/**
 * North Carolina waters. Two distinct fisheries:
 *   - Western NC mountain trout streams (delayed-harvest + wild trout)
 *   - Piedmont/Coastal reservoirs + warmwater rivers
 */
export const NC_WATERBODIES: Waterbody[] = [
  // ---------- Reservoirs (Piedmont) ----------------------------------
  {
    id: 'nc-lake-norman',
    name: 'Lake Norman',
    states: ['NC'],
    type: 'reservoir',
    bbox: [35.40, -81.10, 35.75, -80.85],
    centroid: { lat: 35.56, lng: -80.97 },
    surfaceAreaAcres: 32_500,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Striped Bass', 'Spotted Bass', 'Largemouth Bass', 'White Perch', 'Crappie', 'Catfish'],
    accessNotes:
      'Largest man-made lake in NC. Duke Energy. Spotted bass dominant black-bass species. Stripers in 30-50 ft of water summer.',
  },
  {
    id: 'nc-lake-james',
    name: 'Lake James',
    states: ['NC'],
    type: 'reservoir',
    bbox: [35.72, -82.05, 35.82, -81.80],
    centroid: { lat: 35.77, lng: -81.93 },
    surfaceAreaAcres: 6_812,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Smallmouth Bass', 'Largemouth Bass', 'Walleye', 'White Bass', 'Crappie'],
    accessNotes:
      'Clear, deep, two-basin lake. Walleye stocking program is unusual for the southeast. Smallmouth on rocky points spring/fall.',
  },
  {
    id: 'nc-lake-wylie',
    name: 'Lake Wylie',
    states: ['NC', 'SC'],
    type: 'reservoir',
    bbox: [34.95, -81.15, 35.20, -80.95],
    centroid: { lat: 35.08, lng: -81.05 },
    surfaceAreaAcres: 13_400,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Largemouth Bass', 'Spotted Bass', 'Striped Bass', 'Hybrid Bass', 'Crappie', 'Catfish'],
    accessNotes:
      'Duke Energy on Catawba River. Pre-spawn tournament water in March. Crappie + catfish year-round.',
  },
  {
    id: 'nc-lake-tillery',
    name: 'Lake Tillery',
    states: ['NC'],
    type: 'reservoir',
    bbox: [35.15, -80.10, 35.45, -79.90],
    centroid: { lat: 35.30, lng: -79.99 },
    surfaceAreaAcres: 5_240,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Striped Bass', 'Largemouth Bass', 'White Perch', 'Crappie', 'Catfish'],
    accessNotes:
      'Yadkin River impoundment. Big-river-style striper fishery; pre-spawn run up to Tuckertown.',
  },
  {
    id: 'nc-jordan-lake',
    name: 'Jordan Lake',
    aliases: ['Jordan Reservoir'],
    states: ['NC'],
    type: 'reservoir',
    bbox: [35.55, -79.10, 35.85, -78.90],
    centroid: { lat: 35.70, lng: -79.00 },
    surfaceAreaAcres: 13_900,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Largemouth Bass', 'Striped Bass', 'White Perch', 'Catfish', 'Crappie'],
    accessNotes:
      'USACE on Haw River. Bass tournament lake. Striper + white perch summer schoolers.',
  },
  {
    id: 'nc-hiwassee-lake',
    name: 'Hiwassee Lake',
    states: ['NC'],
    type: 'reservoir',
    bbox: [35.10, -84.20, 35.20, -83.95],
    centroid: { lat: 35.15, lng: -84.08 },
    surfaceAreaAcres: 6_280,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Smallmouth Bass', 'Largemouth Bass', 'Walleye', 'Muskie', 'Crappie'],
    accessNotes:
      'TVA. Smallmouth + walleye fishery. Muskie introduced in recent years.',
  },
  {
    id: 'nc-fontana-lake',
    name: 'Fontana Lake',
    states: ['NC'],
    type: 'reservoir',
    bbox: [35.40, -84.05, 35.55, -83.55],
    centroid: { lat: 35.47, lng: -83.80 },
    surfaceAreaAcres: 10_640,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Smallmouth Bass', 'Walleye', 'Largemouth Bass', 'Spotted Bass', 'Muskie'],
    accessNotes:
      'TVA Fontana Dam on Little Tennessee. GSMNP boundary on north shore. Deep clear water — smallmouth on rocky points.',
  },
  {
    id: 'nc-santeetlah-lake',
    name: 'Lake Santeetlah',
    states: ['NC'],
    type: 'reservoir',
    bbox: [35.30, -83.95, 35.45, -83.80],
    centroid: { lat: 35.37, lng: -83.87 },
    surfaceAreaAcres: 2_881,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Smallmouth Bass', 'Largemouth Bass', 'Walleye', 'Yellow Perch'],
    accessNotes:
      'Alcoa Power Company on Cheoah River. Clear, undeveloped lake. Smallmouth + walleye.',
  },
  {
    id: 'nc-lake-jocassee',
    name: 'Lake Jocassee',
    states: ['NC', 'SC'],
    type: 'reservoir',
    bbox: [34.95, -83.05, 35.05, -82.90],
    centroid: { lat: 35.00, lng: -82.97 },
    surfaceAreaAcres: 7_565,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Smallmouth Bass', 'Brown Trout', 'Rainbow Trout', 'Spotted Bass', 'Walleye'],
    accessNotes:
      'Duke Energy, GA/SC border. Deep cold lake — trout stocked. Crystal-clear water; light line. Smallmouth on the bluffs.',
  },
  {
    id: 'nc-lake-glenville',
    name: 'Lake Glenville',
    aliases: ['Thorpe Reservoir'],
    states: ['NC'],
    type: 'reservoir',
    bbox: [35.16, -83.16, 35.22, -83.08],
    centroid: { lat: 35.19, lng: -83.12 },
    surfaceAreaAcres: 1_462,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Smallmouth Bass', 'Largemouth Bass', 'Walleye', 'Rainbow Trout'],
    accessNotes:
      'Duke Energy. Highest-elevation reservoir east of the Mississippi (3,496 ft). Cold + clear.',
  },

  // ---------- Trout streams (Western NC) -----------------------------
  {
    id: 'nc-nantahala-river',
    name: 'Nantahala River',
    states: ['NC'],
    type: 'tailwater',
    bbox: [35.20, -83.65, 35.40, -83.45],
    centroid: { lat: 35.30, lng: -83.55 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '03504900' },
      damSchedule: { kind: 'auto', flowSiteId: '03504900' },
    },
    species: ['Brown Trout', 'Rainbow Trout', 'Brook Trout'],
    hatchTags: ['caddis', 'midge', 'sulfur', 'bwo'],
    accessNotes:
      'Delayed-harvest section is a NC trout-fishing destination. Cold tailwater of Nantahala Lake. Catch-and-release Oct-June.',
  },
  {
    id: 'nc-davidson-river',
    name: 'Davidson River',
    states: ['NC'],
    type: 'freestone',
    bbox: [35.20, -82.85, 35.30, -82.70],
    centroid: { lat: 35.25, lng: -82.78 },
    species: ['Rainbow Trout', 'Brown Trout', 'Brook Trout'],
    hatchTags: ['sulfur', 'caddis', 'march-brown', 'bwo'],
    accessNotes:
      'Pisgah NF. Famous trophy brown trout water. Catch-and-release artificial only on the upper section. Light pressure mid-week.',
  },
  {
    id: 'nc-south-toe-river',
    name: 'South Toe River',
    states: ['NC'],
    type: 'freestone',
    bbox: [35.78, -82.30, 35.95, -82.15],
    centroid: { lat: 35.86, lng: -82.22 },
    species: ['Rainbow Trout', 'Brown Trout', 'Brook Trout'],
    hatchTags: ['caddis', 'sulfur', 'march-brown'],
    accessNotes:
      'Pisgah NF. Wild + stocked sections. Light pressure outside of weekends.',
  },
  {
    id: 'nc-tuckasegee-river',
    name: 'Tuckasegee River',
    aliases: ['Tuck'],
    states: ['NC'],
    type: 'tailwater',
    bbox: [35.30, -83.50, 35.55, -83.10],
    centroid: { lat: 35.42, lng: -83.30 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '03513000' },
      damSchedule: { kind: 'auto', flowSiteId: '03513000' },
    },
    species: ['Brown Trout', 'Rainbow Trout', 'Smallmouth Bass'],
    hatchTags: ['caddis', 'sulfur', 'midge', 'bwo'],
    accessNotes:
      'Multi-personality river — delayed-harvest, hatchery-supported, and wild sections. Trophy browns in the lower reaches. Floats out of Dillsboro popular.',
  },
  {
    id: 'nc-french-broad-river-nc',
    name: 'French Broad River (NC)',
    states: ['NC'],
    type: 'freestone',
    bbox: [35.45, -83.00, 35.95, -82.45],
    centroid: { lat: 35.70, lng: -82.75 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '03451500' },
    },
    species: ['Smallmouth Bass', 'Brown Trout', 'Rainbow Trout', 'Largemouth Bass', 'Muskie'],
    accessNotes:
      'Asheville-area river. Trout in upper-tributary sections; smallmouth main fishery from Asheville → TN line. Muskie stocking program.',
  },
  {
    id: 'nc-nolichucky-river',
    name: 'Nolichucky River',
    aliases: ['Nolichucky'],
    states: ['NC', 'TN'],
    type: 'freestone',
    bbox: [35.85, -82.85, 36.10, -82.45],
    centroid: { lat: 35.95, lng: -82.65 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '03465500' },
    },
    species: ['Smallmouth Bass', 'Brown Trout', 'Rainbow Trout', 'Walleye'],
    accessNotes:
      'High-gradient mountain river. Whitewater + trout above the gorge; smallmouth + walleye below into TN.',
  },
  {
    id: 'nc-linville-river',
    name: 'Linville River',
    states: ['NC'],
    type: 'freestone',
    bbox: [35.85, -82.05, 36.00, -81.85],
    centroid: { lat: 35.92, lng: -81.95 },
    species: ['Rainbow Trout', 'Brown Trout', 'Brook Trout'],
    accessNotes:
      'Linville Gorge Wilderness Area. Hike-in fishing for wild trout. Rough access; permit required for some stretches.',
  },
  {
    id: 'nc-watauga-river-nc',
    name: 'Watauga River (NC)',
    states: ['NC'],
    type: 'freestone',
    bbox: [36.13, -82.05, 36.30, -81.75],
    centroid: { lat: 36.20, lng: -81.90 },
    species: ['Brown Trout', 'Rainbow Trout', 'Brook Trout', 'Smallmouth Bass'],
    accessNotes:
      'Above Watauga Lake (TN). Wild + stocked trout. Boone area; pressure heavy weekends.',
  },
  {
    id: 'nc-pigeon-river-nc',
    name: 'Pigeon River (NC)',
    states: ['NC'],
    type: 'freestone',
    bbox: [35.70, -83.10, 35.90, -82.80],
    centroid: { lat: 35.80, lng: -82.95 },
    species: ['Rainbow Trout', 'Brown Trout', 'Smallmouth Bass'],
    accessNotes:
      'Upper Pigeon: trout. Lower: recovering smallmouth fishery after Champion International paper-mill cleanup.',
  },
];
