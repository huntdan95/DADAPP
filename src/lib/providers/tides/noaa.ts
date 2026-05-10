import type { TidesReading } from '../types';

// TODO: Implement when first saltwater location is added.
// Endpoint: https://api.tidesandcurrents.noaa.gov/api/prod/datagetter
export async function noaaFetchTides(_stationId: string): Promise<TidesReading> {
  throw new Error('noaa tides provider not yet implemented');
}
