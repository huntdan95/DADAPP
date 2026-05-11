import type { LakeReading } from '../types';

/**
 * NOAA NDBC buoy / coastal-marine station reader.
 *
 * Endpoint: https://www.ndbc.noaa.gov/data/realtime2/<station>.txt
 *
 * The response is a fixed-width text file. Lines:
 *   1. `# YY  MM DD hh mm WDIR WSPD ...` — column header
 *   2. `#yr  mo dy hr mn degT  m/s  ...` — column units
 *   3. Most-recent obs row (we use this)
 *   4..N. Older obs (45-day history)
 *
 * Columns vary by station type — some buoys publish wave height,
 * others don't. We tolerate missing columns and surface what's there.
 *
 * Direct CORS: NDBC realtime2 supports browser fetches without
 * preflight, so this works from the SPA without a proxy.
 *
 * Missing-value sentinels in NDBC are "MM" (most fields) or "99" /
 * "999" / "9999" depending on column — we treat any non-numeric
 * token as null, then sanity-check obviously-bogus magnitudes.
 */

const MPS_TO_MPH = 2.23694;
const M_TO_FT = 3.28084;

/**
 * Fetch the most recent buoy observation. Returns nulls for any field
 * the station doesn't report — the UI hides those cells.
 */
export async function ndbcFetchLake(stationId: string): Promise<LakeReading> {
  const id = stationId.trim();
  if (!id) {
    return {
      siteName: 'NDBC station',
      observedAt: '',
      surfaceTempF: null,
      waveHeightFt: null,
      windMph: null,
      authority: 'NDBC',
      notes: 'No station ID configured.',
    };
  }
  const url = `https://www.ndbc.noaa.gov/data/realtime2/${id.toUpperCase()}.txt`;
  let text: string;
  try {
    const res = await fetch(url, { headers: { Accept: 'text/plain' } });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    text = await res.text();
  } catch (e) {
    return {
      siteName: `NDBC ${id.toUpperCase()}`,
      observedAt: '',
      surfaceTempF: null,
      waveHeightFt: null,
      windMph: null,
      authority: 'NDBC',
      notes: `Could not reach NDBC (${String((e as Error)?.message ?? e)}).`,
    };
  }
  return parseRealtime2(text, id.toUpperCase());
}

/**
 * Parser for NDBC realtime2 text. Exported for unit tests; UI uses
 * `ndbcFetchLake`. Returns a partial reading if no data rows are
 * found — caller surfaces it to the UI rather than throwing.
 */
export function parseRealtime2(text: string, stationId: string): LakeReading {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length < 3) {
    return {
      siteName: `NDBC ${stationId}`,
      observedAt: '',
      surfaceTempF: null,
      waveHeightFt: null,
      windMph: null,
      authority: 'NDBC',
      notes: 'NDBC returned no recent observations.',
    };
  }
  // Header line begins with '#'. Strip it to get column names.
  const headerCols = lines[0].replace(/^#\s*/, '').split(/\s+/);
  // First data line is the third overall (after header + unit row).
  // Some stations include extra unit rows — walk forward until we
  // find a row that doesn't start with '#'.
  let dataLine: string | null = null;
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].startsWith('#')) {
      dataLine = lines[i];
      break;
    }
  }
  if (!dataLine) {
    return {
      siteName: `NDBC ${stationId}`,
      observedAt: '',
      surfaceTempF: null,
      waveHeightFt: null,
      windMph: null,
      authority: 'NDBC',
      notes: 'NDBC returned only headers.',
    };
  }
  const cols = dataLine.split(/\s+/);
  const valueOf = (name: string): string | null => {
    const i = headerCols.indexOf(name);
    if (i < 0 || i >= cols.length) return null;
    const raw = cols[i];
    if (!raw || raw === 'MM' || raw === '99' || raw === '999' || raw === '9999') {
      return null;
    }
    return raw;
  };

  const yr = valueOf('YY') ?? valueOf('YYYY');
  const mo = valueOf('MM');
  const dy = valueOf('DD');
  const hr = valueOf('hh');
  const mn = valueOf('mm') ?? '00';

  // Build ISO UTC timestamp. NDBC times are UTC by definition.
  let observedAt = '';
  if (yr && mo && dy && hr) {
    const year = yr.length === 2 ? `20${yr}` : yr;
    observedAt = `${year}-${mo.padStart(2, '0')}-${dy.padStart(2, '0')}T${hr.padStart(2, '0')}:${mn.padStart(2, '0')}:00Z`;
  }

  const wtmpC = numeric(valueOf('WTMP'));
  const wvhtM = numeric(valueOf('WVHT'));
  const wspdMps = numeric(valueOf('WSPD'));

  const surfaceTempF = wtmpC != null ? cToF(wtmpC) : null;
  const waveHeightFt = wvhtM != null ? wvhtM * M_TO_FT : null;
  const windMph = wspdMps != null ? wspdMps * MPS_TO_MPH : null;

  const hasAny =
    surfaceTempF != null || waveHeightFt != null || windMph != null;

  return {
    siteName: `NDBC ${stationId}`,
    observedAt,
    surfaceTempF,
    waveHeightFt,
    windMph,
    authority: 'NDBC',
    notes: hasAny
      ? undefined
      : 'NDBC has the station but no recent values were published.',
  };
}

function numeric(s: string | null): number | null {
  if (s == null) return null;
  const n = Number(s);
  if (!Number.isFinite(n)) return null;
  // Many stations publish "999" / "99.0" sentinel — guard.
  if (Math.abs(n) >= 999) return null;
  return n;
}

function cToF(c: number): number {
  return c * 1.8 + 32;
}
