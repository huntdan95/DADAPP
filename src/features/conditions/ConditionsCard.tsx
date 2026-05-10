import { Card, CardHeader, CardSubtitle, CardTitle } from '@/components/ui/Card';
import type { Location } from '@/lib/providers/types';
import { WeatherSection } from './WeatherSection';
import { FlowSection } from './FlowSection';
import { DamSection } from './DamSection';
import { SolunarSection } from './SolunarSection';
import { HatchSection } from './HatchSection';
import { TidesSection } from './TidesSection';
import { BriefingSection } from './BriefingSection';
import { useAuth } from '@/lib/useAuth';

/**
 * The composition contract from §6 of the plan: render only the sections
 * whose providers are declared on the location. No state-specific or
 * water-type-specific branching here — that's the entire point.
 */
/**
 * Insect-hatch matching is meaningful for freshwater trout / smallmouth
 * waters. We hide the hatch section at saltwater locations (anglers fish
 * baitfish patterns and crabs there, not mayflies) and we'd surface a
 * future "forage" section instead.
 */
function showsHatches(type: Location['type']): boolean {
  return (
    type === 'tailwater' ||
    type === 'freestone' ||
    type === 'lake' ||
    type === 'pond' ||
    type === 'reservoir' ||
    type === 'great_lakes'
  );
}

export function ConditionsCard({ location }: { location: Location }) {
  const { dataProviders } = location;
  const auth = useAuth();
  const showBriefing = auth.kind === 'signed-in';
  const showHatches = showsHatches(location.type);

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

      <WeatherSection provider={dataProviders.weather} location={location} />
      {dataProviders.flow && <FlowSection provider={dataProviders.flow} />}
      {dataProviders.damSchedule && (
        <DamSection provider={dataProviders.damSchedule} location={location} />
      )}
      {dataProviders.tides && (
        <TidesSection provider={dataProviders.tides} location={location} />
      )}
      <SolunarSection location={location} />
      {showHatches && <HatchSection location={location} />}
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
