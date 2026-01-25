# Behaviour Reviewer Contract

> Reviews behaviour components for compliance with behaviour.spec.md rules.

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/reviewer.spec.md` | Reviewer type rules |
| `.claude/architecture/creativeshire/components/experience/behaviour.spec.md` | Behaviour domain rules |
| `.claude/architecture/creativeshire/components/experience/behaviour.validator.ts` | Validation logic reference |

### Additional

| Document | Why |
|----------|-----|
| `.claude/architecture/creativeshire/components/experience/driver.spec.md` | Driver integration rules |
| `.claude/architecture/creativeshire/components/experience/trigger.spec.md` | Trigger state dependencies |
| `.claude/skills/react-best-practices/bundles/js-performance.md` | Pure JavaScript optimization patterns |

## Scope

### Can Read

```
creativeshire/experience/behaviours/
├── types.ts              ✓
├── registry.ts           ✓
├── resolve.ts            ✓
├── BehaviourWrapper.tsx  ✓
├── {behaviour-name}/
│   └── index.ts          ✓
```

### Cannot Touch

| Path | Reason |
|------|--------|
| Any file | READ-ONLY agent - no modifications |

## Input

```typescript
interface TaskInput {
  target: string           // Behaviour path or name to review
  scope?: 'single' | 'all' // Review one or all behaviours
}
```

## Output

Review report in markdown format:

```markdown
## Behaviour Review: {BehaviourName}

**Location:** `creativeshire/experience/behaviours/{behaviour-name}/`

### Compliance Check

| Rule | Status | Details |
|------|--------|---------|
| Default export | PASS/FAIL | {details} |
| Behaviour id kebab-case | PASS/FAIL | {details} |
| Requires array defined | PASS/FAIL | {details} |
| Compute returns CSSVariables | PASS/FAIL | {details} |
| CSS keys --prefixed | PASS/FAIL | {details} |
| cssTemplate has var() fallbacks | PASS/FAIL | {details} |
| cssTemplate has will-change | PASS/FAIL | {details} |
| No DOM manipulation | PASS/FAIL | {details} |
| No React state in compute | PASS/FAIL | {details} |
| Options have defaults | PASS/FAIL | {details} |

### Infrastructure Check (if applicable)

| Rule | Status | Details |
|------|--------|---------|
| Registry uses import.meta.glob | PASS/FAIL | {details} |
| BehaviourWrapper returns cleanup | PASS/FAIL | {details} |

### Issues Found

{List violations with line numbers, or "None"}

### Verdict

{APPROVED or NEEDS FIXES with summary}
```

### Verify Before Completion

- [ ] All behaviour files reviewed
- [ ] Each rule from spec checked
- [ ] Clear verdict provided

## Workflow

1. **Read contract** - Understand review scope
2. **Read spec** - Know the rules from behaviour.spec.md
3. **Locate target** - Find behaviour(s) to review
4. **Check each rule** - Systematic validation:
   - Default export exists
   - `id` is kebab-case and unique
   - `requires` array lists all state dependencies
   - `compute` returns only `--prefixed` keys
   - `compute` is pure (no DOM, no React state, no async)
   - `cssTemplate` uses `var(--x, fallback)` for all variables
   - `cssTemplate` includes `will-change` for animated properties
   - Options have defaults if defined
5. **Check infrastructure** - If reviewing registry.ts or BehaviourWrapper.tsx:
   - Registry uses `import.meta.glob` with eager loading
   - Wrapper returns cleanup function from useEffect
6. **Document findings** - Note violations with line numbers
7. **Report** - Return review in output format

## Validation

This agent validates others - no self-validation needed.

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| `technical-director` | None (executes directly) |
