import { getFirebaseApp, getFirebaseAuth } from '../firebase';
import { localStorageLocationStore } from './localStorage';
import { makeFirestoreLocationStore } from './firestore';
import type { LocationStore } from './types';

let cached: LocationStore | null = null;
/**
 * UID the cached Firestore store was built for. When the signed-in
 * user changes (sign-out + sign-in as someone else on the same
 * device), we throw away the cached instance so we don't reuse a
 * subscription bound to the previous user's subcollection.
 */
let cachedUid: string | null = null;

/**
 * Auto-pick: Firestore when Firebase is configured, localStorage otherwise.
 * This lets the app boot and run in dev without any Firebase project, and
 * the moment .env.local is filled in, it transparently switches.
 *
 * The Firestore store reads `users/{uid}/locations`, so each Google
 * account has its own spots. If the active uid changes, we build a
 * fresh store instance — re-subscribing under the new identity.
 */
export function getLocationStore(): LocationStore {
  const app = getFirebaseApp();
  if (!app) {
    cached = localStorageLocationStore;
    cachedUid = null;
    return cached;
  }
  const currentUid = getFirebaseAuth()?.currentUser?.uid ?? null;
  if (cached && cachedUid === currentUid) {
    return cached;
  }
  cached = makeFirestoreLocationStore();
  cachedUid = currentUid;
  return cached;
}

export type { LocationStore } from './types';
