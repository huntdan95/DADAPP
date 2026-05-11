import type { Waterbody } from '../registry';

import { GREAT_LAKES } from './greatLakes';
import { MI_WATERBODIES } from './mi';
import { TN_WATERBODIES } from './tn';
import { KY_WATERBODIES } from './ky';
import { NC_WATERBODIES } from './nc';
import { IN_WATERBODIES } from './in';
import { GA_WATERBODIES } from './ga';
import { FL_WATERBODIES } from './fl';
import { AL_WATERBODIES } from './al';
import { AR_WATERBODIES } from './ar';
import { MS_WATERBODIES } from './ms';
import { OK_WATERBODIES } from './ok';
import { IL_WATERBODIES } from './il';
import { PA_WATERBODIES } from './pa';
import { MT_WATERBODIES } from './mt';
import { ID_WATERBODIES } from './id';
import { UT_WATERBODIES } from './ut';
import { CO_WATERBODIES } from './co';

/**
 * Aggregates every per-state waterbody file into one flat array
 * the registry reads. Add new state files to this list to surface
 * them in the lookup. The order doesn't matter — `lookupWaterbody`
 * uses bbox-area tiebreak for overlap.
 *
 * Bulk-imported GNIS entries (Phase 3) will live in separate
 * `<state>-gnis.ts` files alongside the hand-curated ones so the
 * curated metadata isn't churned by re-imports.
 */
export const ALL_WATERBODIES: Waterbody[] = [
  ...GREAT_LAKES,
  ...MI_WATERBODIES,
  ...TN_WATERBODIES,
  ...KY_WATERBODIES,
  ...NC_WATERBODIES,
  ...IN_WATERBODIES,
  ...GA_WATERBODIES,
  ...FL_WATERBODIES,
  ...AL_WATERBODIES,
  ...AR_WATERBODIES,
  ...MS_WATERBODIES,
  ...OK_WATERBODIES,
  ...IL_WATERBODIES,
  ...PA_WATERBODIES,
  ...MT_WATERBODIES,
  ...ID_WATERBODIES,
  ...UT_WATERBODIES,
  ...CO_WATERBODIES,
];
