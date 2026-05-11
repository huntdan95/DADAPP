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

export function fetchLakeData(
  provider: LakeDataProvider,
  location: Location
): Promise<LakeReading> {
  switch (provider.kind) {
    case 'usgs-lake':
      return usgsLakeFetch(provider.siteId);
    case 'noaa-buoy':
      return ndbcFetchLake(provider.stationId);
    case 'noaa-coops':
      return coopsFetchLake(provider.stationId);
    case 'estimated':
      // The model needs lat/lng to fetch local air temp history.
      return estimatedFetchLake({ lat: location.lat, lng: location.lng });
  }
}

export type {
  WeatherReading,
  FlowReading,
  DamScheduleReading,
  TidesReading,
  LakeReading,
} from './types';
