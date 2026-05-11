import type { Waterbody } from '../registry';

export const AR_WATERBODIES: Waterbody[] = [
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
];
