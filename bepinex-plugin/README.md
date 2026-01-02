# Aethermancer ID Dumper

A BepInEx plugin that dumps Monster, NPC, and other ID-to-name mappings from Aethermancer at runtime.

## How It Works

The plugin hooks into the game and waits for the game data to load. Once loaded, it:

1. Iterates through `MonsterManager.Instance.AllMonsters` to get all player monsters
2. Iterates through `GameController.Instance.BossMonsterList` for boss monsters
3. Iterates through `GameController.Instance.WorldData.Referenceables` for NPCs and other game objects
4. Writes JSON mapping files to `<GameDir>/IDDump/`

## Building

### Prerequisites

- .NET SDK 6.0+ (for building .NET Framework 4.8 targets)
- Aethermancer game installed with BepInEx

### Build Commands

```bash
cd bepinex-plugin
dotnet build
```

The plugin DLL will be automatically copied to `<GameDir>/BepInEx/plugins/`.

### Manual Installation

If automatic copy fails, manually copy:
```
bin/AethermancerIDDumper.dll → <GameDir>/BepInEx/plugins/
```

## Usage

1. Build and install the plugin
2. Start Aethermancer
3. The plugin auto-dumps IDs when game data loads (after main menu)
4. Or press **F9** to manually trigger a dump at any time
5. Check `<GameDir>/IDDump/` for the output files:
   - `monster-ids.json` - Monster ID → name mappings
   - `npc-ids.json` - NPC ID → name mappings
   - `area-ids.json` - Area enum values → names
   - `all-referenceables.json` - All Referenceable objects with types

## Output Format

### monster-ids.json
```json
{
  "718": "Jotunn",
  "323": "Cherufe",
  "1446": "Minokawa",
  ...
}
```

### npc-ids.json
```json
{
  "7": "Witch",
  "8": "Knight",
  "11": "Merchant",
  ...
}
```

## Copying to Companion App

After running the plugin, copy the JSON files to the companion app's `data/` directory:

```bash
cp ~/.steam/debian-installation/steamapps/common/Aethermancer/IDDump/*.json \
   /path/to/aethermancer-companion/data/
```

Then rebuild the companion app:
```bash
cd aethermancer-companion
npm run build
```

## Troubleshooting

Check BepInEx logs at `<GameDir>/BepInEx/LogOutput.log` for any errors.

The plugin logs each ID it finds, so you can verify it's working:
```
[Info:AethermancerIDDumper] Monster: ID=718, Name=Jotunn
[Info:AethermancerIDDumper] Monster: ID=323, Name=Cherufe
...
```
