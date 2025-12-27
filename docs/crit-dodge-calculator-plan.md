# Crit/Dodge Chance Calculator - Implementation Plan

## Overview

Add a 3rd tab "Chance Calculator" that lets users manually enter crit/dodge chance sources and calculates the actual probability, accounting for the fact that **ALL sources are rolled independently**.

---

## Core Math

**Key insight**: Every single source (flat bonuses, per-stack bonuses, everything) is an independent roll.

**Formula**: `combined_chance = 1 - (1-p1) * (1-p2) * (1-p3) * ...`

Example: Crit Boon (15%) + Hunt Aura (15%)
- Two independent 15% rolls
- Combined: 1 - (0.85 * 0.85) = 27.75%

Example: Burning Mark with 10 Burn stacks (+5% each)
- Ten independent 5% rolls
- Combined: 1 - (0.95)^10 = 40.1%

---

## MVP UI Structure

```
=== CRIT CHANCE CALCULATOR ===

BOONS (checkboxes)
[ ] Crit Boon (+15%)
[ ] Wind Nimble (+5%)

TRAITS (manual %)
[___] % total from traits

EQUIPMENT (manual %)
[___] % total from equipment

PERKS (manual %)
[___] % total from perks

ACTION BONUS (manual %)
[___] % (e.g. Fire Blast +30%)

PER-STACK SOURCES
Burn stacks (Burning Mark, +5% each):    [___]
Poison stacks (Primeval Blight, +4% each): [___]
Regen stacks (Vigorous Edge, +15% each):  [___]
Minions (Cunning Minions, +10% each):     [___]

SPECIAL
[ ] Glory buff (+10%)
[ ] Levitation (+35%, consumes Dodge)
[ ] Splatter active (+25%, vs Bleed)
[ ] Tactical Shields (+15%, 7+ Shield)

---
RESULT (updates in real-time):
Per-hit crit chance: XX.X%
Chance of at least 1 crit (3-hit attack): XX.X%
---

=== EVASION CALCULATOR ===

BOONS (checkboxes)
[ ] Evasion Boon (+15%)
[ ] Wind Nimble (+5%)

TRAITS (manual %)
[___] % total from traits (e.g. Afterstorm +10%)

EQUIPMENT (manual %)
[___] % total from equipment

PERKS (manual %)
[___] % total from perks

PER-STACK SOURCES
Debuff stacks (Schadenfreude, +6% per 10): [___]

DODGE STACKS (with Haste)
[ ] Haste active
Dodge stacks: [___] (x12% each with Haste)

SPECIAL
[ ] Evasion Mastery (adds 50% of crit chance)
[ ] Blind active (+15% miss chance, separate)
[ ] Yokai minion (+15%)

---
RESULT (updates in real-time):
Per-hit evasion chance: XX.X%
Chance to dodge at least 1 hit (2-hit attack): XX.X%
---
```

---

## State Structure

```typescript
interface ChanceCalculatorState {
  // === CRIT ===
  // Boons
  critBoon: boolean;           // +15%
  windNimbleCrit: boolean;     // +5%

  // Manual entry (flat %)
  traitCritPercent: number;
  equipmentCritPercent: number;
  perkCritPercent: number;
  actionCritPercent: number;

  // Per-stack (each stack = independent roll)
  burnStacks: number;          // Burning Mark: +5% each
  poisonStacks: number;        // Primeval Blight: +4% each
  regenStacks: number;         // Vigorous Edge: +15% each
  minionCount: number;         // Cunning Minions: +10% each

  // Special conditions
  hasGlory: boolean;           // +10%
  hasLevitation: boolean;      // +35%
  hasSplatter: boolean;        // +25% vs Bleed
  hasTacticalShields: boolean; // +15% with 7+ Shield

  // === EVASION ===
  // Boons
  evasionBoon: boolean;        // +15%
  windNimbleEvade: boolean;    // +5%

  // Manual entry (flat %)
  traitEvadePercent: number;
  equipmentEvadePercent: number;
  perkEvadePercent: number;

  // Per-stack
  debuffStacks: number;        // Schadenfreude: +6% per 10 stacks

  // Dodge with Haste
  hasteActive: boolean;
  dodgeStacks: number;         // +12% each with Haste

  // Special
  evasionMastery: boolean;     // +50% of crit chance
  blindActive: boolean;        // +15% miss (separate roll)
  yokaiActive: boolean;        // +15%
}
```

---

## Calculation Logic

```typescript
// Collect all independent crit chances
function calculateCritChance(state: ChanceCalculatorState): number {
  const chances: number[] = [];

  // Boons
  if (state.critBoon) chances.push(0.15);
  if (state.windNimbleCrit) chances.push(0.05);

  // Manual flat %
  if (state.traitCritPercent > 0) chances.push(state.traitCritPercent / 100);
  if (state.equipmentCritPercent > 0) chances.push(state.equipmentCritPercent / 100);
  if (state.perkCritPercent > 0) chances.push(state.perkCritPercent / 100);
  if (state.actionCritPercent > 0) chances.push(state.actionCritPercent / 100);

  // Per-stack sources (each stack is independent)
  for (let i = 0; i < state.burnStacks; i++) chances.push(0.05);
  for (let i = 0; i < state.poisonStacks; i++) chances.push(0.04);
  for (let i = 0; i < state.regenStacks; i++) chances.push(0.15);
  for (let i = 0; i < state.minionCount; i++) chances.push(0.10);

  // Special conditions
  if (state.hasGlory) chances.push(0.10);
  if (state.hasLevitation) chances.push(0.35);
  if (state.hasSplatter) chances.push(0.25);
  if (state.hasTacticalShields) chances.push(0.15);

  return combineIndependentChances(chances);
}

// Combine independent roll chances
function combineIndependentChances(chances: number[]): number {
  if (chances.length === 0) return 0;
  const missAll = chances.reduce((prod, p) => prod * (1 - p), 1);
  return 1 - missAll;
}

// Chance of at least one success in N attempts
function chanceAtLeastOne(perAttempt: number, attempts: number): number {
  return 1 - Math.pow(1 - perAttempt, attempts);
}
```

---

## Files to Create/Modify

1. **Create**: `src/components/ChanceCalculator.tsx`
2. **Modify**: `src/App.tsx` - Add 3rd tab

---

## Styling Guidelines

Match existing app styling:
- Container: `max-w-5xl mx-auto w-full`
- Headers: `font-alegreya font-bold text-tier-maverick` with `fontVariant: 'small-caps'`
- Subheaders: `font-alegreya text-tier-basic`
- Body text: `font-figtree`
- Cards/sections: `bg-gray-800/50 rounded-lg p-6`
- All sections always visible (not collapsible)
- Real-time calculation updates

---

## Fixed Defaults

- Player attack: 3 hits
- Enemy attack: 2 hits
- Base crit/evade: 0%

---

## Future Enhancements (NOT MVP)

- Dropdown to select specific traits with known values
- Dropdown to select specific actions with built-in crit %
- Sleight of Hand guaranteed crit calculation
- Integration with monster selection from Synergy Finder tab
- URL state persistence for sharing builds
