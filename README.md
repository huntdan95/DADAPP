# Dad's Fishing Co-Pilot

Personal pre-trip / on-the-water / pattern-recognition app for one user.
Greenfield build following the plan at
[`~/.claude/plans/dad-s-fishing-co-pilot-logical-kazoo.md`](../../Users/Danny/.claude/plans/dad-s-fishing-co-pilot-logical-kazoo.md).

## Status

| Phase | State | Notes |
|---|---|---|
| 0 — Foundation | done | Vite + React + TS + Tailwind dark mode + UI primitives |
| 1 — Single-Location Dashboard | done | Provider pattern wired; live Open-Meteo + USGS data |
| 2 — Multi-Location + Map | done | localStorage / Firestore auto-pick, react-leaflet, basemap toggle, fishability-colored markers |
| 3 — Journal MVP | done | Trip + Catch with **trolling support** (depth/speed), photo upload, conditions snapshot per catch, Firebase Auth (Google sign-in) gate |
| 4 — Dam Schedule | done (manual-first) | TVA's site is now Cloudflare-bot-protected. Scraper Cloud Function shipped as a stub; manual entry is primary. Tap-to-cycle hourly grid, presets, "next change at X", staleness warnings. |
| 5 — Hatch Calendar | not started | |
| 6 — Claude API | not started | |
| 7 — PWA Polish | not started | Code-split here too — bundle is 970 KB right now |

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

**Enabled in console:** Authentication (Google provider), Firestore,
App Hosting.

**Still needed for full feature parity:**
- **Firebase Storage** — required for catch photos. Without it, catches
  log fine but photos silently fall through.
- **Lock down Firestore + Storage rules** — they currently allow any
  signed-in account because we don't yet know dad's exact email. After
  the first sign-in, replace `request.auth != null` in
  [`firestore.rules`](firestore.rules) and [`storage.rules`](storage.rules)
  with `request.auth.token.email == 'dad@example.com'` and redeploy.

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
