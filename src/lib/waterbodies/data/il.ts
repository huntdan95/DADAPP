import type { Waterbody } from '../registry';

/**
 * Illinois waters. Lake Michigan + Chicago harbors (salmon /
 * steelhead), Mississippi + Illinois River pools (sauger / walleye
 * / catfish), and central + southern reservoirs (bass / crappie).
 */
export const IL_WATERBODIES: Waterbody[] = [
  // ---------- Lake Michigan -----------------------------------------
  {
    id: 'il-lake-michigan-il-shore',
    name: 'Lake Michigan (Illinois shore)',
    states: ['IL'],
    type: 'great_lakes',
    bbox: [41.62, -87.85, 42.55, -87.45],
    centroid: { lat: 42.10, lng: -87.65 },
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
      'Waukegan / Chicago / North Point harbors. Spring brown trout off the piers. Summer trolling for kings + lakers. Yellow perch jigging through ice.',
  },

  // ---------- Mississippi River pools (north → south) ----------------
  {
    id: 'il-mississippi-river-il',
    name: 'Mississippi River (Illinois pools)',
    aliases: ['Upper Mississippi'],
    states: ['IL', 'IA', 'MO', 'WI'],
    type: 'freestone',
    bbox: [37.00, -91.40, 42.50, -89.95],
    centroid: { lat: 39.75, lng: -90.70 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '05587455' },
    },
    species: [
      'Walleye',
      'Sauger',
      'Smallmouth Bass',
      'Largemouth Bass',
      'White Bass',
      'Channel Catfish',
      'Blue Catfish',
      'Flathead Catfish',
    ],
    accessNotes:
      'Locks + dams 11 → 26. Tailwater fishing below each dam — sauger / walleye / white bass in spring. Heavy commercial barge traffic.',
  },
  {
    id: 'il-illinois-river',
    name: 'Illinois River',
    states: ['IL'],
    type: 'freestone',
    bbox: [38.95, -91.45, 41.45, -88.95],
    centroid: { lat: 40.20, lng: -90.20 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '05586100' },
    },
    species: ['Sauger', 'Walleye', 'White Bass', 'Smallmouth Bass', 'Largemouth Bass', 'Catfish'],
    accessNotes:
      'Multi-pool river through central IL. Sauger + walleye below Starved Rock + Marseilles dams. Asian carp problem — be ready for jumpers.',
  },

  // ---------- Major reservoirs --------------------------------------
  {
    id: 'il-rend-lake',
    name: 'Rend Lake',
    states: ['IL'],
    type: 'reservoir',
    bbox: [37.95, -89.05, 38.20, -88.85],
    centroid: { lat: 38.08, lng: -88.95 },
    surfaceAreaAcres: 18_900,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'usgs-lake', siteId: '05595952' },
    },
    species: ['Largemouth Bass', 'Crappie', 'Bluegill', 'Catfish', 'White Bass'],
    accessNotes:
      'USACE on Big Muddy River. Crappie capital of southern IL. Standing timber + brush piles.',
  },
  {
    id: 'il-lake-shelbyville',
    name: 'Lake Shelbyville',
    states: ['IL'],
    type: 'reservoir',
    bbox: [39.30, -88.90, 39.55, -88.65],
    centroid: { lat: 39.45, lng: -88.80 },
    surfaceAreaAcres: 11_100,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'usgs-lake', siteId: '05592000' },
    },
    species: ['Walleye', 'Largemouth Bass', 'White Bass', 'Crappie', 'Catfish'],
    accessNotes:
      'USACE on Kaskaskia River. Walleye fishery — among the best in IL. Tournament bass + crappie on brush piles.',
  },
  {
    id: 'il-carlyle-lake',
    name: 'Carlyle Lake',
    states: ['IL'],
    type: 'reservoir',
    bbox: [38.55, -89.45, 38.80, -89.20],
    centroid: { lat: 38.65, lng: -89.32 },
    surfaceAreaAcres: 26_000,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'usgs-lake', siteId: '05593000' },
    },
    species: ['White Bass', 'Largemouth Bass', 'Walleye', 'Catfish', 'Crappie', 'Bluegill'],
    accessNotes:
      'USACE on Kaskaskia River. Largest reservoir in IL. White bass + walleye fishery. Sail-friendly windy water.',
  },
  {
    id: 'il-lake-springfield',
    name: 'Lake Springfield',
    states: ['IL'],
    type: 'reservoir',
    bbox: [39.65, -89.65, 39.75, -89.55],
    centroid: { lat: 39.70, lng: -89.60 },
    surfaceAreaAcres: 4_232,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'usgs-lake', siteId: '05576250' },
    },
    species: ['Largemouth Bass', 'Striped Bass', 'White Bass', 'Crappie', 'Catfish'],
    accessNotes:
      'City utility lake. Hybrid striper stocking. Power-plant warm-water keeps fish active in winter.',
  },
  {
    id: 'il-clinton-lake',
    name: 'Clinton Lake',
    states: ['IL'],
    type: 'reservoir',
    bbox: [40.10, -88.95, 40.20, -88.75],
    centroid: { lat: 40.15, lng: -88.85 },
    surfaceAreaAcres: 4_900,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'usgs-lake', siteId: '05578300' },
    },
    species: ['Largemouth Bass', 'Hybrid Bass', 'White Bass', 'Crappie', 'Catfish'],
    accessNotes:
      'Cooling lake for nuclear plant. Open winter — hybrids + bass active year-round in warm-water discharge.',
  },

  // ---------- Rivers (warmwater) ------------------------------------
  {
    id: 'il-kankakee-river',
    name: 'Kankakee River',
    states: ['IL', 'IN'],
    type: 'freestone',
    bbox: [40.95, -88.45, 41.20, -87.05],
    centroid: { lat: 41.08, lng: -87.75 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '05520500' },
    },
    species: ['Smallmouth Bass', 'Walleye', 'Northern Pike', 'Catfish', 'Rock Bass'],
    accessNotes:
      'Clear gravel river. Smallmouth + walleye fishery. Kankakee State Park access.',
  },
  {
    id: 'il-fox-river-il',
    name: 'Fox River (IL)',
    states: ['IL'],
    type: 'freestone',
    bbox: [41.50, -88.45, 42.50, -88.20],
    centroid: { lat: 42.00, lng: -88.32 },
    species: ['Smallmouth Bass', 'Walleye', 'Channel Catfish', 'Northern Pike', 'Crappie'],
    accessNotes:
      'Chain o\' Lakes headwaters to confluence with Illinois River at Ottawa. Smallmouth + walleye. Multiple low-head dams.',
  },
];
