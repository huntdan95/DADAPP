/**
 * Shared types for the state-DNR stocking scrapers.
 *
 * Each per-state module exports `scrape()` returning a list of raw
 * stocking observations. The orchestrator dedupes against existing
 * Firestore docs and persists new ones with the matching `source` tag.
 */

import { Timestamp } from 'firebase-admin/firestore';

export interface StockingScrapeRecord {
  /** YYYY-MM-DD. The stocking date as published. */
  date: string;
  /** Display name for the location ("Caney Fork — Happy Hollow"). */
  locationName: string;
  /** USPS state code. */
  state: string;
  /** Common species name ("Rainbow trout"). */
  species: string;
  /** Number of fish, when published. */
  count?: number;
  /** Stocking size summary, when published ("9-11 in"). */
  size?: string;
  /** Optional GPS hint (set when the DNR publishes coords or we have a known lookup). */
  lat?: number;
  lng?: number;
  /** Free-text note from the scraper — usually the publication URL or county. */
  notes?: string;
}

export type StockingSource =
  | 'twra'
  | 'mi-dnr'
  | 'nc-wrc'
  | 'ga-dnr'
  | 'fwc'
  | 'in-dnr'
  | 'al-dcnr'
  | 'ky-dfwr';

/**
 * Stable id for a stocking record so re-scrapes don't double-write.
 * Hash is built from the natural-key fields (source + date + location
 * + species). Order of fields matters — keep stable.
 */
export function deriveStockingId(
  source: StockingSource,
  rec: StockingScrapeRecord
): string {
  const slug = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40);
  return `auto-${source}-${rec.date}-${slug(rec.locationName)}-${slug(rec.species)}`;
}

export interface StockingDoc {
  id: string;
  date: string;
  locationName: string;
  state: string;
  species: string;
  count?: number;
  size?: string;
  lat?: number;
  lng?: number;
  notes?: string;
  source: StockingSource;
  createdAt: Timestamp;
}
