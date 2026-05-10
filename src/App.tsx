import { useEffect, useState } from 'react';
import {
  Activity,
  Map as MapIcon,
  ListChecks,
  NotebookPen,
  RefreshCcw,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BottomNav } from '@/components/ui/BottomNav';
import { ConditionsCard } from '@/features/conditions/ConditionsCard';
import { MapView } from '@/features/map/MapView';
import { LocationsList } from '@/features/locations/LocationsList';
import { Journal } from '@/features/journal/Journal';
import { SignInScreen } from '@/features/auth/SignInScreen';
import { getLocationStore, type LocationStore } from '@/lib/store';
import type { Location } from '@/lib/providers/types';
import { useAuth } from '@/lib/useAuth';
import { signOutCurrent } from '@/lib/firebase';
import { seedLocations } from '@/seedLocations';

type Tab = 'conditions' | 'map' | 'spots' | 'trips';

const TABS = [
  { key: 'conditions' as const, label: 'Conditions', icon: Activity },
  { key: 'map' as const, label: 'Map', icon: MapIcon },
  { key: 'spots' as const, label: 'Spots', icon: ListChecks },
  { key: 'trips' as const, label: 'Trips', icon: NotebookPen },
];

export default function App() {
  const auth = useAuth();
  const [store, setStore] = useState<LocationStore | null>(null);
  const [tab, setTab] = useState<Tab>('conditions');
  const [locations, setLocations] = useState<Location[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Only initialize the store once auth has resolved into a usable state.
  // Otherwise Firestore listeners fire while signed-out and 403.
  useEffect(() => {
    if (auth.kind === 'signed-in' || auth.kind === 'no-firebase') {
      setStore(getLocationStore());
    } else {
      setStore(null);
    }
  }, [auth.kind]);

  // First-load seed: when a freshly-signed-in account has zero locations,
  // populate Firestore with the four primary spots so dad doesn't start
  // staring at an empty list. Local-storage mode is already pre-seeded.
  const [seeded, setSeeded] = useState(false);
  const [hasFirstSnapshot, setHasFirstSnapshot] = useState(false);

  useEffect(() => {
    if (!store) return;
    return store.subscribe((locs) => {
      setLocations(locs);
      setHasFirstSnapshot(true);
    });
  }, [store]);

  useEffect(() => {
    if (
      auth.kind === 'signed-in' &&
      store &&
      hasFirstSnapshot &&
      !seeded &&
      locations.length === 0
    ) {
      setSeeded(true);
      Promise.all(seedLocations.map((l) => store.upsert(l))).catch(console.error);
    }
  }, [auth.kind, store, hasFirstSnapshot, seeded, locations.length]);

  // Pending auth state — Firebase is configured, just resolving the session.
  if (auth.kind === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted">
        Signing in…
      </div>
    );
  }

  // Firebase configured but signed out → sign-in screen.
  if (auth.kind === 'signed-out') {
    return <SignInScreen />;
  }

  // 'signed-in' (Firestore-backed) or 'no-firebase' (localStorage-backed) → app.
  const isFirebaseConfigured = auth.kind === 'signed-in';

  return (
    <div className="min-h-full safe-top">
      <header className="sticky top-0 z-10 backdrop-blur bg-bg/80 border-b border-border safe-top">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold">Dad's Fishing Co-Pilot</h1>
            <p className="text-xs text-muted">
              {locations.length} location{locations.length === 1 ? '' : 's'}
              {auth.kind === 'signed-in' && auth.user.email && ` · ${auth.user.email}`}
              {auth.kind === 'no-firebase' && ' · local mode'}
            </p>
          </div>
          <div className="flex items-center gap-1">
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
            {auth.kind === 'signed-in' && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => signOutCurrent()}
                aria-label="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            )}
          </div>
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

        {tab === 'spots' && store && (
          <LocationsList locations={locations} store={store} />
        )}

        {tab === 'trips' && (
          <Journal
            locations={locations}
            isFirebaseConfigured={isFirebaseConfigured}
          />
        )}
      </main>

      <BottomNav tabs={TABS} current={tab} onChange={setTab} />
    </div>
  );
}
