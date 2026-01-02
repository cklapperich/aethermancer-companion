import { useState, useMemo } from 'react';
import { CombinedMonsterEntry } from '@/utils/statisticsLookup';
import { formatNumber } from '@/utils/parseSaveFile';

interface CombinedMonsterTableProps {
  data: CombinedMonsterEntry[];
  description: string;
}

type SortField = 'name' | 'revived' | 'killed' | 'deaths' | 'runEnders';
type SortDirection = 'asc' | 'desc';

export function CombinedMonsterTable({
  data,
  description,
}: CombinedMonsterTableProps) {
  const [sortField, setSortField] = useState<SortField>('killed');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'name') {
        cmp = a.name.localeCompare(b.name);
      } else {
        cmp = a[sortField] - b[sortField];
      }
      return sortDirection === 'desc' ? -cmp : cmp;
    });
  }, [data, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((d) => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="text-gray-600 ml-0.5">⇅</span>;
    return (
      <span className="text-tier-basic ml-0.5">
        {sortDirection === 'desc' ? '↓' : '↑'}
      </span>
    );
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 font-figtree">No monster data available</p>
        <p className="text-gray-500 text-sm font-figtree mt-1">{description}</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-gray-400 text-sm font-figtree mb-3">{description}</p>
      <div className="overflow-x-auto">
        <table className="w-full text-left table-fixed min-w-[400px]">
          <thead>
            <tr className="border-b border-gray-700">
              <th
                className="py-2 pr-1 font-alegreya text-tier-basic text-sm cursor-pointer hover:text-tier-maverick w-[30%]"
                onClick={() => handleSort('name')}
              >
                Monster<SortIcon field="name" />
              </th>
              <th
                className="py-2 px-1 font-alegreya text-tier-basic text-xs text-right cursor-pointer hover:text-tier-maverick w-[17%]"
                onClick={() => handleSort('revived')}
                title="Times revived"
              >
                Revived<SortIcon field="revived" />
              </th>
              <th
                className="py-2 px-1 font-alegreya text-tier-basic text-xs text-right cursor-pointer hover:text-tier-maverick w-[17%]"
                onClick={() => handleSort('killed')}
                title="Enemies killed"
              >
                Killed<SortIcon field="killed" />
              </th>
              <th
                className="py-2 px-1 font-alegreya text-tier-basic text-xs text-right cursor-pointer hover:text-tier-maverick w-[17%]"
                onClick={() => handleSort('deaths')}
                title="Your monsters killed by this enemy"
              >
                Deaths<SortIcon field="deaths" />
              </th>
              <th
                className="py-2 pl-1 font-alegreya text-tier-basic text-xs text-right cursor-pointer hover:text-tier-maverick w-[19%]"
                onClick={() => handleSort('runEnders')}
                title="Runs ended by this enemy"
              >
                Run End<SortIcon field="runEnders" />
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((entry, index) => (
              <tr
                key={entry.id}
                className={`border-b border-gray-700/50 ${
                  index % 2 === 0 ? 'bg-gray-800/50' : 'bg-gray-700/30'
                }`}
              >
                <td className="py-1.5 pr-1 font-figtree text-gray-200 text-sm truncate">
                  {entry.name}
                </td>
                <td className="py-1.5 px-1 font-figtree text-gray-300 text-sm text-right tabular-nums">
                  {formatNumber(entry.revived)}
                </td>
                <td className="py-1.5 px-1 font-figtree text-green-400 text-sm text-right tabular-nums">
                  {formatNumber(entry.killed)}
                </td>
                <td className="py-1.5 px-1 font-figtree text-red-400 text-sm text-right tabular-nums">
                  {formatNumber(entry.deaths)}
                </td>
                <td className="py-1.5 pl-1 font-figtree text-red-500 text-sm text-right tabular-nums">
                  {formatNumber(entry.runEnders)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-gray-500 text-xs font-figtree mt-2 text-right">
        {data.length} {data.length === 1 ? 'monster' : 'monsters'}
      </p>
    </div>
  );
}
