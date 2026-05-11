/**
 * Pulls the last N days of USGS instantaneous-value flow at a site.
 * Used by the flow-detail sheet to render a sparkline trend chart.
 *
 * Note on forecasts: NOAA AHPS publishes 5-day flow forecasts at a
 * subset of USGS gauges, keyed by an NWS gauge code (different from
 * the USGS site number). We don't currently have a site→AHPS mapping;
 * adding that is a TODO. For now we surface "what's been happening"
 * over the past week, which is what most anglers actually want.
 */

export interface FlowSample {
  time: string;       // ISO
  flowCfs: number;
}

const IV_URL = 'https://waterservices.usgs.gov/nwis/iv/';

export async function fetchUsgsFlowSeries(
  siteId: string,
  periodDays = 7
): Promise<FlowSample[]> {
  const params = new URLSearchParams({
    format: 'json',
    sites: siteId,
    parameterCd: '00060',                  // discharge cfs
    period: `P${periodDays}D`,
    siteStatus: 'all',
  });
  const res = await fetch(`${IV_URL}?${params.toString()}`);
  if (!res.ok) throw new Error(`USGS history HTTP ${res.status}`);
  const json = (await res.json()) as {
    value?: {
      timeSeries?: Array<{
        variable?: { variableCode?: Array<{ value?: string }> };
        values?: Array<{
          value?: Array<{ value?: string; dateTime?: string }>;
        }>;
      }>;
    };
  };
  const series = json.value?.timeSeries ?? [];
  const flowSeries = series.find(
    (s) => s.variable?.variableCode?.[0]?.value === '00060'
  );
  const points = flowSeries?.values?.[0]?.value ?? [];
  const samples: FlowSample[] = [];
  for (const p of points) {
    const v = Number(p.value);
    if (!Number.isFinite(v) || v < 0) continue;
    if (!p.dateTime) continue;
    samples.push({ time: p.dateTime, flowCfs: v });
  }
  return samples;
}
