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

  // State for collapsed skills lists (false = expanded, true = collapsed)
  const [collapsedStates, setCollapsedStates] = useState<[boolean, boolean, boolean]>([
    false,
    false,
    false,
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

  // Handler for toggling collapse state
  const handleToggleCollapse = (index: 0 | 1 | 2) => () => {
    setCollapsedStates((prev) => {
      const newStates: [boolean, boolean, boolean] = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
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
    <div className="min-h-screen text-white p-4 md:p-6 lg:p-10 overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-alegreya font-bold text-center mb-2 text-tier-maverick" style={{ fontVariant: 'small-caps' }}>Tiberion's Monster Scroll</h1>
            <h2 className="text-lg md:text-xl font-alegreya text-center text-tier-basic" style={{ fontVariant: 'small-caps' }}>search for Maverick Skills</h2>
          </div>
          <img src="/assets/TiberionIcon.webp" alt="Tiberion Icon" className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 ml-4" />
        </div>
        <div>
          <hr className="border-tier-basic" />
        </div>
        {/* Responsive Monster Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {[0, 1, 2].map((index) => {
            const i = index as 0 | 1 | 2;
            return (
              <div key={index} className="flex flex-col min-w-0">
                <div className="flex items-center gap-4 pr-4">
                  <div className="flex-1">
                    <MonsterSelect
                      monsters={monsters}
                      value={selectedMonsters[i]}
                      onChange={handleMonsterChange(i)}
                      placeholder={`Select Monster ${index + 1}`}
                    />
                  </div>
                  {selectedMonsterObjects[i] && (
                    <button
                      onClick={handleToggleCollapse(i)}
                      className="flex-shrink-0 p-2 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors border border-gray-600"
                      aria-label={collapsedStates[i] ? "Expand skills" : "Collapse skills"}
                    >
                      <svg
                        className={`w-4 h-4 text-gray-300 transition-transform duration-200 ${
                          collapsedStates[i] ? 'rotate-0' : 'rotate-90'
                        }`}
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M9 5l7 7-7 7V5z" />
                      </svg>
                    </button>
                  )}
                </div>
                {/* Skills List */}
                {selectedMonsterObjects[i] && !collapsedStates[i] && (
                  <MonsterSkillsList
                    targetMonster={selectedMonsterObjects[i]}
                    allMonsters={selectedMonstersList}
                    allActions={actions}
                    allTraits={traits}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
