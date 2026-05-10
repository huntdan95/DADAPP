import { callable } from './client';

export interface PatternsHistoryTurn {
  role: 'user' | 'assistant';
  content: string;
}

export const askPatterns = callable<
  { question: string; history?: PatternsHistoryTurn[] },
  { answer: string }
>('patterns');
