import type { LakeReading } from '../types';
import { estimateWaterTemp } from '../waterTemp/estimator';

/**
 * LakeReading-shaped wrapper around the shared water-temp estimator.
 * The full model + calibration logic lives in
 * `src/lib/providers/waterTemp/estimator.ts` so river spots whose
 * USGS gauge lacks a thermistor pull from the same code path. This
 * file is just the adapter that wraps the estimator output into
 * the LakeReading interface the lake-data dispatcher expects.
 */

interface EstimatorInput {
  lat: number;
  lng: number;
}

export async function estimatedFetchLake(
  input: EstimatorInput
): Promise<LakeReading> {
  const { lat, lng } = input;
  const result = await estimateWaterTemp(lat, lng);

  return {
    siteName: result.siteName,
    observedAt:
      result.surfaceTempF != null ? new Date().toISOString() : '',
    surfaceTempF: result.surfaceTempF,
    waveHeightFt: null,
    windMph: null,
    authority: 'estimated',
    isEstimated: true,
    notes: result.notes,
  };
}
