# CenteredNav — Visual Anatomy

## Layout
**Slot: header (overlay)**

A centered header with a large brand name on top and a row of navigation links below. Clean, symmetrical presentation.

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│                     BRANDNAME                        │
│              Work   About   Contact                  │
│                                                      │
│              ← align: center, column →               │
└──────────────────────────────────────────────────────┘
```

## Widget Composition
| Element | Widget | Key Props |
|---------|--------|-----------|
| Root column | Flex | direction: column, align: center, gap: 0.75rem |
| Brand name | Text | as: span, content: brandName |
| Nav links row | Flex | direction: row, align: center, justify: center, gap: 1.5rem |
| Nav link (repeated via __repeat) | Link | href: {{ item.href }}, children: {{ item.label }} |

## Typography (factory-hardcoded scales)
| Element | Scale | Weight | Extras |
|---------|-------|--------|--------|
| Brand name | span | 700 | textTransform: uppercase, letterSpacing: 0.1em, fontSize: 1.5rem |

Note: Brand name uses inline styles for typography rather than a semantic scale.

## Settings (CMS-configurable via meta.ts)
No settings. This is a zero-configuration pattern.

## Content Fields (from content.ts)
| Field | Type | Required | Sample |
|-------|------|----------|--------|
| brandName | text | no | `'PORT12'` |

Note: `navLinks` is passed as a prop (binding expression) by the preset but not declared as a content field.

## Provided Actions
None.

## Region Config
- `overlay: true`
- `layout.justify: 'center'`
- `layout.align: 'center'`
- `layout.padding: '1.5rem 2rem'`
- `layout.maxWidth: 'var(--site-max-width)'`

## Theme Variable Mapping
| Visual Property | Hardcoded Default | Theme Variable |
|-----------------|-------------------|----------------|
| Max width | — | `--site-max-width` |
| Brand font size | `1.5rem` | — |
| Brand letter spacing | `0.1em` | — |
| Nav gap | `1.5rem` | — |
| Column gap | `0.75rem` | — |

## Gotchas
- Brand name uses inline `style` object (fontWeight, textTransform, letterSpacing, fontSize) — NOT CSS classes
- Nav links use `__repeat` with binding expression — CenteredNav expects a binding string, not a direct array
- If `navLinks` is omitted/null, the nav row is excluded entirely (only brand name shows)
- Unlike FixedNav and MinimalNav, this pattern's Flex widgets DO have explicit direction/gap/align props (not delegated to CSS)
