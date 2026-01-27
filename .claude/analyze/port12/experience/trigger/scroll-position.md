# Scroll Position Trigger

## Overview
Primary trigger mechanism used throughout port12.dk to control animations, video playback, and section transitions based on scroll position.

## Implementation Pattern

### JavaScript Approach
```javascript
// Scroll position tracking
let scrollY = window.scrollY;
let ticking = false;

window.addEventListener('scroll', () => {
  scrollY = window.scrollY;

  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateOnScroll(scrollY);
      ticking = false;
    });
    ticking = true;
  }
});

function updateOnScroll(scrollY) {
  // Calculate which member is active based on scroll
  const membersSection = document.querySelector('.members-section');
  const rect = membersSection.getBoundingClientRect();
  const sectionTop = scrollY + rect.top;
  const sectionHeight = rect.height;
  const memberCount = 6;

  if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
    const progress = (scrollY - sectionTop) / sectionHeight;
    const activeMember = Math.floor(progress * memberCount);
    setActiveMember(activeMember);
  }
}
```

### Intersection Observer Approach
```javascript
// For section reveal animations
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  },
  {
    threshold: 0.1, // Trigger when 10% visible
    rootMargin: '0px',
  }
);

document.querySelectorAll('.animate-on-scroll').forEach((el) => {
  observer.observe(el);
});
```

## Usage in Port12

### 1. Member Video Carousel
- **Trigger Zone**: Members section (scroll range)
- **Calculation**: `scrollProgress = (scrollY - sectionTop) / sectionHeight`
- **Action**: Toggle video opacity based on which "segment" user is in

### 2. Hero to About Transition
- **Trigger Point**: When hero section leaves viewport
- **Threshold**: `scrollY > window.innerHeight`
- **Action**: Show sticky header, change background context

### 3. Section Reveals
- **Trigger**: Intersection Observer with threshold 0.1
- **Action**: Add `.in-view` class for CSS animations

## Performance Considerations

### Throttling
```javascript
// Use requestAnimationFrame for smooth updates
function throttledScroll(callback) {
  let ticking = false;
  return function() {
    if (!ticking) {
      requestAnimationFrame(() => {
        callback();
        ticking = false;
      });
      ticking = true;
    }
  };
}
```

### Passive Listeners
```javascript
// Use passive listeners for better scroll performance
window.addEventListener('scroll', handleScroll, { passive: true });
```

## Mobile Considerations
- Touch scrolling can be faster/more variable than mouse
- Use `scroll-behavior: smooth` sparingly on mobile
- Consider momentum scrolling behavior
- Test with various scroll speeds

## Related Behaviours
- [member-video-carousel.md](../behaviour/member-video-carousel.md)
- [sticky-header.md](../behaviour/sticky-header.md)
- [about-section-reveal.md](../behaviour/about-section-reveal.md)

## Responsive Notes
- **Mobile (375px):** Touch scrolling, momentum-based, faster scroll speeds possible
- **Tablet (768px):** Can use trackpad/mouse scrolling with finer control, scroll-triggered animations work identically. Larger viewport means sections occupy more scroll distance.
- **Desktop (1440px):** Mouse wheel scrolling with precise control. Scroll-triggered animations work identically. For member carousel, scroll position is used as fallback when not hovering - hover interaction takes precedence on desktop. Smooth scrolling via anchor links available in navigation.
