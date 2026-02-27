# ProjectGallery — Visual Anatomy

## Layout
Full-viewport section with a header logo, a large main video, and a horizontal project thumbnail selector below it. Selecting a thumbnail switches the main video. Optional footer contact bar. Inspired by Azuki-style multi-project galleries.

```
┌─────────────────────────────────────────────────┐
│ [Logo Image]                                     │  ← header (Flex row, align: center)
│                                                  │     paddingBlock: 16
├─────────────────────────────────────────────────┤
│                                                  │
│         Main Video (switches on select)          │  ← Video widget
│                                                  │
│ ┌──────┐ ┌──────────────┐ ┌──────┐ ┌──────┐    │
│ │thumb │ │ ACTIVE thumb │ │thumb │ │thumb │    │  ← FlexGalleryCardRepeater
│ │      │ │  + info bar  │ │      │ │      │    │     (horizontal selector)
│ │      │ │  progress ━━ │ │      │ │      │    │
│ └──────┘ └──────────────┘ └──────┘ └──────┘    │
├─────────────────────────────────────────────────┤
│ [ContactBar: social links]                       │  ← optional footer
└─────────────────────────────────────────────────┘
```

## Widget Composition
| Element | Widget | Key Props |
|---------|--------|-----------|
| Header | Flex | direction: 'row', align: 'center' |
| Logo | Image | src, alt, decorative: false, optional filter/invert |
| Video area | Box | className: 'project-frame__content project-gallery__video-area' |
| Main video | Video | src (switches on thumbnail click) |
| Selector | ProjectGallery__FlexGalleryCardRepeater | activeIndex, orientation, showInfo, showPlayingIndicator, showPlayIcon, showOverlay |
| Selector items | Box (via __repeat or map) | thumbnail, title, videoSrc, year, studio, role, posterTime |
| Footer | ContactBar | links, textColor |

## Typography (factory-hardcoded scales)
No Text widgets are used directly in the factory. Typography lives inside the scoped `FlexGalleryCardRepeater` and its `SelectorCard` sub-component.

## Default Styles (from types.ts)
No DEFAULT_*_STYLES object. Inline styles applied in factory:
- Header: `paddingBlock: 16`
- Logo: `width: props.logo.width ?? 300`, optional `filter: 'brightness(0) invert(1)'`
- Video area: optional `border: props.contentBorder`

## Settings (CMS-configurable via meta.ts)
| Setting | Type | Default | Visual Effect |
|---------|------|---------|---------------|
| defaultActiveIndex | number | 0 | Which project thumbnail is initially selected |
| backgroundColor | color | '#C03540' | Section background color |
| textColor | select | 'light' | Light/dark color scheme for footer ContactBar |
| contentBorder | text | '' | CSS border around the video area (e.g. '2px solid #C03540') |

## Content Fields (from content.ts)
| Field | Type | Required | Sample |
|-------|------|----------|--------|
| logo.src | image | yes | /images/.../Azuki_logo.png |
| logo.alt | text | no | 'Azuki' |
| logo.width | number | no | 300 |
| logoFilter | text | no | 'brightness(0) invert(1)' |
| accentColor | text | no | 'accent' |
| backgroundColor | text | no | '#C03540' |
| projects | collection (required) | yes | Array of { thumbnail, title, video, year, studio, role, posterTime } |

### Project collection item fields:
| Field | Type | Required |
|-------|------|----------|
| thumbnail | image | yes |
| title | text | yes |
| video | text | no |
| year | text | no |
| studio | text | no |
| role | text | no |
| posterTime | number | no |

## Style Override Points
- `style` — merged onto section root (after backgroundColor)
- `className` — appended to section root (always includes 'project-frame')
- `backgroundColor` — applied as inline style on section root
- `contentBorder` — applied as border on the video area Box
- `logo.width` — inline width on logo Image
- `logo.invert` — applies 'brightness(0) invert(1)' filter to logo
- `logoFilter` — arbitrary CSS filter on logo
- `thumbnailWidth` / `activeThumbnailWidth` — pixel sizes for selector thumbnails
- `accentColor` — accent color for the selector (semantic or direct CSS color)
- `thumbnailBorder` / `thumbnailBorderRadius` — selector thumbnail styling

## Theme Variable Mapping (for extraction)
| Visual Property | Hardcoded Default | Theme Variable |
|-----------------|-------------------|----------------|
| Background color | #C03540 | — (direct color via setting) |
| Text colors | — | Resolved from theme via CSS |
| Accent color | — | Semantic ('accent') or direct CSS color |

## Gotchas
- **Scoped widget**: `ProjectGallery__FlexGalleryCardRepeater` is side-effect imported. Contains colocated `SelectorCard` sub-component.
- **FlexGalleryCardRepeater** finds sibling `<video>` via DOM traversal (`.closest('.project-gallery__video-area')`) — tightly coupled to class name.
- **Video switching**: Clicking a thumbnail calls `video.src = project.url` directly on the DOM video element. No React state-driven re-render for the video source.
- **Progress tracking**: FlexGalleryCardRepeater tracks video `timeupdate` events and shows a progress bar on the active thumbnail.
- **Keyboard navigation**: Arrow keys navigate between thumbnails (Left/Right for horizontal, Up/Down for vertical).
- **Projects support binding expressions**: `props.projects` can be a string (binding) or concrete `GalleryProject[]`. Uses `__repeat` for binding mode.
- **Section height**: Defaults to `'viewport'` (full screen).
- **CSS custom properties**: FlexGalleryCardRepeater sets `--ps-thumb-w`, `--ps-active-thumb-w`, `--ps-border`, `--ps-accent` as inline CSS vars for configurable sizing.
- **Semantic accent colors**: `accentColor` supports semantic values ('accent', 'interaction', 'primary') via `data-accent` attribute, or direct CSS colors via `--ps-accent` var.
