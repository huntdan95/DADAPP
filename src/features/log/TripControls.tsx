import { useEffect, useState } from 'react';
import { CheckCircle2, Flag, Loader2, Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Field, Input, Select } from '@/components/ui/Input';
import {
  endTrip,
  startTrip,
  watchActiveTrip,
} from '@/lib/trips/store';
import type { Trip } from '@/lib/trips/types';
import type { Location } from '@/lib/providers/types';
import { friendlyError } from '@/lib/errors';
import { sortLocationsForPicker } from '@/lib/locations/sort';

/**
 * Trip start/stop pill for the Log tab. Subscribes to the active trip
 * via watchActiveTrip — if one is running, shows a green "Trip
 * active" chip with elapsed time and an "End trip" button. Otherwise
 * shows a "Start trip" button that opens a chooser sheet.
 */
export function TripControls({
  locations,
  onTripChange,
}: {
  locations: Location[];
  /** Called when the active trip changes — parent can pipe this into QuickLog. */
  onTripChange?: (trip: Trip | null) => void;
}) {
  const [active, setActive] = useState<Trip | null>(null);
  const [startSheetOpen, setStartSheetOpen] = useState(false);
  const [summarySheet, setSummarySheet] = useState<Trip | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      return watchActiveTrip((t) => {
        setActive(t);
        onTripChange?.(t);
      });
    } catch {
      return undefined;
    }
  }, [onTripChange]);

  async function handleEnd() {
    if (!active) return;
    setBusy(true);
    setError(null);
    try {
      const closed = await endTrip(active.id);
      setSummarySheet(closed);
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  }

  if (active) {
    return (
      <>
        <div className="rounded-xl border border-accent/40 bg-accent/10 px-3 py-2 flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-accent/20 shrink-0">
            <Flag className="w-3.5 h-3.5 text-accent" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">
              Trip active
              {active.name ? `: ${active.name}` : ''}
            </div>
            <div className="text-[11px] text-muted num">
              Started {formatRelative(active.startTime)}
              {active.primaryLocationName &&
                ` · ${active.primaryLocationName}`}
            </div>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleEnd}
            disabled={busy}
          >
            {busy ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Square className="w-3.5 h-3.5" />
            )}
            End
          </Button>
        </div>
        {error && <div className="text-xs text-danger -mt-2">{error}</div>}
        <TripSummarySheet
          trip={summarySheet}
          onClose={() => setSummarySheet(null)}
        />
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setStartSheetOpen(true)}
        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-surface-2/50 hover:bg-surface-2 hover:border-accent/40 text-xs text-muted transition active:scale-[0.99]"
      >
        <Play className="w-3.5 h-3.5" />
        Start trip — tag the next few logs together
      </button>

      <BottomSheet
        open={startSheetOpen}
        onClose={() => setStartSheetOpen(false)}
        title="Start a trip"
      >
        {startSheetOpen && (
          <StartTripForm
            locations={locations}
            onCancel={() => setStartSheetOpen(false)}
            onStarted={() => setStartSheetOpen(false)}
          />
        )}
      </BottomSheet>
    </>
  );
}

function StartTripForm({
  locations,
  onCancel,
  onStarted,
}: {
  locations: Location[];
  onCancel: () => void;
  onStarted: () => void;
}) {
  const [name, setName] = useState('');
  const [locationId, setLocationId] = useState<string>(
    locations[0]?.id ?? ''
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const loc = locations.find((l) => l.id === locationId);
      await startTrip({
        location: loc,
        name: name.trim() || undefined,
      });
      onStarted();
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={start} className="flex flex-col gap-4">
      <div className="text-xs text-muted">
        While a trip is active, every log you save gets tagged with it.
        You'll get a summary at the end — catches, hatches, total time.
      </div>

      <Field label="Trip name (optional)">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Sunday at Caney"
          autoFocus
        />
      </Field>

      {locations.length > 0 && (
        <Field label="Primary spot (optional)">
          <Select
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
          >
            <option value="">— none —</option>
            {sortLocationsForPicker(locations).map((l) => (
              <option key={l.id} value={l.id}>
                [{l.state}] {l.name}
              </option>
            ))}
          </Select>
        </Field>
      )}

      {error && <div className="text-sm text-danger">{error}</div>}

      <div className="flex gap-2 justify-end pt-1">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
        <Button type="submit" disabled={busy}>
          {busy && <Loader2 className="w-4 h-4 animate-spin" />}
          {busy ? 'Starting…' : 'Start trip'}
        </Button>
      </div>
    </form>
  );
}

function TripSummarySheet({
  trip,
  onClose,
}: {
  trip: Trip | null;
  onClose: () => void;
}) {
  if (!trip) return null;
  const hours = trip.endTime
    ? (new Date(trip.endTime).getTime() - new Date(trip.startTime).getTime()) /
      3_600_000
    : 0;

  return (
    <BottomSheet open={trip != null} onClose={onClose} title="Trip wrapped">
      <div className="flex flex-col gap-4">
        <div className="rounded-xl bg-accent/10 border border-accent/40 p-4 flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-accent shrink-0" />
          <div>
            <div className="font-semibold">
              {trip.name ?? 'Trip'} ended
            </div>
            <div className="text-xs text-muted mt-1">
              {hours.toFixed(1)} hrs on the water · {trip.entryCount ?? 0}{' '}
              entries logged
            </div>
            {trip.primaryLocationName && (
              <div className="text-xs text-muted">
                Primary spot: {trip.primaryLocationName}
              </div>
            )}
          </div>
        </div>
        <div className="text-xs text-muted">
          The entries you logged during this trip are tagged with it. Open
          any of them from the feed to see the trip context.
        </div>
        <div className="flex justify-end">
          <Button onClick={onClose}>Done</Button>
        </div>
      </div>
    </BottomSheet>
  );
}

function formatRelative(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  const remMin = mins % 60;
  return `${hrs}h ${remMin}m ago`;
}
