import type { DataProviders, LakeDataProvider, WaterType } from '@/lib/providers/types';

/**
 * Waterbody registry — the single source of truth for "what body of
 * water is this pin actually on?"
 *
 * Replaces the old `src/lib/geo/knownLakes.ts` with a richer schema
 * that drives several layers of UX:
 *   - Auto-detect Tier 1: pin inside a waterbody bbox → bind that
 *     body's curated `dataProviders` config.
 *   - Conditions card (Phase 2): show "Body of water: Lake St. Clair"
 *     badge and use `species` to seed the catch form.
 *   - Briefings (Phase 2): "this is Caney Fork, known for stocked
 *     rainbows below Center Hill…"
 *   - Group editing (Phase 3): a UI on the spot screen for the group
 *     to claim and refine entries.
 *
 * Future scale: the lookup is O(N) linear-scan today; fine through
 * ~10k entries (every lookup is ~1 ms in cold cache). When/if we
 * GNIS-import the entire 17-state lake set (~250k entries), we'll
 * swap to a quadtree (RBush) keyed by bbox — the public API stays
 * identical, only the internals change.
 *
 * Data lives in `./data/<state>.ts` so per-state additions stay
 * tightly scoped. Adding a new water is one entry in one file.
 */

export interface WaterbodyAccessPoint {
  name: string;
  lat: number;
  lng: number;
  /** Type hint: 'ramp', 'put-in', 'pier', 'wading', 'public'. */
  kind?: 'ramp' | 'put-in' | 'pier' | 'wading' | 'public';
}

export interface Waterbody {
  /**
   * Stable, URL-safe id. Convention: `<state>-<slugified-name>`.
   * Stays constant across schema updates so downstream refs hold.
   */
  id: string;
  /** Display name as the angler knows it. */
  name: string;
  /**
   * Alternative spellings / nicknames to match against. Used by the
   * future name-search lookup (Nominatim water-field cross-match).
   * Example: ['Lac Sainte Claire', 'Lake Saint Clair'].
   */
  aliases?: string[];
  /**
   * USPS state codes the body sits in. Cross-border waters list
   * every state they touch — Bull Shoals is `['AR', 'MO']`,
   * Lake Erie is `['MI', 'OH', 'PA', 'NY']` (no ON because we
   * don't curate Canadian waters yet).
   */
  states: string[];
  /** Water type — drives section composition on the Conditions card. */
  type: WaterType;
  /**
   * Bounding box [southLat, westLng, northLat, eastLng].
   * Pin inside this box → match this body. Rivers use long thin
   * boxes following the water's course.
   */
  bbox: [number, number, number, number];
  /** Centroid — used for "near here" sorting + map fly-to. */
  centroid: { lat: number; lng: number };
  /**
   * Surface area in acres (lakes / reservoirs) or river miles.
   * Used as a tiebreaker when bboxes overlap. Optional — many GNIS
   * entries will lack it and we fall back to bbox area.
   */
  surfaceAreaAcres?: number;

  /**
   * Curated data-provider config. The auto-detect uses this when
   * the user drops a pin in the bbox — overrides the geometric
   * nearest-station heuristics. Each provider kind is optional
   * (most lakes need only `lakeData`; tailwaters need `flow` +
   * `damSchedule`; saltwater needs `tides`).
   */
  dataProviders?: Partial<DataProviders>;
  /**
   * Alternative lake-data stations to present as picker options.
   * The primary lives at `dataProviders.lakeData`; these are the
   * secondary choices the user can swap to. Carries a friendly
   * label for the picker row.
   */
  alternateLakeStations?: Array<{
    provider: LakeDataProvider;
    label: string;
  }>;

  /**
   * Common / target species. Drives Phase 2's catch-form species
   * pre-filter — instead of the 188-entry master list, the spot
   * sees just the species actually present here.
   */
  species?: string[];
  /**
   * Tags that map onto specific hatches in `data/hatches.json`.
   * Lets a Lake Cumberland spot suppress trout-stream hatches and
   * surface stocker / striper-relevant prey instead.
   */
  hatchTags?: string[];
  /** Quick-reference popular lures / flies for this water. */
  popularLures?: string[];
  /** Public regulations URL (state DNR page). */
  regulationsUrl?: string;
  /** Short access / etiquette / parking notes. */
  accessNotes?: string;
  /** Curated access points / launches inside this water. */
  primaryAccess?: WaterbodyAccessPoint[];
  /**
   * Anadromous-run barriers. Each entry: which species, where their
   * upstream migration ends, and any seasonal note. Lets the briefing
   * AI tell anglers things like "salmon run reaches up to Tippy Dam"
   * without inferring from prose.
   *
   * Examples:
   *   - Big Manistee: Chinook → Tippy Dam (impassable)
   *   - Muskegon:   Steelhead → Croton Dam
   *   - Lower Au Sable: Steelhead → Foote Dam
   *   - Grand: Salmon → Sixth Street Dam (Grand Rapids)
   */
  runLimits?: Array<{
    species: string;
    /**
     * Human-readable barrier description — usually a dam name + brief
     * navigability note. e.g., "Tippy Dam (impassable)" or "Foote Dam".
     */
    limit: string;
    /** Optional seasonal note, e.g. "Peak runs Sept-Nov". */
    note?: string;
  }>;
}

export interface WaterbodyMatch {
  /** Matched waterbody. */
  waterbody: Waterbody;
  /** True when more than one entry's bbox contained the pin — UX
   * can show "matched as `<name>` — change?" affordance. */
  ambiguous: boolean;
}

// Lazy import to keep this file dependency-light and to make the
// state-file fan-out obvious from the registry root.
import { ALL_WATERBODIES } from './data';

/**
 * Returns the most-specific waterbody whose bbox contains the pin,
 * or null if no entry matches. "Most specific" = smallest bbox
 * area among matches; that naturally prefers Lake St. Clair over
 * Lake Erie even when both bboxes claim a pin on the connecting
 * water.
 *
 * Future: with a spatial index this becomes an R-tree query; the
 * tiebreak logic moves into the candidates list. Public signature
 * stays the same.
 */
export function lookupWaterbody(lat: number, lng: number): WaterbodyMatch | null {
  const hits: Waterbody[] = [];
  for (const w of ALL_WATERBODIES) {
    const [s, west, n, e] = w.bbox;
    if (lat >= s && lat <= n && lng >= west && lng <= e) {
      hits.push(w);
    }
  }
  if (hits.length === 0) return null;
  if (hits.length === 1) {
    return { waterbody: hits[0], ambiguous: false };
  }
  // Prefer the entry whose bbox covers the smallest geographic area
  // (Lake St. Clair beats Lake Erie when both bboxes claim the pin).
  hits.sort((a, b) => bboxArea(a.bbox) - bboxArea(b.bbox));
  return { waterbody: hits[0], ambiguous: true };
}

/** Approximate bbox area in degrees². Good enough for tie-breaking. */
function bboxArea(bbox: Waterbody['bbox']): number {
  const [s, w, n, e] = bbox;
  return Math.abs((n - s) * (e - w));
}

/**
 * Look up a waterbody by id. Used by spot-level UI that has
 * already stored a registry id from a previous match.
 */
export function getWaterbody(id: string): Waterbody | null {
  return ALL_WATERBODIES.find((w) => w.id === id) ?? null;
}

/**
 * Look up by name or alias (case-insensitive substring). Used by
 * the search bar's future "did you mean Lake X?" suggestion path.
 */
export function findWaterbodiesByName(query: string, limit = 5): Waterbody[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const hits: Array<{ w: Waterbody; score: number }> = [];
  for (const w of ALL_WATERBODIES) {
    const name = w.name.toLowerCase();
    let score = 0;
    if (name === q) score = 100;
    else if (name.startsWith(q)) score = 80;
    else if (name.includes(q)) score = 50;
    else if (w.aliases?.some((a) => a.toLowerCase().includes(q))) score = 30;
    if (score > 0) hits.push({ w, score });
  }
  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, limit).map((h) => h.w);
}

/** Total registry size — surfaced in admin/diagnostic views. */
export function waterbodyCount(): number {
  return ALL_WATERBODIES.length;
}
