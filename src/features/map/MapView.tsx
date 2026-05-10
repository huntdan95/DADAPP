import { useMemo, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { BASEMAPS, type BasemapKey } from './basemaps';
import { MapMarker } from './MapMarker';
import type { Location } from '@/lib/providers/types';
import { ConditionsCard } from '@/features/conditions/ConditionsCard';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { cn } from '@/lib/utils';

export function MapView({ locations }: { locations: Location[] }) {
  const [basemap, setBasemap] = useState<BasemapKey>('osm');
  const [selected, setSelected] = useState<Location | null>(null);

  const center = useMemo<[number, number]>(() => {
    if (locations.length === 0) return [39.5, -85.0];
    const lat =
      locations.reduce((s, l) => s + l.lat, 0) / locations.length;
    const lng =
      locations.reduce((s, l) => s + l.lng, 0) / locations.length;
    return [lat, lng];
  }, [locations]);

  const bm = BASEMAPS[basemap];

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
        {locations.map((loc) => (
          <MapMarker
            key={loc.id}
            location={loc}
            onClick={(l) => setSelected(l)}
          />
        ))}
      </MapContainer>

      <BasemapSwitcher current={basemap} onChange={setBasemap} />

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
