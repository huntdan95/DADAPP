import { useRef, useState } from 'react';
import { Image as ImageIcon, Loader2, Save, X } from 'lucide-react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select } from '@/components/ui/Input';
import {
  newCustomFlyId,
  saveCustomFly,
  uploadFlyPhoto,
  type CustomFly,
} from './store';
import { friendlyError } from '@/lib/errors';

/** Categories — must match the CATEGORIES list in FlyBox.tsx. */
const CATEGORY_OPTIONS = [
  { key: 'streamer', label: 'Streamer' },
  { key: 'mouse', label: 'Mouse' },
  { key: 'frog', label: 'Frog' },
  { key: 'run', label: 'Eggs / Run pattern' },
  { key: 'attractor', label: 'Attractor dry' },
  { key: 'subsurface', label: 'Sculpin / Crayfish / Lamprey' },
  { key: 'junk', label: 'Junk nymph' },
  { key: 'terrestrial', label: 'Terrestrial' },
  { key: 'stonefly', label: 'Stonefly' },
  { key: 'caddis', label: 'Caddis' },
  { key: 'midge', label: 'Midge' },
  { key: 'staple', label: 'Year-round food form' },
  { key: 'mayfly', label: 'Mayfly' },
];

/**
 * Form to add a user-defined fly to the Fly Box. Persists to
 * `users/{uid}/customFlies/{id}`. Optional photo upload to
 * Firebase Storage. YouTube link is just a string we save and
 * surface as a link on the detail sheet.
 */
export function CustomFlyForm({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('streamer');
  const [description, setDescription] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function handlePhotoPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    // Local-only preview while we wait for upload.
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleSave() {
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const id = newCustomFlyId();
      let photoUrl: string | undefined;
      if (photoFile) {
        // Upload BEFORE the Firestore write so we have a real URL to
        // store. Failure here surfaces before any partial save.
        photoUrl = await uploadFlyPhoto(id, photoFile);
      }
      const fly: CustomFly = {
        id,
        name: name.trim(),
        category,
        description: description.trim() || undefined,
        youtubeUrl: youtubeUrl.trim() || undefined,
        photoUrl,
        notes: notes.trim() || undefined,
      };
      await saveCustomFly(fly);
      onSaved();
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <BottomSheet open onClose={onClose} title="Add a fly to your box">
      <div className="flex flex-col gap-3">
        <Field label="Name">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Buster's Custom Streamer"
            autoFocus
          />
        </Field>

        <Field label="Category">
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Description (optional)">
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this fly? Where do you fish it?"
          />
        </Field>

        <Field label="YouTube tying video URL (optional)">
          <Input
            type="url"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://youtube.com/..."
          />
        </Field>

        <Field label="Notes (optional)">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tying recipe, hook size, color variations…"
            rows={3}
            className="w-full text-sm p-2 rounded-lg bg-surface-2 border border-border focus:border-accent/60 outline-none resize-y"
          />
        </Field>

        <Field label="Photo (optional)">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoPick}
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-surface-2 border border-border hover:border-accent/40 text-sm transition"
            >
              <ImageIcon className="w-4 h-4 text-muted" />
              {photoFile ? 'Change photo' : 'Choose photo'}
            </button>
            {photoPreview && (
              <button
                type="button"
                onClick={() => {
                  setPhotoFile(null);
                  setPhotoPreview(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                aria-label="Remove photo"
                className="p-2 rounded-lg border border-border text-muted hover:text-danger hover:border-danger/40"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {photoPreview && (
            <img
              src={photoPreview}
              alt="preview"
              className="mt-2 w-24 h-24 object-cover rounded-lg border border-border"
            />
          )}
        </Field>

        {error && <div className="text-sm text-danger">{error}</div>}

        <div className="flex gap-2 justify-end pt-1">
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || !name.trim()}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save fly
              </>
            )}
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
