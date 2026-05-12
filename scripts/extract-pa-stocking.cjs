/**
 * One-shot: parse the PA PFBC 2026 Adult Trout Stocking Schedule PDF
 * (52 pages, ~1,500 entries) into a clean JSON array for the seeder.
 *
 * The PDF is a tab-separated table:
 *   County | Water | Sec | Stocking Date | BRK | BRO | RB | GD |
 *   Meeting Place | Mtg Time | Upper Limit | Lower Limit
 *
 * Approach:
 *   1. pdf-parse extracts the text (tabs intact, but some rows wrap
 *      due to long Meeting Place strings).
 *   2. Walk lines, find date tokens (M/D/YYYY or "wk of M/D/YYYY"),
 *      and reconstruct each row by associating columns.
 *   3. Emit a record per (water, date, species) combination so the
 *      production deriveStockingId() generates unique ids when a row
 *      stocks multiple species on the same day.
 *
 * Output: data/seed/pa-raw.json
 */

const { PDFParse } = require('pdf-parse');
const fs = require('node:fs');
const path = require('node:path');

const PDF_PATH = 'C:/Users/Danny/.claude/projects/C--Danny-DADAPP/06b1695b-2693-4629-a699-fd954e77387b/tool-results/webfetch-1778544510774-18lzbw.pdf';
const OUT_PATH = path.join(__dirname, '..', 'data', 'seed', 'pa-raw.json');

// "X" cells can be tab-separated or space-padded in the extracted text.
// We detect the species columns by their positional pattern relative to
// the stocking date. After the date there are exactly 4 species slots
// (BRK BRO RB GD), each either "X" or empty. We capture them as a
// 4-char string of X/. tokens.
const DATE_RE = /\b(?:wk\s+of\s+)?(\d{1,2}\/\d{1,2}\/\d{4})\b/;

function parseDate(s) {
  const m = s.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (!m) return null;
  const [, mo, d, y] = m;
  return `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

(async () => {
  const buf = fs.readFileSync(PDF_PATH);
  const parser = new PDFParse({ data: buf });
  const res = await parser.getText();
  const text = res.text;
  console.log(`Read ${text.length} chars across ${res.pages?.length ?? '?'} pages`);

  // Split on page boundaries and headers
  const lines = text.split(/\r?\n/);

  const records = [];
  let lastCounty = null;
  let lastWater = null;
  let lastSec = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    if (line.startsWith('--') && line.endsWith('--')) continue; // page marker
    if (line.startsWith('Pennsylvania Fish and Boat')) continue;
    if (line.startsWith('County')) continue; // header
    if (line.startsWith('BRK -')) continue;  // legend footer
    if (line.startsWith('Page ')) continue;
    if (line.startsWith('Trout')) continue;
    if (line === '2026') continue;

    // A row generally has the date in it. If no date in line, this is
    // either a wrapped Meeting Place continuation or a blank.
    if (!DATE_RE.test(line)) continue;

    // Tab-split. The columns we care about are at the start:
    //   [0] County, [1] Water, [2] Sec, [3] Stocking Date, [4..7] species
    const cols = line.split('\t').map((s) => s.trim());

    // Some rows have empty leading tab(s) where county/water is repeated
    // from the prior row. Backfill with last values when blank.
    let county = cols[0] || lastCounty;
    let water = cols[1] || lastWater;
    let sec = cols[2] || lastSec;
    if (!county || !water) continue;

    // Skip rows where the first non-empty cell isn't a county name —
    // can happen on continuations.
    if (!/^[A-Z]/.test(county)) continue;

    // Find the date token in the line — might not be in cols[3] due to
    // tabs being eaten.
    const dateMatch = line.match(/(?:wk\s+of\s+)?(\d{1,2}\/\d{1,2}\/\d{4})/);
    if (!dateMatch) continue;
    const dateIso = parseDate(dateMatch[1]);
    if (!dateIso) continue;

    // Extract species presence. After the date, look at how many "X"
    // tokens appear up to the meeting place. The 4 species slots are
    // BRK, BRO, RB, GD in that fixed order — represented as four
    // tab/space-separated cells. Find the substring AFTER the date.
    const idxAfter = line.indexOf(dateMatch[0]) + dateMatch[0].length;
    const afterDate = line.slice(idxAfter, idxAfter + 60);
    // Look for "X" cells in slot order. We split that 60-char window
    // into the four 1-2 char slots — but they aren't fixed-width, so
    // we use the count of \t between species cells.
    const speciesSegment = line.slice(idxAfter).split('\t').slice(0, 5).join('\t');
    const xs = (speciesSegment.match(/\bX\b/g) ?? []).length;

    // For per-species emission we want to know WHICH species each X
    // is. Walk the 4 expected slots; presence is determined by whether
    // there's an X in that slot's tab-separated cell.
    const afterDateParts = line.slice(idxAfter).split('\t');
    // afterDateParts[0] is the rest of the date col (usually empty).
    // The next 4 parts are species cells. They might have content
    // like "X" or be empty or contain extra whitespace.
    const speciesCells = [];
    let collected = 0;
    for (let j = 0; j < afterDateParts.length && collected < 4; j++) {
      const cell = afterDateParts[j].trim();
      if (cell === '') {
        speciesCells.push(false);
        collected++;
        continue;
      }
      // If the cell starts with X (possibly followed by more X across
      // adjacent slots collapsed), treat it as a hit.
      const cellTokens = cell.split(/\s+/);
      for (const tok of cellTokens) {
        if (collected >= 4) break;
        if (tok === 'X') {
          speciesCells.push(true);
          collected++;
        } else if (tok === 'x') {
          speciesCells.push(true);
          collected++;
        } else {
          // Hit text that's not a species marker — break, the rest
          // of this cell is meeting place / address.
          break;
        }
      }
      // If we didn't collect 4 species yet but found non-X content,
      // pad with false for remaining and break.
      if (collected < 4 && cellTokens.some((t) => t !== 'X' && t !== 'x')) {
        while (collected < 4) {
          speciesCells.push(false);
          collected++;
        }
        break;
      }
    }
    while (speciesCells.length < 4) speciesCells.push(false);

    // Build a record per species hit so each species gets a unique
    // deterministic id in Firestore.
    const speciesNames = ['Brook Trout', 'Brown Trout', 'Rainbow Trout', 'Golden Trout'];
    let emitted = 0;
    for (let s = 0; s < 4; s++) {
      if (!speciesCells[s]) continue;
      records.push({
        date: dateIso,
        water,
        county,
        sec: sec || undefined,
        species: speciesNames[s],
        notes: `Seeded from PA PFBC 2026 Adult Trout Stocking Schedule (Sec ${sec || '?'}).`,
      });
      emitted++;
    }
    // Defensive: if line had X-count but our slot logic missed
    // anything, fall back to a generic rainbow stocking.
    if (emitted === 0 && xs > 0) {
      records.push({
        date: dateIso,
        water,
        county,
        sec: sec || undefined,
        species: 'Rainbow Trout',
        notes: `Seeded from PA PFBC 2026 Adult Trout Stocking Schedule (Sec ${sec || '?'}).`,
      });
    }
    lastCounty = county;
    lastWater = water;
    lastSec = sec;
  }

  console.log(`Extracted ${records.length} stocking events`);

  // Quick sanity stats
  const byCounty = {};
  const bySpecies = {};
  for (const r of records) {
    byCounty[r.county] = (byCounty[r.county] || 0) + 1;
    bySpecies[r.species] = (bySpecies[r.species] || 0) + 1;
  }
  console.log('Top 10 counties:');
  for (const [c, n] of Object.entries(byCounty).sort((a, b) => b[1] - a[1]).slice(0, 10)) {
    console.log(`  ${c}: ${n}`);
  }
  console.log('Species breakdown:', bySpecies);

  fs.writeFileSync(OUT_PATH, JSON.stringify(records, null, 2));
  console.log(`Wrote ${OUT_PATH}`);
})().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});
