import { useMemo } from 'react';
import { Circle, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { distanceMi, useUserLocation } from '@/lib/userLocation';

/**
 * Reusable "you are here" overlay for any Leaflet map in the app.
 *
 * Designed to drop into a `<MapContainer>` and Do The Right Thing in
 * three scenarios:
 *
 *   1. Full-screen interactive map (Map tab) — pass `watch` so the
 *      dot tracks live as the user moves.
 *   2. Form picker maps (Add-Spot, Add-Launch) — default behavior;
 *      one-shot fix, no watching.
 *   3. Read-only mini-maps (stocking event sheet, waterbody detail) —
 *      pass `maxDistanceMi` + `anchor` so the marker only renders if
 *      the user is reasonably close to the map's subject. Otherwise a
 *      "you" pin would render hundreds of miles off-screen and be
 *      worse than no pin at all.
 *
 * Renders nothing if we don't have a fix yet, if the user denied
 * permission, or if we're too far from the anchor — all silent
 * degradations.
 */
export function UserLocationMarker({
  watch,
  maxDistanceMi,
  anchor,
  showAccuracy = true,
}: {
  /** Pass true to subscribe to live position updates. */
  watch?: boolean;
  /** Hide the marker if the user is farther than this from `anchor`. */
  maxDistanceMi?: number;
  /** Reference point for the maxDistance check (typically the map subject). */
  anchor?: { lat: number; lng: number } | null;
  /** Draw the faded accuracy circle (default on for high-precision fixes). */
  showAccuracy?: boolean;
}) {
  const position = useUserLocation({ watch });

  // Distance gate: if the caller asked for one and we're outside it,
  // render nothing. The hook still fires so the cache stays warm for
  // other consumers — we just don't draw on this map.
  const gated = useMemo(() => {
    if (!position) return true;
    if (maxDistanceMi == null || !anchor) return false;
    return distanceMi(position, anchor) > maxDistanceMi;
  }, [position, maxDistanceMi, anchor]);

  // Memoize the div-icon so we don't re-mint on every render. Shape
  // matches the original inline `youIcon` from MapView so the visual
  // language stays consistent across all five maps.
  const icon = useMemo(() => {
    return L.divIcon({
      html:
        '<div style="position:relative;width:18px;height:18px">' +
        '<div style="position:absolute;inset:0;border-radius:50%;' +
        'background:#3b82f6;border:3px solid #fff;' +
        'box-shadow:0 0 0 2px #3b82f6"></div>' +
        '</div>',
      className: '',
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });
  }, []);

  if (!position || gated) return null;

  // Accuracy circle only when the GPS fix is reasonably tight. Wide
  // fixes (>200 m) just clutter the map without adding signal.
  const showCircle =
    showAccuracy && position.accuracy > 0 && position.accuracy < 200;

  return (
    <>
      <Marker position={[position.lat, position.lng]} icon={icon}>
        <Popup>You are here</Popup>
      </Marker>
      {showCircle && (
        <Circle
          center={[position.lat, position.lng]}
          radius={position.accuracy}
          pathOptions={{
            color: '#3b82f6',
            weight: 1,
            opacity: 0.4,
            fillColor: '#3b82f6',
            fillOpacity: 0.08,
          }}
        />
      )}
    </>
  );
}
