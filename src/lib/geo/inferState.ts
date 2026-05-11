/**
 * Infer a USPS state code from a lat/lng. Used as a fallback when
 * Nominatim was unreachable (or returned a state name we can't map)
 * at the moment a spot was added — without this, the spot saves with
 * an empty `state` field and lands under "—" in the picker.
 *
 * Resolution order (best signal first):
 *   1. Waterbody-registry match — every entry has a `states` array;
 *      take the first.
 *   2. Lat/lng inside a state's bounding box. Coarse but reliable for
 *      ~95 % of US pins. Bounding boxes are intentionally loose; ambiguous
 *      pins near borders pick the dominant state by area-coverage.
 *
 * Returns null when neither method finds a match (e.g. ocean pins or
 * non-US coordinates).
 */

import { lookupWaterbody } from '@/lib/waterbodies/registry';

/**
 * USPS code → [southLat, westLng, northLat, eastLng]. Sourced from the
 * U.S. Census Cartographic Boundary files. Padded slightly so a pin
 * right at the border doesn't fall through. The 17 states the app
 * actively supports are listed first; others added for completeness so
 * out-of-state borrow trips still resolve.
 */
const STATE_BBOXES: Record<string, [number, number, number, number]> = {
  AL: [30.20, -88.50, 35.05, -84.85],
  AR: [32.95, -94.65, 36.55, -89.60],
  CO: [36.95, -109.10, 41.05, -101.95],
  FL: [24.40, -87.65, 31.10, -79.95],
  GA: [30.30, -85.65, 35.05, -80.80],
  ID: [41.95, -117.30, 49.05, -111.00],
  IL: [36.95, -91.55, 42.55, -87.00],
  IN: [37.75, -88.15, 41.80, -84.75],
  KY: [36.45, -89.65, 39.20, -81.90],
  MI: [41.65, -90.45, 48.35, -82.10],
  MS: [30.10, -91.70, 35.05, -88.05],
  MT: [44.30, -116.10, 49.05, -103.95],
  NC: [33.80, -84.40, 36.65, -75.40],
  OK: [33.55, -103.05, 37.05, -94.40],
  PA: [39.65, -80.55, 42.30, -74.65],
  TN: [34.95, -90.35, 36.70, -81.60],
  UT: [36.95, -114.10, 42.05, -109.00],
  // Additional states (out-of-coverage but accurate enough to attribute):
  AZ: [31.30, -114.85, 37.05, -109.00],
  CA: [32.45, -124.50, 42.05, -114.10],
  NM: [31.30, -109.10, 37.05, -103.00],
  NV: [34.95, -120.05, 42.05, -114.00],
  NY: [40.45, -79.80, 45.05, -71.80],
  OH: [38.35, -84.85, 41.95, -80.50],
  OR: [41.95, -124.60, 46.30, -116.45],
  SC: [32.00, -83.40, 35.25, -78.50],
  VA: [36.50, -83.70, 39.50, -75.20],
  WA: [45.50, -124.80, 49.10, -116.85],
  WI: [42.45, -92.95, 47.10, -86.20],
  WV: [37.15, -82.70, 40.65, -77.70],
  WY: [40.95, -111.10, 45.05, -104.00],
};

export function inferStateFromLatLng(lat: number, lng: number): string | null {
  // Tier 1: waterbody registry — most authoritative for known waters.
  const wb = lookupWaterbody(lat, lng);
  if (wb?.waterbody.states.length) {
    return wb.waterbody.states[0];
  }

  // Tier 2: state bounding boxes. Score by "how deep inside the bbox"
  // (distance from nearest edge) so border-area pins pick the state
  // that more cleanly contains them.
  let best: { state: string; depth: number } | null = null;
  for (const [state, [s, w, n, e]] of Object.entries(STATE_BBOXES)) {
    if (lat < s || lat > n || lng < w || lng > e) continue;
    const depth = Math.min(lat - s, n - lat, lng - w, e - lng);
    if (!best || depth > best.depth) {
      best = { state, depth };
    }
  }
  return best?.state ?? null;
}
