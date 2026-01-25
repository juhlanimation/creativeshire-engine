# {Domain} Spec

> {One-line description of what this domain IS}

## Purpose

{2-3 sentences: why this exists, what problem it solves.}

## Concepts

| Term | Definition |
|------|------------|
| {Concept 1} | {What it means in this domain} |

## Folder Structure

```
creativeshire/{layer}/{domain}/
├── {Name}/
│   ├── index.tsx    # Component (default export)
│   ├── types.ts     # Props interface (exported)
│   └── styles.css   # CSS with var() fallbacks
├── types.ts         # Shared domain types
└── index.ts         # Barrel exports
```

## Interface

```typescript
// {domain}/types.ts
export interface {Domain}Props {
  requiredProp: string
  optionalProp?: number
}

// {domain}/index.tsx
export default function {Domain}(props: {Domain}Props): JSX.Element
```

## Rules

### Must

1. Default export from `index.tsx`
2. Props interface exported from `types.ts`
3. CSS variables have fallbacks: `var(--name, fallback)`
4. {Domain-specific requirement}

### Must Not

1. Viewport units (`100vh`, `100dvh`) — BehaviourWrapper handles sizing
2. Scroll/resize listeners — triggers handle this
3. Imports from `experience/` — layer violation
4. `position: fixed/sticky` — BehaviourWrapper handles positioning
5. {Domain-specific prohibition}

## Validation Rules

> Each rule maps 1:1 to `{domain}.validator.ts`

| # | Rule | Function | Files |
|---|------|----------|-------|
| 1 | Default export required | `checkDefaultExport` | `.tsx` |
| 2 | Props interface exported | `checkPropsExported` | `types.ts` |
| 3 | No scroll/resize listeners | `checkNoScrollListeners` | `.tsx`, `.ts` |
| 4 | No fixed/sticky position | `checkNoPositionFixed` | `.tsx`, `.css` |
| 5 | No viewport units | `checkNoViewportUnits` | `.tsx`, `.css` |
| 6 | No experience imports | `checkNoExperienceImports` | `.tsx`, `.ts` |
| 7 | CSS var fallbacks | `checkCssVariableFallbacks` | `.tsx`, `.css` |

## CSS Variables

> Components READ these (set by driver). Never SET them.

| Variable | Purpose | Fallback |
|----------|---------|----------|
| `--y` | Vertical offset | `0` |
| `--opacity` | Transparency | `1` |

```css
.{domain} {
  transform: translateY(calc(var(--y, 0) * 1px));
  opacity: var(--opacity, 1);
}

.{domain}[data-behaviour] {
  will-change: transform, opacity;
}
```

## Template

```typescript
// {Name}/types.ts
export interface {Name}Props {
  content: string
}
```

```typescript
// {Name}/index.tsx
import { {Name}Props } from './types'
import './styles.css'

export default function {Name}({ content }: {Name}Props) {
  return <div className="{name}">{content}</div>
}
```

```css
/* {Name}/styles.css */
.{name} {
  transform: translateY(calc(var(--y, 0) * 1px));
  opacity: var(--opacity, 1);
}
```

## Anti-Patterns

### Don't: Direct style manipulation

```typescript
// WRONG
element.style.transform = `translateY(${offset}px)`
```

**Why:** Bypasses CSS variable contract; breaks driver control.

### Do: Use CSS variables

```typescript
// CORRECT - Let driver set --y via BehaviourWrapper
<div style={{ transform: 'translateY(calc(var(--y, 0) * 1px))' }} />
```

### Don't: Import from experience layer

```typescript
// WRONG
import { useBehaviour } from '@/creativeshire/experience/behaviours'
```

**Why:** Layer violation; content components must be experience-agnostic.

## Integration

| Interacts With | Direction | How |
|----------------|-----------|-----|
| `schema/{domain}.ts` | Imports | Type definitions |
| `experience/behaviours` | Reads | CSS variables |
| `{related-domain}` | {direction} | {description} |

## Validator

Validated by: `./{domain}.validator.ts`

Rules in "Must/Must Not" map 1:1 to validator checks.
