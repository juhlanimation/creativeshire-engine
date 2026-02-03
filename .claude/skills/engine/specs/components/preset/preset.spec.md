# Preset Spec

> Bundled configurations combining experience mode, behaviour defaults, chrome setup, and page templates.

## Purpose

Presets bundle animation configuration and content structure into ready-to-use starting points. A preset defines the mode (state + triggers + behaviour defaults), chrome regions, page templates, and widget-to-behaviour mappings. Sites extend presets via spread syntax. Experiences provide user-selectable wrapper rules for sections.

## Concepts

| Term | Definition |
|------|------------|
| Preset | Complete site starting point (mode + chrome + pages) |
| Mode | State provider + triggers + behaviour defaults |
| Experience | User-selectable wrapper rules for sections |
| Chrome | Header, footer, sidebar, overlay regions |
| Trigger | Store field + update configuration |

## Folder Structure

```
engine/presets/
├── types.ts                  # SitePreset, Mode, Experience interfaces
├── {preset-name}/
│   ├── index.ts              # SitePreset export
│   ├── site.ts               # Site-level defaults
│   ├── pages/                # Page structure templates
│   │   ├── home.ts
│   │   └── about.ts
│   └── chrome/               # Chrome configuration
│       ├── header.ts
│       └── footer.ts

engine/experience/modes/
├── types.ts                  # Mode interface
├── registry.ts               # Mode collection
├── {mode-name}/
│   ├── index.ts              # Mode definition
│   └── store.ts              # Zustand store factory

engine/experience/experiences/
├── types.ts                  # ExperienceDefinition interface
├── registry.ts               # Experience collection
└── {experience-name}.ts      # Experience definition
```

## Interface

### SitePreset

```typescript
// presets/types.ts
interface SitePreset {
  experience: PresetExperienceConfig
  chrome: PresetChromeConfig
  pages: { [pageId: string]: PageSchema }
  behaviours?: { [widgetType: string]: string }
}

interface PresetExperienceConfig {
  mode: string                          // Mode ID
  options?: Record<string, any>         // Mode-specific options
}

interface PresetChromeConfig {
  regions: {
    header?: RegionSchema | 'hidden'
    footer?: RegionSchema | 'hidden'
    sidebar?: RegionSchema | 'hidden'
  }
  overlays?: { [overlayId: string]: OverlaySchema }
}
```

### Mode

See [Mode Spec](../experience/mode.spec.md) for full interface definition.

Key fields: `id`, `provides` (state fields), `createStore`, `triggers`, `defaults` (section/widget behaviours).

### Experience

See [Mode Spec](../experience/mode.spec.md) for Experience interface.

Key fields: `mode` (underlying mode), `wrappers` (byPosition, byType, default), `allowBehaviourOverride`.

## Available Modes

| Mode | Provides | Default Page | Default Section | Use Case |
|------|----------|--------------|-----------------|----------|
| `static` | Nothing | `none` | `none` | Clean, fast, no animations |
| `parallax` | scrollProgress, scrollVelocity, sectionProgress | `page-fade` | `scroll-stack` | Depth-based scroll |
| `reveal` | sectionVisibility | `page-fade` | `scroll-stack` | Animate on scroll into view |
| `slideshow` | currentSlide, slideProgress | `page-crossfade` | `slide-stack` | Full-screen slides |
| `cinematic` | scrollProgress, chapter | `page-fade` | `scroll-stack` | Complex storytelling |

## Available Presets

| Preset | Mode | Use Case |
|--------|------|----------|
| `starter` | `static` | Minimal, no animations |
| `showcase` | `parallax` | Visual-heavy, gallery-focused |
| `editorial` | `reveal` | Text-focused, content-heavy |
| `immersive` | `cinematic` | Full-screen, storytelling |

## Rules

### Must

1. Preset exports named constant: `export const {name}Preset: SitePreset`
2. Preset includes `site.ts` with `siteDefaults` export
3. At least one page defined in `pages/`
4. Chrome header and footer defined (or explicitly `'hidden'`)
5. Mode `id` is unique and kebab-case
6. Mode `provides` lists all state fields from store
7. Mode `createStore` returns Zustand store with all declared fields
8. Mode `triggers` reference valid trigger types
9. Mode `defaults.section` always defined
10. Experience `wrappers.default` always present
11. Experience `mode` references valid mode from registry
12. All behaviour IDs reference registered behaviours
13. All content props use binding expressions: `'{{ content.xxx }}'`
14. No hardcoded emails, URLs, or placeholder text in presets
15. No empty arrays for content (use `'{{ content.xxx }}'` instead)

### Must Not

1. Import from `site/*` (presets are portable)
2. Hardcode instance data (use empty arrays, placeholders)
3. Modify preset at runtime (use spread override)
4. Missing section default in mode
5. Missing default wrapper in experience
6. DOM manipulation in mode store
7. JSX in experience definitions
8. Import from barrel files directly (use direct paths or optimizePackageImports)
9. Eagerly import heavy components (use next/dynamic with ssr: false)
10. Block initial bundle with analytics/logging (defer after hydration)

## Validation Rules

> Each rule maps 1:1 to `preset.validator.ts`

| # | Rule | Function | Files |
|---|------|----------|-------|
| 1 | Exports named preset | `checkExportsPreset` | `index.ts` |
| 2 | Has site defaults | `checkSiteDefaults` | `site.ts` |
| 3 | Has home page | `checkHomePage` | `pages/` |
| 4 | Valid mode reference | `checkModeReference` | `index.ts` |
| 5 | No site imports | `checkNoSiteImports` | `*.ts` |
| 6 | Mode has section default | `checkSectionDefault` | `modes/*/index.ts` |
| 7 | Mode provides matches store | `checkProvidesMatchStore` | `modes/*/index.ts` |
| 8 | Experience has default wrapper | `checkDefaultWrapper` | `experiences/*.ts` |
| 9 | Experience references valid mode | `checkExperienceMode` | `experiences/*.ts` |
| 10 | Behaviours exist | `checkBehavioursExist` | `*.ts` |
| 14 | No barrel file imports | `checkNoBarrelImports` | `*.ts` |
| 15 | Heavy components lazy loaded | `checkDynamicImports` | `*.tsx` |
| 16 | Non-critical libs deferred | `checkDeferredThirdParty` | `*.tsx` |

## Behaviour Resolution Flow

### Page Transitions

```
Page schema
        |
        v
Has explicit transition?
    |
    +-- YES --> Use page.transition (enter/exit)
    |
    +-- NO --> Check mode.defaults.page
              |
              +-- Has default --> Use mode default
              |
              +-- No default --> Instant (no transition)
```

### Sections and Widgets

```
Widget/Section schema
        |
        v
Has explicit behaviour: 'none'?
    |
    +-- YES --> No wrapper
    |
    +-- NO --> Has explicit behaviour?
              |
              +-- YES --> Use that behaviour
              |
              +-- NO --> Check mode.defaults[type]
                        |
                        +-- Has default --> Use mode default
                        |
                        +-- No default --> No wrapper
```

## Extension Pattern

Sites extend presets, never modify them.

```typescript
// site/config.ts
import { showcasePreset } from '@/engine/presets/showcase'

export const siteConfig: SiteSchema = {
  id: 'my-site',
  experience: {
    ...showcasePreset.experience,
    mode: 'reveal'  // Override mode
  },
  chrome: { ...showcasePreset.chrome },
  pages: [
    { id: 'home', slug: '/' },
    { id: 'about', slug: '/about' }
  ]
}
```

## Template

### Preset

```typescript
// presets/{name}/index.ts
import { SitePreset } from '../types'
import { siteDefaults } from './site'
import { homePage } from './pages/home'
import { header, footer } from './chrome'

export const {name}Preset: SitePreset = {
  experience: siteDefaults.experience,
  chrome: { regions: { header, footer }, overlays: {} },
  pages: { home: homePage },
  behaviours: siteDefaults.behaviours
}
```

### Mode

```typescript
// modes/{name}/index.ts
import { create } from 'zustand'
import { Mode } from '../types'

export const {name}Mode: Mode = {
  id: '{name}',
  name: '{Name}',
  description: '...',
  provides: ['scrollProgress', 'sectionProgress'],
  createStore: (options = {}) => create((set, get) => ({
    scrollProgress: 0,
    setScrollProgress: (v: number) => set({ scrollProgress: v }),
    sections: new Map(),
    updateSection: (id, state) => { /* ... */ }
  })),
  triggers: [
    { type: 'scroll-progress', target: 'scrollProgress' },
    { type: 'intersection', target: 'sections' }
  ],
  defaults: {
    page: 'page-fade',
    section: 'scroll-stack',
    Image: 'depth-layer',
    Text: 'fade-on-scroll'
  },
  options: {
    intensity: { type: 'range', label: 'Intensity', default: 50, min: 0, max: 100 }
  }
}
```

### Experience

```typescript
// experiences/{name}.ts
export const {name}Experience: ExperienceDefinition = {
  id: '{name}',
  name: '{Name}',
  mode: 'parallax',
  wrappers: {
    byPosition: {
      first: { behaviour: 'depth-layer', required: false, positionLocked: false }
    },
    byType: {
      gallery: { behaviour: 'scroll-stack', required: false, positionLocked: false }
    },
    default: { behaviour: 'fade-on-scroll', required: false, positionLocked: false }
  },
  allowBehaviourOverride: true
}
```

## Bundle Optimization

See [Registry Spec](../renderer/registry.spec.md#bundle-implications) for detailed bundle strategies.

**Key patterns:**
- Use dynamic imports for modes: `() => import('./mode')`
- Eager-load core widgets, lazy-load heavy ones
- Use `optimizePackageImports` or direct paths (avoid barrel files)

| Approach | Initial Bundle | When Loaded |
|----------|----------------|-------------|
| Eager (all modes) | ~50KB | Immediate |
| Lazy (selected mode) | ~5KB | +20-100ms |

**Rule:** Use lazy loading unless site uses only one mode permanently.

---

## Anti-Patterns

| Anti-Pattern | Problem | Correct Approach |
|--------------|---------|------------------|
| Hardcode instance data | Content in preset | Use binding expressions: `{{ content.xxx }}` |
| Empty arrays for content | `projects: []` | Use binding: `'{{ content.projects }}'` |
| Literal emails/URLs | `'hello@example.com'` | Use binding: `'{{ content.email }}'` |
| Import from `site/*` | Breaks portability | Presets are self-contained |
| Missing section default | Undefined behaviour | Always define `defaults.section` |
| DOM manipulation in store | Store holds state only | Drivers modify DOM |
| Missing default wrapper | Undefined experience | Always define `wrappers.default` |
| Eager mode imports | Bloated bundle | Use dynamic imports via registry |
| Barrel file imports | Loads entire library | Direct imports or optimizePackageImports |
| Eager analytics import | Blocks hydration | `dynamic(() => import(), { ssr: false })` |
| No preload on user intent | Slow perceived load | Preload on hover/focus for heavy modules |

## Binding Expressions

Presets define structure; platform provides content. Use binding expressions for all content values.

### Syntax

```typescript
// Scalar values
props: { email: '{{ content.footer.email }}' }

// Arrays
props: { projects: '{{ content.projects.featured }}' }

// Nested paths
props: { src: '{{ content.about.photo.src }}' }
```

### Resolution

Engine passes binding expressions as opaque strings. Platform resolves them at runtime by:
1. Parsing `{{ content.xxx }}` syntax
2. Looking up value in content store
3. Substituting resolved value into props

### Content Schema

Each preset should document its expected content structure:

```typescript
// presets/bojuhl/content-schema.ts
export interface BojuhlContentSchema {
  hero: { introText: string; roles: string[]; videoSrc: string }
  about: { bioParagraphs: string[]; signature: string; photoSrc: string; photoAlt: string; clientLogos: LogoData[] }
  projects: { featured: ProjectData[]; other: ProjectData[]; otherHeading: string; yearRange: string }
  footer: { email: string; navLinks: LinkData[]; contactHeading: string; linkedinUrl: string; studioHeading: string; studioUrl: string; studioEmail: string; studioSocials: SocialData[]; copyright: string }
  contact: { promptText: string; email: string }
  head: { title: string; description: string }
}
```

## Testing

> **Recommended.** Presets bundle configuration — test structure and references.

### What to Test

| Test | Required | Why |
|------|----------|-----|
| Exports named preset | ✓ | Registry lookup |
| Has experience.mode | ✓ | Mode selection |
| Chrome regions defined | ✓ | Chrome resolution |
| Pages have structure | ✓ | Routing works |
| Behaviours reference exist | ✓ | Resolution works |

### Test Location

```
engine/presets/{name}/
├── index.ts
└── index.test.ts    # Preset validation
```

### Test Template

```typescript
// presets/showcase/index.test.ts
import { describe, it, expect } from 'vitest'
import { showcasePreset } from './index'
import { modeRegistry } from '@/engine/experience/modes/registry'
import { behaviourRegistry } from '@/engine/experience/behaviours/registry'

describe('showcasePreset', () => {
  describe('structure', () => {
    it('has required experience config', () => {
      expect(showcasePreset.experience).toBeDefined()
      expect(showcasePreset.experience.mode).toBeDefined()
    })

    it('has chrome configuration', () => {
      expect(showcasePreset.chrome).toBeDefined()
      expect(showcasePreset.chrome.regions).toBeDefined()
    })

    it('has at least one page', () => {
      expect(Object.keys(showcasePreset.pages).length).toBeGreaterThan(0)
    })
  })

  describe('references', () => {
    it('mode exists in registry', () => {
      const modeId = showcasePreset.experience.mode
      expect(modeRegistry[modeId]).toBeDefined()
    })

    it('default behaviours exist', () => {
      const behaviours = showcasePreset.behaviours ?? {}
      Object.values(behaviours).forEach(behaviourId => {
        expect(behaviourRegistry.has(behaviourId)).toBe(true)
      })
    })
  })
})
```

### Definition of Done

A preset is complete when:

- [ ] All tests pass: `npm test -- presets/{name}`
- [ ] Mode reference valid
- [ ] Behaviour references valid
- [ ] Chrome configured
- [ ] At least one page defined

### Running Tests

```bash
# Single preset
npm test -- presets/showcase

# All presets
npm test -- presets/
```

---

## Integration

| Interacts With | Direction | How |
|----------------|-----------|-----|
| `behaviour` | References | Mode defaults map to behaviour IDs |
| `trigger` | References | Mode triggers list specifies triggers |
| `provider` | Consumed by | Provider receives mode from preset |
| `driver` | Indirect | Driver uses mode's store for state |
| Site config | Extended by | Sites spread presets for customization |

## Validator

Validated by: `./preset.validator.ts`

Rules in "Must/Must Not" map 1:1 to validator checks.

---

## Example: Simplest Site

See [Site Spec - Simplest Site Example](../site/site.spec.md#example-simplest-site-end-to-end) for the complete end-to-end flow.

**Quick summary:**
1. Site extends `starterPreset`, overrides `mode: 'reveal'`
2. `revealMode` provides `sectionVisibility` state
3. Sections use `fade-in` behaviour by default
4. Widgets render with CSS variables from behaviour compute

```
Preset → Mode → Triggers → Store → Behaviour → CSS Variables → Widget
```
