import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EStatistic } from '@/types/saveFile';
import { STATISTIC_META, getStatisticMeta } from '@/utils/statisticsLookup';

interface StatCategorySelectorProps {
  value: EStatistic;
  onChange: (value: EStatistic) => void;
  availableStats?: EStatistic[];
}

export function StatCategorySelector({
  value,
  onChange,
  availableStats,
}: StatCategorySelectorProps) {
  const handleValueChange = (newValue: string) => {
    onChange(parseInt(newValue, 10) as EStatistic);
  };

  const currentMeta = getStatisticMeta(value);

  // Filter to only show available stats
  const displayStats = STATISTIC_META.filter(
    (meta) => !availableStats || availableStats.includes(meta.id)
  );

  return (
    <Select value={value.toString()} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[160px] bg-gray-700 border-gray-600 text-gray-200">
        <SelectValue>
          {currentMeta?.shortName ?? 'Select stat'}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-gray-800 border-gray-700">
        {displayStats.map((meta) => (
          <SelectItem
            key={meta.id}
            value={meta.id.toString()}
            className="text-gray-200 focus:bg-gray-700 focus:text-white"
          >
            {meta.shortName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
