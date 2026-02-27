# ProjectScroll — Visual Anatomy

## Layout
A two-column layout with a sticky sidebar (title, intro text, project index) on the left and a scrollable column of project cards on the right. As the user scrolls, the sidebar stays fixed while cards scroll past.

```
┌──────────────────────────────────────────────────┐
│  ┌─────────────┐  ┌────────────────────────────┐ │
│  │ Section      │  │ ┌──────────────────────┐   │ │
│  │ Title        │  │ │ ScrollCard           │   │ │
│  │              │  │ │  [Image / Video]     │   │ │
│  │ Intro text   │  │ │  description         │   │ │
│  │              │  │ │  title — client       │   │ │
│  │ ○ Project 1  │  │ └──────────────────────┘   │ │
│  │ ○ Project 2  │  │ ┌──────────────────────┐   │ │
│  │ ○ Project 3  │  │ │ ScrollCard           │   │ │
│  │ ○ Project 4  │  │ │  [Image / Video]     │   │ │
│  │ (sticky)     │  │ │  ...                 │   │ │
│  └─────────────┘  │ └──────────────────────┘   │ │
│    30-45% width    │   flex: 1 (scrollable)     │ │
└──────────────────────────────────────────────────┘
```

## Widget Composition
| Element | Widget | Key Props |
|---------|--------|-----------|
| Layout row | Flex | direction: row, gap: 48 |
| Sidebar | Stack | gap: 24, style: width (30/38/45%), flexShrink: 0 |
| Section title | Text | as: h3, className: section-project-scroll__title |
| Intro text | Text | as: small |
| Index list | Stack | gap: 8 |
| Index item (repeated) | Text | as: small, content: project title |
| Cards column | Stack | gap: 0, style: flex: 1 |
| Each card | ProjectScroll__ScrollCard | title, client, description, imageSrc, videoSrc, cardBorder |

## Typography (factory-hardcoded scales)
| Element | Scale | Weight | Extras |
|---------|-------|--------|--------|
| Section title | h3 | — | fontSize: clamp(48px, 5cqw, 72px) |
| Intro text | small | — | — |
| Index items | small | — | — |

## Scoped Widget: ProjectScroll__ScrollCard
- **Location:** `components/ScrollCard/index.tsx`
- **Registration:** `registerScopedWidget('ProjectScroll__ScrollCard', ScrollCard)` — side-effect imported in factory
- **React component** with hover state: shows video overlay on mouseenter, hides on mouseleave
- **Sub-elements:** `.scroll-card__media` (image + video), `.scroll-card__description`, `.scroll-card__footer` (title — divider — client)

## Default Styles (from types.ts)
No DEFAULT_*_STYLES object.

## Settings (CMS-configurable via meta.ts)
| Setting | Type | Default | Visual Effect |
|---------|------|---------|---------------|
| sidebarWidth | select | `'default'` | Narrow (30%), Default (38%), Wide (45%) — sidebar column width |
| cardBorder | toggle | `true` | Show/hide border on project cards (Style group) |
| fadeOverlay | toggle | `true` | Adds `--fade` class for fade-to-black gradient overlay on cards column (Advanced) |
| fadeStart | number | `0.5` | Start point for fade effect, 0-1 range (Hidden/preset-only) |

## Content Fields (from content.ts)
| Field | Type | Required | Sample |
|-------|------|----------|--------|
| sectionTitle | text | no | `'Selected\nProjects'` |
| introText | textarea | no | `'A curated selection of our most...'` |
| projects | collection | yes | Array of project items |
| projects[].title | text | yes | `'ODDSET GAMES'` |
| projects[].client | text | yes | `'Danske Spil'` |
| projects[].description | textarea | no | `'Character animation and...'` |
| projects[].imageSrc | image | yes | Unsplash URL |
| projects[].overlayImageSrc | image | no | Hover overlay image |
| projects[].videoSrc | text | no | Hover video URL |

## Style Override Points
- `style` — merged onto section root via `p.style`
- `className` — applied to section root
- Sidebar width controlled by `sidebarWidth` setting (maps to 30/38/45%)
- `paddingTop`/`paddingBottom` — defaults to 80
- Cards column gets fade overlay via CSS class modifier

## Theme Variable Mapping (for extraction)
| Visual Property | Hardcoded Default | Theme Variable |
|-----------------|-------------------|----------------|
| Layout gap | `48` (inline) | — |
| Sidebar gap | `24` (inline) | — |
| Title font size | `clamp(48px, 5cqw, 72px)` (inline) | — |
| Section padding | `80` top/bottom | — |

## Gotchas
- Sidebar stickiness is handled by CSS class `section-project-scroll__sidebar`, not inline styles
- The side-effect import `import './components/ScrollCard'` must be present for the scoped widget to register
- `fadeOverlay` adds a CSS class modifier `section-project-scroll__cards--fade` — the actual gradient is in styles.css
- Cards column uses `gap: 0` — spacing between cards comes from the ScrollCard's own padding/margin
- The `overlayImageSrc` field exists in content declaration but is not currently wired into the ScrollCard component
