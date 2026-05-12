/**
 * Michigan Waters Guide — Batch F: UP inland lakes (light touch
 * per user's note "don't have to work too hard on the UP").
 * Targets ~50 additional UP lakes beyond what the marquee volumes
 * already covered.
 */
const fs = require('node:fs');
const path = require('node:path');
const { buildLake } = require('./_mi-lake-template.cjs');
const FILE = path.join(__dirname, '..', 'data', 'waterbodies.json');

const REGION = 'UP inland lakes';

const LAKES = [
  // Marquette / Baraga / Houghton / Keweenaw — already have Michigamme; light fill
  { name: 'Lake Independence', county: 'Marquette', acres: 1900, maxDepthFt: 35, category: 'mixed', extraSpecies: ['Walleye'] },
  { name: 'Teal Lake', county: 'Marquette', acres: 530, maxDepthFt: 35, category: 'mixed' },
  { name: 'Hovey Lake (UP)', county: 'Marquette', acres: 95, maxDepthFt: 30, category: 'mixed' },
  { name: 'Lake Mary', county: 'Iron', acres: 870, maxDepthFt: 55, category: 'mixed', extraSpecies: ['Walleye'] },
  { name: 'Stanley Lake (UP)', county: 'Iron', acres: 220, maxDepthFt: 50, category: 'mixed' },
  { name: 'Brule Lake', county: 'Iron', acres: 145, maxDepthFt: 40, category: 'mixed' },
  { name: 'Iron Lake', county: 'Iron', acres: 295, maxDepthFt: 45, category: 'mixed' },
  { name: 'Stager Lake', county: 'Iron', acres: 105, maxDepthFt: 30, category: 'mixed' },
  { name: 'Otto Lake (UP)', county: 'Iron', acres: 70, maxDepthFt: 35, category: 'mixed' },

  // Dickinson / Menominee
  { name: 'Lake Antoine', county: 'Dickinson', acres: 740, maxDepthFt: 50, category: 'mixed', extraSpecies: ['Walleye'] },
  { name: 'Hamilton Lake (Dickinson)', county: 'Dickinson', acres: 220, maxDepthFt: 30, category: 'mixed', idSuffix: 'dickinson' },
  { name: 'Cowboy Lake', county: 'Dickinson', acres: 50, maxDepthFt: 25, category: 'small-pond' },
  { name: 'Norway Lake (Dickinson)', county: 'Dickinson', acres: 410, maxDepthFt: 40, category: 'mixed', idSuffix: 'dickinson' },

  // Gogebic / Ontonagon
  { name: 'Lake Gogebic (Ontonagon side)', county: 'Ontonagon', acres: 13380, maxDepthFt: 35, category: 'mixed', extraSpecies: ['Walleye'], idSuffix: 'ontonagon-side' },
  { name: 'Cisco Lake', county: 'Gogebic', acres: 945, maxDepthFt: 40, category: 'mixed' },
  { name: 'Thousand Island Lake', county: 'Gogebic', acres: 970, maxDepthFt: 35, category: 'mixed', extraSpecies: ['Walleye'] },
  { name: 'Tamarack Lake (Gogebic)', county: 'Gogebic', acres: 175, maxDepthFt: 30, category: 'mixed', idSuffix: 'gogebic' },
  { name: 'Pomeroy Lake', county: 'Gogebic', acres: 215, maxDepthFt: 35, category: 'mixed' },
  { name: 'Lac Vieux Desert', county: 'Gogebic', acres: 4017, maxDepthFt: 38, category: 'mixed', extraSpecies: ['Walleye', 'Muskellunge'] },

  // Schoolcraft / Luce / Alger
  { name: 'Big Manistique Lake (UP)', county: 'Luce / Mackinac', acres: 10130, maxDepthFt: 25, category: 'shallow-warmwater', extraSpecies: ['Walleye', 'Muskellunge'], idSuffix: 'big' },
  { name: 'South Manistique Lake', county: 'Luce / Mackinac', acres: 4040, maxDepthFt: 25, category: 'shallow-warmwater', extraSpecies: ['Walleye'] },
  { name: 'Millecoquins Lake', county: 'Mackinac', acres: 1670, maxDepthFt: 25, category: 'shallow-warmwater' },
  { name: 'Lake McDonald', county: 'Luce', acres: 75, maxDepthFt: 30, category: 'mixed' },
  { name: 'Lake Superior State Forest lakes', county: 'Luce', acres: 50, maxDepthFt: 25, category: 'small-pond' },

  // Mackinac / Chippewa
  { name: 'Brevoort Lake (Mackinac)', county: 'Mackinac', acres: 4230, maxDepthFt: 30, category: 'mixed', extraSpecies: ['Walleye'], idSuffix: 'mackinac-extra' },
  { name: 'Caribou Lake', county: 'Chippewa', acres: 1180, maxDepthFt: 30, category: 'mixed' },
  { name: 'Frenchman Lake', county: 'Chippewa', acres: 175, maxDepthFt: 30, category: 'mixed' },
  { name: 'Brimley State Park lake', county: 'Chippewa', acres: 95, maxDepthFt: 25, category: 'small-pond' },

  // Delta County
  { name: 'Lake Antoine (Delta)', county: 'Delta', acres: 90, maxDepthFt: 30, category: 'mixed', idSuffix: 'delta' },
  { name: 'Wells State Park lakes', county: 'Delta', acres: 50, maxDepthFt: 22, category: 'small-pond' },

  // Iron + Gogebic misc
  { name: 'Chicagon Lake', county: 'Iron', acres: 1100, maxDepthFt: 70, category: 'deep-clear', extraSpecies: ['Walleye'] },
  { name: 'Bass Lake (Iron)', county: 'Iron', acres: 100, maxDepthFt: 35, category: 'mixed', idSuffix: 'iron' },
  { name: 'Tepee Lake', county: 'Gogebic', acres: 220, maxDepthFt: 35, category: 'mixed' },
  { name: 'Lake of the Clouds (UP)', county: 'Ontonagon', acres: 133, maxDepthFt: 25, category: 'mixed', idSuffix: 'up-clouds', notes: 'Porcupine Mountains hike-in lake.' },

  // Houghton + Keweenaw misc
  { name: 'Otter Lake (UP)', county: 'Houghton', acres: 95, maxDepthFt: 25, category: 'small-pond', idSuffix: 'up-houghton' },
  { name: 'Lily Lake', county: 'Keweenaw', acres: 50, maxDepthFt: 22, category: 'small-pond' },

  // Misc
  { name: 'Twin Lakes State Park lakes', county: 'Houghton', acres: 90, maxDepthFt: 30, category: 'mixed' },
  { name: 'Perch Lake (UP)', county: 'Alger', acres: 165, maxDepthFt: 35, category: 'mixed', idSuffix: 'up-alger' },
  { name: 'Au Train Lake', county: 'Alger', acres: 800, maxDepthFt: 45, category: 'mixed', extraSpecies: ['Walleye'] },
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
