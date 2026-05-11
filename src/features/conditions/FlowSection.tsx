import { useState } from 'react';
import { LineChart } from 'lucide-react';
import { CardSection } from '@/components/ui/Card';
import { StatBlock } from '@/components/ui/StatBlock';
import { fetchFlow } from '@/lib/providers';
import type { FlowProvider } from '@/lib/providers/types';
import { formatRelativeTime } from '@/lib/utils';
import { useAsync } from './useAsync';
import { SectionStatus } from './SectionStatus';
import { FlowDetailSheet } from './FlowDetailSheet';

export function FlowSection({ provider }: { provider: FlowProvider }) {
  const [detailOpen, setDetailOpen] = useState(false);

  const { state } = useAsync(
    () => fetchFlow(provider),
    [provider.kind, providerKey(provider)]
  );

  // Only USGS providers currently expose a multi-day series. For
  // env-canada / uk-ea we hide the tap affordance until those have
  // their own history endpoints wired in.
  const hasTrend = provider.kind === 'usgs';

  return (
    <CardSection label="Water">
      <SectionStatus state={state}>
        {(data) => (
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
                label="Water"
                value={
                  data.waterTempF != null
                    ? Math.round(data.waterTempF * 10) / 10
                    : '—'
                }
                unit="°F"
              />
            </div>
            {data.waterTempF != null && (
              <div className="text-xs text-accent">
                {waterTempHint(data.waterTempF)}
              </div>
            )}
            <div className="text-xs text-muted flex items-center gap-1.5">
              <span className="flex-1">
                {data.siteName} ·{' '}
                {data.observedAt
                  ? formatRelativeTime(data.observedAt)
                  : 'no recent observation'}
                {data.notes && ` · ${data.notes}`}
              </span>
              {hasTrend && (
                <span className="flex items-center gap-1 text-info text-[11px]">
                  <LineChart className="w-3 h-3" /> 7-day trend
                </span>
              )}
            </div>
          </button>
        )}
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
