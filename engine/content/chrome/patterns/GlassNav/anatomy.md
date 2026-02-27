# GlassNav — Visual Anatomy

## Layout
**Slot: header (overlay)**

A fixed transparent header that transitions to a frosted glass effect on scroll. Uses `data-effect="glass"` and a `scroll/glass` behaviour to animate the backdrop blur and background opacity. Can be forced opaque for non-hero pages.

```
┌──────────────────────────────────────────────────────┐
│  [Logo Image]                   Link  Link  Link     │
│                                                      │
│  .glass-nav__brand              .glass-nav__links    │
│                                                      │
│  data-effect="glass"                                 │
│  --glass-opacity / --glass-blur CSS vars (scroll)    │
│  ← justify: between, align: center →                │
└──────────────────────────────────────────────────────┘
```

## Widget Composition
| Element | Widget | Key Props |
|---------|--------|-----------|
| Root nav bar | Flex | className: glass-nav, data-effect: glass, style: CSS custom props |
| Brand section | Box | className: glass-nav__brand |
| Logo (optional) | Image | src, alt |
| Links container | Flex | className: glass-nav__links |
| Nav link (repeated) | Link | href, children: label |

## Typography (factory-hardcoded scales)
Typography is handled by CSS classes (`glass-nav__link`, `glass-nav__logo`), not by Text widget scale props.

## Settings (CMS-configurable via meta.ts)
| Setting | Type | Default | Visual Effect |
|---------|------|---------|---------------|
| scrollThreshold | number | `50` | Scroll distance (px) to fully activate glass effect (Advanced) |
| blurStrength | number | `12` | Blur strength in pixels (Hidden/preset-only) |
| glassBgOpacity | number | `0.85` | Background opacity at full glass state (Hidden/preset-only) |
| forceOpaque | toggle | `false` | Skip scroll animation — show full glass immediately (Hidden/preset-only) |

## Content Fields (from content.ts)
| Field | Type | Required | Sample |
|-------|------|----------|--------|
| logoSrc | image | no | SVG data URI |
| logoAlt | text | no | `'Studio Logo'` |

Note: `navLinks` are passed as a direct array prop by the preset (not declared as a content field).

## Provided Actions
None.

## Region Config
- `overlay: true` (default, overridable via `props.overlay`)
- `layout.justify: 'between'`
- `layout.align: 'center'`
- `layout.padding: 'var(--spacing-md, 1rem) var(--spacing-lg, 2rem)'`
- Supports `layout` override via props

## Theme Variable Mapping
| Visual Property | Hardcoded Default | Theme Variable |
|-----------------|-------------------|----------------|
| Padding | `1rem 2rem` | `--spacing-md`, `--spacing-lg` |
| Glass opacity | `0.85` | `--glass-opacity` (set inline when forceOpaque) |
| Glass blur | `12px` | `--glass-blur` (set inline when forceOpaque) |

## Gotchas
- The `data-effect="glass"` attribute is set directly on the root Flex widget — this is what the glass CSS effect file targets
- `forceOpaque` mode sets `--glass-opacity` and `--glass-blur` as inline styles immediately, bypassing scroll animation
- When NOT forceOpaque, the CSS custom properties are controlled by the `scroll/glass` behaviour at runtime
- All Flex widgets have empty `props: {}` — CSS handles layout (same pattern as FixedNav/MinimalNav)
- `navLinks` defaults to empty array `[]` if not provided — logo-only mode is valid
- The region `style` prop is passed through if provided (for preset-level styling)
- `logoSrc` and `logoAlt` support binding expressions (factory uses `??` with binding defaults)
