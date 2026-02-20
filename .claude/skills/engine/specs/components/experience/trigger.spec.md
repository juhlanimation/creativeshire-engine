# Trigger Spec

> Hooks that listen to browser events and update the Zustand store.

## Purpose

Triggers connect browser events to store updates. Each trigger listens to a specific event source (scroll, resize, intersection, keyboard, cursor) and writes computed values to the Zustand store. Drivers and behaviours read from the store; triggers write to it.

## Trigger Categories

| Category | Direction | Purpose | Examples |
|----------|-----------|---------|----------|
| **Observation** | Environment → Store | Passive watching | scroll, resize, intersection |
| **Action** | User → Store | Intent events | click, hover, focus, blur |

### Observation Triggers

Observation triggers passively watch environmental changes. They fire continuously or on threshold changes.

### Action Triggers

Action triggers respond to intentional user events. They fire on discrete interactions.

#### When to Use Action Triggers vs CSS

| Scenario | Solution | Reason |
|----------|----------|--------|
| Simple hover scale | CSS `:hover` | No coordination needed |
| Hover reveals sibling | Action Trigger | Cross-element coordination |
| Focus ring | CSS `:focus-visible` | Standard browser behavior |
| Focus triggers panel | Action Trigger | State persists after focus |
| Click toggles state | Action Trigger | State management needed |
| Hover with delay | Action Trigger | Timing control needed |

**Rule:** Use CSS pseudo-classes for self-contained effects. Use Action Triggers when state must persist or coordinate across elements.

### L2 Triggers vs L1 Widget Actions

L2 triggers (this spec) and L1 widget `on` actions are complementary systems:

| L2 Triggers | L1 Widget `on` Actions |
|-------------|----------------------|
| Continuous (60fps) | Discrete (events) |
| Write to Zustand store | Dispatch to action registry |
| CSS variables (`--hover: 0\|1`) | Pub/sub handlers |
| Drive GSAP / effects | Drive overlay activation |
| BehaviourWrapper scope | WidgetRenderer scope |

A single widget can have **both** a hover behaviour (L2 CSS variable) and a hover trigger (L1 action dispatch). No event interference.

See: [action-system.spec.md](../content/action-system.spec.md)

## Concepts

| Term | Definition |
|------|------------|
| Trigger | React hook that listens to events and writes to store |
| Store | Zustand state that holds runtime values |
| Event Source | Browser event being monitored |
| Throttle | Rate-limiting for high-frequency events |

## Folder Structure

```
engine/experience/triggers/
├── types.ts                   # TriggerConfig, shared types
├── useScrollProgress.ts       # Scroll 0-1 progress
├── useScrollVelocity.ts       # Scroll speed + direction
├── useIntersection.ts         # Section visibility
├── useResize.ts               # Viewport dimensions
├── useKeyboard.ts             # Key state map
└── useCursor.ts               # Cursor x, y coordinates
```

## Interface

```typescript
// triggers/types.ts
export interface TriggerConfig {
  type: string              // Trigger identifier
  target: string            // Store field to update
  options?: Record<string, any>
}

// Hook signature - returns void, writes to store
function use{Name}(options?: {Name}Options): void
```

## Trigger Types

| Trigger | Watches | Updates |
|---------|---------|---------|
| `scroll-progress` | `window.scroll` | 0-1 progress value |
| `scroll-velocity` | Scroll delta / time | Speed + direction |
| `intersection` | `IntersectionObserver` | Section visibility map |
| `resize` | `window.resize` | Viewport dimensions |
| `keyboard` | `keydown` / `keyup` | Key state map |
| `cursor` | `mousemove` | x, y coordinates |
| `reduced-motion` | `prefers-reduced-motion` | Boolean preference |

## Data Flow

```
Browser Event -> Trigger -> Store -> Driver -> DOM
```

Triggers form a one-way data flow. They never set CSS variables, modify styles, or update DOM attributes directly.

## Rules

### Must

1. Hook name follows `use{Name}` convention
2. Returns void (writes to store only)
3. Cleanup function returned from useEffect
4. Passive listeners for scroll/touch events: `{ passive: true }`
5. SSR guard present: `typeof window !== 'undefined'`
6. High-frequency events throttled (mousemove, scroll velocity)
7. Use refs for mutable values in handlers
8. IntersectionObserver calls `disconnect()` on cleanup
9. Deduplicate global listeners with useSWRSubscription or module-level Map
10. Store event handlers in refs when effects shouldn't re-subscribe
11. App-wide init uses module-level guard (not useEffect alone)
12. Version localStorage keys (`userConfig:v2`) and wrap in try-catch

### Must Not

1. Return values (causes React re-renders)
2. Direct DOM manipulation
3. CSS variable writes
4. Direct style manipulation
5. Missing cleanup in useEffect
6. Non-passive scroll/touch listeners
7. Stale closures in event handlers
8. Store full objects in localStorage (only needed fields)
9. Re-subscribe on every callback change (use handler refs)
10. Run init code in useEffect without module guard (runs twice in dev)

## Validation Rules

> Each rule maps 1:1 to `trigger.validator.ts`

| # | Rule | Function | Files |
|---|------|----------|-------|
| 1 | Hook name is use{Name} | `checkHookName` | `use*.ts` |
| 2 | Returns void | `checkReturnsVoid` | `use*.ts` |
| 3 | Has cleanup function | `checkCleanup` | `use*.ts` |
| 4 | Passive listeners | `checkPassiveListeners` | `use*.ts` |
| 5 | SSR guard | `checkSSRGuard` | `use*.ts` |
| 6 | No DOM manipulation | `checkNoDomManipulation` | `use*.ts` |
| 7 | No CSS variable writes | `checkNoCssVariables` | `use*.ts` |
| 8 | Observer disconnects | `checkObserverDisconnect` | `use*.ts` |
| 9 | No return values | `checkNoReturnValue` | `use*.ts` |
| 10 | Action triggers use store | `checkActionTriggerStore` | `use*.ts` |
| 11 | Global listeners deduplicated | `checkDeduplicatedListeners` | `use*.ts` |
| 12 | Handler refs for stable subscriptions | `checkHandlerRefs` | `use*.ts` |
| 13 | Init uses module guard | `checkModuleInitGuard` | `use*.ts` |
| 14 | localStorage versioned | `checkLocalStorageVersioned` | `use*.ts` |

## Templates

### Observation Trigger Template

```typescript
// triggers/use{Name}.ts
import { useEffect, useRef } from 'react'
import { useExperienceStore } from '../ExperienceProvider'

export interface {Name}Options {
  throttleMs?: number
}

export function use{Name}(options?: {Name}Options): void {
  const setStoreValue = useExperienceStore(s => s.setStoreValue)
  const lastTime = useRef(0)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handler = (e: Event) => {
      // Optional throttling
      const now = performance.now()
      if (options?.throttleMs && now - lastTime.current < options.throttleMs) return
      lastTime.current = now

      // Compute and write to store
      const value = computeValue(e)
      setStoreValue(value)
    }

    window.addEventListener('eventname', handler, { passive: true })
    return () => window.removeEventListener('eventname', handler)
  }, [setStoreValue, options?.throttleMs])
}
```

### Action Trigger Template

```typescript
// triggers/useHoverState.ts
import { useCallback } from 'react'
import { useExperienceStore } from '../ExperienceProvider'

export interface HoverStateOptions {
  id: string
  delay?: number
}

export function useHoverState(options: HoverStateOptions): {
  onMouseEnter: () => void
  onMouseLeave: () => void
} {
  const setHoverState = useExperienceStore(s => s.setHoverState)
  const timeoutRef = useRef<number>()

  const onMouseEnter = useCallback(() => {
    if (options.delay) {
      timeoutRef.current = window.setTimeout(() => {
        setHoverState(options.id, true)
      }, options.delay)
    } else {
      setHoverState(options.id, true)
    }
  }, [options.id, options.delay, setHoverState])

  const onMouseLeave = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setHoverState(options.id, false)
  }, [options.id, setHoverState])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return { onMouseEnter, onMouseLeave }
}
```

**Note:** Action triggers return event handlers (not values). The handlers write to store.

## Anti-Patterns

| Anti-Pattern | Problem | Correct Approach |
|--------------|---------|------------------|
| Return values | Causes React re-renders | Write to store, return void |
| DOM manipulation | Bypasses Driver layer | Write to store, let driver handle DOM |
| Non-passive listeners | Blocks scrolling | `{ passive: true }` for scroll/touch |
| Missing cleanup | Memory leak | Return cleanup function from useEffect |
| Missing SSR guard | Server crash | `if (typeof window === 'undefined') return` |

## Testing

> **Required.** Triggers manage event lifecycle and store updates — test them.

### What to Test

| Test | Required | Why |
|------|----------|-----|
| Store updates on event | ✓ | Core contract |
| Cleanup removes listeners | ✓ | Prevents memory leaks |
| Passive listener option | ✓ | Performance requirement |
| SSR guard present | ✓ | Server safety |
| Throttling works | ✓ | High-frequency events |

### Test Location

```
engine/experience/triggers/
├── useScrollProgress.ts
├── useScrollProgress.test.ts    # Co-located test file
├── useHoverState.ts
└── useHoverState.test.ts
```

### Test Template

```typescript
// triggers/use{Name}.test.ts - Pattern for ALL trigger tests
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

// 1. Mock store with appropriate setter
const mockStoreSetter = vi.fn()
vi.mock('../ExperienceProvider', () => ({
  useExperienceStore: (selector: any) => selector({ setXxx: mockStoreSetter })
}))

describe('use{Name}', () => {
  // 2. Spy on event listeners (observation triggers)
  let addSpy: ReturnType<typeof vi.spyOn>
  let removeSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    mockStoreSetter.mockClear()
    addSpy = vi.spyOn(window, 'addEventListener')
    removeSpy = vi.spyOn(window, 'removeEventListener')
  })

  afterEach(() => { addSpy.mockRestore(); removeSpy.mockRestore() })

  // 3. Required tests for observation triggers:
  it('adds listener on mount with passive: true', () => {
    renderHook(() => useXxx())
    expect(addSpy).toHaveBeenCalledWith('eventname', expect.any(Function),
      expect.objectContaining({ passive: true }))
  })

  it('removes listener on unmount', () => {
    const { unmount } = renderHook(() => useXxx())
    unmount()
    expect(removeSpy).toHaveBeenCalledWith('eventname', expect.any(Function))
  })

  it('updates store on event', () => {
    renderHook(() => useXxx())
    act(() => { window.dispatchEvent(new Event('eventname')) })
    expect(mockStoreSetter).toHaveBeenCalled()
  })

  // 4. Additional tests for action triggers:
  // - Test returned handlers (onMouseEnter, onMouseLeave, etc.)
  // - Test delay/timeout cleanup on unmount
})
```

### Definition of Done

A trigger is complete when:

- [ ] All tests pass: `npm test -- triggers/{name}`
- [ ] Event subscription/cleanup tested
- [ ] Store updates verified
- [ ] Passive listeners verified (observation triggers)
- [ ] No memory leaks (cleanup tested)
- [ ] No TypeScript errors

### Running Tests

```bash
# Single trigger
npm test -- triggers/useScrollProgress

# All triggers
npm test -- triggers/
```

---

## Accessibility

### prefers-reduced-motion Trigger

Users can indicate they prefer reduced motion via OS settings. This trigger monitors that preference and updates the store.

```typescript
// triggers/usePrefersReducedMotion.ts
import { useEffect } from 'react'
import { useExperienceStore } from '../ExperienceProvider'

export function usePrefersReducedMotion(): void {
  const setPrefersReducedMotion = useExperienceStore(s => s.setPrefersReducedMotion)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches)

    // Listen for changes
    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [setPrefersReducedMotion])
}
```

### Mode Integration

Modes must include `prefersReducedMotion` in their store:

```typescript
// modes/parallax/index.ts
const parallaxMode: Mode = {
  id: 'parallax',
  provides: ['scrollProgress', 'prefersReducedMotion'],
  createStore: (set) => ({
    scrollProgress: 0,
    prefersReducedMotion: false,
    setScrollProgress: (v) => set({ scrollProgress: v }),
    setPrefersReducedMotion: (v) => set({ prefersReducedMotion: v })
  }),
  triggers: ['scroll-progress', 'reduced-motion']
}
```

**Testing:** Follow the test template pattern. Mock `matchMedia` and verify:
1. Sets initial value on mount
2. Updates store when preference changes

---

## Integration

| Interacts With | Direction | How |
|----------------|-----------|-----|
| Store | Writes | Updates Zustand state |
| `driver` | Indirect | Driver reads store that trigger writes |
| `behaviour` | Indirect | Behaviours receive state from driver |
| `provider` | Uses | Provider supplies store access |

## Validator

Validated by: `./trigger.validator.ts`

Rules in "Must/Must Not" map 1:1 to validator checks.

---

## Example: Simplest Site

> Minimal example traced through all domain layers. See other specs for the full flow.

The simplest site uses the `intersection` trigger to track section visibility.

### Intersection Trigger

Watches when sections enter the viewport and updates store.

```typescript
// triggers/useIntersection.ts
import { useEffect } from 'react'
import { useExperienceStore } from '../ExperienceProvider'

export function useIntersection(options?: { threshold?: number }): void {
  const setSectionVisibility = useExperienceStore(s => s.setSectionVisibility)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const sectionId = entry.target.getAttribute('data-section-id')
          if (sectionId) {
            setSectionVisibility(sectionId, entry.intersectionRatio)
          }
        })
      },
      { threshold: options?.threshold ?? 0.3 }
    )

    // Observe all sections
    document.querySelectorAll('[data-section-id]').forEach(el => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [setSectionVisibility, options?.threshold])
}
```

### Position in Data Flow

```
User scrolls
       │
       ▼
IntersectionObserver fires
       │
       ▼
useIntersection trigger ─────► Store (sectionVisibility: 0.7)
       │                              │
       ▼                              ▼
(Trigger returns void)        Driver reads store
                                      │
                                      ▼
                              fadeIn.compute()
                                      │
                                      ▼
                              CSS Variables applied
```

### Connection to Other Specs

| Spec | Role in Example |
|------|-----------------|
| [Mode Spec](./mode.spec.md) | `reveal` mode configures intersection trigger |
| [Behaviour Spec](./behaviour.spec.md) | `fade-in` reads `sectionVisibility` from store |
| [Driver Spec](./driver.spec.md) | Driver calls `behaviour.compute()` with store state |
| [Provider Spec](./provider.spec.md) | Provider distributes store to triggers |
