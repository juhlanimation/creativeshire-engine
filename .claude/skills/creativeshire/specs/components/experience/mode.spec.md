# Mode Spec

> Animation configuration bundles that define state shape, triggers, and behaviour defaults.

## Purpose

Modes define what animation state is available and how sections behave by default. A mode bundles a Zustand store factory, trigger configurations, and default behaviours. Presets select a mode; the mode determines what animation capabilities exist.

**The hierarchy:**
```
Preset → selects → Mode → provides → State + Triggers + Defaults
                     ↓
                  Behaviours → consume → State via compute()
```

## Concepts

| Term | Definition |
|------|------------|
| Mode | Bundle of state shape, triggers, and behaviour defaults |
| Provides | State fields the mode's store exposes (`scrollProgress`, `sectionProgress`) |
| Triggers | Event listeners that update store fields |
| Defaults | Behaviour assignments for sections and widgets |
| Store Factory | Function that creates the Zustand store for this mode |

## Folder Structure

```
creativeshire/experience/modes/
├── types.ts                    # Mode interface
├── registry.ts                 # Mode collection + lazy loading
├── static/
│   ├── index.ts                # Mode definition
│   └── store.ts                # Zustand store factory (empty state)
├── parallax/
│   ├── index.ts                # Mode definition
│   └── store.ts                # scrollProgress, scrollVelocity, sectionProgress
├── reveal/
│   ├── index.ts                # Mode definition
│   └── store.ts                # sectionVisibility
├── slideshow/
│   ├── index.ts                # Mode definition
│   └── store.ts                # currentSlide, slideProgress
└── cinematic/
    ├── index.ts                # Mode definition
    └── store.ts                # scrollProgress, chapter
```

## Interface

```typescript
// modes/types.ts
export interface Mode {
  id: string
  name: string
  description: string

  // State shape
  provides: string[]              // Fields the store exposes
  createStore: (options?: ModeOptions) => StoreApi<ModeState>

  // Event listeners
  triggers: TriggerConfig[]

  // Behaviour defaults
  defaults: ModeDefaults

  // Configuration
  options: Record<string, OptionConfig>
}

export interface ModeState {
  [key: string]: unknown          // Mode-specific state fields
}

export interface ModeOptions {
  [key: string]: unknown          // Mode-specific options
}

export interface TriggerConfig {
  type: string                    // Trigger identifier
  target: string                  // Store field to update
  options?: Record<string, any>
}

export interface ModeDefaults {
  section: string                 // Default behaviour for all sections
  [widgetType: string]: string    // Default behaviour per widget type
}

export interface OptionConfig {
  type: 'number' | 'boolean' | 'string' | 'select'
  default: unknown
  label: string
  description?: string
  min?: number
  max?: number
  options?: { label: string; value: unknown }[]
}
```

## Built-in Modes

| Mode | Provides | Default Section | Use Case |
|------|----------|-----------------|----------|
| `static` | (none) | `none` | Clean, fast, no animations |
| `parallax` | scrollProgress, scrollVelocity, sectionProgress | `scroll-stack` | Depth-based scroll effects |
| `reveal` | sectionVisibility | `scroll-stack` | Animate on scroll into view |
| `slideshow` | currentSlide, slideProgress | `slide-stack` | Full-screen slides |
| `cinematic` | scrollProgress, chapter | `scroll-stack` | Complex storytelling |

### static Mode

No animation state. Fastest render path.

```typescript
// modes/static/index.ts
export const staticMode: Mode = {
  id: 'static',
  name: 'Static',
  description: 'No animations, fastest rendering',
  provides: [],
  createStore: () => createStore(() => ({})),
  triggers: [],
  defaults: {
    section: 'none'
  },
  options: {}
}
```

### parallax Mode

Scroll-based animation with depth layers.

```typescript
// modes/parallax/index.ts
export const parallaxMode: Mode = {
  id: 'parallax',
  name: 'Parallax',
  description: 'Depth-based scroll effects',
  provides: ['scrollProgress', 'scrollVelocity', 'sectionProgress'],
  createStore: (options) => createParallaxStore(options),
  triggers: [
    { type: 'scroll-progress', target: 'scrollProgress' },
    { type: 'scroll-velocity', target: 'scrollVelocity' },
    { type: 'section-progress', target: 'sectionProgress' }
  ],
  defaults: {
    section: 'scroll-stack',
    Image: 'depth-layer'
  },
  options: {
    damping: {
      type: 'number',
      default: 0.1,
      label: 'Scroll Damping',
      min: 0,
      max: 1
    }
  }
}
```

### reveal Mode

Animate elements when they enter viewport.

```typescript
// modes/reveal/index.ts
export const revealMode: Mode = {
  id: 'reveal',
  name: 'Reveal',
  description: 'Animate on scroll into view',
  provides: ['sectionVisibility'],
  createStore: (options) => createRevealStore(options),
  triggers: [
    { type: 'intersection', target: 'sectionVisibility', options: { threshold: 0.3 } }
  ],
  defaults: {
    section: 'scroll-stack',
    Text: 'fade-in',
    Image: 'slide-in'
  },
  options: {
    threshold: {
      type: 'number',
      default: 0.3,
      label: 'Visibility Threshold',
      min: 0,
      max: 1
    }
  }
}
```

## Mode Resolution

When rendering a section or widget:

```
1. Check for explicit behaviour: 'none' → No wrapper
2. Check for explicit behaviour: 'scroll-stack' → Use it
3. Check mode defaults for widget type → Use if exists
4. Use mode section default → Fallback
5. No default → No wrapper
```

```typescript
function resolveBehaviour(
  schema: { behaviour?: string | BehaviourConfig },
  mode: Mode,
  widgetType?: string
): string | null {
  // Explicit 'none' means no wrapper
  if (schema.behaviour === 'none') return null

  // Explicit behaviour wins
  if (schema.behaviour) {
    return typeof schema.behaviour === 'string'
      ? schema.behaviour
      : schema.behaviour.id
  }

  // Widget type default
  if (widgetType && mode.defaults[widgetType]) {
    return mode.defaults[widgetType]
  }

  // Section default
  return mode.defaults.section || null
}
```

## Rules

### Must

1. Mode exports named constant: `export const {name}Mode: Mode`
2. Mode implements all Mode interface fields
3. `provides` lists exact store field names
4. `createStore` returns Zustand StoreApi
5. `triggers` reference valid trigger types
6. `defaults.section` is required (can be 'none')
7. Default behaviours exist in behaviour registry
8. Options have defaults for all fields

### Must Not

1. Store mutable outside of triggers (use Zustand actions)
2. Direct DOM access in mode definition
3. React hooks in mode definition
4. Side effects in mode definition
5. Circular imports between modes

## Validation Rules

> Each rule maps 1:1 to `mode.validator.ts`

| # | Rule | Function | Check |
|---|------|----------|-------|
| 1 | Exports named Mode constant | `checkExportsMode` | `export const {name}Mode: Mode` |
| 2 | Has id field | `checkHasId` | `id` is non-empty string |
| 3 | Has provides array | `checkHasProvides` | `provides` is string array |
| 4 | Has createStore function | `checkHasCreateStore` | `createStore` is function |
| 5 | Has triggers array | `checkHasTriggers` | `triggers` is TriggerConfig array |
| 6 | Has defaults.section | `checkHasDefaultSection` | `defaults.section` exists |
| 7 | Triggers reference valid types | `checkTriggerTypes` | All trigger types in registry |
| 8 | Default behaviours exist | `checkDefaultBehaviours` | All defaults in behaviour registry |
| 9 | No DOM access | `checkNoDom` | No `document`, `window` |
| 10 | No React imports | `checkNoReact` | No `import * from 'react'` |

## Store Factory Pattern

```typescript
// modes/parallax/store.ts
import { createStore, StoreApi } from 'zustand'

interface ParallaxState {
  scrollProgress: number
  scrollVelocity: number
  sectionProgress: Record<string, number>

  // Actions
  setScrollProgress: (value: number) => void
  setScrollVelocity: (value: number) => void
  setSectionProgress: (id: string, value: number) => void
}

export function createParallaxStore(options?: { damping?: number }): StoreApi<ParallaxState> {
  return createStore<ParallaxState>((set) => ({
    scrollProgress: 0,
    scrollVelocity: 0,
    sectionProgress: {},

    setScrollProgress: (value) => set({ scrollProgress: value }),
    setScrollVelocity: (value) => set({ scrollVelocity: value }),
    setSectionProgress: (id, value) => set((state) => ({
      sectionProgress: { ...state.sectionProgress, [id]: value }
    }))
  }))
}
```

## Mode Registry

```typescript
// modes/registry.ts
import type { Mode } from './types'

const modeLoaders: Record<string, () => Promise<{ default: Mode }>> = {
  static: () => import('./static'),
  parallax: () => import('./parallax'),
  reveal: () => import('./reveal'),
  slideshow: () => import('./slideshow'),
  cinematic: () => import('./cinematic')
}

const modeCache = new Map<string, Mode>()

export async function loadMode(id: string): Promise<Mode> {
  if (modeCache.has(id)) {
    return modeCache.get(id)!
  }

  const loader = modeLoaders[id]
  if (!loader) {
    throw new Error(`Unknown mode: ${id}`)
  }

  const module = await loader()
  modeCache.set(id, module.default)
  return module.default
}

export function getModeIds(): string[] {
  return Object.keys(modeLoaders)
}
```

## Anti-Patterns

| Anti-Pattern | Problem | Correct Approach |
|--------------|---------|------------------|
| DOM access in mode | Breaks SSR | Put DOM in triggers/drivers |
| React hooks in mode | Not a component | Modes are plain objects |
| Mutable state outside store | Unpredictable | All state in Zustand |
| Eager mode imports | Bundle bloat | Use registry with lazy imports |
| Missing default behaviours | Resolution fails | Always define `defaults.section` |

## Integration

| Interacts With | Direction | How |
|----------------|-----------|-----|
| `preset` | Used by | Preset selects mode via `experience.mode` |
| `provider` | Creates | ExperienceProvider receives mode from preset |
| `behaviour` | Consumes | Behaviours consume state from mode's store |
| `trigger` | Initializes | Mode's `triggers` config initializes triggers |
| `driver` | Reads | Driver reads store created by mode |

## See Also

- [Preset Spec](../preset/preset.spec.md) - Mode selection
- [Provider Spec](./provider.spec.md) - Mode distribution
- [Behaviour Spec](./behaviour.spec.md) - State consumption
- [Trigger Spec](./trigger.spec.md) - Store updates

## Validator

Validated by: `./mode.validator.ts`

Rules in "Must/Must Not" map 1:1 to validator checks.
