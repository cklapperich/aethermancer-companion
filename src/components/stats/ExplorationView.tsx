import { ExplorationData } from '@/utils/statisticsLookup';
import { DictionaryStatTable } from './DictionaryStatTable';

interface ExplorationViewProps {
  data: ExplorationData;
}

export function ExplorationView({ data }: ExplorationViewProps) {
  const hasZones = data.zones.length > 0;
  const hasAreas = data.areas.length > 0;
  const hasEvents = data.events.length > 0;

  if (!hasZones && !hasAreas && !hasEvents) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 font-figtree">No exploration data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {hasZones && (
        <div>
          <h4 className="text-sm font-alegreya font-semibold text-tier-basic mb-2">
            Zone Choices
          </h4>
          <DictionaryStatTable
            data={data.zones}
            title="Zones"
            description="Times each zone type was chosen"
          />
        </div>
      )}

      {hasAreas && (
        <div>
          <h4 className="text-sm font-alegreya font-semibold text-tier-basic mb-2">
            Areas Visited
          </h4>
          <DictionaryStatTable
            data={data.areas}
            title="Areas"
            description="Times each area was visited"
          />
        </div>
      )}

      {hasEvents && (
        <div>
          <h4 className="text-sm font-alegreya font-semibold text-tier-basic mb-2">
            Small Events
          </h4>
          <DictionaryStatTable
            data={data.events}
            title="Events"
            description="Small events encountered"
          />
        </div>
      )}
    </div>
  );
}
