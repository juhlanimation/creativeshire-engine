# HeroTitle — Visual Anatomy

## Layout
Full-viewport hero section with a looping background video, centered title + optional tagline, and a scroll indicator pinned to the bottom center.

```
┌──────────────────────────────────────────────┐
│  Video (background, absolute, object-cover)  │
│                                              │
│         ┌──────────────────────┐             │
│         │     TITLE TEXT       │ Flex        │
│         │  (display, cqw-     │ direction:  │
│         │   scaled, centered) │ column      │
│         │                     │ align:      │
│         │     tagline text    │ center      │
│         │  (h3, uppercase)    │ justify:    │
│         └──────────────────────┘ center     │
│                                              │
│              (SCROLL)                        │
│         scroll indicator (small)             │
└──────────────────────────────────────────────┘
```

## Widget Composition
| Element | Widget | Key Props |
|---------|--------|-----------|
| Background video | Video | `src`, `background: true`, `poster?`, `loopStartTime?`, `introVideo?` |
| Content wrapper | Flex | `direction: 'column'`, `align: 'center'`, `justify: 'center'` |
| Title | Text | `as: 'display'`, content-bound |
| Tagline (optional) | Text | `as: 'h3'`, only rendered if `tagline` is truthy |
| Scroll indicator | Text | `as: 'small'`, content-bound |

## Typography (factory-hardcoded scales)
| Element | Scale | Weight | Extras |
|---------|-------|--------|--------|
| Title | `display` | 700 | `letterSpacing: '0.05em'`, `textTransform: 'uppercase'`, `lineHeight: 1`, `fontSize: {multiplier * 5}cqw` |
| Tagline | `h3` | 400 | `letterSpacing: '0.3em'`, `textTransform: 'uppercase'`, `marginTop: 'var(--spacing-md, 1rem)'` |
| Scroll indicator | `small` | 700 | `letterSpacing: '1.4px'` |

## Default Styles (from types.ts)
```typescript
export const DEFAULT_HERO_TITLE_STYLES: HeroTitleStyles = {
  title: {
    fontWeight: 700,
    lineHeight: 1,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    textAlign: 'center',
    color: 'white',
    mixBlendMode: 'difference'
  },
  tagline: {
    fontWeight: 400,
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    marginTop: 'var(--spacing-md, 1rem)',
    color: 'white',
    mixBlendMode: 'difference'
  },
  scrollIndicator: {
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
| `titleSizeMultiplier` | number (via `textSizeMultiplierSetting`) | `4` | Advanced | Multiplier applied to `5cqw` base = final title `fontSize` |

## Content Fields (from content.ts)
| Field | Type | Required | Sample |
|-------|------|----------|--------|
| `title` | text | Yes | `'PORT12'` |
| `tagline` | text | No | `'DRØM • DEL • SKAB'` |
| `videoSrc` | text | Yes | `'/videos/port-12/showreel.webm'` |
| `loopStartTime` | number | No | `3.4` |
| `scrollIndicatorText` | text | No | `'(SCROLL)'` |

## Style Override Points
Preset can override via `styles` prop with three slots:
- `styles.title` — merged over `DEFAULT_HERO_TITLE_STYLES.title`
- `styles.tagline` — merged over `DEFAULT_HERO_TITLE_STYLES.tagline`
- `styles.scrollIndicator` — merged over `DEFAULT_HERO_TITLE_STYLES.scrollIndicator`

Section-level `style` prop is also merged (spreads over `{ maxWidth: 'none' }`).

## Theme Variable Mapping
| Visual Property | Hardcoded Default | Theme Variable |
|-----------------|-------------------|----------------|
| Title color | `white` | Override via `styles.title.color` |
| Tagline color | `white` | Override via `styles.tagline.color` |
| Scroll indicator color | `white` | Override via `styles.scrollIndicator.color` |
| Tagline margin-top | `1rem` fallback | `var(--spacing-md)` |
| Heading font | (inherited) | `var(--font-heading)` via Text `as='display'` |
| Title font size | computed | `{titleSizeMultiplier * 5}cqw` (container-query units) |

## Gotchas
- Title uses `cqw` units (`titleSizeMultiplier * 5cqw`) so it scales with the site container width, preventing overflow clipping.
- All text elements use `mixBlendMode: 'difference'` by default — text auto-inverts against the video background.
- `sectionHeight` defaults to `'viewport-fixed'` (not `'auto'`), locking the section to viewport height.
- When `introVideo` is true, text and scroll indicator get `opacity: var(--intro-complete, 1)` — invisible until intro timing system signals completion.
- The Flex content wrapper has `style: { top: 0, paddingBottom: 0 }`, positioning it within the viewport-fixed section.
- Section `maxWidth` is forced to `'none'` (full bleed).
