import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { callable } from './client';
import type {
  Location,
  WeatherReading,
  FlowReading,
  DamScheduleReading,
  LakeReading,
} from '@/lib/providers/types';
import type { Hatch } from '@/lib/hatches/store';
import { weatherCodeSummary } from './weatherCode';
import { computeSolunar } from '@/lib/solunar';
import { lookupWaterbody } from '@/lib/waterbodies/registry';
import { estimateTrollingDepth } from '@/lib/trolling/depthEstimator';
import { getFirebaseApp } from '@/lib/firebase';

export type BiteQuality = 'prime' | 'good' | 'fair' | 'tough';

export interface BriefingResponse {
  /** The briefing text (3 sentences, one per line) with the leading
   * PRIME./GOOD./FAIR./TOUGH. token already stripped. */
  briefing: string;
  /** Server-parsed bite quality, or null if the model didn't
   * emit one of the four expected tokens. */
  biteQuality: BiteQuality | null;
  /** Web-search source citations (when Claude used the tool). */
  citations?: Array<{ url: string; title: string }>;
  /** True when the server hit a shared cache instead of spending tokens.
   * Lets the UI show a "cached" hint and lets us measure savings. */
  fromSharedCache?: boolean;
}

const _call = callable<BriefingInput, BriefingResponse>('briefing');

interface BriefingInput {
  locationName: string;
  waterType: string;
  river?: string;
  state: string;
  currentConditions: {
    airTempF: number;
    waterTempF?: number;
    flowCfs?: number;
    pressureMb: number;
    pressureTrend: string;
    windMph?: number;
    windDirection?: string;
    cloudCoverPct?: number;
    weatherSummary: string;
    lakeSurfaceTempF?: number;
    waveHeightFt?: number;
    lakeSurfaceTempIsEstimated?: boolean;
  };
  daily?: {
    tempMaxF?: number;
    tempMinF?: number;
    sunriseLocal?: string;
    sunsetLocal?: string;
  };
  nextSixHours?: Array<{
    hourLabel: string;
    tempF: number;
    precipProbPct: number | null;
    cloudCoverPct: number | null;
  }>;
  dam?: {
    name: string;
    nextChange: string | null;
    currentStatus: string;
  };
  activeHatches: Array<{
    name: string;
    tempRange: string;
    timeOfDay: string;
    flies: string;
  }>;
  /** Shared-cache key — when present, server checks Firestore before
   *  spending tokens. Computed from waterbody id (when available) or
   *  rounded GPS, plus the date in the spot's local TZ. Multiple users
   *  on the same waterbody on the same day get the same briefing. */
  sharedCacheKey?: string;
  recentStockings?: Array<{
    daysAgo: number;
    species: string;
    count?: number;
    size?: string;
    locationName: string;
  }>;
  waterbody?: {
    name: string;
    species: string[];
    accessNotes?: string;
    runLimits?: Array<{ species: string; limit: string; note?: string }>;
  };
  solunar?: {
    moonPhaseLabel: string;
    moonIlluminationPct: number;
    majorWindowsLocal: string[];
    minorWindowsLocal: string[];
  };
  trollingDepths?: Array<{
    species: string;
    depthRangeFt: [number, number];
    thermoclineFt: number | null;
    rationale: string;
  }>;
}

// ---- client-side cache ----------------------------------------------------

interface CacheEntry {
  response: BriefingResponse;
  cachedAt: number;
}

/**
 * Local cache key — instant first-paint of "today's briefing here"
 * without a Firestore round-trip. v3 bumped because the response now
 * includes `fromSharedCache` and the briefing no longer factors in
 * per-user catch context, so older cached values would mislead.
 */
function cacheKey(locationId: string, dateYMD: string): string {
  return `dad-fishing.briefing.v3.${locationId}.${dateYMD}`;
}

/**
 * Shared cache key — stable across users so anyone viewing the same
 * waterbody (or the same rounded ~1 km gps cell) on the same date
 * shares one Claude-generated briefing.
 *
 * Strategy:
 *   - Waterbody match → `wb-${waterbodyId}-${dateYMD}` (most precise)
 *   - No match        → `gps-${roundedLat}-${roundedLng}-${dateYMD}`
 *
 * 0.01° rounding ≈ 1 km — close enough that any two pins inside the
 * same fishing hole hash to the same key, far enough apart that two
 * actually-different waters don't collide.
 *
 * Date is in the spot's local timezone so a pin in MI and a pin in
 * MT don't accidentally share a briefing across day boundaries.
 */
export function sharedBriefingCacheKey(location: Location): string {
  const date = todayYMD(location.timezone);
  const wb = lookupWaterbody(location.lat, location.lng);
  if (wb) {
    return `wb-${wb.waterbody.id}-${date}`;
  }
  const lat = Math.round(location.lat * 100) / 100;
  const lng = Math.round(location.lng * 100) / 100;
  return `gps-${lat.toFixed(2)}-${lng.toFixed(2)}-${date}`;
}

function todayYMD(timezone: string): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: timezone }).format(
    new Date()
  );
}

export function readCachedBriefing(location: Location): BriefingResponse | null {
  try {
    const raw = localStorage.getItem(
      cacheKey(location.id, todayYMD(location.timezone))
    );
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheEntry;
    return parsed?.response ?? null;
  } catch {
    return null;
  }
}

function writeCachedBriefing(
  location: Location,
  response: BriefingResponse
): void {
  try {
    localStorage.setItem(
      cacheKey(location.id, todayYMD(location.timezone)),
      JSON.stringify({ response, cachedAt: Date.now() })
    );
  } catch {
    // quota — ignore
  }
}

export function invalidateBriefingCache(location: Location): void {
  try {
    localStorage.removeItem(
      cacheKey(location.id, todayYMD(location.timezone))
    );
  } catch {
    // ignore
  }
}

/**
 * Builds the request body, hits the Cloud Function, and caches the
 * result for the rest of the day at this spot. Pass `force: true`
 * to bypass the cache (used by the "Ask again" button).
 *
 * Three-tier cache strategy:
 *   1. localStorage (per-device, per-day) — instant first paint
 *   2. Firestore briefings/{sharedKey} (shared across users) — single
 *      round-trip, no Claude call
 *   3. Cloud Function → Claude API (only if both caches miss)
 *
 * The shared cache means multiple users viewing the same waterbody
 * on the same day pay for the briefing once. A user clicking "Refresh"
 * forces a regeneration that re-populates the shared cache for the
 * whole group.
 *
 * Enrichment besides the basics:
 *   - Curated waterbody species + access notes (when the pin matches
 *     a registered body — Lake St. Clair, Caney Fork, etc.)
 *   - Solunar windows + moon phase (always — local computation)
 *   - Lake surface temp from the LakeReading provider (when the flow
 *     reader didn't return a water temp)
 *   - Trolling depth estimates per species at this spot (when on a
 *     Great-Lakes / deep-lake spot with profile-matching species)
 *   - Today's high/low + sunset and a peek at the next 6 hourly slots
 */
export async function fetchBriefing(args: {
  location: Location;
  weather: WeatherReading;
  flow?: FlowReading;
  lakeReading?: LakeReading;
  damSchedule?: DamScheduleReading;
  damNextChange?: string | null;
  damCurrentStatus?: string;
  activeHatches: Hatch[];
  recentStockings?: Array<{
    date: string;
    species: string;
    count?: number;
    size?: string;
    locationName: string;
  }>;
  force?: boolean;
}): Promise<BriefingResponse> {
  const { location, weather, flow, damSchedule, activeHatches } = args;

  if (!args.force) {
    // Tier 1: localStorage — instant first paint, per-device.
    const cached = readCachedBriefing(location);
    if (cached) return cached;

    // Tier 2: Firestore shared cache — one round-trip, no Claude.
    // Group members already viewed this spot today? We piggyback for free.
    try {
      const app = getFirebaseApp();
      if (app) {
        const db = getFirestore(app);
        const cacheRef = doc(db, 'briefings', sharedBriefingCacheKey(location));
        const snap = await getDoc(cacheRef);
        if (snap.exists()) {
          const data = snap.data() as {
            briefing?: string;
            biteQuality?: BiteQuality | null;
            citations?: Array<{ url: string; title: string }>;
            expiresAtMs?: number;
          };
          if (
            data.briefing &&
            data.expiresAtMs &&
            data.expiresAtMs > Date.now()
          ) {
            const response: BriefingResponse = {
              briefing: data.briefing,
              biteQuality: data.biteQuality ?? null,
              citations: data.citations ?? [],
              fromSharedCache: true,
            };
            writeCachedBriefing(location, response);
            return response;
          }
        }
      }
    } catch {
      // Cache lookup failure is not fatal — proceed to generation.
    }
  }

  const now = Date.now();
  const tz = location.timezone;

  // Solunar — always computed locally; cheap, deterministic.
  const solar = computeSolunar(location);
  const moonLabel = labelForMoonPhase(solar.moonPhase);
  const solunar = {
    moonPhaseLabel: moonLabel,
    moonIlluminationPct: Math.round(solar.moonIllumination * 100),
    majorWindowsLocal: solar.majorPeriods.map((p) =>
      formatWindowLocal(p.start, p.end, tz)
    ),
    minorWindowsLocal: solar.minorPeriods.map((p) =>
      formatWindowLocal(p.start, p.end, tz)
    ),
  };

  // Curated waterbody match.
  const wbHit = lookupWaterbody(location.lat, location.lng);
  const waterbody = wbHit
    ? {
        name: wbHit.waterbody.name,
        species: wbHit.waterbody.species ?? [],
        accessNotes: wbHit.waterbody.accessNotes,
        runLimits: wbHit.waterbody.runLimits,
      }
    : undefined;

  // Trolling depth estimates — only for species the spot's
  // curated body lists. Use lake surface temp when available for
  // refinement.
  const trollingTempF =
    args.lakeReading?.surfaceTempF ?? flow?.waterTempF ?? null;
  const trollingDepths: BriefingInput['trollingDepths'] = [];
  if (waterbody) {
    for (const speciesName of waterbody.species.slice(0, 6)) {
      const est = estimateTrollingDepth({
        location,
        speciesId: speciesNameToId(speciesName),
        speciesName,
        surfaceTempF: trollingTempF,
      });
      if (est) {
        trollingDepths.push({
          species: est.speciesName,
          depthRangeFt: est.depthRangeFt,
          thermoclineFt: est.thermoclineFt,
          rationale: est.rationale,
        });
      }
    }
  }

  // Next-6-hours compact peek from the weather provider.
  const nextSixHours = weather.forecastHourly
    .slice(0, 6)
    .map((h) => ({
      hourLabel: formatHourLocal(h.time, tz),
      tempF: h.tempF,
      precipProbPct: h.precipProbPct,
      cloudCoverPct: h.cloudCoverPct,
    }));

  const req: BriefingInput = {
    locationName: location.name,
    waterType: location.type,
    river: location.river,
    state: location.state,
    currentConditions: {
      airTempF: weather.airTempF,
      waterTempF: flow?.waterTempF ?? undefined,
      flowCfs: flow?.flowCfs ?? undefined,
      pressureMb: weather.pressureMb,
      pressureTrend: weather.pressureTrend,
      windMph: weather.windMph ?? undefined,
      cloudCoverPct: weather.cloudCoverPct ?? undefined,
      weatherSummary: weatherCodeSummary(weather.weatherCode),
      lakeSurfaceTempF:
        args.lakeReading?.surfaceTempF != null
          ? args.lakeReading.surfaceTempF
          : undefined,
      waveHeightFt:
        args.lakeReading?.waveHeightFt != null
          ? args.lakeReading.waveHeightFt
          : undefined,
      lakeSurfaceTempIsEstimated: args.lakeReading?.isEstimated ?? undefined,
    },
    daily: {
      tempMaxF: weather.daily?.tempMaxF,
      tempMinF: weather.daily?.tempMinF,
      sunriseLocal: weather.daily?.sunrise
        ? formatTimeLocal(weather.daily.sunrise, tz)
        : undefined,
      sunsetLocal: weather.daily?.sunset
        ? formatTimeLocal(weather.daily.sunset, tz)
        : undefined,
    },
    nextSixHours,
    dam: damSchedule
      ? {
          name: damSchedule.damName,
          nextChange: args.damNextChange ?? null,
          currentStatus: args.damCurrentStatus ?? 'unknown',
        }
      : undefined,
    activeHatches: activeHatches.slice(0, 5).map((h) => ({
      name: h.name,
      tempRange: `${h.waterTempMinF}-${h.waterTempMaxF}°F`,
      timeOfDay: h.timeOfDay,
      flies: h.flies.join(', '),
    })),
    sharedCacheKey: sharedBriefingCacheKey(location),
    recentStockings: (args.recentStockings ?? []).slice(0, 5).map((s) => ({
      daysAgo: Math.max(
        0,
        Math.round(
          (now - new Date(s.date + 'T12:00:00').getTime()) /
            (24 * 3600 * 1000)
        )
      ),
      species: s.species,
      count: s.count,
      size: s.size,
      locationName: s.locationName,
    })),
    waterbody,
    solunar,
    trollingDepths: trollingDepths.length > 0 ? trollingDepths : undefined,
  };

  const res = await _call(req);
  writeCachedBriefing(location, res);
  return res;
}

function speciesNameToId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function labelForMoonPhase(phase: number): string {
  // SunCalc phase: 0 = new, 0.25 = first qtr, 0.5 = full, 0.75 = last qtr
  if (phase < 0.03 || phase > 0.97) return 'New moon';
  if (phase < 0.22) return 'Waxing crescent';
  if (phase < 0.28) return 'First quarter';
  if (phase < 0.47) return 'Waxing gibbous';
  if (phase < 0.53) return 'Full moon';
  if (phase < 0.72) return 'Waning gibbous';
  if (phase < 0.78) return 'Last quarter';
  return 'Waning crescent';
}

function formatTimeLocal(iso: string, tz: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso));
}

function formatHourLocal(iso: string, tz: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: 'numeric',
  }).format(new Date(iso));
}

function formatWindowLocal(startIso: string, endIso: string, tz: string): string {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: 'numeric',
    minute: '2-digit',
  });
  return `${fmt.format(new Date(startIso))}–${fmt.format(new Date(endIso))}`;
}
