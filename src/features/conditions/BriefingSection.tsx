import { useEffect, useState } from 'react';
import {
  Loader2,
  Sparkles,
  RefreshCcw,
  ExternalLink,
  Flame,
  TrendingUp,
  Minus,
  TrendingDown,
} from 'lucide-react';
import { CardSection } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { Location } from '@/lib/providers/types';
import {
  fetchWeather,
  fetchFlow,
  fetchDamSchedule,
  fetchLakeData,
} from '@/lib/providers';
import { estimateWaterTemp } from '@/lib/providers/waterTemp/estimator';
import { activeHatchesForLocation } from '@/lib/hatches/store';
import {
  fetchBriefing,
  invalidateBriefingCache,
  readCachedBriefing,
  type BiteQuality,
  type BriefingResponse,
} from '@/lib/ai/briefing';
import { friendlyError } from '@/lib/errors';
import {
  damScheduleKey,
  readDamSchedule,
  todayLocalDate,
} from '@/lib/damSchedule/store';
import {
  fetchRecentStockingNearLocation,
  filterStockingForLocation,
} from '@/lib/stocking/store';

/**
 * "How's the bite?" briefing — Claude pre-trip read on conditions
 * with structured rendering. The model returns:
 *   - briefing text (3 lines, separated by newlines)
 *   - biteQuality: 'prime' | 'good' | 'fair' | 'tough' | null
 *   - citations: web-search source links
 *
 * Renders as a tinted card with a quality badge, one sentence per
 * visual block, and citation chips below. Cached daily per-spot in
 * localStorage so a re-open of the same spot is instant + free.
 */
export function BriefingSection({ location }: { location: Location }) {
  const [response, setResponse] = useState<BriefingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    const cached = readCachedBriefing(location);
    setResponse(cached);
    setFromCache(Boolean(cached));
    setError(null);
  }, [location]);

  async function generate(opts: { force?: boolean } = {}) {
    setLoading(true);
    setError(null);
    try {
      if (opts.force) invalidateBriefingCache(location);
      // Fetch every provider in parallel — slowest call sets the
      // floor on time-to-briefing. Lake-data is optional; falls
      // through to undefined if no provider configured.
      const [weather, flow, damSchedule, lakeReading] = await Promise.all([
        fetchWeather(location.dataProviders.weather, location),
        location.dataProviders.flow
          ? fetchFlow(location.dataProviders.flow).catch(() => undefined)
          : Promise.resolve(undefined),
        location.dataProviders.damSchedule
          ? fetchDamSchedule(
              location.dataProviders.damSchedule,
              location
            ).catch(() => undefined)
          : Promise.resolve(undefined),
        location.dataProviders.lakeData
          ? fetchLakeData(location.dataProviders.lakeData, location).catch(
              () => undefined
            )
          : Promise.resolve(undefined),
      ]);

      const damDoc = location.dataProviders.damSchedule
        ? await readDamSchedule(
            damScheduleKey(
              location.dataProviders.damSchedule,
              todayLocalDate(location.timezone)
            )
          ).catch(() => null)
        : null;

      const hour = currentHourIn(location.timezone);
      const currentUnits = damDoc?.hourlyUnits[hour];
      const damCurrentStatus =
        currentUnits == null
          ? 'unknown'
          : currentUnits === 0
          ? 'no_generation'
          : currentUnits === 1
          ? 'partial'
          : 'heavy';

      // Estimator fallback for the water temp the briefing sees.
      // Mirrors the FlowSection display logic: if neither the flow
      // gauge nor the lake-data provider produced a temp, fall back
      // to the air-temp model (same-waterbody calibrated when
      // possible). Without this the briefing would say "water temp
      // unknown" while the conditions card right above it shows an
      // estimate — they'd visibly disagree.
      let effectiveWaterTempF: number | null =
        flow?.waterTempF ?? lakeReading?.surfaceTempF ?? null;
      let waterTempIsEstimated = lakeReading?.isEstimated ?? false;
      if (effectiveWaterTempF == null) {
        const est = await estimateWaterTemp(location.lat, location.lng).catch(
          () => null
        );
        if (est?.surfaceTempF != null) {
          effectiveWaterTempF = est.surfaceTempF;
          waterTempIsEstimated = true;
        }
      }

      const hatches = activeHatchesForLocation(location, effectiveWaterTempF);

      // If we substituted the estimator's temp because the gauge had
      // none, surface it into the briefing payload too — otherwise
      // Claude would say "water temp unknown" while the card above it
      // shows the estimate. Pass it through `lakeReading` (which
      // already carries the `isEstimated` flag and prints with an
      // "estimated" badge in the server prompt) rather than spoofing
      // the gauge field.
      const lakeReadingForBriefing =
        flow?.waterTempF == null && waterTempIsEstimated && effectiveWaterTempF != null
          ? {
              siteName: 'Estimated · air-temp model',
              observedAt: new Date().toISOString(),
              surfaceTempF: effectiveWaterTempF,
              waveHeightFt: null,
              windMph: null,
              authority: 'estimated' as const,
              isEstimated: true,
            }
          : lakeReading;

      const stockings = await fetchRecentStockingNearLocation(
        location,
        30
      ).catch(() => []);
      const relevantStockings = filterStockingForLocation(stockings, location, 25);

      // No `recentCatches` here on purpose — briefings are now shared
      // across users via a Firestore cache keyed by waterbody + date.
      // For per-user pattern advice tap "Patterns" instead.
      const res = await fetchBriefing({
        location,
        weather,
        flow: flow ?? undefined,
        lakeReading: lakeReadingForBriefing ?? undefined,
        damSchedule: damSchedule ?? undefined,
        damCurrentStatus,
        damNextChange: null,
        activeHatches: hatches,
        recentStockings: relevantStockings.map((s) => ({
          date: s.date,
          species: s.species,
          count: s.count,
          size: s.size,
          locationName: s.locationName,
        })),
        force: opts.force,
      });
      setResponse(res);
      setFromCache(false);
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <CardSection label="How's the bite?">
      {response ? (
        <BriefingCard
          response={response}
          loading={loading}
          fromCache={fromCache}
          onRefresh={() => generate({ force: true })}
        />
      ) : (
        // Stack on mobile, row on wider screens. Long description was
        // overflowing the card on narrow viewports because the parent
        // flex didn't wrap. Description copy also updated — briefings
        // are now shared across the group so "your last 5 catches"
        // (which we dropped to enable cross-user caching) is gone.
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0">
          <Button
            onClick={() => generate()}
            disabled={loading}
            size="sm"
            className="self-start sm:self-auto flex-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Thinking…
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                How's the bite?
              </>
            )}
          </Button>
          <span className="text-xs text-muted min-w-0 break-words">
            Reads weather, water, dam, hatches, solunar, and recent
            stocking. Shared across the group so each spot only
            costs once a day.
          </span>
        </div>
      )}
      {error && <div className="text-xs text-danger mt-1">{error}</div>}
    </CardSection>
  );
}

function BriefingCard({
  response,
  loading,
  fromCache,
  onRefresh,
}: {
  response: BriefingResponse;
  loading: boolean;
  fromCache: boolean;
  onRefresh: () => void;
}) {
  const tone = toneFor(response.biteQuality);
  // Split the briefing into its three sentences. Claude is prompted to
  // put each on its own newline; defensively also split on ". " in
  // case the model produced a single paragraph.
  const sentences = response.briefing
    .split(/\n+/)
    .flatMap((line) => splitSentencesLenient(line))
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div
      className={`min-w-0 max-w-full rounded-xl border ${tone.border} ${tone.bg} px-3 py-3 flex flex-col gap-3 overflow-hidden`}
    >
      <BiteBadge quality={response.biteQuality} />
      <div className="flex flex-col gap-2 min-w-0">
        {sentences.map((s, i) => (
          <SentenceLine key={i} index={i} text={s} />
        ))}
      </div>
      {response.citations && response.citations.length > 0 && (
        <div className="flex flex-col gap-1 pt-1 border-t border-border/50 min-w-0">
          <div className="text-[10px] uppercase tracking-wider text-muted">
            Sources cited
          </div>
          <div className="flex flex-wrap gap-1 min-w-0">
            {response.citations.slice(0, 6).map((c) => (
              <a
                key={c.url}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-info hover:text-accent underline truncate max-w-[140px]"
                title={c.title}
              >
                <ExternalLink className="w-3 h-3 flex-none" />
                <span className="truncate">{hostnameOf(c.url)}</span>
              </a>
            ))}
          </div>
        </div>
      )}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-1 text-xs text-muted hover:text-text underline"
        >
          {loading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <RefreshCcw className="w-3 h-3" />
          )}
          {loading ? 'Asking…' : 'Refresh'}
        </button>
        {fromCache && (
          <span className="text-[10px] text-muted">
            {response.fromSharedCache
              ? "Today's briefing (shared with the group — no tokens spent)"
              : "Today's briefing (cached)"}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Quality badge — color-coded chip with an icon. Falls back to a
 * neutral chip when Claude didn't emit a recognized token (older
 * cached briefings or a hallucinated prefix).
 */
function BiteBadge({ quality }: { quality: BiteQuality | null }) {
  if (!quality) return null;
  const tone = toneFor(quality);
  const Icon = iconFor(quality);
  return (
    <div className="flex items-center gap-2 flex-wrap min-w-0">
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider flex-none ${tone.chipBg} ${tone.chipText}`}
      >
        <Icon className="w-3 h-3" />
        {quality}
      </span>
      <span className="text-[11px] text-muted min-w-0">
        {toneFor(quality).blurb}
      </span>
    </div>
  );
}

/**
 * Single sentence rendered as its own visual block — looks cleaner
 * than a wall-of-text. First sentence is the read (biggest), second
 * is the timing, third is the tactic. Subtle dot markers prefix
 * sentences 2 and 3 to signal sequence without imposing markdown.
 */
function SentenceLine({ index, text }: { index: number; text: string }) {
  return (
    <div className="flex gap-2 min-w-0">
      <div
        className={
          'flex-none mt-1.5 w-1.5 h-1.5 rounded-full ' +
          (index === 0
            ? 'bg-accent'
            : index === 1
            ? 'bg-info/60'
            : 'bg-muted/40')
        }
      />
      <p className="text-sm leading-snug min-w-0 break-words">{text}</p>
    </div>
  );
}

function toneFor(quality: BiteQuality | null): {
  border: string;
  bg: string;
  chipBg: string;
  chipText: string;
  blurb: string;
} {
  switch (quality) {
    case 'prime':
      return {
        border: 'border-accent/40',
        bg: 'bg-accent/10',
        chipBg: 'bg-accent/20',
        chipText: 'text-accent',
        blurb: 'Conditions are aligned — go.',
      };
    case 'good':
      return {
        border: 'border-info/40',
        bg: 'bg-info/10',
        chipBg: 'bg-info/20',
        chipText: 'text-info',
        blurb: 'Solid — fish with intent.',
      };
    case 'fair':
      return {
        border: 'border-warn/40',
        bg: 'bg-warn/10',
        chipBg: 'bg-warn/20',
        chipText: 'text-warn',
        blurb: 'Mixed signals — pick the window.',
      };
    case 'tough':
      return {
        border: 'border-danger/30',
        bg: 'bg-danger/10',
        chipBg: 'bg-danger/20',
        chipText: 'text-danger',
        blurb: 'Working uphill today.',
      };
    default:
      return {
        border: 'border-border',
        bg: 'bg-surface-2/50',
        chipBg: 'bg-surface-2',
        chipText: 'text-muted',
        blurb: '',
      };
  }
}

function iconFor(quality: BiteQuality): typeof Flame {
  switch (quality) {
    case 'prime':
      return Flame;
    case 'good':
      return TrendingUp;
    case 'fair':
      return Minus;
    case 'tough':
      return TrendingDown;
  }
}

function splitSentencesLenient(text: string): string[] {
  // Conservative: split only on `.`/`!`/`?` followed by space+capital.
  // Keeps decimal numbers + abbreviations intact.
  const parts = text.split(/(?<=[.!?])\s+(?=[A-Z])/);
  return parts.filter((p) => p.trim().length > 0);
}

function hostnameOf(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function currentHourIn(timezone: string): number {
  const part = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    hourCycle: 'h23',
    timeZone: timezone,
  }).format(new Date());
  return parseInt(part, 10);
}

// `fetchRecentCatches` removed: per-user recent-catches no longer feed
// into the briefing now that briefings are shared across users. For
// personal pattern advice, tap "Patterns" — it queries the user's own
// journal directly.
