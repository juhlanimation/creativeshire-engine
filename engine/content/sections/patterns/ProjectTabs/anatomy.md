# ProjectTabs — Visual Anatomy

## Layout
Full-viewport section with a tabbed interface for organizing multiple project collections. Each tab can have a "standard" layout (info card + video grid) or a "compact" layout (scrollable multi-column video grid). Optional external link (e.g. Instagram) appears after the tabs. Designed for curated project showcases ("Projects I Like" style).

```
┌─────────────────────────────────────────────────┐
│                                                  │
│  ┌──────────────┬──────────────┬──────────────┐ │
│  │  Tab Label 1 │  Tab Label 2 │  Tab Label 3 │ │  ← tab bar (TabbedContent)
│  └──────────────┴──────────────┴──────────────┘ │
│                                                  │
│  STANDARD LAYOUT:                                │
│  ┌───────────────────┬───────────────────────┐  │
│  │ Title (h3)        │ ┌───────────────────┐ │  │
│  │ Client: ... (body)│ │ Video 1 (16:9)    │ │  │  ← Grid columns: 2
│  │ Studio: ...(body) │ ├───────────────────┤ │  │     Left: info card (Box)
│  │ Role: ... (body)  │ │ Video 2 (16:9)    │ │  │     Right: video grid (Grid cols:1)
│  │                   │ ├───────────────────┤ │  │
│  │                   │ │ Video 3 (16:9)    │ │  │
│  └───────────────────┴─┴───────────────────┴─┘  │
│                                                  │
│  COMPACT LAYOUT:                                 │
│  ┌──────┬──────┬──────┬──────┬──────┬──────┐    │
│  │ vid  │ vid  │ vid  │ vid  │ vid  │ vid  │    │  ← Grid columns: 4
│  ├──────┼──────┼──────┼──────┼──────┼──────┤    │     overflowX: auto
│  │ vid  │ vid  │ vid  │ vid  │ vid  │ vid  │    │
│  └──────┴──────┴──────┴──────┴──────┴──────┘    │
│                                                  │
│  [External link icon/text]                       │  ← optional Link + Icon/Text
│                                                  │
└─────────────────────────────────────────────────┘
```

## Widget Composition
| Element | Widget | Key Props |
|---------|--------|-----------|
| Tabbed content | ProjectTabs__TabbedContent | tabs (or widgets via __repeat), defaultTab, position: 'top', align |
| **Standard tab layout:** | | |
| Standard wrapper | Grid | columns: 2, className: 'project-tabs__standard-layout' |
| Info card | Box | className: 'project-tabs__info-card' |
| Title | Text | as: 'h3' |
| Client | Text | as: 'body', content: 'Client: ...' |
| Studio | Text | as: 'body', content: 'Studio: ...' |
| Role | Text | as: 'body', content: 'Role: ...' |
| Video grid | Grid | columns: 1, className: 'project-tabs__video-grid' |
| Video | Video | hoverPlay: true, aspectRatio: '16/9' |
| **Compact tab layout:** | | |
| Compact wrapper | Grid | columns: 4, overflowX: 'auto', className: 'project-tabs__compact-layout' |
| Video | Video | hoverPlay: true, aspectRatio: '16/9' |
| **External link (optional):** | | |
| Link wrapper | Link | href, target: '_blank', rel: 'noopener noreferrer' |
| Link icon | Icon | name (e.g. 'instagram') |
| *or* Link text | Text | content (label) |

## Typography (factory-hardcoded scales)
| Element | Scale | Weight | Extras |
|---------|-------|--------|--------|
| Tab info title | h3 | — | className: 'project-tabs__title' |
| Tab info client | body | — | className: 'project-tabs__client', prefix "Client: " |
| Tab info studio | body | — | className: 'project-tabs__studio', prefix "Studio: " |
| Tab info role | body | — | className: 'project-tabs__role', prefix "Role: " |

## Default Styles (from types.ts)
No DEFAULT_*_STYLES object. Key factory layout decisions:
- Standard layout: Grid with 2 columns (info card + video grid)
- Compact layout: Grid with 4 columns, `overflowX: 'auto'`
- Videos limited to 3 in standard layout (`tab.videos.slice(0, 3)`)

## Settings (CMS-configurable via meta.ts)
| Setting | Type | Default | Visual Effect |
|---------|------|---------|---------------|
| defaultTab | text | '' | ID of initially active tab |

## Content Fields (from content.ts)
| Field | Type | Required | Sample |
|-------|------|----------|--------|
| defaultTab | text | no | 'ldr' |
| tabs | collection (required) | yes | Array of tab configurations |
| externalLink.url | text | no | 'https://instagram.com/example' |
| externalLink.label | text | no | 'See more on Instagram' |

### Tab collection item fields:
| Field | Type | Required | Sample |
|-------|------|----------|--------|
| id | text (hidden) | yes | 'ldr' |
| label | text | yes | 'Love, Death & Robots' |
| videos | collection | no | Array of { src, title } |

### Video sub-collection item fields:
| Field | Type | Required |
|-------|------|----------|
| src | text | yes |
| title | text | yes |

## Style Override Points
- `style` — merged onto section root
- `className` — appended to section root (always includes 'section-project-tabs')
- `tabAlign` — tab bar alignment: 'start', 'center', or 'end' (default: 'center')
- `padding` — layout padding preset (default: 'normal')
- `paddingTop/Bottom/Left/Right` — section-level padding

## Theme Variable Mapping (for extraction)
| Visual Property | Hardcoded Default | Theme Variable |
|-----------------|-------------------|----------------|
| Text colors | — | Resolved from theme CSS vars |
| Heading font | — | var(--font-heading) via Text as='h3' |
| Body font | — | var(--font-body) via Text as='body' |

## Gotchas
- **Scoped widget**: `ProjectTabs__TabbedContent` is side-effect imported — registers via `registerScopedWidget()`. Renders tab bar and content panels.
- **TabbedContent uses WidgetRenderer**: Imports `useWidgetRenderer()` from renderer context to recursively render widget schemas inside tab panels.
- **Two rendering modes**: Concrete array mode builds tabs at definition time with `createStandardTabContent()`/`createCompactTabContent()`. Binding mode uses `__repeat` with nested `__repeat` for videos within each tab.
- **Standard layout limits to 3 videos**: `tab.videos.slice(0, 3)` — only the first 3 videos are shown in standard layout.
- **ExternalLink has two interfaces**: `ExternalLink` (with `href` + `icon`) or binding-compatible `{ url, label }`. Factory checks for `'icon' in link` to determine which to render.
- **Info text prefixes**: Factory prepends "Client: ", "Studio: ", "Role: " to the info card text content.
- **Tabs support binding expressions**: `props.tabs` can be a string (binding) or concrete `ProjectTab[]`.
- **Keyboard navigation**: TabbedContent supports ArrowLeft/Right/Up/Down, Home, End for tab switching with ARIA attributes.
- **Section height**: Defaults to `'viewport'` (full screen).
- **Section layout**: Uses `type: 'flex'` with `direction: 'column'`, `justify: 'between'`.
- **Tab layout property**: Each tab declares its `layout: 'standard' | 'compact'` — determines which content builder is used.
- **TypeScript `TextElement` type reference**: The `createStandardTabContent` function uses `TextElement` type for scale parameter — this is a type alias in the factory (maps to text scale strings like 'h3', 'body').
