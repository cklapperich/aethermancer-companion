import { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MonsterSelect } from './MonsterSelect';
import { MonsterSkillsList } from './MonsterSkillsList';
import { Monster } from '../types/monsters';
import { loadActions, loadTraits } from '../utils/loadSkills';
import { loadMonsters } from '../utils/loadMonsters';
import actionsData from '../../data/actions.json';
import traitsData from '../../data/traits.json';
import monstersData from '../../data/monsters.json';

export function TeamBuilderPage() {
  const params = useParams();
  const navigate = useNavigate();

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

  // State for selected monsters, initialized from URL params
  const [selectedMonsters, setSelectedMonsters] = useState<[string?, string?, string?]>([
    params.monster1,
    params.monster2,
    params.monster3,
  ]);

  // State for collapsed skills lists
  const [collapsedStates, setCollapsedStates] = useState<[boolean, boolean, boolean]>([
    false,
    false,
    false,
  ]);

  const [showAllSkills, setShowAllSkills] = useState(false);

  // Effect to update URL when selection changes
  const [m1, m2, m3] = selectedMonsters;
  useEffect(() => {
    const path = [m1, m2, m3].filter(Boolean).map(m => m!.toLowerCase()).join('/');
    // Use replace to avoid polluting browser history
    navigate(`/${path}`, { replace: true });
  }, [m1, m2, m3, navigate]);

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

  // Get actual Monster objects from selected IDs (case-insensitive lookup for URL compatibility)
  const getSelectedMonsterObjects = (): [Monster?, Monster?, Monster?] => {
    return selectedMonsters.map((id) =>
      id ? monsters.find((m) => (m.shifted ? `${m.name}-shifted` : m.name).toLowerCase() === id.toLowerCase()) : undefined
    ) as [Monster?, Monster?, Monster?];
  };

  const selectedMonsterObjects = getSelectedMonsterObjects();

  // Get the list of selected monsters (non-undefined)
  const selectedMonstersList = selectedMonsterObjects.filter((m) => m !== undefined) as Monster[];

  return (
    <div className="min-h-screen text-white px-4 md:px-6 lg:px-10 pt-6 pb-4 md:pb-6 lg:pb-10 overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-8">
          <input
            type="checkbox"
            id="show-all-skills"
            className="h-5 w-5 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
            checked={showAllSkills}
            onChange={(e) => setShowAllSkills(e.target.checked)}
          />
          <label htmlFor="show-all-skills" className="font-figtree text-base text-gray-300">
            Show all skills
          </label>
        </div>
        {/* Responsive Monster Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {[0, 1, 2].map((index) => {
            const i = index as 0 | 1 | 2;
            return (
              <div key={index} className="flex flex-col min-w-0">
                <div className="flex items-center gap-6 w-full">
                  <div>
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
                      className="flex-shrink-0 p-2.5 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors border border-gray-600 mr-6"
                      aria-label={collapsedStates[i] ? "Expand skills" : "Collapse skills"}
                    >
                      <svg
                        className={`w-8 h-8 text-gray-300 transition-transform duration-200 ${
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
                    targetMonster={selectedMonsterObjects[i]!}
                    allMonsters={selectedMonstersList}
                    allActions={actions}
                    allTraits={traits}
                    showAllSkills={showAllSkills}
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
