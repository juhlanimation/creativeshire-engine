# Chrome Analyst Contract

> Identifies persistent UI elements from external references and creates backlog items.

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/analyst.spec.md` | Analyst type rules |
| `.claude/architecture/creativeshire/components/content/chrome.spec.md` | Chrome domain rules |

### Additional

| Document | Why |
|----------|-----|
| `.claude/architecture/creativeshire/components/experience/behaviour.spec.md` | Chrome animation patterns |
| `.claude/architecture/creativeshire/patterns/common.spec.md` | Established patterns to follow |
| `.claude/architecture/creativeshire/reference/naming.spec.md` | Naming conventions for backlog items |
| `.claude/skills/react-best-practices/bundles/component-rendering.md` | react-best-practices optimization |
| `.claude/skills/tailwind-v4-skill/bundles/setup-config.md` | tailwind-v4-skill optimization |

Add when: chrome has scroll-aware behaviors.

## Scope

### Can Read

```
External references (websites, source code)
├── Website URLs (via browser automation)
├── Local source paths
└── Git repositories

Internal knowledge:
├── creativeshire/components/content/chrome*      ✓
├── agentic-framework/meta/analyst/               ✓
└── .claude/analysis/chrome.md                    ✓ (read for context)
```

### Can Write

```
.claude/analysis/chrome.md                         ✓ (analysis output)
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
interface ChromeAnalystInput {
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
interface ChromeAnalystOutput {
  domain: 'Chrome'
  itemsCreated: number
  items: Array<{
    id: string           // ITEM-Chrome-XXX
    title: string
    reference: string
    description: string
    considerations: string[]
  }>
}
```

### Verify Before Completion

- [ ] All items have ITEM-Chrome-XXX prefix
- [ ] All items include reference URL/path
- [ ] Builder: chrome-builder specified
- [ ] Output written to `.claude/analysis/chrome.md`

## Workflow

1. **Read contract** — Understand scope
2. **Read analyst spec** — Understand output format
3. **Read chrome spec** — Understand chrome rules
4. **Analyze reference** — Look at edges of viewport
5. **Identify chrome** — Header, footer, nav, modals
6. **Create items** — Write to analysis file with proper format
7. **Report** — Return structured output

## Identification Patterns

Look for these chrome patterns:

| Pattern | Location | Indicators |
|---------|----------|------------|
| Header | Top | Logo, navigation, fixed/sticky |
| Footer | Bottom | Links, copyright, social |
| Navigation | Top/Side | Menu items, hamburger |
| Sidebar | Left/Right | Secondary nav, filters |
| Modal | Overlay | Centered dialog, backdrop |
| Toast | Corner | Notifications, alerts |
| Cursor | Follows mouse | Custom cursor |
| Loader | Center/Full | Loading indicator |

## Chrome Categories

| Category | Examples |
|----------|----------|
| **Regions** | Header, Footer, Sidebar |
| **Overlays** | Modal, Toast, Tooltip |
| **Cursors** | Custom cursor, Trail |
| **Loaders** | Spinner, Progress |

## Validation

Validated by: `.claude/architecture/agentic-framework/meta/analyst/analyst.validator.ts Chrome`

| Exit | Meaning | Action |
|------|---------|--------|
| `0` | Pass | Continue |
| `1` | Validator crashed | Report bug |
| `2` | Validation failed | Fix and retry |

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| `/plan analyze` | None (read-only, creates backlog items) |
