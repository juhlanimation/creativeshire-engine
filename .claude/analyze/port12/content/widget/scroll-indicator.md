# Scroll Indicator Widget

## Overview
Text-based scroll affordance displayed at the bottom of the hero section, prompting users to scroll down to discover content.

## Mobile Layout (375px)

### Dimensions
- **Position**: Absolute, bottom of hero container
- **Bottom offset**: ~40px
- **Width**: Auto (content-based)
- **Alignment**: Center horizontal

### Structure
```
[Scroll Indicator Container]
  [Text "(SCROLL)"]
```

## Visual Treatment

### Text
- **Content**: "(SCROLL)"
- **Font-family**: Sans-serif
- **Font-size**: 12px
- **Font-weight**: Normal or medium
- **Color**: White with ~70% opacity (rgba(255,255,255,0.7))
- **Text-transform**: UPPERCASE
- **Letter-spacing**: 0.1em (slightly wide)

### Parentheses
- Included in text, not separate elements
- Same styling as main text
- Creates subtle visual containment

## Animation (Behaviour Reference)

### Idle State
- Subtle pulse or fade animation
- Draws attention without being distracting
- Animation: opacity 0.7 -> 1.0 -> 0.7, 2s infinite

### On Scroll
- Fades out as user begins scrolling
- Transition: opacity 0.3s ease-out

## Props Schema
```typescript
interface ScrollIndicatorProps {
  text?: string;           // Default: "(SCROLL)"
  color?: string;          // Default: white
  opacity?: number;        // Default: 0.7
  animated?: boolean;      // Default: true
  hideOnScroll?: boolean;  // Default: true
}
```

## Interaction States

| State | Opacity | Animation |
|-------|---------|-----------|
| Default | 0.7 | Pulsing |
| Hover | 0.9 | Pause animation |
| Scrolling | 0 | Fade out |

## Accessibility
- Provides visual affordance for scrolling
- Not essential for navigation (decorative)
- Hidden from screen readers (aria-hidden="true")
- Page can be scrolled without clicking this element

## Responsive Notes
- Position adjusts based on viewport height
- Font size may increase slightly on larger screens
- Always positioned at bottom-center of hero

## Related Components
- `section/hero.md` - Parent container
- `widget/scroll-progress-bar.md` - Complementary scroll feedback

---

## Tablet (768px)

### Changes from Mobile
- **Position**: Same bottom-center placement
- **Font-size**: Same 12px (no change)
- **Animation**: Same pulse behaviour

### Visual Differences
- No significant changes at tablet
- Widget maintains consistent appearance across breakpoints

---

## Desktop (1440px)

### Changes from Tablet
- **Position**: Same bottom-center placement
- **Font-size**: Same 12px (no change)
- **Animation**: Same pulse behaviour

### Visual Differences
- No significant changes at desktop
- Widget maintains consistent appearance across all breakpoints
- Still positioned ~40px from bottom of hero
- White text with ~70% opacity
- Subtle pulse animation continues
