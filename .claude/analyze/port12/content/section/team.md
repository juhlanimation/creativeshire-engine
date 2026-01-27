# Team Section

## Overview
Interactive team member showcase with names displayed over dynamic portrait backgrounds. Names highlight on hover/scroll, revealing each member's photo or artwork.

## Mobile Layout (375px)

### Dimensions
- **Height**: 100vh (full viewport, scroll-locked section)
- **Width**: 100%
- **Padding**: 24px horizontal

### Structure
```
[Team Container - 100vh, relative]
  [Background Image/Artwork - absolute, full cover]
  [Content Overlay - relative, z-index above]
    [Section Label "Vi er"]
    [Member Names Stack]
      [Name 1 - RUNE SVENNINGSEN]
      [Name 2 - MARIA TRANBERG]
      [Name 3 - NICOLAJ LARSSON]
      [Name 4 - TOR BIRK TRADS]
      [Name 5 - BO JUHL]
      [Name 6 - MARIA KJAER]
```

## Visual Treatment

### Section Label
- **Text**: "Vi er" (We are)
- **Font-size**: ~14px
- **Color**: Dark gray (#333)
- **Position**: Top-left of names stack
- **Font-weight**: Normal

### Member Names
- **Font-family**: Bold condensed sans-serif
- **Font-size**: ~32-40px (fits viewport width)
- **Text-transform**: UPPERCASE
- **Line-height**: 1.1 (tight stacking)
- **Letter-spacing**: Tight

### Name States
| State | Color | Opacity |
|-------|-------|---------|
| Active/Highlighted | Dark blue (#1A365D) or Black | 1.0 |
| Inactive | Light gray (#CCCCCC) | 0.5 |

### Background Images
Each member has an associated portrait or artwork:
- **Rune Svenningsen**: Close-up portrait photo (woman with fur hat)
- **Maria Tranberg**: Portrait photo
- **Nicolaj Larsson**: Purple illustrated artwork with skull/figure
- **Tor Birk Trads**: Portrait or artwork
- **Bo Juhl**: Portrait photo
- **Maria Kjaer**: Portrait or artwork

### Background Styling
- **Position**: absolute, full container coverage
- **Object-fit**: cover
- **Transition**: Crossfade between images (0.3-0.5s)
- **Z-index**: Below text overlay

## Props Schema
```typescript
interface TeamMember {
  name: string;
  image: {
    src: string;
    alt: string;
    type: 'photo' | 'artwork';
  };
}

interface TeamProps {
  sectionLabel: string;          // "Vi er"
  members: TeamMember[];
  initialActiveMember?: number;  // Index, default 0
}
```

## Interaction States

### Mobile (Scroll-based)
- Active member changes as user scrolls through section
- Section may be "scroll-jacked" to cycle through members
- Each scroll tick advances to next member

### Desktop (Hover-based)
- Hovering over a name highlights it and shows their image
- Non-hovered names fade to gray

### Transitions
- Name color: 0.2s ease
- Background image: 0.4s crossfade
- Smooth, not jarring

## Accessibility
- Names are semantic headings (h2 or similar)
- Background images have alt text for screen readers
- Keyboard navigation should cycle through members
- Consider aria-live for background changes

## Responsive Notes
- Names scale to fit viewport width
- May switch from scroll-based to hover-based on larger screens
- Background images optimized for portrait orientation on mobile

## Related Components
- `widget/team-member-name.md` - Individual name with states
- `behaviour/team-member-reveal.md` - Scroll/hover interaction logic

---

## Tablet (768px)

### Changes from Mobile
- **Layout**: Same full-viewport section with stacked names
- **Name sizing**: Font scales larger (~48-56px) to fill wider viewport
- **Background images**: Better utilized at tablet aspect ratio
- **Interaction**: Still scroll-based on tablet (not hover)

### Dimensions
- **Height**: 100vh (unchanged)
- **Width**: 100%
- **Padding**: 32px horizontal

### Visual Differences
- Names are larger and more impactful
- Background artwork/photos show more detail at wider viewport
- "Vi er" label in same position (top-left)
- All 6 member names still stack vertically
- Active/inactive states remain the same

### Interaction
- Scroll-based member cycling (same as mobile)
- May transition to hover-based at larger breakpoints
- Background crossfade timing unchanged (0.4s)

---

## Desktop (1440px)

### Changes from Tablet
- **Font-size**: ~70-80px (significantly increased from ~48-56px)
- **Interaction**: HOVER-BASED (not scroll-based like mobile/tablet)
- **Background**: Full-bleed member portrait/artwork visible
- **Layout**: Names stack vertically, filling viewport height

### Dimensions
- **Height**: 100vh (full viewport)
- **Width**: 100%
- **Padding**: 48px horizontal

### Visual Differences
- Names are dramatically larger, creating strong typographic impact
- All 6 names visible in single viewport without scrolling
- "Vi er" section label remains at top-left (~14px, gray)
- Active member name in accent color (peach/salmon ~#E8A87C)
- Inactive names in semi-transparent gray (#AAAAAA at ~50% opacity)
- Background image shows through text (names have transparency)
- Background transitions smoothly between member images on hover

### Name States at Desktop
| State | Color | Opacity |
|-------|-------|---------|
| Active/Hovered | Accent peach (#E8A87C) | 1.0 |
| Inactive | Light gray (#AAAAAA) | 0.5 |

### Interaction (Desktop-Specific)
- **Hover**: Moving mouse over a name activates it
- **Background**: Corresponding portrait/artwork crossfades in (0.4s)
- **Default**: First member (Rune Svenningsen) active on initial load
- **Mouse leave**: Maintains last hovered state or returns to default

### Background Images Observed
- Ocean/wave photograph (blue/white water) - dramatic landscape
- Portrait photos of individual members
- Illustrated artwork (e.g., Nicolaj Larsson's purple illustration)

### Typography at Desktop
- Names: ~70-80px (bold condensed sans-serif)
- "Vi er" label: ~14px (regular weight, dark gray)
- Line-height: 1.1 (tight stacking)
- Letter-spacing: -0.01em

### Scroll Progress Bar
- Visible on right edge
- White, 4px wide
- Updates as user scrolls through page
