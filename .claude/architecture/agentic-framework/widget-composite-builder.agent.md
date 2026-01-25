# Widget Composite Builder Contract

> Builds widget composite factory functions that return WidgetSchema objects.

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/builder.spec.md` | Builder type rules |
| `.claude/architecture/creativeshire/components/content/widget-composite.spec.md` | Composite rules |
| `.claude/architecture/creativeshire/components/content/widget-composite.validator.ts` | Validation logic |

### Additional

| Document | Why |
|----------|-----|
| `.claude/architecture/creativeshire/components/content/widget.spec.md` | Available widget types for composition |
| `.claude/architecture/creativeshire/patterns/common.spec.md` | Cross-cutting patterns and conventions |
| `.claude/skills/react-best-practices/bundles/component-rendering.md` | react-best-practices optimization |
| `.claude/skills/react-best-practices/bundles/js-performance.md` | react-best-practices optimization |
| `.claude/skills/tailwind-v4-skill/bundles/setup-config.md` | tailwind-v4-skill optimization |
| `.claude/skills/tailwind-v4-skill/bundles/migration-v3.md` | tailwind-v4-skill optimization |
| `.claude/skills/tailwind-v4-skill/bundles/customization.md` | tailwind-v4-skill optimization |

Add when: composing widget trees from primitive widgets

## Scope

### Can Touch

```
creativeshire/components/content/widgets/composites/
├── {Name}/
│   ├── index.ts     ✓
│   └── types.ts     ✓
├── types.ts         ✓ (shared composite types)
└── index.ts         ✓ (exports)
```

### Cannot Touch

| Path | Reason |
|------|--------|
| `creativeshire/components/content/widgets/content/*` | Use widget-builder |
| `creativeshire/components/content/widgets/layout/*` | Use widget-builder |
| `creativeshire/experience/*` | Layer violation |
| `site/*` | Instance data |
| `app/*` | Routing concern |
| `.claude/tasks/*` | Task management |

## Input

```typescript
interface TaskInput {
  name: string              // Composite name (e.g., ProjectCard)
  requirements: string      // What to compose
  widgets?: string[]        // Widgets to use
}
```

## Output

| File | Required | Purpose |
|------|----------|---------|
| `{Name}/index.ts` | Yes | Factory function (create{Name}) |
| `{Name}/types.ts` | Yes | Props interface |

### Verify Before Completion

- [ ] Factory function named create{Name}
- [ ] Returns WidgetSchema type
- [ ] No React imports or JSX
- [ ] Validator passes (exit 0)
- [ ] Exports updated in index.ts

## Workflow

1. **Read contract** - Understand scope
2. **Read spec** - Understand composite rules
3. **Check widgets** - Verify available widget types
4. **Create/modify** - Build factory function
5. **Validator runs** - Auto on Write/Edit
6. **Fix if needed** - Address failures
7. **Report** - Return created paths

## Validation

Validated by: `./widget-composite-builder.validator.ts`

| Exit | Meaning | Action |
|------|---------|--------|
| `0` | Pass | Continue |
| `1` | Validator crashed | Report bug |
| `2` | Validation failed | Fix and retry |

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| `technical-director` | None (executes directly) |
