// NC Vol 2 — NC mountain trout streams + tailwaters.
// Pisgah NF + Nantahala NF + GSMNP NC side + private blue-ribbon waters.

const fs = require('fs');
const path = require('path');
const { buildNC } = require('./_nc-water-template.cjs');

const DATA_PATH = path.join(__dirname, '..', 'data', 'waterbodies.json');

const RAW = [
  // ============== MARQUEE WILD TROUT STREAMS ==============
  { id: 'nc-stream-davidson-river', name: 'Davidson River', region: 'NC Mountains', county: 'Transylvania', lat: 35.290, lng: -82.770, cat: 'nc-mountain-trout-stream', notes: 'Davidson River — Pisgah National Forest. Premier southern Appalachian wild trout fishery. Catch-and-release Hatchery Supported + Wild Trout sections. Trophy holdover browns + reproducing rainbows. Famously technical.' },
  { id: 'nc-stream-wilson-creek', name: 'Wilson Creek', region: 'NC Mountains', county: 'Caldwell / Avery', lat: 35.940, lng: -81.815, cat: 'nc-mountain-trout-stream', notes: 'Wilson Creek — Wild + Scenic National River. Pisgah NF; wild rainbow, brown, and brook trout.' },
  { id: 'nc-stream-south-toe-river', name: 'South Toe River', region: 'NC Mountains', county: 'Yancey', lat: 35.835, lng: -82.150, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-north-toe-river', name: 'North Toe River', region: 'NC Mountains', county: 'Yancey / Mitchell', lat: 35.985, lng: -82.020, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-cane-river', name: 'Cane River', region: 'NC Mountains', county: 'Yancey', lat: 35.890, lng: -82.295, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-big-snowbird', name: 'Big Snowbird Creek', region: 'NC Mountains', county: 'Graham', lat: 35.315, lng: -83.785, cat: 'nc-mountain-trout-stream', notes: 'Big Snowbird Creek — Nantahala NF. Native brook trout in upper reaches; wild rainbows below. Remote wilderness fishery.' },
  { id: 'nc-stream-slickrock-creek', name: 'Slickrock Creek (NC/TN)', region: 'NC Mountains', county: 'Graham', lat: 35.435, lng: -83.975, cat: 'nc-mountain-trout-stream', notes: 'Slickrock Creek — Joyce Kilmer-Slickrock Wilderness. Wild brown trout, technical pocket water.' },
  { id: 'nc-stream-santeetlah-creek', name: 'Santeetlah Creek', region: 'NC Mountains', county: 'Graham', lat: 35.395, lng: -83.875, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-nantahala-river-upper', name: 'Nantahala River — Upper (Above Lake)', region: 'NC Mountains', county: 'Macon', lat: 35.155, lng: -83.620, cat: 'nc-mountain-trout-stream', notes: 'Upper Nantahala — wild trout above Nantahala Lake. Less-pressured than the famous lower whitewater section.' },
  { id: 'nc-stream-nantahala-river-lower', name: 'Nantahala River — Lower (Delayed Harvest)', region: 'NC Mountains', county: 'Swain / Macon', lat: 35.300, lng: -83.665, cat: 'nc-mountain-tailwater', notes: 'Lower Nantahala — Delayed Harvest section. Stocked rainbow, brown, brook. Whitewater rafting river — fish before/after rafting hours.' },
  { id: 'nc-stream-tellico-river-nc', name: 'Tellico River (NC headwaters)', region: 'NC Mountains', county: 'Cherokee', lat: 35.215, lng: -84.020, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-hiwassee-tailwater-nc', name: 'Hiwassee Tailwater (NC)', region: 'NC Mountains', county: 'Cherokee', lat: 35.205, lng: -84.060, cat: 'nc-mountain-tailwater' },
  { id: 'nc-stream-french-broad-upper-nc', name: 'French Broad River — Upper NC (Asheville)', region: 'NC Mountains', county: 'Buncombe / Henderson', lat: 35.610, lng: -82.555, cat: 'nc-mountain-trout-stream', notes: 'Upper French Broad — wild smallmouth + stocked trout sections. Float-friendly.' },
  { id: 'nc-stream-french-broad-section-hot-springs', name: 'French Broad — Hot Springs (Pisgah NF)', region: 'NC Mountains', county: 'Madison', lat: 35.890, lng: -82.825, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-mills-river', name: 'Mills River', region: 'NC Mountains', county: 'Henderson', lat: 35.355, lng: -82.575, cat: 'nc-mountain-trout-stream', notes: 'Mills River — Pisgah NF tributary. Wild trout + Delayed Harvest section.' },
  { id: 'nc-stream-east-fork-french-broad', name: 'East Fork French Broad', region: 'NC Mountains', county: 'Transylvania', lat: 35.240, lng: -82.875, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-west-fork-french-broad', name: 'West Fork French Broad', region: 'NC Mountains', county: 'Transylvania', lat: 35.220, lng: -82.870, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-north-fork-french-broad', name: 'North Fork French Broad', region: 'NC Mountains', county: 'Transylvania', lat: 35.290, lng: -82.870, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-south-mills-river', name: 'South Mills River', region: 'NC Mountains', county: 'Henderson', lat: 35.330, lng: -82.620, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-pigeon-river-nc', name: 'Pigeon River (NC headwaters)', region: 'NC Mountains', county: 'Haywood', lat: 35.530, lng: -82.945, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-cataloochee-creek-nc', name: 'Cataloochee Creek (GSMNP NC side)', region: 'NC Mountains', county: 'Haywood', lat: 35.625, lng: -83.080, cat: 'nc-mountain-trout-stream', notes: 'Cataloochee Creek — GSMNP NC side. Wild rainbow + brown trout. Less-pressured than TN-side streams.' },
  { id: 'nc-stream-deep-creek-gsmnp-nc', name: 'Deep Creek (GSMNP NC side)', region: 'NC Mountains', county: 'Swain', lat: 35.460, lng: -83.470, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-noland-creek-nc', name: 'Noland Creek (GSMNP NC side)', region: 'NC Mountains', county: 'Swain', lat: 35.460, lng: -83.620, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-hazel-creek-nc', name: 'Hazel Creek (GSMNP NC side)', region: 'NC Mountains', county: 'Swain', lat: 35.475, lng: -83.715, cat: 'nc-mountain-trout-stream', notes: 'Hazel Creek — legendary GSMNP NC-side wild brown trout stream. Backcountry access via boat from Fontana.' },
  { id: 'nc-stream-eagle-creek-nc', name: 'Eagle Creek (GSMNP NC side)', region: 'NC Mountains', county: 'Swain', lat: 35.490, lng: -83.835, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-forney-creek-nc', name: 'Forney Creek (GSMNP NC side)', region: 'NC Mountains', county: 'Swain', lat: 35.475, lng: -83.540, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-bone-valley-creek-nc', name: 'Bone Valley Creek (GSMNP NC side)', region: 'NC Mountains', county: 'Swain', lat: 35.490, lng: -83.870, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-twentymile-creek-nc', name: 'Twentymile Creek (GSMNP NC side)', region: 'NC Mountains', county: 'Swain', lat: 35.470, lng: -83.880, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-raven-fork', name: 'Raven Fork (Cherokee)', region: 'NC Mountains', county: 'Swain', lat: 35.555, lng: -83.290, cat: 'nc-mountain-trout-stream', notes: 'Raven Fork — Cherokee Reservation trophy section. Trophy holdover brown trout in C&R area. Special tribal permits required.' },
  { id: 'nc-stream-oconaluftee', name: 'Oconaluftee River', region: 'NC Mountains', county: 'Swain', lat: 35.510, lng: -83.355, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-bradley-fork-nc', name: 'Bradley Fork (NC)', region: 'NC Mountains', county: 'Swain', lat: 35.555, lng: -83.355, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-straight-fork-nc', name: 'Straight Fork', region: 'NC Mountains', county: 'Swain', lat: 35.560, lng: -83.232, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-watauga-river-nc', name: 'Watauga River (NC headwaters)', region: 'NC Mountains', county: 'Watauga', lat: 36.180, lng: -81.760, cat: 'nc-mountain-trout-stream', notes: 'Watauga River — NC headwaters above Watauga Lake. Wild trout + stocked sections.' },
  { id: 'nc-stream-elk-river-nc', name: 'Elk River (NC)', region: 'NC Mountains', county: 'Avery', lat: 36.190, lng: -81.900, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-linville-river', name: 'Linville River', region: 'NC Mountains', county: 'Avery / Burke', lat: 35.965, lng: -81.880, cat: 'nc-mountain-trout-stream', notes: 'Linville River — Linville Gorge Wilderness. Wild trout in deep gorge — technical access.' },
  { id: 'nc-stream-johns-river', name: 'Johns River', region: 'NC Mountains', county: 'Burke / Caldwell', lat: 35.910, lng: -81.665, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-globe-creek', name: 'Globe Creek', region: 'NC Mountains', county: 'Caldwell', lat: 35.920, lng: -81.790, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-thorpe-creek', name: 'Thorpe Creek', region: 'NC Mountains', county: 'Jackson', lat: 35.180, lng: -83.150, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-tuckaseegee-river', name: 'Tuckasegee River', region: 'NC Mountains', county: 'Jackson / Swain', lat: 35.450, lng: -83.380, cat: 'nc-mountain-tailwater', notes: 'Tuckasegee River — Delayed Harvest sections + wild trout. Stocked rainbow, brown, brook in cool months.' },
  { id: 'nc-stream-tuckaseegee-east-fork', name: 'East Fork Tuckasegee', region: 'NC Mountains', county: 'Jackson', lat: 35.155, lng: -83.060, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-tuckaseegee-west-fork', name: 'West Fork Tuckasegee', region: 'NC Mountains', county: 'Jackson', lat: 35.230, lng: -83.155, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-jonathan-creek-nc', name: 'Jonathan Creek', region: 'NC Mountains', county: 'Haywood', lat: 35.550, lng: -82.985, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-richland-creek-nc', name: 'Richland Creek (Haywood)', region: 'NC Mountains', county: 'Haywood', lat: 35.500, lng: -82.985, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-east-fork-pigeon-river', name: 'East Fork Pigeon River', region: 'NC Mountains', county: 'Haywood', lat: 35.430, lng: -82.890, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-west-fork-pigeon-river', name: 'West Fork Pigeon River', region: 'NC Mountains', county: 'Haywood', lat: 35.380, lng: -82.945, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-shining-creek', name: 'Shining Creek', region: 'NC Mountains', county: 'Haywood', lat: 35.450, lng: -82.840, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-big-creek-nc', name: 'Big Creek (NC headwaters)', region: 'NC Mountains', county: 'Haywood', lat: 35.755, lng: -83.110, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-roaring-fork-nc', name: 'Roaring Fork (NC)', region: 'NC Mountains', county: 'Madison', lat: 35.820, lng: -82.700, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-spring-creek-nc', name: 'Spring Creek (Madison)', region: 'NC Mountains', county: 'Madison', lat: 35.890, lng: -82.830, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-shelton-laurel-creek', name: 'Shelton Laurel Creek', region: 'NC Mountains', county: 'Madison', lat: 35.890, lng: -82.690, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-laurel-fork-madison', name: 'Laurel Fork (Madison)', region: 'NC Mountains', county: 'Madison', lat: 35.985, lng: -82.700, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-big-laurel-creek', name: 'Big Laurel Creek', region: 'NC Mountains', county: 'Madison', lat: 35.880, lng: -82.700, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-walker-creek', name: 'Walker Creek', region: 'NC Mountains', county: 'Madison', lat: 35.870, lng: -82.880, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-cullasaja-river', name: 'Cullasaja River', region: 'NC Mountains', county: 'Macon', lat: 35.155, lng: -83.290, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-cartoogechaye-creek', name: 'Cartoogechaye Creek', region: 'NC Mountains', county: 'Macon', lat: 35.155, lng: -83.435, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-allarka-creek', name: 'Allarka Creek', region: 'NC Mountains', county: 'Swain', lat: 35.420, lng: -83.575, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-licklog-creek', name: 'Licklog Creek', region: 'NC Mountains', county: 'Macon', lat: 35.080, lng: -83.555, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-buck-creek-nc', name: 'Buck Creek (NC)', region: 'NC Mountains', county: 'Macon', lat: 35.090, lng: -83.450, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-rocky-fork-nc', name: 'Rocky Fork (NC)', region: 'NC Mountains', county: 'Madison', lat: 36.045, lng: -82.490, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-curtis-creek', name: 'Curtis Creek', region: 'NC Mountains', county: 'McDowell', lat: 35.730, lng: -82.165, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-armstrong-creek', name: 'Armstrong Creek', region: 'NC Mountains', county: 'McDowell', lat: 35.780, lng: -82.170, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-mitchell-river', name: 'Mitchell River', region: 'NC Foothills', county: 'Surry', lat: 36.420, lng: -80.890, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-fisher-river', name: 'Fisher River', region: 'NC Foothills', county: 'Surry', lat: 36.430, lng: -80.820, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-yadkin-river-headwaters', name: 'Yadkin River — Headwaters', region: 'NC Foothills', county: 'Caldwell / Watauga', lat: 36.080, lng: -81.495, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-doe-river-nc-side', name: 'Doe River (NC side)', region: 'NC Mountains', county: 'Avery', lat: 36.150, lng: -82.020, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-horsepasture-river', name: 'Horsepasture River', region: 'NC Mountains', county: 'Transylvania', lat: 35.075, lng: -82.945, cat: 'nc-mountain-trout-stream', notes: 'Horsepasture River — National Wild & Scenic. Wild trout in cascading falls country.' },
  { id: 'nc-stream-thompson-river', name: 'Thompson River', region: 'NC Mountains', county: 'Transylvania', lat: 35.050, lng: -82.920, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-chattooga-river-nc', name: 'Chattooga River (NC headwaters)', region: 'NC Mountains', county: 'Macon / Jackson', lat: 35.020, lng: -83.075, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-stecoah-creek', name: 'Stecoah Creek', region: 'NC Mountains', county: 'Graham', lat: 35.350, lng: -83.715, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-fontana-tribs-deep', name: 'Deep Creek (Fontana Trib)', region: 'NC Mountains', county: 'Swain', lat: 35.470, lng: -83.460, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-fontana-tribs-pinhook', name: 'Pinhook Branch', region: 'NC Mountains', county: 'Swain', lat: 35.435, lng: -83.595, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-fontana-tribs-chambers', name: 'Chambers Creek', region: 'NC Mountains', county: 'Swain', lat: 35.450, lng: -83.580, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-vance-creek', name: 'Vance Creek', region: 'NC Mountains', county: 'Madison', lat: 35.950, lng: -82.580, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-davidson-tributaries-looking-glass', name: 'Looking Glass Creek', region: 'NC Mountains', county: 'Transylvania', lat: 35.295, lng: -82.785, cat: 'nc-mountain-trout-stream', notes: 'Looking Glass Creek — Pisgah NF Davidson tributary. Wild rainbow + brook trout in plunge pools.' },
  { id: 'nc-stream-yellowstone-prong', name: 'Yellowstone Prong', region: 'NC Mountains', county: 'Haywood', lat: 35.415, lng: -82.835, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-graveyard-fields-streams', name: 'Graveyard Fields Streams (Blue Ridge Pkwy)', region: 'NC Mountains', county: 'Haywood', lat: 35.330, lng: -82.840, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-flat-laurel-creek', name: 'Flat Laurel Creek', region: 'NC Mountains', county: 'Haywood', lat: 35.345, lng: -82.870, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-bigflat-creek', name: 'Big Flat Creek', region: 'NC Mountains', county: 'Haywood', lat: 35.355, lng: -82.910, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-hominy-creek', name: 'Hominy Creek', region: 'NC Mountains', county: 'Buncombe', lat: 35.540, lng: -82.660, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-swannanoa-river', name: 'Swannanoa River', region: 'NC Mountains', county: 'Buncombe', lat: 35.580, lng: -82.500, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-warrior-mountain-stream', name: 'Warrior Mountain Trib', region: 'NC Mountains', county: 'Buncombe', lat: 35.510, lng: -82.420, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-bent-creek', name: 'Bent Creek', region: 'NC Mountains', county: 'Buncombe', lat: 35.495, lng: -82.620, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-cane-creek-buncombe', name: 'Cane Creek (Buncombe)', region: 'NC Mountains', county: 'Buncombe', lat: 35.485, lng: -82.380, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-flat-creek-haywood', name: 'Flat Creek (Haywood)', region: 'NC Mountains', county: 'Haywood', lat: 35.520, lng: -82.880, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-rough-creek-nc', name: 'Rough Creek (NC)', region: 'NC Mountains', county: 'Madison', lat: 35.870, lng: -82.660, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-pisgah-tribs-bradley', name: 'Bradley Creek (Pisgah)', region: 'NC Mountains', county: 'Henderson', lat: 35.325, lng: -82.575, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-pisgah-tribs-laurel-fork', name: 'Laurel Fork (Pisgah NF)', region: 'NC Mountains', county: 'Henderson', lat: 35.330, lng: -82.510, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-mountain-island-tribs-fork', name: 'North Fork Catawba (Trib above James)', region: 'NC Mountains', county: 'McDowell', lat: 35.890, lng: -82.030, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-south-fork-catawba-nc', name: 'South Fork Catawba (Trib above James)', region: 'NC Mountains', county: 'McDowell', lat: 35.880, lng: -82.170, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-paint-fork', name: 'Paint Fork', region: 'NC Mountains', county: 'Madison', lat: 35.815, lng: -82.625, cat: 'nc-mountain-trout-stream' },
  { id: 'nc-stream-roaring-creek-nc', name: 'Roaring Creek (Avery)', region: 'NC Mountains', county: 'Avery', lat: 36.080, lng: -82.030, cat: 'nc-mountain-trout-stream' },
];

function main() {
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  const existing = JSON.parse(raw);
  const byId = new Map(existing.map((e) => [e.id, e]));

  let appended = 0, skipped = 0;
  for (const item of RAW) {
    if (byId.has(item.id)) { skipped++; continue; }
    const entry = buildNC({
      id: item.id, name: item.name, region: item.region,
      county: item.county, acres: null, maxDepthFt: null,
      lat: item.lat, lng: item.lng, cat: item.cat, notes: item.notes,
    });
    existing.push(entry);
    byId.set(item.id, entry);
    appended++;
  }

  fs.writeFileSync(DATA_PATH, JSON.stringify(existing, null, 2) + '\n', 'utf8');
  const ncTotal = existing.filter((e) => e.state === 'NC').length;
  console.log(`Appended ${appended}, skipped ${skipped}. NC total: ${ncTotal}, Grand total: ${existing.length}`);
}

main();
