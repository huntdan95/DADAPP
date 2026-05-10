import type { DamScheduleReading, Location } from '../types';
import { inferGenerationFromFlow } from '@/lib/damSchedule/autoInfer';

/**
 * Auto-derive dam generation status from the downstream USGS gauge.
 * Same shape as the manual/scraper paths — the rest of the UI doesn't
 * know it came from inference.
 */
export async function autoFetchSchedule(
  flowSiteId: string,
  location: Location
): Promise<DamScheduleReading> {
  const inferred = await inferGenerationFromFlow(flowSiteId, location.timezone);
  const date = new Intl.DateTimeFormat('en-CA', {
    timeZone: location.timezone,
  }).format(new Date());
  return {
    damName: inferred.siteName || `USGS ${flowSiteId}`,
    authority: 'manual', // closest existing label; UI distinguishes via source
    date,
    hourlyUnits: inferred.hourlyUnits,
    source: `auto: inferred from gauge ${flowSiteId} (baseline ≈ ${Math.round(
      inferred.baselineCfs
    )} cfs)`,
    scrapedAt: inferred.observedAt ?? undefined,
  };
}
