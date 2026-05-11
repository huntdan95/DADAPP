import type { Waterbody } from '../registry';

/**
 * Michigan inland waters. Great Lakes + Lake St. Clair are in
 * `greatLakes.ts` since they're cross-state.
 */
export const MI_WATERBODIES: Waterbody[] = [
  {
    id: 'mi-manistee-river-lower',
    name: 'Big Manistee River',
    aliases: ['Manistee River', 'Lower Manistee'],
    states: ['MI'],
    type: 'tailwater',
    // Tippy Dam → Lake Michigan stretch. Long thin bbox follows river.
    bbox: [44.10, -86.40, 44.40, -85.65],
    centroid: { lat: 44.24, lng: -85.99 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '04125550' },
      damSchedule: { kind: 'consumers-energy', dam: 'Tippy' },
    },
    species: [
      'Chinook Salmon',
      'Coho Salmon',
      'Steelhead',
      'Brown Trout',
      'Lake Trout',
      'Smallmouth Bass',
      'Walleye',
    ],
    hatchTags: ['hex', 'caddis', 'isonychia', 'march-brown'],
    popularLures: [
      'Skein bags for steelhead',
      'Spawn bags drifted under floats',
      'Hex dries on July evenings',
    ],
    regulationsUrl: 'https://www.michigan.gov/dnr/managing-resources/fisheries',
    accessNotes:
      'Tippy Dam → High Bridge → Bear Creek → Lake Michigan. Salmon Sept-Oct, steelhead Oct-April, lake-run brown trout year-round. Hex hatch night-fishing late June-early July.',
  },
  {
    id: 'mi-manistee-river-upper',
    name: 'Upper Manistee River',
    aliases: ['Upper Manistee'],
    states: ['MI'],
    type: 'freestone',
    bbox: [44.40, -85.50, 44.90, -84.80],
    centroid: { lat: 44.62, lng: -85.20 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '04124500' },
    },
    species: ['Brown Trout', 'Brook Trout', 'Rainbow Trout', 'Smallmouth Bass'],
    hatchTags: ['hex', 'sulfur', 'caddis', 'bwo', 'march-brown', 'isonychia'],
    popularLures: [
      'Hopper / dropper rigs',
      'Nymph + indicator on long runs',
      'Hex dun on dark July nights',
    ],
    accessNotes:
      'Designated Blue Ribbon trout water above CCC Bridge. Year-round flies-only between M-72 and CCC Bridge. Hex hatch the highlight.',
  },
  {
    id: 'mi-au-sable-river',
    name: 'Au Sable River',
    aliases: ['AuSable', 'Au Sable'],
    states: ['MI'],
    type: 'freestone',
    // Holy Water + South Branch stretches
    bbox: [44.45, -84.80, 44.90, -83.90],
    centroid: { lat: 44.66, lng: -84.30 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '04136000' },
    },
    species: ['Brown Trout', 'Brook Trout', 'Rainbow Trout'],
    hatchTags: ['hex', 'sulfur', 'bwo', 'isonychia', 'march-brown', 'caddis'],
    accessNotes:
      'Holy Water (Burton\'s → Wakeley) is fly-only catch-and-release. South Branch the most famous Hex hatch in MI. Trico mornings in August.',
  },
  {
    id: 'mi-pere-marquette',
    name: 'Pere Marquette River',
    aliases: ['PM', 'PM River', 'Pere Marquette'],
    states: ['MI'],
    type: 'freestone',
    bbox: [43.85, -86.40, 44.10, -85.50],
    centroid: { lat: 43.98, lng: -85.95 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '04122500' },
    },
    species: ['Chinook Salmon', 'Steelhead', 'Brown Trout', 'Rainbow Trout'],
    hatchTags: ['hex', 'sulfur', 'caddis', 'isonychia'],
    accessNotes:
      'Flies-only stretch from M-37 → Gleason\'s Landing. Premier MI steelhead and salmon river. Hex hatch in late June.',
  },
  {
    id: 'mi-houghton-lake',
    name: 'Houghton Lake',
    states: ['MI'],
    type: 'lake',
    bbox: [44.27, -84.85, 44.42, -84.65],
    centroid: { lat: 44.35, lng: -84.75 },
    surfaceAreaAcres: 20_044,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      // No NDBC/CO-OPS in range — estimator is the right default
      // for this big inland lake.
      lakeData: { kind: 'estimated' },
    },
    species: ['Walleye', 'Yellow Perch', 'Northern Pike', 'Bluegill', 'Largemouth Bass', 'Crappie'],
    accessNotes:
      'Largest inland lake in MI. Tip-up walleye fishery in winter. Drop-shot perch deeper in summer. Big pike off weedlines.',
  },
  {
    id: 'mi-burt-lake',
    name: 'Burt Lake',
    states: ['MI'],
    type: 'lake',
    bbox: [45.40, -84.78, 45.52, -84.62],
    centroid: { lat: 45.46, lng: -84.70 },
    surfaceAreaAcres: 17_120,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Walleye', 'Smallmouth Bass', 'Northern Pike', 'Yellow Perch', 'Cisco'],
    accessNotes:
      'Part of the Inland Waterway. Connected to Mullett via Indian River. Stained water, weed beds along the shoreline.',
  },
  {
    id: 'mi-mullett-lake',
    name: 'Mullett Lake',
    states: ['MI'],
    type: 'lake',
    bbox: [45.45, -84.65, 45.62, -84.48],
    centroid: { lat: 45.53, lng: -84.55 },
    surfaceAreaAcres: 17_360,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Walleye', 'Smallmouth Bass', 'Lake Sturgeon', 'Yellow Perch', 'Northern Pike'],
    accessNotes:
      'Deep clear lake — over 140 ft in spots. Lake sturgeon season is a Michigan rarity. Smallmouth fishery in 8-20 ft on rocky humps.',
  },
];
