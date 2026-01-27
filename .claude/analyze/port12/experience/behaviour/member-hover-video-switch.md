# Member Hover Video Switch

## Overview
Desktop-only enhancement to the member video carousel. On desktop, hovering over a member name immediately switches to display that member's showreel video, providing instant feedback compared to the scroll-based switching on mobile/tablet.

## Breakpoint: Desktop (1440x900)

### Implementation
- **Trigger**: Mouse hover (`:hover` or `mouseenter` event)
- **Target**: Member name text elements
- **Action**: Switch active video to hovered member's showreel
- **Visual Feedback**: Active member name changes to copper/bronze color, inactive names are gray

### Structure
```html
<!-- Member names with hover handlers -->
<a href="https://member-site.com"
   @mouseenter="setActiveMember(index)"
   class="member-name">
  <h2>Member Name</h2>
</a>
```

### CSS/JS Implementation
```css
/* Member name hover state */
.member-name {
  color: rgba(255, 255, 255, 0.4); /* Inactive: gray */
  transition: color 300ms ease;
  cursor: pointer;
}

.member-name:hover,
.member-name.active {
  color: #b87333; /* Copper/bronze for active */
}
```

```javascript
// Hover-triggered video switching
memberNames.forEach((name, index) => {
  name.addEventListener('mouseenter', () => {
    setActiveMember(index);
  });
});

function setActiveMember(index) {
  videos.forEach((video, i) => {
    if (i === index) {
      video.style.opacity = 1;
      video.play();
    } else {
      video.style.opacity = 0;
      video.pause();
    }
  });
}
```

### Animation Timing
| Property | Value |
|----------|-------|
| Video opacity transition | 300-500ms |
| Text color transition | 300ms |
| Easing | ease |

### Interaction Flow
1. User hovers over a member name
2. Previous active video fades out (opacity 0)
3. Hovered member's video fades in (opacity 1)
4. Text color changes to copper/bronze
5. Video begins playing

### Fallback Behavior
- When mouse leaves members section, reverts to scroll-position-based switching
- If no hover, scroll position determines active member
- Ensures seamless experience when scrolling without hovering

### Visual States
| State | Video | Text Color |
|-------|-------|------------|
| Inactive | opacity: 0 | Gray (rgba 0.4) |
| Hover/Active | opacity: 1 | Copper (#b87333) |
| Scroll-active (no hover) | opacity: 1 | White |

### Performance
- Only one video plays at a time
- Videos pause when not active
- Uses GPU-accelerated opacity transitions
- `pointer-events: none` on video container prevents interference

## Responsive Notes
- **Mobile (375px):** N/A - hover not available on touch devices
- **Tablet (768px):** N/A - scroll-based switching only (may work with trackpad but not primary interaction)
- **Desktop (1440px):** Primary interaction method - hover immediately triggers video switch with copper text highlight
