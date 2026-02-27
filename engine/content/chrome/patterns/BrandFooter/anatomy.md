# BrandFooter — Visual Anatomy

## Layout
**Slot: footer**

A responsive 3-column footer with nav links on the left, centered brand name + copyright, and contact details on the right. On mobile, columns stack vertically (brand first). CSS handles responsive direction switching.

```
Desktop:
┌──────────────────────────────────────────────────────┐
│  ABOUT              PORT12              info@ex.com  │
│  TEAM                                   00000000     │
│  PRICING        Copyright (c) All       Addr / City  │
│                  rights reserved.                    │
│                                                      │
│  __nav (col)    __brand (center)    __contact (col)  │
│  ← responsive flex, max-width: --site-max-width →   │
└──────────────────────────────────────────────────────┘
```

## Widget Composition
| Element | Widget | Key Props |
|---------|--------|-----------|
| Root footer | Flex | className: brand-footer, style: --footer-padding-top/bottom |
| Nav column (optional) | Flex | direction: column, gap: var(--spacing-xs) |
| Nav link (repeated) | Link | href, children: label |
| Brand column | Flex | direction: column, align: center, gap: var(--spacing-sm) |
| Brand name | Text | as: h2, textTransform: uppercase, fontWeight: 700, letterSpacing: 0.05em |
| Copyright | Text | as: xs, style: opacity 0.6 |
| Contact column | Flex | direction: column, gap: var(--spacing-xs) |
| Email | Link | href: mailto:{email}, children: email |
| Phone (optional) | Link | href: tel:{phone}, children: phoneDisplay or phone |
| Address (optional) | Text | as: xs |

## Typography (factory-hardcoded scales)
| Element | Scale | Weight | Extras |
|---------|-------|--------|--------|
| Brand name | h2 | 700 | textTransform: uppercase, letterSpacing: 0.05em |
| Copyright | xs | — | opacity: 0.6 |
| Address | xs | — | — |

## Settings (CMS-configurable via meta.ts)
| Setting | Type | Default | Visual Effect |
|---------|------|---------|---------------|
| paddingTop | range | `1.5` | Top padding in rem (Spacing group) |
| paddingBottom | range | `3` | Bottom padding in rem (Spacing group) |

## Content Fields (from content.ts)
| Field | Type | Required | Sample |
|-------|------|----------|--------|
| brandName | text | no | `'PORT12'` |
| copyright | text | no | `'Copyright (c) All rights reserved.'` |
| navLinks | collection | no | `[{ href: '#about', label: 'ABOUT' }, ...]` |
| navLinks[].href | text | yes | `'#about'` |
| navLinks[].label | text | yes | `'ABOUT'` |
| email | text | no | `'info@example.com'` |
| phone | text | no | `'+4500000000'` |
| phoneDisplay | text | no | `'00000000'` |
| address | text | no | `'Example Street 1 / City'` |

## Provided Actions
None.

## Region Config
- `overlay: false` (not an overlay — renders in-flow)
- `layout.maxWidth: 'var(--site-max-width)'`

## Theme Variable Mapping
| Visual Property | Hardcoded Default | Theme Variable |
|-----------------|-------------------|----------------|
| Nav gap | `0.25rem` | `--spacing-xs` |
| Brand gap | `0.5rem` | `--spacing-sm` |
| Contact gap | `0.25rem` | `--spacing-xs` |
| Footer top padding | `1.5rem` | `--footer-padding-top` (custom prop) |
| Footer bottom padding | `3rem` | `--footer-padding-bottom` (custom prop) |
| Max width | — | `--site-max-width` |

## Gotchas
- Padding is set via CSS custom properties (`--footer-padding-top`, `--footer-padding-bottom`) as inline styles, NOT via padding props on the region
- The root Flex widget has no direction/align/justify props — CSS `.brand-footer` handles responsive layout switching
- Nav column is conditional — if `navLinks` is empty/null, the entire left column is omitted
- Phone and address are conditional — only render if provided
- `phoneDisplay` provides a formatted display string (e.g., local number format) while `phone` is used for the `tel:` href
- `navLinks` supports binding expressions (string) or direct arrays
