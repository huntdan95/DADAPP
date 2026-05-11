/**
 * Shared HTML fetcher for stocking scrapers. Sets a polite User-Agent
 * (state DNR sites occasionally rate-limit default crawler UAs) and
 * times out aggressively so a hung page doesn't kill the whole batch.
 */

const UA =
  'fishing-dads-copilot/0.1 (https://github.com/huntdan95/DADAPP; stocking-aggregator)';

export async function fetchHtml(
  url: string,
  opts: { timeoutMs?: number } = {}
): Promise<string> {
  const controller = new AbortController();
  const timeoutMs = opts.timeoutMs ?? 20_000;
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': UA,
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
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
