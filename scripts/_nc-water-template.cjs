// North Carolina waterbody template engine.
// Categories encode NC's distinctive fishing character:
//  - nc-catawba-reservoir: Catawba chain (Norman, Wylie, James, Hickory, Rhodhiss, Lookout Shoals)
//      Striper + spotted bass + largemouth multi-species tournament water
//  - nc-yadkin-reservoir: Yadkin chain (High Rock, Tuckertown, Badin, Tillery, Falls)
//      Multispecies; trophy largemouth + striper + crappie
//  - nc-piedmont-reservoir: Falls Lake, Jordan, Hyco, Mayo, Belews, Sutton, Cane Creek
//      Largemouth + crappie + hybrid stripers
//  - nc-mountain-trout-stream: Davidson, Wilson, Big Snowbird, Nantahala, Slickrock, South Toe
//      Wild + stocked trout; small-stream tactics
//  - nc-mountain-tailwater: Hiwassee tailwater NC, Watauga tailwater, Cheoah tailwater
//      Trout + smallmouth in coldwater discharge
//  - nc-tva-reservoir-nc: Fontana, Hiwassee, Apalachia, Nantahala, Cheoah
//      Smallmouth + walleye + trout
//  - nc-coastal-river: Cape Fear, Neuse, Tar, Roanoke
//      Striped bass run (Roanoke!), largemouth, catfish, alligator gar (Cape Fear)
//  - nc-coastal-sound: Pamlico, Albemarle, Currituck, Core, Bogue
//      Saltwater redfish/trout/flounder + Currituck largemouth
//  - nc-coastal-pier: Outer Banks surf, ocean piers
//      Drum, blues, pompano, false albacore, kings
//  - nc-pocosin-lake: Mattamuskeet, Phelps, Pungo, Waccamaw
//      Eastern NC peat-soil lake — largemouth + crappie + cats
//  - nc-wma-pond: NCWRC managed community pond

function makePatterns(cat, name) {
  switch (cat) {
    case 'nc-catawba-reservoir':
      return [
        { title: 'Catawba Chain Striper — Live Shad', target: 'Striped Bass', when: 'Year-round; trophy class in winter', technique: 'Live blueback herring or shad on down-rods at the thermocline (25–60 ft summer; shallower in winter). Big swimbaits and Alabama rigs when fish surface-bust.', where: 'Main-lake channel, deep humps, dam area in summer.', details: `${name} is part of the Catawba reservoir chain — Lake Norman is the marquee striper destination, but Wylie, James, Hickory, and Rhodhiss all hold quality fish.` },
        { title: 'Spotted Bass — Bluff Points', target: 'Spotted Bass', when: 'Year-round, peak fall', technique: 'Drop-shot (Roboworm 4–6"), shaky head, jerkbaits (Megabass Vision 110), small swimbaits. Vertical structure.', where: 'Main-lake bluff walls, bridge causeways, riprap dam.', details: 'Catawba chain spotted bass are tournament prize — Coosa-strain-style aggressive deep-clear-water spots.' },
        { title: 'Largemouth — Creek Arms', target: 'Largemouth Bass', when: 'Spring – Fall', technique: 'ChatterBaits, jigs, and Texas rigs around docks, laydowns, and grass in creek arms.', where: 'Creek arms with shallow cover.', details: 'Largemouth dominate the creek-arm habitat; spotted bass dominate the main lake.' },
        { title: 'Crappie — Docks & Brush', target: 'Crappie', when: 'Spring spawn + year-round on brush', technique: 'Light line, small jigs, minnows around dock structure and brush piles.', where: 'Boat docks, marina piers, state-marked brush.', details: 'Catawba chain crappie are reliable spring and year-round.' },
        { title: 'Hot-Water Discharge — Catfish + Bait', target: 'Channel + Blue Catfish', when: 'Winter (December – March)', technique: 'Cut shad on Santee rigs near the power-plant discharges. Heated water concentrates fish.', where: 'Marshall Steam Plant (Norman), Riverbend (Mountain Island), Allen Steam (Wylie).', details: 'Duke Energy thermal discharges = winter catfish goldmines.' },
      ];
    case 'nc-yadkin-reservoir':
      return [
        { title: 'Trophy Largemouth — Standing Timber', target: 'Largemouth Bass', when: 'Spring – Fall', technique: 'Jigs and Texas rigs around standing timber; ChatterBaits in creek arms; deep cranks (Strike King 6XD) on offshore structure summer.', where: 'Standing timber stands, creek arms, river channel.', details: `${name} is Yadkin River chain water — High Rock, Tuckertown, Badin, Tillery all hold trophy bass with significant standing timber.` },
        { title: 'Striper + Hybrid — Open Water', target: 'Striped Bass and Hybrid Striped Bass', when: 'May – October', technique: 'Topwater when schooling; live shad on down-rods; big swimbaits.', where: 'Main lake, river channel.', details: 'NCWRC stocks stripers + hybrids across the Yadkin chain.' },
        { title: 'Crappie — Brush Piles', target: 'Crappie', when: 'Spring spawn + year-round', technique: 'Vertical jigging in 12–22 ft on state-marked brush.', where: 'Creek mouth brush piles, bridge structure.', details: 'High Rock especially is a crappie destination.' },
        { title: 'Catfish — Channel Drifting', target: 'Catfish (Blue + Channel)', when: 'Year-round', technique: 'Fresh cut shad on Santee rigs; drift channel ledges.', where: 'River channel, creek mouths.', details: 'Yadkin chain produces trophy blues — 50+ lb fish realistic.' },
      ];
    case 'nc-piedmont-reservoir':
      return [
        { title: 'Piedmont Largemouth — Boat Docks', target: 'Largemouth Bass', when: 'Year-round', technique: 'Skipping jigs and weightless Senkos under docks; ChatterBaits around riprap and grass.', where: 'Boat docks, riprap, creek arms.', details: `${name} is a NC Piedmont reservoir — dock fishing is the year-round bread-and-butter.` },
        { title: 'Crappie — Spring Coves', target: 'Crappie', when: 'March – May', technique: 'Long-pole jigging in shallow coves on the spawn; minnows under slip-cork.', where: 'Shallow creek arms.', details: 'NC Piedmont crappie spawn is reliable and predictable.' },
        { title: 'Hybrid Striped Bass — Where Stocked', target: 'Hybrid Striped Bass', when: 'Spring + fall schooling', technique: 'Topwater + big swimbaits.', where: 'Open water near creek mouths.', details: 'NCWRC stocks hybrids on Hyco, Mayo, Belews, Sutton — fast-growing open-water predators.' },
        { title: 'Catfish — Bank Fishing', target: 'Channel Catfish', when: 'Year-round', technique: 'Cut bait, chicken liver, commercial bait.', where: 'Shoreline channel mouths.', details: 'Standard NC reservoir catfish — easy bank access.' },
      ];
    case 'nc-mountain-trout-stream':
      return [
        { title: 'Wild Trout on Dries — Plunge Pools', target: 'Trout (Rainbow, Brown, Brook)', when: 'April – October', technique: '3–4 wt fly rod, dry-dropper (Stimulator size 14 + Pheasant Tail size 16), high-stick short drifts. Stealth.', where: 'Plunge pools, pocket water, current seams behind boulders.', details: `${name} is NC mountain wild-trout water — Davidson, Wilson, Big Snowbird, South Toe, Slickrock are legendary among southern fly anglers.` },
        { title: 'Hatch-Match Dries', target: 'Trout', when: 'Spring – Fall', technique: 'Match the hatch: Quill Gordons (early spring), Hendricksons, March Browns, Sulfurs (May), Stoneflies (Yellow Sallies), terrestrials (summer).', where: 'Riffles and tailouts.', details: 'NC mountain streams have full Eastern hatch sequence. The Davidson is famous for sulfur evenings.' },
        { title: 'Streamers for Trophy Browns', target: 'Brown Trout', when: 'Fall – winter', technique: 'Sink-tip line, articulated streamers, bigger flies (#4–8). Strip across bank cuts and deeper pools.', where: 'Big pools below long riffles.', details: 'Wild brown trout in NC mountain streams grow large in protected catch-and-release sections.' },
        { title: 'Brook Trout in Headwaters', target: 'Brook Trout', when: 'Late spring – early fall', technique: 'Small dries (Adams, Royal Wulff size 16–18), tiny streams, careful stealth.', where: 'Highest-elevation tribs (above 3000 ft typically).', details: 'Southern Appalachian brook trout are native — found in highest, coldest NC headwaters.' },
      ];
    case 'nc-mountain-tailwater':
      return [
        { title: 'Cold-Discharge Trout — Nymphing', target: 'Trout (Rainbow + Brown)', when: 'Year-round; best during low/zero generation', technique: 'Two-fly nymph rig: zebra midge above pheasant tail or hare\'s ear, 6X tippet, strike indicator.', where: 'Riffles and current seams.', details: `${name} is NC tailwater coldwater discharge — predictable trout fishery year-round. Watch generation schedule.` },
        { title: 'Streamer Game in High Water', target: 'Brown Trout', when: 'High generation periods', technique: 'Sink-tip, big streamers in olive/black/white. Bigger fish move out of cover when water rises.', where: 'Bank cuts, log jams, current breaks.', details: 'High flow brings out the trophy browns.' },
      ];
    case 'nc-tva-reservoir-nc':
      return [
        { title: 'Smallmouth + Walleye — Deep Rock', target: 'Smallmouth Bass and Walleye', when: 'Year-round, peak fall – spring', technique: 'Jigging spoons in winter, drop-shot + jerkbaits in transition, deep cranks (6XD/10XD) for summer ledges. Walleye on slow-trolled bottom-bouncer + crawler harness.', where: 'Main-lake humps, points, channel-swing bluffs.', details: `${name} is far-west NC TVA reservoir water — Fontana, Hiwassee, Nantahala, Cheoah are deep clear lakes with smallmouth + walleye character.` },
        { title: 'Spotted Bass — Bluff Walls', target: 'Spotted Bass', when: 'Year-round', technique: 'Drop-shot, shaky head on vertical rock.', where: 'Main-lake bluffs.', details: 'TVA reservoir spotted bass — vertical structure.' },
        { title: 'Striped Bass — Where Stocked', target: 'Striped Bass', when: 'Spring + summer', technique: 'Topwater schoolers, live shad on down-rods.', where: 'Main-lake river channel.', details: 'Fontana especially holds quality stripers.' },
      ];
    case 'nc-coastal-river':
      return [
        { title: 'Spring Striped Bass Run', target: 'Striped Bass', when: 'April – May', technique: 'Soft plastics (Storm WildEye Shad), bucktails, and live bait. Heavy gear — 30–50 lb braid + leader.', where: 'Roanoke River near Weldon NC, Cape Fear at Lock and Dam #1, Tar at Greenville.', details: `${name} is part of NC\'s coastal river system — the Roanoke striper run (mid-April to mid-May) at Weldon is the marquee Atlantic-coast striper migration spawn destination. Catch-and-release only above I-95.` },
        { title: 'Largemouth + Bowfin', target: 'Largemouth Bass and Bowfin', when: 'Spring – Fall', technique: 'Frogs and weedless plastics in lily pads + cypress backwaters; jigs around log jams.', where: 'Oxbow lakes off the main river, cypress backwaters.', details: 'Coastal NC bowfin (mudfish) are unloved but aggressive — eat surface plugs.' },
        { title: 'Catfish + Gar', target: 'Catfish and Longnose/Alligator Gar', when: 'Year-round', technique: 'Cut bait for cats; mullet chunks for gar.', where: 'River channel, deep holes, log jams.', details: 'Cape Fear has confirmed alligator gar; longnose gar throughout coastal NC.' },
      ];
    case 'nc-coastal-sound':
      return [
        { title: 'Sound-Side Speckled Trout + Reds', target: 'Speckled Trout and Redfish', when: 'Year-round, peak spring and fall', technique: 'Topwater (Spook) at first light; soft plastics under popping cork; live shrimp or finger mullet.', where: 'Grass beds, oyster reefs, creek mouths, marsh edges.', details: `${name} is NC sound country — Pamlico, Albemarle, Core, and Bogue Sounds all hold quality inshore species. Trophy "gator" speckled trout 7–8+ lb realistic.` },
        { title: 'Drum Run — Pamlico Pier', target: 'Red Drum (Trophy)', when: 'Spring (April – May) and Fall (September – November)', technique: 'Big chunks of mullet or blue crab on Carolina rigs. Heavy surf rods.', where: 'Cape Hatteras National Seashore beaches, Avon, Buxton, Frisco, Hatteras.', details: 'NC has the world\'s most consistent trophy red drum surf fishery — 40–50+ inch fish realistic. State record 94 lb 2 oz (Avon, 1984) stands as world record.' },
        { title: 'Flounder Drift', target: 'Flounder', when: 'October – November (run); year-round inshore', technique: 'Live mud minnows or finger mullet on Carolina rigs; jigs (Gulp shrimp on 1/4-oz head).', where: 'Inlets, ICW, sound-side flats.', details: 'NC flounder season has tightening regs — check NCDMF before fishing.' },
        { title: 'Largemouth — Currituck Sound', target: 'Largemouth Bass', when: 'Spring – Fall', technique: 'Frogs over grass, weightless flukes, ChatterBaits in stained water.', where: 'Currituck Sound grass flats (sound is brackish in the north — largemouth thrive).', details: 'Currituck Sound has world-class freshwater largemouth fishing despite being a coastal sound — low salinity at the northern end.' },
      ];
    case 'nc-coastal-pier':
      return [
        { title: 'Pier King Mackerel', target: 'King Mackerel', when: 'April – June and September – November', technique: 'Live bait (bluefish, ribbonfish) drifted off the end on a king rig with stinger trebles. Long, patient.', where: 'NC ocean piers — Jennette\'s, Avalon, Avon, Holden Beach, Sunset Beach.', details: `${name} is NC ocean pier fishing — kings, blues, Spanish, false albacore, pompano, sea mullet. Iconic Carolina coast tradition.` },
        { title: 'Spanish Mackerel + Bluefish — Cast and Crank', target: 'Spanish Mackerel and Bluefish', when: 'May – October', technique: 'Gotcha plugs and small Spanish spoons. Cast and crank fast.', where: 'Off NC ocean piers.', details: 'Standard pier fast-fishing — schools blitz through.' },
        { title: 'False Albacore (Albies) Run', target: 'False Albacore', when: 'October – November', technique: 'Small bucktails, jigs, epoxy flies. Sight-cast schools.', where: 'Cape Lookout, Beaufort Inlet, Harkers Island — boat fishing primarily.', details: 'NC fall albie run is legendary — Cape Lookout is the world\'s premier albie destination.' },
        { title: 'Surf Drum + Pompano', target: 'Red Drum and Pompano', when: 'Spring + Fall surf fishing', technique: 'Pompano rigs (two-hook surf rig) with sand fleas or shrimp for pompano. Larger surf rods + cut mullet for drum.', where: 'Outer Banks beaches.', details: 'Surf fishing on the Banks — patient art, big rewards.' },
      ];
    case 'nc-pocosin-lake':
      return [
        { title: 'Pocosin Largemouth — Cypress + Pads', target: 'Largemouth Bass', when: 'May – October', technique: 'Frogs (SPRO Bronzeye) over lily pads + grass mats; jigs around cypress knees and stumps; weightless flukes in deeper pockets.', where: 'Lily pads, cypress fields, peat-stained backwaters.', details: `${name} is eastern NC pocosin water — dark tea-stained water from peat soils, cypress + lily pad cover, classic Southern backwater bass.` },
        { title: 'Crappie Around Cypress', target: 'Crappie', when: 'Spring – year-round', technique: 'Long-pole jigging around cypress knees and stumps; minnows in spring shallow.', where: 'Cypress shorelines.', details: 'Eastern NC crappie thrive in pocosin lakes — Mattamuskeet, Phelps, Pungo are factories.' },
        { title: 'Catfish — Bottom Bait', target: 'Channel Catfish', when: 'Year-round', technique: 'Cut bait or chicken liver on bottom rigs.', where: 'Creek channels, shoreline.', details: 'Standard pocosin lake catfish.' },
      ];
    case 'nc-wma-pond':
      return [
        { title: 'Community Pond Fishery', target: 'Channel Catfish, Bluegill, Largemouth Bass', when: 'Year-round', technique: 'Worms and crickets for bream; chicken liver for cats; small lures for bass.', where: 'Shoreline, pier, dam.', details: `${name} is a NCWRC-managed community pond — stocked regularly with channel cats + bream, resident largemouth, bank-friendly access. Some get cool-month trout stockings.` },
      ];
  }
  return [];
}

function makeSpecies(cat) {
  switch (cat) {
    case 'nc-catawba-reservoir':
      return [
        { name: 'Striped Bass', importance: 'signature', size: '10–35 lb; trophy 40+', notes: 'Lake Norman trophy striper destination.' },
        { name: 'Spotted Bass', importance: 'signature', size: '1.5–4 lb', notes: 'Aggressive Catawba-chain spots — bluff walls + main-lake structure.' },
        { name: 'Largemouth Bass', importance: 'strong', size: '2–6 lb', notes: 'Creek arms, docks.' },
        { name: 'Crappie', importance: 'strong', size: '0.5–1.5 lb', notes: 'Docks + brush piles.' },
        { name: 'Channel + Blue Catfish', importance: 'strong', size: 'Trophy blues 30–60+ lb', notes: 'Hot-water discharges concentrate them.' },
        { name: 'Hybrid Striped Bass', importance: 'good', size: '5–10 lb', notes: 'Stocked on select lakes.' },
        { name: 'White Perch', importance: 'good', size: '0.5–1 lb', notes: 'Abundant numbers fish.' },
      ];
    case 'nc-yadkin-reservoir':
      return [
        { name: 'Largemouth Bass', importance: 'signature', size: '2–8 lb', notes: 'Florida-strain trophy potential.' },
        { name: 'Striped Bass', importance: 'signature', size: '10–30 lb', notes: 'Stocked.' },
        { name: 'Hybrid Striped Bass', importance: 'strong', size: '5–10 lb', notes: 'Stocked.' },
        { name: 'Crappie', importance: 'strong', size: '0.5–2 lb', notes: 'High Rock especially.' },
        { name: 'Catfish (Blue + Channel + Flathead)', importance: 'strong', size: 'Trophy blues 30–80 lb', notes: 'Trophy class.' },
        { name: 'Spotted Bass', importance: 'good', size: '1.5–3 lb', notes: 'Rock + main lake.' },
        { name: 'White Perch', importance: 'good', size: '0.5–1 lb', notes: 'Abundant.' },
      ];
    case 'nc-piedmont-reservoir':
      return [
        { name: 'Largemouth Bass', importance: 'signature', size: '2–5 lb', notes: 'Dock-skip and grass.' },
        { name: 'Crappie', importance: 'signature', size: '0.5–1.5 lb', notes: 'Spring spawn + brush.' },
        { name: 'Channel Catfish', importance: 'strong', size: '2–6 lb', notes: 'Stocked.' },
        { name: 'Bluegill', importance: 'strong', size: 'Hand-size', notes: 'Spring spawn.' },
        { name: 'Hybrid Striped Bass', importance: 'good', size: '5–12 lb', notes: 'Stocked on Hyco/Mayo/Belews/Sutton.' },
      ];
    case 'nc-mountain-trout-stream':
      return [
        { name: 'Rainbow Trout', importance: 'signature', size: '8–14"; trophy holdover 18+"', notes: 'Wild reproducing + stocked.' },
        { name: 'Brown Trout', importance: 'signature', size: '10–18"; trophy 24+"', notes: 'Wild reproducing in many streams; trophy potential in deep pools.' },
        { name: 'Brook Trout', importance: 'strong', size: '5–10"', notes: 'Native, high-elevation headwaters.' },
      ];
    case 'nc-mountain-tailwater':
      return [
        { name: 'Rainbow Trout', importance: 'signature', size: '10–16"; holdover 20"+', notes: 'Stocked + holdover.' },
        { name: 'Brown Trout', importance: 'signature', size: '12–22"; trophy 26+"', notes: 'Holdover and some wild reproduction.' },
        { name: 'Smallmouth Bass', importance: 'good', size: '1.5–3 lb', notes: 'Below cold zones.' },
      ];
    case 'nc-tva-reservoir-nc':
      return [
        { name: 'Smallmouth Bass', importance: 'signature', size: '1.5–4 lb; trophy 5+ lb', notes: 'Deep clear NC TVA water.' },
        { name: 'Walleye', importance: 'signature', size: '15–24"; trophy 28+"', notes: 'Strong populations on Fontana, Hiwassee, Nantahala.' },
        { name: 'Spotted Bass', importance: 'strong', size: '1.5–3 lb', notes: 'Bluff walls.' },
        { name: 'Largemouth Bass', importance: 'good', size: '2–4 lb', notes: 'Creek arms.' },
        { name: 'Striped Bass', importance: 'good', size: '15–35 lb', notes: 'Fontana especially.' },
        { name: 'Lake Trout', importance: 'good', size: '8–20 lb', notes: 'Fontana has stocked lake trout.' },
      ];
    case 'nc-coastal-river':
      return [
        { name: 'Striped Bass', importance: 'signature', size: '5–40 lb', notes: 'Roanoke run especially — Atlantic spawning migration.' },
        { name: 'Largemouth Bass', importance: 'signature', size: '2–6 lb', notes: 'Backwaters + cypress.' },
        { name: 'Catfish (Blue + Channel + Flathead)', importance: 'strong', size: 'Trophy 30–80+ lb', notes: 'Coastal NC trophy cat water.' },
        { name: 'Bowfin', importance: 'good', size: '3–10 lb', notes: 'Backwaters.' },
        { name: 'Longnose Gar', importance: 'good', size: '5–15 lb', notes: 'Lower river.' },
        { name: 'Alligator Gar', importance: 'good', size: 'Trophy 50–100+ lb', notes: 'Lower Cape Fear — confirmed remnant population.' },
        { name: 'Crappie', importance: 'good', size: '0.5–1.5 lb', notes: 'Oxbows.' },
      ];
    case 'nc-coastal-sound':
      return [
        { name: 'Speckled Trout', importance: 'signature', size: '14–24"; gator class 5–8 lb', notes: 'Pamlico Sound especially produces trophy specks.' },
        { name: 'Red Drum', importance: 'signature', size: 'Slot 18–27"; bulls 40–50"+', notes: 'Both slot and trophy classes — NC has world\'s best red drum fishery.' },
        { name: 'Flounder', importance: 'strong', size: '14–20"', notes: 'Inshore + fall run.' },
        { name: 'Largemouth Bass', importance: 'strong', size: '2–6 lb', notes: 'Currituck Sound especially — brackish-to-fresh.' },
        { name: 'Black Drum', importance: 'good', size: '2–15 lb', notes: 'Oyster reefs + piers.' },
        { name: 'Sheepshead', importance: 'good', size: '2–5 lb', notes: 'Pilings.' },
        { name: 'Tripletail', importance: 'good', size: '5–20 lb', notes: 'Pamlico Sound around buoys/floating debris.' },
      ];
    case 'nc-coastal-pier':
      return [
        { name: 'King Mackerel', importance: 'signature', size: '15–40 lb; trophy 50+ lb', notes: 'Pier kings — Carolina specialty.' },
        { name: 'Red Drum (Trophy)', importance: 'signature', size: '40–50"+', notes: 'Hatteras Island surf — world-record class.' },
        { name: 'Spanish Mackerel', importance: 'strong', size: '1–4 lb', notes: 'Cast-and-crank.' },
        { name: 'Bluefish', importance: 'strong', size: '2–8 lb', notes: 'Schools through pier.' },
        { name: 'False Albacore', importance: 'strong', size: '8–18 lb', notes: 'Fall run — Cape Lookout especially.' },
        { name: 'Cobia', importance: 'good', size: '20–60 lb', notes: 'Spring run.' },
        { name: 'Pompano', importance: 'good', size: '1–3 lb', notes: 'Surf fishing.' },
        { name: 'Sea Mullet (Whiting)', importance: 'good', size: 'Hand-size', notes: 'Numbers fish.' },
      ];
    case 'nc-pocosin-lake':
      return [
        { name: 'Largemouth Bass', importance: 'signature', size: '2–6 lb', notes: 'Cypress + pads.' },
        { name: 'Crappie', importance: 'signature', size: '0.5–1.5 lb', notes: 'Cypress shorelines.' },
        { name: 'Channel Catfish', importance: 'strong', size: '2–6 lb', notes: 'Standard.' },
        { name: 'Bluegill', importance: 'strong', size: 'Hand-size', notes: 'Cover.' },
        { name: 'Bowfin', importance: 'good', size: '3–10 lb', notes: 'Backwater predator.' },
      ];
    case 'nc-wma-pond':
      return [
        { name: 'Channel Catfish', importance: 'signature', size: '1–5 lb', notes: 'NCWRC stocked.' },
        { name: 'Bluegill', importance: 'signature', size: 'Hand-size', notes: 'Reproducing.' },
        { name: 'Largemouth Bass', importance: 'strong', size: '1–3 lb', notes: 'Resident.' },
        { name: 'Rainbow Trout', importance: 'good', size: '10–13" stocked', notes: 'Cool-month stockings on select urban ponds.' },
      ];
  }
  return [];
}

function makeSig(cat) {
  switch (cat) {
    case 'nc-catawba-reservoir': return ['Striped Bass', 'Spotted Bass'];
    case 'nc-yadkin-reservoir': return ['Largemouth Bass', 'Striped Bass'];
    case 'nc-piedmont-reservoir': return ['Largemouth Bass', 'Crappie'];
    case 'nc-mountain-trout-stream': return ['Wild Trout'];
    case 'nc-mountain-tailwater': return ['Trout (Rainbow and Brown)'];
    case 'nc-tva-reservoir-nc': return ['Smallmouth Bass', 'Walleye'];
    case 'nc-coastal-river': return ['Striped Bass', 'Largemouth Bass'];
    case 'nc-coastal-sound': return ['Red Drum', 'Speckled Trout', 'Flounder'];
    case 'nc-coastal-pier': return ['King Mackerel', 'Red Drum'];
    case 'nc-pocosin-lake': return ['Largemouth Bass', 'Crappie'];
    case 'nc-wma-pond': return ['Channel Catfish', 'Bluegill'];
  }
  return [];
}

function makeType(cat) {
  switch (cat) {
    case 'nc-catawba-reservoir':
    case 'nc-yadkin-reservoir':
    case 'nc-piedmont-reservoir':
    case 'nc-tva-reservoir-nc':
    case 'nc-wma-pond':
      return 'reservoir';
    case 'nc-mountain-trout-stream':
    case 'nc-coastal-river':
      return 'river';
    case 'nc-mountain-tailwater':
      return 'tailwater';
    case 'nc-coastal-sound':
    case 'nc-coastal-pier':
      return 'saltwater';
    case 'nc-pocosin-lake':
      return 'natural-lake';
  }
  return 'natural-lake';
}

function buildNC({ id, name, region, county, acres, maxDepthFt, lat, lng, cat, notes }) {
  return {
    id,
    name,
    state: 'NC',
    region,
    type: makeType(cat),
    county,
    acres: acres ?? null,
    maxDepthFt: maxDepthFt ?? null,
    lat, lng,
    signatureSpecies: makeSig(cat),
    species: makeSpecies(cat),
    patterns: makePatterns(cat, name),
    access: ['Public access — see NCWRC Boating Access Atlas (freshwater) or NCDMF Saltwater Access for specific ramps and shoreline'],
    regulations: 'NC fishing license required (freshwater + separate saltwater). Trout license required on trout waters. Coastal Recreational Fishing License (CRFL) for saltwater. Check NCWRC + NCDMF for current creel limits and special regulations.',
    managementProgram: ['NC Wildlife Resources Commission (NCWRC) freshwater management', 'NC Division of Marine Fisheries (NCDMF) saltwater management'],
    notes: notes || `${name} — ${cat.replace(/-/g, ' ')} character NC water.`,
  };
}

module.exports = { buildNC };
