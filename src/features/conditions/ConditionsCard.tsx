import { Card, CardHeader, CardSubtitle, CardTitle } from '@/components/ui/Card';
import type { Location } from '@/lib/providers/types';
import { WeatherSection } from './WeatherSection';
import { FlowSection } from './FlowSection';
import { DamSection } from './DamSection';
import { SolunarSection } from './SolunarSection';
import { HatchSection } from './HatchSection';
import { BriefingSection } from './BriefingSection';
import { useAuth } from '@/lib/useAuth';

/**
 * The composition contract from §6 of the plan: render only the sections
 * whose providers are declared on the location. No state-specific or
 * water-type-specific branching here — that's the entire point.
 */
export function ConditionsCard({ location }: { location: Location }) {
  const { dataProviders } = location;
  const auth = useAuth();
  const showBriefing = auth.kind === 'signed-in';
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
      <SolunarSection location={location} />
      <HatchSection location={location} />
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
