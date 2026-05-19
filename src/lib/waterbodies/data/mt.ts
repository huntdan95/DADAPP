import type { Waterbody } from '../registry';

/**
 * Montana waters. The big stuff: blue-ribbon trout rivers of the
 * Madison / Yellowstone / Missouri / Big Hole / Beaverhead / Smith
 * systems, plus Flathead Lake + the Missouri reservoir chain
 * (Holter / Hauser / Canyon Ferry) and Fort Peck.
 */
export const MT_WATERBODIES: Waterbody[] = [
  // ---------- Major blue-ribbon rivers ------------------------------
  {
    id: 'mt-madison-river',
    name: 'Madison River',
    states: ['MT'],
    type: 'freestone',
    bbox: [44.65, -111.85, 45.95, -111.30],
    centroid: { lat: 45.30, lng: -111.55 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '06038500' },
    },
    species: ['Rainbow Trout', 'Brown Trout', 'Brook Trout', 'Mountain Whitefish'],
    hatchTags: ['salmonfly', 'pmd', 'caddis', 'bwo', 'tricos', 'hopper'],
    accessNotes:
      "America's flagship trout river. Hebgen → Quake Lake → upper river → Bear Trap Canyon → lower. Salmonfly hatch late June. Hopper season Aug-Sept.",
  },
  {
    id: 'mt-bighorn-river',
    name: 'Bighorn River',
    states: ['MT'],
    type: 'tailwater',
    bbox: [45.30, -107.85, 46.30, -107.45],
    centroid: { lat: 45.80, lng: -107.65 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '06294500' },
      damSchedule: { kind: 'auto', flowSiteId: '06294500' },
    },
    species: ['Brown Trout', 'Rainbow Trout', 'Mountain Whitefish'],
    hatchTags: ['midge', 'sulfur', 'bwo', 'caddis', 'tricos'],
    accessNotes:
      'Yellowtail Dam tailwater. 13-mile blue-ribbon section to Bighorn FAS. Year-round trophy brown trout. Sowbug + scud staples.',
  },
  {
    id: 'mt-yellowstone-river-mt',
    name: 'Yellowstone River (Montana)',
    states: ['MT'],
    type: 'freestone',
    bbox: [44.95, -111.10, 47.85, -104.05],
    centroid: { lat: 46.40, lng: -107.60 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '06192500' },
    },
    species: ['Cutthroat Trout', 'Brown Trout', 'Rainbow Trout', 'Mountain Whitefish', 'Sauger', 'Smallmouth Bass'],
    hatchTags: ['salmonfly', 'pmd', 'caddis', 'hopper', 'mother-day-caddis'],
    accessNotes:
      "Longest undammed river in the lower 48. Yankee Jim Canyon → Livingston → Big Timber → Billings. Salmonfly hatch is the famous one. Native Yellowstone cutthroat in upper.",
  },
  {
    id: 'mt-missouri-river-mt',
    name: 'Missouri River (Montana)',
    aliases: ['Mighty Mo'],
    states: ['MT'],
    type: 'tailwater',
    bbox: [46.85, -112.05, 48.50, -106.50],
    centroid: { lat: 47.70, lng: -109.30 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '06066500' },
      damSchedule: { kind: 'auto', flowSiteId: '06066500' },
    },
    species: ['Brown Trout', 'Rainbow Trout', 'Mountain Whitefish'],
    hatchTags: ['pmd', 'caddis', 'tricos', 'midge', 'bwo', 'hopper'],
    accessNotes:
      'Holter Dam → Cascade. Year-round tailwater for trophy browns + rainbows. PMD hatch on flat water — technical dry-fly fishing.',
  },
  {
    id: 'mt-beaverhead-river',
    name: 'Beaverhead River',
    states: ['MT'],
    type: 'tailwater',
    bbox: [44.95, -113.05, 45.85, -112.30],
    centroid: { lat: 45.40, lng: -112.65 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '06016000' },
      damSchedule: { kind: 'auto', flowSiteId: '06016000' },
    },
    species: ['Brown Trout', 'Rainbow Trout', 'Mountain Whitefish'],
    hatchTags: ['pmd', 'caddis', 'tricos', 'bwo'],
    accessNotes:
      'Clark Canyon Dam tailwater. High-density wild brown trout. Tight cover; technical fishing. Float trips only most of the year.',
  },
  {
    id: 'mt-big-hole-river',
    name: 'Big Hole River',
    states: ['MT'],
    type: 'freestone',
    bbox: [45.45, -113.45, 46.05, -112.40],
    centroid: { lat: 45.75, lng: -112.92 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '06025500' },
    },
    species: ['Rainbow Trout', 'Brown Trout', 'Cutthroat Trout', 'Arctic Grayling', 'Mountain Whitefish'],
    hatchTags: ['salmonfly', 'pmd', 'caddis', 'hopper', 'tricos'],
    accessNotes:
      'Last river in the lower 48 with native fluvial Arctic grayling. Salmonfly hatch the big event. Float trip from Wise River → Glen.',
  },
  {
    id: 'mt-smith-river',
    name: 'Smith River (MT)',
    states: ['MT'],
    type: 'freestone',
    bbox: [46.45, -111.55, 47.30, -110.95],
    centroid: { lat: 46.88, lng: -111.25 },
    species: ['Brown Trout', 'Rainbow Trout', 'Cutthroat Trout', 'Mountain Whitefish'],
    hatchTags: ['salmonfly', 'pmd', 'caddis', 'hopper'],
    accessNotes:
      'Permit-only 4-day float trip (lottery-drawn). Limestone canyon. World-class wilderness trout fishery.',
  },
  {
    id: 'mt-blackfoot-river',
    name: 'Blackfoot River',
    states: ['MT'],
    type: 'freestone',
    bbox: [46.75, -114.10, 47.05, -112.50],
    centroid: { lat: 46.90, lng: -113.30 },
    species: ['Cutthroat Trout', 'Brown Trout', 'Bull Trout', 'Rainbow Trout', 'Mountain Whitefish'],
    hatchTags: ['salmonfly', 'pmd', 'caddis', 'hopper'],
    accessNotes:
      "A River Runs Through It. Lincoln → Bonner. Native westslope cutthroat + bull trout (catch-and-release). Limited access; float-trip favorite.",
  },
  {
    id: 'mt-clark-fork-river',
    name: 'Clark Fork River',
    states: ['MT'],
    type: 'freestone',
    bbox: [46.40, -115.05, 46.95, -112.10],
    centroid: { lat: 46.70, lng: -113.55 },
    species: ['Brown Trout', 'Rainbow Trout', 'Cutthroat Trout', 'Bull Trout', 'Northern Pike'],
    accessNotes:
      'Largest river by volume in MT. Recovering fishery (Milltown Dam removed 2008). Smallmouth + pike in lower reaches; trout above.',
  },
  {
    id: 'mt-gallatin-river',
    name: 'Gallatin River',
    states: ['MT'],
    type: 'freestone',
    bbox: [45.10, -111.45, 45.85, -111.10],
    centroid: { lat: 45.50, lng: -111.27 },
    species: ['Rainbow Trout', 'Brown Trout', 'Cutthroat Trout', 'Mountain Whitefish'],
    hatchTags: ['salmonfly', 'pmd', 'caddis', 'hopper'],
    accessNotes:
      'Yellowstone Park → Bozeman. Whitewater + trout. Wade fishing primarily. Big Sky stretch heavily pressured.',
  },

  // ---------- Lakes / Reservoirs ------------------------------------
  {
    id: 'mt-flathead-lake',
    name: 'Flathead Lake',
    states: ['MT'],
    type: 'lake',
    bbox: [47.55, -114.35, 48.05, -114.05],
    centroid: { lat: 47.80, lng: -114.20 },
    surfaceAreaAcres: 122_000,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'usgs-lake', siteId: '12371550' },
    },
    species: ['Lake Trout', 'Yellow Perch', 'Lake Whitefish', 'Northern Pike', 'Bull Trout'],
    accessNotes:
      'Largest natural freshwater lake west of the Mississippi. Trophy lake trout (Mack Days tournament). Yellow perch through the ice.',
  },
  {
    id: 'mt-canyon-ferry-lake',
    name: 'Canyon Ferry Lake',
    states: ['MT'],
    type: 'reservoir',
    bbox: [46.40, -111.85, 46.85, -111.55],
    centroid: { lat: 46.62, lng: -111.70 },
    surfaceAreaAcres: 35_000,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Walleye', 'Rainbow Trout', 'Yellow Perch', 'Brown Trout'],
    accessNotes:
      'Missouri River impoundment. Spring walleye + trout fishery. Helena recreation hub.',
  },
  {
    id: 'mt-hauser-lake-mt',
    name: 'Hauser Lake',
    states: ['MT'],
    type: 'reservoir',
    bbox: [46.65, -111.85, 46.90, -111.65],
    centroid: { lat: 46.77, lng: -111.75 },
    surfaceAreaAcres: 3_700,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'usgs-lake', siteId: '06065500' },
    },
    species: ['Walleye', 'Rainbow Trout', 'Perch', 'Kokanee Salmon'],
    accessNotes:
      'Missouri River impoundment between Canyon Ferry + Holter. Kokanee + trout.',
  },
  {
    id: 'mt-holter-lake',
    name: 'Holter Lake',
    states: ['MT'],
    type: 'reservoir',
    bbox: [46.85, -112.05, 47.05, -111.85],
    centroid: { lat: 46.95, lng: -111.95 },
    surfaceAreaAcres: 4_810,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'usgs-lake', siteId: '06066500' },
    },
    species: ['Walleye', 'Rainbow Trout', 'Brown Trout', 'Perch', 'Kokanee Salmon'],
    accessNotes:
      "Missouri River impoundment. The big-fish lake of the chain. World-record walleye (17.75 lb, 2007).",
  },
  {
    id: 'mt-fort-peck-lake',
    name: 'Fort Peck Lake',
    states: ['MT'],
    type: 'reservoir',
    bbox: [47.40, -107.60, 48.05, -105.30],
    centroid: { lat: 47.70, lng: -106.45 },
    surfaceAreaAcres: 245_000,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Walleye', 'Northern Pike', 'Lake Trout', 'Chinook Salmon', 'Smallmouth Bass'],
    accessNotes:
      'USACE on the Missouri. Massive — 134 mi long. Trophy walleye + pike + lake trout. Salmon stocking program.',
  },
];
