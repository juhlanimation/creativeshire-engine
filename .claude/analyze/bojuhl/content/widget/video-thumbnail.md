# Video Thumbnail Widget

**Purpose:** Clickable video preview with play overlay
**Type:** widget
**Visible:** mobile, tablet, desktop

## Layout (Observed Defaults)

### Mobile (375px)
- Width: 100% of container (~474px)
- Height: Auto (maintains aspect ratio)
- Aspect ratio: 16:9 (1.78:1)

### Structure
- Container (relative positioning)
- Image/Video poster
- Play/Watch overlay (centered)

## Visual Treatment (Observed Defaults)

### Container
- Aspect ratio: 16:9
- Overflow: hidden
- Border-radius: 0

### Thumbnail Image
- Object-fit: cover
- Width: 100%
- Height: 100%

### Watch Overlay
- Position: Centered on thumbnail
- Background: Semi-transparent or none
- Text: "WATCH"

#### Watch Text
- Font-family: Arial, system-ui, sans-serif
- Font-size: 10px
- Font-weight: 500
- Color: white
- Text-transform: uppercase
- Letter-spacing: 0.25px

## Props / Data Schema

```typescript
interface VideoThumbnailProps {
  // Media
  src: string;                    // Thumbnail image source
  alt: string;                    // Alt text for image
  videoSrc?: string;              // Video source for playback

  // Sizing
  aspectRatio?: string;           // default: "16/9"
  width?: string;                 // default: "100%"

  // Overlay
  showWatchButton?: boolean;      // default: true
  watchLabel?: string;            // default: "WATCH"

  // Interaction
  onClick?: () => void;
}
```

## Interaction States

- Default: Static thumbnail with WATCH visible
- Hover (desktop): Overlay darkens, possible scale effect
- Tap/Click: Triggers video modal or inline playback
- Focus: Visible focus ring around container

## Responsive Behavior

| Breakpoint | Width | Aspect Ratio |
|------------|-------|--------------|
| Mobile | 100% | 16:9 |
| Tablet | 100% | 16:9 |
| Desktop | Variable | 16:9 |

## Accessibility

- Role: button (interactive)
- ARIA: aria-label="Watch {project name} video"
- Keyboard: Space/Enter activates
- Focus: Clear focus indicator

---

### Tablet (768px+)

#### Size Changes
| Property | Mobile | Tablet |
|----------|--------|--------|
| Width | 100% (~474px) | **~431px** |
| Height | ~267px | **~243px** |
| Aspect ratio | 16:9 | 16:9 (same) |

#### Changes from Mobile
- Slightly smaller to fit two-column card layout
- Same aspect ratio maintained
- WATCH overlay styling unchanged
- Hover effects same as mobile/desktop

---

### Desktop (1024px+)

#### Size at Desktop
| Property | Tablet | Desktop |
|----------|--------|---------|
| Width | ~431px | ~500-650px (fluid) |
| Height | ~243px | ~280-365px |
| Aspect ratio | 16:9 | 16:9 (same) |

#### Hover States (Desktop-specific)
- **Default:** Static thumbnail with "WATCH" text visible
- **Hover:**
  - Thumbnail may scale slightly (1.02-1.05x)
  - Overlay darkens for contrast
  - "WATCH" text becomes more prominent
  - Cursor: pointer

#### Watch Overlay
- Position: Centered on thumbnail
- Text: "WATCH" (10px, 500 weight, uppercase)
- Color: White
- Letter-spacing: 0.25px
- Visibility: Always visible, enhanced on hover

#### Changes from Tablet
- Scales proportionally with card container
- Same 16:9 aspect ratio maintained
- Hover effects activate (cursor, scale, overlay)
- Same WATCH overlay styling
