// Tennessee waterbody template engine.
// Categories encode the FISHING CHARACTER of TN waters:
//  - tva-tailwater: cold trout discharge below TVA dams (Norris, Cherokee, Douglas, etc.)
//  - highland-rim-reservoir: deep clear Cumberland-Plateau lakes (smallmouth + spotted bass + striper)
//  - tva-reservoir: TVA mainstem reservoirs (mixed bag — largemouth, crappie, stripers, catfish)
//  - smokies-stream: GSMNP wild trout (rainbow / brown / brook in headwaters)
//  - cherokee-nf-stream: Cherokee National Forest small trout streams
//  - cumberland-plateau-stream: smallmouth + occasional trout (Obed-style)
//  - middle-tn-river: smallmouth + spotted bass + redeye in highland rim rivers
//  - west-tn-lake: largemouth + crappie + catfish (river-flood lake character)
//  - mississippi-oxbow: bayou backwater — bass + crappie + cats
//  - twra-family-lake: small TWRA community pond (bream + bass + cats stocked)
//  - state-park-lake: stocked state-park family fishery

function makePatterns(cat, name) {
  switch (cat) {
    case 'tva-tailwater':
      return [
        { title: 'Midge & Sowbug Nymphing — Cold Discharge', target: 'Trout', when: 'Year-round; best during low/zero generation', technique: 'Two-fly nymph rig: zebra midge (size 18–22) above a sowbug or scud (size 16). Strike indicator at 1.5× water depth. 6X tippet.', where: 'Riffle-pool transitions, current seams, slow tailouts.', details: `TVA cold-water discharge creates year-round trout habitat. ${name} is classic Tennessee tailwater — midges and sowbugs are the foundation food base, nymphed slow and small.` },
        { title: 'Sulphur Hatch (Mid-Spring)', target: 'Trout (Brown + Rainbow)', when: 'Mid-May – late June, peak last 2 hours before dark', technique: 'Fly: #14–18 sulphur dun, sulphur emerger, sulphur spinner. Dead-drift the dun in surface film; swing the emerger through riffles. 6X tippet.', where: 'Riffle-pool transitions, slick tailouts.', details: 'Ephemerella invaria/dorothea sulphur hatch — peaks the South Holston into legendary status. Caney Fork and Hiwassee also get it. Match size as the hatch progresses (16s early, 18s later).' },
        { title: 'BWO (Blue Wing Olive)', target: 'Trout', when: 'October – April; cloudy days', technique: 'Fly: #18–22 BWO dun, RS-2, parachute Adams. Mid-morning to early afternoon.', where: 'Riffle-pool transitions.', details: 'Baetis BWO — the year-round hatch. Cool overcast fall and spring days produce the best dry-fly action.' },
        { title: 'Caddis Hatch (Mother\'s Day Style)', target: 'Trout', when: 'April – May massive flurry; trickle through summer', technique: 'Fly: #14–18 elk hair caddis (tan, olive), LaFontaine sparkle pupa, X-caddis. Skitter or dead-drift.', where: 'Riffles + immediately downstream.', details: 'Brachycentrus + Hydropsyche caddis. Spring blanket hatches on TN tailwaters drive trout crazy.' },
        { title: 'White Fly Hatch (Late Summer)', target: 'Trout', when: 'August – early September dusk emergence', technique: 'Fly: #12–14 white wulff, white parachute, sparse white spinner. Cast upstream of risers; drag-free drift. Spinner fall at dark.', where: 'Slow runs + tailouts.', details: 'Ephoron leukon — late-summer specialty hatch. Works on Caney Fork, South Holston, occasionally Hiwassee.' },
        { title: 'Trico Morning (Tiny Mayfly Spinner)', target: 'Trout', when: 'July – September, 7–10 AM', technique: 'Fly: #20–24 trico spinner. 7X tippet. Long fine leaders, low casts in slow water.', where: 'Slow flats, eddies.', details: 'Tricorythodes spinner fall — the technical morning game on TN tailwaters.' },
        { title: 'Streamer Game — When Water is Up', target: 'Trout (Brown)', when: 'During high generation or stained flow', technique: 'Sink-tip with #4–8 Sex Dungeons, Sculpzillas, or Woolly Buggers in olive/black/white. Strip across current seams.', where: 'Bank cuts, current breaks, log jams.', details: 'When TVA generates, the bigger browns lose caution and chase. Heavier rod (6–7 wt), big flies, short casts.' },
        { title: 'Cicada Emergence Years (Periodic Brood)', target: 'Brown Trout (Trophy)', when: 'Periodic 13/17-year emergences — late May/early June', technique: 'Fly: #4–8 cicada pattern (Project Cicada, Chernobyl ant in black/orange). Plop into bank seams.', where: 'Bank cover under overhanging trees.', details: 'TN tailwaters lining the Cumberland Plateau get cicada emergences (Brood X 2021, Brood XIV 2025/2008). Trophy browns gorge.' },
      ];
    case 'highland-rim-reservoir':
      return [
        { title: 'Deep-Clear Smallmouth — Bluff Points', target: 'Smallmouth Bass', when: 'Year-round; peak Oct – April', technique: 'Drop-shot (Roboworm 4–6") in 25–45 ft, jerkbaits (Megabass Vision 110) in transition, jigging spoons (3/4 oz CC Spoon) in winter, swimbaits over deep structure.', where: 'Main-lake bluff walls, channel-swing points, deep humps.', details: `${name} is highland-rim clear water — smallmouth set up vertically on rock structure. Electronics matter; finesse rules.` },
        { title: 'Striped Bass — Live Shad Down-Rods', target: 'Striped Bass', when: 'May – September', technique: 'Live blueback herring or shad on down-rods at 25–50 ft over main-lake channel. Free-line bait above schooling fish.', where: 'Main-lake river channel, thermocline depth in summer.', details: 'Highland rim TN reservoirs grow large stripers — Tims Ford, Center Hill, Norris, Cordell Hull. Find the bait ball, find the fish.' },
        { title: 'Spotted Bass — Rock + Brush', target: 'Spotted Bass', when: 'Year-round', technique: 'Shaky head, drop-shot, small jerkbaits on main-lake points and brush.', where: 'Mid-lake transition areas.', details: 'Highland rim spots fill the niche between smallmouth on rock and largemouth in cover.' },
        { title: 'Spring Crappie — Brush Piles', target: 'Crappie', when: 'March – May', technique: 'Long-pole jigging 1/16-oz jigs or live minnows around state-marked brush in 10–18 ft.', where: 'Creek mouths, mid-depth brush piles.', details: 'TWRA places brush — Navionics marks many. Find structure, find slabs.' },
      ];
    case 'tva-reservoir':
      return [
        { title: 'Ledge Fishing for Largemouth + Smallmouth', target: 'Largemouth and Smallmouth Bass', when: 'Summer (June – August)', technique: 'Deep crankbaits (Strike King 6XD, 10XD), Carolina rigs, big worms (10" Power Worm), and football jigs on main-river ledges at 12–25 ft.', where: 'Tennessee River ledges, channel-swing points.', details: `The classic TN River ledge bite — ${name} hosts B.A.S.S. tournaments built on this pattern. Find shell beds + current = stack of fish.` },
        { title: 'Crappie on Brush + Stake Beds', target: 'Crappie', when: 'Year-round, peak March – May', technique: 'Vertical jigging 1/16-oz jigs in 10–18 ft brush; minnows and jigs in spring shallow.', where: 'Creek mouths, state-marked brush piles, bridge causeways.', details: 'TVA reservoirs have decades of crappie habitat enhancement.' },
        { title: 'Trophy Catfish — Channel Drifting', target: 'Catfish (Blue and Flathead)', when: 'Year-round, peak fall – winter', technique: 'Fresh cut skipjack or shad on Santee rigs drifted across river-channel ledges (20–45 ft).', where: 'Tennessee or Cumberland river channel.', details: 'TVA reservoirs grow trophy blues — fish to 80+ lb realistic.' },
        { title: 'Striper / Hybrid Schoolers', target: 'Striped Bass and Hybrid Striped Bass', when: 'Fall and winter', technique: 'Topwater spooks and big swimbaits when fish surface; live bait at depth.', where: 'Main-lake humps and points.', details: 'Stocked striper/hybrid fisheries on most TVA lakes.' },
      ];
    case 'smokies-stream':
      return [
        { title: 'Wild Trout on Dries — Plunge Pools', target: 'Trout (Rainbow, Brown, Brook)', when: 'April – October', technique: '3–4 wt fly rod, dry-dropper with Stimulator (size 14) above a Pheasant Tail (size 16). High-stick short drifts.', where: 'Plunge pools, pocket water, current seams behind boulders.', details: `${name} is Smokies wild-trout water — small streams, small fish, big experience. Stealth is everything; the trout are wild and educated.` },
        { title: 'Headwater Brookies', target: 'Brook Trout', when: 'Late spring – early fall', technique: 'Small dries (Adams, Royal Wulff size 16–18), short casts, careful approach. Catch-and-release ethic.', where: 'Highest-elevation tributaries (above 3000 ft typically).', details: 'Southern Appalachian brook trout are a native treasure — found in the smallest, coldest headwater streams of the Smokies.' },
      ];
    case 'cherokee-nf-stream':
      return [
        { title: 'Stocked + Wild Trout — Small-Stream Tactics', target: 'Trout (Rainbow, Brown)', when: 'April – November (open season per regs)', technique: 'Fly: dry-dropper (Stimulator + nymph). Spin: small Mepps/Roostertails (1/16 oz) or single salmon eggs.', where: 'Plunge pools, undercut banks, current seams.', details: `${name} is Cherokee National Forest small-stream trout — TWRA stocks regularly, some wild trout reproduce in cooler tribs.` },
      ];
    case 'cumberland-plateau-stream':
      return [
        { title: 'Plateau Smallmouth — Wading the Shoals', target: 'Smallmouth Bass', when: 'May – October', technique: 'Wade and cast small tubes (3" pumpkinseed), Ned rigs, and crayfish-pattern soft plastics through riffles and pool tail-outs.', where: 'Rocky shoals, deep pools, current breaks below shoals.', details: `${name} is Cumberland Plateau smallmouth water — clear, rocky, intimate. Wade-fishing tradition.` },
        { title: 'Rockbass + Sunfish', target: 'Rock Bass and Sunfish', when: 'May – September', technique: 'Crayfish soft plastics or small flies under indicator. Aggressive fish.', where: 'Pool edges and undercut banks.', details: 'Plateau streams have outstanding rock bass populations — under-appreciated panfish.' },
      ];
    case 'middle-tn-river':
      return [
        { title: 'Middle TN Smallmouth Float', target: 'Smallmouth Bass', when: 'April – October', technique: 'Float a kayak or jon boat. Topwater (Pop-R, Whopper Plopper) at dawn, soft plastics (Ned rig, fluke) through the day, square-bills in stained water.', where: 'Rocky pool tail-outs, mid-pool ledges, current breaks.', details: `${name} is a middle Tennessee smallmouth river — the highland rim has world-class river smallmouth water. Floating is the way.` },
        { title: 'Spotted Bass + Rockbass', target: 'Spotted Bass and Rock Bass', when: 'Year-round', technique: 'Same setups as smallmouth — opportunistic.', where: 'Slack water and current edges.', details: 'Mixed-bag river fishing — variety is part of the day.' },
      ];
    case 'west-tn-lake':
      return [
        { title: 'West TN Largemouth — Lily Pads & Cypress', target: 'Largemouth Bass', when: 'May – October', technique: 'Frogs (SPRO Bronzeye), jigs around cypress knees, ChatterBaits in grass.', where: 'Lily pad fields, cypress stumps, creek arms.', details: `${name} is west Tennessee bayou-character water — bass live in heavy cover. Heavy gear, accurate casts.` },
        { title: 'Crappie — Cypress Knees + Brush', target: 'Crappie', when: 'Year-round, peak spring', technique: 'Long-pole jigging in 4–10 ft around cypress and brush.', where: 'Creek mouths and shoreline timber.', details: 'West TN slabs are legendary — Reelfoot, Kentucky Lake, and the smaller lakes all produce.' },
        { title: 'Catfish — Channel & River', target: 'Catfish', when: 'Year-round', technique: 'Stink bait, chicken liver, or cut shad on bottom rigs.', where: 'River channel and creek mouths.', details: 'Channel cats abundant; flatheads + blues in larger systems.' },
      ];
    case 'mississippi-oxbow':
      return [
        { title: 'Oxbow Largemouth — Cypress Cover', target: 'Largemouth Bass', when: 'Spring – Fall', technique: 'Topwater frogs over mats, weightless flukes around cypress, jigs deep in summer.', where: 'Cypress stumps, lily pads, channel mouth.', details: `${name} is a Mississippi River oxbow — old river channel cut off when the river meandered. Backwater bass living in timber and pads.` },
        { title: 'Crappie Galore', target: 'Crappie', when: 'February – May', technique: 'Long-pole jigging and minnows around cypress and standing timber.', where: 'Standing timber, cypress trees, brush.', details: 'MS River oxbows are crappie factories.' },
      ];
    case 'twra-family-lake':
      return [
        { title: 'Family Stocked Fishery', target: 'Bass, Bluegill, Catfish', when: 'Year-round (lakes stocked spring + fall)', technique: 'Live bait (worms, crickets) for bream and catfish; small jigs and crankbaits for bass.', where: 'Shoreline structure, fishing piers, brush piles.', details: `${name} is a TWRA managed family fishing lake — stocked regularly with channel cats and bream, with a resident largemouth population. Bank-friendly access.` },
      ];
    case 'state-park-lake':
      return [
        { title: 'State Park Stocked Fishery', target: 'Trout (cool months), Bass, Bream, Catfish', when: 'Year-round; trout stocked Nov – Feb where applicable', technique: 'PowerBait or salmon eggs for stocked trout (cool months); worms for bream; small lures for bass.', where: 'Shoreline, dam area, pier.', details: `${name} is a state-park managed fishery — easy access, families welcome. Some lakes get cold-month trout stockings (TWRA).` },
      ];
  }
  return [];
}

function makeSpecies(cat) {
  switch (cat) {
    case 'tva-tailwater':
      return [
        { name: 'Rainbow Trout', importance: 'signature', size: '10–16" typical; trophies 20"+', notes: 'Stocked + holdovers. Cold discharge holds year-round.' },
        { name: 'Brown Trout', importance: 'signature', size: '12–20"; trophies 25"+', notes: 'Some streams have wild reproduction; trophy potential on streamers in high flow.' },
        { name: 'Brook Trout', importance: 'present', size: '8–12"', notes: 'Stocked occasionally; rare.' },
        { name: 'Sculpin / Sowbug forage', importance: 'present', size: 'N/A', notes: 'Primary forage base — informs streamer + nymph color choice.' },
      ];
    case 'highland-rim-reservoir':
      return [
        { name: 'Smallmouth Bass', importance: 'signature', size: '1.5–4 lb; trophy 5+ lb', notes: 'Deep clear water — main-lake bluff structure.' },
        { name: 'Largemouth Bass', importance: 'strong', size: '2–6 lb', notes: 'Creek arms, grass, wood.' },
        { name: 'Spotted Bass', importance: 'strong', size: '1.5–3 lb', notes: 'Rock + brush, mid-lake.' },
        { name: 'Striped Bass', importance: 'strong', size: '10–30 lb; trophy 40+', notes: 'Stocked. Deep main lake.' },
        { name: 'Crappie', importance: 'strong', size: '0.5–2 lb', notes: 'Brush piles and creek mouths.' },
        { name: 'Walleye', importance: 'good', size: '14–22"', notes: 'Stocked in some highland-rim lakes.' },
        { name: 'Catfish', importance: 'good', size: 'Channel + blue + flathead', notes: 'River channel.' },
      ];
    case 'tva-reservoir':
      return [
        { name: 'Largemouth Bass', importance: 'signature', size: '2–6 lb', notes: 'Ledges, grass, creek arms.' },
        { name: 'Smallmouth Bass', importance: 'strong', size: '1.5–4 lb', notes: 'Main-river rock + current.' },
        { name: 'Crappie', importance: 'strong', size: '0.5–1.5 lb', notes: 'Brush + cover.' },
        { name: 'Catfish', importance: 'strong', size: 'Channel + blue + flathead', notes: 'Trophy class possible.' },
        { name: 'Striped Bass / Hybrid', importance: 'good', size: '10–30 lb', notes: 'Stocked.' },
        { name: 'Bluegill / Redear', importance: 'good', size: 'Hand-size and up', notes: 'Spawning beds in May–June.' },
        { name: 'White Bass', importance: 'good', size: '1–2 lb', notes: 'Spring run up tributaries.' },
      ];
    case 'smokies-stream':
      return [
        { name: 'Rainbow Trout', importance: 'signature', size: '6–12" typical', notes: 'Wild reproducing population in most Smokies streams.' },
        { name: 'Brown Trout', importance: 'signature', size: '8–14"; trophies 18+"', notes: 'Wild reproducing — bigger fish hide in deep holes.' },
        { name: 'Brook Trout', importance: 'strong', size: '5–9"', notes: 'Native — found in highest headwaters.' },
      ];
    case 'cherokee-nf-stream':
      return [
        { name: 'Rainbow Trout', importance: 'signature', size: '8–14"', notes: 'TWRA stocked + wild reproduction in cooler tribs.' },
        { name: 'Brown Trout', importance: 'strong', size: '10–16"', notes: 'Some wild reproduction.' },
        { name: 'Smallmouth Bass', importance: 'present', size: '8–14"', notes: 'Lower elevations.' },
      ];
    case 'cumberland-plateau-stream':
      return [
        { name: 'Smallmouth Bass', importance: 'signature', size: '12–16" typical; trophies 18+"', notes: 'Wild river smallmouth — plateau character.' },
        { name: 'Rock Bass', importance: 'signature', size: '6–10"', notes: 'Excellent populations in plateau streams.' },
        { name: 'Spotted Bass', importance: 'good', size: '10–14"', notes: 'Lower-elevation pools.' },
        { name: 'Sunfish', importance: 'good', size: 'Hand-size', notes: 'Longear, redbreast common.' },
      ];
    case 'middle-tn-river':
      return [
        { name: 'Smallmouth Bass', importance: 'signature', size: '12–18"; trophy 20"+', notes: 'World-class wild river smallmouth in middle TN highland-rim rivers.' },
        { name: 'Rock Bass', importance: 'strong', size: '6–10"', notes: 'Abundant.' },
        { name: 'Spotted Bass', importance: 'strong', size: '10–14"', notes: 'Slack-water pools.' },
        { name: 'Largemouth Bass', importance: 'good', size: '2–5 lb', notes: 'Backwaters and slow pools.' },
        { name: 'Catfish', importance: 'good', size: 'Channel cats', notes: 'Pool bottoms.' },
      ];
    case 'west-tn-lake':
      return [
        { name: 'Largemouth Bass', importance: 'signature', size: '2–6 lb', notes: 'Heavy cover; Florida-strain influence on some lakes.' },
        { name: 'Crappie', importance: 'signature', size: '0.5–2 lb', notes: 'West TN slabs.' },
        { name: 'Catfish', importance: 'strong', size: 'Channel + blue + flathead', notes: 'Multiple species.' },
        { name: 'Bream', importance: 'good', size: 'Bluegill + redear', notes: 'Bedding May–June.' },
        { name: 'White Bass', importance: 'good', size: '1–2 lb', notes: 'Spring run in some lakes.' },
      ];
    case 'mississippi-oxbow':
      return [
        { name: 'Largemouth Bass', importance: 'signature', size: '2–8 lb', notes: 'Oxbow trophy potential.' },
        { name: 'Crappie', importance: 'signature', size: '0.5–2 lb', notes: 'Spring spawn outstanding.' },
        { name: 'Catfish', importance: 'strong', size: 'Channel + blue + flathead', notes: 'Big blues from connected MS River.' },
        { name: 'Bream', importance: 'good', size: 'Bluegill + redear', notes: 'Cypress shade.' },
        { name: 'White Bass', importance: 'good', size: '1–2 lb', notes: 'When MS River runs in.' },
      ];
    case 'twra-family-lake':
      return [
        { name: 'Largemouth Bass', importance: 'signature', size: '1–4 lb typical', notes: 'Resident population.' },
        { name: 'Bluegill', importance: 'signature', size: 'Hand-size', notes: 'Stocked + reproducing.' },
        { name: 'Channel Catfish', importance: 'signature', size: '1–5 lb', notes: 'Stocked regularly by TWRA.' },
        { name: 'Crappie', importance: 'good', size: '0.5–1 lb', notes: 'In some lakes.' },
      ];
    case 'state-park-lake':
      return [
        { name: 'Rainbow Trout', importance: 'good', size: '10–14" stocked', notes: 'TWRA winter trout stockings in some state-park lakes.' },
        { name: 'Largemouth Bass', importance: 'signature', size: '1–4 lb', notes: 'Resident population.' },
        { name: 'Bluegill', importance: 'signature', size: 'Hand-size', notes: 'Stocked + reproducing.' },
        { name: 'Channel Catfish', importance: 'strong', size: '1–5 lb', notes: 'Stocked.' },
      ];
  }
  return [];
}

function makeSig(cat) {
  switch (cat) {
    case 'tva-tailwater': return ['Trout (Rainbow and Brown)'];
    case 'highland-rim-reservoir': return ['Smallmouth Bass', 'Striped Bass'];
    case 'tva-reservoir': return ['Largemouth Bass', 'Crappie'];
    case 'smokies-stream': return ['Wild Trout'];
    case 'cherokee-nf-stream': return ['Trout'];
    case 'cumberland-plateau-stream': return ['Smallmouth Bass'];
    case 'middle-tn-river': return ['Smallmouth Bass'];
    case 'west-tn-lake': return ['Largemouth Bass', 'Crappie'];
    case 'mississippi-oxbow': return ['Largemouth Bass', 'Crappie'];
    case 'twra-family-lake': return ['Channel Catfish', 'Bluegill', 'Largemouth Bass'];
    case 'state-park-lake': return ['Bluegill', 'Largemouth Bass'];
  }
  return [];
}

function makeType(cat) {
  switch (cat) {
    case 'tva-tailwater':
    case 'smokies-stream':
    case 'cherokee-nf-stream':
    case 'cumberland-plateau-stream':
    case 'middle-tn-river':
      return cat === 'tva-tailwater' ? 'tailwater' : 'river';
    case 'highland-rim-reservoir':
    case 'tva-reservoir':
      return 'reservoir';
    case 'mississippi-oxbow': return 'natural-lake';
    case 'west-tn-lake':
    case 'twra-family-lake':
    case 'state-park-lake':
      return 'reservoir';
  }
  return 'natural-lake';
}

function buildTN({ id, name, region, county, acres, maxDepthFt, lat, lng, cat, notes }) {
  return {
    id,
    name,
    state: 'TN',
    region,
    type: makeType(cat),
    county,
    acres: acres ?? null,
    maxDepthFt: maxDepthFt ?? null,
    lat, lng,
    signatureSpecies: makeSig(cat),
    species: makeSpecies(cat),
    patterns: makePatterns(cat, name),
    access: ['Public access — see TWRA Boating + Fishing Access Atlas for specific ramps and shoreline'],
    regulations: 'TN fishing license required. Trout license required on stocked trout waters. Check TWRA for current creel limits and special regs.',
    managementProgram: ['TWRA fishery management'],
    notes: notes || `${name} — ${cat.replace(/-/g, ' ')} character TN water.`,
  };
}

module.exports = { buildTN };
