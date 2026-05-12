// FL Vol 11 — Gulf Coast: Everglades + 10K Islands -> Naples -> Sanibel ->
// Boca Grande -> Sarasota -> Tampa Bay -> Nature Coast -> Big Bend ->
// Apalachicola -> Panama City -> Destin -> Pensacola.

const fs = require('fs');
const path = require('path');
const { buildFL } = require('./_fl-water-template.cjs');

const DATA_PATH = path.join(__dirname, '..', 'data', 'waterbodies.json');

const RAW = [
  // ============== EVERGLADES + 10,000 ISLANDS ==============
  { id: 'fl-gulf-chokoloskee', name: 'Chokoloskee', region: 'Everglades / 10K Islands', county: 'Collier', lat: 25.815, lng: -81.365, cat: 'fl-everglades', brackish: true, notes: 'Chokoloskee — primary 10K Islands launch town. Backcountry snook, redfish, tarpon, snapper.' },
  { id: 'fl-gulf-everglades-city', name: 'Everglades City', region: 'Everglades / 10K Islands', county: 'Collier', lat: 25.860, lng: -81.385, cat: 'fl-everglades', brackish: true },
  { id: 'fl-gulf-10000-islands-supp', name: '10,000 Islands — Inner Maze', region: 'Everglades / 10K Islands', county: 'Collier / Monroe', lat: 25.875, lng: -81.480, cat: 'fl-everglades', brackish: true },
  { id: 'fl-gulf-shark-river', name: 'Shark River + Slough (Everglades)', region: 'Everglades NP', county: 'Monroe', lat: 25.450, lng: -81.045, cat: 'fl-everglades', brackish: true },
  { id: 'fl-gulf-lostmans-river', name: 'Lostmans River (Everglades NP)', region: 'Everglades NP', county: 'Monroe', lat: 25.580, lng: -81.110, cat: 'fl-everglades', brackish: true },
  { id: 'fl-gulf-broad-river-everglades', name: 'Broad River (Everglades NP)', region: 'Everglades NP', county: 'Monroe', lat: 25.490, lng: -81.075, cat: 'fl-everglades', brackish: true },
  { id: 'fl-gulf-rodgers-river', name: 'Rodgers River', region: 'Everglades NP', county: 'Monroe', lat: 25.700, lng: -81.185, cat: 'fl-everglades', brackish: true },
  { id: 'fl-gulf-turner-river', name: 'Turner River', region: 'Everglades / 10K Islands', county: 'Collier', lat: 25.860, lng: -81.255, cat: 'fl-everglades', brackish: true },
  { id: 'fl-gulf-fakahatchee-bay', name: 'Fakahatchee Bay', region: 'Everglades / 10K Islands', county: 'Collier', lat: 25.900, lng: -81.435, cat: 'fl-coastal-bay', brackish: true },
  { id: 'fl-gulf-port-of-the-islands', name: 'Port of the Islands', region: 'Collier County', county: 'Collier', lat: 26.005, lng: -81.490, cat: 'fl-coastal-town' },

  // ============== NAPLES / MARCO ==============
  { id: 'fl-gulf-marco-island', name: 'Marco Island', region: 'SW FL Gulf', county: 'Collier', lat: 25.940, lng: -81.720, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-isles-of-capri', name: 'Isles of Capri', region: 'SW FL Gulf', county: 'Collier', lat: 25.985, lng: -81.730, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-rookery-bay', name: 'Rookery Bay', region: 'SW FL Gulf', county: 'Collier', lat: 26.035, lng: -81.720, cat: 'fl-coastal-bay', brackish: true },
  { id: 'fl-gulf-naples', name: 'Naples + Naples Bay', region: 'SW FL Gulf', county: 'Collier', lat: 26.140, lng: -81.795, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-naples-pier', name: 'Naples Pier', region: 'SW FL Gulf', county: 'Collier', lat: 26.130, lng: -81.810, cat: 'fl-coastal-pier-jetty' },
  { id: 'fl-gulf-vanderbilt-beach', name: 'Vanderbilt Beach', region: 'SW FL Gulf', county: 'Collier', lat: 26.250, lng: -81.825, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-wiggins-pass', name: 'Wiggins Pass + State Park', region: 'SW FL Gulf', county: 'Collier', lat: 26.280, lng: -81.830, cat: 'fl-coastal-pass', brackish: true },
  { id: 'fl-gulf-bonita-beach', name: 'Bonita Beach', region: 'SW FL Gulf', county: 'Lee', lat: 26.350, lng: -81.860, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-bonita-springs', name: 'Bonita Springs', region: 'SW FL Gulf', county: 'Lee', lat: 26.340, lng: -81.785, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-estero-bay', name: 'Estero Bay', region: 'SW FL Gulf', county: 'Lee', lat: 26.430, lng: -81.875, cat: 'fl-coastal-bay', brackish: true },
  { id: 'fl-gulf-fort-myers-beach', name: 'Fort Myers Beach', region: 'SW FL Gulf', county: 'Lee', lat: 26.450, lng: -81.950, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-fort-myers-beach-pier', name: 'Fort Myers Beach Pier', region: 'SW FL Gulf', county: 'Lee', lat: 26.450, lng: -81.965, cat: 'fl-coastal-pier-jetty' },
  { id: 'fl-gulf-sanibel-island', name: 'Sanibel Island', region: 'SW FL Gulf', county: 'Lee', lat: 26.450, lng: -82.060, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-sanibel-pier', name: 'Sanibel Fishing Pier (Lighthouse)', region: 'SW FL Gulf', county: 'Lee', lat: 26.450, lng: -82.020, cat: 'fl-coastal-pier-jetty' },
  { id: 'fl-gulf-captiva-island', name: 'Captiva Island', region: 'SW FL Gulf', county: 'Lee', lat: 26.520, lng: -82.190, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-redfish-pass', name: 'Redfish Pass', region: 'SW FL Gulf', county: 'Lee', lat: 26.560, lng: -82.225, cat: 'fl-coastal-pass', brackish: true },
  { id: 'fl-gulf-captiva-pass', name: 'Captiva Pass', region: 'SW FL Gulf', county: 'Lee', lat: 26.605, lng: -82.220, cat: 'fl-coastal-pass', brackish: true },
  { id: 'fl-gulf-cayo-costa', name: 'Cayo Costa Island', region: 'SW FL Gulf', county: 'Lee', lat: 26.685, lng: -82.245, cat: 'fl-coastal-town' },

  // ============== PINE ISLAND / CAPE CORAL ==============
  { id: 'fl-gulf-pine-island-sound-supp', name: 'Pine Island Sound — Specific Flats', region: 'SW FL Gulf', county: 'Lee', lat: 26.605, lng: -82.115, cat: 'fl-coastal-flat', brackish: true },
  { id: 'fl-gulf-st-james-city', name: 'St. James City (Pine Island)', region: 'SW FL Gulf', county: 'Lee', lat: 26.490, lng: -82.080, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-bokeelia', name: 'Bokeelia (Pine Island)', region: 'SW FL Gulf', county: 'Lee', lat: 26.700, lng: -82.155, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-matlacha', name: 'Matlacha (Pine Island)', region: 'SW FL Gulf', county: 'Lee', lat: 26.625, lng: -82.085, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-cape-coral', name: 'Cape Coral', region: 'SW FL Gulf', county: 'Lee', lat: 26.565, lng: -81.950, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-fort-myers', name: 'Fort Myers', region: 'SW FL Gulf', county: 'Lee', lat: 26.640, lng: -81.870, cat: 'fl-coastal-town' },

  // ============== CHARLOTTE HARBOR / BOCA GRANDE ==============
  { id: 'fl-gulf-charlotte-harbor-supp', name: 'Charlotte Harbor — Mid Bay', region: 'SW FL Gulf', county: 'Charlotte / Lee', lat: 26.760, lng: -82.130, cat: 'fl-coastal-bay', brackish: true, notes: 'Charlotte Harbor — vast estuary. Tarpon, snook, redfish, trout, jacks. Top FL inshore destination.' },
  { id: 'fl-gulf-punta-gorda', name: 'Punta Gorda', region: 'SW FL Gulf', county: 'Charlotte', lat: 26.930, lng: -82.045, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-port-charlotte', name: 'Port Charlotte', region: 'SW FL Gulf', county: 'Charlotte', lat: 26.985, lng: -82.110, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-pirate-harbor', name: 'Pirate Harbor', region: 'SW FL Gulf', county: 'Charlotte', lat: 26.815, lng: -82.085, cat: 'fl-coastal-bay', brackish: true },
  { id: 'fl-gulf-cape-haze', name: 'Cape Haze', region: 'SW FL Gulf', county: 'Charlotte', lat: 26.825, lng: -82.245, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-placida', name: 'Placida + Gasparilla Sound', region: 'SW FL Gulf', county: 'Charlotte', lat: 26.825, lng: -82.265, cat: 'fl-coastal-bay', brackish: true },
  { id: 'fl-gulf-gasparilla-island', name: 'Gasparilla Island + Boca Grande', region: 'SW FL Gulf', county: 'Charlotte / Lee', lat: 26.730, lng: -82.265, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-boca-grande-supp', name: 'Boca Grande Pass — South Jetty', region: 'SW FL Gulf', county: 'Charlotte / Lee', lat: 26.710, lng: -82.270, cat: 'fl-coastal-pass', brackish: true },
  { id: 'fl-gulf-boca-grande-pier', name: 'Gasparilla Island Pier', region: 'SW FL Gulf', county: 'Lee', lat: 26.720, lng: -82.262, cat: 'fl-coastal-pier-jetty' },
  { id: 'fl-gulf-don-pedro-island', name: 'Don Pedro Island', region: 'SW FL Gulf', county: 'Charlotte', lat: 26.870, lng: -82.305, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-stump-pass', name: 'Stump Pass', region: 'SW FL Gulf', county: 'Charlotte / Sarasota', lat: 26.890, lng: -82.330, cat: 'fl-coastal-pass', brackish: true },

  // ============== VENICE / SARASOTA ==============
  { id: 'fl-gulf-englewood', name: 'Englewood', region: 'SW FL Gulf', county: 'Sarasota / Charlotte', lat: 26.960, lng: -82.355, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-manasota-key', name: 'Manasota Key', region: 'SW FL Gulf', county: 'Sarasota / Charlotte', lat: 26.945, lng: -82.360, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-venice', name: 'Venice + Venice Pier', region: 'SW FL Gulf', county: 'Sarasota', lat: 27.100, lng: -82.450, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-venice-jetty', name: 'Venice Jetty (Venice Inlet)', region: 'SW FL Gulf', county: 'Sarasota', lat: 27.110, lng: -82.465, cat: 'fl-coastal-pass', brackish: true },
  { id: 'fl-gulf-nokomis', name: 'Nokomis Beach', region: 'SW FL Gulf', county: 'Sarasota', lat: 27.115, lng: -82.515, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-osprey', name: 'Osprey', region: 'SW FL Gulf', county: 'Sarasota', lat: 27.190, lng: -82.485, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-siesta-key', name: 'Siesta Key', region: 'SW FL Gulf', county: 'Sarasota', lat: 27.265, lng: -82.555, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-sarasota', name: 'Sarasota + Sarasota Bay', region: 'SW FL Gulf', county: 'Sarasota', lat: 27.335, lng: -82.540, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-sarasota-bay-supp', name: 'Sarasota Bay (mid)', region: 'SW FL Gulf', county: 'Sarasota', lat: 27.360, lng: -82.585, cat: 'fl-coastal-bay', brackish: true },
  { id: 'fl-gulf-new-pass', name: 'New Pass (Sarasota)', region: 'SW FL Gulf', county: 'Sarasota', lat: 27.330, lng: -82.585, cat: 'fl-coastal-pass', brackish: true },
  { id: 'fl-gulf-big-pass', name: 'Big Pass (Sarasota)', region: 'SW FL Gulf', county: 'Sarasota', lat: 27.295, lng: -82.580, cat: 'fl-coastal-pass', brackish: true },
  { id: 'fl-gulf-lido-key', name: 'Lido Key', region: 'SW FL Gulf', county: 'Sarasota', lat: 27.310, lng: -82.575, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-longboat-key', name: 'Longboat Key', region: 'SW FL Gulf', county: 'Manatee / Sarasota', lat: 27.380, lng: -82.625, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-anna-maria-island', name: 'Anna Maria Island', region: 'Tampa Bay area', county: 'Manatee', lat: 27.530, lng: -82.730, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-anna-maria-pier', name: 'Anna Maria City Pier', region: 'Tampa Bay area', county: 'Manatee', lat: 27.530, lng: -82.730, cat: 'fl-coastal-pier-jetty' },
  { id: 'fl-gulf-holmes-beach', name: 'Holmes Beach', region: 'Tampa Bay area', county: 'Manatee', lat: 27.500, lng: -82.715, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-bradenton-beach', name: 'Bradenton Beach', region: 'Tampa Bay area', county: 'Manatee', lat: 27.470, lng: -82.705, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-bradenton', name: 'Bradenton', region: 'Tampa Bay area', county: 'Manatee', lat: 27.500, lng: -82.575, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-palmetto', name: 'Palmetto', region: 'Tampa Bay area', county: 'Manatee', lat: 27.520, lng: -82.575, cat: 'fl-coastal-town' },

  // ============== TAMPA BAY AREA ==============
  { id: 'fl-gulf-tampa-bay-supp-1', name: 'Tampa Bay - Lower (Sunshine Skyway)', region: 'Tampa Bay area', county: 'Hillsborough / Pinellas / Manatee', lat: 27.620, lng: -82.660, cat: 'fl-coastal-bay', brackish: true },
  { id: 'fl-gulf-tampa-bay-supp-mid', name: 'Tampa Bay - Mid', region: 'Tampa Bay area', county: 'Hillsborough', lat: 27.760, lng: -82.510, cat: 'fl-coastal-bay', brackish: true },
  { id: 'fl-gulf-tampa-bay-supp-upper', name: 'Tampa Bay - Upper (Old Tampa Bay)', region: 'Tampa Bay area', county: 'Hillsborough / Pinellas', lat: 27.945, lng: -82.640, cat: 'fl-coastal-bay', brackish: true },
  { id: 'fl-gulf-skyway-pier-fishing', name: 'Sunshine Skyway Fishing Pier', region: 'Tampa Bay area', county: 'Pinellas / Manatee', lat: 27.620, lng: -82.660, cat: 'fl-coastal-pier-jetty', notes: 'Sunshine Skyway Pier — the iconic Tampa Bay structure. Tarpon, kings, cobia, mackerel, sharks, grouper.' },
  { id: 'fl-gulf-st-petersburg', name: 'St. Petersburg', region: 'Tampa Bay area', county: 'Pinellas', lat: 27.770, lng: -82.640, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-pinellas-point', name: 'Pinellas Point', region: 'Tampa Bay area', county: 'Pinellas', lat: 27.700, lng: -82.660, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-fort-de-soto', name: 'Fort De Soto Park + Pier', region: 'Tampa Bay area', county: 'Pinellas', lat: 27.620, lng: -82.730, cat: 'fl-coastal-pier-jetty' },
  { id: 'fl-gulf-tierra-verde', name: 'Tierra Verde', region: 'Tampa Bay area', county: 'Pinellas', lat: 27.685, lng: -82.720, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-pass-a-grille', name: 'Pass-a-Grille', region: 'Tampa Bay area', county: 'Pinellas', lat: 27.700, lng: -82.755, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-st-pete-beach', name: 'St. Pete Beach', region: 'Tampa Bay area', county: 'Pinellas', lat: 27.720, lng: -82.745, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-treasure-island', name: 'Treasure Island', region: 'Tampa Bay area', county: 'Pinellas', lat: 27.770, lng: -82.770, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-madeira-beach', name: 'Madeira Beach', region: 'Tampa Bay area', county: 'Pinellas', lat: 27.795, lng: -82.795, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-john-pass', name: 'John\'s Pass', region: 'Tampa Bay area', county: 'Pinellas', lat: 27.785, lng: -82.780, cat: 'fl-coastal-pass', brackish: true },
  { id: 'fl-gulf-redington-beach', name: 'Redington Beach', region: 'Tampa Bay area', county: 'Pinellas', lat: 27.820, lng: -82.830, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-indian-shores', name: 'Indian Shores', region: 'Tampa Bay area', county: 'Pinellas', lat: 27.860, lng: -82.840, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-indian-rocks-beach', name: 'Indian Rocks Beach', region: 'Tampa Bay area', county: 'Pinellas', lat: 27.880, lng: -82.850, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-belleair-beach', name: 'Belleair Beach', region: 'Tampa Bay area', county: 'Pinellas', lat: 27.920, lng: -82.840, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-sand-key', name: 'Sand Key (Clearwater)', region: 'Tampa Bay area', county: 'Pinellas', lat: 27.955, lng: -82.825, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-clearwater-beach', name: 'Clearwater Beach + Pier 60', region: 'Tampa Bay area', county: 'Pinellas', lat: 27.975, lng: -82.825, cat: 'fl-coastal-pier-jetty' },
  { id: 'fl-gulf-clearwater', name: 'Clearwater', region: 'Tampa Bay area', county: 'Pinellas', lat: 27.965, lng: -82.800, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-dunedin', name: 'Dunedin', region: 'Tampa Bay area', county: 'Pinellas', lat: 28.020, lng: -82.785, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-honeymoon-island', name: 'Honeymoon Island State Park', region: 'Tampa Bay area', county: 'Pinellas', lat: 28.075, lng: -82.825, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-caladesi-island', name: 'Caladesi Island', region: 'Tampa Bay area', county: 'Pinellas', lat: 28.045, lng: -82.830, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-palm-harbor', name: 'Palm Harbor', region: 'Tampa Bay area', county: 'Pinellas', lat: 28.085, lng: -82.760, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-tarpon-springs', name: 'Tarpon Springs (Sponge Docks)', region: 'Tampa Bay area', county: 'Pinellas', lat: 28.150, lng: -82.755, cat: 'fl-coastal-town', notes: 'Tarpon Springs — Greek sponge fishing town + tarpon-tailing Anclote River mouth.' },
  { id: 'fl-gulf-anclote-key', name: 'Anclote Key + Anclote River Mouth', region: 'Tampa Bay area', county: 'Pinellas / Pasco', lat: 28.180, lng: -82.860, cat: 'fl-coastal-pass', brackish: true },

  // ============== PASCO / NATURE COAST (north of Tampa) ==============
  { id: 'fl-gulf-tarpon-anclote', name: 'Anclote Anchorage (Tarpon Springs)', region: 'Nature Coast FL', county: 'Pinellas / Pasco', lat: 28.165, lng: -82.820, cat: 'fl-coastal-flat', brackish: true },
  { id: 'fl-gulf-hudson', name: 'Hudson + Hudson Beach', region: 'Nature Coast FL', county: 'Pasco', lat: 28.365, lng: -82.700, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-new-port-richey', name: 'New Port Richey', region: 'Nature Coast FL', county: 'Pasco', lat: 28.245, lng: -82.715, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-port-richey', name: 'Port Richey', region: 'Nature Coast FL', county: 'Pasco', lat: 28.275, lng: -82.730, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-aripeka-town', name: 'Aripeka', region: 'Nature Coast FL', county: 'Pasco / Hernando', lat: 28.435, lng: -82.660, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-hernando-beach', name: 'Hernando Beach', region: 'Nature Coast FL', county: 'Hernando', lat: 28.470, lng: -82.660, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-bayport', name: 'Bayport (Hernando)', region: 'Nature Coast FL', county: 'Hernando', lat: 28.535, lng: -82.660, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-homosassa-town', name: 'Homosassa', region: 'Nature Coast FL', county: 'Citrus', lat: 28.785, lng: -82.615, cat: 'fl-coastal-town', notes: 'Homosassa — legendary tarpon flats + spring-fed river. May tarpon migration draws elite anglers worldwide.' },
  { id: 'fl-gulf-homosassa-flats-supp', name: 'Homosassa Flats (Outer)', region: 'Nature Coast FL', county: 'Citrus', lat: 28.770, lng: -82.700, cat: 'fl-coastal-flat', brackish: true, notes: 'Homosassa outer flats — May-June tarpon migration legendary. Trophy fish; technical fly water.' },
  { id: 'fl-gulf-crystal-river-town', name: 'Crystal River', region: 'Nature Coast FL', county: 'Citrus', lat: 28.900, lng: -82.595, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-ozello', name: 'Ozello', region: 'Nature Coast FL', county: 'Citrus', lat: 28.835, lng: -82.660, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-yankeetown', name: 'Yankeetown', region: 'Nature Coast FL', county: 'Levy', lat: 29.030, lng: -82.720, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-cedar-key-supp', name: 'Cedar Key + Outer Flats', region: 'Nature Coast FL', county: 'Levy', lat: 29.140, lng: -83.040, cat: 'fl-coastal-town', notes: 'Cedar Key — Old Florida fishing village. Trout, reds, snook (north range edge), tarpon, mullet.' },
  { id: 'fl-gulf-suwannee-town', name: 'Suwannee', region: 'Nature Coast FL', county: 'Dixie', lat: 29.295, lng: -83.155, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-horseshoe-beach', name: 'Horseshoe Beach', region: 'Nature Coast FL', county: 'Dixie', lat: 29.435, lng: -83.290, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-steinhatchee-town', name: 'Steinhatchee', region: 'Big Bend FL', county: 'Taylor / Dixie', lat: 29.670, lng: -83.385, cat: 'fl-coastal-town', notes: 'Steinhatchee — Big Bend fishing village. Trout, redfish, snook (rare), scalloping in summer.' },
  { id: 'fl-gulf-keaton-beach', name: 'Keaton Beach', region: 'Big Bend FL', county: 'Taylor', lat: 29.820, lng: -83.595, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-dekle-beach', name: 'Dekle Beach', region: 'Big Bend FL', county: 'Taylor', lat: 29.860, lng: -83.625, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-cabbage-grove', name: 'Cabbage Grove', region: 'Big Bend FL', county: 'Taylor', lat: 29.985, lng: -83.760, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-econfina-town', name: 'Econfina (Taylor)', region: 'Big Bend FL', county: 'Taylor', lat: 30.040, lng: -83.875, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-st-marks-town', name: 'St. Marks', region: 'Big Bend FL', county: 'Wakulla', lat: 30.155, lng: -84.205, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-panacea', name: 'Panacea', region: 'Big Bend FL', county: 'Wakulla', lat: 30.030, lng: -84.395, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-spring-creek', name: 'Spring Creek (Wakulla)', region: 'Big Bend FL', county: 'Wakulla', lat: 30.080, lng: -84.330, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-shell-point', name: 'Shell Point (Wakulla)', region: 'Big Bend FL', county: 'Wakulla', lat: 30.060, lng: -84.290, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-sopchoppy-town', name: 'Sopchoppy', region: 'Big Bend FL', county: 'Wakulla', lat: 30.060, lng: -84.490, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-carrabelle', name: 'Carrabelle', region: 'Forgotten Coast FL', county: 'Franklin', lat: 29.855, lng: -84.665, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-lanark-village', name: 'Lanark Village', region: 'Forgotten Coast FL', county: 'Franklin', lat: 29.870, lng: -84.605, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-eastpoint', name: 'Eastpoint', region: 'Forgotten Coast FL', county: 'Franklin', lat: 29.745, lng: -84.875, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-apalachicola-town', name: 'Apalachicola', region: 'Forgotten Coast FL', county: 'Franklin', lat: 29.725, lng: -84.985, cat: 'fl-coastal-town', notes: 'Apalachicola — oyster capital + premier inshore + bay fishery. Redfish, trout, flounder, sheepshead.' },
  { id: 'fl-gulf-st-george-island', name: 'St. George Island', region: 'Forgotten Coast FL', county: 'Franklin', lat: 29.690, lng: -84.880, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-dog-island', name: 'Dog Island', region: 'Forgotten Coast FL', county: 'Franklin', lat: 29.795, lng: -84.580, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-indian-pass', name: 'Indian Pass', region: 'Forgotten Coast FL', county: 'Gulf', lat: 29.685, lng: -85.190, cat: 'fl-coastal-pass', brackish: true },
  { id: 'fl-gulf-st-vincent-island', name: 'St. Vincent Island NWR', region: 'Forgotten Coast FL', county: 'Gulf / Franklin', lat: 29.690, lng: -85.120, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-port-st-joe', name: 'Port St. Joe', region: 'Forgotten Coast FL', county: 'Gulf', lat: 29.815, lng: -85.305, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-st-joseph-bay-supp', name: 'St. Joseph Bay — Scallop Grounds', region: 'Forgotten Coast FL', county: 'Gulf', lat: 29.815, lng: -85.380, cat: 'fl-coastal-bay', brackish: true, notes: 'St. Joseph Bay — premier scalloping + redfish + trout + flounder. Pristine seagrass.' },
  { id: 'fl-gulf-cape-san-blas', name: 'Cape San Blas', region: 'Forgotten Coast FL', county: 'Gulf', lat: 29.685, lng: -85.355, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-mexico-beach', name: 'Mexico Beach', region: 'Forgotten Coast FL', county: 'Bay', lat: 29.945, lng: -85.420, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-tyndall-afb-beach', name: 'Tyndall AFB Beach + Crooked Island', region: 'Panhandle FL', county: 'Bay', lat: 30.060, lng: -85.605, cat: 'fl-coastal-flat', brackish: true },
  { id: 'fl-gulf-callaway', name: 'Callaway', region: 'Panhandle FL', county: 'Bay', lat: 30.150, lng: -85.570, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-parker', name: 'Parker', region: 'Panhandle FL', county: 'Bay', lat: 30.140, lng: -85.595, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-lynn-haven', name: 'Lynn Haven', region: 'Panhandle FL', county: 'Bay', lat: 30.245, lng: -85.650, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-panama-city', name: 'Panama City', region: 'Panhandle FL', county: 'Bay', lat: 30.165, lng: -85.660, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-panama-city-beach', name: 'Panama City Beach', region: 'Panhandle FL', county: 'Bay', lat: 30.170, lng: -85.805, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-pcb-pier', name: 'Panama City Beach Pier (Russell-Fields)', region: 'Panhandle FL', county: 'Bay', lat: 30.180, lng: -85.835, cat: 'fl-coastal-pier-jetty' },
  { id: 'fl-gulf-st-andrews-pass', name: 'St. Andrews Pass', region: 'Panhandle FL', county: 'Bay', lat: 30.115, lng: -85.735, cat: 'fl-coastal-pass', brackish: true },
  { id: 'fl-gulf-st-andrews-bay', name: 'St. Andrews Bay', region: 'Panhandle FL', county: 'Bay', lat: 30.190, lng: -85.720, cat: 'fl-coastal-bay', brackish: true },
  { id: 'fl-gulf-shell-island', name: 'Shell Island (Panama City)', region: 'Panhandle FL', county: 'Bay', lat: 30.130, lng: -85.770, cat: 'fl-coastal-flat', brackish: true },
  { id: 'fl-gulf-west-bay-pcb', name: 'West Bay (PCB)', region: 'Panhandle FL', county: 'Bay', lat: 30.305, lng: -85.815, cat: 'fl-coastal-bay', brackish: true },
  { id: 'fl-gulf-rosemary-beach', name: 'Rosemary Beach', region: 'Panhandle FL', county: 'Walton', lat: 30.275, lng: -86.040, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-inlet-beach-30a', name: 'Inlet Beach (30A)', region: 'Panhandle FL', county: 'Walton', lat: 30.275, lng: -86.005, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-alys-beach', name: 'Alys Beach (30A)', region: 'Panhandle FL', county: 'Walton', lat: 30.280, lng: -86.060, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-seacrest', name: 'Seacrest Beach (30A)', region: 'Panhandle FL', county: 'Walton', lat: 30.275, lng: -86.085, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-watersound', name: 'WaterSound (30A)', region: 'Panhandle FL', county: 'Walton', lat: 30.290, lng: -86.105, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-seagrove-beach', name: 'Seagrove Beach (30A)', region: 'Panhandle FL', county: 'Walton', lat: 30.305, lng: -86.150, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-watercolor-30a', name: 'WaterColor (30A)', region: 'Panhandle FL', county: 'Walton', lat: 30.320, lng: -86.155, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-seaside-30a', name: 'Seaside (30A)', region: 'Panhandle FL', county: 'Walton', lat: 30.320, lng: -86.170, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-grayton-beach', name: 'Grayton Beach', region: 'Panhandle FL', county: 'Walton', lat: 30.325, lng: -86.155, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-blue-mountain-beach', name: 'Blue Mountain Beach (30A)', region: 'Panhandle FL', county: 'Walton', lat: 30.345, lng: -86.205, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-santa-rosa-beach', name: 'Santa Rosa Beach (30A)', region: 'Panhandle FL', county: 'Walton', lat: 30.365, lng: -86.225, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-dune-allen-beach', name: 'Dune Allen Beach (30A)', region: 'Panhandle FL', county: 'Walton', lat: 30.355, lng: -86.265, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-miramar-beach', name: 'Miramar Beach', region: 'Panhandle FL', county: 'Walton', lat: 30.380, lng: -86.355, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-sandestin', name: 'Sandestin', region: 'Panhandle FL', county: 'Walton', lat: 30.385, lng: -86.305, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-destin-town', name: 'Destin', region: 'Panhandle FL', county: 'Okaloosa', lat: 30.395, lng: -86.495, cat: 'fl-coastal-town', notes: 'Destin — "World\'s Luckiest Fishing Village." Largest charter fleet in FL. Snapper, grouper, kingfish, mahi, marlin.' },
  { id: 'fl-gulf-destin-jetty', name: 'Destin East Pass Jetty', region: 'Panhandle FL', county: 'Okaloosa', lat: 30.385, lng: -86.515, cat: 'fl-coastal-pass', brackish: true },
  { id: 'fl-gulf-choctawhatchee-bay-supp', name: 'Choctawhatchee Bay - East', region: 'Panhandle FL', county: 'Walton', lat: 30.405, lng: -86.215, cat: 'fl-coastal-bay', brackish: true },
  { id: 'fl-gulf-niceville', name: 'Niceville', region: 'Panhandle FL', county: 'Okaloosa', lat: 30.510, lng: -86.480, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-valparaiso', name: 'Valparaiso', region: 'Panhandle FL', county: 'Okaloosa', lat: 30.510, lng: -86.500, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-shalimar', name: 'Shalimar', region: 'Panhandle FL', county: 'Okaloosa', lat: 30.450, lng: -86.580, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-fort-walton-beach', name: 'Fort Walton Beach', region: 'Panhandle FL', county: 'Okaloosa', lat: 30.410, lng: -86.615, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-okaloosa-island', name: 'Okaloosa Island + Pier', region: 'Panhandle FL', county: 'Okaloosa', lat: 30.395, lng: -86.605, cat: 'fl-coastal-pier-jetty' },
  { id: 'fl-gulf-navarre-beach', name: 'Navarre Beach + Pier', region: 'Panhandle FL', county: 'Santa Rosa', lat: 30.380, lng: -86.860, cat: 'fl-coastal-pier-jetty' },
  { id: 'fl-gulf-navarre', name: 'Navarre', region: 'Panhandle FL', county: 'Santa Rosa', lat: 30.405, lng: -86.860, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-gulf-breeze', name: 'Gulf Breeze', region: 'Panhandle FL', county: 'Santa Rosa', lat: 30.355, lng: -87.165, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-pensacola-beach', name: 'Pensacola Beach + Pier', region: 'Panhandle FL', county: 'Escambia', lat: 30.335, lng: -87.135, cat: 'fl-coastal-pier-jetty' },
  { id: 'fl-gulf-pensacola', name: 'Pensacola', region: 'Panhandle FL', county: 'Escambia', lat: 30.420, lng: -87.215, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-pensacola-pass', name: 'Pensacola Pass', region: 'Panhandle FL', county: 'Escambia', lat: 30.330, lng: -87.300, cat: 'fl-coastal-pass', brackish: true },
  { id: 'fl-gulf-perdido-key', name: 'Perdido Key', region: 'Panhandle FL', county: 'Escambia', lat: 30.290, lng: -87.430, cat: 'fl-coastal-town' },
  { id: 'fl-gulf-perdido-pass', name: 'Perdido Pass (FL side)', region: 'Panhandle FL', county: 'Escambia', lat: 30.295, lng: -87.560, cat: 'fl-coastal-pass', brackish: true },
];

function main() {
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  const existing = JSON.parse(raw);
  const byId = new Map(existing.map((e) => [e.id, e]));

  let appended = 0, skipped = 0;
  for (const item of RAW) {
    if (byId.has(item.id)) { skipped++; continue; }
    const entry = buildFL({
      id: item.id, name: item.name, region: item.region,
      county: item.county, acres: null, maxDepthFt: null,
      lat: item.lat, lng: item.lng, cat: item.cat, notes: item.notes,
      brackish: item.brackish,
    });
    existing.push(entry);
    byId.set(item.id, entry);
    appended++;
  }

  fs.writeFileSync(DATA_PATH, JSON.stringify(existing, null, 2) + '\n', 'utf8');
  const flTotal = existing.filter((e) => e.state === 'FL').length;
  console.log(`Appended ${appended}, skipped ${skipped}. FL total: ${flTotal}, Grand total: ${existing.length}`);
}

main();
