import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';

/**
 * Firebase client init. Phase 1 doesn't actually use Firebase — the dashboard
 * works without these env vars. Phase 2 wires up Firestore for locations
 * and trips. We initialize lazily so missing env vars don't crash dev.
 */
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let cached: FirebaseApp | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (!config.apiKey || !config.projectId) return null;
  if (cached) return cached;
  if (getApps().length > 0) {
    cached = getApps()[0];
    return cached;
  }
  cached = initializeApp(config);
  return cached;
}
