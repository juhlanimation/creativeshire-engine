# Section Builder Contract

> Builds and maintains the base Section component and its type definitions.

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/builder.spec.md` | Builder type rules |
| `.claude/architecture/creativeshire/components/content/section.spec.md` | Section domain rules |
| `.claude/architecture/creativeshire/components/content/section.validator.ts` | Section validation logic |
| `.claude/architecture/creativeshire/components/experience/behaviour.spec.md` | BehaviourWrapper wraps sections for animation |

### Additional

| Document | Why |
|----------|-----|
| `.claude/architecture/creativeshire/components/content/widget.spec.md` | Section renders widgets |
| `.claude/architecture/creativeshire/components/schema/section.ts` | SectionSchema type definition |
| `.claude/architecture/creativeshire/patterns/common.spec.md` | Established patterns to follow |
| `.claude/skills/react-best-practices/bundles/component-rendering.md` | react-best-practices optimization |
| `.claude/skills/react-best-practices/bundles/server-components.md` | react-best-practices optimization |
| `.claude/skills/react-best-practices/bundles/bundle-optimization.md` | react-best-practices optimization |
| `.claude/skills/tailwind-v4-skill/bundles/setup-config.md` | tailwind-v4-skill optimization |
| `.claude/skills/tailwind-v4-skill/bundles/migration-v3.md` | tailwind-v4-skill optimization |
| `.claude/skills/tailwind-v4-skill/bundles/customization.md` | tailwind-v4-skill optimization |

## Scope

### Can Touch

```
creativeshire/components/content/sections/
├── Section.tsx         ✓
├── types.ts            ✓
├── styles.css          ✓
└── index.ts            ✓ (exports)
```

### Cannot Touch

| Path | Reason |
|------|--------|
| `creativeshire/components/content/sections/composites/*` | Use section-composite-builder |
| `creativeshire/components/content/widgets/*` | Use widget-builder |
| `creativeshire/components/chrome/*` | Different domain |
| `creativeshire/experience/*` | Layer violation |
| `site/*` | Instance data |
| `app/*` | Routing concern |

## Input

```typescript
interface TaskInput {
  task: string              // What to accomplish
  requirements?: string     // Specific requirements
  layoutTypes?: string[]    // Layout configurations to support
}
```

## Output

| File | Required | Purpose |
|------|----------|---------|
| `Section.tsx` | Yes | Default exported component |
| `types.ts` | Yes | LayoutConfig and types |
| `styles.css` | Yes | CSS with var() fallbacks |
| `index.ts` | Yes | Barrel exports |

### Verify Before Completion

- [ ] Default export exists in Section.tsx
- [ ] No viewport units (100vh, 100dvh)
- [ ] No experience layer imports
- [ ] CSS variables use var() with fallbacks
- [ ] Validator passes (exit 0)

## Workflow

1. **Read contract** — Understand scope
2. **Read spec** — Review section.spec.md
3. **Check existing** — Read current Section implementation
4. **Create/modify** — Stay within domain folder
5. **Validator runs** — Auto on Write/Edit
6. **Fix if needed** — Address validation failures
7. **Report** — Return modified paths

## Validation

Validated by: `./section-builder.validator.ts`

| Exit | Meaning | Action |
|------|---------|--------|
| `0` | Pass | Continue |
| `1` | Validator crashed | Report bug |
| `2` | Validation failed | Fix and retry |

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| `technical-director` | None (executes directly) |
