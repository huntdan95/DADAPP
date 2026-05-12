import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Calendar,
  ExternalLink,
  Fish,
  Loader2,
  MapPin,
  StickyNote,
} from 'lucide-react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import type { StockingEvent } from '@/lib/stocking/types';
import { geocodeWater, type GeocodeResult } from '@/lib/stocking/geocode';
import { buildFishMarker } from '@/features/map/fishMarker';
import { BASEMAPS } from '@/features/map/basemaps';

/**
 * Per-event detail sheet for the stocking banner.
 *
 *   - Header line: human date + species + count if known
 *   - Detail grid: size, hatchery/strain (MT FWP), county, region, source
 *   - Free-text notes from the scraper
 *   - Map pin — preferred order:
 *       1) event.lat/lng (rare: only manual entries that bothered)
 *       2) on-demand Nominatim lookup of (water, county, state)
 *       3) fallback: "search this water" external link
 *
 *   The geocoded result is cached in localStorage so re-tapping the
 *   same water doesn't re-hit Nominatim every time. The lookup is
 *   gated behind the user opening this sheet — no background fan-out
 *   when the banner renders 50 events.
 */
export function StockingEventSheet({
  event,
  onClose,
}: {
  /** Open when present; null/undefined closes the sheet. */
  event: StockingEvent | null;
  onClose: () => void;
}) {
  // Parsed county/region from the notes field — most scrapers stash
  // these there since the StockingEvent type doesn't have a dedicated
  // column. (The seed-data JSON has them as top-level fields, but by
  // the time it lands in Firestore those are either folded into
  // `notes` or kept on the raw doc.)
  const meta = useMemo(() => parseEventMeta(event), [event]);

  // Resolved coordinates. Starts as the event's own lat/lng if it
  // shipped with them. Otherwise null while the on-demand geocode
  // runs, then either a real result or a null fallback.
  const [resolved, setResolved] = useState<{
    lat: number;
    lng: number;
    source: 'event' | 'geocoded';
    matchedLabel?: string;
  } | null>(null);
  const [geocoding, setGeocoding] = useState(false);
  const [geocodeAttempted, setGeocodeAttempted] = useState(false);

  // Reset state when the event changes (e.g. user closes + opens a
  // different one without unmounting the parent).
  useEffect(() => {
    if (!event) {
      setResolved(null);
      setGeocoding(false);
      setGeocodeAttempted(false);
      return;
    }
    // Use shipped coords if the event has them — no API call needed.
    if (event.lat != null && event.lng != null) {
      setResolved({ lat: event.lat, lng: event.lng, source: 'event' });
      setGeocodeAttempted(false);
      return;
    }
    // Otherwise kick off the on-demand lookup once per event.
    let cancelled = false;
    setResolved(null);
    setGeocoding(true);
    setGeocodeAttempted(false);
    geocodeWater({
      water: event.locationName,
      county: meta.county,
      state: event.state,
    })
      .then((g: GeocodeResult | null) => {
        if (cancelled) return;
        if (g) {
          setResolved({
            lat: g.lat,
            lng: g.lng,
            source: 'geocoded',
            matchedLabel: g.matchedLabel,
          });
        }
        setGeocodeAttempted(true);
      })
      .finally(() => {
        if (!cancelled) setGeocoding(false);
      });
    return () => {
      cancelled = true;
    };
  }, [event, meta.county]);

  // Reuse the same fishability-style pin the main MapView uses.
  // 'good' renders in the green-accent tone — fits this UI's
  // "this place is being stocked" framing.
  const markerIcon = useMemo(() => buildFishMarker('good'), []);

  // External search fallback link — Google Maps with the water name +
  // state. Always offered, even when we have coords, because the
  // single-pin mini-map only shows one waterbody and the user might
  // want to see the broader river.
  const externalSearch = useMemo(() => {
    if (!event) return null;
    const q = `${event.locationName} ${event.state}`;
    return `https://www.google.com/maps/search/${encodeURIComponent(q)}`;
  }, [event]);

  // Don't render anything when no event is selected — the parent uses
  // `event={null}` to mean "closed." Returning null here also lets the
  // useEffect above run its cleanup branch instead of mounting an
  // empty BottomSheet shell.
  if (!event) return null;

  return (
    <BottomSheet open onClose={onClose} title="Stocking event">
      <div className="flex flex-col gap-3">
        {/* Header */}
        <div>
          <div className="text-base font-semibold flex items-start gap-2">
            <Fish className="w-4 h-4 text-accent mt-0.5 flex-none" />
            <span>{event.locationName}</span>
          </div>
          <div className="text-xs text-muted mt-1 flex items-center gap-1.5 flex-wrap">
            <Calendar className="w-3 h-3" />
            <span className="num">{formatLongDate(event.date)}</span>
            <span>·</span>
            <span>{event.species}</span>
            {event.count != null && (
              <>
                <span>·</span>
                <span className="num">
                  {event.count.toLocaleString()} fish
                </span>
              </>
            )}
          </div>
        </div>

        {/* Detail grid: size / hatchery / strain / county / region / source */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {event.size && <Field label="Size" value={event.size} />}
          {meta.hatchery && <Field label="Hatchery" value={meta.hatchery} />}
          {meta.strain && <Field label="Strain" value={meta.strain} />}
          {meta.county && <Field label="County" value={`${meta.county}${meta.county.endsWith('County') ? '' : ' County'}`} />}
          {meta.region && <Field label="Region" value={meta.region} />}
          <Field label="State" value={event.state} />
          <Field label="Source" value={sourceLabel(event.source)} />
        </div>

        {/* Notes from the scraper / contributor */}
        {event.notes && !looksLikeMetaDump(event.notes) && (
          <div className="rounded-lg border border-border bg-surface-2/40 p-2.5">
            <div className="text-[10px] uppercase tracking-wider text-muted flex items-center gap-1 mb-1">
              <StickyNote className="w-3 h-3" />
              Notes
            </div>
            <div className="text-xs text-text/90 leading-relaxed">
              {event.notes}
            </div>
          </div>
        )}

        {/* Map section */}
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted mb-1 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            Location
          </div>

          {geocoding && (
            <div className="rounded-lg border border-border bg-surface-2/40 p-4 flex items-center justify-center gap-2 text-xs text-muted">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Looking up the water on OpenStreetMap…
            </div>
          )}

          {resolved && (
            <div className="flex flex-col gap-1">
              <div className="rounded-xl overflow-hidden border border-border h-48">
                {/* `key` forces React to fully remount the MapContainer
                    when the event changes — Leaflet doesn't handle
                    in-place re-centering across BottomSheet open
                    cycles cleanly otherwise. */}
                <MapContainer
                  key={`${event.id}:${resolved.lat}:${resolved.lng}`}
                  center={[resolved.lat, resolved.lng]}
                  zoom={13}
                  scrollWheelZoom={false}
                  zoomControl={false}
                  attributionControl={false}
                  className="h-full w-full bg-surface"
                >
                  <TileLayer
                    url={BASEMAPS.osm.url}
                    attribution={BASEMAPS.osm.attribution}
                    maxZoom={BASEMAPS.osm.maxZoom}
                  />
                  <Marker
                    position={[resolved.lat, resolved.lng]}
                    icon={markerIcon}
                  />
                </MapContainer>
              </div>
              <div className="text-[10px] text-muted flex items-center justify-between gap-2">
                <span className="num">
                  {resolved.lat.toFixed(4)}, {resolved.lng.toFixed(4)}
                </span>
                {resolved.source === 'geocoded' && (
                  <span
                    className="text-muted/80"
                    title={resolved.matchedLabel}
                  >
                    matched via OpenStreetMap
                  </span>
                )}
                {resolved.source === 'event' && (
                  <span className="text-accent/70">from DNR record</span>
                )}
              </div>
            </div>
          )}

          {!geocoding && !resolved && geocodeAttempted && (
            <div className="rounded-lg border border-border bg-surface-2/40 p-3 text-xs text-muted">
              OpenStreetMap didn't have a clean match for this water.
              Use the external link below to find it on Google Maps.
            </div>
          )}

          {externalSearch && (
            <a
              href={externalSearch}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-xs text-info hover:text-accent transition"
            >
              <ExternalLink className="w-3 h-3" />
              Search "{event.locationName}" on Google Maps
            </a>
          )}
        </div>
      </div>
    </BottomSheet>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface-2/30 px-2.5 py-1.5">
      <div className="text-[10px] uppercase tracking-wider text-muted">
        {label}
      </div>
      <div className="text-text/90 truncate">{value}</div>
    </div>
  );
}

/**
 * Extracts hatchery / strain / county / region from the event's notes
 * field. Each scraper writes these differently into `notes`; we look
 * for common patterns. The seed-data JSON has these as top-level
 * fields but they get folded into Firestore as notes text or kept
 * as extra doc fields the StockingEvent type doesn't expose.
 *
 * This is best-effort and intentionally permissive: better to over-
 * extract than to miss data the user could read in plain text anyway.
 */
function parseEventMeta(event: StockingEvent | null): {
  hatchery?: string;
  strain?: string;
  county?: string;
  region?: string;
} {
  if (!event?.notes) return {};
  const notes = event.notes;
  const out: ReturnType<typeof parseEventMeta> = {};

  // Try "Hatchery: X" / "hatchery: X" — common in MT/AR data.
  const hatchery = /\bhatchery[:=]\s*([^.,\n]+)/i.exec(notes);
  if (hatchery) out.hatchery = hatchery[1].trim();

  const strain = /\bstrain[:=]\s*([^.,\n]+)/i.exec(notes);
  if (strain) out.strain = strain[1].trim();

  // County: explicit "Foo County" mention, or "(Foo Co.)" / "(Foo)"
  const county =
    /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\s+County\b/.exec(notes) ??
    /\b\(([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\s+Co\.?\)/.exec(notes);
  if (county) out.county = county[1].trim();

  const region = /\b(Region\s+\d+|Northeast|Northwest|Southeast|Southwest|Northern|Southern|Eastern|Western|Central)\b/.exec(notes);
  if (region) out.region = region[1].trim();

  return out;
}

/** Notes that are 100% scraper-meta — skip rendering them as user-visible. */
function looksLikeMetaDump(notes: string): boolean {
  // Pure metadata: e.g. "Seeded from PFBC 2026 Adult Trout Stocking
  // Schedule (Sec 4)." — not useful prose for the user.
  return (
    /^Seeded from/i.test(notes) ||
    /Stocking Schedule/i.test(notes) ||
    /Weekly Trout Stocking Report/i.test(notes)
  );
}

function formatLongDate(yyyyMmDd: string): string {
  const ms = Date.parse(yyyyMmDd + 'T12:00:00Z');
  if (Number.isNaN(ms)) return yyyyMmDd;
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(ms));
}

function sourceLabel(source: StockingEvent['source']): string {
  switch (source) {
    case 'twra': return 'TWRA';
    case 'mi-dnr': return 'MI DNR';
    case 'nc-wrc': return 'NC WRC';
    case 'ga-dnr': return 'GA DNR';
    case 'fwc': return 'FWC';
    case 'in-dnr': return 'IN DNR';
    case 'al-dcnr': return 'AL DCNR';
    case 'ky-dfwr': return 'KDFWR';
    case 'pa-fbc': return 'PFBC';
    case 'mt-fwp': return 'MT FWP';
    case 'id-fg': return 'IDFG';
    case 'co-cpw': return 'CPW';
    case 'ut-dwr': return 'UDWR';
    case 'ar-agfc': return 'AGFC';
    case 'ok-odwc': return 'ODWC';
    case 'ms-mdwfp': return 'MDWFP';
    case 'il-dnr': return 'IL DNR';
    case 'manual': return 'Manual';
    default: return source;
  }
}
