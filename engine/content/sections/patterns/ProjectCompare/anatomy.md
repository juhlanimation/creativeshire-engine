# ProjectCompare — Visual Anatomy

## Layout
Full-viewport section with a header (logo + studio/role info), a before/after video comparison widget with a draggable divider, an optional description, and an optional footer contact bar. Designed for showing animation breakdowns (process vs. final result).

```
┌─────────────────────────────────────────────────┐
│ [Logo Image]                 Studio Name (small) │  ← header (Flex row, justify:between)
│                              Role (small)         │
├─────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────┐ │
│ │                    │                         │ │
│ │   BEFORE video     │    AFTER video          │ │  ← VideoCompare (draggable divider)
│ │                    │                         │ │     aspectRatio: 16/9
│ │   [Tie-down]       │    [Final]              │ │     labels in corners
│ │                    │                         │ │
│ └─────────────────────────────────────────────┘ │
│                                                  │
│ Optional description text (body)                 │  ← Text, as: 'body', html: true
│                                                  │
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
| Video frame (optional) | Box | backgroundColor: videoBackground |
| Video compare | ProjectCompare__VideoCompare | beforeSrc, afterSrc, beforeLabel, afterLabel, aspectRatio: '16/9', initialPosition: 0 |
| Content area | Box | className: 'project-frame__content', optional backgroundColor + padding |
| Description | Text | as: 'body', html: true (optional) |
| Footer | ContactBar | links, textColor |

## Typography (factory-hardcoded scales)
| Element | Scale | Weight | Extras |
|---------|-------|--------|--------|
| Studio | small | — | className: 'project-compare__studio' |
| Role | small | — | className: 'project-compare__role' |
| Description | body | — | className: 'project-compare__description', html: true |

## Default Styles (from types.ts)
No DEFAULT_*_STYLES object. Inline styles applied in factory:
- Header: `paddingBottom: 16`
- Logo: `width: props.logo.width ?? 120`
- Content area with contentBackground: `paddingLeft: 16, paddingRight: 16`
- Video frame with videoBackground: `backgroundColor: videoBackground`

## Settings (CMS-configurable via meta.ts)
| Setting | Type | Default | Visual Effect |
|---------|------|---------|---------------|
| videoBackground | color | '' | Background color for the frame container around the video |
| contentBackground | color | '' | Background for the content zone behind video + description |
| descriptionColor | color | '' | Override color for description text |
| textColor | select | 'dark' | Light/dark color scheme for footer ContactBar |

## Content Fields (from content.ts)
| Field | Type | Required | Sample |
|-------|------|----------|--------|
| logo.src | image | yes | /images/.../The21_Logo_Green.webp |
| logo.alt | text | no | 'The 21' |
| logo.width | number | no | 120 |
| studio | text | no | — |
| role | text | no | — |
| beforeVideo | text | yes | /videos/.../seq1-tiedown.webm |
| afterVideo | text | yes | /videos/.../seq1-reel.webm |
| beforeLabel | text | no | 'Tie-down' |
| afterLabel | text | no | 'Final' |
| description | textarea | no | 'The 21 is a short animated film...' |

## Style Override Points
- `style` — merged onto section root
- `className` — appended to section root (always includes 'project-frame', conditionally 'project-compare--full-bleed')
- `videoBackground` — wraps video in a Box with this background color
- `contentBackground` — background color for the content area Box (adds 16px horizontal padding)
- `descriptionColor` — inline color override on description Text
- `descriptionHtml` — set to false to disable HTML parsing (default: true)
- `paddingTop/Bottom/Left/Right` — section-level padding

## Theme Variable Mapping (for extraction)
| Visual Property | Hardcoded Default | Theme Variable |
|-----------------|-------------------|----------------|
| Info gap | 0.25rem | var(--spacing-xs, 0.25rem) |
| Text colors | — | Resolved from theme CSS vars |
| Heading font | — | var(--font-heading) via Text as='small' |

## Gotchas
- **Scoped widget**: `ProjectCompare__VideoCompare` is side-effect imported — registers via `registerScopedWidget()`. Uses GSAP for snap-back animation on mouse leave.
- **VideoCompare uses GSAP**: `gsap.to()` animates the divider position back to 0% when the mouse leaves. Direct DOM manipulation via refs for 60fps performance.
- **Clip-path math**: The "before" video clip wrapper has `inset: -0.75%` (101.5% of container) for anti-flicker. The factory converts container-relative position to wrapper-relative clip position using `(pos + 0.75) / 1.015`.
- **Video sync**: The two videos are synced via `timeupdate` events — if drift exceeds 0.1s, the "after" video's `currentTime` is corrected.
- **Keyboard accessible**: Divider supports ArrowLeft/ArrowRight for 5% increments. Has `role="slider"` with aria attributes.
- **Section height**: Defaults to `'viewport'` (full screen).
- **Full-bleed mode**: When `contentBackground` is set, className includes `'project-compare--full-bleed'`.
- **Conditional elements**: Studio and role Text widgets are only added if their props are truthy. Info container only added if either exists.
- **Header matches ProjectShowcase**: Same Flex row layout with logo left, info right.
