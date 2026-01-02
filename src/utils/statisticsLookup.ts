import {
  EStatistic,
  SaveFileStatistic,
  MONSTER_TYPE_NAMES,
  ZONE_NAMES,
  AREA_NAMES,
} from '../types/saveFile';

// Import ID mapping files (extracted from game assets)
// See docs/EXTRACT_ASSET_IDS_PLAN.md for how to update these mappings
import monsterIds from '../../data/monster-ids.json';
import npcIds from '../../data/npc-ids.json';
import eventIds from '../../data/event-ids.json';

// Type-safe ID lookups
const MONSTER_ID_MAP: Record<string, string> = monsterIds as Record<string, string>;
const NPC_ID_MAP: Record<string, string> = npcIds as Record<string, string>;
const EVENT_ID_MAP: Record<string, string> = eventIds as Record<string, string>;

// Lookup functions for ID-based statistics
export function getMonsterName(id: number): string {
  const name = MONSTER_ID_MAP[id.toString()];
  if (name && name !== 'Unknown Monster') {
    return name;
  }
  return `Monster #${id}`;
}

export function getNpcName(id: number): string {
  const name = NPC_ID_MAP[id.toString()];
  if (name && name !== 'Unknown NPC') {
    return name;
  }
  return `NPC #${id}`;
}

export function getEventName(id: number): string {
  const name = EVENT_ID_MAP[id.toString()];
  if (name) {
    return name;
  }
  return `Event #${id}`;
}

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
    name: 'Monster Stats',
    shortName: 'Monsters',
    isSingleInt: false,
    description: 'Monster interactions across all runs',
  },
  {
    id: EStatistic.SkillTypeLearned,
    name: 'Skills by Type',
    shortName: 'Skills',
    isSingleInt: false,
    description: 'Skills learned and used by type',
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
    // Note: This is now combined with SkillTypeLearned in the UI
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
    name: 'Exploration',
    shortName: 'Exploration',
    isSingleInt: false,
    description: 'Zones, areas, and events visited',
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

  // Area names are mapped
  if (type === EStatistic.AreaVisitedCount) {
    return (id: number) => AREA_NAMES[id] ?? `Area #${id}`;
  }

  // Use ID mapping files for these stats
  switch (type) {
    case EStatistic.MonstersRevived:
    case EStatistic.EnemyMonsterKilled:
    case EStatistic.PlayerMonsterKilledByMonster:
    case EStatistic.RunDefeatedByEnemyMonster:
      return getMonsterName;
    case EStatistic.NPCInteraction:
      return getNpcName;
    case EStatistic.SmallEventUsedCount:
      return getEventName;
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

// Stats that are combined into other views and shouldn't appear separately
const COMBINED_STATS = [
  EStatistic.SkillTypeUsed, // Combined with SkillTypeLearned
  EStatistic.EnemyMonsterKilled, // Combined with MonstersRevived
  EStatistic.PlayerMonsterKilledByMonster, // Combined with MonstersRevived
  EStatistic.RunDefeatedByEnemyMonster, // Combined with MonstersRevived
  EStatistic.AreaVisitedCount, // Combined with MapZoneChoice
  EStatistic.SmallEventUsedCount, // Combined with MapZoneChoice
  EStatistic.LurkerTeethSpent, // Shown in run stats overview
  EStatistic.ElementalChallengeFailedCount, // Shown in run stats overview
  EStatistic.GoldSpentAtMerchant, // Shown in run stats overview
  EStatistic.ItemsBoughtAtMerchant, // Shown in run stats overview
  EStatistic.MaverickSkillLearned, // Shown in run stats overview
];

// Get all stats available in the save file (excluding combined stats)
export function getAvailableStats(
  statistics: SaveFileStatistic[]
): EStatistic[] {
  return statistics
    .map((s) => s.StatisticType as EStatistic)
    .filter((s) => !COMBINED_STATS.includes(s));
}

// Combined skill entry for display
export interface CombinedSkillEntry {
  id: number;
  name: string;
  learned: number;
  used: number;
}

// Combine skills learned and used into a single dataset
export function getCombinedSkillData(
  statistics: SaveFileStatistic[],
  nameLookup: (id: number) => string
): CombinedSkillEntry[] {
  const learnedStat = getStatByType(statistics, EStatistic.SkillTypeLearned);
  const usedStat = getStatByType(statistics, EStatistic.SkillTypeUsed);

  // Collect all unique skill type IDs
  const allIds = new Set<number>();
  if (learnedStat && !learnedStat.IsSingleIntStat) {
    learnedStat.IntDictionary.keys.forEach((k) => allIds.add(k));
  }
  if (usedStat && !usedStat.IsSingleIntStat) {
    usedStat.IntDictionary.keys.forEach((k) => allIds.add(k));
  }

  // Build lookup maps
  const learnedMap = new Map<number, number>();
  const usedMap = new Map<number, number>();

  if (learnedStat && !learnedStat.IsSingleIntStat) {
    learnedStat.IntDictionary.keys.forEach((k, i) => {
      learnedMap.set(k, learnedStat.IntDictionary.values[i]);
    });
  }
  if (usedStat && !usedStat.IsSingleIntStat) {
    usedStat.IntDictionary.keys.forEach((k, i) => {
      usedMap.set(k, usedStat.IntDictionary.values[i]);
    });
  }

  // Create combined entries
  const entries: CombinedSkillEntry[] = [];
  allIds.forEach((id) => {
    entries.push({
      id,
      name: nameLookup(id),
      learned: learnedMap.get(id) ?? 0,
      used: usedMap.get(id) ?? 0,
    });
  });

  // Sort by learned count descending by default
  return entries.sort((a, b) => b.learned - a.learned);
}

// Combined monster entry for display
export interface CombinedMonsterEntry {
  id: number;
  name: string;
  revived: number;
  killed: number;
  deaths: number;
  runEnders: number;
}

// Combine all monster stats into a single dataset
export function getCombinedMonsterData(
  statistics: SaveFileStatistic[],
  nameLookup: (id: number) => string
): CombinedMonsterEntry[] {
  const revivedStat = getStatByType(statistics, EStatistic.MonstersRevived);
  const killedStat = getStatByType(statistics, EStatistic.EnemyMonsterKilled);
  const deathsStat = getStatByType(statistics, EStatistic.PlayerMonsterKilledByMonster);
  const runEndersStat = getStatByType(statistics, EStatistic.RunDefeatedByEnemyMonster);

  // Collect all unique monster IDs
  const allIds = new Set<number>();
  [revivedStat, killedStat, deathsStat, runEndersStat].forEach((stat) => {
    if (stat && !stat.IsSingleIntStat) {
      stat.IntDictionary.keys.forEach((k) => allIds.add(k));
    }
  });

  // Build lookup maps
  const buildMap = (stat: SaveFileStatistic | undefined) => {
    const map = new Map<number, number>();
    if (stat && !stat.IsSingleIntStat) {
      stat.IntDictionary.keys.forEach((k, i) => {
        map.set(k, stat.IntDictionary.values[i]);
      });
    }
    return map;
  };

  const revivedMap = buildMap(revivedStat);
  const killedMap = buildMap(killedStat);
  const deathsMap = buildMap(deathsStat);
  const runEndersMap = buildMap(runEndersStat);

  // Create combined entries
  const entries: CombinedMonsterEntry[] = [];
  allIds.forEach((id) => {
    entries.push({
      id,
      name: nameLookup(id),
      revived: revivedMap.get(id) ?? 0,
      killed: killedMap.get(id) ?? 0,
      deaths: deathsMap.get(id) ?? 0,
      runEnders: runEndersMap.get(id) ?? 0,
    });
  });

  // Sort by killed count descending by default
  return entries.sort((a, b) => b.killed - a.killed);
}

// Exploration data structure (3 separate tables)
export interface ExplorationData {
  zones: StatEntry[];
  areas: StatEntry[];
  events: StatEntry[];
}

// Get all exploration data for the combined view
export function getExplorationData(
  statistics: SaveFileStatistic[]
): ExplorationData {
  const zoneStat = getStatByType(statistics, EStatistic.MapZoneChoice);
  const areaStat = getStatByType(statistics, EStatistic.AreaVisitedCount);
  const eventStat = getStatByType(statistics, EStatistic.SmallEventUsedCount);

  const zoneLookup = getNameLookup(EStatistic.MapZoneChoice);
  const areaLookup = getNameLookup(EStatistic.AreaVisitedCount);
  const eventLookup = getNameLookup(EStatistic.SmallEventUsedCount);

  return {
    zones: dictionaryToSortedArray(zoneStat, zoneLookup),
    areas: dictionaryToSortedArray(areaStat, areaLookup),
    events: dictionaryToSortedArray(eventStat, eventLookup),
  };
}
