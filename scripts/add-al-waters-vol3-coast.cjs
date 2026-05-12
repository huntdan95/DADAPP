// Add Alabama Coast Vol 3 — Mobile-Tensaw Delta + Mobile Bay + Gulf coastal.
// Idempotent merge into data/waterbodies.json.

const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'data', 'waterbodies.json');

const ENTRIES = [
  // ============== MOBILE-TENSAW DELTA ==============
  {
    id: 'al-mobile-tensaw-delta',
    name: 'Mobile-Tensaw Delta',
    state: 'AL',
    region: 'Coastal Alabama',
    type: 'river',
    county: 'Baldwin / Mobile',
    acres: 260000,
    maxDepthFt: 40,
    lat: 30.840, lng: -87.940,
    signatureSpecies: ['Largemouth Bass', 'Redfish', 'Speckled Trout', 'Catfish'],
    species: [
      { name: 'Largemouth Bass', importance: 'signature', size: '2–8 lb; trophies 10+ lb', notes: '"America\'s Amazon" — the Mobile-Tensaw Delta is one of the most diverse river deltas in the country. Florida-strain influence + endless cover.' },
      { name: 'Redfish', importance: 'signature', size: '15–35"; bulls 36"+', notes: 'Bull reds push up into the brackish delta from Mobile Bay year-round; slot reds in marshes year-round.' },
      { name: 'Speckled Trout', importance: 'signature', size: '14–24"; trophy 5+ lb', notes: 'Brackish stretches — fall is peak.' },
      { name: 'Catfish', importance: 'signature', size: 'Blue 30–80 lb; flathead 30–60 lb', notes: 'Delta is one of America\'s premier trophy catfish destinations — multiple state-record class fish.' },
      { name: 'Striped Bass', importance: 'good', size: '10–30 lb', notes: 'Migratory + remnant Gulf-strain.' },
      { name: 'Crappie', importance: 'good', size: '0.5–2 lb', notes: 'Oxbows and creek mouths.' },
      { name: 'Bream', importance: 'good', size: 'Bluegill, redear', notes: 'Lily pads and cypress knees.' },
    ],
    patterns: [
      { title: 'Delta Largemouth — Frogs in Lily Pads', target: 'Largemouth Bass', when: 'May – September', technique: 'Hollow-body frogs (SPRO Bronzeye, Booyah Pad Crasher) over hyacinth mats, lily pads, and grass mats. Punching with 1.5–2 oz tungsten and creature baits in the thickest stuff.', where: 'Tensaw River, Mobile River backwaters, Bay Minette Basin, Chuckfee Bay, Stiggins Lake, Bayou Sara.', details: 'The Delta is a frog-fishing paradise — 260,000 acres of lily-pad, hyacinth, and grass cover. Heavy braid (65 lb), strong rods, no apologies.' },
      { title: 'Speckled Trout — Brackish Bayous', target: 'Speckled Trout', when: 'September – December peak', technique: 'Soft-plastic paddle tails (DOA, MirrOLure) under a popping cork, or topwater (Heddon Spook Jr.) on calm mornings.', where: 'Lower delta bayous: Tensaw, Apalachee, Mobile river mouths into the bay.', details: 'Fall trout push from the bay into the bayous chasing shrimp and shad.' },
      { title: 'Bull Redfish — River Mouth Schools', target: 'Redfish', when: 'September – November', technique: 'Big cut bait (mullet or pogie chunks) on Carolina rigs at the river mouths; or sight-cast schools with big swimbaits.', where: 'Mouths of Mobile River, Tensaw River, Blakeley River into the upper bay.', details: 'Bulls stack at the river mouths in fall — drum and croaker, too.' },
      { title: 'Trophy Catfish — Channel Drifting', target: 'Catfish (Blue and Flathead)', when: 'Year-round, peak fall – winter', technique: 'Fresh cut skipjack on Santee rigs, drifted across river channel ledges (15–35 ft).', where: 'Mobile and Tensaw river channels, deep bend holes.', details: 'The Delta\'s flathead and blue catfish are huge — state records have come from this system. Heavy gear, fresh bait, anchored in winter holes.' },
      { title: 'Spring Crappie Cypress Knees', target: 'Crappie', when: 'February – April', technique: 'Long-pole jigging 1/16-oz jigs around cypress knees, lily pad stems, and shoreline wood.', where: 'Oxbow lakes off the rivers — Stiggins, Chuckfee, Big Bateau.', details: 'Skinny shallow water in spring — visible cypress strikes.' },
    ],
    access: [
      'Cliff\'s Landing (Tensaw River, Baldwin County)',
      'Live Oak Landing, Stockton',
      'Blakeley State Park (south end)',
      'Bayou La Batre area south of the delta',
      'Hubbard Landing',
    ],
    regulations: 'AL freshwater + saltwater licenses required (saltwater for redfish, trout, and brackish-zone fishing). Redfish: 16–26" slot, 3/day. Speckled trout: 15" minimum, 6/day. Bass: standard.',
    managementProgram: ['Mobile-Tensaw Delta wildlife refuge', 'Multi-species habitat conservation', 'Saltwater stock assessment'],
    notes: 'Mobile-Tensaw Delta — "America\'s Amazon." Second-largest river delta in the US (260,000 acres). The Mobile, Tensaw, Apalachee, and Blakeley rivers braid through swamp, bayou, and marsh before emptying into Mobile Bay. Possibly the most species-rich freshwater body in North America. World-class trophy largemouth, catfish, AND saltwater redfish/trout in one system.',
  },

  // ============== MOBILE BAY ==============
  {
    id: 'al-mobile-bay',
    name: 'Mobile Bay',
    state: 'AL',
    region: 'Coastal Alabama',
    type: 'saltwater',
    county: 'Mobile / Baldwin',
    acres: 410000,
    maxDepthFt: 20,
    lat: 30.500, lng: -87.950,
    signatureSpecies: ['Speckled Trout', 'Redfish', 'Flounder'],
    species: [
      { name: 'Speckled Trout', importance: 'signature', size: '14–24"; trophies 5–8 lb', notes: 'Mobile Bay produces some of the Gulf\'s biggest specks — 8-pounders from grass-edge waders are real.' },
      { name: 'Redfish', importance: 'signature', size: 'Slots 16–26"; bulls 36–48"', notes: 'Slot reds in shallow grass; bulls in deeper bay and at ship channel mouth.' },
      { name: 'Flounder', importance: 'signature', size: '14–22"; trophies 4–6 lb', notes: 'Excellent fall flounder run — gigging legal at night.' },
      { name: 'Spanish Mackerel', importance: 'strong', size: '1–4 lb', notes: 'Bay mouth and channel.' },
      { name: 'White Trout', importance: 'good', size: '10–14"', notes: 'Numbers fish, good eating.' },
      { name: 'Sheepshead', importance: 'good', size: '2–6 lb', notes: 'Pilings, jetties, oyster reefs.' },
      { name: 'Tripletail', importance: 'good', size: '5–20 lb', notes: 'Sight-fish around floating crab traps and buoys in summer.' },
    ],
    patterns: [
      { title: 'Speckled Trout — Grass Edges', target: 'Speckled Trout', when: 'Year-round, peak April – October', technique: 'Topwater (Heddon Spook Jr., MirrOLure Top Dog) at dawn; soft plastics (DOA shrimp, Z-Man PaddlerZ) under a popping cork through the day. Live shrimp under cork is the deadliest bait.', where: 'Eastern shore grass beds (Fairhope, Daphne), Fish River mouth, Weeks Bay, lower bay islands.', details: 'Mobile Bay grass beds hold both numbers and trophy potential. Wading the eastern shore at first light is the classic move.' },
      { title: 'Bull Redfish — Ship Channel + Bay Mouth', target: 'Redfish (Bull)', when: 'August – November', technique: 'Big chunks of mullet or blue crab on Carolina rigs; jigs and big swimbaits when schools are visible.', where: 'Mobile Ship Channel, Dixey Bar, bay mouth at the Gulf.', details: 'Fall bull-red run stacks 30–48" reds at the bay mouth. Dixey Bar is famous for it.' },
      { title: 'Fall Flounder Run', target: 'Flounder', when: 'October – November', technique: 'Jigs (3" Gulp shrimp on 1/4-oz jighead), live mud minnows on Carolina rigs. Drift drop-offs near ICW and bay channels.', where: 'ICW, Fish River, Bon Secour, Dog River.', details: 'Fall flounder migration stages in the bay before heading to Gulf — peak numbers in October.' },
      { title: 'Tripletail — Crab Trap Buoys', target: 'Tripletail', when: 'June – September', technique: 'Sight-cast with live shrimp on a free-line or with a popping cork to fish hanging under floating buoys.', where: 'Lower bay around crab trap markers, channel buoys.', details: 'Specialty fishery — pure visual sight-casting in calm conditions.' },
      { title: 'Jubilee', target: 'All species', when: 'Summer nights at high humidity + east wind', technique: 'Wade or scoop fish in the surf line as hypoxic water pushes flounder, shrimp, crab, and trout onto the beach.', where: 'Eastern shore beaches, primarily Daphne–Fairhope.', details: 'A Mobile Bay phenomenon — when conditions align, fish strand in the shallows. Not predictable but local watchers track conditions. Cultural experience as much as fishery.' },
    ],
    access: [
      'Cedar Point Pier (south Mobile Bay)',
      'Bayfront Park (Daphne), Battles Wharf (Point Clear)',
      'Fairhope Pier, Magnolia Beach (Fairhope public)',
      'Dauphin Island public ramps + bridge fishing',
      'Fort Morgan Peninsula',
      'Bon Secour and Wolf Bay access',
    ],
    regulations: 'AL saltwater license. Speckled trout: 15" minimum, 6/day. Redfish: 16–26" slot, 3/day (one over 26" allowed). Flounder: 14" minimum, 5/day. Check ADCNR.',
    managementProgram: ['Inshore saltwater fishery management', 'Oyster habitat restoration', 'Speckled trout stock assessment'],
    notes: 'Mobile Bay — 4th largest estuary in the US. The "Jubilee" phenomenon (fish stranding) is unique in the world to this bay. Eastern shore (Fairhope, Daphne) is the trophy speck zone; lower bay around Dauphin Island is the redfish and ship channel zone. World-class inshore fishery.',
  },

  // ============== GULF COAST ==============
  {
    id: 'al-bon-secour-bay',
    name: 'Bon Secour Bay & River',
    state: 'AL',
    region: 'Coastal Alabama',
    type: 'saltwater',
    county: 'Baldwin',
    acres: null,
    maxDepthFt: 12,
    lat: 30.293, lng: -87.745,
    signatureSpecies: ['Speckled Trout', 'Redfish'],
    species: [
      { name: 'Speckled Trout', importance: 'signature', size: '15–22"; trophy specks possible', notes: 'Bon Secour grass flats and creek mouths are a classic trout zone.' },
      { name: 'Redfish', importance: 'signature', size: '16–26" slot reds', notes: 'Shallow marsh and creek edges.' },
      { name: 'Flounder', importance: 'good', size: '14–20"', notes: 'Creek mouths and sand cuts.' },
      { name: 'Black Drum', importance: 'good', size: '2–10 lb; bigger drum possible', notes: 'Oyster bars and pilings.' },
      { name: 'Sheepshead', importance: 'good', size: '2–4 lb', notes: 'Pilings, oyster reefs.' },
    ],
    patterns: [
      { title: 'Marsh Redfish — Sight-Cast Shallow Cuts', target: 'Redfish', when: 'Year-round, peak fall', technique: 'Sight-cast tailing reds with weedless spoons (Johnson silver) or shrimp imitations on light jigheads. Live shrimp under cork in stained water.', where: 'Bon Secour River marsh, oyster bar fringes.', details: 'Bon Secour is one of the best shallow-water sight-fishing zones in coastal Alabama.' },
      { title: 'Speckled Trout — Creek Mouths', target: 'Speckled Trout', when: 'Spring – Fall', technique: 'Soft plastics under a popping cork at creek mouths on falling tide.', where: 'Bon Secour River drainages into the bay.', details: 'Falling tides funnel bait out of marsh creeks — trout stack at the mouths.' },
    ],
    access: [
      'Bon Secour public ramp (Baldwin County)',
      'Bon Secour National Wildlife Refuge (limited access)',
    ],
    regulations: 'AL saltwater license. Standard inshore regs apply.',
    managementProgram: ['Bon Secour NWR protection', 'Inshore species management'],
    notes: 'Bon Secour Bay and River — a smaller, quieter inshore complex on the south side of Mobile Bay near Gulf Shores. Bon Secour NWR protects significant habitat.',
  },
  {
    id: 'al-wolf-bay',
    name: 'Wolf Bay',
    state: 'AL',
    region: 'Coastal Alabama',
    type: 'saltwater',
    county: 'Baldwin',
    acres: 8500,
    maxDepthFt: 8,
    lat: 30.330, lng: -87.620,
    signatureSpecies: ['Speckled Trout', 'Redfish', 'Flounder'],
    species: [
      { name: 'Speckled Trout', importance: 'signature', size: '14–22"', notes: 'Wolf Bay produces consistent specks year-round.' },
      { name: 'Redfish', importance: 'signature', size: '16–26" slot reds', notes: 'Marsh edges and oyster reefs.' },
      { name: 'Flounder', importance: 'strong', size: '14–20"', notes: 'Wolf Bay is a flounder gigging destination.' },
      { name: 'Black Drum', importance: 'good', size: '2–8 lb', notes: 'Oyster bars.' },
      { name: 'Sheepshead', importance: 'good', size: '2–4 lb', notes: 'Pilings.' },
    ],
    patterns: [
      { title: 'Wolf Bay Trout — Topwater Daybreak', target: 'Speckled Trout', when: 'April – October', technique: 'Heddon Spook Jr. and MirrOLure topwaters at first light over grass flats.', where: 'Wolf Bay main bay and creek mouths.', details: 'Sheltered, productive, less-pressured than Mobile Bay\'s east shore.' },
      { title: 'Flounder Gigging at Night', target: 'Flounder', when: 'October – November (legal gigging season)', technique: 'Bright LED bow lights, wade or shallow-draft skiff over sand and grass flats at night.', where: 'Wolf Bay sand flats, ICW edges.', details: 'Wolf Bay is one of coastal Alabama\'s legendary flounder gigging destinations. Check current regulations.' },
    ],
    access: [
      'Cotton Bayou (Orange Beach)',
      'Wolf Bay public ramps (Gulf Shores/Foley area)',
    ],
    regulations: 'AL saltwater license. Standard inshore regs.',
    managementProgram: ['Inshore management'],
    notes: 'Wolf Bay — north of Orange Beach. Shallow, productive, popular with local guides. Major flounder gigging culture.',
  },
  {
    id: 'al-perdido-bay',
    name: 'Perdido Bay & Perdido Pass',
    state: 'AL',
    region: 'Coastal Alabama',
    type: 'saltwater',
    county: 'Baldwin',
    acres: 31000,
    maxDepthFt: 18,
    lat: 30.336, lng: -87.448,
    signatureSpecies: ['Speckled Trout', 'Redfish', 'Spanish Mackerel'],
    species: [
      { name: 'Speckled Trout', importance: 'signature', size: '14–22"', notes: 'Bay and pass area produce consistent specks.' },
      { name: 'Redfish', importance: 'signature', size: '16–48" (slots + bulls)', notes: 'Slot reds in bay; bulls at the pass in fall.' },
      { name: 'Spanish Mackerel', importance: 'strong', size: '1–4 lb', notes: 'Schools blast through Perdido Pass on incoming tides.' },
      { name: 'Flounder', importance: 'good', size: '14–20"', notes: 'Sand flats.' },
      { name: 'King Mackerel', importance: 'good', size: '8–25 lb', notes: 'Nearshore Gulf just outside pass.' },
      { name: 'Sheepshead', importance: 'good', size: '2–5 lb', notes: 'Pass jetties — winter convict run.' },
    ],
    patterns: [
      { title: 'Perdido Pass — Spanish Mackerel + Bluefish', target: 'Spanish Mackerel', when: 'April – October', technique: 'Gotcha plugs and small spoons on light tackle. Cast and crank fast as schools blitz through the pass.', where: 'Perdido Pass jetties, mouth of bay.', details: 'Perdido Pass is one of Alabama\'s most reliable Spanish mackerel spots — easy walking access from jetties.' },
      { title: 'Fall Bull Redfish — Pass', target: 'Redfish (Bull)', when: 'September – November', technique: 'Big chunks of mullet or blue crab on Carolina rigs from jetties or boats; sight-cast schools.', where: 'Perdido Pass jetties + tide line out front.', details: 'Bull-red migration stacks 36–48" reds at the pass in fall.' },
      { title: 'Winter Sheepshead Jetty Run', target: 'Sheepshead', when: 'January – March', technique: 'Live fiddler crabs or pieces of shrimp on small jighead or split-shot rigs, dropped tight to jetty rocks.', where: 'Perdido Pass jetties.', details: 'Convict run — sheepshead stack on jetty barnacles. Sensitive bite, sharp teeth.' },
    ],
    access: [
      'Perdido Pass public jetty (Orange Beach)',
      'Boggy Point Boat Launch',
      'Bear Point Marina',
    ],
    regulations: 'AL saltwater license. Spanish mackerel: 12" minimum, 15/day. Standard inshore regs for trout/redfish/flounder.',
    managementProgram: ['Inshore + nearshore management'],
    notes: 'Perdido Bay straddles the AL/FL line. Perdido Pass at Orange Beach connects bay to Gulf — major recreational fishery, easy public jetty access, year-round species mix.',
  },
  {
    id: 'al-dauphin-island',
    name: 'Dauphin Island (Bay + Gulf side)',
    state: 'AL',
    region: 'Coastal Alabama',
    type: 'saltwater',
    county: 'Mobile',
    acres: null,
    maxDepthFt: 35,
    lat: 30.250, lng: -88.130,
    signatureSpecies: ['Speckled Trout', 'Redfish', 'Spanish Mackerel', 'Pompano'],
    species: [
      { name: 'Speckled Trout', importance: 'signature', size: '14–24"', notes: 'Bay-side grass and pier fishing.' },
      { name: 'Redfish', importance: 'signature', size: '16–48"', notes: 'Slot reds bay-side; bulls at the ship channel and Dixey Bar.' },
      { name: 'Spanish Mackerel', importance: 'strong', size: '1–4 lb', notes: 'Schools at the pier and pass.' },
      { name: 'Pompano', importance: 'strong', size: '1–3 lb', notes: 'Surf fishing — sand flea bait on Pompano rigs.' },
      { name: 'King Mackerel', importance: 'good', size: '10–30 lb', notes: 'Trolled offshore.' },
      { name: 'Tarpon', importance: 'good', size: '50–150 lb', notes: 'Summer migration past Dauphin Island.' },
      { name: 'Cobia', importance: 'good', size: '20–60 lb', notes: 'Spring run, sight-cast.' },
      { name: 'Sheepshead', importance: 'good', size: '2–5 lb', notes: 'Pier and bridge pilings.' },
    ],
    patterns: [
      { title: 'Surf Fishing — Pompano + Whiting', target: 'Pompano', when: 'April – June and September – November', technique: 'Sand fleas (mole crabs) or shrimp on a Pompano rig (two-hook surf rig) cast into the second bar from shore.', where: 'Gulf-side beaches of Dauphin Island.', details: 'Classic Gulf Coast surf-fishing — pompano are prized eating fish.' },
      { title: 'Spring Cobia Sight-Casting', target: 'Cobia', when: 'April – May', technique: 'Sight-cast cruising fish from boat with bucktails (2–4 oz), big swimbaits, or live eels. Cobia run east-to-west along the Gulf beaches.', where: 'Nearshore Gulf along Dauphin Island and Fort Morgan beaches.', details: 'Cobia tournaments draw crowds in April — a Gulf Coast spring tradition.' },
      { title: 'Dauphin Island Pier — Spanish Mackerel + Tarpon', target: 'Spanish Mackerel and Tarpon', when: 'June – September', technique: 'Gotcha plugs and Spanish spoons for mackerel. Live bait under floats or sight-cast for tarpon when they roll.', where: 'Dauphin Island Public Fishing Pier.', details: 'The pier is one of the Gulf\'s great public-access fishing platforms — multiple species in a single visit.' },
      { title: 'Dixey Bar Bull Reds', target: 'Redfish (Bull)', when: 'August – November', technique: 'Big cut bait (mullet, pogie) on Carolina rigs; vertical jigging spoons.', where: 'Dixey Bar (sandbar at Mobile Bay mouth, Gulf side of Dauphin Island).', details: 'Dixey Bar is legendary — bull reds stack here every fall.' },
    ],
    access: [
      'Dauphin Island Public Fishing Pier (major)',
      'Multiple public ramps + park access',
      'Fort Gaines area (east end)',
      'Bayou Heron, west end ramps',
    ],
    regulations: 'AL saltwater license. Standard inshore + Gulf federal regs (some species have closed seasons offshore).',
    managementProgram: ['Coastal fisheries management', 'Beach access conservation'],
    notes: 'Dauphin Island — barrier island at Mobile Bay mouth. Inshore bay-side + Gulf-side surf + public fishing pier. The single most fishable AL coastal spot for non-boat anglers.',
  },
  {
    id: 'al-mississippi-sound-al',
    name: 'Mississippi Sound (Alabama portion)',
    state: 'AL',
    region: 'Coastal Alabama',
    type: 'saltwater',
    county: 'Mobile',
    acres: null,
    maxDepthFt: 15,
    lat: 30.260, lng: -88.300,
    signatureSpecies: ['Speckled Trout', 'Redfish', 'Flounder'],
    species: [
      { name: 'Speckled Trout', importance: 'signature', size: '14–24"; trophies possible', notes: 'Sound grass flats and oyster reefs.' },
      { name: 'Redfish', importance: 'signature', size: '16–48"', notes: 'Slot reds inshore, bulls at pass mouths.' },
      { name: 'Flounder', importance: 'good', size: '14–20"', notes: 'Sand cuts and oyster reefs.' },
      { name: 'Spanish Mackerel', importance: 'good', size: '1–4 lb', notes: 'Schools across the sound in summer.' },
      { name: 'Black Drum', importance: 'good', size: '2–10 lb', notes: 'Oyster reefs.' },
    ],
    patterns: [
      { title: 'Sound Trout — Oyster Reefs + Grass', target: 'Speckled Trout', when: 'Year-round', technique: 'Soft plastics under popping cork, topwater at first light, live shrimp anytime.', where: 'Sound oyster reefs west of Dauphin Island toward MS line.', details: 'The Mississippi Sound is shallow, grass + oyster reef habitat — classic Gulf Coast inshore.' },
      { title: 'Bayou Mouth Redfish — Falling Tide', target: 'Redfish', when: 'Year-round', technique: 'Gold spoons, soft plastics, and live shrimp around bayou and creek mouths on falling tide.', where: 'Bayou la Batre, Heron Bayou, sound-side creeks.', details: 'Falling tide concentrates bait — reds set up on the edges.' },
    ],
    access: [
      'Bayou La Batre public ramp',
      'Coden public ramp',
      'Dauphin Island west-end ramps',
    ],
    regulations: 'AL saltwater license. Standard inshore regs.',
    managementProgram: ['Sound oyster reef restoration', 'Inshore species management'],
    notes: 'Mississippi Sound — the lagoonal system between Alabama\'s barrier islands and the mainland, extending west into Mississippi. Shallow, grass + oyster reef habitat. Lesser-pressured than Mobile Bay east shore.',
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
