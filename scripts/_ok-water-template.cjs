// Oklahoma waterbody template engine.
// Categories encode OK's distinctive fishing character:
//  - ok-major-reservoir: Texoma, Eufaula, Tenkiller, Grand, Keystone — striper/sand bass/multispecies
//  - ok-western-reservoir: NW + SW OK reservoirs (Foss, Tom Steed, Altus-Lugert, Fort Cobb, Ellsworth, Waurika)
//      Heavy sand bass + hybrid striper + cats character
//  - ok-ouachita-lake: SE OK clear deep lakes (Broken Bow, McGee Creek, Sardis, Pine Creek, Hugo, Wister)
//      Florida-strain bass + striper + spotted bass character
//  - ok-eastern-river: Illinois, Mountain Fork, Glover, Kiamichi — scenic smallmouth + spotted bass
//  - ok-tailwater-trout: Lower Mountain Fork (year-round trout), Blue River, Lake Watonga, Lake Carl Etling
//  - ok-red-river: Red River system — paddlefish (Grand/Hudson/Keystone tributaries), alligator gar, trophy catfish
//  - ok-prairie-lake: small western OK lake — sand bass + crappie + cats
//  - ok-odwc-pond: community / city fishing pond

function makePatterns(cat, name) {
  switch (cat) {
    case 'ok-major-reservoir':
      return [
        { title: 'Striper Topwater Schoolers', target: 'Striped Bass', when: 'May – October peak; year-round in some lakes', technique: 'Pencil poppers (Cordell Pencil Popper), big walking topwaters (Heddon Super Spook), and live shad rigs when fish surface-bust schools. Subsurface: bucktails, big swimbaits, and Alabama rigs.', where: 'Main-lake humps, points, and the river channel near the dam. Tributary mouths in spring.', details: `${name} is OK striper country — Texoma, Keystone, Skiatook, Eufaula, and the rest of OK's striper lakes produce surface blitzes that draw anglers from across the South. Watch the gulls.` },
        { title: 'Sand Bass Spring Run', target: 'White Bass (Sand Bass)', when: 'March – April', technique: 'Small chrome/blue Rat-L-Traps, 1/8-oz jigs with white grubs, in-line spinners. Cast across current at creek mouths.', where: 'Tributary mouths and the river channel at the upper end of the reservoir.', details: 'Oklahoma\'s state fish. The spring run is a tradition — every OK lake feeder runs sand bass. Fish in the millions during peak spawn.' },
        { title: 'Trophy Largemouth — Florida Strain', target: 'Largemouth Bass', when: 'Spring spawn + fall', technique: 'Jigs and big worms around timber and grass; ChatterBaits in stained water; lipless cranks pre-spawn.', where: 'Standing timber, creek arms, brush piles.', details: 'ODWC Florida-strain stocking has built trophy largemouth on Tenkiller, Texoma, Eufaula, McGee Creek, Broken Bow. 8–12+ lb fish realistic.' },
        { title: 'Crappie Brush Piles', target: 'Crappie', when: 'Year-round; peak March – May spawn', technique: 'Long-pole jigging 1/16-oz jigs around state-marked brush piles in 12–22 ft. Minnows under slip-cork in shallow spawn water.', where: 'Creek-arm brush, bridge causeways, state-placed structure (marked on Navionics).', details: 'OK lakes are crappie factories — Eufaula, Grand, Texoma, Fort Gibson, Oologah all produce slabs.' },
        { title: 'Trophy Blue Catfish', target: 'Blue Catfish', when: 'Year-round, peak fall – winter', technique: 'Fresh cut skipjack or shad on Santee rigs, drifted across main-lake humps + channel ledges. Anchor on winter holes.', where: 'Main-lake channel, deep humps, mouth of major tributaries.', details: 'Texoma is the world-class blue cat lake (state record 98 lb came from here). Grand, Keystone, Eufaula all produce 50+ lb fish.' },
      ];
    case 'ok-western-reservoir':
      return [
        { title: 'Sand Bass Spring Run — Tributary Mouths', target: 'White Bass (Sand Bass)', when: 'March – April', technique: 'Small chrome lipless cranks, in-line spinners, white curlytail grubs on 1/8-oz heads.', where: 'Tributary mouths where the river flows into the lake.', details: `${name} is classic western OK sand-bass country — millions run up creek arms each spring to spawn.` },
        { title: 'Hybrid Striped Bass — Open Water', target: 'Hybrid Striped Bass', when: 'May – October', technique: 'Topwater (Spook, Pencil Popper) when schooling; live shad on down-rods at 20–30 ft over channel breaks; big swimbaits.', where: 'Main-lake channel, mid-lake humps, schooling shad pods.', details: 'ODWC stocks hybrid stripers on western OK lakes — fast-growing aggressive fish, perfect for the warm reservoirs.' },
        { title: 'Largemouth — Riprap + Coves', target: 'Largemouth Bass', when: 'Spring – Fall', technique: 'ChatterBaits in stained water, square-bills on riprap, Texas rigs around timber.', where: 'Dam riprap, creek arms, standing timber.', details: 'Western OK lakes run muddy in spring — power-fishing with vibrating baits pays off.' },
        { title: 'Channel + Blue Catfish', target: 'Catfish', when: 'Year-round; trophy blues in winter', technique: 'Cut bait, chicken liver, or stink baits on bottom rigs. Drift for blues in winter.', where: 'Main lake channel, creek arm bends, deep holes.', details: 'Most western OK lakes carry strong catfish populations — chicken-liver bobber + cat-stick simple-fishing tradition.' },
        { title: 'Walleye / Saugeye (Where Stocked)', target: 'Walleye and Saugeye', when: 'Spring + fall + winter night-fishing', technique: 'Jig + minnow off rocky points; trolling worm harnesses or Bandit deep cranks; jigging spoons under shore lights at night.', where: 'Riprap dam, main-lake rock points, jetties.', details: 'ODWC stocks saugeye on multiple western OK reservoirs — Canton, Fort Cobb, Sooner Lake, Waurika. Eating-quality fishery.' },
      ];
    case 'ok-ouachita-lake':
      return [
        { title: 'Deep-Clear Largemouth — Florida Strain', target: 'Largemouth Bass', when: 'Spring spawn + fall + summer night', technique: 'Spring: ChatterBaits, lipless cranks, sight-fishing beds. Summer: deep diving cranks (Strike King 6XD), Carolina rigs, big worms in 15–25 ft. Night: Texas-rigged plastic worms.', where: 'Standing timber, main-lake points, creek mouths.', details: `${name} is SE OK clear-water country — Florida-strain stocking has made these lakes (Broken Bow especially) trophy bass destinations. 10+ lb fish realistic.` },
        { title: 'Striped Bass — Live Shad', target: 'Striped Bass', when: 'Year-round; trophy class', technique: 'Live shad on down-rods at the thermocline (25–50 ft in summer). Big swimbaits and Alabama rigs in cooler months.', where: 'Main-lake channel, deep humps, mouth of major tribs.', details: 'SE OK\'s deep clear reservoirs (Broken Bow, McGee Creek, Sardis) hold strong striped bass populations from ODWC stocking. Less-pressured than Texoma.' },
        { title: 'Spotted Bass on Bluff Walls', target: 'Spotted Bass', when: 'Year-round, peak fall', technique: 'Drop-shot, shaky head, jerkbaits on main-lake bluff sections.', where: 'Vertical rock, bridge structure.', details: 'Ouachita lake bluff-water spotted bass — finesse classics.' },
        { title: 'Crappie Brush Piles', target: 'Crappie', when: 'Spring spawn + year-round on brush', technique: 'Vertical jig brush piles in 12–22 ft.', where: 'Creek-arm brush, bridge structure.', details: 'SE OK crappie are quality fish with strong populations.' },
      ];
    case 'ok-eastern-river':
      return [
        { title: 'Float-Trip Smallmouth', target: 'Smallmouth Bass', when: 'May – October', technique: 'Float a kayak or jon boat. Topwater (Pop-R, Whopper Plopper) at dawn, tubes (3" pumpkin/brown), Ned rigs through the day. Square-bills in stained water.', where: 'Rocky riffle-pool transitions, pool tail-outs, current breaks.', details: `${name} is OK\'s scenic float-fishing country — Illinois River near Tahlequah is the famous one. World-class wild smallmouth + spotted bass + occasional spotted gar.` },
        { title: 'Spotted Bass + Largemouth Pools', target: 'Spotted Bass and Largemouth Bass', when: 'Year-round', technique: 'Soft plastics around log jams + boulder pools; flukes weightless near current breaks.', where: 'Deep pools, log jams, slack water.', details: 'Mixed-bag float fishing — variety is the day.' },
        { title: 'Sunfish + Rock Bass', target: 'Sunfish and Rock Bass', when: 'Spring – Fall', technique: 'Small flies (poppers, nymphs) or bobber-and-cricket setups.', where: 'Pool edges, undercut banks.', details: 'Excellent sunfish populations — longear, green sunfish, redear, rock bass.' },
      ];
    case 'ok-tailwater-trout':
      return [
        { title: 'Stocked Trout on Light Tackle', target: 'Trout (Rainbow + Brown)', when: 'Year-round on year-round trout streams (Lower Mountain Fork); cool months on seasonal streams (Blue River)', technique: 'Fly: dry-dropper (Stimulator + Pheasant Tail), wooly buggers in olive/black, San Juan worms. Spin: in-line spinners (Mepps, Roostertail 1/16 oz), salmon eggs or PowerBait.', where: 'Riffle-pool transitions, current seams.', details: `${name} is one of OK\'s designated trout fisheries — ODWC stocks regularly. The Lower Mountain Fork below Broken Bow Dam is OK\'s only year-round trout fishery with reproducing brown trout.` },
        { title: 'Streamer Game for Bigger Browns', target: 'Brown Trout', when: 'Fall – winter on Lower Mountain Fork', technique: 'Sink-tip line, #4–8 Sex Dungeons, Sculpzillas, articulated streamers in olive/black/white. Strip across seams.', where: 'Bank cuts and deeper pools.', details: 'Lower Mountain Fork holdover and reproducing brown trout — trophy fish on streamers in cold months.' },
      ];
    case 'ok-red-river':
      return [
        { title: 'Paddlefish Snagging', target: 'Paddlefish', when: 'March – May spawn run', technique: 'Stout snag rod, weighted treble hooks (8/0–10/0), strong braid. Rip the hook through the water column in slow steady sweeps. ODWC permit required.', where: 'Below Grand Lake (Twin Bridges), below Keystone Dam, Neosho/Grand River tributaries.', details: `${name} is part of OK\'s legendary paddlefish snagging tradition — ODWC manages a strict permit + tag system. Fish to 100+ lb. Native sport unique to the Mississippi-Arkansas-Red drainage.` },
        { title: 'Trophy Blue Catfish', target: 'Blue Catfish', when: 'Year-round, peak winter', technique: 'Fresh cut shad or skipjack on Santee rigs. Anchor on deep winter holes (25–45 ft).', where: 'River channel bends, deep holes below dams.', details: 'Red River system blue cats are huge — Texoma and the Lake of the Arbuckles tailrace area produce 50–80+ lb fish.' },
        { title: 'Alligator Gar', target: 'Alligator Gar', when: 'Summer (June – September)', technique: 'Cut bait (large carp or buffalo chunks) on a heavy circle hook + steel leader. Patience.', where: 'Deep river holes, oxbows.', details: 'OK has a native alligator gar population in the Red River system — trophy 100+ lb specimens. Catch-and-release ethic strongly encouraged.' },
      ];
    case 'ok-prairie-lake':
      return [
        { title: 'Sand Bass + Crappie Combo', target: 'White Bass and Crappie', when: 'Spring – Fall', technique: 'Small jigs + minnows for crappie around brush. Chrome/blue lipless cranks and inline spinners for sand bass.', where: 'Tributary mouths and brush piles.', details: `${name} is a small western OK reservoir — sand bass + crappie + channel cats are the staple. ODWC manages aggressively.` },
        { title: 'Channel Catfish — Bottom Rigs', target: 'Channel Catfish', when: 'Year-round', technique: 'Chicken liver, stink bait, cut shad on bottom rigs. Trotlines and jugs popular too.', where: 'Channel mouths, deep holes.', details: 'Easy bank fishing — OK staple.' },
      ];
    case 'ok-odwc-pond':
      return [
        { title: 'ODWC Community Pond', target: 'Channel Catfish, Bluegill, Largemouth Bass', when: 'Year-round', technique: 'Worms and crickets for bream; chicken liver for cats; small jigs and crankbaits for bass. ODWC stocks rainbow trout in cool months on select urban ponds.', where: 'Shoreline, fishing piers, dam.', details: `${name} is part of ODWC's "Close to Home Fishing" program — stocked regularly, bank-friendly, kid-and-family-focused.` },
      ];
  }
  return [];
}

function makeSpecies(cat) {
  switch (cat) {
    case 'ok-major-reservoir':
      return [
        { name: 'Largemouth Bass', importance: 'signature', size: '2–6 lb; Florida-strain trophies 8+ lb', notes: 'Standing timber, creek arms, grass.' },
        { name: 'Striped Bass', importance: 'signature', size: '10–40 lb; trophy 50+ on Texoma', notes: 'Naturally reproducing on some lakes (Texoma); stocked on others.' },
        { name: 'White Bass (Sand Bass)', importance: 'signature', size: '1–3 lb', notes: 'OK\'s state fish. Spring tributary run; main-lake schooling.' },
        { name: 'Crappie', importance: 'signature', size: '0.5–2 lb', notes: 'Brush + cover.' },
        { name: 'Blue Catfish', importance: 'strong', size: 'Trophy 30–80+ lb', notes: 'Texoma state-record class fishery.' },
        { name: 'Channel Catfish', importance: 'strong', size: '2–8 lb', notes: 'Stocked + reproducing.' },
        { name: 'Flathead Catfish', importance: 'good', size: 'Trophy 30–60 lb', notes: 'Log jams and deep holes.' },
        { name: 'Smallmouth Bass', importance: 'good', size: '1.5–3 lb', notes: 'In some lakes (Eufaula, Tenkiller).' },
        { name: 'Spotted Bass', importance: 'good', size: '1.5–3 lb', notes: 'Rock + main-lake structure.' },
        { name: 'Walleye', importance: 'good', size: '15–22"', notes: 'Stocked on Eufaula, Hudson, Kaw, Grand.' },
        { name: 'Paddlefish', importance: 'good', size: 'Snagging only — 30–100+ lb', notes: 'Grand, Hudson, Keystone tributaries.' },
      ];
    case 'ok-western-reservoir':
      return [
        { name: 'White Bass (Sand Bass)', importance: 'signature', size: '1–3 lb', notes: 'Western OK staple — spring run + main-lake schooling.' },
        { name: 'Hybrid Striped Bass', importance: 'signature', size: '5–12 lb', notes: 'ODWC stocked. Aggressive open-water predator.' },
        { name: 'Largemouth Bass', importance: 'strong', size: '2–5 lb', notes: 'Creek arms, riprap.' },
        { name: 'Channel Catfish', importance: 'strong', size: '2–6 lb', notes: 'Stocked + reproducing.' },
        { name: 'Blue Catfish', importance: 'good', size: 'Trophy 30+ lb in select lakes', notes: 'Kaw, Foss, Tom Steed.' },
        { name: 'Crappie', importance: 'good', size: '0.5–1.5 lb', notes: 'Brush + cover.' },
        { name: 'Walleye / Saugeye', importance: 'good', size: '15–22"', notes: 'Stocked on Canton, Fort Cobb, Waurika, Sooner.' },
      ];
    case 'ok-ouachita-lake':
      return [
        { name: 'Largemouth Bass', importance: 'signature', size: '2–8 lb; trophies 10–12+ lb', notes: 'Florida-strain stocking — Broken Bow especially. Trophy class.' },
        { name: 'Striped Bass', importance: 'signature', size: '10–35 lb', notes: 'ODWC stocked; thrives in deep clear SE OK reservoirs.' },
        { name: 'Spotted Bass', importance: 'strong', size: '1.5–3 lb', notes: 'Main-lake rock + bluffs.' },
        { name: 'Smallmouth Bass', importance: 'good', size: '1.5–3 lb', notes: 'In some lakes.' },
        { name: 'Crappie', importance: 'strong', size: '0.5–2 lb', notes: 'Brush + cover.' },
        { name: 'Walleye', importance: 'good', size: '15–24"', notes: 'Sardis, McGee Creek strong populations.' },
        { name: 'Channel + Blue Catfish', importance: 'good', size: '2–40+ lb', notes: 'Standard reservoir catfish.' },
      ];
    case 'ok-eastern-river':
      return [
        { name: 'Smallmouth Bass', importance: 'signature', size: '12–17"; trophies 18+"', notes: 'Wild river smallmouth — Illinois, Mountain Fork, Glover famous.' },
        { name: 'Spotted Bass', importance: 'signature', size: '12–16"', notes: 'Mixed in with smallmouth.' },
        { name: 'Largemouth Bass', importance: 'strong', size: '1.5–4 lb', notes: 'Slack-water pools.' },
        { name: 'Sunfish (Longear, Green, Redear)', importance: 'strong', size: 'Hand-size', notes: 'Excellent populations.' },
        { name: 'Rock Bass', importance: 'good', size: '6–10"', notes: 'Pool edges.' },
        { name: 'Channel Catfish', importance: 'good', size: 'Channel cats', notes: 'Deep pools.' },
        { name: 'Spotted Gar', importance: 'good', size: '2–6 lb', notes: 'Slack-water pools.' },
      ];
    case 'ok-tailwater-trout':
      return [
        { name: 'Rainbow Trout', importance: 'signature', size: '10–14" stocked; holdovers to 18"', notes: 'ODWC stocked. Year-round on Lower Mountain Fork; seasonal on Blue River, Lake Watonga.' },
        { name: 'Brown Trout', importance: 'signature', size: '12–20"; trophy 24+"', notes: 'Lower Mountain Fork has reproducing brown trout — OK\'s only wild trout. Trophy class.' },
      ];
    case 'ok-red-river':
      return [
        { name: 'Paddlefish', importance: 'signature', size: '30–100+ lb', notes: 'Snagging during spring run. ODWC strict permit/tag system. OK is a national paddlefish destination.' },
        { name: 'Blue Catfish', importance: 'signature', size: 'Trophy 50–100+ lb', notes: 'Texoma blues legendary; state record 98 lb.' },
        { name: 'Flathead Catfish', importance: 'strong', size: 'Trophy 50–80+ lb', notes: 'Log jams.' },
        { name: 'Alligator Gar', importance: 'strong', size: 'Trophy 50–150+ lb', notes: 'Native Red River population. C&R encouraged.' },
        { name: 'Striped Bass', importance: 'strong', size: '10–35 lb', notes: 'Naturally reproducing in Texoma — runs upriver.' },
        { name: 'White Bass', importance: 'good', size: '1–3 lb', notes: 'Spring runs.' },
      ];
    case 'ok-prairie-lake':
      return [
        { name: 'White Bass (Sand Bass)', importance: 'signature', size: '1–2 lb', notes: 'Spring run.' },
        { name: 'Crappie', importance: 'signature', size: '0.5–1.5 lb', notes: 'Brush + cover.' },
        { name: 'Channel Catfish', importance: 'strong', size: '2–6 lb', notes: 'Stocked + reproducing.' },
        { name: 'Largemouth Bass', importance: 'strong', size: '1.5–4 lb', notes: 'Creek arms.' },
        { name: 'Hybrid Striped Bass', importance: 'good', size: '5–10 lb', notes: 'Stocked on some.' },
      ];
    case 'ok-odwc-pond':
      return [
        { name: 'Channel Catfish', importance: 'signature', size: '1–5 lb', notes: 'ODWC stocked regularly.' },
        { name: 'Bluegill', importance: 'signature', size: 'Hand-size', notes: 'Reproducing.' },
        { name: 'Largemouth Bass', importance: 'strong', size: '1–3 lb', notes: 'Resident.' },
        { name: 'Rainbow Trout', importance: 'good', size: '10–13" stocked', notes: 'Cool-month stockings on select urban ponds (Close to Home program).' },
        { name: 'Saugeye', importance: 'good', size: '14–18"', notes: 'Stocked on some.' },
      ];
  }
  return [];
}

function makeSig(cat) {
  switch (cat) {
    case 'ok-major-reservoir': return ['Striped Bass', 'White Bass (Sand Bass)', 'Largemouth Bass', 'Crappie'];
    case 'ok-western-reservoir': return ['White Bass (Sand Bass)', 'Hybrid Striped Bass'];
    case 'ok-ouachita-lake': return ['Largemouth Bass', 'Striped Bass'];
    case 'ok-eastern-river': return ['Smallmouth Bass', 'Spotted Bass'];
    case 'ok-tailwater-trout': return ['Trout (Rainbow and Brown)'];
    case 'ok-red-river': return ['Paddlefish', 'Blue Catfish', 'Alligator Gar'];
    case 'ok-prairie-lake': return ['White Bass (Sand Bass)', 'Crappie'];
    case 'ok-odwc-pond': return ['Channel Catfish', 'Bluegill'];
  }
  return [];
}

function makeType(cat) {
  switch (cat) {
    case 'ok-major-reservoir':
    case 'ok-western-reservoir':
    case 'ok-ouachita-lake':
    case 'ok-prairie-lake':
    case 'ok-odwc-pond':
      return 'reservoir';
    case 'ok-eastern-river':
    case 'ok-red-river':
      return 'river';
    case 'ok-tailwater-trout':
      return 'tailwater';
  }
  return 'reservoir';
}

function buildOK({ id, name, region, county, acres, maxDepthFt, lat, lng, cat, notes }) {
  return {
    id,
    name,
    state: 'OK',
    region,
    type: makeType(cat),
    county,
    acres: acres ?? null,
    maxDepthFt: maxDepthFt ?? null,
    lat, lng,
    signatureSpecies: makeSig(cat),
    species: makeSpecies(cat),
    patterns: makePatterns(cat, name),
    access: ['Public access — see ODWC Fishing Atlas for specific ramps and shoreline'],
    regulations: 'OK fishing license required. Trout license required on stocked trout streams. Paddlefish requires ODWC permit + tag. Check ODWC for current creel limits and special regulations.',
    managementProgram: ['Oklahoma Department of Wildlife Conservation (ODWC) fishery management'],
    notes: notes || `${name} — ${cat.replace(/-/g, ' ')} character Oklahoma water.`,
  };
}

module.exports = { buildOK };
