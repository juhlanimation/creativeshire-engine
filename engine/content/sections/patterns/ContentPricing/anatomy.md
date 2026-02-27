# ContentPricing — Visual Anatomy

## Layout
A pricing comparison section with an optional subtitle header, a grid of pricing cards (each with plan name, price, feature list, and CTA button), and optional footer text. Cards can be highlighted and support the `hover/scale` behaviour.

```
┌──────────────────────────────────────────────────────┐
│         [Subtitle]                                   │  ← optional header
│                                                      │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ FLEX     │  │ ALL-IN ★     │  │ ENTERPRISE   │   │
│  │          │  │ (highlighted) │  │              │   │
│  │ 1,300 DKK│  │ 2,000 DKK    │  │ Contact us   │   │
│  │ /month   │  │ /month       │  │              │   │
│  │          │  │              │  │              │   │
│  │ Desc...  │  │ Desc...      │  │ Desc...      │   │
│  │          │  │              │  │              │   │
│  │ ✓ Feature│  │ ✓ Feature    │  │ ✓ Feature    │   │
│  │ ✓ Feature│  │ ✓ Feature    │  │ ✓ Feature    │   │
│  │ × Feature│  │ ✓ Feature    │  │ + Feature    │   │
│  │          │  │              │  │              │   │
│  │ [Get]    │  │ [Start]      │  │ [Contact]    │   │
│  └──────────┘  └──────────────┘  └──────────────┘   │
│                                                      │
│  [Footer text]                                       │  ← optional
└──────────────────────────────────────────────────────┘
```

## Widget Composition
| Element | Widget | Key Props |
|---------|--------|-----------|
| Section header | Flex | direction: column, align: center |
| Subtitle | Text | as: body |
| Plans grid | Grid | columns (1-4), gap |
| Card wrapper | Flex | direction: column, behaviour: hover/scale |
| Badge | Text | as: small, className: pricing-card__badge |
| Plan name | Text | as: h3 |
| Price row | Flex | direction: row, align: baseline |
| Price | Text | as: body |
| Period | Text | as: small |
| Description | Text | as: body |
| Features list | Flex | direction: column, gap: var(--spacing-sm) |
| Feature row | Flex | direction: row, align: start |
| Feature icon | Text | as: small (check/x/plus) |
| Feature label | Text | as: small |
| CTA button | Button | variant: primary (highlighted) or secondary |
| CTA link wrapper | Link | href (wraps button when ctaHref provided) |
| Footer | Text | as: body |

## Typography (factory-hardcoded scales)
| Element | Scale | Weight | Extras |
|---------|-------|--------|--------|
| Subtitle | body | — | — |
| Plan name | h3 | — | — |
| Price | body | — | — |
| Period | small | — | — |
| Description | body | — | — |
| Badge | small | — | — |
| Feature icon | small | — | — |
| Feature label | small | — | — |
| Footer | body | — | — |

## Default Styles (from types.ts)
No DEFAULT_*_STYLES object. Card background colors are controlled via CSS custom properties set as inline styles on the section:
- `--pricing-card-bg` (default via CSS)
- `--pricing-card-highlighted-bg` (default via CSS)

## Settings (CMS-configurable via meta.ts)
| Setting | Type | Default | Visual Effect |
|---------|------|---------|---------------|
| columns | range | `3` | 1-4 columns in the grid (Layout group) |
| gap | text | `'2rem'` | CSS gap between cards (Hidden/preset-only) |
| cardShadow | toggle | `true` | Show shadow on cards (Style group) |
| cardBackgroundColor | color | `'#ffffff'` | Default card background (Style group) |
| highlightedCardBackgroundColor | color | `'#fafafa'` | Background for highlighted cards (Style group) |

## Content Fields (from content.ts)
| Field | Type | Required | Sample |
|-------|------|----------|--------|
| subtitle | text | no | `'ex moms / maned'` |
| plans | collection | yes | Array of pricing plans |
| plans[].name | text | yes | `'FLEX'` |
| plans[].price | text | yes | `'1.300 DKK'` |
| plans[].description | textarea | no | `'Frihed og fleksibilitet...'` |
| plans[].features | collection | no | Array of `{ label, included }` |
| plans[].features[].label | text | yes | `'Fri adgang 24/7'` |
| plans[].features[].included | text | yes | `true` / `false` / `'partial'` |
| footerText | text | no | — |

## Style Override Points
- `style` — merged onto section root (can override background, etc.)
- `cardBackgroundColor` → `--pricing-card-bg` CSS custom property
- `highlightedCardBackgroundColor` → `--pricing-card-highlighted-bg` CSS custom property
- `planWidgets` — entirely replace the auto-generated plans grid with custom widgets
- `extraWidgets` — append additional widgets after the plans grid (e.g., contact sub-section)
- `className` — defaults to `'pricing-section'`

## Theme Variable Mapping (for extraction)
| Visual Property | Hardcoded Default | Theme Variable |
|-----------------|-------------------|----------------|
| Card gap (features) | `var(--spacing-sm, 0.75rem)` | `--spacing-sm` |
| Price row gap | `var(--spacing-xs, 0.25rem)` | `--spacing-xs` |
| Card background | `#ffffff` | `--pricing-card-bg` (custom) |
| Highlighted card bg | `#fafafa` | `--pricing-card-highlighted-bg` (custom) |

## Gotchas
- Feature `included` field is typed `boolean | 'partial'` but content declaration declares it as text — platform must handle conversion
- Each card gets `behaviour: 'hover/scale'` for hover interaction
- Highlighted cards get `variant: 'primary'` on their CTA Button; normal cards get `variant: 'secondary'`
- The `icons` prop lets presets customize checkmark/x/plus characters (defaults: check, x, plus)
- `planWidgets` completely replaces the grid — use for custom card layouts
- Typography scale props exist in `types.ts` (subtitleScale, planNameScale, etc.) but are NOT exposed as settings — factory hardcodes them
