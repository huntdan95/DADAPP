import { useEffect, useMemo, useState } from 'react';
import { Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import type { BoatLaunch } from '@/lib/boatLaunches/store';

/**
 * Renders boat launches as small triangle markers, viewport-filtered and
 * zoom-gated to keep the map usable. At zoom < 9 we hide them entirely
 * (would be a soup of pins covering 7 states).
 */
export function BoatLaunchLayer({
  launches,
  visible,
  highlightedIds,
}: {
  launches: BoatLaunch[];
  visible: boolean;
  highlightedIds?: Set<string>;
}) {
  const map = useMap();
  const [bounds, setBounds] = useState<L.LatLngBounds | null>(() => map.getBounds());
  const [zoom, setZoom] = useState<number>(() => map.getZoom());

  useMapEvents({
    moveend: () => {
      setBounds(map.getBounds());
      setZoom(map.getZoom());
    },
    zoomend: () => {
      setBounds(map.getBounds());
      setZoom(map.getZoom());
    },
  });

  // Initial sync (in case the map mounts after launches load).
  useEffect(() => {
    setBounds(map.getBounds());
    setZoom(map.getZoom());
  }, [map]);

  const visibleLaunches = useMemo(() => {
    if (!visible || !bounds || zoom < 9) return [];
    const list: BoatLaunch[] = [];
    for (const l of launches) {
      if (
        l.lat >= bounds.getSouth() &&
        l.lat <= bounds.getNorth() &&
        l.lng >= bounds.getWest() &&
        l.lng <= bounds.getEast()
      ) {
        list.push(l);
        if (list.length >= 400) break;       // hard cap so the DOM stays sane
      }
    }
    return list;
  }, [launches, bounds, zoom, visible]);

  if (!visible) return null;

  return (
    <>
      {visibleLaunches.map((l) => (
        <Marker
          key={l.id}
          position={[l.lat, l.lng]}
          icon={launchIcon(highlightedIds?.has(l.id) ?? false)}
        >
          <Popup>
            <div style={{ fontFamily: 'system-ui', minWidth: 160 }}>
              <strong>{l.name}</strong>
              <div style={{ fontSize: 12, color: '#666' }}>
                {l.state} · boat launch ({l.type})
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

const baseIcon = L.divIcon({
  html: `<svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
    <polygon points="7,2 13,12 1,12" fill="#60a5fa" stroke="#0a0e0a" stroke-width="1.5"/>
  </svg>`,
  className: 'boat-launch-marker',
  iconSize: [14, 14],
  iconAnchor: [7, 12],
});

const highlightIcon = L.divIcon({
  html: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <polygon points="10,2 18,17 2,17" fill="#fbbf24" stroke="#0a0e0a" stroke-width="2"/>
  </svg>`,
  className: 'boat-launch-marker boat-launch-marker--highlight',
  iconSize: [20, 20],
  iconAnchor: [10, 17],
});

function launchIcon(highlighted: boolean) {
  return highlighted ? highlightIcon : baseIcon;
}
