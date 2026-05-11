import type { Waterbody } from '../registry';

/**
 * Arkansas waters. Two distinct fisheries:
 *   - North AR cold tailwaters of the White River system — world-class
 *     trout (Bull Shoals, Norfork, Greers Ferry tailwaters)
 *   - Reservoir bass + crappie + catfish + striper across the state
 */
export const AR_WATERBODIES: Waterbody[] = [
  // ---------- North AR Trout tailwaters (White River system) ---------
  {
    id: 'ar-bull-shoals-lake',
    name: 'Bull Shoals Lake',
    states: ['AR', 'MO'],
    type: 'reservoir',
    bbox: [36.30, -93.10, 36.65, -92.40],
    centroid: { lat: 36.48, lng: -92.75 },
    surfaceAreaAcres: 45_440,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'usgs-lake', siteId: '07060710' },
    },
    species: [
      'Largemouth Bass',
      'Smallmouth Bass',
      'Spotted Bass',
      'Striped Bass',
      'White Bass',
      'Walleye',
      'Crappie',
      'Bream',
    ],
    accessNotes:
      'USACE deep clear reservoir on White River. Trophy walleye + striper. Smallmouth in 15-30 ft summer. Tailwater drains into the famous White River trout zone.',
  },
  {
    id: 'ar-white-river-tailwater',
    name: 'White River (below Bull Shoals)',
    aliases: ['White River AR', 'Bull Shoals Tailwater'],
    states: ['AR'],
    type: 'tailwater',
    bbox: [36.10, -92.85, 36.40, -91.95],
    centroid: { lat: 36.25, lng: -92.40 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '07060500' },
      damSchedule: { kind: 'auto', flowSiteId: '07060500' },
    },
    species: ['Rainbow Trout', 'Brown Trout', 'Cutthroat Trout', 'Brook Trout'],
    hatchTags: ['sulfur', 'midge', 'caddis', 'bwo'],
    popularLures: [
      'Size 22 zebra midges',
      'Sowbug + scud rigs',
      'Big streamers for trophy browns',
    ],
    accessNotes:
      'One of the top trout tailwaters in the world. ~100 miles of cold water from Bull Shoals to Calico Rock. Generation = no wading. Check USACE.',
  },
  {
    id: 'ar-norfork-tailwater',
    name: 'North Fork White River (Norfork Tailwater)',
    aliases: ['Norfork', 'Norfork Tailwater'],
    states: ['AR'],
    type: 'tailwater',
    bbox: [36.20, -92.30, 36.30, -92.15],
    centroid: { lat: 36.25, lng: -92.22 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '07058980' },
      damSchedule: { kind: 'auto', flowSiteId: '07058980' },
    },
    species: ['Rainbow Trout', 'Brown Trout', 'Cutthroat Trout'],
    hatchTags: ['sulfur', 'midge', 'caddis'],
    accessNotes:
      'Short but world-class tailwater. ~5 miles of fly-fishing water below Norfork Dam to confluence with the White. Quill Gordons + March Browns in spring.',
  },
  {
    id: 'ar-little-red-river',
    name: 'Little Red River',
    aliases: ['Greers Ferry Tailwater'],
    states: ['AR'],
    type: 'tailwater',
    bbox: [35.45, -92.10, 35.62, -91.65],
    centroid: { lat: 35.53, lng: -91.85 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '07076500' },
      damSchedule: { kind: 'auto', flowSiteId: '07076500' },
    },
    species: ['Brown Trout', 'Rainbow Trout', 'Cutthroat Trout'],
    hatchTags: ['sulfur', 'midge', 'caddis', 'sowbug'],
    accessNotes:
      'Below Greers Ferry Dam. Cold-water trout fishery — held the world-record brown trout (40+ lb). Wade between generations.',
  },
  {
    id: 'ar-norfork-lake',
    name: 'Norfork Lake',
    states: ['AR'],
    type: 'reservoir',
    bbox: [36.25, -92.40, 36.55, -92.05],
    centroid: { lat: 36.38, lng: -92.22 },
    surfaceAreaAcres: 22_000,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Striped Bass', 'Largemouth Bass', 'Smallmouth Bass', 'Spotted Bass', 'Walleye', 'Crappie'],
    accessNotes:
      'USACE on North Fork White. Deep clear lake. Striper + walleye fishery. Less pressure than Bull Shoals.',
  },
  {
    id: 'ar-greers-ferry-lake',
    name: 'Greers Ferry Lake',
    states: ['AR'],
    type: 'reservoir',
    bbox: [35.50, -92.20, 35.72, -91.80],
    centroid: { lat: 35.62, lng: -92.00 },
    surfaceAreaAcres: 31_500,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Walleye', 'Hybrid Bass', 'Largemouth Bass', 'Smallmouth Bass', 'Crappie', 'Catfish'],
    accessNotes:
      'USACE on Little Red River. Deep clear lake with rocky banks. Walleye + hybrid striper. Spawning walleye run up the river.',
  },

  // ---------- Other AR reservoirs -----------------------------------
  {
    id: 'ar-beaver-lake',
    name: 'Beaver Lake',
    states: ['AR'],
    type: 'reservoir',
    bbox: [36.05, -94.05, 36.50, -93.75],
    centroid: { lat: 36.28, lng: -93.92 },
    surfaceAreaAcres: 28_370,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Largemouth Bass', 'Spotted Bass', 'Smallmouth Bass', 'Striped Bass', 'Walleye', 'Crappie', 'Catfish'],
    accessNotes:
      'USACE on White River, NW AR. NW Arkansas water-supply lake. Striper + walleye fishery. Smallmouth on rocky points.',
  },
  {
    id: 'ar-lake-ouachita',
    name: 'Lake Ouachita',
    states: ['AR'],
    type: 'reservoir',
    bbox: [34.55, -93.45, 34.75, -93.05],
    centroid: { lat: 34.65, lng: -93.25 },
    surfaceAreaAcres: 40_100,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Striped Bass', 'Largemouth Bass', 'Spotted Bass', 'Smallmouth Bass', 'Walleye', 'Bream', 'Crappie'],
    accessNotes:
      'USACE on Ouachita River. Largest lake in AR. Clear water, undeveloped shoreline. Striper world-class.',
  },
  {
    id: 'ar-degray-lake',
    name: 'Lake DeGray',
    states: ['AR'],
    type: 'reservoir',
    bbox: [34.20, -93.30, 34.35, -93.05],
    centroid: { lat: 34.27, lng: -93.18 },
    surfaceAreaAcres: 13_400,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Hybrid Bass', 'Largemouth Bass', 'Spotted Bass', 'White Bass', 'Crappie'],
    accessNotes:
      'USACE on Caddo River. Hybrid striper stocking. Tournament bass lake. Visibility 10-15 ft.',
  },
  {
    id: 'ar-maumelle-lake',
    name: 'Lake Maumelle',
    states: ['AR'],
    type: 'reservoir',
    bbox: [34.83, -92.65, 34.90, -92.45],
    centroid: { lat: 34.86, lng: -92.55 },
    surfaceAreaAcres: 8_900,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Striped Bass', 'Largemouth Bass', 'Crappie', 'Bream', 'Catfish'],
    accessNotes:
      'Little Rock water supply. No-wake speed limit; quiet fishery. Striped bass fingerlings stocked.',
  },

  // ---------- Smallmouth + free rivers ------------------------------
  {
    id: 'ar-buffalo-national-river',
    name: 'Buffalo National River',
    aliases: ['Buffalo River'],
    states: ['AR'],
    type: 'freestone',
    bbox: [35.85, -93.30, 36.10, -92.30],
    centroid: { lat: 35.98, lng: -92.80 },
    species: ['Smallmouth Bass', 'Largemouth Bass', 'Rock Bass', 'Bream', 'Channel Catfish'],
    accessNotes:
      "America's first National River. Float-fishing for wild smallmouth bass. Limestone bluffs + clear pools.",
  },
  {
    id: 'ar-kings-river',
    name: 'Kings River',
    states: ['AR'],
    type: 'freestone',
    bbox: [36.05, -93.90, 36.40, -93.65],
    centroid: { lat: 36.22, lng: -93.78 },
    species: ['Smallmouth Bass', 'Rock Bass', 'Bream', 'Walleye'],
    accessNotes:
      'Tributary to Beaver Lake. Famous smallmouth float-trip water. Clear gravel river; canoe-only access in many stretches.',
  },
  {
    id: 'ar-spring-river',
    name: 'Spring River',
    states: ['AR'],
    type: 'freestone',
    bbox: [36.20, -91.55, 36.50, -91.30],
    centroid: { lat: 36.35, lng: -91.42 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '07069500' },
    },
    species: ['Rainbow Trout', 'Smallmouth Bass', 'Goggle-eye'],
    accessNotes:
      'Mammoth Spring at the head — coldest part holds stocked trout. Lower river is smallmouth + goggle-eye (rock bass).',
  },
];
