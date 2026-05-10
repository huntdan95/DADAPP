/**
 * Find the N closest NOAA tide-prediction stations to a pin.
 *
 * Pulls the full station list from NOAA's metadata API once per session
 * (it's ~3K entries, small JSON), then filters / sorts client-side.
 * Endpoint: https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?type=tidepredictions
 *
 * Free, no key, US coastal coverage. Same authority that powers the
 * tide-data lookups in `lib/providers/tides/noaa.ts`.
 */

export interface NearbyTideStation {
  stationId: string;
  name: string;
  state: string | null;
  lat: number;
  lng: number;
  distanceMiles: number;
}

interface RawStation {
  id: string;
  name: string;
  state?: string;
  lat: number;
  lng: number;
}

let cached: RawStation[] | null = null;
let cachedAt = 0;
const CACHE_MS = 24 * 60 * 60 * 1000;        // 24h is plenty — list rarely changes

async function loadStations(): Promise<RawStation[]> {
  if (cached && Date.now() - cachedAt < CACHE_MS) return cached;
  const url =
    'https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?type=tidepredictions';
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`NOAA stations HTTP ${res.status}`);
  const json = (await res.json()) as {
    stations?: Array<{
      id: string;
      name: string;
      state?: string;
      lat: number;
      lng: number;
      tidepredoffsets?: unknown;
    }>;
  };
  cached = (json.stations ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    state: s.state,
    lat: s.lat,
    lng: s.lng,
  }));
  cachedAt = Date.now();
  return cached;
}

export async function nearestTideStations(
  lat: number,
  lng: number,
  limit = 3
): Promise<NearbyTideStation[]> {
  const list = await loadStations();
  const ranked = list
    .map((s) => ({
      stationId: s.id,
      name: s.name,
      state: s.state ?? null,
      lat: s.lat,
      lng: s.lng,
      distanceMiles: distMiles({ lat, lng }, { lat: s.lat, lng: s.lng }),
    }))
    .sort((a, b) => a.distanceMiles - b.distanceMiles)
    .slice(0, limit);
  return ranked;
}

function distMiles(
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
