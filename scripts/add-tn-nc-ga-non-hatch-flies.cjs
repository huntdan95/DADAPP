/**
 * User-supplied Tennessee + North Carolina + Georgia non-hatch fly bank.
 * This is the Southern Appalachian tier (mountain trout) plus the
 * region-specific warmwater and saltwater fisheries that the user
 * called out by name.
 *
 *   PAD existing entries:
 *     eastern-streamers          (+Kreelex, +Coffey's Sparkle Minnow,
 *                                 +Headbanger Sculpin, +Near Nuff Sculpin,
 *                                 +Mini Dungeon / Boogie Man / Butt Monkey,
 *                                 +Zoo Cougar, +Circus Peanut, +Game Changer,
 *                                 +articulated white streamer for Hiwassee)
 *     eastern-junk-nymphs        (+Y2K, +Egg-Sucking Leech, +Glo Bug,
 *                                 +Sucker Spawn, +Eggstasy, +Pat's Rubber Legs)
 *     eastern-attractor-dries    (+Yellow Stimulator 12-16, +Orange Stimulator,
 *                                 +Royal Stimulator, +Adams Wulff,
 *                                 +Chubby Chernobyl, +Elk Hair Caddis)
 *     tn-cicadas-periodic        (+Spotted Lanternfly cross-ref,
 *                                 +Brood-X notes)
 *     terrestrials-summer        (+Yellow Jacket, +Bee, +cricket variants,
 *                                 +Japanese Beetle, +Charlie Boy,
 *                                 +Morrish, +Letort variants)
 *     midges                     (+Perdigon Euro jig, +tiny PT, +tiny BH HE)
 *     eastern-inchworms          (+sourwood worm note, +Cherokee mtn use)
 *
 *   NEW entries:
 *     southern-appalachian-classics    (Tellico, Yallerhammer, Thunderhead,
 *                                       Adams Variant, Smoky Mtn Forked-Tail,
 *                                       Hazel Creek, Jim Charley, Sheep Fly,
 *                                       Coffey Stone, Pale Yellow Palmer)
 *     southern-mouse-patterns          (TN/NC tailwater night browns)
 *     southern-warmwater-smallmouth    (Harpeth/Duck/French Broad/New/etc.)
 *     southern-tailwater-stripers      (Caney Fork + Hooch below Buford)
 *     ga-flint-shoal-bass              (Endemic shoalies + Stealth Bomber)
 *     nc-roanoke-striper-run           (Spring Roanoke River run)
 *     nc-cherokee-trophy-raven-fork    (Tribal permit trophy water)
 *     southern-saltwater-coast         (Outer Banks + Golden Isles)
 *     southern-yellow-jacket-bee       (Hiwassee + Smokies summer bank work)
 *
 * Run: node scripts/add-tn-nc-ga-non-hatch-flies.cjs
 * Idempotent — only adds flies/entries not already present.
 */

const fs = require('node:fs');
const path = require('node:path');

const FILE = path.join(__dirname, '..', 'data', 'hatches.json');

// ---- Per-entry fly additions ---------------------------------------------

const FLY_ADDITIONS = {
  'eastern-streamers': [
    'Kreelex (Chuck Kraft) — flashy gold/silver attractor; deadly on Clinch + Caney Fork stockers + holdover fish',
    "Coffey's Sparkle Minnow (Conehead Sparkle Minnow) — WNC/NGA-popular flashabou minnow; stripped or swung",
    'Coffey Sparkle Minnow Sculpin — sculpin-tone variant for Davidson + Nantahala',
    'Headbanger Sculpin — gets down quick to where big browns hold on the Toccoa, Hooch, Soque',
    'Fish Skull Sculpin (Headbanger-style) — modern weighted sculpin alternative',
    'Near Nuff Sculpin (Dave Whitlock) — searching sculpin pattern',
    "Galloup's Mini Dungeon — smaller articulated for SoHo / Watauga lower / Caney Fork wading",
    "Galloup's Boogie Man — articulated meat staple for SoHo + Watauga trophy browns",
    "Galloup's Butt Monkey — articulated streamer staple for big browns",
    'Conehead Muddler Minnow — weighted Muddler; classic deep-pocket sculpin',
    'Zoo Cougar (Kelly Galloup) — also a Soque River trophy meat pattern',
    'Circus Peanut (Galloup) — Soque + middle Toccoa trophy meat',
    'Game Changer (Blane Chocklett) — articulated baitfish, trophy-hunter standard',
    'Polar Changer — flashy white Game Changer variant',
    'Articulated White Streamer — recommended specifically for the Hiwassee in fall + winter delayed harvest',
    'Murdich Minnow — striper killer that crosses to trout in stained water',
  ],
  'eastern-junk-nymphs': [
    'Y2K (yellow/orange egg-cluster nymph) — stocker gold across TN, NC, GA delayed harvest',
    'Egg-Sucking Leech (black + chartreuse / black + pink) — stockers + spawn-season trophies',
    'Glo Bug (chartreuse / oregon-cheese / peach) — universal egg cluster',
    'Sucker Spawn (cream / pink) — TN Watauga sucker run; Cherokee Trophy water gold',
    'Eggstasy Egg — modern durable egg, deadly across Southeast delayed-harvest',
    "Pat's Rubber Legs (black / brown / coffee-and-black) — fished as junk attractor; also a real stonefly imitation",
    'Sourwood Worm (chartreuse-green chenille) — Smokies + WNC May-June caterpillar drop',
  ],
  'eastern-attractor-dries': [
    'Yellow Stimulator #12-16 — basically the universal Southern Appalachian dry; matches yellow sallies + stoneflies + caddis',
    'Orange Stimulator — fall pocket-water staple',
    'Royal Stimulator — North GA / upper Toccoa go-to (per Cedar Creek guides)',
    'Adams Wulff — high-floating pocket-water searcher',
    'Chubby Chernobyl — modern foam attractor that doubles as hopper / stonefly',
    'Elk Hair Caddis (tan / olive #14-16) — works as searcher even outside the actual caddis hatches',
  ],
  'tn-cicadas-periodic': [
    'Spotted Lanternfly pattern — invasive crossover; fish read it like a cicada (foam body, white-banded wing)',
    'Brood-X / Brood-XIX foam adult cicada (black body, orange post)',
    'Bee/Yellow Jacket foam adult — overlaps cicada-feeding fish in midsummer',
  ],
  'terrestrials-summer': [
    'Size 10-12 Letort Hopper (Ed Shenk) — original American hopper; bank work',
    "Size 10-12 Dave's Hopper",
    'Size 10-12 Morrish Hopper — modern foam workhorse',
    'Size 8-10 Charlie Boy Hopper — durable foam hopper',
    'Size 10-12 Joe\'s Hopper (Michigan Hopper, Art Winnie ~1900s) — works far south of MI',
    'Size 12 Japanese Beetle (iridescent foam) — peak July across Eastern US',
    'Size 14 Crowe Beetle (deer-hair) — Spring Creek + Yellow Breeches + Smokies',
    'Size 12-14 Foam Cricket — black foam summer pattern',
    'Size 12-14 Yellow Jacket / Bee imitation — Hiwassee bank-fishing summer gold',
    'Size 8-10 Foam Cicada — Brood-emergence years + occasional dog-day fishing',
    'Size 14-16 Flying Ant (cinnamon / black) — August / September flights',
    'Size 12-14 Inchworm (chenille or foam) — May-June sourwood worm drops',
    'Size 12-14 Green Weenie (PA-born, fished hard across Southeast)',
  ],
  midges: [
    'Size 18-22 Perdigon (chartreuse / black / red) — Euro jig nymph; increasingly default on Davidson + Hooch + SoHo',
    'Size 20-22 Pheasant Tail nymph (tiny, BH) — tailwater searching standard',
    "Size 20-22 Bead Head Hare's Ear (tiny) — tailwater searching standard",
    'Size 22 WD-40 midge emerger — Hooch + Toccoa + Caney Fork',
    'Size 22 mating-cluster Griffith\'s gnat',
  ],
  'eastern-inchworms': [
    'Bead-Head Green Weenie variant — heavier version for deeper presentations',
    'Sourwood Worm (chartreuse-green) — May/June drops in N GA, WNC, E TN sourwood-tree creeks',
  ],
};

// ---- New entries ----------------------------------------------------------

const NEW_ENTRIES = [
  {
    id: 'southern-appalachian-classics',
    name: 'Southern Appalachian Classics (Smokies / Cherokee origin)',
    scientific: 'Regional attractor / nymph / wet — generalist patterns',
    regions: ['Southern Appalachia'],
    states: ['TN', 'NC', 'GA', 'KY', 'AL', 'SC', 'VA'],
    rivers: [
      'Tellico River',
      'Hiwassee River',
      'Little River (Smokies)',
      'Davidson River',
      'Hazel Creek',
      'Pigeon River',
      'Big East Fork',
      'Nantahala River',
      'Toccoa River',
      'Chattooga River',
      'Noontootla Creek',
      'Little Cataloochee',
    ],
    startMonth: 1,
    endMonth: 12,
    waterTempMinF: 38,
    waterTempMaxF: 72,
    timeOfDay: 'all day',
    stages: ['attractor'],
    flies: [
      'Tellico Nymph — the most famous TN fly; golden stonefly imitation, fishes year-round as a searching nymph (Tellico River, East TN, 1940s or earlier)',
      'Yallerhammer / Yellowhammer — Cherokee + Scotch-Irish origin; originally split-feather of yellow-shafted flicker (now illegal — dyed dove/quail used), fished as wet fly attractor',
      'Thunderhead — Fred Hall (Great Smokies); high-floating Adams-Wulff style; brookie smasher and general mayfly attractor',
      "Adams Variant — Fred Hall's other classic high-floater for Smokies pocket water",
      'Smoky Mountain Forked-Tail — mallard wings, blue dun hackle, orange body, forked mallard tail; pure Smokies attractor',
      "Hazel Creek (Roger Lowe, Waynesville NC) — white hackle-tip wings, yellow poly body, grizzly+brown hackle; named for Hazel Creek into Fontana Lake",
      'Jim Charley — Pigeon River / Big East Fork / Davidson River local pattern; old-school Appalachian dry',
      'Sheep Fly — old Cherokee / Appalachian wet-fly attractor',
      "Coffey Stone Nymph (Frank Coffey, NC) — latex-bodied stonefly imitation; originally tied from latex scrap at the old Waynesville Dayco plant",
      'Pale Yellow Palmer — Little Cataloochee classic; bright yellow palmer attractor',
      'Yellow Palmer — Smokies wet-fly palmer attractor (Pale Yellow Palmer variant)',
    ],
    searchTerm: 'Tellico nymph Yellowhammer Thunderhead Smokies Cherokee Appalachian fly',
    wikipediaSlug: null,
    notes:
      'The Southern Appalachian fly canon — these patterns are the regional DNA shared across TN, NC, GA, KY, and southwestern VA. The Tellico Nymph and Yallerhammer are the two most distinctive — both predate modern fly fishing and trace back to the Cherokee and Scotch-Irish settlers of the southern mountains. Fred Hall (Smokies) and Roger Lowe (Waynesville NC) gave us the modern high-floaters; Frank Coffey gave us the latex-bodied stonefly out of the old Dayco plant in Waynesville. Yellow + Adams + bushy hackle is the recipe for all of them.',
  },
  {
    id: 'southern-mouse-patterns',
    name: 'Southern Tailwater Mouse Patterns (night browns)',
    scientific: 'Peromyscus / Mus — rodent surface imitation',
    regions: ['Southern Appalachia'],
    states: ['TN', 'NC', 'GA'],
    rivers: [
      'Caney Fork River',
      'Clinch River',
      'Watauga River',
      'South Holston River',
      'Davidson River',
      'Soque River',
      'Toccoa River',
      'Chattahoochee River (lower)',
    ],
    startMonth: 5,
    endMonth: 10,
    waterTempMinF: 55,
    waterTempMaxF: 70,
    timeOfDay: 'night',
    stages: ['mouse'],
    flies: [
      "Lynch's White-Bellied Mouse (Tommy Lynch) — trophy-brown specialist; works on tailwaters far south of MI",
      'Morrish Mouse — the most-fished southern night-brown pattern',
      'Master Splinter (articulated) — articulated mouse for big-water swings',
      'Mr. Hanky (articulated) — Soque / lower Davidson night pattern',
      'Standard deer-hair mouse — old reliable',
      'Mouse Rat — classic, fish it cross-current and dead-drift',
    ],
    searchTerm: 'mouse pattern Caney Fork Clinch Watauga Davidson night brown trout',
    wikipediaSlug: null,
    notes:
      "Less established than the MI mouse culture, but the night game is real on Southern tailwaters. Big browns roam at night on the Caney Fork, Clinch, Watauga, SoHo, and Davidson. Best on warm humid nights May-October; lower water is better than high. Same playbook as MI but the fish are wider-spaced — cover more water.",
  },
  {
    id: 'southern-warmwater-smallmouth',
    name: 'Southern River Smallmouth (TN/NC/GA warmwater)',
    scientific: 'Micropterus dolomieu + M. coosae + others',
    regions: ['Southern Appalachia', 'Southeast'],
    states: ['TN', 'NC', 'GA', 'AL', 'SC'],
    rivers: [
      'Harpeth River',
      'Duck River',
      'Buffalo River (TN)',
      'Stones River',
      'Caney Fork (below Carthage)',
      'French Broad River',
      'New River (NC)',
      'Yadkin River',
      'Mayo River',
      'Pee Dee River',
      'Etowah River',
      'Conasauga River',
      'Coosa River system',
      'Ocmulgee River',
      'Chattooga River',
    ],
    startMonth: 4,
    endMonth: 10,
    waterTempMinF: 60,
    waterTempMaxF: 85,
    timeOfDay: 'all day',
    stages: ['streamer'],
    flies: [
      'Clouser Deep Minnow (chartreuse/white, olive/white, tan/white) — the universal warmwater fly',
      "Clouser's Crayfish — smallmouth meat-and-potatoes",
      'Near Nuff Crayfish (Dave Whitlock) — searching crayfish pattern',
      "Whitlock's Near Nuff Crayfish — Whitlock's evolved version",
      'Murdich Minnow — bait-profile streamer that doubles to stripers',
      'Half and Half (Clouser + Deceiver hybrid) — bigger profile for big smallmouth',
      'Game Changer (Blane Chocklett) — articulated baitfish profile',
      'Boogle Bug popper — summer surface gold on the Harpeth / Duck / Buffalo',
      'Sneaky Pete popper — slider variant for spooky fish',
      'Wooly Bugger (olive / black / brown — beefy sizes) — universal',
      'Topwater frog (Whitlock Hair Frog / foam frog) — slow river sections + bass ponds',
      'Diver pattern — Dahlberg-style for current pockets',
      'Gurgler — surface attractor, works for everything',
    ],
    searchTerm: 'smallmouth fly French Broad Harpeth Duck Buffalo New River warmwater',
    wikipediaSlug: 'Smallmouth_bass',
    notes:
      'TN warmwater (Harpeth/Duck/Buffalo/Stones/lower Caney Fork) is world-class smallmouth in middle TN. NC smallmouth (French Broad/New/Yadkin/Mayo/Pee Dee) are also excellent. GA upper Coosa system (Etowah/Conasauga) holds smallmouth + redeye + spotted bass. Crayfish + baitfish profiles dominate; topwater poppers in summer. Fish faster, heavier, and dirtier than trout water — strip with intent.',
  },
  {
    id: 'southern-tailwater-stripers',
    name: 'Southern Tailwater Stripers (Caney Fork + Chattahoochee)',
    scientific: 'Morone saxatilis',
    regions: ['Southern Appalachia', 'Southeast'],
    states: ['TN', 'GA'],
    rivers: [
      'Caney Fork (below Center Hill)',
      'Cumberland River below Old Hickory',
      'Chattahoochee River (below Buford Dam)',
      'Chattahoochee above Lake Lanier',
    ],
    startMonth: 3,
    endMonth: 11,
    waterTempMinF: 55,
    waterTempMaxF: 75,
    timeOfDay: 'low light',
    stages: ['streamer'],
    flies: [
      'Clouser Deep Minnow (chartreuse/white, blue/white) — universal striper baitfish',
      'Half and Half (Clouser + Deceiver) — bigger profile for trophy stripers',
      "Lefty's Deceiver — shad imitation; the original big-baitfish fly",
      'Game Changer (Blane Chocklett) — articulated baitfish profile; deadly for big stripers',
      'Polar Changer — flashy white Game Changer variant',
      'Murdich Minnow — bait-profile striper killer',
      'Gummy Minnow — translucent shad imitation',
      "Bob Popovics's Hollow Fleye — pushable big-water baitfish",
      "Bob Popovics's Beast Fleye — trophy-hunter big striper meat",
      'Crease Fly — surface action during shad runs and topwater feeds',
      'Shad-profile baitfish pattern (white / silver)',
    ],
    searchTerm: 'striper fly Chattahoochee Caney Fork tailwater shad pattern',
    wikipediaSlug: 'Striped_bass',
    notes:
      'Below Center Hill on the Caney Fork and below Buford Dam on the Hooch, stripers stack up — 8-9 weight rods with type-5 sink tips, shad-profile flies, low light. The Hooch system above Lanier and the lake itself is one of the South\'s premier striper fisheries. Spring shad runs trigger topwater feeds.',
  },
  {
    id: 'ga-flint-shoal-bass',
    name: 'Flint River Shoal Bass (uniquely Georgia)',
    scientific: 'Micropterus cataractae',
    regions: ['Southeast'],
    states: ['GA'],
    rivers: ['Flint River', 'Apalachicola-Chattahoochee-Flint drainage'],
    startMonth: 4,
    endMonth: 10,
    waterTempMinF: 60,
    waterTempMaxF: 85,
    timeOfDay: 'all day',
    stages: ['streamer'],
    flies: [
      'Stealth Bomber (Kent Edmonds, GA — GA-BORN) — foam-and-deer-hair topwater that dives + flutters back; the most distinctly Georgia fly',
      'Clouser Deep Minnow (chartreuse/white, olive/white) — universal warmwater',
      "Clouser's Crayfish — shoal bass are crayfish addicts",
      'Near Nuff Crayfish (Whitlock) — searching crayfish pattern',
      "Whitlock's Near Nuff Crayfish",
      "Murray's Hellgrammite — hellgrammites are a major Flint River food source",
      'Mega-Prince Nymph — hellgrammite suggestion in big sizes',
      'Black Wooly Bugger (beefy) — hellgrammite imitation',
      'Game Changer (Blane Chocklett) — articulated baitfish profile',
      'Murdich Minnow — bait-profile river bass killer',
      'Boogle Bug popper — surface attractor over rock shoals',
      'Sneaky Pete popper — slider for spooky shoalies',
      'Gurgler — surface attractor; works for everything that swims',
      'Dahlberg Diver — current-line presentations over shoals',
      'Wooly Bugger (olive / black / white / rust — beefy sizes)',
      'Topwater frog / diver pattern — slow pools and back eddies',
    ],
    searchTerm: 'Flint River shoal bass Stealth Bomber Kent Edmonds Georgia',
    wikipediaSlug: 'Shoal_bass',
    notes:
      "The Flint River shoal bass is endemic to the Apalachicola-Chattahoochee-Flint drainage and almost nowhere else on earth. They live in current over rock shoals and eat like smallmouth in moving water — crayfish, baitfish, hellgrammites. The Stealth Bomber (Kent Edmonds, GA) is the most distinctly Georgia fly ever tied: came out of an attempt to replicate Turk's Tarantula with foam after a Henry's Fork trip; the way it dives then flutters back to the surface is what makes it deadly. If you fish one Georgia river, fish this one.",
  },
  {
    id: 'nc-roanoke-striper-run',
    name: 'NC Roanoke Striper Run (Weldon to Albemarle)',
    scientific: 'Morone saxatilis',
    regions: ['Southeast'],
    states: ['NC'],
    rivers: ['Roanoke River (Weldon to Albemarle Sound)', 'Cashie River', 'Chowan River'],
    startMonth: 3,
    endMonth: 5,
    waterTempMinF: 50,
    waterTempMaxF: 68,
    timeOfDay: 'all day',
    stages: ['streamer'],
    flies: [
      'Clouser Deep Minnow (chartreuse/white, blue/white, olive/white) — striper standard',
      'Half and Half (Clouser + Deceiver) — bigger profile for trophy fish',
      "Lefty's Deceiver — universal striper streamer",
      'Murdich Minnow — bait-profile striper killer',
      'Game Changer (Blane Chocklett) — articulated baitfish profile',
      'Polar Changer — flashy white Game Changer variant',
      'Gummy Minnow — translucent shad imitation',
      "Bob Popovics's Hollow Fleye — big-water pushable baitfish",
      "Bob Popovics's Beast Fleye — trophy striper meat",
      'Pole Dancer (Charlie Bisharat) — surface slider, walks-the-dog',
      'Crease Fly — surface attractor when stripers blow up on bait',
      'EP Baitfish — universal shad profile',
    ],
    searchTerm: 'Roanoke River striper run NC Weldon Albemarle Sound spring',
    wikipediaSlug: 'Striped_bass',
    notes:
      'The Roanoke River between Weldon and the Albemarle Sound hosts one of the largest striped bass runs in the East every spring (March-May). Almost entirely non-hatch streamer fishing — stripers stage in tidewater + below the falls, key on alewife, blueback herring, and shad. 8-10 weight rods, intermediate to type-5 sink tips, big white/chartreuse flies. Surface action when stripers push bait against the banks.',
  },
  {
    id: 'nc-cherokee-trophy-raven-fork',
    name: 'NC Cherokee Trophy Waters (Raven Fork)',
    scientific: 'Stocked rainbow / brown / golden — trophy class',
    regions: ['Southern Appalachia'],
    states: ['NC'],
    rivers: ['Raven Fork (Cherokee Trophy Section)', 'Oconaluftee River (tribal)'],
    startMonth: 3,
    endMonth: 11,
    waterTempMinF: 45,
    waterTempMaxF: 68,
    timeOfDay: 'all day',
    stages: ['streamer'],
    flies: [
      "Galloup's Sex Dungeon — articulated trophy streamer; Cherokee Trophy standard",
      "Galloup's Boogie Man",
      "Galloup's Drunk & Disorderly",
      'Sculpzilla — articulated sculpin staple',
      'Kreelex — flashy attractor; stocker gold',
      'Game Changer — articulated baitfish profile',
      'Sucker Spawn (cream / pink) — egg cluster, deadly for trophy rainbows',
      'Glo Bug (oregon-cheese / peach / chartreuse)',
      'Eggstasy Egg — modern egg cluster',
      'Mop Fly (chartreuse / olive / pink) — junk-fly trophy producer',
      'Squirmy Wormy (pink / chartreuse / wine)',
      'Y2K — bigger sizes for trophy hooks',
      "Pat's Rubber Legs (black / brown / coffee-and-black) — big stonefly nymph",
      'Coffey Stone Nymph (Frank Coffey, NC) — latex-bodied stonefly, big sizes',
      'Big Tellico Nymph (size 6-10) — outsized for trophy water',
      'Egg-Sucking Leech (black + chartreuse) — universal trophy producer',
    ],
    searchTerm: 'Raven Fork Cherokee Trophy Section NC tribal permit fly fishing',
    wikipediaSlug: null,
    notes:
      "The Eastern Band of Cherokee Indians' Trophy Section on the Raven Fork is a special case — tribal permit required (no NC license needed), and the river is stocked with absurdly large rainbows, browns, and golden rainbows. Big articulated streamers + eggs + junk + outsized stoneflies. Treat it like a trophy private water with public access.",
  },
  {
    id: 'southern-saltwater-coast',
    name: 'Southern Saltwater Coast (Outer Banks + Golden Isles)',
    scientific: 'Multi-species: Sciaenops + Pomatomus + Albula + Megalops',
    regions: ['Southeast', 'Mid-Atlantic'],
    states: ['NC', 'SC', 'GA', 'FL'],
    rivers: [
      'Outer Banks (NC)',
      'Cape Lookout',
      'Cape Fear',
      'Pamlico Sound',
      'Charleston Harbor',
      'Brunswick (GA)',
      'St. Simons Island',
      'Jekyll Island',
      'Cumberland Island',
      'Savannah River mouth',
    ],
    startMonth: 4,
    endMonth: 11,
    waterTempMinF: 60,
    waterTempMaxF: 85,
    timeOfDay: 'all day',
    stages: ['streamer'],
    flies: [
      "Surf Candy (Bob Popovics) — false albacore standard, glassy epoxy baitfish",
      'Game Changer (Blane Chocklett) — articulated baitfish profile, all species',
      'Polar Changer — flashy white Game Changer variant',
      'Gummy Minnow — silverside / glass-minnow imitation',
      'Albie Snax-style fly — narrow profile for false albacore',
      "Lefty's Deceiver — universal saltwater profile",
      'Half and Half (Clouser + Deceiver) — striper / red / bluefish',
      'Clouser Minnow (chartreuse/white, tan/white, olive/white)',
      'Kwan (Sam Root) — flats redfish standard; tan / olive',
      'Borski Slider — flats redfish + bonefish, hopping presentation',
      'Redfish Toad (Harry Spear-style) — tailing reds in spartina grass',
      'Merkin Crab (Del Brown / Bob Veverka) — flats redfish + permit',
      'Strong-Arm Crab — tailing reds on the flats',
      'EP Baitfish — universal saltwater baitfish profile',
      'EP Mullet — mullet pattern for fall albies + reds',
      'Tarpon Toad (Gary Merriman) — GA summer tarpon',
      'Black Death tarpon fly — classic dark tarpon profile',
      'Schminnow (Capt. Norm) — easy-to-tie speckled trout / red killer',
      'Crease Fly — surface action for stripers + false albacore',
      'Gurgler — surface attractor; trout + reds + ladyfish',
    ],
    searchTerm: 'Outer Banks Cape Lookout Golden Isles redfish albie tarpon saltwater fly',
    wikipediaSlug: null,
    notes:
      "NC has one of the best fall false-albacore fisheries in the country (October-November around Cape Lookout). GA Golden Isles (Brunswick, St. Simons, Jekyll, Cumberland) has redfish year-round, speckled trout, summer tarpon, tripletail, and ladyfish. Spartina-grass tailing redfish are the iconic GA flats scene. Same fly canon either way: baitfish profiles (EP, Game Changer, Clouser, Deceiver), crabs (Merkin, Strong-Arm) on the flats, surface (Crease, Gurgler) when fish blow up on bait.",
  },
  {
    id: 'southern-yellow-jacket-bee',
    name: 'Southern Yellow Jacket + Bee (Hiwassee + Smokies bank work)',
    scientific: 'Vespula spp. / Apis mellifera (terrestrial drop imitation)',
    regions: ['Southern Appalachia'],
    states: ['TN', 'NC', 'GA', 'KY', 'AL', 'SC'],
    rivers: [
      'Hiwassee River',
      'Tellico River',
      'Little River (Smokies)',
      'Toccoa River',
      'Nantahala River',
      'Davidson River',
    ],
    startMonth: 6,
    endMonth: 9,
    waterTempMinF: 60,
    waterTempMaxF: 78,
    timeOfDay: 'afternoon',
    stages: ['adult'],
    flies: [
      'Size 12-14 Yellow Jacket pattern (foam, yellow + black banded) — Hiwassee bank specialty; very productive fished dry near banks',
      'Size 12-14 Bee imitation (yellow + black foam) — Smokies + Toccoa summer bank work',
      'Size 14 deer-hair Yellow Jacket — older traditional pattern',
      'Size 12 Chubby Chernobyl (yellow + black colors) — yellow-jacket-substitute',
      'Size 14 Foam Bee (Joe\'s Hopper colors variant)',
    ],
    searchTerm: 'yellow jacket bee fly pattern Hiwassee Smokies summer',
    wikipediaSlug: null,
    notes:
      "Specifically called out on the Hiwassee: 'a yellow jacket imitation fished dry near the banks can be very productive.' Bank-fishing terrestrial — yellow jackets and bees pollinating bank-side flowers + tree blossoms fall on the water in midsummer afternoons. Fish them like hoppers — bank slap, twitched dead-drift. Peak July-August.",
  },
];

// ---- Runner ---------------------------------------------------------------

const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const byId = new Map(data.map((h) => [h.id, h]));

let padded = 0;
let totalAdded = 0;
for (const [id, extras] of Object.entries(FLY_ADDITIONS)) {
  const entry = byId.get(id);
  if (!entry) {
    console.warn(`  MISSING target: ${id}`);
    continue;
  }
  const existing = new Set(entry.flies.map((f) => f.toLowerCase().trim()));
  let added = 0;
  for (const f of extras) {
    if (!existing.has(f.toLowerCase().trim())) {
      entry.flies.push(f);
      added++;
      totalAdded++;
    }
  }
  if (added > 0) {
    console.log(`  ${id}: +${added} (now ${entry.flies.length})`);
    padded++;
  }
}

let appended = 0;
for (const e of NEW_ENTRIES) {
  if (byId.has(e.id)) {
    console.log(`  exists ${e.id} (no overwrite)`);
    continue;
  }
  data.push(e);
  byId.set(e.id, e);
  console.log(`  + ${e.id} (${e.states.join(',')} · ${e.flies.length} flies)`);
  appended++;
}

console.log(`\nPadded ${padded} entries (+${totalAdded} flies); added ${appended} new entries.`);
console.log(`Total hatches: ${data.length}`);

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log(`Wrote ${FILE}`);
