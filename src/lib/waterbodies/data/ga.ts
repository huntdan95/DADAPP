import type { Waterbody } from '../registry';

export const GA_WATERBODIES: Waterbody[] = [
  {
    id: 'ga-lake-lanier',
    name: 'Lake Lanier',
    aliases: ['Lake Sidney Lanier'],
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
      'USACE, north GA. Spotted bass is the dominant black bass. Striper fishery one of the South\'s best — downlines + planers.',
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
];
