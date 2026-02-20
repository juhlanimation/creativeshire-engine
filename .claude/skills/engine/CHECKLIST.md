# Component Type Checklists

Comprehensive validation checklists for all Creativeshire Engine component types.
**Verified against codebase on 2026-02-20.**

---

## Quick Reference

| Type | Location | Required Files | Registered In |
|------|----------|----------------|---------------|
| **Primitive** | `widgets/primitives/` | index.tsx, types.ts, styles.css, meta.ts | widgetRegistry |
| **Layout** | `widgets/layout/` | index.tsx, types.ts, styles.css, meta.ts | widgetRegistry |
| **Interactive** | `widgets/interactive/` | index.tsx, types.ts, meta.ts, styles.css? | widgetRegistry |
| **Section** | `sections/patterns/` | index.ts, types.ts, meta.ts | NOT registered |
| **Chrome Pattern** | `chrome/patterns/` | index.ts, types.ts, meta.ts | patternRegistry |
| **Overlay** | `chrome/overlays/` | index.tsx, types.ts, styles.css?, meta.ts | chromeRegistry |
| **Behaviour** | `behaviours/{trigger}/` | {name}.ts | behaviourRegistry |
| **Effect** | `effects/` | {mechanism}.css | index.css |
| **Driver** | `drivers/` | {Name}.ts | index.ts |
| **Trigger** | `triggers/` | use{Name}.ts | index.ts |
| **Preset** | `presets/{name}/` | index.ts, site.ts, pages/*.ts, chrome/*.ts | N/A |

---

## 1. WIDGETS - Primitives

**Location:** `engine/content/widgets/primitives/{PascalCaseName}/`

### Required Files
- [ ] `index.tsx` - React component (memo'd, forwardRef)
- [ ] `types.ts` - Props interface with standard props
- [ ] `styles.css` - Structural CSS with CSS variable mappings
- [ ] `meta.ts` - Component metadata

### Validation Rules
- [ ] No React state (`useState`, `useReducer` forbidden)
- [ ] No `onClick` handlers (except Link for navigation)
- [ ] No `@keyframes` in CSS (animations in L2 effects)
- [ ] No `hooks/` or `store/` folders
- [ ] Props include: `id?`, `className?`, `style?`, `data-behaviour?`

### Registration
- [ ] Exported from `engine/content/widgets/primitives/index.ts`
- [ ] Added to `engine/content/widgets/registry.ts`

### Meta.ts Structure
```typescript
export default defineMeta<TextProps>({
  id: 'Text',                    // PascalCase, matches folder
  name: 'Text',                  // Display name
  description: '...',            // Tooltip
  category: 'primitive',         // Fixed value
  component: true,               // Fixed for primitives
  settings: { /* UI config */ }
})
```

**Current primitives:** Text, Image, Icon, Button, Link

---

## 2. WIDGETS - Layout

**Location:** `engine/content/widgets/layout/{PascalCaseName}/`

### Required Files
- [ ] `index.tsx` - React component using WidgetRenderer
- [ ] `types.ts` - Props interface with `widgets` prop
- [ ] `styles.css` - Layout CSS (flex, grid)
- [ ] `meta.ts` - Component metadata

### Validation Rules
- [ ] Must accept `widgets?: WidgetSchema[]` prop (NOT `children`)
- [ ] No `{children}` or `props.children` in JSX
- [ ] Uses `<WidgetRenderer widgets={widgets} />` to render children
- [ ] No `@keyframes` in CSS
- [ ] No `hooks/` or `store/` folders
- [ ] No internal state
- [ ] Props include: `id?`, `className?`, `style?`, `data-behaviour?`, `data-effect?`

### Registration
- [ ] Exported from `engine/content/widgets/layout/index.ts`
- [ ] Added to `engine/content/widgets/registry.ts`

### Meta.ts Structure
```typescript
export default defineMeta<FlexProps>({
  id: 'Flex',
  category: 'layout',
  component: true,
  // ... rest
})
```

**Current layouts:** Flex, Box, Stack, Grid, Split, Container, Marquee

---

## 3. WIDGETS - Interactive

**Location:** `engine/content/widgets/interactive/{PascalCaseName}/`

### Required Files
- [ ] `index.tsx` - React component with hooks/state
- [ ] `types.ts` - Props interface extending `WidgetBaseProps`
- [ ] `meta.ts` - Component metadata
- [ ] `styles.css` - (optional) Interactive-specific CSS
- [ ] `hooks/` - (optional) Colocated hooks folder

### Validation Rules
- [ ] CAN use `useState`, `useRef`, `useEffect`, `useCallback`
- [ ] Complex event handling allowed
- [ ] Multiple render modes allowed
- [ ] Hooks colocated: `{Widget}/hooks/use{Hook}.ts`
- [ ] Props MUST extend `WidgetBaseProps`
- [ ] May support binding expressions (return null if detected)

### Registration
- [ ] Exported from `engine/content/widgets/interactive/index.ts`
- [ ] Added to `engine/content/widgets/registry.ts`

### Meta.ts Structure
```typescript
export default defineMeta<VideoPlayerProps>({
  id: 'VideoPlayer',
  category: 'interactive',
  component: true,
  // ... rest
})
```

### Binding Expression Pattern
```typescript
// For widgets that delegate to platform for dynamic content
function isBindingExpression(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith('{{')
}

// In component
if (isBindingExpression(props.items)) {
  return null // Platform handles binding expansion
}
```

**Current interactive:** Video, VideoPlayer, EmailCopy

---

## 4. SECTIONS - Patterns

**Location:** `engine/content/sections/patterns/{PascalCaseName}/`

### Required Files
- [ ] `index.ts` - Factory function returning `SectionSchema`
- [ ] `types.ts` - Config interface with props and default styles
- [ ] `meta.ts` - Component metadata
- [ ] NO `styles.css` (preset-specific styling goes in presets)

### Validation Rules
- [ ] Factory pattern: `create{Section}Section(props)`
- [ ] Returns `SectionSchema` object
- [ ] Not a React component
- [ ] Composes widgets and section-level layout
- [ ] Supports binding expressions for dynamic content
- [ ] Uses `__repeat` for array expansion

### Registration
- [ ] NOT registered (sections are factories)
- [ ] Exported from `engine/content/sections/patterns/index.ts`

### Meta.ts Structure
```typescript
export default defineMeta<HeroProps>({
  id: 'Hero',
  category: 'section',
  component: false,
  // ... rest
})
```

### Theme Wiring (MANDATORY for all sections)

Every section must use theme CSS variables for all visual properties. This ensures sections re-skin correctly when switching themes.

- [ ] All colors use CSS variables: `--text-primary`, `--text-secondary`, `--accent`, `--color-primary`, etc.
- [ ] All font-family uses: `var(--font-title)`, `var(--font-paragraph)`, or `var(--font-ui)`
- [ ] All font-size uses scale: `var(--font-size-display)` through `var(--font-size-small)`
- [ ] All spacing uses tokens: `var(--spacing-xs)` through `var(--spacing-2xl)`
- [ ] Section padding uses: `var(--spacing-section-x)` and `var(--spacing-section-y)`
- [ ] All border-radius uses: `var(--radius-sm)`, `var(--radius-md)`, `var(--radius-lg)`
- [ ] All shadows use: `var(--shadow-sm)`, `var(--shadow-md)`, `var(--shadow-lg)`
- [ ] All transitions use: `var(--duration-normal) var(--ease-default)` (or fast/slow variants)
- [ ] Container query units (`cqw`/`cqh`) for responsive sizing, NOT `vw`/`vh`

**NEVER hardcode:**
- Colors (no `#fff`, no `rgb()`, no `hsl()`)
- Font families (no `'Inter'`, no `sans-serif`)
- Font sizes (no `16px`, no `1.2rem`)
- Spacing (no `24px`, no `2rem`) — except structural layout like `width: 50%`, `aspect-ratio: 16/9`

**Allowed hardcoded values:** structural layout (`width: 50%`, `grid-template-columns: 1fr 1fr`), container query breakpoints (`@container (min-width: 768px)`), line-height, max-width constraints, z-index.

See [theme-contract.spec.md](specs/reference/theme-contract.spec.md) for the full variable reference.

### Binding + __repeat Pattern
```typescript
if (isBindingExpression(props.projects)) {
  // Use __repeat for platform expansion
  contentWidget = {
    type: 'Flex',
    widgets: [{
      __repeat: props.projects,  // e.g., '{{ content.projects }}'
      type: 'Box',
      widgets: [
        { type: 'Text', props: { content: '{{ item.title }}' } }
      ]
    }]
  }
}
```

**Current sections:** HeroVideo, HeroTitle, AboutBio, AboutCollage, ContentPricing, ProjectCompare, ProjectExpand, ProjectFeatured, ProjectGallery, ProjectShowcase, ProjectStrip, ProjectTabs, ProjectVideoGrid, TeamShowcase

---

## 5. CHROME - Patterns (Factory Functions)

**Location:** `engine/content/chrome/patterns/{PascalCaseName}/`

### Required Files
- [ ] `index.ts` - Factory function returning region schema
- [ ] `types.ts` - Config interface
- [ ] `meta.ts` - Pattern metadata with `providesActions`

### Validation Rules
- [ ] Factory pattern: composes widgets into region layout
- [ ] No React components (uses widget schemas)
- [ ] Declares `providesActions` for action system integration

### Registration
- [ ] Registered in `engine/content/chrome/pattern-registry.ts`

---

## 6. CHROME - Overlays

**Location:** `engine/content/chrome/overlays/{PascalCaseName}/`

### Required Files
- [ ] `index.tsx` - React component
- [ ] `types.ts` - Props interface
- [ ] `meta.ts` - Component metadata
- [ ] `styles.css` - (optional) Overlay-specific styling
- [ ] `store.ts` - (optional) Zustand store for state

### Validation Rules
- [ ] L1/L2 hybrid (CAN import from `experience/`)
- [ ] React components with state
- [ ] Rendered conditionally (modals, tooltips, indicators)
- [ ] May read from experience store
- [ ] May use GSAP for animations

### Registration
- [ ] Exported from `engine/content/chrome/overlays/index.ts`
- [ ] Added to `engine/content/chrome/registry.ts`

### Meta.ts Structure
```typescript
export default defineMeta<ModalProps>({
  id: 'Modal',
  category: 'overlay',
  component: true,
  // ... rest
})
```

**Current overlays:** CursorLabel, FixedCard, Modal (ModalRoot), NavTimeline, SlideIndicators

---

## 8. BEHAVIOURS

**Location:** `engine/experience/behaviours/{trigger}/{kebab-case-name}.ts`

### Trigger Folders
- `scroll/` - Scroll-based (progress, direction, velocity, collapse, cover-progress)
- `hover/` - Hover state (--hover: 0|1)
- `visibility/` - IntersectionObserver (--visible: 0|1)
- `animation/` - Continuous/looping (marquee, pulse)
- `interaction/` - Click/tap (--active: 0|1)
- `intro/` - Intro-phase behaviours (chrome-reveal, content-reveal, text-reveal, step, scroll-indicator)
- `video/` - Video frame tracking

### Required Structure
- [ ] `{trigger}/{name}.ts` - Behaviour file
- [ ] `{trigger}/index.ts` - Barrel export

### Validation Rules
- [ ] ID format: `trigger/name` (e.g., `scroll/fade`)
- [ ] ID matches folder structure
- [ ] ID is kebab-case
- [ ] Has `requires: string[]` array (state dependencies)
- [ ] Has `compute: (state, options) => Record<string, string>` function
- [ ] Returns CSS variables (--kebab-case names)
- [ ] NO imports from `effects/`
- [ ] NO imports from `content/`
- [ ] Checks `state.prefersReducedMotion` for accessibility

### Behaviour Object Structure
```typescript
const scrollFade: Behaviour = {
  id: 'scroll/fade',
  name: 'Scroll Fade',
  requires: ['sectionVisibility'],
  compute: (state, options) => ({
    '--section-opacity': String(state.sectionVisibility),
  }),
  optionConfig: { /* UI controls */ }
}

registerBehaviour(scrollFade)
export default scrollFade
```

### Registration
- [ ] Self-registers via `registerBehaviour(behaviour)`
- [ ] Import triggers registration in `engine/experience/behaviours/index.ts`

**Current behaviours:** scroll/collapse, scroll/color-shift, scroll/cover-progress, scroll/fade, scroll/fade-out, scroll/image-cycle, scroll/progress, hover/expand, hover/reveal, hover/scale, visibility/center, visibility/fade-in, animation/marquee, interaction/toggle, intro/chrome-reveal, intro/content-reveal, intro/scroll-indicator, intro/step, intro/text-reveal, video/frame

---

## 9. EFFECTS

**Location:** `engine/experience/effects/{mechanism}.css` or `effects/{mechanism}/{variant}.css`

### File Structure
- Single file: `fade.css`
- Folder: `transform/scale.css`, `mask/wipe.css`
- Barrel: `index.css`

### Validation Rules
- [ ] CSS ONLY (no .ts/.tsx files)
- [ ] No `@keyframes` (except animation-specific effects)
- [ ] No widget names in filenames
- [ ] Named by MECHANISM: fade, scale, slide, wipe, reveal
- [ ] Consumes CSS variables from behaviours
- [ ] Uses `[data-effect~="effect-name"]` selector
- [ ] Includes `@media (prefers-reduced-motion)` fallback

### Effect CSS Pattern
```css
/**
 * fade-reveal
 * Fades element based on visibility
 *
 * CSS Variables:
 * - --fade-opacity: Current opacity (0-1)
 */

[data-effect~="fade-reveal"] {
  opacity: var(--fade-opacity, 1);
  transition: opacity var(--fade-duration, 300ms) ease-out;
  will-change: opacity;
}

@media (prefers-reduced-motion: reduce) {
  [data-effect~="fade-reveal"] {
    transition: none;
  }
}
```

### Registration
- [ ] Imported in `effects/index.css`

**Current effects:** color-shift/color-shift.css, emphasis/spin.css, emphasis/pulse.css, fade/fade.css, marquee/marquee-scroll.css, mask/wipe.css, mask/reveal.css, overlay/overlay-darken.css, reveal/clip-path.css, transform/scale.css, transform/slide.css

---

## 10. DRIVERS

**Location:** `engine/experience/drivers/{Name}.ts`

### File Types
- Class: `{Name}Driver.ts` (PascalCase) - Core infrastructure
- Hook: `use{Name}.ts` (camelCase) - React integration
- Factory: `get{Name}.ts` - Singleton pattern
- Provider: `{Name}Provider.tsx` - React context

### Validation Rules
- [ ] Manages infrastructure/complex state
- [ ] Reference counting for cleanup (getDriver/releaseDriver pattern)
- [ ] Container-aware (supports fullpage and contained mode)
- [ ] 60fps optimized (only CSS variable updates, no React re-renders)
- [ ] Types in `types.ts`
- [ ] Exported from `drivers/index.ts`

### Driver Class Pattern
```typescript
export class ScrollDriver {
  private targets = new Map<string, Target>()

  register(target: Target): void { /* ... */ }
  unregister(id: string): void { /* ... */ }
  destroy(): void { /* cleanup listeners */ }
}
```

### Factory Pattern
```typescript
const drivers = new Map<HTMLElement | null, ScrollDriver>()
const refCounts = new Map<HTMLElement | null, number>()

export function getDriver(container: HTMLElement | null): ScrollDriver
export function releaseDriver(container: HTMLElement | null): void
```

**Current drivers:** ScrollDriver, MomentumDriver, getDriver, LenisSmoothScrollProvider, SmoothScrollProvider, SmoothScrollContext, ScrollLockContext, useScrollFadeDriver, useSmoothScrollContainer

---

## 11. TRIGGERS

**Location:** `engine/experience/triggers/use{Name}.ts`

### Validation Rules
- [ ] SSR guard: `if (typeof window === 'undefined') return`
- [ ] Cleans up ALL event listeners in return function
- [ ] Cleans up requestAnimationFrame, timeouts, observers
- [ ] NO imports from `content/`
- [ ] NO imports from `behaviours/`
- [ ] Container-aware (supports containerRef for contained mode)
- [ ] Updates store via `store.setState()`

### Trigger Hook Pattern
```typescript
'use client'

export function useScrollProgress({
  store,
  containerMode,
  containerRef
}: TriggerProps): void {
  useEffect(() => {
    // SSR guard
    if (typeof window === 'undefined') return

    // Container-aware target
    const target = containerMode === 'contained'
      ? containerRef?.current
      : window

    const handler = () => {
      store.setState({ scrollProgress: /* ... */ })
    }

    target?.addEventListener('scroll', handler, { passive: true })

    // Cleanup
    return () => {
      target?.removeEventListener('scroll', handler)
    }
  }, [store, containerMode, containerRef])
}
```

### Registration
- [ ] Exported from `triggers/index.ts`
- [ ] Called by `TriggerInitializer.tsx`

**Current triggers:** useScrollProgress, useIntersection, usePrefersReducedMotion, useViewport, useCursorPosition

---

## 12. PRESETS

**Location:** `engine/presets/{kebab-case-name}/`

### Required Files
- [ ] `index.ts` - Main preset export (`{name}Preset: SitePreset`) + `registerPreset()` call
- [ ] `pages/home.ts` - Home page template
- [ ] `content-contract.ts` - Content contract defining required content fields

### Validation Rules
- [ ] kebab-case folder name
- [ ] Uses binding expressions `{{ content.xxx }}` for all content
- [ ] Site-specific styling ONLY here (not in engine components)
- [ ] Chrome config uses chrome pattern factories (not component references)
- [ ] Registers via `registerPreset()` with metadata

### Preset Structure
```typescript
export const noirPreset: SitePreset = {
  theme: {
    colorTheme: 'contrast',
    scrollbar: { /* ... */ },
    smoothScroll: { /* ... */ },
  },
  experience: { type: 'cover-scroll' },
  chrome: {
    regions: {
      footer: createContactFooterRegion({ /* ... */ })
    },
    overlays: {
      cursorTracker: createCursorTrackerOverlay({ /* ... */ }),
      modal: createVideoModalOverlay()
    }
  },
  pages: {
    home: homePageTemplate
  }
}

registerPreset(noirPreset, noirMeta)
```

**Current presets:** noir, prism, loft, test-multipage

---

## Architecture Rules Summary

### L1/L2 Split
- **L1 (Content):** Renders once. Primitives, layout, patterns, sections, chrome.
- **L2 (Experience):** Animates at 60fps. Behaviours, effects, drivers, triggers.
- **Bridge:** CSS variables only. L1 sets `data-behaviour`/`data-effect`, L2 updates `--var` values.

### Naming Conventions
- **Folders:** PascalCase for components, kebab-case for behaviours/effects
- **Behaviours:** Named by TRIGGER (scroll/, hover/, visibility/)
- **Effects:** Named by MECHANISM (fade, scale, slide, mask/)

### No Backward Compatibility
- Old patterns deleted and replaced, not aliased
- No `BEHAVIOUR_ALIASES` or compatibility layers
- One pattern, applied consistently
