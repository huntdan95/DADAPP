import type { Waterbody } from '../registry';

/**
 * Indiana waters. The Lake Michigan shoreline / Trail Creek system in
 * the NW corner is a salmon + steelhead fishery; the rest of the
 * state is warmwater bass / crappie / catfish.
 */
export const IN_WATERBODIES: Waterbody[] = [
  // ---------- Lake Michigan + tribs (Steelhead Alley) ----------------
  {
    id: 'in-trail-creek',
    name: 'Trail Creek',
    states: ['IN'],
    type: 'tailwater',
    bbox: [41.69, -86.85, 41.74, -86.72],
    centroid: { lat: 41.71, lng: -86.78 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '04095380' },
    },
    species: ['Steelhead', 'Chinook Salmon', 'Coho Salmon', 'Brown Trout'],
    runLimits: [
      {
        species: 'Steelhead',
        limit: 'Upper-end natural barriers',
        note: 'Spring + fall runs. Peak Oct-Nov + March.',
      },
      {
        species: 'Chinook Salmon',
        limit: 'Upper-end natural barriers',
      },
    ],
    accessNotes:
      "Michigan City. IN's most famous steelhead tributary. Heavy pressure during runs; bobbers + spawn / yarn flies. Public access at Cool Creek + Hansen Park.",
  },
  {
    id: 'in-st-joseph-river-in',
    name: 'St. Joseph River (IN)',
    aliases: ['St Joe IN', 'Twin Branch St. Joe'],
    states: ['IN'],
    type: 'tailwater',
    bbox: [41.55, -86.40, 41.85, -85.45],
    centroid: { lat: 41.70, lng: -85.95 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '04101000' },
    },
    species: ['Steelhead', 'Chinook Salmon', 'Brown Trout', 'Smallmouth Bass', 'Walleye'],
    runLimits: [
      {
        species: 'Steelhead',
        limit: 'Twin Branch Dam (with fish ladder)',
        note: 'South Bend area. Ladder allows passage upstream.',
      },
    ],
    accessNotes:
      "MI/IN border river. South Bend dam ladders steelhead up. Heavy spawn-bag + bead fishing in fall + spring.",
  },
  {
    id: 'in-lake-michigan-in-shore',
    name: 'Lake Michigan (Indiana shore)',
    states: ['IN'],
    type: 'great_lakes',
    bbox: [41.62, -87.55, 41.78, -86.80],
    centroid: { lat: 41.69, lng: -87.15 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'noaa-coops', stationId: '9087044' },
    },
    species: [
      'Chinook Salmon',
      'Coho Salmon',
      'Steelhead',
      'Brown Trout',
      'Lake Trout',
      'Yellow Perch',
      'Smallmouth Bass',
    ],
    accessNotes:
      'IN dunes shoreline. Charter fleet from Michigan City + East Chicago + Hammond. Coho + steelhead spring; kings summer.',
  },

  // ---------- Reservoirs (USACE primarily) ---------------------------
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
    id: 'in-mississinewa-lake',
    name: 'Mississinewa Lake',
    states: ['IN'],
    type: 'reservoir',
    bbox: [40.65, -85.95, 40.78, -85.75],
    centroid: { lat: 40.71, lng: -85.85 },
    surfaceAreaAcres: 3_180,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Walleye', 'Largemouth Bass', 'Smallmouth Bass', 'White Bass', 'Crappie', 'Catfish'],
    accessNotes:
      'USACE on Mississinewa River. Walleye stocking program — spring jig-bite below the dam.',
  },
  {
    id: 'in-salamonie-lake',
    name: 'Salamonie Lake',
    states: ['IN'],
    type: 'reservoir',
    bbox: [40.70, -85.75, 40.80, -85.50],
    centroid: { lat: 40.75, lng: -85.62 },
    surfaceAreaAcres: 2_855,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Walleye', 'Largemouth Bass', 'Crappie', 'Catfish', 'Bluegill'],
    accessNotes:
      'USACE on Salamonie River. Sister lake to Mississinewa. Stained water + standing timber.',
  },
  {
    id: 'in-brookville-lake',
    name: 'Brookville Lake',
    states: ['IN'],
    type: 'reservoir',
    bbox: [39.40, -85.05, 39.55, -84.95],
    centroid: { lat: 39.48, lng: -85.00 },
    surfaceAreaAcres: 5_260,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Striped Bass', 'Largemouth Bass', 'Smallmouth Bass', 'White Bass', 'Crappie'],
    accessNotes:
      'USACE on Whitewater River. Clear-water striper fishery — unusual for IN. Smallmouth on rocky bluffs.',
  },
  {
    id: 'in-cecil-harden-lake',
    name: 'Cecil M. Harden Lake',
    aliases: ['Raccoon Lake'],
    states: ['IN'],
    type: 'reservoir',
    bbox: [39.78, -87.10, 39.85, -87.00],
    centroid: { lat: 39.81, lng: -87.05 },
    surfaceAreaAcres: 2_060,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Largemouth Bass', 'Striped Bass', 'White Bass', 'Crappie', 'Catfish'],
    accessNotes:
      'USACE on Raccoon Creek. Hybrid striper fishery. Spring + fall crappie pole-fishing on timber.',
  },

  // ---------- Inland lakes ------------------------------------------
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
    id: 'in-lake-maxinkuckee',
    name: 'Lake Maxinkuckee',
    states: ['IN'],
    type: 'lake',
    bbox: [41.18, -86.45, 41.24, -86.37],
    centroid: { lat: 41.21, lng: -86.41 },
    surfaceAreaAcres: 1_854,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Largemouth Bass', 'Smallmouth Bass', 'Walleye', 'Yellow Perch', 'Bluegill'],
    accessNotes:
      'Second-largest natural lake in IN. Culver. Stocked walleye + smallmouth.',
  },

  // ---------- Rivers (warmwater + smallmouth) ------------------------
  {
    id: 'in-tippecanoe-river',
    name: 'Tippecanoe River',
    aliases: ['Tippy'],
    states: ['IN'],
    type: 'freestone',
    bbox: [40.40, -87.05, 41.20, -86.30],
    centroid: { lat: 40.80, lng: -86.65 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '03331500' },
    },
    species: ['Smallmouth Bass', 'Walleye', 'Channel Catfish', 'Northern Pike', 'Rock Bass'],
    accessNotes:
      'Lake Shafer + Lake Freeman impoundments downstream. Smallmouth + walleye fishery; clear riffles + holes.',
  },
  {
    id: 'in-wabash-river',
    name: 'Wabash River',
    states: ['IN'],
    type: 'freestone',
    bbox: [37.95, -88.10, 40.85, -85.10],
    centroid: { lat: 39.40, lng: -86.60 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '03377500' },
    },
    species: ['Smallmouth Bass', 'Largemouth Bass', 'Walleye', 'Sauger', 'Catfish', 'White Bass', 'Crappie'],
    accessNotes:
      'IN/IL border river. Smallmouth + catfish through middle IN. Sauger run from the Ohio in winter.',
  },
  {
    id: 'in-sugar-creek-in',
    name: 'Sugar Creek (IN)',
    states: ['IN'],
    type: 'freestone',
    bbox: [39.95, -87.05, 40.20, -86.65],
    centroid: { lat: 40.05, lng: -86.85 },
    species: ['Smallmouth Bass', 'Rock Bass', 'Spotted Bass', 'Channel Catfish'],
    accessNotes:
      'Turkey Run + Shades State Park. Wild smallmouth fishery. Clear riffle-pool stream; canoe access common.',
  },
];
