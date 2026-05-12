import { lazy, Suspense, useMemo, useState } from 'react';
import { BookOpen, MapPin, Plus, Pencil, Trash2 } from 'lucide-react';
import type { Location } from '@/lib/providers/types';
import type { LocationStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardSubtitle, CardTitle } from '@/components/ui/Card';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { LocationForm } from './LocationForm';
import { useFishability } from '@/features/map/useFishability';
import { fishabilityColor } from '@/lib/fishability';
import { distanceMi, useUserLocation } from '@/lib/userLocation';

/**
 * Lazy-load the Waters Guide — it bundles Leaflet for the embedded
 * mini-map plus the full 60-waterbody dataset, so we keep it off the
 * critical path until the user actually taps to open it.
 */
const WatersGuide = lazy(() =>
  import('@/features/waterbodies/WatersGuide').then((m) => ({
    default: m.WatersGuide,
  }))
);

type SheetState =
  | { kind: 'closed' }
  | { kind: 'create' }
  | { kind: 'edit'; loc: Location };

export function LocationsList({
  locations,
  store,
  onSpotCreated,
}: {
  locations: Location[];
  store: LocationStore;
  /**
   * Fires only when a NEW spot is saved from this list (not on edit).
   * App.tsx uses it to switch the user to the Map tab and pan the
   * camera to the new pin.
   */
  onSpotCreated?: (id: string) => void;
}) {
  const [sheet, setSheet] = useState<SheetState>({ kind: 'closed' });
  const [guideOpen, setGuideOpen] = useState(false);

  // States the user has spots in — drives which state the Waters
  // Guide defaults to. Falls back to 'IN' inside the guide if no
  // overlap with our data.
  const userStates = useMemo(() => {
    const seen = new Set<string>();
    for (const l of locations) if (l.state) seen.add(l.state.toUpperCase());
    return Array.from(seen);
  }, [locations]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm text-muted">
          {locations.length} spot{locations.length === 1 ? '' : 's'}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setGuideOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-info/15 border border-info/40 hover:bg-info/25 active:scale-[0.98] text-sm font-medium text-info transition"
            title="Browse lakes + rivers with species mix, patterns, and pin locations"
          >
            <BookOpen className="w-4 h-4" />
            Waters guide
          </button>
          <Button size="sm" onClick={() => setSheet({ kind: 'create' })}>
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>
      </div>

      {locations.length === 0 ? (
        <div className="text-center text-muted py-12">
          No spots yet — tap Add to drop your first pin.
        </div>
      ) : (
        locations.map((loc) => (
          <SpotCard
            key={loc.id}
            location={loc}
            onEdit={() => setSheet({ kind: 'edit', loc })}
            onDelete={() => {
              if (confirm(`Delete "${loc.name}"?`)) store.remove(loc.id);
            }}
          />
        ))
      )}

      <BottomSheet
        open={sheet.kind !== 'closed'}
        onClose={() => setSheet({ kind: 'closed' })}
        title={sheet.kind === 'edit' ? 'Edit spot' : 'Add a spot'}
      >
        {sheet.kind !== 'closed' && (
          <LocationForm
            initial={sheet.kind === 'edit' ? sheet.loc : undefined}
            onCancel={() => setSheet({ kind: 'closed' })}
            onSave={async (loc) => {
              const wasCreate = sheet.kind === 'create';
              await store.upsert(loc);
              setSheet({ kind: 'closed' });
              if (wasCreate) onSpotCreated?.(loc.id);
            }}
          />
        )}
      </BottomSheet>

      {/* Lazy-loaded; only fires its bundle when the user actually
          opens the guide. The guide itself manages its child detail
          sheet, so we only need to toggle the top-level open state. */}
      {guideOpen && (
        <Suspense fallback={null}>
          <WatersGuide
            open={guideOpen}
            onClose={() => setGuideOpen(false)}
            userStates={userStates}
          />
        </Suspense>
      )}
    </div>
  );
}

/**
 * One card in the Spots list. Pulled into its own component so the
 * per-spot `useFishability()` hook is legal (can't call hooks inside
 * a .map() callback). The hook spins up three provider fetches per
 * spot, same as the Map-tab markers — the same handful of fetches
 * the user already pays for if they've visited the Map tab this
 * session.
 *
 * Polish over the prior version:
 *   - Fishability dot (green / yellow / red) next to the name so you
 *     can tell which spots are firing at a glance
 *   - Distance-from-you chip when GPS is available
 *   - Lat/lng to 4 decimals (~11 m) instead of 3 (~111 m) so two
 *     close pins are distinguishable
 *   - 44 px touch targets on Pencil + Trash
 *   - Card has a bit more vertical breathing room
 */
function SpotCard({
  location,
  onEdit,
  onDelete,
}: {
  location: Location;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { rating } = useFishability(location);
  const userLoc = useUserLocation();
  const distance =
    userLoc != null
      ? distanceMi(userLoc, { lat: location.lat, lng: location.lng })
      : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 min-w-0">
              {/* Fishability dot — same color tokens as the Map-tab
                  markers. Falls back to a muted ring while rating is
                  resolving so the layout doesn't pop. */}
              <span
                className="w-2.5 h-2.5 rounded-full flex-none border border-border"
                style={{
                  backgroundColor:
                    rating === 'unknown' ? 'transparent' : fishabilityColor(rating),
                  borderColor:
                    rating === 'unknown' ? 'currentColor' : fishabilityColor(rating),
                  opacity: rating === 'unknown' ? 0.4 : 1,
                }}
                aria-label={`Fishability: ${rating}`}
                title={`Fishability: ${rating}`}
              />
              <CardTitle className="truncate">{location.name}</CardTitle>
            </div>
            <CardSubtitle>
              <span className="inline-flex items-center gap-1 flex-wrap">
                {[location.river, location.type, location.state]
                  .filter(Boolean)
                  .join(' · ')}
                {' · '}
                <span className="num">
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </span>
                {distance != null && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] text-info/90 ml-1">
                    <MapPin className="w-2.5 h-2.5" />
                    {formatDistance(distance)}
                  </span>
                )}
              </span>
            </CardSubtitle>
          </div>
          {/* Touch targets bumped to 44x44 px (per UI/UX guidelines in
              the plan — "He's holding a rod"). Buttons set
              size="icon" with explicit min sizing in the className
              for guaranteed mobile reachability. */}
          <div className="flex gap-1 flex-none">
            <Button
              size="icon"
              variant="ghost"
              aria-label="Edit"
              onClick={onEdit}
              className="min-w-11 min-h-11"
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              aria-label="Delete"
              onClick={onDelete}
              className="min-w-11 min-h-11"
            >
              <Trash2 className="w-4 h-4 text-danger" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <div className="px-4 pb-4 text-xs text-muted">
        {providerSummary(location)}
      </div>
    </Card>
  );
}

/** Compact distance string — '0.4 mi' / '12 mi' / '120 mi'. */
function formatDistance(mi: number): string {
  if (mi < 1) return `${mi.toFixed(1)} mi`;
  if (mi < 10) return `${mi.toFixed(1)} mi`;
  return `${Math.round(mi)} mi`;
}

function providerSummary(loc: Location): string {
  const parts: string[] = ['weather: open-meteo'];
  const f = loc.dataProviders.flow;
  if (f) {
    if (f.kind === 'usgs') parts.push(`flow: USGS ${f.siteId}`);
    else if (f.kind === 'env-canada')
      parts.push(`flow: EC ${f.stationId}`);
    else if (f.kind === 'uk-ea') parts.push(`flow: UK ${f.stationRef}`);
  }
  const d = loc.dataProviders.damSchedule;
  if (d) {
    if (d.kind === 'tva') parts.push(`dam: TVA ${d.dam}`);
    else if (d.kind === 'consumers-energy')
      parts.push(`dam: CE ${d.dam}`);
    else if (d.kind === 'usace') parts.push('dam: USACE');
    else parts.push('dam: manual');
  }
  return parts.join(' · ');
}
