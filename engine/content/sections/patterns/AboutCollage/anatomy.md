# AboutCollage — Visual Anatomy

## Layout
Text block with scattered photo images. Mobile: vertical stack with alternating left/right alignment and per-image aspect ratios. Desktop (1024px+): absolute-positioned scattered layout using container query units (`cqw`), creating a magazine-style collage.

```
MOBILE:
┌──────────────────────────────────────────────┐
│                                              │
│    ┌────────────────────────────┐            │
│    │  Text (body, justified,   │            │
│    │  max-width: 28rem)        │            │
│    └────────────────────────────┘            │
│                                              │
│                    ┌────────────────┐        │
│                    │ Image 1 (65%,  │  odd → │
│                    │  3:4 ratio)    │  right │
│                    └────────────────┘        │
│  ┌────────────────────┐                     │
│  │ Image 2 (70%,      │ even → left         │
│  │  3:2 ratio)        │                     │
│  └────────────────────┘                     │
│                    ┌────────────────┐        │
│                    │ Image 3 (60%, │  odd → │
│                    │  3:4 ratio)   │  right │
│                    └────────────────┘        │
│  ┌────────────────────┐                     │
│  │ Image 4 (65%,      │ even → left         │
│  │  3:2 ratio)        │                     │
│  └────────────────────┘                     │
│                                              │
└──────────────────────────────────────────────┘

DESKTOP (1024px+, absolute positioning):
┌──────────────────────────────────────────────┐
│              ┌──────────────┐                │
│  ┌─────────────────────┐    │ Image 1       │
│  │  Text (absolute,    │    │ (32x23cqw,    │
│  │  28cqw wide,        │    │  top-right)   │
│  │  left: 20cqw,       │    └──────────────┘│
│  │  top: 5cqw)         │                    │
│  └─────────────────────┘                    │
│                                              │
│  ┌───────────────┐                          │
│  │ Image 2       │    ┌─────────────┐       │
│  │ (28x18cqw,    │    │ Image 3     │       │
│  │  left: 8cqw)  │    │ (26x17cqw,  │       │
│  └───────────────┘    │  right area) │       │
│                       └─────────────┘       │
│     ┌─────────────┐                         │
│     │ Image 4     │                         │
│     │ (24x18cqw,  │                         │
│     │  bottom-left)│                         │
│     └─────────────┘                         │
│                                              │
└──────────────────────────────────────────────┘
min-height: 74cqw
```

## Widget Composition
| Element | Widget | Key Props |
|---------|--------|-----------|
| Text block | Text | `as: 'body'`, className `photo-collage__text` |
| Images (repeated) | Image | `src`, `alt`, className `photo-collage__image` |

## Typography (factory-hardcoded scales)
| Element | Scale | Weight | Extras |
|---------|-------|--------|--------|
| Text | `body` | (inherited) | CSS: `text-align: justify`, `line-height: 1.625`, `font-family: var(--font-paragraph)`, responsive font sizing |

## Default Styles (from types.ts)
No `DEFAULT_*_STYLES` object. All styling is CSS-driven via `styles.css` class names.

## Settings (CMS-configurable via meta.ts)
No settings. The `settings` object is empty (`{}`).

## Content Fields (from content.ts)
| Field | Type | Required | Sample |
|-------|------|----------|--------|
| `text` | textarea | Yes | `'Port12 er et kontorfællesskab...'` (multi-paragraph with `\n\n`) |
| `images` | collection | Yes | `[{ src: '/images/port-12/1.webp', alt: 'Port12 workspace' }, ...]` |
| `images[].src` | image | Yes | — |
| `images[].alt` | text | No | `''` default |

## Style Override Points
Section-level `style` prop is passed through directly.

Additional class-based overrides via factory props:
- `textClassName` — appended to `photo-collage__text` class
- `imageClassName` — appended to each `photo-collage__image` class

The section `className` is always prefixed with `'photo-collage'` (required for CSS to apply).

## Theme Variable Mapping
| Visual Property | Hardcoded Default | Theme Variable |
|-----------------|-------------------|----------------|
| Text font | `system-ui, sans-serif` fallback | `var(--font-paragraph)` |
| Text font size | `1rem` fallback | `var(--font-size-body)` |
| Section padding (mobile) | `4rem 1.5rem` | `var(--spacing-2xl)`, `var(--spacing-md)` |
| Section padding (tablet) | `6rem 3rem` | `var(--spacing-2xl)`, `var(--spacing-xl)` |
| Section padding (desktop) | `6rem 5rem` | `var(--spacing-section-y)`, `var(--spacing-section-x)` |
| Section gap (mobile) | `2rem` | `var(--spacing-lg)` |
| Section gap (tablet+) | `6rem` | `var(--spacing-section-y)` |
| Text bottom margin (mobile) | `2rem` | `var(--spacing-lg)` |
| Text bottom margin (tablet) | `3rem` | `var(--spacing-xl)` |

## CSS Details (styles.css)
- **Mobile images**: Each image gets a different `width` and `aspect-ratio` via `:nth-of-type()` selectors (1st: 65%/3:4, 2nd: 70%/3:2, 3rd: 60%/3:4, 4th: 65%/3:2). Odd images align right (`flex-end`), even align left (`flex-start`).
- **Desktop (1024px+)**: All images switch to `position: absolute` with specific `cqw`-based positions. Uses `@container site-content (min-width: 1024px)`.
- **Desktop text**: Also absolute positioned at `left: 20cqw, top: 5cqw, width: 28cqw, height: 16cqw`, font scales to `1.1cqw`.
- **Desktop section**: `min-height: 74cqw`, `padding: 0`.
- **Corner bracket decoration**: `.corner-border` utility class defined here (4 corner brackets via background gradients). Uses `--corner-size`, `--corner-thickness`, `--corner-color` CSS custom properties.

## Gotchas
- The section className is forced to include `'photo-collage'` (hardcoded in factory: `['photo-collage', className].filter(Boolean).join(' ')`). CSS selectors depend on `.section.photo-collage`.
- Desktop layout uses `@container site-content` (not `@container site`) — a different container context.
- The factory uses destructured assignment from `applyMetaDefaults()` directly (no `rawProps` pattern for content binding defaults) — `text` and `images` are **required** props.
- Designed for exactly 4 images — CSS `:nth-of-type()` rules only cover images 1-4. More images will render but without specific positioning on desktop.
- `unique: false` — multiple instances of this section are allowed on the same page.
- Images use `object-fit: cover` on mobile, `object-fit: contain` on desktop.
- The `.corner-border` class is a reusable utility defined in this stylesheet but not used by the section factory itself — available for preset-level decoration.
