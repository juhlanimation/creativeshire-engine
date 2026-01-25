# Layout Analyst Contract

> Identifies layout patterns from external references and creates backlog items.

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/analyst.spec.md` | Analyst type rules |
| `.claude/architecture/creativeshire/components/content/widget.spec.md` | Widget (includes layout widgets) rules |

### Additional

| Document | Why |
|----------|-----|
| `.claude/architecture/creativeshire/components/content/section.spec.md` | Section layout context |
| `.claude/architecture/creativeshire/patterns/common.spec.md` | Established patterns to follow |
| `.claude/architecture/creativeshire/reference/naming.spec.md` | Naming conventions for backlog items |
| `.claude/skills/react-best-practices/bundles/component-rendering.md` | react-best-practices optimization |

Add when: layout patterns span multiple sections.

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
└── .claude/analysis/layout.md                    ✓ (read for context)
```

### Can Write

```
.claude/analysis/layout.md                         ✓ (analysis output)
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
interface LayoutAnalystInput {
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
interface LayoutAnalystOutput {
  domain: 'Layout'
  itemsCreated: number
  items: Array<{
    id: string           // ITEM-Layout-XXX
    title: string
    reference: string
    description: string
    considerations: string[]
  }>
}
```

### Verify Before Completion

- [ ] All items have ITEM-Layout-XXX prefix
- [ ] All items include reference URL/path
- [ ] Builder: widget-builder (for layout widgets) specified
- [ ] Output written to `.claude/analysis/layout.md`

## Workflow

1. **Read contract** — Understand scope
2. **Read analyst spec** — Understand output format
3. **Read widget spec** — Layout widgets are a widget category
4. **Analyze reference** — Look at content arrangement
5. **Identify layouts** — Grid, Stack, Split, etc.
6. **Create items** — Write to analysis file with proper format
7. **Report** — Return structured output

## Identification Patterns

Look for these layout patterns:

| Pattern | Indicators | CSS Equivalent |
|---------|------------|----------------|
| Stack | Vertical sequence | flex-direction: column |
| HStack | Horizontal sequence | flex-direction: row |
| Grid | Regular columns/rows | display: grid |
| Masonry | Irregular grid | CSS columns or JS |
| Split | 50/50 or similar | grid-template-columns |
| Sidebar | Main + side content | grid with auto 1fr |
| Container | Centered, max-width | max-width + margin: auto |
| Full Bleed | Edge-to-edge | 100vw techniques |

## Layout Categories

| Category | Examples | Use Case |
|----------|----------|----------|
| **Flow** | Stack, HStack | Sequential content |
| **Grid** | Grid, Masonry | Collections |
| **Split** | SplitView, Sidebar | Dual content |
| **Container** | Container, Wrapper | Content bounds |
| **Responsive** | ResponsiveGrid | Breakpoint-aware |

## Validation

Validated by: `.claude/architecture/agentic-framework/meta/analyst/analyst.validator.ts Layout`

| Exit | Meaning | Action |
|------|---------|--------|
| `0` | Pass | Continue |
| `1` | Validator crashed | Report bug |
| `2` | Validation failed | Fix and retry |

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| `/plan analyze` | None (read-only, creates backlog items) |
