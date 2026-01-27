# ScrollBackgroundSlideshow

**Purpose:** Cycles through a series of portfolio background images in the hero section based on scroll position, creating a dynamic showcase of the creator's work
**Type:** behaviour
**Applies to:** Hero section background

## Trigger (Observed Defaults -> Props)
- Event: scroll
- Target: Hero section / document scroll
- Threshold: Scroll position mapped to image index (appears to be ~100-200px per image transition)

## Animation (Observed Defaults -> Props)

### Keyframes
The background transitions through multiple portfolio images in sequence:
1. Light burst / sun rays (yellow-green gradient with lens flare)
2. Anime forest scene with sleeping blue creature (Bulbasaur-like)
3. Orange/red action scene with silhouettes
4. Clash Royale king character
5. Studio Ghibli-style nature scene with wind chimes and lanterns
6. Dark/black transition to about section

### Timing
- Duration: Instant crossfade based on scroll position (no tween animation observed)
- Easing: linear (direct scroll mapping)
- Delay: 0ms
- Stagger: N/A

### CSS Variables Set
- Likely uses `--scroll-progress` or similar for position calculation
- Background image changes via CSS or JS based on scroll threshold

## States
| State | Properties |
|-------|------------|
| Initial | Light burst background, purple text |
| Scroll 20% | Anime creature background, mixed text colors |
| Scroll 40% | Orange action scene, cyan text |
| Scroll 60% | King character, transitioning text |
| Scroll 80% | Nature scene with wind chimes |
| Exit | Dark background, white text (transition to About) |

## GIF Reference
- Mobile: `../../assets/home-mobile.gif` @ ~0-5s (hero scroll sequence)
- Tablet: `../../assets/home-tablet.gif` @ ~0-8s (hero scroll sequence)
- Desktop: `../../assets/home-desktop.gif` @ ~0-5s (hero slideshow cycling)

## Responsive Notes
- Mobile: Full viewport height hero section, images optimized/cropped for mobile viewport
- Tablet: Same scroll-triggered behaviour, hero section maintains full viewport height
- Tablet: More background images visible in sequence (Wolverine, Goblin scenes added)
- Tablet: Scroll sensitivity similar to mobile touch scrolling
- Desktop: Auto-cycling slideshow with ~4-5s interval between images
- Desktop: Full viewport hero, images fill screen with higher resolution
- Desktop: Includes dark cave/mine scene, nature forest scenes, Clash Royale king scene, underwater light scene
- Desktop: Transitions appear to be time-based auto-rotation rather than scroll-triggered only

## Implementation Notes
- Background images are portfolio showcase pieces (client work)
- Images cycle through different art styles/projects
- Creates visual interest and immediate portfolio preview
- No parallax effect observed - direct image swap based on scroll threshold

## Props Schema
```typescript
interface ScrollBackgroundSlideshowProps {
  images: string[]              // Array of background image URLs
  scrollThresholds?: number[]   // Scroll positions for each image transition
  transitionType?: 'instant' | 'crossfade'
  heroHeight?: string           // Height of hero section (default: 100vh)
}
```

## Dependencies
- Requires: Scroll event listener or Intersection Observer
- Used by: Hero section
