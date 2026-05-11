/**
 * Merge the user-supplied michigan_fly_hatches.csv into data/hatches.json.
 *
 * The CSV is the canonical Michigan hatch calendar (50 entries spanning
 * Jan-Nov). Many entries overlap with patterns we already have for
 * other regions but with different timing or species — for those we
 * either UPDATE the existing entry to add MI, or ADD a separate
 * `<id>-mi` variant when the timing diverges enough to warrant its
 * own row.
 *
 * Per-row plan is encoded explicitly below — no fuzzy auto-merging.
 * That makes the diff readable and easy to audit.
 *
 * Run: node scripts/merge-mi-hatches.cjs
 * Idempotent (skips entries whose id already exists; updates state lists
 * without duplicating).
 */

const fs = require('node:fs');
const path = require('node:path');

const FILE = path.join(__dirname, '..', 'data', 'hatches.json');

// Convert "M/D" (no year) to a 1-12 month number.
const monthOf = (md) => {
  if (!md) return null;
  const [m] = String(md).split('/');
  return parseInt(m, 10);
};

// Map CSV emergence-time strings to our enum.
function timeOfDayFromCsv(s) {
  const v = String(s || '').toLowerCase();
  if (!v) return 'afternoon';
  if (v.includes('anytime') || v.includes('all day')) return 'all day';
  if (v.includes('dark') || v.includes('22:') || v.includes('24:') || v.includes('04:')) {
    if (v.startsWith('06:') || v.startsWith('10:')) return 'morning';
    return 'night';
  }
  if (v.startsWith('06:') || v.startsWith('07:') || v.startsWith('08:') || v.startsWith('09:')) return 'morning';
  if (v.startsWith('14:') || v.startsWith('16:') || v.startsWith('18:') || v.startsWith('20:')) return 'evening';
  if (v.includes('evening')) return 'evening';
  if (v.includes('afternoon')) return 'afternoon';
  if (v.includes('daytime')) return 'afternoon';
  if (v.startsWith('10:') || v.startsWith('11:') || v.startsWith('12:') || v.startsWith('13:')) return 'afternoon';
  return 'afternoon';
}

// Synthesize a reasonable water-temp range based on insect group +
// season. Mayflies in May-June are at 50-58°F; Tricos in August are
// 60-70°F; midges run all year; stoneflies tolerate cold water.
function waterTempRange(group, startMonth) {
  if (group === 'Midges') return [35, 72];
  if (group === 'Terrestrial') return [58, 78];
  if (group === 'Stonefly') {
    if (startMonth <= 4) return [38, 52];     // winter / early-spring stones
    return [50, 65];                          // later stones
  }
  if (group === 'Caddis') {
    if (startMonth <= 5) return [48, 60];
    if (startMonth <= 7) return [55, 68];
    return [50, 65];
  }
  // Mayfly
  if (startMonth <= 4) return [42, 54];
  if (startMonth <= 5) return [50, 60];
  if (startMonth <= 7) return [54, 66];
  if (startMonth <= 9) return [55, 70];
  return [42, 58];                           // fall return
}

// Synthesize a fly list from insect group + sizes + name. Mirrors the
// pattern variety we use elsewhere (dun, emerger, cripple, spinner,
// nymph for mayflies; elk-hair + pupa + larva for caddis).
function fliesFor(name, group, sizeRange) {
  const baseName = name.split(/[\/(]/)[0].trim();
  const sizes = sizeRange || '';
  const lc = baseName.toLowerCase();
  const isMidge = group === 'Midges';
  const isTerrestrial = group === 'Terrestrial';
  if (isMidge) {
    return [
      `Size ${sizes} ${baseName} pattern`,
      `Size 20-24 zebra midge`,
      `Size 22 Griffith's gnat (cluster)`,
      `Size 22 RS2 emerger`,
    ];
  }
  if (isTerrestrial) {
    if (lc.includes('beetle')) return ['Size 12-14 foam beetle', "Size 12 Dave's beetle", 'Size 14 peacock beetle'];
    if (lc.includes('ant')) return ['Size 14-16 foam ant (black)', 'Size 16 cinnamon ant', 'Size 18 parachute ant'];
    if (lc.includes('cricket')) return [`Size ${sizes} foam cricket`, 'Size 10 Dave\'s cricket'];
    if (lc.includes('grasshopper')) return [`Size ${sizes} hopper`, 'Size 8 Dave\'s hopper', 'Size 10 Chubby Chernobyl'];
    if (lc.includes('worm')) return [`Size ${sizes} green worm (chenille)`, `Size 10 inchworm`];
    return [`Size ${sizes} ${baseName} pattern`];
  }
  if (group === 'Stonefly') {
    return [
      `Size ${sizes} ${baseName} adult (Stimulator-style)`,
      `Size ${sizes} ${baseName} nymph (Pat's rubber-legs)`,
      `Size ${sizes} dark stone nymph`,
    ];
  }
  if (group === 'Caddis') {
    return [
      `Size ${sizes} elk-hair caddis`,
      `Size ${sizes} LaFontaine emergent sparkle pupa`,
      `Size ${sizes} X-caddis`,
      `Size ${sizes} caddis larva (green rock-worm)`,
    ];
  }
  // Mayfly
  return [
    `Size ${sizes} ${baseName} parachute`,
    `Size ${sizes} ${baseName} Compara-dun`,
    `Size ${sizes} ${baseName} cripple`,
    `Size ${sizes} ${baseName} CDC emerger`,
    `Size ${sizes} ${baseName} rusty spinner`,
    `Size ${sizes} pheasant-tail nymph`,
  ];
}

// --- Per-row plan -----------------------------------------------------------
// Each CSV row maps to one of:
//   { kind: 'update', id, addStates: ['MI'] }  — extend an existing entry
//   { kind: 'add',    newEntry: {...} }        — brand-new entry
//   { kind: 'skip',   reason }                 — already covered well enough
//
// CSV row order is preserved so the lists below read top-to-bottom.

const CSV_ROWS = [
  // Common Name, Scientific, Group, Hook, Start, End, Peak, Time
  ['Tiny Black Stonefly', 'Allocapnia granulata, Nemouridae sp.', 'Stonefly', '16-20', '1/14', '5/14', '', '12:00-16:00'],
  ['Early Black Stonefly', 'Taeniopteryx nivalis', 'Stonefly', '10-14', '3/7', '5/14', '', '12:00-16:00'],
  ['Early Brown Stonefly', 'Brachyptera fasciata', 'Stonefly', '12-14', '3/29', '5/24', '', '13:00-19:00'],
  ['Slate Wing Mahogany / Little Red Quill', 'Paraleptophlebia adoptiva', 'Mayfly', '16-18', '4/29', '7/22', '5/14-5/28', '10:00-16:00'],
  ['Blue-Winged Olive', 'Baetis tricaudatus', 'Mayfly', '16-20', '4/29', '9/7', '5/15-5/21 & 6/21-7/5', '12:00-15:00'],
  ['Dark Hendrickson / Red Quill', 'Ephemerella subvaria', 'Mayfly', '12-14', '5/4', '6/3', '5/14-5/21', '10:00-16:00'],
  ['Little Black Caddis', 'Chimarra aterrima', 'Caddis', '16-18', '5/4', '8/14', '5/14-5/21', '12:00-22:00'],
  ['Grannom Caddis', 'Brachycentrus americanus', 'Caddis', '14-16', '5/4', '8/14', '', '14:00-Dark'],
  ['Borcher\'s Drake', 'Leptophlebia cupida', 'Mayfly', '12-14', '5/4', '8/29', '', '10:00-16:00'],
  ['Green Caddis / Green Rock Worm', 'Rhyacophilidae fenestra', 'Caddis', '10-18', '5/14', '7/14', '', '14:00-Dark'],
  ['Medium Brown Stonefly', 'Perlodidae isogenus', 'Stonefly', '8-14', '5/14', '8/14', '', 'Afternoons'],
  ['Light Hendrickson', 'Ephemerella rotunda', 'Mayfly', '14-16', '5/17', '7/4', '', '12:00-17:00'],
  ['Giant Stonefly / Salmonfly', 'Pteronarcys dorsata', 'Stonefly', '2-8', '5/29', '7/14', '', 'Anytime'],
  ['Great Speckled Olive Mayfly', 'Siphloplecton baslae', 'Mayfly', '10-14', '5/29', '7/29', '', '12:00-17:00'],
  ['True Hendrickson', 'Ephemerella invaria', 'Mayfly', '14-16', '5/29', '8/3', '6/4-6/21', '12:00-17:00'],
  ['Sulphur Dun', 'Ephemerella dorothea', 'Mayfly', '16-18', '5/29', '7/22', '6/21-7/14', '12:00-17:00'],
  ['Blue-Winged Olive (evening)', 'Baetis sp.', 'Mayfly', '14-16', '5/29', '7/26', '', '20:00-22:00'],
  ['Tiny Blue-Winged Olive', 'Baetis cingulatis', 'Mayfly', '20-22', '5/29', '9/13', '', '10:00-21:00'],
  ['Green Oak Worm', 'Lepidoptera sp.', 'Terrestrial', '8-12', '5/29', '7/24', '6/21-7/5', 'Daytime'],
  ['Little Yellow or Green Stonefly (Yellow Sally)', 'Alloperla sp.', 'Stonefly', '14-18', '5/29', '11/13', '', 'Afternoons'],
  ['White Miller Caddis', 'Nectopsyche', 'Caddis', '14-16', '5/29', '11/13', '', 'Afternoons'],
  ['March Brown', 'Stenonema vicarium', 'Mayfly', '10-12', '5/31', '8/3', '', '12:00-16:00'],
  ['Early Gray Drake', 'Siphlonurus rapidus', 'Mayfly', '12-14', '6/3', '6/29', '6/14-6/21', 'Dark'],
  ['Cinnamon Caddis', 'Hydropsyche sp.', 'Caddis', '14-20', '6/3', '10/14', '', '16:00-Dark'],
  ['Sand Drake', 'Stenonema fuscum', 'Mayfly', '12-14', '6/3', '8/3', '6/14-6/28', '20:00-24:00'],
  ['Quill Gordon', 'Epeorus pleuralis', 'Mayfly', '12-14', '6/7', '7/26', '', '13:00-16:00'],
  ['Pale Evening Dun', 'Ephemerella dorothea', 'Mayfly', '16-18', '6/15', '7/29', '', '20:00-24:00'],
  ['Brown Drake', 'Ephemera simulans', 'Mayfly', '8-12', '6/15', '7/18', '6/14-6/28', '20:00-24:00'],
  ['Great Orange Sedge', 'Phryganlidae ptilostomis', 'Caddis', '8-10', '6/15', '8/14', '', 'Evenings'],
  ['Beetles', 'Coleoptera', 'Terrestrial', '12-16', '6/15', '10/14', '', 'Daytime & Evenings'],
  ['Midges', 'Diptera', 'Midges', '20-28', '6/15', '11/13', '', 'Anytime'],
  ['Light Cahill', 'Stenonema sp.', 'Mayfly', '12-14', '6/20', '8/28', '', '14:00-22:00'],
  ['Hex / Giant Michigan Mayfly', 'Hexagenia limbata', 'Mayfly', '4-8', '6/24', '7/24', '7/5-7/21', '22:00-04:00'],
  ['Late Gray Drake', 'Siphlonurus alternatus', 'Mayfly', '10-12', '6/24', '8/9', '7/15-7/28', 'Dark'],
  ['Mahogany Dun', 'Isonychia sadleri', 'Mayfly', '10-12', '6/29', '8/13', '', '16:00-22:00'],
  ['Golden Drake', 'Ephemera varia', 'Mayfly', '10-12', '6/29', '8/21', '', ''],
  ['Leadwing Coachman / Iso', 'Isonychia bicolor', 'Mayfly', '10-12', '6/29', '9/29', '', '16:00-22:00'],
  ['Ants, Black & Cinnamon', 'Hymenoptera: Formicidae', 'Terrestrial', '12-24', '6/29', '10/14', '', 'Daytime & Evenings'],
  ['Big Golden Stonefly', 'Paragentina media', 'Stonefly', '6-8', '7/5', '8/21', '', ''],
  ['Slate Winged Olive', 'Ephemerella lata', 'Mayfly', '14-18', '7/5', '8/28', '', ''],
  ['Dark Slate Wing Olive', 'Ephemerella simplex', 'Mayfly', '18-20', '7/5', '10/14', '', ''],
  ['Tiny Blue Winged Olive (Pseudocloen)', 'Pseudocloen anoka', 'Mayfly', '22-24', '7/5', '10/14', '', ''],
  ['Crickets', 'Orthoptera sp.', 'Terrestrial', '10-12', '7/15', '10/29', '', 'Anytime'],
  ['Grasshoppers', 'Orthoptera sp.', 'Terrestrial', '6-12', '7/29', '10/14', '', 'Daytime'],
  ['Trico / Tiny White-Winged Black', 'Tricorythodes stygiatus', 'Mayfly', '22-26', '8/3', '11/3', '', '06:00-10:00'],
  ['Small Slate Mahogany', 'Paraleptophlebia debilis', 'Mayfly', '16-18', '8/3', '11/13', '', ''],
  ['Black Dancer Caddisfly', 'Mystocides sepulchralis', 'Caddis', '18-20', '8/15', '10/14', '', ''],
  ['Little Medium Olive', 'Baetis brunneicolor', 'Mayfly', '22-24', '8/21', '10/14', '', ''],
  ['White Fly', 'Ephoron album, Ephoron leukon', 'Mayfly', '12-14', '8/28', '10/14', '', ''],
  ['Fall Blue-Winged Olive', 'Baetis tricaudatus', 'Mayfly', '14-16', '8/29', '11/15', '', '11:00-16:00'],
  ['Slate Wing Brown Mayfly', 'Baetis heimalis', 'Mayfly', '14-16', '9/15', '11/15', '', ''],
  ['October Caddis', 'Trichoptera', 'Caddis', '10-14', '9/25', '10/31', '', 'Afternoons/Evenings'],
];

// For each CSV row, decide whether to update an existing entry or
// create a new one. id-naming convention: kebab-case base name with
// "-mi" suffix when MI variant of an existing pattern with different
// timing.
const ROW_PLAN = {
  // CSV name → plan
  'Tiny Black Stonefly': { kind: 'add', id: 'mi-tiny-black-stonefly' },
  'Early Black Stonefly': { kind: 'add', id: 'mi-early-black-stonefly' },
  'Early Brown Stonefly': { kind: 'add', id: 'mi-early-brown-stonefly' },
  'Slate Wing Mahogany / Little Red Quill': { kind: 'add', id: 'mi-slate-wing-mahogany' },
  'Blue-Winged Olive': { kind: 'updateStates', id: 'bwo-spring', addStates: ['MI'] },
  'Dark Hendrickson / Red Quill': { kind: 'updateStates', id: 'hendrickson', addStates: ['MI'] },
  'Little Black Caddis': { kind: 'add', id: 'mi-little-black-caddis' },
  'Grannom Caddis': { kind: 'updateStates', id: 'caddis-grannom', addStates: ['MI'] },
  "Borcher's Drake": { kind: 'add', id: 'mi-borchers-drake' },
  'Green Caddis / Green Rock Worm': { kind: 'add', id: 'mi-green-rock-worm' },
  'Medium Brown Stonefly': { kind: 'add', id: 'mi-medium-brown-stonefly' },
  'Light Hendrickson': { kind: 'add', id: 'mi-light-hendrickson' },
  'Giant Stonefly / Salmonfly': { kind: 'add', id: 'mi-giant-stonefly' },
  'Great Speckled Olive Mayfly': { kind: 'add', id: 'mi-great-speckled-olive' },
  'True Hendrickson': { kind: 'add', id: 'mi-true-hendrickson' },
  'Sulphur Dun': { kind: 'skip', reason: 'covered by sulfur-mi which we added earlier' },
  'Blue-Winged Olive (evening)': { kind: 'add', id: 'mi-bwo-evening' },
  'Tiny Blue-Winged Olive': { kind: 'add', id: 'mi-tiny-bwo' },
  'Green Oak Worm': { kind: 'add', id: 'mi-green-oak-worm' },
  'Little Yellow or Green Stonefly (Yellow Sally)': { kind: 'updateStates', id: 'stonefly-yellow-sally', addStates: ['MI'] },
  'White Miller Caddis': { kind: 'add', id: 'mi-white-miller-caddis' },
  'March Brown': { kind: 'updateStates', id: 'march-brown', addStates: ['MI'] },
  'Early Gray Drake': { kind: 'add', id: 'mi-early-gray-drake' },
  'Cinnamon Caddis': { kind: 'updateStates', id: 'caddis-cinnamon', addStates: ['MI'] },
  'Sand Drake': { kind: 'add', id: 'mi-sand-drake' },
  'Quill Gordon': { kind: 'add', id: 'mi-quill-gordon' },           // MI variant has later timing than Smokies
  'Pale Evening Dun': { kind: 'add', id: 'mi-pale-evening-dun' },     // MI evening hatch, different from Western
  'Brown Drake': { kind: 'skip', reason: 'covered by brown-drake (already includes MI)' },
  'Great Orange Sedge': { kind: 'add', id: 'mi-great-orange-sedge' },
  Beetles: { kind: 'add', id: 'mi-beetles' },
  Midges: { kind: 'updateStates', id: 'midges', addStates: ['MI'] },
  'Light Cahill': { kind: 'skip', reason: 'covered by light-cahill (already includes MI)' },
  'Hex / Giant Michigan Mayfly': { kind: 'skip', reason: 'covered by hex' },
  'Late Gray Drake': { kind: 'add', id: 'mi-late-gray-drake' },
  'Mahogany Dun': { kind: 'add', id: 'mi-mahogany-dun-isonychia' },    // MI Isonychia, different from Western Drunella
  'Golden Drake': { kind: 'add', id: 'mi-golden-drake' },
  'Leadwing Coachman / Iso': { kind: 'add', id: 'mi-leadwing-coachman' },
  'Ants, Black & Cinnamon': { kind: 'updateStates', id: 'terrestrials-summer', addStates: ['MI'] },
  'Big Golden Stonefly': { kind: 'add', id: 'mi-big-golden-stonefly' },
  'Slate Winged Olive': { kind: 'add', id: 'mi-slate-winged-olive' },
  'Dark Slate Wing Olive': { kind: 'add', id: 'mi-dark-slate-wing-olive' },
  'Tiny Blue Winged Olive (Pseudocloen)': { kind: 'add', id: 'mi-pseudocloeon' },
  Crickets: { kind: 'add', id: 'mi-crickets' },
  Grasshoppers: { kind: 'add', id: 'mi-grasshoppers' },
  'Trico / Tiny White-Winged Black': { kind: 'updateStates', id: 'trico', addStates: ['MI'] },
  'Small Slate Mahogany': { kind: 'add', id: 'mi-small-slate-mahogany' },
  'Black Dancer Caddisfly': { kind: 'add', id: 'mi-black-dancer-caddis' },
  'Little Medium Olive': { kind: 'add', id: 'mi-little-medium-olive' },
  'White Fly': { kind: 'updateStates', id: 'white-mayfly', addStates: ['MI'] },
  'Fall Blue-Winged Olive': { kind: 'updateStates', id: 'bwo-fall', addStates: ['MI'] },
  'Slate Wing Brown Mayfly': { kind: 'add', id: 'mi-slate-wing-brown' },
  'October Caddis': { kind: 'add', id: 'mi-october-caddis' },
};

// Famous-MI rivers that should be tagged on every MI entry so the
// score-bonus kicks in when a spot's river matches.
const MI_RIVERS = ['Au Sable', 'Upper Manistee', 'Big Manistee', 'Pere Marquette', 'Muskegon', 'Boardman'];

// --- Runner ----------------------------------------------------------------

const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const byId = new Map(data.map((h) => [h.id, h]));

let updated = 0;
let added = 0;
let skipped = 0;
let unplanned = 0;

for (const row of CSV_ROWS) {
  const [name, scientific, group, hookSize, startMd, endMd, peak, time] = row;
  const plan = ROW_PLAN[name];
  if (!plan) {
    console.warn(`  unplanned row: "${name}"`);
    unplanned++;
    continue;
  }

  if (plan.kind === 'skip') {
    console.log(`  skip  "${name}" (${plan.reason})`);
    skipped++;
    continue;
  }

  if (plan.kind === 'updateStates') {
    const entry = byId.get(plan.id);
    if (!entry) {
      console.warn(`  MISSING target for update: ${plan.id}`);
      continue;
    }
    const before = entry.states.length;
    const next = Array.from(new Set([...entry.states, ...plan.addStates]));
    if (next.length !== before) {
      entry.states = next;
      console.log(`  update ${plan.id}: states += ${plan.addStates.join(',')}`);
      updated++;
    } else {
      console.log(`  noop   ${plan.id} (already includes ${plan.addStates.join(',')})`);
    }
    continue;
  }

  if (plan.kind === 'add') {
    if (byId.has(plan.id)) {
      console.log(`  exists ${plan.id} (no overwrite)`);
      continue;
    }
    const startMonth = monthOf(startMd) || 1;
    const endMonth = monthOf(endMd) || 12;
    const [tempMin, tempMax] = waterTempRange(group, startMonth);
    const stages =
      group === 'Mayfly' ? ['dun', 'spinner', 'emerger']
        : group === 'Caddis' ? ['adult', 'pupa', 'larva']
        : group === 'Stonefly' ? ['adult', 'nymph']
        : group === 'Midges' ? ['adult', 'pupa']
        : ['adult'];
    const notes = peak
      ? `Michigan-specific hatch. Peak ${peak}. ${time || ''}`.trim()
      : `Michigan-specific hatch. ${time || ''}`.trim();
    const entry = {
      id: plan.id,
      name: `${name} (MI)`,
      scientific,
      regions: ['Upper Midwest'],
      states: ['MI', 'IN'],
      rivers: MI_RIVERS,
      startMonth,
      endMonth,
      waterTempMinF: tempMin,
      waterTempMaxF: tempMax,
      timeOfDay: timeOfDayFromCsv(time),
      stages,
      flies: fliesFor(name, group, hookSize),
      searchTerm: `${scientific.split(',')[0].trim()} ${group.toLowerCase()} fly fishing`,
      wikipediaSlug: null,
      notes,
    };
    data.push(entry);
    byId.set(entry.id, entry);
    console.log(`  +      ${entry.id} (${startMonth}/${endMonth} water ${tempMin}-${tempMax}°F)`);
    added++;
  }
}

console.log(`\nUpdated states on ${updated} entries.`);
console.log(`Added ${added} new MI entries.`);
console.log(`Skipped ${skipped} rows (already well-covered).`);
if (unplanned > 0) console.warn(`Unplanned: ${unplanned}`);
console.log(`Total hatches: ${data.length}`);

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log(`Wrote ${FILE}`);
