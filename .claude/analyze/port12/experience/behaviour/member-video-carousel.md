# Member Video Carousel

## Overview
Scroll-triggered video carousel in the Members section. As users scroll through member names, each member's showreel video becomes visible, creating a dynamic showcase of the coworking space members' work.

## Breakpoint: Mobile (375x812)

### Implementation
- **Container**: Fixed position overlay at z-index 40
- **Videos**: 6 individual member videos, opacity-toggled based on scroll position
- **Trigger**: Scroll position within members section
- **Text**: Member names with mix-blend-mode effect

### Structure
```html
<!-- Fixed video container -->
<div class="fixed inset-x-0 top-0 z-40 h-dvh pointer-events-none transition-opacity duration-500">
  <!-- Video for each member -->
  <video class="absolute inset-0 w-full h-full object-cover" style="opacity: 1">
    <source src="/video/RS_Port12_Showreel.webm" type="video/webm">
  </video>
  <video class="absolute inset-0 w-full h-full object-cover" style="opacity: 0">
    <source src="/video/MARIAT.webm" type="video/webm">
  </video>
  <!-- ... more member videos ... -->
</div>

<!-- Members section with names -->
<section class="relative overflow-hidden my-16">
  <div class="flex flex-col gap-4">
    <span>Vi er</span>
    <h2>Rune Svenningsen</h2>
    <h2>Maria Tranberg</h2>
    <h2>Nicolaj Larsson</h2>
    <h2>Tor Birk Trads</h2>
    <h2>Bo Juhl</h2>
    <h2>Maria Kjaer</h2>
  </div>
</section>
```

### Member Videos
| Member | Video Source |
|--------|--------------|
| Rune Svenningsen | /video/RS_Port12_Showreel_2.webm |
| Maria Tranberg | /video/MARIAT.webm |
| Nicolaj Larsson | /video/NL_Port12_Showreel_v2.webm |
| Tor Birk Trads | /video/TorBirkTrads2.webm |
| Bo Juhl | /video/BJ_Port12_Showreel.webm |
| Maria Kjaer | /video/MK_Ocean.webm |

### CSS Implementation
```css
/* Video container */
.member-video-container {
  position: fixed;
  inset: 0;
  z-index: 40;
  height: 100dvh;
  pointer-events: none;
  transition: opacity 500ms;
}

/* Individual videos */
.member-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 500ms ease;
}

/* Active state */
.member-video.active {
  opacity: 1;
}

.member-video.inactive {
  opacity: 0;
}
```

### Scroll Behavior
1. As user scrolls into members section, first member video appears
2. Scroll position maps to which member is "active"
3. Active video has `opacity: 1`, others have `opacity: 0`
4. Video starts playing when it becomes active
5. Video pauses when it becomes inactive

### Animation Timing
| Property | Value |
|----------|-------|
| opacity transition | 500ms |
| easing | ease (default) |
| trigger | scroll position |

### Text Styling
Member names use the same mix-blend-mode technique as the hero:
- Active member name appears bold/highlighted
- Inactive names appear grayed out (lower opacity)
- Video shows through text via blend mode

### Typography (Mobile)
| Property | Value |
|----------|-------|
| font-size | 12vw (responsive to viewport) |
| font-family | var(--font-heading) |
| text-transform | uppercase |
| color | white (with blend mode) |

### Trigger
- **Type**: Scroll position
- **Start**: When members section enters viewport
- **Calculation**: Divides section height by number of members
- **Active member**: Based on scroll progress through section

### Interactivity
- **Tap on name**: Opens member's personal website in new tab
- Each member name is a link (`<a href="...">`)

### Mobile Considerations
- Uses `100dvh` for proper mobile viewport
- `pointer-events: none` on video container allows touch scrolling
- Video plays inline (no fullscreen takeover)
- Touch-friendly tap targets on member names

### Performance
- Videos are lazy-loaded or preloaded strategically
- Only active video plays at any time
- Uses efficient opacity transitions (GPU accelerated)

### Related Behaviours
- [hero-text-blend-mode.md](./hero-text-blend-mode.md) - Same blend technique used

## Responsive Notes
- **Mobile (375px):** Font-size 12vw (~45px), tap on names opens external links, scroll-position triggers video switching
- **Tablet (768px):** Font-size 12vw (~92px), larger text creates more dramatic blend effect with videos. Same scroll-triggered video switching behavior. Video carousel occupies full viewport height.
- **Desktop (1440px):** HOVER-TRIGGERED video switching - hovering over member name immediately activates their video. Active member name appears in copper/bronze color, inactive names are gray. Scroll-position also works but hover takes precedence. Font-size scales up (~120-150px estimated). Cursor changes to pointer on hover. This is a key desktop-only enhancement over mobile/tablet's scroll-only behavior.
