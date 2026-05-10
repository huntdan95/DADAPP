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
import { getFirebaseApp } from '@/lib/firebase';
import type { Catch, Trip } from './types';

/**
 * Journal store. Firestore-only — photos require Firebase Storage, so
 * there's no point in a localStorage fallback for trips. The conditions
 * dashboard still works without Firebase; this just disables logging.
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

const tripsCol = () => collection(db(), 'trips');
const catchesCol = (tripId: string) =>
  collection(db(), 'trips', tripId, 'catches');

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
  const q = query(
    collectionGroup(db(), 'catches'),
    orderBy('time', 'desc'),
    fsLimit(500)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Catch);
}

export async function upsertCatch(c: Catch): Promise<void> {
  await setDoc(doc(catchesCol(c.tripId), c.id), c);
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
  const path = `trips/${tripId}/catches/${catchId}.jpg`;
  const r = ref(storage(), path);
  await uploadBytes(r, compressed, { contentType: 'image/jpeg' });
  return getDownloadURL(r);
}

async function deletePhoto(url: string) {
  // url is a getDownloadURL result; convert to a storage reference.
  const r = ref(storage(), url);
  await deleteObject(r);
}
