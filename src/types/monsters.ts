/**
 * Core type definitions for Aethermancer monsters
 */

import { Element, TypeTag } from './skills';

// Monster data interface
export interface MonsterData {
  name: string;
  shifted: boolean;
  types: TypeTag[];  // Array of 3 type tags
  elements: Element[];  // Array of 1-2 elements
  signatureTrait?: string;  // Name of the signature trait (optional)
  startingHP?: number | null;  // Can be null or undefined
  portraitFilename?: string;  // Filename of the portrait image (e.g., "Jotunn_Portrait.webp")
}

// Monster class with convenience methods
export class Monster {
  name: string;
  shifted: boolean;
  types: TypeTag[];
  elements: Element[];
  signatureTrait?: string;
  startingHP?: number | null;
  imagePath: string;

  constructor(data: MonsterData) {
    this.name = data.name;
    this.shifted = data.shifted;
    this.types = data.types;
    this.elements = data.elements;
    this.signatureTrait = data.signatureTrait;
    this.startingHP = data.startingHP;

    // Construct image path deterministically from name and shifted status
    const shiftedSuffix = data.shifted ? '_Shifted' : '';
    this.imagePath = `/assets/monsters/${data.name}${shiftedSuffix}_Portrait.webp`;
  }

  /**
   * Check if this monster has a specific type
   */
  hasType(type: TypeTag): boolean {
    return this.types.includes(type);
  }

  /**
   * Check if this monster uses a specific element
   */
  hasElement(element: Element): boolean {
    return this.elements.includes(element);
  }

  /**
   * Get all possible 2-type combinations from this monster's types
   */
  getSelfTypeCombinations(): string[] {
    const combinations: string[] = [];
    for (let i = 0; i < this.types.length; i++) {
      for (let j = i + 1; j < this.types.length; j++) {
        const combo = [this.types[i], this.types[j]].sort().join('+');
        combinations.push(combo);
      }
    }
    return combinations;
  }
}
