# TeamShowcase — Visual Anatomy

## Layout
A fullscreen video showcase section where team member names are stacked vertically. On desktop, hovering a name crossfades to that member's background video. On mobile, scroll position auto-selects the nearest name. The entire section is a single StackVideoShowcase scoped widget.

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  ┌─ background video layer (fullscreen) ───────┐ │
│  │                                              │ │
│  │   Vi er                        ← labelText  │ │
│  │                                              │ │
│  │   RUNE SVENNINGSEN    ← active (opacity 1)  │ │
│  │   MARIA TRANBERG      ← inactive (dim)      │ │
│  │   NICOLAJ LARSSON     ← inactive (dim)      │ │
│  │   TOR BIRK TRADS      ← inactive (dim)      │ │
│  │                                              │ │
│  └──────────────────────────────────────────────┘ │
│                 overflow: hidden                  │
└──────────────────────────────────────────────────┘
```

## Widget Composition
| Element | Widget | Key Props |
|---------|--------|-----------|
| Root wrapper | TeamShowcase__StackVideoShowcase | actionPrefix, labelText, inactiveOpacity |
| Member items (children) | Box (via __repeat) | name, videoSrc, videoPoster, href |

The StackVideoShowcase is a React component that reads member data from child widget props and renders:
- Background video layer (crossfades between member videos)
- Label text (e.g., "Vi er")
- Stacked member name list with hover/scroll selection

## Typography (factory-hardcoded scales)
Typography is handled entirely inside the StackVideoShowcase React component, not via Text widgets in the factory. The factory only produces Box children with data props.

## Scoped Widget: TeamShowcase__StackVideoShowcase
- **Location:** `components/StackVideoShowcase/`
- **Registration:** `registerScopedWidget('TeamShowcase__StackVideoShowcase', ...)` — side-effect imported in factory
- **React component** with:
  - Desktop: mouseenter on name triggers video crossfade
  - Mobile: IntersectionObserver on names detects center-of-viewport proximity
  - Video layer with CSS transitions between members
  - Optional action dispatching via `actionPrefix`

## Default Styles (from types.ts)
No DEFAULT_*_STYLES object.

## Settings (CMS-configurable via meta.ts)
| Setting | Type | Default | Visual Effect |
|---------|------|---------|---------------|
| inactiveOpacity | number | `0.2` | Opacity for non-selected member names, 0-1 (Style, Advanced) |
| backgroundColor | text | `''` | Section background color (Style) |

### StackVideoShowcase widget settings
| Setting | Type | Default | Visual Effect |
|---------|------|---------|---------------|
| videoTransitionMs | number | `500` | Video crossfade duration in ms (Advanced) |
| nameTransitionMs | number | `300` | Name opacity transition in ms (Advanced) |
| actionPrefix | text | `''` | Prefix for action dispatching (Advanced) |

## Content Fields (from content.ts)
| Field | Type | Required | Sample |
|-------|------|----------|--------|
| labelText | text | no | `'Vi er'` |
| members | collection | yes | Array of team members |
| members[].name | text | yes | `'Rune Svenningsen'` |
| members[].videoSrc | text | no | `/videos/port-12/RS_Port12_Showreel_2.webm` |
| members[].href | text | no | `'https://runesvenningsen.dk'` |

## Style Override Points
- `style` — merged onto section root (always includes `overflow: hidden`)
- `backgroundColor` — inline style on section
- `className` — defaults to `'team-showcase'`
- Section height defaults to `'auto'`

## Theme Variable Mapping (for extraction)
| Visual Property | Hardcoded Default | Theme Variable |
|-----------------|-------------------|----------------|
| Inactive opacity | `0.2` | — (prop-driven) |
| Video crossfade | `500ms` | — (prop-driven) |
| Name transition | `300ms` | — (prop-driven) |

## Gotchas
- Members are passed as child widgets (Box with data props), not as a flat array prop to the scoped widget — this enables CMS hierarchy
- The `__key: 'name'` on the repeat ensures stable keys during binding expansion
- The `MemberItem` type includes `id` and `subtitle` fields but only `name`, `videoSrc`, `videoPoster`, and `href` are wired through to child widgets
- `overflow: hidden` is always set on the section to contain the fullscreen video layer
- `actionPrefix` enables Chrome patterns to listen for member selection events
