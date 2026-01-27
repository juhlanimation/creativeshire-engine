# LogoMarquee

**Purpose:** Continuously scrolls client/partner logos horizontally to showcase the breadth of collaborations
**Type:** behaviour
**Visible:** tablet, desktop (not observed on mobile analysis)

## Trigger (Observed Defaults -> Props)
- Event: automatic (continuous animation)
- Target: Logo container in About section
- Threshold: N/A (always animating when in viewport)

## Animation (Observed Defaults -> Props)

### Keyframes
- Horizontal scroll from right to left
- Seamless loop (logos repeat infinitely)

### Timing
- Duration: ~15-20s for full cycle (estimated)
- Easing: linear (constant speed)
- Delay: 0ms
- Stagger: N/A

### CSS Variables Set
- Likely uses CSS animation with `translateX` or `@keyframes`
- May use `animation: marquee Xs linear infinite`

## States
| State | Properties |
|-------|------------|
| Active | Logos scrolling horizontally left-to-right |
| Paused | May pause on hover (not tested) |

## Visual Details
- **Logos observed**: Riot Games, EA, Ubisoft, 2K, Supercell, Respawn Entertainment, Azuki
- **Logo style**: Monochrome/grayscale for consistency
- **Position**: Below About section bio text, above Projects section
- **Layout**: Single row, logos evenly spaced

## GIF Reference
- Mobile: N/A (not observed or not present at mobile breakpoint)
- Tablet: `../../assets/home-tablet.gif` @ ~5-10s (logos visible scrolling)
- Desktop: `../../assets/home-desktop.gif` @ ~2-3s (logo marquee visible)

## Responsive Notes
- Mobile: N/A - Logo marquee may not be visible or uses different presentation
- Tablet: Continuous horizontal scroll animation, ~4-5 logos visible at once
- Tablet: Positioned between About section and Projects section
- Desktop: Continuous horizontal scroll animation
- Desktop: Logos include: Cartoon Network, Riot Games, EA, Ubisoft, 2K, Supercell, and more
- Desktop: ~6-7 logos visible at once due to wider viewport
- Desktop: Positioned between About section (with bio) and Featured Projects section
- Desktop: Same linear scrolling speed as tablet

## Accessibility Considerations
- Animation should respect `prefers-reduced-motion` media query
- Consider pausing animation on hover for users who want to read logo names
- Logos should have alt text for screen readers

## Implementation Notes
- Uses CSS animation for smooth, performant scrolling
- Logos likely duplicated in DOM for seamless loop effect
- May use intersection observer to only animate when visible (performance)

## Props Schema
```typescript
interface LogoMarqueeProps {
  logos: {
    src: string           // Logo image URL
    alt: string           // Logo alt text (company name)
    href?: string         // Optional link to company
  }[]
  speed?: number          // Animation duration in seconds (default: 20)
  pauseOnHover?: boolean  // Pause animation on hover (default: false)
  direction?: 'left' | 'right'  // Scroll direction (default: 'left')
}
```

## Dependencies
- Requires: None (pure CSS animation)
- Used by: About section / Client logos section
