import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { StatBlock } from '@/components/ui/StatBlock';
import { fetchFlow } from '@/lib/providers';
import type { FlowProvider, FlowReading } from '@/lib/providers/types';
import { fetchUsgsFlowSeries, type FlowSample } from '@/lib/providers/flow/usgsHistory';
import { friendlyError } from '@/lib/errors';
import { formatRelativeTime } from '@/lib/utils';

/**
 * Detailed flow view opened from the FlowSection on tap. Shows current
 * snapshot plus the last 7 days as a sparkline chart so you can see if
 * the river is rising, falling, or steady.
 *
 * Future: layer NOAA AHPS 5-day forecast on top (TODO — needs a
 * usgs-site → nws-gauge mapping).
 */
export function FlowDetailSheet({
  open,
  onClose,
  provider,
}: {
  open: boolean;
  onClose: () => void;
  provider: FlowProvider | null;
}) {
  const [current, setCurrent] = useState<FlowReading | null>(null);
  const [series, setSeries] = useState<FlowSample[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !provider) return;
    setLoading(true);
    setError(null);
    setSeries(null);
    setCurrent(null);
    Promise.all([
      fetchFlow(provider).catch((e) => {
        console.warn('current flow failed', e);
        return null;
      }),
      provider.kind === 'usgs'
        ? fetchUsgsFlowSeries(provider.siteId, 7).catch((e) => {
            console.warn('flow series failed', e);
            return null;
          })
        : Promise.resolve(null),
    ])
      .then(([cur, hist]) => {
        setCurrent(cur);
        setSeries(hist);
      })
      .catch((e) => setError(friendlyError(e)))
      .finally(() => setLoading(false));
  }, [open, provider]);

  return (
    <BottomSheet open={open} onClose={onClose} title="Flow details">
      {loading && (
        <div className="flex items-center gap-2 py-4 text-muted">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading flow…
        </div>
      )}
      {error && <div className="text-sm text-danger">{error}</div>}

      {!loading && current && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-4">
            <StatBlock
              label="Flow"
              value={current.flowCfs != null ? Math.round(current.flowCfs) : '—'}
              unit="cfs"
              emphasis="big"
            />
            <StatBlock
              label="Gauge"
              value={current.gaugeFt != null ? current.gaugeFt.toFixed(2) : '—'}
              unit="ft"
            />
            <StatBlock
              label="Water"
              value={
                current.waterTempF != null
                  ? Math.round(current.waterTempF * 10) / 10
                  : '—'
              }
              unit="°F"
            />
          </div>

          {series && series.length > 1 && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="text-xs uppercase tracking-wider text-muted">
                  Last 7 days
                </div>
                <FlowTrend series={series} />
              </div>
              <FlowChart series={series} />
            </div>
          )}

          <div className="text-xs text-muted">
            {current.siteName}
            {current.observedAt && ` · ${formatRelativeTime(current.observedAt)}`}
          </div>
          <div className="text-[11px] text-muted">
            Source: USGS Water Services (free, public API). 5-day forecast
            coming once we wire NOAA AHPS — for now this shows what's been
            happening over the past week so you can see if the river is
            rising, falling, or steady.
          </div>
        </div>
      )}
    </BottomSheet>
  );
}

/**
 * Trend chip: compares the trailing 24h average to the prior 24h average
 * and labels the change. Quick read for "should I expect to wade this?".
 */
function FlowTrend({ series }: { series: FlowSample[] }) {
  const lastMs = new Date(series[series.length - 1].time).getTime();
  const day1Start = lastMs - 24 * 60 * 60 * 1000;
  const day2Start = lastMs - 48 * 60 * 60 * 1000;
  const recent = series.filter((s) => new Date(s.time).getTime() >= day1Start);
  const prior = series.filter((s) => {
    const ms = new Date(s.time).getTime();
    return ms >= day2Start && ms < day1Start;
  });
  if (recent.length === 0 || prior.length === 0) return null;
  const recentAvg = recent.reduce((a, s) => a + s.flowCfs, 0) / recent.length;
  const priorAvg = prior.reduce((a, s) => a + s.flowCfs, 0) / prior.length;
  const pct = ((recentAvg - priorAvg) / priorAvg) * 100;
  if (Math.abs(pct) < 8) {
    return <span className="text-[11px] text-muted">steady</span>;
  }
  const rising = pct > 0;
  return (
    <span
      className={
        'text-[11px] num ' + (rising ? 'text-warn' : 'text-accent')
      }
    >
      {rising ? '▲' : '▼'} {Math.abs(pct).toFixed(0)}% vs yesterday
    </span>
  );
}

/** Compact sparkline of the flow series. */
function FlowChart({ series }: { series: FlowSample[] }) {
  if (series.length < 2) return null;

  const W = 320;
  const H = 90;
  const PAD_X = 4;
  const PAD_TOP = 8;
  const PAD_BOTTOM = 16;
  const plotW = W - 2 * PAD_X;
  const plotH = H - PAD_TOP - PAD_BOTTOM;

  const t0 = new Date(series[0].time).getTime();
  const tN = new Date(series[series.length - 1].time).getTime();
  const span = Math.max(tN - t0, 1);

  const flows = series.map((s) => s.flowCfs);
  const minF = Math.min(...flows);
  const maxF = Math.max(...flows);
  const range = Math.max(maxF - minF, 1);
  const pad = range * 0.1;
  const yMin = Math.max(0, minF - pad);
  const yMax = maxF + pad;

  const xFor = (ms: number) =>
    PAD_X + ((ms - t0) / span) * plotW;
  const yFor = (cfs: number) =>
    PAD_TOP + plotH - ((cfs - yMin) / (yMax - yMin)) * plotH;

  let line = '';
  series.forEach((s, i) => {
    const x = xFor(new Date(s.time).getTime());
    const y = yFor(s.flowCfs);
    line += i === 0 ? `M${x.toFixed(1)},${y.toFixed(1)}` : ` L${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const fill = `${line} L${xFor(tN).toFixed(1)},${(PAD_TOP + plotH).toFixed(1)} L${xFor(t0).toFixed(1)},${(PAD_TOP + plotH).toFixed(1)} Z`;

  // Day boundary ticks.
  const dayMs = 24 * 60 * 60 * 1000;
  const firstMidnight = Math.ceil(t0 / dayMs) * dayMs;
  const ticks: Array<{ x: number; label: string }> = [];
  for (let t = firstMidnight; t <= tN; t += dayMs) {
    const dt = new Date(t);
    ticks.push({
      x: xFor(t),
      label: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(dt),
    });
  }

  return (
    <div className="rounded-xl border border-border bg-surface-2/40 p-2">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-24"
        preserveAspectRatio="none"
        role="img"
        aria-label="Flow over the last 7 days"
      >
        <path d={fill} fill="rgba(96, 165, 250, 0.15)" />
        <path d={line} stroke="#60a5fa" strokeWidth="1.5" fill="none" />
        {ticks.map((t, i) => (
          <g key={i}>
            <line
              x1={t.x}
              x2={t.x}
              y1={PAD_TOP}
              y2={PAD_TOP + plotH}
              stroke="rgba(232, 239, 232, 0.1)"
              strokeWidth="1"
            />
            <text
              x={t.x}
              y={H - 2}
              fontSize="8"
              fill="rgba(232, 239, 232, 0.5)"
              textAnchor="middle"
            >
              {t.label}
            </text>
          </g>
        ))}
        {/* Min / max labels */}
        <text
          x={PAD_X}
          y={PAD_TOP + 6}
          fontSize="8"
          fill="rgba(232, 239, 232, 0.5)"
        >
          {Math.round(yMax)}
        </text>
        <text
          x={PAD_X}
          y={PAD_TOP + plotH - 1}
          fontSize="8"
          fill="rgba(232, 239, 232, 0.5)"
        >
          {Math.round(yMin)}
        </text>
      </svg>
    </div>
  );
}
