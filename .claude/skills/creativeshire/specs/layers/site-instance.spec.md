# Site Instance Layer

> Instance data for a specific site, extending presets with actual content.

---

## Purpose

The Site Instance Layer contains this site's configuration and content. Sites extend presets using spread syntax, overriding specific values while inheriting defaults. The engine lives in `creativeshire/`. Instance data lives in `site/`.

This separation enables:
- Extracting `creativeshire/` to an npm package
- Reusing presets across multiple sites
- Content editors working in `site/` without touching engine code

---

## Owns

```
site/
├── config.ts              # Site configuration
├── pages/                 # Page schemas
│   ├── home.ts
│   ├── about.ts
│   └── work.ts
├── chrome/                # Chrome overrides
│   ├── header.ts
│   └── footer.ts
└── data/                  # Content entries
    ├── projects.ts
    ├── testimonials.ts
    └── social.ts
```

**Concepts owned:**
- Site configuration (mode selection, chrome overrides)
- Page definitions with actual content
- Content data (projects, testimonials, social links)
- Chrome overrides (header, footer modifications)

---

## Receives From

| From Layer | What | Shape |
|------------|------|-------|
| **Preset** | Full configuration | `SitePreset` |
| **Preset** | Page structures | `PageSchema` |
| **Preset** | Chrome defaults | `ChromeSchema` |
| **Preset** | Behaviour mappings | `Record<string, string>` |
| **Schema** | Type definitions | `SiteSchema`, `PageSchema` |
| **Content (L1)** | Section patterns | `createHeroSection()` |
| **Content (L1)** | Widget composites | `createProjectCard()` |

---

## Provides To

| To Layer | What | Shape |
|----------|------|-------|
| **Renderer** | Site configuration | `SiteSchema` |
| **Renderer** | Page definitions | `PageSchema` |
| **App Routes** | Exported schemas | `siteConfig`, `homePage` |

---

## Internal Structure

### Site Config

The root configuration extends a preset and selects experience options.

```typescript
// site/config.ts
import { SiteSchema } from '@/creativeshire/schema'
import { showcasePreset } from '@/creativeshire/presets/showcase'

export const siteConfig: SiteSchema = {
  id: 'my-site',

  experience: {
    ...showcasePreset.experience,
    mode: 'reveal'  // Override mode
  },

  chrome: { ...showcasePreset.chrome },

  pages: [
    { id: 'home', slug: '/' },
    { id: 'about', slug: '/about' },
    { id: 'work', slug: '/work' }
  ]
}
```

### Page Definition

Pages extend preset page structures with actual content.

```typescript
// site/pages/home.ts
import { PageSchema } from '@/creativeshire/schema'
import { showcasePreset } from '@/creativeshire/presets/showcase'
import { createGallerySection } from '@/creativeshire/content/sections/patterns/Gallery'
import { projects } from '@/site/data/projects'

export const homePage: PageSchema = {
  id: 'home',
  slug: '/',

  sections: [
    {
      ...showcasePreset.pages.home.sections[0],
      widgets: [
        {
          type: 'Text',
          props: { content: 'My Actual Headline' },
          className: 'text-6xl font-bold'
        }
      ]
    },

    createGallerySection({
      id: 'work',
      items: projects.map(p => ({
        image: p.thumbnail,
        title: p.title,
        tags: p.tags
      }))
    })
  ]
}
```

### Content Data

Type-safe content entries for the site.

```typescript
// site/data/projects.ts
export interface Project {
  id: string
  title: string
  thumbnail: string
  tags: string[]
  description: string
  link?: string
}

export const projects: Project[] = [
  {
    id: 'project-1',
    title: 'Project One',
    thumbnail: '/images/project-1.jpg',
    tags: ['Design', 'Development'],
    description: 'A cool project'
  }
]
```

### Chrome Overrides

Site-level chrome replaces or extends preset chrome.

```typescript
// site/chrome/header.ts
import { RegionSchema } from '@/creativeshire/schema'

export const header: RegionSchema = {
  widgets: [
    { type: 'Text', props: { content: 'My Logo' } },
    { type: 'Button', props: { content: 'Contact', href: '#contact' } }
  ],
  behaviour: 'hide-on-scroll-down'
}
```

---

## Extension Patterns

### Spread and Override

Use spread syntax to inherit, then override specific values.

```typescript
// Override mode only
experience: {
  ...showcasePreset.experience,
  mode: 'reveal'
}

// Override mode options
experience: {
  ...showcasePreset.experience,
  options: { intensity: 80 }
}
```

### Section Extension

Extend a preset section, replace widgets.

```typescript
{
  ...showcasePreset.pages.home.sections[0],
  widgets: [
    { type: 'Text', props: { content: 'New Headline' } }
  ]
}
```

### Chrome Override Strategies

| Strategy | Effect |
|----------|--------|
| `'inherit'` | Use site chrome (default) |
| `'hidden'` | Hide region for this page |
| `RegionSchema` | Replace with custom region |

```typescript
// site/pages/landing.ts
export const landingPage: PageSchema = {
  id: 'landing',
  slug: '/landing',
  chrome: {
    regions: {
      header: 'hidden',
      footer: 'inherit'
    }
  },
  sections: [...]
}
```

---

## Boundaries

### This layer CAN:

- Extend presets with spread syntax
- Override mode selection
- Override mode options
- Define page structures with actual content
- Override chrome regions per page
- Store content data (projects, testimonials)
- Import from `creativeshire/schema`
- Import from `creativeshire/presets`
- Import from `creativeshire/content` (composites only)

### This layer CANNOT:

- Define new widgets - belongs in **Content Layer (L1)**
- Define new sections - belongs in **Content Layer (L1)**
- Define new modes - belongs in **Experience Layer (L2)**
- Define new behaviours - belongs in **Experience Layer (L2)**
- Define new presets - belongs in **Preset Layer**
- Implement rendering logic - belongs in **Renderer**
- Import from `creativeshire/experience` directly

---

## Resolution Flow

```
Preset defines defaults
        |
        v
Site extends preset (config.ts)
        |
        v
Page extends preset page (pages/*.ts)
        |
        v
Chrome resolves (inherit / hidden / override)
        |
        v
Renderer consumes merged config
        |
        v
Mode defaults resolve behaviours
```

---

## App Route Consumption

Routes import site config and page schemas, pass to `SiteRenderer`.

```typescript
// app/page.tsx
import { siteConfig } from '@/site/config'
import { homePage } from '@/site/pages/home'
import { SiteRenderer } from '@/creativeshire/renderer'

export default function Home() {
  return <SiteRenderer site={siteConfig} page={homePage} />
}
```

---

## Related Documents

- Philosophy: [philosophy.spec.md](../core/philosophy.spec.md)
- Preset Layer: [preset.spec.md](./preset.spec.md)
- Content Layer: [content.spec.md](./content.spec.md)
- Folder Structure: [creativeshire-folder-structure_v2.md](../creativeshire-folder-structure_v2.md)
