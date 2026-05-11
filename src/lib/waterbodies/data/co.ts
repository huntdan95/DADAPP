import type { Waterbody } from '../registry';

/**
 * Colorado waters. CPW publishes a stocking report covering hundreds
 * of streams, lakes, and reservoirs. The big targets: the gold-medal
 * trout rivers (South Platte, Arkansas, Frying Pan, Roaring Fork,
 * upper Colorado) plus the South Park reservoir chain.
 */
export const CO_WATERBODIES: Waterbody[] = [
  // ---------- Gold-medal trout rivers -------------------------------
  {
    id: 'co-south-platte-cheesman',
    name: 'South Platte (Cheesman Canyon)',
    aliases: ['Cheesman Canyon', 'Platte Cheesman'],
    states: ['CO'],
    type: 'tailwater',
    bbox: [39.20, -105.30, 39.30, -105.20],
    centroid: { lat: 39.25, lng: -105.25 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '06701900' },
      damSchedule: { kind: 'auto', flowSiteId: '06701900' },
    },
    species: ['Brown Trout', 'Rainbow Trout', 'Cutthroat Trout'],
    hatchTags: ['midge', 'bwo', 'pmd', 'caddis', 'tricos'],
    accessNotes:
      "CO Gold Medal water. Cheesman Dam → Wigwam Club. Hike-in catch-and-release. Trophy wild browns + rainbows. Technical sight-fishing.",
  },
  {
    id: 'co-south-platte-dream',
    name: 'South Platte (Dream Stream)',
    aliases: ['Dream Stream'],
    states: ['CO'],
    type: 'freestone',
    bbox: [38.95, -105.85, 39.05, -105.75],
    centroid: { lat: 39.00, lng: -105.80 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '06695500' },
    },
    species: ['Brown Trout', 'Rainbow Trout', 'Cutthroat Trout'],
    hatchTags: ['midge', 'bwo', 'pmd', 'trico'],
    accessNotes:
      'Spinney Mountain Reservoir → Eleven Mile Reservoir. South Park meadow water — trophy wild fish. Spawning runs spring + fall.',
  },
  {
    id: 'co-arkansas-river-co',
    name: 'Arkansas River (Colorado)',
    states: ['CO'],
    type: 'freestone',
    bbox: [38.20, -106.30, 38.80, -104.85],
    centroid: { lat: 38.50, lng: -105.55 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '07087050' },
    },
    species: ['Brown Trout', 'Rainbow Trout', 'Cutthroat Trout', 'Mountain Whitefish'],
    hatchTags: ['caddis', 'pmd', 'salmonfly', 'bwo'],
    accessNotes:
      'Gold Medal water from Salida → Cañon City. Mother\'s Day caddis hatch + salmonflies. Float + wade.',
  },
  {
    id: 'co-frying-pan-river',
    name: 'Frying Pan River',
    aliases: ['Pan'],
    states: ['CO'],
    type: 'tailwater',
    bbox: [39.30, -106.95, 39.45, -106.70],
    centroid: { lat: 39.37, lng: -106.82 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '09080400' },
      damSchedule: { kind: 'auto', flowSiteId: '09080400' },
    },
    species: ['Brown Trout', 'Rainbow Trout'],
    hatchTags: ['mysis-shrimp', 'midge', 'bwo', 'pmd', 'green-drake'],
    accessNotes:
      "Ruedi Reservoir → Roaring Fork. Mysis-shrimp tailwater grows trophy trout. Toilet Bowl below the dam = biggest fish.",
  },
  {
    id: 'co-roaring-fork-river',
    name: 'Roaring Fork River',
    states: ['CO'],
    type: 'freestone',
    bbox: [39.20, -107.20, 39.55, -106.70],
    centroid: { lat: 39.40, lng: -106.95 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '09085000' },
    },
    species: ['Brown Trout', 'Rainbow Trout', 'Cutthroat Trout', 'Mountain Whitefish'],
    hatchTags: ['salmonfly', 'pmd', 'caddis', 'green-drake', 'hopper'],
    accessNotes:
      'Aspen → Glenwood Springs. Gold Medal in lower sections. Green drake hatch July. Big-water floats.',
  },
  {
    id: 'co-colorado-river-co',
    name: 'Colorado River (Colorado)',
    states: ['CO'],
    type: 'freestone',
    bbox: [39.45, -107.95, 40.30, -106.10],
    centroid: { lat: 39.85, lng: -107.20 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '09058000' },
    },
    species: ['Brown Trout', 'Rainbow Trout', 'Cutthroat Trout'],
    hatchTags: ['salmonfly', 'pmd', 'caddis', 'hopper'],
    accessNotes:
      'Pumphouse → State Bridge → Dotsero. Pumphouse float is classic. Lower water below Glenwood = warmer / different fishery.',
  },
  {
    id: 'co-blue-river-co',
    name: 'Blue River (CO)',
    states: ['CO'],
    type: 'tailwater',
    bbox: [39.55, -106.10, 39.95, -105.90],
    centroid: { lat: 39.75, lng: -106.00 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '09057500' },
      damSchedule: { kind: 'auto', flowSiteId: '09057500' },
    },
    species: ['Brown Trout', 'Rainbow Trout'],
    hatchTags: ['midge', 'mysis-shrimp', 'bwo', 'caddis'],
    accessNotes:
      'Dillon Reservoir → Green Mountain Reservoir → Colorado River. Mysis tailwater. Trophy browns. Silverthorne urban stretch.',
  },
  {
    id: 'co-gunnison-river',
    name: 'Gunnison River',
    states: ['CO'],
    type: 'freestone',
    bbox: [38.45, -107.85, 38.95, -106.95],
    centroid: { lat: 38.70, lng: -107.35 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '09128000' },
    },
    species: ['Brown Trout', 'Rainbow Trout', 'Cutthroat Trout'],
    hatchTags: ['salmonfly', 'pmd', 'caddis', 'hopper'],
    accessNotes:
      'Black Canyon → North Fork → main Gunnison. Gold Medal in Black Canyon (hike-in). Salmonfly hatch June.',
  },
  {
    id: 'co-yampa-river',
    name: 'Yampa River',
    states: ['CO'],
    type: 'freestone',
    bbox: [40.40, -107.55, 40.55, -106.55],
    centroid: { lat: 40.47, lng: -107.05 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '09244410' },
    },
    species: ['Brown Trout', 'Rainbow Trout', 'Northern Pike', 'Smallmouth Bass'],
    accessNotes:
      'Trout in upper river (Steamboat Springs). Pike + smallmouth in lower. Town stretch through Steamboat is famous urban trout water.',
  },
  {
    id: 'co-rio-grande-co',
    name: 'Rio Grande (Colorado)',
    states: ['CO'],
    type: 'freestone',
    bbox: [37.30, -107.30, 37.85, -106.40],
    centroid: { lat: 37.60, lng: -106.85 },
    species: ['Brown Trout', 'Rainbow Trout', 'Cutthroat Trout'],
    hatchTags: ['caddis', 'pmd', 'green-drake', 'salmonfly'],
    accessNotes:
      'Headwaters in San Juans. Wild + scenic above Creede. Browns + rainbows; native cutthroat in feeders.',
  },

  // ---------- South Park reservoirs ---------------------------------
  {
    id: 'co-spinney-mountain-reservoir',
    name: 'Spinney Mountain Reservoir',
    states: ['CO'],
    type: 'reservoir',
    bbox: [38.95, -105.80, 39.05, -105.70],
    centroid: { lat: 39.00, lng: -105.75 },
    surfaceAreaAcres: 2_500,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Rainbow Trout', 'Brown Trout', 'Cutthroat Trout', 'Northern Pike'],
    accessNotes:
      'South Park stillwater. Famous trophy trout — Dream Stream connects to it downstream. Pike fishery as well.',
  },
  {
    id: 'co-eleven-mile-reservoir',
    name: 'Eleven Mile Reservoir',
    aliases: ['Elevenmile'],
    states: ['CO'],
    type: 'reservoir',
    bbox: [38.90, -105.60, 39.00, -105.40],
    centroid: { lat: 38.95, lng: -105.50 },
    surfaceAreaAcres: 3_400,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Rainbow Trout', 'Brown Trout', 'Northern Pike', 'Kokanee Salmon', 'Yellow Perch'],
    accessNotes:
      'Below Spinney. Tubing trout chironomids; pike on the weedlines. Ice fishing thriving in winter.',
  },
  {
    id: 'co-antero-reservoir',
    name: 'Antero Reservoir',
    states: ['CO'],
    type: 'reservoir',
    bbox: [38.95, -106.05, 39.05, -105.85],
    centroid: { lat: 39.00, lng: -105.95 },
    surfaceAreaAcres: 2_120,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Rainbow Trout', 'Brown Trout', 'Cutthroat Trout'],
    accessNotes:
      'South Park trout reservoir. Cyclical fishery — periodically drained for repairs.',
  },
  {
    id: 'co-blue-mesa-reservoir',
    name: 'Blue Mesa Reservoir',
    states: ['CO'],
    type: 'reservoir',
    bbox: [38.40, -107.45, 38.55, -106.95],
    centroid: { lat: 38.47, lng: -107.20 },
    surfaceAreaAcres: 9_180,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Lake Trout', 'Kokanee Salmon', 'Rainbow Trout', 'Brown Trout', 'Yellow Perch'],
    accessNotes:
      'Largest body of water in CO. Trophy lake trout + kokanee fishery. Gunnison River impoundment.',
  },
  {
    id: 'co-dillon-reservoir',
    name: 'Dillon Reservoir',
    aliases: ['Lake Dillon'],
    states: ['CO'],
    type: 'reservoir',
    bbox: [39.60, -106.10, 39.65, -105.95],
    centroid: { lat: 39.62, lng: -106.02 },
    surfaceAreaAcres: 3_233,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Rainbow Trout', 'Brown Trout', 'Lake Trout', 'Kokanee Salmon', 'Arctic Char'],
    accessNotes:
      'Summit County. Arctic char (unique to CO!) + lake trout + kokanee. No swimming or wading — water supply for Denver.',
  },
];
