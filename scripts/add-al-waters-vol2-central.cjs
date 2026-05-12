// Add Alabama Central Vol 2 — Coosa River chain + Black Warrior + Tallapoosa + Alabama River + Cahaba.
// Idempotent merge into data/waterbodies.json.

const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'data', 'waterbodies.json');

const ENTRIES = [
  // ============== COOSA RIVER CHAIN ==============
  {
    id: 'al-weiss-lake',
    name: 'Weiss Lake',
    state: 'AL',
    region: 'Northeast Alabama',
    type: 'reservoir',
    county: 'Cherokee',
    acres: 30200,
    maxDepthFt: 60,
    lat: 34.215, lng: -85.580,
    signatureSpecies: ['Crappie', 'Largemouth Bass'],
    species: [
      { name: 'Crappie', importance: 'signature', size: 'Up to 3 lb; 11–14" tournament-quality slabs', notes: '"The Crappie Capital of the World" — Weiss is internationally famous for slab crappie. State biologists stock and manage aggressively. Spring spawn in March–April is one of America\'s great crappie events.' },
      { name: 'Largemouth Bass', importance: 'signature', size: '2–5 lb common, 8+ lb in winter', notes: 'Big fish lake — submerged grass, lily pads, and creek mouths. Weiss has produced multiple double-digit largemouth.' },
      { name: 'Spotted Bass', importance: 'strong', size: '1–3 lb', notes: 'Lower lake near dam, deep main-lake points.' },
      { name: 'Striped Bass', importance: 'good', size: '10–30 lb', notes: 'Stocked. River channels and deep summer water.' },
      { name: 'Channel Catfish', importance: 'good', size: '2–8 lb', notes: 'Creek mouths and river channel.' },
    ],
    patterns: [
      { title: 'Spring Crappie Spawn — Lily Pads & Cypress', target: 'Crappie', when: 'Mid-March – Late April when water hits 60–68°F', technique: 'Long-pole jigging (BnM 12–14\' poles) with 1/16-oz jigs around lily pad edges, cypress knees, and shoreline cover. Pearl/chartreuse, blue/white, or red/chartreuse skirts. Slip-cork with minnows works equally well.', where: 'Little River, Mill Creek, Yellow Creek, Cowans Creek arms — spawn in skinny water (2–4 ft) along banks with vegetation and wood.', details: 'When the dogwoods bloom in north Alabama, the crappie spawn peaks. Weiss puts more 1.5–2.5 lb slabs in the boat per April day than almost anywhere in the country.' },
      { title: 'Summer Crappie Brush Piles', target: 'Crappie', when: 'June – September', technique: 'Vertical jig brush piles in 12–22 ft with electronics (LiveScope-style forward facing has revolutionized this lake). Single-pole spider rigging with 1/8-oz jigs and a minnow trailer.', where: 'Main-lake brush piles, creek-channel ledges. State and private brush piles are public knowledge — many marked on Navionics.', details: 'Summer Weiss crappie suspend over 25–40 ft, sitting in brush at 15–20 ft. Forward-facing sonar lets you pick out individual fish.' },
      { title: 'Fall Largemouth on Grass Edges', target: 'Largemouth Bass', when: 'October – December', technique: 'Square-bills, lipless cranks (Red Eye Shad), and weightless flukes around hydrilla and milfoil edges. Spinnerbaits in stained water.', where: 'Mid-lake grass flats, creek mouths.', details: 'Weiss has good grass — when fall shad start dumping, the largemouth gorge.' },
      { title: 'Winter Trophy Largemouth', target: 'Largemouth Bass', when: 'December – February', technique: 'Slow-rolled big swimbaits, jerkbaits (Megabass Vision 110), and Alabama rigs in deeper water near creek channels.', where: 'Coosa, Little, and Yellow Creek channels in 8–20 ft.', details: 'Weiss\'s biggest bass of the year come from cold months — slow presentations in the channel-edge zone.' },
    ],
    access: [
      'Cherokee County: Bay Springs Marina, Riverside Park, Little River Park',
      'Centre area: J.D. Pruett Park, Weiss Lake Marine',
    ],
    regulations: 'AL fishing license. Crappie: 30/day, 9" minimum. Largemouth: 5/day, 13" minimum (special on Coosa chain). Striped/hybrid: 2/day, 22" minimum. Check ADCNR.',
    managementProgram: ['Crappie stocking and habitat enhancement', 'Florida-strain largemouth introductions', 'Brush pile placement program'],
    notes: 'Weiss is one of the very few lakes in America where the crappie are as famous as the bass — and the bass are very famous. Coosa River impoundment formed in 1961, Alabama Power. Cherokee, AL area built around fishing tourism.',
  },
  {
    id: 'al-neely-henry-lake',
    name: 'Neely Henry Lake',
    state: 'AL',
    region: 'East Alabama',
    type: 'reservoir',
    county: 'Etowah / St. Clair / Calhoun',
    acres: 11200,
    maxDepthFt: 55,
    lat: 33.880, lng: -86.060,
    signatureSpecies: ['Spotted Bass', 'Largemouth Bass'],
    species: [
      { name: 'Spotted Bass', importance: 'signature', size: '1.5–4 lb; trophy 5+ lb', notes: 'Coosa-strain spots — aggressive, hard-fighting. Main-lake points, bluffs, and bridges.' },
      { name: 'Largemouth Bass', importance: 'signature', size: '2–6 lb', notes: 'Creek arms, grass, and shallow cover.' },
      { name: 'Crappie', importance: 'good', size: '0.5–1.5 lb', notes: 'Creek mouths and brush.' },
      { name: 'Striped Bass', importance: 'good', size: '10–25 lb', notes: 'Below Neely Henry Dam tailrace especially.' },
      { name: 'Catfish', importance: 'good', size: 'Channel, blue, flathead present', notes: 'Main lake and river current.' },
    ],
    patterns: [
      { title: 'Coosa-Strain Spotted Bass — Bluff Walls', target: 'Spotted Bass', when: 'Year-round, peak fall & spring', technique: 'Drop-shot, shaky head, jerkbaits, and small swimbaits along vertical rock. Spotted bass push shad against bluff walls — fast, reactive bite.', where: 'Main-lake bluff sections, particularly mid-lake and below the railroad bridge.', details: 'The Coosa River chain (Neely Henry, Logan Martin, Lay, Mitchell, Jordan) is the spotted bass tournament circuit of the South. Coosa spots are genetic gold — they grow fat in current.' },
      { title: 'Bridge Pilings & Causeway', target: 'Spotted Bass and Largemouth', when: 'Summer & winter', technique: 'Drop-shot, vertical jigging spoons (Cotton Cordell C.C. Spoon), and live bait around pilings.', where: 'I-59, U.S. 11, and railroad bridges across the lake.', details: 'Bridges concentrate shad and bass year-round on the Coosa.' },
      { title: 'Spring Largemouth Creek Spawn', target: 'Largemouth Bass', when: 'March – April', technique: 'Lipless cranks, ChatterBaits, and Senkos in creek arms.', where: 'Big Canoe Creek, Beaver Creek, Ohatchee Creek.', details: 'Creek arms warm first and hold the largemouth spawn.' },
    ],
    access: [
      'Etowah County: Coosa Landing (Gadsden), Rainbow Landing',
      'Public ramps at Canoe Creek, Riverside',
    ],
    regulations: 'AL fishing license. Bass: special Coosa chain rules — check ADCNR. Spotted bass: no minimum, 10/day combined with largemouth. Largemouth: 12" minimum on most of the Coosa chain.',
    managementProgram: ['Coosa-strain spotted bass conservation', 'Habitat enhancement'],
    notes: 'H. Neely Henry Lake, impounded 1966. The upper Coosa chain reservoir, north of Gadsden. Tournament regular.',
  },
  {
    id: 'al-logan-martin-lake',
    name: 'Logan Martin Lake',
    state: 'AL',
    region: 'East Alabama',
    type: 'reservoir',
    county: 'St. Clair / Talladega',
    acres: 17000,
    maxDepthFt: 75,
    lat: 33.430, lng: -86.310,
    signatureSpecies: ['Spotted Bass', 'Largemouth Bass'],
    species: [
      { name: 'Spotted Bass', importance: 'signature', size: '1.5–4 lb; 5+ lb trophy', notes: 'Coosa-strain — Logan Martin is one of the premier spotted bass tournament fisheries in the South.' },
      { name: 'Largemouth Bass', importance: 'signature', size: '2–7 lb', notes: 'Creek arms and grass.' },
      { name: 'Striped Bass', importance: 'strong', size: '15–40 lb', notes: 'Stocked. Logan Martin produces some of Alabama\'s biggest stripers — 40-pounders not uncommon.' },
      { name: 'Crappie', importance: 'good', size: '0.5–2 lb', notes: 'Creek mouths and brush in 12–20 ft.' },
      { name: 'Catfish', importance: 'good', size: 'Channel + flathead + blue', notes: 'River channel; trophy blues from Coosa.' },
    ],
    patterns: [
      { title: 'Logan Martin Spots — Main-Lake Rock', target: 'Spotted Bass', when: 'Year-round', technique: 'Drop-shot (4–6" worms), shaky head with finesse worm, jerkbaits (Spro McStick) in cold months, small flukes warmer. Coosa spots love clean rock and current.', where: 'Main-lake points, riprap, bridge causeways, the Coosa River channel.', details: 'Logan Martin spots are the standard against which other Coosa chain lakes are measured. Tournament weights here are spotted-bass-heavy.' },
      { title: 'Striped Bass — Summer Current Breaks', target: 'Striped Bass', when: 'May – September', technique: 'Live shad on planer boards, freelined or down-rod, in 20–40 ft. Big swimbaits when fish surface-bust schools.', where: 'Below Neely Henry Dam (Logan Martin\'s headwaters), main-river channel, deep coves with current breaks.', details: 'Logan Martin stripers grow large — trophy 30–40 lb fish on schedule. AL Power releases at Neely Henry move the bait, the bait moves the stripers.' },
      { title: 'Schooling Spots & Largemouth — Fall Shad Bust', target: 'Spotted Bass and Largemouth', when: 'September – November', technique: 'Pencil poppers, walking topwater (Spook), and small swimbaits when fish boil shad. Sub-surface: Alabama rig and flukes.', where: 'Main-lake points and creek mouths.', details: 'Fall is the visual season — surface explosions across the lake on shad pods.' },
      { title: 'Big Largemouth — Grass & Wood', target: 'Largemouth Bass', when: 'Spring and Fall', technique: 'ChatterBaits, lipless cranks, and frogs over and around grass.', where: 'Coosa Island, Choccolocco Creek, Cropwell Creek arms.', details: 'Largemouth bias in the creek arms; spots dominate the main lake.' },
    ],
    access: [
      'Coosa Island Marina, Lake Logan Martin State Park area ramps',
      'Public ramps at Stemley Bridge, Pell City, Riverside',
    ],
    regulations: 'AL fishing license. Special Coosa chain bass regulations — verify with ADCNR.',
    managementProgram: ['Coosa-strain spot management', 'Striped bass stocking'],
    notes: 'Logan Martin Lake (1964), 48 miles long Coosa River impoundment. Birmingham\'s primary tournament destination. The Coosa chain spotted bass tournament weights here are legendary.',
  },
  {
    id: 'al-lay-lake',
    name: 'Lay Lake',
    state: 'AL',
    region: 'Central Alabama',
    type: 'reservoir',
    county: 'Shelby / Chilton / Coosa / Talladega',
    acres: 12000,
    maxDepthFt: 87,
    lat: 33.115, lng: -86.515,
    signatureSpecies: ['Spotted Bass', 'Largemouth Bass'],
    species: [
      { name: 'Spotted Bass', importance: 'signature', size: '1.5–4 lb', notes: 'Coosa-strain — Lay Lake hosted the 1996, 2002, 2007 Bassmaster Classics.' },
      { name: 'Largemouth Bass', importance: 'signature', size: '2–8 lb', notes: 'Creek arms with hydrilla and milfoil.' },
      { name: 'Crappie', importance: 'strong', size: '0.5–2 lb', notes: 'Spring spawn in creek backs is excellent.' },
      { name: 'Striped Bass', importance: 'good', size: '10–30 lb', notes: 'Stocked.' },
      { name: 'Catfish', importance: 'good', size: 'Channel + blue + flathead', notes: 'Big blues common in the main river channel.' },
    ],
    patterns: [
      { title: 'Lay Lake Spots — Rock + Current', target: 'Spotted Bass', when: 'Year-round', technique: 'Same Coosa chain playbook — drop-shot, shaky head, jerkbaits, small swimbaits on main-lake rock and bridge structure.', where: 'Beeswax Creek, Paint Creek, main-lake points. The dam area is electric in spring.', details: 'Three Bassmaster Classics on this lake (1996, 2002, 2007) tell you everything about the spotted bass fishery.' },
      { title: 'Spring Largemouth Hydrilla', target: 'Largemouth Bass', when: 'March – May', technique: 'ChatterBait (Z-Man with Yamamoto Zako trailer), lipless cranks (Rat-L-Trap, Red Eye Shad in red craw), and Senkos on grass edges.', where: 'Mid-lake creek arms, Paint Creek, Spring Creek.', details: 'Lay has better hydrilla than some Coosa lakes — concentrates the largemouth spawn.' },
      { title: 'Crappie Spawn — Coves', target: 'Crappie', when: 'March – April', technique: 'Long-pole jigs and minnows in shallow coves with wood and grass.', where: 'Beeswax Creek, Cottonwood Creek, Yellowleaf Creek.', details: 'April crappie spawn is a quiet star of this lake.' },
      { title: 'Below Logan Martin Dam — Tailrace', target: 'Striped Bass and Spotted Bass', when: 'When AL Power is generating', technique: 'Bucktails, swimbaits, and live shad in the tailrace turbulence.', where: 'Lay Lake headwaters below Logan Martin Dam.', details: 'Generating periods stack stripers and spots in the tailrace.' },
    ],
    access: [
      'Beeswax Creek Park, Paint Creek Park',
      'Mitchell Dam area, Cottonwood Creek',
    ],
    regulations: 'AL fishing license. Coosa chain special bass regulations apply.',
    managementProgram: ['Hydrilla management balance', 'Tournament habitat work'],
    notes: 'Lay Lake (1914 — oldest of the Coosa Alabama Power impoundments). Bassmaster Classic venue 1996, 2002, 2007. Central Alabama tournament hub.',
  },
  {
    id: 'al-mitchell-lake',
    name: 'Mitchell Lake',
    state: 'AL',
    region: 'Central Alabama',
    type: 'reservoir',
    county: 'Chilton / Coosa',
    acres: 5850,
    maxDepthFt: 110,
    lat: 32.795, lng: -86.470,
    signatureSpecies: ['Spotted Bass', 'Striped Bass'],
    species: [
      { name: 'Spotted Bass', importance: 'signature', size: '1.5–4 lb', notes: 'Deep, clear Coosa lake — heavy spotted bass bias.' },
      { name: 'Striped Bass', importance: 'signature', size: '15–35 lb', notes: 'Stocked. Mitchell produces strong stripers in the deep main lake.' },
      { name: 'Largemouth Bass', importance: 'strong', size: '2–6 lb', notes: 'Creek arms.' },
      { name: 'Crappie', importance: 'good', size: '0.5–1.5 lb', notes: 'Brush piles.' },
      { name: 'Catfish', importance: 'good', size: 'Blues and flatheads', notes: 'Big fish in the deep river channel.' },
    ],
    patterns: [
      { title: 'Deep Spots — Drop-Shot Mid-Lake', target: 'Spotted Bass', when: 'Summer & winter', technique: 'Drop-shot in 25–50 ft on main-lake humps and points. Spotted bass go deeper here than on most Coosa lakes — Mitchell is the deepest.', where: 'Main lake from Higgins Ferry to dam.', details: 'Mitchell is small, deep, and clear — a finesse spotted bass lake more than a power-fishing lake.' },
      { title: 'Summer Stripers — Down-Rod Live Shad', target: 'Striped Bass', when: 'June – August', technique: 'Live blueback herring or shad on down-rods at 30–50 ft over the river channel.', where: 'Main-lake channel bends.', details: 'Stripers stack in the cool depths of Mitchell\'s narrow main lake.' },
      { title: 'Tailrace Spotted Bass + Stripers — Below Lay Dam', target: 'Spotted Bass and Striped Bass', when: 'Generating periods', technique: 'Bucktails, soft jerkbaits, and live shad in current breaks.', where: 'Mitchell\'s headwaters below Lay Dam.', details: 'When AL Power generates upstream, the tailrace lights up.' },
    ],
    access: [
      'Higgins Ferry Park (Coosa County), Mitchell Dam area',
      'Public ramps along U.S. 280 corridor',
    ],
    regulations: 'AL fishing license. Coosa chain rules apply.',
    managementProgram: ['Striped bass stocking', 'Coosa chain spot conservation'],
    notes: 'Mitchell Lake (1923). Small (5,850 acres) but deep (110 ft) Coosa River impoundment. Less-pressured than Lay or Logan Martin.',
  },
  {
    id: 'al-jordan-lake',
    name: 'Jordan Lake',
    state: 'AL',
    region: 'Central Alabama',
    type: 'reservoir',
    county: 'Elmore / Coosa',
    acres: 6800,
    maxDepthFt: 90,
    lat: 32.610, lng: -86.250,
    signatureSpecies: ['Striped Bass', 'Spotted Bass'],
    species: [
      { name: 'Striped Bass', importance: 'signature', size: '15–40 lb', notes: 'Jordan is the trophy striper lake of the Coosa chain — 30–40 lb fish realistic.' },
      { name: 'Spotted Bass', importance: 'signature', size: '1.5–4 lb', notes: 'Coosa-strain — deep clear water.' },
      { name: 'Largemouth Bass', importance: 'good', size: '2–6 lb', notes: 'Creek arms.' },
      { name: 'Crappie', importance: 'good', size: '0.5–2 lb', notes: 'Brush piles in 15–25 ft.' },
      { name: 'Catfish', importance: 'good', size: 'Blues and flatheads to 60+ lb', notes: 'Trophy blues from Coosa.' },
    ],
    patterns: [
      { title: 'Jordan Trophy Stripers — Live Shad', target: 'Striped Bass', when: 'Spring & summer', technique: 'Big live blueback herring or gizzard shad on planer boards and down-rods over the main-lake river channel.', where: 'Main lake, dam area, Coosa channel.', details: 'Some of Alabama\'s biggest stripers come from Jordan — the lake stratifies and concentrates the fish in cool water.' },
      { title: 'Below Mitchell Dam — Tailrace', target: 'Striped Bass and Spotted Bass', when: 'Generating periods', technique: 'Bucktails, big soft swimbaits, and live shad in the turbulence.', where: 'Jordan\'s headwaters below Mitchell Dam.', details: 'The tailrace at Jordan\'s upper end is reliable striper water during AL Power generation.' },
      { title: 'Coosa Spots — Bluff Walls', target: 'Spotted Bass', when: 'Year-round', technique: 'Drop-shot, jerkbaits, shaky head on bluff rock.', where: 'Main-lake bluff sections.', details: 'Classic Coosa spotted bass — deep, clean, vertical.' },
    ],
    access: [
      'Bonner Recreation Area, Wetumpka area ramps',
      'Pinedale Marina',
    ],
    regulations: 'AL fishing license. Coosa chain rules.',
    managementProgram: ['Striped bass stocking (trophy program)', 'Coosa spot conservation'],
    notes: 'Jordan Dam (1928), lower Coosa chain. Lower elevation, deep, trophy striped bass destination. Wetumpka, AL.',
  },

  // ============== BLACK WARRIOR ==============
  {
    id: 'al-lake-tuscaloosa',
    name: 'Lake Tuscaloosa',
    state: 'AL',
    region: 'West Alabama',
    type: 'reservoir',
    county: 'Tuscaloosa',
    acres: 5885,
    maxDepthFt: 76,
    lat: 33.380, lng: -87.530,
    signatureSpecies: ['Largemouth Bass', 'Spotted Bass'],
    species: [
      { name: 'Largemouth Bass', importance: 'signature', size: '2–8 lb', notes: 'Clear water lake with Florida-strain genetics — produces solid trophy potential.' },
      { name: 'Spotted Bass', importance: 'strong', size: '1.5–3 lb', notes: 'Deep main-lake points.' },
      { name: 'Striped Bass', importance: 'good', size: '10–25 lb', notes: 'Stocked.' },
      { name: 'Crappie', importance: 'good', size: '0.5–1.5 lb', notes: 'Brush piles, creek mouths.' },
      { name: 'Bream', importance: 'good', size: 'Bluegill and shellcracker', notes: 'Strong panfish presence.' },
    ],
    patterns: [
      { title: 'Clear-Water Largemouth — Sight Spawn', target: 'Largemouth Bass', when: 'March – April', technique: 'Sight-fish beds with white tubes, Senkos, and small swimbaits. Long casts in clear water.', where: 'Coves and protected pockets across the lake.', details: 'Tuscaloosa\'s clear water makes it a premier sight-fishing lake in spring.' },
      { title: 'Summer Deep Spots & Largemouth', target: 'Largemouth Bass and Spotted Bass', when: 'June – September', technique: 'Drop-shot and Carolina rig on main-lake humps and points in 18–30 ft.', where: 'Main lake near dam.', details: 'Clear deep summer water — finesse plays.' },
    ],
    access: [
      'Binion Creek Park, North River',
      'Tierce Patton Park',
    ],
    regulations: 'AL fishing license. Standard statewide bass regs.',
    managementProgram: ['Water supply lake — limited public motor restrictions in some zones'],
    notes: 'Tuscaloosa city water supply reservoir (1970). Clear, deep, and surprisingly under-promoted.',
  },
  {
    id: 'al-bankhead-lake',
    name: 'Bankhead Lake',
    state: 'AL',
    region: 'West Central Alabama',
    type: 'reservoir',
    county: 'Walker / Tuscaloosa / Jefferson',
    acres: 9200,
    maxDepthFt: 75,
    lat: 33.450, lng: -87.355,
    signatureSpecies: ['Largemouth Bass', 'Spotted Bass'],
    species: [
      { name: 'Largemouth Bass', importance: 'signature', size: '2–6 lb', notes: 'Black Warrior River impoundment — varied cover.' },
      { name: 'Spotted Bass', importance: 'strong', size: '1.5–3 lb', notes: 'Main-lake rock and current.' },
      { name: 'Striped Bass', importance: 'good', size: '10–25 lb', notes: 'Stocked.' },
      { name: 'Catfish', importance: 'good', size: 'Channel, blue, flathead', notes: 'Trophy flatheads from the river channel.' },
      { name: 'Crappie', importance: 'good', size: '0.5–1.5 lb', notes: 'Brush and creek mouths.' },
    ],
    patterns: [
      { title: 'Black Warrior Largemouth — Wood + Current', target: 'Largemouth Bass', when: 'Spring & Fall', technique: 'ChatterBaits, square-bills, jigs around laydowns and wood in creek arms.', where: 'Lost Creek, Davis Creek arms.', details: 'River-system largemouth — current and wood are the keys.' },
      { title: 'Below Smith Lake Dam Tailrace', target: 'Striped Bass and Spotted Bass', when: 'Generation periods', technique: 'Bucktails, soft jerkbaits in cool tailrace water.', where: 'Bankhead headwaters below Smith Lake Dam.', details: 'Smith Dam discharges cold clean water — concentrates fish on hot days.' },
    ],
    access: [
      'Public ramps along Lock and Dam Road',
      'Brookwood, Sumiton ramps',
    ],
    regulations: 'AL fishing license. Standard statewide bass regs.',
    managementProgram: ['Black Warrior river system management'],
    notes: 'Bankhead Lake (1916), Black Warrior River. Industrial corridor + good fishery overlap.',
  },
  {
    id: 'al-holt-lake',
    name: 'Holt Lake',
    state: 'AL',
    region: 'West Central Alabama',
    type: 'reservoir',
    county: 'Tuscaloosa',
    acres: 3290,
    maxDepthFt: 65,
    lat: 33.295, lng: -87.450,
    signatureSpecies: ['Largemouth Bass', 'Catfish'],
    species: [
      { name: 'Largemouth Bass', importance: 'signature', size: '2–6 lb', notes: 'Black Warrior pool — riverine.' },
      { name: 'Catfish', importance: 'signature', size: 'Trophy blues 30–60 lb', notes: 'Holt produces some of the best trophy catfishing on the Black Warrior.' },
      { name: 'Spotted Bass', importance: 'strong', size: '1.5–3 lb', notes: 'Riprap and rock.' },
      { name: 'Crappie', importance: 'good', size: '0.5–1.5 lb', notes: 'Wood and creek mouths.' },
    ],
    patterns: [
      { title: 'Holt Trophy Blues — Cut Bait Drifting', target: 'Catfish (Blue)', when: 'Year-round, peak late fall – winter', technique: 'Fresh cut skipjack or shad on Santee rigs, drifted across river channel ledges and deep holes.', where: 'Main river channel, lock area.', details: 'Holt is a trophy blue catfish lake — Black Warrior fish to 60+ lb caught regularly.' },
      { title: 'River Largemouth — Wood', target: 'Largemouth Bass', when: 'Spring – Fall', technique: 'Jigs, square-bills, and Texas-rigged worms around shoreline laydowns.', where: 'Creek arms and slack-water pockets.', details: 'Find the slack-water pockets off the main river.' },
    ],
    access: [
      'Holt Lock and Dam area, Rocky Branch',
      'Public ramps near Tuscaloosa',
    ],
    regulations: 'AL fishing license. Standard regs.',
    managementProgram: ['Trophy blue catfish habitat conservation'],
    notes: 'Holt Lake (1968), Black Warrior River navigation pool. Trophy blue catfishery.',
  },

  // ============== TALLAPOOSA — LAKE MARTIN HEADLINE ==============
  {
    id: 'al-lake-martin',
    name: 'Lake Martin',
    state: 'AL',
    region: 'East Alabama',
    type: 'reservoir',
    county: 'Tallapoosa / Coosa / Elmore',
    acres: 41150,
    maxDepthFt: 156,
    lat: 32.700, lng: -85.900,
    signatureSpecies: ['Spotted Bass', 'Striped Bass', 'Largemouth Bass'],
    species: [
      { name: 'Spotted Bass', importance: 'signature', size: '1.5–4 lb; 5+ lb trophy', notes: 'Lake Martin is one of the premier deep-clear spotted bass lakes in the country. Tallapoosa River impoundment with 750 miles of shoreline.' },
      { name: 'Striped Bass', importance: 'signature', size: '15–40 lb', notes: 'Stocked — Lake Martin produces some of Alabama\'s biggest stripers; AL state record 70 lb came from Martin (1959).' },
      { name: 'Largemouth Bass', importance: 'strong', size: '2–7 lb', notes: 'Creek arms.' },
      { name: 'Crappie', importance: 'good', size: '0.5–2 lb', notes: 'Brush piles in 15–30 ft.' },
      { name: 'Bream', importance: 'good', size: 'Bluegill, shellcracker, redear', notes: 'Bedding panfish in May–June.' },
    ],
    patterns: [
      { title: 'Lake Martin Spots — Deep Clear Drop-Shot', target: 'Spotted Bass', when: 'Year-round, peak May – October', technique: 'Drop-shot (Robo Worm, Zoom finesse) on main-lake points and humps in 20–45 ft. Forward-facing sonar is now standard — pick fish out of the water column. Shaky head and jerkbaits supplement.', where: 'Main lake mid-channel humps, points, and bluff transitions. Kowaliga area, Real Island, Pleasure Point.', details: 'Martin is "the standard" for deep-clear-water spotted bass in the South. Local pros built drop-shot reputations here. Water is gin-clear most of the year — finesse is the law.' },
      { title: 'Topwater Spots — Schooling Shad', target: 'Spotted Bass', when: 'Late July – October', technique: 'Walking topwater (Spook Jr., Sammy 100), pencil poppers, and small flukes when fish boil shad on flat calm mornings.', where: 'Main lake points and humps, especially Kowaliga and the dam area.', details: 'Schooling Martin spots are visual fishing at its best — fast boats, sharp eyes, accurate casts.' },
      { title: 'Trophy Stripers — Live Shad on Down-Rods', target: 'Striped Bass', when: 'May – September', technique: 'Live blueback herring (legal in AL with permit) or shad on down-rods at 30–60 ft over the main river channel.', where: 'Lower lake near dam, main river channel.', details: 'Martin\'s deep cold thermocline holds stripers in summer. Hire a guide if you\'re new — finding the bait ball matters more than gear.' },
      { title: 'Spring Crappie & Largemouth Creek Spawn', target: 'Crappie and Largemouth', when: 'March – April', technique: 'Jigs and minnows on long poles for crappie; Senkos, ChatterBaits, and lipless cranks for largemouth.', where: 'Upper-lake creek arms: Kowaliga Creek, Sandy Creek, Wind Creek.', details: 'Creek arms warm faster than the deep main lake.' },
      { title: 'Bream Spawning Beds', target: 'Bluegill, Shellcracker, Redear', when: 'May – June full moon', technique: 'Crickets, redworms, and small popping bugs around shallow gravel/sand spawning beds.', where: 'Shallow sandy pockets across the lake.', details: 'Martin\'s bream beds are legendary for kid-and-grandkid trips.' },
    ],
    access: [
      'Wind Creek State Park (large public ramp + camping)',
      'Kowaliga area marinas',
      'Real Island, Pleasure Point public ramps',
      'Public ramps at Madwind Creek, Castaway Marina',
    ],
    regulations: 'AL fishing license. Bass: 10/day combined largemouth + spotted, 12" minimum largemouth, no minimum spotted. Striped bass: 2/day, 22" minimum. Crappie: 30/day, 9" minimum. Bream: no limit.',
    managementProgram: ['Striped bass stocking (trophy program)', 'Spotted bass conservation', 'Habitat enhancement'],
    notes: '"Smith Mountain Lake of the South." 41,150 acres, 156 ft max, 750 mi of shoreline. Built 1926 by Alabama Power. Lake Martin is the deep clear-water trophy bass and striper destination of central Alabama, with summer-home culture (Russell Lands, Children\'s Harbor, Kowaliga). World-class.',
  },
  {
    id: 'al-yates-lake',
    name: 'Yates Lake',
    state: 'AL',
    region: 'East Alabama',
    type: 'reservoir',
    county: 'Elmore / Tallapoosa',
    acres: 2000,
    maxDepthFt: 65,
    lat: 32.580, lng: -85.890,
    signatureSpecies: ['Largemouth Bass', 'Spotted Bass'],
    species: [
      { name: 'Largemouth Bass', importance: 'signature', size: '2–6 lb', notes: 'Small Tallapoosa pool, riverine character.' },
      { name: 'Spotted Bass', importance: 'strong', size: '1.5–3 lb', notes: 'Rock + current.' },
      { name: 'Crappie', importance: 'good', size: '0.5–1.5 lb', notes: 'Wood and brush.' },
      { name: 'Catfish', importance: 'good', size: 'Channel + flathead', notes: 'River channel.' },
    ],
    patterns: [
      { title: 'Below Martin Dam — Tailrace', target: 'Striped Bass, Spotted Bass, Largemouth', when: 'AL Power generating periods', technique: 'Bucktails, swimbaits, soft jerkbaits in turbulence.', where: 'Yates headwaters below Lake Martin Dam.', details: 'Cold deep discharge from Lake Martin lights up tailrace.' },
      { title: 'Riverine Largemouth — Cover', target: 'Largemouth Bass', when: 'Year-round', technique: 'Jigs, ChatterBaits around laydowns and rip-rap.', where: 'Creek mouths and slack-water.', details: 'Small lake, big-river feel.' },
    ],
    access: [
      'Yates Public Ramp, Wetumpka area',
    ],
    regulations: 'AL fishing license.',
    managementProgram: ['Tallapoosa river fishery'],
    notes: 'Yates Lake (1928), 2,000-acre Tallapoosa River impoundment between Martin and Thurlow. Tailrace fishery below Martin Dam is the headline.',
  },
  {
    id: 'al-thurlow-lake',
    name: 'Thurlow Lake',
    state: 'AL',
    region: 'East Alabama',
    type: 'reservoir',
    county: 'Elmore',
    acres: 580,
    maxDepthFt: 30,
    lat: 32.550, lng: -85.900,
    signatureSpecies: ['Largemouth Bass', 'Striped Bass'],
    species: [
      { name: 'Largemouth Bass', importance: 'signature', size: '2–6 lb', notes: 'Small riverine pool below Yates.' },
      { name: 'Striped Bass', importance: 'strong', size: '10–25 lb', notes: 'Stocked + migratory from Alabama River.' },
      { name: 'Spotted Bass', importance: 'good', size: '1–2 lb', notes: 'Rock.' },
      { name: 'Catfish', importance: 'good', size: 'Channel + flathead', notes: 'River.' },
    ],
    patterns: [
      { title: 'Below Yates Dam — Striper Tailrace', target: 'Striped Bass and Spotted Bass', when: 'Spring & summer generation', technique: 'Bucktails, big swimbaits, live shad in the tailrace.', where: 'Thurlow headwaters.', details: 'Three dam cascade (Martin → Yates → Thurlow) creates layered tailrace fisheries.' },
    ],
    access: [
      'Wetumpka area ramps',
    ],
    regulations: 'AL fishing license.',
    managementProgram: ['Tallapoosa fishery'],
    notes: 'Thurlow Dam (1930), the last Tallapoosa impoundment before the Alabama River. Small pool, tailrace-driven fishery.',
  },
  {
    id: 'al-r-l-harris-reservoir',
    name: 'R.L. Harris Reservoir (Lake Wedowee)',
    state: 'AL',
    region: 'East Alabama',
    type: 'reservoir',
    county: 'Randolph / Clay',
    acres: 10660,
    maxDepthFt: 95,
    lat: 33.220, lng: -85.500,
    signatureSpecies: ['Largemouth Bass', 'Spotted Bass'],
    species: [
      { name: 'Largemouth Bass', importance: 'signature', size: '2–8 lb', notes: 'Florida-strain stocking has built trophy potential — Wedowee produces 8–10+ lb largemouth.' },
      { name: 'Spotted Bass', importance: 'strong', size: '1.5–3 lb', notes: 'Deep clear main lake.' },
      { name: 'Crappie', importance: 'strong', size: '0.5–1.5 lb', notes: 'Brush piles and creek mouths in 12–20 ft.' },
      { name: 'Striped Bass', importance: 'good', size: '10–25 lb', notes: 'Stocked.' },
      { name: 'Catfish', importance: 'good', size: 'Channel + flathead', notes: 'River channel.' },
    ],
    patterns: [
      { title: 'Wedowee Largemouth — Wood + Deep Cover', target: 'Largemouth Bass', when: 'Spring – Fall', technique: 'Jigs, Texas-rigged creature baits, ChatterBaits around standing timber and laydowns. Deep crankbaits in summer.', where: 'Creek arms (Wedowee Creek, Cane Creek, Wood Brushy Branch), standing timber stands.', details: 'Wedowee has significant standing timber and is a Florida-strain trophy lake — patience and big baits pay off.' },
      { title: 'Spring Spotted Bass — Main-Lake Rock', target: 'Spotted Bass', when: 'March – May', technique: 'Drop-shot, jerkbaits, shaky head on main-lake points and bluffs.', where: 'Main lake.', details: 'Typical Tallapoosa main-lake spot pattern.' },
      { title: 'Crappie Brush Piles', target: 'Crappie', when: 'Year-round', technique: 'Vertical jigging brush in 12–22 ft.', where: 'Creek-mouth brush piles.', details: 'State-marked and private brush piles dot the lake.' },
    ],
    access: [
      'Wedowee Marine, Flat Rock Park',
      'Public ramps at Foster Bridge, Mountain Creek',
    ],
    regulations: 'AL fishing license. Slot limit on largemouth: 13–16" protected slot (trophy management).',
    managementProgram: ['Florida-strain largemouth stocking', '13–16" largemouth slot limit (trophy management)', 'Crappie habitat enhancement'],
    notes: 'R.L. Harris Reservoir / Lake Wedowee (1983). 10,660 acres, deep, with standing timber and Florida-strain trophy largemouth program. A favorite of east Alabama bass anglers.',
  },

  // ============== ALABAMA + CAHABA RIVERS ==============
  {
    id: 'al-alabama-river',
    name: 'Alabama River',
    state: 'AL',
    region: 'Central Alabama',
    type: 'river',
    county: 'Multi-county',
    acres: null,
    maxDepthFt: null,
    lat: 31.870, lng: -87.300,
    signatureSpecies: ['Largemouth Bass', 'Spotted Bass', 'Catfish'],
    species: [
      { name: 'Largemouth Bass', importance: 'signature', size: '2–8 lb', notes: 'Three pools — Claiborne, Millers Ferry (Lake Dannelly), Robert F. Henry (Woodruff Lake). Trophy potential.' },
      { name: 'Spotted Bass', importance: 'signature', size: '1.5–4 lb', notes: 'Coosa-strain genetics flushed downstream.' },
      { name: 'Catfish', importance: 'signature', size: 'Blue 30–80 lb trophy class; flathead 30–60 lb', notes: 'The Alabama River is one of the South\'s premier trophy catfishing destinations.' },
      { name: 'Striped Bass', importance: 'strong', size: '15–35 lb', notes: 'Migratory from Mobile delta + stocked.' },
      { name: 'Crappie', importance: 'good', size: '0.5–2 lb', notes: 'Oxbows and creek mouths.' },
    ],
    patterns: [
      { title: 'Alabama River Trophy Blues', target: 'Catfish (Blue)', when: 'Year-round, peak fall – winter', technique: 'Fresh cut skipjack or gizzard shad on Santee rigs, drift main-channel ledges and deep holes (25–50 ft). Anchor on ledges in winter.', where: 'Main river channel, especially Millers Ferry pool and Claiborne pool.', details: 'Trophy blues to 80+ lb are a real possibility. The Alabama is the Mississippi River of the Southeast for catfish.' },
      { title: 'Largemouth — Backwater Cover', target: 'Largemouth Bass', when: 'Spring – Fall', technique: 'Frogs, jigs, and ChatterBaits around oxbow lily pads, laydowns, and creek mouths.', where: 'Oxbow lakes and slack-water backwaters off the main river.', details: 'Main-river current pushes largemouth into oxbows — fish the oxbows.' },
      { title: 'Tailrace Stripers + Spots — Below Each Dam', target: 'Striped Bass, Spotted Bass', when: 'Generation periods', technique: 'Bucktails, big swimbaits, live shad in tailwater turbulence.', where: 'Below Claiborne, Millers Ferry, and R.F. Henry dams.', details: 'Three dams = three tailrace fisheries.' },
    ],
    access: [
      'Selma, Camden, Monroeville public ramps',
      'Millers Ferry Lock and Dam',
      'Claiborne Lock and Dam',
    ],
    regulations: 'AL fishing license. Standard statewide bass and catfish regulations.',
    managementProgram: ['Trophy catfish conservation', 'Striped bass stocking', 'Multiple-pool habitat work'],
    notes: 'Alabama River — formed by confluence of Coosa and Tallapoosa near Wetumpka, runs 318 miles to the Mobile-Tensaw delta. Three navigation pools: R.F. Henry (Woodruff), Millers Ferry (Dannelly), Claiborne.',
  },
  {
    id: 'al-cahaba-river',
    name: 'Cahaba River',
    state: 'AL',
    region: 'Central Alabama',
    type: 'river',
    county: 'Jefferson / Bibb / Dallas',
    acres: null,
    maxDepthFt: null,
    lat: 33.000, lng: -87.150,
    signatureSpecies: ['Cahaba Bass (Redeye Bass)', 'Largemouth Bass'],
    species: [
      { name: 'Cahaba Bass (Redeye)', importance: 'signature', size: '8–14"; rarely larger', notes: 'The Cahaba is home to a distinct subspecies of redeye bass — a wild-river specialty. Aggressive, surface-feeding, beautiful fish.' },
      { name: 'Largemouth Bass', importance: 'strong', size: '2–6 lb', notes: 'Slack-water pools.' },
      { name: 'Spotted Bass', importance: 'strong', size: '1–3 lb', notes: 'Rock + current.' },
      { name: 'Bream', importance: 'good', size: 'Bluegill, longear, redbreast', notes: 'Excellent panfish stream.' },
      { name: 'Catfish', importance: 'good', size: 'Channel cats', notes: 'Lower river.' },
    ],
    patterns: [
      { title: 'Redeye Bass on Poppers — Wild River', target: 'Cahaba Bass (Redeye)', when: 'May – September', technique: 'Fly: small poppers (size 8–10) and rubber-legged terrestrials on 4–5 wt. Spin: small inline spinners (Mepps #1), 1/16-oz tubes.', where: 'Cahaba upstream of Centreville — riffles, plunge pools, current breaks.', details: 'The Cahaba is one of the most biodiverse rivers in North America (more species per mile than any other US river). Redeye bass on a fly rod in a wild Appalachian-foothills river — special.' },
      { title: 'Spring Cahaba Lily Bloom (Memorial Day)', target: 'Bream, Cahaba bass', when: 'Late May – early June', technique: 'Float through the Cahaba Lily blooms — sight-cast surface flies.', where: 'Cahaba River National Wildlife Refuge (between West Blocton and Centreville).', details: 'The Cahaba lily bloom is a regional natural-history event — the lilies grow only on shoal habitat. Float-fish during the bloom for a once-a-year experience.' },
      { title: 'Lower Cahaba Largemouth + Spots — Bibb / Dallas County', target: 'Largemouth and Spotted Bass', when: 'Spring – Fall', technique: 'ChatterBaits, jigs, square-bills around laydowns and pool tail-outs.', where: 'Lower Cahaba below the fall line.', details: 'Lower Cahaba is more typical Southern coastal-plain river fishing.' },
    ],
    access: [
      'Cahaba River National Wildlife Refuge (West Blocton)',
      'Caffee Junction, Old Mill Park (Bibb County)',
      'Centreville, Sprott access',
    ],
    regulations: 'AL fishing license. Standard regs. Catch-and-release encouraged for native redeye bass to protect the subspecies.',
    managementProgram: ['Cahaba River NWR habitat protection', 'Native redeye bass conservation'],
    notes: 'The Cahaba is Alabama\'s ecological crown jewel — wild, undammed for much of its length, with endemic species. Memorial Day lily bloom is iconic. Distinct "Cahaba redeye bass" subspecies. A must-visit warm-water fly-fishing destination.',
  },
];

function main() {
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  const existing = JSON.parse(raw);
  const byId = new Map(existing.map((e) => [e.id, e]));

  let appended = 0, skipped = 0;
  for (const entry of ENTRIES) {
    if (byId.has(entry.id)) {
      skipped++;
      console.log('  - skip (exists)', entry.id);
      continue;
    }
    existing.push(entry);
    byId.set(entry.id, entry);
    appended++;
    console.log('  + ', entry.id);
  }

  fs.writeFileSync(DATA_PATH, JSON.stringify(existing, null, 2) + '\n', 'utf8');
  console.log(`\nAppended ${appended}, skipped ${skipped}. Total: ${existing.length}`);
}

main();
