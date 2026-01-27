# HeroTextColorTransition

**Purpose:** Dynamically adjusts hero text color to maintain readability and visual harmony as the background images change during scroll
**Type:** behaviour
**Applies to:** Hero section title text ("I'm Bo Juhl", "EXECUTIVE PRODUCER", "PRODUCER", "EDITOR")

## Trigger (Observed Defaults -> Props)
- Event: scroll (synchronized with background slideshow)
- Target: Hero text elements
- Threshold: Same as background image transitions

## Animation (Observed Defaults -> Props)

### Color States Observed
1. **Light burst background**: Purple/indigo text (#5B4B9E or similar)
2. **Colorful illustration backgrounds**: Dark text with white stroke/outline for contrast
3. **Orange/red background**: Cyan/teal text (#00CED1 or similar)
4. **Dark transition**: White text

### Timing
- Duration: Instant (matches background transition)
- Easing: linear
- Delay: 0ms
- Stagger: N/A (all text changes simultaneously)

### CSS Variables Set
- `--hero-text-color`: Dynamic color value
- `--hero-text-stroke`: Optional stroke for contrast

## States
| State | Background | Text Color | Text Stroke |
|-------|------------|------------|-------------|
| Initial | Light burst (yellow-green) | Purple (#5B4B9E) | None |
| Illustration | Colorful anime art | Dark with white stroke | 1-2px white |
| Action | Orange/red | Cyan (#00CED1) | None or dark |
| Nature | Green/forest | Mixed purple/dark | Transitioning |
| Exit | Dark/black | White | None |

## Text Styling Details
- Font: Bold sans-serif (likely custom or system font)
- "I'm Bo Juhl": Smaller, regular weight
- Title lines: Large, bold, uppercase
- "(SCROLL)" indicator: Smaller, appears at bottom

## GIF Reference
- Mobile: `../../assets/home-mobile.gif` @ ~0-5s (text color changes during scroll)
- Tablet: `../../assets/home-tablet.gif` @ ~0-8s (text color changes during scroll)
- Desktop: `../../assets/home-desktop.gif` @ ~0-5s (text color transitions with slideshow)

## Responsive Notes
- Mobile: Text positioned in lower portion of viewport, text size scales appropriately
- Tablet: Same colour transition behaviour, text size slightly larger
- Tablet: Text remains in lower-left of hero section
- Tablet: Stroke effect provides consistent readability across all backgrounds
- Desktop: Text color syncs with auto-cycling background slideshow
- Desktop: Purple/blue (#5B4B9E) on light backgrounds (sun rays, anime scenes)
- Desktop: White on dark backgrounds (cave scene, black transitions)
- Desktop: Gold/blue gradient effect observed during certain background transitions
- Desktop: Larger font size, text remains in lower-left of hero
- Desktop: Smooth color interpolation during slideshow transitions

## Implementation Notes
- Color changes appear synchronized with background image index
- May use CSS custom properties updated via JavaScript
- Alternative: Multiple text layers with opacity transitions
- Text stroke provides fallback contrast on any background

## Props Schema
```typescript
interface HeroTextColorTransitionProps {
  colorStates: {
    backgroundColor: string     // Background identifier or scroll position
    textColor: string           // Primary text color
    strokeColor?: string        // Optional stroke for contrast
    strokeWidth?: number        // Stroke width in pixels
  }[]
  transitionDuration?: number   // Duration of color transition (default: 0)
}
```

## Dependencies
- Requires: Synchronized with ScrollBackgroundSlideshow behaviour
- Used by: Hero section text elements
- CSS: text-stroke or -webkit-text-stroke for outline effect
