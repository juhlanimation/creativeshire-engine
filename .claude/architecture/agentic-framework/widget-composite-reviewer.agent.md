# Widget Composite Reviewer Contract

> Reviews widget composite factory functions for compliance with widget-composite.spec.md rules.

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/reviewer.spec.md` | Reviewer type rules |
| `.claude/architecture/creativeshire/components/content/widget-composite.spec.md` | Widget composite domain rules |
| `.claude/architecture/creativeshire/components/content/widget-composite.validator.ts` | Validation logic reference |

### Additional

| Document | Why |
|----------|-----|
| `.claude/architecture/creativeshire/components/content/widget.spec.md` | Base widget rules composites must respect |
| `.claude/skills/react-best-practices/bundles/component-rendering.md` | react-best-practices optimization |
| `.claude/skills/react-best-practices/bundles/js-performance.md` | react-best-practices optimization |
| `.claude/skills/tailwind-v4-skill/bundles/setup-config.md` | tailwind-v4-skill optimization |
| `.claude/skills/tailwind-v4-skill/bundles/migration-v3.md` | tailwind-v4-skill optimization |
| `.claude/skills/tailwind-v4-skill/bundles/customization.md` | tailwind-v4-skill optimization |

## Scope

### Can Read

```
creativeshire/components/content/widgets/composites/
├── {CompositeName}.ts   ✓
├── types.ts             ✓
└── index.ts             ✓
```

### Cannot Touch

| Path | Reason |
|------|--------|
| Any file | READ-ONLY agent - no modifications |

## Input

```typescript
interface TaskInput {
  target: string           // Composite path or name to review
  scope?: 'single' | 'all' // Review one or all composites
}
```

## Output

Review report in markdown format:

```markdown
## Widget Composite Review: {CompositeName}

**Location:** `creativeshire/components/content/widgets/composites/{CompositeName}.ts`

### Compliance Check

| Rule | Status | Details |
|------|--------|---------|
| Named export function | PASS/FAIL | {details} |
| Returns WidgetSchema | PASS/FAIL | {details} |
| Pure function (no side effects) | PASS/FAIL | {details} |
| No JSX/React imports | PASS/FAIL | {details} |
| No async operations | PASS/FAIL | {details} |
| Uses schema types only | PASS/FAIL | {details} |
| Barrel exported | PASS/FAIL | {details} |

### Issues Found

{List violations with line numbers, or "None"}

### Verdict

{APPROVED or NEEDS FIXES with summary}
```

### Verify Before Completion

- [ ] All composite files reviewed
- [ ] Each rule from spec checked
- [ ] Clear verdict provided

## Workflow

1. **Read contract** — Understand review scope
2. **Read spec** — Know the rules
3. **Locate target** — Find composite(s) to review
4. **Check each rule** — Systematic validation
5. **Document findings** — Note violations with line numbers
6. **Report** — Return review in output format

## Validation

This agent validates others - no self-validation needed.

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| `technical-director` | None (executes directly) |
