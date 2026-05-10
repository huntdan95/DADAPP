import type Anthropic from '@anthropic-ai/sdk';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import { getFirestore } from 'firebase-admin/firestore';
import {
  anthropic,
  anthropicApiKey,
  checkAndIncrementUsage,
  MODELS,
  recordTokens,
  requireAuth,
} from './_shared';

/**
 * Natural-language Q&A over the user's catch history.
 *
 * Caching strategy: we serialize the user's entire catch corpus (which
 * is bounded — small group app, ≤ a few thousand catches per user even
 * after years) into a stable block placed BEFORE the question. With a
 * cache breakpoint on that block, follow-up questions in the same chat
 * session read from cache. The first question of a fresh chat pays the
 * write premium; everything after is cheap.
 *
 * Adaptive thinking is enabled — Sonnet 4.6 figures out when the
 * question warrants reasoning vs a quick answer.
 */

interface PatternsInput {
  question: string;
  /** Optional prior turns for follow-up Qs in the same chat. */
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

interface LogRecord {
  kind: 'catch' | 'hatch' | 'note';
  species?: string;
  lengthInches?: number;
  method?: string;
  flyOrLure?: string;
  trollingDepthFt?: number;
  trollingSpeedMph?: number;
  releasedOrKept?: string;
  hatchName?: string;
  hatchStage?: string;
  time: string;
  notes?: string;
  conditions?: {
    airTempF?: number;
    waterTempF?: number;
    flowCfs?: number;
    pressureMb?: number;
    pressureTrend?: string;
    moonPhase?: number;
  };
  flowReading?: {
    siteName?: string;
    flowCfs?: number;
    waterTempF?: number;
  };
  locationId?: string;
  locationName?: string;
}

const SYSTEM_PROMPT = `You answer questions about a user's personal fishing log.

Style: direct, friendly, data-driven. Cite the numbers. Don't editorialize.

Capabilities:
- Slice catches by species, method (fly/cast/troll/jig), fly or lure, location, time of day, season, water temp, pressure trend, dam status, moon phase, trolling depth/speed.
- Surface real patterns from the data; flag them as patterns only when there are ≥3 supporting catches.
- For "what should I do next time" questions, ground recommendations in this specific user's history, not generic fishing advice.

Guardrails:
- If the data doesn't support an answer, say so plainly. Don't invent.
- "Most" or "best" claims need at least 3 supporting catches; otherwise hedge ("the few times you've...").
- Numeric answers should include the count of supporting catches in parentheses ("2.4 mph (n=7)").
- Keep responses short by default — 2-4 sentences unless the question explicitly asks for more.
- Never produce a table unless the user asks for one.`;

export const patterns = onCall(
  {
    region: 'us-central1',
    memory: '512MiB',
    timeoutSeconds: 60,
    secrets: [anthropicApiKey],
  },
  async (request) => {
    const uid = requireAuth(request.auth?.uid);
    const input = request.data as PatternsInput;

    if (!input?.question || input.question.trim().length < 2) {
      throw new HttpsError('invalid-argument', 'question required');
    }

    await checkAndIncrementUsage(uid, 'patterns');

    const logs = await fetchUserLogs(uid);
    if (logs.length === 0) {
      return {
        answer:
          "I don't have any log entries yet — log a few catches or hatches and I'll start spotting patterns.",
      };
    }

    const corpus = formatLogs(logs);

    // History is replayed verbatim so multi-turn follow-ups stay coherent.
    const priorTurns = (input.history ?? []).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const response = await anthropic().messages.create({
      model: MODELS.patterns,
      max_tokens: 800,
      thinking: { type: 'adaptive' },
      system: [
        { type: 'text', text: SYSTEM_PROMPT },
        {
          type: 'text',
          text: `USER'S LOG HISTORY (${logs.length} entries, newest last):\n\n${corpus}`,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        ...priorTurns,
        { role: 'user', content: input.question },
      ],
    });

    await recordTokens(uid, 'patterns', response.usage);

    const answer = response.content
      .filter((b): b is Anthropic.Messages.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim();

    logger.info('patterns answered', {
      uid,
      logs: logs.length,
      input_tokens: response.usage.input_tokens,
      cache_read: response.usage.cache_read_input_tokens,
    });

    return { answer };
  }
);

async function fetchUserLogs(uid: string): Promise<LogRecord[]> {
  // Read directly from users/{uid}/logs — no collectionGroup needed since
  // the path is already per-user. Cap at 1000; for power users we'll add
  // smarter retrieval (relevance ranking + window) later.
  const db = getFirestore();
  const snap = await db
    .collection('users')
    .doc(uid)
    .collection('logs')
    .orderBy('time', 'asc')
    .limit(1000)
    .get();
  return snap.docs.map((d) => d.data() as LogRecord);
}

function formatLogs(entries: LogRecord[]): string {
  return entries
    .map((e, i) => {
      const time = e.time?.slice(0, 16).replace('T', ' ') ?? '?';
      const loc = e.locationName ?? e.locationId ?? '?';
      const water = e.flowReading?.waterTempF ?? e.conditions?.waterTempF;
      const flow = e.flowReading?.flowCfs ?? e.conditions?.flowCfs;
      const cond = e.conditions
        ? ` air=${fmt(e.conditions.airTempF)}°F water=${fmt(water)}°F flow=${fmt(flow)}cfs press=${fmt(e.conditions.pressureMb)}mb ${e.conditions.pressureTrend ?? ''} moon=${fmt(e.conditions.moonPhase)}`
        : '';

      if (e.kind === 'catch') {
        const len = e.lengthInches != null ? `${e.lengthInches}"` : '';
        const troll =
          e.method === 'troll'
            ? ` depth=${e.trollingDepthFt ?? '?'}ft speed=${e.trollingSpeedMph ?? '?'}mph`
            : '';
        return `${i + 1}. ${time} CATCH ${e.species ?? '?'} ${len} via ${e.method ?? '?'} on "${e.flyOrLure ?? '?'}"${troll} (${e.releasedOrKept ?? '?'}) @ ${loc}${cond}${e.notes ? `  // ${e.notes}` : ''}`;
      }
      if (e.kind === 'hatch') {
        return `${i + 1}. ${time} HATCH ${e.hatchName ?? '?'}${e.hatchStage ? ` ${e.hatchStage}` : ''} @ ${loc}${cond}${e.notes ? `  // ${e.notes}` : ''}`;
      }
      return `${i + 1}. ${time} NOTE @ ${loc}${cond} // ${e.notes ?? ''}`;
    })
    .join('\n');
}

function fmt(n: number | undefined): string {
  if (n == null || Number.isNaN(n)) return '?';
  return String(Math.round(n * 10) / 10);
}
