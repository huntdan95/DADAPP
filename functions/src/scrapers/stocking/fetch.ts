/**
 * Shared HTML fetcher for stocking scrapers. Sets a browser-like
 * User-Agent (state DNR sites — SharePoint in particular — sometimes
 * 403 obvious bot UAs) and times out aggressively so a hung page
 * doesn't kill the whole batch.
 *
 * Also includes a fallback retry with a different UA on 403 / 406 so
 * a single picky CDN doesn't kill the scrape entirely.
 */

// A real Chrome-on-macOS UA. Honest in spirit (the actual crawler is
// our Cloud Function) but state DNR firewalls treat this like any
// normal visitor request, which is the behavior we want.
const PRIMARY_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const FALLBACK_UA =
  'fishing-dads-copilot/0.1 (https://github.com/huntdan95/DADAPP; stocking-aggregator)';

const ACCEPT =
  'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';

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
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} fetching ${url}`);
    }
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}
