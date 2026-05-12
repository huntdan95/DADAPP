import { lazy, Suspense, useEffect, useState } from 'react';
import {
  Activity,
  Cog,
  CloudOff,
  Map as MapIcon,
  ListChecks,
  NotebookPen,
  Boxes,
  RefreshCcw,
  LogOut,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BottomNav } from '@/components/ui/BottomNav';
import { ConditionsCard } from '@/features/conditions/ConditionsCard';
import { SpotPicker } from '@/features/conditions/SpotPicker';
import { SignInScreen } from '@/features/auth/SignInScreen';
import { WelcomeBanner } from '@/features/onboarding/WelcomeBanner';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { InstallPrompt } from '@/features/pwa/InstallPrompt';
import { UpdateAvailable } from '@/features/pwa/UpdateAvailable';
import { getLocationStore, type LocationStore } from '@/lib/store';
import { migrateLegacyLocationsIfNeeded } from '@/lib/store/legacyMigration';
import type { Location } from '@/lib/providers/types';
import { useAuth } from '@/lib/useAuth';
import { signOutCurrent } from '@/lib/firebase';
import { seedLocations } from '@/seedLocations';
import { prefetchConditionsForSpots } from '@/lib/prefetch';
import { prefetchStockingForStates } from '@/lib/stocking/store';
import { loadBoatLaunchesCached } from '@/lib/boatLaunches/store';
import { useOnline } from '@/lib/useOnline';
import { drainPhotoQueue, pendingPhotoCount } from '@/lib/log/photoQueue';

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
const LocationForm = lazy(() =>
  import('@/features/locations/LocationForm').then((m) => ({
    default: m.LocationForm,
  }))
);
const LogFeed = lazy(() =>
  import('@/features/log/LogFeed').then((m) => ({ default: m.LogFeed }))
);
const SystemHealth = lazy(() =>
  import('@/features/admin/SystemHealth').then((m) => ({ default: m.SystemHealth }))
);
const FlyBox = lazy(() =>
  import('@/features/flybox/FlyBox').then((m) => ({ default: m.FlyBox }))
);

type Tab = 'conditions' | 'map' | 'spots' | 'log' | 'flybox';

const TABS = [
  { key: 'conditions' as const, label: 'Conditions', icon: Activity },
  { key: 'map' as const, label: 'Map', icon: MapIcon },
  { key: 'spots' as const, label: 'Spots', icon: ListChecks },
  { key: 'flybox' as const, label: 'Flies', icon: Boxes },
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
  const online = useOnline();
  const [store, setStore] = useState<LocationStore | null>(null);
  const [tab, setTab] = useState<Tab>('conditions');
  const [locations, setLocations] = useState<Location[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const [addSpotOpen, setAddSpotOpen] = useState(false);
  const [healthOpen, setHealthOpen] = useState(false);

  // Only initialize the store once auth has resolved into a usable state.
  // Otherwise Firestore listeners fire while signed-out and 403.
  useEffect(() => {
    if (auth.kind === 'signed-in' || auth.kind === 'no-firebase') {
      setStore(getLocationStore());
    } else {
      setStore(null);
    }
  }, [auth.kind]);

  // First-load bootstrap. Order matters:
  //   1. Legacy migration — copy pre-per-user `locations/*` docs into
  //      the signed-in user's `users/{uid}/locations` subcollection.
  //      No-ops on subsequent loads (localStorage flag) and for
  //      brand-new users with no legacy data.
  //   2. Seed fallback — if AFTER the migration pass the user still
  //      has zero spots, drop in the curated seed list.
  // Tracking these as separate booleans so we don't seed on top of a
  // legitimate empty intermediate state during the migration.
  const [seeded, setSeeded] = useState(false);
  const [hasFirstSnapshot, setHasFirstSnapshot] = useState(false);
  const [migrationDone, setMigrationDone] = useState(false);

  useEffect(() => {
    if (!store) return;
    return store.subscribe((locs) => {
      setLocations(locs);
      setHasFirstSnapshot(true);
    });
  }, [store]);

  // Reset bootstrap flags whenever auth identity changes — a fresh
  // sign-in (or sign-out + different account) must redo the
  // migration / seed dance for the new uid.
  useEffect(() => {
    setSeeded(false);
    setMigrationDone(false);
    setHasFirstSnapshot(false);
  }, [auth.kind === 'signed-in' ? auth.user.uid : null]);

  // Step 1: legacy migration.
  useEffect(() => {
    if (auth.kind !== 'signed-in' || !store || migrationDone) return;
    let cancelled = false;
    migrateLegacyLocationsIfNeeded()
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setMigrationDone(true);
      });
    return () => {
      cancelled = true;
    };
  }, [auth.kind, store, migrationDone]);

  // Step 2: seed fallback. Only runs after migration has settled —
  // otherwise a momentary empty-snapshot during migration would
  // double-seed and the user would end up with both sets of docs.
  useEffect(() => {
    if (
      auth.kind === 'signed-in' &&
      store &&
      hasFirstSnapshot &&
      migrationDone &&
      !seeded &&
      locations.length === 0
    ) {
      setSeeded(true);
      Promise.all(seedLocations.map((l) => store.upsert(l))).catch(console.error);
    }
  }, [
    auth.kind,
    store,
    hasFirstSnapshot,
    migrationDone,
    seeded,
    locations.length,
  ]);

  // Silent background prefetch of conditions for every saved spot when
  // we're on a fast / Wi-Fi connection. Pre-warms the service-worker
  // cache so opening the Conditions tab feels instant.
  //
  // Also pre-warms the stocking-events cache for every state the user
  // has spots in AND the entire shared boat-launches dataset. Both
  // hit localStorage caches with stale-while-revalidate so the next
  // visit to any spot's banner / the map's launch layer is instant.
  useEffect(() => {
    if (locations.length === 0) return;
    // Don't block — fire all three in parallel.
    prefetchConditionsForSpots(locations).catch(() => undefined);

    const states = Array.from(
      new Set(
        locations
          .map((l) => l.state)
          .filter((s): s is string => !!s && s.length > 0)
      )
    );
    if (states.length > 0) {
      prefetchStockingForStates(states).catch(() => undefined);
    }

    // Trigger the boat-launch loader — uses its own SWR cache, so
    // this is effectively "wake up the cache" and noop on subsequent
    // renders.
    loadBoatLaunchesCached().catch(() => undefined);
  }, [locations]);

  // Drain the offline photo-upload queue whenever we're online — on
  // app startup AND on every transition from offline → online. The
  // function is cheap when the queue is empty.
  const [pendingPhotos, setPendingPhotos] = useState(0);
  useEffect(() => {
    if (auth.kind !== 'signed-in' || !online) return;
    let cancelled = false;
    (async () => {
      try {
        const summary = await drainPhotoQueue();
        if (cancelled) return;
        if (summary.processed > 0 || summary.failed > 0) {
          console.info('photo queue drained', summary);
        }
        const remaining = await pendingPhotoCount();
        if (!cancelled) setPendingPhotos(remaining);
      } catch (e) {
        console.warn('photo queue drain error', e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [auth.kind, online]);

  // Keep the Conditions-tab selection valid as the locations list changes.
  // First load picks the first spot; if the selected spot gets deleted we
  // fall back to the first available.
  useEffect(() => {
    if (locations.length === 0) {
      if (selectedSpotId !== null) setSelectedSpotId(null);
      return;
    }
    if (!selectedSpotId || !locations.some((l) => l.id === selectedSpotId)) {
      setSelectedSpotId(locations[0].id);
    }
  }, [locations, selectedSpotId]);

  const selectedLocation = locations.find((l) => l.id === selectedSpotId) ?? null;

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
            <h1 className="text-base font-semibold">Fishing Dad's Co-Pilot</h1>
            <p className="text-xs text-muted">
              {locations.length} location{locations.length === 1 ? '' : 's'}
              {auth.kind === 'signed-in' && auth.user.email && ` · ${auth.user.email}`}
              {auth.kind === 'no-firebase' && ' · local mode'}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {!online && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-warn/15 border border-warn/40 text-warn text-[10px] font-medium"
                title="No network — logs are saved locally and will sync when you're back online."
              >
                <CloudOff className="w-3 h-3" />
                Offline
              </span>
            )}
            {pendingPhotos > 0 && online && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-info/15 border border-info/40 text-info text-[10px] font-medium"
                title="Photos stashed offline are being uploaded in the background."
              >
                <Loader2 className="w-3 h-3 animate-spin" />
                {pendingPhotos} syncing
              </span>
            )}
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
                onClick={() => setHealthOpen(true)}
                aria-label="System health"
              >
                <Cog className="w-5 h-5" />
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
            <SpotPicker
              locations={locations}
              currentId={selectedSpotId}
              onPick={setSelectedSpotId}
              onAdd={() => setAddSpotOpen(true)}
            />
            {selectedLocation ? (
              <ConditionsCard
                key={`${selectedLocation.id}:${refreshKey}`}
                location={selectedLocation}
              />
            ) : locations.length === 0 ? (
              <div className="text-center text-muted py-12">
                No spots yet — tap{' '}
                <button
                  type="button"
                  className="underline text-accent"
                  onClick={() => setAddSpotOpen(true)}
                >
                  Add a spot
                </button>{' '}
                to get started.
              </div>
            ) : null}
          </>
        )}

        {tab === 'map' && (
          <Suspense fallback={<TabFallback />}>
            <MapView locations={locations} />
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

        {tab === 'flybox' && (
          <Suspense fallback={<TabFallback />}>
            <FlyBox locations={locations} />
          </Suspense>
        )}
      </main>

      <BottomNav tabs={TABS} current={tab} onChange={setTab} />

      <BottomSheet
        open={addSpotOpen}
        onClose={() => setAddSpotOpen(false)}
        title="Add a spot"
      >
        {addSpotOpen && store && (
          <Suspense fallback={<TabFallback />}>
            <LocationForm
              onCancel={() => setAddSpotOpen(false)}
              onSave={async (loc) => {
                await store.upsert(loc);
                setSelectedSpotId(loc.id);
                setAddSpotOpen(false);
              }}
            />
          </Suspense>
        )}
      </BottomSheet>

      <BottomSheet
        open={healthOpen}
        onClose={() => setHealthOpen(false)}
        title="System health"
      >
        {healthOpen && (
          <Suspense fallback={<TabFallback />}>
            <SystemHealth onClose={() => setHealthOpen(false)} />
          </Suspense>
        )}
      </BottomSheet>

      <InstallPrompt />
      <UpdateAvailable />
    </div>
  );
}

// Note: BottomNav remains visually positioned at the bottom via its own
// styles, but the outer flex column now reserves space for it so content
// no longer disappears under the nav (the iOS safe-area home-indicator
// case in particular).
