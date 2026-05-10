import hatchesData from '@/../data/hatches.json';
import type { Location } from '@/lib/providers/types';

export interface Hatch {
  id: string;
  name: string;
  scientific: string;
  regions: string[];
  states: string[];
  rivers: string[];
  startMonth: number;        // 1-12
  endMonth: number;
  waterTempMinF: number;
  waterTempMaxF: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' | 'all day';
  stages: string[];
  flies: string[];
  notes: string;
  /** Short search-friendly common name used to build YouTube / image links. */
  searchTerm?: string;
  /** Wikipedia article slug if available, null otherwise. */
  wikipediaSlug?: string | null;
}

const ALL: Hatch[] = hatchesData as Hatch[];

export function allHatches(): Hatch[] {
  return ALL;
}

/**
 * Returns hatches that are plausibly active right now for this location,
 * given the current month and (optionally) water temperature. Sorted by
 * how well they fit the temp window — better matches first.
 */
export function activeHatchesForLocation(
  location: Location,
  waterTempF: number | null,
  when: Date = new Date()
): Hatch[] {
  const month = monthInTz(when, location.timezone);
  const river = location.river?.toLowerCase();
  const state = location.state.toUpperCase();

  const candidates = ALL.filter((h) => {
    if (!inMonthRange(month, h.startMonth, h.endMonth)) return false;
    // States[] empty means "everywhere"; otherwise must include the state.
    if (h.states.length > 0 && !h.states.includes(state)) return false;
    // If hatch specifies rivers, prefer matches but don't block when other
    // gating already narrows. We score river matches below.
    return true;
  });

  return candidates
    .map((h) => ({ h, score: scoreHatch(h, river, waterTempF) }))
    // Drop hatches whose temp window is way off — keep "no temp data" hatches.
    .filter((row) => row.score > -100)
    .sort((a, b) => b.score - a.score)
    .map((row) => row.h);
}

function inMonthRange(month: number, start: number, end: number): boolean {
  if (start <= end) return month >= start && month <= end;
  // Wraps year boundary (e.g. start=11, end=2)
  return month >= start || month <= end;
}

function scoreHatch(
  h: Hatch,
  river: string | undefined,
  waterTempF: number | null
): number {
  let score = 0;
  if (river && h.rivers.some((r) => r.toLowerCase() === river)) score += 10;
  if (waterTempF != null) {
    if (waterTempF >= h.waterTempMinF && waterTempF <= h.waterTempMaxF) {
      score += 5;
    } else {
      const dist = Math.min(
        Math.abs(waterTempF - h.waterTempMinF),
        Math.abs(waterTempF - h.waterTempMaxF)
      );
      if (dist > 10) score -= 100;             // way out of range — drop
      else score -= dist;
    }
  }
  return score;
}

function monthInTz(d: Date, tz: string): number {
  return parseInt(
    new Intl.DateTimeFormat('en-US', { timeZone: tz, month: 'numeric' }).format(d),
    10
  );
}

/**
 * The Hex hatch is a Manistee/Au-Sable highlight that anglers literally
 * plan trips around. We hard-code mid-June as the typical peak and surface
 * a countdown in the conditions card from May 15 onward, until peak day.
 */
export function hexCountdown(
  location: Location,
  when: Date = new Date()
): { daysUntil: number; peakDate: string } | null {
  const river = location.river?.toLowerCase();
  if (river !== 'manistee' && location.state !== 'MI') return null;

  const year = parseInt(
    new Intl.DateTimeFormat('en-US', {
      timeZone: location.timezone,
      year: 'numeric',
    }).format(when),
    10
  );
  // Typical peak: June 20 (third week of June).
  const peak = new Date(Date.UTC(year, 5, 20));
  const today = new Date(
    Date.UTC(
      when.getUTCFullYear(),
      when.getUTCMonth(),
      when.getUTCDate()
    )
  );
  const ms = peak.getTime() - today.getTime();
  const days = Math.round(ms / (24 * 60 * 60 * 1000));

  // Show from May 15 (≈ 35 days out) through the peak.
  if (days > 35 || days < -7) return null;
  return {
    daysUntil: days,
    peakDate: peak.toISOString().slice(0, 10),
  };
}
