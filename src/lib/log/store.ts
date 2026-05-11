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

/**
 * Recursively strip undefined values. Firestore rejects undefined and the
 * QuickLog draft is full of optional fields — without this, saving a
 * photo-less or no-spot entry blows up with
 * "Function setDoc() called with invalid data. Unsupported field value:
 * undefined (found in field locationId in document ...)".
 */
function stripUndefined<T>(value: T): T {
  if (value === undefined) return undefined as unknown as T;
  if (value === null) return value;
  if (Array.isArray(value)) {
    return value
      .map((v) => stripUndefined(v))
      .filter((v) => v !== undefined) as unknown as T;
  }
  if (typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v === undefined) continue;
      const cleaned = stripUndefined(v);
      if (cleaned !== undefined) out[k] = cleaned;
    }
    return out as unknown as T;
  }
  return value;
}

export async function saveLogEntry(entry: LogEntry): Promise<void> {
  // Stamp userId so collectionGroup queries (patterns.ts) can scope.
  const cleaned = stripUndefined({ ...entry, userId: uid() });
  await setDoc(doc(logsCol(), entry.id), cleaned as Record<string, unknown>);
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

/**
 * Most-recent catch at a location, used to pre-fill QuickLog with the
 * angler's last-known defaults (species, method, fly/lure, trolling
 * specifics). If `locationId` is omitted or no catches exist at the
 * spot, falls back to the most recent catch globally — the assumption
 * being "if I'm logging a catch, I probably want the gear I just used."
 *
 * One-shot read (not subscribed) — QuickLog opens, reads, applies.
 */
import { query as fsQuery, where, getDocs } from 'firebase/firestore';

export async function fetchLastCatch(
  locationId?: string
): Promise<LogEntry | null> {
  // Per-spot first; fall back to global.
  const candidates: Array<() => Promise<LogEntry | null>> = [];
  if (locationId) {
    candidates.push(() =>
      readFirst(
        fsQuery(
          logsCol(),
          where('kind', '==', 'catch'),
          where('locationId', '==', locationId),
          orderBy('time', 'desc'),
          fsLimit(1)
        )
      )
    );
  }
  candidates.push(() =>
    readFirst(
      fsQuery(
        logsCol(),
        where('kind', '==', 'catch'),
        orderBy('time', 'desc'),
        fsLimit(1)
      )
    )
  );

  for (const run of candidates) {
    const hit = await run().catch(() => null);
    if (hit) return hit;
  }
  return null;
}

async function readFirst(q: ReturnType<typeof fsQuery>): Promise<LogEntry | null> {
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data() as LogEntry;
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
