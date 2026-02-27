# ProjectVideoGrid — Visual Anatomy

## Layout
A full-viewport project frame displaying a mixed aspect-ratio video grid with a header logo and optional social links footer bar. Vertical (9/16) videos sit side-by-side on the left; horizontal (16/9) videos stack on the right.

```
┌─────────────────────────────────────────────────┐
│  [Logo Image]                                   │  ← .project-video-grid__header
│                                                 │
│  ┌──────────────┐  ┌──────────────────────────┐ │
│  │ 9/16  │ 9/16 │  │ 16/9                     │ │
│  │       │      │  │                           │ │
│  │       │      │  ├──────────────────────────┤ │
│  │       │      │  │ 16/9                     │ │
│  │       │      │  │                           │ │
│  └──────────────┘  └──────────────────────────┘ │
│                                                 │
│  [Social Links Bar]                             │  ← optional ContactBar
└─────────────────────────────────────────────────┘
     .project-frame (flex column, justify: between)
```

## Widget Composition
| Element | Widget | Key Props |
|---------|--------|-----------|
| Root frame | Section | layout: flex column, justify: between, className: project-frame |
| Header row | Flex | direction: row, align: center |
| Logo | Image | src, alt, decorative: false |
| Grid container | Flex | direction: row |
| Vertical group | Flex | direction: row (9/16 videos side-by-side) |
| Horizontal group | Flex | direction: column (16/9 videos stacked) |
| Each video | Video | src, poster, posterTime, hoverPlay, aspectRatio, alt, overlayTitle |
| Content wrapper | Box | className: project-frame__content |
| Footer social bar | ContactBar | links, textColor |

## Typography (factory-hardcoded scales)
No text widgets used directly in this pattern. Video titles display via the Video widget's `overlayTitle` prop.

## Default Styles (from types.ts)
No DEFAULT_*_STYLES object. Logo width defaults to 200 via content field default. Logo invert filter applied conditionally via inline `filter: 'invert(1)'`.

## Settings (CMS-configurable via meta.ts)
| Setting | Type | Default | Visual Effect |
|---------|------|---------|---------------|
| hoverPlay | toggle | `true` | Play videos on mouse hover |
| textColor | select | `'light'` | Choices: Light, Dark — controls footer bar icon/text color scheme |

## Content Fields (from content.ts)
| Field | Type | Required | Sample |
|-------|------|----------|--------|
| logo.src | image | yes | `/images/bishoy-gendi/Supercell-logo-alpha.webp` |
| logo.alt | text | no | `'Supercell'` |
| logo.width | number | no | `200` |
| videos | collection | yes | Array of `{ src, title, aspectRatio, poster?, posterTime? }` |
| videos[].src | text | yes | `/videos/.../bigboi-green.webm` |
| videos[].title | text | yes | `'BigBoi Green'` |
| videos[].aspectRatio | text | yes | `'9/16'` or `'16/9'` |
| videos[].poster | image | no | — |
| videos[].posterTime | number | no | `1` |

## Style Override Points
- `style` — merged onto section root (use for `backgroundColor`, etc.)
- `logo.width` — inline style on logo Image widget
- `logo.invert` — sets `filter: invert(1)` on logo
- `className` — appended to section root alongside `project-frame`
- `socialLinks` — optional; omit to hide footer bar entirely

## Theme Variable Mapping (for extraction)
| Visual Property | Hardcoded Default | Theme Variable |
|-----------------|-------------------|----------------|
| Section layout padding | (from BaseSectionProps) | — |
| Section height | `'viewport'` | — |
| Logo width | `200` (inline style) | — |

## Gotchas
- Videos are grouped by aspect ratio: `'9/16'` goes to vertical group, everything else to horizontal group
- Binding expression mode uses `condition` on `__repeat` items to filter by aspect ratio
- The section uses `project-frame` and `project-frame__*` CSS classes shared with other project sections
- `socialLinks` prop is optional — if omitted or empty, no footer bar renders
- `ContactBar` widget is used for social links (separate from the grid)
