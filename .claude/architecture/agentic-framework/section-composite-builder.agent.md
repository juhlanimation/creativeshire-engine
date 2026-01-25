# Section Composite Builder Contract

> Build factory functions that return `SectionSchema` - pre-configured section structures.

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/builder.spec.md` | Builder type rules |
| `.claude/architecture/creativeshire/components/content/section-composite.spec.md` | Domain rules |
| `.claude/architecture/creativeshire/components/content/section-composite.validator.ts` | Validation logic |

### Additional

| Document | Why |
|----------|-----|
| `.claude/architecture/creativeshire/patterns/common.spec.md` | Cross-cutting patterns and conventions |
| `.claude/architecture/creativeshire/components/content/section.spec.md` | SectionSchema type definition |
| `.claude/architecture/creativeshire/components/content/widget.spec.md` | WidgetSchema type for composition |
| `.claude/skills/react-best-practices/bundles/component-rendering.md` | react-best-practices optimization |
| `.claude/skills/react-best-practices/bundles/js-performance.md` | react-best-practices optimization |
| `.claude/skills/tailwind-v4-skill/bundles/setup-config.md` | tailwind-v4-skill optimization |
| `.claude/skills/tailwind-v4-skill/bundles/migration-v3.md` | tailwind-v4-skill optimization |
| `.claude/skills/tailwind-v4-skill/bundles/customization.md` | tailwind-v4-skill optimization |

## Scope

### Can Touch

```
creativeshire/components/content/sections/composites/
├── {Name}/
│   ├── index.ts       ✓ Factory function (named export)
│   ├── types.ts       ✓ Props interface
│   └── variants.ts    ✓ Optional variant configs
└── index.ts           ✓ Barrel exports
```

### Cannot Touch

| Path | Reason |
|------|--------|
| `creativeshire/components/content/sections/Section.tsx` | Core section component - use section-builder |
| `creativeshire/components/content/widgets/*` | Widget definitions - use widget-builder |
| `creativeshire/components/content/chrome/*` | Chrome layer - use chrome-builder |
| `creativeshire/experience/*` | Experience layer - layer violation |
| `site/*` | Instance data |
| `app/*` | Routing concern |

## Input

```typescript
interface TaskInput {
  name: string              // Composite name (e.g., "Hero", "Gallery")
  requirements: string      // What the section does
  variants?: string[]       // Optional variant configs
}
```

## Output

| File | Required | Purpose |
|------|----------|---------|
| `{Name}/index.ts` | Yes | Factory function (create{Name}Section) |
| `{Name}/types.ts` | Yes | Props interface |
| `{Name}/variants.ts` | If variants | Preset configurations |
| `index.ts` update | Yes | Export new composite |

### Verify Before Completion

- [ ] Factory function named `create{Name}Section`
- [ ] Returns `SectionSchema` with explicit type
- [ ] Props interface exported from `types.ts`
- [ ] No React imports or JSX syntax
- [ ] Validator passes (exit 0)
- [ ] Exports updated in barrel file

## Workflow

1. **Read contract** — Understand scope and constraints
2. **Read spec** — Understand section composite rules
3. **Check existing** — Find similar composites for patterns
4. **Create files** — Factory function, types, optional variants
5. **Validator runs** — Auto on Write/Edit
6. **Fix if needed** — Address validation failures
7. **Update exports** — Add to barrel file
8. **Report** — Return created paths and usage example

## Validation

Validated by: `./section-composite-builder.validator.ts`

| Exit | Meaning | Action |
|------|---------|--------|
| `0` | Pass | Continue |
| `1` | Validator crashed | Report bug |
| `2` | Validation failed | Fix and retry |

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| `technical-director` | None (executes directly) |
