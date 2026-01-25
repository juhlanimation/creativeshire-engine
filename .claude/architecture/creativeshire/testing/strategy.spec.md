# Testing Strategy

> Testing philosophy for Creativeshire. Validates layer separation and CSS variable contracts.

---

## Overview

Creativeshire testing validates two invariants:

1. **Layer separation** - Content Layer (L1) never imports from Experience Layer (L2)
2. **CSS variable contract** - Drivers set only `--prefixed` variables, CSS declares fallbacks

---

## Test Types

| Type | Purpose | Tools |
|------|---------|-------|
| **Unit** | Component behavior | Vitest, Testing Library |
| **Contract** | Layer boundary compliance | Custom validators |
| **Integration** | Component composition | Testing Library |

---

## Test Location

```
creativeshire/{layer}/{component}/
└── __tests__/
    └── {Component}.test.{ts,tsx}
```

Co-locate tests with source.

---

## Per-Component Requirements

| Component | Unit | Contract | Integration |
|-----------|------|----------|-------------|
| Widget | Required | Required | Optional |
| Section | Required | Required | Optional |
| Behaviour | Required | Required | Required |
| Driver | Required | Required | Required |
| Renderer | Required | - | Required |

---

## Widget Testing

### Checklist

- [ ] Renders with minimal props
- [ ] Renders with all optional props
- [ ] Children render (layout widgets only)
- [ ] No viewport units in output
- [ ] CSS variables have fallbacks

### Example

```typescript
// content/widgets/content/Text/__tests__/Text.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Text from '../index'

describe('Text', () => {
  it('renders with content prop', () => {
    render(<Text content="Hello" />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### Contract Validation

```typescript
describe('Widget Contract', () => {
  it('does not import from experience layer', () => {
    const source = fs.readFileSync('index.tsx', 'utf-8')
    expect(source).not.toMatch(/from.*experience\//)
  })

  it('CSS variables have fallbacks', () => {
    const styles = fs.readFileSync('styles.css', 'utf-8')
    const vars = styles.match(/var\(--[^)]+\)/g) || []
    vars.forEach(v => expect(v).toMatch(/var\(--[\w-]+,\s*.+\)/))
  })
})
```

---

## Behaviour Testing

### Checklist

- [ ] `compute()` returns valid CSSVariables
- [ ] All returned keys are `--prefixed`
- [ ] Values are strings or numbers only
- [ ] Pure function (no side effects)
- [ ] `cssTemplate` uses fallbacks

### Example

```typescript
// experience/behaviours/depth-layer/__tests__/depth-layer.test.ts
import { describe, it, expect } from 'vitest'
import { depthLayerBehaviour } from '../index'

describe('depthLayerBehaviour', () => {
  it('compute returns CSS variables only', () => {
    const result = depthLayerBehaviour.compute({ scrollProgress: 0.5 }, {})
    Object.keys(result).forEach(key => expect(key).toMatch(/^--/))
  })

  it('compute is pure', () => {
    const state = { scrollProgress: 0.5 }
    expect(depthLayerBehaviour.compute(state, {}))
      .toEqual(depthLayerBehaviour.compute(state, {}))
  })
})
```

---

## Driver Testing

### Checklist

- [ ] `register()` adds target to Map
- [ ] `unregister()` removes target
- [ ] `destroy()` clears Map, removes listeners
- [ ] Only calls `setProperty()` for CSS variables
- [ ] Event listener uses `{ passive: true }`

### Example

```typescript
// experience/drivers/__tests__/ScrollDriver.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ScrollDriver } from '../ScrollDriver'

describe('ScrollDriver', () => {
  let driver: ScrollDriver
  let el: HTMLElement

  beforeEach(() => {
    driver = new ScrollDriver()
    el = document.createElement('div')
    vi.spyOn(el.style, 'setProperty')
  })

  afterEach(() => driver.destroy())

  it('sets CSS variables via setProperty', () => {
    const behaviour = { id: 'test', compute: () => ({ '--y': 50 }), requires: [], cssTemplate: '' }
    driver.register('id', el, behaviour, {})
    expect(el.style.setProperty).toHaveBeenCalledWith('--y', '50')
  })
})
```

---

## Layer Boundary Testing

Verify Content Layer never imports from Experience Layer.

### CLI Verification

```bash
grep -r "from.*experience\/" creativeshire/content/
grep -r "100vh\|100dvh" creativeshire/content/
```

No results indicates clean separation.

### Programmatic Test

```typescript
import { globSync } from 'glob'
import fs from 'fs'

describe('Layer Boundaries', () => {
  globSync('creativeshire/content/**/*.{ts,tsx}').forEach(file => {
    it(`${file} does not import from experience`, () => {
      const source = fs.readFileSync(file, 'utf-8')
      expect(source).not.toMatch(/from\s+['"].*experience\//)
    })
  })
})
```

---

## CSS Variable Testing

### Fallback Verification

```typescript
describe('CSS Variable Fallbacks', () => {
  globSync('creativeshire/**/*.css').forEach(file => {
    it(`${file} has fallbacks`, () => {
      const css = fs.readFileSync(file, 'utf-8')
      const vars = css.match(/var\(--[^)]+\)/g) || []
      vars.forEach(v => expect(v).toMatch(/var\(--[\w-]+,\s*.+\)/))
    })
  })
})
```

### Type Safety

```typescript
type CSSVariables = Record<`--${string}`, string | number>
// TypeScript rejects: { opacity: 0.5 }
// TypeScript allows: { '--opacity': 0.5 }
```

---

## Test Tools

| Tool | Purpose |
|------|---------|
| Vitest | Unit/integration tests |
| Testing Library | React components |
| jsdom | Browser environment |
| glob | File pattern matching |

### Vitest Config

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['creativeshire/**/__tests__/**/*.test.{ts,tsx}']
  }
})
```

---

## Coverage Requirements

| Component | Minimum |
|-----------|---------|
| Widget | 80% |
| Behaviour | 100% compute |
| Driver | 90% |

### Critical Paths (100% Required)

- Behaviour `compute()` functions
- Driver `register()`/`unregister()`/`destroy()`
- Layer boundary compliance

---

## Running Tests

```bash
npm test                                    # All tests
npm test -- --watch                         # Watch mode
npm test -- --coverage                      # Coverage
npm test -- creativeshire/content/widgets   # Specific path
```

---

## See Also

- [Philosophy](../core/philosophy.spec.md) - Layer separation principles
- [Widget Contract](../components/content/widget.spec.md) - Widget validation
- [Behaviour Contract](../components/experience/behaviour.spec.md) - Behaviour validation
- [Driver Contract](../components/experience/driver.spec.md) - Driver validation
