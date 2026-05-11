# Waterbody Registry

The single source of truth for "what body of water is this pin actually on?"

```
src/lib/waterbodies/
├── registry.ts          Interface + lookup functions (public API)
├── data/
│   ├── index.ts         Aggregates every per-state file
│   ├── greatLakes.ts    Cross-state Great Lakes + Lake St. Clair
│   ├── mi.ts            Michigan inland waters
│   ├── tn.ts            Tennessee
│   ├── ky.ts            Kentucky
│   ├── nc.ts            North Carolina
│   ├── in.ts            Indiana
│   ├── ga.ts            Georgia
│   ├── fl.ts            Florida
│   ├── al.ts            Alabama
│   └── ar.ts            Arkansas
└── README.md            (this file)
```

## Adding a new water by hand

1. Open the `data/<state>.ts` file (create one if the state isn't yet
   represented and add it to `data/index.ts`).
2. Append a new `Waterbody` entry. The required fields are minimal:

```ts
{
  id: 'mi-houghton-lake',                 // `<state>-<slug>` convention
  name: 'Houghton Lake',
  states: ['MI'],
  type: 'lake',                            // see WaterType union
  bbox: [44.27, -84.85, 44.42, -84.65],    // [S, W, N, E]
  centroid: { lat: 44.35, lng: -84.75 },
}
```

3. Everything else is optional. Add what you know:
   - `surfaceAreaAcres` — useful tiebreak when bboxes overlap
   - `dataProviders` — the curated data-source config the auto-detect
     binds when a pin lands inside the bbox. Use this to point a lake
     at its proper NDBC / CO-OPS / USGS-lake station.
   - `alternateLakeStations` — extra picker options the form shows
     under the primary lake-data station.
   - `species`, `hatchTags`, `popularLures` — surfaced on the
     Conditions card and seeded into the catch-form picklist.
   - `regulationsUrl`, `accessNotes`, `primaryAccess` — reference
     info shown when the user taps the body name.

## How bboxes are picked

- Use [S, W, N, E] degrees.
- For lakes: tight bbox around the shoreline. ~0.05° padding is fine.
- For rivers / tailwaters: long thin bbox following the course.
- Overlapping bboxes are OK — `lookupWaterbody` picks the smallest by
  area (Lake St. Clair beats Lake Erie when both bboxes claim the
  same pin).

## Aliases

Add common misspellings + nicknames to `aliases`. The future name-
search lookup uses these. Examples:

```ts
aliases: ['Lac Sainte Claire', 'Lake St Clair', 'Lake Saint Clair']
aliases: ['SoHo', 'South Holston Tailwater']
```

## Future bulk import (Phase 3)

GNIS imports will land in `<state>-gnis.ts` files separate from the
hand-curated ones. The aggregator (`data/index.ts`) concatenates them.
Curated metadata wins on id collision (registry processes curated
files first; the de-dupe pass in `data/index.ts` will drop GNIS
entries whose id matches a curated entry).

## Schema lock-in

Adding fields to `Waterbody` is safe (just optional). Removing fields
requires a migration of every entry. When in doubt, propose new
fields as optional first.
