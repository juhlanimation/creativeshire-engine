# Section Pattern Spec

> Factory functions that return `SectionSchema` - pre-configured section structures.

## Purpose

Section patterns are factory functions that return `SectionSchema`. They encapsulate common section patterns (Hero, Gallery, CTA) into reusable functions. The renderer expands these into full sections.

**Key distinction:** Patterns return schema data, not React components. The renderer handles JSX generation.

## Section vs Section Pattern

| Aspect | Section | Section Pattern |
|--------|---------|-----------------|
| **What it is** | React component (ONE exists) | Factory function (MANY exist) |
| **Returns** | JSX (renders `<section>`) | `SectionSchema` (data) |
| **Purpose** | Render container + apply layout | Create section pattern |
| **How many** | ONE Section component | MANY pattern factories |
| **File** | `Section.tsx` | `index.ts` (no JSX) |

### The Relationship

```
Section Pattern (factory)             Section (component)
         │                                    │
         │ createHeroSection(props)           │
         ▼                                    │
    SectionSchema ─────────────────────────► Rendered by SectionRenderer
         │                                    │
    {                                         │
      id: 'hero',                             │
      layout: {...},      ──────────────────► <Section layout={...}>
      widgets: [...]      ──────────────────►   <WidgetRenderer ... />
    }                                         </Section>
```

### Catalog Growth

Section patterns emerge from site analysis:

1. `/analyze` identifies a common section pattern (e.g., FAQ accordion)
2. Check: Is this a new layout pattern?
3. Create pattern: `createFAQSection({ items: [...] })`
4. The pattern translates domain props to section + widget tree

**The catalog grows based on real patterns found during analysis.**

## Concepts

| Term | Definition |
|------|------------|
| Section | The React component that renders `<section>` with layout |
| Section Pattern | Factory function returning `SectionSchema` for a pattern |
| SectionSchema | Data structure describing a section with layout and widgets |
| Variant | Pre-configured option set for a pattern |
| Domain Props | Business-level props (headline, items) not schema internals |

## Folder Structure

```
engine/content/sections/patterns/
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
// patterns/{Name}/types.ts
export interface {Name}Props {
  id?: string              // Optional override (defaults provided)
  headline: string
  // Domain-specific props, NOT schema internals
}

// patterns/{Name}/index.ts
import { SectionSchema } from '@/engine/schema'
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
4. Viewport units in style (`100vh`, `100dvh`)
5. Widget internals as props (`type`, `widgets`)
6. Use `children` instead of `widgets` array

## Validation Rules

> Each rule maps 1:1 to `section-pattern.validator.ts`

| # | Rule | Function | Files |
|---|------|----------|-------|
| 1 | Factory function named create{Name}Section | `checkFactoryNaming` | `index.ts` |
| 2 | Return type is SectionSchema | `checkReturnType` | `index.ts` |
| 3 | Props interface exported | `checkPropsExported` | `types.ts` |
| 4 | No React imports | `checkNoReactImports` | `.ts` |
| 5 | No JSX syntax | `checkNoJsx` | `.ts` |
| 6 | No experience imports | `checkNoExperienceImports` | `.ts` |
| 7 | No viewport units in style | `checkNoViewportUnits` | `.ts` |

## Template

```typescript
// Hero/types.ts
export interface HeroProps {
  id?: string
  headline: string
  subheadline?: string
  backgroundColor?: string
  backgroundImage?: string
}
```

```typescript
// Hero/index.ts
import { SectionSchema, WidgetSchema } from '@/engine/schema'
import { HeroProps } from './types'

export function createHeroSection(props: HeroProps): SectionSchema {
  const widgets: WidgetSchema[] = [
    {
      type: 'Text',
      props: { content: props.headline },
      className: 'text-6xl font-bold'
    }
  ]

  if (props.subheadline) {
    widgets.push({
      type: 'Text',
      props: { content: props.subheadline },
      className: 'text-xl'
    })
  }

  return {
    id: props.id ?? 'hero',
    layout: { type: 'stack', align: 'center', gap: 32 },
    style: {
      backgroundColor: props.backgroundColor,
      backgroundImage: props.backgroundImage ? `url(${props.backgroundImage})` : undefined
    },
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
  style: { minHeight: '100vh' },
  widgets: [...]
}
```

**Why:** Viewport sizing is extrinsic. BehaviourWrapper applies `100dvh`.

### Don't: Import from experience layer

```typescript
// WRONG
import { useScrollProgress } from '@/engine/experience/triggers'
```

**Why:** Section patterns are factory functions returning data. Animation belongs in behaviours.

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

## Testing

> **Recommended.** Composites are pure functions — test schema output.

### What to Test

| Test | Required | Why |
|------|----------|-----|
| Returns valid SectionSchema | ✓ | Core contract |
| Has required `id` property | ✓ | Anchor navigation |
| Has `layout` configuration | ✓ | Structural requirement |
| Props map to widget tree | ✓ | Domain translation |

### Test Location

```
engine/content/sections/patterns/{Name}/
├── index.ts
└── index.test.ts    # Co-located test file
```

### Test Template

```typescript
// Hero/index.test.ts
import { describe, it, expect } from 'vitest'
import { createHeroSection } from './index'

describe('createHeroSection', () => {
  describe('schema structure', () => {
    it('returns a SectionSchema with id and layout', () => {
      const schema = createHeroSection({
        headline: 'Welcome'
      })

      expect(schema.id).toBeDefined()
      expect(schema.layout).toBeDefined()
      expect(schema.widgets).toBeDefined()
    })

    it('uses provided id or default', () => {
      const withDefault = createHeroSection({ headline: 'Test' })
      expect(withDefault.id).toBe('hero')

      const withCustom = createHeroSection({ id: 'custom-hero', headline: 'Test' })
      expect(withCustom.id).toBe('custom-hero')
    })
  })

  describe('widget mapping', () => {
    it('creates headline text widget', () => {
      const schema = createHeroSection({ headline: 'Big Title' })

      const textWidget = schema.widgets?.find(w => w.type === 'Text')
      expect(textWidget?.props?.content).toBe('Big Title')
    })

    it('includes subheadline when provided', () => {
      const schema = createHeroSection({
        headline: 'Title',
        subheadline: 'Subtitle text'
      })

      const widgets = JSON.stringify(schema.widgets)
      expect(widgets).toContain('Subtitle text')
    })
  })

  describe('no React dependency', () => {
    it('returns plain object, not JSX', () => {
      const schema = createHeroSection({ headline: 'Test' })

      expect(typeof schema).toBe('object')
      expect(schema.$$typeof).toBeUndefined()
    })
  })
})
```

### Definition of Done

A section pattern is complete when:

- [ ] All tests pass: `npm test -- patterns/{Name}`
- [ ] Returns valid SectionSchema
- [ ] Has id with sensible default
- [ ] No TypeScript errors
- [ ] No React imports

### Running Tests

```bash
# Single pattern
npm test -- sections/patterns/Hero

# All section patterns
npm test -- sections/patterns/
```

---

## Integration

| Interacts With | Direction | How |
|----------------|-----------|-----|
| `schema/section.ts` | Returns | SectionSchema type |
| `renderer/SectionRenderer` | Consumed by | Schema expanded at render |
| `content/widgets/` | References | Widget types in registry |
| `page schemas` | Used in | Compose page structure |

## Validator

Validated by: `./section-pattern.validator.ts`

Rules in "Must/Must Not" map 1:1 to validator checks.

---

## Example: Simplest Site

> Minimal example traced through all domain layers. See other specs for the full flow.

The simplest site needs these section patterns:

### Hero Section Pattern

```typescript
// sections/patterns/Hero/types.ts
export interface HeroProps {
  id?: string
  headline: string
  subheadline?: string
  cta: { label: string; href: string }
}
```

```typescript
// sections/patterns/Hero/index.ts
import { SectionSchema, WidgetSchema } from '@/engine/schema'
import { HeroProps } from './types'

export function createHeroSection(props: HeroProps): SectionSchema {
  const widgets: WidgetSchema[] = [
    {
      type: 'Text',
      props: { content: props.headline, as: 'h1' },
      className: 'text-5xl font-bold'
    }
  ]

  if (props.subheadline) {
    widgets.push({
      type: 'Text',
      props: { content: props.subheadline, as: 'p' },
      className: 'text-xl'
    })
  }

  widgets.push({
    type: 'Button',
    props: { label: props.cta.label, href: props.cta.href }
  })

  return {
    id: props.id ?? 'hero',
    layout: { type: 'stack', align: 'center', gap: 24 },
    behaviour: 'fade-in',
    widgets
  }
}
```

### About Section Pattern

```typescript
// sections/patterns/About/types.ts
export interface AboutProps {
  id?: string
  image: string
  text: string
}
```

```typescript
// sections/patterns/About/index.ts
import { SectionSchema } from '@/engine/schema'
import { AboutProps } from './types'

export function createAboutSection(props: AboutProps): SectionSchema {
  return {
    id: props.id ?? 'about',
    layout: { type: 'flex', gap: 48, align: 'center' },
    behaviour: 'fade-in',
    widgets: [
      {
        type: 'Image',
        props: { src: props.image, alt: 'About us' },
        style: { borderRadius: 8 }
      },
      {
        type: 'Text',
        props: { content: props.text, as: 'p' },
        className: 'text-lg'
      }
    ]
  }
}
```

### Usage in Page

These section patterns are used in the home page (see [Site Spec](../site/site.spec.md)):

```typescript
// site/pages/home.ts
import { createHeroSection } from '@/engine/content/sections/patterns/Hero'
import { createAboutSection } from '@/engine/content/sections/patterns/About'

export const homePage: PageSchema = {
  id: 'home',
  slug: '/',
  sections: [
    createHeroSection({
      headline: 'We craft digital experiences',
      subheadline: 'Strategy, design, and development for ambitious brands.',
      cta: { label: 'Get in touch', href: '/contact' }
    }),
    createAboutSection({
      image: '/images/studio.jpg',
      text: 'We are a small team passionate about creating meaningful digital products.'
    })
  ]
}
```

### Data Flow

```
Domain Props                    SectionSchema                  Rendered
─────────────────────────────────────────────────────────────────────────
{ headline, cta }      →       { id, layout, widgets }    →   <section>
                                                                 <Text />
                                                                 <Button />
                                                               </section>
```
