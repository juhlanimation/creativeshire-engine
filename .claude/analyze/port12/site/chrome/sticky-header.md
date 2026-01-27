# Sticky Header Chrome

## Overview
Minimal sticky header that appears after scrolling past the hero section. Contains only the PORT12 logo text, positioned at top-left.

## Mobile Layout (375px)

### Dimensions
- **Height**: Auto (content-based, ~48px)
- **Width**: 100%
- **Position**: Fixed, top: 0
- **Padding**: 16px 24px
- **Z-index**: High (above all content)

### Structure
```
[Header Container - fixed top]
  [Logo Text "PORT12"]
```

## Visual Treatment

### Container
- **Background**: Transparent (content shows through)
- **No border or shadow**
- **Pointer-events**: none on container, auto on logo

### Logo Text
- **Text**: "PORT12"
- **Font-family**: Bold condensed sans-serif (matches hero)
- **Font-size**: ~24px
- **Color**: Black (#1A1A1A)
- **Text-transform**: UPPERCASE
- **Letter-spacing**: Tight
- **Pointer-events**: auto (clickable)

## Visibility Behaviour

### Trigger
- **Appears**: When scroll position > hero section height (100vh)
- **Hidden**: When at top of page (hero visible)

### Animation
- **Type**: Fade in
- **Duration**: 0.3s
- **Easing**: ease-out

## Props Schema
```typescript
interface StickyHeaderProps {
  logo: string;                    // "PORT12"
  logoLink?: string;               // "#top" or "/"
  showAfterScroll?: number;        // px, default viewport height
}
```

## Interaction States

### Logo Click
- Scrolls to top of page
- Smooth scroll behaviour

### Scroll States
| Scroll Position | Header State |
|-----------------|--------------|
| 0 - 100vh | Hidden (opacity: 0) |
| > 100vh | Visible (opacity: 1) |

## Accessibility
- Logo is a link or button with appropriate label
- Keyboard accessible
- Skip-to-content link may be included (not observed)

## Responsive Notes
- Logo size may increase slightly on larger screens
- Position remains top-left across all breakpoints
- May include navigation links on desktop (see navigation.md)

## Related Components
- `widget/logo-text.md` - PORT12 text styling
- `chrome/navigation.md` - Full navigation (visible on desktop or via menu)

---

## Tablet (768px)

### Changes from Mobile
- **Height**: Same auto/content-based (~48-56px)
- **Logo size**: ~28px (slight increase from ~24px)
- **Padding**: 20px 32px (increased from 16px 24px)

### Visual Differences
- Logo slightly larger for better proportion
- Same transparent background
- Same fade-in animation on scroll
- Navigation links still not visible in header at tablet

### Behaviour
- Same trigger point (after hero section)
- Same opacity transition (0.3s)
- Logo click scrolls to top

---

## Desktop (1440px)

### Changes from Tablet
- **Logo size**: ~32px (increased from ~28px)
- **Padding**: 24px 48px (increased from 20px 32px)
- **Navigation**: May include nav links alongside logo (not observed)

### Dimensions
- **Height**: Auto (~56-64px with padding)
- **Width**: 100%
- **Position**: Fixed, top: 0
- **Padding**: 24px 48px
- **Z-index**: High (above all content)

### Visual Differences
- Logo "PORT12" larger and more prominent (~32px)
- Transparent background maintained
- More horizontal padding for balanced appearance
- Navigation links may appear at this breakpoint (design allows for it)
- Same fade-in animation when scrolling past hero

### Logo at Desktop
- **Text**: "PORT12"
- **Font-size**: ~32px
- **Font-family**: Bold condensed sans-serif
- **Color**: Black (#1A1A1A)
- **Position**: Top-left
- **Click**: Scrolls to top of page

### Behaviour
- Appears after scrolling past hero (100vh)
- Fade-in transition: 0.3s ease-out
- Pointer-events: auto on logo for click interaction
