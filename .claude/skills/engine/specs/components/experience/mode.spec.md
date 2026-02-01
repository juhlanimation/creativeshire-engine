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
engine/experience/modes/
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
  page?: string                   // Default page transition (enter/exit)
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

| Mode | Provides | Default Page | Default Section | Use Case |
|------|----------|--------------|-----------------|----------|
| `static` | (none) | `none` | `none` | Clean, fast, no animations |
| `parallax` | scrollProgress, scrollVelocity, sectionProgress | `page-fade` | `scroll-stack` | Depth-based scroll effects |
| `reveal` | sectionVisibility | `page-fade` | `scroll-stack` | Animate on scroll into view |
| `slideshow` | currentSlide, slideProgress | `page-crossfade` | `slide-stack` | Full-screen slides |
| `cinematic` | scrollProgress, chapter | `page-fade` | `scroll-stack` | Complex storytelling |

### Mode Examples

```typescript
// static - No animation, fastest render
export const staticMode: Mode = {
  id: 'static', provides: [], triggers: [],
  defaults: { page: 'none', section: 'none' },
  createStore: () => createStore(() => ({}))
}

// parallax - Depth-based scroll effects
export const parallaxMode: Mode = {
  id: 'parallax',
  provides: ['scrollProgress', 'scrollVelocity', 'sectionProgress'],
  triggers: [
    { type: 'scroll-progress', target: 'scrollProgress' },
    { type: 'scroll-velocity', target: 'scrollVelocity' },
    { type: 'section-progress', target: 'sectionProgress' }
  ],
  defaults: { page: 'page-fade', section: 'scroll-stack', Image: 'depth-layer' },
  options: { damping: { type: 'number', default: 0.1, min: 0, max: 1 } }
}

// reveal - Animate on scroll into view
export const revealMode: Mode = {
  id: 'reveal',
  provides: ['sectionVisibility'],
  triggers: [{ type: 'intersection', target: 'sectionVisibility', options: { threshold: 0.3 } }],
  defaults: { page: 'page-fade', section: 'scroll-stack', Text: 'fade-in', Image: 'slide-in' },
  options: { threshold: { type: 'number', default: 0.3, min: 0, max: 1 } }
}
```

## Mode Resolution

### Page Transitions

When navigating between pages:

```
1. Page has explicit transition → Use it
2. Mode has page default → Use mode default
3. No default → Instant swap (no transition)
```

### Sections and Widgets

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

## Testing

> **Recommended.** Modes are configuration objects — test structure and store factory.

### What to Test

| Test | Required | Why |
|------|----------|-----|
| Mode exports correctly | ✓ | Registry expects named export |
| Has required fields | ✓ | Interface compliance |
| Store factory creates store | ✓ | Core functionality |
| Triggers reference valid types | ✓ | Runtime safety |
| Default behaviours exist | ✓ | Resolution works |

### Test Location

```
engine/experience/modes/{name}/
├── index.ts
├── store.ts
└── index.test.ts    # Co-located test file
```

### Test Template

```typescript
// modes/{name}/index.test.ts
describe('{name}Mode', () => {
  it('has required fields', () => {
    expect(mode.id).toBeDefined()
    expect(mode.provides).toBeInstanceOf(Array)
    expect(typeof mode.createStore).toBe('function')
    expect(mode.defaults.section).toBeDefined()
  })

  it('provides matches store fields', () => {
    const state = mode.createStore().getState()
    mode.provides.forEach(field => expect(field in state).toBe(true))
  })

  it('store has getState/setState/subscribe', () => {
    const store = mode.createStore()
    expect(store.getState).toBeDefined()
    expect(store.setState).toBeDefined()
  })

  it('triggers have type and target', () => {
    mode.triggers.forEach(t => {
      expect(t.type).toBeDefined()
      expect(t.target).toBeDefined()
    })
  })
})
```

### Definition of Done

A mode is complete when:

- [ ] All tests pass: `npm test -- modes/{name}`
- [ ] Interface compliance verified
- [ ] Store factory works
- [ ] No TypeScript errors
- [ ] No React/DOM imports in mode definition

### Running Tests

```bash
# Single mode
npm test -- modes/parallax

# All modes
npm test -- modes/
```

---

## Example: Simplest Site

> Minimal example traced through all domain layers. See other specs for the full flow.

The simplest site uses the `reveal` mode for scroll-triggered animations.

### Why reveal Mode

For a simple landing page:
- Sections fade in as they scroll into view
- No complex parallax depth calculations
- Single state field: `sectionVisibility`

### Site Config Using reveal

```typescript
// site/config.ts
import { starterPreset } from '@/engine/presets/starter'

export const siteConfig: SiteSchema = {
  id: 'my-portfolio',
  experience: {
    ...starterPreset.experience,
    mode: 'reveal'  // ← Selects reveal mode
  },
  chrome: { ...starterPreset.chrome },
  pages: [{ id: 'home', slug: '/' }]
}
```

### How State Flows

```
User scrolls
    │
    ▼
Trigger (intersection) ─────► Store (sectionVisibility: 0.7)
                                       │
                                       ▼
                              Behaviour (fade-in.compute)
                                       │
                                       ▼
                              CSS Variables (--opacity: 1, --y: 0)
                                       │
                                       ▼
                              Driver (setProperty)
                                       │
                                       ▼
                              Widget (renders with opacity/transform)
```

### Connection to Other Specs

| Spec | Role in Example |
|------|-----------------|
| [Site Spec](../site/site.spec.md) | Selects `mode: 'reveal'` |
| [Behaviour Spec](./behaviour.spec.md) | `fade-in` consumes `sectionVisibility` |
| [Section Composite Spec](../content/section-composite.spec.md) | Sections declare `behaviour: 'fade-in'` |
| [Widget Spec](../content/widget.spec.md) | Widgets read CSS variables |

---

## See Also

- [Preset Spec](../preset/preset.spec.md) - Mode selection
- [Provider Spec](./provider.spec.md) - Mode distribution
- [Behaviour Spec](./behaviour.spec.md) - State consumption
- [Trigger Spec](./trigger.spec.md) - Store updates

## Validator

Validated by: `./mode.validator.ts`

Rules in "Must/Must Not" map 1:1 to validator checks.
