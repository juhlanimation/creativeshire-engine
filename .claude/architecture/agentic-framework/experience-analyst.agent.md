# Experience Analyst Contract

> Identifies animation and interaction patterns from external references and creates backlog items.

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/analyst.spec.md` | Analyst type rules |
| `.claude/architecture/creativeshire/components/experience/behaviour.spec.md` | Behaviour domain rules |

### Additional

| Document | Why |
|----------|-----|
| `.claude/architecture/creativeshire/components/experience/driver.spec.md` | Driver patterns |
| `.claude/architecture/creativeshire/components/experience/trigger.spec.md` | Trigger patterns |
| `.claude/architecture/creativeshire/patterns/common.spec.md` | Established patterns to follow |
| `.claude/architecture/creativeshire/reference/naming.spec.md` | Naming conventions for backlog items |
| `.claude/skills/react-best-practices/bundles/client-runtime.md` | react-best-practices optimization |
| `.claude/skills/react-best-practices/bundles/js-performance.md` | react-best-practices optimization |

Add when: identifying complete experience flows.

## Scope

### Can Read

```
External references (websites, source code)
├── Website URLs (via browser automation)
├── Local source paths
└── Git repositories

Internal knowledge:
├── creativeshire/components/experience/*         ✓
├── agentic-framework/meta/analyst/               ✓
└── .claude/analysis/experience.md                ✓ (read for context)
```

### Can Write

```
.claude/analysis/experience.md                     ✓ (analysis output)
```

### Cannot Touch

| Path | Reason |
|------|--------|
| `creativeshire/components/*` | Architecture files |
| `creativeshire/components/content/*` | Different layer |
| `.claude/analysis/*.md` (other domains) | Other analysts' domain |
| Any `.tsx`, `.ts`, `.css` files | Analysts don't write code |

## Input

```typescript
interface ExperienceAnalystInput {
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
interface ExperienceAnalystOutput {
  domain: 'Experience'
  itemsCreated: number
  items: Array<{
    id: string           // ITEM-Experience-XXX
    title: string
    reference: string
    description: string
    considerations: string[]
  }>
}
```

### Verify Before Completion

- [ ] All items have ITEM-Experience-XXX prefix
- [ ] All items include reference URL/path
- [ ] Builder: behaviour-builder or driver-builder specified
- [ ] Output written to `.claude/analysis/experience.md`

## Workflow

1. **Read contract** — Understand scope
2. **Read analyst spec** — Understand output format
3. **Read behaviour/driver specs** — Understand experience rules
4. **Analyze reference** — Scroll page, hover elements, observe
5. **Identify effects** — Parallax, fade, reveal, etc.
6. **Create items** — Write to analysis file with proper format
7. **Report** — Return structured output

## Identification Patterns

Look for these experience patterns:

| Pattern | Indicators | CSS Properties |
|---------|------------|----------------|
| Parallax | Layers moving at different speeds | translateY |
| Fade | Opacity changes on scroll/hover | opacity |
| Reveal | Elements appearing on scroll | translateY + opacity |
| Sticky | Elements pinning during scroll | position: sticky |
| Cursor Follow | Elements tracking cursor | translateX/Y |
| Hover Effects | State changes on hover | opacity, scale |
| Scroll Progress | Progress indicators | scaleX |
| View Transition | Page/section transitions | opacity, translateX |

## Analysis Techniques

For website analysis:
1. **Scroll slowly** — Observe what animates
2. **Hover elements** — Check for hover states
3. **Note triggers** — Scroll position, viewport entry, hover
4. **Identify CSS properties** — translateY, opacity, scale

## Validation

Validated by: `.claude/architecture/agentic-framework/meta/analyst/analyst.validator.ts Experience`

| Exit | Meaning | Action |
|------|---------|--------|
| `0` | Pass | Continue |
| `1` | Validator crashed | Report bug |
| `2` | Validation failed | Fix and retry |

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| `/plan analyze` | None (read-only, creates backlog items) |
