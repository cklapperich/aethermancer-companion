import { useState, useMemo } from 'react';
import { EStatistic, SaveFileStatistic } from '@/types/saveFile';
import { Monster } from '@/types/monsters';
import {
  getStatByType,
  getStatisticMeta,
  getNameLookup,
  dictionaryToSortedArray,
  getAvailableStats,
  getCombinedSkillData,
  getCombinedMonsterData,
  getExplorationData,
} from '@/utils/statisticsLookup';
import { StatCategorySelector } from './StatCategorySelector';
import { DictionaryStatTable } from './DictionaryStatTable';
import { SingleStatCard } from './SingleStatCard';
import { CombinedSkillsTable } from './CombinedSkillsTable';
import { CombinedMonsterTable } from './CombinedMonsterTable';
import { ExplorationView } from './ExplorationView';

interface DetailedStatsProps {
  statistics: SaveFileStatistic[];
  monsters: Monster[];
}

export function DetailedStats({ statistics, monsters }: DetailedStatsProps) {
  // Get available stats from the save file
  const availableStats = useMemo(() => getAvailableStats(statistics), [statistics]);

  // Default to first available stat, or SkillTypeLearned if available
  const defaultStat = useMemo(() => {
    if (availableStats.includes(EStatistic.SkillTypeLearned)) {
      return EStatistic.SkillTypeLearned;
    }
    return availableStats[0] ?? EStatistic.SkillTypeLearned;
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
    () => getNameLookup(selectedStat),
    [selectedStat]
  );

  // Prepare display data for dictionary stats
  const displayData = useMemo(() => {
    if (!currentStat || currentStat.IsSingleIntStat) return [];
    return dictionaryToSortedArray(currentStat, nameLookup);
  }, [currentStat, nameLookup]);

  // Prepare combined skills data when skills tab is selected
  const combinedSkillsData = useMemo(() => {
    if (selectedStat !== EStatistic.SkillTypeLearned) return [];
    return getCombinedSkillData(statistics, nameLookup);
  }, [statistics, selectedStat, nameLookup]);

  // Prepare combined monster data when monsters tab is selected
  const combinedMonsterData = useMemo(() => {
    if (selectedStat !== EStatistic.MonstersRevived) return [];
    const monsterLookup = getNameLookup(EStatistic.MonstersRevived);
    return getCombinedMonsterData(statistics, monsterLookup);
  }, [statistics, selectedStat]);

  // Prepare exploration data when exploration tab is selected
  const explorationData = useMemo(() => {
    if (selectedStat !== EStatistic.MapZoneChoice) return null;
    return getExplorationData(statistics);
  }, [statistics, selectedStat]);

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
        {statMeta ? (
          currentStat?.IsSingleIntStat ? (
            <SingleStatCard
              title={statMeta.name}
              description={statMeta.description}
              value={currentStat.SingleStat}
            />
          ) : selectedStat === EStatistic.SkillTypeLearned ? (
            <CombinedSkillsTable
              data={combinedSkillsData}
              description={statMeta.description}
            />
          ) : selectedStat === EStatistic.MonstersRevived ? (
            <CombinedMonsterTable
              data={combinedMonsterData}
              description={statMeta.description}
            />
          ) : selectedStat === EStatistic.MapZoneChoice && explorationData ? (
            <ExplorationView data={explorationData} />
          ) : currentStat ? (
            <DictionaryStatTable
              title={statMeta.name}
              description={statMeta.description}
              data={displayData}
            />
          ) : (
            <p className="text-center text-gray-500 py-8 font-figtree">
              No data available for this category
            </p>
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
