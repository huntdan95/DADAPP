/**
 * Firebase Functions entry. Phase 5 ships boat-launch seeding from
 * OpenStreetMap via the Overpass API for MI, TN, IN, NC, FL, GA, AL.
 *
 * Phase 4's TVA scraper is a stub — TVA's site is behind Cloudflare bot
 * protection, so a scheduled scraper would need a headless browser
 * (Playwright). Manual entry from the client is the supported path.
 */

import { initializeApp } from 'firebase-admin/app';

initializeApp();

export { seedBoatLaunches, seedBoatLaunchesCallable } from './scrapers/boatLaunches';
export { scrapeTva } from './scrapers/tva';

// Stubs — uncomment and implement when needed.
// export { scrapeUsace } from './scrapers/usace';
// export { scrapeConsumersEnergy } from './scrapers/consumersEnergy';
