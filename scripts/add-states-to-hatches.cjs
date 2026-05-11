/**
 * Adds the remaining states (PA, AR, OK, IL, MS) to existing Eastern
 * hatch entries where the insect community genuinely overlaps. Western
 * states (MT/ID/UT/CO) were handled by the dedicated Western hatch
 * entries already written. KY was handled by add-ky-to-hatches.cjs.
 *
 * Mappings:
 *   PA — full Mid-Atlantic hatch set
 *   AR — White / Norfork tailwaters share TN tailwater hatches
 *        (sulfur, BWO, midge); some bottomland fish white mayflies
 *   IL — limited; white mayfly + hex on backwater + lake; midges
 *   OK — limited; trout tailwater on Lower Mtn Fork mirrors AR set
 *   MS — limited; white mayflies + midges on the river
 */

const fs = require('node:fs');
const path = require('node:path');

const FILE = path.join(__dirname, '..', 'data', 'hatches.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));

const ADDITIONS = {
  // Full Mid-Atlantic hatch set
  PA: new Set([
    'sulfur', 'bwo-spring', 'bwo-fall', 'hendrickson', 'march-brown',
    'caddis-grannom', 'caddis-cinnamon', 'stonefly-yellow-sally',
    'isonychia', 'trico', 'white-mayfly', 'midges', 'terrestrials-summer',
    'hex',
  ]),
  // White / Norfork trout tailwater hatches + summer warmwater
  AR: new Set([
    'sulfur', 'bwo-spring', 'bwo-fall', 'caddis-cinnamon',
    'midges', 'white-mayfly', 'terrestrials-summer', 'trico',
  ]),
  // Lower Mountain Fork (trout) + reservoir warmwater
  OK: new Set([
    'midges', 'terrestrials-summer', 'white-mayfly',
  ]),
  // Mostly warmwater + Mississippi River white mayfly
  MS: new Set([
    'white-mayfly', 'midges', 'terrestrials-summer',
  ]),
  // Lake Michigan tribs + warmwater rivers
  IL: new Set([
    'white-mayfly', 'midges', 'terrestrials-summer', 'hex',
  ]),
};

let added = 0;
for (const h of data) {
  if (!Array.isArray(h.states)) continue;
  for (const [state, allowed] of Object.entries(ADDITIONS)) {
    if (!allowed.has(h.id)) continue;
    if (h.states.includes(state)) continue;
    h.states.push(state);
    added++;
  }
}

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n');
console.log(`Added ${added} state-hatch links.`);
