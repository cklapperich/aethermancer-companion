import { SaveFile, DIFFICULTY_NAMES } from '../types/saveFile';
import {
  getWinsByDifficulty,
  getRunsByDifficulty,
  getRecentRuns,
  formatNumber,
} from '../utils/parseSaveFile';

interface StatsDisplayProps {
  saveFile: SaveFile;
}

export function StatsDisplay({ saveFile }: StatsDisplayProps) {
  const winsByDifficulty = getWinsByDifficulty(saveFile);
  const runsByDifficulty = getRunsByDifficulty(saveFile);
  const recentRuns = getRecentRuns(saveFile, 20);

  return (
    <div className="space-y-8">
      {/* Overview */}
      <section>
        <h3
          className="text-xl font-alegreya font-bold text-tier-maverick mb-4"
          style={{ fontVariant: 'small-caps' }}
        >
          Overview
        </h3>
        <div className="bg-gray-800 rounded-lg p-4 md:p-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-gray-700">
              <p className="text-xs font-figtree text-gray-400 mb-1">Aether Crystals</p>
              <p className="text-2xl font-figtree font-bold text-tier-maverick">
                {formatNumber(saveFile.PrimaryMetaResource)}
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-700">
              <p className="text-xs font-figtree text-gray-400 mb-1">Lurker Teeth</p>
              <p className="text-2xl font-figtree font-bold text-tier-basic">
                {formatNumber(saveFile.SecondaryMetaResource)}
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-700">
              <p className="text-xs font-figtree text-gray-400 mb-1">Total Runs</p>
              <p className="text-2xl font-figtree font-bold text-white">
                {formatNumber(saveFile.RunCount)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Runs by Difficulty */}
      <section>
        <h3
          className="text-xl font-alegreya font-bold text-tier-maverick mb-4"
          style={{ fontVariant: 'small-caps' }}
        >
          Runs by Difficulty
        </h3>
        <div className="bg-gray-800 rounded-lg p-4 md:p-6">
          {(() => {
            // Get unknown difficulties
            const unknownDifficulties = Array.from(runsByDifficulty.entries())
              .filter(([level]) => level !== 1 && level !== 2 && level !== 3)
              .sort((a, b) => a[0] - b[0]);

            // Build all difficulties: Normal, Heroic, Mythic, then unknowns
            const allDifficulties: Array<{ level: number; name: string; runs: number; wins: number }> = [
              { level: 1, name: 'Normal', runs: runsByDifficulty.get(1) || 0, wins: winsByDifficulty.get(1) || 0 },
              { level: 2, name: 'Heroic', runs: runsByDifficulty.get(2) || 0, wins: winsByDifficulty.get(2) || 0 },
              { level: 3, name: 'Mythic', runs: runsByDifficulty.get(3) || 0, wins: winsByDifficulty.get(3) || 0 },
              ...unknownDifficulties.map(([level, runs]) => ({
                level,
                name: 'Unknown',
                runs,
                wins: winsByDifficulty.get(level) || 0,
              })),
            ];

            return (
              <div className={`grid gap-3 ${allDifficulties.length <= 4 ? 'grid-cols-3' : 'grid-cols-3 md:grid-cols-6'}`}>
                {allDifficulties.map(({ level, name, runs, wins }) => (
                  <div key={level} className="text-center p-3 rounded-lg bg-gray-700">
                    <p className="text-xs font-figtree text-gray-400 mb-1">{name}</p>
                    <p className="text-xl font-figtree font-bold text-white">
                      {runs}
                    </p>
                    <p className="text-xs font-figtree text-green-400">
                      {wins} {wins === 1 ? 'win' : 'wins'}
                    </p>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </section>

      {/* Run History */}
      <section>
        <h3
          className="text-xl font-alegreya font-bold text-tier-maverick mb-4"
          style={{ fontVariant: 'small-caps' }}
        >
          Recent Runs
        </h3>
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-4 py-3 font-alegreya text-tier-basic text-sm">Run</th>
                  <th className="px-4 py-3 font-alegreya text-tier-basic text-sm">Difficulty</th>
                  <th className="px-4 py-3 font-alegreya text-tier-basic text-sm">Result</th>
                  <th className="px-4 py-3 font-alegreya text-tier-basic text-sm text-right">Gold</th>
                  <th className="px-4 py-3 font-alegreya text-tier-basic text-sm text-right">Aether</th>
                </tr>
              </thead>
              <tbody>
                {recentRuns.map((run) => (
                  <tr key={run.RunID} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                    <td className="px-4 py-3 font-figtree text-gray-300">#{run.RunID}</td>
                    <td className="px-4 py-3 font-figtree text-gray-300">
                      {DIFFICULTY_NAMES[run.Difficulty] || 'Unknown'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-figtree font-semibold ${
                          run.DidWin
                            ? 'bg-green-900/50 text-green-400'
                            : 'bg-red-900/50 text-red-400'
                        }`}
                      >
                        {run.DidWin ? 'Victory' : 'Defeat'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-figtree text-gray-300 text-right">
                      {formatNumber(run.Gold + run.GoldSpent)}
                    </td>
                    <td className="px-4 py-3 font-figtree text-tier-maverick text-right">
                      +{formatNumber(run.PrimaryMetaResourceGainedInRun)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {recentRuns.length === 0 && (
            <p className="text-center text-gray-500 py-8 font-figtree">No run history available</p>
          )}
        </div>
      </section>
    </div>
  );
}
