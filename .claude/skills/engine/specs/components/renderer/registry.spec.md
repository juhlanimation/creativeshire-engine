# Widget Registry Spec

> Central lookup for widget type to component mapping with auto-discovery support.

## Purpose

The widget registry provides a centralized Map that resolves widget type strings (e.g., `'Text'`, `'Image'`) to their React component implementations. Renderers query the registry to instantiate widgets from schema definitions. The registry supports both eager loading (all widgets bundled) and lazy loading (on-demand imports) strategies.

## Concepts

| Term | Definition |
|------|------------|
| Registry | Centralized Map from type string to React component |
| Auto-Discovery | Automatic registration via `import.meta.glob` patterns |
| Eager Loading | All widgets loaded at startup via `{ eager: true }` |
| Lazy Loading | Widgets loaded on first use via dynamic import |
| Type String | Widget identifier in schema (e.g., `'Text'`, `'Image'`) |
| Fallback UI | Rendered when widget type not found in registry |

## Folder Structure

```
engine/content/
├── widgets/
│   ├── content/{WidgetName}/index.tsx   # Auto-discovered
│   ├── layout/{WidgetName}/index.tsx    # Auto-discovered
│   ├── composites/{Name}/index.ts       # NOT registered (factory functions)
│   └── registry.ts                      # Registry implementation
└── registry.ts                          # Re-export (alternative location)
```

## Interface

```typescript
// registry.ts
import type { ComponentType } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Widget props vary by type
type WidgetComponent = ComponentType<any>

/**
 * Central registry mapping widget type strings to React components.
 * Populated via auto-discovery or manual registration.
 */
export const widgetRegistry: Map<string, WidgetComponent>

/**
 * Retrieves a widget component by type string.
 * @param type - Widget type identifier (e.g., 'Text', 'Image')
 * @returns The widget component or undefined if not found
 */
export function getWidget(type: string): WidgetComponent | undefined
```

## Widget Registration

### Auto-Discovery Pattern (Recommended)

Widgets are auto-discovered using Vite's `import.meta.glob`:

```typescript
// engine/content/widgets/registry.ts
import type { ComponentType } from 'react'

type WidgetComponent = ComponentType<any>

// Auto-discover all widget components
const widgetModules = import.meta.glob<{ default: WidgetComponent }>(
  [
    './content/*/index.tsx',
    './layout/*/index.tsx'
  ],
  { eager: true }
)

// Build registry from discovered modules
export const widgetRegistry = new Map<string, WidgetComponent>()

Object.entries(widgetModules).forEach(([path, module]) => {
  // Extract widget name from path: ./content/Text/index.tsx -> Text
  const match = path.match(/\.\/(?:content|layout)\/(\w+)\/index\.tsx$/)
  if (match && module.default) {
    widgetRegistry.set(match[1], module.default)
  }
})

export function getWidget(type: string): WidgetComponent | undefined {
  return widgetRegistry.get(type)
}
```

### Manual Registration Pattern

For explicit control over registered widgets:

```typescript
// engine/content/widgets/registry.ts
import type { ComponentType } from 'react'
import Text from './content/Text'
import Image from './content/Image'
import Stack from './layout/Stack'
import Flex from './layout/Flex'

type WidgetComponent = ComponentType<any>

export const widgetRegistry = new Map<string, WidgetComponent>([
  ['Text', Text],
  ['Image', Image],
  ['Stack', Stack],
  ['Flex', Flex],
])

export function getWidget(type: string): WidgetComponent | undefined {
  return widgetRegistry.get(type)
}
```

## Lookup Pattern

Renderers use the registry to resolve widget types:

```typescript
// renderer/WidgetRenderer.tsx
import { widgetRegistry } from '@/engine/content/widgets/registry'

export function WidgetRenderer({ widget }: WidgetRendererProps) {
  const Component = widgetRegistry.get(widget.type)

  if (!Component) {
    return <WidgetNotFound type={widget.type} />
  }

  return (
    <ErrorBoundary fallback={<WidgetCrashed type={widget.type} />}>
      <Component {...widget.props}>
        {widget.widgets?.map((child, i) => (
          <WidgetRenderer key={child.id ?? i} widget={child} />
        ))}
      </Component>
    </ErrorBoundary>
  )
}
```

## Error Handling

### Widget Not Found

When a widget type is not in the registry, render fallback UI:

```typescript
// renderer/WidgetNotFound.tsx
interface WidgetNotFoundProps {
  type: string
}

export function WidgetNotFound({ type }: WidgetNotFoundProps) {
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="widget-not-found">
        <strong>Unknown widget type:</strong> {type}
        <p>Available types: {Array.from(widgetRegistry.keys()).join(', ')}</p>
      </div>
    )
  }

  // Production: silent fail or minimal placeholder
  return null
}
```

### Error Boundary Isolation

Wrap each widget in ErrorBoundary to prevent cascade failures:

```typescript
// renderer/ErrorBoundary.tsx
export function WidgetCrashed({ type }: { type: string }) {
  return (
    <div className="widget-crashed">
      Widget failed to render: {type}
    </div>
  )
}
```

## Extending the Registry

### Adding Custom Widgets

Drop a widget folder in the correct category. Auto-discovery finds it:

```
engine/content/widgets/primitives/CustomWidget/
├── index.tsx    # Default export = auto-registered
└── types.ts     # Props interface
```

### Third-Party Widget Integration

Register external widgets manually:

```typescript
// app/registry-extensions.ts
import { widgetRegistry } from '@/engine/content/widgets/registry'
import { VideoPlayer } from '@third-party/video-player'
import { Chart } from '@third-party/charts'

// Extend registry with third-party widgets
widgetRegistry.set('VideoPlayer', VideoPlayer)
widgetRegistry.set('Chart', Chart)
```

**Important:** Call extension registration before first render (e.g., in app entry or layout).

### Site-Specific Overrides

Override built-in widgets with custom implementations:

```typescript
// sites/acme/registry-overrides.ts
import { widgetRegistry } from '@/engine/content/widgets/registry'
import CustomButton from './components/CustomButton'

// Override default Button with site-specific version
widgetRegistry.set('Button', CustomButton)
```

## Composite Type Resolution

Widget composites (factory functions) are NOT registered. They return `WidgetSchema` that references registered types:

```typescript
// Composite returns schema referencing registered types
export function createProjectCard(props: ProjectCardProps): WidgetSchema {
  return {
    type: 'Stack',              // Must exist in widgetRegistry
    widgets: [
      { type: 'Image', ... },   // Must exist in widgetRegistry
      { type: 'Text', ... },    // Must exist in widgetRegistry
      { type: 'Badge', ... }    // Must exist in widgetRegistry
    ]
  }
}
```

The renderer expands composite output recursively, looking up each `type` in the registry.

### Validating Composite References

Ensure all widget types referenced in composites exist:

```typescript
// build-time validation or test
function validateComposite(schema: WidgetSchema): string[] {
  const missing: string[] = []

  if (!widgetRegistry.has(schema.type)) {
    missing.push(schema.type)
  }

  schema.widgets?.forEach(child => {
    missing.push(...validateComposite(child))
  })

  return missing
}
```

## Bundle Implications

### Eager Loading (Default)

All widgets bundled together. Best for:
- Small widget count (<20)
- Pages using most widgets
- Simpler deployment

```typescript
// Eager: loaded immediately
const widgetModules = import.meta.glob('./*/index.tsx', { eager: true })
```

**Bundle impact:** All widget code included in main bundle.

### Lazy Loading

Widgets loaded on first use. Best for:
- Large widget libraries
- Pages using few widgets
- Code splitting requirements

```typescript
// Lazy: loaded on demand
const widgetModules = import.meta.glob('./*/index.tsx')

export async function getWidgetAsync(type: string): Promise<WidgetComponent | undefined> {
  const path = `./content/${type}/index.tsx`
  const loader = widgetModules[path]

  if (!loader) return undefined

  const module = await loader()
  return module.default
}
```

**Note:** Lazy loading requires async rendering patterns (Suspense boundaries).

### Hybrid Approach

Eager-load common widgets, lazy-load heavy/rare ones:

```typescript
// Core widgets: eager
import Text from './content/Text'
import Image from './content/Image'
import Stack from './layout/Stack'

// Heavy widgets: lazy
const heavyWidgets = import.meta.glob('./content/{Video,Embed,Chart}/index.tsx')

export const widgetRegistry = new Map<string, WidgetComponent>([
  ['Text', Text],
  ['Image', Image],
  ['Stack', Stack],
])

export async function getWidgetAsync(type: string): Promise<WidgetComponent | undefined> {
  // Check eager registry first
  if (widgetRegistry.has(type)) {
    return widgetRegistry.get(type)
  }

  // Fall back to lazy loading
  const loader = heavyWidgets[`./content/${type}/index.tsx`]
  if (loader) {
    const module = await loader()
    widgetRegistry.set(type, module.default) // Cache for subsequent calls
    return module.default
  }

  return undefined
}
```

## Rules

### Must

1. Use `Map<string, ComponentType>` for O(1) lookup
2. Export `getWidget(type)` helper function
3. Auto-discover from `content/` and `layout/` folders
4. Handle unknown types gracefully (fallback UI)
5. Extract widget name from folder name (not filename)
6. Register only default exports from `index.tsx`

### Must Not

1. Register composite factories (they return schema, not components)
2. Register CSS files or types-only modules
3. Throw errors for unknown widget types (render fallback instead)
4. Import from `experience/` (registry is Content Layer)
5. Include path or folder structure in type names
6. Mutate registry after initial hydration in production

## Validation Rules

> Each rule maps 1:1 to `registry.validator.ts`

| # | Rule | Function | Files |
|---|------|----------|-------|
| 1 | Uses Map type | `checkUsesMap` | `registry.ts` |
| 2 | Exports getWidget helper | `checkExportsGetWidget` | `registry.ts` |
| 3 | Only registers .tsx files | `checkOnlyTsx` | `registry.ts` |
| 4 | No composite registration | `checkNoComposites` | `registry.ts` |
| 5 | No experience imports | `checkNoExperienceImports` | `registry.ts` |

## Template

```typescript
// engine/content/widgets/registry.ts
import type { ComponentType } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WidgetComponent = ComponentType<any>

// Auto-discover widgets from content/ and layout/ folders
const widgetModules = import.meta.glob<{ default: WidgetComponent }>(
  ['./content/*/index.tsx', './layout/*/index.tsx'],
  { eager: true }
)

// Build registry
export const widgetRegistry = new Map<string, WidgetComponent>()

Object.entries(widgetModules).forEach(([path, module]) => {
  const match = path.match(/\.\/(?:content|layout)\/(\w+)\/index\.tsx$/)
  if (match?.[1] && module.default) {
    widgetRegistry.set(match[1], module.default)
  }
})

/**
 * Get widget component by type string.
 */
export function getWidget(type: string): WidgetComponent | undefined {
  return widgetRegistry.get(type)
}

/**
 * Check if widget type is registered.
 */
export function hasWidget(type: string): boolean {
  return widgetRegistry.has(type)
}

/**
 * Get all registered widget types.
 */
export function getRegisteredTypes(): string[] {
  return Array.from(widgetRegistry.keys())
}
```

## Testing

> **Unit tests recommended.** Registry is pure lookup logic.

### What to Test

| Test | Method | Why |
|------|--------|-----|
| Auto-discovery | Unit test | Verify glob patterns work |
| Lookup returns component | Unit test | Core functionality |
| Unknown type returns undefined | Unit test | Error handling |
| Type extraction from path | Unit test | Pattern matching |

### Test Location

```
engine/content/widgets/
├── registry.ts
└── registry.test.ts    # Co-located test file
```

### Test Template

```typescript
// registry.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { widgetRegistry, getWidget, hasWidget, getRegisteredTypes } from './registry'

describe('widgetRegistry', () => {
  describe('getWidget', () => {
    it('returns component for registered type', () => {
      const TextComponent = getWidget('Text')
      expect(TextComponent).toBeDefined()
      expect(typeof TextComponent).toBe('function')
    })

    it('returns undefined for unknown type', () => {
      const result = getWidget('NonExistentWidget')
      expect(result).toBeUndefined()
    })
  })

  describe('hasWidget', () => {
    it('returns true for registered types', () => {
      expect(hasWidget('Text')).toBe(true)
    })

    it('returns false for unknown types', () => {
      expect(hasWidget('Unknown')).toBe(false)
    })
  })

  describe('getRegisteredTypes', () => {
    it('returns array of registered type strings', () => {
      const types = getRegisteredTypes()
      expect(Array.isArray(types)).toBe(true)
      expect(types.length).toBeGreaterThan(0)
    })

    it('includes expected widget types', () => {
      const types = getRegisteredTypes()
      expect(types).toContain('Text')
    })
  })

  describe('auto-discovery', () => {
    it('extracts widget name from path correctly', () => {
      // Verify naming convention: folder name = type name
      const types = getRegisteredTypes()
      types.forEach(type => {
        expect(type).toMatch(/^[A-Z][a-zA-Z]+$/) // PascalCase
      })
    })

    it('does not register composite factories', () => {
      // Composites are in composites/ folder, not content/ or layout/
      const types = getRegisteredTypes()
      expect(types).not.toContain('createProjectCard')
    })
  })
})
```

### Mock Registry for Renderer Tests

```typescript
// renderer/WidgetRenderer.test.tsx
vi.mock('@/engine/content/widgets/registry', () => ({
  widgetRegistry: new Map([
    ['Text', ({ content }: { content: string }) => <p>{content}</p>],
    ['Stack', ({ children }: { children: React.ReactNode }) => <div>{children}</div>],
  ]),
  getWidget: (type: string) => {
    const map = new Map([
      ['Text', ({ content }: { content: string }) => <p>{content}</p>],
    ])
    return map.get(type)
  }
}))
```

### Definition of Done

A registry implementation is complete when:

- [ ] All tests pass: `npm test -- registry`
- [ ] Auto-discovery works for content/ and layout/ widgets
- [ ] Unknown types return undefined (no throws)
- [ ] No TypeScript errors
- [ ] Validator passes

### Running Tests

```bash
npm test -- content/widgets/registry
```

---

## Integration

| Interacts With | Direction | How |
|----------------|-----------|-----|
| `renderer/WidgetRenderer` | Exports to | Provides component lookup |
| `content/widgets/primitives/*` | Imports from | Auto-discovers components |
| `content/widgets/layout/*` | Imports from | Auto-discovers components |
| `schema/widget.ts` | References | Type strings from schema |

## Validator

Validated by: `./registry.validator.ts`

Rules in "Must/Must Not" map 1:1 to validator checks.

---

## Related Documents

- Widget Spec: [Widget Spec](../content/widget.spec.md)
- Widget Composite Spec: [Widget Composite Spec](../content/widget-composite.spec.md)
- Renderer Spec: [Renderer Spec](./renderer.spec.md)
- Content Layer: [Content Layer](../../layers/content.spec.md)
