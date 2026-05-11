/**
 * Shared water-temperature estimator. Returns a modeled surface
 * temperature for any pin (river OR lake), based on recent air
 * temperature + seasonal/latitude calibration, optionally anchored
 * against the nearest USGS water-temp gauge on the SAME body of water.
 *
 * Why this lives here (not under lakeData/): both river spots whose
 * USGS gauge lacks a temp sensor AND lake spots whose buoy is
 * unreachable hit this fallback. Keeping it in one place means the
 * model + calibration rules stay consistent across surfaces.
 *
 * Calibration rule — IMPORTANT:
 *   We only pull a calibration anchor from a gauge that's on the
 *   SAME named waterbody as the spot. Two ways we establish "same":
 *     1. Bbox match — the gauge's lat/lng resolves to the same
 *        waterbody-registry id as the spot's lat/lng.
 *     2. Name-token match — the gauge's USGS station name contains
 *        the waterbody's name (case-insensitive, normalized).
 *   If neither matches, the gauge is rejected. This prevents the
 *   "Au Sable pin pulling temp from a Manistee gauge 30 miles away"
 *   class of bug — different water masses, different thermal profiles.
 *
 * When no same-water calibration anchor is reachable, the estimator
 * still returns its pure-model output. The notes line says
 * "uncalibrated" so the user knows.
 */

import {
  nearestUsgsGauges,
  nearestUsgsLakeSites,
} from '@/lib/geo/reverseGeocode';
import { usgsLakeFetch } from '../lakeData/usgsLake';
import { usgsFetchFlow } from '../flow/usgs';
import {
  lookupWaterbody,
  type Waterbody,
} from '@/lib/waterbodies/registry';

const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';

export interface EstimatedTempResult {
  /** Surface temp in °F. Always finite when `ok` is true. */
  surfaceTempF: number;
  /** Provenance / explanation. Surfaces in the section's notes line. */
  notes: string;
  /** Where the estimate came from (display siteName). */
  siteName: string;
  /** True when we found a same-waterbody gauge to anchor the model. */
  calibrated: boolean;
  /** When calibrated, the gauge id we used (for debugging). */
  calibrationSiteId?: string;
}

export interface EstimatorFailure {
  surfaceTempF: null;
  notes: string;
  siteName: string;
  calibrated: false;
}

export type EstimatorOutput = EstimatedTempResult | EstimatorFailure;

/**
 * Compute an estimated water surface temp for the given lat/lng.
 *
 * Returns `surfaceTempF: null` only when we can't even reach
 * Open-Meteo to get the air-temp history. Otherwise always returns
 * a number; the `calibrated` flag tells you whether we anchored
 * against a same-water gauge or it's pure model output.
 */
export async function estimateWaterTemp(
  lat: number,
  lng: number
): Promise<EstimatorOutput> {
  let dailyMeansF: number[];
  try {
    dailyMeansF = await fetchRecentDailyMeansF(lat, lng);
  } catch (e) {
    return {
      surfaceTempF: null,
      notes: `Could not reach Open-Meteo (${String(
        (e as Error)?.message ?? e
      )}).`,
      siteName: 'Estimated (Open-Meteo)',
      calibrated: false,
    };
  }
  if (dailyMeansF.length < 7) {
    return {
      surfaceTempF: null,
      notes: 'Not enough recent weather data to estimate.',
      siteName: 'Estimated (Open-Meteo)',
      calibrated: false,
    };
  }

  // ----- Pure-model output -------------------------------------------------
  // EWMA half-life 5d (lake thermal response time).
  const halfLifeDays = 5;
  const alpha = 1 - Math.pow(0.5, 1 / halfLifeDays);
  let ewma = dailyMeansF[0];
  for (let i = 1; i < dailyMeansF.length; i++) {
    ewma = ewma + alpha * (dailyMeansF[i] - ewma);
  }

  const now = new Date();
  const doy = dayOfYear(now);
  const seasonalOffset = seasonalOffsetF(doy);
  const latCorrection = latitudeCorrectionF(lat, doy);
  const raw = ewma + seasonalOffset + latCorrection;
  const modeled = clamp(raw, 33, 90);

  // ----- Calibrate against same-waterbody gauge ----------------------------
  const spotWaterbody = lookupWaterbody(lat, lng)?.waterbody ?? null;
  const calibration = await calibrateAgainstSameWaterbodyGauge(
    lat,
    lng,
    modeled,
    spotWaterbody
  ).catch(() => null);

  const surfaceTempF = calibration?.surfaceTempF ?? modeled;
  const notesBase = 'Modeled from 14-day air temp + seasonal offset.';
  let notes: string;
  let siteName: string;

  if (calibration) {
    notes =
      `${notesBase} Calibrated against USGS ${calibration.siteId} on ${calibration.waterbodyName} ` +
      `(${calibration.distanceMiles.toFixed(0)} mi — ` +
      `gauge ${calibration.gaugeF.toFixed(1)}°F, ` +
      `model ${modeled.toFixed(1)}°F).`;
    siteName = `Estimated · calibrated to USGS ${calibration.siteId}`;
  } else if (spotWaterbody) {
    // Spot is on a recognized waterbody but no gauge on THIS water is
    // reachable. Be explicit so the user knows we didn't silently use
    // a cross-water gauge.
    notes =
      `${notesBase} No USGS water-temp gauge on ${spotWaterbody.name} within 50 mi; ` +
      'model is uncalibrated for this waterbody.';
    siteName = 'Estimated · air-temp model';
  } else {
    // Spot is not in our waterbody registry, so we have no way to
    // verify "same body". Run uncalibrated rather than risk pulling
    // from a different water's gauge.
    notes =
      `${notesBase} Spot not in the waterbody registry — running uncalibrated.`;
    siteName = 'Estimated · air-temp model';
  }

  return {
    surfaceTempF: Math.round(surfaceTempF * 10) / 10,
    notes,
    siteName,
    calibrated: Boolean(calibration),
    calibrationSiteId: calibration?.siteId,
  };
}

/**
 * Determines whether a USGS gauge sits on the spot's waterbody.
 * Returns the canonical name of the matching body (for the notes line),
 * or null if the gauge is on a different water (or unknown water).
 */
function matchesSameWaterbody(
  spotWaterbody: Waterbody,
  gauge: { siteId: string; name: string; lat: number; lng: number }
): string | null {
  // Strong signal: gauge bbox-resolves to the same waterbody id.
  const gaugeWb = lookupWaterbody(gauge.lat, gauge.lng)?.waterbody;
  if (gaugeWb?.id === spotWaterbody.id) {
    return spotWaterbody.name;
  }

  // Fallback signal: name-token match. USGS station names are like
  //   "AU SABLE RIVER AT MIO, MI"
  //   "ST. JOSEPH RIVER NEAR HUBBARD CO. RD, IN"
  //   "MIO POND NEAR MIO, MI"
  // Normalize and check if the gauge name contains the waterbody name
  // (or one of its aliases). Handles gauges that sit just outside the
  // bbox but are clearly named for the river.
  const gaugeName = normalize(gauge.name);
  const candidates = [spotWaterbody.name, ...(spotWaterbody.aliases ?? [])];
  for (const cand of candidates) {
    const normCand = normalize(cand);
    if (!normCand) continue;
    // Require a meaningful match, not just "river" appearing in both names.
    if (normCand.length >= 5 && gaugeName.includes(normCand)) {
      return spotWaterbody.name;
    }
  }
  return null;
}

/**
 * Normalize a name for comparison: lowercase, strip punctuation,
 * strip generic suffixes that would create false matches if a gauge
 * has just "River" in its name.
 */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/\b(north|south|east|west|upper|lower|middle|big|little)\b/g, '')
    .replace(/\b(branch|fork)\b/g, '')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Walks lake-type then stream-type USGS gauges and returns the
 * closest one that's on the same waterbody as the spot. Same
 * 50-mi search radius + distance taper as before.
 *
 * Returns null when:
 *   - The spot has no waterbody (we can't verify "same body")
 *   - No same-water gauge within 50 mi
 *   - All candidate gauges have stale readings (<30°F or >95°F)
 */
async function calibrateAgainstSameWaterbodyGauge(
  lat: number,
  lng: number,
  modeled: number,
  spotWaterbody: Waterbody | null
): Promise<{
  surfaceTempF: number;
  siteId: string;
  distanceMiles: number;
  gaugeF: number;
  waterbodyName: string;
} | null> {
  if (!spotWaterbody) return null;

  // Stage 1: USGS lake gauges (siteType=LK + temp 00010). Same-water
  // anchor when the spot is on a registered lake/reservoir.
  const lakeSites = await nearestUsgsLakeSites(lat, lng, 5, 0.75).catch(
    () => []
  );
  for (const site of lakeSites) {
    if (site.distanceMiles > 50) break;
    const waterbodyName = matchesSameWaterbody(spotWaterbody, site);
    if (!waterbodyName) continue;
    const reading = await usgsLakeFetch(site.siteId).catch(() => null);
    if (!reading || reading.surfaceTempF == null) continue;
    if (reading.surfaceTempF < 30 || reading.surfaceTempF > 95) continue;
    const weight = Math.max(0, 1 - site.distanceMiles / 50);
    const blended = modeled * (1 - weight) + reading.surfaceTempF * weight;
    return {
      surfaceTempF: blended,
      siteId: site.siteId,
      distanceMiles: site.distanceMiles,
      gaugeF: reading.surfaceTempF,
      waterbodyName,
    };
  }

  // Stage 2: USGS stream gauges with water temp (param 00010). Same-
  // water match for rivers that have a USGS thermistor anywhere on
  // their length. usgsFetchFlow now returns the most-recent VALID
  // reading (walking backwards through 2 days of IV data) so a sensor
  // that briefly dropped out today still surfaces yesterday's 43°F.
  const streamGauges = await nearestUsgsGauges(lat, lng, 5, 0.6).catch(
    () => []
  );
  const withTemp = streamGauges.filter((g) => g.hasWaterTemp);
  for (const gauge of withTemp) {
    if (gauge.distanceMiles > 50) break;
    const waterbodyName = matchesSameWaterbody(spotWaterbody, gauge);
    if (!waterbodyName) continue;
    const reading = await usgsFetchFlow(gauge.siteId).catch(() => null);
    if (!reading || reading.waterTempF == null) continue;
    if (reading.waterTempF < 30 || reading.waterTempF > 95) continue;

    // Staleness gate: anchor only on readings within 48 hours. Older
    // than that and the water has had enough time to drift that a
    // hard anchor would mislead. (The pure-model estimate is still
    // returned without calibration in that case.)
    const ageHours = reading.waterTempObservedAt
      ? (Date.now() - new Date(reading.waterTempObservedAt).getTime()) /
        3_600_000
      : 0;
    if (ageHours > 48) continue;

    // Same distance taper as before; freshness modifier kicks in only
    // once a reading is meaningfully stale (2+ hours). A reading
    // taken hours ago is still a strong anchor — water temp moves
    // slowly — but past 24 h we start to discount.
    const baseWeight = Math.max(0, 1 - gauge.distanceMiles / 50);
    const freshness = ageHours <= 2 ? 1 : ageHours <= 24 ? 0.9 : 0.7;
    // Slightly lower weight than a same-water lake gauge — river temps
    // can shift quickly under sun / shade / dam releases.
    const weight = baseWeight * 0.85 * freshness;
    const blended = modeled * (1 - weight) + reading.waterTempF * weight;
    return {
      surfaceTempF: blended,
      siteId: gauge.siteId,
      distanceMiles: gauge.distanceMiles,
      gaugeF: reading.waterTempF,
      waterbodyName,
    };
  }
  return null;
}

// ---- Open-Meteo + math helpers (unchanged from the prior estimator) ------

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
  return Array.from(byDay.entries())
    .filter(([, v]) => v.n > 0)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => v.sum / v.n);
}

function seasonalOffsetF(doy: number): number {
  const radians = ((doy - 200) / 365) * 2 * Math.PI;
  const cosVal = Math.cos(radians);
  return cosVal >= 0 ? -6 * cosVal : -4 * cosVal;
}

function latitudeCorrectionF(lat: number, doy: number): number {
  const delta = lat - 40;
  const isWinterSpring = doy < 130 || doy > 320;
  if (isWinterSpring && delta > 2) return -0.7 * delta;
  if (delta < -2 && doy >= 150 && doy <= 250) return 0.4 * -delta;
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
