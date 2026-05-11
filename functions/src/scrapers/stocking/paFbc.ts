import type { StockingScrapeRecord } from './types';
import { scrapeTablePage } from './genericTable';

/**
 * Pennsylvania Fish & Boat Commission stocking schedule.
 *
 * Source: https://www.fishandboat.com/Fish/FishingTroutStocking/Pages/default.aspx
 *
 * PFBC publishes trout stocking weekly during the Mar–May spring
 * season + occasional fall runs. Format is an HTML table indexed by
 * county.
 */
const URL = 'https://www.fishandboat.com/Fish/FishingTroutStocking/Pages/default.aspx';

export async function scrape(): Promise<StockingScrapeRecord[]> {
  return scrapeTablePage({
    url: URL,
    state: 'PA',
    scraperLabel: 'paFbc',
    notes: 'PA Fish & Boat stocking schedule',
  });
}
