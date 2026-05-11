import { useEffect, useMemo, useState } from 'react';
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
  limit as fsLimit,
} from 'firebase/firestore';
import { Fish, Loader2, Plus, RefreshCcw } from 'lucide-react';
import type { Location } from '@/lib/providers/types';
import {
  filterStockingForLocation,
  watchStockingWindowByState,
} from '@/lib/stocking/store';
import type { StockingEvent } from '@/lib/stocking/types';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { StockingForm } from '@/features/stocking/StockingForm';
import { getFirebaseApp } from '@/lib/firebase';
import { friendlyError } from '@/lib/errors';

/**
 * Compact stocking banner for the Conditions card. Subscribes to recent
 * (<= 30d) stocking events for the spot's state, then filters to ones
 * within ~25 mi of the spot — keeps the signal local even when a state
 * publishes statewide bulletins.
 *
 * Tap the banner to open the contributor form so anyone in the group
 * can log a new event ("they stocked Caney today, 1,200 rainbows").
 */
export function StockingBanner({ location }: { location: Location }) {
  const [events, setEvents] = useState<StockingEvent[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);
  const [lastCheckSummary, setLastCheckSummary] = useState<string | null>(null);

  useEffect(() => {
    // 90 days back + 90 days forward. Tight enough to keep the
    // banner relevant to the current season; wide enough to catch
    // both 'just-stocked-last-week' and 'scheduled-for-next-month'.
    return watchStockingWindowByState(location.state, setEvents, {
      daysBack: 90,
      daysForward: 90,
    });
  }, [location.state]);

  const nearby = filterStockingForLocation(events, location, 25);
  // For the debug expand: events in the state window that were
  // filtered out of `nearby`. Lets the user see what the system
  // knows about and decide whether a match was missed.
  const filteredOut = useMemo(
    () => events.filter((ev) => !nearby.some((m) => m.id === ev.id)),
    [events, nearby]
  );
  const [showAll, setShowAll] = useState(false);

  // Partition into upcoming vs historical using the spot's local date
  // as the boundary (handles edge cases where the user is in eastern
  // tz but server thinks it's tomorrow already in UTC).
  const todayLocal = useMemo(
    () =>
      new Intl.DateTimeFormat('en-CA', {
        timeZone: location.timezone,
      }).format(new Date()),
    [location.timezone]
  );

  const upcoming = useMemo(
    () =>
      nearby
        .filter((ev) => ev.date >= todayLocal)
        // ascending — show soonest first
        .sort((a, b) => a.date.localeCompare(b.date)),
    [nearby, todayLocal]
  );
  const historical = useMemo(
    () =>
      nearby
        .filter((ev) => ev.date < todayLocal)
        // already sorted desc by the Firestore query; preserve
        .sort((a, b) => b.date.localeCompare(a.date)),
    [nearby, todayLocal]
  );

  // Display priority: upcoming wins; fall back to most recent past.
  const mode: 'upcoming' | 'historical' | 'empty' =
    upcoming.length > 0
      ? 'upcoming'
      : historical.length > 0
      ? 'historical'
      : 'empty';
  const displayed = mode === 'upcoming' ? upcoming : historical;

  /**
   * Free Firestore re-read. This banner already has a live onSnapshot
   * subscription via `watchStockingWindowByState` so new cron writes
   * appear without any user action. The button is here purely for
   * user feedback ("yes, I checked — here's the database state for
   * your state") — it never triggers a Cloud Function call, never
   * spends Anthropic credits.
   *
   * The actual scraping happens on the Monday 5 AM ET cron in
   * Cloud Functions. Nothing about this banner can trigger it.
   */
  async function checkDatabase() {
    setChecking(true);
    setCheckError(null);
    setLastCheckSummary(null);
    try {
      const app = getFirebaseApp();
      if (!app) throw new Error('Firebase not configured');
      const db = getFirestore(app);
      // Single query against the same composite index the live
      // subscription uses, sorted newest first.
      const cutoffMs = Date.now() - 90 * 86_400_000;
      const cutoffDate = new Date(cutoffMs).toISOString().slice(0, 10);
      const q = query(
        collection(db, 'stockingEvents'),
        where('state', '==', location.state.toUpperCase()),
        where('date', '>=', cutoffDate),
        orderBy('date', 'desc'),
        fsLimit(300)
      );
      const snap = await getDocs(q);
      if (snap.empty) {
        setLastCheckSummary(
          `No stocking events in the last 90 days for ${location.state}. ` +
            `The Monday cron will refresh state DNR data — check back after Monday 5 AM ET.`
        );
      } else {
        const newest = snap.docs[0].data() as StockingEvent;
        // Use createdAt when available so the user knows when the
        // cron last wrote — otherwise fall back to the event date.
        const createdMs =
          (newest as { createdAt?: { toMillis?: () => number } })?.createdAt
            ?.toMillis?.() ?? null;
        const freshness = createdMs
          ? formatAge(Date.now() - createdMs)
          : `event date ${newest.date}`;
        setLastCheckSummary(
          `${snap.size} event${snap.size === 1 ? '' : 's'} for ${
            location.state
          } in the last 90 days · most recent ${freshness}`
        );
      }
    } catch (e) {
      setCheckError(friendlyError(e));
    } finally {
      setChecking(false);
    }
  }

  function formatAge(ageMs: number): string {
    const hours = ageMs / 3_600_000;
    if (hours < 1) return `${Math.round(ageMs / 60_000)} min ago`;
    if (hours < 48) return `${Math.round(hours)} hr ago`;
    return `${Math.round(hours / 24)} days ago`;
  }

  // Header line for the banner adapts to whether we're showing future
  // or past events. Color treatment is the same — green accent — but
  // the label tells the user "this is upcoming" vs "most recent
  // historical, nothing scheduled".
  const headerLabel =
    mode === 'upcoming'
      ? 'Upcoming stockings'
      : 'Most recent stocking';
  const overflowLabel =
    mode === 'upcoming'
      ? ` more in the next 90 days`
      : ` older event${nearby.length - 3 === 1 ? '' : 's'}`;

  return (
    <>
      {mode !== 'empty' && (
        <div className="rounded-xl border border-accent/40 bg-accent/10 p-3 mx-4 mb-3">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5 text-accent text-sm font-semibold">
              <Fish className="w-4 h-4" />
              {headerLabel}
            </div>
            <button
              type="button"
              onClick={() => setFormOpen(true)}
              className="text-[11px] text-muted hover:text-text inline-flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Add report
            </button>
          </div>
          {mode === 'historical' && (
            <div className="text-[11px] text-muted mb-1">
              Nothing scheduled in the next 90 days — last reported events:
            </div>
          )}
          <ul className="flex flex-col gap-1.5 mt-1">
            {displayed.slice(0, 3).map((ev) => (
              <li key={ev.id} className="text-xs flex items-start gap-2">
                <span className="text-muted num shrink-0">
                  {formatDate(ev.date, todayLocal)}
                </span>
                <span className="flex-1">
                  <b>{ev.locationName}</b> ·{' '}
                  {ev.count
                    ? `${ev.count.toLocaleString()} ${ev.species.toLowerCase()}`
                    : ev.species.toLowerCase()}
                  {ev.size && ` (${ev.size})`}
                  {ev.source !== 'manual' && (
                    <span className="text-muted ml-1">· {sourceLabel(ev.source)}</span>
                  )}
                </span>
              </li>
            ))}
            {displayed.length > 3 && (
              <li className="text-[11px] text-muted">
                + {displayed.length - 3}{overflowLabel}
              </li>
            )}
          </ul>
        </div>
      )}

      {/* "Got stocking intel? Add it" subtle prompt when no events at
          all (past year + 90 days forward). Hidden when the banner
          above is already showing. */}
      {mode === 'empty' && (
        <div className="px-4 mb-3 -mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="text-[11px] text-muted hover:text-text inline-flex items-center gap-1"
          >
            <Fish className="w-3 h-3" />
            Add stocking report
          </button>
          <button
            type="button"
            onClick={checkDatabase}
            disabled={checking}
            className="text-[11px] text-muted hover:text-text inline-flex items-center gap-1 disabled:opacity-50"
            title="Re-read the stocking database (free, no API calls). Cron auto-refreshes Monday 5 AM ET."
          >
            {checking ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <RefreshCcw className="w-3 h-3" />
            )}
            {checking ? 'Checking database…' : 'Check database'}
          </button>
          {checkError && (
            <span className="text-[10px] text-danger w-full">{checkError}</span>
          )}
        </div>
      )}

      {events.length > 0 && (
        <div className="mx-4 mb-3 -mt-2 flex items-center gap-3 text-[10px] text-muted">
          <span>
            {nearby.length} of {events.length} match this spot ·{' '}
            {events.length - nearby.length} other event
            {events.length - nearby.length === 1 ? '' : 's'} in{' '}
            {location.state}
          </span>
          {filteredOut.length > 0 && (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="text-info hover:text-accent transition"
            >
              {showAll ? 'Hide' : 'Show all'}
            </button>
          )}
        </div>
      )}

      {showAll && filteredOut.length > 0 && (
        <div className="mx-4 mb-3 -mt-1 rounded-lg border border-border bg-surface-2/40 p-2 max-h-64 overflow-y-auto">
          <div className="text-[10px] text-muted uppercase tracking-wider mb-1">
            Other {location.state} events ({filteredOut.length})
          </div>
          <ul className="flex flex-col gap-1 text-[11px]">
            {filteredOut.slice(0, 50).map((ev) => (
              <li key={ev.id} className="flex items-start gap-2">
                <span className="text-muted num shrink-0">
                  {formatDate(ev.date, todayLocal)}
                </span>
                <span className="flex-1 text-text/80">
                  {ev.locationName}
                  <span className="text-muted ml-1">
                    · {ev.species.toLowerCase()}
                    {ev.count ? ` × ${ev.count.toLocaleString()}` : ''}
                    {' · '}
                    {sourceLabel(ev.source)}
                  </span>
                </span>
              </li>
            ))}
            {filteredOut.length > 50 && (
              <li className="text-[10px] text-muted">
                + {filteredOut.length - 50} more not shown
              </li>
            )}
          </ul>
          <div className="text-[10px] text-muted mt-2 leading-relaxed">
            Not matching means none of the event's name tokens overlap
            with your spot's body-of-water or county. If you see one
            here that SHOULD match (e.g. spelling difference), let me
            know and I'll tune the matcher.
          </div>
        </div>
      )}

      {lastCheckSummary && mode === 'empty' && (
        <div className="mx-4 mb-3 -mt-2 text-[10px] text-muted leading-snug">
          {lastCheckSummary}
        </div>
      )}

      <BottomSheet
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title="Stocking report"
      >
        {formOpen && (
          <StockingForm
            location={location}
            onCancel={() => setFormOpen(false)}
            onSaved={() => setFormOpen(false)}
          />
        )}
      </BottomSheet>
    </>
  );
}

function formatDate(yyyyMmDd: string, todayLocal: string): string {
  // Same-day shortcut: 'today' regardless of timezone arithmetic.
  if (yyyyMmDd === todayLocal) return 'today';

  // Compute signed day delta from today (positive = future).
  const eventMs = Date.parse(yyyyMmDd + 'T12:00:00Z');
  const todayMs = Date.parse(todayLocal + 'T12:00:00Z');
  const deltaDays = Math.round((eventMs - todayMs) / (24 * 60 * 60 * 1000));

  if (deltaDays === 1) return 'tomorrow';
  if (deltaDays === -1) return 'yesterday';
  if (deltaDays > 0 && deltaDays < 7) return `in ${deltaDays}d`;
  if (deltaDays < 0 && deltaDays > -7) return `${-deltaDays}d ago`;

  // Older + further-out → calendar date. Include year on >180 days
  // away so "Aug 12, 2024" reads naturally for last-year stockings.
  const d = new Date(eventMs);
  const includeYear = Math.abs(deltaDays) > 180;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    ...(includeYear ? { year: 'numeric' } : {}),
  }).format(d);
}

function sourceLabel(source: StockingEvent['source']): string {
  switch (source) {
    case 'twra':
      return 'TWRA';
    case 'mi-dnr':
      return 'MI DNR';
    case 'nc-wrc':
      return 'NC WRC';
    case 'ga-dnr':
      return 'GA DNR';
    case 'fwc':
      return 'FWC';
    case 'in-dnr':
      return 'IN DNR';
    case 'al-dcnr':
      return 'AL DCNR';
    case 'ky-dfwr':
      return 'KDFWR';
    case 'pa-fbc':
      return 'PFBC';
    case 'mt-fwp':
      return 'MT FWP';
    case 'id-fg':
      return 'IDFG';
    case 'co-cpw':
      return 'CPW';
    case 'ut-dwr':
      return 'UDWR';
    case 'ar-agfc':
      return 'AGFC';
    case 'ok-odwc':
      return 'ODWC';
    case 'ms-mdwfp':
      return 'MDWFP';
    case 'il-dnr':
      return 'IL DNR';
    default:
      return 'reported';
  }
}
