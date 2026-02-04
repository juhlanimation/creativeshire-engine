# Future Improvements

Potential improvements identified from Payload CMS architecture analysis (Feb 2025).

---

## P1: Widget Prop Validation Schemas

**Source:** Payload's per-field validation system

**Problem:** Widget props are only TypeScript-checked at compile time. Runtime validation is implicit.

**Solution:** Add Zod schemas per widget type.

```typescript
// engine/schema/widget-validation.ts
import { z } from 'zod'

export const widgetSchemas = {
  Text: z.object({
    content: z.string(),
    variant: z.enum(['h1', 'h2', 'h3', 'body', 'caption']).optional(),
    align: z.enum(['left', 'center', 'right']).optional()
  }),
  Image: z.object({
    src: z.string().url(),
    alt: z.string(),
    aspectRatio: z.string().optional(),
    objectFit: z.enum(['cover', 'contain', 'fill']).optional()
  }),
  Button: z.object({
    label: z.string(),
    variant: z.enum(['primary', 'secondary', 'ghost']).optional(),
    size: z.enum(['sm', 'md', 'lg']).optional()
  })
  // ... all widget types
}

export function validateWidgetProps(type: string, props: unknown): ValidationResult {
  const schema = widgetSchemas[type]
  if (!schema) return { valid: true } // Unknown types pass through
  return schema.safeParse(props)
}
```

**Benefits:**
- Platform can validate user input before sending to Engine
- Better error messages in dev mode
- Documentation via schema introspection
- Settings UI generation from schemas

**Files:**
- New: `engine/schema/widget-validation.ts`
- Modify: `engine/schema/index.ts` (export)

---

## P2: Plugin Architecture

**Source:** Payload's config transformation plugins

**Problem:** No formal way to extend Engine with third-party features.

**Solution:** Plugin interface for registering widgets, behaviours, effects, experiences.

```typescript
// engine/plugins/types.ts
export interface EnginePlugin {
  name: string
  version: string

  // Register new components
  widgets?: Record<string, WidgetDefinition>
  behaviours?: Record<string, BehaviourDefinition>
  effects?: Record<string, EffectDefinition>
  experiences?: Record<string, ExperienceConfig>

  // Transform schema on load
  transformSchema?: (schema: SiteSchema) => SiteSchema

  // Lifecycle hooks
  onInit?: (engine: EngineInstance) => void
  onDestroy?: () => void
}

// engine/interface/EngineProvider.tsx
interface EngineProviderProps {
  plugins?: EnginePlugin[]
  // ...existing
}
```

**Example plugins:**
- `@creativeshire/forms-plugin` - Form widgets + validation
- `@creativeshire/analytics-plugin` - Event tracking behaviours
- `@creativeshire/ecommerce-plugin` - Product widgets + cart

**Benefits:**
- Feature isolation
- Third-party extensions
- Composable functionality
- Cleaner core

**Files:**
- New: `engine/plugins/types.ts`
- New: `engine/plugins/registry.ts`
- Modify: `engine/interface/EngineProvider.tsx`

---

## P3: Block-Type Sections

**Source:** Payload's Blocks field (polymorphic arrays)

**Problem:** Sections are generic objects. Type safety requires manual discrimination.

**Solution:** Discriminated union for section types.

```typescript
// Current
interface SectionSchema {
  id: string
  layout: LayoutConfig
  widgets: WidgetSchema[]
  behaviour?: BehaviourConfig
}

// Proposed
type SectionSchema =
  | HeroSection
  | GridSection
  | SplitSection
  | CarouselSection
  | CustomSection

interface HeroSection {
  type: 'hero'
  props: {
    headline: string
    subheadline?: string
    cta?: ButtonProps
    background: ImageProps | VideoProps
  }
}

interface GridSection {
  type: 'grid'
  props: {
    columns: 2 | 3 | 4
    gap: 'sm' | 'md' | 'lg'
    items: WidgetSchema[]
  }
}
```

**Benefits:**
- Type-safe section variants
- Better Platform UI for section selection
- Validation per section type
- Pattern enforcement

**Consideration:** May be too restrictive for visual builder flexibility. Evaluate against use cases.

---

## P4: Widget Lifecycle Hooks

**Source:** Payload's beforeChange/afterChange hooks

**Problem:** No way to transform props or run effects at widget render time.

**Solution:** Optional hooks in widget schema.

```typescript
interface WidgetSchema {
  type: string
  props: Record<string, SerializableValue>

  // New: lifecycle hooks (IDs referencing hook registry)
  hooks?: {
    beforeRender?: string  // Hook ID
    afterMount?: string    // Hook ID
  }
}

// Hook registry
const hookRegistry = {
  'analytics/track-view': (props, context) => {
    // Track widget view
    return props
  },
  'computed/dynamic-content': (props, context) => {
    // Compute derived props
    return { ...props, computed: calculate(props) }
  }
}
```

**Benefits:**
- Analytics injection
- Dynamic prop computation
- Third-party integrations
- A/B testing support

**Consideration:** Adds complexity. May be better handled at Platform level.

---

## Not Recommended

These Payload patterns were analyzed but **not recommended** for Engine:

| Pattern | Why Not |
|---------|---------|
| Collections/Globals split | Wrong paradigm for visual builder |
| CRUD lifecycle hooks | Platform's responsibility |
| Field-level access control | Overkill; Platform handles auth |
| Database adapters | Engine is database-agnostic |

---

## Priority Matrix

| Improvement | Effort | Impact | Risk | Priority |
|-------------|--------|--------|------|----------|
| Widget prop validation | Medium | High | Low | **P1** |
| Plugin architecture | High | High | Medium | **P2** |
| Block-type sections | Medium | Medium | Medium | **P3** |
| Widget lifecycle hooks | Low | Medium | Low | **P4** |

---

## References

- [Payload Fields Overview](https://payloadcms.com/docs/fields/overview)
- [Payload Blocks Field](https://payloadcms.com/docs/fields/blocks)
- [Payload Hooks](https://payloadcms.com/docs/hooks/overview)
- [Payload Plugins](https://payloadcms.com/docs/plugins/overview)
- [Collection Structure Best Practices](https://www.buildwithmatija.com/blog/payload-cms-collection-structure-best-practices)
