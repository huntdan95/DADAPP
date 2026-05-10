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
}

/** Builds the request body and calls the Cloud Function. */
export async function fetchBriefing(args: {
  location: Location;
  weather: WeatherReading;
  flow?: FlowReading;
  damSchedule?: DamScheduleReading;
  damNextChange?: string | null;
  damCurrentStatus?: string;
  activeHatches: Hatch[];
  recentCatches: Catch[];
}): Promise<BriefingResponse> {
  const { location, weather, flow, damSchedule, activeHatches, recentCatches } = args;
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
  };

  return _call(req);
}
