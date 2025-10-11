# Aethermancer Companion App

A highly responsive web app for searching and filtering Aethermancer traits and actions by type.

## Features

- **Autocomplete Search**: Select two traits/actions with keyboard navigation
- **Smart Filtering**: Find items that match ALL selected types (AND logic)
- **Visual Design**: Replicates the Aethermancer wiki's card layout
- **Responsive**: Works on desktop, tablet, and mobile

## Project Status

**Current Phase**: Planning & Setup Complete

See [PLAN.md](PLAN.md) for detailed project plan and implementation roadmap.

## Project Structure

```
aethermancer-companion/
├── scraper/              # Data scraping scripts
│   └── html-samples/     # Downloaded wiki pages (408KB + 583KB)
├── public/               # Static assets and data
│   ├── data/            # JSON files (traits, actions)
│   └── assets/          # Images (icons, cards)
├── src/                  # React application
│   ├── components/      # UI components
│   ├── hooks/           # Custom React hooks
│   └── utils/           # Helper functions
└── PLAN.md              # Detailed project plan
```

## Quick Start (Coming Soon)

```bash
# Install dependencies
npm install

# Run scraper
npm run scrape

# Start dev server
npm run dev

# Build for production
npm run build
```

## Data Sources

- Traits: https://aethermancer.wiki.gg/wiki/Traits/List
- Actions: https://aethermancer.wiki.gg/wiki/Actions/List

Downloaded HTML samples available in `scraper/html-samples/` for offline experimentation.

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Scraping**: Node.js + Cheerio/Puppeteer
- **Deployment**: Vercel/Netlify

## Next Steps

1. Examine HTML structure in `scraper/html-samples/`
2. Build scraper scripts
3. Initialize React app
4. Implement UI components

---

**License**: TBD (check game assets licensing)
