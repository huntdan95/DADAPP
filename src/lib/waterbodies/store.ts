/**
 * Loader for the waterbody guide. JSON is bundled at build time
 * (small enough — ~60 KB) so there's no Firestore round-trip on the
 * Spots tab. Curated reference data, not user-owned.
 */

import raw from '@/../data/waterbodies.json';
import type { Waterbody } from './types';

/** All waterbodies. Cached at module scope so repeat calls are free. */
let cache: Waterbody[] | null = null;
export function allWaterbodies(): Waterbody[] {
  if (!cache) cache = raw as Waterbody[];
  return cache;
}

/** Waterbodies for a given USPS state code (case-insensitive). */
export function waterbodiesForState(state: string): Waterbody[] {
  const s = state.toUpperCase();
  return allWaterbodies().filter((w) => w.state.toUpperCase() === s);
}

/** Set of states that have at least one waterbody profile. */
export function statesWithWaterbodies(): string[] {
  const seen = new Set<string>();
  for (const w of allWaterbodies()) seen.add(w.state.toUpperCase());
  return Array.from(seen).sort();
}
