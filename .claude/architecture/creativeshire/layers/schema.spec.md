# Schema Layer

> Defines TypeScript interfaces that describe data structures. The single source of truth for content, experience, and site data shapes.

---

## Purpose

The Schema Layer owns type definitions for the entire Creativeshire system. Schemas declare structure and behaviour intent using data only. They serve as contracts between layers: Content Layer implements what schemas describe, Experience Layer provides behaviours schemas reference, and Renderers interpret schemas into components.

Schemas validate at compile time via TypeScript. Runtime validation happens at render boundaries.

---

## Owns

```
creativeshire/schema/
├── index.ts              # Barrel export
├── site.ts               # Site-level configuration
├── page.ts               # Page structure and chrome overrides
├── section.ts            # Section layout and widgets
├── widget.ts             # Widget types and props
├── chrome.ts             # Regions and overlays
├── features.ts           # Static styling decorators
└── experience.ts         # Behaviour and mode configuration
```

**Concepts owned:**

- `SiteSchema` - Root container with experience config and chrome
- `PageSchema` - Page structure with chrome overrides
- `SectionSchema` - Semantic container with layout and widgets
- `WidgetSchema` - Atomic content unit with props and features
- `ChromeSchema` - Persistent UI (header, footer, overlays)
- `FeatureSet` - Static styling declarations
- `BehaviourConfig` - Animation intent (id + options)

---

## Type Relationships

```
SiteSchema
    ├── ExperienceConfig (mode + options)
    ├── ChromeSchema
    │       ├── RegionSchema[] (header, footer, sidebar)
    │       └── OverlaySchema[] (cursor, loader, modal)
    │
    └── PageReference[]
            └── PageSchema
                    ├── ChromeOverrides
                    └── SectionSchema[]
                            ├── LayoutConfig
                            ├── FeatureSet?
                            ├── BehaviourConfig?
                            └── WidgetSchema[]
                                    └── WidgetSchema[]? (recursive)
```

---

## Key Interfaces

### Site and Page

```typescript
// schema/site.ts
interface SiteSchema {
  id: string
  experience: ExperienceConfig
  chrome: ChromeSchema
  pages: PageReference[]
}

interface ExperienceConfig {
  mode: string
  options?: Record<string, any>
}

// schema/page.ts
interface PageSchema {
  id: string
  slug: string
  title?: string
  chrome?: 'inherit' | PageChromeOverrides
  sections: SectionSchema[]
}
```

### Section and Widget

```typescript
// schema/section.ts
interface SectionSchema {
  id: string
  layout: LayoutConfig
  features?: FeatureSet
  behaviour?: string | BehaviourConfig
  widgets: WidgetSchema[]
}

interface LayoutConfig {
  type: 'flex' | 'grid' | 'stack'
  direction?: 'row' | 'column'
  align?: 'start' | 'center' | 'end'
  justify?: 'start' | 'center' | 'end' | 'between'
  gap?: number | string
}

// schema/widget.ts
interface WidgetSchema {
  id?: string
  type: string
  props?: Record<string, any>
  features?: FeatureSet
  behaviour?: string | BehaviourConfig
  widgets?: WidgetSchema[]
}
```

### Chrome

```typescript
// schema/chrome.ts
interface ChromeSchema {
  regions: {
    header?: RegionSchema
    footer?: RegionSchema
    sidebar?: RegionSchema
  }
  overlays?: {
    cursor?: OverlaySchema
    loader?: OverlaySchema
  }
}

interface RegionSchema {
  widgets: WidgetSchema[]
  behaviour?: string | BehaviourConfig
}

interface OverlaySchema {
  trigger?: TriggerCondition
  widget: WidgetSchema
  behaviour?: string | BehaviourConfig
}
```

### Features and Experience

```typescript
// schema/features.ts
interface FeatureSet {
  spacing?: { margin?: string; padding?: string }
  background?: { color?: string; image?: string; gradient?: string }
  typography?: {
    size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
    weight?: 'normal' | 'medium' | 'semibold' | 'bold'
    align?: 'left' | 'center' | 'right'
    color?: string
  }
  border?: { width?: number; color?: string; radius?: string }
}

// schema/experience.ts
interface BehaviourConfig {
  id: string
  options?: Record<string, any>
}

type CSSVariables = Record<`--${string}`, string | number>
```

---

## Receives From

| From Layer | What | Shape |
|------------|------|-------|
| Site Instance | Content data | Conforms to `SiteSchema` |
| Presets | Default configurations | Conforms to `SitePreset` |

---

## Provides To

| To Layer | What | Shape |
|----------|------|-------|
| Renderer | Type contracts | All schema interfaces |
| Content Layer | Widget/Section contracts | `WidgetSchema`, `SectionSchema` |
| Experience Layer | Behaviour references | `BehaviourConfig`, `ExperienceConfig` |

---

## Validation Approach

### Compile-Time

TypeScript enforces schema structure. Invalid data fails at compile time.

```typescript
// Type error: 'invalid' is not assignable to type 'flex' | 'grid' | 'stack'
const section: SectionSchema = {
  id: 'hero',
  layout: { type: 'invalid' },
  widgets: []
}
```

### Runtime

Renderers validate at boundaries. Unknown widget types return error fallbacks.

```typescript
// renderer/WidgetRenderer.tsx
const Component = widgetRegistry[widget.type]
if (!Component) {
  return <div className="widget-error">Unknown widget: {widget.type}</div>
}
```

---

## Schema Evolution Rules

| Change Type | Approach |
|-------------|----------|
| Add property | Add as optional with implicit default |
| Expand values | Use union types, add new values |
| Deprecate | Mark with `@deprecated`, update consumers |
| Remove | Delete only after all consumers migrated |

---

## Boundaries

### This layer CAN:

- Define TypeScript interfaces
- Export type definitions
- Declare optional properties with defaults
- Use discriminated unions for variants
- Reference other schema types

### This layer CANNOT:

- Implement rendering logic - belongs in **Renderer**
- Define React components - belongs in **Content Layer**
- Compute animation values - belongs in **Experience Layer**
- Store runtime state - belongs in **Experience Layer**
- Apply styles directly - belongs in **Content/Experience Layer**

---

## Key Constraints

### Schema Declares Intent Only

Schemas describe structure and behaviour intent. They never contain implementation.

| Schema Declares | Implementation Lives In |
|-----------------|-------------------------|
| `type: 'Image'` | Content Layer widget |
| `behaviour: 'depth-layer'` | Experience Layer behaviour |
| `features.typography.size` | Content Layer feature utility |

### Features Are Intrinsic

Features describe static, intrinsic styling. Extrinsic sizing belongs to behaviours.

| Property | Location | Why |
|----------|----------|-----|
| `padding` | `features.spacing` | Static, intrinsic |
| `background` | `features.background` | Static, intrinsic |
| `100vh` height | `behaviour` wrapper | Extrinsic sizing |
| `translateY` | `behaviour` compute | Scroll-dependent |

### CSS Variables Start with `--`

The type system enforces CSS variable naming.

```typescript
type CSSVariables = Record<`--${string}`, string | number>

// Valid
const vars: CSSVariables = { '--depth-y': 50 }

// Type error: '--' prefix required
const vars: CSSVariables = { 'depth-y': 50 }
```

---

## Anti-Patterns

### Don't: Mix Schema with Implementation

```typescript
// Wrong - schema contains render logic
interface WidgetSchema {
  render: () => JSX.Element
}

// Right - schema declares data only
interface WidgetSchema {
  type: string
  props?: Record<string, any>
}
```

### Don't: Include Viewport Units in Features

```typescript
// Wrong - extrinsic sizing in features
features: { minHeight: '100vh' }

// Right - behaviour wrapper imposes size
behaviour: 'scroll-stack'
```

---

## Related Documents

- Philosophy: [../core/philosophy.spec.md](../core/philosophy.spec.md)
- Contracts: [../core/contracts.spec.md](../core/contracts.spec.md)
- Content Layer: [content.spec.md](content.spec.md)
- Experience Layer: [experience.spec.md](experience.spec.md)
