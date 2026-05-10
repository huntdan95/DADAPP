import type { DamScheduleReading } from '../types';

/**
 * Phase 4 will replace this with a Firestore read populated by the scrapeTva
 * Cloud Function. Until then, we surface a neutral "schedule not yet wired"
 * placeholder so the UI section renders without breaking.
 */
export async function tvaFetchSchedule(dam: string): Promise<DamScheduleReading> {
  return {
    damName: dam,
    authority: 'tva',
    date: new Date().toISOString().slice(0, 10),
    hourlyUnits: Array.from({ length: 24 }, () => null),
    source: 'pending Phase 4 (TVA scraper Cloud Function)',
  };
}
