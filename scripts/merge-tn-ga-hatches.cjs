/**
 * Merge the user-supplied tennessee_georgia_fly_hatches.csv into
 * data/hatches.json. Mirrors the structure of merge-mi-hatches.cjs.
 *
 * Most CSV rows overlap with patterns we already added for TN/GA
 * (sulfur, bwo-spring, hendrickson, etc.) — those resolve to
 * updateStates noops or skip. The genuinely new Eastern patterns
 * (Blue Quill, Eastern Green Drake, Cicadas, Shad Hatch, Inchworms,
 * Eastern October Caddis variant, Yellow Drake) get added as new
 * entries scoped to TN/GA (and NC where the same pattern applies).
 *
 * Run: node scripts/merge-tn-ga-hatches.cjs
 * Idempotent — re-runs are no-ops.
 */

const fs = require('node:fs');
const path = require('node:path');

const FILE = path.join(__dirname, '..', 'data', 'hatches.json');

const monthOf = (md) => (md ? parseInt(String(md).split('/')[0], 10) : null);

function timeOfDayFromCsv(s) {
  const v = String(s || '').toLowerCase();
  if (!v) return 'afternoon';
  if (v.includes('year-round') || v.includes('anytime')) return 'all day';
  if (v.includes('evening')) return 'evening';
  if (v.includes('morning')) return 'morning';
  if (v.includes('night') || v.includes('dark')) return 'night';
  return 'afternoon';
}

function waterTempRange(group, startMonth) {
  if (group === 'Midges' || group === 'Midge') return [35, 72];
  if (group === 'Terrestrial') return [58, 78];
  if (group === 'Crustacean') return [35, 70];
  if (group === 'Forage fish') return [38, 55];
  if (group === 'Stonefly') {
    if (startMonth <= 3) return [38, 50];
    if (startMonth <= 5) return [48, 60];
    return [55, 68];
  }
  if (group === 'Caddis') {
    if (startMonth <= 3) return [42, 55];
    if (startMonth <= 5) return [48, 62];
    if (startMonth <= 8) return [55, 70];
    return [48, 62];
  }
  // Mayfly
  if (startMonth <= 3) return [42, 54];
  if (startMonth <= 5) return [50, 62];
  if (startMonth <= 7) return [54, 68];
  if (startMonth <= 9) return [55, 70];
  return [44, 60];
}

function fliesFor(name, group, sizes) {
  const baseName = name.split(/[\/(]/)[0].trim();
  const lc = baseName.toLowerCase();

  if (group === 'Midge' || group === 'Midges') {
    return [
      `Size ${sizes} ${baseName} pattern`,
      'Size 22-24 zebra midge',
      "Size 22 Griffith's gnat",
      'Size 22 RS2 emerger',
    ];
  }
  if (group === 'Terrestrial') {
    if (lc.includes('beetle'))
      return [
        `Size ${sizes} foam beetle`,
        "Size 14 Dave's beetle (peacock)",
        'Size 12 Japanese beetle (iridescent foam)',
      ];
    if (lc.includes('ant'))
      return [
        `Size ${sizes} foam ant (black)`,
        'Size 16 cinnamon ant',
        'Size 18 parachute ant',
      ];
    if (lc.includes('cicada'))
      return [
        `Size ${sizes} foam cicada (black/orange)`,
        "Size 6 Chubby Chernobyl (cicada colors)",
        'Size 4 Project Hopper (cicada)',
      ];
    if (lc.includes('hopper'))
      return [
        `Size ${sizes} foam hopper`,
        "Size 8 Dave's hopper",
        'Size 10 Chubby Chernobyl',
      ];
    if (lc.includes('inchworm') || lc.includes('worm'))
      return [
        'Size 12-14 green inchworm (chenille)',
        'Size 12 foam inchworm',
        'Size 14 green Mop fly',
      ];
    return [`Size ${sizes} ${baseName} pattern`];
  }
  if (group === 'Crustacean') {
    return [
      `Size ${sizes} grey sowbug`,
      `Size ${sizes} olive scud`,
      'Size 14 pink scud',
    ];
  }
  if (group === 'Forage fish') {
    return [
      'Size 4-6 white/silver Clouser minnow',
      'Size 4 articulated shad pattern',
      'Size 6 Mickey Finn streamer',
      'Size 4 flesh fly (cream)',
    ];
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

// CSV rows preserved in order:
// [State, Name, Scientific, Group, Hook, Start, End, Peak, Waters, Notes]
const ROWS = [
  ['TN', 'Midges', 'Chironomidae', 'Midge', '18-26', '1/1', '12/31', 'Year-round', 'South Holston, Clinch, Watauga, Hiwassee tailwaters', "Year-round staple on tailwaters; Zebra Midge & Griffith's Gnat"],
  ['TN', 'Tiny Winter BWO', 'Baetis sp.', 'Mayfly', '18-22', '1/1', '3/31', 'Feb-Mar overcast days', 'Tailwaters and Smokies', 'Cloudy/drizzly afternoons are best'],
  ['TN', 'Early Black Stonefly', 'Capniidae/Taeniopteryx', 'Stonefly', '16-18', '1/15', '3/31', 'Feb-Mar', 'Smokies freestones and tailwaters', "Hookers Fly Shop lists in January"],
  ['TN', 'Little Black Caddis', 'Chimarra aterrima', 'Caddis', '16-20', '3/1', '4/30', 'Mid-March-mid-April', 'South Holston and Watauga', 'Strong Watauga hatch 3/15-4/15'],
  ['TN', 'Blue Quill', 'Paraleptophlebia adoptiva', 'Mayfly', '16-18', '3/15', '4/30', 'April', 'Smokies and freestones', 'Often overlaps with Quill Gordon'],
  ['TN', 'Quill Gordon', 'Epeorus pleuralis', 'Mayfly', '12-14', '3/15', '4/30', 'Early-mid April', 'Little River, Tellico, Abrams, all Smokies streams', 'First major Smokies mayfly'],
  ['TN', 'Hendrickson', 'Ephemerella subvaria', 'Mayfly', '12-14', '4/1', '5/15', 'Mid-April', 'Smokies and freestones', 'Afternoon emergence'],
  ['TN', 'March Brown', 'Maccaffertium vicarium', 'Mayfly', '10-12', '4/1', '5/31', 'Late April-early May', 'Smokies and Nolichucky', 'Despite name, hatches in April'],
  ['TN', 'Giant Black Stonefly', 'Pteronarcys dorsata', 'Stonefly', '4-8', '4/15', '5/31', 'May', 'Smokies', 'Evening emergence on warm days'],
  ['TN', 'Spring BWO', 'Baetis tricaudatus', 'Mayfly', '16-20', '3/1', '5/31', 'April-May', 'All waters', 'Overcast days dependable'],
  ['TN', 'Eastern Green Drake', 'Ephemera guttulata', 'Mayfly', '8-12', '4/25', '5/31', 'Early-mid May', 'Smokies and Hiwassee', 'Biggest mayfly of the year in the park'],
  ['TN', 'Yellow Sally / Little Yellow Stonefly', 'Isoperla sp.', 'Stonefly', '14-16', '4/1', '7/15', 'May-June', 'Hiwassee, Watauga, Smokies', 'Strong on the Hiwassee'],
  ['TN', 'Cinnamon Caddis', 'Hydropsyche sp.', 'Caddis', '14-18', '4/15', '10/15', 'May-September', 'All waters', 'Evening emergence'],
  ['TN', 'Tan/Spotted Sedge Caddis', 'Hydropsyche/Brachycentrus', 'Caddis', '12-16', '4/1', '10/31', 'May-September', 'All waters', 'Big Y lists 12-16 May-Oct on Watauga'],
  ['TN', 'Sulphur', 'Ephemerella invaria/dorothea', 'Mayfly', '14-18', '5/1', '8/31', 'Late May-mid July', 'South Holston, Watauga, Hiwassee, Clinch', 'SoHo signature hatch; evening dry fly action'],
  ['TN', 'Light Cahill', 'Maccaffertium ithaca', 'Mayfly', '12-16', '5/1', '7/31', 'June', 'Smokies, freestones, Tuckasegee', 'Evening spinner falls, watch riffles'],
  ['TN', 'Isonychia / Slate Drake', 'Isonychia bicolor', 'Mayfly', '10-12', '5/15', '10/31', 'June-September', 'Smokies and freestones', 'Crawls to shore to emerge'],
  ['TN', 'Beetles', 'Coleoptera', 'Terrestrial', '12-16', '5/1', '10/15', 'Summer', 'All waters', ''],
  ['TN', 'Cicadas (periodic)', 'Magicicada spp.', 'Terrestrial', '4-8', '5/1', '6/30', 'Cicada years only', 'Cumberland Plateau and East TN', 'Brood years produce huge surface eats'],
  ['TN', 'Ants', 'Hymenoptera: Formicidae', 'Terrestrial', '14-22', '6/1', '10/15', 'July-September', 'All waters', 'Black and cinnamon'],
  ['TN', 'Inchworms', 'Lepidoptera larvae', 'Terrestrial', '12-16', '5/15', '6/30', 'Late May-June', 'Smokies and freestones', 'Green inchworm patterns'],
  ['TN', 'Hoppers', 'Caelifera', 'Terrestrial', '8-12', '7/1', '9/30', 'August-September', 'All waters', 'Hopper-dropper rigs on SoHo'],
  ['TN', 'Trico', 'Tricorythodes sp.', 'Mayfly', '22-26', '7/1', '9/30', 'Late July-August', 'Clinch River below Norris Dam', 'Legendary morning spinner fall'],
  ['TN', 'White Fly', 'Ephoron leukon', 'Mayfly', '12-14', '8/1', '9/15', 'Mid-August-early September', 'Some tailwaters', 'Evening spinner fall'],
  ['TN', 'Fall BWO', 'Baetis sp.', 'Mayfly', '18-22', '9/1', '11/30', 'October-November', 'All waters', 'Strong on overcast fall days'],
  ['TN', 'Autumn Sedge / October Caddis', 'Neophylax sp.', 'Caddis', '12-16', '9/15', '11/30', 'October', 'All tailwaters and freestones', 'Orange-bodied; extends dry fly season'],

  ['GA', 'Midges', 'Chironomidae', 'Midge', '18-26', '1/1', '12/31', 'Year-round', 'Chattahoochee below Buford Dam, Toccoa tailwater', 'Light tippets and very small flies'],
  ['GA', 'BWO', 'Baetis sp.', 'Mayfly', '18-22', '1/1', '12/31', 'Oct-April', 'All waters', 'Year-round with peaks fall and spring'],
  ['GA', 'Shad Hatch (forage event)', 'Alosa sp.', 'Forage fish', '4-8', '1/1', '2/28', 'January-February', 'Chattahoochee below Buford Dam', 'White/silver streamers when shad pass through dam'],
  ['GA', 'Early Black Stonefly', 'Capniidae/Taeniopteryx', 'Stonefly', '16-18', '1/15', '3/31', 'Feb-March', 'Mountain freestones', ''],
  ['GA', 'Black Caddis', 'Chimarra aterrima', 'Caddis', '16-20', '2/1', '4/15', 'Mid-February', 'Toccoa River tailwater', 'Most prominent winter hatch on Toccoa, per Float North Georgia'],
  ['GA', 'Blue Quill', 'Paraleptophlebia adoptiva', 'Mayfly', '16-18', '3/1', '4/30', 'April', 'North Georgia mountains', ''],
  ['GA', 'Quill Gordon', 'Epeorus pleuralis', 'Mayfly', '12-14', '3/1', '4/30', 'Late March-April', 'North Georgia freestones: Noontootla, Chattooga, Jacks', 'First major mountain mayfly'],
  ['GA', 'Hendrickson', 'Ephemerella subvaria', 'Mayfly', '12-14', '3/15', '5/15', 'April', 'North Georgia mountains', ''],
  ['GA', 'March Brown', 'Maccaffertium vicarium', 'Mayfly', '10-12', '4/1', '5/31', 'April-May', 'Mountain freestones and Toccoa', ''],
  ['GA', 'Spring BWO', 'Baetis tricaudatus', 'Mayfly', '16-20', '2/15', '5/31', 'March-May', 'All waters', 'Toccoa has great BWO hatches'],
  ['GA', 'Caddis (multiple species)', 'Trichoptera', 'Caddis', '12-16', '4/1', '10/31', 'April-May peak', 'All waters', 'Hiwassee/Toccoa magnificent in April-May'],
  ['GA', 'Giant Black Stonefly', 'Pteronarcys dorsata', 'Stonefly', '4-8', '4/15', '5/31', 'May', 'Mountain freestones', ''],
  ['GA', 'Yellow Sally / Little Yellow Stonefly', 'Isoperla sp.', 'Stonefly', '14-16', '4/1', '7/15', 'May-June', 'All trout waters', ''],
  ['GA', 'Eastern Green Drake', 'Ephemera guttulata', 'Mayfly', '8-12', '4/25', '5/31', 'May', 'Limited - Nantahala-adjacent, some N GA freestones', 'Rare in GA proper'],
  ['GA', 'Sulphur', 'Ephemerella invaria/dorothea', 'Mayfly', '14-18', '4/15', '7/31', 'May-June', 'Toccoa Delayed Harvest, Chattahoochee DH, Soque', 'Mid spring Sulphurs in Delayed Harvest sections'],
  ['GA', 'Light Cahill', 'Maccaffertium ithaca', 'Mayfly', '12-16', '5/1', '7/31', 'June', 'Mountain freestones', ''],
  ['GA', 'Sowbugs and Scuds', 'Isopoda/Amphipoda', 'Crustacean', '14-18', '1/1', '12/31', 'Year-round', 'Chattahoochee tailwater', 'Year-round food source'],
  ['GA', 'Isonychia / Slate Drake', 'Isonychia bicolor', 'Mayfly', '10-12', '5/15', '10/31', 'June-September', 'Mountain freestones', ''],
  ['GA', 'Beetles (incl. Japanese Beetle)', 'Coleoptera', 'Terrestrial', '10-16', '5/1', '10/15', 'Summer', 'All waters', 'Japanese Beetle hatch on Chattahoochee'],
  ['GA', 'Inchworms', 'Lepidoptera larvae', 'Terrestrial', '12-16', '5/15', '6/30', 'Late May-June', 'Mountain freestones', ''],
  ['GA', 'Ants', 'Hymenoptera: Formicidae', 'Terrestrial', '14-22', '6/1', '10/15', 'July-September', 'All waters', ''],
  ['GA', 'Yellow Drake', 'Ephemera varia', 'Mayfly', '10-12', '6/15', '8/15', 'Summer', 'Toccoa and freestones', ''],
  ['GA', 'Hoppers', 'Caelifera', 'Terrestrial', '8-12', '7/1', '9/30', 'August-September', 'All waters', ''],
  ['GA', 'Trico', 'Tricorythodes sp.', 'Mayfly', '22-26', '7/15', '9/30', 'August', 'Limited GA presence, some tailwaters', ''],
  ['GA', 'Fall BWO', 'Baetis sp.', 'Mayfly', '18-22', '9/1', '11/30', 'October-November', 'All waters', 'Strong on Chattahoochee in fall'],
  ['GA', 'October Caddis', 'Neophylax sp.', 'Caddis', '12-16', '9/15', '11/30', 'October', 'Mountain freestones and tailwaters', 'Orange-bodied fall caddis'],
];

// Per-row plan. Many TN+GA rows describe THE SAME pattern (Quill
// Gordon, Hendrickson, Sulphur, etc.) — they get a shared id and
// state-list union. Per-state notes still differ so we update the
// notes only when the entry is being created. Rows that share an id
// just contribute to states[] aggregation.
const PLAN = {
  // shared Eastern patterns — single new entry, states aggregated
  'Tiny Winter BWO': { kind: 'add', id: 'eastern-tiny-winter-bwo', states: ['TN'], rivers: ['Smokies', 'South Holston'] },
  'Early Black Stonefly': { kind: 'add', id: 'eastern-early-black-stonefly', states: ['TN', 'GA', 'NC', 'KY'], rivers: ['Smokies', 'Little River', 'Hiwassee River'] },
  'Little Black Caddis': { kind: 'add', id: 'eastern-little-black-caddis', states: ['TN', 'NC', 'KY'], rivers: ['South Holston', 'Watauga'] },
  'Black Caddis': { kind: 'updateStates', id: 'eastern-little-black-caddis', addStates: ['GA'] }, // same Chimarra species
  'Blue Quill': { kind: 'add', id: 'eastern-blue-quill', states: ['TN', 'GA', 'NC', 'KY'], rivers: ['Little River', 'Tellico River', 'Noontootla Creek'] },
  'Giant Black Stonefly': { kind: 'add', id: 'eastern-giant-black-stonefly', states: ['TN', 'GA', 'NC', 'KY'], rivers: ['Smokies', 'Little River', 'Tellico River', 'Noontootla Creek'] },
  'Eastern Green Drake': { kind: 'add', id: 'eastern-green-drake', states: ['TN', 'GA', 'NC', 'KY', 'PA'], rivers: ['Hiwassee River', 'Little River', 'Penns Creek'] },
  'Cicadas (periodic)': { kind: 'add', id: 'tn-cicadas-periodic', states: ['TN'], rivers: ['Caney Fork', 'Cumberland Plateau'] },
  'Inchworms': { kind: 'add', id: 'eastern-inchworms', states: ['TN', 'GA', 'NC', 'KY', 'PA'], rivers: ['Smokies', 'Noontootla Creek', 'Mountain freestones'] },
  'Yellow Drake': { kind: 'add', id: 'eastern-yellow-drake', states: ['GA', 'NC', 'TN'], rivers: ['Toccoa River'] },
  'Autumn Sedge / October Caddis': { kind: 'add', id: 'eastern-october-caddis-neophylax', states: ['TN', 'NC', 'KY', 'PA'], rivers: ['South Holston', 'Watauga', 'Caney Fork'] },
  'October Caddis': { kind: 'updateStates', id: 'eastern-october-caddis-neophylax', addStates: ['GA'] }, // same Neophylax species
  'Shad Hatch (forage event)': { kind: 'add', id: 'ga-shad-hatch', states: ['GA'], rivers: ['Chattahoochee River'] },

  // Already well-covered — skip
  Midges: { kind: 'skip' },
  BWO: { kind: 'skip' },
  'Spring BWO': { kind: 'skip' },
  'Fall BWO': { kind: 'skip' },
  'Quill Gordon': { kind: 'skip' },
  Hendrickson: { kind: 'skip' },
  'March Brown': { kind: 'skip' },
  Sulphur: { kind: 'skip' },
  'Light Cahill': { kind: 'skip' },
  'Yellow Sally / Little Yellow Stonefly': { kind: 'skip' },
  'Cinnamon Caddis': { kind: 'skip' },
  'Tan/Spotted Sedge Caddis': { kind: 'skip' },
  'Caddis (multiple species)': { kind: 'skip' },
  'Isonychia / Slate Drake': { kind: 'skip' },
  Beetles: { kind: 'skip' },
  'Beetles (incl. Japanese Beetle)': { kind: 'skip' },
  Ants: { kind: 'skip' },
  Hoppers: { kind: 'skip' },
  Trico: { kind: 'skip' },
  'White Fly': { kind: 'skip' },
  'Sowbugs and Scuds': { kind: 'skip' },
};

// Famous Smokies / TN / GA waters used to populate rivers[] on new
// entries so the score river-bonus kicks in for matching spots.
const COMBINED_RIVERS = [
  'Little River', 'Tellico River', 'Hiwassee River', 'South Holston',
  'Watauga', 'Caney Fork', 'Clinch River', 'Nolichucky River',
  'Tuckasegee', 'Toccoa River', 'Noontootla Creek', 'Chattooga River',
  'Chattahoochee River', 'Soque River',
];

const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const byId = new Map(data.map((h) => [h.id, h]));

let updated = 0;
let added = 0;
let skipped = 0;
let unplanned = 0;

for (const row of ROWS) {
  const [state, name, scientific, group, hookSize, startMd, endMd, peak, waters, notes] = row;
  const plan = PLAN[name];
  if (!plan) {
    console.warn(`  unplanned row: "${name}" (${state})`);
    unplanned++;
    continue;
  }

  if (plan.kind === 'skip') {
    skipped++;
    continue;
  }

  if (plan.kind === 'updateStates') {
    const entry = byId.get(plan.id);
    if (!entry) {
      console.warn(`  MISSING update target: ${plan.id}`);
      continue;
    }
    const before = entry.states.length;
    const next = Array.from(new Set([...entry.states, ...plan.addStates]));
    if (next.length !== before) {
      entry.states = next;
      console.log(`  update ${plan.id}: states += ${plan.addStates.join(',')}`);
      updated++;
    }
    continue;
  }

  if (plan.kind === 'add') {
    if (byId.has(plan.id)) {
      // Already created on a previous row — accumulate states/rivers
      // so a TN row + GA row of "Blue Quill" both contribute.
      const entry = byId.get(plan.id);
      const nextStates = Array.from(new Set([...entry.states, state]));
      if (nextStates.length !== entry.states.length) {
        entry.states = nextStates;
        console.log(`  +state ${plan.id} now ${entry.states.join(',')}`);
      }
      continue;
    }
    const startMonth = monthOf(startMd) || 1;
    const endMonth = monthOf(endMd) || 12;
    const [tempMin, tempMax] = waterTempRange(group, startMonth);
    const stages =
      group === 'Mayfly' ? ['dun', 'spinner', 'emerger']
        : group === 'Caddis' ? ['adult', 'pupa', 'larva']
        : group === 'Stonefly' ? ['adult', 'nymph']
        : group === 'Midges' || group === 'Midge' ? ['adult', 'pupa']
        : group === 'Crustacean' ? ['always-on']
        : group === 'Forage fish' ? ['run-pattern']
        : ['adult'];
    const fullStates = Array.from(new Set([state, ...(plan.states || [])]));
    const notesText = [
      peak ? `Peak: ${peak}.` : '',
      waters ? `Best waters: ${waters}.` : '',
      notes,
    ].filter(Boolean).join(' ');
    const entry = {
      id: plan.id,
      name,
      scientific,
      regions: ['Southern Appalachia', 'Mid-Atlantic'],
      states: fullStates,
      rivers: plan.rivers ?? COMBINED_RIVERS,
      startMonth,
      endMonth,
      waterTempMinF: tempMin,
      waterTempMaxF: tempMax,
      timeOfDay: timeOfDayFromCsv(peak || ''),
      stages,
      flies: fliesFor(name, group, hookSize),
      searchTerm: `${scientific.split(/[/,]/)[0].trim()} ${group.toLowerCase()} fly fishing`,
      wikipediaSlug: null,
      notes: notesText,
    };
    data.push(entry);
    byId.set(entry.id, entry);
    console.log(`  +      ${entry.id} (${fullStates.join(',')} · ${startMonth}/${endMonth})`);
    added++;
  }
}

console.log(`\nUpdated states on ${updated} entries.`);
console.log(`Added ${added} new entries.`);
console.log(`Skipped ${skipped} rows (already well-covered).`);
if (unplanned > 0) console.warn(`Unplanned: ${unplanned}`);
console.log(`Total hatches: ${data.length}`);

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log(`Wrote ${FILE}`);
