/**
 * Pass 2 — try to bind real USGS stations to reservoirs the first
 * pass left as 'estimated'. The first pass filtered to siteType=LK,
 * but USGS classifies most TVA / USACE dam outflow gauges as ST
 * (stream type at the dam). Those gauges DO publish reservoir
 * elevation (parameter 00062) and gauge height (00065), and their
 * station name typically contains the lake/reservoir name.
 *
 * This pass:
 *   1) Parses each state file for entries STILL using 'estimated'.
 *   2) For each, queries USGS without siteType filter using
 *      hasDataTypeCd=iv + parameterCd=00062 (reservoir storage
 *      elevation). 00062 only exists on lake/reservoir monitors,
 *      not on plain stream gauges — so this works as a content-based
 *      filter even when USGS taxonomy disagrees.
 *   3) Falls back to name-matching against the waterbody's main name
 *      (e.g. "Lake Tims Ford" / "Norris Lake") for stations near the
 *      centroid that don't carry 00062 but are obviously on-lake.
 */

const fs = require('node:fs');
const path = require('node:path');
const https = require('node:https');

const DATA_DIR = path.join(__dirname, '..', 'src', 'lib', 'waterbodies', 'data');

const SEARCH_LAT_DEG = 0.25;
const SEARCH_LNG_DEG = 0.35;
const MAX_MILES = 18;

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': 'dadapp/1.0' } }, (res) => {
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error(`HTTP ${res.statusCode}`));
        }
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve(body));
      })
      .on('error', reject);
  });
}

function hav(a, b) {
  const r = (x) => (x * Math.PI) / 180;
  const R = 3958.8;
  const dLat = r(b.lat - a.lat);
  const dLng = r(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function nameTokens(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(
      (t) =>
        t.length >= 4 &&
        !['lake', 'reservoir', 'pond', 'creek', 'river', 'fork', 'branch', 'station', 'site'].includes(t)
    );
}

async function findOnLakeStation(centroid, waterName) {
  const south = centroid.lat - SEARCH_LAT_DEG;
  const north = centroid.lat + SEARCH_LAT_DEG;
  const west = centroid.lng - SEARCH_LNG_DEG;
  const east = centroid.lng + SEARCH_LNG_DEG;
  // Pass 2a — parameter 00062 (reservoir storage elevation) — only
  // exists on lake/reservoir gauges. Most reliable signal of "actually
  // on a lake".
  const url1 =
    `https://waterservices.usgs.gov/nwis/site/?format=rdb` +
    `&bBox=${west.toFixed(4)},${south.toFixed(4)},${east.toFixed(4)},${north.toFixed(4)}` +
    `&parameterCd=00062&hasDataTypeCd=iv`;
  // Pass 2b — also try stations with 00065 (gauge height) that contain
  // the waterbody's distinguishing token in their name.
  const url2 =
    `https://waterservices.usgs.gov/nwis/site/?format=rdb` +
    `&bBox=${west.toFixed(4)},${south.toFixed(4)},${east.toFixed(4)},${north.toFixed(4)}` +
    `&parameterCd=00065&hasDataTypeCd=iv`;

  const tokens = nameTokens(waterName);
  const out = [];
  for (const url of [url1, url2]) {
    let body;
    try {
      body = await fetchUrl(url);
    } catch (_) {
      continue;
    }
    const lines = body.split('\n').filter((l) => l && !l.startsWith('#'));
    const data = lines.slice(2);
    for (const l of data) {
      const parts = l.split('\t');
      if (parts.length < 6) continue;
      const siteNo = parts[1];
      const name = parts[2];
      const lat = parseFloat(parts[4]);
      const lng = parseFloat(parts[5]);
      if (!siteNo || isNaN(lat) || isNaN(lng)) continue;
      const miles = hav({ lat, lng }, centroid);
      if (miles > MAX_MILES) continue;
      // For url2 (gauge height), require token overlap with the
      // waterbody name to avoid binding a random stream gauge.
      const isHeightOnly = url === url2;
      if (isHeightOnly) {
        const lowName = name.toLowerCase();
        const hit = tokens.some((t) => lowName.includes(t));
        if (!hit) continue;
      }
      out.push({ siteId: siteNo, name, lat, lng, miles, isHeightOnly });
    }
  }
  // Prefer 00062-providing stations; tiebreak on distance
  out.sort((a, b) => {
    if (a.isHeightOnly !== b.isHeightOnly) return a.isHeightOnly ? 1 : -1;
    return a.miles - b.miles;
  });
  return { candidates: out, best: out[0] ?? null };
}

function parseFile(filePath) {
  const src = fs.readFileSync(filePath, 'utf8');
  const entries = [];
  const idRe = /id:\s*'([^']+)'/g;
  let m;
  const seen = new Set();
  while ((m = idRe.exec(src)) !== null) {
    const id = m[1];
    if (seen.has(id)) continue;
    seen.add(id);
    // Walk back to find object opener
    let objStart = m.index;
    for (let i = m.index; i >= 0; i--) {
      if (src[i] === '{') {
        objStart = i;
        break;
      }
    }
    // Walk forward
    let depth = 0;
    let endIdx = -1;
    for (let i = objStart; i < src.length; i++) {
      if (src[i] === '{') depth++;
      else if (src[i] === '}') {
        depth--;
        if (depth === 0) {
          endIdx = i + 1;
          break;
        }
      }
    }
    if (endIdx === -1) continue;
    const block = src.slice(objStart, endIdx);
    if (!/lakeData:\s*\{\s*kind:\s*'estimated'\s*\}/.test(block)) continue;
    const cm = block.match(/centroid:\s*\{\s*lat:\s*([-\d.]+)\s*,\s*lng:\s*([-\d.]+)\s*\}/);
    const nm = block.match(/name:\s*'([^']+)'/);
    if (!cm || !nm) continue;
    entries.push({
      id,
      name: nm[1],
      centroid: { lat: parseFloat(cm[1]), lng: parseFloat(cm[2]) },
      blockStart: objStart,
      blockEnd: endIdx,
    });
  }
  return entries;
}

function rewrite(src, blockStart, blockEnd, siteId) {
  const block = src.slice(blockStart, blockEnd);
  const out = block.replace(
    /lakeData:\s*\{\s*kind:\s*'estimated'\s*\}/,
    `lakeData: { kind: 'usgs-lake', siteId: '${siteId}' }`
  );
  return src.slice(0, blockStart) + out + src.slice(blockEnd);
}

async function processFile(filePath) {
  const name = path.basename(filePath);
  console.log(`\n=== ${name} ===`);
  let entries = parseFile(filePath);
  if (entries.length === 0) {
    console.log('  (clean)');
    return { patched: 0, total: 0 };
  }
  console.log(`  ${entries.length} estimated entries to audit (pass 2)`);
  let src = fs.readFileSync(filePath, 'utf8');
  let patched = 0;
  for (let i = 0; i < entries.length; i++) {
    const fresh = parseFile(filePath);
    const e = fresh.find((x) => x.id === entries[i].id);
    if (!e) continue;
    const r = await findOnLakeStation(e.centroid, e.name);
    if (!r.best) {
      console.log(`  ${e.id}: nothing on-lake within ${MAX_MILES}mi`);
      continue;
    }
    const c = r.best;
    console.log(`  ${e.id}: ${c.siteId} "${c.name}" (${c.miles.toFixed(1)}mi)${c.isHeightOnly ? ' [name-match]' : ' [reservoir-elev]'}`);
    src = rewrite(src, e.blockStart, e.blockEnd, c.siteId);
    fs.writeFileSync(filePath, src, 'utf8');
    patched++;
  }
  return { patched, total: entries.length };
}

async function main() {
  const files = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith('.ts') && f !== 'index.ts' && f !== 'greatLakes.ts')
    .map((f) => path.join(DATA_DIR, f));

  let totalPatched = 0;
  let totalAudited = 0;
  for (const f of files) {
    const r = await processFile(f);
    totalAudited += r.total;
    totalPatched += r.patched;
  }
  console.log(`\n=== Pass 2 SUMMARY ===`);
  console.log(`Audited: ${totalAudited}, patched: ${totalPatched}`);
}

main().catch((e) => {
  console.error('FATAL', e);
  process.exit(1);
});
