# ProjectExpand — Visual Anatomy

## Layout
Full-viewport section with a centered header logo and an expandable horizontal thumbnail gallery. Thumbnails expand on hover to reveal video previews. Clicking opens a video modal. Optional footer contact bar. Inspired by Riot Games portfolio sections.

```
┌─────────────────────────────────────────────────┐
│                                                  │
│              [Logo Image (centered)]             │  ← header (Flex row, justify:center)
│                                                  │
├─────────────────────────────────────────────────┤
│ ┌──────┬──────┬────────────────┬──────┬──────┐  │
│ │      │      │                │      │      │  │
│ │ img  │ img  │  EXPANDED img  │ img  │ img  │  │  ← ExpandRowImageRepeater
│ │      │      │  + title       │      │      │  │     height: 32rem
│ │      │      │  + WATCH       │      │      │  │     gap: var(--spacing-xs, 4px)
│ │      │      │                │      │      │  │
│ └──────┴──────┴────────────────┴──────┴──────┘  │
│                                                  │
├─────────────────────────────────────────────────┤
│ [ContactBar: social links]                       │  ← optional footer
└─────────────────────────────────────────────────┘
```

## Widget Composition
| Element | Widget | Key Props |
|---------|--------|-----------|
| Header | Flex | direction: 'row', align: 'center', justify: 'center' |
| Logo | Image | src, alt, decorative: false, optional filter: 'invert(1)' |
| Content wrapper | Box | className: 'project-frame__content' |
| Gallery | ExpandRowImageRepeater | projects, height: '32rem', gap, expandedWidth: '32rem', transitionDuration: 400, cursorLabel: 'WATCH' |
| Footer | ContactBar | links, textColor |

## Typography (factory-hardcoded scales)
No Text widgets are used directly in the factory. Typography is handled internally by the `ExpandRowImageRepeater` global widget and its `ExpandRowThumbnail` sub-component.

## Default Styles (from types.ts)
No DEFAULT_*_STYLES object. Inline styles applied in factory:
- Logo: `width: props.logo.width ?? 120`, `height: 'auto'`, optional `filter: 'invert(1)'`

## Settings (CMS-configurable via meta.ts)
| Setting | Type | Default | Visual Effect |
|---------|------|---------|---------------|
| textColor | select | 'light' | Light/dark color scheme for footer ContactBar |

## Content Fields (from content.ts)
| Field | Type | Required | Sample |
|-------|------|----------|--------|
| logo.src | image | yes | /images/.../Riot_Games_2022.svg.png |
| logo.alt | text | no | 'Riot Games' |
| logo.width | number | no | 120 |
| videos | collection (required) | yes | Array of expandable video items |

### Video collection item fields:
| Field | Type | Required | Sample |
|-------|------|----------|--------|
| thumbnailSrc | image | yes | /videos/.../legends-of-runeterra.webm |
| thumbnailAlt | text | no | 'Legends of Runeterra' |
| videoSrc | text | yes | (video URL) |
| title | text | yes | 'Legends of Runeterra' |

## Style Override Points
- `style` — merged onto section root (backgrounds, etc.)
- `className` — appended to section root (always includes 'project-frame')
- `logo.width` — inline width on logo Image
- `logo.invert` — applies CSS invert(1) filter to logo
- `galleryHeight` — overrides gallery height (default: '32rem')
- `cursorLabel` — overrides cursor label text (default: 'WATCH')
- `galleryOn` — event handlers for the gallery widget (e.g. `{ click: 'modal.open' }`)
- `paddingTop/Bottom/Left/Right` — section-level padding

## Theme Variable Mapping (for extraction)
| Visual Property | Hardcoded Default | Theme Variable |
|-----------------|-------------------|----------------|
| Gallery gap | 4px | var(--spacing-xs, 4px) |
| Text colors | — | Resolved from theme CSS vars |

## Gotchas
- **Uses global widget**: `ExpandRowImageRepeater` is a global widget (from `widgets/repeaters/`), NOT a scoped widget. Shared with ProjectStrip.
- **requiredOverlays**: Meta declares `['VideoModal']` — expects a VideoModal overlay for click-to-play.
- **Event wiring**: `galleryOn` is spread onto the gallery widget's `on` property, enabling preset-level action binding (e.g. `{ click: 'modal.open' }`).
- **Video items converted**: Factory converts `ExpandableVideoItem[]` to `ExpandRowItem[]` via `toExpandRowItem()` helper (fills optional fields with empty strings).
- **Videos support binding expressions**: `props.videos` can be a string (binding) or concrete `ExpandableVideoItem[]`.
- **Section height**: Defaults to `'viewport'` (full screen).
- **Section layout**: Uses `type: 'flex'` with `direction: 'column'`, `justify: 'between'`, `align: 'stretch'`.
- **Cursor label**: The `cursorLabel` prop is passed to `ExpandRowImageRepeater` which coordinates with the CursorLabel overlay via the action system.
