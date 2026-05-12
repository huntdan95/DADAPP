import { getFunctions, httpsCallable } from 'firebase/functions';
import { getFirebaseApp } from '@/lib/firebase';

/**
 * Triggers the bundled-seed Cloud Function. Pushes the 8K+ stocking
 * records bundled in `functions/seed-data/` to Firestore via admin
 * SDK. One-click — no local firebase-tools auth needed.
 *
 * Returns a per-state summary so the UI can show what got written.
 * Idempotent — re-running just no-ops on already-existing ids.
 */
export interface SeedFromBundleResult {
  total: number;
  written: number;
  skipped: number;
  failed: number;
  perState: Record<string, number>;
}

export async function seedStockingFromBundle(): Promise<SeedFromBundleResult> {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not configured');
  const functions = getFunctions(app, 'us-central1');
  // 9-minute timeout matches the function's max — 8K writes against
  // Firestore typically take 60-90s but a slow region could stretch.
  const fn = httpsCallable<unknown, SeedFromBundleResult>(
    functions,
    'seedStockingFromBundle',
    { timeout: 540_000 }
  );
  const res = await fn({});
  return res.data;
}
