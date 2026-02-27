# ContactFooter — Visual Anatomy

## Layout
**Slot: footer**

A two-part footer with navigation links on the left and two info sections (Contact + Studio) on the right, plus a copyright line at the bottom. Responsive: stacks to column on mobile.

```
Desktop:
┌──────────────────────────────────────────────────────┐
│  HOME                GET IN TOUCH     FIND MY STUDIO │
│  ABOUT               hello@ex.com    yourstudio.com  │
│  PROJECTS            linkedin        hello@studio.com│
│                                      linkedin insta  │
│                                                      │
│  __left (__nav)      __right (__section x 2)         │
│                                                      │
│  Copyright (c) Example / All rights reserved         │
└──────────────────────────────────────────────────────┘
     .footer-chrome (max-width: --site-max-width)
```

## Widget Composition
| Element | Widget | Key Props |
|---------|--------|-----------|
| Root footer | Flex | className: footer-chrome, style: --footer-padding-top/bottom |
| Content row | Flex | className: footer-chrome__content |
| Left column (optional) | Flex | className: footer-chrome__left |
| Nav links | Flex | className: footer-chrome__nav |
| Nav link (repeated) | Link | href, children: label |
| Right column | Flex | className: footer-chrome__right |
| Contact section | Flex | className: footer-chrome__section |
| Contact heading | Text | as: h2 |
| Contact email | Link | href: mailto, children: email |
| LinkedIn (conditional) | Link | href: linkedinUrl, children: 'linkedin' |
| Studio section | Flex | className: footer-chrome__section |
| Studio heading | Text | as: h2 |
| Studio URL (conditional) | Link | href: studioUrl, children: studioUrlLabel or studioUrl |
| Studio email (conditional) | Link | href: mailto, children: studioEmail |
| Studio socials (conditional) | Flex | className: footer-chrome__socials |
| Social link (repeated) | Link | href: {{ item.url }}, children: {{ item.platform }} |
| Copyright | Text | as: p, className: footer-chrome__copyright |

## Typography (factory-hardcoded scales)
| Element | Scale | Weight | Extras |
|---------|-------|--------|--------|
| Contact heading | h2 | — | — |
| Studio heading | h2 | — | — |
| Copyright | p | — | — |

## Settings (CMS-configurable via meta.ts)
| Setting | Type | Default | Visual Effect |
|---------|------|---------|---------------|
| paddingTop | range | `2` | Top padding in rem (Spacing group) |
| paddingBottom | range | `5.5` | Bottom padding in rem (Spacing group) |

## Content Fields (from content.ts)
| Field | Type | Required | Sample |
|-------|------|----------|--------|
| navLinks | collection | no | `[{ label: 'HOME', href: '#hero' }, ...]` |
| navLinks[].label | text | yes | `'HOME'` |
| navLinks[].href | text | yes | `'#hero'` |
| contactHeading | text | no | `'GET IN TOUCH'` |
| email | text | yes | `'hello@example.com'` |
| linkedinUrl | text | no | `'https://linkedin.com/in/example'` |
| studioHeading | text | no | `'FIND MY STUDIO'` |
| studioUrl | text | no | `'https://yourstudio.com'` |
| studioUrlLabel | text | no | `'yourstudio.com'` |
| studioEmail | text | no | `'hello@yourstudio.com'` |
| studioSocials | collection | no | `[{ platform: 'linkedin', url: '...' }, ...]` |
| studioSocials[].platform | text | yes | `'linkedin'` |
| studioSocials[].url | text | yes | URL |
| copyright | text | no | `'Copyright (c) Example / All rights reserved'` |

## Provided Actions
None.

## Region Config
- `overlay: false` (not an overlay — renders in-flow)
- `layout.maxWidth: 'var(--site-max-width)'`
- Background handled by CSS `.footer-chrome` using `var(--site-outer-bg)`

## Theme Variable Mapping
| Visual Property | Hardcoded Default | Theme Variable |
|-----------------|-------------------|----------------|
| Footer top padding | `2rem` | `--footer-padding-top` (custom prop) |
| Footer bottom padding | `5.5rem` | `--footer-padding-bottom` (custom prop) |
| Max width | — | `--site-max-width` |
| Background | — | `--site-outer-bg` (via CSS) |

## Gotchas
- ALL Flex widgets have empty `props: {}` — CSS classes handle responsive layout entirely
- Left column is conditional — omitted when `navLinks` is empty/null
- LinkedIn link uses `condition` prop for conditional rendering
- Studio URL and email use `condition` prop for conditional rendering
- Studio socials use `__repeat` with `__key: 'platform'` for binding expansion
- `navLinks` supports both binding expressions (string) and direct arrays
- Padding is set via CSS custom properties on the root widget, not via region layout
- Content field paths in content.ts use `email` but the type uses `contactEmail` — the preset maps between them
