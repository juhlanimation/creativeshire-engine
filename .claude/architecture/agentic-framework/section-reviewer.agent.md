# Section Reviewer Contract

> Reviews section components for compliance with section.spec.md rules.

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/reviewer.spec.md` | Reviewer type rules |
| `.claude/architecture/creativeshire/components/content/section.spec.md` | Section domain rules |
| `.claude/architecture/creativeshire/components/content/section.validator.ts` | Validation logic reference |

### Additional

| Document | Why |
|----------|-----|
| `.claude/architecture/creativeshire/components/content/widget.spec.md` | Widget composition rules |
| `.claude/architecture/creativeshire/components/content/feature.spec.md` | Feature integration rules |
| `.claude/skills/react-best-practices/bundles/component-rendering.md` | react-best-practices optimization |
| `.claude/skills/react-best-practices/bundles/server-components.md` | react-best-practices optimization |
| `.claude/skills/react-best-practices/bundles/bundle-optimization.md` | react-best-practices optimization |
| `.claude/skills/tailwind-v4-skill/bundles/setup-config.md` | tailwind-v4-skill optimization |
| `.claude/skills/tailwind-v4-skill/bundles/migration-v3.md` | tailwind-v4-skill optimization |
| `.claude/skills/tailwind-v4-skill/bundles/customization.md` | tailwind-v4-skill optimization |

## Scope

### Can Read

```
creativeshire/components/content/sections/
├── {SectionName}/
│   ├── index.tsx       ✓
│   ├── types.ts        ✓
│   └── styles.css      ✓
├── types.ts            ✓
└── index.ts            ✓
```

### Cannot Touch

| Path | Reason |
|------|--------|
| Any file | READ-ONLY agent - no modifications |

## Input

```typescript
interface TaskInput {
  target: string           // Section path or name to review
  scope?: 'single' | 'all' // Review one or all sections
}
```

## Output

Review report in markdown format:

```markdown
## Section Review: {SectionName}

**Location:** `creativeshire/components/content/sections/{SectionName}/`

### Compliance Check

| Rule | Status | Details |
|------|--------|---------|
| Default export | PASS/FAIL | {details} |
| Props interface exported | PASS/FAIL | {details} |
| Semantic HTML container | PASS/FAIL | {details} |
| No scroll/resize listeners | PASS/FAIL | {details} |
| No position fixed/sticky | PASS/FAIL | {details} |
| No experience imports | PASS/FAIL | {details} |

### Issues Found

{List violations with line numbers, or "None"}

### Verdict

{APPROVED or NEEDS FIXES with summary}
```

### Verify Before Completion

- [ ] All section files reviewed
- [ ] Each rule from spec checked
- [ ] Clear verdict provided

## Workflow

1. **Read contract** — Understand review scope
2. **Read spec** — Know the rules
3. **Locate target** — Find section(s) to review
4. **Check each rule** — Systematic validation
5. **Document findings** — Note violations with line numbers
6. **Report** — Return review in output format

## Validation

This agent validates others - no self-validation needed.

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| `technical-director` | None (executes directly) |
