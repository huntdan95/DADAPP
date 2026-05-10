import { CardSection } from '@/components/ui/Card';
import { StatBlock } from '@/components/ui/StatBlock';
import { fetchFlow } from '@/lib/providers';
import type { FlowProvider } from '@/lib/providers/types';
import { formatRelativeTime } from '@/lib/utils';
import { useAsync } from './useAsync';
import { SectionStatus } from './SectionStatus';

export function FlowSection({ provider }: { provider: FlowProvider }) {
  const { state } = useAsync(
    () => fetchFlow(provider),
    [provider.kind, providerKey(provider)]
  );

  return (
    <CardSection label="Water">
      <SectionStatus state={state}>
        {(data) => (
          <div className="flex flex-col gap-3">
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
            <div className="text-xs text-muted">
              {data.siteName} ·{' '}
              {data.observedAt
                ? formatRelativeTime(data.observedAt)
                : 'no recent observation'}
              {data.notes && ` · ${data.notes}`}
            </div>
          </div>
        )}
      </SectionStatus>
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
