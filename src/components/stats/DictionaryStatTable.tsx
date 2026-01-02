import { StatEntry } from '@/utils/statisticsLookup';
import { formatNumber } from '@/utils/parseSaveFile';

interface DictionaryStatTableProps {
  data: StatEntry[];
  title: string;
  description: string;
  showPortraits?: boolean;
}

export function DictionaryStatTable({
  data,
  title,
  description,
}: DictionaryStatTableProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 font-figtree">No data available for {title}</p>
        <p className="text-gray-500 text-sm font-figtree mt-1">{description}</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-gray-400 text-sm font-figtree mb-3">{description}</p>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="px-3 py-2 font-alegreya text-tier-basic text-sm">
              Name
            </th>
            <th className="px-3 py-2 font-alegreya text-tier-basic text-sm text-right">
              Count
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr
              key={entry.id}
              className={`border-b border-gray-700/50 ${
                index % 2 === 0 ? 'bg-gray-800/50' : 'bg-gray-700/30'
              }`}
            >
              <td className="px-3 py-2 font-figtree text-gray-200 text-sm">
                {entry.name}
              </td>
              <td className="px-3 py-2 font-figtree text-gray-300 text-sm text-right tabular-nums">
                {formatNumber(entry.value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-gray-500 text-xs font-figtree mt-2 text-right">
        {data.length} {data.length === 1 ? 'entry' : 'entries'}
      </p>
    </div>
  );
}
