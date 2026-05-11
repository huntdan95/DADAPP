/**
 * Lightweight reverse-geocoding + USGS-nearest-gauge helpers used when
 * dropping a pin on the Add-Spot map. Free + no key, but rate-limited —
 * fine for occasional Add-Spot flows; don't call in a loop.
 */

const STATE_NAME_TO_USPS: Record<string, string> = {
  Alabama: 'AL', Alaska: 'AK', Arizona: 'AZ', Arkansas: 'AR', California: 'CA',
  Colorado: 'CO', Connecticut: 'CT', Delaware: 'DE', Florida: 'FL', Georgia: 'GA',
  Hawaii: 'HI', Idaho: 'ID', Illinois: 'IL', Indiana: 'IN', Iowa: 'IA',
  Kansas: 'KS', Kentucky: 'KY', Louisiana: 'LA', Maine: 'ME', Maryland: 'MD',
  Massachusetts: 'MA', Michigan: 'MI', Minnesota: 'MN', Mississippi: 'MS',
  Missouri: 'MO', Montana: 'MT', Nebraska: 'NE', Nevada: 'NV',
  'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
  'North Carolina': 'NC', 'North Dakota': 'ND', Ohio: 'OH', Oklahoma: 'OK',
  Oregon: 'OR', Pennsylvania: 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', Tennessee: 'TN', Texas: 'TX', Utah: 'UT',
  Vermont: 'VT', Virginia: 'VA', Washington: 'WA', 'West Virginia': 'WV',
  Wisconsin: 'WI', Wyoming: 'WY',
};

/**
 * Per-state default IANA timezone. Mixed-tz states map to the dominant
 * zone; users can override in the form. Add states here as we expand
 * coverage; states not listed fall back to America/New_York.
 */
const STATE_TZ: Record<string, string> = {
  AL: 'America/Chicago',
  AK: 'America/Anchorage',
  AZ: 'America/Phoenix',
  AR: 'America/Chicago',
  CA: 'America/Los_Angeles',
  CO: 'America/Denver',
  CT: 'America/New_York',
  DE: 'America/New_York',
  FL: 'America/New_York',         // panhandle is Central, but most of state is Eastern
  GA: 'America/New_York',
  HI: 'Pacific/Honolulu',
  ID: 'America/Boise',             // northern panhandle is Pacific; most is Mountain
  IL: 'America/Chicago',
  IN: 'America/Indiana/Indianapolis',
  IA: 'America/Chicago',
  KS: 'America/Chicago',           // small western strip is Mountain
  KY: 'America/New_York',          // western KY is Central
  LA: 'America/Chicago',
  ME: 'America/New_York',
  MD: 'America/New_York',
  MA: 'America/New_York',
  MI: 'America/Detroit',           // four UP counties are Central
  MN: 'America/Chicago',
  MS: 'America/Chicago',
  MO: 'America/Chicago',
  MT: 'America/Denver',
  NE: 'America/Chicago',           // western panhandle is Mountain
  NV: 'America/Los_Angeles',       // eastern strip is Mountain
  NH: 'America/New_York',
  NJ: 'America/New_York',
  NM: 'America/Denver',
  NY: 'America/New_York',
  NC: 'America/New_York',
  ND: 'America/Chicago',           // western half is Mountain
  OH: 'America/New_York',
  OK: 'America/Chicago',
  OR: 'America/Los_Angeles',
  PA: 'America/New_York',
  RI: 'America/New_York',
  SC: 'America/New_York',
  SD: 'America/Chicago',           // western half is Mountain
  TN: 'America/Chicago',           // eastern TN is Eastern (Tri-Cities, Chattanooga)
  TX: 'America/Chicago',           // El Paso area is Mountain
  UT: 'America/Denver',
  VT: 'America/New_York',
  VA: 'America/New_York',
  WA: 'America/Los_Angeles',
  WV: 'America/New_York',
  WI: 'America/Chicago',
  WY: 'America/Denver',
};

export interface ReverseGeocodeResult {
  state?: string;          // USPS 2-letter
  country?: string;        // ISO-3166 alpha-2
  county?: string;         // e.g. "Crawford County" → we strip " County"
  river?: string;
  /** Lake / pond / reservoir name if the pin sits on a still water. */
  water?: string;
  /** Nearest named landmark/road for name suggestions. */
  nearestRoad?: string;
  /** Town / city, for name fallback ("Pinkerton in Franklin"). */
  town?: string;
  display?: string;        // human-readable place name
}

/**
 * Free OpenStreetMap Nominatim reverse-geocode. Returns USPS state code,
 * country, and a best-guess river name from `waterway`/`water` tags.
 *
 * Nominatim's usage policy requires a non-default User-Agent and ≤1 rps.
 * For a small group app this is fine.
 */
export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<ReverseGeocodeResult> {
  const url = new URL('https://nominatim.openstreetmap.org/reverse');
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lon', String(lng));
  url.searchParams.set('format', 'json');
  url.searchParams.set('zoom', '14');
  url.searchParams.set('addressdetails', '1');

  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`reverse-geocode HTTP ${res.status}`);
  }
  const json = (await res.json()) as {
    address?: {
      state?: string;
      country_code?: string;
      county?: string;
      river?: string;
      stream?: string;
      water?: string;
      body_of_water?: string;
      road?: string;
      pedestrian?: string;
      cycleway?: string;
      bridge?: string;
      town?: string;
      city?: string;
      village?: string;
      hamlet?: string;
      suburb?: string;
    };
    display_name?: string;
  };

  const addr = json.address ?? {};
  const state = addr.state ? STATE_NAME_TO_USPS[addr.state] : undefined;
  // Nominatim returns "Crawford County" — strip the suffix so the
  // friendly chip reads "Crawford Co".
  const countyRaw = addr.county;
  const county = countyRaw
    ? countyRaw.replace(/\s+County$/i, '')
    : undefined;
  const river = addr.river ?? addr.stream ?? undefined;
  const water = addr.body_of_water ?? addr.water ?? undefined;
  const nearestRoad = addr.road ?? addr.bridge ?? addr.pedestrian ?? addr.cycleway;
  const town =
    addr.town ?? addr.city ?? addr.village ?? addr.hamlet ?? addr.suburb;
  return {
    state,
    country: addr.country_code?.toUpperCase(),
    county,
    river,
    water,
    nearestRoad,
    town,
    display: json.display_name,
  };
}

/** Default IANA timezone for a USPS state code. */
export function timezoneForState(state: string | undefined): string {
  if (!state) return 'America/New_York';
  return STATE_TZ[state.toUpperCase()] ?? 'America/New_York';
}

export interface NearbyGauge {
  siteId: string;
  name: string;
  lat: number;
  lng: number;
  distanceMiles: number;
  hasWaterTemp: boolean;
}

/**
 * Find the N closest active USGS gauges to a pin via NWIS site search.
 * Filters to currently-active sites publishing flow (00060) and enriches
 * each with a water-temp availability flag. Empty array if no gauge is
 * within the bbox.
 */
export async function nearestUsgsGauges(
  lat: number,
  lng: number,
  limit = 3,
  searchDegrees = 0.5
): Promise<NearbyGauge[]> {
  // bbox = W,S,E,N (lon,lat,lon,lat) per the NWIS spec.
  const w = (lng - searchDegrees).toFixed(4);
  const s = (lat - searchDegrees).toFixed(4);
  const e = (lng + searchDegrees).toFixed(4);
  const n = (lat + searchDegrees).toFixed(4);

  const url =
    `https://waterservices.usgs.gov/nwis/site/?format=rdb` +
    `&bBox=${w},${s},${e},${n}` +
    `&siteStatus=active&parameterCd=00060&hasDataTypeCd=iv`;

  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404) return [];
    throw new Error(`USGS site search HTTP ${res.status}`);
  }
  const text = await res.text();
  const sites = parseUsgsRdb(text);
  if (sites.length === 0) return [];

  // Tag which sites publish water-temp so the user can prefer those.
  const ids = sites.map((s) => s.siteId).join(',');
  const tempUrl =
    `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${ids}` +
    `&parameterCd=00010&siteStatus=all`;
  let withTemp = new Set<string>();
  try {
    const r2 = await fetch(tempUrl);
    if (r2.ok) {
      const j = (await r2.json()) as {
        value: { timeSeries: Array<{ sourceInfo: { siteCode: Array<{ value: string }> } }> };
      };
      withTemp = new Set(
        j.value.timeSeries.map((t) => t.sourceInfo.siteCode[0]?.value)
      );
    }
  } catch {
    // best-effort
  }

  const enriched = sites.map((site) => ({
    ...site,
    distanceMiles: distMiles({ lat, lng }, { lat: site.lat, lng: site.lng }),
    hasWaterTemp: withTemp.has(site.siteId),
  }));
  enriched.sort((a, b) => a.distanceMiles - b.distanceMiles);
  return enriched.slice(0, limit);
}

/**
 * Find the closest active USGS gauge to a pin via NWIS site search.
 * Filters to currently-active sites publishing flow (00060). Returns
 * the single nearest result, or null if no gauge is within the bbox.
 *
 * Kept for backwards compatibility — new code should prefer
 * `nearestUsgsGauges` and present the top three options.
 */
export async function nearestUsgsGauge(
  lat: number,
  lng: number,
  searchDegrees = 0.5
): Promise<NearbyGauge | null> {
  // bbox = W,S,E,N (lon,lat,lon,lat) per the NWIS spec.
  const w = (lng - searchDegrees).toFixed(4);
  const s = (lat - searchDegrees).toFixed(4);
  const e = (lng + searchDegrees).toFixed(4);
  const n = (lat + searchDegrees).toFixed(4);

  const url =
    `https://waterservices.usgs.gov/nwis/site/?format=rdb` +
    `&bBox=${w},${s},${e},${n}` +
    `&siteStatus=active&parameterCd=00060&hasDataTypeCd=iv`;

  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404) return null;        // no gauges in bbox
    throw new Error(`USGS site search HTTP ${res.status}`);
  }
  const text = await res.text();
  const sites = parseUsgsRdb(text);
  if (sites.length === 0) return null;

  // Also pull params for each so we can flag "has water temp" — single
  // call by site ID.
  const ids = sites.map((s) => s.siteId).join(',');
  const tempUrl =
    `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${ids}` +
    `&parameterCd=00010&siteStatus=all`;
  let withTemp = new Set<string>();
  try {
    const r2 = await fetch(tempUrl);
    if (r2.ok) {
      const j = (await r2.json()) as {
        value: { timeSeries: Array<{ sourceInfo: { siteCode: Array<{ value: string }> } }> };
      };
      withTemp = new Set(
        j.value.timeSeries.map((t) => t.sourceInfo.siteCode[0]?.value)
      );
    }
  } catch {
    // best-effort; not fatal
  }

  const enriched = sites.map((site) => ({
    ...site,
    distanceMiles: distMiles({ lat, lng }, { lat: site.lat, lng: site.lng }),
    hasWaterTemp: withTemp.has(site.siteId),
  }));
  enriched.sort((a, b) => a.distanceMiles - b.distanceMiles);
  return enriched[0];
}

interface RawSite {
  siteId: string;
  name: string;
  lat: number;
  lng: number;
}

/** Parses USGS NWIS RDB (tab-separated) site search output. */
function parseUsgsRdb(text: string): RawSite[] {
  const lines = text.split('\n').filter((l) => l && !l.startsWith('#'));
  if (lines.length < 2) return [];
  const header = lines[0].split('\t');
  const idxSiteNo = header.indexOf('site_no');
  const idxName = header.indexOf('station_nm');
  const idxLat = header.indexOf('dec_lat_va');
  const idxLng = header.indexOf('dec_long_va');
  if (idxSiteNo < 0 || idxLat < 0 || idxLng < 0) return [];

  const out: RawSite[] = [];
  // lines[1] is the type/length row (e.g. "5s\t40s\t..."); skip it.
  for (let i = 2; i < lines.length; i++) {
    const f = lines[i].split('\t');
    if (f.length <= idxSiteNo) continue;
    const lat = parseFloat(f[idxLat]);
    const lng = parseFloat(f[idxLng]);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
    out.push({
      siteId: f[idxSiteNo],
      name: idxName >= 0 ? f[idxName] : f[idxSiteNo],
      lat,
      lng,
    });
  }
  return out;
}

function distMiles(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
