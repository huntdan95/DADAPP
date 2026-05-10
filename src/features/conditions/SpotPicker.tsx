import { useState } from 'react';
import { ChevronDown, MapPin, Plus, Check } from 'lucide-react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import type { Location } from '@/lib/providers/types';
import { cn } from '@/lib/utils';

/**
 * Big tappable button showing the current spot. Tap it to open a sheet
 * listing every saved spot + "Add a new spot". Replaced the horizontal
 * pill row because non-tech-savvy users were missing the scroll affordance
 * and could only see the active pill.
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
  const [open, setOpen] = useState(false);
  const current = locations.find((l) => l.id === currentId) ?? null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-3 px-4 h-14 rounded-2xl bg-surface-2 border border-border hover:border-accent/40 active:scale-[0.99] transition w-full text-left"
      >
        <MapPin className="w-5 h-5 text-accent shrink-0" />
        <div className="flex-1 min-w-0">
          {current ? (
            <>
              <div className="text-base font-semibold truncate">
                {current.name}
              </div>
              <div className="text-xs text-muted truncate">
                {[current.river, current.type, current.state]
                  .filter(Boolean)
                  .join(' · ')}
              </div>
            </>
          ) : (
            <div className="text-sm text-muted">Pick a spot</div>
          )}
        </div>
        <ChevronDown className="w-4 h-4 text-muted shrink-0" />
      </button>

      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        title="Pick a spot"
      >
        <div className="flex flex-col gap-1.5">
          {locations.map((loc) => {
            const active = loc.id === currentId;
            return (
              <button
                key={loc.id}
                type="button"
                onClick={() => {
                  onPick(loc.id);
                  setOpen(false);
                }}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-xl border text-left transition',
                  active
                    ? 'bg-accent/10 border-accent text-text'
                    : 'bg-surface-2 border-border hover:border-accent/40'
                )}
              >
                <MapPin
                  className={cn(
                    'w-5 h-5 shrink-0',
                    active ? 'text-accent' : 'text-muted'
                  )}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{loc.name}</div>
                  <div className="text-xs text-muted truncate">
                    {[loc.river, loc.type, loc.state]
                      .filter(Boolean)
                      .join(' · ')}
                  </div>
                </div>
                {active && <Check className="w-4 h-4 text-accent shrink-0" />}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => {
              onAdd();
              setOpen(false);
            }}
            className="flex items-center gap-3 px-3 py-3 rounded-xl border border-dashed border-border text-muted hover:text-text hover:border-accent/40 transition mt-1"
          >
            <Plus className="w-5 h-5 shrink-0" />
            <span className="font-semibold">Add a new spot</span>
          </button>
        </div>
      </BottomSheet>
    </>
  );
}
