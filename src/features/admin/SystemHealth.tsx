import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  getFirestore,
  Timestamp,
} from 'firebase/firestore';
import {
  AlertCircle,
  CheckCircle2,
  Database,
  Fish,
  Image as ImageIcon,
  Loader2,
  RefreshCcw,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardSubtitle, CardTitle } from '@/components/ui/Card';
import { getFirebaseApp, getFirebaseAuth } from '@/lib/firebase';
import { pendingPhotoCount } from '@/lib/log/photoQueue';
import { triggerStockingScrape } from '@/lib/stocking/trigger';
import { callSeedBoatLaunches } from '@/lib/boatLaunches/store';
import { Button } from '@/components/ui/Button';
import { friendlyError } from '@/lib/errors';

/**
 * Admin-style system-health dashboard. Reads the system signals that
 * are most likely to be stale or broken and shows them in one place:
 *
 *   - per-state boat-launch sets: count + last-fetched timestamp
 *   - per-source stocking events: count + most-recent date
 *   - AI usage today: per-feature call counts (briefing / parseJournal
 *     / patterns / identifySpecies)
 *   - pending photo-upload queue size
 *
 * Plus two manual-trigger buttons for the long-running scrapers so
 * the user can refresh without digging through tabs.
 *
 * This is a per-user view — it reads from public collections that
 * any signed-in user can read. Not a security-sensitive admin page;
 * the data is collaborative and visible to the whole group.
 */
export function SystemHealth({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [launchSets, setLaunchSets] = useState<LaunchSetSummary[]>([]);
  const [stockingByState, setStockingByState] = useState<StockingSummary[]>([]);
  const [aiToday, setAiToday] = useState<AiUsageSummary | null>(null);
  const [photoQueue, setPhotoQueue] = useState<number>(0);

  const [scrapingStocking, setScrapingStocking] = useState(false);
  const [seedingLaunches, setSeedingLaunches] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [ls, st, ai, queue] = await Promise.all([
        loadLaunchSets(),
        loadStockingSummary(),
        loadAiUsageToday(),
        pendingPhotoCount().catch(() => 0),
      ]);
      setLaunchSets(ls);
      setStockingByState(st);
      setAiToday(ai);
      setPhotoQueue(queue);
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refreshStocking() {
    setScrapingStocking(true);
    try {
      await triggerStockingScrape();
      await load();
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setScrapingStocking(false);
    }
  }

  async function refreshLaunches() {
    setSeedingLaunches(true);
    try {
      await callSeedBoatLaunches();
      await load();
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setSeedingLaunches(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs text-muted">
        Behind-the-scenes view of where the app's getting its data and
        what's stale. Tap a refresh button if a row looks off.
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-4 h-4 text-info" />
            Boat launches
          </CardTitle>
          <CardSubtitle>Per-state set counts and freshness</CardSubtitle>
        </CardHeader>
        <div className="px-4 pb-4">
          {loading ? (
            <div className="flex items-center gap-2 text-xs text-muted">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading…
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {launchSets.map((row) => (
                <div
                  key={row.state}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="font-mono text-xs w-8 text-muted">
                    {row.state}
                  </div>
                  <div className="flex-1 num">
                    {row.count.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-muted">
                    {formatAge(row.fetchedAtMs)}
                  </div>
                </div>
              ))}
              {launchSets.length === 0 && (
                <div className="text-xs text-muted">
                  No launches loaded yet — tap Refresh below to scrape.
                </div>
              )}
            </div>
          )}
          <div className="mt-3">
            <Button
              size="sm"
              variant="secondary"
              onClick={refreshLaunches}
              disabled={seedingLaunches}
            >
              {seedingLaunches ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCcw className="w-3.5 h-3.5" />
              )}
              {seedingLaunches ? 'Scraping (~2 min)…' : 'Refresh boat launches'}
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fish className="w-4 h-4 text-accent" />
            Stocking events
          </CardTitle>
          <CardSubtitle>By state, last 30 days</CardSubtitle>
        </CardHeader>
        <div className="px-4 pb-4">
          {loading ? (
            <div className="flex items-center gap-2 text-xs text-muted">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading…
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {stockingByState.map((row) => (
                <div
                  key={row.state}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="font-mono text-xs w-8 text-muted">
                    {row.state}
                  </div>
                  <div className="flex-1">
                    <span className="num">{row.count}</span>
                    {row.sourceBreakdown && (
                      <span className="text-[11px] text-muted ml-2">
                        {row.sourceBreakdown}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-muted">
                    {row.mostRecent ?? '—'}
                  </div>
                </div>
              ))}
              {stockingByState.length === 0 && (
                <div className="text-xs text-muted">
                  No stocking events in the last 30 days.
                </div>
              )}
            </div>
          )}
          <div className="mt-3">
            <Button
              size="sm"
              variant="secondary"
              onClick={refreshStocking}
              disabled={scrapingStocking}
            >
              {scrapingStocking ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCcw className="w-3.5 h-3.5" />
              )}
              {scrapingStocking ? 'Pulling DNRs…' : 'Refresh from DNRs'}
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-warn" />
            AI usage today
          </CardTitle>
          <CardSubtitle>Your per-feature call counts</CardSubtitle>
        </CardHeader>
        <div className="px-4 pb-4">
          {loading ? (
            <div className="flex items-center gap-2 text-xs text-muted">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading…
            </div>
          ) : aiToday ? (
            <div className="flex flex-col gap-1.5 text-sm">
              <AiRow label="Briefing" calls={aiToday.briefing} cap={5} />
              <AiRow label="Photo / species ID" calls={aiToday.identifySpecies} cap={10} />
              <AiRow label="Patterns Q&A" calls={aiToday.patterns} cap={10} />
              <AiRow label="Parse journal" calls={aiToday.parseJournal} cap={20} />
            </div>
          ) : (
            <div className="text-xs text-muted">
              No AI calls yet today — try the Briefing button on a Conditions
              card.
            </div>
          )}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-info" />
            Photo upload queue
          </CardTitle>
          <CardSubtitle>
            Photos waiting to sync (offline staging)
          </CardSubtitle>
        </CardHeader>
        <div className="px-4 pb-4 text-sm">
          {photoQueue === 0 ? (
            <div className="flex items-center gap-2 text-accent">
              <CheckCircle2 className="w-4 h-4" />
              All photos uploaded
            </div>
          ) : (
            <div className="flex items-center gap-2 text-warn">
              <AlertCircle className="w-4 h-4" />
              {photoQueue} photo{photoQueue === 1 ? '' : 's'} pending. They'll
              sync the next time you're online.
            </div>
          )}
        </div>
      </Card>

      {error && <div className="text-sm text-danger">{error}</div>}

      <div className="flex justify-end">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}

// ---- helpers + types ------------------------------------------------------

interface LaunchSetSummary {
  state: string;
  count: number;
  fetchedAtMs: number | null;
}

interface StockingSummary {
  state: string;
  count: number;
  mostRecent: string | null;          // YYYY-MM-DD
  sourceBreakdown?: string;
}

interface AiUsageSummary {
  briefing: number;
  parseJournal: number;
  patterns: number;
  identifySpecies: number;
}

function db() {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not configured');
  return getFirestore(app);
}

function uid(): string | null {
  const app = getFirebaseApp();
  if (!app) return null;
  return getFirebaseAuth()?.currentUser?.uid ?? null;
}

async function loadLaunchSets(): Promise<LaunchSetSummary[]> {
  const snap = await getDocs(collection(db(), 'boatLaunchSets'));
  return snap.docs
    .map((d) => {
      const data = d.data() as {
        count?: number;
        fetchedAt?: Timestamp;
      };
      return {
        state: d.id,
        count: data.count ?? 0,
        fetchedAtMs: data.fetchedAt?.toMillis() ?? null,
      };
    })
    .sort((a, b) => a.state.localeCompare(b.state));
}

async function loadStockingSummary(): Promise<StockingSummary[]> {
  // Pull events from the last 30 days (no where clause — small per-day
  // collection across all states), then group.
  const cutoffMs = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const cutoffDate = new Date(cutoffMs).toISOString().slice(0, 10);
  const snap = await getDocs(collection(db(), 'stockingEvents'));
  const byState = new Map<
    string,
    {
      count: number;
      mostRecent: string | null;
      bySource: Map<string, number>;
    }
  >();
  for (const d of snap.docs) {
    const data = d.data() as {
      state?: string;
      date?: string;
      source?: string;
    };
    if (!data.state || !data.date || data.date < cutoffDate) continue;
    const entry = byState.get(data.state) ?? {
      count: 0,
      mostRecent: null,
      bySource: new Map<string, number>(),
    };
    entry.count++;
    if (entry.mostRecent == null || data.date > entry.mostRecent) {
      entry.mostRecent = data.date;
    }
    if (data.source) {
      entry.bySource.set(data.source, (entry.bySource.get(data.source) ?? 0) + 1);
    }
    byState.set(data.state, entry);
  }
  return Array.from(byState.entries())
    .map(([state, v]) => ({
      state,
      count: v.count,
      mostRecent: v.mostRecent,
      sourceBreakdown: Array.from(v.bySource.entries())
        .map(([src, n]) => `${shortSource(src)} ${n}`)
        .join(' · '),
    }))
    .sort((a, b) => a.state.localeCompare(b.state));
}

function shortSource(src: string): string {
  if (src === 'twra') return 'TN';
  if (src === 'ga-dnr') return 'GA';
  if (src === 'nc-wrc') return 'NC';
  if (src === 'mi-dnr') return 'MI';
  if (src === 'ky-dfwr') return 'KY';
  if (src === 'in-dnr') return 'IN';
  if (src === 'fwc') return 'FL';
  if (src === 'al-dcnr') return 'AL';
  if (src === 'manual') return 'manual';
  return src;
}

async function loadAiUsageToday(): Promise<AiUsageSummary | null> {
  const u = uid();
  if (!u) return null;
  const today = new Date().toISOString().slice(0, 10);
  const snap = await getDocs(
    collection(db(), 'aiUsage', u, 'days')
  );
  const todayDoc = snap.docs.find((d) => d.id === today);
  if (!todayDoc) {
    return { briefing: 0, parseJournal: 0, patterns: 0, identifySpecies: 0 };
  }
  const data = todayDoc.data() as Record<
    string,
    { calls?: number } | undefined
  >;
  return {
    briefing: data.briefing?.calls ?? 0,
    parseJournal: data.parseJournal?.calls ?? 0,
    patterns: data.patterns?.calls ?? 0,
    identifySpecies: data.identifySpecies?.calls ?? 0,
  };
}

function AiRow({
  label,
  calls,
  cap,
}: {
  label: string;
  calls: number;
  cap: number;
}) {
  const pct = Math.min(100, (calls / cap) * 100);
  const isFull = calls >= cap;
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span>{label}</span>
        <span className={isFull ? 'text-danger num' : 'text-muted num'}>
          {calls} / {cap}
        </span>
      </div>
      <div className="h-1 bg-surface-2 rounded mt-1 overflow-hidden">
        <div
          className={isFull ? 'h-full bg-danger' : 'h-full bg-accent'}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function formatAge(ms: number | null): string {
  if (ms == null) return 'never';
  const ageMs = Date.now() - ms;
  const hrs = ageMs / 3600_000;
  if (hrs < 1) return `${Math.round(ageMs / 60_000)}m ago`;
  if (hrs < 48) return `${Math.round(hrs)}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}
