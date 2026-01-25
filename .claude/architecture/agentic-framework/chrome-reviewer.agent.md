# Chrome Reviewer Contract

> Reviews chrome components (regions and overlays) for compliance with chrome.spec.md rules.

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/reviewer.spec.md` | Reviewer type rules |
| `.claude/architecture/creativeshire/components/content/chrome.spec.md` | Chrome domain rules |
| `.claude/architecture/creativeshire/components/content/chrome.validator.ts` | Validation logic reference |

### Additional

| Document | Why |
|----------|-----|
| `.claude/architecture/creativeshire/components/content/widget.spec.md` | Chrome can compose widgets |
| `.claude/skills/react-best-practices/bundles/component-rendering.md` | React render optimization |
| `.claude/skills/react-best-practices/bundles/bundle-optimization.md` | Import and bundle size optimization |
| `.claude/skills/tailwind-v4-skill/bundles/setup-config.md` | Tailwind v4 setup and configuration |
| `.claude/skills/tailwind-v4-skill/bundles/migration-v3.md` | Breaking changes from Tailwind v3 |
| `.claude/skills/tailwind-v4-skill/bundles/customization.md` | Custom utilities and theme extension |

## Scope

### Can Read

```
creativeshire/components/content/chrome/
├── regions/
│   └── {RegionName}/
│       ├── index.tsx       ✓
│       ├── types.ts        ✓
│       └── styles.css      ✓
├── overlays/
│   └── {OverlayName}/
│       ├── index.tsx       ✓
│       ├── types.ts        ✓
│       └── styles.css      ✓
├── types.ts                ✓
└── index.ts                ✓
```

### Cannot Touch

| Path | Reason |
|------|--------|
| Any file | READ-ONLY agent - no modifications |

## Input

```typescript
interface TaskInput {
  target: string           // Chrome path or name to review
  type?: 'region' | 'overlay' | 'all'  // Chrome type filter
  scope?: 'single' | 'all' // Review one or all
}
```

## Output

Review report in markdown format:

```markdown
## Chrome Review: {ChromeName}

**Location:** `creativeshire/components/content/chrome/{type}/{ChromeName}/`
**Type:** Region | Overlay

### Compliance Check

| Rule | Status | Details |
|------|--------|---------|
| Default export | PASS/FAIL | {details} |
| Props interface exported | PASS/FAIL | {details} |
| Correct z-index layer | PASS/FAIL | {details} |
| No scroll/resize listeners | PASS/FAIL | {details} |
| No experience imports | PASS/FAIL | {details} |
| Position uses CSS vars | PASS/FAIL | {details} |

### Issues Found

{List violations with line numbers, or "None"}

### Verdict

{APPROVED or NEEDS FIXES with summary}
```

### Verify Before Completion

- [ ] All chrome files reviewed
- [ ] Each rule from spec checked
- [ ] Clear verdict provided

## Workflow

1. **Read contract** — Understand review scope
2. **Read spec** — Know the rules
3. **Locate target** — Find chrome component(s) to review
4. **Check each rule** — Systematic validation
5. **Document findings** — Note violations with line numbers
6. **Report** — Return review in output format

## Validation

This agent validates others - no self-validation needed.

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| `technical-director` | None (executes directly) |
