# Section Composite Spec

> Factory functions that return `SectionSchema` - pre-configured section structures.

## Purpose

Section composites are factory functions that return `SectionSchema`. They encapsulate common section patterns (Hero, Gallery, CTA) into reusable functions. The renderer expands these into full sections.

**Key distinction:** Composites return schema data, not React components. The renderer handles JSX generation.

## Section vs Section Composite

| Aspect | Section | Section Composite |
|--------|---------|-------------------|
| **What it is** | React component (ONE exists) | Factory function (MANY exist) |
| **Returns** | JSX (renders `<section>`) | `SectionSchema` (data) |
| **Purpose** | Render container + apply layout | Create section pattern |
| **How many** | ONE Section component | MANY composite factories |
| **File** | `Section.tsx` | `index.ts` (no JSX) |

### The Relationship

```
Section Composite (factory)           Section (component)
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

Section composites emerge from site analysis:

1. `/analyze` identifies a common section pattern (e.g., FAQ accordion)
2. Check: Is this a new layout pattern?
3. Create composite: `createFAQSection({ items: [...] })`
4. The composite translates domain props to section + widget tree

**The catalog grows based on real patterns found during analysis.**

## Concepts

| Term | Definition |
|------|------------|
| Section | The React component that renders `<section>` with layout |
| Section Composite | Factory function returning `SectionSchema` for a pattern |
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
creativeshire/components/content/sections/composites/{Name}/
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

A section composite is complete when:

- [ ] All tests pass: `npm test -- composites/{Name}`
- [ ] Returns valid SectionSchema
- [ ] Has id with sensible default
- [ ] No TypeScript errors
- [ ] No React imports

### Running Tests

```bash
# Single composite
npm test -- sections/composites/Hero

# All section composites
npm test -- sections/composites/
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

Validated by: `./section-composite.validator.ts`

Rules in "Must/Must Not" map 1:1 to validator checks.

---

## Example: Simplest Site

> Minimal example traced through all domain layers. See other specs for the full flow.

The simplest site needs these section composites:

### Hero Section Composite

```typescript
// sections/composites/Hero/types.ts
export interface HeroProps {
  id?: string
  headline: string
  subheadline?: string
  cta: { label: string; href: string }
}
```

```typescript
// sections/composites/Hero/index.ts
import { SectionSchema, WidgetSchema } from '@/creativeshire/schema'
import { HeroProps } from './types'

export function createHeroSection(props: HeroProps): SectionSchema {
  const widgets: WidgetSchema[] = [
    {
      type: 'Text',
      props: { content: props.headline, as: 'h1' },
      features: { typography: { size: '5xl', weight: 'bold' } }
    }
  ]

  if (props.subheadline) {
    widgets.push({
      type: 'Text',
      props: { content: props.subheadline, as: 'p' },
      features: { typography: { size: 'xl' } }
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

### About Section Composite

```typescript
// sections/composites/About/types.ts
export interface AboutProps {
  id?: string
  image: string
  text: string
}
```

```typescript
// sections/composites/About/index.ts
import { SectionSchema } from '@/creativeshire/schema'
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
        features: { border: { radius: 8 } }
      },
      {
        type: 'Text',
        props: { content: props.text, as: 'p' },
        features: { typography: { size: 'lg' } }
      }
    ]
  }
}
```

### Usage in Page

These section composites are used in the home page (see [Site Spec](../site/site.spec.md)):

```typescript
// site/pages/home.ts
import { createHeroSection } from '@/creativeshire/content/sections/composites/Hero'
import { createAboutSection } from '@/creativeshire/content/sections/composites/About'

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
