# Experience Layer (L2)

> Controls how the page feels: animation, interaction, and runtime state.

---

## Purpose

The **Experience Layer (L2)** handles everything that changes over time. Animation, scroll effects, user interaction, and runtime state belong here. Content Layer (L1) renders structure once. Experience Layer drives motion continuously.

This separation enables 60fps animation without React reconciliation overhead.

---

## Owns

```
engine/experience/
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
├── effects/                   # Reusable animation CSS
│   ├── text-reveal.css        # Text slide transitions
│   ├── fade-in.css            # Opacity transitions
│   └── scale-hover.css        # Scale on hover
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

**Concepts owned:** Experiences, Modes, Behaviours, Effects, BehaviourWrapper, Drivers, Triggers, Store

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
// experience/compositions/types.ts
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

### Store Lifecycle

```
MODE DEFINITION (modes/parallax/index.ts)
├── createStore: () => zustand store factory
│
SITE RENDERER (renderer/SiteRenderer.tsx)
├── const mode = getMode(modeId)
├── const store = mode.createStore()      ← Store created HERE
│
EXPERIENCE PROVIDER
├── <ExperienceContext.Provider value={{ mode, store }}>
│   └── Distributed via React context
│
ANY COMPONENT
└── const { store } = useExperience()     ← Access anywhere
```

**Why Mode creates the store:** Different modes need different state. Parallax needs scrollProgress. Slideshow needs currentSlide. The mode knows what state it provides.

### Store Shape

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

### Store Colocation

Component-specific stores (like modal state) are colocated with the component, not centralized.

```
content/chrome/overlays/Modal/
├── index.tsx
├── types.ts
└── store.ts    ← Modal store lives HERE, not in lib/stores/
```

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

GSAP integrates at three levels depending on the use case.

### Integration Options

```
┌─────────────────────────────────────────────────────────────┐
│  OPTION A: GSAP as Trigger                                  │
│  ─────────────────────────                                  │
│  ScrollTrigger → updates Zustand store → behaviours compute │
│  Good for: scroll position, section detection               │
├─────────────────────────────────────────────────────────────┤
│  OPTION B: GSAP as Driver                                   │
│  ────────────────────────                                   │
│  Zustand store → GSAP reads → animates via CSS vars         │
│  Good for: complex easing, timeline sequences               │
├─────────────────────────────────────────────────────────────┤
│  OPTION C: GSAP Alongside (ScrollSmoother)                  │
│  ──────────────────────────────────────────                 │
│  ScrollSmoother wraps site → smooth scrolling globally      │
│  Your drivers still work (read smoothed scroll position)    │
│  Good for: inertial smooth scrolling feel                   │
└─────────────────────────────────────────────────────────────┘
```

### Option A: GSAP as Trigger

ScrollTrigger captures scroll and updates the store. Behaviours compute from store.

```typescript
// experience/triggers/useGSAPScroll.ts
function useGSAPScroll(store: ExperienceStore) {
  useEffect(() => {
    ScrollTrigger.create({
      onUpdate: (self) => {
        store.setState({
          scrollProgress: self.progress,
          scrollVelocity: self.getVelocity()
        })
      }
    })
    return () => ScrollTrigger.killAll()
  }, [store])
}
```

### Option B: GSAP as Driver

GSAP drives the animation loop. Behaviours still compute CSS variables.

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

### Option C: GSAP ScrollSmoother (Alongside)

ScrollSmoother wraps the entire site for smooth inertial scrolling. Your drivers read the smoothed scroll position.

```typescript
// experience/providers/SmoothScrollProvider.tsx
function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const smoother = ScrollSmoother.create({
      wrapper: wrapperRef.current,
      content: contentRef.current,
      smooth: 1.5,
      effects: true
    })
    return () => smoother.kill()
  }, [])

  return (
    <div ref={wrapperRef}>
      <div ref={contentRef}>{children}</div>
    </div>
  )
}
```

### Choosing an Integration

| Use Case | Option |
|----------|--------|
| Simple scroll-driven animation | A (Trigger) |
| Complex timelines, easing | B (Driver) |
| Smooth scrolling feel | C (Alongside) |
| All three combined | A + B + C |

**Note:** Options can be combined. ScrollSmoother (C) can wrap the site while triggers (A) update the store and drivers (B) apply behaviours.

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

## Effects

**Effects** are reusable CSS files that define HOW elements animate. They contain transitions, transforms, and timing—driven by CSS variables from behaviours.

### Why Effects?

Without effects, animation knowledge leaks into Content (L1):

```css
/* BAD: Widget defines animation */
.contact-prompt__text {
  transform: translateY(calc(var(--reveal) * -100%));  /* Widget knows it slides */
  transition: transform 400ms ease-in-out;              /* Widget knows timing */
}
```

With effects, Content stays pure structure:

```css
/* GOOD: Widget is pure structure */
.contact-prompt__text {
  /* No animation knowledge */
}

/* Effect (L2) defines animation */
[data-effect="text-reveal"] [data-reveal] {
  transform: translateY(var(--reveal-y, 0));
  transition: transform var(--reveal-duration, 400ms) var(--reveal-easing, ease-in-out);
}
```

### Behaviour vs Effect

| Aspect | Behaviour | Effect |
|--------|-----------|--------|
| **What** | Computes CSS variable VALUES | Defines CSS that USES variables |
| **Format** | TypeScript function | CSS file |
| **Contains** | State → value mapping | Transitions, transforms, timing |
| **Example output** | `--reveal-y: -100%` | `transform: translateY(var(--reveal-y))` |

### Pattern: data-effect Attributes

Content marks animatable elements with `data-effect` and `data-*` attributes:

```tsx
// L1 - Pure structure with animation hooks
<div className="contact-prompt" data-effect="text-reveal">
  <span data-reveal="primary">{promptText}</span>
  <span data-reveal="secondary">{email}</span>
  <span data-reveal="icon">{icon}</span>
</div>
```

```typescript
// L2 - Behaviour computes actual values
const textReveal: Behaviour = {
  id: 'text-reveal',
  compute: (state) => ({
    '--reveal-y': state.isHovered ? '-100%' : '0',
    '--reveal-opacity': state.isHovered ? 1 : 0,
    '--reveal-duration': '400ms',
    '--reveal-easing': 'ease-in-out',
  })
}
```

```css
/* L2 - Effect defines transitions */
/* effects/text-reveal.css */
[data-effect="text-reveal"] [data-reveal="primary"],
[data-effect="text-reveal"] [data-reveal="secondary"] {
  transform: translateY(var(--reveal-y, 0));
  transition: transform var(--reveal-duration, 400ms) var(--reveal-easing, ease-in-out);
}

[data-effect="text-reveal"] [data-reveal="icon"] {
  opacity: var(--reveal-opacity, 0);
  transition: opacity calc(var(--reveal-duration, 400ms) * 0.75) var(--reveal-easing, ease-in-out);
}
```

### Effect File Structure

```
engine/experience/effects/
├── text-reveal.css      # Vertical text slide
├── fade-in.css          # Opacity fade
├── scale-hover.css      # Scale on hover
├── color-shift.css      # Color/blend-mode transition
└── index.css            # Barrel import
```

### Built-in Effects

| Effect | Behaviour | Description |
|--------|-----------|-------------|
| `text-reveal` | `text-reveal` | Vertical text slide with secondary text |
| `fade-in` | `fade-in` | Opacity + translateY entrance |
| `scale-hover` | `scale-hover` | Scale feedback on hover/press |
| `color-shift` | `color-shift` | Color and blend-mode transition |

### Importing Effects

Effects are imported globally in the experience provider:

```typescript
// experience/ExperienceProvider.tsx
import './effects/index.css'
```

Or per-effect when needed:

```typescript
// Only import text-reveal effect
import '@/engine/experience/effects/text-reveal.css'
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
