# Styling Strategy

> Tailwind CSS patterns for creativeshire. Defines when to use Tailwind utilities vs CSS variables, design token conventions, and class management utilities.

---

## The Rule

| Use | For |
|-----|-----|
| **Tailwind** | Static visual properties (layout, spacing, colors, typography) |
| **CSS Variables** | Dynamic properties (anything a driver animates) |

```
┌──────────────────────────────────┬──────────────────────────────┐
│  TAILWIND                        │  CSS VARIABLES               │
│  Static visual properties        │  Dynamic properties          │
├──────────────────────────────────┼──────────────────────────────┤
│  Layout: flex, grid, gap         │  Animation: --y, --scale     │
│  Spacing: p-*, m-*               │  Theming: --primary          │
│  Typography: text-*, font-*      │  Driver-controlled values    │
│  Colors: bg-*, text-*            │                              │
└──────────────────────────────────┴──────────────────────────────┘
```

---

## Design Tokens

Define semantic tokens in `app/globals.css` using CSS variables and Tailwind v4's `@theme inline`:

```css
@import "tailwindcss";

:root {
  /* Semantic colors - use OKLCH for perceptual uniformity */
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);

  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);

  --muted: oklch(0.965 0 0);
  --muted-foreground: oklch(0.556 0 0);

  --border: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);

  /* Radius */
  --radius: 0.5rem;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: oklch(0.145 0 0);
    --foreground: oklch(0.985 0 0);
    /* ... dark variants */
  }
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-ring: var(--ring);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: var(--radius);
  --radius-lg: calc(var(--radius) + 4px);
}
```

### Token Naming Convention

| Token | CSS Variable | Tailwind Class |
|-------|--------------|----------------|
| Background | `--background` | `bg-background` |
| Text on background | `--foreground` | `text-foreground` |
| Primary action | `--primary` | `bg-primary` |
| Text on primary | `--primary-foreground` | `text-primary-foreground` |

**Pattern**: Every background color has a matching `-foreground` for accessible text.

---

## The `cn()` Utility

Create `lib/utils.ts` for class merging:

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Why `cn()`

Handles conflicting Tailwind classes correctly:

```typescript
cn('px-4 py-2', 'px-6')              // → 'py-2 px-6' (not 'px-4 py-2 px-6')
cn('text-red-500', active && 'text-blue-500')  // → conditional classes
```

### Dependencies

```bash
npm install clsx tailwind-merge
```

---

## Pattern: Tailwind in Widgets

### Context

Building a widget component that needs consistent styling.

### Solution

Use Tailwind for static properties, `cn()` for class composition:

```typescript
// creativeshire/content/widgets/primitives/Card/index.tsx
import { cn } from '@/lib/utils';
import type { CardProps } from './types';

export default function Card({ className, children }: CardProps) {
  return (
    <div className={cn(
      "rounded-lg border bg-background text-foreground shadow-sm",
      className
    )}>
      {children}
    </div>
  );
}
```

### Why This Works

Components accept `className` for customization. `cn()` merges without conflicts.

---

## Pattern: CSS Variable Bridge

### Context

A widget needs driver-controlled animation.

### Problem

Tailwind classes are static. Drivers update values at 60fps.

### Solution

Use CSS variables for animated properties:

```tsx
// creativeshire/content/widgets/primitives/HeroImage/index.tsx
import './styles.css';

export default function HeroImage({ src, alt }: HeroImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      data-widget="hero-image"
      className="w-full h-auto object-cover"
    />
  );
}
```

```css
/* creativeshire/content/widgets/primitives/HeroImage/styles.css */
[data-widget="hero-image"] {
  opacity: var(--hero-opacity, 1);
  transform: translateY(var(--hero-y, 0px));
}

[data-widget="hero-image"][data-behaviour] {
  will-change: opacity, transform;
}
```

### Why This Works

Tailwind handles static styling. CSS variables enable driver control. Fallbacks ensure SSR works.

---

## Pattern: Variant Styling with CVA

### Context

A widget has multiple visual variants (size, color, state).

### Problem

Conditional class strings become complex and error-prone.

### Solution

Use `class-variance-authority` for type-safe variants:

```typescript
// creativeshire/content/widgets/primitives/Button/index.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base styles (always applied)
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-border bg-background hover:bg-muted",
        ghost: "hover:bg-muted hover:text-foreground",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export default function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
```

### Dependencies

```bash
npm install class-variance-authority
```

### Why This Works

Variants are type-safe. Default values defined once. `className` prop allows overrides.

---

## Forbidden Patterns

### Do Not: Use Viewport Units in Widgets

```tsx
// WRONG
<div className="h-screen w-screen">
```

**Why:** BehaviourWrapper imposes viewport sizing, not the widget.

### Do Not: Use `@apply` in CSS

```css
/* WRONG */
.card {
  @apply flex items-center p-4;
}
```

**Why:** Defeats Tailwind's purpose. Use classes directly.

### Do Not: Use Arbitrary Values

```tsx
// WRONG
<div className="p-[13px] text-[17px]">
```

**Why:** Breaks design system. Use design tokens.

### Do Not: Use Tailwind Animation Classes

```tsx
// WRONG - animation belongs in experience layer
<div className="animate-bounce opacity-50 translate-y-10">
```

**Why:** Drivers control animation via CSS variables.

### Do: Use CSS Variables with Fallbacks

```css
/* Correct */
.widget {
  transform: translateY(calc(var(--y, 0) * 1px));
  opacity: var(--opacity, 1);
}
```

**Why:** Fallbacks ensure SSR works. Drivers update after hydration.

---

## CSS Variable Catalog

> See [css-variables.spec.md](./css-variables.spec.md) for the complete catalog of all CSS variables including animation, section, behaviour-specific, chrome, widget-scoped, and theme variables.

**Quick reference for common animation variables:**

| Variable | Fallback | Purpose |
|----------|----------|---------|
| `--y` | `0` | Vertical position (px multiplier) |
| `--opacity` | `1` | Element visibility |
| `--scale` | `1` | Transform scale |

**CSS usage pattern:**

```css
.widget-wrapper {
  transform: translateY(calc(var(--y, 0) * 1px)) scale(var(--scale, 1));
  opacity: var(--opacity, 1);
}
```

---

## Quick Reference

| Need | Approach |
|------|----------|
| Layout/spacing | Tailwind: `flex`, `grid`, `gap-4`, `p-6` |
| Colors | Tailwind with tokens: `bg-primary`, `text-foreground` |
| Typography | Tailwind: `text-lg`, `font-bold` |
| Borders/shadows | Tailwind: `rounded-lg`, `shadow-sm` |
| Animated opacity | CSS variable: `var(--opacity, 1)` |
| Animated position | CSS variable: `var(--y, 0px)` |
| Animated scale | CSS variable: `var(--scale, 1)` |
| Class merging | `cn()` utility |
| Variants | CVA with `cva()` |

---

## Site Replication

When converting an external Tailwind site to creativeshire:

1. **Copy Tailwind classes** - They transfer as-is
2. **Identify animated properties** - Convert to CSS variables
3. **Extract design tokens** - Add to `globals.css`
4. **Separate concerns**:

```tsx
// Original site
<div className="opacity-0 translate-y-10 transition-all">

// Creativeshire conversion
<div
  className="transition-all"
  style={{
    opacity: 'var(--reveal-opacity, 0)',
    transform: 'translateY(var(--reveal-y, 40px))',
  }}
>
```

---

## See Also

- [Widget Contract](../components/content/widget.spec.md) - Widget implementation rules
- [Behaviour Contract](../components/experience/behaviour.spec.md) - CSS variable computation
- [Driver Contract](../components/experience/driver.spec.md) - Applying CSS variables to DOM
- [Naming Conventions](naming.spec.md) - CSS variable naming rules
