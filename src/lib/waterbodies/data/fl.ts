import type { Waterbody } from '../registry';

export const FL_WATERBODIES: Waterbody[] = [
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
      lakeData: { kind: 'estimated' },
    },
    species: ['Largemouth Bass', 'Bluegill', 'Speckled Perch', 'Bowfin', 'Channel Catfish'],
    accessNotes:
      'Largest freshwater lake in FL. Trophy largemouth bass — shiners under floats in winter. Watch alligator and snake (water moccasin) hazards.',
  },
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
];
