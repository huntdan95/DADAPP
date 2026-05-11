import { onSchedule } from 'firebase-functions/v2/scheduler';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import { FieldValue, getFirestore, Timestamp } from 'firebase-admin/firestore';
import { deriveStockingId, type StockingDoc, type StockingScrapeRecord, type StockingSource } from './types';
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

async function runAll(): Promise<
  Array<{ source: StockingSource; added: number; total: number; error?: string }>
> {
  const db = getFirestore();
  const results: Array<{
    source: StockingSource;
    added: number;
    total: number;
    error?: string;
  }> = [];

  for (const { source, run } of SCRAPERS) {
    try {
      const records = await run();
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
    } catch (e) {
      logger.error('stocking.scrape.failed', { source, error: String(e) });
      results.push({ source, added: 0, total: 0, error: String(e) });
    }
  }

  // Prune events older than 60 days to keep the collection bounded.
  // Manual entries are kept for full retention (source !== auto sources).
  await pruneOldAutoEvents().catch((e) =>
    logger.error('stocking.prune.failed', { error: String(e) })
  );

  return results;
}

async function pruneOldAutoEvents(): Promise<void> {
  const cutoff = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
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
  },
  async () => {
    const results = await runAll();
    logger.info('stocking.scrape.summary', { results });
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
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Must be signed in');
    }
    const results = await runAll();
    return { results, ranAt: Timestamp.now().toMillis() };
  }
);
