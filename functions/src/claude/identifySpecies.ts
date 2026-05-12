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
 * Vision: identify species + estimate length from a catch photo.
 *
 * We use Sonnet 4.6's image-by-URL input so we never have to pipe the
 * binary through this function. The client uploads to Firebase Storage,
 * gets a download URL, and passes it here. Storage rules already gate
 * read access to the same signed-in user.
 *
 * Caching: image varies per call, so prefix caching wouldn't help.
 * No breakpoints.
 */

interface IdentifyInput {
  imageUrl: string;        // public download URL from Firebase Storage
  hintLengthInches?: number;
  hintLocation?: string;
}

interface IdentifyResult {
  species: string;
  confidence: 'high' | 'medium' | 'low';
  estimatedLengthInches: number | null;
  notes: string;
}

const SYSTEM_PROMPT = `You are a fish-ID expert. From the photo, identify the species and estimate the fish length.

Output rules:
- ALWAYS call the identify tool. Never reply in plain text.
- species: full common name in title case ("Brown trout", "Walleye", "Smallmouth bass", "King salmon").
- confidence: "high" if the fish is clearly visible and the species is unambiguous; "medium" if visible but a similar species can't be ruled out; "low" if the photo is poor or the fish is largely obscured.
- estimated_length_inches: integer inches. Calibrate against any reference object the user is likely holding (hand, rod butt, net). Set null if you can't estimate.
- notes: ONE sentence with the strongest visual cue you used ("red adipose dot and parr marks suggest brown trout") OR what's blocking confidence.

Do not refuse — if the image is unsuitable, return confidence: "low" with a note about the issue.`;

export const identifySpecies = onCall(
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
    const input = request.data as IdentifyInput;

    if (!input?.imageUrl) {
      throw new HttpsError('invalid-argument', 'imageUrl required');
    }

    await checkAndIncrementUsage(uid, 'identifySpecies');

    const hintLines: string[] = [];
    if (input.hintLocation) hintLines.push(`Location: ${input.hintLocation}`);
    if (input.hintLengthInches != null)
      hintLines.push(`User-reported length: ${input.hintLengthInches}"`);

    const response = await anthropic().messages.create({
      model: MODELS.identifySpecies,
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      tools: [
        {
          name: 'identify',
          description: 'Return the species ID and length estimate.',
          input_schema: {
            type: 'object' as const,
            properties: {
              species: { type: 'string' },
              confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
              estimated_length_inches: { type: ['integer', 'null'] },
              notes: { type: 'string' },
            },
            required: ['species', 'confidence', 'notes'],
          },
        },
      ],
      tool_choice: { type: 'tool', name: 'identify' },
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'url', url: input.imageUrl } },
            {
              type: 'text',
              text:
                hintLines.length > 0
                  ? `Identify this fish.\n${hintLines.join('\n')}`
                  : 'Identify this fish.',
            },
          ],
        },
      ],
    });

    await recordTokens(uid, 'identifySpecies', response.usage);

    const toolUse = response.content.find(
      (b): b is Anthropic.Messages.ToolUseBlock =>
        b.type === 'tool_use' && b.name === 'identify'
    );

    if (!toolUse) {
      throw new HttpsError('internal', 'Model did not call identify tool');
    }

    const raw = toolUse.input as {
      species: string;
      confidence: 'high' | 'medium' | 'low';
      estimated_length_inches: number | null;
      notes: string;
    };

    const result: IdentifyResult = {
      species: raw.species,
      confidence: raw.confidence,
      estimatedLengthInches:
        typeof raw.estimated_length_inches === 'number'
          ? raw.estimated_length_inches
          : null,
      notes: raw.notes,
    };

    return result;
  }
);
