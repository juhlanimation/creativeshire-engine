# Provider Reviewer Contract

> Reviews provider components for compliance with provider.spec.md rules.

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/reviewer.spec.md` | Reviewer type rules |
| `.claude/architecture/creativeshire/components/experience/provider.spec.md` | Provider domain rules |
| `.claude/architecture/creativeshire/components/experience/provider.validator.ts` | Validation logic reference |

### Additional

| Document | Why |
|----------|-----|
| `.claude/architecture/creativeshire/components/experience/driver.spec.md` | Driver lifecycle requirements |
| `.claude/architecture/creativeshire/components/experience/behaviour.spec.md` | BehaviourWrapper context consumption |
| `.claude/skills/react-best-practices/bundles/client-runtime.md` | react-best-practices optimization |
| `.claude/skills/react-best-practices/bundles/bundle-optimization.md` | react-best-practices optimization |

## Scope

### Can Read

```
creativeshire/experience/
├── ExperienceProvider.tsx   ✓
├── DriverProvider.tsx       ✓
├── types.ts                 ✓
└── index.ts                 ✓
```

### Cannot Touch

| Path | Reason |
|------|--------|
| Any file | READ-ONLY agent - no modifications |

## Input

```typescript
interface TaskInput {
  target: string           // Provider path or name to review
  scope?: 'single' | 'all' // Review one or all providers
}
```

## Output

Review report in markdown format:

```markdown
## Provider Review: {ProviderName}

**Location:** `creativeshire/experience/{ProviderName}.tsx`

### Compliance Check

| Rule | Status | Details |
|------|--------|---------|
| Provider exported | PASS/FAIL | {details} |
| Uses createContext | PASS/FAIL | {details} |
| Exports companion hook | PASS/FAIL | {details} |
| Hook throws on missing context | PASS/FAIL | {details} |
| Driver in useEffect (DriverProvider) | PASS/FAIL | {details} |
| Cleanup in useEffect (DriverProvider) | PASS/FAIL | {details} |
| Uses useRef for driver (DriverProvider) | PASS/FAIL | {details} |
| No useState for mode/store | PASS/FAIL | {details} |
| No direct DOM manipulation | PASS/FAIL | {details} |

### Issues Found

{List violations with line numbers, or "None"}

### Verdict

{APPROVED or NEEDS FIXES with summary}
```

### Verify Before Completion

- [ ] All provider files reviewed
- [ ] Each rule from spec checked
- [ ] Provider hierarchy verified (ExperienceProvider wraps DriverProvider)
- [ ] Clear verdict provided

## Workflow

1. **Read contract** — Understand review scope
2. **Read spec** — Know the rules
3. **Locate target** — Find provider(s) to review
4. **Check each rule** — Systematic validation:
   - Export checks (provider function, companion hook)
   - Context checks (createContext, throws on null)
   - Driver lifecycle checks (useEffect, cleanup, useRef)
   - State checks (no useState for mode/store)
   - DOM safety checks (no direct manipulation)
5. **Verify hierarchy** — ExperienceProvider must wrap DriverProvider
6. **Document findings** — Note violations with line numbers
7. **Report** — Return review in output format

## Validation

This agent validates others - no self-validation needed.

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| `technical-director` | None (executes directly) |
