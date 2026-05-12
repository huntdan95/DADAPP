import type Anthropic from '@anthropic-ai/sdk';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
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
 * Daily pre-trip briefing for a location. Returns:
 *   - briefing (3 sentences of prose, leading with a parseable
 *     bite-quality keyword)
 *   - biteQuality (server-parsed from the leading keyword)
 *   - citations (from web_search blocks if Claude used the tool)
 *
 * Caching strategy: the system prompt bakes in a ~2 KB fishing
 * playbook (pressure heuristics, hatch behavior, dam-generation rules,
 * trolling notes) that is identical for every user, every location,
 * every day. Dynamic inputs (conditions, last-5 catches, waterbody
 * curated species) live in the user message AFTER the cache breakpoint,
 * so same-day repeats hit cache at ~0.1× cost and ~0 latency on prefix.
 */

interface BriefingInput {
  locationName: string;
  waterType: string;
  river?: string;
  state: string;
  currentConditions: {
    airTempF: number;
    waterTempF?: number;
    flowCfs?: number;
    pressureMb: number;
    pressureTrend: string;
    windMph?: number;
    windDirection?: string;             // 'NW', 'S', etc.
    cloudCoverPct?: number;
    weatherSummary: string;
    /**
     * Surface temp from a lake-data provider (CO-OPS / NDBC / USGS-
     * lake / estimator). When the flow provider didn't yield a water
     * temp but the lake-data did, this fills the gap.
     */
    lakeSurfaceTempF?: number;
    waveHeightFt?: number;
    lakeSurfaceTempIsEstimated?: boolean;
  };
  /**
   * Today's daily-summary numbers from the weather provider.
   * High / low and sunset for window-planning.
   */
  daily?: {
    tempMaxF?: number;
    tempMinF?: number;
    sunriseLocal?: string;            // 'h:mm a' in the spot's TZ
    sunsetLocal?: string;
  };
  /**
   * Compact peek at the next 6 hours so Claude can call out incoming
   * rain or a wind shift. Empty array if the provider didn't return
   * an hourly series.
   */
  nextSixHours?: Array<{
    hourLabel: string;                // '3 PM'
    tempF: number;
    precipProbPct: number | null;
    cloudCoverPct: number | null;
  }>;
  dam?: {
    name: string;
    nextChange: string | null;
    currentStatus: string;
  };
  activeHatches: Array<{
    name: string;
    tempRange: string;
    timeOfDay: string;
    flies: string;
  }>;
  /**
   * INTENTIONALLY ABSENT: per-user `recentCatches`. Briefings are now
   * shared across users via the `briefings/{cacheKey}` Firestore cache,
   * so the inputs must be deterministic given a spot + date. Personal
   * pattern analysis lives in the patterns Q&A feature instead.
   */
  recentStockings?: Array<{
    daysAgo: number;
    species: string;
    count?: number;
    size?: string;
    locationName: string;
  }>;
  /**
   * Curated waterbody match from the spot registry. Gives Claude
   * the canonical name, target species list, and access tips so
   * it doesn't have to infer them from the lat/lng. Optional —
   * unknown waters skip it.
   */
  waterbody?: {
    name: string;
    species: string[];
    accessNotes?: string;
    /**
     * Anadromous-run barriers — where salmon / steelhead runs end on
     * this water. Lets Claude tell the angler "kings stack at Tippy
     * Dam in October" instead of inferring from a flow gauge.
     */
    runLimits?: Array<{ species: string; limit: string; note?: string }>;
  };
  /**
   * Solunar window data. Major periods bracket lunar transits;
   * the moon-phase fraction (0-1) is included so Claude can flag
   * a new moon as a stronger window.
   */
  solunar?: {
    moonPhaseLabel: string;            // 'New moon', 'Waxing crescent', etc.
    moonIlluminationPct: number;
    majorWindowsLocal: string[];       // ['12:18-1:18 PM', '12:36-1:36 AM']
    minorWindowsLocal: string[];       // ['5:42-6:12 AM', '6:30-7:00 PM']
  };
  /**
   * Trolling depth estimates for actively-feeding species at this
   * spot today, from the spot's seasonal/thermal model. Only
   * populated for Great Lakes / deep-lake spots with relevant
   * species. Lets Claude lead with a concrete "troll at 60-90 ft
   * for kings" recommendation instead of generic advice.
   */
  trollingDepths?: Array<{
    species: string;
    depthRangeFt: [number, number];
    thermoclineFt: number | null;
    rationale: string;
  }>;
}

const SYSTEM_PROMPT = `You are a fishing co-pilot. Write a SHORT, USEFUL pre-trip briefing — exactly 3 sentences, each on a separate line. No greetings, no sign-off, no preamble.

VOICE: Direct, knowledgeable, friend-with-thirty-years-on-the-water. No fluff. No hedging. State what to do.

REQUIRED OUTPUT FORMAT:
  Line 1: One of these exact tokens (UPPERCASE, with the period), then a single space, then sentence 1 — the read on conditions:
     PRIME.       (falling pressure window + temps in zone + favorable factors aligned)
     GOOD.        (solid conditions, will produce with effort)
     FAIR.        (workable but mixed signals — pick the right window)
     TOUGH.       (high-pressure stale, too hot/cold, or unfavorable timing)
  Line 2: What's most likely to work and when (window of the day).
  Line 3: One concrete tactical recommendation (fly / lure / depth / window).

The first token is consumed by the UI to pick a card tint, so it MUST be on its own first word, followed by a period, then a space.

FISHING HEURISTICS:

Pressure:
  - Steady high (>1020 mb): tough; midday slow; dawn/dusk best.
  - Falling >3 mb / 6h: elite window before the front; aggressive feed.
  - Crashed (<1005 mb): fish sulking; big slow streamers, or wait.
  - Rising post-front: bite recovers over 24-48h.

Water temperature (trout):
  - <38°F: lethargic; midges, slow dead-drift.
  - 38-50°F: nymphing; small dark patterns; few risers.
  - 50-65°F: prime; dry-dropper / emergers; all-day potential.
  - 65-70°F: warm; fish dawn/dusk; release fast.
  - >70°F: do not target trout — stress-lethal.

Water temperature (warmwater / stillwater):
  - <50°F: finesse; jigs slow along the bottom.
  - 50-60°F: pre-spawn cool; bass staging on transitions.
  - 60-72°F: prime; full water column in play.
  - 72-80°F: dawn/dusk topwater best; deep cover midday.
  - >80°F: deep + slow; shaded structure.

Dam generation:
  - No gen: wadeable; smaller flies in slow seams.
  - 1 unit: transitional; bite often turns on as water rises; nymph deeper.
  - 2+ units: float-only streamer game; tight to banks.
  - First hour AFTER generation stops = often the best window.

Solunar:
  - Major periods (lunar transit) are the strongest 2-hour windows of the day. Mention if one overlaps a feeding-favorable time of day (dawn, dusk, post-thermal turnover).
  - New moon / full moon = stronger periods. Quarter moons = weaker but still real.

Hatches & timing:
  - Match the hatch when one is on.
  - Sulfurs (50-62°F water, evenings) drive Southern tailwaters May onward.
  - Hex (June 15-30, MI, after dark): plan around it; size 6 dries.
  - Tricos July-September mornings: 22s on 7x.

Trolling (Great Lakes / deep lakes):
  - If a trolling-depth estimate is provided for a target species, use those exact numbers in the briefing. Don't reinvent.
  - Surface temps drive depth: cold = shallow, warm = downriggers.
  - Stinger spoons in chrome/orange when sun is bright; glow/UV at dawn.
  - Speed: walleye 1.2-1.8 mph, lake trout 1.8-2.4, kings 2.4-3.2.

Stocking:
  - Stocking <3d ago = lead with it. Small spinners, salmon eggs, Powerbait, size 12 nymph.
  - Day 1-2 peak; by day 7-10 the truck-chasers have thinned them.
  - >14d ago — skip unless other intel is empty.

Waterbody-curated species:
  - When a curated species list is provided for the spot, recommend ONE of those species, not generic "fish." A Lake St. Clair pin should mention smallmouth/muskie/walleye, not generic "bass."

Run barriers (salmon / steelhead rivers):
  - When a "run limits" list is provided, the spot is ON a river with an anadromous run. Use the listed barrier (e.g. "Tippy Dam") in your tactical recommendation when the timing is right:
    * Sept-Oct: kings stack BELOW the barrier — recommend skein / spawn / streamers near the dam.
    * Oct-April: steelhead are present below the barrier — eggs, beads, swung soft-hackles.
    * March-May: spring steelhead run.
  - Do NOT recommend salmon / steelhead on a section above the barrier — they cannot physically reach it. If the spot is upstream of the barrier, default to resident trout / smallmouth tactics instead.

CONSTRAINTS:
  - Exactly 3 sentences. One per line. The very first word is always the bite-quality token.
  - No bullet points, no markdown, no headers, no emoji.
  - No "weather is..." narration — go straight to the implication.
  - At most ONE concrete fly/lure recommendation per briefing.
  - If data is genuinely empty, say so briefly but still finish in 3 sentences.`;

export const briefing = onCall(
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
    const input = request.data as BriefingInput & {
      /** Stable shareable cache key the client computed from waterbody
       *  id or rounded GPS + date. When present, we check the shared
       *  Firestore cache before spending tokens. */
      sharedCacheKey?: string;
    };

    if (!input?.locationName) {
      throw new HttpsError('invalid-argument', 'locationName required');
    }

    // Shared-cache short-circuit: another user may have generated this
    // exact spot+date briefing already. Daily cap is NOT incremented
    // on a cache hit since we didn't spend any tokens.
    const db = getFirestore();
    if (input.sharedCacheKey) {
      try {
        const cacheRef = db.collection('briefings').doc(input.sharedCacheKey);
        const cached = await cacheRef.get();
        const data = cached.data();
        if (cached.exists && data?.briefing && data?.expiresAtMs > Date.now()) {
          logger.info('briefing cache hit', {
            uid,
            cacheKey: input.sharedCacheKey,
            ageHours: Math.round(
              (Date.now() - (data.createdAtMs ?? 0)) / 3600_000
            ),
          });
          return {
            briefing: data.briefing,
            biteQuality: data.biteQuality ?? null,
            citations: data.citations ?? [],
            fromSharedCache: true,
          };
        }
      } catch (e) {
        // Cache read failure is not fatal — fall through to generation.
        logger.warn('briefing cache read failed', {
          uid,
          error: String(e),
        });
      }
    }

    await checkAndIncrementUsage(uid, 'briefing');

    const userMessage = formatInputs(input);

    const response = await anthropic().messages.create({
      model: MODELS.briefing,
      // 3 sentences fit in ~150 output tokens; 400 is plenty of margin.
      // Down from 1200, which was reserving budget for web_search-augmented
      // briefings that the prompt no longer enables.
      max_tokens: 400,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      // No web_search tool — we provide enough structured context that
      // the model never needed it for the 3-sentence read, and each
      // web_search invocation added ~$0.01-$0.05 to the call. The
      // model still cites where appropriate from the structured inputs.
      messages: [{ role: 'user', content: userMessage }],
    });

    await recordTokens(uid, 'briefing', response.usage);

    // Pull text blocks (the prose) and any citations attached to them.
    const textBlocks = response.content.filter(
      (b): b is Anthropic.Messages.TextBlock => b.type === 'text'
    );
    const rawText = textBlocks.map((b) => b.text).join('\n').trim();

    const citations: Array<{ url: string; title: string }> = [];
    for (const block of textBlocks) {
      // The Anthropic SDK types `citations` as `unknown[] | null` because
      // their shape varies by tool. We accept any object with url+title.
      const cites = (block as unknown as { citations?: unknown[] | null })
        .citations;
      if (!cites || !Array.isArray(cites)) continue;
      for (const c of cites) {
        if (!c || typeof c !== 'object') continue;
        const obj = c as Record<string, unknown>;
        const url = typeof obj.url === 'string' ? obj.url : null;
        if (!url) continue;
        const title = typeof obj.title === 'string' ? obj.title : url;
        // Dedupe — Claude often cites the same source per sentence.
        if (!citations.find((x) => x.url === url)) {
          citations.push({ url, title });
        }
      }
    }

    // Extract the bite-quality token from the leading word of line 1.
    const biteQuality = extractBiteQuality(rawText);
    // Strip the leading token from the briefing text — the UI renders
    // the badge separately, no need to repeat it in prose.
    const cleanText = biteQuality
      ? rawText.replace(/^(PRIME|GOOD|FAIR|TOUGH)\.\s+/, '')
      : rawText;

    logger.info('briefing generated', {
      uid,
      location: input.locationName,
      bite: biteQuality,
      citations: citations.length,
      input_tokens: response.usage.input_tokens,
      output_tokens: response.usage.output_tokens,
      cache_read: response.usage.cache_read_input_tokens,
      sharedCacheKey: input.sharedCacheKey,
    });

    // Persist to the shared cache so the next user viewing this spot
    // today gets it for free. TTL ~6 hours so big intraday weather
    // shifts (front coming through) trigger a fresh read.
    if (input.sharedCacheKey) {
      try {
        const TTL_MS = 6 * 60 * 60 * 1000;
        await db
          .collection('briefings')
          .doc(input.sharedCacheKey)
          .set({
            briefing: cleanText,
            biteQuality,
            citations,
            createdAtMs: Date.now(),
            expiresAtMs: Date.now() + TTL_MS,
            updatedAt: FieldValue.serverTimestamp(),
            generatedByUid: uid,
            location: input.locationName,
          });
      } catch (e) {
        logger.warn('briefing cache write failed', {
          uid,
          cacheKey: input.sharedCacheKey,
          error: String(e),
        });
      }
    }

    return {
      briefing: cleanText,
      biteQuality,
      citations,
      fromSharedCache: false,
    };
  }
);

function extractBiteQuality(text: string):
  | 'prime'
  | 'good'
  | 'fair'
  | 'tough'
  | null {
  const m = text.match(/^(PRIME|GOOD|FAIR|TOUGH)\./);
  if (!m) return null;
  return m[1].toLowerCase() as 'prime' | 'good' | 'fair' | 'tough';
}

function formatInputs(i: BriefingInput): string {
  const lines: string[] = [];
  lines.push(`Location: ${i.locationName}`);
  if (i.river) lines.push(`River: ${i.river}`);
  lines.push(`Type: ${i.waterType}  State: ${i.state}`);

  if (i.waterbody) {
    lines.push('');
    lines.push(`WATERBODY (curated): ${i.waterbody.name}`);
    if (i.waterbody.species.length > 0) {
      lines.push(`  Target species here: ${i.waterbody.species.join(', ')}`);
    }
    if (i.waterbody.accessNotes) {
      lines.push(`  Access note: ${i.waterbody.accessNotes}`);
    }
    if (i.waterbody.runLimits && i.waterbody.runLimits.length > 0) {
      lines.push(`  Anadromous run limits:`);
      for (const r of i.waterbody.runLimits) {
        lines.push(
          `    - ${r.species} → ${r.limit}${r.note ? ` (${r.note})` : ''}`
        );
      }
    }
  }

  lines.push('');
  lines.push('CURRENT CONDITIONS:');
  lines.push(
    `  Air: ${Math.round(i.currentConditions.airTempF)}°F, ${
      i.currentConditions.weatherSummary
    }`
  );
  if (i.currentConditions.waterTempF != null) {
    lines.push(`  River water: ${Math.round(i.currentConditions.waterTempF)}°F`);
  }
  if (i.currentConditions.lakeSurfaceTempF != null) {
    const estTag = i.currentConditions.lakeSurfaceTempIsEstimated
      ? ' (estimated from air-temp model)'
      : '';
    lines.push(
      `  Lake surface: ${Math.round(
        i.currentConditions.lakeSurfaceTempF
      )}°F${estTag}`
    );
  }
  if (i.currentConditions.flowCfs != null) {
    lines.push(`  Flow: ${Math.round(i.currentConditions.flowCfs)} cfs`);
  }
  lines.push(
    `  Pressure: ${Math.round(i.currentConditions.pressureMb)} mb, ${
      i.currentConditions.pressureTrend
    }`
  );
  if (i.currentConditions.windMph != null) {
    const dir = i.currentConditions.windDirection
      ? ` ${i.currentConditions.windDirection}`
      : '';
    lines.push(`  Wind: ${Math.round(i.currentConditions.windMph)} mph${dir}`);
  }
  if (i.currentConditions.cloudCoverPct != null) {
    lines.push(`  Cloud cover: ${Math.round(i.currentConditions.cloudCoverPct)}%`);
  }
  if (i.currentConditions.waveHeightFt != null) {
    lines.push(`  Waves: ${i.currentConditions.waveHeightFt.toFixed(1)} ft`);
  }

  if (i.daily) {
    const bits: string[] = [];
    if (i.daily.tempMaxF != null && i.daily.tempMinF != null) {
      bits.push(
        `${Math.round(i.daily.tempMinF)}°F → ${Math.round(i.daily.tempMaxF)}°F`
      );
    }
    if (i.daily.sunriseLocal) bits.push(`sunrise ${i.daily.sunriseLocal}`);
    if (i.daily.sunsetLocal) bits.push(`sunset ${i.daily.sunsetLocal}`);
    if (bits.length > 0) {
      lines.push(`  Today: ${bits.join(' · ')}`);
    }
  }

  if (i.nextSixHours && i.nextSixHours.length > 0) {
    const compact = i.nextSixHours
      .map(
        (h) =>
          `${h.hourLabel} ${Math.round(h.tempF)}°` +
          (h.precipProbPct != null && h.precipProbPct >= 20
            ? ` ${h.precipProbPct}%rain`
            : '')
      )
      .join(', ');
    lines.push(`  Next 6h: ${compact}`);
  }

  if (i.solunar) {
    lines.push('');
    lines.push('SOLUNAR:');
    lines.push(
      `  Moon: ${i.solunar.moonPhaseLabel} (${i.solunar.moonIlluminationPct}% illuminated)`
    );
    if (i.solunar.majorWindowsLocal.length > 0) {
      lines.push(`  Major windows: ${i.solunar.majorWindowsLocal.join(', ')}`);
    }
    if (i.solunar.minorWindowsLocal.length > 0) {
      lines.push(`  Minor windows: ${i.solunar.minorWindowsLocal.join(', ')}`);
    }
  }

  if (i.dam) {
    lines.push('');
    lines.push('DAM:');
    lines.push(
      `  ${i.dam.name}: ${i.dam.currentStatus}${
        i.dam.nextChange ? `, ${i.dam.nextChange}` : ''
      }`
    );
  }

  if (i.activeHatches.length > 0) {
    lines.push('');
    lines.push('ACTIVE HATCHES:');
    for (const h of i.activeHatches.slice(0, 4)) {
      lines.push(`  ${h.name} (${h.tempRange}, ${h.timeOfDay}) — ${h.flies}`);
    }
  }

  if (i.trollingDepths && i.trollingDepths.length > 0) {
    lines.push('');
    lines.push('TROLLING DEPTHS (from seasonal/thermal model):');
    for (const td of i.trollingDepths.slice(0, 5)) {
      const therm =
        td.thermoclineFt != null ? `, thermocline ~${td.thermoclineFt} ft` : '';
      lines.push(
        `  ${td.species}: ${td.depthRangeFt[0]}-${td.depthRangeFt[1]} ft${therm}`
      );
    }
  }

  if (i.recentStockings && i.recentStockings.length > 0) {
    lines.push('');
    lines.push('RECENT STOCKING WITHIN ~25 MI:');
    for (const s of i.recentStockings) {
      const count = s.count != null ? `${s.count.toLocaleString()} ` : '';
      const size = s.size ? ` (${s.size})` : '';
      lines.push(
        `  ${s.daysAgo}d ago — ${count}${s.species}${size} @ ${s.locationName}`
      );
    }
  }

  return lines.join('\n');
}
