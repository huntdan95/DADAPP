import L from 'leaflet';
import type { Fishability } from '@/lib/fishability';
import { fishabilityColor } from '@/lib/fishability';

/**
 * Custom marker — divIcon with inline SVG so we don't ship leaflet's
 * default-marker images and so the color comes straight from the
 * fishability rating. Anchor is at the tip of the pin.
 *
 * Sleeker proportions (22×28 vs. the previous 32×40) — same teardrop
 * silhouette the search-pin uses, with a 1.5-px outline + a tighter
 * inner dot. Cuts the visual footprint on the map by ~40 % while
 * keeping the color cue obvious.
 */
export function buildFishMarker(rating: Fishability): L.DivIcon {
  const color = fishabilityColor(rating);
  const html = `<div style="position:relative">
    <svg width="22" height="28" viewBox="0 0 22 28" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 1 C5 1 1 5 1 10 C1 16 11 27 11 27 C11 27 21 16 21 10 C21 5 17 1 11 1 Z"
            fill="${color}" stroke="#0a0e0a" stroke-width="1.5"/>
      <circle cx="11" cy="10" r="3" fill="#0a0e0a"/>
    </svg>
  </div>`;
  return L.divIcon({
    html,
    className: 'fish-marker',
    iconSize: [22, 28],
    iconAnchor: [11, 28],
    popupAnchor: [0, -24],
  });
}
