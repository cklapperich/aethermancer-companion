/**
 * Core type definitions for Aethermancer skills (traits and actions)
 */

// Enums
export enum Element {
  Fire = "Fire",
  Water = "Water",
  Earth = "Earth",
  Wind = "Wind",
  Wild = "Wild"
}

export enum SkillType {
  Trait = "Trait",
  Action = "Action"
}

export enum ActionCategory {
  Attack = "Attack",
  Support = "Support",
  DedicatedSupport = "DedicatedSupport"
}

export enum TypeTag {
  Aether = "Aether",
  Affliction = "Affliction",
  Age = "Age",
  Burn = "Burn",
  Critical = "Critical",
  Dodge = "Dodge",
  Force = "Force",
  Heal = "Heal",
  Poison = "Poison",
  Power = "Power",
  Purge = "Purge",
  Regeneration = "Regeneration",
  Shield = "Shield",
  Sidekick = "Sidekick",
  Summon = "Summon",
  Tank = "Tank",
  Terror = "Terror",
  Weakness = "Weakness"
}

// Mana cost as a list of elements
export type ManaCost = Element[];

// Skill data interface
export interface SkillData {
  name: string;
  skillType: SkillType;
  manaCost: ManaCost;
  types: TypeTag[];
  description: string;
  iconFilename: string;

  // Action-specific properties (only used when skillType === SkillType.Action)
  freeAction?: boolean;
  isSupport?: boolean;  // true if this action can be used for support (affects categorization)

  // Trait-specific properties (only used when skillType === SkillType.Trait)
  signatureTrait?: boolean;
}

// Single Skill class with convenience methods
export class Skill {
  name: string;
  skillType: SkillType;
  manaCost: ManaCost;
  types: TypeTag[];
  description: string;
  iconFilename: string;

  // Action-specific properties
  freeAction?: boolean;
  isSupport?: boolean;

  // Trait-specific properties
  signatureTrait?: boolean;

  constructor(data: SkillData) {
    this.name = data.name;
    this.skillType = data.skillType;
    this.manaCost = data.manaCost;
    this.types = data.types;
    this.description = data.description;
    this.iconFilename = data.iconFilename;
    this.freeAction = data.freeAction;
    this.isSupport = data.isSupport;
    this.signatureTrait = data.signatureTrait;
  }

  /**
   * Check if this is a Maverick action (has exactly 2 types)
   */
  isMaverick(): boolean {
    return this.types.length === 2;
  }

  /**
   * Check if this skill uses a specific element in its mana cost
   */
  hasElement(element: Element): boolean {
    return this.manaCost.includes(element);
  }

  /**
   * Check if this is a starting-only action (has no types)
   */
  isStartingOnlyAction(): boolean {
    return this.types.length === 0;
  }

  /**
   * Get the action category based on flags
   * - Support: Free actions that can be used for support
   * - Attack: Actions that deal damage
   * - DedicatedSupport: All other support actions (non-free)
   */
  getActionCategory(): ActionCategory | null {
    if (this.skillType !== SkillType.Action) {
      return null;
    }

    // Free support actions -> Support
    if (this.freeAction && this.isSupport) {
      return ActionCategory.Support;
    }

    // Non-free support actions -> DedicatedSupport
    if (this.isSupport) {
      return ActionCategory.DedicatedSupport;
    }

    // Everything else is an Attack
    return ActionCategory.Attack;
  }

  /**
   * Check if this is a dedicated support action
   */
  isDedicatedSupport(): boolean {
    return this.getActionCategory() === ActionCategory.DedicatedSupport;
  }
}
