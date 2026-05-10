import type { DamScheduleReading, Location } from '../types';
import {
  damScheduleKey,
  emptyHourly,
  readDamSchedule,
  todayLocalDate,
} from '@/lib/damSchedule/store';

/**
 * Reads today's TVA generation schedule from Firestore. Phase 4 ships
 * with manual entry as the primary path (TVA's site is Cloudflare-gated,
 * so the scraper Cloud Function is a stub). The shape is the same
 * either way — the source field reflects how the doc got there.
 */
export async function tvaFetchSchedule(
  dam: string,
  location: Location
): Promise<DamScheduleReading> {
  const date = todayLocalDate(location.timezone);
  const key = damScheduleKey({ kind: 'tva', dam }, date);
  const docu = await readDamSchedule(key);
  if (!docu) {
    return {
      damName: dam,
      authority: 'tva',
      date,
      hourlyUnits: emptyHourly(),
      source: 'no schedule entered yet',
    };
  }
  return {
    damName: docu.damName,
    authority: 'tva',
    date: docu.date,
    hourlyUnits: docu.hourlyUnits,
    source: docu.source === 'scraped' ? 'TVA scrape' : 'manual entry',
    scrapedAt: docu.updatedAt?.toDate().toISOString(),
  };
}
