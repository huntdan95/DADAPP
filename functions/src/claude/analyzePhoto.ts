import type Anthropic from '@anthropic-ai/sdk';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import {
  anthropic,
  anthropicApiKey,
  checkAndIncrementUsage,
  MODELS,
  recordTokens,
  requireAuth,
} from './_shared';

/**
 * Vision Cloud Function for the simplified Log flow.
 *
 * Given a photo URL, Claude classifies the subject as fish, insect, or
 * other and returns appropriate structured fields. Replaces the
 * fish-only `identifySpecies` from earlier — the Log flow logs either
 * a catch or a hatch sighting and the user shouldn't have to tell us
 * which up-front.
 */

interface AnalyzeInput {
  imageUrl: string;
  hintLocation?: string;
  hintLengthInches?: number;
}

const SYSTEM_PROMPT = `You analyze a single photo from a fishing app and return structured data.

ALWAYS call the analyze_photo tool. Never reply in plain text.

Classify the subject as one of:
  - "fish": a fish caught by an angler (held, in net, on the ground/snow, on a measuring board)
  - "insect": a bug — mayfly, caddis, stonefly, midge, terrestrial, etc. — that an angler photographed to track a hatch
  - "other": anything else (scenery, water, gear, person, hand only). Set confidence "low".

For a fish:
  - species: full common name in title case ("Brown trout", "Walleye", "Smallmouth bass", "King salmon"). If multiple sub-species are plausible, pick the most likely and lower the confidence.
  - estimated_length_inches: integer. Calibrate against a held hand (~7-8 in palm), rod butt (~5 in), or net opening if visible. Set null if you can't estimate.
  - notes: ONE sentence — the visual cue you used ("red adipose dot + parr marks = brown trout").

For an insect:
  - insect_name: common name in lowercase ("sulfur", "blue-winged olive", "yellow sally stonefly", "caddis", "hex").
  - insect_stage: "adult" | "dun" | "spinner" | "emerger" | "nymph" | "larva" | "pupa" | "unknown". Be honest — only assign a stage if visible.
  - notes: ONE sentence on identifying features.

Always set:
  - confidence: "high" if the subject is clearly visible and the ID is unambiguous; "medium" if visible but a similar species can't be ruled out; "low" for poor photos, partial views, or wrong subject type.

Do not refuse. If the image is unsuitable, return kind: "other", confidence: "low", and one-sentence notes saying why.`;

export const analyzePhoto = onCall(
  {
    region: 'us-central1',
    memory: '256MiB',
    timeoutSeconds: 30,
    secrets: [anthropicApiKey],
    invoker: 'public',
  },
  async (request) => {
    const uid = requireAuth(request.auth?.uid);
    const input = request.data as AnalyzeInput;

    if (!input?.imageUrl) {
      throw new HttpsError('invalid-argument', 'imageUrl required');
    }

    // Re-uses the identifySpecies daily cap — same vision budget bucket.
    await checkAndIncrementUsage(uid, 'identifySpecies');

    const hintLines: string[] = [];
    if (input.hintLocation) hintLines.push(`Location: ${input.hintLocation}`);
    if (input.hintLengthInches != null)
      hintLines.push(`User-reported length: ${input.hintLengthInches}"`);

    const response = await anthropic().messages.create({
      model: MODELS.identifySpecies,
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      tools: [
        {
          name: 'analyze_photo',
          description: 'Return the classified subject + relevant fields.',
          input_schema: {
            type: 'object' as const,
            properties: {
              kind: { type: 'string', enum: ['fish', 'insect', 'other'] },
              confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
              species: { type: 'string' },
              estimated_length_inches: { type: ['integer', 'null'] },
              insect_name: { type: 'string' },
              insect_stage: {
                type: 'string',
                enum: [
                  'adult',
                  'dun',
                  'spinner',
                  'emerger',
                  'nymph',
                  'larva',
                  'pupa',
                  'unknown',
                ],
              },
              notes: { type: 'string' },
            },
            required: ['kind', 'confidence', 'notes'],
          },
        },
      ],
      tool_choice: { type: 'tool', name: 'analyze_photo' },
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'url', url: input.imageUrl } },
            {
              type: 'text',
              text:
                hintLines.length > 0
                  ? `Analyze this photo.\n${hintLines.join('\n')}`
                  : 'Analyze this photo.',
            },
          ],
        },
      ],
    });

    await recordTokens(uid, 'identifySpecies', response.usage);

    const toolUse = response.content.find(
      (b): b is Anthropic.Messages.ToolUseBlock =>
        b.type === 'tool_use' && b.name === 'analyze_photo'
    );

    if (!toolUse) {
      throw new HttpsError('internal', 'Model did not call analyze_photo tool');
    }

    return toolUse.input;
  }
);
