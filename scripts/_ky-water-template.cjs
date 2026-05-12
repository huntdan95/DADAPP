// Kentucky waterbody template engine.
// Categories encode KY's distinctive fishing identity AND embed hatch data
// (the user specifically asked for fly hatch info — KY shares Appalachian +
//  Cumberland Plateau hatches with TN and NC).
//
//  - ky-cumberland-tailwater: Cumberland River below Wolf Creek Dam.
//      THE marquee KY trout fishery. World-class brown trout, full hatch
//      calendar (sulphurs, white flies, tricos, cicada brood years).
//  - ky-tailwater-trout: Other KY trout tailwaters (Cave Run, Laurel,
//      Paintsville, Buckhorn, Barren, Carr Creek, Green) - stocked + holdovers.
//  - ky-major-reservoir: Kentucky Lake, Barkley, Cumberland, Cave Run, Laurel,
//      Nolin, Rough, Green, Barren, Taylorsville - tournament-class multispecies.
//  - ky-state-park-lake: KY state-park-managed lakes (Dewey, Greenbo, Grayson,
//      Yatesville, Carr Creek, Buckhorn, Paintsville, Pennyrile, Pewee, etc.)
//  - ky-bluegrass-smallmouth-river: KY River + 3 forks, Licking, Salt, Red,
//      Rockcastle - signature wild smallmouth river fishery with hellgrammite +
//      crayfish + Hex hatches on bigger pools.
//  - ky-green-river: Green, Barren, Nolin, Pond - Mammoth Cave system smallmouth.
//  - ky-eastern-river: Big Sandy, Levisa Fork, Tug Fork, upper Cumberland - Appalachian smallmouth.
//  - ky-ohio-river: KY/IN/OH border - trophy blue cats, sauger, paddlefish, hybrid stripers.
//  - ky-fins-pond: KDFWR "Fishing in Neighborhoods" urban community pond.

function makePatterns(cat, name) {
  switch (cat) {
    case 'ky-cumberland-tailwater':
      return [
        { title: 'Sulphur Hatch (Cumberland Mayfly)', target: 'Brown Trout and Rainbow Trout', when: 'Mid-May – late June, peak last 2 hours before dark', technique: 'Fly: #14–18 sulphur dun, sulphur emerger, sulphur spinner. Dead-drift the dun in surface film; swing the emerger through riffles. 6X tippet.', where: 'Riffle-pool transitions, slick tailouts, current seams from Hatchery Creek down through Helms Landing.', details: `${name} sulphur hatch (Ephemerella invaria/dorothea) — one of THE Eastern hatches. Trophy browns key on emergers and spinners at last light. Match size as the hatch progresses through May–June (16s early, 18s later).` },
        { title: 'White Fly Hatch (Cumberland Summer Spinner Fall)', target: 'Brown Trout and Rainbow Trout', when: 'August – early September; lasts ~3 weeks; emerges at dusk', technique: 'Fly: #12–14 white wulff, white parachute, sparse white spinner. Cast upstream of rising fish — drag-free drift. Spinner falls right at dark.', where: 'Slow runs and tailouts downstream of the dam.', details: 'Ephoron leukon white fly hatch — late-summer specialty. Females emerge already mated and lay eggs immediately; spinner fall is the event. Crowds gather; trophy browns rise in shallow water.' },
        { title: 'Trico Morning (Tiny Mayfly Spinner)', target: 'Trout', when: 'July – September, 7–10 AM', technique: 'Fly: #20–24 trico spinner. 7X tippet. Long fine leaders, low-and-slow casts in slow water.', where: 'Slow flats, eddies, slick water sections.', details: 'Tricorythodes spinner fall — the tough technical morning game. Tiny flies, picky fish, but it works.' },
        { title: 'BWO (Blue Wing Olive)', target: 'Trout', when: 'October – April; emerges through cool months on cloudy days', technique: 'Fly: #18–22 BWO dun, RS-2, parachute Adams. Mid-morning to early afternoon.', where: 'Riffle-pool transitions.', details: 'Baetis BWO — the year-round hatch. Cloudy fall and spring days produce the best dry-fly action when little else hatches.' },
        { title: 'Caddis Hatch (Mother\'s Day Style)', target: 'Trout', when: 'April – May massive flurry; trickle through summer', technique: 'Fly: #14–18 elk hair caddis (tan, olive), LaFontaine sparkle pupa, X-caddis. Skitter or dead-drift.', where: 'Riffles + immediately downstream.', details: 'Brachycentrus + Hydropsyche caddis. Spring blanket hatches drive trout crazy; summer is more about evening sporadic emergence.' },
        { title: 'Cicada Emergence Years (Brood X / Brood XIV)', target: 'Brown Trout (Trophy)', when: 'Periodic 13/17-year emergences — late May/early June', technique: 'Fly: #4–8 cicada pattern (Project Cicada, Chernobyl ant in black/orange). Plop into bank seams; expect violent strikes.', where: 'Bank cover, current breaks under overhanging trees.', details: 'Kentucky\'s periodic cicada emergences are epic — trophy brown trout gorge on cicadas falling onto the water. Brood XIV was 2008/2025; Brood X was 2021. Check next emergence year.' },
        { title: 'Midges + Sowbugs — Year-Round Foundation', target: 'Trout', when: 'Year-round; best low/zero generation', technique: 'Two-fly nymph rig: zebra midge (#18–22) above grey scud or olive sowbug (#16–18). 6X tippet, strike indicator at 1.5× depth.', where: 'Riffle-pool transitions, slow tailouts.', details: 'Cold tailwater forage base — midges + sowbugs are bread-and-butter. Always works.' },
        { title: 'Streamer Game for Trophy Browns', target: 'Brown Trout (Trophy)', when: 'Fall – winter; high generation periods anytime', technique: 'Sink-tip line, articulated streamers (Sex Dungeon, Sculpzilla, Drunk & Disorderly) #2–6 in olive/black/white/yellow. Strip across bank seams; mend mid-strip.', where: 'Bank cuts, log jams, current breaks.', details: 'Cumberland holds reproducing wild browns to 30+ inches. Streamer game is the trophy game; high generation = aggressive predators.' },
        { title: 'San Juan Worm + Egg Patterns', target: 'Trout', when: 'High water + spring runoff', technique: 'Fly: #10–14 San Juan worm (red, pink, brown) under indicator; #14 egg patterns in spring.', where: 'Drift through deep slow pools after generation.', details: 'When the river\'s up + colored, worms get eaten. Easy, productive.' },
      ];
    case 'ky-tailwater-trout':
      return [
        { title: 'Midge Nymphing Year-Round', target: 'Trout (Rainbow + Brown)', when: 'Year-round; best low/zero generation', technique: 'Two-fly nymph rig: zebra midge (#18–22) + sowbug or scud (#16). 6X tippet, indicator.', where: 'Riffles, seams, tailouts.', details: `${name} is KY tailwater coldwater — midges and sowbugs are the foundation. Year-round reliable.` },
        { title: 'BWO + Sulphur Windows', target: 'Trout', when: 'BWO Oct–April; Sulphur May–June', technique: 'Fly: #18–22 BWO dun (cool months), #14–18 sulphur dun + emerger (May–June).', where: 'Quiet seams downstream of riffles.', details: 'Most KY tailwaters get the same hatches as the Cumberland — sulphur is the big spring hatch.' },
        { title: 'Streamer Game — High Water', target: 'Brown Trout', when: 'During or after generation', technique: 'Sink-tip + #4–8 streamers (Woolly Buggers, Sex Dungeons) in olive/black/white. Strip across seams.', where: 'Bank cuts, log jams.', details: 'When KY tailraces generate, bigger fish hunt aggressively.' },
        { title: 'Spin-Fishing the Tailrace', target: 'Trout', when: 'Year-round', technique: 'Inline spinners (Mepps Aglia #2, Roostertails 1/8 oz), salmon eggs, PowerBait. Cast across current.', where: 'Pool tail-outs, current breaks.', details: 'Easy gear for stocked rainbows; the occasional brown takes too.' },
      ];
    case 'ky-major-reservoir':
      return [
        { title: 'Ledge Fishing — Summer Bass', target: 'Largemouth and Smallmouth Bass', when: 'June – September', technique: 'Deep crankbaits (Strike King 6XD, 10XD), Carolina rigs, big worms (10" Power Worm), football jigs on main-river ledges in 12–25 ft.', where: 'River channel ledges, channel-swing points.', details: `${name} is classic KY reservoir water — Kentucky Lake, Barkley, Cumberland, Cave Run all have the ledge bite. Find shell beds + current = stacks of fish.` },
        { title: 'Spring Crappie Spawn', target: 'Crappie', when: 'March – May', technique: 'Long-pole jigging 1/16-oz jigs around brush; minnows + slip-cork in shallow spawn water.', where: 'Creek arms, shallow brush, cypress wood.', details: 'KY reservoirs are crappie factories — Kentucky Lake and Barkley especially produce slabs.' },
        { title: 'Striped Bass — Live Shad', target: 'Striped Bass', when: 'Year-round; peak May – October', technique: 'Live shad on down-rods at 25–50 ft over channel breaks. Big swimbaits + topwater (Spook, Pencil Popper) when fish surface.', where: 'Main-lake channel, mid-lake humps.', details: 'Cumberland, Cave Run, Laurel, Kentucky Lake all have stocked striper populations. Cumberland especially produces 30–40 lb fish.' },
        { title: 'Trophy Blue + Channel Catfish', target: 'Catfish', when: 'Year-round; trophy blues in winter', technique: 'Fresh cut skipjack or shad on Santee rigs. Drift channel ledges in summer/fall; anchor on deep winter holes.', where: 'Main-river channel.', details: 'Kentucky Lake + Barkley are world-class blue catfish water — 50–80+ lb fish realistic.' },
        { title: 'White Bass Spring Run', target: 'White Bass', when: 'March – April', technique: 'Small chrome/blue lipless cranks, in-line spinners, white grubs on 1/8-oz heads.', where: 'Tributary mouths at the upper end of the lake.', details: 'Bluegrass + western KY white bass spring runs are legendary on every river-system reservoir.' },
        { title: 'Smallmouth on Rock + Current', target: 'Smallmouth Bass', when: 'Year-round; peak fall – spring', technique: 'Drop-shot, jerkbaits (Megabass Vision 110), jigging spoons in winter, swimbaits.', where: 'Main-lake bluffs, channel-swing rock.', details: 'Cumberland, Cave Run, Laurel produce trophy smallmouth — clear deep highland-rim water.' },
        { title: 'Walleye / Sauger', target: 'Walleye and Sauger', when: 'Spring run + winter', technique: 'Jig + minnow off rocky points; bottom-bouncer + crawler harness; trolling deep cranks.', where: 'Riprap dam, main-river channel.', details: 'KDFWR stocks walleye on Cumberland, Laurel, Cave Run, Barren River. Sauger run up the Cumberland and Kentucky in late winter.' },
      ];
    case 'ky-state-park-lake':
      return [
        { title: 'KY State Park Family Fishery', target: 'Largemouth Bass, Bluegill, Channel Catfish', when: 'Year-round; rainbow trout stocked Oct–Apr on select lakes', technique: 'Worms + crickets for bream; chicken liver for cats; small jigs for bass. PowerBait for stocked trout.', where: 'Shoreline, fishing pier, dam.', details: `${name} is a KY state-park managed fishery — KDFWR stocks regularly, family-friendly access, some lakes get cold-month trout stockings.` },
        { title: 'Crappie Around Brush', target: 'Crappie', when: 'Spring spawn + year-round', technique: 'Long-pole jigging brush; minnows in spring shallow.', where: 'Brush piles + creek mouths.', details: 'Most KY state-park lakes have managed brush habitat.' },
      ];
    case 'ky-bluegrass-smallmouth-river':
      return [
        { title: 'Hellgrammite Patterns — Bluegrass Smallmouth', target: 'Smallmouth Bass', when: 'May – October', technique: 'Fly: #4–8 hellgrammite imitations (black, dark olive), conehead Woolly Buggers, Clouser Minnows. Spin: black/dark soft plastics on 1/8-oz jighead, dragged slow across rocky pools.', where: 'Rocky pools below shoals, current breaks.', details: `${name} is bluegrass-region wild smallmouth water — hellgrammites are the foundation forage. Match the bug with size, color, and slow presentation.` },
        { title: 'Crayfish Patterns — Year-Round Smallmouth', target: 'Smallmouth Bass', when: 'Year-round', technique: 'Tubes (3" pumpkin/brown/crawdad), Ned rigs, Texas-rigged craw plastics. Soft plastic flies (Whitlock\'s near-nuff crayfish).', where: 'Rocky riffles + pool tail-outs.', details: 'KY smallmouth eat crayfish 12 months a year — orange/rust/crawdad colors are killer.' },
        { title: 'Topwater Float Trip', target: 'Smallmouth Bass and Rock Bass', when: 'May – September, dawn + dusk', technique: 'Topwater: Pop-R, Whopper Plopper, Heddon Tiny Torpedo. Fly: poppers + small foam frogs.', where: 'Pool tail-outs, slick water above shoals.', details: 'Floating a Bluegrass river with topwater at dawn — KY smallmouth tradition.' },
        { title: 'Hex Hatch — Big-River Pools', target: 'Smallmouth Bass and Rock Bass', when: 'Late June – early July evenings', technique: 'Fly: #4–6 Hex dun + emerger. Cast quietly in fading light.', where: 'Big slow pools on Green, Kentucky, Barren, Licking.', details: 'Hexagenia hatch — KY rivers with the right silt bottoms produce hex emergences. Smallies and rockbass key on big mayflies.' },
        { title: 'Yellow Sally + Caddis Spring Hatch', target: 'Smallmouth and Rock Bass', when: 'April – June', technique: 'Fly: #14–16 elk hair caddis (tan), #14 yellow sally stonefly. Drift through riffles.', where: 'Riffle-pool transitions.', details: 'Spring caddis + small yellow stoneflies bring smallmouth and rock bass to the surface.' },
      ];
    case 'ky-green-river':
      return [
        { title: 'Mammoth Cave Country Smallmouth', target: 'Smallmouth Bass', when: 'May – October', technique: 'Float-fish tubes, Ned rigs, jerkbaits through pool-and-shoal sequence. Topwater dawn + dusk.', where: 'Pool tail-outs, current breaks below shoals.', details: `${name} is the Green/Barren/Nolin river system — premier KY smallmouth water. The Green especially is one of the most ecologically diverse rivers in America.` },
        { title: 'Spring Caddis Hatch', target: 'Smallmouth Bass and Rock Bass', when: 'April – June', technique: 'Fly: #14–16 elk hair caddis, X-caddis, LaFontaine sparkle pupa. Drift riffles.', where: 'Riffles and tailouts.', details: 'Green River caddis is a major spring event.' },
        { title: 'Crayfish + Hellgrammite Year-Round', target: 'Smallmouth Bass', when: 'Year-round', technique: 'Crayfish-pattern soft plastics (tubes, craws), black/olive hellgrammite flies, Clouser Minnows.', where: 'Rocky pools and shoals.', details: 'KY foundation forage — match the food base.' },
        { title: 'Rock Bass + Longear Sunfish Combo', target: 'Rock Bass and Sunfish', when: 'Spring – Fall', technique: 'Small flies (poppers, nymphs) and small inline spinners.', where: 'Pool edges, undercut banks.', details: 'Green River system has outstanding rockbass + longear populations — under-appreciated panfish.' },
        { title: 'Muskie — Green River Specialty', target: 'Muskie', when: 'Fall – early winter; spring', technique: 'Big swimbaits, bucktails, jerkbaits (Bull Dawg, large suick), figure-8 at boatside. 80–100 lb leader.', where: 'Deep pools, log jams.', details: 'Green River has a wild muskie population — KY\'s most consistent muskie river.' },
      ];
    case 'ky-eastern-river':
      return [
        { title: 'Appalachian Smallmouth + Spotted Bass', target: 'Smallmouth and Spotted Bass', when: 'May – October', technique: 'Float-fish: tubes, Ned rigs, jerkbaits, small swimbaits. Topwater at dawn + dusk.', where: 'Rocky riffle-pool transitions, current breaks.', details: `${name} is Eastern KY Appalachian smallmouth water — Big Sandy + Levisa + Tug + upper Cumberland system. Float culture.` },
        { title: 'Crayfish Patterns', target: 'Smallmouth Bass', when: 'Year-round', technique: 'Tubes + craw plastics + Clouser-style flies.', where: 'Rocky pools.', details: 'Eastern KY rivers feed bass crayfish year-round.' },
        { title: 'Spring Caddis + BWO', target: 'Smallmouth Bass and Rock Bass', when: 'April – May', technique: 'Fly: small dries (caddis, BWO) for surface activity.', where: 'Riffles.', details: 'Smaller hatches than the Cumberland — but trout-style fly tactics work for smallies.' },
      ];
    case 'ky-ohio-river':
      return [
        { title: 'Trophy Blue + Flathead Catfish', target: 'Catfish (Blue + Flathead)', when: 'Year-round; trophy blues in winter', technique: 'Fresh cut skipjack on Santee rigs (blues); live bluegill or chub for flatheads. Drift channel ledges or anchor on deep holes.', where: 'River-channel bends, lock-and-dam tailwaters, deep holes.', details: `${name} is part of the Ohio River — KY/IN/OH border. Trophy class — 50–80+ lb blues and flatheads realistic. Markland and McAlpine tailwaters especially productive.` },
        { title: 'Spring Sauger Run — Below Dams', target: 'Sauger', when: 'February – April', technique: 'Vertical jigging (1/4-oz jig + minnow) in current breaks; trolling crawlers in slack water.', where: 'McAlpine, Markland, Meldahl, Cannelton tailwaters.', details: 'Ohio River sauger runs — classic late-winter/early-spring fishery. KY anglers stack in tailwater current.' },
        { title: 'Paddlefish Snagging', target: 'Paddlefish', when: 'March – May', technique: 'Stout snag rod, weighted treble hooks (8/0–10/0), strong braid. Rip through the water column. KDFWR permit required.', where: 'Below McAlpine Dam, below Markland Dam.', details: 'Ohio River paddlefish — KY tradition. Massive fish during spring run.' },
        { title: 'Hybrid Stripers + White Bass', target: 'Hybrid Striped Bass and White Bass', when: 'Spring + fall', technique: 'Topwater, jigs, in-line spinners when fish surface; live shad when not.', where: 'Tailwaters + creek mouths.', details: 'Open-water schooling action.' },
      ];
    case 'ky-fins-pond':
      return [
        { title: 'KDFWR FINS Urban Pond', target: 'Channel Catfish, Bluegill, Largemouth Bass', when: 'Year-round; rainbow trout stocked Oct–Mar', technique: 'Worms + crickets for bream; chicken liver or stink bait for cats; small lures for bass; PowerBait + salmon eggs for stocked trout.', where: 'Shoreline, fishing pier, dam.', details: `${name} is part of KDFWR's "Fishing in Neighborhoods" (FINS) program — urban + suburban ponds stocked with channel cats year-round, bluegill, largemouth, and rainbow trout in cool months. Bank-friendly, family-focused.` },
      ];
  }
  return [];
}

function makeSpecies(cat) {
  switch (cat) {
    case 'ky-cumberland-tailwater':
      return [
        { name: 'Brown Trout', importance: 'signature', size: 'Wild + holdover; trophies 24–30+ inches', notes: 'Wild reproducing browns — one of the South\'s best trophy brown trout fisheries. Sulphur + cicada + streamer fish.' },
        { name: 'Rainbow Trout', importance: 'signature', size: '10–18"; trophy holdovers 22+"', notes: 'Heavily stocked + holdovers. Foundation fishery.' },
        { name: 'Brook Trout', importance: 'present', size: '8–12"', notes: 'Occasional stockings.' },
        { name: 'Lake Sturgeon', importance: 'present', size: 'C&R only — recovering population', notes: 'KDFWR reintroduction program. Mostly above the lake but occasional tailwater catches.' },
      ];
    case 'ky-tailwater-trout':
      return [
        { name: 'Rainbow Trout', importance: 'signature', size: '10–14" stocked; holdovers 18"+', notes: 'KDFWR stocked regularly.' },
        { name: 'Brown Trout', importance: 'strong', size: '12–18"; trophy 22+"', notes: 'Holdovers and some wild reproduction on select tailwaters.' },
        { name: 'Smallmouth Bass', importance: 'good', size: '1.5–3 lb', notes: 'Below cold zones.' },
      ];
    case 'ky-major-reservoir':
      return [
        { name: 'Largemouth Bass', importance: 'signature', size: '2–6 lb; Florida-strain trophies on Cave Run', notes: 'Standing timber + creek arms + ledges.' },
        { name: 'Smallmouth Bass', importance: 'signature', size: '1.5–4 lb; trophy 5+ lb on Cumberland/Laurel', notes: 'Deep clear highland-rim water.' },
        { name: 'Crappie', importance: 'signature', size: '0.5–2 lb', notes: 'Kentucky Lake + Barkley world-class.' },
        { name: 'Striped Bass', importance: 'signature', size: '10–35 lb; trophy 40+ on Cumberland', notes: 'KDFWR stocked.' },
        { name: 'Catfish (Blue + Channel + Flathead)', importance: 'strong', size: 'Trophy blues 30–80+ lb', notes: 'Kentucky Lake + Barkley world-class.' },
        { name: 'White Bass', importance: 'strong', size: '1–3 lb', notes: 'Spring tributary run.' },
        { name: 'Walleye / Sauger', importance: 'strong', size: '15–22"; trophy 26"+', notes: 'KDFWR stocked on Cumberland, Laurel, Cave Run.' },
        { name: 'Hybrid Striped Bass', importance: 'good', size: '5–12 lb', notes: 'Stocked on Herrington, Taylorsville.' },
        { name: 'Muskie', importance: 'good', size: '32–48"; trophy 50+"', notes: 'Cave Run is "The Muskie Capital of the South." Also Buckhorn, Green River Lake.' },
      ];
    case 'ky-state-park-lake':
      return [
        { name: 'Largemouth Bass', importance: 'signature', size: '1.5–4 lb', notes: 'Resident population.' },
        { name: 'Bluegill', importance: 'signature', size: 'Hand-size', notes: 'Reproducing.' },
        { name: 'Channel Catfish', importance: 'strong', size: '1–5 lb', notes: 'KDFWR stocked.' },
        { name: 'Crappie', importance: 'good', size: '0.5–1.5 lb', notes: 'Spring + brush piles.' },
        { name: 'Rainbow Trout', importance: 'good', size: '10–13" stocked', notes: 'Cool-month stockings on select KY state-park lakes.' },
      ];
    case 'ky-bluegrass-smallmouth-river':
      return [
        { name: 'Smallmouth Bass', importance: 'signature', size: '12–18"; trophy 20+"', notes: 'Wild river smallmouth — Bluegrass region rivers produce trophy fish.' },
        { name: 'Spotted Bass', importance: 'signature', size: '10–14"', notes: 'Mixed in with smallmouth.' },
        { name: 'Rock Bass', importance: 'strong', size: '6–10"', notes: 'Abundant.' },
        { name: 'Longear Sunfish', importance: 'strong', size: 'Hand-size', notes: 'Beautiful native panfish.' },
        { name: 'Largemouth Bass', importance: 'good', size: '2–5 lb', notes: 'Slack-water pools.' },
        { name: 'Channel Catfish', importance: 'good', size: 'Channel cats', notes: 'Deep pools.' },
        { name: 'Muskie', importance: 'good', size: '32–48"', notes: 'KDFWR stocks muskie on Licking, Kentucky River, Green.' },
      ];
    case 'ky-green-river':
      return [
        { name: 'Smallmouth Bass', importance: 'signature', size: '12–18"', notes: 'Wild Green River smallmouth — premier KY river fishery.' },
        { name: 'Rock Bass', importance: 'signature', size: '6–10"', notes: 'Outstanding populations.' },
        { name: 'Muskie', importance: 'strong', size: '32–48"; trophy 50+"', notes: 'Green River wild muskie — KY\'s most consistent muskie river.' },
        { name: 'Longear Sunfish', importance: 'strong', size: 'Hand-size', notes: 'Beautiful native.' },
        { name: 'Spotted Bass', importance: 'good', size: '10–14"', notes: 'Mixed.' },
        { name: 'Largemouth Bass', importance: 'good', size: '2–5 lb', notes: 'Slack water.' },
        { name: 'Channel Catfish', importance: 'good', size: 'Channel cats', notes: 'Pools.' },
        { name: 'Walleye', importance: 'good', size: '15–22"', notes: 'KDFWR stocks walleye on Green + Barren.' },
      ];
    case 'ky-eastern-river':
      return [
        { name: 'Smallmouth Bass', importance: 'signature', size: '10–16"', notes: 'Wild Appalachian river smallmouth.' },
        { name: 'Spotted Bass', importance: 'strong', size: '10–14"', notes: 'Mixed in.' },
        { name: 'Rock Bass', importance: 'strong', size: '6–9"', notes: 'Abundant.' },
        { name: 'Sunfish', importance: 'good', size: 'Hand-size', notes: 'Longear, green, redbreast.' },
        { name: 'Channel Catfish', importance: 'good', size: 'Channel cats', notes: 'Deeper pools.' },
        { name: 'Walleye / Sauger', importance: 'good', size: '15–22"', notes: 'In some Eastern KY rivers.' },
      ];
    case 'ky-ohio-river':
      return [
        { name: 'Blue Catfish', importance: 'signature', size: 'Trophy 50–100+ lb', notes: 'Ohio River world-class — biggest blues in the country.' },
        { name: 'Flathead Catfish', importance: 'signature', size: 'Trophy 40–80+ lb', notes: 'Log jams and deep holes.' },
        { name: 'Sauger', importance: 'signature', size: '15–22"', notes: 'Spring tailrace runs.' },
        { name: 'Paddlefish', importance: 'strong', size: '30–100+ lb', notes: 'KDFWR permit required for snagging.' },
        { name: 'Hybrid Striped Bass', importance: 'strong', size: '5–12 lb', notes: 'Open-water schoolers.' },
        { name: 'White Bass', importance: 'strong', size: '1–3 lb', notes: 'Spring tailrace.' },
        { name: 'Largemouth Bass', importance: 'good', size: '2–5 lb', notes: 'Backwaters + oxbows.' },
        { name: 'Striped Bass', importance: 'good', size: '15–35 lb', notes: 'Stocked or migratory.' },
      ];
    case 'ky-fins-pond':
      return [
        { name: 'Channel Catfish', importance: 'signature', size: '1–5 lb', notes: 'KDFWR stocked year-round.' },
        { name: 'Bluegill', importance: 'signature', size: 'Hand-size', notes: 'Reproducing.' },
        { name: 'Largemouth Bass', importance: 'strong', size: '1–3 lb', notes: 'Resident.' },
        { name: 'Rainbow Trout', importance: 'good', size: '10–13" stocked', notes: 'KDFWR FINS stocks rainbow trout in cool months (Oct–Mar).' },
      ];
  }
  return [];
}

function makeSig(cat) {
  switch (cat) {
    case 'ky-cumberland-tailwater': return ['Brown Trout (Trophy)', 'Rainbow Trout'];
    case 'ky-tailwater-trout': return ['Trout (Rainbow + Brown)'];
    case 'ky-major-reservoir': return ['Largemouth Bass', 'Striped Bass', 'Crappie'];
    case 'ky-state-park-lake': return ['Largemouth Bass', 'Bluegill'];
    case 'ky-bluegrass-smallmouth-river': return ['Smallmouth Bass', 'Spotted Bass'];
    case 'ky-green-river': return ['Smallmouth Bass', 'Muskie'];
    case 'ky-eastern-river': return ['Smallmouth Bass'];
    case 'ky-ohio-river': return ['Blue Catfish', 'Sauger'];
    case 'ky-fins-pond': return ['Channel Catfish', 'Bluegill'];
  }
  return [];
}

function makeType(cat) {
  switch (cat) {
    case 'ky-cumberland-tailwater':
    case 'ky-tailwater-trout':
      return 'tailwater';
    case 'ky-major-reservoir':
    case 'ky-state-park-lake':
    case 'ky-fins-pond':
      return 'reservoir';
    case 'ky-bluegrass-smallmouth-river':
    case 'ky-green-river':
    case 'ky-eastern-river':
    case 'ky-ohio-river':
      return 'river';
  }
  return 'reservoir';
}

function buildKY({ id, name, region, county, acres, maxDepthFt, lat, lng, cat, notes }) {
  return {
    id,
    name,
    state: 'KY',
    region,
    type: makeType(cat),
    county,
    acres: acres ?? null,
    maxDepthFt: maxDepthFt ?? null,
    lat, lng,
    signatureSpecies: makeSig(cat),
    species: makeSpecies(cat),
    patterns: makePatterns(cat, name),
    access: ['Public access — see KDFWR Where to Fish Atlas for specific ramps + shoreline + bank-fishing locations'],
    regulations: 'KY fishing license required. Trout permit required on trout streams. Paddlefish requires KDFWR permit + tag. Cumberland tailwater has special regulations (gear restrictions, slot limits on browns) — check KDFWR before fishing.',
    managementProgram: ['Kentucky Department of Fish and Wildlife Resources (KDFWR) management'],
    notes: notes || `${name} — ${cat.replace(/-/g, ' ')} character Kentucky water.`,
  };
}

module.exports = { buildKY };
