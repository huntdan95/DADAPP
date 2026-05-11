import { useEffect, useState } from 'react';
import { Apple, Loader2, MapPin, Navigation, Plus } from 'lucide-react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Input';
import {
  type BoatLaunch,
  distanceMiles,
} from '@/lib/boatLaunches/store';
import {
  appleMapsDirectionsUrl,
  googleMapsDirectionsUrl,
  isLikelyIos,
} from '@/lib/boatLaunches/maps';
import { readLaunchNote, writeLaunchNote } from '@/lib/boatLaunches/notes';

/**
 * Bottom sheet that opens when a boat-launch marker is tapped. Shows
 * the launch name, distance from the user (if known), buttons to open
 * directions in Apple Maps / Google Maps, and a per-user notes field
 * that persists to Firestore.
 */
export function BoatLaunchSheet({
  launch,
  userLocation,
  onClose,
  onSaveAsSpot,
}: {
  launch: BoatLaunch | null;
  userLocation: { lat: number; lng: number } | null;
  onClose: () => void;
  /**
   * Called when the user taps "Save as fishing spot". Parent should
   * close this sheet and open the LocationForm seeded with the
   * launch's coords + name.
   */
  onSaveAsSpot?: (launch: BoatLaunch) => void;
}) {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  // Reset + load note whenever the selected launch changes.
  useEffect(() => {
    if (!launch) return;
    setNote('');
    setSavedAt(null);
    setLoading(true);
    readLaunchNote(launch.id)
      .then(setNote)
      .catch(() => setNote(''))
      .finally(() => setLoading(false));
  }, [launch?.id]);

  async function save() {
    if (!launch) return;
    setSaving(true);
    try {
      await writeLaunchNote(launch.id, note);
      setSavedAt(Date.now());
    } finally {
      setSaving(false);
    }
  }

  const distance =
    launch && userLocation
      ? distanceMiles(userLocation, { lat: launch.lat, lng: launch.lng })
      : null;

  const ios = isLikelyIos();

  return (
    <BottomSheet open={launch != null} onClose={onClose} title={launch?.name}>
      {launch && (
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-2 text-sm text-muted">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
            <div>
              <div>
                {launch.state} · {launchTypeLabel(launch.type)}
                {launch.source === 'user' && ' · added by you'}
                {launch.source === 'curated' && ' · curated'}
              </div>
              <div className="text-xs num">
                {launch.lat.toFixed(5)}, {launch.lng.toFixed(5)}
                {distance != null && ` · ${distance.toFixed(1)} mi from you`}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href={googleMapsDirectionsUrl(launch.lat, launch.lng)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-accent text-bg font-medium active:scale-[0.98]"
            >
              <Navigation className="w-4 h-4" />
              Google Maps
            </a>
            <a
              href={appleMapsDirectionsUrl(launch.lat, launch.lng, launch.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-surface-2 border border-border text-text active:scale-[0.98]"
            >
              <Apple className="w-4 h-4" />
              Apple Maps
            </a>
          </div>
          {ios && (
            <div className="text-xs text-muted">
              Tip: on iOS, Apple Maps opens in the native app.
            </div>
          )}

          {onSaveAsSpot && (
            <Button
              variant="secondary"
              onClick={() => onSaveAsSpot(launch)}
              className="w-full"
            >
              <Plus className="w-4 h-4" />
              Save as a fishing spot
            </Button>
          )}

          <Field label="Your notes">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={loading}
              rows={4}
              placeholder="Parking, ramp condition, etc."
              className="px-3 py-2 rounded-xl bg-surface-2 border border-border text-text placeholder:text-muted focus:outline-none focus:border-accent/60 disabled:opacity-50"
            />
          </Field>

          <div className="flex items-center justify-between gap-2">
            <div className="text-xs text-muted">
              {savedAt && 'Saved'}
              {loading && (
                <span className="inline-flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Loading…
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
              <Button onClick={save} disabled={saving || loading}>
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? 'Saving…' : 'Save note'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </BottomSheet>
  );
}

/**
 * Friendly label for the launch type. The 'slipway' fallback handles
 * existing Firestore docs from before the type classification was
 * added; new docs come in as 'ramp' directly.
 */
function launchTypeLabel(type: string): string {
  switch (type) {
    case 'ramp':
    case 'slipway':
      return 'Boat ramp';
    case 'put-in':
      return 'Canoe / kayak put-in';
    case 'pier':
      return 'Pier';
    case 'rental':
      return 'Boat rental';
    case 'marina':
      return 'Marina';
    case 'historic':
      return 'Former launch (disused)';
    default:
      return type;
  }
}
