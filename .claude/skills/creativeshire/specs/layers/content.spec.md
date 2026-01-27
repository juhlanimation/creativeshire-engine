# Content Layer (L1)

> Provides the building blocks for pages: widgets, sections, chrome, and features. Content determines what appears on the page, not how it animates.

---

## Purpose

The Content Layer owns all visual primitives. Widgets hold content (text, images, video). Sections group widgets into semantic containers. Chrome persists across pages (header, footer, overlays). Features apply static styles (spacing, typography, background).

Content stays pure. It renders once and fills its container. Animation, scroll behavior, and viewport sizing belong to the **Experience Layer (L2)**.

---

## Owns

This layer owns:

```
creativeshire/content/
├── widgets/
│   ├── content/           # Leaf nodes: Text, Image, Video, Button
│   ├── layout/            # Containers: Flex, Grid, Stack, Carousel
│   └── composite/         # Factory functions: ProjectCard, Testimonial
├── sections/
│   ├── Section.tsx        # Base section renderer
│   └── composites/        # Factory functions: Hero, Gallery, Showreel
├── chrome/
│   ├── regions/           # Header, Footer, Sidebar
│   └── overlays/          # Cursor, Loader, ModalContainer
├── features/              # Static decorators
│   ├── spacing.ts
│   ├── typography.ts
│   └── background.ts
└── registry.ts            # Auto-discovery via import.meta.glob
```

**Concepts owned:**
- Widget components and their props
- Section structure and layout
- Chrome regions and overlays
- Static feature decorators
- Widget registry and auto-discovery

---

## Receives From

| From Layer | What | Shape |
|------------|------|-------|
| **Schema** | Widget definitions | `WidgetSchema` |
| **Schema** | Section definitions | `SectionSchema` |
| **Schema** | Chrome definitions | `ChromeSchema` |
| **Schema** | Feature configuration | `FeatureSet` |
| **Experience (L2)** | Wrapper constraints | `BehaviourWrapper` children |

---

## Provides To

| To Layer | What | Shape |
|----------|------|-------|
| **Renderer** | Widget components | `ComponentType<WidgetProps>` |
| **Renderer** | Section component | `Section` component |
| **Renderer** | Chrome components | `Header`, `Footer`, `Cursor` |
| **Renderer** | Feature styles | `CSSProperties` via `useFeatures()` |
| **Experience (L2)** | DOM refs | Via `BehaviourWrapper` children |

---

## Internal Structure

### Content Hierarchy

```
Site
  ├── Chrome (persistent UI)
  │     ├── Regions (header, footer, sidebar)
  │     └── Overlays (cursor, loader, modals)
  │
  └── Pages
        └── Page
              ├── Chrome (page-level overrides)
              └── Sections
                    └── Widgets
                          └── Widgets (recursive, if layout widget)
```

Site contains chrome and pages. Pages contain sections. Sections contain widgets. Layout widgets nest other widgets recursively.

### Widget Taxonomy

| Category | Purpose | Nesting | Example |
|----------|---------|---------|---------|
| **Content** | Hold actual content | Leaf nodes | Text, Image, Video, Button |
| **Layout** | Arrange children | Accept children | Flex, Grid, Stack, Carousel |
| **Composite** | Pre-assembled | Factory → `WidgetSchema` | ProjectCard, Testimonial |

#### Content Widgets (Leaf Nodes)

| Widget | What it holds |
|--------|---------------|
| **Text** | Text/rich text |
| **Image** | Raster image |
| **SVG** | Vector graphic |
| **Video** | Video file/stream |
| **Audio** | Audio file/stream |
| **Embed** | Third-party iframe |
| **Button** | Clickable action |
| **Divider** | Visual separator |
| **Spacer** | Empty space |
| **Avatar** | Profile image |
| **Badge** | Label/tag |

#### Layout Widgets (Containers)

| Widget | Arrangement |
|--------|-------------|
| **Flex** | Flexbox |
| **Grid** | CSS Grid |
| **Stack** | Vertical/horizontal stack |
| **Columns** | Multi-column text |
| **Carousel** | Swipeable slides |
| **Tabs** | Tabbed content |
| **Accordion** | Collapsible sections |
| **Masonry** | Pinterest-style |

#### Composite Widgets (Factory Functions)

Composites return `WidgetSchema`, not React components. The renderer expands them.

```typescript
// creativeshire/content/widgets/composite/ProjectCard/index.ts
export function createProjectCard(props: ProjectCardProps): WidgetSchema {
  return {
    type: 'Stack',
    features: { spacing: { gap: 16 } },
    widgets: [
      { type: 'Image', props: { src: props.image, alt: props.title } },
      { type: 'Text', props: { content: props.title } },
      {
        type: 'Flex',
        widgets: props.tags.map(t => ({ type: 'Badge', props: { label: t } }))
      }
    ]
  }
}
```

### Section Structure

Sections group widgets into semantic containers. Each section has an ID (for anchoring), layout configuration, optional features, and a list of widgets.

```typescript
// creativeshire/schema/section.ts
export interface SectionSchema {
  id: string
  layout: LayoutConfig
  features?: FeatureSet
  behaviour?: string | BehaviourConfig
  behaviourOptions?: Record<string, any>
  widgets: WidgetSchema[]
}
```

Section composites are factory functions that return `SectionSchema`:

```typescript
// creativeshire/content/sections/composites/Hero/index.ts
export function createHeroSection(props: HeroProps): SectionSchema {
  return {
    id: props.id ?? 'hero',
    layout: { type: 'stack', align: 'center', gap: 32 },
    features: { background: props.background },
    widgets: [
      {
        type: 'Text',
        props: { content: props.headline },
        features: { typography: { size: '6xl', weight: 'bold' } }
      }
    ]
  }
}
```

### Chrome Structure

Chrome persists across pages. Regions occupy fixed positions. Overlays float above content.

```
Chrome
  ├── Regions (fixed positions)
  │     ├── Header
  │     ├── Footer
  │     └── Sidebar
  │
  └── Overlays (floating)
        ├── Cursor
        ├── Loader
        └── ModalContainer
```

Chrome exists at **Site level** (defaults) and **Page level** (overrides):

| Strategy | Behavior |
|----------|----------|
| **inherit** | Page uses site chrome (default) |
| **override** | Page replaces region |
| **hidden** | Page hides region |

### Features (Static Decorators)

Features apply static styles. They never animate. If a property changes with scroll, it belongs to a behaviour.

| Category | Properties |
|----------|------------|
| **Spacing** | margin, padding |
| **Visual** | background, border, shadow, opacity |
| **Typography** | family, size, weight, align, color |
| **Layout** | fullWidth, aspectRatio |

```typescript
// creativeshire/schema/features.ts
export interface FeatureSet {
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
```

### Registry Auto-Discovery

Widgets are auto-discovered using `import.meta.glob`:

```typescript
// creativeshire/content/registry.ts
const widgetModules = import.meta.glob('./widgets/**/index.tsx', { eager: true })

export const widgetRegistry: Record<string, ComponentType<any>> = {}

Object.entries(widgetModules).forEach(([path, module]) => {
  const match = path.match(/\.\/widgets\/\w+\/(\w+)\/index\.tsx$/)
  if (match) {
    widgetRegistry[match[1]] = (module as any).default
  }
})
```

Drop a widget folder in `widgets/content/` or `widgets/layout/`. The registry finds it automatically.

---

## Boundaries

### This layer CAN:

- Render static structure and content
- Accept children props for layout widgets
- Apply features (spacing, typography, background)
- Use intrinsic sizing (content-based dimensions)
- Fill parent containers
- Export components to the registry

### This layer CANNOT:

- Import from `experience/` → animation belongs in L2
- Reference scroll position → triggers belong in L2
- Apply CSS variables directly → drivers belong in L2
- Use viewport units (`100vh`, `100dvh`) → extrinsic sizing belongs in L2
- Listen to scroll/resize events → triggers belong in L2
- Use `will-change` → animation optimization belongs in L2
- Set `data-behaviour` → renderer applies this attribute

---

## Key Interfaces

```typescript
// creativeshire/schema/widget.ts
export interface WidgetSchema {
  id?: string
  type: string
  props?: Record<string, any>
  features?: FeatureSet
  behaviour?: string | BehaviourConfig
  behaviourOptions?: Record<string, any>
  widgets?: WidgetSchema[]
}

// creativeshire/schema/section.ts
export interface SectionSchema {
  id: string
  layout: LayoutConfig
  features?: FeatureSet
  behaviour?: string | BehaviourConfig
  behaviourOptions?: Record<string, any>
  widgets: WidgetSchema[]
}

export interface LayoutConfig {
  type: 'flex' | 'grid' | 'stack'
  direction?: 'row' | 'column'
  align?: 'start' | 'center' | 'end'
  justify?: 'start' | 'center' | 'end' | 'between'
  gap?: number | string
  columns?: number
}

// creativeshire/schema/chrome.ts
export interface ChromeSchema {
  regions: {
    header?: RegionSchema
    footer?: RegionSchema
    sidebar?: RegionSchema
  }
  overlays?: {
    cursor?: OverlaySchema
    loader?: OverlaySchema
    modal?: OverlaySchema
  }
}

export interface RegionSchema {
  widgets: WidgetSchema[]
  behaviour?: string | BehaviourConfig
  behaviourOptions?: Record<string, any>
}

export interface OverlaySchema {
  trigger?: TriggerCondition
  widget: WidgetSchema
  behaviour?: string | BehaviourConfig
}
```

---

## The Frame Pattern

L2 wrappers impose extrinsic constraints. L1 content fills or sizes intrinsically. The widget never knows about viewport units, scroll position, or animation state.

```
┌─ BehaviourWrapper (L2) ──────────────┐
│  Extrinsic: size, position, clip      │
│                                       │
│   ┌─ Widget/Section (L1) ──────────┐  │
│   │  Intrinsic: content, layout    │  │
│   │  Fills parent, unaware of L2   │  │
│   └────────────────────────────────┘  │
└───────────────────────────────────────┘
```

---

## Anti-Patterns

### Don't: Use Viewport Units in Widgets

```typescript
// creativeshire/content/widgets/content/Video/index.tsx
export default function Video({ src }: VideoProps) {
  return (
    <div style={{ height: '100vh' }}> {/* WRONG: viewport unit in L1 */}
      <video src={src} />
    </div>
  )
}
```

**Why this fails:** Viewport sizing is extrinsic. The widget assumes its context. BehaviourWrapper imposes 100dvh, not the widget.

### Don't: Import from Experience Layer

```typescript
// creativeshire/content/widgets/content/Image/index.tsx
import { useScrollProgress } from '@/creativeshire/experience/triggers' // WRONG

export default function Image({ src, alt }: ImageProps) {
  const progress = useScrollProgress()
  return <img src={src} alt={alt} style={{ opacity: progress }} />
}
```

**Why this fails:** Widgets become coupled to scroll state. Animation belongs in behaviours. The driver handles CSS variables.

### Don't: Listen to Scroll Events

```typescript
// creativeshire/content/sections/Section.tsx
export function Section({ children }: SectionProps) {
  useEffect(() => {
    window.addEventListener('scroll', handler) // WRONG
  }, [])
}
```

**Why this fails:** Scroll handling belongs to drivers and triggers in L2. Sections render once and stay idle.

---

## Related Documents

- Philosophy: [Philosophy](../core/philosophy.spec.md)
- Contracts: [Layer Contracts](../core/contracts.spec.md)
- Experience Layer: [Experience Layer](./experience.spec.md)
- Widget Contract: [Widget Contract](../components/content/widget.spec.md)
- Section Contract: [Section Contract](../components/content/section.spec.md)
