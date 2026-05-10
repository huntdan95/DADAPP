import { callable } from './client';

export interface IdentifyResult {
  species: string;
  confidence: 'high' | 'medium' | 'low';
  estimatedLengthInches: number | null;
  notes: string;
}

export const identifySpecies = callable<
  { imageUrl: string; hintLengthInches?: number; hintLocation?: string },
  IdentifyResult
>('identifySpecies');
