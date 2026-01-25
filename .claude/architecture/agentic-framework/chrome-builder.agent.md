# Chrome Builder Contract

> Builds persistent UI chrome components: regions (header, footer, sidebar) and overlays (cursor, loader, modal).

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/builder.spec.md` | Builder type rules |
| `.claude/architecture/creativeshire/components/content/chrome.spec.md` | Chrome domain rules |
| `.claude/architecture/creativeshire/components/content/chrome.validator.ts` | Validation logic |
| `.claude/architecture/creativeshire/components/experience/behaviour.spec.md` | Chrome regions can be animated via BehaviourWrapper |

### Additional

| Document | Why |
|----------|-----|
| `.claude/architecture/creativeshire/components/content/widget.spec.md` | Widgets embedded in chrome regions |
| `.claude/architecture/creativeshire/components/schema/chrome.ts` | Chrome type definitions |
| `.claude/architecture/creativeshire/patterns/common.spec.md` | Established patterns to follow |
| `.claude/skills/react-best-practices/bundles/component-rendering.md` | React render optimization |
| `.claude/skills/react-best-practices/bundles/bundle-optimization.md` | Import and bundle size optimization |
| `.claude/skills/tailwind-v4-skill/bundles/setup-config.md` | Tailwind v4 setup and configuration |
| `.claude/skills/tailwind-v4-skill/bundles/migration-v3.md` | Breaking changes from Tailwind v3 |
| `.claude/skills/tailwind-v4-skill/bundles/customization.md` | Custom utilities and theme extension |

Add when: understanding widget integration or schema constraints.

## Scope

### Can Touch

```
creativeshire/components/content/chrome/
├── regions/{Name}/
│   ├── index.tsx       ✓
│   ├── types.ts        ✓
│   └── styles.css      ✓
├── overlays/{Name}/
│   ├── index.tsx       ✓
│   ├── types.ts        ✓
│   └── styles.css      ✓
├── Chrome.tsx          ✓ (orchestrator)
├── types.ts            ✓ (shared chrome types)
└── index.ts            ✓ (barrel exports)
```

### Cannot Touch

| Path | Reason |
|------|--------|
| `creativeshire/components/content/widget/*` | Different domain |
| `creativeshire/components/content/section/*` | Different domain |
| `creativeshire/components/content/feature/*` | Different domain |
| `creativeshire/experience/*` | Layer violation (L2) |
| `creativeshire/schema/*` | Schema management |
| `site/*` | Instance data |
| `app/*` | Routing concern |
| `.claude/tasks/*` | Task management |

## Input

```typescript
interface TaskInput {
  name: string           // Component name (e.g., "Header", "Cursor")
  type: 'region' | 'overlay'  // Chrome component type
  requirements: string   // What to accomplish
  existingComponents?: string[]  // Similar components to reference
  relatedSpecs?: string[]        // Additional specs to read
}
```

## Output

| File | Required | Purpose |
|------|----------|---------|
| `index.tsx` | Yes | Component with default export |
| `types.ts` | Yes | Props interface (exported) |
| `styles.css` | If needed | CSS with var() fallbacks |

### Verify Before Completion

- [ ] All required outputs created
- [ ] Validator passes (exit 0)
- [ ] Exports updated in `chrome/index.ts`

## Workflow

1. **Read contract** — Understand scope
2. **Read spec** — Understand chrome rules
3. **Check existing** — Find similar components (DRY)
4. **Create/modify** — Stay within scope
5. **Validator runs** — Auto on Write/Edit
6. **Fix if needed** — Address failures
7. **Report** — Return created paths

## Validation

Validated by: `./chrome-builder.validator.ts`

| Exit | Meaning | Action |
|------|---------|--------|
| `0` | Pass | Continue |
| `1` | Validator crashed | Report bug |
| `2` | Validation failed | Fix and retry |

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| `technical-director` | None (executes directly) |
