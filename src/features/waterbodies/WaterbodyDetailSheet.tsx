import { useMemo } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  ExternalLink,
  Fish,
  Info,
  MapPin,
  Ruler,
  Scale,
  Waves,
} from 'lucide-react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import type {
  PatternEntry,
  SpeciesEntry,
  Waterbody,
} from '@/lib/waterbodies/types';
import { buildFishMarker } from '@/features/map/fishMarker';
import { BASEMAPS } from '@/features/map/basemaps';

/**
 * Detail view for a single waterbody. Lives in a bottom sheet so it
 * stacks above the WatersGuide list without forcing the user out of
 * their browsing context.
 *
 * Layout follows a clear hierarchy: identity → location → species
 * table (importance-sorted) → patterns (calendar-ordered) → access
 * + regs + notes. Designed for quick reference — what species, what
 * to throw, where to launch.
 */
export function WaterbodyDetailSheet({
  waterbody,
  onClose,
}: {
  waterbody: Waterbody | null;
  onClose: () => void;
}) {
  // Sort species by importance so the headliner sits at the top.
  const sortedSpecies = useMemo(() => {
    if (!waterbody) return [];
    const order: Record<SpeciesEntry['importance'], number> = {
      signature: 0,
      strong: 1,
      good: 2,
      present: 3,
    };
    return [...waterbody.species].sort(
      (a, b) => order[a.importance] - order[b.importance]
    );
  }, [waterbody]);

  // Reuse the green-toned marker style from the main map.
  const markerIcon = useMemo(() => buildFishMarker('good'), []);

  // External Google Maps fallback link for waterbodies that lack
  // explicit coords or for users who want a fuller satellite view.
  const externalMap = useMemo(() => {
    if (!waterbody) return null;
    const q = `${waterbody.name} ${waterbody.state}`;
    return `https://www.google.com/maps/search/${encodeURIComponent(q)}`;
  }, [waterbody]);

  if (!waterbody) return null;

  return (
    <BottomSheet open onClose={onClose} title={waterbody.name}>
      <div className="flex flex-col gap-4">
        {/* Identity strip — county, acres, depth, river, region. */}
        <div className="rounded-xl bg-surface-2/40 border border-border p-3">
          <div className="text-xs text-muted leading-relaxed flex flex-wrap gap-x-2">
            {waterbody.county && (
              <span>
                <b>County:</b> {waterbody.county}
              </span>
            )}
            {waterbody.acres != null && (
              <span>
                <b>Size:</b> {waterbody.acres.toLocaleString()} acres
              </span>
            )}
            {waterbody.maxDepthFt != null && (
              <span>
                <b>Max depth:</b> {waterbody.maxDepthFt} ft
              </span>
            )}
            {waterbody.river && (
              <span>
                <b>River:</b> {waterbody.river}
              </span>
            )}
            <span>
              <b>Region:</b> {waterbody.region}
            </span>
            <span>
              <b>Type:</b> {prettyType(waterbody.type)}
            </span>
          </div>
        </div>

        {waterbody.signatureSpecies && (
          <div className="text-sm">
            <span className="text-muted">Signature: </span>
            <span className="font-semibold text-accent">
              {waterbody.signatureSpecies}
            </span>
          </div>
        )}

        {/* Species table */}
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted mb-1.5 flex items-center gap-1">
            <Fish className="w-3 h-3" />
            Species
          </div>
          <div className="flex flex-col gap-1.5">
            {sortedSpecies.map((s, i) => (
              <SpeciesRow key={i} s={s} />
            ))}
          </div>
        </div>

        {/* Patterns */}
        {waterbody.patterns.length > 0 && (
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted mb-1.5 flex items-center gap-1">
              <Waves className="w-3 h-3" />
              Top patterns
            </div>
            <div className="flex flex-col gap-2">
              {waterbody.patterns.map((p, i) => (
                <PatternCard key={i} p={p} />
              ))}
            </div>
          </div>
        )}

        {/* Map */}
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted mb-1.5 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            Location
          </div>
          {waterbody.lat != null && waterbody.lng != null ? (
            <div className="flex flex-col gap-1">
              <div className="rounded-xl overflow-hidden border border-border h-48">
                <MapContainer
                  key={`${waterbody.id}:${waterbody.lat}:${waterbody.lng}`}
                  center={[waterbody.lat, waterbody.lng]}
                  zoom={zoomForType(waterbody)}
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
                    position={[waterbody.lat, waterbody.lng]}
                    icon={markerIcon}
                  />
                </MapContainer>
              </div>
              <div className="text-[10px] text-muted num">
                {waterbody.lat.toFixed(4)}, {waterbody.lng.toFixed(4)}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-surface-2/40 p-3 text-xs text-muted">
              No approximate centroid in the guide. Use the external
              link below for a satellite view.
            </div>
          )}
          {externalMap && (
            <a
              href={externalMap}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-xs text-info hover:text-accent transition"
            >
              <ExternalLink className="w-3 h-3" />
              Open on Google Maps
            </a>
          )}
        </div>

        {/* Access list */}
        {waterbody.access && waterbody.access.length > 0 && (
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted mb-1.5">
              Access points
            </div>
            <ul className="text-xs flex flex-col gap-0.5 text-text/90">
              {waterbody.access.map((a, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <MapPin className="w-3 h-3 text-muted mt-0.5 flex-none" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Regulations */}
        {waterbody.regulations && (
          <div className="rounded-xl border border-warn/40 bg-warn/10 p-2.5 text-xs flex items-start gap-2">
            <Scale className="w-3.5 h-3.5 text-warn mt-0.5 flex-none" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-warn font-semibold">
                Regs
              </div>
              <div className="text-text/90 leading-relaxed">
                {waterbody.regulations}
              </div>
              <div className="text-[10px] text-muted mt-1">
                Always confirm current IDNR regulations before keeping
                fish.
              </div>
            </div>
          </div>
        )}

        {/* Management programs */}
        {waterbody.managementProgram &&
          waterbody.managementProgram.length > 0 && (
            <div className="rounded-xl border border-info/40 bg-info/10 p-2.5 text-xs flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-info mt-0.5 flex-none" />
              <div>
                <div className="text-[10px] uppercase tracking-wider text-info font-semibold">
                  Management
                </div>
                <ul className="text-text/90 leading-relaxed">
                  {waterbody.managementProgram.map((p, i) => (
                    <li key={i}>• {p}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

        {/* Long-form notes */}
        {waterbody.notes && (
          <div className="text-xs text-text/90 leading-relaxed border-t border-border pt-3">
            {waterbody.notes}
          </div>
        )}
      </div>
    </BottomSheet>
  );
}

function SpeciesRow({ s }: { s: SpeciesEntry }) {
  return (
    <div className="rounded-lg border border-border bg-surface-2/40 p-2.5 flex flex-col gap-0.5">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="text-sm font-semibold">{s.name}</div>
        <ImportanceBadge importance={s.importance} />
      </div>
      {(s.size || s.notes) && (
        <div className="text-[11px] text-muted leading-relaxed">
          {s.size && (
            <span className="inline-flex items-center gap-1">
              <Ruler className="w-3 h-3" />
              {s.size}
            </span>
          )}
          {s.size && s.notes && <span> · </span>}
          {s.notes}
        </div>
      )}
    </div>
  );
}

function ImportanceBadge({ importance }: { importance: SpeciesEntry['importance'] }) {
  const styles: Record<SpeciesEntry['importance'], string> = {
    signature: 'border-accent/40 bg-accent/15 text-accent',
    strong: 'border-info/40 bg-info/10 text-info',
    good: 'border-border bg-surface-2 text-text/80',
    present: 'border-border bg-surface-2/50 text-muted',
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider border whitespace-nowrap ${styles[importance]}`}
    >
      {importance}
    </span>
  );
}

function PatternCard({ p }: { p: PatternEntry }) {
  return (
    <div className="rounded-lg border border-border bg-surface-2/40 p-3 flex flex-col gap-1">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="text-sm font-semibold">{p.title}</div>
        <span className="text-[10px] text-accent border border-accent/40 bg-accent/10 px-1.5 py-0.5 rounded-md">
          {p.target}
        </span>
      </div>
      <div className="text-[11px] text-muted">
        <b>When:</b> {p.when}
      </div>
      <div className="text-xs text-text/90">
        <b className="text-muted">How:</b> {p.technique}
      </div>
      <div className="text-xs text-text/90">
        <b className="text-muted">Where:</b> {p.where}
      </div>
      {p.details && (
        <div className="text-[11px] text-muted leading-relaxed border-t border-border pt-1 mt-1">
          {p.details}
        </div>
      )}
    </div>
  );
}

function prettyType(t: Waterbody['type']): string {
  switch (t) {
    case 'natural-lake': return 'Natural lake';
    case 'reservoir': return 'Reservoir';
    case 'river': return 'River';
    case 'river-segment': return 'River segment';
    case 'great-lake': return 'Great Lake';
    case 'great-lake-trib': return 'Great Lake tributary';
    case 'tailwater': return 'Tailwater';
    case 'pond': return 'Pond';
    default: return t;
  }
}

/** Pick a zoom level that frames the waterbody — bigger reservoirs zoom out. */
function zoomForType(w: Waterbody): number {
  if (w.type === 'great-lake') return 8;
  if (w.acres && w.acres > 2500) return 12;
  if (w.acres && w.acres > 800) return 13;
  if (w.type === 'river' || w.type === 'great-lake-trib') return 12;
  return 14;
}
