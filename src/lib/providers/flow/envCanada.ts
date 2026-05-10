import type { FlowReading } from '../types';

// TODO: Implement when first Canadian water is added. Pattern: hit
// https://api.weather.gc.ca/collections/hydrometric-realtime
// for the given stationId, parse latest discharge + water level.
export async function envCanadaFetchFlow(_stationId: string): Promise<FlowReading> {
  throw new Error('env-canada flow provider not yet implemented');
}
