/**
 * Scraper for Aethermancer Monsters from wiki HTML
 * Parses monster cards and generates monsters.json
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { JSDOM } = require('jsdom');

// Map element alt text to Element enum values
const ELEMENT_MAP = {
  'Fire element.png': 'Fire',
  'Water element.png': 'Water',
  'Earth element.png': 'Earth',
  'Wind element.png': 'Wind',
  'Wild element.png': 'Wild'
};

/**
 * Extract element from image alt text
 */
function parseElement(altText) {
  for (const [key, value] of Object.entries(ELEMENT_MAP)) {
    if (altText.includes(key)) {
      return value;
    }
  }
  return null;
}

/**
 * Extract monster name from title cell
 */
function parseMonsterName(table) {
  const nameElement = table.querySelector('th span.alegreya a');
  return nameElement ? nameElement.textContent.trim() : null;
}

/**
 * Extract types from type links
 * Types are displayed as links like: <a href="/wiki/Tank_(Type)" title="Tank (Type)">Tank</a>
 */
function parseTypes(table) {
  const types = [];

  // Find all links to type pages
  const typeLinks = table.querySelectorAll('a[href*="(Type)"]');

  typeLinks.forEach(link => {
    const typeText = link.textContent.trim();
    if (typeText && !types.includes(typeText)) {
      types.push(typeText);
    }
  });

  // Should have exactly 3 types
  return types;
}

/**
 * Extract elements from element icons
 * Elements are shown as images with alt text like "Fire element.png"
 */
function parseElements(table) {
  const elements = [];

  // Find all element images (they're larger, 36x36)
  const images = table.querySelectorAll('img[alt*="element.png"]');

  images.forEach(img => {
    const element = parseElement(img.alt);
    if (element && !elements.includes(element)) {
      elements.push(element);
    }
  });

  // Should have exactly 2 elements
  return elements;
}

/**
 * Extract portrait filename from portrait cell
 */
function parsePortraitFilename(table) {
  const img = table.querySelector('img[alt*="Portrait.png"]');
  if (img && img.src) {
    const src = img.src;
    // Extract filename from path
    const match = src.match(/([^\/]+Portrait\.webp)/);
    if (match) {
      return match[1];
    }
  }
  return null;
}

/**
 * Parse a single monster card table
 */
function parseMonsterCard(table, isShifted = false) {
  const innerTable = table.querySelector('table');
  if (!innerTable) return null;

  // Extract data
  const name = parseMonsterName(innerTable);
  const types = parseTypes(innerTable);
  const elements = parseElements(innerTable);
  const portraitFilename = parsePortraitFilename(innerTable);

  // Validate: must have name, 3 types, and either 1 or 2 elements
  // (Most monsters have 2 elements, but some like Grimoire have 1 Wild element)
  if (!name || types.length !== 3 || (elements.length !== 1 && elements.length !== 2)) {
    console.warn(`Incomplete monster data for: ${name || 'unknown'}`);
    console.warn(`  Types: ${types.length}, Elements: ${elements.length}`);
    return null;
  }

  // Clean the name (remove (Shifted) suffix if present)
  const cleanName = name.replace(/\(Shifted\)$/, '').trim();

  // Build monster object
  const monster = {
    name: cleanName,
    types,
    elements,
    portraitFilename: portraitFilename || `${cleanName.replace(/\s+/g, '_')}_Portrait.webp`,
    shifted: isShifted
  };

  return monster;
}

/**
 * Main scraping function
 */
function scrapeMonsters(htmlPath) {
  console.log('Reading HTML file:', htmlPath);
  const html = fs.readFileSync(htmlPath, 'utf-8');

  console.log('Parsing HTML...');
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const monsters = [];

  // Find the three tabbed sections
  const availableSection = document.querySelector('#Available_Monsters-0');
  const shiftedSection = document.querySelector('#Shifted_Monsters-0');
  const unreleasedSection = document.querySelector('#Unreleased_Monsters-0');

  // Parse available monsters (shifted=false)
  if (availableSection) {
    const availableTables = availableSection.querySelectorAll('table.display-monster');
    console.log(`Found ${availableTables.length} available monsters`);
    availableTables.forEach(table => {
      const monster = parseMonsterCard(table, false);
      if (monster) {
        monsters.push(monster);
        console.log(`Parsed: ${monster.name} (${monster.elements.join(', ')}) - ${monster.types.join(', ')}`);
      }
    });
  }

  // Parse shifted monsters (shifted=true)
  if (shiftedSection) {
    const shiftedTables = shiftedSection.querySelectorAll('table.display-monster');
    console.log(`Found ${shiftedTables.length} shifted monsters`);
    shiftedTables.forEach(table => {
      const monster = parseMonsterCard(table, true);
      if (monster) {
        monsters.push(monster);
        console.log(`Parsed: ${monster.name} (${monster.elements.join(', ')}) - ${monster.types.join(', ')} [SHIFTED]`);
      }
    });
  }

  // Skip unreleased monsters
  if (unreleasedSection) {
    const unreleasedTables = unreleasedSection.querySelectorAll('table.display-monster');
    console.log(`Skipping ${unreleasedTables.length} unreleased monsters`);
  }

  return monsters;
}

/**
 * Download an image from a URL
 */
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, response => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', err => {
      fs.unlink(filepath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

/**
 * Download all monster portraits
 */
async function downloadMonsterPortraits(monsters, imagesDir) {
  console.log(`\nDownloading ${monsters.length} monster portraits...`);

  // Create images directory if it doesn't exist
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  const baseUrl = 'https://aethermancer.wiki.gg';
  let downloaded = 0;
  let skipped = 0;

  for (const monster of monsters) {
    const imagePath = path.join(imagesDir, monster.portraitFilename);

    // Skip if already exists
    if (fs.existsSync(imagePath)) {
      skipped++;
      continue;
    }

    // Download the image
    const imageUrl = `${baseUrl}/images/${monster.portraitFilename}`;
    try {
      await downloadImage(imageUrl, imagePath);
      downloaded++;
      if (downloaded % 5 === 0) {
        console.log(`  Downloaded ${downloaded} images...`);
      }
    } catch (err) {
      console.error(`  Error downloading ${monster.portraitFilename}: ${err.message}`);
    }
  }

  console.log(`Downloaded ${downloaded} new images, skipped ${skipped} existing images`);
}

/**
 * Main execution
 */
async function main() {
  const inputPath = './html-samples/monsters.html';
  const outputPath = '../data/monsters.json';
  const imagesDir = '../public/images/monsters';

  console.log('Starting monster scraper...\n');

  const monsters = scrapeMonsters(inputPath);

  console.log(`\nTotal monsters scraped: ${monsters.length}`);

  // Write to JSON file
  fs.writeFileSync(outputPath, JSON.stringify(monsters, null, 2));
  console.log(`\nMonsters written to: ${outputPath}`);

  // Download portraits
  await downloadMonsterPortraits(monsters, imagesDir);

  // Print some stats
  const elementCombos = {};
  monsters.forEach(monster => {
    const combo = monster.elements.sort().join(' + ');
    elementCombos[combo] = (elementCombos[combo] || 0) + 1;
  });

  console.log('\nElement combinations:');
  Object.entries(elementCombos).sort().forEach(([combo, count]) => {
    console.log(`  ${combo}: ${count} monsters`);
  });

  const typeCounts = {};
  monsters.forEach(monster => {
    monster.types.forEach(type => {
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
  });

  console.log('\nType frequency:');
  Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).forEach(([type, count]) => {
    console.log(`  ${type}: ${count} monsters`);
  });
}

// Run as async if this is the main module
if (require.main === module) {
  main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
}

module.exports = { scrapeMonsters, parseMonsterCard };
