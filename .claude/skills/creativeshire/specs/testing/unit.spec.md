# Unit Testing

> Component-level tests verifying rendering, props, pure functions, and architectural compliance. Co-located with source code.

---

## Overview

Unit tests verify individual components in isolation:

| Component Type | Focus |
|----------------|-------|
| Widget | Renders, props applied, no forbidden patterns |
| Behaviour | `compute()` returns valid CSSVariables |
| Driver | `register`/`unregister`/`destroy`, cleanup |
| Trigger | Store updates, cleanup |
| Composite | Returns correct schema shape |
| Schema | TypeScript compilation |

---

## Test Location

```
creativeshire/{layer}/{component}/
└── __tests__/
    └── {Component}.test.{ts,tsx}
```

Co-locate tests with source. Use `.test.ts` for pure logic, `.test.tsx` for React components.

---

## Test Structure

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Text from '../index'

describe('Text', () => {
  it('renders with required props', () => {
    render(<Text content="Hello" />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

---

## Widget Tests

### Required Tests

| Test | Purpose |
|------|---------|
| Renders with minimal props | Component mounts |
| Renders with all optional props | All prop combinations work |
| Children render (layout only) | Layout widgets pass children |
| No forbidden patterns | Source compliance |

### Example

```typescript
// creativeshire/content/widgets/content/Text/__tests__/Text.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Text from '../index'

describe('Text', () => {
  it('renders with content prop', () => {
    render(<Text content="Hello" />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('applies descriptive className', () => {
    const { container } = render(<Text content="Test" />)
    expect(container.querySelector('.text-widget')).toBeTruthy()
  })
})
```

### Contract Compliance

```typescript
// creativeshire/content/widgets/content/Text/__tests__/Text.contract.test.ts
import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('Widget Contract', () => {
  const widgetDir = path.resolve(__dirname, '..')

  it('does not import from experience layer', () => {
    const source = fs.readFileSync(path.join(widgetDir, 'index.tsx'), 'utf-8')
    expect(source).not.toMatch(/from\s+['"].*experience\//)
  })

  it('CSS variables have fallbacks', () => {
    const stylesPath = path.join(widgetDir, 'styles.css')
    if (!fs.existsSync(stylesPath)) return
    const css = fs.readFileSync(stylesPath, 'utf-8')
    const vars = css.match(/var\(--[^)]+\)/g) || []
    vars.forEach(v => expect(v).toMatch(/var\(--[\w-]+,\s*.+\)/))
  })

  it('does not use viewport units', () => {
    const source = fs.readFileSync(path.join(widgetDir, 'index.tsx'), 'utf-8')
    expect(source).not.toMatch(/100vh|100vw|100dvh/)
  })
})
```

---

## Behaviour Tests

### Required Tests

| Test | Purpose |
|------|---------|
| Returns valid CSSVariables | All keys are `--prefixed` |
| Values are strings or numbers | Type compliance |
| Pure function | Same input produces same output |
| Handles edge cases | Zero, negative, boundary values |

### Example

```typescript
// creativeshire/experience/behaviours/depth-layer/__tests__/depth-layer.test.ts
import { describe, it, expect } from 'vitest'
import { depthLayerBehaviour } from '../index'

describe('depthLayerBehaviour', () => {
  it('returns CSS variables only', () => {
    const result = depthLayerBehaviour.compute({ scrollProgress: 0.5 }, {})
    Object.keys(result).forEach(key => expect(key).toMatch(/^--/))
  })

  it('returns strings or numbers only', () => {
    const result = depthLayerBehaviour.compute({ scrollProgress: 0.5 }, {})
    Object.values(result).forEach(v => expect(['string', 'number']).toContain(typeof v))
  })

  it('is a pure function', () => {
    const state = { scrollProgress: 0.5 }
    expect(depthLayerBehaviour.compute(state, {}))
      .toEqual(depthLayerBehaviour.compute(state, {}))
  })

  it('handles boundary values', () => {
    expect(depthLayerBehaviour.compute({ scrollProgress: 0 }, {})).toHaveProperty('--depth-y')
    expect(depthLayerBehaviour.compute({ scrollProgress: 1 }, {})).toHaveProperty('--depth-y')
  })
})

describe('cssTemplate', () => {
  it('uses fallbacks for all CSS variables', () => {
    const vars = depthLayerBehaviour.cssTemplate.match(/var\(--[^)]+\)/g) || []
    vars.forEach(v => expect(v).toMatch(/var\(--[\w-]+,\s*.+\)/))
  })
})
```

---

## Driver Tests

### Required Tests

| Test | Purpose |
|------|---------|
| `register()` adds target | Target in internal Map |
| `unregister()` removes target | Target removed from Map |
| `destroy()` cleans up | Listeners removed, Map cleared |
| Uses `setProperty()` only | No direct style assignment |
| Passive event listener | Non-blocking scroll |

### Example

```typescript
// creativeshire/experience/drivers/__tests__/ScrollDriver.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ScrollDriver } from '../ScrollDriver'

describe('ScrollDriver', () => {
  let driver: ScrollDriver
  let element: HTMLElement

  beforeEach(() => {
    driver = new ScrollDriver()
    element = document.createElement('div')
  })

  afterEach(() => driver.destroy())

  it('registers target', () => {
    const behaviour = { id: 'test', compute: () => ({ '--y': 50 }), requires: [], cssTemplate: '' }
    driver.register('id-1', element, behaviour, {})
    expect(driver['targets'].has('id-1')).toBe(true)
  })

  it('unregisters target', () => {
    const behaviour = { id: 'test', compute: () => ({}), requires: [], cssTemplate: '' }
    driver.register('id-1', element, behaviour, {})
    driver.unregister('id-1')
    expect(driver['targets'].has('id-1')).toBe(false)
  })

  it('clears all targets on destroy', () => {
    const behaviour = { id: 'test', compute: () => ({}), requires: [], cssTemplate: '' }
    driver.register('id-1', element, behaviour, {})
    driver.destroy()
    expect(driver['targets'].size).toBe(0)
  })

  it('sets CSS variables via setProperty', () => {
    const spy = vi.spyOn(element.style, 'setProperty')
    const behaviour = { id: 'test', compute: () => ({ '--y': 50 }), requires: [], cssTemplate: '' }
    driver.register('id-1', element, behaviour, {})
    driver['update']()
    expect(spy).toHaveBeenCalledWith('--y', '50')
  })
})

describe('Event Listeners', () => {
  it('uses passive scroll listener', () => {
    const spy = vi.spyOn(window, 'addEventListener')
    const driver = new ScrollDriver()
    expect(spy).toHaveBeenCalledWith('scroll', expect.any(Function), expect.objectContaining({ passive: true }))
    driver.destroy()
  })

  it('removes listener on destroy', () => {
    const spy = vi.spyOn(window, 'removeEventListener')
    const driver = new ScrollDriver()
    driver.destroy()
    expect(spy).toHaveBeenCalledWith('scroll', expect.any(Function))
  })
})
```

---

## Trigger Tests

### Required Tests

| Test | Purpose |
|------|---------|
| Updates store | Store receives correct values |
| Cleanup on unmount | Event listeners removed |
| SSR guard | No errors in SSR |
| Returns void | No React state updates |

### Example

```typescript
// creativeshire/experience/triggers/__tests__/useScrollProgress.test.ts
import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useScrollProgress } from '../useScrollProgress'

describe('useScrollProgress', () => {
  afterEach(() => vi.restoreAllMocks())

  it('returns void', () => {
    const { result } = renderHook(() => useScrollProgress())
    expect(result.current).toBeUndefined()
  })

  it('adds scroll listener on mount', () => {
    const spy = vi.spyOn(window, 'addEventListener')
    renderHook(() => useScrollProgress())
    expect(spy).toHaveBeenCalledWith('scroll', expect.any(Function), expect.objectContaining({ passive: true }))
  })

  it('removes scroll listener on unmount', () => {
    const spy = vi.spyOn(window, 'removeEventListener')
    const { unmount } = renderHook(() => useScrollProgress())
    unmount()
    expect(spy).toHaveBeenCalledWith('scroll', expect.any(Function))
  })
})
```

---

## Composite Tests

### Required Tests

| Test | Purpose |
|------|---------|
| Returns correct shape | Schema matches structure |
| Props passed through | Input appears in output |
| Default values applied | Missing props use defaults |

### Example

```typescript
// creativeshire/content/widgets/__tests__/createTextWidget.test.ts
import { describe, it, expect } from 'vitest'
import { createTextWidget } from '../composites'

describe('createTextWidget', () => {
  it('returns correct schema shape', () => {
    const schema = createTextWidget({ content: 'Hello' })
    expect(schema).toHaveProperty('type', 'Text')
    expect(schema.props).toHaveProperty('content', 'Hello')
  })

  it('passes features through', () => {
    const schema = createTextWidget({ content: 'Test', features: { color: 'red' } })
    expect(schema.props.features).toEqual({ color: 'red' })
  })
})
```

---

## Schema Tests

Verify types via TypeScript compilation.

```typescript
// creativeshire/schema/__tests__/types.test.ts
import { describe, it, expectTypeOf } from 'vitest'
import type { WidgetSchema, SectionSchema } from '../types'

describe('Schema Types', () => {
  it('WidgetSchema requires type field', () => {
    const valid: WidgetSchema = { type: 'Text', props: { content: 'Hi' } }
    expectTypeOf(valid).toMatchTypeOf<WidgetSchema>()
  })
})
```

---

## Running Tests

```bash
npm test                               # All tests
npm test -- --watch                    # Watch mode
npm test -- --coverage                 # Coverage report
npm test -- creativeshire/content      # Specific path
```

---

## Coverage Requirements

| Component | Minimum |
|-----------|---------|
| Widget | 80% |
| Behaviour | 100% `compute()` |
| Driver | 90% |
| Trigger | 90% |

### Critical Paths (100% Required)

- Behaviour `compute()` functions
- Driver `register()`/`unregister()`/`destroy()`
- Trigger cleanup functions
- Layer boundary compliance

---

## See Also

- [Testing Strategy](./strategy.spec.md) - Overall testing philosophy
- [Widget Contract](../components/content/widget.spec.md)
- [Behaviour Contract](../components/experience/behaviour.spec.md)
- [Driver Contract](../components/experience/driver.spec.md)
- [Trigger Contract](../components/experience/trigger.spec.md)
