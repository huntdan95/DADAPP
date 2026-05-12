// TN Vol 4 — Smokies + Cherokee NF wild trout streams.
// GSMNP has 700+ miles of fishable wild trout streams. Cherokee NF adds another massive system.

const fs = require('fs');
const path = require('path');
const { buildTN } = require('./_tn-water-template.cjs');

const DATA_PATH = path.join(__dirname, '..', 'data', 'waterbodies.json');

const RAW = [
  // ============== GREAT SMOKY MOUNTAINS NP — TN SIDE ==============
  // Major streams
  { id: 'tn-stream-little-river-elkmont', name: 'Little River — Elkmont', county: 'Sevier', lat: 35.660, lng: -83.582, cat: 'smokies-stream', region: 'Smokies', notes: 'Little River — Elkmont section. Wild rainbow + brown trout. One of the most-fished Smokies streams.' },
  { id: 'tn-stream-little-river-tremont', name: 'Little River — Tremont Branch', county: 'Sevier', lat: 35.645, lng: -83.665, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-stream-middle-prong-little-river', name: 'Middle Prong of Little River', county: 'Sevier / Blount', lat: 35.625, lng: -83.625, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-stream-west-prong-little-river', name: 'West Prong of Little River (Tremont)', county: 'Blount', lat: 35.640, lng: -83.685, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-stream-east-prong-little-river', name: 'East Prong of Little River (Elkmont)', county: 'Sevier', lat: 35.660, lng: -83.580, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-stream-little-pigeon-middle', name: 'Middle Prong Little Pigeon River', county: 'Sevier', lat: 35.685, lng: -83.430, cat: 'smokies-stream', region: 'Smokies', notes: 'Middle Prong Little Pigeon — Greenbrier area. Quality wild trout water.' },
  { id: 'tn-stream-little-pigeon-east', name: 'East Prong Little Pigeon (Greenbrier)', county: 'Sevier', lat: 35.715, lng: -83.395, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-stream-porters-creek', name: 'Porters Creek', county: 'Sevier', lat: 35.700, lng: -83.402, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-stream-roaring-fork', name: 'Roaring Fork (Gatlinburg)', county: 'Sevier', lat: 35.700, lng: -83.500, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-stream-leconte-creek', name: 'LeConte Creek', county: 'Sevier', lat: 35.720, lng: -83.490, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-stream-baskins-creek', name: 'Baskins Creek', county: 'Sevier', lat: 35.722, lng: -83.490, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-stream-cosby-creek', name: 'Cosby Creek', county: 'Cocke', lat: 35.770, lng: -83.215, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-stream-big-creek-cocke', name: 'Big Creek (GSMNP)', county: 'Cocke', lat: 35.755, lng: -83.110, cat: 'smokies-stream', region: 'Smokies', notes: 'Big Creek — Smokies, NE entrance. Wild rainbow + brown trout in plunge pools.' },
  { id: 'tn-stream-cataloochee-tn', name: 'Cataloochee Creek (NC/TN headwaters)', county: 'Cocke', lat: 35.638, lng: -83.090, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-stream-bog-creek', name: 'Bog Creek', county: 'Sevier', lat: 35.700, lng: -83.500, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-stream-fightin-creek', name: 'Fightin Creek', county: 'Sevier', lat: 35.690, lng: -83.540, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-stream-walker-camp-prong', name: 'Walker Camp Prong', county: 'Sevier', lat: 35.605, lng: -83.485, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-stream-road-prong', name: 'Road Prong', county: 'Sevier', lat: 35.620, lng: -83.460, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-stream-mannis-branch', name: 'Mannis Branch', county: 'Sevier', lat: 35.665, lng: -83.580, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-stream-rough-creek-gsm', name: 'Rough Creek (GSMNP)', county: 'Sevier', lat: 35.638, lng: -83.595, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-stream-fish-camp-prong', name: 'Fish Camp Prong', county: 'Sevier', lat: 35.600, lng: -83.555, cat: 'smokies-stream', region: 'Smokies', notes: 'Fish Camp Prong — long backcountry hike but native brook trout in upper reaches.' },
  { id: 'tn-stream-goshen-prong', name: 'Goshen Prong', county: 'Sevier', lat: 35.605, lng: -83.605, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-stream-thunderhead-prong', name: 'Thunderhead Prong', county: 'Blount', lat: 35.580, lng: -83.685, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-stream-laurel-creek-blount', name: 'Laurel Creek (Cades Cove area)', county: 'Blount', lat: 35.605, lng: -83.770, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-stream-abrams-falls-creek', name: 'Abrams Creek — Below Falls', county: 'Blount', lat: 35.580, lng: -83.870, cat: 'smokies-stream', region: 'Smokies', notes: 'Below the falls section — quality wild rainbow and brown. Already have tn-abrams-creek; this is the lower fishable section.' },
  { id: 'tn-stream-rabbit-creek', name: 'Rabbit Creek', county: 'Blount', lat: 35.580, lng: -83.840, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-stream-anthony-creek', name: 'Anthony Creek', county: 'Blount', lat: 35.580, lng: -83.760, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-stream-bone-valley-creek', name: 'Bone Valley Creek', county: 'Blount', lat: 35.490, lng: -83.870, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-stream-noland-creek', name: 'Noland Creek (lower TN access)', county: 'Blount', lat: 35.460, lng: -83.620, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-stream-hazel-creek-tn', name: 'Hazel Creek (lower fishable section)', county: 'Blount', lat: 35.470, lng: -83.715, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-stream-eagle-creek', name: 'Eagle Creek', county: 'Blount', lat: 35.490, lng: -83.835, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-stream-twentymile-creek', name: 'Twentymile Creek', county: 'Blount', lat: 35.470, lng: -83.880, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-stream-deep-creek-tn', name: 'Deep Creek (TN side access)', county: 'Blount', lat: 35.460, lng: -83.470, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-stream-mingus-creek', name: 'Mingus Creek', county: 'Sevier', lat: 35.510, lng: -83.310, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-stream-oconaluftee-tn-access', name: 'Oconaluftee River (TN backcountry access)', county: 'Sevier', lat: 35.510, lng: -83.355, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-stream-bradley-fork', name: 'Bradley Fork', county: 'Sevier', lat: 35.555, lng: -83.355, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-stream-chasteen-creek', name: 'Chasteen Creek', county: 'Sevier', lat: 35.555, lng: -83.300, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-stream-raven-fork', name: 'Raven Fork (TN side)', county: 'Sevier', lat: 35.540, lng: -83.290, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-stream-straight-fork', name: 'Straight Fork', county: 'Sevier', lat: 35.560, lng: -83.232, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-stream-flat-creek-smokies', name: 'Flat Creek (Smokies)', county: 'Blount', lat: 35.580, lng: -83.760, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-stream-meigs-creek', name: 'Meigs Creek', county: 'Blount', lat: 35.610, lng: -83.715, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-stream-thomas-creek', name: 'Thomas Branch', county: 'Sevier', lat: 35.700, lng: -83.580, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-stream-jakes-creek', name: 'Jakes Creek', county: 'Sevier', lat: 35.660, lng: -83.575, cat: 'smokies-stream', region: 'Smokies' },

  // ============== CHEROKEE NATIONAL FOREST — NORTH ZONE ==============
  { id: 'tn-cnf-doe-river', name: 'Doe River (Cherokee NF)', county: 'Carter', lat: 36.205, lng: -82.110, cat: 'cherokee-nf-stream', region: 'East TN' },
  { id: 'tn-cnf-laurel-fork-creek', name: 'Laurel Fork Creek (Carter)', county: 'Carter', lat: 36.205, lng: -81.985, cat: 'cherokee-nf-stream', region: 'East TN' },
  { id: 'tn-cnf-roan-creek', name: 'Roan Creek', county: 'Johnson', lat: 36.430, lng: -81.890, cat: 'cherokee-nf-stream', region: 'East TN' },
  { id: 'tn-cnf-beaverdam-creek', name: 'Beaverdam Creek', county: 'Johnson', lat: 36.530, lng: -81.840, cat: 'cherokee-nf-stream', region: 'East TN' },
  { id: 'tn-cnf-doe-creek-johnson', name: 'Doe Creek (Johnson)', county: 'Johnson', lat: 36.485, lng: -81.835, cat: 'cherokee-nf-stream', region: 'East TN' },
  { id: 'tn-cnf-stony-creek', name: 'Stony Creek (Carter)', county: 'Carter', lat: 36.275, lng: -82.085, cat: 'cherokee-nf-stream', region: 'East TN' },
  { id: 'tn-cnf-buffalo-creek-johnson', name: 'Buffalo Creek (Johnson)', county: 'Johnson', lat: 36.490, lng: -81.870, cat: 'cherokee-nf-stream', region: 'East TN' },
  { id: 'tn-cnf-iron-mountain-creek', name: 'Iron Mountain Creek', county: 'Carter', lat: 36.350, lng: -82.020, cat: 'cherokee-nf-stream', region: 'East TN' },
  { id: 'tn-cnf-watauga-tributary-laurel', name: 'Laurel Creek (Watauga trib)', county: 'Carter', lat: 36.260, lng: -82.140, cat: 'cherokee-nf-stream', region: 'East TN' },
  { id: 'tn-cnf-rocky-fork', name: 'Rocky Fork (Unicoi)', county: 'Unicoi', lat: 36.045, lng: -82.490, cat: 'cherokee-nf-stream', region: 'East TN' },
  { id: 'tn-cnf-clark-creek', name: 'Clark Creek', county: 'Unicoi', lat: 36.020, lng: -82.480, cat: 'cherokee-nf-stream', region: 'East TN' },
  { id: 'tn-cnf-clarks-creek', name: 'Clarks Creek (Greene)', county: 'Greene', lat: 36.030, lng: -82.690, cat: 'cherokee-nf-stream', region: 'East TN' },
  { id: 'tn-cnf-paint-creek', name: 'Paint Creek (Greene)', county: 'Greene', lat: 35.940, lng: -82.870, cat: 'cherokee-nf-stream', region: 'East TN' },
  { id: 'tn-cnf-meadow-creek-greene', name: 'Meadow Creek (Greene)', county: 'Greene', lat: 36.000, lng: -82.815, cat: 'cherokee-nf-stream', region: 'East TN' },
  { id: 'tn-cnf-greenes-creek', name: 'Greene Creek', county: 'Greene', lat: 36.135, lng: -82.800, cat: 'cherokee-nf-stream', region: 'East TN' },
  { id: 'tn-cnf-big-creek-greene', name: 'Big Creek (Greene)', county: 'Greene', lat: 35.910, lng: -82.945, cat: 'cherokee-nf-stream', region: 'East TN' },
  { id: 'tn-cnf-jennings-creek-cocke', name: 'Jennings Creek', county: 'Cocke', lat: 35.870, lng: -83.005, cat: 'cherokee-nf-stream', region: 'East TN' },
  { id: 'tn-cnf-pigeon-tributary-creek', name: 'Pigeon River — Wilton Springs section', county: 'Cocke', lat: 35.840, lng: -83.140, cat: 'cherokee-nf-stream', region: 'East TN' },
  { id: 'tn-cnf-french-broad-tributary-1', name: 'French Broad Trib — Hot Springs', county: 'Cocke', lat: 35.860, lng: -83.140, cat: 'cherokee-nf-stream', region: 'East TN' },

  // ============== CHEROKEE NF — SOUTH ZONE (Hiwassee + Ocoee) ==============
  { id: 'tn-cnf-citico-creek', name: 'Citico Creek', county: 'Monroe', lat: 35.395, lng: -84.060, cat: 'cherokee-nf-stream', region: 'East TN', notes: 'Citico Creek — beautiful Cherokee NF freestone stream. Wild + stocked trout, smallmouth in lower reaches.' },
  { id: 'tn-cnf-citico-creek-north', name: 'North Fork Citico Creek', county: 'Monroe', lat: 35.405, lng: -84.080, cat: 'cherokee-nf-stream', region: 'East TN' },
  { id: 'tn-cnf-citico-creek-south', name: 'South Fork Citico Creek', county: 'Monroe', lat: 35.395, lng: -84.075, cat: 'cherokee-nf-stream', region: 'East TN' },
  { id: 'tn-cnf-slickrock-creek', name: 'Slickrock Creek', county: 'Monroe', lat: 35.415, lng: -83.975, cat: 'cherokee-nf-stream', region: 'East TN' },
  { id: 'tn-cnf-bald-river-supp', name: 'Bald River — Headwaters', county: 'Monroe', lat: 35.310, lng: -84.135, cat: 'cherokee-nf-stream', region: 'East TN' },
  { id: 'tn-cnf-tellico-tribs-laurel', name: 'Laurel Branch (Tellico trib)', county: 'Monroe', lat: 35.350, lng: -84.090, cat: 'cherokee-nf-stream', region: 'East TN' },
  { id: 'tn-cnf-citco-creek-section', name: 'Tellico River — Above Bald River', county: 'Monroe', lat: 35.360, lng: -84.085, cat: 'cherokee-nf-stream', region: 'East TN' },
  { id: 'tn-cnf-rocky-flats-branch', name: 'Rocky Flats Branch', county: 'Monroe', lat: 35.330, lng: -84.150, cat: 'cherokee-nf-stream', region: 'East TN' },
  { id: 'tn-cnf-doublecamp-creek', name: 'Doublecamp Creek', county: 'Monroe', lat: 35.385, lng: -84.075, cat: 'cherokee-nf-stream', region: 'East TN' },
  { id: 'tn-cnf-jeffrey-creek', name: 'Jeffrey Creek', county: 'Monroe', lat: 35.330, lng: -84.105, cat: 'cherokee-nf-stream', region: 'East TN' },
  { id: 'tn-cnf-sycamore-creek', name: 'Sycamore Creek', county: 'Monroe', lat: 35.380, lng: -84.105, cat: 'cherokee-nf-stream', region: 'East TN' },
  { id: 'tn-cnf-mill-creek-monroe', name: 'Mill Creek (Monroe)', county: 'Monroe', lat: 35.395, lng: -84.105, cat: 'cherokee-nf-stream', region: 'East TN' },
  { id: 'tn-cnf-coker-creek', name: 'Coker Creek', county: 'Monroe', lat: 35.255, lng: -84.230, cat: 'cherokee-nf-stream', region: 'East TN' },
  { id: 'tn-cnf-ballplay-creek', name: 'Ballplay Creek', county: 'Monroe', lat: 35.510, lng: -84.300, cat: 'cherokee-nf-stream', region: 'East TN' },
  { id: 'tn-cnf-conasauga-tn', name: 'Conasauga River (TN side)', county: 'Polk', lat: 35.020, lng: -84.575, cat: 'cherokee-nf-stream', region: 'Southeast TN' },
  { id: 'tn-cnf-jacks-river-tn', name: 'Jacks River (TN headwaters)', county: 'Polk', lat: 34.960, lng: -84.580, cat: 'cherokee-nf-stream', region: 'Southeast TN' },
  { id: 'tn-cnf-tumbling-creek', name: 'Tumbling Creek (Ocoee trib)', county: 'Polk', lat: 35.075, lng: -84.430, cat: 'cherokee-nf-stream', region: 'Southeast TN' },
  { id: 'tn-cnf-greasy-creek-polk', name: 'Greasy Creek (Polk)', county: 'Polk', lat: 35.150, lng: -84.460, cat: 'cherokee-nf-stream', region: 'Southeast TN' },
  { id: 'tn-cnf-rough-creek-polk', name: 'Rough Creek (Polk)', county: 'Polk', lat: 35.160, lng: -84.395, cat: 'cherokee-nf-stream', region: 'Southeast TN' },
  { id: 'tn-cnf-spring-creek-polk', name: 'Spring Creek (Polk)', county: 'Polk', lat: 35.175, lng: -84.580, cat: 'cherokee-nf-stream', region: 'Southeast TN' },
  { id: 'tn-cnf-hiwassee-tribs-gee-creek', name: 'Gee Creek', county: 'Polk', lat: 35.240, lng: -84.490, cat: 'cherokee-nf-stream', region: 'Southeast TN' },
  { id: 'tn-cnf-hiwassee-tribs-towee-creek', name: 'Towee Creek', county: 'Polk', lat: 35.275, lng: -84.470, cat: 'cherokee-nf-stream', region: 'Southeast TN' },
  { id: 'tn-cnf-hiwassee-tribs-shuler-creek', name: 'Shuler Creek', county: 'Polk', lat: 35.155, lng: -84.310, cat: 'cherokee-nf-stream', region: 'Southeast TN' },
  { id: 'tn-cnf-hiwassee-tribs-spring-creek', name: 'Spring Creek (Hiwassee trib)', county: 'Polk', lat: 35.210, lng: -84.420, cat: 'cherokee-nf-stream', region: 'Southeast TN' },
  { id: 'tn-cnf-laurel-branch-ocoee', name: 'Laurel Branch (Ocoee)', county: 'Polk', lat: 35.095, lng: -84.435, cat: 'cherokee-nf-stream', region: 'Southeast TN' },
  { id: 'tn-cnf-rock-creek-polk', name: 'Rock Creek (Polk)', county: 'Polk', lat: 35.115, lng: -84.380, cat: 'cherokee-nf-stream', region: 'Southeast TN' },
  { id: 'tn-cnf-chestnut-mountain-creek', name: 'Chestnut Mountain Creek', county: 'Polk', lat: 35.090, lng: -84.395, cat: 'cherokee-nf-stream', region: 'Southeast TN' },

  // ============== SMOKIES BACKCOUNTRY HEADWATERS ==============
  { id: 'tn-smokies-head-newfound-prong', name: 'Newfound Gap Prong', county: 'Sevier', lat: 35.610, lng: -83.425, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-bunches-creek', name: 'Bunches Creek', county: 'Sevier', lat: 35.560, lng: -83.255, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-collins-creek', name: 'Collins Creek', county: 'Sevier', lat: 35.555, lng: -83.327, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-yagle-branch', name: 'Yagle Branch', county: 'Sevier', lat: 35.580, lng: -83.395, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-anakeesta-creek', name: 'Anakeesta Creek', county: 'Sevier', lat: 35.615, lng: -83.475, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-cataract-branch', name: 'Cataract Branch', county: 'Blount', lat: 35.600, lng: -83.700, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-cucumber-gap-branch', name: 'Cucumber Gap Branch', county: 'Sevier', lat: 35.665, lng: -83.605, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-blanket-creek', name: 'Blanket Creek', county: 'Sevier', lat: 35.680, lng: -83.595, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-buck-fork', name: 'Buck Fork', county: 'Sevier', lat: 35.640, lng: -83.330, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-ramsey-prong', name: 'Ramsey Prong', county: 'Sevier', lat: 35.700, lng: -83.355, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-bullhead-creek', name: 'Bullhead Creek', county: 'Sevier', lat: 35.660, lng: -83.395, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-trillium-gap-branch', name: 'Trillium Gap Branch', county: 'Sevier', lat: 35.665, lng: -83.430, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-stillwell-creek', name: 'Stillwell Creek', county: 'Cocke', lat: 35.770, lng: -83.135, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-rock-creek-cosby', name: 'Rock Creek (Cosby)', county: 'Cocke', lat: 35.760, lng: -83.220, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-camel-hump-creek', name: 'Camel Hump Creek', county: 'Cocke', lat: 35.770, lng: -83.205, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-toms-creek-cosby', name: 'Toms Creek (Cosby)', county: 'Cocke', lat: 35.755, lng: -83.225, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-snake-den-branch', name: 'Snake Den Branch', county: 'Cocke', lat: 35.745, lng: -83.220, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-low-gap-branch', name: 'Low Gap Branch', county: 'Cocke', lat: 35.740, lng: -83.215, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-crying-creek', name: 'Crying Creek', county: 'Sevier', lat: 35.685, lng: -83.490, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-soak-ash-creek', name: 'Soak Ash Creek', county: 'Sevier', lat: 35.675, lng: -83.430, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-greenbrier-cove-creek', name: 'Greenbrier Cove Creek', county: 'Sevier', lat: 35.700, lng: -83.395, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-injun-creek', name: 'Injun Creek', county: 'Sevier', lat: 35.715, lng: -83.400, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-fish-camp-fork-branch', name: 'Fish Camp Fork', county: 'Sevier', lat: 35.600, lng: -83.555, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-tornado-falls-creek', name: 'Tornado Falls Creek', county: 'Sevier', lat: 35.610, lng: -83.575, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-cane-creek-blount', name: 'Cane Creek (Blount)', county: 'Blount', lat: 35.555, lng: -83.760, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-mill-creek-blount', name: 'Mill Creek (Blount)', county: 'Blount', lat: 35.595, lng: -83.795, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-rabbit-creek-cades', name: 'Rabbit Branch (Cades Cove)', county: 'Blount', lat: 35.595, lng: -83.795, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-pinnacle-creek', name: 'Pinnacle Creek', county: 'Blount', lat: 35.515, lng: -83.880, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-tabcat-creek', name: 'Tabcat Creek', county: 'Blount', lat: 35.550, lng: -83.860, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-panther-creek-blount', name: 'Panther Creek (Blount)', county: 'Blount', lat: 35.520, lng: -83.875, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-flatts-branch', name: 'Flatts Branch', county: 'Blount', lat: 35.620, lng: -83.760, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-tremont-creek-extra', name: 'Spruce Flats Branch', county: 'Blount', lat: 35.635, lng: -83.690, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-lynn-camp-prong', name: 'Lynn Camp Prong', county: 'Blount', lat: 35.610, lng: -83.665, cat: 'smokies-stream', region: 'Smokies', notes: 'Lynn Camp Prong — historic brook trout restoration stream, fishable after a decade-long C&R-only restoration period.' },
  { id: 'tn-smokies-head-thunderhead-headwaters', name: 'Thunderhead Mountain Headwaters', county: 'Blount', lat: 35.560, lng: -83.700, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-defeat-branch', name: 'Defeat Branch', county: 'Sevier', lat: 35.700, lng: -83.595, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-meigs-mountain-creek', name: 'Meigs Mountain Creek', county: 'Blount', lat: 35.600, lng: -83.705, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-spence-branch', name: 'Spence Branch', county: 'Blount', lat: 35.535, lng: -83.760, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-hannah-creek', name: 'Hannah Creek', county: 'Blount', lat: 35.525, lng: -83.800, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-deep-creek-blount', name: 'Deep Creek (Blount)', county: 'Blount', lat: 35.520, lng: -83.740, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-buckeye-branch', name: 'Buckeye Branch', county: 'Sevier', lat: 35.665, lng: -83.535, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-greenbrier-creek-east', name: 'Greenbrier Creek (East)', county: 'Sevier', lat: 35.705, lng: -83.385, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-rough-creek-supp', name: 'Rough Creek (Greenbrier)', county: 'Sevier', lat: 35.700, lng: -83.400, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-lost-creek-cosby', name: 'Lost Creek (Cosby)', county: 'Cocke', lat: 35.770, lng: -83.205, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-mt-cammerer-creek', name: 'Mt. Cammerer Creek', county: 'Cocke', lat: 35.770, lng: -83.115, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-pumpkin-patch-branch', name: 'Pumpkin Patch Branch', county: 'Sevier', lat: 35.660, lng: -83.430, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-twomile-branch', name: 'Twomile Branch', county: 'Sevier', lat: 35.685, lng: -83.510, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-cliff-branch', name: 'Cliff Branch', county: 'Sevier', lat: 35.690, lng: -83.470, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-grassy-branch-rough', name: 'Grassy Branch', county: 'Sevier', lat: 35.650, lng: -83.400, cat: 'smokies-stream', region: 'Smokies' },
  { id: 'tn-smokies-head-school-house-creek', name: 'School House Creek', county: 'Sevier', lat: 35.680, lng: -83.580, cat: 'smokies-stream', region: 'Smokies' },
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
      county: item.county, acres: null, maxDepthFt: null,
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
