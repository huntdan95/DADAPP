import { useEffect, useState } from 'react';
import { Bug, ChevronRight } from 'lucide-react';
import { CardSection } from '@/components/ui/Card';
import { BottomSheet } from '@/components/ui/BottomSheet';
import type { Location } from '@/lib/providers/types';
import { activeHatchesForLocation, hexCountdown, type Hatch } from '@/lib/hatches/store';
import { fetchFlow } from '@/lib/providers';
import { HatchDetailSheet } from '@/features/hatches/HatchDetailSheet';

/**
 * Surfaces the hatches that are plausibly active right now for this
 * location. Filters by month, state, and (when available) current water
 * temperature so we don't promise "midges" when it's 95° and 78° water.
 *
 * Special-cases the Hex countdown on Manistee — anglers plan trips
 * around it, so a "Hex in N days" headline is worth its own treatment.
 */
export function HatchSection({ location }: { location: Location }) {
  const [waterTempF, setWaterTempF] = useState<number | null>(null);
  const [selectedHatch, setSelectedHatch] = useState<Hatch | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!location.dataProviders.flow) return;
    fetchFlow(location.dataProviders.flow)
      .then((f) => {
        if (!cancelled) setWaterTempF(f.waterTempF ?? null);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [location]);

  const hatches = activeHatchesForLocation(location, waterTempF);
  const hex = hexCountdown(location);
  const top = hatches.slice(0, 4);
  const rest = hatches.slice(4);

  function openHatch(h: Hatch) {
    // Close the more-sheet first to avoid nested portal stacking on
    // mobile — same pattern as SpeciesSection.
    setMoreOpen(false);
    setSelectedHatch(h);
  }

  return (
    <CardSection label="What's hatching">
      {hex && (
        <div className="rounded-xl border border-info/40 bg-info/10 p-3 mb-3">
          <div className="text-sm font-semibold text-info flex items-center gap-2">
            <Bug className="w-4 h-4" />
            Hex hatch:{' '}
            {hex.daysUntil > 0
              ? `~${hex.daysUntil} days out`
              : hex.daysUntil === 0
              ? 'PEAK is today'
              : `peak was ${Math.abs(hex.daysUntil)} day${
                  Math.abs(hex.daysUntil) === 1 ? '' : 's'
                } ago`}
          </div>
          <div className="text-xs text-muted mt-0.5">
            Typical peak {fmtDay(hex.peakDate)}. Night fishing — big browns
            on size 6 dries.
          </div>
        </div>
      )}

      {top.length === 0 ? (
        <div className="text-sm text-muted">
          Nothing major popping at {location.state} right now. Search-pattern
          weather — try terrestrials and BWO emergers.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {top.map((h) => (
            <HatchRow
              key={h.id}
              hatch={h}
              waterTempF={waterTempF}
              onOpen={() => openHatch(h)}
            />
          ))}
          {rest.length > 0 && (
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              className="mt-1 flex items-center justify-between rounded-lg border border-border bg-surface-2/50 hover:bg-surface-2 hover:border-accent/40 px-3 py-2 text-xs text-muted transition active:scale-[0.99]"
            >
              <span>+ {rest.length} more hatches in season</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      <HatchDetailSheet
        hatch={selectedHatch}
        onClose={() => setSelectedHatch(null)}
      />

      <BottomSheet
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        title="More hatches in season"
      >
        <div className="flex flex-col gap-2">
          <div className="text-xs text-muted">
            Lower-priority for this spot right now, but possible. Tap any to
            see flies + identifying features.
          </div>
          {rest.map((h) => (
            <HatchRow
              key={h.id}
              hatch={h}
              waterTempF={waterTempF}
              onOpen={() => openHatch(h)}
            />
          ))}
        </div>
      </BottomSheet>
    </CardSection>
  );
}

function HatchRow({
  hatch,
  waterTempF,
  onOpen,
}: {
  hatch: Hatch;
  waterTempF: number | null;
  onOpen: () => void;
}) {
  const inWindow =
    waterTempF != null &&
    waterTempF >= hatch.waterTempMinF &&
    waterTempF <= hatch.waterTempMaxF;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="text-left rounded-lg bg-surface-2 border border-border p-2.5 hover:border-accent/40 active:scale-[0.99] transition"
    >
      <div className="flex items-baseline justify-between gap-2">
        <div className="text-sm font-semibold flex items-center gap-1.5">
          {hatch.name}
          {inWindow && <span className="text-[10px] text-accent">IN WINDOW</span>}
          <ChevronRight className="w-3 h-3 text-muted" />
        </div>
        <div className="text-[10px] text-muted num">
          {hatch.waterTempMinF}–{hatch.waterTempMaxF}°F · {hatch.timeOfDay}
        </div>
      </div>
      <div className="text-xs text-muted italic mt-0.5">{hatch.scientific}</div>
      <div className="text-xs mt-1">{hatch.flies.slice(0, 2).join(' · ')}</div>
      {hatch.notes && (
        <div className="text-[11px] text-muted mt-1">{hatch.notes}</div>
      )}
    </button>
  );
}

function fmtDay(yyyyMmDd: string): string {
  const d = new Date(yyyyMmDd + 'T12:00:00Z');
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(d);
}
