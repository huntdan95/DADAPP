/**
 * Michigan Waters Guide — Batch E: NE LP inland lakes.
 * Otsego, Crawford, Roscommon, Ogemaw, Oscoda, Alcona, Alpena,
 * Cheboygan, Montmorency, Presque Isle, Iosco, Gladwin, Arenac.
 */
const fs = require('node:fs');
const path = require('node:path');
const { buildLake } = require('./_mi-lake-template.cjs');
const FILE = path.join(__dirname, '..', 'data', 'waterbodies.json');

const REGION = 'NE Lower Peninsula inland lakes';

const LAKES = [
  // Otsego County (Gaylord area)
  { name: 'Otsego Lake', county: 'Otsego', acres: 1972, maxDepthFt: 60, category: 'deep-clear', extraSpecies: ['Walleye'] },
  { name: 'Big Bradford Lake', county: 'Otsego', acres: 190, maxDepthFt: 35, category: 'mixed' },
  { name: 'Heart Lake (Otsego)', county: 'Otsego', acres: 105, maxDepthFt: 30, category: 'mixed', idSuffix: 'otsego' },
  { name: 'Manuka Lake', county: 'Otsego', acres: 80, maxDepthFt: 25, category: 'small-pond' },
  { name: 'Bradford Lake', county: 'Otsego', acres: 95, maxDepthFt: 35, category: 'mixed' },
  { name: 'Lake Marjory', county: 'Otsego', acres: 50, maxDepthFt: 22, category: 'small-pond' },

  // Crawford County (Grayling area)
  { name: 'Higgins Lake (Crawford)', county: 'Crawford', acres: 9900, maxDepthFt: 135, category: 'deep-clear', extraSpecies: ['Lake trout'], idSuffix: 'crawford-side', notes: 'Crawford County shoreline of Higgins Lake — main entry under mi-higgins-lake.' },
  { name: 'Big Lake (Crawford)', county: 'Crawford', acres: 200, maxDepthFt: 35, category: 'mixed', idSuffix: 'crawford' },
  { name: 'Lake Margrethe', county: 'Crawford', acres: 1900, maxDepthFt: 65, category: 'deep-clear', extraSpecies: ['Walleye'] },
  { name: 'Bear Lake (Crawford)', county: 'Crawford', acres: 25, maxDepthFt: 20, category: 'small-pond', idSuffix: 'crawford' },
  { name: 'Beaver Lake (Crawford)', county: 'Crawford', acres: 75, maxDepthFt: 25, category: 'small-pond', idSuffix: 'crawford' },
  { name: 'Lost Lake (Crawford)', county: 'Crawford', acres: 50, maxDepthFt: 25, category: 'small-pond', idSuffix: 'crawford' },

  // Roscommon County (Higgins + Houghton already covered; pad surrounding)
  { name: 'Crooked Lake (Roscommon)', county: 'Roscommon', acres: 145, maxDepthFt: 30, category: 'mixed', idSuffix: 'roscommon' },
  { name: 'East Twin Lake (Roscommon)', county: 'Roscommon', acres: 250, maxDepthFt: 40, category: 'mixed', idSuffix: 'roscommon' },
  { name: 'Marl Lake (Roscommon)', county: 'Roscommon', acres: 195, maxDepthFt: 50, category: 'mixed', idSuffix: 'roscommon' },
  { name: 'Bass Lake (Roscommon)', county: 'Roscommon', acres: 100, maxDepthFt: 30, category: 'mixed', idSuffix: 'roscommon' },

  // Ogemaw County
  { name: 'Sand Lake (Ogemaw)', county: 'Ogemaw', acres: 230, maxDepthFt: 35, category: 'mixed', idSuffix: 'ogemaw' },
  { name: 'Rifle Lake', county: 'Ogemaw', acres: 95, maxDepthFt: 25, category: 'mixed' },
  { name: 'Foote Pond', county: 'Iosco', acres: 1980, maxDepthFt: 40, category: 'reservoir', notes: 'Lower Au Sable impoundment behind Foote Dam.' },
  { name: 'Cooke Pond', county: 'Iosco', acres: 1700, maxDepthFt: 35, category: 'reservoir' },
  { name: 'Loud Pond', county: 'Oscoda', acres: 950, maxDepthFt: 30, category: 'reservoir' },
  { name: 'Five Channels Pond', county: 'Iosco', acres: 1300, maxDepthFt: 30, category: 'reservoir' },
  { name: 'Mio Pond', county: 'Oscoda', acres: 1500, maxDepthFt: 35, category: 'reservoir', extraSpecies: ['Brown trout'] },
  { name: 'Alcona Pond', county: 'Alcona', acres: 1100, maxDepthFt: 50, category: 'reservoir', extraSpecies: ['Brown trout'] },

  // Oscoda County
  { name: 'Twin Lakes (Oscoda)', county: 'Oscoda', acres: 175, maxDepthFt: 35, category: 'mixed', idSuffix: 'oscoda' },
  { name: 'McKinley Lake', county: 'Oscoda', acres: 50, maxDepthFt: 22, category: 'small-pond' },
  { name: 'Tea Lake', county: 'Oscoda', acres: 95, maxDepthFt: 30, category: 'mixed' },

  // Alcona County
  { name: 'Hubbard Lake (Alcona)', county: 'Alcona', acres: 8845, maxDepthFt: 85, category: 'deep-clear', extraSpecies: ['Walleye', 'Lake trout'], idSuffix: 'alcona' },
  { name: 'Vaughn Lake', county: 'Alcona', acres: 105, maxDepthFt: 30, category: 'mixed' },
  { name: 'Jewell Lake', county: 'Alcona', acres: 195, maxDepthFt: 35, category: 'mixed' },
  { name: 'Sucker Lake (Alcona)', county: 'Alcona', acres: 90, maxDepthFt: 25, category: 'small-pond', idSuffix: 'alcona' },

  // Alpena County
  { name: 'Long Lake (Alpena)', county: 'Alpena', acres: 5650, maxDepthFt: 32, category: 'mixed', extraSpecies: ['Walleye'], idSuffix: 'alpena' },
  { name: 'Beaver Lake (Alpena)', county: 'Alpena', acres: 100, maxDepthFt: 35, category: 'mixed', idSuffix: 'alpena' },
  { name: 'Devil Lake (Alpena)', county: 'Alpena', acres: 90, maxDepthFt: 30, category: 'mixed', idSuffix: 'alpena' },
  { name: 'Grand Lake (Presque Isle)', county: 'Presque Isle', acres: 5560, maxDepthFt: 65, category: 'deep-clear', extraSpecies: ['Walleye'] },
  { name: 'Long Lake (Presque Isle)', county: 'Presque Isle', acres: 5840, maxDepthFt: 30, category: 'mixed', extraSpecies: ['Walleye'], idSuffix: 'presque-isle' },

  // Cheboygan County (already have Mullett + Burt + Black)
  { name: 'Long Lake (Cheboygan)', county: 'Cheboygan', acres: 295, maxDepthFt: 35, category: 'mixed', idSuffix: 'cheboygan' },
  { name: 'Crooked Lake (Cheboygan)', county: 'Cheboygan', acres: 2270, maxDepthFt: 65, category: 'deep-clear', extraSpecies: ['Walleye', 'Muskellunge'], idSuffix: 'cheboygan-crooked' },
  { name: 'Douglas Lake (Cheboygan)', county: 'Cheboygan', acres: 3380, maxDepthFt: 80, category: 'deep-clear', extraSpecies: ['Lake trout'], idSuffix: 'cheboygan' },
  { name: 'Burt Lake state-park ponds', county: 'Cheboygan', acres: 80, maxDepthFt: 18, category: 'small-pond' },

  // Montmorency County
  { name: 'Avalon Lake', county: 'Montmorency', acres: 220, maxDepthFt: 50, category: 'mixed' },
  { name: 'Lake Geneva', county: 'Montmorency', acres: 65, maxDepthFt: 25, category: 'small-pond' },
  { name: 'East Twin Lake (Montmorency)', county: 'Montmorency', acres: 320, maxDepthFt: 45, category: 'mixed', idSuffix: 'montmorency' },
  { name: 'West Twin Lake (Montmorency)', county: 'Montmorency', acres: 295, maxDepthFt: 35, category: 'mixed', idSuffix: 'montmorency' },
  { name: 'Lake Fifteen', county: 'Montmorency', acres: 95, maxDepthFt: 30, category: 'mixed' },
  { name: 'Lake Twentyseven', county: 'Montmorency', acres: 90, maxDepthFt: 25, category: 'small-pond' },

  // Iosco / Arenac
  { name: 'Loud Pond (Iosco)', county: 'Iosco', acres: 950, maxDepthFt: 30, category: 'reservoir', idSuffix: 'iosco' },
  { name: 'Au Gres Lake area lakes', county: 'Arenac', acres: 50, maxDepthFt: 18, category: 'small-pond' },

  // Gladwin County
  { name: 'Wixom Lake (Gladwin)', county: 'Gladwin', acres: 1980, maxDepthFt: 35, category: 'reservoir', idSuffix: 'gladwin' },
  { name: 'Smallwood Lake', county: 'Gladwin', acres: 850, maxDepthFt: 30, category: 'reservoir' },
  { name: 'Pratt Lake (Gladwin)', county: 'Gladwin', acres: 145, maxDepthFt: 25, category: 'shallow-warmwater', idSuffix: 'gladwin' },
  { name: 'Lake Lancer', county: 'Gladwin', acres: 700, maxDepthFt: 50, category: 'reservoir' },
  { name: 'Lake Sanford (Gladwin)', county: 'Gladwin', acres: 1395, maxDepthFt: 35, category: 'reservoir', idSuffix: 'gladwin-sanford' },
  { name: 'Secord Lake', county: 'Gladwin', acres: 1100, maxDepthFt: 30, category: 'reservoir' },

  // Roscommon misc
  { name: 'St. Helen Lake', county: 'Roscommon', acres: 2400, maxDepthFt: 25, category: 'shallow-warmwater', extraSpecies: ['Walleye'] },
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
