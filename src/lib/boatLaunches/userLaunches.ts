import {
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { getFirebaseApp, getFirebaseAuth } from '@/lib/firebase';
import type { BoatLaunch } from './store';

/**
 * Per-user manually-added boat launches. Lives at
 *   users/{uid}/boatLaunches/{id}
 *
 * These are merged into the public OSM-sourced launches in the map view
 * so the user sees one combined layer. User-added launches survive a
 * re-seed of the OSM data (OSM lives at a different top-level path).
 */

export interface UserBoatLaunchDoc {
  id: string;
  name: string;
  lat: number;
  lng: number;
  state: string;
  type: BoatLaunch['type'];
  note?: string;
  createdAt: Timestamp;
}

function db() {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not configured');
  return getFirestore(app);
}

function uid(): string | null {
  const app = getFirebaseApp();
  if (!app) return null;
  return getFirebaseAuth()?.currentUser?.uid ?? null;
}

function userLaunchesCol() {
  const u = uid();
  if (!u) throw new Error('Not signed in');
  return collection(db(), 'users', u, 'boatLaunches');
}

export function newUserLaunchId(): string {
  return `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function saveUserLaunch(launch: UserBoatLaunchDoc): Promise<void> {
  // Drop undefined fields — Firestore rejects them and we want to allow
  // optional notes/state without forcing the form to type them out.
  const cleaned: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(launch)) {
    if (v !== undefined) cleaned[k] = v;
  }
  await setDoc(doc(userLaunchesCol(), launch.id), cleaned);
}

export async function deleteUserLaunch(id: string): Promise<void> {
  await deleteDoc(doc(userLaunchesCol(), id));
}

/**
 * Live subscription. Caller receives a `BoatLaunch[]` shaped the same as
 * OSM ones so we can dump them into the same map layer.
 */
export function watchUserLaunches(
  cb: (launches: BoatLaunch[]) => void
): () => void {
  const u = uid();
  if (!u) {
    cb([]);
    return () => undefined;
  }
  return onSnapshot(userLaunchesCol(), (snap) => {
    const list: BoatLaunch[] = snap.docs.map((d) => {
      const data = d.data() as UserBoatLaunchDoc;
      return {
        id: data.id,
        name: data.name,
        lat: data.lat,
        lng: data.lng,
        state: data.state || 'XX',
        type: data.type,
        source: 'user',
      };
    });
    cb(list);
  });
}
