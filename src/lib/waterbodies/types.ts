/**
 * Waterbody guide — a curated knowledge base of lakes and rivers
 * (species mix, fishing patterns, seasonality, access). Distinct
 * from the user's saved spots and from the stocking data; this is
 * reference material like a fishing-guide book.
 *
 * Initial seed is Indiana (Indianapolis and north). The schema is
 * state-agnostic so MI / NC / GA can be added later without a
 * structural change.
 */

export type WaterbodyType =
  | 'natural-lake'
  | 'reservoir'
  | 'river'
  | 'river-segment'
  | 'great-lake'
  | 'great-lake-trib'
  | 'tailwater'
  | 'pond';

/**
 * Region grouping for UI navigation. Strings are the source of truth —
 * the viewer derives the unique list from the data, so adding a new
 * region label only requires touching `waterbodies.json`.
 */
export interface SpeciesEntry {
  /** Common name in sentence case ('Largemouth bass', 'Channel catfish'). */
  name: string;
  /**
   * How much weight this species gets at this water:
   *   signature — the headliner, the reason you go
   *   strong    — well-represented, target it intentionally
   *   good      — solid populations, often caught
   *   present   — there but not a target species
   */
  importance: 'signature' | 'strong' | 'good' | 'present';
  /** Optional sizing/quality note, e.g. 'avg 12-15 in, 4-5 lb possible'. */
  size?: string;
  /** Any habitat / behavior hints. */
  notes?: string;
}

export interface PatternEntry {
  /** Short title like 'Summer drop-shot smallmouth'. */
  title: string;
  /** Species this targets (free text — matches what's in `species`). */
  target: string;
  /** Calendar window — 'July-September' / 'Apr-May 50-58°F water'. */
  when: string;
  /** The technique short-form — 'drop-shot 1/4 oz, 4" finesse worm'. */
  technique: string;
  /** Where to apply it — '15-25 ft rock + gravel humps off main lake'. */
  where: string;
  /** Long-form prose for any extra nuance. */
  details?: string;
}

export interface Waterbody {
  /** Slug id: 'in-lake-wawasee', 'in-river-tippecanoe'. */
  id: string;
  name: string;
  state: string;
  /** Region grouping (UI categorization). */
  region: string;
  type: WaterbodyType;
  /** Primary county (or first-listed for waters spanning multiple). */
  county?: string;
  /** Surface acres for lakes / reservoirs. */
  acres?: number;
  /** Max depth in feet — used to ground vertical-presentation patterns. */
  maxDepthFt?: number;
  /** River name for river segments. */
  river?: string;
  /** Approximate centroid (used as a quick-map hint, not for navigation). */
  lat?: number;
  lng?: number;
  /** Headline species — what most people come here for. */
  signatureSpecies?: string;
  species: SpeciesEntry[];
  patterns: PatternEntry[];
  /** Named ramps / access points, optional. */
  access?: string[];
  /** Notable size/limit highlights (not a full regs reference). */
  regulations?: string;
  /**
   * Any IDNR or fishery-management notes — muskie stocking program,
   * salmon stocking program, statewide special-status, etc.
   */
  managementProgram?: string[];
  /** Free-form prose. Where the spot's character + reputation lives. */
  notes?: string;
}
