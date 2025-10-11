# Text Color Application Strategy

## The Problem

Game descriptions have semantically colored text:
- Numbers: `#ff9700` (orange)
- Status effects: `#abdfaf` (green)
- Elements: varies by element
- Modifiers: `#83c1d3` (cyan)
- Effects: `#f5bf5e` (yellow)
- Auras: `#a96dcb` (purple)

Example: "Deal **3** damage. Applies **Sidekick**."
- "3" should be orange
- "damage" should be cyan
- "Sidekick" should be green

## Our Approach: Dictionary + Number Regex

**Core Strategy:**
1. **Term Dictionary** for game terms (finite set: ~100-200 terms)
2. **Simple Regex for Numbers** (infinite set, but predictable pattern)

This solves the "infinite numbers" problem while keeping dictionary manageable!

---

## Implementation

### Step 1: Build Term Dictionary (One-Time During Scraping)

Extract all colored terms from wiki and build a mapping:

```javascript
// During scraping phase
function buildTermDictionary(wikiHTML) {
  const colorMap = {
    '#ff9700': 'text-orange',    // Numbers, resources
    '#abdfaf': 'text-green',      // Status effects
    '#a96dcb': 'text-purple',     // Auras
    '#f5bf5e': 'text-yellow',     // Effects, shields
    '#83c1d3': 'text-cyan',       // Damage modifiers
    '#76abff': 'text-water',      // Water element
    '#fe783c': 'text-fire',       // Fire element
    '#c28b32': 'text-earth',      // Earth element
    '#9cff68': 'text-nature',     // Nature element
    '#db7c80': 'text-red',        // Terror
  };

  const dictionary = {};

  // Extract all <span style="color: #...">Term</span> from wiki
  const regex = /<span style="color: (#[a-f0-9]{6})">([^<]+)<\/span>/gi;
  let match;

  while ((match = regex.exec(wikiHTML)) !== null) {
    const [_, hexColor, term] = match;
    const colorClass = colorMap[hexColor.toLowerCase()];

    // Skip numbers (we handle those separately)
    if (!/^\d+$/.test(term) && colorClass) {
      dictionary[term] = colorClass;
    }
  }

  return dictionary;
}

// Results in:
const termDictionary = {
  "Sidekick": "text-green",
  "Terror": "text-green",
  "Age": "text-green",
  "Aura:": "text-purple",
  "damage": "text-cyan",
  "Damage": "text-cyan",
  "Minion Damage": "text-cyan",
  "Water": "text-water",
  "Fire": "text-fire",
  "Earth": "text-earth",
  "Shields": "text-yellow",
  "Shield": "text-yellow",
  "Wild Aether": "text-yellow",
  "On Action": "text-yellow",
  "Aether": "text-orange",
  "Action": "text-orange",
  // ... ~100-200 total entries
};
```

### Step 2: Store Plain Text Descriptions

During scraping, extract and store **plain text** (no HTML, no inline styles):

```javascript
function scrapeDescription(html) {
  // Extract just the text content, stripping all HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent.trim();
}
```

**Stored in JSON:**
```json
{
  "name": "Sidekick Trait",
  "description": "Deal 3 damage. Applies 2 Sidekick.",
  "types": ["aether", "shield"]
}
```

### Step 3: Colorize on Render (Client-Side)

Apply colors when rendering in React:

```javascript
function colorizeDescription(text, termDictionary) {
  let result = text;

  // Step 1: Wrap ALL numbers in spans (automatic, no dictionary needed!)
  result = result.replace(/\b(\d+)\b/g, '<span class="text-orange">$1</span>');

  // Step 2: Apply dictionary for known game terms
  // Sort by length (longest first) to avoid partial matches
  const sortedTerms = Object.keys(termDictionary).sort((a, b) => b.length - a.length);

  sortedTerms.forEach(term => {
    const colorClass = termDictionary[term];
    // Escape special regex characters
    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b(${escapedTerm})\\b`, 'g');

    result = result.replace(regex, `<span class="${colorClass}">$1</span>`);
  });

  return result;
}
```

**React Component:**
```jsx
import DOMPurify from 'dompurify';
import termDictionary from './data/term-dictionary.json';

function TraitDescription({ description }) {
  const colorized = colorizeDescription(description, termDictionary);

  const sanitized = DOMPurify.sanitize(colorized, {
    ALLOWED_TAGS: ['span'],
    ALLOWED_ATTR: ['class']
  });

  return (
    <div
      className="trait-description"
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
```

### Step 4: CSS Classes

```css
/* Semantic color classes */
.text-orange { color: #ff9700; }   /* Numbers, resources */
.text-green { color: #abdfaf; }    /* Status effects */
.text-purple { color: #a96dcb; }   /* Auras */
.text-yellow { color: #f5bf5e; }   /* Effects, shields */
.text-cyan { color: #83c1d3; }     /* Damage modifiers */
.text-red { color: #db7c80; }      /* Terror */

/* Element colors */
.text-water { color: #76abff; }
.text-fire { color: #fe783c; }
.text-earth { color: #c28b32; }
.text-nature { color: #9cff68; }

/* Colorblind mode support */
body.colorblind .text-orange { color: #0077bb; }
body.colorblind .text-green { color: #009988; }
/* ... etc */
```

---

## Example End-to-End

**Input (plain text from wiki):**
```
"Deal 3 damage. Applies 2 Sidekick."
```

**After colorization:**
```html
Deal <span class="text-orange">3</span> <span class="text-cyan">damage</span>.
Applies <span class="text-orange">2</span> <span class="text-green">Sidekick</span>.
```

**Rendered result:**
> Deal **3** damage. Applies **2** Sidekick.
> (with proper colors applied)

---

## Benefits

✅ **Manageable Dictionary** - Only ~100-200 game terms, not thousands
✅ **Automatic Number Handling** - No need to store "1", "2", "3"... "999"
✅ **Accurate** - Based on wiki's actual coloring
✅ **Secure** - Sanitized HTML, no arbitrary inline styles
✅ **Flexible** - Easy to add colorblind mode or theme changes
✅ **Maintainable** - Dictionary lives in one JSON file
✅ **No HTML in Data** - Clean plain text storage

---

## File Structure

```
aethermancer-companion/
├── public/
│   └── data/
│       ├── traits.json           # Plain text descriptions
│       ├── actions.json          # Plain text descriptions
│       └── term-dictionary.json  # Color mappings
├── src/
│   ├── utils/
│   │   └── colorize.js          # colorizeDescription()
│   └── components/
│       └── TraitCard.jsx        # Uses colorizeDescription()
└── scraper/
    └── build-dictionary.js      # One-time: extract from wiki
```

---

## Implementation Checklist

- [ ] Extract all colored terms from wiki HTML
- [ ] Build term-dictionary.json (~100-200 entries)
- [ ] Store trait/action descriptions as plain text
- [ ] Implement colorizeDescription() utility
- [ ] Add DOMPurify for sanitization
- [ ] Create CSS color classes
- [ ] Build React component with colorization
- [ ] Add colorblind mode toggle (future)

---

## Notes

- **Numbers**: Always orange, handled by regex `/\b(\d+)\b/g`
- **Game Terms**: Finite set, handled by dictionary lookup
- **Order Matters**: Process longest terms first to avoid partial matches
  - Example: "Minion Damage" before "Damage"
- **Case Sensitive**: Dictionary should include both "damage" and "Damage" if wiki uses both
- **Security**: Always sanitize with DOMPurify before rendering
- **Performance**: Colorization happens client-side, but is fast (regex + dictionary lookup)

