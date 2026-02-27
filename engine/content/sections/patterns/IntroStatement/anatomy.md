# IntroStatement — Visual Anatomy

## Layout
Split-layout section with a large statement heading on the left (~40%) and body text on the right (~60%), plus an optional infinite-scroll logo marquee below. Auto-height section with dark color mode default.

```
┌──────────────────────────────────────────────────┐
│  Split (ratio: 2:3, gap: 64)                     │
│                                                  │
│  ┌──────────────────┐  ┌──────────────────────┐  │
│  │  WE CREATE       │  │  Flex (column,       │  │
│  │  WORLDS THAT     │  │    justify: start,   │  │
│  │  MOVE PEOPLE     │  │    paddingTop: 120px) │  │
│  │                  │  │                      │  │
│  │  (h1, clamp      │  │  Body text (body)    │  │
│  │   80px-160px,    │  │  max-width: 437px    │  │
│  │   11.1cqw)       │  │                      │  │
│  └──────────────────┘  └──────────────────────┘  │
│                                                  │
│  ═══ LOGO ═══ LOGO ═══ LOGO ═══ LOGO ═══ LOGO   │
│  (Marquee, duration: marqueeSpeed, gap: 64)      │
│  [optional, controlled by showMarquee]           │
│  [edge-fade mask when edgeFade is true]          │
└──────────────────────────────────────────────────┘
```

## Widget Composition
| Element | Widget | Key Props |
|---------|--------|-----------|
| Content split | Split | `ratio: '2:3'`, `gap: 64`, className `section-intro-statement__content` |
| Heading | Text | `as: 'h1'`, className `section-intro-statement__heading`, `fontSize: clamp(80px, 11.1cqw, 160px)` |
| Body wrapper | Flex | `direction: 'column'`, `justify: 'start'`, `align: 'start'`, `minHeight: '100%'`, `paddingTop: '120px'` |
| Body text | Text | `as: 'body'`, className `section-intro-statement__body` |
| Logo marquee (optional) | Marquee | `duration: marqueeSpeed`, `gap: 64`, className with optional `--edge-fade` modifier |
| Logo images (repeated) | Image | `src`, `alt`, `height: {logo.height ?? 32}px`, `width: 'auto'`, `opacity: 0.5` |

## Typography (factory-hardcoded scales)
| Element | Scale | Weight | Extras |
|---------|-------|--------|--------|
| Heading | `h1` | (inherited) | CSS: `font-family: var(--font-heading)`, `text-transform: uppercase`, `line-height: 0.875`, `letter-spacing: 0.02em`; inline: `fontSize: clamp(80px, 11.1cqw, 160px)` |
| Body text | `body` | (inherited) | CSS: `max-width: 437px` |

## Default Styles (from types.ts)
No `DEFAULT_*_STYLES` object. Heading styling is in CSS via className, body max-width is in CSS.

## Settings (CMS-configurable via meta.ts)
| Setting | Type | Default | Tier | Visual Effect |
|---------|------|---------|------|---------------|
| `showMarquee` | toggle | `true` | Essential | Shows/hides the logo marquee below the content |
| `marqueeSpeed` | number | `30` | Advanced | Marquee scroll duration in seconds (10-60, step 5) |
| `edgeFade` | toggle | `true` | Advanced | Applies a horizontal gradient mask to fade marquee edges |

## Content Fields (from content.ts)
| Field | Type | Required | Sample |
|-------|------|----------|--------|
| `heading` | text | Yes | `'WE CREATE WORLDS THAT MOVE PEOPLE'` |
| `bodyText` | textarea | Yes | `'An award-winning animation studio specializing in...'` |
| `clientLogos` | collection | No | `[{ src: '...', alt: 'Brand 1', name: 'Brand 1', height: 32 }, ...]` |
| `clientLogos[].src` | image | Yes | — |
| `clientLogos[].alt` | text | Yes | — |
| `clientLogos[].name` | text | No | — |
| `clientLogos[].height` | number | No | Per-logo display height in px (defaults to 32) |

## Style Override Points
Section-level `style` prop merges over `{ paddingBlock: 'var(--spacing-xl, 4rem)' }`.

No widget-level `styles` prop. Visual overrides are limited to:
- Section `style` (inline CSS on the section wrapper)
- `className` (additional CSS classes on the section)

## Theme Variable Mapping
| Visual Property | Hardcoded Default | Theme Variable |
|-----------------|-------------------|----------------|
| Heading font | — | `var(--font-heading)` via CSS class |
| Section block padding | `4rem` fallback | `var(--spacing-xl)` |
| Marquee top margin | `4rem` fallback | `var(--spacing-xl)` |

## CSS Details (styles.css)
- `.section-intro-statement__heading`: `font-family: var(--font-heading)`, `text-transform: uppercase`, `line-height: 0.875`, `letter-spacing: 0.02em`
- `.section-intro-statement__body`: `max-width: 437px`
- `.section-intro-statement__marquee`: `margin-top: var(--spacing-xl, 4rem)`, `position: relative`
- `.section-intro-statement__marquee--edge-fade`: Applies `mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)` for horizontal edge fade effect (with `-webkit-mask-image` fallback)

## Gotchas
- Heading uses `clamp(80px, 11.1cqw, 160px)` for font-size — responsive between 80px minimum and 160px maximum, scaling with container width.
- Body wrapper has a hardcoded `paddingTop: '120px'` to push body text down, aligning it roughly with the bottom portion of the heading.
- `colorMode` defaults to `'dark'`.
- `sectionHeight` defaults to `'auto'` with `paddingTop: 80` and `paddingBottom: 80`.
- `constrained` defaults to `true`.
- `unique: false` — multiple instances allowed per page.
- Logo images have `opacity: 0.5` hardcoded inline — they appear as subtle watermarks.
- The edge-fade mask uses both `mask-image` and `-webkit-mask-image` for cross-browser support.
- Split `ratio: '2:3'` gives the heading ~40% width and the body ~60% width.
- Logos support both static arrays and binding expressions via `isBindingExpression()`.
