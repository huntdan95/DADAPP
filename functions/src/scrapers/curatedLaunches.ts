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
];
