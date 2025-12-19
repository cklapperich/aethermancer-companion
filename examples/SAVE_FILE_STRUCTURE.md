# Aethermancer Save File Structure

Save files are JSON formatted with the `.game` extension. This document describes the structure based on game version 0.5.1.

## Top-Level Overview

| Field | Type | Description |
|-------|------|-------------|
| `LastSynced` | int | Timestamp of last Steam cloud sync |
| `LastUpdated` | int | Timestamp of last save |
| `GameVersionMajor/Minor/Patch/Build` | int | Game version that created the save |
| `RunCount` | int | Total number of runs played |
| `DidWin` | bool | Whether current/last run was a victory |
| `Difficulty` | int | Current difficulty level (0-4+) |
| `UnlockedDifficulty` | int | Highest unlocked difficulty |

## Resources

| Field | Type | Description |
|-------|------|-------------|
| `Gold` | int | Current gold in run |
| `GoldSpent` | int | Gold spent this run |
| `PrimaryMetaResource` | int | Primary currency (Aether?) for meta-progression |
| `SecondaryMetaResource` | int | Secondary currency for meta-progression |
| `PrimaryMetaResourceGainedInRun` | int | Primary currency earned this run |
| `SecondaryMetaResourceGainedInRun` | int | Secondary currency earned this run |
| `MonsterSouls` | int | Monster souls available |
| `BlankMemento` | int | Blank mementos available |
| `SkillRerolls` | int | Available skill rerolls |
| `ShrineRerolls` | int | Available shrine rerolls |

## Monster Collection

### `AllMonsters` (array)

Array of all monsters owned by the player. Each monster object:

```json
{
  "Nickname": "",
  "HasNicknameSet": true,
  "ID": 323,
  "Level": 1,
  "XP": 0,
  "WorthinessLevel": 5,
  "CurrentWorthiness": 0,
  "Traits": [
    { "ID": 1444 }
  ],
  "Actions": [
    {
      "ID": 98,
      "IsTemporary": false,
      "IsBreachTheVoid": false
    }
  ],
  "Equipment": {
    "ID": -1,
    "Multiplier": 0.0,
    "Affixes": []
  },
  "Perks": [],
  "PerkInfos": [
    {
      "IsDisabled": false,
      "Multiplier": 1.0
    }
  ],
  "PossibleAfflictionBuffs": [],
  "Corruption": 0,
  "MaxHealthIncrease": 0,
  "LevelUpInfluence": [],
  "HadNicknameSet": false,
  "Shift": 0
}
```

| Field | Description |
|-------|-------------|
| `ID` | Monster type ID (references game data) |
| `Level` | Current monster level |
| `XP` | Experience points towards next level |
| `WorthinessLevel` | Monster worthiness tier |
| `Traits` | Array of trait IDs equipped |
| `Actions` | Array of action/skill IDs equipped |
| `Equipment` | Equipped equipment with affixes |
| `Perks` / `PerkInfos` | Perk data and multipliers |
| `Corruption` | Corruption level |
| `Shift` | Monster shift variant (0 = base) |

### `ActiveMonsters` (array)

Array of monster IDs currently in the active party (during a run).

## Mementos

### `Mementos` (array)

Array of unlocked mementos:

```json
{
  "ID": 771,
  "HasSoul": false,
  "Shift": 0
}
```

| Field | Description |
|-------|-------------|
| `ID` | Memento type ID |
| `HasSoul` | Whether a soul is attached |
| `Shift` | Memento shift variant |

### `MementosUnlockedInRun` (array)

Mementos unlocked during the current run.

## Meta Progression

### `MetaUpgrades` (array)

Array of purchased meta upgrades:

```json
{ "ID": 1057 }
```

Each entry is a purchased upgrade ID.

### `Boons` (array)

Active boons for the current run:

```json
{
  "ID": 738,
  "CombatCount": 0
}
```

## NPCs

### `UnlockedNPCs` (array)

Array of NPC IDs that have been unlocked.

### `NPCsUnlockedInRun` (array)

NPCs unlocked during current run.

## Run History

### `PreviousRuns` (array)

History of completed runs:

```json
{
  "RunID": 52,
  "Difficulty": 1,
  "Gold": 41,
  "GoldSpent": 0,
  "PrimaryMetaResourceGainedInRun": 279,
  "SecondaryMetaResourceGainedInRun": 0,
  "MementosUnlockedInRun": [],
  "NPCsUnlockedInRun": [],
  "BiomeHistory": { "Entries": [] },
  "WorthinessRunData": { "Categories": [...] },
  "DidWin": false
}
```

## Current Run State

| Field | Type | Description |
|-------|------|-------------|
| `Seed` | int | RNG seed for current run |
| `CurrentArea` | int | Current area/biome |
| `CurrentBubbleID` | int | Current map bubble ID |
| `MapBubbleTier` | int | Current map tier |
| `TotalCombatsFoughtThisRun` | int | Combats completed this run |
| `IsInRestSite` | bool | Currently at a rest site |
| `PlayerPosition` | object | Player x/y/z coordinates |
| `PlayerConsumables` | array | Held consumable items |

### `Interactables` (object)

Current room interactable states:

```json
{
  "BasicInteractables": [],
  "ChestInteractables": [],
  "MonsterGroupInteractables": [],
  "SmallEventInteractables": [],
  "DialogueInteractables": [...],
  "AetherSpringInteractables": [],
  "MerchantInteractable": [],
  "MonsterShrineInteractable": [],
  "SecretRoomInteractables": []
}
```

### `MiniMap` (array)

Explored minimap coordinates:

```json
{ "x": 7, "y": 36, "z": 0 }
```

## Dialogue & Tutorials

### `DialogueProgression` (array)

Array of dialogue IDs that have been seen/completed. Contains thousands of entries tracking all dialogue progression.

### `RepeatedDialoguesPlayed` (array)

Dialogues that can repeat, tracking how many times played.

### `TutorialInfos` (array)

Tutorial completion flags:

```json
{ "Happened": true }
```

## Statistics

### `SaveFileStatistics` (array)

Aggregated gameplay statistics. Each entry has:

```json
{
  "StatisticType": 0,
  "IsSingleIntStat": false,
  "IntDictionary": {
    "keys": [718, 1007, ...],
    "values": [51, 25, ...]
  },
  "SingleStat": 0
}
```

| StatisticType | Description |
|---------------|-------------|
| 0 | Monster usage counts (keys = monster IDs) |
| 1 | Biome visits (keys = biome IDs) |
| 2 | Total gold earned (SingleStat) |
| 3 | Damage dealt by biome |
| 5 | Combat rounds per monster |
| 6 | Monster deaths |
| 7 | Monster permadeaths |
| 8 | NPC interaction counts |
| 9 | Unknown |
| 10 | Total combats won (SingleStat) |
| 11 | Total damage dealt (SingleStat) |
| 12 | Wins per difficulty |
| 13 | Unknown per biome |
| 14 | Unknown (SingleStat) |
| 15 | Unknown (SingleStat) |

## Worthiness System

### `WorthinessRunData` (object)

Tracks worthiness progress across categories:

```json
{
  "Categories": [
    { "Category": 0, "Entries": [] },
    { "Category": 1, "Entries": [] },
    ...
  ]
}
```

## Other Fields

| Field | Type | Description |
|-------|------|-------------|
| `PassedLurkerQuestion` | bool | Lurker event state |
| `UnansweredLurkerQuestionID` | int | Pending lurker question |
| `CombatVariables` | array | Combat state variables |
| `SmallEventCounter` | object | Small event tracking |
| `LootCounter` | int | Loot generation counter |
| `FullfilledPityCounter` | array | Pity system tracking |
| `BiomeHistory` | object | Biome progression history |
| `MapBubbleOrderStages` | array | Map generation stages |
| `GuaranteedMonstersForNextShrine` | array | Guaranteed shrine offerings |

## ID References

All IDs (monster, action, trait, memento, etc.) reference the game's internal data files. See the `data/` directory for mappings:

- `data/actions.json` - Action/skill definitions
- `data/traits.json` - Trait definitions
- `data/monsters.json` - Monster definitions
