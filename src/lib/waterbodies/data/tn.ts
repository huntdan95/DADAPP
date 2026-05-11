import type { Waterbody } from '../registry';

/**
 * Tennessee waters. Heavy on TVA tailwaters + reservoirs.
 */
export const TN_WATERBODIES: Waterbody[] = [
  {
    id: 'tn-caney-fork',
    name: 'Caney Fork River',
    aliases: ['Caney Fork', 'Center Hill Tailwater'],
    states: ['TN'],
    type: 'tailwater',
    // Center Hill Dam → confluence with Cumberland River
    bbox: [35.95, -85.95, 36.30, -85.55],
    centroid: { lat: 36.10, lng: -85.83 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '03418500' },
      damSchedule: { kind: 'tva', dam: 'Center Hill' },
    },
    species: ['Rainbow Trout', 'Brown Trout', 'Brook Trout', 'Smallmouth Bass'],
    hatchTags: ['midge', 'sulfur', 'bwo', 'caddis'],
    popularLures: [
      'Size 22 midge under indicator',
      'Sulfur emerger evenings May-June',
      'Streamers low-flow for trophy browns',
    ],
    regulationsUrl: 'https://www.tn.gov/twra/fishing.html',
    accessNotes:
      'Wade between generations (no horsepower) — check TVA schedule before launching. Float Happy Hollow → Stonewall when one unit running.',
  },
  {
    id: 'tn-south-holston',
    name: 'South Holston River',
    aliases: ['SoHo', 'South Holston Tailwater'],
    states: ['TN'],
    type: 'tailwater',
    bbox: [36.40, -82.20, 36.55, -81.95],
    centroid: { lat: 36.49, lng: -82.08 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '03488000' },
      damSchedule: { kind: 'tva', dam: 'South Holston' },
    },
    species: ['Brown Trout', 'Rainbow Trout'],
    hatchTags: ['sulfur', 'midge', 'bwo', 'caddis'],
    popularLures: [
      'Size 16-18 sulfur emerger',
      'Zebra midge under split shot',
      'Streamers in tailout pools',
    ],
    accessNotes:
      'One of America\'s best wild brown trout fisheries. Sulfur hatch April-August is the marquee event. Wading-and-weir dam pulses are critical to track.',
  },
  {
    id: 'tn-watauga-river',
    name: 'Watauga River',
    aliases: ['Watauga Tailwater'],
    states: ['TN'],
    type: 'tailwater',
    bbox: [36.30, -82.30, 36.50, -82.05],
    centroid: { lat: 36.39, lng: -82.18 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '03478400' },
      damSchedule: { kind: 'tva', dam: 'Wilbur' },
    },
    species: ['Brown Trout', 'Rainbow Trout'],
    hatchTags: ['sulfur', 'caddis', 'midge', 'bwo'],
    accessNotes:
      'Year-round tailwater, big browns. Wilbur Dam pulses the schedule. Wading limited to slack-flow windows.',
  },
  {
    id: 'tn-norris-lake',
    name: 'Norris Lake',
    aliases: ['Norris Reservoir'],
    states: ['TN'],
    type: 'reservoir',
    bbox: [36.15, -84.30, 36.40, -83.50],
    centroid: { lat: 36.25, lng: -83.85 },
    surfaceAreaAcres: 33_840,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'usgs-lake', siteId: '03533500' },
    },
    species: [
      'Striped Bass',
      'Smallmouth Bass',
      'Largemouth Bass',
      'Walleye',
      'Crappie',
      'Bluegill',
      'Channel Catfish',
    ],
    accessNotes:
      'TVA deep clear reservoir. Striper fishery world-class — live shad on downriggers in summer. Smallmouth on rocky points spring/fall.',
  },
  {
    id: 'tn-center-hill-lake',
    name: 'Center Hill Lake',
    aliases: ['Center Hill Reservoir'],
    states: ['TN'],
    type: 'reservoir',
    bbox: [35.95, -85.95, 36.20, -85.50],
    centroid: { lat: 36.08, lng: -85.75 },
    surfaceAreaAcres: 18_220,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'usgs-lake', siteId: '03418070' },
    },
    species: [
      'Smallmouth Bass',
      'Largemouth Bass',
      'Spotted Bass',
      'Walleye',
      'White Bass',
      'Crappie',
      'Striped Bass',
    ],
    accessNotes:
      'Deep clear lake on the Caney Fork. Bridge piers + bluff walls hold smallmouth year-round. Walleye in 30-50 ft summer.',
  },
  {
    id: 'tn-dale-hollow-lake',
    name: 'Dale Hollow Lake',
    states: ['TN', 'KY'],
    type: 'reservoir',
    bbox: [36.45, -85.55, 36.70, -85.10],
    centroid: { lat: 36.58, lng: -85.30 },
    surfaceAreaAcres: 27_700,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'usgs-lake', siteId: '03413200' },
    },
    species: [
      'Smallmouth Bass',
      'Largemouth Bass',
      'Walleye',
      'Rainbow Trout',
      'Lake Trout',
      'Crappie',
      'Muskie',
    ],
    accessNotes:
      'World-record smallmouth (11 lb 15 oz, 1955) came from here. Clear water, deep structure. Lake trout fishery is unusual for the South.',
  },
  {
    id: 'tn-old-hickory-lake',
    name: 'Old Hickory Lake',
    aliases: ['Old Hickory Reservoir'],
    states: ['TN'],
    type: 'reservoir',
    bbox: [36.20, -86.95, 36.40, -86.30],
    centroid: { lat: 36.30, lng: -86.62 },
    surfaceAreaAcres: 22_500,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: [
      'Largemouth Bass',
      'Smallmouth Bass',
      'Striped Bass',
      'White Bass',
      'Crappie',
      'Catfish',
    ],
    accessNotes:
      'USACE Cumberland River impoundment. Big striper fishery in spring. Top-water explosions for whites + stripers in summer.',
  },
];
