import {
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  limit as fsLimit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import { getAuth } from 'firebase/auth';
import { getFirebaseApp } from '@/lib/firebase';
import type { Catch, Trip } from './types';

/**
 * Journal store. Trips are scoped per user under
 * `users/{uid}/trips/{tripId}/catches/{catchId}` — your logbook is yours,
 * not your friends'. (Locations and damSchedules remain shared
 * collections — those are collaborative.)
 *
 * Firestore-only because photos require Storage. The conditions
 * dashboard still works without Firebase; only journaling is gated.
 */

function db() {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase is not configured');
  return getFirestore(app);
}

function storage() {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase is not configured');
  return getStorage(app);
}

function uid(): string {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase is not configured');
  const u = getAuth(app).currentUser;
  if (!u) throw new Error('Not signed in');
  return u.uid;
}

const tripsCol = () => collection(db(), 'users', uid(), 'trips');
const catchesCol = (tripId: string) =>
  collection(db(), 'users', uid(), 'trips', tripId, 'catches');

export async function upsertTrip(trip: Trip): Promise<void> {
  await setDoc(doc(tripsCol(), trip.id), trip);
}

export async function deleteTrip(tripId: string): Promise<void> {
  // Delete subcollection documents first (Firestore doesn't cascade).
  const catchSnap = await getDocs(catchesCol(tripId));
  await Promise.all(
    catchSnap.docs.map(async (d) => {
      const c = d.data() as Catch;
      if (c.photoUrl) {
        await deletePhoto(c.photoUrl).catch(() => undefined);
      }
      await deleteDoc(d.ref);
    })
  );
  await deleteDoc(doc(tripsCol(), tripId));
}

export function listTrips(cb: (trips: Trip[]) => void): () => void {
  const q = query(tripsCol(), orderBy('startTime', 'desc'), fsLimit(50));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => d.data() as Trip));
  });
}

export function watchActiveTrip(cb: (trip: Trip | null) => void): () => void {
  const q = query(tripsCol(), where('endTime', '==', null));
  return onSnapshot(q, (snap) => {
    if (snap.empty) {
      cb(null);
      return;
    }
    // If multiple somehow exist, take the most recently started.
    const trips = snap.docs
      .map((d) => d.data() as Trip)
      .sort((a, b) => (a.startTime < b.startTime ? 1 : -1));
    cb(trips[0] ?? null);
  });
}

export function watchTripCatches(
  tripId: string,
  cb: (catches: Catch[]) => void
): () => void {
  const q = query(catchesCol(tripId), orderBy('time', 'asc'));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => d.data() as Catch));
  });
}

export async function listAllCatches(): Promise<Catch[]> {
  // collectionGroup picks up catches under any user — but our security rules
  // gate collectionGroup queries to require where('userId', '==', auth.uid),
  // so this returns only the current user's catches as long as the
  // userId field is included. (Catches are written with a userId stamp.)
  const q = query(
    collectionGroup(db(), 'catches'),
    where('userId', '==', uid()),
    orderBy('time', 'desc'),
    fsLimit(500)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Catch);
}

export async function upsertCatch(c: Catch): Promise<void> {
  // Stamp userId on the doc so collectionGroup queries can filter to
  // the owner without leaking other users' catches.
  await setDoc(doc(catchesCol(c.tripId), c.id), { ...c, userId: uid() });
}

export async function deleteCatch(tripId: string, catchId: string): Promise<void> {
  await deleteDoc(doc(catchesCol(tripId), catchId));
}

/**
 * Compress and upload a catch photo. Returns the public download URL.
 * Photos can balloon Storage costs, so we cap at 2048px and ~85% JPEG.
 */
export async function uploadCatchPhoto(
  tripId: string,
  catchId: string,
  file: File
): Promise<string> {
  const compressed = await imageCompression(file, {
    maxWidthOrHeight: 2048,
    maxSizeMB: 1,
    initialQuality: 0.85,
    fileType: 'image/jpeg',
    useWebWorker: true,
  });
  const path = `users/${uid()}/trips/${tripId}/catches/${catchId}.jpg`;
  const r = ref(storage(), path);
  await uploadBytes(r, compressed, { contentType: 'image/jpeg' });
  return getDownloadURL(r);
}

async function deletePhoto(url: string) {
  // url is a getDownloadURL result; convert to a storage reference.
  const r = ref(storage(), url);
  await deleteObject(r);
}
