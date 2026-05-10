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
  type: string;
  source: 'osm';
}

export interface BoatLaunchSet {
  state: string;
  launches: BoatLaunch[];
  count: number;
  source: 'osm';
  fetchedAt: Timestamp | null;
}

const STATES = ['MI', 'TN', 'IN', 'NC', 'FL', 'GA', 'AL'];

function db() {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not configured');
  return getFirestore(app);
}

/** Reads all 7 state docs in parallel and flattens. */
export async function listAllBoatLaunches(): Promise<BoatLaunch[]> {
  const sets = await Promise.all(
    STATES.map(async (s) => {
      const snap = await getDoc(doc(db(), 'boatLaunchSets', s));
      return snap.exists() ? (snap.data() as BoatLaunchSet) : null;
    })
  );
  const all: BoatLaunch[] = [];
  for (const s of sets) if (s?.launches) all.push(...s.launches);
  return all;
}

/** Quick metadata read (state, count, fetchedAt) for the seed UI. */
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
