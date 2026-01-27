# Section Spec

> Semantic containers that group widgets into coherent page units.

## Purpose

Sections group widgets into semantic containers. Each section has an ID (for anchoring), layout configuration, optional features, and a list of widgets. Sections form the primary structural units of pages.

Sections are Content Layer (L1) components. They render static structure and fill their container. Viewport sizing and scroll-based positioning belong to BehaviourWrapper in L2.

## Concepts

| Term | Definition |
|------|------------|
| Section | Semantic container with ID, layout, and widgets |
| Layout Config | Flex, grid, or stack arrangement |
| Anchor ID | Unique identifier for navigation linking |
| Features | Static styling (spacing, background, typography) |

## Folder Structure

```
creativeshire/components/content/sections/
├── Section.tsx          # Core section component
├── types.ts             # Section types and interfaces
├── styles.css           # Section base styles
└── index.ts             # Barrel exports
```

## Interface

```typescript
// sections/types.ts
export interface SectionSchema {
  id: string
  layout: LayoutConfig
  features?: FeatureSet
  behaviour?: string | BehaviourConfig
  behaviourOptions?: Record<string, any>
  widgets: WidgetSchema[]
}

export interface LayoutConfig {
  type: 'flex' | 'grid' | 'stack'
  direction?: 'row' | 'column'
  align?: 'start' | 'center' | 'end'
  justify?: 'start' | 'center' | 'end' | 'between'
  gap?: number | string
  columns?: number
}

// sections/Section.tsx
export default function Section(props: SectionSchema): JSX.Element
```

## Rules

### Must

1. Default export from `Section.tsx`
2. `id` property for anchor linking
3. `layout` configuration specified
4. `widgets` array contains WidgetSchema objects
5. CSS variables have fallbacks
6. Fill parent container via intrinsic sizing

### Must Not

1. Viewport units (`100vh`, `100vw`, `100dvh`) - BehaviourWrapper handles sizing
2. Scroll/resize listeners - triggers handle this in L2
3. Imports from `experience/` - layer violation
4. `position: fixed/sticky` - BehaviourWrapper handles positioning
5. Use `children` instead of `widgets` array
6. Direct CSS variable manipulation (only READ them)
7. Use `&&` for conditional rendering with numbers (use ternary)
8. Create static JSX inside render (hoist to module scope)

## Validation Rules

> Each rule maps 1:1 to `section.validator.ts`

| # | Rule | Function | Files |
|---|------|----------|-------|
| 1 | Default export required | `checkDefaultExport` | `.tsx` |
| 2 | No scroll/resize listeners | `checkNoScrollListeners` | `.tsx`, `.ts` |
| 3 | No fixed/sticky position | `checkNoPositionFixed` | `.tsx`, `.css` |
| 4 | No viewport units | `checkNoViewportUnits` | `.tsx`, `.css` |
| 5 | No experience imports | `checkNoExperienceImports` | `.tsx`, `.ts` |
| 6 | CSS var fallbacks | `checkCssVariableFallbacks` | `.tsx`, `.css` |
| 7 | Use ternary for conditional numbers | `checkNoAndWithNumbers` | `.tsx` |
| 8 | Static JSX hoisted | `checkStaticJsxHoisted` | `.tsx` |

## CSS Variables

> Sections READ these (set by driver). Never SET them.

| Variable | Purpose | Fallback |
|----------|---------|----------|
| `--section-y` | Vertical offset | `0` |
| `--section-z` | Z-index stacking | `0` |
| `--section-opacity` | Transparency | `1` |

```css
.section {
  transform: translateY(var(--section-y, 0));
  z-index: var(--section-z, 0);
  opacity: var(--section-opacity, 1);
}
```

## Template

```typescript
// Section.tsx
import { SectionSchema } from './types'
import { WidgetRenderer } from '@/creativeshire/renderer/WidgetRenderer'
import './styles.css'

export default function Section({ id, layout, features, widgets }: SectionSchema) {
  return (
    <section id={id} className="section" data-layout={layout.type}>
      {widgets.map((widget, index) => (
        <WidgetRenderer key={widget.id ?? index} schema={widget} />
      ))}
    </section>
  )
}
```

```css
/* styles.css */
.section {
  transform: translateY(var(--section-y, 0));
  z-index: var(--section-z, 0);
  opacity: var(--section-opacity, 1);
}

.section[data-layout="flex"] {
  display: flex;
}

.section[data-layout="grid"] {
  display: grid;
}

.section[data-layout="stack"] {
  display: flex;
  flex-direction: column;
}
```

## Anti-Patterns

### Don't: Use viewport units

```typescript
// WRONG
features: { minHeight: '100vh' }
```

**Why:** Viewport sizing is extrinsic. BehaviourWrapper applies `100dvh`.

### Don't: Import from experience layer

```typescript
// WRONG
import { useScrollProgress } from '@/creativeshire/experience/triggers'
```

**Why:** Section components are static. Animation belongs in behaviours.

### Don't: Use children instead of widgets

```typescript
// WRONG
return { id: 'hero', children: props.children }

// CORRECT
return { id: 'hero', widgets: [...] }
```

**Why:** Sections use `widgets` array. Schema is data, not JSX with children.

### Do: Provide unique IDs

```typescript
// Correct
const section: SectionSchema = {
  id: 'about',
  layout: { type: 'stack', align: 'center', gap: 32 },
  widgets: [...]
}
```

**Why:** IDs enable anchor navigation and section targeting.

## Testing

> **Browser-based validation.** Sections render layout structure — validate visually.

### Testing Approach

| Aspect | Method | Why |
|--------|--------|-----|
| Layout rendering | Browser | CSS layout issues not caught by unit tests |
| Widget composition | Visual inspection | Verify correct widget nesting |
| CSS variable fallbacks | Disable driver, check SSR | Ensure fallbacks work |
| Anchor linking | Manual navigation | Verify `id` attribute works |

### Validation Checklist

When building a section, verify:

- [ ] Renders in browser without errors
- [ ] Layout applies correctly (flex/grid/stack)
- [ ] Widgets render in correct order
- [ ] CSS fallbacks work (section visible without driver)
- [ ] Anchor link (`#section-id`) scrolls to section
- [ ] No viewport units in styles

### Definition of Done

A section is complete when:

- [ ] Renders correctly in browser
- [ ] No console errors/warnings
- [ ] Layout configuration applies
- [ ] TypeScript compiles without errors
- [ ] Validator passes: `npm run validate -- sections/`

---

## Integration

| Interacts With | Direction | How |
|----------------|-----------|-----|
| `schema/section.ts` | Implements | SectionSchema type |
| `renderer/SectionRenderer` | Rendered by | Instantiated from schema |
| `content/widgets/` | Contains | Widget instances |
| `experience/behaviours` | Reads | CSS variables via driver |

## Validator

Validated by: `./section.validator.ts`

Rules in "Must/Must Not" map 1:1 to validator checks.
