import { useEffect, useMemo, useState } from 'react';
import { Activity, Map as MapIcon, ListChecks, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BottomNav } from '@/components/ui/BottomNav';
import { ConditionsCard } from '@/features/conditions/ConditionsCard';
import { MapView } from '@/features/map/MapView';
import { LocationsList } from '@/features/locations/LocationsList';
import { getLocationStore } from '@/lib/store';
import type { Location } from '@/lib/providers/types';

type Tab = 'conditions' | 'map' | 'spots';

const TABS = [
  { key: 'conditions' as const, label: 'Conditions', icon: Activity },
  { key: 'map' as const, label: 'Map', icon: MapIcon },
  { key: 'spots' as const, label: 'Spots', icon: ListChecks },
];

export default function App() {
  const store = useMemo(() => getLocationStore(), []);
  const [tab, setTab] = useState<Tab>('conditions');
  const [locations, setLocations] = useState<Location[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => store.subscribe(setLocations), [store]);

  return (
    <div className="min-h-full safe-top">
      <header className="sticky top-0 z-10 backdrop-blur bg-bg/80 border-b border-border safe-top">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold">Dad's Fishing Co-Pilot</h1>
            <p className="text-xs text-muted">
              {locations.length} location{locations.length === 1 ? '' : 's'}
              {tab === 'conditions' && ' · pull to refresh'}
            </p>
          </div>
          {tab === 'conditions' && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setRefreshKey((k) => k + 1)}
              aria-label="Refresh"
            >
              <RefreshCcw className="w-5 h-5" />
            </Button>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4 pb-24 flex flex-col gap-4">
        {tab === 'conditions' && (
          <>
            {locations.map((loc) => (
              <ConditionsCard
                key={`${loc.id}:${refreshKey}`}
                location={loc}
              />
            ))}
            {locations.length === 0 && (
              <div className="text-center text-muted py-12">
                No locations yet — head to Spots to add one.
              </div>
            )}
          </>
        )}

        {tab === 'map' && <MapView locations={locations} />}

        {tab === 'spots' && (
          <LocationsList locations={locations} store={store} />
        )}
      </main>

      <BottomNav tabs={TABS} current={tab} onChange={setTab} />
    </div>
  );
}
