# Behaviour Spec

> Compute functions that transform runtime state into CSS variables for animation.

## Purpose

Behaviours transform runtime state into CSS variables. A behaviour receives state (scroll progress, section visibility) and returns CSS variables that drive animation. The driver calls `compute()` every frame. CSS maps variables to visual properties. This separation enables 60fps animation without React reconciliation.

## Concepts

| Term | Definition |
|------|------------|
| Behaviour | Pure function that maps state to CSS variables |
| CSSVariables | Record with `--prefixed` keys only |
| BehaviourState | Runtime state (scroll, visibility, section info) |
| cssTemplate | CSS string applied via inline style |
| BehaviourWrapper | Single generic wrapper for all behaviours |
| Registry | Auto-discovered collection of behaviours |

## Folder Structure

```
creativeshire/experience/behaviours/
├── types.ts              # Behaviour, CSSVariables, BehaviourState
├── registry.ts           # Auto-discovery via import.meta.glob
├── resolve.ts            # Schema to behaviour resolution
├── BehaviourWrapper.tsx  # ONE generic wrapper
├── {behaviour-name}/
│   └── index.ts          # Behaviour definition (default export)
```

## Interface

```typescript
// behaviours/types.ts
export type CSSVariables = Record<`--${string}`, string | number>

export interface BehaviourState {
  scrollProgress: number      // 0-1 global scroll
  scrollVelocity: number      // Scroll speed + direction
  sectionProgress: number     // 0-1 within section
  sectionVisibility: number   // Intersection ratio
  sectionIndex: number        // Position in section list
  totalSections: number       // Total section count
  isActive: boolean           // Section currently active
  [key: string]: any          // Mode-specific state
}

export interface OptionConfig {
  type: 'range' | 'select' | 'toggle' | 'color'
  label: string
  default: any
  min?: number
  max?: number
  step?: number
  choices?: { value: string; label: string }[]
}

export interface Behaviour {
  id: string
  name: string
  description?: string
  requires: string[]
  compute: (state: BehaviourState, options: Record<string, any>) => CSSVariables
  cssTemplate: string
  options?: Record<string, OptionConfig>
}

export type BehaviourConfig = string | { id: string; options?: Record<string, any> }
```

## Rules

### Must

1. Behaviour `id` is unique and kebab-case
2. `requires` lists all state dependencies used in `compute`
3. `compute` returns `CSSVariables` type only (all keys `--prefixed`)
4. `compute` is a pure function (no side effects, no DOM, no async)
5. `cssTemplate` uses `var(--x, fallback)` for all variables
6. `cssTemplate` includes `will-change` for animated properties
7. Options have defaults for all configurable values
8. Default export from `index.ts`
9. BehaviourWrapper returns cleanup function from useEffect
10. Registry uses `import.meta.glob` with eager loading
11. Cache expensive function results with module-level Map
12. Use Set/Map for O(1) lookups instead of array.includes/find
13. Early return when result is determined (skip unnecessary work)
14. Use `toSorted()` instead of `sort()` for immutability

### Must Not

1. Direct DOM manipulation in `compute`
2. React state or hooks in `compute`
3. Non-prefixed keys in return value
4. CSS variables without fallbacks
5. Multiple wrapper components (ONE generic wrapper only)
6. Manual registry updates (use auto-discovery)
7. Async operations in `compute`
8. Use `array.sort()` on props/state (mutates original)
9. Multiple filter/map iterations when one loop suffices
10. Use `array.find()` repeatedly (build index Map once)
11. Sort array just to find min/max (use single loop)

## Validation Rules

> Each rule maps 1:1 to `behaviour.validator.ts`

| # | Rule | Function | Files |
|---|------|----------|-------|
| 1 | Default export required | `checkDefaultExport` | `.ts` in behaviour folders |
| 2 | Behaviour id is kebab-case | `checkBehaviourId` | `index.ts` |
| 3 | Requires array defined | `checkRequiresArray` | `index.ts` |
| 4 | CSSVariables keys --prefixed | `checkCssVariablePrefix` | `index.ts` |
| 5 | cssTemplate has fallbacks | `checkCssTemplateFallbacks` | `index.ts` |
| 6 | cssTemplate has will-change | `checkWillChange` | `index.ts` |
| 7 | No DOM manipulation | `checkNoDomManipulation` | `.ts`, `.tsx` |
| 8 | No React state in compute | `checkNoReactState` | `index.ts` |
| 9 | Registry uses glob | `checkRegistryGlob` | `registry.ts` |
| 10 | Wrapper returns cleanup | `checkWrapperCleanup` | `BehaviourWrapper.tsx` |
| 11 | Expensive functions cached | `checkFunctionCaching` | `index.ts` |
| 12 | Uses Set/Map for lookups | `checkSetMapLookups` | `index.ts` |
| 13 | Early returns present | `checkEarlyReturns` | `index.ts` |
| 14 | Uses toSorted not sort | `checkImmutableSort` | `index.ts` |
| 15 | Single iteration for multiple filters | `checkCombinedIterations` | `index.ts` |

## CSS Variables

> Behaviours WRITE these. Widgets READ them via CSS.

| Variable | Behaviour | Fallback |
|----------|-----------|----------|
| `--section-y` | scroll-stack | `0` |
| `--section-z` | scroll-stack | `0` |
| `--section-opacity` | scroll-stack | `1` |
| `--depth-y` | depth-layer | `0` |
| `--clip-progress` | mask-reveal | `100` |
| `--fade-opacity` | fade-on-scroll | `1` |

```css
/* Widget reads variables set by behaviour */
.widget {
  transform: translateY(calc(var(--depth-y, 0) * 1px));
  opacity: var(--fade-opacity, 1);
}
```

## Resolution Cascade

| Priority | Condition | Result |
|----------|-----------|--------|
| 1 | `behaviour: 'none'` | No wrapper |
| 2 | Explicit behaviour | Use that behaviour |
| 3 | Mode has default | Use mode default |
| 4 | No default | No wrapper |

## Template

```typescript
// {behaviour-name}/index.ts
import { Behaviour } from '../types'

const myBehaviour: Behaviour = {
  id: 'my-behaviour',
  name: 'My Behaviour',
  requires: ['sectionProgress'],

  compute: (state, options) => ({
    '--my-value': state.sectionProgress * (options.intensity ?? 1)
  }),

  cssTemplate: `
    transform: translateY(calc(var(--my-value, 0) * 1px));
    will-change: transform;
  `,

  options: {
    intensity: { type: 'range', label: 'Intensity', default: 1, min: 0, max: 2 }
  }
}

export default myBehaviour
```

## Anti-Patterns

### Don't: Direct DOM manipulation

```typescript
// WRONG
compute: (state) => {
  document.querySelector('.widget').style.opacity = state.scrollProgress
  return {}
}
```

**Why:** Bypasses CSS variable contract; breaks driver control.

### Don't: React state in compute

```typescript
// WRONG - Triggers re-renders every frame
const [progress, setProgress] = useState(0)
compute: (state) => {
  setProgress(state.scrollProgress)
  return { '--progress': progress }
}
```

**Why:** Compute runs every frame; React state causes reconciliation.

### Don't: Non-prefixed keys

```typescript
// WRONG - TypeScript rejects this
compute: (state) => ({ opacity: state.scrollProgress })

// CORRECT
compute: (state) => ({ '--opacity': state.scrollProgress })
```

### Don't: Missing fallbacks

```css
/* WRONG */ .wrapper { opacity: var(--opacity); }
/* CORRECT */ .wrapper { opacity: var(--opacity, 1); }
```

### Don't: Multiple wrappers

```typescript
// WRONG - Separate wrapper per behaviour
export function DepthLayerWrapper({ children }) { ... }
export function FadeOnScrollWrapper({ children }) { ... }

// CORRECT - ONE generic wrapper
export function BehaviourWrapper({ behaviour, children }) { ... }
```

### Don't: Missing cleanup

```typescript
// WRONG - Memory leak
useEffect(() => {
  driver.register(id.current, ref.current, behaviour, options)
  // NO cleanup returned
}, [behaviour.id])

// CORRECT
useEffect(() => {
  driver.register(id.current, ref.current, behaviour, options)
  return () => driver.unregister(id.current)
}, [behaviour.id])
```

### Don't: Mutate arrays with sort()

```typescript
// WRONG - Mutates props array
const sorted = items.sort((a, b) => a.value - b.value)

// CORRECT - Creates new sorted array
const sorted = items.toSorted((a, b) => a.value - b.value)
```

### Don't: Multiple iterations for same data

```typescript
// WRONG - 3 iterations
const admins = users.filter(u => u.isAdmin)
const testers = users.filter(u => u.isTester)
const inactive = users.filter(u => !u.isActive)

// CORRECT - 1 iteration
const admins = [], testers = [], inactive = []
for (const u of users) {
  if (u.isAdmin) admins.push(u)
  if (u.isTester) testers.push(u)
  if (!u.isActive) inactive.push(u)
}
```

### Don't: Repeated find() lookups

```typescript
// WRONG - O(n) per lookup
const getUser = (id) => users.find(u => u.id === id)

// CORRECT - O(1) lookups
const userById = new Map(users.map(u => [u.id, u]))
const getUser = (id) => userById.get(id)
```

## Integration

| Interacts With | Direction | How |
|----------------|-----------|-----|
| `driver` | Called by | Driver invokes `compute()` every frame |
| `trigger` | Receives | Triggers update state that behaviours read |
| `provider` | Uses | DriverProvider supplies driver instance |
| `preset` | Configured by | Preset/mode defines default behaviours |
| `widget` | Wraps | BehaviourWrapper wraps widget content |

## Validator

Validated by: `./behaviour.validator.ts`

Rules in "Must/Must Not" map 1:1 to validator checks.
