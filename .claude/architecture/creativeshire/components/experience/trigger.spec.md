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

## Concepts

| Term | Definition |
|------|------------|
| Trigger | React hook that listens to events and writes to store |
| Store | Zustand state that holds runtime values |
| Event Source | Browser event being monitored |
| Throttle | Rate-limiting for high-frequency events |

## Folder Structure

```
creativeshire/experience/triggers/
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

### Don't: Return values

```typescript
// WRONG - Returning values causes React re-renders
function useScrollProgress(): number {
  const [progress, setProgress] = useState(0)
  return progress
}

// CORRECT - Write to store
function useScrollProgress(): void {
  const setScrollProgress = useExperienceStore(s => s.setScrollProgress)
}
```

**Why:** Returning values creates state that triggers re-renders on every update.

### Don't: Manipulate DOM

```typescript
// WRONG - Direct DOM manipulation
const handler = (e: MouseEvent) => {
  element.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
}

// CORRECT - Write to store, let driver handle DOM
const handler = (e: MouseEvent) => {
  setCursor({ x: e.clientX, y: e.clientY })
}
```

**Why:** Triggers must not bypass the Driver layer. Data flows through store.

### Don't: Non-passive listeners

```typescript
// WRONG - Blocks scrolling
window.addEventListener('scroll', handler)

// CORRECT - Non-blocking
window.addEventListener('scroll', handler, { passive: true })
```

**Why:** Non-passive listeners can block scroll for preventDefault handling.

### Don't: Missing cleanup

```typescript
// WRONG - Memory leak
useEffect(() => {
  window.addEventListener('scroll', handler, { passive: true })
}, [])

// CORRECT - Always return cleanup
useEffect(() => {
  window.addEventListener('scroll', handler, { passive: true })
  return () => window.removeEventListener('scroll', handler)
}, [])
```

### Don't: Missing SSR guard

```typescript
// WRONG - Crashes on server
useEffect(() => {
  window.addEventListener('scroll', handler)
}, [])

// CORRECT - SSR safe
useEffect(() => {
  if (typeof window === 'undefined') return
  window.addEventListener('scroll', handler, { passive: true })
  return () => window.removeEventListener('scroll', handler)
}, [])
```

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
