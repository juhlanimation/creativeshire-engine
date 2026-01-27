# Site Spec

> Instance-specific configuration and content for one particular website.

## Purpose

The Site Instance contains configuration and content for this specific website. Sites extend presets from `creativeshire/presets/` using spread syntax, overriding specific values while inheriting defaults. The engine lives in `creativeshire/`. Instance data lives in `site/`.

## Concepts

| Term | Definition |
|------|------------|
| Site Instance | Configuration and content for one website |
| Preset | Reusable configuration template from creativeshire |
| Page Reference | Pointer to a page with id and slug |
| Chrome Override | Page-level header/footer customization |

## Folder Structure

```
site/
├── config.ts              # SiteSchema export
├── pages/                 # Page schemas
│   ├── home.ts
│   ├── about.ts
│   └── work.ts
├── chrome/                # Chrome overrides
│   ├── header.ts
│   └── footer.ts
└── data/                  # Content data
    ├── projects.ts
    ├── testimonials.ts
    └── social.ts
```

## Interface

```typescript
// site/config.ts
export const siteConfig: SiteSchema = {
  id: string
  experience: ExperienceConfig
  chrome: ChromeSchema
  pages: PageReference[]
}

// site/pages/{pageId}.ts
export const {pageId}Page: PageSchema = {
  id: string
  slug: string
  sections: SectionSchema[]
  chrome?: PageChromeOverrides
}

// site/data/*.ts
export interface {Type} { ... }
export const {name}: {Type}[] = [...]
```

## Rules

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

## Validation Rules

> Each rule maps 1:1 to `site.validator.ts`

| # | Rule | Function | Files |
|---|------|----------|-------|
| 1 | Extends preset | `checkExtendsPreset` | `config.ts` |
| 2 | Uses spread syntax | `checkSpreadSyntax` | `config.ts` |
| 3 | Exports siteConfig | `checkSiteConfigExport` | `config.ts` |
| 4 | No experience imports | `checkNoExperienceImports` | `pages/*.ts` |
| 5 | No inline data | `checkNoInlineData` | `pages/*.ts` |
| 6 | Data files pure | `checkDataFilesPure` | `data/*.ts` |
| 7 | Page exports named | `checkPageExport` | `pages/*.ts` |

## Extension Patterns

### Spread and Override

```typescript
// site/config.ts
import { showcasePreset } from '@/creativeshire/presets/showcase'

export const siteConfig: SiteSchema = {
  id: 'my-site',
  experience: {
    ...showcasePreset.experience,
    mode: 'reveal'  // Override mode only
  },
  chrome: { ...showcasePreset.chrome },
  pages: [
    { id: 'home', slug: '/' },
    { id: 'about', slug: '/about' }
  ]
}
```

### Page with Data

```typescript
// site/pages/home.ts
import { createGallerySection } from '@/creativeshire/content/sections/composites/Gallery'
import { projects } from '@/site/data/projects'

export const homePage: PageSchema = {
  id: 'home',
  slug: '/',
  sections: [
    createGallerySection({
      id: 'work',
      items: projects.map(p => ({
        image: p.thumbnail,
        title: p.title
      }))
    })
  ]
}
```

## Chrome Override Strategies

| Strategy | Effect |
|----------|--------|
| `'inherit'` | Use site chrome (default) |
| `'hidden'` | Hide region for this page |
| `RegionSchema` | Replace with custom region |

## Template

```typescript
// site/config.ts
import { SiteSchema } from '@/creativeshire/schema'
import { showcasePreset } from '@/creativeshire/presets/showcase'

export const siteConfig: SiteSchema = {
  id: 'my-site',
  experience: { ...showcasePreset.experience },
  chrome: { ...showcasePreset.chrome },
  pages: [
    { id: 'home', slug: '/' }
  ]
}
```

```typescript
// site/pages/home.ts
import { PageSchema } from '@/creativeshire/schema'

export const homePage: PageSchema = {
  id: 'home',
  slug: '/',
  sections: []
}
```

```typescript
// site/data/projects.ts
export interface Project {
  id: string
  title: string
}

export const projects: Project[] = []
```

## Anti-Patterns

### Don't: Modify creativeshire

```typescript
// WRONG - Never modify engine code
// creativeshire/content/widgets/Text/index.tsx
export default function Text({ myCustomProp }) { ... }
```

**Why:** Instance customization via schema, not source modification.

### Don't: Import experience directly

```typescript
// WRONG - Site cannot access experience layer
import { useScrollProgress } from '@/creativeshire/experience/triggers'
```

**Why:** Use schema to declare behaviour: `{ behaviour: 'depth-layer' }`.

### Don't: Inline data in pages

```typescript
// WRONG - Inline data
sections: [
  createGallerySection({
    items: [{ title: 'Project 1' }, { title: 'Project 2' }]  // NO
  })
]
```

**Why:** Data lives in `site/data/`. Import and map.

### Don't: Mutate presets

```typescript
// WRONG - Direct mutation
showcasePreset.experience.mode = 'reveal'
```

**Why:** Spread into new object to preserve immutability.

## Integration

| Interacts With | Direction | How |
|----------------|-----------|-----|
| `creativeshire/presets` | Imports | Extends preset configurations |
| `creativeshire/schema` | Imports | Uses type definitions |
| `creativeshire/content/sections/composites` | Imports | Section factory functions |
| `app/` | Provides | Data for route components |

## Validator

Validated by: `./site.validator.ts`

Rules in "Must/Must Not" map 1:1 to validator checks.
