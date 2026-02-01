# Widget Composite Spec

> Two patterns: Factory functions OR React components with complex state.

## Purpose

Widget composites serve two purposes:

1. **Factory Pattern**: Assemble pre-configured widget trees from domain-specific props. Return `WidgetSchema` objects that the renderer expands.

2. **React Component Pattern**: Components that need complex local state, multiple render modes, or hooks that cannot be expressed as a widget tree.

## Two Patterns

### Pattern 1: Factory Functions (Preferred)

| Aspect | Factory Composite |
|--------|-------------------|
| **What it is** | Factory function |
| **Returns** | `WidgetSchema` (data) |
| **File extension** | `index.ts` (no JSX) |
| **Has CSS** | No CSS files |
| **Registered** | No registration needed |
| **Creates** | Combination of existing widgets |

### Pattern 2: React Component Composites

| Aspect | React Composite |
|--------|-----------------|
| **What it is** | React component |
| **Returns** | JSX (renders DOM) |
| **File extension** | `index.tsx` |
| **Has CSS** | Yes, `styles.css` |
| **Registered** | Yes, in widgetRegistry |
| **Creates** | Complex stateful widget |

**When to use React Component pattern:**
- Multiple render modes with different DOM structures (e.g., Video hover-play vs autoplay)
- Complex local state management (`useState`, `useRef`, `useEffect`)
- Modal/overlay integration with callbacks
- Playback controls with scrubber state

**Examples:**
- `Video` - Hover state, visibility playback, modal integration
- `VideoPlayer` - Playback controls, scrubber, fullscreen logic

### When to Create Which

```
Can it be expressed as a TREE of existing widgets?
        │
        ├─ YES → Factory Composite (Pattern 1)
        │        Domain props → WidgetSchema tree
        │        Example: ProjectCard = Stack + Image + Text
        │
        └─ NO  → Does it need complex state or multiple modes?
                 │
                 ├─ YES → React Component Composite (Pattern 2)
                 │        Example: Video, VideoPlayer
                 │
                 └─ NO  → New Primitive (see widget.spec.md)
                          Needs new DOM element or browser API
```

### Catalog Growth

Widget composites emerge from site analysis:

1. `/analyze` identifies a repeating pattern (e.g., team member cards)
2. Check: Can this be composed from existing widgets?
3. YES → Create composite: `createTeamMember({ name, role, image })`
4. The composite translates domain props to widget tree

**The catalog grows based on real patterns, not pre-defined lists.**

## Concepts

| Term | Definition |
|------|------------|
| Composite | Factory function returning `WidgetSchema` |
| WidgetSchema | Data structure describing a widget tree |
| Domain Props | Business-level props (title, image) not schema internals |
| Factory Pattern | `create{Name}(props)` returns schema, not JSX |

## Folder Structure

```
engine/content/widgets/composites/
├── {CompositeName}/
│   ├── index.ts     # Factory function (named export)
│   └── types.ts     # Props interface (exported)
├── types.ts         # Shared composite types
└── index.ts         # Barrel exports
```

## Interface

```typescript
// composites/types.ts
export interface CompositeProps {
  id?: string
}

// composites/{Name}/types.ts
export interface {Name}Props extends CompositeProps {
  title: string
  image?: string
  // Domain-specific props, NOT widget internals
}

// composites/{Name}/index.ts
import { WidgetSchema } from '@/engine/schema'
import { {Name}Props } from './types'

export function create{Name}(props: {Name}Props): WidgetSchema {
  return {
    type: 'LayoutWidget',
    widgets: [/* nested widgets */]
  }
}
```

## Rules

### Must

1. Function named `create{Name}` (e.g., `createProjectCard`)
2. Return type is `WidgetSchema`
3. Props interface exported from `types.ts`
4. Root widget type is a layout widget (Stack, Flex, Grid)
5. Props are domain-specific (title, image, tags)
6. All `type` values reference existing widgets in registry

### Must Not

1. React imports (`import React` or `from 'react'`)
2. JSX syntax - return schema objects only
3. CSS files - composites produce schema, not styled components
4. Imports from `experience/` - layer violation
5. Viewport units in style
6. Widget internals as props (`type`, `widgets`)

## Validation Rules

> Each rule maps 1:1 to `widget-composite.validator.ts`

| # | Rule | Function | Files |
|---|------|----------|-------|
| 1 | Factory function named create{Name} | `checkFactoryNaming` | `index.ts` |
| 2 | Return type is WidgetSchema | `checkReturnType` | `index.ts` |
| 3 | Props interface exported | `checkPropsExported` | `types.ts` |
| 4 | No React imports | `checkNoReactImports` | `.ts` |
| 5 | No JSX syntax | `checkNoJsx` | `.ts` |
| 6 | No experience imports | `checkNoExperienceImports` | `.ts` |
| 7 | No viewport units in style | `checkNoViewportUnits` | `.ts` |
| 8 | No CSS files | `checkNoCssFiles` | `.css` |

## Template

```typescript
// {Name}/types.ts
export interface {Name}Props {
  title: string
  image: string
  tags?: string[]
}
```

```typescript
// {Name}/index.ts
import { WidgetSchema } from '@/engine/schema'
import { {Name}Props } from './types'

export function create{Name}(props: {Name}Props): WidgetSchema {
  return {
    type: 'Stack',
    style: { gap: 16 },
    widgets: [
      { type: 'Image', props: { src: props.image, alt: props.title } },
      { type: 'Text', props: { content: props.title } },
      {
        type: 'Flex',
        widgets: (props.tags ?? []).map(tag => ({
          type: 'Badge',
          props: { label: tag }
        }))
      }
    ]
  }
}
```

## Anti-Patterns

### Don't: Return JSX

```typescript
// WRONG
export function createProjectCard(props: ProjectCardProps) {
  return (
    <Stack>
      <Image src={props.image} />
    </Stack>
  )
}
```

**Why:** Composites return schema, not elements. The renderer instantiates components.

### Don't: Import React

```typescript
// WRONG
import { ReactNode } from 'react'

export function createProjectCard(props: ProjectCardProps): ReactNode {
  // ...
}
```

**Why:** Composites are pure data functions. No React dependency needed.

### Don't: Accept widget internals as props

```typescript
// WRONG
export interface ProjectCardProps {
  type: string
  widgets: WidgetSchema[]
}
```

**Why:** Props should be domain-specific (`title`, `image`), not schema internals.

### Do: Keep props domain-specific

```typescript
// Correct
export interface ProjectCardProps {
  title: string
  image: string
  tags?: string[]
}
```

**Why:** The composite translates domain concepts into widget schema.

## Testing

> **Recommended.** Composites are pure functions — test schema output.

### What to Test

| Test | Required | Why |
|------|----------|-----|
| Returns valid WidgetSchema | ✓ | Core contract |
| Root type is layout widget | ✓ | Structural requirement |
| Props map to widget props | ✓ | Domain translation |
| Handles optional props | ✓ | Graceful defaults |

### Test Location

```
engine/content/widgets/composites/{Name}/
├── index.ts
└── index.test.ts    # Co-located test file
```

### Test Template

```typescript
// {Name}/index.test.ts
import { describe, it, expect } from 'vitest'
import { create{Name} } from './index'

describe('create{Name}', () => {
  describe('schema structure', () => {
    it('returns a WidgetSchema with layout root', () => {
      const schema = create{Name}({
        title: 'Test Title',
        image: '/test.jpg'
      })

      expect(schema.type).toMatch(/^(Stack|Flex|Grid)$/)
      expect(schema.widgets).toBeDefined()
      expect(Array.isArray(schema.widgets)).toBe(true)
    })

    it('maps domain props to widget props', () => {
      const schema = create{Name}({
        title: 'Project Name',
        image: '/hero.jpg'
      })

      // Find image widget
      const imageWidget = schema.widgets?.find(w => w.type === 'Image')
      expect(imageWidget?.props?.src).toBe('/hero.jpg')

      // Find text widget
      const textWidget = schema.widgets?.find(w => w.type === 'Text')
      expect(textWidget?.props?.content).toBe('Project Name')
    })
  })

  describe('optional props', () => {
    it('handles missing optional props', () => {
      const schema = create{Name}({
        title: 'Minimal',
        image: '/min.jpg'
        // tags omitted
      })

      expect(() => schema).not.toThrow()
      expect(schema.type).toBeDefined()
    })

    it('includes optional widgets when props provided', () => {
      const schema = create{Name}({
        title: 'Full',
        image: '/full.jpg',
        tags: ['react', 'typescript']
      })

      // Verify tags render as Badge widgets
      const flatWidgets = JSON.stringify(schema)
      expect(flatWidgets).toContain('Badge')
    })
  })

  describe('no React dependency', () => {
    it('returns plain object, not JSX', () => {
      const schema = create{Name}({
        title: 'Test',
        image: '/test.jpg'
      })

      expect(typeof schema).toBe('object')
      expect(schema.$$typeof).toBeUndefined() // JSX marker
    })
  })
})
```

### Definition of Done

A widget composite is complete when:

- [ ] All tests pass: `npm test -- composites/{Name}`
- [ ] Returns valid WidgetSchema structure
- [ ] All widget types exist in registry
- [ ] No TypeScript errors
- [ ] No React imports in source

### Running Tests

```bash
# Single composite
npm test -- composites/ProjectCard

# All composites
npm test -- composites/
```

---

## Integration

| Interacts With | Direction | How |
|----------------|-----------|-----|
| `schema/widget.ts` | Returns | WidgetSchema type |
| `renderer/WidgetRenderer` | Consumed by | Schema expanded at render |
| `content/widgets/` | References | Widget types in registry |
| `page schemas` | Used in | Compose page content |

## Validator

Validated by: `./widget-composite.validator.ts`

Rules in "Must/Must Not" map 1:1 to validator checks.
