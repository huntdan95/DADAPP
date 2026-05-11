import { useEffect, useRef, useState } from 'react';
import { Loader2, Search, X } from 'lucide-react';
import {
  forwardGeocode,
  type ForwardGeocodeResult,
} from '@/lib/geo/reverseGeocode';
import { cn } from '@/lib/utils';
import { friendlyError } from '@/lib/errors';

/**
 * Floating map-search pill. Free-text query → Nominatim → list of
 * matching places (towns, lakes, rivers, addresses, USGS gauge
 * descriptions, etc). Picking a result hands the chosen point + its
 * bounding box back to the caller, who decides how to recenter / drop
 * a pin.
 *
 * Used in two places:
 *   - MapView (Spots tab) → recenter the map + drop a temporary
 *     "looking here" pin so the user can scout.
 *   - LocationForm Add-Spot map → drops the actual location pin,
 *     which kicks off the existing reverse-geocode / nearest-gauge
 *     auto-detect chain.
 *
 * Renders inside an `absolute z-[1000]` wrapper that the parent
 * positions — the component itself only knows how to lay out its
 * input + dropdown.
 *
 * Why not a separate `react-leaflet-geosearch` package? The Nominatim
 * call is six lines (already used for reverse-geocode + reverse pin
 * placement), so a hand-rolled component keeps the bundle smaller and
 * matches our visual language. Debounced 350 ms so typing doesn't
 * hammer Nominatim's free tier.
 */
export function MapSearch({
  onPick,
  placeholder = 'Search a town, river, lake, address…',
  className,
  autoFocus = false,
}: {
  onPick: (result: ForwardGeocodeResult) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<ForwardGeocodeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Debounced search. Only fires after the user pauses for 350 ms, so
  // a five-character query doesn't generate five Nominatim hits.
  useEffect(() => {
    const trimmed = q.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const rows = await forwardGeocode(trimmed, 6);
        if (cancelled) return;
        setResults(rows);
        setError(rows.length === 0 ? 'No matches.' : null);
      } catch (e) {
        if (!cancelled) {
          setError(friendlyError(e));
          setResults([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [q]);

  // Close the dropdown when clicking anywhere outside the search.
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  function pick(r: ForwardGeocodeResult) {
    onPick(r);
    setOpen(false);
    setQ(shortLabel(r));
  }

  return (
    <div ref={wrapperRef} className={cn('w-72 max-w-[80vw]', className)}>
      <div className="flex items-center gap-2 bg-surface/95 backdrop-blur border border-border rounded-xl shadow px-2 h-10">
        <Search className="w-4 h-4 text-muted flex-none" />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && results[0]) {
              e.preventDefault();
              pick(results[0]);
            }
            if (e.key === 'Escape') {
              setOpen(false);
              inputRef.current?.blur();
            }
          }}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-text placeholder:text-muted focus:outline-none min-w-0"
        />
        {q && (
          <button
            type="button"
            onClick={() => {
              setQ('');
              setResults([]);
              setOpen(false);
              inputRef.current?.focus();
            }}
            className="text-muted hover:text-text flex-none"
            aria-label="Clear"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        {loading && (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-muted flex-none" />
        )}
      </div>
      {open && (results.length > 0 || error) && (
        <div className="mt-1 bg-surface/95 backdrop-blur border border-border rounded-xl shadow-lg overflow-hidden">
          {error && results.length === 0 ? (
            <div className="text-xs text-muted px-3 py-2">{error}</div>
          ) : (
            <ul className="max-h-72 overflow-y-auto">
              {results.map((r) => (
                <li key={`${r.lat},${r.lng},${r.display}`}>
                  <button
                    type="button"
                    onClick={() => pick(r)}
                    className="w-full text-left px-3 py-2 hover:bg-surface-2 transition border-b border-border last:border-b-0"
                  >
                    <div className="text-sm text-text leading-tight truncate">
                      {shortLabel(r)}
                    </div>
                    <div className="text-[11px] text-muted truncate">
                      {r.display}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Nominatim's display_name is the full hierarchy ("Center Hill Lake,
 * DeKalb County, Tennessee, United States"). For the primary line of
 * a result we want the most-specific bit — the first comma segment —
 * which reads cleaner in the dropdown.
 */
function shortLabel(r: ForwardGeocodeResult): string {
  const head = r.display.split(',')[0]?.trim();
  return head || r.display;
}
