/**
 * Translates raw error messages from Firebase/HTTP/Anthropic/etc into
 * plain-English ones a non-technical user will understand. Catch-all
 * fallback keeps the original message so we never hide a real bug.
 */
export function friendlyError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  const low = msg.toLowerCase();

  // Firebase callable / Firestore errors
  if (low.includes('permission-denied') || low.includes('insufficient permissions')) {
    return "You're not allowed to do that here. Try refreshing.";
  }
  if (low.includes('unauthenticated') || low.includes('not signed in')) {
    return 'Please sign in again to continue.';
  }
  if (low.includes('resource-exhausted')) {
    return msg.replace(/^.*resource-exhausted[:\s]*/i, '');  // server already wrote a friendly message
  }
  if (low.includes('unavailable') || low.includes('deadline-exceeded')) {
    return 'Service is slow right now. Try again in a moment.';
  }
  if (low.includes('not-found')) {
    return "That doesn't exist anymore — refresh and try again.";
  }

  // Network
  if (low.includes('failed to fetch') || low.includes('network') || low.includes('networkerror')) {
    return 'No internet right now. Using whatever was cached.';
  }

  // Upstream weather/water services
  if (low.includes('open-meteo')) {
    return "Couldn't reach the weather service. Try again in a sec.";
  }
  if (low.includes('usgs')) {
    return "Couldn't reach the water-data service. Try again in a sec.";
  }
  if (low.includes('overpass')) {
    return "Couldn't reach the boat-launches service.";
  }

  // Geolocation
  if (low.includes('geolocation')) {
    return "Couldn't get your location. Turn on location access for this site.";
  }

  // Image upload / storage
  if (low.includes('storage/') || low.includes('blob')) {
    return "Couldn't upload your photo. Try again or save without it.";
  }

  // Anthropic SDK
  if (low.includes('429') || low.includes('rate_limit')) {
    return "Hit a rate limit. Hang on a minute and try again.";
  }
  if (low.includes('overloaded')) {
    return 'The AI service is busy. Try again in a minute.';
  }

  // Default: surface the raw message so we don't lose info on real bugs,
  // but trim noisy prefixes the user doesn't need.
  return msg
    .replace(/^Error:\s*/i, '')
    .replace(/^FirebaseError:\s*/i, '')
    .replace(/^functions\/\w+:\s*/i, '');
}
