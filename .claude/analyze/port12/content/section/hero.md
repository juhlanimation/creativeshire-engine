# Hero Section

## Overview
Full-viewport hero with animated background slideshow and masked logo text. The "PORT12" text acts as a clipping mask revealing the slideshow images behind it.

## Mobile Layout (375px)

### Dimensions
- **Height**: 100vh (full viewport)
- **Width**: 100%
- **Padding**: 0

### Structure
```
[Hero Container - 100vh]
  [Background Slideshow - absolute, full cover]
  [Content - centered, z-index above background]
    [Logo Text "PORT12" - masked, revealing slideshow]
    [Tagline "DROM - DEL - SKAB"]
    [Scroll Indicator "(SCROLL)"]
  [Scroll Progress Bar - fixed right edge]
```

## Visual Treatment

### Logo Text Mask
- **Font**: Bold sans-serif, approximately 80px on mobile
- **Effect**: Text acts as clipping mask for background images
- **Color**: Text outline is light blue (#A8C8E8 approximately)
- **Letter-spacing**: Tight, creating solid block appearance

### Tagline
- **Text**: "DROM - DEL - SKAB" (Dream - Share - Create)
- **Font-size**: ~14px
- **Color**: White with slight transparency
- **Separator**: Bullet points between words
- **Position**: Centered below logo

### Scroll Indicator
- **Text**: "(SCROLL)"
- **Font-size**: ~12px
- **Color**: White/light gray with transparency
- **Position**: Bottom center, ~40px from bottom
- **Animation**: Subtle fade/pulse to draw attention

### Scroll Progress Bar
- **Position**: Fixed, right edge of viewport
- **Width**: ~4px
- **Height**: Dynamic based on scroll position
- **Color**: White/light

### Background Slideshow
- **Images**: Multiple lifestyle photos of the coworking space
  - Coffee cup on table
  - Pasta making activity
  - Interior with lamp
  - Art supplies/paper rolls
  - People at dinner table
- **Transition**: Crossfade between images
- **Duration**: ~4-5 seconds per image
- **Object-fit**: cover

## Props Schema
```typescript
interface HeroProps {
  logo: string;                    // "PORT12"
  tagline: string;                 // "DROM - DEL - SKAB"
  scrollIndicatorText: string;     // "(SCROLL)"
  backgroundImages: {
    src: string;
    alt: string;
  }[];
  slideshowInterval?: number;      // ms, default 4000
}
```

## Interaction States

### Default
- Slideshow auto-plays
- Scroll indicator visible

### On Scroll
- Hero section scrolls out of view
- Sticky header appears (see chrome/sticky-header.md)
- Scroll progress bar updates

## Accessibility
- Background images are decorative (no alt text needed for mask effect)
- Scroll indicator provides clear affordance
- High contrast between text outline and backgrounds

## Responsive Notes
- Logo scales proportionally on larger screens
- Text mask effect works at all sizes
- Slideshow images are optimized for various aspect ratios

## Related Components
- `widget/scroll-indicator.md` - The (SCROLL) text widget
- `widget/scroll-progress-bar.md` - Vertical progress indicator
- `chrome/sticky-header.md` - Appears after scrolling past hero

---

## Tablet (768px)

### Changes from Mobile
- **Layout**: Same full-viewport hero, no structural changes
- **Logo text size**: Scales larger (~100-120px) due to viewport width
- **Tagline**: Same styling, slightly more breathing room
- **Scroll indicator**: Same position and styling
- **Background slideshow**: Same behaviour, images better utilized at wider aspect ratio

### Dimensions
- **Height**: 100vh (unchanged)
- **Width**: 100%
- **Padding**: 0

### Visual Differences
- Logo text more prominent due to increased size
- Background images show more horizontal content
- Scroll progress bar remains on right edge
- No navigation visible in hero (stays hidden until scroll)

---

## Desktop (1440px)

### Changes from Tablet
- **Logo text size**: Significantly larger (~140-160px), scales with viewport width using vw units
- **Layout**: Same full-viewport hero, no structural changes
- **Background slideshow**: Images fully utilized at wide aspect ratio
- **Spacing**: More horizontal breathing room around centered content

### Dimensions
- **Height**: 100vh (unchanged)
- **Width**: 100%
- **Padding**: 0

### Visual Differences
- Logo "PORT12" text is dramatically larger, filling more viewport width
- Image clipping mask effect more impactful at larger scale
- Light blue text stroke (~2-3px) more visible
- Tagline "DROM - DEL - SKAB" maintains same size (~14px)
- Scroll indicator "(SCROLL)" at bottom center unchanged
- Scroll progress bar on right edge (white, 4px wide)
- Background slideshow shows full workspace scene with natural lighting

### Typography at Desktop
- Logo: ~140-160px (increased from ~100-120px at tablet)
- Tagline: ~14px (unchanged)
- Scroll indicator: ~12px (unchanged)

### Behaviour
- Slideshow auto-plays with crossfade transitions (~4-5s interval)
- Scroll indicator has subtle pulse animation
- Hero scrolls out to reveal about section
- Sticky header appears after scrolling past 100vh
