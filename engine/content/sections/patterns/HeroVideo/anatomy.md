# HeroVideo — Visual Anatomy

## Layout
Full-viewport hero section with a looping background video, bottom-aligned intro text and stacked role title headings, plus a scroll indicator at the bottom center.

```
┌──────────────────────────────────────────────┐
│  Video (background, absolute, object-cover)  │
│                                              │
│                                              │
│                                              │
│                                              │
│  I'm Alex Morgan            (intro, body)    │
│  EXECUTIVE PRODUCER         (role, display)  │
│  PRODUCER                   (role, display)  │
│  EDITOR                     (role, display)  │
│                                              │
│              (SCROLL)                        │
│         scroll indicator (small)             │
└──────────────────────────────────────────────┘
     ↑ bottomOffset (% from bottom edge)
```

## Widget Composition
| Element | Widget | Key Props |
|---------|--------|-----------|
| Background video | Video | `src`, `background: true`, `poster?`, `loopStartTime?`, `introVideo?` |
| Content wrapper | Flex | `direction: 'column'`, `align: 'start'`, `justify: 'end'` |
| Intro text | Text | `as: 'body'`, content-bound |
| Roles container | Stack | `gap: 'tight'` |
| Role title (repeated) | Text | `as: 'display'`, repeated per role via `__repeat` or `.map()` |
| Scroll indicator | Text | `as: 'small'`, content-bound |

## Typography (factory-hardcoded scales)
| Element | Scale | Weight | Extras |
|---------|-------|--------|--------|
| Intro text | `body` | 500 | `letterSpacing: '0.025em'` |
| Role titles | `display` | 900 | `lineHeight: 0.95`, `letterSpacing: '0.025em'`, `textTransform: 'uppercase'` |
| Scroll indicator | `small` | 700 | `fontSize: '0.875rem'`, `letterSpacing: '1.4px'` |

## Default Styles (from types.ts)
```typescript
export const DEFAULT_HERO_STYLES: HeroTextStyles = {
  intro: {
    fontWeight: 500,
    letterSpacing: '0.025em',
    color: 'white',
    mixBlendMode: 'difference'
  },
  roleTitle: {
    fontWeight: 900,
    lineHeight: 0.95,
    letterSpacing: '0.025em',
    textTransform: 'uppercase',
    color: 'white',
    mixBlendMode: 'difference'
  },
  scrollIndicator: {
    fontSize: '0.875rem',
    fontWeight: 700,
    letterSpacing: '1.4px',
    color: 'white',
    mixBlendMode: 'difference'
  }
}
```

## Settings (CMS-configurable via meta.ts)
| Setting | Type | Default | Tier | Visual Effect |
|---------|------|---------|------|---------------|
| `loopStartTime` | number | `0` | Advanced | Custom loop point for video (seconds to restart from) |
| `introVideo` | toggle | `false` | Advanced | Gates text visibility with `--intro-complete` CSS variable |
| `bottomOffset` | number | `12` | Layout (visible) | Content distance from bottom edge as % of viewport height (0-50) |

## Content Fields (from content.ts)
| Field | Type | Required | Sample |
|-------|------|----------|--------|
| `introText` | text | Yes | `"I'm Alex Morgan"` |
| `roles` | string-list | Yes | `['EXECUTIVE PRODUCER', 'PRODUCER', 'EDITOR']` |
| `videoSrc` | text | Yes | `'/videos/frontpage/frontpage.webm'` |
| `scrollIndicatorText` | text | No | `'(SCROLL)'` |

## Style Override Points
Preset can override via `styles` prop with three slots:
- `styles.intro` — merged over `DEFAULT_HERO_STYLES.intro`
- `styles.roleTitle` — merged over `DEFAULT_HERO_STYLES.roleTitle`
- `styles.scrollIndicator` — merged over `DEFAULT_HERO_STYLES.scrollIndicator`

Section-level `style` prop is also merged (spreads over `{ maxWidth: 'none', '--hero-bottom-offset': bottomOffset }`).

## Theme Variable Mapping
| Visual Property | Hardcoded Default | Theme Variable |
|-----------------|-------------------|----------------|
| Intro text color | `white` | Override via `styles.intro.color` |
| Role title color | `white` | Override via `styles.roleTitle.color` |
| Scroll indicator color | `white` | Override via `styles.scrollIndicator.color` |
| Heading font | (inherited) | `var(--font-heading)` via Text `as='display'` |
| Bottom offset | `12` (% of vh) | `--hero-bottom-offset` CSS variable on section |

## Gotchas
- All text elements use `mixBlendMode: 'difference'` by default — text auto-inverts against the video.
- `sectionHeight` defaults to `'viewport-fixed'` (locked to viewport height).
- Roles can be either an array of strings or a binding expression; the factory handles both via `isBindingExpression()` — arrays are `.map()`ed, bindings use `__repeat`.
- `bottomOffset` is emitted as `--hero-bottom-offset` CSS custom property on the section `style` object. The actual bottom positioning is handled by CSS consuming this variable.
- Section `maxWidth` is forced to `'none'` (full bleed).
- When `introVideo` is true, the scroll indicator gets `opacity: var(--intro-complete, 1)`.
