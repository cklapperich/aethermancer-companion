# Card Prototype - Styling Guide

## Quick Start

Open `card-prototype.html` in your browser to see the card designs:

```bash
# From the project root
open card-prototype.html
# or
firefox card-prototype.html
# or just double-click the file
```

## What's Included

The prototype shows three example cards:
1. **Accelerated Generation** - Trait with single type (Aether)
2. **Aether Shield** - Trait with two types (Aether + Shield)
3. **Shadow Strike** - Action card example

## Card Structure

Based on the wiki HTML structure:
- **Header**: Icon + Title + "Trait" subtitle
- **Description**: Colored text for game terms
- **Types**: Badge(s) in bottom-right

## ⚠️ CRITICAL: Game Accuracy Checklist

These items MUST be verified against actual game screenshots:

### Visual Elements to Verify:
- [ ] **"Trait" subtitle**: Color, size, font, position
- [ ] **Card title color**: Currently #cba79f - is this correct?
- [ ] **Description text colors**:
  - [ ] Orange (#ff9700) - Numbers, "Action", "Aether"
  - [ ] Purple (#a96dcb) - "Aura"
  - [ ] Yellow (#f5bf5e) - "On Action", "Shields", "Wild"
  - [ ] Green (#abdfaf) - Status effects
  - [ ] Cyan (#83c1d3) - "Critical", "Damage"
- [ ] **Type badges**: Background, border, text color
- [ ] **Card background**: Currently #2a2a2a
- [ ] **Card border**: Currently #444
- [ ] **Fonts**: Alegreya (title) vs Figtree (body) - correct?

### Known Wiki Issues:
- Grey "Trait" label has wrong styling (need game reference)
- Some word colors don't match game

## How to Iterate

1. **Get game screenshot** of a trait/action card
2. **Compare** with `card-prototype.html` in browser
3. **Edit** the `<style>` section to match game
4. **Refresh** browser to see changes
5. **Repeat** until pixel-perfect

## Key CSS Variables to Adjust

```css
/* Card structure */
.trait-card {
    background: #2a2a2a;     /* Card background */
    border: 2px solid #444;   /* Card border */
    border-radius: 8px;       /* Corner roundness */
}

/* Title */
.card-title {
    color: #cba79f;          /* Title color */
    font-size: 20px;         /* Title size */
}

/* Subtitle ("Trait" label) */
.card-subtitle {
    color: #888;             /* VERIFY THIS */
    font-size: 12px;
}

/* Text colors */
.color-orange { color: #ff9700; }
.color-purple { color: #a96dcb; }
.color-yellow { color: #f5bf5e; }
/* etc. */
```

## Next Steps

Once styling is correct:
1. Extract final CSS to use in React components
2. Download actual game icons from wiki
3. Build the full filtering/search UI

## Notes

- Prototype uses Google Fonts (Alegreya, Figtree)
- Placeholder SVG icons included
- Responsive design not yet implemented
- This is purely for visual reference
