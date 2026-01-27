# Visual Testing

> Verifies CSS variable output, visual states, and SSR fallback behavior through rendered component inspection.

---

## Overview

Visual testing validates what users see. CSS variable-driven animations produce visual output requiring verification beyond unit tests: CSS variable output, SSR fallbacks, animation states, and component documentation.

---

## When to Use

| Scenario | Test Type |
|----------|-----------|
| Verify driver sets correct CSS variables | CSS Variable Test |
| Ensure components render before JS loads | SSR Fallback Test |
| Confirm animation states at scroll positions | Animation State Test |
| Document component visual variations | Storybook Story |
| Detect unintended visual changes | Snapshot Test |

---

## Test Location

```
creativeshire/{layer}/{component}/
└── __tests__/
    ├── {Component}.visual.test.tsx
    └── {Component}.stories.tsx
```

---

## CSS Variable Testing

Drivers output CSS variables. Visual tests verify these variables produce correct visual properties.

```typescript
// experience/drivers/__tests__/ScrollDriver.visual.test.tsx
describe('ScrollDriver Visual Output', () => {
  it('applies --y-offset to element style', () => {
    const el = document.createElement('div')
    const driver = new ScrollDriver()
    const behaviour = {
      id: 'position',
      compute: () => ({ '--y-offset': '100px' }),
      requires: ['scrollProgress'],
      cssTemplate: 'transform: translateY(var(--y-offset, 0))'
    }

    driver.register('test', el, behaviour, {})
    expect(el.style.getPropertyValue('--y-offset')).toBe('100px')
    driver.destroy()
  })

  it('computed style reflects CSS variable', () => {
    const el = document.createElement('div')
    el.style.cssText = 'opacity: var(--opacity, 1)'
    el.style.setProperty('--opacity', '0.5')
    expect(window.getComputedStyle(el).opacity).toBe('0.5')
  })
})
```

---

## SSR Fallback Testing

Components render on the server without JavaScript. Fallback values ensure correct initial visual state.

```typescript
// content/widgets/__tests__/Widget.ssr.test.tsx
import { renderToString } from 'react-dom/server'

describe('Widget SSR', () => {
  it('renders with fallback CSS variables', () => {
    const html = renderToString(<Widget />)
    expect(html).toContain('var(--y-offset, 0)')
    expect(html).not.toContain('var(--y-offset)')
  })

  it('renders visible without JavaScript', () => {
    const html = renderToString(<Widget />)
    expect(html).toContain('opacity: var(--opacity, 1)')
  })

  it('hydration matches SSR output', () => {
    const ssrHtml = renderToString(<Widget />)
    const { container } = render(<Widget />)
    expect(extractStyles(container.innerHTML)).toEqual(extractStyles(ssrHtml))
  })
})
```

---

## Animation State Testing

Scroll-driven animations produce different visual states. Test specific scroll positions.

```typescript
// experience/behaviours/__tests__/depth-layer.visual.test.ts
describe('depthLayerBehaviour Visual States', () => {
  const cases = [
    { progress: 0, expected: { '--y-offset': '0', '--opacity': '1' } },
    { progress: 0.5, expected: { '--y-offset': '-50', '--opacity': '0.5' } },
    { progress: 1, expected: { '--y-offset': '-100', '--opacity': '0' } }
  ]

  cases.forEach(({ progress, expected }) => {
    it(`at ${progress * 100}% scroll`, () => {
      const result = behaviour.compute({ scrollProgress: progress }, {})
      Object.entries(expected).forEach(([key, value]) => {
        expect(result[key]).toBe(value)
      })
    })
  })

  it('clamps values at boundaries', () => {
    const atStart = behaviour.compute({ scrollProgress: -0.1 }, {})
    const atEnd = behaviour.compute({ scrollProgress: 1.1 }, {})
    expect(Number(atStart['--opacity'])).toBeGreaterThanOrEqual(0)
    expect(Number(atEnd['--opacity'])).toBeLessThanOrEqual(1)
  })
})
```

---

## Storybook Stories

Document visual component states. Stories serve as living documentation and visual regression baseline.

```typescript
// content/widgets/content/Text/Text.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Text } from './index'

const meta: Meta<typeof Text> = {
  title: 'Content/Widgets/Text',
  component: Text
}
export default meta

export const Default: StoryObj<typeof Text> = {
  args: { content: 'Default text content' }
}
```

### Animation State Stories

```typescript
// experience/presets/DepthStack/DepthStack.stories.tsx
export const AtStart: Story = {
  decorators: [(Story) => (
    <MockScrollProvider progress={0}><Story /></MockScrollProvider>
  )]
}

export const AtMiddle: Story = {
  decorators: [(Story) => (
    <MockScrollProvider progress={0.5}><Story /></MockScrollProvider>
  )]
}
```

---

## Snapshot Testing

| Use Case | Snapshot? |
|----------|-----------|
| Detect unintended HTML changes | Yes |
| Verify CSS class application | Yes |
| Test dynamic content | No |

```typescript
describe('Widget Snapshots', () => {
  it('matches default state', () => {
    const { container } = render(<Widget />)
    expect(container.firstChild).toMatchSnapshot()
  })
})

describe('CSS Variable Snapshots', () => {
  it('outputs expected variables', () => {
    const result = behaviour.compute({ scrollProgress: 0.5 }, {})
    expect(result).toMatchInlineSnapshot(`
      { "--opacity": "0.5", "--y-offset": "-50" }
    `)
  })
})
```

---

## Test Environment

### Setup File

```typescript
// test/setup.ts
import '@testing-library/jest-dom'

const originalSetProperty = CSSStyleDeclaration.prototype.setProperty
CSSStyleDeclaration.prototype.setProperty = function(prop: string, val: string | null) {
  if (prop.startsWith('--')) this.cssText += `${prop}: ${val};`
  return originalSetProperty.call(this, prop, val)
}
```

### Mock Scroll Provider

```typescript
// test/mocks/MockScrollProvider.tsx
export function MockScrollProvider({ progress, children }: { progress: number; children: ReactNode }) {
  return (
    <ScrollProgressContext.Provider value={{ progress, velocity: 0 }}>
      {children}
    </ScrollProgressContext.Provider>
  )
}
```

---

## Running Tests

```bash
npm test -- visual          # All visual tests
npm run storybook           # Start Storybook
npm run chromatic           # Visual regression (CI)
```

---

## Checklist

| Category | Requirement |
|----------|-------------|
| CSS Variables | Driver sets via `setProperty()`, variables resolve correctly |
| SSR | All variables have fallbacks, components render visible |
| Animation | Test at 0%, 50%, 100% scroll, values stay in range |
| Storybook | Default story exists, edge cases documented |

---

## See Also

- [Testing Strategy](./strategy.spec.md) - Overall testing approach
- [Behaviour Contract](../components/experience/behaviour.spec.md) - Behaviour validation
- [Driver Contract](../components/experience/driver.spec.md) - Driver validation
