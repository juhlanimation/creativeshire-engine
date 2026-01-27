# Analysis: port12

**Source:** https://www.port12.dk
**Type:** Single-page application (Danish coworking space)
**Date:** 2026-01-27

## Pages

| Page | GIFs |
|------|------|
| home | home-desktop.gif |

## Site Overview

PORT12 is a Danish coworking space ("Kontorfællesskab") in Ry. The site is a single-page application with a distinctive visual identity featuring:
- Video backgrounds throughout
- Text knockout/mask effects using `mix-blend-mode: difference`
- Scroll-triggered interactions
- Hand-drawn illustrations

## Components Found

### Site Chrome (site/chrome/)
| Component | Purpose |
|-----------|---------|
| sticky-header.md | Scroll-triggered minimal header with logo |
| navigation.md | Anchor link navigation (hidden until scroll) |
| footer.md | Dark footer with contact info |

### Content (content/)

**Sections (content/section/)**
| Component | Purpose |
|-----------|---------|
| hero.md | Full-viewport hero with masked logo and slideshow |
| about.md | Introduction text and staggered photo gallery |
| team.md | Interactive team member showcase |
| pricing.md | FLEX and ALL-IN pricing tiers |
| contact.md | Contact CTA section |

**Widgets (content/widget/)**
| Component | Purpose |
|-----------|---------|
| scroll-indicator.md | "(SCROLL)" text prompt at hero bottom |
| scroll-progress-bar.md | Vertical scroll position indicator |
| logo-text.md | PORT12 branding with image mask effect |
| pricing-card.md | Pricing tier card with illustration |
| feature-list-item.md | Feature with status icon (check/minus/plus) |
| team-member-name.md | Interactive team member name link |
| text-block-bracketed.md | Decorated text block with corner brackets |
| illustrated-header.md | Hand-drawn illustrations for sections |

**Layout Widgets (content/layout-widget/)**
| Component | Purpose |
|-----------|---------|
| staggered-gallery.md | Asymmetric alternating image gallery |

### Experience (experience/)

**Behaviours (experience/behaviour/)**
| Component | Purpose |
|-----------|---------|
| hero-video-background.md | Full-screen video background |
| hero-text-blend-mode.md | PORT12 logo knockout effect |
| scroll-indicator.md | Scroll prompt animation |
| member-video-carousel.md | Scroll/hover-triggered video switching |
| member-hover-video-switch.md | Desktop hover video interaction |
| sticky-header.md | Header reveal on scroll |
| about-section-reveal.md | Section reveal animation |

**Triggers (experience/trigger/)**
| Component | Purpose |
|-----------|---------|
| scroll-position.md | Scroll-based triggers |
| tap-interaction.md | Mobile tap interactions |
| hover-interaction.md | Desktop hover interactions |

## Responsive Summary

| Component | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| hero | visible | visible | visible |
| sticky-header | visible (on scroll) | visible (on scroll) | visible (on scroll) |
| navigation | hidden | hidden | visible |
| team section | scroll-triggered | scroll-triggered | hover-triggered |
| staggered-gallery | 1 column | 1 column | 1 column (intentional) |
| pricing-cards | stacked | stacked | stacked (intentional) |

## Key Design Patterns

### 1. mix-blend-mode Knockout
Primary visual technique. Text uses `mix-blend-mode: difference` on a parent container to create a knockout effect where videos/images show through the text.

### 2. Scroll-to-Hover Progression
- **Mobile/Tablet:** Team member videos switch based on scroll position
- **Desktop:** Team member videos switch on hover (with scroll as fallback)

### 3. Single-Column Throughout
Intentional design choice - site maintains staggered single-column layout at all breakpoints, even desktop.

### 4. Hand-Drawn Illustrations
Sketch-style artwork used for pricing section headers and decorative elements, adding warmth to the professional space.

### 5. No Visible Navigation Until Scroll
Navigation links hidden in hero, appear only in sticky header after scrolling past hero section.

## Technical Patterns

- **Videos:** WebM format, lazy-loaded, muted autoplay
- **Animations:** Pure CSS transitions (no GSAP/Framer Motion observed)
- **Viewport:** Uses `100dvh` for proper mobile viewport handling
- **Typography:** Uses `vw` units for fluid text scaling
- **Pointer Events:** `pointer-events: none` on video overlays to allow scrolling

## Build Order Recommendation

1. **Site Chrome** - Global header/footer
2. **Layout Widgets** - Staggered gallery pattern
3. **Widgets** - Logo, pricing card, team member name, etc.
4. **Sections** - Hero, about, team, pricing, contact
5. **Behaviours** - Video carousel, text blend mode, scroll triggers
6. **Triggers** - Scroll position, hover interaction

## Assets

| File | Description |
|------|-------------|
| assets/home-desktop.gif | Desktop interaction recording (5.9MB, 31 frames) |

## Notes for Builders

1. **mix-blend-mode: difference** is the core visual technique - ensure proper stacking context
2. Team section has different interaction model on desktop (hover) vs mobile (scroll)
3. Single-column layout is intentional - don't "fix" it with multi-column at desktop
4. Videos should preload but only play when visible
5. All layout values documented are **observed defaults** - expose as props

## Next Steps

```
/plan port12
```
