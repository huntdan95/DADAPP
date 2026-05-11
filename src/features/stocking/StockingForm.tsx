import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Input';
import { saveStockingEvent } from '@/lib/stocking/store';
import { newStockingId } from '@/lib/stocking/types';
import type { Location } from '@/lib/providers/types';
import { useAuth } from '@/lib/useAuth';
import { friendlyError } from '@/lib/errors';

/**
 * Manual stocking-event contributor form. Pre-fills from the spot the
 * user is currently viewing. The spot binding is optional — leave it
 * unset for a statewide / generic-river entry.
 */
export function StockingForm({
  location,
  onCancel,
  onSaved,
}: {
  location: Location;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const auth = useAuth();
  const userEmail = auth.kind === 'signed-in' ? auth.user.email ?? undefined : undefined;

  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [species, setSpecies] = useState('Rainbow trout');
  const [count, setCount] = useState('');
  const [size, setSize] = useState('');
  const [bindToSpot, setBindToSpot] = useState(true);
  const [locationName, setLocationName] = useState(location.name);
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!species.trim()) {
      setError('Pick a species');
      return;
    }
    if (!locationName.trim()) {
      setError('Need a location name');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const id = newStockingId();
      await saveStockingEvent({
        id,
        date,
        species: species.trim(),
        count: count ? Number(count) : undefined,
        size: size.trim() || undefined,
        state: location.state.toUpperCase(),
        locationId: bindToSpot ? location.id : undefined,
        locationName: locationName.trim(),
        lat: location.lat,
        lng: location.lng,
        notes: notes.trim() || undefined,
        source: 'manual',
        contributorEmail: userEmail,
      });
      onSaved();
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="flex flex-col gap-4">
      <div className="text-xs text-muted">
        Quick way to share stocking intel with the rest of the group. Stocking
        truck pulled in? Saw the bulletin on the DNR page? Drop it here.
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Date">
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={today}
          />
        </Field>
        <Field label="Species">
          <Input
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            placeholder="Rainbow trout"
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Count (optional)">
          <Input
            type="number"
            inputMode="numeric"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            placeholder="1200"
          />
        </Field>
        <Field label="Size (optional)">
          <Input
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="9–11 in"
          />
        </Field>
      </div>

      <Field label="Location label">
        <Input
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          placeholder="Caney Fork at Happy Hollow"
        />
      </Field>

      <label className="flex items-center gap-2 text-xs text-muted cursor-pointer">
        <input
          type="checkbox"
          checked={bindToSpot}
          onChange={(e) => setBindToSpot(e.target.checked)}
          className="rounded"
        />
        Apply specifically to this spot ({location.name}). Uncheck if it's
        a broader stocking that affects multiple nearby waters.
      </label>

      <Field label="Notes (optional)">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Where on the river, gear/truck details, etc."
          className="px-3 py-2 rounded-xl bg-surface-2 border border-border text-text placeholder:text-muted focus:outline-none focus:border-accent/60"
        />
      </Field>

      {error && <div className="text-sm text-danger">{error}</div>}

      <div className="flex gap-2 justify-end pt-1">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
        <Button type="submit" disabled={busy}>
          {busy && <Loader2 className="w-4 h-4 animate-spin" />}
          {busy ? 'Saving…' : 'Save report'}
        </Button>
      </div>
    </form>
  );
}
