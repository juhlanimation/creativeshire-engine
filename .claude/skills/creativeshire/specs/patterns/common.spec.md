# Common Patterns

> Proven patterns for building within the Creativeshire architecture. Each pattern solves a specific problem while maintaining layer separation.

---

## Pattern: Frame Pattern

### Context

A widget needs animation, scroll-based positioning, or viewport sizing.

### Problem

Widgets (L1) must remain pure content containers. They cannot use viewport units, listen to scroll events, or manage animation state.

### Solution

```typescript
// experience/behaviours/BehaviourWrapper.tsx
function BehaviourWrapper({ behaviour, options, children }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const driver = useDriver()
  const id = useRef(crypto.randomUUID())

  useEffect(() => {
    if (!ref.current || behaviour.id === 'none') return
    driver.register(id.current, ref.current, behaviour, options)
    return () => driver.unregister(id.current)
  }, [behaviour.id, options])

  return (
    <div ref={ref} style={parseCssTemplate(behaviour.cssTemplate)} data-behaviour={behaviour.id}>
      {children}
    </div>
  )
}
```

```
┌─ BehaviourWrapper (L2) ──────────────┐
│  Extrinsic: size, position, clip      │
│   ┌─ Widget/Section (L1) ──────────┐  │
│   │  Intrinsic: content, layout    │  │
│   └────────────────────────────────┘  │
└───────────────────────────────────────┘
```

### Why This Works

Widgets render once and stay idle. The wrapper handles animation. Swap behaviours without touching widgets.

---

## Pattern: CSS Variable Bridge

### Context

Animation values must flow from schema to visual output across layers.

### Problem

React state updates at 60fps create 3,000+ renders per second. Performance collapses.

### Solution

```
Schema → Behaviour → Driver → CSS

1. Schema: { behaviour: 'depth-layer', behaviourOptions: { depth: 100 } }
2. Behaviour: compute() => ({ '--depth-y': scrollProgress * depth })
3. Driver: element.style.setProperty('--depth-y', value)
4. CSS: transform: translateY(calc(var(--depth-y, 0) * 1px))
```

```typescript
// experience/behaviours/depth-layer/index.ts
export const depthLayerBehaviour: Behaviour = {
  id: 'depth-layer',
  requires: ['scrollProgress'],
  compute: (state, options) => ({
    '--depth-y': state.scrollProgress * (options.depth ?? 50)
  }),
  cssTemplate: `transform: translateY(calc(var(--depth-y, 0) * 1px)); will-change: transform;`
}
```

### Why This Works

React renders once. Drivers update CSS variables via refs. No reconciliation at 60fps.

---

## Pattern: Schema-First Composition

### Context

Building reusable components like project cards or hero sections.

### Problem

Returning JSX from composites couples factories to React. Composites become untestable without rendering.

### Solution

Composites return `WidgetSchema` or `SectionSchema`, not React elements.

```typescript
// content/widgets/composite/ProjectCard/index.ts
export function createProjectCard(props: ProjectCardProps): WidgetSchema {
  return {
    type: 'Stack',
    style: { gap: 16 },
    widgets: [
      { type: 'Image', props: { src: props.image, alt: props.title } },
      { type: 'Text', props: { content: props.title } },
      { type: 'Flex', widgets: props.tags.map(tag => ({ type: 'Badge', props: { label: tag } })) }
    ]
  }
}
```

```typescript
// content/sections/patterns/Hero/index.ts
export function createHeroSection(props: HeroProps): SectionSchema {
  return {
    id: props.id ?? 'hero',
    layout: { type: 'stack', align: 'center', gap: 32 },
    widgets: [{ type: 'Text', props: { content: props.headline } }]
  }
}
```

### Why This Works

Composites are pure data functions. No React imports. Test by asserting on returned objects. Props are domain-specific (`title`, `image`), not schema internals.

---

## Pattern: Store-Driven Animation

### Context

Multiple elements react to the same scroll position or user input.

### Problem

Independent scroll listeners create redundant work and inconsistent state. Props trigger re-renders.

### Solution

Triggers update store. Drivers read store. Behaviours compute CSS variables.

```
Event (scroll) → Trigger → Store (Zustand) → Driver → behaviour.compute() → CSS variables
```

```typescript
// experience/drivers/ScrollDriver.ts
class ScrollDriver {
  private targets: Map<string, Target> = new Map()
  private state = { scrollProgress: 0 }

  constructor() {
    window.addEventListener('scroll', this.onScroll, { passive: true })
    this.tick()
  }

  private onScroll = () => {
    const maxScroll = document.body.scrollHeight - window.innerHeight
    this.state.scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0
  }

  private tick = () => {
    this.targets.forEach(({ element, behaviour, options }) => {
      const vars = behaviour.compute(this.state, options)
      Object.entries(vars).forEach(([key, value]) => element.style.setProperty(key, String(value)))
    })
    requestAnimationFrame(this.tick)
  }
}
```

### Why This Works

One scroll listener, one state object. The driver distributes to all targets. Elements stay synchronized. No React re-renders.

---

## Pattern: Cleanup on Unmount

### Context

Components with BehaviourWrappers unmount during navigation.

### Problem

Orphaned drivers and ScrollTriggers cause memory leaks and animation conflicts.

### Solution

Return cleanup functions from `useEffect`. Kill ScrollTriggers. Unregister from drivers.

```typescript
// experience/behaviours/BehaviourWrapper.tsx
useEffect(() => {
  if (!ref.current || behaviour.id === 'none') return
  driver.register(id.current, ref.current, behaviour, options)
  return () => driver.unregister(id.current)  // REQUIRED
}, [behaviour.id, options])
```

```typescript
// experience/drivers/GSAPDriver.ts
export function registerBehaviour(element, behaviour, options): () => void {
  const trigger = ScrollTrigger.create({
    trigger: element,
    scrub: true,
    onUpdate: (self) => {
      const vars = behaviour.compute({ scrollProgress: self.progress }, options)
      Object.entries(vars).forEach(([k, v]) => element.style.setProperty(k, String(v)))
    }
  })
  return () => trigger.kill()  // CRITICAL
}
```

### Why This Works

Components clean up after themselves. No orphaned listeners. Memory stays stable during navigation.

---

## Pattern: Behaviour Resolution Cascade

### Context

A widget needs animation but the schema does not specify a behaviour.

### Problem

Explicit behaviour on every widget creates verbose schemas. Defaults vary by mode.

### Solution

Resolution follows a cascade: explicit none → explicit behaviour → mode default → none.

| Priority | Condition | Result |
|----------|-----------|--------|
| 1 | `behaviour: 'none'` | No wrapper |
| 2 | Explicit behaviour | Use that behaviour |
| 3 | Mode has default | Use mode default |
| 4 | No default | No wrapper |

```typescript
// renderer/resolveBehaviour.ts
function resolveBehaviour(schema, mode, elementType): Behaviour | null {
  if (schema.behaviour === 'none') return null
  if (schema.behaviour) {
    return behaviourRegistry[typeof schema.behaviour === 'string' ? schema.behaviour : schema.behaviour.id]
  }
  const defaultBehaviour = mode.defaults[elementType]
  if (defaultBehaviour && defaultBehaviour !== 'none') return behaviourRegistry[defaultBehaviour]
  return null
}
```

```typescript
// experience/modes/parallax/index.ts
export const parallaxMode: Mode = {
  id: 'parallax',
  provides: ['scrollProgress', 'scrollVelocity'],
  defaults: { section: 'scroll-stack', widget: 'none' }
}
```

### Why This Works

Schemas stay minimal. Modes define sensible defaults. Explicit behaviours override when needed.

---

## Pattern: Registry Auto-Discovery

### Context

Adding a new widget requires updating imports and registry entries manually.

### Problem

Manual registration leads to forgotten entries and boilerplate maintenance.

### Solution

Use `import.meta.glob` to auto-discover components.

```typescript
// content/registry.ts
const widgetModules = import.meta.glob('./widgets/**/index.tsx', { eager: true })

export const widgetRegistry: Record<string, ComponentType<any>> = {}

Object.entries(widgetModules).forEach(([path, module]) => {
  const match = path.match(/\.\/widgets\/\w+\/(\w+)\/index\.tsx$/)
  if (match) widgetRegistry[match[1]] = (module as any).default
})
```

```typescript
// experience/behaviours/registry.ts
const behaviourModules = import.meta.glob('./*/index.ts', { eager: true })

export const behaviourRegistry: Record<string, Behaviour> = {}

Object.entries(behaviourModules).forEach(([path, module]) => {
  const behaviour = (module as any).default as Behaviour
  if (behaviour?.id) behaviourRegistry[behaviour.id] = behaviour
})
```

### Why This Works

Create folder with `index.tsx`. Done. The glob pattern finds it. The registry makes it available by name.

---

## Related Documents

- Philosophy: [philosophy.spec.md](../core/philosophy.spec.md)
- Content Layer: [content.spec.md](../layers/content.spec.md)
- Experience Layer: [experience.spec.md](../layers/experience.spec.md)
- Behaviour Contract: [behaviour.spec.md](../components/experience/behaviour.spec.md)
- Driver Contract: [driver.spec.md](../components/experience/driver.spec.md)
