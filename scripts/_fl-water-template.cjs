// Florida waterbody template engine.
// FL has the most diverse fishing identity in the country — covers everything
// from Toho lily-pad bass to Keys bonefish flats. Categories below encode the
// distinctive character of each FL fishing context.
//
//  - fl-bass-lake: Toho, Okeechobee, Kissimmee chain, Wales chain. Lily-pad
//      Florida-strain trophy largemouth + native bream + crappie.
//  - fl-harris-chain-lake: Harris, Eustis, Dora, Griffin, Yale - connected
//      Central FL bass + crappie + bream chain.
//  - fl-stick-marsh-lake: Stick Marsh / Farm 13 / Garcia — trophy bass C&R water.
//  - fl-natural-warm-lake: Smaller FL natural lakes, panfish + bass.
//  - fl-river-tidal-spring: Crystal River, Homosassa, Chassahowitzka, Weeki
//      Wachee — 72° spring water; UPPER is freshwater (manatee/bream/bass),
//      LOWER is brackish (snook, redfish, sheepshead, tarpon).
//  - fl-river-blackwater: Suwannee, Wakulla, St. Marys, Yellow, Choctawhatchee,
//      Apalachicola — tannic, cypress-lined, river-bass + bream + cats + sturgeon.
//  - fl-river-bass: St. Johns, Ocklawaha, Hillsborough, Withlacoochee, Peace,
//      Caloosahatchee — central FL bass rivers, also tidal in lower reaches.
//  - fl-river-panhandle: Escambia, Yellow, Blackwater, Shoal, Choctawhatchee
//      upper — northern FL bream/bass/cats with occasional striped bass.
//  - fl-coastal-flat: Inshore wadeable/poleable flats — snook, redfish, trout,
//      flounder; sight-fishing skiff water.
//  - fl-coastal-pier-jetty: Ocean pier or rock jetty — Spanish, kings, drum,
//      pompano, sheepshead, surf-cast.
//  - fl-coastal-bay: Major bays (Tampa, Charlotte Harbor, Indian River Lagoon,
//      Sarasota, Pensacola, Apalachicola) — inshore species mix.
//  - fl-coastal-pass: Inlets and passes — bait-stacking points, tarpon migration
//      stops, snook spawn, mullet run.
//  - fl-keys-flat: Bonefish + permit + tarpon flats — sight-cast saltwater fly.
//  - fl-keys-reef: Patch reefs + reefs — snapper, grouper, hogfish, mutton.
//  - fl-keys-offshore: Bluewater — sailfish, dolphin, tuna, marlin.
//  - fl-everglades: Flamingo + Chokoloskee + Ten Thousand Islands — backcountry
//      snook + redfish + tarpon + snapper + redfish.
//  - fl-mosquito-lagoon: Specific category — gin-clear, world-class trout/redfish.
//  - fl-spring-headwater: Wakulla, Silver, Rainbow, Ichetucknee — pure freshwater
//      spring sources before any saltwater influence.
//  - fl-coastal-town: Generic coastal town/marina — surf + inshore + nearshore
//      mix; FL has thousands.

function makePatterns(cat, name) {
  switch (cat) {
    case 'fl-bass-lake':
      return [
        { title: 'Florida-Strain Trophy Largemouth — Lily Pads', target: 'Largemouth Bass', when: 'February – April spawn; November – December cold front', technique: 'Wild-shiner trophy fishing (Lawson-style: free-line a live golden shiner under a slip-cork over pads). Frogs (SPRO Bronzeye) ripped across hyacinth and pad fields. Flipping/punching heavy cover with 1.5–2 oz tungsten and creature baits.', where: 'Hyacinth mats, lily pad fields, Kissimmee grass, hydrilla edges, Reed clumps.', details: `${name} is FL bass country — Florida-strain largemouth grow to 13+ lb here. Pad and grass cover dictates technique; wild-shiner fishing for trophies is a Central FL tradition.` },
        { title: 'Bedding Bass — Sight Fishing', target: 'Largemouth Bass', when: 'February – April, when water hits 65°F+', technique: 'White or light-colored creature baits (Senko, Beaver, Speed Craw) on a Texas rig, cast past the bed and worked through it. Polarized lenses essential.', where: 'Shallow protected pockets out of the wind — north-side banks warm first.', details: 'FL bedding is concentrated: pre-cold-front + post-cold-front bedding cycles align with full moons. Big mama females come up for short windows.' },
        { title: 'Topwater Frog Game', target: 'Largemouth Bass', when: 'Year-round; peak summer dawn/dusk', technique: 'Hollow-body frogs (SPRO Bronzeye Jr., Booyah Pad Crasher) over pads + hyacinth. Heavy braid (65–80 lb) + no leader. Pause at every opening.', where: 'Pad fields, hyacinth mats, grass mats.', details: 'Surface frog explosions are the iconic FL bass moment.' },
        { title: 'Crappie ("Specks") Spawn', target: 'Crappie', when: 'December – March; peak January – February', technique: 'Long-pole jigging (BnM 12\' pole) with 1/16-oz tube jigs in red/chartreuse, blue/white, pink/white. Slip-cork minnows.', where: 'Cypress knees, brush piles, eelgrass edges in 4–10 ft.', details: 'FL crappie spawn is THE crappie tournament season — fish stack in massive schools. Lake Okeechobee, Toho, Kissimmee chain are factories.' },
        { title: 'Bream Spawn (Bluegill + Shellcracker)', target: 'Bluegill and Shellcracker (Redear)', when: 'April – August full moons; peak May full moon', technique: 'Live crickets and worms over visible beds. Small popping bugs on fly rod (4–6 wt). Beetle Spins.', where: 'Shallow sand pockets, eelgrass clearings.', details: 'FL panfish on the full moon — buckets of slabs in a few hours. Shellcracker (redear) are the bigger prize.' },
        { title: 'Hex Mayfly Hatch — Big-Water Bass', target: 'Largemouth Bass and Bream', when: 'May – June evenings', technique: 'Fly: #4–6 Hex dun. Spin: large topwater poppers (Pop-R, Hula Popper).', where: 'Open water near pad fields, big-lake areas with silt bottoms.', details: 'Hexagenia limbata hatches DO happen on big FL lakes (Okeechobee, Kissimmee, Toho) — bass and bream surface-feed on the dusk emergence. Under-fished pattern.' },
      ];
    case 'fl-harris-chain-lake':
      return [
        { title: 'Harris Chain Largemouth — Hydrilla Edges', target: 'Largemouth Bass', when: 'Year-round; peak spring spawn + fall bait migration', technique: 'Lipless cranks (Red Eye Shad), ChatterBaits with white trailer, big swimbaits on grass edges. Punching mats with heavy tungsten.', where: 'Hydrilla edges, eelgrass flats, canal mouths between chain lakes.', details: `${name} is part of the Harris Chain — connected Central FL lakes (Harris, Eustis, Dora, Griffin, Beauclair, Yale). Hydrilla management determines the year; trophy potential strong.` },
        { title: 'Crappie Spawn Run', target: 'Crappie', when: 'January – March', technique: 'Jigs + minnows around cypress and brush. Pole-and-line in shallow.', where: 'Shoreline cypress, mid-lake brush piles.', details: 'Harris Chain crappie runs are quieter than Kissimmee chain but consistent.' },
        { title: 'Bream + Shellcracker', target: 'Bluegill and Shellcracker', when: 'April – August full moons', technique: 'Crickets + worms on light gear. Popping bugs.', where: 'Sandy shoreline pockets.', details: 'Harris Chain bream beds — easy family fishing.' },
        { title: 'Crappie Trolling — Open Water Summer', target: 'Crappie', when: 'June – September', technique: 'Spider rigging with multiple poles, jigs at varied depths.', where: 'Open-water humps and creek channels.', details: 'Summer specs hold deep on the chain — trolling finds them.' },
      ];
    case 'fl-stick-marsh-lake':
      return [
        { title: 'Trophy Bass — C&R Tournament Water', target: 'Largemouth Bass', when: 'February – April spawn; November – December cold fronts', technique: 'Wild-shiner trophy fishing. Big swimbaits (8" Hudd, Triple Trout). ChatterBaits for numbers.', where: 'Standing timber, hydrilla edges, channel mouths.', details: `${name} is a Florida trophy-bass C&R lake — Stick Marsh, Farm 13, Lake Garcia, Headwaters Lake all share this character. Florida-strain stockings + flooded timber + C&R-only regs = 10+ lb fish realistic.` },
        { title: 'Crappie + Bream', target: 'Crappie and Bream', when: 'January – May', technique: 'Standard FL panfish methods — minnows + jigs for crappie, crickets for bream.', where: 'Brush + cypress + standing timber.', details: 'Side benefit of the timber — quality crappie and bream.' },
      ];
    case 'fl-natural-warm-lake':
      return [
        { title: 'Largemouth Bass + Bream Combo', target: 'Largemouth Bass and Bream', when: 'Year-round', technique: 'Topwater frogs and Senkos over pads for bass; crickets/worms for bream.', where: 'Pad fields, weed edges, cypress.', details: `${name} is a Florida natural warmwater lake — pads + cypress + bream + bass standard. FWC stocks bream + cats in some.` },
        { title: 'Crappie Spawn', target: 'Crappie', when: 'January – March', technique: 'Jigs around cypress; minnows under cork in shallow.', where: 'Cypress shoreline, brush.', details: 'Smaller FL lakes still produce slab crappie spawns.' },
      ];
    case 'fl-river-tidal-spring':
      return [
        { title: 'Brackish-Zone Snook + Redfish (LOWER River)', target: 'Snook and Redfish', when: 'May – October peak (snook spawn); year-round redfish', technique: 'Live shrimp or pinfish under popping cork. DOA shrimp or paddletail (3–4") on 1/4-oz jighead. Twitchbaits (MirrOLure, X-Rap). Topwater (Heddon Spook Jr.) at dawn.', where: 'Lower river: mouth + first few miles upstream of mouth; oyster bars, mangrove edges, drop-offs.', details: `${name} has a distinct fresh/brackish gradient — UPPER river is spring-fed freshwater (manatee, bream, bass); LOWER river (last 2–4 miles before the Gulf) is brackish/salt-influenced where snook, redfish, trout, sheepshead, and tarpon stack. Salinity rises through the day and varies with tide.` },
        { title: 'Tarpon Roll — Lower Brackish Zone', target: 'Tarpon', when: 'May – September', technique: 'Live mullet or pinfish on circle hooks. Big swimbaits or DOA Bait Buster. Fly: tarpon toad in black/purple.', where: 'Mouth + deep holes in the lower river. Rolling fish in slick conditions.', details: 'Brackish lower spring rivers hold rolling tarpon all summer — Crystal, Homosassa, and Chassahowitzka especially.' },
        { title: 'Sheepshead — Winter Brackish', target: 'Sheepshead', when: 'December – March', technique: 'Live fiddler crabs, shrimp pieces, small jigs tipped with shrimp. Tight to barnacle/oyster cover.', where: 'Dock pilings, oyster bars, jetty rocks in the lower river.', details: 'Winter sheepshead concentrations on the lower brackish stretches — convict fishery.' },
        { title: 'Manatee Encounters + Cold-Water Refuge', target: 'Manatee (Watch + Photograph)', when: 'November – March cold months', technique: 'NO fishing for or around resting manatees. Distance + slow boating regulations strictly enforced.', where: 'Spring boil + upper warm-water zone.', details: 'The 72°F spring water draws manatee herds in winter — Three Sisters Springs at Crystal River is iconic. Wildlife refuge zones — respect.' },
        { title: 'Upper-River Freshwater Fishery', target: 'Largemouth Bass, Bluegill, Sunshine Bass', when: 'Year-round', technique: 'Topwater (Pop-R), Senkos, jigs around eelgrass + spring runs for bass. Live shrimp and crickets for bream and small jacks.', where: 'Upper river above the brackish zone — clear spring water + eelgrass.', details: 'The upper freshwater section holds resident largemouth, bream, and stocked sunshine bass. Different fishery from the brackish lower river.' },
        { title: 'Mullet Run Through the System', target: 'All Predators (Snook, Redfish, Tarpon, Trout)', when: 'September – October peak', technique: 'Match the bait — live or dead mullet chunks, mullet-pattern lures and flies (Whitewater Hellhound), big swimbaits.', where: 'Lower river mouth and bay-side entrance.', details: 'Fall mullet run pushes through every FL coastal river — every predator follows. The classic FL inshore feast.' },
      ];
    case 'fl-river-blackwater':
      return [
        { title: 'Blackwater River Bass — Cypress Cover', target: 'Largemouth Bass', when: 'Year-round; peak spring + fall', technique: 'Topwater poppers and frogs at dawn; soft plastics (Senkos, weightless flukes) around cypress knees + lily pads; spinnerbaits in stained water.', where: 'Cypress shorelines, eddies behind log jams, lily pad fields.', details: `${name} is a tannin-stained blackwater FL river — Suwannee, Wakulla, St. Marys, Yellow, Choctawhatchee, Apalachicola, Withlacoochee, Blackwater all share this character. Bass + bream + cats + occasional sturgeon.` },
        { title: 'Bream + Stumpknockers', target: 'Bluegill, Redbreast, Spotted Sunfish (Stumpknocker)', when: 'May – August', technique: 'Crickets, worms, small popping bugs. Light spinning gear or fly rod.', where: 'Cypress knees, eddies, log jam pockets.', details: 'Excellent native sunfish — redbreast and stumpknockers (spotted sunfish) are unique to FL panhandle and north FL blackwater rivers.' },
        { title: 'Catfish — Channel + Flathead', target: 'Channel Catfish and Flathead Catfish', when: 'Year-round; peak summer', technique: 'Cut bait, chicken liver, stink bait for channel cats. Live bream for flatheads.', where: 'Deep holes, log jams.', details: 'Suwannee and Apalachicola produce trophy flatheads to 50+ lb.' },
        { title: 'Sturgeon (Gulf Sturgeon — Protected)', target: 'Gulf Sturgeon (NO TAKE — Federal Protection)', when: 'April – October migration', technique: 'No fishing for sturgeon — federally protected. Photo + release only on incidental catch.', where: 'Suwannee, Apalachicola, Choctawhatchee.', details: 'Gulf sturgeon migrate up these rivers to spawn — federally protected. Famous Suwannee River jumping sturgeon (boat strikes a concern). Watch, don\'t target.' },
      ];
    case 'fl-river-bass':
      return [
        { title: 'River Largemouth — Backwater Cypress', target: 'Largemouth Bass', when: 'Year-round; peak spring + fall', technique: 'Topwater frogs over pads, Senkos around cypress, ChatterBaits in current breaks.', where: 'Cypress knees, lily pads, oxbow lakes off the main river.', details: `${name} is a central FL bass river — St. Johns, Ocklawaha, Hillsborough, Withlacoochee, Peace, Caloosahatchee all share this character. Wide tidal influence in lower reaches.` },
        { title: 'Tidal Sections — Brackish Snook + Redfish', target: 'Snook and Redfish', when: 'Lower tidal reaches: year-round; peak May – October', technique: 'Live shrimp under popping cork; soft plastics on jighead; twitchbaits.', where: 'Oyster bars + mangrove edges + dock lights in the tidal zone of the lower river.', details: 'FL bass rivers run all the way to salt — the lower 5–15 miles before the mouth become snook + redfish water. Many anglers fish both rails of the same river.' },
        { title: 'Bream Beds (Spring + Summer)', target: 'Bluegill, Shellcracker, Spotted Sunfish', when: 'April – August full moons', technique: 'Crickets, worms, beetle spins.', where: 'Sandy shoreline pockets.', details: 'FL river bream are prolific.' },
        { title: 'Hilly Crappie Pockets', target: 'Crappie', when: 'January – March', technique: 'Jigs and minnows around cypress + brush.', where: 'Oxbow lakes, slow-current pockets.', details: 'Crappie hold in slack-water pockets off the main river.' },
      ];
    case 'fl-river-panhandle':
      return [
        { title: 'Panhandle River Bream + Bass', target: 'Largemouth Bass + Bream', when: 'May – October peak', technique: 'Topwater + soft plastics for bass; crickets/worms for bream.', where: 'Cypress + sandbar pockets.', details: `${name} is a Florida panhandle river — Escambia, Yellow, Blackwater, Shoal, Choctawhatchee, Apalachicola upper. Bream + bass + cats + occasional striped bass (Apalachicola).` },
        { title: 'Striped Bass (Apalachicola System)', target: 'Striped Bass', when: 'Spring run March – May', technique: 'Big topwater (Spook, Whopper Plopper), live shad, big swimbaits.', where: 'Below Jim Woodruff Dam, Apalachicola River tailwater, river bends with current breaks.', details: 'Apalachicola River system is FL\'s only striped bass run — Gulf-race wild stripers. Catch-and-release strongly encouraged.' },
        { title: 'Catfish + Flathead', target: 'Channel Catfish and Flathead Catfish', when: 'Year-round', technique: 'Cut bait + live bream for flatheads.', where: 'Log jams, deep holes.', details: 'Apalachicola and Yellow rivers especially produce trophy flatheads.' },
      ];
    case 'fl-coastal-flat':
      return [
        { title: 'Sight-Cast Redfish — Tailing on the Flats', target: 'Redfish', when: 'Year-round; peak fall + new/full moon high tides', technique: 'Fly: gold + brown weedless spoonfly, EP Crab, redfish toad. Spin: weedless gold spoon, soft-plastic shrimp on weighted weedless hook. Quiet poling approach.', where: 'Grass flats in 1–3 ft, oyster bars, mangrove edges, tide-flooded marsh during high water.', details: `${name} is a coastal FL flat — sight-fishing skiff water for tailing redfish. Stealth and accuracy beat lure choice.` },
        { title: 'Snook on the Mangrove Edge', target: 'Snook', when: 'May – October peak; closed winter season', technique: 'DOA shrimp under popping cork, twitchbaits (MirrOLure 17MR), live finger mullet, topwater at dawn. Fly: deceiver, EP minnow.', where: 'Mangrove shorelines, oyster bars, points with current.', details: 'FL\'s premier inshore gamefish — sight-cast + accuracy game. Catch + release closed winter (Dec 15 – Jan 31 typically — verify FWC).' },
        { title: 'Speckled Trout — Grass Bed Drift', target: 'Speckled Trout', when: 'Year-round; peak fall + spring', technique: 'Soft plastics under popping cork (DOA Cal series, Z-Man Trout Trick). Topwater (Spook Jr.) at dawn. Live shrimp/pinfish.', where: 'Grass flats in 3–6 ft, sand potholes, drop-offs near grass.', details: 'Speckled trout are the FL inshore staple — eat well + abundant.' },
        { title: 'Flounder Drift', target: 'Flounder', when: 'October – November peak; year-round inshore', technique: 'Live mud minnows on Carolina rig; jigs (Gulp shrimp on jighead). Slow drag along sand.', where: 'Sand cuts, channel edges, inlet drop-offs.', details: 'FL flounder regs tightening — check FWC before fishing.' },
        { title: 'Black Drum + Sheepshead', target: 'Black Drum and Sheepshead', when: 'Year-round; sheepshead winter', technique: 'Live shrimp on light Carolina rig; fiddler crabs for sheepshead.', where: 'Oyster bars, pilings, jetty rocks, channel edges.', details: 'Often caught while targeting reds.' },
      ];
    case 'fl-coastal-pier-jetty':
      return [
        { title: 'Spanish Mackerel + Bluefish — Cast & Crank', target: 'Spanish Mackerel and Bluefish', when: 'April – October peak', technique: 'Gotcha plugs, small Spanish spoons, in-line spinners. Cast and crank fast.', where: 'Off ocean piers + jetty tips.', details: `${name} is an FL ocean pier or rock jetty — Spanish, blues, kings, pompano, sheepshead, drum, surf-cast variety. Classic Florida pier fishing.` },
        { title: 'King Mackerel — Live Bait Drift', target: 'King Mackerel', when: 'Spring + fall migrations', technique: 'Live bluefish, ribbonfish, or large pinfish on a stinger king rig. Long pier ends drift live bait.', where: 'End of long ocean piers + far jetty rocks.', details: 'Pier kings are a Carolina/FL specialty — patient long-rod waiting game.' },
        { title: 'Pompano — Surf Cast', target: 'Pompano', when: 'Spring (March – May) and Fall (September – November)', technique: 'Sand fleas (mole crabs) or shrimp on a Pompano rig (two-hook surf rig) cast into the second bar.', where: 'Surf line + first sandbar off ocean beach.', details: 'Pompano are FL surf-fishing gold — high-value eating fish.' },
        { title: 'Sheepshead + Black Drum — Winter Piers', target: 'Sheepshead and Black Drum', when: 'December – March', technique: 'Fiddler crabs, shrimp pieces, small jigs tipped with shrimp.', where: 'Tight to barnacle-covered pilings + jetty rocks.', details: 'Winter pier specialty — sensitive bite, sharp teeth.' },
        { title: 'Tarpon (Where Applicable — Boca Grande, Sebastian Inlet)', target: 'Tarpon', when: 'May – August', technique: 'Live crabs, threadfins, big swimbaits.', where: 'Boca Grande Pass, Sebastian Inlet, certain jetties.', details: 'A few FL piers/passes are tarpon migration choke points.' },
      ];
    case 'fl-coastal-bay':
      return [
        { title: 'Inshore Slam — Trout/Redfish/Snook', target: 'Speckled Trout, Redfish, Snook', when: 'Year-round; peak fall', technique: 'Soft plastics under popping cork, topwater early, live shrimp/pinfish anytime. Sight-cast redfish in the shallows.', where: 'Grass flats, oyster bars, mangrove edges, dock lights, residential canals.', details: `${name} is a major FL coastal bay — Tampa, Charlotte Harbor, Indian River Lagoon, Sarasota, Pensacola, Apalachicola, St. Joseph all share this multi-species inshore character.` },
        { title: 'Tarpon Migration', target: 'Tarpon', when: 'May – July', technique: 'Live crabs, threadfins, ladyfish on circle hooks. Big swimbaits.', where: 'Bay passes, beach edges, deep channels.', details: 'Big FL bays are tarpon migration corridors — Tampa Bay, Charlotte Harbor, Boca Grande Pass world-famous.' },
        { title: 'Cobia Spring Run', target: 'Cobia', when: 'April – May', technique: 'Sight-cast cruising fish — bucktails (2–4 oz), live eels, big swimbaits.', where: 'Nearshore Gulf along beaches + bay mouths.', details: 'Spring cobia run draws crowds — sight-cast spotting tower fishing.' },
        { title: 'Tripletail — Buoy Stalking', target: 'Tripletail', when: 'June – September', technique: 'Live shrimp on free-line or popping cork. Sight-cast fish hanging under floating cover.', where: 'Crab trap buoys, channel markers, floating debris.', details: 'Specialty fishery — pure visual sight-casting.' },
        { title: 'Sheepshead Spawn — Winter Bridges', target: 'Sheepshead', when: 'January – March', technique: 'Fiddler crabs, shrimp pieces tight to pilings.', where: 'Bridge pilings, jetties, oyster bars.', details: 'Convict fishery — major winter target.' },
      ];
    case 'fl-coastal-pass':
      return [
        { title: 'Tarpon Migration Choke Point', target: 'Tarpon', when: 'April – July peak', technique: 'Live crabs (especially pass crabs during full/new moons), big swimbaits, big-stick live ladyfish. Anchor and chunk.', where: 'In the pass itself, especially during tide changes.', details: `${name} is an FL inlet/pass — bait stacks here on every tide. Tarpon migration choke point; snook spawn; pompano + mackerel + king + redfish; the whole inshore-nearshore mix.` },
        { title: 'Snook Spawn at the Pass', target: 'Snook', when: 'June – August peak; closed-season window', technique: 'Live pinfish or pilchards on light circle hooks. DOA shrimp, twitchbaits. Catch + release only during spawn closure.', where: 'In the pass + jetty rocks + first 100 yards inside.', details: 'FL snook congregate at passes for summer spawn — protect actively spawning fish.' },
        { title: 'Spanish Mackerel + Bluefish Schools', target: 'Spanish Mackerel and Bluefish', when: 'April – October', technique: 'Gotcha plugs, Spanish spoons, glass minnow flies.', where: 'Pass entrance + nearshore beach line.', details: 'Schools blitz through passes on tide changes.' },
        { title: 'Pompano + Whiting Surf', target: 'Pompano and Whiting', when: 'Spring + fall', technique: 'Sand fleas on pompano rigs.', where: 'Beach + jetty surf line.', details: 'Surf fishing right outside the pass.' },
      ];
    case 'fl-keys-flat':
      return [
        { title: 'Bonefish on the Flat', target: 'Bonefish', when: 'Year-round; peak winter calm days', technique: 'Fly: small (#4–6) crab + shrimp patterns (Gotcha, Bonefish Bitters, EP Crab) in tan/pink/cream. Spin: live shrimp on light jighead. Stealth poling.', where: 'Sandy + turtle-grass flats in 1–3 ft. Hard bottom + sand patches.', details: `${name} is a Florida Keys flat — bonefish + permit + tarpon are the trio. Sight-cast saltwater fly fishing at its highest form.` },
        { title: 'Permit on the Flat', target: 'Permit', when: 'Year-round; peak spring + fall', technique: 'Fly: weighted #4 crab patterns (Merkin, EP Crab, Bauer Crab). Spin: live crab or weighted shrimp.', where: 'Sandy flats with crab habitat. Often tailing.', details: 'Permit are the toughest sight-cast fish in the world — the prize species.' },
        { title: 'Tarpon Migration — Spring + Summer', target: 'Tarpon', when: 'March – July peak', technique: 'Fly: Tarpon toad, Cockroach, black-purple Death Toad. Spin: DOA Bait Buster, large soft plastics on circle hooks. Live crabs.', where: 'Channel edges, basin transitions, ocean-side flats during migration.', details: 'Keys tarpon migration — May/June legendary. World-class fishery.' },
        { title: 'Sharks on the Flats', target: 'Sharks (Lemon, Blacktip, Bull, Hammerhead)', when: 'Year-round', technique: 'Cut bait or jacks on heavy gear with wire. Fly: large mullet patterns with steel leader.', where: 'Edges of flats, basins.', details: 'Shark fishing on the flats — heavy gear, big fish, photo + release.' },
      ];
    case 'fl-keys-reef':
      return [
        { title: 'Reef Snapper + Grouper', target: 'Yellowtail, Mangrove, Mutton Snapper, Grouper', when: 'Year-round; check seasons', technique: 'Live shrimp + pilchards under chum line for yellowtail. Bigger live bait + heavier tackle for muttons + grouper near bottom.', where: 'Patch reefs in 25–60 ft. Reefs and ledges further out 60–100 ft.', details: `${name} is a Keys reef fishery — snappers and groupers are the staple. Yellowtail snapper especially are abundant and excellent eating.` },
        { title: 'Hogfish — Special Reef Catch', target: 'Hogfish', when: 'Year-round (regulated season)', technique: 'Live shrimp on light bottom rig. Pole spear when free-diving.', where: 'Reefs with hard bottom + cover.', details: 'Hogfish are the prize Keys reef fish — best-eating fish in the ocean per many guides.' },
        { title: 'Cero Mackerel + Spanish', target: 'Cero Mackerel and Spanish Mackerel', when: 'Spring + fall', technique: 'Trolling spoons + feathers; casting jigs to schools.', where: 'Mid-water around reefs.', details: 'Cero is the Keys version of Spanish — more colorful, similar quality.' },
      ];
    case 'fl-keys-offshore':
      return [
        { title: 'Sailfish — The Keys Marquee', target: 'Sailfish', when: 'November – March peak', technique: 'Live ballyhoo, threadfins, or pilchards on circle hooks behind kites or off outriggers. Trolling dredges + teasers.', where: 'Bluewater edges 100–600 ft.', details: `${name} is a Keys offshore fishery — sailfish + dolphin (mahi) + tuna + wahoo + marlin. Sailfish are the marquee winter fish.` },
        { title: 'Dolphin (Mahi-Mahi) Schools', target: 'Mahi-Mahi (Dolphin)', when: 'April – August peak', technique: 'Trolling rigged ballyhoo on color-coded skirts. Casting bucktails to bull dolphin around weed lines.', where: 'Weed lines and current edges in bluewater.', details: 'Dolphin are the Keys summer staple — fast, beautiful, excellent eating.' },
        { title: 'Tuna + Wahoo', target: 'Yellowfin/Blackfin Tuna and Wahoo', when: 'Year-round (variable)', technique: 'High-speed trolling lures (Yo-Zuri Bonita) for wahoo. Live bait + chunks + chum for tuna.', where: 'Bluewater edges + deep humps.', details: 'Tuna and wahoo are the speed-and-power Keys catch.' },
        { title: 'Marlin (Blue + White)', target: 'Marlin', when: 'Spring + summer', technique: 'Live mackerel or bonita on heavy tackle. Trolling lures and rigged baits.', where: 'Deep bluewater 600+ ft.', details: 'Rare but realistic Keys catch.' },
      ];
    case 'fl-everglades':
      return [
        { title: 'Backcountry Snook + Redfish', target: 'Snook and Redfish', when: 'Year-round; peak fall + spring', technique: 'Skiff fishing — live shrimp/pinfish, soft plastics on jighead, twitchbaits. Sight-cast tailing reds.', where: 'Mangrove shorelines, oyster bars, creek mouths, mud flats.', details: `${name} is Everglades / Ten Thousand Islands / Flamingo / Chokoloskee — vast backcountry maze. Snook + redfish + tarpon + trout + snapper + cobia mix.` },
        { title: 'Tarpon — Backcountry Rolling', target: 'Tarpon', when: 'May – October', technique: 'Live mullet, dead ladyfish chunks, fly. Big swimbaits.', where: 'Deep creek bends, holes, basin transitions.', details: 'Everglades backcountry tarpon — Boca Grande Pass-style summer migration plus resident fish year-round.' },
        { title: 'Mangrove Snapper Galore', target: 'Mangrove Snapper', when: 'Year-round', technique: 'Live shrimp or cut bait around mangrove pilings.', where: 'Mangrove edges + dock pilings.', details: 'Constant action species — fries up beautifully.' },
        { title: 'Bull Sharks on the Flats', target: 'Sharks (Bull, Lemon, Blacktip)', when: 'Year-round', technique: 'Cut bait + wire leader.', where: 'Deep flat edges + channel mouths.', details: 'Backcountry shark fishing — heavy gear.' },
        { title: 'Goliath Grouper — Catch + Photo + Release', target: 'Goliath Grouper', when: 'Year-round (NO HARVEST)', technique: 'Live bait + heavy tackle around structure. Strict C&R + photo release.', where: 'Backcountry creek mouths + structure.', details: 'Goliath grouper protected — release at boat-side; FWC regulations strict.' },
      ];
    case 'fl-mosquito-lagoon':
      return [
        { title: 'Sight-Cast Trophy Redfish — Gin-Clear Water', target: 'Redfish (Trophy)', when: 'Year-round; peak fall', technique: 'Fly: gold spoonfly, EP Crab, redfish toad in tan/orange. Spin: weedless gold spoon. Quiet poling — stealth essential.', where: 'Gin-clear shallow grass flats. Tailing fish in 1–2 ft.', details: `${name} is Mosquito Lagoon — Titusville area Indian River Lagoon system. The water is gin-clear and the redfish are HUGE — 30–40+ lb fish realistic in winter. Sight-fishing capital of the world for redfish.` },
        { title: 'Speckled Trout — Same Flats', target: 'Speckled Trout (Trophy)', when: 'Year-round; peak winter', technique: 'Topwater (Spook, MirrOLure Top Dog) at dawn; soft plastics through the day.', where: 'Grass flats + sandy potholes.', details: 'Mosquito Lagoon also holds trophy specks — 7–9 lb fish realistic.' },
        { title: 'Black Drum — Tailing on the Flats', target: 'Black Drum', when: 'Winter + spring spawning aggregations', technique: 'Live shrimp + cut crab on light gear.', where: 'Sandy flats + oyster bar edges.', details: 'Winter black drum schools in the lagoon — sight-fishing.' },
      ];
    case 'fl-spring-headwater':
      return [
        { title: 'Spring Headwater — Bream + Bass', target: 'Bluegill, Stumpknocker, Largemouth Bass', when: 'Year-round (72°F spring water)', technique: 'Light tackle — crickets + worms + small popping bugs. Bass on weightless flukes + small swimbaits.', where: 'Eelgrass beds, sandy spring runs, log cover near the boil.', details: `${name} is a freshwater FL spring head — Wakulla, Silver, Rainbow, Ichetucknee. Constant 72°F water; clear; lush eelgrass + manatees in winter. Bream + bass + sunshine bass + occasional striper.` },
        { title: 'Sunshine Bass (Stocked Hybrid)', target: 'Sunshine Bass', when: 'Year-round (FWC stocks select springs)', technique: 'Small jigs + live shrimp + in-line spinners.', where: 'Spring runs + main spring boil area.', details: 'FWC stocks sunshine bass (white bass × striped bass hybrid) on some spring rivers.' },
        { title: 'Manatee Refuge — Winter', target: 'Manatee (Watch Only)', when: 'November – March cold months', technique: 'NO targeting — protected. Distance + slow-zone regulations.', where: 'Spring boil + warm-water refuge zones.', details: 'Constant 72°F spring water draws manatees in winter.' },
      ];
    case 'fl-coastal-town':
      return [
        { title: 'Local Inshore Mix', target: 'Snook, Redfish, Trout, Flounder, Sheepshead, Drum', when: 'Year-round; species-specific seasons', technique: 'Live shrimp under popping cork, soft plastics on jighead, topwater at dawn. Live finger mullet during fall mullet run.', where: 'Grass flats, oyster bars, mangrove edges, residential canals, dock lights.', details: `${name} is a Florida coastal town — local inshore fishery with the FL standard mix (snook, redfish, trout, flounder, sheepshead, drum). Tides, moon phase, and bait presence drive the day.` },
        { title: 'Surf + Pier — Pompano, Whiting, Drum, Spanish', target: 'Pompano, Whiting, Bluefish, Spanish Mackerel, Red Drum', when: 'Spring + fall peak', technique: 'Surf rod + pompano rig with sand fleas/shrimp. Gotcha plugs + spoons for blues/Spanish.', where: 'Beach surf line + town piers + jetties.', details: 'Surf fishing variety — easy walk-on access in most FL coastal towns.' },
        { title: 'Nearshore — Spanish, Kings, Cobia', target: 'Spanish Mackerel, King Mackerel, Cobia', when: 'Spring + fall peak', technique: 'Trolling small spoons + planers for Spanish; live bait for kings; sight-cast cobia.', where: 'Nearshore Gulf or Atlantic, 1–10 miles off the beach.', details: 'Nearshore charter staples.' },
        { title: 'Fall Mullet Run — Every Predator', target: 'Snook, Tarpon, Redfish, Bluefish, Sharks', when: 'September – October', technique: 'Match the bait — live or dead mullet chunks, mullet-pattern lures (Whitewater Hellhound, big swimbaits).', where: 'Beach line, inlets, river mouths.', details: 'The fall mullet run is the FL fishery — every coastal town benefits.' },
      ];
  }
  return [];
}

function makeSpecies(cat) {
  switch (cat) {
    case 'fl-bass-lake':
      return [
        { name: 'Largemouth Bass (Florida-strain)', importance: 'signature', size: '2–6 lb common; trophy 8–13+ lb', notes: 'Florida-strain genetics — bigger than northern bass. Spawn Feb–April.' },
        { name: 'Crappie (Specks)', importance: 'signature', size: '0.75–2 lb', notes: 'Jan–March spawn — tournament season.' },
        { name: 'Bluegill', importance: 'signature', size: 'Hand-size 7–9"', notes: 'Spring + summer full-moon bedding.' },
        { name: 'Shellcracker (Redear Sunfish)', importance: 'signature', size: 'Hand-size to 1.5 lb', notes: 'Prized panfish; May full-moon spawn.' },
        { name: 'Channel Catfish', importance: 'strong', size: '2–6 lb', notes: 'Spring + summer cut bait.' },
        { name: 'Bowfin (Mudfish)', importance: 'good', size: '3–10 lb', notes: 'Aggressive backwater predator.' },
        { name: 'Gar (Florida)', importance: 'good', size: '2–10 lb', notes: 'Native; targeted with rope flies.' },
        { name: 'Tilapia', importance: 'good', size: 'Hand-size to 2 lb', notes: 'Invasive but abundant; legal harvest.' },
      ];
    case 'fl-harris-chain-lake':
      return [
        { name: 'Largemouth Bass (Florida-strain)', importance: 'signature', size: '2–6 lb; trophy 8+ lb', notes: 'Florida-strain stocked.' },
        { name: 'Crappie (Specks)', importance: 'signature', size: '0.75–1.75 lb', notes: 'Chain produces consistent slabs.' },
        { name: 'Bluegill', importance: 'strong', size: 'Hand-size', notes: 'Spring spawn.' },
        { name: 'Shellcracker', importance: 'strong', size: 'Hand-size', notes: 'May full moon.' },
        { name: 'Channel Catfish', importance: 'strong', size: '2–6 lb', notes: 'Stocked.' },
        { name: 'Sunshine Bass', importance: 'good', size: '2–5 lb', notes: 'FWC stocks select Harris Chain waters.' },
      ];
    case 'fl-stick-marsh-lake':
      return [
        { name: 'Largemouth Bass (Trophy Florida)', importance: 'signature', size: 'Trophy class — 8–14 lb realistic', notes: 'C&R only on some; Florida-strain stockings + flooded timber.' },
        { name: 'Crappie', importance: 'strong', size: '1–2 lb', notes: 'Spawn around timber.' },
        { name: 'Bluegill + Shellcracker', importance: 'strong', size: 'Hand-size', notes: 'Timber-edge bedding.' },
      ];
    case 'fl-natural-warm-lake':
      return [
        { name: 'Largemouth Bass', importance: 'signature', size: '2–5 lb', notes: 'Florida-strain potential.' },
        { name: 'Bluegill', importance: 'signature', size: 'Hand-size', notes: 'Spring spawn.' },
        { name: 'Shellcracker', importance: 'strong', size: 'Hand-size', notes: 'May full moon.' },
        { name: 'Crappie', importance: 'strong', size: '0.5–1 lb', notes: 'Spring.' },
        { name: 'Channel Catfish', importance: 'good', size: '1–4 lb', notes: 'Stocked.' },
        { name: 'Bowfin', importance: 'good', size: '3–8 lb', notes: 'Backwater.' },
      ];
    case 'fl-river-tidal-spring':
      return [
        { name: 'Snook', importance: 'signature', size: '24–34"; trophy 36+"', notes: 'Lower brackish zone of the river — May–Oct peak. Closed-season windows apply.' },
        { name: 'Redfish', importance: 'signature', size: 'Slot 18–27"; bulls 36"+', notes: 'Brackish + estuary mouth.' },
        { name: 'Speckled Trout', importance: 'signature', size: '15–25"', notes: 'Brackish zone of the river.' },
        { name: 'Tarpon', importance: 'signature', size: '50–150+ lb', notes: 'Rolling in lower brackish summer.' },
        { name: 'Sheepshead', importance: 'strong', size: '2–6 lb', notes: 'Lower-river pilings + oyster bars, especially winter.' },
        { name: 'Largemouth Bass', importance: 'strong', size: '2–5 lb', notes: 'UPPER freshwater section only.' },
        { name: 'Bluegill + Shellcracker', importance: 'strong', size: 'Hand-size', notes: 'UPPER freshwater section.' },
        { name: 'Sunshine Bass', importance: 'good', size: '2–4 lb', notes: 'Upper freshwater — FWC stocked on some.' },
        { name: 'Manatee', importance: 'present', size: 'NO HARVEST — protected', notes: 'Winter cold-water refuge in 72°F spring water.' },
      ];
    case 'fl-river-blackwater':
      return [
        { name: 'Largemouth Bass', importance: 'signature', size: '2–5 lb; Florida-strain trophy possible', notes: 'River-bass character.' },
        { name: 'Bluegill', importance: 'signature', size: 'Hand-size', notes: 'Cypress + log jam pockets.' },
        { name: 'Redbreast Sunfish', importance: 'signature', size: 'Hand-size', notes: 'FL native — beautiful + bold.' },
        { name: 'Spotted Sunfish (Stumpknocker)', importance: 'strong', size: 'Hand-size', notes: 'FL panhandle/north native.' },
        { name: 'Channel Catfish', importance: 'strong', size: '2–6 lb', notes: 'Stocked + reproducing.' },
        { name: 'Flathead Catfish', importance: 'strong', size: 'Trophy 30–50+ lb', notes: 'Suwannee + Apalachicola especially.' },
        { name: 'Gar (Longnose, Florida)', importance: 'good', size: '5–15 lb', notes: 'Slack-water predator.' },
        { name: 'Gulf Sturgeon', importance: 'present', size: 'NO HARVEST — Federal Protection', notes: 'Migratory spawning runs; Suwannee + Apalachicola.' },
      ];
    case 'fl-river-bass':
      return [
        { name: 'Largemouth Bass (Florida-strain)', importance: 'signature', size: '2–6 lb', notes: 'River character + tidal lower.' },
        { name: 'Bluegill', importance: 'signature', size: 'Hand-size', notes: 'Bream beds.' },
        { name: 'Shellcracker', importance: 'strong', size: 'Hand-size', notes: 'Full-moon spawn.' },
        { name: 'Snook (Lower Tidal)', importance: 'strong', size: '24–34"', notes: 'Lower-river brackish-tidal zone.' },
        { name: 'Redfish (Lower Tidal)', importance: 'strong', size: 'Slot 18–27"', notes: 'Lower-river estuary.' },
        { name: 'Crappie', importance: 'good', size: '0.5–1.5 lb', notes: 'Oxbows.' },
        { name: 'Channel + Flathead Catfish', importance: 'good', size: 'Channel 2–6 lb; flathead 20–40+ lb', notes: 'Log jams + deep holes.' },
        { name: 'Tarpon (Lower Tidal — Some Rivers)', importance: 'good', size: '50–150 lb', notes: 'Caloosahatchee + St. Johns lower especially.' },
      ];
    case 'fl-river-panhandle':
      return [
        { name: 'Largemouth Bass', importance: 'signature', size: '2–5 lb', notes: 'River bass character.' },
        { name: 'Bluegill', importance: 'signature', size: 'Hand-size', notes: 'Spring + summer.' },
        { name: 'Redbreast Sunfish', importance: 'strong', size: 'Hand-size', notes: 'Panhandle native.' },
        { name: 'Striped Bass', importance: 'strong', size: '10–25 lb', notes: 'Apalachicola system — FL\'s only striper run.' },
        { name: 'Channel + Flathead Catfish', importance: 'strong', size: 'Channel + trophy flatheads', notes: 'Yellow + Apalachicola produce trophy flatheads.' },
        { name: 'Gar', importance: 'good', size: '5–15 lb', notes: 'Slow water.' },
      ];
    case 'fl-coastal-flat':
      return [
        { name: 'Redfish', importance: 'signature', size: 'Slot 18–27"; bulls 30–40"+', notes: 'Tailing in shallow water.' },
        { name: 'Snook', importance: 'signature', size: '24–34"; trophy 36+"', notes: 'Closed season window — verify FWC.' },
        { name: 'Speckled Trout', importance: 'signature', size: '15–25"; gators 5+ lb', notes: 'Grass flats + sand potholes.' },
        { name: 'Flounder', importance: 'strong', size: '14–22"', notes: 'Sand cuts + channel edges.' },
        { name: 'Sheepshead', importance: 'strong', size: '2–5 lb', notes: 'Oyster bars + pilings.' },
        { name: 'Black Drum', importance: 'strong', size: '2–15 lb', notes: 'Oyster bars + flats.' },
        { name: 'Tarpon (Migratory Windows)', importance: 'good', size: '50–150+ lb', notes: 'May–July passes + beach edges.' },
        { name: 'Mangrove Snapper', importance: 'good', size: '12–16"', notes: 'Pilings + mangroves.' },
      ];
    case 'fl-coastal-pier-jetty':
      return [
        { name: 'King Mackerel', importance: 'signature', size: '15–40 lb', notes: 'Pier king fishery.' },
        { name: 'Spanish Mackerel', importance: 'signature', size: '1–4 lb', notes: 'Schools through.' },
        { name: 'Bluefish', importance: 'strong', size: '2–8 lb', notes: 'Surface schools.' },
        { name: 'Pompano', importance: 'strong', size: '1–3 lb', notes: 'Surf-cast in passes.' },
        { name: 'Sheepshead', importance: 'strong', size: '2–5 lb', notes: 'Pilings + jetties.' },
        { name: 'Black Drum', importance: 'good', size: '2–10 lb', notes: 'Bottom.' },
        { name: 'Red Drum (Bull Reds)', importance: 'good', size: '30–48"+', notes: 'Fall surf + jetty bulls.' },
        { name: 'Tarpon (Select Locations)', importance: 'good', size: '50–150 lb', notes: 'Boca Grande / Sebastian Inlet.' },
      ];
    case 'fl-coastal-bay':
      return [
        { name: 'Speckled Trout', importance: 'signature', size: '15–25"', notes: 'Grass flats foundation species.' },
        { name: 'Redfish', importance: 'signature', size: 'Slot 18–27"; bulls 30–40"+', notes: 'Multi-zone.' },
        { name: 'Snook', importance: 'signature', size: '24–34"; trophy 36"+', notes: 'Mangrove edges + passes.' },
        { name: 'Tarpon', importance: 'strong', size: '50–150+ lb', notes: 'Migration corridor.' },
        { name: 'Flounder', importance: 'strong', size: '14–22"', notes: 'Sand + channel edges.' },
        { name: 'Sheepshead', importance: 'strong', size: '2–5 lb', notes: 'Bridges + oyster bars.' },
        { name: 'Mangrove Snapper', importance: 'good', size: '12–16"', notes: 'Mangroves + docks.' },
        { name: 'Cobia', importance: 'good', size: '20–60 lb', notes: 'Spring sight-cast run.' },
        { name: 'Tripletail', importance: 'good', size: '5–20 lb', notes: 'Crab trap buoys.' },
      ];
    case 'fl-coastal-pass':
      return [
        { name: 'Tarpon', importance: 'signature', size: '50–150+ lb', notes: 'Migration choke-point + pass crab feeding.' },
        { name: 'Snook', importance: 'signature', size: '24–34"; trophy 36"+', notes: 'Summer spawn aggregation.' },
        { name: 'Spanish Mackerel', importance: 'strong', size: '1–4 lb', notes: 'Bait stacks.' },
        { name: 'Bluefish', importance: 'strong', size: '2–8 lb', notes: 'Pass tide changes.' },
        { name: 'King Mackerel (Some Passes)', importance: 'strong', size: '15–40 lb', notes: 'Sebastian Inlet, Boca Grande.' },
        { name: 'Pompano', importance: 'good', size: '1–3 lb', notes: 'Surf at pass edge.' },
        { name: 'Sharks', importance: 'good', size: 'Bull, Blacktip, Lemon, Hammerhead', notes: 'Pass mouths.' },
        { name: 'Cobia', importance: 'good', size: '20–60 lb', notes: 'Spring run through passes.' },
      ];
    case 'fl-keys-flat':
      return [
        { name: 'Bonefish', importance: 'signature', size: '5–10 lb', notes: 'The flagship Keys flats species.' },
        { name: 'Permit', importance: 'signature', size: '15–35 lb', notes: 'The trophy — toughest sight-cast on Earth.' },
        { name: 'Tarpon', importance: 'signature', size: '80–180+ lb', notes: 'Keys migration legendary.' },
        { name: 'Sharks', importance: 'strong', size: 'Lemon, Blacktip, Bull, Hammerhead', notes: 'Big sharks on flats.' },
        { name: 'Barracuda', importance: 'strong', size: '20–50 lb', notes: 'Sight-cast on flats.' },
        { name: 'Mutton + Mangrove Snapper', importance: 'good', size: '14–24"', notes: 'Channel edges + mangroves.' },
      ];
    case 'fl-keys-reef':
      return [
        { name: 'Yellowtail Snapper', importance: 'signature', size: '12–18"', notes: 'Reef staple — outstanding eating.' },
        { name: 'Mangrove Snapper', importance: 'signature', size: '14–18"', notes: 'Reef + structure.' },
        { name: 'Mutton Snapper', importance: 'signature', size: '5–15 lb', notes: 'Bigger snapper class.' },
        { name: 'Grouper (Black, Red, Gag)', importance: 'signature', size: '5–25 lb', notes: 'Reef + structure; check seasons.' },
        { name: 'Hogfish', importance: 'strong', size: '2–8 lb', notes: 'Best-eating fish in the Keys — regulated season.' },
        { name: 'Cero Mackerel', importance: 'good', size: '3–8 lb', notes: 'Keys version of Spanish.' },
        { name: 'Permit + Bonefish (Reef Edges)', importance: 'good', size: 'Variable', notes: 'Some patch reefs hold flats fish.' },
      ];
    case 'fl-keys-offshore':
      return [
        { name: 'Sailfish', importance: 'signature', size: '40–80 lb', notes: 'Winter peak — Keys marquee species.' },
        { name: 'Mahi-Mahi (Dolphin)', importance: 'signature', size: '5–40 lb', notes: 'Summer staple.' },
        { name: 'Yellowfin Tuna', importance: 'strong', size: '30–100+ lb', notes: 'Bluewater edge.' },
        { name: 'Blackfin Tuna', importance: 'strong', size: '15–30 lb', notes: 'More accessible than yellowfin.' },
        { name: 'Wahoo', importance: 'strong', size: '20–80 lb', notes: 'High-speed troll.' },
        { name: 'Blue + White Marlin', importance: 'good', size: '100–400+ lb', notes: 'Deep bluewater.' },
        { name: 'Swordfish (Daytime Deep)', importance: 'good', size: '50–300+ lb', notes: 'Specialty deep-drop fishery.' },
      ];
    case 'fl-everglades':
      return [
        { name: 'Snook', importance: 'signature', size: '24–34"; trophy 36"+', notes: 'Backcountry mangrove edges.' },
        { name: 'Redfish', importance: 'signature', size: 'Slot 18–27"; bulls 30–40"+', notes: 'Tailing on flats + mangrove edges.' },
        { name: 'Tarpon', importance: 'signature', size: '50–180 lb', notes: 'Backcountry rolling + migration.' },
        { name: 'Speckled Trout', importance: 'strong', size: '15–22"', notes: 'Grass flats.' },
        { name: 'Mangrove Snapper', importance: 'strong', size: '12–16"', notes: 'Mangrove pilings.' },
        { name: 'Goliath Grouper', importance: 'good', size: 'NO HARVEST — protected', notes: 'Large structure + creek mouths.' },
        { name: 'Sharks', importance: 'good', size: 'Bull, Lemon, Blacktip', notes: 'Heavy gear.' },
        { name: 'Cobia', importance: 'good', size: '20–60 lb', notes: 'Spring nearshore.' },
        { name: 'Sawfish', importance: 'present', size: 'NO HARVEST — endangered species', notes: 'Smalltooth sawfish protected; backcountry rare encounter.' },
      ];
    case 'fl-mosquito-lagoon':
      return [
        { name: 'Redfish (Trophy)', importance: 'signature', size: 'Slot 18–27"; bulls 30–40+ lb', notes: 'Gin-clear water + giants — sight-fishing capital.' },
        { name: 'Speckled Trout (Trophy)', importance: 'signature', size: '15–30"; gators 7–9+ lb', notes: 'Trophy speck destination.' },
        { name: 'Black Drum (Trophy)', importance: 'strong', size: '10–50+ lb', notes: 'Winter aggregations.' },
        { name: 'Snook', importance: 'good', size: '24–32"', notes: 'Lagoon resident — less abundant than south FL.' },
        { name: 'Tarpon', importance: 'good', size: '50–150 lb', notes: 'Summer rolling.' },
        { name: 'Flounder + Sheepshead', importance: 'good', size: 'Standard inshore', notes: 'Mixed bag.' },
      ];
    case 'fl-spring-headwater':
      return [
        { name: 'Bluegill', importance: 'signature', size: 'Hand-size', notes: 'Bedding May full moon.' },
        { name: 'Stumpknocker (Spotted Sunfish)', importance: 'signature', size: 'Hand-size', notes: 'FL native — beautiful spring fish.' },
        { name: 'Largemouth Bass', importance: 'strong', size: '2–4 lb', notes: 'Eelgrass + spring run.' },
        { name: 'Sunshine Bass', importance: 'strong', size: '2–5 lb', notes: 'FWC stocked on some springs.' },
        { name: 'Striped Bass', importance: 'good', size: '10–25 lb', notes: 'Some springs (Wakulla) hold Gulf-strain stripers.' },
        { name: 'Mullet', importance: 'good', size: 'Cast-net only', notes: 'Abundant baitfish.' },
        { name: 'Manatee', importance: 'present', size: 'NO HARVEST', notes: 'Winter refuge in 72°F.' },
      ];
    case 'fl-coastal-town':
      return [
        { name: 'Redfish', importance: 'signature', size: 'Slot 18–27"; bulls 30–40"+', notes: 'Inshore mainstay.' },
        { name: 'Speckled Trout', importance: 'signature', size: '15–22"', notes: 'Grass flats.' },
        { name: 'Snook', importance: 'signature', size: '24–34"', notes: 'Mangrove + passes; closed-season windows.' },
        { name: 'Spanish Mackerel', importance: 'strong', size: '1–4 lb', notes: 'Beach + nearshore.' },
        { name: 'King Mackerel', importance: 'strong', size: '15–40 lb', notes: 'Nearshore + piers.' },
        { name: 'Pompano', importance: 'strong', size: '1–3 lb', notes: 'Surf fishing.' },
        { name: 'Flounder', importance: 'good', size: '14–22"', notes: 'Sand + channel edges.' },
        { name: 'Sheepshead', importance: 'good', size: '2–5 lb', notes: 'Pilings + jetties.' },
        { name: 'Cobia', importance: 'good', size: '20–60 lb', notes: 'Spring run.' },
        { name: 'Tarpon', importance: 'good', size: '50–150 lb', notes: 'Migration season.' },
        { name: 'Mahi/Wahoo/Tuna (Offshore Charter)', importance: 'good', size: 'Variable', notes: 'Bluewater accessible.' },
      ];
  }
  return [];
}

function makeSig(cat) {
  switch (cat) {
    case 'fl-bass-lake': return ['Largemouth Bass (Florida-strain)', 'Crappie', 'Bluegill', 'Shellcracker'];
    case 'fl-harris-chain-lake': return ['Largemouth Bass', 'Crappie'];
    case 'fl-stick-marsh-lake': return ['Largemouth Bass (Trophy)'];
    case 'fl-natural-warm-lake': return ['Largemouth Bass', 'Bluegill'];
    case 'fl-river-tidal-spring': return ['Snook', 'Redfish', 'Tarpon', 'Manatee (winter refuge)'];
    case 'fl-river-blackwater': return ['Largemouth Bass', 'Bluegill', 'Redbreast Sunfish'];
    case 'fl-river-bass': return ['Largemouth Bass', 'Bluegill'];
    case 'fl-river-panhandle': return ['Largemouth Bass', 'Striped Bass (Apalachicola)'];
    case 'fl-coastal-flat': return ['Redfish', 'Snook', 'Speckled Trout'];
    case 'fl-coastal-pier-jetty': return ['King Mackerel', 'Spanish Mackerel'];
    case 'fl-coastal-bay': return ['Speckled Trout', 'Redfish', 'Snook', 'Tarpon'];
    case 'fl-coastal-pass': return ['Tarpon', 'Snook'];
    case 'fl-keys-flat': return ['Bonefish', 'Permit', 'Tarpon'];
    case 'fl-keys-reef': return ['Yellowtail Snapper', 'Grouper'];
    case 'fl-keys-offshore': return ['Sailfish', 'Mahi-Mahi'];
    case 'fl-everglades': return ['Snook', 'Redfish', 'Tarpon'];
    case 'fl-mosquito-lagoon': return ['Redfish (Trophy)', 'Speckled Trout (Trophy)'];
    case 'fl-spring-headwater': return ['Bluegill', 'Stumpknocker', 'Largemouth Bass'];
    case 'fl-coastal-town': return ['Redfish', 'Speckled Trout', 'Snook'];
  }
  return [];
}

function makeType(cat) {
  switch (cat) {
    case 'fl-bass-lake':
    case 'fl-harris-chain-lake':
    case 'fl-stick-marsh-lake':
    case 'fl-natural-warm-lake':
      return 'natural-lake';
    case 'fl-river-tidal-spring':
    case 'fl-river-blackwater':
    case 'fl-river-bass':
    case 'fl-river-panhandle':
    case 'fl-spring-headwater':
      return 'river';
    case 'fl-coastal-flat':
    case 'fl-coastal-pier-jetty':
    case 'fl-coastal-bay':
    case 'fl-coastal-pass':
    case 'fl-keys-flat':
    case 'fl-keys-reef':
    case 'fl-keys-offshore':
    case 'fl-everglades':
    case 'fl-mosquito-lagoon':
    case 'fl-coastal-town':
      return 'saltwater';
  }
  return 'natural-lake';
}

function buildFL({ id, name, region, county, acres, maxDepthFt, lat, lng, cat, notes, brackish }) {
  const isBrackish = !!brackish || cat === 'fl-river-tidal-spring' || cat === 'fl-coastal-bay' || cat === 'fl-everglades' || cat === 'fl-mosquito-lagoon';
  // Embed a brackish marker in the notes so it's queryable.
  const fullNotes = notes
    ? (isBrackish ? `[BRACKISH ZONE] ${notes}` : notes)
    : (isBrackish ? `[BRACKISH ZONE] ${name} — ${cat.replace(/-/g, ' ')} character Florida water with mixed fresh/saltwater influence.` : `${name} — ${cat.replace(/-/g, ' ')} character Florida water.`);
  return {
    id,
    name,
    state: 'FL',
    region,
    type: makeType(cat),
    county,
    acres: acres ?? null,
    maxDepthFt: maxDepthFt ?? null,
    lat, lng,
    signatureSpecies: makeSig(cat),
    species: makeSpecies(cat),
    patterns: makePatterns(cat, name),
    access: ['Public access — see FWC + county marine atlas for ramps, piers, kayak launches, and shoreline'],
    regulations: 'FL fishing license required (freshwater + separate saltwater). Snook permit + closed seasons (verify FWC). Redfish slot 18–27", 1/day (zone-specific). Speckled trout slot 15–19", 3/day (zone-specific). Trout closed-season windows. Tarpon C&R only over 40". Goliath grouper + sawfish + sturgeon NO HARVEST.',
    managementProgram: ['Florida Fish and Wildlife Conservation Commission (FWC) management', 'NOAA Federal saltwater management', isBrackish ? 'Brackish-zone — mixed fresh/saltwater fishery; salinity varies tide-by-tide' : null].filter(Boolean),
    notes: fullNotes,
  };
}

module.exports = { buildFL };
