import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Crosshair, Loader2, Wand2 } from 'lucide-react';
import type {
  DamScheduleProvider,
  FlowProvider,
  Location,
  WaterType,
} from '@/lib/providers/types';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select } from '@/components/ui/Input';
import { BASEMAPS } from '@/features/map/basemaps';
import { friendlyError } from '@/lib/errors';
import {
  nearestUsgsGauges,
  reverseGeocode,
  timezoneForState,
  type NearbyGauge,
} from '@/lib/geo/reverseGeocode';
import {
  nearestTideStations,
  type NearbyTideStation,
} from '@/lib/geo/nearestTideStations';

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
type DamKind = '' | 'tva' | 'usace' | 'consumers-energy' | 'manual' | 'auto';

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

  /**
   * Top-3 candidates collected during auto-fill. We auto-pick the closest
   * one but show the alternatives as buttons so the user can switch if
   * the auto-pick is wrong (e.g. nearest gauge is on a different river).
   */
  const [flowOptions, setFlowOptions] = useState<NearbyGauge[]>([]);
  const [tideStationId, setTideStationId] = useState<string>(
    initial?.dataProviders.tides?.stationId ?? ''
  );
  const [tideOptions, setTideOptions] = useState<NearbyTideStation[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [autoFilling, setAutoFilling] = useState(false);
  const [autoStatus, setAutoStatus] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  /** Externally-driven map recenter target (incremented after a "use my location" tap). */
  const [recenterKey, setRecenterKey] = useState(0);
  const [recenterTarget, setRecenterTarget] = useState<{ lat: number; lng: number; zoom: number } | null>(null);

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
        setRecenterTarget({ lat: la, lng: ln, zoom: 14 });
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

  const initialCenter: [number, number] = useMemo(
    () => [initial?.lat ?? 39.5, initial?.lng ?? -85.0],
    [initial?.lat, initial?.lng]
  );

  /**
   * Auto-fill state, timezone, river, and nearest USGS gauge from the
   * currently-dropped pin. Tries reverse-geocoding first (cheap), then
   * NWIS bbox search. Each step is best-effort — failures just leave
   * fields untouched.
   */
  async function autoFillFromPin() {
    if (lat == null || lng == null) {
      setAutoStatus('Drop a pin first');
      return;
    }
    setAutoFilling(true);
    setAutoStatus(null);
    const parts: string[] = [];
    try {
      const geo = await reverseGeocode(lat, lng).catch(() => null);
      if (geo?.state) {
        setState(geo.state);
        setTimezone(timezoneForState(geo.state));
        parts.push(`state ${geo.state}`);
      }
      if (geo?.country) setCountry(geo.country);
      if (geo?.river && !river) {
        setRiver(geo.river);
        parts.push(`river "${geo.river}"`);
      }

      // Pull top 3 USGS candidates so the user can override the auto-pick
      // (closest gauge isn't always on the right river — e.g. a forebay
      // gauge sometimes ranks before the downstream tailwater gauge).
      const gauges = await nearestUsgsGauges(lat, lng, 3).catch(() => [] as NearbyGauge[]);
      if (gauges.length > 0) {
        // Prefer the closest gauge that publishes water temp; otherwise
        // fall through to the absolute closest.
        const pick = gauges.find((g) => g.hasWaterTemp) ?? gauges[0];
        setFlowOptions(gauges);
        setFlowKind('usgs');
        setFlowSiteId(pick.siteId);
        parts.push(
          `gauge ${pick.siteId} (${pick.distanceMiles.toFixed(1)} mi${
            pick.hasWaterTemp ? ', water temp ✓' : ''
          })${gauges.length > 1 ? ` (+${gauges.length - 1} alternatives)` : ''}`
        );
        if (type === 'tailwater' && (damKind === '' || damKind === 'manual')) {
          setDamKind('auto');
          parts.push('dam status: auto from gauge');
        }
      } else {
        parts.push('no active USGS gauge within ~35 mi');
      }

      // Tide stations: ALWAYS check, regardless of the type field. Many
      // backwaters, marshes, and brackish creeks (Homosassa, Mosquito
      // Lagoon, low-country GA, etc) are tide-driven even when the user
      // didn't pick "saltwater" as the type. We cap the search at 50 mi
      // so inland pins return zero stations and we stay quiet there.
      const tides = await nearestTideStations(lat, lng, 3, 50).catch(
        () => [] as NearbyTideStation[]
      );
      if (tides.length > 0) {
        setTideOptions(tides);
        // Auto-pick the closest station so saving without further
        // interaction still wires up a tide provider.
        if (!tideStationId) setTideStationId(tides[0].stationId);
        parts.push(
          `tide station ${tides[0].stationId} (${tides[0].distanceMiles.toFixed(1)} mi)`
        );
      } else if (type === 'saltwater') {
        parts.push('no NOAA tide station within 50 mi');
      }

      setAutoStatus(parts.length > 0 ? `Filled: ${parts.join(' · ')}` : 'Nothing found');
    } catch (e) {
      setAutoStatus(friendlyError(e));
    } finally {
      setAutoFilling(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError('Name is required');
    if (lat == null || lng == null) return setError('Drop a pin on the map');

    const flow = makeFlowProvider(flowKind, flowSiteId.trim());
    const damSchedule = makeDamProvider(damKind, damName.trim(), flowSiteId.trim());
    // Save tides whenever a station is entered, regardless of water
    // type. Lots of brackish / tidal-creek spots aren't strictly
    // "saltwater" but the tide is the dominant signal.
    const tides = tideStationId.trim()
      ? { kind: 'noaa' as const, stationId: tideStationId.trim() }
      : null;

    if (flowKind && flow == null) return setError('Flow site ID is required');
    if ((damKind === 'tva' || damKind === 'consumers-energy') && !damName)
      return setError('Dam name is required');
    if (damKind === 'auto' && (!flow || flow.kind !== 'usgs'))
      return setError('Auto dam status needs a USGS flow gauge — pick one above');

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
        ...(tides ? { tides } : {}),
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
            <RecenterOnTarget target={recenterTarget} key={recenterKey} />
          </MapContainer>
        </div>
        <div className="flex items-center justify-between gap-2 mt-1">
          <div className="text-xs text-muted num">
            {lat != null && lng != null
              ? `${lat.toFixed(4)}, ${lng.toFixed(4)}`
              : 'Tap the map to set a position'}
          </div>
          {lat != null && lng != null && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={autoFillFromPin}
              disabled={autoFilling}
            >
              {autoFilling ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Wand2 className="w-3.5 h-3.5" />
              )}
              {autoFilling ? 'Looking up…' : 'Auto-fill from pin'}
            </Button>
          )}
        </div>
        {autoStatus && (
          <div className="text-[11px] text-accent mt-1">{autoStatus}</div>
        )}
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

        {flowOptions.length > 0 && (
          <div className="mt-2">
            <div className="text-[11px] uppercase tracking-wider text-muted mb-1">
              Nearby gauges — pick one
            </div>
            <div className="flex flex-col gap-1.5">
              {flowOptions.map((g) => {
                const selected = flowKind === 'usgs' && flowSiteId === g.siteId;
                return (
                  <button
                    key={g.siteId}
                    type="button"
                    onClick={() => {
                      setFlowKind('usgs');
                      setFlowSiteId(g.siteId);
                    }}
                    className={
                      'text-left px-3 py-2 rounded-lg border text-xs transition ' +
                      (selected
                        ? 'bg-accent/15 border-accent text-text'
                        : 'bg-surface-2 border-border text-muted hover:border-accent/40')
                    }
                  >
                    <div className="font-medium text-text">{g.name}</div>
                    <div className="num">
                      {g.siteId} · {g.distanceMiles.toFixed(1)} mi
                      {g.hasWaterTemp && ' · water temp ✓'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {(type === 'saltwater' || tideOptions.length > 0) && (
          <div className="mt-3">
            <Field
              label="NOAA tide station ID"
              hint={
                type !== 'saltwater'
                  ? 'Coast is close enough that tide info is meaningful — pick a station or clear to skip'
                  : undefined
              }
            >
              <Input
                value={tideStationId}
                onChange={(e) => setTideStationId(e.target.value)}
                placeholder="8726520"
              />
            </Field>
            {tideOptions.length > 0 && (
              <div className="mt-2">
                <div className="text-[11px] uppercase tracking-wider text-muted mb-1">
                  Nearby tide stations — pick one
                </div>
                <div className="flex flex-col gap-1.5">
                  {tideOptions.map((s) => {
                    const selected = tideStationId === s.stationId;
                    return (
                      <button
                        key={s.stationId}
                        type="button"
                        onClick={() => setTideStationId(s.stationId)}
                        className={
                          'text-left px-3 py-2 rounded-lg border text-xs transition ' +
                          (selected
                            ? 'bg-accent/15 border-accent text-text'
                            : 'bg-surface-2 border-border text-muted hover:border-accent/40')
                        }
                      >
                        <div className="font-medium text-text">{s.name}</div>
                        <div className="num">
                          {s.stationId}
                          {s.state ? ` · ${s.state}` : ''} ·{' '}
                          {s.distanceMiles.toFixed(1)} mi
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mt-3">
          <Field
            label="Dam schedule"
            hint={
              damKind === 'auto'
                ? 'Status derived from your flow gauge — no setup'
                : undefined
            }
          >
            <Select
              value={damKind}
              onChange={(e) => setDamKind(e.target.value as DamKind)}
            >
              <option value="">none</option>
              <option value="auto">Auto (from flow gauge)</option>
              <option value="manual">Manual entry</option>
              <option value="tva">TVA (manual)</option>
              <option value="usace">USACE (manual)</option>
              <option value="consumers-energy">Consumers Energy (manual)</option>
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

function makeFlowProvider(kind: FlowKind, value: string): FlowProvider | null {
  if (!kind) return null;
  if (!value) return null;
  if (kind === 'usgs') return { kind: 'usgs', siteId: value };
  if (kind === 'env-canada') return { kind: 'env-canada', stationId: value };
  if (kind === 'uk-ea') return { kind: 'uk-ea', stationRef: value };
  return null;
}

function makeDamProvider(
  kind: DamKind,
  dam: string,
  flowSiteId: string
): DamScheduleProvider | null {
  if (!kind) return null;
  if (kind === 'tva') return { kind: 'tva', dam };
  if (kind === 'consumers-energy') return { kind: 'consumers-energy', dam };
  if (kind === 'usace') return { kind: 'usace', district: '', project: '' };
  if (kind === 'manual') return { kind: 'manual' };
  if (kind === 'auto' && flowSiteId)
    return { kind: 'auto', flowSiteId };
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
