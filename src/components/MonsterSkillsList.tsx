import { Monster } from '../types/monsters';
import { Skill } from '../types/skills';
import { getMonsterSkills, groupSkillsByIndividualEnablers } from '../utils/monsterUtils';
import { SkillCard } from './SkillCard';
import { EnablerMonsterIcons } from './EnablerMonsterIcons';

interface MonsterSkillsListProps {
  targetMonster: Monster;
  allMonsters: Monster[]; // Can be 1, 2, or 3 monsters
  allActions: Skill[];
  allTraits: Skill[];
}

export function MonsterSkillsList({
  targetMonster,
  allMonsters,
  allActions,
  allTraits,
}: MonsterSkillsListProps) {
  // Get all enabled skills for this monster (works with 1, 2, or 3 monsters)
  const enabledSkills = getMonsterSkills(
    targetMonster,
    allMonsters,
    allActions,
    allTraits
  );

  // Group skills by individual enabling monsters (duplicates skills with multiple enablers)
  const skillGroups = groupSkillsByIndividualEnablers(enabledSkills, targetMonster);

  return (
    <div className="w-full max-h-[600px] overflow-y-auto space-y-6 mt-4">
      {skillGroups.map((group) => {
        // Separate actions and traits within this group
        const actions = group.skills.filter((es) => es.skill.skillType === 'Action');
        const traits = group.skills.filter((es) => es.skill.skillType === 'Trait');

        return (
          <div key={group.groupKey} className="space-y-4">
            {/* Actions in this group */}
            {actions.length > 0 && (
              <div>
                {/* Enabler Monster Icons for Actions */}
                <EnablerMonsterIcons monsters={group.enablers} />
                <h3 className="text-lg font-bold mb-2 text-orange-400 text-center">
                  Actions ({actions.length})
                </h3>
                <div className="space-y-2 flex flex-col items-center">
                  {actions.map((enabledSkill) => (
                    <SkillCard key={enabledSkill.skill.name} skill={enabledSkill.skill} />
                  ))}
                </div>
              </div>
            )}

            {/* Traits in this group */}
            {traits.length > 0 && (
              <div>
                {/* Enabler Monster Icons for Traits */}
                <EnablerMonsterIcons monsters={group.enablers} />
                <h3 className="text-lg font-bold mb-2 text-purple-400 text-center">
                  Traits ({traits.length})
                </h3>
                <div className="space-y-2 flex flex-col items-center">
                  {traits.map((enabledSkill) => (
                    <SkillCard key={enabledSkill.skill.name} skill={enabledSkill.skill} />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Empty State */}
      {skillGroups.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No maverick skills available for this team composition
        </div>
      )}
    </div>
  );
}
