import { useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select } from '@/components/ui/Input';
import type { Location } from '@/lib/providers/types';
import {
  type Catch,
  type FishingMethod,
  type Trip,
  FISHING_METHODS,
} from '@/lib/journal/types';
import { upsertCatch, uploadCatchPhoto } from '@/lib/journal/store';
import { captureConditions } from '@/lib/journal/snapshot';

export function CatchForm({
  trip,
  locations,
  onSaved,
  onCancel,
}: {
  trip: Trip;
  locations: Location[];
  onSaved: () => void;
  onCancel: () => void;
}) {
  const tripLocations = locations.filter((l) => trip.locationIds.includes(l.id));
  const [locationId, setLocationId] = useState(
    tripLocations[0]?.id ?? trip.locationIds[0] ?? ''
  );
  const [species, setSpecies] = useState('');
  const [length, setLength] = useState('');
  const [weight, setWeight] = useState('');
  const [method, setMethod] = useState<FishingMethod>('fly');
  const [flyOrLure, setFlyOrLure] = useState('');
  const [depth, setDepth] = useState('');
  const [speed, setSpeed] = useState('');
  const [released, setReleased] = useState<'released' | 'kept'>('released');
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isTrolling = method === 'troll';
  const location = tripLocations.find((l) => l.id === locationId) ?? null;

  async function save() {
    if (!species.trim()) return setError('Species is required');
    if (!flyOrLure.trim()) return setError('Fly or lure is required');
    if (isTrolling && !depth) return setError('Trolling depth is required');
    if (!location) return setError('Pick a location');

    setBusy(true);
    setError(null);
    try {
      const conditions = await captureConditions(location);
      const id = `catch-${Date.now()}`;
      const lengthN = length ? Number(length) : undefined;
      const weightN = weight ? Number(weight) : undefined;
      const depthN = depth ? Number(depth) : undefined;
      const speedN = speed ? Number(speed) : undefined;

      let photoUrl: string | undefined;
      if (photo) {
        try {
          photoUrl = await uploadCatchPhoto(trip.id, id, photo);
        } catch (e) {
          // Save the catch without the photo if Storage isn't enabled or
          // upload fails — better to not lose the catch entry.
          console.warn('photo upload failed', e);
        }
      }

      const c: Catch = {
        id,
        tripId: trip.id,
        locationId,
        species: species.trim(),
        lengthInches: lengthN,
        weightOz: weightN,
        method,
        flyOrLure: flyOrLure.trim(),
        trollingDepthFt: isTrolling ? depthN : undefined,
        trollingSpeedMph: isTrolling ? speedN : undefined,
        releasedOrKept: released,
        time: new Date().toISOString(),
        notes: notes.trim() || undefined,
        photoUrl,
        conditions,
      };
      await upsertCatch(c);
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {tripLocations.length > 1 && (
        <Field label="Location">
          <Select
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
          >
            {tripLocations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </Select>
        </Field>
      )}

      <Field label="Species">
        <Input
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          placeholder="Brown trout, walleye, smallmouth…"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Length (in)">
          <Input
            type="number"
            inputMode="decimal"
            step="0.1"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            placeholder="optional"
          />
        </Field>
        <Field label="Weight (oz)">
          <Input
            type="number"
            inputMode="decimal"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="optional"
          />
        </Field>
      </div>

      <Field label="Method">
        <Select
          value={method}
          onChange={(e) => setMethod(e.target.value as FishingMethod)}
        >
          {FISHING_METHODS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </Select>
      </Field>

      <Field label={isTrolling ? 'Lure (incl. color/size)' : 'Fly / Lure'}>
        <Input
          value={flyOrLure}
          onChange={(e) => setFlyOrLure(e.target.value)}
          placeholder={
            isTrolling ? 'Stinger spoon, orange/silver, #2' : 'Hex pattern #6'
          }
        />
      </Field>

      {isTrolling && (
        <div className="grid grid-cols-2 gap-3 rounded-xl bg-surface-2/40 border border-border p-3">
          <Field label="Depth (ft)" hint="downrigger or estimated">
            <Input
              type="number"
              inputMode="decimal"
              step="0.5"
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
              placeholder="60"
            />
          </Field>
          <Field label="Speed (mph)">
            <Input
              type="number"
              inputMode="decimal"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(e.target.value)}
              placeholder="2.4"
            />
          </Field>
        </div>
      )}

      <Field label="Disposition">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setReleased('released')}
            className={`h-11 rounded-xl border transition ${
              released === 'released'
                ? 'bg-accent/15 border-accent text-text'
                : 'bg-surface-2 border-border text-muted'
            }`}
          >
            Released
          </button>
          <button
            type="button"
            onClick={() => setReleased('kept')}
            className={`h-11 rounded-xl border transition ${
              released === 'kept'
                ? 'bg-warn/15 border-warn text-text'
                : 'bg-surface-2 border-border text-muted'
            }`}
          >
            Kept
          </button>
        </div>
      </Field>

      <Field label="Photo">
        <label className="flex items-center gap-2 px-3 h-11 rounded-xl bg-surface-2 border border-border text-muted cursor-pointer hover:text-text">
          <Camera className="w-4 h-4" />
          {photo ? photo.name : 'Take or pick a photo (optional)'}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
          />
        </label>
      </Field>

      <Field label="Notes">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="What were they hitting? Anything to remember next time?"
          className="px-3 py-2 rounded-xl bg-surface-2 border border-border text-text placeholder:text-muted focus:outline-none focus:border-accent/60"
        />
      </Field>

      {error && <div className="text-sm text-danger">{error}</div>}

      <div className="flex gap-2 justify-end pt-1">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={save} disabled={busy}>
          {busy && <Loader2 className="w-4 h-4 animate-spin" />}
          {busy ? 'Saving…' : 'Log catch'}
        </Button>
      </div>
    </div>
  );
}
