import { useEffect, useState } from 'react';
import { Fish, Loader2, Plus, RefreshCcw } from 'lucide-react';
import type { Location } from '@/lib/providers/types';
import {
  filterStockingForLocation,
  watchRecentStockingByState,
} from '@/lib/stocking/store';
import type { StockingEvent } from '@/lib/stocking/types';
import { BottomSheet } from '@/components/ui/BottomSheet';
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

  useEffect(() => {
    return watchRecentStockingByState(location.state, setEvents, 30);
  }, [location.state]);

  const nearby = filterStockingForLocation(events, location, 25);

  async function refreshFromDnrs() {
    setScraping(true);
    setScrapeError(null);
    try {
      // Hits every state DNR scraper in one call. Live writes flow into
      // the same stockingEvents collection so this banner picks them up
      // automatically via the existing subscription.
      await triggerStockingScrape();
    } catch (e) {
      setScrapeError(friendlyError(e));
    } finally {
      setScraping(false);
    }
  }

  return (
    <>
      {nearby.length > 0 && (
        <div className="rounded-xl border border-accent/40 bg-accent/10 p-3 mx-4 mb-3">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5 text-accent text-sm font-semibold">
              <Fish className="w-4 h-4" />
              Recently stocked
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
          <ul className="flex flex-col gap-1.5 mt-1">
            {nearby.slice(0, 3).map((ev) => (
              <li key={ev.id} className="text-xs flex items-start gap-2">
                <span className="text-muted num shrink-0">
                  {formatDate(ev.date)}
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
            {nearby.length > 3 && (
              <li className="text-[11px] text-muted">
                + {nearby.length - 3} more in the past 30 days
              </li>
            )}
          </ul>
        </div>
      )}

      {/* "Got stocking intel? Add it" subtle prompt when no recent events.
          Hidden if the spot already has a banner above. */}
      {nearby.length === 0 && (
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

function formatDate(yyyyMmDd: string): string {
  const d = new Date(yyyyMmDd + 'T12:00:00Z');
  const today = new Date();
  const ageDays = Math.round(
    (today.getTime() - d.getTime()) / (24 * 60 * 60 * 1000)
  );
  if (ageDays === 0) return 'today';
  if (ageDays === 1) return 'yesterday';
  if (ageDays < 7) return `${ageDays}d ago`;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
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
    default:
      return 'reported';
  }
}
