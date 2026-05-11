import { useEffect, useMemo, useState } from 'react';
import { Fish, Loader2, Plus, RefreshCcw } from 'lucide-react';
import type { Location } from '@/lib/providers/types';
import {
  filterStockingForLocation,
  watchStockingWindowByState,
} from '@/lib/stocking/store';
import type { StockingEvent } from '@/lib/stocking/types';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StockingForm } from '@/features/stocking/StockingForm';
import { triggerStockingScrape } from '@/lib/stocking/trigger';
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
  const [scraping, setScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState<string | null>(null);
  const [lastScrapeSummary, setLastScrapeSummary] = useState<string | null>(
    null
  );

  useEffect(() => {
    // Wider window: 1 year of history + 90 days forward. We partition
    // past/future client-side and prefer upcoming when available.
    return watchStockingWindowByState(location.state, setEvents, {
      daysBack: 365,
      daysForward: 90,
    });
  }, [location.state]);

  const nearby = filterStockingForLocation(events, location, 25);

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

  async function refreshFromDnrs() {
    setScraping(true);
    setScrapeError(null);
    setLastScrapeSummary(null);
    try {
      // Hits every state DNR scraper in one call. Live writes flow into
      // the same stockingEvents collection so this banner picks them up
      // automatically via the existing subscription.
      const res = await triggerStockingScrape();
      // Build a human summary: "TWRA 12, MI 8, GA 0 (err)…" so users
      // can SEE which scrapers actually returned data and which are
      // dead. Without this it looks like "nothing happened" when in
      // reality the scrapers may have failed silently.
      const summary = res.results
        .map((r) => {
          if (r.error) return `${labelFor(r.source)} error`;
          if (r.total === 0) return `${labelFor(r.source)} 0`;
          return `${labelFor(r.source)} ${r.added}+`;
        })
        .join(' · ');
      setLastScrapeSummary(summary || 'No scrapers ran');
    } catch (e) {
      setScrapeError(friendlyError(e));
    } finally {
      setScraping(false);
    }
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
        <div className="px-4 mb-3 -mt-2 flex items-center gap-3">
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
            onClick={refreshFromDnrs}
            disabled={scraping}
            className="text-[11px] text-muted hover:text-text inline-flex items-center gap-1 disabled:opacity-50"
          >
            {scraping ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <RefreshCcw className="w-3 h-3" />
            )}
            {scraping ? 'Pulling DNRs…' : 'Refresh from DNRs'}
          </button>
          {scrapeError && (
            <span className="text-[10px] text-danger">{scrapeError}</span>
          )}
        </div>
      )}

      {scraping && mode === 'empty' && (
        <div className="mx-4 mb-3 -mt-2">
          <ProgressBar
            status="Pulling state DNRs — usually under a minute"
            variant="info"
          />
        </div>
      )}

      {lastScrapeSummary && mode === 'empty' && (
        <div className="mx-4 mb-3 -mt-2 text-[10px] text-muted">
          Last refresh: {lastScrapeSummary}
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

/**
 * Short labels used in the post-refresh summary line. Mirror the
 * full sourceLabel() codes but trimmed for a compact one-line read.
 */
function labelFor(sourceCode: string): string {
  switch (sourceCode) {
    case 'twra':
      return 'TN';
    case 'mi-dnr':
      return 'MI';
    case 'nc-wrc':
      return 'NC';
    case 'ga-dnr':
      return 'GA';
    case 'fwc':
      return 'FL';
    case 'in-dnr':
      return 'IN';
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
    default:
      return sourceCode;
  }
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
