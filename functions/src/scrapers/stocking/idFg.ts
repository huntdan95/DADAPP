import type { StockingScrapeRecord } from './types';
import { scrapeTablePage } from './genericTable';

/**
 * Idaho Fish & Game stocking summary.
 *
 * Source: https://idfg.idaho.gov/fish/stocking
 *
 * IDFG posts the year-to-date stocking report as an HTML table on
 * their fishing page. Columns: date, water, county, species, count.
 */
const URL = 'https://idfg.idaho.gov/fish/stocking';

export async function scrape(): Promise<StockingScrapeRecord[]> {
  return scrapeTablePage({
    url: URL,
    state: 'ID',
    scraperLabel: 'idFg',
    notes: 'Idaho Fish & Game stocking',
  });
}
