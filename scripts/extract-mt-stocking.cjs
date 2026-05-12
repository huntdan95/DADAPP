/**
 * Pull Montana FWP stocking data via the FishMT internal JSON endpoint.
 *
 * Found at `/fishMT/plants/plantsearchgrid?year=YYYY` — returns the
 * full DataTables-formatted year of stocking events including:
 *   - hpDatePlanted: "May 5, 2026"
 *   - hpNumFish, hpFishSize
 *   - waterName, fslName (species), hssStrainName, hhName (hatchery)
 *
 * Earlier seed file had 5 hand-picked records from news releases —
 * this replaces it with the actual 900+ events MT FWP publishes.
 *
 * Output: data/seed/mt-raw.json
 */

const fs = require('node:fs');
const path = require('node:path');

const OUT_PATH = path.join(__dirname, '..', 'data', 'seed', 'mt-raw.json');
const YEAR = 2026;

function isoDate(s) {
  const d = new Date(s);
  if (!Number.isFinite(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

(async () => {
  const url = `https://myfwp.mt.gov/fishMT/plants/plantsearchgrid?year=${YEAR}`;
  console.log(`Fetching ${url}`);
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 Chrome/124.0.0.0 Safari/537.36',
      Accept: 'application/json,*/*',
    },
  });
  const json = await res.json();
  const data = json.data || [];
  console.log(`API returned ${data.length} records (recordsTotal=${json.recordsTotal})`);

  const out = [];
  for (const row of data) {
    const date = isoDate(row.hpDatePlanted);
    if (!date) continue;
    const water = row.waterName;
    if (!water) continue;
    const speciesRaw = row.fslName || 'Unknown';
    out.push({
      date,
      water,
      species: speciesRaw,
      count:
        typeof row.hpNumFish === 'number' && Number.isFinite(row.hpNumFish)
          ? row.hpNumFish
          : undefined,
      size:
        row.hpFishSize != null && row.hpFishSize !== ''
          ? `${row.hpFishSize}"`
          : undefined,
      hatchery: row.hhName,
      strain: row.hssStrainName,
      region: row.hpPlantRegion ? `Region ${row.hpPlantRegion}` : undefined,
      streamOrLake: row.fwbStreamLakeInd === 'L' ? 'lake' : 'stream',
    });
  }

  console.log(`Normalized: ${out.length} records`);
  const bySpecies = {};
  for (const r of out) bySpecies[r.species] = (bySpecies[r.species] || 0) + 1;
  console.log('Species:', bySpecies);
  console.log('Distinct waters:', new Set(out.map((r) => r.water)).size);
  // Date range
  const dates = out.map((r) => r.date).sort();
  console.log(`Date range: ${dates[0]} to ${dates[dates.length - 1]}`);

  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));
  console.log(`Wrote ${OUT_PATH}`);
})().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});
