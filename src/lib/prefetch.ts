import { fetchFlow, fetchTides, fetchWeather } from '@/lib/providers';
import type { Location } from '@/lib/providers/types';

/**
 * Silent background prefetch of weather + flow + tides for the user's
 * saved spots, when:
 *   1. The browser reports a Wi-Fi / fast connection (or doesn't tell us
 *      what type — we default to allowing prefetch on unknown connection
 *      types to avoid being too conservative on desktop).
 *   2. We haven't prefetched in the last 20 minutes.
 *
 * Service-worker runtime caching (configured in vite.config.ts) will
 * stash the responses, so when the user actually opens a spot the
 * conditions render instantly from cache.
 *
 * Failures are swallowed — this is pure best-effort warming.
 */

const PREFETCH_INTERVAL_MS = 20 * 60 * 1000;       // 20 min
const PREFETCH_TIMESTAMP_KEY = 'dad-fishing.prefetch.lastAt';

/**
 * Returns true if we should prefetch right now — fast connection AND not
 * within the cooldown window. Conservative: bails if the browser reports
 * `save-data` mode (user is on a metered connection).
 */
function shouldPrefetch(): { go: boolean; reason: string } {
  // Save-data signal from the user's OS / browser. Hard "no".
  const conn = (navigator as Navigator & {
    connection?: {
      type?: string;
      effectiveType?: string;
      saveData?: boolean;
    };
  }).connection;

  if (conn?.saveData) return { go: false, reason: 'save-data on' };

  // Connection type heuristic. `type === 'wifi'` is the cleanest signal
  // but most browsers don't expose it. `effectiveType === '4g'` is a
  // reasonable proxy for "fast enough". Anything 2g/3g/slow-2g → skip.
  if (conn?.effectiveType && /^(slow-2g|2g|3g)$/.test(conn.effectiveType)) {
    return { go: false, reason: `slow connection (${conn.effectiveType})` };
  }
  if (conn?.type && conn.type !== 'wifi' && conn.type !== 'ethernet' && conn.type !== 'unknown') {
    // type values: bluetooth, cellular, ethernet, none, wifi, wimax, other, unknown
    return { go: false, reason: `connection type ${conn.type}` };
  }

  // Cooldown — don't pound APIs on every nav.
  try {
    const lastStr = localStorage.getItem(PREFETCH_TIMESTAMP_KEY);
    const last = lastStr ? Number(lastStr) : 0;
    if (Date.now() - last < PREFETCH_INTERVAL_MS) {
      return { go: false, reason: 'within cooldown' };
    }
  } catch {
    // localStorage error — proceed anyway.
  }

  return { go: true, reason: 'ok' };
}

function noteRun(): void {
  try {
    localStorage.setItem(PREFETCH_TIMESTAMP_KEY, String(Date.now()));
  } catch {
    // ignore
  }
}

/**
 * Fire prefetch fetches. Returns a summary suitable for console.log
 * during dev; intended to be called once per app load (App.tsx
 * useEffect when locations resolve).
 */
export async function prefetchConditionsForSpots(
  locations: Location[]
): Promise<{ ran: boolean; reason: string; count: number }> {
  const { go, reason } = shouldPrefetch();
  if (!go) return { ran: false, reason, count: 0 };
  if (locations.length === 0) return { ran: false, reason: 'no spots', count: 0 };

  noteRun();

  // Fire all fetches in parallel. Cap concurrency loosely via Promise.all
  // — for a handful of saved spots this is fine, and any back-pressure
  // hits the SW cache layer rather than the underlying APIs.
  const tasks = locations.flatMap<Promise<unknown>>((loc) => {
    const out: Promise<unknown>[] = [
      fetchWeather(loc.dataProviders.weather, loc).catch(() => undefined),
    ];
    if (loc.dataProviders.flow) {
      out.push(fetchFlow(loc.dataProviders.flow).catch(() => undefined));
    }
    if (loc.dataProviders.tides) {
      out.push(fetchTides(loc.dataProviders.tides).catch(() => undefined));
    }
    return out;
  });

  await Promise.all(tasks);
  return { ran: true, reason, count: locations.length };
}
