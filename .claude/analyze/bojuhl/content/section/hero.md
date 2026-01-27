# Hero Section

**Purpose:** Full-viewport hero with video background, intro text, role titles, and scroll indicator
**Type:** section
**Visible:** mobile, tablet, desktop

## Layout (Observed Defaults)

### Mobile (375px)
- Width: 100vw (375px actual)
- Height: 100vh (fills viewport)
- Padding: 0
- Content positioned absolutely at bottom-left

### Content Container
- Padding: 0 32px (horizontal padding on inner wrapper)
- Position: absolute, bottom-left aligned

## Visual Treatment (Observed Defaults)

### Colors
- Background: rgb(0, 0, 0) (black, video overlays this)
- Text primary: rgb(255, 255, 255) (white)
- Text effect: mix-blend-mode: difference (creates cyan/purple effect over video)

### Typography

#### Intro Text ("I'm Bo Juhl")
- Font-family: "Plus Jakarta Sans", system-ui, sans-serif
- Font-size: 14px
- Font-weight: 500
- Line-height: 20px
- Letter-spacing: 0.35px
- Color: white with mix-blend-mode: difference

#### Role Titles (H1)
- Font-family: Inter, system-ui, sans-serif
- Font-size: 32px
- Font-weight: 900 (Black)
- Line-height: 30.4px (0.95 ratio)
- Letter-spacing: 0.8px
- Color: white with mix-blend-mode: difference
- Text-transform: uppercase (via content)
- Margin-bottom: 0 (stacked tight)
- Gap between titles: ~13px

#### Scroll Indicator ("(SCROLL)")
- Font-family: "Plus Jakarta Sans", system-ui, sans-serif
- Font-size: 14px
- Font-weight: 700
- Letter-spacing: 1.4px
- Color: white with mix-blend-mode: difference
- Position: centered at bottom

### Video Background
- Position: absolute
- Object-fit: cover
- Width/Height: 100% of container
- Z-index: behind text

## Props / Data Schema

```typescript
interface HeroSectionProps {
  // Content
  introText: string;              // "I'm Bo Juhl"
  roles: string[];                // ["EXECUTIVE PRODUCER", "PRODUCER", "EDITOR"]
  scrollIndicatorText?: string;   // "(SCROLL)"

  // Video
  videoSrc: string;               // Background video source
  videoPoster?: string;           // Fallback image

  // Layout (defaults)
  height?: string;                // default: "100vh"
  contentPadding?: string;        // default: "0 32px"
}
```

## Interaction States

- Default: Video plays automatically, text visible with blend effect
- Hover: N/A on mobile
- Scroll: Hero scrolls up, revealing About section (parallax effect)

## Behaviours

- **scroll-background-slideshow**: Video background creates dynamic color changes
- **hero-text-color-transition**: Text color shifts due to mix-blend-mode: difference
- **scroll-indicator**: Subtle animation drawing attention to scroll

## Accessibility

- Role: region (implicit from section)
- ARIA: Video should have aria-hidden="true" (decorative)
- Keyboard: Page scrollable, video controls hidden
- Motion: Consider prefers-reduced-motion for video

---

### Tablet (768px+)

- Width: 100vw
- Height: 100vh (877px observed)
- Padding: 0
- Content positioned absolutely at bottom-left (same as mobile)

#### Typography Changes
| Element | Mobile | Tablet |
|---------|--------|--------|
| Role Titles (H1) | 32px / 30.4px | 47px / 44.7px |
| Letter-spacing | 0.8px | 1.18px |
| Intro Text | 14px | 16px |

#### Changes from Mobile
- Hero titles significantly larger (~47% increase)
- Intro text slightly larger
- Same overall layout (full-bleed video, bottom-left text)
- Floating contact chrome now visible in top-right corner

---

### Desktop (1024px+)

**Note:** Desktop breakpoint uses `lg:px-24` and `lg:px-48` Tailwind classes for increased horizontal padding.

- Width: 100vw
- Height: 100vh (fills viewport)
- Padding: 0
- Content positioned absolutely at bottom-left (same as tablet)

#### Typography (scales with viewport)
| Element | Tablet (768px) | Desktop (1024px+) |
|---------|----------------|-------------------|
| Role Titles (H1) | 47px / 44.7px | ~60-72px (fluid scaling) |
| Letter-spacing | 1.18px | ~1.5px |
| Intro Text | 16px | 16-18px |

#### Layout at Desktop
- Same full-bleed video background
- Content padding increases: `lg:px-24` (96px) or `lg:px-48` (192px)
- Floating contact chrome persists in top-right
- More whitespace around text due to larger viewport

#### Changes from Tablet
- Increased horizontal padding on content container
- Typography may scale slightly larger (fluid type)
- More breathing room around text elements
- Same structural layout maintained
