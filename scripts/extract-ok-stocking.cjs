/**
 * Synthesize OK stocking entries from the published bi-weekly cadence.
 * ODWC doesn't publish individual stocking dates, but DOES publish:
 *
 *   "Rainbows are stocked approximately every two weeks at all eight
 *    of the state's trout areas during the designated trout seasons."
 *
 *   - Lower Mountain Fork River (Beaver's Bend): year-round
 *   - Lower Illinois River: year-round
 *   - Blue River + Robbers Cave + Medicine Creek + Sunset Lake +
 *     Lake Carl Blackwell + Lake Watonga: Nov 1 – Mar 15/31
 *
 * We generate bi-weekly placeholder records for the year-round areas
 * (current ±60 days) plus the recently-ended winter season for the
 * seasonal areas. Notes mark these as "scheduled bi-weekly cadence"
 * so it's clear they're predicted from cadence rather than confirmed
 * from per-event reports. The weekly cron's AI fallback can refine
 * these once Anthropic credits are available.
 *
 * Output: data/seed/ok-raw.json
 */

const fs = require('node:fs');
const path = require('node:path');

const OUT_PATH = path.join(__dirname, '..', 'data', 'seed', 'ok-raw.json');

// Year-round trout areas (every 2 weeks regardless of season).
const YEAR_ROUND = [
  {
    water: 'Lower Mountain Fork River',
    county: 'McCurtain',
    species: ['Rainbow Trout', 'Brown Trout'],
    notes:
      "Year-round trout area below Broken Bow Dam (Beaver's Bend State Park). ODWC stocks approximately every two weeks. Brown trout stocked when available.",
  },
  {
    water: 'Lower Illinois River',
    county: 'Sequoyah',
    species: ['Rainbow Trout', 'Brown Trout'],
    notes:
      'Year-round trout area below Tenkiller Dam. ODWC stocks approximately every two weeks. Brown trout stocked when available.',
  },
];

// Seasonal winter areas — Nov 1 through mid-March.
const SEASONAL = [
  {
    water: 'Blue River',
    county: 'Johnston',
    species: ['Rainbow Trout'],
    seasonEnd: '2026-03-31',
    notes: 'ODWC winter trout area; 6.25-mile public fishing portion.',
  },
  {
    water: 'Robbers Cave',
    county: 'Latimer',
    species: ['Rainbow Trout'],
    seasonEnd: '2026-03-15',
    notes: 'ODWC winter trout area at Robbers Cave State Park.',
  },
  {
    water: 'Medicine Creek',
    county: 'Comanche',
    species: ['Rainbow Trout'],
    seasonEnd: '2026-03-15',
    notes: 'ODWC winter trout area.',
  },
  {
    water: 'Lake Watonga (Boecher)',
    county: 'Blaine',
    species: ['Rainbow Trout'],
    seasonEnd: '2026-03-31',
    notes: 'ODWC winter trout area at Roman Nose State Park.',
  },
  {
    water: 'Lake Carl Blackwell Turtle Pond',
    county: 'Payne',
    species: ['Rainbow Trout'],
    seasonEnd: '2026-03-31',
    notes: 'ODWC winter trout area.',
  },
  {
    water: 'Sunset Lake',
    county: 'Tulsa',
    species: ['Rainbow Trout'],
    seasonEnd: '2026-03-31',
    notes: 'ODWC winter trout area.',
  },
];

function biWeeklyDates(startMs, endMs) {
  const dates = [];
  for (let t = startMs; t <= endMs; t += 14 * 86400000) {
    dates.push(new Date(t).toISOString().slice(0, 10));
  }
  return dates;
}

const out = [];

// Year-round: current ± 60 days.
{
  const now = Date.now();
  const start = now - 60 * 86400000;
  const end = now + 30 * 86400000;
  const dates = biWeeklyDates(start, end);
  for (const e of YEAR_ROUND) {
    for (const d of dates) {
      for (const sp of e.species) {
        out.push({
          date: d,
          water: e.water,
          county: e.county,
          species: sp,
          size: 'catchable',
          notes:
            `${e.notes} ` +
            'Bi-weekly scheduled stocking (cadence-derived; ODWC does not publish per-event dates).',
        });
      }
    }
  }
}

// Seasonal: from Nov 1 prior year through season end.
{
  for (const e of SEASONAL) {
    const seasonStart = Date.parse('2025-11-01');
    const seasonEnd = Date.parse(e.seasonEnd);
    const dates = biWeeklyDates(seasonStart, seasonEnd);
    for (const d of dates) {
      for (const sp of e.species) {
        out.push({
          date: d,
          water: e.water,
          county: e.county,
          species: sp,
          size: 'catchable',
          notes:
            `${e.notes} ` +
            'Bi-weekly scheduled stocking, Nov 1 – season end (cadence-derived).',
        });
      }
    }
  }
}

console.log(`Generated ${out.length} OK records`);
const byWater = {};
for (const r of out) byWater[r.water] = (byWater[r.water] || 0) + 1;
console.log('Per water:', byWater);

fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));
console.log(`Wrote ${OUT_PATH}`);
