#!/usr/bin/env python3
"""
Extract ID mappings from Aethermancer Unity assets.

This script attempts to extract Monster, NPC, and Event ID-to-name mappings
from Unity asset files. Due to limitations in reading custom MonoBehaviour
types without type definitions, this approach has limited success.

See docs/EXTRACT_ASSET_IDS_PLAN.md for alternative approaches.

Usage:
    python extract-unity-ids.py <assets_dir> [output_dir]
    python extract-unity-ids.py --explore <asset_file>

Example:
    python extract-unity-ids.py ~/.steam/steam/steamapps/common/Aethermancer/Aethermancer_Data ./data
"""
import UnityPy
import json
import sys
import os
from pathlib import Path
from collections import defaultdict


def explore_monobehaviours(assets_path):
    """Explore what MonoBehaviour types exist in an asset file."""
    env = UnityPy.load(assets_path)

    type_counts = defaultdict(int)
    sample_data = {}

    for obj in env.objects:
        if obj.type.name == "MonoBehaviour":
            try:
                data = obj.read()
                script = data.m_Script
                if script:
                    script_data = script.read()
                    type_name = getattr(script_data, 'm_Name', 'Unknown')
                    type_counts[type_name] += 1

                    if type_name not in sample_data:
                        tree = obj.read_typetree()
                        sample_data[type_name] = tree
            except:
                pass

    return type_counts, sample_data


def extract_ids(assets_dir, output_dir):
    """
    Attempt to extract ID mappings from Unity assets.

    Note: This has limited success because UnityPy cannot properly read
    custom MonoBehaviour types without the script type definitions.
    """
    monsters = {}
    npcs = {}
    areas = {}
    skills = {}
    items = {}

    asset_files = [
        "sharedassets0.assets",
        "resources.assets",
        "globalgamemanagers.assets"
    ]

    for asset_file in asset_files:
        asset_path = os.path.join(assets_dir, asset_file)
        if not os.path.exists(asset_path):
            print(f"Skipping {asset_file} - not found")
            continue

        print(f"Processing {asset_file}...")

        try:
            env = UnityPy.load(asset_path)
        except Exception as e:
            print(f"  Error loading {asset_file}: {e}")
            continue

        for obj in env.objects:
            if obj.type.name == "MonoBehaviour":
                try:
                    data = obj.read()
                    script = data.m_Script
                    if not script:
                        continue

                    script_data = script.read()
                    type_name = getattr(script_data, 'm_Name', '')

                    tree = obj.read_typetree()

                    # Monster
                    if type_name == "Monster":
                        if "ID" in tree and "monsterName" in tree:
                            monster_id = str(tree["ID"])
                            name = tree["monsterName"]
                            if name:
                                monsters[monster_id] = name

                    # DialogueCharacter
                    elif type_name == "DialogueCharacter":
                        if "ID" in tree and "characterName" in tree:
                            char_id = str(tree["ID"])
                            name = tree["characterName"]
                            if name:
                                npcs[char_id] = name

                except:
                    pass

    os.makedirs(output_dir, exist_ok=True)

    if monsters:
        with open(os.path.join(output_dir, "monster-ids.json"), "w") as f:
            json.dump(monsters, f, indent=2, sort_keys=True)
        print(f"Extracted {len(monsters)} monsters")
    else:
        print("No monsters extracted (type tree reading may have failed)")

    if npcs:
        with open(os.path.join(output_dir, "npc-ids.json"), "w") as f:
            json.dump(npcs, f, indent=2, sort_keys=True)
        print(f"Extracted {len(npcs)} NPCs")

    return monsters, npcs, areas, skills, items


def explore_mode(assets_path):
    """List all MonoBehaviour types and sample data from an asset file."""
    print(f"Exploring {assets_path}...")
    type_counts, samples = explore_monobehaviours(assets_path)

    print("\n=== MonoBehaviour Types Found ===")
    for type_name, count in sorted(type_counts.items(), key=lambda x: -x[1]):
        print(f"  {type_name}: {count}")

    print("\n=== Sample Data for Key Types ===")
    key_types = ["Monster", "DialogueCharacter", "Biome", "Level", "Skill", "Item"]
    for type_name in key_types:
        if type_name in samples:
            print(f"\n{type_name}:")
            sample = samples[type_name]
            for i, (k, v) in enumerate(sample.items()):
                if i >= 15:
                    print("  ...")
                    break
                print(f"  {k}: {repr(v)[:80]}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    if sys.argv[1] == "--explore":
        if len(sys.argv) < 3:
            print("Provide asset file path for explore mode")
            sys.exit(1)
        explore_mode(sys.argv[2])
    else:
        assets_dir = sys.argv[1]
        output_dir = sys.argv[2] if len(sys.argv) > 2 else "./data"
        extract_ids(assets_dir, output_dir)
