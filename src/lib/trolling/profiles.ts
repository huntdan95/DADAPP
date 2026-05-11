/**
 * Trolling depth profiles for cold/deep-water species on the Great
 * Lakes and similar deep inland lakes (Lake Champlain, Cumberland,
 * Bull Shoals, etc.).
 *
 * About the data: these profiles encode the *consensus* from published
 * charter reports, state DNR fishing-condition pages, and biology of
 * each species. Real-time scraping of fishing reports isn't realistic
 * (no standard format, lives on Facebook groups + boards, brittle to
 * parse), but the seasonal patterns are stable enough that captains
 * predict them by date + surface temp anyway. So we encode that
 * predictive mental model as data here.
 *
 * Sources distilled:
 *   - Great Lakes Coordinating Committee charter reports (MI/WI/OH)
 *   - State DNR weekly fishing forecasts (MI DNR, NY DEC, OH DNR)
 *   - Charter-boat depth logs published in Great Lakes Angler etc.
 *   - Species biology — thermal preferenda from peer-reviewed studies
 *
 * The model is deliberately conservative — ranges are 20-40 ft wide
 * because that's the actual variability across days / spots. Anglers
 * use it as a starting point, not an exact rod-setup.
 */

export interface SpeciesDepthProfile {
  /** Matches a `SpeciesEntry.id` in data/species.json. */
  speciesId: string;
  /** Display name (in case the species json gets out of sync). */
  name: string;
  /** Aliases used when matching by name (for fish without a stable id). */
  nameAliases?: string[];
  /**
   * Thermal preferendum in °F — the surface-temp window where this
   * species is most active and feeds aggressively. Used to refine
   * depth: if surface is in range, fish ride higher; if surface is
   * far above, fish stay deeper near the thermocline.
   */
  thermalPrefF: [number, number];
  /**
   * Seasonal depth pattern by calendar month (1=Jan..12=Dec). Each
   * entry is `[minFt, maxFt]` for the typical trolling depth this
   * month — or `null` if the species isn't actively targetable.
   *
   * NOTE: these are *trolling* depths (where the lure rides), not
   * "where the fish are." For lake trout in 100 ft of water with the
   * fish at 80 ft on bottom, the trolling depth is ~75 ft (5-10 ft
   * above the fish).
   */
  monthlyDepthFt: Partial<Record<number, [number, number] | null>>;
  /**
   * Forage / behavior note shown in the detail sheet so the angler
   * knows *why* the model picked this depth.
   */
  forageNote: string;
  /** A few common-knowledge lure / presentation tips. */
  lureNotes?: string[];
}

export const TROLLING_PROFILES: SpeciesDepthProfile[] = [
  // ---- Lake Trout ----------------------------------------------------
  {
    speciesId: 'lake-trout',
    name: 'Lake Trout',
    nameAliases: ['lake-trout', 'laker', 'mackinaw'],
    thermalPrefF: [45, 52],
    monthlyDepthFt: {
      1: [50, 100],     // Ice fishing on humps + structure
      2: [50, 100],
      3: [40, 80],      // Pre-ice-out, shallower
      4: [10, 50],      // Post-ice-out, shoreline cold water
      5: [20, 60],      // Following cisco / whitefish schools
      6: [40, 80],      // Thermocline forming
      7: [60, 120],     // Below thermocline, deepest stable cold
      8: [80, 130],     // Peak summer depth
      9: [60, 110],     // Thermocline rising
      10: [10, 50],     // Spawning, rocky humps + shoals
      11: [20, 60],     // Post-spawn
      12: [50, 100],
    },
    forageNote:
      'Track cisco and lake whitefish schools — lakers stack 5-15 ft above the bait. Peak activity at the thermocline boundary.',
    lureNotes: [
      'Cowbells + dodger/flutter spoon (Sutton, Lake Co tackle)',
      'Spin-N-Glo + cut sucker meat',
      'Magnum spoons (Stinger, Northport Nailer) for active fish',
    ],
  },

  // ---- Chinook Salmon -----------------------------------------------
  {
    speciesId: 'king-salmon',
    name: 'Chinook Salmon',
    nameAliases: ['chinook', 'king-salmon', 'kings', 'king'],
    thermalPrefF: [50, 55],
    monthlyDepthFt: {
      4: [0, 30],       // April — warming surface, top of column
      5: [15, 50],      // May — following alewives
      6: [30, 70],      // June — sliding deeper as surface warms
      7: [50, 100],     // July — staging below thermocline
      8: [70, 130],     // August peak — deepest stable water
      9: [10, 60],      // September — staging at river mouths for spawn
      10: [0, 30],      // October — pre-spawn, very shallow
    },
    forageNote:
      'Follow alewives + smelt. Kings sit just below the thermocline edge in summer — riggers at 80-100 ft with cut bait on plugs is the workhorse.',
    lureNotes: [
      'Cut bait on meat rigs (alewife in a Howie / Pro-Troll flasher)',
      'J-plugs (especially glow on early/late troll)',
      'Magnum spoons 4-5" — Moonshine, Stinger',
      'Leadcore + copper for top-50 fish in spring + fall',
    ],
  },

  // ---- Coho Salmon ---------------------------------------------------
  {
    speciesId: 'coho-salmon',
    name: 'Coho Salmon',
    nameAliases: ['coho', 'coho-salmon', 'silvers'],
    thermalPrefF: [53, 60],
    monthlyDepthFt: {
      4: [0, 25],       // Surface — warmest water
      5: [10, 40],      // Following warming bands
      6: [25, 60],      // Sliding deeper
      7: [40, 80],
      8: [50, 90],
      9: [5, 35],       // Returning to natal streams
      10: [0, 20],
    },
    forageNote:
      'Cohos hang in the top of the water column in spring — chase warming bands of water. Smaller forage (alewife, smelt). Less depth-locked than kings.',
    lureNotes: [
      'Small spoons (2.5-3") in orange / silver',
      'Dipsy divers + size-0 flashers',
      'Plugs ahead of paddles for aggressive surface feeders',
    ],
  },

  // ---- Steelhead -----------------------------------------------------
  {
    speciesId: 'steelhead',
    name: 'Steelhead (lake-run)',
    nameAliases: ['steelhead', 'rainbow-trout-lake'],
    thermalPrefF: [55, 65],
    monthlyDepthFt: {
      4: [0, 25],
      5: [10, 40],
      6: [20, 60],
      7: [30, 70],      // Summer — high in column, hunting flies + alewife
      8: [40, 80],
      9: [10, 40],      // Run back to rivers fall
      10: [0, 20],
      11: [0, 20],
    },
    forageNote:
      'Steelhead suspend higher than kings and chase aquatic flies + alewives in the upper 40 ft most of summer. Surface boards + planers up top often productive.',
    lureNotes: [
      'Small spoons (Moonshine, Dreamweaver Super Slim)',
      'In-line planers on surface boards',
      'Wedding rings + body baits in spring',
    ],
  },

  // ---- Brown Trout (lake-run) ---------------------------------------
  {
    speciesId: 'brown-trout',
    name: 'Brown Trout (lake-run)',
    nameAliases: ['brown-trout', 'brown-trout-lake', 'lakerun-brown'],
    thermalPrefF: [55, 65],
    monthlyDepthFt: {
      4: [0, 25],       // Spring — very shallow, near piers + shorelines
      5: [5, 35],
      6: [15, 50],
      7: [25, 60],
      8: [30, 70],
      9: [10, 30],      // Pre-spawn, run upstream
      10: [0, 20],
      11: [0, 20],
    },
    forageNote:
      'Browns hug the shoreline + harbor mouths in spring — 5-15 ft of water can produce trophies. Suspend deeper midsummer following alewives.',
    lureNotes: [
      'Small body baits (Husky Jerk, Bay Rat) in early spring',
      'J-plugs + spoons offshore in summer',
      'Stickbaits 5-15 ft over the rocks at harbor mouths',
    ],
  },

  // ---- Atlantic Salmon (where stocked) ------------------------------
  {
    speciesId: 'atlantic-salmon',
    name: 'Atlantic Salmon',
    nameAliases: ['atlantic-salmon', 'landlocked-atlantic'],
    thermalPrefF: [50, 58],
    monthlyDepthFt: {
      4: [10, 40],
      5: [15, 50],
      6: [25, 60],
      7: [35, 70],
      8: [40, 80],
      9: [10, 30],
    },
    forageNote:
      'In Great Lakes stocked populations, behave between cohos and steelhead — top of the cold layer, often suspended over deep water.',
    lureNotes: [
      'Small spoons + flies trolled on planers',
      'Streamer flies on a fly rod from a kayak in cold months',
    ],
  },

  // ---- Lake Whitefish (trolled / jigged) ----------------------------
  {
    speciesId: 'lake-whitefish',
    name: 'Lake Whitefish',
    nameAliases: ['lake-whitefish', 'whitefish'],
    thermalPrefF: [40, 50],
    monthlyDepthFt: {
      1: [60, 120],
      2: [60, 120],
      3: [40, 100],
      4: [30, 80],
      5: [60, 120],
      6: [80, 150],
      7: [100, 180],
      8: [100, 180],
      9: [80, 150],
      10: [40, 100],
      11: [0, 30],      // Spawning on rocky shoals
      12: [40, 80],
    },
    forageNote:
      'Whitefish are bottom-oriented most of the year. Target the very bottom unless ciscoes are suspended. November spawn pulls them right onto the rocky shoals.',
    lureNotes: [
      'Jigging spoons (Swedish Pimple, Buckshot Rattle) right on bottom',
      'Drop-shot with single egg or wax-worm imitation',
      'Trolling rare — mostly vertical presentation',
    ],
  },

  // ---- Walleye (Great Lakes pelagic) --------------------------------
  {
    speciesId: 'walleye',
    name: 'Walleye (Great Lakes)',
    nameAliases: ['walleye'],
    thermalPrefF: [60, 72],
    monthlyDepthFt: {
      4: [10, 30],      // Spring shorelines + warming flats
      5: [10, 25],
      6: [15, 35],
      7: [20, 45],      // Summer suspended chasing emerald shiners
      8: [25, 55],
      9: [20, 50],
      10: [10, 30],
    },
    forageNote:
      'On Erie + Saginaw Bay, walleye suspend over open water following emerald shiners. Crawler harnesses + body baits on bottom-bouncers or stand-up planers.',
    lureNotes: [
      'Crawler harness + bottom bouncer @ 1.4-1.7 mph',
      'Reef Runner / Husky Jerk on lead core',
      'Mag Lip + Bandit deep divers off planers',
    ],
  },

  // ---- Kokanee (where stocked - mostly western) ---------------------
  {
    speciesId: 'kokanee-salmon',
    name: 'Kokanee Salmon',
    nameAliases: ['kokanee-salmon', 'kokanee'],
    thermalPrefF: [50, 55],
    monthlyDepthFt: {
      4: [10, 30],
      5: [20, 45],
      6: [35, 65],
      7: [50, 90],
      8: [60, 100],
      9: [30, 60],
    },
    forageNote:
      'Kokanee feed on zooplankton at the thermocline. Tight schools — when you mark them on sonar, troll dodger + small hoochie at exact depth.',
    lureNotes: [
      'Dodger + pink/orange hoochie',
      'Wedding ring with worm tipped',
      'Slow troll (1.0-1.5 mph)',
    ],
  },
];

/**
 * Look up a profile by species id OR by name (case-insensitive,
 * substring match against aliases). Returns null if no profile is
 * defined — caller treats that as "no trolling depth estimate
 * available for this species".
 */
export function findTrollingProfile(
  speciesIdOrName: string
): SpeciesDepthProfile | null {
  const q = speciesIdOrName.trim().toLowerCase();
  if (!q) return null;
  for (const p of TROLLING_PROFILES) {
    if (p.speciesId === q) return p;
    if (p.name.toLowerCase() === q) return p;
    if (p.nameAliases?.some((a) => a.toLowerCase() === q)) return p;
    // Looser fallback — substring against name
    if (p.name.toLowerCase().includes(q) || q.includes(p.name.toLowerCase())) {
      return p;
    }
  }
  return null;
}
