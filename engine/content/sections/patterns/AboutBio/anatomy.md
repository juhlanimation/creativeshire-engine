# AboutBio — Visual Anatomy

## Layout
Viewport-height bio section with a two-column desktop layout (bio text left, portrait photo right), a mobile-only background image at 30% opacity, a gradient overlay fading to the site background, and an absolute-positioned logo marquee at the bottom.

```
MOBILE:
┌──────────────────────────────────────────────┐
│  Box (about-mobile-bg, absolute fill)        │
│    Image (30% opacity, object-cover, top)    │
│                                              │
│  ┌──────────────────────────┐                │
│  │  Box (bio-column, center)│                │
│  │  ┌─────────────────────┐ │                │
│  │  │ Text (bio, small)   │ │                │
│  │  │  whiteSpace: pre-   │ │                │
│  │  │  line, justify      │ │                │
│  │  │                     │ │                │
│  │  │ Text (signature,    │ │                │
│  │  │  italic, right)     │ │                │
│  │  └─────────────────────┘ │                │
│  └──────────────────────────┘                │
│                                              │
│  Box (gradient overlay, absolute bottom)     │
│  [marquee hidden on mobile]                  │
└──────────────────────────────────────────────┘

DESKTOP (768px+):
┌──────────────────────────────────────────────┐
│  [mobile bg hidden]                          │
│                                              │
│  ┌─────────────────┐ ┌────────────────────┐  │
│  │  bio-column 50%  │ │  image-column 50%  │  │
│  │  ┌─────────────┐ │ │  Image (cover,     │  │
│  │  │ Bio text    │ │ │   height: 110%)    │  │
│  │  │ (max-width) │ │ │                    │  │
│  │  │             │ │ │                    │  │
│  │  │ Signature   │ │ │                    │  │
│  │  └─────────────┘ │ │                    │  │
│  └─────────────────┘ └────────────────────┘  │
│                                              │
│  ░░░░░░░ gradient overlay ░░░░░░░░░░░░░░░░░  │
│  ═══ LOGO ═══ LOGO ═══ LOGO ═══ LOGO ═══    │
│  (Marquee / AboutBio__MarqueeImageRepeater)  │
└──────────────────────────────────────────────┘
```

## Widget Composition
| Element | Widget | Key Props |
|---------|--------|-----------|
| Mobile background | Box | Contains Image with `opacity: 0.3`, `objectFit: 'cover'`, `objectPosition: 'top'` |
| Content wrapper | Flex | `direction: 'row'` |
| Bio column | Box | Contains inner Box with `maxWidth: var(--bio-max-width, 500px)` |
| Bio text | Text | `as: 'small'`, `html: true`, `lineHeight: '1.625'`, `textAlign: 'justify'` |
| Signature | Text | `as: 'small'`, `variant: 'signature'`, `fontWeight: '400'`, `textAlign: 'right'` |
| Image column | Box | Contains Image with `objectFit: 'cover'`, `height: '110%'` |
| Gradient overlay | Box | Empty, positioned via CSS |
| Logo marquee (static) | Marquee | `duration`, `gap: 96`, Image children per logo |
| Logo marquee (binding) | AboutBio__MarqueeImageRepeater | `logos`, `duration`, `logoWidth: 120`, `logoGap: 96` |

**Scoped Widget**: `AboutBio__MarqueeImageRepeater` — registered via side-effect import `./components/MarqueeImageRepeater`. Used when `clientLogos` is a binding expression.

## Typography (factory-hardcoded scales)
| Element | Scale | Weight | Extras |
|---------|-------|--------|--------|
| Bio text | `small` | (inherited) | `whiteSpace: 'pre-line'`, `display: 'block'`, `lineHeight: '1.625'`, `textAlign: 'justify'`, `html: true` |
| Signature | `small` | 400 | `fontStyle: 'italic'`, `whiteSpace: 'pre-line'`, `textAlign: 'right'`, `marginTop: 'var(--spacing-md, 1rem)'`, `variant: 'signature'` |

## Default Styles (from types.ts)
No `DEFAULT_*_STYLES` object. Styling is split between inline styles in the factory and structural CSS in `styles.css`.

## Settings (CMS-configurable via meta.ts)
| Setting | Type | Default | Tier | Visual Effect |
|---------|------|---------|------|---------------|
| `invertLogos` | toggle | `true` | Style | Applies `brightness(0) invert(1)` filter + `opacity: 0.5` to logos (white on dark backgrounds) |
| `marqueeDuration` | number | `120` | Advanced | Logo marquee animation duration in seconds (5-120, step 5) |
| `marqueeOffset` | number | `2` | Advanced | Logo marquee distance from bottom edge (% of section height, 0-20) |
| `bioMaxWidth` | number | `500` | Preset-only (hidden) | Max width of the bio text container in px (280-800) |
| `bioOffset` | number | `0` | Preset-only (hidden) | Vertical offset of bio content from top (% of section height, 0-30) |

## Content Fields (from content.ts)
| Field | Type | Required | Sample |
|-------|------|----------|--------|
| `bioParagraphs` | textarea | Yes | `"Over the past decade, I've led animated films..."` (paragraphs joined with `\n\n`) |
| `signature` | text | No | `'Alex Morgan'` |
| `photoSrc` | image | Yes | `'/images/profile-highres.webp'` |
| `photoAlt` | text | Yes | `'Alex Morgan - Creative Director & Producer'` |
| `clientLogos` | collection | No | `[{ name: 'Netflix', src: '...', alt: '...', height: 72 }, ...]` |
| `clientLogos[].src` | image | Yes | — |
| `clientLogos[].alt` | text | Yes | — |
| `clientLogos[].name` | text | No | — |
| `clientLogos[].height` | number | No | Per-logo display height in px |

## Style Override Points
Section-level `style` prop merges over factory CSS custom properties:
- `--marquee-offset` (from `marqueeOffset` setting, as `{value}%`)
- `--bio-max-width` (from `bioMaxWidth` setting, as `{value}px`)
- `--bio-offset` (from `bioOffset` setting, as `{value}%`)

Logo styling can be influenced by setting `invertLogos`, which sets:
- `--logo-filter: brightness(0) invert(1)` and `--logo-opacity: 0.5` (on MarqueeImageRepeater)
- Or inline `filter` + `opacity` styles (on static Image widgets)

## Theme Variable Mapping
| Visual Property | Hardcoded Default | Theme Variable |
|-----------------|-------------------|----------------|
| Bio max-width | `500px` | `--bio-max-width` (set by factory from setting) |
| Marquee bottom position | `2%` | `--marquee-offset` (set by factory from setting) |
| Bio vertical offset | `0%` | `--bio-offset` (set by factory from setting) |
| Signature margin-top | `1rem` fallback | `var(--spacing-md)` |
| Bio column padding (tablet) | — | `var(--spacing-xl)`, `var(--spacing-section-y)` |
| Bio column padding (desktop) | — | `var(--spacing-2xl)`, `var(--spacing-section-y)` |
| Gradient background | `#000` fallback | `var(--site-outer-bg)` |
| Gradient height | — | `calc(var(--vh, 1svh) * 30)` |
| Section min-height | `100svh` fallback | `var(--viewport-height)` |

## CSS Details (styles.css)
- Uses **ID selectors** (`#about`, `#about-mobile-bg`, etc.) — tightly coupled to factory widget IDs.
- Mobile: bio column is `width: 100%`, centered vertically (`align-items: center`).
- Tablet (768px+ via `@container site`): bio column becomes `width: 50%`, image column shows at `width: 50%`, mobile bg hides.
- Desktop (1024px+): increased bio column horizontal padding.
- Logo marquee (`#about-logos`): hidden on mobile, shown on tablet+ via container query.
- Gradient overlay (`#about-gradient`): `linear-gradient(to top, var(--site-outer-bg, #000) 0%, transparent 100%)`.
- Includes `[data-breakpoint]` fallbacks for browsers without container query support.

## Gotchas
- **ID-based CSS**: Unlike most sections using BEM classes, this section uses `#about-*` ID selectors. The factory must produce widgets with exact IDs (`about-mobile-bg`, `about-content`, `about-bio-column`, etc.) for CSS to apply.
- **Scoped widget import**: `import './components/MarqueeImageRepeater'` is a side-effect import at the top of the factory for registration.
- `sectionHeight` defaults to `'viewport'` (min-height, not fixed).
- `constrained` defaults to `true`.
- The photo appears twice: once as a 30% opacity mobile background, once as the desktop right column. Same `photoSrc` source.
- Image column uses `height: '110%'` on the image (intentional overflow for visual weight).
- `bioParagraphs` can be an array (joined with `\n\n`), a string, or a binding expression — the factory handles all three via `isBindingExpression()`.
- Logo height varies per logo (`logo.height`) for visual balance — the marquee `minHeight` is computed from `Math.max(...heights, 48)`.
- `overflow-x: hidden` on the section prevents mobile horizontal scroll from the marquee.
