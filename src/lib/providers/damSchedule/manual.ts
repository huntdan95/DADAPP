import type { DamScheduleReading, Location } from '../types';
import {
  damScheduleKey,
  emptyHourly,
  readDamSchedule,
  todayLocalDate,
} from '@/lib/damSchedule/store';

/** Manual-entry path: dad types the schedule when no scraper exists. */
export async function manualFetchSchedule(
  location: Location
): Promise<DamScheduleReading> {
  const date = todayLocalDate(location.timezone);
  const key = damScheduleKey({ kind: 'manual' }, date);
  const docu = await readDamSchedule(key);
  if (!docu) {
    return {
      damName: 'manual',
      authority: 'manual',
      date,
      hourlyUnits: emptyHourly(),
      source: 'no schedule entered yet',
    };
  }
  return {
    damName: docu.damName,
    authority: 'manual',
    date: docu.date,
    hourlyUnits: docu.hourlyUnits,
    source: 'manual entry',
    scrapedAt: docu.updatedAt?.toDate().toISOString(),
  };
}
