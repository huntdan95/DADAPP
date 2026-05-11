import type { StockingScrapeRecord } from './types';
import { scrapeTablePage } from './genericTable';

/**
 * Illinois Department of Natural Resources stocking reports.
 *
 * Source: https://dnr.illinois.gov/content/dam/soi/en/web/dnr/fishing/documents/stocking-reports.html
 *
 * IL stocks trout in spring + fall at urban ponds, plus warmwater
 * stocking at lakes and reservoirs.
 */
const URL = 'https://dnr.illinois.gov/programs/fishing.html';

export async function scrape(): Promise<StockingScrapeRecord[]> {
  return scrapeTablePage({
    url: URL,
    state: 'IL',
    scraperLabel: 'ilDnr',
    notes: 'IL DNR stocking report',
  });
}
