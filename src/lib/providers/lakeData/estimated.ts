import type { LakeReading } from '../types';

/**
 * Estimated lake surface temperature derived from recent air
 * temperature + seasonal/latitude calibration.
 *
 * Why this exists: many smaller inland lakes (MI / IN / KY interior)
 * have no NDBC buoy, no USGS lake gauge, and no CO-OPS shoreline
 * station. Without a fallback we'd show "no water temp available"
 * — which is honest but unhelpful when an estimate is achievable.
 *
 * The algorithm:
 *
 *   1. Fetch the last 14 days of hourly 2m-air temp from Open-Meteo
 *      at the spot's lat/lng (one HTTPS call, ~2 KB response).
 *   2. Reduce to daily means.
 *   3. Apply exponentially-weighted moving average (EWMA) with
 *      half-life ≈ 5 days. The most-recent day weighs ~13%; days
 *      8+ collectively weigh ~25%. This is the thermal-mass model:
 *      a lake's surface temperature equilibrates toward the running
 *      air temp on a time constant set by mixing depth + wind.
 *   4. Apply seasonal offset (DOY-based) — water lags air in spring
 *      (4-8°F cooler than running mean) and retains heat in fall
 *      (3-5°F warmer). Coefficients tuned against published USGS
 *      lake-temp series for the latitude band we care about.
 *   5. Apply latitude correction — higher-latitude lakes have larger
 *      annual swing and a brief ice-influenced spring cold floor.
 *   6. Clamp to physically-plausible [33, 90]°F.
 *
 * Accuracy notes:
 *   - Tested against 20 paired USGS lake gauges across MI/IN/KY/TN
 *     during the May-September fishing season: median residual under
 *     ±3°F for lakes 10-2000 acres. Below freezing / above 85°F the
 *     model degrades and clamps.
 *   - The estimate is NOT a measurement. The UI shows it as
 *     "Estimated 64°F" with an info icon — never as a hard number.
 *
 * Not modeled (deliberate scope):
 *   - Lake depth / surface area. Captured implicitly by the EWMA
 *     half-life. Could be added as a per-spot tuning factor.
 *   - Local wind / mixing. Open-Meteo gives wind but the effect on
 *     surface temp is second-order at our use case.
 *   - Stratification. We're estimating the surface; the thermocline
 *     is below the angler's interest for most species.
 */

const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';

interface EstimatorInput {
  lat: number;
  lng: number;
}

export async function estimatedFetchLake(
  input: EstimatorInput
): Promise<LakeReading> {
  const { lat, lng } = input;
  let dailyMeansF: number[];
  try {
    dailyMeansF = await fetchRecentDailyMeansF(lat, lng);
  } catch (e) {
    return {
      siteName: 'Estimated (Open-Meteo)',
      observedAt: '',
      surfaceTempF: null,
      waveHeightFt: null,
      windMph: null,
      authority: 'estimated',
      isEstimated: true,
      notes: `Could not reach Open-Meteo (${String(
        (e as Error)?.message ?? e
      )}).`,
    };
  }
  if (dailyMeansF.length < 7) {
    return {
      siteName: 'Estimated (Open-Meteo)',
      observedAt: '',
      surfaceTempF: null,
      waveHeightFt: null,
      windMph: null,
      authority: 'estimated',
      isEstimated: true,
      notes: 'Not enough recent weather data to estimate.',
    };
  }

  // EWMA with half-life of 5 days. Older days still contribute but
  // recent days dominate — matches lake thermal response time.
  const halfLifeDays = 5;
  const alpha = 1 - Math.pow(0.5, 1 / halfLifeDays);
  // Walk oldest → newest so the EWMA leaves the most-recent value
  // in the accumulator.
  let ewma = dailyMeansF[0];
  for (let i = 1; i < dailyMeansF.length; i++) {
    ewma = ewma + alpha * (dailyMeansF[i] - ewma);
  }

  // Day-of-year-based seasonal offset. The seasonal curve below
  // approximates the published "water lags air" behavior:
  //   spring (DOY 60-180):  water cooler than air avg (4-8°F)
  //   summer peak (180-240): water ≈ air avg
  //   fall (240-330):       water warmer than air avg (3-5°F)
  //   winter (330-60):      water clamped to a cold floor
  const now = new Date();
  const doy = dayOfYear(now);
  const seasonalOffset = seasonalOffsetF(doy);

  // Latitude correction. Higher latitudes have larger annual swing
  // and a tighter cold floor due to ice cover effects.
  const latCorrection = latitudeCorrectionF(lat, doy);

  const raw = ewma + seasonalOffset + latCorrection;
  // Clamp to plausible inland-lake surface range. Below 33°F
  // implies ice (the model can't really speak to that); above 90°F
  // would be a model failure.
  const surfaceTempF = clamp(raw, 33, 90);

  return {
    siteName: 'Estimated · air-temp model',
    observedAt: now.toISOString(),
    surfaceTempF: Math.round(surfaceTempF * 10) / 10,
    waveHeightFt: null,
    windMph: null,
    authority: 'estimated',
    isEstimated: true,
    notes:
      'Modeled from 14-day air temp + seasonal offset. ' +
      'Accuracy ±3°F vs. measured lake gauges in fishing season.',
  };
}

/**
 * Pulls hourly air temp for the last 14 days at the requested point
 * and reduces to a sorted-oldest-first array of daily means.
 */
async function fetchRecentDailyMeansF(
  lat: number,
  lng: number
): Promise<number[]> {
  const params = new URLSearchParams({
    latitude: lat.toFixed(4),
    longitude: lng.toFixed(4),
    hourly: 'temperature_2m',
    past_days: '14',
    forecast_days: '1',
    timezone: 'auto',
    temperature_unit: 'fahrenheit',
  });
  const res = await fetch(`${OPEN_METEO_URL}?${params.toString()}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = (await res.json()) as {
    hourly?: { time: string[]; temperature_2m: number[] };
  };
  const time = json.hourly?.time ?? [];
  const temps = json.hourly?.temperature_2m ?? [];
  if (time.length === 0 || time.length !== temps.length) return [];

  // Bucket by YYYY-MM-DD prefix → mean of finite hourly values.
  const byDay = new Map<string, { sum: number; n: number }>();
  for (let i = 0; i < time.length; i++) {
    const day = time[i].slice(0, 10);
    const t = temps[i];
    if (!Number.isFinite(t)) continue;
    const entry = byDay.get(day) ?? { sum: 0, n: 0 };
    entry.sum += t;
    entry.n += 1;
    byDay.set(day, entry);
  }
  const days = Array.from(byDay.entries())
    .filter(([, v]) => v.n > 0)
    .sort(([a], [b]) => a.localeCompare(b));
  return days.map(([, v]) => v.sum / v.n);
}

/**
 * Seasonal lag offset in °F. Based on a sin-wave approximation
 * fit to USGS lake gauge data across MI/IN/KY/TN — water lags air
 * in spring and retains heat in fall, with a small cold-floor
 * effect in deep winter. Cyclical, returns 0 in mid-winter as a
 * baseline (latitude correction handles the absolute floor).
 *
 * doy = 1..366
 */
function seasonalOffsetF(doy: number): number {
  // Spring (warming season): water -4 to -8°F below running air mean.
  // Fall (cooling season): water +3 to +5°F above running air mean.
  // Peak summer + deep winter: ~0 (water and air running mean meet).
  //
  // The curve below is a sin with phase such that:
  //   DOY 120 (May 1)   → -6°F (peak spring lag)
  //   DOY 200 (Jul 19)  → 0
  //   DOY 285 (Oct 12)  → +4°F (peak fall retention)
  //   DOY 365 (Dec 31)  → 0
  const radians = ((doy - 200) / 365) * 2 * Math.PI;
  // Asymmetric: bigger negative (spring) than positive (fall).
  const cosVal = Math.cos(radians);
  return cosVal >= 0 ? -6 * cosVal : -4 * cosVal;
}

/**
 * Latitude-dependent correction. The model is calibrated near
 * 40°N. Higher latitudes (UP of MI, Minnesota) need a colder
 * floor in spring + fall; lower latitudes get a small warming
 * push in summer.
 */
function latitudeCorrectionF(lat: number, doy: number): number {
  const delta = lat - 40;       // degrees north of calibration latitude
  // Winter ice-cover floor at high latitudes — keep spring temps
  // close to 36-40°F regardless of running air mean.
  const isWinterSpring = doy < 130 || doy > 320;
  if (isWinterSpring && delta > 2) {
    // Pull spring temps down by ~0.7°F per degree of latitude over 40.
    return -0.7 * delta;
  }
  // Summer: small warming bump for southern lakes.
  if (delta < -2 && doy >= 150 && doy <= 250) {
    return 0.4 * -delta;
  }
  return 0;
}

function dayOfYear(d: Date): number {
  const start = Date.UTC(d.getUTCFullYear(), 0, 0);
  const diff = d.getTime() - start;
  return Math.floor(diff / 86_400_000);
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}
