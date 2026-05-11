import { createStore, del, keys, get, set } from 'idb-keyval';
import {
  doc,
  getFirestore,
  updateDoc,
} from 'firebase/firestore';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import imageCompression from 'browser-image-compression';
import { getFirebaseApp } from '@/lib/firebase';

/**
 * Photo-upload queue for offline-first logging.
 *
 * When the user logs a catch with a photo while offline, Firebase
 * Storage uploads fail (no network → no upload). We stash the photo
 * blob in IndexedDB under a dedicated store and patch the log entry
 * with `photoQueued: true`. When connectivity returns (or on next
 * app load), a background worker drains the queue: uploads each
 * blob to Storage, gets the download URL, and patches the matching
 * log entry with the real `photoUrl` + `photoPath`.
 *
 * The queue is keyed by logId so a re-save with the same photo
 * doesn't double-enqueue. Failures retry on the next drain.
 */

const QUEUE_STORE = createStore('fishing-dad-photo-queue', 'photos');

interface QueuedPhoto {
  /** The log entry id this photo is for. */
  logId: string;
  /** The uid that enqueued it (so we don't cross-replay between accounts). */
  uid: string;
  /** Compressed image blob ready to upload. */
  blob: Blob;
  /** When the user logged it — used for retry backoff. */
  queuedAt: number;
  /** Bumped on each failed retry. */
  attempts: number;
}

/**
 * Enqueue a photo for later upload. Compresses first (same parameters
 * as the online uploadLogPhoto) so we don't store the raw camera
 * megapixel monster in IndexedDB.
 */
export async function enqueuePhoto(logId: string, file: File): Promise<void> {
  const uid = currentUid();
  if (!uid) throw new Error('Not signed in');

  const compressed = await imageCompression(file, {
    maxWidthOrHeight: 2048,
    maxSizeMB: 1,
    initialQuality: 0.85,
    fileType: 'image/jpeg',
    useWebWorker: true,
  });

  const entry: QueuedPhoto = {
    logId,
    uid,
    blob: compressed,
    queuedAt: Date.now(),
    attempts: 0,
  };
  await set(logId, entry, QUEUE_STORE);
}

/**
 * Process every queued photo. For each:
 *   1. Upload to Firebase Storage at users/{uid}/logs/{logId}.jpg
 *   2. Patch the corresponding Firestore log entry with photoUrl + photoPath
 *      and clear photoQueued
 *   3. Remove from the queue
 *
 * On failure, increments attempts and leaves the entry in place. The
 * next drain (or app reload) will retry.
 *
 * Returns a summary so callers can log it.
 */
export async function drainPhotoQueue(): Promise<{
  processed: number;
  failed: number;
  remaining: number;
}> {
  const uid = currentUid();
  if (!uid) return { processed: 0, failed: 0, remaining: 0 };

  const allKeys = await keys(QUEUE_STORE);
  let processed = 0;
  let failed = 0;

  for (const k of allKeys) {
    if (typeof k !== 'string') continue;
    const entry = (await get(k, QUEUE_STORE)) as QueuedPhoto | undefined;
    if (!entry) continue;
    if (entry.uid !== uid) continue;     // belongs to another account

    try {
      const path = `users/${uid}/logs/${entry.logId}.jpg`;
      const storage = getStorage(firebaseApp());
      const r = ref(storage, path);
      await uploadBytes(r, entry.blob, { contentType: 'image/jpeg' });
      const url = await getDownloadURL(r);

      const db = getFirestore(firebaseApp());
      await updateDoc(doc(db, 'users', uid, 'logs', entry.logId), {
        photoUrl: url,
        photoPath: path,
        photoQueued: false,
      });

      await del(k, QUEUE_STORE);
      processed++;
    } catch (e) {
      console.warn('photoQueue drain failed for', k, e);
      const updated: QueuedPhoto = {
        ...entry,
        attempts: entry.attempts + 1,
      };
      await set(k, updated, QUEUE_STORE);
      failed++;
    }
  }

  const remaining = (await keys(QUEUE_STORE)).length;
  return { processed, failed, remaining };
}

/** Number of photos waiting to upload — drives the header badge. */
export async function pendingPhotoCount(): Promise<number> {
  const uid = currentUid();
  if (!uid) return 0;
  const all = await keys(QUEUE_STORE);
  // Filter by uid in case we share device with another account.
  let n = 0;
  for (const k of all) {
    if (typeof k !== 'string') continue;
    const entry = (await get(k, QUEUE_STORE)) as QueuedPhoto | undefined;
    if (entry?.uid === uid) n++;
  }
  return n;
}

function firebaseApp() {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not configured');
  return app;
}

function currentUid(): string | null {
  const app = getFirebaseApp();
  if (!app) return null;
  return getAuth(app).currentUser?.uid ?? null;
}
