import { callable } from './client';
import type {
  Location,
  WeatherReading,
  FlowReading,
  DamScheduleReading,
  LakeReading,
} from '@/lib/providers/types';
import type { Catch } from '@/lib/journal/types';
import type { Hatch } from '@/lib/hatches/store';
import { weatherCodeSummary } from './weatherCode';
import { computeSolunar } from '@/lib/solunar';
import { lookupWaterbody } from '@/lib/waterbodies/registry';
import { estimateTrollingDepth } from '@/lib/trolling/depthEstimator';

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
  recentCatches: Array<{
    species: string;
    lengthInches?: number;
    method: string;
    fly: string;
    daysAgo: number;
    notes?: string;
  }>;
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

/** v2 key — v1 cached only the prose string. v2 caches the full
 * structured response (biteQuality, citations). */
function cacheKey(locationId: string, dateYMD: string): string {
  return `dad-fishing.briefing.v2.${locationId}.${dateYMD}`;
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
  recentCatches: Catch[];
  recentStockings?: Array<{
    date: string;
    species: string;
    count?: number;
    size?: string;
    locationName: string;
  }>;
  force?: boolean;
}): Promise<BriefingResponse> {
  const { location, weather, flow, damSchedule, activeHatches, recentCatches } =
    args;

  if (!args.force) {
    const cached = readCachedBriefing(location);
    if (cached) return cached;
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
