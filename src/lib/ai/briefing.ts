import { callable } from './client';
import type { Location, WeatherReading, FlowReading, DamScheduleReading } from '@/lib/providers/types';
import type { Catch } from '@/lib/journal/types';
import type { Hatch } from '@/lib/hatches/store';
import { weatherCodeSummary } from './weatherCode';

export interface BriefingResponse {
  briefing: string;
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
    cloudCoverPct?: number;
    weatherSummary: string;
  };
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
  recentCatches: Array<{
    species: string;
    lengthInches?: number;
    method: string;
    fly: string;
    daysAgo: number;
    notes?: string;
  }>;
  /**
   * Stocking events within ~25 mi of this spot in the last 30 days.
   * Empty array if nothing recent — Claude is told to weave them into
   * the briefing only when they're actionable ("stocked Friday, hit it
   * before the truck-chasers find them").
   */
  recentStockings?: Array<{
    daysAgo: number;
    species: string;
    count?: number;
    size?: string;
    locationName: string;
  }>;
}

// ---- client-side cache -----------------------------------------------------
//
// One briefing per spot per day. Conditions inside that window don't shift
// enough to justify another Claude call (and the daily-cap server-side
// would block excess attempts anyway). Cache key includes the local date in
// the spot's timezone so a spot in TN rolls over at midnight TN-time.

interface CacheEntry {
  briefing: string;
  cachedAt: number;
}

function cacheKey(locationId: string, dateYMD: string): string {
  return `dad-fishing.briefing.v1.${locationId}.${dateYMD}`;
}

function todayYMD(timezone: string): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: timezone }).format(
    new Date()
  );
}

export function readCachedBriefing(location: Location): string | null {
  try {
    const raw = localStorage.getItem(
      cacheKey(location.id, todayYMD(location.timezone))
    );
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheEntry;
    return parsed?.briefing ?? null;
  } catch {
    return null;
  }
}

function writeCachedBriefing(location: Location, briefing: string): void {
  try {
    localStorage.setItem(
      cacheKey(location.id, todayYMD(location.timezone)),
      JSON.stringify({ briefing, cachedAt: Date.now() })
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
 * Builds the request body, hits the Cloud Function, and caches the result
 * for the rest of the day at this spot. Pass `force: true` to bypass the
 * cache (used by the "Ask again" button).
 */
export async function fetchBriefing(args: {
  location: Location;
  weather: WeatherReading;
  flow?: FlowReading;
  damSchedule?: DamScheduleReading;
  damNextChange?: string | null;
  damCurrentStatus?: string;
  activeHatches: Hatch[];
  recentCatches: Catch[];
  recentStockings?: Array<{
    date: string;          // YYYY-MM-DD
    species: string;
    count?: number;
    size?: string;
    locationName: string;
  }>;
  force?: boolean;
}): Promise<BriefingResponse> {
  const { location, weather, flow, damSchedule, activeHatches, recentCatches } = args;

  if (!args.force) {
    const cached = readCachedBriefing(location);
    if (cached) return { briefing: cached };
  }

  const now = Date.now();
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
    },
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
    recentCatches: recentCatches.slice(0, 5).map((c) => ({
      species: c.species,
      lengthInches: c.lengthInches,
      method: c.method,
      fly: c.flyOrLure,
      daysAgo: Math.max(
        0,
        Math.round((now - new Date(c.time).getTime()) / (24 * 3600 * 1000))
      ),
      notes: c.notes,
    })),
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
  };

  const res = await _call(req);
  writeCachedBriefing(location, res.briefing);
  return res;
}
