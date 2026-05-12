/**
 * Michigan Waters Vol 5 — NE LP rivers + Lake Huron tribs + more
 * NLP wild-trout streams. The "east side" of the Lower Peninsula
 * that the prior volumes underweighted.
 *
 * Run: node scripts/add-mi-waters-vol5.cjs
 */
const fs = require('node:fs');
const path = require('node:path');
const FILE = path.join(__dirname, '..', 'data', 'waterbodies.json');

const NEW_ENTRIES = [
  {
    id: 'mi-river-au-sable-north-branch',
    name: 'Au Sable River — North Branch',
    state: 'MI',
    region: 'NLP wild-trout rivers',
    type: 'river',
    county: 'Crawford / Otsego',
    river: 'Au Sable River (North Branch)',
    signatureSpecies: 'Brook trout, brown trout',
    species: [
      { name: 'Brook trout', importance: 'signature', size: '8-12 in, occasional 14+', notes: 'Wild specks — the North Branch is the brookie-stronghold branch of the Au Sable.' },
      { name: 'Brown trout', importance: 'strong', size: '10-16 in' },
      { name: 'Rainbow trout', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Hex hatch night fishing',
        target: 'Brown + brook trout',
        when: 'Late June through mid-July',
        technique: 'Size 6 Hex dries; spinners fall at dusk',
        where: 'Silt-bottom slow stretches below Lovells',
        details: 'The North Branch Hex hatch fishes similarly to the Holy Water but with smaller water + smaller crowds.',
      },
      {
        title: 'Searching dry-fly small water',
        target: 'Brook trout',
        when: 'May-September',
        technique: 'Adams (#14-16), Royal Wulff, Madsen\'s Skunk, Roberts Yellow Drake',
        where: 'Pocket water + log jams throughout',
      },
    ],
    access: ['Lovells', 'Twin Bridge', 'Sheep Ranch', 'Dam 4'],
    regulations: 'Flies-only stretches; catch + release in select water.',
    notes: 'Fuller\'s North Branch Outing Club (Bear Andrews\'s guide base) is here. Smaller + intimate version of the Holy Water.',
  },
  {
    id: 'mi-river-au-sable-south-branch',
    name: 'Au Sable River — South Branch',
    state: 'MI',
    region: 'NLP wild-trout rivers',
    type: 'river',
    county: 'Crawford / Roscommon',
    river: 'Au Sable River (South Branch)',
    signatureSpecies: 'Brown trout, brook trout',
    species: [
      { name: 'Brown trout', importance: 'signature', size: '10-16 in, occasional 22+' },
      { name: 'Brook trout', importance: 'strong', size: '8-12 in' },
      { name: 'Rainbow trout', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Mason Tract wild-trout fishing',
        target: 'Brown + brook trout',
        when: 'May-October',
        technique: 'Dry-fly + dry-dropper + small streamers',
        where: 'Mason Tract (special regs section between Smith Bridge + Lower High Banks)',
        details: 'The South Branch\'s Mason Tract is one of MI\'s flagship wild-trout management stretches. Special regs apply.',
      },
      {
        title: 'Hex hatch big browns',
        target: 'Brown trout',
        when: 'Late June through mid-July',
        technique: 'Size 6 Hex dries',
        where: 'Silt holes below Smith Bridge',
      },
    ],
    access: ['Smith Bridge', 'Chase Bridge', 'Lower High Banks', 'Canoe Harbor'],
    regulations: 'Mason Tract = flies-only catch-and-release.',
    notes: 'Joins the main Au Sable below Smith Bridge. Mason Tract is sacred trout water.',
  },
  {
    id: 'mi-river-jordan',
    name: 'Jordan River',
    state: 'MI',
    region: 'NLP wild-trout rivers',
    type: 'river',
    county: 'Antrim / Charlevoix',
    river: 'Jordan River',
    signatureSpecies: 'Brook trout, brown trout, steelhead',
    species: [
      { name: 'Brook trout', importance: 'signature', size: '7-11 in, occasional 14+', notes: 'Coldwater jewel — designated MI Wild + Scenic.' },
      { name: 'Brown trout', importance: 'strong', size: '10-16 in' },
      { name: 'Steelhead', importance: 'good', size: '6-10 lb', notes: 'Lake Michigan run via Lake Charlevoix.' },
      { name: 'Rainbow trout', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Headwater wild brookie wading',
        target: 'Brook trout',
        when: 'May-September',
        technique: 'Small dries (#14-18); small streamers',
        where: 'Headwaters at Jordan Valley + downstream',
      },
    ],
    access: ['Jordan Valley Pathway', 'Graves Crossing', 'Pinney Bridge'],
    regulations: 'MI Wild + Scenic River designation. Special regs apply in stretches.',
    notes: 'Pristine designated Wild + Scenic River draining into Lake Charlevoix. Brookie water at its finest.',
  },
  {
    id: 'mi-river-sturgeon-cheboygan',
    name: 'Sturgeon River (Cheboygan)',
    state: 'MI',
    region: 'NLP wild-trout rivers',
    type: 'river',
    county: 'Otsego / Cheboygan',
    river: 'Sturgeon River',
    signatureSpecies: 'Brown trout, brook trout',
    species: [
      { name: 'Brown trout', importance: 'signature', size: '10-16 in' },
      { name: 'Brook trout', importance: 'strong', size: '8-12 in' },
      { name: 'Rainbow trout', importance: 'good' },
      { name: 'Smallmouth bass', importance: 'good', notes: 'Lower river.' },
    ],
    patterns: [
      {
        title: 'Trout wading near Wolverine',
        target: 'Brown + brook trout',
        when: 'May-October',
        technique: 'Adams, Stim, sm streamers; Borchers Drake in season',
        where: 'Below Wolverine; pocket water',
      },
    ],
    access: ['Wolverine', 'Trowbridge', 'Mullett Lake outlet'],
    notes: 'Not the UP Sturgeon River — this is the NE LP Sturgeon, which drains into Mullett Lake then to the Inland Waterway. Confusingly-named.',
  },
  {
    id: 'mi-river-pigeon-otsego',
    name: 'Pigeon River (Otsego County)',
    state: 'MI',
    region: 'NLP wild-trout rivers',
    type: 'river',
    county: 'Otsego / Cheboygan',
    river: 'Pigeon River',
    signatureSpecies: 'Brown trout, brook trout',
    species: [
      { name: 'Brown trout', importance: 'signature', size: '10-16 in' },
      { name: 'Brook trout', importance: 'strong', size: '7-11 in' },
      { name: 'Rainbow trout', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Pigeon River Country wading',
        target: 'Brown + brook trout',
        when: 'May-October',
        technique: 'Dry-fly + small streamers',
        where: 'Pigeon River Country State Forest',
        details: 'Pigeon River Country = MI\'s largest contiguous public forest. Wild-trout water.',
      },
    ],
    access: ['Pigeon Bridge', 'Pickerel Lake area', 'Big Hardwood', 'Cornwall Creek'],
    notes: 'NOT the same Pigeon River as the LaGrange-County trout stream in NE Indiana. This one\'s in the heart of Pigeon River Country State Forest.',
  },
  {
    id: 'mi-river-black-cheboygan',
    name: 'Black River (Cheboygan)',
    state: 'MI',
    region: 'NLP wild-trout rivers',
    type: 'river',
    county: 'Cheboygan / Montmorency',
    river: 'Black River',
    signatureSpecies: 'Brown trout, brook trout',
    species: [
      { name: 'Brown trout', importance: 'signature', size: '10-16 in' },
      { name: 'Brook trout', importance: 'strong' },
      { name: 'Rainbow trout', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Wild-trout wading',
        target: 'Brown + brook trout',
        when: 'May-October',
        technique: 'Dry-fly + nymphs',
        where: 'Through Pigeon River Country',
      },
    ],
    access: ['Pigeon River Country roads', 'Tower Bridge'],
    notes: 'Pigeon-Country sister stream. Tannic-stained water.',
  },
  {
    id: 'mi-river-thunder-bay',
    name: 'Thunder Bay River',
    state: 'MI',
    region: 'NE Lower Peninsula',
    type: 'great-lake-trib',
    county: 'Alpena',
    river: 'Thunder Bay River',
    signatureSpecies: 'Walleye, steelhead, brown trout',
    species: [
      { name: 'Walleye', importance: 'signature', size: '14-22 in', notes: 'Spring run from Lake Huron.' },
      { name: 'Steelhead', importance: 'strong', size: '6-12 lb', notes: 'Lake Huron strain.' },
      { name: 'Brown trout', importance: 'good', size: '10-16 in' },
      { name: 'Smallmouth bass', importance: 'good' },
      { name: 'Northern pike', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Spring walleye + steelhead at 9th Street Dam',
        target: 'Walleye, steelhead',
        when: 'March-May',
        technique: 'Jig + minnow for walleye; float-rig + spawn sacs for steelhead',
        where: '9th Street Dam (Alpena) tailwater',
      },
    ],
    access: ['9th Street Dam', 'Alpena', 'Hubbard Lake outlet'],
    notes: 'NE LP\'s main Lake Huron trib. Drains Hubbard Lake. Less crowded than Lake Michigan tribs.',
  },
  {
    id: 'mi-river-augres',
    name: 'AuGres River',
    state: 'MI',
    region: 'NE Lower Peninsula',
    type: 'great-lake-trib',
    county: 'Iosco / Arenac',
    river: 'AuGres River',
    signatureSpecies: 'Steelhead, walleye, brown trout',
    species: [
      { name: 'Steelhead', importance: 'signature', size: '6-12 lb' },
      { name: 'Brown trout', importance: 'strong', size: '10-16 in' },
      { name: 'Walleye', importance: 'good', size: 'Lower river spring run.' },
      { name: 'Smallmouth bass', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Lake Huron strain steelhead',
        target: 'Steelhead',
        when: 'October-April',
        technique: 'Float-rig with spawn sacs + yarn flies',
        where: 'East + West Branch confluence + below',
      },
    ],
    access: ['Whittemore', 'East Branch', 'West Branch'],
    notes: 'Lake Huron strain steelhead trib. Less famous than Manistee/PM but quality fishery.',
  },
  {
    id: 'mi-river-cheboygan',
    name: 'Cheboygan River',
    state: 'MI',
    region: 'NE Lower Peninsula',
    type: 'great-lake-trib',
    county: 'Cheboygan',
    river: 'Cheboygan River',
    signatureSpecies: 'Walleye, smallmouth bass, muskie, pike',
    species: [
      { name: 'Walleye', importance: 'strong', size: '14-22 in' },
      { name: 'Smallmouth bass', importance: 'strong', size: '2-4 lb' },
      { name: 'Muskellunge', importance: 'good', size: '36-44 in', notes: 'Connected to Mullett + Burt Inland Waterway muskies.' },
      { name: 'Northern pike', importance: 'strong' },
      { name: 'Brown trout', importance: 'good', notes: 'Below the Cheboygan Lock.' },
    ],
    patterns: [
      {
        title: 'Spring walleye below the lock',
        target: 'Walleye',
        when: 'April-May',
        technique: 'Jig + minnow',
        where: 'Below the Cheboygan Lock; the Inland Waterway outlet',
      },
    ],
    access: ['Cheboygan State Park', 'Cheboygan Lock'],
    notes: 'Connects the Inland Waterway (Mullett/Burt/Crooked) to Lake Huron. Outflow channel for one of the great inland-lake systems in MI.',
  },
  {
    id: 'mi-river-manistee-hodenpyl',
    name: 'Manistee River — Hodenpyl to Tippy',
    state: 'MI',
    region: 'NLP wild-trout rivers',
    type: 'tailwater',
    county: 'Wexford / Manistee',
    river: 'Manistee River',
    signatureSpecies: 'Brown trout, rainbow trout, smallmouth bass',
    species: [
      { name: 'Brown trout', importance: 'signature', size: '12-20 in, 25+ possible', notes: 'Trophy class — the Hodenpyl-to-Tippy stretch holds the biggest wild MI browns outside of the lower Manistee salmon zone.' },
      { name: 'Rainbow trout', importance: 'strong', size: '10-16 in' },
      { name: 'Smallmouth bass', importance: 'good', size: 'Lower portion as water warms' },
    ],
    patterns: [
      {
        title: 'Streamer-fishing trophy browns',
        target: 'Brown trout',
        when: 'April-November',
        technique: 'Articulated streamers (Galloup Sex Dungeon, Mini D&D, Lynch Triple D)',
        where: 'Banks + log jams; deep current seams',
        details: 'The Hodenpyl-to-Tippy section is the trophy-brown gem of the Manistee that doesn\'t see salmon crowds. Float in drift boat.',
      },
      {
        title: 'Hex hatch night fishing',
        target: 'Brown trout',
        when: 'Late June through mid-July',
        technique: 'Size 6 Hex dries',
        where: 'Silt-bottom slow stretches',
      },
    ],
    access: ['Hodenpyl Dam', 'Yellow Trees', 'Pine Creek', 'Tippy Pond head'],
    regulations: 'Wild trout management; gear restrictions in select stretches.',
    notes: 'The "in-between" stretch of the Manistee — wild-trout water that\'s neither the Upper (Cameron Bridge stretch) nor the salmon-zone Lower (Tippy + below). Trophy quality.',
  },
  {
    id: 'mi-river-bear',
    name: 'Bear River',
    state: 'MI',
    region: 'NLP wild-trout rivers',
    type: 'great-lake-trib',
    county: 'Emmet',
    river: 'Bear River',
    signatureSpecies: 'Brown trout, steelhead',
    species: [
      { name: 'Brown trout', importance: 'strong', size: '10-16 in' },
      { name: 'Steelhead', importance: 'strong', size: '6-12 lb', notes: 'Petoskey-area run.' },
      { name: 'Brook trout', importance: 'good', notes: 'Headwaters.' },
    ],
    patterns: [
      {
        title: 'Steelhead through Petoskey',
        target: 'Steelhead',
        when: 'October-April',
        technique: 'Float-rig + small streamers',
        where: 'Through downtown Petoskey to Little Traverse Bay',
      },
    ],
    access: ['Bear River Greenway (Petoskey)', 'Mouth at Little Traverse Bay'],
    notes: 'Urban steelhead — flows through downtown Petoskey to Little Traverse Bay.',
  },
  {
    id: 'mi-river-crystal',
    name: 'Crystal River (Glen Arbor)',
    state: 'MI',
    region: 'NLP wild-trout rivers',
    type: 'river',
    county: 'Leelanau',
    river: 'Crystal River',
    signatureSpecies: 'Brook trout',
    species: [
      { name: 'Brook trout', importance: 'signature', size: '7-10 in', notes: 'Tiny pristine stream — sight-fishing for wild brookies.' },
    ],
    patterns: [
      {
        title: 'Sight-fish small brookies',
        target: 'Brook trout',
        when: 'May-September',
        technique: 'Small dries (#16-18 Adams, Royal Wulff)',
        where: 'Throughout — short casts, stealth',
      },
    ],
    access: ['Glen Arbor', 'Sleeping Bear Dunes National Lakeshore'],
    notes: 'Inside Sleeping Bear Dunes National Lakeshore. Drains Glen Lake to Lake Michigan.',
  },
  {
    id: 'mi-river-pine-manistee-trib',
    name: 'Pine River (Manistee tributary)',
    state: 'MI',
    region: 'NLP wild-trout rivers',
    type: 'river',
    county: 'Wexford / Manistee',
    river: 'Pine River',
    signatureSpecies: 'Brown trout, rainbow trout',
    species: [
      { name: 'Brown trout', importance: 'signature', size: '10-16 in' },
      { name: 'Rainbow trout', importance: 'strong', size: '10-14 in' },
      { name: 'Brook trout', importance: 'good' },
    ],
    patterns: [
      {
        title: 'Pine River wild-trout wading',
        target: 'Brown + rainbow trout',
        when: 'May-October',
        technique: 'Dry-fly + small streamers',
        where: 'Throughout',
        details: 'Designated Wild + Scenic River. Excellent paddling water.',
      },
    ],
    access: ['Edgetts Bridge', 'Lincoln Bridge', 'Peterson Bridge'],
    regulations: 'Wild + Scenic designation. Gear restrictions on stretches.',
    notes: 'Designated MI Wild + Scenic River. Joins the Big Manistee at Tippy Pond.',
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
