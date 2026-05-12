import { useRef, useState } from 'react';
import {
  Bug,
  Camera,
  Image as ImageIcon,
  Loader2,
  Plus,
  ScanEye,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { identifyFly, type IdentifyFlyResult } from '@/lib/ai/identifyFly';
import { friendlyError } from '@/lib/errors';
import imageCompression from 'browser-image-compression';

/**
 * "Identify a fly or bug" — the photo-vision flow on the Fly Box page.
 *
 * Mirrors the fish-identify UX in QuickLog but specialized for two
 * adjacent jobs that both live in the angler's fly box:
 *
 *   - TIED FLY — a fly the user tied (or is holding) that they want
 *     named so they can find similar patterns in the database, or
 *     save as a custom fly.
 *
 *   - NATURAL BUG — a real insect photographed stream-side so the
 *     angler can match it to a hatch in the database.
 *
 * On success the sheet shows the AI result plus two follow-up
 * actions:
 *   - "Search Fly Box for this" — bubbles the identified name back
 *     up to the parent so it can drive the search bar.
 *   - "Add as a custom fly" — opens the existing CustomFlyForm
 *     prefilled with the identified name + category.
 */
export function IdentifyFlySheet({
  onClose,
  onSearch,
  onAddCustom,
}: {
  onClose: () => void;
  /** Called with a search query string when the user taps "Search". */
  onSearch: (query: string) => void;
  /** Called with prefill values when the user taps "Add as custom fly". */
  onAddCustom: (prefill: {
    name: string;
    category: string;
    notes: string;
  }) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<IdentifyFlyResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handlePhoto(file: File) {
    setBusy(true);
    setError(null);
    setResult(null);
    setPreviewUrl(URL.createObjectURL(file));
    try {
      // Compress for cheap vision. Same settings as the catch/log
      // upload path — keeps the network call quick on cell.
      const compressed = await imageCompression(file, {
        maxWidthOrHeight: 1280,
        maxSizeMB: 0.4,
        initialQuality: 0.8,
        fileType: 'image/jpeg',
        useWebWorker: true,
      });

      const { getStorage, ref, uploadBytes, getDownloadURL } = await import(
        'firebase/storage'
      );
      const { getFirebaseApp, getFirebaseAuth } = await import(
        '@/lib/firebase'
      );
      const app = getFirebaseApp();
      const auth = getFirebaseAuth();
      if (!app || !auth?.currentUser) throw new Error('Not signed in');

      const storage = getStorage(app);
      const tempPath = `users/${auth.currentUser.uid}/identify-temp/${Date.now()}.jpg`;
      const r = ref(storage, tempPath);
      await uploadBytes(r, compressed, { contentType: 'image/jpeg' });
      const url = await getDownloadURL(r);

      const out = await identifyFly({ imageUrl: url });
      setResult(out);
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setResult(null);
    setError(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  // Build the action buttons based on what the AI returned.
  // For a tied fly: search by name + offer to save as custom.
  // For a natural bug: search by insect name (finds matching hatches).
  // For "other" or low confidence: just show the result + try again.
  const primaryName =
    result?.kind === 'tied-fly'
      ? result.fly_name
      : result?.kind === 'insect'
      ? result.insect_name
      : null;

  function summaryLine(): string {
    if (!result) return '';
    if (result.kind === 'tied-fly') {
      const parts: string[] = [];
      if (result.fly_name) parts.push(result.fly_name);
      const meta: string[] = [];
      if (result.fly_category) meta.push(result.fly_category);
      if (result.color) meta.push(result.color);
      if (result.estimated_size) meta.push(result.estimated_size);
      if (meta.length > 0) parts.push(`(${meta.join(' · ')})`);
      return parts.join(' ') || 'Tied fly';
    }
    if (result.kind === 'insect') {
      const parts: string[] = [];
      if (result.insect_name) parts.push(result.insect_name);
      const meta: string[] = [];
      if (result.insect_order && result.insect_order !== 'unknown') {
        meta.push(result.insect_order);
      }
      if (result.insect_stage && result.insect_stage !== 'unknown') {
        meta.push(result.insect_stage);
      }
      if (meta.length > 0) parts.push(`(${meta.join(' · ')})`);
      return parts.join(' ') || 'Insect';
    }
    return 'Not a fly or bug';
  }

  function confidenceBadge() {
    if (!result) return null;
    const color =
      result.confidence === 'high'
        ? 'bg-accent/15 text-accent border-accent/40'
        : result.confidence === 'medium'
        ? 'bg-warn/15 text-warn border-warn/40'
        : 'bg-muted/15 text-muted border-border';
    return (
      <span
        className={`px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider border ${color}`}
      >
        {result.confidence} confidence
      </span>
    );
  }

  /** Map an AI fly_category to a CustomFly category key (matches CustomFlyForm). */
  function mapToCustomCategory(c?: string): string {
    switch (c) {
      case 'streamer':
        return 'streamer';
      case 'dry':
        return 'attractor';
      case 'nymph':
        return 'junk';
      case 'terrestrial':
        return 'terrestrial';
      case 'egg':
        return 'run';
      case 'popper':
        return 'frog';
      case 'wet':
        return 'attractor';
      default:
        return 'streamer';
    }
  }

  return (
    <BottomSheet open onClose={onClose} title="Identify a fly or bug">
      <div className="flex flex-col gap-4">
        {/* Hidden file input — single picker for camera/library/files */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handlePhoto(f);
          }}
        />

        {!previewUrl && !busy && (
          <>
            <div className="text-sm text-muted">
              Take or pick a photo of a fly you've tied, or a bug you spotted
              stream-side. Claude will name the pattern (or the natural
              insect) and tell you what category it belongs to.
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-start gap-3 px-4 py-3 rounded-xl border border-border bg-surface-2 hover:border-accent/40 active:scale-[0.99] transition text-left"
            >
              <div className="rounded-lg bg-accent/15 p-2 text-accent">
                <Camera className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-semibold">Take or pick a photo</div>
                <div className="text-xs text-muted mt-0.5">
                  iOS/Android shows Camera / Photo Library / Files options.
                </div>
              </div>
            </button>
            <div className="text-[11px] text-muted">
              Counts toward your daily Claude vision budget (5 photos/day).
            </div>
          </>
        )}

        {busy && (
          <div className="flex flex-col items-center justify-center py-6 gap-3">
            {previewUrl && (
              <img
                src={previewUrl}
                alt="preview"
                className="w-40 h-40 object-cover rounded-xl border border-border"
              />
            )}
            <div className="flex items-center gap-2 text-sm text-muted">
              <Loader2 className="w-4 h-4 animate-spin text-info" />
              Claude is analyzing the photo…
            </div>
            <div className="text-[11px] text-muted">
              May take ~5-25s depending on the photo.
            </div>
          </div>
        )}

        {result && !busy && (
          <div className="flex flex-col gap-3">
            {previewUrl && (
              <img
                src={previewUrl}
                alt="preview"
                className="w-full max-h-48 object-cover rounded-xl border border-border"
              />
            )}

            <div className="rounded-xl border border-accent/40 bg-accent/5 p-3 flex flex-col gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                {result.kind === 'tied-fly' && (
                  <Sparkles className="w-4 h-4 text-accent" />
                )}
                {result.kind === 'insect' && (
                  <Bug className="w-4 h-4 text-accent" />
                )}
                {result.kind === 'other' && (
                  <ScanEye className="w-4 h-4 text-muted" />
                )}
                <span className="text-sm font-semibold">{summaryLine()}</span>
                {confidenceBadge()}
              </div>
              <div className="text-xs text-muted leading-relaxed">
                {result.notes}
              </div>
            </div>

            {primaryName && (
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  onClick={() => {
                    onSearch(primaryName);
                    onClose();
                  }}
                >
                  <Search className="w-4 h-4" />
                  Search Fly Box for "{primaryName}"
                </Button>

                {result.kind === 'tied-fly' && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      const notes: string[] = [];
                      if (result.color) notes.push(`Color: ${result.color}`);
                      if (result.estimated_size)
                        notes.push(`Size: ${result.estimated_size}`);
                      notes.push(`Identified by Claude: ${result.notes}`);
                      onAddCustom({
                        name: primaryName,
                        category: mapToCustomCategory(result.fly_category),
                        notes: notes.join('\n'),
                      });
                      onClose();
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Add as a custom fly
                  </Button>
                )}
              </div>
            )}

            <div className="flex gap-2 justify-end pt-1">
              <Button variant="secondary" onClick={reset}>
                <X className="w-4 h-4" />
                Try another photo
              </Button>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-danger/40 bg-danger/10 p-3 text-sm text-danger">
            {error}
          </div>
        )}

        {!busy && !result && (
          <button
            type="button"
            onClick={() => {
              fileInputRef.current?.removeAttribute('capture');
              fileInputRef.current?.click();
            }}
            className="flex items-center gap-2 text-xs text-muted hover:text-text self-start"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Or pick from library
          </button>
        )}
      </div>
    </BottomSheet>
  );
}
