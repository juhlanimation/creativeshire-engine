# Layer Contracts

> Defines what each layer owns and the interfaces between them. For foundational concepts, see [Philosophy](./philosophy.spec.md).

---

## Layer Ownership

| Layer | Owns | Cannot Touch |
|-------|------|--------------|
| **Schema** | Type definitions, validation | Implementation |
| **Content (L1)** | Widgets, sections, chrome, features | Animation, drivers, CSS variables |
| **Experience (L2)** | Modes, behaviours, drivers, triggers | Widget internals, DOM structure |
| **Renderer** | Schema interpretation, component composition | Business logic, direct styling |
| **Site** | Instance data, content values | Engine internals |

---

## Layer Responsibility Matrix

| Responsibility | Schema | Content (L1) | Experience (L2) | Renderer |
|----------------|--------|--------------|-----------------|----------|
| Type definitions | Yes | - | - | - |
| Widget components | - | Yes | - | - |
| Section structure | - | Yes | - | - |
| Features (static styling) | - | Yes | - | - |
| Behaviours (compute functions) | - | - | Yes | - |
| Drivers (DOM updates) | - | - | Yes | - |
| CSS variables | - | - | Yes | - |
| Schema-to-component mapping | - | - | - | Yes |
| Behaviour wrapping | - | - | - | Yes |

---

## CSS Variable Contract

Drivers communicate with CSS via variables only. The type system enforces this separation.

```typescript
// creativeshire/experience/behaviours/types.ts
type CSSVariables = Record<`--${string}`, string | number>

compute: (state: BehaviourState, options: Options) => CSSVariables
```

### Rules

| Rule | Reason |
|------|--------|
| Variable names start with `--` | Type-safe enforcement, no property clobbering |
| Values are strings or numbers | CSS compatibility |
| CSS uses `var(--name, fallback)` | SSR safety |
| Fallbacks are REQUIRED | Prevents layout shift before hydration |

### Example

```typescript
// experience/behaviours/depth-layer/index.ts
export const depthLayerBehaviour: Behaviour = {
  id: 'depth-layer',
  requires: ['scrollProgress'],

  compute: (state, options) => ({
    '--depth-y': state.scrollProgress * (options.depth ?? 50)
  }),

  cssTemplate: `
    transform: translateY(calc(var(--depth-y, 0) * 1px));
    will-change: transform;
  `
}
```

The `compute` function returns CSS variables. The `cssTemplate` maps variables to properties.

---

## What Each Layer Can and Cannot Do

### Content Layer (L1)

| Can | Cannot |
|-----|--------|
| Render static structure | Import from `experience/` |
| Apply features (spacing, typography) | Reference scroll position |
| Accept children props | Apply CSS variables directly |
| Use intrinsic sizing | Use viewport units (`100vh`, `100dvh`) |
| Fill parent containers | Listen to scroll/resize events |
| Set `data-widget-type` via renderer | Use `will-change` |

### Experience Layer (L2)

| Can | Cannot |
|-----|--------|
| Define behaviours (compute functions) | Modify DOM structure |
| Set CSS variables via drivers | Re-render React components |
| Listen to browser events | Access widget props directly |
| Impose extrinsic constraints | Set static styles |
| Wrap content with BehaviourWrapper | Import from `content/widgets/` internals |

### Renderer

| Can | Cannot |
|-----|--------|
| Map schema to components | Contain business logic |
| Resolve behaviours from mode | Modify schema |
| Wrap widgets with BehaviourWrapper | Apply styles directly |
| Register refs with driver | Compute animation values |

---

## Data Flow

```
Schema (declaration)
    |
    v
Renderer (interpretation)
    |
    v
React Component (structure)
    |
    v
Driver registration (refs)
    |
    v
Event (scroll, resize, etc.)
    |
    v
Trigger (updates store)
    |
    v
Driver (reads store)
    |
    v
Behaviour.compute()
    |
    v
CSS Variables (--y, --opacity)
    |
    v
Visual Output
```

React renders structure once. Drivers handle motion continuously. They never share style properties.

---

## SSR Fallback Pattern

CSS always declares fallbacks for SSR safety. Before hydration, fallback values apply. After driver registers, computed values apply.

```css
/* content/widgets/primitives/Image/styles.css */
.image-widget {
  transform: translateY(calc(var(--y, 0) * 1px));
  opacity: var(--opacity, 1);
  clip-path: inset(0 0 var(--clip-bottom, 0%) 0);
}
```

| Variable | Fallback | Before Hydration | After Hydration |
|----------|----------|------------------|-----------------|
| `--y` | `0` | No offset | Scroll-computed offset |
| `--opacity` | `1` | Fully visible | Scroll-computed opacity |
| `--clip-bottom` | `0%` | No clipping | Scroll-computed clip |

### Implementation

```typescript
// experience/behaviours/BehaviourWrapper.tsx
function BehaviourWrapper({ behaviour, options, children }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const driver = useDriver()

  useEffect(() => {
    if (!ref.current) return
    driver.register(id, ref.current, behaviour, options)
    return () => driver.unregister(id)
  }, [behaviour.id])

  return (
    <div ref={ref} style={parseCssTemplate(behaviour.cssTemplate)}>
      {children}
    </div>
  )
}
```

The wrapper applies `cssTemplate` immediately. CSS variables start at fallback values. Driver updates them after registration.

---

## Contract Violations

| Violation | Symptom | Fix |
|-----------|---------|-----|
| Widget imports `experience/` | Build error or tight coupling | Move animation to behaviour |
| Widget uses `100vh` | Layout breaks without wrapper | Let BehaviourWrapper impose size |
| React sets `--variable` | Style clobbering | Move to driver |
| Driver modifies DOM structure | Reconciliation conflicts | Driver sets CSS variables only |
| CSS missing fallback | Layout shift on hydration | Add `var(--x, fallback)` |
| Behaviour returns non-CSS property | Type error | Return `--prefixed` keys only |

---

## Debugging

### Inspect CSS Variables

1. Open DevTools, select Elements panel
2. Find element with `data-behaviour` attribute
3. View computed styles
4. CSS variables update in real-time as you scroll

### Verify Layer Separation

```bash
# Check for contract violations
grep -r "100vh\|100dvh" creativeshire/content/
grep -r "setProperty" creativeshire/content/
grep -r "from.*experience" creativeshire/content/widgets/
```

No results indicates clean separation.

### Trace Animation Issues

1. Confirm behaviour registered: check `data-behaviour` attribute exists
2. Confirm driver running: log inside `compute()` function
3. Confirm CSS mapping: inspect `cssTemplate` in DevTools
4. Confirm fallback present: remove driver, verify layout stable

---

## See Also

- [Philosophy](./philosophy.spec.md) - Foundational concepts
- [Content Layer](../layers/content.spec.md) - L1 primitives
- [Experience Layer](../layers/experience.spec.md) - L2 animation system
