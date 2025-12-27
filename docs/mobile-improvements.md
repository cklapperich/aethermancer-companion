# Mobile Improvements - Horizontal Scroll Cards

## Future Enhancement: Horizontal Scroll Cards for Mobile

Instead of stacking the 3 monster selections vertically on mobile (which creates a lot of scrolling), create a **horizontal carousel/scrollable container** where each monster card can be swiped left/right.

### Visual Layout:
```
Mobile View:
┌─────────────────────────┐
│   [← Monster 1 →]       │  ← Swipe to see Monster 2, 3
│   ┌─────────────┐       │
│   │  Dropdown   │       │
│   │  Skills...  │       │
│   └─────────────┘       │
└─────────────────────────┘

Tablet/Desktop: Falls back to normal grid
```

### Implementation Approach:

```tsx
// Wrapper with horizontal scroll
<div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:grid md:grid-cols-3 md:overflow-visible">
  {[0, 1, 2].map((index) => (
    <div
      key={index}
      className="flex-shrink-0 w-[85vw] snap-center md:w-auto"
    >
      <MonsterSelect ... />
      <MonsterSkillsList ... />
    </div>
  ))}
</div>
```

### Key CSS Properties:

- **`overflow-x-auto`** - Enables horizontal scrolling
- **`snap-x snap-mandatory`** - Cards "snap" into place when scrolling (smooth UX)
- **`flex-shrink-0`** - Prevents cards from squishing
- **`w-[85vw]`** - Each card takes 85% of viewport width (shows peek of next card)
- **`snap-center`** - Centers the active card
- **`md:grid md:grid-cols-3`** - Switches to normal grid on larger screens
- **`md:overflow-visible`** - Removes scroll on larger screens

### Scroll Indicators:

Add dot indicators to show which monster (1, 2, or 3) is currently visible:

```tsx
<div className="flex justify-center gap-2 mt-4 md:hidden">
  {[0, 1, 2].map((index) => (
    <div
      key={index}
      className={`w-2 h-2 rounded-full ${
        currentIndex === index ? 'bg-tier-maverick' : 'bg-tier-basic opacity-50'
      }`}
    />
  ))}
</div>
```

### Enhancements:
1. **Dot indicators** - Show which monster (1, 2, or 3) is currently visible
2. **Arrow buttons** - Alternative to swiping
3. **Momentum scrolling** - Native smooth scroll on iOS/Android
4. **Intersection Observer** - Track which card is currently in view to update indicators

### Pros:
- ✅ Reduces vertical scrolling dramatically
- ✅ Familiar mobile pattern (like Instagram stories)
- ✅ Shows all 3 monsters remain selectable (peek of next card)
- ✅ Works great with touch gestures
- ✅ No need to compare all monsters simultaneously on small screens

### Cons:
- ❌ Less discoverability (users might not know to swipe) - mitigated with scroll indicators
- ❌ Can't compare all 3 monsters side-by-side on mobile - acceptable for this use case
- ❌ Requires scroll indicators for clarity - planned enhancement

## Current Implementation (Phase 1)

For now, implementing basic responsive improvements:
1. Responsive grid layout (1 col mobile, 2 col tablet, 3 col desktop)
2. Responsive padding
3. Responsive typography

This provides immediate mobile usability while keeping the door open for horizontal scroll cards in the future.
