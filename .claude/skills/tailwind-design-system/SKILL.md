---
name: tailwind-design-system
description: Building production-ready design systems with Tailwind CSS. Covers CVA variants, compound components, form patterns, responsive grids, and dark mode. Use when building component libraries or standardizing UI patterns.
user-invocable: false
metadata:
  author: wshobson
  version: "1.0.0"
  upstream: https://github.com/wshobson/agents/tree/main/plugins/frontend-mobile-development/skills/tailwind-design-system
---

# Tailwind Design System

Production-ready design system patterns for Tailwind CSS.

## When to Apply

Reference these guidelines when:
- Building reusable component libraries
- Creating type-safe component variants
- Implementing compound components
- Setting up dark mode theming
- Standardizing form patterns

## Design Token Hierarchy

```
Brand Tokens (abstract)
    ↓
Semantic Tokens (purpose)
    ↓
Component Tokens (specific)
```

## Component Architecture

```
Base styles (always applied)
    ↓
Variants (visual options)
    ↓
Sizes (dimension options)
    ↓
States (interactive states)
    ↓
Overrides (className prop)
```

## Pattern Index

| Pattern | Purpose |
|---------|---------|
| [CVA Components](#cva-components) | Type-safe variant management |
| [Compound Components](#compound-components) | Composable sub-components |
| [Form Components](#form-components) | Input fields with validation |
| [Responsive Grid](#responsive-grid) | Fluid grid system |
| [Dark Mode](#dark-mode) | Theme switching |

---

## CVA Components

Use `class-variance-authority` for type-safe variants.

```typescript
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
```

---

## Compound Components

Composable sub-components sharing context.

```typescript
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
)
CardTitle.displayName = "CardTitle"

const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
)
CardContent.displayName = "CardContent"

const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardTitle, CardContent, CardFooter }
```

**Usage:**

```tsx
<Card>
  <CardHeader>
    <CardTitle>Project Name</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Project description...</p>
  </CardContent>
  <CardFooter>
    <Button>View Project</Button>
  </CardFooter>
</Card>
```

---

## Form Components

Input fields with error states.

```typescript
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-destructive">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
```

**With React Hook Form:**

```typescript
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'

function ContactForm() {
  const { register, handleSubmit, formState: { errors } } = useForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register('email', { required: 'Email is required' })}
        error={errors.email?.message as string}
        placeholder="Email"
      />
    </form>
  )
}
```

---

## Responsive Grid

Reusable grid system.

```typescript
import { cn } from '@/lib/utils'

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 6 | 12
  gap?: 'sm' | 'md' | 'lg'
}

const colsMap = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
  12: 'grid-cols-4 sm:grid-cols-6 lg:grid-cols-12',
}

const gapMap = {
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-8',
}

export function Grid({ cols = 3, gap = 'md', className, ...props }: GridProps) {
  return (
    <div
      className={cn('grid', colsMap[cols], gapMap[gap], className)}
      {...props}
    />
  )
}

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const sizeMap = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  full: 'max-w-full',
}

export function Container({ size = 'lg', className, ...props }: ContainerProps) {
  return (
    <div
      className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', sizeMap[size], className)}
      {...props}
    />
  )
}
```

---

## Dark Mode

Theme provider with system preference detection.

```typescript
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system')

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored) setTheme(stored)
  }, [])

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }

    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
```

**CSS Setup (globals.css):**

```css
@import "tailwindcss";

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  /* ... more tokens */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.205 0 0);
  /* ... dark variants */
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
}
```

---

## Utilities

### cn() Function

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Focus Ring Helper

```typescript
export const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
```

### Disabled State Helper

```typescript
export const disabledStyles = "disabled:pointer-events-none disabled:opacity-50"
```

---

## Best Practices

| Do | Don't |
|----|-------|
| Use CSS variables for runtime theming | Hardcode colors |
| Compose with CVA for type safety | Create variant logic manually |
| Use semantic color names | Use arbitrary values |
| Forward refs for composition | Skip focus states |
| Include ARIA attributes | Neglect dark mode testing |

---

## Dependencies

```bash
npm install clsx tailwind-merge class-variance-authority
```

---

## See Also

- [Tailwind v4 Skill](../.claude/skills/tailwind-v4-skill/SKILL.md) - Configuration
- [Styling Spec](../.claude/skills/engine/specs/reference/styling.spec.md) - Project conventions
