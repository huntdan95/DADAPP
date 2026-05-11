import { useState } from 'react';
import { Boxes } from 'lucide-react';
import { CardSection } from '@/components/ui/Card';
import type { Location } from '@/lib/providers/types';
import { allHatches, type Hatch } from '@/lib/hatches/store';
import { HatchDetailSheet } from '@/features/hatches/HatchDetailSheet';

/**
 * Local fly-box recommendations — complements HatchSection. Where the
 * hatch section is "what's emerging right now," this section is "what
 * else lives in this water and works any day of the year": streamers,
 * tailwater staples (mysis, scud, sowbug, San Juan worm), salmon /
 * steelhead egg patterns, terrestrials that overlap the season.
 *
 * Hatches with the special stage tags `always-on`, `run-pattern`,
 * `streamer`, or terrestrial-style adult patterns are surfaced here
 * filtered by state. We don't gate by water temp — the point is to
 * be a reference toolkit, not a real-time emergence read.
 */
export function FlyBoxSection({ location }: { location: Location }) {
  const [selected, setSelected] = useState<Hatch | null>(null);
  const state = location.state.toUpperCase();
  const month = monthIn(location.timezone);

  // Pull entries by category. State must include the spot's state, OR
  // the entry must have no state restriction (`states.length === 0`,
  // treated as "everywhere" by the rest of the app).
  const matchesState = (h: Hatch) =>
    h.states.length === 0 || h.states.includes(state);

  const all = allHatches().filter(matchesState);

  // Bucket each entry by what kind of fly it represents.
  const staples = all.filter((h) => h.stages.includes('always-on'));
  const streamers = all.filter((h) => h.stages.includes('streamer'));
  const runPatterns = all.filter((h) =>
    h.stages.includes('run-pattern') &&
    inMonthRange(month, h.startMonth, h.endMonth)
  );
  const terrestrials = all.filter(
    (h) =>
      h.id.startsWith('terrestrials-') &&
      inMonthRange(month, h.startMonth, h.endMonth)
  );

  // Hide the whole section when there's nothing to show — avoids an
  // empty card on lake spots where none of these categories apply.
  const totalRows = staples.length + streamers.length + runPatterns.length + terrestrials.length;
  if (totalRows === 0) return null;

  return (
    <CardSection label="Local fly box">
      <div className="text-[11px] text-muted mb-2 leading-snug">
        Anytime patterns for {state} — separate from seasonal hatches above.
        Tap any to see the full fly toolkit.
      </div>

      <div className="flex flex-col gap-3">
        {staples.length > 0 && (
          <FlyGroup
            label="Tailwater staples"
            hint="Year-round bottom-food: drift them deep on tippet."
            hatches={staples}
            onPick={setSelected}
          />
        )}
        {streamers.length > 0 && (
          <FlyGroup
            label="Streamers"
            hint="Pre-spawn brown / aggressive-fish play. Heavy sink-tip."
            hatches={streamers}
            onPick={setSelected}
          />
        )}
        {runPatterns.length > 0 && (
          <FlyGroup
            label="Run patterns"
            hint="Salmon / steelhead egg + flesh patterns when fish are in."
            hatches={runPatterns}
            onPick={setSelected}
          />
        )}
        {terrestrials.length > 0 && (
          <FlyGroup
            label="Terrestrials"
            hint="Plop them tight to overhanging banks midday."
            hatches={terrestrials}
            onPick={setSelected}
          />
        )}
      </div>

      <HatchDetailSheet hatch={selected} onClose={() => setSelected(null)} />
    </CardSection>
  );
}

function FlyGroup({
  label,
  hint,
  hatches,
  onPick,
}: {
  label: string;
  hint: string;
  hatches: Hatch[];
  onPick: (h: Hatch) => void;
}) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-muted mb-1">
        {label}
      </div>
      <div className="text-[11px] text-muted/80 mb-1.5">{hint}</div>
      <div className="flex flex-col gap-1.5">
        {hatches.map((h) => (
          <button
            key={h.id}
            type="button"
            onClick={() => onPick(h)}
            className="text-left rounded-lg bg-surface-2/60 border border-border hover:border-accent/40 p-2 transition active:scale-[0.99] flex items-start gap-2"
          >
            <Boxes className="w-3.5 h-3.5 text-accent mt-0.5 flex-none" />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold truncate">{h.name}</div>
              <div className="text-[11px] text-muted truncate">
                {h.flies.slice(0, 2).join(' · ')}
                {h.flies.length > 2 && ` · +${h.flies.length - 2} more`}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ---- helpers ----------------------------------------------------------------

function monthIn(tz: string): number {
  return parseInt(
    new Intl.DateTimeFormat('en-US', { timeZone: tz, month: 'numeric' }).format(
      new Date()
    ),
    10
  );
}

function inMonthRange(month: number, start: number, end: number): boolean {
  if (start <= end) return month >= start && month <= end;
  return month >= start || month <= end;
}
