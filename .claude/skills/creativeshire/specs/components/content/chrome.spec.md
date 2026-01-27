# Chrome Spec

> Persistent UI outside page content: regions occupy fixed positions, overlays float above.

## Purpose

Chrome provides persistent UI that exists outside page content. Regions (header, footer, sidebar) occupy fixed screen positions. Overlays (cursor, loader, modals) float above all content. Chrome exists at site level (defaults) and page level (overrides).

## Concepts

| Term | Definition |
|------|------------|
| Region | Persistent UI area (header, footer, sidebar) |
| Overlay | Floating UI above content (cursor, loader, modal) |
| Chrome | Collective term for regions and overlays |
| Resolution | Merge of site defaults with page overrides |
| Portal | React mechanism for rendering overlays above DOM tree |

## Folder Structure

```
creativeshire/components/content/chrome/
├── Chrome.tsx           # Orchestrator component
├── types.ts             # Chrome types and interfaces
├── styles.css           # Base chrome styles
├── regions/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Sidebar.tsx
├── overlays/
│   ├── Cursor.tsx
│   ├── Loader.tsx
│   └── ModalContainer.tsx
└── index.ts             # Barrel exports
```

## Interface

```typescript
// chrome/types.ts
export interface RegionSchema {
  widgets: WidgetSchema[]
  behaviour?: string | BehaviourConfig
  behaviourOptions?: Record<string, any>
}

export interface OverlaySchema {
  trigger?: TriggerCondition
  widget: WidgetSchema
  behaviour?: string | BehaviourConfig
}

export interface ChromeSchema {
  regions: {
    header?: RegionSchema
    footer?: RegionSchema
    sidebar?: RegionSchema
  }
  overlays?: {
    cursor?: OverlaySchema
    loader?: OverlaySchema
    modal?: OverlaySchema
  }
}

export interface PageChromeOverrides {
  regions?: {
    header?: 'inherit' | 'hidden' | RegionSchema
    footer?: 'inherit' | 'hidden' | RegionSchema
    sidebar?: 'inherit' | 'hidden' | RegionSchema
  }
  overlays?: {
    cursor?: 'inherit' | 'hidden' | OverlaySchema
    loader?: 'inherit' | 'hidden' | OverlaySchema
  }
}

// chrome/regions/Header.tsx
export default function Header(props: { schema: RegionSchema }): JSX.Element

// chrome/overlays/Cursor.tsx
export default function Cursor(props: { schema: OverlaySchema }): JSX.Element
```

## Rules

### Must

1. Default export from component files
2. Regions render widgets via `WidgetRenderer`
3. Overlays use React portal to render above content
4. CSS variables have fallbacks
5. Fill designated position (header fills top, footer fills bottom)
6. Props interface in `types.ts`

### Must Not

1. Viewport units (`100vh`, `100vw`, `100dvh`) - BehaviourWrapper handles sizing
2. Scroll/resize listeners - triggers handle this in L2
3. Imports from `experience/` - layer violation
4. `position: fixed/sticky` in component - BehaviourWrapper handles positioning
5. Direct CSS variable manipulation (only READ them)

## Validation Rules

> Each rule maps 1:1 to `chrome.validator.ts`

| # | Rule | Function | Files |
|---|------|----------|-------|
| 1 | Default export required | `checkDefaultExport` | `.tsx` |
| 2 | No scroll/resize listeners | `checkNoScrollListeners` | `.tsx`, `.ts` |
| 3 | No fixed/sticky position | `checkNoPositionFixed` | `.tsx`, `.css` |
| 4 | No viewport units | `checkNoViewportUnits` | `.tsx`, `.css` |
| 5 | No experience imports | `checkNoExperienceImports` | `.tsx`, `.ts` |
| 6 | CSS var fallbacks | `checkCssVariableFallbacks` | `.tsx`, `.css` |

## CSS Variables

> Chrome components READ these (set by driver). Never SET them.

| Variable | Purpose | Fallback |
|----------|---------|----------|
| `--header-y` | Header vertical offset | `0` |
| `--header-opacity` | Header transparency | `1` |
| `--footer-y` | Footer vertical offset | `0` |
| `--footer-opacity` | Footer transparency | `1` |
| `--cursor-x` | Cursor X position | `0` |
| `--cursor-y` | Cursor Y position | `0` |
| `--loader-opacity` | Loader transparency | `1` |

```css
.header {
  transform: translateY(var(--header-y, 0));
  opacity: var(--header-opacity, 1);
}

.footer {
  transform: translateY(var(--footer-y, 0));
  opacity: var(--footer-opacity, 1);
}

.cursor {
  transform: translate(var(--cursor-x, 0), var(--cursor-y, 0));
}

.loader {
  opacity: var(--loader-opacity, 1);
}
```

## Template

```typescript
// regions/Header.tsx
import { WidgetRenderer } from '@/creativeshire/renderer/WidgetRenderer'
import type { RegionSchema } from '../types'
import './styles.css'

interface HeaderProps {
  schema: RegionSchema
}

export default function Header({ schema }: HeaderProps) {
  return (
    <header className="header">
      {schema.widgets.map((widget, index) => (
        <WidgetRenderer key={widget.id ?? index} schema={widget} />
      ))}
    </header>
  )
}
```

```typescript
// overlays/Cursor.tsx
import { createPortal } from 'react-dom'
import { WidgetRenderer } from '@/creativeshire/renderer/WidgetRenderer'
import type { OverlaySchema } from '../types'
import './styles.css'

interface CursorProps {
  schema: OverlaySchema
}

export default function Cursor({ schema }: CursorProps) {
  const content = (
    <div className="cursor">
      <WidgetRenderer schema={schema.widget} />
    </div>
  )

  return createPortal(content, document.body)
}
```

```css
/* styles.css */
.header {
  transform: translateY(var(--header-y, 0));
  opacity: var(--header-opacity, 1);
}

.cursor {
  pointer-events: none;
  transform: translate(var(--cursor-x, 0), var(--cursor-y, 0));
  z-index: 9999;
}
```

## Resolution Logic

Chrome resolves per page using this priority:

```
For each region/overlay:

1. Page says 'hidden'?    -> Don't render
2. Page says 'override'?  -> Use page chrome
3. Page specifies chrome? -> Use page chrome
4. Page says nothing?     -> Use site chrome (inherit)
```

## Anti-Patterns

### Don't: Add position fixed in component

```typescript
// WRONG
export default function Header({ schema }: HeaderProps) {
  return (
    <header style={{ position: 'fixed', top: 0 }}>
      {/* ... */}
    </header>
  )
}
```

**Why:** BehaviourWrapper handles positioning. Chrome components remain position-agnostic.

### Don't: Listen to scroll events

```typescript
// WRONG
export default function Header({ schema }: HeaderProps) {
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
  }, [])
}
```

**Why:** Triggers in L2 handle scroll events. Chrome renders once and stays idle.

### Do: Read CSS variables

```css
/* Correct */
.header {
  transform: translateY(var(--header-y, 0));
}
```

**Why:** Driver sets `--header-y`. Chrome reads it for positioning.

### Do: Use portals for overlays

```typescript
// Correct
return createPortal(content, document.body)
```

**Why:** Portals ensure overlays render above all page content.

## Integration

| Interacts With | Direction | How |
|----------------|-----------|-----|
| `schema/chrome.ts` | Implements | ChromeSchema type |
| `renderer/WidgetRenderer` | Uses | Renders widgets in regions |
| `experience/behaviours` | Reads | CSS variables via driver |
| `site/chrome.ts` | Defaults from | Site-level chrome config |
| `pages` | Overridden by | Page-level chrome config |

## Validator

Validated by: `./chrome.validator.ts`

Rules in "Must/Must Not" map 1:1 to validator checks.
