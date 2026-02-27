# ProjectFeatured — Visual Anatomy

## Layout
Constrained vertical stack of ProjectCard composites, each showing a project with thumbnail/video on one side and text content on the other. Cards use alternating left/right layout. Wrapped in generous vertical padding. Designed for featured portfolio project grids.

```
┌─────────────────────────────────────────────────┐
│                  paddingTop: 100                 │
│ ┌───────────────────────────────────────────┐   │
│ │ ┌──────────────┐  ┌────────────────────┐  │   │
│ │ │  Video       │  │ TITLE (h3)         │  │   │  ← ProjectCard (normal)
│ │ │  (hoverPlay) │  │ Description (span) │  │   │     data-reversed="false"
│ │ │  16:9        │  │                    │  │   │
│ │ ├──────────────┤  │ 2024               │  │   │
│ │ │ Client  Studio│  │ Director           │  │   │
│ │ └──────────────┘  └────────────────────┘  │   │
│ └───────────────────────────────────────────┘   │
│                    gap (loose, 3x)               │
│ ┌───────────────────────────────────────────┐   │
│ │ ┌────────────────────┐  ┌──────────────┐  │   │
│ │ │ TITLE (h3)         │  │  Video       │  │   │  ← ProjectCard (reversed)
│ │ │ Description (span) │  │  (hoverPlay) │  │   │     data-reversed="true"
│ │ │                    │  │  16:9        │  │   │
│ │ │ 2023               │  ├──────────────┤  │   │
│ │ │ Producer           │  │ Client  Studio│  │   │
│ │ └────────────────────┘  └──────────────┘  │   │
│ └───────────────────────────────────────────┘   │
│                  paddingBottom: 100               │
└─────────────────────────────────────────────────┘
```

## Widget Composition
| Element | Widget | Key Props |
|---------|--------|-----------|
| Content wrapper | Flex | direction: 'column', align: 'stretch', gap: 'loose', gapScale: 3 |
| Project card | Flex (via createProjectCard) | className: 'project-card', data-reversed, align: 'start' |
| Thumbnail column | Box | className: 'project-card__thumbnail-column' |
| Thumbnail video | Video | hoverPlay: true, aspectRatio: '16/9', poster, videoUrl |
| Metadata row | Flex | direction: 'row' |
| Client text | Text | as: 'span', color: 'secondary', content: 'Client {name}' |
| Studio text | Text | as: 'span', color: 'secondary', content: 'Studio {name}' |
| Content column | Box | className: 'project-card__content' |
| Title | Text | as: 'h3', color: 'primary' |
| Description | Text | as: 'span', color: 'primary' |
| Year | Text | as: 'span', color: 'secondary' |
| Role | Text | as: 'span', color: 'secondary' |

## Typography (factory-hardcoded scales)
| Element | Scale | Weight | Extras |
|---------|-------|--------|--------|
| Title | h3 | — | color: 'primary', className: 'project-card__title' |
| Description | span | — | color: 'primary', className: 'project-card__description' |
| Client | span | — | color: 'secondary', prefix "Client " |
| Studio | span | — | color: 'secondary', prefix "Studio " |
| Year | span | — | color: 'secondary', className: 'project-card__year' |
| Role | span | — | color: 'secondary', className: 'project-card__role' |

## Default Styles (from types.ts)
No DEFAULT_*_STYLES object. Factory applies:
- Section: `paddingTop: 100`, `paddingBottom: 100`, `constrained: true`
- Content wrapper Flex: `gap: 'loose'`, `gapScale: 3`

## Settings (CMS-configurable via meta.ts)
| Setting | Type | Default | Visual Effect |
|---------|------|---------|---------------|
| startReversed | toggle | false | First project has thumbnail on the right instead of left |

## Content Fields (from content.ts)
| Field | Type | Required | Sample |
|-------|------|----------|--------|
| projects | collection (required) | yes | Array of project items |

### Project collection item fields:
| Field | Type | Required | Sample |
|-------|------|----------|--------|
| title | text | yes | 'ELEMENTS OF TIME' |
| description | textarea | no | 'The film brings to life...' |
| role | text | yes | 'Executive Producer, Producer' |
| year | text | yes | '2025' |
| client | text | no | 'AZUKI' |
| studio | text | no | 'CROSSROAD STUDIO' |
| thumbnailSrc | image | yes | /images/01-elements-of-time/thumbnail.webp |
| thumbnailAlt | text | no | 'Elements of Time thumbnail' |
| videoSrc | text | no | /videos/01-elements-of-time/hover.webm |
| videoUrl | text | no | (full video URL for modal) |

## Style Override Points
- `style` — merged onto section root
- `className` — appended to section root
- `gap` — overrides content wrapper Flex gap (default: 'loose')
- `thumbnailDecorators` — overrides default decorators on each ProjectCard thumbnail
- `paddingTop/Bottom/Left/Right` — section-level padding

## Theme Variable Mapping (for extraction)
| Visual Property | Hardcoded Default | Theme Variable |
|-----------------|-------------------|----------------|
| Primary text color | — | var(--text-primary) via Text color='primary' |
| Secondary text color | — | var(--text-secondary) via Text color='secondary' |
| Heading font | — | var(--font-heading) via Text as='h3' |

## Gotchas
- **ProjectCard is a factory helper, NOT a scoped widget**: `createProjectCard()` returns a `WidgetSchema` (a Flex composite). It does NOT use `registerScopedWidget()`. It is colocated in `components/ProjectCard/` but is imported as a plain function.
- **Alternating layout**: Cards alternate between `data-reversed="false"` and `data-reversed="true"`. CSS uses `flex-direction: row-reverse` based on the data attribute. DOM order is always [thumbnail, content].
- **Binding mode uses data-index**: When projects come from a binding expression, `dataIndex: '{{ item.$index }}'` is set instead of `reversed`. Flex computes `reversed` at render time from the index.
- **Default decorators**: ProjectCard meta specifies `defaultDecorators: [{ id: 'video-modal' }, { id: 'cursor-label', params: { label: 'WATCH' } }, { id: 'hover-scale' }]`. These can be overridden per-preset via `thumbnailDecorators`.
- **requiredOverlays**: Meta declares `['VideoModal']` — the section expects a VideoModal overlay to be present for full-video playback.
- **Section is constrained by default** (`constrained: true`), unlike most other Project sections.
- **Section layout**: Uses `type: 'stack'` (not 'flex') with `direction: 'column'`, `align: 'stretch'`.
- **Client/Studio text prefixes**: Factory prepends "Client " and "Studio " to the content values — these are baked into the widget schema.
