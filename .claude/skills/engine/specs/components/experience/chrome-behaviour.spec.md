# Chrome Behaviour Spec

> Behaviours that animate chrome regions (header, footer, cursor, loader) based on scroll and state.

**Base interface:** See [behaviour.spec.md](./behaviour.spec.md) for `Behaviour` interface, `compute()` contract, and core rules.

## Purpose

Chrome behaviours extend section behaviours for fixed/overlay elements that persist across the page. They receive extended state (scroll direction, velocity, mouse position) and return region-prefixed CSS variables (`--header-*`, `--footer-*`, `--cursor-*`, `--loader-*`).

## Concepts

| Term | Definition |
|------|------------|
| Chrome Behaviour | Behaviour targeting header, footer, sidebar chrome regions |
| Region Behaviour | Behaviour scoped to a specific chrome region |
| Overlay Behaviour | Behaviour for overlay elements (cursor, loader) |
| Chrome State | Extended state with scroll direction, velocity, mouse position |

## Folder Structure

```
engine/experience/behaviours/
├── types.ts                      # Shared types
├── registry.ts                   # Auto-discovery
├── header-hide-on-scroll/
│   └── index.ts                  # Header behaviour
├── header-shrink/
│   └── index.ts                  # Header behaviour
├── footer-reveal/
│   └── index.ts                  # Footer behaviour
├── cursor-follow/
│   └── index.ts                  # Cursor behaviour
├── loader-fade/
│   └── index.ts                  # Loader behaviour
```

## Available Chrome Behaviours

| Behaviour | Region | Effect | Variables Set |
|-----------|--------|--------|---------------|
| `header-hide-on-scroll` | Header | Hides header when scrolling down, shows on scroll up | `--header-y`, `--header-opacity` |
| `header-shrink` | Header | Header shrinks height as user scrolls | `--header-y`, `--header-scale` |
| `footer-reveal` | Footer | Footer slides in at page bottom | `--footer-y`, `--footer-opacity` |
| `cursor-follow` | Cursor | Custom cursor follows mouse position | `--cursor-x`, `--cursor-y` |
| `loader-fade` | Loader | Loader fades out on page load | `--loader-opacity` |

## Chrome State Extension

Chrome behaviours receive extended state beyond section behaviours:

```typescript
// Extended BehaviourState for chrome
export interface ChromeBehaviourState extends BehaviourState {
  scrollY: number              // Absolute scroll position
  scrollDirection: 'up' | 'down' | 'none'  // Scroll direction
  scrollVelocity: number       // Speed + direction
  mouseX: number               // Mouse X position
  mouseY: number               // Mouse Y position
  isLoaded: boolean            // Page load complete
  isAtTop: boolean             // At page top (scrollY < threshold)
  isAtBottom: boolean          // At page bottom
}
```

## CSS Variables

> Chrome behaviours WRITE these. Chrome components READ them via CSS.

### Header Variables

| Variable | Range | Fallback | Description |
|----------|-------|----------|-------------|
| `--header-y` | px value | `0` | Header vertical offset (negative = hidden) |
| `--header-opacity` | `0` to `1` | `1` | Header transparency |
| `--header-scale` | `0.8` to `1` | `1` | Header scale factor |

### Footer Variables

| Variable | Range | Fallback | Description |
|----------|-------|----------|-------------|
| `--footer-y` | px value | `0` | Footer vertical offset |
| `--footer-opacity` | `0` to `1` | `1` | Footer transparency |

### Cursor Variables

| Variable | Range | Fallback | Description |
|----------|-------|----------|-------------|
| `--cursor-x` | px value | `0` | Cursor X position |
| `--cursor-y` | px value | `0` | Cursor Y position |

### Loader Variables

| Variable | Range | Fallback | Description |
|----------|-------|----------|-------------|
| `--loader-opacity` | `0` to `1` | `1` | Loader transparency |

See [css-variables.spec.md](../../reference/css-variables.spec.md) for the complete variable catalog.

## Integration with Driver

Chrome behaviours register with the driver like section behaviours but target chrome elements:

```typescript
// Chrome component registration
useEffect(() => {
  const id = `header-${uniqueId()}`
  driver.register(id, headerRef.current, headerBehaviour, options)
  return () => driver.unregister(id)
}, [driver, headerBehaviour])
```

### Driver State Updates

The driver provides chrome-specific state via triggers:

| Trigger | Updates | Chrome Use |
|---------|---------|------------|
| Scroll trigger | `scrollY`, `scrollVelocity`, `scrollDirection` | Header/footer animation |
| Mouse trigger | `mouseX`, `mouseY` | Cursor following |
| Load trigger | `isLoaded` | Loader fade |

## BehaviourWrapper for Chrome

Chrome regions use the same `BehaviourWrapper` as content:

```typescript
// Header with hide-on-scroll behaviour
<BehaviourWrapper behaviour={headerHideOnScroll} options={{ threshold: 100 }}>
  <header className="fixed top-0 w-full">
    {/* Header content */}
  </header>
</BehaviourWrapper>
```

The wrapper applies `cssTemplate` styles inline and registers with the driver.

## Rules

### Must

1. Chrome behaviours follow the same interface as section behaviours
2. Use region-prefixed CSS variables (`--header-*`, `--footer-*`, `--cursor-*`, `--loader-*`)
3. Return static values when `prefersReducedMotion` is true
4. Include `isAtTop` check for header behaviours (often show header at page top)
5. Use `scrollDirection` for directional animations (not just `scrollVelocity`)
6. Cursor behaviours must handle mouse outside window gracefully
7. Loader behaviours must complete fade before removal
8. Chrome components use `position: fixed` or `position: absolute`
9. All variables have fallbacks in `cssTemplate`
10. Include `will-change` for animated properties

### Must Not

1. Use section-scoped variables (`--section-*`) in chrome behaviours
2. Modify scroll position or prevent scrolling
3. Create multiple chrome behaviour wrappers (use ONE generic `BehaviourWrapper`)
4. Apply chrome behaviours to content sections
5. Directly manipulate DOM in `compute()`
6. Use `setTimeout`/`setInterval` for animations (use driver tick)
7. Assume mouse position exists (may be touch device)

## Validation Rules

> Each rule maps 1:1 to `chrome-behaviour.validator.ts`

| # | Rule | Function | Files |
|---|------|----------|-------|
| 1 | Uses region-prefixed variables | `checkRegionPrefix` | `*-hide-on-scroll/index.ts` |
| 2 | Checks prefersReducedMotion | `checkReducedMotionHandled` | All chrome behaviours |
| 3 | Header checks isAtTop | `checkIsAtTop` | `header-*/index.ts` |
| 4 | Cursor handles missing mouse | `checkMouseFallback` | `cursor-*/index.ts` |
| 5 | Uses scrollDirection not just velocity | `checkScrollDirection` | Directional behaviours |
| 6 | No DOM manipulation in compute | `checkNoDomManipulation` | All behaviours |

## Templates

### header-hide-on-scroll

Hides header when scrolling down, reveals when scrolling up.

```typescript
// behaviours/header-hide-on-scroll/index.ts
import { Behaviour, ChromeBehaviourState } from '../types'

const headerHideOnScroll: Behaviour = {
  id: 'header-hide-on-scroll',
  name: 'Header Hide on Scroll',
  description: 'Hides header when scrolling down, shows on scroll up',
  requires: ['scrollDirection', 'scrollY', 'isAtTop', 'prefersReducedMotion'],

  compute: (state: ChromeBehaviourState, options) => {
    // Respect reduced motion
    if (state.prefersReducedMotion) {
      return {
        '--header-y': 0,
        '--header-opacity': 1
      }
    }

    // Always show at page top
    if (state.isAtTop) {
      return {
        '--header-y': 0,
        '--header-opacity': 1
      }
    }

    const headerHeight = options?.headerHeight ?? 80
    const isHidden = state.scrollDirection === 'down'

    return {
      '--header-y': isHidden ? -headerHeight : 0,
      '--header-opacity': isHidden ? 0 : 1
    }
  },

  cssTemplate: `
    transform: translateY(calc(var(--header-y, 0) * 1px));
    opacity: var(--header-opacity, 1);
    transition: transform 0.3s ease, opacity 0.3s ease;
    will-change: transform, opacity;
  `,

  options: {
    headerHeight: {
      type: 'range',
      label: 'Header Height',
      default: 80,
      min: 40,
      max: 200,
      step: 10
    }
  }
}

export default headerHideOnScroll
```

### header-shrink

Header shrinks as user scrolls past threshold.

```typescript
// behaviours/header-shrink/index.ts
import { Behaviour, ChromeBehaviourState } from '../types'

const headerShrink: Behaviour = {
  id: 'header-shrink',
  name: 'Header Shrink',
  description: 'Header shrinks as user scrolls',
  requires: ['scrollY', 'prefersReducedMotion'],

  compute: (state: ChromeBehaviourState, options) => {
    if (state.prefersReducedMotion) {
      return {
        '--header-scale': 1,
        '--header-y': 0
      }
    }

    const threshold = options?.threshold ?? 100
    const minScale = options?.minScale ?? 0.8
    const progress = Math.min(1, state.scrollY / threshold)
    const scale = 1 - (progress * (1 - minScale))

    return {
      '--header-scale': scale,
      '--header-y': 0
    }
  },

  cssTemplate: `
    transform: translateY(var(--header-y, 0)) scale(var(--header-scale, 1));
    transform-origin: top center;
    will-change: transform;
  `,

  options: {
    threshold: {
      type: 'range',
      label: 'Shrink Threshold',
      default: 100,
      min: 50,
      max: 300,
      step: 25
    },
    minScale: {
      type: 'range',
      label: 'Minimum Scale',
      default: 0.8,
      min: 0.6,
      max: 1,
      step: 0.05
    }
  }
}

export default headerShrink
```

### cursor-follow

Custom cursor follows mouse position.

```typescript
// behaviours/cursor-follow/index.ts
import { Behaviour, ChromeBehaviourState } from '../types'

const cursorFollow: Behaviour = {
  id: 'cursor-follow',
  name: 'Cursor Follow',
  description: 'Custom cursor follows mouse position',
  requires: ['mouseX', 'mouseY', 'prefersReducedMotion'],

  compute: (state: ChromeBehaviourState, options) => {
    // Hide cursor if no mouse position (touch device or mouse outside)
    if (state.mouseX === undefined || state.mouseY === undefined) {
      return {
        '--cursor-x': -100,  // Off-screen
        '--cursor-y': -100,
        '--cursor-opacity': 0
      }
    }

    if (state.prefersReducedMotion) {
      return {
        '--cursor-x': state.mouseX,
        '--cursor-y': state.mouseY,
        '--cursor-opacity': 1
      }
    }

    const lag = options?.lag ?? 0.1
    // Note: Smoothing happens via CSS transition, not in compute
    return {
      '--cursor-x': state.mouseX,
      '--cursor-y': state.mouseY,
      '--cursor-opacity': 1
    }
  },

  cssTemplate: `
    transform: translate(var(--cursor-x, -100px), var(--cursor-y, -100px));
    opacity: var(--cursor-opacity, 0);
    transition: transform 0.1s ease-out;
    will-change: transform;
    pointer-events: none;
  `,

  options: {
    lag: {
      type: 'range',
      label: 'Cursor Lag',
      default: 0.1,
      min: 0,
      max: 0.3,
      step: 0.05
    }
  }
}

export default cursorFollow
```

### loader-fade

Loader fades out when page is loaded.

```typescript
// behaviours/loader-fade/index.ts
const loaderFade: Behaviour = {
  id: 'loader-fade',
  requires: ['isLoaded', 'prefersReducedMotion'],
  compute: (state) => ({ '--loader-opacity': state.isLoaded ? 0 : 1 }),
  cssTemplate: `opacity: var(--loader-opacity, 1); transition: opacity 0.5s ease-out; will-change: opacity; pointer-events: none;`
}
```

## Anti-Patterns

### Don't: Use section variables for chrome

```typescript
// WRONG - Section variables for header
compute: (state) => ({
  '--section-y': -80  // Wrong prefix!
})

// CORRECT - Chrome-scoped variables
compute: (state) => ({
  '--header-y': -80
})
```

**Why:** Variable prefixes indicate ownership. Chrome uses `--header-*`, `--footer-*`, etc.

### Don't: Ignore page top state

```typescript
// WRONG - Header hidden at page top
compute: (state) => ({
  '--header-y': state.scrollDirection === 'down' ? -80 : 0
})

// CORRECT - Always show at top
compute: (state) => {
  if (state.isAtTop) {
    return { '--header-y': 0, '--header-opacity': 1 }
  }
  return {
    '--header-y': state.scrollDirection === 'down' ? -80 : 0,
    '--header-opacity': state.scrollDirection === 'down' ? 0 : 1
  }
}
```

**Why:** Users expect header visible at page top for navigation access.

### Don't: Assume mouse exists

```typescript
// WRONG - Crashes on touch device
compute: (state) => ({
  '--cursor-x': state.mouseX,  // undefined on touch!
  '--cursor-y': state.mouseY
})

// CORRECT - Fallback for missing mouse
compute: (state) => {
  if (state.mouseX === undefined) {
    return { '--cursor-opacity': 0 }
  }
  return {
    '--cursor-x': state.mouseX,
    '--cursor-y': state.mouseY,
    '--cursor-opacity': 1
  }
}
```

**Why:** Touch devices don't have persistent mouse position.

### Don't: Use velocity alone for direction

```typescript
// WRONG - Velocity can be noisy
compute: (state) => ({
  '--header-y': state.scrollVelocity > 0 ? -80 : 0
})

// CORRECT - Use computed direction
compute: (state) => ({
  '--header-y': state.scrollDirection === 'down' ? -80 : 0
})
```

**Why:** `scrollDirection` is debounced/smoothed; raw velocity jitters.

## Testing

> **Required.** Chrome behaviours have pure `compute()` functions.

### What to Test

| Test | Required | Why |
|------|----------|-----|
| Returns chrome-prefixed variables | Yes | Namespace isolation |
| Handles `prefersReducedMotion` | Yes | Accessibility |
| Header shows at `isAtTop` | Yes | UX requirement |
| Cursor handles missing mouse | Yes | Touch device support |
| Pure function (same input = same output) | Yes | No side effects |

### Test Template

See [behaviour.spec.md](./behaviour.spec.md) for base test template. Chrome behaviours add these tests:

```typescript
// Additional chrome-specific tests
it('returns region-prefixed CSS variables', () => {
  Object.keys(result).forEach(key => {
    expect(key).toMatch(/^--(header|footer|cursor|loader)-/)
  })
})

it('shows header at page top (header behaviours)', () => {
  const result = behaviour.compute({ isAtTop: true, scrollDirection: 'down' }, {})
  expect(result['--header-y']).toBe(0)
})

it('handles missing mouse position (cursor behaviours)', () => {
  const result = behaviour.compute({ mouseX: undefined }, {})
  expect(result['--cursor-opacity']).toBe(0)
})
```

### Definition of Done

A chrome behaviour is complete when:

- [ ] All tests pass: `npm test -- behaviours/{name}`
- [ ] Uses region-prefixed variables
- [ ] Handles `prefersReducedMotion`
- [ ] Edge cases tested (isAtTop, missing mouse, etc.)
- [ ] No TypeScript errors

### Running Tests

```bash
# Single behaviour
npm test -- behaviours/header-hide-on-scroll

# All chrome behaviours
npm test -- behaviours/header behaviours/footer behaviours/cursor behaviours/loader
```

---

## Integration

| Interacts With | Direction | How |
|----------------|-----------|-----|
| `driver` | Called by | Driver invokes `compute()` every frame |
| `trigger` | Receives | Scroll/mouse triggers update chrome state |
| `provider` | Uses | DriverProvider supplies driver instance |
| Chrome components | Wraps | BehaviourWrapper wraps chrome regions |
| `css-variables` | Defines | Chrome variables defined in catalog |

## Validator

Validated by: `./chrome-behaviour.validator.ts`

Rules in "Must/Must Not" map 1:1 to validator checks.

---

## See Also

- [Behaviour Spec](./behaviour.spec.md) - Base behaviour interface
- [Driver Spec](./driver.spec.md) - How driver applies CSS variables
- [CSS Variables Spec](../../reference/css-variables.spec.md) - Chrome variable definitions
- [Trigger Spec](./trigger.spec.md) - State providers for scroll/mouse
