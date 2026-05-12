/**
 * Match a user's saved spot to the closest entry in the Waters Guide.
 *
 * The Waters Guide carries the rich species + pattern data ("What's
 * biting + how"). A spot doesn't directly reference a waterbody, but
 * most spots are on or adjacent to one of the ~140 waters we know
 * about. This matcher does a best-effort lookup using:
 *
 *   1. State match (mandatory — eliminates 95% of candidates)
 *   2. River-name overlap (highest signal — same river name almost
 *      always means same waterbody)
 *   3. Waterbody-name token overlap ("Lake Wawasee" matches a spot
 *      named "Wawasee North Bay")
 *   4. GPS proximity (close pin = likely the same water)
 *
 * Returns null when nothing scores above a confidence threshold —
 * better to show nothing than to mismatch a spot to the wrong water.
 */

import type { Location } from '@/lib/providers/types';
import { allWaterbodies } from './store';
import { distanceMi } from '@/lib/userLocation';
import type { Waterbody } from './types';

/** Confidence threshold below which a match is suppressed. */
const MIN_SCORE = 30;

/** Tokenize a name for overlap comparison. Strips noise words. */
function tokens(s: string | undefined): string[] {
  if (!s) return [];
  const noise = new Set([
    'lake', 'river', 'reservoir', 'creek', 'fork', 'pond',
    'the', 'of', 'on', 'at', 'and', 'in',
    'north', 'south', 'east', 'west', 'upper', 'lower', 'big', 'little',
    'state', 'park', 'access', 'bridge', 'dam', 'tailwater', 'rec',
  ]);
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length >= 3 && !noise.has(t));
}

/** Count overlapping tokens between two strings. */
function tokenOverlap(a: string | undefined, b: string | undefined): number {
  if (!a || !b) return 0;
  const setA = new Set(tokens(a));
  let n = 0;
  for (const t of tokens(b)) if (setA.has(t)) n++;
  return n;
}

/**
 * Score how strongly a waterbody matches a saved spot. Higher = better.
 * Composite of several signals so a strong river-name match can win
 * even when the GPS is a few miles off, and vice-versa.
 */
function scoreMatch(w: Waterbody, loc: Location): number {
  if (w.state.toUpperCase() !== loc.state.toUpperCase()) return 0;

  let score = 0;

  // River-name match is the strongest signal. Exact substring on
  // either side gets full credit.
  const wRiver = (w.river ?? '').toLowerCase();
  const lRiver = (loc.river ?? '').toLowerCase();
  if (wRiver && lRiver) {
    if (wRiver === lRiver) score += 100;
    else if (wRiver.includes(lRiver) || lRiver.includes(wRiver)) score += 80;
    else {
      // Token overlap on river names
      const overlap = tokenOverlap(w.river, loc.river);
      if (overlap >= 1) score += 50;
    }
  }

  // Waterbody-name overlap with spot name OR river. Catches "Lake
  // Wawasee" → spot named "Wawasee N End" or with "Wawasee" as river.
  const nameOverlap = Math.max(
    tokenOverlap(w.name, loc.name),
    tokenOverlap(w.name, loc.river)
  );
  if (nameOverlap >= 2) score += 50;
  else if (nameOverlap >= 1) score += 30;

  // GPS proximity. Only meaningful when the waterbody has a centroid.
  if (w.lat != null && w.lng != null) {
    const dist = distanceMi(
      { lat: w.lat, lng: w.lng },
      { lat: loc.lat, lng: loc.lng }
    );
    if (dist < 5) score += 35;
    else if (dist < 15) score += 20;
    else if (dist < 30) score += 10;
    // For rivers (long subjects) the centroid distance is noisy —
    // don't penalize a far-from-centroid spot on a long river.
  }

  return score;
}

/**
 * Find the best matching waterbody for a spot. Returns null when no
 * candidate scores above the confidence threshold — better to show
 * "no match" than to mislead the user.
 */
export function matchWaterbody(loc: Location): Waterbody | null {
  let best: Waterbody | null = null;
  let bestScore = 0;
  for (const w of allWaterbodies()) {
    const s = scoreMatch(w, loc);
    if (s > bestScore) {
      bestScore = s;
      best = w;
    }
  }
  return bestScore >= MIN_SCORE ? best : null;
}
