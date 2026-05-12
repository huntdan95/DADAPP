/**
 * Per-user fly-box augmentation layer. The base fly database
 * (data/hatches.json — 99 entries, ~700 named flies) is built-in and
 * shared. This module handles the two pieces of USER-OWNED data:
 *
 *   1. Per-fly photos + notes — "here's the version I tied; my own
 *      tying tips for this pattern." Keyed by entry id + an
 *      arbitrary slot index so users can stash multiple variations.
 *      Path: users/{uid}/flyNotes/{entryId}
 *           users/{uid}/flyPhotos/{flyId-slug}/{timestamp}.jpg
 *
 *   2. Custom flies — entries the user added that aren't in the
 *      built-in database. Same shape as a Hatch entry but with a
 *      `custom: true` flag + optional youtubeUrl + photoUrl[].
 *      Path: users/{uid}/customFlies/{id}
 */

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { getFirebaseApp, getFirebaseAuth } from '@/lib/firebase';

/** Per-fly user augmentation — notes + photo URLs the user tied. */
export interface FlyNotes {
  /** Built-in entry id (e.g. 'mi-articulated-streamers') OR custom fly id. */
  flyEntryId: string;
  /** Free-form notes — tying recipe variations, where it worked, etc. */
  notes?: string;
  /** Firebase Storage download URLs of user-uploaded photos. */
  photoUrls?: string[];
  updatedAt?: Timestamp;
}

/** User-defined fly that isn't in hatches.json. */
export interface CustomFly {
  id: string;
  name: string;
  /** Category key matching one of the FlyBox.tsx CATEGORIES entries. */
  category: string;
  description?: string;
  /** A YouTube tying-video URL — surfaced as a link button. */
  youtubeUrl?: string;
  /** Optional Storage URL of a representative photo. */
  photoUrl?: string;
  /** Free-form notes the user keeps. */
  notes?: string;
  createdAt?: Timestamp;
}

function db() {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not configured');
  return getFirestore(app);
}
function uid(): string | null {
  return getFirebaseAuth()?.currentUser?.uid ?? null;
}

// ---- flyNotes -------------------------------------------------------------

export async function getFlyNotes(flyEntryId: string): Promise<FlyNotes | null> {
  const u = uid();
  if (!u) return null;
  const snap = await getDoc(doc(db(), 'users', u, 'flyNotes', flyEntryId));
  return snap.exists() ? (snap.data() as FlyNotes) : null;
}

export async function saveFlyNotes(
  flyEntryId: string,
  notes: string,
  photoUrls: string[]
): Promise<void> {
  const u = uid();
  if (!u) throw new Error('Must be signed in');
  // Strip undefined values — Firestore rejects them by default. Build
  // the payload as Record<string, unknown> so the serverTimestamp()
  // sentinel doesn't fight the FlyNotes-typed `updatedAt` field.
  const clean: Record<string, unknown> = {
    flyEntryId,
    updatedAt: serverTimestamp(),
  };
  if (notes) clean.notes = notes;
  if (photoUrls.length > 0) clean.photoUrls = photoUrls;
  await setDoc(doc(db(), 'users', u, 'flyNotes', flyEntryId), clean, {
    merge: true,
  });
}

/**
 * Live subscription to ALL of the user's fly notes — used by the
 * FlyBox listing so each row can show a badge for "you've added a
 * note / photo here." Single Firestore listener instead of N reads.
 */
export function watchAllFlyNotes(
  cb: (byId: Map<string, FlyNotes>) => void
): () => void {
  const u = uid();
  if (!u) {
    cb(new Map());
    return () => {};
  }
  return onSnapshot(collection(db(), 'users', u, 'flyNotes'), (snap) => {
    const map = new Map<string, FlyNotes>();
    for (const d of snap.docs) {
      map.set(d.id, d.data() as FlyNotes);
    }
    cb(map);
  });
}

// ---- custom flies ---------------------------------------------------------

export async function listCustomFlies(): Promise<CustomFly[]> {
  const u = uid();
  if (!u) return [];
  const snap = await getDocs(collection(db(), 'users', u, 'customFlies'));
  return snap.docs.map((d) => d.data() as CustomFly);
}

export function watchCustomFlies(
  cb: (flies: CustomFly[]) => void
): () => void {
  const u = uid();
  if (!u) {
    cb([]);
    return () => {};
  }
  return onSnapshot(collection(db(), 'users', u, 'customFlies'), (snap) => {
    cb(snap.docs.map((d) => d.data() as CustomFly));
  });
}

export async function saveCustomFly(fly: CustomFly): Promise<void> {
  const u = uid();
  if (!u) throw new Error('Must be signed in');
  const clean: Record<string, unknown> = { ...fly };
  for (const k of Object.keys(clean)) if (clean[k] === undefined) delete clean[k];
  if (!clean.createdAt) clean.createdAt = serverTimestamp();
  await setDoc(doc(db(), 'users', u, 'customFlies', fly.id), clean, {
    merge: true,
  });
}

export async function deleteCustomFly(id: string): Promise<void> {
  const u = uid();
  if (!u) throw new Error('Must be signed in');
  await deleteDoc(doc(db(), 'users', u, 'customFlies', id));
}

// ---- photo upload (Firebase Storage) -------------------------------------

/**
 * Resizes a photo client-side (browser-image-compression) then uploads
 * to Storage. Returns the download URL. Same compression settings as
 * log photos so file sizes stay predictable.
 */
export async function uploadFlyPhoto(
  flyEntryId: string,
  file: File
): Promise<string> {
  const u = uid();
  if (!u) throw new Error('Must be signed in');
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not configured');

  // Lazy-load the compressor so the FlyBox bundle stays small.
  const imageCompression = (await import('browser-image-compression'))
    .default;
  const compressed = await imageCompression(file, {
    maxWidthOrHeight: 1280,
    maxSizeMB: 0.6,
    initialQuality: 0.9,
    fileType: 'image/jpeg',
    useWebWorker: true,
  });

  const ts = Date.now();
  const slug = flyEntryId.replace(/[^a-z0-9-]/gi, '_');
  const path = `users/${u}/flyPhotos/${slug}/${ts}.jpg`;
  const storageRef = ref(getStorage(app), path);
  await uploadBytes(storageRef, compressed, { contentType: 'image/jpeg' });
  return await getDownloadURL(storageRef);
}

export function newCustomFlyId(): string {
  return `custom-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}
