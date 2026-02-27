# HeroStatement — Visual Anatomy

## Layout
Statement hero with a 2-column CSS Grid: large uppercase heading top-left, image collage top-right, body text columns below-left, and an ArrowLink CTA bottom-right. Auto-height section with generous padding.

```
┌─────────────────────────────────────────────────┐
│  Grid (columns: 2, gap: 48)                     │
│                                                 │
│  ┌─────────────────┐  ┌──────────────────────┐  │
│  │  ABOUT           │  │  Image (collage)     │  │
│  │  CCCCCCC         │  │  Image (collage)     │  │
│  │  (display,       │  │  (Flex, column,      │  │
│  │   headingColor)  │  │   align: flex-end)   │  │
│  └─────────────────┘  └──────────────────────┘  │
│                                                 │
│  ┌─────────────────┐  ┌──────────────────────┐  │
│  │  Body text left  │  │                      │  │
│  │  Body text right │  │  ArrowLink (email)   │  │
│  │  (Grid 2col or   │  │  variant: 'slide'    │  │
│  │   Stack 1col)    │  │  (Flex, justify:end) │  │
│  └─────────────────┘  └──────────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Widget Composition
| Element | Widget | Key Props |
|---------|--------|-----------|
| Outer grid | Grid | `columns: 2`, `gap: 48`, className `section-hero-statement__grid` |
| Heading | Text | `as: 'display'`, className `section-hero-statement__heading`, `color: headingColor` |
| Collage wrapper | Flex | `direction: 'column'`, `gap: 16`, className `section-hero-statement__collage` |
| Collage images (repeated) | Image | `src`, `alt`, `mixBlendMode: blendMode`, className `section-hero-statement__collage-img` |
| Body container | Grid (2-col) or Stack (1-col) | `columns: 2, gap: 32` or `gap: 16`, className `section-hero-statement__body` |
| Body text left | Text | `as: 'body'` |
| Body text right (if 2-col) | Text | `as: 'body'` |
| CTA wrapper | Flex | `direction: 'column'`, `justify: 'end'`, `align: 'start'` |
| CTA link | ArrowLink | `email`, `label`, `variant: 'slide'` |

## Typography (factory-hardcoded scales)
| Element | Scale | Weight | Extras |
|---------|-------|--------|--------|
| Heading | `display` | (inherited) | CSS: `text-transform: uppercase`, `line-height: 0.88`, `letter-spacing: 0.1em`, `font-family: var(--font-heading)` |
| Body text | `body` | (inherited) | No extra styling |

## Default Styles (from types.ts)
No `DEFAULT_*_STYLES` object. Heading styling is entirely in `styles.css` via className.

## Settings (CMS-configurable via meta.ts)
| Setting | Type | Default | Tier | Visual Effect |
|---------|------|---------|------|---------------|
| `bodyColumns` | select | `'2'` | Essential | `'1'` = single Stack column, `'2'` = two-column Grid for body text |
| `headingColor` | color (via `colorSetting()`) | `'var(--color-accent)'` | Essential | Inline `color` on the heading Text widget |
| `blendMode` | select | `'screen'` | Style | `mixBlendMode` on collage images: `screen`, `multiply`, or `normal` |

## Content Fields (from content.ts)
| Field | Type | Required | Sample |
|-------|------|----------|--------|
| `heading` | text | Yes | `'ABOUT CCCCCCC'` |
| `bodyTextLeft` | textarea | Yes | `'Founded in 2018, we are a collective...'` |
| `bodyTextRight` | textarea | No | `'Our work spans feature films, series...'` |
| `collageImages` | collection | No | `[{ src: '/images/about/studio-1.webp', alt: 'Studio workspace' }, ...]` |
| `collageImages[].src` | image | Yes | — |
| `collageImages[].alt` | text | Yes | — |
| `ctaLabel` | text | No | `'Say hello'` |
| `ctaEmail` | text | Yes | `'hello@studio.com'` |

## Style Override Points
Section-level `style` prop is passed through directly (`p.style`).

No widget-level `styles` prop — heading color is controlled via the `headingColor` setting, and other styling is CSS-class-driven.

## Theme Variable Mapping
| Visual Property | Hardcoded Default | Theme Variable |
|-----------------|-------------------|----------------|
| Heading color | `var(--color-accent)` | `var(--color-accent)` via `colorSetting` default |
| Heading font | — | `var(--font-heading)` via CSS class |
| Collage image border-radius | `4px` fallback | `var(--radius-sm)` |
| Body section margin-top | `2rem` fallback | `var(--spacing-lg)` |

## CSS Details (styles.css)
- `.section-hero-statement__heading`: `font-family: var(--font-heading)`, `text-transform: uppercase`, `line-height: 0.88`, `letter-spacing: 0.1em`
- `.section-hero-statement__grid`: `align-items: start`
- `.section-hero-statement__collage`: `align-items: flex-end`
- `.section-hero-statement__collage-img`: `max-width: 100%`, `border-radius: var(--radius-sm, 4px)`
- `.section-hero-statement__body`: `margin-top: var(--spacing-lg, 2rem)`

## Gotchas
- Uses the **ArrowLink** interactive widget (not a standard Link/Button) with `variant: 'slide'` and `email` prop — this widget must be registered globally.
- `colorMode` defaults to `'light'` (not dark).
- `sectionHeight` defaults to `'auto'` (content-driven height, not viewport-locked).
- `constrained` defaults to `true` (content respects `--site-max-width`).
- Default padding: `paddingTop: 120`, `paddingBottom: 80`.
- Collage images support both static arrays and binding expressions via `isBindingExpression()`.
- The body container dynamically switches between `Grid` (2 columns) and `Stack` (1 column) based on the `bodyColumns` setting.
- `blendMode` is applied as `mixBlendMode` inline style on each collage image.
