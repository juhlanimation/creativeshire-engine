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
  transition?: PageTransitionConfig  // Page enter/exit behaviour
}

// Page transition configuration
interface PageTransitionConfig {
  enter?: BehaviourConfig    // Behaviour when navigating TO this page
  exit?: BehaviourConfig     // Behaviour when navigating FROM this page
  duration?: number          // Transition duration in ms (default: 300)
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

## Page Transitions

Pages can define enter/exit behaviours for navigation animations.

### Available Transitions

| Transition | Effect |
|------------|--------|
| `page-fade` | Fade in/out (default) |
| `page-slide-left` | Slide from/to left |
| `page-slide-right` | Slide from/to right |
| `page-slide-up` | Slide from/to top |
| `page-crossfade` | Crossfade with previous page |
| `none` | Instant swap |

### Resolution

```
1. Page has explicit transition → Use it
2. Mode has page default → Use mode default
3. No default → No transition (instant)
```

### Example

```typescript
// site/pages/home.ts
export const homePage: PageSchema = {
  id: 'home',
  slug: '/',
  sections: [...],
  transition: {
    enter: 'page-fade',
    exit: 'page-slide-left',
    duration: 400
  }
}
```

### With Options

```typescript
transition: {
  enter: { id: 'page-slide-up', options: { distance: 100 } },
  exit: 'page-fade'
}
```

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

## Testing

> **Schema validation.** Site configs are data — validate structure.

### What to Test

| Test | Required | Why |
|------|----------|-----|
| Config exports correctly | ✓ | Runtime requirement |
| Extends preset via spread | ✓ | Inheritance pattern |
| All pages have id and slug | ✓ | Routing works |
| Chrome config present | ✓ | Regions resolve |

### Test Location

```
site/
├── config.ts
├── config.test.ts    # Config validation
├── pages/
│   ├── home.ts
│   └── home.test.ts  # Page schema validation
```

### Test Template

```typescript
// site/config.test.ts
import { describe, it, expect } from 'vitest'
import { siteConfig } from './config'

describe('siteConfig', () => {
  it('has required fields', () => {
    expect(siteConfig.id).toBeDefined()
    expect(siteConfig.experience).toBeDefined()
    expect(siteConfig.chrome).toBeDefined()
    expect(siteConfig.pages).toBeInstanceOf(Array)
  })

  it('all pages have id and slug', () => {
    siteConfig.pages.forEach(page => {
      expect(page.id).toBeDefined()
      expect(page.slug).toBeDefined()
    })
  })

  it('has experience mode', () => {
    expect(siteConfig.experience.mode).toBeDefined()
  })
})
```

```typescript
// site/pages/home.test.ts
import { describe, it, expect } from 'vitest'
import { homePage } from './home'

describe('homePage', () => {
  it('has required fields', () => {
    expect(homePage.id).toBe('home')
    expect(homePage.slug).toBe('/')
    expect(homePage.sections).toBeInstanceOf(Array)
  })

  it('sections have ids', () => {
    homePage.sections.forEach(section => {
      expect(section.id).toBeDefined()
    })
  })
})
```

### Definition of Done

A site config is complete when:

- [ ] Config exports siteConfig correctly
- [ ] All pages referenced in config exist
- [ ] Validator passes: `npm run validate -- site/`
- [ ] No TypeScript errors

### Running Tests

```bash
npm test -- site/
```

---

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

---

## Example: Simplest Site (End-to-End)

> Complete example from site config to rendered widget. Follow this pattern when building a new site.

### 1. Site Config

```typescript
// site/config.ts
import { SiteSchema } from '@/creativeshire/schema'
import { starterPreset } from '@/creativeshire/presets/starter'

export const siteConfig: SiteSchema = {
  id: 'portfolio',
  experience: {
    ...starterPreset.experience,
    mode: 'reveal'  // Sections fade in on scroll
  },
  chrome: { ...starterPreset.chrome },
  pages: [{ id: 'home', slug: '/' }]
}
```

### 2. Mode (reveal)

Provides `sectionVisibility` state updated by intersection trigger.

```typescript
// creativeshire/experience/modes/reveal/index.ts
export const revealMode: Mode = {
  id: 'reveal',
  provides: ['sectionVisibility'],
  triggers: [
    { type: 'intersection', target: 'sectionVisibility', options: { threshold: 0.3 } }
  ],
  defaults: {
    page: 'page-fade',
    section: 'fade-in'  // Default behaviour for sections
  }
}
```

### 3. Behaviour (fade-in)

Consumes `sectionVisibility`, outputs CSS variables.

```typescript
// creativeshire/experience/behaviours/fade-in/index.ts
const fadeIn: Behaviour = {
  id: 'fade-in',
  requires: ['sectionVisibility'],
  compute: (state) => ({
    '--opacity': Math.min(1, state.sectionVisibility * 1.5),
    '--y': (1 - state.sectionVisibility) * 20
  }),
  cssTemplate: `
    opacity: var(--opacity, 0);
    transform: translateY(calc(var(--y, 20) * 1px));
  `
}
```

### 4. Widget Composite (ProjectCard)

Composes existing widgets into a reusable pattern.

```typescript
// creativeshire/content/widgets/composites/ProjectCard/types.ts
export interface ProjectCardProps {
  title: string
  image: string
  tags?: string[]
}

// creativeshire/content/widgets/composites/ProjectCard/index.ts
import { WidgetSchema } from '@/creativeshire/schema'
import { ProjectCardProps } from './types'

export function createProjectCard(props: ProjectCardProps): WidgetSchema {
  return {
    type: 'Stack',
    features: { spacing: { gap: 12 } },
    widgets: [
      { type: 'Image', props: { src: props.image, alt: props.title } },
      { type: 'Text', props: { content: props.title, as: 'h3' } },
      {
        type: 'Flex',
        features: { spacing: { gap: 8 } },
        widgets: (props.tags ?? []).map(tag => ({
          type: 'Badge',
          props: { label: tag }
        }))
      }
    ]
  }
}
```

### 5. Section Composite (Gallery)

Uses ProjectCard composite for a gallery layout.

```typescript
// creativeshire/content/sections/composites/Gallery/index.ts
import { SectionSchema } from '@/creativeshire/schema'
import { createProjectCard } from '@/creativeshire/content/widgets/composites/ProjectCard'

export interface GalleryProps {
  id?: string
  items: { title: string; image: string; tags?: string[] }[]
}

export function createGallerySection(props: GalleryProps): SectionSchema {
  return {
    id: props.id ?? 'gallery',
    layout: { type: 'grid', columns: 3, gap: 24 },
    behaviour: 'fade-in',  // ← Uses fade-in behaviour
    widgets: props.items.map(item => createProjectCard(item))
  }
}
```

### 6. Page Schema

Assembles sections into a page.

```typescript
// site/pages/home.ts
import { PageSchema } from '@/creativeshire/schema'
import { createHeroSection } from '@/creativeshire/content/sections/composites/Hero'
import { createGallerySection } from '@/creativeshire/content/sections/composites/Gallery'
import { projects } from '@/site/data/projects'

export const homePage: PageSchema = {
  id: 'home',
  slug: '/',
  sections: [
    createHeroSection({
      headline: 'My Work',
      cta: { label: 'View Projects', href: '#gallery' }
    }),
    createGallerySection({
      id: 'gallery',
      items: projects
    })
  ]
}
```

### 7. Data

```typescript
// site/data/projects.ts
export const projects = [
  { title: 'Project A', image: '/images/a.jpg', tags: ['React'] },
  { title: 'Project B', image: '/images/b.jpg', tags: ['Next.js'] }
]
```

### Complete Data Flow

```
site/config.ts (mode: 'reveal')
       │
       ▼
revealMode.triggers (intersection observer)
       │
       ▼
revealMode.store (sectionVisibility: 0.7)
       │
       ▼
fadeIn.compute({ sectionVisibility: 0.7 })
       │
       ▼
CSS Variables (--opacity: 1, --y: 0)
       │
       ▼
Driver (element.style.setProperty)
       │
       ▼
Section → ProjectCard → Image, Text, Badge
       (all read CSS variables for animation)
```

### Summary

| Layer | File | Purpose |
|-------|------|---------|
| Site | `site/config.ts` | Selects mode, extends preset |
| Mode | `modes/reveal/index.ts` | Defines state + triggers + defaults |
| Behaviour | `behaviours/fade-in/index.ts` | Maps state → CSS variables |
| Section Composite | `sections/composites/Gallery/index.ts` | Returns SectionSchema |
| Widget Composite | `widgets/composites/ProjectCard/index.ts` | Returns WidgetSchema |
| Widgets | `widgets/content/Image/index.tsx` | Renders DOM, reads CSS vars |
| Data | `site/data/projects.ts` | Content arrays |
| Page | `site/pages/home.ts` | Composes sections |
