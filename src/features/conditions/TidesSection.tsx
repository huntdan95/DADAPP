import { ArrowDown, ArrowUp } from 'lucide-react';
import { CardSection } from '@/components/ui/Card';
import { fetchTides } from '@/lib/providers';
import type { Location, TidesProvider } from '@/lib/providers/types';
import { useAsync } from './useAsync';
import { SectionStatus } from './SectionStatus';

/**
 * High/low tide schedule for saltwater locations. Pulls 48 hours of
 * predictions from NOAA and groups them by local day so the user sees
 * "today" + "tomorrow" tides at a glance.
 */
export function TidesSection({
  provider,
  location,
}: {
  provider: TidesProvider;
  location: Location;
}) {
  const { state } = useAsync(
    () => fetchTides(provider),
    [provider.kind, provider.stationId]
  );

  const timeFmt = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: location.timezone,
  });
  const dayFmt = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: location.timezone,
  });

  return (
    <CardSection label="Tides">
      <SectionStatus state={state}>
        {(data) => {
          if (data.events.length === 0) {
            return (
              <div className="text-sm text-muted">
                No predictions available for this station.
              </div>
            );
          }
          const grouped = groupByDay(data.events, location.timezone);
          return (
            <div className="flex flex-col gap-3">
              {grouped.slice(0, 2).map(({ dayKey, events }) => (
                <div key={dayKey}>
                  <div className="text-xs uppercase tracking-wider text-muted mb-1">
                    {dayFmt.format(new Date(events[0].time))}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {events.map((ev, i) => (
                      <div
                        key={i}
                        className="rounded-lg bg-surface-2 border border-border p-2 flex items-center gap-2"
                      >
                        {ev.type === 'H' ? (
                          <ArrowUp className="w-4 h-4 text-info shrink-0" />
                        ) : (
                          <ArrowDown className="w-4 h-4 text-warn shrink-0" />
                        )}
                        <div className="flex flex-col">
                          <div className="text-sm font-semibold num">
                            {timeFmt.format(new Date(ev.time))}
                          </div>
                          <div className="text-[10px] text-muted num">
                            {ev.type === 'H' ? 'High' : 'Low'} · {ev.heightFt.toFixed(1)} ft
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="text-[10px] text-muted">
                Predictions from NOAA station {provider.stationId} (MLLW).
              </div>
            </div>
          );
        }}
      </SectionStatus>
    </CardSection>
  );
}

function groupByDay(
  events: Array<{ time: string; type: 'H' | 'L'; heightFt: number }>,
  timezone: string
): Array<{ dayKey: string; events: typeof events }> {
  const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: timezone });
  const map = new Map<string, typeof events>();
  for (const ev of events) {
    const key = fmt.format(new Date(ev.time));
    const arr = map.get(key) ?? [];
    arr.push(ev);
    map.set(key, arr);
  }
  return Array.from(map.entries())
    .map(([dayKey, evs]) => ({ dayKey, events: evs }))
    .sort((a, b) => a.dayKey.localeCompare(b.dayKey));
}
