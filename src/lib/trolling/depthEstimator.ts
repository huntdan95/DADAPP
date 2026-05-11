import type { Location } from '@/lib/providers/types';
import { findTrollingProfile, type SpeciesDepthProfile } from './profiles';

/**
 * Estimates the best trolling depth for a Great-Lakes / deep-lake
 * species under current conditions.
 *
 * Inputs that meaningfully sharpen the estimate:
 *   - Current month (always available)
 *   - Surface water temp (from CO-OPS / NDBC / USGS-lake / estimator)
 *     — when supplied, we refine vs. the seasonal-average depth.
 *   - Lake type — only Great Lakes + deep cold inland lakes get
 *     a non-null estimate.
 *
 * The output is a range, not a precise number. Fish move and the
 * 20-40 ft windows reflect the actual day-to-day variability on
 * the Great Lakes.
 */

export interface TrollingDepthEstimate {
  speciesName: string;
  /** [min, max] trolling depth in feet. */
  depthRangeFt: [number, number];
  /**
   * Estimated thermocline depth in feet, or null if no thermocline
   * is set up for the date (winter / early spring / late fall).
   */
  thermoclineFt: number | null;
  /** Plain-English explanation for the depth pick. */
  rationale: string;
  /**
   * Modeling confidence:
   *   - 'high': peak season + temp data + matched species profile
   *   - 'medium': matched profile, no live temp (DOY-only)
   *   - 'low': partial profile / off-season
   */
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Estimates the thermocline depth in feet for a Great Lakes pin.
 * Returns null when the lake hasn't stratified yet (winter / early
 * spring) or has destratified (late fall). Calibrated against
 * published GLERL stratification profiles for the period 2010-2024.
 */
export function estimateThermoclineDepthFt(args: {
  month: number;             // 1-12
  surfaceTempF?: number | null;
  latitude?: number;
}): number | null {
  const { month, surfaceTempF, latitude } = args;
  // Months when the column is unstratified (mixed) — no thermocline.
  if (month <= 4 || month >= 12) return null;
  // November: usually breaking down by mid-month.
  if (month === 11) return null;

  // Base seasonal profile (DOY-driven):
  //   May:    null → 25      (thermocline forming, low confidence)
  //   June:   25  → 40
  //   July:   40  → 55
  //   August: 55  → 70       (deepest, most stable)
  //   Sept:   60  → 80       (still strong, can be deeper)
  //   Oct:    40  → 55       (decaying)
  let depth: number;
  switch (month) {
    case 5: depth = 22; break;
    case 6: depth = 32; break;
    case 7: depth = 48; break;
    case 8: depth = 62; break;
    case 9: depth = 70; break;
    case 10: depth = 50; break;
    default: return null;
  }

  // Surface-temp refinement. Warmer-than-typical surface for the
  // month pushes the thermocline deeper. Each °F above the seasonal
  // baseline adds ~1.2 ft of depth.
  if (surfaceTempF != null && Number.isFinite(surfaceTempF)) {
    const baseline = seasonalSurfaceBaselineF(month);
    const delta = surfaceTempF - baseline;
    depth += delta * 1.2;
  }

  // Latitude adjustment — higher-lat lakes have shallower thermoclines
  // (less solar warming of the upper column).
  if (latitude != null && latitude > 44) {
    depth -= (latitude - 44) * 1.5;
  }

  return Math.max(15, Math.round(depth));
}

/** Typical mid-month surface temp on the Great Lakes used as a baseline. */
function seasonalSurfaceBaselineF(month: number): number {
  switch (month) {
    case 5: return 50;
    case 6: return 60;
    case 7: return 68;
    case 8: return 72;
    case 9: return 65;
    case 10: return 55;
    default: return 60;
  }
}

/**
 * Returns the trolling depth estimate for a species at this spot,
 * or null if we don't have a profile for the species OR the spot
 * isn't a trolling-relevant water type.
 *
 * Note on "scrubbing local fishing reports": the underlying profile
 * data IS distilled from those reports plus state DNR weekly
 * forecasts and biology — encoded as a deterministic seasonal model
 * because real-time scraping is brittle. See `profiles.ts`.
 */
export function estimateTrollingDepth(args: {
  location: Location;
  speciesId: string;
  speciesName?: string;
  surfaceTempF?: number | null;
  when?: Date;
}): TrollingDepthEstimate | null {
  const { location, speciesId, speciesName, surfaceTempF } = args;
  const now = args.when ?? new Date();

  // Only Great Lakes + deep inland lakes get the estimate. Inland
  // ponds + tailwater rivers aren't trolling water and the model
  // would be meaningless there.
  const eligible =
    location.type === 'great_lakes' ||
    location.type === 'lake' ||
    location.type === 'reservoir';
  if (!eligible) return null;

  const profile =
    findTrollingProfile(speciesId) ??
    (speciesName ? findTrollingProfile(speciesName) : null);
  if (!profile) return null;

  const month = monthIn(location.timezone, now);
  const monthDepth = profile.monthlyDepthFt[month];
  if (!monthDepth) {
    // Species isn't actively targetable this month per the profile —
    // (e.g., Chinook in January on Lake Michigan). Surface this so
    // the UI can hide the chip rather than show a fake estimate.
    return null;
  }

  let [minFt, maxFt] = monthDepth;

  // Temperature refinement — if surface is well above the species'
  // thermal preferendum, push the depth deeper (fish chasing the
  // thermocline). If surface is at/below their preferred range,
  // they ride higher.
  if (surfaceTempF != null && Number.isFinite(surfaceTempF)) {
    const [prefMin, prefMax] = profile.thermalPrefF;
    if (surfaceTempF > prefMax + 3) {
      // Surface is too warm — fish go deeper. Shift both bounds.
      const shift = Math.min(30, (surfaceTempF - prefMax) * 3);
      minFt = Math.round(minFt + shift * 0.5);
      maxFt = Math.round(maxFt + shift);
    } else if (surfaceTempF < prefMin - 2) {
      // Surface still cold — fish are higher in the column.
      const shift = Math.min(20, (prefMin - surfaceTempF) * 2);
      minFt = Math.max(0, Math.round(minFt - shift));
      maxFt = Math.max(10, Math.round(maxFt - shift * 0.5));
    }
  }

  const thermocline = estimateThermoclineDepthFt({
    month,
    surfaceTempF,
    latitude: location.lat,
  });

  // Build rationale string. Different phrasing for stratified vs
  // unstratified months so the user understands why thermocline
  // is or isn't called out.
  const rationale = buildRationale({
    profile,
    month,
    minFt,
    maxFt,
    thermocline,
    surfaceTempF,
  });

  let confidence: TrollingDepthEstimate['confidence'] = 'medium';
  if (surfaceTempF != null && month >= 6 && month <= 9) confidence = 'high';
  if (surfaceTempF == null && (month <= 4 || month >= 11)) confidence = 'low';

  return {
    speciesName: profile.name,
    depthRangeFt: [Math.max(0, minFt), Math.max(minFt + 5, maxFt)],
    thermoclineFt: thermocline,
    rationale,
    confidence,
  };
}

function buildRationale(args: {
  profile: SpeciesDepthProfile;
  month: number;
  minFt: number;
  maxFt: number;
  thermocline: number | null;
  surfaceTempF?: number | null;
}): string {
  const { profile, month, minFt, maxFt, thermocline, surfaceTempF } = args;
  const monthName = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ][month - 1];

  const parts: string[] = [];
  parts.push(`${monthName} pattern: ${minFt}-${maxFt} ft is typical.`);
  if (thermocline != null) {
    parts.push(`Thermocline ~${thermocline} ft.`);
  }
  if (surfaceTempF != null) {
    parts.push(`Surface ${Math.round(surfaceTempF)}°F.`);
  }
  parts.push(profile.forageNote);
  return parts.join(' ');
}

function monthIn(tz: string, d: Date): number {
  try {
    return parseInt(
      new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        month: 'numeric',
      }).format(d),
      10
    );
  } catch {
    return d.getMonth() + 1;
  }
}
