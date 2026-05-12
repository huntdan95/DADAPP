import { useMemo, useState } from 'react';
import { Boxes, Waves } from 'lucide-react';
import { CardSection } from '@/components/ui/Card';
import { BottomSheet } from '@/components/ui/BottomSheet';
import type { Location } from '@/lib/providers/types';
import { allHatches, type Hatch } from '@/lib/hatches/store';
import { HatchDetailSheet } from '@/features/hatches/HatchDetailSheet';
import { matchWaterbody } from '@/lib/waterbodies/matcher';
import type { PatternEntry as WaterbodyPattern } from '@/lib/waterbodies/types';

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
  const [selectedPattern, setSelectedPattern] =
    useState<WaterbodyPattern | null>(null);
  const state = location.state.toUpperCase();
  const month = monthIn(location.timezone);

  // Pull waterbody match — when present, the matched water's top
  // patterns get the first group ("This water's top patterns"). These
  // are way more actionable than the generic state-filtered hatches
  // because the curator already wrote the WHEN + WHERE + technique
  // for this specific water.
  const waterbody = useMemo(() => matchWaterbody(location), [location]);
  const waterbodyPatterns = waterbody?.patterns ?? [];

  // Pull entries by category. State must include the spot's state, OR
  // the entry must have no state restriction (`states.length === 0`,
  // treated as "everywhere" by the rest of the app).
  const matchesState = (h: Hatch) =>
    h.states.length === 0 || h.states.includes(state);

  const all = allHatches().filter(matchesState);

  // Bucket each entry by what kind of fly it represents. Specific
  // categories (mouse, frog, attractor) are sub-types we want to
  // surface as their own sections, so we filter them OUT of the
  // generic "streamers" / "always-on" buckets to avoid duplicates.
  const mice = all.filter(
    (h) =>
      h.stages.includes('mouse') &&
      inMonthRange(month, h.startMonth, h.endMonth)
  );
  const frogs = all.filter(
    (h) =>
      h.stages.includes('frog') &&
      inMonthRange(month, h.startMonth, h.endMonth)
  );
  const attractors = all.filter(
    (h) =>
      h.stages.includes('attractor') &&
      inMonthRange(month, h.startMonth, h.endMonth)
  );
  const staples = all.filter(
    (h) => h.stages.includes('always-on') && !h.stages.includes('attractor')
  );
  const streamers = all.filter(
    (h) =>
      h.stages.includes('streamer') &&
      !h.stages.includes('mouse') &&
      !h.stages.includes('frog')
  );
  const runPatterns = all.filter(
    (h) =>
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
  // Now also surfaces when there's at least one waterbody pattern.
  const totalRows =
    staples.length + streamers.length + runPatterns.length +
    terrestrials.length + mice.length + frogs.length + attractors.length +
    waterbodyPatterns.length;
  if (totalRows === 0) return null;

  return (
    <CardSection label="Local fly box">
      <div className="text-[11px] text-muted mb-2 leading-snug">
        {waterbody
          ? `Patterns for ${waterbody.name} first, then anytime ${state} patterns below.`
          : `Anytime patterns for ${state} — separate from seasonal hatches above. Tap any to see the full fly toolkit.`}
      </div>

      <div className="flex flex-col gap-3">
        {/* Waterbody-specific top patterns LEAD when we have a match.
            These are the actionable picks — curator-written with the
            water's specific structure and forage in mind, so they
            beat the generic state-list patterns for this exact spot. */}
        {waterbodyPatterns.length > 0 && (
          <WaterbodyPatternGroup
            waterbodyName={waterbody!.name}
            patterns={waterbodyPatterns.slice(0, 4)}
            onPick={setSelectedPattern}
            extraCount={Math.max(0, waterbodyPatterns.length - 4)}
          />
        )}
        {staples.length > 0 && (
          <FlyGroup
            label="Tailwater staples"
            hint="Year-round bottom-food: drift them deep on tippet."
            hatches={staples}
            onPick={setSelected}
          />
        )}
        {attractors.length > 0 && (
          <FlyGroup
            label="Attractor dries"
            hint="Searching patterns when nothing's coming off — Patriot, Wulff, Purple Haze."
            hatches={attractors}
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
        {mice.length > 0 && (
          <FlyGroup
            label="Mouse patterns"
            hint="After dark; trophy browns hunt undercut banks + log jams."
            hatches={mice}
            onPick={setSelected}
          />
        )}
        {frogs.length > 0 && (
          <FlyGroup
            label="Frog patterns"
            hint="Night browns + smallmouth. Strip hard with pauses."
            hatches={frogs}
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

      {/* Tapping a waterbody pattern opens a sheet with the full
          When/How/Where/Details. Separate from the HatchDetailSheet
          because the shape is different (patterns have technique +
          where, hatches have flies). */}
      <WaterbodyPatternSheet
        pattern={selectedPattern}
        waterbodyName={waterbody?.name}
        onClose={() => setSelectedPattern(null)}
      />
    </CardSection>
  );
}

function WaterbodyPatternGroup({
  waterbodyName,
  patterns,
  onPick,
  extraCount,
}: {
  waterbodyName: string;
  patterns: WaterbodyPattern[];
  onPick: (p: WaterbodyPattern) => void;
  extraCount: number;
}) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-muted mb-1 flex items-center gap-1">
        <Waves className="w-3 h-3 text-info" />
        Top patterns at {waterbodyName}
      </div>
      <div className="text-[11px] text-muted/80 mb-1.5">
        Curator-written for this exact water — the right fly for this
        structure + forage, not just the state-wide list.
      </div>
      <div className="flex flex-col gap-1.5">
        {patterns.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onPick(p)}
            className="text-left rounded-lg bg-surface-2/60 border border-border hover:border-accent/40 p-2 transition active:scale-[0.99] flex items-start gap-2"
          >
            <Boxes className="w-3.5 h-3.5 text-info mt-0.5 flex-none" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="text-sm font-semibold truncate">{p.title}</div>
                <span className="text-[10px] text-accent border border-accent/40 bg-accent/10 px-1.5 py-0.5 rounded-md whitespace-nowrap flex-none">
                  {p.target}
                </span>
              </div>
              <div className="text-[11px] text-muted truncate mt-0.5">
                {p.technique}
              </div>
            </div>
          </button>
        ))}
        {extraCount > 0 && (
          <div className="text-[11px] text-muted px-1">
            + {extraCount} more pattern{extraCount === 1 ? '' : 's'} — open
            the Waters Guide for the full list.
          </div>
        )}
      </div>
    </div>
  );
}

function WaterbodyPatternSheet({
  pattern,
  waterbodyName,
  onClose,
}: {
  pattern: WaterbodyPattern | null;
  waterbodyName?: string;
  onClose: () => void;
}) {
  return (
    <BottomSheet
      open={pattern != null}
      onClose={onClose}
      title={pattern?.title}
    >
      {pattern && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-accent border border-accent/40 bg-accent/10 px-1.5 py-0.5 rounded-md">
              {pattern.target}
            </span>
            {waterbodyName && (
              <span className="text-[10px] text-info border border-info/40 bg-info/10 px-1.5 py-0.5 rounded-md">
                {waterbodyName}
              </span>
            )}
          </div>
          <div className="text-xs">
            <b className="text-muted">When:</b> {pattern.when}
          </div>
          <div className="text-sm text-text/90">
            <b className="text-muted">How:</b> {pattern.technique}
          </div>
          <div className="text-sm text-text/90">
            <b className="text-muted">Where:</b> {pattern.where}
          </div>
          {pattern.details && (
            <div className="text-xs text-muted leading-relaxed border-t border-border pt-2">
              {pattern.details}
            </div>
          )}
        </div>
      )}
    </BottomSheet>
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
