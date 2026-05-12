import { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  ExternalLink,
  Image as ImageIcon,
  Loader2,
  Plus,
  StickyNote,
  Trash2,
  Youtube,
} from 'lucide-react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import type { Hatch } from '@/lib/hatches/store';
import {
  deleteCustomFly,
  getFlyNotes,
  saveFlyNotes,
  uploadFlyPhoto,
  type CustomFly,
} from './store';
import { friendlyError } from '@/lib/errors';

/**
 * Detail sheet for a single fly entry. Two flavors of input:
 *   - Built-in Hatch entry (from hatches.json) — read-only data,
 *     editable user-augmentation (notes + tied photos)
 *   - Custom fly the user added — fully editable, includes YouTube
 *     link + description.
 */
export function FlyDetail({
  entry,
  onClose,
}: {
  entry: Hatch | CustomFly;
  onClose: () => void;
}) {
  const isCustom = 'category' in entry && !('startMonth' in entry);

  const [notes, setNotes] = useState('');
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Load existing notes + photos on open.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getFlyNotes(entry.id)
      .then((existing) => {
        if (cancelled) return;
        setNotes(existing?.notes ?? '');
        setPhotoUrls(existing?.photoUrls ?? []);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [entry.id]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadFlyPhoto(entry.id, file);
      const next = [...photoUrls, url];
      setPhotoUrls(next);
      // Persist immediately so the photo doesn't get lost on close.
      await saveFlyNotes(entry.id, notes, next);
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setUploading(false);
      // Reset the input so the same file can be re-selected if needed.
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleNotesSave() {
    setSaving(true);
    setError(null);
    try {
      await saveFlyNotes(entry.id, notes, photoUrls);
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setSaving(false);
    }
  }

  async function handlePhotoDelete(url: string) {
    if (!confirm('Remove this photo from your tied versions?')) return;
    const next = photoUrls.filter((u) => u !== url);
    setPhotoUrls(next);
    await saveFlyNotes(entry.id, notes, next).catch((e) =>
      setError(friendlyError(e))
    );
  }

  async function handleDeleteCustomFly() {
    if (!isCustom) return;
    if (
      !confirm(
        `Delete custom fly "${entry.name}"? Your photos + notes for this fly will also be removed.`
      )
    )
      return;
    try {
      await deleteCustomFly(entry.id);
      onClose();
    } catch (e) {
      setError(friendlyError(e));
    }
  }

  // External-link buildup. We use search URLs rather than hardcoded
  // video IDs so links don't 404 as YouTube content rotates.
  const term = isCustom
    ? entry.name
    : (entry as Hatch).searchTerm ?? entry.name;
  const tyingSearch = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    term + ' fly tying tutorial'
  )}`;
  const flySearch = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(
    term + ' fly fishing pattern'
  )}`;
  const wikiUrl = !isCustom && (entry as Hatch).wikipediaSlug
    ? `https://en.wikipedia.org/wiki/${(entry as Hatch).wikipediaSlug}`
    : null;
  const customYoutube = isCustom ? (entry as CustomFly).youtubeUrl : null;

  return (
    <BottomSheet open onClose={onClose} title={entry.name}>
      <div className="flex flex-col gap-4">
        {/* Metadata */}
        {!isCustom && (
          <div>
            <div className="text-sm text-muted italic">
              {(entry as Hatch).scientific}
            </div>
            <div className="text-xs text-muted mt-1 num">
              Water {(entry as Hatch).waterTempMinF}–
              {(entry as Hatch).waterTempMaxF}°F ·{' '}
              {(entry as Hatch).timeOfDay}
              {(entry as Hatch).stages.length > 0 &&
                ` · ${(entry as Hatch).stages.join(', ')}`}
            </div>
          </div>
        )}
        {isCustom && (entry as CustomFly).description && (
          <div className="text-sm text-text">
            {(entry as CustomFly).description}
          </div>
        )}

        {!isCustom && (entry as Hatch).notes && (
          <div className="text-sm text-text">{(entry as Hatch).notes}</div>
        )}

        {/* Fly toolkit (built-in entries only) */}
        {!isCustom && (entry as Hatch).flies.length > 0 && (
          <div>
            <div className="text-xs uppercase tracking-wider text-muted mb-1">
              Patterns
            </div>
            <ul className="text-sm flex flex-col gap-0.5">
              {(entry as Hatch).flies.map((f, i) => (
                <li key={i}>• {f}</li>
              ))}
            </ul>
          </div>
        )}

        {/* User-tied photos */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs uppercase tracking-wider text-muted">
              Your tied versions
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent/80"
            >
              {uploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
              Add photo
            </button>
          </div>
          {loading ? (
            <div className="text-xs text-muted">Loading…</div>
          ) : photoUrls.length === 0 ? (
            <div className="text-xs text-muted italic">
              No photos yet. Tap Add photo to upload one you tied.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {photoUrls.map((url, i) => (
                <div
                  key={url}
                  className="relative group rounded-lg overflow-hidden bg-surface-2 aspect-square"
                >
                  <img
                    src={url}
                    alt={`tied ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handlePhotoDelete(url)}
                    aria-label="Remove photo"
                    className="absolute top-1 right-1 p-1 rounded-full bg-bg/70 text-danger opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User notes */}
        <div>
          <div className="text-xs uppercase tracking-wider text-muted mb-1 flex items-center gap-1.5">
            <StickyNote className="w-3 h-3" />
            Your notes
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tying tips, where it worked, color variations…"
            rows={4}
            className="w-full text-sm p-2 rounded-lg bg-surface-2 border border-border focus:border-accent/60 outline-none resize-y"
          />
          <div className="flex justify-end mt-1">
            <Button size="sm" onClick={handleNotesSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving…
                </>
              ) : (
                'Save notes'
              )}
            </Button>
          </div>
        </div>

        {error && <div className="text-xs text-danger">{error}</div>}

        {/* External links */}
        <div className="border-t border-border pt-3">
          <div className="text-xs uppercase tracking-wider text-muted mb-2">
            Learn more
          </div>
          <div className="flex flex-col gap-2">
            {customYoutube && (
              <LinkButton
                href={customYoutube}
                icon={Youtube}
                label="Watch the tying video"
                hint="The link you saved on this custom fly"
              />
            )}
            <LinkButton
              href={tyingSearch}
              icon={Youtube}
              label="Watch tying videos"
              hint="Opens YouTube search"
            />
            <LinkButton
              href={flySearch}
              icon={ImageIcon}
              label="See tied fly examples"
              hint="Opens Google Images"
            />
            {wikiUrl && (
              <LinkButton
                href={wikiUrl}
                icon={BookOpen}
                label="Read on Wikipedia"
                hint="Background + life cycle"
              />
            )}
          </div>
        </div>

        {/* Delete (custom flies only) */}
        {isCustom && (
          <div className="border-t border-border pt-3">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDeleteCustomFly}
              className="text-danger"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete this custom fly
            </Button>
          </div>
        )}
      </div>
    </BottomSheet>
  );
}

function LinkButton({
  href,
  icon: Icon,
  label,
  hint,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  hint: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-xl border border-border bg-surface-2 hover:border-accent/40 active:scale-[0.99] transition"
    >
      <div className="rounded-lg bg-accent/15 p-2 text-accent">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold">{label}</div>
        <div className="text-xs text-muted">{hint}</div>
      </div>
      <ExternalLink className="w-3.5 h-3.5 text-muted" />
    </a>
  );
}
