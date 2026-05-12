/**
 * Michigan Waters Guide — Batch A: SE MI suburban inland lakes.
 *
 * Densely-populated region — Oakland County alone has 450+ named
 * lakes. These are the lakes Tigers fans + Pistons fans + commuters
 * actually fish on summer weekends. Coverage skews toward "your spot
 * shows up in the Waters Guide" rather than encyclopedic depth.
 *
 * Template-driven via `_mi-lake-template.cjs`. Marquee waters (Lake
 * St. Clair, Cass Lake, Wixom, Pinckney Chain, etc.) already have
 * hand-curated entries — those get skipped via idempotent merge.
 */
const fs = require('node:fs');
const path = require('node:path');
const { buildLake } = require('./_mi-lake-template.cjs');
const FILE = path.join(__dirname, '..', 'data', 'waterbodies.json');

const REGION = 'SE Michigan inland lakes';

// Compact records — name, county, acres, max depth, category.
// Categories: 'shallow-warmwater' | 'mixed' | 'deep-clear' | 'reservoir' | 'small-pond'
const LAKES = [
  // Oakland County (the lake-dense suburban hub)
  { name: 'Union Lake', county: 'Oakland', acres: 465, maxDepthFt: 110, category: 'deep-clear' },
  { name: 'Pine Lake', county: 'Oakland', acres: 380, maxDepthFt: 85, category: 'deep-clear' },
  { name: 'Upper Long Lake', county: 'Oakland', acres: 145, maxDepthFt: 90, category: 'deep-clear' },
  { name: 'Lower Long Lake', county: 'Oakland', acres: 215, maxDepthFt: 50, category: 'mixed' },
  { name: 'Lake Sherwood', county: 'Oakland', acres: 175, maxDepthFt: 32, category: 'mixed' },
  { name: 'Wolverine Lake', county: 'Oakland', acres: 250, maxDepthFt: 30, category: 'mixed' },
  { name: 'Maceday Lake', county: 'Oakland', acres: 270, maxDepthFt: 117, category: 'deep-clear' },
  { name: 'Lotus Lake', county: 'Oakland', acres: 195, maxDepthFt: 50, category: 'mixed' },
  { name: 'Oakland Lake', county: 'Oakland', acres: 25, maxDepthFt: 20, category: 'small-pond' },
  { name: 'Square Lake', county: 'Oakland', acres: 75, maxDepthFt: 70, category: 'deep-clear' },
  { name: 'Sylvan Lake (Oakland)', county: 'Oakland', acres: 220, maxDepthFt: 50, category: 'mixed', idSuffix: 'oakland' },
  { name: 'Otter Lake', county: 'Oakland', acres: 100, maxDepthFt: 50, category: 'mixed' },
  { name: 'White Lake (Oakland)', county: 'Oakland', acres: 540, maxDepthFt: 90, category: 'deep-clear', idSuffix: 'oakland' },
  { name: 'Williams Lake', county: 'Oakland', acres: 200, maxDepthFt: 76, category: 'deep-clear' },
  { name: 'Loon Lake (Oakland)', county: 'Oakland', acres: 220, maxDepthFt: 65, category: 'deep-clear', idSuffix: 'oakland' },
  { name: 'Big Lake', county: 'Oakland', acres: 240, maxDepthFt: 70, category: 'deep-clear' },
  { name: 'Greens Lake', county: 'Oakland', acres: 95, maxDepthFt: 60, category: 'deep-clear' },
  { name: 'Pontiac Lake', county: 'Oakland', acres: 580, maxDepthFt: 22, category: 'shallow-warmwater', extraSpecies: ['Walleye'] },
  { name: 'Crooked Lake (Oakland)', county: 'Oakland', acres: 100, maxDepthFt: 35, category: 'mixed', idSuffix: 'oakland' },
  { name: 'Big Seven Lake', county: 'Oakland', acres: 75, maxDepthFt: 60, category: 'deep-clear' },
  { name: 'Stony Creek Lake', county: 'Oakland/Macomb', acres: 500, maxDepthFt: 35, category: 'reservoir', extraSpecies: ['Walleye'] },
  { name: 'Lake Orion', county: 'Oakland', acres: 480, maxDepthFt: 85, category: 'deep-clear' },
  { name: 'Cedar Island Lake', county: 'Oakland', acres: 90, maxDepthFt: 90, category: 'deep-clear' },
  { name: 'Indianwood Lake', county: 'Oakland', acres: 245, maxDepthFt: 35, category: 'mixed' },
  { name: 'Bald Eagle Lake', county: 'Oakland', acres: 575, maxDepthFt: 110, category: 'deep-clear' },
  { name: 'Bushman Lake', county: 'Oakland', acres: 95, maxDepthFt: 75, category: 'deep-clear' },
  { name: 'Davisburg Lake', county: 'Oakland', acres: 140, maxDepthFt: 60, category: 'deep-clear' },
  { name: 'Halfmoon Lake (Oakland)', county: 'Oakland', acres: 75, maxDepthFt: 35, category: 'mixed', idSuffix: 'oakland' },

  // Wayne / Macomb / Monroe — fewer natural lakes; Lake St. Clair already covered
  { name: 'Belleville Lake', county: 'Wayne', acres: 1270, maxDepthFt: 25, category: 'reservoir', extraSpecies: ['Walleye', 'Smallmouth bass'] },
  { name: 'Ford Lake', county: 'Washtenaw', acres: 975, maxDepthFt: 40, category: 'reservoir', extraSpecies: ['Walleye'] },
  { name: 'Sterling State Park lagoons', county: 'Monroe', acres: 80, maxDepthFt: 12, category: 'small-pond' },
  { name: 'Lake Erie Metropark lagoons', county: 'Wayne', acres: 50, maxDepthFt: 8, category: 'small-pond' },

  // Washtenaw County (Ann Arbor area)
  { name: 'Portage Lake (Washtenaw)', county: 'Washtenaw', acres: 645, maxDepthFt: 79, category: 'deep-clear', idSuffix: 'washtenaw' },
  { name: 'Joslin Lake', county: 'Washtenaw', acres: 180, maxDepthFt: 45, category: 'mixed' },
  { name: 'Independence Lake', county: 'Washtenaw', acres: 215, maxDepthFt: 53, category: 'mixed' },
  { name: 'Sugarloaf Lake', county: 'Washtenaw', acres: 195, maxDepthFt: 30, category: 'shallow-warmwater' },
  { name: 'Whitmore Lake (Washtenaw)', county: 'Washtenaw', acres: 685, maxDepthFt: 70, category: 'deep-clear', idSuffix: 'washtenaw' },
  { name: 'Geddes Pond', county: 'Washtenaw', acres: 65, maxDepthFt: 12, category: 'small-pond' },
  { name: 'Argo Pond', county: 'Washtenaw', acres: 75, maxDepthFt: 8, category: 'small-pond' },
  { name: 'North Lake', county: 'Washtenaw', acres: 305, maxDepthFt: 50, category: 'mixed' },
  { name: 'Half Moon Lake (Washtenaw)', county: 'Washtenaw', acres: 290, maxDepthFt: 75, category: 'deep-clear', idSuffix: 'washtenaw' },
  { name: 'Patterson Lake', county: 'Washtenaw', acres: 220, maxDepthFt: 50, category: 'mixed' },
  { name: 'Watkins Lake', county: 'Washtenaw', acres: 280, maxDepthFt: 22, category: 'shallow-warmwater' },

  // Livingston County (Brighton / Howell area)
  { name: 'Lake Chemung', county: 'Livingston', acres: 320, maxDepthFt: 70, category: 'deep-clear' },
  { name: 'Lake Shannon', county: 'Livingston', acres: 350, maxDepthFt: 80, category: 'deep-clear' },
  { name: 'Brighton Lake', county: 'Livingston', acres: 230, maxDepthFt: 40, category: 'mixed' },
  { name: 'School Lake', county: 'Livingston', acres: 85, maxDepthFt: 35, category: 'mixed' },
  { name: 'Lake Tyrone', county: 'Livingston', acres: 195, maxDepthFt: 65, category: 'deep-clear' },
  { name: 'Strawberry Lake', county: 'Livingston', acres: 280, maxDepthFt: 75, category: 'deep-clear' },
  { name: 'Zukey Lake', county: 'Livingston', acres: 150, maxDepthFt: 60, category: 'mixed' },
  { name: 'Gallagher Lake', county: 'Livingston', acres: 150, maxDepthFt: 60, category: 'mixed' },
  { name: 'Cordley Lake', county: 'Livingston', acres: 50, maxDepthFt: 25, category: 'small-pond' },
  { name: 'Bishop Lake', county: 'Livingston', acres: 110, maxDepthFt: 35, category: 'mixed' },
  { name: 'Lake Shannon (Livingston)', county: 'Livingston', acres: 350, maxDepthFt: 80, category: 'deep-clear', idSuffix: 'livingston' },
  { name: 'Hi-Land Lake', county: 'Livingston', acres: 175, maxDepthFt: 65, category: 'deep-clear' },

  // Genesee County (Flint area)
  { name: 'Lake Fenton', county: 'Genesee', acres: 845, maxDepthFt: 90, category: 'deep-clear', extraSpecies: ['Walleye'] },
  { name: 'Linden Lake', county: 'Genesee', acres: 105, maxDepthFt: 35, category: 'mixed' },
  { name: 'Lobdell Lake', county: 'Genesee', acres: 410, maxDepthFt: 60, category: 'deep-clear' },
  { name: 'Long Lake (Genesee)', county: 'Genesee', acres: 200, maxDepthFt: 22, category: 'shallow-warmwater', idSuffix: 'genesee' },
  { name: 'Mott Lake', county: 'Genesee', acres: 165, maxDepthFt: 30, category: 'mixed' },
  { name: 'Holloway Reservoir', county: 'Genesee', acres: 1900, maxDepthFt: 40, category: 'reservoir', extraSpecies: ['Walleye'] },

  // Lapeer County
  { name: 'Lake Nepessing', county: 'Lapeer', acres: 350, maxDepthFt: 22, category: 'shallow-warmwater' },
  { name: 'Lake Pleasant (Lapeer)', county: 'Lapeer', acres: 50, maxDepthFt: 30, category: 'small-pond', idSuffix: 'lapeer' },
  { name: 'Cedar Lake (Lapeer)', county: 'Lapeer', acres: 230, maxDepthFt: 35, category: 'mixed', idSuffix: 'lapeer' },
  { name: 'Lake Minnewanna', county: 'Lapeer', acres: 175, maxDepthFt: 25, category: 'shallow-warmwater' },

  // St. Clair County (Port Huron area)
  { name: 'Lake Huron pier shoreline (Port Huron)', county: 'St. Clair', acres: 50, maxDepthFt: 25, category: 'mixed', notes: 'Lake Huron pier + breakwater fishing — perch + smallmouth + steelhead seasonal.' },
  { name: 'Sanilac County inland lakes', county: 'Sanilac', acres: 100, maxDepthFt: 35, category: 'mixed', notes: 'Smaller Sanilac County inland lakes — standard MI fishery.' },

  // Hillsdale + Lenawee + Branch + Hillsdale (south-tier counties)
  { name: 'Lake Le Ann (Hillsdale)', county: 'Hillsdale', acres: 250, maxDepthFt: 50, category: 'mixed' },
  { name: 'Lake Hudson (Hillsdale)', county: 'Hillsdale', acres: 545, maxDepthFt: 80, category: 'deep-clear', extraSpecies: ['Muskellunge'] },
  { name: 'Bird Lake (Hillsdale)', county: 'Hillsdale', acres: 290, maxDepthFt: 35, category: 'mixed' },
  { name: 'Long Lake (Hillsdale)', county: 'Hillsdale', acres: 280, maxDepthFt: 60, category: 'deep-clear', idSuffix: 'hillsdale' },
  { name: 'Lake Diane', county: 'Hillsdale', acres: 165, maxDepthFt: 45, category: 'mixed' },
  { name: 'Cement City Lake (Lake Columbia)', county: 'Lenawee', acres: 815, maxDepthFt: 25, category: 'shallow-warmwater', extraSpecies: ['Walleye'] },
  { name: 'Lake Adrian', county: 'Lenawee', acres: 95, maxDepthFt: 30, category: 'mixed' },
  { name: 'Round Lake (Lenawee)', county: 'Lenawee', acres: 215, maxDepthFt: 55, category: 'deep-clear', idSuffix: 'lenawee' },
  { name: 'Sand Lake (Lenawee)', county: 'Lenawee', acres: 195, maxDepthFt: 65, category: 'deep-clear', idSuffix: 'lenawee' },
  { name: 'Posey Lake', county: 'Hillsdale', acres: 200, maxDepthFt: 30, category: 'mixed' },
  { name: 'Lake Lewerenz', county: 'Lenawee', acres: 90, maxDepthFt: 25, category: 'small-pond' },

  // Jackson County
  { name: 'Clark Lake (Jackson)', county: 'Jackson', acres: 590, maxDepthFt: 90, category: 'deep-clear' },
  { name: 'Wamplers Lake (Jackson)', county: 'Jackson', acres: 770, maxDepthFt: 75, category: 'deep-clear', idSuffix: 'jackson' },
  { name: 'Lake Columbia (Jackson)', county: 'Jackson', acres: 815, maxDepthFt: 25, category: 'shallow-warmwater', idSuffix: 'jackson' },
  { name: 'Round Lake (Jackson)', county: 'Jackson', acres: 165, maxDepthFt: 50, category: 'mixed', idSuffix: 'jackson' },
  { name: 'Lake Vineyard', county: 'Jackson', acres: 295, maxDepthFt: 60, category: 'deep-clear' },
  { name: 'Center Lake (Jackson)', county: 'Jackson', acres: 95, maxDepthFt: 45, category: 'mixed', idSuffix: 'jackson' },
  { name: 'Browns Lake (Jackson)', county: 'Jackson', acres: 145, maxDepthFt: 60, category: 'deep-clear', idSuffix: 'jackson' },
  { name: 'Big Wolf Lake', county: 'Jackson', acres: 320, maxDepthFt: 70, category: 'deep-clear' },
  { name: 'Lansing Reservoir / Park Lake', county: 'Clinton', acres: 200, maxDepthFt: 25, category: 'shallow-warmwater' },

  // Macomb County
  { name: 'Lake St. Clair Metropark canals', county: 'Macomb', acres: 50, maxDepthFt: 8, category: 'small-pond', notes: 'Macomb metro canal system — kid-fishing + panfish.' },

  // Misc SE MI satellite lakes
  { name: 'Walters Lake (Oakland)', county: 'Oakland', acres: 50, maxDepthFt: 28, category: 'small-pond' },
  { name: 'Eagle Lake (Oakland)', county: 'Oakland', acres: 100, maxDepthFt: 50, category: 'mixed' },
  { name: 'Forest Lake', county: 'Oakland', acres: 80, maxDepthFt: 45, category: 'mixed' },
  { name: 'Marl Lake (Oakland)', county: 'Oakland', acres: 35, maxDepthFt: 20, category: 'small-pond' },
  { name: 'Heron Lake', county: 'Oakland', acres: 30, maxDepthFt: 20, category: 'small-pond' },
  { name: 'Hagle Lake', county: 'Oakland', acres: 25, maxDepthFt: 18, category: 'small-pond' },
  { name: 'Schoolhouse Lake', county: 'Oakland', acres: 75, maxDepthFt: 50, category: 'mixed' },
  { name: 'Greens Lake (Oakland)', county: 'Oakland', acres: 95, maxDepthFt: 60, category: 'deep-clear', idSuffix: 'oakland-greens' },
  { name: 'Carpenter Lake (Oakland)', county: 'Oakland', acres: 40, maxDepthFt: 25, category: 'small-pond' },
  { name: 'Lower Pettibone Lake', county: 'Oakland', acres: 50, maxDepthFt: 25, category: 'small-pond' },
  { name: 'Upper Pettibone Lake', county: 'Oakland', acres: 30, maxDepthFt: 20, category: 'small-pond' },

  // Big urban-fringe waters
  { name: 'Stony Creek Lake (Macomb)', county: 'Macomb', acres: 500, maxDepthFt: 35, category: 'reservoir', extraSpecies: ['Walleye'], idSuffix: 'macomb' },
  { name: 'Heritage Park lakes (Farmington Hills)', county: 'Oakland', acres: 40, maxDepthFt: 18, category: 'small-pond' },
  { name: 'Maybury State Park ponds', county: 'Wayne', acres: 30, maxDepthFt: 15, category: 'small-pond' },
  { name: 'Holly State Recreation Area lakes', county: 'Oakland', acres: 200, maxDepthFt: 50, category: 'mixed' },
  { name: 'Highland State Recreation Area lakes', county: 'Oakland', acres: 250, maxDepthFt: 60, category: 'deep-clear' },
  { name: 'Brighton State Recreation Area lakes', county: 'Livingston', acres: 220, maxDepthFt: 50, category: 'mixed' },
  { name: 'Island Lake State Recreation Area', county: 'Livingston', acres: 280, maxDepthFt: 35, category: 'mixed' },
  { name: 'Proud Lake State Recreation Area', county: 'Oakland', acres: 600, maxDepthFt: 25, category: 'shallow-warmwater', extraSpecies: ['Walleye'] },

  // Genesee + Shiawassee + Saginaw inland
  { name: 'Holloway Reservoir (Genesee)', county: 'Genesee', acres: 1900, maxDepthFt: 40, category: 'reservoir', extraSpecies: ['Walleye'], idSuffix: 'genesee-reservoir' },
  { name: 'Mott Lake (Genesee)', county: 'Genesee', acres: 165, maxDepthFt: 30, category: 'mixed', idSuffix: 'genesee' },
  { name: 'Lake Ovid', county: 'Clinton', acres: 410, maxDepthFt: 30, category: 'mixed', extraSpecies: ['Walleye'] },
  { name: 'Sleepy Hollow State Park lake', county: 'Clinton', acres: 410, maxDepthFt: 30, category: 'mixed' },
];

const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const byId = new Map(data.map((w) => [w.id, w]));

let appended = 0;
let skipped = 0;
for (const record of LAKES) {
  const entry = buildLake({ ...record, region: REGION });
  if (byId.has(entry.id)) {
    skipped++;
    continue;
  }
  data.push(entry);
  byId.set(entry.id, entry);
  appended++;
}

console.log(`Appended ${appended}, skipped ${skipped} (already present). Total: ${data.length}`);
fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n', 'utf8');
