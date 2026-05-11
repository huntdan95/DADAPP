/**
 * Most-recently-used spot tracker. Keeps an ordered list of spot ids
 * the user has opened in the picker, MRU first. Used by SpotPicker to
 * surface a "Recent" section at the top so the typical "tap the spot
 * I always fish" interaction is one tap, not a scroll-and-search.
 *
 * Stored in localStorage (per-device — recents shouldn't sync across
 * devices because dad and his buddy each fish their own honey holes).
 * Capped at 10 entries to keep storage tiny.
 *
 * Auth-scoped key so signing out + signing in as another account
 * doesn't bleed recents between users on the same device.
 */

const STORAGE_KEY_BASE = 'dad-fishing.spot-mru.v1';
const MAX_ENTRIES = 10;

function storageKey(uid: string | null): string {
  return uid ? `${STORAGE_KEY_BASE}.${uid}` : STORAGE_KEY_BASE;
}

/** Read the MRU list, newest first. Returns [] on cold-start / corruption. */
export function readSpotMru(uid: string | null): string[] {
  try {
    const raw = localStorage.getItem(storageKey(uid));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === 'string');
  } catch {
    return [];
  }
}

/**
 * Move (or insert) `spotId` to the front of the MRU list. No-op when
 * spotId is already in front — saves a localStorage write on every
 * passive picker open.
 */
export function bumpSpotMru(uid: string | null, spotId: string): void {
  try {
    const current = readSpotMru(uid);
    if (current[0] === spotId) return;
    const next = [spotId, ...current.filter((id) => id !== spotId)].slice(
      0,
      MAX_ENTRIES
    );
    localStorage.setItem(storageKey(uid), JSON.stringify(next));
  } catch {
    // localStorage quota / private mode — silent ignore.
  }
}
