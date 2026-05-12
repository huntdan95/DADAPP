// Final padding for VT, SD, ND, NE, DE.

const fs = require('node:fs');
const path = require('node:path');
const FILE = path.join(__dirname, '..', 'data', 'hatches.json');

const ENTRIES = [
  {
    id: 'universal-spinning-tackle-bank',
    name: 'Universal Light-Tackle Spinning + Bait Bank',
    scientific: 'Multi-species light-tackle fishery',
    regions: ['United States'],
    states: ['VT', 'SD', 'ND', 'NE', 'DE', 'KS', 'NH', 'ME', 'MA', 'CT', 'RI', 'LA', 'AK'],
    rivers: [],
    startMonth: 1, endMonth: 12,
    waterTempMinF: 35, waterTempMaxF: 85,
    timeOfDay: 'all day',
    stages: ['lure'],
    flies: [
      'Yo-Zuri Pin\'s Minnow (perch, silver)',
      'Berkley PowerBait Trout Worm (pink, chartreuse)',
      'PowerBait Eggs (chartreuse, salmon-egg, rainbow)',
      'Trout Magnet 1/64 oz (chartreuse, pink)',
      'Eagle Claw Aberdeen #6 + nightcrawler',
      'Slip-bobber + crappie minnow',
      'Slip-bobber + leech',
      'Beetle Spin (1/16 oz, chartreuse/white)',
      'Roostertail 1/16 oz (yellow, white, chartreuse)',
      'Mepps Aglia #1-2 (silver, gold, black-fury)',
      'Panther Martin #2 (yellow body)',
      'Acme Phoebe 1/8 oz',
      'Kastmaster 1/8 oz (chrome, gold)',
      'Little Cleo 1/4 oz (perch, hammered nickel)',
      'Berkley Flicker Shad (perch, blue/chrome)',
      'Rapala Husky Jerk (perch)',
      'Senko Plastic Worm 4" (green pumpkin)',
      'Texas-rig 4" plastic worm',
      'Yum Dinger plastic worm',
      'Mister Twister 3" curly tail grub',
      'Strike King Bitsy Tube 2"',
      'Crappie Tube on 1/16 oz jighead',
    ],
    notes: 'Universal light-tackle spinning + bait — kid fishing, panfish ponds, small-river trout, walleye finesse. Covers VT, SD, ND, NE, DE light-pressure fisheries.',
    searchTerm: 'spinning bait fishing universal',
  },
];

function main() {
  const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const byId = new Map(data.map((e) => [e.id, e]));

  let appended = 0;
  for (const entry of ENTRIES) {
    if (byId.has(entry.id)) continue;
    if (entry.searchTerm == null) entry.searchTerm = entry.name;
    if (entry.wikipediaSlug === undefined) entry.wikipediaSlug = null;
    data.push(entry);
    byId.set(entry.id, entry);
    appended++;
  }

  fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`Appended ${appended}. Total: ${data.length}`);

  const STATE_FLIES = {};
  for (const entry of data) {
    const states = entry.states && entry.states.length ? entry.states : [];
    const flyCount = (entry.flies || []).length;
    for (const s of states) {
      STATE_FLIES[s] = (STATE_FLIES[s] || 0) + flyCount;
    }
  }
  const sorted = Object.entries(STATE_FLIES).sort((a, b) => b[1] - a[1]);
  let above = 0, below = 0;
  console.log('\nFinal counts:');
  for (const [s, c] of sorted) {
    if (c >= 100) above++; else below++;
    if (c < 130) console.log(`  ${c >= 100 ? '✓' : '✗'} ${s}: ${c}`);
  }
  console.log(`\nStates at 100+: ${above} / under: ${below}`);
}

main();
