import {
  collection,
  doc,
  getDocs,
  getFirestore,
  setDoc,
} from 'firebase/firestore';
import { getFirebaseApp, getFirebaseAuth } from '../firebase';
import type { Location } from '../providers/types';

/**
 * One-shot migration of pre-per-user `locations/*` docs into the
 * currently-signed-in user's `users/{uid}/locations/*` subcollection.
 *
 * Why this exists: the app used to keep one shared `locations`
 * collection (single-user assumption). After splitting to per-user
 * subcollections (May 2026), the prior owner's spots are unreachable
 * unless we copy them. Copy semantics, not move — multiple users on
 * the same device or in the same group each end up with the same
 * starter set, which they can prune.
 *
 * Behavior:
 *   - No-op if the user already has any docs in their subcollection
 *     (they've already migrated, or they've added spots fresh).
 *   - No-op if the legacy collection is empty.
 *   - Uses a per-uid localStorage flag to skip the read entirely on
 *     subsequent loads — cheaper than a Firestore round-trip when we
 *     know the user has already passed through.
 *   - Errors are swallowed and logged; the app continues with seed
 *     fallback.
 */
const FLAG_PREFIX = 'dad-fishing.legacyMigrated.';

export interface LegacyMigrationResult {
  status: 'skipped' | 'migrated' | 'empty' | 'failed';
  copied: number;
}

export async function migrateLegacyLocationsIfNeeded(): Promise<LegacyMigrationResult> {
  const app = getFirebaseApp();
  if (!app) return { status: 'skipped', copied: 0 };
  const uid = getFirebaseAuth()?.currentUser?.uid;
  if (!uid) return { status: 'skipped', copied: 0 };

  const flagKey = FLAG_PREFIX + uid;
  try {
    if (localStorage.getItem(flagKey)) {
      return { status: 'skipped', copied: 0 };
    }
  } catch {
    // ignore — flag is best-effort dedup, not correctness
  }

  const db = getFirestore(app);
  try {
    // Bail early if the user already has spots. We only auto-import
    // legacy data for accounts that look brand new.
    const own = await getDocs(collection(db, 'users', uid, 'locations'));
    if (!own.empty) {
      try {
        localStorage.setItem(flagKey, String(Date.now()));
      } catch {
        // ignore
      }
      return { status: 'skipped', copied: 0 };
    }

    const legacy = await getDocs(collection(db, 'locations'));
    if (legacy.empty) {
      try {
        localStorage.setItem(flagKey, String(Date.now()));
      } catch {
        // ignore
      }
      return { status: 'empty', copied: 0 };
    }

    // Copy each legacy doc into the user's subcollection. We don't
    // run a batched write because the legacy collection is small
    // (<20 docs in practice) and individual setDoc retries are
    // simpler than batch-failure recovery.
    let copied = 0;
    for (const d of legacy.docs) {
      const data = d.data() as Location;
      // Preserve id so the user's subcollection ids match what the
      // legacy data used (useful for stocking-event locationId refs).
      await setDoc(doc(db, 'users', uid, 'locations', d.id), data);
      copied++;
    }
    try {
      localStorage.setItem(flagKey, String(Date.now()));
    } catch {
      // ignore
    }
    // eslint-disable-next-line no-console
    console.info(
      `[locations] legacy migration: copied ${copied} spot(s) into user ${uid.slice(
        0,
        6
      )}…`
    );
    return { status: 'migrated', copied };
  } catch (e) {
    // Most likely: rules deny the read. Not a hard failure — the user
    // just won't see legacy data. Log so we can debug.
    // eslint-disable-next-line no-console
    console.warn('[locations] legacy migration failed', e);
    return { status: 'failed', copied: 0 };
  }
}
