# Card Styling Issues - Game vs Prototype

## Issues Identified (comparing to actual game)

### 1. ❌ Card Borders
- **Current**: Cards have borders
- **Game**: No borders on cards
- **Fix**: Remove `border: 2px solid #444;` from `.trait-card`

### 2. ✅ Subtitle Capitalization
- **Current**: "Trait" and "Action" are capitalized ✅
- **Game**: Should be capitalized "Trait" and "Action" ✅
- **Fix**: Capitalized in HTML

### 3. ❌ Background Colors
- **Current**: Wrong background colors
- **Game**: Need correct background colors
- **Fix**: Update `.trait-card` background color (need reference)

### 4. ❌ Type Badges (Bottom Right)
- **Current**: Badges have boxes/backgrounds (pills)
- **Game**: Just plain text, no boxes
- **Fix**: Remove background, border, padding from `.type-badge`

### 5. ❌ Description Text Colors
- **Current**: Text colors don't match game
- **Game**: Need correct color values
- **Fix**: Update color classes (`.color-orange`, etc.)

### 6. ❌ Icon Backgrounds
- **Current**: Uniform background treatment
- **Game**:
  - Some icons have no box
  - Diamond-shaped icons have different colored grey box behind them
- **Fix**: Conditional styling based on icon shape/type

### 7. ❌ Action Capitalization
- **Current**: "Action" is capitalized
- **Game**: Should be lowercase "action"
- **Fix**: Same as #2

## Priority Order
1. Remove borders (quick fix)
2. Fix subtitle to lowercase (quick fix)
3. Remove type badge boxes (quick fix)
4. Fix background colors (need color reference)
5. Fix text colors (need color reference)
6. Icon background logic (more complex)

## Questions Needed:
- What is the exact card background color in the game?
- What are the exact text colors for game terms?
- How to determine which icons get grey boxes?
