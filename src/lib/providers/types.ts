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
  | { kind: 'usgs-lake'; siteId: string }
  | { kind: 'noaa-buoy'; stationId: string };

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
  siteName: string;
  observedAt: string;
  surfaceTempF: number | null;
  waveHeightFt: number | null;
  windMph: number | null;
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
