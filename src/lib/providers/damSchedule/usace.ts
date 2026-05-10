import type { DamScheduleReading } from '../types';

// TODO: Implement when first USACE-administered water is added. Each Corps
// district has its own URL pattern; one scraper module per district lives in
// functions/src/scrapers/.
export async function usaceFetchSchedule(
  _district: string,
  _project: string
): Promise<DamScheduleReading> {
  throw new Error('usace dam schedule provider not yet implemented');
}
