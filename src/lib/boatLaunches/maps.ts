/**
 * Deep-link helpers for opening Apple Maps / Google Maps from the boat-
 * launch detail sheet. We always show both buttons regardless of platform
 * — easier than detecting and getting it wrong on hybrid devices.
 */

export function appleMapsDirectionsUrl(
  lat: number,
  lng: number,
  name?: string
): string {
  const params = new URLSearchParams({
    daddr: `${lat},${lng}`,
  });
  if (name) params.set('q', name);
  return `https://maps.apple.com/?${params.toString()}`;
}

export function googleMapsDirectionsUrl(
  lat: number,
  lng: number
): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
}

export function isLikelyIos(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) && !(window as Window & { MSStream?: unknown }).MSStream;
}
