import { Card, CardHeader, CardSubtitle, CardTitle } from '@/components/ui/Card';
import type { Location } from '@/lib/providers/types';
import { WeatherSection } from './WeatherSection';
import { FlowSection } from './FlowSection';
import { LakeSection } from './LakeSection';
import { DamSection } from './DamSection';
import { SolunarSection } from './SolunarSection';
import { HatchSection } from './HatchSection';
import { SpeciesSection } from './SpeciesSection';
import { TidesSection } from './TidesSection';
import { TidesSetupPrompt } from './TidesSetupPrompt';
import { BriefingSection } from './BriefingSection';
import { StockingBanner } from './StockingBanner';
import { useAuth } from '@/lib/useAuth';
import { activeHatchesForLocation } from '@/lib/hatches/store';

/**
 * The composition contract from §6 of the plan: render only the sections
 * whose providers are declared on the location. No state-specific or
 * water-type-specific branching here — that's the entire point.
 */
/**
 * River-type waters (tailwater / freestone) lead with the insect-hatch
 * report. Stillwater and saltwater lead with a species + lure list
 * because that's the actionable signal there.
 */
function isRiverType(type: Location['type']): boolean {
  return type === 'tailwater' || type === 'freestone';
}

export function ConditionsCard({ location }: { location: Location }) {
  const { dataProviders } = location;
  const auth = useAuth();
  const showBriefing = auth.kind === 'signed-in';

  // Decide what to show in the "what's biting / hatching" slot.
  //   - Rivers with active hatch matches → HatchSection
  //   - Rivers with NO hatch matches in our data → SpeciesSection (so
  //     warm-water MI rivers without mayfly entries still show go-to
  //     species and lures)
  //   - Lakes / saltwater → SpeciesSection
  const river = isRiverType(location.type);
  const hatchesForRiver = river
    ? activeHatchesForLocation(location, null)
    : [];
  const showHatches = river && hatchesForRiver.length > 0;
  const showSpecies = !showHatches;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{location.name}</CardTitle>
        <CardSubtitle>
          {[location.river, waterTypeLabel(location.type), location.state]
            .filter(Boolean)
            .join(' · ')}
        </CardSubtitle>
      </CardHeader>

      <StockingBanner location={location} />

      <WeatherSection provider={dataProviders.weather} location={location} />
      {dataProviders.flow && (
        <FlowSection provider={dataProviders.flow} location={location} />
      )}
      {dataProviders.lakeData && (
        <LakeSection provider={dataProviders.lakeData} location={location} />
      )}
      {dataProviders.damSchedule && (
        <DamSection provider={dataProviders.damSchedule} location={location} />
      )}
      {dataProviders.tides ? (
        <TidesSection provider={dataProviders.tides} location={location} />
      ) : (
        // Saltwater spots saved before the tide picker existed (or saved
        // without tapping Auto-fill) come through here. Prompt to set up
        // a station in one tap so the rest of the section can render.
        location.type === 'saltwater' && <TidesSetupPrompt location={location} />
      )}
      <SolunarSection location={location} />
      {showHatches && <HatchSection location={location} />}
      {showSpecies && <SpeciesSection location={location} />}
      {showBriefing && <BriefingSection location={location} />}
    </Card>
  );
}

function waterTypeLabel(t: Location['type']): string {
  switch (t) {
    case 'tailwater':
      return 'Tailwater';
    case 'freestone':
      return 'Freestone';
    case 'lake':
      return 'Lake';
    case 'pond':
      return 'Pond';
    case 'reservoir':
      return 'Reservoir';
    case 'great_lakes':
      return 'Great Lakes';
    case 'saltwater':
      return 'Saltwater';
  }
}
