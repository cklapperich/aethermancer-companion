/**
 * Utility functions for working with monsters
 */

import { Monster } from '../types/monsters';
import { ActionCategory, Element, Skill, TypeTag } from '../types/skills';

/**
 * Get all 2-type combinations from a list of monsters
 * @param monsters - Array of Monster objects
 * @param ignore_self_combinations - If true, filters out any combinations that a single monster could make on its own
 * @returns Array of type combination strings in "Type1+Type2" format
 */
export function TypeCombinations(
  monsters: Monster[],
  ignore_self_combinations: boolean = false
): string[] {
  // Collect all unique types from all monsters
  const allTypes = new Set<TypeTag>();
  monsters.forEach(monster => {
    monster.types.forEach(type => allTypes.add(type));
  });

  // Generate all possible 2-type combinations
  const allTypesArray = Array.from(allTypes).sort();
  const allCombinations = new Set<string>();

  for (let i = 0; i < allTypesArray.length; i++) {
    for (let j = i + 1; j < allTypesArray.length; j++) {
      const combo = `${allTypesArray[i]}+${allTypesArray[j]}`;
      allCombinations.add(combo);
    }
  }

  // If we're ignoring self-combinations, filter them out
  if (ignore_self_combinations) {
    const selfCombinations = new Set<string>();

    // Collect all combinations each monster can make on its own
    monsters.forEach(monster => {
      const monsterCombos = monster.getSelfTypeCombinations();
      monsterCombos.forEach(combo => selfCombinations.add(combo));
    });

    // Filter out self-combinations
    const filteredCombinations = Array.from(allCombinations).filter(
      combo => !selfCombinations.has(combo)
    );

    return filteredCombinations.sort();
  }

  return Array.from(allCombinations).sort();
}

/**
 * Get all types present across a list of monsters
 * @param monsters - Array of Monster objects
 * @returns Array of unique TypeTags
 */
export function getAllTypes(monsters: Monster[]): TypeTag[] {
  const allTypes = new Set<TypeTag>();
  monsters.forEach(monster => {
    monster.types.forEach(type => allTypes.add(type));
  });
  return Array.from(allTypes).sort();
}

/**
 * Find monsters that have a specific type
 * @param monsters - Array of Monster objects
 * @param type - TypeTag to search for
 * @returns Array of monsters that have this type
 */
export function getMonstersWithType(monsters: Monster[], type: TypeTag): Monster[] {
  return monsters.filter(monster => monster.hasType(type));
}

/**
 * Represents a 2-type combination enabled by one or more teammates
 */
export interface EnabledCombo {
  combination: string;  // e.g., "Poison+Shield"
  type1: TypeTag;
  type2: TypeTag;
  enabledBy: Monster[];  // Array of teammates that enable this combo (can be 1 or 2)
}

/**
 * Represents all combos enabled for a single monster by its teammates
 */
export interface MonsterEnabledCombos {
  monster: Monster;
  enabledCombos: EnabledCombo[];
}

/**
 * For a group of 3 monsters, find all cross-monster type combinations
 * For each monster, determines which 2-type combinations are enabled by which teammates
 *
 * Note: This function returns ALL cross-monster combinations, including ones the monster
 * could make on its own. Filtering for self-combinations should be done separately if needed.
 *
 * @param monsters - Array of exactly 3 Monster objects
 * @returns Array of MonsterEnabledCombos, one for each monster
 *
 * @example
 * // Monster A has [Type1, Type2, Type3]
 * // Monster B has [Type3, Type4, Type5]
 * // Monster C has [Type6, Type7, Type8]
 * //
 * // For Monster A:
 * //   - Type1+Type4 (enabled by B)
 * //   - Type1+Type5 (enabled by B)
 * //   - Type2+Type4 (enabled by B)
 * //   - Type2+Type5 (enabled by B)
 * //   - Type3+Type6 (enabled by C)
 * //   - Type3+Type7 (enabled by C)
 * //   - Type2+Type3 (enabled by B because B has Type3)
 * //   - ... etc
 * // If both B and C have Type4, then Type1+Type4 would show enabledBy: [B, C]
 */
export function getGroupEnabledCombos(monsters: Monster[]): MonsterEnabledCombos[] {
  if (monsters.length !== 3) {
    throw new Error(`Expected exactly 3 monsters, got ${monsters.length}`);
  }

  const results: MonsterEnabledCombos[] = [];

  // Process each monster in the group
  for (let i = 0; i < monsters.length; i++) {
    const currentMonster = monsters[i];

    // Map to track combos and their enablers
    const comboMap = new Map<string, EnabledCombo>();

    // For each OTHER monster (including self for enabling purposes)
    monsters.forEach(otherMonster => {
      // For each type in current monster
      currentMonster.types.forEach(myType => {
        // For each type in other monster
        otherMonster.types.forEach(theirType => {
          // Skip if both types are the same (can't have Poison+Poison, etc.)
          if (myType === theirType) {
            return;
          }

          // Create the combination (sorted alphabetically)
          const [type1, type2] = [myType, theirType].sort();
          const combination = `${type1}+${type2}`;

          // Check if we already have this combination
          const existing = comboMap.get(combination);

          if (existing) {
            // Add this monster as an enabler if not already present
            if (!existing.enabledBy.includes(otherMonster)) {
              existing.enabledBy.push(otherMonster);
            }
          } else {
            // Create new combo entry
            comboMap.set(combination, {
              combination,
              type1,
              type2,
              enabledBy: [otherMonster]
            });
          }
        });
      });
    });

    // Convert map to array and sort
    const enabledCombos = Array.from(comboMap.values());
    enabledCombos.sort((a, b) => a.combination.localeCompare(b.combination));

    results.push({
      monster: currentMonster,
      enabledCombos
    });
  }

  return results;
}

/**
 * Get enabled combos for a single monster within a group
 * Convenience function for when you only need data for one monster
 *
 * @param targetMonster - The monster to get enabled combos for
 * @param monsters - Array of exactly 3 Monster objects (must include targetMonster)
 * @returns MonsterEnabledCombos for the target monster
 */
export function getMonsterEnabledCombos(
  targetMonster: Monster,
  monsters: Monster[]
): MonsterEnabledCombos {
  const results = getGroupEnabledCombos(monsters);
  const result = results.find(r => r.monster === targetMonster);

  if (!result) {
    throw new Error('Target monster not found in the provided group');
  }

  return result;
}

/**
 * Sort enabled combos for a monster by enabler type
 *
 * Sorting order:
 * 1. Start: External-only combos (target monster NOT in enabledBy list)
 * 2. Middle: Mixed combos (target monster in enabledBy list along with others)
 * 3. End: Self-only combos (ONLY target monster in enabledBy list)
 *
 * @param combos - Array of EnabledCombo objects
 * @param targetMonster - The monster these combos belong to
 * @returns Sorted array of EnabledCombo objects
 */
export function sortEnabledCombosBySource(
  combos: EnabledCombo[],
  targetMonster: Monster
): EnabledCombo[] {
  return [...combos].sort((a, b) => {
    const aHasSelf = a.enabledBy.includes(targetMonster);
    const bHasSelf = b.enabledBy.includes(targetMonster);

    const aIsSelfOnly = aHasSelf && a.enabledBy.length === 1;
    const bIsSelfOnly = bHasSelf && b.enabledBy.length === 1;

    const aIsExternalOnly = !aHasSelf;
    const bIsExternalOnly = !bHasSelf;

    // Self-only goes to end (highest priority value)
    if (aIsSelfOnly && !bIsSelfOnly) return 1;
    if (!aIsSelfOnly && bIsSelfOnly) return -1;

    // External-only goes to start (lowest priority value)
    if (aIsExternalOnly && !bIsExternalOnly) return -1;
    if (!aIsExternalOnly && bIsExternalOnly) return 1;

    // Within same category, maintain alphabetical order by combination name
    return a.combination.localeCompare(b.combination);
  });
}

/**
 * Represents a skill with information about which monsters enable it
 */
export interface EnabledSkill {
  skill: Skill;
  enabledBy: Monster[];  // Monsters that enable this skill (empty array for always-available skills)
  isAlwaysAvailable: boolean;  // True if the skill has no type requirements or is a signature trait
}

/**
 * Sort enabled skills for a monster by enabler type
 *
 * Sorting order:
 * 1. Start: External-only skills (target monster NOT in enabledBy list)
 * 2. Middle: Team-enabled skills (target monster in enabledBy list along with others)
 * 3. End: Self-enabled skills (ONLY target monster in enabledBy list)
 *
 * Within each category, skills are sorted alphabetically by name.
 *
 * @param skills - Array of EnabledSkill objects
 * @param targetMonster - The monster these skills belong to
 * @returns Sorted and filtered array of EnabledSkill objects (cooking skills removed for non-Domovoy)
 */
export function sortEnabledSkillsBySource(
  skills: EnabledSkill[],
  targetMonster: Monster
): EnabledSkill[] {
  // Apply all edge-case filtering
  const filteredSkills = FilterForEdgeCaseMonsters(targetMonster, skills);

  // Then sort
  return [...filteredSkills].sort((a, b) => {
    const aHasSelf = a.enabledBy.includes(targetMonster);
    const bHasSelf = b.enabledBy.includes(targetMonster);

    const aIsSelfOnly = aHasSelf && a.enabledBy.length === 1;
    const bIsSelfOnly = bHasSelf && b.enabledBy.length === 1;

    const aIsExternalOnly = !aHasSelf;
    const bIsExternalOnly = !bHasSelf;

    // Self-only goes to end (highest priority value)
    if (aIsSelfOnly && !bIsSelfOnly) return 1;
    if (!aIsSelfOnly && bIsSelfOnly) return -1;

    // External-only goes to start (lowest priority value)
    if (aIsExternalOnly && !bIsExternalOnly) return -1;
    if (!aIsExternalOnly && bIsExternalOnly) return 1;

    // Within same category, maintain alphabetical order by skill name
    return a.skill.name.localeCompare(b.skill.name);
  });
}

/**
 * Represents a group of skills enabled by the same set of monsters
 */
export interface SkillGroup {
  enablers: Monster[];  // The monsters that enable this group of skills
  skills: EnabledSkill[];  // The skills enabled by these monsters
  groupKey: string;  // Unique key for this group (sorted monster names)
  category: 'external' | 'mixed' | 'self';  // Category of enablers
}

/**
 * Group enabled skills by their enabling monsters
 *
 * @param skills - Array of EnabledSkill objects
 * @param targetMonster - The monster these skills belong to
 * @returns Array of SkillGroup objects, sorted by category (external → mixed → self)
 */
export function groupSkillsByEnablers(
  skills: EnabledSkill[],
  targetMonster: Monster
): SkillGroup[] {
  // Apply all edge-case filtering
  const filteredSkills = FilterForEdgeCaseMonsters(targetMonster, skills);

  // Create a map to group skills by their enablers
  const groupMap = new Map<string, SkillGroup>();

  filteredSkills.forEach(enabledSkill => {
    // Create a unique key based on sorted monster names
    const sortedEnablers = [...enabledSkill.enabledBy].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    const groupKey = sortedEnablers.map(m => `${m.name}-${m.shifted}`).join('|');

    // Determine category
    const hasSelf = enabledSkill.enabledBy.includes(targetMonster);
    const isSelfOnly = hasSelf && enabledSkill.enabledBy.length === 1;
    const isExternal = !hasSelf;

    let category: 'external' | 'mixed' | 'self';
    if (isSelfOnly) {
      category = 'self';
    } else if (isExternal) {
      category = 'external';
    } else {
      category = 'mixed';
    }

    // Add to existing group or create new one
    if (groupMap.has(groupKey)) {
      groupMap.get(groupKey)!.skills.push(enabledSkill);
    } else {
      groupMap.set(groupKey, {
        enablers: sortedEnablers,
        skills: [enabledSkill],
        groupKey,
        category
      });
    }
  });

  // Convert map to array and sort by category
  const groups = Array.from(groupMap.values());

  // Sort groups: external → mixed → self
  groups.sort((a, b) => {
    const categoryOrder = { external: 0, mixed: 1, self: 2 };
    const categoryDiff = categoryOrder[a.category] - categoryOrder[b.category];

    if (categoryDiff !== 0) {
      return categoryDiff;
    }

    // Within same category, sort alphabetically by group key
    return a.groupKey.localeCompare(b.groupKey);
  });

  return groups;
}

/**
 * Group enabled skills by individual enabling monsters (duplicating skills with multiple enablers)
 *
 * This function creates one group per individual monster that enables any skills.
 * Skills enabled by multiple monsters will be duplicated across those monsters' groups.
 *
 * @param skills - Array of EnabledSkill objects
 * @param targetMonster - The monster these skills belong to
 * @returns Array of SkillGroup objects, sorted by category (external → self)
 *
 * @example
 * // If Skill A is enabled by [Monster1, Monster2]:
 * // - Monster1's group will contain Skill A
 * // - Monster2's group will contain Skill A (duplicated)
 */
export function groupSkillsByIndividualEnablers(
  skills: EnabledSkill[],
  targetMonster: Monster
): SkillGroup[] {
  // Apply all edge-case filtering
  const filteredSkills = FilterForEdgeCaseMonsters(targetMonster, skills);

  // Create a map to group skills by individual monsters
  const groupMap = new Map<string, SkillGroup>();

  filteredSkills.forEach(enabledSkill => {
    // For each monster in the enabledBy array, add this skill to that monster's group
    enabledSkill.enabledBy.forEach(enabler => {
      const groupKey = `${enabler.name}-${enabler.shifted}`;

      // Determine category
      const category: 'external' | 'self' = enabler === targetMonster ? 'self' : 'external';

      // Add to existing group or create new one
      if (groupMap.has(groupKey)) {
        groupMap.get(groupKey)!.skills.push(enabledSkill);
      } else {
        groupMap.set(groupKey, {
          enablers: [enabler],
          skills: [enabledSkill],
          groupKey,
          category: category as 'external' | 'mixed' | 'self' // Cast for compatibility with SkillGroup type
        });
      }
    });
  });

  // Convert map to array and sort by category
  const groups = Array.from(groupMap.values());

  // Sort groups: external → self
  groups.sort((a, b) => {
    const categoryOrder = { external: 0, self: 1, mixed: 0 }; // mixed shouldn't happen but treat as external
    const categoryDiff = categoryOrder[a.category] - categoryOrder[b.category];

    if (categoryDiff !== 0) {
      return categoryDiff;
    }

    // Within same category, sort alphabetically by group key
    return a.groupKey.localeCompare(b.groupKey);
  });

  return groups;
}

/**
 * Filter out cooking-related skills for monsters that are not Domovoy
 * Domovoy can access all cooking skills, other monsters cannot
 *
 * @param monster - The monster to filter skills for
 * @param skills - Array of EnabledSkill objects to filter
 * @returns Filtered array of EnabledSkill objects (cooking skills removed for non-Domovoy monsters)
 */
export function filterCookingSkills(
  monster: Monster,
  skills: EnabledSkill[]
): EnabledSkill[] {
  // If this is Domovoy, allow all skills including cooking
  if (monster.name === 'Domovoy') {
    return skills;
  }

  // For other monsters, filter out cooking skills
  return skills.filter(enabledSkill => !enabledSkill.skill.isCookingAction());
}

/**
 * Filter out attack actions for Sphinx, as it can only use Support and Dedicated Support actions.
 * @param monster The monster to filter skills for
 * @param skills The skills to filter
 * @returns Filtered array of EnabledSkill objects
 */
export function filterSphinxAttackActions(
  monster: Monster,
  skills: EnabledSkill[]
): EnabledSkill[] {
  if (monster.name !== 'Sphinx') {
    return skills;
  }

  return skills.filter(enabledSkill => {
    // Keep traits and non-attack actions
    return enabledSkill.skill.getActionCategory() !== ActionCategory.Attack;
  });
}

/**
 * Applies all edge-case filtering rules for monsters.
 * - Domovoy: Can use Cooking skills.
 * - Sphinx: Cannot use Attack actions.
 * @param monster The monster to filter skills for
 * @param skills The skills to filter
 * @returns Filtered array of EnabledSkill objects
 */
export function FilterForEdgeCaseMonsters(
  monster: Monster,
  skills: EnabledSkill[]
): EnabledSkill[] {
  let filteredSkills = skills;

  // Handle Domovoy's cooking skills
  filteredSkills = filterCookingSkills(monster, filteredSkills);

  // Handle Sphinx's action restrictions
  filteredSkills = filterSphinxAttackActions(monster, filteredSkills);

  return filteredSkills;
}

/**
 * Check if a monster's elements match an action's mana cost, or if the monster has the 'Wild' element.
 * @param monster - The monster to check
 * @param action - The action with the mana cost
 * @returns True if the monster has the 'Wild' element or if any of its elements match the action's mana cost.
 */
export function checkElementMatch(monster: Monster, action: Skill): boolean {
  // Monster with 'Wild' element can always use any action
  if (monster.elements.includes(Element.Wild)) {
    return true;
  }
  // Otherwise, check for at least one matching element
  return action.manaCost.some(element => monster.elements.includes(element));
}

/**
 * Get all type-related skills (single-type and 2-type maverick) available to a monster, with enabling information.
 *
 * @param targetMonster - The monster to get skills for
 * @param allMonsters - Array of 1-3 Monster objects (the party, must include targetMonster)
 * @param allActions - Array of all available Action skills
 * @param allTraits - Array of all available Trait skills
 * @param maverickOnly - If true (default), only returns 2-type maverick skills. If false, also includes single-type skills.
 * @returns Array of EnabledSkill objects representing available skills.
 *
 * Skill availability rules:
 * - Single-type skills are available if the monster has that type (and `maverickOnly` is false).
 * - 2-type (Maverick) skills are available if the 2 types can be formed by targetMonster + teammates.
 * - Actions (both single and 2-type) also require the monster to have at least one of the action's mana cost elements.
 *
 * The enabledBy array shows which monsters contribute to enabling the skill:
 * - For single-type skills, this is `[targetMonster]`.
 * - For 2-type skills, it's the monster(s) that form the type combination.
 */
export function getMonsterSkills(
  targetMonster: Monster,
  allMonsters: Monster[],
  allActions: Skill[],
  allTraits: Skill[],
  options: { maverickOnly?: boolean } = {}
): EnabledSkill[] {
  const { maverickOnly = true } = options;
  if (allMonsters.length < 1 || allMonsters.length > 3) {
    throw new Error(`Expected 1-3 monsters, got ${allMonsters.length}`);
  }

  if (!allMonsters.includes(targetMonster)) {
    throw new Error('Target monster not found in the provided party');
  }

  // Pad the monsters array to 3 with the target monster if needed
  // This allows us to see self-combos when only 1 or 2 monsters are selected
  const paddedMonsters: [Monster, Monster, Monster] =
    allMonsters.length === 3
      ? (allMonsters as [Monster, Monster, Monster])
      : allMonsters.length === 2
      ? ([...allMonsters, targetMonster] as [Monster, Monster, Monster])
      : ([targetMonster, targetMonster, targetMonster] as [
          Monster,
          Monster,
          Monster
        ]);

  // Get all enabled combos for this monster
  const monsterCombos = getMonsterEnabledCombos(targetMonster, paddedMonsters);

  // Create a map of valid combinations for quick lookup
  const validCombos = new Map<string, Monster[]>();
  monsterCombos.enabledCombos.forEach(combo => {
    validCombos.set(combo.combination, combo.enabledBy);
  });

  const enabledSkills: EnabledSkill[] = [];

  // Process Actions - only 2-type (Maverick) actions
  // Actions also require at least one element match with the target monster
  allActions.forEach(action => {
    if (action.types.length === 2) {
      const [type1, type2] = action.types.sort();
      const combination = `${type1}+${type2}`;

      // Check if combo is valid AND at least one element matches
      if (validCombos.has(combination)) {
        // Check if target monster has at least one element from the action's mana cost
        const hasElementMatch = checkElementMatch(targetMonster, action);

        if (hasElementMatch) {
          enabledSkills.push({
            skill: action,
            enabledBy: validCombos.get(combination)!,
            isAlwaysAvailable: false
          });
        }
      }
    }
  });

  // Process Traits - only 2-type (Maverick) traits
  allTraits.forEach(trait => {
    if (trait.types.length === 2) {
      const [type1, type2] = trait.types.sort();
      const combination = `${type1}+${type2}`;

      if (validCombos.has(combination)) {
        enabledSkills.push({
          skill: trait,
          enabledBy: validCombos.get(combination)!,
          isAlwaysAvailable: false
        });
      }
    }
  });

  if (!maverickOnly) {
    // Process single-type Actions
    allActions.forEach(action => {
      if (action.types.length === 1) {
        const [type1] = action.types;
        if (targetMonster.hasType(type1)) {
          // Check if target monster has at least one element from the action's mana cost
          const hasElementMatch = checkElementMatch(targetMonster, action);

          if (hasElementMatch) {
            enabledSkills.push({
              skill: action,
              enabledBy: [targetMonster],
              isAlwaysAvailable: false
            });
          }
        }
      }
    });

    // Process single-type Traits
    allTraits.forEach(trait => {
      if (trait.types.length === 1) {
        const [type1] = trait.types;
        if (targetMonster.hasType(type1)) {
          enabledSkills.push({
            skill: trait,
            enabledBy: [targetMonster],
            isAlwaysAvailable: false
          });
        }
      }
    });
  }

  // Sort skills by enabler type (also filters cooking skills)
  return sortEnabledSkillsBySource(enabledSkills, targetMonster);
}

