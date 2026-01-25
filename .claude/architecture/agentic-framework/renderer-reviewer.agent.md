# Renderer Reviewer Contract

> Reviews renderer components for compliance with renderer.spec.md rules.

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/reviewer.spec.md` | Reviewer type rules |
| `.claude/architecture/creativeshire/components/renderer/renderer.spec.md` | Renderer domain rules |
| `.claude/architecture/creativeshire/components/renderer/renderer.validator.ts` | Validation logic reference |

### Additional

| Document | Why |
|----------|-----|
| `.claude/architecture/creativeshire/components/experience/behaviour.spec.md` | Behaviour resolution pattern |
| `.claude/architecture/creativeshire/layers/renderer.spec.md` | Renderer layer overview |
| `.claude/skills/react-best-practices/bundles/server-components.md` | react-best-practices optimization |

## Scope

### Can Read

```
creativeshire/renderer/
├── SiteRenderer.tsx        ✓
├── PageRenderer.tsx        ✓
├── SectionRenderer.tsx     ✓
├── WidgetRenderer.tsx      ✓
├── ChromeRenderer.tsx      ✓
├── ErrorBoundary.tsx       ✓
└── types.ts                ✓
```

### Cannot Touch

| Path | Reason |
|------|--------|
| Any file | READ-ONLY agent - no modifications |

## Input

```typescript
interface TaskInput {
  target: string           // Renderer file path or name to review
  scope?: 'single' | 'all' // Review one or all renderers
}
```

## Output

Review report in markdown format:

```markdown
## Renderer Review: {RendererName}

**Location:** `creativeshire/renderer/{RendererName}.tsx`

### Compliance Check

| Rule | Status | Details |
|------|--------|---------|
| Uses registry lookup | PASS/FAIL | {details} |
| Has ErrorBoundary wrapping | PASS/FAIL | {details} |
| Has fallback for unknown types | PASS/FAIL | {details} |
| Calls resolveBehaviour | PASS/FAIL | {details} |
| No inline animation logic | PASS/FAIL | {details} |
| No CSS variable manipulation | PASS/FAIL | {details} |
| Uses useFeatures hook | PASS/FAIL | {details} |

### Issues Found

{List violations with line numbers, or "None"}

### Verdict

{APPROVED or NEEDS FIXES with summary}
```

### Verify Before Completion

- [ ] All renderer files reviewed
- [ ] Each rule from spec checked
- [ ] Clear verdict provided

## Workflow

1. **Read contract** — Understand review scope
2. **Read spec** — Know the rules
3. **Locate target** — Find renderer(s) to review
4. **Check each rule** — Systematic validation
5. **Document findings** — Note violations with line numbers
6. **Report** — Return review in output format

## Validation

This agent validates others - no self-validation needed.

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| `technical-director` | None (executes directly) |
