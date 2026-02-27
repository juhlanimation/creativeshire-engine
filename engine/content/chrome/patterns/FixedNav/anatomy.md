# FixedNav — Visual Anatomy

## Layout
**Slot: header (overlay)**

A fixed navigation bar with brand section (logo + site title) on the left and navigation links on the right. Uses CSS classes for responsive layout — Flex widgets intentionally have no direction/align/justify props to avoid overriding CSS.

```
┌──────────────────────────────────────────────────────┐
│  [Logo]  SiteTitle              Work  About  Contact │
│                                                      │
│  .header-chrome__brand          .header-chrome__nav  │
│                                                      │
│  ← justify: between, align: center →                │
│  --header-background / --header-color CSS vars       │
└──────────────────────────────────────────────────────┘
```

## Widget Composition
| Element | Widget | Key Props |
|---------|--------|-----------|
| Root nav bar | Flex | className: header-chrome, style: --header-background, --header-color |
| Brand section | Box | className: header-chrome__brand |
| Logo (optional) | Image | src, alt: '' |
| Site title | Link | href: '/', children: siteTitle, variant: default |
| Nav links container | Flex | className: header-chrome__nav |
| Nav link (repeated) | Link | href, children: label |

## Typography (factory-hardcoded scales)
Typography is handled by CSS classes (`header-chrome__title`, `header-chrome__nav-link`), not by Text widget scale props.

## Settings (CMS-configurable via meta.ts)
| Setting | Type | Default | Visual Effect |
|---------|------|---------|---------------|
| background | color | `'rgba(255, 255, 255, 0.95)'` | Header background color (Style group) |
| color | color | `'#000000'` | Header text color (Style group) |

## Content Fields (from content.ts)
| Field | Type | Required | Sample |
|-------|------|----------|--------|
| siteTitle | text | yes | `'PORT12'` |

Note: `navLinks` and `logo` are passed as props by the preset but are not declared as content fields — they come from the site-level content contract.

## Provided Actions
None.

## Region Config
- `overlay: true` — renders as overlay header (positioned above content)
- `layout.justify: 'between'`
- `layout.align: 'center'`
- `layout.padding: 'var(--spacing-md, 1rem) var(--spacing-lg, 2rem)'`

## Theme Variable Mapping
| Visual Property | Hardcoded Default | Theme Variable |
|-----------------|-------------------|----------------|
| Background | `rgba(255, 255, 255, 0.95)` | `--header-background` (custom prop) |
| Text color | `#000000` | `--header-color` (custom prop) |
| Padding | `1rem 2rem` | `--spacing-md`, `--spacing-lg` |

## Gotchas
- Flex widgets have empty `props: {}` — all layout is handled by CSS classes to avoid inline style conflicts
- Logo is conditional — only renders if `props.logo` is truthy
- Site title is conditional — only renders if `props.siteTitle` is truthy
- The `logo` and `navLinks` fields exist in types.ts but not in content.ts — they're wired at the preset level
