import type { DamScheduleReading } from '../types';

/** Manual-entry path: Phase 2 will let dad type in a schedule when no scraper exists. */
export async function manualFetchSchedule(): Promise<DamScheduleReading> {
  return {
    damName: 'manual',
    authority: 'manual',
    date: new Date().toISOString().slice(0, 10),
    hourlyUnits: Array.from({ length: 24 }, () => null),
    source: 'manual entry — not yet provided',
  };
}
