# Aethermancer Statistics Mapping

Based on decompiled code from `Assembly-CSharp.dll` (game version 0.5.1).

## EStatistic Enum

| Value | Name | Type | Description |
|-------|------|------|-------------|
| 0 | MonstersRevived | IntDictionary | Monster ID → revive count |
| 1 | SkillTypeLearned | IntDictionary | Monster type → count of skills learned |
| 2 | MaverickSkillLearned | SingleStat | Total maverick skills learned |
| 3 | SkillTypeUsed | IntDictionary | Monster type → count of skills used |
| 4 | TriggerTypeTriggered | IntDictionary | Trigger type → count |
| 5 | EnemyMonsterKilled | IntDictionary | Monster ID → kill count |
| 6 | PlayerMonsterKilledByMonster | IntDictionary | Enemy monster ID → times it killed your monsters |
| 7 | RunDefeatedByEnemyMonster | IntDictionary | Enemy monster ID → times it ended your run |
| 8 | NPCInteraction | IntDictionary | NPC ID → interaction count |
| 9 | MapZoneChoice | IntDictionary | Portal customization type → times chosen |
| 10 | ItemsBoughtAtMerchant | SingleStat | Total items bought from merchant |
| 11 | GoldSpentAtMerchant | SingleStat | Total gold spent at merchant |
| 12 | AreaVisitedCount | IntDictionary | Area/biome ID → visit count |
| 13 | SmallEventUsedCount | IntDictionary | Small event ID → interaction count |
| 14 | ElementalChallengeFailedCount | SingleStat | Total failed elemental challenges |
| 15 | LurkerTeethSpent | SingleStat | Total lurker teeth spent |

## Save File Structure

Statistics are stored in `SaveFileStatistics` array with this structure:

```json
{
  "StatisticType": 7,
  "IsSingleIntStat": false,
  "IntDictionary": {
    "keys": [1234, 5678],
    "values": [5, 3]
  },
  "SingleStat": 0
}
```

- `StatisticType`: EStatistic enum value (0-15)
- `IsSingleIntStat`: true for SingleStat types, false for IntDictionary types
- `IntDictionary`: Key-value pairs (monster IDs, area IDs, etc.)
- `SingleStat`: Single integer value (only used when IsSingleIntStat is true)

## SingleStat Types

These statistics use a single integer value:
- MaverickSkillLearned (2)
- ItemsBoughtAtMerchant (10)
- GoldSpentAtMerchant (11)
- ElementalChallengeFailedCount (14)
- LurkerTeethSpent (15)

## IntDictionary Types

These statistics use key-value pairs:
- MonstersRevived (0) - keys are monster IDs
- SkillTypeLearned (1) - keys are EMonsterType enum values
- SkillTypeUsed (3) - keys are EMonsterType enum values
- TriggerTypeTriggered (4) - keys are trigger type IDs
- EnemyMonsterKilled (5) - keys are monster IDs
- PlayerMonsterKilledByMonster (6) - keys are enemy monster IDs
- RunDefeatedByEnemyMonster (7) - keys are enemy monster IDs
- NPCInteraction (8) - keys are NPC IDs
- MapZoneChoice (9) - keys are EPortalCustomization enum values
- AreaVisitedCount (12) - keys are area/biome IDs
- SmallEventUsedCount (13) - keys are small event IDs

## Notes

- **Wins per difficulty is NOT stored in SaveFileStatistics!** It must be calculated from `PreviousRuns` array by counting `DidWin` grouped by `Difficulty`.
- Monster IDs in statistics reference `WorldData.Instance.GetReferenceable(id)` - need to map to our monsters.json
- The `Difficulty` field uses EDifficulty enum: 0=Undefined, 1=Normal, 2=Heroic, 3=Mythic

## Interesting Stats for Display

1. **RunDefeatedByEnemyMonster (7)** - "Runs ended by [Monster Name]: X"
2. **EnemyMonsterKilled (5)** - "Times killed [Monster Name]: X"
3. **GoldSpentAtMerchant (11)** - Total gold spent shopping
4. **MaverickSkillLearned (2)** - Total maverick skills learned
5. **AreaVisitedCount (12)** - Biome visit statistics
