/**
 * Audit + auto-patch every `lakeData: { kind: 'estimated' }` waterbody
 * entry by:
 *   1) Parsing each state file to extract (id, centroid) pairs for
 *      entries that use the "estimated" fallback.
 *   2) Asking USGS NWIS for nearby Lake-type sites with water-temp /
 *      elevation parameters within a radius around the centroid.
 *   3) Picking the closest qualifying station.
 *   4) Rewriting `kind: 'estimated'` -> `kind: 'usgs-lake', siteId: 'X'`
 *      in place. Leaves an estimated fallback if NO station is found.
 *
 * USGS Site Service (no key required):
 *   https://waterservices.usgs.gov/nwis/site/?format=rdb&bBox=W,S,E,N
 *     &siteType=LK&parameterCd=00010,00065&hasDataTypeCd=iv
 *
 *   parameterCd values:
 *     00010 — water temperature (the prize)
 *     00065 — gauge height
 *     00062 — reservoir storage elevation
 *
 * Idempotent — only patches entries still using the 'estimated' kind.
 */

const fs = require('node:fs');
const path = require('node:path');
const https = require('node:https');

const DATA_DIR = path.join(__dirname, '..', 'src', 'lib', 'waterbodies', 'data');

// Radius in degrees lat/lng for the USGS bbox search around each centroid.
// At mid-US latitudes 0.20° lat × 0.30° lng ≈ ~14×18 mi box. Plenty to
// catch any on-lake gauge while staying tight enough that a different
// nearby lake's gauge doesn't accidentally win.
const SEARCH_LAT_DEG = 0.20;
const SEARCH_LNG_DEG = 0.30;

// Max miles between centroid and chosen station. Anything farther we
// consider not-actually-on-this-lake and keep the estimated fallback.
const MAX_MILES = 15;

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': 'dadapp/1.0' } }, (res) => {
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        }
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve(body));
      })
      .on('error', reject);
  });
}

function haversineMiles(a, b) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

async function findNearestLakeStation(centroid) {
  const south = centroid.lat - SEARCH_LAT_DEG;
  const north = centroid.lat + SEARCH_LAT_DEG;
  const west = centroid.lng - SEARCH_LNG_DEG;
  const east = centroid.lng + SEARCH_LNG_DEG;
  const url =
    `https://waterservices.usgs.gov/nwis/site/?format=rdb` +
    `&bBox=${west.toFixed(4)},${south.toFixed(4)},${east.toFixed(4)},${north.toFixed(4)}` +
    `&siteType=LK&parameterCd=00010,00062,00065&hasDataTypeCd=iv`;
  let body;
  try {
    body = await fetchUrl(url);
  } catch (e) {
    return { siteId: null, error: e.message };
  }
  const lines = body.split('\n').filter((l) => l && !l.startsWith('#'));
  // Skip the two header rows (column names + format spec)
  const data = lines.slice(2);
  const candidates = [];
  for (const l of data) {
    const parts = l.split('\t');
    if (parts.length < 6) continue;
    const siteNo = parts[1];
    const name = parts[2];
    const lat = parseFloat(parts[4]);
    const lng = parseFloat(parts[5]);
    if (!siteNo || isNaN(lat) || isNaN(lng)) continue;
    const miles = haversineMiles({ lat, lng }, centroid);
    if (miles > MAX_MILES) continue;
    candidates.push({ siteId: siteNo, name, lat, lng, miles });
  }
  candidates.sort((a, b) => a.miles - b.miles);
  return { siteId: candidates[0]?.siteId ?? null, candidates };
}

function parseStateFile(filePath) {
  const src = fs.readFileSync(filePath, 'utf8');
  // Find every entry that uses the `estimated` lakeData fallback,
  // and pull the nearby id + centroid.
  //
  // The entries we care about look like:
  //   {
  //     id: 'xx-foo',
  //     ...
  //     centroid: { lat: 12.34, lng: -56.78 },
  //     ...
  //     dataProviders: {
  //       ...
  //       lakeData: { kind: 'estimated' },
  //     },
  //     ...
  //   }
  //
  // For each match we record id + centroid + the exact `lakeData` line
  // span so the rewrite is surgical.
  const entries = [];
  const idRe = /id:\s*'([^']+)'/g;
  let idMatch;
  while ((idMatch = idRe.exec(src)) !== null) {
    // For each entry, find the entry's closing brace
    // by walking from idMatch.index forward.
    const startIdx = idMatch.index;
    let depth = 0;
    let foundOpen = false;
    let endIdx = -1;
    // Walk backward to find the opening brace of the object literal
    let objStart = startIdx;
    for (let i = startIdx; i >= 0; i--) {
      if (src[i] === '{') {
        objStart = i;
        break;
      }
    }
    // Walk forward to find matching close brace
    for (let i = objStart; i < src.length; i++) {
      if (src[i] === '{') {
        depth++;
        foundOpen = true;
      } else if (src[i] === '}') {
        depth--;
        if (foundOpen && depth === 0) {
          endIdx = i + 1;
          break;
        }
      }
    }
    if (endIdx === -1) continue;
    const block = src.slice(objStart, endIdx);

    // Only process entries that currently use 'estimated'
    if (!/lakeData:\s*\{\s*kind:\s*'estimated'\s*\}/.test(block)) continue;

    const id = idMatch[1];
    const centroidMatch = block.match(
      /centroid:\s*\{\s*lat:\s*([-\d.]+)\s*,\s*lng:\s*([-\d.]+)\s*\}/
    );
    if (!centroidMatch) continue;
    const lat = parseFloat(centroidMatch[1]);
    const lng = parseFloat(centroidMatch[2]);

    entries.push({
      id,
      centroid: { lat, lng },
      blockStart: objStart,
      blockEnd: endIdx,
    });
  }
  // Deduplicate (the id regex matches every id; we get the same entry
  // multiple times because we walk back to the opening brace from each).
  const seen = new Set();
  return entries.filter((e) => {
    if (seen.has(e.id)) return false;
    seen.add(e.id);
    return true;
  });
}

function rewriteEntry(src, blockStart, blockEnd, siteId) {
  const block = src.slice(blockStart, blockEnd);
  const replaced = block.replace(
    /lakeData:\s*\{\s*kind:\s*'estimated'\s*\}/,
    `lakeData: { kind: 'usgs-lake', siteId: '${siteId}' }`
  );
  return src.slice(0, blockStart) + replaced + src.slice(blockEnd);
}

async function processFile(filePath) {
  const fileName = path.basename(filePath);
  console.log(`\n=== ${fileName} ===`);
  let entries = parseStateFile(filePath);
  if (entries.length === 0) {
    console.log('  (no estimated entries — already clean)');
    return { patched: 0, total: 0, leftEstimated: [] };
  }
  console.log(`  ${entries.length} entries to audit`);
  let src = fs.readFileSync(filePath, 'utf8');
  let patched = 0;
  const leftEstimated = [];

  // We rewrite in-place but the block offsets shift as we modify.
  // Strategy: re-parse after each rewrite so offsets stay accurate.
  for (let i = 0; i < entries.length; i++) {
    // Re-parse to refresh offsets after previous rewrites
    const fresh = parseStateFile(filePath);
    const e = fresh.find((x) => x.id === entries[i].id);
    if (!e) continue; // already patched

    const result = await findNearestLakeStation(e.centroid);
    if (!result.siteId) {
      console.log(`  ${e.id}: no nearby USGS lake station within ${MAX_MILES}mi (keeping estimated)`);
      leftEstimated.push(e.id);
      continue;
    }
    const c = result.candidates[0];
    console.log(`  ${e.id}: ${c.siteId} "${c.name}" (${c.miles.toFixed(1)} mi)`);
    src = rewriteEntry(src, e.blockStart, e.blockEnd, c.siteId);
    fs.writeFileSync(filePath, src, 'utf8');
    patched++;
  }
  return { patched, total: entries.length, leftEstimated };
}

async function main() {
  const files = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith('.ts') && f !== 'index.ts' && f !== 'greatLakes.ts')
    .map((f) => path.join(DATA_DIR, f));

  const summary = { totalAudited: 0, totalPatched: 0, leftByFile: {} };
  for (const f of files) {
    const r = await processFile(f);
    summary.totalAudited += r.total;
    summary.totalPatched += r.patched;
    if (r.leftEstimated.length) summary.leftByFile[path.basename(f)] = r.leftEstimated;
  }
  console.log('\n=== SUMMARY ===');
  console.log(`Audited: ${summary.totalAudited}, patched: ${summary.totalPatched}`);
  if (Object.keys(summary.leftByFile).length > 0) {
    console.log('\nLeft as estimated (no USGS station found within ' + MAX_MILES + ' mi):');
    for (const [f, ids] of Object.entries(summary.leftByFile)) {
      console.log(`  ${f}: ${ids.join(', ')}`);
    }
  }
}

main().catch((e) => {
  console.error('FATAL', e);
  process.exit(1);
});
