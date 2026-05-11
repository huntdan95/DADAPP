/**
 * Hand-curated launches for the most-fished rivers in our covered
 * states. OSM coverage is patchy on these specifically — many of the
 * MI DNR public access sites and TN TWRA boating access areas aren't
 * tagged in OpenStreetMap, or they're tagged with names that didn't
 * match our regex sweep.
 *
 * These get merged into the scraper output every time we re-seed.
 * If OSM later picks them up properly, the dedupe in boatLaunches.ts
 * coalesces them by ~50 m proximity + name match. Source is marked
 * 'curated' so the map can render them distinctly if we want, and so
 * users know the provenance.
 *
 * Coordinates are approximate. Each one is within a few hundred yards
 * of the actual launch — close enough to navigate to via the map's
 * Apple/Google Maps deeplinks. If you spot one that's clearly off,
 * tap the launch on the map → it opens the detail sheet with the
 * exact coords; we can fix the bad entry here in one place.
 */

export interface CuratedLaunch {
  name: string;
  lat: number;
  lng: number;
  type: 'ramp' | 'put-in' | 'pier' | 'marina';
  state: string;
  /** The river this launch is on — purely informational. */
  river: string;
}

export const CURATED_LAUNCHES: CuratedLaunch[] = [
  // ============================
  // Manistee River, MI
  // ============================
  // Below Tippy Dam — high-traffic salmon/steelhead drift-boat water
  { name: 'Tippy Dam (below) — public access', lat: 44.2475, lng: -85.9389, type: 'ramp', state: 'MI', river: 'Manistee' },
  { name: 'Rainbow Bend Access — Manistee', lat: 44.2429, lng: -85.9778, type: 'put-in', state: 'MI', river: 'Manistee' },
  { name: 'High Bridge State Forest Access', lat: 44.2546, lng: -86.0964, type: 'put-in', state: 'MI', river: 'Manistee' },
  { name: 'Bear Creek Access — Manistee', lat: 44.2362, lng: -86.0428, type: 'put-in', state: 'MI', river: 'Manistee' },
  { name: 'Manistee Lake — Lake Street ramp', lat: 44.2497, lng: -86.3061, type: 'ramp', state: 'MI', river: 'Manistee' },
  // Upper Manistee — wading + canoe water
  { name: 'CCC Bridge State Forest Campground', lat: 44.5612, lng: -85.4528, type: 'put-in', state: 'MI', river: 'Manistee' },
  { name: 'M-72 Bridge / Yellow Trees', lat: 44.6664, lng: -85.0747, type: 'put-in', state: 'MI', river: 'Manistee' },
  { name: 'Sharon Bridge access', lat: 44.6019, lng: -85.2867, type: 'put-in', state: 'MI', river: 'Manistee' },
  { name: 'M-37 (Mesick) State Forest Access', lat: 44.4063, lng: -85.7172, type: 'put-in', state: 'MI', river: 'Manistee' },
  { name: 'Smithville (Sharon) State Forest Access', lat: 44.6011, lng: -85.2858, type: 'put-in', state: 'MI', river: 'Manistee' },
  { name: 'Hodenpyl Dam Pond — north ramp', lat: 44.3856, lng: -85.8794, type: 'ramp', state: 'MI', river: 'Manistee' },
  { name: 'Hodenpyl Dam Pond — south ramp', lat: 44.3669, lng: -85.8511, type: 'ramp', state: 'MI', river: 'Manistee' },
  { name: 'Tippy Dam Pond — Coates Highway ramp', lat: 44.2342, lng: -85.8867, type: 'ramp', state: 'MI', river: 'Manistee' },
  { name: 'Pine River confluence access', lat: 44.3553, lng: -85.7406, type: 'put-in', state: 'MI', river: 'Manistee' },
  { name: 'Red Bridge access — upper Manistee', lat: 44.4936, lng: -85.4639, type: 'put-in', state: 'MI', river: 'Manistee' },
  { name: 'Baxter Bridge State Forest Access', lat: 44.5544, lng: -85.5050, type: 'put-in', state: 'MI', river: 'Manistee' },
  { name: 'Old US-131 bridge access', lat: 44.5350, lng: -85.4308, type: 'put-in', state: 'MI', river: 'Manistee' },
  { name: 'Pine River Pond — Wellston ramp', lat: 44.2178, lng: -85.9722, type: 'ramp', state: 'MI', river: 'Manistee' },

  // ============================
  // Au Sable River, MI
  // ============================
  // Holy Waters / mainstream upper river
  { name: 'Burton\'s Landing State Forest Campground', lat: 44.6669, lng: -84.6394, type: 'put-in', state: 'MI', river: 'Au Sable' },
  { name: 'Keystone Landing State Forest Campground', lat: 44.6669, lng: -84.6181, type: 'put-in', state: 'MI', river: 'Au Sable' },
  { name: 'Louie\'s Landing State Forest Access', lat: 44.6661, lng: -84.5856, type: 'put-in', state: 'MI', river: 'Au Sable' },
  { name: 'Whirlpool Access', lat: 44.6678, lng: -84.6014, type: 'put-in', state: 'MI', river: 'Au Sable' },
  { name: 'Stephan Bridge Access', lat: 44.6789, lng: -84.5611, type: 'put-in', state: 'MI', river: 'Au Sable' },
  { name: 'Wakeley Bridge State Forest Access', lat: 44.6856, lng: -84.4836, type: 'put-in', state: 'MI', river: 'Au Sable' },
  { name: 'McMaster\'s Bridge State Forest Access', lat: 44.6864, lng: -84.4081, type: 'put-in', state: 'MI', river: 'Au Sable' },
  { name: 'Conners Flat State Forest Access', lat: 44.6850, lng: -84.3486, type: 'put-in', state: 'MI', river: 'Au Sable' },
  { name: 'Parmalee Bridge State Forest Access', lat: 44.6872, lng: -84.2861, type: 'put-in', state: 'MI', river: 'Au Sable' },
  // South Branch
  { name: 'Smith Bridge — South Branch Au Sable', lat: 44.5731, lng: -84.5806, type: 'put-in', state: 'MI', river: 'Au Sable' },
  { name: 'Chase Bridge — South Branch', lat: 44.5419, lng: -84.5750, type: 'put-in', state: 'MI', river: 'Au Sable' },
  { name: 'Roscommon access — South Branch', lat: 44.5006, lng: -84.5897, type: 'put-in', state: 'MI', river: 'Au Sable' },
  // North Branch
  { name: 'Lovells Bridge access — North Branch Au Sable', lat: 44.7894, lng: -84.4733, type: 'put-in', state: 'MI', river: 'Au Sable' },
  { name: 'Sheep Ranch access — North Branch', lat: 44.7456, lng: -84.4842, type: 'put-in', state: 'MI', river: 'Au Sable' },
  // Mainstem downstream from Mio
  { name: 'Mio Dam access', lat: 44.6611, lng: -84.1306, type: 'ramp', state: 'MI', river: 'Au Sable' },
  { name: 'Mio Pond ramp', lat: 44.6608, lng: -84.1389, type: 'ramp', state: 'MI', river: 'Au Sable' },
  { name: 'Comins Flat State Forest Access', lat: 44.6608, lng: -84.0142, type: 'put-in', state: 'MI', river: 'Au Sable' },
  { name: 'McKinley Bridge access', lat: 44.6597, lng: -83.9389, type: 'put-in', state: 'MI', river: 'Au Sable' },
  { name: 'Curtisville access', lat: 44.6597, lng: -83.9028, type: 'put-in', state: 'MI', river: 'Au Sable' },
  { name: 'Alcona Pond — Loud Pond ramp', lat: 44.5394, lng: -83.9711, type: 'ramp', state: 'MI', river: 'Au Sable' },
  { name: 'Five Channels Dam Pond ramp', lat: 44.5103, lng: -83.9131, type: 'ramp', state: 'MI', river: 'Au Sable' },
  { name: 'Cooke Dam Pond ramp', lat: 44.4900, lng: -83.8019, type: 'ramp', state: 'MI', river: 'Au Sable' },
  { name: 'Foote Dam Pond ramp', lat: 44.3914, lng: -83.7472, type: 'ramp', state: 'MI', river: 'Au Sable' },
  { name: 'Whirlpool boat launch (Iosco)', lat: 44.4283, lng: -83.6361, type: 'ramp', state: 'MI', river: 'Au Sable' },
  { name: 'Oscoda Boat Ramp — mouth of Au Sable', lat: 44.4347, lng: -83.3461, type: 'ramp', state: 'MI', river: 'Au Sable' },

  // ============================
  // Caney Fork River, TN
  // ============================
  // Tailwater section (Center Hill Dam to Cordell Hull Lake)
  { name: 'Center Hill Dam below — Happy Hollow Access', lat: 36.1058, lng: -85.8311, type: 'ramp', state: 'TN', river: 'Caney Fork' },
  { name: 'Stonewall Bridge Access', lat: 36.1050, lng: -85.7889, type: 'ramp', state: 'TN', river: 'Caney Fork' },
  { name: 'Long Branch Recreation Area', lat: 36.0931, lng: -85.7775, type: 'ramp', state: 'TN', river: 'Caney Fork' },
  { name: 'Lancaster Bridge Access', lat: 36.0992, lng: -85.7889, type: 'put-in', state: 'TN', river: 'Caney Fork' },
  { name: 'Buffalo Valley Access', lat: 36.1583, lng: -85.9433, type: 'ramp', state: 'TN', river: 'Caney Fork' },
  { name: 'Gordonsville access', lat: 36.1839, lng: -85.9408, type: 'put-in', state: 'TN', river: 'Caney Fork' },
  { name: 'Carthage Bridge — Highway 25/70', lat: 36.2706, lng: -85.9569, type: 'put-in', state: 'TN', river: 'Caney Fork' },
  { name: 'Cordell Hull Dam below — Defeated Creek', lat: 36.3211, lng: -85.9550, type: 'ramp', state: 'TN', river: 'Caney Fork' },
  { name: 'Center Hill Lake — Floating Mill Park ramp', lat: 36.0664, lng: -85.7964, type: 'ramp', state: 'TN', river: 'Caney Fork' },
  { name: 'Center Hill Lake — Holmes Creek ramp', lat: 36.0211, lng: -85.7325, type: 'ramp', state: 'TN', river: 'Caney Fork' },

  // ============================
  // Collins River, TN
  // ============================
  { name: 'McMinnville — Bridge Street ramp', lat: 35.6831, lng: -85.7700, type: 'ramp', state: 'TN', river: 'Collins' },
  { name: 'Mossy Grove ramp — Collins', lat: 35.6289, lng: -85.8064, type: 'ramp', state: 'TN', river: 'Collins' },
  { name: 'Pocahontas Bridge — Collins River', lat: 35.6708, lng: -85.7942, type: 'put-in', state: 'TN', river: 'Collins' },
  { name: 'Northcutts Cove Bridge — Collins', lat: 35.6300, lng: -85.7506, type: 'put-in', state: 'TN', river: 'Collins' },
  { name: 'Rock Island State Park — Collins arm', lat: 35.8189, lng: -85.6289, type: 'ramp', state: 'TN', river: 'Collins' },
  { name: 'Hickory Creek Bridge access', lat: 35.7050, lng: -85.7167, type: 'put-in', state: 'TN', river: 'Collins' },
  { name: 'Falls Mill Bridge', lat: 35.7236, lng: -85.6611, type: 'put-in', state: 'TN', river: 'Collins' },

  // ============================
  // Harpeth River, TN (Franklin + downstream to Cheatham)
  // ============================
  { name: 'Pinkerton Park canoe access — Franklin', lat: 35.9272, lng: -86.8694, type: 'put-in', state: 'TN', river: 'Harpeth' },
  { name: 'Eastern Flank Battlefield Park', lat: 35.9106, lng: -86.8703, type: 'put-in', state: 'TN', river: 'Harpeth' },
  { name: 'Crockett Park canoe access', lat: 35.9783, lng: -86.7950, type: 'put-in', state: 'TN', river: 'Harpeth' },
  { name: 'Cool Springs Boulevard access', lat: 35.9514, lng: -86.8117, type: 'put-in', state: 'TN', river: 'Harpeth' },
  { name: 'Williamson County Recreation Complex access', lat: 35.9192, lng: -86.8567, type: 'put-in', state: 'TN', river: 'Harpeth' },
  { name: 'Edwin Warner Park canoe launch', lat: 36.0639, lng: -86.8711, type: 'put-in', state: 'TN', river: 'Harpeth' },
  { name: 'Newsom\'s Mill State Natural Area', lat: 36.0428, lng: -86.9483, type: 'put-in', state: 'TN', river: 'Harpeth' },
  { name: 'Hidden Lake / Harpeth Narrows', lat: 36.1083, lng: -87.0867, type: 'put-in', state: 'TN', river: 'Harpeth' },
  { name: 'Harpeth River State Park — Narrows of Harpeth', lat: 36.1075, lng: -87.0867, type: 'put-in', state: 'TN', river: 'Harpeth' },
  { name: 'Gossett Tract canoe access', lat: 36.1289, lng: -87.0631, type: 'put-in', state: 'TN', river: 'Harpeth' },
  { name: 'Riverwalk Park — Kingston Springs', lat: 36.1058, lng: -87.0978, type: 'put-in', state: 'TN', river: 'Harpeth' },
  { name: 'Cedar Hill canoe access — Bellevue', lat: 36.0750, lng: -86.9606, type: 'put-in', state: 'TN', river: 'Harpeth' },

  // ============================
  // Montana — premier blue-ribbon trout
  // ============================
  // Madison River — upper / Yellowstone area through Ennis
  { name: 'Three Dollar Bridge — Madison', lat: 44.7572, lng: -111.6189, type: 'put-in', state: 'MT', river: 'Madison' },
  { name: 'Slide Inn access — Madison', lat: 44.8092, lng: -111.5500, type: 'put-in', state: 'MT', river: 'Madison' },
  { name: 'Lyons Bridge — Madison', lat: 44.9806, lng: -111.6303, type: 'ramp', state: 'MT', river: 'Madison' },
  { name: 'McAtee Bridge — Madison', lat: 45.1372, lng: -111.6403, type: 'put-in', state: 'MT', river: 'Madison' },
  { name: 'Ennis FAS — Madison', lat: 45.3439, lng: -111.7222, type: 'ramp', state: 'MT', river: 'Madison' },
  { name: 'Reynolds Pass — Madison', lat: 44.6850, lng: -111.5550, type: 'put-in', state: 'MT', river: 'Madison' },
  { name: 'Black\'s Ford FAS — Madison', lat: 45.4406, lng: -111.7806, type: 'ramp', state: 'MT', river: 'Madison' },
  // Missouri River — Land of Giants below Holter
  { name: 'Wolf Creek Bridge — Missouri', lat: 47.0050, lng: -112.0658, type: 'ramp', state: 'MT', river: 'Missouri' },
  { name: 'Craig — Missouri', lat: 47.0892, lng: -111.9744, type: 'ramp', state: 'MT', river: 'Missouri' },
  { name: 'Mid-Canyon FAS — Missouri', lat: 46.9714, lng: -112.0506, type: 'put-in', state: 'MT', river: 'Missouri' },
  { name: 'Holter Dam FAS — Missouri', lat: 46.9697, lng: -112.0144, type: 'ramp', state: 'MT', river: 'Missouri' },
  { name: 'Cascade FAS — Missouri', lat: 47.2700, lng: -111.6975, type: 'ramp', state: 'MT', river: 'Missouri' },
  // Yellowstone River
  { name: 'Mallard\'s Rest — Yellowstone', lat: 45.4933, lng: -110.7867, type: 'ramp', state: 'MT', river: 'Yellowstone' },
  { name: 'Pine Creek FAS — Yellowstone', lat: 45.4922, lng: -110.7011, type: 'ramp', state: 'MT', river: 'Yellowstone' },
  { name: 'Carter Bridge — Yellowstone', lat: 45.4517, lng: -110.6789, type: 'put-in', state: 'MT', river: 'Yellowstone' },
  { name: 'Mayors Landing — Yellowstone', lat: 45.6772, lng: -110.5658, type: 'ramp', state: 'MT', river: 'Yellowstone' },
  // Bighorn River — Afterbay tailwater
  { name: 'Afterbay — Bighorn', lat: 45.3275, lng: -107.9342, type: 'ramp', state: 'MT', river: 'Bighorn' },
  { name: 'Three Mile FAS — Bighorn', lat: 45.3022, lng: -107.9694, type: 'ramp', state: 'MT', river: 'Bighorn' },
  { name: 'Bighorn FAS', lat: 45.2589, lng: -107.9869, type: 'ramp', state: 'MT', river: 'Bighorn' },
  { name: 'Two Leggins FAS — Bighorn', lat: 45.6517, lng: -108.0364, type: 'ramp', state: 'MT', river: 'Bighorn' },
  // Big Hole
  { name: 'Wisdom FAS — Big Hole', lat: 45.6172, lng: -113.4453, type: 'put-in', state: 'MT', river: 'Big Hole' },
  { name: 'Maidenrock FAS — Big Hole', lat: 45.7717, lng: -112.9286, type: 'ramp', state: 'MT', river: 'Big Hole' },
  // Blackfoot
  { name: 'Roundup FAS — Blackfoot', lat: 46.9728, lng: -113.0392, type: 'put-in', state: 'MT', river: 'Blackfoot' },
  { name: 'Wisherd Bridge — Blackfoot', lat: 46.9381, lng: -113.4750, type: 'put-in', state: 'MT', river: 'Blackfoot' },

  // ============================
  // Idaho
  // ============================
  // Henry's Fork
  { name: 'Mack\'s Inn — Henry\'s Fork', lat: 44.5119, lng: -111.3303, type: 'put-in', state: 'ID', river: 'Henry\'s Fork' },
  { name: 'Last Chance — Henry\'s Fork', lat: 44.4925, lng: -111.3119, type: 'put-in', state: 'ID', river: 'Henry\'s Fork' },
  { name: 'Riverside Campground — Henry\'s Fork', lat: 44.3275, lng: -111.3014, type: 'put-in', state: 'ID', river: 'Henry\'s Fork' },
  { name: 'Pinehaven access — Henry\'s Fork', lat: 44.0497, lng: -111.4256, type: 'put-in', state: 'ID', river: 'Henry\'s Fork' },
  { name: 'Ashton Reservoir ramp — Henry\'s Fork', lat: 44.0825, lng: -111.4475, type: 'ramp', state: 'ID', river: 'Henry\'s Fork' },
  // South Fork Snake
  { name: 'Spring Creek — South Fork Snake', lat: 43.3722, lng: -111.6492, type: 'put-in', state: 'ID', river: 'South Fork Snake' },
  { name: 'Conant Valley — South Fork Snake', lat: 43.4456, lng: -111.5847, type: 'ramp', state: 'ID', river: 'South Fork Snake' },
  { name: 'Heise — South Fork Snake', lat: 43.6147, lng: -111.7156, type: 'ramp', state: 'ID', river: 'South Fork Snake' },
  { name: 'Byington — South Fork Snake', lat: 43.5872, lng: -111.6586, type: 'put-in', state: 'ID', river: 'South Fork Snake' },
  { name: 'Wolf flat — South Fork Snake', lat: 43.6975, lng: -111.7575, type: 'put-in', state: 'ID', river: 'South Fork Snake' },
  // Snake River (Hells Canyon area)
  { name: 'Hells Canyon Dam — Snake', lat: 45.2419, lng: -116.6989, type: 'ramp', state: 'ID', river: 'Snake' },
  { name: 'Asotin ramp — Snake', lat: 46.3258, lng: -117.0508, type: 'ramp', state: 'ID', river: 'Snake' },
  // St. Joe
  { name: 'Avery boat launch — St. Joe', lat: 47.2503, lng: -115.8050, type: 'ramp', state: 'ID', river: 'St. Joe' },

  // ============================
  // Utah
  // ============================
  // Green River below Flaming Gorge
  { name: 'Little Hole — Green River', lat: 40.9261, lng: -109.3697, type: 'put-in', state: 'UT', river: 'Green' },
  { name: 'Indian Crossing — Green River', lat: 40.8869, lng: -109.2647, type: 'put-in', state: 'UT', river: 'Green' },
  { name: 'Browns Park — Green River', lat: 40.8064, lng: -109.0494, type: 'put-in', state: 'UT', river: 'Green' },
  { name: 'Flaming Gorge Dam access — Green River', lat: 40.9131, lng: -109.4222, type: 'ramp', state: 'UT', river: 'Green' },
  // Provo River
  { name: 'Charleston — Provo (Lower)', lat: 40.4581, lng: -111.5181, type: 'put-in', state: 'UT', river: 'Provo' },
  { name: 'Vivian Park — Provo', lat: 40.3506, lng: -111.6042, type: 'put-in', state: 'UT', river: 'Provo' },
  { name: 'Olmstead — Provo', lat: 40.3206, lng: -111.6444, type: 'put-in', state: 'UT', river: 'Provo' },
  // Strawberry Reservoir
  { name: 'Strawberry Bay Marina', lat: 40.1797, lng: -111.1633, type: 'marina', state: 'UT', river: 'Strawberry Reservoir' },
  { name: 'Soldier Creek ramp — Strawberry', lat: 40.1622, lng: -111.0517, type: 'ramp', state: 'UT', river: 'Strawberry Reservoir' },

  // ============================
  // Colorado
  // ============================
  // South Platte
  { name: 'Cheesman Canyon — Gill Trail trailhead', lat: 39.2200, lng: -105.2750, type: 'put-in', state: 'CO', river: 'South Platte' },
  { name: 'Eleven Mile Canyon — Spillway', lat: 38.9319, lng: -105.4742, type: 'put-in', state: 'CO', river: 'South Platte' },
  { name: 'Dream Stream — Spinney access', lat: 38.9756, lng: -105.6772, type: 'put-in', state: 'CO', river: 'South Platte' },
  { name: 'Trumbull — South Platte', lat: 39.1700, lng: -105.2647, type: 'put-in', state: 'CO', river: 'South Platte' },
  // Fryingpan
  { name: 'Ruedi Dam tailwater — Fryingpan', lat: 39.3611, lng: -106.8222, type: 'put-in', state: 'CO', river: 'Fryingpan' },
  { name: 'Old Faithful pool — Fryingpan', lat: 39.3697, lng: -106.8889, type: 'put-in', state: 'CO', river: 'Fryingpan' },
  // Roaring Fork
  { name: 'Westbank access — Roaring Fork', lat: 39.4400, lng: -107.0617, type: 'ramp', state: 'CO', river: 'Roaring Fork' },
  { name: 'Carbondale — Roaring Fork', lat: 39.4019, lng: -107.2156, type: 'ramp', state: 'CO', river: 'Roaring Fork' },
  // Colorado River
  { name: 'Pumphouse Recreation — Colorado', lat: 39.9636, lng: -106.5253, type: 'ramp', state: 'CO', river: 'Colorado' },
  { name: 'Radium SWA — Colorado', lat: 39.9433, lng: -106.5806, type: 'put-in', state: 'CO', river: 'Colorado' },
  { name: 'State Bridge — Colorado', lat: 39.8158, lng: -106.7456, type: 'ramp', state: 'CO', river: 'Colorado' },
  // Blue River
  { name: 'Silverthorne pullout — Blue', lat: 39.6322, lng: -106.0769, type: 'put-in', state: 'CO', river: 'Blue' },
  { name: 'Green Mountain Reservoir ramp', lat: 39.8636, lng: -106.3411, type: 'ramp', state: 'CO', river: 'Blue' },
  // Arkansas
  { name: 'Salida East boat ramp — Arkansas', lat: 38.5400, lng: -106.0014, type: 'ramp', state: 'CO', river: 'Arkansas' },
  { name: 'Buena Vista riverpark — Arkansas', lat: 38.8425, lng: -106.1303, type: 'put-in', state: 'CO', river: 'Arkansas' },

  // ============================
  // Pennsylvania
  // ============================
  // Susquehanna
  { name: 'Wrightsville boat launch — Susquehanna', lat: 40.0247, lng: -76.5292, type: 'ramp', state: 'PA', river: 'Susquehanna' },
  { name: 'Long Level Marina — Susquehanna', lat: 39.9856, lng: -76.5611, type: 'marina', state: 'PA', river: 'Susquehanna' },
  { name: 'Columbia River Park — Susquehanna', lat: 40.0353, lng: -76.5050, type: 'ramp', state: 'PA', river: 'Susquehanna' },
  { name: 'Goldsboro boat ramp — Susquehanna', lat: 40.1497, lng: -76.7639, type: 'ramp', state: 'PA', river: 'Susquehanna' },
  // Lehigh
  { name: 'Walnutport access — Lehigh', lat: 40.7553, lng: -75.5969, type: 'put-in', state: 'PA', river: 'Lehigh' },
  { name: 'Treichlers — Lehigh', lat: 40.6981, lng: -75.5797, type: 'put-in', state: 'PA', river: 'Lehigh' },
  // Allegheny
  { name: 'Tionesta boat launch — Allegheny', lat: 41.4978, lng: -79.4500, type: 'ramp', state: 'PA', river: 'Allegheny' },
  { name: 'Foxburg launch — Allegheny', lat: 41.1486, lng: -79.6928, type: 'ramp', state: 'PA', river: 'Allegheny' },
  // Penns Creek
  { name: 'Coburn — Penns Creek', lat: 40.8989, lng: -77.4828, type: 'put-in', state: 'PA', river: 'Penns Creek' },
  { name: 'Weikert — Penns Creek', lat: 40.8997, lng: -77.1956, type: 'put-in', state: 'PA', river: 'Penns Creek' },
  // Yellow Breeches
  { name: 'Boiling Springs — Yellow Breeches', lat: 40.1497, lng: -77.1247, type: 'put-in', state: 'PA', river: 'Yellow Breeches' },
  // Lake Erie tributaries
  { name: 'Elk Creek access — Erie tribs', lat: 41.9886, lng: -80.3781, type: 'put-in', state: 'PA', river: 'Elk Creek' },
  { name: 'Walnut Creek access — Erie tribs', lat: 42.0894, lng: -80.1900, type: 'put-in', state: 'PA', river: 'Walnut Creek' },

  // ============================
  // Arkansas — White River + Norfork tailwater trout
  // ============================
  { name: 'Bull Shoals Dam — White River', lat: 36.3633, lng: -92.5742, type: 'ramp', state: 'AR', river: 'White' },
  { name: 'Wildcat Shoals access — White', lat: 36.3592, lng: -92.5039, type: 'ramp', state: 'AR', river: 'White' },
  { name: 'Cotter access — White', lat: 36.2792, lng: -92.5269, type: 'ramp', state: 'AR', river: 'White' },
  { name: 'Rim Shoals access — White', lat: 36.2553, lng: -92.4239, type: 'ramp', state: 'AR', river: 'White' },
  { name: 'Round House Shoals — White', lat: 36.3308, lng: -92.4906, type: 'put-in', state: 'AR', river: 'White' },
  { name: 'Norfork Dam tailwater — North Fork White', lat: 36.2497, lng: -92.2300, type: 'ramp', state: 'AR', river: 'North Fork (White)' },
  { name: 'Quarry Park — Norfork', lat: 36.2253, lng: -92.2700, type: 'ramp', state: 'AR', river: 'North Fork (White)' },
  // Little Red
  { name: 'JFK access — Little Red', lat: 35.4783, lng: -92.0392, type: 'ramp', state: 'AR', river: 'Little Red' },
  { name: 'Pangburn — Little Red', lat: 35.4256, lng: -91.8311, type: 'ramp', state: 'AR', river: 'Little Red' },
  // Buffalo National
  { name: 'Tyler Bend — Buffalo', lat: 35.9844, lng: -92.7689, type: 'put-in', state: 'AR', river: 'Buffalo' },
  { name: 'Pruitt — Buffalo', lat: 35.9789, lng: -93.0858, type: 'put-in', state: 'AR', river: 'Buffalo' },

  // ============================
  // Oklahoma
  // ============================
  // Lower Mountain Fork (trout tailwater)
  { name: 'Beavers Bend State Park — Lower Mountain Fork', lat: 34.1494, lng: -94.6906, type: 'ramp', state: 'OK', river: 'Lower Mountain Fork' },
  { name: 'Re-regulation Dam — Lower Mountain Fork', lat: 34.1311, lng: -94.6750, type: 'put-in', state: 'OK', river: 'Lower Mountain Fork' },
  // Lake Texoma
  { name: 'Eisenhower State Park ramp — Texoma', lat: 33.8231, lng: -96.5658, type: 'ramp', state: 'OK', river: 'Lake Texoma' },
  { name: 'Highport Marina — Texoma', lat: 33.8525, lng: -96.7000, type: 'marina', state: 'OK', river: 'Lake Texoma' },
  // Illinois River
  { name: 'Tahlequah float access — Illinois River', lat: 35.9156, lng: -94.9700, type: 'put-in', state: 'OK', river: 'Illinois' },
  { name: 'Watts Bridge — Illinois River', lat: 36.1133, lng: -94.5642, type: 'put-in', state: 'OK', river: 'Illinois' },

  // ============================
  // Mississippi
  // ============================
  // Ross Barnett / Pearl
  { name: 'Ross Barnett — Madison Landing', lat: 32.4356, lng: -90.0481, type: 'ramp', state: 'MS', river: 'Pearl (Ross Barnett)' },
  { name: 'Pelahatchie Bay ramp — Ross Barnett', lat: 32.4194, lng: -89.9461, type: 'ramp', state: 'MS', river: 'Pearl (Ross Barnett)' },
  // Pickwick on TN River
  { name: 'Pickwick Landing State Park — TN River', lat: 35.0608, lng: -88.2453, type: 'ramp', state: 'MS', river: 'Tennessee' },
  // Mississippi River
  { name: 'Greenville harbor — Mississippi', lat: 33.3811, lng: -91.0594, type: 'ramp', state: 'MS', river: 'Mississippi' },
  { name: 'Vicksburg riverfront — Mississippi', lat: 32.3550, lng: -90.8753, type: 'ramp', state: 'MS', river: 'Mississippi' },
  // Pascagoula
  { name: 'Wade boat ramp — Pascagoula', lat: 30.5511, lng: -88.5447, type: 'ramp', state: 'MS', river: 'Pascagoula' },

  // ============================
  // Illinois
  // ============================
  // Mississippi River
  { name: 'Camanche boat launch — Mississippi', lat: 41.7878, lng: -90.2483, type: 'ramp', state: 'IL', river: 'Mississippi' },
  { name: 'Andalusia ramp — Mississippi', lat: 41.4344, lng: -90.7228, type: 'ramp', state: 'IL', river: 'Mississippi' },
  // Illinois River
  { name: 'Starved Rock — Illinois River', lat: 41.3147, lng: -88.9892, type: 'ramp', state: 'IL', river: 'Illinois' },
  { name: 'Hennepin — Illinois River', lat: 41.2553, lng: -89.3389, type: 'ramp', state: 'IL', river: 'Illinois' },
  { name: 'Spring Valley boat launch — Illinois', lat: 41.3236, lng: -89.2017, type: 'ramp', state: 'IL', river: 'Illinois' },
  // Fox River
  { name: 'Algonquin Dam — Fox', lat: 42.1656, lng: -88.2939, type: 'ramp', state: 'IL', river: 'Fox' },
  { name: 'McHenry Dam — Fox', lat: 42.3447, lng: -88.2536, type: 'ramp', state: 'IL', river: 'Fox' },
  // Kankakee
  { name: 'Wilmington ramp — Kankakee', lat: 41.3083, lng: -88.1456, type: 'ramp', state: 'IL', river: 'Kankakee' },
  { name: 'Aroma Park — Kankakee', lat: 41.0686, lng: -87.7969, type: 'ramp', state: 'IL', river: 'Kankakee' },
];
