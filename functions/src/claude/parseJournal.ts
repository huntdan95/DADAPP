import type Anthropic from '@anthropic-ai/sdk';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import {
  anthropic,
  anthropicApiKey,
  CALLABLE_CORS,
  checkAndIncrementUsage,
  MODELS,
  recordTokens,
  requireAuth,
} from './_shared';

/**
 * Free text or voice transcript → structured Catch fields.
 *
 * We force tool use with a `log_catch` tool whose input_schema is the
 * exact shape we want back. That way Haiku produces validated JSON in one
 * shot — no string parsing, no schema-recovery prompts.
 *
 * Trolling fields are optional in the schema; the system prompt tells
 * Claude to populate them only when method === "troll".
 */

interface ParseInput {
  text: string;
  locationName?: string;
}

const SYSTEM_PROMPT = `You parse a fishing-trip catch description into structured data. ALWAYS call the log_catch tool — never reply in plain text.

Rules:
- species: full common name in title case ("Brown trout", "Walleye", "Smallmouth bass", "King salmon").
- length_inches: convert from any unit mentioned (cm → in). Omit if not stated.
- weight_oz: convert from pounds/ounces ("1.5 lb" → 24). Omit if not stated.
- method: pick the single best fit. "fly" for any fly-fishing (dry/nymph/streamer). "troll" if they say "trolling", "downrigger", "back-trolling". "jig" for vertical jigging. "cast" for spin/bait casting. "other" only as a fallback.
- fly_or_lure: the actual pattern with size if mentioned ("Size 16 Sulfur emerger", "Stinger spoon orange/silver", "Senko 5\" green-pumpkin").
- trolling_depth_ft: only when method === "troll" AND depth is mentioned.
- trolling_speed_mph: only when method === "troll" AND speed is mentioned.
- released_or_kept: default "released" unless they say they kept it.
- notes: anything material that doesn't fit other fields (location detail within a spot, behavior, hatch info, water condition). Brief.
- time_iso: leave blank — caller stamps it. Do not invent.

If the input is too vague to extract anything (e.g. "caught a fish"), still call the tool with whatever you have and put the input verbatim in notes.`;

export const parseJournal = onCall(
  {
    region: 'us-central1',
    memory: '256MiB',
    timeoutSeconds: 30,
    secrets: [anthropicApiKey],
    invoker: 'public',
    cors: CALLABLE_CORS,
  },
  async (request) => {
    const uid = requireAuth(request.auth?.uid);
    const input = request.data as ParseInput;

    if (!input?.text || input.text.trim().length < 3) {
      throw new HttpsError('invalid-argument', 'text required (min 3 chars)');
    }

    await checkAndIncrementUsage(uid, 'parseJournal');

    const response = await anthropic().messages.create({
      model: MODELS.parseJournal,
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      tools: [
        {
          name: 'log_catch',
          description: 'Record a structured catch entry parsed from the user description.',
          input_schema: {
            type: 'object' as const,
            properties: {
              species: {
                type: 'string',
                description: 'Full common name in title case.',
              },
              length_inches: { type: 'number' },
              weight_oz: { type: 'number' },
              method: {
                type: 'string',
                enum: ['fly', 'cast', 'troll', 'jig', 'other'],
              },
              fly_or_lure: {
                type: 'string',
                description: 'Pattern with size, color, or material if known.',
              },
              trolling_depth_ft: { type: 'number' },
              trolling_speed_mph: { type: 'number' },
              released_or_kept: {
                type: 'string',
                enum: ['released', 'kept'],
              },
              notes: { type: 'string' },
            },
            required: ['species', 'method', 'fly_or_lure', 'released_or_kept'],
          },
        },
      ],
      tool_choice: { type: 'tool', name: 'log_catch' },
      messages: [
        {
          role: 'user',
          content: input.locationName
            ? `Location context: ${input.locationName}\n\n${input.text}`
            : input.text,
        },
      ],
    });

    await recordTokens(uid, 'parseJournal', response.usage);

    const toolUse = response.content.find(
      (b): b is Anthropic.Messages.ToolUseBlock =>
        b.type === 'tool_use' && b.name === 'log_catch'
    );

    if (!toolUse) {
      throw new HttpsError('internal', 'Model did not call log_catch tool');
    }

    return { catch: toolUse.input };
  }
);
