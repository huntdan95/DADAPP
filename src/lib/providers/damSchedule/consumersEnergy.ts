import type { DamScheduleReading } from '../types';

// TODO: Implement when needed for Tippy/Hodenpyl. Note: in practice the USGS
// gauge below Tippy (04125550) is the actionable downstream signal, so this
// scraper is low priority until dad asks for it.
export async function consumersEnergyFetchSchedule(
  _dam: string
): Promise<DamScheduleReading> {
  throw new Error('consumers-energy dam schedule provider not yet implemented');
}
