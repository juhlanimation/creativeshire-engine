# Widget Builder Contract

> Builds atomic widget components that render content and layout structure.

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/builder.spec.md` | Builder type rules |
| `.claude/architecture/creativeshire/components/content/widget.spec.md` | Widget domain rules |
| `.claude/architecture/creativeshire/components/content/widget.validator.ts` | Validation logic |
| `.claude/architecture/creativeshire/components/content/section.spec.md` | Sections contain and render widgets |

### Additional

| Document | Why |
|----------|-----|
| `.claude/architecture/creativeshire/components/content/feature.spec.md` | Static styling props widgets accept |
| `.claude/architecture/creativeshire/components/schema/widget.ts` | Widget type definitions |
| `.claude/architecture/creativeshire/patterns/common.spec.md` | Established patterns to follow |
| `.claude/skills/react-best-practices/bundles/component-rendering.md` | React render optimization |
| `.claude/skills/react-best-practices/bundles/bundle-optimization.md` | Import patterns |
| `.claude/skills/tailwind-v4-skill/bundles/setup-config.md` | Tailwind v4 setup and CSS-first patterns |
| `.claude/skills/tailwind-v4-skill/bundles/migration-v3.md` | Breaking changes from Tailwind v3 |
| `.claude/skills/tailwind-v4-skill/bundles/customization.md` | Custom utilities and theme extension |

Add when: understanding features integration or schema constraints.

## Scope

### Can Touch

```
creativeshire/components/content/widgets/
├── content/{WidgetName}/
│   ├── index.tsx       ✓
│   ├── types.ts        ✓
│   └── styles.css      ✓
├── layout/{WidgetName}/
│   ├── index.tsx       ✓
│   └── types.ts        ✓
├── types.ts            ✓ (shared widget types)
└── index.ts            ✓ (barrel exports)
```

### Cannot Touch

| Path | Reason |
|------|--------|
| `creativeshire/components/content/sections/*` | Different domain |
| `creativeshire/components/content/chrome/*` | Different domain (singular exception) |
| `creativeshire/components/content/features/*` | Different domain |
| `creativeshire/experience/*` | Layer violation (L2) |
| `creativeshire/schema/*` | Schema management |
| `site/*` | Instance data |
| `app/*` | Routing concern |
| `.claude/tasks/*` | Task management |

## Input

```typescript
interface TaskInput {
  name: string           // Widget name (e.g., "Text", "Image")
  category: 'content' | 'layout'  // Widget category
  requirements: string   // What to accomplish
  existingWidgets?: string[]      // Similar widgets to reference
  relatedSpecs?: string[]         // Additional specs to read
}
```

## Output

| File | Required | Purpose |
|------|----------|---------|
| `index.tsx` | Yes | Component with default export |
| `types.ts` | Yes | Props interface (exported) |
| `styles.css` | Content widgets | CSS with var() fallbacks |

### Verify Before Completion

- [ ] All required outputs created
- [ ] Validator passes (exit 0)
- [ ] Exports updated in `widget/index.ts`

## Workflow

1. **Read contract** — Understand scope
2. **Read spec** — Understand widget rules
3. **Check existing** — Find similar widgets (DRY)
4. **Create/modify** — Stay within scope
5. **Validator runs** — Auto on Write/Edit
6. **Fix if needed** — Address failures
7. **Report** — Return created paths

## Validation

Validated by: `./widget-builder.validator.ts`

| Exit | Meaning | Action |
|------|---------|--------|
| `0` | Pass | Continue |
| `1` | Validator crashed | Report bug |
| `2` | Validation failed | Fix and retry |

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| `technical-director` | None (executes directly) |
