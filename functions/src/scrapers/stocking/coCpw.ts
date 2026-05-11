import type { StockingScrapeRecord } from './types';
import { scrapeTablePage } from './genericTable';

/**
 * Colorado Parks & Wildlife stocking reports.
 *
 * Source: https://cpw.state.co.us/learn/Pages/StateStocking.aspx
 *
 * CPW posts quarterly stocking reports as HTML tables grouped by
 * region (Northeast, Northwest, Southwest, Southeast). Date format
 * MM/DD/YYYY.
 */
const URL = 'https://cpw.state.co.us/learn/Pages/StateStocking.aspx';

export async function scrape(): Promise<StockingScrapeRecord[]> {
  return scrapeTablePage({
    url: URL,
    state: 'CO',
    scraperLabel: 'coCpw',
    notes: 'CO Parks & Wildlife stocking',
  });
}
