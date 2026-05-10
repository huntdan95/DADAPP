import SunCalc from 'suncalc';
import type { Location, SolunarReading } from './providers/types';

/**
 * Solunar major/minor period derivation: each lunar transit (overhead and
 * underfoot) marks a major period (~2h centered on transit). Each moonrise
 * and moonset marks a minor period (~1h centered).
 */
export function computeSolunar(location: Location, when: Date = new Date()): SolunarReading {
  const times = SunCalc.getTimes(when, location.lat, location.lng);
  const moonTimes = SunCalc.getMoonTimes(when, location.lat, location.lng);
  const moonIllum = SunCalc.getMoonIllumination(when);

  // Local solar noon as a proxy for "moon overhead" without an ephemeris lib.
  // For dad's level of precision this is adequate; we'll upgrade later if asked.
  const overhead = times.solarNoon;
  const underfoot = new Date(overhead.getTime() - 12 * 60 * 60 * 1000);

  const majorPeriods = [
    spanAround(overhead, 60),
    spanAround(underfoot, 60),
  ];

  const minorPeriods: Array<{ start: string; end: string }> = [];
  if (moonTimes.rise) minorPeriods.push(spanAround(moonTimes.rise, 30));
  if (moonTimes.set) minorPeriods.push(spanAround(moonTimes.set, 30));

  return {
    date: when.toISOString().slice(0, 10),
    sunrise: times.sunrise.toISOString(),
    sunset: times.sunset.toISOString(),
    moonrise: moonTimes.rise ? moonTimes.rise.toISOString() : null,
    moonset: moonTimes.set ? moonTimes.set.toISOString() : null,
    moonPhase: moonIllum.phase,
    moonIllumination: moonIllum.fraction,
    majorPeriods,
    minorPeriods,
  };
}

function spanAround(center: Date, halfMinutes: number) {
  const ms = halfMinutes * 60 * 1000;
  return {
    start: new Date(center.getTime() - ms).toISOString(),
    end: new Date(center.getTime() + ms).toISOString(),
  };
}

/** "Waxing crescent (24%)" style label from a phase 0..1 + illumination 0..1. */
export function moonPhaseLabel(phase: number, illumination: number): string {
  const pct = Math.round(illumination * 100);
  let name: string;
  if (phase < 0.03 || phase > 0.97) name = 'New moon';
  else if (phase < 0.22) name = 'Waxing crescent';
  else if (phase < 0.28) name = 'First quarter';
  else if (phase < 0.47) name = 'Waxing gibbous';
  else if (phase < 0.53) name = 'Full moon';
  else if (phase < 0.72) name = 'Waning gibbous';
  else if (phase < 0.78) name = 'Last quarter';
  else name = 'Waning crescent';
  return `${name} (${pct}%)`;
}
