# Aethermancer Wiki Color Reference

## Card Title Colors (by Category)

### Basic Traits & Actions
- **Color**: `#cba79f` (tan/beige)
- **Usage**: All basic tier traits and actions

### Maverick Traits & Actions
- **Color**: `#ffdb00` (yellow/gold)
- **Usage**: All maverick tier traits and actions

### Signature Traits
- **Color**: TBD (need to check)
- **Usage**: Signature tier traits

## Description Text Colors

Colors are applied via **inline styles** in the HTML. Each game term has a semantic color:

### Common Colors (from frequency analysis)

| Color | Hex Code | Usage | Examples |
|-------|----------|-------|----------|
| Orange | `#ff9700` | Numbers, Resources | "3", "Aether", "Action", "Wind" |
| Yellow | `#f5bf5e` | Effects, Shields | "On Action", "Shields", "Wild Aether", "Minion" |
| Purple | `#a96dcb` | Auras | "Aura:" |
| Green | `#abdfaf` | Status Effects | "Sidekick", "Age" |
| Cyan/Blue | `#83c1d3` | Damage Modifiers | "Damage", "Minion Damage" |
| Red | `#db7c80` | Terror, Negative Effects | "Terror" |
| Light Red | `#e1545a` | Unknown |
| Brown | `#625556` | Unknown |

### Element Colors (Actions)

| Element | Hex Code |
|---------|----------|
| Water | `#76abff` (light blue) |
| Fire | `#fe783c` (orange-red) |
| Earth | `#c28b32` (brown) |
| Nature | `#9cff68` (light green) |
| Shadow | TBD |

## How Colors Are Applied

**The wiki uses inline styles for EVERY colored term:**

```html
<span style="color: #ff9700">3</span> x
<span style="color: #ff9700">2</span>
<a href="/wiki/Water" title="Water">
    <span style="color: #76abff">Water</span>
</a> damage
```

This means colors are **manually applied** based on semantic meaning, not CSS classes.

## Implementation Notes

For our app, we have two options:

1. **Parse and replicate inline styles** - Copy the exact HTML structure with inline colors
2. **Create semantic CSS classes** - Map game terms to CSS classes (e.g., `.status-effect { color: #abdfaf; }`)

Option 1 is easier for initial implementation (just copy the HTML).
Option 2 is better for maintainability but requires building a term-to-color mapping.

## Color Summary

**Title Colors:**
- Basic: `#cba79f`
- Maverick: `#ffdb00`

**Description Colors:**
- Numbers/Resources: `#ff9700`
- Effects/Shields: `#f5bf5e`
- Auras: `#a96dcb`
- Status Effects: `#abdfaf`
- Damage: `#83c1d3`
- Water: `#76abff`
- Fire: `#fe783c`
