import { onSchedule } from 'firebase-functions/v2/scheduler';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

/**
 * Seeds boat launches into Firestore from OpenStreetMap via the Overpass
 * API. One Firestore doc per state at boatLaunchSets/{state}, each
 * containing a `launches` array — fewer reads than a doc per launch
 * (which would burn 7K+ reads per session).
 *
 * Scheduled monthly, plus a callable HTTPS trigger so a signed-in user
 * can fire an initial / on-demand refresh from the client.
 */

interface BoatLaunch {
  id: string;
  name: string;
  lat: number;
  lng: number;
  state: string;        // 'MI', 'TN', etc.
  /**
   * Coarse classification:
   *   - 'ramp' = motorboat-capable slipway (the original leisure=slipway)
   *   - 'put-in' = canoe/kayak access (no trailer launch)
   *   - 'pier' = dock or pier with explicit boat access
   *   - 'rental' = boat rental — often near a usable launch
   */
  type: 'ramp' | 'put-in' | 'pier' | 'rental';
  source: 'osm';
}

interface BoatLaunchSet {
  state: string;
  launches: BoatLaunch[];
  count: number;
  source: 'osm';
  fetchedAt: FirebaseFirestore.Timestamp;
}

const STATES = ['MI', 'TN', 'IN', 'NC', 'FL', 'GA', 'AL'];

const OVERPASS = 'https://overpass-api.de/api/interpreter';

/**
 * Pulls every relevant water-access tag for a state via Overpass.
 *
 * `leisure=slipway` is the classic motorboat ramp tag, but anglers also
 * launch canoes/kayaks at OSM-tagged put-ins (whitewater=put_in,
 * canoe=put_in, etc.) and at piers. Trolling these tags adds Manistee
 * spots like Tree Farm and Hole in the Wall that the slipway-only query
 * was missing entirely.
 *
 * We then dedupe by ~30m proximity so a multi-tagged single launch
 * doesn't show up as three pins on top of each other.
 */
async function fetchStateLaunches(state: string): Promise<BoatLaunch[]> {
  const query = `[out:json][timeout:120];
area["ISO3166-2"="US-${state}"][admin_level=4]->.a;
(
  node["leisure"="slipway"](area.a);
  way["leisure"="slipway"](area.a);
  node["whitewater"="put_in"](area.a);
  node["whitewater"="egress"](area.a);
  node["canoe"="put_in"](area.a);
  node["canoe"="access"](area.a);
  node["kayak"="put_in"](area.a);
  node["waterway"="access_point"](area.a);
  node["waterway"="put_in"](area.a);
  node["amenity"="boat_rental"](area.a);
  way["amenity"="boat_rental"](area.a);
  node["man_made"="pier"]["boat"="yes"](area.a);
  way["man_made"="pier"]["boat"="yes"](area.a);
);
out center tags;`;

  // Overpass returns HTTP 406 from our previous POST shape — switching to
  // GET with the query as a URL parameter (and explicit Accept + UA
  // headers) matches what tested cleanly from curl.
  const url = `${OVERPASS}?data=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'dad-fishing-co-pilot/0.1 (https://github.com/huntdan95/DADAPP)',
    },
  });
  if (!res.ok) {
    throw new Error(`Overpass HTTP ${res.status} for ${state}`);
  }
  const json = (await res.json()) as {
    elements: Array<{
      type: 'node' | 'way' | 'relation';
      id: number;
      lat?: number;
      lon?: number;
      center?: { lat: number; lon: number };
      tags?: Record<string, string>;
    }>;
  };

  const raw: BoatLaunch[] = [];
  for (const el of json.elements) {
    const lat = el.lat ?? el.center?.lat;
    const lng = el.lon ?? el.center?.lon;
    if (lat == null || lng == null) continue;
    const tags = el.tags ?? {};
    const type = classifyType(tags);
    const name =
      tags.name ??
      tags['name:en'] ??
      tags.operator ??
      defaultNameForType(type);
    raw.push({
      id: `osm-${el.type}-${el.id}`,
      name,
      lat: Number(lat.toFixed(5)),
      lng: Number(lng.toFixed(5)),
      state,
      type,
      source: 'osm',
    });
  }

  return dedupeNearby(raw);
}

/**
 * Pick a single coarse `type` from however the OSM contributor tagged
 * the feature. Order matters — a ramp tag wins over a put-in tag at
 * the same node (the ramp use case is broader).
 */
function classifyType(tags: Record<string, string>): BoatLaunch['type'] {
  if (tags.leisure === 'slipway') return 'ramp';
  if (tags.amenity === 'boat_rental') return 'rental';
  if (tags.man_made === 'pier') return 'pier';
  if (
    tags.whitewater === 'put_in' ||
    tags.whitewater === 'egress' ||
    tags.canoe === 'put_in' ||
    tags.canoe === 'access' ||
    tags.kayak === 'put_in' ||
    tags.waterway === 'access_point' ||
    tags.waterway === 'put_in'
  ) {
    return 'put-in';
  }
  return 'ramp';
}

function defaultNameForType(type: BoatLaunch['type']): string {
  switch (type) {
    case 'ramp':
      return 'Boat ramp';
    case 'put-in':
      return 'Canoe / kayak access';
    case 'pier':
      return 'Pier';
    case 'rental':
      return 'Boat rental';
  }
}

/**
 * Coalesce launches that sit within ~30 m of each other and share the
 * same name (case-insensitive). OSM contributors sometimes tag the
 * same access point twice (once as a slipway, once as a put-in) and
 * we don't want two pins for one launch. We prefer the most specific
 * type — ramp > pier > rental > put-in.
 */
function dedupeNearby(list: BoatLaunch[]): BoatLaunch[] {
  const rank: Record<BoatLaunch['type'], number> = {
    ramp: 3,
    pier: 2,
    rental: 2,
    'put-in': 1,
  };
  // Bucket by 0.0005° lat/lng cells (~50 m).
  const cellKey = (l: BoatLaunch) =>
    `${Math.round(l.lat * 2000)}_${Math.round(l.lng * 2000)}`;
  const groups = new Map<string, BoatLaunch[]>();
  for (const l of list) {
    const k = cellKey(l);
    const bucket = groups.get(k) ?? [];
    bucket.push(l);
    groups.set(k, bucket);
  }
  const out: BoatLaunch[] = [];
  for (const bucket of groups.values()) {
    if (bucket.length === 1) {
      out.push(bucket[0]);
      continue;
    }
    // Within a cell, group by normalized name.
    const byName = new Map<string, BoatLaunch[]>();
    for (const l of bucket) {
      const n = l.name.trim().toLowerCase();
      const g = byName.get(n) ?? [];
      g.push(l);
      byName.set(n, g);
    }
    for (const g of byName.values()) {
      g.sort((a, b) => rank[b.type] - rank[a.type]);
      out.push(g[0]);
    }
  }
  return out;
}

async function seedAll(): Promise<{ state: string; count: number }[]> {
  const db = getFirestore();
  const results: { state: string; count: number }[] = [];

  for (const state of STATES) {
    try {
      logger.info('fetching launches', { state });
      const launches = await fetchStateLaunches(state);
      const set: Omit<BoatLaunchSet, 'fetchedAt'> = {
        state,
        launches,
        count: launches.length,
        source: 'osm',
      };
      await db.collection('boatLaunchSets').doc(state).set({
        ...set,
        fetchedAt: FieldValue.serverTimestamp(),
      });
      results.push({ state, count: launches.length });
      // Rate-limit Overpass — 3 s between states.
      await new Promise((r) => setTimeout(r, 3000));
    } catch (e) {
      logger.error('seed failed', { state, error: String(e) });
      results.push({ state, count: -1 });
    }
  }
  return results;
}

/** Scheduled monthly refresh — boat launches don't change often. */
export const seedBoatLaunches = onSchedule(
  {
    schedule: '0 6 1 * *',          // 06:00 on the 1st of each month
    timeZone: 'America/New_York',
    region: 'us-central1',
    memory: '512MiB',
    timeoutSeconds: 540,
  },
  async () => {
    const results = await seedAll();
    logger.info('seeded boat launches', { results });
  }
);

/**
 * Callable variant: a signed-in client can trigger this to do the
 * initial seed (or refresh) without waiting for the monthly schedule.
 * Returns per-state counts so the UI can show a confirmation.
 */
export const seedBoatLaunchesCallable = onCall(
  {
    region: 'us-central1',
    memory: '512MiB',
    timeoutSeconds: 540,
    invoker: 'public',
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Must be signed in');
    }
    const results = await seedAll();
    return { results };
  }
);
