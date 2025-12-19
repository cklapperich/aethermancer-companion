import { SaveFile, DIFFICULTY_NAMES } from '../types/saveFile';
import {
  getWinRate,
  getWinsByDifficulty,
  getTotalStats,
  getRecentRuns,
  getTotalMonstersUsed,
  formatNumber,
  formatPercent,
} from '../utils/parseSaveFile';
import { StatCard } from './StatCard';

interface StatsDisplayProps {
  saveFile: SaveFile;
}

export function StatsDisplay({ saveFile }: StatsDisplayProps) {
  const winRate = getWinRate(saveFile);
  const winsByDifficulty = getWinsByDifficulty(saveFile);
  const totalStats = getTotalStats(saveFile);
  const recentRuns = getRecentRuns(saveFile, 20);
  const monstersUsed = getTotalMonstersUsed(saveFile);

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <section>
        <h3
          className="text-xl font-alegreya font-bold text-tier-maverick mb-4"
          style={{ fontVariant: 'small-caps' }}
        >
          Overview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Runs"
            value={formatNumber(saveFile.RunCount)}
          />
          <StatCard
            title="Win Rate"
            value={formatPercent(winRate)}
            subtitle={`${recentRuns.filter((r) => r.DidWin).length} wins`}
          />
          <StatCard
            title="Difficulty"
            value={`${saveFile.Difficulty + 1} / ${saveFile.UnlockedDifficulty + 1}`}
            subtitle={DIFFICULTY_NAMES[saveFile.Difficulty] || 'Unknown'}
          />
          <StatCard
            title="Combats Won"
            value={formatNumber(totalStats.combatsWon)}
          />
        </div>
      </section>

      {/* Secondary Stats */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Damage"
            value={formatNumber(totalStats.damageDealt)}
          />
          <StatCard
            title="Gold Earned"
            value={formatNumber(totalStats.goldEarned)}
          />
          <StatCard
            title="Monsters Used"
            value={formatNumber(monstersUsed)}
          />
          <StatCard
            title="Mementos"
            value={formatNumber(saveFile.Mementos?.length || 0)}
          />
        </div>
      </section>

      {/* Wins by Difficulty */}
      <section>
        <h3
          className="text-xl font-alegreya font-bold text-tier-maverick mb-4"
          style={{ fontVariant: 'small-caps' }}
        >
          Wins by Difficulty
        </h3>
        <div className="bg-gray-800 rounded-lg p-4 md:p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {Object.entries(DIFFICULTY_NAMES).map(([level, name]) => {
              const wins = winsByDifficulty.get(Number(level)) || 0;
              const isUnlocked = Number(level) <= saveFile.UnlockedDifficulty;
              return (
                <div
                  key={level}
                  className={`text-center p-3 rounded-lg ${
                    isUnlocked ? 'bg-gray-700' : 'bg-gray-900 opacity-50'
                  }`}
                >
                  <p className="text-xs font-figtree text-gray-400 mb-1">{name}</p>
                  <p
                    className={`text-xl font-figtree font-bold ${
                      wins > 0 ? 'text-tier-maverick' : 'text-gray-500'
                    }`}
                  >
                    {wins}
                  </p>
                </div>
              );
            })}
          </div>
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
                      {DIFFICULTY_NAMES[run.Difficulty] || `Level ${run.Difficulty}`}
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
