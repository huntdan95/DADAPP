// FL Vol 10 — Florida Keys: Key Largo through Dry Tortugas.
// Every Keys town/island with a fishery plus specific named flats, channels,
// reefs, and offshore spots.

const fs = require('fs');
const path = require('path');
const { buildFL } = require('./_fl-water-template.cjs');

const DATA_PATH = path.join(__dirname, '..', 'data', 'waterbodies.json');

const RAW = [
  // ============== UPPER KEYS ==============
  { id: 'fl-keys-key-largo', name: 'Key Largo', region: 'Florida Keys', county: 'Monroe', lat: 25.090, lng: -80.450, cat: 'fl-coastal-town' },
  { id: 'fl-keys-key-largo-flats', name: 'Key Largo Backcountry Flats', region: 'Florida Keys', county: 'Monroe', lat: 25.100, lng: -80.490, cat: 'fl-keys-flat' },
  { id: 'fl-keys-key-largo-reef', name: 'Key Largo Reef + Molasses Reef', region: 'Florida Keys', county: 'Monroe', lat: 25.020, lng: -80.380, cat: 'fl-keys-reef', notes: 'John Pennekamp Coral Reef SP — premier Keys reef + dive site. Yellowtail, mangrove, mutton, grouper, hogfish.' },
  { id: 'fl-keys-key-largo-offshore', name: 'Key Largo Offshore (Gulf Stream)', region: 'Florida Keys', county: 'Monroe', lat: 25.010, lng: -80.150, cat: 'fl-keys-offshore' },
  { id: 'fl-keys-tavernier', name: 'Tavernier', region: 'Florida Keys', county: 'Monroe', lat: 25.000, lng: -80.510, cat: 'fl-coastal-town' },
  { id: 'fl-keys-plantation-key', name: 'Plantation Key', region: 'Florida Keys', county: 'Monroe', lat: 24.970, lng: -80.540, cat: 'fl-coastal-town' },
  { id: 'fl-keys-islamorada', name: 'Islamorada (Village of Islands)', region: 'Florida Keys', county: 'Monroe', lat: 24.920, lng: -80.625, cat: 'fl-coastal-town', notes: '"Sport Fishing Capital of the World" — Islamorada. Bonefish + permit + tarpon + sailfish + mahi. Whale Harbor + Bud n\' Mary\'s charter hubs.' },
  { id: 'fl-keys-islamorada-flats-supp', name: 'Islamorada Flats — Backcountry', region: 'Florida Keys', county: 'Monroe', lat: 24.945, lng: -80.660, cat: 'fl-keys-flat' },
  { id: 'fl-keys-islamorada-bay-side', name: 'Islamorada Florida Bay Side', region: 'Florida Keys', county: 'Monroe', lat: 24.960, lng: -80.680, cat: 'fl-keys-flat', brackish: true },
  { id: 'fl-keys-channel-2', name: 'Channel #2 (Lower Matecumbe)', region: 'Florida Keys', county: 'Monroe', lat: 24.875, lng: -80.665, cat: 'fl-coastal-pass', brackish: true },
  { id: 'fl-keys-channel-5', name: 'Channel #5 (Long Key)', region: 'Florida Keys', county: 'Monroe', lat: 24.825, lng: -80.770, cat: 'fl-coastal-pass', brackish: true },
  { id: 'fl-keys-tea-table-channel', name: 'Tea Table Channel', region: 'Florida Keys', county: 'Monroe', lat: 24.910, lng: -80.650, cat: 'fl-coastal-pass', brackish: true },
  { id: 'fl-keys-snake-creek', name: 'Snake Creek', region: 'Florida Keys', county: 'Monroe', lat: 24.955, lng: -80.580, cat: 'fl-coastal-pass', brackish: true },
  { id: 'fl-keys-whale-harbor-channel', name: 'Whale Harbor Channel', region: 'Florida Keys', county: 'Monroe', lat: 24.930, lng: -80.605, cat: 'fl-coastal-pass', brackish: true },
  { id: 'fl-keys-windley-key', name: 'Windley Key', region: 'Florida Keys', county: 'Monroe', lat: 24.945, lng: -80.595, cat: 'fl-coastal-town' },
  { id: 'fl-keys-upper-matecumbe', name: 'Upper Matecumbe Key', region: 'Florida Keys', county: 'Monroe', lat: 24.910, lng: -80.640, cat: 'fl-coastal-town' },
  { id: 'fl-keys-lower-matecumbe', name: 'Lower Matecumbe Key', region: 'Florida Keys', county: 'Monroe', lat: 24.860, lng: -80.700, cat: 'fl-coastal-town' },
  { id: 'fl-keys-islamorada-reef', name: 'Islamorada Reef (Alligator Reef)', region: 'Florida Keys', county: 'Monroe', lat: 24.850, lng: -80.620, cat: 'fl-keys-reef' },
  { id: 'fl-keys-islamorada-humps', name: 'Islamorada Humps (Offshore Deep)', region: 'Florida Keys', county: 'Monroe', lat: 24.770, lng: -80.555, cat: 'fl-keys-offshore', notes: 'The Islamorada Humps — deep-water humps holding tuna, wahoo, kings, marlin.' },

  // ============== MIDDLE KEYS ==============
  { id: 'fl-keys-long-key', name: 'Long Key + State Park', region: 'Florida Keys', county: 'Monroe', lat: 24.815, lng: -80.815, cat: 'fl-coastal-town' },
  { id: 'fl-keys-conch-key', name: 'Conch Key', region: 'Florida Keys', county: 'Monroe', lat: 24.785, lng: -80.910, cat: 'fl-coastal-town' },
  { id: 'fl-keys-duck-key', name: 'Duck Key', region: 'Florida Keys', county: 'Monroe', lat: 24.760, lng: -80.910, cat: 'fl-coastal-town' },
  { id: 'fl-keys-grassy-key', name: 'Grassy Key', region: 'Florida Keys', county: 'Monroe', lat: 24.770, lng: -80.945, cat: 'fl-coastal-town' },
  { id: 'fl-keys-marathon', name: 'Marathon', region: 'Florida Keys', county: 'Monroe', lat: 24.715, lng: -81.090, cat: 'fl-coastal-town' },
  { id: 'fl-keys-marathon-flats-supp', name: 'Marathon Backcountry Flats', region: 'Florida Keys', county: 'Monroe', lat: 24.730, lng: -81.105, cat: 'fl-keys-flat' },
  { id: 'fl-keys-marathon-reef', name: 'Marathon Reef (Sombrero Reef)', region: 'Florida Keys', county: 'Monroe', lat: 24.625, lng: -81.110, cat: 'fl-keys-reef' },
  { id: 'fl-keys-7-mile-bridge', name: '7 Mile Bridge', region: 'Florida Keys', county: 'Monroe', lat: 24.700, lng: -81.160, cat: 'fl-coastal-pass', brackish: true, notes: '7 Mile Bridge — legendary tarpon migration corridor + structure. Also snapper + grouper + sharks.' },
  { id: 'fl-keys-vaca-cut', name: 'Vaca Cut', region: 'Florida Keys', county: 'Monroe', lat: 24.720, lng: -81.045, cat: 'fl-coastal-pass', brackish: true },
  { id: 'fl-keys-toms-harbor-cut', name: 'Toms Harbor Cut', region: 'Florida Keys', county: 'Monroe', lat: 24.770, lng: -80.925, cat: 'fl-coastal-pass', brackish: true },
  { id: 'fl-keys-key-colony-beach', name: 'Key Colony Beach', region: 'Florida Keys', county: 'Monroe', lat: 24.720, lng: -81.020, cat: 'fl-coastal-town' },
  { id: 'fl-keys-marathon-offshore', name: 'Marathon Offshore (Marathon Hump)', region: 'Florida Keys', county: 'Monroe', lat: 24.560, lng: -81.140, cat: 'fl-keys-offshore', notes: 'Marathon Hump — premier offshore tuna/wahoo destination.' },

  // ============== BAHIA HONDA / LOWER KEYS ==============
  { id: 'fl-keys-bahia-honda', name: 'Bahia Honda State Park', region: 'Florida Keys', county: 'Monroe', lat: 24.665, lng: -81.275, cat: 'fl-coastal-town' },
  { id: 'fl-keys-bahia-honda-bridge', name: 'Bahia Honda Bridge', region: 'Florida Keys', county: 'Monroe', lat: 24.660, lng: -81.290, cat: 'fl-coastal-pier-jetty' },
  { id: 'fl-keys-bahia-honda-channel', name: 'Bahia Honda Channel', region: 'Florida Keys', county: 'Monroe', lat: 24.655, lng: -81.305, cat: 'fl-coastal-pass', brackish: true },
  { id: 'fl-keys-big-pine-key', name: 'Big Pine Key', region: 'Florida Keys', county: 'Monroe', lat: 24.685, lng: -81.350, cat: 'fl-coastal-town' },
  { id: 'fl-keys-big-pine-flats', name: 'Big Pine Flats (Newfound Harbor)', region: 'Florida Keys', county: 'Monroe', lat: 24.660, lng: -81.380, cat: 'fl-keys-flat' },
  { id: 'fl-keys-no-name-key', name: 'No Name Key', region: 'Florida Keys', county: 'Monroe', lat: 24.700, lng: -81.325, cat: 'fl-coastal-town' },
  { id: 'fl-keys-big-torch-key', name: 'Big Torch Key', region: 'Florida Keys', county: 'Monroe', lat: 24.720, lng: -81.420, cat: 'fl-coastal-town' },
  { id: 'fl-keys-summerland-key', name: 'Summerland Key', region: 'Florida Keys', county: 'Monroe', lat: 24.660, lng: -81.450, cat: 'fl-coastal-town' },
  { id: 'fl-keys-ramrod-key', name: 'Ramrod Key', region: 'Florida Keys', county: 'Monroe', lat: 24.660, lng: -81.420, cat: 'fl-coastal-town' },
  { id: 'fl-keys-cudjoe-key', name: 'Cudjoe Key', region: 'Florida Keys', county: 'Monroe', lat: 24.665, lng: -81.495, cat: 'fl-coastal-town' },
  { id: 'fl-keys-sugarloaf-key', name: 'Sugarloaf Key', region: 'Florida Keys', county: 'Monroe', lat: 24.665, lng: -81.560, cat: 'fl-coastal-town' },
  { id: 'fl-keys-saddlebunch-keys', name: 'Saddlebunch Keys', region: 'Florida Keys', county: 'Monroe', lat: 24.655, lng: -81.610, cat: 'fl-keys-flat' },
  { id: 'fl-keys-big-coppitt-key', name: 'Big Coppitt Key', region: 'Florida Keys', county: 'Monroe', lat: 24.595, lng: -81.660, cat: 'fl-coastal-town' },
  { id: 'fl-keys-rockland-key', name: 'Rockland Key', region: 'Florida Keys', county: 'Monroe', lat: 24.590, lng: -81.685, cat: 'fl-coastal-town' },
  { id: 'fl-keys-boca-chica', name: 'Boca Chica Key', region: 'Florida Keys', county: 'Monroe', lat: 24.575, lng: -81.700, cat: 'fl-coastal-town' },

  // ============== KEY WEST ==============
  { id: 'fl-keys-stock-island', name: 'Stock Island', region: 'Florida Keys', county: 'Monroe', lat: 24.565, lng: -81.745, cat: 'fl-coastal-town' },
  { id: 'fl-keys-key-west', name: 'Key West', region: 'Florida Keys', county: 'Monroe', lat: 24.555, lng: -81.785, cat: 'fl-coastal-town', notes: 'Key West — southernmost Keys hub. Tarpon, bonefish, permit, sailfish, mahi, wahoo, marlin. Garrison Bight + Stock Island marinas.' },
  { id: 'fl-keys-key-west-flats', name: 'Key West Backcountry Flats', region: 'Florida Keys', county: 'Monroe', lat: 24.620, lng: -81.730, cat: 'fl-keys-flat' },
  { id: 'fl-keys-key-west-harbor', name: 'Key West Harbor', region: 'Florida Keys', county: 'Monroe', lat: 24.560, lng: -81.805, cat: 'fl-coastal-bay', brackish: true },
  { id: 'fl-keys-key-west-reef', name: 'Key West Reef (Western Dry Rocks, Sand Key)', region: 'Florida Keys', county: 'Monroe', lat: 24.460, lng: -81.870, cat: 'fl-keys-reef' },
  { id: 'fl-keys-key-west-offshore', name: 'Key West Offshore (Wall + Gulf Stream)', region: 'Florida Keys', county: 'Monroe', lat: 24.300, lng: -81.700, cat: 'fl-keys-offshore' },
  { id: 'fl-keys-marquesas', name: 'Marquesas Keys', region: 'Florida Keys', county: 'Monroe', lat: 24.555, lng: -82.140, cat: 'fl-keys-flat', notes: 'Marquesas Keys — 18 miles west of Key West. Premier bonefish, permit, and tarpon flats. Remote.' },
  { id: 'fl-keys-dry-tortugas-supp', name: 'Dry Tortugas (Fort Jefferson)', region: 'Florida Keys', county: 'Monroe', lat: 24.625, lng: -82.880, cat: 'fl-keys-reef', notes: 'Dry Tortugas — 70 miles west of Key West. Premier reef + offshore destination. Grouper, snapper, tuna, mahi.' },

  // ============== FLORIDA BAY (Florida Keys / Everglades transition) ==============
  { id: 'fl-keys-florida-bay-flats', name: 'Florida Bay Flats', region: 'Florida Bay', county: 'Monroe', lat: 25.030, lng: -80.825, cat: 'fl-keys-flat', brackish: true, notes: 'Florida Bay — Everglades-meets-Keys. Tarpon, snook (rare here), redfish, sea trout, bonefish (north basins). Vast shallow basin maze.' },
  { id: 'fl-keys-flamingo-supp', name: 'Flamingo (Everglades NP)', region: 'Florida Bay', county: 'Monroe', lat: 25.140, lng: -80.925, cat: 'fl-everglades', brackish: true, notes: 'Flamingo — primary boat launch into Florida Bay + Everglades backcountry from the south. Snook, tarpon, redfish, trout, snapper.' },
  { id: 'fl-keys-card-sound', name: 'Card Sound', region: 'Florida Bay', county: 'Miami-Dade / Monroe', lat: 25.305, lng: -80.305, cat: 'fl-coastal-bay', brackish: true },
  { id: 'fl-keys-barnes-sound', name: 'Barnes Sound', region: 'Florida Bay', county: 'Monroe', lat: 25.255, lng: -80.385, cat: 'fl-coastal-bay', brackish: true },
  { id: 'fl-keys-blackwater-sound', name: 'Blackwater Sound', region: 'Florida Bay', county: 'Monroe', lat: 25.130, lng: -80.460, cat: 'fl-coastal-bay', brackish: true },
  { id: 'fl-keys-buttonwood-sound', name: 'Buttonwood Sound', region: 'Florida Bay', county: 'Monroe', lat: 25.090, lng: -80.500, cat: 'fl-coastal-bay', brackish: true },
  { id: 'fl-keys-rabbit-key-basin', name: 'Rabbit Key Basin', region: 'Florida Bay', county: 'Monroe', lat: 25.030, lng: -80.640, cat: 'fl-keys-flat', brackish: true },
  { id: 'fl-keys-johnson-key-channel', name: 'Johnson Key Channel', region: 'Florida Bay', county: 'Monroe', lat: 24.940, lng: -80.760, cat: 'fl-coastal-pass', brackish: true },
  { id: 'fl-keys-shell-key-basin', name: 'Shell Key Basin', region: 'Florida Bay', county: 'Monroe', lat: 24.945, lng: -80.720, cat: 'fl-keys-flat', brackish: true },
  { id: 'fl-keys-snake-bight', name: 'Snake Bight', region: 'Florida Bay', county: 'Monroe', lat: 25.155, lng: -80.825, cat: 'fl-keys-flat', brackish: true, notes: 'Snake Bight — Flamingo area. Famous tarpon + redfish flat.' },
  { id: 'fl-keys-cape-sable', name: 'Cape Sable', region: 'Florida Bay', county: 'Monroe', lat: 25.135, lng: -81.085, cat: 'fl-coastal-flat', brackish: true },
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
