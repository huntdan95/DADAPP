import type {
  DamScheduleReading,
  FlowReading,
  Location,
  WeatherReading,
} from './providers/types';

export type Fishability = 'good' | 'fair' | 'poor' | 'unknown';

/**
 * Single-number fishability heuristic for marker color. Inputs are whatever
 * we have on hand — any may be missing. We start at 100 and dock points for
 * factors that historically reduce the bite. The thresholds are deliberately
 * coarse: this is "should I go?" not "what fly?".
 *
 * Tunable later from journal data (Phase 6 pattern-insights).
 */
export function scoreFishability(input: {
  location: Location;
  weather?: WeatherReading;
  flow?: FlowReading;
  damSchedule?: DamScheduleReading;
}): { score: number; rating: Fishability; reasons: string[] } {
  const reasons: string[] = [];
  let score = 100;

  if (!input.weather) {
    return { score: 0, rating: 'unknown', reasons: ['no weather data'] };
  }

  const w = input.weather;

  // Pressure trend — falling fast suppresses bite.
  if (w.pressureTrend === 'falling-fast') {
    score -= 35;
    reasons.push('pressure crashing');
  } else if (w.pressureTrend === 'falling') {
    score -= 8;
    reasons.push('pressure dropping');
  } else if (w.pressureTrend === 'rising-fast') {
    score -= 5;
    reasons.push('pressure spiking');
  }

  // Trout target zone for tailwaters / freestones.
  if (
    (input.location.type === 'tailwater' ||
      input.location.type === 'freestone') &&
    input.flow?.waterTempF != null
  ) {
    const t = input.flow.waterTempF;
    if (t < 38) {
      score -= 30;
      reasons.push(`water cold (${Math.round(t)}°F)`);
    } else if (t > 70) {
      score -= 35;
      reasons.push(`water hot (${Math.round(t)}°F) — stress zone`);
    } else if (t < 45) {
      score -= 10;
      reasons.push(`water cool (${Math.round(t)}°F)`);
    } else if (t > 65) {
      score -= 10;
      reasons.push(`water warm (${Math.round(t)}°F)`);
    }
  }

  // Active dam generation = harder wading + less productive on most tailwaters.
  if (input.damSchedule) {
    const hour = new Date().getHours();
    const units = input.damSchedule.hourlyUnits[hour];
    if (units != null && units >= 2) {
      score -= 25;
      reasons.push('heavy generation');
    } else if (units != null && units === 1) {
      score -= 8;
      reasons.push('partial generation');
    }
  }

  const clamped = Math.max(0, Math.min(100, score));
  const rating: Fishability =
    clamped >= 70 ? 'good' : clamped >= 40 ? 'fair' : 'poor';

  return { score: clamped, rating, reasons };
}

export function fishabilityColor(rating: Fishability): string {
  switch (rating) {
    case 'good':
      return '#4ade80';
    case 'fair':
      return '#fbbf24';
    case 'poor':
      return '#ef4444';
    case 'unknown':
      return '#7a857a';
  }
}
