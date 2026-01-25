# Section Analyst Contract

> Identifies section patterns from external references and creates backlog items.

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/analyst.spec.md` | Analyst type rules |
| `.claude/architecture/creativeshire/components/content/section.spec.md` | Section domain rules |

### Additional

| Document | Why |
|----------|-----|
| `.claude/architecture/creativeshire/components/content/section-composite.spec.md` | Section composite patterns |
| `.claude/architecture/creativeshire/patterns/common.spec.md` | Established patterns to follow |
| `.claude/architecture/creativeshire/reference/naming.spec.md` | Naming conventions for backlog items |
| `.claude/skills/react-best-practices/bundles/component-rendering.md` | react-best-practices optimization |
| `.claude/skills/tailwind-v4-skill/bundles/setup-config.md` | tailwind-v4-skill optimization |

Add when: identifying Hero, Gallery, CTA section composites.

## Scope

### Can Read

```
External references (websites, source code)
├── Website URLs (via browser automation)
├── Local source paths
└── Git repositories

Internal knowledge:
├── creativeshire/components/content/section*     ✓
├── agentic-framework/meta/analyst/               ✓
└── .claude/analysis/sections.md                  ✓ (read for context)
```

### Can Write

```
.claude/analysis/sections.md                       ✓ (analysis output)
```

### Cannot Touch

| Path | Reason |
|------|--------|
| `creativeshire/components/*` | Architecture files |
| `creativeshire/experience/*` | Different layer |
| `.claude/analysis/*.md` (other domains) | Other analysts' domain |
| Any `.tsx`, `.ts`, `.css` files | Analysts don't write code |

## Input

```typescript
interface SectionAnalystInput {
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
interface SectionAnalystOutput {
  domain: 'Section'
  itemsCreated: number
  items: Array<{
    id: string           // ITEM-Section-XXX
    title: string
    reference: string
    description: string
    considerations: string[]
  }>
}
```

### Verify Before Completion

- [ ] All items have ITEM-Section-XXX prefix
- [ ] All items include reference URL/path
- [ ] Builder: section-composite-builder specified
- [ ] Output written to `.claude/analysis/sections.md`

## Workflow

1. **Read contract** — Understand scope
2. **Read analyst spec** — Understand output format
3. **Read section spec** — Understand what sections are
4. **Analyze reference** — Using browser or file system
5. **Identify sections** — Hero, Gallery, CTA, etc.
6. **Create items** — Write to analysis file with proper format
7. **Report** — Return structured output

## Identification Patterns

Look for these section patterns:

| Pattern | Indicators | Common Names |
|---------|------------|--------------|
| Hero | Full viewport, prominent heading, CTA | Hero, Banner, Intro |
| Gallery | Grid/carousel of images or projects | Portfolio, Gallery, Showcase |
| CTA | Action focus, prominent button | CallToAction, Signup, Contact |
| Features | Grid of feature cards | Features, Benefits, Services |
| Testimonials | Quotes, avatars | Testimonials, Reviews |
| Team | Person cards | Team, About, People |
| Pricing | Pricing tables/cards | Pricing, Plans |
| FAQ | Accordion or Q&A list | FAQ, Questions |

## Validation

Validated by: `.claude/architecture/agentic-framework/meta/analyst/analyst.validator.ts Section`

| Exit | Meaning | Action |
|------|---------|--------|
| `0` | Pass | Continue |
| `1` | Validator crashed | Report bug |
| `2` | Validation failed | Fix and retry |

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| `/plan analyze` | None (read-only, creates backlog items) |
