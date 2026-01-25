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
creativeshire/presets/
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

creativeshire/experience/modes/
├── types.ts                  # Mode interface
├── registry.ts               # Mode collection
├── {mode-name}/
│   ├── index.ts              # Mode definition
│   └── store.ts              # Zustand store factory

creativeshire/experience/experiences/
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

```typescript
// modes/types.ts
interface Mode {
  id: string
  name: string
  description: string
  provides: string[]                    // State fields the store exposes
  createStore: (options?: Record<string, any>) => StoreApi<any>
  triggers: TriggerConfig[]             // Triggers to initialize
  defaults: {
    section: string                     // Default for all sections
    [widgetType: string]: string        // Default per widget type
  }
  options: Record<string, OptionConfig>
}

interface TriggerConfig {
  type: string              // Trigger identifier
  target: string            // Store field to update
  options?: Record<string, any>
}
```

### Experience

```typescript
// experiences/types.ts
interface ExperienceDefinition {
  id: string
  name: string
  mode: ModeId                          // Underlying mode for state
  wrappers: {
    byPosition?: { first?: WrapperRule; last?: WrapperRule }
    byType?: { [sectionType: string]: WrapperRule }
    default: WrapperRule
  }
  appendedSections?: AppendedSection[]
  allowBehaviourOverride: boolean
}

interface WrapperRule {
  behaviour: BehaviourId
  required: boolean        // Cannot delete section
  positionLocked: boolean  // Cannot reorder section
  options?: Record<string, any>
}
```

## Available Modes

| Mode | Provides | Default Section | Use Case |
|------|----------|-----------------|----------|
| `static` | Nothing | `none` | Clean, fast, no animations |
| `parallax` | scrollProgress, scrollVelocity, sectionProgress | `scroll-stack` | Depth-based scroll |
| `reveal` | sectionVisibility | `scroll-stack` | Animate on scroll into view |
| `slideshow` | currentSlide, slideProgress | `slide-stack` | Full-screen slides |
| `cinematic` | scrollProgress, chapter | `scroll-stack` | Complex storytelling |

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

### Lazy Mode Loading

Modes bundle behaviours, drivers, and store logic. Loading all modes eagerly bloats the initial bundle. Load only the selected mode.

#### Pattern: Dynamic Mode Import

```typescript
// modes/registry.ts
export const modeRegistry = {
  static: () => import('./static'),
  parallax: () => import('./parallax'),
  reveal: () => import('./reveal'),
  cinematic: () => import('./cinematic'),
} as const

export type ModeId = keyof typeof modeRegistry
```

#### Pattern: Mode Provider with Lazy Loading

```typescript
// experience/ModeProvider.tsx
'use client'
import { Suspense, lazy, useMemo } from 'react'
import { modeRegistry, ModeId } from './modes/registry'

interface ModeProviderProps {
  modeId: ModeId
  children: React.ReactNode
}

export function ModeProvider({ modeId, children }: ModeProviderProps) {
  // Create lazy component for selected mode
  const ModeComponent = useMemo(() => {
    return lazy(async () => {
      const mod = await modeRegistry[modeId]()
      return { default: mod.ModeProvider }
    })
  }, [modeId])

  return (
    <Suspense fallback={<ModeLoadingFallback />}>
      <ModeComponent>{children}</ModeComponent>
    </Suspense>
  )
}

function ModeLoadingFallback() {
  // Render children immediately with no animations
  // Mode hydrates once loaded
  return null
}
```

#### Validation Rules

| # | Rule | Check |
|---|------|-------|
| 11 | Modes use dynamic import | `import('./mode')` not `import from` |
| 12 | Mode registry doesn't import eagerly | Factory pattern |
| 13 | Unused modes not in bundle | Bundle analysis |

#### Bundle Impact

| Approach | Initial Bundle | When Mode Loads |
|----------|----------------|-----------------|
| Eager (all modes) | ~50KB | Immediate |
| Lazy (selected mode) | ~5KB | +20-100ms on first use |

**Rule:** Use lazy loading unless the site uses only one mode permanently.

---

## Anti-Patterns

| Anti-Pattern | Problem | Correct Approach |
|--------------|---------|------------------|
| Hardcode instance data | Content in preset | Use empty arrays; site fills data |
| Import from `site/*` | Breaks portability | Presets are self-contained |
| Missing section default | Undefined behaviour | Always define `defaults.section` |
| DOM manipulation in store | Store holds state only | Drivers modify DOM |
| Missing default wrapper | Undefined experience | Always define `wrappers.default` |
| Eager mode imports | Bloated bundle | Use dynamic imports via registry |
| Barrel file imports | Loads entire library | Direct imports or optimizePackageImports |
| Eager analytics import | Blocks hydration | `dynamic(() => import(), { ssr: false })` |
| No preload on user intent | Slow perceived load | Preload on hover/focus for heavy modules |

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
