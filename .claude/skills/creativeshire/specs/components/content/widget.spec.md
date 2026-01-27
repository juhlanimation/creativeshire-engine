# Widget Spec

> Atomic content units that render static structure and fill their containers.

## Purpose

Widgets hold content: text, images, video, buttons, badges. They render once, fill their parent container, and stay idle. Animation, scroll behavior, and viewport sizing belong to the Experience Layer (L2) via `BehaviourWrapper`.

## Concepts

| Term | Definition |
|------|------------|
| Widget | Atomic content component with single responsibility |
| Content Widget | Renders visual content (text, image, video) |
| Layout Widget | Arranges child widgets (Stack, Flex, Grid) |
| Features | Static styling props (spacing, typography, background) |
| CSS Variable Contract | Widgets READ CSS variables set by driver; never SET them |

## Folder Structure

```
creativeshire/components/content/widgets/
├── content/{WidgetName}/
│   ├── index.tsx    # Component (default export)
│   ├── types.ts     # Props interface (exported)
│   └── styles.css   # CSS with var() fallbacks
├── layout/{WidgetName}/
│   └── (same structure)
├── types.ts         # Shared widget types
└── index.ts         # Barrel exports
```

## Interface

```typescript
// widgets/types.ts
export interface WidgetProps {
  features?: FeatureSet
  children?: ReactNode  // Layout widgets only
}

// widgets/content/{Name}/types.ts
export interface {Name}Props extends WidgetProps {
  content?: string
  // Widget-specific props
}

// widgets/content/{Name}/index.tsx
export default function {Name}(props: {Name}Props): JSX.Element
```

## Rules

### Must

1. Default export from `index.tsx`
2. Props interface exported from `types.ts`
3. CSS variables have fallbacks: `var(--name, fallback)`
4. Fill parent container via intrinsic sizing
5. Features prop is optional
6. Descriptive className on root element

### Must Not

1. Viewport units (`100vh`, `100vw`, `100dvh`) - BehaviourWrapper handles sizing
2. Scroll/resize listeners - triggers handle this in L2
3. Imports from `experience/` - layer violation
4. `position: fixed/sticky` - BehaviourWrapper handles positioning
5. Direct `will-change` declarations - use `[data-behaviour]` selectors only
6. Set CSS variables - only read them
7. Use `&&` for conditional rendering with numbers (use ternary instead)
8. Animate SVG elements directly (wrap in div for hardware acceleration)
9. Create RegExp inside render (hoist to module scope or useMemo)

## Validation Rules

> Each rule maps 1:1 to `widget.validator.ts`

| # | Rule | Function | Files |
|---|------|----------|-------|
| 1 | Default export required | `checkDefaultExport` | `.tsx` |
| 2 | Props interface exported | `checkPropsExported` | `types.ts` |
| 3 | No scroll/resize listeners | `checkNoScrollListeners` | `.tsx`, `.ts` |
| 4 | No fixed/sticky position | `checkNoPositionFixed` | `.tsx`, `.css` |
| 5 | No viewport units | `checkNoViewportUnits` | `.tsx`, `.css` |
| 6 | No experience imports | `checkNoExperienceImports` | `.tsx`, `.ts` |
| 7 | CSS var fallbacks | `checkCssVariableFallbacks` | `.tsx`, `.css` |
| 8 | No direct will-change | `checkNoDirectWillChange` | `.tsx`, `.css` |
| 12 | Use ternary for conditional numbers | `checkNoAndWithNumbers` | `.tsx` |
| 13 | SVG animations via wrapper | `checkSvgAnimationWrapper` | `.tsx`, `.css` |
| 14 | RegExp hoisted or memoized | `checkRegExpHoisted` | `.tsx` |

## CSS Variables

> Widgets READ these (set by driver). Never SET them.

| Variable | Purpose | Fallback |
|----------|---------|----------|
| `--y` | Vertical offset | `0` |
| `--opacity` | Transparency | `1` |
| `--clip-bottom` | Clip percentage | `0%` |

```css
.{name}-widget {
  transform: translateY(calc(var(--y, 0) * 1px));
  opacity: var(--opacity, 1);
}

.{name}-widget[data-behaviour] {
  will-change: transform, opacity;
}
```

## Template

```typescript
// {Name}/types.ts
export interface {Name}Props {
  content: string
  features?: FeatureSet
}
```

```typescript
// {Name}/index.tsx
import { {Name}Props } from './types'
import './styles.css'

export default function {Name}({ content }: {Name}Props) {
  return <div className="{name}-widget">{content}</div>
}
```

```css
/* {Name}/styles.css */
.{name}-widget {
  transform: translateY(calc(var(--y, 0) * 1px));
  opacity: var(--opacity, 1);
}

.{name}-widget[data-behaviour="fade-on-scroll"] {
  will-change: opacity;
}
```

## Anti-Patterns

### Don't: Add scroll listeners

```typescript
// WRONG
useEffect(() => {
  window.addEventListener('scroll', handleScroll)
}, [])
```

**Why:** Scroll handling belongs to triggers in L2.

### Don't: Use viewport units

```typescript
// WRONG
<div style={{ height: '100vh' }}>
```

**Why:** BehaviourWrapper imposes viewport sizing, not the widget.

### Don't: Import from experience

```typescript
// WRONG
import { useScrollProgress } from '@/creativeshire/experience/triggers'
```

**Why:** Widgets become coupled to scroll state.

### Do: Use CSS variables with fallbacks

```css
/* Correct */
.text-widget {
  transform: translateY(calc(var(--y, 0) * 1px));
  opacity: var(--opacity, 1);
}
```

**Why:** Fallbacks ensure SSR works. Driver updates after hydration.

## Performance

### Memoization

Widgets are pure content containers. Wrap with `React.memo()` to prevent unnecessary re-renders when parent updates but props haven't changed.

```typescript
// {Name}/index.tsx
import { memo } from 'react'
import type { {Name}Props } from './types'
import './styles.css'

function {Name}({ content, features }: {Name}Props) {
  return (
    <div className="{name}-widget">
      {content}
    </div>
  )
}

export default memo({Name})
```

### Why Memoize

1. Widgets receive props from parent (Section, Renderer)
2. Parent re-renders propagate to all children
3. `memo()` enables early bailout when props unchanged
4. Scroll/animation updates don't re-render widgets (CSS variables, not props)

### Validation Rules

| # | Rule | Check |
|---|------|-------|
| 9 | Widget exports wrapped in memo() | Default export uses memo() |
| 10 | Props are serializable | No functions in props |
| 11 | No inline objects in render | Use useMemo for objects |

### Memoization Anti-Patterns

#### Don't: Inline object props

```typescript
// WRONG - Creates new object every render, breaks memo
<Widget features={{ spacing: { p: 4 } }} />

// CORRECT - Stable reference
const features = useMemo(() => ({ spacing: { p: 4 } }), [])
<Widget features={features} />
```

#### Don't: Pass functions as props

```typescript
// WRONG - Functions aren't serializable, breaks RSC
<Widget onClick={() => console.log('clicked')} />

// CORRECT - Handle events in BehaviourWrapper or use event delegation
<BehaviourWrapper behaviour="clickable" onAction={handleClick}>
  <Widget />
</BehaviourWrapper>
```

#### Don't: Forget memo on frequently rendered widgets

```typescript
// WRONG - Re-renders on every parent update
export default function Text({ content }: TextProps) {
  return <p>{content}</p>
}

// CORRECT - Skips re-render if props unchanged
export default memo(function Text({ content }: TextProps) {
  return <p>{content}</p>
})
```

#### Don't: Use && with numbers for conditional rendering

```typescript
// WRONG - Renders "0" when count is 0
{count && <Badge count={count} />}

// CORRECT - Use ternary for explicit boolean check
{count > 0 ? <Badge count={count} /> : null}
```

#### Don't: Animate SVG elements directly

```tsx
// WRONG - No hardware acceleration
<svg className="animate-spin">...</svg>

// CORRECT - Wrap in div for GPU acceleration
<div className="animate-spin">
  <svg>...</svg>
</div>
```

#### Don't: Create static JSX in render

```typescript
// WRONG - Recreates element every render
function Container() {
  return <>{loading && <Skeleton className="h-20" />}</>
}

// CORRECT - Hoist static elements
const skeleton = <div className="animate-pulse h-20 bg-gray-200" />
function Container() {
  return <>{loading && skeleton}</>
}
```

---

## Integration

| Interacts With | Direction | How |
|----------------|-----------|-----|
| `schema/widget.ts` | Imports | Type definitions |
| `experience/behaviours` | Reads | CSS variables via driver |
| `renderer/WidgetRenderer` | Rendered by | Instantiated from schema |
| `features/` | Receives | Static styling via props |

## Validator

Validated by: `./widget.validator.ts`

Rules in "Must/Must Not" map 1:1 to validator checks.
