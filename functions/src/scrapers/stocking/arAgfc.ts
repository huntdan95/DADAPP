import type { StockingScrapeRecord } from './types';
import { scrapeTablePage } from './genericTable';

/**
 * Arkansas Game & Fish Commission trout stocking.
 *
 * Source: https://www.agfc.com/en/fishing/trout-fishing/stocking-schedules/
 *
 * AGFC posts White River + Norfork + Little Red + Spring River
 * tailwater schedules weekly during the cooler months.
 */
const URL = 'https://www.agfc.com/en/fishing/trout-fishing/stocking-schedules/';

export async function scrape(): Promise<StockingScrapeRecord[]> {
  return scrapeTablePage({
    url: URL,
    state: 'AR',
    scraperLabel: 'arAgfc',
    notes: 'AR Game & Fish stocking',
  });
}
