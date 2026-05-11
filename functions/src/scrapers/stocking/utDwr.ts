import type { StockingScrapeRecord } from './types';
import { scrapeTablePage } from './genericTable';

/**
 * Utah Division of Wildlife Resources stocking reports.
 *
 * Source: https://wildlife.utah.gov/fishing/fish-stocking-report.html
 *
 * UDWR has an interactive map but also publishes the underlying data
 * as an HTML table at the URL above.
 */
const URL = 'https://wildlife.utah.gov/fishing/fish-stocking-report.html';

export async function scrape(): Promise<StockingScrapeRecord[]> {
  return scrapeTablePage({
    url: URL,
    state: 'UT',
    scraperLabel: 'utDwr',
    notes: 'UT DWR stocking report',
  });
}
