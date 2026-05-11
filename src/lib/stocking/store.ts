import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  limit as fsLimit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
  where,
} from 'firebase/firestore';
import { getFirebaseApp } from '@/lib/firebase';
import type { StockingEvent } from './types';
import type { Location } from '@/lib/providers/types';

/**
 * Shared stocking events at `stockingEvents/{id}`. Anyone in the group
 * can add an entry; reads are scoped at query-time by state + recency.
 *
 * Why top-level: stocking is collective intel (Caney is Caney for
 * everyone). Future auto-scrapers writing here keep the same path.
 */

function db() {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not configured');
  return getFirestore(app);
}

const colName = 'stockingEvents';

export async function saveStockingEvent(
  event: Omit<StockingEvent, 'createdAt'>
): Promise<void> {
  await setDoc(doc(db(), colName, event.id), {
    ...stripUndefined(event),
    createdAt: Timestamp.now(),
  });
}

export async function deleteStockingEvent(id: string): Promise<void> {
  await deleteDoc(doc(db(), colName, id));
}

/**
 * Live subscription scoped to a single state — returns events from the
 * last `lookbackDays` (default 30) so the conditions card can flag a
 * recent stocking. Sorted by date desc.
 */
export function watchRecentStockingByState(
  state: string,
  cb: (events: StockingEvent[]) => void,
  lookbackDays = 30
): () => void {
  const cutoffMs = Date.now() - lookbackDays * 24 * 60 * 60 * 1000;
  const cutoffDate = new Date(cutoffMs).toISOString().slice(0, 10);
  const q = query(
    collection(db(), colName),
    where('state', '==', state.toUpperCase()),
    where('date', '>=', cutoffDate),
    orderBy('date', 'desc'),
    fsLimit(100)
  );
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => d.data() as StockingEvent));
  });
}

/** One-shot read of recent events near a location. */
export async function fetchRecentStockingNearLocation(
  location: Location,
  lookbackDays = 30
): Promise<StockingEvent[]> {
  const cutoffMs = Date.now() - lookbackDays * 24 * 60 * 60 * 1000;
  const cutoffDate = new Date(cutoffMs).toISOString().slice(0, 10);
  const q = query(
    collection(db(), colName),
    where('state', '==', location.state.toUpperCase()),
    where('date', '>=', cutoffDate),
    orderBy('date', 'desc'),
    fsLimit(100)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as StockingEvent);
}

/**
 * Filters a state-wide event list down to ones that *probably apply* to
 * this location:
 *   - direct locationId match → always include
 *   - GPS coords present → include if within `maxMiles`
 *   - GPS coords missing AND no locationId → include (state-wide
 *     bulletin — better to show than hide; many auto-scrapers don't
 *     publish lat/lng, and a "stocked somewhere in your state this
 *     week" signal is still useful)
 *   - GPS coords present and outside the radius → exclude
 *   - Location bound to a *different* spot id → exclude
 */
export function filterStockingForLocation(
  events: StockingEvent[],
  location: Location,
  maxMiles = 25
): StockingEvent[] {
  return events.filter((ev) => {
    // Bound to a specific other spot? Exclude.
    if (ev.locationId && ev.locationId !== location.id) return false;
    if (ev.locationId && ev.locationId === location.id) return true;
    if (ev.lat != null && ev.lng != null) {
      const miles = haversineMiles(
        { lat: location.lat, lng: location.lng },
        { lat: ev.lat, lng: ev.lng }
      );
      return miles <= maxMiles;
    }
    // No coords, no locationId, but the state-wide subscription already
    // confirmed this event is in `location.state`. Surface it.
    return true;
  });
}

function haversineMiles(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function stripUndefined<T extends Record<string, unknown>>(value: T): T {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value)) {
    if (v !== undefined) out[k] = v;
  }
  return out as T;
}
