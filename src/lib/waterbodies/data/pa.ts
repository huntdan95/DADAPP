import type { Waterbody } from '../registry';

/**
 * Pennsylvania waters. Three distinct fisheries:
 *   - Limestone-spring trout streams (central PA "limestoners")
 *   - Freestone mountain trout (Pine Creek, Loyalsock, etc.)
 *   - Lake Erie + Erie tributaries (steelhead "alley")
 *   - Big-river smallmouth + walleye (Susquehanna, Allegheny, Delaware)
 *
 * PA Fish + Boat Commission publishes a stocking schedule that
 * touches hundreds of waters every spring — the focus list is
 * generous on PA accordingly.
 */
export const PA_WATERBODIES: Waterbody[] = [
  // ---------- Lake Erie + steelhead tributaries ---------------------
  {
    id: 'pa-lake-erie-pa',
    name: 'Lake Erie (Pennsylvania shore)',
    states: ['PA'],
    type: 'great_lakes',
    bbox: [41.95, -80.55, 42.35, -79.65],
    centroid: { lat: 42.15, lng: -80.10 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'noaa-coops', stationId: '9063020' },
    },
    species: ['Steelhead', 'Walleye', 'Yellow Perch', 'Smallmouth Bass', 'Lake Trout'],
    accessNotes:
      'PA\'s only Great Lake shoreline. Walleye trolling May-Aug. Yellow perch + smallmouth in Presque Isle Bay. Charters from Erie + North East.',
  },
  {
    id: 'pa-elk-creek-pa',
    name: 'Elk Creek (PA)',
    states: ['PA'],
    type: 'freestone',
    bbox: [41.95, -80.40, 42.05, -80.25],
    centroid: { lat: 42.00, lng: -80.32 },
    species: ['Steelhead', 'Brown Trout', 'Chinook Salmon'],
    runLimits: [
      {
        species: 'Steelhead',
        limit: 'Folly\'s End — no impoundment, runs to top',
        note: 'Peak Oct-Nov + March-April.',
      },
    ],
    accessNotes:
      'PA\'s blue-ribbon steelhead tributary. Big runs Oct-Nov. Heavy pressure — fish weekdays + early.',
  },
  {
    id: 'pa-walnut-creek',
    name: 'Walnut Creek',
    states: ['PA'],
    type: 'freestone',
    bbox: [42.00, -80.20, 42.05, -80.10],
    centroid: { lat: 42.02, lng: -80.15 },
    species: ['Steelhead', 'Brown Trout'],
    runLimits: [
      {
        species: 'Steelhead',
        limit: 'Manchester Hole + barriers above',
      },
    ],
    accessNotes:
      'Major Erie steelhead trib. Manchester Hole at the access road is the famous staging pool.',
  },

  // ---------- Limestone trout streams (central PA) ------------------
  {
    id: 'pa-penns-creek',
    name: 'Penns Creek',
    aliases: ['Penn\'s Creek'],
    states: ['PA'],
    type: 'freestone',
    bbox: [40.78, -77.35, 40.92, -76.95],
    centroid: { lat: 40.85, lng: -77.15 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '01555000' },
    },
    species: ['Brown Trout', 'Rainbow Trout', 'Brook Trout'],
    hatchTags: ['sulfur', 'green-drake', 'caddis', 'march-brown', 'isonychia', 'bwo'],
    accessNotes:
      'Limestone-influenced freestone with legendary Green Drake hatch (late May / early June). Heritage trout stretch. Wild brown population.',
  },
  {
    id: 'pa-spring-creek',
    name: 'Spring Creek (PA)',
    aliases: ['Spring Creek State College'],
    states: ['PA'],
    type: 'freestone',
    bbox: [40.78, -77.92, 40.92, -77.78],
    centroid: { lat: 40.85, lng: -77.85 },
    species: ['Brown Trout', 'Rainbow Trout'],
    hatchTags: ['sulfur', 'caddis', 'bwo', 'midge', 'trico'],
    accessNotes:
      'Limestone spring creek through Bellefonte / State College. Catch-and-release Heritage waters. Wild brown trout — high density.',
  },
  {
    id: 'pa-letort-spring-run',
    name: 'Letort Spring Run',
    aliases: ['LeTort'],
    states: ['PA'],
    type: 'freestone',
    bbox: [40.20, -77.20, 40.28, -77.10],
    centroid: { lat: 40.24, lng: -77.14 },
    species: ['Brown Trout'],
    hatchTags: ['sulfur', 'trico', 'sowbug', 'cress-bug', 'midge'],
    accessNotes:
      'Cradle of American fly-fishing. Marinaro + Fox stomping grounds. Very technical: short casts, tiny flies, big wild browns. Catch-and-release.',
  },
  {
    id: 'pa-yellow-breeches',
    name: 'Yellow Breeches Creek',
    states: ['PA'],
    type: 'freestone',
    bbox: [40.10, -77.30, 40.25, -76.90],
    centroid: { lat: 40.18, lng: -77.10 },
    species: ['Brown Trout', 'Rainbow Trout', 'Brook Trout'],
    hatchTags: ['sulfur', 'caddis', 'isonychia', 'march-brown'],
    accessNotes:
      'Catch-and-release section at Allenberry. Stocked + wild. White Fly hatch is the famous one. Light pressure mid-week.',
  },
  {
    id: 'pa-falling-spring-branch',
    name: 'Falling Spring Branch',
    states: ['PA'],
    type: 'freestone',
    bbox: [39.92, -77.65, 40.00, -77.55],
    centroid: { lat: 39.96, lng: -77.60 },
    species: ['Brown Trout', 'Rainbow Trout'],
    hatchTags: ['sulfur', 'trico', 'sowbug'],
    accessNotes:
      'Small limestone stream near Chambersburg. Trico hatch is legendary in July-August (size 22-26).',
  },

  // ---------- Freestone mountain trout ------------------------------
  {
    id: 'pa-pine-creek-pa',
    name: 'Pine Creek (PA)',
    aliases: ['PA Grand Canyon'],
    states: ['PA'],
    type: 'freestone',
    bbox: [41.45, -77.55, 41.85, -77.25],
    centroid: { lat: 41.65, lng: -77.42 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '01548500' },
    },
    species: ['Brown Trout', 'Rainbow Trout', 'Brook Trout', 'Smallmouth Bass'],
    hatchTags: ['hex', 'sulfur', 'caddis', 'march-brown', 'isonychia'],
    accessNotes:
      'PA Grand Canyon. Stocked trout in upper river; smallmouth + walleye in lower below Tioga.',
  },
  {
    id: 'pa-loyalsock-creek',
    name: 'Loyalsock Creek',
    states: ['PA'],
    type: 'freestone',
    bbox: [41.35, -77.05, 41.55, -76.55],
    centroid: { lat: 41.45, lng: -76.80 },
    species: ['Brown Trout', 'Rainbow Trout', 'Brook Trout', 'Smallmouth Bass'],
    hatchTags: ['sulfur', 'caddis', 'march-brown', 'isonychia'],
    accessNotes:
      'Sullivan County trout water. Catch-and-release sections. Wild + stocked trout.',
  },
  {
    id: 'pa-kettle-creek',
    name: 'Kettle Creek',
    states: ['PA'],
    type: 'freestone',
    bbox: [41.45, -77.85, 41.62, -77.65],
    centroid: { lat: 41.55, lng: -77.75 },
    species: ['Brown Trout', 'Rainbow Trout', 'Brook Trout'],
    hatchTags: ['sulfur', 'caddis', 'march-brown'],
    accessNotes:
      'Heavily-stocked PA Fish + Boat water. Kettle Creek State Park access. Brook trout in headwater tribs.',
  },
  {
    id: 'pa-fishing-creek-pa',
    name: 'Fishing Creek (PA)',
    states: ['PA'],
    type: 'freestone',
    bbox: [41.10, -76.80, 41.30, -76.55],
    centroid: { lat: 41.20, lng: -76.65 },
    species: ['Brown Trout', 'Rainbow Trout', 'Brook Trout'],
    hatchTags: ['sulfur', 'caddis', 'bwo'],
    accessNotes:
      'Columbia County. Wild brown + brook trout. Catch-and-release section.',
  },
  {
    id: 'pa-tulpehocken-creek',
    name: 'Tulpehocken Creek',
    aliases: ['The Tully'],
    states: ['PA'],
    type: 'tailwater',
    bbox: [40.30, -76.10, 40.40, -75.90],
    centroid: { lat: 40.35, lng: -76.00 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '01471510' },
      damSchedule: { kind: 'auto', flowSiteId: '01471510' },
    },
    species: ['Brown Trout', 'Rainbow Trout'],
    hatchTags: ['sulfur', 'caddis', 'midge', 'bwo'],
    accessNotes:
      'Tailwater below Blue Marsh Lake. PA\'s only true year-round tailwater. Trophy brown trout.',
  },

  // ---------- Big-river smallmouth ----------------------------------
  {
    id: 'pa-susquehanna-river',
    name: 'Susquehanna River',
    states: ['PA'],
    type: 'freestone',
    bbox: [39.70, -77.05, 41.85, -75.95],
    centroid: { lat: 40.80, lng: -76.50 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '01540500' },
    },
    species: ['Smallmouth Bass', 'Walleye', 'Catfish', 'Striped Bass', 'Muskie'],
    accessNotes:
      'Premier smallmouth river. North + West Branch + main stem. Wading + canoe-friendly riffles. Pre-spawn 4+ lb fish in May.',
  },
  {
    id: 'pa-allegheny-river',
    name: 'Allegheny River',
    states: ['PA'],
    type: 'freestone',
    bbox: [40.40, -80.05, 41.95, -78.40],
    centroid: { lat: 41.15, lng: -79.20 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '03031500' },
    },
    species: ['Smallmouth Bass', 'Walleye', 'Muskie', 'Sauger', 'Catfish', 'Northern Pike'],
    accessNotes:
      'Heritage River. Smallmouth + muskie above Kinzua. Walleye + sauger in the navigation pools below.',
  },
  {
    id: 'pa-delaware-river-pa',
    name: 'Delaware River (PA portion)',
    states: ['PA', 'NJ', 'NY'],
    type: 'freestone',
    bbox: [39.65, -75.45, 41.95, -74.65],
    centroid: { lat: 40.80, lng: -75.10 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '01438500' },
    },
    species: ['Smallmouth Bass', 'Striped Bass', 'American Shad', 'Walleye', 'Muskie'],
    accessNotes:
      'PA/NJ/NY border. Smallmouth + striper run. Famous shad run April-May. Upper river trout water (West + East Branch).',
  },

  // ---------- Reservoirs -------------------------------------------
  {
    id: 'pa-lake-wallenpaupack',
    name: 'Lake Wallenpaupack',
    states: ['PA'],
    type: 'reservoir',
    bbox: [41.40, -75.30, 41.50, -75.10],
    centroid: { lat: 41.45, lng: -75.20 },
    surfaceAreaAcres: 5_700,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'usgs-lake', siteId: '01428900' },
    },
    species: ['Smallmouth Bass', 'Largemouth Bass', 'Walleye', 'Lake Trout', 'Striped Bass', 'Trout'],
    accessNotes:
      'PA\'s third-largest lake. Deep + clear. Smallmouth + lake trout. Trout + walleye stocked.',
  },
  {
    id: 'pa-raystown-lake',
    name: 'Raystown Lake',
    states: ['PA'],
    type: 'reservoir',
    bbox: [40.30, -78.05, 40.50, -77.85],
    centroid: { lat: 40.40, lng: -77.95 },
    surfaceAreaAcres: 8_300,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'usgs-lake', siteId: '01563100' },
    },
    species: ['Striped Bass', 'Lake Trout', 'Smallmouth Bass', 'Largemouth Bass', 'Trout', 'Catfish'],
    accessNotes:
      'PA\'s largest lake entirely in PA. USACE on Raystown Branch Juniata. Striper + lake trout fishery — unusual for PA.',
  },
  {
    id: 'pa-pymatuning-lake',
    name: 'Pymatuning Lake',
    aliases: ['Pymatuning Reservoir'],
    states: ['PA', 'OH'],
    type: 'reservoir',
    bbox: [41.55, -80.55, 41.75, -80.40],
    centroid: { lat: 41.65, lng: -80.47 },
    surfaceAreaAcres: 17_088,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'usgs-lake', siteId: '03100500' },
    },
    species: ['Walleye', 'Muskie', 'Largemouth Bass', 'Crappie', 'Bluegill', 'Catfish'],
    accessNotes:
      'PA/OH border. Walleye + muskie fishery. Famous for "the spillway where ducks walk on the fish" (carp feeding).',
  },
];
