import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Input';
import type { Location } from '@/lib/providers/types';
import { upsertTrip } from '@/lib/journal/store';
import type { Trip } from '@/lib/journal/types';

export function StartTripForm({
  locations,
  onStarted,
  onCancel,
}: {
  locations: Location[];
  onStarted: (trip: Trip) => void;
  onCancel: () => void;
}) {
  const [selected, setSelected] = useState<string[]>(
    locations.length > 0 ? [locations[0].id] : []
  );
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(id: string) {
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );
  }

  async function start() {
    if (selected.length === 0) {
      setError('Pick at least one location');
      return;
    }
    setBusy(true);
    try {
      const now = new Date();
      const primary = locations.find((l) => l.id === selected[0]);
      const date = primary
        ? new Intl.DateTimeFormat('en-CA', {
            timeZone: primary.timezone,
          }).format(now)
        : now.toISOString().slice(0, 10);
      const trip: Trip = {
        id: `trip-${now.getTime()}`,
        date,
        locationIds: selected,
        startTime: now.toISOString(),
        endTime: undefined,
        notes: notes.trim() || undefined,
        photoUrls: [],
        createdAt: now.toISOString(),
      };
      await upsertTrip(trip);
      onStarted(trip);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Field label="Locations">
        <div className="flex flex-col gap-1.5">
          {locations.map((l) => {
            const on = selected.includes(l.id);
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => toggle(l.id)}
                className={`text-left px-3 py-2 rounded-xl border transition ${
                  on
                    ? 'bg-accent/10 border-accent text-text'
                    : 'bg-surface-2 border-border text-muted'
                }`}
              >
                <div className="text-sm font-medium text-text">{l.name}</div>
                <div className="text-xs text-muted">
                  {[l.river, l.type, l.state].filter(Boolean).join(' · ')}
                </div>
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Notes">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Plan, weather, who's along, etc."
          className="px-3 py-2 rounded-xl bg-surface-2 border border-border text-text placeholder:text-muted focus:outline-none focus:border-accent/60"
        />
      </Field>

      {error && <div className="text-sm text-danger">{error}</div>}

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={start} disabled={busy}>
          {busy ? 'Starting…' : 'Start trip'}
        </Button>
      </div>
    </div>
  );
}
