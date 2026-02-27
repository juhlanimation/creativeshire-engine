# ColumnFooter — Visual Anatomy

## Layout
**Slot: footer**

A multi-column footer with an optional animated divider line at the top, a row of content columns (heading + items each), and copyright text at the bottom. Supports staggered reveal animation.

```
┌──────────────────────────────────────────────────────┐
│  ─────────────────────────────────── (line-reveal)   │  ← optional divider
│                                                      │
│  Talk to us       Follow us        Company           │
│  +45 28 56 37 73  Instagram        Studio Name ApS   │
│  hello@studio.com LinkedIn         VAT DK12345678    │
│                   YouTube          Copenhagen, DK    │
│                   Vimeo                              │
│                                                      │
│  .column-footer__columns (flex row)                  │
│                                                      │
│  (c) 2024 Studio. All rights reserved.               │
└──────────────────────────────────────────────────────┘
```

## Widget Composition
| Element | Widget | Key Props |
|---------|--------|-----------|
| Root footer | Flex | className: column-footer |
| Divider (optional) | Box | className: column-footer__divider, data-effect: line-reveal |
| Columns container | Flex | className: column-footer__columns |
| Column (repeated) | Stack | gap: 8, className: column-footer__column |
| Column heading | Text | as: small, className: column-footer__heading |
| Column item (link) | Link | children: label, href |
| Column item (text) | Text | as: small, content: label |
| Copyright | Text | as: small, className: column-footer__copyright |

## Typography (factory-hardcoded scales)
| Element | Scale | Weight | Extras |
|---------|-------|--------|--------|
| Column heading | small | — | Styled via CSS class (muted) |
| Column item (text) | small | — | — |
| Copyright | small | — | — |

## Settings (CMS-configurable via meta.ts)
| Setting | Type | Default | Visual Effect |
|---------|------|---------|---------------|
| showDivider | toggle | `true` | Show/hide the animated divider line at top |
| columnCount | number | `3` | Number of columns (2-5) |
| lastColumnAlign | select | `'end'` | Auto or Push to End — last column alignment (Style group) |

## Content Fields (from content.ts)
| Field | Type | Required | Sample |
|-------|------|----------|--------|
| columns | collection | yes | Array of column objects |
| columns[].heading | text | yes | `'Talk to us'` |
| columns[].items | collection | no | Array of `{ label, href? }` |
| columns[].items[].label | text | yes | `'+45 28 56 37 73'` |
| columns[].items[].href | text | no | `'mailto:hello@studio.com'` |
| copyright | text | no | `'(c) 2024 Studio. All rights reserved.'` |

## Provided Actions
None.

## Region Config
- `overlay: false` (not an overlay — renders in-flow)
- `style` — pass-through from props if provided

## Theme Variable Mapping
| Visual Property | Hardcoded Default | Theme Variable |
|-----------------|-------------------|----------------|
| Column gap | `8` (inline) | — |

## Gotchas
- The divider Box has `data-effect: 'line-reveal'` — this triggers the line-reveal CSS effect animation
- Items are rendered as Link (if `href` is provided) or Text (if no href) — the factory inspects each item
- When `lastColumnAlign` is `'end'`, the last column gets `marginInlineStart: 'auto'` to push it right
- `columns` supports binding expressions for dynamic CMS content
- All Flex widgets have empty `props: {}` — CSS handles responsive layout
- In binding mode, all items render as Link (the template cannot conditionally switch between Link and Text)
- Copyright field defaults to empty in sample content (presumably set by the preset)
