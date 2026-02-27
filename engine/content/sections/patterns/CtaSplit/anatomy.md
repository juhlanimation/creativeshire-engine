# CtaSplit — Visual Anatomy

## Layout
A call-to-action section with two layout modes. **Featured** uses a CSS Grid with heading (top-left), body text (right), image collage (bottom-left), and ArrowLink CTA (bottom-right). **Compact** uses a Split widget with heading on the left and body + ArrowLink on the right.

### Featured Layout
```
┌──────────────────────────────────────────────────┐
│                                                  │
│  YOU NAME IT,                                    │
│  WE ANIMATE IT.     Body text paragraph sits     │
│  (clamp 80-160px)   on the right side of the     │
│                      grid, vertically centered.   │
│                                                  │
│  ┌─────┐ ┌─────┐   [ArrowLink →]                │
│  │ img │ │ img │    Get in touch                 │
│  │     │ │     │    (variant: swap, large arrow)  │
│  └─────┘ └─────┘                                 │
│  (blendMode: screen)                             │
│                                                  │
└──────────────────────────────────────────────────┘
     section-cta-split--featured
```

### Compact Layout
```
┌──────────────────────────────────────────────────┐
│  ┌─────────────────┐  ┌───────────────────────┐  │
│  │ YOU NAME IT,    │  │ Body text paragraph   │  │
│  │ WE ANIMATE IT.  │  │                       │  │
│  │                 │  │ [ArrowLink →]          │  │
│  │                 │  │ (variant: slide)       │  │
│  └─────────────────┘  └───────────────────────┘  │
│       Split 1:1, gap: 64                         │
└──────────────────────────────────────────────────┘
     section-cta-split--compact
```

## Widget Composition
| Element | Widget | Key Props |
|---------|--------|-----------|
| **Featured grid** | Box | className: section-cta-split__grid |
| Heading area | Box | contains heading Text |
| Body area | Box | contains body Text |
| Collage | Flex | direction: row, gap: 16 |
| Collage images | Image | src, alt, style: mixBlendMode |
| Action area | Flex | direction: row, gap: 16, align: center |
| **Compact split** | Split | ratio: 1:1, gap: 64 |
| Right stack | Stack | gap: 32, contains body + ArrowLink |
| **Shared elements** | | |
| Heading | Text | as: h1, fontSize: clamp(80px, 11.1cqw, 160px) |
| Body text | Text | as: body |
| ArrowLink | ArrowLink | email, label, variant (swap/slide), arrowSize |

## Typography (factory-hardcoded scales)
| Element | Scale | Weight | Extras |
|---------|-------|--------|--------|
| Heading | h1 | — | fontSize: clamp(80px, 11.1cqw, 160px) |
| Body text | body | — | — |

## Default Styles (from types.ts)
No DEFAULT_*_STYLES object.

## Settings (CMS-configurable via meta.ts)
| Setting | Type | Default | Visual Effect |
|---------|------|---------|---------------|
| layout | select | `'featured'` | Featured (with images) or Compact (text only) |
| blendMode | select | `'screen'` | Screen, Multiply, or Normal — controls collage image blend mode (Style group) |

## Content Fields (from content.ts)
| Field | Type | Required | Sample |
|-------|------|----------|--------|
| heading | text | yes | `'YOU NAME IT,\nWE ANIMATE IT.'` |
| bodyText | textarea | yes | `'We are always looking for...'` |
| ctaLabel | text | no | `'Get in touch'` |
| ctaEmail | text | yes | `'hello@studio.com'` |
| collageImages | collection | no | Array of `{ src, alt }` |
| collageImages[].src | image | yes | Unsplash URL |
| collageImages[].alt | text | yes | `'Project highlight 1'` |

## Style Override Points
- `style` — merged onto section root via `p.style`
- `className` — appended to `section-cta-split--{layout}`
- `paddingTop`/`paddingBottom` — featured defaults to 160, compact defaults to 80
- `blendMode` — applied as inline `mixBlendMode` on each collage image
- Collage images only render in featured layout

## Theme Variable Mapping (for extraction)
| Visual Property | Hardcoded Default | Theme Variable |
|-----------------|-------------------|----------------|
| Heading font size | `clamp(80px, 11.1cqw, 160px)` | — |
| Split gap | `64` (compact) | — |
| Collage gap | `16` | — |
| Featured padding | `160` top/bottom | — |
| Compact padding | `80` top/bottom | — |

## Gotchas
- The layout mode changes the entire widget tree structure: featured uses CSS Grid areas via Box, compact uses Split widget
- ArrowLink `variant` switches based on layout: `'swap'` for featured, `'slide'` for compact
- ArrowLink also gets `arrowSize: 'large'` only in featured mode
- The ArrowLink widget uses `email` prop (not `href`) — it is an email-based CTA with copy-to-clipboard
- Section className includes the layout mode: `section-cta-split--featured` or `section-cta-split--compact`
- Collage images only appear in featured layout — `collageImages` content is ignored in compact mode
- The heading uses container-query-based responsive sizing (`11.1cqw`)
