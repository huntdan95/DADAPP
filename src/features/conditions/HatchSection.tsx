import { CardSection } from '@/components/ui/Card';
import type { Location } from '@/lib/providers/types';

/**
 * Phase 5 wires up data/hatches.json + filtering by month/state/water-temp.
 * For Phase 1 we render a placeholder so the composition pattern is visible
 * end-to-end on the conditions card.
 */
export function HatchSection({ location }: { location: Location }) {
  return (
    <CardSection label="Active Hatches">
      <div className="text-sm text-muted">
        Hatch matching arrives in Phase 5 ({location.state} hatch entries
        seeded from data/hatches.json).
      </div>
    </CardSection>
  );
}
