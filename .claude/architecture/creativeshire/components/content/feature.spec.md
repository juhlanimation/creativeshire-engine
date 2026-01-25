# Feature Spec

> Static styling decorators that modify widget and section appearance without animation.

## Purpose

Features apply static styling to widgets and sections: spacing (margin, padding), typography (size, weight, alignment), backgrounds (color, image, gradient), and borders. Features configure intrinsic appearance only.

Features never animate. If a property changes with scroll, audio, or any event, it belongs to a behaviour in Experience Layer (L2).

## Concepts

| Term | Definition |
|------|------------|
| Feature | Static styling configuration applied to content |
| FeatureSet | Collection of feature categories for a component |
| Static | Value fixed at render time, never changes |
| Intrinsic | Properties that don't depend on viewport or scroll |

## Folder Structure

```
creativeshire/components/content/features/
├── index.ts             # useFeatures hook and barrel exports
├── types.ts             # FeatureSet interface
├── spacing.ts           # Spacing feature (margin, padding)
├── typography.ts        # Typography feature (size, weight, align)
├── background.ts        # Background feature (color, image, gradient)
└── border.ts            # Border feature (width, color, radius)
```

## Interface

```typescript
// features/types.ts
export interface FeatureSet {
  spacing?: SpacingFeature
  typography?: TypographyFeature
  background?: BackgroundFeature
  border?: BorderFeature
}

export interface SpacingFeature {
  margin?: string
  padding?: string
  gap?: string | number
}

export interface TypographyFeature {
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  align?: 'left' | 'center' | 'right'
  color?: string
}

export interface BackgroundFeature {
  color?: string
  image?: string
  gradient?: string
}

export interface BorderFeature {
  width?: number
  color?: string
  radius?: string
}

// features/index.ts
export function useFeatures(features?: FeatureSet): CSSProperties
```

## Rules

### Must

1. Return `CSSProperties` object
2. Pure function (same input = same output)
3. Handle undefined gracefully
4. TypeScript strict mode passes
5. Export from barrel `index.ts`

### Must Not

1. React hooks in feature functions - features are pure
2. Event listeners - no scroll, resize, or DOM events
3. Imports from `experience/` - layer violation
4. Dynamic CSS variables - only static values
5. Viewport units (`100vh`, `100vw`, `100dvh`)
6. `will-change` property - belongs to behaviours
7. Transitions or animations - belongs to behaviours

## Validation Rules

> Each rule maps 1:1 to `feature.validator.ts`

| # | Rule | Function | Files |
|---|------|----------|-------|
| 1 | No React hooks | `checkNoReactHooks` | `.ts` |
| 2 | No event listeners | `checkNoEventListeners` | `.ts` |
| 3 | No experience imports | `checkNoExperienceImports` | `.ts` |
| 4 | No dynamic CSS variables | `checkNoDynamicCssVars` | `.ts` |
| 5 | No viewport units | `checkNoViewportUnits` | `.ts` |
| 6 | No will-change | `checkNoWillChange` | `.ts` |
| 7 | No transitions/animations | `checkNoAnimations` | `.ts` |

## What's NOT a Feature

| Property | Why | Where It Belongs |
|----------|-----|------------------|
| `minHeight: 100vh` | Viewport-relative = extrinsic | BehaviourWrapper (L2) |
| `translateY` | Changes with scroll | Behaviour (L2) |
| `clipPath` (animated) | Changes with scroll | Behaviour (L2) |
| `opacity` (animated) | Changes with events | Behaviour (L2) |
| `will-change` | Animation optimization | Behaviour (L2) |
| `transition` | Animation timing | Behaviour (L2) |

**Rule:** If it animates or depends on external state, it's not a feature.

## Template

```typescript
// spacing.ts
import { CSSProperties } from 'react'
import { SpacingFeature } from './types'

export function applySpacing(feature?: SpacingFeature): CSSProperties {
  if (!feature) return {}
  return {
    margin: feature.margin,
    padding: feature.padding,
    gap: feature.gap
  }
}
```

```typescript
// typography.ts
import { CSSProperties } from 'react'
import { TypographyFeature } from './types'

const sizeMap: Record<string, string> = {
  'xs': '0.75rem', 'sm': '0.875rem', 'base': '1rem',
  'lg': '1.125rem', 'xl': '1.25rem', '2xl': '1.5rem',
  '3xl': '1.875rem', '4xl': '2.25rem', '5xl': '3rem', '6xl': '3.75rem'
}

export function applyTypography(feature?: TypographyFeature): CSSProperties {
  if (!feature) return {}
  return {
    fontSize: feature.size ? sizeMap[feature.size] : undefined,
    fontWeight: feature.weight,
    textAlign: feature.align,
    color: feature.color
  }
}
```

```typescript
// index.ts
import { CSSProperties } from 'react'
import { FeatureSet } from './types'
import { applySpacing } from './spacing'
import { applyTypography } from './typography'
import { applyBackground } from './background'
import { applyBorder } from './border'

export function useFeatures(features?: FeatureSet): CSSProperties {
  if (!features) return {}
  return {
    ...applySpacing(features.spacing),
    ...applyTypography(features.typography),
    ...applyBackground(features.background),
    ...applyBorder(features.border)
  }
}

export * from './types'
```

## Anti-Patterns

### Don't: Use viewport units

```typescript
// WRONG
return { minHeight: '100vh' }
```

**Why:** Extrinsic sizing belongs in BehaviourWrapper, not features.

### Don't: Add transitions

```typescript
// WRONG
return {
  transition: 'opacity 0.3s ease',
  opacity: feature?.visible ? 1 : 0
}
```

**Why:** Animation belongs in L2. Features are static.

### Don't: Use dynamic CSS variables

```typescript
// WRONG
return { transform: `translateY(var(--y, 0))` }
```

**Why:** Dynamic transforms are set by driver in L2, not features.

### Don't: Use React hooks

```typescript
// WRONG
export function applySpacing(feature?: SpacingFeature): CSSProperties {
  const [value, setValue] = useState(feature?.margin)
  // ...
}
```

**Why:** Features are pure functions, not React components.

### Do: Return static CSSProperties

```typescript
// Correct
export function applyTypography(feature?: TypographyFeature): CSSProperties {
  if (!feature) return {}
  return {
    fontSize: feature.size ? sizeMap[feature.size] : undefined,
    fontWeight: feature.weight
  }
}
```

**Why:** Pure functions with static output are composable and predictable.

## Integration

| Interacts With | Direction | How |
|----------------|-----------|-----|
| `schema/features.ts` | Implements | FeatureSet type |
| `content/widgets/` | Applied to | Via useFeatures hook |
| `content/sections/` | Applied to | Via useFeatures hook |
| `renderer/` | Called by | Applies features to elements |

## Validator

Validated by: `./feature.validator.ts`

Rules in "Must/Must Not" map 1:1 to validator checks.
