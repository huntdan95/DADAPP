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
import {
  triggerStockingScrape,
  type StockingScrapeDiagnostic,
} from '@/lib/stocking/trigger';
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
  const [stockingDiagnostics, setStockingDiagnostics] = useState<
    StockingScrapeDiagnostic[] | null
  >(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
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

  async function refreshStocking() {
    setScrapingStocking(true);
    try {
      const res = await triggerStockingScrape();
      setStockingDiagnostics(res.diagnostics ?? []);
      // Auto-expand the diagnostics panel if any source didn't return
      // 'ok' — that's exactly when the user needs to see why.
      const anyTrouble = (res.diagnostics ?? []).some((d) => d.status !== 'ok');
      if (anyTrouble) setShowDiagnostics(true);
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
          <div className="mt-3 flex flex-wrap gap-2 items-center">
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
            {stockingDiagnostics && stockingDiagnostics.length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowDiagnostics((s) => !s)}
              >
                {showDiagnostics ? 'Hide' : 'Show'} per-source diagnostics
              </Button>
            )}
          </div>
          {stockingDiagnostics && showDiagnostics && (
            <DiagnosticsPanel diagnostics={stockingDiagnostics} />
          )}
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

/**
 * Per-source diagnostic panel. Shows what each state-DNR scraper
 * actually fetched and why it might have returned 0 records. Color-
 * codes by status — green ok, yellow stub, red fetch/parse failures.
 *
 * The body snippet is intentionally short (~240 chars from the
 * server) and stripped of HTML tags so it's readable in a phone
 * viewport. Long enough to tell whether the page returned a real
 * stocking table, a redirect notice, a 404 page, or a JS-rendered
 * shell with no content.
 */
function DiagnosticsPanel({
  diagnostics,
}: {
  diagnostics: StockingScrapeDiagnostic[];
}) {
  const order: StockingScrapeDiagnostic['status'][] = [
    'ai_credits_low',
    'ai_failed',
    'fetch_failed',
    'parse_failed',
    'empty',
    'stub',
    'ok',
  ];
  const sorted = [...diagnostics].sort(
    (a, b) =>
      order.indexOf(a.status) - order.indexOf(b.status) ||
      a.source.localeCompare(b.source)
  );
  return (
    <div className="mt-3 flex flex-col gap-2">
      <div className="text-[11px] text-muted">
        For each source: status, URL fetched, HTTP status, and a snippet
        of the body. Tap a URL to open the DNR page in a new tab.
      </div>
      {sorted.map((d) => (
        <DiagnosticRow key={d.source} d={d} />
      ))}
    </div>
  );
}

function DiagnosticRow({ d }: { d: StockingScrapeDiagnostic }) {
  const tone = statusTone(d.status);
  return (
    <div className={`rounded border ${tone.border} ${tone.bg} p-2`}>
      <div className="flex items-center justify-between text-xs">
        <span className={`font-mono ${tone.text}`}>
          {d.source}
        </span>
        <span className={`font-mono ${tone.text}`}>
          {d.status}
          {d.httpStatus ? ` · HTTP ${d.httpStatus}` : ''}
        </span>
      </div>
      {d.url && (
        <div className="mt-1">
          <a
            href={d.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-info underline break-all"
          >
            {d.url}
          </a>
        </div>
      )}
      {d.message && (
        <div className="mt-1 text-[11px] text-muted">{d.message}</div>
      )}
      {d.bodySnippet && (
        <div className="mt-1 text-[11px] text-muted font-mono break-words whitespace-pre-wrap">
          {d.bodySnippet}
        </div>
      )}
    </div>
  );
}

function statusTone(status: StockingScrapeDiagnostic['status']): {
  border: string;
  bg: string;
  text: string;
} {
  switch (status) {
    case 'ok':
      return {
        border: 'border-accent/30',
        bg: 'bg-accent/5',
        text: 'text-accent',
      };
    case 'stub':
      return {
        border: 'border-info/30',
        bg: 'bg-info/5',
        text: 'text-info',
      };
    case 'parse_failed':
      return {
        border: 'border-warn/40',
        bg: 'bg-warn/5',
        text: 'text-warn',
      };
    case 'ai_credits_low':
    case 'ai_failed':
    case 'fetch_failed':
      return {
        border: 'border-danger/40',
        bg: 'bg-danger/5',
        text: 'text-danger',
      };
    case 'empty':
    default:
      return {
        border: 'border-white/10',
        bg: 'bg-surface-2',
        text: 'text-muted',
      };
  }
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
