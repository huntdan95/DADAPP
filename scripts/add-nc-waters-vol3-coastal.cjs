// NC Vol 3 — Coastal sounds + ocean piers + coastal rivers.
// NC's coast is one of the most diverse saltwater fisheries on the Atlantic.

const fs = require('fs');
const path = require('path');
const { buildNC } = require('./_nc-water-template.cjs');

const DATA_PATH = path.join(__dirname, '..', 'data', 'waterbodies.json');

const RAW = [
  // ============== COASTAL RIVERS ==============
  { id: 'nc-river-roanoke', name: 'Roanoke River', region: 'Coastal Plain NC', county: 'Halifax / Northampton / Bertie / Martin', acres: null, maxDepthFt: null, lat: 36.420, lng: -77.610, cat: 'nc-coastal-river', notes: 'Roanoke River at Weldon — premier striped bass spawning destination on the Atlantic Coast. Mid-April to mid-May the run produces fast action; catch-and-release only above I-95. World-class.' },
  { id: 'nc-river-roanoke-lower', name: 'Roanoke River — Lower (Plymouth area)', region: 'Coastal Plain NC', county: 'Washington / Beaufort', acres: null, maxDepthFt: null, lat: 35.870, lng: -76.745, cat: 'nc-coastal-river' },
  { id: 'nc-river-cape-fear', name: 'Cape Fear River', region: 'Coastal Plain NC', county: 'Bladen / Cumberland / Brunswick / New Hanover', acres: null, maxDepthFt: null, lat: 34.685, lng: -78.250, cat: 'nc-coastal-river', notes: 'Cape Fear River — striped bass + largemouth + trophy blue catfish + confirmed alligator gar population. Lock and Dam #1 is the striper concentration point.' },
  { id: 'nc-river-cape-fear-lower', name: 'Cape Fear River — Lower (Wilmington)', region: 'Coastal Plain NC', county: 'New Hanover / Brunswick', acres: null, maxDepthFt: null, lat: 34.220, lng: -77.945, cat: 'nc-coastal-river' },
  { id: 'nc-river-neuse', name: 'Neuse River', region: 'Coastal Plain NC', county: 'Wake / Johnston / Wayne / Lenoir / Craven', acres: null, maxDepthFt: null, lat: 35.430, lng: -77.985, cat: 'nc-coastal-river', notes: 'Neuse River — striped bass run at New Bern / Kinston. Largemouth + trophy flathead catfish in lower river. Crosses NC from Falls Lake to Pamlico Sound.' },
  { id: 'nc-river-neuse-upper', name: 'Neuse River — Upper (Below Falls Lake)', region: 'Piedmont NC', county: 'Wake', acres: null, maxDepthFt: null, lat: 35.930, lng: -78.580, cat: 'nc-coastal-river', notes: 'Neuse below Falls Lake Dam — striped bass tailrace + smallmouth + spotted bass + crappie.' },
  { id: 'nc-river-tar-river', name: 'Tar River', region: 'Coastal Plain NC', county: 'Multi-county', acres: null, maxDepthFt: null, lat: 35.620, lng: -77.380, cat: 'nc-coastal-river', notes: 'Tar River — coastal NC bass + striper + cat fishery. Greenville-area especially.' },
  { id: 'nc-river-pamlico', name: 'Pamlico River', region: 'Coastal Plain NC', county: 'Beaufort', acres: null, maxDepthFt: null, lat: 35.450, lng: -76.825, cat: 'nc-coastal-river' },
  { id: 'nc-river-chowan', name: 'Chowan River', region: 'Coastal Plain NC', county: 'Bertie / Hertford / Chowan', acres: null, maxDepthFt: null, lat: 36.180, lng: -76.745, cat: 'nc-coastal-river' },
  { id: 'nc-river-haw', name: 'Haw River', region: 'Piedmont NC', county: 'Rockingham / Alamance / Chatham', acres: null, maxDepthFt: null, lat: 36.030, lng: -79.530, cat: 'nc-coastal-river' },
  { id: 'nc-river-deep', name: 'Deep River', region: 'Piedmont NC', county: 'Guilford / Randolph / Moore', acres: null, maxDepthFt: null, lat: 35.640, lng: -79.585, cat: 'nc-coastal-river' },
  { id: 'nc-river-rocky', name: 'Rocky River', region: 'Piedmont NC', county: 'Cabarrus / Stanly / Union', acres: null, maxDepthFt: null, lat: 35.230, lng: -80.360, cat: 'nc-coastal-river' },
  { id: 'nc-river-eno', name: 'Eno River', region: 'Piedmont NC', county: 'Orange / Durham', acres: null, maxDepthFt: null, lat: 36.070, lng: -79.000, cat: 'nc-coastal-river', notes: 'Eno River — Piedmont smallmouth + redbreast sunfish. Eno River SP scenic float.' },
  { id: 'nc-river-flat', name: 'Flat River', region: 'Piedmont NC', county: 'Durham / Granville', acres: null, maxDepthFt: null, lat: 36.155, lng: -78.890, cat: 'nc-coastal-river' },
  { id: 'nc-river-northeast-cape-fear', name: 'Northeast Cape Fear River', region: 'Coastal Plain NC', county: 'Pender / Duplin / Sampson', acres: null, maxDepthFt: null, lat: 34.700, lng: -77.815, cat: 'nc-coastal-river', notes: 'Northeast Cape Fear — alligator gar + flatheads + largemouth + bowfin. One of NC\'s confirmed gator gar rivers.' },
  { id: 'nc-river-black-river', name: 'Black River', region: 'Coastal Plain NC', county: 'Sampson / Bladen / Pender', acres: null, maxDepthFt: null, lat: 34.700, lng: -78.260, cat: 'nc-coastal-river', notes: 'Black River — black-water cypress river. Largemouth + bowfin + crappie + cats. Old-growth cypress.' },
  { id: 'nc-river-waccamaw-nc', name: 'Waccamaw River', region: 'Coastal Plain NC', county: 'Columbus', acres: null, maxDepthFt: null, lat: 34.260, lng: -78.500, cat: 'nc-coastal-river' },
  { id: 'nc-river-lumber-river', name: 'Lumber River', region: 'Coastal Plain NC', county: 'Scotland / Robeson', acres: null, maxDepthFt: null, lat: 34.620, lng: -79.150, cat: 'nc-coastal-river', notes: 'Lumber River — Wild & Scenic black-water river. Largemouth + crappie + bowfin + redbreast sunfish.' },
  { id: 'nc-river-meherrin-river', name: 'Meherrin River', region: 'Coastal Plain NC', county: 'Hertford / Northampton', acres: null, maxDepthFt: null, lat: 36.420, lng: -77.250, cat: 'nc-coastal-river' },
  { id: 'nc-river-fishing-creek', name: 'Fishing Creek', region: 'Coastal Plain NC', county: 'Halifax / Edgecombe', acres: null, maxDepthFt: null, lat: 36.090, lng: -77.870, cat: 'nc-coastal-river' },
  { id: 'nc-river-trent-river', name: 'Trent River', region: 'Coastal Plain NC', county: 'Jones / Craven', acres: null, maxDepthFt: null, lat: 35.090, lng: -77.180, cat: 'nc-coastal-river' },
  { id: 'nc-river-white-oak', name: 'White Oak River', region: 'Coastal Plain NC', county: 'Onslow / Jones / Carteret', acres: null, maxDepthFt: null, lat: 34.755, lng: -77.115, cat: 'nc-coastal-river' },
  { id: 'nc-river-new-river-nc', name: 'New River (NC Coastal)', region: 'Coastal Plain NC', county: 'Onslow', acres: null, maxDepthFt: null, lat: 34.745, lng: -77.395, cat: 'nc-coastal-river', notes: 'NC has TWO New Rivers — this is the coastal one (Onslow). Mountain New River runs from NC into VA.' },
  { id: 'nc-river-new-river-mountain', name: 'New River (NC Mountain)', region: 'NC Mountains', county: 'Watauga / Ashe / Alleghany', acres: null, maxDepthFt: null, lat: 36.420, lng: -81.470, cat: 'nc-coastal-river', notes: 'New River (mountain) — flows north into VA. Smallmouth + muskie + walleye. Ancient river.' },
  { id: 'nc-river-yadkin-mid', name: 'Yadkin River — Mid (Above High Rock)', region: 'Piedmont NC', county: 'Wilkes / Yadkin / Davie', acres: null, maxDepthFt: null, lat: 36.090, lng: -80.730, cat: 'nc-coastal-river' },
  { id: 'nc-river-uwharrie', name: 'Uwharrie River', region: 'Piedmont NC', county: 'Randolph / Montgomery', acres: null, maxDepthFt: null, lat: 35.480, lng: -79.965, cat: 'nc-coastal-river' },
  { id: 'nc-river-french-broad-segments-supp', name: 'French Broad — Below Asheville Sections', region: 'NC Mountains', county: 'Buncombe / Madison', acres: null, maxDepthFt: null, lat: 35.715, lng: -82.620, cat: 'nc-coastal-river' },

  // ============== COASTAL SOUNDS ==============
  { id: 'nc-sound-pamlico', name: 'Pamlico Sound', region: 'NC Coast', county: 'Hyde / Beaufort / Dare / Pamlico', acres: 1500000, maxDepthFt: 25, lat: 35.300, lng: -75.985, cat: 'nc-coastal-sound', notes: 'Pamlico Sound — 1.5 million acres. Second-largest estuary in the US. Trophy red drum + speckled trout + flounder + cobia + sheepshead. World-class inshore fishery.' },
  { id: 'nc-sound-albemarle', name: 'Albemarle Sound', region: 'NC Coast', county: 'Chowan / Pasquotank / Tyrrell / Bertie / Washington / Hyde / Dare', acres: 500000, maxDepthFt: 25, lat: 36.060, lng: -76.025, cat: 'nc-coastal-sound', notes: 'Albemarle Sound — 500,000 acres. Striped bass + largemouth + perch + striper migration. Lower salinity than Pamlico — supports largemouth.' },
  { id: 'nc-sound-currituck', name: 'Currituck Sound', region: 'NC Coast / VA border', county: 'Currituck', acres: 153000, maxDepthFt: 8, lat: 36.420, lng: -75.870, cat: 'nc-coastal-sound', notes: 'Currituck Sound — brackish-to-fresh sound. World-class largemouth bass fishery (sound supports freshwater bass in low-salinity grass) PLUS speckled trout + redfish.' },
  { id: 'nc-sound-core', name: 'Core Sound', region: 'NC Coast', county: 'Carteret', acres: 100000, maxDepthFt: 12, lat: 34.880, lng: -76.420, cat: 'nc-coastal-sound', notes: 'Core Sound — speckled trout + redfish + flounder. Inshore Carteret Co fishery.' },
  { id: 'nc-sound-bogue', name: 'Bogue Sound', region: 'NC Coast', county: 'Carteret', acres: 35000, maxDepthFt: 15, lat: 34.700, lng: -76.730, cat: 'nc-coastal-sound', notes: 'Bogue Sound — Morehead City / Atlantic Beach inshore. Trout + reds + flounder + black drum + sheepshead.' },
  { id: 'nc-sound-back', name: 'Back Sound (Beaufort)', region: 'NC Coast', county: 'Carteret', acres: null, maxDepthFt: 10, lat: 34.685, lng: -76.620, cat: 'nc-coastal-sound' },
  { id: 'nc-sound-roanoke', name: 'Roanoke Sound', region: 'NC Coast', county: 'Dare', acres: null, maxDepthFt: 8, lat: 35.840, lng: -75.620, cat: 'nc-coastal-sound' },
  { id: 'nc-sound-croatan', name: 'Croatan Sound', region: 'NC Coast', county: 'Dare', acres: null, maxDepthFt: 8, lat: 35.890, lng: -75.770, cat: 'nc-coastal-sound' },
  { id: 'nc-sound-cape-fear-mouth', name: 'Cape Fear River Mouth (Bald Head)', region: 'NC Coast', county: 'Brunswick', acres: null, maxDepthFt: 30, lat: 33.870, lng: -78.000, cat: 'nc-coastal-sound', notes: 'Cape Fear River mouth — bull red drum + Spanish + king mackerel + tarpon (rare) + tripletail. Bald Head Island area.' },
  { id: 'nc-sound-shallotte-inlet', name: 'Shallotte Inlet + River', region: 'NC Coast', county: 'Brunswick', acres: null, maxDepthFt: 12, lat: 33.910, lng: -78.380, cat: 'nc-coastal-sound' },
  { id: 'nc-sound-lockwood-folly', name: 'Lockwood Folly River + Inlet', region: 'NC Coast', county: 'Brunswick', acres: null, maxDepthFt: 12, lat: 33.930, lng: -78.250, cat: 'nc-coastal-sound' },
  { id: 'nc-sound-tar-landing-bay', name: 'Tar Landing Bay', region: 'NC Coast', county: 'Pender', acres: null, maxDepthFt: 8, lat: 34.405, lng: -77.660, cat: 'nc-coastal-sound' },
  { id: 'nc-sound-topsail-sound', name: 'Topsail Sound', region: 'NC Coast', county: 'Pender / Onslow', acres: null, maxDepthFt: 10, lat: 34.430, lng: -77.560, cat: 'nc-coastal-sound', notes: 'Topsail Sound — Pender/Onslow inshore. Reds + trout + flounder + sheepshead.' },
  { id: 'nc-sound-stump-sound', name: 'Stump Sound', region: 'NC Coast', county: 'Onslow', acres: null, maxDepthFt: 10, lat: 34.500, lng: -77.500, cat: 'nc-coastal-sound' },
  { id: 'nc-sound-new-river-inlet', name: 'New River Inlet', region: 'NC Coast', county: 'Onslow', acres: null, maxDepthFt: 15, lat: 34.530, lng: -77.330, cat: 'nc-coastal-sound' },
  { id: 'nc-sound-bear-island', name: 'Bear Island (Hammocks Beach SP)', region: 'NC Coast', county: 'Onslow', acres: null, maxDepthFt: 12, lat: 34.660, lng: -77.180, cat: 'nc-coastal-sound' },
  { id: 'nc-sound-harkers-island', name: 'Harkers Island Area', region: 'NC Coast', county: 'Carteret', acres: null, maxDepthFt: 15, lat: 34.700, lng: -76.560, cat: 'nc-coastal-sound', notes: 'Harkers Island — Cape Lookout base. Trout + reds + flounder + king mackerel offshore.' },
  { id: 'nc-sound-beaufort-inlet', name: 'Beaufort Inlet', region: 'NC Coast', county: 'Carteret', acres: null, maxDepthFt: 30, lat: 34.700, lng: -76.665, cat: 'nc-coastal-sound', notes: 'Beaufort Inlet — premier NC fishing inlet. Cobia + tarpon + king mackerel + redfish + tripletail + albies.' },
  { id: 'nc-sound-cape-lookout', name: 'Cape Lookout Shoals', region: 'NC Coast', county: 'Carteret', acres: null, maxDepthFt: 30, lat: 34.620, lng: -76.530, cat: 'nc-coastal-sound', notes: 'Cape Lookout — world\'s premier false albacore destination (Oct–Nov). Also king mackerel, cobia, Spanish, drum.' },
  { id: 'nc-sound-ocracoke-inlet', name: 'Ocracoke Inlet', region: 'NC Coast', county: 'Hyde', acres: null, maxDepthFt: 25, lat: 35.080, lng: -76.020, cat: 'nc-coastal-sound' },
  { id: 'nc-sound-hatteras-inlet', name: 'Hatteras Inlet', region: 'NC Coast', county: 'Dare / Hyde', acres: null, maxDepthFt: 20, lat: 35.205, lng: -75.715, cat: 'nc-coastal-sound' },
  { id: 'nc-sound-oregon-inlet', name: 'Oregon Inlet', region: 'NC Coast', county: 'Dare', acres: null, maxDepthFt: 25, lat: 35.770, lng: -75.530, cat: 'nc-coastal-sound', notes: 'Oregon Inlet — Outer Banks billfish + tuna gateway. Inside: trout, reds, flounder, blues, Spanish.' },
  { id: 'nc-sound-currituck-banks', name: 'Currituck Banks (north OBX)', region: 'NC Coast', county: 'Currituck', acres: null, maxDepthFt: 12, lat: 36.450, lng: -75.850, cat: 'nc-coastal-sound' },
  { id: 'nc-sound-hattaras-village-area', name: 'Hatteras Village Area (Pamlico side)', region: 'NC Coast', county: 'Dare', acres: null, maxDepthFt: 15, lat: 35.218, lng: -75.685, cat: 'nc-coastal-sound' },
  { id: 'nc-sound-pungo-river-mouth', name: 'Pungo River (Pamlico Sound trib)', region: 'NC Coast', county: 'Beaufort / Hyde', acres: null, maxDepthFt: 18, lat: 35.380, lng: -76.490, cat: 'nc-coastal-sound' },
  { id: 'nc-sound-bay-river', name: 'Bay River', region: 'NC Coast', county: 'Pamlico', acres: null, maxDepthFt: 15, lat: 35.190, lng: -76.690, cat: 'nc-coastal-sound' },
  { id: 'nc-sound-neuse-river-mouth', name: 'Neuse River Mouth (Pamlico Sound)', region: 'NC Coast', county: 'Pamlico / Craven', acres: null, maxDepthFt: 20, lat: 35.030, lng: -76.500, cat: 'nc-coastal-sound', notes: 'Neuse River mouth — world-class summer trophy speckled trout. Pamlico Sound entrance.' },
  { id: 'nc-sound-pamlico-river-mouth', name: 'Pamlico River Mouth', region: 'NC Coast', county: 'Beaufort', acres: null, maxDepthFt: 15, lat: 35.255, lng: -76.580, cat: 'nc-coastal-sound' },

  // ============== OCEAN PIERS + SURF ==============
  { id: 'nc-pier-jennettes', name: 'Jennette\'s Pier (Nags Head)', region: 'NC Coast - OBX', county: 'Dare', acres: null, maxDepthFt: null, lat: 35.910, lng: -75.595, cat: 'nc-coastal-pier', notes: 'Jennette\'s Pier — Nags Head. NC Aquarium-operated. Kings, Spanish, blues, drum, flounder, sea mullet, false albies.' },
  { id: 'nc-pier-nags-head', name: 'Nags Head Fishing Pier', region: 'NC Coast - OBX', county: 'Dare', acres: null, maxDepthFt: null, lat: 35.940, lng: -75.600, cat: 'nc-coastal-pier' },
  { id: 'nc-pier-avon', name: 'Avon Pier', region: 'NC Coast - OBX', county: 'Dare', acres: null, maxDepthFt: null, lat: 35.355, lng: -75.495, cat: 'nc-coastal-pier' },
  { id: 'nc-pier-hatteras-island', name: 'Hatteras Island Surf', region: 'NC Coast - OBX', county: 'Dare', acres: null, maxDepthFt: null, lat: 35.220, lng: -75.510, cat: 'nc-coastal-pier', notes: 'Hatteras Island surf fishing — Cape Hatteras National Seashore. World-record red drum surf zone (94 lb 2 oz). Trophy drum + blues + pompano + flounder + sea mullet.' },
  { id: 'nc-pier-rodanthe', name: 'Rodanthe Pier', region: 'NC Coast - OBX', county: 'Dare', acres: null, maxDepthFt: null, lat: 35.595, lng: -75.470, cat: 'nc-coastal-pier' },
  { id: 'nc-pier-buxton-surf', name: 'Buxton Surf (Cape Point)', region: 'NC Coast - OBX', county: 'Dare', acres: null, maxDepthFt: null, lat: 35.225, lng: -75.530, cat: 'nc-coastal-pier', notes: 'Buxton / Cape Point — Cape Hatteras Lighthouse beach. NC\'s most famous trophy red drum surf spot.' },
  { id: 'nc-pier-frisco-pier', name: 'Frisco Pier Area', region: 'NC Coast - OBX', county: 'Dare', acres: null, maxDepthFt: null, lat: 35.250, lng: -75.610, cat: 'nc-coastal-pier' },
  { id: 'nc-pier-ocracoke-beaches', name: 'Ocracoke Beaches + Surf', region: 'NC Coast - OBX', county: 'Hyde', acres: null, maxDepthFt: null, lat: 35.110, lng: -75.965, cat: 'nc-coastal-pier' },
  { id: 'nc-pier-currituck-banks-surf', name: 'Currituck Banks Surf (Corolla/Carova)', region: 'NC Coast - OBX', county: 'Currituck', acres: null, maxDepthFt: null, lat: 36.380, lng: -75.825, cat: 'nc-coastal-pier' },
  { id: 'nc-pier-kitty-hawk-pier', name: 'Kitty Hawk Pier', region: 'NC Coast - OBX', county: 'Dare', acres: null, maxDepthFt: null, lat: 36.065, lng: -75.703, cat: 'nc-coastal-pier' },
  { id: 'nc-pier-avalon', name: 'Avalon Pier (Kill Devil Hills)', region: 'NC Coast - OBX', county: 'Dare', acres: null, maxDepthFt: null, lat: 36.020, lng: -75.660, cat: 'nc-coastal-pier' },
  { id: 'nc-pier-outer-banks-pier', name: 'Outer Banks Pier (Nags Head)', region: 'NC Coast - OBX', county: 'Dare', acres: null, maxDepthFt: null, lat: 35.880, lng: -75.595, cat: 'nc-coastal-pier' },
  { id: 'nc-pier-bogue-inlet-pier', name: 'Bogue Inlet Pier', region: 'NC Coast', county: 'Carteret', acres: null, maxDepthFt: null, lat: 34.680, lng: -77.115, cat: 'nc-coastal-pier' },
  { id: 'nc-pier-emerald-isle-pier', name: 'Emerald Isle Surf', region: 'NC Coast', county: 'Carteret', acres: null, maxDepthFt: null, lat: 34.665, lng: -77.060, cat: 'nc-coastal-pier' },
  { id: 'nc-pier-atlantic-beach-pier', name: 'Oceanana Pier (Atlantic Beach)', region: 'NC Coast', county: 'Carteret', acres: null, maxDepthFt: null, lat: 34.700, lng: -76.730, cat: 'nc-coastal-pier' },
  { id: 'nc-pier-surf-city-pier', name: 'Surf City Pier', region: 'NC Coast', county: 'Pender', acres: null, maxDepthFt: null, lat: 34.430, lng: -77.540, cat: 'nc-coastal-pier' },
  { id: 'nc-pier-jolly-roger-pier', name: 'Jolly Roger Pier (Topsail Beach)', region: 'NC Coast', county: 'Pender', acres: null, maxDepthFt: null, lat: 34.355, lng: -77.640, cat: 'nc-coastal-pier' },
  { id: 'nc-pier-seaview-pier', name: 'Seaview Pier (North Topsail)', region: 'NC Coast', county: 'Onslow', acres: null, maxDepthFt: null, lat: 34.530, lng: -77.380, cat: 'nc-coastal-pier' },
  { id: 'nc-pier-wrightsville-piers', name: 'Wrightsville Beach Piers (Crystal/Johnnie Mercer\'s)', region: 'NC Coast', county: 'New Hanover', acres: null, maxDepthFt: null, lat: 34.215, lng: -77.795, cat: 'nc-coastal-pier' },
  { id: 'nc-pier-carolina-beach-pier', name: 'Carolina Beach Pier', region: 'NC Coast', county: 'New Hanover', acres: null, maxDepthFt: null, lat: 34.040, lng: -77.880, cat: 'nc-coastal-pier' },
  { id: 'nc-pier-kure-beach-pier', name: 'Kure Beach Pier', region: 'NC Coast', county: 'New Hanover', acres: null, maxDepthFt: null, lat: 33.985, lng: -77.910, cat: 'nc-coastal-pier' },
  { id: 'nc-pier-ocean-isle-pier', name: 'Ocean Isle Beach Pier', region: 'NC Coast', county: 'Brunswick', acres: null, maxDepthFt: null, lat: 33.880, lng: -78.420, cat: 'nc-coastal-pier' },
  { id: 'nc-pier-sunset-beach-pier', name: 'Sunset Beach Pier', region: 'NC Coast', county: 'Brunswick', acres: null, maxDepthFt: null, lat: 33.870, lng: -78.510, cat: 'nc-coastal-pier' },
  { id: 'nc-pier-holden-beach-pier', name: 'Holden Beach Pier', region: 'NC Coast', county: 'Brunswick', acres: null, maxDepthFt: null, lat: 33.910, lng: -78.295, cat: 'nc-coastal-pier' },
  { id: 'nc-pier-oak-island-pier', name: 'Oak Island Pier', region: 'NC Coast', county: 'Brunswick', acres: null, maxDepthFt: null, lat: 33.920, lng: -78.140, cat: 'nc-coastal-pier' },
  { id: 'nc-pier-yaupon-pier', name: 'Yaupon Pier (Oak Island)', region: 'NC Coast', county: 'Brunswick', acres: null, maxDepthFt: null, lat: 33.910, lng: -78.085, cat: 'nc-coastal-pier' },

  // ============== POCOSIN LAKES ==============
  { id: 'nc-lake-mattamuskeet', name: 'Lake Mattamuskeet', region: 'Coastal Plain NC', county: 'Hyde', acres: 40000, maxDepthFt: 5, lat: 35.500, lng: -76.180, cat: 'nc-pocosin-lake', notes: 'Lake Mattamuskeet — NC\'s largest natural lake (40,000 acres). Massive shallow pocosin lake; bass + crappie + cats + bream. Wildlife refuge.' },
  { id: 'nc-lake-phelps', name: 'Lake Phelps', region: 'Coastal Plain NC', county: 'Washington / Tyrrell', acres: 16600, maxDepthFt: 9, lat: 35.770, lng: -76.460, cat: 'nc-pocosin-lake', notes: 'Lake Phelps — second-largest natural NC lake. Clear pocosin water; quality bass + bream + crappie. Pettigrew SP.' },
  { id: 'nc-lake-pungo', name: 'Pungo Lake', region: 'Coastal Plain NC', county: 'Hyde', acres: 2800, maxDepthFt: 7, lat: 35.580, lng: -76.555, cat: 'nc-pocosin-lake' },
  { id: 'nc-lake-alligator-river', name: 'Alligator River + Lakes (NWR)', region: 'Coastal Plain NC', county: 'Tyrrell / Dare', acres: null, maxDepthFt: 12, lat: 35.620, lng: -75.945, cat: 'nc-pocosin-lake', notes: 'Alligator River NWR — pocosin lake system. Largemouth + crappie + bowfin + cats. Wildlife refuge — limited access.' },
  { id: 'nc-lake-merchant-millpond', name: 'Merchants Millpond', region: 'Coastal Plain NC', county: 'Gates', acres: 760, maxDepthFt: 12, lat: 36.430, lng: -76.700, cat: 'nc-pocosin-lake' },
  { id: 'nc-lake-pocosin-lakes-nwr', name: 'Pocosin Lakes NWR (Pungo, Phelps area)', region: 'Coastal Plain NC', county: 'Hyde / Washington / Tyrrell', acres: null, maxDepthFt: null, lat: 35.620, lng: -76.420, cat: 'nc-pocosin-lake' },
  { id: 'nc-lake-currituck-coinjock-bay', name: 'Coinjock Bay (Currituck NWR)', region: 'Coastal Plain NC', county: 'Currituck', acres: null, maxDepthFt: null, lat: 36.420, lng: -75.945, cat: 'nc-pocosin-lake' },
  { id: 'nc-lake-pocosin-pungo-creek', name: 'Pungo Creek (Eastern NC)', region: 'Coastal Plain NC', county: 'Beaufort', acres: null, maxDepthFt: 10, lat: 35.430, lng: -76.755, cat: 'nc-pocosin-lake' },
  { id: 'nc-lake-piney-grove-pond', name: 'Piney Grove Pond', region: 'Coastal Plain NC', county: 'Robeson', acres: 75, maxDepthFt: 15, lat: 34.580, lng: -79.020, cat: 'nc-pocosin-lake' },
  { id: 'nc-lake-fish-tail-pond', name: 'Lake Waccamaw', region: 'Coastal Plain NC', county: 'Columbus', acres: 8938, maxDepthFt: 11, lat: 34.305, lng: -78.530, cat: 'nc-pocosin-lake', notes: 'Lake Waccamaw — largest Carolina bay lake (8,938 acres). Unique endemic fish species. Quality bass + crappie + cats.' },
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
      county: item.county, acres: item.acres, maxDepthFt: item.maxDepthFt,
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
