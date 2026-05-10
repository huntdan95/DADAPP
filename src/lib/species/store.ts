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
 * Returns species likely to be catchable at this location *right now*.
 * Filter: water type matches AND (state empty or state matches) AND a
 * season window covers the current month. Sorted with more state-specific
 * picks first (so MI lake trout outranks generic-bass on a MI lake).
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
    if (s.seasons.length === 0) return true;
    return s.seasons.some((win) => inMonthRange(month, win.startMonth, win.endMonth));
  }).sort((a, b) => {
    // State-specific entries (smaller states list) rank above country-wide.
    const aSpecific = a.states.includes(state) ? 0 : 1;
    const bSpecific = b.states.includes(state) ? 0 : 1;
    if (aSpecific !== bSpecific) return aSpecific - bSpecific;
    return a.name.localeCompare(b.name);
  });
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
