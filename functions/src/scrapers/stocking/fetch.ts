/**
 * Shared HTML fetcher for stocking scrapers. Sets a browser-like
 * User-Agent (state DNR sites — SharePoint in particular — sometimes
 * 403 obvious bot UAs) and times out aggressively so a hung page
 * doesn't kill the whole batch.
 *
 * Also includes a fallback retry with a different UA on 403 / 406 so
 * a single picky CDN doesn't kill the scrape entirely.
 *
 * Diagnostic trace: every fetch (success or fail) pushes details into
 * an AsyncLocalStorage context the orchestrator opens around each
 * scraper run. That way we can surface "what did the DNR page
 * actually return?" without touching the 17 per-state scraper files.
 */

import { AsyncLocalStorage } from 'node:async_hooks';

// A real Chrome-on-macOS UA. Honest in spirit (the actual crawler is
// our Cloud Function) but state DNR firewalls treat this like any
// normal visitor request, which is the behavior we want.
const PRIMARY_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const FALLBACK_UA =
  'fishing-dads-copilot/0.1 (https://github.com/huntdan95/DADAPP; stocking-aggregator)';

const ACCEPT =
  'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';

export interface FetchTrace {
  /** URL of the last fetch attempt (success or failure). */
  url?: string;
  /** HTTP status code of the most recent response, if we got one. */
  httpStatus?: number;
  /** First ~240 chars of the response body, regardless of status. */
  bodySnippet?: string;
  /** Error message if the fetch threw (network error, timeout, !ok). */
  errorMessage?: string;
}

const traceStore = new AsyncLocalStorage<{ trace: FetchTrace }>();

/**
 * Run `fn` with a fresh fetch trace context. Any `fetchHtml` calls
 * inside record their last request details into the returned trace.
 * Multiple URL attempts overwrite — the trace reflects the most
 * recent fetch, which is what we want when a scraper hits a primary
 * URL then a fallback.
 */
export async function withFetchTrace<T>(
  fn: () => Promise<T>
): Promise<{ result: T; trace: FetchTrace }> {
  const trace: FetchTrace = {};
  const result = await traceStore.run({ trace }, fn);
  return { result, trace };
}

export async function fetchHtml(
  url: string,
  opts: { timeoutMs?: number } = {}
): Promise<string> {
  const timeoutMs = opts.timeoutMs ?? 20_000;

  // First try with the browser-like UA.
  try {
    return await doFetch(url, PRIMARY_UA, timeoutMs);
  } catch (e) {
    const msg = String(e);
    // Retry once with the honest UA on bot-block-ish errors. A subset
    // of well-configured DNR sites prefer to see a "real" UA string
    // that mentions the project — flipping helps when the WAF logic
    // is inverted.
    if (/HTTP 4(03|06|29)/.test(msg)) {
      return doFetch(url, FALLBACK_UA, timeoutMs);
    }
    throw e;
  }
}

async function doFetch(
  url: string,
  ua: string,
  timeoutMs: number
): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const trace = traceStore.getStore()?.trace;
  if (trace) trace.url = url;
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': ua,
        Accept: ACCEPT,
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: controller.signal,
    });
    if (trace) trace.httpStatus = res.status;
    const body = await res.text();
    if (trace) {
      trace.bodySnippet = body
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 240);
    }
    if (!res.ok) {
      const err = `HTTP ${res.status} fetching ${url}`;
      if (trace) trace.errorMessage = err;
      throw new Error(err);
    }
    return body;
  } catch (e) {
    if (trace && !trace.errorMessage) {
      trace.errorMessage = String((e as Error)?.message ?? e);
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}
