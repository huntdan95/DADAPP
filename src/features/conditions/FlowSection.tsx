import { useState } from 'react';
import { LineChart, Sparkles } from 'lucide-react';
import { CardSection } from '@/components/ui/Card';
import { StatBlock } from '@/components/ui/StatBlock';
import { fetchFlow } from '@/lib/providers';
import type { FlowProvider, Location } from '@/lib/providers/types';
import { estimateWaterTemp } from '@/lib/providers/waterTemp/estimator';
import { formatRelativeTime } from '@/lib/utils';
import { useAsync } from './useAsync';
import { SectionStatus } from './SectionStatus';
import { FlowDetailSheet } from './FlowDetailSheet';

export function FlowSection({
  provider,
  location,
}: {
  provider: FlowProvider;
  location: Location;
}) {
  const [detailOpen, setDetailOpen] = useState(false);

  // Combined fetch — gauge first, estimator as fallback when the gauge
  // doesn't publish a water-temp sensor. Both calls run in parallel
  // when needed but the gauge result wins for the temp number unless
  // it's null.
  const { state } = useAsync(
    async () => {
      const flow = await fetchFlow(provider);
      if (flow.waterTempF != null) {
        return { flow, estimatedTempF: null as number | null, estimatedNotes: '' };
      }
      // Gauge has no thermistor — estimate from air-temp model. Same
      // model that lakes use, gated to same-waterbody calibration so
      // we don't mix river basins.
      const est = await estimateWaterTemp(location.lat, location.lng).catch(
        () => null
      );
      return {
        flow,
        estimatedTempF: est?.surfaceTempF ?? null,
        estimatedNotes: est?.notes ?? '',
      };
    },
    [provider.kind, providerKey(provider), location.lat, location.lng]
  );

  // Only USGS providers currently expose a multi-day series. For
  // env-canada / uk-ea we hide the tap affordance until those have
  // their own history endpoints wired in.
  const hasTrend = provider.kind === 'usgs';

  return (
    <CardSection label="Water">
      <SectionStatus state={state}>
        {({ flow: data, estimatedTempF, estimatedNotes }) => {
          // Effective water temp: real gauge value when present, else
          // the estimator's output. Either way the user always sees a
          // number when one is achievable.
          const effectiveTempF =
            data.waterTempF != null ? data.waterTempF : estimatedTempF;
          const tempIsEstimated =
            data.waterTempF == null && estimatedTempF != null;
          return (
            <button
              type="button"
              onClick={() => hasTrend && setDetailOpen(true)}
              disabled={!hasTrend}
              className={
                'w-full text-left flex flex-col gap-3 ' +
                (hasTrend
                  ? 'rounded-lg -m-1 p-1 hover:bg-surface-2/40 transition cursor-pointer'
                  : '')
              }
              aria-label={hasTrend ? 'Show 7-day flow trend' : undefined}
            >
              <div className="grid grid-cols-3 gap-4">
                <StatBlock
                  label="Flow"
                  value={data.flowCfs != null ? Math.round(data.flowCfs) : '—'}
                  unit="cfs"
                  emphasis="big"
                />
                <StatBlock
                  label="Gauge"
                  value={data.gaugeFt != null ? data.gaugeFt.toFixed(2) : '—'}
                  unit="ft"
                />
                <StatBlock
                  label={tempIsEstimated ? 'Water · est.' : 'Water'}
                  value={
                    effectiveTempF != null
                      ? Math.round(effectiveTempF * 10) / 10
                      : '—'
                  }
                  unit="°F"
                />
              </div>
              {effectiveTempF != null && (
                <div className="text-xs text-accent flex items-start gap-1.5">
                  {tempIsEstimated && (
                    <Sparkles className="w-3 h-3 mt-0.5 flex-none text-warn" />
                  )}
                  <span>{waterTempHint(effectiveTempF)}</span>
                </div>
              )}
              <div className="text-xs text-muted flex items-center gap-1.5">
                <span className="flex-1">
                  {data.siteName} ·{' '}
                  {data.observedAt
                    ? formatRelativeTime(data.observedAt)
                    : 'no recent observation'}
                  {data.notes && ` · ${data.notes}`}
                  {tempIsEstimated && estimatedNotes && (
                    <>
                      {' · '}
                      <span className="text-warn/80">
                        Water temp: {estimatedNotes}
                      </span>
                    </>
                  )}
                </span>
                {hasTrend && (
                  <span className="flex items-center gap-1 text-info text-[11px]">
                    <LineChart className="w-3 h-3" /> 7-day trend
                  </span>
                )}
              </div>
            </button>
          );
        }}
      </SectionStatus>
      <FlowDetailSheet
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        provider={detailOpen ? provider : null}
      />
    </CardSection>
  );
}

function providerKey(p: FlowProvider): string {
  switch (p.kind) {
    case 'usgs':
      return p.siteId;
    case 'env-canada':
      return p.stationId;
    case 'uk-ea':
      return p.stationRef;
  }
}

/**
 * Plain-English hint for what the current water temp means for trout.
 * Mirrors the briefing-prompt heuristics so the passive card and the
 * AI briefing say compatible things.
 */
function waterTempHint(tempF: number): string {
  if (tempF < 38) return 'Cold — fish lethargic; tiny midges, slow drifts.';
  if (tempF < 45) return 'Cool — nymphing weather; few risers.';
  if (tempF <= 65) return 'Prime trout zone — whole-day potential.';
  if (tempF <= 70) return 'Warm — fish early or late; release fast.';
  return 'Hot — stress zone; please avoid targeting trout.';
}
