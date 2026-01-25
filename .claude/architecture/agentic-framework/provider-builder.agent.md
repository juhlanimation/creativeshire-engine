# Provider Builder Contract

> Build React context providers that distribute experience mode and driver access to the component tree.

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/builder.spec.md` | Builder type rules |
| `.claude/architecture/creativeshire/components/experience/provider.spec.md` | Provider rules and patterns |
| `.claude/architecture/creativeshire/components/experience/provider.validator.ts` | Validation logic |

### Additional

| Document | Why |
|----------|-----|
| `.claude/architecture/creativeshire/components/experience/driver.spec.md` | Driver lifecycle for DriverProvider |
| `.claude/architecture/creativeshire/components/experience/mode.spec.md` | Mode distribution for ExperienceProvider |
| `.claude/skills/react-best-practices/bundles/client-runtime.md` | react-best-practices optimization |
| `.claude/skills/react-best-practices/bundles/bundle-optimization.md` | react-best-practices optimization |

## Scope

### Can Touch

```
creativeshire/components/experience/provider/
├── ExperienceProvider.tsx    ✓ Main experience context
├── DriverProvider.tsx         ✓ Driver registration context
├── types.ts                   ✓ Provider interfaces
└── index.ts                   ✓ Barrel exports
```

### Cannot Touch

| Path | Reason |
|------|--------|
| `creativeshire/components/experience/driver/*` | Different domain - use driver-builder |
| `creativeshire/components/experience/mode/*` | Different domain - use mode-builder |
| `creativeshire/components/experience/behaviour/*` | Different domain - use behaviour-builder |
| `creativeshire/components/content/*` | Different layer |
| `site/*` | Instance data |
| `app/*` | Routing concern |

## Input

```typescript
interface TaskInput {
  providerName: 'ExperienceProvider' | 'DriverProvider'  // Which provider to modify
  requirements: string                                    // What to change
  contextChanges?: {                                      // Optional context changes
    addFields?: Record<string, string>
    removeFields?: string[]
  }
}
```

## Output

| File | Required | Purpose |
|------|----------|---------|
| `ExperienceProvider.tsx` | For mode work | Distributes mode and store |
| `DriverProvider.tsx` | For driver work | Distributes driver registration |
| `types.ts` | If interfaces change | Context type definitions |

### Verify Before Completion

- [ ] Provider exports hook (useExperience or useDriver)
- [ ] Hook throws if context is null
- [ ] Driver created in useEffect (not render)
- [ ] Cleanup function returned from useEffect
- [ ] No useState for mode or store
- [ ] Uses useRef for driver instance
- [ ] No direct DOM manipulation
- [ ] Validator passes (exit 0)

## Workflow

1. **Read contract** — Understand scope (this file)
2. **Read spec** — Read `provider.spec.md` for rules
3. **Check existing** — Read current provider file
4. **Modify** — Apply changes following patterns
5. **Validator runs** — Auto on Write/Edit
6. **Fix if needed** — Address validation failures
7. **Report** — Return modified paths and verify checklist

## Validation

Validated by: `./provider-builder.validator.ts`

Chains to: `.claude/architecture/creativeshire/components/experience/provider/provider.validator.ts`

| Exit | Meaning | Action |
|------|---------|--------|
| `0` | Pass | Continue |
| `1` | Validator crashed | Report bug |
| `2` | Validation failed | Fix and retry |

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| `technical-director` | None (executes directly) |
