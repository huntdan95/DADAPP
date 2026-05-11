import { useMemo, useState } from 'react';
import { ChevronRight, Fish } from 'lucide-react';
import { CardSection } from '@/components/ui/Card';
import type { Location } from '@/lib/providers/types';
import {
  recommendedSpeciesForLocation,
  type SpeciesEntry,
  type SpeciesTactic,
} from '@/lib/species/store';
import { BottomSheet } from '@/components/ui/BottomSheet';

/**
 * Species + lure recommendations for water types where insect hatches
 * aren't the actionable signal (lakes, reservoirs, saltwater, and many
 * warm-water rivers).
 *
 * Card surface shows the top 5 most-likely-to-be-caught fish for this
 * specific spot (ranked by commonality + state-specific bonus). The
 * remainder live behind a "+N more species in season" button that opens
 * a sheet — so a Homosassa marsh doesn't lead with sailfish, but a Keys
 * boat trip can still drill down to find permit and bonefish.
 */
const VISIBLE_COUNT = 5;

export function SpeciesSection({ location }: { location: Location }) {
  const [selected, setSelected] = useState<SpeciesEntry | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);

  const species = useMemo(
    () => recommendedSpeciesForLocation(location),
    [location]
  );
  const top = species.slice(0, VISIBLE_COUNT);
  const rest = species.slice(VISIBLE_COUNT);

  function openSpecies(s: SpeciesEntry) {
    // Close the more-sheet first so we don't have nested portals
    // animating against each other on mobile.
    setMoreOpen(false);
    setSelected(s);
  }

  return (
    <CardSection label="What's biting">
      {top.length === 0 ? (
        <div className="text-sm text-muted">
          No species recommendations for {location.state}{' '}
          {waterLabel(location.type)} yet. Add to{' '}
          <code className="text-text">data/species.json</code> to expand
          coverage.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {top.map((s) => (
            <SpeciesRow key={s.id} species={s} onOpen={() => openSpecies(s)} />
          ))}
          {rest.length > 0 && (
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              className="mt-1 flex items-center justify-between rounded-lg border border-border bg-surface-2/50 hover:bg-surface-2 hover:border-accent/40 px-3 py-2 text-xs text-muted transition active:scale-[0.99]"
            >
              <span>+ {rest.length} more species in season</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      <SpeciesDetailSheet
        species={selected}
        onClose={() => setSelected(null)}
      />

      <BottomSheet
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        title="More species in season"
      >
        <div className="flex flex-col gap-2">
          <div className="text-xs text-muted">
            Less commonly caught here, but possible right now. Tap any one
            for tactics + lures.
          </div>
          {rest.map((s) => (
            <SpeciesRow key={s.id} species={s} onOpen={() => openSpecies(s)} />
          ))}
        </div>
      </BottomSheet>
    </CardSection>
  );
}

function SpeciesRow({
  species,
  onOpen,
}: {
  species: SpeciesEntry;
  onOpen: () => void;
}) {
  const flyOrLures = species.tactics
    .flatMap((t) => t.lures.slice(0, 1))
    .slice(0, 2);
  return (
    <button
      type="button"
      onClick={onOpen}
      className="text-left rounded-lg bg-surface-2 border border-border p-2.5 hover:border-accent/40 active:scale-[0.99] transition"
    >
      <div className="flex items-baseline justify-between gap-2">
        <div className="text-sm font-semibold flex items-center gap-1.5">
          <Fish className="w-3.5 h-3.5 text-info" />
          {species.name}
          <ChevronRight className="w-3 h-3 text-muted" />
        </div>
      </div>
      <div className="text-xs text-muted italic mt-0.5">
        {species.scientific}
      </div>
      <div className="text-xs mt-1">{flyOrLures.join(' · ')}</div>
    </button>
  );
}

function SpeciesDetailSheet({
  species,
  onClose,
}: {
  species: SpeciesEntry | null;
  onClose: () => void;
}) {
  return (
    <BottomSheet
      open={species != null}
      onClose={onClose}
      title={species?.name}
    >
      {species && (
        <div className="flex flex-col gap-4">
          <div className="text-xs italic text-muted">{species.scientific}</div>
          {species.seasons.length > 0 && (
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted mb-1">
                When
              </div>
              <ul className="text-sm flex flex-col gap-1">
                {species.seasons.map((s, i) => (
                  <li key={i}>{s.label}</li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted mb-1">
              How
            </div>
            <ul className="flex flex-col gap-3">
              {species.tactics.map((t, i) => (
                <TacticRow key={i} tactic={t} />
              ))}
            </ul>
          </div>
          {species.notes && (
            <div className="text-xs text-muted">{species.notes}</div>
          )}
        </div>
      )}
    </BottomSheet>
  );
}

function TacticRow({ tactic }: { tactic: SpeciesTactic }) {
  return (
    <li className="rounded-lg bg-surface-2 border border-border p-2.5">
      <div className="text-xs uppercase tracking-wider text-accent">
        {tactic.method}
      </div>
      <ul className="text-sm mt-1 list-disc list-inside">
        {tactic.lures.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
      {tactic.notes && (
        <div className="text-xs text-muted mt-1.5">{tactic.notes}</div>
      )}
    </li>
  );
}

function waterLabel(type: Location['type']): string {
  switch (type) {
    case 'tailwater':
      return 'tailwater';
    case 'freestone':
      return 'river';
    case 'lake':
      return 'lake';
    case 'pond':
      return 'pond';
    case 'reservoir':
      return 'reservoir';
    case 'great_lakes':
      return 'Great Lakes';
    case 'saltwater':
      return 'saltwater';
  }
}
