/**
 * Derive dam-generation status from the downstream USGS flow gauge.
 *
 * Idea: when no units are running, flow sits at "baseline" — the leak-by
 * + small spillage that keeps the river alive. When units come online,
 * flow jumps several multiples of baseline. We can read that jump off the
 * gauge in real time without scraping the dam authority.
 *
 * Thresholds are RATIO based (current / baseline) rather than absolute,
 * so the same code works on a tailwater with a 150 cfs baseline and one
 * with a 2000 cfs baseline. Tuning targets:
 *   < 1.5×  → no generation (wadeable)
 *   1.5-4× → partial / 1 unit (transitional, often best bite)
 *   4-8×   → heavy / 2 units
 *   > 8×   → very heavy / 3+ units (float-only)
 *
 * Returns 24 hourly slots (0-23) populated from the last ~3 days of
 * 15-minute IV readings, plus the most-recent status.
 */

interface UsgsIvResponse {
  value?: {
    timeSeries?: Array<{
      sourceInfo: { siteName: string; siteCode: Array<{ value: string }> };
      variable: { variableCode: Array<{ value: string }> };
      values: Array<{ value: Array<{ value: string; dateTime: string }> }>;
    }>;
  };
}

export interface InferredDamSchedule {
  /** 24 entries, index = local hour 0..23. null = no data covering that hour. */
  hourlyUnits: Array<number | null>;
  currentUnits: number | null;
  baselineCfs: number;
  observedAt: string | null;
  siteName: string;
}

const PARAM_FLOW = '00060';

export async function inferGenerationFromFlow(
  siteId: string,
  timezone: string
): Promise<InferredDamSchedule> {
  // 3 days of 15-min readings — generous enough to compute a stable
  // baseline even on a river that runs heavy for a stretch.
  const url =
    `https://waterservices.usgs.gov/nwis/iv/?format=json` +
    `&sites=${siteId}` +
    `&parameterCd=${PARAM_FLOW}` +
    `&period=P3D` +
    `&siteStatus=all`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`USGS HTTP ${res.status}`);
  const json = (await res.json()) as UsgsIvResponse;
  const ts = json.value?.timeSeries?.[0];
  if (!ts || ts.values[0]?.value.length === 0) {
    return {
      hourlyUnits: emptyHourly(),
      currentUnits: null,
      baselineCfs: 0,
      observedAt: null,
      siteName: ts?.sourceInfo.siteName ?? '',
    };
  }

  const readings = ts.values[0].value
    .map((v) => ({
      time: v.dateTime,
      cfs: v.value === '-999999' ? null : Number(v.value),
    }))
    .filter(
      (r): r is { time: string; cfs: number } =>
        r.cfs != null && Number.isFinite(r.cfs)
    );

  if (readings.length === 0) {
    return {
      hourlyUnits: emptyHourly(),
      currentUnits: null,
      baselineCfs: 0,
      observedAt: null,
      siteName: ts.sourceInfo.siteName,
    };
  }

  // Baseline = the 15th-percentile reading over the window. Robust to
  // brief generation pulses that would otherwise drag the median up.
  const sorted = [...readings.map((r) => r.cfs)].sort((a, b) => a - b);
  const baselineCfs = sorted[Math.floor(sorted.length * 0.15)] || sorted[0];

  // Group by local-hour, take the median ratio per hour. Two-day median
  // smooths out a single anomalous reading.
  const buckets: Array<number[]> = Array.from({ length: 24 }, () => []);
  for (const r of readings) {
    const h = hourInTz(new Date(r.time), timezone);
    buckets[h].push(r.cfs);
  }
  const hourlyUnits: Array<number | null> = buckets.map((vals) => {
    if (vals.length === 0) return null;
    const med = median(vals);
    return ratioToUnits(med / Math.max(1, baselineCfs));
  });

  // Most-recent reading drives "current".
  const last = readings[readings.length - 1];
  const currentUnits = ratioToUnits(last.cfs / Math.max(1, baselineCfs));

  return {
    hourlyUnits,
    currentUnits,
    baselineCfs,
    observedAt: last.time,
    siteName: ts.sourceInfo.siteName,
  };
}

function ratioToUnits(ratio: number): number {
  if (!Number.isFinite(ratio)) return 0;
  if (ratio < 1.5) return 0;
  if (ratio < 4) return 1;
  if (ratio < 8) return 2;
  return 3;
}

function median(vals: number[]): number {
  const sorted = [...vals].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function hourInTz(d: Date, timezone: string): number {
  const part = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    hourCycle: 'h23',
    timeZone: timezone,
  }).format(d);
  return parseInt(part, 10);
}

function emptyHourly(): Array<number | null> {
  return Array.from({ length: 24 }, () => null);
}
