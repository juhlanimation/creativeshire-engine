# Preset Builder Contract

> Creates and modifies presets bundling mode configuration, chrome setup, and page structure templates.

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/builder.spec.md` | Builder type rules |
| `.claude/architecture/creativeshire/components/preset/preset.spec.md` | Domain rules and interface contracts |
| `.claude/architecture/creativeshire/components/preset/preset.validator.ts` | Validation logic for presets |

### Additional

| Document | Why |
|----------|-----|
| `.claude/architecture/creativeshire/experience/modes/` | Mode examples |
| `.claude/architecture/creativeshire/experience/experiences/` | Experience examples |
| `.claude/skills/react-best-practices/bundles/server-components.md` | react-best-practices optimization |

## Scope

### Can Touch

```
creativeshire/presets/
├── types.ts                  ✓ (shared types)
├── {name}/
│   ├── index.ts              ✓ (main export)
│   ├── site.ts               ✓ (site defaults)
│   ├── pages/
│   │   ├── home.ts           ✓ (page templates)
│   │   └── *.ts              ✓ (page templates)
│   └── chrome/
│       ├── header.ts         ✓ (chrome regions)
│       ├── footer.ts         ✓ (chrome regions)
│       └── *.ts              ✓ (chrome regions)

creativeshire/experience/modes/
├── types.ts                  ✓ (mode types)
├── registry.ts               ✓ (mode collection)
└── {name}/
    ├── index.ts              ✓ (mode definition)
    └── store.ts              ✓ (zustand store)

creativeshire/experience/experiences/
├── types.ts                  ✓ (experience types)
├── registry.ts               ✓ (experience collection)
└── {name}.ts                 ✓ (experience definition)
```

### Cannot Touch

| Path | Reason |
|------|--------|
| `site/*` | Instance data |
| `app/*` | Routing concern |
| `creativeshire/content/*` | Use via imports only |
| `creativeshire/renderer/*` | Renderer concern |
| `.claude/tasks/*` | Task management |

## Input

```typescript
interface TaskInput {
  type: 'preset' | 'mode' | 'experience'  // What to create
  name: string                             // kebab-case name
  mode?: string                            // For preset: default mode
  description?: string                     // What it provides
  baseMode?: string                        // For experience: underlying mode
}
```

## Output

### For Preset

| File | Required | Purpose |
|------|----------|---------|
| `{name}/index.ts` | Yes | SitePreset export |
| `{name}/site.ts` | Yes | Site defaults config |
| `{name}/pages/home.ts` | Yes | Home page template |
| `{name}/chrome/header.ts` | Yes | Header region |
| `{name}/chrome/footer.ts` | Yes | Footer region |

### For Mode

| File | Required | Purpose |
|------|----------|---------|
| `{name}/index.ts` | Yes | Mode definition with provides, triggers, defaults |
| `{name}/store.ts` | Yes | Zustand store factory |

### For Experience

| File | Required | Purpose |
|------|----------|---------|
| `{name}.ts` | Yes | Experience definition with wrappers |

### Verify Before Completion

- [ ] All required outputs created
- [ ] Validator passes (exit 0)
- [ ] Named exports follow conventions
- [ ] No site imports (presets are portable)
- [ ] Mode references are valid
- [ ] Behaviour IDs exist

## Workflow

1. **Read contract** — Understand scope and rules
2. **Read spec** — Understand interfaces and validation rules
3. **Check type** — Preset, mode, or experience?
4. **Check existing** — Find similar items for reference
5. **Create files** — Follow templates from spec
6. **Validator runs** — Auto on Write/Edit
7. **Fix if needed** — Address validation failures
8. **Report** — Return created file paths

## Validation

Validated by: `./.claude/architecture/agentic-framework/preset-builder.validator.ts`

Chains to: `.claude/architecture/creativeshire/components/preset/preset.validator.ts`

| Exit | Meaning | Action |
|------|---------|--------|
| `0` | Pass | Continue |
| `1` | Validator crashed | Report bug |
| `2` | Validation failed | Fix and retry |

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| `technical-director` | None (executes directly) |
