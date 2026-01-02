// Aethermancer Save File Type Definitions
// Based on game version 0.5.1

export interface SaveFile {
  // Version info
  LastSynced: number;
  LastUpdated: number;
  GameVersionMajor: number;
  GameVersionMinor: number;
  GameVersionPatch: number;
  GameVersionBuild: number;

  // Run tracking
  RunCount: number;
  DidWin: boolean;
  Difficulty: number;
  UnlockedDifficulty: number;

  // Resources
  Gold: number;
  GoldSpent: number;
  PrimaryMetaResource: number;
  SecondaryMetaResource: number;
  PrimaryMetaResourceGainedInRun: number;
  SecondaryMetaResourceGainedInRun: number;
  MonsterSouls: number;
  BlankMemento: number;
  SkillRerolls: number;
  ShrineRerolls: number;

  // Current run state
  Seed: number;
  CurrentArea: number;
  TotalCombatsFoughtThisRun: number;

  // Collections
  AllMonsters: SaveMonster[];
  ActiveMonsters: number[];
  Mementos: SaveMemento[];
  MetaUpgrades: { ID: number }[];
  Boons: SaveBoon[];
  UnlockedNPCs: number[];

  // History
  PreviousRuns: PreviousRun[];
  SaveFileStatistics: SaveFileStatistic[];
}

export interface SaveMonster {
  ID: number;
  Nickname: string;
  HasNicknameSet: boolean;
  Level: number;
  XP: number;
  WorthinessLevel: number;
  CurrentWorthiness: number;
  Traits: { ID: number }[];
  Actions: SaveAction[];
  Equipment: SaveEquipment;
  Perks: unknown[];
  Corruption: number;
  MaxHealthIncrease: number;
  Shift: number;
}

export interface SaveAction {
  ID: number;
  IsTemporary: boolean;
  IsBreachTheVoid: boolean;
}

export interface SaveEquipment {
  ID: number;
  Multiplier: number;
  Affixes: unknown[];
}

export interface SaveMemento {
  ID: number;
  HasSoul: boolean;
  Shift: number;
}

export interface SaveBoon {
  ID: number;
  CombatCount: number;
}

export interface PreviousRun {
  RunID: number;
  Difficulty: number;
  Gold: number;
  GoldSpent: number;
  PrimaryMetaResourceGainedInRun: number;
  SecondaryMetaResourceGainedInRun: number;
  MementosUnlockedInRun: SaveMemento[];
  NPCsUnlockedInRun: number[];
  DidWin: boolean;
}

export interface SaveFileStatistic {
  StatisticType: number; // EStatistic enum value
  IsSingleIntStat: boolean;
  IntDictionary: {
    keys: number[];
    values: number[];
  };
  SingleStat: number;
}

// EStatistic enum from game - matches save file StatisticType values
export enum EStatistic {
  MonstersRevived = 0,
  SkillTypeLearned = 1,
  MaverickSkillLearned = 2,
  SkillTypeUsed = 3,
  TriggerTypeTriggered = 4,
  EnemyMonsterKilled = 5,
  PlayerMonsterKilledByMonster = 6,
  RunDefeatedByEnemyMonster = 7,
  NPCInteraction = 8,
  MapZoneChoice = 9,
  ItemsBoughtAtMerchant = 10,
  GoldSpentAtMerchant = 11,
  AreaVisitedCount = 12,
  SmallEventUsedCount = 13,
  ElementalChallengeFailedCount = 14,
  LurkerTeethSpent = 15,
}

// EMonsterType enum for SkillTypeLearned/SkillTypeUsed
export const MONSTER_TYPE_NAMES: Record<number, string> = {
  0: 'Aether',
  1: 'Affliction',
  2: 'Age',
  3: 'Burn',
  4: 'Critical',
  5: 'Dodge',
  6: 'Heal',
  7: 'Poison',
  8: 'Power',
  9: 'Purge',
  10: 'Regeneration',
  11: 'Shield',
  12: 'Sidekick',
  15: 'Tank',
  16: 'Terror',
  19: 'Weakness',
  20: 'Force',
  21: 'Summon',
};

// EPortalCustomization enum for MapZoneChoice
export const ZONE_NAMES: Record<number, string> = {
  0: 'None',
  1: 'Witch',
  2: 'Knight',
  3: 'Merchant',
  4: 'Aether Springs',
  5: 'Gold',
  6: 'Aether Drop',
  7: 'Mystery NPC',
  8: 'Cook',
  9: 'Envoy',
  10: 'Epic Loot',
  11: 'Rare Loot',
};

// EDifficulty enum from game
// 0 = Undefined, 1 = Normal, 2 = Heroic, 3 = Mythic
export const DIFFICULTY_NAMES: Record<number, string> = {
  1: 'Normal',
  2: 'Heroic',
  3: 'Mythic',
};
