import { useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Droplet,
  Fish,
  MapPin,
  Search,
  X,
} from 'lucide-react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Card } from '@/components/ui/Card';
import {
  statesWithWaterbodies,
  waterbodiesForState,
} from '@/lib/waterbodies/store';
import type {
  PatternEntry,
  SpeciesEntry,
  Waterbody,
} from '@/lib/waterbodies/types';
import { WaterbodyDetailSheet } from './WaterbodyDetailSheet';

/**
 * Top-level "Waters Guide" browser. Mounted as a bottom sheet from
 * the Spots tab so it's one tap away when planning a trip.
 *
 * Three layers of navigation:
 *   1. State filter at the top — only states with profile data
 *      appear. Initial guess uses the user's saved-spots states.
 *   2. Search box — matches name + species + pattern target/title.
 *   3. Region groups — collapsible cards listing waterbodies.
 *
 * Tapping a waterbody opens the detail sheet (full profile +
 * species table + patterns).
 */
export function WatersGuide({
  open,
  onClose,
  /** USPS state codes of the user's saved spots — used to default the filter. */
  userStates,
}: {
  open: boolean;
  onClose: () => void;
  userStates: string[];
}) {
  // Available states (those with any waterbody data).
  const stateOptions = useMemo(() => statesWithWaterbodies(), []);
  // Total waterbody count across all states — used as a build-version
  // tell so users can confirm at a glance whether the new bundle is
  // loaded. If you see a tiny "n=4,162" pill but the screen still
  // only shows 4 states, that means the bundle IS new and the bug is
  // elsewhere; if you see the OLD number, your PWA is on a stale
  // service-worker cache (close + reopen the app to refresh).
  const totalCount = useMemo(() => {
    return stateOptions.reduce((acc, s) => acc + waterbodiesForState(s).length, 0);
  }, [stateOptions]);
  // Default: first overlap between user's spots and available data,
  // else the first available state.
  const defaultState = useMemo(() => {
    const overlap = userStates.find((s) => stateOptions.includes(s));
    return overlap ?? stateOptions[0] ?? 'IN';
  }, [userStates, stateOptions]);

  const [state, setState] = useState<string>(defaultState);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Waterbody | null>(null);

  const waterbodies = useMemo(() => waterbodiesForState(state), [state]);

  // Filter by free-text query against name + signatureSpecies +
  // species list + pattern titles. Keeps the search cheap and
  // intuitive without building a real search index.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return waterbodies;
    return waterbodies.filter((w) => {
      const hay = (
        w.name +
        ' ' +
        (w.signatureSpecies ?? '') +
        ' ' +
        w.species.map((s) => s.name).join(' ') +
        ' ' +
        w.patterns.map((p) => p.title + ' ' + p.target).join(' ')
      ).toLowerCase();
      return hay.includes(q);
    });
  }, [waterbodies, query]);

  // Group filtered waterbodies by region for the accordion UI.
  const byRegion = useMemo(() => {
    const groups: Record<string, Waterbody[]> = {};
    for (const w of filtered) {
      if (!groups[w.region]) groups[w.region] = [];
      groups[w.region].push(w);
    }
    // Sort each region's waters alphabetically.
    for (const r of Object.keys(groups)) {
      groups[r].sort((a, b) => a.name.localeCompare(b.name));
    }
    return groups;
  }, [filtered]);

  // Region accordion default-open state. Default to all open if the
  // search is filtering things — otherwise users would have to
  // click into a region to see if their search matched.
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const effectiveExpanded = useMemo(() => {
    if (query.trim().length > 0) return new Set(Object.keys(byRegion));
    if (expanded.size === 0 && Object.keys(byRegion).length > 0) {
      // First region opens by default on initial load.
      return new Set([Object.keys(byRegion)[0]]);
    }
    return expanded;
  }, [expanded, query, byRegion]);

  function toggleRegion(r: string) {
    setExpanded((prev) => {
      const next = new Set(prev.size === 0 ? [Object.keys(byRegion)[0]] : prev);
      if (next.has(r)) next.delete(r);
      else next.add(r);
      return next;
    });
  }

  return (
    <>
      <BottomSheet open={open} onClose={onClose} title="Waters Guide">
        <div className="flex flex-col gap-3">
          {/* Build-version tell. Drop this once the new bundle is
              confirmed to be in everyone's cache. */}
          <div className="flex items-center justify-between gap-2 text-[11px] text-muted">
            <span>
              {stateOptions.length} states · {totalCount.toLocaleString()} waters
            </span>
          </div>

          {/* State filter — only show if multiple states have data */}
          {stateOptions.length > 1 && (
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="text-muted">State:</span>
              {stateOptions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setState(s)}
                  className={
                    'px-2.5 py-1 rounded-md border text-sm font-medium ' +
                    (s === state
                      ? 'border-accent/60 bg-accent/15 text-accent'
                      : 'border-border text-muted hover:text-text')
                  }
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            <input
              type="text"
              inputMode="search"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder="Search waterbody, species, or pattern…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-9 rounded-xl bg-surface-2 border border-border focus:border-accent/60 outline-none text-sm"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-text rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick stats line */}
          <div className="text-xs text-muted">
            {filtered.length} waterbod{filtered.length === 1 ? 'y' : 'ies'}
            {' · '}
            {filtered.reduce((n, w) => n + w.species.length, 0)} species entries
            {' · '}
            {filtered.reduce((n, w) => n + w.patterns.length, 0)} named patterns
          </div>

          {/* Region groups */}
          {Object.keys(byRegion).length === 0 ? (
            <div className="text-center text-muted py-8 text-sm">
              No matches in {state}. Try clearing the search.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {Object.entries(byRegion).map(([region, waters]) => (
                <Card key={region}>
                  <button
                    type="button"
                    onClick={() => toggleRegion(region)}
                    className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Droplet className="w-4 h-4 text-info flex-none" />
                      <span className="font-semibold text-sm truncate">
                        {region}
                      </span>
                      <span className="text-[11px] text-muted">
                        {waters.length}
                      </span>
                    </div>
                    {effectiveExpanded.has(region) ? (
                      <ChevronDown className="w-4 h-4 text-muted" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted" />
                    )}
                  </button>
                  {effectiveExpanded.has(region) && (
                    <div className="px-3 pb-3 flex flex-col gap-1.5">
                      {waters.map((w) => (
                        <WaterbodyRow
                          key={w.id}
                          w={w}
                          onOpen={() => setSelected(w)}
                        />
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </BottomSheet>

      {/* Detail sheet stacks on top of the guide. Tapping the
          backdrop closes the detail first, then the guide. */}
      <WaterbodyDetailSheet
        waterbody={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}

function WaterbodyRow({
  w,
  onOpen,
}: {
  w: Waterbody;
  onOpen: () => void;
}) {
  const sig = w.signatureSpecies ?? signatureFromSpecies(w.species);
  return (
    <button
      type="button"
      onClick={onOpen}
      className="text-left rounded-lg bg-surface-2/60 border border-border hover:border-accent/40 active:scale-[0.99] p-2.5 transition flex items-start gap-2"
    >
      <Fish className="w-3.5 h-3.5 text-accent mt-0.5 flex-none" />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold truncate">{w.name}</div>
        <div className="text-[11px] text-muted truncate">
          {w.county && `${w.county} Co.`}
          {w.acres != null && ` · ${w.acres.toLocaleString()} ac`}
          {w.maxDepthFt != null && ` · ${w.maxDepthFt} ft max`}
          {w.river && ` · ${w.river}`}
        </div>
        <div className="text-[11px] text-text/80 truncate mt-0.5">
          {sig}
        </div>
      </div>
      {w.lat != null && w.lng != null ? (
        <MapPin className="w-3.5 h-3.5 text-accent/70 flex-none mt-1" />
      ) : (
        <ChevronRight className="w-3.5 h-3.5 text-muted flex-none mt-1" />
      )}
    </button>
  );
}

function signatureFromSpecies(species: SpeciesEntry[]): string {
  return species
    .filter((s) => s.importance === 'signature')
    .map((s) => s.name)
    .join(', ');
}

// Re-export so consumers can pull patterns + species typing here too.
export type { PatternEntry, SpeciesEntry, Waterbody };
