import { useMemo, useState } from 'react';
import {
  ChevronRight,
  Droplet,
  ExternalLink,
  Fish,
  Waves,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { Location } from '@/lib/providers/types';
import { matchWaterbody } from '@/lib/waterbodies/matcher';
import type {
  PatternEntry,
  SpeciesEntry,
  Waterbody,
} from '@/lib/waterbodies/types';
import { WaterbodyDetailSheet } from '@/features/waterbodies/WaterbodyDetailSheet';

/**
 * A dedicated Waters Guide preview card for the Conditions page.
 *
 * Renders only when the spot matches one of our curated waterbody
 * profiles (Cumberland tailwater, Lake Norman, Caney Fork, etc.).
 * The card surfaces the most useful at-a-glance facts plus the top
 * 2–3 named patterns and a single-tap launcher into the full
 * waterbody profile sheet.
 *
 * Distinct from SpeciesSection/FlyBoxSection — those work the
 * "what's biting / what to throw" rail. This card answers "where am
 * I and what is this place known for?"
 */
export function WatersGuideCard({ location }: { location: Location }) {
  const waterbody = useMemo(() => matchWaterbody(location), [location]);
  const [open, setOpen] = useState(false);

  // Sort species by importance and grab the headliners for a pill row.
  const headliners = useMemo(() => {
    if (!waterbody) return [];
    const order: Record<SpeciesEntry['importance'], number> = {
      signature: 0,
      strong: 1,
      good: 2,
      present: 3,
    };
    return [...waterbody.species]
      .sort((a, b) => order[a.importance] - order[b.importance])
      .filter((s) => s.importance === 'signature' || s.importance === 'strong')
      .slice(0, 5);
  }, [waterbody]);

  // Top 2 patterns — typically the first ones listed are the
  // signature techniques (curator-ordered).
  const topPatterns = useMemo(
    () => (waterbody ? waterbody.patterns.slice(0, 2) : []),
    [waterbody]
  );

  // One-line attribute strip — type · county · acres · max depth.
  const attrLine = useMemo(() => {
    if (!waterbody) return '';
    const bits: string[] = [];
    bits.push(formatType(waterbody.type));
    if (waterbody.county) bits.push(`${waterbody.county} Co.`);
    if (waterbody.acres != null) bits.push(`${waterbody.acres.toLocaleString()} ac`);
    if (waterbody.maxDepthFt != null) bits.push(`${waterbody.maxDepthFt} ft max`);
    return bits.join(' · ');
  }, [waterbody]);

  if (!waterbody) return null;

  return (
    <>
      <Card>
        <div className="px-4 py-3">
          {/* Eyebrow */}
          <div className="text-xs uppercase tracking-wider text-muted mb-2 flex items-center gap-1.5">
            <Waves className="w-3.5 h-3.5 text-info" />
            Waters Guide
          </div>

          {/* Identity row — name + region. Tapping anywhere here
              opens the full profile sheet. */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-full text-left flex items-start gap-2 mb-2 group"
          >
            <Droplet className="w-4 h-4 text-info mt-0.5 flex-none" />
            <div className="min-w-0 flex-1">
              <div className="text-base font-semibold leading-tight flex items-center gap-1">
                <span className="truncate">{waterbody.name}</span>
                <ChevronRight className="w-4 h-4 text-muted flex-none group-hover:text-accent transition" />
              </div>
              <div className="text-[11px] text-muted truncate">
                {waterbody.region}
                {attrLine && <> · {attrLine}</>}
              </div>
            </div>
          </button>

          {/* Signature/strong species pills — quick visual answer to
              "what is this place known for?" */}
          {headliners.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {headliners.map((s, i) => (
                <span
                  key={i}
                  className={
                    'inline-flex items-center gap-1 text-[10px] uppercase tracking-wider rounded-md px-1.5 py-0.5 border ' +
                    (s.importance === 'signature'
                      ? 'border-accent/40 bg-accent/15 text-accent'
                      : 'border-info/40 bg-info/10 text-info')
                  }
                  title={s.notes ?? ''}
                >
                  <Fish className="w-2.5 h-2.5" />
                  {s.name}
                </span>
              ))}
            </div>
          )}

          {/* Top patterns — quick reference. Two is enough to anchor
              the card; the full list lives in the detail sheet. */}
          {topPatterns.length > 0 && (
            <div className="flex flex-col gap-1.5">
              {topPatterns.map((p, i) => (
                <PatternPreview key={i} pattern={p} />
              ))}
            </div>
          )}

          {/* Notes block — short prose if the curator wrote any.
              Truncated so the card doesn't dominate the Conditions
              page; full prose lives in the detail sheet. */}
          {waterbody.notes && (
            <div className="text-[11px] text-muted leading-snug mt-2 border-t border-border pt-2 line-clamp-3">
              {waterbody.notes}
            </div>
          )}

          {/* Footer — explicit call-to-action to open the full
              Waters Guide entry. */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-3 w-full flex items-center justify-between rounded-lg border border-border bg-surface-2/50 hover:bg-surface-2 hover:border-accent/40 px-3 py-2 text-xs text-text/80 transition active:scale-[0.99]"
          >
            <span className="flex items-center gap-1.5">
              <ExternalLink className="w-3 h-3 text-info" />
              Open full profile · {waterbody.species.length} species ·{' '}
              {waterbody.patterns.length} patterns
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-muted" />
          </button>
        </div>
      </Card>

      <WaterbodyDetailSheet
        waterbody={open ? waterbody : null}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

/**
 * Condensed pattern row — title + target pill + 1-line "when".
 * Designed to fit two on a card without dominating the page.
 */
function PatternPreview({ pattern }: { pattern: PatternEntry }) {
  return (
    <div className="rounded-md bg-surface-2/40 border border-border px-2.5 py-1.5">
      <div className="flex items-baseline justify-between gap-2 flex-wrap">
        <div className="text-xs font-semibold truncate">{pattern.title}</div>
        <span className="text-[9px] uppercase tracking-wider text-accent border border-accent/40 bg-accent/10 px-1.5 py-0.5 rounded-md whitespace-nowrap">
          {pattern.target}
        </span>
      </div>
      <div className="text-[10px] text-muted mt-0.5 leading-snug">
        <b className="text-muted">When:</b> {pattern.when}
      </div>
    </div>
  );
}

function formatType(t: Waterbody['type']): string {
  switch (t) {
    case 'natural-lake': return 'Natural lake';
    case 'reservoir': return 'Reservoir';
    case 'river': return 'River';
    case 'river-segment': return 'River segment';
    case 'great-lake': return 'Great Lake';
    case 'great-lake-trib': return 'Great Lakes trib';
    case 'tailwater': return 'Tailwater';
    case 'pond': return 'Pond';
  }
}

// Re-export for any consumer that wants pattern typing.
export type { PatternEntry };
