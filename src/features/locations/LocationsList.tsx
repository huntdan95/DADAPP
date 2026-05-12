import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { Location } from '@/lib/providers/types';
import type { LocationStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardSubtitle, CardTitle } from '@/components/ui/Card';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { LocationForm } from './LocationForm';

type SheetState =
  | { kind: 'closed' }
  | { kind: 'create' }
  | { kind: 'edit'; loc: Location };

export function LocationsList({
  locations,
  store,
  onSpotCreated,
}: {
  locations: Location[];
  store: LocationStore;
  /**
   * Fires only when a NEW spot is saved from this list (not on edit).
   * App.tsx uses it to switch the user to the Map tab and pan the
   * camera to the new pin.
   */
  onSpotCreated?: (id: string) => void;
}) {
  const [sheet, setSheet] = useState<SheetState>({ kind: 'closed' });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted">
          {locations.length} spot{locations.length === 1 ? '' : 's'}
        </div>
        <Button size="sm" onClick={() => setSheet({ kind: 'create' })}>
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      {locations.length === 0 ? (
        <div className="text-center text-muted py-12">
          No spots yet — tap Add to drop your first pin.
        </div>
      ) : (
        locations.map((loc) => (
          <Card key={loc.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>{loc.name}</CardTitle>
                  <CardSubtitle>
                    {[loc.river, loc.type, loc.state]
                      .filter(Boolean)
                      .join(' · ')}
                    {' · '}
                    <span className="num">
                      {loc.lat.toFixed(3)}, {loc.lng.toFixed(3)}
                    </span>
                  </CardSubtitle>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Edit"
                    onClick={() => setSheet({ kind: 'edit', loc })}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Delete"
                    onClick={() => {
                      if (confirm(`Delete "${loc.name}"?`)) store.remove(loc.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-danger" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <div className="px-4 pb-4 text-xs text-muted">
              {providerSummary(loc)}
            </div>
          </Card>
        ))
      )}

      <BottomSheet
        open={sheet.kind !== 'closed'}
        onClose={() => setSheet({ kind: 'closed' })}
        title={sheet.kind === 'edit' ? 'Edit spot' : 'Add a spot'}
      >
        {sheet.kind !== 'closed' && (
          <LocationForm
            initial={sheet.kind === 'edit' ? sheet.loc : undefined}
            onCancel={() => setSheet({ kind: 'closed' })}
            onSave={async (loc) => {
              const wasCreate = sheet.kind === 'create';
              await store.upsert(loc);
              setSheet({ kind: 'closed' });
              if (wasCreate) onSpotCreated?.(loc.id);
            }}
          />
        )}
      </BottomSheet>
    </div>
  );
}

function providerSummary(loc: Location): string {
  const parts: string[] = ['weather: open-meteo'];
  const f = loc.dataProviders.flow;
  if (f) {
    if (f.kind === 'usgs') parts.push(`flow: USGS ${f.siteId}`);
    else if (f.kind === 'env-canada')
      parts.push(`flow: EC ${f.stationId}`);
    else if (f.kind === 'uk-ea') parts.push(`flow: UK ${f.stationRef}`);
  }
  const d = loc.dataProviders.damSchedule;
  if (d) {
    if (d.kind === 'tva') parts.push(`dam: TVA ${d.dam}`);
    else if (d.kind === 'consumers-energy')
      parts.push(`dam: CE ${d.dam}`);
    else if (d.kind === 'usace') parts.push('dam: USACE');
    else parts.push('dam: manual');
  }
  return parts.join(' · ');
}
