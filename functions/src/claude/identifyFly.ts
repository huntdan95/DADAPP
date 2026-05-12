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
 * Vision: identify a fly or a bug from a photo.
 *
 * Two distinct cases handled by the same tool:
 *
 *   1. TIED FLY — an artificial fly the user tied or is showing. The
 *      model returns the pattern name (e.g. "Wooly Bugger",
 *      "Stimulator", "Zonker"), the broad category (streamer, dry,
 *      nymph, etc.), and a hint at the color/size the user can use
 *      to find a match in the fly database.
 *
 *   2. NATURAL INSECT/BUG — a real insect the angler photographed
 *      stream-side. The model returns the common name, the order
 *      (mayfly/caddis/stonefly/midge/terrestrial), and the life
 *      stage (adult/dun/spinner/emerger/nymph/larva/pupa).
 *
 * Tiered cost approach mirrors `analyzePhoto`: Haiku 4.5 first pass
 * (covers obvious cases like a clearly visible Wooly Bugger or a
 * fresh adult mayfly), Opus 4.7 escalation with adaptive thinking
 * when Haiku flagged low confidence or couldn't pin a name. Same
 * `identifySpecies` daily-cap bucket — vision spend is fungible.
 */

interface IdentifyFlyInput {
  imageUrl: string; // Firebase Storage download URL
  hintLocation?: string; // user's spot name — helps disambiguate regional patterns
}

const SYSTEM_PROMPT = `You analyze a single photo from a fly-fisher's fly box and return structured data.

ALWAYS call the identify_fly tool. Never reply in plain text.

Classify the subject as one of:
  - "tied-fly": an artificial fly pattern (anything tied on a hook — streamer, dry, nymph, terrestrial, etc.). Hook visible OR a fly clearly intended for fishing.
  - "insect": a real bug (mayfly, caddis, stonefly, midge, terrestrial insect, etc.) — usually photographed stream-side, on a leaf, on a finger, or in/on the water.
  - "other": anything else (fish, scenery, gear, hand only). Set confidence "low".

# TIED FLIES — walk through this checklist before naming a pattern

Hook + materials are the first signals. Then size, then color, then silhouette.

CHECK A — Profile shape
  - Articulated / shank-and-trailing hook with marabou or rabbit strips → STREAMER family (Wooly Bugger, Sex Dungeon, Boogie Man, Drunk & Disorderly, Mini Dungeon, Sculpzilla, Zonker, Game Changer, Polar Changer, Circus Peanut, Zoo Cougar).
  - Stiff hackle palmered the length of the body on a long-shank hook, weighted/eyed head → CLASSIC STREAMER (Muddler Minnow, Clouser Deep Minnow, Mickey Finn, Black Nose Dace, Shenk's White Streamer, Kreelex).
  - Upright wings + hackle + tail on a standard-shank dry hook → ADULT DRY (Adams, Parachute Adams, Royal Wulff, Adams Wulff, Stimulator, Elk Hair Caddis, Thunderhead, Hazel Creek, Light Cahill).
  - Foam body + rubber legs + indicator post → MODERN ATTRACTOR (Chubby Chernobyl, Charlie Boy Hopper, Morrish Hopper, Stealth Bomber, Project Cicada, Spotted Lanternfly pattern).
  - Slim natural fur/wing body with no hackle but a wing pad → EMERGER / NYMPH (Pheasant Tail, Bead-Head Hare's Ear, RS-2, WD-40, Top Secret Midge, Zebra Midge, Perdigon).
  - Heavy bead head + flashabou + rubber legs → ATTRACTOR NYMPH (Mop Fly, Squirmy Wormy, Y2K, Green Weenie, San Juan Worm, Pat's Rubber Legs).
  - Round chenille body with two hackles (front + tail) on a wide-gape hook → POPPER / BUG (Boogle Bug, Sneaky Pete, Gurgler).
  - Deer-hair head and body, often weed-guards → BASS / WARMWATER (Stealth Bomber, Whitlock Hair Frog, Dahlberg Diver).
  - Egg-cluster or yarn ball → EGG (Glo Bug, Sucker Spawn, Eggstasy, Y2K).

CHECK B — Color + signature features
  - Wooly Bugger: marabou tail + palmered hackle on body; olive/black/white/brown most common.
  - Stimulator: deer-hair wing + palmered hackle, yellow/orange/royal body.
  - Adams (parachute or standard): grizzly+brown hackle, gray dubbed body, mallard wings.
  - Hopper: foam segmented body + legs + wing-case slant; yellow/tan body most common.
  - Zonker: rabbit-strip wing + body, mylar belly, weighted.
  - Sculpzilla: articulated, sculpin head + olive/brown body.
  - Tellico Nymph: yellow floss body, peacock back, brown hackle — golden stonefly look.
  - Yallerhammer: yellow palmered body, soft-hackle wet appearance.
  - Stealth Bomber: foam-and-deer-hair topwater with a "tail," dives + flutters back.

# NATURAL INSECTS — walk through ORDER, then stage, then size

CHECK 1 — Wing posture + body shape
  - Tent-shaped wings (wings fold down over the body like a tent) → CADDIS (Trichoptera). Look for: hairy body, antennae, no tails.
  - Wings held UPRIGHT like a sailboat sail, two or three TAILS, slender body → MAYFLY (Ephemeroptera).
  - Two pairs of clear wings held FLAT over the body, hard body, two short tails → STONEFLY (Plecoptera).
  - Tiny (#20+), single pair of wings held flat or in a tent, no tails, gnat-sized → MIDGE (Diptera/Chironomidae).
  - Wings absent or held tight; obvious legs + wings of an OTHER terrestrial form (hopper, beetle, ant, cicada, lanternfly) → TERRESTRIAL.

CHECK 2 — Stage
  - Adult: wings fully formed and dry, body slim — usually on a leaf or in the air.
  - Dun: mayfly subimago; wings opaque/dull, body fresh — just emerged.
  - Spinner: mayfly imago; wings clear and shiny, body darker — mating + dying form.
  - Emerger: trailing nymph shuck still attached, wings partially out.
  - Nymph: underwater juvenile, no wings, often visible tails/gills — mayfly/stonefly.
  - Larva: underwater juvenile, worm-like — caddis/midge.
  - Pupa: midge or caddis transitional, often with visible wing pads.

CHECK 3 — Common species patterns (be specific when you can)
  - Tiny yellow-bodied mayfly with two tails → likely Sulfur or BWO depending on color.
  - Big brown-bodied mayfly with three tails → Hex / Brown Drake / Eastern Green Drake.
  - Bright yellow-bodied stonefly → Yellow Sally.
  - Big black-bodied stonefly with orange/red highlights → Salmonfly (West) or Eastern Giant Black Stonefly.
  - Mottled-wing caddis fluttering near surface → Hydropsyche / Grannom.

# Output

For a TIED FLY:
  - fly_name: best-guess pattern name in title case ("Wooly Bugger", "Parachute Adams", "Stimulator", "Tellico Nymph", "Mop Fly").
  - fly_category: one of "streamer" | "dry" | "nymph" | "terrestrial" | "egg" | "popper" | "wet" | "other".
  - color: dominant color description ("olive", "black + chartreuse", "yellow", "tan/brown").
  - estimated_size: hook size as commonly tied ("#6 streamer", "#14 dry", "#18 nymph"). Null if you can't tell.

For an INSECT:
  - insect_name: lowercase common name ("sulfur", "blue-winged olive", "yellow sally stonefly", "caddis", "spotted lanternfly", "Japanese beetle").
  - insect_order: "mayfly" | "caddis" | "stonefly" | "midge" | "terrestrial" | "unknown".
  - insect_stage: "adult" | "dun" | "spinner" | "emerger" | "nymph" | "larva" | "pupa" | "unknown".

ALWAYS set:
  - kind: "tied-fly" | "insect" | "other"
  - confidence: "high" | "medium" | "low"
  - notes: ONE sentence quoting the specific visual cue you used ("marabou tail + palmered grizzly hackle on olive body = Wooly Bugger", "three tails + upright sailboat wings + pale yellow body = sulfur mayfly dun").

# Confidence

high: subject clearly visible, family-level features unambiguous, only one pattern/species fits.
medium: family clear but two patterns/species plausible from this angle.
low: poor photo, partial view, wrong subject type, or family inconclusive.

Do not refuse. If the image is unsuitable, return kind: "other", confidence: "low", and notes saying why.`;

const IDENTIFY_FLY_TOOL: Anthropic.Messages.Tool = {
  name: 'identify_fly',
  description:
    'Return the classified subject + relevant fly or insect fields. Work through the checklists in the system prompt before deciding.',
  input_schema: {
    type: 'object' as const,
    properties: {
      kind: { type: 'string', enum: ['tied-fly', 'insect', 'other'] },
      confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
      // Tied-fly fields
      fly_name: { type: 'string' },
      fly_category: {
        type: 'string',
        enum: [
          'streamer',
          'dry',
          'nymph',
          'terrestrial',
          'egg',
          'popper',
          'wet',
          'other',
        ],
      },
      color: { type: 'string' },
      estimated_size: { type: ['string', 'null'] },
      // Insect fields
      insect_name: { type: 'string' },
      insect_order: {
        type: 'string',
        enum: [
          'mayfly',
          'caddis',
          'stonefly',
          'midge',
          'terrestrial',
          'unknown',
        ],
      },
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

export interface IdentifyFlyOutput {
  kind: 'tied-fly' | 'insect' | 'other';
  confidence: 'high' | 'medium' | 'low';
  fly_name?: string;
  fly_category?:
    | 'streamer'
    | 'dry'
    | 'nymph'
    | 'terrestrial'
    | 'egg'
    | 'popper'
    | 'wet'
    | 'other';
  color?: string;
  estimated_size?: string | null;
  insect_name?: string;
  insect_order?:
    | 'mayfly'
    | 'caddis'
    | 'stonefly'
    | 'midge'
    | 'terrestrial'
    | 'unknown';
  insect_stage?:
    | 'adult'
    | 'dun'
    | 'spinner'
    | 'emerger'
    | 'nymph'
    | 'larva'
    | 'pupa'
    | 'unknown';
  notes: string;
  /** Debug-only: which model produced this output (stripped before client). */
  _model?: 'haiku' | 'opus';
}

async function runIdentifyFly(
  model: string,
  options: {
    imageUrl: string;
    hintLines: string[];
    enableThinking: boolean;
  }
): Promise<{ output: IdentifyFlyOutput; usage: Anthropic.Messages.Usage }> {
  const text =
    options.hintLines.length > 0
      ? `Identify this fly or bug.\n${options.hintLines.join(
          '\n'
        )}\n\nWork through the checklists in your system prompt before deciding.`
      : 'Identify this fly or bug.\n\nWork through the checklists in your system prompt before deciding.';

  const params: Anthropic.Messages.MessageCreateParamsNonStreaming = {
    model,
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    tools: [IDENTIFY_FLY_TOOL],
    tool_choice: { type: 'tool', name: 'identify_fly' },
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

  if (options.enableThinking) {
    params.thinking = { type: 'adaptive' };
    params.output_config = { effort: 'high' };
  }

  const response = await anthropic().messages.create(params);

  const toolUse = response.content.find(
    (b): b is Anthropic.Messages.ToolUseBlock =>
      b.type === 'tool_use' && b.name === 'identify_fly'
  );
  if (!toolUse) {
    throw new HttpsError('internal', 'Model did not call identify_fly tool');
  }

  return {
    output: toolUse.input as IdentifyFlyOutput,
    usage: response.usage,
  };
}

export const identifyFly = onCall(
  {
    region: 'us-central1',
    memory: '512MiB',
    // Haiku ~3-5s; Opus escalation with adaptive thinking ~15-25s.
    // 90s margin covers cold start + image fetch + sequential calls.
    timeoutSeconds: 90,
    secrets: [anthropicApiKey],
    invoker: 'public',
    cors: [
      'https://fishingdads.app',
      'https://www.fishingdads.app',
      'https://dadapp-2cef8.web.app',
      'https://dadapp-2cef8.firebaseapp.com',
      /\.web\.app$/,
      /\.firebaseapp\.com$/,
      'http://localhost:5173',
    ],
  },
  async (request) => {
    const uid = requireAuth(request.auth?.uid);
    const input = request.data as IdentifyFlyInput;

    if (!input?.imageUrl) {
      throw new HttpsError('invalid-argument', 'imageUrl required');
    }

    // Same cap bucket as identifySpecies — vision spend is one budget.
    // 5/day per user with the 4-second cooldown.
    await checkAndIncrementUsage(uid, 'identifySpecies');

    const hintLines: string[] = [];
    if (input.hintLocation) hintLines.push(`Location: ${input.hintLocation}`);

    // Primary pass — Haiku 4.5.
    const primary = await runIdentifyFly(MODELS.analyzePhotoPrimary, {
      imageUrl: input.imageUrl,
      hintLines,
      enableThinking: false,
    });
    let usage = primary.usage;
    let result: IdentifyFlyOutput = { ...primary.output, _model: 'haiku' };

    // Escalation: low confidence OR Haiku gave up at family-level
    // (kind tied-fly/insect but no specific name returned).
    const needsEscalation =
      result.confidence === 'low' ||
      (result.kind === 'tied-fly' && !result.fly_name) ||
      (result.kind === 'insect' && !result.insect_name) ||
      (result.kind === 'other' && result.confidence !== 'high');

    if (needsEscalation) {
      try {
        const escalation = await runIdentifyFly(MODELS.analyzePhotoEscalate, {
          imageUrl: input.imageUrl,
          hintLines,
          enableThinking: true,
        });
        usage = sumUsage(usage, escalation.usage);
        result = { ...escalation.output, _model: 'opus' };
      } catch (e) {
        const errMsg = e instanceof Error ? e.message : String(e);
        console.warn('identifyFly escalation failed:', errMsg);
      }
    }

    await recordTokens(uid, 'identifySpecies', usage);

    // Strip the debug _model field before returning.
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
