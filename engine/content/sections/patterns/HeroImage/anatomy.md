# HeroImage — Visual Anatomy

## Layout
Full-viewport hero section with a single background image, an optional dark overlay, optional parallax on scroll, and a CSS-drawn scroll arrow indicator at the bottom center.

```
┌──────────────────────────────────────────────┐
│  Image (background, absolute, object-cover)  │
│         height: 120% for parallax headroom   │
│         transform: translateY(scroll-based)  │
│                                              │
│  ::after overlay ──────────────────────────  │
│  (rgba overlay via --hero-overlay-color)     │
│                                              │
│                                              │
│                                              │
│                                              │
│                    │                         │
│                    │  scroll arrow (Box)     │
│                    ▼  CSS ::before + ::after │
└──────────────────────────────────────────────┘
```

## Widget Composition
| Element | Widget | Key Props |
|---------|--------|-----------|
| Background image | Image | `src`, `alt`, className `section-hero-image__bg` |
| Scroll arrow (optional) | Box | Empty, className `section-hero-image__scroll-arrow`, CSS-drawn via `::before`/`::after` |

## Typography (factory-hardcoded scales)
No text widgets in this section. The hero is image-only.

## Default Styles (from types.ts)
No `DEFAULT_*_STYLES` object. This section has no text styling — all visual behavior is in CSS.

## Settings (CMS-configurable via meta.ts)
| Setting | Type | Default | Tier | Visual Effect |
|---------|------|---------|------|---------------|
| `showScrollArrow` | toggle | `true` | Essential | Shows/hides the CSS-drawn scroll arrow at bottom center |
| `overlayOpacity` | number | `0.1` | Style | Opacity of the dark overlay (`rgba(0,0,0, value)`), range 0-1, step 0.05 |
| `parallaxRate` | number | `0.3` | Advanced | Parallax movement multiplier (0-0.5), consumed by CSS `transform` |

## Content Fields (from content.ts)
| Field | Type | Required | Sample |
|-------|------|----------|--------|
| `imageSrc` | image | Yes | `'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1440&h=964&fit=crop'` |
| `imageAlt` | text | Yes | `'Hero background'` |

## Style Override Points
Section-level `style` prop merges over factory CSS custom properties:
- `--parallax-rate` (from `parallaxRate` setting)
- `--hero-overlay-color` (from `overlayOpacity` setting, rendered as `rgba(0, 0, 0, {value})`)

No widget-level `styles` prop — all styling is CSS-driven via `styles.css`.

## Theme Variable Mapping
| Visual Property | Hardcoded Default | Theme Variable |
|-----------------|-------------------|----------------|
| Overlay color | `rgba(0,0,0,0.1)` | `--hero-overlay-color` (set by factory from `overlayOpacity`) |
| Parallax rate | `0.3` | `--parallax-rate` (set by factory, consumed by CSS transform) |
| Scroll arrow color | `currentColor` | Inherits from section text color |
| Scroll arrow bottom spacing | `2rem` fallback | `var(--spacing-xl)` |
| Scroll arrow bounce timing | `2s ease-in-out infinite` | CSS keyframe `hero-image-bounce` |

## CSS Details (styles.css)
- **Parallax transform**: `.section-hero-image__bg` uses `translateY(calc(var(--scroll-progress, 0) * var(--parallax-rate, 0.3) * -20cqh))` — requires a `scroll/progress` behaviour to set `--scroll-progress`.
- **Overlay**: `::after` pseudo-element on `.section-hero-image` with `background: var(--hero-overlay-color)`.
- **Scroll arrow**: CSS-only — vertical line via `::before` (1px wide, full height), chevron tip via `::after` (rotated border corner). Bounces with `hero-image-bounce` keyframe.
- **Reduced motion**: `@media (prefers-reduced-motion: reduce)` disables parallax transform and bounce animation.

## Gotchas
- Image is `height: 120%` (not 100%) to provide headroom for the parallax vertical shift — without this, scrolling down would reveal empty space below the image.
- `colorMode` defaults to `'dark'` (not inherited), since the section assumes a dark photographic background.
- `sectionHeight` defaults to `'viewport-fixed'`.
- `constrained` is hardcoded to `false` (full bleed, ignoring the prop).
- The parallax effect requires a `scroll/progress` behaviour to be wired in the preset's `sectionBehaviours` to set `--scroll-progress` on the section. Without it, `var(--scroll-progress, 0)` stays at 0 and no parallax occurs.
- `will-change: transform` is set on the background image for GPU compositing.
- Uses `cqh` units in the parallax calc (`-20cqh`), not viewport units.
