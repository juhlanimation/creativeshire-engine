# Widget Composite Spec

> Factory functions that return `WidgetSchema`, not React components.

## Purpose

Widget composites assemble pre-configured widget trees from domain-specific props. They return `WidgetSchema` objects that the renderer expands into React components. Composites provide semantic APIs (e.g., `createProjectCard`) while the renderer handles instantiation.

**Key distinction:** Composites return schema data. They never return React elements.

## Concepts

| Term | Definition |
|------|------------|
| Composite | Factory function returning `WidgetSchema` |
| WidgetSchema | Data structure describing a widget tree |
| Domain Props | Business-level props (title, image) not schema internals |
| Factory Pattern | `create{Name}(props)` returns schema, not JSX |

## Folder Structure

```
creativeshire/components/content/widgets/composites/
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
import { WidgetSchema } from '@/creativeshire/schema'
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
5. Viewport units in features
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
| 7 | No viewport units in features | `checkNoViewportUnits` | `.ts` |
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
import { WidgetSchema } from '@/creativeshire/schema'
import { {Name}Props } from './types'

export function create{Name}(props: {Name}Props): WidgetSchema {
  return {
    type: 'Stack',
    features: { spacing: { gap: 16 } },
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
