# Integration Testing

> Validates layer boundaries, data flow, and component composition across Creativeshire layers.

---

## Overview

Integration tests verify layers work correctly together.

| Focus | What It Validates |
|-------|-------------------|
| Layer boundaries | Content (L1) never imports from Experience (L2) |
| Data flow | Schema -> Renderer -> Component -> Driver -> CSS Variables |
| Provider nesting | ExperienceProvider -> DriverProvider -> BehaviourWrapper |
| Behaviour resolution | Mode defaults cascade correctly |

---

## When to Use

- Testing renderer-to-component composition
- Verifying behaviour resolution from modes
- Testing provider context availability
- Validating driver registration flow

---

## Test Location

```
creativeshire/__tests__/integration/
├── layer-boundaries.test.ts
├── renderer-integration.test.tsx
├── mode-behaviour.test.tsx
└── provider-integration.test.tsx
```

---

## Layer Boundary Tests

Verify Content Layer (L1) never imports from Experience Layer (L2).

```typescript
// creativeshire/__tests__/integration/layer-boundaries.test.ts
import { describe, it, expect } from 'vitest'
import { globSync } from 'glob'
import fs from 'fs'

describe('Layer Boundaries', () => {
  const contentFiles = globSync('creativeshire/content/**/*.{ts,tsx}')

  contentFiles.forEach(file => {
    it(`${file} does not import from experience`, () => {
      const source = fs.readFileSync(file, 'utf-8')
      expect(source).not.toMatch(/from\s+['"].*experience\//)
    })
  })

  const cssFiles = globSync('creativeshire/content/**/*.css')

  cssFiles.forEach(file => {
    it(`${file} does not use viewport units`, () => {
      const css = fs.readFileSync(file, 'utf-8')
      expect(css).not.toMatch(/100vh|100dvh|100svh/)
    })
  })
})
```

---

## Renderer Integration

Tests schema-to-component mapping and behaviour resolution.

### Test Wrapper

```typescript
// creativeshire/__tests__/utils/test-providers.tsx
export function createTestWrapper(mode = staticMode) {
  return ({ children }: { children: React.ReactNode }) => (
    <ExperienceProvider mode={mode} store={mode.createStore()}>
      <DriverProvider>{children}</DriverProvider>
    </ExperienceProvider>
  )
}
```

### WidgetRenderer Tests

```typescript
// creativeshire/__tests__/integration/renderer-integration.test.tsx
describe('WidgetRenderer', () => {
  const TestWrapper = createTestWrapper()

  it('renders widget from schema', () => {
    render(<TestWrapper><WidgetRenderer widget={{ type: 'Text', props: { content: 'Hello' } }} /></TestWrapper>)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('renders nested widgets', () => {
    const schema = {
      type: 'Stack',
      props: {},
      widgets: [{ type: 'Text', props: { content: 'Child' } }]
    }
    render(<TestWrapper><WidgetRenderer widget={schema} /></TestWrapper>)
    expect(screen.getByText('Child')).toBeInTheDocument()
  })

  it('renders error for unknown type', () => {
    render(<TestWrapper><WidgetRenderer widget={{ type: 'Unknown', props: {} }} /></TestWrapper>)
    expect(screen.getByText(/Unknown widget/)).toBeInTheDocument()
  })
})
```

---

## Mode Integration

Tests Mode -> Behaviour -> Driver flow.

```typescript
// creativeshire/__tests__/integration/mode-behaviour.test.tsx
describe('Mode Behaviour Resolution', () => {
  it('applies mode default behaviour', () => {
    const { container } = render(
      <ExperienceProvider mode={parallaxMode} store={parallaxMode.createStore()}>
        <DriverProvider>
          <SectionRenderer section={{ id: 'test', widgets: [] }} index={0} />
        </DriverProvider>
      </ExperienceProvider>
    )
    expect(container.querySelector('[data-behaviour="scroll-stack"]')).toBeInTheDocument()
  })

  it('explicit behaviour overrides default', () => {
    const { container } = render(
      <ExperienceProvider mode={parallaxMode} store={parallaxMode.createStore()}>
        <DriverProvider>
          <SectionRenderer section={{ id: 'test', behaviour: 'depth-layer', widgets: [] }} index={0} />
        </DriverProvider>
      </ExperienceProvider>
    )
    expect(container.querySelector('[data-behaviour="depth-layer"]')).toBeInTheDocument()
  })

  it('behaviour: none skips wrapping', () => {
    const { container } = render(
      <ExperienceProvider mode={parallaxMode} store={parallaxMode.createStore()}>
        <DriverProvider>
          <SectionRenderer section={{ id: 'test', behaviour: 'none', widgets: [] }} index={0} />
        </DriverProvider>
      </ExperienceProvider>
    )
    expect(container.querySelector('[data-behaviour]')).not.toBeInTheDocument()
  })
})
```

---

## Driver Registration

Tests driver lifecycle: register on mount, unregister on unmount.

```typescript
describe('Driver Registration', () => {
  it('registers on mount, unregisters on unmount', async () => {
    const mockDriver = { register: vi.fn(), unregister: vi.fn() }

    const { unmount } = render(
      <ExperienceProvider mode={parallaxMode} store={parallaxMode.createStore()}>
        <DriverProvider driver={mockDriver}>
          <SectionRenderer section={{ id: 'test', widgets: [] }} index={0} />
        </DriverProvider>
      </ExperienceProvider>
    )

    await waitFor(() => {
      expect(mockDriver.register).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(HTMLElement),
        expect.objectContaining({ id: 'scroll-stack' }),
        expect.any(Object)
      )
    })

    unmount()
    expect(mockDriver.unregister).toHaveBeenCalled()
  })
})
```

---

## Provider Integration

Tests context availability and error handling.

```typescript
// creativeshire/__tests__/integration/provider-integration.test.tsx
describe('Provider Integration', () => {
  const wrapper = ({ children }) => (
    <ExperienceProvider mode={parallaxMode} store={parallaxMode.createStore()}>
      <DriverProvider>{children}</DriverProvider>
    </ExperienceProvider>
  )

  it('useExperience returns mode', () => {
    const { result } = renderHook(() => useExperience(), { wrapper })
    expect(result.current.mode.id).toBe('parallax')
  })

  it('useDriver returns driver instance', () => {
    const { result } = renderHook(() => useDriver(), { wrapper })
    expect(typeof result.current.register).toBe('function')
  })

  it('throws outside provider', () => {
    expect(() => renderHook(() => useExperience())).toThrow()
    expect(() => renderHook(() => useDriver())).toThrow()
  })
})
```

---

## Test Utilities

### Mock Driver

```typescript
// creativeshire/__tests__/utils/mock-driver.ts
export function createMockDriver() {
  const targets = new Map()
  return {
    targets,
    register: vi.fn((id, el, b, o) => targets.set(id, { el, b, o })),
    unregister: vi.fn((id) => targets.delete(id)),
    destroy: vi.fn(() => targets.clear())
  }
}
```

---

## Per-Component Requirements

| Component | Required Integration Tests |
|-----------|---------------------------|
| Renderer | Schema mapping, behaviour resolution, error handling |
| Mode | Default behaviours applied, store created |
| BehaviourWrapper | Driver registration, cleanup on unmount |
| Provider | Context available, throws outside |

---

## Checklist

- [ ] Layer boundary tests pass (no cross-imports)
- [ ] Renderer maps all widget types correctly
- [ ] Behaviour resolution follows cascade rules
- [ ] Driver registration occurs on mount
- [ ] Driver unregistration occurs on unmount
- [ ] Provider contexts available to nested components

---

## See Also

- [Testing Strategy](./strategy.spec.md) - Overall testing philosophy
- [Contracts](../core/contracts.spec.md) - Layer boundaries
- [Experience Layer](../layers/experience.spec.md) - Mode-Behaviour-Driver flow
- [Renderer Layer](../layers/renderer.spec.md) - Schema-to-component mapping
