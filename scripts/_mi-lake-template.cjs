/**
 * Template engine for generating Michigan inland-lake Waterbody
 * entries from compact metadata. Used by the batch scripts that
 * add 100-200 MI inland lakes at a time toward the goal of 1000
 * total MI waterbodies in the Waters Guide.
 *
 * The trade-off vs the marquee waters (Higgins, Lake St. Clair,
 * Big Manistee, etc.) is depth: marquee waters get hand-curated
 * patterns from the regional fishery's character; filler lakes
 * get a "standard MI fishery for this lake type" treatment. The
 * Waters Guide still surfaces them under the user's state filter
 * and matches them to spots — they're just less specific.
 *
 * Categories drive the species mix + the canned patterns:
 *   - shallow-warmwater: <30 ft, weedy, southern LP suburban
 *   - mixed: 30-60 ft, multi-species
 *   - deep-clear: >60 ft, smallmouth + lake-trout-eligible
 *   - reservoir: impoundment with timber + dam character
 *   - small-pond: <50 acres, bluegill-led
 *
 * Import this helper from a batch script:
 *
 *   const { buildLake } = require('./_mi-lake-template');
 *   const NEW_ENTRIES = LAKES.map((l) => buildLake(l));
 */

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Generate a Waterbody entry from compact metadata.
 *
 *   buildLake({
 *     name: 'Lake Foo',
 *     county: 'Oakland',
 *     acres: 350,
 *     maxDepthFt: 45,
 *     category: 'mixed',
 *     region: 'SE Michigan inland lakes',
 *     lat: 42.5,                  // optional
 *     lng: -83.2,                 // optional
 *     extraSpecies: ['Walleye'],  // optional — add to default species mix
 *     idSuffix: 'oakland'         // optional — disambiguator for duplicate lake names
 *   })
 */
function buildLake(record) {
  const {
    name,
    county,
    acres,
    maxDepthFt,
    category = 'mixed',
    region,
    lat,
    lng,
    extraSpecies = [],
    idSuffix,
    notes,
  } = record;

  const baseId = `mi-${slugify(name)}${idSuffix ? '-' + slugify(idSuffix) : ''}`;
  const id = baseId.startsWith('mi-mi-') ? baseId.slice(3) : baseId;

  const species = buildSpeciesForCategory(category, extraSpecies);
  const patterns = buildPatternsForCategory(category, name);
  const signature = computeSignature(species);

  return {
    id,
    name,
    state: 'MI',
    region,
    type: inferType(category),
    county,
    ...(acres != null ? { acres } : {}),
    ...(maxDepthFt != null ? { maxDepthFt } : {}),
    ...(lat != null ? { lat } : {}),
    ...(lng != null ? { lng } : {}),
    signatureSpecies: signature,
    species,
    patterns,
    notes:
      notes ??
      `${county} County natural-lake fishery — standard MI inland-lake species mix. Full Waters Guide picks up specific patterns when a saved spot matches this entry.`,
  };
}

function inferType(category) {
  if (category === 'reservoir') return 'reservoir';
  if (category === 'small-pond') return 'pond';
  if (category === 'river') return 'river';
  return 'natural-lake';
}

function computeSignature(species) {
  return species
    .filter((s) => s.importance === 'signature')
    .map((s) => s.name)
    .join(', ');
}

function buildSpeciesForCategory(category, extras) {
  // Each category returns its canonical MI species mix. `extras` get
  // upgraded to "strong" if not already mentioned. Patterns reference
  // these names via the matcher.
  const base = (() => {
    switch (category) {
      case 'shallow-warmwater':
        return [
          { name: 'Largemouth bass', importance: 'signature', size: '2-4 lb' },
          { name: 'Bluegill', importance: 'signature', size: '7-9 in' },
          { name: 'Black crappie', importance: 'strong', size: '9-12 in' },
          { name: 'Northern pike', importance: 'strong', size: '5-12 lb' },
          { name: 'Yellow perch', importance: 'good', size: '7-10 in' },
        ];
      case 'mixed':
        return [
          { name: 'Largemouth bass', importance: 'signature', size: '2-4 lb' },
          { name: 'Bluegill', importance: 'signature', size: '7-9 in' },
          { name: 'Smallmouth bass', importance: 'strong', size: '2-3 lb' },
          { name: 'Black crappie', importance: 'strong', size: '9-12 in' },
          { name: 'Northern pike', importance: 'strong', size: '5-12 lb' },
          { name: 'Yellow perch', importance: 'good', size: '7-10 in' },
        ];
      case 'deep-clear':
        return [
          { name: 'Smallmouth bass', importance: 'signature', size: '2-4 lb' },
          { name: 'Largemouth bass', importance: 'strong', size: '2-4 lb' },
          { name: 'Walleye', importance: 'strong', size: '14-20 in' },
          { name: 'Yellow perch', importance: 'strong', size: '8-12 in' },
          { name: 'Bluegill', importance: 'strong', size: '7-9 in' },
          { name: 'Northern pike', importance: 'good', size: '5-15 lb' },
        ];
      case 'reservoir':
        return [
          { name: 'Largemouth bass', importance: 'signature', size: '2-5 lb' },
          { name: 'Bluegill', importance: 'strong', size: '7-9 in' },
          { name: 'Black crappie', importance: 'strong', size: '9-12 in' },
          { name: 'Channel catfish', importance: 'strong', size: '3-10 lb' },
          { name: 'Northern pike', importance: 'good' },
        ];
      case 'small-pond':
        return [
          { name: 'Largemouth bass', importance: 'signature', size: '1-3 lb' },
          { name: 'Bluegill', importance: 'signature', size: '6-8 in' },
          { name: 'Black crappie', importance: 'good' },
        ];
      default:
        return [
          { name: 'Largemouth bass', importance: 'signature' },
          { name: 'Bluegill', importance: 'strong' },
        ];
    }
  })();

  // Merge extras that aren't already in the mix at "strong" importance.
  const existing = new Set(base.map((s) => s.name.toLowerCase()));
  for (const extra of extras) {
    if (!existing.has(extra.toLowerCase())) {
      base.push({ name: extra, importance: 'strong' });
    }
  }
  return base;
}

function buildPatternsForCategory(category, lakeName) {
  // Canned patterns for each category. They reference the lake by
  // name in the `where` so the user sees waterbody-specific framing
  // when the Conditions card surfaces these.
  switch (category) {
    case 'shallow-warmwater':
      return [
        {
          title: 'Pad-edge + dock-corner largemouth',
          target: 'Largemouth bass',
          when: 'May-September',
          technique: 'Senko + Texas-rigged worm, hollow-body frog over pads, swim jig on outside edges; spinnerbait through wood',
          where: `Pad fields + cabbage edges + dock concentrations around ${lakeName}`,
          details: 'Standard MI shallow-warmwater bass tactic. Frog at first light + last light; jig + worm midday under cover.',
        },
        {
          title: 'Bluegill + panfish on the shoreline',
          target: 'Bluegill + crappie',
          when: 'May-July spawn, year-round otherwise',
          technique: 'Wax worm under bobber; 1/64 oz jig + small minnow for crappie',
          where: 'Sand-bottom shoreline pockets + spawning beds; brush in 4-8 ft for crappie',
        },
      ];
    case 'mixed':
      return [
        {
          title: 'Cabbage-edge multi-species',
          target: 'Largemouth + smallmouth + pike',
          when: 'May-October',
          technique: 'Senko, jerkbait, in-line spinner; tubes + Ned for smallmouth on deeper rocky transitions',
          where: `Cabbage + coontail edges + transitions to deeper structure on ${lakeName}`,
          details: 'Mixed-depth MI lake pattern — bass on weed edges, smallmouth on the rock transitions, pike patrolling the outside.',
        },
        {
          title: 'Spring crappie spawn',
          target: 'Black crappie',
          when: 'April-May',
          technique: 'Jig + minnow under bobber',
          where: 'Brush + dock pilings in 4-8 ft spawning coves',
        },
      ];
    case 'deep-clear':
      return [
        {
          title: 'Drop-shot summer smallmouth',
          target: 'Smallmouth bass',
          when: 'June-October',
          technique: 'Drop-shot 4-in finesse worm; Ned rig; tubes; light fluoro 6-8 lb',
          where: `Deep clear-water humps + rocky points on ${lakeName}, 18-30 ft`,
          details: 'Classic MI deep-clear-lake smallmouth approach. Clear water = light tippet + finesse presentations.',
        },
        {
          title: 'Walleye on cabbage edges + main-lake structure',
          target: 'Walleye',
          when: 'May-October',
          technique: 'Crawler harness + bottom bouncer; jig + minnow at dusk',
          where: 'Cabbage edges 10-18 ft; deep main-lake points',
        },
      ];
    case 'reservoir':
      return [
        {
          title: 'Flooded-timber + structure largemouth',
          target: 'Largemouth bass',
          when: 'May-October',
          technique: 'Flipping creature bait, weighted senko, swim jig through standing timber',
          where: `Flooded timber + standing structure throughout ${lakeName}`,
        },
      ];
    case 'small-pond':
      return [
        {
          title: 'Shoreline bass + bluegill',
          target: 'Largemouth + bluegill',
          when: 'May-September',
          technique: 'Senko, spinnerbait, popping bug for bass; wax worm + bobber for bluegill',
          where: `Shoreline structure + dock corners on ${lakeName}`,
        },
      ];
    default:
      return [];
  }
}

module.exports = { buildLake, slugify };
