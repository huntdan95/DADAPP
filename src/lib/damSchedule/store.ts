import {
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { getFirebaseApp } from '@/lib/firebase';
import type { DamScheduleProvider } from '@/lib/providers/types';

/**
 * Storage shape for a daily generation schedule. One doc per
 * (dam, date), keyed `{authority}__{dam-slug}__{YYYY-MM-DD}`.
 *
 * `hourlyUnits[h]` is the number of generators running at hour `h`
 * (0 = off, 1 = partial, 2+ = heavy). null = unknown / not yet entered.
 */
export interface DamScheduleDoc {
  damName: string;
  authority: 'tva' | 'usace' | 'consumers-energy' | 'manual';
  date: string;             // YYYY-MM-DD
  hourlyUnits: Array<number | null>;
  source: 'manual' | 'scraped' | 'unknown';
  updatedAt: Timestamp | null;
  updatedByEmail?: string;
}

export function damScheduleKey(provider: DamScheduleProvider, date: string): string {
  const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  switch (provider.kind) {
    case 'tva':
      return `tva__${slug(provider.dam)}__${date}`;
    case 'usace':
      return `usace__${slug(provider.district + '-' + provider.project)}__${date}`;
    case 'consumers-energy':
      return `ce__${slug(provider.dam)}__${date}`;
    case 'manual':
      return `manual__no-dam__${date}`;
  }
}

export function todayLocalDate(timezone: string): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: timezone }).format(
    new Date()
  );
}

function db() {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not configured');
  return getFirestore(app);
}

const colPath = 'damSchedules';

export async function readDamSchedule(
  key: string
): Promise<DamScheduleDoc | null> {
  const snap = await getDoc(doc(db(), colPath, key));
  return snap.exists() ? (snap.data() as DamScheduleDoc) : null;
}

export function watchDamSchedule(
  key: string,
  cb: (s: DamScheduleDoc | null) => void
): () => void {
  return onSnapshot(doc(db(), colPath, key), (snap) => {
    cb(snap.exists() ? (snap.data() as DamScheduleDoc) : null);
  });
}

export async function writeDamSchedule(
  key: string,
  doc_: Omit<DamScheduleDoc, 'updatedAt'>,
  updatedByEmail?: string
): Promise<void> {
  await setDoc(doc(db(), colPath, key), {
    ...doc_,
    updatedAt: Timestamp.now(),
    ...(updatedByEmail ? { updatedByEmail } : {}),
  });
}

export function emptyHourly(): Array<number | null> {
  return Array.from({ length: 24 }, () => null);
}
