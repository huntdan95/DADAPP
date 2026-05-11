import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import type { Location } from '../providers/types';
import type { LocationStore } from './types';
import { getFirebaseApp, getFirebaseAuth } from '../firebase';

/**
 * Firestore-backed LocationStore.
 *
 * Path: `users/{uid}/locations/{locationId}`. Each Google account
 * owns its own spots — multiple users on the same Firestore database
 * never see each other's data. Rules at `users/{uid}/{document=**}`
 * enforce read/write only when `request.auth.uid == uid`.
 *
 * Legacy `locations/{id}` (pre-Apr 2026) is kept readable for the
 * one-shot migration in `legacyMigration.ts`; new writes go here.
 */
export function makeFirestoreLocationStore(): LocationStore {
  const app = getFirebaseApp();
  if (!app) {
    throw new Error(
      'Firestore store requested but Firebase is not configured (check .env.local)'
    );
  }
  const db = getFirestore(app);

  /**
   * Resolve the per-user collection. Throws if the caller invokes
   * the store while signed out — callers gate on `auth.kind` so this
   * should not be reachable in practice, but the explicit error is
   * better than a confusing `users//locations` path.
   */
  function userCol() {
    const uid = getFirebaseAuth()?.currentUser?.uid;
    if (!uid) {
      throw new Error('Locations require a signed-in user');
    }
    return collection(db, 'users', uid, 'locations');
  }

  return {
    async list() {
      const snap = await getDocs(userCol());
      return snap.docs.map((d) => d.data() as Location);
    },
    async get(id) {
      const snap = await getDoc(doc(userCol(), id));
      return snap.exists() ? (snap.data() as Location) : null;
    },
    async upsert(loc) {
      // Defensive strip of undefined values before the setDoc.
      // We ALSO pass `ignoreUndefinedProperties: true` to
      // initializeFirestore, but that flag only protects clients
      // running the latest bundle — older cached PWA bundles still
      // throw "Unsupported field value: undefined" without this
      // explicit strip. Belt + suspenders.
      await setDoc(doc(userCol(), loc.id), stripUndefinedDeep(loc) as Location);
    },
    async remove(id) {
      await deleteDoc(doc(userCol(), id));
    },
    subscribe(cb) {
      return onSnapshot(userCol(), (snap) => {
        cb(snap.docs.map((d) => d.data() as Location));
      });
    },
  };
}

/**
 * Recursively drops keys whose value is `undefined`. Preserves
 * `null`, empty string, 0, false, etc. Walks nested objects but
 * not arrays (Firestore handles array contents fine).
 */
function stripUndefinedDeep<T>(value: T): T {
  if (value == null || typeof value !== 'object' || Array.isArray(value)) {
    return value;
  }
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (v === undefined) continue;
    out[k] = stripUndefinedDeep(v);
  }
  return out as T;
}
