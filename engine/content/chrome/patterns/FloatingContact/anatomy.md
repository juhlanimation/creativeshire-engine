# FloatingContact — Visual Anatomy

## Layout
**Slot: header (overlay)**

A floating contact prompt positioned at the top-right of the viewport. Contains a single EmailCopy widget with a flip animation and copy-to-clipboard functionality. Uses mix-blend-mode for automatic contrast against any background. Has a `hover/reveal` behaviour with configurable hover color.

```
┌──────────────────────────────────────────────────────┐
│                                  Get in touch        │
│                                  hello@studio.com    │
│                                  (hover → flip/copy) │
│                                                      │
│                               ← justify: end,        │
│                                  align: start →      │
│                                  blendMode: difference│
└──────────────────────────────────────────────────────┘
```

## Widget Composition
| Element | Widget | Key Props |
|---------|--------|-----------|
| Contact widget | EmailCopy | label, email, blendMode, hoverColor |

Behaviour attached: `hover/reveal` with `hoverColor` mapped to CSS variable.

## Typography (factory-hardcoded scales)
Typography is handled by the EmailCopy widget internally.

## Settings (CMS-configurable via meta.ts)
| Setting | Type | Default | Visual Effect |
|---------|------|---------|---------------|
| hoverColor | select | `'accent'` | Accent, Interaction, or Primary — color on hover/copy confirmation (Style group) |
| blendMode | select | `'difference'` | Difference or Normal — blend mode for stacking context (Style group) |

## Content Fields (from content.ts)
| Field | Type | Required | Sample |
|-------|------|----------|--------|
| label | text | yes | `'Get in touch'` |
| email | text | yes | `'hello@studio.com'` |

## Provided Actions
None declared in meta. The EmailCopy widget handles copy-to-clipboard internally.

## Region Config
- `overlay: true`
- `layout.justify: 'end'` (right-aligned)
- `layout.align: 'start'` (top-aligned)
- `layout.padding: '1.5rem 2rem'`

## Theme Variable Mapping
| Visual Property | Hardcoded Default | Theme Variable |
|-----------------|-------------------|----------------|
| Hover color (accent) | — | `var(--accent)` |
| Hover color (interaction) | `#9933FF` | `var(--interaction, #9933FF)` |
| Hover color (primary) | — | `var(--text-primary)` |

## Gotchas
- The `hoverColor` setting maps to a CSS variable value via `HOVER_COLOR_CSS` lookup — passed as `options.hoverColor` to the `hover/reveal` behaviour
- `blendMode: 'difference'` makes the text automatically contrast against any background color
- This is one of the simplest chrome patterns — just a single widget with a behaviour
- The region layout (justify: end, align: start) handles positioning — the widget itself does not set position
