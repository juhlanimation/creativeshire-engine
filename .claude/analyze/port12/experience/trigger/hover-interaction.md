# Hover Interaction Trigger

## Overview
Desktop-specific trigger mechanism using mouse hover (`:hover` pseudo-class and `mouseenter`/`mouseleave` events) to enable interactive experiences not available on touch devices.

## Implementation Pattern

### CSS Hover States
```css
/* Navigation links */
nav a:hover {
  opacity: 0.7;
  cursor: pointer;
}

/* Member names */
.member-name:hover {
  color: #b87333; /* Copper highlight */
}

/* Footer links */
footer a:hover {
  text-decoration: underline;
}
```

### JavaScript Hover Events
```javascript
// Hover-triggered video switching
element.addEventListener('mouseenter', () => {
  activateElement();
});

element.addEventListener('mouseleave', () => {
  deactivateElement();
});
```

## Usage in Port12

### 1. Member Video Carousel
- **Trigger**: `mouseenter` on member name
- **Action**: Switch active video, highlight text
- **Timing**: Immediate on hover
- **Reset**: Returns to scroll-based on `mouseleave` from section

### 2. Navigation Links
- **Trigger**: CSS `:hover`
- **Action**: Cursor change, potential opacity/color shift
- **Links**: Om, Medlemmer, Medlemskab, email

### 3. Footer Links
- **Trigger**: CSS `:hover`
- **Action**: Underline appears
- **Links**: OM PORT12, MEDLEMMER, MEDLEMSKAB

### 4. Images (Potential)
- **Trigger**: CSS `:hover`
- **Action**: Subtle scale or shadow effect
- **Target**: Photo gallery images

## CSS Detection
```css
/* Only apply hover styles on devices that support hover */
@media (hover: hover) and (pointer: fine) {
  .interactive:hover {
    /* hover styles */
  }
}
```

## Cursor States
| Element | Cursor |
|---------|--------|
| Navigation links | pointer |
| Member names | pointer |
| Footer links | pointer |
| Email links | pointer |
| Images | default or zoom-in |

## Performance Considerations
- Hover events fire frequently, debounce if needed
- Use CSS transitions for smooth state changes
- Avoid heavy JS computations on hover
- Video switching uses requestAnimationFrame

## Related Behaviours
- [member-hover-video-switch.md](../behaviour/member-hover-video-switch.md)
- [sticky-header.md](../behaviour/sticky-header.md)

## Responsive Notes
- **Mobile (375px):** N/A - touch devices don't support hover
- **Tablet (768px):** Limited hover support with trackpad/mouse
- **Desktop (1440px):** Full hover support - primary enhancement for desktop UX. Enables rich interactive experiences like immediate video switching on member names.
