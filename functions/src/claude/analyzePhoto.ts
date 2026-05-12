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

# Fish identification — WORK THE FAMILY FIRST

Before picking a species, identify the FAMILY using gross features. Most ID errors come from skipping this step. Walk through these checks in order:

CHECK 1 — Are there barbels (whiskers) at the mouth?
  YES → CATFISH FAMILY (Ictaluridae). DO NOT call it a bass. Now distinguish:
    - Channel catfish: deeply forked tail, dark spots scattered on slate-grey/blue sides, white belly, slim profile, anal fin 24-30 rays. Most common.
    - Blue catfish: deeply forked tail, NO spots, uniform slate-blue back fading to white, longer anal fin (30-36 rays), big shoulders.
    - Flathead catfish: tail is SQUARE / slightly rounded (NOT forked), broad flat head, mottled yellow/brown body, lower jaw juts past upper.
    - White catfish: forked tail (less deep), broader head than channel, blue-grey back, no spots, brackish-water tolerant.
    - Brown bullhead / yellow bullhead / black bullhead: ROUNDED tail (not forked), small body (<14 in), chunky build.

CHECK 2 — No barbels, body covered with visible scales, dorsal fin has BOTH stiff front spines AND soft rear rays (often appears as two connected fins)?
  YES → SUNFISH / BASS FAMILY (Centrarchidae). Now distinguish:
    - Largemouth bass: upper jaw extends PAST the back of the eye; thick dark mid-lateral stripe down the side; mouth gaps wide.
    - Smallmouth bass: upper jaw stops AT the back of the eye; bronze-green color with vertical bars or marbling; red eye; NO mid-lateral stripe.
    - Spotted bass: jaw stops at eye like smallmouth; rows of horizontal dark spots BELOW the lateral line; tongue tooth-patch (not visible in photos).
    - Bluegill: small (palm-size), deep round body, black "ear flap" gill cover, vertical bars.
    - Crappie: silver/dark mottled, large mouth for its size, dorsal fin set far back. White vs black crappie distinguished by dorsal-spine count (rarely countable in photos).
    - Redear sunfish: bluegill-shaped but ear-flap is red-tipped, no dark vertical bars.
    - Warmouth: stocky like bass, dark vermiculation around the eye, large mouth.
    - Rock bass: red eye, mottled bronze, looks like a stocky smallmouth with a smaller body.

CHECK 3 — No barbels, slim torpedo body, ADIPOSE FIN (small fleshy fin between dorsal and tail)?
  YES → SALMONID FAMILY (trout, salmon, char). Now distinguish by body markings:
    - Brown trout: ORANGE/RED spots with PALE HALOS on tan/yellow flanks, brown to olive back. Few black spots high on body.
    - Rainbow trout: PINK/RED stripe along lateral line, peppered black spots all over (no halos), silver-to-pink flanks.
    - Brook trout: WORM-LIKE wavy markings (vermiculation) on dark back, red spots with BLUE halos, white-edged lower fins.
    - Lake trout: deeply FORKED tail, body covered with CREAM/WHITE spots on dark grey/green background, no pink or red.
    - Steelhead: silver flanks, faint pink stripe, peppered black spots, chrome bright (looks like a rainbow but bigger and chromer — sea-run / Great Lakes form).
    - King (Chinook) salmon: black gums + black mouth, large body, white-tipped anal fin absent, vague black spotting on tail.
    - Coho salmon: white gums, smaller spotting only on UPPER half of tail.
    - Atlantic salmon: black X-shaped or simple spots, sea-bright if chrome; lacks Pacific salmon's tail-spotting density.

CHECK 4 — No barbels, no adipose fin, long cylindrical body, sharp teeth, single dorsal far back near the tail?
  YES → PIKE / PICKEREL family (Esocidae).
    - Northern pike: cream-colored bean-shaped SPOTS on dark green body.
    - Muskellunge: dark vertical BARS or spots on light olive background.
    - Tiger muskie: pronounced wavy dark vertical bars on bright olive (hybrid pattern).
    - Chain pickerel: dark CHAIN-LINK pattern (interlocking ovals) on bronze body.

CHECK 5 — Saltwater fish (held on a boat, mangrove background, salt-flat scene, etc.)?
  Distinguish by gross body shape + color first:
    - Redfish (red drum): copper/bronze, BLACK SPOT at base of tail, blunt rounded head, no obvious side bars.
    - Snook: pronounced BLACK LATERAL LINE running tail-to-head, sloped pointed forehead, yellow lower fins.
    - Spotted sea trout: silver flanks with DISCRETE BLACK SPOTS scattered to the tail, two prominent fangs, large mouth.
    - Tarpon: enormous silver SCALES the size of a quarter, upturned mouth, deeply forked tail, very large size.
    - Permit: silver flat-disc shape, scimitar/sickle-shaped tail, no spotting.
    - Sheepshead: silvery body with 5–7 BLACK VERTICAL BARS, human-like teeth visible.
    - Black drum: tall body with vertical bars (juveniles), chin barbels (small), high-arched back.
    - Mangrove (gray) snapper: gray-bronze body, dark stripe through the eye, sharp canine teeth.
    - Flounder: flat-bodied, eyes on one side, mottled brown.

# Anti-confusion checklist — read this every time

  - If the fish has WHISKERS, it is NEVER a bass. It is a catfish/bullhead. Period.
  - If the fish has an ADIPOSE FIN (small fleshy fin behind the dorsal), it is a trout/salmon/char. It is NEVER a bass.
  - If you see a copper-colored saltwater fish with a black tail spot, it's a redfish, not a brown trout.
  - If you see a chrome silver salmonid with peppered spots, it's a rainbow/steelhead, not a brown trout.
  - Brown trout have ORANGE-HALOED spots. Rainbows do not. Spot color and halos are diagnostic.

# Output

species: full common name in title case ("Channel catfish", "Smallmouth bass", "Brown trout").
estimated_length_inches: integer. Calibrate against a held hand (~7-8 in palm), rod butt (~5 in), or net opening. null if you can't estimate.
notes: ONE sentence quoting the SPECIFIC diagnostic feature you used ("deeply forked tail + dark spots on slate-grey sides + whiskers = channel catfish").

# Confidence

high: subject clearly visible, family-level features unambiguous, only one species in the family fits.
medium: family is clear but two species in the family are both plausible from this angle.
low: poor photo, partial view, wrong subject type, or family-level features inconclusive.

For an insect:
  - insect_name: common name in lowercase ("sulfur", "blue-winged olive", "yellow sally stonefly", "caddis", "hex").
  - insect_stage: "adult" | "dun" | "spinner" | "emerger" | "nymph" | "larva" | "pupa" | "unknown". Only assign a stage you can see.
  - notes: ONE sentence on identifying features (wing posture, body color, tail count, antennae).

Do not refuse. If the image is unsuitable, return kind: "other", confidence: "low", and one-sentence notes saying why.`;

/** Tool definition reused for both the Haiku primary and the Opus
 *  escalation call. Schema requires kind/confidence/notes, optional
 *  species + length for fish, optional insect_name + stage for bugs. */
const ANALYZE_PHOTO_TOOL: Anthropic.Messages.Tool = {
  name: 'analyze_photo',
  description:
    'Return the classified subject + relevant fields. Work through the family-level checklist in the system prompt before deciding on a species.',
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
};

interface AnalyzeOutput {
  kind: 'fish' | 'insect' | 'other';
  confidence: 'high' | 'medium' | 'low';
  species?: string;
  estimated_length_inches?: number | null;
  insect_name?: string;
  insect_stage?: string;
  notes: string;
  /**
   * Debug-only: which model produced this output. Lets us tune the
   * escalation logic by watching how often Haiku is enough vs. Opus
   * is needed. Stripped from the client response.
   */
  _model?: 'haiku' | 'opus';
}

/**
 * Single vision call against the given model. Same prompt, same tool,
 * just swappable model. Used by the tiered analyzePhoto handler.
 */
async function runAnalyzePhoto(
  model: string,
  options: {
    imageUrl: string;
    hintLines: string[];
    /** Opus-tier reasoning toggles. Haiku ignores adaptive thinking; we
     *  only pass it for the escalation call. */
    enableThinking: boolean;
  }
): Promise<{ output: AnalyzeOutput; usage: Anthropic.Messages.Usage }> {
  const text =
    options.hintLines.length > 0
      ? `Analyze this photo.\n${options.hintLines.join(
          '\n'
        )}\n\nWork through the family checklist in your system prompt before deciding.`
      : 'Analyze this photo.\n\nWork through the family checklist in your system prompt before deciding.';

  const params: Anthropic.Messages.MessageCreateParamsNonStreaming = {
    model,
    // Tool output is ~50-100 tokens. Adaptive thinking on Opus burns
    // output budget, so the escalation pass gets 2000. The Haiku
    // primary doesn't think — 600 is plenty for the tool call plus
    // any preamble and prevents a runaway tool-loop from costing
    // ~$0.01 instead of ~$0.003.
    max_tokens: options.enableThinking ? 2000 : 600,
    system: SYSTEM_PROMPT,
    tools: [ANALYZE_PHOTO_TOOL],
    tool_choice: { type: 'tool', name: 'analyze_photo' },
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image', source: { type: 'url', url: options.imageUrl } },
          { type: 'text', text },
        ],
      },
    ],
  };

  // Adaptive thinking + high effort: only on the escalation call.
  // Haiku doesn't benefit meaningfully and would be wasted tokens.
  if (options.enableThinking) {
    params.thinking = { type: 'adaptive' };
    params.output_config = { effort: 'high' };
  }

  const response = await anthropic().messages.create(params);

  const toolUse = response.content.find(
    (b): b is Anthropic.Messages.ToolUseBlock =>
      b.type === 'tool_use' && b.name === 'analyze_photo'
  );
  if (!toolUse) {
    throw new HttpsError('internal', 'Model did not call analyze_photo tool');
  }

  return {
    output: toolUse.input as AnalyzeOutput,
    usage: response.usage,
  };
}

export const analyzePhoto = onCall(
  {
    region: 'us-central1',
    memory: '512MiB',
    // Haiku primary returns in ~3-5s; Opus escalation with adaptive
    // thinking adds 15-25s. 90s gives margin for cold start + image
    // fetch + both calls in sequence on the worst-case hard photo.
    timeoutSeconds: 90,
    secrets: [anthropicApiKey],
    invoker: 'public',
    cors: CALLABLE_CORS,
  },
  async (request) => {
    const uid = requireAuth(request.auth?.uid);
    const input = request.data as AnalyzeInput;

    if (!input?.imageUrl) {
      throw new HttpsError('invalid-argument', 'imageUrl required');
    }

    // Re-uses the identifySpecies daily cap — same vision budget bucket.
    // Counts once regardless of escalation so the user can't burn the
    // cap by hitting hard-photo cases.
    await checkAndIncrementUsage(uid, 'identifySpecies');

    const hintLines: string[] = [];
    if (input.hintLocation) hintLines.push(`Location: ${input.hintLocation}`);
    if (input.hintLengthInches != null)
      hintLines.push(`User-reported length: ${input.hintLengthInches}"`);

    // First pass: Haiku 4.5. 5× cheaper than Opus and sufficient for
    // the obvious cases (clear brown trout, smallmouth, bluegill, etc.).
    const primary = await runAnalyzePhoto(MODELS.analyzePhotoPrimary, {
      imageUrl: input.imageUrl,
      hintLines,
      enableThinking: false,
    });
    let usage = primary.usage;
    let result: AnalyzeOutput = { ...primary.output, _model: 'haiku' };

    // Escalation trigger: ANY of
    //   - confidence is "low" (model itself flagged uncertainty)
    //   - kind is "fish" but no species returned (Haiku gave up at family)
    //   - kind is "other" with confidence < high (could be a missed fish)
    // These are the cases where Opus's family-checklist reasoning earns
    // its cost. Confidence "medium" + a species + a clear notes string
    // is good enough — don't escalate just because Haiku was modest.
    const needsEscalation =
      result.confidence === 'low' ||
      (result.kind === 'fish' && !result.species) ||
      (result.kind === 'other' && result.confidence !== 'high');

    if (needsEscalation) {
      try {
        const escalation = await runAnalyzePhoto(MODELS.analyzePhotoEscalate, {
          imageUrl: input.imageUrl,
          hintLines,
          enableThinking: true,
        });
        // Sum tokens so we record real total spend, not just primary.
        usage = sumUsage(usage, escalation.usage);
        result = { ...escalation.output, _model: 'opus' };
      } catch (e) {
        // If Opus escalation fails, return the Haiku result — better
        // than blocking the user on a hard photo.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errMsg = (e as any)?.message ?? String(e);
        // Log but continue. Cloud Logging picks up the structured msg.
        // (No `logger` import needed — analyzePhoto already has one.)
        console.warn('analyzePhoto escalation failed:', errMsg);
      }
    }

    await recordTokens(uid, 'identifySpecies', usage);

    // Strip the internal _model field before returning to the client.
    const { _model, ...cleanResult } = result;
    void _model;
    return cleanResult;
  }
);

function sumUsage(
  a: Anthropic.Messages.Usage,
  b: Anthropic.Messages.Usage
): Anthropic.Messages.Usage {
  return {
    ...a,
    input_tokens: (a.input_tokens ?? 0) + (b.input_tokens ?? 0),
    output_tokens: (a.output_tokens ?? 0) + (b.output_tokens ?? 0),
    cache_creation_input_tokens:
      (a.cache_creation_input_tokens ?? 0) +
      (b.cache_creation_input_tokens ?? 0),
    cache_read_input_tokens:
      (a.cache_read_input_tokens ?? 0) + (b.cache_read_input_tokens ?? 0),
  };
}
