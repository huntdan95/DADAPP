// FL Vol 9 — Atlantic Coast: Amelia Island -> Miami / Biscayne Bay.
// Comprehensive coverage of coastal towns, inlets, passes, piers, lagoons,
// brackish rivers, and specific named saltwater fisheries.

const fs = require('fs');
const path = require('path');
const { buildFL } = require('./_fl-water-template.cjs');

const DATA_PATH = path.join(__dirname, '..', 'data', 'waterbodies.json');

const RAW = [
  // ============== NORTHEAST FL (Amelia Island -> St. Augustine) ==============
  { id: 'fl-coastal-amelia-island', name: 'Amelia Island (Fernandina Beach)', region: 'NE FL Coast', county: 'Nassau', lat: 30.670, lng: -81.450, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-fort-clinch', name: 'Fort Clinch State Park', region: 'NE FL Coast', county: 'Nassau', lat: 30.715, lng: -81.435, cat: 'fl-coastal-pier-jetty' },
  { id: 'fl-coastal-amelia-river', name: 'Amelia River + St. Marys Sound', region: 'NE FL Coast', county: 'Nassau', lat: 30.625, lng: -81.480, cat: 'fl-coastal-bay', brackish: true },
  { id: 'fl-coastal-nassau-sound', name: 'Nassau Sound', region: 'NE FL Coast', county: 'Nassau / Duval', lat: 30.510, lng: -81.420, cat: 'fl-coastal-bay', brackish: true },
  { id: 'fl-coastal-talbot-island', name: 'Big Talbot Island + Little Talbot Island', region: 'NE FL Coast', county: 'Duval', lat: 30.475, lng: -81.415, cat: 'fl-coastal-flat', brackish: true },
  { id: 'fl-coastal-fort-george-island', name: 'Fort George Island + River', region: 'NE FL Coast', county: 'Duval', lat: 30.440, lng: -81.430, cat: 'fl-coastal-bay', brackish: true },
  { id: 'fl-coastal-mayport', name: 'Mayport (St. Johns Mouth)', region: 'NE FL Coast', county: 'Duval', lat: 30.395, lng: -81.395, cat: 'fl-coastal-pass', brackish: true, notes: 'Mayport jetties — St. Johns River mouth. Bull redfish + tarpon + sharks + flounder + mangrove snapper. Jetty fishing classic.' },
  { id: 'fl-coastal-atlantic-beach', name: 'Atlantic Beach', region: 'NE FL Coast', county: 'Duval', lat: 30.335, lng: -81.400, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-neptune-beach', name: 'Neptune Beach', region: 'NE FL Coast', county: 'Duval', lat: 30.315, lng: -81.395, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-jacksonville-beach', name: 'Jacksonville Beach', region: 'NE FL Coast', county: 'Duval', lat: 30.295, lng: -81.395, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-jacksonville-pier', name: 'Jacksonville Beach Pier', region: 'NE FL Coast', county: 'Duval', lat: 30.295, lng: -81.390, cat: 'fl-coastal-pier-jetty' },
  { id: 'fl-coastal-ponte-vedra', name: 'Ponte Vedra Beach', region: 'NE FL Coast', county: 'St. Johns', lat: 30.240, lng: -81.385, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-vilano-beach', name: 'Vilano Beach', region: 'NE FL Coast', county: 'St. Johns', lat: 29.940, lng: -81.300, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-st-augustine', name: 'St. Augustine', region: 'NE FL Coast', county: 'St. Johns', lat: 29.890, lng: -81.315, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-st-augustine-inlet', name: 'St. Augustine Inlet', region: 'NE FL Coast', county: 'St. Johns', lat: 29.910, lng: -81.290, cat: 'fl-coastal-pass', brackish: true, notes: 'St. Augustine Inlet — bull redfish, tarpon, sharks, mangrove snapper, flounder. Jetty + pass fishery.' },
  { id: 'fl-coastal-anastasia-island', name: 'Anastasia Island Beaches', region: 'NE FL Coast', county: 'St. Johns', lat: 29.860, lng: -81.275, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-crescent-beach-fl', name: 'Crescent Beach (St. Johns)', region: 'NE FL Coast', county: 'St. Johns', lat: 29.770, lng: -81.255, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-marineland', name: 'Marineland', region: 'NE FL Coast', county: 'Flagler / St. Johns', lat: 29.665, lng: -81.215, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-matanzas-inlet', name: 'Matanzas Inlet', region: 'NE FL Coast', county: 'St. Johns', lat: 29.715, lng: -81.225, cat: 'fl-coastal-pass', brackish: true, notes: 'Matanzas Inlet — classic surf + jetty + estuary fishery. Redfish, trout, flounder, sharks.' },
  { id: 'fl-coastal-flagler-beach', name: 'Flagler Beach', region: 'NE FL Coast', county: 'Flagler', lat: 29.480, lng: -81.130, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-flagler-beach-pier', name: 'Flagler Beach Pier', region: 'NE FL Coast', county: 'Flagler', lat: 29.480, lng: -81.125, cat: 'fl-coastal-pier-jetty' },
  { id: 'fl-coastal-ormond-beach', name: 'Ormond Beach', region: 'East-Central FL', county: 'Volusia', lat: 29.285, lng: -81.060, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-daytona-beach', name: 'Daytona Beach', region: 'East-Central FL', county: 'Volusia', lat: 29.215, lng: -81.025, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-daytona-beach-pier', name: 'Daytona Beach Pier (Main Street)', region: 'East-Central FL', county: 'Volusia', lat: 29.225, lng: -81.025, cat: 'fl-coastal-pier-jetty' },
  { id: 'fl-coastal-daytona-beach-shores', name: 'Daytona Beach Shores + Sunglow Pier', region: 'East-Central FL', county: 'Volusia', lat: 29.165, lng: -81.000, cat: 'fl-coastal-pier-jetty' },
  { id: 'fl-coastal-port-orange', name: 'Port Orange', region: 'East-Central FL', county: 'Volusia', lat: 29.140, lng: -81.005, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-ponce-inlet', name: 'Ponce Inlet + Lighthouse Point Park', region: 'East-Central FL', county: 'Volusia', lat: 29.075, lng: -80.925, cat: 'fl-coastal-pass', brackish: true, notes: 'Ponce Inlet — major bull redfish + tarpon + shark + flounder + mangrove snapper destination. Jetty + pass fishery.' },
  { id: 'fl-coastal-new-smyrna-beach', name: 'New Smyrna Beach', region: 'East-Central FL', county: 'Volusia', lat: 29.025, lng: -80.910, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-edgewater-fl', name: 'Edgewater', region: 'East-Central FL', county: 'Volusia', lat: 28.985, lng: -80.900, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-oak-hill-fl', name: 'Oak Hill', region: 'East-Central FL', county: 'Volusia', lat: 28.870, lng: -80.855, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-titusville', name: 'Titusville (Mosquito Lagoon / IRL access)', region: 'East-Central FL', county: 'Brevard', lat: 28.610, lng: -80.815, cat: 'fl-coastal-town', notes: 'Titusville — primary launch town for Mosquito Lagoon + IRL north end. World-class redfish.' },
  { id: 'fl-coastal-port-canaveral', name: 'Port Canaveral + Jetty Park', region: 'East-Central FL', county: 'Brevard', lat: 28.405, lng: -80.610, cat: 'fl-coastal-pass', brackish: true, notes: 'Port Canaveral Jetty + lock — major Atlantic pass. Bull redfish, tarpon, sharks, mangrove snapper.' },
  { id: 'fl-coastal-cape-canaveral', name: 'Cape Canaveral', region: 'East-Central FL', county: 'Brevard', lat: 28.395, lng: -80.620, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-cocoa-beach', name: 'Cocoa Beach', region: 'East-Central FL', county: 'Brevard', lat: 28.320, lng: -80.610, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-cocoa-beach-pier', name: 'Cocoa Beach Pier', region: 'East-Central FL', county: 'Brevard', lat: 28.330, lng: -80.610, cat: 'fl-coastal-pier-jetty' },
  { id: 'fl-coastal-merritt-island', name: 'Merritt Island + Refuge', region: 'East-Central FL', county: 'Brevard', lat: 28.520, lng: -80.660, cat: 'fl-coastal-flat', brackish: true },
  { id: 'fl-coastal-patrick-afb', name: 'Patrick Space Force Base Area', region: 'East-Central FL', county: 'Brevard', lat: 28.235, lng: -80.605, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-satellite-beach', name: 'Satellite Beach', region: 'East-Central FL', county: 'Brevard', lat: 28.175, lng: -80.595, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-indialantic', name: 'Indialantic', region: 'East-Central FL', county: 'Brevard', lat: 28.085, lng: -80.565, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-melbourne-beach', name: 'Melbourne Beach', region: 'East-Central FL', county: 'Brevard', lat: 28.065, lng: -80.560, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-melbourne', name: 'Melbourne (IRL access)', region: 'East-Central FL', county: 'Brevard', lat: 28.085, lng: -80.605, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-sebastian', name: 'Sebastian + Sebastian Inlet area', region: 'East-Central FL', county: 'Indian River / Brevard', lat: 27.815, lng: -80.470, cat: 'fl-coastal-pass', brackish: true, notes: 'Sebastian Inlet — legendary FL pass. Snook spawn (closed-season aware), tarpon, redfish, mangrove snapper, sharks. North + south jetties.' },
  { id: 'fl-coastal-vero-beach', name: 'Vero Beach', region: 'Treasure Coast FL', county: 'Indian River', lat: 27.635, lng: -80.395, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-fort-pierce', name: 'Fort Pierce + Inlet', region: 'Treasure Coast FL', county: 'St. Lucie', lat: 27.470, lng: -80.300, cat: 'fl-coastal-pass', brackish: true, notes: 'Fort Pierce Inlet — bull redfish, tarpon, jacks, sharks, mangrove snapper. Jetty + inlet fishery.' },
  { id: 'fl-coastal-jensen-beach', name: 'Jensen Beach', region: 'Treasure Coast FL', county: 'Martin', lat: 27.250, lng: -80.225, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-stuart', name: 'Stuart (St. Lucie / Indian River)', region: 'Treasure Coast FL', county: 'Martin', lat: 27.195, lng: -80.255, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-stuart-st-lucie-inlet', name: 'St. Lucie Inlet', region: 'Treasure Coast FL', county: 'Martin', lat: 27.170, lng: -80.150, cat: 'fl-coastal-pass', brackish: true },
  { id: 'fl-coastal-hobe-sound', name: 'Hobe Sound', region: 'Treasure Coast FL', county: 'Martin', lat: 27.060, lng: -80.135, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-jupiter', name: 'Jupiter + Inlet', region: 'SE FL', county: 'Palm Beach', lat: 26.945, lng: -80.075, cat: 'fl-coastal-pass', brackish: true, notes: 'Jupiter Inlet — Loxahatchee River mouth. Tarpon, snook, bull redfish, sharks. Premier inshore + nearshore.' },
  { id: 'fl-coastal-juno-beach', name: 'Juno Beach + Pier', region: 'SE FL', county: 'Palm Beach', lat: 26.870, lng: -80.060, cat: 'fl-coastal-pier-jetty' },
  { id: 'fl-coastal-singer-island', name: 'Singer Island / Riviera Beach', region: 'SE FL', county: 'Palm Beach', lat: 26.785, lng: -80.040, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-palm-beach-inlet', name: 'Palm Beach Inlet (Lake Worth Inlet)', region: 'SE FL', county: 'Palm Beach', lat: 26.770, lng: -80.040, cat: 'fl-coastal-pass', brackish: true, notes: 'Palm Beach Inlet — bluewater access. Snook, tarpon, sailfish nearshore, kingfish.' },
  { id: 'fl-coastal-west-palm-beach', name: 'West Palm Beach + Lake Worth Lagoon', region: 'SE FL', county: 'Palm Beach', lat: 26.715, lng: -80.055, cat: 'fl-coastal-bay', brackish: true },
  { id: 'fl-coastal-palm-beach', name: 'Palm Beach Island', region: 'SE FL', county: 'Palm Beach', lat: 26.705, lng: -80.040, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-lake-worth-beach', name: 'Lake Worth Beach + Pier', region: 'SE FL', county: 'Palm Beach', lat: 26.615, lng: -80.040, cat: 'fl-coastal-pier-jetty' },
  { id: 'fl-coastal-lantana', name: 'Lantana', region: 'SE FL', county: 'Palm Beach', lat: 26.585, lng: -80.045, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-boynton-beach', name: 'Boynton Beach + Inlet', region: 'SE FL', county: 'Palm Beach', lat: 26.525, lng: -80.045, cat: 'fl-coastal-pass', brackish: true, notes: 'Boynton Inlet — small but productive pass. Snook + tarpon + reds + sharks.' },
  { id: 'fl-coastal-delray-beach', name: 'Delray Beach', region: 'SE FL', county: 'Palm Beach', lat: 26.460, lng: -80.070, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-boca-raton', name: 'Boca Raton + Inlet', region: 'SE FL', county: 'Palm Beach', lat: 26.345, lng: -80.075, cat: 'fl-coastal-pass', brackish: true },
  { id: 'fl-coastal-deerfield-beach', name: 'Deerfield Beach + Pier', region: 'SE FL', county: 'Broward', lat: 26.320, lng: -80.080, cat: 'fl-coastal-pier-jetty' },
  { id: 'fl-coastal-pompano-beach', name: 'Pompano Beach + Pier', region: 'SE FL', county: 'Broward', lat: 26.235, lng: -80.090, cat: 'fl-coastal-pier-jetty' },
  { id: 'fl-coastal-lauderdale-by-the-sea', name: 'Lauderdale-by-the-Sea', region: 'SE FL', county: 'Broward', lat: 26.190, lng: -80.095, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-fort-lauderdale', name: 'Fort Lauderdale + Port Everglades', region: 'SE FL', county: 'Broward', lat: 26.115, lng: -80.135, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-port-everglades', name: 'Port Everglades Inlet', region: 'SE FL', county: 'Broward', lat: 26.085, lng: -80.110, cat: 'fl-coastal-pass', brackish: true },
  { id: 'fl-coastal-dania-beach', name: 'Dania Beach + Pier', region: 'SE FL', county: 'Broward', lat: 26.050, lng: -80.115, cat: 'fl-coastal-pier-jetty' },
  { id: 'fl-coastal-hollywood-fl', name: 'Hollywood + Pier', region: 'SE FL', county: 'Broward', lat: 26.020, lng: -80.115, cat: 'fl-coastal-pier-jetty' },
  { id: 'fl-coastal-hallandale-beach', name: 'Hallandale Beach', region: 'SE FL', county: 'Broward', lat: 25.980, lng: -80.120, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-aventura', name: 'Aventura', region: 'SE FL', county: 'Miami-Dade', lat: 25.955, lng: -80.135, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-sunny-isles-beach', name: 'Sunny Isles Beach + Newport Pier', region: 'SE FL', county: 'Miami-Dade', lat: 25.945, lng: -80.125, cat: 'fl-coastal-pier-jetty' },
  { id: 'fl-coastal-bal-harbour', name: 'Bal Harbour', region: 'SE FL', county: 'Miami-Dade', lat: 25.890, lng: -80.125, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-haulover-inlet', name: 'Haulover Inlet + Park', region: 'SE FL', county: 'Miami-Dade', lat: 25.905, lng: -80.120, cat: 'fl-coastal-pass', brackish: true, notes: 'Haulover Inlet — bluewater access + jetty fishery. Tarpon, snook, kings, sailfish nearshore.' },
  { id: 'fl-coastal-surfside', name: 'Surfside', region: 'SE FL', county: 'Miami-Dade', lat: 25.880, lng: -80.125, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-miami-beach', name: 'Miami Beach', region: 'SE FL', county: 'Miami-Dade', lat: 25.795, lng: -80.135, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-south-beach', name: 'South Beach (Government Cut)', region: 'SE FL', county: 'Miami-Dade', lat: 25.770, lng: -80.130, cat: 'fl-coastal-town' },
  { id: 'fl-coastal-government-cut', name: 'Government Cut (Miami)', region: 'SE FL', county: 'Miami-Dade', lat: 25.765, lng: -80.130, cat: 'fl-coastal-pass', brackish: true, notes: 'Government Cut — main Miami port inlet. Tarpon, kings, sails, sharks. Major pass.' },
  { id: 'fl-coastal-key-biscayne', name: 'Key Biscayne + Bear Cut', region: 'SE FL', county: 'Miami-Dade', lat: 25.690, lng: -80.165, cat: 'fl-coastal-flat', brackish: true },
  { id: 'fl-coastal-virginia-key', name: 'Virginia Key + Rickenbacker Causeway', region: 'SE FL', county: 'Miami-Dade', lat: 25.735, lng: -80.165, cat: 'fl-coastal-flat', brackish: true },
  { id: 'fl-coastal-biscayne-bay-supp', name: 'Biscayne Bay - Coconut Grove area', region: 'SE FL', county: 'Miami-Dade', lat: 25.720, lng: -80.235, cat: 'fl-coastal-bay', brackish: true },
  { id: 'fl-coastal-biscayne-bay-south', name: 'Biscayne Bay - South (Boca Chita)', region: 'SE FL', county: 'Miami-Dade', lat: 25.530, lng: -80.180, cat: 'fl-coastal-bay', brackish: true },
  { id: 'fl-coastal-elliott-key', name: 'Elliott Key', region: 'SE FL', county: 'Miami-Dade', lat: 25.450, lng: -80.205, cat: 'fl-coastal-flat', brackish: true },
  { id: 'fl-coastal-broad-creek', name: 'Broad Creek (Biscayne)', region: 'SE FL', county: 'Miami-Dade', lat: 25.430, lng: -80.190, cat: 'fl-coastal-flat', brackish: true },
  { id: 'fl-coastal-cape-florida', name: 'Cape Florida State Park', region: 'SE FL', county: 'Miami-Dade', lat: 25.670, lng: -80.155, cat: 'fl-coastal-pier-jetty' },
  { id: 'fl-coastal-stiltsville', name: 'Stiltsville (Biscayne National Park)', region: 'SE FL', county: 'Miami-Dade', lat: 25.630, lng: -80.175, cat: 'fl-coastal-flat', brackish: true },

  // ============== INDIAN RIVER LAGOON (additional named sections) ==============
  { id: 'fl-coastal-irl-north', name: 'Indian River Lagoon - North (Edgewater area)', region: 'East-Central FL', county: 'Volusia', lat: 28.870, lng: -80.880, cat: 'fl-coastal-bay', brackish: true },
  { id: 'fl-coastal-irl-titusville', name: 'Indian River Lagoon - Titusville area', region: 'East-Central FL', county: 'Brevard', lat: 28.580, lng: -80.800, cat: 'fl-coastal-bay', brackish: true },
  { id: 'fl-coastal-irl-cocoa', name: 'Indian River Lagoon - Cocoa area', region: 'East-Central FL', county: 'Brevard', lat: 28.345, lng: -80.730, cat: 'fl-coastal-bay', brackish: true },
  { id: 'fl-coastal-irl-melbourne', name: 'Indian River Lagoon - Melbourne area', region: 'East-Central FL', county: 'Brevard', lat: 28.085, lng: -80.625, cat: 'fl-coastal-bay', brackish: true },
  { id: 'fl-coastal-irl-sebastian', name: 'Indian River Lagoon - Sebastian area', region: 'East-Central FL', county: 'Indian River / Brevard', lat: 27.815, lng: -80.500, cat: 'fl-coastal-bay', brackish: true },
  { id: 'fl-coastal-irl-vero', name: 'Indian River Lagoon - Vero Beach area', region: 'Treasure Coast FL', county: 'Indian River', lat: 27.635, lng: -80.395, cat: 'fl-coastal-bay', brackish: true },
  { id: 'fl-coastal-irl-fort-pierce', name: 'Indian River Lagoon - Fort Pierce area', region: 'Treasure Coast FL', county: 'St. Lucie', lat: 27.450, lng: -80.310, cat: 'fl-coastal-bay', brackish: true },
  { id: 'fl-coastal-banana-river-supp', name: 'Banana River - Cape Canaveral No-Motor Zone', region: 'East-Central FL', county: 'Brevard', lat: 28.530, lng: -80.660, cat: 'fl-coastal-flat', brackish: true, notes: 'Banana River No-Motor Zone — paddle/pole only. Pristine flats for tarpon, redfish, snook, trout.' },

  // ============== LOXAHATCHEE / EVERGLADES NORTH ==============
  { id: 'fl-coastal-loxahatchee-lower', name: 'Loxahatchee River - Lower (Brackish)', region: 'SE FL', county: 'Palm Beach / Martin', lat: 26.950, lng: -80.105, cat: 'fl-river-tidal-spring', brackish: true },
  { id: 'fl-coastal-jupiter-narrows', name: 'Jupiter Narrows', region: 'SE FL', county: 'Martin / Palm Beach', lat: 27.020, lng: -80.115, cat: 'fl-coastal-bay', brackish: true },

  // ============== ADDITIONAL NAMED ATLANTIC PIERS/STRUCTURES ==============
  { id: 'fl-pier-anastasia-state-park', name: 'Anastasia State Park Beach', region: 'NE FL Coast', county: 'St. Johns', lat: 29.875, lng: -81.270, cat: 'fl-coastal-pier-jetty' },
  { id: 'fl-pier-fort-matanzas-jetty', name: 'Fort Matanzas Jetty', region: 'NE FL Coast', county: 'St. Johns', lat: 29.715, lng: -81.235, cat: 'fl-coastal-pier-jetty' },
  { id: 'fl-pier-ormond-beach-fishing', name: 'Ormond Beach Pier', region: 'East-Central FL', county: 'Volusia', lat: 29.295, lng: -81.045, cat: 'fl-coastal-pier-jetty' },
  { id: 'fl-pier-melbourne-causeway', name: 'Melbourne Causeway', region: 'East-Central FL', county: 'Brevard', lat: 28.085, lng: -80.605, cat: 'fl-coastal-pier-jetty' },
  { id: 'fl-pier-sebastian-jetty-north', name: 'Sebastian Inlet North Jetty Pier', region: 'East-Central FL', county: 'Brevard', lat: 27.820, lng: -80.450, cat: 'fl-coastal-pier-jetty' },
  { id: 'fl-pier-sebastian-jetty-south', name: 'Sebastian Inlet South Jetty', region: 'East-Central FL', county: 'Indian River', lat: 27.810, lng: -80.450, cat: 'fl-coastal-pier-jetty' },
  { id: 'fl-pier-fort-pierce-jetty', name: 'Fort Pierce North + South Jetty', region: 'Treasure Coast FL', county: 'St. Lucie', lat: 27.475, lng: -80.290, cat: 'fl-coastal-pier-jetty' },
  { id: 'fl-pier-juno-pier-supp', name: 'Juno Beach Pier (supp)', region: 'SE FL', county: 'Palm Beach', lat: 26.880, lng: -80.058, cat: 'fl-coastal-pier-jetty' },
  { id: 'fl-pier-pompano-beach-pier', name: 'Pompano Beach Pier (supp)', region: 'SE FL', county: 'Broward', lat: 26.240, lng: -80.090, cat: 'fl-coastal-pier-jetty' },
  { id: 'fl-pier-anglins-pier', name: 'Anglin\'s Pier (Lauderdale-by-the-Sea)', region: 'SE FL', county: 'Broward', lat: 26.190, lng: -80.097, cat: 'fl-coastal-pier-jetty' },
  { id: 'fl-pier-dania-beach-pier', name: 'Dania Beach Pier (supp)', region: 'SE FL', county: 'Broward', lat: 26.060, lng: -80.115, cat: 'fl-coastal-pier-jetty' },
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
