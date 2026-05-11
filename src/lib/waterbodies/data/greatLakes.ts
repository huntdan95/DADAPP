import type { Waterbody } from '../registry';

/**
 * The five Great Lakes + Lake St. Clair. Cross-state by definition,
 * so they live in their own file rather than under any one state.
 *
 * Data sources priority for each: in-lake CO-OPS shoreline sensor
 * first (it's a real lake-water-temp reading, not a shore-relative
 * proxy), NDBC open-lake buoys as alternatives.
 */
export const GREAT_LAKES: Waterbody[] = [
  {
    id: 'great-lakes-st-clair',
    name: 'Lake St. Clair',
    aliases: ['Lac Sainte Claire', 'Lake Saint Clair', 'Lake St Clair'],
    states: ['MI'],
    type: 'lake',
    bbox: [42.30, -83.00, 42.70, -82.35],
    centroid: { lat: 42.50, lng: -82.67 },
    surfaceAreaAcres: 273_280,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'noaa-coops', stationId: '9034052' },
    },
    alternateLakeStations: [
      {
        provider: { kind: 'noaa-buoy', stationId: '45005' },
        label: 'NDBC 45005 — West Lake Erie (open-water reference)',
      },
      {
        provider: { kind: 'noaa-buoy', stationId: '45149' },
        label: 'NDBC 45149 — Southern Lake Huron (upstream water mass)',
      },
    ],
    species: [
      'Smallmouth Bass',
      'Largemouth Bass',
      'Muskellunge',
      'Walleye',
      'Yellow Perch',
      'Northern Pike',
      'Channel Catfish',
      'Bluegill',
      'Crappie',
    ],
    hatchTags: ['hex', 'mayfly-lake'],
    popularLures: [
      'Drop-shot tube on rocky humps',
      'Crawler harness 1.4-1.7 mph',
      'Husky Jerk for muskie',
      'Live minnow under slip-bobber for perch',
    ],
    regulationsUrl: 'https://www.michigan.gov/dnr/managing-resources/fisheries',
    accessNotes:
      'Big-water with strong wind chop on west winds. Boat ramps at Metro Beach, Selfridge, Belle River, Anchor Bay. Watch shipping channel between US 12 and Detroit River.',
  },
  {
    id: 'great-lakes-erie',
    name: 'Lake Erie',
    states: ['MI', 'OH', 'PA', 'NY'],
    type: 'great_lakes',
    bbox: [41.40, -83.50, 42.90, -78.80],
    centroid: { lat: 42.10, lng: -81.20 },
    surfaceAreaAcres: 6_300_000,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'noaa-coops', stationId: '9063079' },
    },
    alternateLakeStations: [
      {
        provider: { kind: 'noaa-buoy', stationId: '45005' },
        label: 'NDBC 45005 — West Lake Erie',
      },
      {
        provider: { kind: 'noaa-buoy', stationId: '45142' },
        label: 'NDBC 45142 — South Erie',
      },
      {
        provider: { kind: 'noaa-coops', stationId: '9063020' },
        label: 'CO-OPS 9063020 — Buffalo NY (shoreline)',
      },
    ],
    species: [
      'Walleye',
      'Yellow Perch',
      'Smallmouth Bass',
      'Steelhead',
      'White Bass',
      'Sheepshead',
    ],
    hatchTags: ['hex', 'mayfly-lake'],
    popularLures: [
      'Mayfly rigs and erie dearies for walleye',
      'Live minnows on perch spreaders',
      'Casting spoons for steelhead off Ohio piers',
    ],
    accessNotes:
      'Western basin (Toledo/Sandusky) is shallowest and walleye factory. Eastern basin colder and steelhead-dominated. Big wind shifts; check forecasts.',
  },
  {
    id: 'great-lakes-huron',
    name: 'Lake Huron',
    states: ['MI'],
    type: 'great_lakes',
    bbox: [43.00, -84.60, 46.30, -79.60],
    centroid: { lat: 44.80, lng: -82.40 },
    surfaceAreaAcres: 14_900_000,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'noaa-coops', stationId: '9075014' },
    },
    alternateLakeStations: [
      {
        provider: { kind: 'noaa-buoy', stationId: '45008' },
        label: 'NDBC 45008 — South Lake Huron',
      },
      {
        provider: { kind: 'noaa-buoy', stationId: '45149' },
        label: 'NDBC 45149 — Southern Lake Huron',
      },
      {
        provider: { kind: 'noaa-buoy', stationId: '45003' },
        label: 'NDBC 45003 — North Huron',
      },
    ],
    species: [
      'Chinook Salmon',
      'Coho Salmon',
      'Lake Trout',
      'Steelhead',
      'Brown Trout',
      'Walleye',
      'Smallmouth Bass',
      'Yellow Perch',
    ],
    accessNotes:
      'Saginaw Bay walleye factory in spring. Big-lake trolling for kings off Harbor Beach + Port Sanilac. Watch the sudden offshore winds.',
  },
  {
    id: 'great-lakes-michigan',
    name: 'Lake Michigan',
    states: ['MI', 'IN', 'IL', 'WI'],
    type: 'great_lakes',
    bbox: [41.60, -88.00, 46.10, -85.00],
    centroid: { lat: 43.80, lng: -86.50 },
    surfaceAreaAcres: 14_600_000,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'noaa-coops', stationId: '9087023' },
    },
    alternateLakeStations: [
      {
        provider: { kind: 'noaa-coops', stationId: '9087044' },
        label: 'CO-OPS 9087044 — Calumet Harbor IL (shoreline)',
      },
      {
        provider: { kind: 'noaa-buoy', stationId: '45007' },
        label: 'NDBC 45007 — South Lake Michigan',
      },
      {
        provider: { kind: 'noaa-buoy', stationId: '45002' },
        label: 'NDBC 45002 — North Lake Michigan',
      },
    ],
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
      'Pier fishing for salmon in summer (Ludington, Manistee, St. Joseph). Big-water trolling 60-200 ft of water for kings. Skein and spawn for steelhead in fall.',
  },
  {
    id: 'great-lakes-superior',
    name: 'Lake Superior',
    states: ['MI', 'MN', 'WI'],
    type: 'great_lakes',
    bbox: [46.50, -92.50, 49.00, -84.30],
    centroid: { lat: 47.70, lng: -87.50 },
    surfaceAreaAcres: 20_300_000,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'noaa-buoy', stationId: '45004' },
    },
    alternateLakeStations: [
      {
        provider: { kind: 'noaa-buoy', stationId: '45001' },
        label: 'NDBC 45001 — Mid Superior',
      },
      {
        provider: { kind: 'noaa-buoy', stationId: '45006' },
        label: 'NDBC 45006 — Western Lake Superior',
      },
    ],
    species: [
      'Lake Trout',
      'Brook Trout',
      'Steelhead',
      'Coho Salmon',
      'Chinook Salmon',
      'Walleye',
      'Smallmouth Bass',
    ],
    accessNotes:
      'Cold deep water year-round. Lake trout fishery world-class — Apostle Islands, Marquette, Keweenaw. Coaster brook trout in north-shore rivers.',
  },
  {
    id: 'great-lakes-ontario',
    name: 'Lake Ontario',
    states: ['NY'],
    type: 'great_lakes',
    bbox: [43.20, -79.90, 44.20, -76.00],
    centroid: { lat: 43.70, lng: -78.00 },
    surfaceAreaAcres: 7_340_000,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'noaa-coops', stationId: '9052058' },
    },
    alternateLakeStations: [
      {
        provider: { kind: 'noaa-buoy', stationId: '45012' },
        label: 'NDBC 45012 — Lake Ontario',
      },
    ],
    species: [
      'Chinook Salmon',
      'Coho Salmon',
      'Brown Trout',
      'Lake Trout',
      'Steelhead',
      'Smallmouth Bass',
      'Walleye',
    ],
    accessNotes:
      'Premier trophy brown trout fishery. Salmon River + Oak Orchard tributaries for steelhead/kings in fall. Trolling 80-200 ft offshore in summer.',
  },
];
