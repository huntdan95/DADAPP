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
import { ProgressBar } from '@/components/ui/ProgressBar';
import { getFirebaseApp, getFirebaseAuth } from '@/lib/firebase';
import { pendingPhotoCount } from '@/lib/log/photoQueue';
import { callSeedBoatLaunches, STATES as LAUNCH_STATES } from '@/lib/boatLaunches/store';
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
  const [seedingMissing, setSeedingMissing] = useState(false);
  const [seedProgress, setSeedProgress] = useState<{
    pct: number;
    label: string;
    etaSeconds: number | null;
  } | null>(null);
  /**
   * Which single state is currently being re-seeded, if any. Used to
   * disable other state-level scrub buttons while one is running.
   * Distinct from `seedingLaunches` (all-state) and `seedingMissing`
   * (subset re-seed) so the per-row spinner only spins on that row.
   */
  const [singleState, setSingleState] = useState<string | null>(null);

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

  /**
   * Free refresh — re-reads the Firestore stockingEvents collection
   * and re-computes the per-state summary. No Cloud Function call,
   * no Anthropic credits. This is the only refresh action — fresh
   * AI extraction happens automatically every Monday 5 AM ET via
   * the scheduled cron.
   */
  async function refreshView() {
    setScrapingStocking(true);
    try {
      await load();
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setScrapingStocking(false);
    }
  }

  async function runWithProgress(states?: string[]): Promise<void> {
    const start = Date.now();
    await callSeedBoatLaunches((p) => {
      const pct = (p.chunkIndex / p.totalChunks) * 100;
      const elapsedMs = Date.now() - start;
      const avgChunkMs = elapsedMs / p.chunkIndex;
      const remainingMs = avgChunkMs * (p.totalChunks - p.chunkIndex);
      setSeedProgress({
        pct,
        label: `Chunk ${p.chunkIndex} of ${p.totalChunks}`,
        etaSeconds: Math.max(0, Math.round(remainingMs / 1000)),
      });
    }, states);
  }

  async function refreshLaunches() {
    setSeedingLaunches(true);
    setSeedProgress({ pct: 0, label: 'Starting…', etaSeconds: null });
    try {
      await runWithProgress();
      await load();
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setSeedingLaunches(false);
      setSeedProgress(null);
    }
  }

  /**
   * Re-seed a single state on demand. Lets the user fix one stale
   * row without waiting for a full 17-state refresh. The progress
   * bar still uses the chunked-progress component since the scrape
   * Cloud Function reports chunk-of-1 internally — the bar just
   * fills to 100% on completion.
   */
  async function refreshOneState(state: string) {
    if (singleState || seedingLaunches || seedingMissing) return;
    setSingleState(state);
    setSeedProgress({ pct: 0, label: `Scraping ${state}…`, etaSeconds: null });
    try {
      await runWithProgress([state]);
      await load();
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setSingleState(null);
      setSeedProgress(null);
    }
  }

  /**
   * Re-seed only states that have no doc yet or count of 0. Useful
   * when a previous full refresh failed for some states and we want
   * to retry the failed ones without waiting another 10 minutes for
   * already-seeded states.
   */
  async function refreshMissingLaunches() {
    const missing = launchSets
      .filter((row) => row.count === 0 || row.fetchedAtMs == null)
      .map((row) => row.state);
    if (missing.length === 0) return;
    setSeedingMissing(true);
    setSeedProgress({ pct: 0, label: 'Starting…', etaSeconds: null });
    try {
      await runWithProgress(missing);
      await load();
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setSeedingMissing(false);
      setSeedProgress(null);
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
              {launchSets.map((row) => {
                const isMissing = row.count === 0 || row.fetchedAtMs == null;
                const busyThisRow = singleState === row.state;
                const busyAny =
                  seedingLaunches || seedingMissing || singleState != null;
                return (
                  <div
                    key={row.state}
                    className={
                      'flex items-center justify-between gap-2 text-sm ' +
                      (isMissing ? 'text-warn' : '')
                    }
                  >
                    <div className="font-mono text-xs w-8 text-muted">
                      {row.state}
                    </div>
                    <div className="flex-1 num">
                      {isMissing ? '—' : row.count.toLocaleString()}
                    </div>
                    <div
                      className={
                        'text-[11px] ' + (isMissing ? 'text-warn' : 'text-muted')
                      }
                    >
                      {isMissing ? 'never scraped' : formatAge(row.fetchedAtMs)}
                    </div>
                    <button
                      type="button"
                      onClick={() => refreshOneState(row.state)}
                      disabled={busyAny}
                      title={`Scrape ${row.state} launches`}
                      aria-label={`Scrape ${row.state} launches`}
                      className="text-muted hover:text-info disabled:opacity-30 disabled:cursor-not-allowed transition flex-none"
                    >
                      {busyThisRow ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <RefreshCcw className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          {seedProgress && (
            <div className="mt-3">
              <ProgressBar
                value={seedProgress.pct > 0 ? seedProgress.pct : undefined}
                status={seedProgress.label}
                eta={formatEtaSeconds(seedProgress.etaSeconds)}
                variant="info"
              />
            </div>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={refreshLaunches}
              disabled={seedingLaunches || seedingMissing || singleState != null}
            >
              {seedingLaunches ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCcw className="w-3.5 h-3.5" />
              )}
              {seedingLaunches ? 'Scraping…' : 'Refresh all states'}
            </Button>
            {launchSets.some(
              (r) => r.count === 0 || r.fetchedAtMs == null
            ) && (
              <Button
                size="sm"
                variant="secondary"
                onClick={refreshMissingLaunches}
                disabled={
                  seedingMissing || seedingLaunches || singleState != null
                }
              >
                {seedingMissing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <RefreshCcw className="w-3.5 h-3.5" />
                )}
                {seedingMissing
                  ? 'Scraping missing…'
                  : `Re-seed ${
                      launchSets.filter(
                        (r) => r.count === 0 || r.fetchedAtMs == null
                      ).length
                    } missing`}
              </Button>
            )}
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fish className="w-4 h-4 text-accent" />
            Stocking events
          </CardTitle>
          <CardSubtitle>All 17 covered states, last 90 days</CardSubtitle>
        </CardHeader>
        <div className="px-4 pb-4">
          {loading ? (
            <div className="flex items-center gap-2 text-xs text-muted">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading…
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {stockingByState.map((row) => {
                const isEmpty = row.count === 0;
                const isStale = isEmpty && row.everSeen != null;
                const isNever = isEmpty && row.everSeen == null;
                return (
                  <div
                    key={row.state}
                    className={
                      'flex items-center justify-between text-sm gap-2 ' +
                      (isNever ? 'text-warn' : '')
                    }
                  >
                    <div className="font-mono text-xs w-8 text-muted">
                      {row.state}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="num">
                        {isEmpty ? '—' : row.count.toLocaleString()}
                      </span>
                      {row.sourceBreakdown && (
                        <span className="text-[11px] text-muted ml-2">
                          {row.sourceBreakdown}
                        </span>
                      )}
                    </div>
                    <div
                      className={
                        'text-[11px] flex-none ' +
                        (isNever
                          ? 'text-warn'
                          : isStale
                          ? 'text-warn/80'
                          : 'text-muted')
                      }
                    >
                      {isNever
                        ? 'never seen'
                        : isStale
                        ? `stale · last ${row.everSeen}`
                        : row.mostRecent ?? '—'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="mt-3 flex flex-wrap gap-2 items-center">
            <Button
              size="sm"
              variant="secondary"
              onClick={refreshView}
              disabled={scrapingStocking}
              title="Re-reads the Firestore database. Free — no Claude credits."
            >
              {scrapingStocking ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCcw className="w-3.5 h-3.5" />
              )}
              Refresh view
            </Button>
          </div>
          <div className="mt-2 text-[10px] text-muted leading-snug">
            Tap to re-read the database. Fresh DNR records are pulled
            automatically every <b>Monday 5 AM ET</b> by the scheduled
            cron — shared across every user, no per-tap cost.
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
  /** Count in the 90-day window. */
  count: number;
  /** Most recent event date inside the 90-day window, or null. */
  mostRecent: string | null;          // YYYY-MM-DD
  /** Most recent event date of ANY age — surfaces stale states. */
  everSeen?: string | null;
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
  // Index existing docs by state code.
  const byState = new Map<string, { count: number; fetchedAtMs: number | null }>();
  for (const d of snap.docs) {
    const data = d.data() as { count?: number; fetchedAt?: Timestamp };
    byState.set(d.id, {
      count: data.count ?? 0,
      fetchedAtMs: data.fetchedAt?.toMillis() ?? null,
    });
  }
  // Fold every CONFIGURED state — present states keep their data,
  // missing states show count=0 and fetchedAtMs=null so the row
  // surfaces as 'never'.
  return LAUNCH_STATES
    .map((state) => ({
      state,
      count: byState.get(state)?.count ?? 0,
      fetchedAtMs: byState.get(state)?.fetchedAtMs ?? null,
    }))
    .sort((a, b) => a.state.localeCompare(b.state));
}

/**
 * Every state the stocking orchestrator covers. Stays in sync with the
 * SCRAPERS array in functions/src/scrapers/stocking/index.ts. Showing
 * all 17 (rather than only states with recent events) makes "this
 * state is stale" obvious instead of "this state quietly missing".
 */
const STOCKING_STATES = [
  'AL', 'AR', 'CO', 'FL', 'GA', 'ID', 'IL', 'IN', 'KY',
  'MI', 'MS', 'MT', 'NC', 'OK', 'PA', 'TN', 'UT',
];

async function loadStockingSummary(): Promise<StockingSummary[]> {
  // Pull events from the last 90 days (a season — narrow 30 days hid
  // states that only stock spring-summer once we're past the window).
  const cutoffMs = Date.now() - 90 * 24 * 60 * 60 * 1000;
  const cutoffDate = new Date(cutoffMs).toISOString().slice(0, 10);
  const snap = await getDocs(collection(db(), 'stockingEvents'));
  const byState = new Map<
    string,
    {
      count: number;            // count in the 90-day window
      mostRecent: string | null; // most recent in the window
      everSeen: string | null;   // most recent of any age — surfaces stale data clearly
      bySource: Map<string, number>;
    }
  >();
  for (const d of snap.docs) {
    const data = d.data() as {
      state?: string;
      date?: string;
      source?: string;
    };
    if (!data.state || !data.date) continue;
    const state = data.state.toUpperCase();
    const entry = byState.get(state) ?? {
      count: 0,
      mostRecent: null,
      everSeen: null,
      bySource: new Map<string, number>(),
    };
    // Always track the absolute-most-recent — even if outside the
    // window, surfaces "last stocked 145 days ago" so the row isn't
    // a pure mystery.
    if (entry.everSeen == null || data.date > entry.everSeen) {
      entry.everSeen = data.date;
    }
    if (data.date >= cutoffDate) {
      entry.count++;
      if (entry.mostRecent == null || data.date > entry.mostRecent) {
        entry.mostRecent = data.date;
      }
      if (data.source) {
        entry.bySource.set(
          data.source,
          (entry.bySource.get(data.source) ?? 0) + 1
        );
      }
    }
    byState.set(state, entry);
  }

  // Fold over ALL configured states so empty / never-scraped ones
  // surface explicitly. Mirrors the boat-launch pattern.
  return STOCKING_STATES.map((state) => {
    const v = byState.get(state);
    if (!v) {
      return {
        state,
        count: 0,
        mostRecent: null,
        everSeen: null,
      } as StockingSummary;
    }
    return {
      state,
      count: v.count,
      mostRecent: v.mostRecent,
      everSeen: v.everSeen,
      sourceBreakdown:
        v.bySource.size > 0
          ? Array.from(v.bySource.entries())
              .map(([src, n]) => `${shortSource(src)} ${n}`)
              .join(' · ')
          : undefined,
    };
  }).sort((a, b) => a.state.localeCompare(b.state));
}

/** Compact source labels for the System Health breakdown line. */
function shortSource(src: string): string {
  switch (src) {
    case 'twra':
      return 'TN';
    case 'ga-dnr':
      return 'GA';
    case 'nc-wrc':
      return 'NC';
    case 'mi-dnr':
      return 'MI';
    case 'in-dnr':
      return 'IN';
    case 'fwc':
      return 'FL';
    case 'al-dcnr':
      return 'AL';
    case 'ky-dfwr':
      return 'KY';
    case 'pa-fbc':
      return 'PA';
    case 'mt-fwp':
      return 'MT';
    case 'id-fg':
      return 'ID';
    case 'co-cpw':
      return 'CO';
    case 'ut-dwr':
      return 'UT';
    case 'ar-agfc':
      return 'AR';
    case 'ok-odwc':
      return 'OK';
    case 'ms-mdwfp':
      return 'MS';
    case 'il-dnr':
      return 'IL';
    case 'manual':
      return 'manual';
    default:
      return src;
  }
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

function formatEtaSeconds(seconds: number | null): string | undefined {
  if (seconds == null || !Number.isFinite(seconds)) return undefined;
  if (seconds < 60) return `~${seconds}s left`;
  return `~${Math.round(seconds / 60)} min left`;
}
