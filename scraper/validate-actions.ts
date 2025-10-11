/**
 * Validation script for actions.json
 * Ensures the scraped data matches our TypeScript interfaces
 */

import { SkillData, SkillType, Element, ActionCategory, TypeTag } from '../src/types/skills';
import * as fs from 'fs';
import * as path from 'path';

// Read the actions JSON
const actionsPath = path.join(__dirname, '../data/actions.json');
const actionsData = JSON.parse(fs.readFileSync(actionsPath, 'utf-8'));

console.log(`Validating ${actionsData.length} actions...\n`);

let errors = 0;
let warnings = 0;

// Validate each action
actionsData.forEach((action: any, index: number) => {
  const prefix = `Action ${index + 1} (${action.name}):`;

  // Required fields
  if (!action.name || typeof action.name !== 'string') {
    console.error(`${prefix} Invalid name`);
    errors++;
  }

  if (action.skillType !== 'Action') {
    console.error(`${prefix} skillType must be "Action", got "${action.skillType}"`);
    errors++;
  }

  if (!Array.isArray(action.manaCost)) {
    console.error(`${prefix} manaCost must be an array`);
    errors++;
  } else {
    action.manaCost.forEach((mana: string) => {
      if (!Object.values(Element).includes(mana as Element)) {
        console.error(`${prefix} Invalid element "${mana}" in manaCost`);
        errors++;
      }
    });
  }

  if (!Array.isArray(action.types)) {
    console.error(`${prefix} types must be an array`);
    errors++;
  } else {
    action.types.forEach((type: string) => {
      if (!Object.values(TypeTag).includes(type as TypeTag)) {
        console.warn(`${prefix} Unknown type "${type}" - may need to add to TypeTag enum`);
        warnings++;
      }
    });
  }

  if (!action.description || typeof action.description !== 'string') {
    console.error(`${prefix} Invalid description`);
    errors++;
  }

  if (!action.iconFilename || typeof action.iconFilename !== 'string') {
    console.error(`${prefix} Invalid iconFilename`);
    errors++;
  }

  // Action-specific fields
  if (action.actionCategory && !Object.values(ActionCategory).includes(action.actionCategory)) {
    console.error(`${prefix} Invalid actionCategory "${action.actionCategory}"`);
    errors++;
  }

  if (action.freeAction !== undefined && typeof action.freeAction !== 'boolean') {
    console.error(`${prefix} freeAction must be boolean`);
    errors++;
  }
});

// Summary
console.log('\n=== Validation Summary ===');
console.log(`Total actions: ${actionsData.length}`);
console.log(`Errors: ${errors}`);
console.log(`Warnings: ${warnings}`);

if (errors === 0 && warnings === 0) {
  console.log('\n✓ All actions are valid!');
  process.exit(0);
} else if (errors === 0) {
  console.log('\n⚠ Validation passed with warnings');
  process.exit(0);
} else {
  console.log('\n✗ Validation failed');
  process.exit(1);
}
