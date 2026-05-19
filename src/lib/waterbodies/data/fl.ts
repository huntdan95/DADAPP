import type { Waterbody } from '../registry';

/**
 * Florida waters. Heavy on bass + panfish + saltwater coast. Trout
 * are not a freshwater species in FL (water too warm) — the rare
 * trout stocking is in cold north-FL springs only.
 */
export const FL_WATERBODIES: Waterbody[] = [
  // ---------- Major lakes -------------------------------------------
  {
    id: 'fl-lake-okeechobee',
    name: 'Lake Okeechobee',
    aliases: ['The Big O', 'Lake O'],
    states: ['FL'],
    type: 'lake',
    bbox: [26.65, -81.10, 27.20, -80.55],
    centroid: { lat: 26.93, lng: -80.82 },
    surfaceAreaAcres: 467_200,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'usgs-lake', siteId: '02259100' },
    },
    species: ['Largemouth Bass', 'Bluegill', 'Speckled Perch', 'Bowfin', 'Channel Catfish'],
    accessNotes:
      'Largest freshwater lake in FL. Trophy largemouth bass — shiners under floats in winter. Watch alligator and snake (water moccasin) hazards.',
  },
  {
    id: 'fl-lake-kissimmee',
    name: 'Lake Kissimmee',
    states: ['FL'],
    type: 'lake',
    bbox: [27.85, -81.30, 28.05, -81.05],
    centroid: { lat: 27.95, lng: -81.18 },
    surfaceAreaAcres: 34_948,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Largemouth Bass', 'Speckled Perch', 'Bluegill', 'Channel Catfish'],
    accessNotes:
      'Bass tournament factory. Hydrilla + Kissimmee grass beds. Wild shiners produce trophy fish.',
  },
  {
    id: 'fl-lake-toho',
    name: 'Lake Tohopekaliga',
    aliases: ['Lake Toho', 'Lake Tohopekaliga'],
    states: ['FL'],
    type: 'lake',
    bbox: [28.12, -81.40, 28.25, -81.30],
    centroid: { lat: 28.18, lng: -81.35 },
    surfaceAreaAcres: 22_700,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Largemouth Bass', 'Speckled Perch', 'Bluegill'],
    accessNotes:
      'Premier Florida bass lake. Spring spawn produces 10+ lb fish on bed. Kissimmee chain connection.',
  },
  {
    id: 'fl-lake-george',
    name: 'Lake George',
    states: ['FL'],
    type: 'lake',
    bbox: [29.20, -81.65, 29.40, -81.50],
    centroid: { lat: 29.30, lng: -81.58 },
    surfaceAreaAcres: 46_000,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'usgs-lake', siteId: '291830081362200' },
    },
    species: ['Largemouth Bass', 'Striped Bass', 'Bluegill', 'Speckled Perch', 'Bowfin', 'Catfish'],
    accessNotes:
      'Part of the St. Johns chain. Second-largest lake in FL. Tannin-stained; bass on hydrilla edges. Striper run in winter.',
  },
  {
    id: 'fl-lake-apopka',
    name: 'Lake Apopka',
    states: ['FL'],
    type: 'lake',
    bbox: [28.55, -81.75, 28.72, -81.55],
    centroid: { lat: 28.63, lng: -81.65 },
    surfaceAreaAcres: 30_800,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'usgs-lake', siteId: '02237698' },
    },
    species: ['Largemouth Bass', 'Bluegill', 'Channel Catfish'],
    accessNotes:
      'Recovering ecosystem (formerly polluted). Bass fishery rebounding. Limited access; specific ramps only.',
  },
  {
    id: 'fl-rodman-reservoir',
    name: 'Rodman Reservoir',
    aliases: ['Lake Ocklawaha'],
    states: ['FL'],
    type: 'reservoir',
    bbox: [29.50, -81.85, 29.58, -81.65],
    centroid: { lat: 29.54, lng: -81.75 },
    surfaceAreaAcres: 9_500,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'usgs-lake', siteId: '02243960' },
    },
    species: ['Largemouth Bass', 'Speckled Perch', 'Bream', 'Catfish'],
    accessNotes:
      'Trophy bass factory. 10-lb fish caught regularly. Hydrilla mats, lily pads. Drawdowns periodically reset the cover.',
  },
  {
    id: 'fl-stick-marsh',
    name: 'Stick Marsh / Farm 13',
    aliases: ['Stick Marsh', 'Farm 13'],
    states: ['FL'],
    type: 'lake',
    bbox: [27.78, -80.78, 27.85, -80.70],
    centroid: { lat: 27.81, lng: -80.74 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Largemouth Bass', 'Bluegill'],
    accessNotes:
      'Reservoir built on flooded farmland. Submerged trees. Trophy largemouth — many over 10 lb. Catch-and-release only.',
  },
  {
    id: 'fl-lake-talquin',
    name: 'Lake Talquin',
    states: ['FL'],
    type: 'reservoir',
    bbox: [30.40, -84.65, 30.50, -84.50],
    centroid: { lat: 30.45, lng: -84.57 },
    surfaceAreaAcres: 8_800,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Largemouth Bass', 'Striped Bass', 'Hybrid Bass', 'Crappie', 'Bream'],
    accessNotes:
      'Ochlockonee River impoundment, NW FL. Striper + hybrid stocking program — unusual for FL. Crappie hotspot in winter.',
  },
  {
    id: 'fl-lake-seminole-fl',
    name: 'Lake Seminole (FL)',
    states: ['FL', 'GA'],
    type: 'reservoir',
    bbox: [30.70, -84.90, 30.90, -84.55],
    centroid: { lat: 30.80, lng: -84.72 },
    surfaceAreaAcres: 37_500,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'usgs-lake', siteId: '02357500' },
    },
    species: ['Largemouth Bass', 'Striped Bass', 'Hybrid Bass', 'Crappie', 'Catfish'],
    accessNotes:
      'USACE Jim Woodruff Dam on Apalachicola River. FL/GA border. Big bass + striper fishery. Lily pad mats + grass.',
  },
  {
    id: 'fl-lake-tarpon',
    name: 'Lake Tarpon',
    states: ['FL'],
    type: 'lake',
    bbox: [28.10, -82.75, 28.18, -82.70],
    centroid: { lat: 28.14, lng: -82.72 },
    surfaceAreaAcres: 2_534,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'usgs-lake', siteId: '02307359' },
    },
    species: ['Largemouth Bass', 'Bluegill', 'Snook', 'Speckled Perch'],
    accessNotes:
      "Tampa-area lake. Connected to brackish Gulf via canal — snook + tarpon do show up. Trophy largemouth.",
  },

  // ---------- Rivers ------------------------------------------------
  {
    id: 'fl-st-johns-river',
    name: 'St. Johns River',
    states: ['FL'],
    type: 'freestone',
    bbox: [27.50, -81.30, 30.40, -80.85],
    centroid: { lat: 29.20, lng: -81.50 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '02232400' },
    },
    species: ['Largemouth Bass', 'Striped Bass', 'Bluegill', 'Catfish', 'Crappie', 'Speckled Perch'],
    accessNotes:
      'Tidal influence below Palatka. Brackish bottom reaches. Bass + crappie in upper river; saltwater fish lower.',
  },
  {
    id: 'fl-suwannee-river',
    name: 'Suwannee River',
    states: ['FL', 'GA'],
    type: 'freestone',
    bbox: [29.30, -83.30, 30.85, -82.30],
    centroid: { lat: 30.00, lng: -82.85 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '02320500' },
    },
    species: ['Suwannee Bass', 'Largemouth Bass', 'Striped Bass', 'Channel Catfish', 'Mullet'],
    accessNotes:
      'Black-water river. Suwannee bass is a unique native species — small but aggressive. Watch for limestone shoals; outboards take a beating.',
  },
  {
    id: 'fl-withlacoochee-river',
    name: 'Withlacoochee River',
    states: ['FL'],
    type: 'freestone',
    bbox: [28.30, -82.55, 28.80, -82.10],
    centroid: { lat: 28.55, lng: -82.32 },
    species: ['Largemouth Bass', 'Bluegill', 'Channel Catfish', 'Snook', 'Tarpon (lower)'],
    accessNotes:
      'Tannin-stained central FL river. Bass + bluegill upstream. Lower reaches brackish — snook + tarpon at the mouth.',
  },
  {
    id: 'fl-apalachicola-river',
    name: 'Apalachicola River',
    states: ['FL'],
    type: 'tailwater',
    bbox: [29.70, -85.05, 30.70, -84.85],
    centroid: { lat: 30.20, lng: -84.95 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '02358000' },
      damSchedule: { kind: 'auto', flowSiteId: '02358000' },
    },
    species: ['Striped Bass', 'Largemouth Bass', 'Bream', 'Catfish'],
    accessNotes:
      'Below Lake Seminole / Jim Woodruff Dam. Striper run + sturgeon. Tidal influence below Wewahitchka.',
  },
  {
    id: 'fl-choctawhatchee-river',
    name: 'Choctawhatchee River',
    states: ['FL'],
    type: 'freestone',
    bbox: [30.40, -86.10, 31.00, -85.75],
    centroid: { lat: 30.70, lng: -85.95 },
    species: ['Largemouth Bass', 'Shoal Bass', 'Striped Bass', 'Catfish', 'Bream'],
    accessNotes:
      'Panhandle river. Shoal bass — endemic to a small range. Sandy + tannin-stained.',
  },
];
