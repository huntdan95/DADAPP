import { useEffect, useState } from 'react';
import { Plus, Play, Square, Fish } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardSubtitle, CardTitle } from '@/components/ui/Card';
import { BottomSheet } from '@/components/ui/BottomSheet';
import type { Location } from '@/lib/providers/types';
import type { Trip, Catch } from '@/lib/journal/types';
import {
  listTrips,
  upsertTrip,
  watchActiveTrip,
  watchTripCatches,
} from '@/lib/journal/store';
import { StartTripForm } from './StartTripForm';
import { CatchForm } from './CatchForm';
import { TripDetail } from './TripDetail';
import { AskClaude } from './AskClaude';

type Sheet =
  | { kind: 'closed' }
  | { kind: 'start' }
  | { kind: 'catch' }
  | { kind: 'detail'; trip: Trip };

export function Journal({
  locations,
  isFirebaseConfigured,
}: {
  locations: Location[];
  isFirebaseConfigured: boolean;
}) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [active, setActive] = useState<Trip | null>(null);
  const [activeCatches, setActiveCatches] = useState<Catch[]>([]);
  const [sheet, setSheet] = useState<Sheet>({ kind: 'closed' });

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    return listTrips(setTrips);
  }, [isFirebaseConfigured]);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    return watchActiveTrip(setActive);
  }, [isFirebaseConfigured]);

  useEffect(() => {
    if (!active) {
      setActiveCatches([]);
      return;
    }
    return watchTripCatches(active.id, setActiveCatches);
  }, [active]);

  if (!isFirebaseConfigured) {
    return (
      <div className="text-center text-muted py-12 px-4">
        Sign in to enable trip journaling. Without Firebase, the conditions
        dashboard still works — but trips and catches need persistent storage.
      </div>
    );
  }

  const past = trips.filter((t) => t.endTime != null);

  return (
    <div className="flex flex-col gap-3">
      {active ? (
        <ActiveTripBanner
          trip={active}
          locations={locations}
          catchCount={activeCatches.length}
          onLogCatch={() => setSheet({ kind: 'catch' })}
          onEnd={async () => {
            await upsertTrip({ ...active, endTime: new Date().toISOString() });
          }}
        />
      ) : (
        <Button onClick={() => setSheet({ kind: 'start' })} className="w-full">
          <Play className="w-4 h-4" />
          Start a trip
        </Button>
      )}

      {past.length === 0 ? (
        <div className="text-center text-muted py-8 text-sm">
          No past trips yet — your first ended trip will show up here.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <h3 className="text-xs uppercase tracking-wider text-muted mt-2">
            Past trips
          </h3>
          {past.map((t) => (
            <TripCard
              key={t.id}
              trip={t}
              locations={locations}
              onOpen={() => setSheet({ kind: 'detail', trip: t })}
            />
          ))}
        </div>
      )}

      <AskClaude />

      <BottomSheet
        open={sheet.kind !== 'closed'}
        onClose={() => setSheet({ kind: 'closed' })}
        title={
          sheet.kind === 'start'
            ? 'Start a trip'
            : sheet.kind === 'catch'
            ? 'Log a catch'
            : sheet.kind === 'detail'
            ? sheet.trip.date
            : undefined
        }
      >
        {sheet.kind === 'start' && (
          <StartTripForm
            locations={locations}
            onCancel={() => setSheet({ kind: 'closed' })}
            onStarted={() => setSheet({ kind: 'closed' })}
          />
        )}
        {sheet.kind === 'catch' && active && (
          <CatchForm
            trip={active}
            locations={locations}
            onCancel={() => setSheet({ kind: 'closed' })}
            onSaved={() => setSheet({ kind: 'closed' })}
          />
        )}
        {sheet.kind === 'detail' && (
          <TripDetail
            trip={sheet.trip}
            locations={locations}
            onClose={() => setSheet({ kind: 'closed' })}
          />
        )}
      </BottomSheet>
    </div>
  );
}

function ActiveTripBanner({
  trip,
  locations,
  catchCount,
  onLogCatch,
  onEnd,
}: {
  trip: Trip;
  locations: Location[];
  catchCount: number;
  onLogCatch: () => void;
  onEnd: () => void;
}) {
  const tripLocations = locations.filter((l) => trip.locationIds.includes(l.id));
  return (
    <Card className="border-accent/40 bg-accent/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inset-0 rounded-full bg-accent opacity-75" />
            <span className="relative rounded-full h-2 w-2 bg-accent" />
          </span>
          Active trip
        </CardTitle>
        <CardSubtitle>
          {tripLocations.map((l) => l.name).join(' · ')} · {catchCount} catch
          {catchCount === 1 ? '' : 'es'}
        </CardSubtitle>
      </CardHeader>
      <div className="px-4 pb-4 grid grid-cols-2 gap-2">
        <Button onClick={onLogCatch} size="lg">
          <Plus className="w-4 h-4" /> Log catch
        </Button>
        <Button onClick={onEnd} size="lg" variant="secondary">
          <Square className="w-4 h-4" /> End trip
        </Button>
      </div>
    </Card>
  );
}

function TripCard({
  trip,
  locations,
  onOpen,
}: {
  trip: Trip;
  locations: Location[];
  onOpen: () => void;
}) {
  const tripLocations = locations.filter((l) => trip.locationIds.includes(l.id));
  return (
    <button type="button" onClick={onOpen} className="text-left">
      <Card className="hover:bg-surface-2/30 transition">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{trip.date}</CardTitle>
              <CardSubtitle>
                {tripLocations.map((l) => l.name).join(' · ')}
              </CardSubtitle>
            </div>
            <Fish className="w-5 h-5 text-muted" />
          </div>
        </CardHeader>
      </Card>
    </button>
  );
}
