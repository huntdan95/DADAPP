import L from 'leaflet';
import type { Fishability } from '@/lib/fishability';
import { fishabilityColor } from '@/lib/fishability';

/**
 * Custom marker — divIcon with inline SVG so we don't ship leaflet's
 * default-marker images and so the color comes straight from the
 * fishability rating. Anchor is at the tip of the pin.
 */
export function buildFishMarker(rating: Fishability): L.DivIcon {
  const color = fishabilityColor(rating);
  const html = `<div style="position:relative">
    <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0 C7 0 0 7 0 16 C0 25 16 40 16 40 C16 40 32 25 32 16 C32 7 25 0 16 0 Z"
            fill="${color}" stroke="#0a0e0a" stroke-width="2"/>
      <circle cx="16" cy="16" r="6" fill="#0a0e0a"/>
    </svg>
  </div>`;
  return L.divIcon({
    html,
    className: 'fish-marker',
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -36],
  });
}
