import { fetchFlow, fetchWeather } from '@/lib/providers';
import type { Location } from '@/lib/providers/types';
import type { ConditionsSnapshot } from '@/lib/journal/types';
import { computeSolunar } from '@/lib/solunar';
import { nearestUsgsGauge } from '@/lib/geo/reverseGeocode';
import { usgsFetchFlow } from '@/lib/providers/flow/usgs';

/**
 * Captures a denormalized conditions snapshot at a GPS point. Used when
 * logging a catch/hatch from the field — we need conditions even when
 * the user hasn't pre-defined a location for the spot.
 *
 * Each step is best-effort; a failed lookup leaves the field undefined.
 */
export async function snapshotForGps(
  gps: { lat: number; lng: number },
  timezone: string
): Promise<{
  conditions: ConditionsSnapshot;
  flowReading?: {
    siteId: string;
    siteName: string;
    flowCfs?: number;
    gaugeFt?: number;
    waterTempF?: number;
    observedAt?: string;
  };
}> {
  // Fabricate a minimal Location so the provider modules accept it.
  const fakeLoc: Location = {
    id: 'snapshot',
    name: 'snapshot',
    state: 'XX',
    country: 'US',
    type: 'freestone',
    lat: gps.lat,
    lng: gps.lng,
    timezone,
    dataProviders: { weather: { kind: 'open-meteo' } },
  };

  const [weather, gauge] = await Promise.all([
    fetchWeather({ kind: 'open-meteo' }, fakeLoc).catch(() => undefined),
    nearestUsgsGauge(gps.lat, gps.lng).catch(() => null),
  ]);

  let flowReading;
  if (gauge) {
    const reading = await usgsFetchFlow(gauge.siteId).catch(() => null);
    if (reading) {
      flowReading = {
        siteId: gauge.siteId,
        siteName: reading.siteName || gauge.name,
        flowCfs: reading.flowCfs ?? undefined,
        gaugeFt: reading.gaugeFt ?? undefined,
        waterTempF: reading.waterTempF ?? undefined,
        observedAt: reading.observedAt || undefined,
      };
    }
  }

  const solunar = computeSolunar(fakeLoc);

  const conditions: ConditionsSnapshot = {
    airTempF: weather?.airTempF ?? Number.NaN,
    waterTempF: flowReading?.waterTempF,
    flowCfs: flowReading?.flowCfs,
    pressureMb: weather?.pressureMb ?? Number.NaN,
    pressureTrend: weather?.pressureTrend ?? 'steady',
    weatherCode: weather?.weatherCode ?? 0,
    cloudCoverPct: weather?.cloudCoverPct ?? undefined,
    windMph: weather?.windMph ?? undefined,
    moonPhase: solunar.moonPhase,
    moonIllumination: solunar.moonIllumination,
  };

  return { conditions, flowReading };
}

/**
 * Captures a snapshot for a pre-defined Location instead of a raw GPS
 * point. Uses the location's declared flow provider directly (if any),
 * which means tailwaters get the right gauge — not whatever happens to
 * be physically nearest the user's phone.
 */
export async function snapshotForLocation(
  location: Location
): Promise<{
  conditions: ConditionsSnapshot;
  flowReading?: {
    siteId: string;
    siteName: string;
    flowCfs?: number;
    gaugeFt?: number;
    waterTempF?: number;
    observedAt?: string;
  };
}> {
  const [weather, flow] = await Promise.all([
    fetchWeather(location.dataProviders.weather, location).catch(() => undefined),
    location.dataProviders.flow
      ? fetchFlow(location.dataProviders.flow).catch(() => undefined)
      : Promise.resolve(undefined),
  ]);

  let flowReading;
  if (flow) {
    flowReading = {
      siteId:
        location.dataProviders.flow?.kind === 'usgs'
          ? location.dataProviders.flow.siteId
          : 'unknown',
      siteName: flow.siteName || location.name,
      flowCfs: flow.flowCfs ?? undefined,
      gaugeFt: flow.gaugeFt ?? undefined,
      waterTempF: flow.waterTempF ?? undefined,
      observedAt: flow.observedAt || undefined,
    };
  }

  const solunar = computeSolunar(location);
  const conditions: ConditionsSnapshot = {
    airTempF: weather?.airTempF ?? Number.NaN,
    waterTempF: flowReading?.waterTempF,
    flowCfs: flowReading?.flowCfs,
    pressureMb: weather?.pressureMb ?? Number.NaN,
    pressureTrend: weather?.pressureTrend ?? 'steady',
    weatherCode: weather?.weatherCode ?? 0,
    cloudCoverPct: weather?.cloudCoverPct ?? undefined,
    windMph: weather?.windMph ?? undefined,
    moonPhase: solunar.moonPhase,
    moonIllumination: solunar.moonIllumination,
  };
  return { conditions, flowReading };
}

/**
 * Promise-based wrapper around navigator.geolocation with a sensible timeout.
 * Falls back to (null) instead of rejecting on permission denial.
 */
export function getDeviceGps(
  timeoutMs = 8000
): Promise<{ lat: number; lng: number } | null> {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) {
      resolve(null);
      return;
    }
    let settled = false;
    const t = setTimeout(() => {
      if (settled) return;
      settled = true;
      resolve(null);
    }, timeoutMs);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (settled) return;
        settled = true;
        clearTimeout(t);
        resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        if (settled) return;
        settled = true;
        clearTimeout(t);
        resolve(null);
      },
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 30_000 }
    );
  });
}

/** Nearest saved Location by haversine distance, capped at maxMiles. */
export function nearestSavedLocation(
  gps: { lat: number; lng: number },
  locations: Location[],
  maxMiles = 3
): Location | null {
  if (locations.length === 0) return null;
  let best: { loc: Location; miles: number } | null = null;
  for (const loc of locations) {
    const m = haversineMiles(gps, { lat: loc.lat, lng: loc.lng });
    if (m > maxMiles) continue;
    if (!best || m < best.miles) best = { loc, miles: m };
  }
  return best?.loc ?? null;
}

function haversineMiles(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
