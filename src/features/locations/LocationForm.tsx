import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type {
  DamScheduleProvider,
  FlowProvider,
  Location,
  WaterType,
} from '@/lib/providers/types';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select } from '@/components/ui/Input';
import { BASEMAPS } from '@/features/map/basemaps';

const WATER_TYPES: WaterType[] = [
  'tailwater',
  'freestone',
  'lake',
  'pond',
  'reservoir',
  'great_lakes',
  'saltwater',
];

const COMMON_TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'America/Phoenix',
];

type FlowKind = '' | 'usgs' | 'env-canada' | 'uk-ea';
type DamKind = '' | 'tva' | 'usace' | 'consumers-energy' | 'manual';

const dropIcon = L.divIcon({
  html: `<div style="width:20px;height:20px;border-radius:50%;background:#4ade80;border:3px solid #0a0e0a;box-shadow:0 0 0 2px #4ade80"></div>`,
  className: '',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export function LocationForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Location;
  onSave: (loc: Location) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [river, setRiver] = useState(initial?.river ?? '');
  const [state, setState] = useState(initial?.state ?? '');
  const [country, setCountry] = useState(initial?.country ?? 'US');
  const [type, setType] = useState<WaterType>(initial?.type ?? 'tailwater');
  const [timezone, setTimezone] = useState(
    initial?.timezone ?? 'America/New_York'
  );
  const [lat, setLat] = useState<number | null>(initial?.lat ?? null);
  const [lng, setLng] = useState<number | null>(initial?.lng ?? null);

  const [flowKind, setFlowKind] = useState<FlowKind>(
    (initial?.dataProviders.flow?.kind ?? '') as FlowKind
  );
  const [flowSiteId, setFlowSiteId] = useState(
    initial?.dataProviders.flow?.kind === 'usgs'
      ? initial.dataProviders.flow.siteId
      : initial?.dataProviders.flow?.kind === 'env-canada'
      ? initial.dataProviders.flow.stationId
      : initial?.dataProviders.flow?.kind === 'uk-ea'
      ? initial.dataProviders.flow.stationRef
      : ''
  );

  const [damKind, setDamKind] = useState<DamKind>(
    (initial?.dataProviders.damSchedule?.kind ?? '') as DamKind
  );
  const [damName, setDamName] = useState(
    initial?.dataProviders.damSchedule?.kind === 'tva'
      ? initial.dataProviders.damSchedule.dam
      : initial?.dataProviders.damSchedule?.kind === 'consumers-energy'
      ? initial.dataProviders.damSchedule.dam
      : ''
  );

  const [error, setError] = useState<string | null>(null);

  const initialCenter: [number, number] = useMemo(
    () => [initial?.lat ?? 39.5, initial?.lng ?? -85.0],
    [initial?.lat, initial?.lng]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError('Name is required');
    if (lat == null || lng == null) return setError('Drop a pin on the map');

    const flow = makeFlowProvider(flowKind, flowSiteId.trim());
    const damSchedule = makeDamProvider(damKind, damName.trim());

    if (flowKind && flow == null) return setError('Flow site ID is required');
    if ((damKind === 'tva' || damKind === 'consumers-energy') && !damName)
      return setError('Dam name is required');

    const loc: Location = {
      id: initial?.id ?? slugify(name),
      name: name.trim(),
      river: river.trim() || undefined,
      state: state.trim().toUpperCase() || 'XX',
      country: country.trim().toUpperCase() || 'US',
      type,
      lat,
      lng,
      timezone,
      dataProviders: {
        weather: { kind: 'open-meteo' },
        ...(flow ? { flow } : {}),
        ...(damSchedule ? { damSchedule } : {}),
      },
    };
    onSave(loc);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Name">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Caney Fork at Happy Hollow"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="River">
          <Input
            value={river}
            onChange={(e) => setRiver(e.target.value)}
            placeholder="optional"
          />
        </Field>
        <Field label="Type">
          <Select value={type} onChange={(e) => setType(e.target.value as WaterType)}>
            {WATER_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Field label="State">
          <Input
            value={state}
            onChange={(e) => setState(e.target.value)}
            maxLength={2}
            placeholder="TN"
          />
        </Field>
        <Field label="Country">
          <Input value={country} onChange={(e) => setCountry(e.target.value)} />
        </Field>
        <Field label="Timezone">
          <Select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
            {COMMON_TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz.split('/')[1]}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div>
        <div className="text-xs uppercase tracking-wider text-muted mb-1">
          Drop pin
        </div>
        <div className="h-56 rounded-xl overflow-hidden border border-border">
          <MapContainer
            center={initialCenter}
            zoom={initial ? 11 : 4}
            scrollWheelZoom
            className="h-full w-full"
          >
            <TileLayer url={BASEMAPS.osm.url} attribution={BASEMAPS.osm.attribution} />
            <PinPicker lat={lat} lng={lng} onSet={(la, ln) => {
              setLat(la);
              setLng(ln);
            }} />
          </MapContainer>
        </div>
        <div className="text-xs text-muted mt-1 num">
          {lat != null && lng != null
            ? `${lat.toFixed(4)}, ${lng.toFixed(4)}`
            : 'Tap the map to set a position'}
        </div>
      </div>

      <div>
        <div className="text-xs uppercase tracking-wider text-muted mb-1">
          Providers
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Flow source">
            <Select
              value={flowKind}
              onChange={(e) => setFlowKind(e.target.value as FlowKind)}
            >
              <option value="">none</option>
              <option value="usgs">USGS</option>
              <option value="env-canada">Environment Canada</option>
              <option value="uk-ea">UK EA</option>
            </Select>
          </Field>
          {flowKind && (
            <Field label="Site/station ID">
              <Input
                value={flowSiteId}
                onChange={(e) => setFlowSiteId(e.target.value)}
                placeholder={flowKind === 'usgs' ? '03424860' : ''}
              />
            </Field>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <Field label="Dam schedule">
            <Select
              value={damKind}
              onChange={(e) => setDamKind(e.target.value as DamKind)}
            >
              <option value="">none</option>
              <option value="tva">TVA</option>
              <option value="usace">USACE</option>
              <option value="consumers-energy">Consumers Energy</option>
              <option value="manual">Manual entry</option>
            </Select>
          </Field>
          {(damKind === 'tva' || damKind === 'consumers-energy') && (
            <Field label="Dam name">
              <Input
                value={damName}
                onChange={(e) => setDamName(e.target.value)}
                placeholder="Center Hill"
              />
            </Field>
          )}
        </div>
      </div>

      {error && <div className="text-sm text-danger">{error}</div>}

      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}

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
  // useEffect dependency to satisfy linter when no marker exists.
  useEffect(() => {}, [lat, lng]);
  if (lat == null || lng == null) return null;
  return <Marker position={[lat, lng]} icon={dropIcon} />;
}

function makeFlowProvider(kind: FlowKind, value: string): FlowProvider | null {
  if (!kind) return null;
  if (!value) return null;
  if (kind === 'usgs') return { kind: 'usgs', siteId: value };
  if (kind === 'env-canada') return { kind: 'env-canada', stationId: value };
  if (kind === 'uk-ea') return { kind: 'uk-ea', stationRef: value };
  return null;
}

function makeDamProvider(kind: DamKind, dam: string): DamScheduleProvider | null {
  if (!kind) return null;
  if (kind === 'tva') return { kind: 'tva', dam };
  if (kind === 'consumers-energy') return { kind: 'consumers-energy', dam };
  if (kind === 'usace') return { kind: 'usace', district: '', project: '' };
  if (kind === 'manual') return { kind: 'manual' };
  return null;
}

function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60) ||
    `loc-${Date.now()}`
  );
}
