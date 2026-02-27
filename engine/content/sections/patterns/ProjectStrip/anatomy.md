# ProjectStrip — Visual Anatomy

## Layout
Constrained section with a left-aligned heading + year range header, followed by a horizontal expandable thumbnail gallery. Designed as a secondary project showcase (e.g. "Other Selected Projects"). Uses stack layout with internal margins.

```
┌─────────────────────────────────────────────────┐
│  padding: var(--spacing-2xl) var(--spacing-sm)   │
│                                                  │
│  OTHER SELECTED PROJECTS (small)                 │  ← header (Flex column)
│  2018-2024 (small)                               │     width: fit-content, marginLeft: 0
│                                                  │
│  marginTop: var(--spacing-lg)                    │
│  ┌──────┬──────┬────────────────┬──────┬──────┐ │
│  │      │      │                │      │      │ │
│  │ img  │ img  │  EXPANDED img  │ img  │ img  │ │  ← ExpandRowImageRepeater
│  │      │      │  + title       │      │      │ │     height: 32rem
│  │      │      │  + WATCH       │      │      │ │     gap: 4px
│  │      │      │                │      │      │ │
│  └──────┴──────┴────────────────┴──────┴──────┘ │
│                                                  │
└─────────────────────────────────────────────────┘
```

## Widget Composition
| Element | Widget | Key Props |
|---------|--------|-----------|
| Header | Flex | direction: 'column', align: 'stretch', gap: 0 |
| Heading | Text | as: 'small', content: heading |
| Year range | Text | as: 'small', content: yearRange |
| Gallery | ExpandRowImageRepeater | projects, height: '32rem', gap: '4px', expandedWidth: '32rem', transitionDuration: 400, cursorLabel: 'WATCH' |

## Typography (factory-hardcoded scales)
| Element | Scale | Weight | Extras |
|---------|-------|--------|--------|
| Heading | small | — | className: 'other-projects-heading' |
| Year range | small | — | className: 'other-projects-year-range' |

## Default Styles (from types.ts)
No DEFAULT_*_STYLES object. Inline styles applied in factory:
- Header: `width: 'fit-content'`, `marginRight: 'auto'`, `marginLeft: 0`
- Gallery: `marginTop: 'var(--spacing-lg, 2.25rem)'`
- Section layout padding: `'var(--spacing-2xl, 4rem) var(--spacing-sm, 0.5rem)'`

## Settings (CMS-configurable via meta.ts)
| Setting | Type | Default | Visual Effect |
|---------|------|---------|---------------|
| *(none)* | — | — | No CMS-configurable settings |

## Content Fields (from content.ts)
| Field | Type | Required | Sample |
|-------|------|----------|--------|
| heading | text | no | 'OTHER SELECTED PROJECTS' |
| yearRange | text | no | '2018-2024' |
| projects | collection | no | Array of project items |

### Project collection item fields:
| Field | Type | Required | Sample |
|-------|------|----------|--------|
| title | text | yes | 'SCENERY AND SENTIMENT' |
| role | text | yes | 'Executive Producer' |
| year | text | yes | '2023' |
| client | text | no | 'HOYOVERSE' |
| studio | text | no | 'SUN CREATURE' |
| thumbnailSrc | image | yes | /images/other-projects/genshin-impact-thumbnail.webp |
| thumbnailAlt | text | no | 'Genshin Impact thumbnail' |
| videoSrc | text | no | /videos/other-projects/genshin-impact-hover.webm |
| videoUrl | text | no | (full video URL for modal) |

## Style Override Points
- `style` — merged onto section root
- `className` — defaults to 'other-projects-section' if not provided
- `galleryOn` — event handlers for gallery widget (defaults to `{ click: 'modal.open' }`)
- `paddingTop/Bottom/Left/Right` — section-level padding

## Theme Variable Mapping (for extraction)
| Visual Property | Hardcoded Default | Theme Variable |
|-----------------|-------------------|----------------|
| Gallery margin-top | 2.25rem | var(--spacing-lg, 2.25rem) |
| Layout padding | 4rem / 0.5rem | var(--spacing-2xl, 4rem) / var(--spacing-sm, 0.5rem) |
| Gallery gap | 4px | — (hardcoded) |
| Text colors | — | Resolved from theme CSS vars |

## Gotchas
- **Uses global widget**: `ExpandRowImageRepeater` is a global widget (from `widgets/repeaters/`), shared with ProjectExpand.
- **requiredOverlays**: Meta declares `['VideoModal']` — expects a VideoModal overlay for click-to-play.
- **Default event wiring**: Unlike ProjectExpand, `galleryOn` defaults to `{ click: 'modal.open' }` directly in the factory if not overridden.
- **Content bindings as defaults**: The factory uses `rawProps?.heading ?? '{{ content.projects.otherHeading }}'` pattern — content fields default to binding expressions, not empty strings.
- **Section is constrained by default** (`constrained: true`), unlike ProjectShowcase/ProjectGallery/ProjectCompare.
- **Section layout**: Uses `type: 'stack'` with `direction: 'column'`, `align: 'stretch'`, `gap: 0`. Spacing is handled via margins, not gap.
- **Section height**: Defaults to `undefined` (auto), NOT viewport — unlike other project sections.
- **No settings at all**: The meta defines zero CMS-configurable settings. All customization is via content fields or preset props.
- **Header conditional**: Header is only rendered if heading or yearRange is truthy.
- **Gallery conditional**: Gallery is only rendered if projects array is non-empty or is a binding expression.
