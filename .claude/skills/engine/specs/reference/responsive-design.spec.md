# Responsive Design Spec

> Mobile-first responsive patterns for creativeshire. Defines breakpoints, responsive props, and layout adaptation strategies.

---

## The Rule

| Approach | When |
|----------|------|
| **Mobile-first** | Default styles for mobile, enhance for larger screens |
| **Responsive props** | Schema values that adapt per breakpoint |
| **Tailwind breakpoints** | Layout changes via `sm:`, `md:`, `lg:`, `xl:` prefixes |

---

## Breakpoints

Use Tailwind's default breakpoints. Consistent across all components.

| Breakpoint | Min Width | Target |
|------------|-----------|--------|
| (default)  | 0px       | Mobile phones |
| `sm`       | 640px     | Large phones, small tablets |
| `md`       | 768px     | Tablets |
| `lg`       | 1024px    | Small laptops, landscape tablets |
| `xl`       | 1280px    | Desktops |
| `2xl`      | 1536px    | Large desktops |

### Usage in Tailwind

```tsx
// Mobile-first: default is mobile, add breakpoint prefixes for larger
<div className="
  grid grid-cols-1      // Mobile: 1 column
  sm:grid-cols-2        // 640px+: 2 columns
  lg:grid-cols-3        // 1024px+: 3 columns
">
```

---

## Responsive Props in Schema

Widget and section schemas support responsive values for layout properties.

### Responsive Value Type

```typescript
// engine/schema/responsive.ts
export type ResponsiveValue<T> = T | {
  base?: T      // Mobile (0px+)
  sm?: T        // 640px+
  md?: T        // 768px+
  lg?: T        // 1024px+
  xl?: T        // 1280px+
}

// Usage in schema
export interface LayoutSchema {
  columns?: ResponsiveValue<number>
  gap?: ResponsiveValue<number>
  align?: ResponsiveValue<'start' | 'center' | 'end'>
}
```

### Example: Responsive Grid

```typescript
// sections/patterns/Gallery/index.ts
return {
  id: 'gallery',
  layout: {
    type: 'grid',
    columns: { base: 1, sm: 2, lg: 3 },  // ← Responsive columns
    gap: { base: 16, lg: 24 }             // ← Responsive gap
  },
  widgets: [...]
}
```

### Renderer Converts to Tailwind

```typescript
// renderer/utils/responsive.ts
function toTailwindClass(prop: string, value: ResponsiveValue<number>): string {
  if (typeof value === 'number') return `${prop}-${value}`

  const classes: string[] = []
  if (value.base) classes.push(`${prop}-${value.base}`)
  if (value.sm) classes.push(`sm:${prop}-${value.sm}`)
  if (value.md) classes.push(`md:${prop}-${value.md}`)
  if (value.lg) classes.push(`lg:${prop}-${value.lg}`)
  if (value.xl) classes.push(`xl:${prop}-${value.xl}`)
  return classes.join(' ')
}

// Example output
toTailwindClass('grid-cols', { base: 1, sm: 2, lg: 3 })
// → "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
```

---

## Layout Adaptation Patterns

### Pattern: Stack to Grid

Most common pattern: vertical stack on mobile, grid on desktop.

```typescript
// Schema
layout: {
  type: 'grid',
  columns: { base: 1, md: 2, lg: 3 },
  gap: 24
}

// Renders as
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

### Pattern: Hide on Mobile

Some elements hide on smaller screens.

```typescript
// Widget with visibility prop
{
  type: 'Text',
  props: { content: 'Desktop only feature' },
  features: {
    visibility: { base: 'hidden', lg: 'visible' }
  }
}

// Renders as
<p className="hidden lg:block">Desktop only feature</p>
```

### Pattern: Responsive Typography

Text scales with viewport.

```typescript
// Schema
{
  type: 'Text',
  props: { content: 'Hero Headline', as: 'h1' },
  features: {
    typography: {
      size: { base: '3xl', md: '5xl', lg: '6xl' }
    }
  }
}

// Renders as
<h1 className="text-3xl md:text-5xl lg:text-6xl">Hero Headline</h1>
```

### Pattern: Responsive Spacing

Padding/margin adapts to screen size.

```typescript
// Section with responsive padding
{
  id: 'hero',
  layout: { type: 'stack' },
  features: {
    spacing: {
      py: { base: 16, md: 24, lg: 32 },
      px: { base: 4, md: 8, lg: 16 }
    }
  }
}

// Renders as
<section className="py-16 md:py-24 lg:py-32 px-4 md:px-8 lg:px-16">
```

---

## Responsive Behaviour

Behaviours may need different intensities per breakpoint.

### Approach: CSS Media Queries in cssTemplate

```typescript
// behaviours/parallax-depth/index.ts
const parallaxDepth: Behaviour = {
  id: 'parallax-depth',
  compute: (state) => ({
    '--depth-y': state.scrollProgress * 100
  }),
  cssTemplate: `
    transform: translateY(calc(var(--depth-y, 0) * 1px));
    will-change: transform;

    @media (max-width: 768px) {
      /* Reduce effect intensity on mobile */
      transform: translateY(calc(var(--depth-y, 0) * 0.3px));
    }
  `
}
```

### Approach: Disable on Mobile

Some effects should be disabled on mobile for performance.

```typescript
// BehaviourWrapper checks viewport
function BehaviourWrapper({ behaviour, children }) {
  const isMobile = useMediaQuery('(max-width: 768px)')

  // Skip behaviour registration on mobile
  if (isMobile && behaviour.disableOnMobile) {
    return children
  }

  // ... normal behaviour wrapper logic
}
```

---

## Image Handling

### Responsive Images

Use Next.js Image with responsive sizes.

```typescript
// widgets/primitives/Image/index.tsx
import NextImage from 'next/image'

export default function Image({ src, alt, sizes }: ImageProps) {
  return (
    <NextImage
      src={src}
      alt={alt}
      fill
      sizes={sizes ?? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
      className="object-cover"
    />
  )
}
```

### Art Direction

Different images for different breakpoints.

```typescript
// Schema
{
  type: 'Image',
  props: {
    src: {
      base: '/hero-mobile.jpg',
      md: '/hero-tablet.jpg',
      lg: '/hero-desktop.jpg'
    },
    alt: 'Hero image'
  }
}
```

---

## Container Strategy

### Max-Width Container

Content constrained to readable width on large screens.

```css
/* globals.css */
.container {
  width: 100%;
  max-width: var(--container-max-width, 1280px);
  margin-inline: auto;
  padding-inline: var(--container-padding, 1rem);
}

@media (min-width: 640px) {
  .container { --container-padding: 1.5rem; }
}

@media (min-width: 1024px) {
  .container { --container-padding: 2rem; }
}
```

### Full-Bleed Sections

Some sections break out of container.

```typescript
// Schema
{
  id: 'hero',
  layout: { type: 'stack', fullBleed: true },  // ← Ignores container
  features: { background: { color: '#000' } }
}
```

---

## Testing Responsive

### Required Viewports

Test at these widths minimum:

| Width | Represents |
|-------|------------|
| 375px | iPhone SE |
| 768px | iPad |
| 1024px | Small laptop |
| 1440px | Desktop |

### Browser DevTools

Use responsive mode to test breakpoints.

### Checklist

- [ ] Layout adapts at each breakpoint
- [ ] Text remains readable (not too small on mobile)
- [ ] Touch targets are 44x44px minimum on mobile
- [ ] No horizontal scroll on any viewport
- [ ] Images load appropriate size per viewport
- [ ] Behaviours perform well on mobile

---

## Anti-Patterns

### Don't: Desktop-First

```tsx
// WRONG - Starts with desktop, removes features for mobile
<div className="grid-cols-3 max-md:grid-cols-1">

// CORRECT - Mobile-first, adds features for desktop
<div className="grid-cols-1 md:grid-cols-3">
```

### Don't: Fixed Pixel Widths

```tsx
// WRONG - Breaks on smaller screens
<div className="w-[800px]">

// CORRECT - Flexible with max constraint
<div className="w-full max-w-3xl">
```

### Don't: Hide Content Only

```tsx
// WRONG - Content exists but hidden, bad for performance
<div className="hidden md:block">
  <ExpensiveComponent />
</div>

// CORRECT - Conditional render
{isDesktop && <ExpensiveComponent />}
```

### Don't: Inconsistent Breakpoints

```tsx
// WRONG - Random breakpoint values
<div className="max-[847px]:hidden min-[932px]:flex">

// CORRECT - Use standard Tailwind breakpoints
<div className="hidden md:flex">
```

---

## See Also

- [Styling Strategy](styling.spec.md) - Tailwind patterns and CSS variables
- [Widget Contract](../components/content/widget.spec.md) - Widget implementation
- [Section Composite Spec](../components/content/section-composite.spec.md) - Layout schemas
