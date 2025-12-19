import { SaveFile, PreviousRun } from '../types/saveFile';

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

  return data as unknown as SaveFile;
}

/**
 * Get wins per difficulty level (calculated from PreviousRuns)
 */
export function getWinsByDifficulty(saveFile: SaveFile): Map<number, number> {
  const result = new Map<number, number>();
  const runs = saveFile.PreviousRuns || [];

  for (const run of runs) {
    if (run.DidWin) {
      const current = result.get(run.Difficulty) || 0;
      result.set(run.Difficulty, current + 1);
    }
  }

  return result;
}

/**
 * Get recent runs (most recent first)
 */
export function getRecentRuns(saveFile: SaveFile, limit: number = 20): PreviousRun[] {
  const runs = saveFile.PreviousRuns || [];
  // Runs are stored oldest first, so reverse and take limit
  return [...runs].reverse().slice(0, limit);
}

/**
 * Format large numbers with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}
