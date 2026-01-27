# Bojuhl.com Experience/Behaviour Analysis - Mobile

**Breakpoint:** 375 x 812 (Mobile)
**Date:** 2026-01-27
**GIF:** `../assets/home-mobile.gif`

## Overview

Bo Juhl's portfolio site features a single-page layout with scroll-driven animations in the hero section, a video modal for project showcases, and a clean footer with contact information.

## Behaviours Identified

### 1. ScrollBackgroundSlideshow
**File:** `behaviour/scroll-background-slideshow.md`

The hero section features a dynamic background that cycles through portfolio images based on scroll position:
- Light burst (initial)
- Anime creature scene
- Orange action scene
- Clash Royale king
- Nature/wind chimes scene
- Dark transition to About

**Key insight:** Background images are portfolio pieces, creating an immediate visual showcase without requiring user to scroll to projects section.

### 2. HeroTextColorTransition
**File:** `behaviour/hero-text-color-transition.md`

Hero text dynamically changes color to maintain contrast and visual harmony with changing backgrounds:
- Purple on light backgrounds
- Dark with white stroke on colorful backgrounds
- Cyan on orange backgrounds
- White on dark backgrounds

**Key insight:** Color changes appear synchronized with background transitions using CSS custom properties.

### 3. VideoModal
**File:** `behaviour/video-modal.md`

Tapping a project card image opens a fullscreen video modal:
- Black overlay background
- Centered video player with controls
- X close button (top-left)
- Progress bar and volume control
- Auto-plays on open

**Key insight:** Modal provides immersive video viewing experience without leaving the page.

### 4. ProjectCardHover
**File:** `behaviour/project-card-hover.md`

Project cards reveal a "WATCH" label when tapped/hovered:
- Magenta/pink "WATCH" text
- Semi-transparent dark overlay
- Indicates video content available

**Key insight:** Clear affordance that card is interactive and will play video.

### 5. ScrollIndicator
**File:** `behaviour/scroll-indicator.md`

"(SCROLL)" text prompt at bottom of hero section:
- Encourages user to scroll down
- Color matches hero text
- Disappears as user scrolls

**Key insight:** Simple UX hint for single-page portfolio layout.

## Page Structure

```
HERO (#hero)
  - Scroll-driven background slideshow
  - Animated text with color transitions
  - "(SCROLL)" indicator

ABOUT (#about)
  - Bo Juhl photo
  - Bio text with links
  - Dark background

PROJECTS (#projects)
  - Project cards with video thumbnails
  - Tap to open video modal
  - Client/Studio/Year/Role metadata

FOOTER
  - Navigation links (Home, About, Projects)
  - Contact info (email, LinkedIn)
  - Studio info (Crossroad Studio)
  - Copyright
```

## Technical Implementation Notes

### Animation Approach
- Scroll-driven: Background and text colors change based on scroll position
- No GSAP or complex animation library visible (could be CSS scroll-snap or simple JS)
- Video modal likely uses native HTML5 video or Vimeo embed

### Performance Considerations
- Multiple large background images need lazy loading
- Video modal should only load video when opened
- Scroll event throttling recommended for smooth performance

### Mobile-Specific Observations
- Touch targets appropriately sized
- Scroll behavior smooth but not snap-locked
- Modal covers full viewport
- No hamburger menu (single-page, no navigation needed)

## Responsive Behaviour Differences
This analysis covers mobile (375x812). Expected differences on larger breakpoints:
- Hero text positioning may change
- Project cards may display in grid
- Footer may have horizontal layout
- Hover states vs tap states
