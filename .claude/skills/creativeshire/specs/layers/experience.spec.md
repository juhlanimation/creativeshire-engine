# Experience Layer (L2)

> Controls how the page feels: animation, interaction, and runtime state.

---

## Purpose

The **Experience Layer (L2)** handles everything that changes over time. Animation, scroll effects, user interaction, and runtime state belong here. Content Layer (L1) renders structure once. Experience Layer drives motion continuously.

This separation enables 60fps animation without React reconciliation overhead.

---

## Owns

```
creativeshire/experience/
├── experiences/               # User-selectable experience definitions
│   ├── types.ts
│   ├── registry.ts
│   ├── stacking.ts
│   ├── cinematic-scroll.ts
│   └── gallery-focus.ts
├── modes/                     # Animation configurations (internal)
│   ├── static/
│   ├── parallax/
│   ├── reveal/
│   └── cinematic/
├── behaviours/
│   ├── types.ts               # Behaviour interface
│   ├── registry.ts            # All behaviours collected
│   ├── BehaviourWrapper.tsx   # ONE generic wrapper
│   ├── scroll-stack/
│   ├── depth-layer/
│   └── fade-on-scroll/
├── drivers/
│   ├── ScrollDriver.ts
│   └── GSAPDriver.ts
├── triggers/
│   ├── useScrollProgress.ts
│   └── useIntersection.ts
├── ExperienceProvider.tsx
├── DriverProvider.tsx
└── types.ts
```

**Concepts owned:** Experiences, Modes, Behaviours, BehaviourWrapper, Drivers, Triggers, Store

---

## Receives From

| From Layer | What | Shape |
|------------|------|-------|
| **Schema** | Behaviour intent | `behaviour?: string \| BehaviourConfig` |
| **Content (L1)** | DOM refs | `HTMLElement` via `useRef` |
| **Renderer** | Registration calls | `driver.register(id, element, behaviour, options)` |

---

## Provides To

| To Layer | What | Shape |
|----------|------|-------|
| **Content (L1)** | CSS variables | `--y`, `--opacity`, `--clip-progress` |
| **Renderer** | Context providers | `ExperienceProvider`, `DriverProvider` |
| **Renderer** | Wrapper component | `BehaviourWrapper` |

---

## Mode-Behaviour-Driver Flow

```
Event (scroll, resize) → Trigger (updates store) → Store (Zustand)
        │
        ▼
Driver (reads store, iterates targets)
        │
        ▼
behaviour.compute(state, options) → CSSVariables
        │
        ▼
element.style.setProperty('--y', '50')
        │
        ▼
CSS: transform: translateY(calc(var(--y, 0) * 1px))
```

React renders structure once. The driver loop runs continuously.

---

## Core Concepts

### Mode

A **Mode** bundles animation configuration: state availability, default behaviours, and options.

| Mode | Provides | Default Section | Use Case |
|------|----------|-----------------|----------|
| `static` | Nothing | `none` | No animations |
| `parallax` | scrollProgress, scrollVelocity | `scroll-stack` | Depth-based scroll |
| `reveal` | sectionVisibility | `scroll-stack` | Animate on scroll |
| `slideshow` | currentSlide, slideProgress | `slide-stack` | Full-screen slides |
| `cinematic` | scrollProgress, chapter | `scroll-stack` | Complex storytelling |

### Behaviour

A **Behaviour** transforms state into CSS variables. Runs every frame.

```typescript
interface Behaviour {
  id: string
  requires: string[]
  compute: (state, options) => CSSVariables  // Returns Record<`--${string}`, string | number>
  cssTemplate: string
  options?: Record<string, OptionConfig>
}
```

The type enforces `--prefixed` keys only. See [contracts.spec.md](../core/contracts.spec.md#css-variable-contract) for full contract details.

### Behaviour Resolution

| Priority | Condition | Result |
|----------|-----------|--------|
| 1 | `behaviour: 'none'` | No wrapper |
| 2 | Explicit behaviour | Use that behaviour |
| 3 | Mode has default for type | Use mode default |
| 4 | No default | No wrapper |

### BehaviourWrapper

**One** generic wrapper applies any behaviour. The widget stays pure.

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
  }, [behaviour.id])

  return (
    <div ref={ref} style={parseCssTemplate(behaviour.cssTemplate)} data-behaviour={behaviour.id}>
      {children}
    </div>
  )
}
```

---

## Experience Definitions

**Experiences** are user-selectable composites. Users pick Experiences in the CMS—not Modes or Behaviours. Experiences are atomic in the UI.

| Concept | User Selects | Purpose |
|---------|--------------|---------|
| **Experience** | Yes | Defines wrapping rules, appended sections, constraints |
| **Mode** | No | Provides state to behaviours |
| **Behaviour** | No | Computes CSS variables from state |

### How Experiences Work

An Experience defines:
1. **Wrapper rules** - which behaviour wraps each section (by position or type)
2. **Appended sections** - experience-owned content injected into the page
3. **Constraints** - required sections, position locks, behaviour override permissions

```typescript
// experience/experiences/types.ts
interface ExperienceDefinition {
  id: string
  name: string
  mode: ModeId                    // Underlying state provider
  wrappers: {
    byPosition?: { first?: WrapperRule; last?: WrapperRule }
    byType?: Record<string, WrapperRule>
    default: WrapperRule          // Fallback for unmatched sections
  }
  appendedSections?: AppendedSection[]
  allowBehaviourOverride: boolean // Per-section behaviour selection
}
```

### Built-in Experiences

| Experience | Mode | Description |
|------------|------|-------------|
| `stacking` | static | Barebone. Sections stack vertically, no animation. |
| `cinematic-scroll` | cinematic | Hero reveal + scroll transitions for storytelling |
| `gallery-focus` | parallax | Gallery-optimized with masonry reveals |
| `parallax-depth` | parallax | Depth-based scroll animations |

Every site has an experience. The **stacking** experience serves as the barebone fallback.

See [Experience Contract](../components/experience/experience.spec.md) for full specification.

---

## Driver Pattern: Why Not React State?

This is the most critical architectural decision.

**React-based animation (BAD):**
```
Scroll event → Zustand update → hooks re-run → widgets re-render → reconciliation → DOM

50 widgets × 60fps = death
```

**Driver-based animation (GOOD):**
```
Scroll event → driver.compute() → element.style.setProperty() → React never knows
```

The driver updates CSS variables directly via refs. React renders once and stays idle.

### Implementation

```typescript
// experience/drivers/ScrollDriver.ts
class ScrollDriver {
  private targets: Map<string, Target> = new Map()
  private state = { scrollProgress: 0 }

  constructor() {
    window.addEventListener('scroll', this.onScroll, { passive: true })
    this.tick()
  }

  private tick = () => {
    this.targets.forEach(({ element, behaviour, options }) => {
      const vars = behaviour.compute(this.state, options)
      Object.entries(vars).forEach(([key, value]) => {
        element.style.setProperty(key, String(value))
      })
    })
    requestAnimationFrame(this.tick)
  }

  register(id, element, behaviour, options) { this.targets.set(id, { element, behaviour, options }) }
  unregister(id) { this.targets.delete(id) }
  destroy() { window.removeEventListener('scroll', this.onScroll); this.targets.clear() }
}
```

---

## Store Architecture

Zustand manages runtime state. Each mode creates its own store.

```typescript
const createParallaxStore = () => create((set, get) => ({
  scrollProgress: 0,
  scrollVelocity: 0,
  sections: new Map<string, SectionState>(),

  setScrollProgress: (v) => set({ scrollProgress: v }),
  updateSection: (id, state) => {
    const sections = new Map(get().sections)
    sections.set(id, { ...sections.get(id), ...state })
    set({ sections })
  }
}))
```

Use a Map for per-section state, not nested providers.

---

## Trigger Types

| Trigger | Watches | Updates |
|---------|---------|---------|
| `scroll-progress` | `window.scroll` | 0-1 progress |
| `scroll-velocity` | Scroll delta / time | Speed + direction |
| `intersection` | `IntersectionObserver` | Section visibility |
| `resize` | `window.resize` | Viewport dimensions |
| `keyboard` | `keydown/keyup` | Key state |
| `cursor` | `mousemove` | x, y coordinates |

---

## GSAP Integration

For complex sequences, use GSAP ScrollTrigger.

```typescript
// experience/drivers/GSAPDriver.ts
function registerBehaviour(element, behaviour, options) {
  const trigger = ScrollTrigger.create({
    trigger: element,
    scrub: true,
    onUpdate: (self) => {
      const vars = behaviour.compute({ scrollProgress: self.progress }, options)
      Object.entries(vars).forEach(([key, val]) => element.style.setProperty(key, String(val)))
    }
  })
  return () => trigger.kill()
}
```

---

## Memory and Cleanup

**Critical:** Kill ScrollTriggers. Unregister drivers on unmount.

```typescript
// BehaviourWrapper cleanup
useEffect(() => {
  driver.register(id.current, ref.current, behaviour, options)
  return () => driver.unregister(id.current)  // REQUIRED
}, [behaviour.id])
```

Failure to cleanup causes memory leaks, animation conflicts, and performance degradation.

---

## Built-in Behaviours

### scroll-stack

```typescript
const scrollStackBehaviour: Behaviour = {
  id: 'scroll-stack',
  requires: ['scrollProgress', 'sectionIndex', 'totalSections'],
  compute: (state) => {
    const offset = state.sectionIndex - (state.scrollProgress * state.totalSections)
    return {
      '--section-y': `${offset * 100}vh`,
      '--section-z': state.totalSections - state.sectionIndex,
      '--section-opacity': offset > 1 ? 0 : 1
    }
  },
  cssTemplate: `height: 100dvh; position: fixed; transform: translateY(var(--section-y, 0));`
}
```

### depth-layer

```typescript
const depthLayerBehaviour: Behaviour = {
  id: 'depth-layer',
  requires: ['scrollProgress'],
  compute: (state, options) => ({
    '--depth-y': state.scrollProgress * (options.depth ?? 50)
  }),
  cssTemplate: `transform: translateY(calc(var(--depth-y, 0) * 1px)); will-change: transform;`
}
```

---

## Boundaries

### This layer CAN:

- Define behaviours (compute functions)
- Set CSS variables via drivers
- Listen to browser events
- Impose extrinsic constraints via BehaviourWrapper
- Create Zustand stores
- Use GSAP for complex sequences

### This layer CANNOT:

- Modify DOM structure (add/remove elements) - belongs in **Renderer**
- Re-render React components - React renders once, drivers handle motion
- Access widget props directly - receives refs only
- Set static styles (spacing, typography) - belongs in **Content (L1)**
- Import from `content/widgets/` internals - layer separation

---

## Key Interfaces

```typescript
interface Behaviour {
  id: string
  requires: string[]
  compute: (state: BehaviourState, options: Record<string, any>) => CSSVariables
  cssTemplate: string
  options?: Record<string, OptionConfig>
}

type CSSVariables = Record<`--${string}`, string | number>

interface BehaviourState {
  scrollProgress: number
  scrollVelocity: number
  sectionProgress: number
  sectionVisibility: number
  isActive: boolean
}

interface Mode {
  id: string
  provides: string[]
  createStore: (options?) => StoreApi<any>
  triggers: TriggerConfig[]
  defaults: { section: string; [widgetType: string]: string }
  options: Record<string, OptionConfig>
}
```

---

## SSR Fallback Pattern

CSS declares fallbacks. Before hydration, fallback values apply. After driver registers, computed values apply.

```css
.behaviour-wrapper {
  transform: translateY(calc(var(--y, 0) * 1px));
  opacity: var(--opacity, 1);
}
```

Fallbacks prevent layout shift. Content is visible immediately.

---

## Related Documents

- Philosophy: [philosophy.spec.md](../core/philosophy.spec.md)
- Contract: [contracts.spec.md](../core/contracts.spec.md)
- Content Layer: [content.spec.md](./content.spec.md)
- Interface Layer: [interface.spec.md](./interface.spec.md)
- Experience Contract: [experience.spec.md](../components/experience/experience.spec.md)
- Mode Contract: [mode.spec.md](../components/experience/mode.spec.md)
- Behaviour Contract: [behaviour.spec.md](../components/experience/behaviour.spec.md)
