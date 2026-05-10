import type { FlowReading } from '../types';

// TODO: Implement when first UK water is added. Pattern: hit
// https://environment.data.gov.uk/flood-monitoring/id/stations/{stationRef}
// for the given stationRef.
export async function ukEaFetchFlow(_stationRef: string): Promise<FlowReading> {
  throw new Error('uk-ea flow provider not yet implemented');
}
