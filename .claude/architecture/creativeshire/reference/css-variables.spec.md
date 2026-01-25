# CSS Variable Catalog

> Definitive list of CSS custom properties used in Creativeshire.

---

## Naming Convention

`--cs-{layer}-{scope}-{property}` or `--{property}` for global animation variables.

| Layer | Prefix | Example |
|-------|--------|---------|
| Experience (animation) | `--` (no prefix) | `--y`, `--opacity`, `--scale` |
| Experience (section) | `--section-` | `--section-y`, `--section-z` |
| Experience (behaviour-specific) | `--{behaviour}-` | `--depth-y`, `--fade-opacity` |
| Content (component) | `--{component}-` | `--card-opacity`, `--hero-y` |
| Chrome (region/overlay) | `--{region}-` | `--header-y`, `--cursor-x` |
| Theme (system) | `--{semantic}` | `--background`, `--primary` |

---

## CSS Variable Contract

| Rule | Reason |
|------|--------|
| Always use fallbacks: `var(--x, fallback)` | SSR safety - prevents layout shift |
| Only `setProperty()` for `--prefixed` keys | Type-safe, no property clobbering |
| Drivers WRITE, widgets/sections READ | Clear data flow direction |
| Values are strings | CSS compatibility |

---

## Variables by Component Type

### Animation Variables (Global)

> Set by behaviours/drivers, consumed by any widget CSS.

| Variable | Range | Fallback | Set By | Consumed By | Description |
|----------|-------|----------|--------|-------------|-------------|
| `--y` | `0` to `containerHeight` | `0` | depth-layer, scroll behaviours | Widget CSS | Vertical offset (px multiplier) |
| `--x` | px value | `0` | horizontal behaviours | Widget CSS | Horizontal offset (px multiplier) |
| `--opacity` | `0` to `1` | `1` | fade-on-scroll, depth-layer | Widget CSS | Element visibility |
| `--scale` | `0.8` to `1.2` | `1` | zoom behaviour | Widget CSS | Transform scale |
| `--rotate` | `-15` to `15` | `0deg` | tilt behaviour | Widget CSS | Rotation (deg) |
| `--blur` | `0` to `10` | `0px` | depth-layer behaviour | Widget CSS | Blur amount (px multiplier) |
| `--z-index` | `0` to `sectionCount` | `0` | scroll-stack behaviour | Widget CSS | Stacking order |
| `--clip-top` | `0%` to `100%` | `0%` | mask-reveal behaviour | Widget CSS | Top clip percentage |
| `--clip-bottom` | `0%` to `100%` | `0%` | mask-reveal behaviour | Widget CSS | Bottom clip percentage |

**CSS usage pattern:**

```css
.widget-wrapper {
  transform: translateY(calc(var(--y, 0) * 1px)) scale(var(--scale, 1));
  opacity: var(--opacity, 1);
  z-index: var(--z-index, 0);
  filter: blur(calc(var(--blur, 0) * 1px));
}
```

---

### Section Variables

> Set by section behaviours (scroll-stack), consumed by Section CSS.

| Variable | Range | Fallback | Set By | Description |
|----------|-------|----------|--------|-------------|
| `--section-y` | vh value | `0` | scroll-stack | Section vertical position |
| `--section-z` | integer | `0` | scroll-stack | Section stacking order |
| `--section-opacity` | `0` to `1` | `1` | scroll-stack | Section visibility |

**CSS usage pattern:**

```css
.section {
  transform: translateY(var(--section-y, 0));
  z-index: var(--section-z, 0);
  opacity: var(--section-opacity, 1);
}
```

---

### Behaviour-Specific Variables

> Prefixed with behaviour name for isolation.

| Variable | Range | Fallback | Behaviour | Description |
|----------|-------|----------|-----------|-------------|
| `--depth-y` | px value | `0` | depth-layer | Parallax depth offset |
| `--clip-progress` | `0` to `100` | `100` | mask-reveal | Clip mask progress |
| `--fade-opacity` | `0` to `1` | `1` | fade-on-scroll | Fade effect opacity |
| `--my-value` | computed | `0` | custom behaviours | Template variable |

**CSS usage pattern:**

```css
.widget[data-behaviour="depth-layer"] {
  transform: translateY(calc(var(--depth-y, 0) * 1px));
  will-change: transform;
}
```

---

### Chrome Variables

> Set by chrome behaviours, consumed by chrome component CSS.

#### Header

| Variable | Range | Fallback | Description |
|----------|-------|----------|-------------|
| `--header-y` | px value | `0` | Header vertical offset |
| `--header-opacity` | `0` to `1` | `1` | Header transparency |

#### Footer

| Variable | Range | Fallback | Description |
|----------|-------|----------|-------------|
| `--footer-y` | px value | `0` | Footer vertical offset |
| `--footer-opacity` | `0` to `1` | `1` | Footer transparency |

#### Cursor (Overlay)

| Variable | Range | Fallback | Description |
|----------|-------|----------|-------------|
| `--cursor-x` | px value | `0` | Cursor X position |
| `--cursor-y` | px value | `0` | Cursor Y position |

#### Loader (Overlay)

| Variable | Range | Fallback | Description |
|----------|-------|----------|-------------|
| `--loader-opacity` | `0` to `1` | `1` | Loader transparency |

**CSS usage pattern:**

```css
.header {
  transform: translateY(var(--header-y, 0));
  opacity: var(--header-opacity, 1);
}

.cursor {
  transform: translate(var(--cursor-x, 0), var(--cursor-y, 0));
}
```

---

### Widget-Scoped Variables

> Prefixed with widget name for component isolation.

| Variable | Range | Fallback | Widget | Description |
|----------|-------|----------|--------|-------------|
| `--card-opacity` | `0` to `1` | `1` | Card | Card visibility |
| `--card-y` | px value | `0` | Card | Card vertical offset |
| `--card-scale` | `0.9` to `1` | `1` | Card | Card scale |
| `--card-z-index` | integer | `1` | Card | Card stacking |
| `--hero-opacity` | `0` to `1` | `1` | HeroImage | Hero fade effect |
| `--hero-y` | px value | `0px` | HeroImage | Hero vertical offset |
| `--reveal-opacity` | `0` to `1` | `0` | Reveal widgets | Reveal animation opacity |
| `--reveal-y` | px value | `40px` | Reveal widgets | Reveal animation offset |
| `--credits-opacity` | `0` to `1` | `1` | CreditsCard | Credits fade effect |
| `--divider-color` | color | `#e5e7eb` | Divider | Line color |
| `--divider-thickness` | px value | `1px` | Divider | Line width |
| `--button-hover-color` | color | `currentColor` | Button | Hover state color |

---

### Theme Variables

> System-level variables in `globals.css`. Not animated by drivers.

| Variable | Purpose | Light Default | Dark Default |
|----------|---------|---------------|--------------|
| `--background` | Page background | `oklch(1 0 0)` | `oklch(0.145 0 0)` |
| `--foreground` | Primary text | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| `--primary` | Action color | defined | defined |
| `--primary-foreground` | Text on primary | defined | defined |
| `--muted` | Secondary surfaces | defined | defined |
| `--muted-foreground` | Text on muted | defined | defined |
| `--border` | Border color | defined | defined |
| `--ring` | Focus ring color | defined | defined |
| `--radius` | Border radius base | `0.5rem` | `0.5rem` |

**Tailwind theme mapping:**

```css
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

---

### Hydration Variables

> Special variables for client-only values.

| Variable | Set By | Description |
|----------|--------|-------------|
| `--initial-scroll` | Inline script | Scroll position before hydration |

---

## Data Attributes for Initialization

| Attribute | Purpose |
|-----------|---------|
| `data-behaviour="{id}"` | Identifies which behaviour wraps element |
| `data-initialized` | Present after driver registers (enables transitions) |
| `data-widget="{name}"` | Widget type identifier |
| `data-layout="{type}"` | Section layout type |

---

## Reserved Ranges

| Prefix | Reserved For | Owner |
|--------|--------------|-------|
| `--section-*` | Section positioning | scroll-stack behaviour |
| `--header-*` | Header chrome | Header behaviour |
| `--footer-*` | Footer chrome | Footer behaviour |
| `--cursor-*` | Cursor overlay | Cursor trigger/behaviour |
| `--loader-*` | Loader overlay | Loader behaviour |
| `--depth-*` | Depth-based parallax | depth-layer behaviour |
| `--clip-*` | Clip/mask effects | mask-reveal behaviour |
| `--fade-*` | Fade effects | fade-on-scroll behaviour |

---

## Adding New Variables

Follow the [Extension Principle](../core/extension.spec.md):

1. **Check catalog** - Does a variable already serve this purpose?
2. **Check similar** - Can an existing variable's range expand?
3. **Create if needed** - Add to this catalog with all fields
4. **Use fallback** - Always provide SSR-safe default

**Naming rules:**

| Scope | Pattern | Example |
|-------|---------|---------|
| Global animation | `--{property}` | `--y`, `--opacity` |
| Behaviour-scoped | `--{behaviour}-{property}` | `--depth-y` |
| Component-scoped | `--{component}-{property}` | `--card-opacity` |
| Chrome-scoped | `--{region}-{property}` | `--header-y` |
| Theme token | `--{semantic-name}` | `--background`, `--primary` |

---

## Anti-Patterns

| Pattern | Problem | Correct |
|---------|---------|---------|
| `--scroll` | No prefix, conflicts | `--section-y` or `--depth-y` |
| `--cs-component-x` | Wrong prefix convention | `--card-x` |
| `var(--opacity)` | Missing fallback | `var(--opacity, 1)` |
| `element.style.transform = ...` | Direct style assignment | `setProperty('--y', value)` |
| Setting CSS vars in widgets | Wrong data flow | Widgets READ only |
| `--y` with fallback `0px` | Unit mismatch | `var(--y, 0)` then multiply: `calc(var(--y, 0) * 1px)` |

---

## CSS Template Pattern

Behaviours define `cssTemplate` with variables and fallbacks:

```typescript
const behaviour: Behaviour = {
  id: 'example',
  compute: (state) => ({
    '--y': state.scrollProgress * 100,
    '--opacity': 1 - state.scrollProgress
  }),
  cssTemplate: `
    transform: translateY(calc(var(--y, 0) * 1px));
    opacity: var(--opacity, 1);
    will-change: transform, opacity;
  `
}
```

**Rules:**
1. Every variable in `compute()` output must appear in `cssTemplate`
2. Every variable in `cssTemplate` must have a fallback
3. Animated properties need `will-change` declaration
4. Use `calc()` for unit multiplication: `calc(var(--y, 0) * 1px)`

---

## Validation Checklist

| # | Rule | Validator |
|---|------|-----------|
| 1 | All CSS variables have fallbacks | `checkCssVariableFallbacks` |
| 2 | Behaviours return `--prefixed` keys only | `checkCssVariablePrefix` |
| 3 | Drivers use `setProperty()` only | `checkSetPropertyOnly` |
| 4 | Widgets/sections do not SET variables | `checkNoSetProperty` |
| 5 | cssTemplate includes all computed variables | `checkCssTemplateComplete` |
| 6 | cssTemplate has will-change for animated props | `checkWillChange` |

---

## See Also

- [Behaviour Spec](../components/experience/behaviour.spec.md) - CSS variable computation
- [Driver Spec](../components/experience/driver.spec.md) - Applying CSS variables to DOM
- [Widget Spec](../components/content/widget.spec.md) - CSS variable consumption
- [Hydration Spec](../patterns/hydration.spec.md) - Fallback patterns
- [Styling Spec](./styling.spec.md) - Tailwind + CSS variable integration
