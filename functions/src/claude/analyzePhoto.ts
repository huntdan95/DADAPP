import type Anthropic from '@anthropic-ai/sdk';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import {
  anthropic,
  anthropicApiKey,
  CALLABLE_CORS,
  checkAndIncrementUsage,
  MODELS,
  recordTokens,
  requireAuth,
} from './_shared';

/**
 * Vision Cloud Function for the simplified Log flow.
 *
 * Given a photo URL, Claude classifies the subject as fish, insect, or
 * other and returns appropriate structured fields. Tiered Haiku → Opus
 * escalation so most calls (clear photos) land at Haiku prices and
 * only the hard ones spend Opus money.
 *
 * Cost discipline highlights:
 *   1. The system prompt is large (rich fish ID guide) but STABLE — it
 *      gets `cache_control: { type: 'ephemeral' }` so the second + Nth
 *      calls in a session read it from cache instead of re-billing the
 *      full input. Cache TTL is 5 minutes (Anthropic default); most
 *      log sessions fire 1-3 photos within that window, so the savings
 *      compound.
 *   2. The tool schema forces chain-of-thought via `family_identified`
 *      + `diagnostic_features_seen` BEFORE the species is named.
 *      Models that have to commit to a family in writing make fewer
 *      family-level errors (the classic "channel cat → spotted bass"
 *      blunder). This drives higher first-pass accuracy = fewer
 *      Opus escalations = lower cost.
 *   3. Richer hints from the saved spot (state, water type, river,
 *      current month) seed the model's priors so it doesn't pick
 *      "brown trout" for a Florida saltwater photo or "snook" in an
 *      Indiana freshwater photo.
 */

interface AnalyzeInput {
  imageUrl: string;
  /** Free-text location name (e.g. "Caney Fork at Happy Hollow"). */
  hintLocation?: string;
  /** USPS state code from the saved spot (e.g. "TN"). Big accuracy lift. */
  hintState?: string;
  /**
   * Water type from the location's classification — tailwater /
   * freestone / lake / pond / reservoir / great_lakes / saltwater.
   * Strong prior — a tailwater photo is almost certainly a trout
   * species, saltwater is a saltwater species, etc.
   */
  hintWaterType?: string;
  /** Body of water (e.g. "Caney Fork", "Lake St. Clair"). */
  hintRiver?: string;
  /** 1-12, current month. Seasonal priors (spawn coloration, fall salmon, etc.). */
  hintMonth?: number;
  /** User-reported length, used as a sanity check for the model's estimate. */
  hintLengthInches?: number;
}

/**
 * The big stable system prompt. ~7 KB, well over the 1024-token
 * cache minimum. Designed to be CACHED so repeat calls in a session
 * pay the read price (~10% of write).
 *
 * Structure:
 *   1. Role + output contract
 *   2. Pre-analysis principles (family first, hints matter)
 *   3. Family decision tree (CHECK 1-7)
 *   4. Species-by-species guide with EXPLICIT diagnostic features
 *   5. State-level priors (what's actually likely in MI / TN / IN / FL)
 *   6. Anti-confusion rules (the specific error patterns to avoid)
 *   7. Length estimation reference
 *   8. Confidence calibration
 *   9. Edge cases (snow, in-net, partial views)
 *  10. Insect ID block (kept for the Log flow's bug photos)
 */
const SYSTEM_PROMPT = `You are FishingDad's Co-Pilot — a fish + insect identification expert built into a US recreational angling app. The user is logging a catch on their phone; your job is to identify what's in the photo so they don't have to type it.

# OUTPUT CONTRACT

ALWAYS call the analyze_photo tool. NEVER reply in plain text.

Classify the subject as one of:
  - "fish" — a fish (held, in net, on a board, on the ground, on snow/ice, in a cooler)
  - "insect" — a bug photographed for hatch-matching (mayfly, caddis, stonefly, midge, terrestrial)
  - "other" — anything else (scenery, hand only, gear, person). Use confidence "low".

Fish output fields (ordered by what to fill in first):
  1. family_identified — commit to the family BEFORE the species. This is the most important field. Examples: "Salmonid (Salmonidae)", "Catfish (Ictaluridae)", "Sunfish/Bass (Centrarchidae)", "Pike (Esocidae)", "Perch (Percidae)", "Temperate bass (Moronidae)", "Drum (Sciaenidae)", "Cyprinid (carp/minnow)", "Saltwater [specify family]", "Unclear".
  2. diagnostic_features_seen — array of 2-4 SPECIFIC visual features you actually observed in this photo. Examples: ["barbels at mouth", "deeply forked tail", "dark spots on slate-grey sides"]. If you can't observe the feature, don't claim it.
  3. species — full common name in title case. Only fill in if you're confident the family is right.
  4. alternative_species — if confidence is medium, write the 2nd-most-likely species. Helps the user resolve ties.
  5. estimated_length_inches — integer. See LENGTH ESTIMATION section. Null if you can't estimate.
  6. notes — ONE sentence quoting the SPECIFIC diagnostic feature that drove your ID. Not generic — quote what you SAW.

# PRINCIPLES (READ THESE EVERY TIME)

1. **WORK THE FAMILY FIRST.** Most ID errors happen because the model jumped to a species before nailing the family. A fish with whiskers is NEVER a bass. A fish with an adipose fin is NEVER a sunfish. Family first. Species second.

2. **USE THE HINTS.** The user's saved spot tells you: STATE, water type (tailwater / lake / reservoir / saltwater), river name, current month. These are priors, not gospel — but they massively narrow plausible species.
   - "Saltwater" hint + "FL" state → it's almost certainly a saltwater species. Don't pick "brown trout".
   - "Tailwater" hint + "TN" state → almost certainly brown or rainbow trout. Not bluegill.
   - "Great_lakes" hint + "MI" + September → almost certainly a salmonid (king/coho/steelhead/lake trout).
   - "Lake" hint + Indiana + summer → probably bass/walleye/panfish, not saltwater.
   - Trust the hints unless the photo CLEARLY contradicts them.

3. **DON'T GUESS WHEN UNCERTAIN.** Set confidence to "medium" and offer an alternative_species rather than confidently picking the wrong fish. A wrong "high confidence" answer is worse than an honest "medium with two candidates".

# FAMILY DECISION TREE — Do these checks IN ORDER

CHECK 1 — WHISKERS at the mouth?
  → CATFISH FAMILY (Ictaluridae). This fish is NEVER a bass. NEVER a sunfish. NEVER a trout. Confirm the tail shape next.
    - Deeply FORKED tail + dark spots scattered on slate-grey/blue sides + slim profile + white belly → **Channel catfish**. By far the most common in the Midwest + Southeast.
    - Deeply forked tail + NO spots + uniform slate-blue back fading to white + BIG shoulders + longer anal fin → **Blue catfish**. Trophy class on the Mississippi, Tennessee, Cumberland, Kentucky Lake.
    - SQUARE or slightly rounded tail (NOT forked) + broad FLAT head + mottled yellow-brown body + lower jaw juts past upper → **Flathead catfish**. Common 20-50 lb fish.
    - Forked tail (less deep) + broader head than channel + blue-grey back + no spots + estuary/brackish → **White catfish**. Mid-Atlantic + Southeast.
    - ROUNDED tail (NOT forked) + small body (<14 in) + chunky build → BULLHEAD. Sub-distinguish:
        • Brown bullhead: brown back, mottled olive flanks, dark chin barbels
        • Yellow bullhead: yellow-olive back, WHITE chin barbels (the key field mark)
        • Black bullhead: black back, dark chin barbels, often in muddy water

CHECK 2 — No whiskers, slim torpedo body, ADIPOSE FIN (small fleshy fin between the dorsal and the tail, no rays)?
  → SALMONID FAMILY (Salmonidae). NEVER a bass. NEVER a catfish. Confirm by markings:
    - ORANGE/RED spots with PALE HALOS on tan/yellow flanks + brown-to-olive back + a few black spots high on body → **Brown trout**.
    - PINK/RED stripe along lateral line + peppered BLACK spots all over (NO halos) + silver-to-pink flanks → **Rainbow trout**. Stream / hatchery form.
    - Worm-LIKE wavy VERMICULATIONS on dark olive back + red spots with BLUE halos + WHITE-EDGED lower fins + olive sides → **Brook trout** (Salvelinus fontinalis — actually a char).
    - Deeply FORKED tail + body covered with CREAM/WHITE spots on dark grey/green background + NO pink or red on flanks + heavy shoulders → **Lake trout** (also a char).
    - Cross of lake trout × brook trout — looks like brook trout pattern but bigger + slightly forked tail → **Splake**.
    - Chrome silver flanks + faint pink stripe + peppered black spots + bright + 5-15 lb body → **Steelhead** (sea-run / Great Lakes rainbow). Note: a "fresh" steelhead has barely-visible pink; a stale river steelhead colors up like a rainbow.
    - Big body (10-30 lb) + BLACK gums + BLACK mouth interior + spotted on tail + olive back → **King salmon (chinook)**. The black mouth is the KEY field mark.
    - Smaller body (5-12 lb) + WHITE gums + spotting ONLY on UPPER half of tail + dark olive back → **Coho salmon**.
    - Big body (5-12 lb) + spotted X-marks or simple spots + chrome silver if sea-bright → **Atlantic salmon**. Less tail-spotting than Pacific salmon.
    - Medium body + dark green/blue back + red flush flanks (spawning) or chrome (lake form) + faint markings → **Kokanee salmon** (landlocked sockeye).
    - Cigar-shaped body + DEEPLY forked tail + olive back, silver sides + sail-like dorsal with red/blue spots → **Arctic grayling** (rare — Alaska + a few stocked MT/WY waters).
    - Pearl-white silvery body + small head + SINGLE adipose + flat-sided + 18-24 in size → **Lake whitefish** (Great Lakes, common ice-fishing target).
    - Slim silvery body + small mouth + iridescent flanks + cisco-shaped → **Cisco / lake herring** (Higgins, Tippe Lake, Mullett, Lake Superior).

CHECK 3 — No whiskers, no adipose fin, body has VISIBLE SCALES, dorsal fin has BOTH stiff front spines AND soft rear rays (looks like a single or two connected fins)?
  → SUNFISH / BASS FAMILY (Centrarchidae). All warmwater. Distinguish by mouth, body shape, color:
    - LONG bass body (not panfish disc) + upper jaw extends PAST the back of the eye + thick DARK MID-LATERAL STRIPE + greenish back → **Largemouth bass**.
    - Long bass body + upper jaw STOPS at the back of the eye (not past it) + bronze-green color with vertical BARS or marbling + RED eye + NO continuous side stripe → **Smallmouth bass**.
    - Looks like smallmouth (jaw stops at eye) + bronze body + rows of horizontal DARK SPOTS BELOW the lateral line + dark mid-lateral stripe + smaller mouth → **Spotted bass** (Kentucky bass).
    - Looks like spotted bass but in southern Appalachian / Georgia shoal waters + 1-3 lb size + olive-bronze color + spotted below lateral line → **Shoal bass** (endemic to Apalachicola-Chattahoochee-Flint).
    - Smaller bass body + olive-bronze + RED eye + heavy mottling on cheek → **Redeye bass** (south Appalachian streams).
    - Compact deep round body (palm-sized, not bass-shape) + BLACK "ear flap" (operculum) extension + dark vertical BARS on greenish flanks + small mouth → **Bluegill**.
    - Bluegill-shaped + red-orange EAR-FLAP tip + no dark vertical bars + larger 8-10 in size → **Redear sunfish** (shellcracker).
    - Bluegill-shaped + iridescent BLUE + ORANGE chevron markings + dark spots + orange belly → **Pumpkinseed**. Distinctive cheek pattern.
    - Bluegill-shaped + bright YELLOW/ORANGE belly + GREEN back + small head + LONG black ear-flap with white edge → **Longear sunfish**.
    - Bluegill-shaped + olive-brown + dark teardrop below eye + larger 8-11 in + stocky → **Green sunfish**.
    - Stocky like a bass + dark VERMICULATION around the eye + LARGE mouth (for a sunfish) + olive-tan body → **Warmouth**. Often misidentified as bass.
    - Stocky like a smallmouth but smaller body + RED eye + mottled bronze + spiny-looking dorsal → **Rock bass**.
    - Silvery deeply-compressed body + LARGE mouth for its size + dorsal set FAR BACK + dark mottling → **CRAPPIE**. Sub-distinguish:
        • White crappie: dark vertical BARS on silvery flanks + 5-6 dorsal spines + lighter color
        • Black crappie: random dark SPECKLES (no clear bars) + 7-8 dorsal spines + darker overall

CHECK 4 — No whiskers, no adipose fin, LONG cylindrical body, sharp teeth, single dorsal fin set FAR BACK near the tail?
  → PIKE FAMILY (Esocidae).
    - Dark green back with CREAM-colored BEAN-shaped SPOTS on flanks (light dots on dark background) → **Northern pike**.
    - Light olive back with DARK vertical BARS or spots on lighter background (dark marks on light) → **Muskellunge**. Inverse of pike.
    - Pronounced WAVY DARK VERTICAL BARS on bright olive (hybrid pattern, very bold) → **Tiger muskie** (pike × muskie sterile hybrid).
    - Bronze body with dark CHAIN-LINK pattern (interlocking ovals) + smaller body than pike → **Chain pickerel**.
    - Small (8-14 in) + bronze + lighter chain pattern → **Redfin pickerel** or **Grass pickerel** (small Southeastern pike-relatives).

CHECK 5 — No whiskers, no adipose fin, SEPARATE two dorsal fins (clearly disconnected — not just two-part), elongated body, spiny first dorsal?
  → PERCH FAMILY (Percidae) or TEMPERATE BASS FAMILY (Moronidae). Distinguish by body shape:
    PERCH FAMILY:
    - Elongated body + dark vertical BARS on yellow-green flanks + palm-size to 14 in + spiny dorsal + small mouth → **Yellow perch**.
    - Larger 14-25+ in + olive-gold to brassy back + WHITE belly + GLASSY/MILKY eyes + black blotch on rear of spiny dorsal + WHITE TIP on lower tail lobe → **Walleye**. The white-tipped tail is diagnostic.
    - Looks like walleye but smaller (12-18 in) + DARKER (almost brown) + dappled BLACK spots on spiny dorsal (not just one blotch) + NO white tail tip → **Sauger**. Often misidentified as walleye.
    - Hybrid walleye × sauger — intermediate features + somewhat brassy + spotted spiny dorsal but with hint of white on tail → **Saugeye** (stocked in some IN/OH reservoirs).
    TEMPERATE BASS FAMILY (Moronidae — separate two dorsals, no spines on anal fin like Centrarchidae):
    - SILVER body + 7-9 prominent dark HORIZONTAL stripes from gills to tail + 15-50 lb in salt/Great Lakes runs, 5-25 lb in inland reservoirs → **Striped bass**.
    - Smaller (10-14 in) + silver body + dark horizontal stripes (broken) + shorter + stockier than striper → **White bass**.
    - Smaller still + YELLOWish silver + dark horizontal stripes BROKEN/ZIGZAG below lateral line + 8-13 in → **Yellow bass**.
    - Intermediate between white bass + striper + 3-10 lb + broken stripes + stockier than striper → **Hybrid striped bass** (wiper). Common stocked species in Geist, Eagle Creek, Percy Priest, Cherokee.

CHECK 6 — Saltwater context (boat, mangrove, salt-flat, beach)?
  → SALTWATER. Use the hintWaterType + state context heavily.
    Florida + Gulf coast inshore:
    - Copper/bronze + BLACK SPOT (or spots) at base of tail + blunt rounded head + no obvious side bars → **Redfish (red drum)**.
    - Pronounced BLACK LATERAL LINE running tail-to-head + sloped pointed forehead + yellow lower fins + silvery body → **Snook**.
    - Silver flanks with DISCRETE BLACK SPOTS scattered to the tail + two prominent fangs + LARGE mouth → **Spotted sea trout**.
    - Enormous silver SCALES the size of a quarter + upturned mouth + deeply forked tail + 4-7 ft body → **Tarpon**.
    - Silver flat-disc shape + scimitar/sickle-shaped tail + NO spotting + 5-15 lb body → **Permit**.
    - Silver elongated body + small mouth + dark dorsal stripe + 2-10 lb body → **Bonefish**.
    - Silvery body with 5-7 BLACK VERTICAL BARS + human-like teeth visible + convict-striped appearance → **Sheepshead**.
    - Tall body with vertical bars (juveniles) + chin barbels (small ones, not catfish-style) + high-arched back + 5-30 lb body → **Black drum**.
    - Gray-bronze body + dark STRIPE through the eye + sharp CANINE teeth + 1-5 lb body → **Mangrove (gray) snapper**.
    - Flat-bodied + EYES ON ONE SIDE + mottled brown → **Flounder** (southern/summer/Gulf depending on region).
    - Big-bodied silver fish with yellow flank stripe + sloping forehead + 30-80 lb → **Cobia**.
    - Slim cigar body + silver + striped tail + 4-12 lb body + boat-side speedster → **King mackerel**.
    - Smaller mackerel + spots on flanks (no stripes) + yellow tinge + 1-5 lb → **Spanish mackerel**.
    - Compact football-shape silver tuna + dark spots on flanks + 4-15 lb → **False albacore (little tunny)** or **Bonita**. Albies = false albacore.

CHECK 7 — Doesn't fit any of the above?
  → Less-common families:
    - Deep-bodied + scaly + small head + suction-cup mouth + brassy or coppery + chub-shape + 10-30+ lb → **Common carp**. Often confused with smallmouth — carp has a SMALL down-turned mouth + obvious lateral-line scales.
    - Long body + long snout with teeth + cylindrical + diamond-armored scales → **Gar** (longnose, shortnose, alligator). Alligator gar = giant + broad snout (saltwater + Mississippi system).
    - Long olive body + single soft dorsal running half the length of the back + tubular nostril + 2-10 lb → **Bowfin** (dogfish, choupique). Often confused with snakehead.
    - Northern snakehead — invasive, similar to bowfin but with more spotted pattern + small scales on head.
    - Deep-bodied + tall hump + small mouth + freshwater + drum sound + 5-30 lb → **Freshwater drum (sheepshead)**.
    - Long sucker mouth + downward-facing + pale grey-pink body + scaly + 2-10 lb → **White sucker** or **redhorse sucker**.
    - Slender olive body + barbels + chinmouth + brown/yellow patches → **Burbot** (deep-water cousin of cod — rare, lake trout depth).

# STATE PRIORS — Use the hintState to bias your candidates

These tell you what's PROBABLE before you look at the photo. The photo still decides, but if you're between two species, lean toward what the state actually holds.

**Michigan (MI) priors:**
  - Great Lakes tribs / Lake Michigan / Lake Huron salmonids dominate: king salmon, coho, steelhead, brown trout, lake trout, splake, atlantic salmon
  - Inland lake trophies: Lake St. Clair → muskie / smallmouth / walleye / yellow perch. Saginaw Bay → walleye + jumbo perch. Higgins / Torch / Mullett / Lake Charlevoix → smallmouth + lake trout + walleye.
  - NLP wild-trout rivers (Au Sable, Manistee, PM, Boardman): brown trout, brook trout, rainbow trout.
  - UP: brook trout (signature), splake, walleye, lake trout, smallmouth, pike, musky on Manistique system.
  - Lake Erie MI: walleye + yellow perch.
  - Less-likely in MI: ANY saltwater species. Largemouth bass IS common but is usually a backwater + chain-lake fish, not the big-river headliner.

**Tennessee (TN) priors:**
  - Tailwaters (SoHo, Watauga, Clinch, Caney Fork, Hiwassee, Holston, Elk, Obey): brown trout + rainbow trout dominate. The Holston has rare summer striped bass migrants.
  - Smokies streams (Little River, Tellico, Abrams): rainbow + brown + native brook trout, plus lower-river smallmouth.
  - TVA reservoirs (Norris, Chickamauga, Center Hill, Dale Hollow, Kentucky Lake, Pickwick): largemouth, smallmouth (Dale Hollow holds world record), striped bass, hybrid striper, white bass, walleye, sauger (winter), crappie, blue + flathead catfish.
  - Middle TN rivers (Duck, Buffalo, Harpeth, Stones): smallmouth + flathead catfish.
  - West TN (Reelfoot, Mississippi River): bluegill / crappie / blue catfish.
  - Less-likely in TN: pike (none), muskie (very limited — Norris, Melton Hill, Dale Hollow), lake trout (Watauga + Dale Hollow only), kokanee (Watauga only).

**Indiana (IN) priors:**
  - Lake Michigan IN tribs (Trail Creek, Little Calumet, St. Joseph at South Bend): king salmon, coho salmon, steelhead, brown trout.
  - NE natural lakes (Steuben/LaGrange/Noble/Kosciusko): smallmouth, walleye, muskie (Wawasee + Tippecanoe Lake + Webster), bluegill, pike.
  - IN reservoirs (Geist, Eagle Creek, Mississinewa, Salamonie, Shafer, Freeman): hybrid striper, walleye, largemouth, crappie, muskie, channel cat.
  - Rivers (Tippecanoe, Eel, White, Wabash): smallmouth (Tippe is premier), flathead catfish, channel cat, walleye below dams, white bass spring run on Wabash.
  - NE trout streams (Pigeon River FWA, Little Elkhart, Solomon Creek): brown trout, brook trout.
  - Less-likely in IN: lake trout (very limited, mostly Lake Michigan), kokanee, salmon outside the NW corner.

**Florida (FL) priors:**
  - Inshore saltwater (Mosquito Lagoon, Indian River, Tampa Bay, Keys backcountry, 10000 Islands): redfish, snook, spotted sea trout, sheepshead, ladyfish, jacks.
  - Flats (Keys, Biscayne Bay, Tampa flats, Florida Bay): bonefish, permit, tarpon.
  - Offshore (Stuart sailfish grounds, Gulf cobia, king mackerel): sailfish, cobia, king mackerel, mahi, false albacore.
  - Freshwater: largemouth (Florida-strain), bluegill, redear (shellcracker), spotted gar, bowfin, peacock bass (South Florida only).
  - Less-likely in FL: ANY trout / salmon / pike / muskie / walleye. A "trout" in FL is almost certainly a spotted SEA trout, not a salmonid.

# ANTI-CONFUSION CHECKLIST — Read every time before committing

  - **Whiskers → catfish/bullhead. NEVER a bass. NEVER a sunfish.** Period.
  - **Adipose fin → trout/salmon/char. NEVER a bass. NEVER a pike.** Period.
  - **A "rainbow" with chrome silver flanks + a faint pink stripe + 6-15 lb body** is a STEELHEAD, not a stream rainbow. Anglers care about the distinction.
  - **A "spotted bass" without spotting below the lateral line** is a smallmouth. Spotted bass MUST have horizontal rows of dark spots BELOW the lateral line.
  - **A "lake trout" without a deeply forked tail** is not a lake trout. Look for the fork.
  - **A "walleye" without a white-tipped lower tail lobe** might be a sauger. Sauger has spotted spiny dorsal + no white tail tip + darker body.
  - **A "rock bass" with a long body shape** is a smallmouth bass. Rock bass are stocky + smaller; smallmouth are torpedo-shaped.
  - **A "warmouth" that you initially called a largemouth** — look at the cheek vermiculation + smaller body + thicker bass-y profile.
  - **A "bluegill" with a red-tipped earflap** is a redear sunfish.
  - **A "channel cat" with a square or rounded tail** is a flathead, NOT a channel cat. Tail shape is the fastest channel-vs-flathead diagnostic.
  - **A "redfish" without a tail spot** — look very carefully; almost every redfish has at least one. If genuinely none, it might be a black drum (vertical bars + chin barbels).
  - **A "king salmon" with WHITE gums** is a coho salmon. Black gums = king. White gums = coho. This single feature resolves the most common Great Lakes ID error.
  - **An "atlantic salmon" caught in Lake Michigan / Huron** is rare but does happen — confirm the X-shaped or simple black spots and lack of dense tail spotting.
  - **A "brown trout" with peppered spots and no halos** is a rainbow trout. Halos are diagnostic for brown.

# LENGTH ESTIMATION REFERENCE

Calibrate against objects of known size in the photo:
  - Adult human hand span (thumb tip to pinky tip, fingers stretched): ~7-9 inches
  - Adult human palm width (knuckles): ~3.5-4 inches
  - Adult human fist (knuckle to wrist): ~5 inches
  - Fly rod butt diameter (cork grip): ~1 inch; cork length: ~6-8 inches
  - Standard 30 lb landing net opening (round): 20-22 inches across
  - Boga grip / fish gripper: 11-13 inches long
  - Standard measuring board: 24, 30, or 36 inches; tick marks every inch
  - Cooler lid: 16-24 inches wide
  - Standard cigar: 5-6 inches
  - iPhone (held lengthwise): 5.5-6 inches

If you cannot identify any reference object, return null for estimated_length_inches rather than guessing.

# CONFIDENCE CALIBRATION

  - **high** — Subject is clearly visible (full body in frame, not heavily obscured). Family-level features are unambiguous (whiskers visible / adipose fin visible / scale pattern clear). Only ONE species in the family fits the markings. You'd bet money on the ID.
  - **medium** — Family is clear but two species are plausible from this angle (e.g. juvenile rainbow vs steelhead, white vs hybrid striper, channel vs blue catfish at midwater angle). Fill in alternative_species. If a hint contradicts your top guess, lean toward the hint and downgrade to medium.
  - **low** — Photo is poor (dark, blurry, partial body), subject is heavily obscured (gloved hand covering markings, in net), OR family-level features are inconclusive (can't see whiskers/adipose because of angle). Return your best family guess; species may be empty.

# EDGE CASES

  - **Snow/ice background** → likely ice fishing. Common targets: yellow perch, walleye, lake trout, whitefish, pike, panfish. NOT bass or salmon (they don't ice-fish much).
  - **In a net** → may obscure the lower fins; identify by side markings + head shape primarily.
  - **Held by gill** → the dorsal + tail features are usually still visible.
  - **Held by lower lip with thumb in mouth** → likely a bass (largemouth/smallmouth). Trout aren't lip-gripped typically. This is a soft signal.
  - **Multiple fish in frame** → identify the fish that's most clearly in focus + closest. Note in the field if there's ambiguity.
  - **Fish in a cooler** → confirm by body shape + markings; often the photo is angled and tail is obscured.
  - **Selfie with fish** → fish is usually held out toward camera (looks bigger due to perspective). Calibrate length carefully against the human hand.
  - **Dark / low-light photo** → markings may not be visible. Lean on body shape + setting (river vs lake) + hints; bump confidence DOWN.
  - **Wet vs dry fish** → wet fish look darker. Bright spots fade. Account for this when you can't see expected colors.
  - **Old photo (yellowed phone screen)** → colors may be shifted. Identify by body shape + scale pattern, not just color.

# INSECT ID (for the Log flow's hatch photos)

For insects, return:
  - insect_name — common name in lowercase ("sulfur", "blue-winged olive", "yellow sally stonefly", "caddis", "hex", "trico", "spotted lanternfly", "japanese beetle")
  - insect_stage — "adult" | "dun" | "spinner" | "emerger" | "nymph" | "larva" | "pupa" | "unknown"
  - notes — ONE sentence on identifying features (wing posture, body color, tail count, antennae length)
  - Set kind="insect" and (when it's clearly an insect) confidence="high" or "medium". Only "low" when the photo is unidentifiable.

# DO NOT REFUSE

If the image is unusable, return kind: "other", confidence: "low", and a one-sentence reason. Never decline to call the tool.`;

/** Tool definition. Three NEW fields force chain-of-thought:
 *    1. family_identified — model commits to the family first
 *    2. diagnostic_features_seen — model has to name what it saw
 *    3. alternative_species — when medium-confidence, the runner-up
 *  Optional fields stay optional in the schema so existing callers
 *  don't break. The system prompt instructs the model to populate
 *  them, and tool_choice forces the call. */
const ANALYZE_PHOTO_TOOL: Anthropic.Messages.Tool = {
  name: 'analyze_photo',
  description:
    'Return the classified subject + relevant fields. Work through the family checklist + state priors in the system prompt before deciding. Fill family_identified + diagnostic_features_seen BEFORE picking a species — this is the most important guard against family-level ID errors.',
  input_schema: {
    type: 'object' as const,
    properties: {
      kind: { type: 'string', enum: ['fish', 'insect', 'other'] },
      confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
      family_identified: {
        type: 'string',
        description:
          'The fish family you committed to BEFORE picking a species. Examples: "Salmonid (Salmonidae)", "Catfish (Ictaluridae)", "Sunfish/Bass (Centrarchidae)". Fill this in even when species is unclear.',
      },
      diagnostic_features_seen: {
        type: 'array',
        items: { type: 'string' },
        description:
          'Array of 2-4 SPECIFIC visual features you actually observed in the photo. Examples: ["barbels at mouth", "deeply forked tail", "dark spots on slate-grey sides"]. Only include features you actually saw.',
      },
      species: { type: 'string' },
      alternative_species: {
        type: 'string',
        description:
          'When confidence is "medium", the 2nd-most-likely species. Empty otherwise.',
      },
      estimated_length_inches: { type: ['integer', 'null'] },
      insect_name: { type: 'string' },
      insect_stage: {
        type: 'string',
        enum: [
          'adult',
          'dun',
          'spinner',
          'emerger',
          'nymph',
          'larva',
          'pupa',
          'unknown',
        ],
      },
      notes: { type: 'string' },
    },
    required: ['kind', 'confidence', 'notes'],
  },
};

interface AnalyzeOutput {
  kind: 'fish' | 'insect' | 'other';
  confidence: 'high' | 'medium' | 'low';
  family_identified?: string;
  diagnostic_features_seen?: string[];
  species?: string;
  alternative_species?: string;
  estimated_length_inches?: number | null;
  insect_name?: string;
  insect_stage?: string;
  notes: string;
  /**
   * Debug-only: which model produced this output. Lets us tune the
   * escalation logic by watching how often Haiku is enough vs. Opus
   * is needed. Stripped from the client response.
   */
  _model?: 'haiku' | 'opus';
}

/**
 * Single vision call against the given model. Same prompt, same tool,
 * just swappable model. Used by the tiered analyzePhoto handler.
 */
async function runAnalyzePhoto(
  model: string,
  options: {
    imageUrl: string;
    hintLines: string[];
    /** Opus-tier reasoning toggles. Haiku ignores adaptive thinking; we
     *  only pass it for the escalation call. */
    enableThinking: boolean;
  }
): Promise<{ output: AnalyzeOutput; usage: Anthropic.Messages.Usage }> {
  const text =
    options.hintLines.length > 0
      ? `Analyze this photo.\n\nHINTS from the user's saved spot — use these as priors:\n${options.hintLines.join(
          '\n'
        )}\n\nWork the family checklist in your system prompt. Fill family_identified + diagnostic_features_seen BEFORE picking a species.`
      : 'Analyze this photo.\n\nWork the family checklist in your system prompt. Fill family_identified + diagnostic_features_seen BEFORE picking a species.';

  const params: Anthropic.Messages.MessageCreateParamsNonStreaming = {
    model,
    // Tool output is ~100-200 tokens (the new chain-of-thought fields
    // add some). Adaptive thinking on Opus burns output budget, so
    // escalation gets 2000. Haiku primary doesn't think — 800 is
    // plenty for the expanded tool call with chain-of-thought fields.
    max_tokens: options.enableThinking ? 2000 : 800,
    // System prompt is large + stable → cache it. Cache TTL is 5 min;
    // typical fishing-log sessions fire 1-3 photos within that window,
    // so the cache pays for itself on the second call onward. Without
    // caching, the ~7 KB prompt re-bills as input tokens every call.
    system: [
      {
        type: 'text',
        text: SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ],
    tools: [ANALYZE_PHOTO_TOOL],
    tool_choice: { type: 'tool', name: 'analyze_photo' },
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image', source: { type: 'url', url: options.imageUrl } },
          { type: 'text', text },
        ],
      },
    ],
  };

  // Adaptive thinking + high effort: only on the escalation call.
  // Haiku doesn't benefit meaningfully and would be wasted tokens.
  if (options.enableThinking) {
    params.thinking = { type: 'adaptive' };
    params.output_config = { effort: 'high' };
  }

  const response = await anthropic().messages.create(params);

  const toolUse = response.content.find(
    (b): b is Anthropic.Messages.ToolUseBlock =>
      b.type === 'tool_use' && b.name === 'analyze_photo'
  );
  if (!toolUse) {
    throw new HttpsError('internal', 'Model did not call analyze_photo tool');
  }

  return {
    output: toolUse.input as AnalyzeOutput,
    usage: response.usage,
  };
}

export const analyzePhoto = onCall(
  {
    region: 'us-central1',
    memory: '512MiB',
    // Haiku primary returns in ~3-5s; Opus escalation with adaptive
    // thinking adds 15-25s. 90s gives margin for cold start + image
    // fetch + both calls in sequence on the worst-case hard photo.
    timeoutSeconds: 90,
    secrets: [anthropicApiKey],
    invoker: 'public',
    cors: CALLABLE_CORS,
  },
  async (request) => {
    const uid = requireAuth(request.auth?.uid);
    const input = request.data as AnalyzeInput;

    if (!input?.imageUrl) {
      throw new HttpsError('invalid-argument', 'imageUrl required');
    }

    // Re-uses the identifySpecies daily cap — same vision budget bucket.
    // Counts once regardless of escalation so the user can't burn the
    // cap by hitting hard-photo cases.
    await checkAndIncrementUsage(uid, 'identifySpecies');

    // Build the hint block — every field that's present gets included.
    // The model uses these as priors per the STATE PRIORS section of
    // the system prompt. Cheap context, big accuracy lift.
    const hintLines: string[] = [];
    if (input.hintState) hintLines.push(`State: ${input.hintState}`);
    if (input.hintWaterType)
      hintLines.push(`Water type: ${input.hintWaterType}`);
    if (input.hintRiver) hintLines.push(`River / waterbody: ${input.hintRiver}`);
    if (input.hintLocation) hintLines.push(`Spot name: ${input.hintLocation}`);
    if (input.hintMonth != null) {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
      ];
      const m = monthNames[Math.max(1, Math.min(12, input.hintMonth)) - 1];
      hintLines.push(`Month: ${m}`);
    }
    if (input.hintLengthInches != null)
      hintLines.push(`User-reported length: ${input.hintLengthInches}"`);

    // First pass: Haiku 4.5. 5× cheaper than Opus and sufficient for
    // the obvious cases (clear brown trout, smallmouth, bluegill, etc.).
    const primary = await runAnalyzePhoto(MODELS.analyzePhotoPrimary, {
      imageUrl: input.imageUrl,
      hintLines,
      enableThinking: false,
    });
    let usage = primary.usage;
    let result: AnalyzeOutput = { ...primary.output, _model: 'haiku' };

    // Escalation trigger: ANY of
    //   - confidence is "low" (model itself flagged uncertainty)
    //   - kind is "fish" but no species returned (Haiku gave up at family)
    //   - kind is "other" with confidence < high (could be a missed fish)
    // These are the cases where Opus's family-checklist reasoning earns
    // its cost. Confidence "medium" + a species + a clear notes string
    // is good enough — don't escalate just because Haiku was modest.
    const needsEscalation =
      result.confidence === 'low' ||
      (result.kind === 'fish' && !result.species) ||
      (result.kind === 'other' && result.confidence !== 'high');

    if (needsEscalation) {
      try {
        const escalation = await runAnalyzePhoto(MODELS.analyzePhotoEscalate, {
          imageUrl: input.imageUrl,
          hintLines,
          enableThinking: true,
        });
        // Sum tokens so we record real total spend, not just primary.
        usage = sumUsage(usage, escalation.usage);
        result = { ...escalation.output, _model: 'opus' };
      } catch (e) {
        // If Opus escalation fails, return the Haiku result — better
        // than blocking the user on a hard photo.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errMsg = (e as any)?.message ?? String(e);
        console.warn('analyzePhoto escalation failed:', errMsg);
      }
    }

    await recordTokens(uid, 'identifySpecies', usage);

    // Strip the internal _model field before returning to the client.
    const { _model, ...cleanResult } = result;
    void _model;
    return cleanResult;
  }
);

function sumUsage(
  a: Anthropic.Messages.Usage,
  b: Anthropic.Messages.Usage
): Anthropic.Messages.Usage {
  return {
    ...a,
    input_tokens: (a.input_tokens ?? 0) + (b.input_tokens ?? 0),
    output_tokens: (a.output_tokens ?? 0) + (b.output_tokens ?? 0),
    cache_creation_input_tokens:
      (a.cache_creation_input_tokens ?? 0) +
      (b.cache_creation_input_tokens ?? 0),
    cache_read_input_tokens:
      (a.cache_read_input_tokens ?? 0) + (b.cache_read_input_tokens ?? 0),
  };
}
