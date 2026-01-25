# Creativeshire Core Philosophy

> Immutable principles that govern the entire system. Read this first.

---

## The One Rule

**Content and Experience are separate concerns.**

| Layer | What it owns | Example |
|-------|--------------|---------|
| **Content (L1)** | What's on the page: structure, media, text | Widgets, Sections, Chrome |
| **Experience (L2)** | How the page feels: animation, interaction, state | Modes, Behaviours, Drivers |

Swap experiences without touching content. Edit content without breaking animations.

---

## The Contract

| Layer | Responsibility | Touches | Example |
|-------|----------------|---------|---------|
| **Schema** | Declares structure + behaviour intent | Data only | `{ type: 'Image', behaviour: 'depth-layer' }` |
| **React** | Renders once, registers refs | DOM structure, `data-*` | `<div ref={ref} data-behaviour="depth-layer">` |
| **Driver** | Computes + applies every frame | CSS variables only | `element.style.setProperty('--y', 50)` |
| **CSS** | Maps variables to visual output | `var()` functions | `transform: translateY(var(--y, 0))` |

**No layer crosses into another's domain.** React never writes CSS variables. Drivers never modify DOM structure.

### Why This Works

When React re-renders, drivers keep running. When drivers update, React stays idle. This separation enables 60fps animation without reconciler overhead.

```typescript
type CSSVariables = Record<`--${string}`, string | number>
```

The type system enforces separation. No accidental property clobbering.

---

## Sizing Model

| Type | Source | Layer | Example |
|------|--------|-------|---------|
| **Intrinsic** | Content determines size | Content (L1) | Video aspect ratio, text flow, image dimensions |
| **Extrinsic** | Context imposes size | Experience (L2) | Viewport height (100dvh), scroll-based positioning |

**Rule:** Widgets have intrinsic sizing. BehaviourWrappers impose extrinsic constraints.

---

## The Frame Pattern

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

L2 wrappers impose constraints. L1 content fills or sizes intrinsically. The widget never knows about viewport units, scroll position, or animation state.

---

## Non-Negotiables

1. **Widgets NEVER use viewport units** (`100vh`, `100vw`, `100dvh`)
2. **Widgets NEVER listen to scroll/resize events**
3. **Widgets NEVER import from `experience/`**
4. **Drivers ONLY set CSS variables** (never direct style properties)
5. **React components render ONCE** (driver handles animation)
6. **CSS variables have FALLBACKS** (`var(--y, 0)`)
7. **Features are STATIC** (no animation, no state changes)
8. **No `clipPath` for reveals** - position-based stacking only

---

## Animation Model

Position-based stacking only:

| Property | Purpose |
|----------|---------|
| `translateY()` | Positioning |
| `zIndex` | Stacking order |
| `opacity` | Fading |

---

## Key Insight

```
React handles structure.
Drivers handle motion.
They don't share style properties.
```

---

## Resolution Flow

```
Schema defines intent
        │
        ▼
Experience resolves wrappers
        │
        ▼
Mode provides state
        │
        ▼
Behaviour computes CSS vars
        │
        ▼
Driver applies to DOM
        │
        ▼
CSS maps vars to properties
```

---

## Experience vs Mode

| Concept | Definition | User Selects |
|---------|------------|--------------|
| **Experience** | Composite: wrapping rules + appended sections + constraints | Yes |
| **Mode** | State provider (scrollProgress, etc.) + default behaviours | No |
| **Behaviour** | Compute function: state → CSS variables | No |
| **BehaviourWrapper** | React component applying behaviour to content | No |

Users select Experiences. Experiences are atomic in the UI—not decomposable.

```
Experience (user-selectable)
    └─ Mode (provides state)
        └─ Behaviours (compute CSS vars)
            └─ BehaviourWrappers (apply to content)
```

Every site has an experience, even if minimal. The **stacking** experience applies no animation—sections stack vertically in DOM order.

---

## See Also

- [Extension Principle](./extension.spec.md) - Check → Extend → Create mindset
- [Platform Context](./platform.spec.md) - Creativeshire platform relationship
- [Content Layer](../layers/content.spec.md) - L1 primitives and constraints
- [Experience Layer](../layers/experience.spec.md) - L2 animation system
- [Interface Layer](../layers/interface.spec.md) - Platform ↔ Engine contract
- [Experience Contract](../components/experience/experience.spec.md) - Experience definitions
- [Widget Contract](../components/content/widget.spec.md) - Implementation rules
- [Behaviour Contract](../components/experience/behaviour.spec.md) - Compute function rules
