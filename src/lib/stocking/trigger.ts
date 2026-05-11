import { getFunctions, httpsCallable } from 'firebase/functions';
import { getFirebaseApp } from '@/lib/firebase';

export interface StockingScrapeResult {
  source: string;
  added: number;
  total: number;
  error?: string;
}

export async function triggerStockingScrape(): Promise<{
  results: StockingScrapeResult[];
  ranAt: number;
}> {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not configured');
  const functions = getFunctions(app, 'us-central1');
  const fn = httpsCallable<unknown, { results: StockingScrapeResult[]; ranAt: number }>(
    functions,
    'triggerStockingScrape'
  );
  const res = await fn({});
  return res.data;
}
