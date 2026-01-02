import {
  EStatistic,
  SaveFileStatistic,
  MONSTER_TYPE_NAMES,
  ZONE_NAMES,
} from '../types/saveFile';

// Statistic category metadata
export interface StatisticMeta {
  id: EStatistic;
  name: string;
  shortName: string;
  isSingleInt: boolean;
  description: string;
}

// All 16 statistics with metadata
export const STATISTIC_META: StatisticMeta[] = [
  {
    id: EStatistic.MonstersRevived,
    name: 'Monsters Revived',
    shortName: 'Revived',
    isSingleInt: false,
    description: 'Times each monster was revived',
  },
  {
    id: EStatistic.SkillTypeLearned,
    name: 'Skills Learned by Type',
    shortName: 'Skills Learned',
    isSingleInt: false,
    description: 'Number of skills learned by type',
  },
  {
    id: EStatistic.MaverickSkillLearned,
    name: 'Maverick Skills Learned',
    shortName: 'Maverick Skills',
    isSingleInt: true,
    description: 'Total Maverick skills learned',
  },
  {
    id: EStatistic.SkillTypeUsed,
    name: 'Skills Used by Type',
    shortName: 'Skills Used',
    isSingleInt: false,
    description: 'Number of times each skill type was used',
  },
  {
    id: EStatistic.TriggerTypeTriggered,
    name: 'Triggers Activated',
    shortName: 'Triggers',
    isSingleInt: false,
    description: 'Trigger effects activated',
  },
  {
    id: EStatistic.EnemyMonsterKilled,
    name: 'Enemies Killed',
    shortName: 'Enemies Killed',
    isSingleInt: false,
    description: 'Enemies killed by monster type',
  },
  {
    id: EStatistic.PlayerMonsterKilledByMonster,
    name: 'Deaths by Monster',
    shortName: 'Deaths By',
    isSingleInt: false,
    description: 'Your monsters killed by enemy type',
  },
  {
    id: EStatistic.RunDefeatedByEnemyMonster,
    name: 'Runs Ended by Monster',
    shortName: 'Run Enders',
    isSingleInt: false,
    description: 'Runs ended by each enemy monster',
  },
  {
    id: EStatistic.NPCInteraction,
    name: 'NPC Interactions',
    shortName: 'NPC Visits',
    isSingleInt: false,
    description: 'Times each NPC was visited',
  },
  {
    id: EStatistic.MapZoneChoice,
    name: 'Zone Choices',
    shortName: 'Zones',
    isSingleInt: false,
    description: 'Times each zone type was chosen',
  },
  {
    id: EStatistic.ItemsBoughtAtMerchant,
    name: 'Items Purchased',
    shortName: 'Items Bought',
    isSingleInt: true,
    description: 'Total items bought from merchants',
  },
  {
    id: EStatistic.GoldSpentAtMerchant,
    name: 'Gold Spent at Merchants',
    shortName: 'Gold Spent',
    isSingleInt: true,
    description: 'Total gold spent at merchants',
  },
  {
    id: EStatistic.AreaVisitedCount,
    name: 'Areas Visited',
    shortName: 'Areas',
    isSingleInt: false,
    description: 'Times each area was visited',
  },
  {
    id: EStatistic.SmallEventUsedCount,
    name: 'Small Events Used',
    shortName: 'Events',
    isSingleInt: false,
    description: 'Small events encountered',
  },
  {
    id: EStatistic.ElementalChallengeFailedCount,
    name: 'Elemental Challenges Failed',
    shortName: 'Challenges Failed',
    isSingleInt: true,
    description: 'Failed elemental challenges',
  },
  {
    id: EStatistic.LurkerTeethSpent,
    name: 'Lurker Teeth Spent',
    shortName: 'Teeth Spent',
    isSingleInt: true,
    description: 'Total Lurker Teeth spent',
  },
];

// Category groups for dropdown organization (dictionary stats only - single-int stats are in Overview)
export const STAT_CATEGORIES = {
  monsters: {
    label: 'Monster Stats',
    stats: [
      EStatistic.MonstersRevived,
      EStatistic.EnemyMonsterKilled,
      EStatistic.PlayerMonsterKilledByMonster,
      EStatistic.RunDefeatedByEnemyMonster,
    ],
  },
  skills: {
    label: 'Skill Stats',
    stats: [
      EStatistic.SkillTypeLearned,
      EStatistic.SkillTypeUsed,
      EStatistic.TriggerTypeTriggered,
    ],
  },
  exploration: {
    label: 'Exploration',
    stats: [
      EStatistic.MapZoneChoice,
      EStatistic.AreaVisitedCount,
      EStatistic.SmallEventUsedCount,
    ],
  },
  other: {
    label: 'Other',
    stats: [EStatistic.NPCInteraction],
  },
} as const;

// Get statistic metadata by type
export function getStatisticMeta(type: EStatistic): StatisticMeta | undefined {
  return STATISTIC_META.find((m) => m.id === type);
}

// Find a statistic in the array by type
export function getStatByType(
  statistics: SaveFileStatistic[],
  type: EStatistic
): SaveFileStatistic | undefined {
  return statistics.find((s) => s.StatisticType === type);
}

// Check if a stat type uses monster IDs (Referenceable.ID - need mapping from game assets)
export function isMonsterStat(type: EStatistic): boolean {
  return [
    EStatistic.MonstersRevived,
    EStatistic.EnemyMonsterKilled,
    EStatistic.PlayerMonsterKilledByMonster,
    EStatistic.RunDefeatedByEnemyMonster,
  ].includes(type);
}

// Check if a stat type uses skill type IDs (EMonsterType)
export function isSkillTypeStat(type: EStatistic): boolean {
  return [EStatistic.SkillTypeLearned, EStatistic.SkillTypeUsed].includes(type);
}

// Get appropriate name lookup function based on stat type
// NOTE: Monster, NPC, Area, and Event IDs are Unity Referenceable.ID values
// These require ID mapping files extracted from game assets (see docs/EXTRACT_ASSET_IDS_PLAN.md)
export function getNameLookup(
  type: EStatistic
): (id: number) => string {
  // Skill types use EMonsterType enum which we have mapped correctly
  if (isSkillTypeStat(type)) {
    return (id: number) => MONSTER_TYPE_NAMES[id] ?? `Type #${id}`;
  }

  // Zone choices use EPortalCustomization enum which we have mapped correctly
  if (type === EStatistic.MapZoneChoice) {
    return (id: number) => ZONE_NAMES[id] ?? `Zone #${id}`;
  }

  // For these stats, we need to extract ID mappings from game assets
  // For now, show raw IDs
  switch (type) {
    case EStatistic.MonstersRevived:
    case EStatistic.EnemyMonsterKilled:
    case EStatistic.PlayerMonsterKilledByMonster:
    case EStatistic.RunDefeatedByEnemyMonster:
      return (id: number) => `Monster #${id}`;
    case EStatistic.NPCInteraction:
      return (id: number) => `NPC #${id}`;
    case EStatistic.AreaVisitedCount:
      return (id: number) => `Area #${id}`;
    case EStatistic.SmallEventUsedCount:
      return (id: number) => `Event #${id}`;
    case EStatistic.TriggerTypeTriggered:
      return (id: number) => `Trigger #${id}`;
    default:
      return (id: number) => `ID #${id}`;
  }
}

// Stat entry for display
export interface StatEntry {
  id: number;
  name: string;
  value: number;
}

// Convert IntDictionary to sorted array for display
export function dictionaryToSortedArray(
  stat: SaveFileStatistic | undefined,
  nameLookup: (id: number) => string
): StatEntry[] {
  if (!stat || stat.IsSingleIntStat) {
    return [];
  }

  const { keys, values } = stat.IntDictionary;
  const entries: StatEntry[] = [];

  for (let i = 0; i < keys.length; i++) {
    entries.push({
      id: keys[i],
      name: nameLookup(keys[i]),
      value: values[i],
    });
  }

  // Sort by value descending
  return entries.sort((a, b) => b.value - a.value);
}

// Get all stats available in the save file
export function getAvailableStats(
  statistics: SaveFileStatistic[]
): EStatistic[] {
  return statistics.map((s) => s.StatisticType as EStatistic);
}
