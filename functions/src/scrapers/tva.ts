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
 * Schedule throttled to once-daily — was firing 8x/day for a stub which
 * just polluted logs and pre-warmed a function that does nothing useful.
 * When this is actually implemented, restore the 5-7 PM ET window where
 * TVA posts next-day schedules.
 */
export const scrapeTva = onSchedule(
  {
    schedule: '0 6 * * *',
    timeZone: 'America/New_York',
    region: 'us-central1',
    memory: '256MiB',
    timeoutSeconds: 60,
  },
  async () => {
    logger.info('scrapeTva tick — stub; manual entry remains primary');
  }
);
