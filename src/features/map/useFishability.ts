import { useEffect, useState } from 'react';
import type { Location } from '@/lib/providers/types';
import { fetchWeather, fetchFlow, fetchDamSchedule } from '@/lib/providers';
import { scoreFishability, type Fishability } from '@/lib/fishability';

/**
 * Per-location fishability rating, used by the map markers. Each location
 * independently fetches what it needs; failures fall through to 'unknown'
 * so a single bad provider doesn't take down the map.
 */
export function useFishability(location: Location): {
  rating: Fishability;
  reasons: string[];
  score: number;
} {
  const [state, setState] = useState<{
    rating: Fishability;
    reasons: string[];
    score: number;
  }>({ rating: 'unknown', reasons: [], score: 0 });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [weather, flow, damSchedule] = await Promise.all([
        fetchWeather(location.dataProviders.weather, location).catch(() => undefined),
        location.dataProviders.flow
          ? fetchFlow(location.dataProviders.flow).catch(() => undefined)
          : Promise.resolve(undefined),
        location.dataProviders.damSchedule
          ? fetchDamSchedule(location.dataProviders.damSchedule, location).catch(
              () => undefined
            )
          : Promise.resolve(undefined),
      ]);
      if (cancelled) return;
      setState(scoreFishability({ location, weather, flow, damSchedule }));
    })();
    return () => {
      cancelled = true;
    };
  }, [location]);

  return state;
}
