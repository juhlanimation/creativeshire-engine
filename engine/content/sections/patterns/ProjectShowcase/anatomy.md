# ProjectShowcase — Visual Anatomy

## Layout
Full-viewport section displaying a single project with a header (logo + studio/role info), a large video player with optional shot navigation, and an optional footer contact bar. Designed for a cinematic single-project focus (The Boy, Mole, Fox & Horse style).

```
┌─────────────────────────────────────────────────┐
│ [Logo Image]                 Studio Name (small) │  ← header (Flex row, justify:between)
│                              Role (small)         │
├─────────────────────────────────────────────────┤
│                                            ┌───┐ │
│                                            │sh │ │  ← shot nav (absolute, right edge)
│          Video (fills content area)        │275│ │     FlexButtonRepeater → IndexNav
│                                            │300│ │
│                                            │310│ │
│                                            └───┘ │
│                                    0f / 120f     │  ← frame counter (DOM-injected)
├─────────────────────────────────────────────────┤
│ [ContactBar: social links]                       │  ← optional footer
└─────────────────────────────────────────────────┘
```

## Widget Composition
| Element | Widget | Key Props |
|---------|--------|-----------|
| Header | Flex | direction: 'row', align: 'center', justify: 'between' |
| Logo | Image | src, alt, decorative: false |
| Info container | Flex | direction: 'column', align: 'end', gap: 'var(--spacing-xs)' |
| Studio text | Text | as: 'small' |
| Role text | Text | as: 'small' |
| Video container | Box | position: 'relative', optional border |
| Main video | Video | src, poster, posterTime |
| Shot nav anchor | Box | position: absolute, right, top: 50%, translateY(-50%), zIndex: 10 |
| Shot buttons | ProjectShowcase__FlexButtonRepeater | prefix: 'sh', direction: 'column' |
| Shot button items | Button (via __repeat) | label: shot id, data-video-src |
| Footer | ContactBar | links, textColor |

## Typography (factory-hardcoded scales)
| Element | Scale | Weight | Extras |
|---------|-------|--------|--------|
| Studio | small | — | className: 'project-showcase__studio' |
| Role | small | — | className: 'project-showcase__role' |

## Default Styles (from types.ts)
No DEFAULT_*_STYLES object. Inline styles are applied directly in the factory:
- Header: `paddingBottom: 16`
- Logo: `width: props.logo.width ?? 300`
- Video container: `position: 'relative'`, optional `border: '1px solid currentColor'`
- Shot nav: `position: 'absolute', right: 'var(--spacing-md, 1rem)', top: '50%', transform: 'translateY(-50%)', zIndex: 10`

## Settings (CMS-configurable via meta.ts)
| Setting | Type | Default | Visual Effect |
|---------|------|---------|---------------|
| videoBorder | toggle | true | Shows/hides 1px solid currentColor border around video |
| textColor | select | 'dark' | Light/dark color scheme for ContactBar footer |

## Content Fields (from content.ts)
| Field | Type | Required | Sample |
|-------|------|----------|--------|
| logo.src | image | yes | /images/.../the-boy-mole-fox-horse-logo.webp |
| logo.alt | text | no | 'The Boy, the Mole, the Fox and the Horse' |
| logo.width | number | no | 300 |
| studio | text | yes | 'WellHello Productions' |
| role | text | yes | 'Character Animator' |
| videoSrc | text | yes | /videos/.../reel.webm |
| videoPoster | image | no | /images/.../bmfh-reel.jpg |
| posterTime | number | no | 5 |
| shots | collection | no | Array of { id: number, videoSrc: string } |

## Style Override Points
- `style` — merged onto section root (backgrounds, etc.)
- `className` — appended to section root (always includes 'project-frame')
- `logo.width` — inline width on logo Image
- `videoBorder` — toggles 1px border on video container
- `paddingTop/Bottom/Left/Right` — section-level padding

## Theme Variable Mapping (for extraction)
| Visual Property | Hardcoded Default | Theme Variable |
|-----------------|-------------------|----------------|
| Info gap | 0.25rem | var(--spacing-xs, 0.25rem) |
| Shot nav offset | 1rem | var(--spacing-md, 1rem) |
| Text colors | — | Resolved from theme CSS vars via styles.css |
| Heading font | — | var(--font-heading) via Text as='small' |

## Gotchas
- **Scoped widget**: `ProjectShowcase__FlexButtonRepeater` is side-effect imported — registers via `registerScopedWidget()`. Contains colocated `IndexNav` sub-component.
- **FlexButtonRepeater** finds its sibling `<video>` via DOM traversal (`.closest('.project-showcase__video-container')`) — tightly coupled to class name.
- **Frame counter** is created via direct DOM manipulation (`document.createElement('span')`) — not a React component. Updated at 60fps via RAF.
- **Auto-advance**: Video `loop` is disabled by FlexButtonRepeater; it listens to `ended` event and advances to the next shot.
- **Shots support binding expressions**: `props.shots` can be a string (binding) or concrete `ShotConfig[]`. Uses `__repeat` for binding mode.
- **Section height**: Defaults to `'viewport'` (full screen).
- **Video has no aspectRatio**: Intentionally omitted so it fills the entire content area.
- **Border uses currentColor**: The video border inherits the section's text color context.
