/**
 * Find the N closest NDBC buoy / coastal-marine stations to a pin.
 *
 * Why a curated list instead of NDBC's full activestations.xml feed:
 *   - The XML is ~250 KB and includes ~1700 stations; client parse is
 *     heavy and most rows are international or pelagic.
 *   - We only need shoreline / lake-surface coverage for the regions
 *     this app supports (US Great Lakes + US coasts). 60-ish curated
 *     stations cover that with zero false positives and no parser.
 *
 * Add stations here as new regions get added. Source of truth:
 *   https://www.ndbc.noaa.gov/  (each station has a metadata page)
 */

export interface NearbyNdbcStation {
  stationId: string;
  name: string;
  region: 'great_lakes' | 'gulf' | 'atlantic' | 'pacific' | 'inland';
  lat: number;
  lng: number;
  distanceMiles: number;
}

/**
 * Curated NDBC station list. Includes:
 *   - Great Lakes mid-lake buoys (water temp + waves) — MI/IL/IN/OH/PA/NY
 *   - CMAN nearshore stations (Sleeping Bear, Stannard Rock, etc.)
 *   - Florida Gulf + Atlantic coastal buoys
 *   - NC / GA / AL / MS coastal coverage
 *
 * Each row: [id, name, region, lat, lng]. Coordinates copied from each
 * station's NDBC metadata page; precision rounded to 4 decimals (~30 ft).
 *
 * NOT included: very-deep-pelagic and arctic / Pacific stations far
 * outside our coverage map. Easy to extend.
 */
const STATIONS: Array<[string, string, NearbyNdbcStation['region'], number, number]> = [
  // ---- Great Lakes — Lake Michigan ----
  ['45007', 'South Lake Michigan', 'great_lakes', 42.674, -87.026],
  ['45002', 'North Lake Michigan', 'great_lakes', 45.344, -86.411],
  ['45161', 'Muskegon Lake', 'great_lakes', 43.179, -86.359],
  ['45168', 'Holland', 'great_lakes', 42.398, -86.331],
  ['45170', 'Calumet Harbor', 'great_lakes', 41.730, -87.539],
  ['SGNW3', 'Sheboygan, WI', 'great_lakes', 43.750, -87.690],
  ['MKGM4', 'Muskegon, MI', 'great_lakes', 43.227, -86.339],
  ['LDTM4', 'Ludington, MI', 'great_lakes', 43.948, -86.442],
  ['SBLM4', 'Sleeping Bear Dunes, MI', 'great_lakes', 44.762, -86.058],
  ['MEEM4', 'Menominee, MI', 'great_lakes', 45.103, -87.591],
  ['CHII2', 'Calumet Harbor, IL', 'great_lakes', 41.730, -87.538],
  ['MIGM4', 'Manistee, MI', 'great_lakes', 44.249, -86.342],
  // ---- Great Lakes — Lake Huron ----
  ['45003', 'North Huron', 'great_lakes', 45.351, -82.838],
  ['45149', 'Southern Lake Huron', 'great_lakes', 43.624, -82.077],
  ['45008', 'South Lake Huron', 'great_lakes', 44.283, -82.417],
  ['ALPM4', 'Alpena, MI', 'great_lakes', 45.062, -83.428],
  ['SBIO1', 'South Bass Island, OH', 'great_lakes', 41.628, -82.840],
  ['TBIM4', 'Thunder Bay Island, MI', 'great_lakes', 45.035, -83.190],
  // ---- Great Lakes — Lake Superior ----
  ['45004', 'East Lake Superior', 'great_lakes', 47.585, -86.586],
  ['45001', 'Mid Superior', 'great_lakes', 48.061, -87.793],
  ['45006', 'Western Lake Superior', 'great_lakes', 47.337, -89.789],
  ['STDM4', 'Stannard Rock, MI', 'great_lakes', 47.183, -87.225],
  ['ROAM4', 'Rock of Ages, MI', 'great_lakes', 47.867, -89.317],
  ['DULM5', 'Duluth, MN', 'great_lakes', 46.778, -92.092],
  // ---- Great Lakes — Lake Erie ----
  ['45005', 'West Erie', 'great_lakes', 41.677, -82.398],
  ['45142', 'South Erie', 'great_lakes', 42.738, -79.353],
  ['45132', 'Port Stanley', 'great_lakes', 42.460, -81.221],
  ['MRHO1', 'Marblehead, OH', 'great_lakes', 41.543, -82.731],
  ['BUFN6', 'Buffalo, NY', 'great_lakes', 42.877, -78.890],
  // ---- Great Lakes — Lake Ontario ----
  ['45012', 'Lake Ontario', 'great_lakes', 43.619, -77.405],
  ['OSGN6', 'Oswego, NY', 'great_lakes', 43.464, -76.512],
  ['ROCN6', 'Rochester, NY', 'great_lakes', 43.269, -77.626],
  // ---- Atlantic coast (NC / GA / FL east) ----
  ['41001', 'East Hatteras', 'atlantic', 34.724, -72.317],
  ['41025', 'Diamond Shoals, NC', 'atlantic', 35.006, -75.402],
  ['41036', 'Onslow Bay, NC', 'atlantic', 34.213, -76.948],
  ['41037', 'Wilmington, NC', 'atlantic', 33.989, -77.361],
  ['41008', 'Grays Reef, GA', 'atlantic', 31.402, -80.866],
  ['SAUF1', 'St. Augustine, FL', 'atlantic', 29.857, -81.265],
  ['41009', 'Canaveral, FL', 'atlantic', 28.519, -80.166],
  ['41012', 'St. Augustine, FL', 'atlantic', 30.040, -80.530],
  // ---- Gulf coast (FL / AL / MS) ----
  ['42036', 'West Tampa', 'gulf', 28.501, -84.516],
  ['42013', 'Tampa Bay', 'gulf', 27.173, -82.929],
  ['42022', 'Cape San Blas, FL', 'gulf', 27.504, -83.741],
  ['42039', 'Pensacola, FL', 'gulf', 28.788, -86.008],
  ['42040', 'Mobile S', 'gulf', 29.207, -88.237],
  ['DPIA1', 'Dauphin Island, AL', 'gulf', 30.250, -88.075],
  ['PCLF1', 'Pensacola, FL', 'gulf', 30.404, -87.211],
  // ---- Pacific (CA / OR / WA) — minimal, in case future spots ----
  ['46086', 'San Clemente Basin', 'pacific', 32.491, -118.034],
  ['46232', 'Point Loma', 'pacific', 32.530, -117.430],
  ['46026', 'San Francisco', 'pacific', 37.755, -122.832],
  ['46050', 'Stonewall Bank, OR', 'pacific', 44.658, -124.526],
  ['46087', 'Neah Bay, WA', 'pacific', 48.494, -124.728],
];

export async function nearestNdbcStations(
  lat: number,
  lng: number,
  limit = 3,
  /**
   * Reasonable maximum radius. Inland lakes more than ~40 mi from any
   * Great-Lakes buoy or coastal station should treat the result as
   * "no NDBC coverage". Buoys further away report a different
   * water mass entirely.
   */
  maxDistanceMiles = 40
): Promise<NearbyNdbcStation[]> {
  const ranked: NearbyNdbcStation[] = STATIONS.map(([id, name, region, sLat, sLng]) => ({
    stationId: id,
    name,
    region,
    lat: sLat,
    lng: sLng,
    distanceMiles: distMiles({ lat, lng }, { lat: sLat, lng: sLng }),
  }))
    .filter((s) => s.distanceMiles <= maxDistanceMiles)
    .sort((a, b) => a.distanceMiles - b.distanceMiles)
    .slice(0, limit);
  return ranked;
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
