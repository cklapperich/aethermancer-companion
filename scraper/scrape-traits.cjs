/**
 * Scraper for Aethermancer Traits from wiki HTML
 * Parses trait cards and generates traits.json
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { JSDOM } = require('jsdom');

// Section headers map to trait categories
const SECTION_TO_CATEGORY = {
  'Basic_Traits': 'Basic',
  'Maverick_Traits': 'Maverick',
  'Signature_Traits': 'Signature'
};

/**
 * Extract trait name from title cell
 */
function parseTraitName(titleCell) {
  const link = titleCell.querySelector('a span.alegreya');
  return link ? link.textContent.trim() : null;
}

/**
 * Extract icon filename from icon cell
 */
function parseIconFilename(iconCell) {
  const img = iconCell.querySelector('img.skill-icon');
  if (img && img.src) {
    const src = img.src;
    // Try original format: /images/Trait_*.png
    let match = src.match(/\/images\/(Trait_[^?]+)/);
    if (match) {
      // Replace .png extension with .webp to match actual files
      return match[1].replace(/\.png$/, '.webp');
    }
    // Try new format: traits-list_files/Trait_*.webp or similar local paths
    match = src.match(/(Trait_[^/?]+\.webp)/);
    if (match) {
      return match[1];
    }
    // Fallback: extract filename from any path
    match = src.match(/(Trait_[^/?]+)/);
    if (match) {
      return match[1].replace(/\.png$/, '.webp');
    }
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
 * Extract monster name for signature traits
 */
function parseSignatureMonster(row) {
  if (!row) return null;

  // Find the center-aligned cell in row 3 that contains the monster name
  const centerCell = row.querySelector('td.center');
  if (!centerCell) return null;

  // Find the link inside a <b> tag (this is the monster name, not the icon)
  const boldLink = centerCell.querySelector('b a');
  if (boldLink) {
    return boldLink.textContent.trim();
  }

  return null;
}

/**
 * Parse types from the type badges row (row 3)
 * Types are displayed as links like: <a href="/wiki/Age_(Type)" title="Age (Type)">Age</a>
 */
function parseTypes(typeRow) {
  const types = [];
  if (!typeRow) return types;

  const typeCell = typeRow.querySelector('td[colspan="2"]');
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
 * Parse a single trait card table
 */
function parseTraitCard(table, currentSection) {
  const innerTable = table.querySelector('table');
  if (!innerTable) return null;

  const rows = innerTable.querySelectorAll('tr');
  if (rows.length < 3) return null;

  // Check if this is a signature trait
  const isSignature = table.classList.contains('display-skill-sig');

  // Row 1: Icon, Title (no mana cost for traits)
  const row1 = rows[0];
  const cells = row1.querySelectorAll('td, th');
  if (cells.length < 2) return null;

  const iconCell = cells[0];
  const titleCell = cells[1];

  // Row 2: Description (check for both regular and signature styles)
  const row2 = rows[1];
  const descCell = row2.querySelector('td.display-effect, td.display-effect-sig');
  if (!descCell) return null;

  // Row 3: Type badges (right-aligned) for regular traits, or monster name for signature traits
  const row3 = rows[2];

  // Extract data
  const name = parseTraitName(titleCell);
  const iconFilename = parseIconFilename(iconCell);
  const description = parseDescription(descCell);

  if (!name || !iconFilename || !description) {
    return null;
  }

  // Build trait object
  const trait = {
    name,
    skillType: 'Trait',
    description,
    iconFilename,
    category: SECTION_TO_CATEGORY[currentSection] || 'Basic'
  };

  // Parse types or monster name based on trait type
  if (isSignature) {
    const signatureMonster = parseSignatureMonster(row3);
    if (signatureMonster) {
      trait.signatureMonster = signatureMonster;
    }
    trait.types = []; // Signature traits don't have types
  } else {
    trait.types = parseTypes(row3);
  }

  return trait;
}

/**
 * Main scraping function
 */
function scrapeTraits(htmlPath) {
  console.log('Reading HTML file:', htmlPath);
  const html = fs.readFileSync(htmlPath, 'utf-8');

  console.log('Parsing HTML...');
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const traits = [];
  let currentSection = 'Basic_Traits';

  // Find all section headers and trait cards
  const contentElements = document.querySelectorAll('h2, table.display-skill');

  contentElements.forEach(element => {
    if (element.tagName === 'H2') {
      // Update current section
      const headline = element.querySelector('span.mw-headline');
      if (headline && SECTION_TO_CATEGORY[headline.id]) {
        currentSection = headline.id;
      }
    } else if (element.tagName === 'TABLE') {
      // Parse trait card
      const trait = parseTraitCard(element, currentSection);
      if (trait) {
        traits.push(trait);
        if (trait.signatureMonster) {
          console.log(`Parsed: ${trait.name} [${trait.category}] - Signature for ${trait.signatureMonster}`);
        } else {
          console.log(`Parsed: ${trait.name} [${trait.category}] (${trait.types.join(', ')})`);
        }
      }
    }
  });

  return traits;
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
 * Download all trait icons
 */
async function downloadTraitIcons(traits, imagesDir) {
  console.log(`\nDownloading ${traits.length} trait icons...`);

  // Create images directory if it doesn't exist
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  const baseUrl = 'https://aethermancer.wiki.gg';
  let downloaded = 0;
  let skipped = 0;

  for (const trait of traits) {
    const imagePath = path.join(imagesDir, trait.iconFilename);

    // Skip if already exists
    if (fs.existsSync(imagePath)) {
      skipped++;
      continue;
    }

    // Download the image
    const imageUrl = `${baseUrl}/images/${trait.iconFilename}`;
    try {
      await downloadImage(imageUrl, imagePath);
      downloaded++;
      if (downloaded % 10 === 0) {
        console.log(`  Downloaded ${downloaded} images...`);
      }
    } catch (err) {
      console.error(`  Error downloading ${trait.iconFilename}: ${err.message}`);
    }
  }

  console.log(`Downloaded ${downloaded} new images, skipped ${skipped} existing images`);
}

/**
 * Main execution
 */
async function main() {
  const inputPath = './html-samples/traits-list.html';
  const outputPath = '../data/traits.json';

  console.log('Starting trait scraper...\n');

  const traits = scrapeTraits(inputPath);

  console.log(`\nTotal traits scraped: ${traits.length}`);

  // Write to JSON file
  fs.writeFileSync(outputPath, JSON.stringify(traits, null, 2));
  console.log(`\nTraits written to: ${outputPath}`);

  // Download trait icons
  const imagesDir = '../public/assets/traits';
  await downloadTraitIcons(traits, imagesDir);

  // Print some stats
  const categories = {};
  traits.forEach(trait => {
    categories[trait.category] = (categories[trait.category] || 0) + 1;
  });

  console.log('\nBreakdown by category:');
  Object.entries(categories).sort().forEach(([category, count]) => {
    console.log(`  ${category}: ${count} traits`);
  });

  const typeCounts = {};
  traits.forEach(trait => {
    trait.types.forEach(type => {
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
  });

  console.log('\nType frequency:');
  Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).forEach(([type, count]) => {
    console.log(`  ${type}: ${count} traits`);
  });
}

// Run as async if this is the main module
if (require.main === module) {
  main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
}

module.exports = { scrapeTraits, parseTraitCard };
