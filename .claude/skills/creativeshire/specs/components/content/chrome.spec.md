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

## Testing

> **Browser-based validation.** Chrome components are persistent UI — validate visually.

### Testing Approach

| Aspect | Method | Why |
|--------|--------|-----|
| Region positioning | Browser | Fixed positioning must be visual |
| Overlay portals | Browser | Portal rendering needs real DOM |
| CSS variable fallbacks | Disable driver | Ensure chrome visible without driver |
| Resolution logic | Unit test | Merge logic is pure function |

### What to Unit Test

| Test | Location |
|------|----------|
| Chrome resolution | `chrome/resolve.test.ts` |
| Inherit/hidden logic | `chrome/resolve.test.ts` |

### Test Template (Resolution Logic)

```typescript
// chrome/resolve.test.ts
import { describe, it, expect } from 'vitest'
import { resolveChrome } from './resolve'

describe('resolveChrome', () => {
  it('uses site chrome when page has no overrides', () => {
    const site = { regions: { header: { widgets: [] } } }
    const page = {}

    const result = resolveChrome(site, page)
    expect(result.regions.header).toEqual(site.regions.header)
  })

  it('hides region when page says hidden', () => {
    const site = { regions: { header: { widgets: [] } } }
    const page = { regions: { header: 'hidden' } }

    const result = resolveChrome(site, page)
    expect(result.regions.header).toBeUndefined()
  })

  it('uses page override when provided', () => {
    const site = { regions: { header: { widgets: [{ type: 'Logo' }] } } }
    const page = { regions: { header: { widgets: [{ type: 'Nav' }] } } }

    const result = resolveChrome(site, page)
    expect(result.regions.header?.widgets[0].type).toBe('Nav')
  })
})
```

### Validation Checklist

- [ ] Header renders at top of viewport
- [ ] Footer renders at bottom of viewport
- [ ] Overlays render above all content (z-index)
- [ ] Portals attach to document.body
- [ ] CSS fallbacks work without driver

### Definition of Done

A chrome component is complete when:

- [ ] Renders in correct position
- [ ] No console errors
- [ ] Resolution logic tested (if applicable)
- [ ] Validator passes: `npm run validate -- chrome/`

---

## Accessibility

### Landmark Regions

Use semantic elements with ARIA roles:

| Region | Element | Role | Additional |
|--------|---------|------|------------|
| Header | `<header>` | `banner` | Contains `<nav aria-label="Main navigation">` |
| Footer | `<footer>` | `contentinfo` | - |
| Sidebar | `<aside>` | `complementary` | `aria-label="Sidebar"` |

### Skip Links

```typescript
// Chrome.tsx - Provide keyboard skip navigation
<a href="#main-content" className="skip-link">Skip to main content</a>
<Header schema={resolved.regions.header} />
<main id="main-content" tabIndex={-1}>{/* Page content */}</main>
```

```css
.skip-link { position: absolute; top: -40px; z-index: 10000; }
.skip-link:focus { top: 0; }
```

### Modal Focus Trapping

Modals must:
1. Store previous focus on open
2. Focus the modal container
3. Trap Tab cycling within focusable elements
4. Close on Escape
5. Restore previous focus on close
6. Use `role="dialog"`, `aria-modal="true"`, `aria-labelledby`

### Overlay Accessibility

| Overlay | ARIA | Why |
|---------|------|-----|
| Cursor | `aria-hidden="true"` `role="presentation"` | Decorative, hide from AT |
| Loader | `role="status"` `aria-live="polite"` `aria-busy` | Announce state changes |

### Validation Rules (Accessibility)

| # | Rule | Function | Files |
|---|------|----------|-------|
| 7 | Header has role="banner" | `checkHeaderLandmark` | `Header.tsx` |
| 8 | Footer has role="contentinfo" | `checkFooterLandmark` | `Footer.tsx` |
| 9 | Skip link present | `checkSkipLink` | `Chrome.tsx` |
| 10 | Modals have aria-modal | `checkModalAccessibility` | `ModalContainer.tsx` |
| 11 | Decorative overlays aria-hidden | `checkOverlayHidden` | `Cursor.tsx` |

---

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
