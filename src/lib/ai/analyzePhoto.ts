import { callable } from './client';
import type { HatchStage } from '@/lib/log/types';

export interface AnalyzePhotoResult {
  kind: 'fish' | 'insect' | 'other';
  confidence: 'high' | 'medium' | 'low';
  // fish
  species?: string;
  estimated_length_inches?: number | null;
  // insect
  insect_name?: string;
  insect_stage?: HatchStage;
  // common
  notes: string;
}

export const analyzePhoto = callable<
  { imageUrl: string; hintLocation?: string; hintLengthInches?: number },
  AnalyzePhotoResult
>('analyzePhoto');
