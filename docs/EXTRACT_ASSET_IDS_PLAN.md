# Extract ID Mappings from Game Assets

## Problem
The Aethermancer save file uses Unity `Referenceable.ID` values to identify:
- Monsters (IDs like 428, 951, 1011, 1446, 1316, 1672)
- NPCs (IDs like 7, 8, 9, 10, 11, 12, 14, 17, 19, 20, 21, 24, 25)
- Areas/Biomes (LevelID values)

These IDs are assigned at Unity editor time and stored in `.asset` files.
The decompiled C# code does NOT contain these mappings.

## Step 1: Install UnityPy
```bash
pip install UnityPy
```

## Step 2: Locate Game Assets
Game asset files are typically at:
- `~/.steam/steam/steamapps/common/Aethermancer/Aethermancer_Data/`
- Or wherever Steam installed the game

## Step 3: Create Extraction Script
Create `scripts/extract-unity-ids.py`:
```python
#!/usr/bin/env python3
import UnityPy
import json
import sys
import os

def extract_ids(assets_path, output_dir):
    env = UnityPy.load(assets_path)

    monsters = {}
    npcs = {}
    areas = {}

    for obj in env.objects:
        if obj.type.name == "MonoBehaviour":
            try:
                data = obj.read()
                # Check for Monster
                if hasattr(data, 'ID') and hasattr(data, 'Name'):
                    if 'Monster' in str(type(data)):
                        monsters[str(data.ID)] = data.Name
                # Check for DialogueCharacter
                if hasattr(data, 'ID') and hasattr(data, 'characterName'):
                    npcs[str(data.ID)] = data.characterName
                # Check for TilemapLevelBiome
                if hasattr(data, 'LevelID') and hasattr(data, 'Name'):
                    areas[str(data.LevelID)] = data.Name
            except:
                pass

    os.makedirs(output_dir, exist_ok=True)

    with open(f"{output_dir}/monster-ids.json", "w") as f:
        json.dump(monsters, f, indent=2)
    with open(f"{output_dir}/npc-ids.json", "w") as f:
        json.dump(npcs, f, indent=2)
    with open(f"{output_dir}/area-ids.json", "w") as f:
        json.dump(areas, f, indent=2)

    print(f"Extracted {len(monsters)} monsters, {len(npcs)} NPCs, {len(areas)} areas")

if __name__ == "__main__":
    assets_path = sys.argv[1] if len(sys.argv) > 1 else "sharedassets0.assets"
    extract_ids(assets_path, "./data")
```

## Step 4: Run Extraction
```bash
cd /home/klappec/gitrepos/aethermancer-companion
python scripts/extract-unity-ids.py ~/.steam/steam/steamapps/common/Aethermancer/Aethermancer_Data/sharedassets0.assets
```

## Step 5: Update Code to Use Mappings
After extraction, update `src/utils/statisticsLookup.ts` to import and use the JSON mapping files:
```typescript
import monsterIds from '../../data/monster-ids.json';
import npcIds from '../../data/npc-ids.json';
import areaIds from '../../data/area-ids.json';

export function getMonsterName(id: number): string {
  return monsterIds[id.toString()] ?? `Monster #${id}`;
}
```
