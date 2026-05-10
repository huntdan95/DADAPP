/**
 * Firebase Functions entry. Phase 4 ships with stubs only — TVA's site is
 * behind Cloudflare bot protection, so a scheduled scraper would need a
 * headless browser (Playwright) which is heavy for a one-user app. The
 * primary path is manual entry from the client; this file documents
 * where automation goes when it's worth the complexity.
 *
 * To enable automation later:
 *   1. `npm install playwright-core @sparticuz/chromium` in functions/
 *   2. Implement scrapeTva to launch headless Chrome, render the lake-info
 *      page, and parse the populated tables.
 *   3. Schedule it via onSchedule from firebase-functions/v2/scheduler.
 */

export { scrapeTva } from './scrapers/tva';

// Stubs — uncomment and implement when needed.
// export { scrapeUsace } from './scrapers/usace';
// export { scrapeConsumersEnergy } from './scrapers/consumersEnergy';
