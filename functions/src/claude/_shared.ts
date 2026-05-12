import Anthropic from '@anthropic-ai/sdk';
import { defineSecret } from 'firebase-functions/params';
import { HttpsError } from 'firebase-functions/v2/https';
import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';

/**
 * Shared scaffolding for Claude-backed Cloud Functions:
 * - Single Anthropic client (lazy-initialized so secret can be read at call-time).
 * - Per-user daily usage caps to bound the Anthropic spend.
 * - Token-accounting helper that writes back into Firestore for visibility.
 *
 * Set the API key via `firebase functions:secrets:set ANTHROPIC_API_KEY`.
 */

export const anthropicApiKey = defineSecret('ANTHROPIC_API_KEY');

let client: Anthropic | null = null;
export function anthropic(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: anthropicApiKey.value() });
  }
  return client;
}

export const MODELS = {
  // Briefings on Haiku 4.5 — the 3-sentence structured output is well
  // within Haiku's capabilities given the rich context we provide,
  // and Haiku is ~3× cheaper than Sonnet ($1/$5 vs $3/$15 per M).
  // Combined with dropping the web_search tool entirely, this brings
  // per-briefing cost from ~$0.02 down to ~$0.003.
  briefing: 'claude-haiku-4-5',
  parseJournal: 'claude-haiku-4-5',
  // Patterns Q&A keeps Sonnet — the reasoning over journal data
  // benefits from the stronger model and these calls are gated to
  // ~5/day per user.
  patterns: 'claude-sonnet-4-6',
  // Vision identification — tiered approach. analyzePhoto first runs
  // Haiku 4.5 (5× cheaper than Opus); if Haiku returns confidence
  // "low" (ambiguous angle, family-level uncertainty), the same Cloud
  // Function re-runs the same prompt against Opus 4.7 + adaptive
  // thinking + high effort. The user-facing daily cap counts the
  // whole call once regardless of escalation.
  //
  // For ~80% of clearly-shot photos Haiku is sufficient (brown trout
  // vs rainbow vs bluegill is unambiguous), so most calls land at
  // ~$0.005 instead of ~$0.10. Hard cases still get the Opus
  // treatment that fixed the catfish-as-bass misidentification.
  identifySpecies: 'claude-sonnet-4-6',
  analyzePhotoPrimary: 'claude-haiku-4-5',
  analyzePhotoEscalate: 'claude-opus-4-7',
  // Stocking-event extractor. Haiku 4.5 — parsing structured records
  // from a PDF or web page is exactly Haiku's wheelhouse, and the
  // weekly cron hits ~15 states which adds up fast at Sonnet rates.
  stockingExtract: 'claude-haiku-4-5',
} as const;

/**
 * Daily caps per user. Tight budgets after a $50/day cost incident.
 *
 *   briefings (Haiku, no web_search):  5 × ~$0.003 = $0.015
 *   parseJournal (Haiku):              15 × ~$0.001 = $0.015
 *   patterns (Sonnet):                  5 × ~$0.012 = $0.060
 *   identifySpecies (Opus vision):      5 × ~$0.06  = $0.300
 *
 *   per-user worst case:                            ~$0.39 / day
 *   6 users × 30 days =                             ~$70 / month
 *
 * Stocking AI extraction runs once a week via cron, not per-user.
 * That's a separate ~$0.75/week bucket on top.
 */
export const DAILY_CAPS = {
  briefing: 5,
  parseJournal: 15,
  patterns: 5,
  identifySpecies: 5,
} as const;

export type AiFeature = keyof typeof DAILY_CAPS;

/**
 * Shared CORS allowlist for v2 onCall functions.
 *
 * v2 callables advertised as `invoker: 'public'` still need explicit
 * `cors: [...]` on the custom domain (`fishingdads.app`) or the
 * browser's preflight OPTIONS request fails before our function ever
 * runs. Default Firebase Hosting origins cover *.web.app /
 * *.firebaseapp.com but NOT the custom domain.
 *
 * Use this constant on every onCall so a new domain change only
 * requires one edit.
 */
export const CALLABLE_CORS = [
  'https://fishingdads.app',
  'https://www.fishingdads.app',
  'https://dadapp-2cef8.web.app',
  'https://dadapp-2cef8.firebaseapp.com',
  /\.web\.app$/,
  /\.firebaseapp\.com$/,
  'http://localhost:5173',
];

function db() {
  return getFirestore();
}

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Per-user minimum interval between AI calls — guardrail against
 * the "30 debug clicks in a row" scenario that burned $50 in a
 * morning. 4 seconds is invisible during real use (you can't fill
 * a journal entry that fast) but blocks rapid-fire taps.
 *
 * Stored as a tiny Firestore doc per user keyed by feature so it's
 * shared across devices. Cheaper than a Redis instance, accurate
 * enough for the use case.
 */
const COOLDOWN_MS = 4_000;

/**
 * Enforces the per-user daily call cap for a given feature. Atomically
 * increments the call count via Firestore transaction so concurrent calls
 * don't slip past the cap. Throws an HttpsError when the cap is exceeded.
 *
 * Also enforces a 4-second cooldown between AI calls across all
 * features. Same idea — the user is one person clicking buttons,
 * so we shouldn't be servicing >0.25 QPS of AI work.
 */
export async function checkAndIncrementUsage(
  uid: string,
  feature: AiFeature
): Promise<void> {
  const cap = DAILY_CAPS[feature];
  const docRef = db().doc(`aiUsage/${uid}/days/${todayUtc()}`);
  const cooldownRef = db().doc(`aiUsage/${uid}/cooldown/latest`);

  await db().runTransaction(async (tx) => {
    // Cooldown: read most-recent call time across all features and
    // refuse if it was less than COOLDOWN_MS ago. Reads first to
    // satisfy Firestore's read-before-write transaction rule.
    const cooldownSnap = await tx.get(cooldownRef);
    const lastMs = (cooldownSnap.data()?.atMs as number | undefined) ?? 0;
    const sinceLast = Date.now() - lastMs;
    if (lastMs > 0 && sinceLast < COOLDOWN_MS) {
      const waitSec = Math.ceil((COOLDOWN_MS - sinceLast) / 1000);
      throw new HttpsError(
        'resource-exhausted',
        `Slow down — wait ${waitSec}s before another AI call.`
      );
    }

    const snap = await tx.get(docRef);
    const current = (snap.data()?.[feature]?.calls as number | undefined) ?? 0;
    if (current >= cap) {
      throw new HttpsError(
        'resource-exhausted',
        `Daily ${feature} cap reached (${cap}). Try again tomorrow.`
      );
    }

    // Stamp the cooldown for the NEXT call.
    tx.set(cooldownRef, { atMs: Date.now(), feature }, { merge: true });
    tx.set(
      docRef,
      {
        [feature]: { calls: FieldValue.increment(1) },
        updatedAt: Timestamp.now(),
      },
      { merge: true }
    );
  });
}

/**
 * Per-user server-side cooldown for expensive non-AI callables
 * (stocking scrape, boat-launch seeder). The frontend has its own
 * client-side gates, but those are trusted-by-the-client only; a
 * misbehaving client or a re-deployed build with a stale cache can
 * blow past them. This is the defense-in-depth layer.
 *
 * Each cooldown lives at `actionCooldowns/{uid}/actions/{action}`
 * with `{ atMs }`. The cooldown is per-user-per-action so a stocking
 * scrape doesn't block a boat-launch refresh.
 *
 * Throws `resource-exhausted` if invoked within `cooldownMs` of the
 * last successful call. On success it stamps the doc with the new
 * timestamp.
 */
export async function checkAndStampActionCooldown(
  uid: string,
  action: string,
  cooldownMs: number
): Promise<void> {
  const ref = db().doc(`actionCooldowns/${uid}/actions/${action}`);
  await db().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const lastMs = (snap.data()?.atMs as number | undefined) ?? 0;
    const sinceLast = Date.now() - lastMs;
    if (lastMs > 0 && sinceLast < cooldownMs) {
      const waitSec = Math.ceil((cooldownMs - sinceLast) / 1000);
      throw new HttpsError(
        'resource-exhausted',
        `Slow down — wait ${waitSec}s before another ${action}.`
      );
    }
    tx.set(ref, { atMs: Date.now(), action }, { merge: true });
  });
}

/** Records token-usage stats after a successful call. Best-effort; failures are logged but not thrown. */
export async function recordTokens(
  uid: string,
  feature: AiFeature,
  usage: Anthropic.Messages.Usage
): Promise<void> {
  try {
    await db()
      .doc(`aiUsage/${uid}/days/${todayUtc()}`)
      .set(
        {
          [feature]: {
            input: FieldValue.increment(usage.input_tokens ?? 0),
            output: FieldValue.increment(usage.output_tokens ?? 0),
            cacheWrite: FieldValue.increment(
              usage.cache_creation_input_tokens ?? 0
            ),
            cacheRead: FieldValue.increment(
              usage.cache_read_input_tokens ?? 0
            ),
          },
        },
        { merge: true }
      );
  } catch (e) {
    logger.error('recordTokens failed', { feature, error: String(e) });
  }
}

/** Centralized auth-required guard for callable functions. */
export function requireAuth(authUid: string | undefined): string {
  if (!authUid) {
    throw new HttpsError('unauthenticated', 'Must be signed in');
  }
  return authUid;
}
