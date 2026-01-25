# Renderer Builder Contract

> Builds renderer components that transform declarative schema into rendered React components.

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/builder.spec.md` | Builder type rules |
| `.claude/architecture/creativeshire/components/renderer/renderer.spec.md` | Renderer domain rules |
| `.claude/architecture/creativeshire/components/renderer/renderer.validator.ts` | Validation logic |

### Additional

| Document | Why |
|----------|-----|
| `.claude/architecture/creativeshire/experience/behaviours/resolve.ts` | Behaviour resolution function |
| `.claude/architecture/creativeshire/experience/BehaviourWrapper.tsx` | Wrapper component for behaviours |
| `.claude/architecture/creativeshire/schema/*.ts` | Schema type definitions |
| `.claude/skills/react-best-practices/bundles/server-components.md` | RSC and async patterns |
| `.claude/skills/react-best-practices/bundles/component-rendering.md` | React render optimization |

Add when: understanding behaviour resolution, wrapper usage, or schema constraints.

## Scope

### Can Touch

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
| `creativeshire/components/content/*` | Different domain |
| `creativeshire/components/experience/*` | Different domain |
| `creativeshire/schema/*` | Schema management |
| `creativeshire/components/preset/*` | Different domain |
| `site/*` | Instance data |
| `app/*` | Routing concern |
| `.claude/tasks/*` | Task management |

## Input

```typescript
interface TaskInput {
  name: string           // Renderer name (e.g., "SectionRenderer", "WidgetRenderer")
  requirements: string   // What to accomplish
  existingRenderers?: string[]   // Similar renderers to reference
  relatedSpecs?: string[]        // Additional specs to read
}
```

## Output

| File | Required | Purpose |
|------|----------|---------|
| `{Name}Renderer.tsx` | Yes | Renderer component |
| `types.ts` | If new types | Props interface (exported) |

### Verify Before Completion

- [ ] All required outputs created
- [ ] Validator passes (exit 0)
- [ ] Uses registry lookup (no hardcoded imports)
- [ ] Has ErrorBoundary wrapping (for WidgetRenderer)
- [ ] Calls resolveBehaviour() (no inline logic)
- [ ] Uses useFeatures() hook for features
- [ ] No inline animation logic
- [ ] No direct CSS variable manipulation

## Workflow

1. **Read contract** — Understand scope
2. **Read spec** — Understand renderer rules
3. **Check existing** — Find similar renderers (DRY)
4. **Create/modify** — Stay within scope
5. **Validator runs** — Auto on Write/Edit
6. **Fix if needed** — Address failures
7. **Report** — Return created paths

## Validation

Validated by: `./renderer-builder.validator.ts`

| Exit | Meaning | Action |
|------|---------|--------|
| `0` | Pass | Continue |
| `1` | Validator crashed | Report bug |
| `2` | Validation failed | Fix and retry |

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| `technical-director` | None (executes directly) |
