import { useEffect, useState } from 'react';

/**
 * Shared "where is the user" infrastructure.
 *
 * Every map in the app wants a "you are here" reference dot. Doing
 * five independent `navigator.geolocation.getCurrentPosition` calls
 * means five permission prompts, five fetches, and five sets of
 * subscribers fighting over the result. This module hands out one
 * cached position to every consumer.
 *
 * Two access modes:
 *   - default: one-shot position, fetched on first hook mount.
 *   - watch: subscribes to live position updates (used by the main
 *     Map tab so the dot tracks while the user is driving). Only ONE
 *     watcher runs at a time even if multiple consumers ask for watch
 *     mode; refcounts protect against teardown.
 *
 * The hook never throws. If permission is denied or GPS times out,
 * it stays at `null` and the consumer gracefully degrades.
 */

export interface UserPosition {
  lat: number;
  lng: number;
  /** Reported accuracy radius in meters (per Geolocation spec). */
  accuracy: number;
}

/** Module-scoped cache so all hook instances share one fix. */
let cached: UserPosition | null = null;
let inFlight: Promise<UserPosition | null> | null = null;
const listeners = new Set<(p: UserPosition | null) => void>();

/** Active watchId from navigator.geolocation.watchPosition. */
let watchId: number | null = null;
let watchRefcount = 0;

function broadcast(p: UserPosition | null): void {
  cached = p;
  for (const cb of listeners) cb(p);
}

/**
 * One-shot fetch shared across the app. Subsequent callers piggy-back
 * on the in-flight Promise rather than firing a fresh GPS request.
 */
function fetchOnce(): Promise<UserPosition | null> {
  if (cached) return Promise.resolve(cached);
  if (inFlight) return inFlight;
  if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
    return Promise.resolve(null);
  }
  inFlight = new Promise<UserPosition | null>((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p: UserPosition = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        };
        broadcast(p);
        resolve(p);
      },
      () => {
        // Permission denied / timeout / unavailable. Never throw —
        // every consumer is built to render fine without a fix.
        resolve(null);
      },
      // Modest timeout + accept a recent cached fix from the OS.
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 5 * 60_000 }
    );
  }).finally(() => {
    inFlight = null;
  });
  return inFlight;
}

/**
 * Start a watchPosition listener if we don't already have one. Refcount
 * lets multiple consumers ask for `watch: true` without racing to spin
 * up redundant watchers.
 */
function startWatcher(): void {
  watchRefcount++;
  if (watchId != null) return;
  if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
    return;
  }
  watchId = navigator.geolocation.watchPosition(
    (pos) => {
      broadcast({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
      });
    },
    () => undefined,
    { enableHighAccuracy: false, timeout: 15000, maximumAge: 30_000 }
  );
}

function stopWatcher(): void {
  watchRefcount = Math.max(0, watchRefcount - 1);
  if (watchRefcount > 0) return;
  if (watchId != null && typeof navigator !== 'undefined') {
    navigator.geolocation.clearWatch(watchId);
  }
  watchId = null;
}

/**
 * React hook: returns the user's current position, or null while we
 * have no fix (yet, or ever — permission denied is a permanent null).
 *
 * Pass `watch: true` to track live updates. Only the Map tab uses
 * this; mini-maps + form pickers are fine with a single fix.
 */
export function useUserLocation(opts: { watch?: boolean } = {}): UserPosition | null {
  const [position, setPosition] = useState<UserPosition | null>(cached);

  useEffect(() => {
    let cancelled = false;
    listeners.add(setPosition);

    // Kick off the one-shot fetch on first mount.
    fetchOnce().then((p) => {
      if (cancelled) return;
      if (p) setPosition(p);
    });

    // Optional live watcher — refcounted so we never start two.
    if (opts.watch) startWatcher();

    return () => {
      cancelled = true;
      listeners.delete(setPosition);
      if (opts.watch) stopWatcher();
    };
    // `opts.watch` is the only stable input we care about. Re-running on
    // every render's opts identity would be wrong; capture the value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts.watch]);

  return position;
}

/**
 * Haversine great-circle distance in miles. Useful for the
 * "12 mi away" chips + the maxDistance gate on mini-map overlays.
 */
export function distanceMi(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 3958.8; // miles
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}
