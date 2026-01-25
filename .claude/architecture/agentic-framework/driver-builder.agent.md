# Driver Builder Contract

> Creates drivers that apply CSS variables to DOM elements for high-frequency animation without React reconciliation.

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/builder.spec.md` | Builder type rules |
| `.claude/architecture/creativeshire/components/experience/driver.spec.md` | Driver domain rules |
| `.claude/architecture/creativeshire/components/experience/driver.validator.ts` | Validation logic |
| `.claude/architecture/creativeshire/components/experience/behaviour.spec.md` | Driver calls behaviour.compute() every frame |
| `.claude/architecture/creativeshire/components/experience/trigger.spec.md` | Triggers update store that driver reads |

### Additional

| Document | Why |
|----------|-----|
| `.claude/architecture/creativeshire/components/experience/types.ts` | Shared experience types |
| `.claude/architecture/creativeshire/patterns/common.spec.md` | Established patterns to follow |
| `.claude/skills/react-best-practices/bundles/client-runtime.md` | Client-side events and advanced patterns |
| `.claude/skills/react-best-practices/bundles/js-performance.md` | Pure JavaScript optimization patterns |

Add when: understanding state structure or cross-domain integration.

## Scope

### Can Touch

```
creativeshire/components/experience/driver/
├── {DriverName}.ts     ✓ Driver implementation
├── types.ts            ✓ Shared driver types
└── index.ts            ✓ Exports
```

### Cannot Touch

| Path | Reason |
|------|--------|
| `creativeshire/components/experience/behaviour/*` | Different domain |
| `creativeshire/components/experience/trigger/*` | Different domain |
| `creativeshire/components/experience/provider/*` | Different domain |
| `creativeshire/components/content/*` | Different layer |
| `site/*` | Instance data |
| `app/*` | Routing concern |
| `.claude/tasks/*` | Task management |

## Input

```typescript
interface TaskInput {
  name: string              // Driver name (e.g., "ScrollDriver")
  requirements: string      // What state to track and apply
  existingDrivers?: string[]  // Similar drivers to reference
  targetBehaviours?: string[] // Behaviours this driver will work with
}
```

## Output

| File | Required | Purpose |
|------|----------|---------|
| `{Name}.ts` | Yes | Driver class with default export |

### Verify Before Completion

- [ ] Implements Driver interface (register, unregister, destroy)
- [ ] Uses `Map<string, Target>` for O(1) target lookup
- [ ] Event listeners use `{ passive: true }` for scroll/resize
- [ ] Tick loop uses `requestAnimationFrame`
- [ ] Only uses `element.style.setProperty('--*', value)`
- [ ] No direct style assignments (`element.style.transform = ...`)
- [ ] No React state (`useState`, `useReducer`)
- [ ] `destroy()` removes event listeners and clears Map
- [ ] GSAP ScrollTriggers killed on cleanup (if applicable)
- [ ] Validator passes (exit 0)

## Workflow

1. **Read contract** — Understand scope
2. **Read spec** — Understand driver rules
3. **Check existing** — Find similar drivers (DRY)
4. **Create/modify** — Stay within scope
5. **Validator runs** — Auto on Write/Edit
6. **Fix if needed** — Address failures
7. **Report** — Return created paths

## Validation

Validated by: `./driver-builder.validator.ts`

| Exit | Meaning | Action |
|------|---------|--------|
| `0` | Pass | Continue |
| `1` | Validator crashed | Report bug |
| `2` | Validation failed | Fix and retry |

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| `technical-director` | None (executes directly) |
