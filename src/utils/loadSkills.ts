/**
 * Utility to load and validate skill data from JSON files
 * Works in both Node.js and browser environments
 */

import { Skill, SkillData } from '../types/skills';

/**
 * Load skills from JSON data array and validate against SkillData interface
 * @param jsonData - Array of skill data objects
 * @param sourceName - Name of the data source (for error messages)
 */
export function loadSkillsFromData(jsonData: any[], sourceName: string = 'data'): Skill[] {
  if (!Array.isArray(jsonData)) {
    throw new Error(`Expected array in ${sourceName}, got ${typeof jsonData}`);
  }

  const skills: Skill[] = [];
  const errors: string[] = [];

  jsonData.forEach((item, index) => {
    try {
      validateSkillData(item, index);
      skills.push(new Skill(item as SkillData));
    } catch (error) {
      errors.push(`Item ${index} (${item.name || 'unnamed'}): ${error}`);
    }
  });

  if (errors.length > 0) {
    throw new Error(`Validation errors in ${sourceName}:\n${errors.join('\n')}`);
  }

  return skills;
}

/**
 * Validate that an object matches the SkillData interface
 */
function validateSkillData(data: any, _index: number): void {
  // Check required fields
  if (!data.name || typeof data.name !== 'string') {
    throw new Error('Missing or invalid "name" field');
  }

  if (!data.skillType || typeof data.skillType !== 'string') {
    throw new Error('Missing or invalid "skillType" field');
  }

  if (!['Trait', 'Action'].includes(data.skillType)) {
    throw new Error(`Invalid skillType: ${data.skillType}`);
  }

  if (!Array.isArray(data.manaCost)) {
    throw new Error('Missing or invalid "manaCost" field (must be array)');
  }

  // Validate mana cost elements
  const validElements = ['Fire', 'Water', 'Earth', 'Wind', 'Wild'];
  data.manaCost.forEach((element: any) => {
    if (!validElements.includes(element)) {
      throw new Error(`Invalid element in manaCost: ${element}`);
    }
  });

  if (!Array.isArray(data.types)) {
    throw new Error('Missing or invalid "types" field (must be array)');
  }

  // Validate type tags
  const validTypes = [
    'Aether', 'Affliction', 'Age', 'Burn', 'Critical', 'Dodge',
    'Force', 'Heal', 'Poison', 'Power', 'Purge', 'Regeneration',
    'Shield', 'Sidekick', 'Summon', 'Tank', 'Terror', 'Weakness'
  ];
  data.types.forEach((type: any) => {
    if (!validTypes.includes(type)) {
      throw new Error(`Invalid type tag: ${type}`);
    }
  });

  if (!data.description || typeof data.description !== 'string') {
    throw new Error('Missing or invalid "description" field');
  }

  if (!data.iconFilename || typeof data.iconFilename !== 'string') {
    throw new Error('Missing or invalid "iconFilename" field');
  }

  // Action-specific validation
  if (data.skillType === 'Action') {
    // Validate optional freeAction and isSupport fields (actionCategory is computed, not stored)
    if (data.freeAction !== undefined && typeof data.freeAction !== 'boolean') {
      throw new Error('freeAction must be a boolean');
    }
    if (data.isSupport !== undefined && typeof data.isSupport !== 'boolean') {
      throw new Error('isSupport must be a boolean');
    }
  }
}

/**
 * Load all actions from imported JSON data
 * For browser use: import actionsData from '../../data/actions.json'
 * Then call: loadActions(actionsData)
 */
export function loadActions(actionsData: any[]): Skill[] {
  return loadSkillsFromData(actionsData, 'actions.json');
}

/**
 * Load all traits from imported JSON data
 * For browser use: import traitsData from '../../data/traits.json'
 * Then call: loadTraits(traitsData)
 */
export function loadTraits(traitsData: any[]): Skill[] {
  return loadSkillsFromData(traitsData, 'traits.json');
}
