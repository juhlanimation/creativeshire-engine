# Layout Widget Spec

> Container widgets that arrange child widgets in spatial patterns.

## Purpose

Layout widgets are Content Layer widgets that arrange other widgets within them. They provide structural patterns (stacking, flexing, grids, carousels) that can be nested within sections or other layout widgets. Layout widgets render their `widgets` array recursively via WidgetRenderer.

**Key role:** Layout widgets enable complex nested structures inside sections.

## Layout Widget vs Section Layout

**Critical distinction:** Sections have a `layout` property for their direct structure. Layout widgets are nested INSIDE sections for deeper composition.

| Aspect | Section Layout | Layout Widget |
|--------|----------------|---------------|
| **What it is** | Property on SectionSchema | Widget type in widgets array |
| **Purpose** | Arranges section's direct children | Arranges nested content within section |
| **Declared via** | `layout: { type: 'flex', ... }` | `{ type: 'Grid', widgets: [...] }` |
| **Nesting depth** | Top level only | Can nest infinitely |
| **Examples** | Section uses flex to arrange 3 columns | Column contains a Grid widget for a gallery |

### When to Use Each

```
Section needs to arrange its direct widgets?
        |
        v
Use section's `layout` property
        |
        v
One of those widgets needs to arrange ITS children?
        |
        +-- YES --> Use Layout Widget (Grid, Flex, Stack, etc.)
        |
        +-- NO  --> Content widget (Text, Image, Button)
```

### Example: Combined Usage

```typescript
// Section uses flex layout for two columns
const section: SectionSchema = {
  id: 'portfolio',
  layout: { type: 'flex', direction: 'row', gap: 32 },
  widgets: [
    // Left column: Stack layout widget
    {
      type: 'Stack',
      widgets: [
        { type: 'Text', props: { content: 'Our Work' } },
        { type: 'Text', props: { content: 'Selected projects' } }
      ]
    },
    // Right column: Grid layout widget for gallery
    {
      type: 'Grid',
      props: { columns: 2, gap: 16 },
      widgets: [
        { type: 'Image', props: { src: '/project-1.jpg', alt: 'Project 1' } },
        { type: 'Image', props: { src: '/project-2.jpg', alt: 'Project 2' } },
        { type: 'Image', props: { src: '/project-3.jpg', alt: 'Project 3' } },
        { type: 'Image', props: { src: '/project-4.jpg', alt: 'Project 4' } }
      ]
    }
  ]
}
```

## Concepts

| Term | Definition |
|------|------------|
| Layout Widget | Widget that accepts `widgets` array and renders children |
| Recursive Rendering | WidgetRenderer calls itself for nested widgets |
| Container Props | Layout-specific props (gap, columns, direction) |
| Children Slots | Named areas in complex layouts (Tabs, Accordion) |

## Available Layout Widgets

| Widget | Purpose | Key Props |
|--------|---------|-----------|
| **Stack** | Vertical arrangement | `gap`, `align` |
| **Flex** | Flexible row/column layout | `direction`, `gap`, `align`, `justify`, `wrap` |
| **Grid** | CSS Grid arrangement | `columns`, `gap`, `minWidth` |
| **Carousel** | Horizontal scrolling container | `gap`, `snap`, `showControls` |
| **Tabs** | Tabbed content panels | `tabs` (array with label + widgets) |
| **Accordion** | Collapsible panels | `items` (array with title + widgets), `multiple` |
| **Masonry** | Pinterest-style layout | `columns`, `gap` |

## Folder Structure

```
creativeshire/components/content/widgets/layout/
├── {LayoutName}/
│   ├── index.tsx    # Component (default export)
│   ├── types.ts     # Props interface
│   └── styles.css   # Layout styles
├── types.ts         # Shared layout types
└── index.ts         # Barrel exports
```

## Interface

```typescript
// widgets/layout/types.ts
export interface LayoutWidgetProps {
  widgets?: WidgetSchema[]
  style?: CSSProperties
  className?: string
}

// widgets/layout/{Name}/types.ts
export interface {Name}Props extends LayoutWidgetProps {
  gap?: number | string
  // Layout-specific props
}

// widgets/layout/{Name}/index.tsx
export default function {Name}(props: {Name}Props): JSX.Element
```

### Common Layout Props

```typescript
// Shared across layout widgets
interface CommonLayoutProps {
  gap?: number | string          // Space between children
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
}

// Stack-specific
interface StackProps extends CommonLayoutProps {
  // Implicitly direction: column
}

// Flex-specific
interface FlexProps extends CommonLayoutProps {
  direction?: 'row' | 'column'
  wrap?: boolean | 'reverse'
}

// Grid-specific
interface GridProps extends CommonLayoutProps {
  columns?: number | 'auto-fit' | 'auto-fill'
  minWidth?: string             // For auto-fit/fill
  rows?: number
}

// Carousel-specific
interface CarouselProps {
  gap?: number | string
  snap?: 'start' | 'center' | 'none'
  showControls?: boolean
  showIndicators?: boolean
}

// Tabs-specific
interface TabsProps {
  tabs: Array<{
    label: string
    widgets: WidgetSchema[]
  }>
  defaultTab?: number
}

// Accordion-specific
interface AccordionProps {
  items: Array<{
    title: string
    widgets: WidgetSchema[]
  }>
  multiple?: boolean            // Allow multiple open
  defaultOpen?: number[]
}

// Masonry-specific
interface MasonryProps {
  columns?: number
  gap?: number | string
}
```

## Children Handling

Layout widgets render their `widgets` array via WidgetRenderer, enabling recursive nesting.

```typescript
// widgets/layout/Stack/index.tsx
import { memo } from 'react'
import { WidgetRenderer } from '@/creativeshire/renderer/WidgetRenderer'
import { cn } from '@/lib/utils'
import type { StackProps } from './types'
import './styles.css'

const Stack = memo(function Stack({ widgets, gap, align, style, className }: StackProps) {
  return (
    <div
      className={cn("stack-widget", className)}
      style={{
        gap: typeof gap === 'number' ? `${gap}px` : gap,
        alignItems: align,
        ...style
      }}
    >
      {widgets?.map((widget, index) => (
        <WidgetRenderer key={widget.id ?? index} schema={widget} />
      ))}
    </div>
  )
})

export default Stack
```

### Recursive Nesting Example

```typescript
// Grid containing Stacks containing content
{
  type: 'Grid',
  props: { columns: 3, gap: 24 },
  widgets: [
    {
      type: 'Stack',
      props: { gap: 8 },
      widgets: [
        { type: 'Image', props: { src: '/card-1.jpg', alt: 'Card 1' } },
        { type: 'Text', props: { content: 'Card Title' } },
        { type: 'Text', props: { content: 'Description text' } }
      ]
    },
    // ... more Stack cards
  ]
}
```

## Rules

> Layout widgets inherit all rules from [Widget Spec](./widget.spec.md#rules). Additional layout-specific rules below.

### Must (Layout-Specific)

1. Accept `widgets` array prop
2. Render children via WidgetRenderer
3. Wrap in `memo()` for performance
4. Handle empty `widgets` array gracefully

### Must Not (Layout-Specific)

1. Direct children via `children` prop - use `widgets` array
2. Infinite recursion guards in render - trust schema validation

## Validation Rules

> Inherits rules 1-8 from [widget.validator.ts](./widget.spec.md#validation-rules). Additional layout-specific rules:

| # | Rule | Function | Files |
|---|------|----------|-------|
| 3 | Accepts widgets prop | `checkWidgetsProp` | `types.ts` |
| 4 | Uses WidgetRenderer | `checkUsesWidgetRenderer` | `.tsx` |
| 10 | Wrapped in memo() | `checkMemoWrapper` | `.tsx` |
| 11 | No children prop | `checkNoChildrenProp` | `types.ts` |

## CSS Variables

> Layout widgets READ these (set by driver). Never SET them.

| Variable | Purpose | Fallback |
|----------|---------|----------|
| `--y` | Vertical offset | `0` |
| `--opacity` | Transparency | `1` |
| `--scale` | Transform scale | `1` |

```css
.{name}-widget {
  transform: translateY(calc(var(--y, 0) * 1px)) scale(var(--scale, 1));
  opacity: var(--opacity, 1);
}

.{name}-widget[data-behaviour] {
  will-change: transform, opacity;
}
```

## Template

### Stack Layout Widget

```typescript
// widgets/layout/Stack/types.ts
import { WidgetSchema } from '@/creativeshire/schema'
import { CSSProperties } from 'react'

export interface StackProps {
  widgets?: WidgetSchema[]
  gap?: number | string
  align?: 'start' | 'center' | 'end' | 'stretch'
  style?: CSSProperties
  className?: string
}
```

```typescript
// widgets/layout/Stack/index.tsx
import { memo } from 'react'
import { WidgetRenderer } from '@/creativeshire/renderer/WidgetRenderer'
import { cn } from '@/lib/utils'
import type { StackProps } from './types'
import './styles.css'

const Stack = memo(function Stack({
  widgets,
  gap = 0,
  align = 'stretch',
  style,
  className
}: StackProps) {
  return (
    <div
      className={cn("stack-widget", className)}
      style={{
        gap: typeof gap === 'number' ? `${gap}px` : gap,
        alignItems: align,
        ...style
      }}
    >
      {widgets?.map((widget, index) => (
        <WidgetRenderer key={widget.id ?? index} schema={widget} />
      ))}
    </div>
  )
})

export default Stack
```

```css
/* widgets/layout/Stack/styles.css */
.stack-widget {
  display: flex;
  flex-direction: column;
  transform: translateY(calc(var(--y, 0) * 1px));
  opacity: var(--opacity, 1);
}

.stack-widget[data-behaviour] {
  will-change: transform, opacity;
}
```

### Grid Layout Widget

```typescript
// widgets/layout/Grid/types.ts
import { WidgetSchema } from '@/creativeshire/schema'
import { CSSProperties } from 'react'

export interface GridProps {
  widgets?: WidgetSchema[]
  columns?: number | 'auto-fit' | 'auto-fill'
  gap?: number | string
  minWidth?: string
  style?: CSSProperties
  className?: string
}
```

```typescript
// widgets/layout/Grid/index.tsx
import { memo, useMemo } from 'react'
import { WidgetRenderer } from '@/creativeshire/renderer/WidgetRenderer'
import { cn } from '@/lib/utils'
import type { GridProps } from './types'
import './styles.css'

const Grid = memo(function Grid({
  widgets,
  columns = 3,
  gap = 16,
  minWidth = '250px',
  style,
  className
}: GridProps) {
  const gridStyle = useMemo(() => {
    const gapValue = typeof gap === 'number' ? `${gap}px` : gap

    if (typeof columns === 'number') {
      return {
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: gapValue,
        ...style
      }
    }

    // auto-fit or auto-fill
    return {
      gridTemplateColumns: `repeat(${columns}, minmax(${minWidth}, 1fr))`,
      gap: gapValue,
      ...style
    }
  }, [columns, gap, minWidth, style])

  return (
    <div className={cn("grid-widget", className)} style={gridStyle}>
      {widgets?.map((widget, index) => (
        <WidgetRenderer key={widget.id ?? index} schema={widget} />
      ))}
    </div>
  )
})

export default Grid
```

```css
/* widgets/layout/Grid/styles.css */
.grid-widget {
  display: grid;
  transform: translateY(calc(var(--y, 0) * 1px));
  opacity: var(--opacity, 1);
}

.grid-widget[data-behaviour] {
  will-change: transform, opacity;
}
```

## Anti-Patterns

### Don't: Use children prop

```typescript
// WRONG - Layout widgets use widgets array, not children
function Stack({ children }: { children: ReactNode }) {
  return <div>{children}</div>
}

// CORRECT - Use widgets array and WidgetRenderer
function Stack({ widgets }: StackProps) {
  return (
    <div>
      {widgets?.map((widget, i) => (
        <WidgetRenderer key={widget.id ?? i} schema={widget} />
      ))}
    </div>
  )
}
```

**Why:** Schema-driven rendering requires `widgets` array. `children` breaks the renderer pattern.

### Don't: Add scroll listeners for Carousel

```typescript
// WRONG
useEffect(() => {
  const handleScroll = () => setActiveSlide(...)
  containerRef.current?.addEventListener('scroll', handleScroll)
}, [])
```

**Why:** Scroll handling belongs to triggers in L2, or use native CSS scroll-snap.

### Don't: Forget memoization with nested children

```typescript
// WRONG - Re-renders entire tree on any parent update
function Grid({ widgets }: GridProps) {
  return <div>{...}</div>
}

// CORRECT - Memo prevents unnecessary re-renders
const Grid = memo(function Grid({ widgets }: GridProps) {
  return <div>{...}</div>
})
```

**Why:** Layout widgets are often deeply nested. Memo prevents cascade re-renders.

### Don't: Inline style objects

```typescript
// WRONG - Creates new object every render
<div style={{ gap: gap, alignItems: align }}>

// CORRECT - Memoize style objects
const style = useMemo(() => ({
  gap: typeof gap === 'number' ? `${gap}px` : gap,
  alignItems: align
}), [gap, align])

<div style={style}>
```

**Why:** Inline objects break memo comparison for child components.

### Do: Handle empty widgets gracefully

```typescript
// Correct - No crash on empty/undefined
{widgets?.map((widget, index) => (
  <WidgetRenderer key={widget.id ?? index} schema={widget} />
))}
```

**Why:** Schema may have empty widgets array. Optional chaining prevents errors.

## Performance

### Memoization Strategy

Layout widgets should be wrapped in `memo()` because:

1. They're frequently nested, amplifying re-render cost
2. `widgets` array reference often stays stable
3. CSS variables handle animation (no props updates)

```typescript
const Stack = memo(function Stack({ widgets, gap, align }: StackProps) {
  // Memoize computed styles
  const style = useMemo(() => ({
    gap: typeof gap === 'number' ? `${gap}px` : gap,
    alignItems: align
  }), [gap, align])

  return (
    <div className="stack-widget" style={style}>
      {widgets?.map((widget, index) => (
        <WidgetRenderer key={widget.id ?? index} schema={widget} />
      ))}
    </div>
  )
})
```

### Key Strategy for Children

Always provide stable keys:

```typescript
// Best: Use widget.id when available
key={widget.id ?? index}

// Good: Index works when order is stable
key={index}

// Bad: No key (React warning, poor reconciliation)
// widgets?.map(widget => <WidgetRenderer schema={widget} />)
```

### Nested Performance

Deeply nested layouts (Grid > Stack > Flex) benefit from:

1. `memo()` on each layout widget
2. Stable `widgets` array references from schema
3. CSS variables for animation (not prop drilling)
4. Memoized style objects

## Testing

> **Browser-based validation.** Layout widgets render spatial arrangements - validate visually.

### Testing Approach

| Aspect | Method | Why |
|--------|--------|-----|
| Layout rendering | Browser / Storybook | CSS layout issues not caught by unit tests |
| Recursive nesting | Visual inspection | Verify children render correctly |
| Props application | Browser DevTools | Check computed styles |
| Empty state | Visual test | Verify no crash on empty widgets |
| Responsive behavior | Browser resize | Check layout adapts |

### What to Test

| Test | Method | Why |
|------|--------|-----|
| Renders children | Browser | Core functionality |
| Gap applies | DevTools | Layout prop works |
| Nested layouts work | Visual | Recursive rendering |
| Empty array handled | Browser | No crash |
| Memo prevents re-render | React DevTools | Performance |

### Validation Checklist

When building a layout widget, verify:

- [ ] Renders in browser without errors
- [ ] Children render via WidgetRenderer
- [ ] Layout props apply (gap, columns, align)
- [ ] CSS variables have fallbacks
- [ ] Empty `widgets` array doesn't crash
- [ ] `memo()` wrapper on default export
- [ ] Props interface exported from `types.ts`
- [ ] No experience layer imports
- [ ] Works with nested layout widgets

### Browser Validation

```bash
# Start dev server
npm run dev

# Navigate to page using the layout widget
# Or use Storybook if configured
npm run storybook
```

### Definition of Done

A layout widget is complete when:

- [ ] Renders correctly in browser
- [ ] No console errors/warnings
- [ ] Children render recursively
- [ ] Layout props function correctly
- [ ] TypeScript compiles without errors
- [ ] Validator passes: `npm run validate -- widgets/layout/{Name}`

---

## Accessibility

### Focus Order

Layout widgets must preserve logical focus order:

```typescript
// Grid renders items in DOM order = keyboard nav order
{widgets?.map((widget, index) => (
  <WidgetRenderer key={widget.id ?? index} schema={widget} />
))}
```

### Tabs Accessibility

Tabs require ARIA patterns:

```typescript
// widgets/layout/Tabs/index.tsx
const Tabs = memo(function Tabs({ tabs, defaultTab = 0 }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  return (
    <div className="tabs-widget">
      <div role="tablist" className="tabs-widget__list">
        {tabs.map((tab, index) => (
          <button
            key={index}
            role="tab"
            aria-selected={index === activeTab}
            aria-controls={`panel-${index}`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, index) => (
        <div
          key={index}
          role="tabpanel"
          id={`panel-${index}`}
          hidden={index !== activeTab}
        >
          {tab.widgets.map((widget, i) => (
            <WidgetRenderer key={widget.id ?? i} schema={widget} />
          ))}
        </div>
      ))}
    </div>
  )
})
```

### Accordion Accessibility

```typescript
// widgets/layout/Accordion/index.tsx
const Accordion = memo(function Accordion({ items, multiple }: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  const toggle = (index: number) => {
    setOpenItems(prev => {
      const next = new Set(multiple ? prev : [])
      if (prev.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  return (
    <div className="accordion-widget">
      {items.map((item, index) => (
        <div key={index} className="accordion-widget__item">
          <button
            aria-expanded={openItems.has(index)}
            aria-controls={`accordion-panel-${index}`}
            onClick={() => toggle(index)}
          >
            {item.title}
          </button>
          <div
            id={`accordion-panel-${index}`}
            role="region"
            hidden={!openItems.has(index)}
          >
            {item.widgets.map((widget, i) => (
              <WidgetRenderer key={widget.id ?? i} schema={widget} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
})
```

---

## Integration

| Interacts With | Direction | How |
|----------------|-----------|-----|
| `schema/widget.ts` | Imports | WidgetSchema type |
| `renderer/WidgetRenderer` | Uses | Renders children |
| `content/widgets/` | Contains | Nested widgets |
| `experience/behaviours` | Reads | CSS variables via driver |
| `sections/` | Nested in | Part of section widgets array |

## Validator

Validated by: `./layout-widget.validator.ts`

Rules in "Must/Must Not" map 1:1 to validator checks.

---

## Reference

See also:
- [Widget Spec](./widget.spec.md) - Base widget rules that layout widgets inherit
- [Widget Composite Spec](./widget-composite.spec.md) - Factory patterns using layout widgets
- [Section Spec](./section.spec.md) - Section layout vs layout widgets
