import type Anthropic from '@anthropic-ai/sdk';
import { logger } from 'firebase-functions';
import { anthropic, MODELS } from '../../claude/_shared';
import type { StockingScrapeRecord, StockingSource } from './types';

/**
 * AI-powered stocking-event extractor.
 *
 * Why this exists: the hand-rolled state-DNR scrapers (TWRA, MI DNR,
 * etc.) keep returning 0 records — most DNRs publish behind ASP.NET
 * form-based UIs that require POST + ViewState parameters or behind
 * JS-rendered tables. Pure HTML parsing is brittle and breaks every
 * time a page layout changes.
 *
 * Instead, this module asks Claude (with the built-in web_search
 * tool) to find recent stocking events for a given state and return
 * them as structured JSON. Claude can navigate the official DNR
 * pages, news posts, and fishing-club summaries — whatever indexes
 * the data — and respond with clean records.
 *
 * Cost discipline: this runs weekly per state on a cron. Each call
 * is one Claude w/ web_search request with a small output_token cap.
 * Expected: ~$0.05 per state per week → < $1/month even at 17 states.
 *
 * Output format: same `StockingScrapeRecord` shape as the legacy
 * scrapers, so the orchestrator can persist them identically.
 */

interface StockingExtractInput {
  state: string;                 // USPS 2-letter code
  source: StockingSource;        // for the source tag on persisted docs
  /** Window in days back from today. Defaults to 60 — covers spring +
   * early-summer trout and salmon stocking when the call fires. */
  lookbackDays?: number;
  /**
   * Optional list of specific water-body names to focus the search
   * on. When provided, the prompt asks Claude to prioritize stocking
   * events on these waters. Lets the orchestrator seed the query
   * with the user's actual fishery (Manistee, Pere Marquette, etc.)
   * instead of asking Claude to scan the entire state generically.
   */
  focusWaters?: string[];
  /**
   * Optional direct PDF URL the state publishes (Georgia's weekly
   * trout-stocking report, for instance). When provided, we fetch
   * the PDF binary + attach it to the Claude message as a document
   * block so it can read the report directly. Way more reliable
   * than web_search guessing — Claude sees the actual document
   * and parses every row.
   */
  directPdfUrl?: string;
}

const SYSTEM_PROMPT = `You are a fishing-data assistant. Use the web_search tool to find recent SPECIFIC fish stocking events from the given state's DNR / wildlife agency database. Return STRUCTURED JSON only — no prose, no markdown, no commentary.

OUTPUT FORMAT (strict JSON, no other text):
{
  "events": [
    {
      "date": "YYYY-MM-DD",
      "species": "Rainbow trout" | "Brown trout" | "Brook trout" | "Lake trout" | "Splake" | "Steelhead" | "King salmon" | "Coho salmon" | "Atlantic salmon" | "Walleye" | "Northern pike" | "Muskellunge" | etc,
      "water": "Manistee River" | "Lake Cumberland" | etc. (the SPECIFIC named body of water — never generic),
      "county": "Kalkaska" | "DeKalb" | etc. (county where the stocking happened, optional),
      "count": 5000 (integer, optional),
      "size": "9-11 in" | "fingerlings" (optional),
      "notes": "Brief context if it adds value, e.g. 'pre-spawn brood stock' or 'hatchery: Wolf Lake'."
    },
    ...
  ]
}

CRITICAL: SPECIFICITY IS THE WHOLE POINT.

Every event MUST name a specific water body. An angler with a spot on the Manistee River in Kalkaska County, MI wants to know "5,000 brown trout stocked in the Manistee River, Kalkaska Co. on April 12" — not "MI DNR stocked multiple inland waters statewide this spring." We already know the agency exists; we need the granular records.

REJECT and DO NOT INCLUDE any event whose 'water' field would be:
- "Multiple inland waters statewide"
- "Various lakes"
- "Numerous rivers"
- "Statewide stocking"
- "Multiple counties"
- Any phrasing that bundles many waters into one record.

If the only data available is summary-level, return {"events": []} — empty is better than misleading.

WHERE TO SEARCH:
1. The state DNR's fish-stocking database (e.g., Michigan: https://www2.dnr.state.mi.us/fishstock/). These pages publish per-event records with date / species / specific water / county / count / size.
2. State DNR weekly stocking reports (often distributed as PDFs or press releases that list specific waters).
3. Local fishing-club / news mentions that pinpoint a specific water + date.

RULES:
- Only include events from the requested state.
- Only include events within the requested lookback window.
- Do NOT invent events. If a number / county / size is uncertain, omit that field — never make one up.
- Use the canonical species name (e.g., "Brown trout" not "browns" or "BNT").
- Date is the date the fish were placed in the water, in ISO format.
- Return AT MOST 200 events. If there are more, prioritize most-recent.

The web_search tool is your only research mechanism. Use 2-4 queries maximum, focused on the SPECIFIC database / records page if possible (not just generic news).`;

/**
 * Asks Claude to extract recent stocking events for the given state.
 * Returns the parsed events (possibly empty) and a diagnostic so the
 * orchestrator can log what Claude actually did.
 */
export interface AiExtractResult {
  events: StockingScrapeRecord[];
  rawText: string;
  /** Set when the API call itself failed. Used by the orchestrator to
   *  emit a clear diagnostic ('ai_credits_low' vs 'ai_failed'). */
  apiErrorKind?: 'credits_low' | 'api_error';
  apiErrorMessage?: string;
}

export async function aiExtractStocking(
  input: StockingExtractInput
): Promise<AiExtractResult> {
  const lookbackDays = input.lookbackDays ?? 60;
  const focusList =
    input.focusWaters && input.focusWaters.length > 0
      ? `\n\nFOCUS WATERS — the user has spots on these specific waters in ${stateName(
          input.state
        )}. Prioritize stocking events on these by name (do not exclude others, but make sure these are covered if data exists):\n` +
        input.focusWaters
          .slice(0, 60)
          .map((w) => `  - ${w}`)
          .join('\n')
      : '';
  // When a PDF is attached, tell Claude to read it directly — no
  // web search, no guessing. Otherwise instruct it to use web_search
  // sparingly (1-2 queries) to keep cost bounded.
  const userMessage = input.directPdfUrl
    ? `Extract fish stocking events from the attached PDF (${stateName(
        input.state
      )} weekly stocking report). Today is ${new Date()
        .toISOString()
        .slice(0, 10)}. Return events from the last ${lookbackDays} days. ` +
      `Each returned event MUST name a specific water body — reject 'statewide' / ` +
      `'multiple waters' / 'various' summaries.` +
      focusList
    : `Find fish stocking events in ${stateName(input.state)} (${input.state}) ` +
      `from the last ${lookbackDays} days. ` +
      `Today is ${new Date().toISOString().slice(0, 10)}. ` +
      `Use AT MOST 2 web searches focused on the ${stateName(
        input.state
      )} DNR fish stocking database. ` +
      `Each returned event MUST name a specific water body — reject 'statewide' / ` +
      `'multiple waters' / 'various' summaries.` +
      focusList;

  // Build the user message content. Default: text-only with
  // web_search tool. When a PDF URL is supplied, fetch the bytes
  // and attach as a document block so Claude reads the report
  // directly (no web_search guessing).
  const userContent: Anthropic.Messages.ContentBlockParam[] = [];
  let docFetchNote: string | null = null;
  if (input.directPdfUrl) {
    try {
      const pdfRes = await fetch(input.directPdfUrl, {
        headers: { Accept: 'application/pdf' },
      });
      if (!pdfRes.ok) {
        throw new Error(`HTTP ${pdfRes.status}`);
      }
      const buf = Buffer.from(await pdfRes.arrayBuffer());
      const data = buf.toString('base64');
      userContent.push({
        type: 'document',
        source: {
          type: 'base64',
          media_type: 'application/pdf',
          data,
        },
      });
      docFetchNote = `Attached PDF from ${input.directPdfUrl} (${buf.length} bytes).`;
    } catch (e) {
      logger.warn('aiExtractStocking.pdf_fetch_failed', {
        url: input.directPdfUrl,
        error: String(e),
      });
      docFetchNote = `Could not attach PDF (${String(e)}); falling back to web search.`;
    }
  }
  userContent.push({
    type: 'text',
    text: docFetchNote
      ? `${docFetchNote}\n\n${userMessage}`
      : userMessage,
  });

  // Token-spend discipline:
  //   - Haiku 4.5 instead of Sonnet 4.6 → 3× cheaper input + output
  //     ($1/$5 vs $3/$15 per M). Parsing structured records from a
  //     PDF or DNR page is well within Haiku's range.
  //   - max_tokens: 2000 (was 4000). A 200-event JSON list comfortably
  //     fits in 2K output. Capping bounds the worst-case cost per call.
  //   - Web search ONLY when no PDF is attached. When a PDF is provided
  //     Claude has the source-of-truth document in-context — letting
  //     it also web_search wastes tokens reading SEO pages.
  // Anthropic now requires `allowed_callers: ['direct']` on web_search
  // when invoked from models that don't support programmatic tool calling
  // (Haiku 4.5 is one — the API returns a 400 with exact wording
  // "Explicitly set allowed_callers=['direct'] on these tools"). Setting
  // it unconditionally is safe for Sonnet/Opus too.
  const tools: Anthropic.Messages.ToolUnion[] | undefined = input.directPdfUrl
    ? undefined
    : [{ type: 'web_search_20260209', name: 'web_search', allowed_callers: ['direct'] } as never];

  let response: Anthropic.Messages.Message;
  try {
    response = await anthropic().messages.create({
      model: MODELS.stockingExtract,
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      ...(tools ? { tools } : {}),
      messages: [{ role: 'user', content: userContent }],
    });
  } catch (e) {
    const errStr = String(e);
    logger.error('aiExtractStocking.api_failed', {
      state: input.state,
      error: errStr,
    });
    // Classify so the orchestrator can surface a clear diagnostic.
    // Credit-balance failure is the most actionable (the user can
    // top up at console.anthropic.com); everything else is grouped
    // as a generic api error.
    const apiErrorKind: 'credits_low' | 'api_error' =
      /credit\s*balance\s*is\s*too\s*low/i.test(errStr) ||
      /insufficient\s*credit/i.test(errStr)
        ? 'credits_low'
        : 'api_error';
    return {
      events: [],
      rawText: `API error: ${errStr}`,
      apiErrorKind,
      apiErrorMessage: errStr,
    };
  }

  // Pull the text blocks. Claude often emits one big JSON block.
  const text = response.content
    .filter((b): b is Anthropic.Messages.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim();

  const events = parseEventsJson(text, input.state);

  logger.info('aiExtractStocking.complete', {
    state: input.state,
    eventCount: events.length,
    input_tokens: response.usage.input_tokens,
    output_tokens: response.usage.output_tokens,
  });

  return { events, rawText: text };
}

/**
 * Extracts the events array from Claude's response. Robust to:
 *   - Markdown code fences (```json ... ```)
 *   - Leading prose before the JSON (we look for the first `{` and
 *     last `}` and parse the span)
 *   - Empty / malformed responses (returns [])
 */
function parseEventsJson(
  text: string,
  state: string
): StockingScrapeRecord[] {
  if (!text) return [];

  // Strip ```json ... ``` fences if present.
  let body = text.replace(/```json\s*([\s\S]*?)```/g, '$1');
  body = body.replace(/```([\s\S]*?)```/g, '$1');

  // Find the first `{` and last `}` to peel off any surrounding prose.
  const firstBrace = body.indexOf('{');
  const lastBrace = body.lastIndexOf('}');
  if (firstBrace < 0 || lastBrace < 0 || lastBrace < firstBrace) {
    logger.warn('aiExtractStocking.parse.no_json', {
      state,
      snippet: text.slice(0, 200),
    });
    return [];
  }
  const jsonSlice = body.slice(firstBrace, lastBrace + 1);

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonSlice);
  } catch (e) {
    logger.warn('aiExtractStocking.parse.invalid_json', {
      state,
      error: String(e),
      snippet: jsonSlice.slice(0, 200),
    });
    return [];
  }
  if (!parsed || typeof parsed !== 'object' || !('events' in parsed)) {
    return [];
  }
  const raw = (parsed as { events: unknown }).events;
  if (!Array.isArray(raw)) return [];

  const out: StockingScrapeRecord[] = [];
  let droppedGeneric = 0;
  for (const e of raw) {
    if (!e || typeof e !== 'object') continue;
    const obj = e as Record<string, unknown>;
    const date = typeof obj.date === 'string' ? obj.date : null;
    const species = typeof obj.species === 'string' ? obj.species : null;
    const water = typeof obj.water === 'string' ? obj.water : null;
    if (!date || !species || !water) continue;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
    if (isGenericLocation(water)) {
      droppedGeneric++;
      continue;
    }
    const county = typeof obj.county === 'string' ? obj.county : undefined;
    const count =
      typeof obj.count === 'number' && Number.isFinite(obj.count)
        ? obj.count
        : undefined;
    const size = typeof obj.size === 'string' ? obj.size : undefined;
    const notes = typeof obj.notes === 'string' ? obj.notes : undefined;
    out.push({
      date,
      locationName: county ? `${water} (${county} Co.)` : water,
      state,
      species: normalizeSpecies(species),
      count,
      size,
      notes: notes ?? 'AI-extracted from state DNR + fishing reports',
    });
  }
  if (droppedGeneric > 0) {
    logger.info('aiExtractStocking.dropped_generic', {
      state,
      droppedGeneric,
    });
  }
  return out;
}

/**
 * Filters out "Statewide stocking" / "Multiple inland waters" /
 * "Various lakes" entries that the AI sometimes returns despite the
 * prompt telling it not to. We want SPECIFIC water names — generic
 * bundles are useless because the spot-match filter can't tie them
 * to any one fishery.
 */
function isGenericLocation(water: string): boolean {
  const w = water.toLowerCase();
  if (w.length < 4) return true;
  const patterns = [
    /statewide/,
    /multiple\s+(inland\s+)?(waters|lakes|rivers|streams)/,
    /various\s+(waters|lakes|rivers|streams|locations)/,
    /numerous\s+(waters|lakes|rivers|streams|locations)/,
    /multiple\s+counties/,
    /multiple\s+sites/,
    /\bseveral\s+waters\b/,
    /\bmultiple\s+sites\b/,
    /assorted\s+waters/,
    /^(various|multiple|several|numerous|assorted)\b/,
  ];
  return patterns.some((re) => re.test(w));
}

/** Canonicalize common variations Claude might use. */
function normalizeSpecies(raw: string): string {
  const t = raw.trim().toLowerCase();
  if (!t) return 'Unknown';
  if (t.includes('rainbow')) return 'Rainbow trout';
  if (t.includes('brown')) return 'Brown trout';
  if (t.includes('brook')) return 'Brook trout';
  if (t.includes('lake trout') || /\blaker\b/.test(t)) return 'Lake trout';
  if (t.includes('splake')) return 'Splake';
  if (t.includes('steelhead')) return 'Steelhead';
  if (t.includes('chinook') || /\bking\b/.test(t)) return 'King salmon';
  if (t.includes('coho')) return 'Coho salmon';
  if (t.includes('atlantic salmon')) return 'Atlantic salmon';
  if (t.includes('walleye')) return 'Walleye';
  if (t.includes('muskie') || t.includes('muskellunge')) return 'Muskellunge';
  if (t.includes('northern pike')) return 'Northern pike';
  if (t.includes('lake sturgeon')) return 'Lake sturgeon';
  // Title case fallback
  return raw
    .trim()
    .split(/\s+/)
    .map((w) => (w[0] ? w[0].toUpperCase() + w.slice(1).toLowerCase() : ''))
    .join(' ');
}

function stateName(code: string): string {
  const map: Record<string, string> = {
    MI: 'Michigan',
    TN: 'Tennessee',
    KY: 'Kentucky',
    NC: 'North Carolina',
    GA: 'Georgia',
    FL: 'Florida',
    AL: 'Alabama',
    IN: 'Indiana',
    PA: 'Pennsylvania',
    MT: 'Montana',
    ID: 'Idaho',
    CO: 'Colorado',
    UT: 'Utah',
    AR: 'Arkansas',
    OK: 'Oklahoma',
    MS: 'Mississippi',
    IL: 'Illinois',
    NY: 'New York',
    OH: 'Ohio',
    WI: 'Wisconsin',
  };
  return map[code.toUpperCase()] ?? code;
}
