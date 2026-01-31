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

## Widget-based vs Component-based

Chrome supports two approaches. **Widget-based is preferred** for clean separation of concerns.

| Approach | Use When | Chrome Responsibility | Content Responsibility |
|----------|----------|----------------------|------------------------|
| **Widget-based** (preferred) | Simple overlays, reusable content | Positioning only | Widget handles content |
| **Component-based** (complex) | Complex regions with internal logic | Everything | N/A |

### Widget-based (Preferred for Overlays)

Chrome = positioning. Widget = content. Clean separation.

```typescript
// site/config.ts - Widget-based overlay
overlays: {
  floatingContact: {
    widget: {
      id: 'contact-cta',
      type: 'HoverReveal',
      props: {
        defaultContent: 'How can I help you?',
        revealedContent: 'hello@example.com',
        iconType: 'copy',
        actionType: 'copy',
      },
    },
    position: 'top-right',  // ChromeRenderer handles positioning
  },
}
```

**ChromeRenderer wraps widget in positioning container and portals to body:**
```html
<!-- Portaled to document.body -->
<div class="chrome-overlay chrome-overlay--top-right">
  <!-- Widget renders here -->
</div>
```

### Transform Context Handling

Chrome overlays use `position: fixed` for viewport-relative positioning. When rendered inside a CSS transform context (e.g., GSAP ScrollSmoother), fixed positioning breaks - the element becomes fixed relative to the transformed ancestor, not the viewport.

**Solution:** ChromeRenderer portals widget-based overlays to `document.body`. This keeps them in the React tree (full context access) while escaping the DOM transform context.

```
React Tree (context flows):     DOM Tree (visual):
───────────────────────────     ──────────────────
SmoothScrollProvider            body
  ChromeRenderer(overlays)        .chrome-overlay (portaled here)
    WidgetRenderer ─────────────► position: fixed works correctly
```

**Key principle:** React tree = context tree. DOM tree = visual tree. Portals decouple them.

Component-based overlays (like Modal) handle their own portals internally.

### Component-based (For Complex Regions)

Use for regions (Footer, Header) that have complex internal structure.

```typescript
// site/config.ts - Component-based region
regions: {
  footer: {
    component: 'Footer',
    props: {
      navLinks: [...],
      contactEmail: 'hello@example.com',
    },
  },
}
```

### Decision Guide

```
Is it an overlay (floating element)?
    │
    ├─ YES → Use widget-based
    │        (ChromeRenderer handles positioning)
    │
    └─ NO (region like header/footer)
           │
           ├─ Simple content? → Widget-based (widgets array)
           │
           └─ Complex with internal logic? → Component-based
```

## Interface

```typescript
// chrome/types.ts
export interface RegionSchema {
  // Widget-based (preferred for simple regions)
  widgets?: WidgetSchema[]
  // Component-based (for complex regions)
  component?: string
  props?: Record<string, SerializableValue>
  // Behaviour for animation
  behaviour?: string | BehaviourConfig
  behaviourOptions?: Record<string, any>
}

export interface OverlaySchema {
  trigger?: TriggerCondition
  // Widget-based (preferred) - ChromeRenderer handles positioning
  widget?: WidgetSchema
  // Component-based (legacy) - component handles positioning
  component?: string
  props?: Record<string, SerializableValue>
  // Position for widget-based overlays
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  behaviour?: string | BehaviourConfig
}

export interface ChromeSchema {
  regions: {
    header?: RegionSchema
    footer?: RegionSchema
    sidebar?: RegionSchema
  }
  overlays?: Record<string, OverlaySchema>
}

export interface PageChromeOverrides {
  regions?: {
    header?: 'inherit' | 'hidden' | RegionSchema
    footer?: 'inherit' | 'hidden' | RegionSchema
    sidebar?: 'inherit' | 'hidden' | RegionSchema
  }
  overlays?: {
    [key: string]: 'inherit' | 'hidden' | OverlaySchema
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
3. `position: fixed/sticky` in component - BehaviourWrapper handles positioning
4. Direct CSS variable manipulation (only READ them)

### Regions vs Overlays: L1/L2 Boundary

**Regions** (Header, Footer, Sidebar) are pure L1:
- Render once, stay idle
- No imports from `experience/`
- Animation via CSS variables set by L2 drivers

**Overlays** (Modal, CursorLabel) are L1/L2 **hybrid**:
- Render UI (L1) but require direct experience access for:
  - **GSAP timeline control**: Modal uses `RevealTransition` for sequenced animations (wipe → content fade) that CSS cannot achieve
  - **Store state**: CursorLabel reads `cursorX`/`cursorY` from experience store
  - **ScrollSmoother control**: Modal pauses/resumes smooth scrolling on open/close

This is an architectural decision: overlays that animate themselves need L2 access.

```
REGION (pure L1)              OVERLAY (L1/L2 hybrid)
─────────────────             ─────────────────────
Header, Footer, Sidebar       Modal, CursorLabel, Tooltip

Renders content               Renders content (L1)
CSS vars for animation        + Controls animation (L2)
No experience imports         May import experience/
```

## Validation Rules

> Each rule maps 1:1 to `chrome.validator.ts`

| # | Rule | Function | Files | Scope |
|---|------|----------|-------|-------|
| 1 | Default export required | `checkDefaultExport` | `.tsx` | All |
| 2 | No scroll/resize listeners | `checkNoScrollListeners` | `.tsx`, `.ts` | All |
| 3 | No fixed/sticky position | `checkNoPositionFixed` | `.tsx`, `.css` | All |
| 4 | No viewport units | `checkNoViewportUnits` | `.tsx`, `.css` | All |
| 5 | No experience imports | `checkNoExperienceImports` | `.tsx`, `.ts` | **Regions only** |
| 6 | CSS var fallbacks | `checkCssVariableFallbacks` | `.tsx`, `.css` | All |

**Note:** Rule #5 applies to regions only. Overlays are L1/L2 hybrid and may import from experience/.

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
