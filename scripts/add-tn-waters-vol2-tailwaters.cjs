// TN Vol 2 — TVA + USACE tailwater coldwater fisheries across Tennessee.
// (Most marquee tailwaters already exist — South Holston river, Watauga river, Clinch,
//  Caney Fork, Hiwassee river are in. Filling in the chain.)

const fs = require('fs');
const path = require('path');
const { buildTN } = require('./_tn-water-template.cjs');

const DATA_PATH = path.join(__dirname, '..', 'data', 'waterbodies.json');

const RAW = [
  { id: 'tn-tailwater-norris', name: 'Norris Tailwater (Clinch below Norris Dam)', county: 'Anderson', acres: null, maxDepthFt: null, lat: 36.215, lng: -84.090, cat: 'tva-tailwater', region: 'East TN', notes: 'Clinch River below Norris Dam — already partly captured in tn-river-clinch but this entry preserves the tailwater designation specifically. World-class trout fishery.' },
  { id: 'tn-tailwater-cherokee', name: 'Cherokee Tailwater (Holston below Cherokee Dam)', county: 'Jefferson', acres: null, maxDepthFt: null, lat: 36.165, lng: -83.500, cat: 'tva-tailwater', region: 'East TN', notes: 'Holston River below Cherokee Dam — quality trout tailwater, less pressure than Clinch.' },
  { id: 'tn-tailwater-douglas', name: 'Douglas Tailwater (French Broad below Douglas Dam)', county: 'Sevier', acres: null, maxDepthFt: null, lat: 35.965, lng: -83.535, cat: 'tva-tailwater', region: 'East TN', notes: 'French Broad below Douglas Dam — stocked trout, deeper water than typical tailwater.' },
  { id: 'tn-tailwater-fort-loudoun', name: 'Fort Loudoun Tailwater', county: 'Knox', acres: null, maxDepthFt: null, lat: 35.795, lng: -84.250, cat: 'tva-tailwater', region: 'East TN' },
  { id: 'tn-tailwater-tellico', name: 'Tellico Tailwater (Little T below Tellico Dam)', county: 'Loudon', acres: null, maxDepthFt: null, lat: 35.730, lng: -84.255, cat: 'tva-tailwater', region: 'East TN' },
  { id: 'tn-tailwater-watts-bar', name: 'Watts Bar Tailwater', county: 'Rhea', acres: null, maxDepthFt: null, lat: 35.628, lng: -84.778, cat: 'tva-tailwater', region: 'East TN' },
  { id: 'tn-tailwater-chickamauga', name: 'Chickamauga Tailwater', county: 'Hamilton', acres: null, maxDepthFt: null, lat: 35.087, lng: -85.225, cat: 'tva-tailwater', region: 'East TN', notes: 'Below Chickamauga Dam — striper + sauger more than trout; cold-water tailrace fishery.' },
  { id: 'tn-tailwater-nickajack', name: 'Nickajack Tailwater', county: 'Marion', acres: null, maxDepthFt: null, lat: 35.005, lng: -85.620, cat: 'tva-tailwater', region: 'Southeast TN' },
  { id: 'tn-tailwater-apalachia', name: 'Apalachia Tailwater (Hiwassee Powerhouse)', county: 'Polk', acres: null, maxDepthFt: null, lat: 35.225, lng: -84.490, cat: 'tva-tailwater', region: 'East TN', notes: 'Apalachia powerhouse discharge — famous Hiwassee tailwater section. Sulphur and BWO hatches, technical trout.' },
  { id: 'tn-tailwater-ocoee', name: 'Ocoee Tailwater (Below Powerhouses)', county: 'Polk', acres: null, maxDepthFt: null, lat: 35.085, lng: -84.520, cat: 'tva-tailwater', region: 'Southeast TN' },
  { id: 'tn-tailwater-blue-ridge', name: 'Blue Ridge Tailwater (Toccoa below Blue Ridge Dam)', county: 'Polk', acres: null, maxDepthFt: null, lat: 34.880, lng: -84.290, cat: 'tva-tailwater', region: 'Southeast TN' },
  { id: 'tn-tailwater-tims-ford', name: 'Tims Ford Tailwater (Elk River)', county: 'Franklin', acres: null, maxDepthFt: null, lat: 35.250, lng: -86.250, cat: 'tva-tailwater', region: 'Middle TN', notes: 'Elk River below Tims Ford Dam — already in tn-river-elk; preserved here as tailwater. Hot late-spring sulphur hatch.' },
  { id: 'tn-tailwater-wilbur', name: 'Wilbur Tailwater (Watauga below Wilbur Dam)', county: 'Carter', acres: null, maxDepthFt: null, lat: 36.343, lng: -82.075, cat: 'tva-tailwater', region: 'East TN', notes: 'Wilbur Dam is the lower of two on the Watauga — true cold release. Famous trophy brown trout water.' },
  { id: 'tn-tailwater-fort-patrick-henry', name: 'Fort Patrick Henry Tailwater (South Fork Holston)', county: 'Sullivan', acres: null, maxDepthFt: null, lat: 36.532, lng: -82.460, cat: 'tva-tailwater', region: 'East TN' },
  { id: 'tn-tailwater-boone', name: 'Boone Tailwater (South Fork Holston)', county: 'Sullivan / Washington', acres: null, maxDepthFt: null, lat: 36.430, lng: -82.420, cat: 'tva-tailwater', region: 'East TN' },
  { id: 'tn-tailwater-center-hill', name: 'Center Hill Tailwater (Caney Fork below Center Hill Dam)', county: 'DeKalb', acres: null, maxDepthFt: null, lat: 36.103, lng: -85.830, cat: 'tva-tailwater', region: 'Middle TN', notes: 'Caney Fork below Center Hill Dam — already in tn-river-caney-fork; preserved here. The marquee middle-TN tailwater.' },
  { id: 'tn-tailwater-old-hickory', name: 'Old Hickory Tailwater (Cumberland below Old Hickory Dam)', county: 'Davidson', acres: null, maxDepthFt: null, lat: 36.295, lng: -86.660, cat: 'tva-tailwater', region: 'Middle TN', notes: 'Cumberland River below Old Hickory Dam — striped bass + sauger tailwater more than trout.' },
  { id: 'tn-tailwater-cordell-hull', name: 'Cordell Hull Tailwater', county: 'Smith', acres: null, maxDepthFt: null, lat: 36.295, lng: -85.945, cat: 'tva-tailwater', region: 'Middle TN' },
  { id: 'tn-tailwater-cheatham', name: 'Cheatham Tailwater (Cumberland below Cheatham Dam)', county: 'Cheatham', acres: null, maxDepthFt: null, lat: 36.318, lng: -87.030, cat: 'tva-tailwater', region: 'Middle TN' },
  { id: 'tn-tailwater-percy-priest', name: 'Percy Priest Tailwater (Stones River)', county: 'Davidson', acres: null, maxDepthFt: null, lat: 36.155, lng: -86.620, cat: 'tva-tailwater', region: 'Middle TN' },
  { id: 'tn-tailwater-pickwick', name: 'Pickwick Tailwater (Tennessee below Pickwick Dam)', county: 'Hardin', acres: null, maxDepthFt: null, lat: 35.080, lng: -88.255, cat: 'tva-tailwater', region: 'West TN', notes: 'Pickwick tailrace — striper + sauger; NOT a trout fishery despite the tailwater designation. Fishing character is warmwater.' },
  { id: 'tn-tailwater-dale-hollow', name: 'Dale Hollow Tailwater (Obey River)', county: 'Clay', acres: null, maxDepthFt: null, lat: 36.530, lng: -85.450, cat: 'tva-tailwater', region: 'Middle TN', notes: 'Obey River below Dale Hollow Dam — quality wild brown trout + stocked rainbow. The "Dale Hollow Tailwater" is famous among TN fly anglers.' },
  { id: 'tn-tailwater-melton-hill', name: 'Melton Hill Tailwater', county: 'Loudon', acres: null, maxDepthFt: null, lat: 35.875, lng: -84.225, cat: 'tva-tailwater', region: 'East TN' },
  { id: 'tn-tailwater-kentucky', name: 'Kentucky Tailwater (Tennessee below Kentucky Dam)', county: 'Stewart', acres: null, maxDepthFt: null, lat: 37.013, lng: -88.260, cat: 'tva-tailwater', region: 'West TN' },
  { id: 'tn-tailwater-wolf-creek-byrd', name: 'Wolf Creek Tailwater (Cumberland — KY/TN border)', county: 'Pickett', acres: null, maxDepthFt: null, lat: 36.560, lng: -85.150, cat: 'tva-tailwater', region: 'Middle TN', notes: 'Cumberland River below Wolf Creek Dam (KY) flows into TN — internationally famous brown trout tailwater. Crosses TN border at Pickett County.' },

  // ============== TVA LAKES NOT YET CAPTURED ==============
  { id: 'tn-lake-melton-hill', name: 'Melton Hill Lake', county: 'Anderson / Loudon / Knox', acres: 5690, maxDepthFt: 90, lat: 35.875, lng: -84.220, cat: 'tva-reservoir', region: 'East TN', notes: 'Melton Hill Lake — narrow mid-TN River impoundment between Fort Loudoun and Watts Bar. Notable smallmouth fishery with cooler water than typical TVA reservoirs.' },
  { id: 'tn-lake-parksville', name: 'Parksville Lake (Ocoee #1)', county: 'Polk', acres: 1930, maxDepthFt: 100, lat: 35.075, lng: -84.560, cat: 'tva-reservoir', region: 'Southeast TN', notes: 'Parksville Lake — Ocoee #1 reservoir. Cherokee NF setting; striper + spotted bass.' },
  { id: 'tn-lake-ocoee-2', name: 'Ocoee #2 Lake', county: 'Polk', acres: 30, maxDepthFt: 25, lat: 35.087, lng: -84.518, cat: 'tva-reservoir', region: 'Southeast TN' },
  { id: 'tn-lake-ocoee-3', name: 'Ocoee #3 Lake', county: 'Polk', acres: 600, maxDepthFt: 90, lat: 35.110, lng: -84.430, cat: 'tva-reservoir', region: 'Southeast TN' },
  { id: 'tn-lake-blue-ridge-tn', name: 'Blue Ridge Lake (Toccoa Headwaters TN side)', county: 'Polk', acres: null, maxDepthFt: null, lat: 34.880, lng: -84.290, cat: 'tva-reservoir', region: 'Southeast TN' },
  { id: 'tn-lake-fort-patrick-henry', name: 'Fort Patrick Henry Lake', county: 'Sullivan', acres: 872, maxDepthFt: 70, lat: 36.520, lng: -82.460, cat: 'tva-reservoir', region: 'East TN' },
  { id: 'tn-lake-wilbur', name: 'Wilbur Lake', county: 'Carter', acres: 72, maxDepthFt: 35, lat: 36.342, lng: -82.075, cat: 'tva-reservoir', region: 'East TN', notes: 'Wilbur Lake — tiny tailrace pool below Watauga Dam. Stocked trout.' },
  { id: 'tn-lake-apalachia', name: 'Apalachia Lake', county: 'Cherokee (NC) / Polk (TN)', acres: 1100, maxDepthFt: 100, lat: 35.155, lng: -84.130, cat: 'tva-reservoir', region: 'Southeast TN' },
  { id: 'tn-lake-chilhowee', name: 'Chilhowee Lake', county: 'Blount', acres: 1750, maxDepthFt: 90, lat: 35.520, lng: -84.030, cat: 'tva-reservoir', region: 'East TN', notes: 'Chilhowee Lake — small Little Tennessee River impoundment, Smokies foothills. Smallmouth + walleye + spotted bass.' },
  { id: 'tn-lake-calderwood', name: 'Calderwood Lake', county: 'Blount', acres: 540, maxDepthFt: 130, lat: 35.475, lng: -83.945, cat: 'tva-reservoir', region: 'East TN' },
  { id: 'tn-lake-cheoah', name: 'Cheoah Lake', county: 'Blount / Graham (NC)', acres: 595, maxDepthFt: 220, lat: 35.443, lng: -83.940, cat: 'tva-reservoir', region: 'East TN' },
  { id: 'tn-lake-fontana-tn', name: 'Fontana Lake (TN Side)', county: 'Sevier / Cocke', acres: null, maxDepthFt: null, lat: 35.450, lng: -83.770, cat: 'tva-reservoir', region: 'East TN', notes: 'Mostly NC lake but TN portion provides fishery access.' },
];

function main() {
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  const existing = JSON.parse(raw);
  const byId = new Map(existing.map((e) => [e.id, e]));

  let appended = 0, skipped = 0;
  for (const item of RAW) {
    if (byId.has(item.id)) { skipped++; continue; }
    const entry = buildTN({
      id: item.id, name: item.name, region: item.region,
      county: item.county, acres: item.acres, maxDepthFt: item.maxDepthFt,
      lat: item.lat, lng: item.lng, cat: item.cat, notes: item.notes,
    });
    existing.push(entry);
    byId.set(item.id, entry);
    appended++;
  }

  fs.writeFileSync(DATA_PATH, JSON.stringify(existing, null, 2) + '\n', 'utf8');
  const tnTotal = existing.filter((e) => e.state === 'TN').length;
  console.log(`Appended ${appended}, skipped ${skipped}. TN total: ${tnTotal}, Grand total: ${existing.length}`);
}

main();
