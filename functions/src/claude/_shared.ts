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
  briefing: 'claude-sonnet-4-6',
  parseJournal: 'claude-haiku-4-5',
  patterns: 'claude-sonnet-4-6',
  // Vision identification — bumped to Opus 4.7 after a channel-catfish was
  // misidentified as a smallmouth bass on Sonnet 4.6. Opus is markedly
  // stronger at fine-grained visual differentiation; combined with
  // adaptive thinking and a feature-checklist prompt it should rarely
  // confuse families. The legacy `identifySpecies` key still points to
  // Sonnet for any older code paths; new vision calls use `analyzePhoto`.
  identifySpecies: 'claude-sonnet-4-6',
  analyzePhoto: 'claude-opus-4-7',
} as const;

/**
 * Daily caps per user. Total daily budget back-of-envelope:
 *   briefings × locations:   5 × ~$0.005 = $0.025
 *   parseJournal:           20 × ~$0.001 = $0.020
 *   patterns:               10 × ~$0.012 = $0.120
 *   identifySpecies:        10 × ~$0.006 = $0.060
 *   per-user ceiling per day:               ~$0.23
 * With ~6 users × 30 days  =  ~$41/month worst-case. Realistic usage will
 * be far lower; tune these once we have real data.
 */
export const DAILY_CAPS = {
  briefing: 5,
  parseJournal: 20,
  patterns: 10,
  identifySpecies: 10,
} as const;

export type AiFeature = keyof typeof DAILY_CAPS;

function db() {
  return getFirestore();
}

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Enforces the per-user daily call cap for a given feature. Atomically
 * increments the call count via Firestore transaction so concurrent calls
 * don't slip past the cap. Throws an HttpsError when the cap is exceeded.
 */
export async function checkAndIncrementUsage(
  uid: string,
  feature: AiFeature
): Promise<void> {
  const cap = DAILY_CAPS[feature];
  const docRef = db().doc(`aiUsage/${uid}/days/${todayUtc()}`);

  await db().runTransaction(async (tx) => {
    const snap = await tx.get(docRef);
    const current = (snap.data()?.[feature]?.calls as number | undefined) ?? 0;
    if (current >= cap) {
      throw new HttpsError(
        'resource-exhausted',
        `Daily ${feature} cap reached (${cap}). Try again tomorrow.`
      );
    }
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
