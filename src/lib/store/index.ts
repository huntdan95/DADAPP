import { getFirebaseApp } from '../firebase';
import { localStorageLocationStore } from './localStorage';
import { makeFirestoreLocationStore } from './firestore';
import type { LocationStore } from './types';

let cached: LocationStore | null = null;

/**
 * Auto-pick: Firestore when Firebase is configured, localStorage otherwise.
 * This lets the app boot and run in dev without any Firebase project, and
 * the moment .env.local is filled in, it transparently switches.
 */
export function getLocationStore(): LocationStore {
  if (cached) return cached;
  cached = getFirebaseApp() != null
    ? makeFirestoreLocationStore()
    : localStorageLocationStore;
  return cached;
}

export type { LocationStore } from './types';
