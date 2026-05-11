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

/**
 * Wider live subscription covering BOTH past + future events in a
 * single window. The conditions banner uses this so it can show
 * upcoming stockings (if any in the next 90 days) and fall back to
 * historical events when nothing is scheduled.
 *
 * Single subscription is cheaper than two — same composite index
 * (state + date) handles it.
 */
export function watchStockingWindowByState(
  state: string,
  cb: (events: StockingEvent[]) => void,
  opts: { daysBack?: number; daysForward?: number } = {}
): () => void {
  const daysBack = opts.daysBack ?? 365;       // a year of history
  const daysForward = opts.daysForward ?? 90;  // upcoming season
  const startMs = Date.now() - daysBack * 86_400_000;
  const endMs = Date.now() + daysForward * 86_400_000;
  const startDate = new Date(startMs).toISOString().slice(0, 10);
  const endDate = new Date(endMs).toISOString().slice(0, 10);
  const q = query(
    collection(db(), colName),
    where('state', '==', state.toUpperCase()),
    where('date', '>=', startDate),
    where('date', '<=', endDate),
    orderBy('date', 'desc'),
    fsLimit(300)
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
 * Filters a state-wide event list down to events that *actually apply*
 * to this specific spot, using a tiered match.
 *
 * Match tiers (any match → include, falls through in order):
 *   1. locationId exact match (manual report bound to this spot)
 *   2. GPS proximity (within `maxMiles`)
 *   3. River / body-of-water substring match against the event's
 *      locationName — e.g. spot.river='Caney Fork' matches event
 *      'Caney Fork at Center Hill Dam (DeKalb Co.)'.
 *   4. County substring match against the event's locationName
 *      parenthetical — e.g. spot.county='DeKalb' matches the same
 *      event even if the river name didn't.
 *
 * Auto-scraped events without GPS used to fall into a state-wide
 * fallback (every event on every spot in the state) — that meant a
 * Hiwassee stocking showed on every TN spot. The tiered match here
 * keeps signal-to-noise high while still catching DNR reports that
 * mention the spot's water by name.
 *
 * Locations bound to a *different* spot id are always excluded.
 */
export function filterStockingForLocation(
  events: StockingEvent[],
  location: Location,
  maxMiles = 25
): StockingEvent[] {
  const locRiver = (location.river ?? '').toLowerCase().trim();
  const locCounty = (location.county ?? '').toLowerCase().trim();
  const locName = (location.name ?? '').toLowerCase().trim();

  return events.filter((ev) => {
    // Tier 1: locationId match (or mismatch).
    if (ev.locationId && ev.locationId !== location.id) return false;
    if (ev.locationId && ev.locationId === location.id) return true;

    // Tier 2: GPS proximity.
    if (ev.lat != null && ev.lng != null) {
      const miles = haversineMiles(
        { lat: location.lat, lng: location.lng },
        { lat: ev.lat, lng: ev.lng }
      );
      return miles <= maxMiles;
    }

    // Tiers 3 + 4: name-substring match against the event's
    // locationName. Auto-scraped events from state DNRs typically
    // have a locationName like "Caney Fork at Stonewall (DeKalb Co.)"
    // — that contains both the river name and the county.
    const evName = (ev.locationName ?? '').toLowerCase();

    // River match. Require 4+ chars so "Pine" doesn't match every
    // "Pine Creek" in the state but "Manistee" / "Caney Fork" do.
    if (locRiver.length >= 4 && evName.includes(locRiver)) return true;

    // County match — same minimum length.
    if (locCounty.length >= 4 && evName.includes(locCounty)) return true;

    // Spot-name fallback: if the spot's own name has a distinctive
    // waterbody prefix (e.g. "Lake Cumberland at Wolf Creek") that
    // didn't get split out into the river field, try matching that
    // too. Strict 6+ chars to avoid noisy matches.
    if (locName.length >= 6) {
      const first = locName.split(/[\s,()]+at\s+|[\s,()]+/)[0];
      if (first.length >= 6 && evName.includes(first)) return true;
    }

    // No match at any tier → exclude. The event is still in the
    // database and surfaces in System Health; just not on this
    // specific spot's banner.
    return false;
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
