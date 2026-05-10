import { ExternalLink, Image as ImageIcon, Youtube, BookOpen } from 'lucide-react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import type { Hatch } from '@/lib/hatches/store';

/**
 * Detail view for a single hatch. Tap a hatch row in HatchSection to
 * open this. Surfaces the existing fly recommendations + notes, plus
 * external links for:
 *   - a YouTube tying-tutorial search (most useful next action)
 *   - a Google Images search for live bug photos
 *   - Wikipedia for the species (where we know the slug)
 *
 * We use search URLs rather than hardcoded video IDs / image URLs so
 * nothing 404s as content rotates online.
 */
export function HatchDetailSheet({
  hatch,
  onClose,
}: {
  hatch: Hatch | null;
  onClose: () => void;
}) {
  if (!hatch) {
    return <BottomSheet open={false} onClose={onClose}>{null}</BottomSheet>;
  }

  const term = hatch.searchTerm ?? hatch.name;
  const tyingSearch = `https://www.youtube.com/results?search_query=${encodeURIComponent(term + ' fly tying tutorial')}`;
  const bugSearch = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(term)}`;
  const flySearch = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(term + ' fly fishing pattern')}`;
  const wikiUrl = hatch.wikipediaSlug
    ? `https://en.wikipedia.org/wiki/${hatch.wikipediaSlug}`
    : null;

  return (
    <BottomSheet open={hatch != null} onClose={onClose} title={hatch.name}>
      <div className="flex flex-col gap-4">
        <div>
          <div className="text-sm text-muted italic">{hatch.scientific}</div>
          <div className="text-xs text-muted mt-1 num">
            Water {hatch.waterTempMinF}–{hatch.waterTempMaxF}°F · {hatch.timeOfDay}
            {hatch.stages.length > 0 && ` · stages: ${hatch.stages.join(', ')}`}
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wider text-muted mb-1">
            Flies to use
          </div>
          <ul className="text-sm flex flex-col gap-0.5">
            {hatch.flies.map((f, i) => (
              <li key={i}>• {f}</li>
            ))}
          </ul>
        </div>

        {hatch.notes && (
          <div className="text-sm text-text">{hatch.notes}</div>
        )}

        <div className="border-t border-border pt-3">
          <div className="text-xs uppercase tracking-wider text-muted mb-2">
            Learn more
          </div>
          <div className="flex flex-col gap-2">
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
            <LinkButton
              href={bugSearch}
              icon={ImageIcon}
              label="See real bug photos"
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
