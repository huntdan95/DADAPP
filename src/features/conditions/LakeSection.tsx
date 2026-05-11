import { Waves } from 'lucide-react';
import { CardSection } from '@/components/ui/Card';
import { StatBlock } from '@/components/ui/StatBlock';
import { fetchLakeData } from '@/lib/providers';
import type { LakeDataProvider } from '@/lib/providers/types';
import { formatRelativeTime } from '@/lib/utils';
import { useAsync } from './useAsync';
import { SectionStatus } from './SectionStatus';

/**
 * Lake / reservoir water-conditions section. Fills the gap for spots
 * that don't sit below a river gauge — Great Lakes shoreline access,
 * inland reservoirs without a downstream USGS gauge, etc.
 *
 * Composes from a `LakeDataProvider`:
 *   - `noaa-buoy`  → NDBC realtime2 (surface temp, waves, wind)
 *   - `usgs-lake`  → USGS IV lake gauge (temp, elevation)
 *
 * Both providers can return partial readings — the UI hides any cell
 * the provider didn't fill. The lake "fishability hint" (warm enough
 * for largemouth, cold enough for trout, etc.) mirrors the trout
 * hint on FlowSection but uses lake-water thresholds.
 */
export function LakeSection({ provider }: { provider: LakeDataProvider }) {
  const { state } = useAsync(
    () => fetchLakeData(provider),
    [provider.kind, providerKey(provider)]
  );

  return (
    <CardSection label="Lake">
      <SectionStatus state={state}>
        {(data) => {
          const hasTemp = data.surfaceTempF != null;
          const hasElev = data.elevationFt != null;
          const hasWaves = data.waveHeightFt != null;
          const hasWind = data.windMph != null;
          // 3 columns: prefer surface temp first, then the most
          // informative two of (elevation / waves / wind). Picked by
          // priority so coastal buoys lead with waves and reservoirs
          // lead with elevation.
          const cells: Array<{ label: string; value: string; unit?: string; emphasis?: 'big' }> = [];
          if (hasTemp) {
            cells.push({
              label: 'Surface',
              value: String(Math.round((data.surfaceTempF as number) * 10) / 10),
              unit: '°F',
              emphasis: 'big',
            });
          }
          if (hasElev) {
            cells.push({
              label: 'Elevation',
              value: String(Math.round((data.elevationFt as number) * 10) / 10),
              unit: 'ft',
            });
          }
          if (hasWaves) {
            cells.push({
              label: 'Waves',
              value: String(Math.round((data.waveHeightFt as number) * 10) / 10),
              unit: 'ft',
            });
          }
          if (hasWind && cells.length < 3) {
            cells.push({
              label: 'Wind',
              value: String(Math.round(data.windMph as number)),
              unit: 'mph',
            });
          }
          // Trim to 3, pad with placeholder rather than empty grid.
          const display = cells.slice(0, 3);
          while (display.length < 3) {
            display.push({ label: '—', value: '—' });
          }

          return (
            <div className="w-full flex flex-col gap-3">
              <div className="grid grid-cols-3 gap-4">
                {display.map((c, i) => (
                  <StatBlock
                    key={`${c.label}-${i}`}
                    label={c.label}
                    value={c.value}
                    unit={c.unit}
                    emphasis={c.emphasis}
                  />
                ))}
              </div>
              {hasTemp && (
                <div className="text-xs text-accent">
                  {lakeTempHint(data.surfaceTempF as number)}
                </div>
              )}
              <div className="text-xs text-muted flex items-center gap-1.5">
                <Waves className="w-3 h-3 flex-none" />
                <span className="flex-1">
                  {data.siteName} ({data.authority}) ·{' '}
                  {data.observedAt
                    ? formatRelativeTime(data.observedAt)
                    : 'no recent observation'}
                  {data.notes && ` · ${data.notes}`}
                </span>
              </div>
            </div>
          );
        }}
      </SectionStatus>
    </CardSection>
  );
}

function providerKey(p: LakeDataProvider): string {
  switch (p.kind) {
    case 'usgs-lake':
      return p.siteId;
    case 'noaa-buoy':
      return p.stationId;
  }
}

/**
 * Plain-English hint for the warm-water-fish bias. Stillwater is a
 * different game from a trout stream — these thresholds are tuned
 * for largemouth / smallmouth / walleye, not trout.
 */
function lakeTempHint(tempF: number): string {
  if (tempF < 50) return 'Cold — finesse only; slow jigs along the bottom.';
  if (tempF < 60) return 'Pre-spawn cool — staging bass on transitions.';
  if (tempF <= 72) return 'Prime stillwater — full water column in play.';
  if (tempF <= 80) return 'Warm — dawn / dusk topwater best.';
  return 'Hot — fish deep cover; slow retrieves.';
}
