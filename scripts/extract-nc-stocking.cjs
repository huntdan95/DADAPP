/**
 * Download every NC mountain trout county PDF and extract stocking
 * counts. NC PDFs use a stream × month grid (not date-list) — each
 * row shows a stream + species (BROOK / R'BOW / BROWN) + count cells
 * under JAN, FEB, MAR, APR, MAY, JUN, JUL, AUG, SEP, OCT, NOV, DEC.
 *
 * Parser:
 *   1. Find the header row by detecting month names.
 *   2. Capture x-positions of each month column.
 *   3. Walk data rows; for each, identify:
 *        - water name (leftmost text cluster)
 *        - species label (BROOK / R'BOW / BROWN — present once per
 *          species-row, often with the water name shared across them)
 *        - month-column counts: integer under each month's x-position
 *   4. Emit a record per (water, species, month, count) using
 *      mid-month dates.
 *
 * Output: data/seed/nc-raw.json
 */

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const OUT_PATH = path.join(__dirname, '..', 'data', 'seed', 'nc-raw.json');
const PDF_CACHE_DIR = path.join(os.tmpdir(), 'nc-stocking-pdfs');
fs.mkdirSync(PDF_CACHE_DIR, { recursive: true });

const NC_COUNTIES = {
  Alleghany: 4, Ashe: 5, Avery: 6, Burke: 12, Caldwell: 13,
  Cherokee: 18, Clay: 20, Cleveland: 22, Graham: 36, Haywood: 43,
  Henderson: 44, Jackson: 49, Macon: 56, Madison: 57, McDowell: 58,
  Mitchell: 61, Polk: 76, Rutherford: 81, Stokes: 86, Surry: 87,
  Swain: 88, Transylvania: 89, Watauga: 95, Wilkes: 97, Yadkin: 99,
  Yancey: 100,
};

const FETCH_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'application/pdf,*/*',
  'Accept-Language': 'en-US,en;q=0.9',
  Referer: 'https://www.flyfishingnc.com/trout-streams-maps/stocking-schedule',
};

// PDF column-header → month number.
const MONTH_TOKENS = {
  JAN: 1, FEB: 2, MAR: 3, APRIL: 4, MAY: 5, JUNE: 6, JULY: 7,
  AUG: 8, SEPT: 9, OCT: 10, NOV: 11, DEC: 12,
};
const SPECIES_TOKENS = {
  BROOK: 'Brook Trout',
  "R'BOW": 'Rainbow Trout',
  RBOW: 'Rainbow Trout',
  BROWN: 'Brown Trout',
};

async function downloadIfMissing(countyName, countyId) {
  const file = path.join(PDF_CACHE_DIR, `${countyName}-${countyId}.pdf`);
  if (fs.existsSync(file) && fs.statSync(file).size > 1000) return file;
  const url = `https://www.ncpaws.org/RSReports/FishStock/TroutCountyPDF.aspx?countyID=${countyId}`;
  const res = await fetch(url, { headers: FETCH_HEADERS });
  if (!res.ok) return null;
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('pdf')) return null;
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(file, buf);
  return file;
}

/** Group text items into rows by y, sorted top-down. */
function bucketRows(items) {
  const rows = [];
  for (const it of items) {
    let row = rows.find((r) => Math.abs(r.y - it.y) < 4);
    if (!row) {
      row = { y: it.y, items: [] };
      rows.push(row);
    }
    row.items.push(it);
  }
  rows.forEach((r) => r.items.sort((a, b) => a.x - b.x));
  rows.sort((a, b) => b.y - a.y); // top-down
  return rows;
}

async function parsePdf(pdfjs, file, countyName) {
  const buf = fs.readFileSync(file);
  const doc = await pdfjs.getDocument({ data: new Uint8Array(buf) }).promise;
  const records = [];

  for (let pageNo = 1; pageNo <= doc.numPages; pageNo++) {
    const page = await doc.getPage(pageNo);
    const content = await page.getTextContent();
    const items = content.items
      .map((it) => ({
        str: it.str.trim(),
        x: it.transform[4],
        y: it.transform[5],
      }))
      .filter((it) => it.str !== '');

    const rows = bucketRows(items);

    // Find the header row containing month tokens, capture x-positions.
    let monthCols = null;
    for (const row of rows) {
      const strs = row.items.map((it) => it.str);
      if (strs.includes('JAN') && strs.includes('DEC')) {
        monthCols = {};
        for (const it of row.items) {
          if (MONTH_TOKENS[it.str] != null) {
            monthCols[MONTH_TOKENS[it.str]] = it.x;
          }
        }
        break;
      }
    }
    if (!monthCols) continue;

    // Tolerance for "this number is under month X" — half the gap
    // between adjacent month columns.
    const monthXs = Object.values(monthCols).sort((a, b) => a - b);
    const gap = monthXs.length > 1 ? (monthXs[1] - monthXs[0]) : 30;
    const tol = gap / 2;

    // Now walk data rows. Track:
    //   - "current stream" — sticky water-name across the 1-3 species
    //     sub-rows for a single stream block
    //   - per-row species marker (BROOK / R'BOW / BROWN)
    //   - integers in month columns -> emit
    let currentStream = null;
    for (const row of rows) {
      const text = row.items.map((it) => it.str).join(' ');
      // Skip header / footer / blank lines
      if (text.length < 3) continue;
      if (/STREAM CODE|PORTION|STOCKED|TOTAL|DISTRICT|COUNTY|MASTER TROUT|Page \d+/i.test(text)) {
        // Don't `continue` if a species + counts appear on the same
        // row (only known header columns will trigger this match).
        if (/^STREAM|^PORTION|^DISTRICT|^MASTER|^WATAUGA COUNTY|^Page/i.test(text)) continue;
      }

      // Look for a species marker.
      const speciesItem = row.items.find((it) => SPECIES_TOKENS[it.str.replace(/[^A-Z']/g, '')]);
      // Look for stream name: leftmost capitalized item, x < 100.
      const streamItem = row.items.find((it) => it.x < 100 && /^[A-Z][A-Z' \-]+$/.test(it.str));
      if (streamItem) {
        // Concatenate adjacent name items (sometimes a name spans two
        // sequential items like "SOUTH" "FORK").
        const namedSequence = row.items
          .filter((it) => it.x < 95 && /^[A-Z][A-Z' \-]*$/.test(it.str))
          .map((it) => it.str)
          .join(' ');
        currentStream = namedSequence || streamItem.str;
      }
      if (!speciesItem || !currentStream) continue;
      const species = SPECIES_TOKENS[speciesItem.str.replace(/[^A-Z']/g, '')];

      // For each month column, look for an integer item at that x.
      for (const [monthNumStr, monthX] of Object.entries(monthCols)) {
        const monthNum = Number(monthNumStr);
        const cell = row.items.find(
          (it) => Math.abs(it.x - monthX) <= tol && /^\d{1,3}(,\d{3})?$/.test(it.str)
        );
        if (!cell) continue;
        const count = Number(cell.str.replace(/,/g, ''));
        if (!Number.isFinite(count) || count === 0) continue;
        const dateIso = `2026-${String(monthNum).padStart(2, '0')}-15`;
        records.push({
          date: dateIso,
          water: titleCase(currentStream),
          county: countyName,
          species,
          count,
          notes:
            `Seeded from NCWRC 2026 Master Trout Stocking schedule (${countyName} Co.). ` +
            `Stocking week unknown — mid-month placeholder; rerun cron to refine.`,
        });
      }
    }
  }
  return records;
}

function titleCase(s) {
  return s
    .toLowerCase()
    .split(/\s+/)
    .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1) : ''))
    .join(' ')
    .replace(/\bMcDowell\b/i, 'McDowell')
    .replace(/\bSr\b/g, 'SR')
    .replace(/\bNc\b/g, 'NC');
}

(async () => {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const { pathToFileURL } = require('node:url');
  pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(
    require.resolve('pdfjs-dist/legacy/build/pdf.worker.mjs')
  ).href;

  const all = [];
  for (const [countyName, countyId] of Object.entries(NC_COUNTIES)) {
    process.stdout.write(`  ${countyName} (id=${countyId})... `);
    const file = await downloadIfMissing(countyName, countyId);
    if (!file) {
      console.log('skip');
      continue;
    }
    const records = await parsePdf(pdfjs, file, countyName);
    all.push(...records);
    console.log(`+${records.length}`);
  }

  console.log(`\nTotal NC stocking records: ${all.length}`);
  const byCounty = {};
  const bySpecies = { 'Brook Trout': 0, 'Brown Trout': 0, 'Rainbow Trout': 0 };
  for (const r of all) {
    byCounty[r.county] = (byCounty[r.county] || 0) + 1;
    bySpecies[r.species] = (bySpecies[r.species] || 0) + 1;
  }
  console.log('Per county:');
  for (const [c, n] of Object.entries(byCounty).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${c}: ${n}`);
  }
  console.log('Species:', bySpecies);
  console.log('Distinct waters:', new Set(all.map((r) => r.water)).size);

  fs.writeFileSync(OUT_PATH, JSON.stringify(all, null, 2));
  console.log(`Wrote ${OUT_PATH}`);
})().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});
