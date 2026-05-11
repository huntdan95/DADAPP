import { onSchedule } from 'firebase-functions/v2/scheduler';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import { FieldValue, getFirestore, Timestamp } from 'firebase-admin/firestore';
import {
  deriveStockingId,
  type StockingDoc,
  type StockingScrapeDiagnostic,
  type StockingScrapeRecord,
  type StockingSource,
} from './types';
import { withFetchTrace } from './fetch';
import { aiExtractStocking } from './aiExtract';
import { FOCUS_WATERS } from './focusWaters';
import { anthropicApiKey } from '../../claude/_shared';
import { scrape as scrapeTwra } from './twra';
import { scrape as scrapeGa } from './gaDnr';
import { scrape as scrapeNc } from './ncWrc';
import { scrape as scrapeMi } from './miDnr';
import { scrape as scrapeIn } from './inDnr';
import { scrape as scrapeFwc } from './fwc';
import { scrape as scrapeAl } from './alDcnr';
import { scrape as scrapeKy } from './kyDfwr';
import { scrape as scrapePa } from './paFbc';
import { scrape as scrapeMt } from './mtFwp';
import { scrape as scrapeIdF } from './idFg';
import { scrape as scrapeCo } from './coCpw';
import { scrape as scrapeUt } from './utDwr';
import { scrape as scrapeAr } from './arAgfc';
import { scrape as scrapeOk } from './okOdwc';
import { scrape as scrapeMs } from './msMdwfp';
import { scrape as scrapeIl } from './ilDnr';

/**
 * Orchestrator for state-DNR stocking scrapers.
 *
 * - Runs each per-state module
 * - Stable-ids each record so re-scrapes don't double-write
 * - Persists to `stockingEvents/{id}` (same path the manual reports use)
 *
 * Failure in one state's scraper is logged and isolated — the rest of
 * the batch continues. Each scraper module is responsible for its own
 * HTTP timeout + HTML parsing brittleness.
 */

const SCRAPERS: Array<{
  source: StockingSource;
  run: () => Promise<StockingScrapeRecord[]>;
}> = [
  { source: 'twra', run: scrapeTwra },
  { source: 'ga-dnr', run: scrapeGa },
  { source: 'nc-wrc', run: scrapeNc },
  { source: 'mi-dnr', run: scrapeMi },
  { source: 'in-dnr', run: scrapeIn },
  { source: 'fwc', run: scrapeFwc },
  { source: 'al-dcnr', run: scrapeAl },
  { source: 'ky-dfwr', run: scrapeKy },
  { source: 'pa-fbc', run: scrapePa },
  { source: 'mt-fwp', run: scrapeMt },
  { source: 'id-fg', run: scrapeIdF },
  { source: 'co-cpw', run: scrapeCo },
  { source: 'ut-dwr', run: scrapeUt },
  { source: 'ar-agfc', run: scrapeAr },
  { source: 'ok-odwc', run: scrapeOk },
  { source: 'ms-mdwfp', run: scrapeMs },
  { source: 'il-dnr', run: scrapeIl },
];

/**
 * Per-source classification: pure stubs we know don't fetch anything,
 * tagged so the diagnostic shows 'stub' instead of 'empty' (which would
 * imply the scraper tried and failed to find rows).
 */
const STUB_SOURCES: ReadonlySet<StockingSource> = new Set([
  'in-dnr',
  'fwc',
  'al-dcnr',
]);

/**
 * Per-source direct PDF URLs. When provided, the AI extractor
 * downloads the PDF and attaches it to Claude's message as a
 * document block — way more reliable than asking Claude to find
 * and parse the same PDF via web_search.
 *
 * Add a new entry when a state DNR publishes its stocking data as a
 * stable, single-URL PDF (e.g., GA's Weekly_Stocking_Report.pdf).
 */
const SOURCE_PDF_URLS: Partial<Record<StockingSource, string>> = {
  'ga-dnr':
    'https://georgiawildlife.com/sites/default/files/wrd/pdf/trout/Weekly_Stocking_Report.pdf',
};

/**
 * Map source code → USPS state for AI-extraction fallback. When the
 * HTML scraper returns 0 records, the orchestrator falls through to
 * Claude w/ web_search using the matching state name. Stub sources
 * also fall through (they were stubs precisely because HTML scraping
 * was too brittle).
 */
const SOURCE_TO_STATE: Record<StockingSource, string> = {
  twra: 'TN',
  'ga-dnr': 'GA',
  'nc-wrc': 'NC',
  'mi-dnr': 'MI',
  'in-dnr': 'IN',
  fwc: 'FL',
  'al-dcnr': 'AL',
  'ky-dfwr': 'KY',
  'pa-fbc': 'PA',
  'mt-fwp': 'MT',
  'id-fg': 'ID',
  'co-cpw': 'CO',
  'ut-dwr': 'UT',
  'ar-agfc': 'AR',
  'ok-odwc': 'OK',
  'ms-mdwfp': 'MS',
  'il-dnr': 'IL',
};

interface ScraperResult {
  source: StockingSource;
  added: number;
  total: number;
  error?: string;
}

async function runAll(): Promise<{
  results: ScraperResult[];
  diagnostics: StockingScrapeDiagnostic[];
}> {
  const db = getFirestore();
  const results: ScraperResult[] = [];
  const diagnostics: StockingScrapeDiagnostic[] = [];

  for (const { source, run } of SCRAPERS) {
    let records: StockingScrapeRecord[] = [];
    let runError: string | undefined;
    let trace: Awaited<ReturnType<typeof withFetchTrace>>['trace'] = {};

    try {
      const wrapped = await withFetchTrace(() => run());
      records = wrapped.result;
      trace = wrapped.trace;
    } catch (e) {
      runError = String(e);
      logger.error('stocking.scrape.failed', { source, error: runError });
    }

    // Build the user-facing diagnostic. Order matters:
    //   stub        → known no-op scraper
    //   fetch_failed → fetch threw / non-2xx
    //   parse_failed → fetched OK but 0 rows
    //   ok          → at least 1 record parsed
    //   empty       → catch-all (e.g., no fetch happened, no error)
    let status: StockingScrapeDiagnostic['status'];
    let message: string | undefined;
    if (STUB_SOURCES.has(source)) {
      status = 'stub';
      message = 'No live scraper for this source yet.';
    } else if (runError) {
      status = 'fetch_failed';
      message = runError;
    } else if (records.length === 0 && trace.httpStatus && trace.httpStatus >= 400) {
      status = 'fetch_failed';
      message = trace.errorMessage ?? `HTTP ${trace.httpStatus}`;
    } else if (records.length === 0 && trace.url) {
      status = 'parse_failed';
      message =
        'Page fetched but the parser found 0 rows — likely a layout change or JS-rendered content.';
    } else if (records.length === 0) {
      status = 'empty';
      message = 'Scraper returned 0 records and made no HTTP request.';
    } else {
      status = 'ok';
    }

    diagnostics.push(
      stripUndefined({
        source,
        status,
        url: trace.url ?? '',
        httpStatus: trace.httpStatus,
        bodySnippet: trace.bodySnippet,
        message,
      }) as StockingScrapeDiagnostic
    );

    if (runError) {
      results.push({ source, added: 0, total: 0, error: runError });
      continue;
    }

    // AI fallback: if the HTML scraper returned 0 records, ask
    // Claude w/ web_search to find recent stocking events for the
    // state. Costs ~$0.05 per state per run; we cap that by
    // checking Firestore for recent events FROM THIS SAME SOURCE
    // before spending tokens. If we have fresh data (<7 days old)
    // we skip Claude entirely and rely on the existing records.
    if (records.length === 0) {
      const state = SOURCE_TO_STATE[source];
      if (state) {
        const recentCount = await countRecentEventsForSource(source, 7);
        if (recentCount > 0) {
          logger.info('stocking.ai.skipped_recent', {
            source,
            state,
            recentCount,
            reason: 'Recent AI-extracted events already in Firestore — skipping Claude call to save tokens.',
          });
          const idx = diagnostics.findIndex((d) => d.source === source);
          if (idx >= 0) {
            diagnostics[idx] = {
              ...diagnostics[idx],
              status: 'ok',
              message: `Using ${recentCount} cached events from the last 7 days (Claude skipped to save tokens).`,
            };
          }
        } else {
          const focusWaters = FOCUS_WATERS[state];
          const directPdfUrl = SOURCE_PDF_URLS[source];
          logger.info('stocking.ai.fallback', {
            source,
            state,
            focusWaterCount: focusWaters?.length ?? 0,
            directPdfUrl: directPdfUrl ?? null,
          });
          try {
            const ai = await aiExtractStocking({
              state,
              source,
              lookbackDays: 90,
              focusWaters,
              directPdfUrl,
            });
            if (ai.events.length > 0) {
              records = ai.events;
              const idx = diagnostics.findIndex((d) => d.source === source);
              if (idx >= 0) {
                diagnostics[idx] = {
                  ...diagnostics[idx],
                  status: 'ok',
                  message: `AI-extracted ${ai.events.length} events via web search (focused on ${focusWaters?.length ?? 0} named waters).`,
                };
              }
            }
          } catch (e) {
            logger.error('stocking.ai.fallback_failed', {
              source,
              state,
              error: String(e),
            });
          }
        }
      }
    }

    let added = 0;
    let skipped = 0;

    // Sample logging: dump the first parsed record so we can verify
    // the parser is reading the right page after a deploy. The
    // record itself is small (no html blob).
    if (records.length > 0) {
      logger.info('stocking.scrape.sample', {
        source,
        sample: records[0],
        totalParsed: records.length,
      });
    } else {
      logger.warn('stocking.scrape.empty', {
        source,
        url: trace.url,
        httpStatus: trace.httpStatus,
        bodySnippet: trace.bodySnippet,
        hint:
          'Parser returned 0 records. Either the source page has no current entries or the layout changed and selectors need tuning.',
      });
    }

    // Batch writes for efficiency; only set docs that don't already
    // exist so re-runs don't churn createdAt timestamps.
    const chunked: StockingScrapeRecord[][] = [];
    for (let i = 0; i < records.length; i += 400) {
      chunked.push(records.slice(i, i + 400));
    }
    for (const chunk of chunked) {
      const batch = db.batch();
      for (const rec of chunk) {
        const id = deriveStockingId(source, rec);
        const ref = db.collection('stockingEvents').doc(id);
        const existing = await ref.get();
        if (existing.exists) {
          skipped++;
          continue;
        }
        const doc: Omit<StockingDoc, 'createdAt'> & {
          createdAt: FirebaseFirestore.FieldValue;
        } = stripUndefined({
          id,
          date: rec.date,
          locationName: rec.locationName,
          state: rec.state,
          species: rec.species,
          count: rec.count,
          size: rec.size,
          lat: rec.lat,
          lng: rec.lng,
          notes: rec.notes,
          source,
          createdAt: FieldValue.serverTimestamp(),
        });
        batch.set(ref, doc);
        added++;
      }
      await batch.commit();
    }

    results.push({ source, added, total: records.length });
    logger.info('stocking.scrape.complete', {
      source,
      added,
      skipped,
      total: records.length,
    });
  }

  // Prune events older than 60 days to keep the collection bounded.
  // Manual entries are kept for full retention (source !== auto sources).
  await pruneOldAutoEvents().catch((e) =>
    logger.error('stocking.prune.failed', { error: String(e) })
  );

  return { results, diagnostics };
}

async function pruneOldAutoEvents(): Promise<void> {
  // Keep 400 days of history so the StockingBanner's "most recent in
  // the last 365 days" fallback always has data to fall back to.
  // Previously we pruned at 60 days, which silently removed last
  // year's spring + fall stockings before the user could see them
  // ahead of a return trip.
  const cutoff = new Date(Date.now() - 400 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const db = getFirestore();
  const autoSources: StockingSource[] = [
    'twra',
    'ga-dnr',
    'nc-wrc',
    'mi-dnr',
    'in-dnr',
    'fwc',
    'al-dcnr',
    'ky-dfwr',
    'pa-fbc',
    'mt-fwp',
    'id-fg',
    'co-cpw',
    'ut-dwr',
    'ar-agfc',
    'ok-odwc',
    'ms-mdwfp',
    'il-dnr',
  ];
  for (const src of autoSources) {
    const snap = await db
      .collection('stockingEvents')
      .where('source', '==', src)
      .where('date', '<', cutoff)
      .limit(400)
      .get();
    if (snap.empty) continue;
    const batch = db.batch();
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  }
}

function stripUndefined<T extends Record<string, unknown>>(value: T): T {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value)) {
    if (v !== undefined) out[k] = v;
  }
  return out as T;
}

/**
 * Counts stocking events from `source` whose `createdAt` is within
 * the last `daysFresh` days. Used by the AI-fallback gate so we
 * skip the (~$0.05) Claude call when we already have recent data
 * — typical pattern: weekly cron writes events on Monday, manual
 * refresh on Tuesday reads the cache instead of re-spending tokens.
 *
 * NOTE: we filter by `source` rather than `state` because TWRA in
 * TN, FWC in FL, etc. are state-specific. One Firestore query per
 * source per run is cheap.
 */
async function countRecentEventsForSource(
  source: StockingSource,
  daysFresh: number
): Promise<number> {
  const db = getFirestore();
  const cutoffMs = Date.now() - daysFresh * 24 * 60 * 60 * 1000;
  const cutoff = Timestamp.fromMillis(cutoffMs);
  try {
    const snap = await db
      .collection('stockingEvents')
      .where('source', '==', source)
      .where('createdAt', '>=', cutoff)
      .limit(1)
      .get();
    // We don't need an exact count — just whether anything fresh
    // exists. Bail out at 1 to avoid a full-collection scan.
    return snap.size;
  } catch (e) {
    logger.warn('stocking.countRecent.failed', {
      source,
      error: String(e),
    });
    // Fail-open: if we can't query, let the Claude call proceed.
    return 0;
  }
}

/**
 * Weekly cron — runs early Monday morning ET so the schedule is fresh
 * for the angling weekend. Each state DNR refreshes on different days,
 * so we eat a few stale records from each — that's fine for the
 * intended use ("did Caney get hit this week?").
 */
export const scrapeStocking = onSchedule(
  {
    schedule: '0 5 * * MON',
    timeZone: 'America/New_York',
    region: 'us-central1',
    memory: '512MiB',
    timeoutSeconds: 540,
    // Anthropic key is needed for the AI-extraction fallback that
    // fires when an HTML scraper returns 0 records.
    secrets: [anthropicApiKey],
  },
  async () => {
    const { results, diagnostics } = await runAll();
    logger.info('stocking.scrape.summary', { results, diagnostics });
  }
);

/**
 * Callable — manual trigger so a user can poke a refresh from the
 * client (admin-style page or "refresh" button) and see results.
 * Same orchestration logic; just returns a JSON summary.
 */
export const triggerStockingScrape = onCall(
  {
    region: 'us-central1',
    memory: '512MiB',
    timeoutSeconds: 540,
    invoker: 'public',
    secrets: [anthropicApiKey],
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Must be signed in');
    }
    const { results, diagnostics } = await runAll();
    return {
      results,
      diagnostics,
      ranAt: Timestamp.now().toMillis(),
    };
  }
);
