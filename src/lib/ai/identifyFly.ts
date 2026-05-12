import { callable } from './client';

export type FlyCategory =
  | 'streamer'
  | 'dry'
  | 'nymph'
  | 'terrestrial'
  | 'egg'
  | 'popper'
  | 'wet'
  | 'other';

export type InsectOrder =
  | 'mayfly'
  | 'caddis'
  | 'stonefly'
  | 'midge'
  | 'terrestrial'
  | 'unknown';

export type InsectStage =
  | 'adult'
  | 'dun'
  | 'spinner'
  | 'emerger'
  | 'nymph'
  | 'larva'
  | 'pupa'
  | 'unknown';

export interface IdentifyFlyResult {
  kind: 'tied-fly' | 'insect' | 'other';
  confidence: 'high' | 'medium' | 'low';
  // Tied fly
  fly_name?: string;
  fly_category?: FlyCategory;
  color?: string;
  estimated_size?: string | null;
  // Natural insect
  insect_name?: string;
  insect_order?: InsectOrder;
  insect_stage?: InsectStage;
  // Always present
  notes: string;
}

/**
 * Vision: identify a fly (tied artificial) OR a bug (natural insect)
 * from a photo. Same tiered Haiku → Opus flow as `analyzePhoto`, and
 * shares the same daily cap bucket on the backend.
 */
export const identifyFly = callable<
  { imageUrl: string; hintLocation?: string },
  IdentifyFlyResult
>('identifyFly');
