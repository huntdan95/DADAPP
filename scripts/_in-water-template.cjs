// Indiana waterbody template engine.
// Categories encode the FISHING CHARACTER of IN waters:
//  - glacial-lake-ne: NE Indiana natural glacial lakes (Steuben, LaGrange, Noble, Kosciusko)
//      Panfish-rich, bass good, some walleye stocking, some smallmouth in deep clear ones
//  - glacial-lake-walleye: glacial lakes with strong walleye populations
//  - southern-reservoir: south IN reservoir (Patoka, Monroe, Brookville, Hardy)
//      Largemouth-heavy, crappie strong, catfish, hybrid stripers in some
//  - central-reservoir: central IN reservoir (Geist, Morse, Eagle Creek, Cataract)
//      Suburban lake — mixed species, public access focus
//  - strip-pit: south IN coal-mine strip pit lake (Greene-Sullivan, Pike, etc.)
//      Bass + bluegill, deep clear water, structure
//  - lake-mi-trib: Lake Michigan tributary (steelhead + salmon in season)
//  - wabash-pool: Wabash River pool / Ohio River
//      Smallmouth, catfish (trophy blues + flatheads), sauger
//  - white-river-segment: White River system
//      Smallmouth (upper), catfish, occasional largemouth
//  - prairie-stream: smaller prairie stream
//      Smallmouth, rockbass, panfish
//  - in-natural-warm-lake: shallow warmwater natural lake (bass + panfish + cats)
//  - state-park-lake-in: Indiana state park / DNR lake

function makePatterns(cat, name) {
  switch (cat) {
    case 'glacial-lake-ne':
      return [
        { title: 'Spring Bluegill Spawn — Sight-Bedding', target: 'Bluegill', when: 'Late May – June full moon', technique: 'Small jigs (1/64 oz) under a slip bobber, redworms, or wax worms over visible beds. 4 lb mono.', where: 'Shallow gravel/sand pockets along the shoreline; bedding colonies of 20–50 fish.', details: `${name} is an NE Indiana glacial lake — clear water + sand-gravel substrate creates classic visible bluegill spawn habitat. Easy kid fishing.` },
        { title: 'Summer Largemouth — Pad Edges & Weed Lines', target: 'Largemouth Bass', when: 'June – September', technique: 'Texas-rigged worms and Senkos along outside weed edges in 8–14 ft; topwater frogs over pad fields in early morning.', where: 'Lily pads, milfoil, and coontail edges.', details: 'NE Indiana glacial lakes have classic vegetation — find the outside edge of grass on a contour break and you find the largemouth.' },
        { title: 'Ice Bluegills + Crappie', target: 'Bluegill and Crappie', when: 'December – early March', technique: 'Tungsten jigs (1/32 oz tipped with wax worm or spike) on a sensitive ice rod. Find suspending fish on the flasher.', where: 'Deep basin holes — typically 18–32 ft.', details: 'Indiana glacial lakes are ice-fishing destinations. Steuben County alone produces tons of basin-ice slabs each winter.' },
        { title: 'Walleye — Trolling Crawlers', target: 'Walleye', when: 'May – September', technique: 'Worm harness trolled at 1.0–1.5 mph along weed edges and breakline. Crawler color matched to water clarity.', where: 'Deep weed lines, 12–20 ft.', details: 'Many NE IN lakes have stocked walleye that grow to legal eating size.' },
      ];
    case 'glacial-lake-walleye':
      return [
        { title: 'Walleye Crawler Trolling', target: 'Walleye', when: 'May – October', technique: 'Worm harness (single Colorado blade, two-hook) trolled at 1.0–1.5 mph along breakline. Jig + minnow vertical in summer.', where: 'Breakline transitions, deep weed edges, mid-lake humps.', details: `${name} has good walleye numbers — IDNR stocking + natural reproduction in some. Walleye are the cool-water signature.` },
        { title: 'Bass + Panfish Mixed Bag', target: 'Largemouth Bass and Bluegill', when: 'May – September', technique: 'Same NE IN glacial-lake patterns — Senkos and Texas rigs for bass; jigs and live bait for panfish.', where: 'Weed edges, pads.', details: 'Walleye lake doesn\'t mean walleye-only — bass and bluegill are productive too.' },
        { title: 'Ice Walleye + Perch', target: 'Walleye and Yellow Perch', when: 'December – March', technique: 'Tip-ups with shiners for walleye on the breakline; jigging spoons (Jigging Rapala, Buckshot Rattlespoon) for active perch.', where: 'Deep weed edge transition zones.', details: 'Ice walleye on Indiana lakes — niche but productive.' },
      ];
    case 'southern-reservoir':
      return [
        { title: 'Largemouth — Standing Timber + Coves', target: 'Largemouth Bass', when: 'Spring – Fall', technique: 'Jigs and Texas-rigged worms around standing timber; spinnerbaits and ChatterBaits in muddy creek arms; topwater early.', where: 'Standing timber stands, creek mouths, coves.', details: `${name} is a south Indiana reservoir — many have significant standing timber and good largemouth habitat.` },
        { title: 'Crappie — Brush + Coves', target: 'Crappie', when: 'March – May spawn; year-round', technique: 'Long-pole jigging 1/16-oz jigs around brush; minnows + slip-bobber in spawn-shallow water.', where: 'Creek-arm brush, shallow cover in spring.', details: 'South IN reservoirs produce solid crappie with regular slabs in 1–2 lb class.' },
        { title: 'Catfish — Creek Channels', target: 'Channel Catfish', when: 'Year-round, peak summer', technique: 'Cut bait, chicken liver, or commercial dough on bottom rigs.', where: 'Creek channel mouths, deep holes.', details: 'Channel cat staple; some lakes hold flathead too.' },
        { title: 'Hybrid Stripers (Where Stocked)', target: 'Hybrid Striped Bass', when: 'Spring run + summer schooling', technique: 'Topwater (Spook), big swimbaits, live shad. Trolling in summer.', where: 'Open water, main lake.', details: 'IDNR stocks hybrid stripers on select reservoirs — fast-growing and aggressive.' },
      ];
    case 'central-reservoir':
      return [
        { title: 'Suburban Lake Largemouth', target: 'Largemouth Bass', when: 'Year-round', technique: 'Worms, ChatterBaits, jerkbaits around riprap, docks, and creek mouths. Heavy fishing pressure means finesse helps.', where: 'Riprap shorelines, docks, points.', details: `${name} is a central Indiana suburban reservoir — pressured but productive. Smaller average fish than south-IN lakes.` },
        { title: 'Crappie Around Docks', target: 'Crappie', when: 'Spring spawn + fall', technique: 'Light line, small jigs under bobbers near dock and pier structure.', where: 'Boat docks, marina piers.', details: 'Docks = year-round structure on central-IN reservoirs.' },
        { title: 'Catfish + Bullhead', target: 'Channel Catfish', when: 'Year-round', technique: 'Cut bait or chicken liver on bottom.', where: 'Shoreline, channel mouths.', details: 'Stocked + reproducing — easy bank fishing.' },
      ];
    case 'strip-pit':
      return [
        { title: 'Deep Clear Strip-Pit Bass', target: 'Largemouth Bass', when: 'May – October', technique: 'Texas-rigged plastics on shoreline drops; drop-shot in summer on deep structure; jerkbaits in cooler months.', where: 'Steep bank drops, submerged structure (old equipment, ledges).', details: `${name} is a south Indiana strip pit — old coal mine flooded into clear deep water. Often very deep (60–100+ ft), clean, with steep drop-offs. Distinctive fishery.` },
        { title: 'Bluegill + Sunfish — Spring Bedding', target: 'Bluegill', when: 'Late May – June', technique: 'Crickets, worms, and small jigs over visible beds.', where: 'Shallow flats — limited in deep strip pits.', details: 'Strip pits often have stable bluegill populations.' },
      ];
    case 'lake-mi-trib':
      return [
        { title: 'Fall Steelhead + Salmon Run', target: 'Steelhead and Salmon', when: 'September – December (King + Coho); steelhead Oct – April', technique: 'Drift skein, single salmon eggs, or marshmallow + sand-shrimp combos under a float. Fly: egg patterns, stoneflies, sucker-spawn imitations.', where: 'Pool tail-outs, runs, and pocket water below riffles.', details: `${name} is a Lake Michigan tributary — Indiana stocks steelhead and salmon through this watershed. The fall run is the season most anglers fish.` },
        { title: 'Spring Steelhead — Spawning Runs', target: 'Steelhead', when: 'March – early May', technique: 'Same float-and-eggs approach. Spawning fish hold on gravel — be ethical and avoid actively bedding fish.', where: 'Gravel riffles and tailouts.', details: 'Spring run brings dropback steelhead back through the system. Quality bite if you time water levels.' },
        { title: 'Brown Trout Holdover', target: 'Brown Trout', when: 'Fall – early spring', technique: 'Spawn sacs, single eggs, or streamers. Browns are less abundant than steelhead but real.', where: 'Deeper pools.', details: 'Indiana tribs hold occasional browns.' },
      ];
    case 'wabash-pool':
      return [
        { title: 'Wabash Smallmouth — Riffle + Pool', target: 'Smallmouth Bass', when: 'May – October', technique: 'Float fish: tubes (3" pumpkin/brown), Ned rigs, square-bills in stained water. Topwater (Whopper Plopper) early.', where: 'Rocky riffle-pool transitions, current breaks.', details: `${name} is Wabash River smallmouth water — Indiana\'s wild river smallmouth fishery is excellent. Float by kayak or jon boat.` },
        { title: 'Trophy Catfish — Channel Bends', target: 'Catfish (Blue and Flathead)', when: 'Year-round, peak fall', technique: 'Fresh cut shad or skipjack on Santee rigs; live bluegill for flatheads.', where: 'Deep bend holes, log jams.', details: 'Lower Wabash and Ohio River systems hold trophy blues and flatheads.' },
        { title: 'Spring Sauger Run', target: 'Sauger', when: 'February – April', technique: 'Vertical jig (1/4-oz jig + minnow) in current breaks. Trolling crawlers in slack water.', where: 'Tailwaters below dams, current edges.', details: 'Ohio and lower Wabash sauger runs — classic late-winter / early-spring fishery.' },
      ];
    case 'white-river-segment':
      return [
        { title: 'White River Smallmouth', target: 'Smallmouth Bass', when: 'May – October', technique: 'Tubes, Ned rigs, fluke. Float a kayak or wade.', where: 'Rocky pools, current breaks.', details: `${name} is a White River segment — upper White River has wild smallmouth; lower has more channel-catfish character.` },
        { title: 'Catfish + Largemouth', target: 'Channel Catfish and Largemouth', when: 'Year-round', technique: 'Cut bait for cats; soft plastics around log jams for bass.', where: 'Deep holes, slack water, log jams.', details: 'Mixed-bag river fishing.' },
      ];
    case 'prairie-stream':
      return [
        { title: 'Stream Smallmouth + Rockbass', target: 'Smallmouth Bass and Rock Bass', when: 'May – October', technique: 'Float-fish small tubes and Ned rigs. Topwater early.', where: 'Riffle-pool transitions.', details: `${name} is a prairie/farm-country stream — classic Midwest smallmouth water for those who learn the float.` },
      ];
    case 'in-natural-warm-lake':
      return [
        { title: 'Bluegill + Largemouth Combo', target: 'Bluegill and Largemouth Bass', when: 'May – September', technique: 'Live bait and small jigs for bream; Texas rigs and topwater for bass.', where: 'Weed lines and lily pad edges.', details: `${name} is a shallow warmwater Indiana lake — panfish + bass.` },
        { title: 'Channel Catfish — Stocked Action', target: 'Channel Catfish', when: 'Year-round', technique: 'Chicken liver, worms, or commercial bait.', where: 'Shoreline and channel mouths.', details: 'Stocked by IDNR.' },
      ];
    case 'state-park-lake-in':
      return [
        { title: 'State Park Family Fishery', target: 'Bluegill, Bass, Catfish', when: 'Year-round', technique: 'Worms and crickets for bream; small lures for bass; stink bait for cats.', where: 'Shoreline, pier, dam.', details: `${name} is an Indiana state-park or DNR-managed lake — easy access, family fishing, regular IDNR stocking.` },
      ];
  }
  return [];
}

function makeSpecies(cat) {
  switch (cat) {
    case 'glacial-lake-ne':
      return [
        { name: 'Bluegill', importance: 'signature', size: 'Hand-size 7–9"', notes: 'Classic NE Indiana glacial-lake bluegill — sand/gravel spawning beds in May–June.' },
        { name: 'Largemouth Bass', importance: 'signature', size: '2–5 lb', notes: 'Weedline/lily-pad fishery.' },
        { name: 'Crappie', importance: 'strong', size: '0.5–1.5 lb', notes: 'Spring spawn + basin in summer.' },
        { name: 'Yellow Perch', importance: 'good', size: '7–10"', notes: 'Deep basin in summer.' },
        { name: 'Walleye', importance: 'good', size: '14–22"', notes: 'IDNR-stocked in some lakes.' },
        { name: 'Northern Pike', importance: 'good', size: '24–32"', notes: 'Present in many NE IN lakes.' },
        { name: 'Channel Catfish', importance: 'good', size: '1–5 lb', notes: 'Stocked.' },
      ];
    case 'glacial-lake-walleye':
      return [
        { name: 'Walleye', importance: 'signature', size: '15–22"; trophy 26"+', notes: 'IDNR-stocked walleye fishery with natural reproduction in some lakes.' },
        { name: 'Yellow Perch', importance: 'strong', size: '8–11"', notes: 'Quality perch in deep basins.' },
        { name: 'Bluegill', importance: 'strong', size: 'Hand-size', notes: 'Standard glacial-lake panfish.' },
        { name: 'Largemouth Bass', importance: 'strong', size: '2–5 lb', notes: 'Weed edges.' },
        { name: 'Crappie', importance: 'good', size: '0.5–1.5 lb', notes: 'Spring + summer basin.' },
        { name: 'Northern Pike', importance: 'good', size: '24–32"', notes: 'Cool water.' },
      ];
    case 'southern-reservoir':
      return [
        { name: 'Largemouth Bass', importance: 'signature', size: '2–6 lb', notes: 'Standing timber and creek arms.' },
        { name: 'Crappie', importance: 'signature', size: '0.5–2 lb', notes: 'Brush + cover.' },
        { name: 'Channel Catfish', importance: 'strong', size: '2–8 lb', notes: 'Creek channels.' },
        { name: 'Bluegill', importance: 'strong', size: 'Hand-size', notes: 'Cove spawn.' },
        { name: 'Hybrid Striped Bass', importance: 'good', size: '5–12 lb', notes: 'Stocked on select lakes.' },
        { name: 'Flathead Catfish', importance: 'good', size: 'Trophy 30+ lb possible', notes: 'In larger reservoirs.' },
        { name: 'Walleye / Sauger', importance: 'good', size: '15–22"', notes: 'In select reservoirs (Patoka has walleye).' },
      ];
    case 'central-reservoir':
      return [
        { name: 'Largemouth Bass', importance: 'signature', size: '1.5–4 lb', notes: 'Resident population.' },
        { name: 'Crappie', importance: 'strong', size: '0.5–1.5 lb', notes: 'Docks and brush.' },
        { name: 'Channel Catfish', importance: 'strong', size: '2–6 lb', notes: 'Stocked.' },
        { name: 'Bluegill', importance: 'strong', size: 'Hand-size', notes: 'Easy bank fishing.' },
        { name: 'Hybrid Striped Bass', importance: 'good', size: '5–10 lb', notes: 'Stocked on some.' },
        { name: 'White Bass', importance: 'good', size: '1–2 lb', notes: 'Stocked or run-up.' },
      ];
    case 'strip-pit':
      return [
        { name: 'Largemouth Bass', importance: 'signature', size: '2–6 lb', notes: 'Deep clear water — quality bass with size.' },
        { name: 'Bluegill', importance: 'strong', size: 'Hand-size', notes: 'Reproducing.' },
        { name: 'Channel Catfish', importance: 'good', size: '1–5 lb', notes: 'Stocked on managed pits.' },
        { name: 'Redear (Shellcracker)', importance: 'good', size: 'Hand-size', notes: 'In some pits.' },
      ];
    case 'lake-mi-trib':
      return [
        { name: 'Steelhead', importance: 'signature', size: '6–12 lb typical; trophies 15+ lb', notes: 'Stocked by IDNR — fall + spring runs.' },
        { name: 'Chinook (King) Salmon', importance: 'strong', size: '8–20 lb', notes: 'Fall spawning run.' },
        { name: 'Coho Salmon', importance: 'strong', size: '4–10 lb', notes: 'Fall run.' },
        { name: 'Brown Trout', importance: 'good', size: '4–10 lb; trophies', notes: 'Holdover and stocked.' },
        { name: 'Smallmouth Bass', importance: 'good', size: '1–3 lb', notes: 'Summer fishery — lower tribs.' },
      ];
    case 'wabash-pool':
      return [
        { name: 'Smallmouth Bass', importance: 'signature', size: '12–18"; trophy 20"+', notes: 'Wild Wabash smallmouth — outstanding fishery.' },
        { name: 'Channel Catfish', importance: 'signature', size: '2–10 lb', notes: 'Abundant.' },
        { name: 'Blue Catfish', importance: 'strong', size: 'Trophy 30–60+ lb', notes: 'Lower Wabash + Ohio.' },
        { name: 'Flathead Catfish', importance: 'strong', size: 'Trophy 30–50+ lb', notes: 'Log jams and deep holes.' },
        { name: 'Sauger', importance: 'strong', size: '15–22"', notes: 'Spring run in lower river.' },
        { name: 'Largemouth Bass', importance: 'good', size: '2–5 lb', notes: 'Backwaters.' },
        { name: 'Walleye', importance: 'good', size: '15–22"', notes: 'In some Wabash segments.' },
      ];
    case 'white-river-segment':
      return [
        { name: 'Smallmouth Bass', importance: 'signature', size: '12–17"', notes: 'Wild river smallmouth in upper White.' },
        { name: 'Rock Bass', importance: 'strong', size: '6–10"', notes: 'Excellent populations.' },
        { name: 'Channel Catfish', importance: 'strong', size: '2–8 lb', notes: 'Abundant lower river.' },
        { name: 'Largemouth Bass', importance: 'good', size: '2–4 lb', notes: 'Slack water.' },
        { name: 'Flathead Catfish', importance: 'good', size: '20–50 lb', notes: 'Lower river log jams.' },
      ];
    case 'prairie-stream':
      return [
        { name: 'Smallmouth Bass', importance: 'signature', size: '10–14"', notes: 'Wild prairie-stream smallmouth.' },
        { name: 'Rock Bass', importance: 'strong', size: '6–9"', notes: 'Abundant.' },
        { name: 'Sunfish', importance: 'strong', size: 'Hand-size', notes: 'Longear, green sunfish common.' },
        { name: 'Channel Catfish', importance: 'good', size: 'Channel cats', notes: 'Deeper pools.' },
      ];
    case 'in-natural-warm-lake':
      return [
        { name: 'Largemouth Bass', importance: 'signature', size: '1.5–4 lb', notes: 'Shallow weedline bass.' },
        { name: 'Bluegill', importance: 'signature', size: 'Hand-size', notes: 'Spring spawn.' },
        { name: 'Channel Catfish', importance: 'strong', size: '1–5 lb', notes: 'Stocked.' },
        { name: 'Crappie', importance: 'good', size: '0.5–1 lb', notes: 'Spring.' },
      ];
    case 'state-park-lake-in':
      return [
        { name: 'Bluegill', importance: 'signature', size: 'Hand-size', notes: 'Easy access.' },
        { name: 'Largemouth Bass', importance: 'signature', size: '1.5–4 lb', notes: 'Resident.' },
        { name: 'Channel Catfish', importance: 'strong', size: '1–4 lb', notes: 'Stocked.' },
        { name: 'Crappie', importance: 'good', size: '0.5–1 lb', notes: 'Spring.' },
        { name: 'Rainbow Trout', importance: 'good', size: '10–13"', notes: 'Cold-month stockings on select state-park lakes.' },
      ];
  }
  return [];
}

function makeSig(cat) {
  switch (cat) {
    case 'glacial-lake-ne': return ['Bluegill', 'Largemouth Bass'];
    case 'glacial-lake-walleye': return ['Walleye', 'Yellow Perch'];
    case 'southern-reservoir': return ['Largemouth Bass', 'Crappie'];
    case 'central-reservoir': return ['Largemouth Bass', 'Channel Catfish'];
    case 'strip-pit': return ['Largemouth Bass'];
    case 'lake-mi-trib': return ['Steelhead'];
    case 'wabash-pool': return ['Smallmouth Bass', 'Catfish'];
    case 'white-river-segment': return ['Smallmouth Bass'];
    case 'prairie-stream': return ['Smallmouth Bass'];
    case 'in-natural-warm-lake': return ['Bluegill', 'Largemouth Bass'];
    case 'state-park-lake-in': return ['Bluegill', 'Largemouth Bass'];
  }
  return [];
}

function makeType(cat) {
  switch (cat) {
    case 'glacial-lake-ne':
    case 'glacial-lake-walleye':
    case 'in-natural-warm-lake':
      return 'natural-lake';
    case 'southern-reservoir':
    case 'central-reservoir':
    case 'strip-pit':
    case 'state-park-lake-in':
      return 'reservoir';
    case 'lake-mi-trib':
    case 'wabash-pool':
    case 'white-river-segment':
    case 'prairie-stream':
      return 'river';
  }
  return 'natural-lake';
}

function buildIN({ id, name, region, county, acres, maxDepthFt, lat, lng, cat, notes }) {
  return {
    id,
    name,
    state: 'IN',
    region,
    type: makeType(cat),
    county,
    acres: acres ?? null,
    maxDepthFt: maxDepthFt ?? null,
    lat, lng,
    signatureSpecies: makeSig(cat),
    species: makeSpecies(cat),
    patterns: makePatterns(cat, name),
    access: ['Public access — see Indiana DNR Fishing Access Atlas or county recreation department for specific ramps and shoreline'],
    regulations: 'Indiana fishing license required (residents + nonresidents). Trout/salmon stamp required for steelhead/salmon tributaries. Check IDNR for current creel limits and special regs.',
    managementProgram: ['Indiana DNR fishery management'],
    notes: notes || `${name} — ${cat.replace(/-/g, ' ')} character Indiana water.`,
  };
}

module.exports = { buildIN };
