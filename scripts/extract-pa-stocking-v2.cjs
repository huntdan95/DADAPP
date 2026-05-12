/**
 * V2: parse PA PFBC PDF using pdfjs-dist for positional info.
 *
 * The earlier text-only extraction lost which species columns the X's
 * belonged to (empty cells collapsed in the extracted text). pdfjs-dist
 * gives us each text item with its x-coordinate, so we can determine
 * exactly which of the 4 species columns (BRK, BRO, RB, GD) each X is
 * sitting in based on its horizontal position.
 *
 * Approach:
 *   1. Render each page's text items with x,y coords.
 *   2. Bucket items by y (row).
 *   3. For each row, identify the date item; once found, look at the
 *      next 4 species columns by x-coordinate (we calibrate the column
 *      x-positions from the header row).
 *   4. Determine X presence per column → emit one record per (water,
 *      date, species).
 *
 * Output: data/seed/pa-raw.json
 */

const fs = require('node:fs');
const path = require('node:path');

const PDF_PATH = 'C:/Users/Danny/.claude/projects/C--Danny-DADAPP/06b1695b-2693-4629-a699-fd954e77387b/tool-results/webfetch-1778544510774-18lzbw.pdf';
const OUT_PATH = path.join(__dirname, '..', 'data', 'seed', 'pa-raw.json');

// Tolerance: items within Y_TOLERANCE of each other are on the same row.
const Y_TOLERANCE = 3;

function parseDate(s) {
  const m = String(s).match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (!m) return null;
  const [, mo, d, y] = m;
  return `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

(async () => {
  // pdfjs-dist v5 is ESM-only; use dynamic import.
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  // Point workerSrc at a file:// URL so the loader can resolve it on
  // Windows. Without this pdfjs tries to fetch from the original
  // c:\... path which the ESM loader rejects.
  const { pathToFileURL } = require('node:url');
  const workerPath = require.resolve('pdfjs-dist/legacy/build/pdf.worker.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).href;

  const buf = fs.readFileSync(PDF_PATH);
  const doc = await pdfjs.getDocument({ data: new Uint8Array(buf) }).promise;
  console.log(`Loaded PDF, ${doc.numPages} pages`);

  // Calibrate column x-positions from page 2 (first real data page).
  // We expect: County | Water | Sec | Stocking Date | BRK | BRO | RB | GD | Meeting Place | ...
  // We'll detect them by finding the literal "BRK", "BRO", "RB", "GD"
  // header strings.
  let columnXs = null;

  const records = [];
  let lastCounty = null;
  let lastWater = null;
  let lastSec = null;

  for (let pageNo = 2; pageNo <= doc.numPages; pageNo++) {
    const page = await doc.getPage(pageNo);
    const content = await page.getTextContent();
    // PA PDF is rotated landscape — what pdfjs reports as transform[4]
    // is the page-vertical position (row), and transform[5] is the
    // page-horizontal position (column). Swap them so the rest of
    // this code can use "x" for column and "y" for row naturally.
    const items = content.items.map((it) => ({
      str: it.str.trim(),
      x: it.transform[5],     // horizontal (column position in landscape view)
      y: it.transform[4],     // vertical (row position in landscape view)
    })).filter((it) => it.str !== '');

    // Bucket by y (rounded to row).
    const rows = new Map();
    for (const it of items) {
      const rowKey = Math.round(it.y);
      // Allow ±Y_TOLERANCE merging
      let bucket = null;
      for (const [k, v] of rows.entries()) {
        if (Math.abs(k - rowKey) <= Y_TOLERANCE) {
          bucket = v;
          break;
        }
      }
      if (!bucket) {
        bucket = [];
        rows.set(rowKey, bucket);
      }
      bucket.push(it);
    }

    // Sort rows top-to-bottom (PDF y is bottom-up, so higher y = higher row)
    const orderedRows = Array.from(rows.entries())
      .sort((a, b) => b[0] - a[0])
      .map(([, v]) => v.sort((a, b) => a.x - b.x));

    // Calibrate column x-positions: find a row with BRK BRO RB GD.
    if (!columnXs) {
      for (const row of orderedRows) {
        const strs = row.map((it) => it.str);
        if (strs.includes('BRK') && strs.includes('BRO') && strs.includes('RB') && strs.includes('GD')) {
          const brk = row.find((it) => it.str === 'BRK');
          const bro = row.find((it) => it.str === 'BRO');
          const rb = row.find((it) => it.str === 'RB');
          const gd = row.find((it) => it.str === 'GD');
          columnXs = {
            brk: brk.x,
            bro: bro.x,
            rb: rb.x,
            gd: gd.x,
          };
          // Tolerance for "this X belongs to column N": half-distance to neighbors
          columnXs.tolerance = (bro.x - brk.x) / 2;
          console.log(`Page ${pageNo}: calibrated column xs:`, columnXs);
          break;
        }
      }
    }
    if (!columnXs) continue;

    // Walk each row, attempting to parse it as a stocking entry.
    for (const row of orderedRows) {
      const strs = row.map((it) => it.str);
      // Skip header / footer rows
      if (strs.includes('County') && strs.includes('Water')) continue;
      if (strs.some((s) => s.startsWith('Pennsylvania Fish'))) continue;
      if (strs.some((s) => s.startsWith('BRK -'))) continue;
      if (strs.some((s) => s.startsWith('Page '))) continue;
      if (strs.some((s) => s.startsWith('Trout'))) continue;

      // Find the date token
      const dateItem = row.find((it) => /\d{1,2}\/\d{1,2}\/\d{4}/.test(it.str));
      if (!dateItem) continue;
      const dateIso = parseDate(dateItem.str);
      if (!dateIso) continue;

      // The county is the leftmost item (smallest x). Water is the
      // next column, Sec is a number after water. Sometimes the first
      // cell is blank (continuation of previous row's county), so fall
      // back to the last seen value.
      const leftItems = row.filter((it) => it.x < dateItem.x - 20);
      // Group items by x-cluster within the left portion to extract
      // county, water, sec.
      let county = null;
      let water = null;
      let sec = null;

      // Heuristic: first item is County, next text item(s) up to a
      // numeric Sec value is Water, then the numeric is Sec.
      // Iterate items left-to-right.
      const leftSorted = leftItems.sort((a, b) => a.x - b.x);
      for (const it of leftSorted) {
        if (county == null) {
          county = it.str;
          continue;
        }
        // Sec is a single-digit number after the water name.
        if (sec == null && /^\d{1,2}$/.test(it.str)) {
          sec = it.str;
          continue;
        }
        // Otherwise, append to water.
        if (sec == null) {
          water = water ? `${water} ${it.str}` : it.str;
        }
      }
      // Fallback to last-seen values for continuation rows.
      county = county || lastCounty;
      water = water || lastWater;
      sec = sec || lastSec;
      if (!county || !water) continue;
      if (!/^[A-Z]/.test(county)) continue;

      // Find species X marks by x-coordinate. Each X is an item whose
      // str is 'X' or 'x' and whose x is within columnXs.tolerance of
      // one of the four column centers.
      const speciesHits = { brk: false, bro: false, rb: false, gd: false };
      for (const it of row) {
        if (it.str !== 'X' && it.str !== 'x') continue;
        for (const sp of ['brk', 'bro', 'rb', 'gd']) {
          if (Math.abs(it.x - columnXs[sp]) <= columnXs.tolerance) {
            speciesHits[sp] = true;
            break;
          }
        }
      }
      const speciesEmitMap = [
        ['brk', 'Brook Trout'],
        ['bro', 'Brown Trout'],
        ['rb', 'Rainbow Trout'],
        ['gd', 'Golden Trout'],
      ];
      let emitted = 0;
      for (const [key, name] of speciesEmitMap) {
        if (!speciesHits[key]) continue;
        records.push({
          date: dateIso,
          water,
          county,
          sec: sec || undefined,
          species: name,
          notes: `Seeded from PA PFBC 2026 Adult Trout Stocking Schedule (Sec ${sec || '?'}).`,
        });
        emitted++;
      }
      if (emitted > 0) {
        lastCounty = county;
        lastWater = water;
        lastSec = sec;
      }
    }
  }

  console.log(`Extracted ${records.length} stocking events`);

  const byCounty = {};
  const bySpecies = { 'Brook Trout': 0, 'Brown Trout': 0, 'Rainbow Trout': 0, 'Golden Trout': 0 };
  for (const r of records) {
    byCounty[r.county] = (byCounty[r.county] || 0) + 1;
    bySpecies[r.species] = (bySpecies[r.species] || 0) + 1;
  }
  console.log('Top 10 counties:');
  for (const [c, n] of Object.entries(byCounty).sort((a, b) => b[1] - a[1]).slice(0, 10)) {
    console.log(`  ${c}: ${n}`);
  }
  console.log('Species breakdown:', bySpecies);
  console.log('Distinct waters:', new Set(records.map((r) => r.water)).size);

  fs.writeFileSync(OUT_PATH, JSON.stringify(records, null, 2));
  console.log(`Wrote ${OUT_PATH}`);
})().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});
