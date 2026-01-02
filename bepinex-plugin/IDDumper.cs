using BepInEx;
using BepInEx.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using UnityEngine;

namespace AethermancerIDDumper
{
    [BepInPlugin(PluginInfo.PLUGIN_GUID, PluginInfo.PLUGIN_NAME, PluginInfo.PLUGIN_VERSION)]
    public class IDDumperPlugin : BaseUnityPlugin
    {
        internal static ManualLogSource Log;
        private bool _hasDumped = false;
        private string _outputDir;

        private void Awake()
        {
            Log = Logger;
            _outputDir = Path.Combine(Paths.GameRootPath, "IDDump");

            Logger.LogInfo($"IDDumper plugin loaded! Press F12 to dump ID mappings to {_outputDir}");
        }

        private float _lastLogTime = 0f;

        private void Update()
        {
            // Debug logging every 5 seconds
            if (Time.time - _lastLogTime > 5f)
            {
                _lastLogTime = Time.time;
                bool hasInstance = MonsterManager.Instance != null;
                bool hasAllMonsters = hasInstance && MonsterManager.Instance.AllMonsters != null;
                int count = hasAllMonsters ? MonsterManager.Instance.AllMonsters.Count : 0;
                Logger.LogInfo($"[Debug] MonsterManager: instance={hasInstance}, allMonsters={hasAllMonsters}, count={count}, hasDumped={_hasDumped}");

                // Auto-dump when count > 0 and not yet dumped
                if (!_hasDumped && count > 0)
                {
                    _hasDumped = true;
                    Logger.LogInfo("Auto-dumping IDs...");
                    DumpAllIDs();
                }
            }
        }

        // Use OnGUI for more reliable key detection in Unity 6
        private void OnGUI()
        {
            Event e = Event.current;
            if (e != null && e.type == EventType.KeyDown && e.keyCode == KeyCode.F12)
            {
                Logger.LogInfo("F12 pressed via OnGUI, dumping IDs...");
                DumpAllIDs();
            }
        }

        private void DumpAllIDs()
        {
            try
            {
                Directory.CreateDirectory(_outputDir);

                DumpMonsters();
                DumpNPCs();
                DumpReferenceables();
                DumpAreas();

                Logger.LogInfo($"ID dump complete! Files saved to {_outputDir}");
            }
            catch (Exception ex)
            {
                Logger.LogError($"Error dumping IDs: {ex}");
            }
        }

        private void DumpMonsters()
        {
            var sb = new StringBuilder();
            sb.AppendLine("{");

            var monsters = new List<string>();

            // Player monsters from MonsterManager
            if (MonsterManager.Instance?.AllMonsters != null)
            {
                foreach (var kvp in MonsterManager.Instance.AllMonsters)
                {
                    var monster = kvp.Value;
                    if (monster != null)
                    {
                        string name = monster.GetOriginalName(false);
                        monsters.Add($"  \"{kvp.Key}\": \"{EscapeJson(name)}\"");
                        Logger.LogInfo($"Monster: ID={kvp.Key}, Name={name}");
                    }
                }
            }

            // Boss monsters from GameController
            if (GameController.Instance?.BossMonsterList != null)
            {
                foreach (var bossPrefab in GameController.Instance.BossMonsterList)
                {
                    if (bossPrefab != null)
                    {
                        var monster = bossPrefab.GetComponent<Monster>();
                        if (monster != null)
                        {
                            string name = monster.GetOriginalName(false);
                            string entry = $"  \"{monster.ID}\": \"{EscapeJson(name)}\"";
                            if (!monsters.Contains(entry))
                            {
                                monsters.Add(entry);
                                Logger.LogInfo($"Boss Monster: ID={monster.ID}, Name={name}");
                            }
                        }
                    }
                }
            }

            sb.AppendLine(string.Join(",\n", monsters));
            sb.AppendLine("}");

            File.WriteAllText(Path.Combine(_outputDir, "monster-ids.json"), sb.ToString());
            Logger.LogInfo($"Dumped {monsters.Count} monsters");
        }

        private void DumpNPCs()
        {
            var sb = new StringBuilder();
            sb.AppendLine("{");

            var npcs = new List<string>();

            // Find all DialogueCharacter ScriptableObjects in the game
            // They are typically loaded by DialogueManager
            if (DialogueManager.Instance != null)
            {
                // Try to get characters from various sources
                var allCharacters = Resources.FindObjectsOfTypeAll<DialogueCharacter>();
                foreach (var dc in allCharacters)
                {
                    if (dc != null)
                    {
                        string name = dc.CharacterName;
                        int id = dc.CharacterID;
                        string entry = $"  \"{id}\": \"{EscapeJson(name)}\"";
                        if (!npcs.Contains(entry))
                        {
                            npcs.Add(entry);
                            Logger.LogInfo($"NPC: ID={id}, Name={name}");
                        }
                    }
                }
            }

            sb.AppendLine(string.Join(",\n", npcs));
            sb.AppendLine("}");

            File.WriteAllText(Path.Combine(_outputDir, "npc-ids.json"), sb.ToString());
            Logger.LogInfo($"Dumped {npcs.Count} NPCs");
        }

        private void DumpReferenceables()
        {
            var sb = new StringBuilder();
            sb.AppendLine("{");

            var items = new List<string>();

            // Dump all referenceables with their types
            if (GameController.Instance?.WorldData?.Referenceables != null)
            {
                foreach (var referenceable in GameController.Instance.WorldData.Referenceables)
                {
                    if (referenceable == null) continue;

                    string typeName = referenceable.GetType().Name;
                    string name = referenceable.name ?? referenceable.ToString();

                    // Try to get a meaningful name based on type
                    if (referenceable is Monster m)
                        name = m.GetOriginalName(false);
                    else if (referenceable is BaseAction ba)
                        name = ba.GetName();
                    else if (referenceable is Trait t)
                        name = t.GetName();

                    items.Add($"  \"{referenceable.ID}\": {{\"type\": \"{typeName}\", \"name\": \"{EscapeJson(name)}\"}}");
                }
            }

            sb.AppendLine(string.Join(",\n", items));
            sb.AppendLine("}");

            File.WriteAllText(Path.Combine(_outputDir, "all-referenceables.json"), sb.ToString());
            Logger.LogInfo($"Dumped {items.Count} referenceables");
        }

        private void DumpAreas()
        {
            var sb = new StringBuilder();
            sb.AppendLine("{");

            var areas = new List<string>();

            // Areas from EArea enum
            foreach (EArea area in Enum.GetValues(typeof(EArea)))
            {
                string name = Loca.GetAreaName(area);
                if (!string.IsNullOrEmpty(name))
                {
                    areas.Add($"  \"{(int)area}\": \"{EscapeJson(name)}\"");
                    Logger.LogInfo($"Area: ID={(int)area}, Name={name}");
                }
            }

            sb.AppendLine(string.Join(",\n", areas));
            sb.AppendLine("}");

            File.WriteAllText(Path.Combine(_outputDir, "area-ids.json"), sb.ToString());
            Logger.LogInfo($"Dumped {areas.Count} areas");
        }

        private string EscapeJson(string s)
        {
            if (s == null) return "";
            return s.Replace("\\", "\\\\")
                    .Replace("\"", "\\\"")
                    .Replace("\n", "\\n")
                    .Replace("\r", "\\r")
                    .Replace("\t", "\\t");
        }
    }

    public static class PluginInfo
    {
        public const string PLUGIN_GUID = "com.aethermancer.iddumper";
        public const string PLUGIN_NAME = "AethermancerIDDumper";
        public const string PLUGIN_VERSION = "1.0.0";
    }
}
