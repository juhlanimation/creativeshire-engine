# Logo Marquee Widget

**Purpose:** Animated horizontal scroll of client logos demonstrating portfolio breadth
**Type:** widget
**Visible:** tablet, desktop (HIDDEN on mobile)

## Layout (Observed Defaults)

### Mobile (375px)
- **DISPLAY: NONE** - Hidden on mobile via `hidden md:flex` classes
- Not visible to mobile users

### Tablet (768px+)
- Display: flex
- Position: absolute
- Bottom: 32px (from parent section)
- Left/Right: 0 (full width)
- Height: 168px (includes overflow for animation)
- Z-index: Above section content

## Visual Treatment (Observed Defaults)

### Container
- Flex direction: row
- Overflow: hidden (clips animation)
- Gap: 4px between logo groups

### Logo Images
- Filter: brightness(0) invert(1) - renders all logos white
- Individual logo width: Variable based on aspect ratio
- Height: Auto (maintains aspect ratio)
- Opacity: 1

### Animation
- Continuous horizontal scroll (marquee effect)
- Direction: Right to left
- Speed: Smooth, non-jarring
- Loop: Infinite (logos duplicated 3x for seamless loop)

## Client Logos (from site)

1. Netflix
2. Amazon Studios
3. Cartoon Network
4. Riot Games
5. EA Games
6. Ubisoft
7. 2K Games
8. Supercell
9. Respawn Entertainment
10. Azuki

## Props / Data Schema

```typescript
interface LogoMarqueeProps {
  // Content
  logos: Array<{
    name: string;           // "Netflix", "Riot Games"
    src: string;            // Image source
    alt: string;            // Alt text
  }>;

  // Animation
  speed?: number;           // Animation duration in seconds
  direction?: 'left' | 'right';  // default: 'left'
  pauseOnHover?: boolean;   // default: false

  // Styling
  gap?: string;             // default: "4px"
  logoFilter?: string;      // default: "brightness(0) invert(1)"
  height?: string;          // default: "auto"
}
```

## Responsive Behavior

| Breakpoint | Visibility | Position |
|------------|------------|----------|
| Mobile (<768px) | Hidden | N/A |
| Tablet (768px+) | Visible | Absolute, bottom of About section |
| Desktop (1024px+) | Visible | Absolute, bottom of About section |

## Parent Context

- Lives inside About section
- Positioned absolutely at bottom
- Shows client credibility without interrupting bio content

## Accessibility

- Role: Decorative (logos are supplementary)
- ARIA: aria-hidden="true" recommended (decorative content)
- Motion: Should respect prefers-reduced-motion (pause animation)
- Alt text: Each logo should have descriptive alt for accessibility tools

---

### Desktop (1024px+)

#### Layout at Desktop
| Property | Tablet | Desktop |
|----------|--------|---------|
| Display | flex | flex (same) |
| Position | absolute, bottom: 32px | absolute, bottom: 32px (same) |
| Height | 168px | 168px (same) |
| Width | 100% of section | 100% of section (same) |
| Gap | 4px | 4px (same) |

#### Logo Sizing
- Individual logos: Variable width based on aspect ratio
- Height: Auto (maintains aspect ratio)
- Filter: brightness(0) invert(1) - white logos

#### Animation
- Continuous horizontal scroll (marquee)
- Direction: Right to left
- Speed: Consistent across breakpoints
- Loop: Infinite (logos duplicated 3x for seamless loop)

#### Changes from Tablet
- Same layout and positioning
- Same animation behavior
- Logos may appear slightly larger due to viewport scaling
- No structural changes
