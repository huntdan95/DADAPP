import { logger } from 'firebase-functions';
import type { StockingScrapeRecord } from './types';

/**
 * Florida FWC stocking — STUB.
 *
 * Source: https://myfwc.com/fishing/freshwater/stockings/
 *
 * Florida doesn't have native trout — public stocking is mostly
 * sunshine bass, striped bass, and channel cat in FWC-managed lakes.
 * The "Stockings" page lists recent events as HTML cards, refreshed
 * monthly.
 *
 * Implementation plan: parse the cards, map to lake → lat/lng using a
 * FL public-water lookup (FWC publishes lake coordinates separately).
 */
export async function scrape(): Promise<StockingScrapeRecord[]> {
  logger.info('fwc.scrape', { status: 'stub' });
  return [];
}
