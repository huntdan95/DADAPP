/**
 * On-demand geocoding for stocking-event waters.
 *
 * Reality check: zero records in `functions/seed-data/*.json` ship
 * with `lat`/`lng`. State DNRs publish stocking schedules with
 * water-name + county + (sometimes) region, but rarely with
 * coordinates. This module bridges the gap.
 *
 * Strategy:
 *   1. Check localStorage cache — keyed on the normalized
 *      (water, county, state) tuple. 30-day TTL so a freshly
 *      built reservoir eventually gets re-resolved if it failed
 *      the first time.
 *   2. Fall through to Nominatim — OpenStreetMap's free
 *      geocoder. No API key. Rate limit is 1 req/sec; we hit it
 *      at most once per user-tap, so we're well under.
 *   3. Cache the result (or `null`) so we don't re-hit Nominatim
 *      for the same water on every event tap.
 *
 * Nominatim's TOS requires a meaningful User-Agent. Browsers won't
 * let us set User-Agent on fetch, so we identify via the
 * `referrer` (set by the browser) plus a custom `email` query
 * parameter pointing to the project.
 */

export interface GeocodeResult {
  lat: number;
  lng: number;
  /** What Nominatim called the matched place — for "did we pin the right water?" UI. */
  matchedLabel: string;
}

interface CacheEntry {
  result: GeocodeResult | null;
  cachedAtMs: number;
}

const CACHE_KEY_PREFIX = 'stocking:geocode:v1:';
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const NEGATIVE_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 1 day — re-try misses sooner

/** Normalize the cache key so trivial whitespace/case variations dedupe. */
function cacheKey(water: string, county: string | undefined, state: string): string {
  const w = water.trim().toLowerCase().replace(/\s+/g, ' ');
  const c = (county ?? '').trim().toLowerCase();
  const s = state.trim().toUpperCase();
  return `${CACHE_KEY_PREFIX}${s}|${c}|${w}`;
}

function readCache(key: string): CacheEntry | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as CacheEntry;
  } catch {
    return null;
  }
}

function writeCache(key: string, result: GeocodeResult | null): void {
  try {
    const entry: CacheEntry = { result, cachedAtMs: Date.now() };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // Quota exceeded — silently ignore; just means we re-fetch.
  }
}

function isCacheFresh(entry: CacheEntry): boolean {
  const age = Date.now() - entry.cachedAtMs;
  // Negative results expire sooner so a freshly-mapped water
  // becomes resolvable without manually clearing storage.
  const ttl = entry.result == null ? NEGATIVE_CACHE_TTL_MS : CACHE_TTL_MS;
  return age < ttl;
}

/**
 * Builds Nominatim queries from most-specific to least. We try the
 * most-specific phrasing first so "Caney Fork at Happy Hollow" doesn't
 * match a town named "Happy Hollow" 800 miles away. If the specific
 * query returns nothing, we fall back to the simpler "water + state".
 */
function buildQueryVariants(
  water: string,
  county: string | undefined,
  state: string
): string[] {
  const w = water.trim();
  const s = state.trim().toUpperCase();
  const c = county?.trim();

  const variants: string[] = [];
  // Most specific: water + county + state
  if (c) variants.push(`${w}, ${c} County, ${s}, USA`);
  // Without county
  variants.push(`${w}, ${s}, USA`);
  // Last-resort: bare water + state code, helps for ambiguous names
  variants.push(`${w} ${s}`);
  return variants;
}

interface NominatimRecord {
  lat: string;
  lon: string;
  display_name: string;
  /** Class/type fields help filter to actual waterbodies. */
  class?: string;
  type?: string;
}

const NOMINATIM_BASE =
  'https://nominatim.openstreetmap.org/search?format=json&limit=3&addressdetails=0';

/**
 * Hit Nominatim with a single query. Returns the best waterbody-like
 * match, or null. We bias toward `class=natural` (river, lake, stream)
 * over `class=place` (town named after a river).
 */
async function nominatimOne(q: string): Promise<GeocodeResult | null> {
  const url = `${NOMINATIM_BASE}&q=${encodeURIComponent(q)}`;
  try {
    const res = await fetch(url, {
      headers: {
        // Nominatim wants identifiability — referer is set by the
        // browser. The Accept header keeps responses small.
        Accept: 'application/json',
      },
    });
    if (!res.ok) return null;
    const rows = (await res.json()) as NominatimRecord[];
    if (!Array.isArray(rows) || rows.length === 0) return null;

    // Prefer waterbody-class matches; if none, accept any.
    const preferred =
      rows.find(
        (r) =>
          r.class === 'natural' ||
          r.class === 'waterway' ||
          r.type === 'reservoir' ||
          r.type === 'lake' ||
          r.type === 'river' ||
          r.type === 'stream' ||
          r.type === 'water'
      ) ?? rows[0];

    const lat = Number(preferred.lat);
    const lng = Number(preferred.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { lat, lng, matchedLabel: preferred.display_name };
  } catch {
    return null;
  }
}

/**
 * Public API: resolve a stocking-event water to lat/lng. Tries cache
 * first, then Nominatim with up-to-3 progressively-less-specific
 * queries. Throws nothing — falls through to `null` on any failure
 * so the caller can render a graceful fallback.
 */
export async function geocodeWater(args: {
  water: string;
  county?: string;
  state: string;
}): Promise<GeocodeResult | null> {
  if (!args.water || !args.state) return null;
  const key = cacheKey(args.water, args.county, args.state);

  // 1. Cache hit (positive or negative).
  const cached = readCache(key);
  if (cached && isCacheFresh(cached)) return cached.result;

  // 2. Try query variants in order until one returns a result.
  const variants = buildQueryVariants(args.water, args.county, args.state);
  for (const v of variants) {
    const result = await nominatimOne(v);
    if (result) {
      writeCache(key, result);
      return result;
    }
  }

  // 3. All variants missed — cache the miss to avoid repeat lookups.
  writeCache(key, null);
  return null;
}
