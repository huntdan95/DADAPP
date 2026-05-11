import { useRef, useState } from 'react';
import { Loader2, Ruler } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select } from '@/components/ui/Input';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getFirebaseApp } from '@/lib/firebase';
import { friendlyError } from '@/lib/errors';
import type { LogEntry } from '@/lib/log/types';

/**
 * Pixel-ratio length refinement. The user taps four points on the
 * photo:
 *   1. Fish head (nose)
 *   2. Fish tail (fork)
 *   3. Reference object — start
 *   4. Reference object — end
 *
 * Then picks (or types) the reference's known length in inches. We
 * compute pixel distance for both pairs, divide, and report the
 * fish length. Saves back to the log entry's `lengthInches` field.
 *
 * No AI involved — pure geometry on tap coordinates. The catch is
 * worth doing carefully: most camera-angle errors are tolerable as
 * long as the reference is in roughly the same plane as the fish.
 */

type Step =
  | 'fish-head'
  | 'fish-tail'
  | 'ref-start'
  | 'ref-end'
  | 'review';

interface Point {
  x: number;
  y: number;
}

const REFERENCE_OPTIONS: Array<{ label: string; inches: number }> = [
  { label: 'My hand width (palm)', inches: 4 },
  { label: 'My hand span (thumb to pinky)', inches: 8 },
  { label: 'Dollar bill (long side)', inches: 6.14 },
  { label: 'Rod butt section', inches: 5 },
  { label: 'Reel reel-foot length', inches: 4 },
  { label: 'Net opening width (typical)', inches: 18 },
];

export function LengthTapTool({
  open,
  entry,
  onClose,
  onSaved,
}: {
  open: boolean;
  entry: LogEntry | null;
  onClose: () => void;
  onSaved: (lengthInches: number) => void;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<Step>('fish-head');
  const [fishHead, setFishHead] = useState<Point | null>(null);
  const [fishTail, setFishTail] = useState<Point | null>(null);
  const [refStart, setRefStart] = useState<Point | null>(null);
  const [refEnd, setRefEnd] = useState<Point | null>(null);
  const [refLabel, setRefLabel] = useState(REFERENCE_OPTIONS[0].label);
  const [refInches, setRefInches] = useState<string>(
    String(REFERENCE_OPTIONS[0].inches)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setStep('fish-head');
    setFishHead(null);
    setFishTail(null);
    setRefStart(null);
    setRefEnd(null);
    setError(null);
  }

  function handleTap(e: React.PointerEvent<HTMLDivElement>) {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const p: Point = { x, y };
    switch (step) {
      case 'fish-head':
        setFishHead(p);
        setStep('fish-tail');
        break;
      case 'fish-tail':
        setFishTail(p);
        setStep('ref-start');
        break;
      case 'ref-start':
        setRefStart(p);
        setStep('ref-end');
        break;
      case 'ref-end':
        setRefEnd(p);
        setStep('review');
        break;
      case 'review':
        break;
    }
  }

  const computedInches = computeLength({
    fishHead,
    fishTail,
    refStart,
    refEnd,
    refInches: Number(refInches),
  });

  async function save() {
    if (!entry) return;
    if (computedInches == null || computedInches <= 0) {
      setError('Need all four tap points + a valid reference length');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const app = getFirebaseApp();
      if (!app) throw new Error('Firebase not configured');
      const u = getAuth(app).currentUser;
      if (!u) throw new Error('Not signed in');
      const db = getFirestore(app);
      // Round to a sensible precision — fishing-length precision is half-inch.
      const rounded = Math.round(computedInches * 2) / 2;
      await updateDoc(doc(db, 'users', u.uid, 'logs', entry.id), {
        lengthInches: rounded,
      });
      onSaved(rounded);
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setSaving(false);
    }
  }

  function applyPreset(label: string) {
    const preset = REFERENCE_OPTIONS.find((o) => o.label === label);
    setRefLabel(label);
    if (preset) setRefInches(String(preset.inches));
  }

  if (!entry?.photoUrl) {
    return null;
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Refine length">
      <div className="flex flex-col gap-3">
        <StepHint step={step} />

        <div
          ref={containerRef}
          onPointerDown={handleTap}
          className="relative rounded-xl overflow-hidden border border-border touch-none select-none cursor-crosshair"
        >
          <img
            ref={imgRef}
            src={entry.photoUrl}
            alt="Catch photo"
            className="block w-full max-h-[60vh] object-contain bg-bg pointer-events-none"
          />
          {fishHead && (
            <Marker x={fishHead.x} y={fishHead.y} color="#4ade80" label="H" />
          )}
          {fishTail && (
            <Marker x={fishTail.x} y={fishTail.y} color="#4ade80" label="T" />
          )}
          {fishHead && fishTail && (
            <ConnectingLine a={fishHead} b={fishTail} color="#4ade80" />
          )}
          {refStart && (
            <Marker x={refStart.x} y={refStart.y} color="#fbbf24" label="R1" />
          )}
          {refEnd && (
            <Marker x={refEnd.x} y={refEnd.y} color="#fbbf24" label="R2" />
          )}
          {refStart && refEnd && (
            <ConnectingLine a={refStart} b={refEnd} color="#fbbf24" />
          )}
        </div>

        {step === 'review' && (
          <>
            <Field label="Reference object">
              <Select
                value={refLabel}
                onChange={(e) => applyPreset(e.target.value)}
              >
                {REFERENCE_OPTIONS.map((o) => (
                  <option key={o.label} value={o.label}>
                    {o.label} — {o.inches}″
                  </option>
                ))}
                <option value="__custom">Other / custom…</option>
              </Select>
            </Field>
            <Field label="Reference length (inches)">
              <Input
                type="number"
                inputMode="decimal"
                step="0.1"
                value={refInches}
                onChange={(e) => setRefInches(e.target.value)}
              />
            </Field>
            <div className="rounded-xl bg-accent/10 border border-accent/40 p-3 text-sm">
              <div className="text-[11px] uppercase tracking-wider text-muted">
                Calculated fish length
              </div>
              <div className="text-3xl font-semibold num mt-1">
                {computedInches != null ? `${computedInches.toFixed(1)}″` : '—'}
              </div>
              <div className="text-[11px] text-muted mt-1">
                Best when the reference object is in roughly the same plane
                as the fish. Diagonal references underestimate length.
              </div>
            </div>
          </>
        )}

        {error && <div className="text-sm text-danger">{error}</div>}

        <div className="flex gap-2 justify-between pt-1">
          <Button type="button" variant="ghost" onClick={reset}>
            Restart
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={save}
              disabled={saving || step !== 'review' || computedInches == null}
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? 'Saving…' : 'Save length'}
            </Button>
          </div>
        </div>
      </div>
    </BottomSheet>
  );
}

function StepHint({ step }: { step: Step }) {
  const messages: Record<Step, string> = {
    'fish-head': 'Tap the FISH HEAD (nose).',
    'fish-tail': 'Tap the FISH TAIL (fork).',
    'ref-start': 'Tap one END of your REFERENCE object.',
    'ref-end': 'Tap the OTHER END of the reference object.',
    review: 'Review the calculated length, then save.',
  };
  return (
    <div className="rounded-lg bg-surface-2 border border-border px-3 py-2 text-sm flex items-center gap-2">
      <Ruler className="w-4 h-4 text-accent shrink-0" />
      <span className="flex-1">{messages[step]}</span>
    </div>
  );
}

function Marker({
  x,
  y,
  color,
  label,
}: {
  x: number;
  y: number;
  color: string;
  label: string;
}) {
  return (
    <div
      style={{
        left: `${x * 100}%`,
        top: `${y * 100}%`,
        backgroundColor: color,
      }}
      className="absolute -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-bg flex items-center justify-center text-[8px] font-bold text-bg shadow-lg pointer-events-none"
    >
      {label}
    </div>
  );
}

function ConnectingLine({
  a,
  b,
  color,
}: {
  a: Point;
  b: Point;
  color: string;
}) {
  // Render as an SVG line spanning the parent. Container is relative,
  // SVG fills it, coordinates are %-based.
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      <line
        x1={a.x * 100}
        y1={a.y * 100}
        x2={b.x * 100}
        y2={b.y * 100}
        stroke={color}
        strokeWidth="0.6"
        strokeDasharray="1.5,1"
      />
    </svg>
  );
}

/**
 * Distance between two points in the unit-square coordinate space. We
 * convert to pixels by multiplying by the actual photo dimensions —
 * but since fish-length / ref-length is a RATIO, the photo dimensions
 * cancel and we can compute directly in normalized coords.
 */
function pointDist(a: Point, b: Point): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

function computeLength(args: {
  fishHead: Point | null;
  fishTail: Point | null;
  refStart: Point | null;
  refEnd: Point | null;
  refInches: number;
}): number | null {
  const { fishHead, fishTail, refStart, refEnd, refInches } = args;
  if (!fishHead || !fishTail || !refStart || !refEnd) return null;
  if (!Number.isFinite(refInches) || refInches <= 0) return null;
  const fishDist = pointDist(fishHead, fishTail);
  const refDist = pointDist(refStart, refEnd);
  if (refDist === 0) return null;
  return (fishDist / refDist) * refInches;
}
