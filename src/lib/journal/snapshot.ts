import { fetchWeather, fetchFlow, fetchDamSchedule } from '@/lib/providers';
import type { Location } from '@/lib/providers/types';
import { computeSolunar } from '@/lib/solunar';
import type { ConditionsSnapshot } from './types';

/**
 * Capture a denormalized conditions snapshot for a location at a given
 * moment. Failures fall through to undefined fields so a logged catch
 * never blocks on a flaky provider.
 */
export async function captureConditions(
  location: Location
): Promise<ConditionsSnapshot> {
  const [weather, flow, damSchedule] = await Promise.all([
    fetchWeather(location.dataProviders.weather, location).catch(() => undefined),
    location.dataProviders.flow
      ? fetchFlow(location.dataProviders.flow).catch(() => undefined)
      : Promise.resolve(undefined),
    location.dataProviders.damSchedule
      ? fetchDamSchedule(location.dataProviders.damSchedule).catch(() => undefined)
      : Promise.resolve(undefined),
  ]);

  const solunar = computeSolunar(location);

  // Best effort — if weather failed, use placeholders so the catch is still loggable.
  const damStatus = damSchedule
    ? deriveDamStatus(damSchedule.hourlyUnits[new Date().getHours()])
    : undefined;

  return {
    airTempF: weather?.airTempF ?? Number.NaN,
    waterTempF: flow?.waterTempF ?? undefined,
    flowCfs: flow?.flowCfs ?? undefined,
    pressureMb: weather?.pressureMb ?? Number.NaN,
    pressureTrend: weather?.pressureTrend ?? 'steady',
    weatherCode: weather?.weatherCode ?? 0,
    cloudCoverPct: weather?.cloudCoverPct ?? undefined,
    windMph: weather?.windMph ?? undefined,
    moonPhase: solunar.moonPhase,
    moonIllumination: solunar.moonIllumination,
    damStatus,
  };
}

function deriveDamStatus(
  units: number | null | undefined
): ConditionsSnapshot['damStatus'] {
  if (units == null) return undefined;
  if (units === 0) return 'no_generation';
  if (units === 1) return 'partial';
  return 'full';
}
