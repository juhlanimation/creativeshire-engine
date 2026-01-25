# Widget Analyst Contract

> Identifies widget components from external references and creates backlog items.

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/analyst.spec.md` | Analyst type rules |
| `.claude/architecture/creativeshire/components/content/widget.spec.md` | Widget domain rules |

### Additional

| Document | Why |
|----------|-----|
| `.claude/architecture/creativeshire/components/content/widget-composite.spec.md` | Widget composite patterns |
| `.claude/architecture/creativeshire/patterns/common.spec.md` | Established patterns to follow |
| `.claude/architecture/creativeshire/reference/naming.spec.md` | Naming conventions for backlog items |
| `.claude/skills/react-best-practices/bundles/component-rendering.md` | react-best-practices optimization |
| `.claude/skills/tailwind-v4-skill/bundles/setup-config.md` | tailwind-v4-skill optimization |

Add when: identifying composed widget patterns.

## Scope

### Can Read

```
External references (websites, source code)
├── Website URLs (via browser automation)
├── Local source paths
└── Git repositories

Internal knowledge:
├── creativeshire/components/content/widget*      ✓
├── agentic-framework/meta/analyst/               ✓
└── .claude/analysis/widgets.md                   ✓ (read for context)
```

### Can Write

```
.claude/analysis/widgets.md                        ✓ (analysis output)
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
interface WidgetAnalystInput {
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
interface WidgetAnalystOutput {
  domain: 'Widget'
  itemsCreated: number
  items: Array<{
    id: string           // ITEM-Widget-XXX
    title: string
    reference: string
    description: string
    considerations: string[]
  }>
}
```

### Verify Before Completion

- [ ] All items have ITEM-Widget-XXX prefix
- [ ] All items include reference URL/path
- [ ] Builder: widget-builder specified
- [ ] Output written to `.claude/analysis/widgets.md`

## Workflow

1. **Read contract** — Understand scope
2. **Read analyst spec** — Understand output format
3. **Read widget spec** — Understand widget rules
4. **Analyze reference** — Using browser or file system
5. **Identify widgets** — Text, Image, Button, Card, etc.
6. **Create items** — Write to analysis file with proper format
7. **Report** — Return structured output

## Identification Patterns

Look for these widget patterns:

| Pattern | Indicators | Common Names |
|---------|------------|--------------|
| Text | Headings, paragraphs, rich text | Heading, Text, Paragraph |
| Image | Single images, avatars | Image, Avatar, Icon |
| Button | Clickable actions | Button, CTA, Link |
| Card | Contained content blocks | Card, Tile, Panel |
| Badge | Small labels, tags | Badge, Tag, Label |
| Input | Form fields | Input, TextField, Select |
| Video | Embedded video | Video, VideoPlayer |
| Logo | Brand marks | Logo, Brand |

## Validation

Validated by: `.claude/architecture/agentic-framework/meta/analyst/analyst.validator.ts Widget`

| Exit | Meaning | Action |
|------|---------|--------|
| `0` | Pass | Continue |
| `1` | Validator crashed | Report bug |
| `2` | Validation failed | Fix and retry |

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| `/plan analyze` | None (read-only, creates backlog items) |
