# Dad's Fishing Co-Pilot

Personal pre-trip / on-the-water / pattern-recognition app for one user.
Greenfield build following the plan at
[`~/.claude/plans/dad-s-fishing-co-pilot-logical-kazoo.md`](../../Users/Danny/.claude/plans/dad-s-fishing-co-pilot-logical-kazoo.md).

## Status

| Phase | State | Notes |
|---|---|---|
| 0 — Foundation | done | Vite + React + TS + Tailwind dark mode + UI primitives |
| 1 — Single-Location Dashboard | done | Provider pattern wired; live Open-Meteo + USGS data for 4 seed locations |
| 2 — Multi-Location + Map | not started | Firestore + react-leaflet next |
| 3 — Journal MVP | not started | |
| 4 — TVA Dam Integration | not started | Cloud Function scraper + manual fallback |
| 5 — Hatch Calendar | not started | |
| 6 — Claude API | not started | |
| 7 — PWA Polish | not started | |

## Run locally

```
npm install
npm run dev
```

Open `http://localhost:5173`. No Firebase config required — Phase 1 only
hits Open-Meteo and USGS, both free + keyless.

```
npm run build       # production build
npm run lint        # tsc -b --noEmit (typecheck only)
```

## Architecture (one-paragraph version)

Each `Location` declares which **data providers** apply to it
(`weather`, `flow`, `damSchedule`, `tides`, `lakeData`). The
`<ConditionsCard>` composition renders only the sections whose providers
exist on the location — there is **no state-specific or water-type
branching anywhere in the UI**. Adding a new region or water type means:
extend the provider union in [`src/lib/providers/types.ts`](src/lib/providers/types.ts),
implement a fetch in the matching subfolder, add one switch case in
[`src/lib/providers/index.ts`](src/lib/providers/index.ts). Done. See
§6 + §12 of the plan.

## Deviations from the original plan (Phase 1 verification fixes)

The plan's §16 flagged that gauge IDs needed verification. Hitting the
live USGS API surfaced these issues — corrected in
[`src/seedLocations.ts`](src/seedLocations.ts):

| Location | Plan's site ID | Issue | Replaced with |
|---|---|---|---|
| Caney Fork at Happy Hollow | `03418500` | returns no data (discontinued) | `03424860` (Caney Fork at Stonewall) |
| South Holston at Webb Bridge | `03488000` | wrong river (N F Holston in VA) | flow provider removed; rely on TVA dam schedule (Phase 4) |
| Upper Manistee near Sherman | `04124500` | wrong river (East Branch Pine River) | `04124000` (Manistee River near Sherman, MI) |
| Big Manistee below Tippy | `04125550` | correct ✓ | unchanged |

Note on **TN tailwater water temperature**: no active TN tailwater USGS
gauge publishes water temperature on the IV API. That signal will come
from TVA in Phase 4 (the same scraper that produces the generation
schedule typically also exposes tailwater temp). Until then, Caney Fork's
"Water" stat displays `—`.

Auth approach: per plan §16#1, going with **Firebase Auth** when Phase 2
lands. [`firestore.rules`](firestore.rules) is already written assuming
that — replace `dad@example.com` with the real account email before
deploying.

## What's already on disk for later phases

- `firebase.json` / `firestore.rules` / `firestore.indexes.json` /
  `storage.rules` — Phase 2/3/4 ready
- Stub provider modules under `src/lib/providers/{flow,damSchedule,tides}/`
  with TODOs and target endpoints — these are Phase 4+ work but the
  dispatcher already routes to them
- `.env.local.example` — Firebase vars to fill once the project exists

## Dad's setup checklist (when you're ready)

1. Create the Firebase project at https://console.firebase.google.com
2. Enable Hosting, Firestore, Storage, Functions, Authentication
3. Upgrade to **Blaze** plan, set a $5/month budget alert
4. Create one Auth user with dad's email
5. Edit [`firestore.rules`](firestore.rules) and
   [`storage.rules`](storage.rules) — replace `dad@example.com`
6. Copy `.env.local.example` → `.env.local`, fill in the Firebase web
   config values
7. `firebase login` then `firebase deploy --only hosting` to confirm the
   pipeline

## Project layout

```
src/
  components/ui/         # Button, Card, StatBlock — shadcn-style
  features/conditions/   # WeatherSection, FlowSection, DamSection, etc.
  lib/
    providers/           # Pluggable data sources — read types.ts first
    solunar.ts           # Sunrise/sunset/moon via suncalc
    firebase.ts          # Lazy init — does not crash if env unset
    utils.ts             # cn(), celsiusToF, formatRelativeTime
  seedLocations.ts       # Phase 1 hardcoded; Phase 2 moves to Firestore
  App.tsx                # Renders one ConditionsCard per location
firestore.rules / storage.rules / firebase.json   # ready for Phase 2+
```
