# Section Theme Contract

> Sections and widgets must consume theme CSS variables, never hardcode visual values. This guarantees portability across themes — switching from "dark minimal" to "warm editorial" re-skins every section without touching component code.

---

## Mandatory Variables

### Colors

| Variable | Purpose | Fallback |
|----------|---------|----------|
| `--site-outer-bg` | Page background | none (set by theme) |
| `color` (inherited) | Default text color | none (inherited CSS property) |
| `--text-primary` | Primary text | `color` |
| `--text-secondary` | Muted/secondary text | none |
| `--accent` | Highlight / active color | none |
| `--interaction` | Interactive elements (links, prompts) | none |
| `--color-primary` | Primary button background | none |
| `--color-primary-contrast` | Text on primary button | none |
| `--color-secondary` | Secondary button background | none |
| `--color-secondary-contrast` | Text on secondary button | none |
| `--color-link` | Link color | `--interaction` |
| `--color-focus` | Focus ring | `--accent` |
| `--scrollbar-thumb` | Scrollbar thumb | none |
| `--scrollbar-track` | Scrollbar track | none |
| `--status-success` | Success state | none |
| `--status-error` | Error state | none |

### Typography

| Variable | Purpose | Fallback |
|----------|---------|----------|
| `--font-title` | Display / brand text | `sans-serif` |
| `--font-heading` | Section headings h1–h3 | `var(--font-title)` |
| `--font-paragraph` | Body / paragraph text | `sans-serif` |
| `--font-ui` | UI labels, buttons, nav | `sans-serif` |
| `--font-size-display` | Hero / display text | `6rem` |
| `--font-size-h1` | Page headings | `2.25rem` |
| `--font-size-h2` | Section headings | `1.5rem` |
| `--font-size-h3` | Sub-headings | `1.125rem` |
| `--font-size-body` | Body text | `1rem` |
| `--font-size-small` | Captions / small text | `0.75rem` |
| `--font-weight-display` | Display text weight | `700` |
| `--font-weight-heading` | Heading text weight (h1–h3) | `600` |
| `--font-weight-body` | Body text weight | `400` |
| `--font-weight-small` | Small text weight | `400` |
| `--line-height-display` | Display line height | `1.1` |
| `--line-height-heading` | Heading line height (h1–h3) | `1.2` |
| `--line-height-body` | Body line height | `1.5` |
| `--line-height-small` | Small text line height | `1.4` |
| `--letter-spacing-display` | Display letter spacing | `-0.02em` |
| `--letter-spacing-heading` | Heading letter spacing (h1–h3) | `-0.01em` |
| `--letter-spacing-body` | Body letter spacing | `0em` |
| `--letter-spacing-small` | Small text letter spacing | `0.02em` |

### Spacing

| Variable | Purpose | Fallback |
|----------|---------|----------|
| `--spacing-xs` | Micro — icon gaps, inline elements | `0.25rem` |
| `--spacing-sm` | Small — labels, metadata gaps | `0.5rem` |
| `--spacing-md` | Medium — component internal padding | `1rem` |
| `--spacing-lg` | Large — card padding, section gaps | `2rem` |
| `--spacing-xl` | Extra large — section vertical padding | `4rem` |
| `--spacing-2xl` | 2x extra large — page-level rhythm | `6rem` |
| `--spacing-3xl` | 3x extra large — extreme margins, ultrawide padding | `10rem` |
| `--spacing-section-x` | Section horizontal padding | `clamp(1.5rem, 5cqw, 8rem)` |
| `--spacing-section-y` | Section vertical padding | `clamp(3rem, 6cqw, 6rem)` |

### Radius, Shadows, Borders

| Variable | Purpose | Fallback |
|----------|---------|----------|
| `--radius-none` | No rounding | `0` |
| `--radius-sm` | Subtle rounding | `2px` |
| `--radius-md` | Default rounding | `8px` |
| `--radius-lg` | Pronounced rounding | `16px` |
| `--radius-full` | Pill / circle | `9999px` |
| `--shadow-none` | No shadow | `none` |
| `--shadow-sm` | Subtle — inputs, minor elevation | (theme-defined) |
| `--shadow-md` | Default — cards, dropdowns | (theme-defined) |
| `--shadow-lg` | Strong — modals, overlays | (theme-defined) |
| `--border-width` | Default border width | `1px` |
| `--border-style` | Border line style | `solid` |
| `--border-color` | Border color | (theme-defined) |
| `--border-divider-opacity` | Divider opacity | `0.15` |

### Motion

| Variable | Purpose | Fallback |
|----------|---------|----------|
| `--duration-fast` | Micro interactions (hover, toggle) | `150ms` |
| `--duration-normal` | Default transitions (panels, reveals) | `300ms` |
| `--duration-slow` | Page-level (route transitions, modals) | `500ms` |
| `--ease-default` | Default easing | `ease` |
| `--ease-in` | Enter easing | `ease-in` |
| `--ease-out` | Exit easing | `ease-out` |

### Text Decoration & Interaction

| Variable | Purpose | Fallback |
|----------|---------|----------|
| `--text-decoration-style` | Link underline style | `solid` |
| `--text-decoration-thickness` | Underline thickness | `1px` |
| `--text-decoration-offset` | Underline offset | `4px` |
| `--hover-opacity` | Hover opacity | `0.8` |
| `--active-scale` | Press/active scale | `0.98` |
| `--focus-ring-width` | Focus ring width | `2px` |
| `--focus-ring-offset` | Focus ring offset | `2px` |

---

## Figma ↔ CSS Variable Mapping

Theme tokens are synced to Figma via `scripts/figma-sync.ts`. When designing in Figma, use Figma variables — they map 1:1 to CSS variables in code.

| Figma Variable | CSS Variable | Usage |
|----------------|-------------|-------|
| **Colors** | | |
| `colors/text-primary` | `var(--text-primary)` | Main text |
| `colors/text-secondary` | `var(--text-secondary)` | Muted/secondary text |
| `colors/accent` | `var(--accent)` | Highlights, CTAs |
| `colors/primary` | `var(--color-primary)` | Brand / primary button bg |
| `colors/primary-contrast` | `var(--color-primary-contrast)` | Text on primary button |
| `colors/secondary` | `var(--color-secondary)` | Secondary button bg |
| `colors/secondary-contrast` | `var(--color-secondary-contrast)` | Text on secondary button |
| `colors/interaction` | `var(--interaction)` | Interactive elements |
| `colors/link` | `var(--color-link)` | Link color |
| `colors/background` | `var(--site-outer-bg)` | Page background |
| **Typography** | | |
| `type/font-title` | `var(--font-title)` | Headings / display text |
| `type/font-paragraph` | `var(--font-paragraph)` | Body / paragraph text |
| `type/font-ui` | `var(--font-ui)` | UI labels, buttons, nav |
| `type/scale-display` | `var(--font-size-display)` | Hero headlines |
| `type/scale-h1` | `var(--font-size-h1)` | Page titles |
| `type/scale-h2` | `var(--font-size-h2)` | Section titles |
| `type/scale-h3` | `var(--font-size-h3)` | Subsection titles |
| `type/scale-body` | `var(--font-size-body)` | Body text |
| `type/scale-small` | `var(--font-size-small)` | Captions, metadata |
| `type/weight-display` | `var(--font-weight-display)` | Display text weight |
| `type/weight-heading` | `var(--font-weight-heading)` | Heading text weight |
| `type/weight-body` | `var(--font-weight-body)` | Body text weight |
| `type/weight-small` | `var(--font-weight-small)` | Small text weight |
| `type/line-height-display` | `var(--line-height-display)` | Display line height |
| `type/line-height-heading` | `var(--line-height-heading)` | Heading line height |
| `type/line-height-body` | `var(--line-height-body)` | Body line height |
| `type/line-height-small` | `var(--line-height-small)` | Small text line height |
| `type/letter-spacing-display` | `var(--letter-spacing-display)` | Display letter spacing |
| `type/letter-spacing-heading` | `var(--letter-spacing-heading)` | Heading letter spacing |
| `type/letter-spacing-body` | `var(--letter-spacing-body)` | Body letter spacing |
| `type/letter-spacing-small` | `var(--letter-spacing-small)` | Small text letter spacing |
| **Spacing** | | |
| `spacing/section-x` | `var(--spacing-section-x)` | Section horizontal padding |
| `spacing/section-y` | `var(--spacing-section-y)` | Section vertical padding |
| `spacing/xs` | `var(--spacing-xs)` | Micro — icon gaps |
| `spacing/sm` | `var(--spacing-sm)` | Small — labels, metadata |
| `spacing/md` | `var(--spacing-md)` | Medium — component padding |
| `spacing/lg` | `var(--spacing-lg)` | Large — card padding |
| `spacing/xl` | `var(--spacing-xl)` | Extra large — section gaps |
| `spacing/2xl` | `var(--spacing-2xl)` | 2x extra — page rhythm |
| **Radius** | | |
| `radius/sm` | `var(--radius-sm)` | Subtle rounding |
| `radius/md` | `var(--radius-md)` | Default rounding |
| `radius/lg` | `var(--radius-lg)` | Pronounced rounding |
| `radius/full` | `var(--radius-full)` | Pill / circle |
| **Shadows** | | |
| `shadow/sm` | `var(--shadow-sm)` | Subtle elevation |
| `shadow/md` | `var(--shadow-md)` | Cards, dropdowns |
| `shadow/lg` | `var(--shadow-lg)` | Modals, overlays |
| **Motion** | | |
| `motion/duration-fast` | `var(--duration-fast)` | Micro interactions (hover) |
| `motion/duration-normal` | `var(--duration-normal)` | Default transitions |
| `motion/duration-slow` | `var(--duration-slow)` | Page-level transitions |
| `motion/ease-default` | `var(--ease-default)` | Default easing |

Token sync command: `FIGMA_TOKEN=xxx npx tsx scripts/figma-sync.ts`

---

## Rules

1. **Never hardcode colors.** Use `var(--text-primary)`, `var(--accent)`, etc. Section backgrounds come from the `style.backgroundColor` prop on `SectionSchema`, not CSS.
2. **Never hardcode font-family.** Use `var(--font-title)`, `var(--font-paragraph)`, or `var(--font-ui)`.
3. **Never hardcode font-size.** Use the `var(--font-size-*)` scale. Responsive sizing via `clamp()` with these tokens is fine.
4. **Use spacing tokens** for padding, margin, and gap. `var(--spacing-*)` for component internals, `var(--spacing-section-x)` / `var(--spacing-section-y)` for section-level padding.
5. **Use radius/shadow/border tokens.** `var(--radius-*)`, `var(--shadow-*)`, `var(--border-*)`.
6. **Use motion tokens for transitions.** `transition: opacity var(--duration-normal) var(--ease-default)`.

---

## Exceptions

These values CAN be hardcoded:

| Value | Example | Reason |
|-------|---------|--------|
| Structural layout | `width: 50%`, `aspect-ratio: 16/9`, `z-index: 2` | Not visual identity |
| Container query breakpoints | `@container (min-width: 768px)` | Structural, not theme |
| Max-width constraints | `max-width: 28rem` | Content readability, not theme |
| Grid/flex specifics | `grid-template-columns: 1fr 1fr` | Layout structure |

---

## Reference Pattern

See `engine/content/sections/patterns/PhotoCollage/styles.css` for a section that exclusively uses theme variables for all visual properties.

---

## Architecture Test

`__tests__/architecture/css.test.ts` enforces these rules. It checks for viewport unit violations and site-specific selectors in section CSS. Run `npm run test:arch` to validate.

---

## See Also

- [CSS Variable Catalog](./css-variables.spec.md) — Complete L2 animation variable reference
- [Styling Strategy](./styling.spec.md) — Tailwind vs CSS variable usage
- Source: `engine/themes/types.ts`, `engine/themes/utils.ts`
