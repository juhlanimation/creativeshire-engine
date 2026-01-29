# Testing Strategy

> Minimal reference. Domain-specific tests documented in each component spec.

## Quick Reference

| Component | Test Type | Location |
|-----------|-----------|----------|
| Behaviour | Unit (REQUIRED) | [behaviour.spec.md](../components/experience/behaviour.spec.md#testing) |
| Driver | Unit (REQUIRED) | [driver.spec.md](../components/experience/driver.spec.md#testing) |
| Trigger | Unit (REQUIRED) | [trigger.spec.md](../components/experience/trigger.spec.md#testing) |
| Widget | Browser-based | [widget.spec.md](../components/content/widget.spec.md#testing) |
| Widget Composite | Schema validation | [widget-composite.spec.md](../components/content/widget-composite.spec.md#testing) |
| Section Pattern | Schema validation | [section-pattern.spec.md](../components/content/section-pattern.spec.md#testing) |
| Mode | Unit | [mode.spec.md](../components/experience/mode.spec.md#testing) |
| Provider | Unit (REQUIRED) | [provider.spec.md](../components/experience/provider.spec.md#testing) |
| Renderer | Unit + Browser | [renderer.spec.md](../components/renderer/renderer.spec.md#testing) |
| Preset | Schema validation | [preset.spec.md](../components/preset/preset.spec.md#testing) |
| Site | Schema validation | [site.spec.md](../components/site/site.spec.md#testing) |

---

## Global Validations

These apply across all components.

### Layer Boundary Check

Content Layer (L1) must never import from Experience Layer (L2).

```bash
# Should return no results
grep -r "from.*experience\/" creativeshire/content/
```

```typescript
// Programmatic validation
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

### CSS Variable Fallbacks

All CSS variables must have fallbacks.

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

### No Viewport Units in L1

```bash
# Should return no results
grep -r "100vh\|100dvh\|100vw" creativeshire/content/
```

---

## Test Tools

| Tool | Purpose |
|------|---------|
| Vitest | Unit/integration tests |
| @testing-library/react | Component rendering |
| jsdom | Browser environment |
| glob | File pattern matching |

### Vitest Config

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['creativeshire/**/*.test.{ts,tsx}'],
    setupFiles: ['./vitest.setup.ts']
  }
})
```

---

## Running Tests

```bash
# All tests
npm test

# Specific component type
npm test -- behaviours/
npm test -- drivers/
npm test -- triggers/

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

---

## Test Co-location

Tests live alongside source files:

```
creativeshire/experience/behaviours/depth-layer/
├── index.ts
└── index.test.ts    # Co-located
```

Not in separate `__tests__/` folders.
