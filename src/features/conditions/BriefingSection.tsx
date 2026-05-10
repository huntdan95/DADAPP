import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { collection, getDocs, getFirestore, limit as fsLimit, orderBy, query, where, collectionGroup } from 'firebase/firestore';
import { CardSection } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { Location } from '@/lib/providers/types';
import { fetchWeather, fetchFlow, fetchDamSchedule } from '@/lib/providers';
import { activeHatchesForLocation } from '@/lib/hatches/store';
import type { Catch } from '@/lib/journal/types';
import { fetchBriefing } from '@/lib/ai/briefing';
import { getFirebaseApp, getFirebaseAuth } from '@/lib/firebase';
import {
  damScheduleKey,
  readDamSchedule,
  todayLocalDate,
} from '@/lib/damSchedule/store';

/**
 * "Get briefing" button → calls the Claude-powered briefing Cloud Function
 * with snapshots of weather, flow, dam, hatches, and the user's last 5
 * catches at this spot. Cached daily server-side (~0.1× cost on repeats).
 */
export function BriefingSection({ location }: { location: Location }) {
  const [briefing, setBriefing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
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

      const res = await fetchBriefing({
        location,
        weather,
        flow: flow ?? undefined,
        damSchedule: damSchedule ?? undefined,
        damCurrentStatus,
        damNextChange: null,
        activeHatches: hatches,
        recentCatches,
      });
      setBriefing(res.briefing);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <CardSection label="Briefing">
      {briefing ? (
        <div className="rounded-xl bg-accent/5 border border-accent/30 p-3">
          <div className="text-sm whitespace-pre-wrap">{briefing}</div>
          <button
            type="button"
            onClick={generate}
            disabled={loading}
            className="text-xs text-muted hover:text-text mt-2 underline"
          >
            Regenerate
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button onClick={generate} disabled={loading} size="sm">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Thinking…
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Get briefing
              </>
            )}
          </Button>
          <span className="text-xs text-muted">
            3-sentence pre-trip read from Claude
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
  // Per-user scope: users/{uid}/trips/*/catches matched via the userId stamp.
  const q = query(
    collectionGroup(db, 'catches'),
    where('userId', '==', auth.currentUser.uid),
    where('locationId', '==', locationId),
    orderBy('time', 'desc'),
    fsLimit(5)
  );
  try {
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Catch);
  } catch {
    // Index might not exist yet — silent fallback.
    return [];
  }
}

// Suppress unused warning for `collection` import (kept for future use).
void collection;
