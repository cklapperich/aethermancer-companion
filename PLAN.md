# Aethermancer Companion App - Project Plan

## Overview
A highly responsive web app for searching Aethermancer traits and actions. Users can type in two traits with autocomplete (e.g., "Sidekick" + "Terror"), and the app displays matching traits (left panel) and actions (right panel) that contain BOTH specified types.

## Key Features
- **Autocomplete Search**: Type-ahead with keyboard navigation (Tab to select)
- **Dual-Panel Results**: Matching traits on left, matching actions on right
- **AND Logic Filtering**: Only show items that have ALL selected types
- **Game-Accurate Visuals**: Match the actual game's look/feel, NOT the wiki (see note below)
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile

## ⚠️ IMPORTANT: Game Accuracy vs Wiki Accuracy

**The wiki has visual inaccuracies!** We want to replicate the GAME, not the wiki:

### Known Wiki Inaccuracies:
- ❌ **Incorrect "Trait" label styling** (wrong color/appearance)
- ❌ **Incorrect word colors** in descriptions (some colors don't match game)
- ❌ Other potential styling differences

### Our Approach:
- ✅ Use wiki as **data source** (names, descriptions, types)
- ✅ Use game assets (icons, images) from wiki
- ✅ **Manually correct** visual styling to match actual game
- ✅ Reference game screenshots/videos for accuracy
- ✅ Include "Trait" labels but style them correctly (not like wiki)

**Action Items:**
- Add "Trait" labels to card designs with GAME-ACCURATE styling
- Verify text colors match game (need reference screenshots)
- Compare final design against actual game, not wiki

## Tech Stack

### Frontend
- **React** + **Vite** - Fast, modern development experience
- **Tailwind CSS** - Utility-first CSS for rapid responsive design
- **react-select** or **Downshift** - Accessible autocomplete with keyboard support
- **TypeScript** (optional but recommended) - Type safety for data structures

### Data Management
- **Static JSON files** in `/public/data/` - No backend needed
- **Local asset hosting** in `/public/assets/` - Better performance, no hotlinking

### Scraping Tools
- **Node.js** - Runtime for scraper scripts
- **Puppeteer** or **Cheerio** - HTML parsing and scraping
- **axios** or **node-fetch** - Download images

### Deployment
- **Vercel** or **Netlify** - Free, auto-deploy from GitHub

## Data Structure

### Traits (`public/data/traits.json`)
```json
{
  "traits": [
    {
      "id": "sidekick",
      "name": "Sidekick",
      "types": ["aether", "shield"],
      "category": "basic",
      "description": "When you have an Aura, gain 1 Block",
      "icon": "/assets/traits/sidekick.png"
    }
  ]
}
```

### Actions (`public/data/actions.json`)
```json
{
  "actions": [
    {
      "id": "terror",
      "name": "Terror",
      "types": ["shadow"],
      "category": "basic",
      "element": "shadow",
      "description": "Deal 8 damage. Critical.",
      "icon": "/assets/actions/terror.png",
      "actionType": "Critical"
    }
  ]
}
```

### Notes on Data
- An item can have 0, 1, or 2 types
- Categories: `basic`, `maverick`, `signature` (traits), `starting` (actions)
- All types should be lowercase for consistent filtering

## Project Structure

```
aethermancer-companion/
├── scraper/
│   ├── html-samples/              # Downloaded wiki pages for experimentation
│   │   ├── traits-list.html
│   │   └── actions-list.html
│   ├── scrape-traits.js           # Extract trait data
│   ├── scrape-actions.js          # Extract action data
│   ├── download-assets.js         # Download all images
│   └── package.json               # Scraper dependencies
├── public/
│   ├── data/
│   │   ├── traits.json
│   │   └── actions.json
│   └── assets/
│       ├── traits/                # Trait icons
│       └── actions/               # Action icons
├── src/
│   ├── components/
│   │   ├── TraitSelector.jsx     # Dual autocomplete input
│   │   ├── TraitCard.jsx         # Display trait (wiki style)
│   │   ├── ActionCard.jsx        # Display action (wiki style)
│   │   ├── SearchResults.jsx     # Two-panel layout
│   │   └── TypeBadge.jsx         # Type tag styling
│   ├── hooks/
│   │   ├── useTraitSearch.js     # Filter logic with AND matching
│   │   └── useData.js            # Load JSON data
│   ├── utils/
│   │   └── filterByTypes.js      # Core filtering algorithm
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
├── tailwind.config.js
└── PLAN.md                        # This file
```

## UI/UX Design

### Layout
```
┌──────────────────────────────────────────────────────┐
│  Aethermancer Companion                              │
├──────────────────────────────────────────────────────┤
│  Select Trait 1: [Sidekick           ▼]             │
│  Select Trait 2: [Terror             ▼]             │
├────────────────────────┬─────────────────────────────┤
│  Matching Traits       │  Matching Actions           │
│  ┌─────┐ ┌─────┐      │  ┌─────┐ ┌─────┐           │
│  │ img │ │ img │      │  │ img │ │ img │           │
│  │Name │ │Name │      │  │Name │ │Name │           │
│  │Types│ │Types│      │  │Types│ │Types│           │
│  │Desc │ │Desc │      │  │Desc │ │Desc │           │
│  └─────┘ └─────┘      │  └─────┘ └─────┘           │
│  Grid continues...     │  Grid continues...          │
└────────────────────────┴─────────────────────────────┘
```

### Visual Style
- **Card Design**: Copy wiki.gg's colored icons, rounded corners, hover effects
- **Type Badges**: Match their color scheme (extract from CSS if possible)
- **Grid Layout**:
  - Desktop: 3-4 columns per panel
  - Tablet: 2 columns per panel
  - Mobile: 1 column, stacked panels
- **Typography**: Clean, readable fonts similar to wiki
- **Colors**: Dark theme support optional (future enhancement)

## Filtering Logic

### AND Logic (Confirmed)
When user selects:
- Trait 1: "Sidekick" (types: `aether`, `shield`)
- Trait 2: "Terror" (types: `shadow`)

The app collects unique types: `[aether, shield, shadow]`

**Results**: Show only traits/actions that contain ALL THREE types.

### Implementation
```javascript
function filterByTypes(items, selectedTypes) {
  return items.filter(item => {
    // Item must have ALL selected types
    return selectedTypes.every(type => item.types.includes(type));
  });
}
```

## Scraping Strategy

### Approach: Offline Experimentation
1. **HTML samples downloaded** to `scraper/html-samples/`
2. Experiment with parsing locally (no repeated requests)
3. Extract structure, CSS classes, image URLs
4. Build scraper scripts iteratively

### Scraping Steps
1. **Parse HTML**: Use Cheerio to traverse DOM
2. **Extract Data**: Find trait/action cards, pull name, types, description
3. **Extract CSS**: Identify relevant classes for styling
4. **Download Assets**: Fetch all images to `/public/assets/`
5. **Generate JSON**: Write structured data files

### CSS Considerations
"Wiki.gg specific styles" means:
- They use custom CSS classes (e.g., `.trait-card`, `.type-badge`)
- These may reference their site's design system
- We can either:
  - **Copy their CSS** and adapt class names
  - **Recreate styles** in Tailwind matching their visual design
  - **Extract inline styles** from their HTML elements

The challenge: Their CSS might rely on global stylesheets or wikia.gg infrastructure. We'll need to isolate the relevant styles.

### One-Time Scraping
- Run scraper once, commit data/assets to repo
- Re-run only when wiki updates (manual trigger)
- No automated scraping to avoid server load

## Implementation Roadmap

### Phase 1: Scraping (Priority)
- [x] Download HTML samples
- [ ] Analyze HTML structure (examine downloaded files)
- [ ] Write trait scraper (`scrape-traits.js`)
- [ ] Write action scraper (`scrape-actions.js`)
- [ ] Download all images (`download-assets.js`)
- [ ] Generate JSON files
- [ ] Verify data completeness

### Phase 2: App Setup
- [ ] Initialize Vite + React project
- [ ] Install Tailwind CSS
- [ ] Set up basic routing (if needed)
- [ ] Create component structure

### Phase 3: Core Features
- [ ] Build autocomplete component
- [ ] Load JSON data on app start
- [ ] Implement AND filtering logic
- [ ] Create trait/action card components
- [ ] Build two-panel results layout

### Phase 4: Styling
- [ ] Replicate wiki card design
- [ ] Match type badge colors
- [ ] Responsive grid layout
- [ ] Hover effects and animations
- [ ] Mobile optimization

### Phase 5: Polish & Deploy
- [ ] Performance optimization (lazy loading, virtualization)
- [ ] Accessibility audit (ARIA labels, keyboard nav)
- [ ] Cross-browser testing
- [ ] Deploy to Vercel/Netlify
- [ ] Set up GitHub repo
- [ ] Write user documentation

## Technical Challenges & Solutions

### Challenge 1: Accurate Scraping
- **Issue**: HTML structure might be complex or inconsistent
- **Solution**: Examine downloaded samples first, write robust selectors

### Challenge 2: Visual Fidelity
- **Issue**: Replicating wiki's exact styling
- **Solution**: Extract CSS classes, take screenshots for reference, iterate

### Challenge 3: Type Mapping
- **Issue**: Ensuring consistent type names across traits/actions
- **Solution**: Create a types enum/constant, normalize during scraping

### Challenge 4: Performance
- **Issue**: Rendering many cards at once
- **Solution**: Use `react-window` for virtualization if needed

## Future Enhancements
- [ ] Search by name (not just types)
- [ ] Filter by category (Basic, Maverick, etc.)
- [ ] Dark mode toggle
- [ ] Export build combinations
- [ ] Share results via URL params
- [ ] Synergy suggestions (combos that work well)
- [ ] **Colorblind Accessibility**: Toggle switch to display mana/element types as text labels instead of colored orbs for colorblind users
- [ ] **Monster Fusion Feature**: Type in 2 monsters and display the Maverick traits and actions from those 2 combined monsters

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Basic knowledge of React and JavaScript

### Next Steps
1. Examine downloaded HTML files in `scraper/html-samples/`
2. Identify HTML structure for traits and actions
3. Write scraper scripts
4. Initialize React app with Vite
5. Build UI components

---

**Status**: Planning complete, ready for implementation.
**Last Updated**: 2025-10-09
