// One-shot: retrofit hatch-data patterns into existing TN tailwater entries.
// The TN template's tva-tailwater patterns were enriched with full hatch calendar
// (Sulphur, BWO, Caddis, White Fly, Trico, Cicada) — existing entries created with
// the prior template need their patterns updated.

const fs = require('fs');
const path = require('path');
const { buildTN } = require('./_tn-water-template.cjs');

const DATA_PATH = path.join(__dirname, '..', 'data', 'waterbodies.json');

// Hand-curated TN entries that have their own custom patterns — DO NOT overwrite.
// These were written by hand in the original TN seed and have intentional content.
const HAND_CURATED_PROTECT = new Set([
  'tn-river-south-holston',
  'tn-river-watauga',
  'tn-river-clinch',
  'tn-river-caney-fork',
  'tn-river-hiwassee',
  'tn-river-holston',
  'tn-river-elk',
  'tn-river-obey',
]);

function main() {
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  const existing = JSON.parse(raw);

  let updated = 0;
  for (const entry of existing) {
    if (entry.state !== 'TN') continue;
    if (entry.type !== 'tailwater') continue;
    if (HAND_CURATED_PROTECT.has(entry.id)) continue;

    // Rebuild using current template — gets the new hatch-rich patterns.
    const rebuilt = buildTN({
      id: entry.id,
      name: entry.name,
      region: entry.region,
      county: entry.county,
      acres: entry.acres,
      maxDepthFt: entry.maxDepthFt,
      lat: entry.lat,
      lng: entry.lng,
      cat: 'tva-tailwater',
      notes: entry.notes,
    });
    // Apply only the patterns (preserve any other manual edits to species/access/etc)
    entry.patterns = rebuilt.patterns;
    updated++;
  }

  fs.writeFileSync(DATA_PATH, JSON.stringify(existing, null, 2) + '\n', 'utf8');
  console.log(`Updated ${updated} TN tailwater entries with full hatch-data patterns.`);
}

main();
