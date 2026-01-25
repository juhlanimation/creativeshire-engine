# Trigger Builder Contract

> Creates React hooks that listen to browser events and update Zustand store.

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/builder.spec.md` | Builder type rules |
| `.claude/architecture/creativeshire/components/experience/trigger.spec.md` | Trigger domain rules |
| `.claude/architecture/creativeshire/components/experience/trigger.validator.ts` | Validation logic |
| `.claude/architecture/creativeshire/components/experience/behaviour.spec.md` | Behaviours consume state triggers produce |

### Additional

| Document | Why |
|----------|-----|
| `.claude/architecture/creativeshire/components/experience/provider.spec.md` | Store access patterns |
| `.claude/architecture/creativeshire/patterns/common.spec.md` | Established patterns to follow |
| `.claude/skills/react-best-practices/bundles/client-runtime.md` | Event listeners, client patterns |
| `.claude/skills/react-best-practices/bundles/component-rendering.md` | React render optimization |
| `.claude/skills/react-best-practices/bundles/bundle-optimization.md` | react-best-practices optimization |
| `.claude/skills/react-best-practices/bundles/js-performance.md` | react-best-practices optimization |

## Scope

### Can Touch

```
creativeshire/components/experience/trigger/
├── useScrollProgress.ts     ✓
├── useScrollVelocity.ts     ✓
├── useIntersection.ts       ✓
├── useResize.ts             ✓
├── useKeyboard.ts           ✓
├── useCursor.ts             ✓
├── types.ts                 ✓ (shared types)
└── index.ts                 ✓ (exports)
```

### Cannot Touch

| Path | Reason |
|------|--------|
| `creativeshire/components/experience/driver/*` | Different domain |
| `creativeshire/components/experience/behaviour/*` | Different domain |
| `creativeshire/components/experience/provider/*` | Provider concern |
| `creativeshire/components/content/*` | Different layer |
| `site/*` | Instance data |
| `app/*` | Routing concern |
| `.claude/tasks/*` | Task management |

## Input

```typescript
interface TaskInput {
  name: string              // Trigger name (e.g., "ScrollProgress")
  requirements: string      // Event source and store updates
  eventSource: string       // Browser event (scroll, resize, mousemove)
  storeFields: string[]     // Store fields to update
}
```

## Output

| File | Required | Purpose |
|------|----------|---------|
| `use{Name}.ts` | Yes | Hook with SSR guard and cleanup |
| `types.ts` | If new types | Options interface |
| `index.ts` | Yes | Export new hook |

### Verify Before Completion

- [ ] Hook follows `use{Name}` convention
- [ ] Returns void (no state returned)
- [ ] Has cleanup function in useEffect
- [ ] Uses passive listeners for scroll/touch
- [ ] Has SSR guard for window/document access
- [ ] No DOM manipulation
- [ ] No CSS variable writes
- [ ] Validator passes (exit 0)

## Workflow

1. **Read contract** — Understand scope
2. **Read spec** — Understand trigger rules
3. **Check existing** — Find similar hooks (DRY)
4. **Create hook** — Write to store only
5. **Add cleanup** — Remove listeners on unmount
6. **Export** — Update index.ts
7. **Validator runs** — Auto on Write/Edit
8. **Fix if needed** — Address failures
9. **Report** — Return created paths

## Validation

Validated by: `./trigger-builder.validator.ts`

| Exit | Meaning | Action |
|------|---------|--------|
| `0` | Pass | Continue |
| `1` | Validator crashed | Report bug |
| `2` | Validation failed | Fix and retry |

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| `technical-director` | None (executes directly) |
