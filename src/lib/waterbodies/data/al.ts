import type { Waterbody } from '../registry';

/**
 * Alabama waters. Heavy on TVA + Alabama Power reservoir chain on
 * the Tennessee + Coosa + Tallapoosa systems, plus Mobile Bay /
 * Delta on the Gulf coast.
 */
export const AL_WATERBODIES: Waterbody[] = [
  // ---------- TVA Tennessee River chain -----------------------------
  {
    id: 'al-lake-guntersville',
    name: 'Lake Guntersville',
    aliases: ['Guntersville Reservoir', 'Guntersville'],
    states: ['AL'],
    type: 'reservoir',
    bbox: [34.30, -86.65, 34.80, -85.85],
    centroid: { lat: 34.55, lng: -86.25 },
    surfaceAreaAcres: 69_100,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Largemouth Bass', 'Smallmouth Bass', 'Striped Bass', 'Crappie', 'Bream', 'Catfish'],
    accessNotes:
      'TVA. Best largemouth lake in the South for trophies. Hydrilla / milfoil grass beds drive the fishery. Punch heavy cover with creature baits in summer.',
  },
  {
    id: 'al-wheeler-lake',
    name: 'Wheeler Lake',
    aliases: ['Wheeler Reservoir'],
    states: ['AL'],
    type: 'reservoir',
    bbox: [34.55, -87.70, 34.85, -86.50],
    centroid: { lat: 34.70, lng: -87.05 },
    surfaceAreaAcres: 67_100,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Largemouth Bass', 'Smallmouth Bass', 'Striped Bass', 'White Bass', 'Crappie', 'Catfish'],
    accessNotes:
      'TVA. Tennessee River impoundment between Wheeler and Wilson Dams. Tailwater holds smallies + stripers in current.',
  },
  {
    id: 'al-wilson-lake',
    name: 'Wilson Lake',
    states: ['AL'],
    type: 'reservoir',
    bbox: [34.75, -87.85, 34.85, -87.30],
    centroid: { lat: 34.80, lng: -87.55 },
    surfaceAreaAcres: 15_500,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Smallmouth Bass', 'Striped Bass', 'Largemouth Bass', 'Sauger', 'Catfish'],
    accessNotes:
      'TVA Wilson Dam impoundment. Smallmouth + striper fishery. Below Wilson is the world-class smallmouth tailwater.',
  },
  {
    id: 'al-pickwick-lake-al',
    name: 'Pickwick Lake (AL portion)',
    states: ['AL', 'TN', 'MS'],
    type: 'reservoir',
    bbox: [34.78, -88.40, 35.00, -87.80],
    centroid: { lat: 34.88, lng: -88.10 },
    surfaceAreaAcres: 43_100,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Smallmouth Bass', 'Largemouth Bass', 'Striped Bass', 'Sauger', 'Catfish'],
    accessNotes:
      'TVA. World-class smallmouth fishery — current breaks at Wilson Dam tailwater. Sauger run in winter.',
  },

  // ---------- Alabama Power Coosa chain -----------------------------
  {
    id: 'al-lake-martin',
    name: 'Lake Martin',
    states: ['AL'],
    type: 'reservoir',
    bbox: [32.65, -86.05, 33.00, -85.85],
    centroid: { lat: 32.82, lng: -85.95 },
    surfaceAreaAcres: 39_180,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Spotted Bass', 'Striped Bass', 'Largemouth Bass', 'Crappie', 'Bream'],
    accessNotes:
      'Alabama Power on Tallapoosa River. Clear, deep, rocky. Spotted bass dominant; striper stocked.',
  },
  {
    id: 'al-logan-martin-lake',
    name: 'Logan Martin Lake',
    states: ['AL'],
    type: 'reservoir',
    bbox: [33.35, -86.55, 33.55, -86.30],
    centroid: { lat: 33.45, lng: -86.42 },
    surfaceAreaAcres: 17_000,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Largemouth Bass', 'Spotted Bass', 'Striped Bass', 'Crappie', 'Catfish'],
    accessNotes:
      'Alabama Power on Coosa River. Major tournament lake. Heavy boat traffic on weekends.',
  },
  {
    id: 'al-neely-henry-lake',
    name: 'Neely Henry Lake',
    states: ['AL'],
    type: 'reservoir',
    bbox: [33.75, -86.05, 33.95, -85.85],
    centroid: { lat: 33.85, lng: -85.95 },
    surfaceAreaAcres: 11_235,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Spotted Bass', 'Largemouth Bass', 'Crappie', 'Striped Bass', 'Catfish'],
    accessNotes:
      'Alabama Power on Coosa. River-like impoundment. Spotted bass fishery — world-record-class fish caught here.',
  },
  {
    id: 'al-lake-weiss',
    name: 'Lake Weiss',
    states: ['AL', 'GA'],
    type: 'reservoir',
    bbox: [34.10, -85.95, 34.30, -85.65],
    centroid: { lat: 34.20, lng: -85.80 },
    surfaceAreaAcres: 30_200,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Largemouth Bass', 'Spotted Bass', 'Crappie', 'Striped Bass', 'Catfish'],
    accessNotes:
      "Alabama Power, AL/GA border. 'Crappie Capital of the World.' Brush piles + standing timber.",
  },
  {
    id: 'al-smith-lake',
    name: 'Lewis Smith Lake',
    aliases: ['Smith Lake'],
    states: ['AL'],
    type: 'reservoir',
    bbox: [34.00, -87.20, 34.20, -86.85],
    centroid: { lat: 34.10, lng: -87.02 },
    surfaceAreaAcres: 21_200,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Striped Bass', 'Spotted Bass', 'Largemouth Bass', 'White Bass', 'Walleye'],
    accessNotes:
      'Alabama Power. Deep clear lake (~250 ft). Striper world-class — multiple state records. Spotted bass on rocky points.',
  },

  // ---------- Lake Eufaula (AL/GA border) ---------------------------
  {
    id: 'al-lake-eufaula',
    name: 'Lake Eufaula',
    aliases: ['Walter F. George Lake'],
    states: ['AL', 'GA'],
    type: 'reservoir',
    bbox: [31.55, -85.20, 32.20, -84.85],
    centroid: { lat: 31.85, lng: -85.05 },
    surfaceAreaAcres: 45_180,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Largemouth Bass', 'Crappie', 'Bream', 'Catfish', 'Striped Bass'],
    accessNotes:
      'AL/GA border on Chattahoochee River. "Big Bass Capital of the World" reputation. Stained water; flipping mats and pad lines.',
  },

  // ---------- Coastal -----------------------------------------------
  {
    id: 'al-mobile-bay',
    name: 'Mobile Bay',
    states: ['AL'],
    type: 'saltwater',
    bbox: [30.20, -88.10, 30.75, -87.80],
    centroid: { lat: 30.45, lng: -87.95 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      tides: { kind: 'noaa', stationId: '8735180' },
    },
    species: ['Speckled Trout', 'Redfish', 'Flounder', 'Spanish Mackerel', 'Jack Crevalle', 'Tripletail'],
    accessNotes:
      'Major Gulf estuary. Jubilees in late summer (oxygen-depletion event). Speckled trout + redfish on grass flats.',
  },
  {
    id: 'al-mobile-tensaw-delta',
    name: 'Mobile-Tensaw Delta',
    aliases: ['Tensaw Delta', 'Causeway'],
    states: ['AL'],
    type: 'freestone',
    bbox: [30.65, -88.10, 31.10, -87.75],
    centroid: { lat: 30.85, lng: -87.92 },
    species: ['Largemouth Bass', 'Redfish', 'Speckled Trout', 'Bream', 'Bowfin', 'Catfish'],
    accessNotes:
      'Tannin freshwater meets brackish — bass + reds + trout all in same water. America\'s second-largest river delta.',
  },

  // ---------- Coosa / Tallapoosa rivers -----------------------------
  {
    id: 'al-coosa-river',
    name: 'Coosa River',
    states: ['AL'],
    type: 'freestone',
    bbox: [33.20, -86.55, 34.30, -85.60],
    centroid: { lat: 33.75, lng: -86.05 },
    species: ['Spotted Bass', 'Largemouth Bass', 'Coosa Bass', 'Striped Bass', 'Catfish'],
    accessNotes:
      'Major Alabama river — chained by Alabama Power dams (Weiss, Neely Henry, Logan Martin, Lay, Mitchell, Jordan). Coosa bass = endemic redeye species.',
  },
];
