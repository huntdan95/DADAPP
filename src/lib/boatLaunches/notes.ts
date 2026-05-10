import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { getFirebaseApp, getFirebaseAuth } from '@/lib/firebase';

/**
 * Per-user notes attached to specific boat launches. The launches
 * themselves come from OpenStreetMap and are shared; notes are private.
 *
 * Path: users/{uid}/boatLaunchNotes/{launchId}
 *   - launchId is the BoatLaunch.id (e.g. "osm-node-12345")
 *   - shape: { note: string, updatedAt: Timestamp }
 */

interface LaunchNoteDoc {
  note: string;
  updatedAt: Timestamp;
}

function db() {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not configured');
  return getFirestore(app);
}

function uid(): string | null {
  const app = getFirebaseApp();
  if (!app) return null;
  const auth = getFirebaseAuth();
  return auth?.currentUser?.uid ?? null;
}

export async function readLaunchNote(launchId: string): Promise<string> {
  const u = uid();
  if (!u) return '';
  const snap = await getDoc(doc(db(), 'users', u, 'boatLaunchNotes', launchId));
  if (!snap.exists()) return '';
  return (snap.data() as LaunchNoteDoc).note ?? '';
}

export async function writeLaunchNote(launchId: string, note: string): Promise<void> {
  const u = uid();
  if (!u) throw new Error('Not signed in');
  await setDoc(doc(db(), 'users', u, 'boatLaunchNotes', launchId), {
    note,
    updatedAt: Timestamp.now(),
  });
}
