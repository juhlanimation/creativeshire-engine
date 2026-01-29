# Schema Spec

> TypeScript type definitions describing data structures for sites, pages, sections, widgets, chrome, and experiences.

## Purpose

Schema defines type-only interfaces for the entire Creativeshire system. Schemas describe data shape and behavior intent without implementation. They serve as contracts between layers, ensuring type safety across content, experience, and renderer domains.

## Concepts

| Term | Definition |
|------|------------|
| Schema | Pure TypeScript interface defining structure |
| Type-only | No runtime code, functions, or side effects |
| Contract | Agreement between layers on data shape |
| Layer separation | Schema has no knowledge of implementation |

## Folder Structure

```
creativeshire/schema/
├── index.ts              # Barrel export
├── site.ts               # SiteSchema, ExperienceConfig, PageReference
├── page.ts               # PageSchema, PageChromeOverrides
├── section.ts            # SectionSchema, LayoutConfig
├── widget.ts             # WidgetSchema
├── chrome.ts             # ChromeSchema, RegionSchema, OverlaySchema
└── experience.ts         # BehaviourConfig, CSSVariables, OptionConfig
```

## Interface

```typescript
// schema/widget.ts
export interface WidgetSchema {
  id?: string
  type: string
  props?: Record<string, any>
  style?: CSSProperties         // Inline styles
  className?: string            // Tailwind/CSS classes
  behaviour?: string | BehaviourConfig
  widgets?: WidgetSchema[]
}

// schema/index.ts
export type { WidgetSchema } from './widget'
export type { SiteSchema } from './site'
// ... all schema exports
```

## Rules

### Must

1. Export only types and interfaces
2. Use TypeScript strict mode
3. Mark optional properties with `?`
4. Use discriminated unions where appropriate
5. CSS variable types use template literal `--${string}`
6. Export all types from barrel `index.ts`
7. Pass `tsc --noEmit` without errors

### Must Not

1. Export functions, classes, or const values
2. Import runtime modules (React, Zustand, GSAP)
3. Include implementation logic
4. Create circular dependencies between schema files
5. Use runtime side effects (console.log, etc.)
6. Define default values or constants
7. Include computed properties

## Validation Rules

> Each rule maps 1:1 to `schema.validator.ts`

| # | Rule | Function | Files |
|---|------|----------|-------|
| 1 | Type-only exports | `checkTypeOnlyExports` | `.ts` |
| 2 | No runtime imports | `checkNoRuntimeImports` | `.ts` |
| 3 | No function implementations | `checkNoFunctionImpl` | `.ts` |
| 4 | No const exports | `checkNoConstExports` | `.ts` |
| 5 | No class definitions | `checkNoClassDefinitions` | `.ts` |
| 6 | No side effects | `checkNoSideEffects` | `.ts` |
| 7 | Barrel exports updated | `checkBarrelExports` | `index.ts` |

## PageHeadSchema

Page-level metadata for SEO and document head. Uses flattened structure (no nested objects) to match Feature pattern.

```typescript
// schema/page-head.ts
export interface PageHeadSchema {
  // Required
  title: string

  // SEO
  description?: string
  canonical?: string

  // Open Graph (flattened - not meta.openGraph.title)
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogUrl?: string

  // Twitter Card (flattened)
  twitterCard?: 'summary' | 'summary_large_image'
  twitterCreator?: string

  // Robots (flattened)
  robotsIndex?: boolean    // default: true
  robotsFollow?: boolean   // default: true

  // Technical
  viewport?: string
  themeColor?: string
  icons?: { icon?: string; apple?: string }
}
```

### Design Decision: Flattened Structure

**Why not nested?**
```typescript
// AVOID - Deep nesting creates accessor chains
meta?: {
  openGraph?: {
    title?: string
    description?: string
  }
}
// Usage: page.meta?.openGraph?.title

// PREFER - Flat structure, direct access
ogTitle?: string
ogDescription?: string
// Usage: page.ogTitle
```

Flattened structure:
- Matches Feature pattern (shallow nesting)
- Enables simpler type narrowing
- Reduces optional chaining depth
- Maps directly to Next.js Metadata API

### Integration with Next.js

```typescript
// app/[...slug]/page.tsx
import type { Metadata } from 'next'
import type { PageHeadSchema } from '@/creativeshire/schema'

export async function generateMetadata({ params }): Promise<Metadata> {
  const page = await getPage(params.slug)
  const head: PageHeadSchema = page.head

  return {
    title: head.title,
    description: head.description,
    openGraph: {
      title: head.ogTitle ?? head.title,
      description: head.ogDescription ?? head.description,
      images: head.ogImage ? [head.ogImage] : undefined,
    },
    twitter: {
      card: head.twitterCard ?? 'summary_large_image',
      creator: head.twitterCreator,
    },
    robots: {
      index: head.robotsIndex ?? true,
      follow: head.robotsFollow ?? true,
    },
  }
}
```

---

## SerializableValue Type

All schema data must be JSON-serializable to cross the RSC boundary safely.

```typescript
// schema/types.ts
export type SerializableValue =
  | string
  | number
  | boolean
  | null
  | SerializableValue[]
  | { [key: string]: SerializableValue }

// Use in widget props for RSC safety
export interface WidgetSchema {
  id?: string
  type: string
  props?: Record<string, SerializableValue>  // Strict type
  style?: CSSProperties         // Inline styles
  className?: string            // Tailwind/CSS classes
  behaviour?: string | BehaviourConfig
  widgets?: WidgetSchema[]
}
```

### What's NOT Serializable

| Type | Why | Fix |
|------|-----|-----|
| Functions | Can't serialize closures | Pass function name as string, resolve at runtime |
| React Elements | Contains component refs | Use schema, render at runtime |
| Class Instances | Prototype chain lost | Use plain objects |
| Symbols | No JSON representation | Use string keys |
| undefined | Converts to null in JSON | Use null explicitly |

---

## CSS Variables

> Schemas define the TYPE structure only. Drivers and behaviours SET values.

```typescript
// schema/experience.ts
export type CSSVariables = Record<`--${string}`, string | number>

// Usage in other schemas
interface BehaviourConfig {
  id: string
  options?: Record<string, any>
  variables?: CSSVariables
}
```

Components read these variables; they never define them.

## Template

```typescript
// schema/widget.ts
export interface WidgetSchema {
  id?: string
  type: string
  props?: Record<string, any>
  style?: CSSProperties         // Inline styles
  className?: string            // Tailwind/CSS classes
  behaviour?: string | BehaviourConfig
  widgets?: WidgetSchema[]
}

export type WidgetType = 'Text' | 'Image' | 'Video' | 'Flex' | 'Grid'

export type WidgetTypeMap = {
  Text: TextProps
  Image: ImageProps
  Video: VideoProps
  Flex: FlexProps
  Grid: GridProps
}
```

```typescript
// schema/index.ts
export type { WidgetSchema, WidgetType, WidgetTypeMap } from './widget'
export type { SiteSchema, ExperienceConfig, PageReference } from './site'
export type { PageSchema, PageChromeOverrides } from './page'
export type { SectionSchema, LayoutConfig } from './section'
export type { ChromeSchema, RegionSchema, OverlaySchema } from './chrome'
export type { BehaviourConfig, CSSVariables, OptionConfig } from './experience'
```

## Anti-Patterns

### Don't: Export runtime values

```typescript
// WRONG
export const DEFAULT_WIDGET = { type: 'Text' }
export function createWidget() { ... }
```

**Why:** Schemas are compile-time only. Runtime code violates the type-only contract.

### Do: Export pure types

```typescript
// CORRECT
export interface WidgetSchema {
  type: string
}
export type WidgetType = 'Text' | 'Image'
```

### Don't: Import from implementation layers

```typescript
// WRONG
import { useState } from 'react'
import { useStore } from '@/creativeshire/experience/providers'
```

**Why:** Schema layer has no knowledge of React, Zustand, or any runtime.

### Do: Import only from other schemas

```typescript
// CORRECT
import type { BehaviourConfig } from './experience'
import type { CSSProperties } from 'react'
```

### Don't: Include implementation details

```typescript
// WRONG
interface WidgetSchema {
  render: () => JSX.Element
  onClick: (e: MouseEvent) => void
}
```

**Why:** Schemas describe data shape, not behavior implementation.

### Do: Describe data structure

```typescript
// CORRECT
interface WidgetSchema {
  type: string
  props?: Record<string, any>
}
```

## Testing

> **Compile-time verification.** Schemas are types — use TypeScript for validation.

### Testing Approach

| Aspect | Method | Why |
|--------|--------|-----|
| Type correctness | `tsc --noEmit` | Compile-time safety |
| No runtime exports | Static analysis | Schema purity |
| Barrel exports | Type checking | All types accessible |

### What to Verify

- [ ] `tsc --noEmit` passes with no errors
- [ ] All schema files export only types/interfaces
- [ ] No `const`, `function`, or `class` exports
- [ ] Barrel `index.ts` re-exports all types
- [ ] No circular dependencies

### Definition of Done

A schema file is complete when:

- [ ] `tsc --noEmit` passes
- [ ] Exports only types/interfaces
- [ ] No runtime imports
- [ ] Exported from barrel

### Running Validation

```bash
# TypeScript check
npx tsc --noEmit

# Custom validator
npm run validate -- schema/
```

---

## Integration

| Interacts With | Direction | How |
|----------------|-----------|-----|
| `content/` | Consumed by | Components implement these types |
| `experience/` | Consumed by | Behaviours read configuration types |
| `renderer/` | Consumed by | Renderers map schema to components |
| `site/` | Describes | Instance data matches schema shape |

## Validator

Validated by: `./schema.validator.ts`

Rules in "Must/Must Not" map 1:1 to validator checks.
