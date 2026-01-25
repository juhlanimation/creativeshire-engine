# Feature Reviewer Contract

> Reviews feature decorator functions for compliance with feature.spec.md rules.

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/reviewer.spec.md` | Reviewer type rules |
| `.claude/architecture/creativeshire/components/content/feature.spec.md` | Feature domain rules |
| `.claude/architecture/creativeshire/components/content/feature.validator.ts` | Validation logic reference |

### Additional

| Document | Why |
|----------|-----|
| `.claude/architecture/creativeshire/components/content/widget.spec.md` | Features decorate widgets |
| `.claude/architecture/creativeshire/components/content/section.spec.md` | Features decorate sections |
| `.claude/skills/react-best-practices/bundles/component-rendering.md` | react-best-practices optimization |
| `.claude/skills/react-best-practices/bundles/bundle-optimization.md` | react-best-practices optimization |
| `.claude/skills/tailwind-v4-skill/bundles/setup-config.md` | tailwind-v4-skill optimization |
| `.claude/skills/tailwind-v4-skill/bundles/migration-v3.md` | tailwind-v4-skill optimization |
| `.claude/skills/tailwind-v4-skill/bundles/customization.md` | tailwind-v4-skill optimization |

## Scope

### Can Read

```
creativeshire/components/content/features/
├── spacing/
│   └── {FeatureName}.ts   ✓
├── background/
│   └── {FeatureName}.ts   ✓
├── typography/
│   └── {FeatureName}.ts   ✓
├── border/
│   └── {FeatureName}.ts   ✓
├── types.ts               ✓
└── index.ts               ✓
```

### Cannot Touch

| Path | Reason |
|------|--------|
| Any file | READ-ONLY agent - no modifications |

## Input

```typescript
interface TaskInput {
  target: string           // Feature path or name to review
  category?: 'spacing' | 'background' | 'typography' | 'border' | 'all'
  scope?: 'single' | 'all' // Review one or all features
}
```

## Output

Review report in markdown format:

```markdown
## Feature Review: {FeatureName}

**Location:** `creativeshire/components/content/features/{category}/{FeatureName}.ts`
**Category:** Spacing | Background | Typography | Border

### Compliance Check

| Rule | Status | Details |
|------|--------|---------|
| Named export function | PASS/FAIL | {details} |
| Returns FeatureProps | PASS/FAIL | {details} |
| Pure function (no side effects) | PASS/FAIL | {details} |
| Static values only (no runtime) | PASS/FAIL | {details} |
| No viewport units | PASS/FAIL | {details} |
| No CSS variables | PASS/FAIL | {details} |
| Barrel exported | PASS/FAIL | {details} |

### Issues Found

{List violations with line numbers, or "None"}

### Verdict

{APPROVED or NEEDS FIXES with summary}
```

### Verify Before Completion

- [ ] All feature files reviewed
- [ ] Each rule from spec checked
- [ ] Clear verdict provided

## Workflow

1. **Read contract** — Understand review scope
2. **Read spec** — Know the rules
3. **Locate target** — Find feature(s) to review
4. **Check each rule** — Systematic validation
5. **Document findings** — Note violations with line numbers
6. **Report** — Return review in output format

## Validation

This agent validates others - no self-validation needed.

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| `technical-director` | None (executes directly) |
