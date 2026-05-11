import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  Timestamp,
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getFirebaseApp } from '@/lib/firebase';

export interface BoatLaunch {
  id: string;
  name: string;
  lat: number;
  lng: number;
  state: string;
  /**
   * 'ramp' = motorboat slipway. 'put-in' = canoe/kayak access (Tree Farm,
   * Hole in the Wall, etc). 'pier' = dock with explicit boat=yes tag.
   * 'rental' = boat rental. 'marina' = full marina. 'historic' = disused
   * or abandoned slipway tag.
   *
   * Older docs predate this classification — they store the raw OSM tag
   * ('slipway') and we coerce that to 'ramp' at read time below.
   */
  type: 'ramp' | 'put-in' | 'pier' | 'rental' | 'marina' | 'historic' | string;
  source: 'osm' | 'user';
}

export interface BoatLaunchSet {
  state: string;
  launches: BoatLaunch[];
  count: number;
  source: 'osm';
  fetchedAt: Timestamp | null;
}

const STATES = ['MI', 'TN', 'IN', 'NC', 'FL', 'GA', 'AL', 'KY'];
const CACHE_KEY = 'dad-fishing.boatLaunchesCache.v2';
/** Cache validity. Boat-launch dataset only changes when someone re-seeds. */
const CACHE_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;       // 14 days

function db() {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not configured');
  return getFirestore(app);
}

// ---- caching layer ---------------------------------------------------------
//
// First-page-load hits localStorage immediately so the map can render
// markers without a network round trip. In the background we ask Firestore
// for just the per-state `fetchedAt` timestamps and only re-download the
// full launches arrays when something has been re-seeded since our cache.

interface CachePayload {
  cachedAt: number;
  /** Map of state → ISO timestamp of the server's fetchedAt at cache time. */
  versions: Record<string, string>;
  launches: BoatLaunch[];
}

let memoryCache: CachePayload | null = null;

function readLocalCache(): CachePayload | null {
  if (memoryCache) return memoryCache;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachePayload;
    if (!parsed?.launches || !parsed?.versions) return null;
    if (Date.now() - parsed.cachedAt > CACHE_MAX_AGE_MS) return null;
    memoryCache = parsed;
    return parsed;
  } catch {
    return null;
  }
}

function writeLocalCache(payload: CachePayload) {
  memoryCache = payload;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // localStorage can throw on quota — fall back to memory-only cache.
  }
}

/** Pulls a state's full launches doc (a single getDoc). */
async function fetchStateLaunches(state: string): Promise<BoatLaunchSet | null> {
  const snap = await getDoc(doc(db(), 'boatLaunchSets', state));
  if (!snap.exists()) return null;
  return snap.data() as BoatLaunchSet;
}

function versionKey(set: BoatLaunchSet): string {
  // toMillis gives a stable integer string across reads of the same value.
  return set.fetchedAt ? String(set.fetchedAt.toMillis()) : 'unknown';
}

/**
 * Loads launches with stale-while-revalidate semantics. `onUpdate` fires
 * exactly once if a fresh server-side version is detected after the cached
 * copy was already returned, so the map can update mid-session.
 */
export async function loadBoatLaunchesCached(
  onUpdate?: (fresh: BoatLaunch[]) => void
): Promise<BoatLaunch[]> {
  const cache = readLocalCache();
  if (cache) {
    // Background revalidation. Don't block the caller.
    void revalidate(cache, onUpdate);
    return cache.launches;
  }
  return await freshLoad();
}

async function freshLoad(): Promise<BoatLaunch[]> {
  const sets = await Promise.all(STATES.map(fetchStateLaunches));
  const all: BoatLaunch[] = [];
  const versions: Record<string, string> = {};
  sets.forEach((s, i) => {
    if (s?.launches) all.push(...s.launches);
    if (s) versions[STATES[i]] = versionKey(s);
  });
  writeLocalCache({ cachedAt: Date.now(), versions, launches: all });
  return all;
}

async function revalidate(
  cache: CachePayload,
  onUpdate?: (fresh: BoatLaunch[]) => void
): Promise<void> {
  try {
    // Read only metadata first — cheap.
    const meta = await listBoatLaunchSetMeta();
    const newVersions: Record<string, string> = {};
    for (const m of meta) {
      newVersions[m.state] = m.fetchedAt
        ? String(m.fetchedAt.toMillis())
        : 'unknown';
    }
    // If every state we have cached matches, no work to do.
    const stale = STATES.some(
      (st) => (cache.versions[st] ?? '') !== (newVersions[st] ?? '')
    );
    if (!stale) return;
    const fresh = await freshLoad();
    onUpdate?.(fresh);
  } catch {
    // Revalidation is best-effort; cache stays valid.
  }
}

/** Reads all 7 state docs in parallel and flattens. Cache-bypassing. */
export async function listAllBoatLaunches(): Promise<BoatLaunch[]> {
  return freshLoad();
}

/** Quick metadata read (state, count, fetchedAt) for cache revalidation. */
export async function listBoatLaunchSetMeta(): Promise<
  Array<{ state: string; count: number; fetchedAt: Timestamp | null }>
> {
  const snap = await getDocs(collection(db(), 'boatLaunchSets'));
  return snap.docs.map((d) => {
    const data = d.data() as BoatLaunchSet;
    return {
      state: d.id,
      count: data.count ?? 0,
      fetchedAt: data.fetchedAt ?? null,
    };
  });
}

/** Clears the cache (used after a successful client-triggered re-seed). */
export function invalidateBoatLaunchCache(): void {
  memoryCache = null;
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    // ignore
  }
}

/** Triggers the Cloud Function to (re)seed all 7 states from Overpass. */
export async function callSeedBoatLaunches(): Promise<{
  results: Array<{ state: string; count: number }>;
}> {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not configured');
  const functions = getFunctions(app, 'us-central1');
  const fn = httpsCallable<unknown, { results: Array<{ state: string; count: number }> }>(
    functions,
    'seedBoatLaunchesCallable'
  );
  const res = await fn({});
  invalidateBoatLaunchCache();
  return res.data;
}

/** Great-circle distance in km using the haversine formula. */
export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function distanceMiles(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  return distanceKm(a, b) * 0.621371;
}
