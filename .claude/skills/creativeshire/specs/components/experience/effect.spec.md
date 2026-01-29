# Effect Spec

> Reusable CSS that defines HOW elements animate, driven by behaviour variables.

## Purpose

Effects define the animation mechanics: transitions, transforms, timing, and easing. They consume CSS variables computed by behaviours and apply them to elements marked with `data-effect` attributes. This separation keeps animation knowledge in L2 (Experience) while L1 (Content) stays pure structure.

## Why Effects?

Without effects, animation knowledge leaks into widgets:

```css
/* BAD: Widget (L1) knows animation details */
.contact-prompt__text {
  transform: translateY(calc(var(--reveal) * -100%));  /* Knows slide distance */
  transition: transform 400ms ease-in-out;              /* Knows timing */
}
```

With effects, widgets are pure structure:

```css
/* GOOD: Widget (L1) is just structure */
.contact-prompt__text {
  /* No animation knowledge */
}

/* Effect (L2) owns all animation */
[data-effect="text-reveal"] [data-reveal] {
  transform: translateY(var(--reveal-y, 0));
  transition: transform var(--reveal-duration, 400ms) var(--reveal-easing, ease-in-out);
}
```

## Concepts

| Term | Definition |
|------|------------|
| Effect | CSS file defining transitions and transforms using behaviour variables |
| `data-effect` | Attribute on widget root identifying which effect applies |
| `data-*` markers | Attributes marking child elements for animation targeting |
| Behaviour | Computes the CSS variable VALUES that effects consume |

## Folder Structure

```
creativeshire/experience/effects/
├── text-reveal.css      # Vertical text slide
├── fade-in.css          # Opacity + translateY entrance
├── scale-hover.css      # Scale feedback on hover/press
├── color-shift.css      # Color and blend-mode transitions
└── index.css            # Barrel import
```

## Interface

Effects are pure CSS. No TypeScript interface—just conventions:

### Naming Convention

```css
/* Effect targets elements with data-effect="effect-name" */
[data-effect="text-reveal"] { }

/* Child elements use data-* attributes */
[data-effect="text-reveal"] [data-reveal="primary"] { }
[data-effect="text-reveal"] [data-reveal="secondary"] { }
```

### Variable Convention

Effects consume variables with consistent naming:

```css
/* Pattern: --{effect}-{property} */
--reveal-y          /* Transform Y value */
--reveal-opacity    /* Opacity value */
--reveal-duration   /* Transition duration */
--reveal-easing     /* Transition timing function */
```

## Rules

### Must

1. Target elements using `[data-effect="name"]` selector
2. All CSS variables have fallback values
3. Include `will-change` for animated properties
4. Support `prefers-reduced-motion` media query
5. Variables named with effect prefix: `--{effect}-{property}`
6. File named `{effect-name}.css` in `experience/effects/`
7. Exported via `index.css` barrel

### Must Not

1. Use class selectors (use data attributes only)
2. Define layout/structure styles (only animation)
3. Hard-code animation values (use CSS variables)
4. Import from Content layer
5. Use `!important`
6. Define colors/fonts (only transforms, opacity, transitions)

## Template

```css
/* experience/effects/{effect-name}.css */

/**
 * {Effect Name} Effect
 *
 * Behaviour: {behaviour-name}
 * Variables consumed:
 *   --{effect}-x: description (fallback)
 *   --{effect}-y: description (fallback)
 */

/* Base effect on root element */
[data-effect="{effect-name}"] {
  /* Properties that apply to the container */
  color: var(--{effect}-color, inherit);
  will-change: color;
}

/* Target marked child elements */
[data-effect="{effect-name}"] [data-{marker}="primary"] {
  transform: translateY(var(--{effect}-y, 0));
  transition: transform var(--{effect}-duration, 400ms) var(--{effect}-easing, ease-in-out);
  will-change: transform;
}

[data-effect="{effect-name}"] [data-{marker}="secondary"] {
  opacity: var(--{effect}-opacity, 0);
  transition: opacity var(--{effect}-duration, 400ms) var(--{effect}-easing, ease-in-out);
  will-change: opacity;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  [data-effect="{effect-name}"] [data-{marker}] {
    transition: none;
  }
}
```

## Built-in Effects

### text-reveal

Vertical text slide with primary/secondary text swap.

**Behaviour:** `text-reveal`

**Variables:**
| Variable | Purpose | Fallback |
|----------|---------|----------|
| `--reveal-y` | Vertical slide position | `0` |
| `--reveal-opacity` | Icon/secondary opacity | `0` |
| `--reveal-color` | Text color | `inherit` |
| `--reveal-blend` | Mix blend mode | `normal` |
| `--reveal-duration` | Transition duration | `400ms` |
| `--reveal-easing` | Timing function | `ease-in-out` |

**Markers:**
- `data-reveal="primary"` - Main text (slides up on hover)
- `data-reveal="secondary"` - Revealed text (slides in from below)
- `data-reveal="icon"` - Optional icon (fades in)

```css
/* effects/text-reveal.css */
[data-effect="text-reveal"] {
  color: var(--reveal-color, inherit);
  mix-blend-mode: var(--reveal-blend, normal);
  transition: color var(--reveal-duration, 400ms) var(--reveal-easing, ease-in-out);
}

[data-effect="text-reveal"] [data-reveal="primary"],
[data-effect="text-reveal"] [data-reveal="secondary"] {
  transform: translateY(var(--reveal-y, 0));
  transition: transform var(--reveal-duration, 400ms) var(--reveal-easing, ease-in-out);
  will-change: transform;
}

[data-effect="text-reveal"] [data-reveal="icon"] {
  opacity: var(--reveal-opacity, 0);
  transition: opacity calc(var(--reveal-duration, 400ms) * 0.75) var(--reveal-easing, ease-in-out);
  will-change: opacity;
}

@media (prefers-reduced-motion: reduce) {
  [data-effect="text-reveal"],
  [data-effect="text-reveal"] [data-reveal] {
    transition: none;
  }
}
```

### fade-in

Opacity and vertical entrance animation.

**Behaviour:** `fade-in`

**Variables:**
| Variable | Purpose | Fallback |
|----------|---------|----------|
| `--fade-opacity` | Element opacity | `1` |
| `--fade-y` | Vertical offset | `0` |
| `--fade-duration` | Transition duration | `600ms` |
| `--fade-easing` | Timing function | `ease-out` |

```css
/* effects/fade-in.css */
[data-effect="fade-in"] {
  opacity: var(--fade-opacity, 1);
  transform: translateY(var(--fade-y, 0));
  transition:
    opacity var(--fade-duration, 600ms) var(--fade-easing, ease-out),
    transform var(--fade-duration, 600ms) var(--fade-easing, ease-out);
  will-change: opacity, transform;
}

@media (prefers-reduced-motion: reduce) {
  [data-effect="fade-in"] {
    transition: none;
  }
}
```

### scale-hover

Scale feedback on hover and press.

**Behaviour:** `scale-hover`

**Variables:**
| Variable | Purpose | Fallback |
|----------|---------|----------|
| `--scale` | Current scale value | `1` |
| `--scale-duration` | Transition duration | `150ms` |
| `--scale-easing` | Timing function | `ease-out` |

```css
/* effects/scale-hover.css */
[data-effect="scale-hover"] {
  transform: scale(var(--scale, 1));
  transition: transform var(--scale-duration, 150ms) var(--scale-easing, ease-out);
  will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
  [data-effect="scale-hover"] {
    transition: none;
  }
}
```

## Usage

### In Widget (L1)

```tsx
// Widget marks animatable elements
function ContactPrompt({ promptText, email }) {
  return (
    <div className="contact-prompt" data-effect="text-reveal">
      <span data-reveal="primary">{promptText}</span>
      <span data-reveal="secondary">{email}</span>
      <span data-reveal="icon"><CopyIcon /></span>
    </div>
  )
}
```

### In Behaviour (L2)

```typescript
// Behaviour computes values for the effect
const textReveal: Behaviour = {
  id: 'text-reveal',
  compute: (state) => ({
    '--reveal-y': state.isHovered ? '-100%' : '0',
    '--reveal-opacity': state.isHovered ? 1 : 0,
    '--reveal-color': state.isHovered ? 'var(--interaction)' : 'white',
    '--reveal-blend': state.isHovered ? 'normal' : 'difference',
    '--reveal-duration': '400ms',
    '--reveal-easing': 'ease-in-out',
  })
}
```

### Importing Effects

Global import in experience provider:

```typescript
// experience/ExperienceProvider.tsx
import './effects/index.css'
```

Or selective import:

```typescript
// Only what's needed
import '@/creativeshire/experience/effects/text-reveal.css'
```

Barrel export:

```css
/* effects/index.css */
@import './text-reveal.css';
@import './fade-in.css';
@import './scale-hover.css';
@import './color-shift.css';
```

## Behaviour-Effect Pairing

Each effect has a corresponding behaviour that computes its variables:

| Effect | Behaviour | Description |
|--------|-----------|-------------|
| `text-reveal` | `text-reveal` | Hover text slide with color shift |
| `fade-in` | `fade-in` | Scroll-triggered entrance |
| `scale-hover` | `scale-hover` | Interactive scale feedback |
| `color-shift` | `color-shift` | Color and blend mode transition |

The pairing is by convention, not enforcement. A behaviour can drive multiple effects if they use compatible variables.

## Integration

| Interacts With | Direction | How |
|----------------|-----------|-----|
| `behaviour` | Receives | CSS variables computed by behaviour |
| `widget` | Targets | Elements marked with `data-effect` |
| `BehaviourWrapper` | Applied by | Wrapper applies variables, effect consumes them |

## Testing

### What to Test

| Test | Method | Why |
|------|--------|-----|
| Variables have fallbacks | CSS inspection | SSR/initial render |
| Reduced motion respected | Media query test | Accessibility |
| Transitions apply | Browser DevTools | Animation works |
| No layout shift | Visual inspection | Fallbacks prevent CLS |

### Validation Checklist

- [ ] All CSS variables have fallbacks
- [ ] `will-change` declared for animated properties
- [ ] `prefers-reduced-motion` media query present
- [ ] Only data-attribute selectors used
- [ ] No layout/structure styles
- [ ] File in `experience/effects/`
- [ ] Exported in `index.css`

---

## Related Documents

- [Behaviour Spec](./behaviour.spec.md) - Computes the CSS variables
- [Experience Layer](../../layers/experience.spec.md) - L2 overview
- [Widget Spec](../content/widget.spec.md) - Uses `data-effect` attributes
