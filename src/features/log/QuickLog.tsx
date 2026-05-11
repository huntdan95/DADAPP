import { useRef, useState } from 'react';
import {
  Camera,
  CloudOff,
  Crosshair,
  Image as ImageIcon,
  Loader2,
  MapPin,
  Sparkles,
  StickyNote,
} from 'lucide-react';
import { useOnline } from '@/lib/useOnline';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select } from '@/components/ui/Input';
import type { Location } from '@/lib/providers/types';
import {
  newLogId,
  type HatchStage,
  type LogEntry,
  type LogKind,
} from '@/lib/log/types';
import {
  fetchLastCatch,
  makeThumbnailDataUrl,
  saveLogEntry,
  uploadLogPhoto,
} from '@/lib/log/store';
import { enqueuePhoto } from '@/lib/log/photoQueue';
import {
  getDeviceGps,
  nearestSavedLocation,
  snapshotForGps,
  snapshotForLocation,
} from '@/lib/log/snapshot';
import { analyzePhoto } from '@/lib/ai/analyzePhoto';
import {
  FISHING_METHODS,
  type ConditionsSnapshot,
  type FishingMethod,
} from '@/lib/journal/types';
import { friendlyError } from '@/lib/errors';

/**
 * Photo-first log entry. Three entry points:
 *   - Take photo (camera)
 *   - Pick from library
 *   - Note only (no photo)
 *
 * The moment we have a photo (or skip is hit), we kick off geolocation +
 * conditions snapshot in parallel with Claude vision analysis. By the
 * time the preview screen renders, the auto-detected fields are usually
 * already populated.
 *
 * Phases (state.phase):
 *   "pick"     → user has not chosen a path yet
 *   "loading"  → photo upload + analysis + conditions in flight
 *   "preview"  → form populated, user reviews / edits / saves
 */

type Phase = 'pick' | 'loading' | 'preview';

export function QuickLog({
  locations,
  activeTripId,
  onClose,
  onSaved,
}: {
  locations: Location[];
  /** If a trip is active, new entries get tagged with its id. */
  activeTripId?: string;
  onClose: () => void;
  onSaved: (entry: LogEntry) => void;
}) {
  const [phase, setPhase] = useState<Phase>('pick');
  const [kind, setKind] = useState<LogKind>('catch');
  const [loadingStatus, setLoadingStatus] = useState<string>('Working…');
  const [error, setError] = useState<string | null>(null);
  const online = useOnline();
  /**
   * Where conditions come from. 'gps' = grab my device GPS and snap
   * weather there (the original behavior). A spot id = use that spot's
   * lat/lng + declared providers (useful when logging a fish you caught
   * earlier in the day, or from your truck on the drive home).
   */
  const [conditionsSource, setConditionsSource] = useState<'gps' | string>('gps');

  // Draft fields — populated by photo analysis + conditions snapshot.
  const [thumb, setThumb] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<LogEntry>>({});
  /**
   * "Sticky" defaults: the most recent catch at the resolved spot (or
   * globally if nothing here yet). Used to soft-fill species / method /
   * fly when the user is logging a similar trip. AI analysis still
   * wins — the sticky values are only applied if the corresponding
   * field is still empty after AI runs.
   */
  const [lastCatch, setLastCatch] = useState<LogEntry | null>(null);
  /**
   * True while Claude vision is running in the background after the
   * preview screen has already shown. Drives the "AI is still
   * thinking — fields will update" banner.
   */
  const [aiAnalysisPending, setAiAnalysisPending] = useState(false);

  const cameraRef = useRef<HTMLInputElement>(null);
  const libraryRef = useRef<HTMLInputElement>(null);

  function pickFromCamera() {
    cameraRef.current?.click();
  }
  function pickFromLibrary() {
    libraryRef.current?.click();
  }

  /**
   * Resolves where the conditions come from based on the user's pick.
   * GPS mode keeps the old behavior (matches the user against the
   * nearest saved spot within 3 mi). Spot mode skips GPS entirely and
   * uses the spot's coords + declared flow provider.
   */
  async function resolveConditionsContext(): Promise<{
    gps?: { lat: number; lng: number };
    matchedLoc: Location | null;
    timezone: string;
    snap: { conditions: ConditionsSnapshot; flowReading?: LogEntry['flowReading'] };
  }> {
    if (conditionsSource !== 'gps') {
      const spot = locations.find((l) => l.id === conditionsSource);
      if (spot) {
        const snap = await snapshotForLocation(spot).catch(() => ({
          conditions: zeroConditions(),
          flowReading: undefined,
        }));
        return {
          gps: { lat: spot.lat, lng: spot.lng },
          matchedLoc: spot,
          timezone: spot.timezone,
          snap,
        };
      }
    }
    const gps = await getDeviceGps();
    const matchedLoc = gps ? nearestSavedLocation(gps, locations) : null;
    const timezone =
      matchedLoc?.timezone ??
      Intl.DateTimeFormat().resolvedOptions().timeZone ??
      'America/New_York';
    const snap = gps
      ? await snapshotForGps(gps, timezone).catch(() => ({
          conditions: zeroConditions(),
          flowReading: undefined,
        }))
      : { conditions: zeroConditions(), flowReading: undefined };
    return { gps: gps ?? undefined, matchedLoc, timezone, snap };
  }

  async function startWithPhoto(file: File) {
    setError(null);
    setPhase('loading');
    setLoadingStatus('Compressing photo…');

    const logId = newLogId();
    try {
      const thumbUrl = await makeThumbnailDataUrl(file);
      setThumb(thumbUrl);

      if (!online) {
        // Offline path: stash the photo in the IndexedDB queue, capture
        // conditions, skip Claude vision (no network → no API). The
        // background worker will upload the blob + clear photoQueued
        // when connectivity returns.
        setLoadingStatus('Stashing photo for later upload…');
        await enqueuePhoto(logId, file).catch((e) => {
          console.warn('enqueuePhoto failed', e);
        });
        const ctx = await resolveConditionsContext();
        const { gps, matchedLoc, snap } = ctx;
        // Photo present — leave species/lure/method blank so the
        // user fills them fresh (or fills them when they reconnect
        // and the AI runs). Don't apply sticky-from-last-catch:
        // a Crawler-Harness-and-Channel-Cat default on a Brown
        // Trout photo is worse than empty fields.
        setLastCatch(null);
        setKind('catch');                                  // best guess; user can change
        setDraft({
          id: logId,
          kind: 'catch',
          time: new Date().toISOString(),
          gps: gps ?? undefined,
          locationId: matchedLoc?.id,
          locationName: matchedLoc?.name,
          photoQueued: true,
          // photoUrl + photoPath get filled in by the drain worker.
          conditions: snap.conditions,
          flowReading: snap.flowReading,
        });
        setPhase('preview');
        return;
      }

      setLoadingStatus(
        conditionsSource === 'gps'
          ? 'Uploading + locating + snapping conditions…'
          : 'Uploading + snapping spot conditions…'
      );

      // Run upload + conditions context + last-catch lookup in parallel.
      // Note: we do NOT block on Claude vision here — that happens in
      // the background after we show the preview screen. This is the
      // big logging-speed win: the user sees the photo + conditions
      // within ~5 seconds (whatever the upload takes) instead of
      // waiting another 15-25 s for Opus + adaptive thinking to finish.
      const [{ url, path }, ctx] = await Promise.all([
        uploadLogPhoto(logId, file),
        resolveConditionsContext(),
      ]);

      const { gps, matchedLoc, snap } = ctx;
      // No sticky-from-last-catch on photo logs — see the note on
      // `applyStickyDefaults`. AI fills species/length; user fills
      // the lure they actually used.
      setLastCatch(null);

      // Default to 'catch' — most photos are. AI may correct this to
      // hatch / note when it returns; user can also change manually.
      setKind('catch');

      setDraft({
        id: logId,
        kind: 'catch',
        time: new Date().toISOString(),
        gps: gps ?? undefined,
        locationId: matchedLoc?.id,
        locationName: matchedLoc?.name,
        photoUrl: url,
        photoPath: path,
        conditions: snap.conditions,
        flowReading: snap.flowReading,
      });

      // Show the preview screen NOW — user can start editing while
      // Claude vision runs.
      setAiAnalysisPending(true);
      setPhase('preview');

      // Background AI analysis. When it returns, patch the draft with
      // species / length / hatch fields. If the user has already
      // edited those fields by the time AI returns, we skip them so
      // we don't clobber their typing.
      analyzePhoto({
        imageUrl: url,
        hintLocation: matchedLoc?.name,
      })
        .then((analysis) => {
          if (!analysis) return;
          const inferredKind: LogKind =
            analysis.kind === 'insect'
              ? 'hatch'
              : analysis.kind === 'fish'
              ? 'catch'
              : 'note';
          setKind((prev) => prev /* don't override if user picked already */);
          // Only override the AI fields, never user-editable text the
          // user might have already typed.
          setDraft((prev) => {
            const next: Partial<LogEntry> = { ...prev };
            if (inferredKind === 'catch' && analysis.kind === 'fish') {
              if (!prev.species) next.species = analysis.species;
              if (!prev.speciesConfidence)
                next.speciesConfidence = analysis.confidence;
              if (prev.lengthInches == null && analysis.estimated_length_inches != null) {
                next.lengthInches = analysis.estimated_length_inches;
              }
            }
            if (inferredKind === 'hatch' && analysis.kind === 'insect') {
              if (!prev.hatchName) next.hatchName = analysis.insect_name;
              if (!prev.hatchStage) next.hatchStage = analysis.insect_stage;
              setKind('hatch');
            }
            if (!prev.notes && analysis.notes) next.notes = analysis.notes;
            return next;
          });
        })
        .catch((e) => {
          // Don't block the user — they can still save without AI.
          console.warn('analyzePhoto failed', e);
        })
        .finally(() => {
          setAiAnalysisPending(false);
        });
    } catch (e) {
      setError(friendlyError(e));
      setPhase('pick');
    }
  }

  async function startNoteOnly() {
    setError(null);
    setPhase('loading');
    setLoadingStatus(
      conditionsSource === 'gps'
        ? 'Locating + snapping conditions…'
        : 'Snapping spot conditions…'
    );
    try {
      const { gps, matchedLoc, snap } = await resolveConditionsContext();
      // Note-only stays 'note' as the kind. The lookup is still useful
      // so the user can see what they last caught here if they decide
      // to switch to 'catch'.
      const sticky = await fetchLastCatch(matchedLoc?.id).catch(() => null);
      setLastCatch(sticky);
      setKind('note');
      setDraft({
        id: newLogId(),
        kind: 'note',
        time: new Date().toISOString(),
        gps,
        locationId: matchedLoc?.id,
        locationName: matchedLoc?.name,
        conditions: snap.conditions,
        flowReading: snap.flowReading,
      });
      setPhase('preview');
    } catch (e) {
      setError(friendlyError(e));
      setPhase('pick');
    }
  }

  // (Removed `applyStickyDefaults` — used to pre-fill species /
  // method / flyOrLure from the previous catch at the same spot.
  // The pre-fill silently raced the Claude-vision callback: AI's
  // species detection was dropped because `prev.species` was
  // already set to the previous catch's value. Result: brown
  // trout photo → "Channel Cat", Crawler Harness from the prior
  // walleye log. Photo paths now start with empty species/lure
  // fields and AI fills them in. Note-only paths default to
  // 'note' kind, where these fields don't apply.)

  function update<K extends keyof LogEntry>(key: K, value: LogEntry[K] | undefined) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  async function save() {
    if (!draft.id) return;
    setError(null);
    try {
      const entry: LogEntry = {
        ...(draft as LogEntry),
        kind,
        userId: '',         // store fills this in
        // Tag with the active trip so the post-trip summary can count
        // this entry. Null-safe — falls back to undefined when not on
        // a trip.
        tripId: activeTripId ?? undefined,
      };
      if (online) {
        await saveLogEntry(entry);
      } else {
        // Firestore offline persistence queues the write in IndexedDB
        // and replays it when the connection returns. Awaiting would
        // hang forever — fire-and-forget so the user gets immediate
        // confirmation. The header offline badge tells them why it's
        // not synced yet.
        void saveLogEntry(entry).catch(() => undefined);
      }
      onSaved(entry);
    } catch (e) {
      setError(friendlyError(e));
    }
  }

  if (phase === 'pick') {
    return (
      <div className="flex flex-col gap-3">
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) startWithPhoto(f);
          }}
        />
        <input
          ref={libraryRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) startWithPhoto(f);
          }}
        />

        {!online && (
          <div className="rounded-xl border border-warn/40 bg-warn/10 p-3 flex items-start gap-2 text-sm">
            <CloudOff className="w-4 h-4 text-warn mt-0.5 shrink-0" />
            <div>
              <div className="text-warn font-medium">You're offline</div>
              <div className="text-xs text-muted mt-0.5">
                Logs save locally and sync when you're back. Photos are
                stashed and uploaded automatically once you have a
                connection — fish ID is delayed until then.
              </div>
            </div>
          </div>
        )}

        {activeTripId && (
          <div className="rounded-xl border border-accent/40 bg-accent/10 px-3 py-2 text-xs text-muted">
            This log will be tagged with your active trip.
          </div>
        )}

        <Field label="Conditions from">
          <Select
            value={conditionsSource}
            onChange={(e) => setConditionsSource(e.target.value)}
          >
            <option value="gps">📍 Use my current location</option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                🎣 {l.name}
              </option>
            ))}
          </Select>
        </Field>
        <div className="text-[11px] text-muted -mt-2 flex items-start gap-1.5">
          {conditionsSource === 'gps' ? (
            <>
              <Crosshair className="w-3 h-3 mt-0.5" />
              Weather, flow + water temp will be snapped at your current GPS.
            </>
          ) : (
            <>
              <MapPin className="w-3 h-3 mt-0.5" />
              Weather + flow will be pulled from the chosen spot's saved
              providers (won't ping your GPS).
            </>
          )}
        </div>

        <BigChoice
          label="Take a photo"
          hint={
            online
              ? 'Claude will figure out fish or hatch and snap conditions.'
              : 'Photo stashed for upload — fish ID happens when you reconnect.'
          }
          icon={Camera}
          onClick={pickFromCamera}
        />
        <BigChoice
          label="Choose from library"
          hint={
            online
              ? 'Same as above, but pick an existing photo.'
              : 'Photo stashed for upload — fish ID happens when you reconnect.'
          }
          icon={ImageIcon}
          onClick={pickFromLibrary}
        />
        <BigChoice
          label="Note only"
          hint="No photo — just snap conditions and add notes."
          icon={StickyNote}
          onClick={startNoteOnly}
        />
        {error && <div className="text-sm text-danger">{error}</div>}
        <div className="flex justify-end pt-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  if (phase === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-4">
        {thumb && (
          <img
            src={thumb}
            alt="preview"
            className="w-32 h-32 object-cover rounded-xl border border-border"
          />
        )}
        <div className="w-full max-w-xs">
          <ProgressBar status={loadingStatus} variant="info" />
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
      </div>
    );
  }

  // phase === 'preview'
  return (
    <div className="flex flex-col gap-4">
      {(thumb || draft.photoUrl) && (
        <img
          src={thumb ?? draft.photoUrl}
          alt="catch"
          className="w-full max-h-64 object-cover rounded-xl border border-border"
        />
      )}

      {aiAnalysisPending && (
        <div className="rounded-lg bg-info/10 border border-info/40 px-3 py-2 text-xs flex items-center gap-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-info" />
          <span>
            Claude is still analyzing the photo — species + length will
            update when it lands. You can keep editing and save anytime.
          </span>
        </div>
      )}

      {lastCatch && kind === 'catch' && !aiAnalysisPending && (
        <div className="text-[11px] text-muted -mb-1">
          Pre-filled from your last catch
          {lastCatch.locationName ? ` at ${lastCatch.locationName}` : ''} —
          edit anything below.
        </div>
      )}

      <Field label="Type">
        <div className="grid grid-cols-3 gap-2">
          {(['catch', 'hatch', 'note'] as LogKind[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              className={`h-11 rounded-xl border transition text-sm font-medium ${
                kind === k
                  ? 'bg-accent/15 border-accent text-text'
                  : 'bg-surface-2 border-border text-muted'
              }`}
            >
              {k === 'catch' && '🐟 Catch'}
              {k === 'hatch' && '🪲 Hatch'}
              {k === 'note' && '📝 Note'}
            </button>
          ))}
        </div>
      </Field>

      {draft.species && kind === 'catch' && (
        <div className="rounded-lg bg-accent/5 border border-accent/30 p-2 text-xs flex items-start gap-2">
          <Sparkles className="w-3.5 h-3.5 text-accent mt-0.5" />
          <div>
            Claude IDed this as <b>{draft.species}</b>
            {draft.lengthInches != null && ` ~${draft.lengthInches}"`} (
            {draft.speciesConfidence} confidence)
          </div>
        </div>
      )}
      {draft.hatchName && kind === 'hatch' && (
        <div className="rounded-lg bg-accent/5 border border-accent/30 p-2 text-xs flex items-start gap-2">
          <Sparkles className="w-3.5 h-3.5 text-accent mt-0.5" />
          <div>
            Claude IDed this as <b>{draft.hatchName}</b>
            {draft.hatchStage && draft.hatchStage !== 'unknown' && ` (${draft.hatchStage})`}
          </div>
        </div>
      )}

      {kind === 'catch' && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Species">
              <Input
                value={draft.species ?? ''}
                onChange={(e) => update('species', e.target.value)}
                placeholder="Brown trout"
              />
            </Field>
            <Field label="Length (in)">
              <Input
                type="number"
                inputMode="decimal"
                step="0.1"
                value={draft.lengthInches ?? ''}
                onChange={(e) =>
                  update(
                    'lengthInches',
                    e.target.value === '' ? undefined : Number(e.target.value)
                  )
                }
              />
            </Field>
          </div>
          <Field label="Method">
            <Select
              value={draft.method ?? ''}
              onChange={(e) =>
                update('method', (e.target.value || undefined) as FishingMethod | undefined)
              }
            >
              <option value="">— pick —</option>
              {FISHING_METHODS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Fly / Lure">
            <Input
              value={draft.flyOrLure ?? ''}
              onChange={(e) => update('flyOrLure', e.target.value)}
              placeholder="Size 16 sulfur emerger / Stinger spoon orange/silver"
            />
          </Field>
          {draft.method === 'troll' && (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Depth (ft)">
                <Input
                  type="number"
                  inputMode="decimal"
                  step="0.5"
                  value={draft.trollingDepthFt ?? ''}
                  onChange={(e) =>
                    update(
                      'trollingDepthFt',
                      e.target.value === ''
                        ? undefined
                        : Number(e.target.value)
                    )
                  }
                />
              </Field>
              <Field label="Speed (mph)">
                <Input
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  value={draft.trollingSpeedMph ?? ''}
                  onChange={(e) =>
                    update(
                      'trollingSpeedMph',
                      e.target.value === ''
                        ? undefined
                        : Number(e.target.value)
                    )
                  }
                />
              </Field>
            </div>
          )}
          <Field label="Disposition">
            <div className="grid grid-cols-2 gap-2">
              {(['released', 'kept'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => update('releasedOrKept', d)}
                  className={`h-11 rounded-xl border ${
                    draft.releasedOrKept === d
                      ? d === 'released'
                        ? 'bg-accent/15 border-accent text-text'
                        : 'bg-warn/15 border-warn text-text'
                      : 'bg-surface-2 border-border text-muted'
                  }`}
                >
                  {d === 'released' ? 'Released' : 'Kept'}
                </button>
              ))}
            </div>
          </Field>
        </>
      )}

      {kind === 'hatch' && (
        <>
          <Field label="Insect">
            <Input
              value={draft.hatchName ?? ''}
              onChange={(e) => update('hatchName', e.target.value)}
              placeholder="Sulfur, BWO, Hex…"
            />
          </Field>
          <Field label="Stage">
            <Select
              value={draft.hatchStage ?? ''}
              onChange={(e) =>
                update('hatchStage', (e.target.value || undefined) as HatchStage | undefined)
              }
            >
              <option value="">— unknown —</option>
              {[
                'adult',
                'dun',
                'spinner',
                'emerger',
                'nymph',
                'larva',
                'pupa',
              ].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </Field>
        </>
      )}

      <Field label="Notes">
        <textarea
          value={draft.notes ?? ''}
          onChange={(e) => update('notes', e.target.value)}
          rows={3}
          placeholder="Anything to remember next time?"
          className="px-3 py-2 rounded-xl bg-surface-2 border border-border text-text placeholder:text-muted focus:outline-none focus:border-accent/60"
        />
      </Field>

      <div className="rounded-xl border border-border bg-surface-2/40 p-3 text-xs flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-muted">
          <MapPin className="w-3.5 h-3.5" />
          {draft.locationName ?? (draft.gps ? 'Unsaved spot' : 'No location')}
          {draft.gps && (
            <span className="num">
              ({draft.gps.lat.toFixed(4)}, {draft.gps.lng.toFixed(4)})
            </span>
          )}
        </div>
        <div className="text-muted num">
          {Number.isFinite(draft.conditions?.airTempF) &&
            `${Math.round(draft.conditions!.airTempF)}°F air`}
          {draft.flowReading?.waterTempF != null &&
            ` · ${Math.round(draft.flowReading.waterTempF)}°F water`}
          {draft.flowReading?.flowCfs != null &&
            ` · ${Math.round(draft.flowReading.flowCfs)} cfs`}
          {Number.isFinite(draft.conditions?.pressureMb) &&
            ` · ${Math.round(draft.conditions!.pressureMb)} mb ${draft.conditions!.pressureTrend}`}
        </div>
        {draft.flowReading?.siteName && (
          <div className="text-muted text-[10px]">
            From {draft.flowReading.siteName}
          </div>
        )}
      </div>

      {error && <div className="text-sm text-danger">{error}</div>}

      <div className="flex gap-2 justify-end pt-1">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={save}>Save log</Button>
      </div>
    </div>
  );
}

function BigChoice({
  label,
  hint,
  icon: Icon,
  onClick,
  disabled,
}: {
  label: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-start gap-3 px-4 py-3 rounded-xl border border-border bg-surface-2 hover:border-accent/40 active:scale-[0.99] transition text-left disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-border disabled:active:scale-100"
    >
      <div className="rounded-lg bg-accent/15 p-2 text-accent">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="font-semibold">{label}</div>
        <div className="text-xs text-muted mt-0.5">{hint}</div>
      </div>
    </button>
  );
}

function zeroConditions() {
  return {
    airTempF: Number.NaN,
    pressureMb: Number.NaN,
    pressureTrend: 'steady' as const,
    weatherCode: 0,
    moonPhase: 0,
    moonIllumination: 0,
  };
}
