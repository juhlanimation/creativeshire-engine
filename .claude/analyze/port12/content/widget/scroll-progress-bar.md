# Scroll Progress Bar Widget

## Overview
Vertical progress indicator fixed to the right edge of the viewport, showing current scroll position through the page.

## Mobile Layout (375px)

### Dimensions
- **Position**: Fixed, right edge
- **Top offset**: ~100px (below header area)
- **Right offset**: 16px
- **Width**: 4px
- **Height**: Dynamic (based on scroll progress)
- **Max height**: ~calc(100vh - 200px)

### Structure
```
[Progress Container - fixed right]
  [Progress Track - full height, faint]
  [Progress Fill - dynamic height, visible]
```

## Visual Treatment

### Track (Background)
- **Width**: 4px
- **Height**: Full available height
- **Color**: Transparent or very faint white
- **Border-radius**: 2px (rounded ends)

### Fill (Progress)
- **Width**: 4px
- **Height**: Proportional to scroll position
- **Color**: White (#FFFFFF)
- **Opacity**: 0.8-1.0
- **Border-radius**: 2px

### Calculation
```
fillHeight = (scrollTop / (documentHeight - viewportHeight)) * trackHeight
```

## Props Schema
```typescript
interface ScrollProgressBarProps {
  trackColor?: string;     // Default: transparent
  fillColor?: string;      // Default: white
  width?: number;          // Default: 4px
  position?: 'left' | 'right';  // Default: right
  offset?: {
    top?: number;
    right?: number;
    bottom?: number;
  };
  showTrack?: boolean;     // Default: false
}
```

## Interaction States

### Scroll Position
| Position | Fill Height |
|----------|-------------|
| Top (0%) | 0px |
| Middle (50%) | 50% of track |
| Bottom (100%) | Full track height |

### Animation
- **Update**: Smooth, follows scroll
- **No easing**: Direct 1:1 relationship with scroll

## Visibility Behaviour

### Hero Section
- May be hidden or faint while in hero
- Becomes fully visible after scrolling past hero

### Footer Section
- Progress reaches 100% at footer
- May fade out at very bottom

## Accessibility
- Purely decorative visual indicator
- aria-hidden="true"
- Does not interfere with page scrolling
- Pointer-events: none

## Responsive Notes
- Position remains fixed-right across breakpoints
- May be hidden on very small screens
- Track height adjusts to viewport

## Related Components
- `widget/scroll-indicator.md` - Complementary scroll prompt
- `behaviour/scroll-progress.md` - Progress calculation logic

---

## Tablet (768px)

### Changes from Mobile
- **Position**: Same fixed-right placement
- **Width**: Same 4px
- **Height**: Adjusts to taller viewport (1024px)

### Visual Differences
- Track height increases proportionally with viewport
- Same white fill color and opacity
- Right offset unchanged (16px from edge)

---

## Desktop (1440px)

### Changes from Tablet
- **Position**: Same fixed-right placement
- **Width**: Same 4px
- **Height**: Adjusts to viewport height (900px)

### Visual Differences
- Track height proportional to 900px viewport
- Same white fill color (#FFFFFF) and opacity (~0.8-1.0)
- Right offset unchanged (~16px from edge)
- Visible throughout entire page scroll
- More visible against lighter backgrounds (about, pricing sections)
