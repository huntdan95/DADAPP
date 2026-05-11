import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit as fsLimit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getFirebaseApp } from '@/lib/firebase';
import type { Trip } from './types';
import { newTripId } from './types';
import type { Location } from '@/lib/providers/types';

function db() {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not configured');
  return getFirestore(app);
}

function uid(): string {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not configured');
  const u = getAuth(app).currentUser;
  if (!u) throw new Error('Not signed in');
  return u.uid;
}

const tripsCol = () => collection(db(), 'users', uid(), 'trips');

/**
 * Starts a new trip. If another trip is currently active, auto-ends
 * it first (single-active-trip invariant). Returns the new trip.
 */
export async function startTrip(opts: {
  location?: Location;
  name?: string;
}): Promise<Trip> {
  // Close any active trip silently.
  await endActiveTripIfAny();

  const id = newTripId();
  const startTime = new Date().toISOString();
  const trip: Trip = {
    id,
    userId: uid(),
    name: opts.name?.trim() || opts.location?.name,
    primaryLocationId: opts.location?.id,
    primaryLocationName: opts.location?.name,
    startTime,
    createdAt: Timestamp.now(),
  };
  await setDoc(doc(tripsCol(), id), stripUndefined(trip as unknown as Record<string, unknown>));
  return trip;
}

/**
 * Ends the trip with the given id (or the current active one if no id
 * passed). Also recomputes `entryCount` from the user's logs that
 * carry this tripId.
 */
export async function endTrip(tripId?: string): Promise<Trip | null> {
  const target = tripId
    ? await readTrip(tripId)
    : await findActiveTrip();
  if (!target) return null;
  const endTime = new Date().toISOString();

  // Count log entries created during this trip.
  const logSnap = await getDocs(
    query(
      collection(db(), 'users', uid(), 'logs'),
      where('tripId', '==', target.id)
    )
  );
  const entryCount = logSnap.size;

  await updateDoc(doc(tripsCol(), target.id), { endTime, entryCount });
  return { ...target, endTime, entryCount };
}

/**
 * Best-effort "close anything still open" before starting a new trip.
 */
async function endActiveTripIfAny(): Promise<void> {
  const active = await findActiveTrip();
  if (!active) return;
  await endTrip(active.id);
}

export async function readTrip(id: string): Promise<Trip | null> {
  const snap = await getDoc(doc(tripsCol(), id));
  return snap.exists() ? (snap.data() as Trip) : null;
}

export async function findActiveTrip(): Promise<Trip | null> {
  // We can't directly query "endTime missing" in Firestore — instead
  // pull the most recent trip and check its endTime client-side.
  const snap = await getDocs(
    query(tripsCol(), orderBy('startTime', 'desc'), fsLimit(1))
  );
  if (snap.empty) return null;
  const t = snap.docs[0].data() as Trip;
  return t.endTime ? null : t;
}

/**
 * Live subscription to the active trip (if any). Fires `null` when
 * there's no active trip.
 */
export function watchActiveTrip(cb: (trip: Trip | null) => void): () => void {
  const q = query(tripsCol(), orderBy('startTime', 'desc'), fsLimit(1));
  return onSnapshot(q, (snap) => {
    if (snap.empty) {
      cb(null);
      return;
    }
    const t = snap.docs[0].data() as Trip;
    cb(t.endTime ? null : t);
  });
}

export function watchRecentTrips(
  cb: (trips: Trip[]) => void,
  max = 20
): () => void {
  const q = query(tripsCol(), orderBy('startTime', 'desc'), fsLimit(max));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => d.data() as Trip));
  });
}

export async function deleteTrip(tripId: string): Promise<void> {
  // Unset tripId on any logs that carried it, then delete the trip.
  // Soft-unlink rather than cascade-delete; the logs are still useful.
  const logSnap = await getDocs(
    query(
      collection(db(), 'users', uid(), 'logs'),
      where('tripId', '==', tripId)
    )
  );
  if (!logSnap.empty) {
    const batch = writeBatch(db());
    logSnap.docs.forEach((d) => {
      batch.update(d.ref, { tripId: null });
    });
    await batch.commit();
  }
  await deleteDoc(doc(tripsCol(), tripId));
}

function stripUndefined<T extends Record<string, unknown>>(value: T): T {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value)) {
    if (v !== undefined && v !== null) out[k] = v;
  }
  return out as T;
}
