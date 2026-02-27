# MinimalNav — Visual Anatomy

## Layout
**Slot: header (overlay)**

A right-aligned navigation bar with nav links, a vertical divider, and a contact email. Supports mix-blend-mode for automatic contrast against varying backgrounds.

```
┌──────────────────────────────────────────────────────┐
│                   Work  About  Contact │ hello@s.com │
│                                                      │
│                   .minimal-nav__links  │ __email     │
│                                    divider           │
│                   ← justify: end →                   │
└──────────────────────────────────────────────────────┘
```

## Widget Composition
| Element | Widget | Key Props |
|---------|--------|-----------|
| Root nav bar | Flex | className: minimal-nav |
| Links container | Flex | className: minimal-nav__links |
| Nav link (repeated) | Link | href, children: label |
| Divider | Box | className: minimal-nav__divider (empty, styled via CSS) |
| Email | Link | href: mailto:{email}, children: email |

## Typography (factory-hardcoded scales)
Typography is handled by CSS classes (`minimal-nav__link`, `minimal-nav__email`), not by Text widget scale props.

## Settings (CMS-configurable via meta.ts)
| Setting | Type | Default | Visual Effect |
|---------|------|---------|---------------|
| blendMode | select | `'normal'` | Normal or Difference — applies mix-blend-mode on the region wrapper (Style group) |

## Content Fields (from content.ts)
| Field | Type | Required | Sample |
|-------|------|----------|--------|
| navLinks | collection | no | `[{ label: 'Work', href: '#work' }, ...]` |
| navLinks[].label | text | yes | `'Work'` |
| navLinks[].href | text | yes | `'#work'` |
| email | text | no | `'hello@studio.com'` |

## Provided Actions
None.

## Region Config
- `overlay: true` — renders as overlay header
- `style: { mixBlendMode }` — only set when blendMode is not 'normal'
- `layout.justify: 'end'`
- `layout.align: 'center'`
- `layout.padding: 'var(--spacing-md, 1.25rem) var(--spacing-lg, 2rem)'`

## Theme Variable Mapping
| Visual Property | Hardcoded Default | Theme Variable |
|-----------------|-------------------|----------------|
| Padding | `1.25rem 2rem` | `--spacing-md`, `--spacing-lg` |

## Gotchas
- All Flex widgets have empty `props: {}` — CSS classes handle layout
- `navLinks` supports both binding expressions (string with `__repeat`) and direct arrays
- The divider is an empty Box — its visual appearance comes entirely from CSS
- `blendMode: 'difference'` is applied to the region `style` (the outer wrapper), not to individual widgets
- Email link automatically prepends `mailto:` to the href
