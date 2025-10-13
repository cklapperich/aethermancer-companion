import { useMemo, useState } from 'react';
import { SkillCard } from './components/SkillCard';
import { MonsterSelect } from './components/MonsterSelect';
import { MonsterSkillsList } from './components/MonsterSkillsList';
import { Monster } from './types/monsters';
import { loadActions, loadTraits } from './utils/loadSkills';
import { loadMonsters } from './utils/loadMonsters';
import actionsData from '../data/actions.json';
import traitsData from '../data/traits.json';
import monstersData from '../data/monsters.json';
import './index.css';

function App() {
  // State for selected monsters
  const [selectedMonsters, setSelectedMonsters] = useState<[string?, string?, string?]>([
    undefined,
    undefined,
    undefined,
  ]);

  // Load and validate all data
  const { monsters, actions, traits } = useMemo(() => {
    const allActions = loadActions(actionsData);
    const allTraits = loadTraits(traitsData);
    const allMonsters = loadMonsters(monstersData);

    // Sort monsters alphabetically by name
    const sortedMonsters = [...allMonsters].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    return {
      monsters: sortedMonsters,
      actions: allActions,
      traits: allTraits
    };
  }, []);

  // Handler for monster selection
  const handleMonsterChange = (index: 0 | 1 | 2) => (value: string) => {
    setSelectedMonsters((prev) => {
      const newSelection: [string?, string?, string?] = [...prev];
      newSelection[index] = value;
      return newSelection;
    });
  };

  // Get actual Monster objects from selected IDs
  const getSelectedMonsterObjects = (): [Monster?, Monster?, Monster?] => {
    return selectedMonsters.map((id) =>
      id ? monsters.find((m) => `${m.name}-${m.shifted}` === id) : undefined
    ) as [Monster?, Monster?, Monster?];
  };

  const selectedMonsterObjects = getSelectedMonsterObjects();

  // Get the list of selected monsters (non-undefined)
  const selectedMonstersList = selectedMonsterObjects.filter((m) => m !== undefined) as Monster[];

  return (
    <div className="min-h-screen text-white p-10" style={{ backgroundColor: '#000000' }}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-alegreya font-bold text-center mb-8 text-tier-maverick" style={{ fontVariant: 'small-caps' }}>Alioth's Monster Scroll</h1>
        {/* 3-Column Monster Selection Grid */}
        <div className="grid grid-cols-3 gap-8">
          {/* Column 1 */}
          <div className="flex flex-col">
            <h2 className="text-xl font-alegreya font-bold mb-4 text-center text-tier-basic" style={{ fontVariant: 'small-caps' }}>Monster 1</h2>
            <MonsterSelect
              monsters={monsters}
              value={selectedMonsters[0]}
              onChange={handleMonsterChange(0)}
              placeholder="Select Monster 1"
            />
            {/* Skills List */}
            {selectedMonsterObjects[0] && (
              <MonsterSkillsList
                targetMonster={selectedMonsterObjects[0]}
                allMonsters={selectedMonstersList}
                allActions={actions}
                allTraits={traits}
              />
            )}
          </div>

          {/* Column 2 */}
          <div className="flex flex-col">
            <h2 className="text-xl font-alegreya font-bold mb-4 text-center text-tier-basic" style={{ fontVariant: 'small-caps' }}>Monster 2</h2>
            <MonsterSelect
              monsters={monsters}
              value={selectedMonsters[1]}
              onChange={handleMonsterChange(1)}
              placeholder="Select Monster 2"
            />
            {/* Skills List */}
            {selectedMonsterObjects[1] && (
              <MonsterSkillsList
                targetMonster={selectedMonsterObjects[1]}
                allMonsters={selectedMonstersList}
                allActions={actions}
                allTraits={traits}
              />
            )}
          </div>

          {/* Column 3 */}
          <div className="flex flex-col">
            <h2 className="text-xl font-alegreya font-bold mb-4 text-center text-tier-basic" style={{ fontVariant: 'small-caps' }}>Monster 3</h2>
            <MonsterSelect
              monsters={monsters}
              value={selectedMonsters[2]}
              onChange={handleMonsterChange(2)}
              placeholder="Select Monster 3"
            />
            {/* Skills List */}
            {selectedMonsterObjects[2] && (
              <MonsterSkillsList
                targetMonster={selectedMonsterObjects[2]}
                allMonsters={selectedMonstersList}
                allActions={actions}
                allTraits={traits}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
