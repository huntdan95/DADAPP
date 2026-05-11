import type { Waterbody } from '../registry';

export const AL_WATERBODIES: Waterbody[] = [
  {
    id: 'al-lake-guntersville',
    name: 'Lake Guntersville',
    aliases: ['Guntersville Reservoir'],
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
];
