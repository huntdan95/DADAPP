/**
 * Firebase Functions entry. Phases:
 *   - Phase 4: TVA scrape stub (manual entry is the actual user path).
 *   - Phase 5: OpenStreetMap boat-launch seeder (callable + monthly cron).
 *   - Phase 6: Claude API integration (briefing, parseJournal, patterns, identifySpecies).
 */

import { initializeApp } from 'firebase-admin/app';

initializeApp();

// Phase 5 — boat launches
export {
  seedBoatLaunches,
  seedBoatLaunchesCallable,
} from './scrapers/boatLaunches';

// Phase 4 — TVA dam schedule scraper stub
export { scrapeTva } from './scrapers/tva';

// Phase 8 — state-DNR stocking scrapers (TWRA, GA, NC active; MI/IN/FL/AL stubs)
export { scrapeStocking, triggerStockingScrape } from './scrapers/stocking';
// One-click bundled-seed uploader. Pushes the 8K+ records bundled in
// functions/seed-data/ to Firestore via admin SDK so the user never
// has to deal with firebase-tools auth on their machine.
export { seedStockingFromBundle } from './scrapers/stocking/seedFromBundle';

// Phase 6 — Claude API
export { briefing } from './claude/briefing';
export { parseJournal } from './claude/parseJournal';
export { patterns } from './claude/patterns';
export { identifySpecies } from './claude/identifySpecies';
export { analyzePhoto } from './claude/analyzePhoto';
