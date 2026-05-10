import { useMemo } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Cloud,
  CloudRain,
  Snowflake,
  Sun,
  Wind,
} from 'lucide-react';
import { CardSection } from '@/components/ui/Card';
import { StatBlock } from '@/components/ui/StatBlock';
import { fetchWeather } from '@/lib/providers';
import type { Location, PressureTrend, WeatherProvider } from '@/lib/providers/types';
import { useAsync } from './useAsync';
import { SectionStatus } from './SectionStatus';
import { cn } from '@/lib/utils';

export function WeatherSection({
  provider,
  location,
}: {
  provider: WeatherProvider;
  location: Location;
}) {
  const { state } = useAsync(
    () => fetchWeather(provider, location),
    [provider.kind, location.id]
  );

  return (
    <CardSection label="Weather">
      <SectionStatus state={state}>
        {(data) => (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <StatBlock
                label="Air"
                value={Math.round(data.airTempF)}
                unit="°F"
                emphasis="big"
                hint={
                  <span className="flex items-center gap-1">
                    {weatherIcon(data.weatherCode)}
                    {weatherCodeLabel(data.weatherCode)}
                  </span>
                }
              />
              <PressureBlock
                pressureMb={data.pressureMb}
                delta={data.pressureDelta6hMb}
                trend={data.pressureTrend}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <StatBlock
                label="High"
                value={Math.round(data.daily.tempMaxF)}
                unit="°F"
              />
              <StatBlock
                label="Low"
                value={Math.round(data.daily.tempMinF)}
                unit="°F"
              />
              <StatBlock
                label="Wind"
                value={data.windMph != null ? Math.round(data.windMph) : '—'}
                unit="mph"
              />
            </div>

            {data.forecastHourly.length > 0 && (
              <ForecastStrip
                hourly={data.forecastHourly}
                timezone={location.timezone}
              />
            )}
          </div>
        )}
      </SectionStatus>
    </CardSection>
  );
}

function PressureBlock({
  pressureMb,
  delta,
  trend,
}: {
  pressureMb: number;
  delta: number | null;
  trend: PressureTrend;
}) {
  const sign = delta == null ? '' : delta > 0 ? '+' : '';
  const trendColor =
    trend === 'falling-fast'
      ? 'text-warn'
      : trend === 'falling'
      ? 'text-info'
      : trend === 'rising-fast'
      ? 'text-accent'
      : 'text-muted';
  const Icon =
    trend === 'falling' || trend === 'falling-fast'
      ? ArrowDownRight
      : trend === 'rising' || trend === 'rising-fast'
      ? ArrowUpRight
      : Wind;
  return (
    <div className="flex flex-col gap-0.5">
      <div className="text-xs uppercase tracking-wider text-muted">Pressure</div>
      <div className="flex items-baseline gap-2">
        <div className="num text-3xl font-semibold">
          {Math.round(pressureMb)}
          <span className="text-muted text-base font-normal ml-1">mb</span>
        </div>
        <div className={cn('flex items-center gap-1 text-sm', trendColor)}>
          <Icon className="w-4 h-4" />
          {delta != null && (
            <span className="num">
              {sign}
              {delta.toFixed(1)} / 6h
            </span>
          )}
        </div>
      </div>
      <div className={cn('text-xs', trendColor)}>{trendLabel(trend)}</div>
    </div>
  );
}

function ForecastStrip({
  hourly,
  timezone,
}: {
  hourly: Array<{
    time: string;
    tempF: number;
    precipProbPct: number | null;
    cloudCoverPct: number | null;
  }>;
  timezone: string;
}) {
  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        timeZone: timezone,
      }),
    [timezone]
  );
  const slice = hourly.filter((_, i) => i % 3 === 0).slice(0, 8);
  return (
    <div className="flex gap-2 overflow-x-auto -mx-1 px-1">
      {slice.map((h) => (
        <div
          key={h.time}
          className="flex flex-col items-center gap-1 px-2 py-1 rounded-lg bg-surface-2 min-w-[3.5rem]"
        >
          <span className="text-xs text-muted">
            {formatter.format(new Date(h.time))}
          </span>
          <span className="num text-sm font-semibold">
            {Math.round(h.tempF)}°
          </span>
          {h.precipProbPct != null && h.precipProbPct > 10 && (
            <span className="num text-[10px] text-info">
              {Math.round(h.precipProbPct)}%
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function weatherIcon(code: number) {
  if (code === 0 || code === 1) return <Sun className="w-3.5 h-3.5" />;
  if (code === 2 || code === 3) return <Cloud className="w-3.5 h-3.5" />;
  if (code >= 51 && code <= 67) return <CloudRain className="w-3.5 h-3.5" />;
  if (code >= 71 && code <= 77) return <Snowflake className="w-3.5 h-3.5" />;
  if (code >= 80 && code <= 99) return <CloudRain className="w-3.5 h-3.5" />;
  return <Cloud className="w-3.5 h-3.5" />;
}

function weatherCodeLabel(code: number): string {
  // WMO code mapping; abbreviated to what dad cares about.
  if (code === 0) return 'Clear';
  if (code === 1) return 'Mostly clear';
  if (code === 2) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if (code >= 45 && code <= 48) return 'Fog';
  if (code >= 51 && code <= 57) return 'Drizzle';
  if (code >= 61 && code <= 67) return 'Rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Showers';
  if (code >= 95) return 'Thunder';
  return 'Mixed';
}

function trendLabel(trend: PressureTrend): string {
  switch (trend) {
    case 'falling-fast':
      return 'Falling fast — front coming, often the best bite';
    case 'falling':
      return 'Falling — bite often picks up';
    case 'rising-fast':
      return 'Rising fast — bite usually slows';
    case 'rising':
      return 'Rising — slow improvement';
    case 'steady':
      return 'Steady — typical bite for this time of day';
  }
}
