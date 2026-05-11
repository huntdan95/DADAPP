import type { StockingScrapeRecord } from './types';
import { scrapeTablePage } from './genericTable';

/**
 * Montana Fish, Wildlife & Parks stocking reports.
 *
 * Source: https://myfwp.mt.gov/getRepositoryFile?objectID=23437 (annual PDF)
 *         https://fwp.mt.gov/fish/fishing-and-aquatic-life/fish-stocking
 *
 * MT publishes both PDF annual reports and a quarterly HTML summary
 * page. We attempt the HTML page; if zero rows, the orchestrator
 * logs an empty-parse warning and we iterate selectors next pass.
 */
const URL = 'https://fwp.mt.gov/fish/fishing-and-aquatic-life/fish-stocking';

export async function scrape(): Promise<StockingScrapeRecord[]> {
  return scrapeTablePage({
    url: URL,
    state: 'MT',
    scraperLabel: 'mtFwp',
    notes: 'MT FWP stocking report',
  });
}
