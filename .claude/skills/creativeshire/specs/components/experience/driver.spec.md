# Driver Spec

> Engines that apply CSS variables to DOM elements, bypassing React for 60fps animation.

## Purpose

Drivers handle high-frequency animation updates by applying CSS variables directly to DOM elements via refs. React renders structure once. The driver updates CSS variables every frame. CSS maps variables to visual properties. This separation enables 60fps animation without React reconciliation overhead.

## Concepts

| Term | Definition |
|------|------------|
| Driver | Engine that applies CSS variables to DOM elements |
| Target | Registered element with behaviour and options |
| Tick | Single animation frame update cycle |
| setProperty | DOM API for setting CSS variables |

## Folder Structure

```
creativeshire/experience/drivers/
├── types.ts              # Driver, Target interfaces
├── ScrollDriver.ts       # Scroll-based driver
├── GSAPDriver.ts         # GSAP ScrollTrigger integration
└── index.ts              # Barrel exports
```

## Interface

```typescript
// drivers/types.ts
export interface Target {
  element: HTMLElement
  behaviour: Behaviour
  options: Record<string, any>
}

export interface Driver {
  register(id: string, element: HTMLElement, behaviour: Behaviour, options: any): void
  unregister(id: string): void
  destroy(): void
}
```

## Rules

### Must

1. Event listeners use `{ passive: true }` for non-blocking scroll
2. Targets stored in `Map<string, Target>` for O(1) lookup
3. Tick loop uses `requestAnimationFrame`
4. Only call `element.style.setProperty()` for CSS variables
5. All CSS variable keys are `--prefixed`
6. Values converted to strings before setProperty
7. `register()` adds target to Map
8. `unregister()` removes target from Map
9. `destroy()` removes event listeners and clears Map
10. GSAP ScrollTriggers killed on cleanup
11. Store handlers in arrow function properties (no bind in constructor)
12. Batch DOM reads before writes (avoid layout thrashing)

### Must Not

1. Direct style property assignment (`element.style.transform = ...`)
2. React state updates in driver tick loop
3. Non-passive scroll listeners
4. Missing cleanup in destroy()
5. Orphaned event listeners
6. Memory leaks from uncleaned targets
7. Interleave style writes with layout reads (causes reflows)
8. Re-create handlers in tick loop (use stable references)

## Validation Rules

> Each rule maps 1:1 to `driver.validator.ts`

| # | Rule | Function | Files |
|---|------|----------|-------|
| 1 | Passive scroll listener | `checkPassiveListener` | `*Driver.ts` |
| 2 | Uses Map for targets | `checkTargetsMap` | `*Driver.ts` |
| 3 | Uses requestAnimationFrame | `checkRAF` | `*Driver.ts` |
| 4 | Uses setProperty only | `checkSetPropertyOnly` | `*Driver.ts` |
| 5 | No direct style assignment | `checkNoDirectStyle` | `*Driver.ts` |
| 6 | Implements destroy | `checkDestroyMethod` | `*Driver.ts` |
| 7 | Removes listeners in destroy | `checkDestroyCleanup` | `*Driver.ts` |
| 8 | Clears Map in destroy | `checkDestroyClear` | `*Driver.ts` |
| 9 | No React state | `checkNoReactState` | `*Driver.ts` |
| 10 | GSAP cleanup | `checkGSAPCleanup` | `GSAPDriver.ts` |
| 11 | No layout thrashing | `checkNoLayoutThrashing` | `*Driver.ts` |
| 12 | Stable handler refs | `checkStableHandlers` | `*Driver.ts` |

## Driver Lifecycle

```
constructor() -> addEventListener({ passive: true }) -> tick()
     |
     v
register(id, element, behaviour, options) -> Map.set()
     |
     v
tick() -> forEach target -> compute() -> setProperty()
     |
     v
unregister(id) -> Map.delete()
     |
     v
destroy() -> removeEventListener() -> Map.clear()
```

## CSS Variable Contract

| Rule | Reason |
|------|--------|
| Only `setProperty()` for `--prefixed` keys | Type-safe, no property clobbering |
| Never assign to `element.style.*` directly | Maintains layer separation |
| Values are strings | CSS compatibility |
| CSS declares fallbacks | SSR safety |

## Template

```typescript
// drivers/ScrollDriver.ts
export class ScrollDriver implements Driver {
  private targets: Map<string, Target> = new Map()
  private state = { scrollProgress: 0, scrollVelocity: 0, lastScrollY: 0, lastTime: 0 }

  constructor() {
    window.addEventListener('scroll', this.onScroll, { passive: true })
    this.tick()
  }

  private onScroll = () => {
    const now = performance.now()
    const scrollY = window.scrollY
    const maxScroll = document.body.scrollHeight - window.innerHeight

    this.state.scrollVelocity = (scrollY - this.state.lastScrollY) / (now - this.state.lastTime)
    this.state.scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0
    this.state.lastScrollY = scrollY
    this.state.lastTime = now
  }

  private tick = () => {
    this.update()
    requestAnimationFrame(this.tick)
  }

  private update() {
    this.targets.forEach(({ element, behaviour, options }) => {
      const vars = behaviour.compute(this.state, options)
      Object.entries(vars).forEach(([key, value]) => {
        element.style.setProperty(key, String(value))
      })
    })
  }

  register(id: string, element: HTMLElement, behaviour: Behaviour, options: any) {
    this.targets.set(id, { element, behaviour, options })
  }

  unregister(id: string) {
    this.targets.delete(id)
  }

  destroy() {
    window.removeEventListener('scroll', this.onScroll)
    this.targets.clear()
  }
}
```

## Anti-Patterns

### Don't: Direct style assignment

```typescript
// WRONG - Clobbers CSS cascade
element.style.transform = `translateY(${value}px)`

// CORRECT - CSS variables maintain separation
element.style.setProperty('--y', String(value))
```

**Why:** Direct assignment bypasses CSS cascade and breaks layer separation.

### Don't: React state in driver

```typescript
// WRONG - Triggers re-render every frame
const [progress, setProgress] = useState(0)
onScroll = () => setProgress(window.scrollY / maxScroll)

// CORRECT - Plain object state
this.state.scrollProgress = window.scrollY / maxScroll
```

**Why:** React state causes reconciliation. 50 widgets at 60fps = 3000 renders/sec.

### Don't: Non-passive scroll listener

```typescript
// WRONG - Blocks scrolling
window.addEventListener('scroll', this.onScroll)

// CORRECT - Non-blocking
window.addEventListener('scroll', this.onScroll, { passive: true })
```

**Why:** Non-passive listeners can block scroll for preventDefault handling.

### Don't: Missing cleanup

```typescript
// WRONG - Memory leak
destroy() {
  // forgot removeEventListener
  this.targets.clear()
}

// CORRECT - Full cleanup
destroy() {
  window.removeEventListener('scroll', this.onScroll)
  this.targets.clear()
}
```

## Testing

> **Required.** Drivers manage lifecycle and DOM updates — test them.

### What to Test

| Test | Required | Why |
|------|----------|-----|
| `register()` adds target to Map | ✓ | Core lifecycle |
| `unregister()` removes target | ✓ | Prevents leaks |
| `destroy()` clears Map + removes listeners | ✓ | Full cleanup |
| Uses `setProperty()` only | ✓ | CSS variable contract |
| Passive scroll listener | ✓ | Performance |

### Test Location

```
creativeshire/experience/drivers/
├── ScrollDriver.ts
├── ScrollDriver.test.ts    # Co-located test file
├── GSAPDriver.ts
└── GSAPDriver.test.ts
```

### Test Template

```typescript
// drivers/ScrollDriver.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ScrollDriver } from './ScrollDriver'

describe('ScrollDriver', () => {
  let driver: ScrollDriver
  let el: HTMLElement
  let setPropertySpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    driver = new ScrollDriver()
    el = document.createElement('div')
    setPropertySpy = vi.spyOn(el.style, 'setProperty')
  })

  afterEach(() => {
    driver.destroy()
  })

  describe('register()', () => {
    it('adds target to internal Map', () => {
      const behaviour = {
        id: 'test',
        compute: () => ({ '--y': 0 }),
        requires: [],
        cssTemplate: ''
      }
      driver.register('id-1', el, behaviour, {})
      // Verify by checking unregister doesn't throw
      expect(() => driver.unregister('id-1')).not.toThrow()
    })
  })

  describe('unregister()', () => {
    it('removes target from Map', () => {
      const behaviour = {
        id: 'test',
        compute: () => ({ '--y': 0 }),
        requires: [],
        cssTemplate: ''
      }
      driver.register('id-1', el, behaviour, {})
      driver.unregister('id-1')
      // Should be safe to unregister again (no-op)
      expect(() => driver.unregister('id-1')).not.toThrow()
    })
  })

  describe('destroy()', () => {
    it('clears all targets', () => {
      const behaviour = {
        id: 'test',
        compute: () => ({ '--y': 0 }),
        requires: [],
        cssTemplate: ''
      }
      driver.register('id-1', el, behaviour, {})
      driver.register('id-2', el, behaviour, {})
      driver.destroy()
      // Multiple destroy calls should be safe
      expect(() => driver.destroy()).not.toThrow()
    })
  })

  describe('CSS variable contract', () => {
    it('sets CSS variables via setProperty', async () => {
      const behaviour = {
        id: 'test',
        compute: () => ({ '--test-value': 42 }),
        requires: [],
        cssTemplate: ''
      }
      driver.register('id-1', el, behaviour, {})

      // Wait for animation frame
      await new Promise(r => requestAnimationFrame(r))

      expect(setPropertySpy).toHaveBeenCalledWith('--test-value', '42')
    })

    it('converts values to strings', async () => {
      const behaviour = {
        id: 'test',
        compute: () => ({ '--number': 123, '--float': 0.5 }),
        requires: [],
        cssTemplate: ''
      }
      driver.register('id-1', el, behaviour, {})

      await new Promise(r => requestAnimationFrame(r))

      expect(setPropertySpy).toHaveBeenCalledWith('--number', '123')
      expect(setPropertySpy).toHaveBeenCalledWith('--float', '0.5')
    })
  })
})
```

### Definition of Done

A driver is complete when:

- [ ] All tests pass: `npm test -- drivers/{name}`
- [ ] `register()`/`unregister()`/`destroy()` lifecycle tested
- [ ] CSS variable contract verified
- [ ] No memory leaks (listeners removed in destroy)
- [ ] No TypeScript errors

### Running Tests

```bash
# Single driver
npm test -- drivers/ScrollDriver

# All drivers
npm test -- drivers/
```

---

## Integration

| Interacts With | Direction | How |
|----------------|-----------|-----|
| `behaviour` | Calls | Driver invokes `behaviour.compute()` |
| `provider` | Provided by | DriverProvider creates and manages driver |
| `trigger` | Updates | Triggers provide state that driver uses |
| BehaviourWrapper | Registers | Wrapper registers elements with driver |

## Validator

Validated by: `./driver.validator.ts`

Rules in "Must/Must Not" map 1:1 to validator checks.

---

## Example: Simplest Site

> Minimal example traced through all domain layers. See other specs for the full flow.

The simplest site uses a scroll driver to apply CSS variables from the `fade-in` behaviour.

### Driver in the Animation Pipeline

```
User scrolls
       │
       ▼
Trigger (intersection) ─────► Store (sectionVisibility: 0.7)
       │
       ▼
Driver.tick() ─────► behaviour.compute({ sectionVisibility: 0.7 })
       │
       ▼
CSS Variables: { '--opacity': 1, '--y': 0 }
       │
       ▼
Driver.update() ─────► element.style.setProperty('--opacity', '1')
       │
       ▼
Widget CSS reads var(--opacity, 0) ─────► Renders at full opacity
```

### Driver Applies fade-in Behaviour

```typescript
// Inside driver tick loop
this.targets.forEach(({ element, behaviour, options }) => {
  // Get current state from store
  const state = { sectionVisibility: store.getState().sectionVisibility }

  // Behaviour computes CSS variables
  const vars = behaviour.compute(state, options)
  // { '--opacity': 1, '--y': 0 }

  // Driver applies to DOM
  Object.entries(vars).forEach(([key, value]) => {
    element.style.setProperty(key, String(value))
  })
})
```

### Connection to Other Specs

| Spec | Role in Example |
|------|-----------------|
| [Mode Spec](./mode.spec.md) | `reveal` mode creates store with `sectionVisibility` |
| [Behaviour Spec](./behaviour.spec.md) | `fade-in` computes `--opacity`, `--y` |
| [Widget Spec](../content/widget.spec.md) | Widgets read CSS variables via `var()` |
| [Site Spec](../site/site.spec.md) | Selects mode that determines driver behaviour |
