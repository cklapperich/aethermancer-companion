# Extract ID Mappings from Game Assets

## Status: Partially Complete

The automated extraction from Unity assets was attempted but could not fully resolve the ID-to-name mappings because:
1. UnityPy cannot read custom MonoBehaviour types without the type definitions
2. The Monster, NPC, and Event data are stored as ScriptableObjects with custom serialization
3. The `ID` field is inherited from `Referenceable` and the `Name` field uses localization keys

## Current Implementation

The app now uses JSON mapping files in the `data/` directory:
- `data/monster-ids.json` - Monster ID to name mappings
- `data/npc-ids.json` - NPC ID to name mappings
- `data/event-ids.json` - Event ID to name mappings

These files contain placeholder values that need to be manually populated.

## Known Monster Names (from wiki)

29 playable monsters: Jotunn, Cherufe, Minokawa, Nixe, Ooze, Tatzelwurm, Wolpertinger, Mandragora, Orthrus, Wyrmling, Cockatrice, Warden, Ravager, Catzerker, Gargoyle, Nosferatu, Domovoy, Mephisto, Shambler, Grimoire, Star Spawn, Dark Elder, Naga, Sphinx, Djinn, Ammit, Medusa, Serket, Hecatoncheires

Boss: Chernobog (likely ID 7187)

Unreleased: Dullahan, Gama, Kullervo, Samebito

## Known IDs (from save file analysis)

Monster IDs found in save data:
273, 278, 297, 323, 324, 325, 417, 428, 619, 687, 718, 950, 951, 994, 1007, 1010, 1011, 1017, 1042, 1248, 1276, 1316, 1317, 1318, 1340, 1446, 1525, 1633, 1647, 1672, 7187

NPC IDs found:
1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 17, 19, 20, 21, 24, 25

## Manual Mapping Approaches

### Option 1: Game Testing
1. Start the game and recruit/encounter each monster
2. Check your save file to see which IDs are associated with your active monsters
3. Cross-reference with the nicknames you give monsters

### Option 2: BepInEx Mod
Create a BepInEx mod to dump the mappings at runtime:
```csharp
// BepInEx plugin to dump ID mappings
foreach (var monster in MonsterManager.Instance.AllMonsters) {
    Debug.Log($"Monster ID {monster.Key}: {monster.Value.GetName()}");
}
```

### Option 3: Community Data
Check the Aethermancer community/wiki for existing ID mappings:
- https://aethermancer.wiki.gg/wiki/Monsters
- Steam community discussions

## Extraction Scripts (for reference)

The following scripts were created during extraction attempts:
- `scripts/extract-unity-ids.py` - UnityPy-based extraction (limited success)
- `scripts/scan-all-assets.py` - Asset scanning for MonoBehaviour types
- `scripts/find-monster-ids.py` - Binary search for monster name strings

## How to Update Mappings

1. Edit the JSON files in `data/`:
   ```json
   {
     "718": "Jotunn",
     "323": "Cherufe",
     ...
   }
   ```

2. Run `npm run build` to verify the changes

3. The app will display proper names for any IDs that are mapped

## Future Work

- Create a BepInEx mod for automatic extraction
- Add a UI feature to help users identify and map IDs manually
- Integrate with community databases once available
