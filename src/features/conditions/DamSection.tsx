import { CardSection } from '@/components/ui/Card';
import { fetchDamSchedule } from '@/lib/providers';
import type { DamScheduleProvider } from '@/lib/providers/types';
import { useAsync } from './useAsync';
import { SectionStatus } from './SectionStatus';
import { cn } from '@/lib/utils';

export function DamSection({ provider }: { provider: DamScheduleProvider }) {
  const { state } = useAsync(
    () => fetchDamSchedule(provider),
    [provider.kind, providerKey(provider)]
  );

  return (
    <CardSection label="Dam Generation">
      <SectionStatus state={state}>
        {(data) => (
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-24 gap-[2px]">
              {data.hourlyUnits.map((units, hour) => (
                <div
                  key={hour}
                  title={`${hour}:00 — ${units == null ? 'unknown' : `${units} unit(s)`}`}
                  className={cn(
                    'h-6 rounded-sm',
                    units == null
                      ? 'bg-surface-2'
                      : units === 0
                      ? 'bg-accent/70'
                      : units === 1
                      ? 'bg-warn/70'
                      : 'bg-danger/70'
                  )}
                />
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-muted px-0.5">
              <span>12a</span>
              <span>6a</span>
              <span>noon</span>
              <span>6p</span>
              <span>11p</span>
            </div>
            <div className="text-xs text-muted">
              {data.damName} ({data.authority})
              {data.source && ` · ${data.source}`}
            </div>
          </div>
        )}
      </SectionStatus>
    </CardSection>
  );
}

function providerKey(p: DamScheduleProvider): string {
  switch (p.kind) {
    case 'tva':
      return p.dam;
    case 'usace':
      return `${p.district}/${p.project}`;
    case 'consumers-energy':
      return p.dam;
    case 'manual':
      return 'manual';
  }
}
