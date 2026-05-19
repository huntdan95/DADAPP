import type { Waterbody } from '../registry';

/**
 * Utah waters. Green River below Flaming Gorge (world-class trout
 * tailwater), Provo + Weber tailwaters, Strawberry / Jordanelle /
 * Deer Creek / Bear Lake reservoirs, plus the Logan + Ogden
 * mountain rivers.
 */
export const UT_WATERBODIES: Waterbody[] = [
  // ---------- Green River tailwater (world-class) -------------------
  {
    id: 'ut-green-river-tailwater',
    name: 'Green River (below Flaming Gorge)',
    aliases: ['Green River UT', 'A Section', 'B Section', 'C Section'],
    states: ['UT'],
    type: 'tailwater',
    // Flaming Gorge Dam → CO border. 30+ miles of A-B-C sections.
    bbox: [40.85, -109.55, 41.05, -109.20],
    centroid: { lat: 40.95, lng: -109.37 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '09234500' },
      damSchedule: { kind: 'auto', flowSiteId: '09234500' },
    },
    species: ['Brown Trout', 'Rainbow Trout', 'Cutthroat Trout'],
    hatchTags: ['midge', 'bwo', 'caddis', 'pmd', 'tricos', 'hopper', 'cicada'],
    accessNotes:
      'World-class tailwater. A Section (dam → Little Hole): trophy water, walk-in or float. B Section: longer floats. C Section: lower-density. Cicada hatch late May-June.',
  },
  {
    id: 'ut-flaming-gorge-reservoir',
    name: 'Flaming Gorge Reservoir',
    states: ['UT', 'WY'],
    type: 'reservoir',
    bbox: [40.85, -109.85, 41.65, -109.30],
    centroid: { lat: 41.20, lng: -109.50 },
    surfaceAreaAcres: 42_020,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Lake Trout', 'Rainbow Trout', 'Brown Trout', 'Smallmouth Bass', 'Kokanee Salmon'],
    accessNotes:
      "Trophy lake trout — world records over 50 lb. Smallmouth in shallow rocky bays. Kokanee salmon stocked. UT/WY border.",
  },

  // ---------- Provo / Weber / Logan trout rivers --------------------
  {
    id: 'ut-provo-river-middle',
    name: 'Middle Provo River',
    aliases: ['Provo Middle'],
    states: ['UT'],
    type: 'tailwater',
    // Jordanelle Dam → Deer Creek Reservoir
    bbox: [40.45, -111.45, 40.55, -111.30],
    centroid: { lat: 40.50, lng: -111.37 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '10155000' },
      damSchedule: { kind: 'auto', flowSiteId: '10155000' },
    },
    species: ['Brown Trout', 'Rainbow Trout', 'Cutthroat Trout', 'Mountain Whitefish'],
    hatchTags: ['midge', 'bwo', 'pmd', 'caddis', 'green-drake'],
    accessNotes:
      'Jordanelle Dam → Deer Creek. Heavily fished blue-ribbon stretch. Trophy browns. Heber Valley access.',
  },
  {
    id: 'ut-provo-river-lower',
    name: 'Lower Provo River',
    aliases: ['Provo Lower'],
    states: ['UT'],
    type: 'tailwater',
    // Deer Creek Reservoir → Utah Lake
    bbox: [40.35, -111.65, 40.50, -111.45],
    centroid: { lat: 40.42, lng: -111.55 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '10163000' },
      damSchedule: { kind: 'auto', flowSiteId: '10163000' },
    },
    species: ['Brown Trout', 'Rainbow Trout', 'Mountain Whitefish'],
    hatchTags: ['midge', 'bwo', 'pmd', 'caddis'],
    accessNotes:
      'Below Deer Creek through Provo Canyon. Wading-friendly. Browns + rainbows; popular guided fishing.',
  },
  {
    id: 'ut-weber-river',
    name: 'Weber River',
    aliases: ['Upper Weber', 'Weber'],
    states: ['UT'],
    type: 'freestone',                        // wild-trout above Echo; tailwater segments below
    // Headwaters in the Uintas (Mirror Lake area) down to Echo Reservoir.
    // Previous bbox started at 40.85 N which missed the Oakley / Kamas /
    // Smith & Morehouse stretch — the prime upper-river trout water.
    bbox: [40.65, -111.40, 41.20, -110.85],
    centroid: { lat: 40.92, lng: -111.20 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '10128500' },
    },
    species: ['Brown Trout', 'Cutthroat Trout', 'Rainbow Trout', 'Mountain Whitefish'],
    hatchTags: [
      'pmd',
      'pale-evening-dun',
      'caddis-grannom',
      'hydropsyche-caddis',
      'mothers-day-caddis',
      'bwo-spring',
      'little-yellow-stone',
      'salmonfly',
      'golden-stone',
      'midges',
      'scud',
      'sowbug',
    ],
    accessNotes:
      'Uintas headwaters → Mirror Lake → Kamas → Oakley → Coalville → Echo Reservoir → Ogden. Upper river: snowmelt-fed freestone with wild cutts + browns. Best after runoff (mid-June+).',
  },
  {
    id: 'ut-logan-river',
    name: 'Logan River',
    states: ['UT'],
    type: 'freestone',
    bbox: [41.70, -111.85, 41.85, -111.55],
    centroid: { lat: 41.78, lng: -111.70 },
    species: ['Brown Trout', 'Cutthroat Trout', 'Rainbow Trout', 'Mountain Whitefish'],
    hatchTags: ['pmd', 'caddis', 'salmonfly', 'bwo'],
    accessNotes:
      'Bonneville cutthroat native range. Pristine canyon water. Catch-and-release upper section.',
  },
  {
    id: 'ut-blacksmith-fork',
    name: 'Blacksmith Fork',
    states: ['UT'],
    type: 'freestone',
    bbox: [41.55, -111.75, 41.75, -111.55],
    centroid: { lat: 41.65, lng: -111.65 },
    species: ['Brown Trout', 'Cutthroat Trout', 'Rainbow Trout'],
    hatchTags: ['salmonfly', 'pmd', 'caddis'],
    accessNotes:
      'Logan River tributary. Wild trout, brushy canyon water. Lighter pressure than the Logan main.',
  },

  // ---------- Reservoirs --------------------------------------------
  {
    id: 'ut-strawberry-reservoir',
    name: 'Strawberry Reservoir',
    states: ['UT'],
    type: 'reservoir',
    bbox: [40.10, -111.20, 40.25, -111.00],
    centroid: { lat: 40.17, lng: -111.10 },
    surfaceAreaAcres: 17_164,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Cutthroat Trout', 'Rainbow Trout', 'Kokanee Salmon'],
    accessNotes:
      "UT's premier trout reservoir. Bonneville + Bear River cutthroat program. Tube-fishing chironomids; kokanee snagging fall.",
  },
  {
    id: 'ut-jordanelle-reservoir',
    name: 'Jordanelle Reservoir',
    states: ['UT'],
    type: 'reservoir',
    bbox: [40.55, -111.50, 40.65, -111.35],
    centroid: { lat: 40.60, lng: -111.42 },
    surfaceAreaAcres: 3_300,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Rainbow Trout', 'Brown Trout', 'Smallmouth Bass', 'Yellow Perch'],
    accessNotes:
      "Provo River impoundment. Smallmouth + trout — unusual mix. Skiing on weekends; fish early.",
  },
  {
    id: 'ut-deer-creek-reservoir',
    name: 'Deer Creek Reservoir',
    states: ['UT'],
    type: 'reservoir',
    bbox: [40.43, -111.55, 40.55, -111.40],
    centroid: { lat: 40.48, lng: -111.47 },
    surfaceAreaAcres: 2_965,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Smallmouth Bass', 'Rainbow Trout', 'Brown Trout', 'Walleye', 'Yellow Perch'],
    accessNotes:
      'Provo River impoundment. Smallmouth + walleye. Tailwater below is lower Provo trout water.',
  },
  {
    id: 'ut-bear-lake',
    name: 'Bear Lake',
    states: ['UT', 'ID'],
    type: 'lake',
    bbox: [41.85, -111.50, 42.15, -111.25],
    centroid: { lat: 42.00, lng: -111.37 },
    surfaceAreaAcres: 109_000,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'usgs-lake', siteId: '415955111212401' },
    },
    species: ['Cutthroat Trout', 'Lake Trout', 'Cisco', 'Whitefish', 'Yellow Perch'],
    accessNotes:
      "Caribbean-blue calcium-carbonate water. Native Bonneville cutthroat. World's only Bonneville cisco run (January, on the ice).",
  },
  {
    id: 'ut-pineview-reservoir',
    name: 'Pineview Reservoir',
    states: ['UT'],
    type: 'reservoir',
    bbox: [41.25, -111.85, 41.35, -111.70],
    centroid: { lat: 41.30, lng: -111.77 },
    surfaceAreaAcres: 2_874,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'usgs-lake', siteId: '10140100' },
    },
    species: ['Tiger Muskie', 'Smallmouth Bass', 'Largemouth Bass', 'Yellow Perch', 'Rainbow Trout'],
    accessNotes:
      "Tiger muskie fishery — UT's only true muskie water. Trophy bass + perch.",
  },
];
