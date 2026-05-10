import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Anchor, Crosshair, Loader2 } from 'lucide-react';
import { BASEMAPS, type BasemapKey } from './basemaps';
import { MapMarker } from './MapMarker';
import { BoatLaunchLayer } from './BoatLaunchLayer';
import type { Location } from '@/lib/providers/types';
import { ConditionsCard } from '@/features/conditions/ConditionsCard';
import { BottomSheet } from '@/components/ui/BottomSheet';
import {
  type BoatLaunch,
  distanceMiles,
  listAllBoatLaunches,
} from '@/lib/boatLaunches/store';
import { cn } from '@/lib/utils';

export function MapView({ locations }: { locations: Location[] }) {
  const [basemap, setBasemap] = useState<BasemapKey>('osm');
  const [selected, setSelected] = useState<Location | null>(null);
  const [showLaunches, setShowLaunches] = useState(true);
  const [launches, setLaunches] = useState<BoatLaunch[]>([]);
  const [launchesLoaded, setLaunchesLoaded] = useState(false);
  const [findingLocation, setFindingLocation] = useState(false);
  const [nearest, setNearest] = useState<{
    user: { lat: number; lng: number };
    list: Array<BoatLaunch & { miles: number }>;
  } | null>(null);
  const [recenterTo, setRecenterTo] = useState<
    { lat: number; lng: number; zoom: number } | null
  >(null);

  // Lazy-load boat launches once. ~7K records cached client-side after the
  // first read; subsequent map mounts reuse module-level cache.
  useEffect(() => {
    if (launchesLoaded) return;
    let cancelled = false;
    listAllBoatLaunches()
      .then((list) => {
        if (cancelled) return;
        setLaunches(list);
        setLaunchesLoaded(true);
      })
      .catch(() => {
        if (cancelled) return;
        setLaunchesLoaded(true);   // empty is fine; user sees seed prompt
      });
    return () => {
      cancelled = true;
    };
  }, [launchesLoaded]);

  const center = useMemo<[number, number]>(() => {
    if (locations.length === 0) return [39.5, -85.0];
    const lat = locations.reduce((s, l) => s + l.lat, 0) / locations.length;
    const lng = locations.reduce((s, l) => s + l.lng, 0) / locations.length;
    return [lat, lng];
  }, [locations]);

  const bm = BASEMAPS[basemap];

  const findNearest = useCallback(() => {
    if (!('geolocation' in navigator)) {
      alert('Geolocation not available on this device');
      return;
    }
    if (launches.length === 0) {
      alert('No boat launches loaded yet. Try seeding them first.');
      return;
    }
    setFindingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const user = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        const ranked = launches
          .map((l) => ({ ...l, miles: distanceMiles(user, l) }))
          .sort((a, b) => a.miles - b.miles)
          .slice(0, 5);
        setNearest({ user, list: ranked });
        setRecenterTo({ lat: user.lat, lng: user.lng, zoom: 11 });
        setFindingLocation(false);
      },
      (err) => {
        setFindingLocation(false);
        alert(`Couldn't get location: ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  }, [launches]);

  const highlightedIds = useMemo(
    () => new Set(nearest?.list.map((l) => l.id) ?? []),
    [nearest]
  );

  return (
    <div className="relative h-[calc(100vh-9rem)] rounded-2xl overflow-hidden border border-border">
      <MapContainer
        center={center}
        zoom={5}
        scrollWheelZoom
        className="h-full w-full bg-surface"
      >
        <TileLayer
          key={bm.key}
          url={bm.url}
          attribution={bm.attribution}
          maxZoom={bm.maxZoom}
        />
        <FitToLocations locations={locations} />
        <RecenterOn target={recenterTo} />

        {locations.map((loc) => (
          <MapMarker key={loc.id} location={loc} onClick={(l) => setSelected(l)} />
        ))}

        <BoatLaunchLayer
          launches={launches}
          visible={showLaunches}
          highlightedIds={highlightedIds}
        />

        {nearest && (
          <Marker position={[nearest.user.lat, nearest.user.lng]} icon={youIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}
      </MapContainer>

      <BasemapSwitcher current={basemap} onChange={setBasemap} />

      <div className="absolute top-2 left-2 z-[1000] flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setShowLaunches((v) => !v)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border shadow backdrop-blur',
            showLaunches
              ? 'bg-info/15 border-info/40 text-info'
              : 'bg-surface/90 border-border text-muted'
          )}
        >
          <Anchor className="w-3.5 h-3.5" />
          Launches{launchesLoaded && launches.length > 0 ? ` (${launches.length})` : ''}
        </button>
        <button
          type="button"
          onClick={findNearest}
          disabled={findingLocation || launches.length === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border bg-surface/90 border-border text-text shadow backdrop-blur disabled:opacity-50"
        >
          {findingLocation ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Crosshair className="w-3.5 h-3.5" />
          )}
          Find nearest
        </button>
      </div>

      {nearest && (
        <NearestList
          list={nearest.list}
          onClose={() => setNearest(null)}
          onPick={(l) => setRecenterTo({ lat: l.lat, lng: l.lng, zoom: 14 })}
        />
      )}

      <BottomSheet
        open={selected != null}
        onClose={() => setSelected(null)}
        title={selected?.name}
      >
        {selected && <ConditionsCard location={selected} />}
      </BottomSheet>
    </div>
  );
}

function FitToLocations({ locations }: { locations: Location[] }) {
  const map = useMap();
  useMemo(() => {
    if (locations.length === 0) return;
    if (locations.length === 1) {
      map.setView([locations[0].lat, locations[0].lng], 11);
      return;
    }
    const bounds = locations.map((l) => [l.lat, l.lng] as [number, number]);
    map.fitBounds(bounds, { padding: [40, 40] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations, map]);
  return null;
}

function RecenterOn({
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

function BasemapSwitcher({
  current,
  onChange,
}: {
  current: BasemapKey;
  onChange: (k: BasemapKey) => void;
}) {
  return (
    <div className="absolute top-2 right-2 z-[1000] bg-surface/95 backdrop-blur border border-border rounded-xl p-1 flex gap-1 shadow">
      {Object.values(BASEMAPS).map((b) => (
        <button
          key={b.key}
          type="button"
          onClick={() => onChange(b.key)}
          className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-medium transition',
            current === b.key
              ? 'bg-accent text-bg'
              : 'text-text hover:bg-surface-2'
          )}
        >
          {b.label}
        </button>
      ))}
    </div>
  );
}

function NearestList({
  list,
  onPick,
  onClose,
}: {
  list: Array<BoatLaunch & { miles: number }>;
  onPick: (l: BoatLaunch) => void;
  onClose: () => void;
}) {
  return (
    <div className="absolute bottom-2 left-2 right-2 z-[1000] bg-surface/95 backdrop-blur border border-border rounded-xl p-3 shadow-lg max-w-md mx-auto">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs uppercase tracking-wider text-muted">
          Nearest launches
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-muted hover:text-text"
        >
          Close
        </button>
      </div>
      <div className="flex flex-col gap-1">
        {list.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => onPick(l)}
            className="text-left px-2 py-1.5 rounded hover:bg-surface-2 transition"
          >
            <div className="text-sm font-medium">{l.name}</div>
            <div className="text-xs text-muted num">
              {l.state} · {l.miles.toFixed(1)} mi
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

const youIcon = L.divIcon({
  html: `<div style="position:relative;width:18px;height:18px">
    <div style="position:absolute;inset:0;border-radius:50%;background:#3b82f6;border:3px solid #fff;box-shadow:0 0 0 2px #3b82f6"></div>
  </div>`,
  className: '',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});
