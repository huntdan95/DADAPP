import { getFunctions, httpsCallable } from 'firebase/functions';
import { getFirebaseApp } from '@/lib/firebase';

export interface StockingScrapeResult {
  source: string;
  added: number;
  total: number;
  error?: string;
}

/**
 * Per-source diagnostic the orchestrator emits so the user can see
 * what each state-DNR page actually returned. Kept in sync with
 * `functions/src/scrapers/stocking/types.ts → StockingScrapeDiagnostic`.
 */
export interface StockingScrapeDiagnostic {
  source: string;
  status: 'ok' | 'empty' | 'fetch_failed' | 'parse_failed' | 'stub';
  url: string;
  httpStatus?: number;
  bodySnippet?: string;
  message?: string;
}

export interface StockingScrapeResponse {
  results: StockingScrapeResult[];
  /**
   * Per-source diagnostics. Added 2026-05; older deploys may omit
   * this — guard with `?? []` at the call site.
   */
  diagnostics?: StockingScrapeDiagnostic[];
  ranAt: number;
}

export async function triggerStockingScrape(): Promise<StockingScrapeResponse> {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not configured');
  const functions = getFunctions(app, 'us-central1');
  const fn = httpsCallable<unknown, StockingScrapeResponse>(
    functions,
    'triggerStockingScrape'
  );
  const res = await fn({});
  return res.data;
}
