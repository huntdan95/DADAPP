import { lazy, Suspense, useEffect, useState } from 'react';
import {
  Activity,
  Map as MapIcon,
  ListChecks,
  NotebookPen,
  RefreshCcw,
  LogOut,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BottomNav } from '@/components/ui/BottomNav';
import { ConditionsCard } from '@/features/conditions/ConditionsCard';
import { SignInScreen } from '@/features/auth/SignInScreen';
import { WelcomeBanner } from '@/features/onboarding/WelcomeBanner';
import { InstallPrompt } from '@/features/pwa/InstallPrompt';
import { UpdateAvailable } from '@/features/pwa/UpdateAvailable';
import { getLocationStore, type LocationStore } from '@/lib/store';
import type { Location } from '@/lib/providers/types';
import { useAuth } from '@/lib/useAuth';
import { signOutCurrent } from '@/lib/firebase';
import { seedLocations } from '@/seedLocations';

// Heavy features are lazy-loaded — Map drags in Leaflet (~150KB), Journal
// drags in Firebase Storage and image compression. Conditions tab is the
// landing tab and stays in the initial chunk so first paint is fast.
const MapView = lazy(() =>
  import('@/features/map/MapView').then((m) => ({ default: m.MapView }))
);
const LocationsList = lazy(() =>
  import('@/features/locations/LocationsList').then((m) => ({
    default: m.LocationsList,
  }))
);
const LogFeed = lazy(() =>
  import('@/features/log/LogFeed').then((m) => ({ default: m.LogFeed }))
);

type Tab = 'conditions' | 'map' | 'spots' | 'log';

const TABS = [
  { key: 'conditions' as const, label: 'Conditions', icon: Activity },
  { key: 'map' as const, label: 'Map', icon: MapIcon },
  { key: 'spots' as const, label: 'Spots', icon: ListChecks },
  { key: 'log' as const, label: 'Log', icon: NotebookPen },
];

function TabFallback() {
  return (
    <div className="flex items-center justify-center py-12 text-muted">
      <Loader2 className="w-5 h-5 animate-spin" />
    </div>
  );
}

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

  if (auth.kind === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted">
        Signing in…
      </div>
    );
  }

  if (auth.kind === 'signed-out') {
    return <SignInScreen />;
  }

  const isFirebaseConfigured = auth.kind === 'signed-in';

  return (
    <div className="flex flex-col h-[100dvh]">
      <header className="shrink-0 backdrop-blur bg-bg/80 border-b border-border safe-top">
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

      <main className="flex-1 overflow-y-auto w-full max-w-2xl mx-auto px-4 py-4 flex flex-col gap-4 min-h-0">
        {tab === 'conditions' && (
          <>
            {auth.kind === 'signed-in' && <WelcomeBanner />}
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

        {tab === 'map' && (
          <Suspense fallback={<TabFallback />}>
            {/* Map needs a flex parent so it can grow into the available space
                rather than overflowing the viewport. */}
            <div className="flex-1 flex flex-col min-h-0">
              <MapView locations={locations} />
            </div>
          </Suspense>
        )}

        {tab === 'spots' && store && (
          <Suspense fallback={<TabFallback />}>
            <LocationsList locations={locations} store={store} />
          </Suspense>
        )}

        {tab === 'log' && (
          <Suspense fallback={<TabFallback />}>
            <LogFeed
              locations={locations}
              isFirebaseConfigured={isFirebaseConfigured}
            />
          </Suspense>
        )}
      </main>

      <BottomNav tabs={TABS} current={tab} onChange={setTab} />

      <InstallPrompt />
      <UpdateAvailable />
    </div>
  );
}

// Note: BottomNav remains visually positioned at the bottom via its own
// styles, but the outer flex column now reserves space for it so content
// no longer disappears under the nav (the iOS safe-area home-indicator
// case in particular).
