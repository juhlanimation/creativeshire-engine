# Schema Builder Contract

> Builds TypeScript type definitions describing data structures for sites, pages, sections, widgets, chrome, features, and experiences.

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/builder.spec.md` | Builder type rules |
| `.claude/architecture/creativeshire/components/schema/schema.spec.md` | Schema domain rules |
| `.claude/architecture/creativeshire/components/schema/schema.validator.ts` | Validation logic |

### Additional

| Document | Why |
|----------|-----|
| `.claude/architecture/creativeshire/components/content/widget.spec.md` | Widget structure types reference |
| `.claude/architecture/creativeshire/components/content/section.spec.md` | Section structure types reference |
| `.claude/architecture/creativeshire/components/experience/behaviour.spec.md` | Behaviour config types reference |

Add when: understanding cross-domain type dependencies.

## Scope

### Can Touch

```
creativeshire/schema/
├── index.ts            ✓ (barrel exports)
├── site.ts             ✓
├── page.ts             ✓
├── section.ts          ✓
├── widget.ts           ✓
├── chrome.ts           ✓
├── features.ts         ✓
└── experience.ts       ✓
```

### Cannot Touch

| Path | Reason |
|------|--------|
| `creativeshire/components/*` | Implementation layer |
| `creativeshire/experience/*` | Layer violation (L2) |
| `creativeshire/renderer/*` | Layer violation (L3) |
| `site/*` | Instance data |
| `app/*` | Routing concern |
| `.claude/tasks/*` | Task management |

## Input

```typescript
interface TaskInput {
  name: string           // Schema name (e.g., "widget", "section")
  requirements: string   // What types to define
  relatedSchemas?: string[]  // Other schemas to reference
  relatedSpecs?: string[]    // Specs to read for context
}
```

## Output

| File | Required | Purpose |
|------|----------|---------|
| `{name}.ts` | Yes | Type definitions (interfaces, types) |
| `index.ts` | Update | Barrel exports updated |

### Verify Before Completion

- [ ] All required outputs created
- [ ] Validator passes (exit 0)
- [ ] Exports updated in `schema/index.ts`
- [ ] Types use `export type` or `export interface`

## Workflow

1. **Read contract** — Understand scope
2. **Read spec** — Understand schema rules
3. **Check existing** — Find related schemas (DRY)
4. **Create/modify** — Stay within scope, types only
5. **Validator runs** — Auto on Write/Edit
6. **Fix if needed** — Address failures
7. **Report** — Return created paths

## Validation

Validated by: `./schema-builder.validator.ts`

| Exit | Meaning | Action |
|------|---------|--------|
| `0` | Pass | Continue |
| `1` | Validator crashed | Report bug |
| `2` | Validation failed | Fix and retry |

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| `technical-director` | None (executes directly) |
