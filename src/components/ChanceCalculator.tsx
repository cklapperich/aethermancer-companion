import { useState } from 'react';

interface CalculatorState {
  // === CRIT ===
  // Boons
  critBoon: boolean;
  windNimbleCrit: boolean;

  // Traits - Fixed %
  criticalAether: boolean;      // +20%
  hunt: boolean;                // +15%
  criticalPurging: boolean;     // +15%
  tacticalShields: boolean;     // +15% (7+ Shield)
  levitation: boolean;          // +35% (consumes Dodge)
  glory: boolean;               // +10%
  splatter: boolean;            // +25% (vs Bleed)
  sleightOfHand: boolean;       // Guaranteed hit 3

  // Traits - Per-stack
  burningMark: boolean;
  burnStacks: number;           // +5% each
  primevalBlight: boolean;
  poisonStacks: number;         // +4% each
  vigorousEdge: boolean;
  regenStacks: number;          // +15% each
  cunningMinions: boolean;
  minionCount: number;          // +10% each

  // Perks (variable %)
  critPerk1: number;
  critPerk2: number;
  critPerk3: number;

  // Manual entry
  equipmentCritPercent: number;
  actionCritPercent: number;

  // Hit count
  critHits: number;

  // === EVASION ===
  // Boons
  evasionBoon: boolean;
  windNimbleEvade: boolean;

  // Traits - Fixed %
  afterstorm: boolean;          // +10%
  blind: boolean;               // +15% miss
  yokai: boolean;               // +15%
  evasionMastery: boolean;      // +50% of crit
  haste: boolean;               // Changes Dodge behavior

  // Traits - Per-stack
  schadenfreude: boolean;
  schadenfreudeShifted: boolean;
  debuffStacks: number;         // +6% per 10 (normal) or per 13 (shifted)

  // Dodge stacks
  dodgeStacks: number;          // With Haste: +12% each; Without: guaranteed hit 2

  // Perks (variable %)
  evadePerk1: number;
  evadePerk2: number;
  evadePerk3: number;

  // Manual entry
  equipmentEvadePercent: number;

  // Hit count
  evadeHits: number;
}

const initialState: CalculatorState = {
  // Crit Boons
  critBoon: false,
  windNimbleCrit: false,

  // Crit Traits - Fixed
  criticalAether: false,
  hunt: false,
  criticalPurging: false,
  tacticalShields: false,
  levitation: false,
  glory: false,
  splatter: false,
  sleightOfHand: false,

  // Crit Traits - Per-stack
  burningMark: false,
  burnStacks: 0,
  primevalBlight: false,
  poisonStacks: 0,
  vigorousEdge: false,
  regenStacks: 0,
  cunningMinions: false,
  minionCount: 0,

  // Crit Perks
  critPerk1: 0,
  critPerk2: 0,
  critPerk3: 0,

  // Crit Manual
  equipmentCritPercent: 0,
  actionCritPercent: 0,

  // Crit Hits
  critHits: 3,

  // Evasion Boons
  evasionBoon: false,
  windNimbleEvade: false,

  // Evasion Traits - Fixed
  afterstorm: false,
  blind: false,
  yokai: false,
  evasionMastery: false,
  haste: false,

  // Evasion Traits - Per-stack
  schadenfreude: false,
  schadenfreudeShifted: false,
  debuffStacks: 0,

  // Dodge
  dodgeStacks: 0,

  // Evasion Perks
  evadePerk1: 0,
  evadePerk2: 0,
  evadePerk3: 0,

  // Evasion Manual
  equipmentEvadePercent: 0,

  // Evasion Hits
  evadeHits: 2,
};

// Combine independent roll chances: 1 - (1-p1)(1-p2)(1-p3)...
function combineIndependentChances(chances: number[]): number {
  if (chances.length === 0) return 0;
  const missAll = chances.reduce((prod, p) => prod * (1 - p), 1);
  return 1 - missAll;
}

// Calculate base crit chance (without action bonus - used for Evasion Mastery)
function calculateBaseCritChance(state: CalculatorState): number {
  const chances: number[] = [];

  // Boons
  if (state.critBoon) chances.push(0.15);
  if (state.windNimbleCrit) chances.push(0.05);

  // Traits - Fixed %
  if (state.criticalAether) chances.push(0.20);
  if (state.hunt) chances.push(0.15);
  if (state.criticalPurging) chances.push(0.15);
  if (state.tacticalShields) chances.push(0.15);
  if (state.levitation) chances.push(0.35);
  if (state.glory) chances.push(0.10);
  if (state.splatter) chances.push(0.25);
  // sleightOfHand is handled separately (guaranteed, not a roll)

  // Traits - Per-stack (each stack is independent roll)
  if (state.burningMark && state.burnStacks > 0) {
    for (let i = 0; i < state.burnStacks; i++) chances.push(0.05);
  }
  if (state.primevalBlight && state.poisonStacks > 0) {
    for (let i = 0; i < state.poisonStacks; i++) chances.push(0.04);
  }
  if (state.vigorousEdge && state.regenStacks > 0) {
    for (let i = 0; i < state.regenStacks; i++) chances.push(0.15);
  }
  if (state.cunningMinions && state.minionCount > 0) {
    for (let i = 0; i < state.minionCount; i++) chances.push(0.10);
  }

  // Perks (each is independent roll)
  if (state.critPerk1 > 0) chances.push(state.critPerk1 / 100);
  if (state.critPerk2 > 0) chances.push(state.critPerk2 / 100);
  if (state.critPerk3 > 0) chances.push(state.critPerk3 / 100);

  // Equipment
  if (state.equipmentCritPercent > 0) chances.push(state.equipmentCritPercent / 100);

  // NOTE: Action % is NOT included here - this is for Evasion Mastery

  return combineIndependentChances(chances);
}

// Calculate total crit chance (with action bonus)
function calculateCritChance(state: CalculatorState): number {
  const baseCrit = calculateBaseCritChance(state);

  // Add action bonus as independent roll
  if (state.actionCritPercent > 0) {
    const actionChance = state.actionCritPercent / 100;
    // Combine: 1 - (1 - base)(1 - action)
    return 1 - (1 - baseCrit) * (1 - actionChance);
  }

  return baseCrit;
}

function calculateEvasionChance(state: CalculatorState, baseCritChance: number): number {
  const chances: number[] = [];

  // Boons
  if (state.evasionBoon) chances.push(0.15);
  if (state.windNimbleEvade) chances.push(0.05);

  // Traits - Fixed %
  if (state.afterstorm) chances.push(0.10);
  if (state.blind) chances.push(0.15);
  if (state.yokai) chances.push(0.15);

  // Evasion Mastery: +50% of BASE crit chance (without action bonus)
  if (state.evasionMastery && baseCritChance > 0) {
    chances.push(baseCritChance * 0.5);
  }

  // Schadenfreude variants (each threshold = independent roll)
  if (state.schadenfreude && state.debuffStacks > 0) {
    const rolls = Math.floor(state.debuffStacks / 10);
    for (let i = 0; i < rolls; i++) chances.push(0.06);
  }
  if (state.schadenfreudeShifted && state.debuffStacks > 0) {
    const rolls = Math.floor(state.debuffStacks / 13);
    for (let i = 0; i < rolls; i++) chances.push(0.06);
  }

  // Dodge stacks with Haste: +12% each
  if (state.haste && state.dodgeStacks > 0) {
    for (let i = 0; i < state.dodgeStacks; i++) chances.push(0.12);
  }

  // Perks (each is independent roll)
  if (state.evadePerk1 > 0) chances.push(state.evadePerk1 / 100);
  if (state.evadePerk2 > 0) chances.push(state.evadePerk2 / 100);
  if (state.evadePerk3 > 0) chances.push(state.evadePerk3 / 100);

  // Equipment
  if (state.equipmentEvadePercent > 0) chances.push(state.equipmentEvadePercent / 100);

  return combineIndependentChances(chances);
}

// Calculate crit results for a multi-hit attack
function calculateCritResults(state: CalculatorState, perHitChance: number) {
  const hits = state.critHits;

  if (state.sleightOfHand && hits >= 3) {
    // Every 3rd hit (3, 6, 9...) is guaranteed crit
    const guaranteedCrits = Math.floor(hits / 3);
    const probabilisticHits = hits - guaranteedCrits;
    const expectedFromRolls = probabilisticHits * perHitChance;
    const expectedTotal = guaranteedCrits + expectedFromRolls;
    const atLeastOne = 1;

    return {
      perHit: perHitChance,
      atLeastOne,
      guaranteedCrits,
      probabilisticHits,
      expectedTotal,
      hasSleightOfHand: true,
    };
  } else {
    const atLeastOne = 1 - Math.pow(1 - perHitChance, hits);
    const expectedTotal = hits * perHitChance;

    return {
      perHit: perHitChance,
      atLeastOne,
      guaranteedCrits: 0,
      expectedTotal,
      hasSleightOfHand: false,
    };
  }
}

// Calculate evasion results for a multi-hit attack
function calculateEvasionResults(state: CalculatorState, perHitChance: number) {
  const hits = state.evadeHits;
  const hasDodgeStacks = !state.haste && state.dodgeStacks > 0;

  if (hasDodgeStacks && hits >= 2) {
    // Even-numbered hits (2, 4, 6...) are guaranteed dodges, each consuming 1 stack
    const evenHits = Math.floor(hits / 2); // How many even-numbered hits in the attack
    const guaranteedDodges = Math.min(evenHits, state.dodgeStacks); // Limited by stacks
    const probabilisticHits = hits - guaranteedDodges; // Odd hits + any even hits without stacks
    const expectedFromRolls = probabilisticHits * perHitChance;
    const expectedTotal = guaranteedDodges + expectedFromRolls;
    const atLeastOne = guaranteedDodges > 0 ? 1 : 1 - Math.pow(1 - perHitChance, hits);

    return {
      perHit: perHitChance,
      atLeastOne,
      guaranteedDodges,
      probabilisticHits,
      expectedTotal,
      hasDodgeStacks: true,
      dodgeStacks: state.dodgeStacks,
      stacksConsumed: guaranteedDodges,
      hits,
    };
  } else {
    const atLeastOne = 1 - Math.pow(1 - perHitChance, hits);
    const expectedTotal = hits * perHitChance;

    return {
      perHit: perHitChance,
      atLeastOne,
      guaranteedDodges: 0,
      probabilisticHits: hits,
      expectedTotal,
      hasDodgeStacks: false,
      dodgeStacks: 0,
      stacksConsumed: 0,
      hits,
    };
  }
}

// Reusable checkbox + label component
function TraitCheckbox({
  checked,
  onChange,
  label,
  bonus,
  condition
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  bonus: string;
  condition?: string;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="w-4 h-4 accent-tier-maverick"
      />
      <span className="font-figtree text-gray-300">
        {label} <span className="text-tier-basic">({bonus})</span>
        {condition && <span className="text-gray-500 text-sm"> - {condition}</span>}
      </span>
    </label>
  );
}

// Trait with stack input
function TraitWithStacks({
  checked,
  onCheckChange,
  stacks,
  onStackChange,
  label,
  bonusPerStack,
  stackType
}: {
  checked: boolean;
  onCheckChange: (checked: boolean) => void;
  stacks: number;
  onStackChange: (stacks: number) => void;
  label: string;
  bonusPerStack: string;
  stackType: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <label className="flex items-center gap-2 cursor-pointer flex-1">
        <input
          type="checkbox"
          checked={checked}
          onChange={e => onCheckChange(e.target.checked)}
          className="w-4 h-4 accent-tier-maverick"
        />
        <span className="font-figtree text-gray-300">
          {label} <span className="text-tier-basic">({bonusPerStack}/stack)</span>
        </span>
      </label>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">{stackType}:</span>
        <input
          type="number"
          min="0"
          value={stacks || ''}
          onChange={e => onStackChange(Number(e.target.value) || 0)}
          disabled={!checked}
          className="w-16 bg-gray-700 text-white px-2 py-1 rounded border border-gray-600 focus:border-tier-maverick focus:outline-none disabled:opacity-50 text-sm"
          placeholder="0"
        />
      </div>
    </div>
  );
}

export function ChanceCalculator() {
  const [state, setState] = useState<CalculatorState>(initialState);

  const updateState = <K extends keyof CalculatorState>(key: K, value: CalculatorState[K]) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const baseCritChance = calculateBaseCritChance(state);
  const critChance = calculateCritChance(state);
  const evasionChance = calculateEvasionChance(state, baseCritChance);

  const critResults = calculateCritResults(state, critChance);
  const evasionResults = calculateEvasionResults(state, evasionChance);

  return (
    <div className="min-h-screen text-white p-4 md:p-6 lg:p-10">
      <div className="max-w-5xl mx-auto w-full">
        <div className="text-center mb-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-alegreya font-bold text-tier-maverick" style={{ fontVariant: 'small-caps' }}>
            Crit & Evasion Probability Calculator
          </h1>
        </div>

        {/* Note */}
        <div className="mb-6 bg-gray-800/30 rounded-lg p-4 text-sm text-gray-400 text-center">
          <p className="font-figtree">
            <strong className="text-tier-basic">Note:</strong> All % sources are rolled independently.
            Two 15% chances = 1 - (0.85 × 0.85) = 27.75%, not 30%.
          </p>
        </div>

        <hr className="border-tier-basic mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* CRIT CHANCE SECTION */}
          <div className="bg-gray-800/50 rounded-lg p-6 flex flex-col">
            <h3 className="text-xl font-alegreya font-bold text-tier-maverick mb-4" style={{ fontVariant: 'small-caps' }}>
              Crit Chance
            </h3>

            {/* Boons */}
            <div className="mb-5">
              <h4 className="text-tier-basic font-alegreya font-semibold mb-2">Boons</h4>
              <div className="space-y-2">
                <TraitCheckbox
                  checked={state.critBoon}
                  onChange={v => updateState('critBoon', v)}
                  label="Crit Boon"
                  bonus="+15%"
                />
                <TraitCheckbox
                  checked={state.windNimbleCrit}
                  onChange={v => updateState('windNimbleCrit', v)}
                  label="Wind Nimble"
                  bonus="+5%"
                />
              </div>
            </div>

            {/* Traits */}
            <div className="mb-5">
              <h4 className="text-tier-basic font-alegreya font-semibold mb-2">Traits</h4>
              <div className="space-y-2">
                {/* Fixed % traits */}
                <TraitCheckbox
                  checked={state.criticalAether}
                  onChange={v => updateState('criticalAether', v)}
                  label="Critical Aether"
                  bonus="+20%"
                />
                <TraitCheckbox
                  checked={state.hunt}
                  onChange={v => updateState('hunt', v)}
                  label="Hunt"
                  bonus="+15%"
                  condition="Aura"
                />
                <TraitCheckbox
                  checked={state.criticalPurging}
                  onChange={v => updateState('criticalPurging', v)}
                  label="Critical Purging"
                  bonus="+15%"
                />
                <TraitCheckbox
                  checked={state.tacticalShields}
                  onChange={v => updateState('tacticalShields', v)}
                  label="Tactical Shields"
                  bonus="+15%"
                  condition="7+ Shield"
                />
                <TraitCheckbox
                  checked={state.levitation}
                  onChange={v => updateState('levitation', v)}
                  label="Levitation"
                  bonus="+35%"
                  condition="consumes Dodge"
                />
                <TraitCheckbox
                  checked={state.glory}
                  onChange={v => updateState('glory', v)}
                  label="Glory"
                  bonus="+10%"
                  condition="buff"
                />
                <TraitCheckbox
                  checked={state.splatter}
                  onChange={v => updateState('splatter', v)}
                  label="Splatter"
                  bonus="+25%"
                  condition="vs Bleed"
                />
                <TraitCheckbox
                  checked={state.sleightOfHand}
                  onChange={v => updateState('sleightOfHand', v)}
                  label="Sleight of Hand"
                  bonus="hit 3 = 100%"
                />

                {/* Divider */}
                <div className="border-t border-gray-700 my-3" />

                {/* Per-stack traits */}
                <TraitWithStacks
                  checked={state.burningMark}
                  onCheckChange={v => updateState('burningMark', v)}
                  stacks={state.burnStacks}
                  onStackChange={v => updateState('burnStacks', v)}
                  label="Burning Mark"
                  bonusPerStack="+5%"
                  stackType="Burn"
                />
                <TraitWithStacks
                  checked={state.primevalBlight}
                  onCheckChange={v => updateState('primevalBlight', v)}
                  stacks={state.poisonStacks}
                  onStackChange={v => updateState('poisonStacks', v)}
                  label="Primeval Blight"
                  bonusPerStack="+4%"
                  stackType="Poison"
                />
                <TraitWithStacks
                  checked={state.vigorousEdge}
                  onCheckChange={v => updateState('vigorousEdge', v)}
                  stacks={state.regenStacks}
                  onStackChange={v => updateState('regenStacks', v)}
                  label="Vigorous Edge"
                  bonusPerStack="+15%"
                  stackType="Regen"
                />
                <TraitWithStacks
                  checked={state.cunningMinions}
                  onCheckChange={v => updateState('cunningMinions', v)}
                  stacks={state.minionCount}
                  onStackChange={v => updateState('minionCount', v)}
                  label="Cunning Minions"
                  bonusPerStack="+10%"
                  stackType="Minions"
                />
              </div>
            </div>

            {/* Perks */}
            <div className="mb-5">
              <h4 className="text-tier-basic font-alegreya font-semibold mb-2">Perks</h4>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Perk 1 %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="5"
                    value={state.critPerk1 || ''}
                    onChange={e => updateState('critPerk1', Number(e.target.value) || 0)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-tier-maverick focus:outline-none"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Perk 2 %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="5"
                    value={state.critPerk2 || ''}
                    onChange={e => updateState('critPerk2', Number(e.target.value) || 0)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-tier-maverick focus:outline-none"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Perk 3 %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="5"
                    value={state.critPerk3 || ''}
                    onChange={e => updateState('critPerk3', Number(e.target.value) || 0)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-tier-maverick focus:outline-none"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Manual Entry */}
            <div className="mb-5">
              <h4 className="text-tier-basic font-alegreya font-semibold mb-2">Manual Entry</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Equipment %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={state.equipmentCritPercent || ''}
                    onChange={e => updateState('equipmentCritPercent', Number(e.target.value) || 0)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-tier-maverick focus:outline-none"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Action %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={state.actionCritPercent || ''}
                    onChange={e => updateState('actionCritPercent', Number(e.target.value) || 0)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-tier-maverick focus:outline-none"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Hit Count */}
            <div className="mb-5">
              <h4 className="text-tier-basic font-alegreya font-semibold mb-2">Attack Hits</h4>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={state.critHits}
                  onChange={e => updateState('critHits', Math.max(1, Number(e.target.value) || 1))}
                  className="w-20 bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-tier-maverick focus:outline-none"
                />
                <span className="text-sm text-gray-400">hits per attack</span>
              </div>
            </div>

            {/* Results */}
            <div className="mt-auto p-4 bg-gray-900/50 rounded-lg border border-tier-maverick/30">
              <h4 className="text-tier-maverick font-alegreya font-bold mb-3" style={{ fontVariant: 'small-caps' }}>Result ({state.critHits}-Hit Attack)</h4>
              <div className="space-y-2">
                <p className="font-figtree">
                  <span className="text-gray-400">Per-hit crit chance:</span>{' '}
                  <span className="text-tier-maverick font-bold text-lg">{(critResults.perHit * 100).toFixed(1)}%</span>
                </p>
                <p className="font-figtree">
                  <span className="text-gray-400">At least 1 crit:</span>{' '}
                  <span className="text-tier-maverick font-bold text-lg">{(critResults.atLeastOne * 100).toFixed(1)}%</span>
                </p>

                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="text-sm text-gray-500 font-figtree mb-1">Breakdown:</p>
                  {critResults.hasSleightOfHand ? (
                    <div className="text-sm font-figtree space-y-1">
                      <p className="text-green-400">Every 3rd hit (3, 6, 9...): 100% (Sleight of Hand)</p>
                      <p className="text-gray-300">Other hits: {(critResults.perHit * 100).toFixed(1)}% each</p>
                      <p className="text-gray-400 mt-2">
                        Guaranteed crits: <span className="text-tier-basic">{critResults.guaranteedCrits}</span>
                      </p>
                      <p className="text-gray-400">
                        Expected total: <span className="text-tier-basic">{critResults.expectedTotal.toFixed(2)}</span>
                      </p>
                    </div>
                  ) : (
                    <div className="text-sm font-figtree space-y-1">
                      <p className="text-gray-300">All hits: {(critResults.perHit * 100).toFixed(1)}% each</p>
                      <p className="text-gray-400 mt-2">
                        Expected crits: <span className="text-tier-basic">{critResults.expectedTotal.toFixed(2)}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* EVASION SECTION */}
          <div className="bg-gray-800/50 rounded-lg p-6 flex flex-col">
            <h3 className="text-xl font-alegreya font-bold text-tier-maverick mb-4" style={{ fontVariant: 'small-caps' }}>
              Evasion
            </h3>

            {/* Boons */}
            <div className="mb-5">
              <h4 className="text-tier-basic font-alegreya font-semibold mb-2">Boons</h4>
              <div className="space-y-2">
                <TraitCheckbox
                  checked={state.evasionBoon}
                  onChange={v => updateState('evasionBoon', v)}
                  label="Evasion Boon"
                  bonus="+15%"
                />
                <TraitCheckbox
                  checked={state.windNimbleEvade}
                  onChange={v => updateState('windNimbleEvade', v)}
                  label="Wind Nimble"
                  bonus="+5%"
                />
              </div>
            </div>

            {/* Traits */}
            <div className="mb-5">
              <h4 className="text-tier-basic font-alegreya font-semibold mb-2">Traits</h4>
              <div className="space-y-2">
                {/* Fixed % traits */}
                <TraitCheckbox
                  checked={state.afterstorm}
                  onChange={v => updateState('afterstorm', v)}
                  label="Afterstorm"
                  bonus="+10%"
                  condition="Aura"
                />
                <TraitCheckbox
                  checked={state.blind}
                  onChange={v => updateState('blind', v)}
                  label="Blind"
                  bonus="+15% miss"
                  condition="enemies w/ Terror"
                />
                <TraitCheckbox
                  checked={state.yokai}
                  onChange={v => updateState('yokai', v)}
                  label="Yokai"
                  bonus="+15%"
                  condition="minion"
                />
                <TraitCheckbox
                  checked={state.evasionMastery}
                  onChange={v => updateState('evasionMastery', v)}
                  label="Evasion Mastery"
                  bonus="+50% of crit"
                  condition="Aura"
                />
                <TraitCheckbox
                  checked={state.haste}
                  onChange={v => updateState('haste', v)}
                  label="Haste"
                  bonus="Dodge = +12%/stack"
                />

                {/* Divider */}
                <div className="border-t border-gray-700 my-3" />

                {/* Schadenfreude variants */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={state.schadenfreude}
                        onChange={e => updateState('schadenfreude', e.target.checked)}
                        className="w-4 h-4 accent-tier-maverick"
                      />
                      <span className="font-figtree text-gray-300">
                        Schadenfreude <span className="text-tier-basic">(+6% per 10)</span>
                        <span className="text-gray-500 text-sm"> - Poison variant</span>
                      </span>
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={state.schadenfreudeShifted}
                        onChange={e => updateState('schadenfreudeShifted', e.target.checked)}
                        className="w-4 h-4 accent-tier-maverick"
                      />
                      <span className="font-figtree text-gray-300">
                        Schadenfreude <span className="text-tier-basic">(+6% per 13)</span>
                        <span className="text-gray-500 text-sm"> - Terror variant (Shifted)</span>
                      </span>
                    </label>
                  </div>
                  <div className="flex items-center gap-2 ml-6">
                    <span className="text-xs text-gray-500">Total debuff stacks:</span>
                    <input
                      type="number"
                      min="0"
                      value={state.debuffStacks || ''}
                      onChange={e => updateState('debuffStacks', Number(e.target.value) || 0)}
                      disabled={!state.schadenfreude && !state.schadenfreudeShifted}
                      className="w-20 bg-gray-700 text-white px-2 py-1 rounded border border-gray-600 focus:border-tier-maverick focus:outline-none text-sm disabled:opacity-50"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Dodge Stacks */}
            <div className="mb-5">
              <h4 className="text-tier-basic font-alegreya font-semibold mb-2">Dodge Stacks</h4>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  value={state.dodgeStacks || ''}
                  onChange={e => updateState('dodgeStacks', Number(e.target.value) || 0)}
                  className="w-20 bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-tier-maverick focus:outline-none"
                  placeholder="0"
                />
                <span className="text-sm text-gray-400">
                  {state.haste ? '+12% evasion each' : 'Hit 2 = guaranteed dodge'}
                </span>
              </div>
            </div>

            {/* Perks */}
            <div className="mb-5">
              <h4 className="text-tier-basic font-alegreya font-semibold mb-2">Perks</h4>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Perk 1 %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="5"
                    value={state.evadePerk1 || ''}
                    onChange={e => updateState('evadePerk1', Number(e.target.value) || 0)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-tier-maverick focus:outline-none"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Perk 2 %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="5"
                    value={state.evadePerk2 || ''}
                    onChange={e => updateState('evadePerk2', Number(e.target.value) || 0)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-tier-maverick focus:outline-none"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Perk 3 %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="5"
                    value={state.evadePerk3 || ''}
                    onChange={e => updateState('evadePerk3', Number(e.target.value) || 0)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-tier-maverick focus:outline-none"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Manual Entry */}
            <div className="mb-5">
              <h4 className="text-tier-basic font-alegreya font-semibold mb-2">Equipment</h4>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Equipment %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={state.equipmentEvadePercent || ''}
                  onChange={e => updateState('equipmentEvadePercent', Number(e.target.value) || 0)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-tier-maverick focus:outline-none"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Hit Count */}
            <div className="mb-5">
              <h4 className="text-tier-basic font-alegreya font-semibold mb-2">Enemy Attack Hits</h4>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={state.evadeHits}
                  onChange={e => updateState('evadeHits', Math.max(1, Number(e.target.value) || 1))}
                  className="w-20 bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-tier-maverick focus:outline-none"
                />
                <span className="text-sm text-gray-400">hits per attack</span>
              </div>
            </div>

            {/* Results */}
            <div className="mt-auto p-4 bg-gray-900/50 rounded-lg border border-tier-maverick/30">
              <h4 className="text-tier-maverick font-alegreya font-bold mb-3" style={{ fontVariant: 'small-caps' }}>Result ({state.evadeHits}-Hit Attack)</h4>
              <div className="space-y-2">
                <p className="font-figtree">
                  <span className="text-gray-400">Per-hit evasion chance:</span>{' '}
                  <span className="text-tier-maverick font-bold text-lg">{(evasionResults.perHit * 100).toFixed(1)}%</span>
                </p>
                <p className="font-figtree">
                  <span className="text-gray-400">Dodge at least 1:</span>{' '}
                  <span className="text-tier-maverick font-bold text-lg">{(evasionResults.atLeastOne * 100).toFixed(1)}%</span>
                </p>

                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="text-sm text-gray-500 font-figtree mb-1">Breakdown:</p>
                  {evasionResults.hasDodgeStacks ? (
                    <div className="text-sm font-figtree space-y-1">
                      <p className="text-green-400">
                        Even hits (2, 4, 6...): 100% dodge, -1 stack each
                      </p>
                      <p className="text-gray-300">Odd hits: {(evasionResults.perHit * 100).toFixed(1)}% each</p>
                      <p className="text-gray-400 mt-2">
                        Guaranteed dodges: <span className="text-tier-basic">{evasionResults.guaranteedDodges}</span>
                        <span className="text-gray-500 text-xs ml-1">({evasionResults.stacksConsumed} stacks used)</span>
                      </p>
                      <p className="text-gray-400">
                        Expected total: <span className="text-tier-basic">{evasionResults.expectedTotal.toFixed(2)}</span>
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        Remaining stacks: {evasionResults.dodgeStacks - evasionResults.stacksConsumed}
                      </p>
                    </div>
                  ) : (
                    <div className="text-sm font-figtree space-y-1">
                      <p className="text-gray-300">All hits: {(evasionResults.perHit * 100).toFixed(1)}% each</p>
                      <p className="text-gray-400 mt-2">
                        Expected dodges: <span className="text-tier-basic">{evasionResults.expectedTotal.toFixed(2)}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
