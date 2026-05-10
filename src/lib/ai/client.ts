import { getFunctions, httpsCallable, type Functions } from 'firebase/functions';
import { getFirebaseApp } from '@/lib/firebase';

let cached: Functions | null = null;

export function fns(): Functions {
  if (cached) return cached;
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not configured');
  cached = getFunctions(app, 'us-central1');
  return cached;
}

/** Typed wrapper around httpsCallable. */
export function callable<Req, Res>(name: string) {
  return async (req: Req): Promise<Res> => {
    const fn = httpsCallable<Req, Res>(fns(), name);
    const result = await fn(req);
    return result.data;
  };
}
