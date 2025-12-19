using System;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class StatisticsManager : MonoBehaviour, ISaveFile
{
    private class Statistic
    {
        public EStatistic StatisticType;

        public bool IsSingleCountStat;

        public Dictionary<int, int> IntDictionaryStats = new Dictionary<int, int>();

        public int IntStat;

        public Statistic(EStatistic statisticType)
        {
            StatisticType = statisticType;
        }

        public List<Tuple<string, int>> GetLocalisedDisplayValues()
        {
            List<Tuple<string, int>> list = new List<Tuple<string, int>>();
            try
            {
                switch (StatisticType)
                {
                    case EStatistic.MonstersRevived:
                        foreach (int key3 in IntDictionaryStats.Keys)
                        {
                            list.Add(new Tuple<string, int>(Loca.TEXT_FORMAT("{0} revived: {1}", ((Monster)WorldData.Instance.GetReferenceable(key3)).GetName(), ""), IntDictionaryStats[key3]));
                        }
                        break;
                    case EStatistic.EnemyMonsterKilled:
                        foreach (int key4 in IntDictionaryStats.Keys)
                        {
                            list.Add(new Tuple<string, int>(Loca.TEXT_FORMAT("{0} killed: {1}", ((Monster)WorldData.Instance.GetReferenceable(key4)).GetName(), ""), IntDictionaryStats[key4]));
                        }
                        break;
                    case EStatistic.PlayerMonsterKilledByMonster:
                        foreach (int key5 in IntDictionaryStats.Keys)
                        {
                            list.Add(new Tuple<string, int>(Loca.TEXT_FORMAT("Monsters killed by {0}: {1}", ((Monster)WorldData.Instance.GetReferenceable(key5)).GetName(), ""), IntDictionaryStats[key5]));
                        }
                        break;
                    case EStatistic.RunDefeatedByEnemyMonster:
                        foreach (int key6 in IntDictionaryStats.Keys)
                        {
                            list.Add(new Tuple<string, int>(Loca.TEXT_FORMAT("Runs killed by {0}: {1}", ((Monster)WorldData.Instance.GetReferenceable(key6)).GetName(), ""), IntDictionaryStats[key6]));
                        }
                        break;
                    case EStatistic.SkillTypeLearned:
                        foreach (int key7 in IntDictionaryStats.Keys)
                        {
                            list.Add(new Tuple<string, int>(Loca.TEXT_FORMAT("{0} skills learned: {1}", Loca.GetTypeName((EMonsterType)key7), ""), IntDictionaryStats[key7]));
                        }
                        break;
                    case EStatistic.SkillTypeUsed:
                        foreach (int key8 in IntDictionaryStats.Keys)
                        {
                            list.Add(new Tuple<string, int>(Loca.TEXT_FORMAT("{0} skills used: {1}", Loca.GetTypeName((EMonsterType)key8), ""), IntDictionaryStats[key8]));
                        }
                        break;
                    case EStatistic.TriggerTypeTriggered:
                        foreach (int key9 in IntDictionaryStats.Keys)
                        {
                            list.Add(new Tuple<string, int>(Loca.TEXT_FORMAT("{0} skills triggered: {1}", key9, ""), IntDictionaryStats[key9]));
                        }
                        break;
                    case EStatistic.NPCInteraction:
                        foreach (int key10 in IntDictionaryStats.Keys)
                        {
                            list.Add(new Tuple<string, int>(Loca.TEXT_FORMAT("Interacted with {0}: {1}", Prefabs.Instance.GetDialogueCharacterByID(key10).CharacterName, ""), IntDictionaryStats[key10]));
                        }
                        break;
                    case EStatistic.MaverickSkillLearned:
                        list.Add(new Tuple<string, int>(Loca.TEXT_FORMAT("Maverick Skills learned: {0} ", ""), IntStat));
                        break;
                    case EStatistic.ItemsBoughtAtMerchant:
                        list.Add(new Tuple<string, int>(Loca.TEXT_FORMAT("Items bought from Merchant: {0}", ""), IntStat));
                        break;
                    case EStatistic.GoldSpentAtMerchant:
                        list.Add(new Tuple<string, int>(Loca.TEXT_FORMAT("Gold spent at Merchant: {0}", ""), IntStat));
                        break;
                    case EStatistic.ElementalChallengeFailedCount:
                        list.Add(new Tuple<string, int>(Loca.TEXT_FORMAT("Failed Elemental Challenges: {0}", ""), IntStat));
                        break;
                    case EStatistic.LurkerTeethSpent:
                        list.Add(new Tuple<string, int>(Loca.TEXT_FORMAT("Lurker Teeth spent: {0}", ""), IntStat));
                        break;
                    case EStatistic.MapZoneChoice:
                        foreach (int key11 in IntDictionaryStats.Keys)
                        {
                            list.Add(new Tuple<string, int>(Loca.TEXT_FORMAT("{0} zone chosen: {1}", Loca.GetPortalCustomisationToString((EPortalCustomization)key11), ""), IntDictionaryStats[key11]));
                        }
                        break;
                    case EStatistic.AreaVisitedCount:
                        foreach (int key2 in IntDictionaryStats.Keys)
                        {
                            List<TilemapLevelBiome> list3 = Prefabs.Instance.LevelBiomes.Where((TilemapLevelBiome x) => x.LevelID == key2).ToList();
                            if (list3.Count > 0)
                            {
                                list.Add(new Tuple<string, int>(Loca.TEXT_FORMAT("{0} visited: {1}", list3.First().GetName(), ""), IntDictionaryStats[key2]));
                            }
                        }
                        break;
                    case EStatistic.SmallEventUsedCount:
                        foreach (int key in IntDictionaryStats.Keys)
                        {
                            List<GameObject> list2 = Prefabs.Instance.SmallEvents.Where((GameObject x) => x.GetComponent<SmallEventDialogueEventManager>().SmallEventID == key).ToList();
                            if (list2.Count > 0)
                            {
                                list.Add(new Tuple<string, int>(Loca.TEXT_FORMAT("Interacted with {0}: {1}", list2.First().GetComponent<SmallEventDialogueEventManager>().GetName(), ""), IntDictionaryStats[key]));
                            }
                        }
                        break;
                }
            }
            catch (Exception arg)
            {
                Debug.Log((object)$"Exception: {arg}");
                return new List<Tuple<string, int>>();
            }
            return list;
        }

        public Dictionary<string, int> GetDisplayValues()
        {
            Dictionary<string, int> dictionary = new Dictionary<string, int>();
            switch (StatisticType)
            {
                case EStatistic.MonstersRevived:
                case EStatistic.EnemyMonsterKilled:
                case EStatistic.PlayerMonsterKilledByMonster:
                case EStatistic.RunDefeatedByEnemyMonster:
                    foreach (int key3 in IntDictionaryStats.Keys)
                    {
                        dictionary.Add(((Monster)WorldData.Instance.GetReferenceable(key3)).GetName(), IntDictionaryStats[key3]);
                    }
                    break;
                case EStatistic.SkillTypeLearned:
                case EStatistic.SkillTypeUsed:
                case EStatistic.TriggerTypeTriggered:
                case EStatistic.NPCInteraction:
                    foreach (int key4 in IntDictionaryStats.Keys)
                    {
                        dictionary.Add(key4.ToString(), IntDictionaryStats[key4]);
                    }
                    break;
                case EStatistic.MaverickSkillLearned:
                case EStatistic.ItemsBoughtAtMerchant:
                case EStatistic.GoldSpentAtMerchant:
                case EStatistic.ElementalChallengeFailedCount:
                case EStatistic.LurkerTeethSpent:
                    dictionary.Add(StatisticType.ToString(), IntStat);
                    break;
                case EStatistic.MapZoneChoice:
                    foreach (int key5 in IntDictionaryStats.Keys)
                    {
                        EPortalCustomization ePortalCustomization = (EPortalCustomization)key5;
                        dictionary.Add(ePortalCustomization.ToString(), IntDictionaryStats[key5]);
                    }
                    break;
                case EStatistic.AreaVisitedCount:
                    foreach (int key2 in IntDictionaryStats.Keys)
                    {
                        List<TilemapLevelBiome> source2 = Prefabs.Instance.LevelBiomes.Where((TilemapLevelBiome x) => x.LevelID == key2).ToList();
                        if (dictionary.Count() > 0)
                        {
                            dictionary.Add(source2.First().Name, IntDictionaryStats[key2]);
                        }
                    }
                    break;
                case EStatistic.SmallEventUsedCount:
                    foreach (int key in IntDictionaryStats.Keys)
                    {
                        List<GameObject> source = Prefabs.Instance.SmallEvents.Where((GameObject x) => x.GetComponent<SmallEventDialogueEventManager>().SmallEventID == key).ToList();
                        if (dictionary.Count() > 0)
                        {
                            dictionary.Add(source.First().GetComponent<SmallEventDialogueEventManager>().GetName(), IntDictionaryStats[key]);
                        }
                    }
                    break;
            }
            return dictionary;
        }
    }

    private List<Statistic> allStatistics = new List<Statistic>();

    public static StatisticsManager Instance { get; private set; }

    private void Awake()
    {
        Instance = this;
    }

    private void Start()
    {
        SubscribeToSaveFileManager();
    }

    private void OnDestroy()
    {
        UnSubscribeFromSaveFileManager();
    }

    public bool LoadDataCore(GameData gameData)
    {
        try
        {
            if (gameData.SaveFileStatistics == null)
            {
                return true;
            }
            for (int i = 0; i < gameData.SaveFileStatistics.Count; i++)
            {
                SerializableStatistic serializableStatistic = gameData.SaveFileStatistics[i];
                EStatistic statisticType = (EStatistic)serializableStatistic.StatisticType;
                if (serializableStatistic.IsSingleIntStat)
                {
                    SetStatisticTo(statisticType, serializableStatistic.SingleStat);
                    continue;
                }
                foreach (int key in serializableStatistic.IntDictionary.Keys)
                {
                    SetStatisticTo(statisticType, serializableStatistic.IntDictionary[key], key);
                }
            }
            return true;
        }
        catch (Exception ex)
        {
            Debug.LogError((object)ex);
            Debug.LogError((object)"Error happend when loading Statistics Manager");
        }
        return false;
    }

    public bool LoadDataRun(GameData gameData)
    {
        return true;
    }

    public bool LoadDataBubble(GameData gameData)
    {
        return true;
    }

    public void SaveData(GameData gameData)
    {
        gameData.SaveFileStatistics = new List<SerializableStatistic>();
        for (int i = 0; i < allStatistics.Count; i++)
        {
            Statistic statistic = allStatistics[i];
            SerializableStatistic serializableStatistic = new SerializableStatistic
            {
                StatisticType = (int)statistic.StatisticType,
                IntDictionary = new SerializableDictionary<int, int>()
            };
            if (statistic.IsSingleCountStat)
            {
                serializableStatistic.IsSingleIntStat = true;
                serializableStatistic.SingleStat = statistic.IntStat;
            }
            foreach (int key in statistic.IntDictionaryStats.Keys)
            {
                serializableStatistic.IntDictionary.Add(key, statistic.IntDictionaryStats[key]);
            }
            gameData.SaveFileStatistics.Add(serializableStatistic);
        }
    }

    public void SubscribeToSaveFileManager()
    {
        SaveFileManager.Instance.SubscribeToSaveFileObjects(this);
    }

    public void UnSubscribeFromSaveFileManager()
    {
        SaveFileManager.Instance.UnSubscribeFromSaveFileObjects(this);
    }

    public void IncreaseStatistic(EStatistic statisticType, int key, int increment)
    {
        if (!CombatStateManager.Instance.IsPreview)
        {
            Statistic statistic = GetStatistic(statisticType, createEmptyEntry: true);
            if (statistic.IsSingleCountStat)
            {
                statistic.IntStat = ((statistic.IntStat == 0) ? increment : (statistic.IntStat + increment));
            }
            else if (!statistic.IntDictionaryStats.TryAdd(key, increment))
            {
                statistic.IntDictionaryStats[key] = statistic.IntDictionaryStats[key] + increment;
            }
        }
    }

    public void IncreaseStatistic(EStatistic statisticType, int increment)
    {
        if (!CombatStateManager.Instance.IsPreview)
        {
            Statistic statistic = GetStatistic(statisticType, createEmptyEntry: true);
            if (statistic.IsSingleCountStat)
            {
                statistic.IntStat = ((statistic.IntStat == 0) ? increment : (statistic.IntStat + increment));
            }
        }
    }

    public void IncreaseStatistic(EStatistic statisticType, SkillInstance details)
    {
        if (!details.Owner.BelongsToPlayer || CombatStateManager.Instance.IsPreview)
        {
            return;
        }
        if (statisticType == EStatistic.MaverickSkillLearned)
        {
            if (details.Skill.MaverickSkill)
            {
                IncreaseStatistic(statisticType, 1);
            }
        }
        else
        {
            for (int i = 0; i < details.Skill.Types.Count; i++)
            {
                IncreaseStatistic(statisticType, (int)details.Skill.Types[i].GetComponent<MonsterType>().Type, 1);
            }
        }
    }

    private void SetStatisticTo(EStatistic statisticType, int value, int key = 0)
    {
        if (!CombatStateManager.Instance.IsPreview)
        {
            Statistic statistic = GetStatistic(statisticType, createEmptyEntry: true);
            if (statistic.IsSingleCountStat)
            {
                statistic.IntStat = value;
            }
            else if (!statistic.IntDictionaryStats.TryAdd(key, value))
            {
                statistic.IntDictionaryStats[key] = value;
            }
        }
    }

    public List<EStatistic> GetAvailableStatisticList()
    {
        List<EStatistic> list = new List<EStatistic>();
        foreach (Statistic allStatistic in allStatistics)
        {
            list.Add(allStatistic.StatisticType);
        }
        return list;
    }

    public string GetRandomSubStatisticOfStatistic(EStatistic statisticType, ref int value)
    {
        Random.InitState(DateTime.Now.Millisecond);
        foreach (Statistic allStatistic in allStatistics)
        {
            if (allStatistic.StatisticType == statisticType)
            {
                List<Tuple<string, int>> localisedDisplayValues = allStatistic.GetLocalisedDisplayValues();
                if (localisedDisplayValues.Count > 0)
                {
                    Tuple<string, int> tuple = localisedDisplayValues[Random.Range(0, localisedDisplayValues.Count)];
                    value = tuple.Item2;
                    return tuple.Item1;
                }
            }
        }
        return "";
    }

    public bool CheckStatisticMin(EStatistic statisticType, int key, int count)
    {
        return GetStatisticsCount(statisticType, key) >= count;
    }

    public int GetStatisticsCount(EStatistic statisticType, int key)
    {
        Statistic statistic = GetStatistic(statisticType);
        if (statistic == null)
        {
            return 0;
        }
        if (statistic.IsSingleCountStat)
        {
            return statistic.IntStat;
        }
        if (statistic.IntDictionaryStats.TryGetValue(key, out var value))
        {
            return value;
        }
        return 0;
    }

    public List<int> GetAllInteractedNPCIDs()
    {
        List<int> list = new List<int>();
        Statistic statistic = GetStatistic(EStatistic.NPCInteraction);
        if (statistic != null)
        {
            list.AddRange(statistic.IntDictionaryStats.Keys.ToList());
        }
        Statistic statistic2 = GetStatistic(EStatistic.ItemsBoughtAtMerchant);
        if (statistic2 != null && statistic2.IntStat >= 1)
        {
            list.Add(6);
        }
        return list;
    }

    private Statistic GetStatistic(EStatistic statisticType, bool createEmptyEntry = false)
    {
        List<Statistic> list = allStatistics.Where((Statistic x) => x.StatisticType == statisticType).ToList();
        if (list.Count > 0)
        {
            return list.First();
        }
        if (createEmptyEntry)
        {
            Statistic statistic = new Statistic(statisticType);
            if (statisticType == EStatistic.ItemsBoughtAtMerchant || statisticType == EStatistic.GoldSpentAtMerchant || statisticType == EStatistic.ElementalChallengeFailedCount || statisticType == EStatistic.MaverickSkillLearned || statisticType == EStatistic.LurkerTeethSpent)
            {
                statistic.IsSingleCountStat = true;
            }
            allStatistics.Add(statistic);
            return statistic;
        }
        return null;
    }

    public void Clear()
    {
        allStatistics.Clear();
    }
}
