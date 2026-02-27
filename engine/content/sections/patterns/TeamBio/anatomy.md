# TeamBio — Visual Anatomy

## Layout
A grid of team member profile blocks. Each block contains a portrait photo, an accent-colored name, a biography paragraph, and social links (email, LinkedIn). Supports 1 or 2 column grid layout.

```
┌──────────────────────────────────────────────────┐
│  ┌────────────────────┐  ┌────────────────────┐  │
│  │ [Portrait Image]   │  │ [Portrait Image]   │  │
│  │                    │  │                    │  │
│  │ JULIANA MORENO     │  │ ALEX CHEN          │  │
│  │ (accent: #ffd70c)  │  │ (accent: #fba5db)  │  │
│  │                    │  │                    │  │
│  │ Lead animator with │  │ Creative director  │  │
│  │ 12 years of...     │  │ specializing in... │  │
│  │                    │  │                    │  │
│  │ Email  LinkedIn    │  │ Email  LinkedIn    │  │
│  └────────────────────┘  └────────────────────┘  │
│            Grid (1 or 2 columns, gap: 64)        │
└──────────────────────────────────────────────────┘
```

## Widget Composition
| Element | Widget | Key Props |
|---------|--------|-----------|
| Grid container | Grid | columns: 1 or 2, gap: 64 |
| Member block | Stack | gap: 24 |
| Portrait | Image | src, alt (member name) |
| Name | Text | as: h1 or h2 (based on nameScale), style: color (accent) |
| Bio | Text | as: body |
| Social links row | Flex | direction: row, gap: 16 |
| Email link | Link | content: 'Email', href: mailto:{email} |
| LinkedIn link | Link | content: 'LinkedIn', href: {linkedinUrl} |

## Typography (factory-hardcoded scales)
| Element | Scale | Weight | Extras |
|---------|-------|--------|--------|
| Name (xl) | h1 | — | inline color from `accentColor` |
| Name (large) | h2 | — | inline color from `accentColor` |
| Bio | body | — | — |

## Default Styles (from types.ts)
No DEFAULT_*_STYLES object.

## Settings (CMS-configurable via meta.ts)
| Setting | Type | Default | Visual Effect |
|---------|------|---------|---------------|
| columns | select | `'2'` | Single Column or Two Columns grid layout |
| nameScale | select | `'xl'` | Large (h2) or Extra Large (h1) name size (Style group) |

## Content Fields (from content.ts)
| Field | Type | Required | Sample |
|-------|------|----------|--------|
| members | collection | yes | Array of team members |
| members[].name | text | yes | `'JULIANA MORENO'` |
| members[].bio | textarea | yes | `'Lead animator with 12 years...'` |
| members[].imageSrc | image | yes | `/images/team/juliana.webp` |
| members[].overlayImageSrc | image | no | Hover image (declared but not wired) |
| members[].accentColor | text | yes | `'#ffd70c'` |
| members[].email | text | no | `'juliana@studio.com'` |
| members[].linkedinUrl | text | no | `'https://linkedin.com/in/juliana'` |

## Style Override Points
- `style` — merged onto section root via `p.style`
- `className` — applied to section root
- `paddingTop`/`paddingBottom` — defaults to 80
- Each member name gets inline `color` from the member's `accentColor` field
- Grid gap is hardcoded to 64

## Theme Variable Mapping (for extraction)
| Visual Property | Hardcoded Default | Theme Variable |
|-----------------|-------------------|----------------|
| Grid gap | `64` (inline) | — |
| Member stack gap | `24` (inline) | — |
| Links row gap | `16` (inline) | — |
| Section padding | `80` top/bottom | — |

## Gotchas
- The `accentColor` is applied as an inline `style.color` on the name Text widget — it is per-member, not per-section
- `overlayImageSrc` is declared in content fields but NOT used in the factory — it exists for future hover overlay support
- Social links row only renders if at least one of `email` or `linkedinUrl` is provided (concrete mode); binding mode always renders both links
- In binding mode, email links use `{{ item.email }}` directly — the `mailto:` prefix is NOT added (unlike concrete mode which adds `mailto:`)
- `colorMode` defaults to `'dark'`, `constrained` defaults to `true`
- The `columns` setting is a string (`'1'` or `'2'`), converted to Number in the factory
