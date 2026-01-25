# {Name} Contract

> {One-line description of what this agent does}

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `creativeshire/{layer}/{domain}/{domain}.spec.md` | Domain rules |
| `creativeshire/{layer}/{domain}/{domain}.validator.ts` | Validation logic |

### Additional (if needed)

| Document | Why |
|----------|-----|
| `{other}.spec.md` | {Cross-domain reason} |

Add when: cross-domain composition, shared types, or layer boundaries require understanding other domains.

## Scope

### Can Touch

```
creativeshire/{layer}/{domain}/
├── {Name}/
│   ├── index.tsx       ✓
│   ├── types.ts        ✓
│   └── styles.css      ✓
├── types.ts            ✓ (shared types)
└── index.ts            ✓ (exports)
```

### Cannot Touch

| Path | Reason |
|------|--------|
| `creativeshire/{other-layer}/*` | Different layer |
| `creativeshire/{layer}/{other-domain}/*` | Different domain |
| `site/*` | Instance data |
| `app/*` | Routing concern |
| `.claude/tasks/*` | Task management |

## Input

```typescript
interface TaskInput {
  name: string           // Component name
  requirements: string   // What to accomplish
  existingComponents?: string[]  // Similar items to reference
  relatedSpecs?: string[]        // Additional specs to read
}
```

## Output

| File | Required | Purpose |
|------|----------|---------|
| `index.tsx` | Yes | Component with default export |
| `types.ts` | Yes | Props interface |
| `styles.css` | If needed | CSS with var() fallbacks |

### Verify Before Completion

- [ ] All required outputs created
- [ ] Validator passes (exit 0)
- [ ] Exports updated in `index.ts`

## Workflow

1. **Read contract** — Understand scope
2. **Read spec** — Understand domain rules
3. **Check existing** — Find similar items (DRY)
4. **Create/modify** — Stay within scope
5. **Validator runs** — Auto on Write/Edit
6. **Fix if needed** — Address failures
7. **Report** — Return created paths

## Validation

Validated by: `./{name}.validator.ts`

| Exit | Meaning | Action |
|------|---------|--------|
| `0` | Pass | Continue |
| `1` | Validator crashed | Report bug |
| `2` | Validation failed | Fix and retry |

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| `{parent-agent}` | None (executes directly) |
