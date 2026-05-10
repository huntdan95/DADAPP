import { useRef, useState } from 'react';
import {
  Camera,
  Image as ImageIcon,
  Loader2,
  MapPin,
  Sparkles,
  StickyNote,
} from 'lucide-react';
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
  makeThumbnailDataUrl,
  saveLogEntry,
  uploadLogPhoto,
} from '@/lib/log/store';
import {
  getDeviceGps,
  nearestSavedLocation,
  snapshotForGps,
} from '@/lib/log/snapshot';
import { analyzePhoto } from '@/lib/ai/analyzePhoto';
import { FISHING_METHODS, type FishingMethod } from '@/lib/journal/types';
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
  onClose,
  onSaved,
}: {
  locations: Location[];
  onClose: () => void;
  onSaved: (entry: LogEntry) => void;
}) {
  const [phase, setPhase] = useState<Phase>('pick');
  const [kind, setKind] = useState<LogKind>('catch');
  const [loadingStatus, setLoadingStatus] = useState<string>('Working…');
  const [error, setError] = useState<string | null>(null);

  // Draft fields — populated by photo analysis + conditions snapshot.
  const [thumb, setThumb] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<LogEntry>>({});

  const cameraRef = useRef<HTMLInputElement>(null);
  const libraryRef = useRef<HTMLInputElement>(null);

  function pickFromCamera() {
    cameraRef.current?.click();
  }
  function pickFromLibrary() {
    libraryRef.current?.click();
  }

  async function startWithPhoto(file: File) {
    setError(null);
    setPhase('loading');
    setLoadingStatus('Compressing photo…');

    const logId = newLogId();
    try {
      const thumbUrl = await makeThumbnailDataUrl(file);
      setThumb(thumbUrl);

      // Run upload + GPS in parallel.
      setLoadingStatus('Uploading + locating…');
      const [{ url, path }, gps] = await Promise.all([
        uploadLogPhoto(logId, file),
        getDeviceGps(),
      ]);

      const matchedLoc = gps ? nearestSavedLocation(gps, locations) : null;
      const timezone =
        matchedLoc?.timezone ??
        Intl.DateTimeFormat().resolvedOptions().timeZone ??
        'America/New_York';

      // Conditions snapshot + Claude analysis in parallel.
      setLoadingStatus('Snapping conditions + analyzing photo…');
      const [snap, analysis] = await Promise.all([
        gps
          ? snapshotForGps(gps, timezone).catch(() => ({
              conditions: zeroConditions(),
              flowReading: undefined,
            }))
          : Promise.resolve({ conditions: zeroConditions(), flowReading: undefined }),
        analyzePhoto({
          imageUrl: url,
          hintLocation: matchedLoc?.name,
        }).catch((e) => {
          // Don't fail the whole flow on a Claude error — fall back to manual.
          console.warn('analyzePhoto failed', e);
          return null;
        }),
      ]);

      const inferredKind: LogKind =
        analysis?.kind === 'insect'
          ? 'hatch'
          : analysis?.kind === 'fish'
          ? 'catch'
          : 'note';
      setKind(inferredKind);

      setDraft({
        id: logId,
        kind: inferredKind,
        time: new Date().toISOString(),
        gps: gps ?? undefined,
        locationId: matchedLoc?.id,
        locationName: matchedLoc?.name,
        photoUrl: url,
        photoPath: path,
        species: analysis?.kind === 'fish' ? analysis.species : undefined,
        speciesConfidence:
          analysis?.kind === 'fish' ? analysis.confidence : undefined,
        lengthInches:
          analysis?.kind === 'fish' && analysis.estimated_length_inches != null
            ? analysis.estimated_length_inches
            : undefined,
        hatchName: analysis?.kind === 'insect' ? analysis.insect_name : undefined,
        hatchStage:
          analysis?.kind === 'insect' ? analysis.insect_stage : undefined,
        notes: analysis?.notes ?? undefined,
        conditions: snap.conditions,
        flowReading: snap.flowReading,
      });

      setPhase('preview');
    } catch (e) {
      setError(friendlyError(e));
      setPhase('pick');
    }
  }

  async function startNoteOnly() {
    setError(null);
    setPhase('loading');
    setLoadingStatus('Locating + snapping conditions…');
    try {
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

      setKind('note');
      setDraft({
        id: newLogId(),
        kind: 'note',
        time: new Date().toISOString(),
        gps: gps ?? undefined,
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
      };
      await saveLogEntry(entry);
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
        <BigChoice
          label="Take a photo"
          hint="Claude will figure out fish or hatch and snap conditions."
          icon={Camera}
          onClick={pickFromCamera}
        />
        <BigChoice
          label="Choose from library"
          hint="Same as above, but pick an existing photo."
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
        <div className="flex items-center gap-2 text-muted">
          <Loader2 className="w-4 h-4 animate-spin" />
          {loadingStatus}
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
}: {
  label: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-start gap-3 px-4 py-3 rounded-xl border border-border bg-surface-2 hover:border-accent/40 active:scale-[0.99] transition text-left"
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
