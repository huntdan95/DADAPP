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
  tripletail: 2,
  pompano: 2,
  'jack-crevalle': 2,
  ladyfish: 2,
  'whiting-kingfish': 2,
  spot: 2,
  'atlantic-croaker': 2,
  snook: 1,
  tarpon: 1,
  'mangrove-snapper': 1,
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

  // ---- Expansion set (commonality for the second wave of species) ----

  // Tier 1 staples
  pumpkinseed: 1,
  'green-sunfish': 1,
  warmouth: 1,

  // Tier 2 commons
  'chain-pickerel': 2,
  'longear-sunfish': 2,
  'spotted-sunfish': 2,
  'spotted-gar': 2,
  'florida-gar': 2,
  'shortnose-gar': 2,
  pinfish: 2,
  tomtate: 2,
  weakfish: 2,
  'sand-seatrout': 2,
  'striped-mullet': 2,
  'american-shad': 2,
  'hickory-shad': 2,
  'bonnethead-shark': 2,
  'gulf-flounder': 2,
  'summer-flounder-fluke': 2,
  'white-grunt': 2,                 // Reef species — not a flats / marsh fish

  // Tier 3 regional / seasonal specialty
  'suwannee-bass': 3,
  'alabama-bass': 3,
  flier: 3,
  'grass-pickerel': 3,
  'redfin-pickerel': 3,
  'brown-bullhead': 3,
  'black-bullhead': 3,
  'white-catfish': 3,
  'smallmouth-buffalo': 3,
  'bigmouth-buffalo': 3,
  'northern-hog-sucker': 3,
  'black-redhorse': 3,
  'golden-redhorse': 3,
  'yellow-bass': 3,
  'american-eel': 3,
  'white-perch': 3,
  saugeye: 3,
  'lane-snapper': 3,
  'vermilion-snapper': 3,
  'mutton-snapper': 3,
  scamp: 3,
  'knobbed-porgy': 3,
  'atlantic-bonito': 3,
  'blacktip-shark': 3,
  'sandbar-shark': 3,
  'blacknose-shark': 3,
  'banded-rudderfish': 3,
  'cero-mackerel': 3,
  'atlantic-spadefish': 3,          // Schools on nearshore wrecks, not marsh / flats

  // Tier 4 niche / specialty / heavier gear or boat
  'tiger-trout': 4,
  'schoolmaster-snapper': 4,
  'black-grouper': 4,
  'almaco-jack': 4,
  'african-pompano': 4,
  'yellow-jack': 4,
  'lookdown': 4,
  'lesser-amberjack': 4,
  'yellowfin-tuna': 4,
  'skipjack-tuna': 4,
  'bull-shark': 4,
  'spinner-shark': 4,
  'lemon-shark': 4,
  'nurse-shark': 4,

  // Tier 5 trophy / blue-water / deep
  'cubera-snapper': 5,
  'snowy-grouper': 5,
  'warsaw-grouper': 5,
  'great-hammerhead': 5,
  'blue-marlin': 5,
  'white-marlin': 5,
  'bigeye-tuna': 5,
  swordfish: 5,
  'golden-tilefish': 5,
  'blueline-tilefish': 5,

  // ---- Third expansion wave: cover-completeness species ----

  // Tier 2 commons
  'redbreast-sunfish': 2,
  'black-sea-bass': 2,
  'blueback-herring': 2,
  'sunshine-bass': 2,

  // Tier 3 regional / less-targeted
  cisco: 3,
  'round-whitefish': 3,
  'white-sucker': 3,
  'longnose-sucker': 3,
  'shorthead-redhorse': 3,
  quillback: 3,
  'grass-carp': 3,
  'black-buffalo': 3,

  // Tier 4 niche / requires specialty gear / regulatory hurdles
  paddlefish: 4,                 // Snagging-only, season-gated
  'shovelnose-sturgeon': 4,
  'bighead-carp': 4,             // Filter-feeder, snag/bow only
  'silver-carp': 4,              // Same — leaper, not a rod target

  // Tier 5 bait / forage / parasitic / off-target
  'gizzard-shad': 5,             // Bait fish; mostly cast-netted
  'threadfin-shad': 5,           // Bait fish
  alewife: 5,                    // Bait fish
  'mottled-sculpin': 5,          // Forage; mostly imitated by streamers
  'round-goby': 5,               // Invasive nuisance; bass bycatch
  'sea-lamprey': 5,              // Parasitic invasive — never a sport target
  goldfish: 5,                   // Feral aquarium escapee
  'atlantic-sturgeon': 5,        // Federally endangered — bycatch only
  'gulf-sturgeon': 5,            // Federally threatened — bycatch only

  // ---- Fourth expansion: Rocky Mountain West ----
  'cutthroat-trout': 1,          // The signature Western native
  'mountain-whitefish': 1,       // Year-round, present in most trout rivers
  'kokanee-salmon': 2,           // Major reservoir target
  'bull-trout': 4,               // Strict regs limit casual targeting
  'arctic-grayling': 5,          // Rare; declining outside a few MT drainages
  'golden-trout': 5,             // High-alpine, hike-in only
  'white-sturgeon': 5,           // ID Snake — trophy, C&R only
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

  // Expansion set — strict sub-state localizations
  'suwannee-bass': [29.0, 30.7],      // Suwannee + Santa Fe drainages only
  'cubera-snapper': [24.4, 26.5],     // FL Keys + Biscayne
  'schoolmaster-snapper': [24.4, 27.0], // Keys + south FL reefs
  'mutton-snapper': [24.4, 28.5],     // Keys through middle FL
  'lemon-shark': [24.4, 28.0],        // FL flats + south
  'great-hammerhead': [24.4, 30.5],   // FL Atlantic + south
  'nurse-shark': [24.4, 30.0],        // FL reefs primarily
  'cero-mackerel': [24.4, 27.5],      // Keys + south FL
  'african-pompano': [24.4, 30.0],    // FL Atlantic wrecks
  'yellow-jack': [24.4, 27.5],        // Keys + south FL
  'florida-gar': [24.4, 30.7],        // FL only (state filter already enforces)
  'white-perch': [34.0, 36.6],        // NC sound country only
  'weakfish': [33.8, 36.6],           // NC sound + ocean only
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
