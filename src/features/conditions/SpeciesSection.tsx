import { useMemo, useState } from 'react';
import { Anchor, ChevronRight, Fish, Waves } from 'lucide-react';
import { CardSection } from '@/components/ui/Card';
import type { Location } from '@/lib/providers/types';
import {
  recommendedSpeciesForLocation,
  type SpeciesEntry,
  type SpeciesTactic,
} from '@/lib/species/store';
import { BottomSheet } from '@/components/ui/BottomSheet';
import {
  estimateTrollingDepth,
  type TrollingDepthEstimate,
} from '@/lib/trolling/depthEstimator';
import { fetchLakeData } from '@/lib/providers';
import { useAsync } from './useAsync';
import { matchWaterbody } from '@/lib/waterbodies/matcher';
import type {
  PatternEntry as WaterbodyPattern,
  SpeciesEntry as WaterbodySpecies,
  Waterbody,
} from '@/lib/waterbodies/types';

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

/**
 * Top-level switch. When the spot matches one of our Waters Guide
 * entries, use the waterbody-specific render path — species + "how"
 * patterns reflect that exact water (lily-pad bass on MI vs deep
 * rocky reservoir bass on TN, etc.). When there's no match, fall
 * back to the generic state-list logic.
 *
 * Split as separate components so the hook order in each path stays
 * stable regardless of which branch renders.
 */
export function SpeciesSection({ location }: { location: Location }) {
  const waterbody = useMemo(() => matchWaterbody(location), [location]);
  if (waterbody) {
    return <WaterbodySpeciesSection waterbody={waterbody} location={location} />;
  }
  return <GenericSpeciesSection location={location} />;
}

function GenericSpeciesSection({ location }: { location: Location }) {
  const [selected, setSelected] = useState<SpeciesEntry | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);

  const species = useMemo(
    () => recommendedSpeciesForLocation(location),
    [location]
  );
  const top = species.slice(0, VISIBLE_COUNT);
  const rest = species.slice(VISIBLE_COUNT);

  // Pull surface water temp for the spot when it has a lakeData
  // provider — refines the trolling-depth estimate for any species
  // that has a depth profile. Falls back to seasonal-only when no
  // lake data is configured (river spots, etc.).
  const lakeProvider = location.dataProviders.lakeData;
  const { state: lakeState } = useAsync(
    () =>
      lakeProvider
        ? fetchLakeData(lakeProvider, location)
        : Promise.resolve(null),
    [location.id, lakeProvider?.kind]
  );
  const surfaceTempF =
    lakeState.status === 'success' && lakeState.data
      ? lakeState.data.surfaceTempF
      : null;

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
            <SpeciesRow
              key={s.id}
              species={s}
              depth={depthFor(s, location, surfaceTempF)}
              onOpen={() => openSpecies(s)}
            />
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
        depth={selected ? depthFor(selected, location, surfaceTempF) : null}
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
            <SpeciesRow
              key={s.id}
              species={s}
              depth={depthFor(s, location, surfaceTempF)}
              onOpen={() => openSpecies(s)}
            />
          ))}
        </div>
      </BottomSheet>
    </CardSection>
  );
}

/**
 * Returns a trolling-depth estimate when the species has a profile
 * AND at least one of its tactics involves trolling. Skips species
 * that don't troll (panfish, bass, etc.).
 */
function depthFor(
  s: SpeciesEntry,
  location: Location,
  surfaceTempF: number | null
): TrollingDepthEstimate | null {
  const trolls = s.tactics.some((t) => t.method === 'troll');
  if (!trolls) return null;
  return estimateTrollingDepth({
    location,
    speciesId: s.id,
    speciesName: s.name,
    surfaceTempF,
  });
}

function SpeciesRow({
  species,
  depth,
  onOpen,
}: {
  species: SpeciesEntry;
  depth: TrollingDepthEstimate | null;
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
        {depth && (
          <span
            className="inline-flex items-center gap-1 text-[11px] text-info bg-info/10 border border-info/30 rounded-full px-1.5 py-0.5 num shrink-0"
            title={depth.rationale}
          >
            <Anchor className="w-3 h-3" />
            {depth.depthRangeFt[0]}-{depth.depthRangeFt[1]} ft
          </span>
        )}
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
  depth,
  onClose,
}: {
  species: SpeciesEntry | null;
  depth: TrollingDepthEstimate | null;
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
          {depth && <TrollingDepthBlock depth={depth} />}
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

/**
 * Trolling depth + thermocline + rationale block. Renders only when
 * the species has a curated trolling profile AND the spot is a
 * trolling-relevant water type. Includes a disclosure of HOW the
 * model works so the user understands "this isn't a live scrape of
 * fishing reports — it's the consensus from those reports baked into
 * the seasonal + thermal model."
 */
function TrollingDepthBlock({ depth }: { depth: TrollingDepthEstimate }) {
  const confidenceTone =
    depth.confidence === 'high'
      ? 'text-accent'
      : depth.confidence === 'medium'
      ? 'text-info'
      : 'text-muted';
  return (
    <div className="rounded-lg bg-info/5 border border-info/30 p-3 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Anchor className="w-4 h-4 text-info" />
        <div className="text-sm font-semibold">
          Trolling depth · {depth.depthRangeFt[0]}-{depth.depthRangeFt[1]} ft
        </div>
        <span className={`text-[10px] uppercase tracking-wider ml-auto ${confidenceTone}`}>
          {depth.confidence}
        </span>
      </div>
      <div className="text-xs text-muted leading-snug">
        {depth.rationale}
      </div>
      {depth.thermoclineFt != null && (
        <div className="text-[11px] text-muted num">
          🌡️ Thermocline ~{depth.thermoclineFt} ft — set riggers 5-10 ft
          above for active fish, right at the boundary for staging.
        </div>
      )}
      <div className="text-[10px] text-muted/80 leading-snug">
        Estimate from seasonal pattern + species thermal preference,
        distilled from Great Lakes charter reports + state DNR forecasts.
        Start here, then trust your sonar.
      </div>
    </div>
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

// ============================================================
// Waterbody-aware render path
// ============================================================

/**
 * Sort waterbody species by importance so the "signature" fish lead.
 * Signature > strong > good > present. Within each tier, preserve
 * the JSON order (curator-chosen).
 */
const IMPORTANCE_ORDER: Record<WaterbodySpecies['importance'], number> = {
  signature: 0,
  strong: 1,
  good: 2,
  present: 3,
};

/**
 * Token overlap match between a pattern's `target` field and a species
 * name. Patterns target free-text species lists like "Brown + rainbow
 * trout" or "Largemouth + crappie" — we want any species in either
 * side to map to the right patterns.
 */
function patternsForSpecies(
  speciesName: string,
  patterns: WaterbodyPattern[]
): WaterbodyPattern[] {
  const needle = speciesName.toLowerCase();
  // Bag-of-tokens match: split species name into tokens, see which
  // patterns mention any of those tokens in their target field.
  const tokens = needle
    .split(/[\s/]+/)
    .filter((t) => t.length >= 4 && t !== 'bass' && t !== 'trout');
  // Always include the full species name as a phrase check first.
  return patterns.filter((p) => {
    const hay = p.target.toLowerCase();
    if (hay.includes(needle)) return true;
    return tokens.some((t) => hay.includes(t));
  });
}

function WaterbodySpeciesSection({
  waterbody,
  location,
}: {
  waterbody: Waterbody;
  location: Location;
}) {
  const [selected, setSelected] = useState<WaterbodySpecies | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);

  // Sort by importance — signature species lead.
  const sortedSpecies = useMemo(() => {
    return [...waterbody.species].sort(
      (a, b) => IMPORTANCE_ORDER[a.importance] - IMPORTANCE_ORDER[b.importance]
    );
  }, [waterbody]);

  const top = sortedSpecies.slice(0, VISIBLE_COUNT);
  const rest = sortedSpecies.slice(VISIBLE_COUNT);

  // Suggest preferred trolling depth for "trolling" patterns when
  // a species has any. Generic state-list logic relies on a curated
  // depth profile; here we just surface the pattern's `where` field,
  // which the waterbody curator already wrote with depth specifics.
  void location;

  return (
    <CardSection label="What's biting + how">
      {/* Tiny header tying the data to the specific waterbody so the
          user understands why these picks differ from a generic state
          list — "this is what's caught here, not just in MI". */}
      <div className="text-[11px] text-muted mb-2 leading-snug flex items-start gap-1">
        <Waves className="w-3 h-3 mt-0.5 flex-none text-info" />
        <span>
          Curated for <b>{waterbody.name}</b>. Tap any species for
          waterbody-specific tactics.
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {top.map((s, i) => (
          <WaterbodySpeciesRow
            key={`${s.name}:${i}`}
            species={s}
            patternCount={patternsForSpecies(s.name, waterbody.patterns).length}
            onOpen={() => {
              setMoreOpen(false);
              setSelected(s);
            }}
          />
        ))}
        {rest.length > 0 && (
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className="mt-1 flex items-center justify-between rounded-lg border border-border bg-surface-2/50 hover:bg-surface-2 hover:border-accent/40 px-3 py-2 text-xs text-muted transition active:scale-[0.99]"
          >
            <span>+ {rest.length} more species here</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <WaterbodySpeciesDetailSheet
        species={selected}
        waterbody={waterbody}
        onClose={() => setSelected(null)}
      />

      <BottomSheet
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        title={`More species at ${waterbody.name}`}
      >
        <div className="flex flex-col gap-2">
          <div className="text-xs text-muted">
            Less commonly targeted here, but present. Tap for tactics.
          </div>
          {rest.map((s, i) => (
            <WaterbodySpeciesRow
              key={`${s.name}:${i}`}
              species={s}
              patternCount={patternsForSpecies(s.name, waterbody.patterns).length}
              onOpen={() => {
                setMoreOpen(false);
                setSelected(s);
              }}
            />
          ))}
        </div>
      </BottomSheet>
    </CardSection>
  );
}

function WaterbodySpeciesRow({
  species,
  patternCount,
  onOpen,
}: {
  species: WaterbodySpecies;
  patternCount: number;
  onOpen: () => void;
}) {
  // Importance pill mirrors the WaterbodyDetailSheet styling so the
  // user sees consistent visual language between Conditions card +
  // Waters Guide.
  const importStyle: Record<WaterbodySpecies['importance'], string> = {
    signature: 'border-accent/40 bg-accent/15 text-accent',
    strong: 'border-info/40 bg-info/10 text-info',
    good: 'border-border bg-surface-2 text-text/80',
    present: 'border-border bg-surface-2/50 text-muted',
  };
  return (
    <button
      type="button"
      onClick={onOpen}
      className="text-left rounded-lg bg-surface-2 border border-border p-2.5 hover:border-accent/40 active:scale-[0.99] transition"
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="text-sm font-semibold flex items-center gap-1.5 min-w-0">
          <Fish className="w-3.5 h-3.5 text-info flex-none" />
          <span className="truncate">{species.name}</span>
          <ChevronRight className="w-3 h-3 text-muted flex-none" />
        </div>
        <span
          className={`px-1.5 py-0.5 rounded-md text-[9px] uppercase tracking-wider border whitespace-nowrap flex-none ${importStyle[species.importance]}`}
        >
          {species.importance}
        </span>
      </div>
      {(species.size || species.notes) && (
        <div className="text-[11px] text-muted leading-snug mt-0.5">
          {species.size && <span>{species.size}</span>}
          {species.size && species.notes && <span> · </span>}
          {species.notes && <span>{species.notes}</span>}
        </div>
      )}
      {patternCount > 0 && (
        <div className="text-[11px] text-info/80 mt-1">
          {patternCount} pattern{patternCount === 1 ? '' : 's'} for this
          species at this water
        </div>
      )}
    </button>
  );
}

function WaterbodySpeciesDetailSheet({
  species,
  waterbody,
  onClose,
}: {
  species: WaterbodySpecies | null;
  waterbody: Waterbody;
  onClose: () => void;
}) {
  // Filter the waterbody's patterns to ones targeting this species.
  // If none match (rare — curator may not have written one for every
  // species), fall back to the full pattern list so the user still
  // sees waterbody-specific tactics.
  const matchedPatterns = useMemo(() => {
    if (!species) return [];
    const m = patternsForSpecies(species.name, waterbody.patterns);
    return m.length > 0 ? m : [];
  }, [species, waterbody]);

  return (
    <BottomSheet open={species != null} onClose={onClose} title={species?.name}>
      {species && (
        <div className="flex flex-col gap-4">
          {/* Identity block — same look as Waters Guide for visual
              continuity. Size + notes carry the field-mark detail. */}
          <div className="rounded-lg border border-border bg-surface-2/40 p-3">
            <div className="text-xs text-muted leading-relaxed">
              {species.size && (
                <div>
                  <b>Size class:</b> {species.size}
                </div>
              )}
              {species.notes && (
                <div className="mt-1">{species.notes}</div>
              )}
              <div className="mt-1 text-[10px] uppercase tracking-wider text-info">
                {species.importance} target at {waterbody.name}
              </div>
            </div>
          </div>

          {/* HOW — waterbody-specific patterns. This is the section the
              user explicitly asked to be "appropriate to the body of
              water" (lily pads in MI vs deep rocky TN reservoir). */}
          {matchedPatterns.length > 0 ? (
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted mb-1.5 flex items-center gap-1">
                <Waves className="w-3 h-3" />
                How — tactics specific to {waterbody.name}
              </div>
              <div className="flex flex-col gap-2">
                {matchedPatterns.map((p, i) => (
                  <WaterbodyPatternCard key={i} pattern={p} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-xs text-muted">
              No water-specific pattern written for this species yet —
              consult the Waters Guide for general tactics on{' '}
              {waterbody.name}.
            </div>
          )}
        </div>
      )}
    </BottomSheet>
  );
}

function WaterbodyPatternCard({ pattern }: { pattern: WaterbodyPattern }) {
  return (
    <div className="rounded-lg border border-border bg-surface-2/40 p-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="text-sm font-semibold">{pattern.title}</div>
        <span className="text-[10px] text-accent border border-accent/40 bg-accent/10 px-1.5 py-0.5 rounded-md whitespace-nowrap">
          {pattern.target}
        </span>
      </div>
      <div className="text-[11px] text-muted mt-1">
        <b>When:</b> {pattern.when}
      </div>
      <div className="text-xs text-text/90 mt-0.5">
        <b className="text-muted">How:</b> {pattern.technique}
      </div>
      <div className="text-xs text-text/90 mt-0.5">
        <b className="text-muted">Where:</b> {pattern.where}
      </div>
      {pattern.details && (
        <div className="text-[11px] text-muted leading-relaxed border-t border-border pt-1.5 mt-1.5">
          {pattern.details}
        </div>
      )}
    </div>
  );
}
