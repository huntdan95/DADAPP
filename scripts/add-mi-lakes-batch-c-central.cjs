/**
 * Michigan Waters Guide — Batch C: Central LP inland lakes.
 * Mecosta, Montcalm, Newaygo, Muskegon, Kent, Ionia, Clinton,
 * Gratiot, Isabella, Midland.
 */
const fs = require('node:fs');
const path = require('node:path');
const { buildLake } = require('./_mi-lake-template.cjs');
const FILE = path.join(__dirname, '..', 'data', 'waterbodies.json');

const REGION = 'Central Michigan inland lakes';

const LAKES = [
  // Mecosta County
  { name: 'Chippewa Lake (Mecosta)', county: 'Mecosta', acres: 770, maxDepthFt: 30, category: 'mixed', extraSpecies: ['Muskellunge'] },
  { name: 'Big Whitefish Lake', county: 'Montcalm', acres: 815, maxDepthFt: 50, category: 'mixed' },
  { name: 'Brower Lake', county: 'Mecosta', acres: 95, maxDepthFt: 30, category: 'mixed' },
  { name: 'School Section Lake', county: 'Mecosta', acres: 175, maxDepthFt: 60, category: 'deep-clear' },
  { name: 'Pretty Lake', county: 'Mecosta', acres: 145, maxDepthFt: 45, category: 'mixed' },
  { name: 'Round Lake (Mecosta)', county: 'Mecosta', acres: 90, maxDepthFt: 35, category: 'mixed', idSuffix: 'mecosta' },
  { name: 'Horsehead Lake', county: 'Mecosta', acres: 290, maxDepthFt: 25, category: 'shallow-warmwater' },
  { name: 'Tubbs Lake', county: 'Mecosta', acres: 1100, maxDepthFt: 25, category: 'reservoir' },

  // Montcalm County (a lot of lakes in Stanton / Greenville area)
  { name: 'Tamarack Lake (Montcalm)', county: 'Montcalm', acres: 740, maxDepthFt: 65, category: 'deep-clear' },
  { name: 'Crystal Lake (Montcalm)', county: 'Montcalm', acres: 770, maxDepthFt: 90, category: 'deep-clear', idSuffix: 'montcalm' },
  { name: 'Baldwin Lake (Montcalm)', county: 'Montcalm', acres: 280, maxDepthFt: 35, category: 'mixed', idSuffix: 'montcalm' },
  { name: 'Dickerson Lake', county: 'Montcalm', acres: 175, maxDepthFt: 50, category: 'mixed' },
  { name: 'Long Lake (Montcalm)', county: 'Montcalm', acres: 215, maxDepthFt: 60, category: 'deep-clear', idSuffix: 'montcalm' },
  { name: 'Townsend Lake', county: 'Montcalm', acres: 100, maxDepthFt: 40, category: 'mixed' },
  { name: 'Clifford Lake', county: 'Montcalm', acres: 320, maxDepthFt: 30, category: 'mixed' },
  { name: 'Duck Lake (Montcalm)', county: 'Montcalm', acres: 125, maxDepthFt: 50, category: 'mixed', idSuffix: 'montcalm' },

  // Newaygo County
  { name: 'Hess Lake (Newaygo)', county: 'Newaygo', acres: 760, maxDepthFt: 25, category: 'shallow-warmwater', idSuffix: 'newaygo' },
  { name: 'Hardy Pond', county: 'Newaygo', acres: 4000, maxDepthFt: 80, category: 'reservoir', extraSpecies: ['Walleye', 'Smallmouth bass'] },
  { name: 'Croton Pond', county: 'Newaygo', acres: 1200, maxDepthFt: 35, category: 'reservoir', extraSpecies: ['Walleye'] },
  { name: 'Rogers Pond', county: 'Mecosta', acres: 470, maxDepthFt: 25, category: 'reservoir' },
  { name: 'Diamond Lake (Newaygo)', county: 'Newaygo', acres: 270, maxDepthFt: 35, category: 'mixed', idSuffix: 'newaygo' },
  { name: 'Sylvan Lake (Newaygo)', county: 'Newaygo', acres: 215, maxDepthFt: 45, category: 'mixed', idSuffix: 'newaygo' },
  { name: 'White Cloud Pond', county: 'Newaygo', acres: 30, maxDepthFt: 18, category: 'small-pond' },
  { name: 'Pickerel Lake (Newaygo)', county: 'Newaygo', acres: 175, maxDepthFt: 35, category: 'mixed', idSuffix: 'newaygo' },
  { name: 'Pettibone Lake (Newaygo)', county: 'Newaygo', acres: 165, maxDepthFt: 50, category: 'mixed', idSuffix: 'newaygo' },

  // Muskegon County
  { name: 'Wolf Lake (Muskegon)', county: 'Muskegon', acres: 350, maxDepthFt: 40, category: 'mixed', idSuffix: 'muskegon' },
  { name: 'Bear Lake (Muskegon)', county: 'Muskegon', acres: 415, maxDepthFt: 35, category: 'mixed', idSuffix: 'muskegon' },
  { name: 'Duck Lake (Muskegon)', county: 'Muskegon', acres: 240, maxDepthFt: 60, category: 'deep-clear', idSuffix: 'muskegon' },
  { name: 'Fremont Lake', county: 'Newaygo', acres: 770, maxDepthFt: 80, category: 'deep-clear', extraSpecies: ['Walleye'] },

  // Kent County (Grand Rapids area beyond Reeds)
  { name: 'Murray Lake', county: 'Kent', acres: 320, maxDepthFt: 35, category: 'mixed' },
  { name: 'Pickerel Lake (Kent)', county: 'Kent', acres: 75, maxDepthFt: 40, category: 'mixed', idSuffix: 'kent' },
  { name: 'Big Pine Island Lake', county: 'Kent', acres: 200, maxDepthFt: 25, category: 'shallow-warmwater' },
  { name: 'Wabasis Lake', county: 'Kent', acres: 360, maxDepthFt: 40, category: 'mixed' },
  { name: 'Lincoln Lake', county: 'Kent', acres: 350, maxDepthFt: 30, category: 'mixed' },
  { name: 'Long Lake (Kent)', county: 'Kent', acres: 415, maxDepthFt: 60, category: 'deep-clear', idSuffix: 'kent' },
  { name: 'Camp Lake', county: 'Kent', acres: 175, maxDepthFt: 60, category: 'deep-clear' },
  { name: 'Bostwick Lake', county: 'Kent', acres: 220, maxDepthFt: 30, category: 'mixed' },
  { name: 'Spring Lake (Kent)', county: 'Kent', acres: 165, maxDepthFt: 45, category: 'mixed', idSuffix: 'kent' },

  // Ionia County
  { name: 'Morrison Lake (Ionia)', county: 'Ionia', acres: 235, maxDepthFt: 30, category: 'mixed', idSuffix: 'ionia' },
  { name: 'Long Lake (Ionia)', county: 'Ionia', acres: 175, maxDepthFt: 30, category: 'mixed', idSuffix: 'ionia' },
  { name: 'Ionia State Recreation Area lake', county: 'Ionia', acres: 90, maxDepthFt: 25, category: 'small-pond' },
  { name: 'Sessions Lake', county: 'Ionia', acres: 145, maxDepthFt: 25, category: 'shallow-warmwater' },

  // Clinton County
  { name: 'Lake Ovid (Clinton)', county: 'Clinton', acres: 410, maxDepthFt: 30, category: 'mixed', extraSpecies: ['Walleye'], idSuffix: 'clinton' },
  { name: 'Round Lake (Clinton)', county: 'Clinton', acres: 95, maxDepthFt: 25, category: 'small-pond', idSuffix: 'clinton' },

  // Gratiot + Isabella + Midland
  { name: 'Lake of the Clouds (Midland)', county: 'Midland', acres: 75, maxDepthFt: 30, category: 'mixed', idSuffix: 'midland' },
  { name: 'Sanford Lake (Midland)', county: 'Midland', acres: 1395, maxDepthFt: 35, category: 'reservoir', idSuffix: 'midland', notes: 'Tittabawassee River impoundment; 2020 dam failure drained it; reservoir restoration ongoing.' },
  { name: 'Wixom Lake (Gladwin)', county: 'Gladwin / Midland', acres: 1980, maxDepthFt: 35, category: 'reservoir', idSuffix: 'gladwin-midland' },
  { name: 'Coleman Lake (Midland)', county: 'Midland', acres: 75, maxDepthFt: 25, category: 'small-pond' },
  { name: 'Stevens Lake (Isabella)', county: 'Isabella', acres: 75, maxDepthFt: 30, category: 'mixed' },
  { name: 'Coldwater Lake (Isabella)', county: 'Isabella', acres: 270, maxDepthFt: 40, category: 'mixed', idSuffix: 'isabella' },
  { name: 'Littlefield Lake', county: 'Isabella', acres: 175, maxDepthFt: 35, category: 'mixed' },
  { name: 'Lake Mecosta', county: 'Mecosta', acres: 95, maxDepthFt: 25, category: 'mixed' },

  // Shiawassee + Bay County
  { name: 'Sleepy Hollow Lake', county: 'Clinton', acres: 410, maxDepthFt: 30, category: 'mixed', extraSpecies: ['Walleye'] },

  // Saginaw + Tuscola
  { name: 'Sanford Lake (Tuscola)', county: 'Tuscola', acres: 95, maxDepthFt: 25, category: 'mixed', idSuffix: 'tuscola' },
  { name: 'Caro Pond', county: 'Tuscola', acres: 50, maxDepthFt: 18, category: 'small-pond' },
  { name: 'Murphy Lake', county: 'Tuscola', acres: 195, maxDepthFt: 22, category: 'shallow-warmwater' },
  { name: 'Cass City Reservoir', county: 'Tuscola', acres: 75, maxDepthFt: 18, category: 'small-pond' },

  // Misc Central LP
  { name: 'Mosquito Creek Reservoir (Central LP)', county: 'Lake', acres: 80, maxDepthFt: 25, category: 'small-pond' },
  { name: 'Hodenpyl Pond', county: 'Wexford', acres: 1500, maxDepthFt: 80, category: 'reservoir', extraSpecies: ['Smallmouth bass', 'Brown trout'], notes: 'Manistee River impoundment behind Hodenpyl Dam. Trophy smallmouth + brown trout opportunities.' },
  { name: 'Tippy Pond', county: 'Manistee', acres: 1400, maxDepthFt: 60, category: 'reservoir', extraSpecies: ['Smallmouth bass', 'Brown trout'], notes: 'Manistee River impoundment behind Tippy Dam. Connects to the famous Tippy Dam tailwater downstream.' },
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
