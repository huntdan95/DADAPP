import { logger } from 'firebase-functions';
import type { StockingScrapeRecord } from './types';

/**
 * Michigan DNR stocking — STUB.
 *
 * Source: https://www2.dnr.state.mi.us/fishstock/
 *
 * MI publishes a searchable database with downloadable CSVs by year /
 * species / waterbody. The actual schedule endpoint is JS-rendered
 * which makes basic HTML scraping unreliable.
 *
 * Implementation plan when wired:
 *   1. POST to the search form with current-year filter
 *   2. Parse the resulting CSV via a dedicated download URL
 *   3. Map waterbody names → lat/lng using a manual lookup table
 *      seeded from the seedLocations data (Manistee River, Au Sable,
 *      Pere Marquette, etc.)
 *
 * For now returns [] so the orchestrator keeps running.
 */
export async function scrape(): Promise<StockingScrapeRecord[]> {
  logger.info('miDnr.scrape', { status: 'stub' });
  return [];
}
