import { Monster } from '../types/monsters';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface MonsterSelectProps {
  monsters: Monster[];
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MonsterSelect({
  monsters,
  value,
  onChange,
  placeholder = 'Select a monster...',
}: MonsterSelectProps) {
  const selectedMonster = monsters.find(
    (m) => `${m.name}-${m.shifted}` === value
  );

  return (
    <div className="flex items-center gap-3">
      {/* Monster Icon Display */}
      <div className="w-16 h-16 flex-shrink-0">
        {selectedMonster ? (
          <img
            src={selectedMonster.imagePath}
            alt={selectedMonster.name}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <div className="w-full h-full bg-gray-700 rounded-md flex items-center justify-center text-gray-500 text-xs">
            ?
          </div>
        )}
      </div>

      {/* Dropdown Select */}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[240px] bg-gray-800 border-gray-600 text-white">
          <span>
            {selectedMonster
              ? `${selectedMonster.name}${selectedMonster.shifted ? ' (Shifted)' : ''}`
              : placeholder}
          </span>
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-600 text-white max-h-[400px]">
          {monsters.map((monster) => {
            const key = `${monster.name}-${monster.shifted}`;
            const displayName = monster.shifted
              ? `${monster.name} (Shifted)`
              : monster.name;

            return (
              <SelectItem
                key={key}
                value={key}
                className="cursor-pointer hover:bg-gray-700 focus:bg-gray-700"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={monster.imagePath}
                    alt={monster.name}
                    className="w-8 h-8 object-cover rounded"
                  />
                  <span>{displayName}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
