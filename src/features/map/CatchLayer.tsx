import { Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useMemo, useState } from 'react';
import type { LogEntry } from '@/lib/log/types';

/**
 * Renders the user's logged catches as small markers on the map. Color
 * by recency:
 *   - <7 days  → bright accent (hot)
 *   - <30 days → warm yellow
 *   - older    → muted blue
 *
 * Click → callback so the parent can open the LogEntryDetail sheet
 * (avoids duplicating the detail UI here).
 */
export function CatchLayer({
  entries,
  visible,
  onEntryClick,
}: {
  entries: LogEntry[];
  visible: boolean;
  onEntryClick: (entry: LogEntry) => void;
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

  useEffect(() => {
    setBounds(map.getBounds());
    setZoom(map.getZoom());
  }, [map]);

  const visibleEntries = useMemo(() => {
    if (!visible || !bounds) return [];
    // Catches plotted from zoom 7+; below that the country-scale map
    // would soup up with overlapping dots.
    if (zoom < 7) return [];
    const list: Array<{ entry: LogEntry; ageDays: number }> = [];
    const now = Date.now();
    for (const e of entries) {
      if (!e.gps) continue;
      if (
        e.gps.lat < bounds.getSouth() ||
        e.gps.lat > bounds.getNorth() ||
        e.gps.lng < bounds.getWest() ||
        e.gps.lng > bounds.getEast()
      ) {
        continue;
      }
      const ageDays = (now - new Date(e.time).getTime()) / (24 * 60 * 60 * 1000);
      list.push({ entry: e, ageDays });
      if (list.length >= 500) break;
    }
    return list;
  }, [entries, bounds, zoom, visible]);

  if (!visible) return null;

  return (
    <>
      {visibleEntries.map(({ entry, ageDays }) => (
        <Marker
          key={entry.id}
          position={[entry.gps!.lat, entry.gps!.lng]}
          icon={catchIcon(entry.kind, ageDays)}
          eventHandlers={{ click: () => onEntryClick(entry) }}
        />
      ))}
    </>
  );
}

/** Color by recency, shape by entry kind. */
function colorForAge(ageDays: number): string {
  if (ageDays < 7) return '#4ade80';      // hot accent green — last week
  if (ageDays < 30) return '#fbbf24';     // warm yellow — last month
  if (ageDays < 180) return '#60a5fa';    // info blue — last 6 months
  return '#7a857a';                       // muted older
}

function svgFor(kind: LogEntry['kind'], color: string): string {
  // 14x14 viewbox. Filled circle + tiny accent stroke. Hatches get an
  // inner dot, notes are smaller and grey-ringed.
  if (kind === 'hatch') {
    return `<svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7" cy="7" r="5.5" fill="${color}" stroke="#0a0e0a" stroke-width="1.5"/>
      <circle cx="7" cy="7" r="1.5" fill="#0a0e0a"/>
    </svg>`;
  }
  if (kind === 'note') {
    return `<svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6" cy="6" r="4.5" fill="${color}" fill-opacity="0.6" stroke="#0a0e0a" stroke-width="1.25"/>
    </svg>`;
  }
  // catch
  return `<svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="7" r="5.5" fill="${color}" stroke="#0a0e0a" stroke-width="1.5"/>
  </svg>`;
}

const iconCache = new Map<string, L.DivIcon>();
function catchIcon(kind: LogEntry['kind'], ageDays: number): L.DivIcon {
  const color = colorForAge(ageDays);
  const key = `${kind}:${color}`;
  let icon = iconCache.get(key);
  if (!icon) {
    const size = kind === 'note' ? 12 : 14;
    icon = L.divIcon({
      html: svgFor(kind, color),
      className: 'catch-marker',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
    iconCache.set(key, icon);
  }
  return icon;
}
