# Site Builder Contract

> Builds site configuration and instance data for a specific website.

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/builder.spec.md` | Builder type rules |
| `.claude/architecture/creativeshire/components/site/site.spec.md` | Site domain rules |
| `.claude/architecture/creativeshire/components/site/site.validator.ts` | Validation logic |

### Additional

| Document | Why |
|----------|-----|
| `.claude/architecture/creativeshire/presets/*.ts` | Available preset templates to extend |
| `.claude/architecture/creativeshire/schema/site.ts` | Site type definitions |
| `.claude/architecture/creativeshire/content/sections/composites/` | Section factories for pages |

Add when: understanding preset options, schema constraints, or section composition.

## Scope

### Can Touch

```
site/
├── config.ts              ✓ (main site config)
├── pages/
│   └── {pageId}.ts        ✓ (page schemas)
├── chrome/
│   ├── header.ts          ✓ (chrome overrides)
│   └── footer.ts          ✓
└── data/
    └── *.ts               ✓ (content data)
```

### Cannot Touch

| Path | Reason |
|------|--------|
| `.claude/architecture/creativeshire/*` | Engine code (extend via schema only) |
| `app/*` | Routing concern |
| `.claude/tasks/*` | Task management |

## Input

```typescript
interface TaskInput {
  type: 'config' | 'page' | 'chrome' | 'data'  // What to create/modify
  name?: string           // Page name, data file name, etc.
  requirements: string    // What to accomplish
  preset?: string         // Preset to extend (for config)
  existingFiles?: string[] // Similar files to reference
}
```

## Output

| File | Required | Purpose |
|------|----------|---------|
| `site/config.ts` | For config type | Site configuration extending preset |
| `site/pages/{pageId}.ts` | For page type | Page schema with sections |
| `site/chrome/*.ts` | For chrome type | Chrome region overrides |
| `site/data/*.ts` | For data type | Content data arrays |

### Verify Before Completion

- [ ] All required outputs created
- [ ] Validator passes (exit 0)
- [ ] Imports resolve correctly
- [ ] Data separated from pages

## Workflow

1. **Read contract** — Understand scope
2. **Read spec** — Understand site rules
3. **Check existing** — Find similar files (DRY)
4. **Identify preset** — For config, find preset to extend
5. **Create/modify** — Stay within scope
6. **Validator runs** — Auto on Write/Edit
7. **Fix if needed** — Address failures
8. **Report** — Return created paths

## Validation

Validated by: `./site-builder.validator.ts`

| Exit | Meaning | Action |
|------|---------|--------|
| `0` | Pass | Continue |
| `1` | Validator crashed | Report bug |
| `2` | Validation failed | Fix and retry |

## Domain Rules Summary

From `site.spec.md`:

### Must

1. Import and extend a preset in config.ts
2. Use spread syntax for inheritance
3. Export named constants (`siteConfig`, `{pageId}Page`)
4. List all pages with id and slug in config.ts
5. Import data from `site/data/` (not inline)
6. Use section composites from `creativeshire/content/sections/composites`

### Must Not

1. Modify creativeshire code - extend via schema only
2. Import from `creativeshire/experience/` directly
3. Inline large data arrays in page files
4. Mutate preset objects - always spread into new object
5. Define pages without matching `app/{slug}/page.tsx` route

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| `technical-director` | None (executes directly) |
