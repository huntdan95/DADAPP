import { useEffect, useState } from 'react';
import { Anchor, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardSubtitle, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  callSeedBoatLaunches,
  listBoatLaunchSetMeta,
} from '@/lib/boatLaunches/store';
import { formatRelativeTime } from '@/lib/utils';

/**
 * Admin/setup card for boat launches. Shows current per-state counts
 * (or "not seeded yet") and lets a signed-in user trigger the
 * seedBoatLaunchesCallable Cloud Function.
 *
 * The function takes ~30–60 s — Overpass needs ~3 s per state plus
 * fetch latency. After it completes, counts refresh.
 */
export function BoatLaunchesAdmin() {
  const [meta, setMeta] = useState<
    Array<{ state: string; count: number; fetchedAt: ReturnType<typeof Date.now> | null | { toDate(): Date } }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      const m = await listBoatLaunchSetMeta();
      setMeta(m);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function seed() {
    setSeeding(true);
    setError(null);
    setLastResult(null);
    try {
      const { results } = await callSeedBoatLaunches();
      const total = results.reduce((s, r) => s + Math.max(0, r.count), 0);
      setLastResult(`Seeded ${total.toLocaleString()} launches across ${results.length} states`);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSeeding(false);
    }
  }

  const total = meta.reduce((s, m) => s + m.count, 0);
  const allMissing = meta.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Anchor className="w-5 h-5 text-info" />
          Boat launches
        </CardTitle>
        <CardSubtitle>
          OpenStreetMap public boat launches for MI, TN, IN, NC, FL, GA, AL.
          Refreshes monthly automatically; seed manually below if empty or
          stale.
        </CardSubtitle>
      </CardHeader>
      <div className="px-4 pb-4 flex flex-col gap-3">
        {loading ? (
          <div className="text-sm text-muted">Checking current data…</div>
        ) : allMissing ? (
          <div className="text-sm text-warn">
            No data yet — tap "Seed now" to fetch from OpenStreetMap.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {meta
              .sort((a, b) => a.state.localeCompare(b.state))
              .map((m) => (
                <div
                  key={m.state}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-2 border border-border"
                >
                  <div className="text-sm font-semibold">{m.state}</div>
                  <div className="text-right">
                    <div className="text-sm num">{m.count.toLocaleString()}</div>
                    {m.fetchedAt && typeof m.fetchedAt === 'object' && 'toDate' in m.fetchedAt && (
                      <div className="text-[10px] text-muted">
                        {formatRelativeTime(m.fetchedAt.toDate().toISOString())}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}

        {!allMissing && (
          <div className="text-xs text-muted num">
            Total: {total.toLocaleString()} launches
          </div>
        )}

        {lastResult && (
          <div className="text-sm text-accent">{lastResult}</div>
        )}
        {error && <div className="text-sm text-danger">{error}</div>}

        <Button
          onClick={seed}
          disabled={seeding}
          variant={allMissing ? 'primary' : 'secondary'}
          className="self-start"
        >
          {seeding ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Seeding (30–60s)…
            </>
          ) : allMissing ? (
            'Seed now'
          ) : (
            'Re-seed'
          )}
        </Button>
      </div>
    </Card>
  );
}
