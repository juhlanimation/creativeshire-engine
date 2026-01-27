# Port12 Experience Analysis

## Breakpoints Analyzed
- **Mobile**: 375x812 (completed)
- **Tablet**: 768x1024 (completed)
- **Desktop**: 1440x900 (completed)

## Site Overview
- **URL**: https://www.port12.dk
- **Type**: Single-page marketing site for a Danish coworking space
- **Tech Stack**: Likely Next.js/React with Tailwind CSS
- **Animation Libraries**: Native CSS/JS (no GSAP or Framer Motion detected)

## Key Behaviours Documented

### 1. Hero Video Background
**File**: `behaviour/hero-video-background.md`
- Full-screen video background (showreel.webm)
- Fixed position, plays automatically
- Serves as visual base for text blend effect

### 2. Hero Text Blend Mode
**File**: `behaviour/hero-text-blend-mode.md`
- PORT12 logo with `mix-blend-mode: difference`
- Creates knockout/inverse effect with video
- Tagline "DROM DEL SKAB" below
- Fixed position, centered

### 3. Scroll Indicator
**File**: `behaviour/scroll-indicator.md`
- "(SCROLL)" text on desktop
- Arrow icon on touch devices
- Fixed position at bottom of hero

### 4. Member Video Carousel
**File**: `behaviour/member-video-carousel.md`
- 6 member showreel videos
- Scroll-triggered opacity transitions
- Member names with blend mode effect
- Tappable links to personal websites

### 5. Sticky Header
**File**: `behaviour/sticky-header.md`
- Minimal logo-only header on mobile
- Navigation hidden (no hamburger)
- Uses mix-blend-mode for contrast

### 6. About Section Reveal
**File**: `behaviour/about-section-reveal.md`
- Corner bracket decorations
- Photo gallery with tilted images
- Light background contrast from hero

## Triggers Documented

### Scroll Position
**File**: `trigger/scroll-position.md`
- Primary trigger for video carousel
- Section reveal animations
- Header visibility

### Tap Interaction
**File**: `trigger/tap-interaction.md`
- Member name links
- Email/phone links
- Footer navigation

### Hover Interaction (Desktop)
**File**: `trigger/hover-interaction.md`
- Member name video switching
- Navigation link hover states
- Footer link hover effects
- Desktop-only enhancement

## Technical Patterns

### CSS Techniques
1. **mix-blend-mode: difference** - Creates text knockout effect
2. **position: fixed** - Video backgrounds and headers
3. **transition: opacity** - Smooth video crossfades
4. **touch: utilities** - Touch-specific styling

### Video Implementation
```
Hero: /video/showreel.webm (autoplay, muted, loop)
Members:
  - RS_Port12_Showreel_2.webm
  - MARIAT.webm
  - NL_Port12_Showreel_v2.webm
  - TorBirkTrads2.webm
  - BJ_Port12_Showreel.webm
  - MK_Ocean.webm
```

### Mobile-Specific Observations (375px)
1. No hamburger menu - relies on footer navigation
2. Touch-specific scroll indicator (arrow vs text)
3. Large tap targets on member names
4. Videos play inline (no fullscreen takeover)
5. Uses dvh/svh for proper viewport handling

### Tablet-Specific Observations (768px)
1. Navigation still hidden at exactly 768px (breakpoint may be slightly higher)
2. Scroll indicator shows "(SCROLL)" text instead of arrow (non-touch device detection)
3. Hover states available for member name links (cursor-based interaction)
4. Member name typography scales up with viewport (12vw = ~92px at tablet)
5. Photo gallery displays in masonry/staggered layout with larger image sizes
6. Video carousel behaves identically - scroll-triggered video switching
7. Mix-blend-mode effects work the same across breakpoints
8. Sticky header PORT12 logo functions identically

### Desktop-Specific Observations (1440px)
1. Full navigation visible in top-right: Om, Medlemmer, Medlemskab, info@port12.dk
2. Navigation uses mix-blend-mode: difference for dynamic contrast
3. **HOVER-TRIGGERED VIDEO SWITCHING** - key desktop enhancement:
   - Hovering over member name immediately activates their video
   - Active member name turns copper/bronze color
   - Scroll-based switching still works as fallback
4. Member name typography scales significantly (~120-150px estimated)
5. All hover states active: navigation, member names, footer links
6. Smooth scroll to anchor sections via navigation links
7. Photo gallery may have subtle scale/shadow hover effects on images
8. Higher video quality visible due to larger viewport

## Animation Timing Summary

| Animation | Duration | Easing |
|-----------|----------|--------|
| Video opacity transition | 500ms | ease |
| Section reveal | ~600ms | ease |
| Header transitions | implicit | ease |

## Recommendations for Implementation

### Must Have
- mix-blend-mode support (well supported)
- Video autoplay with muted attribute
- Intersection Observer for section reveals
- Scroll position tracking with rAF

### Nice to Have
- Smooth scroll polyfill for older browsers
- Lazy loading for member videos
- Preload hints for initial video

### Mobile Considerations
- Test video playback on iOS Safari
- Ensure touch scrolling isn't blocked
- Verify viewport units work correctly
- Consider adding mobile navigation

## Responsive Differences Summary

| Behaviour | Mobile (375px) | Tablet (768px) | Desktop (1440px) |
|-----------|---------------|----------------|------------------|
| Scroll Indicator | Arrow icon (touch) | "(SCROLL)" text | "(SCROLL)" text |
| Navigation | Hidden entirely | Still hidden at 768px | Full nav visible (Om, Medlemmer, etc.) |
| Member Name Size | ~45px (12vw) | ~92px (12vw) | ~120-150px |
| Video Carousel | Scroll-triggered | Scroll-triggered | **HOVER-triggered** (scroll fallback) |
| Hover States | None (touch) | Available (limited) | Full hover support |
| Mix-blend-mode | Active | Active | Active (identical) |
| Photo Gallery | Stacked vertical | Masonry/staggered | Multi-column masonry |
| Sticky Header | Logo only | Logo only | Logo + full nav |
| Active Member Color | White | White | Copper/bronze |

## Files Created
```
.claude/analyze/port12/
  experience/
    SUMMARY.md (this file)
    behaviour/
      hero-video-background.md (+ tablet + desktop notes)
      hero-text-blend-mode.md (+ tablet + desktop notes)
      scroll-indicator.md (+ tablet + desktop notes)
      member-video-carousel.md (+ tablet + desktop notes)
      member-hover-video-switch.md (NEW - desktop-only behaviour)
      sticky-header.md (+ tablet + desktop notes)
      about-section-reveal.md (+ tablet + desktop notes)
    trigger/
      scroll-position.md (+ tablet + desktop notes)
      tap-interaction.md (+ tablet + desktop notes)
      hover-interaction.md (NEW - desktop-only trigger)
  assets/
    home-desktop.gif (31 frames, 5.9MB)
```
