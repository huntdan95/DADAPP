import type { StockingScrapeRecord } from './types';
import { scrapeTablePage } from './genericTable';

/**
 * Mississippi Department of Wildlife, Fisheries, and Parks.
 *
 * Source: https://www.mdwfp.com/fishing/freshwater/stocking-reports/
 *
 * MDWFP publishes intermittent stocking reports for community ponds
 * + state-park lakes. No regular trout stocking — mostly bass, cat,
 * crappie. Stub: tolerant parser; many weeks will return zero.
 */
const URL = 'https://www.mdwfp.com/fishing/freshwater/stocking-reports/';

export async function scrape(): Promise<StockingScrapeRecord[]> {
  return scrapeTablePage({
    url: URL,
    state: 'MS',
    scraperLabel: 'msMdwfp',
    notes: 'MS DWFP stocking report',
  });
}
