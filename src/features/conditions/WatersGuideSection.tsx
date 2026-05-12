import { lazy, Suspense, useMemo, useState } from 'react';
import { BookOpen, ChevronRight, Fish, Waves } from 'lucide-react';
import { CardSection } from '@/components/ui/Card';
import type { Location } from '@/lib/providers/types';
import { matchWaterbody } from '@/lib/waterbodies/matcher';
import type { SpeciesEntry } from '@/lib/waterbodies/types';

const WaterbodyDetailSheet = lazy(() =>
  import('@/features/waterbodies/WaterbodyDetailSheet').then((m) => ({
    default: m.WaterbodyDetailSheet,
  }))
);

/**
 * "What's biting + how" — surfaces the matched Waters Guide entry's
 * species list + top patterns directly on the Conditions card for
 * the user's saved spot.
 *
 * Hides itself when no waterbody matches (rather than show a misleading
 * stub). The full detail sheet is one tap away when there IS a match.
 *
 * The match logic lives in `src/lib/waterbodies/matcher.ts` — uses
 * state + river name + name token overlap + GPS proximity to find the
 * best candidate and refuses to show anything below a confidence
 * threshold.
 */
export function WatersGuideSection({ location }: { location: Location }) {
  const match = useMemo(() => matchWaterbody(location), [location]);
  const [open, setOpen] = useState(false);

  if (!match) return null;

  // Headline species — signature first, fall back to strong if there
  // are none. Cap at 3 so the card doesn't bloat.
  const headline = sortByImportance(match.species).slice(0, 3);

  // Top 2 patterns — these have the "how" specifics (when + where +
  // technique) that the user explicitly asked for.
  const topPatterns = match.patterns.slice(0, 2);

  return (
    <>
      <CardSection label="What's biting + how">
        {/* Match header */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full flex items-start gap-2 text-left rounded-lg border border-info/30 bg-info/5 hover:bg-info/10 active:scale-[0.99] transition px-3 py-2.5 mb-2"
          title="Open the full waterbody guide"
        >
          <BookOpen className="w-4 h-4 text-info mt-0.5 flex-none" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">{match.name}</div>
            <div className="text-[11px] text-muted truncate">
              {match.region}
              {match.acres != null && ` · ${match.acres.toLocaleString()} ac`}
              {match.maxDepthFt != null && ` · ${match.maxDepthFt} ft max`}
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted flex-none mt-1" />
        </button>

        {/* Top species */}
        <div className="text-[10px] uppercase tracking-wider text-muted mb-1 flex items-center gap-1">
          <Fish className="w-3 h-3" />
          Top species
        </div>
        <div className="flex flex-col gap-1.5 mb-3">
          {headline.map((s, i) => (
            <SpeciesQuickRow key={i} s={s} />
          ))}
        </div>

        {/* Top patterns — the "how" specifics */}
        {topPatterns.length > 0 && (
          <>
            <div className="text-[10px] uppercase tracking-wider text-muted mb-1 flex items-center gap-1">
              <Waves className="w-3 h-3" />
              Top patterns
            </div>
            <div className="flex flex-col gap-1.5">
              {topPatterns.map((p, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border bg-surface-2/40 p-2.5 text-xs"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="font-semibold text-sm">{p.title}</div>
                    <span className="text-[10px] text-accent border border-accent/40 bg-accent/10 px-1.5 py-0.5 rounded-md">
                      {p.target}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted mt-0.5">
                    <b>When:</b> {p.when}
                  </div>
                  <div className="text-text/90 mt-0.5">
                    <b className="text-muted">How:</b> {p.technique}
                  </div>
                  <div className="text-text/90 mt-0.5">
                    <b className="text-muted">Where:</b> {p.where}
                  </div>
                </div>
              ))}
            </div>
            {match.patterns.length > 2 && (
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="mt-2 text-[11px] text-info hover:text-accent transition"
              >
                + {match.patterns.length - 2} more pattern
                {match.patterns.length - 2 === 1 ? '' : 's'} → open full guide
              </button>
            )}
          </>
        )}
      </CardSection>

      {open && (
        <Suspense fallback={null}>
          <WaterbodyDetailSheet
            waterbody={match}
            onClose={() => setOpen(false)}
          />
        </Suspense>
      )}
    </>
  );
}

function SpeciesQuickRow({ s }: { s: SpeciesEntry }) {
  // Color the importance pill the same way the detail sheet does.
  const importStyle: Record<SpeciesEntry['importance'], string> = {
    signature: 'border-accent/40 bg-accent/15 text-accent',
    strong: 'border-info/40 bg-info/10 text-info',
    good: 'border-border bg-surface-2 text-text/80',
    present: 'border-border bg-surface-2/50 text-muted',
  };
  return (
    <div className="flex items-start gap-2 text-xs">
      <span
        className={`px-1.5 py-0.5 rounded-md text-[9px] uppercase tracking-wider border whitespace-nowrap flex-none ${importStyle[s.importance]}`}
      >
        {s.importance}
      </span>
      <div className="flex-1 min-w-0">
        <div className="font-semibold">{s.name}</div>
        {(s.size || s.notes) && (
          <div className="text-[11px] text-muted leading-snug">
            {s.size && <span>{s.size}</span>}
            {s.size && s.notes && <span> · </span>}
            {s.notes && <span>{s.notes}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

function sortByImportance(species: SpeciesEntry[]): SpeciesEntry[] {
  const order: Record<SpeciesEntry['importance'], number> = {
    signature: 0,
    strong: 1,
    good: 2,
    present: 3,
  };
  return [...species].sort(
    (a, b) => order[a.importance] - order[b.importance]
  );
}
