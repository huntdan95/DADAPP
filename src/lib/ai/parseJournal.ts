import { callable } from './client';
import type { FishingMethod } from '@/lib/journal/types';

export interface ParsedCatch {
  species: string;
  length_inches?: number;
  weight_oz?: number;
  method: FishingMethod;
  fly_or_lure: string;
  trolling_depth_ft?: number;
  trolling_speed_mph?: number;
  released_or_kept: 'released' | 'kept';
  notes?: string;
}

export const parseJournal = callable<
  { text: string; locationName?: string },
  { catch: ParsedCatch }
>('parseJournal');
