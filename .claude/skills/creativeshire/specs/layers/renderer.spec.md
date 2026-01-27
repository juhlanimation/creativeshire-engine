# Renderer Layer

> Bridges schema declarations to React components, resolving behaviours and wrapping content.

---

## Purpose

The Renderer layer interprets schema data and produces React components. Renderers resolve behaviours from mode defaults, apply features, wrap content with BehaviourWrappers, and handle errors. They translate declarative intent into rendered UI.

---

## Owns

This layer owns:

```
creativeshire/renderer/
├── SiteRenderer.tsx
├── PageRenderer.tsx
├── SectionRenderer.tsx
├── WidgetRenderer.tsx
├── ChromeRenderer.tsx
└── ErrorBoundary.tsx
```

**Concepts owned:**

- Schema-to-component mapping
- Behaviour resolution logic
- Feature application
- Error boundary handling
- Recursive widget rendering

---

## Receives From

| From Layer | What | Shape |
|------------|------|-------|
| **Schema** | Type definitions | `SiteSchema`, `PageSchema`, `SectionSchema`, `WidgetSchema` |
| **Content (L1)** | Widget components | `widgetRegistry[type]` |
| **Experience (L2)** | Mode definitions, BehaviourWrapper | `Mode`, `BehaviourWrapper`, `behaviourRegistry` |
| **Site** | Instance data | `siteConfig`, page definitions |

---

## Provides To

| To Layer | What | Shape |
|----------|------|-------|
| **App (Next.js)** | Rendered components | `<SiteRenderer site={config} page={page} />` |
| **Experience (L2)** | Registered refs | Via `BehaviourWrapper` → Driver registration |

---

## Internal Structure

```
SiteRenderer
  │
  ├── ExperienceProvider (mode + store)
  │     │
  │     └── DriverProvider
  │           │
  │           ├── ChromeRenderer (header)
  │           │
  │           ├── PageRenderer
  │           │     │
  │           │     └── SectionRenderer (for each section)
  │           │           │
  │           │           └── WidgetRenderer (for each widget)
  │           │                 │
  │           │                 └── WidgetRenderer (recursive)
  │           │
  │           ├── ChromeRenderer (footer)
  │           │
  │           └── ChromeRenderer (overlays)
```

---

## Renderer Hierarchy

| Renderer | Input | Output | Wraps With |
|----------|-------|--------|------------|
| `SiteRenderer` | `SiteSchema`, `PageSchema` | Chrome + Page | `ExperienceProvider`, `DriverProvider` |
| `PageRenderer` | `PageSchema` | Sections | Fragment |
| `SectionRenderer` | `SectionSchema`, `index` | Container with widgets | `BehaviourWrapper` (if behaviour resolved) |
| `WidgetRenderer` | `WidgetSchema` | Widget component | `BehaviourWrapper` (if behaviour resolved) |
| `ChromeRenderer` | `ChromeSchema`, position | Regions or overlays | Position-specific wrappers |

---

## Boundaries

### This layer CAN:

- Map schema types to component registry
- Resolve behaviours from mode defaults
- Wrap components with BehaviourWrapper
- Apply feature styles to containers
- Handle unknown widget types gracefully
- Catch and contain widget render errors

### This layer CANNOT:

- Compute animation values --> belongs in **Experience Layer (L2)**
- Modify schema data --> belongs in **Site**
- Apply CSS variables directly --> belongs in **Experience Layer (L2)**
- Define widget internals --> belongs in **Content Layer (L1)**
- Contain business logic --> belongs in **Site** or **Content Layer (L1)**

---

## Server Component Rules

### Must

1. Use parallel data fetching with component composition (not sequential awaits)
2. Use `React.cache()` for per-request deduplication of DB queries
3. Minimize serialization at RSC boundaries (only pass fields client needs)
4. Use Suspense boundaries to show wrapper UI while data loads
5. Use `after()` for non-blocking operations (logging, analytics)
6. Authenticate Server Actions inside the action (not just middleware)

### Must Not

1. Block entire page on single data fetch (use Suspense)
2. Pass objects to `React.cache()` (use primitives for cache hits)
3. Create waterfall chains in API routes (parallelize independent ops)
4. Serialize entire objects across RSC boundary (pick needed fields)
5. Transform arrays in RSC props (do in client to avoid duplication)

### Validation Rules

| # | Rule | Function | Files |
|---|------|----------|-------|
| 1 | Parallel fetching | `checkParallelFetching` | `*Renderer.tsx` |
| 2 | React.cache for DB | `checkReactCache` | `*Renderer.tsx` |
| 3 | Suspense boundaries | `checkSuspenseBoundaries` | `*Renderer.tsx` |
| 4 | Server Action auth | `checkServerActionAuth` | `actions/*.ts` |
| 5 | Minimal serialization | `checkMinimalSerialization` | `*Renderer.tsx` |

---

## Behaviour Resolution

Renderers resolve behaviours using a three-step cascade. See [experience.spec.md](./experience.spec.md#behaviour-resolution) for the priority rules.

| Priority | Condition | Result |
|----------|-----------|--------|
| 1 | `behaviour: 'none'` | No wrapper |
| 2 | Explicit behaviour | Use that behaviour |
| 3 | Mode has default | Use mode default |
| 4 | No default | No wrapper |

The `resolveBehaviour()` function in `experience/behaviours/resolve.ts` implements this cascade, returning `{ behaviour, options }` or `null`.

---

## Feature Application

Renderers apply features as static styles. Features translate to inline styles or class names.

```typescript
// creativeshire/content/features/index.ts
function useFeatures(features?: FeatureSet): CSSProperties {
  if (!features) return {}

  return {
    margin: features.spacing?.margin,
    padding: features.spacing?.padding,
    backgroundColor: features.background?.color,
    backgroundImage: features.background?.image
      ? `url(${features.background.image})`
      : features.background?.gradient,
    borderWidth: features.border?.width,
    borderColor: features.border?.color,
    borderRadius: features.border?.radius,
    fontSize: typographySizeMap[features.typography?.size ?? 'base'],
    fontWeight: features.typography?.weight,
    textAlign: features.typography?.align,
    color: features.typography?.color
  }
}
```

Features are **static**. Dynamic properties belong to behaviours.

---

## Error Handling

Renderers handle two failure modes:

| Failure | Handling | Fallback |
|---------|----------|----------|
| Unknown widget type | Check registry before render | `<div className="widget-error">` |
| Widget crash | ErrorBoundary wraps render | `<div className="widget-crash">` |

ErrorBoundary uses `getDerivedStateFromError` to catch exceptions and render fallback UI. This prevents a single widget failure from crashing the entire page.

---

## Key Interfaces

```typescript
// creativeshire/renderer/types.ts
interface SiteRendererProps {
  site: SiteSchema
  page: PageSchema
}

interface PageRendererProps {
  page: PageSchema
}

interface SectionRendererProps {
  section: SectionSchema
  index: number
}

interface WidgetRendererProps {
  widget: WidgetSchema
}

interface ChromeRendererProps {
  siteChrome: ChromeSchema
  pageChrome?: PageChromeOverrides | 'inherit'
  position: 'header' | 'footer' | 'overlays'
}
```

---

## SiteRenderer

Entry point. Sets up experience context and renders chrome + page.

```typescript
// creativeshire/renderer/SiteRenderer.tsx
export function SiteRenderer({ site, page }: SiteRendererProps) {
  const mode = modes[site.experience.mode]
  const store = mode.createStore(site.experience.options)

  return (
    <ExperienceProvider mode={mode} store={store}>
      <DriverProvider>
        <ChromeRenderer
          siteChrome={site.chrome}
          pageChrome={page.chrome}
          position="header"
        />

        <main>
          <PageRenderer page={page} />
        </main>

        <ChromeRenderer
          siteChrome={site.chrome}
          pageChrome={page.chrome}
          position="footer"
        />

        <ChromeRenderer
          siteChrome={site.chrome}
          pageChrome={page.chrome}
          position="overlays"
        />
      </DriverProvider>
    </ExperienceProvider>
  )
}
```

---

## SectionRenderer

Renders sections with behaviour wrapping and feature application.

```typescript
// creativeshire/renderer/SectionRenderer.tsx
export function SectionRenderer({ section, index }: SectionRendererProps) {
  const { mode } = useExperience()
  const resolved = resolveBehaviour(section, 'section', mode)
  const featureStyle = useFeatures(section.features)
  const layoutStyle = useLayoutStyle(section.layout)

  const content = (
    <section
      id={section.id}
      style={{ ...layoutStyle, ...featureStyle }}
      data-section-index={index}
    >
      {section.widgets.map((widget, i) => (
        <WidgetRenderer key={widget.id ?? i} widget={widget} />
      ))}
    </section>
  )

  if (!resolved) return content

  return (
    <BehaviourWrapper
      behaviour={resolved.behaviour}
      options={{ ...resolved.options, sectionIndex: index }}
    >
      {content}
    </BehaviourWrapper>
  )
}
```

---

## WidgetRenderer

Renders widgets with recursive support for layout widgets.

```typescript
// creativeshire/renderer/WidgetRenderer.tsx
export function WidgetRenderer({ widget }: WidgetRendererProps) {
  const { mode } = useExperience()
  const resolved = resolveBehaviour(widget, widget.type, mode)
  const featureStyle = useFeatures(widget.features)

  const Component = widgetRegistry[widget.type]

  if (!Component) {
    return <div className="widget-error">Unknown widget: {widget.type}</div>
  }

  const content = (
    <ErrorBoundary fallback={<div className="widget-crash">Widget failed</div>}>
      <div style={featureStyle} data-widget-type={widget.type}>
        <Component {...widget.props}>
          {widget.widgets?.map((child, i) => (
            <WidgetRenderer key={child.id ?? i} widget={child} />
          ))}
        </Component>
      </div>
    </ErrorBoundary>
  )

  if (!resolved) return content

  return (
    <BehaviourWrapper behaviour={resolved.behaviour} options={resolved.options}>
      {content}
    </BehaviourWrapper>
  )
}
```

### Recursive Widget Rendering

Layout widgets accept children. The renderer passes nested widgets as children props.

```
WidgetRenderer (Flex)
    │
    └── WidgetRenderer (Image)
    │
    └── WidgetRenderer (Stack)
            │
            └── WidgetRenderer (Text)
            │
            └── WidgetRenderer (Button)
```

---

## ChromeRenderer

Resolves chrome at site and page levels.

| Page Chrome | Result |
|-------------|--------|
| `'hidden'` | Don't render |
| Explicit region | Use page region |
| `'inherit'` or undefined | Use site region |

ChromeRenderer accepts a `position` prop (`'header'`, `'footer'`, or `'overlays'`) and resolves the appropriate chrome from site or page schema.

---

## Usage in App Routes

```typescript
// app/page.tsx
import { siteConfig } from '@/site/config'
import { homePage } from '@/site/pages/home'
import { SiteRenderer } from '@/creativeshire/renderer'

export default function Home() {
  return <SiteRenderer site={siteConfig} page={homePage} />
}
```

---

## Related Documents

- Contract: [behaviour.spec.md](../components/experience/behaviour.spec.md)
- Layer: [content.spec.md](./content.spec.md) - L1 primitives
- Layer: [experience.spec.md](./experience.spec.md) - L2 animation system
- Core: [contracts.md](../core/contracts.spec.md) - Layer boundaries
