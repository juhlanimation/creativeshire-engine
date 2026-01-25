# Feature Builder Contract

> Builds static feature decorators (spacing, background, typography, border) for widgets and sections.

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/builder.spec.md` | Builder type rules |
| `.claude/architecture/creativeshire/components/content/feature.spec.md` | Feature domain rules |
| `.claude/architecture/creativeshire/components/content/feature.validator.ts` | Validation logic |

### Additional

| Document | Why |
|----------|-----|
| `.claude/architecture/creativeshire/components/content/widget.spec.md` | Widget integration |
| `.claude/architecture/creativeshire/components/content/section.spec.md` | Section integration |
| `.claude/skills/react-best-practices/bundles/component-rendering.md` | react-best-practices optimization |
| `.claude/skills/react-best-practices/bundles/bundle-optimization.md` | react-best-practices optimization |
| `.claude/skills/tailwind-v4-skill/bundles/setup-config.md` | tailwind-v4-skill optimization |
| `.claude/skills/tailwind-v4-skill/bundles/migration-v3.md` | tailwind-v4-skill optimization |
| `.claude/skills/tailwind-v4-skill/bundles/customization.md` | tailwind-v4-skill optimization |

Add when: creating features that apply to widgets or sections.

## Scope

### Can Touch

```
creativeshire/components/content/feature/
├── index.ts             ✓
├── types.ts             ✓
├── spacing.ts           ✓
├── typography.ts        ✓
├── background.ts        ✓
├── border.ts            ✓
└── feature.spec.md      ✓ (domain spec)
```

### Cannot Touch

| Path | Reason |
|------|--------|
| `creativeshire/components/content/widget/*` | Different domain (widget-builder) |
| `creativeshire/components/content/section/*` | Different domain (section-builder) |
| `creativeshire/components/experience/*` | Different layer (behaviour-builder) |
| `site/*` | Instance data |
| `app/*` | Routing concern |
| `.claude/tasks/*` | Task management |

## Input

```typescript
interface TaskInput {
  name: string           // Feature name (e.g., "spacing", "typography")
  requirements: string   // Properties to add/modify
  existingFeatures?: string[]  // Similar features to reference
}
```

## Output

| File | Required | Purpose |
|------|----------|---------|
| `{name}.ts` | Yes | Feature interface and apply function |
| `types.ts` | Update | Export feature type |
| `index.ts` | Update | Export from barrel |

### Verify Before Completion

- [ ] Feature returns CSSProperties
- [ ] Pure function (no hooks, no side effects)
- [ ] No CSS variables or dynamic values
- [ ] No experience layer imports
- [ ] Validator passes (exit 0)
- [ ] Exported from barrel

## Workflow

1. **Read contract** — Understand scope
2. **Read spec** — Understand static-only rules
3. **Check existing** — Find similar features (DRY)
4. **Create/modify** — Pure functions returning CSSProperties
5. **Validator runs** — Auto on Write/Edit
6. **Fix if needed** — Address failures
7. **Report** — Return created paths

## Validation

Validated by: `./feature-builder.validator.ts`

| Exit | Meaning | Action |
|------|---------|--------|
| `0` | Pass | Continue |
| `1` | Validator crashed | Report bug |
| `2` | Validation failed | Fix and retry |

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| `technical-director` | None (executes directly) |
