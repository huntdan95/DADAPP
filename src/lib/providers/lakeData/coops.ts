import type { LakeReading } from '../types';

/**
 * NOAA CO-OPS (Center for Operational Oceanographic Products and
 * Services) water-temperature reader for shoreline / harbor sensors.
 *
 * These are the shore-attached stations that complement NDBC's
 * offshore buoys. Almost every Great Lakes harbor town has one
 * (St. Clair Shores, Ludington, Holland, Marblehead OH, etc.),
 * plus essentially every US tidal port.
 *
 * Endpoint:
 *   https://api.tidesandcurrents.noaa.gov/api/prod/datagetter
 *     ?product=water_temperature
 *     &station=<7-digit-id>
 *     &date=latest
 *     &units=english
 *     &time_zone=gmt
 *     &format=json
 *
 * Returns: most-recent water temp in Fahrenheit. CO-OPS doesn't
 * publish waves at these stations, so waveHeightFt stays null.
 * Wind comes from a different product (wind) — left for later if
 * we want to enrich. For now, temp is the actionable signal.
 */
const URL =
  'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter';

export async function coopsFetchLake(stationId: string): Promise<LakeReading> {
  const id = stationId.trim();
  if (!id) {
    return blank(id, 'No CO-OPS station ID configured.');
  }
  const params = new URLSearchParams({
    product: 'water_temperature',
    station: id,
    date: 'latest',
    units: 'english',
    time_zone: 'gmt',
    format: 'json',
  });
  let json: CoopsResponse;
  try {
    const res = await fetch(`${URL}?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    json = (await res.json()) as CoopsResponse;
  } catch (e) {
    return blank(
      id,
      `Could not reach CO-OPS (${String((e as Error)?.message ?? e)}).`
    );
  }

  // CO-OPS returns either `{ data: [...] }` on success or
  // `{ error: { message: ... } }` on failure (e.g., station offline).
  if (json.error?.message) {
    return blank(id, json.error.message);
  }
  const row = json.data?.[0];
  if (!row || !row.v) {
    return blank(id, 'CO-OPS returned no recent observation.');
  }
  const temp = Number(row.v);
  if (!Number.isFinite(temp)) {
    return blank(id, 'CO-OPS published a non-numeric value.');
  }
  // CO-OPS gives "t" as "YYYY-MM-DD HH:MM" in GMT; normalize to ISO.
  const observedAt = row.t
    ? `${row.t.replace(' ', 'T')}:00Z`
    : '';
  const siteName = json.metadata?.name
    ? `${json.metadata.name} (CO-OPS ${id})`
    : `CO-OPS ${id}`;

  return {
    siteName,
    observedAt,
    surfaceTempF: temp,
    waveHeightFt: null,
    windMph: null,
    authority: 'CO-OPS',
  };
}

function blank(stationId: string, note: string): LakeReading {
  return {
    siteName: stationId ? `CO-OPS ${stationId}` : 'CO-OPS station',
    observedAt: '',
    surfaceTempF: null,
    waveHeightFt: null,
    windMph: null,
    authority: 'CO-OPS',
    notes: note,
  };
}

interface CoopsResponse {
  metadata?: { id: string; name: string; lat: string; lon: string };
  data?: Array<{ t: string; v: string; s?: string; f?: string }>;
  error?: { message: string };
}
