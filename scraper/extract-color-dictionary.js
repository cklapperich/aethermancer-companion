#!/usr/bin/env node

/**
 * Extract colored terms from Aethermancer wiki HTML files
 * Generates a term-dictionary.json mapping game terms to color classes
 */

const fs = require('fs');
const path = require('path');

// Map hex colors to semantic CSS class names
const COLOR_MAP = {
  '#ff9700': 'text-orange',    // Numbers, Aether, Action, elements
  '#f5bf5e': 'text-yellow',     // On Action, Wild Aether, Shields, effects
  '#a96dcb': 'text-purple',     // Aura:
  '#abdfaf': 'text-green',      // Status effects (buffs): Power, Force, Dodge, Sidekick, Regeneration
  '#83c1d3': 'text-cyan',       // Modifiers: Healing, Crit Chance, Crit Damage, damage
  '#db7c80': 'text-red',        // Debuffs: Terror, Burn, Poison, Bleed
  '#76abff': 'text-water',      // Water element
  '#fe783c': 'text-fire',       // Fire element
  '#c28b32': 'text-earth',      // Earth element
  '#9cff68': 'text-nature',     // Wind/Nature element
  '#ff99cc': 'text-wild',       // Wild (pink)
  '#e1545a': 'text-weakness',   // Weakness status
  '#625556': 'text-gray',       // Flavor text (italic)
};

function extractColoredTerms(htmlContent) {
  const terms = new Map(); // term -> { color, count }
  const colorStats = new Map(); // hex -> count

  // Regex to match: <span style="color: #HEXCODE">TERM</span>
  const regex = /<span style="color:\s*(#[a-f0-9]{6})">(.*?)<\/span>/gi;

  let match;
  while ((match = regex.exec(htmlContent)) !== null) {
    const hexColor = match[1].toLowerCase();
    const term = match[2].trim();

    // Skip empty terms
    if (!term) continue;

    // Skip pure numbers (handled by regex in colorize function)
    if (/^\d+$/.test(term)) continue;

    // Skip percentage numbers
    if (/^\d+%$/.test(term)) continue;

    // Skip HTML fragments (nested spans that weren't parsed correctly)
    if (/<|>/.test(term)) continue;

    // Skip flavor text (full italic sentences, typically very long)
    if (term.length > 50) continue;

    // Track color usage
    colorStats.set(hexColor, (colorStats.get(hexColor) || 0) + 1);

    // Get color class or use hex as fallback
    const colorClass = COLOR_MAP[hexColor] || hexColor;

    // Store term (case-sensitive)
    if (terms.has(term)) {
      const existing = terms.get(term);
      existing.count++;
      // Warn if same term has different colors
      if (existing.color !== colorClass) {
        console.warn(`⚠️  Term "${term}" has multiple colors: ${existing.color} vs ${colorClass}`);
      }
    } else {
      terms.set(term, { color: colorClass, count: 1 });
    }
  }

  return { terms, colorStats };
}

function main() {
  console.log('🎨 Extracting colored terms from wiki HTML...\n');

  const htmlDir = path.join(__dirname, 'html-samples');
  const traitsFile = path.join(htmlDir, 'traits-list.html');
  const actionsFile = path.join(htmlDir, 'actions-list.html');

  // Check files exist
  if (!fs.existsSync(traitsFile)) {
    console.error(`❌ File not found: ${traitsFile}`);
    process.exit(1);
  }
  if (!fs.existsSync(actionsFile)) {
    console.error(`❌ File not found: ${actionsFile}`);
    process.exit(1);
  }

  // Read HTML files
  const traitsHtml = fs.readFileSync(traitsFile, 'utf-8');
  const actionsHtml = fs.readFileSync(actionsFile, 'utf-8');

  console.log(`📄 Traits file: ${(traitsHtml.length / 1024).toFixed(1)} KB`);
  console.log(`📄 Actions file: ${(actionsHtml.length / 1024).toFixed(1)} KB\n`);

  // Extract from both files
  const traits = extractColoredTerms(traitsHtml);
  const actions = extractColoredTerms(actionsHtml);

  // Merge results
  const allTerms = new Map(traits.terms);
  for (const [term, data] of actions.terms) {
    if (allTerms.has(term)) {
      const existing = allTerms.get(term);
      existing.count += data.count;
      // Check for color mismatches
      if (existing.color !== data.color) {
        console.warn(`⚠️  Term "${term}" has different colors in traits vs actions: ${existing.color} vs ${data.color}`);
      }
    } else {
      allTerms.set(term, data);
    }
  }

  // Merge color stats
  const allColorStats = new Map(traits.colorStats);
  for (const [color, count] of actions.colorStats) {
    allColorStats.set(color, (allColorStats.get(color) || 0) + count);
  }

  // Print statistics
  console.log('📊 Color Usage Statistics:');
  console.log('─'.repeat(60));
  const sortedColors = [...allColorStats.entries()].sort((a, b) => b[1] - a[1]);
  for (const [hex, count] of sortedColors) {
    const className = COLOR_MAP[hex] || 'UNKNOWN';
    console.log(`${hex} → ${className.padEnd(20)} ${count.toString().padStart(5)} occurrences`);
  }

  console.log('\n📚 Extracted Terms:');
  console.log('─'.repeat(60));
  console.log(`Total unique terms: ${allTerms.size}`);
  console.log(`Total occurrences: ${[...allTerms.values()].reduce((sum, t) => sum + t.count, 0)}`);

  // Group by color
  const byColor = new Map();
  for (const [term, data] of allTerms) {
    if (!byColor.has(data.color)) {
      byColor.set(data.color, []);
    }
    byColor.get(data.color).push(term);
  }

  console.log('\nTerms by color:');
  for (const [color, terms] of [...byColor.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    console.log(`\n${color}: ${terms.length} terms`);
    console.log(`  ${terms.slice(0, 10).join(', ')}${terms.length > 10 ? ', ...' : ''}`);
  }

  // Create dictionary (term -> color class)
  const dictionary = {};
  for (const [term, data] of [...allTerms.entries()].sort()) {
    dictionary[term] = data.color;
  }

  // Write to JSON file
  const outputDir = path.join(__dirname, '..', 'public', 'data');
  const outputFile = path.join(outputDir, 'term-dictionary.json');

  // Create directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputFile, JSON.stringify(dictionary, null, 2), 'utf-8');

  console.log(`\n✅ Dictionary written to: ${outputFile}`);
  console.log(`   ${allTerms.size} terms mapped to colors`);

  // Also write a stats file for reference
  const statsFile = path.join(__dirname, 'color-extraction-stats.json');
  const stats = {
    totalTerms: allTerms.size,
    totalOccurrences: [...allTerms.values()].reduce((sum, t) => sum + t.count, 0),
    colorUsage: Object.fromEntries(sortedColors),
    termsByColor: Object.fromEntries(
      [...byColor.entries()].map(([color, terms]) => [color, terms.length])
    ),
    sampleTerms: Object.fromEntries(
      [...byColor.entries()].map(([color, terms]) => [color, terms.slice(0, 5)])
    )
  };
  fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2), 'utf-8');
  console.log(`📈 Statistics written to: ${statsFile}`);
}

main();
