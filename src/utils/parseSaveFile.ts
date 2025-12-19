import { SaveFile, SaveFileStatistic, StatisticType, PreviousRun } from '../types/saveFile';

/**
 * Parse a save file JSON and return typed SaveFile
 */
export function parseSaveFile(json: unknown): SaveFile {
  // Basic validation - check required fields exist
  if (!json || typeof json !== 'object') {
    throw new Error('Invalid save file: not an object');
  }

  const data = json as Record<string, unknown>;

  if (typeof data.RunCount !== 'number') {
    throw new Error('Invalid save file: missing RunCount');
  }

  if (!Array.isArray(data.SaveFileStatistics)) {
    throw new Error('Invalid save file: missing SaveFileStatistics');
  }

  return data as unknown as SaveFile;
}

/**
 * Calculate win rate from previous runs
 */
export function getWinRate(saveFile: SaveFile): number {
  const runs = saveFile.PreviousRuns;
  if (!runs || runs.length === 0) return 0;

  const wins = runs.filter((r) => r.DidWin).length;
  return (wins / runs.length) * 100;
}

/**
 * Get wins per difficulty level
 */
export function getWinsByDifficulty(saveFile: SaveFile): Map<number, number> {
  const stat = findStatistic(saveFile, StatisticType.WinsPerDifficulty);
  const result = new Map<number, number>();

  if (stat && !stat.IsSingleIntStat) {
    const { keys, values } = stat.IntDictionary;
    for (let i = 0; i < keys.length; i++) {
      result.set(keys[i], values[i]);
    }
  }

  return result;
}

/**
 * Get monster usage counts (returns IDs since we don't have ID mappings yet)
 */
export function getTopMonsterUsage(
  saveFile: SaveFile,
  limit: number = 10
): Array<{ id: number; count: number }> {
  const stat = findStatistic(saveFile, StatisticType.MonsterUsage);
  if (!stat || stat.IsSingleIntStat) return [];

  const { keys, values } = stat.IntDictionary;

  // Combine keys and values, sort by count
  const usage: Array<{ id: number; count: number }> = [];
  for (let i = 0; i < keys.length; i++) {
    usage.push({ id: keys[i], count: values[i] });
  }

  usage.sort((a, b) => b.count - a.count);

  return usage.slice(0, limit);
}

/**
 * Get total unique monsters used
 */
export function getTotalMonstersUsed(saveFile: SaveFile): number {
  const stat = findStatistic(saveFile, StatisticType.MonsterUsage);
  if (!stat || stat.IsSingleIntStat) return 0;
  return stat.IntDictionary.keys.length;
}

/**
 * Get aggregate stats (combats won, damage dealt, gold earned)
 */
export function getTotalStats(saveFile: SaveFile): {
  combatsWon: number;
  damageDealt: number;
  goldEarned: number;
} {
  return {
    combatsWon: getSingleStat(saveFile, StatisticType.TotalCombatsWon),
    damageDealt: getSingleStat(saveFile, StatisticType.TotalDamageDealt),
    goldEarned: getSingleStat(saveFile, StatisticType.TotalGoldEarned),
  };
}

/**
 * Get recent runs (most recent first)
 */
export function getRecentRuns(saveFile: SaveFile, limit: number = 20): PreviousRun[] {
  const runs = saveFile.PreviousRuns || [];
  // Runs are stored oldest first, so reverse and take limit
  return [...runs].reverse().slice(0, limit);
}


// Helper functions

function findStatistic(saveFile: SaveFile, type: StatisticType): SaveFileStatistic | undefined {
  return saveFile.SaveFileStatistics?.find((s) => s.StatisticType === type);
}

function getSingleStat(saveFile: SaveFile, type: StatisticType): number {
  const stat = findStatistic(saveFile, type);
  return stat?.SingleStat ?? 0;
}

/**
 * Format large numbers with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Format percentage
 */
export function formatPercent(num: number): string {
  return `${num.toFixed(1)}%`;
}
