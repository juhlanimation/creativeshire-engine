# Section Composite Spec

> Factory functions that return `SectionSchema` - pre-configured section structures.

## Purpose

Section composites are factory functions that return `SectionSchema`. They encapsulate common section patterns (Hero, Gallery, CTA) into reusable functions. The renderer expands these into full sections.

**Key distinction:** Composites return schema data, not React components. The renderer handles JSX generation.

## Concepts

| Term | Definition |
|------|------------|
| Composite | Factory function returning `SectionSchema` |
| SectionSchema | Data structure describing a section with layout and widgets |
| Variant | Pre-configured option set for a composite |
| Domain Props | Business-level props (headline, items) not schema internals |

## Folder Structure

```
creativeshire/components/content/sections/composites/
├── Hero/
│   ├── index.ts         # Factory function (named export)
│   ├── types.ts         # Props interface (exported)
│   └── variants.ts      # Optional variant configs
├── Gallery/
├── Showreel/
├── CTA/
├── Features/
├── FAQ/
├── Testimonials/
├── Contact/
└── index.ts             # Barrel exports
```

## Interface

```typescript
// composites/{Name}/types.ts
export interface {Name}Props {
  id?: string              // Optional override (defaults provided)
  headline: string
  // Domain-specific props, NOT schema internals
}

// composites/{Name}/index.ts
import { SectionSchema } from '@/creativeshire/schema'
import { {Name}Props } from './types'

export function create{Name}Section(props: {Name}Props): SectionSchema {
  return {
    id: props.id ?? 'default-id',
    layout: { type: 'stack', align: 'center' },
    widgets: [/* widget schemas */]
  }
}
```

## Rules

### Must

1. Function named `create{Name}Section` (e.g., `createHeroSection`)
2. Return type is `SectionSchema`
3. Props interface exported from `types.ts`
4. Provide default ID via `props.id ?? 'sensible-default'`
5. Configure layout (type, align, gap, etc.)
6. Build widgets array using `WidgetSchema` objects

### Must Not

1. React imports (`import React` or `from 'react'`)
2. JSX syntax - return schema objects only
3. Imports from `experience/` - layer violation
4. Viewport units in features (`100vh`, `100dvh`)
5. Widget internals as props (`type`, `widgets`)
6. Use `children` instead of `widgets` array

## Validation Rules

> Each rule maps 1:1 to `section-composite.validator.ts`

| # | Rule | Function | Files |
|---|------|----------|-------|
| 1 | Factory function named create{Name}Section | `checkFactoryNaming` | `index.ts` |
| 2 | Return type is SectionSchema | `checkReturnType` | `index.ts` |
| 3 | Props interface exported | `checkPropsExported` | `types.ts` |
| 4 | No React imports | `checkNoReactImports` | `.ts` |
| 5 | No JSX syntax | `checkNoJsx` | `.ts` |
| 6 | No experience imports | `checkNoExperienceImports` | `.ts` |
| 7 | No viewport units in features | `checkNoViewportUnits` | `.ts` |

## Template

```typescript
// Hero/types.ts
export interface HeroProps {
  id?: string
  headline: string
  subheadline?: string
  background?: { color?: string; image?: string }
}
```

```typescript
// Hero/index.ts
import { SectionSchema, WidgetSchema } from '@/creativeshire/schema'
import { HeroProps } from './types'

export function createHeroSection(props: HeroProps): SectionSchema {
  const widgets: WidgetSchema[] = [
    {
      type: 'Text',
      props: { content: props.headline },
      features: { typography: { size: '6xl', weight: 'bold' } }
    }
  ]

  if (props.subheadline) {
    widgets.push({
      type: 'Text',
      props: { content: props.subheadline },
      features: { typography: { size: 'xl' } }
    })
  }

  return {
    id: props.id ?? 'hero',
    layout: { type: 'stack', align: 'center', gap: 32 },
    features: { background: props.background },
    widgets
  }
}
```

## Anti-Patterns

### Don't: Return JSX

```typescript
// WRONG
export function HeroSection({ headline }: HeroProps) {
  return (
    <section>
      <h1>{headline}</h1>
    </section>
  )
}
```

**Why:** Composites return data. The renderer converts schema to JSX.

### Don't: Use viewport units

```typescript
// WRONG
return {
  id: 'hero',
  features: { minHeight: '100vh' },
  widgets: [...]
}
```

**Why:** Viewport sizing is extrinsic. BehaviourWrapper applies `100dvh`.

### Don't: Import from experience layer

```typescript
// WRONG
import { useScrollProgress } from '@/creativeshire/experience/triggers'
```

**Why:** Section composites are factory functions returning data. Animation belongs in behaviours.

### Don't: Use children instead of widgets

```typescript
// WRONG
return {
  id: 'hero',
  children: props.children
}

// CORRECT
return {
  id: 'hero',
  widgets: [...]
}
```

**Why:** Sections use `widgets` array. Schema is data, not JSX with children.

### Do: Provide default IDs

```typescript
// Correct
return {
  id: props.id ?? 'gallery',
  layout: { type: 'grid', columns: 3 },
  widgets: [...]
}
```

**Why:** Default IDs ensure anchor navigation works without explicit configuration.

## Integration

| Interacts With | Direction | How |
|----------------|-----------|-----|
| `schema/section.ts` | Returns | SectionSchema type |
| `renderer/SectionRenderer` | Consumed by | Schema expanded at render |
| `content/widgets/` | References | Widget types in registry |
| `page schemas` | Used in | Compose page structure |

## Validator

Validated by: `./section-composite.validator.ts`

Rules in "Must/Must Not" map 1:1 to validator checks.
