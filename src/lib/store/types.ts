import type { Location } from '../providers/types';

/**
 * Persistence contract for `Location` records. Two implementations live
 * alongside this file:
 *   - localStorage.ts → works immediately with no setup, used until Firebase is wired
 *   - firestore.ts    → activated when VITE_FIREBASE_PROJECT_ID is present
 *
 * Each store fires `subscribe` callbacks on every mutation so list and map
 * views stay in sync without a refetch.
 */
export interface LocationStore {
  list(): Promise<Location[]>;
  get(id: string): Promise<Location | null>;
  upsert(loc: Location): Promise<void>;
  remove(id: string): Promise<void>;
  subscribe(cb: (locs: Location[]) => void): () => void;
}
