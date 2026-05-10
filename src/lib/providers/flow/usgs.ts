import { celsiusToF } from '@/lib/utils';
import type { FlowReading } from '../types';

const IV_URL = 'https://waterservices.usgs.gov/nwis/iv/';

const PARAM_WATER_TEMP_C = '00010';
const PARAM_FLOW_CFS = '00060';
const PARAM_GAUGE_FT = '00065';

export async function usgsFetchFlow(siteId: string): Promise<FlowReading> {
  const params = new URLSearchParams({
    format: 'json',
    sites: siteId,
    parameterCd: [PARAM_WATER_TEMP_C, PARAM_FLOW_CFS, PARAM_GAUGE_FT].join(','),
    siteStatus: 'all',
  });

  const res = await fetch(`${IV_URL}?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`USGS HTTP ${res.status}`);
  }
  const json = (await res.json()) as UsgsResponse;
  const series = json.value?.timeSeries ?? [];

  if (series.length === 0) {
    throw new Error(
      `USGS gauge ${siteId} returned no time series — check that the site is active and publishes IV data`
    );
  }

  let waterTempF: number | null = null;
  let flowCfs: number | null = null;
  let gaugeFt: number | null = null;
  let observedAt = '';
  let siteName = '';
  let unavailableParams: string[] = [];

  for (const ts of series) {
    const code = ts.variable.variableCode[0]?.value;
    const valueArr = ts.values[0]?.value ?? [];
    const last = valueArr[valueArr.length - 1];
    siteName = ts.sourceInfo.siteName;

    if (!last) {
      unavailableParams.push(paramLabel(code));
      continue;
    }
    if (last.value === '-999999' || last.value === '') {
      // USGS sentinel for missing.
      unavailableParams.push(paramLabel(code));
      continue;
    }
    const num = Number(last.value);
    if (!observedAt || last.dateTime > observedAt) observedAt = last.dateTime;

    if (code === PARAM_WATER_TEMP_C) {
      waterTempF = celsiusToF(num);
    } else if (code === PARAM_FLOW_CFS) {
      flowCfs = num;
    } else if (code === PARAM_GAUGE_FT) {
      gaugeFt = num;
    }
  }

  return {
    observedAt,
    siteName,
    flowCfs,
    gaugeFt,
    waterTempF,
    notes:
      unavailableParams.length > 0
        ? `No live data for: ${unavailableParams.join(', ')}`
        : undefined,
  };
}

function paramLabel(code: string | undefined): string {
  switch (code) {
    case PARAM_WATER_TEMP_C:
      return 'water temp';
    case PARAM_FLOW_CFS:
      return 'flow';
    case PARAM_GAUGE_FT:
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
