# Trigger Reviewer Contract

> Reviews trigger hooks for compliance with trigger.spec.md rules.

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/reviewer.spec.md` | Reviewer type rules |
| `.claude/architecture/creativeshire/components/experience/trigger.spec.md` | Trigger domain rules |
| `.claude/architecture/creativeshire/components/experience/trigger.validator.ts` | Validation logic reference |

### Additional

| Document | Why |
|----------|-----|
| `.claude/architecture/creativeshire/components/experience/provider.spec.md` | Store integration rules |
| `.claude/architecture/creativeshire/components/experience/driver.spec.md` | Data flow understanding |
| `.claude/skills/react-best-practices/bundles/component-rendering.md` | react-best-practices optimization |
| `.claude/skills/react-best-practices/bundles/client-runtime.md` | react-best-practices optimization |
| `.claude/skills/react-best-practices/bundles/bundle-optimization.md` | react-best-practices optimization |
| `.claude/skills/react-best-practices/bundles/js-performance.md` | react-best-practices optimization |

## Scope

### Can Read

```
creativeshire/experience/triggers/
├── types.ts                   # TriggerConfig, shared types
├── useScrollProgress.ts       # Scroll 0-1 progress
├── useScrollVelocity.ts       # Scroll speed + direction
├── useIntersection.ts         # Section visibility
├── useResize.ts               # Viewport dimensions
├── useKeyboard.ts             # Key state map
└── useCursor.ts               # Cursor x, y coordinates
```

### Cannot Touch

| Path | Reason |
|------|--------|
| Any file | READ-ONLY agent - no modifications |

## Input

```typescript
interface TaskInput {
  target: string           // Trigger path or name to review
  scope?: 'single' | 'all' // Review one or all triggers
}
```

## Output

Review report in markdown format:

```markdown
## Trigger Review: {TriggerName}

**Location:** `creativeshire/experience/triggers/{filename}.ts`

### Compliance Check

| Rule | Status | Details |
|------|--------|---------|
| Hook name use{Name} | PASS/FAIL | {details} |
| Returns void | PASS/FAIL | {details} |
| Has cleanup function | PASS/FAIL | {details} |
| Passive listeners | PASS/FAIL | {details} |
| SSR guard present | PASS/FAIL | {details} |
| No DOM manipulation | PASS/FAIL | {details} |
| No CSS variable writes | PASS/FAIL | {details} |
| Observer disconnects | PASS/FAIL | {details} |
| No return values | PASS/FAIL | {details} |
| Refs for mutable values | PASS/FAIL | {details} |
| High-frequency throttled | PASS/FAIL | {details} |

### Issues Found

{List violations with line numbers, or "None"}

### Verdict

{APPROVED or NEEDS FIXES with summary}
```

### Verify Before Completion

- [ ] All trigger files reviewed
- [ ] Each rule from spec checked
- [ ] Data flow direction verified (writes to store only)
- [ ] Clear verdict provided

## Workflow

1. **Read contract** - Understand review scope
2. **Read spec** - Know the trigger rules
3. **Locate target** - Find trigger(s) to review
4. **Check each rule** - Systematic validation:
   - Hook naming convention (use{Name})
   - Return type is void
   - useEffect cleanup present
   - Passive listeners for scroll/touch
   - SSR guard (typeof window check)
   - No direct DOM/style manipulation
   - No CSS variable writes
   - Observer cleanup (disconnect)
   - Refs used for mutable handler values
   - Throttling for high-frequency events
5. **Document findings** - Note violations with line numbers
6. **Report** - Return review in output format

## Validation

This agent validates others - no self-validation needed.

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| `technical-director` | None (executes directly) |
