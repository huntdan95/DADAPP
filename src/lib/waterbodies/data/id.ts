import type { Waterbody } from '../registry';

/**
 * Idaho waters. Snake River + tributaries (South Fork, Henrys Fork,
 * Big Lost), Salmon + Selway wilderness rivers, the Coeur d'Alene /
 * Pend Oreille / Priest panhandle lake chain, and white-sturgeon
 * water below Hells Canyon.
 */
export const ID_WATERBODIES: Waterbody[] = [
  // ---------- Snake River system ------------------------------------
  {
    id: 'id-snake-river-id',
    name: 'Snake River (Idaho)',
    states: ['ID'],
    type: 'tailwater',
    bbox: [41.95, -117.55, 44.45, -111.05],
    centroid: { lat: 43.20, lng: -114.30 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '13066000' },
    },
    species: [
      'Rainbow Trout',
      'Brown Trout',
      'Cutthroat Trout',
      'White Sturgeon',
      'Smallmouth Bass',
      'Mountain Whitefish',
    ],
    accessNotes:
      'Long river — different fishery every stretch. Above Palisades: cutthroat. Below Idaho Falls → American Falls: trout. Hells Canyon: white sturgeon (C&R only).',
  },
  {
    id: 'id-south-fork-snake',
    name: 'South Fork Snake River',
    states: ['ID'],
    type: 'tailwater',
    bbox: [43.30, -111.95, 43.80, -111.35],
    centroid: { lat: 43.55, lng: -111.65 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '13037500' },
      damSchedule: { kind: 'auto', flowSiteId: '13037500' },
    },
    species: ['Yellowstone Cutthroat', 'Brown Trout', 'Rainbow Trout', 'Mountain Whitefish'],
    hatchTags: ['salmonfly', 'pmd', 'caddis', 'pmx', 'tricos', 'hopper'],
    accessNotes:
      'Palisades Dam → confluence with Henrys Fork. Famous Yellowstone cutthroat fishery + salmonfly hatch late June. World-class float trip.',
  },
  {
    id: 'id-henrys-fork',
    name: 'Henrys Fork',
    aliases: ['Henrys Fork Snake'],
    states: ['ID'],
    type: 'freestone',
    bbox: [43.80, -111.95, 44.65, -111.30],
    centroid: { lat: 44.25, lng: -111.62 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '13042500' },
    },
    species: ['Rainbow Trout', 'Brown Trout', 'Brook Trout', 'Mountain Whitefish'],
    hatchTags: ['pmd', 'caddis', 'tricos', 'green-drake', 'bwo', 'midge'],
    accessNotes:
      "Ranch section above Last Chance — flat-water spring-creek fly fishing. Box Canyon below = boulders + caddis. World-famous green drake hatch June.",
  },
  {
    id: 'id-teton-river',
    name: 'Teton River',
    states: ['ID'],
    type: 'freestone',
    bbox: [43.65, -111.50, 44.05, -111.00],
    centroid: { lat: 43.85, lng: -111.25 },
    species: ['Yellowstone Cutthroat', 'Rainbow Trout', 'Brook Trout', 'Mountain Whitefish'],
    hatchTags: ['pmd', 'caddis', 'tricos'],
    accessNotes:
      'Spring-creek meadow water in the Teton Valley. Native cutthroat. Float or wade.',
  },
  {
    id: 'id-big-lost-river',
    name: 'Big Lost River',
    states: ['ID'],
    type: 'freestone',
    bbox: [43.55, -114.05, 44.30, -113.20],
    centroid: { lat: 43.90, lng: -113.65 },
    species: ['Rainbow Trout', 'Brook Trout', 'Mountain Whitefish'],
    hatchTags: ['pmd', 'caddis', 'tricos'],
    accessNotes:
      'High-desert tailwater + freestone. Mackay → Arco. Tail of the rainbow stocking pipeline. Heavy hatches in July.',
  },
  {
    id: 'id-silver-creek',
    name: 'Silver Creek',
    states: ['ID'],
    type: 'freestone',
    bbox: [43.30, -114.20, 43.40, -114.05],
    centroid: { lat: 43.35, lng: -114.13 },
    species: ['Rainbow Trout', 'Brown Trout'],
    hatchTags: ['pmd', 'tricos', 'bwo', 'caddis', 'mahogany-dun'],
    accessNotes:
      'Hemingway\'s home water. Spring-creek slow water + selective wild browns + rainbows. The Nature Conservancy reach is the famous one.',
  },

  // ---------- Salmon / Selway / Lochsa system -----------------------
  {
    id: 'id-salmon-river',
    name: 'Salmon River',
    aliases: ['River of No Return'],
    states: ['ID'],
    type: 'freestone',
    bbox: [44.65, -116.50, 45.50, -113.55],
    centroid: { lat: 45.10, lng: -115.00 },
    dataProviders: {
      weather: { kind: 'open-meteo' },
      flow: { kind: 'usgs', siteId: '13302500' },
    },
    species: ['Steelhead', 'Chinook Salmon', 'Rainbow Trout', 'Cutthroat Trout', 'Smallmouth Bass'],
    accessNotes:
      "Longest undammed river in the contiguous US. Anadromous steelhead + salmon (catch-and-release for native fish). Smallmouth in lower river.",
  },
  {
    id: 'id-lochsa-river',
    name: 'Lochsa River',
    states: ['ID'],
    type: 'freestone',
    bbox: [46.10, -115.30, 46.60, -114.45],
    centroid: { lat: 46.35, lng: -114.87 },
    species: ['Cutthroat Trout', 'Steelhead', 'Bull Trout'],
    accessNotes:
      'Clearwater NF wilderness river. Native westslope cutthroat. Catch-and-release only.',
  },
  {
    id: 'id-selway-river',
    name: 'Selway River',
    states: ['ID'],
    type: 'freestone',
    bbox: [45.85, -115.45, 46.20, -114.55],
    centroid: { lat: 46.00, lng: -114.95 },
    species: ['Cutthroat Trout', 'Steelhead', 'Bull Trout'],
    accessNotes:
      "Wild + Scenic in Selway-Bitterroot Wilderness. Permit-only float trip (lottery). Native cutthroat + steelhead.",
  },
  {
    id: 'id-st-joe-river',
    name: 'St. Joe River',
    aliases: ['St Joe', 'Saint Joe'],
    states: ['ID'],
    type: 'freestone',
    bbox: [47.05, -116.10, 47.35, -115.00],
    centroid: { lat: 47.20, lng: -115.55 },
    species: ['Westslope Cutthroat Trout', 'Rainbow Trout', 'Bull Trout'],
    hatchTags: ['salmonfly', 'pmd', 'caddis', 'march-brown'],
    accessNotes:
      "Highest-elevation navigable river in the world. Catch-and-release upper section. Native westslope cutthroat fishery — the best in the lower 48.",
  },

  // ---------- Panhandle lakes ---------------------------------------
  {
    id: 'id-lake-pend-oreille',
    name: 'Lake Pend Oreille',
    states: ['ID'],
    type: 'lake',
    bbox: [47.85, -116.85, 48.30, -116.20],
    centroid: { lat: 48.05, lng: -116.55 },
    surfaceAreaAcres: 94_900,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Lake Trout', 'Kokanee Salmon', 'Rainbow Trout', 'Smallmouth Bass', 'Bull Trout', 'Lake Whitefish'],
    accessNotes:
      "Deepest lake in ID (1,150 ft). Trophy lake trout + kokanee. Sandpoint base. Naval submarine acoustic-testing station — true 'big water'.",
  },
  {
    id: 'id-coeur-dalene-lake',
    name: "Coeur d'Alene Lake",
    aliases: ['CDA Lake'],
    states: ['ID'],
    type: 'lake',
    bbox: [47.40, -117.00, 47.80, -116.65],
    centroid: { lat: 47.60, lng: -116.82 },
    surfaceAreaAcres: 31_000,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Chinook Salmon', 'Northern Pike', 'Smallmouth Bass', 'Largemouth Bass', 'Cutthroat Trout', 'Kokanee Salmon'],
    accessNotes:
      'CDA. Trophy chain pike fishery. Kokanee + chinook. Heavy summer boating; fish early.',
  },
  {
    id: 'id-priest-lake',
    name: 'Priest Lake',
    states: ['ID'],
    type: 'lake',
    bbox: [48.50, -116.95, 48.70, -116.80],
    centroid: { lat: 48.60, lng: -116.87 },
    surfaceAreaAcres: 23_350,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Lake Trout', 'Cutthroat Trout', 'Bull Trout', 'Kokanee Salmon'],
    accessNotes:
      'Deep clear lake. Native cutthroat + bull trout (C&R). Mackinaw stocking. Remote feel — far north panhandle.',
  },

  // ---------- Reservoirs --------------------------------------------
  {
    id: 'id-american-falls-reservoir',
    name: 'American Falls Reservoir',
    states: ['ID'],
    type: 'reservoir',
    bbox: [42.75, -113.05, 42.95, -112.65],
    centroid: { lat: 42.85, lng: -112.85 },
    surfaceAreaAcres: 56_000,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Rainbow Trout', 'Yellow Perch', 'Walleye', 'Cutthroat Trout', 'Smallmouth Bass'],
    accessNotes:
      "Snake River impoundment. ID's second-largest reservoir. Trophy trout + walleye fishery.",
  },
  {
    id: 'id-palisades-reservoir',
    name: 'Palisades Reservoir',
    states: ['ID', 'WY'],
    type: 'reservoir',
    bbox: [43.20, -111.45, 43.50, -111.05],
    centroid: { lat: 43.35, lng: -111.25 },
    surfaceAreaAcres: 16_100,
    dataProviders: {
      weather: { kind: 'open-meteo' },
      lakeData: { kind: 'estimated' },
    },
    species: ['Cutthroat Trout', 'Lake Trout', 'Brown Trout', 'Kokanee Salmon'],
    accessNotes:
      'Snake River impoundment. Cutthroat + lake trout. Above the South Fork Snake tailwater.',
  },
];
