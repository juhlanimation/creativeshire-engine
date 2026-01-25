# Page Builder Contract

> Builds page definitions and routing configuration for site instances.

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/builder.spec.md` | Builder type rules |
| `.claude/architecture/creativeshire/components/site/site.spec.md` | Site domain rules (page is subset) |
| `.claude/architecture/creativeshire/components/site/site.validator.ts` | Validation logic |

### Additional

| Document | Why |
|----------|-----|
| `.claude/architecture/creativeshire/schema/page.ts` | Page type definitions |
| `.claude/architecture/creativeshire/content/sections/composites/` | Section factories to use in pages |
| `.claude/skills/react-best-practices/bundles/server-components.md` | react-best-practices optimization |

Add when: understanding page schema or available section composites.

## Scope

### Can Touch

```
site/pages/
├── home.ts            ✓
├── about.ts           ✓
├── work.ts            ✓
└── {pageId}.ts        ✓

site/config.ts         ✓ (pages array only)
```

### Cannot Touch

| Path | Reason |
|------|--------|
| `site/chrome/*` | Chrome domain |
| `site/data/*` | Data management |
| `.claude/architecture/creativeshire/*` | Engine code |
| `app/*` | Routing concern (separate agent) |
| `.claude/tasks/*` | Task management |

## Input

```typescript
interface TaskInput {
  pageId: string           // Page identifier (e.g., "home", "about")
  slug: string             // URL slug (e.g., "/", "/about")
  requirements: string     // What to accomplish
  sections?: string[]      // Section composites to use
  chromeOverrides?: {      // Optional chrome overrides
    header?: 'inherit' | 'hidden'
    footer?: 'inherit' | 'hidden'
  }
}
```

## Output

| File | Required | Purpose |
|------|----------|---------|
| `site/pages/{pageId}.ts` | Yes | Page schema with sections |
| `site/config.ts` update | Yes | Add page to pages array |

### Verify Before Completion

- [ ] Page file exports `{pageId}Page: PageSchema`
- [ ] Page added to `siteConfig.pages` array
- [ ] Validator passes (exit 0)
- [ ] Data imports from `site/data/` (not inline)

## Workflow

1. **Read contract** - Understand scope
2. **Read spec** - Understand site/page rules
3. **Check existing** - Find similar pages (DRY)
4. **Check data** - What data exists in `site/data/`
5. **Create page** - `site/pages/{pageId}.ts`
6. **Update config** - Add to pages array in `site/config.ts`
7. **Validator runs** - Auto on Write/Edit
8. **Fix if needed** - Address failures
9. **Report** - Return created paths

## Validation

Validated by: `./page-builder.validator.ts`

| Exit | Meaning | Action |
|------|---------|--------|
| `0` | Pass | Continue |
| `1` | Validator crashed | Report bug |
| `2` | Validation failed | Fix and retry |

## Page Template

```typescript
// site/pages/{pageId}.ts
import { PageSchema } from '@/creativeshire/schema'
import { createHeroSection } from '@/creativeshire/content/sections/composites/Hero'
import { someData } from '@/site/data/someData'

export const {pageId}Page: PageSchema = {
  id: '{pageId}',
  slug: '/{slug}',
  sections: [
    createHeroSection({
      id: 'hero',
      title: 'Page Title',
      // Map data from imports
    })
  ],
  // Optional chrome overrides
  chrome: {
    header: 'inherit',
    footer: 'inherit'
  }
}
```

## Anti-Patterns

| Anti-Pattern | Problem | Correct Approach |
|--------------|---------|------------------|
| Inline data arrays | Data mixed with structure | Import from `site/data/` |
| Import experience layer | Direct hook usage | Declare behaviour in schema |
| Forget config update | Page exists but not routable | Add to `siteConfig.pages` |

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| `technical-director` | None (executes directly) |
