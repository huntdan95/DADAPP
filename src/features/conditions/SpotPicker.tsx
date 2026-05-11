import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronDown,
  MapPin,
  Plus,
  Check,
  Search,
  Clock,
  X,
} from 'lucide-react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import type { Location } from '@/lib/providers/types';
import { cn } from '@/lib/utils';
import { getFirebaseAuth } from '@/lib/firebase';
import { bumpSpotMru, readSpotMru } from './spotMru';

/**
 * Big tappable button showing the current spot. Tap it to open a sheet
 * with a search bar + a Recent section + every saved spot grouped by
 * state.
 *
 * Designed for the case where the user has many saved spots across many
 * states. A flat scroll list gets painful at >20 entries. With search +
 * recent + state grouping, the common interaction is "tap the spot I
 * always fish" in one tap, or "type 2 letters" for anything else.
 */
export function SpotPicker({
  locations,
  currentId,
  onPick,
  onAdd,
}: {
  locations: Location[];
  currentId: string | null;
  onPick: (id: string) => void;
  onAdd: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const current = locations.find((l) => l.id === currentId) ?? null;

  // Track recents per signed-in user so dad's recents don't leak into
  // a buddy's account on the same device.
  const uid = getFirebaseAuth()?.currentUser?.uid ?? null;
  // Read MRU lazily — once when sheet opens — so we don't re-read
  // localStorage on every render. The local state is rebuilt on each
  // open so a recently-tapped spot moves to the top next time the
  // picker is opened.
  const [mruIds, setMruIds] = useState<string[]>([]);
  useEffect(() => {
    if (open) {
      setMruIds(readSpotMru(uid));
      setQuery('');
      // Auto-focus search when the sheet opens — desktop users can
      // type immediately, mobile users still tap to invoke the
      // keyboard (autoFocus is the iOS-friendly form).
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, uid]);

  // Compute the four sections of the sheet:
  //   filtered  – the search matches across name / river / state
  //   recent    – the up-to-5 most-recently-opened spots (no filter)
  //   byState   – everything else, alphabetized state then name
  // When the search is empty, "recent" is shown above "byState" and
  // the recent ids are excluded from the byState list to avoid
  // showing the same spot twice.
  const filtered = useMemo(
    () => filterLocations(locations, query),
    [locations, query]
  );

  const recent = useMemo(() => {
    if (query.trim().length > 0) return [];
    return mruIds
      .map((id) => locations.find((l) => l.id === id))
      .filter((l): l is Location => Boolean(l))
      .slice(0, 5);
  }, [mruIds, locations, query]);

  // When we have recents, hide them from the by-state section so the
  // user doesn't see the same row twice.
  const recentIds = new Set(recent.map((l) => l.id));
  const byStateSource =
    query.trim().length > 0
      ? filtered
      : locations.filter((l) => !recentIds.has(l.id));
  const byState = useMemo(() => groupByState(byStateSource), [byStateSource]);

  function pickAndClose(id: string) {
    bumpSpotMru(uid, id);
    onPick(id);
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-3 px-4 h-14 rounded-2xl bg-surface-2 border border-border hover:border-accent/40 active:scale-[0.99] transition w-full text-left"
      >
        <MapPin className="w-5 h-5 text-accent shrink-0" />
        <div className="flex-1 min-w-0">
          {current ? (
            <>
              <div className="text-base font-semibold truncate">
                {current.name}
              </div>
              <div className="text-xs text-muted truncate">
                {[current.river, current.type, current.state]
                  .filter(Boolean)
                  .join(' · ')}
              </div>
            </>
          ) : (
            <div className="text-sm text-muted">Pick a spot</div>
          )}
        </div>
        <ChevronDown className="w-4 h-4 text-muted shrink-0" />
      </button>

      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        title="Pick a spot"
      >
        <div className="flex flex-col gap-3">
          {/* Search bar — always visible. Filters across name + river
              + state with a single substring match. */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              inputMode="search"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder={`Search ${locations.length} spot${
                locations.length === 1 ? '' : 's'
              }…`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                // Enter picks the first visible result — keyboard
                // power-user shortcut. Skipped when nothing matches.
                if (e.key === 'Enter') {
                  const first =
                    query.trim().length > 0 && filtered.length > 0
                      ? filtered[0]
                      : null;
                  if (first) {
                    e.preventDefault();
                    pickAndClose(first.id);
                  }
                }
              }}
              className="w-full h-11 pl-9 pr-9 rounded-xl bg-surface-2 border border-border focus:border-accent/60 outline-none text-base"
            />
            {query.length > 0 && (
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

          {/* Search-empty path: Recent section first. */}
          {recent.length > 0 && (
            <section className="flex flex-col gap-1.5">
              <div className="text-[11px] uppercase tracking-wider text-muted flex items-center gap-1.5 px-1">
                <Clock className="w-3 h-3" /> Recent
              </div>
              {recent.map((loc) => (
                <SpotRow
                  key={loc.id}
                  loc={loc}
                  active={loc.id === currentId}
                  onPick={pickAndClose}
                />
              ))}
            </section>
          )}

          {/* Search-results path or grouped-by-state path. */}
          {query.trim().length > 0 ? (
            <section className="flex flex-col gap-1.5">
              <div className="text-[11px] uppercase tracking-wider text-muted px-1">
                {filtered.length} match{filtered.length === 1 ? '' : 'es'}
              </div>
              {filtered.length === 0 ? (
                <div className="text-sm text-muted px-1 py-3">
                  No spots match "{query.trim()}".
                </div>
              ) : (
                filtered.map((loc) => (
                  <SpotRow
                    key={loc.id}
                    loc={loc}
                    active={loc.id === currentId}
                    onPick={pickAndClose}
                  />
                ))
              )}
            </section>
          ) : (
            byState.map(({ state, items }) => (
              <section key={state} className="flex flex-col gap-1.5">
                <div className="text-[11px] uppercase tracking-wider text-muted px-1">
                  {state} · {items.length}
                </div>
                {items.map((loc) => (
                  <SpotRow
                    key={loc.id}
                    loc={loc}
                    active={loc.id === currentId}
                    onPick={pickAndClose}
                  />
                ))}
              </section>
            ))
          )}

          <button
            type="button"
            onClick={() => {
              onAdd();
              setOpen(false);
            }}
            className="flex items-center gap-3 px-3 py-3 rounded-xl border border-dashed border-border text-muted hover:text-text hover:border-accent/40 transition mt-1"
          >
            <Plus className="w-5 h-5 shrink-0" />
            <span className="font-semibold">Add a new spot</span>
          </button>
        </div>
      </BottomSheet>
    </>
  );
}

function SpotRow({
  loc,
  active,
  onPick,
}: {
  loc: Location;
  active: boolean;
  onPick: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onPick(loc.id)}
      className={cn(
        'flex items-center gap-3 px-3 py-3 rounded-xl border text-left transition',
        active
          ? 'bg-accent/10 border-accent text-text'
          : 'bg-surface-2 border-border hover:border-accent/40'
      )}
    >
      <MapPin
        className={cn(
          'w-5 h-5 shrink-0',
          active ? 'text-accent' : 'text-muted'
        )}
      />
      <div className="flex-1 min-w-0">
        <div className="font-semibold truncate">{loc.name}</div>
        <div className="text-xs text-muted truncate">
          {[loc.river, loc.type, loc.state].filter(Boolean).join(' · ')}
        </div>
      </div>
      {active && <Check className="w-4 h-4 text-accent shrink-0" />}
    </button>
  );
}

/**
 * Substring filter across name / river / state — three slots a user
 * is most likely to remember about a spot. Normalizes both sides
 * (case-fold + punctuation strip) so "st. joe" matches "St. Joseph".
 */
function filterLocations(locations: Location[], query: string): Location[] {
  const q = normalize(query);
  if (!q) return locations;
  return locations.filter((loc) => {
    const hay = normalize(
      [loc.name, loc.river ?? '', loc.state, loc.type].join(' ')
    );
    return hay.includes(q);
  });
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Group spots into alphabetized state sections, with each state's
 * spots alphabetized by name. Stable order keeps the picker
 * predictable across opens.
 */
function groupByState(
  locations: Location[]
): Array<{ state: string; items: Location[] }> {
  const map = new Map<string, Location[]>();
  for (const loc of locations) {
    const state = loc.state || '—';
    const arr = map.get(state) ?? [];
    arr.push(loc);
    map.set(state, arr);
  }
  const out: Array<{ state: string; items: Location[] }> = [];
  for (const [state, items] of map.entries()) {
    items.sort((a, b) => a.name.localeCompare(b.name));
    out.push({ state, items });
  }
  out.sort((a, b) => a.state.localeCompare(b.state));
  return out;
}
