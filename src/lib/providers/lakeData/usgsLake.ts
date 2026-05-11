import { celsiusToF } from '@/lib/utils';
import type { LakeReading } from '../types';

/**
 * USGS instantaneous-values reader for lake / reservoir gauges.
 *
 * Many lakes (Lake Cumberland, Center Hill, Norris, Dale Hollow, etc.)
 * have USGS sites that publish water temp + reservoir elevation but
 * NOT discharge — so they're a poor fit for the FlowProvider story.
 * This provider asks specifically for the lake-relevant parameters
 * and reports whatever the site exposes.
 *
 * Parameter codes:
 *   00010 — water temperature, °C  (convert to °F)
 *   00062 — lake/reservoir elevation above NGVD29 datum, ft
 *   00065 — gauge height, ft (some lakes only publish this)
 *   62614 — reservoir elevation above NAVD88 datum, ft (newer)
 *
 * Returns a partial reading rather than throwing when the site is
 * known but currently empty — same posture as the flow reader.
 */
const IV_URL = 'https://waterservices.usgs.gov/nwis/iv/';

const PARAMS = ['00010', '00062', '00065', '62614'];

export async function usgsLakeFetch(siteId: string): Promise<LakeReading> {
  const id = siteId.trim();
  if (!id) {
    return blank(id, 'No USGS site ID configured.');
  }
  const params = new URLSearchParams({
    format: 'json',
    sites: id,
    parameterCd: PARAMS.join(','),
    siteStatus: 'all',
  });
  let json: UsgsResponse;
  try {
    const res = await fetch(`${IV_URL}?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    json = (await res.json()) as UsgsResponse;
  } catch (e) {
    return blank(id, `Could not reach USGS (${String((e as Error)?.message ?? e)}).`);
  }

  const series = json.value?.timeSeries ?? [];
  if (series.length === 0) {
    return blank(id, 'USGS has the gauge but no recent lake-parameter data.');
  }

  let surfaceTempF: number | null = null;
  let elevationFt: number | null = null;
  let gaugeFt: number | null = null;
  let observedAt = '';
  let siteName = '';
  const missing: string[] = [];

  for (const ts of series) {
    const code = ts.variable.variableCode[0]?.value;
    const valueArr = ts.values[0]?.value ?? [];
    const last = valueArr[valueArr.length - 1];
    siteName = ts.sourceInfo.siteName;
    if (!last || last.value === '-999999' || last.value === '') {
      missing.push(paramLabel(code));
      continue;
    }
    const num = Number(last.value);
    if (!Number.isFinite(num)) {
      missing.push(paramLabel(code));
      continue;
    }
    if (!observedAt || last.dateTime > observedAt) observedAt = last.dateTime;

    if (code === '00010') {
      surfaceTempF = celsiusToF(num);
    } else if (code === '00062' || code === '62614') {
      elevationFt = num;
    } else if (code === '00065') {
      gaugeFt = num;
    }
  }

  // Use gauge-height as elevation fallback if no datum'd elevation
  // (some reservoir sites only publish 00065). Hidden field in the
  // UI either way — surfaced as "elevation" since the user just
  // wants a level number.
  if (elevationFt == null && gaugeFt != null) elevationFt = gaugeFt;

  return {
    siteName: siteName || `USGS ${id}`,
    observedAt,
    surfaceTempF,
    waveHeightFt: null,                // USGS doesn't measure waves
    windMph: null,                     // USGS lake gauges don't carry wind
    elevationFt,
    authority: 'USGS',
    notes: missing.length > 0 ? `No live: ${missing.join(', ')}` : undefined,
  };
}

function blank(siteId: string, note: string): LakeReading {
  return {
    siteName: siteId ? `USGS ${siteId}` : 'USGS lake',
    observedAt: '',
    surfaceTempF: null,
    waveHeightFt: null,
    windMph: null,
    elevationFt: null,
    authority: 'USGS',
    notes: note,
  };
}

function paramLabel(code: string | undefined): string {
  switch (code) {
    case '00010':
      return 'water temp';
    case '00062':
    case '62614':
      return 'lake elevation';
    case '00065':
      return 'gauge height';
    default:
      return code ?? 'unknown';
  }
}

interface UsgsResponse {
  value: {
    timeSeries: Array<{
      sourceInfo: { siteName: string; siteCode: Array<{ value: string }> };
      variable: {
        variableCode: Array<{ value: string }>;
        variableDescription: string;
      };
      values: Array<{
        value: Array<{ value: string; dateTime: string }>;
      }>;
    }>;
  };
}
