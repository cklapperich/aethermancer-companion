# Crit/Dodge Chance Reference - Complete Game Data

This document contains ALL crit and dodge chance sources from Aethermancer, scraped from game data files.

---

## Core Mechanics

### Base Values
- **Base Crit Chance**: 0%
- **Base Evasion**: 0%
- Percentages do NOT add - each chance is rolled SEPARATELY
- Example: 15% + 15% is NOT 30%, it's two independent 15% rolls
- Combined chance = 1 - (1-p1) * (1-p2) * (1-p3) * ...

### Dodge Buff Mechanic
- "Dodge" is a positive buff that can be applied to monsters
- **Normal behavior**: Dodge every 2nd hit guaranteed, lose 1 Dodge stack per dodge
- **With Haste trait**: Dodge only increases Evasion by 12% per stack, doesn't get consumed

### Glory Buff
- Increases Crit Chance by 10% and Crit Damage by 20%
- Only one stack can be applied at a time
- Currently only obtainable through Catzerker's Signature Trait "Critical Mass"

---

## BOONS (Fixed Values - Checkboxes in Calculator)

| Boon Name | Crit Chance | Evasion |
|-----------|-------------|---------|
| Crit Boon | +15% | - |
| Evasion Boon | - | +15% |
| Wind Nimble Boon | +5% | +5% |

---

## PERKS (Manual Entry)

- Every monster has 3 perks
- Some monsters have +15% Crit Chance as a perk
- Some monsters have +15% Evasion as a perk
- (Varies per monster - manual entry required)

---

## EQUIPMENT (Manual Entry)

- Equipment usually provides one chance of either crit or evade
- (Varies per item - manual entry required)

---

## TRAITS - Crit Chance Sources

### Fixed Crit Chance Bonuses (from traits.json)

| Trait | Crit Bonus | Condition | JSON Source |
|-------|------------|-----------|-------------|
| Critical Aether | +20% | Always (self) | "Crit Chance +20%.<br>On every 3 Crits: Generates Wild Aether." |
| Hunt | +15% | Aura: Allies | "Aura: Allies gain +15% Crit Chance and +2 Crit Damage." |
| Critical Purging | +15% | Always (self) | "Crit Chance +15%.<br>On every 3 Crits: Purges 1 enemy Aether." |
| Tactical Shields | +15% | Aura: Allies with 7+ Shield | "Aura: Allies with 7 or more Shield gain +1 Damage and +15% Crit Chance." |
| Levitation | +35% | Consumes a Dodge stack per attack | "Each Attack consumes a Dodge stack to gain +35% Crit Chance and +3 Crit Damage." |

### Per-Stack Crit Chance Bonuses

| Trait | Crit Bonus | Per | Condition |
|-------|------------|-----|-----------|
| Burning Mark | +5% | Burn stack on enemy | Aura: All allies |
| Cunning Minions | +10% | Minion attached | Aura: Per minion on monster |
| Vigorous Edge | +15% | Regeneration stack | Aura: Consumes 1 Regen per Attack |
| Primeval Blight (Signature) | +4% | Poison stack on enemies | Tatzelwurm (Shifted) signature |

### Conditional Crit Chance Bonuses

| Trait | Crit Bonus | Condition |
|-------|------------|-----------|
| Splatter | +25% | Aura: Against enemies with Bleed |
| Glory (buff) | +10% | While Glory buff is active |

### Guaranteed Crit Effects

| Trait | Effect |
|-------|--------|
| Sleight of Hand | "+3 Crit Damage. Every [third] Hit of an Action is a Critical Hit. For multi-target Actions, it is every [second] Hit against each monster instead." |
| Sidecrits | "This monster's Sidekick Attack is always Critical and applies 1 Bleed." |

### Other Crit-Related Traits (No direct % bonus)

| Trait | Effect |
|-------|--------|
| Critical Bleed | On Crit: Applies 1 Bleed |
| Critical Hybridization | Aura: On Crit from ally: Deals 3 Wild Damage Hit (once per Action) |
| Assault Shield | Aura: On Crit from ally: Shields them for 3 |
| Dread and Gore | Terror/Bleed stack conversion on consume |
| Evasion Mastery | Aura: Crit Chance also increases Evasion by 50% of that amount |
| Hour of Glory | 7 Crits in round: Applies Power + heals 7 |
| Toxic Assault | Every 3 Crits: Applies 2 Poison, triggers Poison |
| Critical Mass (Signature) | On Crit: 50% chance to apply a Random Buff to self |

---

## TRAITS - Evasion Sources

### Fixed Evasion Bonuses (from traits.json)

| Trait | Evasion Bonus | Condition | JSON Source |
|-------|---------------|-----------|-------------|
| Afterstorm | +10% | Aura: Allies | "Aura: Allies gain +10% Evasion." |
| Blind | 15% miss chance | Aura: Enemies with Terror | "Aura: Enemies with Terror have a 15% chance to miss each Hit." |

### Per-Stack Evasion Bonuses

| Trait | Evasion Bonus | Per | Condition |
|-------|---------------|-----|-----------|
| Haste | +12% | Dodge stack | Changes Dodge behavior - doesn't consume stacks |
| Schadenfreude (Poison variant) | +6% | 13 debuff stacks | Among all monsters in combat |
| Schadenfreude (Terror variant) | +6% | 10 debuff stacks | Among all monsters in combat |

### Derived Evasion

| Trait | Effect |
|-------|--------|
| Evasion Mastery | Aura: Crit Chance also increases Evasion by 50% of that amount |

### Conditional Evasion (Signature Traits)

| Monster | Trait | Effect |
|---------|-------|--------|
| Kitsune | (Force-based) | "While this monster has 1 or more Force, it evades the first Hit of each enemy Attack" |
| Megataur | (Power-based) | "While this monster has 2 or more Power, it evades the first Hit of each enemy Attack" |

### Dodge-Related Traits (Apply Dodge Stacks)

| Trait | Dodge Stacks | Trigger |
|-------|--------------|---------|
| Concealed | 1 to self | Start of combat + Dedicated Support Action |
| Eye of the Storm | 1 to lowest Dodge ally | Every 35 Wind/Wild damage dealt |
| Electrical Burn | 1 to self | When enemy reaches 5 Burn (once per enemy per combat) |
| Live and Learn | 2 to self | Retaliate (once per turn) |
| Martial Prowess | Sidekick to evader | Aura: When ally evades (once per ally per turn) |
| Nimble Guardian | 1 Dodge + Redirect to self | When Dodge applied to this monster (once per turn) |
| Shadow Meld | 1 to attacker | Aura: When ally attacks enemy with 3+ Terror |
| Levitation | 1 to self | Every 9 Aether consumed by allies |
| Levitation (Shifted) | 1 to self | Every 9 Aether consumed by allies (different consume effect) |
| Perseverance | 1 to ally | Aura: 10% chance when debuff applied to ally |

### On-Evade Effect Traits

| Trait | Effect |
|-------|--------|
| Afterstorm | 5 Wind damage to attacker (once per enemy per turn) |
| Tailwind | Generates Wind Aether (or Wild if 5+ Wind) - once per ally per turn |
| Martial Prowess | Applies Sidekick to evading ally |
| Serpentine Maneuvers | Every 4 evades: Applies Power to lowest Power ally |
| Blind | When enemy misses: Applies Terror to them |
L
---

## ACTIONS - Built-in Crit Chance (from actions.json)

| Action | Crit Bonus | Full Description |
|--------|------------|------------------|
| Long Slash | +20% | "1 x 10 Wind damage against all enemies.<br>+20% Crit Chance.<br>On Crit: Applies Bleed to target enemy." |
| Explosive Burst | +25% | "2 x 5 Water/Fire damage against target enemy.<br>+25% Crit Chance.<br>Critical hits Purge 1 enemy Aether." |
| Fire Blast | +30% | "4 x 4 Fire damage against target enemy.<br>+30% Crit Chance." |
| Ice Spears | +15% | "2 x 4 Water/Wind damage against all enemies.<br>+15% Crit Chance.<br>Critical Hits deal 4 additional damage." |
| Lightning Assault | +10% | "4 x 4 Fire/Wind damage against target enemy.<br>+10% Crit Chance.<br>On Crit: Applies Bleed to target enemy." |
| Cutting Wind | +25% | "1 x 1 Wind damage against all enemies.<br>+25% Crit Chance.<br>Free Action." |
| Fire Storm | +25% | "2 x 3 Fire damage against all enemies.<br>+25% Crit Chance.<br>On Crit: Triggers Burn on target enemy." |
| Lightning Chaos | +20% | "2 x 5 Fire/Wind damage against all enemies.<br>+20% Crit Chance.<br>Critical hits Purge 1 enemy Aether." |
| Reactive Storm | +15% | "3 x 3 Water/Fire damage against all enemies.<br>+15% Crit Chance.<br>On Crit: Triggers Regeneration on Lowest health ally." |

### Actions with Crit Effects (no bonus %)

| Action | Effect |
|--------|--------|
| Chain Lightning | On Crit: Additionally deals 1 x 8 damage to lowest HP enemy |
| Jewel Cutter | Critical Hits deal 4 additional damage |
| Stone Edge | First Hit is a Critical Hit. On Crit: Applies Bleed |
| Viral Burst | On Crit: Applies 2 Poison |

---

## ACTIONS - Dodge/Evasion Sources (from actions.json)

### Actions with Built-in Evasion

| Action | Evasion | Notes |
|--------|---------|-------|
| Summon Yokai | +15% | Minion: "Yokai: Evasion +15%." |

### Actions that Apply Dodge to Self

| Action | Dodge Stacks | Full Description |
|--------|--------------|------------------|
| Burning Ambition | 1 + Force | "1 x 10 Fire damage against target enemy.<br>Applies Force & Dodge to self." |
| Gust | 1 | "3 x 3 Wind damage against target enemy.<br>Applies Dodge to self." |
| Speed of Sound | 2 | "4 x 3 Wind damage against target enemy.<br>Applies 2 Dodge to self." |
| Champion's Fervor | 1 + Sidekick + Force | "Applies Sidekick, Force & Dodge to self." |

### Actions that Apply Dodge to Target Ally

| Action | Dodge Stacks | Full Description |
|--------|--------------|------------------|
| Elixir | 3 | "Heals target ally for 2 x 8.<br>Applies 3 Dodge to target ally." |
| Guard | 3 | "Applies 3 Dodge to target ally." |
| Reflective Trap | 2 | "Applies 2 Dodge to target ally.<br>Retaliate: Triggers a 2 x 5 Earth/Wind damage Attack against the enemy." |
| Wind Charm | 1 | "Applies Dodge to target ally.<br>Free Action." |
| Chilling Trap | 2 | "Applies 2 Dodge to target ally.<br>Retaliate: Applies 6 Terror to the enemy." |
| Glimmer | 2 | "Applies 2 Dodge to target ally.<br>Target generates 2 Random Aether." |
| Lightning Bolt Trap | 1 + 2 Force | "Applies 1 Dodge & 2 Force to target ally.<br>Retaliate: Deals 1 x 10 Fire/Wind damage attack against the enemy." |

### Actions that Apply Dodge to All Allies

| Action | Dodge Stacks | Condition |
|--------|--------------|-----------|
| Leaves in the Wind | 1 | Always |
| Solar Wind | 1 | On Interrupt |
| Lightning Charge | 1 | If target has Burn |
| Aether Purge | 1 | On Interrupt |

---

## MONSTERS - Dodge Type (from monsters.json)

Monsters with "Dodge" as one of their 3 types:

| Monster | All Types |
|---------|-----------|
| Minokawa | Sidekick, Dodge, Force |
| Tatzelwurm (Shifted) | Critical, Dodge, Poison |
| Wolpertinger (Shifted) | Critical, Purge, Dodge |
| Cockatrice | Tank, Burn, Dodge |
| Ravager | Critical, Dodge, Terror |
| Nosferatu | Dodge, Heal, Terror |
| Djinn | Dodge, Force, Aether |
| Djinn (Shifted) | Dodge, Purge, Aether |

---

## SPECIAL MECHANICS & EDGE CASES

### Sleight of Hand Calculation
- Single target action: Every 3rd Hit is guaranteed Critical
- Multi-target action: Every 2nd Hit against EACH monster is guaranteed Critical
- This is guaranteed, not a % chance

### Per-Stack Math (Burning Mark, Primeval Blight, etc.)
- 10 stacks of +5% = 10 independent 5% rolls
- NOT 50% combined
- Actual combined chance: 1 - (0.95)^10 = 40.1%

### Evasion Mastery Interaction
- If you have 30% Crit Chance total, you also get +15% Evasion (50% of 30%)
- This is calculated AFTER all crit bonuses are combined

### Haste Interaction
- Changes Dodge from "guaranteed every 2nd hit" to "12% Evasion per stack"(
- Dodge stacks don't get consumed when attacked
- After turn: consume 5 Dodge stacks to Reactivate turn

### Blind Miss Chance
- 15% miss chance is separate from Evasion
- Only applies to enemies with Terror stacks
- When enemy misses, they get Terror applied

---

## CALCULATOR DEFAULTS

### Assumptions
- Enemy attack: 2 hits
- Player attack: 3 hits
- Base crit: 0%
- Base evade: 0%

### Math Formula
All sources are independent rolls:
```
combined_chance = 1 - (1-p1) * (1-p2) * (1-p3) * ...
```

For per-stack sources:
```
stacked_chance = 1 - (1 - chance_per_stack) ^ num_stacks
```

For multi-hit attacks:
```
chance_at_least_one = 1 - (1 - per_hit_chance) ^ num_hits
```
