import { useEffect, useMemo, useState } from 'react';
import {
  Boxes,
  Bug,
  ChevronDown,
  ChevronRight,
  Image as ImageIcon,
  Plus,
  Search,
  Sparkles,
  StickyNote,
  X,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { Location } from '@/lib/providers/types';
import { allHatches, type Hatch } from '@/lib/hatches/store';
import { FlyDetail } from './FlyDetail';
import { CustomFlyForm } from './CustomFlyForm';
import {
  watchAllFlyNotes,
  watchCustomFlies,
  type CustomFly,
  type FlyNotes,
} from './store';

/**
 * Fly Box — browse the full pattern database (~700 named flies across
 * 99 entries) + your custom additions. Categories follow the
 * stages/id conventions in hatches.json. Search across name + scientific
 * + fly names. Tap an entry to open the detail sheet (full toolkit,
 * your photos + notes, learn-more links).
 */
export function FlyBox({ locations }: { locations: Location[] }) {
  // Filter UI state.
  const [query, setQuery] = useState('');
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [showAll, setShowAll] = useState(false);    // ignore state filter
  const [selectedEntry, setSelectedEntry] = useState<Hatch | CustomFly | null>(null);
  const [customFormOpen, setCustomFormOpen] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(['mayfly', 'streamer', 'terrestrial'])
  );

  // Per-user notes + custom flies (live subscriptions).
  const [flyNotes, setFlyNotes] = useState<Map<string, FlyNotes>>(new Map());
  const [customFlies, setCustomFlies] = useState<CustomFly[]>([]);
  useEffect(() => watchAllFlyNotes(setFlyNotes), []);
  useEffect(() => watchCustomFlies(setCustomFlies), []);

  // Build the state filter dropdown from the user's saved spots.
  // "All states" is the default; tapping a specific state narrows the
  // listing to entries that include it.
  const userStates = useMemo(() => {
    const seen = new Set<string>();
    for (const loc of locations) {
      if (loc.state) seen.add(loc.state.toUpperCase());
    }
    return Array.from(seen).sort();
  }, [locations]);

  const allEntries = allHatches();

  // Apply state filter + query.
  const filteredEntries = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allEntries.filter((h) => {
      // State gating
      if (!showAll && stateFilter !== 'all') {
        if (h.states.length > 0 && !h.states.includes(stateFilter)) return false;
      }
      // Query: match name / scientific / any fly text
      if (q) {
        const hay = (
          h.name +
          ' ' +
          h.scientific +
          ' ' +
          h.flies.join(' ')
        ).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [allEntries, stateFilter, showAll, query]);

  // Group filtered entries into categories.
  const grouped = useMemo(
    () => groupIntoCategories(filteredEntries),
    [filteredEntries]
  );

  const totalEntries = filteredEntries.length;
  const totalFlies = filteredEntries.reduce((n, h) => n + h.flies.length, 0);

  function toggleCategory(key: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Header: totals + add button */}
      <Card>
        <div className="px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-accent" />
            <div>
              <div className="font-semibold text-base">Fly Box</div>
              <div className="text-xs text-muted">
                {totalEntries} pattern{totalEntries === 1 ? '' : 's'} ·{' '}
                {totalFlies} flies
                {customFlies.length > 0 && ` · ${customFlies.length} custom`}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCustomFormOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent/15 border border-accent/40 hover:bg-accent/25 active:scale-[0.98] text-sm font-medium text-accent transition"
          >
            <Plus className="w-4 h-4" />
            Add fly
          </button>
        </div>
      </Card>

      {/* Search + state filter */}
      <Card>
        <div className="px-4 py-3 flex flex-col gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            <input
              type="text"
              inputMode="search"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder="Search by name, species, or fly pattern…"
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
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="text-muted">Show patterns for:</span>
            <button
              type="button"
              onClick={() => {
                setStateFilter('all');
                setShowAll(true);
              }}
              className={
                'px-2 py-0.5 rounded-md border ' +
                (showAll
                  ? 'border-accent/60 bg-accent/10 text-accent'
                  : 'border-border text-muted hover:text-text')
              }
            >
              All states
            </button>
            {userStates.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => {
                  setStateFilter(st);
                  setShowAll(false);
                }}
                className={
                  'px-2 py-0.5 rounded-md border ' +
                  (!showAll && stateFilter === st
                    ? 'border-accent/60 bg-accent/10 text-accent'
                    : 'border-border text-muted hover:text-text')
                }
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Custom flies first (when present) */}
      {customFlies.length > 0 && (
        <Card>
          <CategoryHeader
            label="Your custom flies"
            count={customFlies.length}
            expanded={expanded.has('custom')}
            onToggle={() => toggleCategory('custom')}
            icon={Sparkles}
          />
          {expanded.has('custom') && (
            <div className="px-3 pb-3 flex flex-col gap-1.5">
              {customFlies.map((fly) => (
                <CustomFlyRow
                  key={fly.id}
                  fly={fly}
                  onOpen={() => setSelectedEntry(fly)}
                />
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Category groups */}
      {grouped.map((cat) => (
        <Card key={cat.key}>
          <CategoryHeader
            label={cat.label}
            count={cat.entries.length}
            expanded={expanded.has(cat.key)}
            onToggle={() => toggleCategory(cat.key)}
            icon={cat.icon ?? Bug}
          />
          {expanded.has(cat.key) && (
            <div className="px-3 pb-3 flex flex-col gap-1.5">
              {cat.entries.map((h) => (
                <FlyRow
                  key={h.id}
                  hatch={h}
                  hasNotes={
                    flyNotes.has(h.id) &&
                    (!!flyNotes.get(h.id)?.notes ||
                      (flyNotes.get(h.id)?.photoUrls?.length ?? 0) > 0)
                  }
                  onOpen={() => setSelectedEntry(h)}
                />
              ))}
            </div>
          )}
        </Card>
      ))}

      {grouped.length === 0 && customFlies.length === 0 && (
        <div className="text-center text-muted py-12 text-sm">
          No patterns match. Try clearing the filters above.
        </div>
      )}

      {/* Detail sheet (handles both Hatch entries and custom flies) */}
      {selectedEntry && (
        <FlyDetail
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
        />
      )}

      {/* Custom-fly add sheet */}
      {customFormOpen && (
        <CustomFlyForm
          onClose={() => setCustomFormOpen(false)}
          onSaved={() => setCustomFormOpen(false)}
        />
      )}
    </div>
  );
}

// ---- Category definitions ------------------------------------------------

interface CategoryDef {
  key: string;
  label: string;
  icon?: typeof Bug;
  match: (h: Hatch) => boolean;
}

/**
 * Order matters — first-match wins. More specific categories listed
 * before generic catch-alls. Stages-tagged categories (streamer,
 * mouse, frog, attractor, etc.) take precedence over id-prefix-only
 * matches.
 */
const CATEGORIES: CategoryDef[] = [
  {
    key: 'mouse',
    label: 'Mouse',
    icon: Sparkles,
    match: (h) => h.stages.includes('mouse'),
  },
  {
    key: 'frog',
    label: 'Frog',
    icon: Sparkles,
    match: (h) => h.stages.includes('frog'),
  },
  {
    key: 'streamer',
    label: 'Streamers',
    icon: Sparkles,
    match: (h) =>
      h.stages.includes('streamer') &&
      !h.stages.includes('mouse') &&
      !h.stages.includes('frog'),
  },
  {
    key: 'run',
    label: 'Eggs / Run patterns',
    icon: Sparkles,
    match: (h) => h.stages.includes('run-pattern'),
  },
  {
    key: 'attractor',
    label: 'Attractor dries',
    icon: Sparkles,
    match: (h) => h.stages.includes('attractor'),
  },
  {
    key: 'subsurface',
    label: 'Sculpins / Crayfish / Lamprey',
    icon: Bug,
    match: (h) => /sculpin|crayfish|lamprey/.test(h.id),
  },
  {
    key: 'junk',
    label: 'Junk nymphs (Green Weenie, Mop, worms)',
    icon: Bug,
    match: (h) => /junk-nymph|san-juan-worm/.test(h.id),
  },
  {
    key: 'terrestrial',
    label: 'Terrestrials',
    icon: Bug,
    match: (h) =>
      /terrestrials|hopper|beetle|ant|cricket|inchworm|cicada|lanternfly|grasshopper|oak-worm/.test(
        h.id
      ),
  },
  {
    key: 'stonefly',
    label: 'Stoneflies',
    icon: Bug,
    match: (h) =>
      /stonefly|salmonfly|yellow-sally|golden-stone|skwala|brown-stonefly|early-black-stonefly|tiny-black-stonefly|big-golden-stonefly|giant-black-stonefly|giant-stonefly|little-yellow-stone/.test(
        h.id
      ),
  },
  {
    key: 'caddis',
    label: 'Caddis',
    icon: Bug,
    match: (h) =>
      /caddis|sedge|hydropsyche/.test(h.id) || /caddis|sedge/i.test(h.name),
  },
  {
    key: 'midge',
    label: 'Midges',
    icon: Bug,
    match: (h) => /midge/.test(h.id),
  },
  {
    key: 'staple',
    label: 'Year-round food forms',
    icon: Bug,
    match: (h) => h.stages.includes('always-on'),
  },
  {
    key: 'mayfly',
    label: 'Mayflies',
    icon: Bug,
    match: () => true,                 // catch-all bottom
  },
];

interface GroupedCategory {
  key: string;
  label: string;
  icon?: typeof Bug;
  entries: Hatch[];
}

function groupIntoCategories(entries: Hatch[]): GroupedCategory[] {
  const groups: Record<string, GroupedCategory> = {};
  for (const def of CATEGORIES) {
    groups[def.key] = { key: def.key, label: def.label, icon: def.icon, entries: [] };
  }
  for (const h of entries) {
    for (const def of CATEGORIES) {
      if (def.match(h)) {
        groups[def.key].entries.push(h);
        break;
      }
    }
  }
  // Drop empty categories, sort each by name.
  return CATEGORIES
    .map((def) => groups[def.key])
    .filter((g) => g.entries.length > 0)
    .map((g) => ({
      ...g,
      entries: [...g.entries].sort((a, b) => a.name.localeCompare(b.name)),
    }));
}

// ---- presentation components ----------------------------------------------

function CategoryHeader({
  label,
  count,
  expanded,
  onToggle,
  icon: Icon,
}: {
  label: string;
  count: number;
  expanded: boolean;
  onToggle: () => void;
  icon: typeof Bug;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left"
    >
      <div className="flex items-center gap-2 min-w-0">
        <Icon className="w-4 h-4 text-muted flex-none" />
        <span className="font-semibold text-sm truncate">{label}</span>
        <span className="text-[11px] text-muted">{count}</span>
      </div>
      {expanded ? (
        <ChevronDown className="w-4 h-4 text-muted" />
      ) : (
        <ChevronRight className="w-4 h-4 text-muted" />
      )}
    </button>
  );
}

function FlyRow({
  hatch,
  hasNotes,
  onOpen,
}: {
  hatch: Hatch;
  hasNotes: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="text-left rounded-lg bg-surface-2/60 border border-border hover:border-accent/40 active:scale-[0.99] p-2.5 transition flex items-start gap-2"
    >
      <Bug className="w-3.5 h-3.5 text-accent mt-0.5 flex-none" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="text-sm font-semibold truncate">{hatch.name}</div>
          {hasNotes && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-accent/15 text-accent text-[10px]">
              <StickyNote className="w-2.5 h-2.5" />
              yours
            </span>
          )}
        </div>
        <div className="text-[11px] text-muted truncate">
          {hatch.scientific} · {hatch.flies.length} fl
          {hatch.flies.length === 1 ? 'y' : 'ies'}
          {hatch.states.length > 0 && ` · ${hatch.states.slice(0, 6).join('/')}`}
          {hatch.states.length > 6 && '…'}
        </div>
      </div>
      <ChevronRight className="w-3.5 h-3.5 text-muted flex-none mt-1" />
    </button>
  );
}

function CustomFlyRow({
  fly,
  onOpen,
}: {
  fly: CustomFly;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="text-left rounded-lg bg-surface-2/60 border border-border hover:border-accent/40 active:scale-[0.99] p-2.5 transition flex items-start gap-2"
    >
      {fly.photoUrl ? (
        <img
          src={fly.photoUrl}
          alt={fly.name}
          className="w-8 h-8 object-cover rounded-md flex-none"
        />
      ) : (
        <ImageIcon className="w-3.5 h-3.5 text-muted mt-0.5 flex-none" />
      )}
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold truncate">{fly.name}</div>
        <div className="text-[11px] text-muted truncate">
          {fly.category}
          {fly.description && ` · ${fly.description}`}
        </div>
      </div>
      <ChevronRight className="w-3.5 h-3.5 text-muted flex-none mt-1" />
    </button>
  );
}
