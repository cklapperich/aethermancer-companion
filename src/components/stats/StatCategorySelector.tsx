import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EStatistic } from '@/types/saveFile';
import {
  STAT_CATEGORIES,
  STATISTIC_META,
  getStatisticMeta,
} from '@/utils/statisticsLookup';

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

  const isStatAvailable = (statId: EStatistic) => {
    if (!availableStats) return true;
    return availableStats.includes(statId);
  };

  const currentMeta = getStatisticMeta(value);

  return (
    <Select value={value.toString()} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[200px] bg-gray-700 border-gray-600 text-gray-200">
        <SelectValue>
          {currentMeta?.shortName ?? 'Select stat'}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-gray-800 border-gray-700">
        {Object.entries(STAT_CATEGORIES).map(([key, category]) => {
          const availableInCategory = category.stats.filter(isStatAvailable);
          if (availableInCategory.length === 0) return null;

          return (
            <SelectGroup key={key}>
              <SelectLabel className="text-tier-basic font-alegreya">
                {category.label}
              </SelectLabel>
              {availableInCategory.map((statId) => {
                const meta = STATISTIC_META.find((m) => m.id === statId);
                if (!meta) return null;

                return (
                  <SelectItem
                    key={statId}
                    value={statId.toString()}
                    className="text-gray-200 focus:bg-gray-700 focus:text-white"
                  >
                    {meta.shortName}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          );
        })}
      </SelectContent>
    </Select>
  );
}
