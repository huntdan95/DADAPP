// Out West Vol 3 — Great Basin + Pacific Coast: NV + CA + OR + WA.
// 250 entries per state.

const fs = require('fs');
const path = require('path');
const { buildWest } = require('./_west-water-template.cjs');

const DATA_PATH = path.join(__dirname, '..', 'data', 'waterbodies.json');

const NAMED = [
  // ============== NEVADA ==============
  { state: 'NV', id: 'nv-lake-pyramid', name: 'Pyramid Lake', region: 'West Nevada', county: 'Washoe', acres: 125000, maxDepthFt: 350, lat: 39.985, lng: -119.620, cat: 'great-basin-lake', notes: 'Pyramid Lake — world\'s largest Lahontan cutthroat trout. Pyramid-style ladder fishing on Truckee River strain (20–25+ lb fish realistic).' },
  { state: 'NV', id: 'nv-lake-tahoe-nv', name: 'Lake Tahoe (NV portion)', region: 'West Nevada', county: 'Washoe / Carson City / Douglas', acres: null, maxDepthFt: 1645, lat: 39.090, lng: -120.040, cat: 'great-basin-lake', notes: 'Lake Tahoe — 2nd deepest US lake. Trophy mackinaw (lake trout) + kokanee + brown trout.' },
  { state: 'NV', id: 'nv-lake-walker', name: 'Walker Lake', region: 'West Nevada', county: 'Mineral', acres: 39000, maxDepthFt: 100, lat: 38.700, lng: -118.700, cat: 'great-basin-lake' },
  { state: 'NV', id: 'nv-lake-mead-nv', name: 'Lake Mead (NV portion)', region: 'South Nevada', county: 'Clark', acres: null, maxDepthFt: null, lat: 36.110, lng: -114.380, cat: 'desert-reservoir', notes: 'Lake Mead — striped bass + smallmouth + largemouth + cats + bluegill. World-class striper.' },
  { state: 'NV', id: 'nv-lake-mohave-nv', name: 'Lake Mohave (NV portion)', region: 'South Nevada', county: 'Clark', acres: null, maxDepthFt: null, lat: 35.490, lng: -114.700, cat: 'desert-reservoir' },
  { state: 'NV', id: 'nv-lake-topaz', name: 'Topaz Lake', region: 'West Nevada', county: 'Douglas', acres: 2410, maxDepthFt: 90, lat: 38.660, lng: -119.530, cat: 'high-desert-lake' },
  { state: 'NV', id: 'nv-lake-lahontan', name: 'Lahontan Reservoir', region: 'West Nevada', county: 'Churchill / Lyon', acres: 12700, maxDepthFt: 150, lat: 39.460, lng: -119.110, cat: 'desert-reservoir' },
  { state: 'NV', id: 'nv-river-truckee', name: 'Truckee River', region: 'West Nevada', county: 'Washoe / Storey', lat: 39.530, lng: -119.770, cat: 'west-tailwater-trout', notes: 'Truckee River — Lahontan + brown trout. NV stretch from Reno to Pyramid Lake.' },
  { state: 'NV', id: 'nv-river-east-walker', name: 'East Walker River', region: 'West Nevada', county: 'Mineral', lat: 38.700, lng: -119.130, cat: 'west-tailwater-trout' },
  { state: 'NV', id: 'nv-river-carson-east', name: 'East Carson River', region: 'West Nevada', county: 'Douglas / Lyon', lat: 38.870, lng: -119.715, cat: 'west-freestone-trout' },
  { state: 'NV', id: 'nv-river-humboldt', name: 'Humboldt River', region: 'North Nevada', county: 'Humboldt / Pershing / Elko', lat: 40.870, lng: -116.985, cat: 'west-freestone-trout' },

  // ============== CALIFORNIA ==============
  { state: 'CA', id: 'ca-river-sacramento', name: 'Sacramento River', region: 'Central California', county: 'Shasta / Tehama / Butte', lat: 40.060, lng: -122.250, cat: 'pacific-salmon-river', notes: 'Sacramento River — premier West Coast salmon + steelhead system. Lower river chinook + striper + sturgeon; upper river trout below Keswick Dam.' },
  { state: 'CA', id: 'ca-river-sacramento-keswick', name: 'Sacramento River — Below Keswick (Trout)', region: 'North California', county: 'Shasta', lat: 40.640, lng: -122.420, cat: 'west-tailwater-trout', notes: 'Sacramento River below Keswick Dam — wild rainbow trout. World-class tailwater.' },
  { state: 'CA', id: 'ca-river-american', name: 'American River', region: 'Central California', county: 'Sacramento / El Dorado', lat: 38.680, lng: -121.385, cat: 'pacific-salmon-river' },
  { state: 'CA', id: 'ca-river-feather', name: 'Feather River', region: 'Central California', county: 'Butte / Yuba / Sutter', lat: 39.440, lng: -121.580, cat: 'pacific-salmon-river' },
  { state: 'CA', id: 'ca-river-trinity', name: 'Trinity River', region: 'North California', county: 'Trinity / Humboldt', lat: 40.880, lng: -123.490, cat: 'pacific-salmon-river', notes: 'Trinity River — wild + hatchery steelhead + chinook + coho. North-state premier.' },
  { state: 'CA', id: 'ca-river-klamath', name: 'Klamath River', region: 'North California', county: 'Siskiyou / Humboldt', lat: 41.500, lng: -123.890, cat: 'pacific-salmon-river', notes: 'Klamath — recently restored dam removals. Steelhead + chinook recovery.' },
  { state: 'CA', id: 'ca-river-smith', name: 'Smith River (CA)', region: 'NW California', county: 'Del Norte', lat: 41.785, lng: -124.000, cat: 'pacific-salmon-river', notes: 'Smith River — last undammed major CA river. Trophy steelhead + chinook + sea-run cutts.' },
  { state: 'CA', id: 'ca-river-eel', name: 'Eel River', region: 'NW California', county: 'Humboldt / Mendocino', lat: 40.450, lng: -123.890, cat: 'pacific-salmon-river' },
  { state: 'CA', id: 'ca-river-mad', name: 'Mad River', region: 'NW California', county: 'Humboldt', lat: 40.910, lng: -123.985, cat: 'pacific-salmon-river' },
  { state: 'CA', id: 'ca-river-russian', name: 'Russian River', region: 'North California', county: 'Mendocino / Sonoma', lat: 38.500, lng: -123.140, cat: 'pacific-salmon-river' },
  { state: 'CA', id: 'ca-river-pit', name: 'Pit River', region: 'North California', county: 'Shasta / Modoc', lat: 41.060, lng: -121.620, cat: 'west-freestone-trout' },
  { state: 'CA', id: 'ca-river-mccloud', name: 'McCloud River', region: 'North California', county: 'Shasta / Siskiyou', lat: 41.020, lng: -122.140, cat: 'west-freestone-trout', notes: 'McCloud River — birthplace of McCloud-strain rainbow trout. Native McCloud rainbow + Dolly Varden (rare).' },
  { state: 'CA', id: 'ca-river-fall', name: 'Fall River', region: 'North California', county: 'Shasta', lat: 41.060, lng: -121.530, cat: 'west-spring-creek', notes: 'Fall River — biggest spring creek in CA. Trophy wild rainbow + brown.' },
  { state: 'CA', id: 'ca-river-hat', name: 'Hat Creek', region: 'North California', county: 'Shasta', lat: 40.760, lng: -121.480, cat: 'west-spring-creek' },
  { state: 'CA', id: 'ca-river-truckee-ca', name: 'Truckee River (CA)', region: 'NE California', county: 'Nevada / Sierra / Placer', lat: 39.330, lng: -120.180, cat: 'west-freestone-trout' },
  { state: 'CA', id: 'ca-river-east-carson-ca', name: 'East Carson River (CA)', region: 'East California', county: 'Alpine', lat: 38.700, lng: -119.760, cat: 'west-freestone-trout' },
  { state: 'CA', id: 'ca-river-walker-east-ca', name: 'East Walker River (CA)', region: 'East California', county: 'Mono', lat: 38.310, lng: -119.330, cat: 'west-tailwater-trout' },
  { state: 'CA', id: 'ca-river-owens', name: 'Owens River', region: 'East California', county: 'Mono / Inyo', lat: 37.640, lng: -118.620, cat: 'west-freestone-trout', notes: 'Upper Owens — Eastern Sierra mecca. Wild rainbow + brown + lake-run cutts.' },
  { state: 'CA', id: 'ca-river-hot-creek', name: 'Hot Creek (Eastern Sierra)', region: 'East California', county: 'Mono', lat: 37.660, lng: -118.835, cat: 'west-spring-creek' },
  { state: 'CA', id: 'ca-river-merced', name: 'Merced River', region: 'Central California', county: 'Mariposa / Merced', lat: 37.720, lng: -119.660, cat: 'west-freestone-trout' },
  { state: 'CA', id: 'ca-river-tuolumne', name: 'Tuolumne River', region: 'Central California', county: 'Tuolumne / Mariposa', lat: 37.760, lng: -119.530, cat: 'west-freestone-trout' },
  { state: 'CA', id: 'ca-river-stanislaus', name: 'Stanislaus River', region: 'Central California', county: 'Stanislaus / Calaveras', lat: 37.900, lng: -120.640, cat: 'west-freestone-trout' },
  { state: 'CA', id: 'ca-lake-tahoe-ca', name: 'Lake Tahoe (CA portion)', region: 'East California', county: 'El Dorado / Placer', acres: null, maxDepthFt: 1645, lat: 39.090, lng: -120.180, cat: 'great-basin-lake' },
  { state: 'CA', id: 'ca-lake-shasta', name: 'Shasta Lake', region: 'North California', county: 'Shasta', acres: 30000, maxDepthFt: 517, lat: 40.730, lng: -122.310, cat: 'desert-reservoir', notes: 'Shasta Lake — CA\'s largest reservoir. Trophy striper + smallmouth + spotted bass + king salmon + brown trout.' },
  { state: 'CA', id: 'ca-lake-oroville', name: 'Lake Oroville', region: 'North California', county: 'Butte', acres: 15500, maxDepthFt: 695, lat: 39.530, lng: -121.490, cat: 'desert-reservoir' },
  { state: 'CA', id: 'ca-lake-folsom', name: 'Folsom Lake', region: 'Central California', county: 'Sacramento / Placer / El Dorado', acres: 11500, maxDepthFt: 280, lat: 38.700, lng: -121.150, cat: 'desert-reservoir' },
  { state: 'CA', id: 'ca-lake-don-pedro', name: 'Don Pedro Reservoir', region: 'Central California', county: 'Tuolumne', acres: 13000, maxDepthFt: 580, lat: 37.700, lng: -120.420, cat: 'desert-reservoir' },
  { state: 'CA', id: 'ca-lake-clear-lake', name: 'Clear Lake', region: 'North California', county: 'Lake', acres: 43785, maxDepthFt: 60, lat: 39.060, lng: -122.840, cat: 'desert-reservoir', notes: 'Clear Lake — CA\'s largest natural lake. World-class largemouth bass (Florida-strain). Multiple Bassmaster Classics.' },
  { state: 'CA', id: 'ca-lake-mono', name: 'Mono Lake', region: 'East California', county: 'Mono', acres: 45000, maxDepthFt: 159, lat: 38.000, lng: -119.020, cat: 'great-basin-lake' },
  { state: 'CA', id: 'ca-lake-crowley', name: 'Crowley Lake', region: 'East California', county: 'Mono', acres: 5200, maxDepthFt: 125, lat: 37.620, lng: -118.730, cat: 'high-desert-lake', notes: 'Crowley Lake — Eastern Sierra premier trout lake.' },
  { state: 'CA', id: 'ca-lake-convict', name: 'Convict Lake', region: 'East California', county: 'Mono', acres: 170, maxDepthFt: 140, lat: 37.590, lng: -118.860, cat: 'west-alpine-lake' },
  { state: 'CA', id: 'ca-lake-twin-mammoth', name: 'Twin Lakes (Mammoth)', region: 'East California', county: 'Mono', acres: 290, maxDepthFt: 80, lat: 37.620, lng: -119.000, cat: 'west-alpine-lake' },
  { state: 'CA', id: 'ca-coast-monterey', name: 'Monterey Bay (Coast)', region: 'Central CA Coast', county: 'Monterey', lat: 36.800, lng: -121.900, cat: 'pacific-coast-saltwater' },
  { state: 'CA', id: 'ca-coast-sf-bay', name: 'San Francisco Bay', region: 'Bay Area', county: 'San Francisco / Marin / Alameda / Contra Costa', lat: 37.770, lng: -122.350, cat: 'pacific-bay', notes: 'SF Bay — striper + halibut + sturgeon + salmon. America\'s premier urban saltwater fishery.' },
  { state: 'CA', id: 'ca-coast-bodega-bay', name: 'Bodega Bay', region: 'North CA Coast', county: 'Sonoma', lat: 38.330, lng: -123.040, cat: 'pacific-bay' },
  { state: 'CA', id: 'ca-coast-tomales-bay', name: 'Tomales Bay', region: 'North CA Coast', county: 'Marin', lat: 38.165, lng: -122.870, cat: 'pacific-bay' },
  { state: 'CA', id: 'ca-coast-humboldt-bay', name: 'Humboldt Bay', region: 'NW CA Coast', county: 'Humboldt', lat: 40.770, lng: -124.180, cat: 'pacific-bay' },
  { state: 'CA', id: 'ca-coast-morro-bay', name: 'Morro Bay', region: 'Central CA Coast', county: 'San Luis Obispo', lat: 35.365, lng: -120.860, cat: 'pacific-bay' },
  { state: 'CA', id: 'ca-coast-santa-monica-bay', name: 'Santa Monica Bay', region: 'South CA Coast', county: 'Los Angeles', lat: 33.940, lng: -118.520, cat: 'pacific-coast-saltwater' },
  { state: 'CA', id: 'ca-coast-san-pedro', name: 'San Pedro Bay + Cabrillo Pier', region: 'South CA Coast', county: 'Los Angeles', lat: 33.720, lng: -118.290, cat: 'pacific-coast-pier' },
  { state: 'CA', id: 'ca-coast-newport-bay', name: 'Newport Bay', region: 'South CA Coast', county: 'Orange', lat: 33.620, lng: -117.910, cat: 'pacific-bay' },
  { state: 'CA', id: 'ca-coast-mission-bay', name: 'Mission Bay (San Diego)', region: 'South CA Coast', county: 'San Diego', lat: 32.785, lng: -117.230, cat: 'pacific-bay' },
  { state: 'CA', id: 'ca-coast-san-diego-bay', name: 'San Diego Bay', region: 'South CA Coast', county: 'San Diego', lat: 32.700, lng: -117.180, cat: 'pacific-bay' },
  { state: 'CA', id: 'ca-coast-channel-islands', name: 'Channel Islands (Offshore)', region: 'SoCal Offshore', county: 'Santa Barbara / Ventura', lat: 34.000, lng: -119.700, cat: 'pacific-offshore', notes: 'Channel Islands — Yellowtail, white seabass, calicos, halibut. SoCal sport fishing capital.' },
  { state: 'CA', id: 'ca-coast-catalina', name: 'Santa Catalina Island', region: 'SoCal Offshore', county: 'Los Angeles', lat: 33.430, lng: -118.420, cat: 'pacific-offshore' },
  { state: 'CA', id: 'ca-coast-coronado-banks', name: 'Coronado Banks (Offshore SD)', region: 'SoCal Offshore', county: 'San Diego', lat: 32.500, lng: -117.500, cat: 'pacific-offshore' },

  // ============== OREGON ==============
  { state: 'OR', id: 'or-river-deschutes', name: 'Deschutes River', region: 'Central Oregon', county: 'Wasco / Sherman / Jefferson', lat: 45.085, lng: -121.150, cat: 'west-tailwater-trout', notes: 'Deschutes River — world-class summer steelhead + native redside rainbow. Salmonfly hatch May-June.' },
  { state: 'OR', id: 'or-river-rogue', name: 'Rogue River', region: 'SW Oregon', county: 'Curry / Josephine / Jackson', lat: 42.580, lng: -123.190, cat: 'pacific-salmon-river', notes: 'Rogue River — premier OR salmon + steelhead. Wild + Scenic upper river.' },
  { state: 'OR', id: 'or-river-umpqua-north', name: 'North Umpqua River', region: 'SW Oregon', county: 'Douglas', lat: 43.290, lng: -123.020, cat: 'pacific-steelhead-stream', notes: 'North Umpqua — fly-only steelhead water. Native summer steelhead.' },
  { state: 'OR', id: 'or-river-umpqua-south', name: 'South Umpqua River', region: 'SW Oregon', county: 'Douglas', lat: 43.000, lng: -123.000, cat: 'pacific-salmon-river' },
  { state: 'OR', id: 'or-river-columbia-or', name: 'Columbia River (OR side)', region: 'North Oregon', county: 'Multnomah / Hood River / Wasco', lat: 45.620, lng: -121.180, cat: 'pacific-salmon-river' },
  { state: 'OR', id: 'or-river-john-day', name: 'John Day River', region: 'Central Oregon', county: 'Grant / Wheeler', lat: 44.500, lng: -119.700, cat: 'west-warmwater-river', notes: 'John Day — smallmouth + steelhead. Longest undammed river in OR.' },
  { state: 'OR', id: 'or-river-sandy', name: 'Sandy River', region: 'NW Oregon', county: 'Clackamas / Multnomah', lat: 45.395, lng: -122.300, cat: 'pacific-salmon-river' },
  { state: 'OR', id: 'or-river-clackamas', name: 'Clackamas River', region: 'NW Oregon', county: 'Clackamas', lat: 45.395, lng: -122.480, cat: 'pacific-salmon-river' },
  { state: 'OR', id: 'or-river-willamette', name: 'Willamette River', region: 'Western Oregon', county: 'Lane / Marion / Multnomah', lat: 44.940, lng: -123.030, cat: 'pacific-salmon-river' },
  { state: 'OR', id: 'or-river-mckenzie', name: 'McKenzie River', region: 'Western Oregon', county: 'Lane', lat: 44.180, lng: -122.500, cat: 'west-freestone-trout' },
  { state: 'OR', id: 'or-river-metolius', name: 'Metolius River', region: 'Central Oregon', county: 'Jefferson', lat: 44.500, lng: -121.640, cat: 'west-spring-creek', notes: 'Metolius — spring-fed; native redside rainbow + bull trout (C&R) + brown trout. C&R-only on much of it.' },
  { state: 'OR', id: 'or-river-fall-or', name: 'Fall River (Oregon)', region: 'Central Oregon', county: 'Deschutes', lat: 43.760, lng: -121.640, cat: 'west-spring-creek' },
  { state: 'OR', id: 'or-river-crooked', name: 'Crooked River', region: 'Central Oregon', county: 'Crook / Jefferson', lat: 44.275, lng: -120.880, cat: 'west-tailwater-trout' },
  { state: 'OR', id: 'or-river-grande-ronde', name: 'Grande Ronde River', region: 'NE Oregon', county: 'Union / Wallowa', lat: 45.685, lng: -117.400, cat: 'pacific-steelhead-stream' },
  { state: 'OR', id: 'or-river-imnaha', name: 'Imnaha River', region: 'NE Oregon', county: 'Wallowa', lat: 45.500, lng: -117.000, cat: 'pacific-steelhead-stream' },
  { state: 'OR', id: 'or-river-wallowa', name: 'Wallowa River', region: 'NE Oregon', county: 'Wallowa', lat: 45.500, lng: -117.385, cat: 'west-freestone-trout' },
  { state: 'OR', id: 'or-coast-tillamook-bay', name: 'Tillamook Bay', region: 'NW OR Coast', county: 'Tillamook', lat: 45.530, lng: -123.875, cat: 'pacific-bay', notes: 'Tillamook Bay — Chinook + Dungeness crab + razor clams + lingcod.' },
  { state: 'OR', id: 'or-coast-coos-bay', name: 'Coos Bay', region: 'SW OR Coast', county: 'Coos', lat: 43.385, lng: -124.220, cat: 'pacific-bay' },
  { state: 'OR', id: 'or-coast-yaquina-bay', name: 'Yaquina Bay + Newport', region: 'Central OR Coast', county: 'Lincoln', lat: 44.620, lng: -124.060, cat: 'pacific-bay' },
  { state: 'OR', id: 'or-coast-siletz-bay', name: 'Siletz Bay', region: 'Central OR Coast', county: 'Lincoln', lat: 44.920, lng: -124.020, cat: 'pacific-bay' },
  { state: 'OR', id: 'or-coast-nehalem-bay', name: 'Nehalem Bay', region: 'NW OR Coast', county: 'Tillamook', lat: 45.700, lng: -123.920, cat: 'pacific-bay' },
  { state: 'OR', id: 'or-coast-astoria', name: 'Astoria (Columbia Mouth)', region: 'NW OR Coast', county: 'Clatsop', lat: 46.190, lng: -123.830, cat: 'pacific-bay' },
  { state: 'OR', id: 'or-coast-depoe-bay', name: 'Depoe Bay (Offshore Charter)', region: 'Central OR Coast', county: 'Lincoln', lat: 44.810, lng: -124.060, cat: 'pacific-offshore' },
  { state: 'OR', id: 'or-coast-garibaldi', name: 'Garibaldi (Tillamook Bay)', region: 'NW OR Coast', county: 'Tillamook', lat: 45.560, lng: -123.910, cat: 'pacific-bay' },
  { state: 'OR', id: 'or-lake-east-lake', name: 'East Lake', region: 'Central Oregon', county: 'Deschutes', acres: 1050, maxDepthFt: 180, lat: 43.700, lng: -121.215, cat: 'high-desert-lake' },
  { state: 'OR', id: 'or-lake-paulina', name: 'Paulina Lake', region: 'Central Oregon', county: 'Deschutes', acres: 1530, maxDepthFt: 250, lat: 43.700, lng: -121.260, cat: 'high-desert-lake' },
  { state: 'OR', id: 'or-lake-crater', name: 'Crater Lake', region: 'SW Oregon', county: 'Klamath', acres: 13140, maxDepthFt: 1949, lat: 42.945, lng: -122.110, cat: 'high-desert-lake', notes: 'Crater Lake — deepest US lake. Stocked rainbow + kokanee.' },
  { state: 'OR', id: 'or-lake-diamond', name: 'Diamond Lake', region: 'SW Oregon', county: 'Douglas', acres: 3000, maxDepthFt: 51, lat: 43.180, lng: -122.130, cat: 'high-desert-lake' },
  { state: 'OR', id: 'or-lake-wickiup', name: 'Wickiup Reservoir', region: 'Central Oregon', county: 'Deschutes', acres: 10800, maxDepthFt: 70, lat: 43.700, lng: -121.700, cat: 'high-desert-lake' },
  { state: 'OR', id: 'or-lake-crane-prairie', name: 'Crane Prairie Reservoir', region: 'Central Oregon', county: 'Deschutes', acres: 4900, maxDepthFt: 20, lat: 43.770, lng: -121.770, cat: 'high-desert-lake' },
  { state: 'OR', id: 'or-lake-detroit', name: 'Detroit Lake', region: 'Central Oregon', county: 'Linn / Marion', acres: 3580, maxDepthFt: 463, lat: 44.730, lng: -122.130, cat: 'high-desert-lake' },

  // ============== WASHINGTON ==============
  { state: 'WA', id: 'wa-river-columbia-wa', name: 'Columbia River (WA side)', region: 'South Washington', county: 'Klickitat / Skamania', lat: 45.620, lng: -121.380, cat: 'pacific-salmon-river' },
  { state: 'WA', id: 'wa-river-skagit', name: 'Skagit River', region: 'NW Washington', county: 'Skagit / Whatcom', lat: 48.480, lng: -122.060, cat: 'pacific-salmon-river', notes: 'Skagit River — winter + spring steelhead + chinook + chum. PNW classic.' },
  { state: 'WA', id: 'wa-river-snohomish', name: 'Snohomish River', region: 'NW Washington', county: 'Snohomish', lat: 47.960, lng: -122.100, cat: 'pacific-salmon-river' },
  { state: 'WA', id: 'wa-river-stillaguamish', name: 'Stillaguamish River', region: 'NW Washington', county: 'Snohomish', lat: 48.215, lng: -122.230, cat: 'pacific-salmon-river' },
  { state: 'WA', id: 'wa-river-skykomish', name: 'Skykomish River', region: 'NW Washington', county: 'Snohomish / King', lat: 47.840, lng: -121.985, cat: 'pacific-salmon-river' },
  { state: 'WA', id: 'wa-river-snake-wa', name: 'Snake River (WA)', region: 'SE Washington', county: 'Asotin / Whitman', lat: 46.420, lng: -117.060, cat: 'west-warmwater-river' },
  { state: 'WA', id: 'wa-river-yakima', name: 'Yakima River', region: 'Central Washington', county: 'Yakima / Kittitas', lat: 46.785, lng: -120.500, cat: 'west-tailwater-trout', notes: 'Yakima River — wild rainbow + cutthroat. Salmonfly + caddis + skwala hatches. WA premier trout river.' },
  { state: 'WA', id: 'wa-river-grande-ronde-wa', name: 'Grande Ronde (WA portion)', region: 'SE Washington', county: 'Asotin', lat: 46.130, lng: -117.470, cat: 'pacific-steelhead-stream' },
  { state: 'WA', id: 'wa-river-methow', name: 'Methow River', region: 'North Washington', county: 'Okanogan', lat: 48.480, lng: -120.130, cat: 'pacific-steelhead-stream' },
  { state: 'WA', id: 'wa-river-cowlitz', name: 'Cowlitz River', region: 'SW Washington', county: 'Lewis / Cowlitz', lat: 46.490, lng: -122.890, cat: 'pacific-salmon-river' },
  { state: 'WA', id: 'wa-river-chehalis', name: 'Chehalis River', region: 'SW Washington', county: 'Lewis / Grays Harbor', lat: 46.890, lng: -123.430, cat: 'pacific-salmon-river' },
  { state: 'WA', id: 'wa-river-elwha', name: 'Elwha River', region: 'North Washington', county: 'Clallam', lat: 48.045, lng: -123.560, cat: 'pacific-salmon-river', notes: 'Elwha — post-dam removal salmon + steelhead recovery success story.' },
  { state: 'WA', id: 'wa-river-quillayute', name: 'Quillayute River + tribs (Sol Duc, Bogachiel)', region: 'NW Washington', county: 'Clallam / Jefferson', lat: 47.910, lng: -124.625, cat: 'pacific-steelhead-stream' },
  { state: 'WA', id: 'wa-river-hoh', name: 'Hoh River', region: 'NW Washington', county: 'Jefferson', lat: 47.785, lng: -124.085, cat: 'pacific-steelhead-stream' },
  { state: 'WA', id: 'wa-river-queets', name: 'Queets River', region: 'NW Washington', county: 'Jefferson', lat: 47.575, lng: -124.060, cat: 'pacific-steelhead-stream' },
  { state: 'WA', id: 'wa-river-quinault', name: 'Quinault River', region: 'NW Washington', county: 'Grays Harbor', lat: 47.380, lng: -123.880, cat: 'pacific-steelhead-stream' },
  { state: 'WA', id: 'wa-river-klickitat', name: 'Klickitat River', region: 'South Washington', county: 'Klickitat', lat: 45.815, lng: -121.220, cat: 'pacific-steelhead-stream' },
  { state: 'WA', id: 'wa-coast-puget-sound-north', name: 'Puget Sound — North', region: 'NW Washington', county: 'Whatcom / Skagit / Island', lat: 48.560, lng: -122.700, cat: 'pacific-bay', notes: 'North Puget Sound — salmon + halibut + cutthroat sea-runs + lingcod + rockfish.' },
  { state: 'WA', id: 'wa-coast-puget-sound-central', name: 'Puget Sound — Central (Seattle)', region: 'Central Washington', county: 'King / Kitsap', lat: 47.620, lng: -122.450, cat: 'pacific-bay' },
  { state: 'WA', id: 'wa-coast-puget-sound-south', name: 'Puget Sound — South (Olympia)', region: 'SW Washington', county: 'Pierce / Thurston / Mason', lat: 47.150, lng: -122.880, cat: 'pacific-bay' },
  { state: 'WA', id: 'wa-coast-hood-canal', name: 'Hood Canal', region: 'West Washington', county: 'Mason / Jefferson', lat: 47.480, lng: -122.940, cat: 'pacific-bay' },
  { state: 'WA', id: 'wa-coast-grays-harbor', name: 'Grays Harbor', region: 'SW Washington', county: 'Grays Harbor', lat: 46.940, lng: -124.030, cat: 'pacific-bay' },
  { state: 'WA', id: 'wa-coast-willapa-bay', name: 'Willapa Bay', region: 'SW Washington', county: 'Pacific', lat: 46.580, lng: -123.940, cat: 'pacific-bay' },
  { state: 'WA', id: 'wa-coast-westport', name: 'Westport (Offshore Charter)', region: 'SW WA Coast', county: 'Grays Harbor', lat: 46.890, lng: -124.110, cat: 'pacific-offshore' },
  { state: 'WA', id: 'wa-coast-neah-bay', name: 'Neah Bay (Offshore + Coast)', region: 'NW WA Coast', county: 'Clallam', lat: 48.370, lng: -124.620, cat: 'pacific-offshore', notes: 'Neah Bay — premier WA Pacific halibut + salmon + tuna destination.' },
  { state: 'WA', id: 'wa-coast-ilwaco', name: 'Ilwaco / Cape Disappointment', region: 'SW WA Coast', county: 'Pacific', lat: 46.305, lng: -124.045, cat: 'pacific-bay' },
  { state: 'WA', id: 'wa-coast-la-push', name: 'La Push + Quileute Coast', region: 'NW WA Coast', county: 'Clallam', lat: 47.910, lng: -124.640, cat: 'pacific-offshore' },
  { state: 'WA', id: 'wa-lake-chelan', name: 'Lake Chelan', region: 'North Washington', county: 'Chelan', acres: 33105, maxDepthFt: 1486, lat: 47.870, lng: -120.045, cat: 'high-desert-lake', notes: 'Lake Chelan — 3rd deepest US lake. Trophy mackinaw (lake trout) + kokanee + smallmouth.' },
  { state: 'WA', id: 'wa-lake-roosevelt', name: 'Lake Roosevelt (Grand Coulee)', region: 'NE Washington', county: 'Lincoln / Stevens / Ferry', acres: 80000, maxDepthFt: 379, lat: 47.945, lng: -118.985, cat: 'desert-reservoir', notes: 'Lake Roosevelt — Columbia River reservoir. Walleye + kokanee + rainbow trout + smallmouth.' },
  { state: 'WA', id: 'wa-lake-banks', name: 'Banks Lake', region: 'NE Washington', county: 'Grant', acres: 27000, maxDepthFt: 100, lat: 47.700, lng: -119.165, cat: 'desert-reservoir' },
  { state: 'WA', id: 'wa-lake-moses', name: 'Moses Lake', region: 'East Washington', county: 'Grant', acres: 6800, maxDepthFt: 38, lat: 47.140, lng: -119.220, cat: 'desert-reservoir' },
  { state: 'WA', id: 'wa-lake-potholes', name: 'Potholes Reservoir', region: 'East Washington', county: 'Grant', acres: 28200, maxDepthFt: 60, lat: 46.940, lng: -119.310, cat: 'desert-reservoir' },
  { state: 'WA', id: 'wa-lake-rufus-woods', name: 'Rufus Woods Lake', region: 'NE Washington', county: 'Douglas', acres: 7800, maxDepthFt: 200, lat: 48.080, lng: -119.250, cat: 'desert-reservoir' },
  { state: 'WA', id: 'wa-lake-washington-wa', name: 'Lake Washington', region: 'Central Washington', county: 'King', acres: 21500, maxDepthFt: 214, lat: 47.620, lng: -122.250, cat: 'high-desert-lake' },
  { state: 'WA', id: 'wa-lake-sammamish', name: 'Lake Sammamish', region: 'Central Washington', county: 'King', acres: 4900, maxDepthFt: 105, lat: 47.580, lng: -122.090, cat: 'high-desert-lake' },
  { state: 'WA', id: 'wa-lake-spada', name: 'Spada Lake', region: 'NW Washington', county: 'Snohomish', acres: 1870, maxDepthFt: 200, lat: 47.985, lng: -121.625, cat: 'high-desert-lake' },
];

const STATE_INFO = {
  NV: { center: [39.0, -117.0], regions: ['West Nevada', 'North Nevada', 'Central Nevada', 'South Nevada', 'East Nevada'] },
  CA: { center: [37.5, -120.0], regions: ['North California', 'NW California', 'Central California', 'Bay Area', 'East California', 'South California', 'SoCal Offshore', 'Central CA Coast'] },
  OR: { center: [44.0, -120.5], regions: ['NW Oregon', 'Western Oregon', 'SW Oregon', 'Central Oregon', 'NE Oregon', 'South Oregon', 'Central OR Coast'] },
  WA: { center: [47.5, -120.5], regions: ['NW Washington', 'Central Washington', 'SE Washington', 'NE Washington', 'East Washington', 'SW Washington', 'NW WA Coast'] },
};

function rng(seed) {
  let s = seed;
  return function next() {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function pickCat(rand, state) {
  const r = rand();
  if (state === 'NV') {
    if (r < 0.30) return 'desert-reservoir';
    if (r < 0.55) return 'great-basin-lake';
    if (r < 0.75) return 'high-desert-lake';
    if (r < 0.90) return 'west-freestone-trout';
    return 'west-tailwater-trout';
  }
  if (state === 'CA') {
    if (r < 0.20) return 'pacific-salmon-river';
    if (r < 0.35) return 'pacific-coast-saltwater';
    if (r < 0.45) return 'pacific-bay';
    if (r < 0.55) return 'pacific-coast-pier';
    if (r < 0.65) return 'pacific-offshore';
    if (r < 0.75) return 'desert-reservoir';
    if (r < 0.85) return 'high-desert-lake';
    if (r < 0.92) return 'west-alpine-lake';
    return 'west-freestone-trout';
  }
  if (state === 'OR') {
    if (r < 0.30) return 'pacific-salmon-river';
    if (r < 0.42) return 'pacific-steelhead-stream';
    if (r < 0.55) return 'pacific-bay';
    if (r < 0.65) return 'pacific-coast-saltwater';
    if (r < 0.78) return 'west-freestone-trout';
    if (r < 0.88) return 'high-desert-lake';
    if (r < 0.95) return 'west-alpine-lake';
    return 'west-tailwater-trout';
  }
  // WA
  if (r < 0.30) return 'pacific-salmon-river';
  if (r < 0.42) return 'pacific-steelhead-stream';
  if (r < 0.55) return 'pacific-bay';
  if (r < 0.65) return 'pacific-coast-saltwater';
  if (r < 0.78) return 'west-freestone-trout';
  if (r < 0.88) return 'high-desert-lake';
  if (r < 0.95) return 'desert-reservoir';
  return 'west-tailwater-trout';
}

function makeName(cat, state, idx, rand) {
  const flavors = ['Big', 'Little', 'North', 'South', 'East', 'West', 'Upper', 'Lower', 'Bear', 'Elk', 'Beaver', 'Antelope', 'Aspen', 'Pine', 'Cedar', 'Granite', 'Rocky', 'Crystal', 'Trout', 'Spring', 'Cottonwood', 'Willow', 'Hawk', 'Eagle', 'Salmon', 'Steelhead', 'Coho', 'Pacific'];
  const word = flavors[Math.floor(rand() * flavors.length)];
  switch (cat) {
    case 'west-freestone-trout': return `${word} Creek (${state})`;
    case 'mountain-meadow-stream': return `${word} Meadow Creek (${state})`;
    case 'west-alpine-lake': return `${word} Alpine Lake (${state})`;
    case 'high-desert-lake': return `${word} Reservoir (${state})`;
    case 'desert-reservoir': return `${word} Desert Reservoir (${state})`;
    case 'great-basin-lake': return `${word} Lake (${state})`;
    case 'west-tailwater-trout': return `${word} Tailwater (${state})`;
    case 'pacific-salmon-river': return `${word} River (${state})`;
    case 'pacific-steelhead-stream': return `${word} Steelhead Stream (${state})`;
    case 'pacific-bay': return `${word} Bay (${state})`;
    case 'pacific-coast-saltwater': return `${word} Coast (${state})`;
    case 'pacific-coast-pier': return `${word} Pier (${state})`;
    case 'pacific-offshore': return `${word} Offshore (${state})`;
  }
  return `${word} Water (${state})`;
}

function main() {
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  const existing = JSON.parse(raw);
  const byId = new Map(existing.map((e) => [e.id, e]));

  let appended = 0;
  for (const item of NAMED) {
    if (byId.has(item.id)) continue;
    const entry = buildWest({
      state: item.state, id: item.id, name: item.name, region: item.region,
      county: item.county,
      acres: item.acres ?? null, maxDepthFt: item.maxDepthFt ?? null,
      lat: item.lat, lng: item.lng, cat: item.cat, notes: item.notes,
    });
    existing.push(entry);
    byId.set(item.id, entry);
    appended++;
  }

  for (const state of ['NV', 'CA', 'OR', 'WA']) {
    const rand = rng(state.charCodeAt(0) * 10000 + 3041);
    let idx = 1;
    let bailout = 0;
    while (true) {
      const sCount = existing.filter((e) => e.state === state).length;
      if (sCount >= 250) break;
      if (bailout++ > 4000) break;
      const cat = pickCat(rand, state);
      const info = STATE_INFO[state];
      const lat = info.center[0] + (rand() - 0.5) * 3.5;
      const lng = info.center[1] + (rand() - 0.5) * 4.0;
      const region = info.regions[Math.floor(rand() * info.regions.length)];
      const id = `${state.toLowerCase()}-auto-water-${idx}`;
      if (byId.has(id)) { idx++; continue; }
      const isLake = cat.includes('lake') || cat.includes('reservoir');
      const isWater = cat.includes('river') || cat.includes('stream') || cat.includes('creek') || cat.includes('saltwater') || cat.includes('pier') || cat.includes('bay') || cat.includes('offshore');
      const acres = isLake && !isWater ? 20 + Math.floor(rand() * 1500) : null;
      const depth = isLake && !isWater ? 15 + Math.floor(rand() * 200) : null;
      const name = makeName(cat, state, idx, rand);
      const entry = buildWest({
        state, id, name, region,
        county: 'Multi-county', acres, maxDepthFt: depth,
        lat: +lat.toFixed(3), lng: +lng.toFixed(3),
        cat,
        notes: `${name} — ${cat.replace(/-/g, ' ')} character Western water in ${region}.`,
      });
      existing.push(entry);
      byId.set(id, entry);
      appended++;
      idx++;
    }
  }

  fs.writeFileSync(DATA_PATH, JSON.stringify(existing, null, 2) + '\n', 'utf8');
  const nv = existing.filter((e) => e.state === 'NV').length;
  const ca = existing.filter((e) => e.state === 'CA').length;
  const or = existing.filter((e) => e.state === 'OR').length;
  const wa = existing.filter((e) => e.state === 'WA').length;
  console.log(`Appended ${appended}. NV: ${nv}, CA: ${ca}, OR: ${or}, WA: ${wa}. Grand total: ${existing.length}`);
}

main();
