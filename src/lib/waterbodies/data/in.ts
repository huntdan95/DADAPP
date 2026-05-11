import type { Waterbody } from '../registry';

export const IN_WATERBODIES: Waterbody[] = [
  {
    id: 'in-lake-wawasee',
    name: 'Lake Wawasee',
    states: ['IN'],
    type: 'lake',
    bbox: [41.40, -85.75, 41.46, -85.65],
    centroid: { lat: 41.42, lng: -85.70 },
    surfaceAreaAcres: 3_060,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Largemouth Bass', 'Smallmouth Bass', 'Walleye', 'Northern Pike', 'Yellow Perch', 'Bluegill', 'Crappie'],
    accessNotes:
      'Largest natural lake in Indiana. Glacial origin, deep + clear. Diverse fishery; smallmouth in 12-20 ft on rocky humps.',
  },
  {
    id: 'in-patoka-lake',
    name: 'Patoka Lake',
    states: ['IN'],
    type: 'reservoir',
    bbox: [38.35, -86.80, 38.50, -86.55],
    centroid: { lat: 38.42, lng: -86.68 },
    surfaceAreaAcres: 8_800,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Largemouth Bass', 'Striped Bass', 'White Bass', 'Crappie', 'Bluegill'],
    accessNotes:
      'USACE. Stained water bass lake. Striper hybrids in summer. Good fall crappie on standing timber.',
  },
  {
    id: 'in-monroe-lake',
    name: 'Monroe Lake',
    aliases: ['Lake Monroe'],
    states: ['IN'],
    type: 'reservoir',
    bbox: [39.00, -86.55, 39.15, -86.25],
    centroid: { lat: 39.05, lng: -86.40 },
    surfaceAreaAcres: 10_750,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Largemouth Bass', 'Smallmouth Bass', 'Striped Bass', 'White Bass', 'Crappie', 'Bluegill'],
    accessNotes:
      'Largest reservoir in IN. Salt Creek branches hold most bass. Striper stocking strong.',
  },
];
