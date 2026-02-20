# Widget Spec

> Atomic content units that render static structure and fill their containers.

## Purpose

Widgets hold content: text, images, video, buttons, badges. They render once, fill their parent container, and stay idle. Animation, scroll behavior, and viewport sizing belong to the Experience Layer (L2) via `BehaviourWrapper`.

## Widget vs Widget Composite

**Critical distinction:** Widgets are React components. Widget Composites are factory functions.

| Aspect | Widget | Widget Composite |
|--------|--------|------------------|
| **What it is** | React component | Factory function |
| **Returns** | JSX (renders DOM) | `WidgetSchema` (data) |
| **File extension** | `index.tsx` | `index.ts` (no JSX) |
| **Registered** | Yes, in widgetRegistry | No, just a function |
| **Creates** | New visual primitive | Pattern from existing widgets |

### When to Create Which

```
Need a reusable visual pattern?
        │
        ▼
Can it be expressed as a TREE of existing widgets?
        │
        ├─ YES → Widget Composite (factory function)
        │        Example: ProjectCard = Stack + Image + Text + Badge
        │
        └─ NO  → New Widget (React component)
                 Needs new DOM element, CSS, or browser API
                 Example: Image needs <img>, Video needs <video>
```

### Examples

**Create a Widget when:**
- Need `<img>` element → Image widget
- Need `<video>` element → Video widget
- Need `<button>` with states → Button widget
- Need SVG rendering → Icon widget

**Create a Widget Composite when:**
- ProjectCard = Stack containing Image + Text + Badge
- TeamMember = Stack containing Image + Text + Text
- PricingTier = Stack containing Text + Text + Button

See [Widget Composite Spec](./widget-composite.spec.md) for composite patterns.

## Concepts

| Term | Definition |
|------|------------|
| Widget | React component with single visual responsibility |
| Widget Composite | Factory function returning WidgetSchema from existing widgets |
| Content Widget | Renders visual content (text, image, video) |
| Layout Widget | Arranges child widgets (Stack, Flex, Grid) |
| CSS Variable Contract | Widgets READ CSS variables set by driver; never SET them |

## Folder Structure

```
engine/content/widgets/
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
  style?: CSSProperties    // Inline styles passed directly
  className?: string       // Tailwind/CSS classes
  children?: ReactNode     // Layout widgets only
}

// widgets/primitives/{Name}/types.ts
export interface {Name}Props extends WidgetProps {
  content?: string
  // Widget-specific props
}

// widgets/primitives/{Name}/index.tsx
export default function {Name}(props: {Name}Props): JSX.Element
```

## Rules

### Must

1. Default export from `index.tsx`
2. Props interface exported from `types.ts`
3. CSS variables have fallbacks: `var(--name, fallback)`
4. Fill parent container via intrinsic sizing
5. Accept `style` and `className` props for styling
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
10. Define CSS transitions in widget styles - effects handle this in L2
11. Calculate from CSS variables (e.g., `calc(var(--flag) * -100%)`) - behaviour outputs final values

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
| 18 | No CSS transitions in widget styles | `checkNoTransitions` | `.css` |
| 19 | No calc() from CSS variables | `checkNoCalcFromVars` | `.css` |

## Event Triggers & Action Dispatch

Widgets can emit discrete events via the `on` field in their schema. These are wired to the action system (L1), separate from L2 behaviours.

### Widget Meta: `triggers`

Widget metas declare which DOM events the widget type can emit:

```typescript
// primitives/Link/meta.ts
triggers: ['mouseenter', 'mouseleave', 'click']
```

### Widget Schema: `on`

Widget instances wire events to action IDs:

```typescript
on: {
  click: 'modal.open',
  mouseenter: 'cursorLabelWatch.show',
  mouseleave: 'cursorLabelWatch.hide',
}
// Array syntax for multiple actions:
on: { click: ['modal.open', 'analytics.track'] }
// Object form with schema params (payload overrides):
on: { click: { action: 'modal.open', params: { animationType: 'expand' } } }
```

WidgetRenderer translates `on` entries to React event props and dispatches to the action registry. Each action payload includes the source DOM element and event name. Schema `params` are merged under widget-provided payload values.

See: [action-system.spec.md](action-system.spec.md)

## CSS Variables

> Widgets READ these (set by driver). Never SET them. Never CALCULATE from them.

| Variable | Purpose | Fallback |
|----------|---------|----------|
| `--y` | Vertical offset | `0` |
| `--opacity` | Transparency | `1` |
| `--clip-bottom` | Clip percentage | `0%` |

```css
.{name}-widget {
  transform: translateY(var(--y, 0));  /* Just apply, don't calculate */
  opacity: var(--opacity, 1);
}

.{name}-widget[data-behaviour] {
  will-change: transform, opacity;
}
```

## Animation Hooks (data-effect)

Widgets that support effects use `data-effect` and `data-*` attributes to mark animatable elements. This keeps animation knowledge in L2 (Experience) while L1 (Content) stays pure structure.

### Pattern

```tsx
// Widget marks elements with data attributes
<div className="contact-prompt" data-effect="text-reveal">
  <span data-reveal="primary">{promptText}</span>
  <span data-reveal="secondary">{email}</span>
</div>
```

The widget CSS contains **only layout**—no transitions or transforms:

```css
/* Widget CSS - structure only */
.contact-prompt { display: flex; }
.contact-prompt [data-reveal="secondary"] {
  position: absolute;
  top: 100%;
}
```

The **effect CSS** (in L2) defines animations using CSS variables:

```css
/* Effect CSS (experience/effects/text-reveal.css) */
[data-effect="text-reveal"] [data-reveal] {
  transform: translateY(var(--reveal-y, 0));
  transition: transform var(--reveal-duration, 400ms) var(--reveal-easing, ease-in-out);
}
```

### Why This Pattern?

| Approach | Animation knowledge in | Reusable? |
|----------|----------------------|-----------|
| Widget defines transitions | L1 (Content) | No |
| Effect defines transitions | L2 (Experience) | Yes |

With `data-effect`, the same effect can be applied to any widget that uses the convention. The widget stays pure content.

## Template

```typescript
// {Name}/types.ts
export interface {Name}Props {
  content: string
  style?: CSSProperties
  className?: string
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

## Performance

### Memoization

Widgets are pure content containers. Wrap with `React.memo()` to prevent unnecessary re-renders.

```typescript
// {Name}/index.tsx
import { memo } from 'react'
import type { {Name}Props } from './types'
import { cn } from '@/lib/utils'

function {Name}({ content, style, className }: {Name}Props) {
  return <div className={cn("{name}-widget", className)} style={style}>{content}</div>
}

export default memo({Name})
```

**Why memoize:** Parent re-renders propagate to children. `memo()` enables early bailout when props unchanged. Scroll/animation updates use CSS variables (not props), so widgets stay idle.

### Validation Rules

| # | Rule | Check |
|---|------|-------|
| 9 | Widget exports wrapped in memo() | Default export uses memo() |
| 10 | Props are serializable | No functions in props |
| 11 | No inline objects in render | Use useMemo for objects |

### Anti-Patterns

See [Must Not rules](#must-not) for scroll listeners, viewport units, and experience imports.

**Memoization-specific:**

```typescript
// WRONG - Inline objects break memo
<Widget style={{ padding: 16 }} />
// FIX: const style = useMemo(() => ({ padding: 16 }), [])

// WRONG - Functions break RSC serialization
<Widget onClick={() => {}} />
// FIX: Use BehaviourWrapper for event handling

// WRONG - Renders "0" when count is 0
{count && <Badge count={count} />}
// FIX: {count > 0 ? <Badge count={count} /> : null}

// WRONG - SVG without hardware acceleration
<svg className="animate-spin">...</svg>
// FIX: <div className="animate-spin"><svg>...</svg></div>

// WRONG - Static JSX recreated each render
return <>{loading && <Skeleton />}</>
// FIX: Hoist to module scope: const skeleton = <Skeleton />
```

---

## Testing

> **Browser-based validation.** Widgets render static content — unit testing provides limited value. Validate visually in browser.

### Testing Approach

| Aspect | Method | Why |
|--------|--------|-----|
| Visual rendering | Browser / Storybook | CSS/layout issues not caught by unit tests |
| Props validation | TypeScript | Compile-time safety |
| CSS variable fallbacks | Visual inspection | SSR rendering correctness |
| Memoization | React DevTools | Highlight updates to verify memo works |

### What NOT to Unit Test

| Skip | Reason |
|------|--------|
| DOM structure | Changes with styling, brittle tests |
| CSS variable values | Set by driver, not widget |
| Visual appearance | Use visual regression tools instead |

### Validation Checklist

When building a widget, verify:

- [ ] Renders in browser without errors
- [ ] CSS variables have fallbacks (works without driver)
- [ ] Fills parent container (no fixed dimensions)
- [ ] No viewport units in styles
- [ ] `memo()` wrapper on default export
- [ ] Props interface exported from `types.ts`
- [ ] No experience layer imports

### Browser Validation

```bash
# Start dev server
npm run dev

# Navigate to page using the widget
# Or use Storybook if configured
npm run storybook
```

### Definition of Done

A widget is complete when:

- [ ] Renders correctly in browser
- [ ] No console errors/warnings
- [ ] CSS fallbacks verified (disable driver, check SSR)
- [ ] TypeScript compiles without errors
- [ ] Validator passes: `npm run validate -- widgets/{Name}`

---

## Accessibility

### Focus Management

Interactive widgets must have visible focus states using `:focus-visible`:

```css
/* Button/styles.css */
.button-widget:focus-visible {
  outline: 2px solid var(--color-focus, #0066ff);
  outline-offset: 2px;
}
```

### ARIA Attributes

Widgets that convey meaning beyond their text content need ARIA attributes:

```typescript
// widgets/primitives/Icon/index.tsx
export default memo(function Icon({ name, label, decorative }: IconProps) {
  return (
    <svg
      className="icon-widget"
      role={decorative ? 'presentation' : 'img'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative ? true : undefined}
    >
      {/* icon content */}
    </svg>
  )
})
```

### Semantic Elements

Use semantic HTML elements where appropriate:

| Widget | Element | Why |
|--------|---------|-----|
| Button | `<button>` or `<a>` | Native keyboard support |
| Text (heading) | `<h1>`-`<h6>` | Document outline |
| Text (paragraph) | `<p>` | Semantic meaning |
| Image | `<img>` with `alt` | Screen reader support |

### Button Accessibility

```typescript
// widgets/primitives/Button/index.tsx
const Button = memo(forwardRef<HTMLElement, ButtonProps>(
  ({ label, href, variant = 'primary', disabled }, ref) => {
    // Use <a> for navigation, <button> for actions
    const Element = href ? 'a' : 'button'

    return (
      <Element
        ref={ref as any}
        className={`button-widget button-widget--${variant}`}
        href={href}
        disabled={!href ? disabled : undefined}
        aria-disabled={disabled}
      >
        {label}
      </Element>
    )
  }
))
```

### Image Accessibility

```typescript
// widgets/primitives/Image/index.tsx
const Image = memo(forwardRef<HTMLImageElement, ImageProps>(
  ({ src, alt, decorative, aspect }, ref) => (
    <img
      ref={ref}
      className="image-widget"
      src={src}
      alt={decorative ? '' : alt}
      aria-hidden={decorative}
      style={{ aspectRatio: aspect }}
    />
  )
))
```

### Validation Rules (Accessibility)

| # | Rule | Function | Files |
|---|------|----------|-------|
| 15 | Buttons have visible focus | `checkFocusVisible` | `Button/styles.css` |
| 16 | Images have alt or aria-hidden | `checkImageAlt` | `Image/index.tsx` |
| 17 | Icons have aria-label or aria-hidden | `checkIconAccessibility` | `Icon/index.tsx` |

---

## Integration

| Interacts With | Direction | How |
|----------------|-----------|-----|
| `schema/widget.ts` | Imports | Type definitions |
| `experience/behaviours` | Reads | CSS variables via driver |
| `renderer/WidgetRenderer` | Rendered by | Instantiated from schema |

## Validator

Validated by: `./widget.validator.ts`

Rules in "Must/Must Not" map 1:1 to validator checks.

---

## Example: Simplest Site

> Minimal example traced through all domain layers. See other specs for the full flow.

The simplest site needs these widgets:

### Image Widget

```typescript
// widgets/primitives/Image/types.ts
export interface ImageProps {
  src: string
  alt: string
  aspect?: string  // e.g., '16/9', '1/1'
  style?: CSSProperties
  className?: string
}
```

```typescript
// widgets/primitives/Image/index.tsx
import { memo, forwardRef } from 'react'
import type { ImageProps } from './types'
import './styles.css'

const Image = memo(forwardRef<HTMLImageElement, ImageProps>(
  ({ src, alt, aspect, style }, ref) => (
    <img
      ref={ref}
      className="image-widget"
      src={src}
      alt={alt}
      style={{ ...style, aspectRatio: aspect }}
    />
  )
))

export default Image
```

```css
/* widgets/primitives/Image/styles.css */
.image-widget {
  transform: translateY(calc(var(--y, 0) * 1px));
  opacity: var(--opacity, 1);
  max-width: 100%;
  height: auto;
  display: block;
}

.image-widget[data-behaviour] {
  will-change: transform, opacity;
}
```

### Button Widget

```typescript
// widgets/primitives/Button/types.ts
export interface ButtonProps {
  label: string
  href?: string
  variant?: 'primary' | 'secondary'
  style?: CSSProperties
  className?: string
}
```

```typescript
// widgets/primitives/Button/index.tsx
import { memo, forwardRef } from 'react'
import type { ButtonProps } from './types'
import './styles.css'

const Button = memo(forwardRef<HTMLAnchorElement, ButtonProps>(
  ({ label, href, variant = 'primary', style }, ref) => (
    <a
      ref={ref}
      className={`button-widget button-widget--${variant}`}
      href={href}
      style={style}
    >
      {label}
    </a>
  )
))

export default Button
```

```css
/* widgets/primitives/Button/styles.css */
.button-widget {
  transform: translateY(calc(var(--y, 0) * 1px));
  opacity: var(--opacity, 1);
  display: inline-block;
  padding: 12px 24px;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
}

.button-widget--primary {
  background: var(--color-primary, #000);
  color: var(--color-primary-contrast, #fff);
}

.button-widget--secondary {
  background: transparent;
  border: 1px solid currentColor;
}

.button-widget[data-behaviour] {
  will-change: transform, opacity;
}
```

### Usage in Section Composite

These widgets are used in the Hero section (see [Section Composite Spec](./section-composite.spec.md)):

```typescript
// sections/patterns/Hero/index.ts
createHeroSection({
  headline: 'We craft digital experiences',
  subheadline: 'Strategy, design, and development.',
  cta: { label: 'Get in touch', href: '/contact' }
})

// Returns SectionSchema with widgets:
// - Text (headline)
// - Text (subheadline)
// - Button (cta)
```
