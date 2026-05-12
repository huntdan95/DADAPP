// Western US waterbody template engine.
// Covers 11 Western states with categories that reflect the distinctive
// Western fishing identity — Rocky Mountain trout heaven, Pacific salmon/
// steelhead, desert reservoir bass, alpine lakes, and the full Western
// hatch calendar (Salmonfly, Golden Stone, PMD, Trico, Hopper, etc.).
//
//  - west-tailwater-trout: Bighorn, Madison, Green, Provo, San Juan, Frying Pan,
//      Yampa, Gunnison, Taylor, Williams Fork, Blue, South Platte, Owyhee.
//  - west-freestone-trout: Yellowstone, Madison upper, Bitterroot, Salmon,
//      Henry's Fork, Snake, Boulder, North Fork, etc.
//  - west-alpine-lake: high mountain lakes — cutthroat, brookie, golden.
//  - west-spring-creek: Armstrong, Nelson, DePuy, Silver Creek, Henry's Lake
//      spring creeks.
//  - pacific-salmon-river: Columbia, Klamath, Rogue, Umpqua, Skagit, Sandy,
//      Smith, Eel, Trinity, Russian, Sacramento.
//  - pacific-steelhead-stream: same systems — steelhead-focused.
//  - desert-reservoir: Powell, Mead, Mohave, Havasu, Roosevelt, Apache,
//      Saguaro, San Carlos, Pleasant, Bartlett, Alamo.
//  - high-desert-lake: Henrys Lake, Eagle Nest, Heron, Cochiti, Strawberry,
//      Flaming Gorge.
//  - great-basin-lake: Pyramid, Walker, Tahoe, Topaz, Lahontan.
//  - pacific-coast-saltwater: ocean shore + nearshore.
//  - pacific-coast-pier: pier fishing.
//  - pacific-offshore: tuna/salmon/halibut offshore.
//  - pacific-bay: Puget Sound, San Francisco Bay, Coos Bay, Tillamook, etc.
//  - west-warmwater-river: Lower Snake, Columbia, big mainstem warmwater.
//  - mountain-meadow-stream: small high-meadow streams.

function makePatterns(cat, name) {
  switch (cat) {
    case 'west-tailwater-trout':
      return [
        { title: 'Midge Nymphing — Year-Round Foundation', target: 'Trout (Rainbow + Brown + Cutthroat)', when: 'Year-round; best low water', technique: 'Two-fly nymph rig: zebra midge / WD-40 (#18–22) + sowbug/scud (#16). 6X tippet, strike indicator at 1.5× depth.', where: 'Riffle-pool transitions, current seams, slow tailouts.', details: `${name} is a Western tailwater — cold dam discharge holds trout year-round. Midges + scuds + sowbugs are the bread-and-butter forage.` },
        { title: 'PMD (Pale Morning Dun) Hatch', target: 'Trout', when: 'Mid-June – mid-August, late morning to early afternoon', technique: 'Fly: #16–18 PMD dun + emerger + spinner (rusty). 5X-6X tippet. Drag-free drift.', where: 'Riffles, current seams, foam lines.', details: 'PMD hatch — Western tailwater signature. Ephemerella inermis. Peak hatch midday; spinner fall in evening.' },
        { title: 'BWO (Blue Wing Olive)', target: 'Trout', when: 'March – May + September – October cloudy days', technique: 'Fly: #18–22 BWO dun, RS-2, parachute Adams. 6X tippet.', where: 'Quiet seams downstream of riffles.', details: 'Year-round small mayfly — cool overcast days produce the best dry-fly windows.' },
        { title: 'Tricos — Late Summer Mornings', target: 'Trout', when: 'August – September, 8–11 AM', technique: 'Fly: #20–24 trico spinner. 6X-7X tippet. Long leaders.', where: 'Slow flats + slick water.', details: 'Trico spinner fall — technical late-summer morning game.' },
        { title: 'Hopper Bite + Hopper-Dropper', target: 'Trout', when: 'July – September warm afternoons', technique: 'Fly: #8–12 foam hopper (Chubby Chernobyl, Morrish Hopper, Fat Albert) +/- #16–18 PT or copper John dropper.', where: 'Bank seams + grassy banks; soft current seams.', details: 'Hopper bite is iconic Western summer dry-fly fishing.' },
        { title: 'Streamer Game for Trophy Browns', target: 'Brown Trout', when: 'Fall – winter; high water anytime', technique: 'Sink-tip + #4–8 articulated streamers (Sex Dungeon, Dali Llama, Sculpzilla) in olive/black/white/yellow. Strip across bank seams.', where: 'Bank cuts, deep pools, log jams.', details: 'Western browns grow large on streamers — fall pre-spawn aggression peak.' },
        { title: 'San Juan Worm + Egg Patterns', target: 'Trout', when: 'High water + post-spawn windows', technique: 'Fly: #10–14 San Juan worm + #14 egg patterns under indicator.', where: 'Deep slow pools.', details: 'When the river\'s up + dirty, worms get eaten. Easy + productive.' },
      ];
    case 'west-freestone-trout':
      return [
        { title: 'Salmonfly Hatch — June Madness', target: 'Trout (Rainbow + Brown + Cutthroat)', when: 'Mid-June – early July (timing varies with snowmelt)', technique: 'Fly: #4–8 Salmonfly dry (Rogue Stone, Fluttering Stone, Hardy\'s Sofa Pillow); subsurface — #4–8 Pat\'s Rubber Legs, brown/black stonefly nymph. 3X tippet.', where: 'Bank seams under cottonwood/willow; bigger pools below riffles.', details: `${name} gets the legendary Salmonfly hatch (Pteronarcys californica) — biggest mayfly hatch in North America. Trout key on huge dries; trophy fish move out of cover.` },
        { title: 'Golden Stonefly Hatch', target: 'Trout', when: 'Mid-June – late July', technique: 'Fly: #6–10 Golden Stone dry; #6–8 Pat\'s Rubber Legs in tan/golden.', where: 'Same bank seams as Salmonflies.', details: 'Golden Stones overlap with Salmonflies — keep both in the box.' },
        { title: 'Yellow Sally Stonefly', target: 'Trout', when: 'Mid-June – August', technique: 'Fly: #14–16 Yellow Sally dry; small yellow stonefly nymph dropper.', where: 'Riffles + pocket water.', details: 'Smaller stonefly + reliable hatch; great hopper-dropper anchor.' },
        { title: 'PMD + Caddis Mix', target: 'Trout', when: 'June – August', technique: 'Fly: #14–18 PMD dun/emerger/spinner; #14–18 Elk Hair Caddis (tan, olive, X-caddis). Drag-free drift.', where: 'Riffle-pool transitions.', details: 'Peak-of-summer dry-fly fishing on Western freestone water.' },
        { title: 'Hopper Bite — Trophy Bank Game', target: 'Trout (Trophy Browns)', when: 'July – September warm afternoons + wind', technique: 'Fly: #8–10 foam hopper (Morrish, Fat Albert, Chubby Chernobyl). Slap-it-down + drift. Often hopper + dropper.', where: 'Tall grass banks + cut banks + willow shadows.', details: 'Western hopper season — biggest dry-fly trout of the year. Wind helps.' },
        { title: 'Streamer for Big Browns', target: 'Brown Trout (Trophy)', when: 'October – November pre-spawn + April – May post-spawn', technique: 'Sink-tip + #4–6 articulated streamers (Sex Dungeon, Drunk & Disorderly) in olive/yellow/black.', where: 'Bank cuts, log jams, deep pool tails.', details: 'Fall streamer for migratory pre-spawn browns is the trophy-trout playbook.' },
        { title: 'Mahogany Dun + Trico Late-Summer', target: 'Trout', when: 'Late August – September', technique: 'Fly: #16–18 Mahogany Dun; #20–22 Trico spinner morning.', where: 'Slow seams.', details: 'Last big mayfly windows of the year.' },
        { title: 'Skwala Stone — Early-Season Western Specialty', target: 'Trout', when: 'March – April (early-season pre-runoff)', technique: 'Fly: #8–12 Skwala dry (olive); small olive stonefly nymph.', where: 'Bank seams.', details: 'Skwala is the early-spring Western dry-fly hatch — small olive-green stone. Best on Bitterroot, Yakima, Madison sections.' },
      ];
    case 'west-alpine-lake':
      return [
        { title: 'Cutthroat / Brookie Dries on Alpine Lake', target: 'Cutthroat / Brook Trout / Golden Trout', when: 'July – September (ice-out to ice-on)', technique: 'Fly: #14–18 Adams, Royal Wulff, Parachute Adams, Elk Hair Caddis. Spin: 1/16-oz inline spinner (Panther Martin, Mepps).', where: 'Shoreline inlet/outlet, lily pad fields, weed edges, drop-offs.', details: `${name} is an alpine Western lake — typical species are native cutthroat, planted brook trout, occasional golden trout (CA Sierra + WY Wind Rivers + UT high lakes). Often hike-in.` },
        { title: 'Streamers for Trophy Lake Trout / Bigger Cutts', target: 'Cutthroat + Lake Trout', when: 'June + September', technique: 'Sink-tip + small streamers (Wooly Bugger, Sculpzilla, leech patterns) in olive/black/maroon.', where: 'Drop-offs near inlets, deeper basins.', details: 'Alpine fish are size-stunted in many lakes; in bigger basins lake-run cutts + lakers reach trophy size.' },
        { title: 'Damsel Hatch — Sub-Alpine Lakes', target: 'Trout', when: 'July', technique: 'Fly: #10–12 damsel nymph (olive, swimming retrieve) + adult damsel dry.', where: 'Weed edges + shorelines.', details: 'Damsel emergence on lower alpine lakes brings cruising trout to the surface.' },
      ];
    case 'west-spring-creek':
      return [
        { title: 'Spring Creek Sight-Cast — Technical Dries', target: 'Trout (Rainbow + Brown + Cutthroat)', when: 'Year-round; peak May – October', technique: 'Fly: small dries matched to hatch — #18–22 BWO, #16–18 PMD, #16–18 caddis, #20 trico, #20 midge. 6X-7X tippet. Long fine leaders.', where: 'Clear spring-water riffles + slow runs. Sight-cast individual fish.', details: `${name} is a Western spring creek — Armstrong, Nelson, DePuy (Paradise Valley MT), Silver Creek (ID), Henry's Lake outlet, Hot Creek (CA). Gin-clear water + tough fish + technical hatch matching.` },
        { title: 'Scud + Sowbug + Midge Nymphing', target: 'Trout', when: 'Year-round', technique: 'Fly: #14–18 scuds + sowbugs + #18–22 zebra midges under tiny indicator or sight-nymphed.', where: 'Riffles + slow runs.', details: 'Spring creeks have constant 50–55°F water + dense forage; small subsurface bugs are foundation.' },
      ];
    case 'pacific-salmon-river':
      return [
        { title: 'Spring Chinook — Run Timing', target: 'Spring Chinook (King) Salmon', when: 'March – June, varies by river', technique: 'Side-drifting cured roe (eggs) on bobber, plugs (Kwikfish + sardine wraps), spinners. Trolling plugs in lower rivers.', where: 'Pool tail-outs + holding lies + lower-river slack water.', details: `${name} is a Pacific salmon river — Columbia, Klamath, Rogue, Umpqua, Skagit, Sandy, Smith, Eel, Trinity, Russian, Sacramento. Spring Chinook arrive March-June.` },
        { title: 'Summer Steelhead', target: 'Summer Steelhead', when: 'April – October peak; varies by river', technique: 'Float + jig (1/8–1/4 oz under bobber). Swing flies on Spey rod. Side-drift egg patterns.', where: 'Steelhead runs (pool tail-outs + boulder pockets).', details: 'Summer steelhead enter rivers and hold for months — Deschutes, Klickitat, Rogue famous.' },
        { title: 'Fall Chinook + Coho', target: 'Fall Chinook + Coho Salmon', when: 'August – November', technique: 'Bobber + egg, plugs, spinners; flossing in lower rivers (legal in some).', where: 'Lower-river holding pools + bay edges.', details: 'Fall salmon — most accessible. Chinook bigger; Coho more aggressive.' },
        { title: 'Winter Steelhead', target: 'Winter Steelhead', when: 'December – April', technique: 'Float + jig (pink, orange), drift fishing cured roe + bait, swinging streamers + Intruder patterns on Spey.', where: 'Holding water in fresh winter water flows.', details: 'PNW winter steelhead — the chrome obsession. Wading in cold rain. Worth it.' },
        { title: 'Sockeye + Pink Pulses', target: 'Sockeye Salmon and Pink Salmon (odd years)', when: 'Sockeye June-August; Pink late summer odd years', technique: 'Sockeye: slow bottom-bouncing bare hooks + flies (sock-eye flies). Pink: spinners + spoons.', where: 'Holding water + flow concentrations.', details: 'Sockeye = pure protein, not aggressive — flossing common. Pink runs are odd-year explosions (WA + AK).' },
      ];
    case 'pacific-steelhead-stream':
      return [
        { title: 'Winter Steelhead — Float and Jig', target: 'Winter Steelhead', when: 'December – April', technique: 'Float + 1/8–1/4 oz pink/orange/peach jigs under bobber. Wading the run + adjusting depth.', where: 'Holding water in pool tail-outs + boulder pockets after fresh winter flows.', details: `${name} is a Pacific steelhead stream — wild winter chrome fish.` },
        { title: 'Summer Steelhead — Skating Dries + Swung Flies', target: 'Summer Steelhead', when: 'July – October', technique: 'Fly: skated muddlers + waking flies (Bombers, Greased Liners). Two-handed Spey + small steelhead streamer.', where: 'Runs + tail-outs.', details: 'Summer steelhead come to the surface — the dry-fly steelhead game (Deschutes, Klickitat, North Umpqua).' },
        { title: 'Trout in Resident Sections', target: 'Resident Rainbow + Cutthroat', when: 'Spring – Fall', technique: 'Dry-fly + nymph standard Western trout.', where: 'Headwaters + tributaries.', details: 'Same river often has resident trout + anadromous fish.' },
      ];
    case 'desert-reservoir':
      return [
        { title: 'Striped Bass — Live Anchovy / Trolling', target: 'Striped Bass', when: 'Year-round; peak summer schooling', technique: 'Trolling Bomber Long-A or Pencil Popper; live anchovies on live-bait rigs; surface poppers on schooling fish.', where: 'Main-lake humps, points, breaks in 30–60 ft.', details: `${name} is a Western desert reservoir — Powell, Mead, Mohave, Havasu (CO River system). Stripers + smallmouth + largemouth + crappie + walleye + cats.` },
        { title: 'Smallmouth + Largemouth on Rock', target: 'Smallmouth + Largemouth Bass', when: 'Year-round; peak spring + fall', technique: 'Drop-shot, shaky head, jerkbaits, swimbaits on rock + ledges. Topwater (Spook, Whopper Plopper) on schooling fish.', where: 'Main-lake rock structure, bluff walls, points.', details: 'Desert reservoirs have clear deep water + lots of rock — perfect smallmouth + spotted bass habitat.' },
        { title: 'Walleye — Mid-Lake Humps', target: 'Walleye', when: 'Year-round; peak spring', technique: 'Trolling bottom-bouncer + crawler harness; jigging in winter.', where: 'Mid-lake humps + flats off main channel.', details: 'Powell + Mead + Mohave all hold walleye.' },
        { title: 'Crappie + Bluegill', target: 'Crappie + Bluegill', when: 'Spring spawn + year-round', technique: 'Long-pole jigging brush; live bait on light gear.', where: 'Brushy coves + back-of-canyon brush.', details: 'Desert reservoir crappie + panfish in the side canyons.' },
        { title: 'Trophy Striper — Live Bait Trolling', target: 'Striped Bass (Trophy)', when: 'Spring + fall', technique: 'Live shad or anchovy on down-rods over the river channel.', where: 'Main river channel.', details: 'Trophy stripers stack in deep cold water year-round on Mead + Mohave.' },
      ];
    case 'high-desert-lake':
      return [
        { title: 'Trout (Stocked + Native Cutthroat) on Light Tackle', target: 'Trout (Rainbow + Brown + Cutthroat) + Kokanee Salmon', when: 'Year-round (ice fishing winter on many)', technique: 'Trolling cowbells + worms; small inline spinners; PowerBait off the bottom; jigging in winter.', where: 'Shoreline drop-offs, mid-lake basins, inlet/outlet zones.', details: `${name} is a Western high-desert lake — Henrys Lake, Eagle Nest, Heron, Cochiti, Strawberry, Flaming Gorge. Trout-stocked; some hold trophy lake-run cutts + browns + kokanee.` },
        { title: 'Damsel + Callibaetis — Lake Mayflies', target: 'Trout', when: 'June – August', technique: 'Fly: #12–14 olive damsel nymph + dry; #14–16 callibaetis dun.', where: 'Weed edges, shoreline shallows.', details: 'Hatches happen on Western lakes too — Callibaetis on Hebgen, Henrys Lake; damsels nearly everywhere.' },
        { title: 'Ice Fishing — Winter Lake Trout + Kokanee', target: 'Lake Trout + Kokanee + Cutthroat', when: 'December – March (where lakes freeze)', technique: 'Jigging spoons + tube jigs tipped with cut bait. Tip-ups for lakers.', where: 'Deep basin holes.', details: 'Western lake ice fishing — particularly on Strawberry (UT), Henrys Lake (ID), Eagle Nest (NM).' },
      ];
    case 'great-basin-lake':
      return [
        { title: 'Trophy Lahontan Cutthroat — Pyramid Style', target: 'Lahontan Cutthroat Trout', when: 'October – May; peak fall + winter', technique: 'Pyramid-style: 12-ft ladders on the beach; trolling Tasmanian Devils + Lyman plugs; fly stripping leech + minnow patterns on sinking line.', where: 'Drop-offs off rocky points; submerged volcanic structure.', details: `${name} is a Great Basin lake — Pyramid, Walker, Tahoe (CA/NV). Pyramid holds the trophy Lahontan cutthroat strain (20–25+ lb fish realistic — world\'s largest cutthroat).` },
        { title: 'Lake Trout / Mackinaw — Tahoe', target: 'Lake Trout (Mackinaw)', when: 'Year-round; peak spring + fall', technique: 'Trolling at depth (60–200+ ft) with downriggers. Jigging tubes.', where: 'Deep main-lake basins.', details: 'Tahoe mackinaw — trophy lake trout fishery, deep cold water.' },
        { title: 'Kokanee Salmon', target: 'Kokanee Salmon', when: 'May – September', technique: 'Trolling small spinners + dodgers at thermocline depth.', where: 'Mid-lake suspended over deep water.', details: 'Kokanee (landlocked sockeye) — staple on many Western lakes.' },
      ];
    case 'pacific-coast-saltwater':
      return [
        { title: 'Surf Perch + Striped Bass', target: 'Surf Perch and Striped Bass', when: 'Year-round; striper peak spring + fall', technique: 'Surf perch: sand crabs or grubs on size 4–6 hooks with high-low rigs. Stripers: heavy swimbaits, Hopkins jigs, eels (live).', where: 'Sandy beaches + rocky points + jetty surf zones.', details: `${name} is Pacific Coast surf + nearshore — CA + OR + WA shoreline. Surfperch, striped bass, lingcod, rockfish, halibut, salmon.` },
        { title: 'Rockfish + Lingcod — Nearshore Bottom', target: 'Rockfish + Lingcod + Cabezon', when: 'Year-round (check seasons)', technique: 'Drop shrimp flies + jigs on heavy gear. Squid strips on bottom rigs.', where: 'Rocky bottoms + kelp beds 30–150 ft.', details: 'Pacific bottom fishing — diverse rockfish species + lingcod = best-eating West Coast fish.' },
        { title: 'Halibut (Pacific) — Drift Bottom', target: 'Pacific Halibut + California Halibut', when: 'Pacific halibut May – September (regulated); CA halibut year-round', technique: 'Drifting whole anchovies or squid on heavy gear. Bouncing jigs.', where: 'Sand bottoms 60–200 ft; nearshore for CA halibut.', details: 'Trophy flatfish — Pacific halibut to 300+ lb (Alaska is bigger; WA gets them); CA halibut to 40+ lb.' },
        { title: 'Salmon — Nearshore Trolling', target: 'Chinook + Coho Salmon', when: 'Spring/summer/fall depending on season', technique: 'Trolling herring, anchovies, hoochies, spoons. Mooching live bait.', where: 'Nearshore 0–10 mi off the coast.', details: 'Pacific salmon — gulls + bait + drop-rigger zones.' },
      ];
    case 'pacific-coast-pier':
      return [
        { title: 'Pier Fishing Mix', target: 'Mackerel + Halibut + Surfperch + Sharks', when: 'Year-round', technique: 'Mackerel: Sabiki rigs. Halibut: live anchovies + squid strips. Surfperch: small hooks + sand crabs. Sharks: cut bait + heavy gear.', where: 'Public ocean piers along the Pacific coast.', details: `${name} is a Pacific Coast pier — mackerel, halibut, surfperch, sharks, smelt, occasional white seabass + yellowtail (south CA).` },
      ];
    case 'pacific-offshore':
      return [
        { title: 'Albacore + Bluefin Tuna', target: 'Albacore + Bluefin Tuna', when: 'July – October peak (varies by year)', technique: 'Trolling cedar plugs + bird-rigged feathers; live anchovies + sardines on chunked-up tuna.', where: 'Bluewater 20–80 mi offshore.', details: `${name} is Pacific offshore — albacore, bluefin, yellowfin (some years), mahi (warm-water years), salmon, halibut (PNW), white seabass + yellowtail (S. CA).` },
        { title: 'Salmon Trolling — Offshore', target: 'Chinook + Coho Salmon', when: 'May – October', technique: 'Down-rigger trolling herring + hoochies + spoons.', where: 'Salmon zones 1–10 mi off coast.', details: 'Pacific Coast salmon trolling.' },
      ];
    case 'pacific-bay':
      return [
        { title: 'Striped Bass / Surf Perch / Sturgeon (SF Bay)', target: 'Striped Bass + Surf Perch + White Sturgeon', when: 'Year-round; sturgeon winter peak', technique: 'Stripers: live bait + plastics + plugs. Sturgeon: ghost shrimp + mud shrimp + grass shrimp on slip-sinker rigs.', where: 'Bay channels + tide rips + bait stacks.', details: `${name} is a Pacific bay — SF Bay, Tomales, Humboldt, Coos, Tillamook, Willapa, Puget Sound. Salmon + striper + halibut + sturgeon + flounder + rockfish.` },
        { title: 'Salmon — Bay Mooching', target: 'Chinook + Coho Salmon', when: 'Summer + fall', technique: 'Mooching herring on knock-down rods.', where: 'Bay entrance + tide rip lines.', details: 'Salmon hold at bay mouths during runs.' },
        { title: 'Dungeness Crab (Where Legal)', target: 'Dungeness Crab', when: 'November – June (check region)', technique: 'Crab pots + snares from pier or boat.', where: 'Bay channels + nearshore.', details: 'Pacific Northwest dungeness — heavy regs.' },
        { title: 'Halibut (Pacific Bays)', target: 'Pacific Halibut', when: 'May – September', technique: 'Drifting whole anchovies + squid on heavy gear.', where: 'Bay channels + sand bottoms.', details: 'Halibut + flatfish in Pacific bays — Puget Sound especially.' },
      ];
    case 'west-warmwater-river':
      return [
        { title: 'Smallmouth + Largemouth in Big Rivers', target: 'Smallmouth + Largemouth Bass', when: 'May – October', technique: 'Tubes, Ned rigs, square-bills, soft-plastic jerkbaits. Topwater dawn/dusk.', where: 'Rock + current breaks + slack pools.', details: `${name} is a Western warmwater river — Lower Snake, Lower Columbia, San Joaquin, Rio Grande lower, Pecos lower. Smallmouth + largemouth + walleye + cats + occasional steelhead.` },
        { title: 'Walleye — Sand Channel', target: 'Walleye', when: 'Spring + fall', technique: 'Trolling bottom-bouncer + crawler harness; jigging.', where: 'Main river channel + sandbar drop-offs.', details: 'Lower Columbia + Snake walleye — accessible warmwater walleye.' },
        { title: 'Catfish + Sturgeon (Lower Columbia)', target: 'Catfish + White Sturgeon', when: 'Year-round (sturgeon C&R may apply)', technique: 'Cut bait + smelt + lamprey on heavy gear.', where: 'Deep holes.', details: 'Lower Columbia white sturgeon — trophy class fish (C&R + tagging rules).' },
      ];
    case 'mountain-meadow-stream':
      return [
        { title: 'Small-Stream Cutthroat / Brookie on Dries', target: 'Cutthroat / Brook Trout / Rainbow', when: 'June – October', technique: 'Fly: #14–16 Adams, Royal Wulff, Parachute Adams, Elk Hair Caddis. Spin: 1/16-oz Mepps/Panther Martin.', where: 'Plunge pools + undercut banks + log-jam pockets.', details: `${name} is a Western high-meadow / small mountain stream — native cutthroat + brookies. Short technical drifts; stealth + small flies.` },
        { title: 'Hopper-Dropper Summer', target: 'Trout', when: 'July – September', technique: 'Fly: small foam hopper (#10–14) + small bead-head dropper (#16–18).', where: 'Bank seams + soft pockets.', details: 'Standard small-stream summer rig.' },
      ];
  }
  return [];
}

function makeSpecies(cat) {
  switch (cat) {
    case 'west-tailwater-trout':
      return [
        { name: 'Rainbow Trout', importance: 'signature', size: '12–18"; trophy holdover 20+"', notes: 'Heavily stocked + wild reproducing; tailwater foundation.' },
        { name: 'Brown Trout', importance: 'signature', size: '14–22"; trophy 26+"', notes: 'Wild reproducing in most Western tailwaters.' },
        { name: 'Cutthroat Trout', importance: 'strong', size: '12–18"', notes: 'Native in some tailwaters (Snake River system).' },
        { name: 'Mountain Whitefish', importance: 'good', size: '10–18"', notes: 'Native Western salmonid — often caught on nymphs.' },
      ];
    case 'west-freestone-trout':
      return [
        { name: 'Rainbow Trout', importance: 'signature', size: '12–18"; trophy 20+"', notes: 'Wild + stocked.' },
        { name: 'Brown Trout', importance: 'signature', size: '12–20"; trophy 24+"', notes: 'Wild reproducing; trophy potential in deep pools.' },
        { name: 'Cutthroat Trout', importance: 'signature', size: '10–18"', notes: 'Native — Yellowstone cutthroat, Westslope cutthroat, Bonneville, Rio Grande, Greenback, Lahontan all distinct subspecies.' },
        { name: 'Brook Trout', importance: 'strong', size: '8–14"', notes: 'In high-elevation reaches.' },
        { name: 'Mountain Whitefish', importance: 'strong', size: '10–18"', notes: 'Native Western salmonid.' },
      ];
    case 'west-alpine-lake':
      return [
        { name: 'Cutthroat Trout', importance: 'signature', size: '8–14"', notes: 'Native to most alpine waters in MT/WY/ID/UT/CO/NM.' },
        { name: 'Brook Trout', importance: 'signature', size: '7–11"', notes: 'Stocked in many high lakes.' },
        { name: 'Golden Trout', importance: 'good', size: '7–12"', notes: 'CA Sierra + WY Wind Rivers + UT high lakes — golden trout endemic to specific basins.' },
        { name: 'Rainbow Trout', importance: 'good', size: '10–14"', notes: 'Stocked.' },
      ];
    case 'west-spring-creek':
      return [
        { name: 'Rainbow Trout', importance: 'signature', size: '12–18"; trophy 22+"', notes: 'Wild + technical fish.' },
        { name: 'Brown Trout', importance: 'signature', size: '12–22"; trophy 26+"', notes: 'Wild reproducing.' },
        { name: 'Cutthroat Trout', importance: 'strong', size: '12–18"', notes: 'Native or hybrid in some.' },
        { name: 'Brook Trout', importance: 'good', size: '8–12"', notes: 'In headwater spring creeks.' },
      ];
    case 'pacific-salmon-river':
      return [
        { name: 'Chinook (King) Salmon', importance: 'signature', size: 'Spring 15–30 lb; fall 20–50 lb', notes: 'Spring + fall runs.' },
        { name: 'Coho (Silver) Salmon', importance: 'signature', size: '6–15 lb', notes: 'Fall run; very aggressive.' },
        { name: 'Steelhead', importance: 'signature', size: '6–15 lb; trophy 20+ lb', notes: 'Summer + winter runs.' },
        { name: 'Sockeye (Red) Salmon', importance: 'strong', size: '4–8 lb', notes: 'Summer; bright red flesh.' },
        { name: 'Pink (Humpy) Salmon', importance: 'good', size: '3–6 lb', notes: 'Odd-year August (WA + AK).' },
        { name: 'Chum (Dog) Salmon', importance: 'good', size: '8–15 lb', notes: 'Fall + winter; lesser target.' },
        { name: 'Resident Rainbow + Cutthroat', importance: 'good', size: '8–14"', notes: 'In tributaries + headwaters.' },
      ];
    case 'pacific-steelhead-stream':
      return [
        { name: 'Winter Steelhead', importance: 'signature', size: '6–15 lb; trophy 20+ lb', notes: 'Dec – April peak.' },
        { name: 'Summer Steelhead', importance: 'signature', size: '5–12 lb', notes: 'April – October; longer river time.' },
        { name: 'Resident Trout (Rainbow + Cutthroat)', importance: 'good', size: '8–14"', notes: 'Headwaters + tributaries.' },
      ];
    case 'desert-reservoir':
      return [
        { name: 'Striped Bass', importance: 'signature', size: '5–30 lb; trophy 50+ lb', notes: 'Powell/Mead/Mohave trophy striper destination.' },
        { name: 'Smallmouth Bass', importance: 'signature', size: '1.5–4 lb', notes: 'Clear-water rock fishery.' },
        { name: 'Largemouth Bass', importance: 'strong', size: '2–5 lb', notes: 'Brush + canyon arms.' },
        { name: 'Walleye', importance: 'strong', size: '14–22"', notes: 'Sandbar humps + drop-offs.' },
        { name: 'Crappie', importance: 'strong', size: '0.5–1.5 lb', notes: 'Spring + brush piles.' },
        { name: 'Catfish (Channel + Flathead)', importance: 'good', size: 'Trophy 20–40 lb', notes: 'Channel cats + flatheads.' },
        { name: 'Kokanee Salmon', importance: 'good', size: '1–3 lb', notes: 'Stocked in many.' },
      ];
    case 'high-desert-lake':
      return [
        { name: 'Rainbow Trout', importance: 'signature', size: '10–18"; trophy lake-runs 5+ lb', notes: 'Stocked + holdovers.' },
        { name: 'Brown Trout', importance: 'signature', size: '14–24"; trophy 28+"', notes: 'Wild reproducing in some.' },
        { name: 'Cutthroat Trout', importance: 'signature', size: '12–20"; trophy 25+"', notes: 'Bonneville/Yellowstone/Lahontan subspecies depending on lake.' },
        { name: 'Lake Trout (Mackinaw)', importance: 'strong', size: '5–25 lb; trophy 30+ lb', notes: 'In deeper Western lakes (Flaming Gorge, Tahoe).' },
        { name: 'Kokanee Salmon', importance: 'strong', size: '1–3 lb', notes: 'Landlocked sockeye; stocked widely.' },
        { name: 'Yellow Perch + Smallmouth Bass', importance: 'good', size: 'Varied', notes: 'In warmer Western lakes.' },
      ];
    case 'great-basin-lake':
      return [
        { name: 'Lahontan Cutthroat Trout', importance: 'signature', size: 'Pyramid trophies 15–25+ lb', notes: 'World\'s largest cutthroat strain — Pyramid Lake.' },
        { name: 'Lake Trout (Mackinaw)', importance: 'signature', size: '10–30+ lb (Tahoe)', notes: 'Tahoe trophy laker fishery.' },
        { name: 'Kokanee Salmon', importance: 'strong', size: '1–3 lb', notes: 'Tahoe + other Great Basin lakes.' },
        { name: 'Brown Trout', importance: 'strong', size: '15–25"; trophy 28+"', notes: 'Wild reproducing in some.' },
        { name: 'Sacramento Perch', importance: 'good', size: '8–14"', notes: 'Pyramid endemic + a few others.' },
        { name: 'Tui Chub', importance: 'present', size: 'Forage', notes: 'Native Great Basin baitfish.' },
      ];
    case 'pacific-coast-saltwater':
      return [
        { name: 'Lingcod', importance: 'signature', size: '5–25 lb; trophy 30+ lb', notes: 'Premier West Coast bottom fish.' },
        { name: 'Rockfish (multiple species)', importance: 'signature', size: '1–10 lb', notes: 'Black, blue, vermilion, copper, canary, etc.' },
        { name: 'Striped Bass (CA)', importance: 'strong', size: '5–30 lb; trophy 40+ lb', notes: 'CA + SF Bay especially.' },
        { name: 'Chinook + Coho Salmon', importance: 'strong', size: '8–30 lb', notes: 'Nearshore in season.' },
        { name: 'Halibut (Pacific + CA)', importance: 'strong', size: '15–80 lb', notes: 'Pacific halibut PNW; CA halibut central CA.' },
        { name: 'Surfperch', importance: 'good', size: '8–14"', notes: 'Surf staple.' },
        { name: 'Cabezon', importance: 'good', size: '3–8 lb', notes: 'Rock + kelp.' },
        { name: 'White Seabass (S CA)', importance: 'good', size: '20–50 lb', notes: 'Southern CA specialty.' },
        { name: 'Yellowtail (S CA)', importance: 'good', size: '15–40 lb', notes: 'Southern CA + Baja-style.' },
      ];
    case 'pacific-coast-pier':
      return [
        { name: 'Surfperch', importance: 'signature', size: '8–14"', notes: 'Surf + pier mainstay.' },
        { name: 'Mackerel', importance: 'signature', size: '1–3 lb', notes: 'Schools through.' },
        { name: 'Halibut (CA)', importance: 'strong', size: '15–40 lb', notes: 'Live bait near pilings.' },
        { name: 'Rockfish', importance: 'strong', size: '1–5 lb', notes: 'Pier rocks.' },
        { name: 'Sharks (Leopard, Sand)', importance: 'good', size: '2–10 lb', notes: 'Heavy bait.' },
        { name: 'Smelt + Anchovies', importance: 'good', size: 'Forage', notes: 'Sabiki rigs.' },
      ];
    case 'pacific-offshore':
      return [
        { name: 'Albacore Tuna', importance: 'signature', size: '15–30 lb', notes: 'Summer/fall warm-water years.' },
        { name: 'Bluefin Tuna', importance: 'signature', size: '20–250+ lb', notes: 'Trophy bluefin off CA in recent years.' },
        { name: 'Chinook Salmon (Offshore Trolling)', importance: 'strong', size: '10–30 lb', notes: 'Down-rigger trolling.' },
        { name: 'Yellowtail (S CA)', importance: 'strong', size: '15–40 lb', notes: 'Southern CA islands.' },
        { name: 'Mahi-Mahi (Warm Years)', importance: 'good', size: '5–20 lb', notes: 'Warm-water years off SoCal.' },
        { name: 'White Seabass', importance: 'good', size: '20–50 lb', notes: 'Squid bite.' },
        { name: 'Halibut (Pacific)', importance: 'good', size: '20–100+ lb', notes: 'PNW especially.' },
      ];
    case 'pacific-bay':
      return [
        { name: 'Striped Bass (CA Bays)', importance: 'signature', size: '5–30 lb', notes: 'SF Bay especially.' },
        { name: 'Chinook + Coho Salmon', importance: 'signature', size: '8–30 lb', notes: 'Bay-mouth holding.' },
        { name: 'White Sturgeon', importance: 'strong', size: '30–80"; trophy 80+", 100+ lb', notes: 'SF Bay sturgeon — C&R/tagging rules.' },
        { name: 'Halibut (CA + Pacific)', importance: 'strong', size: '15–60 lb', notes: 'Bay channels.' },
        { name: 'Dungeness Crab', importance: 'strong', size: 'Legal at carapace width', notes: 'Pacific NW + N CA.' },
        { name: 'Flounder + Surfperch', importance: 'good', size: 'Standard', notes: 'Bay-side mix.' },
        { name: 'Rockfish + Lingcod', importance: 'good', size: 'Varied', notes: 'Bay-rock areas.' },
      ];
    case 'west-warmwater-river':
      return [
        { name: 'Smallmouth Bass', importance: 'signature', size: '1.5–4 lb', notes: 'Wild Western warmwater rivers.' },
        { name: 'Largemouth Bass', importance: 'strong', size: '2–5 lb', notes: 'Slack water.' },
        { name: 'Walleye', importance: 'strong', size: '14–22"', notes: 'Lower Columbia + Snake.' },
        { name: 'Catfish (Channel)', importance: 'strong', size: '2–8 lb', notes: 'Deep holes.' },
        { name: 'White Sturgeon (Lower Columbia)', importance: 'good', size: '30–80"; trophy class', notes: 'Tagged C&R fishery.' },
        { name: 'Steelhead + Salmon (Some Reaches)', importance: 'good', size: 'Migratory', notes: 'Snake + Columbia tribs.' },
      ];
    case 'mountain-meadow-stream':
      return [
        { name: 'Cutthroat Trout', importance: 'signature', size: '7–14"', notes: 'Native — subspecies depends on basin.' },
        { name: 'Brook Trout', importance: 'signature', size: '6–11"', notes: 'Stocked + reproducing in high meadows.' },
        { name: 'Rainbow Trout', importance: 'strong', size: '8–13"', notes: 'Stocked + some wild.' },
        { name: 'Mountain Whitefish', importance: 'good', size: '8–14"', notes: 'Native.' },
      ];
  }
  return [];
}

function makeSig(cat) {
  switch (cat) {
    case 'west-tailwater-trout': return ['Trout (Rainbow + Brown)'];
    case 'west-freestone-trout': return ['Wild Trout (Rainbow + Brown + Cutthroat)'];
    case 'west-alpine-lake': return ['Cutthroat + Brook Trout'];
    case 'west-spring-creek': return ['Trout (Spring Creek Technical)'];
    case 'pacific-salmon-river': return ['Chinook + Coho Salmon + Steelhead'];
    case 'pacific-steelhead-stream': return ['Steelhead'];
    case 'desert-reservoir': return ['Striped Bass + Smallmouth Bass'];
    case 'high-desert-lake': return ['Trout (Rainbow + Brown + Cutthroat)'];
    case 'great-basin-lake': return ['Lahontan Cutthroat / Lake Trout'];
    case 'pacific-coast-saltwater': return ['Lingcod + Rockfish + Salmon'];
    case 'pacific-coast-pier': return ['Surfperch + Halibut'];
    case 'pacific-offshore': return ['Albacore + Bluefin Tuna + Salmon'];
    case 'pacific-bay': return ['Striped Bass + Salmon + Halibut'];
    case 'west-warmwater-river': return ['Smallmouth Bass + Walleye'];
    case 'mountain-meadow-stream': return ['Cutthroat + Brook Trout'];
  }
  return [];
}

function makeType(cat) {
  switch (cat) {
    case 'west-tailwater-trout': return 'tailwater';
    case 'west-freestone-trout':
    case 'pacific-salmon-river':
    case 'pacific-steelhead-stream':
    case 'west-spring-creek':
    case 'west-warmwater-river':
    case 'mountain-meadow-stream':
      return 'river';
    case 'west-alpine-lake':
    case 'high-desert-lake':
    case 'great-basin-lake':
    case 'desert-reservoir':
      return 'natural-lake';
    case 'pacific-coast-saltwater':
    case 'pacific-coast-pier':
    case 'pacific-offshore':
    case 'pacific-bay':
      return 'saltwater';
  }
  return 'river';
}

function buildWest({ state, id, name, region, county, acres, maxDepthFt, lat, lng, cat, notes }) {
  return {
    id,
    name,
    state,
    region,
    type: makeType(cat),
    county,
    acres: acres ?? null,
    maxDepthFt: maxDepthFt ?? null,
    lat, lng,
    signatureSpecies: makeSig(cat),
    species: makeSpecies(cat),
    patterns: makePatterns(cat, name),
    access: [`Public access — see state Fish & Wildlife agency atlas (${state} FWP / IDFG / WGFD / CPW / UDWR / NDOW / AZGFD / NMDGF / WDFW / ODFW / CDFW) for ramps + piers + shoreline`],
    regulations: `${state} fishing license required. Trout permit/stamp + special tags on regulated waters. Anadromous (salmon/steelhead) endorsements required PNW. Check state agency for current regulations.`,
    managementProgram: [`${state} state agency management`],
    notes: notes || `${name} — ${cat.replace(/-/g, ' ')} character Western water.`,
  };
}

module.exports = { buildWest };
