import type Anthropic from '@anthropic-ai/sdk';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import {
  anthropic,
  anthropicApiKey,
  checkAndIncrementUsage,
  MODELS,
  recordTokens,
  requireAuth,
} from './_shared';

/**
 * Daily 3-sentence pre-trip briefing for a location.
 *
 * Caching strategy: the system prompt bakes in a ~1.5K-token fishing
 * playbook (pressure heuristics, hatch behavior, dam-generation rules,
 * trolling notes) that is identical for every user, every location, every
 * day. The dynamic inputs (current conditions, last-5 catches) live in
 * the user message AFTER the cache breakpoint, so subsequent same-day
 * calls hit cache at ~0.1× cost and ~0 latency on the prefix.
 */

interface BriefingInput {
  locationName: string;
  waterType: string;             // 'tailwater' | 'freestone' | 'lake' | ...
  river?: string;
  state: string;
  currentConditions: {
    airTempF: number;
    waterTempF?: number;
    flowCfs?: number;
    pressureMb: number;
    pressureTrend: string;       // 'falling-fast' | ...
    windMph?: number;
    cloudCoverPct?: number;
    weatherSummary: string;      // e.g. "Partly cloudy"
  };
  dam?: {
    name: string;
    nextChange: string | null;   // human-readable e.g. "Generation starts at 2 PM"
    currentStatus: string;       // 'no_generation' | 'partial' | 'heavy' | 'unknown'
  };
  activeHatches: Array<{
    name: string;
    tempRange: string;
    timeOfDay: string;
    flies: string;
  }>;
  recentCatches: Array<{
    species: string;
    lengthInches?: number;
    method: string;
    fly: string;
    daysAgo: number;
    notes?: string;
  }>;
}

const SYSTEM_PROMPT = `You are a fishing co-pilot. Write a SHORT, USEFUL pre-trip briefing — exactly 3 sentences. No greetings, no sign-off, no preamble.

VOICE: Direct, knowledgeable, friend-with-thirty-years-on-the-water. No fluff. No hedging. State what to do.

STRUCTURE:
  Sentence 1: One-line read on conditions ("What today looks like").
  Sentence 2: What's most likely to work and when.
  Sentence 3: A concrete tactical recommendation (fly/lure/depth/window).

FISHING HEURISTICS:

Pressure:
  - Steady high pressure (>1020 mb): tough; midday slow; dawn/dusk best.
  - Falling pressure (>3 mb / 6h): elite window before the front; trout feed aggressively.
  - Already crashed (<1005 mb): fish are sulking; try big streamers slow, or wait.
  - Rising after a front: bite recovers gradually over 24-48h.

Water temperature (trout):
  - <38°F: fish lethargic; midges on flat water; dead-drift slow.
  - 38-50°F: nymphing is king; small dark patterns; few risers.
  - 50-65°F: prime; dry-dropper and emergers; whole-day potential.
  - 65-70°F: warm; fish early/late; avoid playing fish hard.
  - >70°F: do not target trout — lethal stress zone.

Dam generation (tailwaters):
  - No generation: wadeable, predictable; smaller flies in slow seams.
  - 1 unit / partial: transitional; bite often turns on as water comes up; nymph deeper.
  - 2+ units / heavy: float-only; streamer game; tight to banks.
  - The first hour AFTER generation stops is often the best window of the day.

Hatches & timing:
  - Match the hatch when one is on. Otherwise default search patterns: terrestrials June-September, BWO emergers on overcast cool days year-round.
  - Sulfurs (50-62°F water, evenings) drive South Holston / Caney Fork from May.
  - Hex (June 15-30, Manistee, after dark): plan around it; size 6 dries, no leader finesse.
  - Trico mornings July-September: 22s on 7x; rise reading is everything.

Trolling (lakes / Great Lakes / large rivers):
  - Surface temps drive depth: cold = shallow, warm = downriggers.
  - Stinger spoons in chrome/orange when sun is bright; glow/UV at dawn.
  - Speed: walleye 1.2-1.8 mph, trout 2.0-2.8 mph, kings 2.4-3.2 mph.

Last-5 pattern recognition:
  - If recent catches all came on one fly or one method, lean that way unless conditions clearly differ.
  - If recent catches all came at one time of day, repeat the window.
  - If skunked recently, change something concrete (depth, fly size, or location within the spot).

CONSTRAINTS:
  - Exactly 3 sentences.
  - No bullet points, no markdown, no headers.
  - No "weather is..." narration — go straight to the implication.
  - Reference at most ONE concrete fly/lure recommendation per briefing.
  - If data is genuinely empty (no hatches, no catches, no dam), say so briefly but still finish in 3 sentences.`;

export const briefing = onCall(
  {
    region: 'us-central1',
    memory: '256MiB',
    timeoutSeconds: 30,
    secrets: [anthropicApiKey],
    // Firebase auth is checked inside the handler (requireAuth). At the
    // Cloud Run layer we need allUsers to have run.invoker or the request
    // never reaches our code.
    invoker: 'public',
  },
  async (request) => {
    const uid = requireAuth(request.auth?.uid);
    const input = request.data as BriefingInput;

    if (!input?.locationName) {
      throw new HttpsError('invalid-argument', 'locationName required');
    }

    await checkAndIncrementUsage(uid, 'briefing');

    const userMessage = formatInputs(input);

    const response = await anthropic().messages.create({
      model: MODELS.briefing,
      max_tokens: 300,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [{ role: 'user', content: userMessage }],
    });

    await recordTokens(uid, 'briefing', response.usage);

    const text = response.content
      .filter((b): b is Anthropic.Messages.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim();

    logger.info('briefing generated', {
      uid,
      location: input.locationName,
      input_tokens: response.usage.input_tokens,
      output_tokens: response.usage.output_tokens,
      cache_read: response.usage.cache_read_input_tokens,
    });

    return { briefing: text };
  }
);

function formatInputs(i: BriefingInput): string {
  const lines: string[] = [];
  lines.push(`Location: ${i.locationName}`);
  if (i.river) lines.push(`River: ${i.river}`);
  lines.push(`Type: ${i.waterType}  State: ${i.state}`);
  lines.push('');
  lines.push('CURRENT CONDITIONS:');
  lines.push(`  Air: ${Math.round(i.currentConditions.airTempF)}°F, ${i.currentConditions.weatherSummary}`);
  if (i.currentConditions.waterTempF != null)
    lines.push(`  Water: ${Math.round(i.currentConditions.waterTempF)}°F`);
  if (i.currentConditions.flowCfs != null)
    lines.push(`  Flow: ${Math.round(i.currentConditions.flowCfs)} cfs`);
  lines.push(`  Pressure: ${Math.round(i.currentConditions.pressureMb)} mb, ${i.currentConditions.pressureTrend}`);
  if (i.currentConditions.windMph != null)
    lines.push(`  Wind: ${Math.round(i.currentConditions.windMph)} mph`);
  if (i.currentConditions.cloudCoverPct != null)
    lines.push(`  Cloud cover: ${Math.round(i.currentConditions.cloudCoverPct)}%`);
  lines.push('');

  if (i.dam) {
    lines.push('DAM:');
    lines.push(`  ${i.dam.name}: ${i.dam.currentStatus}${i.dam.nextChange ? `, ${i.dam.nextChange}` : ''}`);
    lines.push('');
  }

  if (i.activeHatches.length > 0) {
    lines.push('ACTIVE HATCHES:');
    for (const h of i.activeHatches.slice(0, 4)) {
      lines.push(`  ${h.name} (${h.tempRange}, ${h.timeOfDay}) — ${h.flies}`);
    }
    lines.push('');
  } else {
    lines.push('No notable hatches predicted right now.');
    lines.push('');
  }

  if (i.recentCatches.length > 0) {
    lines.push('LAST 5 CATCHES HERE:');
    for (const c of i.recentCatches) {
      const len = c.lengthInches != null ? `, ${c.lengthInches}"` : '';
      lines.push(
        `  ${c.daysAgo}d ago — ${c.species}${len} on ${c.fly} (${c.method})` +
          (c.notes ? `; notes: ${c.notes}` : '')
      );
    }
  } else {
    lines.push('No recent catches logged at this spot.');
  }

  return lines.join('\n');
}
