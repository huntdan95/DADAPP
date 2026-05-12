import { useMemo, useState } from 'react';
import { ChevronRight, Waves } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { Location } from '@/lib/providers/types';
import { matchWaterbody } from '@/lib/waterbodies/matcher';
import type { Waterbody } from '@/lib/waterbodies/types';
import { WaterbodyDetailSheet } from '@/features/waterbodies/WaterbodyDetailSheet';

/**
 * Slim Waters Guide entry-point on the Conditions page.
 *
 * Renders only when the spot matches one of our curated waterbody
 * profiles. By design this is intentionally bare — name + one-line
 * subtitle + chevron. All the detail (species, patterns, hatch
 * calendar, access, notes) lives behind the tap, in the
 * WaterbodyDetailSheet.
 *
 * Rationale: the Conditions page already carries species + fly box
 * sections that are waterbody-aware. Repeating that data here is
 * noise. The card's job is just to signal "yes, you're on a famous
 * water" and provide a one-tap path to the full Waters Guide entry.
 */
export function WatersGuideCard({ location }: { location: Location }) {
  const waterbody = useMemo(() => matchWaterbody(location), [location]);
  const [open, setOpen] = useState(false);

  if (!waterbody) return null;

  return (
    <>
      <Card>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full px-4 py-3 flex items-center gap-3 text-left group"
        >
          <Waves className="w-4 h-4 text-info flex-none" />
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-wider text-muted">
              Waters Guide
            </div>
            <div className="text-sm font-semibold truncate group-hover:text-accent transition">
              {waterbody.name}
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted flex-none group-hover:text-accent transition" />
        </button>
      </Card>

      <WaterbodyDetailSheet
        waterbody={open ? waterbody : null}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

// Kept for downstream typing — narrow re-export.
export type { Waterbody };
