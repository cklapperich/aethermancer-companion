/**
 * Scraper for Aethermancer Actions from wiki HTML
 * Parses action cards and generates actions.json
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

// Section headers map to action categories
const SECTION_TO_CATEGORY = {
  'Starting_Actions': null,  // Starting actions have no category
  'Basic_Actions': null,     // Will be determined by parsing
  'Maverick_Actions': null,  // Maverick actions have 2 types
  'Special_Actions': null    // Special actions (free actions, etc.)
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
 * Extract mana cost from element icons in the 3rd column
 */
function parseManaCost(cellElement) {
  const mana = [];
  const images = cellElement.querySelectorAll('img');

  images.forEach(img => {
    const element = parseElement(img.alt);
    if (element) {
      mana.push(element);
    }
  });

  return mana;
}

/**
 * Extract action name from title cell
 */
function parseActionName(titleCell) {
  const link = titleCell.querySelector('a span.alegreya');
  return link ? link.textContent.trim() : null;
}

/**
 * Extract action category from title cell
 */
function parseActionCategory(titleCell) {
  const categorySpan = titleCell.querySelector('span.figtree');
  return categorySpan ? categorySpan.textContent.trim() : null;
}

/**
 * Extract icon filename from icon cell
 */
function parseIconFilename(iconCell) {
  const img = iconCell.querySelector('img.skill-icon');
  if (img && img.alt) {
    // alt text is like "Action aqua pounce.png"
    // We need to convert it to "Action_aqua_pounce.webp"
    return img.alt.replace(/ /g, '_').replace(/\.png$/, '.webp');
  }
  return null;
}

/**
 * Extract description text from description cell
 */
function parseDescription(descCell) {
  // Get the text content, preserving structure
  const figtree = descCell.querySelector('span.figtree');
  if (!figtree) return null;

  // Get HTML content, preserving <br> tags
  let description = figtree.innerHTML;

  // Clean up the HTML: remove color spans and style attributes but keep <br> tags
  description = description.replace(/<span[^>]*>/g, '');
  description = description.replace(/<\/span>/g, '');
  description = description.replace(/<a[^>]*>/g, '');
  description = description.replace(/<\/a>/g, '');

  // Clean up extra whitespace (but preserve <br> tags)
  description = description.replace(/\s+/g, ' ');
  description = description.trim();

  return description;
}

/**
 * Parse types from the type badges row (row 3)
 * Types are displayed as links like: <a href="/wiki/Age_(Type)" title="Age (Type)">Age</a>
 */
function parseTypes(typeRow) {
  const types = [];
  if (!typeRow) return types;

  const typeCell = typeRow.querySelector('td[colspan="3"]');
  if (!typeCell) return types;

  // Find all links to type pages
  const typeLinks = typeCell.querySelectorAll('a[href*="(Type)"]');

  typeLinks.forEach(link => {
    const typeText = link.textContent.trim();
    if (typeText && !types.includes(typeText)) {
      types.push(typeText);
    }
  });

  return types;
}

/**
 * Detect if action is a free action from description
 */
function isFreeAction(description) {
  return description.includes('Free Action.');
}

/**
 * Parse a single action card table
 */
function parseActionCard(table, currentSection) {
  const innerTable = table.querySelector('table');
  if (!innerTable) return null;

  const rows = innerTable.querySelectorAll('tr');
  if (rows.length < 3) return null;

  // Row 1: Icon, Title, Mana Cost
  const row1 = rows[0];
  const cells = row1.querySelectorAll('td, th');
  if (cells.length < 3) return null;

  const iconCell = cells[0];
  const titleCell = cells[1];
  const manaCell = cells[2];

  // Row 2: Description
  const row2 = rows[1];
  const descCell = row2.querySelector('td.display-effect');
  if (!descCell) return null;

  // Row 3: Type badges (right-aligned)
  const row3 = rows[2];

  // Extract data
  const name = parseActionName(titleCell);
  const iconFilename = parseIconFilename(iconCell);
  const manaCost = parseManaCost(manaCell);
  const description = parseDescription(descCell);

  if (!name || !iconFilename || !description) {
    return null;
  }

  // Parse types from row 3
  const types = parseTypes(row3);

  const actionCategory = parseActionCategory(titleCell);

  // --- New logic for determining support status ---
  const freeAction = isFreeAction(description);
  // --- End new logic ---

  // Build action object
  const action = {
    name,
    skillType: 'Action',
    manaCost,
    types,
    description,
    iconFilename,
    freeAction,
    actionCategory
  };

  // Starting actions have no types
  if (currentSection === 'Starting_Actions') {
    action.types = [];
  }

  return action;
}

/**
 * Main scraping function
 */
function scrapeActions(htmlPath) {
  console.log('Reading HTML file:', htmlPath);
  const html = fs.readFileSync(htmlPath, 'utf-8');

  console.log('Parsing HTML...');
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const actions = [];
  let currentSection = null;

  // Find all section headers and action cards
  const contentElements = document.querySelectorAll('h2, table.display-skill');

  contentElements.forEach(element => {
    if (element.tagName === 'H2') {
      // Update current section
      const headline = element.querySelector('span.mw-headline');
      if (headline) {
        currentSection = headline.id;
      }
    } else if (element.tagName === 'TABLE') {
      // Parse action card
      const action = parseActionCard(element, currentSection);
      if (action) {
        actions.push(action);
        console.log(`Parsed: ${action.name} (${action.manaCost.join(', ')})`);
      }
    }
  });

  return actions;
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
 * Download all action icons
 */
async function downloadActionIcons(actions, imagesDir) {
  console.log(`\nDownloading ${actions.length} action icons...`);

  // Create images directory if it doesn't exist
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  const baseUrl = 'https://aethermancer.wiki.gg';
  let downloaded = 0;
  let skipped = 0;

  for (const action of actions) {
    const imagePath = path.join(imagesDir, action.iconFilename);

    // Skip if already exists
    if (fs.existsSync(imagePath)) {
      skipped++;
      continue;
    }

    // Download the image
    const imageUrl = `${baseUrl}/images/${action.iconFilename}`;
    try {
      await downloadImage(imageUrl, imagePath);
      downloaded++;
      if (downloaded % 10 === 0) {
        console.log(`  Downloaded ${downloaded} images...`);
      }
    } catch (err) {
      console.error(`  Error downloading ${action.iconFilename}: ${err.message}`);
    }
  }

  console.log(`Downloaded ${downloaded} new images, skipped ${skipped} existing images`);
}

/**
 * Main execution
 */
async function main() {
  const inputPath = './html-samples/actions-list.html';
  const outputPath = '../data/actions.json';
  const imagesDir = '../public/images/actions';

  console.log('Starting action scraper...\n');

  const actions = scrapeActions(inputPath);

  console.log(`\nTotal actions scraped: ${actions.length}`);

  // Write to JSON file
  fs.writeFileSync(outputPath, JSON.stringify(actions, null, 2));
  console.log(`\nActions written to: ${outputPath}`);

  // Skip downloading images - we already have .webp files
  // await downloadActionIcons(actions, imagesDir);

  // Print some stats
  const sections = {};
  actions.forEach(action => {
    const manaCount = action.manaCost.length;
    const typeCount = action.types.length;
    const key = `${manaCount} mana, ${typeCount} types`;
    sections[key] = (sections[key] || 0) + 1;
  });

  console.log('\nBreakdown:');
  Object.entries(sections).sort().forEach(([key, count]) => {
    console.log(`  ${key}: ${count} actions`);
  });
}

// Run as async if this is the main module
if (require.main === module) {
  main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
}

module.exports = { scrapeActions, parseActionCard };
