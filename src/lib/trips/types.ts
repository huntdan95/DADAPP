import type { Timestamp } from 'firebase/firestore';

/**
 * Lightweight trip wrapper. A trip is just a time-bounded window the
 * user explicitly opens — log entries created while the trip is active
 * carry the `tripId`, and the trip doc itself records start/end +
 * primary location for summarization.
 *
 * Lives at users/{uid}/trips/{tripId}. Per-user, not shared, since
 * "my trip Sunday" is personal context — the catches inside that trip
 * remain shared/visible at the log level via the existing rules.
 *
 * Soft contract: an active trip is one with no `endTime`. The store
 * enforces "only one active trip at a time" — starting a new trip
 * while another is open auto-closes the old one with `endTime=now`.
 */
export interface Trip {
  id: string;
  userId: string;
  /** Free-text label, e.g. "Sunday at Caney". Defaults to the spot name. */
  name?: string;
  /** Primary location for the trip — used as default for log entries. */
  primaryLocationId?: string;
  primaryLocationName?: string;
  startTime: string;          // ISO
  endTime?: string;           // ISO; absent → trip is active
  /** Auto-computed when the trip ends: count of log entries created during it. */
  entryCount?: number;
  createdAt: Timestamp | null;
}

export function newTripId(): string {
  return `trip-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
