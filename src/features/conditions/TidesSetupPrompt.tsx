import { useEffect, useState } from 'react';
import { Loader2, Waves } from 'lucide-react';
import { CardSection } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getLocationStore } from '@/lib/store';
import {
  nearestTideStations,
  type NearbyTideStation,
} from '@/lib/geo/nearestTideStations';
import type { Location } from '@/lib/providers/types';
import { friendlyError } from '@/lib/errors';

/**
 * Inline one-tap setup for a tide station on a saltwater (or near-coast)
 * spot that doesn't have one configured yet. Shown by `ConditionsCard`
 * when `dataProviders.tides` is missing and a NOAA station is nearby —
 * keeps existing saltwater spots from going tide-less if the user added
 * them before the auto-fill flow ran.
 */
export function TidesSetupPrompt({ location }: { location: Location }) {
  const [options, setOptions] = useState<NearbyTideStation[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    nearestTideStations(location.lat, location.lng, 3, 50)
      .then((list) => {
        if (cancelled) return;
        setOptions(list);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(friendlyError(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [location.lat, location.lng]);

  async function pickStation(stationId: string) {
    setSaving(true);
    setError(null);
    try {
      const store = getLocationStore();
      // Preserve every existing provider — we're only adding `tides`.
      const updated: Location = {
        ...location,
        dataProviders: {
          ...location.dataProviders,
          tides: { kind: 'noaa', stationId },
        },
      };
      await store.upsert(updated);
      // The subscription in App.tsx will pick this up and re-render the
      // ConditionsCard with the new provider, replacing this prompt with
      // the full TidesSection automatically.
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setSaving(false);
    }
  }

  // Hide the prompt entirely if no station is within 50 mi — silent for
  // inland lakes / freestone rivers that happen to be flagged saltwater.
  if (!loading && (options?.length ?? 0) === 0 && !error) return null;

  return (
    <CardSection label="Tides">
      <div className="rounded-xl border border-info/40 bg-info/10 p-3 flex flex-col gap-3">
        <div className="flex items-start gap-2">
          <Waves className="w-4 h-4 text-info mt-0.5 shrink-0" />
          <div className="text-sm">
            No tide station configured for this spot. Tap a nearby NOAA
            station to wire it up — the tide chart will appear here.
          </div>
        </div>

        {loading && (
          <div className="text-xs text-muted flex items-center gap-1.5">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Finding nearby stations…
          </div>
        )}

        {error && <div className="text-xs text-danger">{error}</div>}

        {options && options.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {options.map((s) => (
              <Button
                key={s.stationId}
                variant="secondary"
                size="sm"
                onClick={() => pickStation(s.stationId)}
                disabled={saving}
                className="justify-start w-full text-left h-auto py-2"
              >
                <div className="flex flex-col items-start gap-0.5">
                  <div className="text-sm font-medium">{s.name}</div>
                  <div className="text-[11px] text-muted num">
                    {s.stationId}
                    {s.state ? ` · ${s.state}` : ''} ·{' '}
                    {s.distanceMiles.toFixed(1)} mi
                  </div>
                </div>
              </Button>
            ))}
            {saving && (
              <div className="text-xs text-muted flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Saving…
              </div>
            )}
          </div>
        )}
      </div>
    </CardSection>
  );
}
