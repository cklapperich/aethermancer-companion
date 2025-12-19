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
  StatisticType: StatisticType;
  IsSingleIntStat: boolean;
  IntDictionary: {
    keys: number[];
    values: number[];
  };
  SingleStat: number;
}

// Known statistic types from save file analysis
export enum StatisticType {
  MonsterUsage = 0,
  BiomeVisits = 1,
  TotalGoldEarned = 2,
  DamageByBiome = 3,
  CombatRoundsPerMonster = 5,
  MonsterDeaths = 6,
  MonsterPermadeaths = 7,
  NPCInteractions = 8,
  TotalCombatsWon = 10,
  TotalDamageDealt = 11,
  WinsPerDifficulty = 12,
}

// EDifficulty enum from game
// 0 = Undefined, 1 = Normal, 2 = Heroic, 3 = Mythic
export const DIFFICULTY_NAMES: Record<number, string> = {
  1: 'Normal',
  2: 'Heroic',
  3: 'Mythic',
};
