import type { Waterbody } from '../registry';

/**
 * Oklahoma waters. Heavy on USACE reservoirs (Texoma, Eufaula,
 * Keystone, Skiatook, etc.) plus Broken Bow + the Lower Mountain
 * Fork — one of OK's few cold-water trout fisheries.
 */
export const OK_WATERBODIES: Waterbody[] = [
  // ---------- Major USACE reservoirs --------------------------------
  {
    id: 'ok-lake-texoma',
    name: 'Lake Texoma',
    states: ['OK', 'TX'],
    type: 'reservoir',
    // Expanded north to cover the Washita + Cumberland arms (the dam
    // is at the south end; lake extends well into OK to the north).
    bbox: [33.78, -97.12, 34.18, -96.28],
    centroid: { lat: 33.92, lng: -96.70 },
    surfaceAreaAcres: 89_000,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'usgs-lake', siteId: '07331500' },
    },
    alternateLakeStations: [
      {
        provider: { kind: 'usgs-lake', siteId: '07331455' },
        label: 'USGS — Lake Texoma at Cumberland Cut (OK side)',
      },
    ],
    species: ['Striped Bass', 'Largemouth Bass', 'Smallmouth Bass', 'White Bass', 'Catfish', 'Crappie'],
    accessNotes:
      'USACE on Red River, OK/TX border. Striped bass capital — naturally reproducing population (rare for inland waters). Live shad on downlines.',
  },
  {
    id: 'ok-eufaula-lake',
    name: 'Eufaula Lake',
    aliases: ['Lake Eufaula OK'],
    states: ['OK'],
    type: 'reservoir',
    // Expanded south to cover the long Canadian-River + Deep-Fork
    // southern arms (the original bbox cut off everything south of
    // 35.20°N — the Brooken / Crowder zone). On-lake station
    // 07244800 sits at ~35.31°N near the dam.
    bbox: [34.95, -95.95, 35.45, -95.28],
    centroid: { lat: 35.30, lng: -95.55 },
    surfaceAreaAcres: 102_500,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'usgs-lake', siteId: '07244800' },
    },
    species: ['Largemouth Bass', 'White Bass', 'Striped Bass', 'Crappie', 'Catfish'],
    accessNotes:
      'USACE on Canadian River. Largest lake in OK. Stained water; flipping mats + brush piles for bass. Striper + white bass schools.',
  },
  {
    id: 'ok-keystone-lake',
    name: 'Keystone Lake',
    states: ['OK'],
    type: 'reservoir',
    // Two arms: Cimarron River (NW) + Arkansas River (W). Widening
    // the bbox slightly west + south to cover them.
    bbox: [36.08, -96.60, 36.38, -96.10],
    centroid: { lat: 36.22, lng: -96.32 },
    surfaceAreaAcres: 26_300,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'usgs-lake', siteId: '07164200' },
    },
    alternateLakeStations: [
      {
        provider: { kind: 'usgs-lake', siteId: '07153150' },
        label: 'USGS — Keystone Lake near Cleveland (NW arm)',
      },
    ],
    species: ['Striped Bass', 'White Bass', 'Largemouth Bass', 'Sand Bass', 'Catfish', 'Crappie'],
    accessNotes:
      'USACE west of Tulsa on Arkansas + Cimarron. Striper + white bass schoolers. Stained heavy water.',
  },
  {
    id: 'ok-skiatook-lake',
    name: 'Skiatook Lake',
    states: ['OK'],
    type: 'reservoir',
    bbox: [36.30, -96.20, 36.48, -95.92],
    centroid: { lat: 36.38, lng: -96.06 },
    surfaceAreaAcres: 10_500,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'usgs-lake', siteId: '07177400' },
    },
    species: ['Striped Bass', 'White Bass', 'Largemouth Bass', 'Spotted Bass', 'Crappie'],
    accessNotes:
      'USACE on Hominy Creek. Striped bass + white bass fishery. Clearer water than Keystone.',
  },
  {
    id: 'ok-tenkiller-lake',
    name: 'Tenkiller Ferry Lake',
    aliases: ['Tenkiller'],
    states: ['OK'],
    type: 'reservoir',
    bbox: [35.50, -95.10, 35.80, -94.83],
    centroid: { lat: 35.62, lng: -94.97 },
    surfaceAreaAcres: 12_900,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'usgs-lake', siteId: '07197500' },
    },
    species: ['Largemouth Bass', 'Smallmouth Bass', 'Spotted Bass', 'Striped Bass', 'Walleye', 'Crappie'],
    accessNotes:
      'USACE on Illinois River. Clearest lake in OK ("Heaven in the Hills"). Smallmouth + walleye on the rocky banks.',
  },
  {
    id: 'ok-grand-lake-cherokees',
    name: 'Grand Lake o\' the Cherokees',
    aliases: ['Grand Lake', 'Pensacola Lake'],
    states: ['OK'],
    type: 'reservoir',
    // Lake runs from Pensacola Dam (Langley, ~36.47°N) north-east
    // all the way to Twin Bridges (~36.85°N). On-lake station
    // 07190000 sits at Langley.
    bbox: [36.40, -95.12, 36.88, -94.62],
    centroid: { lat: 36.62, lng: -94.88 },
    surfaceAreaAcres: 46_500,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'usgs-lake', siteId: '07190000' },
    },
    species: ['Largemouth Bass', 'Spotted Bass', 'Smallmouth Bass', 'Striped Bass', 'Crappie', 'Catfish'],
    accessNotes:
      'GRDA (Grand River Dam Authority) on Neosho River. Major tournament lake — Bassmaster Classic venue. Spotted bass on the rocks.',
  },
  {
    id: 'ok-broken-bow-lake',
    name: 'Broken Bow Lake',
    states: ['OK'],
    type: 'reservoir',
    bbox: [34.08, -94.80, 34.40, -94.55],
    centroid: { lat: 34.22, lng: -94.66 },
    surfaceAreaAcres: 14_220,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'usgs-lake', siteId: '07338900' },
    },
    species: ['Largemouth Bass', 'Smallmouth Bass', 'Spotted Bass', 'Striped Bass', 'Catfish', 'Bream'],
    accessNotes:
      'USACE on Mountain Fork River. Clear deep SE OK reservoir. Smallmouth on the rocks. Below the dam = the trout tailwater.',
  },
  {
    id: 'ok-oologah-lake',
    name: 'Oologah Lake',
    states: ['OK'],
    type: 'reservoir',
    bbox: [36.38, -95.82, 36.65, -95.48],
    centroid: { lat: 36.50, lng: -95.65 },
    surfaceAreaAcres: 29_500,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'usgs-lake', siteId: '07171300' },
    },
    species: ['Striped Bass', 'White Bass', 'Largemouth Bass', 'Crappie', 'Catfish'],
    accessNotes:
      'USACE on Verdigris River. Striped bass + white bass fishery. Big-water with stained-to-clear gradient.',
  },

  // ---------- Trout tailwater (OK\'s only one) -----------------------
  {
    id: 'ok-lower-mountain-fork',
    name: 'Lower Mountain Fork River',
    aliases: ['Mountain Fork Tailwater', 'LMFR'],
    states: ['OK'],
    type: 'tailwater',
    bbox: [34.05, -94.78, 34.20, -94.55],
    centroid: { lat: 34.13, lng: -94.65 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '07338500' },
      damSchedule: { kind: 'auto', flowSiteId: '07338500' },
    },
    species: ['Rainbow Trout', 'Brown Trout'],
    hatchTags: ['caddis', 'sulfur', 'midge', 'bwo'],
    accessNotes:
      "OK's only cold-water trout fishery. Below Broken Bow Dam, ~12 miles to Beavers Bend. Year-round stocking. Trophy browns in the upper end.",
  },

  // ---------- Rivers ------------------------------------------------
  {
    id: 'ok-illinois-river-ok',
    name: 'Illinois River (OK)',
    states: ['OK'],
    type: 'freestone',
    bbox: [35.60, -95.00, 36.15, -94.45],
    centroid: { lat: 35.87, lng: -94.72 },
    species: ['Smallmouth Bass', 'Largemouth Bass', 'Spotted Bass', 'Rock Bass', 'Channel Catfish'],
    accessNotes:
      'Scenic, designated Wild + Scenic. Float-trip favorite. Smallmouth fishery; clear gravel runs.',
  },
  {
    id: 'ok-arkansas-river-ok',
    name: 'Arkansas River (OK)',
    states: ['OK'],
    type: 'freestone',
    bbox: [35.40, -97.50, 36.45, -94.50],
    centroid: { lat: 35.95, lng: -96.20 },
    species: ['Striped Bass', 'White Bass', 'Catfish', 'Sauger', 'Largemouth Bass'],
    accessNotes:
      'Multi-pool river with USACE locks + dams. Striper + sauger run from the Mississippi up the McClellan-Kerr.',
  },
];
