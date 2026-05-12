// Georgia waterbody template engine.
// GA spans deep mountain reservoirs (Burton, Rabun) + Atlanta-metro tournament
// water (Lanier, Allatoona) + Coosa-strain spotted bass lakes + southwest GA
// Florida-strain bass + tailwater Hooch trout + Chattahoochee NF wild trout
// streams + coastal Golden Isles flood-tide redfish marshes.
//
// Categories:
//  - ga-piedmont-reservoir: Lanier/Allatoona/West Point/Jackson/Sinclair/Oconee
//      Striper + spotted bass + largemouth tournament water.
//  - ga-mountain-reservoir: Burton/Rabun/Seed/Tugalo/Yonah/Tallulah
//      Deep clear NE GA mountain lakes; smallmouth + walleye + Coosa-spot + striper.
//  - ga-chattahoochee-chain: Lower Hooch chain (Harding/Goat Rock/Oliver/Andrews)
//      Multi-species: striper, spot, large, crappie, cats.
//  - ga-southwest-reservoir: Eufaula(Walter F George)/Seminole/Worth/Blackshear/Chehaw
//      Florida-strain trophy bass + crappie + cats + striper.
//  - ga-savannah-chain: Hartwell/Russell/Thurmond (Clarks Hill)
//      Striper + largemouth + crappie + spotted bass chain.
//  - ga-mountain-trout-stream: Chattahoochee NF + Cherokee NF GA streams
//      Wild + stocked rainbow/brown/brook; full Cumberland-style hatch calendar.
//  - ga-tailwater-trout: Chattahoochee below Buford Dam (Lanier tailwater)
//      Cold discharge midge fishery; sulphur + caddis windows.
//  - ga-piedmont-river: Etowah/Ocmulgee/Oconee/Flint upper/Hooch lower
//      Smallmouth + spotted bass + largemouth + shoal bass (Flint).
//  - ga-coastal-plain-river: Ogeechee/Altamaha/Satilla/St.Marys/Withlacoochee N
//      Tannic blackwater; largemouth + bream + redbreast + trophy flathead.
//  - ga-coastal-sound: Wassaw/Ossabaw/St.Catherines/Sapelo/Doboy/Altamaha/
//      St.Simons/St.Andrews/Cumberland Sounds — redfish + trout + flounder.
//  - ga-coastal-flat: Golden Isles + Savannah marsh — flood-tide redfish on
//      Spartina grass.
//  - ga-coastal-river-brackish: Wilmington/Vernon/Newport/Medway/Crooked/
//      Sapelo/Cumberland — brackish lowcountry rivers.
//  - ga-coastal-town: Savannah, Tybee, Brunswick, Jekyll, St. Simons, Sea Island.
//  - ga-coastal-pier-jetty: Tybee Pier, St. Simons Pier, Jekyll Pier.
//  - ga-coastal-offshore: Bluewater out of Brunswick/Savannah — kings, mahi.
//  - ga-pfa-lake: GA DNR Public Fishing Area.
//  - ga-state-park-lake: GA state park managed lake.
//  - ga-county-pond: community/municipal fishing pond.

function makePatterns(cat, name) {
  switch (cat) {
    case 'ga-piedmont-reservoir':
      return [
        { title: 'Spotted Bass — Bluff Walls + Brush', target: 'Spotted Bass', when: 'Year-round; peak fall + winter', technique: 'Drop-shot (Robo Worm), shaky head with finesse worm, jerkbaits (Megabass Vision 110) in cold months, small swimbaits. Vertical structure focus.', where: 'Main-lake bluff walls, bridge causeways, riprap, brush piles.', details: `${name} is a GA piedmont reservoir — Lanier-style aggressive spotted bass fishery. Coosa-strain genetics; deep clear water; tournament tactics.` },
        { title: 'Striped Bass — Live Shad Down-Rod', target: 'Striped Bass', when: 'Year-round; peak May – October', technique: 'Live blueback herring or shad on down-rods at 25–50 ft over the river channel. Big swimbaits + topwater (Spook, Pencil Popper) when fish surface.', where: 'Main-lake channel, mid-lake humps, near the dam in summer.', details: 'Lanier especially is a trophy striper destination — 40+ lb fish realistic. Spring tributary run pushes fish up the Hooch.' },
        { title: 'Largemouth Bass — Creek Arms', target: 'Largemouth Bass', when: 'Spring spawn + fall', technique: 'ChatterBait + jigs around docks, laydowns, riprap. Lipless cranks pre-spawn.', where: 'Creek arms, residential dock cover.', details: 'Piedmont reservoirs hold largemouth in the creek arms — spots dominate the main lake.' },
        { title: 'Crappie — Brush + Docks', target: 'Crappie', when: 'Spring spawn + year-round on brush', technique: 'Long-pole jigging brush; light-line jigs around docks.', where: 'Dock structure, marina piers, brush piles.', details: 'GA piedmont reservoirs produce reliable spring crappie + year-round dock fishing.' },
      ];
    case 'ga-mountain-reservoir':
      return [
        { title: 'Deep-Clear Smallmouth + Coosa Spots', target: 'Smallmouth Bass and Spotted Bass', when: 'Year-round; peak fall – spring', technique: 'Drop-shot in 25–45 ft on main-lake bluff structure. Jerkbaits in transition. Small swimbaits over deep humps. Jigging spoons in winter.', where: 'Main-lake bluff walls, channel-swing rock, deep humps.', details: `${name} is a NE GA mountain reservoir — Burton, Rabun, Seed, Tugalo, Yonah, Tallulah. Deep clear cold water; trophy smallmouth + Coosa-strain spotted bass + walleye.` },
        { title: 'Walleye — Trolling Crankbaits', target: 'Walleye', when: 'Spring + fall + winter night', technique: 'Trolling crawler harnesses + Bandit/Storm crankbaits along breaks. Vertical jigging in winter.', where: 'Deep main lake, points + humps.', details: 'GA mountain lakes hold quality walleye — Lake Burton especially. State stocks regularly.' },
        { title: 'Striped Bass — Live Bait', target: 'Striped Bass', when: 'May – October', technique: 'Live blueback herring on down-rods 30–60 ft. Big swimbaits when surface schooling.', where: 'Main-lake channel, deep coves.', details: 'Stocked striper fishery; quality fish in deep cold water.' },
        { title: 'Topwater Schoolers — Fall Bait Migration', target: 'Spotted Bass + Largemouth', when: 'September – November', technique: 'Walking topwater (Spook), pencil poppers, small swimbaits + flukes when fish boil shad.', where: 'Main-lake points + creek mouths.', details: 'Fall mountain-lake topwater is visual fishing at its best.' },
      ];
    case 'ga-chattahoochee-chain':
      return [
        { title: 'Lower Hooch Chain Striper', target: 'Striped Bass', when: 'Year-round; peak spring + summer', technique: 'Live shad on down-rods + planer boards over the river channel. Big swimbaits + topwater when fish surface.', where: 'Main-river channel; below each dam (tailrace fishery).', details: `${name} is part of the Lower Chattahoochee chain — Bartletts Ferry (Harding), Goat Rock, Oliver, Andrews. Striped bass + spotted bass + crappie + cats.` },
        { title: 'Spotted Bass — Riprap + Rock', target: 'Spotted Bass', when: 'Year-round', technique: 'Drop-shot, jerkbaits, jigs on rock.', where: 'Riprap dam, bridge causeways, main-lake rock.', details: 'Coosa-strain spots in the lower Hooch chain — same character as Lanier.' },
        { title: 'Crappie + Catfish Mix', target: 'Crappie and Catfish', when: 'Year-round', technique: 'Crappie: long-pole jigging brush. Cats: cut bait on bottom rigs at channel bends.', where: 'Creek arms (crappie); deep river channel (cats).', details: 'Standard reservoir crappie + catfish play.' },
      ];
    case 'ga-southwest-reservoir':
      return [
        { title: 'Florida-Strain Trophy Largemouth', target: 'Largemouth Bass', when: 'February – April spawn; November – December cold fronts', technique: 'Wild-shiner trophy fishing. Spring: ChatterBait + lipless crank around grass. Summer: deep crankbaits + Carolina rig on ledges.', where: 'Hydrilla edges, eelgrass flats, standing timber, creek mouths.', details: `${name} is SW GA Florida-strain bass country — Eufaula (Walter F. George), Seminole, Worth, Blackshear, Chehaw. Trophy 10+ lb largemouth realistic. "Big Bass Capital of the South."` },
        { title: 'Crappie Galore', target: 'Crappie', when: 'Year-round; peak January – May', technique: 'Long-pole jigging brush in 12–22 ft. Spider rigging open water summer.', where: 'Creek-mouth brush + standing timber.', details: 'SW GA reservoirs are crappie factories — Eufaula especially produces tournament weights.' },
        { title: 'Striped Bass + Hybrids', target: 'Striped Bass and Hybrid Striped Bass', when: 'Spring + summer', technique: 'Live shad on down-rods; topwater when schooling.', where: 'Main-river channel.', details: 'GA stocks striper + hybrid on Eufaula/Seminole/Worth/Blackshear.' },
        { title: 'Catfish — Channel + Blue + Flathead', target: 'Catfish', when: 'Year-round', technique: 'Fresh cut shad on Santee rigs for blues; live bluegill for flatheads; chicken liver for channels.', where: 'Main-river channel + deep holes.', details: 'Trophy blue cats + flatheads on the Chattahoochee + Flint systems.' },
      ];
    case 'ga-savannah-chain':
      return [
        { title: 'Trophy Striper — Hartwell/Russell/Thurmond', target: 'Striped Bass', when: 'Year-round; peak fall – spring', technique: 'Live shad on down-rods 25–45 ft. Big swimbaits + topwater on surface bait.', where: 'Main-lake channel, deep humps, dam area.', details: `${name} is part of the Savannah River chain — Hartwell, Russell, Thurmond/Clarks Hill. Premier striper destination.` },
        { title: 'Largemouth + Spotted Bass', target: 'Largemouth and Spotted Bass', when: 'Spring + fall', technique: 'ChatterBait + jigs around docks + creek arms (largemouth); drop-shot main-lake rock (spots).', where: 'Creek arms, docks, bluff walls.', details: 'Savannah chain produces both species; tournament water.' },
        { title: 'Crappie + Hybrid Stripers', target: 'Crappie + Hybrid Striped Bass', when: 'Year-round', technique: 'Brush-pile crappie + live shad hybrids.', where: 'Creek mouths + main lake.', details: 'Mixed-bag fishery — under-rated for hybrid stripers.' },
      ];
    case 'ga-mountain-trout-stream':
      return [
        { title: 'Wild Trout on Dries — NE GA Plunge Pools', target: 'Trout (Rainbow, Brown, Brook)', when: 'April – October', technique: '3–4 wt fly rod, dry-dropper (Stimulator + Pheasant Tail), high-stick short drifts. Stealth.', where: 'Plunge pools, pocket water, current seams behind boulders.', details: `${name} is a Chattahoochee NF or Cherokee NF GA mountain stream — wild + stocked trout. Same Southern Appalachian hatch calendar as TN/NC.` },
        { title: 'Sulphur Hatch — May / June', target: 'Trout', when: 'Mid-May – late June, last 2 hrs before dark', technique: 'Fly: #14–18 sulphur dun, emerger, spinner. 6X tippet. Dead-drift the dun in surface film.', where: 'Riffle-pool transitions, slick tailouts.', details: 'Ephemerella sulphur hatch — same hatch that lights up TN/NC tailwaters and KY\'s Cumberland.' },
        { title: 'BWO + Caddis Spring Windows', target: 'Trout', when: 'BWO Oct – April cloudy days; Caddis April – May flurry', technique: 'BWO: #18–22 dun + RS-2. Caddis: #14–18 elk hair caddis (tan/olive).', where: 'Riffle-pool transitions.', details: 'Spring + fall hatches on GA mountain streams.' },
        { title: 'Headwater Brookies', target: 'Brook Trout', when: 'Late spring – early fall', technique: 'Small dries (Adams, Royal Wulff size 16–18), stealth approach.', where: 'Highest-elevation tribs above 3000 ft.', details: 'Southern Appalachian brook trout — native to NE GA highest tribs.' },
        { title: 'Streamer Game for Bigger Browns', target: 'Brown Trout', when: 'Fall – winter; high water anytime', technique: 'Sink-tip + #4–8 Woolly Buggers, Sex Dungeons in olive/black/white. Strip across bank seams.', where: 'Bank cuts, log jams, deep pools.', details: 'Wild GA browns grow large in protected catch-and-release reaches.' },
      ];
    case 'ga-tailwater-trout':
      return [
        { title: 'Midge Nymphing — Year-Round', target: 'Trout (Rainbow + Brown)', when: 'Year-round; best low/zero generation', technique: 'Two-fly nymph rig: zebra midge (#18–22) above sowbug or scud (#16). 6X tippet, strike indicator.', where: 'Riffles + current seams + slow tailouts.', details: `${name} is GA tailwater coldwater discharge — Chattahoochee below Buford Dam. Year-round trout, midge + sowbug foundation, full hatch calendar.` },
        { title: 'Sulphur Hatch (Cumberland-Style)', target: 'Trout', when: 'Mid-May – late June, last 2 hrs before dark', technique: 'Fly: #14–18 sulphur dun, emerger, spinner. Dead-drift in surface film.', where: 'Riffle-pool transitions.', details: 'Hooch tailwater gets the same sulphur hatch as Caney Fork + Cumberland — late-spring evening event.' },
        { title: 'BWO + Caddis Windows', target: 'Trout', when: 'BWO cool months; Caddis April – May', technique: 'BWO: #18–22 dun. Caddis: #14–18 elk hair.', where: 'Riffles.', details: 'Predictable hatch windows once you know the calendar.' },
        { title: 'Streamer Game for Browns', target: 'Brown Trout', when: 'High generation + fall/winter', technique: 'Sink-tip + #4–8 streamers in olive/black/white.', where: 'Bank cuts, log jams.', details: 'Higher water = aggressive browns chasing big flies.' },
      ];
    case 'ga-piedmont-river':
      return [
        { title: 'Shoal Bass — Flint River Specialty', target: 'Shoal Bass', when: 'May – October', technique: 'Topwater (Whopper Plopper, Pop-R), Stealth Bomber popper (fly), small jerkbaits, soft plastic shoal-bass jigs around shoal/rock.', where: 'Rocky shoals + current breaks below rapids.', details: `${name} is a GA piedmont river — Flint, Etowah, Ocmulgee, Oconee, Hooch lower. Flint is shoal bass capital (endemic species). Wild smallmouth + spotted bass + largemouth in the others.` },
        { title: 'Smallmouth + Spotted Bass Float', target: 'Smallmouth and Spotted Bass', when: 'May – October', technique: 'Float-fish tubes, Ned rigs, jerkbaits, square-bills. Topwater at dawn + dusk.', where: 'Rocky riffle-pool transitions, current breaks.', details: 'Etowah especially holds wild smallmouth — under-pressured GA mountain piedmont river.' },
        { title: 'Spring + Fall Catfish + Stripers', target: 'Catfish + Stripers (Lower Reaches)', when: 'Spring + fall', technique: 'Cut bait for cats; live shad for stripers below dams.', where: 'Below dams + deep holes.', details: 'Lower piedmont rivers hold stripers + trophy cats below each dam.' },
      ];
    case 'ga-coastal-plain-river':
      return [
        { title: 'Blackwater River Bass — Cypress Cover', target: 'Largemouth Bass', when: 'Year-round; peak spring + fall', technique: 'Topwater poppers + frogs at dawn; soft plastics (Senkos, weightless flukes) around cypress knees + pads; ChatterBaits in stained water.', where: 'Cypress shorelines, lily pad fields, log jam eddies.', details: `${name} is a GA coastal plain blackwater river — Ogeechee, Altamaha, Satilla, St. Marys, Withlacoochee, lower Flint, lower Ocmulgee. Cypress-lined + tannin-stained.` },
        { title: 'Bream + Redbreast — Sandy Pockets', target: 'Bluegill, Redbreast Sunfish, Stumpknocker', when: 'May – August', technique: 'Crickets, worms, small popping bugs.', where: 'Cypress knees, sandy pockets, log-jam eddies.', details: 'GA coastal plain rivers have outstanding native sunfish — redbreast especially.' },
        { title: 'Trophy Flathead Catfish', target: 'Flathead Catfish', when: 'Summer (June – September)', technique: 'Live bream on heavy circle hooks. Patience.', where: 'Deep holes, log jams.', details: 'Altamaha + Satilla + Ocmulgee + Ogeechee all hold trophy flatheads to 50+ lb.' },
        { title: 'Channel Catfish — Year-Round', target: 'Channel Catfish', when: 'Year-round; peak summer', technique: 'Cut bait, chicken liver, stink bait.', where: 'Deep holes + slack water.', details: 'Easy bank fishing on GA coastal rivers.' },
      ];
    case 'ga-coastal-sound':
      return [
        { title: 'Redfish + Speckled Trout — Marsh Edges', target: 'Redfish and Speckled Trout', when: 'Year-round; peak fall', technique: 'Soft plastics under popping cork, topwater (Spook) at dawn, live shrimp/finger mullet. Sight-cast tailing reds.', where: 'Spartina marsh edges, oyster bars, creek mouths.', details: `${name} is a Georgia coastal sound — Wassaw, Ossabaw, St. Catherines, Sapelo, Doboy, Altamaha, St. Simons, St. Andrews, Cumberland. Lowcountry redfish + trout + flounder mainstay.` },
        { title: 'Flood-Tide Redfish on the Grass', target: 'Redfish (Trophy)', when: 'Spring + fall extreme high tides (king tides)', technique: 'Fly: weedless gold spoonfly, EP Crab, redfish toad. Spin: weedless gold spoon. Stealth poling onto flooded Spartina marsh.', where: 'Flooded Spartina marsh at peak high tide (water level above the marsh).', details: 'The Golden Isles signature — tailing redfish on Spartina at king-tide high water. Sight-casting nirvana.' },
        { title: 'Bull Redfish — Pass / Sound Mouth', target: 'Redfish (Bull)', when: 'Fall (September – November)', technique: 'Big chunks of mullet or blue crab on Carolina rigs. Cut bait drift.', where: 'Sound mouths + tide-line zones at the inlet.', details: 'Fall bull-red migration stacks 30–48"+ fish at sound mouths.' },
        { title: 'Flounder Drift — Sand + Cuts', target: 'Flounder', when: 'October – November peak', technique: 'Live mud minnows + Gulp shrimp on Carolina rigs; jigs on sand drop-offs.', where: 'Channel edges, sand cuts, sound-side creek mouths.', details: 'Fall flounder migration through GA sounds.' },
        { title: 'Sheepshead + Black Drum — Winter', target: 'Sheepshead and Black Drum', when: 'January – March', technique: 'Live fiddler crabs + shrimp pieces tight to pilings + oyster bars.', where: 'Pier pilings, jetties, oyster bars.', details: 'Convict fishery — winter staple.' },
      ];
    case 'ga-coastal-flat':
      return [
        { title: 'Flood-Tide Redfish — Spartina Grass', target: 'Redfish', when: 'Spring + fall king tides (extreme high waters)', technique: 'Fly: weedless gold spoonfly, EP Crab, redfish toad in tan/orange. Stealth poling + sight-casting tailing fish.', where: 'Flooded Spartina marsh at peak high tide.', details: `${name} is a Golden Isles coastal flat — the GA signature redfish fishery. Tailing reds on flooded Spartina at king tide is among the prettiest fly fishing in America.` },
        { title: 'Low-Tide Oyster Bar Redfish', target: 'Redfish', when: 'Low + falling tide', technique: 'Soft plastics + weedless gold spoons + live shrimp.', where: 'Exposed oyster bars + creek mouth confluences at low water.', details: 'When the marsh drains, reds stack at the oyster bars.' },
        { title: 'Speckled Trout — Sand Holes', target: 'Speckled Trout', when: 'Year-round; peak fall', technique: 'Soft plastics under popping cork; topwater at dawn.', where: 'Sandy potholes in the grass; creek bend deeps.', details: 'GA coast trout — finesse + structure.' },
      ];
    case 'ga-coastal-river-brackish':
      return [
        { title: 'Brackish River Redfish + Trout', target: 'Redfish and Speckled Trout', when: 'Year-round', technique: 'Live shrimp under popping cork, soft plastics on jighead, twitchbaits.', where: 'Oyster bars, dock pilings, mangrove + Spartina edges.', details: `${name} is a brackish GA coastal river — Wilmington, Vernon, Ogeechee mouth, Newport, Medway, Sapelo, Crooked, Cumberland. Mixed-salinity inshore mainstay.` },
        { title: 'Flounder + Sheepshead Around Structure', target: 'Flounder and Sheepshead', when: 'Fall flounder; winter sheepshead', technique: 'Live mud minnows + Gulp shrimp for flounder; fiddler crabs for sheepshead.', where: 'Channel edges, pier pilings, oyster bars.', details: 'Standard brackish-water structure species.' },
        { title: 'Tarpon Migration (Summer)', target: 'Tarpon', when: 'June – August', technique: 'Live mullet or threadfin on circle hooks. Big swimbaits.', where: 'Sound mouths + river mouths.', details: 'GA coast does get tarpon — Satilla + St. Marys + Cumberland especially.' },
      ];
    case 'ga-coastal-town':
      return [
        { title: 'Local Inshore Mix', target: 'Redfish, Speckled Trout, Flounder, Sheepshead', when: 'Year-round; species-specific peaks', technique: 'Soft plastics under popping cork, topwater at dawn, live shrimp/mullet, sight-cast reds on flooded marsh.', where: 'Spartina marsh edges, oyster bars, dock pilings, residential canals, creek mouths.', details: `${name} is a Georgia coastal town — Savannah, Tybee, Brunswick, Jekyll, St. Simons, Sea Island, Darien, Richmond Hill. Premier GA inshore destination.` },
        { title: 'Pier + Surf — Spanish, Kings, Drum', target: 'Spanish Mackerel, King Mackerel, Red Drum', when: 'Spring + fall peaks', technique: 'Gotcha plugs + spoons for Spanish; live bait for kings; cut bait for surf drum.', where: 'Town piers + jetties + beach surf line.', details: 'GA coast pier + surf variety.' },
        { title: 'Offshore Charter — Kings, Mahi, Bottom Fish', target: 'King Mackerel, Mahi-Mahi, Snapper, Grouper', when: 'May – November (offshore weather)', technique: 'Trolling + bottom fishing 10–60 miles offshore.', where: 'Nearshore reefs + Gulf Stream edge.', details: 'GA offshore is bluewater accessible from Brunswick + Savannah.' },
      ];
    case 'ga-coastal-pier-jetty':
      return [
        { title: 'Spanish + Bluefish — Cast & Crank', target: 'Spanish Mackerel + Bluefish', when: 'Spring + Fall', technique: 'Gotcha plugs + Spanish spoons.', where: 'Pier ends + jetty tips.', details: `${name} is a GA ocean pier or jetty — Tybee Pier, Jekyll Pier, St. Simons Pier are the marquee.` },
        { title: 'Trophy Red Drum — Surf + Pier', target: 'Red Drum (Bull)', when: 'Fall (September – November)', technique: 'Cut mullet on Carolina rigs.', where: 'Surf line + pier end.', details: 'GA surf gets fall bull-red migration — same fish that draws NC anglers.' },
        { title: 'Sheepshead — Winter Pilings', target: 'Sheepshead', when: 'December – March', technique: 'Live fiddler crabs + shrimp tight to pilings.', where: 'Pier + jetty pilings.', details: 'Winter convict fishery.' },
      ];
    case 'ga-coastal-offshore':
      return [
        { title: 'Bluewater Trolling — Kings + Mahi', target: 'King Mackerel + Mahi-Mahi', when: 'May – October', technique: 'Trolling rigged ballyhoo on color-coded skirts.', where: 'Nearshore reefs + Gulf Stream edge 30–70 miles out.', details: `${name} is GA offshore — bluewater trolling out of Brunswick or Savannah. Kings, mahi, wahoo, sailfish (less than FL but realistic).` },
        { title: 'Bottom Fishing — Snapper + Grouper', target: 'Snapper + Grouper', when: 'Year-round (check seasons)', technique: 'Live bait + heavy tackle on nearshore reefs.', where: 'Artificial reefs + natural bottom.', details: 'GA Artificial Reef program creates strong nearshore bottom fishery.' },
      ];
    case 'ga-pfa-lake':
      return [
        { title: 'GA DNR Public Fishing Area', target: 'Largemouth Bass + Bluegill + Channel Catfish + Crappie', when: 'Year-round', technique: 'Worms + crickets for bream; chicken liver for cats; small lures for bass; jigs + minnows for crappie. GA DNR stocks trout in cool months on select PFA waters.', where: 'Shoreline, fishing pier, dam.', details: `${name} is a Georgia DNR Public Fishing Area — managed stocking + structure programs, bank-friendly access, family + kid focused.` },
      ];
    case 'ga-state-park-lake':
      return [
        { title: 'State Park Family Fishery', target: 'Largemouth Bass + Bluegill + Channel Catfish', when: 'Year-round; stocked trout cool months on select waters', technique: 'Live bait + small jigs.', where: 'Shoreline + pier.', details: `${name} is a GA state-park managed lake — accessible family fishing + GA DNR stocking.` },
      ];
    case 'ga-county-pond':
      return [
        { title: 'County Community Pond', target: 'Bluegill + Largemouth Bass + Channel Catfish', when: 'Year-round', technique: 'Worms + crickets + chicken liver + small lures.', where: 'Shoreline + pier.', details: `${name} is a Georgia county community pond — DNR-managed or municipal stocked fishing pond. Bank-friendly + kid friendly.` },
      ];
  }
  return [];
}

function makeSpecies(cat) {
  switch (cat) {
    case 'ga-piedmont-reservoir':
      return [
        { name: 'Spotted Bass (Coosa-strain)', importance: 'signature', size: '1.5–4 lb; trophy 5+ lb', notes: 'Aggressive piedmont-reservoir spots — Lanier-style.' },
        { name: 'Striped Bass', importance: 'signature', size: '10–40 lb; trophy 50+ on Lanier', notes: 'Lanier-style stocking + natural reproduction in some.' },
        { name: 'Largemouth Bass', importance: 'strong', size: '2–6 lb', notes: 'Creek arms + docks.' },
        { name: 'Crappie', importance: 'strong', size: '0.5–1.5 lb', notes: 'Spring + brush piles.' },
        { name: 'Catfish (Blue + Channel + Flathead)', importance: 'strong', size: 'Trophy blues 30–60 lb', notes: 'Main river channel.' },
        { name: 'White Bass', importance: 'good', size: '1–3 lb', notes: 'Spring tributary run.' },
        { name: 'Walleye (Where Stocked)', importance: 'good', size: '14–22"', notes: 'Some piedmont reservoirs.' },
      ];
    case 'ga-mountain-reservoir':
      return [
        { name: 'Smallmouth Bass', importance: 'signature', size: '1.5–4 lb; trophy 5+ lb', notes: 'Deep clear mountain-reservoir smallies.' },
        { name: 'Spotted Bass (Coosa-strain)', importance: 'signature', size: '1.5–3 lb', notes: 'Aggressive Coosa spots.' },
        { name: 'Walleye', importance: 'strong', size: '15–22"; trophy 26"+', notes: 'Burton + Rabun produce trophy walleye.' },
        { name: 'Striped Bass', importance: 'strong', size: '10–30 lb', notes: 'Stocked.' },
        { name: 'Largemouth Bass', importance: 'strong', size: '2–5 lb', notes: 'Creek arms.' },
        { name: 'Crappie', importance: 'good', size: '0.5–1.5 lb', notes: 'Brush piles.' },
        { name: 'Yellow Perch', importance: 'good', size: '8–11"', notes: 'In some mountain lakes.' },
      ];
    case 'ga-chattahoochee-chain':
      return [
        { name: 'Striped Bass', importance: 'signature', size: '10–35 lb', notes: 'Lower Hooch chain striper destination.' },
        { name: 'Spotted Bass', importance: 'signature', size: '1.5–3 lb', notes: 'Coosa-strain spots on rock.' },
        { name: 'Largemouth Bass', importance: 'strong', size: '2–5 lb', notes: 'Creek arms.' },
        { name: 'Crappie', importance: 'strong', size: '0.5–1.5 lb', notes: 'Brush + cover.' },
        { name: 'Catfish (Blue + Channel + Flathead)', importance: 'strong', size: 'Trophy blues 30+ lb', notes: 'River channel + below dams.' },
        { name: 'Hybrid Striped Bass', importance: 'good', size: '5–10 lb', notes: 'Stocked.' },
      ];
    case 'ga-southwest-reservoir':
      return [
        { name: 'Largemouth Bass (Florida-strain)', importance: 'signature', size: '2–6 lb; trophy 10+ lb', notes: 'Florida-strain stocking — Eufaula world-class.' },
        { name: 'Crappie', importance: 'signature', size: '0.5–2 lb', notes: 'Eufaula + Seminole are crappie factories.' },
        { name: 'Striped Bass', importance: 'strong', size: '10–30 lb', notes: 'Stocked.' },
        { name: 'Hybrid Striped Bass', importance: 'strong', size: '5–10 lb', notes: 'Stocked.' },
        { name: 'Catfish (Channel + Blue + Flathead)', importance: 'strong', size: 'Trophy class', notes: 'Chattahoochee + Flint channels produce big cats.' },
        { name: 'Bream (Bluegill + Shellcracker)', importance: 'strong', size: 'Hand-size', notes: 'Spring + summer beds.' },
        { name: 'White Bass', importance: 'good', size: '1–3 lb', notes: 'Spring run.' },
        { name: 'Shoal Bass (Flint trib waters)', importance: 'good', size: '1–4 lb', notes: 'Flint River system — endemic species.' },
      ];
    case 'ga-savannah-chain':
      return [
        { name: 'Striped Bass', importance: 'signature', size: '10–40 lb', notes: 'Savannah chain striper destination.' },
        { name: 'Largemouth Bass', importance: 'signature', size: '2–6 lb', notes: 'Creek arms + docks.' },
        { name: 'Spotted Bass', importance: 'strong', size: '1.5–3 lb', notes: 'Rock + main lake.' },
        { name: 'Crappie', importance: 'strong', size: '0.5–1.5 lb', notes: 'Brush + cover.' },
        { name: 'Hybrid Striped Bass', importance: 'strong', size: '5–10 lb', notes: 'Stocked.' },
        { name: 'Catfish', importance: 'good', size: 'Blue + channel + flathead', notes: 'River channel.' },
      ];
    case 'ga-mountain-trout-stream':
      return [
        { name: 'Rainbow Trout', importance: 'signature', size: '8–14"; trophy holdover 18+"', notes: 'Wild + stocked.' },
        { name: 'Brown Trout', importance: 'signature', size: '10–18"; trophy 24+"', notes: 'Wild reproducing in many streams.' },
        { name: 'Brook Trout', importance: 'strong', size: '5–9"', notes: 'Southern Appalachian native — NE GA highest tribs.' },
      ];
    case 'ga-tailwater-trout':
      return [
        { name: 'Rainbow Trout', importance: 'signature', size: '10–16"; holdover 20"+', notes: 'Heavily stocked + holdovers.' },
        { name: 'Brown Trout', importance: 'signature', size: '12–22"; trophy 26+"', notes: 'Wild reproducing in Hooch tailwater.' },
        { name: 'Striped Bass', importance: 'good', size: '15–30 lb', notes: 'Migratory from Lanier (some).' },
      ];
    case 'ga-piedmont-river':
      return [
        { name: 'Shoal Bass (Flint System)', importance: 'signature', size: '1–4 lb; trophy 5+ lb', notes: 'Endemic species — Flint River and tribs. State fish.' },
        { name: 'Smallmouth Bass', importance: 'signature', size: '12–17"', notes: 'Wild Etowah/Hooch piedmont smallmouth.' },
        { name: 'Spotted Bass', importance: 'strong', size: '12–16"', notes: 'Mixed in throughout.' },
        { name: 'Largemouth Bass', importance: 'strong', size: '2–5 lb', notes: 'Slack water + pools.' },
        { name: 'Striped Bass', importance: 'good', size: '15–30 lb', notes: 'Below dams.' },
        { name: 'Catfish', importance: 'good', size: 'Channel + flathead', notes: 'Pool bottoms.' },
      ];
    case 'ga-coastal-plain-river':
      return [
        { name: 'Largemouth Bass', importance: 'signature', size: '2–6 lb; trophy 8+ lb', notes: 'Cypress cover + Florida-strain influence.' },
        { name: 'Bluegill', importance: 'signature', size: 'Hand-size', notes: 'Cypress + sand pockets.' },
        { name: 'Redbreast Sunfish', importance: 'signature', size: 'Hand-size', notes: 'Beautiful native panfish — GA blackwater specialty.' },
        { name: 'Stumpknocker (Spotted Sunfish)', importance: 'strong', size: 'Hand-size', notes: 'Cypress knees.' },
        { name: 'Flathead Catfish', importance: 'signature', size: 'Trophy 40–60+ lb', notes: 'Altamaha + Satilla + Ocmulgee + Ogeechee trophy water.' },
        { name: 'Channel Catfish', importance: 'strong', size: '2–6 lb', notes: 'Deep holes.' },
        { name: 'Striped Bass', importance: 'good', size: '10–25 lb', notes: 'Tidal lower reaches; Ogeechee + Altamaha spawn.' },
      ];
    case 'ga-coastal-sound':
      return [
        { name: 'Redfish', importance: 'signature', size: 'Slot 14–23"; bulls 30–40"+', notes: 'GA slot is 14–23". Flood-tide tailing on Spartina.' },
        { name: 'Speckled Trout', importance: 'signature', size: '15–22"', notes: 'Sound grass + sandy potholes.' },
        { name: 'Flounder', importance: 'strong', size: '14–20"', notes: 'Sand + channel edges. Fall run peak.' },
        { name: 'Sheepshead', importance: 'strong', size: '2–5 lb', notes: 'Pilings + oyster bars.' },
        { name: 'Black Drum', importance: 'good', size: '2–10 lb', notes: 'Oyster bars + pier pilings.' },
        { name: 'Tarpon (Summer)', importance: 'good', size: '50–150 lb', notes: 'Sound mouths June–August.' },
        { name: 'Spanish Mackerel', importance: 'good', size: '1–4 lb', notes: 'Nearshore + sound mouths.' },
      ];
    case 'ga-coastal-flat':
      return [
        { name: 'Redfish', importance: 'signature', size: 'Slot 14–23"; bulls', notes: 'Golden Isles flood-tide signature.' },
        { name: 'Speckled Trout', importance: 'signature', size: '15–22"', notes: 'Sand potholes in grass.' },
        { name: 'Flounder', importance: 'good', size: '14–18"', notes: 'Sand cuts.' },
      ];
    case 'ga-coastal-river-brackish':
      return [
        { name: 'Redfish', importance: 'signature', size: 'Slot 14–23"', notes: 'Brackish-river mainstay.' },
        { name: 'Speckled Trout', importance: 'signature', size: '15–22"', notes: 'Mid-river structure.' },
        { name: 'Flounder', importance: 'strong', size: '14–20"', notes: 'Fall run.' },
        { name: 'Sheepshead', importance: 'strong', size: '2–5 lb', notes: 'Pilings.' },
        { name: 'Black Drum', importance: 'good', size: '2–8 lb', notes: 'Oyster bars.' },
        { name: 'Tarpon (Summer)', importance: 'good', size: '50–120 lb', notes: 'Lower river — Satilla, St. Marys, Cumberland.' },
      ];
    case 'ga-coastal-town':
      return [
        { name: 'Redfish', importance: 'signature', size: 'Slot 14–23"; bulls', notes: 'Inshore foundation.' },
        { name: 'Speckled Trout', importance: 'signature', size: '15–22"', notes: 'Grass + creek bends.' },
        { name: 'Flounder', importance: 'strong', size: '14–20"', notes: 'Sand + channel.' },
        { name: 'Sheepshead', importance: 'strong', size: '2–5 lb', notes: 'Structure.' },
        { name: 'Spanish Mackerel', importance: 'strong', size: '1–4 lb', notes: 'Nearshore.' },
        { name: 'King Mackerel', importance: 'good', size: '15–30 lb', notes: 'Offshore charter.' },
        { name: 'Mahi-Mahi', importance: 'good', size: '5–25 lb', notes: 'Offshore charter.' },
        { name: 'Snapper + Grouper', importance: 'good', size: 'Variable', notes: 'Offshore reefs.' },
      ];
    case 'ga-coastal-pier-jetty':
      return [
        { name: 'Spanish Mackerel', importance: 'signature', size: '1–4 lb', notes: 'Spring + fall schools.' },
        { name: 'Red Drum (Bull)', importance: 'signature', size: '30–48"+', notes: 'Fall surf run.' },
        { name: 'Bluefish', importance: 'strong', size: '2–8 lb', notes: 'Schools.' },
        { name: 'Sheepshead', importance: 'strong', size: '2–5 lb', notes: 'Pilings.' },
        { name: 'Whiting', importance: 'good', size: 'Hand-size', notes: 'Surf staple.' },
        { name: 'Black Drum', importance: 'good', size: '2–10 lb', notes: 'Surf + pier.' },
        { name: 'King Mackerel (Long Piers)', importance: 'good', size: '15–30 lb', notes: 'St. Simons Pier especially.' },
      ];
    case 'ga-coastal-offshore':
      return [
        { name: 'King Mackerel', importance: 'signature', size: '15–40 lb', notes: 'Charter staple.' },
        { name: 'Mahi-Mahi', importance: 'signature', size: '5–30 lb', notes: 'Summer Gulf Stream.' },
        { name: 'Wahoo', importance: 'strong', size: '20–60 lb', notes: 'High-speed troll.' },
        { name: 'Tuna (Blackfin + Yellowfin)', importance: 'strong', size: '15–80 lb', notes: 'Bluewater.' },
        { name: 'Sailfish', importance: 'good', size: '40–80 lb', notes: 'Less common than FL but realistic.' },
        { name: 'Snapper (Vermilion, Red, Mangrove)', importance: 'strong', size: '14–24"', notes: 'Reef.' },
        { name: 'Grouper (Black + Gag)', importance: 'strong', size: '5–25 lb', notes: 'Reef + structure.' },
        { name: 'Cobia', importance: 'good', size: '20–60 lb', notes: 'Spring run.' },
      ];
    case 'ga-pfa-lake':
      return [
        { name: 'Largemouth Bass', importance: 'signature', size: '1.5–4 lb', notes: 'Florida-strain stocking on many PFAs.' },
        { name: 'Bluegill', importance: 'signature', size: 'Hand-size', notes: 'Spring + summer beds.' },
        { name: 'Shellcracker (Redear)', importance: 'strong', size: 'Hand-size', notes: 'May full-moon spawn.' },
        { name: 'Channel Catfish', importance: 'strong', size: '1–5 lb', notes: 'DNR stocked.' },
        { name: 'Crappie', importance: 'good', size: '0.5–1.5 lb', notes: 'Spring + brush.' },
        { name: 'Rainbow Trout', importance: 'good', size: '10–13" stocked', notes: 'Cool-month stockings on select GA PFAs.' },
      ];
    case 'ga-state-park-lake':
      return [
        { name: 'Largemouth Bass', importance: 'signature', size: '1.5–4 lb', notes: 'Resident.' },
        { name: 'Bluegill', importance: 'signature', size: 'Hand-size', notes: 'Bedding.' },
        { name: 'Channel Catfish', importance: 'strong', size: '1–4 lb', notes: 'Stocked.' },
        { name: 'Crappie', importance: 'good', size: '0.5–1 lb', notes: 'Spring.' },
        { name: 'Rainbow Trout', importance: 'good', size: '10–13" stocked', notes: 'Cool-month stockings on some.' },
      ];
    case 'ga-county-pond':
      return [
        { name: 'Channel Catfish', importance: 'signature', size: '1–5 lb', notes: 'DNR-stocked.' },
        { name: 'Bluegill', importance: 'signature', size: 'Hand-size', notes: 'Reproducing.' },
        { name: 'Largemouth Bass', importance: 'strong', size: '1–3 lb', notes: 'Resident.' },
        { name: 'Crappie', importance: 'good', size: '0.5–1 lb', notes: 'Spring.' },
      ];
  }
  return [];
}

function makeSig(cat) {
  switch (cat) {
    case 'ga-piedmont-reservoir': return ['Spotted Bass', 'Striped Bass'];
    case 'ga-mountain-reservoir': return ['Smallmouth Bass', 'Spotted Bass', 'Walleye'];
    case 'ga-chattahoochee-chain': return ['Striped Bass', 'Spotted Bass'];
    case 'ga-southwest-reservoir': return ['Largemouth Bass (Florida-strain)', 'Crappie'];
    case 'ga-savannah-chain': return ['Striped Bass', 'Largemouth Bass'];
    case 'ga-mountain-trout-stream': return ['Wild Trout (Rainbow + Brown + Brook)'];
    case 'ga-tailwater-trout': return ['Trout (Rainbow + Brown)'];
    case 'ga-piedmont-river': return ['Shoal Bass', 'Smallmouth Bass'];
    case 'ga-coastal-plain-river': return ['Largemouth Bass', 'Redbreast Sunfish', 'Trophy Flathead'];
    case 'ga-coastal-sound': return ['Redfish', 'Speckled Trout'];
    case 'ga-coastal-flat': return ['Redfish (Flood-Tide)', 'Speckled Trout'];
    case 'ga-coastal-river-brackish': return ['Redfish', 'Speckled Trout'];
    case 'ga-coastal-town': return ['Redfish', 'Speckled Trout', 'Flounder'];
    case 'ga-coastal-pier-jetty': return ['Spanish Mackerel', 'Red Drum'];
    case 'ga-coastal-offshore': return ['King Mackerel', 'Mahi-Mahi'];
    case 'ga-pfa-lake': return ['Largemouth Bass', 'Bluegill'];
    case 'ga-state-park-lake': return ['Largemouth Bass', 'Bluegill'];
    case 'ga-county-pond': return ['Channel Catfish', 'Bluegill'];
  }
  return [];
}

function makeType(cat) {
  switch (cat) {
    case 'ga-piedmont-reservoir':
    case 'ga-mountain-reservoir':
    case 'ga-chattahoochee-chain':
    case 'ga-southwest-reservoir':
    case 'ga-savannah-chain':
    case 'ga-pfa-lake':
    case 'ga-state-park-lake':
    case 'ga-county-pond':
      return 'reservoir';
    case 'ga-mountain-trout-stream':
    case 'ga-piedmont-river':
    case 'ga-coastal-plain-river':
      return 'river';
    case 'ga-tailwater-trout':
      return 'tailwater';
    case 'ga-coastal-sound':
    case 'ga-coastal-flat':
    case 'ga-coastal-river-brackish':
    case 'ga-coastal-town':
    case 'ga-coastal-pier-jetty':
    case 'ga-coastal-offshore':
      return 'saltwater';
  }
  return 'reservoir';
}

function buildGA({ id, name, region, county, acres, maxDepthFt, lat, lng, cat, notes, brackish }) {
  const isBrackish = !!brackish || cat === 'ga-coastal-river-brackish' || cat === 'ga-coastal-sound' || cat === 'ga-coastal-flat';
  const fullNotes = notes
    ? (isBrackish ? `[BRACKISH ZONE] ${notes}` : notes)
    : (isBrackish
      ? `[BRACKISH ZONE] ${name} — ${cat.replace(/-/g, ' ')} character Georgia water with mixed fresh/saltwater influence.`
      : `${name} — ${cat.replace(/-/g, ' ')} character Georgia water.`);
  return {
    id,
    name,
    state: 'GA',
    region,
    type: makeType(cat),
    county,
    acres: acres ?? null,
    maxDepthFt: maxDepthFt ?? null,
    lat, lng,
    signatureSpecies: makeSig(cat),
    species: makeSpecies(cat),
    patterns: makePatterns(cat, name),
    access: ['Public access — see GA DNR Wildlife Resources Division atlas for ramps + piers + shoreline'],
    regulations: 'GA fishing license required. Trout permit required on trout waters. Saltwater fishing license + appropriate stamps for coastal. Redfish slot 14–23", 5/day. Speckled trout 13" minimum, 15/day. Tarpon C&R only. Check GA DNR.',
    managementProgram: ['Georgia DNR Wildlife Resources Division management', isBrackish ? 'Brackish-zone — mixed salinity fishery' : null].filter(Boolean),
    notes: fullNotes,
  };
}

module.exports = { buildGA };
