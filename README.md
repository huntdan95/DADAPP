# Dad's Fishing Co-Pilot

Pre-trip / on-the-water / pattern-recognition app for a small group of
fishing buddies. Originally scoped single-user; expanded to a few close
friends.

Greenfield build following the plan at
[`~/.claude/plans/dad-s-fishing-co-pilot-logical-kazoo.md`](../../Users/Danny/.claude/plans/dad-s-fishing-co-pilot-logical-kazoo.md).

## Multi-user model

- **Shared:** locations, dam schedules, boat launches — collaborative
  spot library; one TVA schedule per dam-day; one OSM dataset for everyone.
- **Per-user:** trips & catches, photos — your logbook is yours, stored
  under `users/{uid}/trips/{tripId}/catches/{catchId}` and
  `users/{uid}/trips/...` in Storage.
- **Allowlist (planned):** [`firestore.rules`](firestore.rules) and
  [`storage.rules`](storage.rules) currently allow any signed-in Google
  account. Both files have a commented `signedIn()` allowlist function
  ready — drop in the real emails and redeploy.

## Status

| Phase | State | Notes |
|---|---|---|
| 0 — Foundation | done | Vite + React + TS + Tailwind dark mode + UI primitives |
| 1 — Single-Location Dashboard | done | Provider pattern wired; live Open-Meteo + USGS data |
| 2 — Multi-Location + Map | done | localStorage / Firestore auto-pick, react-leaflet, basemap toggle, fishability-colored markers |
| 3 — Journal MVP | done | Trip + Catch with **trolling support** (depth/speed), photo upload, conditions snapshot per catch, Firebase Auth (Google sign-in) gate |
| 4 — Dam Schedule | done (manual-first) | TVA's site is now Cloudflare-bot-protected. Scraper Cloud Function shipped as a stub; manual entry is primary. Tap-to-cycle hourly grid, presets, "next change at X", staleness warnings. |
| 5a — Boat Launches | done | OSM/Overpass-driven for MI, TN, IN, NC, FL, GA, AL — ~7,500 launches. Cloud Function seedBoatLaunches (monthly cron + on-demand callable). Map layer with viewport filtering, zoom-gating, and a "Find nearest" button using geolocation. **Tap a launch → bottom sheet with directions (Apple Maps / Google Maps) and per-user notes.** |
| 5b — Hatch Calendar | done | 16 hatches seeded in data/hatches.json, filtered by current month + state + water-temp window. Active hatches show on each conditions card with flies + notes. Hex hatch countdown on Manistee/MI locations May 15 → June peak. |
| 6 — Claude API | done | 4 Cloud Functions powered by `@anthropic-ai/sdk`: pre-trip briefings (Sonnet 4.6 with cached hatch playbook), free-text → structured catch parsing (Haiku 4.5, forced tool use), Q&A over log history (Sonnet 4.6, adaptive thinking, cached corpus), photo classification — fish *or* insect — via `analyzePhoto` (Sonnet 4.6 vision). Per-user daily caps + token tracking. |
| 7 — PWA Polish | done | vite-plugin-pwa with auto-update SW, manifest + icons, runtime caches for Open-Meteo, USGS, map tiles, and photos. Firestore offline persistence enabled. **Code-split heavy features**: main entry dropped from 977 KB → 121 KB. Install prompt + update-available toast. |
| 8 — Log refactor (UX) | done | Trip/Catch hierarchy replaced with a flat `LogEntry` model. **Photo-first entry**: take a photo → Claude classifies fish vs insect → GPS + nearest USGS gauge + weather auto-snap → save. Add Spot now **auto-fills** state, timezone, and nearest USGS gauge from a dropped pin. |

## Run locally

```
npm install
npm run dev
```

Open `http://localhost:5173`. With Firebase env vars set in `.env.local`,
the app gates behind a Google sign-in screen and uses Firestore for
locations + trips. Without those vars, it runs in **local mode**:
locations live in localStorage and the journal feature is disabled.

```
npm run build    # production build
npm run lint     # tsc -b --noEmit (typecheck only)
```

## Firebase project

Connected to `dadapp-2cef8` via [`.env.local`](.env.local) (gitignored)
and [`apphosting.yaml`](apphosting.yaml) (committed; values are non-secret).

**Enabled in console:** Authentication (Google), Firestore, Storage,
App Hosting.

**Setup left to do:**
- **Enable Cloud Functions** in the Firebase console (it requires the
  Blaze plan, which App Hosting already activated).
- **Deploy** rules + functions: from the project root run
  ```
  firebase deploy --only firestore:rules,storage:rules
  cd functions && npm install && npm run build && cd ..
  firebase functions:secrets:set ANTHROPIC_API_KEY   # paste your sk-ant-... key
  firebase deploy --only functions
  ```
- **Sign in and seed**: open the Spots tab, scroll to "Boat launches",
  tap "Seed now" to populate ~7,500 launches across the 7 states.
- **Lock down rules** — once friends' emails are known, swap the
  commented allowlist in [`firestore.rules`](firestore.rules) +
  [`storage.rules`](storage.rules) and redeploy.

## Architecture

### Provider pattern (data sources)

Each `Location` declares which **data providers** apply to it
(`weather`, `flow`, `damSchedule`, `tides`, `lakeData`). The
`<ConditionsCard>` composition renders only the sections whose providers
exist on the location — there is **no state-specific or water-type
branching anywhere in the UI**. To add a new region or water type:
extend the union in [`src/lib/providers/types.ts`](src/lib/providers/types.ts),
implement a fetch in the matching subfolder, and add one switch case in
[`src/lib/providers/index.ts`](src/lib/providers/index.ts). Done.

### LocationStore (persistence)

[`src/lib/store/`](src/lib/store/) abstracts persistence behind a single
interface. Implementations:
- **`localStorage.ts`** — works without Firebase; pre-seeds with the 4
  primary spots.
- **`firestore.ts`** — real-time `onSnapshot` reads/writes; auto-seeds
  the 4 primary spots on first sign-in if the collection is empty.

Auto-pick happens in [`src/lib/store/index.ts`](src/lib/store/index.ts)
based on whether `getFirebaseApp()` returns. No code change needed when
moving from local mode to signed-in.

### Fishability scorer

[`src/lib/fishability.ts`](src/lib/fishability.ts) takes weather + flow +
dam schedule and returns `good` / `fair` / `poor` / `unknown`. Used to
color the map markers. Tunable from journal data later (Phase 6).

### Claude API integration

Four Cloud Functions in [`functions/src/claude/`](functions/src/claude/):

- **[`briefing.ts`](functions/src/claude/briefing.ts)** — Sonnet 4.6, max_tokens 300. 3-sentence pre-trip read per location. System prompt bakes in a ~1.5K-token fishing playbook (pressure/water-temp/dam-generation/hatch/trolling heuristics) before a `cache_control: ephemeral` breakpoint — subsequent same-day calls read from cache at ~0.1× cost.
- **[`parseJournal.ts`](functions/src/claude/parseJournal.ts)** — Haiku 4.5, max_tokens 500. Forced tool use (`log_catch`) with the Catch schema as `input_schema`. Returns validated JSON in one shot. Trolling fields are optional in the schema; system prompt instructs them only when `method === "troll"`.
- **[`patterns.ts`](functions/src/claude/patterns.ts)** — Sonnet 4.6, max_tokens 800, adaptive thinking. Loads the user's full catch corpus (capped at 1000) via a `userId`-scoped collectionGroup query, serializes it into a cached system block, and answers natural-language questions over multi-turn history.
- **[`identifySpecies.ts`](functions/src/claude/identifySpecies.ts)** — Sonnet 4.6 vision, max_tokens 300. Reads a Firebase Storage URL, forced tool use returns `{species, confidence, estimatedLengthInches, notes}`.

**Cost guardrails** — [`_shared.ts`](functions/src/claude/_shared.ts) enforces per-user daily caps via Firestore transactions: 5 briefings, 20 parses, 10 patterns, 10 identifications. Token usage written back to `aiUsage/{uid}/days/{YYYY-MM-DD}` for visibility.

**Frontend surfaces:**
- "Get briefing" button on each [`ConditionsCard`](src/features/conditions/ConditionsCard.tsx)
- "Describe it and let Claude fill the form" on the [`CatchForm`](src/features/journal/CatchForm.tsx) — text in, structured catch out, auto-fills every field including trolling depth/speed
- "Identify species" button next to the photo input on `CatchForm`
- [`AskClaude`](src/features/journal/AskClaude.tsx) chat card on the Trips tab with suggested-question seeds

### PWA / offline

- [`vite.config.ts`](vite.config.ts) — VitePWA plugin with `registerType: 'autoUpdate'`, manifest, and **runtime caching** for the data sources that matter on a flaky cell connection:
  - Open-Meteo + USGS Water → `NetworkFirst`, 4 s timeout, 1 h fallback
  - OSM / OpenTopo / Esri tiles → `CacheFirst`, 30 days
  - Firebase Storage photos → `CacheFirst`, 14 days
- [`src/lib/firebase.ts`](src/lib/firebase.ts) — Firestore initialized with `persistentLocalCache` so locations, dam schedules, and trip data round-trip offline.
- [`src/main.tsx`](src/main.tsx) — one-shot SW registration; emits a `pwa-need-refresh` custom event when a new build is available.
- [`src/features/pwa/InstallPrompt.tsx`](src/features/pwa/InstallPrompt.tsx) — `beforeinstallprompt` handler for Chrome/Edge; instruction card for iOS Safari (no install API there).
- [`src/features/pwa/UpdateAvailable.tsx`](src/features/pwa/UpdateAvailable.tsx) — toast that surfaces the SW update and reloads on tap.

Code-split heavy features in [`src/App.tsx`](src/App.tsx) via `React.lazy`:
Map (Leaflet), Journal (Storage + image compression), Spots (Locations CRUD + boat launches admin) each load only on tab change. Result: main entry **116 KB** (gz 34 KB) vs 977 KB before.

### Hatches

[`data/hatches.json`](data/hatches.json) — 16 hatches covering Sulfurs, BWOs (spring + fall), Hendricksons, March Browns, Caddis (Grannom + Cinnamon), Yellow Sallies, Isonychias, Tricos, Hex, White Mayflies, year-round Midges, summer terrestrials, plus stubbed Western patterns (Salmonflies, PMDs) for future expansion.

- [`src/lib/hatches/store.ts`](src/lib/hatches/store.ts) — filter by current month + state + water-temp window; ranks river-match higher.
- [`src/features/conditions/HatchSection.tsx`](src/features/conditions/HatchSection.tsx) — top 4 hatches per location, "IN WINDOW" badge when water-temp lands inside the hatch's preferred range, flies suggestion + tactical notes.
- **Hex countdown** on Manistee/MI locations: "Hex hatch: ~25 days out" surfaces in the card from May 15 through the typical peak (June 20).

### Boat launches

Public boat launches / put-ins / take-outs across MI, TN, IN, NC, FL, GA, AL
sourced from OpenStreetMap via the Overpass API (tag `leisure=slipway`).
~7,500 records total — small enough to load all at once, big enough to
need viewport filtering on the map.

- [`functions/src/scrapers/boatLaunches.ts`](functions/src/scrapers/boatLaunches.ts) —
  Cloud Function. **Scheduled** monthly (06:00 ET on the 1st) and
  **callable** on demand. Writes one Firestore doc per state at
  `boatLaunchSets/{state}` with the full launches array (~360 KB max
  per doc, well under Firestore's 1 MB limit).
- [`src/features/map/BoatLaunchLayer.tsx`](src/features/map/BoatLaunchLayer.tsx) —
  Map layer; hides itself below zoom 9 to avoid pin soup; caps at 400
  visible markers per viewport.
- [`src/features/boatLaunches/BoatLaunchesAdmin.tsx`](src/features/boatLaunches/BoatLaunchesAdmin.tsx) —
  Spots-tab card showing per-state counts and a "Seed now" button that
  calls the Cloud Function (60–90 s end-to-end).
- "Find nearest" button on the map: uses the device's geolocation, ranks
  by haversine distance, drops a "you are here" marker, lists the top 5
  with mileage.

**One-time setup**: after deploying functions, sign in and tap "Seed now"
on the Spots tab to populate the `boatLaunchSets` collection.

### Dam schedule

Per the plan, generation schedules drive a colored hourly bar on tailwater
locations. **TVA's lake-info pages are now behind Cloudflare bot
protection** — direct HTTP fetches return 403, and the data-loading JS
fails the same way. A scraper Cloud Function would need a headless browser
(Playwright + Chromium layer, ~200 MB deploy + 2–5 s cold start) which
isn't worth the complexity for a one-user app.

So Phase 4 ships **manual entry as the primary path**:

- [`features/damSchedule/DamScheduleEditor.tsx`](src/features/damSchedule/DamScheduleEditor.tsx) — tap-to-cycle hourly grid with quick presets (off all day, midday gen, evening gen).
- [`features/conditions/DamSection.tsx`](src/features/conditions/DamSection.tsx) — colored hourly bar with current-hour ring, "Generation starts at 2 PM" computed from the grid, staleness warning if the schedule is over 36 h old.
- [`lib/damSchedule/store.ts`](src/lib/damSchedule/store.ts) — Firestore writes/reads keyed `{authority}__{dam-slug}__YYYY-MM-DD` per the plan's data model.
- [`functions/src/scrapers/tva.ts`](functions/src/scrapers/tva.ts) — scheduled-trigger stub with a documented path to add Playwright later. To enable: `cd functions && npm install playwright-core @sparticuz/chromium`, fill in the scraper, `firebase deploy --only functions`.

### Journal (Trip + Catch)

[`src/lib/journal/`](src/lib/journal/) defines the schema and Firestore
operations. Catch entries auto-snapshot conditions
([`snapshot.ts`](src/lib/journal/snapshot.ts)) so the original numbers
survive even if the upstream data sources change.

**Trolling support:** every catch declares a
`method: 'fly' | 'cast' | 'troll' | 'jig' | 'other'`. When method is
`troll`, the form unlocks:
- `trollingDepthFt` (required)
- `trollingSpeedMph` (optional)

These get stored on the catch document and surface in the trip detail
timeline. Pattern-insights (Phase 6) will be able to query by method +
depth + species + conditions.

## Deviations from the original plan (Phase 1 verification fixes)

USGS gauge IDs from the plan needed fixing — see commit history. Summary
in [`src/seedLocations.ts`](src/seedLocations.ts) inline comments. No TN
tailwater USGS gauge publishes water temperature; that signal will come
from TVA in Phase 4.

## Project layout

```
src/
  components/ui/         # Button, Card, StatBlock, Input, BottomSheet, BottomNav
  features/
    auth/                # SignInScreen
    conditions/          # WeatherSection, FlowSection, DamSection, …
    locations/           # LocationsList, LocationForm (with map pin drop)
    map/                 # MapView, MapMarker, basemaps, fishMarker
    journal/             # Journal, StartTripForm, CatchForm, TripDetail
  lib/
    providers/           # Pluggable data sources — read types.ts first
    store/               # LocationStore (localStorage + firestore)
    journal/             # Trip + Catch types, store, conditions snapshot
    solunar.ts           # Sunrise/sunset/moon via suncalc
    fishability.ts       # Marker scorer
    firebase.ts          # Lazy init + Google sign-in helpers
    useAuth.ts           # Reactive auth-state hook
    utils.ts             # cn(), celsiusToF, formatRelativeTime
  seedLocations.ts       # 4 primary spots, auto-seeded on first run
  App.tsx                # Auth gate + bottom-tab nav (Conditions/Map/Spots/Trips)
firestore.rules / storage.rules / firebase.json   # ready to deploy
apphosting.yaml          # Firebase App Hosting (Cloud Run-backed)
```
