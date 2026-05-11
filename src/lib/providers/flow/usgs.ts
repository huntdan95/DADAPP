import { celsiusToF } from '@/lib/utils';
import type { FlowReading } from '../types';

const IV_URL = 'https://waterservices.usgs.gov/nwis/iv/';

const PARAM_WATER_TEMP_C = '00010';
const PARAM_FLOW_CFS = '00060';
const PARAM_GAUGE_FT = '00065';

/**
 * USGS publishes IV (instantaneous-values) data every 15-60 minutes,
 * but sensors briefly drop out — a thermistor that's normally reading
 * every 30 min can go offline for an hour and leave the latest
 * timestamp as the missing-data sentinel (-999999). We don't want to
 * say "water temp unavailable" when there's a perfectly good reading
 * from 90 minutes earlier in the same response.
 *
 * Fix: walk the array BACKWARDS and return the most recent valid
 * reading per param, with its actual timestamp. Anything within 48 h
 * is fine to surface as "current"; the UI prints the age so the user
 * sees freshness at a glance.
 *
 * We also fetch P2D (last 2 days) instead of the implicit default so
 * yesterday's data is always present in the response — this is what
 * the estimator's same-waterbody calibration anchors against.
 */
export async function usgsFetchFlow(siteId: string): Promise<FlowReading> {
  const params = new URLSearchParams({
    format: 'json',
    sites: siteId,
    parameterCd: [PARAM_WATER_TEMP_C, PARAM_FLOW_CFS, PARAM_GAUGE_FT].join(','),
    siteStatus: 'all',
    period: 'P2D', // 2-day window — covers yesterday + a stale-sensor cushion
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
  let observedAt = '';                              // overall newest reading
  let waterTempObservedAt = '';                     // per-param staleness
  let siteName = '';
  const unavailableParams: string[] = [];

  for (const ts of series) {
    const code = ts.variable.variableCode[0]?.value;
    const valueArr = ts.values[0]?.value ?? [];
    siteName = ts.sourceInfo.siteName;

    const found = findMostRecentValid(valueArr);
    if (!found) {
      unavailableParams.push(paramLabel(code));
      continue;
    }
    if (!observedAt || found.dateTime > observedAt) {
      observedAt = found.dateTime;
    }
    if (code === PARAM_WATER_TEMP_C) {
      waterTempF = celsiusToF(found.value);
      waterTempObservedAt = found.dateTime;
    } else if (code === PARAM_FLOW_CFS) {
      flowCfs = found.value;
    } else if (code === PARAM_GAUGE_FT) {
      gaugeFt = found.value;
    }
  }

  // Per-param staleness note. If water temp is meaningfully older than
  // "now" (the gauge usually reports every 15-60 min), call it out so
  // the user knows they're seeing yesterday's number — not a current
  // observation. Threshold tuned to be quiet for normal cadence noise
  // (under ~2 h is "current enough"), informative when a sensor has
  // been dark for hours.
  const notes: string[] = [];
  if (unavailableParams.length > 0) {
    notes.push(`No live data for: ${unavailableParams.join(', ')}`);
  }
  if (waterTempObservedAt && waterTempF != null) {
    const ageHours =
      (Date.now() - new Date(waterTempObservedAt).getTime()) / 3_600_000;
    if (ageHours > 2) {
      notes.push(
        `Water temp from ${formatAgeShort(ageHours)} ago (sensor briefly offline)`
      );
    }
  }

  return {
    observedAt,
    siteName,
    flowCfs,
    gaugeFt,
    waterTempF,
    waterTempObservedAt: waterTempObservedAt || undefined,
    notes: notes.length > 0 ? notes.join(' · ') : undefined,
  };
}

/**
 * Walks the IV value array from newest → oldest and returns the first
 * entry whose value is real (not USGS's `-999999` missing sentinel,
 * not empty). The array is sorted oldest-first by USGS, so we iterate
 * in reverse.
 */
function findMostRecentValid(
  valueArr: Array<{ value: string; dateTime: string }>
): { value: number; dateTime: string } | null {
  for (let i = valueArr.length - 1; i >= 0; i--) {
    const entry = valueArr[i];
    if (!entry || !entry.value) continue;
    if (entry.value === '-999999' || entry.value === '') continue;
    const num = Number(entry.value);
    if (!Number.isFinite(num)) continue;
    return { value: num, dateTime: entry.dateTime };
  }
  return null;
}

function formatAgeShort(hours: number): string {
  if (hours < 24) return `${Math.round(hours)} h`;
  const days = hours / 24;
  if (days < 7) return `${Math.round(days)} d`;
  return `${Math.round(days)}d`;
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
