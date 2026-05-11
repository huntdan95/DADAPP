import type { Waterbody } from '../registry';

/**
 * Mississippi waters. Four USACE flood-control reservoirs in the
 * north-central hills (Sardis, Grenada, Enid, Arkabutla) plus Ross
 * Barnett near Jackson and the Pickwick portion on the TN/AL border.
 * Coastal / delta saltwater + Pascagoula + Yazoo for warm-water
 * rivers.
 */
export const MS_WATERBODIES: Waterbody[] = [
  // ---------- North MS USACE reservoirs -----------------------------
  {
    id: 'ms-sardis-lake',
    name: 'Sardis Lake',
    states: ['MS'],
    type: 'reservoir',
    bbox: [34.38, -89.92, 34.55, -89.65],
    centroid: { lat: 34.46, lng: -89.78 },
    surfaceAreaAcres: 32_500,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Crappie', 'Largemouth Bass', 'White Bass', 'Catfish', 'Bream'],
    accessNotes:
      'USACE flood-control on Little Tallahatchie River. Famous crappie lake — spring spawn April produces 2+ lb slabs.',
  },
  {
    id: 'ms-grenada-lake',
    name: 'Grenada Lake',
    states: ['MS'],
    type: 'reservoir',
    bbox: [33.78, -89.95, 33.92, -89.65],
    centroid: { lat: 33.85, lng: -89.80 },
    surfaceAreaAcres: 35_000,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Crappie', 'Largemouth Bass', 'White Bass', 'Catfish', 'Bream'],
    accessNotes:
      'USACE on Yalobusha River. World-class crappie fishery — multiple state records. Spider rigging in spring.',
  },
  {
    id: 'ms-enid-lake',
    name: 'Enid Lake',
    states: ['MS'],
    type: 'reservoir',
    bbox: [34.10, -89.95, 34.25, -89.65],
    centroid: { lat: 34.17, lng: -89.80 },
    surfaceAreaAcres: 15_500,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Crappie', 'Largemouth Bass', 'White Bass', 'Catfish'],
    accessNotes:
      'USACE on Yocona River. Trophy crappie — world record (5.20 lb, 1957) caught here. Trolling jigs in the river channel.',
  },
  {
    id: 'ms-arkabutla-lake',
    name: 'Arkabutla Lake',
    states: ['MS'],
    type: 'reservoir',
    bbox: [34.72, -90.20, 34.85, -90.00],
    centroid: { lat: 34.78, lng: -90.10 },
    surfaceAreaAcres: 11_265,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Crappie', 'Largemouth Bass', 'Catfish', 'Bream', 'White Bass'],
    accessNotes:
      'USACE on Coldwater River. Closest of the four MS flood-control lakes to Memphis. Tournament + crappie boats.',
  },
  {
    id: 'ms-bay-springs-lake',
    name: 'Bay Springs Lake',
    states: ['MS'],
    type: 'reservoir',
    bbox: [34.60, -88.45, 34.75, -88.30],
    centroid: { lat: 34.67, lng: -88.37 },
    surfaceAreaAcres: 6_700,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Largemouth Bass', 'Smallmouth Bass', 'Crappie', 'Bream', 'Catfish'],
    accessNotes:
      'USACE on Tenn-Tom Waterway. Clear, deep, undeveloped. Smallmouth + largemouth fishery; bream beds in spring.',
  },

  // ---------- Central MS reservoirs ---------------------------------
  {
    id: 'ms-ross-barnett-reservoir',
    name: 'Ross Barnett Reservoir',
    aliases: ['The Rez'],
    states: ['MS'],
    type: 'reservoir',
    bbox: [32.40, -90.10, 32.60, -89.80],
    centroid: { lat: 32.50, lng: -89.95 },
    surfaceAreaAcres: 33_000,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Largemouth Bass', 'Crappie', 'White Bass', 'Catfish', 'Bream'],
    accessNotes:
      'Jackson-area reservoir on Pearl River. Bass tournament heavy. Crappie + catfish year-round.',
  },

  // ---------- Pickwick + Tennessee River ----------------------------
  {
    id: 'ms-pickwick-lake-ms',
    name: 'Pickwick Lake (MS portion)',
    states: ['MS', 'AL', 'TN'],
    type: 'reservoir',
    bbox: [34.80, -88.40, 34.95, -88.20],
    centroid: { lat: 34.88, lng: -88.30 },
    surfaceAreaAcres: 43_100,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Smallmouth Bass', 'Largemouth Bass', 'Striped Bass', 'Sauger', 'Catfish'],
    accessNotes:
      'TVA. MS shoreline. Smallmouth fishery is world-class. Sauger run winter.',
  },

  // ---------- Rivers ------------------------------------------------
  {
    id: 'ms-pascagoula-river',
    name: 'Pascagoula River',
    states: ['MS'],
    type: 'freestone',
    bbox: [30.40, -88.80, 31.85, -88.45],
    centroid: { lat: 31.15, lng: -88.65 },
    species: ['Largemouth Bass', 'Catfish', 'Bream', 'Speckled Trout', 'Redfish'],
    accessNotes:
      'Largest free-flowing river in the lower 48 (no major dam). Tidal influence below Vancleave. Spotted bass + saltwater species low.',
  },
  {
    id: 'ms-yazoo-river',
    name: 'Yazoo River',
    states: ['MS'],
    type: 'freestone',
    bbox: [32.50, -90.95, 33.40, -90.30],
    centroid: { lat: 33.00, lng: -90.65 },
    species: ['Catfish', 'Crappie', 'Largemouth Bass', 'Bream', 'Buffalo'],
    accessNotes:
      'Delta river. Stained slack water — catfish + crappie. Receives Sardis / Grenada / Enid drainage.',
  },
  {
    id: 'ms-big-black-river',
    name: 'Big Black River',
    states: ['MS'],
    type: 'freestone',
    bbox: [32.10, -90.85, 33.50, -89.55],
    centroid: { lat: 32.80, lng: -90.20 },
    species: ['Largemouth Bass', 'Spotted Bass', 'Catfish', 'Bream', 'Crappie'],
    accessNotes:
      'Smaller MS river west of Jackson. Spotted bass + bream. Canoe-friendly clear gravel reaches.',
  },

  // ---------- Gulf coast --------------------------------------------
  {
    id: 'ms-mississippi-sound',
    name: 'Mississippi Sound',
    states: ['MS'],
    type: 'saltwater',
    bbox: [30.15, -89.15, 30.40, -88.40],
    centroid: { lat: 30.27, lng: -88.78 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      tides: { kind: 'noaa', stationId: '8741533' },
    },
    species: ['Speckled Trout', 'Redfish', 'Flounder', 'Spanish Mackerel', 'Tripletail'],
    accessNotes:
      'Gulf Coast estuary between barrier islands + mainland. Speckled trout grass flats; reds on oyster bars; flounder gigging at night.',
  },
];
