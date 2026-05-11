/**
 * Dispatcher layer. UI calls fetchWeather/fetchFlow/etc with the provider
 * declared on the Location; the dispatcher routes to the right
 * implementation. To add a new provider kind: extend the union in types.ts,
 * implement the module under the matching subfolder, and add a case here.
 */

import type {
  DamScheduleProvider,
  DamScheduleReading,
  FlowProvider,
  FlowReading,
  LakeDataProvider,
  LakeReading,
  Location,
  TidesProvider,
  TidesReading,
  WeatherProvider,
  WeatherReading,
} from './types';

import { openMeteoFetchWeather } from './weather/openMeteo';
import { usgsFetchFlow } from './flow/usgs';
import { envCanadaFetchFlow } from './flow/envCanada';
import { ukEaFetchFlow } from './flow/ukEa';
import { tvaFetchSchedule } from './damSchedule/tva';
import { usaceFetchSchedule } from './damSchedule/usace';
import { consumersEnergyFetchSchedule } from './damSchedule/consumersEnergy';
import { manualFetchSchedule } from './damSchedule/manual';
import { autoFetchSchedule } from './damSchedule/auto';
import { noaaFetchTides } from './tides/noaa';
import { ndbcFetchLake } from './lakeData/ndbc';
import { usgsLakeFetch } from './lakeData/usgsLake';
import { coopsFetchLake } from './lakeData/coops';
import { estimatedFetchLake } from './lakeData/estimated';

export function fetchWeather(
  provider: WeatherProvider,
  location: Location
): Promise<WeatherReading> {
  switch (provider.kind) {
    case 'open-meteo':
      return openMeteoFetchWeather(location);
  }
}

export function fetchFlow(provider: FlowProvider): Promise<FlowReading> {
  switch (provider.kind) {
    case 'usgs':
      return usgsFetchFlow(provider.siteId);
    case 'env-canada':
      return envCanadaFetchFlow(provider.stationId);
    case 'uk-ea':
      return ukEaFetchFlow(provider.stationRef);
  }
}

export function fetchDamSchedule(
  provider: DamScheduleProvider,
  location: Location
): Promise<DamScheduleReading> {
  switch (provider.kind) {
    case 'tva':
      return tvaFetchSchedule(provider.dam, location);
    case 'usace':
      return usaceFetchSchedule(provider.district, provider.project, location);
    case 'consumers-energy':
      return consumersEnergyFetchSchedule(provider.dam, location);
    case 'manual':
      return manualFetchSchedule(location);
    case 'auto':
      return autoFetchSchedule(provider.flowSiteId, location);
  }
}

export function fetchTides(provider: TidesProvider): Promise<TidesReading> {
  switch (provider.kind) {
    case 'noaa':
      return noaaFetchTides(provider.stationId);
  }
}

export async function fetchLakeData(
  provider: LakeDataProvider,
  location: Location
): Promise<LakeReading> {
  // Resolve the primary provider's reading. The individual fetchers
  // return a partial LakeReading with surfaceTempF === null on
  // failure (CORS, station offline, no recent observation, etc.)
  // rather than throwing — so a network blip never throws here.
  let primary: LakeReading;
  switch (provider.kind) {
    case 'usgs-lake':
      primary = await usgsLakeFetch(provider.siteId);
      break;
    case 'noaa-buoy':
      primary = await ndbcFetchLake(provider.stationId);
      break;
    case 'noaa-coops':
      primary = await coopsFetchLake(provider.stationId);
      break;
    case 'estimated':
      // The model needs lat/lng to fetch local air temp history.
      primary = await estimatedFetchLake({
        lat: location.lat,
        lng: location.lng,
      });
      break;
  }

  // Fallback: if the primary provider returned no surface temp AND
  // the user wasn't already using the estimator, transparently fall
  // through to the air-temp model so the angler still sees a number.
  // The returned reading carries `isEstimated: true` so the
  // LakeSection UI renders the "estimated" badge — the user always
  // knows when they're looking at a model output vs a sensor.
  if (primary.surfaceTempF == null && provider.kind !== 'estimated') {
    const fallback = await estimatedFetchLake({
      lat: location.lat,
      lng: location.lng,
    }).catch(() => null);
    if (fallback && fallback.surfaceTempF != null) {
      const primarySiteName = primary.siteName;
      const failureNote = primary.notes;
      return {
        ...fallback,
        // Keep the primary station id visible so the user understands
        // which sensor was unreachable. Adds "(estimated)" so the
        // siteName itself signals the fallback even before reading
        // the notes line.
        siteName: `${primarySiteName} unreachable → estimated`,
        notes: failureNote
          ? `${primarySiteName}: ${failureNote}. Falling back to air-temp model.`
          : `${primarySiteName} unavailable; using air-temp model.`,
      };
    }
  }

  return primary;
}

export type {
  WeatherReading,
  FlowReading,
  DamScheduleReading,
  TidesReading,
  LakeReading,
} from './types';
