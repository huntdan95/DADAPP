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
  type: string;         // 'slipway' typically
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

/** Pulls all leisure=slipway nodes + ways for a state via Overpass. */
async function fetchStateLaunches(state: string): Promise<BoatLaunch[]> {
  const query = `[out:json][timeout:90];
area["ISO3166-2"="US-${state}"][admin_level=4]->.a;
(
  node["leisure"="slipway"](area.a);
  way["leisure"="slipway"](area.a);
);
out center tags;`;

  const body = `data=${encodeURIComponent(query)}`;
  const res = await fetch(OVERPASS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
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

  const launches: BoatLaunch[] = [];
  for (const el of json.elements) {
    const lat = el.lat ?? el.center?.lat;
    const lng = el.lon ?? el.center?.lon;
    if (lat == null || lng == null) continue;
    const name =
      el.tags?.name ??
      el.tags?.['name:en'] ??
      el.tags?.operator ??
      'Boat launch';
    launches.push({
      id: `osm-${el.type}-${el.id}`,
      name,
      lat: Number(lat.toFixed(5)),
      lng: Number(lng.toFixed(5)),
      state,
      type: el.tags?.leisure ?? 'slipway',
      source: 'osm',
    });
  }
  return launches;
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
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Must be signed in');
    }
    const results = await seedAll();
    return { results };
  }
);
