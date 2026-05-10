import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  limit as fsLimit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import { getAuth } from 'firebase/auth';
import { getFirebaseApp } from '@/lib/firebase';
import type { LogEntry } from './types';

/**
 * Firestore store for flat log entries: users/{uid}/logs/{logId}.
 *
 * Photos live alongside in Storage at users/{uid}/logs/{logId}.jpg —
 * compressed client-side before upload (max 2048px, ~85% JPEG) to keep
 * the Storage bill bounded.
 */

function uid(): string {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not configured');
  const u = getAuth(app).currentUser;
  if (!u) throw new Error('Not signed in');
  return u.uid;
}

function db() {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not configured');
  return getFirestore(app);
}

function storage() {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not configured');
  return getStorage(app);
}

const logsCol = () => collection(db(), 'users', uid(), 'logs');

export async function saveLogEntry(entry: LogEntry): Promise<void> {
  // Stamp userId so collectionGroup queries (patterns.ts) can scope.
  await setDoc(doc(logsCol(), entry.id), { ...entry, userId: uid() });
}

export async function deleteLogEntry(entry: LogEntry): Promise<void> {
  await deleteDoc(doc(logsCol(), entry.id));
  if (entry.photoPath) {
    await deleteObject(ref(storage(), entry.photoPath)).catch(() => undefined);
  }
}

export async function getLogEntry(id: string): Promise<LogEntry | null> {
  const snap = await getDoc(doc(logsCol(), id));
  return snap.exists() ? (snap.data() as LogEntry) : null;
}

export function watchLogEntries(
  cb: (entries: LogEntry[]) => void,
  max = 200
): () => void {
  const q = query(logsCol(), orderBy('time', 'desc'), fsLimit(max));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => d.data() as LogEntry));
  });
}

export async function uploadLogPhoto(
  logId: string,
  file: File
): Promise<{ url: string; path: string }> {
  const compressed = await imageCompression(file, {
    maxWidthOrHeight: 2048,
    maxSizeMB: 1,
    initialQuality: 0.85,
    fileType: 'image/jpeg',
    useWebWorker: true,
  });
  const path = `users/${uid()}/logs/${logId}.jpg`;
  const r = ref(storage(), path);
  await uploadBytes(r, compressed, { contentType: 'image/jpeg' });
  const url = await getDownloadURL(r);
  return { url, path };
}

/** Compresses the photo to a small inline data-URL for offline list previews. */
export async function makeThumbnailDataUrl(file: File): Promise<string> {
  const tiny = await imageCompression(file, {
    maxWidthOrHeight: 320,
    maxSizeMB: 0.05,
    initialQuality: 0.7,
    fileType: 'image/jpeg',
    useWebWorker: true,
  });
  return imageCompression.getDataUrlFromFile(tiny);
}
