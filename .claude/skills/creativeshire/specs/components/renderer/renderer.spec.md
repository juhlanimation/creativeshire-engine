# Renderer Spec

> Schema-to-component bridges that transform declarative schema into rendered React components.

## Purpose

Renderers interpret schema data and produce React components. They resolve behaviours from mode defaults, apply features, wrap content with BehaviourWrapper, and handle errors gracefully. Renderers translate declarative intent into rendered UI without containing animation logic.

## Concepts

| Term | Definition |
|------|------------|
| Renderer | Component that transforms schema objects into React components |
| Registry Lookup | Resolving component types from centralized registries |
| Behaviour Resolution | Determining which behaviour to apply via cascade: explicit → mode defaults → none |
| BehaviourWrapper | Component that wraps content to enable behaviour application |
| ErrorBoundary | Component that isolates crashes to prevent propagation |
| Ref Forwarding | Passing refs through renderer chain for driver registration |

## Folder Structure

```
creativeshire/renderer/
├── SiteRenderer.tsx        # Site → Chrome + Pages
├── PageRenderer.tsx        # Page → Sections
├── SectionRenderer.tsx     # Section → Widgets
├── WidgetRenderer.tsx      # Widget → Component (recursive)
├── ChromeRenderer.tsx      # Chrome → Regions + Overlays
├── ErrorBoundary.tsx       # Error isolation component
└── types.ts                # Shared renderer types
```

## Interface

```typescript
// renderer/types.ts
export interface SiteRendererProps {
  site: SiteSchema
  page: PageSchema
}

export interface PageRendererProps {
  page: PageSchema
}

export interface SectionRendererProps {
  section: SectionSchema
  index: number
}

export interface WidgetRendererProps {
  widget: WidgetSchema
}

export interface ChromeRendererProps {
  siteChrome: ChromeSchema
  pageChrome?: PageChromeOverrides | 'inherit'
  position: 'header' | 'footer' | 'overlays'
}

export interface ErrorBoundaryProps {
  fallback: React.ReactNode
  children: React.ReactNode
}
```

## Rules

### Must

1. Use registry lookup for component resolution (no hardcoded imports)
2. Wrap rendered components with ErrorBoundary
3. Provide fallback UI for unknown schema types
4. Call `resolveBehaviour()` for behaviour resolution (no inline logic)
5. Wrap with BehaviourWrapper only when behaviour resolved
6. Apply features via `useFeatures()` hook
7. Support recursive rendering (WidgetRenderer renders nested widgets)
8. Pass `sectionIndex` to SectionRenderer BehaviourWrapper

### Must Not

1. Compute animation values (belongs in behaviours/drivers)
2. Manipulate CSS variables directly (BehaviourWrapper handles this)
3. Skip ErrorBoundary wrapping (isolates crashes)
4. Duplicate resolution logic (call `resolveBehaviour`)
5. Hardcode component imports (use registry)
6. Render without checking registry (handle unknown types)
7. Break ref forwarding chain (needed for driver registration)

## Validation Rules

> Each rule maps 1:1 to `renderer.validator.ts`

| # | Rule | Function | Files |
|---|------|----------|-------|
| 1 | Uses registry lookup | `checkUsesRegistry` | `.tsx` |
| 2 | Has ErrorBoundary wrapping | `checkHasErrorBoundary` | `.tsx` |
| 3 | Has fallback for unknown types | `checkHasFallback` | `.tsx` |
| 4 | Calls resolveBehaviour | `checkCallsResolveBehaviour` | `.tsx` |
| 5 | No inline animation logic | `checkNoInlineAnimation` | `.tsx` |
| 6 | No CSS variable manipulation | `checkNoCssVarManipulation` | `.tsx` |
| 7 | Uses useFeatures hook | `checkUsesFeatures` | `.tsx` |

## Behaviour Resolution

Renderers use a three-step cascade to determine which behaviour to apply:

```
Schema defines behaviour?
        │
        ▼
Has explicit 'none'?
    │
    ├── YES → No wrapper
    │
    └── NO → Has explicit behaviour?
              │
              ├── YES → Use that behaviour
              │
              └── NO → Check mode.defaults[type]
                        │
                        ├── Has default → Use default
                        │
                        └── No default → No wrapper
```

| Schema Value | Behaviour Used |
|--------------|----------------|
| `'none'` | No BehaviourWrapper |
| `'depth-layer'` | Use `depth-layer` behaviour |
| `{ id: 'depth-layer', options: {...} }` | Use with options |
| `undefined` | Check mode defaults |

Renderers call `resolveBehaviour()` and do not implement resolution logic.

## Template

```typescript
// SectionRenderer.tsx
import { resolveBehaviour } from '@/creativeshire/experience/behaviours/resolve'
import { useExperience } from '@/creativeshire/experience/ExperienceProvider'
import { useFeatures } from '@/creativeshire/experience/features'
import { BehaviourWrapper } from '@/creativeshire/experience/BehaviourWrapper'
import { WidgetRenderer } from './WidgetRenderer'
import { SectionRendererProps } from './types'

export function SectionRenderer({ section, index }: SectionRendererProps) {
  const { mode } = useExperience()
  const resolved = resolveBehaviour(section, 'section', mode)
  const featureStyle = useFeatures(section.features)

  const content = (
    <section
      id={section.id}
      style={featureStyle}
      data-section-index={index}
    >
      {section.widgets.map((widget, i) => (
        <WidgetRenderer key={widget.id ?? i} widget={widget} />
      ))}
    </section>
  )

  if (!resolved) return content

  return (
    <BehaviourWrapper
      behaviour={resolved.behaviour}
      options={{ ...resolved.options, sectionIndex: index }}
    >
      {content}
    </BehaviourWrapper>
  )
}
```

```typescript
// WidgetRenderer.tsx
import { widgetRegistry } from '@/content/registry'
import { resolveBehaviour } from '@/creativeshire/experience/behaviours/resolve'
import { useExperience } from '@/creativeshire/experience/ExperienceProvider'
import { useFeatures } from '@/creativeshire/experience/features'
import { BehaviourWrapper } from '@/creativeshire/experience/BehaviourWrapper'
import { ErrorBoundary } from './ErrorBoundary'
import { WidgetRendererProps } from './types'

export function WidgetRenderer({ widget }: WidgetRendererProps) {
  const { mode } = useExperience()
  const resolved = resolveBehaviour(widget, widget.type, mode)
  const featureStyle = useFeatures(widget.features)

  const Component = widgetRegistry.get(widget.type)

  if (!Component) {
    return <div className="widget-error">Unknown widget: {widget.type}</div>
  }

  const content = (
    <ErrorBoundary fallback={<div className="widget-crash">Widget failed</div>}>
      <div style={featureStyle} data-widget-type={widget.type}>
        <Component {...widget.props}>
          {widget.widgets?.map((child, i) => (
            <WidgetRenderer key={child.id ?? i} widget={child} />
          ))}
        </Component>
      </div>
    </ErrorBoundary>
  )

  if (!resolved) return content

  return (
    <BehaviourWrapper behaviour={resolved.behaviour} options={resolved.options}>
      {content}
    </BehaviourWrapper>
  )
}
```

## Anti-Patterns

| Anti-Pattern | Problem | Correct Approach |
|--------------|---------|------------------|
| Animation logic in renderer | Renderers should be pure | Use `BehaviourWrapper` for animation |
| Skip ErrorBoundary wrapping | One widget crash takes down page | Wrap each component in ErrorBoundary |
| Hardcode component imports | Prevents extensibility | Use registry lookup pattern |

## Composite Expansion

**Key concept:** Composites expand at definition time (module import), not render time.

```
Definition Time                   Render Time
───────────────                   ───────────
createGallerySection({...}) →     Renderer receives plain
  returns SectionSchema           WidgetSchema[] objects
```

**Renderers never see composite functions.** By the time a page definition is imported, all nested composites have already executed and returned plain data:

```typescript
// ✅ What renderer receives (already expanded)
section.widgets = [
  { type: 'Card', props: {...}, widgets: [...] },
  { type: 'Card', props: {...}, widgets: [...] }
]
```

**Type validation:** Check registry before rendering unknown types:

```typescript
const Component = widgetRegistry.get(widget.type)
if (!Component) {
  return <div className="widget-error">Unknown: {widget.type}</div>
}
```

Nesting depth is unlimited. Each composite executes synchronously and returns plain schema data. See [Widget Composite Spec](../content/widget-composite.spec.md) for composite implementation details.

## Testing

> **Browser-based + unit.** Test resolution logic; validate rendering visually.

### What to Test

| Test | Method | Why |
|------|--------|-----|
| Behaviour resolution | Unit test | Pure function logic |
| Registry lookup | Unit test | Component mapping |
| ErrorBoundary catches | Unit test | Error isolation |
| Nested rendering | Browser | Visual structure |

### Test Location

```
creativeshire/renderer/
├── SectionRenderer.tsx
├── WidgetRenderer.tsx
├── resolveBehaviour.ts
├── resolveBehaviour.test.ts    # Resolution logic
└── WidgetRenderer.test.tsx     # Component tests
```

### Test Template (Behaviour Resolution)

```typescript
// resolveBehaviour.test.ts
import { describe, it, expect } from 'vitest'
import { resolveBehaviour } from './resolveBehaviour'

describe('resolveBehaviour', () => {
  const mockMode = {
    defaults: { section: 'scroll-stack', Image: 'depth-layer' }
  }

  it('returns null for explicit none', () => {
    const result = resolveBehaviour({ behaviour: 'none' }, 'section', mockMode)
    expect(result).toBeNull()
  })

  it('uses explicit behaviour', () => {
    const result = resolveBehaviour(
      { behaviour: 'fade-on-scroll' },
      'section',
      mockMode
    )
    expect(result?.behaviour).toBe('fade-on-scroll')
  })

  it('falls back to mode default for section', () => {
    const result = resolveBehaviour({}, 'section', mockMode)
    expect(result?.behaviour).toBe('scroll-stack')
  })

  it('uses widget type default', () => {
    const result = resolveBehaviour({}, 'Image', mockMode)
    expect(result?.behaviour).toBe('depth-layer')
  })

  it('returns null when no default exists', () => {
    const result = resolveBehaviour({}, 'UnknownType', mockMode)
    expect(result).toBeNull()
  })
})
```

### Test Template (WidgetRenderer)

```typescript
// WidgetRenderer.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WidgetRenderer } from './WidgetRenderer'

// Mock registry
vi.mock('@/content/registry', () => ({
  widgetRegistry: new Map([
    ['Text', ({ content }) => <p>{content}</p>]
  ])
}))

describe('WidgetRenderer', () => {
  it('renders known widget type', () => {
    render(
      <WidgetRenderer widget={{ type: 'Text', props: { content: 'Hello' } }} />
    )
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('shows error for unknown type', () => {
    render(
      <WidgetRenderer widget={{ type: 'Unknown' }} />
    )
    expect(screen.getByText(/Unknown widget/)).toBeInTheDocument()
  })
})
```

### Definition of Done

A renderer is complete when:

- [ ] Resolution tests pass
- [ ] ErrorBoundary wrapping verified
- [ ] Unknown type fallback works
- [ ] No TypeScript errors

### Running Tests

```bash
npm test -- renderer/
```

---

## Integration

| Interacts With | Direction | How |
|----------------|-----------|-----|
| `schema/*` | Imports | Type definitions for schema objects |
| `experience/behaviours` | Calls | `resolveBehaviour()` for behaviour cascade |
| `experience/ExperienceProvider` | Reads | `useExperience()` for mode access |
| `experience/features` | Calls | `useFeatures()` for feature styles |
| `experience/BehaviourWrapper` | Renders | Wraps content when behaviour resolved |
| `content/registry` | Reads | Component lookup for widget types |

## Validator

Validated by: `./renderer.validator.ts`

Rules in "Must/Must Not" map 1:1 to validator checks.
