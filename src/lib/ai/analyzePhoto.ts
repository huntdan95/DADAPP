import { callable } from './client';
import type { HatchStage } from '@/lib/log/types';

export interface AnalyzePhotoResult {
  kind: 'fish' | 'insect' | 'other';
  confidence: 'high' | 'medium' | 'low';
  // fish — chain-of-thought fields force the model to commit to a
  // family + cite specific features BEFORE picking a species. Drives
  // first-pass accuracy and reduces Opus escalations.
  family_identified?: string;
  diagnostic_features_seen?: string[];
  species?: string;
  alternative_species?: string;
  estimated_length_inches?: number | null;
  // insect
  insect_name?: string;
  insect_stage?: HatchStage;
  // common
  notes: string;
}

/**
 * Vision call for fish + insect ID. Pass as many hints as you can —
 * state + water type + river + month are big accuracy boosts because
 * they constrain the candidate species list before the model even
 * looks at the photo. See `functions/src/claude/analyzePhoto.ts` for
 * how the hints are used (STATE PRIORS + family decision tree).
 */
export interface AnalyzePhotoInput {
  imageUrl: string;
  hintLocation?: string;
  /** USPS state code from the saved spot (e.g. "MI", "TN"). */
  hintState?: string;
  /** Water type from the location (tailwater / lake / saltwater / etc.). */
  hintWaterType?: string;
  /** River / body of water name. */
  hintRiver?: string;
  /** Calendar month 1-12 (for seasonal priors — fall salmon, winter sauger). */
  hintMonth?: number;
  hintLengthInches?: number;
}

export const analyzePhoto = callable<AnalyzePhotoInput, AnalyzePhotoResult>(
  'analyzePhoto'
);
