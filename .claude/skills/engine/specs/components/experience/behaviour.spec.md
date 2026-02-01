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
engine/experience/behaviours/
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
15. Output computed VALUES not flags (e.g., `'--y': '-100%'` not `'--is-active': 1`)

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

### Section/Widget Behaviours

| Variable | Behaviour | Fallback |
|----------|-----------|----------|
| `--section-y` | scroll-stack | `0` |
| `--section-z` | scroll-stack | `0` |
| `--section-opacity` | scroll-stack | `1` |
| `--depth-y` | depth-layer | `0` |
| `--clip-progress` | mask-reveal | `100` |
| `--fade-opacity` | fade-on-scroll | `1` |

### Page Transition Behaviours

| Behaviour | Effect | Variables |
|-----------|--------|-----------|
| `page-fade` | Fade in/out | `--page-opacity` |
| `page-slide-left` | Slide from/to left | `--page-x`, `--page-opacity` |
| `page-slide-right` | Slide from/to right | `--page-x`, `--page-opacity` |
| `page-slide-up` | Slide from/to top | `--page-y`, `--page-opacity` |
| `page-crossfade` | Crossfade with previous | `--page-opacity`, `--page-scale` |
| `none` | Instant swap | (none) |

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

### Don't: Output flags instead of values

```typescript
// WRONG - Outputs a flag, widget calculates animation
compute: (state) => ({
  '--is-hovered': state.isHovered ? 1 : 0  // Just a flag
})

// Widget CSS has to calculate:
// transform: translateY(calc(var(--is-hovered) * -100%));
```

```typescript
// CORRECT - Outputs actual animation values
compute: (state) => ({
  '--reveal-y': state.isHovered ? '-100%' : '0',  // Actual value
  '--reveal-opacity': state.isHovered ? 1 : 0,
  '--reveal-duration': '400ms',
  '--reveal-easing': 'ease-in-out',
})

// Effect CSS just applies:
// transform: translateY(var(--reveal-y, 0));
```

**Why:** When behaviours output flags (0 or 1), animation knowledge leaks into Content (L1). The widget must know what `-100%` means. By outputting actual values, all animation knowledge stays in L2. This enables reusable effects across different content.

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

## Testing

> **Required.** Behaviours have pure `compute()` functions — test them.

### What to Test

| Test | Required | Why |
|------|----------|-----|
| `compute()` returns CSS variables | ✓ | Core contract |
| All keys are `--prefixed` | ✓ | Type safety |
| Values are strings or numbers | ✓ | CSS compatibility |
| Pure function (same input = same output) | ✓ | No side effects |
| Edge cases (0, 1, negative progress) | ✓ | Boundary conditions |

### Test Location

```
engine/experience/behaviours/{behaviour-name}/
├── index.ts
└── index.test.ts    # Co-located test file
```

### Test Template

```typescript
// {behaviour-name}/index.test.ts
import { describe, it, expect } from 'vitest'
import behaviour from './index'

describe(behaviour.id, () => {
  describe('compute()', () => {
    it('returns CSS variables with -- prefix', () => {
      const result = behaviour.compute(
        { scrollProgress: 0.5, sectionProgress: 0.5 },
        {}
      )
      Object.keys(result).forEach(key => {
        expect(key).toMatch(/^--/)
      })
    })

    it('returns strings or numbers only', () => {
      const result = behaviour.compute(
        { scrollProgress: 0.5, sectionProgress: 0.5 },
        {}
      )
      Object.values(result).forEach(value => {
        expect(['string', 'number']).toContain(typeof value)
      })
    })

    it('is pure (same input = same output)', () => {
      const state = { scrollProgress: 0.5, sectionProgress: 0.5 }
      const options = { intensity: 1 }
      expect(behaviour.compute(state, options))
        .toEqual(behaviour.compute(state, options))
    })

    it('handles edge cases', () => {
      // Progress at 0
      expect(() => behaviour.compute({ scrollProgress: 0 }, {})).not.toThrow()
      // Progress at 1
      expect(() => behaviour.compute({ scrollProgress: 1 }, {})).not.toThrow()
      // Empty options
      expect(() => behaviour.compute({ scrollProgress: 0.5 }, {})).not.toThrow()
    })
  })

  describe('cssTemplate', () => {
    it('has fallbacks for all variables', () => {
      const vars = behaviour.cssTemplate.match(/var\(--[^)]+\)/g) || []
      vars.forEach(v => {
        expect(v).toMatch(/var\(--[\w-]+,\s*.+\)/)
      })
    })

    it('includes will-change', () => {
      expect(behaviour.cssTemplate).toContain('will-change')
    })
  })

  describe('metadata', () => {
    it('has required fields', () => {
      expect(behaviour.id).toMatch(/^[a-z][a-z0-9-]*$/)
      expect(Array.isArray(behaviour.requires)).toBe(true)
      expect(typeof behaviour.compute).toBe('function')
      expect(typeof behaviour.cssTemplate).toBe('string')
    })
  })
})
```

### Definition of Done

A behaviour is complete when:

- [ ] All tests pass: `npm test -- behaviours/{name}`
- [ ] `compute()` tested with edge cases
- [ ] `cssTemplate` fallbacks verified
- [ ] No TypeScript errors

### Running Tests

```bash
# Single behaviour
npm test -- behaviours/depth-layer

# All behaviours
npm test -- behaviours/
```

---

## Accessibility

### Respecting prefers-reduced-motion

Behaviours must respect the user's motion preference. When `prefersReducedMotion` is true, return static (non-animated) values.

```typescript
// behaviours/fade-in/index.ts
import { Behaviour } from '../types'

const fadeIn: Behaviour = {
  id: 'fade-in',
  name: 'Fade In',
  requires: ['sectionVisibility', 'prefersReducedMotion'],

  compute: (state, options) => {
    // Respect reduced motion preference
    if (state.prefersReducedMotion) {
      return {
        '--opacity': 1,
        '--y': 0
      }
    }

    const visibility = state.sectionVisibility ?? 0
    const distance = options?.distance ?? 20
    const progress = Math.min(1, visibility * 1.5)

    return {
      '--opacity': progress,
      '--y': (1 - progress) * distance
    }
  },

  cssTemplate: `
    opacity: var(--opacity, 1);
    transform: translateY(calc(var(--y, 0) * 1px));
    will-change: opacity, transform;
  `
}

export default fadeIn
```

### Pattern: Reduced Motion Fallback

All behaviours should follow this pattern:

```typescript
compute: (state, options) => {
  // 1. Check reduced motion FIRST
  if (state.prefersReducedMotion) {
    return {
      '--opacity': 1,  // Fully visible
      '--y': 0,        // No offset
      '--scale': 1     // Full size
    }
  }

  // 2. Normal animation logic
  return computeAnimatedValues(state, options)
}
```

### Test for Reduced Motion

```typescript
// behaviours/fade-in/index.test.ts
describe('fadeIn behaviour', () => {
  describe('accessibility', () => {
    it('returns static values when prefersReducedMotion is true', () => {
      const result = fadeIn.compute(
        { sectionVisibility: 0, prefersReducedMotion: true },
        {}
      )
      expect(result['--opacity']).toBe(1)
      expect(result['--y']).toBe(0)
    })

    it('returns animated values when prefersReducedMotion is false', () => {
      const result = fadeIn.compute(
        { sectionVisibility: 0, prefersReducedMotion: false },
        {}
      )
      expect(result['--opacity']).toBe(0)
      expect(result['--y']).toBe(20)
    })
  })
})
```

### Validation Rules (Accessibility)

| # | Rule | Function |
|---|------|----------|
| 16 | Behaviour requires 'prefersReducedMotion' | `checkReducedMotionRequired` |
| 17 | Compute checks prefersReducedMotion | `checkReducedMotionHandled` |

---

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

---

## Example: Simplest Site

> Minimal example traced through all domain layers. See other specs for the full flow.

The simplest site uses the `fade-in` behaviour for sections:

### fade-in Behaviour

Fades and slides content as it enters the viewport.

```typescript
// behaviours/fade-in/index.ts
import { Behaviour } from '../types'

const fadeIn: Behaviour = {
  id: 'fade-in',
  name: 'Fade In',
  description: 'Fades and slides content into view',
  requires: ['sectionVisibility'],

  compute: (state, options) => {
    const visibility = state.sectionVisibility ?? 0
    const distance = options?.distance ?? 20
    const progress = Math.min(1, visibility * 1.5)  // Slightly accelerated

    return {
      '--opacity': progress,
      '--y': (1 - progress) * distance
    }
  },

  cssTemplate: `
    opacity: var(--opacity, 0);
    transform: translateY(calc(var(--y, 20) * 1px));
    will-change: opacity, transform;
  `,

  options: {
    distance: {
      type: 'range',
      label: 'Slide Distance',
      default: 20,
      min: 0,
      max: 100,
      step: 5
    }
  }
}

export default fadeIn
```

### Usage in Section Composites

The Hero and About sections use this behaviour (see [Section Composite Spec](../content/section-composite.spec.md)):

```typescript
// sections/patterns/Hero/index.ts
return {
  id: props.id ?? 'hero',
  layout: { type: 'stack', align: 'center', gap: 24 },
  behaviour: 'fade-in',  // ← Uses fade-in behaviour
  widgets: [/* Text, Text, Button */]
}
```

### Data Flow

```
BehaviourState                  CSS Variables              Visual Result
────────────────────────────────────────────────────────────────────────
{ sectionVisibility: 0.5 }  →  { '--opacity': 0.75,   →  50% opacity,
                                  '--y': 5 }               5px offset

{ sectionVisibility: 1.0 }  →  { '--opacity': 1,      →  Fully visible,
                                  '--y': 0 }               no offset
```

### Test for fade-in

```typescript
// behaviours/fade-in/index.test.ts
import { describe, it, expect } from 'vitest'
import fadeIn from './index'

describe('fadeIn behaviour', () => {
  it('returns 0 opacity when not visible', () => {
    const result = fadeIn.compute({ sectionVisibility: 0 }, {})
    expect(result['--opacity']).toBe(0)
    expect(result['--y']).toBe(20)  // Full offset
  })

  it('returns full opacity when fully visible', () => {
    const result = fadeIn.compute({ sectionVisibility: 1 }, {})
    expect(result['--opacity']).toBe(1)
    expect(result['--y']).toBe(0)  // No offset
  })

  it('respects distance option', () => {
    const result = fadeIn.compute({ sectionVisibility: 0 }, { distance: 50 })
    expect(result['--y']).toBe(50)
  })
})
```
