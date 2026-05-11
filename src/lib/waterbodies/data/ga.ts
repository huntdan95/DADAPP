import type { Waterbody } from '../registry';

/**
 * Georgia waters. Heavy on USACE reservoirs + the north-GA
 * mountain trout streams the state stocks weekly (Apr-Oct).
 *
 * Tailwater configs use auto-from-USGS-gauge for dam-generation
 * status — the various authorities (USACE, Georgia Power, TVA)
 * don't publish a single schedule feed we can scrape, but the
 * downstream gauges capture the generation pattern accurately.
 */
export const GA_WATERBODIES: Waterbody[] = [
  // ---------- USACE / GA Power reservoirs ----------------------------
  {
    id: 'ga-lake-lanier',
    name: 'Lake Lanier',
    aliases: ['Lake Sidney Lanier', 'Lanier'],
    states: ['GA'],
    type: 'reservoir',
    bbox: [34.15, -84.20, 34.40, -83.85],
    centroid: { lat: 34.28, lng: -84.00 },
    surfaceAreaAcres: 38_000,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Striped Bass', 'Spotted Bass', 'Largemouth Bass', 'Crappie', 'Bream', 'Catfish'],
    accessNotes:
      'USACE Buford Dam impoundment on the Chattahoochee. Spotted bass is the dominant black bass. Striper fishery one of the South\'s best — downlines + planers in summer; topwater Aug.',
  },
  {
    id: 'ga-chattahoochee-tailwater',
    name: 'Chattahoochee River (below Buford Dam)',
    aliases: ['Hooch Tailwater', 'Chattahoochee below Buford'],
    states: ['GA'],
    type: 'tailwater',
    // Buford Dam (~34.16, -83.94) → Morgan Falls Dam → Atlanta metro.
    bbox: [33.80, -84.45, 34.18, -83.90],
    centroid: { lat: 34.00, lng: -84.20 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '02334430' },
      // Buford Dam (USACE) — auto-infer from downstream gauge.
      damSchedule: { kind: 'auto', flowSiteId: '02334430' },
    },
    species: ['Rainbow Trout', 'Brown Trout', 'Striped Bass'],
    hatchTags: ['midge', 'sulfur', 'caddis', 'bwo'],
    accessNotes:
      'Famous Atlanta-area tailwater. Year-round trout fishery — Buford Dam keeps water cold ~30 mi downstream. Generation 2x daily on weekdays; check Corps schedule before wading.',
  },
  {
    id: 'ga-lake-allatoona',
    name: 'Lake Allatoona',
    aliases: ['Allatoona'],
    states: ['GA'],
    type: 'reservoir',
    bbox: [34.10, -84.80, 34.25, -84.55],
    centroid: { lat: 34.17, lng: -84.66 },
    surfaceAreaAcres: 12_000,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Striped Bass', 'Hybrid Bass', 'Spotted Bass', 'Largemouth Bass', 'Crappie', 'Catfish'],
    accessNotes:
      'USACE Allatoona Dam on the Etowah River. North-suburb Atlanta lake. Striper + hybrid fishery; herring forage. Drop-shot spotted bass on the steep bluffs.',
  },
  {
    id: 'ga-etowah-tailwater',
    name: 'Etowah River (below Allatoona Dam)',
    aliases: ['Etowah Tailwater'],
    states: ['GA'],
    type: 'tailwater',
    bbox: [34.05, -84.78, 34.13, -84.55],
    centroid: { lat: 34.09, lng: -84.67 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '02394000' },
      damSchedule: { kind: 'auto', flowSiteId: '02394000' },
    },
    species: ['Striped Bass', 'Spotted Bass', 'Smallmouth Bass', 'Catfish'],
    accessNotes:
      'USACE Allatoona tailwater. Striper fishery in summer when generation pulls fish below the dam. Spotted bass on rocky banks.',
  },
  {
    id: 'ga-lake-hartwell',
    name: 'Lake Hartwell',
    states: ['GA', 'SC'],
    type: 'reservoir',
    bbox: [34.30, -83.10, 34.65, -82.75],
    centroid: { lat: 34.47, lng: -82.92 },
    surfaceAreaAcres: 56_000,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Largemouth Bass', 'Spotted Bass', 'Striped Bass', 'Hybrid Bass', 'Crappie', 'Bream'],
    accessNotes:
      'USACE, GA/SC border on Savannah River. Major tournament lake. Blueback herring forage drives the bite.',
  },
  {
    id: 'ga-lake-russell',
    name: 'Lake Russell',
    aliases: ['Richard B. Russell Lake'],
    states: ['GA', 'SC'],
    type: 'reservoir',
    bbox: [33.95, -82.95, 34.25, -82.65],
    centroid: { lat: 34.10, lng: -82.80 },
    surfaceAreaAcres: 26_650,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Largemouth Bass', 'Spotted Bass', 'Striped Bass', 'Hybrid Bass', 'Crappie'],
    accessNotes:
      'USACE on Savannah River between Hartwell + Thurmond. Less developed than Hartwell. Stripers + hybrids on herring.',
  },
  {
    id: 'ga-lake-thurmond',
    name: 'Clarks Hill / Strom Thurmond Lake',
    aliases: ['Clarks Hill', 'Thurmond', 'Clark Hill'],
    states: ['GA', 'SC'],
    type: 'reservoir',
    bbox: [33.55, -82.55, 33.95, -81.95],
    centroid: { lat: 33.78, lng: -82.27 },
    surfaceAreaAcres: 70_000,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Largemouth Bass', 'Spotted Bass', 'Striped Bass', 'Hybrid Bass', 'Crappie', 'Catfish'],
    accessNotes:
      'Largest GA reservoir. USACE on Savannah River. Striper + hybrid program; spring blueback run.',
  },
  {
    id: 'ga-west-point-lake',
    name: 'West Point Lake',
    states: ['GA', 'AL'],
    type: 'reservoir',
    bbox: [32.85, -85.20, 33.10, -85.00],
    centroid: { lat: 32.97, lng: -85.10 },
    surfaceAreaAcres: 25_900,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Largemouth Bass', 'Spotted Bass', 'Crappie', 'Hybrid Bass', 'Striped Bass'],
    accessNotes:
      'USACE on Chattahoochee River. Stained-to-clear gradient north → south. Crappie shoreline cover spring.',
  },
  {
    id: 'ga-lake-oconee',
    name: 'Lake Oconee',
    states: ['GA'],
    type: 'reservoir',
    bbox: [33.30, -83.30, 33.60, -83.00],
    centroid: { lat: 33.45, lng: -83.15 },
    surfaceAreaAcres: 19_050,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Largemouth Bass', 'Striped Bass', 'Hybrid Bass', 'Crappie', 'Bream', 'Catfish'],
    accessNotes:
      'Georgia Power (Wallace Dam) on Oconee River. Major tournament + striper fishery. Pumpback ops drive water-level fluctuations.',
  },
  {
    id: 'ga-lake-sinclair',
    name: 'Lake Sinclair',
    states: ['GA'],
    type: 'reservoir',
    bbox: [33.05, -83.30, 33.30, -83.05],
    centroid: { lat: 33.18, lng: -83.17 },
    surfaceAreaAcres: 15_330,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Largemouth Bass', 'Striped Bass', 'Hybrid Bass', 'Crappie', 'Catfish', 'Bream'],
    accessNotes:
      'Georgia Power (Sinclair Dam) on Oconee River — downstream of Oconee. Warm-water hybrid/striper fishery. Hydrilla beds drive bass.',
  },
  {
    id: 'ga-carters-lake',
    name: 'Carters Lake',
    states: ['GA'],
    type: 'reservoir',
    bbox: [34.55, -84.75, 34.70, -84.55],
    centroid: { lat: 34.62, lng: -84.65 },
    surfaceAreaAcres: 3_220,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Smallmouth Bass', 'Spotted Bass', 'Largemouth Bass', 'Walleye', 'Crappie', 'Striped Bass'],
    accessNotes:
      'USACE Carters Dam on Coosawattee River. Deepest lake in GA (~450 ft). Walleye + smallmouth — unusual for the South.',
  },
  {
    id: 'ga-coosawattee-tailwater',
    name: 'Coosawattee River (below Carters Dam)',
    aliases: ['Carters Tailwater'],
    states: ['GA'],
    type: 'tailwater',
    bbox: [34.50, -84.75, 34.62, -84.55],
    centroid: { lat: 34.56, lng: -84.65 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '02382500' },
      damSchedule: { kind: 'auto', flowSiteId: '02382500' },
    },
    species: ['Rainbow Trout', 'Brown Trout', 'Walleye', 'Smallmouth Bass'],
    hatchTags: ['midge', 'sulfur', 'caddis'],
    accessNotes:
      'Cold-water trout fishery below Carters Dam. Generation pulls walleye + smallmouth up to the dam in spring.',
  },
  {
    id: 'ga-lake-blue-ridge',
    name: 'Lake Blue Ridge',
    states: ['GA'],
    type: 'reservoir',
    bbox: [34.85, -84.40, 34.95, -84.20],
    centroid: { lat: 34.89, lng: -84.30 },
    surfaceAreaAcres: 3_290,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Walleye', 'Smallmouth Bass', 'Largemouth Bass', 'Yellow Perch', 'Bluegill'],
    accessNotes:
      'TVA Blue Ridge Dam on Toccoa River. Cold deep lake — walleye + smallmouth. Below the dam = the Toccoa Tailwater.',
  },
  {
    id: 'ga-toccoa-tailwater',
    name: 'Toccoa River (below Blue Ridge Dam)',
    aliases: ['Toccoa Tailwater'],
    states: ['GA'],
    type: 'tailwater',
    bbox: [34.80, -84.40, 34.92, -84.20],
    centroid: { lat: 34.86, lng: -84.30 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '02385170' },
      // Blue Ridge is TVA — auto-infer from downstream USGS gauge.
      damSchedule: { kind: 'auto', flowSiteId: '02385170' },
    },
    species: ['Rainbow Trout', 'Brown Trout', 'Brook Trout'],
    hatchTags: ['sulfur', 'midge', 'caddis', 'bwo', 'isonychia'],
    accessNotes:
      'TVA Blue Ridge tailwater. Trophy brown trout water — special-regs section. Float trips Tower Road → Curtis Switch are classic.',
  },
  {
    id: 'ga-lake-chatuge',
    name: 'Lake Chatuge',
    states: ['GA', 'NC'],
    type: 'reservoir',
    bbox: [34.95, -83.85, 35.05, -83.70],
    centroid: { lat: 35.00, lng: -83.78 },
    surfaceAreaAcres: 7_050,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Largemouth Bass', 'Smallmouth Bass', 'Spotted Bass', 'Walleye', 'Crappie'],
    accessNotes:
      'TVA Chatuge Dam on Hiwassee River, GA/NC border. Cold clear water — smallmouth + walleye.',
  },
  {
    id: 'ga-lake-nottely',
    name: 'Lake Nottely',
    states: ['GA'],
    type: 'reservoir',
    bbox: [34.85, -84.05, 34.95, -83.85],
    centroid: { lat: 34.90, lng: -83.95 },
    surfaceAreaAcres: 4_180,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Walleye', 'Spotted Bass', 'Largemouth Bass', 'Smallmouth Bass', 'Crappie'],
    accessNotes:
      'TVA Nottely Dam on Nottely River. Walleye stocking program — spring run up the river.',
  },
  {
    id: 'ga-lake-burton',
    name: 'Lake Burton',
    states: ['GA'],
    type: 'reservoir',
    bbox: [34.78, -83.60, 34.86, -83.50],
    centroid: { lat: 34.82, lng: -83.55 },
    surfaceAreaAcres: 2_775,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Yellow Perch', 'Spotted Bass', 'Largemouth Bass', 'Walleye', 'Lake Trout'],
    accessNotes:
      'Georgia Power impoundment on Tallulah River. Lake trout fishery — unusual for GA. Yellow perch winter ice-out.',
  },

  // ---------- Trout streams (no major dams; mostly freestone) -------
  {
    id: 'ga-soque-river',
    name: 'Soque River',
    states: ['GA'],
    type: 'freestone',
    bbox: [34.55, -83.65, 34.70, -83.50],
    centroid: { lat: 34.62, lng: -83.58 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '02331600' },
    },
    species: ['Rainbow Trout', 'Brown Trout', 'Brook Trout'],
    hatchTags: ['caddis', 'sulfur', 'bwo', 'march-brown'],
    accessNotes:
      'Famous trophy brown trout water. Most of the river runs through private leases (Brigadoon, Soque River Lodge, etc.) — pay-to-fish or guide trip. Public access below Lake Habersham Dam.',
  },
  {
    id: 'ga-chattooga-river',
    name: 'Chattooga River',
    states: ['GA', 'SC'],
    type: 'freestone',
    bbox: [34.65, -83.30, 34.95, -83.15],
    centroid: { lat: 34.80, lng: -83.22 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '02178400' },
    },
    species: ['Rainbow Trout', 'Brown Trout', 'Brook Trout', 'Redeye Bass'],
    hatchTags: ['caddis', 'sulfur', 'march-brown', 'isonychia'],
    accessNotes:
      'Wild + Scenic river, GA/SC border. Delayed-harvest sections in winter. Below Section IV: warmwater, redeye bass + sunfish.',
  },
  {
    id: 'ga-noontootla-creek',
    name: 'Noontootla Creek',
    aliases: ['Noontootla'],
    states: ['GA'],
    type: 'freestone',
    bbox: [34.65, -84.30, 34.78, -84.15],
    centroid: { lat: 34.72, lng: -84.22 },
    species: ['Brook Trout', 'Brown Trout', 'Rainbow Trout'],
    hatchTags: ['caddis', 'sulfur', 'march-brown'],
    accessNotes:
      'Wild trout stream in Chattahoochee NF. Catch-and-release artificial-only above Three Forks. Native brookies in headwater feeders.',
  },
  {
    id: 'ga-cooper-creek',
    name: 'Cooper Creek',
    states: ['GA'],
    type: 'freestone',
    bbox: [34.78, -84.05, 34.88, -83.95],
    centroid: { lat: 34.83, lng: -84.00 },
    species: ['Rainbow Trout', 'Brown Trout', 'Brook Trout'],
    accessNotes:
      'Chattahoochee NF freestone. Stocked weekly Apr-Oct in the lower stretches; wild fish in the upper.',
  },
  {
    id: 'ga-rock-creek',
    name: 'Rock Creek (GA)',
    states: ['GA'],
    type: 'freestone',
    bbox: [34.68, -84.32, 34.78, -84.20],
    centroid: { lat: 34.73, lng: -84.26 },
    species: ['Rainbow Trout', 'Brown Trout', 'Brook Trout'],
    accessNotes:
      'Chattahoochee NF. Stocked stretch + wild brookie headwaters. Pressure heavy on stocking days.',
  },
  {
    id: 'ga-amicalola-creek',
    name: 'Amicalola Creek',
    states: ['GA'],
    type: 'freestone',
    bbox: [34.50, -84.35, 34.65, -84.15],
    centroid: { lat: 34.57, lng: -84.25 },
    species: ['Rainbow Trout', 'Brown Trout', 'Smallmouth Bass'],
    accessNotes:
      'Stocked trout water in upper stretches; smallmouth bass in lower river to Lake Burton Inlet.',
  },
  {
    id: 'ga-dukes-creek',
    name: 'Dukes Creek',
    states: ['GA'],
    type: 'freestone',
    bbox: [34.68, -83.78, 34.78, -83.65],
    centroid: { lat: 34.73, lng: -83.72 },
    species: ['Rainbow Trout', 'Brown Trout', 'Brook Trout'],
    hatchTags: ['caddis', 'sulfur', 'midge'],
    accessNotes:
      'Smithgall Woods State Park. Trophy stretch managed by GA DNR — catch-and-release, single-hook artificials, by-reservation only.',
  },

  // ---------- Warmer rivers + flint ----------------------------------
  {
    id: 'ga-flint-river',
    name: 'Flint River',
    states: ['GA'],
    type: 'freestone',
    bbox: [31.50, -84.30, 33.55, -83.95],
    centroid: { lat: 32.50, lng: -84.10 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '02349605' },
    },
    species: ['Shoal Bass', 'Largemouth Bass', 'Spotted Bass', 'Striped Bass', 'Catfish', 'Bream'],
    accessNotes:
      'Shoal bass fishery world-class — endemic GA species. Limestone-fed clear water above Lake Blackshear; Apalachicola system below.',
  },
  {
    id: 'ga-ocmulgee-river',
    name: 'Ocmulgee River',
    states: ['GA'],
    type: 'freestone',
    bbox: [31.50, -83.80, 33.55, -83.30],
    centroid: { lat: 32.50, lng: -83.55 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '02213000' },
    },
    species: ['Largemouth Bass', 'Spotted Bass', 'Catfish', 'Crappie', 'Bream', 'Striped Bass'],
    accessNotes:
      'Below Lake Jackson dam. Catfish + warmwater bass fishery through middle Georgia.',
  },
  {
    id: 'ga-altamaha-river',
    name: 'Altamaha River',
    states: ['GA'],
    type: 'freestone',
    bbox: [31.30, -82.30, 32.20, -81.50],
    centroid: { lat: 31.75, lng: -81.90 },
    species: [
      'Striped Bass',
      'Largemouth Bass',
      'Catfish',
      'Bream',
      'Hickory Shad',
      'American Shad',
    ],
    accessNotes:
      'Major south-GA river system. Striper run from coast in spring. Shad run March-April.',
  },
  {
    id: 'ga-savannah-river-lower',
    name: 'Savannah River (lower)',
    states: ['GA', 'SC'],
    type: 'freestone',
    bbox: [32.10, -81.60, 33.60, -81.10],
    centroid: { lat: 32.85, lng: -81.35 },
    species: [
      'Striped Bass',
      'Catfish',
      'Hickory Shad',
      'American Shad',
      'Largemouth Bass',
    ],
    accessNotes:
      'Below Thurmond Dam → coast. Tidal influence below Augusta. Striped bass year-round, shad run Feb-April.',
  },
];
