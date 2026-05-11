/**
 * One-shot helper: add 'KY' to every hatch entry that already lists 'TN'.
 * The Cumberland River tailwater below Wolf Creek Dam and the Cumberland's
 * upper tributaries share the exact insect community of the TN tailwaters
 * (same drainage, same temperatures, same regulated flows).
 *
 * Run: node scripts/add-ky-to-hatches.cjs
 */

const fs = require('node:fs');
const path = require('node:path');

const FILE = path.join(__dirname, '..', 'data', 'hatches.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));

let added = 0;
for (const h of data) {
  if (!Array.isArray(h.states)) continue;
  if (h.states.includes('TN') && !h.states.includes('KY')) {
    h.states.push('KY');
    added++;
  }
}

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n');
console.log(`Added KY to ${added} hatch entries.`);
