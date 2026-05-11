import speciesData from '@/../data/species.json';
import type { Location } from '@/lib/providers/types';

/**
 * Static species + lure recommendations keyed by water type and state.
 * Complements `data/hatches.json` for waters where no insect hatch is
 * the actionable signal — lakes, ponds, reservoirs, saltwater, and
 * warm-water rivers in particular.
 */

export interface SpeciesTactic {
  method: 'fly' | 'cast' | 'troll' | 'jig' | 'other';
  lures: string[];
  notes?: string;
}

export interface SpeciesSeason {
  startMonth: number;
  endMonth: number;
  label: string;
}

export interface SpeciesEntry {
  id: string;
  name: string;
  scientific: string;
  waterTypes: Array<Location['type']>;
  states: string[];
  seasons: SpeciesSeason[];
  tactics: SpeciesTactic[];
  notes?: string;
}

const ALL: SpeciesEntry[] = speciesData as SpeciesEntry[];

/**
 * Per-species "how likely is the average angler to catch this on a normal
 * trip" rank. 1 = caught everywhere all the time; 5 = trophy / rare /
 * blue-water specialty. Used to push the inshore staples (redfish, sea
 * trout, sheepshead, bluegill) above the offshore / specialty fish
 * (sailfish, wahoo, lake sturgeon) in the top-5 list.
 *
 * Missing entries default to 3.
 */
const COMMONALITY: Record<string, number> = {
  // Tier 1 — staple fish, caught on most trips in range
  'largemouth-bass': 1,
  'bluegill-panfish': 1,
  'channel-catfish': 1,
  'smallmouth-bass': 1,
  crappie: 1,
  'yellow-perch': 1,
  redfish: 1,
  'sea-trout': 1,
  'rainbow-trout': 1,
  'brown-trout': 1,

  // Tier 2 — very common with a little effort / right structure
  'spotted-bass': 2,
  walleye: 2,
  'white-bass': 2,
  'redear-sunfish': 2,
  'yellow-bullhead': 2,
  carp: 2,
  flounder: 2,
  'sheepshead-salt': 2,
  'black-drum': 2,
  bluefish: 2,
  'mangrove-snapper': 2,
  tripletail: 2,
  pompano: 2,
  'jack-crevalle': 2,
  ladyfish: 2,
  'whiting-kingfish': 2,
  spot: 2,
  'atlantic-croaker': 2,
  snook: 2,
  tarpon: 2,
  'rock-bass': 2,
  'freshwater-drum': 2,
  'hybrid-striped-bass': 2,
  'striped-bass': 2,
  'skipjack-herring': 2,

  // Tier 3 — needs the right water + technique, but not unusual
  'shoal-bass': 3,
  'coosa-bass': 3,
  'brook-trout': 3,
  steelhead: 3,
  'king-salmon': 3,
  'coho-salmon': 3,
  sauger: 3,
  'spanish-mackerel': 3,
  'false-albacore': 3,
  cobia: 3,
  bowfin: 3,
  'longnose-gar': 3,
  'lake-trout': 3,
  'yellowtail-snapper': 3,
  'gag-grouper': 3,
  triggerfish: 3,
  splake: 3,

  // Tier 4 — niche, deep, or specialty (gear / boat / season)
  'king-mackerel': 4,
  'red-snapper': 4,
  'red-grouper': 4,
  hogfish: 4,
  wahoo: 4,
  'mahi-mahi': 4,
  'blackfin-tuna': 4,
  amberjack: 4,
  'atlantic-striper': 4,
  'atlantic-salmon': 4,
  'lake-whitefish': 4,
  'pink-salmon': 4,
  smelt: 4,
  burbot: 4,
  muskellunge: 4,
  'tiger-muskie': 4,
  'northern-pike': 4,
  snakehead: 4,
  oscar: 4,
  'mayan-cichlid': 4,
  tilapia: 4,
  'peacock-bass': 4,
  'clown-knifefish': 4,
  'alligator-gar': 4,
  'flathead-catfish': 4,
  'blue-catfish': 4,

  // Tier 5 — trophy / blue-water / very localized
  sailfish: 5,
  'goliath-grouper': 5,
  bonefish: 5,
  permit: 5,
  'lake-sturgeon': 5,
};

/**
 * Strict latitude bounds for species that only exist in a specific
 * sub-region of their state — peacock bass don't exist on the FL Gulf
 * Coast even though the state filter says "FL". A location outside this
 * range is filtered out entirely regardless of season.
 *
 * [southBound, northBound] in decimal degrees N.
 */
const LAT_RANGES: Record<string, [number, number]> = {
  'peacock-bass': [25.0, 27.5],       // South FL canals only — Miami / Broward
  snakehead: [25.5, 27.0],            // South FL canals
  bonefish: [24.4, 26.5],             // FL Keys + Biscayne Bay
  permit: [24.4, 27.0],               // FL Keys + 10000 Islands flats
  oscar: [25.0, 28.0],                // South FL invasive
  'mayan-cichlid': [25.0, 27.5],      // South FL Everglades
  'clown-knifefish': [25.5, 27.0],    // South FL canals
  hogfish: [24.4, 30.5],              // FL Atlantic + Gulf reefs, not the panhandle marshes
  'yellowtail-snapper': [24.4, 31.0], // FL reefs
  'goliath-grouper': [24.4, 28.5],    // SW FL wrecks primarily
  sailfish: [24.0, 31.0],             // FL + lower Atlantic offshore
};

/**
 * Returns species likely to be catchable at this location *right now*.
 * Filters:
 *   - water type matches
 *   - state matches (or species applies everywhere)
 *   - season window includes the current month
 *   - latitude falls within any strict sub-state range
 * Sort:
 *   - commonality ascending (most common first)
 *   - state-specific entries above country-wide
 *   - alphabetical tiebreak
 */
export function recommendedSpeciesForLocation(
  location: Location,
  when: Date = new Date()
): SpeciesEntry[] {
  const month = monthInTz(when, location.timezone);
  const state = location.state.toUpperCase();
  return ALL.filter((s) => {
    if (s.waterTypes.length > 0 && !s.waterTypes.includes(location.type)) {
      return false;
    }
    if (s.states.length > 0 && !s.states.includes(state)) return false;
    if (
      s.seasons.length > 0 &&
      !s.seasons.some((win) => inMonthRange(month, win.startMonth, win.endMonth))
    ) {
      return false;
    }
    const latRange = LAT_RANGES[s.id];
    if (latRange) {
      if (location.lat < latRange[0] || location.lat > latRange[1]) return false;
    }
    return true;
  }).sort((a, b) => {
    const aC = COMMONALITY[a.id] ?? 3;
    const bC = COMMONALITY[b.id] ?? 3;
    if (aC !== bC) return aC - bC;
    const aSpecific = a.states.includes(state) ? 0 : 1;
    const bSpecific = b.states.includes(state) ? 0 : 1;
    if (aSpecific !== bSpecific) return aSpecific - bSpecific;
    return a.name.localeCompare(b.name);
  });
}

/** Exposed for tests / debug. */
export function commonalityFor(id: string): number {
  return COMMONALITY[id] ?? 3;
}

function inMonthRange(month: number, start: number, end: number): boolean {
  if (start <= end) return month >= start && month <= end;
  return month >= start || month <= end;
}

function monthInTz(d: Date, tz: string): number {
  return parseInt(
    new Intl.DateTimeFormat('en-US', { timeZone: tz, month: 'numeric' }).format(d),
    10
  );
}
