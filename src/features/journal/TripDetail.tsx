import { useEffect, useState } from 'react';
import { Fish, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { Location } from '@/lib/providers/types';
import type { Catch, Trip } from '@/lib/journal/types';
import { deleteCatch, deleteTrip, watchTripCatches } from '@/lib/journal/store';

export function TripDetail({
  trip,
  locations,
  onClose,
}: {
  trip: Trip;
  locations: Location[];
  onClose: () => void;
}) {
  const [catches, setCatches] = useState<Catch[]>([]);

  useEffect(() => watchTripCatches(trip.id, setCatches), [trip.id]);

  const tripLocations = locations.filter((l) => trip.locationIds.includes(l.id));
  const fmt = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="text-sm text-muted">
        {tripLocations.map((l) => l.name).join(' · ') || 'No locations'}
      </div>
      <div className="text-xs text-muted">
        Started {fmt.format(new Date(trip.startTime))}
        {trip.endTime && ` · Ended ${fmt.format(new Date(trip.endTime))}`}
      </div>
      {trip.notes && <div className="text-sm">{trip.notes}</div>}

      <div className="flex items-center justify-between mt-2">
        <h3 className="text-sm uppercase tracking-wider text-muted">
          Catches ({catches.length})
        </h3>
      </div>

      {catches.length === 0 ? (
        <div className="text-sm text-muted py-6 text-center">
          No catches logged on this trip.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {catches.map((c) => (
            <CatchRow
              key={c.id}
              c={c}
              locationName={
                tripLocations.find((l) => l.id === c.locationId)?.name ?? ''
              }
            />
          ))}
        </div>
      )}

      <div className="border-t border-border mt-3 pt-3 flex justify-between">
        <Button
          variant="ghost"
          onClick={async () => {
            if (!confirm(`Delete this trip and all ${catches.length} catches?`))
              return;
            await deleteTrip(trip.id);
            onClose();
          }}
        >
          <Trash2 className="w-4 h-4 text-danger" />
          Delete trip
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}

function CatchRow({ c, locationName }: { c: Catch; locationName: string }) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
  return (
    <div className="rounded-xl bg-surface-2 border border-border p-3 flex flex-col gap-1">
      <div className="flex justify-between gap-2">
        <div className="flex items-center gap-2">
          <Fish className="w-4 h-4 text-accent" />
          <div>
            <div className="text-sm font-semibold">
              {c.species}
              {c.lengthInches != null && (
                <span className="text-muted font-normal num">
                  {' '}
                  · {c.lengthInches}″
                </span>
              )}
              {c.weightOz != null && (
                <span className="text-muted font-normal num">
                  {' '}
                  · {c.weightOz} oz
                </span>
              )}
            </div>
            <div className="text-xs text-muted">
              {c.method} · {c.flyOrLure}
              {c.method === 'troll' && c.trollingDepthFt != null && (
                <span className="num"> · {c.trollingDepthFt} ft</span>
              )}
              {c.method === 'troll' && c.trollingSpeedMph != null && (
                <span className="num"> · {c.trollingSpeedMph} mph</span>
              )}
            </div>
          </div>
        </div>
        <div className="text-xs text-muted text-right shrink-0">
          <div className="num">{fmt.format(new Date(c.time))}</div>
          <div>{c.releasedOrKept}</div>
        </div>
      </div>
      {c.photoUrl && (
        <img
          src={c.photoUrl}
          alt={c.species}
          className="w-full max-h-64 object-cover rounded-lg mt-1"
        />
      )}
      {c.notes && <div className="text-xs text-muted mt-1">{c.notes}</div>}
      <div className="text-[10px] text-muted/80 mt-1 flex flex-wrap gap-x-2 num">
        <span>{Math.round(c.conditions.airTempF)}°F air</span>
        {c.conditions.waterTempF != null && (
          <span>{Math.round(c.conditions.waterTempF)}°F water</span>
        )}
        {c.conditions.flowCfs != null && (
          <span>{Math.round(c.conditions.flowCfs)} cfs</span>
        )}
        <span>
          {Math.round(c.conditions.pressureMb)} mb {c.conditions.pressureTrend}
        </span>
        {c.conditions.damStatus && <span>dam: {c.conditions.damStatus}</span>}
        {locationName && <span>· {locationName}</span>}
      </div>
      <button
        type="button"
        className="absolute"
        aria-hidden
        onClick={async () => {
          if (confirm('Delete this catch?'))
            await deleteCatch(c.tripId, c.id);
        }}
      />
    </div>
  );
}
