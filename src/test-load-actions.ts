/**
 * Test script to validate that actions.json loads correctly
 */

import { loadActions } from './utils/loadSkills';
import actionsData from '../data/actions.json';

try {
  console.log('Loading actions from data/actions.json...');
  const actions = loadActions(actionsData);

  console.log(`✓ Successfully loaded ${actions.length} actions`);

  // Show some statistics
  const categoryCounts = {
    Attack: 0,
    Support: 0,
    DedicatedSupport: 0
  };

  const maverickActions: string[] = [];
  const startingOnlyActions: string[] = [];

  actions.forEach(action => {
    const category = action.getActionCategory();
    if (category) {
      categoryCounts[category]++;
    }

    if (action.isMaverick()) {
      maverickActions.push(action.name);
    }

    if (action.isStartingOnlyAction()) {
      startingOnlyActions.push(action.name);
    }
  });

  console.log('\nStatistics:');
  console.log(`- Attack actions: ${categoryCounts.Attack}`);
  console.log(`- Support actions: ${categoryCounts.Support}`);
  console.log(`- DedicatedSupport actions: ${categoryCounts.DedicatedSupport}`);
  console.log(`- Maverick actions (2 types): ${maverickActions.length}`);
  console.log(`- Starting-only actions (0 types): ${startingOnlyActions.length}`);

  // Show a few examples
  console.log('\nFirst 5 actions:');
  actions.slice(0, 5).forEach(action => {
    console.log(`  - ${action.name} (${action.manaCost.join('/')})`);
    console.log(`    Types: [${action.types.join(', ')}]`);
    console.log(`    Category: ${action.getActionCategory()}`);
  });

  console.log('\n✓ All validation checks passed!');

} catch (error) {
  console.error('✗ Error loading or validating actions:');
  console.error(error);
  process.exit(1);
}
