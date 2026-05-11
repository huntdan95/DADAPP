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
              <TideChart
                events={data.events}
                timezone={location.timezone}
              />
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

/**
 * Compact 24h tide chart. NOAA returns sparse high/low points; we
 * interpolate a cosine between them (real-world tide curves are
 * sinusoidal between extremes). Current time is marked with a vertical
 * line + dot.
 *
 * Width is intentionally responsive — the parent card pads us, and we
 * use viewBox-driven SVG so the curve scales with the device.
 */
function TideChart({
  events,
  timezone,
}: {
  events: Array<{ time: string; type: 'H' | 'L'; heightFt: number }>;
  timezone: string;
}) {
  // Build a 24h window centered on now in the location's timezone.
  const now = new Date();
  const startMs = now.getTime() - 6 * 60 * 60 * 1000;        // -6h
  const endMs = now.getTime() + 18 * 60 * 60 * 1000;         // +18h
  const span = endMs - startMs;

  // Convert NOAA times (in lst_ldt — local-time strings without tz) to UTC
  // ms by treating them as the station's local time.
  const points = events
    .map((ev) => ({
      ms: toMsLocal(ev.time, timezone),
      heightFt: ev.heightFt,
      type: ev.type,
    }))
    .filter((p) => p.ms >= startMs - 6 * 60 * 60 * 1000 && p.ms <= endMs + 6 * 60 * 60 * 1000);

  if (points.length < 2) return null;

  // Cosine interpolation between adjacent extremes.
  const samples: Array<{ ms: number; heightFt: number }> = [];
  const SAMPLE_STEP_MS = 10 * 60 * 1000;           // 10 min
  for (let t = startMs; t <= endMs; t += SAMPLE_STEP_MS) {
    const before = points.filter((p) => p.ms <= t).pop();
    const after = points.find((p) => p.ms >= t);
    let h: number;
    if (before && after && before.ms !== after.ms) {
      const u = (t - before.ms) / (after.ms - before.ms);
      // Cosine ease — smooth peaks/troughs.
      const eased = (1 - Math.cos(Math.PI * u)) / 2;
      h = before.heightFt + (after.heightFt - before.heightFt) * eased;
    } else {
      h = (before ?? after)!.heightFt;
    }
    samples.push({ ms: t, heightFt: h });
  }

  const heights = samples.map((s) => s.heightFt);
  const minH = Math.min(...heights);
  const maxH = Math.max(...heights);
  const range = Math.max(maxH - minH, 0.5);
  const pad = range * 0.15;
  const yMin = minH - pad;
  const yMax = maxH + pad;

  // SVG dims (viewBox so it scales to container width).
  const W = 320;
  const H = 80;
  const PAD_X = 4;
  const PAD_TOP = 8;
  const PAD_BOTTOM = 16;
  const plotW = W - 2 * PAD_X;
  const plotH = H - PAD_TOP - PAD_BOTTOM;

  const xFor = (ms: number) => PAD_X + ((ms - startMs) / span) * plotW;
  const yFor = (ft: number) =>
    PAD_TOP + plotH - ((ft - yMin) / (yMax - yMin)) * plotH;

  // Build the curve path.
  let d = '';
  samples.forEach((s, i) => {
    const x = xFor(s.ms);
    const y = yFor(s.heightFt);
    d += i === 0 ? `M${x.toFixed(1)},${y.toFixed(1)}` : ` L${x.toFixed(1)},${y.toFixed(1)}`;
  });

  // Fill area under the curve down to chart bottom for visual weight.
  const fillD = `${d} L${xFor(endMs).toFixed(1)},${(PAD_TOP + plotH).toFixed(1)} L${xFor(startMs).toFixed(1)},${(PAD_TOP + plotH).toFixed(1)} Z`;

  const nowX = xFor(now.getTime());

  // Hour ticks at local 6 / 12 / 18.
  const tickFmt = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    timeZone: timezone,
  });
  const ticks: Array<{ x: number; label: string }> = [];
  for (let t = startMs; t <= endMs; t += 6 * 60 * 60 * 1000) {
    ticks.push({ x: xFor(t), label: tickFmt.format(new Date(t)) });
  }

  // Mark the extremes inside the visible window.
  const visibleExtremes = points.filter(
    (p) => p.ms >= startMs && p.ms <= endMs
  );

  return (
    <div className="rounded-xl border border-border bg-surface-2/40 p-2">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-20"
        preserveAspectRatio="none"
        role="img"
        aria-label="Tide curve over the next 24 hours"
      >
        <path d={fillD} fill="rgba(96, 165, 250, 0.12)" />
        <path d={d} stroke="#60a5fa" strokeWidth="1.5" fill="none" />
        {/* Current time line */}
        <line
          x1={nowX}
          x2={nowX}
          y1={PAD_TOP}
          y2={PAD_TOP + plotH}
          stroke="#4ade80"
          strokeWidth="1"
          strokeDasharray="2,2"
        />
        {/* Extremes dots + labels */}
        {visibleExtremes.map((p, i) => {
          const x = xFor(p.ms);
          const y = yFor(p.heightFt);
          const isHigh = p.type === 'H';
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r="2.5"
                fill={isHigh ? '#60a5fa' : '#fbbf24'}
              />
              <text
                x={x}
                y={isHigh ? y - 5 : y + 11}
                fontSize="8"
                textAnchor="middle"
                fill={isHigh ? '#60a5fa' : '#fbbf24'}
                fontWeight="600"
              >
                {p.heightFt.toFixed(1)}
              </text>
            </g>
          );
        })}
        {/* Hour ticks */}
        {ticks.map((tk, i) => (
          <text
            key={i}
            x={tk.x}
            y={H - 2}
            fontSize="8"
            fill="rgba(232, 239, 232, 0.5)"
            textAnchor="middle"
          >
            {tk.label}
          </text>
        ))}
      </svg>
    </div>
  );
}

/**
 * NOAA returns "YYYY-MM-DDTHH:MM" in lst_ldt (the station's local time
 * with no offset). Treat that string as a local time in the location's
 * timezone and return UTC ms. Used by the tide chart to align with the
 * device's clock.
 */
function toMsLocal(localStr: string, timezone: string): number {
  // The string is "YYYY-MM-DDTHH:MM" already (groupByDay replaces the
  // space with T at fetch time).
  const m = localStr.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!m) return new Date(localStr).getTime();
  const [, y, mo, d, h, mi] = m;
  // Naive UTC ms from those local-clock numbers.
  const naiveMs = Date.UTC(
    Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), 0
  );
  // Compute the timezone's offset at that moment; subtract to anchor real UTC.
  const offsetMin = tzOffsetMinutes(timezone, new Date(naiveMs));
  return naiveMs - offsetMin * 60 * 1000;
}

function tzOffsetMinutes(timezone: string, atUtc: Date): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const parts = dtf.formatToParts(atUtc);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '0';
  const localMs = Date.UTC(
    Number(get('year')),
    Number(get('month')) - 1,
    Number(get('day')),
    Number(get('hour')) % 24,
    Number(get('minute')),
    Number(get('second'))
  );
  return (localMs - atUtc.getTime()) / 60000;
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
