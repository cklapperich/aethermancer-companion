# Icon System Documentation

This document explains how icons are downloaded, stored, and loaded in the Aethermancer Companion project.

## Overview

The project uses web scraping to download icons from the Aethermancer wiki (`aethermancer.wiki.gg`) and serves them as static assets at runtime.

---

## How Icons Are Downloaded/Scraped

### Scraper Scripts

Located in `/scraper/`, three Node.js scripts handle icon downloading:

| Script | Purpose | Icon Count |
|--------|---------|------------|
| `scrape-actions.cjs` | Downloads action icons | ~256 files |
| `scrape-traits.cjs` | Downloads trait icons | ~233 files |
| `scrape-monsters.cjs` | Downloads monster portraits | ~61 files |

### Download Mechanism

1. **Source**: Icons are scraped from `https://aethermancer.wiki.gg`
2. **HTML Parsing**: Uses JSDOM to parse HTML tables from wiki pages
3. **Filename Extraction**: Extracts icon filenames from `<img src>` attributes
4. **Download**: Uses Node.js `https` module to fetch images
5. **Format Conversion**: PNG files are converted to WebP for storage
6. **Incremental Updates**: Scrapers skip files that already exist locally

### Sample HTML Files

The `/scraper/html-samples/` directory contains cached HTML samples for offline development/testing.

### Running the Scrapers

```bash
cd scraper
node scrape-actions.cjs
node scrape-traits.cjs
node scrape-monsters.cjs
```

---

## Where Icons Live

### Directory Structure

```
public/assets/
├── actions/              # 256 action icons
│   ├── Action_*.webp     # Individual action icons
│   ├── 32px-*.png        # Element icons (fire, water, earth, wind, wild)
│   └── 16px-*.webp       # Small element icons
│
├── traits/               # 233 trait icons + status icons
│   ├── Trait_*.webp      # Individual trait icons
│   ├── 16px-*.webp       # Small type/status icons
│   └── 36px-*.webp       # Medium element icons
│
└── monsters/             # 61 monster portraits
    └── *_Portrait.webp   # Monster character portraits
```

### File Formats

- **WebP**: Primary format for all icons (compressed, modern format)
- **PNG**: Legacy format for some element icons (16px, 32px, 36px variants)

### Naming Conventions

| Icon Type | Pattern | Example |
|-----------|---------|---------|
| Actions | `Action_<name>.webp` | `Action_aqua_pounce.webp` |
| Traits | `Trait_<name>.webp` | `Trait_aether_fiend.webp` |
| Monsters | `<Name>_Portrait.webp` | `Jotunn_Portrait.webp` |
| Shifted Monsters | `<Name>_Shifted_Portrait.webp` | `Jotunn_Shifted_Portrait.webp` |
| Elements | `32px-<element>.png` | `32px-fire.png` |

---

## How Filepaths Work

### Data Files

Icon filenames are stored in JSON data files in `/data/`:

**actions.json**
```json
{
  "name": "Aqua Pounce",
  "skillType": "Action",
  "iconFilename": "Action_aqua_pounce.webp",
  ...
}
```

**traits.json**
```json
{
  "name": "Aether Fiend",
  "skillType": "Trait",
  "iconFilename": "Trait_aether_fiend.webp",
  ...
}
```

**monsters.json**
```json
{
  "name": "Jotunn",
  "portraitFilename": "Jotunn_Portrait.webp",
  ...
}
```

### Type Definitions

Icon fields are defined in TypeScript types:

- `/src/types/skills.ts` - `iconFilename: string`
- `/src/types/monsters.ts` - `portraitFilename?: string`

---

## How Icons Get Loaded at Runtime

### 1. Data Import

The frontend imports JSON data files:

```typescript
// In TeamBuilderPage.tsx
import actionsData from '../../data/actions.json';
import traitsData from '../../data/traits.json';
import monstersData from '../../data/monsters.json';
```

### 2. Data Loading Utilities

Utility functions in `/src/utils/` process the JSON data:

- `loadActions()` - Creates Skill instances from action data
- `loadTraits()` - Creates Skill instances from trait data
- `loadMonsters()` - Creates Monster instances from monster data

### 3. Path Construction

In `SkillCard.tsx`, icon paths are constructed dynamically:

```typescript
// Actions and Traits
const iconPath = skill.skillType === 'Action'
  ? `/assets/actions/${skill.iconFilename}`
  : `/assets/traits/${skill.iconFilename}`;
```

In `Monster.ts`, portrait paths are constructed:

```typescript
if (data.portraitFilename) {
  this.imagePath = `/assets/monsters/${data.portraitFilename}`;
} else {
  // Fallback: construct from name
  const nameForPath = data.name.replace(/ /g, '_');
  this.imagePath = `/assets/monsters/${nameForPath}_Portrait.webp`;
}
```

### 4. Element Icons

Element/mana cost icons use hardcoded paths:

```typescript
const elementIcons: Record<Element, string> = {
  Fire: '/assets/actions/32px-fire.png',
  Water: '/assets/actions/32px-water.png',
  Earth: '/assets/actions/32px-earth.png',
  Wind: '/assets/actions/32px-wind.png',
  Wild: '/assets/actions/32px-wild.png'
};
```

### 5. Static File Serving

Vite serves all files in `/public/` as static assets. At runtime:
- Development: Vite dev server serves from `/public/`
- Production: Files are copied to build output and served statically

---

## Complete File Reference

| Purpose | Path |
|---------|------|
| Action scraper | `/scraper/scrape-actions.cjs` |
| Trait scraper | `/scraper/scrape-traits.cjs` |
| Monster scraper | `/scraper/scrape-monsters.cjs` |
| HTML samples | `/scraper/html-samples/` |
| Action icons | `/public/assets/actions/` |
| Trait icons | `/public/assets/traits/` |
| Monster portraits | `/public/assets/monsters/` |
| Action data | `/data/actions.json` |
| Trait data | `/data/traits.json` |
| Monster data | `/data/monsters.json` |
| Skill types | `/src/types/skills.ts` |
| Monster types | `/src/types/monsters.ts` |
| Skill card component | `/src/components/SkillCard.tsx` |
| Monster icons component | `/src/components/EnablerMonsterIcons.tsx` |
| Load utilities | `/src/utils/loadSkills.ts`, `/src/utils/loadMonsters.ts` |

---

## Adding New Icons

1. **Add to scraper** (if from wiki): Update the relevant scraper script
2. **Run scraper**: Execute the script to download new icons
3. **Update JSON data**: Ensure the data file includes the new `iconFilename`/`portraitFilename`
4. **Verify**: Icons will automatically load in the UI based on the JSON data
