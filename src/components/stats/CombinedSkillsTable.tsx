import { useState, useMemo } from 'react';
import { CombinedSkillEntry } from '@/utils/statisticsLookup';
import { formatNumber } from '@/utils/parseSaveFile';

interface CombinedSkillsTableProps {
  data: CombinedSkillEntry[];
  description: string;
}

type SortField = 'name' | 'learned' | 'used';
type SortDirection = 'asc' | 'desc';

export function CombinedSkillsTable({
  data,
  description,
}: CombinedSkillsTableProps) {
  const [sortField, setSortField] = useState<SortField>('learned');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'name') {
        cmp = a.name.localeCompare(b.name);
      } else if (sortField === 'learned') {
        cmp = a.learned - b.learned;
      } else {
        cmp = a.used - b.used;
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
    if (sortField !== field) return <span className="text-gray-600 ml-1">⇅</span>;
    return (
      <span className="text-tier-basic ml-1">
        {sortDirection === 'desc' ? '↓' : '↑'}
      </span>
    );
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 font-figtree">No skill data available</p>
        <p className="text-gray-500 text-sm font-figtree mt-1">{description}</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-gray-400 text-sm font-figtree mb-3">{description}</p>
      <table className="w-full text-left table-fixed">
        <thead>
          <tr className="border-b border-gray-700">
            <th
              className="py-2 pr-2 font-alegreya text-tier-basic text-sm cursor-pointer hover:text-tier-maverick w-1/2"
              onClick={() => handleSort('name')}
            >
              Type<SortIcon field="name" />
            </th>
            <th
              className="py-2 px-2 font-alegreya text-tier-basic text-sm text-right cursor-pointer hover:text-tier-maverick w-1/4"
              onClick={() => handleSort('learned')}
            >
              Learned<SortIcon field="learned" />
            </th>
            <th
              className="py-2 pl-2 font-alegreya text-tier-basic text-sm text-right cursor-pointer hover:text-tier-maverick w-1/4"
              onClick={() => handleSort('used')}
            >
              Used<SortIcon field="used" />
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
              <td className="py-1.5 pr-2 font-figtree text-gray-200 text-sm truncate">
                {entry.name}
              </td>
              <td className="py-1.5 px-2 font-figtree text-gray-300 text-sm text-right tabular-nums">
                {formatNumber(entry.learned)}
              </td>
              <td className="py-1.5 pl-2 font-figtree text-gray-300 text-sm text-right tabular-nums">
                {formatNumber(entry.used)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-gray-500 text-xs font-figtree mt-2 text-right">
        {data.length} {data.length === 1 ? 'type' : 'types'}
      </p>
    </div>
  );
}
