import { useEffect, useState } from 'react';
import { Loader2, Sparkles, RefreshCcw } from 'lucide-react';
import { collection, getDocs, getFirestore, limit as fsLimit, orderBy, query, where } from 'firebase/firestore';
import { CardSection } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { Location } from '@/lib/providers/types';
import { fetchWeather, fetchFlow, fetchDamSchedule } from '@/lib/providers';
import { activeHatchesForLocation } from '@/lib/hatches/store';
import type { Catch } from '@/lib/journal/types';
import type { LogEntry } from '@/lib/log/types';
import {
  fetchBriefing,
  invalidateBriefingCache,
  readCachedBriefing,
} from '@/lib/ai/briefing';
import { friendlyError } from '@/lib/errors';
import { getFirebaseApp, getFirebaseAuth } from '@/lib/firebase';
import {
  damScheduleKey,
  readDamSchedule,
  todayLocalDate,
} from '@/lib/damSchedule/store';
import {
  fetchRecentStockingNearLocation,
  filterStockingForLocation,
} from '@/lib/stocking/store';

/**
 * "Get briefing" button → calls the Claude-powered briefing Cloud Function
 * with snapshots of weather, flow, dam, hatches, and the user's last 5
 * catches at this spot. Cached daily server-side (~0.1× cost on repeats).
 */
export function BriefingSection({ location }: { location: Location }) {
  const [briefing, setBriefing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);

  // On location switch / mount, surface the cached briefing if we have one
  // so the user sees it instantly without paying for another AI call.
  useEffect(() => {
    const cached = readCachedBriefing(location);
    setBriefing(cached);
    setFromCache(Boolean(cached));
    setError(null);
  }, [location]);

  async function generate(opts: { force?: boolean } = {}) {
    setLoading(true);
    setError(null);
    try {
      if (opts.force) invalidateBriefingCache(location);
      const [weather, flow, damSchedule] = await Promise.all([
        fetchWeather(location.dataProviders.weather, location),
        location.dataProviders.flow
          ? fetchFlow(location.dataProviders.flow).catch(() => undefined)
          : Promise.resolve(undefined),
        location.dataProviders.damSchedule
          ? fetchDamSchedule(location.dataProviders.damSchedule, location).catch(
              () => undefined
            )
          : Promise.resolve(undefined),
      ]);

      const damDoc = location.dataProviders.damSchedule
        ? await readDamSchedule(
            damScheduleKey(
              location.dataProviders.damSchedule,
              todayLocalDate(location.timezone)
            )
          ).catch(() => null)
        : null;

      const hour = currentHourIn(location.timezone);
      const currentUnits = damDoc?.hourlyUnits[hour];
      const damCurrentStatus =
        currentUnits == null
          ? 'unknown'
          : currentUnits === 0
          ? 'no_generation'
          : currentUnits === 1
          ? 'partial'
          : 'heavy';

      const hatches = activeHatchesForLocation(
        location,
        flow?.waterTempF ?? null
      );

      const recentCatches = await fetchRecentCatches(location.id);

      // Recent stocking events within ~25 mi — fed into the briefing
      // context so Claude leads with them when fresh.
      const stockings = await fetchRecentStockingNearLocation(location, 30).catch(
        () => []
      );
      const relevantStockings = filterStockingForLocation(stockings, location, 25);

      const res = await fetchBriefing({
        location,
        weather,
        flow: flow ?? undefined,
        damSchedule: damSchedule ?? undefined,
        damCurrentStatus,
        damNextChange: null,
        activeHatches: hatches,
        recentCatches,
        recentStockings: relevantStockings.map((s) => ({
          date: s.date,
          species: s.species,
          count: s.count,
          size: s.size,
          locationName: s.locationName,
        })),
        force: opts.force,
      });
      setBriefing(res.briefing);
      setFromCache(false);
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <CardSection label="How's the bite?">
      {briefing ? (
        <div className="rounded-xl bg-accent/5 border border-accent/30 p-3">
          <div className="text-sm whitespace-pre-wrap">{briefing}</div>
          <div className="flex items-center gap-3 mt-2">
            <button
              type="button"
              onClick={() => generate({ force: true })}
              disabled={loading}
              className="inline-flex items-center gap-1 text-xs text-muted hover:text-text underline"
            >
              {loading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <RefreshCcw className="w-3 h-3" />
              )}
              {loading ? 'Asking…' : 'Refresh'}
            </button>
            {fromCache && (
              <span className="text-[10px] text-muted">
                Today's briefing (cached)
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button onClick={() => generate()} disabled={loading} size="sm">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Thinking…
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                How's the bite?
              </>
            )}
          </Button>
          <span className="text-xs text-muted">
            Pulls weather + recent local angler reports
          </span>
        </div>
      )}
      {error && (
        <div className="text-xs text-danger mt-1">{error}</div>
      )}
    </CardSection>
  );
}

function currentHourIn(timezone: string): number {
  const part = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    hourCycle: 'h23',
    timeZone: timezone,
  }).format(new Date());
  return parseInt(part, 10);
}

async function fetchRecentCatches(locationId: string): Promise<Catch[]> {
  const app = getFirebaseApp();
  const auth = getFirebaseAuth();
  if (!app || !auth?.currentUser) return [];
  const db = getFirestore(app);
  // New schema: users/{uid}/logs, kind === 'catch', filtered to this location.
  const q = query(
    collection(db, 'users', auth.currentUser.uid, 'logs'),
    where('kind', '==', 'catch'),
    where('locationId', '==', locationId),
    orderBy('time', 'desc'),
    fsLimit(5)
  );
  try {
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const e = d.data() as LogEntry;
      // Shape into the legacy Catch interface the briefing API expects.
      return {
        id: e.id,
        tripId: '',
        userId: e.userId,
        locationId: e.locationId ?? '',
        species: e.species ?? 'unknown',
        lengthInches: e.lengthInches,
        method: e.method ?? 'other',
        flyOrLure: e.flyOrLure ?? '',
        trollingDepthFt: e.trollingDepthFt,
        trollingSpeedMph: e.trollingSpeedMph,
        releasedOrKept: e.releasedOrKept ?? 'released',
        time: e.time,
        notes: e.notes,
        photoUrl: e.photoUrl,
        conditions: e.conditions,
      } as Catch;
    });
  } catch {
    return [];
  }
}
