import type { LakeDataProvider } from '@/lib/providers/types';

/**
 * Hand-curated lookup of major US lakes to their best-available
 * real-time data sources. Drives the Add-Spot auto-detect for
 * stillwater pins so we never end up binding a tributary-river
 * gauge as "lake data" — that produced the very wrong "the three
 * rivers flowing into Lake St. Clair show up as lake data" bug.
 *
 * For each known lake we list one or more candidate providers in
 * priority order. The auto-detect picks the first entry; the rest
 * appear as "alternative source" choices in the picker UI.
 *
 * Why bbox rather than name match? Nominatim's `water` field is
 * inconsistent across regions ("Lake St. Clair" vs "Lac Sainte
 * Claire" vs raw geometry). A bbox catches every Nominatim
 * spelling and any pin dropped on the lake's surface, including
 * the shoreline.
 */

export interface KnownLake {
  /** Display name for chips + form hints. */
  name: string;
  /**
   * Bounding box: [southLat, westLng, northLat, eastLng].
   * Pin inside this rectangle → use these stations as lake data.
   */
  bbox: [number, number, number, number];
  /**
   * Candidate lake-data providers in priority order. The auto-detect
   * picks `[0]`; later entries surface as picker alternatives so the
   * user can switch (e.g., Lake St. Clair → West Erie buoy as primary,
   * Southern Huron buoy as alternative for upstream surface temp).
   */
  stations: Array<{
    provider: LakeDataProvider;
    /** Friendly label like "West Lake Erie (open-lake buoy, 58 mi)". */
    label: string;
  }>;
}

const KNOWN_LAKES: KnownLake[] = [
  // ---- Great Lakes & connected waters --------------------------------
  // Lake St. Clair has no dedicated NDBC buoy. The closest open-water
  // station reporting surface temp is 45005 (West Lake Erie). St. Clair
  // and Erie are part of the same Detroit-River → Lake-Erie water system,
  // so surface temp tracks closely. Far better than a tributary gauge.
  {
    name: 'Lake St. Clair',
    bbox: [42.30, -83.00, 42.70, -82.35],
    stations: [
      {
        provider: { kind: 'noaa-buoy', stationId: '45005' },
        label: 'NDBC 45005 — West Lake Erie (closest open-lake buoy)',
      },
      {
        provider: { kind: 'noaa-buoy', stationId: '45149' },
        label: 'NDBC 45149 — Southern Lake Huron (upstream water mass)',
      },
    ],
  },
  {
    name: 'Lake Erie',
    bbox: [41.40, -83.50, 42.90, -78.80],
    stations: [
      {
        provider: { kind: 'noaa-buoy', stationId: '45005' },
        label: 'NDBC 45005 — West Lake Erie',
      },
      {
        provider: { kind: 'noaa-buoy', stationId: '45142' },
        label: 'NDBC 45142 — South Erie',
      },
      {
        provider: { kind: 'noaa-buoy', stationId: '45132' },
        label: 'NDBC 45132 — Port Stanley',
      },
    ],
  },
  {
    name: 'Lake Huron',
    bbox: [43.00, -84.60, 46.30, -79.60],
    stations: [
      {
        provider: { kind: 'noaa-buoy', stationId: '45008' },
        label: 'NDBC 45008 — South Lake Huron',
      },
      {
        provider: { kind: 'noaa-buoy', stationId: '45149' },
        label: 'NDBC 45149 — Southern Lake Huron',
      },
      {
        provider: { kind: 'noaa-buoy', stationId: '45003' },
        label: 'NDBC 45003 — North Huron',
      },
    ],
  },
  {
    name: 'Lake Michigan',
    bbox: [41.60, -88.00, 46.10, -85.00],
    stations: [
      {
        provider: { kind: 'noaa-buoy', stationId: '45007' },
        label: 'NDBC 45007 — South Lake Michigan',
      },
      {
        provider: { kind: 'noaa-buoy', stationId: '45002' },
        label: 'NDBC 45002 — North Lake Michigan',
      },
    ],
  },
  {
    name: 'Lake Superior',
    bbox: [46.50, -92.50, 49.00, -84.30],
    stations: [
      {
        provider: { kind: 'noaa-buoy', stationId: '45004' },
        label: 'NDBC 45004 — East Lake Superior',
      },
      {
        provider: { kind: 'noaa-buoy', stationId: '45001' },
        label: 'NDBC 45001 — Mid Superior',
      },
      {
        provider: { kind: 'noaa-buoy', stationId: '45006' },
        label: 'NDBC 45006 — Western Lake Superior',
      },
    ],
  },
  {
    name: 'Lake Ontario',
    bbox: [43.20, -79.90, 44.20, -76.00],
    stations: [
      {
        provider: { kind: 'noaa-buoy', stationId: '45012' },
        label: 'NDBC 45012 — Lake Ontario',
      },
    ],
  },
  // ---- Major inland reservoirs ---------------------------------------
  // USGS publishes lake elevation + sometimes water temp at the dam
  // outflow for TVA/USACE reservoirs. The site name includes "Lake" /
  // "Reservoir" / dam name so it's distinguishable from tributary
  // gauges. Confirmed live for the four listed; others can be added.
  {
    name: 'Lake Cumberland',
    bbox: [36.85, -85.50, 37.10, -84.60],
    stations: [
      {
        provider: { kind: 'usgs-lake', siteId: '03413000' },
        label: 'USGS 03413000 — Lake Cumberland at Wolf Creek Dam',
      },
    ],
  },
  {
    name: 'Dale Hollow Lake',
    bbox: [36.45, -85.55, 36.70, -85.10],
    stations: [
      {
        provider: { kind: 'usgs-lake', siteId: '03413200' },
        label: 'USGS 03413200 — Dale Hollow Lake near Celina',
      },
    ],
  },
  {
    name: 'Center Hill Lake',
    bbox: [35.95, -85.95, 36.20, -85.50],
    stations: [
      {
        provider: { kind: 'usgs-lake', siteId: '03418070' },
        label: 'USGS 03418070 — Center Hill Lake near Lancaster',
      },
    ],
  },
  {
    name: 'Norris Lake',
    bbox: [36.15, -84.30, 36.40, -83.50],
    stations: [
      {
        provider: { kind: 'usgs-lake', siteId: '03533500' },
        label: 'USGS 03533500 — Norris Lake near Norris',
      },
    ],
  },
];

export interface KnownLakeMatch {
  lake: KnownLake;
  primary: KnownLake['stations'][number];
  alternatives: KnownLake['stations'];
}

/**
 * Returns the curated lake match for a given lat/lng, or null if the
 * pin doesn't fall inside any known-lake bbox.
 *
 * Iterates linearly through the curated list. There aren't enough
 * entries to warrant a spatial index — even at 100 lakes a linear
 * scan is sub-microsecond.
 */
export function lookupKnownLake(
  lat: number,
  lng: number
): KnownLakeMatch | null {
  for (const lake of KNOWN_LAKES) {
    const [s, w, n, e] = lake.bbox;
    if (lat >= s && lat <= n && lng >= w && lng <= e) {
      return {
        lake,
        primary: lake.stations[0],
        alternatives: lake.stations.slice(1),
      };
    }
  }
  return null;
}
