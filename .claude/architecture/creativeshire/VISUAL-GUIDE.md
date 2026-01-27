# Creativeshire Architecture Visual Guide

> Comprehensive visual diagrams and explanations for the Creativeshire Engine architecture.
> This document supplements the existing specs with visual overviews and addresses common questions.

---

## Table of Contents

1. [The Layer Stack](#1-the-layer-stack)
2. [L1/L2 Separation (Core Insight)](#2-l1l2-separation-core-insight)
3. [Animation Data Flow](#3-animation-data-flow)
4. [Component Hierarchy](#4-component-hierarchy)
5. [The Frame Pattern](#5-the-frame-pattern)
6. [User Experience Selection Flow](#6-user-experience-selection-flow)
7. [Store Lifecycle](#7-store-lifecycle)
8. [GSAP Integration Points](#8-gsap-integration-points)
9. [Responsive Design](#9-responsive-design)
10. [Content Updates During Animation](#10-content-updates-during-animation)
11. [Example: Stacking Scroll](#11-example-stacking-scroll)
12. [The Mental Model](#12-the-mental-model)

---

## 1. The Layer Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                        SITE INSTANCE                            │
│                   (your specific site data)                     │
├─────────────────────────────────────────────────────────────────┤
│                          PRESET                                 │
│              (bundled content + experience + chrome)            │
├─────────────────────────────────────────────────────────────────┤
│                         RENDERER                                │
│                (schema → React components)                      │
├───────────────────────────┬─────────────────────────────────────┤
│                           │                                     │
│    CONTENT (L1)           │         EXPERIENCE (L2)             │
│    ─────────────          │         ───────────────             │
│    • Widgets              │         • Modes                     │
│    • Sections             │         • Behaviours                │
│    • Chrome               │         • Drivers                   │
│    • Features             │         • Triggers                  │
│                           │                                     │
│    Renders ONCE           │         Runs CONTINUOUSLY           │
│                           │                                     │
├───────────────────────────┴─────────────────────────────────────┤
│                          SCHEMA                                 │
│                    (TypeScript types)                           │
└─────────────────────────────────────────────────────────────────┘
```

**Key Insight:** The stack flows downward for structure, but L1 and L2 communicate horizontally via CSS variables.

---

## 2. L1/L2 Separation (Core Insight)

This is the foundational architectural decision.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   CONTENT (L1)                    EXPERIENCE (L2)               │
│   ════════════                    ═══════════════               │
│                                                                 │
│   ┌───────────────┐               ┌───────────────┐             │
│   │               │               │               │             │
│   │   Widgets     │               │    Drivers    │             │
│   │   Sections    │◄─────────────►│   Behaviours  │             │
│   │   Chrome      │  CSS Variables│    Triggers   │             │
│   │               │   (--y, etc)  │               │             │
│   └───────────────┘               └───────────────┘             │
│                                                                 │
│   "What's on        ──────────►   "How it moves                 │
│    the page"                        and feels"                  │
│                                                                 │
│   React renders                   requestAnimationFrame         │
│   ONCE                            60fps loop                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### The Contract: CSS Variables

```
L2 WRITES: element.style.setProperty('--y', 100)
L1 READS:  transform: translateY(calc(var(--y, 0) * 1px))
```

### Why This Separation Matters

| Concern | Owner | Update Frequency | React Involved? |
|---------|-------|------------------|-----------------|
| Content (what) | L1 | On data change | Yes |
| Animation (where/how) | L2 | 60fps | No |

---

## 3. Animation Data Flow

The complete loop from browser event to visual output:

```
    ┌──────────────────────────────────────────────────────────┐
    │                    BROWSER EVENT                          │
    │                  (scroll, resize, etc)                    │
    └─────────────────────────┬────────────────────────────────┘
                              │
                              ▼
    ┌──────────────────────────────────────────────────────────┐
    │                      TRIGGER                              │
    │              (useScrollProgress hook)                     │
    │                                                           │
    │   Listens to events, extracts values                      │
    └─────────────────────────┬────────────────────────────────┘
                              │
                              ▼
    ┌──────────────────────────────────────────────────────────┐
    │                   ZUSTAND STORE                           │
    │                                                           │
    │   { scrollProgress: 0.45, viewportHeight: 900, ... }      │
    └─────────────────────────┬────────────────────────────────┘
                              │
                              ▼
    ┌──────────────────────────────────────────────────────────┐
    │                      DRIVER                               │
    │              (reads store every frame)                    │
    │                                                           │
    │   requestAnimationFrame loop                              │
    └─────────────────────────┬────────────────────────────────┘
                              │
                              ▼
    ┌──────────────────────────────────────────────────────────┐
    │                    BEHAVIOUR                              │
    │            behaviour.compute(state, options)              │
    │                                                           │
    │   Pure function: state → CSS variables                    │
    │   Returns: { '--y': 50, '--opacity': 0.8, '--scale': 1 }  │
    └─────────────────────────┬────────────────────────────────┘
                              │
                              ▼
    ┌──────────────────────────────────────────────────────────┐
    │                    DOM UPDATE                             │
    │       element.style.setProperty('--y', 50)                │
    │                                                           │
    │   Direct DOM manipulation - NO REACT INVOLVED             │
    └─────────────────────────┬────────────────────────────────┘
                              │
                              ▼
    ┌──────────────────────────────────────────────────────────┐
    │                 BROWSER RENDERS                           │
    │                                                           │
    │   CSS reads variables, applies transforms                 │
    │   GPU accelerated, 60fps                                  │
    └──────────────────────────────────────────────────────────┘
```

### Why This Is Fast

```
❌ React way:  scroll → setState → reconcile → render → DOM → paint
✅ Driver way: scroll → store → compute → setProperty → paint

No React reconciliation in the animation loop!
```

---

## 4. Component Hierarchy

The render tree showing provider nesting:

```
SiteRenderer
│
├── ExperienceProvider (mode + store)
│   │
│   └── DriverProvider (registers elements for animation)
│       │
│       ├── ChromeRenderer [header]
│       │   └── Header, Navigation, etc.
│       │
│       ├── PageRenderer
│       │   │
│       │   ├── SectionRenderer
│       │   │   └── BehaviourWrapper (if animated)
│       │   │       └── Section
│       │   │           ├── WidgetRenderer
│       │   │           │   └── BehaviourWrapper (if animated)
│       │   │           │       └── Widget (Text, Image, etc.)
│       │   │           └── WidgetRenderer
│       │   │               └── ...
│       │   │
│       │   ├── SectionRenderer
│       │   │   └── ...
│       │   │
│       │   └── SectionRenderer
│       │       └── ...
│       │
│       ├── ChromeRenderer [footer]
│       │   └── Footer
│       │
│       └── ChromeRenderer [overlays]
│           └── Cursor, Loader, Modal
│
└── (end providers)
```

---

## 5. The Frame Pattern

How L2 wraps L1 without L1 knowing:

```
┌─────────────────────────────────────────────────────────┐
│  BehaviourWrapper (L2)                                  │
│  ┌───────────────────────────────────────────────────┐  │
│  │                                                   │  │
│  │  EXTRINSIC PROPERTIES                             │  │
│  │  • position (--y, --x)                            │  │
│  │  • scale (--scale)                                │  │
│  │  • opacity (--opacity)                            │  │
│  │  • clip-path                                      │  │
│  │  • z-index                                        │  │
│  │                                                   │  │
│  │  style={{                                         │  │
│  │    transform: 'translateY(var(--y, 0)px)',        │  │
│  │    opacity: 'var(--opacity, 1)'                   │  │
│  │  }}                                               │  │
│  │                                                   │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  Widget/Section (L1)                        │  │  │
│  │  │                                             │  │  │
│  │  │  INTRINSIC PROPERTIES                       │  │  │
│  │  │  • content (text, images)                   │  │  │
│  │  │  • layout (flex, grid)                      │  │  │
│  │  │  • typography                               │  │  │
│  │  │  • colors                                   │  │  │
│  │  │                                             │  │  │
│  │  │  Fills container, unaware of animation      │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │                                                   │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Key Insight:** L1 doesn't know it's being animated. L2 controls WHERE and HOW VISIBLE the content is.

---

## 6. User Experience Selection Flow

How an artist configures their site:

```
ARTIST DASHBOARD                      CREATIVESHIRE ENGINE
════════════════                      ════════════════════

┌─────────────────┐
│  Choose Site    │
│  Template       │───────────────►  Preset loaded
└─────────────────┘                  (content + chrome + mode)
        │
        ▼
┌─────────────────┐
│  Upload Content │───────────────►  Site Instance updated
│  (images, text) │                  (data layer)
└─────────────────┘
        │
        ▼
┌─────────────────┐
│  Reorder        │───────────────►  PageSchema.sections[]
│  Sections       │                  order changed
└─────────────────┘
        │
        ▼
┌─────────────────┐                  ┌────────────────────┐
│  Switch         │                  │ site.experience =  │
│  Experience     │───────────────►  │   { mode: 'new' }  │
│                 │                  │                    │
│  ○ Stacking     │                  │ Same L1 content,   │
│  ● Cinematic    │                  │ different L2 feel  │
│  ○ Parallax     │                  └────────────────────┘
└─────────────────┘
        │
        ▼
┌─────────────────┐
│  Tweak          │───────────────►  BehaviourConfig.options
│  Animation      │                  { intensity: 0.8 }
│  Options        │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│  Publish        │───────────────►  Site deployed
│  + Domain       │                  Domain linked
└─────────────────┘
```

---

## 7. Store Lifecycle

Where the Zustand store lives and how it flows:

### Location

```
creativeshire/
├── experience/
│   ├── types.ts                    ← ExperienceState interface
│   ├── ExperienceProvider.tsx      ← Distributes store via React context
│   └── modes/
│       └── stacking/
│           └── index.ts            ← createStore() factory
│
└── renderer/
    └── SiteRenderer.tsx            ← Creates store instance
```

### The Flow

```
MODE DEFINITION (stacking/index.ts)
════════════════════════════════════

export const stackingMode: Mode = {
  id: 'stacking',
  defaults: { section: 'none', widget: 'none' },

  createStore: () =>                          ◄── Factory function
    createStore<ExperienceState>(() => ({
      scrollProgress: 0,
      viewportHeight: 0,
      isScrolling: false,
    })),
}


SITE RENDERER (SiteRenderer.tsx)
═════════════════════════════════

const mode = getMode(modeId)          // Get mode config
const store = mode.createStore()       // ◄── Store created HERE

return (
  <ExperienceProvider mode={mode} store={store}>   ◄── Distributed
    <DriverProvider>
      ...
    </DriverProvider>
  </ExperienceProvider>
)


ANY COMPONENT (via hook)
════════════════════════

function SomeComponent() {
  const { store } = useExperience()     ◄── Access store
  const state = useStore(store)          // Zustand hook
  // or
  store.getState()                       // Direct access
  store.setState({ scrollProgress: 0.5 })
}
```

### Visual Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   MODE                                                          │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  id: 'stacking'                                         │   │
│   │  defaults: { ... }                                      │   │
│   │  createStore: () => zustand store                       │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              │ mode.createStore()               │
│                              ▼                                  │
│   STORE INSTANCE (created per render)                           │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  {                                                      │   │
│   │    scrollProgress: 0,                                   │   │
│   │    viewportHeight: 0,                                   │   │
│   │    isScrolling: false,                                  │   │
│   │  }                                                      │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              │ passed to provider               │
│                              ▼                                  │
│   EXPERIENCE PROVIDER                                           │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  <ExperienceContext.Provider value={{ mode, store }}>  │   │
│   │                                                         │   │
│   │    ┌─────────────────────────────────────────────────┐  │   │
│   │    │  DRIVER PROVIDER                                │  │   │
│   │    │  (manages element registrations)                │  │   │
│   │    │                                                 │  │   │
│   │    │    ┌─────────────────────────────────────────┐  │  │   │
│   │    │    │  Triggers    → update store             │  │  │   │
│   │    │    │  Drivers     → read store, apply vars   │  │  │   │
│   │    │    │  Behaviours  → compute from store       │  │  │   │
│   │    │    │  Wrappers    → read store for animation │  │  │   │
│   │    │    └─────────────────────────────────────────┘  │  │   │
│   │    │                                                 │  │   │
│   │    └─────────────────────────────────────────────────┘  │   │
│   │                                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Why Mode Creates the Store

Each mode might need different state:

```typescript
// Stacking mode - basic scroll state
createStore: () => createStore<ExperienceState>(() => ({
  scrollProgress: 0,
  viewportHeight: 0,
  isScrolling: false,
}))

// Cinematic mode - might need more state
createStore: () => createStore<CinematicState>(() => ({
  scrollProgress: 0,
  viewportHeight: 0,
  isScrolling: false,
  currentSection: 0,        // extra
  transitionPhase: 'idle',  // extra
  velocity: 0,              // extra
}))
```

---

## 8. GSAP Integration Points

GSAP can integrate at multiple levels:

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                TWO INTEGRATION POINTS                   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  OPTION A: GSAP as Trigger                              │
│  ─────────────────────────                              │
│                                                         │
│  ScrollTrigger ──► updates Zustand store                │
│                          │                              │
│                          ▼                              │
│                    Your behaviours compute              │
│                          │                              │
│                          ▼                              │
│                    Driver applies CSS vars              │
│                                                         │
│  Good for: scroll position, section detection           │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  OPTION B: GSAP as Driver                               │
│  ────────────────────────                               │
│                                                         │
│  Zustand store ──► GSAP reads state                     │
│                          │                              │
│                          ▼                              │
│                    gsap.to(element, {                   │
│                      y: computed.y,                     │
│                      scrollTrigger: { scrub: true }     │
│                    })                                   │
│                                                         │
│  Good for: complex easing, timeline sequences           │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  OPTION C: GSAP Alongside (ScrollSmoother)              │
│  ──────────────────────────────────────────             │
│                                                         │
│  ScrollSmoother wraps entire site                       │
│       │                                                 │
│       ├──► Smooth scrolling (global)                    │
│       │                                                 │
│       └──► Your drivers still work                      │
│            (they read smoothed scroll position)         │
│                                                         │
│  Good for: inertial smooth scrolling feel               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Example: GSAP as Trigger

```typescript
// triggers/useGSAPScroll.ts
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
  }, [])
}
```

### Example: GSAP as Driver

```typescript
// drivers/GSAPDriver.ts
function registerBehaviour(element, behaviour, options) {
  const trigger = ScrollTrigger.create({
    trigger: element,
    scrub: true,
    onUpdate: (self) => {
      const vars = behaviour.compute({ scrollProgress: self.progress }, options)
      Object.entries(vars).forEach(([key, val]) => {
        element.style.setProperty(key, String(val))
      })
    }
  })
  return () => trigger.kill()
}
```

---

## 9. Responsive Design

Responsive design works at two levels:

### Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   CONTENT (L1)                     EXPERIENCE (L2)              │
│   ════════════                     ═══════════════              │
│                                                                 │
│   Tailwind breakpoints             Viewport-aware behaviours    │
│   sm: md: lg: xl:                  compute(state) uses width    │
│                                                                 │
│   "How content LAYOUTS"            "How content ANIMATES"       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### L1: Content Responsiveness (Tailwind)

Standard Tailwind responsive classes:

```tsx
function ProjectCard({ title, image }) {
  return (
    <div className="
      grid
      grid-cols-1        // mobile: single column
      md:grid-cols-2     // tablet+: two columns
      gap-4
      md:gap-8
    ">
      <Image
        className="
          w-full
          aspect-square      // mobile: square
          md:aspect-video    // tablet+: 16:9
        "
        src={image}
      />
      <Text
        className="
          text-lg           // mobile
          md:text-2xl       // tablet+
        "
        content={title}
      />
    </div>
  )
}
```

### L2: Experience Responsiveness

Behaviours receive viewport info in state:

```typescript
interface BehaviourState {
  scrollProgress: number
  scrollVelocity: number
  sectionProgress: number

  // VIEWPORT INFO
  viewportWidth: number
  viewportHeight: number
  isMobile: boolean          // derived: width < 768
  isTouch: boolean           // device capability
  prefersReducedMotion: boolean
}
```

### Behaviours Can Adapt

```typescript
const stackingBehaviour: Behaviour = {
  id: 'scroll-stack',

  compute(state, options) {
    const { sectionProgress, viewportHeight, isMobile, prefersReducedMotion } = state

    // Respect accessibility preference
    if (prefersReducedMotion) {
      return { '--y': 0, '--opacity': 1, '--scale': 1 }
    }

    // RESPONSIVE: Different animation intensity
    const intensity = isMobile ? 0.5 : 1.0

    // RESPONSIVE: Smaller offset on mobile
    const maxOffset = isMobile ? 50 : 100

    const y = sectionProgress * maxOffset * intensity

    return {
      '--y': y,
      '--opacity': sectionProgress,
    }
  }
}
```

### The Viewport Trigger

```typescript
// triggers/useViewport.ts
function useViewport(store: ExperienceStore) {
  useEffect(() => {
    const update = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      store.setState({
        viewportWidth: width,
        viewportHeight: height,
        isMobile: width < 768,
        isTouch: 'ontouchstart' in window,
        prefersReducedMotion: window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches,
      })
    }

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
}
```

### CSS Variables Can Also Be Responsive

```css
.section {
  /* Mobile: use half the offset */
  transform: translateY(calc(var(--y, 0) * 0.5px));

  /* Desktop: use full offset */
  @media (min-width: 768px) {
    transform: translateY(calc(var(--y, 0) * 1px));
  }
}
```

### Mode-Level Responsive Defaults

```typescript
const cinematicMode: Mode = {
  id: 'cinematic',

  defaults: {
    section: 'scroll-stack',
    widget: 'fade-in',
  },

  // Override for mobile
  mobileDefaults: {
    section: 'none',        // disable section animation
    widget: 'simple-fade',  // simpler widget animation
  },
}
```

---

## 10. Content Updates During Animation

What happens when CMS content changes mid-animation:

### The Flow

```
BEFORE                              AFTER TEXT UPDATE
══════                              ══════════════════

BehaviourWrapper                    BehaviourWrapper
(--y: 50, --opacity: 0.8)           (--y: 50, --opacity: 0.8)
│                                   │
│  ┌─────────────────┐              │  ┌─────────────────┐
│  │                 │              │  │                 │
│  │  "Hello World"  │    ───►      │  │  "New Text!"    │
│  │                 │   CMS        │  │                 │
│  └─────────────────┘   update     └─────────────────┘


1. CMS updates text → React re-renders Text widget
2. BehaviourWrapper does NOT re-render (no props changed)
3. Driver keeps running → CSS variables unchanged
4. New text appears IN THE SAME ANIMATED POSITION

Animation continues uninterrupted.
```

### What Re-renders What

| Change Type | What Re-renders |
|-------------|-----------------|
| Text/image content | Widget only (leaf node) |
| Section order | PageRenderer |
| Experience mode | ExperienceProvider + down |
| Scroll position | NOTHING (CSS vars only) |
| Behaviour options | BehaviourWrapper only |

### React Still Does Its Job

```
Artist updates text in CMS
          │
          ▼
┌─────────────────────────────────────────┐
│  Server/API returns new content         │
└─────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────┐
│  React reconciles                       │
│                                         │
│  SiteRenderer        (no change)        │
│    └─ PageRenderer   (no change)        │
│        └─ SectionRenderer (no change)   │
│            └─ BehaviourWrapper (no change)
│                └─ Text widget  ◄─── RE-RENDERS
│                                         │
└─────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────┐
│  Meanwhile, driver loop continues...    │
│                                         │
│  Frame 1: setProperty('--y', 51)        │
│  Frame 2: setProperty('--y', 52)        │
│  Frame 3: setProperty('--y', 53)        │ ← unaffected
│  ...                                    │
└─────────────────────────────────────────┘
```

### The Widget Component

```tsx
function Text({ content }) {           // ← React controls
  return (
    <p
      className="..."
      style={{
        transform: 'translateY(var(--y, 0)px)',
        opacity: 'var(--opacity, 1)'   // ← Driver controls
      }}
    >
      {content}                         // ← React controls
    </p>
  )
}

// React owns the CONTENT (text, images, structure)
// Drivers own the PRESENTATION (position, opacity, scale)
// They coexist peacefully.
```

### Layout Shift Consideration

If content changes cause a layout shift (e.g., short text → long text):

```
POTENTIAL ISSUE:

Short text: "Hi"        →    Long text: "Hello World!"

Element height changes → could affect scroll calculations


SOLUTION:

Driver can listen for resize/layout changes and recalculate:

ResizeObserver on sections → update store → behaviours adapt
```

---

## 11. Example: Stacking Scroll

Your endless scroll with stacking/masking sections:

### Visual

```
ENDLESS SCROLL WITH STACKING/MASKING SECTIONS
══════════════════════════════════════════════

Viewport                          What's happening
┌────────────────────┐
│                    │
│    ┌──────────┐    │            Section 3 entering
│    │ Section 3│    │            --y: -200, --opacity: 0.3
│    │  (next)  │    │            clip-path: revealing
│    └──────────┘    │
│  ┌──────────────┐  │            Section 2 active
│  │  Section 2   │  │            --y: 0, --opacity: 1
│  │  (current)   │  │            --z: 10
│  └──────────────┘  │
│    ┌──────────┐    │            Section 1 exiting
│    │ Section 1│    │            --y: 200, --opacity: 0.5
│    │  (prev)  │    │            clip-path: masking out
│    └──────────┘    │
│                    │
└────────────────────┘
```

### Behaviour Compute

```typescript
function compute(state) {
  const { sectionProgress, sectionIndex } = state

  // Stack position based on scroll
  const y = (1 - sectionProgress) * viewportHeight

  // Opacity fade during transition
  const opacity = sectionProgress

  // Z-index for stacking order
  const z = sectionIndex * 10

  // Clip path for masking effect
  const clip = `inset(${(1 - sectionProgress) * 100}% 0 0 0)`

  return {
    '--y': y,
    '--opacity': opacity,
    '--z': z,
    '--clip': clip
  }
}
```

### CSS in Section

```css
.section {
  transform: translateY(calc(var(--y, 0) * 1px));
  opacity: var(--opacity, 1);
  z-index: var(--z, 0);
  clip-path: var(--clip, none);
  will-change: transform, opacity, clip-path;
}
```

### Mobile Adaptation

```
DESKTOP                           MOBILE
═══════                           ══════

Full stacking animation           Options:

- Sections slide over             1. Disable entirely
- Masking/clipping                   → Normal scroll, sections stack
- Parallax depth
                                  2. Simplified version
                                     → Fade transitions only
                                     → No masking (perf)

                                  3. Same but gentler
                                     → Reduced offset values
                                     → Slower transitions


The CONTENT stays the same.
The EXPERIENCE adapts.
```

---

## 12. The Mental Model

### Summary Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   SCHEMA          "The blueprint"      Pure TypeScript types │
│      │                                                       │
│      ▼                                                       │
│   CONTENT (L1)    "What"               Renders once          │
│      │                                                       │
│      │◄─── CSS Variables ───►                                │
│      │                                                       │
│      ▼                                                       │
│   EXPERIENCE (L2) "How"                Runs at 60fps         │
│      │                                                       │
│      ▼                                                       │
│   RENDERER        "Glue"               Schema → Components   │
│      │                                                       │
│      ▼                                                       │
│   PRESET          "Template"           Bundled config        │
│      │                                                       │
│      ▼                                                       │
│   SITE            "Instance"           Artist's data         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### The Key Insight

```
React handles STRUCTURE (once)
Drivers handle MOTION (continuously)
CSS Variables are the BRIDGE
```

### Quick Reference

| Question | Answer |
|----------|--------|
| Where is content defined? | L1: Widgets, Sections, Chrome |
| Where is animation defined? | L2: Behaviours, Drivers |
| How do they communicate? | CSS Variables |
| Where is state? | Zustand store, created by Mode |
| Where is store created? | SiteRenderer calls mode.createStore() |
| How is store distributed? | ExperienceProvider context |
| What about responsive? | L1: Tailwind, L2: viewport state |
| What if content changes? | React re-renders widget, animation continues |
| Can I use GSAP? | Yes, as trigger or driver |

---

## See Also

- [Philosophy](./core/philosophy.spec.md) - Core principles
- [Experience Layer](./layers/experience.spec.md) - L2 details
- [Content Layer](./layers/content.spec.md) - L1 details
- [Provider Spec](./components/experience/provider.spec.md) - Context distribution
- [Behaviour Spec](./components/experience/behaviour.spec.md) - Compute functions
