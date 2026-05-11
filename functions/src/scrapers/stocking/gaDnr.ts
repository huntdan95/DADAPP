import * as cheerio from 'cheerio';
import { logger } from 'firebase-functions';
import { fetchHtml } from './fetch';
import type { StockingScrapeRecord } from './types';

/**
 * Georgia DNR Wildlife Resources trout stocking.
 *
 * Source: https://georgiawildlife.com/fishing/trout-stocking
 *
 * GA's schedule is published as an HTML table grouped by week.
 * Columns observed: Week-of | Stream/Lake | County. The week-of column
 * gives us the date directly. They don't publish counts publicly on
 * the schedule page (counts come out later in the season report).
 */

const URL = 'https://georgiawildlife.com/fishing/trout-stocking';

const DATE_HEADER_RE = /(\d{1,2})\/(\d{1,2})\/(\d{2,4})/;

export async function scrape(): Promise<StockingScrapeRecord[]> {
  let html: string;
  try {
    html = await fetchHtml(URL);
  } catch (e) {
    logger.warn('gaDnr.fetch.failed', { url: URL, error: String(e) });
    return [];
  }
  const $ = cheerio.load(html);

  const records: StockingScrapeRecord[] = [];

  // Look for tables with weekly headers + stream rows beneath them.
  $('table').each((_, tbl) => {
    let currentWeekDate: string | null = null;
    $(tbl)
      .find('tr')
      .each((_i, tr) => {
        const cells = $(tr)
          .find('td, th')
          .map((_j, td) => $(td).text().trim())
          .get();
        if (cells.length === 0) return;

        // Header row: contains a date like "Week of 5/12/2026" in the first cell.
        const headerMatch = cells[0]?.match(DATE_HEADER_RE);
        if (headerMatch && cells.length <= 2) {
          const [, mo, d, yRaw] = headerMatch;
          const year = yRaw.length === 2 ? `20${yRaw}` : yRaw;
          currentWeekDate = `${year}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;
          return;
        }

        if (!currentWeekDate) return;
        const water = cells[0];
        const county = cells[1] ?? '';
        if (!water || /^stream|^lake|water/i.test(water.toLowerCase())) return;

        records.push({
          date: currentWeekDate,
          locationName: `${water}${county ? ` (${county} Co.)` : ''}`,
          state: 'GA',
          species: 'Rainbow trout',
          notes: 'GA DNR weekly schedule',
        });
      });
  });

  if (records.length === 0) {
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 240);
    logger.warn('gaDnr.parse.empty', { url: URL, bodySnippet: bodyText });
  }
  logger.info('gaDnr.scrape', { count: records.length });
  return records;
}
