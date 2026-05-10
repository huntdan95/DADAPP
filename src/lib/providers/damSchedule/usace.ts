import type { DamScheduleReading, Location } from '../types';
import {
  damScheduleKey,
  emptyHourly,
  readDamSchedule,
  todayLocalDate,
} from '@/lib/damSchedule/store';

// USACE has no scraper yet. Reads any manually-entered schedule from
// Firestore for the (district, project) key. Implementation pattern: one
// scraper module per district, write to the same damSchedules collection.
export async function usaceFetchSchedule(
  district: string,
  project: string,
  location: Location
): Promise<DamScheduleReading> {
  const date = todayLocalDate(location.timezone);
  const key = damScheduleKey({ kind: 'usace', district, project }, date);
  const docu = await readDamSchedule(key);
  if (!docu) {
    return {
      damName: project,
      authority: 'usace',
      date,
      hourlyUnits: emptyHourly(),
      source: 'no scraper yet — enter manually',
    };
  }
  return {
    damName: docu.damName,
    authority: 'usace',
    date: docu.date,
    hourlyUnits: docu.hourlyUnits,
    source: 'manual entry',
    scrapedAt: docu.updatedAt?.toDate().toISOString(),
  };
}
