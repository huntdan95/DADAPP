import type { Waterbody } from '../registry';

/**
 * Kentucky waters. USACE reservoirs + Cumberland tailwater.
 */
export const KY_WATERBODIES: Waterbody[] = [
  {
    id: 'ky-cumberland-lake',
    name: 'Lake Cumberland',
    aliases: ['Cumberland Reservoir'],
    states: ['KY'],
    type: 'reservoir',
    bbox: [36.85, -85.50, 37.10, -84.60],
    centroid: { lat: 36.95, lng: -85.05 },
    surfaceAreaAcres: 65_530,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'usgs-lake', siteId: '03413000' },
    },
    species: [
      'Striped Bass',
      'Smallmouth Bass',
      'Largemouth Bass',
      'Spotted Bass',
      'Crappie',
      'Walleye',
      'Bluegill',
      'Trout (stocked tailwater)',
    ],
    accessNotes:
      'Massive USACE impoundment on the Cumberland River. Striped bass program produces fish over 50 lb. Wolf Creek Dam at the south end controls the tailwater.',
  },
  {
    id: 'ky-cumberland-tailwater',
    name: 'Cumberland River (below Wolf Creek Dam)',
    aliases: ['Cumberland Tailwater', 'Cumberland River KY'],
    states: ['KY'],
    type: 'tailwater',
    // Wolf Creek Dam → confluence below Lake Cumberland
    bbox: [36.85, -85.20, 37.00, -84.60],
    centroid: { lat: 36.92, lng: -84.90 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '03414500' },
      damSchedule: { kind: 'auto', flowSiteId: '03414500' },
    },
    species: ['Brown Trout', 'Rainbow Trout', 'Smallmouth Bass', 'Striped Bass', 'Walleye'],
    hatchTags: ['sulfur', 'midge', 'caddis', 'bwo'],
    popularLures: [
      'Trico spinners on summer mornings',
      'Egg patterns below stocking trucks',
      'Streamers for trophy browns Sept-Nov',
    ],
    accessNotes:
      'Tailwater extends ~75 miles from Wolf Creek Dam to Burkesville. Trophy brown trout fishery. Generation = no wading. Check USACE schedule.',
  },
  {
    id: 'ky-licking-river-tailwater',
    name: 'Licking River (below Cave Run Dam)',
    aliases: ['Cave Run Tailwater', 'Licking River Tailwater'],
    states: ['KY'],
    type: 'tailwater',
    bbox: [38.05, -83.65, 38.20, -83.45],
    centroid: { lat: 38.12, lng: -83.55 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '03249500' },
      // Cave Run Dam (USACE) — auto-infer from downstream gauge.
      damSchedule: { kind: 'auto', flowSiteId: '03249500' },
    },
    species: ['Rainbow Trout', 'Brown Trout', 'Muskie', 'Smallmouth Bass'],
    hatchTags: ['caddis', 'sulfur', 'midge', 'bwo'],
    accessNotes:
      'Cave Run Dam → KY DFWR stocks rainbows + browns. Coldwater for ~5 miles below the dam in summer. Muskie + smallmouth lower on the river.',
  },
  {
    id: 'ky-obey-river-tailwater',
    name: 'Obey River (below Dale Hollow Dam)',
    aliases: ['Dale Hollow Tailwater', 'Obey River'],
    states: ['TN', 'KY'],
    type: 'tailwater',
    bbox: [36.52, -85.45, 36.62, -85.10],
    centroid: { lat: 36.57, lng: -85.30 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '03414000' },
      // Dale Hollow Dam (USACE) — auto-infer.
      damSchedule: { kind: 'auto', flowSiteId: '03414000' },
    },
    species: ['Rainbow Trout', 'Brown Trout', 'Walleye', 'Smallmouth Bass'],
    hatchTags: ['midge', 'sulfur', 'caddis', 'bwo'],
    accessNotes:
      'Cold tailwater below Dale Hollow Dam. Wading windows tight; check USACE generation schedule. Browns to 10+ lb caught annually.',
  },
  {
    id: 'ky-cave-run-lake',
    name: 'Cave Run Lake',
    states: ['KY'],
    type: 'reservoir',
    bbox: [38.05, -83.65, 38.20, -83.40],
    centroid: { lat: 38.12, lng: -83.52 },
    surfaceAreaAcres: 8_270,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'usgs-lake', siteId: '03249498' },
    },
    species: ['Muskie', 'Largemouth Bass', 'Spotted Bass', 'Crappie', 'Bluegill'],
    accessNotes:
      'KY\'s premier muskie fishery. Stocked aggressively; 36-inch minimum. Stained water; jerkbaits + bucktails on submerged timber.',
  },
  {
    id: 'ky-green-river-lake',
    name: 'Green River Lake',
    states: ['KY'],
    type: 'reservoir',
    bbox: [37.20, -85.45, 37.35, -85.15],
    centroid: { lat: 37.27, lng: -85.32 },
    surfaceAreaAcres: 8_210,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'usgs-lake', siteId: '03305990' },
    },
    species: ['Largemouth Bass', 'Spotted Bass', 'Crappie', 'Bluegill', 'Channel Catfish'],
    accessNotes:
      'USACE impoundment. Stained water bass lake. Good fall topwater on flats. Crappie on standing timber 12-20 ft.',
  },
  {
    id: 'ky-laurel-river-lake',
    name: 'Laurel River Lake',
    states: ['KY'],
    type: 'reservoir',
    bbox: [36.92, -84.30, 37.05, -84.05],
    centroid: { lat: 36.98, lng: -84.18 },
    surfaceAreaAcres: 6_060,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'usgs-lake', siteId: '03404820' },
    },
    species: [
      'Smallmouth Bass',
      'Largemouth Bass',
      'Rainbow Trout',
      'Brown Trout',
      'Bluegill',
      'Walleye',
    ],
    accessNotes:
      'Steep-walled clear lake. Smallmouth on rocky points. KY DFWR stocks trout monthly Oct-May.',
  },
];
