import { useMemo } from 'react';
import { Marker } from 'react-leaflet';
import type { Location } from '@/lib/providers/types';
import { buildFishMarker } from './fishMarker';
import { useFishability } from './useFishability';

/**
 * Wraps a Leaflet Marker, rebuilds its icon when the fishability rating
 * changes, and forwards click events to the parent so the bottom sheet can
 * open with the location's conditions.
 */
export function MapMarker({
  location,
  onClick,
}: {
  location: Location;
  onClick: (loc: Location) => void;
}) {
  const { rating } = useFishability(location);
  const icon = useMemo(() => buildFishMarker(rating), [rating]);
  return (
    <Marker
      position={[location.lat, location.lng]}
      icon={icon}
      eventHandlers={{ click: () => onClick(location) }}
    />
  );
}
