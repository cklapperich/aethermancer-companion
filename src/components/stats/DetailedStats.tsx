import { useState, useMemo } from 'react';
import { EStatistic, SaveFileStatistic } from '@/types/saveFile';
import { Monster } from '@/types/monsters';
import {
  getStatByType,
  getStatisticMeta,
  getNameLookup,
  dictionaryToSortedArray,
  getAvailableStats,
} from '@/utils/statisticsLookup';
import { StatCategorySelector } from './StatCategorySelector';
import { DictionaryStatTable } from './DictionaryStatTable';
import { SingleStatCard } from './SingleStatCard';

interface DetailedStatsProps {
  statistics: SaveFileStatistic[];
  monsters: Monster[];
}

export function DetailedStats({ statistics, monsters }: DetailedStatsProps) {
  // Get available stats from the save file
  const availableStats = useMemo(() => getAvailableStats(statistics), [statistics]);

  // Default to first available stat, or EnemyMonsterKilled if available
  const defaultStat = useMemo(() => {
    if (availableStats.includes(EStatistic.EnemyMonsterKilled)) {
      return EStatistic.EnemyMonsterKilled;
    }
    return availableStats[0] ?? EStatistic.EnemyMonsterKilled;
  }, [availableStats]);

  const [selectedStat, setSelectedStat] = useState<EStatistic>(defaultStat);

  // Get current statistic data
  const currentStat = useMemo(
    () => getStatByType(statistics, selectedStat),
    [statistics, selectedStat]
  );

  // Get category metadata
  const statMeta = useMemo(() => getStatisticMeta(selectedStat), [selectedStat]);

  // Get name lookup function based on stat type
  const nameLookup = useMemo(
    () => getNameLookup(selectedStat, monsters),
    [selectedStat, monsters]
  );

  // Prepare display data for dictionary stats
  const displayData = useMemo(() => {
    if (!currentStat || currentStat.IsSingleIntStat) return [];
    return dictionaryToSortedArray(currentStat, nameLookup);
  }, [currentStat, nameLookup]);

  if (statistics.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-xl font-alegreya font-bold text-tier-maverick"
          style={{ fontVariant: 'small-caps' }}
        >
          Detailed Statistics
        </h3>
        <StatCategorySelector
          value={selectedStat}
          onChange={setSelectedStat}
          availableStats={availableStats}
        />
      </div>

      <div className="bg-gray-800 rounded-lg p-4 md:p-6">
        {statMeta && currentStat ? (
          currentStat.IsSingleIntStat ? (
            <SingleStatCard
              title={statMeta.name}
              description={statMeta.description}
              value={currentStat.SingleStat}
            />
          ) : (
            <DictionaryStatTable
              title={statMeta.name}
              description={statMeta.description}
              data={displayData}
            />
          )
        ) : (
          <p className="text-center text-gray-500 py-8 font-figtree">
            No data available for this category
          </p>
        )}
      </div>
    </section>
  );
}
