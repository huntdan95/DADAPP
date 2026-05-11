import type { Waterbody } from '../registry';

export const NC_WATERBODIES: Waterbody[] = [
  {
    id: 'nc-lake-norman',
    name: 'Lake Norman',
    states: ['NC'],
    type: 'reservoir',
    bbox: [35.40, -81.10, 35.75, -80.85],
    centroid: { lat: 35.56, lng: -80.97 },
    surfaceAreaAcres: 32_500,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Striped Bass', 'Spotted Bass', 'Largemouth Bass', 'White Perch', 'Crappie', 'Catfish'],
    accessNotes:
      'Largest man-made lake in NC. Duke Energy. Spotted bass dominant black-bass species. Stripers in 30-50 ft of water summer.',
  },
  {
    id: 'nc-lake-james',
    name: 'Lake James',
    states: ['NC'],
    type: 'reservoir',
    bbox: [35.72, -82.05, 35.82, -81.80],
    centroid: { lat: 35.77, lng: -81.93 },
    surfaceAreaAcres: 6_812,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Smallmouth Bass', 'Largemouth Bass', 'Walleye', 'White Bass', 'Crappie'],
    accessNotes:
      'Clear, deep, two-basin lake. Walleye stocking program is unusual for the southeast. Smallmouth on rocky points spring/fall.',
  },
  {
    id: 'nc-hiwassee-lake',
    name: 'Hiwassee Lake',
    states: ['NC'],
    type: 'reservoir',
    bbox: [35.10, -84.20, 35.20, -83.95],
    centroid: { lat: 35.15, lng: -84.08 },
    surfaceAreaAcres: 6_280,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Smallmouth Bass', 'Largemouth Bass', 'Walleye', 'Muskie', 'Crappie'],
    accessNotes:
      'TVA. Smallmouth + walleye fishery. Muskie introduced in recent years.',
  },
  {
    id: 'nc-nantahala-river',
    name: 'Nantahala River',
    states: ['NC'],
    type: 'tailwater',
    bbox: [35.20, -83.65, 35.40, -83.45],
    centroid: { lat: 35.30, lng: -83.55 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '03504900' },
    },
    species: ['Brown Trout', 'Rainbow Trout', 'Brook Trout'],
    hatchTags: ['caddis', 'midge', 'sulfur', 'bwo'],
    accessNotes:
      'Delayed-harvest section is a NC trout-fishing destination. Cold tailwater of Nantahala Lake. Catch-and-release Oct-June.',
  },
];
