import { logger } from 'firebase-functions';
import type { StockingScrapeRecord } from './types';

/**
 * Indiana DNR stocking — STUB.
 *
 * Source: https://www.in.gov/dnr/fish-and-wildlife/fishing/stocking-and-trout-tagging/
 *
 * IN posts trout + steelhead stocking reports as PDFs each year. We'd
 * need pdf-parse (or similar) to extract dates + waterbodies, which is
 * heavier than the HTML scrapers above.
 *
 * Implementation plan when wired:
 *   1. Fetch the latest "Trout and Salmon Stocking Report" PDF URL
 *      from the page above
 *   2. Run through pdf-parse → text
 *   3. Regex out rows of `date | water | species | count`
 */
export async function scrape(): Promise<StockingScrapeRecord[]> {
  logger.info('inDnr.scrape', { status: 'stub' });
  return [];
}
