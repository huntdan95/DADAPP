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
import { getFirebaseApp } from '../firebase';

/**
 * Firestore-backed LocationStore. Activates automatically when Firebase env
 * vars are present (see store/index.ts). Each mutation writes a single doc
 * keyed by `id`; subscribe uses onSnapshot so the map and list update
 * without a refetch.
 */
export function makeFirestoreLocationStore(): LocationStore {
  const app = getFirebaseApp();
  if (!app) {
    throw new Error(
      'Firestore store requested but Firebase is not configured (check .env.local)'
    );
  }
  const db = getFirestore(app);
  const col = () => collection(db, 'locations');

  return {
    async list() {
      const snap = await getDocs(col());
      return snap.docs.map((d) => d.data() as Location);
    },
    async get(id) {
      const snap = await getDoc(doc(col(), id));
      return snap.exists() ? (snap.data() as Location) : null;
    },
    async upsert(loc) {
      await setDoc(doc(col(), loc.id), loc);
    },
    async remove(id) {
      await deleteDoc(doc(col(), id));
    },
    subscribe(cb) {
      return onSnapshot(col(), (snap) => {
        cb(snap.docs.map((d) => d.data() as Location));
      });
    },
  };
}
