/**
 * Hand-curated lookup: USGS gauge site number → known tailwater
 * context (dam name + authority + river). When the add-spot
 * auto-detect picks a gauge in this table, we automatically:
 *   - Set water type to 'tailwater'
 *   - Configure the dam-schedule provider with the right kind
 *     (auto / tva / consumers-energy / usace)
 *   - Pre-fill the dam name on the rare types that need it
 *
 * Sources: each entry verified against USGS NWIS + TVA / USACE /
 * Consumers Energy public pages. Add new entries here as we cover
 * more tailwaters.
 */

export type TailwaterAuthority =
  | 'tva'
  | 'usace'
  | 'consumers-energy'
  | 'reclamation'
  | 'auto';

export interface KnownTailwater {
  /** USGS site number (string — preserves leading zeros). */
  gaugeSiteId: string;
  /** Friendly dam name displayed in the form + briefing. */
  damName: string;
  authority: TailwaterAuthority;
  /** River below the dam — useful for the briefing context. */
  river: string;
}

export const KNOWN_TAILWATERS: KnownTailwater[] = [
  // ===== TN / TVA =====
  { gaugeSiteId: '03424860', damName: 'Center Hill', authority: 'tva', river: 'Caney Fork' },
  { gaugeSiteId: '03466228', damName: 'South Holston', authority: 'tva', river: 'South Holston' },
  { gaugeSiteId: '03467500', damName: 'Watauga', authority: 'tva', river: 'Watauga' },
  { gaugeSiteId: '03488000', damName: 'Boone', authority: 'tva', river: 'South Holston' },
  { gaugeSiteId: '03439000', damName: 'Norris', authority: 'tva', river: 'Clinch' },
  { gaugeSiteId: '03460000', damName: 'Cherokee', authority: 'tva', river: 'Holston' },
  { gaugeSiteId: '03485000', damName: 'Wilbur', authority: 'tva', river: 'Watauga' },
  { gaugeSiteId: '03578500', damName: 'Tims Ford', authority: 'tva', river: 'Elk' },
  { gaugeSiteId: '03413200', damName: 'Dale Hollow', authority: 'usace', river: 'Obey' },
  { gaugeSiteId: '03435140', damName: 'Cordell Hull', authority: 'usace', river: 'Cumberland' },
  { gaugeSiteId: '03307000', damName: 'Wolf Creek', authority: 'usace', river: 'Cumberland' },

  // ===== KY / Cumberland drainage =====
  // (Wolf Creek is the headline KY tailwater — same gauge serves it.)
  { gaugeSiteId: '03404500', damName: 'Laurel River', authority: 'usace', river: 'Laurel' },

  // ===== MI / Consumers Energy + state =====
  { gaugeSiteId: '04125550', damName: 'Tippy', authority: 'consumers-energy', river: 'Manistee' },
  { gaugeSiteId: '04122500', damName: 'Hodenpyl', authority: 'consumers-energy', river: 'Manistee' },
  // Au Sable hydropower (Consumers Energy)
  { gaugeSiteId: '04135700', damName: 'Mio', authority: 'consumers-energy', river: 'Au Sable' },
  { gaugeSiteId: '04136000', damName: 'Foote', authority: 'consumers-energy', river: 'Au Sable' },

  // ===== AR / White River =====
  // Bull Shoals tailwater — trophy brown trout fishery.
  { gaugeSiteId: '07060500', damName: 'Bull Shoals', authority: 'usace', river: 'White' },
  { gaugeSiteId: '07061500', damName: 'Norfork', authority: 'usace', river: 'North Fork (White)' },

  // ===== CO / Rocky Mountain =====
  { gaugeSiteId: '09127800', damName: 'Blue Mesa', authority: 'reclamation', river: 'Gunnison' },
  { gaugeSiteId: '09127000', damName: 'Crystal', authority: 'reclamation', river: 'Gunnison' },
  { gaugeSiteId: '09110000', damName: 'Taylor Park', authority: 'reclamation', river: 'Taylor' },
  { gaugeSiteId: '09080400', damName: 'Ruedi', authority: 'reclamation', river: 'Fryingpan' },

  // ===== UT =====
  { gaugeSiteId: '09234500', damName: 'Flaming Gorge', authority: 'reclamation', river: 'Green' },
  { gaugeSiteId: '10155000', damName: 'Deer Creek', authority: 'reclamation', river: 'Provo' },
  { gaugeSiteId: '10154200', damName: 'Jordanelle', authority: 'reclamation', river: 'Provo' },

  // ===== MT =====
  { gaugeSiteId: '06043500', damName: 'Hebgen', authority: 'reclamation', river: 'Madison' },
  { gaugeSiteId: '06054500', damName: 'Holter', authority: 'reclamation', river: 'Missouri' },
  { gaugeSiteId: '06090800', damName: 'Canyon Ferry', authority: 'reclamation', river: 'Missouri' },

  // ===== ID =====
  { gaugeSiteId: '13037500', damName: 'Island Park', authority: 'reclamation', river: 'Henry\'s Fork (Snake)' },
  { gaugeSiteId: '13050500', damName: 'Palisades', authority: 'reclamation', river: 'South Fork Snake' },
];

/**
 * Returns the known tailwater context for a USGS site, or null if
 * the gauge isn't in our lookup. Match is exact on the site number
 * string.
 */
export function lookupTailwater(siteId: string): KnownTailwater | null {
  return KNOWN_TAILWATERS.find((t) => t.gaugeSiteId === siteId) ?? null;
}
