/**
 * Utility to load and validate monster data from JSON files
 * Works in both Node.js and browser environments
 */

import { Monster, MonsterData } from '../types/monsters';

/**
 * Load monsters from JSON data array and validate against MonsterData interface
 * @param jsonData - Array of monster data objects
 * @param sourceName - Name of the data source (for error messages)
 */
export function loadMonstersFromData(jsonData: any[], sourceName: string = 'data'): Monster[] {
  if (!Array.isArray(jsonData)) {
    throw new Error(`Expected array in ${sourceName}, got ${typeof jsonData}`);
  }

  const monsters: Monster[] = [];
  const errors: string[] = [];

  jsonData.forEach((item, index) => {
    try {
      validateMonsterData(item, index);
      monsters.push(new Monster(item as MonsterData));
    } catch (error) {
      errors.push(`Item ${index} (${item.name || 'unnamed'}): ${error}`);
    }
  });

  if (errors.length > 0) {
    throw new Error(`Validation errors in ${sourceName}:\n${errors.join('\n')}`);
  }

  return monsters;
}

/**
 * Validate that an object matches the MonsterData interface
 */
function validateMonsterData(data: any, _index: number): void {
  // Check required fields
  if (!data.name || typeof data.name !== 'string') {
    throw new Error('Missing or invalid "name" field');
  }

  if (typeof data.shifted !== 'boolean') {
    throw new Error('Missing or invalid "shifted" field (must be boolean)');
  }

  if (!Array.isArray(data.types)) {
    throw new Error('Missing or invalid "types" field (must be array)');
  }

  // Validate types array has exactly 3 elements
  if (data.types.length !== 3) {
    throw new Error(`types array must have exactly 3 elements, got ${data.types.length}`);
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

  if (!Array.isArray(data.elements)) {
    throw new Error('Missing or invalid "elements" field (must be array)');
  }

  // Validate elements array has 1 or 2 elements
  if (data.elements.length < 1 || data.elements.length > 2) {
    throw new Error(`elements array must have 1 or 2 elements, got ${data.elements.length}`);
  }

  // Validate element values
  const validElements = ['Fire', 'Water', 'Earth', 'Wind', 'Wild'];
  data.elements.forEach((element: any) => {
    if (!validElements.includes(element)) {
      throw new Error(`Invalid element in elements: ${element}`);
    }
  });

  // signatureTrait is optional
  if (data.signatureTrait !== undefined && typeof data.signatureTrait !== 'string') {
    throw new Error('signatureTrait must be a string if provided');
  }

  // startingHP is optional and can be null or a number
  if (data.startingHP !== undefined && data.startingHP !== null && typeof data.startingHP !== 'number') {
    throw new Error('startingHP must be a number or null if provided');
  }

  // portraitFilename is optional (imagePath is constructed automatically in Monster constructor)
  if (data.portraitFilename !== undefined && typeof data.portraitFilename !== 'string') {
    throw new Error('portraitFilename must be a string if provided');
  }
}

/**
 * Load all monsters from imported JSON data
 * For browser use: import monstersData from '../../data/monsters.json'
 * Then call: loadMonsters(monstersData)
 */
export function loadMonsters(monstersData: any[]): Monster[] {
  return loadMonstersFromData(monstersData, 'monsters.json');
}
