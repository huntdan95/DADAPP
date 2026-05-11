import type { StockingScrapeRecord } from './types';
import { scrapeTablePage } from './genericTable';

/**
 * Oklahoma Department of Wildlife Conservation trout stocking.
 *
 * Source: https://www.wildlifedepartment.com/fishing/trout
 *
 * ODWC stocks the Lower Mountain Fork tailwater + Blue River + Lake
 * Eufaula. Weekly schedule posted Nov–March.
 */
const URL = 'https://www.wildlifedepartment.com/fishing/trout';

export async function scrape(): Promise<StockingScrapeRecord[]> {
  return scrapeTablePage({
    url: URL,
    state: 'OK',
    scraperLabel: 'okOdwc',
    notes: 'OK Wildlife trout stocking',
  });
}
