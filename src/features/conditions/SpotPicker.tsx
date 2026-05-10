import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Location } from '@/lib/providers/types';

/**
 * Horizontal pill row at the top of the Conditions tab. Lets the user
 * pick exactly one location to view, plus one trailing "+ Add" pill that
 * opens the LocationForm sheet. Designed so the active pill is obvious
 * at a glance and the row scrolls horizontally on narrow screens.
 */
export function SpotPicker({
  locations,
  currentId,
  onPick,
  onAdd,
}: {
  locations: Location[];
  currentId: string | null;
  onPick: (id: string) => void;
  onAdd: () => void;
}) {
  return (
    <div className="-mx-4 px-4 overflow-x-auto">
      <div className="flex items-center gap-2 pb-1">
        {locations.map((loc) => {
          const active = loc.id === currentId;
          return (
            <button
              key={loc.id}
              type="button"
              onClick={() => onPick(loc.id)}
              className={cn(
                'shrink-0 px-3 py-2 rounded-full text-sm font-medium border transition',
                active
                  ? 'bg-accent text-bg border-accent'
                  : 'bg-surface-2 border-border text-text hover:border-accent/40'
              )}
            >
              {loc.name}
              <span
                className={cn(
                  'ml-1.5 text-[10px] uppercase tracking-wider',
                  active ? 'text-bg/70' : 'text-muted'
                )}
              >
                {loc.state}
              </span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={onAdd}
          className="shrink-0 flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium border border-dashed border-border text-muted hover:text-text hover:border-accent/40 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          Add a spot
        </button>
      </div>
    </div>
  );
}
