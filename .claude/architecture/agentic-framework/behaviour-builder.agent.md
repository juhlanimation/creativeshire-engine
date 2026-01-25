# Behaviour Builder Contract

> Creates behaviour compute functions that transform runtime state into CSS variables for animation.

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/builder.spec.md` | Builder type rules |
| `.claude/architecture/creativeshire/components/experience/behaviour.spec.md` | Behaviour domain rules |
| `.claude/architecture/creativeshire/components/experience/behaviour.validator.ts` | Validation logic |
| `.claude/architecture/creativeshire/components/experience/driver.spec.md` | Driver calls behaviour.compute() every frame |
| `.claude/architecture/creativeshire/components/experience/trigger.spec.md` | Triggers produce BehaviourState that compute() receives |

### Additional

| Document | Why |
|----------|-----|
| `.claude/architecture/creativeshire/components/experience/types.ts` | Shared experience types |
| `.claude/architecture/creativeshire/patterns/common.spec.md` | Established patterns to follow |
| `.claude/skills/react-best-practices/bundles/js-performance.md` | Pure JavaScript optimization |

Add when: understanding state structure or cross-behaviour integration.

## Scope

### Can Touch

```
creativeshire/components/experience/behaviour/
├── {behaviour-name}/
│   └── index.ts        ✓ Behaviour definition
├── types.ts            ✓ Shared types
├── registry.ts         ✓ Auto-discovery
├── resolve.ts          ✓ Schema resolution
├── BehaviourWrapper.tsx ✓ Generic wrapper
└── index.ts            ✓ Exports
```

### Cannot Touch

| Path | Reason |
|------|--------|
| `creativeshire/components/experience/driver/*` | Different domain |
| `creativeshire/components/experience/trigger/*` | Different domain |
| `creativeshire/components/experience/provider/*` | Different domain |
| `creativeshire/components/content/*` | Different layer |
| `site/*` | Instance data |
| `app/*` | Routing concern |
| `.claude/tasks/*` | Task management |

## Input

```typescript
interface TaskInput {
  name: string              // Behaviour name (kebab-case)
  requirements: string      // What state to transform
  existingBehaviours?: string[]  // Similar behaviours to reference
  cssVariables?: string[]   // CSS variables to produce
}
```

## Output

| File | Required | Purpose |
|------|----------|---------|
| `{name}/index.ts` | Yes | Behaviour definition with default export |

### Verify Before Completion

- [ ] Behaviour has default export
- [ ] `id` is kebab-case
- [ ] `requires` array lists all state dependencies
- [ ] `compute` returns CSSVariables (--prefixed keys)
- [ ] `cssTemplate` has var() fallbacks
- [ ] `cssTemplate` has will-change for animated properties
- [ ] Options have defaults
- [ ] No DOM manipulation
- [ ] No React state in compute
- [ ] Validator passes (exit 0)

## Workflow

1. **Read contract** — Understand scope
2. **Read spec** — Understand behaviour rules
3. **Check existing** — Find similar behaviours (DRY)
4. **Create/modify** — Stay within scope
5. **Validator runs** — Auto on Write/Edit
6. **Fix if needed** — Address failures
7. **Report** — Return created paths

## Validation

Validated by: `./behaviour-builder.validator.ts`

| Exit | Meaning | Action |
|------|---------|--------|
| `0` | Pass | Continue |
| `1` | Validator crashed | Report bug |
| `2` | Validation failed | Fix and retry |

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| `technical-director` | None (executes directly) |
