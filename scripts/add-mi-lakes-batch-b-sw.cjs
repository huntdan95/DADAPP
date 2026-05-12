/**
 * Michigan Waters Guide — Batch B: SW MI inland lakes.
 *
 * Kalamazoo, Cass, Van Buren, Berrien, St. Joseph, Branch, Calhoun
 * counties. Heavy bass-fishing country — the SW MI lakes are smaller
 * and more numerous than the NE LP lakes.
 */
const fs = require('node:fs');
const path = require('node:path');
const { buildLake } = require('./_mi-lake-template.cjs');
const FILE = path.join(__dirname, '..', 'data', 'waterbodies.json');

const REGION = 'SW Michigan inland lakes';

const LAKES = [
  // Kalamazoo County
  { name: 'Gull Lake', county: 'Kalamazoo', acres: 2030, maxDepthFt: 110, category: 'deep-clear', extraSpecies: ['Walleye'] },
  { name: 'Indian Lake (Kalamazoo)', county: 'Kalamazoo', acres: 295, maxDepthFt: 32, category: 'mixed', idSuffix: 'kalamazoo' },
  { name: 'Eagle Lake (Kalamazoo)', county: 'Kalamazoo', acres: 270, maxDepthFt: 55, category: 'deep-clear', idSuffix: 'kalamazoo' },
  { name: 'Long Lake (Kalamazoo)', county: 'Kalamazoo', acres: 280, maxDepthFt: 65, category: 'deep-clear', idSuffix: 'kalamazoo' },
  { name: 'Sherman Lake', county: 'Kalamazoo', acres: 75, maxDepthFt: 35, category: 'mixed' },
  { name: 'Austin Lake', county: 'Kalamazoo', acres: 1100, maxDepthFt: 30, category: 'shallow-warmwater' },
  { name: 'Woods Lake (Kalamazoo)', county: 'Kalamazoo', acres: 130, maxDepthFt: 50, category: 'mixed', idSuffix: 'kalamazoo' },
  { name: 'Pine Lake (Kalamazoo)', county: 'Kalamazoo', acres: 95, maxDepthFt: 60, category: 'deep-clear', idSuffix: 'kalamazoo' },

  // Cass County (rich in natural lakes)
  { name: 'Diamond Lake (Cass)', county: 'Cass', acres: 1020, maxDepthFt: 65, category: 'deep-clear' },
  { name: 'Donnell Lake', county: 'Cass', acres: 240, maxDepthFt: 70, category: 'deep-clear' },
  { name: 'Birch Lake (Cass)', county: 'Cass', acres: 285, maxDepthFt: 55, category: 'deep-clear' },
  { name: 'Christiana Lake', county: 'Cass', acres: 175, maxDepthFt: 60, category: 'deep-clear' },
  { name: 'Eagle Lake (Cass)', county: 'Cass', acres: 200, maxDepthFt: 35, category: 'mixed', idSuffix: 'cass' },
  { name: 'Long Lake (Cass)', county: 'Cass', acres: 75, maxDepthFt: 40, category: 'mixed', idSuffix: 'cass' },
  { name: 'Painter Lake', county: 'Cass', acres: 100, maxDepthFt: 65, category: 'deep-clear' },
  { name: 'Stone Lake', county: 'Cass', acres: 230, maxDepthFt: 75, category: 'deep-clear' },
  { name: 'Magician Lake', county: 'Cass / Van Buren', acres: 540, maxDepthFt: 50, category: 'mixed' },
  { name: 'Juno Lake', county: 'Cass', acres: 230, maxDepthFt: 30, category: 'mixed' },

  // Van Buren County
  { name: 'Lake Cora', county: 'Van Buren', acres: 285, maxDepthFt: 30, category: 'shallow-warmwater' },
  { name: 'Lake Sixteen', county: 'Van Buren', acres: 200, maxDepthFt: 35, category: 'mixed' },
  { name: 'Eagle Lake (Van Buren)', county: 'Van Buren', acres: 280, maxDepthFt: 25, category: 'shallow-warmwater', idSuffix: 'vanburen' },
  { name: 'Paw Paw Lake', county: 'Berrien', acres: 880, maxDepthFt: 90, category: 'deep-clear' },
  { name: 'Round Lake (Van Buren)', county: 'Van Buren', acres: 220, maxDepthFt: 55, category: 'deep-clear', idSuffix: 'vanburen' },
  { name: 'Lake of the Woods (Van Buren)', county: 'Van Buren', acres: 215, maxDepthFt: 60, category: 'deep-clear', idSuffix: 'vanburen' },
  { name: 'Hutchins Lake', county: 'Allegan', acres: 410, maxDepthFt: 30, category: 'shallow-warmwater' },
  { name: 'Three Mile Lake', county: 'Van Buren', acres: 130, maxDepthFt: 30, category: 'mixed' },
  { name: 'Pine Lake (Van Buren)', county: 'Van Buren', acres: 180, maxDepthFt: 45, category: 'mixed', idSuffix: 'vanburen' },

  // Berrien County
  { name: 'Lake Chapin', county: 'Berrien', acres: 600, maxDepthFt: 35, category: 'reservoir' },
  { name: 'Pipestone Lake', county: 'Berrien', acres: 50, maxDepthFt: 25, category: 'small-pond' },
  { name: 'Round Lake (Berrien)', county: 'Berrien', acres: 75, maxDepthFt: 40, category: 'mixed', idSuffix: 'berrien' },
  { name: 'Lake Tahoe Marie', county: 'Berrien', acres: 25, maxDepthFt: 20, category: 'small-pond' },
  { name: 'Lake Diamond (Cass-Berrien)', county: 'Berrien', acres: 100, maxDepthFt: 40, category: 'mixed', idSuffix: 'berrien' },

  // St. Joseph County
  { name: 'Klinger Lake', county: 'St. Joseph', acres: 815, maxDepthFt: 50, category: 'mixed' },
  { name: 'Corey Lake', county: 'St. Joseph', acres: 645, maxDepthFt: 60, category: 'deep-clear' },
  { name: 'Sturgeon Lake (St. Joseph)', county: 'St. Joseph', acres: 250, maxDepthFt: 40, category: 'mixed', idSuffix: 'stjoseph' },
  { name: 'Long Lake (St. Joseph)', county: 'St. Joseph', acres: 150, maxDepthFt: 35, category: 'mixed', idSuffix: 'stjoseph' },
  { name: 'Big Fish Lake', county: 'St. Joseph', acres: 280, maxDepthFt: 55, category: 'deep-clear' },
  { name: 'Pleasant Lake (St. Joseph)', county: 'St. Joseph', acres: 175, maxDepthFt: 25, category: 'shallow-warmwater', idSuffix: 'stjoseph' },
  { name: 'Fishers Lake', county: 'St. Joseph', acres: 195, maxDepthFt: 40, category: 'mixed' },
  { name: 'Lake of the Woods (St. Joseph)', county: 'St. Joseph', acres: 100, maxDepthFt: 30, category: 'mixed', idSuffix: 'stjoseph' },
  { name: 'Wall Lake (St. Joseph)', county: 'St. Joseph', acres: 215, maxDepthFt: 55, category: 'deep-clear', idSuffix: 'stjoseph' },

  // Branch County
  { name: 'Lake of the Woods (Branch)', county: 'Branch', acres: 320, maxDepthFt: 40, category: 'mixed', idSuffix: 'branch' },
  { name: 'Coldwater Lake', county: 'Branch', acres: 1610, maxDepthFt: 100, category: 'deep-clear', extraSpecies: ['Walleye'] },
  { name: 'Marble Lake', county: 'Branch', acres: 480, maxDepthFt: 60, category: 'deep-clear' },
  { name: 'Long Lake (Branch)', county: 'Branch', acres: 175, maxDepthFt: 50, category: 'mixed', idSuffix: 'branch' },
  { name: 'Randall Lake', county: 'Branch', acres: 75, maxDepthFt: 35, category: 'mixed' },
  { name: 'Cary Lake', county: 'Branch', acres: 75, maxDepthFt: 50, category: 'mixed' },
  { name: 'Morrison Lake (Branch)', county: 'Branch', acres: 90, maxDepthFt: 40, category: 'mixed', idSuffix: 'branch' },

  // Calhoun County
  { name: 'Goguac Lake', county: 'Calhoun', acres: 350, maxDepthFt: 40, category: 'mixed' },
  { name: 'Lyon Lake (Calhoun)', county: 'Calhoun', acres: 145, maxDepthFt: 35, category: 'mixed' },
  { name: 'Pine Lake (Calhoun)', county: 'Calhoun', acres: 195, maxDepthFt: 25, category: 'shallow-warmwater', idSuffix: 'calhoun' },
  { name: 'Duck Lake (Calhoun)', county: 'Calhoun', acres: 290, maxDepthFt: 30, category: 'mixed', idSuffix: 'calhoun' },
  { name: 'Lake Columbia (Calhoun)', county: 'Calhoun', acres: 290, maxDepthFt: 35, category: 'mixed', idSuffix: 'calhoun' },

  // Allegan County
  { name: 'Lake Allegan', county: 'Allegan', acres: 1640, maxDepthFt: 25, category: 'reservoir' },
  { name: 'Eagle Lake (Allegan)', county: 'Allegan', acres: 95, maxDepthFt: 50, category: 'mixed', idSuffix: 'allegan' },
  { name: 'Hutchins Lake (Allegan)', county: 'Allegan', acres: 410, maxDepthFt: 30, category: 'shallow-warmwater', idSuffix: 'allegan' },
  { name: 'Selkirk Lake', county: 'Allegan', acres: 175, maxDepthFt: 30, category: 'mixed' },
  { name: 'Pine Lake (Allegan)', county: 'Allegan', acres: 165, maxDepthFt: 35, category: 'mixed', idSuffix: 'allegan' },
  { name: 'Macatawa (Lake Macatawa)', county: 'Ottawa', acres: 1780, maxDepthFt: 40, category: 'mixed', extraSpecies: ['Walleye'] },
  { name: 'Ottawa Lake (Allegan)', county: 'Allegan', acres: 40, maxDepthFt: 22, category: 'small-pond', idSuffix: 'allegan' },

  // Berrien / SW MI extras
  { name: 'Bear Lake (Berrien)', county: 'Berrien', acres: 65, maxDepthFt: 40, category: 'mixed', idSuffix: 'berrien' },
  { name: 'Lake Cora (Berrien)', county: 'Berrien', acres: 100, maxDepthFt: 30, category: 'mixed', idSuffix: 'berrien' },
  { name: 'Crystal Lake (Berrien)', county: 'Berrien', acres: 50, maxDepthFt: 30, category: 'small-pond', idSuffix: 'berrien' },

  // Kalamazoo + Barry overlap
  { name: 'Sunset Lake (Kalamazoo)', county: 'Kalamazoo', acres: 50, maxDepthFt: 25, category: 'small-pond' },
  { name: 'Wintergreen Lake', county: 'Kalamazoo', acres: 100, maxDepthFt: 30, category: 'mixed', notes: 'WK Kellogg Bird Sanctuary lake — restricted fishing access; included for completeness.' },

  // Barry County
  { name: 'Gull Lake (Barry)', county: 'Barry', acres: 2030, maxDepthFt: 110, category: 'deep-clear', idSuffix: 'barry', notes: 'Barry County side of Gull Lake — premier deep clear bass + walleye water.' },
  { name: 'Gun Lake', county: 'Barry / Allegan', acres: 2680, maxDepthFt: 60, category: 'deep-clear', extraSpecies: ['Walleye', 'Muskellunge'] },
  { name: 'Yankee Springs lakes', county: 'Barry', acres: 80, maxDepthFt: 30, category: 'mixed' },
  { name: 'Pine Lake (Barry)', county: 'Barry', acres: 75, maxDepthFt: 35, category: 'mixed', idSuffix: 'barry' },
  { name: 'Wall Lake (Barry)', county: 'Barry', acres: 290, maxDepthFt: 60, category: 'deep-clear', idSuffix: 'barry' },

  // Eaton + Ingham County
  { name: 'Park Lake (Eaton)', county: 'Eaton', acres: 115, maxDepthFt: 22, category: 'shallow-warmwater', idSuffix: 'eaton' },
  { name: 'Lake Lansing (Ingham)', county: 'Ingham', acres: 460, maxDepthFt: 45, category: 'mixed', idSuffix: 'ingham' },
];

const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const byId = new Map(data.map((w) => [w.id, w]));
let appended = 0;
let skipped = 0;
for (const record of LAKES) {
  const entry = buildLake({ ...record, region: REGION });
  if (byId.has(entry.id)) { skipped++; continue; }
  data.push(entry);
  byId.set(entry.id, entry);
  appended++;
}
console.log(`Appended ${appended}, skipped ${skipped}. Total: ${data.length}`);
fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n', 'utf8');
