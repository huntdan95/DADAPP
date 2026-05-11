import { logger } from 'firebase-functions';
import type { StockingScrapeRecord } from './types';

/**
 * Alabama Department of Conservation & Natural Resources — STUB.
 *
 * Source: https://www.outdooralabama.com/fishing/freshwater-fishing
 *
 * AL doesn't publish a structured stocking schedule publicly. They
 * post annual "stocking summary" reports as PDFs after the fact.
 * Low priority — the value-prop of "stocked today" doesn't really
 * apply here since they don't pre-announce.
 */
export async function scrape(): Promise<StockingScrapeRecord[]> {
  logger.info('alDcnr.scrape', { status: 'stub' });
  return [];
}
