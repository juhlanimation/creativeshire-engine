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
engine/content/chrome/
├── types.ts             # Chrome types and interfaces
├── registry.ts          # Overlay component registry
├── pattern-registry.ts  # Chrome pattern metadata registry
├── patterns/            # Factory functions → WidgetSchema (regions AND overlays)
│   ├── MinimalNav/      # Header pattern
│   ├── FixedNav/        # Header pattern
│   ├── CenteredNav/     # Header pattern
│   ├── ContactFooter/   # Footer pattern
│   ├── BrandFooter/     # Footer pattern
│   ├── FloatingContact/ # Overlay pattern
│   ├── CursorTracker/   # Overlay pattern
│   └── VideoModal/      # Overlay pattern
├── overlays/            # React components (need state)
│   ├── CursorLabel/
│   ├── Modal/
│   ├── SlideIndicators/
│   ├── NavTimeline/
│   └── FixedCard/
└── index.ts             # Barrel exports
```

## Pattern Settings Principle

Chrome patterns define **chrome-level layout** (positioning, overlay mode, constrained, direction) and **content props** (binding expressions for CMS data). Widget visual settings (blendMode, color) and behaviour options (flipDuration, fadeDuration) belong on the widget/behaviour metas, not on the chrome pattern meta.

This mirrors section patterns: Hero doesn't re-declare Text font settings. FloatingContact doesn't re-declare ContactPrompt blend settings.

```
Chrome Pattern Meta Settings:
  ✅ Content props (promptText, email, navLinks) — same as section content
  ✅ Chrome layout (overlay, position, constrained, direction, collapsible)
  ❌ Widget visual settings (blendMode, color, fontSize)
  ❌ Behaviour options (flipDuration, fadeDuration) — belong on the behaviour
```

## Patterns-Only Architecture

Regions (header, footer) use **widget-based patterns only** — factory functions that return WidgetSchema trees.
This matches how sections work and keeps a single authoring model.

Overlays may use either:
- **Widget-based patterns** (e.g., FloatingContact) — ChromeRenderer handles positioning
- **React components** (e.g., Modal, CursorLabel) — for overlays needing React state

### Region Pattern Example

```typescript
// patterns/FixedNav/index.ts
export function createFixedNavRegion(props: FixedNavProps): PresetRegionConfig {
  return {
    overlay: true,
    widgets: [{
      id: 'fixed-nav',
      type: 'Flex',
      className: 'header-chrome',
      widgets: [
        { id: 'header-brand', type: 'Box', ... },
        { id: 'header-nav', type: 'Flex', ... },
      ],
    }],
  }
}
```

### Decision Guide

```
Is it a region (header/footer)?
    └─ Always widget-based pattern (factory → WidgetSchema)

Is it an overlay?
    ├─ Needs React state? → Component (Modal, CursorLabel)
    └─ Static/simple? → Widget-based pattern (FloatingContact)
```

## Interface

```typescript
// schema/chrome.ts
export interface RegionSchema {
  widgets?: WidgetSchema[]
  style?: CSSProperties
  constrained?: boolean
  overlay?: boolean
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  direction?: 'horizontal' | 'vertical'
  collapsible?: boolean
  behaviour?: BehaviourConfig
  behaviourOptions?: Record<string, SerializableValue>
  disabledPages?: string[]
}

export interface OverlaySchema {
  trigger?: TriggerCondition
  widget?: WidgetSchema          // Widget-based
  component?: string             // Component-based (for React state)
  props?: Record<string, SerializableValue>
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  behaviour?: BehaviourConfig
  disabledPages?: string[]
}

export interface ChromeSchema {
  regions: {
    header?: RegionSchema
    footer?: RegionSchema
  }
  overlays?: Record<string, OverlaySchema>
}
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

## Action-Driven Overlays

Overlays can be activated by the action system instead of CSS selectors or polling.

### Pattern: `providesActions`

Chrome pattern metas declare which actions they provide:

```typescript
// CursorTracker meta
providesActions: ['{key}.show', '{key}.hide']

// VideoModal meta
providesActions: ['{key}.open']
```

The `{key}` template resolves to the overlay key at runtime. ChromeRenderer passes `overlayKey` to component-based overlays.

### CursorLabel Activation

CursorLabel uses action-based activation:
- Widget dispatches `{overlayKey}.show` on mouseenter
- Widget dispatches `{overlayKey}.hide` on mouseleave
- CursorLabel registers these actions on mount
- Position reads from experience store (`cursorX`, `cursorY`)

For inline usage (e.g., ExpandRowImageRepeater renders CursorLabel directly), use the `active` prop to bypass the action system.

### Section Required Overlays

Section metas declare `requiredOverlays` to lock overlays in the authoring UI:

```typescript
requiredOverlays: ['VideoModal']
```

See: [action-system.spec.md](action-system.spec.md)

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

### Region Pattern (widget-based)

```typescript
// patterns/FixedNav/index.ts
import type { PresetRegionConfig } from '../../../../presets/types'
import type { FixedNavProps } from './types'
import './styles.css'

export function createFixedNavRegion(props: FixedNavProps): PresetRegionConfig {
  return {
    overlay: true,
    widgets: [{
      id: 'fixed-nav',
      type: 'Flex',
      props: {},
      className: 'header-chrome',
      widgets: [
        { id: 'header-brand', type: 'Box', props: {}, className: 'header-chrome__brand', widgets: [...] },
        { id: 'header-nav', type: 'Flex', props: {}, className: 'header-chrome__nav', widgets: [...] },
      ],
    }],
  }
}
```

### Overlay Component (React state)

```typescript
// overlays/CursorLabel/index.tsx
export default function CursorLabel({ overlayKey, ...props }: CursorLabelProps) {
  // Register actions, read store state, render UI
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
