import { useEffect, useMemo, useState } from 'react';
import { Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import type { BoatLaunch } from '@/lib/boatLaunches/store';

/**
 * Renders boat launches as small triangle markers, viewport-filtered and
 * zoom-gated to keep the map usable. At zoom < 9 we hide them entirely
 * (would be a soup of pins covering 7 states).
 *
 * Click is delegated to the parent — we don't render Leaflet popups
 * inline because the actions on a launch (notes, Open in Maps) are
 * richer than a popup can hold.
 */
export function BoatLaunchLayer({
  launches,
  visible,
  highlightedIds,
  onLaunchClick,
}: {
  launches: BoatLaunch[];
  visible: boolean;
  highlightedIds?: Set<string>;
  onLaunchClick?: (launch: BoatLaunch) => void;
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
          icon={launchIcon(l, highlightedIds?.has(l.id) ?? false)}
          eventHandlers={
            onLaunchClick ? { click: () => onLaunchClick(l) } : undefined
          }
        />
      ))}
    </>
  );
}

/**
 * Markers vary by access type so anglers can tell at a glance whether a
 * pin is a real motorboat ramp vs a canoe/kayak-only put-in.
 *
 *   ramp (default, motorboat-capable) → blue triangle
 *   put-in (canoe/kayak)              → teal triangle
 *   pier                              → cyan triangle
 *   rental                            → blue triangle (no special)
 *   user-added                        → accent-green triangle
 *
 * Highlighted (find-nearest result) overrides with a larger yellow icon.
 */
function colorForLaunch(launch: BoatLaunch): string {
  if (launch.source === 'user') return '#4ade80';     // trout-belly accent
  switch (launch.type) {
    case 'put-in':
      return '#2dd4bf';   // teal
    case 'pier':
      return '#22d3ee';   // cyan
    case 'rental':
    case 'ramp':
    default:
      return '#60a5fa';   // blue
  }
}

function buildIcon(color: string, highlighted: boolean) {
  const size = highlighted ? 20 : 14;
  const fill = highlighted ? '#fbbf24' : color;
  const stroke = highlighted ? 2 : 1.5;
  const points = highlighted ? '10,2 18,17 2,17' : '7,2 13,12 1,12';
  return L.divIcon({
    html: `<svg width="${size}" height="${size}" viewBox="0 0 ${
      highlighted ? 20 : 14
    } ${highlighted ? 20 : 14}" xmlns="http://www.w3.org/2000/svg">
      <polygon points="${points}" fill="${fill}" stroke="#0a0e0a" stroke-width="${stroke}"/>
    </svg>`,
    className:
      'boat-launch-marker' + (highlighted ? ' boat-launch-marker--highlight' : ''),
    iconSize: [size, size],
    iconAnchor: [size / 2, highlighted ? 17 : 12],
  });
}

/** Cache icons by color+highlighted state to avoid recreating per render. */
const iconCache = new Map<string, L.DivIcon>();
function launchIcon(launch: BoatLaunch, highlighted: boolean): L.DivIcon {
  const color = colorForLaunch(launch);
  const key = `${color}|${highlighted ? 1 : 0}`;
  let icon = iconCache.get(key);
  if (!icon) {
    icon = buildIcon(color, highlighted);
    iconCache.set(key, icon);
  }
  return icon;
}
