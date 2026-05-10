import { onSchedule } from 'firebase-functions/v2/scheduler';
import { logger } from 'firebase-functions';

/**
 * TVA generation-schedule scraper. Currently a stub — TVA's lake-info pages
 * are gated by Cloudflare bot protection, so a simple HTTP fetch returns
 * 403. Full automation will require headless Chrome (Playwright + a Chromium
 * layer) which is heavy for a single-user app.
 *
 * Manual entry from the client is the supported path until this is built.
 *
 * Schedule per the plan: hourly during 5–11 PM ET (when TVA posts next-day
 * schedules) plus 6 AM ET (a final morning snapshot).
 */
export const scrapeTva = onSchedule(
  {
    schedule: '0 6,17,18,19,20,21,22,23 * * *',
    timeZone: 'America/New_York',
    region: 'us-central1',
    memory: '256MiB',
    timeoutSeconds: 60,
  },
  async () => {
    logger.info('scrapeTva tick — stub; manual entry remains primary');
    // TODO: implement once Playwright + Chromium layer are added.
    // const dams = ['center-hill', 'south-holston', 'wilbur', 'norris', 'apalachia', 'tims-ford'];
    // for (const dam of dams) {
    //   try {
    //     const schedule = await scrapeDamWithPlaywright(dam);
    //     await writeSchedule(dam, schedule);
    //   } catch (e) {
    //     logger.error('scrape failed', dam, e);
    //   }
    // }
  }
);
