# Sticky Header

## Overview
A minimal sticky header that appears when scrolling past the hero section. On mobile, the navigation links are hidden and only the PORT12 logo is shown.

## Breakpoint: Mobile (375x812)

### Implementation
- **Element**: `<nav>` with fixed positioning
- **Logo**: Small PORT12 text logo in top-left
- **Navigation**: Hidden on mobile (`display: none`)
- **Visibility**: Appears after scrolling past hero

### Structure
```html
<nav class="fixed top-0 right-0 z-50 px-8 pt-5 mix-blend-difference hidden md:block touch:hidden">
  <a href="#om">Om</a>
  <a href="#medlemmer">Medlemmer</a>
  <a href="#medlemskab">Medlemskab</a>
  <a href="mailto:info@port12.dk">info@port12.dk</a>
</nav>

<!-- Separate logo element -->
<div class="PORT12 sticky-logo">PORT12</div>
```

### CSS Implementation
```css
/* Desktop navigation (hidden on mobile) */
nav {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 50;
  padding: 1.25rem 2rem;
  mix-blend-mode: difference;
  display: none; /* Hidden on mobile */
}

@media (min-width: 768px) {
  nav {
    display: block;
  }
}

/* Sticky logo */
.sticky-logo {
  position: fixed;
  top: 1.25rem;
  left: 2rem;
  z-index: 50;
  font-family: var(--font-title);
  font-weight: 900;
  font-size: 1rem;
  text-transform: uppercase;
  color: currentColor;
}
```

### Mobile Behavior
On mobile (375px), the navigation is completely hidden:
- No hamburger menu observed
- Only the PORT12 logo text appears in top-left
- Logo uses dark color when over light backgrounds
- Logo uses mix-blend-mode for contrast

### Typography (Logo)
| Property | Value |
|----------|-------|
| font-family | var(--font-title) |
| font-weight | 900 |
| font-size | ~16px |
| text-transform | uppercase |
| letter-spacing | 0.025em |

### Visibility States
| State | Hero Section | About Section | Other Sections |
|-------|--------------|---------------|----------------|
| Logo color | Hidden/White | Dark | Dark |
| Nav links | Hidden | Hidden (mobile) | Hidden (mobile) |

### Animation
- **Transition**: Smooth color/opacity transitions
- **Duration**: CSS transitions (implicit)
- **Trigger**: Scroll position crossing hero boundary

### Trigger
- **Type**: Scroll position
- **Threshold**: When hero section scrolls out of view
- **Behavior**: Logo appears/changes color based on background

### Mobile Considerations
- Navigation links completely hidden (not collapsed to hamburger)
- Minimal UI footprint
- Logo provides home link functionality
- Uses `touch:hidden` utility for touch device handling

### Accessibility
- Logo should be a link to top of page
- No mobile navigation means relying on scroll or footer links
- Consider adding hamburger menu for better mobile UX

### Related Behaviours
- [hero-text-blend-mode.md](./hero-text-blend-mode.md) - Same blend mode technique

## Responsive Notes
- **Mobile (375px):** Only PORT12 logo visible, navigation links hidden entirely
- **Tablet (768px):** Still appears navigation is hidden at exactly 768px width. The `md:block` breakpoint in Tailwind is `min-width: 768px` but the site may use a custom breakpoint or the navigation container has additional conditions. PORT12 sticky logo functions identically - appears after scrolling past hero, uses mix-blend-mode for contrast on different backgrounds.
- **Desktop (1440px):** Full navigation visible in top-right corner with links: Om, Medlemmer, Medlemskab, info@port12.dk. Navigation uses `mix-blend-mode: difference` making it appear light on dark backgrounds and dark on light backgrounds. PORT12 sticky logo in top-left. Navigation links have hover states with cursor change to pointer. Smooth scroll to anchor sections when clicked.
