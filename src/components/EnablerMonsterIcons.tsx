import { Monster } from '../types/monsters';

interface EnablerMonsterIconsProps {
  monsters: Monster[];
}

export function EnablerMonsterIcons({ monsters }: EnablerMonsterIconsProps) {
  return (
    <div className="flex gap-2 items-center justify-center">
      {monsters.map((monster) => (
        <div
          key={`${monster.name}-${monster.shifted}`}
          className="flex flex-col items-center"
        >
          <img
            src={monster.imagePath}
            alt={monster.name}
            className="w-12 h-12 rounded-full border-2 border-gray-600"
            title={monster.name}
          />
        </div>
      ))}
    </div>
  );
}
