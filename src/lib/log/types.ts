import type { ConditionsSnapshot, FishingMethod } from '@/lib/journal/types';
export type { FishingMethod, ConditionsSnapshot } from '@/lib/journal/types';

/**
 * Flat log entry. Replaces the old Trip/Catch hierarchy with a single
 * append-only stream of observations. A `catch` is a fish; a `hatch` is
 * an insect sighting (drives hatch-tracking over time); a `note` is a
 * free-text observation with optional photo.
 */

export type LogKind = 'catch' | 'hatch' | 'note';

export type HatchStage =
  | 'adult'
  | 'dun'
  | 'spinner'
  | 'emerger'
  | 'nymph'
  | 'larva'
  | 'pupa'
  | 'unknown';

export interface LogEntry {
  id: string;
  userId: string;
  kind: LogKind;
  time: string;                  // ISO; defaults to now on creation

  /** Position captured at log time. May be missing if user denied geolocation. */
  gps?: { lat: number; lng: number };
  /** Resolved closest saved spot at log-time (within ~3 mi). */
  locationId?: string;
  /** Human label — frozen at log-time so renames don't lose history. */
  locationName?: string;

  /** Firebase Storage download URL. */
  photoUrl?: string;
  /** Storage path (for delete on entry removal). */
  photoPath?: string;
  /**
   * True when the photo blob is stashed in the IndexedDB upload queue
   * (saved offline). A background worker drains the queue on
   * reconnect, uploads the blob to Storage, and clears this flag.
   */
  photoQueued?: boolean;

  // ---- kind === 'catch' ----
  species?: string;
  speciesConfidence?: 'high' | 'medium' | 'low';
  lengthInches?: number;
  flyOrLure?: string;
  method?: FishingMethod;
  trollingDepthFt?: number;
  trollingSpeedMph?: number;
  releasedOrKept?: 'released' | 'kept';

  // ---- kind === 'hatch' ----
  /** Common name from Claude or user (e.g. "Sulfur", "BWO", "Yellow Sally"). */
  hatchName?: string;
  /** Matched hatch id from data/hatches.json if confident. */
  hatchId?: string;
  hatchStage?: HatchStage;

  notes?: string;

  /**
   * Tag set when the entry was created during an active trip. Used by
   * the trip detail view to group entries; nullable so non-trip
   * logging stays simple.
   */
  tripId?: string | null;

  /** Auto-snapshot weather + solunar at log time. */
  conditions: ConditionsSnapshot;
  /** Auto-snapshot from the nearest gauge if we found one. */
  flowReading?: {
    siteId: string;
    siteName: string;
    flowCfs?: number;
    gaugeFt?: number;
    waterTempF?: number;
    observedAt?: string;
  };
}

export function newLogId(): string {
  return `log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
