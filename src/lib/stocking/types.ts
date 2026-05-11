import type { Timestamp } from 'firebase/firestore';

/**
 * A stocking event recorded by the user or auto-scraped from a state DNR.
 *
 * Lives at top-level `stockingEvents/{id}` — shared across all signed-in
 * users in the group, since "Caney got stocked yesterday" is collective
 * intel, not personal data. Per-state automatic scrapers (TODO) will
 * write here with `source: 'twra' | 'mi-dnr' | etc.`. Manual entries
 * carry `source: 'manual'` and the contributor's email.
 */
export interface StockingEvent {
  id: string;
  /** Date stocked (YYYY-MM-DD in the location's tz). */
  date: string;
  /** Optional location id for an exact spot match. */
  locationId?: string;
  /** Friendly location label — required so we always have something to show. */
  locationName: string;
  /** USPS state code. */
  state: string;
  /** GPS for proximity matching when no locationId is provided. */
  lat?: number;
  lng?: number;
  /** Species stocked (free text — "rainbow trout", "brown trout", "walleye"). */
  species: string;
  /** Number of fish stocked, if known. */
  count?: number;
  /** Average size if known (e.g. "9–11 in"). */
  size?: string;
  /** Free-text notes — bonus details from the contributor or scraper. */
  notes?: string;

  source:
    | 'manual'
    | 'twra'
    | 'mi-dnr'
    | 'nc-wrc'
    | 'ga-dnr'
    | 'fwc'
    | 'in-dnr'
    | 'al-dcnr'
    | 'ky-dfwr'
    | 'pa-fbc'
    | 'mt-fwp'
    | 'id-fg'
    | 'co-cpw'
    | 'ut-dwr'
    | 'ar-agfc'
    | 'ok-odwc'
    | 'ms-mdwfp'
    | 'il-dnr';
  contributorEmail?: string;
  createdAt: Timestamp | null;
}

export function newStockingId(): string {
  return `stk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
