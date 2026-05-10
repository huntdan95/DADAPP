import { useMemo } from 'react';
import { Moon, Sunrise, Sunset } from 'lucide-react';
import { CardSection } from '@/components/ui/Card';
import { computeSolunar, moonPhaseLabel } from '@/lib/solunar';
import type { Location } from '@/lib/providers/types';

export function SolunarSection({ location }: { location: Location }) {
  const reading = useMemo(() => computeSolunar(location), [location]);
  const fmt = useMemo(
    () =>
      new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        timeZone: location.timezone,
      }),
    [location.timezone]
  );

  return (
    <CardSection label="Sun & Moon">
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center gap-2">
            <Sunrise className="w-4 h-4 text-warn" />
            <div>
              <div className="text-xs text-muted">Sunrise</div>
              <div className="num text-sm font-semibold">
                {fmt.format(new Date(reading.sunrise))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Sunset className="w-4 h-4 text-warn" />
            <div>
              <div className="text-xs text-muted">Sunset</div>
              <div className="num text-sm font-semibold">
                {fmt.format(new Date(reading.sunset))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-info" />
            <div>
              <div className="text-xs text-muted">Moon</div>
              <div className="text-sm font-semibold">
                {moonPhaseLabel(reading.moonPhase, reading.moonIllumination)}
              </div>
            </div>
          </div>
        </div>
        <div className="text-xs text-muted">
          Major windows: {reading.majorPeriods.map((p) => fmt.format(new Date(p.start))).join(', ')}
        </div>
      </div>
    </CardSection>
  );
}
