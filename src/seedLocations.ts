import type { Location } from './lib/providers/types';

/**
 * Phase 1 hardcoded seeds. Phase 2 moves these into Firestore and adds
 * add/edit/delete UI. The four primary spots are dad's TN tailwaters and
 * MI Manistee waters; the commented examples below show the same provider
 * pattern works for Western, Great Lakes, and saltwater venues without
 * touching the UI.
 *
 * Gauge IDs corrected against the live USGS API in this session — see
 * the README "Deviations from plan" section for the originals.
 */
export const seedLocations: Location[] = [
  {
    id: 'caney-fork-happy-hollow',
    name: 'Caney Fork at Happy Hollow',
    state: 'TN',
    country: 'US',
    river: 'Caney Fork',
    type: 'tailwater',
    lat: 36.103,
    lng: -85.831,
    timezone: 'America/Chicago',
    dataProviders: {
      weather: { kind: 'open-meteo' },
      // Stonewall is the closest active gauge with current data — USGS does
      // not publish water temp at any active TN tailwater gauge; that comes
      // from TVA in Phase 4.
      flow: { kind: 'usgs', siteId: '03424860' },
      damSchedule: { kind: 'tva', dam: 'Center Hill' },
    },
  },
  {
    id: 'south-holston-webb-bridge',
    name: 'South Holston at Webb Bridge',
    state: 'TN',
    country: 'US',
    river: 'South Holston',
    type: 'tailwater',
    lat: 36.498,
    lng: -82.084,
    timezone: 'America/New_York',
    dataProviders: {
      weather: { kind: 'open-meteo' },
      // No active USGS gauge below SoHo dam publishes IV data — flow signal
      // here comes from the TVA generation schedule (Phase 4).
      damSchedule: { kind: 'tva', dam: 'South Holston' },
    },
  },
  {
    id: 'big-manistee-below-tippy',
    name: 'Big Manistee below Tippy',
    state: 'MI',
    country: 'US',
    river: 'Manistee',
    type: 'tailwater',
    lat: 44.23,
    lng: -85.83,
    timezone: 'America/New_York',
    dataProviders: {
      weather: { kind: 'open-meteo' },
      // Wellston gauge gives flow + water temp + gauge height.
      flow: { kind: 'usgs', siteId: '04125550' },
      // Consumers Energy scraper is a stub — using manual until built.
      damSchedule: { kind: 'manual' },
    },
  },
  {
    id: 'upper-manistee-sherman',
    name: 'Upper Manistee near Sherman',
    state: 'MI',
    country: 'US',
    river: 'Manistee',
    type: 'freestone',
    lat: 44.622,
    lng: -85.197,
    timezone: 'America/New_York',
    dataProviders: {
      weather: { kind: 'open-meteo' },
      // Sherman gauge: flow + water temp + gauge height; no dam, freestone.
      flow: { kind: 'usgs', siteId: '04124000' },
    },
  },

  // --- Future-region examples (commented; uncomment to demo provider pattern) ---

  // {
  //   id: 'south-platte-cheesman',
  //   name: 'South Platte below Cheesman',
  //   state: 'CO',
  //   country: 'US',
  //   river: 'South Platte',
  //   type: 'tailwater',
  //   lat: 39.22,
  //   lng: -105.275,
  //   timezone: 'America/Denver',
  //   dataProviders: {
  //     weather: { kind: 'open-meteo' },
  //     flow: { kind: 'usgs', siteId: '06701900' },
  //     damSchedule: { kind: 'manual' },
  //   },
  // },
  // {
  //   id: 'tampa-bay-flats',
  //   name: 'Tampa Bay Flats',
  //   state: 'FL',
  //   country: 'US',
  //   type: 'saltwater',
  //   lat: 27.766,
  //   lng: -82.64,
  //   timezone: 'America/New_York',
  //   dataProviders: {
  //     weather: { kind: 'open-meteo' },
  //     tides: { kind: 'noaa', stationId: '8726520' },
  //   },
  // },
];
