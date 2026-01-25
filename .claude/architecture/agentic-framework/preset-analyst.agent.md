# Preset Analyst Contract

> Identifies site composition patterns from external references and creates backlog items.

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/analyst.spec.md` | Analyst type rules |
| `.claude/architecture/creativeshire/components/preset/preset.spec.md` | Preset domain rules |

### Additional

| Document | Why |
|----------|-----|
| `.claude/architecture/creativeshire/layers/preset.spec.md` | Preset layer context |
| `.claude/architecture/creativeshire/components/experience/mode.spec.md` | Mode patterns in presets |

Add when: understanding how experience, chrome, and content combine.

## Scope

### Can Read

```
External references (websites, source code)
├── Website URLs (via browser automation)
├── Local source paths
└── Git repositories

Internal knowledge:
├── creativeshire/components/preset/*             ✓
├── creativeshire/presets/*                       ✓
├── agentic-framework/meta/analyst/               ✓
└── .claude/analysis/preset.md                    ✓ (read for context)
```

### Can Write

```
.claude/analysis/preset.md                         ✓ (analysis output)
```

### Cannot Touch

| Path | Reason |
|------|--------|
| `creativeshire/components/*` | Architecture files |
| `creativeshire/presets/*` | Built by preset-builder |
| `.claude/analysis/*.md` (other domains) | Other analysts' domain |
| Any `.tsx`, `.ts`, `.css` files | Analysts don't write code |

## Input

```typescript
interface PresetAnalystInput {
  reference: {
    type: 'website' | 'source' | 'git'
    url?: string
    path?: string
  }
  analysisPath: string  // Path to .claude/analysis/
}
```

## Output

```typescript
interface PresetAnalystOutput {
  domain: 'Preset'
  itemsCreated: number
  items: Array<{
    id: string           // ITEM-Preset-XXX
    title: string
    reference: string
    description: string
    composition: {
      experience: string[]    // Mode names observed
      chrome: string[]        // Header, footer, etc.
      pageStructure: string[] // Common page patterns
    }
    considerations: string[]
  }>
}
```

### Verify Before Completion

- [ ] All items have ITEM-Preset-XXX prefix
- [ ] All items include reference URL/path
- [ ] Builder: preset-builder specified
- [ ] Composition breakdown included
- [ ] Output written to `.claude/analysis/preset.md`

## Workflow

1. **Read contract** — Understand scope
2. **Read analyst spec** — Understand output format
3. **Read preset spec** — Understand preset structure
4. **Analyze reference** — Overall site structure
5. **Identify composition** — Experience + chrome + content patterns
6. **Create items** — Write to analysis file
7. **Report** — Return structured output

## Identification Patterns

Look for these preset patterns:

| Pattern | Indicators | Preset Type |
|---------|------------|-------------|
| Portfolio | Project gallery, case studies, minimal chrome | `showcase` |
| Landing | Hero, features, CTA, testimonials | `marketing` |
| Blog | Article listings, categories, author pages | `editorial` |
| E-commerce | Product grids, cart, checkout flow | `store` |
| Documentation | Sidebar nav, search, code blocks | `docs` |
| Dashboard | Data tables, charts, forms | `app` |

## Composition Analysis

For each site, identify:

### Experience Layer
| Pattern | What to Look For |
|---------|------------------|
| **Mode** | Dominant animation style (parallax, reveal, minimal) |
| **Scroll behavior** | Smooth scroll, section snapping, infinite scroll |
| **Transitions** | Page transitions, loading states |
| **Interactions** | Hover effects, click feedback |

### Chrome Layer
| Pattern | What to Look For |
|---------|------------------|
| **Header** | Fixed, sticky, transparent, minimal |
| **Footer** | Full, minimal, hidden |
| **Navigation** | Hamburger, sidebar, tabs |
| **Overlays** | Modals, drawers, tooltips |

### Page Structure
| Pattern | What to Look For |
|---------|------------------|
| **Home** | Sections present, order |
| **Inner pages** | Common layouts |
| **Special pages** | 404, loading, empty states |

## Output Format

Write to `.claude/analysis/preset.md`:

```markdown
# Preset Analysis

## Summary

- **Reference:** {url or path}
- **Preset Type:** {showcase, marketing, editorial, etc.}
- **Overall Vibe:** {minimal, bold, playful, corporate, etc.}

## Composition

### Experience

**Primary Mode:** reveal (elements fade in on scroll)

**Observed Effects:**
- Parallax on hero image
- Fade-in on section entry
- Hover lift on cards
- Smooth scroll between sections

**Triggers:**
- Scroll position
- Viewport intersection
- Hover state

### Chrome

**Header:**
- Style: Fixed, transparent over hero, solid on scroll
- Contents: Logo, nav links, CTA button

**Footer:**
- Style: Full footer with columns
- Contents: Links, social, newsletter

**Overlays:**
- Mobile nav drawer
- Image lightbox

### Page Structure

**Home:**
1. Hero (full viewport, CTA)
2. Featured work (3 items)
3. About snippet
4. Testimonials
5. Contact CTA

**Project pages:**
- Hero image
- Project details
- Gallery
- Next/prev navigation

---

### ITEM-Preset-001: Showcase Preset

**Description:** Portfolio-style preset with reveal animations and minimal chrome

**Composition:**
- Experience: reveal mode, parallax hero, fade sections
- Chrome: transparent header, minimal footer
- Pages: home (5 sections), project (detail template)

**Considerations:**
- Header transparency requires dark hero images
- Reveal timing needs tuning per section
- Mobile nav drawer needed

**Builder:** preset-builder
**Dependencies:** ITEM-Experience-001, ITEM-Chrome-001
```

## Validation

Validated by: `.claude/architecture/agentic-framework/meta/analyst/analyst.validator.ts Preset`

| Exit | Meaning | Action |
|------|---------|--------|
| `0` | Pass | Continue |
| `1` | Validator crashed | Report bug |
| `2` | Validation failed | Fix and retry |

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| `/plan analyze` | None (creates analysis items) |
