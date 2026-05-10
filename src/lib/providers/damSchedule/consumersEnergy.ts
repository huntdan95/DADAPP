import type { DamScheduleReading, Location } from '../types';
import {
  damScheduleKey,
  emptyHourly,
  readDamSchedule,
  todayLocalDate,
} from '@/lib/damSchedule/store';

// Tippy + Hodenpyl. In practice the USGS gauge below Tippy (04125550) is
// the actionable downstream signal, so a dedicated scraper here is low
// priority. Reads manually-entered schedules.
export async function consumersEnergyFetchSchedule(
  dam: string,
  location: Location
): Promise<DamScheduleReading> {
  const date = todayLocalDate(location.timezone);
  const key = damScheduleKey({ kind: 'consumers-energy', dam }, date);
  const docu = await readDamSchedule(key);
  if (!docu) {
    return {
      damName: dam,
      authority: 'consumers-energy',
      date,
      hourlyUnits: emptyHourly(),
      source: 'no scraper yet — enter manually',
    };
  }
  return {
    damName: docu.damName,
    authority: 'consumers-energy',
    date: docu.date,
    hourlyUnits: docu.hourlyUnits,
    source: 'manual entry',
    scrapedAt: docu.updatedAt?.toDate().toISOString(),
  };
}
