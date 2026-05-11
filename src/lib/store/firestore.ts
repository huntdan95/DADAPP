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
import { inferStateFromLatLng } from '../geo/inferState';

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
      return snap.docs.map((d) => normalizeOnRead(d.data() as Location));
    },
    async get(id) {
      const snap = await getDoc(doc(userCol(), id));
      return snap.exists() ? normalizeOnRead(snap.data() as Location) : null;
    },
    async upsert(loc) {
      // State auto-fill: if the spot was saved with no state (Nominatim
      // was slow / offline at add-time, the user dismissed the form
      // before auto-detect finished, etc.) infer one from lat/lng. The
      // inference checks the waterbody registry first, then falls back
      // to state bounding boxes — accurate enough that no US pin
      // should land in the picker's "—" group anymore.
      let normalized = loc;
      if (!loc.state || loc.state.trim() === '') {
        const inferred = inferStateFromLatLng(loc.lat, loc.lng);
        if (inferred) {
          normalized = { ...loc, state: inferred };
        }
      } else if (loc.state.length > 2) {
        // Defensively normalize a long-form state name ("Utah") to USPS
        // ("UT") — happens when Nominatim returned a name our map
        // didn't have, or when the value came from a non-standard
        // source.
        const inferred = inferStateFromLatLng(loc.lat, loc.lng);
        if (inferred) {
          normalized = { ...loc, state: inferred };
        }
      }
      // Defensive strip of undefined values before the setDoc.
      // We ALSO pass `ignoreUndefinedProperties: true` to
      // initializeFirestore, but that flag only protects clients
      // running the latest bundle — older cached PWA bundles still
      // throw "Unsupported field value: undefined" without this
      // explicit strip. Belt + suspenders.
      await setDoc(
        doc(userCol(), normalized.id),
        stripUndefinedDeep(normalized) as Location
      );
    },
    async remove(id) {
      await deleteDoc(doc(userCol(), id));
    },
    subscribe(cb) {
      return onSnapshot(userCol(), (snap) => {
        cb(snap.docs.map((d) => normalizeOnRead(d.data() as Location)));
      });
    },
  };
}

/**
 * Read-time normalization. Catches legacy docs that were saved before
 * the state-inference helper existed (state field empty / mis-cased).
 * Pure function — doesn't mutate Firestore; just gives the UI a clean
 * Location object to display. Next time the user edits the spot, the
 * upsert path persists the fix.
 */
function normalizeOnRead(loc: Location): Location {
  if (!loc) return loc;
  const trimmed = loc.state?.trim() ?? '';
  if (!trimmed || trimmed.length > 2) {
    const inferred = inferStateFromLatLng(loc.lat, loc.lng);
    if (inferred && inferred !== trimmed) {
      return { ...loc, state: inferred };
    }
  }
  return loc;
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
