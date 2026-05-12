/**
 * Michigan Waters Guide — Batch D: NW LP / Traverse area.
 * Antrim, Benzie, Grand Traverse, Kalkaska, Leelanau, Manistee,
 * Wexford, Missaukee, Lake (county). Deep glacial lakes + cold
 * water = smallmouth + lake-trout-eligible habitat.
 */
const fs = require('node:fs');
const path = require('node:path');
const { buildLake } = require('./_mi-lake-template.cjs');
const FILE = path.join(__dirname, '..', 'data', 'waterbodies.json');

const REGION = 'NW Lower Peninsula inland lakes';

const LAKES = [
  // Antrim County (Bellaire / Elk Rapids / Torch chain)
  { name: 'Elk Lake', county: 'Antrim / Grand Traverse', acres: 7730, maxDepthFt: 195, category: 'deep-clear', extraSpecies: ['Lake trout', 'Walleye'] },
  { name: 'Skegemog Lake', county: 'Grand Traverse / Antrim', acres: 2710, maxDepthFt: 38, category: 'mixed', extraSpecies: ['Walleye', 'Muskellunge'] },
  { name: 'Lake Bellaire', county: 'Antrim', acres: 1800, maxDepthFt: 105, category: 'deep-clear', extraSpecies: ['Lake trout'] },
  { name: 'Clam Lake (Antrim)', county: 'Antrim', acres: 220, maxDepthFt: 32, category: 'mixed', idSuffix: 'antrim' },
  { name: 'Intermediate Lake', county: 'Antrim', acres: 1500, maxDepthFt: 80, category: 'deep-clear', extraSpecies: ['Walleye'] },
  { name: 'Six Mile Lake (Antrim)', county: 'Antrim', acres: 415, maxDepthFt: 35, category: 'mixed', idSuffix: 'antrim' },
  { name: 'St. Clair Lake (Antrim)', county: 'Antrim', acres: 130, maxDepthFt: 30, category: 'mixed', idSuffix: 'antrim-stclair' },
  { name: 'Wilson Lake (Antrim)', county: 'Antrim', acres: 100, maxDepthFt: 50, category: 'mixed', idSuffix: 'antrim' },

  // Benzie County
  { name: 'Crystal Lake (Benzie)', county: 'Benzie', acres: 9711, maxDepthFt: 165, category: 'deep-clear', extraSpecies: ['Lake trout'], idSuffix: 'benzie-extra' },
  { name: 'Long Lake (Benzie)', county: 'Benzie', acres: 195, maxDepthFt: 35, category: 'mixed', idSuffix: 'benzie' },
  { name: 'Platte Lake', county: 'Benzie', acres: 2530, maxDepthFt: 95, category: 'deep-clear', extraSpecies: ['Walleye'] },
  { name: 'Little Platte Lake', county: 'Benzie', acres: 575, maxDepthFt: 35, category: 'mixed' },
  { name: 'Pearl Lake (Benzie)', county: 'Benzie', acres: 75, maxDepthFt: 50, category: 'mixed', idSuffix: 'benzie' },
  { name: 'Loon Lake (Benzie)', county: 'Benzie', acres: 50, maxDepthFt: 25, category: 'small-pond', idSuffix: 'benzie' },

  // Grand Traverse County
  { name: 'Boardman Lake', county: 'Grand Traverse', acres: 350, maxDepthFt: 65, category: 'deep-clear' },
  { name: 'Long Lake (Grand Traverse)', county: 'Grand Traverse', acres: 2860, maxDepthFt: 105, category: 'deep-clear', extraSpecies: ['Walleye'], idSuffix: 'gt' },
  { name: 'Silver Lake (Grand Traverse)', county: 'Grand Traverse', acres: 670, maxDepthFt: 35, category: 'mixed', idSuffix: 'gt' },
  { name: 'Bass Lake (Grand Traverse)', county: 'Grand Traverse', acres: 215, maxDepthFt: 60, category: 'deep-clear', idSuffix: 'gt' },
  { name: 'Spider Lake', county: 'Grand Traverse', acres: 410, maxDepthFt: 65, category: 'deep-clear' },
  { name: 'Arbutus Lake', county: 'Grand Traverse', acres: 450, maxDepthFt: 75, category: 'deep-clear' },

  // Kalkaska County
  { name: 'Pickerel Lake (Kalkaska)', county: 'Kalkaska', acres: 295, maxDepthFt: 75, category: 'deep-clear', idSuffix: 'kalkaska' },
  { name: 'Spencer Lake', county: 'Kalkaska', acres: 90, maxDepthFt: 30, category: 'mixed' },
  { name: 'Manistee Lake (Kalkaska)', county: 'Kalkaska', acres: 945, maxDepthFt: 60, category: 'deep-clear', idSuffix: 'kalkaska' },
  { name: 'Lake of the Woods (Kalkaska)', county: 'Kalkaska', acres: 75, maxDepthFt: 30, category: 'mixed', idSuffix: 'kalkaska' },
  { name: 'Bear Lake (Kalkaska)', county: 'Kalkaska', acres: 320, maxDepthFt: 40, category: 'mixed', idSuffix: 'kalkaska' },

  // Leelanau County
  { name: 'Lime Lake', county: 'Leelanau', acres: 745, maxDepthFt: 35, category: 'mixed' },
  { name: 'Cedar Lake (Leelanau)', county: 'Leelanau', acres: 360, maxDepthFt: 75, category: 'deep-clear', idSuffix: 'leelanau' },
  { name: 'Little Glen Lake', county: 'Leelanau', acres: 1410, maxDepthFt: 90, category: 'deep-clear', idSuffix: 'little-glen' },
  { name: 'Big Glen Lake', county: 'Leelanau', acres: 4870, maxDepthFt: 130, category: 'deep-clear', idSuffix: 'big-glen' },
  { name: 'Lake Leelanau', county: 'Leelanau', acres: 8600, maxDepthFt: 120, category: 'deep-clear', extraSpecies: ['Lake trout', 'Walleye'] },
  { name: 'School Lake (Leelanau)', county: 'Leelanau', acres: 75, maxDepthFt: 50, category: 'mixed', idSuffix: 'leelanau' },
  { name: 'Bass Lake (Leelanau)', county: 'Leelanau', acres: 240, maxDepthFt: 35, category: 'mixed', idSuffix: 'leelanau' },
  { name: 'Lake Michigan harbor lagoons (Leelanau)', county: 'Leelanau', acres: 25, maxDepthFt: 12, category: 'small-pond' },

  // Manistee County
  { name: 'Bear Lake (Manistee)', county: 'Manistee', acres: 1740, maxDepthFt: 70, category: 'deep-clear', extraSpecies: ['Walleye'], idSuffix: 'manistee' },
  { name: 'Portage Lake (Manistee)', county: 'Manistee', acres: 2105, maxDepthFt: 70, category: 'deep-clear', extraSpecies: ['Walleye'], idSuffix: 'manistee' },
  { name: 'Manistee Lake (Manistee)', county: 'Manistee', acres: 940, maxDepthFt: 40, category: 'mixed', idSuffix: 'manistee-co' },
  { name: 'Healey Lake (Manistee)', county: 'Manistee', acres: 100, maxDepthFt: 35, category: 'mixed', idSuffix: 'manistee' },
  { name: 'Big Twin Lake (Manistee)', county: 'Manistee', acres: 195, maxDepthFt: 50, category: 'mixed', idSuffix: 'manistee' },

  // Wexford County
  { name: 'Mitchell Lake (Wexford)', county: 'Wexford', acres: 2580, maxDepthFt: 25, category: 'shallow-warmwater', extraSpecies: ['Walleye', 'Muskellunge'], idSuffix: 'wexford' },
  { name: 'Lake Cadillac (Wexford)', county: 'Wexford', acres: 1150, maxDepthFt: 28, category: 'shallow-warmwater', extraSpecies: ['Walleye'], idSuffix: 'wexford' },
  { name: 'Long Lake (Wexford)', county: 'Wexford', acres: 230, maxDepthFt: 60, category: 'deep-clear', idSuffix: 'wexford' },
  { name: 'Cedar Lake (Wexford)', county: 'Wexford', acres: 230, maxDepthFt: 50, category: 'mixed', idSuffix: 'wexford' },
  { name: 'Big Star Lake', county: 'Wexford', acres: 285, maxDepthFt: 40, category: 'mixed' },

  // Missaukee County
  { name: 'Lake Missaukee', county: 'Missaukee', acres: 1880, maxDepthFt: 27, category: 'shallow-warmwater', extraSpecies: ['Walleye'] },
  { name: 'Crooked Lake (Missaukee)', county: 'Missaukee', acres: 615, maxDepthFt: 30, category: 'mixed', idSuffix: 'missaukee' },
  { name: 'Sapphire Lake', county: 'Missaukee', acres: 100, maxDepthFt: 35, category: 'mixed' },
  { name: 'Big Sapphire Lake', county: 'Missaukee', acres: 150, maxDepthFt: 40, category: 'mixed' },

  // Lake County (Baldwin / PM area)
  { name: 'Big Star Lake (Lake)', county: 'Lake', acres: 290, maxDepthFt: 50, category: 'mixed', idSuffix: 'lake-co' },
  { name: 'Wolf Lake (Lake)', county: 'Lake', acres: 270, maxDepthFt: 35, category: 'mixed', idSuffix: 'lake-co' },
  { name: 'Idlewild Lake', county: 'Lake', acres: 75, maxDepthFt: 25, category: 'small-pond' },
  { name: 'Townline Lake', county: 'Lake', acres: 290, maxDepthFt: 60, category: 'deep-clear' },
  { name: 'Hamlin Lake (Lake co)', county: 'Lake', acres: 50, maxDepthFt: 20, category: 'small-pond', idSuffix: 'lake-co' },

  // Charlevoix / Emmet (already have Lake Charlevoix; pad surrounding)
  { name: 'Susan Lake', county: 'Charlevoix', acres: 195, maxDepthFt: 70, category: 'deep-clear' },
  { name: 'Pickerel Lake (Emmet)', county: 'Emmet', acres: 175, maxDepthFt: 35, category: 'mixed', idSuffix: 'emmet' },
  { name: 'Round Lake (Emmet)', county: 'Emmet', acres: 75, maxDepthFt: 50, category: 'mixed', idSuffix: 'emmet' },
  { name: 'Walloon Lake (Charlevoix)', county: 'Charlevoix / Emmet', acres: 4280, maxDepthFt: 100, category: 'deep-clear', extraSpecies: ['Lake trout'], idSuffix: 'walloon-extra' },
  { name: 'Crooked Lake (Emmet)', county: 'Emmet', acres: 2400, maxDepthFt: 65, category: 'deep-clear', extraSpecies: ['Walleye'], idSuffix: 'emmet-crooked' },
  { name: 'Pickerel Lake (Cheboygan)', county: 'Cheboygan', acres: 295, maxDepthFt: 60, category: 'deep-clear', idSuffix: 'cheboygan' },
];

const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const byId = new Map(data.map((w) => [w.id, w]));
let appended = 0, skipped = 0;
for (const r of LAKES) {
  const entry = buildLake({ ...r, region: REGION });
  if (byId.has(entry.id)) { skipped++; continue; }
  data.push(entry); byId.set(entry.id, entry); appended++;
}
console.log(`Appended ${appended}, skipped ${skipped}. Total: ${data.length}`);
fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n', 'utf8');
