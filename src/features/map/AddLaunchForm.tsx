import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Crosshair, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select } from '@/components/ui/Input';
import { BASEMAPS } from './basemaps';
import { friendlyError } from '@/lib/errors';
import { Timestamp } from 'firebase/firestore';
import { reverseGeocode } from '@/lib/geo/reverseGeocode';
import type { BoatLaunch } from '@/lib/boatLaunches/store';
import {
  newUserLaunchId,
  saveUserLaunch,
} from '@/lib/boatLaunches/userLaunches';

/**
 * Form for manually adding a boat launch / put-in / pier. Mirrors the
 * Add-Spot pin-drop UX so it feels familiar. Initial center can be the
 * user's current GPS or any lat/lng the caller supplies.
 */
export function AddLaunchForm({
  initialCenter,
  onCancel,
  onSaved,
}: {
  initialCenter?: { lat: number; lng: number };
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState('');
  const [type, setType] = useState<BoatLaunch['type']>('ramp');
  const [state, setState] = useState('');
  const [note, setNote] = useState('');
  const [lat, setLat] = useState<number | null>(initialCenter?.lat ?? null);
  const [lng, setLng] = useState<number | null>(initialCenter?.lng ?? null);
  const [busy, setBusy] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recenterKey, setRecenterKey] = useState(0);
  const [recenterTarget, setRecenterTarget] = useState<{ lat: number; lng: number; zoom: number } | null>(
    initialCenter ? { lat: initialCenter.lat, lng: initialCenter.lng, zoom: 14 } : null
  );

  const center: [number, number] = useMemo(
    () => [initialCenter?.lat ?? 39.5, initialCenter?.lng ?? -85.0],
    [initialCenter]
  );

  async function useMyLocation() {
    if (!('geolocation' in navigator)) {
      setError('Geolocation not available on this device');
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const la = pos.coords.latitude;
        const ln = pos.coords.longitude;
        setLat(la);
        setLng(ln);
        setRecenterTarget({ lat: la, lng: ln, zoom: 15 });
        setRecenterKey((k) => k + 1);
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        setError(`Couldn't get location: ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Give the launch a name');
      return;
    }
    if (lat == null || lng == null) {
      setError('Drop a pin on the map');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      // Best-effort state autofill if user hasn't typed one
      let stateCode = state.trim().toUpperCase();
      if (!stateCode) {
        try {
          const geo = await reverseGeocode(lat, lng);
          if (geo.state) stateCode = geo.state;
        } catch {
          // ignore — not fatal
        }
      }
      await saveUserLaunch({
        id: newUserLaunchId(),
        name: name.trim(),
        lat: Number(lat.toFixed(5)),
        lng: Number(lng.toFixed(5)),
        state: stateCode || 'XX',
        type,
        note: note.trim() || undefined,
        createdAt: Timestamp.now(),
      });
      onSaved();
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="flex flex-col gap-3">
      <Field label="Name">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tree Farm canoe access"
          autoFocus
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Type">
          <Select
            value={type}
            onChange={(e) => setType(e.target.value as BoatLaunch['type'])}
          >
            <option value="ramp">Boat ramp</option>
            <option value="put-in">Canoe / kayak put-in</option>
            <option value="pier">Pier</option>
            <option value="rental">Boat rental</option>
          </Select>
        </Field>
        <Field label="State (optional)">
          <Input
            value={state}
            onChange={(e) => setState(e.target.value)}
            maxLength={2}
            placeholder="MI"
          />
        </Field>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="text-xs uppercase tracking-wider text-muted">
            Drop pin
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={useMyLocation}
            disabled={locating}
          >
            {locating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Crosshair className="w-3.5 h-3.5" />
            )}
            {locating ? 'Locating…' : 'Use my location'}
          </Button>
        </div>
        <div className="h-56 rounded-xl overflow-hidden border border-border">
          <MapContainer
            center={center}
            zoom={initialCenter ? 14 : 4}
            scrollWheelZoom
            className="h-full w-full"
          >
            <TileLayer url={BASEMAPS.osm.url} attribution={BASEMAPS.osm.attribution} />
            <PinPicker
              lat={lat}
              lng={lng}
              onSet={(la, ln) => {
                setLat(la);
                setLng(ln);
              }}
            />
            <RecenterOnTarget target={recenterTarget} key={recenterKey} />
          </MapContainer>
        </div>
        <div className="text-xs text-muted num mt-1">
          {lat != null && lng != null
            ? `${lat.toFixed(5)}, ${lng.toFixed(5)}`
            : 'Tap the map to set a position'}
        </div>
      </div>

      <Field label="Note (optional)">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="Parking, ramp condition, etc."
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
          {busy ? 'Saving…' : 'Save launch'}
        </Button>
      </div>
    </form>
  );
}

const dropIcon = L.divIcon({
  html: `<div style="width:18px;height:18px;border-radius:50%;background:#4ade80;border:3px solid #0a0e0a;box-shadow:0 0 0 2px #4ade80"></div>`,
  className: '',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function PinPicker({
  lat,
  lng,
  onSet,
}: {
  lat: number | null;
  lng: number | null;
  onSet: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onSet(e.latlng.lat, e.latlng.lng);
    },
  });
  useEffect(() => {}, [lat, lng]);
  if (lat == null || lng == null) return null;
  return <Marker position={[lat, lng]} icon={dropIcon} />;
}

function RecenterOnTarget({
  target,
}: {
  target: { lat: number; lng: number; zoom: number } | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (target) map.setView([target.lat, target.lng], target.zoom);
  }, [target, map]);
  return null;
}
