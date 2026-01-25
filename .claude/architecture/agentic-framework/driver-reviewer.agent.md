# Driver Reviewer Contract

> Reviews driver components for compliance with driver.spec.md rules.

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/reviewer.spec.md` | Reviewer type rules |
| `.claude/architecture/creativeshire/components/experience/driver.spec.md` | Driver domain rules |
| `.claude/architecture/creativeshire/components/experience/driver.validator.ts` | Validation logic reference |

### Additional

| Document | Why |
|----------|-----|
| `.claude/architecture/creativeshire/components/experience/behaviour.spec.md` | Behaviour integration rules |
| `.claude/architecture/creativeshire/components/experience/provider.spec.md` | Provider lifecycle rules |
| `.claude/skills/react-best-practices/bundles/client-runtime.md` | Client-side events and advanced patterns |
| `.claude/skills/react-best-practices/bundles/js-performance.md` | Pure JavaScript optimization patterns |

## Scope

### Can Read

```
creativeshire/experience/drivers/
├── types.ts              # Driver, Target interfaces
├── ScrollDriver.ts       # Scroll-based driver
├── GSAPDriver.ts         # GSAP ScrollTrigger integration
└── index.ts              # Barrel exports
```

### Cannot Touch

| Path | Reason |
|------|--------|
| Any file | READ-ONLY agent - no modifications |

## Input

```typescript
interface TaskInput {
  target: string           // Driver path or name to review
  scope?: 'single' | 'all' // Review one or all drivers
}
```

## Output

Review report in markdown format:

```markdown
## Driver Review: {DriverName}

**Location:** `creativeshire/experience/drivers/{DriverName}.ts`

### Compliance Check

| Rule | Status | Details |
|------|--------|---------|
| Kebab-case id | PASS/FAIL | {details} |
| Passive scroll listener | PASS/FAIL | {details} |
| Uses Map for targets | PASS/FAIL | {details} |
| Uses requestAnimationFrame | PASS/FAIL | {details} |
| Uses setProperty only | PASS/FAIL | {details} |
| No direct style assignment | PASS/FAIL | {details} |
| Implements destroy | PASS/FAIL | {details} |
| Removes listeners in destroy | PASS/FAIL | {details} |
| Clears Map in destroy | PASS/FAIL | {details} |
| No React state | PASS/FAIL | {details} |
| GSAP cleanup (if applicable) | PASS/FAIL | {details} |

### Issues Found

{List violations with line numbers, or "None"}

### Verdict

{APPROVED or NEEDS FIXES with summary}
```

### Verify Before Completion

- [ ] All driver files reviewed
- [ ] Each rule from spec checked
- [ ] 60fps animation patterns verified
- [ ] Cleanup lifecycle validated
- [ ] Clear verdict provided

## Workflow

1. **Read contract** - Understand review scope
2. **Read spec** - Know the rules (driver.spec.md)
3. **Locate target** - Find driver(s) to review
4. **Check each rule** - Systematic validation:
   - Passive event listeners (`{ passive: true }`)
   - Map-based target storage
   - requestAnimationFrame tick loop
   - setProperty for CSS variables only
   - No direct style.* assignment
   - destroy() cleanup completeness
   - No React state mutations
5. **Document findings** - Note violations with line numbers
6. **Report** - Return review in output format

## Validation

This agent validates others - no self-validation needed.

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| `technical-director` | None (executes directly) |
