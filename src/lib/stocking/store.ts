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

// ---- Per-state cache (mirrors boat-launches stale-while-revalidate) -------
//
// Stocking events change at most weekly (Monday cron). A spot in MI / TN / GA
// can reuse the same state's event list across every visit, AND across
// every USER who has spots in that state. With Firestore offline
// persistence already enabled by firebase.ts, repeat reads are already
// fast — but a localStorage layer makes the FIRST paint instant even
// before Firestore's offline cache has been populated (e.g. fresh
// install, private browsing, after clearing storage).

const STOCKING_CACHE_PREFIX = 'dad-fishing.stocking.v1.';
/** Cache validity. Stocking dataset only changes weekly via the cron. */
const STOCKING_CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;       // 7 days

interface StockingCachePayload {
  cachedAt: number;
  state: string;
  events: StockingEvent[];
}

function stockingCacheKey(state: string): string {
  return `${STOCKING_CACHE_PREFIX}${state.toUpperCase()}`;
}

function readStockingCache(state: string): StockingEvent[] | null {
  try {
    const raw = localStorage.getItem(stockingCacheKey(state));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StockingCachePayload;
    if (!parsed?.events || !Array.isArray(parsed.events)) return null;
    if (Date.now() - parsed.cachedAt > STOCKING_CACHE_MAX_AGE_MS) return null;
    return parsed.events;
  } catch {
    return null;
  }
}

function writeStockingCache(state: string, events: StockingEvent[]): void {
  try {
    const payload: StockingCachePayload = {
      cachedAt: Date.now(),
      state: state.toUpperCase(),
      events,
    };
    localStorage.setItem(stockingCacheKey(state), JSON.stringify(payload));
  } catch {
    // localStorage quota — silently ignore.
  }
}

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
  const daysBack = opts.daysBack ?? 90;        // ~one season of history
  const daysForward = opts.daysForward ?? 90;  // upcoming season

  // Instant paint from localStorage cache (if available and fresh).
  // The banner sees data on the very first frame; the Firestore
  // subscription below replaces it with the live version when ready.
  const cached = readStockingCache(state);
  if (cached) cb(cached);

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
    const events = snap.docs.map((d) => d.data() as StockingEvent);
    // Write-through to localStorage so the NEXT app-load paints from
    // cache without waiting for the network.
    writeStockingCache(state, events);
    cb(events);
  });
}

/**
 * One-shot prefetch for a set of states. Fire-and-forget — no return
 * value. Used at app boot to pre-warm the localStorage cache for the
 * states the user has spots in, so opening any spot's banner is
 * instant. Idempotent: re-running just refreshes the cache.
 */
export async function prefetchStockingForStates(states: string[]): Promise<void> {
  const unique = Array.from(new Set(states.map((s) => s.toUpperCase())));
  if (unique.length === 0) return;
  await Promise.all(
    unique.map(async (state) => {
      const daysBack = 90;
      const daysForward = 90;
      const startMs = Date.now() - daysBack * 86_400_000;
      const endMs = Date.now() + daysForward * 86_400_000;
      const startDate = new Date(startMs).toISOString().slice(0, 10);
      const endDate = new Date(endMs).toISOString().slice(0, 10);
      try {
        const q = query(
          collection(db(), colName),
          where('state', '==', state),
          where('date', '>=', startDate),
          where('date', '<=', endDate),
          orderBy('date', 'desc'),
          fsLimit(300)
        );
        const snap = await getDocs(q);
        const events = snap.docs.map((d) => d.data() as StockingEvent);
        writeStockingCache(state, events);
      } catch {
        // Best-effort prefetch — silent.
      }
    })
  );
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
  // Tokenize the spot's identifying fields once. Token-based match
  // handles the "Big Manistee" vs "Manistee River" prefix mismatch
  // problem that substring matching couldn't — both reduce to the
  // same meaningful token set ('manistee'), so they cross-match.
  const riverTokens = meaningfulTokens(location.river ?? '');
  const nameTokens = meaningfulTokens(location.name ?? '');
  const locCounty = (location.county ?? '').toLowerCase().trim();

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

    // Tier 3: river-token overlap. Tokenize the event's locationName
    // and check whether any meaningful token from the spot's river
    // field appears. "Big Manistee" → ['manistee']; event 'Manistee
    // River (Manistee Co.)' → tokens include 'manistee' → match.
    const evTokens = new Set(meaningfulTokens(ev.locationName ?? ''));
    if (riverTokens.length > 0 && riverTokens.some((t) => evTokens.has(t))) {
      return true;
    }

    // Tier 4: county substring match. Counties are typically one
    // word so substring is fine; 4-char minimum keeps it specific.
    if (
      locCounty.length >= 4 &&
      (ev.locationName ?? '').toLowerCase().includes(locCounty)
    ) {
      return true;
    }

    // Tier 5: spot-name token overlap — for spots where the river
    // field is empty but the spot's name itself contains the
    // waterbody (e.g. 'Lake Cumberland at Wolf Creek' → 'cumberland'
    // matches a Cumberland River event).
    if (nameTokens.length > 0 && nameTokens.some((t) => evTokens.has(t))) {
      return true;
    }

    // No match at any tier → exclude. Event still exists in
    // Firestore and surfaces in System Health.
    return false;
  });
}

/**
 * Lowercase + tokenize a waterbody or spot name into meaningful
 * tokens for cross-matching. Strips common noise words (big /
 * little / upper / lower / river / creek / etc.) and short tokens
 * (<3 chars) that would match too eagerly.
 *
 * Examples:
 *   "Big Manistee River"  → ['manistee']
 *   "Upper Au Sable"      → ['sable']     ('au' is 2 chars, filtered)
 *   "Caney Fork"          → ['caney']     ('fork' filtered)
 *   "Lake Cumberland"     → ['cumberland']
 *   "Pine Creek (Smith)"  → ['pine', 'smith']
 *
 * So "Big Manistee" and "Manistee River" both produce ['manistee']
 * and cross-match correctly.
 */
function meaningfulTokens(s: string): string[] {
  const SKIP = new Set([
    'the', 'and', 'at', 'of', 'in', 'on', 'by',
    'river', 'creek', 'stream', 'brook', 'run', 'fork', 'branch',
    'lake', 'pond', 'reservoir', 'res', 'bay', 'cove',
    'big', 'little', 'upper', 'lower', 'middle', 'main',
    'north', 'south', 'east', 'west',
    'co', 'county', 'state', 'park', 'access',
  ]);
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length >= 3 && !SKIP.has(t));
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
