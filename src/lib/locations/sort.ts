import type { Location } from '@/lib/providers/types';

/**
 * Canonical sort order for native <Select> spot dropdowns:
 * state first (alphabetical), then spot name (alphabetical) within
 * each state. Lets a user with spots across many states scan the
 * list visually instead of scrolling through what looks like an
 * unsorted pile.
 *
 * Cheap O(n log n). Always returns a new array — callers can keep
 * passing the upstream `locations` prop without mutating it.
 */
export function sortLocationsForPicker(locations: Location[]): Location[] {
  return [...locations].sort((a, b) => {
    const stateCmp = (a.state ?? '').localeCompare(b.state ?? '');
    if (stateCmp !== 0) return stateCmp;
    return a.name.localeCompare(b.name);
  });
}
