# Scroll Indicator

## Overview
A "(SCROLL)" text label at the bottom of the hero section indicating users should scroll down. On touch devices, an arrow icon is shown instead.

## Breakpoint: Mobile (375x812)

### Implementation
- **Text Element**: `<span>` with "(SCROLL)" text - hidden on touch devices
- **Arrow Element**: `<svg>` arrow icon - shown only on touch devices
- **Position**: Fixed at bottom center of viewport
- **Visibility**: Conditional based on device type

### Structure
```html
<div class="fixed bottom-8 left-0 right-0 z-0 flex justify-center pointer-events-none">
  <!-- Text version (hidden on touch) -->
  <span class="font-heading text-sm uppercase tracking-widest text-white block touch:hidden">
    (SCROLL)
  </span>

  <!-- Arrow version (touch only) -->
  <svg class="w-6 h-6 text-white hidden touch:block" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M19 14l-7 7m0 0l-7-7m7 7V3" />
  </svg>
</div>
```

### CSS Properties
```css
.scroll-indicator {
  position: fixed;
  bottom: 2rem; /* 32px */
  left: 0;
  right: 0;
  z-index: 0;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.scroll-text {
  font-family: var(--font-heading);
  font-size: 0.875rem; /* 14px */
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: white;
}

/* Touch device detection via CSS */
@media (pointer: coarse) {
  .scroll-text { display: none; }
  .scroll-arrow { display: block; }
}
```

### Typography
| Property | Value |
|----------|-------|
| font-family | var(--font-heading) |
| font-size | 14px |
| text-transform | uppercase |
| letter-spacing | 0.1em (widest) |
| color | white |

### Arrow Icon
| Property | Value |
|----------|-------|
| size | 24x24px |
| stroke-width | 2 |
| color | white |
| direction | down |

### Animation
- **Current**: No animation observed on mobile
- **Potential Enhancement**: Subtle bounce or fade animation could be added

### Trigger
- **Type**: Static visibility
- **Behavior**: Always visible while in hero section
- **Hide on scroll**: May fade out when user scrolls past hero (not observed)

### Touch Device Handling
- Uses `touch:hidden` and `touch:block` utility classes
- Detects touch capability via CSS `@media (pointer: coarse)`
- Shows simpler arrow icon for touch users

### Mobile Considerations
- Uses fixed positioning for consistent placement
- `pointer-events: none` prevents blocking scroll gestures
- Arrow icon is clearer for touch interaction paradigm

## Responsive Notes
- **Mobile (375px):** Shows arrow icon (touch device detected via `@media (pointer: coarse)`)
- **Tablet (768px):** Shows "(SCROLL)" text instead of arrow - tablet with trackpad/mouse detected as non-touch device, text label provides clearer guidance for cursor-based interaction
- **Desktop (1440px):** Shows "(SCROLL)" text, same as tablet. Text uses mix-blend-mode for contrast against video background. Positioned at bottom center of viewport, fixed position.
