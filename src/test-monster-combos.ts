/**
 * Test script to validate monster combo logic and skills
 * Tests getGroupEnabledCombos and getMonsterSkills with Cherufe, Djinn (Shifted), and Minokawa
 */

import { loadMonsters } from './utils/loadMonsters';
import { getGroupEnabledCombos, sortEnabledCombosBySource, getMonsterSkills, sortEnabledSkillsBySource } from './utils/monsterUtils';
import { loadActions, loadTraits } from './utils/loadSkills';
import monstersData from '../data/monsters.json';
import actionsData from '../data/actions.json';
import traitsData from '../data/traits.json';

try {
  // Load all data from JSON
  console.log('Loading data...');
  const allMonsters = loadMonsters(monstersData);
  const allActions = loadActions(actionsData);
  const allTraits = loadTraits(traitsData);
  console.log(`✓ Successfully loaded ${allMonsters.length} monsters`);
  console.log(`✓ Successfully loaded ${allActions.length} actions`);
  console.log(`✓ Successfully loaded ${allTraits.length} traits\n`);

  // Find the specific monsters we want to test
  const cherufe = allMonsters.find(m => m.name === 'Cherufe' && !m.shifted);
  const djinn = allMonsters.find(m => m.name === 'Djinn' && m.shifted);
  const minokawa = allMonsters.find(m => m.name === 'Minokawa' && !m.shifted);

  if (!cherufe || !djinn || !minokawa) {
    throw new Error('Could not find required monsters in data');
  }
  console.log('Testing monster combo logic...\n');
  console.log('='.repeat(60));
  console.log('Monster Group:');
  console.log(`  1. ${cherufe.name} (${cherufe.shifted ? 'Shifted' : 'Normal'})`);
  console.log(`     Types: [${cherufe.types.join(', ')}]`);
  console.log(`     Image: ${cherufe.imagePath}`);
  console.log(`  2. ${djinn.name} (${djinn.shifted ? 'Shifted' : 'Normal'})`);
  console.log(`     Types: [${djinn.types.join(', ')}]`);
  console.log(`     Image: ${djinn.imagePath}`);
  console.log(`  3. ${minokawa.name} (${minokawa.shifted ? 'Shifted' : 'Normal'})`);
  console.log(`     Types: [${minokawa.types.join(', ')}]`);
  console.log(`     Image: ${minokawa.imagePath}`);
  console.log('='.repeat(60));

  const results = getGroupEnabledCombos([cherufe, djinn, minokawa]);

  results.forEach(({ monster, enabledCombos }) => {
    console.log(`\n\n${monster.name.toUpperCase()} (${monster.shifted ? 'SHIFTED' : 'NORMAL'})`);
    console.log('-'.repeat(60));
    console.log(`Image path: ${monster.imagePath}`);
    console.log(`Monster types: [${monster.types.join(', ')}]`);
    console.log(`Self-combinations: ${monster.getSelfTypeCombinations().join(', ')}`);
    console.log(`\nAll cross-monster combos (${enabledCombos.length}):`);

    if (enabledCombos.length === 0) {
      console.log('  (none)');
    } else {
      // Sort combos by source
      const sortedCombos = sortEnabledCombosBySource(enabledCombos, monster);

      // Categorize for display
      const externalOnly = sortedCombos.filter(c => !c.enabledBy.includes(monster));
      const mixed = sortedCombos.filter(c => c.enabledBy.includes(monster) && c.enabledBy.length > 1);
      const selfOnly = sortedCombos.filter(c => c.enabledBy.length === 1 && c.enabledBy.includes(monster));

      // Display external-only
      if (externalOnly.length > 0) {
        console.log(`\n  [EXTERNAL ONLY - ${externalOnly.length} combos]`);
        externalOnly.forEach(combo => {
          const enablerNames = combo.enabledBy.map(m => m.name).join(' & ');
          console.log(`  • ${combo.combination.padEnd(30)} enabled by: ${enablerNames}`);
        });
      }

      // Display mixed
      if (mixed.length > 0) {
        console.log(`\n  [MIXED - ${mixed.length} combos]`);
        mixed.forEach(combo => {
          const enablerNames = combo.enabledBy.map(m => m.name).join(' & ');
          console.log(`  • ${combo.combination.padEnd(30)} enabled by: ${enablerNames}`);
        });
      }

      // Display self-only
      if (selfOnly.length > 0) {
        console.log(`\n  [SELF ONLY - ${selfOnly.length} combos]`);
        selfOnly.forEach(combo => {
          const enablerNames = combo.enabledBy.map(m => m.name).join(' & ');
          console.log(`  • ${combo.combination.padEnd(30)} enabled by: ${enablerNames}`);
        });
      }
    }
  });

  // Test getMonsterSkills for each monster
  console.log('\n\n' + '='.repeat(60));
  console.log('MAVERICK SKILLS TEST');
  console.log('='.repeat(60));

  [minokawa, djinn, cherufe].forEach(monster => {
    const skills = getMonsterSkills(monster, [cherufe, djinn, minokawa], allActions, allTraits);

    console.log(`\n\n${monster.name.toUpperCase()} (${monster.shifted ? 'SHIFTED' : 'NORMAL'}) - MAVERICK SKILLS`);
    console.log('-'.repeat(60));
    console.log(`Image path: ${monster.imagePath}`);
    console.log(`Monster types: [${monster.types.join(', ')}]`);
    console.log(`Total maverick skills available: ${skills.length}`);

    // Categorize by enabler
    const selfEnabled = skills.filter(s =>
      s.enabledBy.length === 1 && s.enabledBy[0] === monster
    );
    const teamEnabled = skills.filter(s =>
      s.enabledBy.includes(monster) && s.enabledBy.length > 1
    );
    const externalEnabled = skills.filter(s =>
      !s.enabledBy.includes(monster)
    );

    // Display self-enabled skills
    if (selfEnabled.length > 0) {
      console.log(`\n  [SELF-ENABLED - ${selfEnabled.length} skills]`);
      selfEnabled.slice(0, 5).forEach(({ skill }) => {
        const manaInfo = skill.skillType === 'Action' ? ` mana:[${skill.manaCost.join(',')}]` : '';
        console.log(`  • ${skill.name.padEnd(30)} [${skill.types.join('+')}] (${skill.skillType})${manaInfo}`);
      });
      if (selfEnabled.length > 5) {
        console.log(`  ... and ${selfEnabled.length - 5} more`);
      }
    }

    // Display team-enabled skills
    if (teamEnabled.length > 0) {
      console.log(`\n  [TEAM-ENABLED - ${teamEnabled.length} skills]`);
      teamEnabled.slice(0, 5).forEach(({ skill, enabledBy }) => {
        const enablerNames = enabledBy.map(m => m.name).join(' + ');
        console.log(`  • ${skill.name.padEnd(30)} [${skill.types.join('+')}] enabled by: ${enablerNames}`);
      });
      if (teamEnabled.length > 5) {
        console.log(`  ... and ${teamEnabled.length - 5} more`);
      }
    }

    // Display external-enabled skills
    if (externalEnabled.length > 0) {
      console.log(`\n  [EXTERNAL-ENABLED - ${externalEnabled.length} skills]`);
      externalEnabled.slice(0, 5).forEach(({ skill, enabledBy }) => {
        const enablerNames = enabledBy.map(m => m.name).join(' + ');
        console.log(`  • ${skill.name.padEnd(30)} [${skill.types.join('+')}] enabled by: ${enablerNames}`);
      });
      if (externalEnabled.length > 5) {
        console.log(`  ... and ${externalEnabled.length - 5} more`);
      }
    }
  });

  console.log('\n\n' + '='.repeat(60));
  console.log('✓ All tests completed successfully!');

} catch (error) {
  console.error('✗ Error during test:');
  console.error(error);
  process.exit(1);
}
