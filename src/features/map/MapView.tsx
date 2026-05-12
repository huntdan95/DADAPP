import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  ZoomControl,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Anchor, Info, Loader2, Plus } from 'lucide-react';
import { BASEMAPS, type BasemapKey } from './basemaps';
import { MapMarker } from './MapMarker';
import { BoatLaunchLayer } from './BoatLaunchLayer';
import { BoatLaunchSheet } from './BoatLaunchSheet';
import { AddLaunchForm } from './AddLaunchForm';
import { MapSearch } from './MapSearch';
import type { Location } from '@/lib/providers/types';
import { ConditionsCard } from '@/features/conditions/ConditionsCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { getLocationStore } from '@/lib/store';

const LocationForm = lazy(() =>
  import('@/features/locations/LocationForm').then((m) => ({ default: m.LocationForm }))
);
import { BottomSheet } from '@/components/ui/BottomSheet';
import {
  type BoatLaunch,
  callSeedBoatLaunches,
  loadBoatLaunchesCached,
} from '@/lib/boatLaunches/store';
import { watchUserLaunches } from '@/lib/boatLaunches/userLaunches';
import { cn } from '@/lib/utils';
import { friendlyError } from '@/lib/errors';

export function MapView({
  locations,
  focus,
}: {
  locations: Location[];
  /**
   * Versioned focus token from the parent. When `key` changes the map
   * pans to the matching location and opens its conditions card. The
   * `key` mechanism lets the parent re-trigger the focus even if the
   * same spot id is re-saved at the same coordinates.
   */
  focus?: { id: string; key: number } | null;
}) {
  const [basemap, setBasemap] = useState<BasemapKey>('osm');
  const [selected, setSelected] = useState<Location | null>(null);
  const [showLaunches, setShowLaunches] = useState(true);
  const [launches, setLaunches] = useState<BoatLaunch[]>([]);
  /** User-added launches subscribed live from Firestore. */
  const [userLaunches, setUserLaunches] = useState<BoatLaunch[]>([]);
  const [addLaunchOpen, setAddLaunchOpen] = useState(false);
  const [launchesLoaded, setLaunchesLoaded] = useState(false);
  /** Set when the user taps "Save as fishing spot" on a launch sheet. */
  const [seedFromLaunch, setSeedFromLaunch] = useState<Partial<Location> | null>(null);
  /** Most recent per-state scrape results, surfaced in the legend after refresh. */
  const [seedSummary, setSeedSummary] = useState<string | null>(null);
  /** Live progress while a refresh is in flight: chunk index / total + ETA. */
  const [seedProgress, setSeedProgress] = useState<{
    pct: number;
    chunkIndex: number;
    totalChunks: number;
    etaSeconds: number | null;
  } | null>(null);
  const [recenterTo, setRecenterTo] = useState<
    { lat: number; lng: number; zoom: number } | null
  >(null);
  /**
   * Bounds-based recenter (search results that have a bbox — lakes,
   * rivers, towns). The map fits the whole extent rather than zooming
   * to a single point. Versioned via a key so re-picking the same
   * result still moves the map.
   */
  const [fitBoundsTarget, setFitBoundsTarget] = useState<{
    south: number;
    north: number;
    west: number;
    east: number;
    key: number;
  } | null>(null);
  /**
   * Temporary "you searched for this" pin. Cleared via the X button
   * on its popup. Distinct from spot markers and launch markers.
   */
  const [searchPin, setSearchPin] = useState<{
    lat: number;
    lng: number;
    label: string;
  } | null>(null);
  const [selectedLaunch, setSelectedLaunch] = useState<BoatLaunch | null>(null);
  /** Device geolocation — captured on mount, displayed as a blue dot. */
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [legendOpen, setLegendOpen] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedError, setSeedError] = useState<string | null>(null);

  /**
   * Parent-driven focus: when the App.tsx layer hands us a new
   * focus token (spot id + version key), pan the camera to that
   * spot and pop its conditions card open. We watch `focus.key`
   * specifically so re-saving the same spot still triggers the
   * camera move. The location may not be in our `locations` array
   * yet (Firestore round-trip), so we also re-check whenever
   * `locations` grows and there's still a pending focus.
   */
  useEffect(() => {
    if (!focus) return;
    const loc = locations.find((l) => l.id === focus.id);
    if (!loc) return;
    setRecenterTo({ lat: loc.lat, lng: loc.lng, zoom: 14 });
    setSelected(loc);
    // No need to clear `focus` from this side — the parent owns
    // it. New focus events arrive as a new `key`, which makes
    // this effect re-fire even if the id is the same.
  }, [focus, locations]);

  // Try to fix our position on mount so we can show "you are here" without
  // requiring the user to tap anything. If permission is denied we just
  // skip — they can still drive the map manually.
  useEffect(() => {
    if (!('geolocation' in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => undefined,
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 5 * 60_000 }
    );
  }, []);

  // Stale-while-revalidate load. localStorage cache fires synchronously
  // (or near-so) on second+ visits, and the background revalidation only
  // refetches when the server-side seed has been updated.
  const reloadLaunches = useCallback(async () => {
    try {
      const list = await loadBoatLaunchesCached((fresh) => {
        // Fresh data arrived from the background revalidation pass.
        setLaunches(fresh);
      });
      setLaunches(list);
      setLaunchesLoaded(true);
      return list.length;
    } catch {
      setLaunchesLoaded(true);
      return 0;
    }
  }, []);

  useEffect(() => {
    if (launchesLoaded) return;
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await reloadLaunches();
    })();
    return () => {
      cancelled = true;
    };
  }, [launchesLoaded, reloadLaunches]);

  // Subscribe to user-added launches. Empty list if signed out.
  useEffect(() => {
    return watchUserLaunches(setUserLaunches);
  }, []);

  /** Combined list used by the map layer + find-nearest. */
  const allLaunches = useMemo(
    () => [...launches, ...userLaunches],
    [launches, userLaunches]
  );

  /**
   * One-tap "load boat launches" for the empty-state. The scrape is
   * chunked client-side — we fire the callable 4 times in sequence,
   * each handling ~5 states. Per-chunk progress flows into the
   * legend's status line so the user sees what's happening instead
   * of staring at a spinner.
   */
  async function loadLaunches() {
    setSeeding(true);
    setSeedError(null);
    setSeedSummary(null);
    // Indeterminate at first; flips to determinate after chunk 1 lands.
    setSeedProgress({ pct: 0, chunkIndex: 0, totalChunks: 0, etaSeconds: null });
    const startMs = Date.now();
    try {
      const res = await callSeedBoatLaunches((p) => {
        const pct = (p.chunkIndex / p.totalChunks) * 100;
        // ETA: average chunk time so far × remaining chunks.
        const elapsedMs = Date.now() - startMs;
        const avgChunkMs = elapsedMs / p.chunkIndex;
        const remainingMs = avgChunkMs * (p.totalChunks - p.chunkIndex);
        setSeedProgress({
          pct,
          chunkIndex: p.chunkIndex,
          totalChunks: p.totalChunks,
          etaSeconds: Math.max(0, Math.round(remainingMs / 1000)),
        });
        const so_far = p.cumulativeResults
          .map((r) =>
            r.count < 0
              ? `${r.state} failed`
              : `${r.state} ${formatCount(r.count)}`
          )
          .join(' · ');
        setSeedSummary(so_far);
        // Pull fresh data from Firestore between chunks so the map
        // markers populate progressively rather than all-or-nothing.
        reloadLaunches().catch(() => undefined);
      });
      const summary = res.results
        .map((r) =>
          r.count < 0
            ? `${r.state} failed`
            : `${r.state} ${formatCount(r.count)}`
        )
        .join(' · ');
      setSeedSummary(summary);
      await reloadLaunches();
    } catch (e) {
      setSeedError(friendlyError(e));
    } finally {
      setSeeding(false);
      setSeedProgress(null);
    }
  }

  const center = useMemo<[number, number]>(() => {
    if (locations.length === 0) return [39.5, -85.0];
    const lat = locations.reduce((s, l) => s + l.lat, 0) / locations.length;
    const lng = locations.reduce((s, l) => s + l.lng, 0) / locations.length;
    return [lat, lng];
  }, [locations]);

  const bm = BASEMAPS[basemap];

  // No active "find nearest" flow anymore — `highlightedIds` was the
  // hook that flashed the top-5 closest launches in a different color.
  // Keep the prop on `BoatLaunchLayer` but always pass an empty set so
  // we don't have to touch the layer's API just to clean up here.
  const highlightedIds = useMemo(() => new Set<string>(), []);

  return (
    // Explicit height instead of relying on flex-1 chain. Subtracts a
    // generous buffer for: header (~57px) + bottom nav (~60px) + iOS
    // home-indicator safe-area (~34px) + main vertical padding (~32px).
    <div className="relative w-full h-[calc(100dvh-12rem-env(safe-area-inset-bottom))] min-h-[260px] rounded-2xl overflow-hidden border border-border">
      <MapContainer
        center={center}
        zoom={5}
        scrollWheelZoom
        // Default zoom +/- buttons live top-left, where our Launches and
        // Find-nearest pills sit. Disable the default and re-add to the
        // bottom-right so the pills are no longer covered.
        zoomControl={false}
        className="h-full w-full bg-surface"
      >
        <ZoomControl position="bottomright" />
        <TileLayer
          key={bm.key}
          url={bm.url}
          attribution={bm.attribution}
          maxZoom={bm.maxZoom}
        />
        <FitToLocations locations={locations} />
        <RecenterOn target={recenterTo} />
        <FitBoundsOn target={fitBoundsTarget} />

        {locations.map((loc) => (
          <MapMarker key={loc.id} location={loc} onClick={(l) => setSelected(l)} />
        ))}

        <BoatLaunchLayer
          launches={allLaunches}
          visible={showLaunches}
          highlightedIds={highlightedIds}
          onLaunchClick={setSelectedLaunch}
        />

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={youIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {searchPin && (
          <Marker
            position={[searchPin.lat, searchPin.lng]}
            icon={searchPinIcon}
          >
            <Popup>
              <div className="flex items-center gap-2">
                <span>{searchPin.label}</span>
                <button
                  type="button"
                  onClick={() => setSearchPin(null)}
                  className="text-xs text-muted hover:text-text underline"
                >
                  clear
                </button>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      <BasemapSwitcher current={basemap} onChange={setBasemap} />

      <MapLegend
        open={legendOpen}
        onToggle={() => setLegendOpen((v) => !v)}
        launchesLoaded={launchesLoaded}
        launchCount={allLaunches.length}
        onRefresh={loadLaunches}
        refreshing={seeding}
        refreshError={seedError}
        refreshSummary={seedSummary}
        refreshProgress={seedProgress}
      />

      {/* Top-left stack — order matters:
            1. Search bar (replaces the old top button slot)
            2. Launches toggle (slid down to where Find-nearest sat)
            3. Add launch (unchanged at the bottom)
          Old "Find nearest" pill removed — the search bar covers the
          same "I want to go somewhere" intent more flexibly, and the
          map's blue You-Are-Here dot still anchors location context. */}
      <div className="absolute top-2 left-2 z-[1000] flex flex-col gap-2 items-start">
        <MapSearch
          onPick={(r) => {
            if (r.bbox) {
              setFitBoundsTarget({
                south: r.bbox[0],
                north: r.bbox[1],
                west: r.bbox[2],
                east: r.bbox[3],
                key: Date.now(),
              });
            } else {
              setRecenterTo({ lat: r.lat, lng: r.lng, zoom: 13 });
            }
            setSearchPin({
              lat: r.lat,
              lng: r.lng,
              label: r.display.split(',').slice(0, 2).join(',').trim(),
            });
          }}
        />
        <button
          type="button"
          onClick={() => setShowLaunches((v) => !v)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border shadow backdrop-blur',
            showLaunches
              ? 'bg-info/15 border-info/40 text-info'
              : 'bg-surface/90 border-border text-muted'
          )}
        >
          <Anchor className="w-3.5 h-3.5" />
          Launches
          {launchesLoaded && allLaunches.length > 0 ? ` (${allLaunches.length})` : ''}
        </button>
        <button
          type="button"
          onClick={() => setAddLaunchOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border bg-surface/90 border-border text-accent shadow backdrop-blur"
        >
          <Plus className="w-3.5 h-3.5" />
          Add launch
        </button>
      </div>

      {launchesLoaded && launches.length === 0 && (
        <div className="absolute bottom-2 left-2 right-2 z-[1000] max-w-md mx-auto bg-surface/95 backdrop-blur border border-info/40 rounded-xl p-3 shadow-lg">
          <div className="text-sm font-semibold text-info">
            Boat launches not loaded yet
          </div>
          <div className="text-xs text-muted mt-0.5 mb-2">
            One-time setup pulls launches across 17 states (MI, TN, KY,
            IN, NC, FL, GA, AL, MS, AR, OK, IL, PA, MT, ID, UT, CO) from
            OpenStreetMap. Takes ~10 minutes — chunked so we don't get
            rate-limited.
          </div>
          <button
            type="button"
            onClick={loadLaunches}
            disabled={seeding}
            className="inline-flex items-center gap-2 px-3 h-9 rounded-xl bg-accent text-bg font-medium disabled:opacity-50"
          >
            {seeding ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading launches…
              </>
            ) : (
              <>
                <Anchor className="w-4 h-4" />
                Load boat launches
              </>
            )}
          </button>
          {seedError && (
            <div className="text-xs text-danger mt-2">{seedError}</div>
          )}
        </div>
      )}

      <BottomSheet
        open={selected != null}
        onClose={() => setSelected(null)}
        title={selected?.name}
      >
        {selected && <ConditionsCard location={selected} />}
      </BottomSheet>

      <BoatLaunchSheet
        launch={selectedLaunch}
        userLocation={userLocation}
        onClose={() => setSelectedLaunch(null)}
        onSaveAsSpot={(launch) => {
          // Close the launch sheet, open the add-spot sheet seeded
          // with the launch's name + coords. Auto-detect picks up the
          // state / county / timezone / providers from the pin.
          setSelectedLaunch(null);
          setSeedFromLaunch({
            name: launch.name,
            lat: launch.lat,
            lng: launch.lng,
            state: launch.state,
          });
        }}
      />

      <BottomSheet
        open={addLaunchOpen}
        onClose={() => setAddLaunchOpen(false)}
        title="Add a launch"
      >
        {addLaunchOpen && (
          <AddLaunchForm
            initialCenter={userLocation ?? undefined}
            onCancel={() => setAddLaunchOpen(false)}
            onSaved={() => setAddLaunchOpen(false)}
          />
        )}
      </BottomSheet>

      <BottomSheet
        open={seedFromLaunch != null}
        onClose={() => setSeedFromLaunch(null)}
        title="Add a spot"
      >
        {seedFromLaunch && (
          <Suspense fallback={<div className="text-muted text-sm p-2">Loading…</div>}>
            <LocationForm
              initial={seedFromLaunch}
              onCancel={() => setSeedFromLaunch(null)}
              onSave={async (loc) => {
                await getLocationStore().upsert(loc);
                setSeedFromLaunch(null);
                // Already on the map view — pan to the new pin and
                // pop its conditions card locally. No need to bounce
                // through App.tsx's focus token.
                setRecenterTo({ lat: loc.lat, lng: loc.lng, zoom: 14 });
                setSelected(loc);
              }}
            />
          </Suspense>
        )}
      </BottomSheet>

    </div>
  );
}

function FitToLocations({ locations }: { locations: Location[] }) {
  const map = useMap();
  useMemo(() => {
    if (locations.length === 0) return;
    if (locations.length === 1) {
      map.setView([locations[0].lat, locations[0].lng], 11);
      return;
    }
    const bounds = locations.map((l) => [l.lat, l.lng] as [number, number]);
    map.fitBounds(bounds, { padding: [40, 40] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations, map]);
  return null;
}

function RecenterOn({
  target,
}: {
  target: { lat: number; lng: number; zoom: number } | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (target) map.setView([target.lat, target.lng], target.zoom);
  }, [target, map]);
  return null;
}

/**
 * Fit-bounds wrapper for search results that span a region (a lake or
 * a river). The `key` field forces a re-fit when the user picks the
 * same result twice (same coords, but they want the map to snap back).
 */
function FitBoundsOn({
  target,
}: {
  target: {
    south: number;
    north: number;
    west: number;
    east: number;
    key: number;
  } | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (!target) return;
    map.fitBounds(
      [
        [target.south, target.west],
        [target.north, target.east],
      ],
      { padding: [40, 40], maxZoom: 14 }
    );
  }, [target, map]);
  return null;
}

/**
 * Collapsible "what do these markers mean?" pill. Closed state is a small
 * "i" button so it doesn't compete with the basemap switcher; open state
 * lists the marker types in plain English.
 */
function MapLegend({
  open,
  onToggle,
  launchesLoaded,
  launchCount,
  onRefresh,
  refreshing,
  refreshError,
  refreshSummary,
  refreshProgress,
}: {
  open: boolean;
  onToggle: () => void;
  launchesLoaded: boolean;
  launchCount: number;
  onRefresh: () => void;
  refreshing: boolean;
  refreshError: string | null;
  refreshSummary: string | null;
  refreshProgress: {
    pct: number;
    chunkIndex: number;
    totalChunks: number;
    etaSeconds: number | null;
  } | null;
}) {
  return (
    <div className="absolute top-12 right-2 z-[1000]">
      {open ? (
        <div className="bg-surface/95 backdrop-blur border border-border rounded-xl p-3 shadow w-64 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted uppercase tracking-wider text-[10px]">
              Legend
            </span>
            <button
              type="button"
              onClick={onToggle}
              className="text-muted hover:text-text"
            >
              ×
            </button>
          </div>
          <ul className="flex flex-col gap-1.5">
            <LegendRow color="#4ade80" label="Spot — bite likely good" />
            <LegendRow color="#fbbf24" label="Spot — mixed signals" />
            <LegendRow color="#ef4444" label="Spot — likely tough" />
            <LegendRow color="#7a857a" label="Spot — no data yet" />
            <li className="text-[10px] text-muted uppercase tracking-wider pt-1">
              Launches
            </li>
            <LaunchLegendRow color="#60a5fa" label="Boat ramp" />
            <LaunchLegendRow color="#2dd4bf" label="Canoe / kayak put-in" />
            <LaunchLegendRow color="#22d3ee" label="Pier" />
            <LaunchLegendRow color="#818cf8" label="Marina" />
            <LaunchLegendRow color="#9ca3af" label="Former / disused" />
            <LaunchLegendRow color="#4ade80" label="Added by you" />
            <li className="flex items-center gap-2 pt-1">
              <span className="inline-block w-3 h-3 rounded-full bg-[#3b82f6] border-2 border-white" />
              You are here
            </li>
          </ul>
          <div className="border-t border-border mt-3 pt-2.5 flex flex-col gap-1.5">
            {!refreshing && (
              <button
                type="button"
                onClick={onRefresh}
                className="text-[11px] text-info hover:text-accent transition inline-flex items-center gap-1.5 text-left"
              >
                Refresh launches from sources
              </button>
            )}
            {refreshing && refreshProgress && (
              <ProgressBar
                value={
                  refreshProgress.totalChunks > 0
                    ? refreshProgress.pct
                    : undefined
                }
                status={
                  refreshProgress.totalChunks > 0
                    ? `Chunk ${refreshProgress.chunkIndex}/${refreshProgress.totalChunks}`
                    : 'Starting…'
                }
                eta={formatEta(refreshProgress.etaSeconds)}
                variant="info"
              />
            )}
            {launchesLoaded && !refreshing && (
              <div className="text-[10px] text-muted/80">
                {launchCount.toLocaleString()} launches loaded
              </div>
            )}
            {refreshSummary && (
              <div className="text-[10px] text-muted/80 leading-relaxed">
                {refreshing ? 'In progress: ' : 'Last run: '}
                {refreshSummary}
              </div>
            )}
            {refreshError && (
              <div className="text-[10px] text-danger">{refreshError}</div>
            )}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={onToggle}
          aria-label="Show legend"
          className="bg-surface/95 backdrop-blur border border-border rounded-xl p-2 shadow"
        >
          <Info className="w-4 h-4 text-muted" />
        </button>
      )}
    </div>
  );
}

function LegendRow({ color, label }: { color: string; label: string }) {
  return (
    <li className="flex items-center gap-2">
      <span
        className="inline-block w-3 h-3 rounded-sm"
        style={{ backgroundColor: color }}
      />
      {label}
    </li>
  );
}

function LaunchLegendRow({ color, label }: { color: string; label: string }) {
  return (
    <li className="flex items-center gap-2">
      <span className="inline-block w-3 h-3 relative">
        <svg viewBox="0 0 14 14" className="w-full h-full">
          <polygon
            points="7,2 13,12 1,12"
            fill={color}
            stroke="#0a0e0a"
            strokeWidth="1.5"
          />
        </svg>
      </span>
      {label}
    </li>
  );
}

function BasemapSwitcher({
  current,
  onChange,
}: {
  current: BasemapKey;
  onChange: (k: BasemapKey) => void;
}) {
  return (
    <div className="absolute top-2 right-2 z-[1000] bg-surface/95 backdrop-blur border border-border rounded-xl p-1 flex gap-1 shadow">
      {Object.values(BASEMAPS).map((b) => (
        <button
          key={b.key}
          type="button"
          onClick={() => onChange(b.key)}
          className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-medium transition',
            current === b.key
              ? 'bg-accent text-bg'
              : 'text-text hover:bg-surface-2'
          )}
        >
          {b.label}
        </button>
      ))}
    </div>
  );
}

/** Short count format for the per-state seed summary chip. */
function formatCount(n: number): string {
  if (n >= 10000) return `${(n / 1000).toFixed(0)}k`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

/** "~3 min left" style helper for the progress-bar ETA. Null → empty. */
function formatEta(seconds: number | null): string | undefined {
  if (seconds == null || !Number.isFinite(seconds)) return undefined;
  if (seconds < 60) return `~${seconds}s left`;
  const mins = Math.round(seconds / 60);
  return `~${mins} min left`;
}

const youIcon = L.divIcon({
  html: `<div style="position:relative;width:18px;height:18px">
    <div style="position:absolute;inset:0;border-radius:50%;background:#3b82f6;border:3px solid #fff;box-shadow:0 0 0 2px #3b82f6"></div>
  </div>`,
  className: '',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

/**
 * Temporary "I searched for this" pin. Yellow/amber so it's visually
 * distinct from spot markers (green/yellow/red status colors) and
 * boat launch markers (blue/teal). Animated subtle bounce on insert
 * via CSS keyframes so the user sees where the map jumped to.
 */
const searchPinIcon = L.divIcon({
  html: `<div style="position:relative;width:22px;height:28px;transform:translateY(-14px)">
    <svg viewBox="0 0 22 28" width="22" height="28" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 1 C5 1 1 5 1 10 C1 16 11 27 11 27 C11 27 21 16 21 10 C21 5 17 1 11 1 Z"
            fill="#fbbf24" stroke="#0a0e0a" stroke-width="1.5"/>
      <circle cx="11" cy="10" r="3" fill="#0a0e0a"/>
    </svg>
  </div>`,
  className: '',
  iconSize: [22, 28],
  iconAnchor: [11, 28],
});
