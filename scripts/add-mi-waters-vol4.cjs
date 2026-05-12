/**
 * Michigan Waters Guide — Volume 4: SE MI + SLP.
 *
 * Lake St. Clair (musky/smallmouth/perch capital), Detroit River
 * walleye, Saginaw Bay system, SLP rivers + lakes.
 *
 * Run: node scripts/add-mi-waters-vol4.cjs
 */

const fs = require('node:fs');
const path = require('node:path');

const FILE = path.join(__dirname, '..', 'data', 'waterbodies.json');

const NEW_ENTRIES = [
  // ============================================================
  // LAKE ST. CLAIR + DETROIT RIVER — the SE MI big-water system
  // ============================================================
  {
    id: 'mi-lake-st-clair',
    name: 'Lake St. Clair',
    state: 'MI',
    region: 'SE Michigan + Lake St. Clair',
    type: 'great-lake',
    county: 'Macomb / St. Clair / Wayne',
    acres: 274000,
    maxDepthFt: 21,
    lat: 42.45,
    lng: -82.65,
    signatureSpecies: 'Muskellunge, smallmouth bass, walleye, yellow perch',
    species: [
      { name: 'Muskellunge', importance: 'signature', size: '36-50 in, 55+ documented', notes: 'Arguably the best musky water in North America. Naturalized self-sustaining population. Charters book a year out.' },
      { name: 'Smallmouth bass', importance: 'signature', size: '3-5 lb, 6-7 lb possible', notes: 'World-class — Bassmaster Elite tour stops here. The Mile Roads in summer hold trophy bags.' },
      { name: 'Walleye', importance: 'signature', size: '14-22 in', notes: 'Best near the Detroit River channel + spring spawn run.' },
      { name: 'Yellow perch', importance: 'signature', size: '8-13 in, jumbo possible', notes: 'Cyclic but historically epic when on.' },
      { name: 'Northern pike', importance: 'strong', size: '5-15 lb' },
      { name: 'Largemouth bass', importance: 'strong', size: 'Anchor Bay + canals' },
      { name: 'Crappie', importance: 'good', size: 'Canals' },
      { name: 'Channel catfish', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Trolling musky on the open lake',
        target: 'Muskellunge',
        when: 'May-November',
        technique: 'Trolling big crankbaits (Believer, Bull Dawg, 10-12" Grandma) on planer boards; figure-8 boatside on every cast',
        where: 'Mile Roads off St. Clair Shores; the channels off the St. Clair Flats; Anchor Bay weed edges',
        details: 'Lake St. Clair musky population is THE reason this lake is famous. Average fish 36-44 in; 50+ inchers caught every year. Charter scene is robust. Trolling speed 4-6 mph (faster than inland-lake casting).',
      },
      {
        title: 'Drop-shot trophy smallmouth',
        target: 'Smallmouth bass',
        when: 'June-October',
        technique: 'Drop-shot 4-in finesse worm; tube jigs; Ned rigs in 10-25 ft',
        where: 'The Mile Roads (12 Mile, 13 Mile, etc.) — submerged road beds off St. Clair Shores; main-lake humps',
        details: 'Lake St. Clair smallmouth fishery is genuinely world-class. Bassmaster Elite + Major League Fishing host events here. Five-fish bags of 5+ lb fish each happen regularly. Wind direction dictates which side fishes — fish into the wind on shore.',
      },
      {
        title: 'Spring walleye + jumbo perch run',
        target: 'Walleye, yellow perch',
        when: 'April-May',
        technique: 'Jigging shiners + minnows; small swimbaits',
        where: 'Off the Detroit River channel; the St. Clair Flats',
        details: 'Walleye stage in the Detroit + St. Clair Rivers in early spring. Perch peak May-June in the open lake.',
      },
      {
        title: 'Anchor Bay largemouth + pike',
        target: 'Largemouth bass + northern pike',
        when: 'May-October',
        technique: 'Senkos, swim jigs, frogs over pads; in-line spinners + jerkbaits for pike',
        where: 'Anchor Bay (NW corner) — heavy weeds + pads',
        details: 'Anchor Bay is the shallow weed-flat sister to the open lake. Largemouth water at scale.',
      },
      {
        title: 'Winter perch ice fishing',
        target: 'Yellow perch',
        when: 'January-March',
        technique: 'Jigging minnow + waxworm rigs; tip-downs',
        where: 'Off Selfridge + the Mile Roads',
        details: 'Lake St. Clair ice scene is huge. Perch quality varies cyclically.',
      },
    ],
    access: ['Lake St. Clair Metropark', 'Metro Beach', 'Selfridge', 'Anchor Bay (New Baltimore)', 'St. Clair Flats', 'Harley Ensign'],
    regulations: 'MI license valid; near international waters in spots. Specific musky regs (36" min). Bass tournament regs may apply.',
    managementProgram: ['MI DNR musky management', 'Bi-national fisheries cooperation (US + Canada)'],
    notes: 'The undisputed #1 musky water in North America. Smallmouth fishery is also world-class. Charter scene is full-time. The Mile Roads are submerged road beds (built before the lake flooded them) that create perfect structure.',
  },
  {
    id: 'mi-detroit-river',
    name: 'Detroit River',
    state: 'MI',
    region: 'SE Michigan + Lake St. Clair',
    type: 'river',
    county: 'Wayne',
    river: 'Detroit River',
    lat: 42.28,
    lng: -83.10,
    signatureSpecies: 'Walleye, smallmouth bass, white bass, lake sturgeon',
    species: [
      { name: 'Walleye', importance: 'signature', size: '15-26 in, 10+ lb possible', notes: 'World-class spring walleye run. The Detroit River walleye run is one of the most-fished events in the Great Lakes.' },
      { name: 'Smallmouth bass', importance: 'strong', size: '2-5 lb' },
      { name: 'White bass', importance: 'strong', size: '10-14 in', notes: 'Spring run.' },
      { name: 'Lake sturgeon', importance: 'good', size: '40-80 in', notes: 'Catch + release. Below Belle Isle.' },
      { name: 'Yellow perch', importance: 'good' },
      { name: 'Northern pike', importance: 'good' },
      { name: 'Channel catfish', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Spring walleye run',
        target: 'Walleye',
        when: 'March-May (peak last week March through early May)',
        technique: 'Vertical jigging with 3/8-3/4 oz jigheads + plastic minnows (gulp, swim minnows); hair jigs with stinger hooks',
        where: 'Trenton Channel; off Lake Erie Metropark; below Wyandotte; Belle Isle area; the Livingstone Channel',
        details: 'THE Great Lakes walleye event. Tens of thousands of fish stack in the river to spawn in March-April. Jig vertically in 30-60 ft. Hire a charter — local knowledge matters.',
      },
      {
        title: 'Trophy white bass spring schools',
        target: 'White bass',
        when: 'April-May',
        technique: 'Casting small jigs + spinners + Cleos into schooling fish',
        where: 'Trenton Channel + off Wyandotte',
      },
    ],
    access: ['Trenton Channel', 'Wyandotte', 'Belle Isle', 'Lake Erie Metropark (mouth)', 'Bishop Park'],
    regulations: 'Spring walleye special regulations may apply. Sturgeon catch + release only. Border with Canada — US license OK in US waters.',
    managementProgram: ['MI DNR + Ontario MNRF cooperative walleye management', 'Sturgeon conservation'],
    notes: 'The connector between Lake St. Clair and Lake Erie. Spring walleye run is one of the most famous fish migrations in North America.',
  },
  {
    id: 'mi-st-clair-river',
    name: 'St. Clair River',
    state: 'MI',
    region: 'SE Michigan + Lake St. Clair',
    type: 'river',
    county: 'St. Clair',
    river: 'St. Clair River',
    signatureSpecies: 'Walleye, smallmouth bass, lake sturgeon',
    species: [
      { name: 'Walleye', importance: 'signature', size: '15-25 in', notes: 'Spring spawn run from Lake St. Clair into Lake Huron.' },
      { name: 'Smallmouth bass', importance: 'strong', size: '2-5 lb', notes: 'Heavy current = trophy smallmouth on bottom structure.' },
      { name: 'Lake sturgeon', importance: 'strong', size: '40-80 in', notes: 'Catch + release.' },
      { name: 'Channel catfish', importance: 'good' },
      { name: 'Northern pike', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Spring + fall walleye vertical jigging',
        target: 'Walleye',
        when: 'March-May + September-November',
        technique: 'Vertical jigging 1/2-1 oz jigheads in heavy current',
        where: 'Below Algonac; the St. Clair Flats delta area',
      },
    ],
    access: ['Algonac', 'Marine City', 'Port Huron'],
    notes: 'Connects Lake Huron + Lake St. Clair. Strong-current river with trophy walleye + sturgeon.',
  },

  // ============================================================
  // SAGINAW BAY SYSTEM
  // ============================================================
  {
    id: 'mi-saginaw-bay',
    name: 'Saginaw Bay (Lake Huron)',
    state: 'MI',
    region: 'Saginaw Bay system',
    type: 'great-lake',
    county: 'Bay / Tuscola / Huron / Arenac',
    lat: 43.92,
    lng: -83.55,
    signatureSpecies: 'Walleye, yellow perch, smallmouth bass',
    species: [
      { name: 'Walleye', importance: 'signature', size: '14-25 in, 10+ lb possible', notes: 'One of the most productive walleye fisheries in the Great Lakes. Self-sustaining population.' },
      { name: 'Yellow perch', importance: 'signature', size: '8-13 in, jumbo possible', notes: 'World-class jumbo perch when populations cycle high.' },
      { name: 'Smallmouth bass', importance: 'strong', size: '2-4 lb' },
      { name: 'Northern pike', importance: 'strong' },
      { name: 'Channel catfish', importance: 'good' },
      { name: 'Drum (sheepshead)', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Trolling walleye on the open bay',
        target: 'Walleye',
        when: 'May-October',
        technique: 'Crawler harnesses + bottom bouncers; trolling Reef Runners + Husky Jerks on planer boards',
        where: 'Inner Bay flats 12-22 ft; the Outer Bay 25-40 ft in summer',
        details: 'Saginaw Bay walleye fishery is genuinely world-class. Multiple year-class booms in recent years. Charter scene is robust out of Bay City + Caseville + Linwood.',
      },
      {
        title: 'Jumbo perch summer + fall',
        target: 'Yellow perch',
        when: 'June-October',
        technique: 'Crappie minnows + emerald shiners on perch rigs; small jigs + waxworms',
        where: 'Mid-bay over hard bottoms; the gravel shoals',
      },
    ],
    access: ['Bay City State Park', 'Caseville Harbor', 'Linwood', 'Sebewaing', 'Quanicassee', 'Au Gres'],
    managementProgram: ['MI DNR Saginaw Bay walleye management', 'Cyclical perch monitoring'],
    notes: 'Inner Bay is shallow + warm (10-30 ft); Outer Bay is deeper + colder. Walleye + perch fishery is the heart of MI Lake Huron angling.',
  },
  {
    id: 'mi-river-saginaw',
    name: 'Saginaw River',
    state: 'MI',
    region: 'Saginaw Bay system',
    type: 'river',
    county: 'Bay / Saginaw',
    river: 'Saginaw River',
    signatureSpecies: 'Walleye, channel catfish, white bass',
    species: [
      { name: 'Walleye', importance: 'signature', size: '15-25 in', notes: 'Spring walleye run from Saginaw Bay.' },
      { name: 'Channel catfish', importance: 'strong', size: '3-15 lb' },
      { name: 'White bass', importance: 'strong', size: '10-14 in', notes: 'Spring run.' },
      { name: 'Smallmouth bass', importance: 'good' },
      { name: 'Largemouth bass', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Spring walleye run',
        target: 'Walleye',
        when: 'March-May',
        technique: 'Jig + minnow at 3/8-1/2 oz; small swimbaits',
        where: 'Bay City + below the Center Avenue Dam in Saginaw',
        details: 'Saginaw walleye stage to spawn in late March-April. Less famous than Detroit but quality.',
      },
    ],
    access: ['Wenona Park (Bay City)', 'Veteran\'s Memorial Park', 'Imerman Park'],
    notes: 'Formed by confluence of the Tittabawassee + Shiawassee + Cass + Flint rivers. Drains the largest watershed in MI.',
  },
  {
    id: 'mi-river-tittabawassee',
    name: 'Tittabawassee River',
    state: 'MI',
    region: 'Saginaw Bay system',
    type: 'river',
    county: 'Midland / Saginaw',
    river: 'Tittabawassee River',
    signatureSpecies: 'Walleye, smallmouth bass, white bass',
    species: [
      { name: 'Walleye', importance: 'signature', size: '15-22 in', notes: 'Spring run staging here is iconic — fish move up from Saginaw Bay.' },
      { name: 'Smallmouth bass', importance: 'strong', size: '2-4 lb' },
      { name: 'White bass', importance: 'strong', size: '10-14 in' },
      { name: 'Channel catfish', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Spring walleye below Sanford Dam',
        target: 'Walleye',
        when: 'March-May',
        technique: 'Jigging plastics + minnows; small swimbaits',
        where: 'Below the (rebuilt) Sanford Dam; Midland area',
        details: 'The Sanford + Tittabawassee dams failed catastrophically in 2020. Rebuilding ongoing. Walleye habitat is shifting as the system recovers.',
      },
    ],
    access: ['Sanford', 'Midland', 'Freeland'],
    notes: 'The "Tittabawassee" run is part of the Saginaw walleye system. 2020 dam failure changed the river\'s character — recovery is ongoing.',
  },

  // ============================================================
  // SLP RIVERS + LAKES
  // ============================================================
  {
    id: 'mi-river-grand',
    name: 'Grand River',
    state: 'MI',
    region: 'Southern Lower Peninsula',
    type: 'great-lake-trib',
    county: 'Multiple — Lansing to Grand Haven',
    river: 'Grand River',
    lat: 43.06,
    lng: -85.67,
    signatureSpecies: 'King salmon, steelhead, walleye, smallmouth bass',
    species: [
      { name: 'King salmon (chinook)', importance: 'signature', size: '10-25 lb', notes: 'Fall run up from Lake Michigan to the 6th Street Dam in Grand Rapids.' },
      { name: 'Steelhead', importance: 'signature', size: '6-12 lb', notes: 'Spring + fall runs.' },
      { name: 'Walleye', importance: 'strong', size: '14-22 in', notes: 'Below dams (Lyons, Lansing).' },
      { name: 'Smallmouth bass', importance: 'strong', size: '1-3 lb' },
      { name: 'Channel catfish', importance: 'strong', size: '3-15 lb' },
      { name: 'White bass', importance: 'good' },
      { name: 'Largemouth bass', importance: 'good' },
      { name: 'Flathead catfish', importance: 'good', size: '10-30 lb' },
    ],
    patterns: [
      {
        title: 'Fall salmon at 6th Street Dam (Grand Rapids)',
        target: 'King + coho salmon',
        when: 'September-October',
        technique: 'Spawn sacs + spinners; bobbers + skein',
        where: 'Below 6th Street Dam in downtown Grand Rapids',
        details: 'Salmon stage below the 6th Street Dam in the heart of downtown Grand Rapids. Urban salmon fishing — most-fished hole in the SLP.',
      },
      {
        title: 'Spring walleye below dams',
        target: 'Walleye',
        when: 'March-May',
        technique: 'Jig + minnow at 1/4 oz',
        where: 'Below Lyons + Portland + Lansing dams',
      },
    ],
    access: ['6th Street Dam (Grand Rapids)', 'Lyons', 'Portland', 'Lansing', 'Mouth (Grand Haven)'],
    notes: 'MI\'s longest river. Flows from Jackson through Lansing + Grand Rapids to Lake Michigan at Grand Haven. Urban salmon fishery in downtown GR.',
  },
  {
    id: 'mi-river-kalamazoo',
    name: 'Kalamazoo River',
    state: 'MI',
    region: 'Southern Lower Peninsula',
    type: 'great-lake-trib',
    county: 'Multiple — Battle Creek to Saugatuck',
    river: 'Kalamazoo River',
    signatureSpecies: 'King salmon, steelhead, smallmouth bass, brown trout',
    species: [
      { name: 'King salmon (chinook)', importance: 'signature', size: '10-25 lb', notes: 'Fall run up to Allegan Dam.' },
      { name: 'Steelhead', importance: 'strong', size: '6-12 lb' },
      { name: 'Smallmouth bass', importance: 'strong', size: '1-4 lb' },
      { name: 'Brown trout', importance: 'good', size: '10-16 in' },
      { name: 'Channel catfish', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Salmon below Allegan Dam',
        target: 'King + coho salmon',
        when: 'September-October',
        technique: 'Spawn sacs + spinners',
        where: 'Allegan Dam tailwater',
      },
    ],
    access: ['Allegan Dam', 'Otsego', 'Saugatuck (mouth)'],
    notes: 'Tailwater fishing below Allegan Dam. Recovery from Enbridge oil spill (2010) is ongoing.',
  },
  {
    id: 'mi-river-st-joseph-berrien',
    name: 'St. Joseph River (Berrien County)',
    state: 'MI',
    region: 'Southern Lower Peninsula',
    type: 'great-lake-trib',
    county: 'Berrien',
    river: 'St. Joseph River',
    lat: 41.95,
    lng: -86.20,
    signatureSpecies: 'King salmon, steelhead, brown trout, smallmouth bass',
    species: [
      { name: 'King salmon (chinook)', importance: 'signature', size: '10-25 lb', notes: 'Fall run up to Berrien Springs Dam.' },
      { name: 'Coho salmon', importance: 'signature', size: '5-10 lb' },
      { name: 'Steelhead', importance: 'signature', size: '6-12 lb', notes: 'Skamania + winter strain.' },
      { name: 'Brown trout', importance: 'strong', size: '10-18 in' },
      { name: 'Smallmouth bass', importance: 'strong' },
      { name: 'Walleye', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Salmon staging at Berrien Springs Dam',
        target: 'King + coho salmon',
        when: 'September-October',
        technique: 'Spawn sacs + spinners; spey casting',
        where: 'Berrien Springs Dam tailwater',
      },
    ],
    access: ['Berrien Springs Dam', 'Buchanan', 'Niles', 'Mouth at St. Joseph (Lake Michigan)'],
    notes: 'NOT the same St. Joseph River as the South Bend one (different watershed). This one drains to Lake Michigan at St. Joseph, MI.',
  },
  {
    id: 'mi-river-au-sable-mouth',
    name: 'Au Sable River — Lower (Oscoda)',
    state: 'MI',
    region: 'Saginaw Bay system',
    type: 'great-lake-trib',
    county: 'Iosco',
    river: 'Au Sable River',
    signatureSpecies: 'King salmon, steelhead, walleye',
    species: [
      { name: 'King salmon (chinook)', importance: 'signature', size: '10-20 lb', notes: 'Fall run up from Lake Huron.' },
      { name: 'Steelhead', importance: 'strong', size: '6-12 lb' },
      { name: 'Walleye', importance: 'strong', size: '14-22 in' },
      { name: 'Smallmouth bass', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Fall Au Sable salmon (Foote Dam)',
        target: 'King + coho salmon',
        when: 'September-October',
        technique: 'Spawn sacs + spinners',
        where: 'Below Foote Dam (Iosco County) downstream to Oscoda',
        details: 'The Lake Huron side of the Au Sable. Foote Dam is the limit of upstream salmon passage. Less crowded than Lake Michigan tribs.',
      },
    ],
    access: ['Foote Dam', 'Oscoda', 'Mouth at Lake Huron'],
    notes: 'The Au Sable\'s lower 12 miles below Foote Dam is salmon + walleye water. Distinct from the Holy Water (upper Au Sable trout system).',
  },
];

const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const byId = new Map(data.map((w) => [w.id, w]));
let appended = 0;
for (const e of NEW_ENTRIES) {
  if (byId.has(e.id)) { console.log(`  exists ${e.id}`); continue; }
  data.push(e); byId.set(e.id, e);
  console.log(`  + ${e.id} (${e.species.length} species · ${e.patterns.length} patterns)`);
  appended++;
}
console.log(`\nAppended ${appended} entries. Total: ${data.length}`);
fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n', 'utf8');
