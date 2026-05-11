import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Crosshair, Loader2 } from 'lucide-react';
import type {
  DamScheduleProvider,
  FlowProvider,
  LakeDataProvider,
  Location,
  WaterType,
} from '@/lib/providers/types';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select } from '@/components/ui/Input';
import { BASEMAPS } from '@/features/map/basemaps';
import { MapSearch } from '@/features/map/MapSearch';
import { friendlyError } from '@/lib/errors';
import {
  nearestUsgsGauges,
  nearestUsgsLakeSites,
  reverseGeocode,
  timezoneForState,
  type NearbyGauge,
  type NearbyLakeSite,
} from '@/lib/geo/reverseGeocode';
import {
  nearestTideStations,
  type NearbyTideStation,
} from '@/lib/geo/nearestTideStations';
import {
  nearestNdbcStations,
  type NearbyNdbcStation,
} from '@/lib/geo/nearestNdbcStations';
import { lookupTailwater } from '@/lib/geo/tailwaterLookup';
import {
  lookupWaterbody,
  type Waterbody,
  type WaterbodyMatch,
} from '@/lib/waterbodies/registry';

const WATER_TYPES: WaterType[] = [
  'tailwater',
  'freestone',
  'lake',
  'pond',
  'reservoir',
  'great_lakes',
  'saltwater',
];

type FlowKind = '' | 'usgs' | 'env-canada' | 'uk-ea';
type DamKind = '' | 'tva' | 'usace' | 'consumers-energy' | 'manual' | 'auto';

const dropIcon = L.divIcon({
  html: `<div style="width:20px;height:20px;border-radius:50%;background:#4ade80;border:3px solid #0a0e0a;box-shadow:0 0 0 2px #4ade80"></div>`,
  className: '',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export function LocationForm({
  initial,
  onSave,
  onCancel,
}: {
  /**
   * Either a full Location (editing existing) or a partial
   * seed — e.g. when converting a boat launch into a spot we pass
   * { name, lat, lng } and the auto-detect chain fills the rest.
   * The form distinguishes "real edit" from "seed" by `initial.id`
   * being present.
   */
  initial?: Partial<Location>;
  onSave: (loc: Location) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [river, setRiver] = useState(initial?.river ?? '');
  const [state, setState] = useState(initial?.state ?? '');
  const [country, setCountry] = useState(initial?.country ?? 'US');
  /**
   * Hidden auto-detected fields. Saved on the Location for analytics
   * + stocking proximity matching but not shown in the form — derived
   * from the pin via reverse geocoding.
   */
  const [county, setCounty] = useState<string | undefined>(initial?.county);
  const [type, setType] = useState<WaterType>(initial?.type ?? 'tailwater');
  /**
   * True if the user has manually changed the water type, OR if we're
   * editing an existing spot (full id present). When seeding from a
   * boat launch or fresh add, type stays auto-detectable.
   */
  const [typeUserSet, setTypeUserSet] = useState<boolean>(Boolean(initial?.id));
  const [timezone, setTimezone] = useState(
    initial?.timezone ?? 'America/New_York'
  );
  const [lat, setLat] = useState<number | null>(initial?.lat ?? null);
  const [lng, setLng] = useState<number | null>(initial?.lng ?? null);
  /** Suggested spot name from reverse-geocode (river + nearest landmark). */
  const [nameSuggestion, setNameSuggestion] = useState<string | null>(null);

  /**
   * When opening the form for a NEW spot (no `initial`) and no pin
   * dropped yet, fire the GPS resolver automatically. Saves the
   * user a tap — most of the time they're adding a spot they're
   * standing at or near. They can still drag the pin if they
   * intended somewhere else.
   */
  useEffect(() => {
    if (initial?.id) return;             // editing — leave pin where it was
    if (lat != null || lng != null) return;
    if (!('geolocation' in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setRecenterTarget({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          zoom: 14,
        });
        setRecenterKey((k) => k + 1);
      },
      () => {
        // Silently fail — user can still tap or use the button.
      },
      { enableHighAccuracy: false, timeout: 6000, maximumAge: 60_000 }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // dataProviders is optional on Partial<Location> — pull a local ref
  // for cleaner conditional reads below.
  const initialProviders = initial?.dataProviders;

  const [flowKind, setFlowKind] = useState<FlowKind>(
    (initialProviders?.flow?.kind ?? '') as FlowKind
  );
  const [flowSiteId, setFlowSiteId] = useState(
    initialProviders?.flow?.kind === 'usgs'
      ? initialProviders.flow.siteId
      : initialProviders?.flow?.kind === 'env-canada'
      ? initialProviders.flow.stationId
      : initialProviders?.flow?.kind === 'uk-ea'
      ? initialProviders.flow.stationRef
      : ''
  );

  const [damKind, setDamKind] = useState<DamKind>(
    (initialProviders?.damSchedule?.kind ?? '') as DamKind
  );
  const [damName, setDamName] = useState(
    initialProviders?.damSchedule?.kind === 'tva'
      ? initialProviders.damSchedule.dam
      : initialProviders?.damSchedule?.kind === 'consumers-energy'
      ? initialProviders.damSchedule.dam
      : ''
  );

  /**
   * Top-3 candidates collected during auto-fill. We auto-pick the closest
   * one but show the alternatives as buttons so the user can switch if
   * the auto-pick is wrong (e.g. nearest gauge is on a different river).
   */
  const [flowOptions, setFlowOptions] = useState<NearbyGauge[]>([]);
  const [tideStationId, setTideStationId] = useState<string>(
    initialProviders?.tides?.stationId ?? ''
  );
  const [tideOptions, setTideOptions] = useState<NearbyTideStation[]>([]);

  /**
   * Lake-data provider state. Mirrors flow / tides:
   *   - `lakeKind` ('' | 'noaa-buoy' | 'usgs-lake' | 'noaa-coops' | 'estimated')
   *   - `lakeId`   (station id / site id depending on kind)
   *   - `lakeOptions` list of nearby NDBC buoys to pick from
   *
   * Distinct from `flow` because many lakes have a USGS gauge for
   * elevation+temp but no discharge — that doesn't fit FlowProvider.
   */
  const [lakeKind, setLakeKind] = useState<'' | 'noaa-buoy' | 'usgs-lake' | 'noaa-coops' | 'estimated'>(
    (initialProviders?.lakeData?.kind ?? '') as '' | 'noaa-buoy' | 'usgs-lake' | 'noaa-coops' | 'estimated'
  );
  const [lakeId, setLakeId] = useState(
    initialProviders?.lakeData?.kind === 'noaa-buoy'
      ? initialProviders.lakeData.stationId
      : initialProviders?.lakeData?.kind === 'usgs-lake'
      ? initialProviders.lakeData.siteId
      : initialProviders?.lakeData?.kind === 'noaa-coops'
      ? initialProviders.lakeData.stationId
      : ''
  );
  /** Nearby USGS lake-type sites (siteType=LK + param 00010). */
  const [usgsLakeOptions, setUsgsLakeOptions] = useState<NearbyLakeSite[]>([]);
  const [lakeOptions, setLakeOptions] = useState<NearbyNdbcStation[]>([]);
  /**
   * Curated waterbody hit (Lake St. Clair / Caney Fork / Lake
   * Cumberland / etc.). When the pin sits inside a registered
   * bbox we use the body's `dataProviders` as the primary config
   * AND surface the alternative lake stations in the picker.
   * Cleared on every fresh pin drop.
   */
  const [waterbodyMatch, setWaterbodyMatch] =
    useState<WaterbodyMatch | null>(null);

  const [error, setError] = useState<string | null>(null);
  /**
   * True while the parent's `onSave` (a Firestore upsert) is in flight.
   * Disables the Save button and shows a spinner so the user can see
   * something is happening instead of staring at an unresponsive form.
   */
  const [saving, setSaving] = useState(false);
  const [autoFilling, setAutoFilling] = useState(false);
  const [autoStatus, setAutoStatus] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  /** Externally-driven map recenter target (incremented after a "use my location" tap). */
  const [recenterKey, setRecenterKey] = useState(0);
  const [recenterTarget, setRecenterTarget] = useState<{ lat: number; lng: number; zoom: number } | null>(null);

  async function useMyLocation() {
    if (!('geolocation' in navigator)) {
      setError('Geolocation not available on this device');
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const la = pos.coords.latitude;
        const ln = pos.coords.longitude;
        setLat(la);
        setLng(ln);
        setRecenterTarget({ lat: la, lng: ln, zoom: 14 });
        setRecenterKey((k) => k + 1);
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        setError(`Couldn't get location: ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  }

  const initialCenter: [number, number] = useMemo(
    () => [initial?.lat ?? 39.5, initial?.lng ?? -85.0],
    [initial?.lat, initial?.lng]
  );

  /**
   * Silent auto-detect on every pin change. Fires reverse-geocode +
   * USGS-nearest-gauge + NOAA-nearest-tide in parallel, then folds
   * results into the form state without user interaction. The user
   * sees a compact "Auto-detected" summary line; nothing else moves.
   *
   * Debounced 400 ms so dragging the map and dropping in a different
   * spot doesn't fire three fetches.
   */
  useEffect(() => {
    if (lat == null || lng == null) {
      setAutoStatus(null);
      return;
    }
    let cancelled = false;
    const t = setTimeout(async () => {
      setAutoFilling(true);
      setAutoStatus(null);
      const parts: string[] = [];
      try {
        const [geo, gauges, tides, buoys, lakeSites] = await Promise.all([
          reverseGeocode(lat, lng).catch(() => null),
          nearestUsgsGauges(lat, lng, 3).catch(() => [] as NearbyGauge[]),
          nearestTideStations(lat, lng, 3, 50).catch(
            () => [] as NearbyTideStation[]
          ),
          // 60-mi radius (vs. 40 for tide stations) — Great-Lakes
          // shoreline spots like Lake St. Clair sit ~55 mi from the
          // nearest open-lake buoy, and that buoy's surface temp is
          // still a meaningful signal even at that range.
          nearestNdbcStations(lat, lng, 3, 60).catch(
            () => [] as NearbyNdbcStation[]
          ),
          // USGS lake-type sites (siteType=LK + parameter 00010).
          // Distinct query from `nearestUsgsGauges` (which targets
          // stream gauges with discharge) — catches reservoir / lake
          // sensors that don't publish flow. Bigger search radius
          // (0.75°) because lake sites are sparser than stream gauges.
          nearestUsgsLakeSites(lat, lng, 3, 0.75).catch(
            () => [] as NearbyLakeSite[]
          ),
        ]);
        if (cancelled) return;

        if (geo?.state) {
          setState(geo.state);
          setTimezone(timezoneForState(geo.state));
          parts.push(geo.state);
        }
        if (geo?.country) setCountry(geo.country);
        if (geo?.county) {
          setCounty(geo.county);
          parts.push(`${geo.county} Co`);
        }
        if (geo?.river && !river) setRiver(geo.river);

        // Heuristic water-type detection. Only override if the user
        // hasn't manually chosen a type yet (typeUserSet stays false
        // until they touch the Type dropdown).
        //
        // `effectiveType` mirrors what we're about to setType() to so
        // the rest of this effect can branch on the just-detected
        // value. Without it the `stillwater` check below would see
        // the stale React state (default 'tailwater') for the first
        // pin drop on a lake and incorrectly auto-bind flow.
        let effectiveType = type;
        if (!typeUserSet) {
          const inferred = inferWaterType({
            river: geo?.river,
            water: geo?.water,
            tideStationDistanceMiles: tides[0]?.distanceMiles ?? null,
            lat,
            lng,
          });
          if (inferred) {
            setType(inferred);
            effectiveType = inferred;
          }
        }

        // Name suggestion — only set if the user hasn't typed yet.
        if (!name && (geo?.river || geo?.water)) {
          const water = geo?.river ?? geo?.water ?? 'River';
          const landmark =
            geo?.nearestRoad ??
            geo?.town ??
            null;
          setNameSuggestion(
            landmark ? `${water} at ${landmark}` : water
          );
        }

        // Tier 0: waterbody registry. Sits ahead of every geometric
        // proximity tier — if the pin is inside a curated body's
        // bbox, that body's `dataProviders` config is the source of
        // truth. Everything below (USGS gauge, NDBC buoy, etc.)
        // becomes a no-op for any provider the registry has already
        // pre-bound (via the `if (!flowKind)` / `if (!lakeKind)`
        // guards downstream).
        const wbMatch = lookupWaterbody(lat, lng);
        setWaterbodyMatch(wbMatch);
        const matched = wbMatch?.waterbody;
        if (matched) {
          // Type override + name suggestion. Update effectiveType too
          // so the stillwater check below sees the registry's verdict
          // (not a stale `type` state).
          if (!typeUserSet) {
            setType(matched.type);
            effectiveType = matched.type;
          }
          if (
            !river &&
            matched.type !== 'lake' &&
            matched.type !== 'great_lakes' &&
            matched.type !== 'pond' &&
            matched.type !== 'reservoir' &&
            matched.type !== 'saltwater'
          ) {
            setRiver(matched.name);
          }
          parts.push(`🎯 ${matched.name}`);

          // Pre-bind providers from the registry entry.
          const dp = matched.dataProviders;
          if (dp?.flow && !flowKind) {
            if (dp.flow.kind === 'usgs') {
              setFlowKind('usgs');
              setFlowSiteId(dp.flow.siteId);
            } else if (dp.flow.kind === 'env-canada') {
              setFlowKind('env-canada');
              setFlowSiteId(dp.flow.stationId);
            } else if (dp.flow.kind === 'uk-ea') {
              setFlowKind('uk-ea');
              setFlowSiteId(dp.flow.stationRef);
            }
          }
          if (dp?.damSchedule && (damKind === '' || damKind === 'manual')) {
            const ds = dp.damSchedule;
            if (ds.kind === 'tva') {
              setDamKind('tva');
              setDamName(ds.dam);
            } else if (ds.kind === 'consumers-energy') {
              setDamKind('consumers-energy');
              setDamName(ds.dam);
            } else if (ds.kind === 'auto') {
              setDamKind('auto');
            } else if (ds.kind === 'manual') {
              setDamKind('manual');
            }
          }
          if (dp?.lakeData && !lakeKind) {
            const ld = dp.lakeData;
            setLakeKind(ld.kind);
            const id =
              ld.kind === 'noaa-buoy'
                ? ld.stationId
                : ld.kind === 'noaa-coops'
                ? ld.stationId
                : ld.kind === 'usgs-lake'
                ? ld.siteId
                : '';
            setLakeId(id);
          }
          if (dp?.tides && !tideStationId) {
            setTideStationId(dp.tides.stationId);
          }
        }

        // Compute the spot's "water role" AFTER the registry has
        // had a chance to override `effectiveType`. Stillwater types
        // default to lake-data providers, NOT flow — a flow gauge on
        // a creek 8 mi away is not what a Lake St. Clair pin should
        // pull.
        const stillwater =
          effectiveType === 'lake' ||
          effectiveType === 'reservoir' ||
          effectiveType === 'pond' ||
          effectiveType === 'great_lakes';

        if (gauges.length > 0) {
          // Make the gauge list available as a manual picker either
          // way — the user might want to override.
          setFlowOptions(gauges);

          const pick = gauges.find((g) => g.hasWaterTemp) ?? gauges[0];
          const known = lookupTailwater(pick.siteId);

          if (!stillwater) {
            // River-type spots auto-bind flow.
            if (!flowKind) {
              setFlowKind('usgs');
              setFlowSiteId(pick.siteId);
            }
            parts.push(`USGS ${pick.siteId}`);

            // Known-tailwater detection (Center Hill / Tippy / Wolf
            // Creek / Bull Shoals / Flaming Gorge / etc.). Only fires
            // on river types — a stillwater pin near a tailwater
            // gauge shouldn't get flipped to "tailwater".
            if (known) {
              if (!typeUserSet) setType('tailwater');
              if (damKind === '' || damKind === 'manual') {
                if (known.authority === 'tva') {
                  setDamKind('tva');
                  setDamName(known.damName);
                } else if (known.authority === 'consumers-energy') {
                  setDamKind('consumers-energy');
                  setDamName(known.damName);
                } else {
                  // USACE / reclamation / auto → derive status from
                  // the flow gauge itself.
                  setDamKind('auto');
                }
              }
              parts.push(`${known.damName} tailwater`);
            } else if (
              (effectiveType === 'tailwater' ||
                (!typeUserSet && geo?.river)) &&
              (damKind === '' || damKind === 'manual')
            ) {
              setDamKind('auto');
            }
          }
        }

        if (tides.length > 0) {
          setTideOptions(tides);
          if (!tideStationId) setTideStationId(tides[0].stationId);
          parts.push(`NOAA ${tides[0].stationId}`);
        }

        // Lake-data auto-pick. Priority for stillwater types:
        //   1. Curated known-lake hit (Lake St. Clair → CO-OPS
        //      9034052 St. Clair Shores; Great Lakes → shoreline
        //      CO-OPS stations and offshore NDBC buoys; major TN/KY
        //      reservoirs → published USGS lake gauges). Always wins.
        //   2. USGS lake-type site (siteType=LK + temp 00010) within
        //      ~50 mi — catches inland reservoirs the curated list
        //      doesn't know about (Lake Erie / KY / TN dam-lake
        //      monitoring).
        //   3. NDBC buoy within 60 mi.
        //   4. USGS gauge whose NAME contains "Lake" / "Reservoir" —
        //      never a tributary river/creek.
        //   5. Estimated — air-temp-driven model. Last resort but
        //      always available. Better than nothing for the many
        //      MI / IN inland lakes with no real-time sensor at all.
        // Lake/buoy picker options surface regardless of match —
        // user can still browse alternatives. The waterbody match
        // already pre-bound the primary lake-data provider up in
        // the Tier-0 block above.
        setLakeOptions(buoys);
        setUsgsLakeOptions(lakeSites);

        if (stillwater || effectiveType === 'saltwater') {
          let lakeBound = Boolean(lakeKind);

          // Tier 2: USGS lake-type sensor (proper in-lake gauge).
          if (!lakeBound && !lakeKind && lakeSites.length > 0) {
            const top = lakeSites[0];
            setLakeKind('usgs-lake');
            setLakeId(top.siteId);
            parts.push(`USGS-lake ${top.siteId}`);
            lakeBound = true;
          }

          // Tier 3: nearest NDBC buoy.
          if (!lakeBound && !lakeKind && buoys.length > 0) {
            setLakeKind('noaa-buoy');
            setLakeId(buoys[0].stationId);
            parts.push(`NDBC ${buoys[0].stationId}`);
            lakeBound = true;
          }

          // Tier 4: USGS stream gauge whose NAME identifies it as a
          // lake / reservoir / pond gauge — refuses river / creek
          // tributaries.
          if (!lakeBound && !lakeKind && stillwater && gauges.length > 0) {
            const lakeNamed = gauges.find((g) =>
              /\b(lake|reservoir|res\.|pond|impoundment)\b/i.test(g.name)
            );
            if (lakeNamed) {
              setLakeKind('usgs-lake');
              setLakeId(lakeNamed.siteId);
              parts.push(`USGS-lake ${lakeNamed.siteId}`);
              lakeBound = true;
            }
          }

          // Tier 5: estimated water temp from air-temp model. Always
          // applicable for stillwater; we'd rather show a flagged
          // estimate than nothing. Saltwater spots skip this — the
          // tide-based model doesn't apply.
          if (!lakeBound && !lakeKind && stillwater) {
            setLakeKind('estimated');
            setLakeId('');
            parts.push('Estimated (air-temp model)');
            lakeBound = true;
          }
        }

        setAutoStatus(parts.length > 0 ? parts.join(' · ') : null);
      } catch (e) {
        if (!cancelled) setAutoStatus(friendlyError(e));
      } finally {
        if (!cancelled) setAutoFilling(false);
      }
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError('Name is required');
    if (lat == null || lng == null) return setError('Drop a pin on the map');

    // Stillwater types: drop any stale flow / dam picks from a prior
    // auto-detect on a river. These fields are irrelevant for lakes
    // and would otherwise trip validation ("Auto dam status needs a
    // USGS flow gauge") on a spot whose Type was switched to lake
    // after the auto-detect already chose a tailwater config.
    const isStillwater =
      type === 'lake' ||
      type === 'reservoir' ||
      type === 'pond' ||
      type === 'great_lakes';

    const flow = isStillwater
      ? null
      : makeFlowProvider(flowKind, flowSiteId.trim());
    const damSchedule = isStillwater
      ? null
      : makeDamProvider(damKind, damName.trim(), flowSiteId.trim());
    // Save tides whenever a station is entered, regardless of water
    // type. Lots of brackish / tidal-creek spots aren't strictly
    // "saltwater" but the tide is the dominant signal.
    const tides = tideStationId.trim()
      ? { kind: 'noaa' as const, stationId: tideStationId.trim() }
      : null;
    const lakeData = makeLakeProvider(lakeKind, lakeId.trim());

    // Validation only applies to non-stillwater spots — dam / flow
    // are skipped for lakes.
    if (!isStillwater) {
      if (flowKind && flow == null) return setError('Flow site ID is required');
      if ((damKind === 'tva' || damKind === 'consumers-energy') && !damName)
        return setError('Dam name is required');
      if (damKind === 'auto' && (!flow || flow.kind !== 'usgs'))
        return setError(
          'Auto dam status needs a USGS flow gauge — pick one above'
        );
    }

    // Build the Location with conditional spreads instead of `field
    // ?? undefined` so we never send a literal `undefined` to
    // Firestore. (Even with `ignoreUndefinedProperties: true` set,
    // omitting from the object up front is cleaner and avoids the
    // surprise on any client that doesn't have the flag.)
    const loc: Location = {
      id: initial?.id ?? slugify(name),
      name: name.trim(),
      state: state.trim().toUpperCase() || 'XX',
      country: country.trim().toUpperCase() || 'US',
      type,
      lat,
      lng,
      timezone,
      ...(river.trim() ? { river: river.trim() } : {}),
      ...(county ? { county } : {}),
      dataProviders: {
        weather: { kind: 'open-meteo' },
        ...(flow ? { flow } : {}),
        ...(damSchedule ? { damSchedule } : {}),
        ...(tides ? { tides } : {}),
        ...(lakeData ? { lakeData } : {}),
      },
    };

    // Wrap the parent's save in try/catch so Firestore-rule denials,
    // network errors, or any other failure mode lands in front of
    // the user instead of silently swallowing.
    setSaving(true);
    try {
      await onSave(loc);
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field
        label="Name"
        hint={
          nameSuggestion && !name
            ? `Suggested: ${nameSuggestion} — tap to use`
            : undefined
        }
      >
        <div className="flex gap-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={nameSuggestion ?? 'e.g. Caney Fork at Happy Hollow'}
          />
          {nameSuggestion && !name && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setName(nameSuggestion)}
            >
              Use
            </Button>
          )}
        </div>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Body of water">
          <Input
            value={river}
            onChange={(e) => setRiver(e.target.value)}
            placeholder="optional — river, lake, reservoir, etc."
          />
        </Field>
        <Field label="Type">
          <Select
            value={type}
            onChange={(e) => {
              setType(e.target.value as WaterType);
              setTypeUserSet(true);
            }}
          >
            {WATER_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="text-xs uppercase tracking-wider text-muted">
            Drop pin
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={useMyLocation}
            disabled={locating}
          >
            {locating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Crosshair className="w-3.5 h-3.5" />
            )}
            {locating ? 'Locating…' : 'Use my location'}
          </Button>
        </div>
        <div className="relative h-56 rounded-xl overflow-hidden border border-border">
          <MapContainer
            center={initialCenter}
            zoom={initial ? 11 : 4}
            scrollWheelZoom
            className="h-full w-full"
          >
            <TileLayer url={BASEMAPS.osm.url} attribution={BASEMAPS.osm.attribution} />
            <PinPicker lat={lat} lng={lng} onSet={(la, ln) => {
              setLat(la);
              setLng(ln);
            }} />
            <RecenterOnTarget target={recenterTarget} key={recenterKey} />
          </MapContainer>
          {/* Search bar floats over the map. Picking a result moves
              the pin to the result's center — that triggers the same
              auto-detect chain a tap would (state / county / nearest
              USGS gauge / nearest tide station). */}
          <div className="absolute top-2 left-2 right-2 z-[1000]">
            <MapSearch
              className="w-full max-w-none"
              placeholder="Search a town, river, lake, address…"
              onPick={(r) => {
                setLat(r.lat);
                setLng(r.lng);
                setRecenterTarget({
                  lat: r.lat,
                  lng: r.lng,
                  zoom: r.bbox ? 12 : 13,
                });
                setRecenterKey((k) => k + 1);
              }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 mt-1 min-h-[18px]">
          <div className="text-xs text-muted num">
            {lat != null && lng != null
              ? `${lat.toFixed(4)}, ${lng.toFixed(4)}`
              : 'Tap the map to set a position'}
          </div>
          {autoFilling && lat != null && (
            <div className="flex items-center gap-1 text-[11px] text-muted">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Auto-detecting…</span>
            </div>
          )}
        </div>
        {autoStatus && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {autoStatus.split(' · ').map((chip, i) => (
              <span
                key={i}
                className="inline-flex items-center px-2 py-0.5 rounded-full bg-accent/10 border border-accent/30 text-[10px] text-accent num"
              >
                {chip}
              </span>
            ))}
            {timezone && (
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-2 border border-border text-[10px] text-muted"
                title="Timezone auto-derived from state"
              >
                {timezone.split('/')[1].replace(/_/g, ' ')}
              </span>
            )}
          </div>
        )}
      </div>

      {(() => {
        // Compose provider blocks in an order tuned to the spot's
        // water type. Stillwater (lake / reservoir / pond / great
        // lakes) leads with Lake data — that's the actionable signal.
        // River types lead with Flow. Tides only shows when relevant.
        const isStillwater =
          type === 'lake' ||
          type === 'reservoir' ||
          type === 'pond' ||
          type === 'great_lakes';

        const flowBlock = (
          <div key="flow">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Flow source">
                <Select
                  value={flowKind}
                  onChange={(e) => setFlowKind(e.target.value as FlowKind)}
                >
                  <option value="">none</option>
                  <option value="usgs">USGS</option>
                  <option value="env-canada">Environment Canada</option>
                  <option value="uk-ea">UK EA</option>
                </Select>
              </Field>
              {flowKind && (
                <Field label="Site/station ID">
                  <Input
                    value={flowSiteId}
                    onChange={(e) => setFlowSiteId(e.target.value)}
                    placeholder={flowKind === 'usgs' ? '03424860' : ''}
                  />
                </Field>
              )}
            </div>
            {flowOptions.length > 0 && (
              <div className="mt-2">
                <div className="text-[11px] uppercase tracking-wider text-muted mb-1">
                  Nearby gauges — pick one
                </div>
                <div className="flex flex-col gap-1.5">
                  {flowOptions.map((g) => {
                    const selected =
                      flowKind === 'usgs' && flowSiteId === g.siteId;
                    return (
                      <button
                        key={g.siteId}
                        type="button"
                        onClick={() => {
                          setFlowKind('usgs');
                          setFlowSiteId(g.siteId);
                        }}
                        className={
                          'text-left px-3 py-2 rounded-lg border text-xs transition ' +
                          (selected
                            ? 'bg-accent/15 border-accent text-text'
                            : 'bg-surface-2 border-border text-muted hover:border-accent/40')
                        }
                      >
                        <div className="font-medium text-text">{g.name}</div>
                        <div className="num">
                          {g.siteId} · {g.distanceMiles.toFixed(1)} mi
                          {g.hasWaterTemp && ' · water temp ✓'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );

        const tidesBlock =
          type === 'saltwater' || tideOptions.length > 0 ? (
            <div key="tides">
              <Field
                label="NOAA tide station ID"
                hint={
                  type !== 'saltwater'
                    ? 'Coast is close enough that tide info is meaningful — pick a station or clear to skip'
                    : undefined
                }
              >
                <Input
                  value={tideStationId}
                  onChange={(e) => setTideStationId(e.target.value)}
                  placeholder="8726520"
                />
              </Field>
              {tideOptions.length > 0 && (
                <div className="mt-2">
                  <div className="text-[11px] uppercase tracking-wider text-muted mb-1">
                    Nearby tide stations — pick one
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {tideOptions.map((s) => {
                      const selected = tideStationId === s.stationId;
                      return (
                        <button
                          key={s.stationId}
                          type="button"
                          onClick={() => setTideStationId(s.stationId)}
                          className={
                            'text-left px-3 py-2 rounded-lg border text-xs transition ' +
                            (selected
                              ? 'bg-accent/15 border-accent text-text'
                              : 'bg-surface-2 border-border text-muted hover:border-accent/40')
                          }
                        >
                          <div className="font-medium text-text">{s.name}</div>
                          <div className="num">
                            {s.stationId}
                            {s.state ? ` · ${s.state}` : ''} ·{' '}
                            {s.distanceMiles.toFixed(1)} mi
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : null;

        const lakeBlock =
          isStillwater || lakeOptions.length > 0 || lakeKind ? (
            <div key="lake">
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Lake data source"
                  hint={
                    lakeKind === 'noaa-buoy'
                      ? 'NDBC buoy — surface temp, waves, wind.'
                      : lakeKind === 'usgs-lake'
                      ? 'USGS lake gauge — temp + elevation.'
                      : lakeKind === 'noaa-coops'
                      ? 'NOAA CO-OPS shoreline sensor — in-lake water temp.'
                      : lakeKind === 'estimated'
                      ? 'Modeled from recent air temp — no live sensor.'
                      : isStillwater
                      ? 'Surface temp + (buoy) waves / (gauge) elevation.'
                      : undefined
                  }
                >
                  <Select
                    value={lakeKind}
                    onChange={(e) =>
                      setLakeKind(
                        e.target.value as '' | 'noaa-buoy' | 'usgs-lake' | 'noaa-coops' | 'estimated'
                      )
                    }
                  >
                    <option value="">none</option>
                    <option value="noaa-coops">NOAA CO-OPS (shoreline)</option>
                    <option value="noaa-buoy">NOAA NDBC buoy</option>
                    <option value="usgs-lake">USGS lake gauge</option>
                    <option value="estimated">Estimated (air-temp model)</option>
                  </Select>
                </Field>
                {lakeKind && lakeKind !== 'estimated' && (
                  <Field label="Station / site ID">
                    <Input
                      value={lakeId}
                      onChange={(e) => setLakeId(e.target.value)}
                      placeholder={
                        lakeKind === 'noaa-buoy'
                          ? '45007'
                          : lakeKind === 'noaa-coops'
                          ? '9034052'
                          : '03413000'
                      }
                    />
                  </Field>
                )}
              </div>
              {/* Curated waterbody match — list its primary lake-
                  data station + any alternates. The primary is
                  already auto-bound by Tier 0; the alternates let
                  the user swap (e.g., upstream water-mass buoy for
                  Lake St. Clair). */}
              {waterbodyMatch &&
                (waterbodyMatch.waterbody.dataProviders?.lakeData ||
                  (waterbodyMatch.waterbody.alternateLakeStations?.length ?? 0) > 0) && (
                  <div className="mt-2">
                    <div className="text-[11px] uppercase tracking-wider text-muted mb-1">
                      {waterbodyMatch.waterbody.name} — stations
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {buildWaterbodyStations(waterbodyMatch.waterbody).map((s) => {
                        const id =
                          s.provider.kind === 'noaa-buoy'
                            ? s.provider.stationId
                            : s.provider.kind === 'noaa-coops'
                            ? s.provider.stationId
                            : s.provider.kind === 'usgs-lake'
                            ? s.provider.siteId
                            : '';
                        const selected =
                          lakeKind === s.provider.kind && lakeId === id;
                        return (
                          <button
                            key={`${s.provider.kind}-${id}`}
                            type="button"
                            onClick={() => {
                              setLakeKind(s.provider.kind);
                              setLakeId(id);
                            }}
                            className={
                              'text-left px-3 py-2 rounded-lg border text-xs transition ' +
                              (selected
                                ? 'bg-accent/15 border-accent text-text'
                                : 'bg-surface-2 border-border text-muted hover:border-accent/40')
                            }
                          >
                            <div className="font-medium text-text">
                              {s.label}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              {/* Nearby USGS lake-type sites (siteType=LK + water
                  temp). These are gauges INSIDE lakes/reservoirs —
                  distinct from the river-gauge "nearby gauges" list
                  under Flow source. Show whenever found, regardless
                  of curated-lake match (the curated entry might
                  prefer CO-OPS or NDBC and the user might still want
                  a closer USGS option). */}
              {usgsLakeOptions.length > 0 && (
                <div className="mt-2">
                  <div className="text-[11px] uppercase tracking-wider text-muted mb-1">
                    Nearby USGS lake gauges — pick one
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {usgsLakeOptions.map((s) => {
                      const selected =
                        lakeKind === 'usgs-lake' && lakeId === s.siteId;
                      return (
                        <button
                          key={s.siteId}
                          type="button"
                          onClick={() => {
                            setLakeKind('usgs-lake');
                            setLakeId(s.siteId);
                          }}
                          className={
                            'text-left px-3 py-2 rounded-lg border text-xs transition ' +
                            (selected
                              ? 'bg-accent/15 border-accent text-text'
                              : 'bg-surface-2 border-border text-muted hover:border-accent/40')
                          }
                        >
                          <div className="font-medium text-text">{s.name}</div>
                          <div className="num">
                            {s.siteId} · {s.distanceMiles.toFixed(1)} mi
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {/* Nearby NDBC buoys (only when there's no curated hit
                  — for unknown lakes, e.g., MI inland water). */}
              {!waterbodyMatch && lakeOptions.length > 0 && (
                <div className="mt-2">
                  <div className="text-[11px] uppercase tracking-wider text-muted mb-1">
                    Nearby NDBC buoys — pick one
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {lakeOptions.map((s) => {
                      const selected =
                        lakeKind === 'noaa-buoy' && lakeId === s.stationId;
                      return (
                        <button
                          key={s.stationId}
                          type="button"
                          onClick={() => {
                            setLakeKind('noaa-buoy');
                            setLakeId(s.stationId);
                          }}
                          className={
                            'text-left px-3 py-2 rounded-lg border text-xs transition ' +
                            (selected
                              ? 'bg-accent/15 border-accent text-text'
                              : 'bg-surface-2 border-border text-muted hover:border-accent/40')
                          }
                        >
                          <div className="font-medium text-text">{s.name}</div>
                          <div className="num">
                            {s.stationId} · {s.distanceMiles.toFixed(1)} mi ·{' '}
                            {s.region.replace('_', ' ')}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {/* When the spot is stillwater and we're falling back
                  to the estimator (no live sensor in range), show a
                  clear note. The estimator IS auto-selected; this is
                  just user-visible context. */}
              {isStillwater && lakeKind === 'estimated' && (
                <div className="mt-2 text-[11px] text-muted leading-snug">
                  No NDBC buoy, CO-OPS sensor, or USGS lake gauge
                  within range. Surface temp will be estimated from
                  recent air temperature (±3°F vs. measured gauges).
                </div>
              )}
            </div>
          ) : null;

        // For stillwater spots, the Flow source is a secondary
        // (optional) provider — collapse it behind a <details> so it
        // doesn't visually dominate. Open by default only if the
        // user has manually set one.
        const flowSection = isStillwater ? (
          <details
            key="flow-collapsed"
            open={Boolean(flowKind)}
            className="rounded-lg border border-border bg-surface-2/40 px-3 py-2"
          >
            <summary className="text-xs uppercase tracking-wider text-muted cursor-pointer select-none">
              Flow source (optional for lakes)
            </summary>
            <div className="mt-2">{flowBlock}</div>
          </details>
        ) : (
          flowBlock
        );

        const ordered = isStillwater
          ? [lakeBlock, tidesBlock, flowSection]
          : [flowBlock, tidesBlock, lakeBlock];

        return (
          <div className="flex flex-col gap-3">
            <div className="text-xs uppercase tracking-wider text-muted">
              Providers
            </div>
            {ordered.filter(Boolean)}

            {/* Dam schedule lives in the same Providers section but
                is unrelated to the flow/lake/tides re-ordering — keep
                it pinned at the bottom regardless of water type. */}
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Dam schedule"
                hint={
                  damKind === 'auto'
                    ? 'Status derived from your flow gauge — no setup'
                    : undefined
                }
              >
                <Select
                  value={damKind}
                  onChange={(e) => setDamKind(e.target.value as DamKind)}
                >
                  <option value="">none</option>
                  <option value="auto">Auto (from flow gauge)</option>
                  <option value="manual">Manual entry</option>
                  <option value="tva">TVA (manual)</option>
                  <option value="usace">USACE (manual)</option>
                  <option value="consumers-energy">
                    Consumers Energy (manual)
                  </option>
                </Select>
              </Field>
              {(damKind === 'tva' || damKind === 'consumers-energy') && (
                <Field label="Dam name">
                  <Input
                    value={damName}
                    onChange={(e) => setDamName(e.target.value)}
                    placeholder="Center Hill"
                  />
                </Field>
              )}
            </div>
          </div>
        );
      })()}

      {error && <div className="text-sm text-danger">{error}</div>}

      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving…
            </>
          ) : (
            'Save'
          )}
        </Button>
      </div>
    </form>
  );
}

function PinPicker({
  lat,
  lng,
  onSet,
}: {
  lat: number | null;
  lng: number | null;
  onSet: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onSet(e.latlng.lat, e.latlng.lng);
    },
  });
  // useEffect dependency to satisfy linter when no marker exists.
  useEffect(() => {}, [lat, lng]);
  if (lat == null || lng == null) return null;
  return <Marker position={[lat, lng]} icon={dropIcon} />;
}

function RecenterOnTarget({
  target,
}: {
  target: { lat: number; lng: number; zoom: number } | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (target) map.setView([target.lat, target.lng], target.zoom);
  }, [target, map]);
  return null;
}

function makeFlowProvider(kind: FlowKind, value: string): FlowProvider | null {
  if (!kind) return null;
  if (!value) return null;
  if (kind === 'usgs') return { kind: 'usgs', siteId: value };
  if (kind === 'env-canada') return { kind: 'env-canada', stationId: value };
  if (kind === 'uk-ea') return { kind: 'uk-ea', stationRef: value };
  return null;
}

/**
 * Builds the station-picker list for a matched waterbody.
 * Combines the body's primary `dataProviders.lakeData` (synthesized
 * label from station id + kind) with any explicitly-declared
 * alternates.
 */
function buildWaterbodyStations(
  w: Waterbody
): Array<{ provider: LakeDataProvider; label: string }> {
  const out: Array<{ provider: LakeDataProvider; label: string }> = [];
  const primary = w.dataProviders?.lakeData;
  if (primary) {
    out.push({
      provider: primary,
      label: friendlyLakeLabel(primary, 'primary'),
    });
  }
  for (const alt of w.alternateLakeStations ?? []) {
    out.push(alt);
  }
  return out;
}

function friendlyLakeLabel(
  p: LakeDataProvider,
  tag: 'primary' | 'alternate'
): string {
  const prefix = tag === 'primary' ? '✓ ' : '';
  if (p.kind === 'noaa-buoy') return `${prefix}NDBC ${p.stationId}`;
  if (p.kind === 'noaa-coops') return `${prefix}CO-OPS ${p.stationId}`;
  if (p.kind === 'usgs-lake') return `${prefix}USGS-lake ${p.siteId}`;
  if (p.kind === 'estimated') return `${prefix}Estimated (air-temp model)`;
  return prefix;
}

function makeLakeProvider(
  kind: '' | 'noaa-buoy' | 'usgs-lake' | 'noaa-coops' | 'estimated',
  id: string
): LakeDataProvider | null {
  if (!kind) return null;
  if (kind === 'estimated') return { kind: 'estimated' };
  if (!id) return null;
  if (kind === 'noaa-buoy') return { kind: 'noaa-buoy', stationId: id };
  if (kind === 'usgs-lake') return { kind: 'usgs-lake', siteId: id };
  if (kind === 'noaa-coops') return { kind: 'noaa-coops', stationId: id };
  return null;
}

function makeDamProvider(
  kind: DamKind,
  dam: string,
  flowSiteId: string
): DamScheduleProvider | null {
  if (!kind) return null;
  if (kind === 'tva') return { kind: 'tva', dam };
  if (kind === 'consumers-energy') return { kind: 'consumers-energy', dam };
  if (kind === 'usace') return { kind: 'usace', district: '', project: '' };
  if (kind === 'manual') return { kind: 'manual' };
  if (kind === 'auto' && flowSiteId)
    return { kind: 'auto', flowSiteId };
  return null;
}

/**
 * Best-effort water-type guess from reverse-geocode + tide-station
 * proximity. Returns null when nothing's confidently inferable — the
 * caller leaves the user's existing pick (or the default) alone.
 *
 * Priorities:
 *   1. Saltwater wins if a NOAA tide station is within 5 mi — that
 *      proximity is the strongest signal for "this is brackish or
 *      open coastal water".
 *   2. Lake/reservoir/pond name patterns from Nominatim's water field.
 *   3. River/stream presence → freestone (most rivers; user can
 *      change to tailwater if there's a known dam upstream).
 *   4. Great Lakes bounding box fallback for stretches of MI/IN/OH/PA/NY
 *      Great Lakes shoreline that Nominatim doesn't label as saltwater.
 */
function inferWaterType(args: {
  river?: string;
  water?: string;
  tideStationDistanceMiles: number | null;
  lat: number;
  lng: number;
}): WaterType | null {
  const { river, water, tideStationDistanceMiles, lat, lng } = args;
  if (tideStationDistanceMiles != null && tideStationDistanceMiles < 5) {
    return 'saltwater';
  }
  if (water) {
    const n = water.toLowerCase();
    if (/reservoir|impoundment/.test(n)) return 'reservoir';
    if (/pond/.test(n)) return 'pond';
    if (/great lake|lake michigan|lake huron|lake superior|lake erie|lake ontario/.test(n)) {
      return 'great_lakes';
    }
    if (/lake/.test(n)) return 'lake';
  }
  // Crude Great-Lakes bbox check — covers shoreline waters that just
  // say "Lake Michigan" or aren't tagged at all.
  if (isInGreatLakesBbox(lat, lng)) return 'great_lakes';
  if (river) return 'freestone';
  return null;
}

function isInGreatLakesBbox(lat: number, lng: number): boolean {
  // Rough union of the five Great Lakes — generous enough to cover
  // shoreline pins. Inland of these still returns false.
  // Lake Superior: 46.5-49.0 N, -92.5 to -84.3 W
  if (lat >= 46.5 && lat <= 49 && lng >= -92.5 && lng <= -84.3) return true;
  // Lake Michigan: 41.6-46.1 N, -88.0 to -85.0 W
  if (lat >= 41.6 && lat <= 46.1 && lng >= -88 && lng <= -85) return true;
  // Lake Huron: 43.0-46.3 N, -84.6 to -79.6 W
  if (lat >= 43 && lat <= 46.3 && lng >= -84.6 && lng <= -79.6) return true;
  // Lake Erie: 41.4-42.9 N, -83.5 to -78.8 W
  if (lat >= 41.4 && lat <= 42.9 && lng >= -83.5 && lng <= -78.8) return true;
  // Lake Ontario: 43.2-44.2 N, -79.9 to -76.0 W
  if (lat >= 43.2 && lat <= 44.2 && lng >= -79.9 && lng <= -76) return true;
  return false;
}

function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60) ||
    `loc-${Date.now()}`
  );
}
