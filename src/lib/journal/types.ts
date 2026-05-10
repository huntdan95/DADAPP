import type { PressureTrend } from '@/lib/providers/types';

/**
 * Method of fishing for a given catch. Trolling unlocks additional
 * fields (depth, speed) that don't apply to other methods.
 */
export type FishingMethod = 'fly' | 'cast' | 'troll' | 'jig' | 'other';

export const FISHING_METHODS: ReadonlyArray<{
  value: FishingMethod;
  label: string;
}> = [
  { value: 'fly', label: 'Fly' },
  { value: 'cast', label: 'Spin / Cast' },
  { value: 'troll', label: 'Troll' },
  { value: 'jig', label: 'Jig' },
  { value: 'other', label: 'Other' },
];

export interface ConditionsSnapshot {
  airTempF: number;
  waterTempF?: number;
  flowCfs?: number;
  pressureMb: number;
  pressureTrend: PressureTrend;
  weatherCode: number;
  cloudCoverPct?: number;
  windMph?: number;
  moonPhase: number;
  moonIllumination: number;
  damStatus?: 'no_generation' | 'partial' | 'full';
  tideStage?: 'incoming' | 'outgoing' | 'high' | 'low';
}

export interface Trip {
  id: string;
  date: string;             // YYYY-MM-DD in the location's tz
  locationIds: string[];
  startTime: string;        // ISO
  endTime?: string;         // ISO; undefined while active
  weatherSummary?: string;
  notes?: string;
  photoUrls: string[];
  createdAt: string;
}

export interface Catch {
  id: string;
  tripId: string;
  /** Stamped by the store so collectionGroup queries can scope to owner. */
  userId?: string;
  locationId: string;
  species: string;
  lengthInches?: number;
  weightOz?: number;

  method: FishingMethod;
  flyOrLure: string;

  // Trolling-specific. Required when method === 'troll'; ignored otherwise.
  trollingDepthFt?: number;
  trollingSpeedMph?: number;

  releasedOrKept: 'released' | 'kept';
  time: string;             // ISO
  gps?: { lat: number; lng: number };
  notes?: string;
  photoUrl?: string;

  conditions: ConditionsSnapshot;
}
