/**
 * Pluggable data-source contract. Each location declares which providers
 * apply to it; the conditions card composes sections accordingly. New regions
 * or water types are added by registering provider implementations — the UI
 * does not branch on state, country, or water type.
 */

export type WeatherProvider = { kind: 'open-meteo' };

export type FlowProvider =
  | { kind: 'usgs'; siteId: string }
  | { kind: 'env-canada'; stationId: string }
  | { kind: 'uk-ea'; stationRef: string };

export type DamScheduleProvider =
  | { kind: 'tva'; dam: string }
  | { kind: 'usace'; district: string; project: string }
  | { kind: 'consumers-energy'; dam: string }
  | { kind: 'manual' }
  /**
   * Auto-derived from the downstream USGS gauge. Compares current discharge
   * against a recent baseline to bucket "no generation / partial / heavy".
   * No scraping needed — works as long as the gauge below the dam is on
   * the IV API.
   */
  | { kind: 'auto'; flowSiteId: string };

export type TidesProvider = { kind: 'noaa'; stationId: string };

export type LakeDataProvider =
  /** USGS NWIS lake / reservoir gauge (water temp, elevation). */
  | { kind: 'usgs-lake'; siteId: string }
  /** NDBC realtime2 buoy or C-MAN station (temp, waves, wind). */
  | { kind: 'noaa-buoy'; stationId: string }
  /**
   * NOAA CO-OPS water-temperature station — shoreline / harbor
   * sensors on the Great Lakes and tidal coast. Same agency as the
   * tide-station network; same `stationId` numbering (7-digit).
   * Distinct from buoys because they're shore-attached and almost
   * always publish water temp + air temp without waves.
   */
  | { kind: 'noaa-coops'; stationId: string }
  /**
   * Air-temperature-driven thermal-mass model. Used as a graceful
   * fallback when no real-time water sensor exists within reach.
   * Reads recent air temp + cloud cover from Open-Meteo and runs
   * an exponentially-weighted-average model with seasonal offset.
   * The UI labels the resulting temp as "estimated" so it's never
   * confused with a measured reading.
   */
  | { kind: 'estimated' };

export interface DataProviders {
  weather: WeatherProvider;
  flow?: FlowProvider;
  damSchedule?: DamScheduleProvider;
  tides?: TidesProvider;
  lakeData?: LakeDataProvider;
}

export type WaterType =
  | 'tailwater'
  | 'freestone'
  | 'lake'
  | 'pond'
  | 'reservoir'
  | 'great_lakes'
  | 'saltwater';

export interface Location {
  id: string;
  name: string;
  state: string;
  country: string;
  /**
   * US county name (without " County" suffix). Auto-detected on pin
   * drop in the location form; useful for stocking-match filters and
   * regional analytics. Not shown as an input.
   */
  county?: string;
  river?: string;
  type: WaterType;
  lat: number;
  lng: number;
  timezone: string;
  notes?: string;
  dataProviders: DataProviders;
}

export type PressureTrend = 'rising-fast' | 'rising' | 'steady' | 'falling' | 'falling-fast';

export interface WeatherReading {
  observedAt: string;
  airTempF: number;
  humidity: number | null;
  pressureMb: number;
  pressureDelta6hMb: number | null;
  pressureTrend: PressureTrend;
  weatherCode: number;
  cloudCoverPct: number | null;
  windMph: number | null;
  forecastHourly: Array<{
    time: string;
    tempF: number;
    precipProbPct: number | null;
    cloudCoverPct: number | null;
  }>;
  daily: {
    sunrise: string;
    sunset: string;
    tempMaxF: number;
    tempMinF: number;
  };
}

export interface FlowReading {
  observedAt: string;
  siteName: string;
  flowCfs: number | null;
  gaugeFt: number | null;
  waterTempF: number | null;
  /**
   * Per-param timestamp for the water-temp reading. Lets callers detect
   * a sensor that's been dark for hours even though the gauge still
   * publishes flow / gauge-height regularly. ISO string when present,
   * undefined when no temp reading exists at all.
   */
  waterTempObservedAt?: string;
  /** Why a value is missing (USGS published a 'no record' or stale flag, etc). */
  notes?: string;
}

export interface DamScheduleReading {
  damName: string;
  authority: 'tva' | 'usace' | 'consumers-energy' | 'manual';
  date: string;
  /** 24 entries (hours 0..23). null = unknown. 0 = no generation. */
  hourlyUnits: Array<number | null>;
  source?: string;
  scrapedAt?: string;
}

export interface TidesReading {
  stationId: string;
  events: Array<{ time: string; type: 'H' | 'L'; heightFt: number }>;
}

export interface LakeReading {
  /** Human-readable station name, e.g. "South Lake Michigan (45007)". */
  siteName: string;
  /** ISO timestamp of the most recent observation, or empty if unknown. */
  observedAt: string;
  /** Water surface temp in Fahrenheit. */
  surfaceTempF: number | null;
  /** Significant wave height (relevant for lake / coastal buoys). */
  waveHeightFt: number | null;
  /** Sustained wind at the station in mph. */
  windMph: number | null;
  /**
   * Reservoir / lake surface elevation in feet, when the provider
   * publishes one. USGS-lake gauges expose this; NDBC buoys do not.
   */
  elevationFt?: number | null;
  /**
   * Authority label for the data attribution in the UI:
   *   'NDBC'      → buoy / C-MAN reading
   *   'USGS'      → lake / reservoir gauge
   *   'CO-OPS'    → NOAA shoreline / harbor sensor
   *   'estimated' → derived from weather model (not a measurement)
   */
  authority: 'NDBC' | 'USGS' | 'CO-OPS' | 'estimated';
  /** Optional free-text note (e.g., "no recent observation"). */
  notes?: string;
  /**
   * True when `surfaceTempF` is a model output rather than a real
   * sensor reading. Drives the "Estimated" badge in LakeSection so
   * the user can tell at a glance.
   */
  isEstimated?: boolean;
}

export interface SolunarReading {
  date: string;
  sunrise: string;
  sunset: string;
  moonrise: string | null;
  moonset: string | null;
  moonPhase: number;
  moonIllumination: number;
  /** Solunar major/minor periods are derived from moon transits. */
  majorPeriods: Array<{ start: string; end: string }>;
  minorPeriods: Array<{ start: string; end: string }>;
}
