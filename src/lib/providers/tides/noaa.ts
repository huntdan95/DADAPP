import type { TidesReading } from '../types';

/**
 * NOAA Tides & Currents — free, no key, US coastal coverage.
 *
 * Endpoint: https://api.tidesandcurrents.noaa.gov/api/prod/datagetter
 * We pull the next 48 hours of high/low predictions for the configured
 * station and parse the returned ISO timestamps.
 */
export async function noaaFetchTides(stationId: string): Promise<TidesReading> {
  const start = new Date();
  const end = new Date(Date.now() + 48 * 60 * 60 * 1000);
  const params = new URLSearchParams({
    station: stationId,
    product: 'predictions',
    datum: 'MLLW',
    time_zone: 'lst_ldt',
    interval: 'hilo',
    format: 'json',
    begin_date: fmtDate(start),
    end_date: fmtDate(end),
    units: 'english',
  });
  const res = await fetch(
    `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?${params.toString()}`
  );
  if (!res.ok) {
    throw new Error(`NOAA tides HTTP ${res.status}`);
  }
  const json = (await res.json()) as {
    predictions?: Array<{ t: string; v: string; type: 'H' | 'L' }>;
    error?: { message: string };
  };
  if (json.error) {
    throw new Error(`NOAA tides: ${json.error.message}`);
  }
  const events = (json.predictions ?? []).map((p) => ({
    // NOAA returns "YYYY-MM-DD HH:MM" in LST/LDT. Treat as the station's
    // local time. We surface the raw string — UI formats with its own tz.
    time: p.t.replace(' ', 'T'),
    type: p.type,
    heightFt: Number(p.v),
  }));
  return { stationId, events };
}

function fmtDate(d: Date): string {
  // YYYYMMDD
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}${m}${day}`;
}
